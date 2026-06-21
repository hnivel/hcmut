from functools import reduce
from typing import (
    Dict,
    List,
    Set,
    Optional,
    Any,
    Tuple,
    NamedTuple,
    Union,
    TYPE_CHECKING,
)
from ..utils.visitor import ASTVisitor
from ..utils.nodes import (
    ASTNode,
    Program,
    StructDecl,
    MemberDecl,
    FuncDecl,
    Param,
    VarDecl,
    IfStmt,
    WhileStmt,
    ForStmt,
    BreakStmt,
    ContinueStmt,
    ReturnStmt,
    BlockStmt,
    SwitchStmt,
    CaseStmt,
    DefaultStmt,
    Type,
    IntType,
    FloatType,
    StringType,
    VoidType,
    StructType,
    BinaryOp,
    PrefixOp,
    PostfixOp,
    AssignExpr,
    MemberAccess,
    FuncCall,
    Identifier,
    StructLiteral,
    IntLiteral,
    FloatLiteral,
    StringLiteral,
    ExprStmt,
    Expr,
    Stmt,
    Decl,
)

# Type aliases for better type hints
TyCType = Union[IntType, FloatType, StringType, VoidType, StructType]
from .static_error import (
    StaticError,
    Redeclared,
    UndeclaredIdentifier,
    UndeclaredFunction,
    UndeclaredStruct,
    TypeCannotBeInferred,
    TypeMismatchInStatement,
    TypeMismatchInExpression,
    MustInLoop,
)


class StructSymbol(NamedTuple):
    name: str
    members: List[Tuple[str, TyCType]]
    member_map: Dict[str, TyCType]


class VarSymbol:
    def __init__(self, name: str, typ: Optional[TyCType], node: ASTNode, is_auto: bool):
        self.name = name
        self.typ = typ
        self.node = node
        self.is_auto = is_auto


class FuncSymbol:
    def __init__(self, name: str, params: List[TyCType], return_type: Optional[TyCType], 
                 node: ASTNode, inferred: bool, saw_empty_return: bool = False,
                 empty_return_node: Optional[ASTNode] = None, 
                 pending_value_returns: List[ASTNode] = None):
        self.name = name
        self.params = params
        self.return_type = return_type
        self.node = node
        self.inferred = inferred
        self.saw_empty_return = saw_empty_return
        self.empty_return_node = empty_return_node
        self.pending_value_returns = pending_value_returns or []


class UnknownType(NamedTuple):
    owner: Union[VarSymbol, FuncSymbol]


class StructLiteralType(NamedTuple):
    node: StructLiteral


TypeValue = Union[TyCType, UnknownType, StructLiteralType]


class Context:
    def __init__(
        self,
        structs: Dict[str, StructSymbol],
        funcs: Dict[str, FuncSymbol],
        scopes: List[Dict[str, VarSymbol]],
        current_func: Optional[FuncSymbol] = None,
        loop_depth: int = 0,
        switch_depth: int = 0,
        is_prepass: bool = False,
        prepass_return_type: Optional[TyCType] = None,
        expected_type: Optional[TypeValue] = None,
    ):
        self.structs = structs
        self.funcs = funcs
        self.scopes = scopes
        self.current_func = current_func
        self.loop_depth = loop_depth
        self.switch_depth = switch_depth
        self.is_prepass = is_prepass
        self.prepass_return_type = prepass_return_type
        self.expected_type = expected_type

    def copy(self, **kwargs):
        """Create a shallow copy of the context with updated values."""
        new_context = Context(
            self.structs, self.funcs, self.scopes, self.current_func,
            self.loop_depth, self.switch_depth, self.is_prepass, self.prepass_return_type,
            self.expected_type
        )
        for key, value in kwargs.items():
            setattr(new_context, key, value)
        return new_context


