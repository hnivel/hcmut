"""
TyC AST Generation Tests
106 comprehensive tests covering all AST node types
Following the TyC specification
"""

import pytest
from tests.utils import ASTGenerator


# ============================================================================
# PROGRAM STRUCTURE (Tests 001-005)
# ============================================================================

def test_001_ast_empty_program():
    """001. Empty program"""
    source = ''
    expected = 'Program([])'
    assert str(ASTGenerator(source).generate()) == expected


def test_002_ast_program_single_function():
    """002. Program with single function"""
    source = 'void main() {}'
    expected = 'Program([FuncDecl(VoidType(), main, [], [])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_003_ast_program_multiple_functions():
    """003. Program with multiple functions"""
    source = 'void foo() {} void bar() {}'
    expected = 'Program([FuncDecl(VoidType(), foo, [], []), FuncDecl(VoidType(), bar, [], [])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_004_ast_program_struct_and_function():
    """004. Program with struct and function"""
    source = 'struct Point { int x; }; void main() {}'
    expected = 'Program([StructDecl(Point, [MemberDecl(IntType(), x)]), FuncDecl(VoidType(), main, [], [])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_005_ast_program_multiple_structs():
    """005. Program with multiple structs"""
    source = 'struct A { int x; }; struct B { float y; };'
    expected = 'Program([StructDecl(A, [MemberDecl(IntType(), x)]), StructDecl(B, [MemberDecl(FloatType(), y)])])'
    assert str(ASTGenerator(source).generate()) == expected


# ============================================================================
# STRUCT DECLARATIONS (Tests 006-015)
# ============================================================================

def test_006_ast_struct_empty():
    """006. Empty struct"""
    source = 'struct Empty {};'
    expected = 'Program([StructDecl(Empty, [])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_007_ast_struct_single_int_member():
    """007. Struct with single int member"""
    source = 'struct S { int x; };'
    expected = 'Program([StructDecl(S, [MemberDecl(IntType(), x)])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_008_ast_struct_single_float_member():
    """008. Struct with single float member"""
    source = 'struct S { float f; };'
    expected = 'Program([StructDecl(S, [MemberDecl(FloatType(), f)])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_009_ast_struct_single_string_member():
    """009. Struct with single string member"""
    source = 'struct S { string s; };'
    expected = 'Program([StructDecl(S, [MemberDecl(StringType(), s)])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_010_ast_struct_multiple_members():
    """010. Struct with multiple members"""
    source = 'struct Point { int x; int y; };'
    expected = 'Program([StructDecl(Point, [MemberDecl(IntType(), x), MemberDecl(IntType(), y)])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_011_ast_struct_mixed_types():
    """011. Struct with mixed types"""
    source = 'struct Person { string name; int age; float height; };'
    expected = 'Program([StructDecl(Person, [MemberDecl(StringType(), name), MemberDecl(IntType(), age), MemberDecl(FloatType(), height)])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_012_ast_struct_nested_type():
    """012. Struct with nested struct type"""
    source = 'struct Point { int x; }; struct Line { Point start; Point end; };'
    expected = 'Program([StructDecl(Point, [MemberDecl(IntType(), x)]), StructDecl(Line, [MemberDecl(StructType(Point), start), MemberDecl(StructType(Point), end)])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_013_ast_struct_struct_member():
    """013. Struct with struct-typed member"""
    source = 'struct Point { int x; }; struct S { Point p; };'
    expected = 'Program([StructDecl(Point, [MemberDecl(IntType(), x)]), StructDecl(S, [MemberDecl(StructType(Point), p)])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_014_ast_struct_many_members():
    """014. Struct with many members"""
    source = 'struct Big { int a; int b; int c; int d; int e; };'
    expected = 'Program([StructDecl(Big, [MemberDecl(IntType(), a), MemberDecl(IntType(), b), MemberDecl(IntType(), c), MemberDecl(IntType(), d), MemberDecl(IntType(), e)])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_015_ast_struct_identifier_type():
    """015. Struct with custom type member"""
    source = 'struct Node { Node next; };'
    expected = 'Program([StructDecl(Node, [MemberDecl(StructType(Node), next)])])'
    assert str(ASTGenerator(source).generate()) == expected


# ============================================================================
# FUNCTION DECLARATIONS (Tests 016-025)
# ============================================================================

