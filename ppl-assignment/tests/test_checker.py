from tests.utils import Checker

# ============================================================================
# Valid Programs
# ============================================================================

def test_001_valid_basic_arithmetic():
    """001. Valid basic arithmetic"""
    source = '''void main() { int x = 5; int y = x + 1; }'''
    expected = "Static checking passed"
    assert Checker(source).check_from_source() == expected

def test_002_valid_auto_literals():
    """002. Valid auto literals"""
    source = '''void main() { auto x = 10; auto y = 3.14; auto z = "ok"; }'''
    expected = "Static checking passed"
    assert Checker(source).check_from_source() == expected

def test_003_valid_declared_function_call():
    """003. Valid declared function call"""
    source = '''int add(int x, int y) { return x + y; } void main() { int sum = add(1, 2); }'''
    expected = "Static checking passed"
    assert Checker(source).check_from_source() == expected

def test_004_valid_struct_member_assignment():
    """004. Valid struct member assignment"""
    source = '''struct Point { int x; int y; }; void main() { Point p; p.x = 1; p.y = 2; }'''
    expected = "Static checking passed"
    assert Checker(source).check_from_source() == expected

def test_005_valid_shadowing_in_nested_block():
    """005. Valid shadowing in nested block"""
    source = '''void main() { int x = 1; { int x = 2; printInt(x); } printInt(x); }'''
    expected = "Static checking passed"
    assert Checker(source).check_from_source() == expected

def test_006_valid_while_loop():
    """006. Valid while loop"""
    source = '''void main() { int x = 3; while (x) { x = x - 1; } }'''
    expected = "Static checking passed"
    assert Checker(source).check_from_source() == expected

def test_007_valid_for_loop():
    """007. Valid for loop"""
    source = '''void main() { for (auto i = 0; i < 3; ++i) { printInt(i); } }'''
    expected = "Static checking passed"
    assert Checker(source).check_from_source() == expected

def test_008_valid_switch_statement():
    """008. Valid switch statement"""
    source = '''void main() { int x = 2; switch (x) { case 1: break; default: break; } }'''
    expected = "Static checking passed"
    assert Checker(source).check_from_source() == expected

def test_009_valid_built_in_i_o():
    """009. Valid built-in I/O"""
    source = '''void main() { auto x = readInt(); printInt(x); }'''
    expected = "Static checking passed"
    assert Checker(source).check_from_source() == expected

def test_010_valid_inferred_return_function():
    """010. Valid inferred return function"""
    source = '''add(int x, int y) { return x + y; } void main() { int z = add(1, 2); }'''
    expected = "Static checking passed"
    assert Checker(source).check_from_source() == expected

def test_011_valid_inferred_void_return():
    """011. Valid inferred void return"""
    source = '''greet() { printString("hi"); } void main() { greet(); }'''
    expected = "Static checking passed"
    assert Checker(source).check_from_source() == expected

def test_012_valid_explicit_struct_return():
    """012. Valid explicit struct return"""
    source = '''struct Point { int x; int y; }; Point origin() { return {0, 0}; } void main() { Point p = origin(); }'''
    expected = "Static checking passed"
    assert Checker(source).check_from_source() == expected

def test_013_valid_nested_struct_literal():
    """013. Valid nested struct literal"""
    source = '''struct Point { int x; int y; }; struct Line { Point a; Point b; }; void main() { Line l = {{1, 2}, {3, 4}}; printInt(l.a.x); }'''
    expected = "Static checking passed"
    assert Checker(source).check_from_source() == expected

def test_014_valid_assignment_expression_in_initializer():
    """014. Valid assignment expression in initializer"""
    source = '''void main() { int x; int y = (x = 5) + 2; }'''
    expected = "Static checking passed"
    assert Checker(source).check_from_source() == expected

def test_015_valid_chained_assignment():
    """015. Valid chained assignment"""
    source = '''void main() { int a; int b; a = b = 10; }'''
    expected = "Static checking passed"
    assert Checker(source).check_from_source() == expected

def test_016_valid_logical_expression():
    """016. Valid logical expression"""
    source = '''void main() { int x = 1; int y = 2; int z = x && y; }'''
    expected = "Static checking passed"
    assert Checker(source).check_from_source() == expected