class StaticChecker(ASTVisitor):
    def __init__(self):
        # Initial global state to be put into the first Context
        self.initial_funcs: Dict[str, FuncSymbol] = {
            "readInt": FuncSymbol("readInt", [], IntType(), None, False),
            "readFloat": FuncSymbol("readFloat", [], FloatType(), None, False),
            "readString": FuncSymbol("readString", [], StringType(), None, False),
            "printInt": FuncSymbol("printInt", [IntType()], VoidType(), None, False),
            "printFloat": FuncSymbol("printFloat", [FloatType()], VoidType(), None, False),
            "printString": FuncSymbol("printString", [StringType()], VoidType(), None, False),
        }

    def check_program(self, node: Program):
        # 1. Create the initial context
        ctx = Context(
            structs={},
            funcs=self.initial_funcs.copy(),
            scopes=[],
            current_func=None,
            loop_depth=0,
            switch_depth=0,
            is_prepass=False,
        )
        # 2. Visit the program with the context
        self.visit(node, ctx)

    # ------------------------------------------------------------------
    #  Helpers
    # ------------------------------------------------------------------

    def _lookup_variable(self, name: str, o: Context) -> Optional[VarSymbol]:
        """
        Return the first variable symbol with the given name found in the current scope or any enclosing scope.
        """
        # 1. Iterate through scopes in reverse order
        # 2. Return the first variable symbol with the given name
        return next(
            (scope[name] for scope in reversed(o.scopes) if name in scope), None
        )

    def _update_variable(self, name: str, new_symbol: VarSymbol, o: Context):
        """
        Update a variable symbol with the given name in the current scope or any enclosing scope.
        """
        # 1. Find the target scope
        target_scope = next(filter(lambda scope: name in scope, reversed(o.scopes)), None)
        # 2. Update the symbol in the target scope
        if target_scope is not None:
            target_scope[name] = new_symbol

    def _set_variable_type(self, symbol: VarSymbol, typ: TyCType) -> TypeValue:
        """
        Set the type of a variable symbol.
        """
        # 1. If the type is void, return UnknownType
        if isinstance(typ, VoidType):
            return UnknownType(symbol)
        # 2. If the variable is auto and has no type, set its type
        if symbol.is_auto and symbol.typ is None:
            symbol.typ = typ

        # 3. Return the variable's type
        return symbol.typ

    def _set_function_return_type(self, func: FuncSymbol, typ: TyCType, o: Context, force: bool = False) -> TypeValue:
        """
        Set the return type of a function symbol.
        """
        # 1. If the function is the current function and has no return type, return UnknownType
        if not force and o.current_func and func.name == o.current_func.name:
            if func.return_type is None:
                return UnknownType(func)

        # 2. If the function has no return type, set its type
        if func.return_type is None:
            func.return_type = typ
            func.pending_value_returns = []
            return typ

        # 3. Return the function's return type
        return func.return_type

    def _infer_and_bind_type(
        self, value: TypeValue, expected: Optional[TyCType], node: ASTNode, o: Context, force: bool = False
    ) -> TypeValue:
        """
        Infer and bind the type of a value. 
        """
        # 1. If the expected type is None, return the value
        if expected is None:
            return value

        # 2. If the value is UnknownType, infer and bind its type
        if isinstance(value, UnknownType):
            owner = value.owner
            if isinstance(owner, VarSymbol):
                return self._set_variable_type(owner, expected)
            return self._set_function_return_type(owner, expected, o, force)
        # 3. If the value is StructLiteralType, assert its type match with the expected type
        if isinstance(value, StructLiteralType) and isinstance(expected, StructType):
            self._assert_struct_literal_match(value.node, expected, o)      

        # 4. Return the value
        return value

    def _assert_type_match(
        self, actual: TyCType, expected: TyCType, node: ASTNode, o: Context, as_statement: bool
    ) -> TyCType:
        """
        Assert that the actual type matches the expected type.
        """
        # 1. Infer and bind the type of the actual value
        actual = self._infer_and_bind_type(actual, expected, node, o)
        # 2. If the actual type is UnknownType, raise TypeCannotBeInferred
        if isinstance(actual, UnknownType):
            raise TypeCannotBeInferred(node)
        # 3. If the actual type is StructLiteralType, assert its type match with the expected type
        if isinstance(actual, StructLiteralType):
            raise raise_type_mismatch(node, as_statement)
        # 4. If the actual type is not compatible with the expected type, raise TypeMismatchInExpression
        if not is_same_type(actual, expected):
            raise raise_type_mismatch(node, as_statement)

        # 5. Return the expected type
        return expected

    def _assert_struct_literal_match(
        self, node: StructLiteral, struct_type: StructType, o: Context
    ) -> TyCType:
        """
        Assert that the struct literal matches the expected struct type.
        """
        # 1. Get the struct symbol
        struct_symbol = o.structs.get(struct_type.struct_name)
        # 2. If the struct symbol is not found, raise UndeclaredStruct
        if struct_symbol is None:
            raise UndeclaredStruct(struct_type.struct_name)
        # 3. Check if the number of values matches the number of members
        if len(node.values) != len(struct_symbol.members):
            raise TypeMismatchInExpression(node)

        # 4. Check if each value matches the corresponding member type
        try:
            for expr, (member_name, member_type) in zip(node.values, struct_symbol.members):
                # 4.1. Visit the expression with member_type as expected
                val_type = self.visit(expr, o.copy(expected_type=member_type))
                # 4.2. Infer and bind the type of the value
                val_type = self._infer_and_bind_type(val_type, member_type, expr, o)
                # 4.3. If the value is UnknownType, raise TypeMismatchInExpression
                if isinstance(val_type, UnknownType):
                    raise TypeMismatchInExpression(node)
                # 4.4. If the value is not compatible with the member type, raise TypeMismatchInExpression
                if not is_same_type(val_type, member_type):
                    raise TypeMismatchInExpression(node)
        except TypeMismatchInExpression:
            raise TypeMismatchInExpression(node)

        # 5. Return the struct type
        return struct_type

    def _assert_uninferred_in_scope(self, scope: Dict, error_node: ASTNode):
        """
        Assert that there are no un-inferred auto variables in the given scope.
        """
        # 1. Iterate through symbols in the scope
        for symbol in scope.values():
            # 2. If the symbol is auto and has no type, raise TypeCannotBeInferred
            if symbol.is_auto and symbol.typ is None:
                raise TypeCannotBeInferred(error_node)

    def _assert_condition_type(self, condition: Expr, error_node: ASTNode, o: Context) -> TyCType:
        """
        Assert that a condition expression evaluates to IntType.
        """
        try:
            # 1. Visit the condition
            condition_type = self.visit(condition, o)
            # 2. Assert type match
            self._assert_type_match(condition_type, IntType(), error_node, o, True)
            return condition_type
        except TypeMismatchInExpression:
            raise TypeMismatchInStatement(error_node)

    def _binary_int_operands(self, node: BinaryOp, o: Context) -> TyCType:
        """
        Handle operations that require IntType operands.
        """
        # 1. Visit the left and right operands with IntType as expected
        left_type = self.visit(node.left, o.copy(expected_type=IntType()))
        right_type = self.visit(node.right, o.copy(expected_type=IntType()))
        # 2. Assert type match
        self._assert_type_match(left_type, IntType(), node, o, False)
        self._assert_type_match(right_type, IntType(), node, o, False)
        # 3. Return IntType
        return IntType()

    # ------------------------------------------------------------------

    def _binary_arithmetic(self, node: BinaryOp, o: Context) -> TyCType:
        """
        Handle binary arithmetic operations.
        """
        # 1. Visit the left and right operands
        left_type = self.visit(node.left, o)
        # 1.1. If left type is known, we can use it as hint for right
        right_ctx = o.copy(expected_type=left_type) if isinstance(left_type, (IntType, FloatType)) else o
        right_type = self.visit(node.right, right_ctx)

        # 2. If both the left and right types are UnknownType, raise TypeCannotBeInferred
        if isinstance(left_type, UnknownType) and isinstance(right_type, UnknownType):
            raise TypeCannotBeInferred(node)

        # 3. If the left type is UnknownType and the right type is IntType or FloatType
        if isinstance(left_type, UnknownType) and isinstance(right_type, (IntType, FloatType)):
            left_type = self._infer_and_bind_type(left_type, right_type, node, o)
        # 4. If the right type is UnknownType and the left type is IntType or FloatType
        elif isinstance(right_type, UnknownType) and isinstance(left_type, (IntType, FloatType)):
            right_type = self._infer_and_bind_type(right_type, left_type, node, o)

        # 5. If the left type is still UnknownType or the right type is still UnknownType, raise TypeCannotBeInferred
        if isinstance(left_type, UnknownType) or isinstance(right_type, UnknownType):
            raise TypeCannotBeInferred(node)

        # 6. If the left type is not IntType or FloatType or the right type is not IntType or FloatType, raise TypeMismatchInExpression
        if not isinstance(left_type, (IntType, FloatType)) or not isinstance(right_type, (IntType, FloatType)):
            raise TypeMismatchInExpression(node)

        # 7. If both the left and right types are IntType, return IntType
        if isinstance(left_type, IntType) and isinstance(right_type, IntType):
            return IntType()
        # 8. Otherwise, return FloatType
        return FloatType()

    def _binary_numeric_comparison(self, node: BinaryOp, o: Context) -> TyCType:
        """
        Handle binary numeric comparison operations.
        """
        # 1. Visit the left and right operands
        left_type = self.visit(node.left, o)
        right_type = self.visit(node.right, o)

        # 2. If both the left and right types are UnknownType, raise TypeCannotBeInferred
        if isinstance(left_type, UnknownType) or isinstance(right_type, UnknownType):
            raise TypeCannotBeInferred(node)

        # 3. If the left type is StructLiteralType or the right type is StructLiteralType, raise TypeMismatchInExpression
        if isinstance(left_type, StructLiteralType) or isinstance(right_type, StructLiteralType):
            raise TypeMismatchInExpression(node)
        
        # 4. Relational operators: both operands must be int or float
        if not (isinstance(left_type, (IntType, FloatType)) and isinstance(right_type, (IntType, FloatType))):
            raise TypeMismatchInExpression(node)

        # 5. Return IntType
        return IntType()

    def _assignment_statement(self, expr: AssignExpr, o: Context, stmt_node: Optional[ASTNode] = None):
        """
        Handle assignment statements.
        """
        # 1. Visit the left and right operands
        lhs_type = self.visit(expr.lhs, o)
        rhs_type = self.visit(expr.rhs, o)

        # 2. If the left type is UnknownType
        if isinstance(lhs_type, UnknownType):
            # 2.1. If the right type is UnknownType or StructLiteralType, raise TypeCannotBeInferred
            if isinstance(rhs_type, (UnknownType, StructLiteralType)):
                raise TypeCannotBeInferred(expr)
            # 2.2. If the right type is VoidType, raise TypeMismatchInStatement
            if isinstance(rhs_type, VoidType):
                raise TypeMismatchInStatement(stmt_node or expr)
            # 2.3. Infer and bind the type of the left operand
            self._infer_and_bind_type(lhs_type, rhs_type, expr, o, True)
            return

        # 3. Assert that the right type matches the left type
        self._assert_type_match(rhs_type, lhs_type, stmt_node or expr, o, stmt_node is not None)

    # ------------------------------------------------------------------
    #  Declarations
    # ------------------------------------------------------------------

    def visit_program(self, node: Program, o: Context):
        """
        Handle program declarations.
        """
        # 1. Visit all declarations
        reduce(lambda _, decl: self.visit(decl, o), node.decls, None)

    def visit_struct_decl(self, node: StructDecl, o: Context):
        """
        Handle struct declarations.
        """
        # 1. Check if the struct is already declared
        if node.name in o.structs:
            raise Redeclared("Struct", node.name)

        # 2. Check for redeclared members
        seen_members: Set[str] = set()
        members = []
        for m in node.members:
            if m.name in seen_members:
                raise Redeclared("Member", m.name)
            seen_members.add(m.name)
            members.append((m.name, self.visit(m, o)))

        # 3. Add the struct to the symbol table
        o.structs[node.name] = StructSymbol(node.name, members, dict(members))

    def visit_member_decl(self, node: MemberDecl, o: Context):
        """
        Handle member declarations.
        """
        # 1. Visit the member type
        return self.visit(node.member_type, o)

    def visit_func_decl(self, node: FuncDecl, o: Context):
        """
        Handle function declarations.
        """
        # 1. Check if the function is already declared
        if node.name in o.funcs:
            raise Redeclared("Function", node.name)

        # 2. Process parameters
        seen_params: Set[str] = set()
        param_types: List[TyCType] = []
        param_scope: Dict[str, VarSymbol] = {}

        def process_param(acc, param):
            # 2.1. Check for redeclared parameters
            if param.name in seen_params:
                raise Redeclared("Parameter", param.name)
            seen_params.add(param.name)
            # 2.2. Visit the parameter type
            ptype = self.visit(param, o)
            param_types.append(ptype)
            param_scope[param.name] = VarSymbol(param.name, ptype, param, False)
            return acc

        reduce(process_param, node.params, None)

        # 3. Visit the return type
        return_type = self.visit(node.return_type, o) if node.return_type else None
        # 4. Create the function symbol
        func_symbol = FuncSymbol(
            node.name, param_types, return_type, node, node.return_type is None,
            saw_empty_return=False, empty_return_node=None, pending_value_returns=[]
        )
        # 5. Add the function to the symbol table
        o.funcs[node.name] = func_symbol

        # 6. If the function has no return type, infer it
        if node.return_type is None:
            self._infer_auto_return_type_prepass(node, param_scope, o)

        # 7. Visit the function body with a new context
        func_ctx = o.copy(
            current_func=func_symbol,
            scopes=[param_scope],
            loop_depth=0,
            switch_depth=0
        )

        try:
            # 8.1. Visit the function body
            self.visit(node.body, func_ctx)
            func_symbol = o.funcs[node.name]
            # 8.2. If the function has no return type, infer it
            if func_symbol.inferred:
                if func_symbol.return_type is None:
                    if func_symbol.pending_value_returns:
                        raise TypeMismatchInStatement(func_symbol.pending_value_returns[0])
                    self._set_function_return_type(func_symbol, VoidType(), o, force=True)
        finally:
            pass # No state restoration needed as we used a new context

    def _infer_auto_return_type_prepass(self, node: FuncDecl, param_scope: Dict[str, VarSymbol], o: Context):
        """
        Prepass to infer the return type of a function with auto return type.
        """
        # 1. Create a prepass context
        prepass_ctx = o.copy(
            is_prepass=True,
            prepass_return_type=None,
            current_func=o.funcs[node.name],
            scopes=[param_scope.copy()]
        )
        
        try:
            # 2.1. Visit the function body
            for stmt in node.body.statements:
                try:
                    self.visit(stmt, prepass_ctx)
                except (StaticError, StopIteration):
                    pass
                if prepass_ctx.prepass_return_type:
                    break
        finally:
            pass
        
        if prepass_ctx.prepass_return_type:
            func = o.funcs[node.name]
            func.return_type = prepass_ctx.prepass_return_type

    def visit_param(self, node: Param, o: Context):
        """
        Handle parameter declarations.
        """
        # 1. Visit the parameter type
        param_type = self.visit(node.param_type, o)
        # 2. If the parameter type is void, raise type mismatch error
        if isinstance(param_type, VoidType):
            raise TypeMismatchInStatement(node)
        return param_type

    def visit_var_decl(self, node: VarDecl, o: Context):
        """
        Handle variable declarations.
        """
        # 1. Check if the variable is already declared in the current scope
        current_scope = o.scopes[-1]
        if node.name in current_scope:
            raise Redeclared("Variable", node.name)

        declared_type = self.visit(node.var_type, o) if node.var_type else None
        # 2. If the declared type is void, raise type mismatch error
        if isinstance(declared_type, VoidType):
            raise TypeMismatchInStatement(node)

        # 3. Check if the variable is already declared in the parameter scope
        if len(o.scopes) > 1 and node.name in o.scopes[0]:
            raise Redeclared("Variable", node.name)

        # 4. Handle variable declaration without initialization
        if node.init_value is None:
            symbol = VarSymbol(node.name, declared_type, node, node.var_type is None)
            current_scope[node.name] = symbol
            return symbol

        # 5. Handle variable declaration with initialization
        if declared_type is None:
            # 5.1. Visit the initialization value
            init_type = self.visit(node.init_value, o)
            # 5.2. Check if the initialization value is of unknown type
            if isinstance(init_type, UnknownType):
                raise TypeCannotBeInferred(node)
            # 5.3. Check if the initialization value is of struct literal type
            if isinstance(init_type, StructLiteralType):
                raise TypeCannotBeInferred(node)
            # 5.4. Check if the initialization value is of void type
            if isinstance(init_type, VoidType):
                raise TypeMismatchInStatement(node)
            # 5.5. Create the variable symbol
            symbol = VarSymbol(node.name, init_type, node, True)
            current_scope[node.name] = symbol
            return symbol

        # 6. Handle variable declaration with initialization and explicit type
        try:
            # 6.1. Visit the initialization value with declared type as expected
            init_type = self.visit(node.init_value, o.copy(expected_type=declared_type))
        except TypeMismatchInExpression as e:
            # 6.2. Wrap StructLiteral mismatches into statement errors for VarDecl
            if isinstance(e.expr, StructLiteral):
                raise TypeMismatchInStatement(node)
            raise e
        
        # 6.3. Assert type match
        self._assert_type_match(init_type, declared_type, node, o, True)

        # 6.4. Create the variable symbol
        symbol = VarSymbol(node.name, declared_type, node, False)
        current_scope[node.name] = symbol
        return symbol

    # ------------------------------------------------------------------
    #  Types
    # ------------------------------------------------------------------

    def visit_int_type(self, node: IntType, o: Any = None):
        return node

    def visit_float_type(self, node: FloatType, o: Any = None):
        return node

    def visit_string_type(self, node: StringType, o: Any = None):
        return node

    def visit_void_type(self, node: VoidType, o: Any = None):
        return node

    def visit_struct_type(self, node: StructType, o: Context):
        """
        Handle struct type declarations.
        """
        # 1. Check if the struct is already declared
        if node.struct_name not in o.structs:
            raise UndeclaredStruct(node.struct_name)
        return node

    # ------------------------------------------------------------------
    #  Statements
    # ------------------------------------------------------------------

    def visit_block_stmt(self, node: BlockStmt, o: Context):
        """
        Handle block statements.
        """
        # 1. Create a new scope for the block
        new_scopes = o.scopes + [{}]
        block_ctx = o.copy(scopes=new_scopes)
        try:
            # 2. Visit all statements in the block
            reduce(lambda _, stmt: self.visit(stmt, block_ctx), node.statements, None)
            # 3. After processing the block, check for any un-inferred auto variables
            self._assert_uninferred_in_scope(new_scopes[-1], node)
        finally:
            pass

    def visit_if_stmt(self, node: IfStmt, o: Context):
        """
        Handle if statements.
        """
        # 1. Visit the condition
        self._assert_condition_type(node.condition, node, o)
        # 2. Visit the then-branch
        self.visit(node.then_stmt, o)
        # 3. Visit the else-branch
        if node.else_stmt is not None:
            self.visit(node.else_stmt, o)

    def visit_while_stmt(self, node: WhileStmt, o: Context):
        """
        Handle while statements.
        """
        # 1. Visit the condition
        self._assert_condition_type(node.condition, node, o)
        # 2. Visit the body with incremented loop depth
        self.visit(node.body, o.copy(loop_depth=o.loop_depth + 1))

    def visit_for_stmt(self, node: ForStmt, o: Context):
        """
        Handle for statements.
        """
        for_ctx = o.copy(loop_depth=o.loop_depth + 1)
        
        # 1. Handle the initialization part
        if node.init is not None:
            # 1.1. If the initialization is an assignment expression
            if isinstance(node.init, ExprStmt) and isinstance(node.init.expr, AssignExpr):
                # 1.1.1. Handle the assignment statement
                self._assignment_statement(node.init.expr, for_ctx)
            else:
                # 1.1.2. Visit the initialization
                self.visit(node.init, for_ctx)

        # 2. Handle the condition part
        if node.condition is not None:
            self._assert_condition_type(node.condition, node, for_ctx)

        # 3. Handle the update part
        if node.update is not None:
            # 3.1. If the update is an assignment expression
            if isinstance(node.update, AssignExpr):
                # 3.1.1. Handle the assignment statement
                self._assignment_statement(node.update, for_ctx)
            else:
                # 3.1.2. Visit the update
                self.visit(node.update, for_ctx)

        # 4. Visit the body
        self.visit(node.body, for_ctx)

    def visit_switch_stmt(self, node: SwitchStmt, o: Context):
        """
        Handle switch statements.
        """
        # 1. Visit the expression
        try:
            # 1.1. Visit the expression
            expr_type = self.visit(node.expr, o)
            # 1.2. Assert type match
            self._assert_type_match(expr_type, IntType(), node, o, True)
        except TypeMismatchInExpression:
            raise TypeMismatchInStatement(node)

        # 2. Visit all cases with incremented switch depth
        switch_ctx = o.copy(switch_depth=o.switch_depth + 1)
        # 2.1. Get all cases
        cases_list = node.cases + (
            [node.default_case] if node.default_case is not None else []
        )
        # 2.2. Visit all cases
        reduce(lambda _, stmt: self.visit(stmt, switch_ctx), cases_list, None)

    def visit_case_stmt(self, node: CaseStmt, o: Context):
        """
        Handle case statements.
        """
        # 1. Visit the expression
        case_type = self.visit(node.expr, o)
        
        # 2. Case expression must be a compile-time integer constant
        if not self._is_constant_expr(node.expr, o):
            raise TypeMismatchInStatement(node)
            
        # 3. Assert type match
        if isinstance(case_type, UnknownType) or not isinstance(case_type, IntType):
            raise TypeMismatchInStatement(node)
        # 4. Visit the statements
        reduce(lambda _, stmt: self.visit(stmt, o), node.statements, None)

    def _is_constant_expr(self, expr: Expr, o: Context) -> bool:
        """
        Check if an expression is a compile-time constant.
        """
        # 1. If the expression is an integer literal, it is a compile-time constant
        if isinstance(expr, IntLiteral): return True
        # 2. If the expression is a prefix operation
        if isinstance(expr, PrefixOp):
            # 2.1. If the operator is ++ or --, it is not a compile-time constant
            if expr.operator in {'++', '--'}: return False
            # 2.2. Otherwise, check the operand
            return self._is_constant_expr(expr.operand, o)
        # 3. If the expression is a binary operation
        if isinstance(expr, BinaryOp):
            # 3.1. Check both operands
            return self._is_constant_expr(expr.left, o) and self._is_constant_expr(expr.right, o)
        # 4. Otherwise, it is not a compile-time constant
        return False

    def visit_default_stmt(self, node: DefaultStmt, o: Context):
        """
        Handle default statements.
        """
        # 1. Visit the statements
        reduce(lambda _, stmt: self.visit(stmt, o), node.statements, None)

    def visit_break_stmt(self, node: BreakStmt, o: Context):
        """
        Handle break statements.
        """
        # 1. Check if the break statement is inside a loop or switch
        if o.loop_depth == 0 and o.switch_depth == 0:
            raise MustInLoop(node)

    def visit_continue_stmt(self, node: ContinueStmt, o: Context):
        """
        Handle continue statements.
        """
        # 1. Check if the continue statement is inside a loop
        if o.loop_depth == 0:
            raise MustInLoop(node)

    def visit_return_stmt(self, node: ReturnStmt, o: Context):
        """
        Handle return statements.
        """
        # 1. Get the current function
        func = o.current_func
        if func is None:
            return

        # 2. If the return statement is in the prepass
        if o.is_prepass:
            # 2.1. If the return statement has no expression
            if node.expr is None:
                # 2.1.1. Set the prepass return type to VoidType
                o.prepass_return_type = VoidType()
                # 2.1.2. Raise StopIteration
                raise StopIteration
            # 2.2. If the return statement has an expression
            else:
                try:
                    # 2.2.1. Visit the expression
                    t = self.visit(node.expr, o)
                    # 2.2.2. If the expression is a Type, set the prepass return type
                    if isinstance(t, Type):
                        o.prepass_return_type = t
                except StaticError:
                    pass
                raise StopIteration

        # 3. If the return statement has no expression
        if node.expr is None:
            # 3.1. If the function is inferred
            if func.inferred:
                # 3.1.1. If the function return type is not None and not VoidType, raise TypeMismatchInStatement
                if func.return_type is not None and not isinstance(func.return_type, VoidType):
                    raise TypeMismatchInStatement(node)
                # 3.1.2. Set the function return type to VoidType
                self._set_function_return_type(func, VoidType(), o)
                # 3.1.3. Set the function to saw empty return
                func.saw_empty_return = True
                # 3.1.4. Set the function empty return node
                func.empty_return_node = node
            # 3.2. If the function is not inferred and the function return type is not VoidType, raise TypeMismatchInStatement
            elif not isinstance(func.return_type, VoidType):
                raise TypeMismatchInStatement(node)
            return

        # 4. If the return statement has an expression
        try:
            # 4.1. Visit the expression with function's return type as expected
            value_type = self.visit(node.expr, o.copy(expected_type=func.return_type))
        except TypeMismatchInExpression:
            # 4.2. If the expression is a TypeMismatchInExpression, raise TypeMismatchInStatement
            raise TypeMismatchInStatement(node)

        # 5. If the function is inferred and the function return type is None
        if func.inferred and func.return_type is None:
            # 5.1. If the return value is this function's own UnknownType (self-recursive call), raise TypeCannotBeInferred
            if isinstance(value_type, UnknownType) and value_type.owner is func:
                raise TypeCannotBeInferred(node)
            # 5.2. If the return value is UnknownType or StructLiteralType, raise TypeCannotBeInferred
            if isinstance(value_type, UnknownType) or isinstance(value_type, StructLiteralType):
                raise TypeCannotBeInferred(node)
            # 5.3. Set the function return type
            self._set_function_return_type(func, value_type, o)
            return

        # 6. Assert type match
        self._assert_type_match(value_type, func.return_type, node, o, True)

        # 7. Check for explicitly returning an expression in a void function
        if isinstance(func.return_type, VoidType) and node.expr is not None:
            raise TypeCannotBeInferred(node)

    def visit_expr_stmt(self, node: ExprStmt, o: Context):
        """
        Handle expression statements.
        """
        # 1. If the expression is an assignment expression, handle it
        if isinstance(node.expr, AssignExpr):
            self._assignment_statement(node.expr, o, node)
            return

        # 2. Visit the expression
        expr_type = self.visit(node.expr, o)
        # 3. If the expression type is UnknownType, raise TypeCannotBeInferred
        if isinstance(expr_type, UnknownType):
            raise TypeCannotBeInferred(node)
        # 4. If the expression type is StructLiteralType, raise TypeMismatchInExpression
        if isinstance(expr_type, StructLiteralType):
            raise TypeMismatchInExpression(node)

    # ------------------------------------------------------------------
    # Expressions
    # ------------------------------------------------------------------

    def visit_binary_op(self, node: BinaryOp, o: Context):
        """
        Handle binary operations.
        """
        # Clear expected_type for operands to prevent incorrect inference from result type
        inner_o = o.copy(expected_type=None)

        # 1. If the operator is arithmetic
        if node.operator in {"+", "-", "*", "/"}:
            return self._binary_arithmetic(node, inner_o)

        # 2. If the operator is modulus or logical
        if node.operator in {"%", "&&", "||"}:
            return self._binary_int_operands(node, inner_o)

        # 3. If the operator is comparison
        if node.operator in {"<", "<=", ">", ">=", "==", "!="}:
            return self._binary_numeric_comparison(node, inner_o)

        # 4. If the operator is not recognized, raise TypeMismatchInExpression
        raise TypeMismatchInExpression(node)

    def visit_prefix_op(self, node: PrefixOp, o: Context):
        """
        Handle prefix operations.
        """
        # 1. If the operator is increment or decrement or logical not
        if node.operator in {"++", "--", "!"}:
            # 1.1. If the operand is not an identifier or member access, raise TypeMismatchInExpression
            if node.operator in {"++", "--"} and not isinstance(node.operand, (Identifier, MemberAccess)):
                raise TypeMismatchInExpression(node)
            # 1.2. Visit the operand
            operand_type = self.visit(node.operand, o)
            # 1.3. Assert type match
            self._assert_type_match(operand_type, IntType(), node, o, False)
            # 1.4. Return IntType
            return IntType()

        # 2. If the operator is unary plus or minus
        if node.operator in {"+", "-"}:
            # 2.1. Visit the operand
            operand_type = self.visit(node.operand, o)
            # 2.2. If the operand is UnknownType, raise TypeCannotBeInferred
            if isinstance(operand_type, UnknownType):
                raise TypeCannotBeInferred(node)
            # 2.3. If the operand is StructLiteralType or not IntType or FloatType, raise TypeMismatchInExpression
            if isinstance(operand_type, StructLiteralType) or not isinstance(operand_type, (IntType, FloatType)):
                raise TypeMismatchInExpression(node)
            # 2.4. Return the operand type
            return operand_type

        # 3. If the operator is not recognized, raise TypeMismatchInExpression
        raise TypeMismatchInExpression(node)

    def visit_postfix_op(self, node: PostfixOp, o: Context):
        """
        Handle postfix operations.
        """
        # 1. If the operator is increment or decrement, raise TypeMismatchInExpression
        if node.operator not in {"++", "--"}:
            raise TypeMismatchInExpression(node)
        # 2. If the operand is not an identifier or member access, raise TypeMismatchInExpression
        if not isinstance(node.operand, (Identifier, MemberAccess)):
            raise TypeMismatchInExpression(node)
        # 3. Visit the operand
        operand_type = self.visit(node.operand, o)
        # 4. Assert type match
        self._assert_type_match(operand_type, IntType(), node, o, False)
        # 5. Return IntType
        return IntType()

    def visit_assign_expr(self, node: AssignExpr, o: Context):
        """
        Handle assignment expressions.
        """
        # 1. If the left-hand side is not an identifier or member access, raise TypeMismatchInExpression
        if not isinstance(node.lhs, (Identifier, MemberAccess)):
            raise TypeMismatchInExpression(node)

        # 2. Visit the left-hand side and right-hand side
        lhs_type = self.visit(node.lhs, o)
        rhs_type = self.visit(node.rhs, o.copy(expected_type=lhs_type))

        # 3. If the left-hand side is UnknownType
        if isinstance(lhs_type, UnknownType):
            # 3.1. If the right-hand side is UnknownType or StructLiteralType, raise TypeCannotBeInferred
            if isinstance(rhs_type, (UnknownType, StructLiteralType)):
                raise TypeCannotBeInferred(node)
            # 3.2. If the right-hand side is VoidType, raise TypeMismatchInExpression
            if isinstance(rhs_type, VoidType):
                raise TypeMismatchInExpression(node)
            # 3.3. Infer and bind the type
            lhs_type = self._infer_and_bind_type(lhs_type, rhs_type, node, o)
            return lhs_type

        # 4. Assert type match
        self._assert_type_match(rhs_type, lhs_type, node, o, False)
        return lhs_type

    def visit_member_access(self, node: MemberAccess, o: Context):
        """
        Handle member access expressions.
        """
        # 1. Visit the object
        obj_type = self.visit(node.obj, o)
        # 2. If the object is UnknownType, raise TypeCannotBeInferred
        if isinstance(obj_type, UnknownType):
            raise TypeCannotBeInferred(node)
        # 3. If the object is StructLiteralType or not StructType, raise TypeMismatchInExpression
        if isinstance(obj_type, StructLiteralType) or not isinstance(obj_type, StructType):
            raise TypeMismatchInExpression(node)

        # 4. Get the struct symbol
        struct_symbol = o.structs.get(obj_type.struct_name)
        # 5. If the struct symbol is None or the member is not in the struct symbol, raise TypeMismatchInExpression
        if struct_symbol is None or node.member not in struct_symbol.member_map:
            raise TypeMismatchInExpression(node)
        # 6. Return the member type
        return struct_symbol.member_map[node.member]

    def visit_func_call(self, node: FuncCall, o: Context):
        """
        Handle function call expressions.
        """
        # 1. Get the function symbol
        func_symbol = o.funcs.get(node.name)
        # 2. If the function symbol is None, raise UndeclaredFunction
        if func_symbol is None:
            raise UndeclaredFunction(node.name)

        # 3. If the number of arguments is not equal to the number of parameters, raise TypeMismatchInExpression
        if len(node.args) != len(func_symbol.params):
            raise TypeMismatchInExpression(node)

        # 4. Visit each argument and check type match
        for arg, param_type in zip(node.args, func_symbol.params):
            # 4.1. Visit the argument with param_type as expected
            try:
                # 4.1.1. Visit the argument
                arg_type = self.visit(arg, o.copy(expected_type=param_type))
            except TypeMismatchInExpression:
                # 4.1.2. If the argument is StructLiteral, raise TypeMismatchInExpression
                if isinstance(arg, StructLiteral):
                    raise TypeMismatchInExpression(node)
                # 4.1.3. Otherwise, raise TypeMismatchInExpression
                raise
                
            # 4.2. Check arg_type vs param_type
            try:
                # 4.2.1. Assert type match
                self._assert_type_match(arg_type, param_type, node, o, False)
            except TypeMismatchInExpression:
                # 4.2.2. If the argument is StructLiteral, raise TypeMismatchInExpression
                if isinstance(arg, StructLiteral):
                    raise TypeMismatchInExpression(node)
                # 4.2.3. Otherwise, raise TypeMismatchInExpression
                raise

        # 5. If the function has a return type, return it
        if func_symbol.return_type is not None:
            return func_symbol.return_type

        # 6. If the expected type is a Type and the function is not self-recursive, infer and bind the return type
        if isinstance(o.expected_type, (Type, UnknownType)) and (
            o.current_func is None
            or func_symbol.name != o.current_func.name
        ):
            # 6.1. Infer and bind the return type
            return self._set_function_return_type(func_symbol, o.expected_type, o)

    def visit_identifier(self, node: Identifier, o: Context):
        """
        Handle identifier expressions.
        """
        # 1. Look up the variable
        symbol = self._lookup_variable(node.name, o)
        # 2. If the variable is not found, raise UndeclaredIdentifier
        if symbol is None:
            raise UndeclaredIdentifier(node.name)
        # 3. If the variable has a type, return it
        if symbol.typ is not None:
            return symbol.typ
        # 4. If the expected type is a Type, infer and bind the variable type
        if isinstance(o.expected_type, (Type, UnknownType)):
            symbol.typ = o.expected_type
            return o.expected_type
        # 5. Return UnknownType
        return UnknownType(symbol)

    def visit_struct_literal(self, node: StructLiteral, o: Context):
        """
        Handle struct literal expressions.
        """
        # 1. If the expected type is a StructType, assert struct literal match
        if isinstance(o.expected_type, StructType):
            return self._assert_struct_literal_match(node, o.expected_type, o)
        # 2. Return StructLiteralType
        return StructLiteralType(node)

    def visit_int_literal(self, node: IntLiteral, o: Context):
        return IntType()

    def visit_float_literal(self, node: FloatLiteral, o: Context):
        return FloatType()

    def visit_string_literal(self, node: StringLiteral, o: Context):
        return StringType()


def is_same_type(left: TyCType, right: TyCType) -> bool:
    if type(left) is not type(right):
        return False
    if isinstance(left, StructType) and isinstance(right, StructType):
        return left.struct_name == right.struct_name
    return True


def raise_type_mismatch(node: ASTNode, as_statement: bool):
    if as_statement:
        raise TypeMismatchInStatement(node)
    raise TypeMismatchInExpression(node)