def test_016_ast_func_void_no_params():
    """016. Function with void return, no params"""
    source = 'void main() {}'
    expected = 'Program([FuncDecl(VoidType(), main, [], [])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_017_ast_func_int_return():
    """017. Function with int return type"""
    source = 'int foo() { return 0; }'
    expected = 'Program([FuncDecl(IntType(), foo, [], [ReturnStmt(return IntLiteral(0))])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_018_ast_func_float_return():
    """018. Function with float return type"""
    source = 'float bar() { return 0.0; }'
    expected = 'Program([FuncDecl(FloatType(), bar, [], [ReturnStmt(return FloatLiteral(0.0))])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_019_ast_func_string_return():
    """019. Function with string return type"""
    source = 'string getName() { return "test"; }'
    expected = "Program([FuncDecl(StringType(), getName, [], [ReturnStmt(return StringLiteral('test'))])])"
    assert str(ASTGenerator(source).generate()) == expected


def test_020_ast_func_inferred_return():
    """020. Function with inferred return type"""
    source = 'foo() { return 1; }'
    expected = 'Program([FuncDecl(auto, foo, [], [ReturnStmt(return IntLiteral(1))])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_021_ast_func_single_param():
    """021. Function with single parameter"""
    source = 'void foo(int x) {}'
    expected = 'Program([FuncDecl(VoidType(), foo, [Param(IntType(), x)], [])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_022_ast_func_multiple_params():
    """022. Function with multiple parameters"""
    source = 'int add(int a, int b) { return a; }'
    expected = 'Program([FuncDecl(IntType(), add, [Param(IntType(), a), Param(IntType(), b)], [ReturnStmt(return Identifier(a))])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_023_ast_func_mixed_param_types():
    """023. Function with mixed parameter types"""
    source = 'void process(int x, float y, string s) {}'
    expected = 'Program([FuncDecl(VoidType(), process, [Param(IntType(), x), Param(FloatType(), y), Param(StringType(), s)], [])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_024_ast_func_struct_param():
    """024. Function with struct parameter"""
    source = 'struct Point { int x; }; void draw(Point p) {}'
    expected = 'Program([StructDecl(Point, [MemberDecl(IntType(), x)]), FuncDecl(VoidType(), draw, [Param(StructType(Point), p)], [])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_025_ast_func_struct_return():
    """025. Function with struct return type"""
    source = 'struct Point { int x; }; Point create() { return {0}; }'
    expected = 'Program([StructDecl(Point, [MemberDecl(IntType(), x)]), FuncDecl(StructType(Point), create, [], [ReturnStmt(return StructLiteral({IntLiteral(0)}))])])'
    assert str(ASTGenerator(source).generate()) == expected


# ============================================================================
# VARIABLE DECLARATIONS (Tests 026-035)
# ============================================================================

def test_026_ast_var_auto_no_init():
    """026. Variable with auto, no initialization"""
    source = 'void main() { auto x; }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [VarDecl(auto, x)])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_027_ast_var_auto_with_int():
    """027. Variable with auto, int initialization"""
    source = 'void main() { auto x = 10; }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [VarDecl(auto, x = IntLiteral(10))])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_028_ast_var_auto_with_float():
    """028. Variable with auto, float initialization"""
    source = 'void main() { auto x = 3.14; }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [VarDecl(auto, x = FloatLiteral(3.14))])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_029_ast_var_auto_with_string():
    """029. Variable with auto, string initialization"""
    source = 'void main() { auto x = "hello"; }'
    expected = "Program([FuncDecl(VoidType(), main, [], [VarDecl(auto, x = StringLiteral('hello'))])])"
    assert str(ASTGenerator(source).generate()) == expected


def test_030_ast_var_int_no_init():
    """030. Variable with int type, no initialization"""
    source = 'void main() { int x; }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [VarDecl(IntType(), x)])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_031_ast_var_int_with_init():
    """031. Variable with int type and initialization"""
    source = 'void main() { int x = 5; }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [VarDecl(IntType(), x = IntLiteral(5))])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_032_ast_var_float_with_init():
    """032. Variable with float type and initialization"""
    source = 'void main() { float f = 2.5; }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [VarDecl(FloatType(), f = FloatLiteral(2.5))])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_033_ast_var_string_with_init():
    """033. Variable with string type and initialization"""
    source = 'void main() { string s = "test"; }'
    expected = "Program([FuncDecl(VoidType(), main, [], [VarDecl(StringType(), s = StringLiteral('test'))])])"
    assert str(ASTGenerator(source).generate()) == expected


