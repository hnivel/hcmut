# Code Generation Documentation

This document explains how the code generation functions in `codegen.py` work, step-by-step, with examples of the actual source code, the generated Jasmin bytecode, and the **rationale** behind each pattern.

## Core Concepts
- **Frame**: An object that tracks the internal state of a single function during code generation. It manages:
    - **Labels**: Generates unique labels and tracks scope-specific labels (start, end, break, continue).
    - **Operand Stack**: Simulates stack operations (`push`, `pop`) to calculate the `.limit stack` directive.
    - **Local Variables**: Assigns indices to local variables and calculates the `.limit locals` directive.
    - **Scopes & Loops**: Manages nested scopes and loop control flow using stacks.
- **Emitter**: Handles the actual emission of Jasmin bytecode strings.
- **SubBody**: A context container used for processing **statements**. It holds:
    - `frame`: The current function's `Frame`.
    - `sym`: A list of `Symbol`s (the symbol table) visible in the current scope.
    - **Scoping**: When entering a block, a new `SubBody` is created with a shallow copy of the symbol list (`o.sym[:]`). This ensures that variables declared inside a block do not leak to the outer scope.
- **Access**: A context container used for evaluating **expressions**. In addition to `frame` and `sym`, it includes:
    - `is_left`: A boolean flag indicating if the expression is a **Left-Hand Side (LHS)** (assignment target).
    - `is_first`: Used in specific patterns (like struct initialization) to handle initialization vs. assignment logic.
---

## The `Frame` Class Reference

The `Frame` object is essential for tracking JVM constraints. Below are its primary methods:

### Label Management
- `get_new_label()`: Returns a new unique integer to be used as a label (e.g., `Label0`).
- `get_start_label()` / `get_end_label()`: Returns the start/end labels of the **current scope**.
- `get_continue_label()` / `get_break_label()`: Returns the labels of the **innermost loop** for `continue` and `break` statements.

### Variable & Index Management
- `get_new_index()`: Allocates the next available local variable index and updates `max_index`.
- `get_max_index()`: Returns the total number of local slots used (used for `.limit locals`).
- `get_curr_index()` / `set_curr_index(index)`: Gets or sets the current local variable index pointer.

### Operand Stack Simulation
- `push()`: Increments the current stack size and updates `max_op_stack_size`.
- `pop()`: Decrements the current stack size. Throws an error if the stack is empty.
- `get_stack_size()`: Returns current number of elements on the stack.
- `get_max_op_stack_size()`: Returns the maximum depth reached by the stack (used for `.limit stack`).
- `check_op_stack()`: Ensures the stack is empty at the end of a statement (to prevent stack leaks).

### Scope Control
- `enter_scope(is_proc)`: Pushes new start/end labels and saves the current index onto stacks. If `is_proc` is True (for function entry), it resets the stack and index counters.
- `exit_scope()`: Pops the labels and restores the local index to the state before entering the scope.
- `enter_loop()`: Pushes new `continue` and `break` labels onto the loop stacks.
- `exit_loop()`: Pops the loop labels.

---

## The `SubBody` & `Access` Class Reference

These classes are data containers used to pass state through the visitor.

### `SubBody`
Used primarily in `visit` methods for **statements** (e.g., `visit_block_stmt`, `visit_if_stmt`).
- **`frame` (Frame)**: The current function's Frame object.
- **`sym` (List[Symbol])**: The current list of visible symbols.
- **Behavior**: When entering a new block, a new `SubBody` is typically created as `SubBody(o.frame, o.sym[:])`. The `[:]` creates a shallow copy of the list, so new symbols added inside the block don't affect the outer scope's symbol list.

### `Access`
Used primarily in `visit` methods for **expressions** (e.g., `visit_binary_op`, `visit_identifier`).
- **`frame` (Frame)**: The current function's Frame object.
- **`sym` (List[Symbol])**: The current list of visible symbols.
- **`is_left` (bool)**: 
    - `False` (default): Expression is an **R-value**. Generate code to **load** the value onto the stack.
    - `True`: Expression is an **L-value** (LHS of assignment). Generate code to prepare for a **store** operation.
- **`is_first` (bool)**: Used to distinguish between the first time an object is accessed (e.g., in a declaration) versus subsequent assignments.

---

## Functions Explanation