def test_017_invalid_mixed_numeric_comparison():
    """017. Invalid mixed numeric comparison (strict types for relational ops)"""
    source = '''void main() { int x = 1; float y = 2.0; int z = x < y; }'''
    expected = "Static checking passed"
    assert Checker(source).check_from_source() == expected

def test_018_valid_modulus_expression():
    """018. Valid modulus expression"""
    source = '''void main() { int x = 7 % 3; }'''
    expected = "Static checking passed"
    assert Checker(source).check_from_source() == expected

def test_019_valid_prefix_and_postfix_update():
    """019. Valid prefix and postfix update"""
    source = '''void main() { int x = 1; ++x; x--; }'''
    expected = "Static checking passed"
    assert Checker(source).check_from_source() == expected

def test_020_valid_auto_inferred_from_function_argument():
    """020. Valid auto inferred from function argument"""
    source = '''void main() { auto x; printInt(x); }'''
    expected = "Static checking passed"
    assert Checker(source).check_from_source() == expected


# ============================================================================
# Declaration, Lookup Errors
# ============================================================================


def test_021_redeclared_struct():
    """021. Redeclared struct"""
    source = '''struct Point {}; struct Point {};'''
    expected = 'Redeclared(Struct, Point)'
    assert Checker(source).check_from_source() == expected


def test_022_redeclared_function():
    """022. Redeclared function"""
    source = '''void foo() {} void foo() {}'''
    expected = 'Redeclared(Function, foo)'
    assert Checker(source).check_from_source() == expected


def test_023_redeclared_parameter():
    """023. Redeclared parameter"""
    source = '''void foo(int x, float x) {}'''
    expected = 'Redeclared(Parameter, x)'
    assert Checker(source).check_from_source() == expected


def test_024_redeclared_variable_in_same_block():
    """024. Redeclared variable in same block"""
    source = '''void main() { int x; int x; }'''
    expected = 'Redeclared(Variable, x)'
    assert Checker(source).check_from_source() == expected


def test_025_redeclared_variable_after_statement():
    """025. Redeclared variable after statement"""
    source = '''void main() { int x; x = 1; int x; }'''
    expected = 'Redeclared(Variable, x)'
    assert Checker(source).check_from_source() == expected


def test_026_redeclared_built_in_function():
    """026. Redeclared built-in function"""
    source = '''void readInt() {}'''
    expected = 'Redeclared(Function, readInt)'
    assert Checker(source).check_from_source() == expected


def test_027_redeclared_variable_in_inner_block():
    """027. Redeclared variable in inner block"""
    source = '''void main() { { int x; int x; } }'''
    expected = 'Redeclared(Variable, x)'
    assert Checker(source).check_from_source() == expected


def test_028_redeclared_parameter_later_in_list():
    """028. Redeclared parameter later in list"""
    source = '''void foo(int a, int b, int a) {}'''
    expected = 'Redeclared(Parameter, a)'
    assert Checker(source).check_from_source() == expected


def test_029_redeclared_inferred_function():
    """029. Redeclared inferred function"""
    source = '''foo() { return 1; } int foo() { return 2; }'''
    expected = 'Redeclared(Function, foo)'
    assert Checker(source).check_from_source() == expected


def test_030_redeclared_struct_with_different_members():
    """030. Redeclared struct with different members"""
    source = '''struct A { int x; }; struct A { float y; };'''
    expected = 'Redeclared(Struct, A)'
    assert Checker(source).check_from_source() == expected


def test_031_undeclared_identifier_in_initializer():
    """031. Undeclared identifier in initializer"""
    source = '''void main() { int x = y + 1; }'''
    expected = 'UndeclaredIdentifier(y)'
    assert Checker(source).check_from_source() == expected


def test_032_undeclared_identifier_in_assignment():
    """032. Undeclared identifier in assignment"""
    source = '''void main() { int x; x = y; }'''
    expected = 'UndeclaredIdentifier(y)'
    assert Checker(source).check_from_source() == expected