def test_034_ast_var_struct_type():
    """034. Variable with struct type"""
    source = 'struct Point { int x; }; void main() { Point p; }'
    expected = 'Program([StructDecl(Point, [MemberDecl(IntType(), x)]), FuncDecl(VoidType(), main, [], [VarDecl(StructType(Point), p)])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_035_ast_var_struct_with_init():
    """035. Variable with struct type and initialization"""
    source = 'struct Point { int x; }; void main() { Point p = {10}; }'
    expected = 'Program([StructDecl(Point, [MemberDecl(IntType(), x)]), FuncDecl(VoidType(), main, [], [VarDecl(StructType(Point), p = StructLiteral({IntLiteral(10)}))])])'
    assert str(ASTGenerator(source).generate()) == expected


# ============================================================================
# IF STATEMENTS (Tests 036-040)
# ============================================================================

def test_036_ast_if_simple():
    """036. Simple if statement"""
    source = 'void main() { if (1) x = 1; }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [IfStmt(if IntLiteral(1) then ExprStmt(AssignExpr(Identifier(x) = IntLiteral(1))))])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_037_ast_if_with_block():
    """037. If statement with block"""
    source = 'void main() { if (x) { y = 1; } }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [IfStmt(if Identifier(x) then BlockStmt([ExprStmt(AssignExpr(Identifier(y) = IntLiteral(1)))]))])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_038_ast_if_else():
    """038. If-else statement"""
    source = 'void main() { if (x) y = 1; else y = 0; }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [IfStmt(if Identifier(x) then ExprStmt(AssignExpr(Identifier(y) = IntLiteral(1))), else ExprStmt(AssignExpr(Identifier(y) = IntLiteral(0))))])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_039_ast_if_else_blocks():
    """039. If-else with blocks"""
    source = 'void main() { if (x) { a = 1; } else { b = 2; } }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [IfStmt(if Identifier(x) then BlockStmt([ExprStmt(AssignExpr(Identifier(a) = IntLiteral(1)))]), else BlockStmt([ExprStmt(AssignExpr(Identifier(b) = IntLiteral(2)))]))])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_040_ast_if_nested():
    """040. Nested if statements"""
    source = 'void main() { if (a) if (b) c = 1; }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [IfStmt(if Identifier(a) then IfStmt(if Identifier(b) then ExprStmt(AssignExpr(Identifier(c) = IntLiteral(1)))))])])'
    assert str(ASTGenerator(source).generate()) == expected


# ============================================================================
# WHILE STATEMENTS (Tests 041-045)
# ============================================================================

def test_041_ast_while_simple():
    """041. Simple while statement"""
    source = 'void main() { while (1) x = 1; }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [WhileStmt(while IntLiteral(1) do ExprStmt(AssignExpr(Identifier(x) = IntLiteral(1))))])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_042_ast_while_with_block():
    """042. While with block"""
    source = 'void main() { while (x) { y = y + 1; } }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [WhileStmt(while Identifier(x) do BlockStmt([ExprStmt(AssignExpr(Identifier(y) = BinaryOp(Identifier(y), +, IntLiteral(1))))]))])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_043_ast_while_with_condition():
    """043. While with complex condition"""
    source = 'void main() { while (x < 10) x = x + 1; }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [WhileStmt(while BinaryOp(Identifier(x), <, IntLiteral(10)) do ExprStmt(AssignExpr(Identifier(x) = BinaryOp(Identifier(x), +, IntLiteral(1)))))])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_044_ast_while_nested():
    """044. Nested while loops"""
    source = 'void main() { while (a) while (b) c = 1; }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [WhileStmt(while Identifier(a) do WhileStmt(while Identifier(b) do ExprStmt(AssignExpr(Identifier(c) = IntLiteral(1)))))])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_045_ast_while_with_break():
    """045. While with break"""
    source = 'void main() { while (1) { break; } }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [WhileStmt(while IntLiteral(1) do BlockStmt([BreakStmt()]))])])'
    assert str(ASTGenerator(source).generate()) == expected


# ============================================================================
# FOR STATEMENTS (Tests 046-055)
# ============================================================================