### `visit_program`
- **Steps**:
    - **Step 1**: Initialize the `Emitter` and print the class prologue.
    - **Step 2**: Add built-in I/O functions to the `functions` symbol table.
    - **Step 3**: First pass: Store `StructDecl` and `FuncDecl` signatures.
    - **Step 4**: Second pass: Visit each declaration to generate code.
    - **Step 5**: Print class epilogue.
- **Rationale**: JVM requires a class structure. The first pass is necessary because a function might call another function defined later in the file (forward referencing). We need the signatures of all functions to generate correct `invokestatic` descriptors.

**Example Source:**
```c
int main() { return 0; }
```

**Python Implementation:**
```python
# In visit_program
self.emit = Emitter(f"{self.class_name}.j")
self.emit.print_out(self.emit.emit_prolog(self.class_name))
# ... visit methods ...
self.emit.emit_epilog() # Writes buffer to file
```

**Generated Jasmin (Prologue & Epilogue):**
```jasmin
.source TyC.java
.class public TyC
.super java/lang/Object

; ... (methods) ...

.method public <init>()V
    aload_0
    invokespecial java/lang/Object/<init>()V
    return
.end method
```

### `visit_func_decl`
- **Steps**:
    - **Step 1**: Create a new `Frame` and call `frame.enter_scope(True)` to reset counters.
    - **Step 2**: Determine the method descriptor and emit `.method` header.
    - **Step 3**: Retrieve `start_label` and `end_label` from the frame and emit the `start_label`.
    - **Step 4**: Allocate indices for parameters (and `args` for `main`), emit `.var` directives, and build the initial symbol table.
    - **Step 5**: Visit the function body with a `SubBody` containing the frame and parameters.
    - **Step 6**: Emit `return` (if void) and the `end_label`.
    - **Step 7**: Call `frame.exit_scope()` and `emit_end_method(frame)` to generate `.limit stack`, `.limit locals`, and `.end method`.
- **Rationale**: 
    - **JVM Method Descriptor**: JVM needs a signature like `(II)I` to uniquely identify and link methods.
    - **Stack/Local Limits**: The JVM Verifier requires `.limit stack` and `.limit locals` to ensure the program is safe. These are calculated by the `Frame` object during the body visit and emitted at the end.

**Example Source:**
```c
int add(int a, int b) {
    return a + b;
}
```

**Generated Jasmin (with Python Implementation):**

- `self.emit.emit_method(node.name, mtype, True)`
```jasmin
.method public static add(II)I
```

- `self.emit.emit_label(start_label, frame)`
```jasmin
Label0:
```

- `self.emit.emit_var(idx, node.name, var_type, start_label, end_label)`
```jasmin
    .var 0 is a I from Label0 to Label1
    .var 1 is b I from Label0 to Label1
```

- `self.visit(node.body, ...)` -> `visit_binary_op` -> `self.emit.emit_read_var(...)`
```jasmin
    iload_0 ; load a
    iload_1 ; load b
    iadd    ; add
```

- `self.emit.emit_return(ret_type, o.frame)`
```jasmin
    ireturn
```

- `self.emit.emit_label(end_label, frame)`
```jasmin
Label1:
```

- `self.emit.emit_end_method(frame)` (calculates limits)
```jasmin
    .limit stack 2
    .limit locals 2
.end method
```

**Full Jasmin Output:**
```jasmin
.method public static add(II)I
Label0:
    .var 0 is a I from Label0 to Label1
    .var 1 is b I from Label0 to Label1
    iload_0
    iload_1
    iadd
    ireturn
Label1:
    .limit stack 2
    .limit locals 2
.end method
```

### `visit_var_decl`
- **Steps**:
    - **Step 1**: Get a new local index.
    - **Step 2**: Emit `.var` directive.
    - **Step 3**: Evaluate `init_value` and emit `store` instruction.
    - **Step 4**: Add to local symbol list.
- **Rationale**: In the JVM, local variables don't have names; they are accessed by **index** in a slot array. We must maintain a mapping from source names (e.g., `x`) to indices (e.g., `1`) to generate `iload 1` or `istore 1`.

**Example Source:**
```c
int x = 42;
```

**Generated Jasmin (with Python Implementation):**

- `self.emit.emit_var(idx, node.name, var_type, start_label, end_label)`
```jasmin
.var 1 is x I from Label0 to Label1
```

- `self.visit(node.init_value, ...)` -> `visit_int_literal` -> `self.emit.emit_push_iconst(42, ...)`
```jasmin
ldc 42
```

- `self.emit.emit_write_var(node.name, var_type, idx, frame)`
```jasmin
istore 1
```

