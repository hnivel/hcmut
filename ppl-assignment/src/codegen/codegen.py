"""
Code generator for TyC.
"""

from typing import Any

from ..utils.nodes import *
from ..utils.visitor import BaseVisitor
from .emitter import *
from .frame import *
from .io import IO_SYMBOL_LIST
from .utils import *


class StringArrayType:
    """Marker type for JVM main(String[] args)."""
    pass


class CodeGenerator(BaseVisitor):
    """AST -> Jasmin bytecode generator for TyC."""

    def __init__(self):
        self.emit = None
        self.functions = {}
        self.structs = {}
        self.current_return_type = VoidType()
        self.class_name = "TyC"

    def _lookup_symbol(self, name: str, sym_list: list[Symbol]) -> Symbol:
        for sym in reversed(sym_list):
            if sym.name == name:
                return sym
        raise RuntimeError(f"Undeclared symbol: {name}")

    def _infer_type(self, node: Expr, o: Access):
        if isinstance(node, IntLiteral):
            return IntType()
        if isinstance(node, FloatLiteral):
            return FloatType()
        if isinstance(node, StringLiteral):
            return StringType()
        if isinstance(node, Identifier):
            return self._lookup_symbol(node.name, o.sym).type
        if isinstance(node, AssignExpr):
            return self._infer_type(node.rhs, o)
        if isinstance(node, FuncCall):
            return self.functions[node.name].type.return_type
        if isinstance(node, BinaryOp):
            if node.operator in ["+", "-", "*", "/", "%"]:
                left_type = self._infer_type(node.left, o)
                right_type = self._infer_type(node.right, o)
                if is_float_type(left_type) or is_float_type(right_type):
                    return FloatType()
                return IntType()
            if node.operator in ["<", "<=", ">", ">=", "==", "!="]:
                return IntType()
        if isinstance(node, MemberAccess):
            obj_type = self._infer_type(node.obj, o)
            struct_decl = self.structs[obj_type.struct_name]
            for m in struct_decl.members:
                if m.name == node.member:
                    return m.member_type
        return IntType()

    def visit_program(self, node: Program, o: Any = None):
        """Generate Jasmin bytecode for the whole program."""
        self.emit = Emitter(f"{self.class_name}.j")
        # 1. Generate starting directives for the program (a single class with all functions)
        self.emit.print_out(self.emit.emit_prolog(self.class_name))

        # 2. Add built-in IO functions to the symbol table
        for io_sym in IO_SYMBOL_LIST:
            self.functions[io_sym.name] = io_sym

        # 3. Add struct declarations and function declarations to the symbol table
        for decl in node.decls:
            if isinstance(decl, StructDecl):
                self.structs[decl.name] = decl
            elif isinstance(decl, FuncDecl):
                return_type = decl.return_type if decl.return_type else VoidType()
                param_types = [p.param_type for p in decl.params]
                self.functions[decl.name] = Symbol(
                    decl.name, FunctionType(param_types, return_type), CName(self.class_name)
                )

        # 4. Visit each declaration and generate the corresponding Jasmin code
        for decl in node.decls:
            self.visit(decl, None)

        # 5. Write the generated code into a file
        self.emit.emit_epilog()

    def visit_func_decl(self, node: FuncDecl, o: Any = None):
        """Generate Jasmin bytecode for a function declaration."""
        self.current_return_type = node.return_type if node.return_type else VoidType()
        # 1. Create a new frame for the function
        frame = Frame(node.name, self.current_return_type)
        # 2. Enter the frame scope
        frame.enter_scope(True)

        # 3. Determine the function type
        if node.name == "main":
            mtype = FunctionType([StringArrayType()], VoidType())
        else:
            mtype = FunctionType([p.param_type for p in node.params], self.current_return_type)

        # 4. Emit the method header (.method public static ...)
        self.emit.print_out(self.emit.emit_method(node.name, mtype, True))

        # 5. Get the start and end labels
        start_label = frame.get_start_label()
        end_label = frame.get_end_label()
        # 6. Emit the start label (Label0:)
        self.emit.print_out(self.emit.emit_label(start_label, frame))

        # 7. Declare and initialize local variables (.var...)
        local_syms: list[Symbol] = []
        if node.name == "main":
            args_idx = frame.get_new_index()
            self.emit.print_out(
                self.emit.emit_var(
                    args_idx, "args", StringArrayType(), start_label, end_label
                )
            )

        for param in node.params:
            idx = frame.get_new_index()
            self.emit.print_out(
                self.emit.emit_var(idx, param.name, param.param_type, start_label, end_label)
            )
            local_syms.append(Symbol(param.name, param.param_type, Index(idx)))

        # 8. Visit function body
        sub_body = SubBody(frame, local_syms)
        self.visit(node.body, sub_body)

        # 9. Emit return instruction if the current function's return type is void
        if is_void_type(self.current_return_type):
            self.emit.print_out(self.emit.emit_return(VoidType(), frame))

        # 10. Emit the end label (Label1:)
        self.emit.print_out(self.emit.emit_label(end_label, frame))
        # 11. Exit the frame scope
        frame.exit_scope()
        # 12. Emit the end method (.limit stack, .limit locals, .end method)
        self.emit.print_out(self.emit.emit_end_method(frame))

    def visit_block_stmt(self, node: BlockStmt, o: SubBody = None):
        """Visit a block of statements."""
        # 1. Create a new subbody for the block
        current_o = SubBody(o.frame, o.sym[:]) 
        # 2. Visit each statement in the block
        for stmt in node.statements:
            current_o = self.visit(stmt, current_o)
        # 3. Return the original subbody (outer scope)
        return o

    def visit_var_decl(self, node: VarDecl, o: SubBody = None):
        """Visit a variable declaration stmt."""
        frame = o.frame
        idx = frame.get_new_index()
        # 1. Infer the type of the variable if it is not explicitly declared
        var_type = node.var_type if node.var_type else self._infer_type(node.init_value, Access(frame, o.sym))
        # 2. Emit the variable declaration (.var...)
        self.emit.print_out(
            self.emit.emit_var(
                idx, node.name, var_type, frame.get_start_label(), frame.get_end_label()
            )
        )
        # 3. Emit the initialization code
        if node.init_value is not None:
            if isinstance(node.init_value, StructLiteral):
                rhs_code, _ = self.visit_struct_with_type(node.init_value, Access(frame, o.sym), var_type)
            else:
                rhs_code, _ = self.visit(node.init_value, Access(frame, o.sym))
            # 3.1. Emit the initialization code (rhs_code)
            self.emit.print_out(rhs_code)
            # 3.2. Emit the write var code (istore_i/fstore_i/...)
            self.emit.print_out(self.emit.emit_write_var(node.name, var_type, idx, frame))
        # 4. Add the variable to the symbol table
        o.sym.append(Symbol(node.name, var_type, Index(idx)))
        # 5. Return the original subbody with the new variable
        return o

    def visit_expr_stmt(self, node: ExprStmt, o: SubBody = None):
        """Visit an expression stmt."""
        # 1. Visit the expression as a root (is_first=True)
        code, expr_type = self.visit(node.expr, Access(o.frame, o.sym, is_left=False, is_first=True))
        # 2. Emit the expression code
        self.emit.print_out(code)
        # 3. If the expression is not void, pop it to avoid stack overflow
        if not is_void_type(expr_type):
            self.emit.print_out(self.emit.emit_pop(o.frame))
        # 4. Return the original subbody
        return o

    def visit_if_stmt(self, node: IfStmt, o: SubBody = None):
        """Visit an if stmt."""
        frame = o.frame
        # 1. Visit the condition as a root
        cond_code, _ = self.visit(node.condition, Access(frame, o.sym, is_left=False, is_first=True))
        # 2. Get new labels for the else block and the end of the if statement
        else_label = frame.get_new_label()
        end_label = frame.get_new_label()
        # 3. Emit the condition code
        self.emit.print_out(cond_code)
        # 4. Emit the if_false instruction (if_icmple Label_False)
        self.emit.print_out(self.emit.emit_if_false(else_label, frame))
        # 5. Visit the then block
        self.visit(node.then_stmt, o)
        # 6. Emit the goto instruction (goto Label_End)
        self.emit.print_out(self.emit.emit_goto(end_label, frame))
        # 7. Emit the else label (Label_Else:)
        self.emit.print_out(self.emit.emit_label(else_label, frame))
        # 8. Visit the else block
        if node.else_stmt:
            self.visit(node.else_stmt, o)
        # 9. Emit the end label (Label_End:)
        self.emit.print_out(self.emit.emit_label(end_label, frame))
        # 10. Return the original subbody
        return o

    def visit_while_stmt(self, node: WhileStmt, o: SubBody = None):
        """Visit a while loop stmt."""
        frame = o.frame
        # 1. Enter the loop scope
        frame.enter_loop()
        # 2. Get new labels for the start, continue, and break labels
        start_label = frame.get_new_label()
        con_label = frame.get_continue_label()
        brk_label = frame.get_break_label()

        # 3. Emit the start label (Label_Start:)
        self.emit.print_out(self.emit.emit_label(start_label, frame))
        # 1. Visit the condition as a root
        cond_code, _ = self.visit(node.condition, Access(frame, o.sym, is_left=False, is_first=True))
        # 5. Emit the condition code
        self.emit.print_out(cond_code)
        # 6. Emit the if_false instruction (if_icmple Label_Break)
        self.emit.print_out(self.emit.emit_if_false(brk_label, frame))
        # 7. Visit the body
        self.visit(node.body, o)
        # 8. Emit the continue label (Label_Continue:)
        self.emit.print_out(self.emit.emit_label(con_label, frame))
        # 9. Emit the goto instruction (goto Label_Start)
        self.emit.print_out(self.emit.emit_goto(start_label, frame))
        # 10. Emit the break label (Label_Break:)
        self.emit.print_out(self.emit.emit_label(brk_label, frame))
        # 11. Exit the loop scope
        frame.exit_loop()
        return o

    def visit_for_stmt(self, node: ForStmt, o: SubBody = None):
        """Visit a for loop stmt."""
        frame = o.frame
        # 1. Visit the initialization
        if node.init:
            o = self.visit(node.init, o)
        # 2. Enter the loop scope
        frame.enter_loop()
        # 3. Get new labels for the start, continue, and break labels
        loop_label = frame.get_new_label()
        con_label = frame.get_continue_label()
        brk_label = frame.get_break_label()

        # 4. Emit the loop label (Label_Loop:)
        self.emit.print_out(self.emit.emit_label(loop_label, frame))
        # 5. Visit the condition
        if node.condition:
            cond_code, _ = self.visit(node.condition, Access(frame, o.sym, is_left=False, is_first=True))
            # 5.1. Emit the condition code
            self.emit.print_out(cond_code)
            # 5.2. Emit the if_false instruction (if_icmple Label_Break)
            self.emit.print_out(self.emit.emit_if_false(brk_label, frame))
        # 6. Visit the body
        self.visit(node.body, o)
        # 7. Emit the continue label (Label_Continue:)
        self.emit.print_out(self.emit.emit_label(con_label, frame))
        # 4. Visit the update expression as a root
        if node.update:
            update_code, update_type = self.visit(node.update, Access(frame, o.sym, is_left=False, is_first=True))
            # 8.1. Emit the update code
            self.emit.print_out(update_code)
            # 8.2. If the update is not void, pop it to avoid stack overflow
            if not is_void_type(update_type):
                self.emit.print_out(self.emit.emit_pop(frame))
        # 9. Emit the goto instruction (goto Label_Loop)
        self.emit.print_out(self.emit.emit_goto(loop_label, frame))
        # 10. Emit the break label (Label_Break:)
        self.emit.print_out(self.emit.emit_label(brk_label, frame))
        # 11. Exit the loop scope
        frame.exit_loop()
        # 12. Return the original subbody
        return o

    def visit_switch_stmt(self, node: SwitchStmt, o: SubBody = None):
        """Visit a switch stmt."""
        frame = o.frame
        # 1. Visit the expression as a root
        body_code, body_type = self.visit(node.expr, Access(o.frame, o.sym, is_left=False, is_first=True))
        # 2. Emit the expression code
        self.emit.print_out(body_code)
        # 3. Create a temporary variable to store the expression
        temp_idx = frame.get_new_index()
        self.emit.print_out(self.emit.emit_write_var("switch_temp", IntType(), temp_idx, frame))
        # 4. Enter the loop scope
        frame.enter_loop()
        # 5. Get the break label and the default label
        brk_label = frame.get_break_label()
        default_label = frame.get_new_label()
        # 6. Create a list to store the case information
        case_info = []
        for case in node.cases:
            def eval_const(e):
                if isinstance(e, IntLiteral): return e.value
                if isinstance(e, PrefixOp):
                    if e.operator == "-": return -eval_const(e.operand)
                    if e.operator == "+": return eval_const(e.operand)
                if isinstance(e, BinaryOp):
                    l = eval_const(e.left)
                    r = eval_const(e.right)
                    if e.operator == "+": return l + r
                    if e.operator == "-": return l - r
                    if e.operator == "*": return l * r
                    if e.operator == "/": return l // r
                    if e.operator == "%": return l % r
                return 0
            
            case_val = eval_const(case.expr)
            case_label = frame.get_new_label()
            case_info.append((case_val, case_label, case))

        # 7. Emit the if_icmp_eq instructions
        for val, label, _ in case_info:
            self.emit.print_out(self.emit.emit_read_var("switch_temp", IntType(), temp_idx, frame))
            self.emit.print_out(self.emit.emit_push_iconst(val, frame))
            self.emit.print_out(self.emit.emit_if_icmp_eq(label, frame))
        # 8. Emit the goto instruction (goto default_label if node.default_case else brk_label)
        self.emit.print_out(self.emit.emit_goto(default_label if node.default_case else brk_label, frame))
        # 9. Visit each case
        for _, label, case in case_info:
            self.emit.print_out(self.emit.emit_label(label, frame))
            for stmt in case.statements:
                self.visit(stmt, o)
        # 10. Visit the default case
        self.emit.print_out(self.emit.emit_label(default_label, frame))
        if node.default_case:
            for stmt in node.default_case.statements:
                self.visit(stmt, o)
        # 11. Emit the break label (Label_Break:)
        self.emit.print_out(self.emit.emit_label(brk_label, frame))
        # 12. Exit the loop scope
        frame.exit_loop()
        # 13. Return the original subbody
        return o

    def visit_break_stmt(self, node: BreakStmt, o: SubBody = None):
        """Visit a break stmt."""
        # 1. Emit the goto instruction (goto Label_Break)
        self.emit.print_out(self.emit.emit_goto(o.frame.get_break_label(), o.frame))
        # 2. Return the original subbody
        return o

    def visit_continue_stmt(self, node: ContinueStmt, o: SubBody = None):
        """Visit a continue stmt."""
        # 1. Emit the goto instruction (goto Label_Continue)
        self.emit.print_out(self.emit.emit_goto(o.frame.get_continue_label(), o.frame))
        # 2. Return the original subbody
        return o

    def visit_return_stmt(self, node: ReturnStmt, o: SubBody = None):
        """Visit a return stmt."""
        # 1. If the return expression is None, return void
        if node.expr is None:
            self.emit.print_out(self.emit.emit_return(VoidType(), o.frame))
            return o
        # 2. Visit the return expression
        if isinstance(node.expr, StructLiteral):
            code, ret_type = self.visit_struct_with_type(node.expr, Access(o.frame, o.sym, is_left=False, is_first=True), self.current_return_type)
        else:
            code, ret_type = self.visit(node.expr, Access(o.frame, o.sym, is_left=False, is_first=True))
            
        # 3. Emit the return code
        self.emit.print_out(code)
        # 4. Emit the return instruction
        self.emit.print_out(self.emit.emit_return(ret_type, o.frame))
        # 5. Return the original subbody
        return o

    def visit_binary_op(self, node: BinaryOp, o: Access = None):
        """Visit a binary operation expression."""
        frame = o.frame
        # 1. Visit both operands as roots
        left_code, left_type = self.visit(node.left, Access(frame, o.sym, is_left=False, is_first=True))
        right_code, right_type = self.visit(node.right, Access(frame, o.sym, is_left=False, is_first=True))
        
        # 3. If the operator is "+", "-", "*", or "/"
        if node.operator in ["+", "-", "*", "/"]:
            # 3.1. Determine the result type
            result_type = FloatType() if is_float_type(left_type) or is_float_type(right_type) else IntType()
            code = left_code
            # 3.2. Convert left operand to float if necessary
            if is_float_type(result_type) and is_int_type(left_type):
                code += self.emit.emit_i2f(frame)
            code += right_code
            # 3.3. Convert right operand to float if necessary
            if is_float_type(result_type) and is_int_type(right_type):
                code += self.emit.emit_i2f(frame)
            # 3.4. Emit the add or mul instruction
            if node.operator in ["+", "-"]:
                code += self.emit.emit_add_op(node.operator, result_type, frame)
            else:
                code += self.emit.emit_mul_op(node.operator, result_type, frame)
            # 3.5. Return the code and result type
            return code, result_type

        # 4. If the operator is "%"
        if node.operator == "%":
            # 4.1. Return the code and result type
            return left_code + right_code + self.emit.emit_mod(frame), IntType()

        # 5. If the operator is "&&"
        if node.operator == "&&":
            # 5.1. Create a new label for the exit
            exit_label = frame.get_new_label()
            # 5.2. Emit the if_false instruction
            code = left_code + self.emit.emit_dup(frame) + self.emit.emit_if_false(exit_label, frame)
            # 5.3. Pop the left operand and emit the right operand
            code += self.emit.emit_pop(frame) + right_code
            # 5.4. Emit the label
            code += self.emit.emit_label(exit_label, frame)
            # 5.5. Return the code and result type
            return code, IntType()

        # 6. If the operator is "||"
        if node.operator == "||":
            # 6.1. Create a new label for the exit
            exit_label = frame.get_new_label()
            # 6.2. Emit the if_true instruction
            code = left_code + self.emit.emit_dup(frame) + self.emit.emit_if_true(exit_label, frame)
            # 6.3. Pop the left operand and emit the right operand
            code += self.emit.emit_pop(frame) + right_code
            # 6.4. Emit the label
            code += self.emit.emit_label(exit_label, frame)
            # 6.5. Return the code and result type
            return code, IntType()

        # 7. If the operator is "<", "<=", ">", ">=", "==", or "!="
        if node.operator in ["<", "<=", ">", ">=", "==", "!="]:
            # 7.1. Determine the result type
            op_type = FloatType() if is_float_type(left_type) or is_float_type(right_type) else IntType()
            code = left_code
            # 7.2. Convert left operand to float if necessary
            if is_float_type(op_type) and is_int_type(left_type):
                code += self.emit.emit_i2f(frame)
            code += right_code
            # 7.3. Convert right operand to float if necessary
            if is_float_type(op_type) and is_int_type(right_type):
                code += self.emit.emit_i2f(frame)
            return code + self.emit.emit_re_op(node.operator, op_type, frame), IntType()
        raise RuntimeError(f"Unsupported operator: {node.operator}")

    def visit_assign_expr(self, node: AssignExpr, o: Access = None):
        """Visit an assignment expression."""
        frame = o.frame
        # 1. Visit the left-hand side with is_left=True and is_first=True
        lhs_info, lhs_type = self.visit(node.lhs, Access(frame, o.sym, True, True))
        # 2. Visit the right-hand side as a root
        if isinstance(node.rhs, StructLiteral):
            rhs_code, _ = self.visit_struct_with_type(node.rhs, Access(frame, o.sym, False), lhs_type)
        else:
            rhs_code, _ = self.visit(node.rhs, Access(frame, o.sym, is_left=False, is_first=True))
        
        # 3. Generate the final assignment code based on LHS type
        if isinstance(node.lhs, Identifier):
            # 3.1. lhs_info is the Symbol object
            sym = lhs_info
            # 3.2. Generate code: [value] -> [value, value] -> [value]
            code = rhs_code + self.emit.emit_dup(frame) 
            code += self.emit.emit_write_var(sym.name, sym.type, sym.value.value, frame)
            return code, sym.type
            
        elif isinstance(node.lhs, MemberAccess):
            # 3.1. lhs_info is the object reference load code
            obj_code = lhs_info
            # 3.2. Get the struct name for the putfield descriptor
            _, obj_type = self.visit(node.lhs.obj, Access(frame, o.sym, is_left=False, is_first=True))
            # 3.3. Generate code: [objref, value] -> [value, objref, value] -> [value]
            code = obj_code + rhs_code + self.emit.emit_dup_x1(frame)
            code += self.emit.emit_put_field(f"{obj_type.struct_name}/{node.lhs.member}", lhs_type, frame)
            return code, lhs_type
            
        raise RuntimeError("Unsupported assignment LHS")

    def visit_func_call(self, node: FuncCall, o: Access = None):
        """Visit a function call expression."""
        frame = o.frame
        # 1. Get the function symbol and type
        fn_sym = self.functions[node.name]
        fn_type = fn_sym.type
        # 2. Visit each argument
        code = ""
        for i, arg in enumerate(node.args):
            if isinstance(arg, StructLiteral):
                arg_code, _ = self.visit_struct_with_type(arg, Access(frame, o.sym, is_left=False, is_first=True), fn_type.param_types[i])
            else:
                arg_code, _ = self.visit(arg, Access(frame, o.sym, is_left=False, is_first=True))
            code += arg_code
        # 3. Emit the invoke_static instruction
        code += self.emit.emit_invoke_static(f"{fn_sym.value.value}/{node.name}", fn_type, frame)
        # 4. Return the code and result type
        return code, fn_type.return_type

    def visit_identifier(self, node: Identifier, o: Access = None):
        """Visit an identifier expression."""
        # 1. Look up the symbol in the symbol table
        sym = self._lookup_symbol(node.name, o.sym)
        # 2. If this is an L-value
        if o.is_left:
            # 2.1. Return the symbol itself
            return sym, sym.type
        # 3. If this is an R-value
        else:
            # 3.1. Emit the read_var instruction
            return self.emit.emit_read_var(node.name, sym.type, sym.value.value, o.frame), sym.type

    def visit_int_literal(self, node: IntLiteral, o: Access = None):
        """Visit an integer literal."""
        # 1. Emit the push_iconst instruction
        return self.emit.emit_push_iconst(node.value, o.frame), IntType()

    def visit_float_literal(self, node: FloatLiteral, o: Access = None):
        """Visit a float literal."""
        # 1. Emit the push_fconst instruction
        return self.emit.emit_push_fconst(str(node.value), o.frame), FloatType()

    def visit_string_literal(self, node: StringLiteral, o: Access = None):
        """Visit a string literal."""
        # 1. Emit the push_const instruction
        return self.emit.emit_push_const(node.value, StringType(), o.frame), StringType()

    def visit_struct_decl(self, node: StructDecl, o: Any = None):
        """Visit a struct declaration."""
        # 1. Create a new emitter for the struct
        struct_emit = Emitter(f"{node.name}.j")
        struct_emit.print_out(f".class public {node.name}\n")
        struct_emit.print_out(".super java/lang/Object\n")
        # 2. Visit each member
        for member in node.members:
            jvm_type = struct_emit.get_jvm_type(member.member_type)
            # 2.1. Emit the field declaration (.field public <name> <type>)
            struct_emit.print_out(f".field public {member.name} {jvm_type}\n")
        # 3. Emit the constructor
        struct_emit.print_out("\n.method public <init>()V\n")
        struct_emit.print_out("\taload_0\n")
        struct_emit.print_out("\tinvokespecial java/lang/Object/<init>()V\n")
        struct_emit.print_out("\treturn\n")
        struct_emit.print_out(".end method\n")
        struct_emit.emit_epilog()
        return None

    def visit_member_access(self, node: MemberAccess, o: Access = None):
        """Visit a struct member access expression."""
        frame = o.frame
        # 1. Visit the object
        obj_code, obj_type = self.visit(node.obj, Access(frame, o.sym, False, o.is_first))
        # 2. Get the struct declaration and member type
        struct_decl = self.structs[obj_type.struct_name]
        member_type = next(m.member_type for m in struct_decl.members if m.name == node.member)
        # 3. If this is an L-value
        if o.is_left:
            # 3.1. Return only the object load code
            return obj_code, member_type
        # 4. If this is an R-value
        else:
            # 4.1. Emit the get_field instruction after loading the object
            return obj_code + self.emit.emit_get_field(f"{obj_type.struct_name}/{node.member}", member_type, frame), member_type

    def visit_struct_literal(self, node: StructLiteral, o: Access = None):
        """Visit a struct literal."""
        raise RuntimeError("StructLiteral must be visited with visit_struct_with_type")

    def visit_struct_with_type(self, node: StructLiteral, o: Access, target_type: StructType):
        """Helper to visit a struct literal with a specific target type."""
        # 1. Get the frame and struct declaration
        frame = o.frame
        struct_name = target_type.struct_name
        struct_decl = self.structs[struct_name]
        # 2. Emit the new_instance instruction
        code = self.emit.emit_new_instance(struct_name, frame)
        # 3. Visit each member
        for i, val in enumerate(node.values):
            code += self.emit.emit_dup(frame)
            # 3.1. Get the member type
            member_type = struct_decl.members[i].member_type
            # 3.2. Visit the value
            if isinstance(val, StructLiteral):
                val_code, _ = self.visit_struct_with_type(val, Access(frame, o.sym, is_left=False, is_first=True), member_type)
            else:
                val_code, _ = self.visit(val, Access(frame, o.sym, is_left=False, is_first=True))
            code += val_code
            # 3.3. Emit the put_field instruction
            code += self.emit.emit_put_field(f"{struct_name}/{struct_decl.members[i].name}", member_type, frame)
        return code, target_type

    def visit_prefix_op(self, node: PrefixOp, o: Access = None):
        """Visit a prefix operation expression."""
        frame = o.frame
        # 1. Check if the operator is ++ or --
        if node.operator in ["++", "--"]:
            # 1.1. Check if the operand is an L-value
            if not isinstance(node.operand, (Identifier, MemberAccess)):
                raise RuntimeError(f"Operand of {node.operator} must be an L-value")
            # 1.2. Visit the operand
            load_code, typ = self.visit(node.operand, o)
            if not is_int_type(typ):
                raise RuntimeError(f"Operator {node.operator} only supports int type")
            # 1.3. Emit the increment or decrement operation
            op_code = self.emit.emit_push_const("1", IntType(), frame)
            if node.operator == "++":
                op_code += self.emit.emit_add_op("+", IntType(), frame)
            else:
                op_code += self.emit.emit_add_op("-", IntType(), frame)
            # 1.4. Emit the store operation
            if isinstance(node.operand, Identifier):
                sym = self._lookup_symbol(node.operand.name, o.sym)
                store_code = self.emit.emit_dup(frame) + self.emit.emit_write_var(sym.name, sym.type, sym.value.value, frame)
                return load_code + op_code + store_code, typ
            else: # MemberAccess
                obj_code, obj_type = self.visit(node.operand.obj, Access(frame, o.sym, False))
                code = obj_code + self.emit.emit_dup(frame)
                code += self.emit.emit_get_field(f"{obj_type.struct_name}/{node.operand.member}", typ, frame)
                code += self.emit.emit_push_const("1", IntType(), frame)
                if node.operator == "++":
                    code += self.emit.emit_add_op("+", IntType(), frame)
                else:
                    code += self.emit.emit_add_op("-", IntType(), frame)
                code += self.emit.emit_dup_x1(frame)
                code += self.emit.emit_put_field(f"{obj_type.struct_name}/{node.operand.member}", typ, frame)
                return code, typ
        
        # 2. Visit the operand
        operand_code, operand_type = self.visit(node.operand, o)
        # 3. Emit the negation operation
        if node.operator == "!":
            label_false = frame.get_new_label()
            label_end = frame.get_new_label()
            code = operand_code + self.emit.emit_if_false(label_false, frame)
            code += self.emit.emit_push_iconst(0, frame)
            code += self.emit.emit_goto(label_end, frame)
            code += self.emit.emit_label(label_false, frame)
            code += self.emit.emit_push_iconst(1, frame)
            code += self.emit.emit_label(label_end, frame)
            return code, IntType()
        
        if node.operator == "-":
            return operand_code + self.emit.emit_neg_op(operand_type, frame), operand_type
        
        if node.operator == "+":
            return operand_code, operand_type
            
        raise RuntimeError(f"Unsupported prefix operator: {node.operator}")

    def visit_postfix_op(self, node: PostfixOp, o: Access = None):
        """Visit a postfix operation expression."""
        frame = o.frame
        # 1. Check if the operator is ++ or --
        if node.operator in ["++", "--"]:
            # 1.1. Check if the operand is an L-value
            if not isinstance(node.operand, (Identifier, MemberAccess)):
                raise RuntimeError(f"Operand of {node.operator} must be an L-value")
            # 1.2. Visit the operand
            if isinstance(node.operand, Identifier):
                sym = self._lookup_symbol(node.operand.name, o.sym)
                load_code = self.emit.emit_read_var(sym.name, sym.type, sym.value.value, frame)
                code = load_code + self.emit.emit_dup(frame)
                code += self.emit.emit_push_const("1", IntType(), frame)
                if node.operator == "++":
                    code += self.emit.emit_add_op("+", IntType(), frame)
                else:
                    code += self.emit.emit_add_op("-", IntType(), frame)
                code += self.emit.emit_write_var(sym.name, sym.type, sym.value.value, frame)
                return code, sym.type
            else: # MemberAccess
                obj_code, obj_type = self.visit(node.operand.obj, Access(frame, o.sym, False))
                code = obj_code + self.emit.emit_dup(frame)
                code += self.emit.emit_get_field(f"{obj_type.struct_name}/{node.operand.member}", IntType(), frame)
                code += self.emit.emit_dup_x1(frame)
                code += self.emit.emit_push_const("1", IntType(), frame)
                if node.operator == "++":
                    code += self.emit.emit_add_op("+", IntType(), frame)
                else:
                    code += self.emit.emit_add_op("-", IntType(), frame)
                code += self.emit.emit_put_field(f"{obj_type.struct_name}/{node.operand.member}", IntType(), frame)
                return code, IntType()
        
        raise RuntimeError(f"Unsupported postfix operator: {node.operator}")

    def visit_member_decl(self, node: MemberDecl, o: Any = None):
        """Visit a struct member declaration."""
        return None

    def visit_param(self, node: Param, o: Any = None):
        """Visit a function parameter."""
        return None

    def visit_int_type(self, node: IntType, o: Any = None):
        return node

    def visit_float_type(self, node: FloatType, o: Any = None):
        return node

    def visit_string_type(self, node: StringType, o: Any = None):
        return node

    def visit_void_type(self, node: VoidType, o: Any = None):
        return node

    def visit_struct_type(self, node: StructType, o: Any = None):
        return node