def test_046_ast_for_full():
    """046. Full for statement"""
    source = 'void main() { for (int i = 0; i < 10; i = i + 1) x = 1; }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [ForStmt(for VarDecl(IntType(), i = IntLiteral(0)); BinaryOp(Identifier(i), <, IntLiteral(10)); AssignExpr(Identifier(i) = BinaryOp(Identifier(i), +, IntLiteral(1))) do ExprStmt(AssignExpr(Identifier(x) = IntLiteral(1))))])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_047_ast_for_auto_init():
    """047. For with auto init"""
    source = 'void main() { for (auto i = 0; i < 10; i = i + 1) x = 1; }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [ForStmt(for VarDecl(auto, i = IntLiteral(0)); BinaryOp(Identifier(i), <, IntLiteral(10)); AssignExpr(Identifier(i) = BinaryOp(Identifier(i), +, IntLiteral(1))) do ExprStmt(AssignExpr(Identifier(x) = IntLiteral(1))))])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_048_ast_for_no_init():
    """048. For without init"""
    source = 'void main() { for (; i < 10; i = i + 1) x = 1; }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [ForStmt(for None; BinaryOp(Identifier(i), <, IntLiteral(10)); AssignExpr(Identifier(i) = BinaryOp(Identifier(i), +, IntLiteral(1))) do ExprStmt(AssignExpr(Identifier(x) = IntLiteral(1))))])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_049_ast_for_no_condition():
    """049. For without condition"""
    source = 'void main() { for (int i = 0; ; i = i + 1) x = 1; }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [ForStmt(for VarDecl(IntType(), i = IntLiteral(0)); None; AssignExpr(Identifier(i) = BinaryOp(Identifier(i), +, IntLiteral(1))) do ExprStmt(AssignExpr(Identifier(x) = IntLiteral(1))))])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_050_ast_for_no_update():
    """050. For without update"""
    source = 'void main() { for (int i = 0; i < 10; ) x = 1; }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [ForStmt(for VarDecl(IntType(), i = IntLiteral(0)); BinaryOp(Identifier(i), <, IntLiteral(10)); None do ExprStmt(AssignExpr(Identifier(x) = IntLiteral(1))))])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_051_ast_for_empty():
    """051. Empty for (infinite loop)"""
    source = 'void main() { for (;;) break; }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [ForStmt(for None; None; None do BreakStmt())])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_052_ast_for_expr_init():
    """052. For with expression init"""
    source = 'void main() { for (i = 0; i < 10; i = i + 1) x = 1; }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [ForStmt(for ExprStmt(AssignExpr(Identifier(i) = IntLiteral(0))); BinaryOp(Identifier(i), <, IntLiteral(10)); AssignExpr(Identifier(i) = BinaryOp(Identifier(i), +, IntLiteral(1))) do ExprStmt(AssignExpr(Identifier(x) = IntLiteral(1))))])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_053_ast_for_with_block():
    """053. For with block body"""
    source = 'void main() { for (int i = 0; i < 10; i = i + 1) { x = i; } }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [ForStmt(for VarDecl(IntType(), i = IntLiteral(0)); BinaryOp(Identifier(i), <, IntLiteral(10)); AssignExpr(Identifier(i) = BinaryOp(Identifier(i), +, IntLiteral(1))) do BlockStmt([ExprStmt(AssignExpr(Identifier(x) = Identifier(i)))]))])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_054_ast_for_nested():
    """054. Nested for loops"""
    source = 'void main() { for (int i = 0; i < 10; i = i + 1) for (int j = 0; j < 10; j = j + 1) x = 1; }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [ForStmt(for VarDecl(IntType(), i = IntLiteral(0)); BinaryOp(Identifier(i), <, IntLiteral(10)); AssignExpr(Identifier(i) = BinaryOp(Identifier(i), +, IntLiteral(1))) do ForStmt(for VarDecl(IntType(), j = IntLiteral(0)); BinaryOp(Identifier(j), <, IntLiteral(10)); AssignExpr(Identifier(j) = BinaryOp(Identifier(j), +, IntLiteral(1))) do ExprStmt(AssignExpr(Identifier(x) = IntLiteral(1)))))])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_055_ast_for_with_continue():
    """055. For with continue"""
    source = 'void main() { for (int i = 0; i < 10; i = i + 1) { continue; } }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [ForStmt(for VarDecl(IntType(), i = IntLiteral(0)); BinaryOp(Identifier(i), <, IntLiteral(10)); AssignExpr(Identifier(i) = BinaryOp(Identifier(i), +, IntLiteral(1))) do BlockStmt([ContinueStmt()]))])])'
    assert str(ASTGenerator(source).generate()) == expected


