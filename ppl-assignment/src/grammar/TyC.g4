grammar TyC;

@lexer::header {
# from src.grammar.lexererr import *
from lexererr import *
}

@lexer::members {
def emit(self):
    tk = self.type
    if tk == self.UNCLOSE_STRING:       
        result = super().emit();
        raise UncloseString(result.text);
    elif tk == self.ILLEGAL_ESCAPE:
        result = super().emit();
        raise IllegalEscape(result.text);
    elif tk == self.ERROR_CHAR:
        result = super().emit();
        raise ErrorToken(result.text); 
    else:
        return super().emit();
}

options{
	language = Python3;
}

program: (structDecl | funcDecl)* EOF;

varType: 'int' | 'float' | 'string' | IDENT;

type: varType | 'void';

structDecl: 'struct' IDENT '{' (varType IDENT ';')* '}' ';';

funcDecl: type? IDENT '(' paramList? ')' block;

paramList: param (',' param)*;

param: varType IDENT;

block: '{' stmt* '}';

stmt:
	varDecl
	| ifStmt
	| whileStmt
	| forStmt
	| switchStmt
	| breakStmt
	| continueStmt
	| returnStmt
	| exprStmt
	| block;

varDecl: ('auto' | varType) IDENT ('=' expr)? ';';

ifStmt: 'if' '(' expr ')' stmt ('else' stmt)?;

whileStmt: 'while' '(' expr ')' stmt;

forStmt: 'for' '(' forInit? ';' expr? ';' forUpdate? ')' stmt;

forInit: varDeclNoSemi | lvalue '=' expr;

forUpdate:
	lvalue '=' expr
	| (lvalue | funcCall) ('++' | '--')
	| ('++' | '--') (lvalue | funcCall);

varDeclNoSemi: ('auto' | varType) IDENT ('=' expr)?;

switchStmt:
	'switch' '(' expr ')' '{' caseBlock* defaultBlock? caseBlock* '}';

caseBlock: 'case' expr ':' stmt*;

defaultBlock: 'default' ':' stmt*;

breakStmt: 'break' ';';

continueStmt: 'continue' ';';

returnStmt: 'return' expr? ';';

exprStmt: expr ';';

expr:
	expr '.' IDENT								# MemberAccessExpr
	| expr op = ('++' | '--')					# PostfixExpr
	| op = ('++' | '--') incOperand				# PrefixExpr
	| op = ('!' | '-' | '+') expr				# UnaryExpr
	| expr op = ('*' | '/' | '%') expr			# MulDivModExpr
	| expr op = ('+' | '-') expr				# AddSubExpr
	| expr op = ('<' | '<=' | '>' | '>=') expr	# RelationalExpr
	| expr op = ('==' | '!=') expr				# EqualityExpr
	| expr op = '&&' expr						# LogicalAndExpr
	| expr op = '||' expr						# LogicalOrExpr
	| <assoc = right> lvalue '=' expr			# AssignExpr
	| funcCall									# FuncCallExpr
	| '(' expr ')'								# ParenExpr
	| '{' exprList? '}'							# StructLiteralExpr
	| literal									# LiteralExpr
	| IDENT										# IdentifierExpr;

funcCall: IDENT '(' argList? ')';

lvalue:
	IDENT ('.' IDENT)*					# MemberLvalue
	| funcCall '.' IDENT ('.' IDENT)*	# CallMemberLvalue;

incOperand: ('++' | '--')* (
		lvalue
		| funcCall
		| literal
		| '(' expr ')'
		| '{' exprList? '}'
	) ('++' | '--')*;

argList: expr (',' expr)*;

exprList: expr (',' expr)*;

literal: INT_LIT | FLOAT_LIT | STRING_LIT;

AUTO: 'auto';
BREAK: 'break';
CASE: 'case';
CONTINUE: 'continue';
DEFAULT: 'default';
ELSE: 'else';
FLOAT: 'float';
FOR: 'for';
IF: 'if';
INT: 'int';
RETURN: 'return';
STRING: 'string';
STRUCT: 'struct';
SWITCH: 'switch';
VOID: 'void';
WHILE: 'while';

IDENT: [a-zA-Z_][a-zA-Z_0-9]*;

INT_LIT: [0-9]+;

FLOAT_LIT:
	[0-9]+ '.' [0-9]* ([eE] [+-]? [0-9]+)?
	| [0-9]+ [eE] [+-]? [0-9]+
	| '.' [0-9]+ ([eE] [+-]? [0-9]+)?;

STRING_LIT:
	'"' (ESC_SEQ | ~["\\\n\r])* '"' {
text = self.text[1:-1]
self.text = text
          };

fragment ESC_SEQ: '\\' [bfnrt"\\];

BLOCK_COMMENT: '/*' .*? '*/' -> skip;

LINE_COMMENT: '//' ~[\r\n]* -> skip;

WS: [ \t\r\n\f]+ -> skip;

ILLEGAL_ESCAPE:
	'"' (ESC_SEQ | ~["\\\n\r])* '\\' ~[bfnrt"\\\n\r] {
self.text = self.text[1:]
              };

UNCLOSE_STRING:
	'"' (ESC_SEQ | ~["\\\n\r])* '\\'? {
self.text = self.text[1:]
              };

ERROR_CHAR: .;