**Full Jasmin Output:**
```jasmin
.var 1 is x I from Label0 to Label1
ldc 42
istore 1
```

### `visit_assign_expr`
- **Steps**:
    - **Step 1**: Visit the **LHS** with `is_left=True` to prepare the storage context (e.g., load the object reference if the target is a struct field).
    - **Step 2**: Visit the **RHS** to push the value onto the stack.
    - **Step 3**: Emit the storage instruction (`write_var` for variables, `put_field` for fields).
- **Rationale**: In JVM bytecode, storage instructions like `putfield` require the object reference to be on the stack *before* the value. By visiting the LHS with `is_left=True`, we can generate that "setup" code before evaluating the RHS.

**Example Source:**
```c
x = 10;
p.val = 20;
```

**Generated Jasmin (for p.val = 20):**
```jasmin
aload 1       ; LHS visit (is_left=True): load object reference 'p'
ldc 20        ; RHS visit: push value
dup_x1        ; Duplicate value below objectref (to return result of assignment)
putfield Point/val I ; Store value into field
```

### `visit_if_stmt`
- **Steps**:
    - **Step 1**: Generate code for condition.
    - **Step 2**: Emit `if_false` jump to `else_label`.
    - **Step 3**: Visit `then_stmt` and `goto` to `end_label`.
    - **Step 4**: Emit `else_label`, visit `else_stmt`, and emit `end_label`.
- **Rationale**: The JVM is a low-level machine without high-level "if-else" structures. All control flow must be **flattened** into conditional jumps (`ifeq`, `ifne`, etc.) and unconditional jumps (`goto`) to specific labels.

**Example Source:**
```c
if (x > 0) { printInt(1); } else { printInt(0); }
```

**Generated Jasmin (with Python Implementation):**

- `self.visit(node.condition, ...)` -> `visit_binary_op` (Relational)
```jasmin
iload 1
iconst_0
if_icmple Label_False
iconst_1
goto Label_End
Label_False:
iconst_0
Label_End:
```

- `self.emit.emit_if_false(else_label, frame)`
```jasmin
ifeq Label2 ; Jump to else if condition is 0
```

- `self.visit(node.then_stmt, o)`
```jasmin
ldc 1
invokestatic TyC/printInt(I)V
```

- `self.emit.emit_goto(end_label, frame)`
```jasmin
goto Label3
```

- `self.emit.emit_label(else_label, frame)`
```jasmin
Label2: ; else
```

- `self.visit(node.else_stmt, o)`
```jasmin
ldc 0
invokestatic TyC/printInt(I)V
```

- `self.emit.emit_label(end_label, frame)`
```jasmin
Label3: ; end
```

**Full Jasmin Output:**
```jasmin
iload 1
iconst_0
if_icmple Label_False
iconst_1
goto Label_End
Label_False:
iconst_0
Label_End:
ifeq Label2
ldc 1
invokestatic TyC/printInt(I)V
goto Label3
Label2:
ldc 0
invokestatic TyC/printInt(I)V
Label3:
```

### `visit_while_stmt`
- **Steps**:
    - **Step 1**: Enter loop and get `start`, `continue`, and `break` labels.
    - **Step 2**: Emit `start_label` and evaluate condition.
    - **Step 3**: Jump to `break_label` if condition is false.
    - **Step 4**: Visit body, emit `continue_label`, and `goto start_label`.
    - **Step 5**: Emit `break_label`.
- **Rationale**: A loop is essentially an `if` statement followed by a **backward jump** (`goto`) to the beginning. We need a `continue` label to jump to the increment/condition check and a `break` label to exit the loop.

**Example Source:**
```c
while (i < 3) { i++; }
```

**Generated Jasmin (with Python Implementation):**

- `self.emit.emit_label(start_label, frame)`
```jasmin
Label4: ; start
```

- `self.visit(node.condition, ...)` -> `self.emit.emit_if_false(brk_label, frame)`
```jasmin
; ... check condition (i < 3) ...
ifeq Label5 ; jump to break if false
```

- `self.visit(node.body, o)`
```jasmin
; --- Body ---
iload 1
iconst_1
iadd
istore 1
```

- `self.emit.emit_label(con_label, frame)` & `self.emit.emit_goto(start_label, frame)`
```jasmin
Label6: ; continue
goto Label4
```

- `self.emit.emit_label(brk_label, frame)`
```jasmin
Label5: ; break
```