# ============================================================================
# SWITCH STATEMENTS (Tests 056-065)
# ============================================================================

def test_056_ast_switch_simple():
    """056. Simple switch"""
    source = 'void main() { switch (x) { case 1: break; } }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [SwitchStmt(switch Identifier(x) cases [CaseStmt(case IntLiteral(1): [BreakStmt()])])])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_057_ast_switch_multiple_cases():
    """057. Switch with multiple cases"""
    source = 'void main() { switch (x) { case 1: break; case 2: break; } }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [SwitchStmt(switch Identifier(x) cases [CaseStmt(case IntLiteral(1): [BreakStmt()]), CaseStmt(case IntLiteral(2): [BreakStmt()])])])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_058_ast_switch_with_default():
    """058. Switch with default"""
    source = 'void main() { switch (x) { case 1: break; default: break; } }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [SwitchStmt(switch Identifier(x) cases [CaseStmt(case IntLiteral(1): [BreakStmt()])], default DefaultStmt(default: [BreakStmt()]))])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_059_ast_switch_empty():
    """059. Empty switch"""
    source = 'void main() { switch (x) { } }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [SwitchStmt(switch Identifier(x) cases [])])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_060_ast_switch_only_default():
    """060. Switch with only default"""
    source = 'void main() { switch (x) { default: break; } }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [SwitchStmt(switch Identifier(x) cases [], default DefaultStmt(default: [BreakStmt()]))])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_061_ast_switch_fallthrough():
    """061. Switch with fallthrough (no break)"""
    source = 'void main() { switch (x) { case 1: y = 1; case 2: y = 2; } }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [SwitchStmt(switch Identifier(x) cases [CaseStmt(case IntLiteral(1): [ExprStmt(AssignExpr(Identifier(y) = IntLiteral(1)))]), CaseStmt(case IntLiteral(2): [ExprStmt(AssignExpr(Identifier(y) = IntLiteral(2)))])])])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_062_ast_switch_empty_case():
    """062. Switch with empty case"""
    source = 'void main() { switch (x) { case 1: case 2: break; } }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [SwitchStmt(switch Identifier(x) cases [CaseStmt(case IntLiteral(1): []), CaseStmt(case IntLiteral(2): [BreakStmt()])])])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_063_ast_switch_complex_expr():
    """063. Switch with complex expression"""
    source = 'void main() { switch (a + b) { case 1: break; } }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [SwitchStmt(switch BinaryOp(Identifier(a), +, Identifier(b)) cases [CaseStmt(case IntLiteral(1): [BreakStmt()])])])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_064_ast_switch_multiple_stmts():
    """064. Switch case with multiple statements"""
    source = 'void main() { switch (x) { case 1: a = 1; b = 2; break; } }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [SwitchStmt(switch Identifier(x) cases [CaseStmt(case IntLiteral(1): [ExprStmt(AssignExpr(Identifier(a) = IntLiteral(1))), ExprStmt(AssignExpr(Identifier(b) = IntLiteral(2))), BreakStmt()])])])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_065_ast_switch_default_stmts():
    """065. Default with multiple statements"""
    source = 'void main() { switch (x) { default: a = 1; b = 2; } }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [SwitchStmt(switch Identifier(x) cases [], default DefaultStmt(default: [ExprStmt(AssignExpr(Identifier(a) = IntLiteral(1))), ExprStmt(AssignExpr(Identifier(b) = IntLiteral(2)))]))])])'
    assert str(ASTGenerator(source).generate()) == expected


# ============================================================================
# BREAK, CONTINUE, RETURN (Tests 066-070)
# ============================================================================

def test_066_ast_break():
    """066. Break statement"""
    source = 'void main() { while (1) break; }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [WhileStmt(while IntLiteral(1) do BreakStmt())])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_067_ast_continue():
    """067. Continue statement"""
    source = 'void main() { while (1) continue; }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [WhileStmt(while IntLiteral(1) do ContinueStmt())])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_068_ast_return_void():
    """068. Return void"""
    source = 'void main() { return; }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [ReturnStmt(return)])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_069_ast_return_value():
    """069. Return with value"""
    source = 'int foo() { return 42; }'
    expected = 'Program([FuncDecl(IntType(), foo, [], [ReturnStmt(return IntLiteral(42))])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_070_ast_return_expr():
    """070. Return with expression"""
    source = 'int foo(int a, int b) { return a + b; }'
    expected = 'Program([FuncDecl(IntType(), foo, [Param(IntType(), a), Param(IntType(), b)], [ReturnStmt(return BinaryOp(Identifier(a), +, Identifier(b)))])])'
    assert str(ASTGenerator(source).generate()) == expected


