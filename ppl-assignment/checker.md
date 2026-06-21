# Static Checker Documentation

This document provides a deep dive into the semantic analysis logic found in `static_checker.py`. The Static Checker is responsible for validating the Abstract Syntax Tree (AST) after parsing but before code generation.

---

## 1. Core Architecture

### Symbol Management
The checker uses three primary storage structures to keep track of definitions:
- **`self.structs`**: A global map of struct names to their field layouts.
- **`self.funcs`**: A global map of function signatures (name, parameters, return type).
- **`self.scopes`**: A stack (list) of dictionaries. Each dictionary represents a scope (global, function, or block).

### The "Auto" Challenge
TyC allows variables and function return types to be marked as `auto`. The checker solves this using a "Lazy Binding" strategy:
1. **Unknown Type**: When an `auto` symbol is first seen, it is assigned an `UnknownType`.
2. **Inference**: As the checker encounters usage (e.g., an assignment or a return), it tries to replace the `UnknownType` with a concrete type.
3. **Validation**: At the end of a scope, if an `auto` variable is still `UnknownType`, it raises a `TypeCannotBeInferred` error.

---

## 2. Visitor Methods

### `visit_program`
- **Logic**: Iterates through all top-level declarations.
- **Steps**:
    1. First, it processes all `StructDecl` to allow functions to use them as types.
    2. Then, it processes all `FuncDecl` and `VarDecl`.
- **Rationale**: Top-level symbols must be collected first to support "Forward Referencing" (calling a function defined later in the file).

### `visit_func_decl`
- **Logic**: Manages the lifecycle of a function's semantic check.
- **Steps**:
    1. **Signature Registration**: Adds the function to `self.funcs`.
    2. **Return Type Prepass**: If return is `auto`, it scans the body quickly to find the first `return <expr>` to determine the type early.
    3. **Parameter Scope**: Creates the first level of `self.scopes` containing parameters.
    4. **Body Visit**: Visits the function body.
    5. **Post-Visit Inference**: If the function was `auto` but no `return` was found, it defaults to `VoidType`.
- **Rationale**: Ensuring the return type is known as soon as possible allows recursive functions to be type-checked correctly.

### `visit_block_stmt`
- **Logic**: Handles nested scopes.
- **Steps**:
    1. **Enter Scope**: Pushes a new empty dictionary onto `self.scopes`.
    2. **Statement Visit**: Visits every statement in the block.
    3. **Uninferred Check**: Before exiting, it checks if any `auto` variables in this specific scope are still unknown.
    4. **Exit Scope**: Pops the dictionary.
- **Rationale**: Variables declared in a block should not "leak" outside. The "Uninferred Check" ensures that every `auto` variable actually gets a type before its scope ends.

### `visit_var_decl`
- **Logic**: Binds a name to a type in the current scope.
- **Steps**:
    1. **Redeclaration Check**: Ensures the name doesn't exist in the current innermost scope.
    2. **Initializer Analysis**: If an initializer exists, it determines the type.
    3. **Type Binding**:
        - If variable is `auto`, it takes the initializer's type.
        - If variable is explicit, it checks if the initializer matches.
- **Rationale**: TyC prohibits redeclaring variables in the same scope but allows "shadowing" (declaring a variable with the same name in a deeper nested scope).

### `visit_identifier`
- **Logic**: Resolves a name to a type.
- **Steps**:
    1. **Lookup**: Searches `self.scopes` from top (innermost) to bottom (outermost).
    2. **Result**: Returns the current type of the variable.
- **Rationale**: This implements the standard lexical scoping rules.

### `visit_member_access` (e.g., `p.x`)
- **Logic**: Resolves field access in structs.
- **Steps**:
    1. **Object Type**: Visits the object (e.g., `p`) to get its type.
    2. **Struct Verification**: Ensures the object is indeed a `StructType`.
    3. **Field Lookup**: Looks up the field name in the struct's member map.
- **Rationale**: Prevents accessing fields on non-struct types or accessing non-existent fields.

### `visit_assign_expr`
- **Logic**: The primary driver for type inference.
- **Steps**:
    1. **LHS & RHS Visit**: Gets types for both sides.
    2. **Bidirectional Inference**:
        - If LHS is `auto`, it takes the RHS type.
        - If RHS is a `StructLiteral`, it uses the LHS type to validate the literal's fields.
    3. **Compatibility Check**: Ensures types match if both are known.
- **Rationale**: This is where most `auto` variables finally receive their concrete types.

---

## 3. Helpers

### `_lookup_variable(name)`
Iterates through `self.scopes` in reverse order. This is the heart of scope resolution.

### `_assert_type_match(actual, expected, node)`
The central "Police" of the checker. It compares two types and raises `TypeMismatch` if they differ. It also handles "Type Promotion" logic (e.g., can an `int` be assigned to a `float`?) if the language allows it.

### `_infer_and_bind_type(value, expected)`
If `value` is an `UnknownType` (from an `auto` declaration) and `expected` is known, this method permanently updates the symbol's type in the symbol table.

---

## 4. Error Messages

- **`Redeclared`**: You tried to define `x` twice in the same block.
- **`UndeclaredIdentifier`**: You used `x` before declaring it.
- **`TypeCannotBeInferred`**: You declared `auto x;` but never assigned a value to it, so the compiler doesn't know what it is.
- **`TypeMismatchInExpression`**: You tried to do something illegal like `10 + "hello"`.
- **`MustInLoop`**: You used `break` or `continue` outside of a `while` or `for` loop.
