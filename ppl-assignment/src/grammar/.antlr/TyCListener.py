# Generated from c:/Users/Admin/Documents/GitHub/ppl-assignment/src/grammar/TyC.g4 by ANTLR 4.13.1
from antlr4 import *
if "." in __name__:
    from .TyCParser import TyCParser
else:
    from TyCParser import TyCParser

# This class defines a complete listener for a parse tree produced by TyCParser.
class TyCListener(ParseTreeListener):

    # Enter a parse tree produced by TyCParser#program.
    def enterProgram(self, ctx:TyCParser.ProgramContext):
        pass

    # Exit a parse tree produced by TyCParser#program.
    def exitProgram(self, ctx:TyCParser.ProgramContext):
        pass


    # Enter a parse tree produced by TyCParser#varType.
    def enterVarType(self, ctx:TyCParser.VarTypeContext):
        pass

    # Exit a parse tree produced by TyCParser#varType.
    def exitVarType(self, ctx:TyCParser.VarTypeContext):
        pass


    # Enter a parse tree produced by TyCParser#type.
    def enterType(self, ctx:TyCParser.TypeContext):
        pass

    # Exit a parse tree produced by TyCParser#type.
    def exitType(self, ctx:TyCParser.TypeContext):
        pass


    # Enter a parse tree produced by TyCParser#structDecl.
    def enterStructDecl(self, ctx:TyCParser.StructDeclContext):
        pass

    # Exit a parse tree produced by TyCParser#structDecl.
    def exitStructDecl(self, ctx:TyCParser.StructDeclContext):
        pass


    # Enter a parse tree produced by TyCParser#funcDecl.
    def enterFuncDecl(self, ctx:TyCParser.FuncDeclContext):
        pass

    # Exit a parse tree produced by TyCParser#funcDecl.
    def exitFuncDecl(self, ctx:TyCParser.FuncDeclContext):
        pass


    # Enter a parse tree produced by TyCParser#paramList.
    def enterParamList(self, ctx:TyCParser.ParamListContext):
        pass

    # Exit a parse tree produced by TyCParser#paramList.
    def exitParamList(self, ctx:TyCParser.ParamListContext):
        pass


    # Enter a parse tree produced by TyCParser#param.
    def enterParam(self, ctx:TyCParser.ParamContext):
        pass

    # Exit a parse tree produced by TyCParser#param.
    def exitParam(self, ctx:TyCParser.ParamContext):
        pass


    # Enter a parse tree produced by TyCParser#block.
    def enterBlock(self, ctx:TyCParser.BlockContext):
        pass

    # Exit a parse tree produced by TyCParser#block.
    def exitBlock(self, ctx:TyCParser.BlockContext):
        pass


    # Enter a parse tree produced by TyCParser#stmt.
    def enterStmt(self, ctx:TyCParser.StmtContext):
        pass

    # Exit a parse tree produced by TyCParser#stmt.
    def exitStmt(self, ctx:TyCParser.StmtContext):
        pass


    # Enter a parse tree produced by TyCParser#varDecl.
    def enterVarDecl(self, ctx:TyCParser.VarDeclContext):
        pass

    # Exit a parse tree produced by TyCParser#varDecl.
    def exitVarDecl(self, ctx:TyCParser.VarDeclContext):
        pass


    # Enter a parse tree produced by TyCParser#ifStmt.
    def enterIfStmt(self, ctx:TyCParser.IfStmtContext):
        pass

    # Exit a parse tree produced by TyCParser#ifStmt.
    def exitIfStmt(self, ctx:TyCParser.IfStmtContext):
        pass


    # Enter a parse tree produced by TyCParser#whileStmt.
    def enterWhileStmt(self, ctx:TyCParser.WhileStmtContext):
        pass

    # Exit a parse tree produced by TyCParser#whileStmt.
    def exitWhileStmt(self, ctx:TyCParser.WhileStmtContext):
        pass


    # Enter a parse tree produced by TyCParser#forStmt.
    def enterForStmt(self, ctx:TyCParser.ForStmtContext):
        pass

    # Exit a parse tree produced by TyCParser#forStmt.
    def exitForStmt(self, ctx:TyCParser.ForStmtContext):
        pass


    # Enter a parse tree produced by TyCParser#forInit.
    def enterForInit(self, ctx:TyCParser.ForInitContext):
        pass

    # Exit a parse tree produced by TyCParser#forInit.
    def exitForInit(self, ctx:TyCParser.ForInitContext):
        pass


    # Enter a parse tree produced by TyCParser#forUpdate.
    def enterForUpdate(self, ctx:TyCParser.ForUpdateContext):
        pass

    # Exit a parse tree produced by TyCParser#forUpdate.
    def exitForUpdate(self, ctx:TyCParser.ForUpdateContext):
        pass


    # Enter a parse tree produced by TyCParser#varDeclNoSemi.
    def enterVarDeclNoSemi(self, ctx:TyCParser.VarDeclNoSemiContext):
        pass

    # Exit a parse tree produced by TyCParser#varDeclNoSemi.
    def exitVarDeclNoSemi(self, ctx:TyCParser.VarDeclNoSemiContext):
        pass


    # Enter a parse tree produced by TyCParser#switchStmt.
    def enterSwitchStmt(self, ctx:TyCParser.SwitchStmtContext):
        pass

    # Exit a parse tree produced by TyCParser#switchStmt.
    def exitSwitchStmt(self, ctx:TyCParser.SwitchStmtContext):
        pass


    # Enter a parse tree produced by TyCParser#caseBlock.
    def enterCaseBlock(self, ctx:TyCParser.CaseBlockContext):
        pass

    # Exit a parse tree produced by TyCParser#caseBlock.
    def exitCaseBlock(self, ctx:TyCParser.CaseBlockContext):
        pass


    # Enter a parse tree produced by TyCParser#defaultBlock.
    def enterDefaultBlock(self, ctx:TyCParser.DefaultBlockContext):
        pass

    # Exit a parse tree produced by TyCParser#defaultBlock.
    def exitDefaultBlock(self, ctx:TyCParser.DefaultBlockContext):
        pass


    # Enter a parse tree produced by TyCParser#breakStmt.
    def enterBreakStmt(self, ctx:TyCParser.BreakStmtContext):
        pass

    # Exit a parse tree produced by TyCParser#breakStmt.
    def exitBreakStmt(self, ctx:TyCParser.BreakStmtContext):
        pass


    # Enter a parse tree produced by TyCParser#continueStmt.
    def enterContinueStmt(self, ctx:TyCParser.ContinueStmtContext):
        pass

    # Exit a parse tree produced by TyCParser#continueStmt.
    def exitContinueStmt(self, ctx:TyCParser.ContinueStmtContext):
        pass


    # Enter a parse tree produced by TyCParser#returnStmt.
    def enterReturnStmt(self, ctx:TyCParser.ReturnStmtContext):
        pass

    # Exit a parse tree produced by TyCParser#returnStmt.
    def exitReturnStmt(self, ctx:TyCParser.ReturnStmtContext):
        pass


    # Enter a parse tree produced by TyCParser#exprStmt.
    def enterExprStmt(self, ctx:TyCParser.ExprStmtContext):
        pass

    # Exit a parse tree produced by TyCParser#exprStmt.
    def exitExprStmt(self, ctx:TyCParser.ExprStmtContext):
        pass


    # Enter a parse tree produced by TyCParser#StructLiteralExpr.
    def enterStructLiteralExpr(self, ctx:TyCParser.StructLiteralExprContext):
        pass

    # Exit a parse tree produced by TyCParser#StructLiteralExpr.
    def exitStructLiteralExpr(self, ctx:TyCParser.StructLiteralExprContext):
        pass


    # Enter a parse tree produced by TyCParser#RelationalExpr.
    def enterRelationalExpr(self, ctx:TyCParser.RelationalExprContext):
        pass

    # Exit a parse tree produced by TyCParser#RelationalExpr.
    def exitRelationalExpr(self, ctx:TyCParser.RelationalExprContext):
        pass


    # Enter a parse tree produced by TyCParser#UnaryExpr.
    def enterUnaryExpr(self, ctx:TyCParser.UnaryExprContext):
        pass

    # Exit a parse tree produced by TyCParser#UnaryExpr.
    def exitUnaryExpr(self, ctx:TyCParser.UnaryExprContext):
        pass


    # Enter a parse tree produced by TyCParser#LogicalAndExpr.
    def enterLogicalAndExpr(self, ctx:TyCParser.LogicalAndExprContext):
        pass

    # Exit a parse tree produced by TyCParser#LogicalAndExpr.
    def exitLogicalAndExpr(self, ctx:TyCParser.LogicalAndExprContext):
        pass


    # Enter a parse tree produced by TyCParser#PrefixExpr.
    def enterPrefixExpr(self, ctx:TyCParser.PrefixExprContext):
        pass

    # Exit a parse tree produced by TyCParser#PrefixExpr.
    def exitPrefixExpr(self, ctx:TyCParser.PrefixExprContext):
        pass


    # Enter a parse tree produced by TyCParser#AssignExpr.
    def enterAssignExpr(self, ctx:TyCParser.AssignExprContext):
        pass

    # Exit a parse tree produced by TyCParser#AssignExpr.
    def exitAssignExpr(self, ctx:TyCParser.AssignExprContext):
        pass


    # Enter a parse tree produced by TyCParser#PostfixExpr.
    def enterPostfixExpr(self, ctx:TyCParser.PostfixExprContext):
        pass

    # Exit a parse tree produced by TyCParser#PostfixExpr.
    def exitPostfixExpr(self, ctx:TyCParser.PostfixExprContext):
        pass


    # Enter a parse tree produced by TyCParser#LogicalOrExpr.
    def enterLogicalOrExpr(self, ctx:TyCParser.LogicalOrExprContext):
        pass

    # Exit a parse tree produced by TyCParser#LogicalOrExpr.
    def exitLogicalOrExpr(self, ctx:TyCParser.LogicalOrExprContext):
        pass


    # Enter a parse tree produced by TyCParser#EqualityExpr.
    def enterEqualityExpr(self, ctx:TyCParser.EqualityExprContext):
        pass

    # Exit a parse tree produced by TyCParser#EqualityExpr.
    def exitEqualityExpr(self, ctx:TyCParser.EqualityExprContext):
        pass


    # Enter a parse tree produced by TyCParser#MulDivModExpr.
    def enterMulDivModExpr(self, ctx:TyCParser.MulDivModExprContext):
        pass

    # Exit a parse tree produced by TyCParser#MulDivModExpr.
    def exitMulDivModExpr(self, ctx:TyCParser.MulDivModExprContext):
        pass


    # Enter a parse tree produced by TyCParser#IdentifierExpr.
    def enterIdentifierExpr(self, ctx:TyCParser.IdentifierExprContext):
        pass

    # Exit a parse tree produced by TyCParser#IdentifierExpr.
    def exitIdentifierExpr(self, ctx:TyCParser.IdentifierExprContext):
        pass


    # Enter a parse tree produced by TyCParser#LiteralExpr.
    def enterLiteralExpr(self, ctx:TyCParser.LiteralExprContext):
        pass

    # Exit a parse tree produced by TyCParser#LiteralExpr.
    def exitLiteralExpr(self, ctx:TyCParser.LiteralExprContext):
        pass


    # Enter a parse tree produced by TyCParser#ParenExpr.
    def enterParenExpr(self, ctx:TyCParser.ParenExprContext):
        pass

    # Exit a parse tree produced by TyCParser#ParenExpr.
    def exitParenExpr(self, ctx:TyCParser.ParenExprContext):
        pass


    # Enter a parse tree produced by TyCParser#MemberAccessExpr.
    def enterMemberAccessExpr(self, ctx:TyCParser.MemberAccessExprContext):
        pass

    # Exit a parse tree produced by TyCParser#MemberAccessExpr.
    def exitMemberAccessExpr(self, ctx:TyCParser.MemberAccessExprContext):
        pass


    # Enter a parse tree produced by TyCParser#AddSubExpr.
    def enterAddSubExpr(self, ctx:TyCParser.AddSubExprContext):
        pass

    # Exit a parse tree produced by TyCParser#AddSubExpr.
    def exitAddSubExpr(self, ctx:TyCParser.AddSubExprContext):
        pass


    # Enter a parse tree produced by TyCParser#FuncCallExpr.
    def enterFuncCallExpr(self, ctx:TyCParser.FuncCallExprContext):
        pass

    # Exit a parse tree produced by TyCParser#FuncCallExpr.
    def exitFuncCallExpr(self, ctx:TyCParser.FuncCallExprContext):
        pass


    # Enter a parse tree produced by TyCParser#funcCall.
    def enterFuncCall(self, ctx:TyCParser.FuncCallContext):
        pass

    # Exit a parse tree produced by TyCParser#funcCall.
    def exitFuncCall(self, ctx:TyCParser.FuncCallContext):
        pass


    # Enter a parse tree produced by TyCParser#MemberLvalue.
    def enterMemberLvalue(self, ctx:TyCParser.MemberLvalueContext):
        pass

    # Exit a parse tree produced by TyCParser#MemberLvalue.
    def exitMemberLvalue(self, ctx:TyCParser.MemberLvalueContext):
        pass


    # Enter a parse tree produced by TyCParser#CallMemberLvalue.
    def enterCallMemberLvalue(self, ctx:TyCParser.CallMemberLvalueContext):
        pass

    # Exit a parse tree produced by TyCParser#CallMemberLvalue.
    def exitCallMemberLvalue(self, ctx:TyCParser.CallMemberLvalueContext):
        pass


    # Enter a parse tree produced by TyCParser#incOperand.
    def enterIncOperand(self, ctx:TyCParser.IncOperandContext):
        pass

    # Exit a parse tree produced by TyCParser#incOperand.
    def exitIncOperand(self, ctx:TyCParser.IncOperandContext):
        pass


    # Enter a parse tree produced by TyCParser#argList.
    def enterArgList(self, ctx:TyCParser.ArgListContext):
        pass

    # Exit a parse tree produced by TyCParser#argList.
    def exitArgList(self, ctx:TyCParser.ArgListContext):
        pass


    # Enter a parse tree produced by TyCParser#exprList.
    def enterExprList(self, ctx:TyCParser.ExprListContext):
        pass

    # Exit a parse tree produced by TyCParser#exprList.
    def exitExprList(self, ctx:TyCParser.ExprListContext):
        pass


    # Enter a parse tree produced by TyCParser#literal.
    def enterLiteral(self, ctx:TyCParser.LiteralContext):
        pass

    # Exit a parse tree produced by TyCParser#literal.
    def exitLiteral(self, ctx:TyCParser.LiteralContext):
        pass



del TyCParser