def test_033_undeclared_identifier_in_if_condition():
    """033. Undeclared identifier in if condition"""
    source = '''void main() { if (flag) { } }'''
    expected = 'UndeclaredIdentifier(flag)'
    assert Checker(source).check_from_source() == expected


def test_034_out_of_scope_identifier():
    """034. Out-of-scope identifier"""
    source = '''void main() { { int x = 1; } int y = x; }'''
    expected = 'UndeclaredIdentifier(x)'
    assert Checker(source).check_from_source() == expected


def test_035_identifier_not_visible_across_functions():
    """035. Identifier not visible across functions"""
    source = '''void foo() { int x = 1; } void main() { printInt(x); }'''
    expected = 'UndeclaredIdentifier(x)'
    assert Checker(source).check_from_source() == expected


def test_036_undeclared_identifier_as_member_base():
    """036. Undeclared identifier as member base"""
    source = '''struct Point { int x; }; void main() { Point p = {1}; int y = q.x; }'''
    expected = 'UndeclaredIdentifier(q)'
    assert Checker(source).check_from_source() == expected


def test_037_undeclared_identifier_in_return():
    """037. Undeclared identifier in return"""
    source = '''int foo() { return x; }'''
    expected = 'UndeclaredIdentifier(x)'
    assert Checker(source).check_from_source() == expected


def test_038_undeclared_identifier_in_switch_expr():
    """038. Undeclared identifier in switch expr"""
    source = '''void main() { switch (x) { default: break; } }'''
    expected = 'UndeclaredIdentifier(x)'
    assert Checker(source).check_from_source() == expected


def test_039_undeclared_identifier_in_case_expr():
    """039. Undeclared identifier in case expr"""
    source = '''void main() { int x = 1; switch (x) { case y: break; } }'''
    expected = 'UndeclaredIdentifier(y)'
    assert Checker(source).check_from_source() == expected


def test_040_undeclared_identifier_in_for_update():
    """040. Undeclared identifier in for update"""
    source = '''void main() { for (int i = 0; i < 2; j = j + 1) { } }'''
    expected = 'UndeclaredIdentifier(j)'
    assert Checker(source).check_from_source() == expected


# ============================================================================
# Function, Struct, Inference Errors
# ============================================================================


def test_041_undeclared_function_simple_call():
    """041. Undeclared function simple call"""
    source = '''void main() { foo(); }'''
    expected = 'UndeclaredFunction(foo)'
    assert Checker(source).check_from_source() == expected


def test_042_undeclared_function_declared_later():
    """042. Undeclared function declared later"""
    source = '''void main() { foo(); } void foo() {}'''
    expected = 'UndeclaredFunction(foo)'
    assert Checker(source).check_from_source() == expected


def test_043_undeclared_function_in_initializer():
    """043. Undeclared function in initializer"""
    source = '''void main() { int x = foo(); }'''
    expected = 'UndeclaredFunction(foo)'
    assert Checker(source).check_from_source() == expected


def test_044_undeclared_function_in_assignment():
    """044. Undeclared function in assignment"""
    source = '''void main() { int x; x = foo(); }'''
    expected = 'UndeclaredFunction(foo)'
    assert Checker(source).check_from_source() == expected


def test_045_undeclared_function_in_struct_initializer():
    """045. Undeclared function in struct initializer"""
    source = '''struct Point { int x; int y; }; void main() { Point p = {foo(), 2}; }'''
    expected = 'UndeclaredFunction(foo)'
    assert Checker(source).check_from_source() == expected


def test_046_undeclared_function_in_condition():
    """046. Undeclared function in condition"""
    source = '''void main() { if (foo()) { } }'''
    expected = 'UndeclaredFunction(foo)'
    assert Checker(source).check_from_source() == expected


def test_047_undeclared_function_in_return():
    """047. Undeclared function in return"""
    source = '''int foo() { return bar(); }'''
    expected = 'UndeclaredFunction(bar)'
    assert Checker(source).check_from_source() == expected


def test_048_undeclared_function_as_member_base():
    """048. Undeclared function as member base"""
    source = '''struct Point { int x; }; void main() { int y = make().x; }'''
    expected = 'UndeclaredFunction(make)'
    assert Checker(source).check_from_source() == expected