**Full Jasmin Output:**
```jasmin
Label4:
; ... (condition) ...
ifeq Label5
iload 1
iconst_1
iadd
istore 1
Label6:
goto Label4
Label5:
```

### `visit_for_stmt`
- **Steps**:
    - **Step 1**: Visit `init` statement.
    - **Step 2**: Emit `loop_label` and check `condition`.
    - **Step 3**: Visit `body`.
    - **Step 4**: Emit `continue_label`, visit `update` expression, and `goto loop_label`.
    - **Step 5**: Emit `break_label`.
- **Rationale**: Similar to `while`, but structured for initialization and updates. The `continue` label must point to the **update** logic so it executes before the next condition check.

**Example Source:**
```c
for (int i = 0; i < 3; i++) { printInt(i); }
```

**Generated Jasmin (with Python Implementation):**

- `self.visit(node.init, o)`
```jasmin
; --- Init ---
iconst_0
istore 1
```

- `self.emit.emit_label(loop_label, frame)`
```jasmin
Label7: ; loop start
```

- `self.visit(node.condition, ...)` -> `self.emit.emit_if_false(brk_label, frame)`
```jasmin
; --- Condition (i < 3) ---
ifeq Label8 ; break
```

- `self.visit(node.body, o)`
```jasmin
; --- Body ---
iload 1
invokestatic TyC/printInt(I)V
```

- `self.emit.emit_label(con_label, frame)`
```jasmin
Label9: ; continue
```

- `self.visit(node.update, ...)` & `self.emit.emit_goto(loop_label, frame)`
```jasmin
; --- Update (i++) ---
iload 1
iconst_1
iadd
istore 1
goto Label7
```

- `self.emit.emit_label(brk_label, frame)`
```jasmin
Label8: ; break
```

**Full Jasmin Output:**
```jasmin
iconst_0
istore 1
Label7:
; ... (condition) ...
ifeq Label8
iload 1
invokestatic TyC/printInt(I)V
Label9:
iload 1
iconst_1
iadd
istore 1
goto Label7
Label8:
```

### `visit_switch_stmt`
- **Steps**:
    - **Step 1**: Evaluate expression and store in a temporary variable.
    - **Step 2**: For each case, load temp, load constant, and `if_icmpeq` to case label.
    - **Step 3**: `goto` default or break.
    - **Step 4**: Emit labels and visit case/default statements.
- **Rationale**: Since TyC allows complex constant expressions in `case`, we must evaluate them and use a series of comparisons. Storing the expression result in a temporary variable is crucial to prevent stack depletion during multiple comparisons.

**Example Source:**
```c
switch (x) { case 1: printInt(1); break; default: printInt(0); }
```
**Generated Jasmin (with Python Implementation):**

- `self.visit(node.expr, ...)` & `self.emit.emit_write_var("switch_temp", ...)`
```jasmin
iload 1
istore 2 ; temp
```

- `self.emit.emit_read_var("switch_temp", ...)` & `self.emit.emit_if_icmp_eq(label, frame)`
```jasmin
; --- Comparisons ---
iload 2
iconst_1
if_icmpeq Label10
```

- `self.emit.emit_goto(...)` (to default or break)
```jasmin
goto Label11 ; goto default
```

- `self.emit.emit_label(label, frame)` & `self.visit(stmt, o)`
```jasmin
; --- Case Body ---
Label10:
ldc 1
invokestatic TyC/printInt(I)V
```

- `self.emit.emit_goto(brk_label, ...)` (from `visit_break_stmt`)
```jasmin
goto Label12 ; break
```

- `self.emit.emit_label(default_label, frame)`
```jasmin
; --- Default Body ---
Label11:
ldc 0
invokestatic TyC/printInt(I)V
```

- `self.emit.emit_label(brk_label, frame)`
```jasmin
Label12: ; end switch
```

**Full Jasmin Output:**
```jasmin
iload 1
istore 2
iload 2
iconst_1
if_icmpeq Label10
goto Label11
Label10:
ldc 1
invokestatic TyC/printInt(I)V
goto Label12
Label11:
ldc 0
invokestatic TyC/printInt(I)V
Label12:
```

### `visit_binary_op`
- **Steps**:
    - **Step 1**: Generate code for both operands.
    - **Step 2**: Handle type conversion if necessary (e.g., `i2f`).
    - **Step 3**: Emit the operation (`iadd`, `fmul`, `if_icmp...`, etc.).