# ============================================================================
# LITERALS (Tests 071-075)
# ============================================================================

def test_071_ast_int_literal():
    """071. Integer literal"""
    source = 'void main() { auto x = 123; }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [VarDecl(auto, x = IntLiteral(123))])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_072_ast_float_literal():
    """072. Float literal"""
    source = 'void main() { auto x = 3.14; }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [VarDecl(auto, x = FloatLiteral(3.14))])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_073_ast_float_exponent():
    """073. Float with exponent"""
    source = 'void main() { auto x = 1e5; }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [VarDecl(auto, x = FloatLiteral(100000.0))])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_074_ast_string_literal():
    """074. String literal"""
    source = 'void main() { auto x = "hello"; }'
    expected = "Program([FuncDecl(VoidType(), main, [], [VarDecl(auto, x = StringLiteral('hello'))])])"
    assert str(ASTGenerator(source).generate()) == expected


def test_075_ast_string_empty():
    """075. Empty string literal"""
    source = 'void main() { auto x = ""; }'
    expected = "Program([FuncDecl(VoidType(), main, [], [VarDecl(auto, x = StringLiteral(''))])])"
    assert str(ASTGenerator(source).generate()) == expected


# ============================================================================
# BINARY OPERATORS (Tests 076-085)
# ============================================================================

def test_076_ast_binary_add():
    """076. Addition"""
    source = 'void main() { auto x = 1 + 2; }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [VarDecl(auto, x = BinaryOp(IntLiteral(1), +, IntLiteral(2)))])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_077_ast_binary_sub():
    """077. Subtraction"""
    source = 'void main() { auto x = 5 - 3; }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [VarDecl(auto, x = BinaryOp(IntLiteral(5), -, IntLiteral(3)))])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_078_ast_binary_mul():
    """078. Multiplication"""
    source = 'void main() { auto x = 2 * 3; }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [VarDecl(auto, x = BinaryOp(IntLiteral(2), *, IntLiteral(3)))])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_079_ast_binary_div():
    """079. Division"""
    source = 'void main() { auto x = 10 / 2; }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [VarDecl(auto, x = BinaryOp(IntLiteral(10), /, IntLiteral(2)))])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_080_ast_binary_mod():
    """080. Modulus"""
    source = 'void main() { auto x = 10 % 3; }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [VarDecl(auto, x = BinaryOp(IntLiteral(10), %, IntLiteral(3)))])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_081_ast_binary_less():
    """081. Less than"""
    source = 'void main() { auto x = 1 < 2; }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [VarDecl(auto, x = BinaryOp(IntLiteral(1), <, IntLiteral(2)))])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_082_ast_binary_equal():
    """082. Equality"""
    source = 'void main() { auto x = 1 == 1; }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [VarDecl(auto, x = BinaryOp(IntLiteral(1), ==, IntLiteral(1)))])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_083_ast_binary_and():
    """083. Logical AND"""
    source = 'void main() { auto x = 1 && 0; }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [VarDecl(auto, x = BinaryOp(IntLiteral(1), &&, IntLiteral(0)))])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_084_ast_binary_or():
    """084. Logical OR"""
    source = 'void main() { auto x = 0 || 1; }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [VarDecl(auto, x = BinaryOp(IntLiteral(0), ||, IntLiteral(1)))])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_085_ast_binary_precedence():
    """085. Operator precedence (mul before add)"""
    source = 'void main() { auto x = 1 + 2 * 3; }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [VarDecl(auto, x = BinaryOp(IntLiteral(1), +, BinaryOp(IntLiteral(2), *, IntLiteral(3))))])])'
    assert str(ASTGenerator(source).generate()) == expected


# ============================================================================
# UNARY OPERATORS (Tests 086-090)
# ============================================================================