def test_049_undeclared_struct_local_variable():
    """049. Undeclared struct local variable"""
    source = '''void main() { Point p; } struct Point { int x; };'''
    expected = 'UndeclaredStruct(Point)'
    assert Checker(source).check_from_source() == expected


def test_050_undeclared_struct_parameter_type():
    """050. Undeclared struct parameter type"""
    source = '''void draw(Point p) {} struct Point { int x; };'''
    expected = 'UndeclaredStruct(Point)'
    assert Checker(source).check_from_source() == expected


def test_051_undeclared_struct_return_type():
    """051. Undeclared struct return type"""
    source = '''Point make() { return {1}; } struct Point { int x; };'''
    expected = 'UndeclaredStruct(Point)'
    assert Checker(source).check_from_source() == expected


def test_052_undeclared_struct_member_type():
    """052. Undeclared struct member type"""
    source = '''struct Line { Point p; }; struct Point { int x; };'''
    expected = 'UndeclaredStruct(Point)'
    assert Checker(source).check_from_source() == expected


def test_053_self_referential_struct_member():
    """053. Self-referential struct member"""
    source = '''struct Node { Node next; };'''
    expected = 'UndeclaredStruct(Node)'
    assert Checker(source).check_from_source() == expected


def test_054_undeclared_struct_in_initialized_local():
    """054. Undeclared struct in initialized local"""
    source = '''void main() { Point p = {1}; } struct Point { int x; };'''
    expected = 'UndeclaredStruct(Point)'
    assert Checker(source).check_from_source() == expected


def test_055_undeclared_struct_in_declaration():
    """055. Undeclared struct in declaration"""
    source = '''struct Box { Item item; }; void main() {}'''
    expected = 'UndeclaredStruct(Item)'
    assert Checker(source).check_from_source() == expected


def test_056_undeclared_struct_in_function_body():
    """056. Undeclared struct in function body"""
    source = '''void main() { Missing x; }'''
    expected = 'UndeclaredStruct(Missing)'
    assert Checker(source).check_from_source() == expected


def test_057_cannot_infer_from_two_unknown_operands():
    """057. Cannot infer from two unknown operands"""
    source = '''void main() { auto x; auto y; auto z = x + y; }'''
    expected = 'TypeCannotBeInferred(BinaryOp(Identifier(x), +, Identifier(y)))'
    assert Checker(source).check_from_source() == expected


def test_058_cannot_infer_assignment_between_unknown_autos():
    """058. Cannot infer assignment between unknown autos"""
    source = '''void main() { auto x; auto y; x = y; }'''
    expected = 'TypeCannotBeInferred(AssignExpr(Identifier(x) = Identifier(y)))'
    assert Checker(source).check_from_source() == expected


def test_059_cannot_infer_circular_dependency():
    """059. Cannot infer circular dependency"""
    source = '''void main() { auto a; auto b; a = b; b = a; }'''
    expected = 'TypeCannotBeInferred(AssignExpr(Identifier(a) = Identifier(b)))'
    assert Checker(source).check_from_source() == expected


def test_060_cannot_infer_auto_from_struct_literal():
    """060. Cannot infer auto from struct literal"""
    source = '''struct Point { int x; int y; }; void main() { auto p = {1, 2}; }'''
    expected = 'TypeCannotBeInferred(VarDecl(auto, p = StructLiteral({IntLiteral(1), IntLiteral(2)})))'
    assert Checker(source).check_from_source() == expected


# ============================================================================
# Inference, Control Flow Errors
# ============================================================================


def test_061_cannot_infer_from_bare_expr_stmt():
    """061. Cannot infer from bare expr stmt"""
    source = '''void main() { auto x; x; }'''
    expected = 'TypeCannotBeInferred(ExprStmt(Identifier(x)))'
    assert Checker(source).check_from_source() == expected


def test_062_cannot_infer_from_unary_minus():
    """062. Cannot infer from unary minus"""
    source = '''void main() { auto x; auto y = -x; }'''
    expected = 'TypeCannotBeInferred(PrefixOp(-Identifier(x)))'
    assert Checker(source).check_from_source() == expected