- **Rationale**: JVM is a **stack-based machine** using **Postfix Notation (RPN)**. To add two numbers, they must both be on the stack so the `iadd` instruction can pop them, add them, and push the result back.
    - **Type Conversion**: JVM instructions are type-specific (`iadd` vs `fadd`). If types are mixed, we must explicitly convert (`i2f`) because the JVM doesn't widen types implicitly for arithmetic.

**Example Source:**
```c
x + 1.5
```

**Generated Jasmin (with Python Implementation):**

- `self.visit(node.left, o)` -> `visit_identifier` -> `self.emit.emit_read_var(...)`
```jasmin
iload 1   ; push int x
```

- `code += self.emit.emit_i2f(frame)` (Inside `visit_binary_op` for mixed types)
```jasmin
i2f       ; convert int to float
```

- `self.visit(node.right, o)` -> `visit_float_literal` -> `self.emit.emit_push_fconst(...)`
```jasmin
ldc 1.5   ; push float 1.5
```

- `self.emit.emit_add_op(node.operator, result_type, frame)`
```jasmin
fadd      ; float addition
```

**Full Jasmin Output:**
```jasmin
iload 1
i2f
ldc 1.5
fadd
```

### `visit_identifier`
- **Steps**:
    - **Step 1**: Look up the symbol in the current scope.
    - **Step 2**: If `is_left` is **True**, return the `Symbol` metadata (no code emitted).
    - **Step 3**: If `is_left` is **False**, emit a load instruction (`iload`, `fload`, `aload`) based on the variable index.
- **Rationale**: Identifiers behave differently depending on whether they are being read from or written to. The `is_left` flag allows `visit_assign_expr` to fetch the variable's index for a later `istore` without accidentally generating an `iload` first.

### `visit_member_access`
- **Steps**:
    - **Step 1**: Visit the base object (always as an R-value).
    - **Step 2**: If `is_left` is **True**, return the object load code (to prepare for `putfield`).
    - **Step 3**: If `is_left` is **False**, append the `getfield` instruction.
- **Rationale**: Similar to identifiers, member access needs to distinguish between getting and setting a field. For nested access (e.g., `a.b.c`), `is_first` helps manage the chain resolution.

### `visit_func_call`
- **Steps**:
    - **Step 1**: Generate code for each argument.
    - **Step 2**: Emit `invokestatic` with descriptor.
- **Rationale**: Arguments are passed via the stack. The calling convention requires the caller to push arguments in order. `invokestatic` then consumes these stack entries.

**Example Source:**
```c
printInt(x + 1)
```

**Generated Jasmin (with Python Implementation):**

- `for arg in node.args: self.visit(arg, o)`
```jasmin
iload 1
iconst_1
iadd
```

- `self.emit.emit_invoke_static(f"{fn_sym.value.value}/{node.name}", fn_type, frame)`
```jasmin
invokestatic TyC/printInt(I)V
```

**Full Jasmin Output:**
```jasmin
iload 1
iconst_1
iadd
invokestatic TyC/printInt(I)V
```

### `visit_struct_decl` & `visit_struct_with_type`
- **Steps**:
    - **Step 1**: `visit_struct_decl` creates a new class file with fields.
    - **Step 2**: `visit_struct_with_type` allocates the object (`new`), initializes it (`invokespecial <init>`), and initializes fields using `putfield`.
- **Rationale**: 
    - **Allocation (`new`)**: Objects must be allocated on the **heap**.
    - **Constructor**: Every object must be initialized. 
    - **`dup`**: The constructor call consumes the object reference. We `dup` the reference before the call so we still have a reference on the stack to assign values to fields or store the object in a variable.

**Example Source:**
```c
struct Point p = {1, 2};
```

**Generated Jasmin (with Python Implementation):**

- `self.emit.emit_new_instance(struct_name, frame)` (Allocates and calls `<init>`)
```jasmin
new Point
dup
invokespecial Point/<init>()V
```

- `self.emit.emit_dup(frame)` & `self.emit.emit_put_field(...)` (For each member)
```jasmin
dup
ldc 1
putfield Point/x I
dup
ldc 2
putfield Point/y I
```

- `self.emit.emit_write_var(node.name, var_type, idx, frame)`
```jasmin
istore 1 ; store reference in p
```

**Full Jasmin Output:**
```jasmin
new Point
dup
invokespecial Point/<init>()V
dup
ldc 1
putfield Point/x I
dup
ldc 2
putfield Point/y I
istore 1
```