def test_086_ast_unary_sign_operators():
    """086. Unary sign operators (+, -)"""
    source = 'void main() { auto x = -5; auto y = +5; }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [VarDecl(auto, x = PrefixOp(-IntLiteral(5))), VarDecl(auto, y = PrefixOp(+IntLiteral(5)))])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_087_ast_unary_not_operators():
    """087. Logical NOT operators (!, !!)"""
    source = 'void main() { auto x = !0; auto y = !!flag; }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [VarDecl(auto, x = PrefixOp(!IntLiteral(0))), VarDecl(auto, y = PrefixOp(!PrefixOp(!Identifier(flag))))])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_088_ast_prefix_inc_dec_statements():
    """088. Prefix ++/-- as statements"""
    source = 'void main() { ++x; --x; }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [ExprStmt(PrefixOp(++Identifier(x))), ExprStmt(PrefixOp(--Identifier(x)))])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_089_ast_prefix_with_postfix_operand():
    """089. Prefix applied to postfix operand"""
    assert str(ASTGenerator('void main() { auto x = ++y++; }').generate(
    )) == 'Program([FuncDecl(VoidType(), main, [], [VarDecl(auto, x = PrefixOp(++PostfixOp(Identifier(y)++)))])])'
    assert str(ASTGenerator('void main() { auto z = --w--; }').generate(
    )) == 'Program([FuncDecl(VoidType(), main, [], [VarDecl(auto, z = PrefixOp(--PostfixOp(Identifier(w)--)))])])'


def test_090_ast_unary_with_binary_precedence():
    """090. Unary operators inside binary precedence"""
    source = 'void main() { auto x = -a * +b + !c; }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [VarDecl(auto, x = BinaryOp(BinaryOp(PrefixOp(-Identifier(a)), *, PrefixOp(+Identifier(b))), +, PrefixOp(!Identifier(c))))])])'
    assert str(ASTGenerator(source).generate()) == expected


# ============================================================================
# POSTFIX OPERATORS (Tests 091-092)
# ============================================================================

def test_091_ast_postfix_increment():
    """091. Postfix increment"""
    source = 'void main() { x++; }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [ExprStmt(PostfixOp(Identifier(x)++))])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_092_ast_postfix_decrement():
    """092. Postfix decrement"""
    source = 'void main() { x--; }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [ExprStmt(PostfixOp(Identifier(x)--))])])'
    assert str(ASTGenerator(source).generate()) == expected


# ============================================================================
# FUNCTION CALLS (Tests 093-095)
# ============================================================================

def test_093_ast_func_call_no_args():
    """093. Function call with no arguments"""
    source = 'void main() { foo(); }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [ExprStmt(FuncCall(foo, []))])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_094_ast_func_call_with_args():
    """094. Function call with arguments"""
    source = 'void main() { foo(1, 2, 3); }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [ExprStmt(FuncCall(foo, [IntLiteral(1), IntLiteral(2), IntLiteral(3)]))])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_095_ast_func_call_nested():
    """095. Nested function calls"""
    source = 'void main() { foo(bar(1)); }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [ExprStmt(FuncCall(foo, [FuncCall(bar, [IntLiteral(1)])]))])])'
    assert str(ASTGenerator(source).generate()) == expected


# ============================================================================
# MEMBER ACCESS AND STRUCT LITERALS (Tests 096-098)
# ============================================================================

def test_096_ast_member_access():
    """096. Member access"""
    source = 'void main() { auto x = p.x; }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [VarDecl(auto, x = MemberAccess(Identifier(p).x))])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_097_ast_member_access_chain():
    """097. Chained member access"""
    source = 'void main() { auto x = a.b.c; }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [VarDecl(auto, x = MemberAccess(MemberAccess(Identifier(a).b).c))])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_098_ast_struct_literal():
    """098. Struct literal"""
    source = 'void main() { auto p = {1, 2}; }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [VarDecl(auto, p = StructLiteral({IntLiteral(1), IntLiteral(2)}))])])'
    assert str(ASTGenerator(source).generate()) == expected


# ============================================================================
# ASSIGNMENT EXPRESSIONS (Tests 099-100)
# ============================================================================

def test_099_ast_assign_expr():
    """099. Assignment expression"""
    source = 'void main() { x = 5; }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [ExprStmt(AssignExpr(Identifier(x) = IntLiteral(5)))])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_100_ast_chained_assign():
    """100. Chained assignment (right associative)"""
    source = 'void main() { x = y = 5; }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [ExprStmt(AssignExpr(Identifier(x) = AssignExpr(Identifier(y) = IntLiteral(5))))])])'
    assert str(ASTGenerator(source).generate()) == expected