def test_063_cannot_infer_from_unary_plus():
    """063. Cannot infer from unary plus"""
    source = '''void main() { auto x; auto y = +x; }'''
    expected = 'TypeCannotBeInferred(PrefixOp(+Identifier(x)))'
    assert Checker(source).check_from_source() == expected


def test_064_cannot_infer_from_unknown_comparison():
    """064. Cannot infer from unknown comparison"""
    source = '''void main() { auto x; auto y; int z = x < y; }'''
    expected = 'TypeCannotBeInferred(BinaryOp(Identifier(x), <, Identifier(y)))'
    assert Checker(source).check_from_source() == expected


def test_065_cannot_infer_self_referential_auto_init():
    """065. Cannot infer self-referential auto init"""
    source = '''void main() { auto x = x; }'''
    expected = 'UndeclaredIdentifier(x)'
    assert Checker(source).check_from_source() == expected


def test_066_cannot_infer_auto_from_unknown_rhs():
    """066. Cannot infer auto from unknown rhs"""
    source = '''void main() { auto y; auto x = y; }'''
    expected = 'TypeCannotBeInferred(VarDecl(auto, x = Identifier(y)))'
    assert Checker(source).check_from_source() == expected


# ============================================================================
# MustInLoop Errors
# ============================================================================


def test_067_break_outside_loop():
    """067. Break outside loop"""
    source = '''void main() { break; }'''
    expected = 'MustInLoop(BreakStmt())'
    assert Checker(source).check_from_source() == expected


def test_068_continue_outside_loop():
    """068. Continue outside loop"""
    source = '''void main() { continue; }'''
    expected = 'MustInLoop(ContinueStmt())'
    assert Checker(source).check_from_source() == expected


def test_069_break_inside_if_but_not_loop():
    """069. Break inside if but not loop"""
    source = '''void main() { if (1) { break; } }'''
    expected = 'MustInLoop(BreakStmt())'
    assert Checker(source).check_from_source() == expected


def test_070_continue_inside_if_but_not_loop():
    """070. Continue inside if but not loop"""
    source = '''void main() { if (1) { continue; } }'''
    expected = 'MustInLoop(ContinueStmt())'
    assert Checker(source).check_from_source() == expected


def test_071_continue_inside_switch():
    """071. Continue inside switch"""
    source = '''void main() { int x = 1; switch (x) { case 1: continue; } }'''
    expected = 'MustInLoop(ContinueStmt())'
    assert Checker(source).check_from_source() == expected


def test_072_break_inside_helper_function():
    """072. Break inside helper function"""
    source = '''void helper() { break; } void main() { while (1) { helper(); } }'''
    expected = 'MustInLoop(BreakStmt())'
    assert Checker(source).check_from_source() == expected


# ============================================================================
# TypeMismatchInStatement
# ============================================================================


def test_073_float_if_condition():
    """073. Float if condition"""
    source = '''void main() { float x = 1.0; if (x) { } }'''
    msg = Checker(source).check_from_source()
    assert msg.startswith('TypeMismatchInStatement(IfStmt(')


def test_074_string_while_condition():
    """074. String while condition"""
    source = '''void main() { string s = "hi"; while (s) { } }'''
    msg = Checker(source).check_from_source()
    assert msg.startswith('TypeMismatchInStatement(WhileStmt(')


def test_075_float_for_condition():
    """075. Float for condition"""
    source = '''void main() { for (int i = 0; 1.0; ++i) { } }'''
    msg = Checker(source).check_from_source()
    assert msg.startswith('TypeMismatchInStatement(ForStmt(')


def test_076_string_switch_expression():
    """076. String switch expression"""
    source = '''void main() { string s = "hi"; switch (s) { default: break; } }'''
    msg = Checker(source).check_from_source()
    assert msg.startswith('TypeMismatchInStatement(SwitchStmt(')


def test_077_string_case_expression():
    """077. String case expression"""
    source = '''void main() { int x = 1; switch (x) { case "a": break; } }'''
    msg = Checker(source).check_from_source()
    assert msg.startswith('TypeMismatchInStatement(CaseStmt(')


