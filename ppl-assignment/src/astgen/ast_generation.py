from build.TyCVisitor import TyCVisitor
from build.TyCParser import TyCParser
from src.utils.nodes import *
from functools import reduce


class ASTGeneration(TyCVisitor):

    def visitProgram(self, ctx: TyCParser.ProgramContext):
        decls = reduce(lambda acc, child: acc + [self.visit(child)]
                       if isinstance(child, (TyCParser.StructDeclContext, TyCParser.FuncDeclContext))
                       else acc,
                       ctx.getChildren(),
                       [],
                       )
        return Program(decls)

    def visitStructDecl(self, ctx: TyCParser.StructDeclContext):
        idents = ctx.IDENT()
        members = [
            MemberDecl(self.visit(var_type_ctx), ident.getText())
            for var_type_ctx, ident in zip(ctx.varType(), idents[1:])
        ]
        return StructDecl(idents[0].getText(), members)

    def visitVarType(self, ctx: TyCParser.VarTypeContext):
        text = ctx.getText()
        if text == 'int':
            return IntType()
        elif text == 'float':
            return FloatType()
        elif text == 'string':
            return StringType()
        return StructType(text)

    def visitType(self, ctx: TyCParser.TypeContext):
        return self.visit(ctx.varType()) if ctx.varType() else VoidType()

    def visitFuncDecl(self, ctx: TyCParser.FuncDeclContext):
        return_type = self.visit(ctx.type_()) if ctx.type_() else None
        params = [self.visit(p) for p in ctx.paramList(
        ).param()] if ctx.paramList() else []
        body = self.visit(ctx.block())
        return FuncDecl(return_type, ctx.IDENT().getText(), params, body)

    def visitParam(self, ctx: TyCParser.ParamContext):
        param_type = self.visit(ctx.varType())
        return Param(param_type, ctx.IDENT().getText())

    def visitBlock(self, ctx: TyCParser.BlockContext):
        statements = [self.visit(stmt) for stmt in ctx.stmt()]
        return BlockStmt(statements)

    def visitStmt(self, ctx: TyCParser.StmtContext):
        return self.visit(ctx.getChild(0))

    def visitVarDecl(self, ctx: TyCParser.VarDeclContext):
        var_type = self.visit(ctx.varType()) if ctx.getChild(
            0).getText() != 'auto' else None
        init_value = self.visit(ctx.expr()) if ctx.expr() else None
        return VarDecl(var_type, ctx.IDENT().getText(), init_value)

    def visitIfStmt(self, ctx: TyCParser.IfStmtContext):
        condition = self.visit(ctx.expr())
        then_stmt = self.visit(ctx.stmt(0))
        else_stmt = self.visit(ctx.stmt(1)) if len(ctx.stmt()) > 1 else None
        return IfStmt(condition, then_stmt, else_stmt)

    def visitWhileStmt(self, ctx: TyCParser.WhileStmtContext):
        condition = self.visit(ctx.expr())
        body = self.visit(ctx.stmt())
        return WhileStmt(condition, body)

    def visitForStmt(self, ctx: TyCParser.ForStmtContext):
        init = self.visit(ctx.forInit()) if ctx.forInit() else None
        condition = self.visit(ctx.expr()) if ctx.expr() else None
        update = self.visit(ctx.forUpdate()) if ctx.forUpdate() else None
        body = self.visit(ctx.stmt())
        return ForStmt(init, condition, update, body)

    def visitForInit(self, ctx: TyCParser.ForInitContext):
        if ctx.varDeclNoSemi():
            return self.visit(ctx.varDeclNoSemi())
        lhs = self.visit(ctx.lvalue())
        rhs = self.visit(ctx.expr())
        return ExprStmt(AssignExpr(lhs, rhs))

    def visitForUpdate(self, ctx: TyCParser.ForUpdateContext):
        if ctx.expr() and ctx.lvalue():
            lhs = self.visit(ctx.lvalue())
            rhs = self.visit(ctx.expr())
            return AssignExpr(lhs, rhs)

        operand_ctx = ctx.lvalue() if ctx.lvalue() else (
            ctx.funcCall() if ctx.funcCall() else None
        )
        if operand_ctx is None:
            return None
        operand = self.visit(operand_ctx)
        operator = ctx.getChild(0).getText()
        if operator in ('++', '--'):
            return PrefixOp(operator, operand)

        operator = ctx.getChild(1).getText()
        return PostfixOp(operator, operand)

    def visitVarDeclNoSemi(self, ctx: TyCParser.VarDeclNoSemiContext):
        var_type = self.visit(ctx.varType()) if ctx.getChild(
            0).getText() != 'auto' else None
        init_value = self.visit(ctx.expr()) if ctx.expr() else None
        return VarDecl(var_type, ctx.IDENT().getText(), init_value)

    def visitSwitchStmt(self, ctx: TyCParser.SwitchStmtContext):
        expr = self.visit(ctx.expr())
        cases = [self.visit(case_ctx) for case_ctx in ctx.caseBlock()]
        default_case = self.visit(
            ctx.defaultBlock()) if ctx.defaultBlock() else None
        return SwitchStmt(expr, cases, default_case)

    def visitCaseBlock(self, ctx: TyCParser.CaseBlockContext):
        expr = self.visit(ctx.expr())
        statements = [self.visit(s) for s in ctx.stmt()]
        return CaseStmt(expr, statements)

    def visitDefaultBlock(self, ctx: TyCParser.DefaultBlockContext):
        statements = [self.visit(s) for s in ctx.stmt()]
        return DefaultStmt(statements)

    def visitBreakStmt(self, ctx: TyCParser.BreakStmtContext):
        return BreakStmt()

    def visitContinueStmt(self, ctx: TyCParser.ContinueStmtContext):
        return ContinueStmt()

    def visitReturnStmt(self, ctx: TyCParser.ReturnStmtContext):
        expr = self.visit(ctx.expr()) if ctx.expr() else None
        return ReturnStmt(expr)

    def visitExprStmt(self, ctx: TyCParser.ExprStmtContext):
        expr = self.visit(ctx.expr())
        return ExprStmt(expr)

    def visitMemberAccessExpr(self, ctx: TyCParser.MemberAccessExprContext):
        obj = self.visit(ctx.expr())
        member = ctx.IDENT().getText()
        return MemberAccess(obj, member)

    def visitPostfixExpr(self, ctx: TyCParser.PostfixExprContext):
        operator = ctx.getChild(1).getText()
        operand = self.visit(ctx.expr())
        return PostfixOp(operator, operand)

    def visitPrefixExpr(self, ctx: TyCParser.PrefixExprContext):
        operator = ctx.getChild(0).getText()
        operand_ctx = ctx.expr() if hasattr(ctx, "expr") else ctx.incOperand()
        operand = self.visit(operand_ctx)
        return PrefixOp(operator, operand)

    def visitUnaryExpr(self, ctx: TyCParser.UnaryExprContext):
        operator = ctx.getChild(0).getText()
        operand = self.visit(ctx.expr())
        return PrefixOp(operator, operand)

    def visitMulDivModExpr(self, ctx: TyCParser.MulDivModExprContext):
        left = self.visit(ctx.expr(0))
        operator = ctx.getChild(1).getText()
        right = self.visit(ctx.expr(1))
        return BinaryOp(left, operator, right)

    def visitAddSubExpr(self, ctx: TyCParser.AddSubExprContext):
        left = self.visit(ctx.expr(0))
        operator = ctx.getChild(1).getText()
        right = self.visit(ctx.expr(1))
        return BinaryOp(left, operator, right)

    def visitRelationalExpr(self, ctx: TyCParser.RelationalExprContext):
        left = self.visit(ctx.expr(0))
        operator = ctx.getChild(1).getText()
        right = self.visit(ctx.expr(1))
        return BinaryOp(left, operator, right)

    def visitEqualityExpr(self, ctx: TyCParser.EqualityExprContext):
        left = self.visit(ctx.expr(0))
        operator = ctx.getChild(1).getText()
        right = self.visit(ctx.expr(1))
        return BinaryOp(left, operator, right)

    def visitLogicalAndExpr(self, ctx: TyCParser.LogicalAndExprContext):
        left = self.visit(ctx.expr(0))
        operator = ctx.getChild(1).getText()
        right = self.visit(ctx.expr(1))
        return BinaryOp(left, operator, right)

    def visitLogicalOrExpr(self, ctx: TyCParser.LogicalOrExprContext):
        left = self.visit(ctx.expr(0))
        operator = ctx.getChild(1).getText()
        right = self.visit(ctx.expr(1))
        return BinaryOp(left, operator, right)

    def visitAssignExpr(self, ctx: TyCParser.AssignExprContext):
        lhs = self.visit(ctx.lvalue())
        rhs = self.visit(ctx.expr())
        return AssignExpr(lhs, rhs)

    def visitFuncCallExpr(self, ctx: TyCParser.FuncCallExprContext):
        return self.visit(ctx.funcCall())

    def visitFuncCall(self, ctx: TyCParser.FuncCallContext):
        args = self.visit(ctx.argList()) if ctx.argList() else []
        return FuncCall(ctx.IDENT().getText(), args)

    def visitParenExpr(self, ctx: TyCParser.ParenExprContext):
        return self.visit(ctx.expr())

    def visitStructLiteralExpr(self, ctx: TyCParser.StructLiteralExprContext):
        values = self.visit(ctx.exprList()) if ctx.exprList() else []
        return StructLiteral(values)

    def visitLiteralExpr(self, ctx: TyCParser.LiteralExprContext):
        return self.visit(ctx.literal())

    def visitIdentifierExpr(self, ctx: TyCParser.IdentifierExprContext):
        return Identifier(ctx.IDENT().getText())

    def visitMemberLvalue(self, ctx: TyCParser.MemberLvalueContext):
        idents = ctx.IDENT()
        base = Identifier(idents[0].getText())
        members = [ident.getText() for ident in idents[1:]]
        return reduce(lambda acc, member: MemberAccess(acc, member), members, base)

    def visitCallMemberLvalue(self, ctx: TyCParser.CallMemberLvalueContext):
        base = self.visit(ctx.funcCall())
        members = [ident.getText() for ident in ctx.IDENT()]
        return reduce(lambda acc, member: MemberAccess(acc, member), members, base)

    def visitIncOperand(self, ctx: TyCParser.IncOperandContext):
        child_texts = [child.getText() for child in ctx.getChildren()]
        prefix_ops = []
        postfix_ops = []

        i = 0
        while i < len(child_texts) and child_texts[i] in ('++', '--'):
            prefix_ops.append(child_texts[i])
            i += 1

        j = len(child_texts) - 1
        while j >= i and child_texts[j] in ('++', '--'):
            postfix_ops.append(child_texts[j])
            j -= 1
        postfix_ops.reverse()

        if ctx.lvalue() or ctx.funcCall():
            operand_ctx = ctx.lvalue() if ctx.lvalue() else ctx.funcCall()
            operand = self.visit(operand_ctx)
        elif ctx.literal():
            operand = self.visit(ctx.literal())
        elif ctx.expr():
            operand = self.visit(ctx.expr())
        else:
            values = self.visit(ctx.exprList()) if ctx.exprList() else []
            operand = StructLiteral(values)

        for op in postfix_ops:
            operand = PostfixOp(op, operand)
        for op in reversed(prefix_ops):
            operand = PrefixOp(op, operand)
        return operand

    def visitLiteral(self, ctx: TyCParser.LiteralContext):
        if ctx.INT_LIT():
            return IntLiteral(int(ctx.INT_LIT().getText()))
        elif ctx.FLOAT_LIT():
            return FloatLiteral(float(ctx.FLOAT_LIT().getText()))
        elif ctx.STRING_LIT():
            val = ctx.STRING_LIT().getText()
            return StringLiteral(val)
        return None

    def visitArgList(self, ctx: TyCParser.ArgListContext):
        return [self.visit(e) for e in ctx.expr()]

    def visitExprList(self, ctx: TyCParser.ExprListContext):
        return [self.visit(e) for e in ctx.expr()]