# ============================================================================
# EDGE CASES AND COMPLEX PROGRAMS (Tests 101-106)
# ============================================================================

def test_101_ast_assign_to_call_member_with_expression():
    """101. Assignment to function-call member with complex RHS"""
    source = 'void main() { getPoint().x = foo(1, 2) + bar().y; }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [ExprStmt(AssignExpr(MemberAccess(FuncCall(getPoint, []).x) = BinaryOp(FuncCall(foo, [IntLiteral(1), IntLiteral(2)]), +, MemberAccess(FuncCall(bar, []).y))))])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_102_ast_nested_for_if_switch():
    """102. Nested for + if + switch with multiple branches"""
    source = 'void main() { for (int i = 0; i < 3; ++i) { if (i % 2 == 0) { switch (i) { case 0: x = x + 1; break; default: x = x + 2; } } else { x = x - 1; } } }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [ForStmt(for VarDecl(IntType(), i = IntLiteral(0)); BinaryOp(Identifier(i), <, IntLiteral(3)); PrefixOp(++Identifier(i)) do BlockStmt([IfStmt(if BinaryOp(BinaryOp(Identifier(i), %, IntLiteral(2)), ==, IntLiteral(0)) then BlockStmt([SwitchStmt(switch Identifier(i) cases [CaseStmt(case IntLiteral(0): [ExprStmt(AssignExpr(Identifier(x) = BinaryOp(Identifier(x), +, IntLiteral(1)))), BreakStmt()])], default DefaultStmt(default: [ExprStmt(AssignExpr(Identifier(x) = BinaryOp(Identifier(x), +, IntLiteral(2))))]))]), else BlockStmt([ExprStmt(AssignExpr(Identifier(x) = BinaryOp(Identifier(x), -, IntLiteral(1))))]))]))])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_103_ast_struct_literal_with_mixed_expressions():
    """103. Struct literal with calls, binary ops, and nested struct literal"""
    source = 'void main() { auto p = {foo(1), a + b, {x, y}}; }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [VarDecl(auto, p = StructLiteral({FuncCall(foo, [IntLiteral(1)]), BinaryOp(Identifier(a), +, Identifier(b)), StructLiteral({Identifier(x), Identifier(y)})}))])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_104_ast_chained_member_assign_with_nested_calls():
    """104. Chained assignment on nested members and nested function calls"""
    source = 'void main() { a.b.c = d.e.f = g(h(i)); }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [ExprStmt(AssignExpr(MemberAccess(MemberAccess(Identifier(a).b).c) = AssignExpr(MemberAccess(MemberAccess(Identifier(d).e).f) = FuncCall(g, [FuncCall(h, [Identifier(i)])]))))])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_105_ast_complex_return_expression():
    """105. Return with nested arithmetic precedence and grouping"""
    source = 'int calc(int a, int b, int c) { return (a + b) * (c - 1) / (a % 2 + 1); }'
    expected = 'Program([FuncDecl(IntType(), calc, [Param(IntType(), a), Param(IntType(), b), Param(IntType(), c)], [ReturnStmt(return BinaryOp(BinaryOp(BinaryOp(Identifier(a), +, Identifier(b)), *, BinaryOp(Identifier(c), -, IntLiteral(1))), /, BinaryOp(BinaryOp(Identifier(a), %, IntLiteral(2)), +, IntLiteral(1))))])])'
    assert str(ASTGenerator(source).generate()) == expected


def test_106_ast_nested_loops_with_postfix_and_prefix_updates():
    """106. For loop (postfix update) nested with while and prefix update"""
    source = 'void main() { for (i = 0; i < 2; i++) while (j > 0) { --j; } }'
    expected = 'Program([FuncDecl(VoidType(), main, [], [ForStmt(for ExprStmt(AssignExpr(Identifier(i) = IntLiteral(0))); BinaryOp(Identifier(i), <, IntLiteral(2)); PostfixOp(Identifier(i)++) do WhileStmt(while BinaryOp(Identifier(j), >, IntLiteral(0)) do BlockStmt([ExprStmt(PrefixOp(--Identifier(j)))])))])])'
    assert str(ASTGenerator(source).generate()) == expected