def test_078_explicit_int_initialized_with_float():
    """078. Explicit int initialized with float"""
    source = '''void main() { int x = 1.0; }'''
    msg = Checker(source).check_from_source()
    assert msg.startswith('TypeMismatchInStatement(VarDecl(')


def test_079_struct_literal_member_type_mismatch_in_declaration():
    """079. Struct literal member type mismatch in declaration"""
    source = '''struct Point { int x; }; void main() { Point p = {"a"}; }'''
    # This should be wrapped in TypeMismatchInStatement(VarDecl(...)) now 
    # as established in refinement session.
    msg = Checker(source).check_from_source()
    assert msg.startswith('TypeMismatchInStatement(VarDecl(')


def test_080_assignment_statement_type_mismatch():
    """080. Assignment statement type mismatch"""
    source = '''void main() { int x; x = 1.0; }'''
    expected = 'TypeMismatchInStatement(ExprStmt(AssignExpr(Identifier(x) = FloatLiteral(1.0))))'
    assert Checker(source).check_from_source() == expected


def test_081_struct_assignment_statement_mismatch():
    """081. Struct assignment statement mismatch"""
    source = '''struct A { int x; }; struct B { int x; }; void main() { A a; B b; a = b; }'''
    expected = 'TypeMismatchInStatement(ExprStmt(AssignExpr(Identifier(a) = Identifier(b))))'
    assert Checker(source).check_from_source() == expected


def test_082_wrong_explicit_return_type():
    """082. Wrong explicit return type"""
    source = '''int foo() { return "a"; }'''
    msg = Checker(source).check_from_source()
    assert msg.startswith('TypeMismatchInStatement(ReturnStmt(')


def test_083_return_value_from_void_function():
    """083. Return value from void function"""
    source = '''void main() { return 1; }'''
    msg = Checker(source).check_from_source()
    assert msg.startswith('TypeMismatchInStatement(ReturnStmt(')


def test_084_empty_return_from_int_function():
    """084. Empty return from int function"""
    source = '''int foo() { return; }'''
    msg = Checker(source).check_from_source()
    assert msg.startswith('TypeMismatchInStatement(ReturnStmt(')


def test_085_inferred_return_mismatch_value_kinds():
    """085. Inferred return mismatch value kinds"""
    source = '''foo() { return 1; return 1.0; }'''
    msg = Checker(source).check_from_source()
    assert msg.startswith('TypeMismatchInStatement(ReturnStmt(')


def test_086_inferred_return_mixes_empty_and_value():
    """086. Inferred return mixes empty and value"""
    source = '''foo() { return; return 1; }'''
    msg = Checker(source).check_from_source()
    assert msg.startswith('TypeMismatchInStatement(ReturnStmt(')


def test_087_chained_assignment_statement_mismatch():
    """087. Chained assignment statement mismatch"""
    source = '''void main() { int x; float y; x = y = 1.0; }'''
    expected = 'TypeMismatchInStatement(ExprStmt(AssignExpr(Identifier(x) = AssignExpr(Identifier(y) = FloatLiteral(1.0)))))'
    assert Checker(source).check_from_source() == expected


def test_088_for_init_declaration_mismatch():
    """088. For init declaration mismatch"""
    source = '''void main() { for (int i = 1.0; 1; ++i) { } }'''
    msg = Checker(source).check_from_source()
    assert msg.startswith('TypeMismatchInStatement(VarDecl(')


# ============================================================================
# TypeMismatchInExpression
# ============================================================================


def test_089_binary_plus_with_string():
    """089. Binary plus with string"""
    source = '''void main() { int x = 1; string s = "a"; int y = x + s; }'''
    msg = Checker(source).check_from_source()
    assert msg.startswith('TypeMismatchInExpression(BinaryOp(')


def test_090_modulus_with_float():
    """090. Modulus with float"""
    source = '''void main() { float x = 1.0; int y = x % 2; }'''
    msg = Checker(source).check_from_source()
    assert msg.startswith('TypeMismatchInExpression(BinaryOp(')


def test_091_relational_with_string():
    """091. Relational with string"""
    source = '''void main() { int x = 1; string s = "a"; int y = x < s; }'''
    msg = Checker(source).check_from_source()
    assert msg.startswith('TypeMismatchInExpression(BinaryOp(')


def test_092_logical_and_with_float():
    """092. Logical and with float"""
    source = '''void main() { float x = 1.0; int y = x && 1; }'''
    msg = Checker(source).check_from_source()
    assert msg.startswith('TypeMismatchInExpression(BinaryOp(')


def test_093_logical_not_with_float():
    """093. Logical not with float"""
    source = '''void main() { float x = 1.0; int y = !x; }'''
    msg = Checker(source).check_from_source()
    assert msg.startswith('TypeMismatchInExpression(PrefixOp(')


def test_094_prefix_increment_on_float():
    """094. Prefix increment on float"""
    source = '''void main() { float x = 1.0; ++x; }'''
    msg = Checker(source).check_from_source()
    assert msg.startswith('TypeMismatchInExpression(PrefixOp(')


def test_095_prefix_increment_on_literal():
    """095. Prefix increment on literal"""
    source = '''void main() { ++5; }'''
    msg = Checker(source).check_from_source()
    assert msg.startswith('TypeMismatchInExpression(PrefixOp(')


def test_096_postfix_increment_on_expression():
    """096. Postfix increment on expression"""
    source = '''void main() { int x = 1; (x + 1)++; }'''
    msg = Checker(source).check_from_source()
    assert msg.startswith('TypeMismatchInExpression(PostfixOp(')


def test_097_member_access_on_non_struct():
    """097. Member access on non-struct"""
    source = '''void main() { int x = 1; int y = x.z; }'''
    msg = Checker(source).check_from_source()
    assert msg.startswith('TypeMismatchInExpression(MemberAccess(')


def test_098_missing_struct_member():
    """098. Missing struct member"""
    source = '''struct Point { int x; }; void main() { Point p; int y = p.y; }'''
    msg = Checker(source).check_from_source()
    assert msg.startswith('TypeMismatchInExpression(MemberAccess(')


def test_099_function_call_wrong_argument_type():
    """099. Function call wrong argument type"""
    source = '''void take(int x) {} void main() { take(1.0); }'''
    msg = Checker(source).check_from_source()
    assert msg.startswith('TypeMismatchInExpression(FuncCall(take')


def test_100_function_call_wrong_argument_count():
    """100. Function call wrong argument count"""
    source = '''int add(int x, int y) { return x + y; } void main() { int z = add(1); }'''
    msg = Checker(source).check_from_source()
    assert msg.startswith('TypeMismatchInExpression(FuncCall(add')

def test_101_struct_and_function_same_name_valid():
    """101. Struct and function can have the same name"""
    source = '''struct foo { int x; }; int foo(int x, int y) { return x + y; } void main() {}'''
    expected = "Static checking passed"
    assert Checker(source).check_from_source() == expected

def test_102_redeclared_variable_vs_undeclared_struct():
    """102. Redeclared variable has priority over UndeclaredStruct in assignment"""
    source = '''void main() { int a; X a = b; }'''
    expected = 'Redeclared(Variable, a)'
    assert Checker(source).check_from_source() == expected

def test_103_undeclared_struct_when_not_redeclared():
    """103. UndeclaredStruct when not redeclared"""
    source = '''void main() { X a = b; }'''
    expected = 'UndeclaredStruct(X)'
    assert Checker(source).check_from_source() == expected

def test_104_auto_var_rejects_void_initialization():
    """104. auto variable cannot be initialized with void"""
    source = '''void foo() {} void main() { auto x = foo(); }'''
    msg = Checker(source).check_from_source()
    assert msg.startswith('TypeMismatchInStatement(VarDecl(')

def test_105_auto_var_rejects_void_assignment():
    """105. auto variable cannot be assigned void"""
    source = '''void foo() {} void main() { auto x; x = foo(); }'''
    expected = 'TypeMismatchInStatement(ExprStmt(AssignExpr(Identifier(x) = FuncCall(foo, []))))'
    assert Checker(source).check_from_source() == expected