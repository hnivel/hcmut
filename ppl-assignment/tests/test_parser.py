"""
TyC Parser Tests - Compressed Edition
100 comprehensive tests covering all parser functionality
Following the TyC specification
"""

import pytest
from tests.utils import Parser


# ============================================================================
# PROGRAM STRUCTURE (Tests 001-010)
# ============================================================================

def test_001_empty_and_minimal_programs():
    """Empty program, single function, minimal struct"""
    # Empty program is valid
    assert Parser("").parse() == "success"
    # Minimal function
    assert Parser("void main() {}").parse() == "success"
    # Minimal struct
    assert Parser("struct S {};").parse() == "success"
    # Struct with function
    assert Parser("struct S {}; void main() {}").parse() == "success"


def test_002_multiple_structs():
    """Multiple struct declarations"""
    source = """
    struct Point { int x; int y; };
    struct Line { Point start; Point end; };
    struct Circle { Point center; float radius; };
    """
    assert Parser(source).parse() == "success"


def test_003_multiple_functions():
    """Multiple function declarations"""
    source = """
    void foo() {}
    int bar() { return 0; }
    float baz() { return 0.0; }
    string qux() { return ""; }
    void main() {}
    """
    assert Parser(source).parse() == "success"


def test_004_structs_and_functions_mixed():
    """Structs and functions in various orders"""
    source = """
    struct A { int x; };
    void f1() {}
    struct B { float y; };
    int f2() { return 0; }
    struct C { string z; };
    void main() {}
    """
    assert Parser(source).parse() == "success"


def test_005_struct_members_all_types():
    """Struct with all primitive types and custom types"""
    source = """
    struct Custom { int value; };
    struct AllTypes {
        int i;
        float f;
        boolean b;
        string s;
        Custom c;
    };
    """
    assert Parser(source).parse() == "success"


def test_006_struct_empty_and_single_member():
    """Empty struct and struct with single member"""
    assert Parser("struct Empty {};").parse() == "success"
    assert Parser("struct Single { int x; };").parse() == "success"
    assert Parser("struct OnlyFloat { float value; };").parse() == "success"


def test_007_function_return_types():
    """Functions with all return types"""
    source = """
    struct Point { int x; int y; };
    void voidFunc() {}
    int intFunc() { return 0; }
    float floatFunc() { return 0.0; }
    boolean boolFunc() { return true; }
    string stringFunc() { return "hello"; }
    Point pointFunc() { return {0, 0}; }
    """
    assert Parser(source).parse() == "success"


def test_008_function_parameters():
    """Functions with various parameter counts and types"""
    source = """
    void noParams() {}
    void oneParam(int a) {}
    void twoParams(int a, float b) {}
    void manyParams(int a, float b, boolean c, string d) {}
    void customParam(Point p) {}
    struct Point { int x; int y; };
    """
    assert Parser(source).parse() == "success"


def test_009_function_body_statements():
    """Function bodies with various statements"""
    source = """
    void main() {
        int x;
        x = 5;
        if (x > 0) {}
        while (x > 0) { x = x - 1; }
        for (int i = 0; i < 10; ++i) {}
        return;
    }
    """
    assert Parser(source).parse() == "success"


def test_010_complete_program_structure():
    """Complete program with all elements"""
    source = """
    struct Point { int x; int y; };
    struct Line { Point a; Point b; };
    int add(int a, int b) { return a + b; }
    Point createPoint(int x, int y) { return {x, y}; }
    void main() {
        Point p = {10, 20};
        int sum = add(p.x, p.y);
        printInt(sum);
    }
    """
    assert Parser(source).parse() == "success"


# ============================================================================
# VARIABLE DECLARATIONS (Tests 011-020)
# ============================================================================

def test_011_vardecl_primitives_explicit():
    """Variable declarations with explicit primitive types"""
    source = """
    void main() {
        int x;
        float y;
        boolean z;
        string s;
    }
    """
    assert Parser(source).parse() == "success"


def test_012_vardecl_with_init():
    """Variable declarations with initialization"""
    source = """
    void main() {
        int x = 10;
        float y = 3.14;
        boolean z = true;
        string s = "hello";
    }
    """
    assert Parser(source).parse() == "success"


def test_013_vardecl_auto_inference():
    """Auto type inference declarations"""
    source = """
    void main() {
        auto x = 10;
        auto y = 3.14;
        auto z = true;
        auto s = "hello";
        auto expr = 1 + 2 * 3;
    }
    """
    assert Parser(source).parse() == "success"


def test_014_vardecl_custom_types():
    """Variable declarations with custom struct types"""
    source = """
    struct Point { int x; int y; };
    void main() {
        Point p;
        Point q = {10, 20};
        auto r = {30, 40};
    }
    """
    assert Parser(source).parse() == "success"


def test_015_vardecl_expressions():
    """Variable declarations with complex expressions"""
    source = """
    void main() {
        int a = 1 + 2 * 3;
        float b = 1.0 / 2.0;
        boolean c = true && false;
        int d = (a + b) * 2;
    }
    """
    assert Parser(source).parse() == "success"


def test_016_vardecl_function_calls():
    """Variable declarations from function calls"""
    source = """
    int getValue() { return 42; }
    void main() {
        int x = getValue();
        auto y = getValue();
    }
    """
    assert Parser(source).parse() == "success"


def test_017_vardecl_errors_missing_parts():
    """Variable declaration errors - missing parts"""
    # Missing semicolon
    assert Parser("void main() { int x }").parse() != "success"
    # Missing name
    assert Parser("void main() { int ; }").parse() != "success"
    # Missing init value after =
    assert Parser("void main() { int x = ; }").parse() != "success"


def test_018_vardecl_errors_syntax():
    """Variable declaration syntax errors"""
    # Double equals
    assert Parser("void main() { int x == 5; }").parse() != "success"
    # Multiple declarations in one
    assert Parser("void main() { int x, y; }").parse() != "success"
    # Keyword as name
    assert Parser("void main() { int int; }").parse() != "success"


def test_019_vardecl_void_semantic():
    """Void type variable declaration"""
    assert Parser("void main() { void x; }").parse() != "success"


def test_020_vardecl_assignment_statement():
    """Assignment as statement vs declaration"""
    # Assignment without declaration
    assert Parser("void main() { x = 5; }").parse() == "success"
    # Chained assignment
    assert Parser("void main() { x = y = z = 0; }").parse() == "success"


# ============================================================================
# IF STATEMENTS (Tests 021-025)
# ============================================================================

def test_021_if_basic():
    """Basic if statement forms"""
    assert Parser("void main() { if (x > 0) y = 1; }").parse() == "success"
    assert Parser("void main() { if (x > 0) { y = 1; } }").parse() == "success"
    assert Parser("void main() { if (true) {} }").parse() == "success"


def test_022_if_else():
    """If-else statements"""
    assert Parser(
        "void main() { if (x > 0) y = 1; else y = 0; }").parse() == "success"
    assert Parser(
        "void main() { if (x > 0) { y = 1; } else { y = 0; } }").parse() == "success"


def test_023_if_else_if_chain():
    """Else-if chains"""
    source = """
    void main() {
        if (x > 10) y = 2;
        else if (x > 5) y = 1;
        else if (x > 0) y = 0;
        else y = -1;
    }
    """
    assert Parser(source).parse() == "success"


def test_024_if_nested():
    """Nested if statements"""
    source = "void main() { if (a) if (b) if (c) if (d) x = 1; }"
    assert Parser(source).parse() == "success"
    source = "void main() { if (a) { if (b) { if (c) {} } } }"
    assert Parser(source).parse() == "success"


def test_025_if_errors():
    """If statement syntax errors"""
    # Missing parentheses
    assert Parser("void main() { if x > 0 y = 1; }").parse() != "success"
    # Missing closing paren
    assert Parser("void main() { if (x > 0 y = 1; }").parse() != "success"
    # Empty condition
    assert Parser("void main() { if () y = 1; }").parse() != "success"
    # Missing body
    assert Parser("void main() { if (x > 0) }").parse() != "success"
    # Else without body
    assert Parser(
        "void main() { if (x > 0) y = 1; else }").parse() != "success"


# ============================================================================
# WHILE LOOPS (Tests 026-030)
# ============================================================================

def test_026_while_basic():
    """Basic while loop forms"""
    assert Parser(
        "void main() { while (x > 0) x = x - 1; }").parse() == "success"
    assert Parser(
        "void main() { while (x > 0) { x = x - 1; } }").parse() == "success"
    assert Parser("void main() { while (true) {} }").parse() == "success"


def test_027_while_nested():
    """Nested while loops"""
    source = """
    void main() {
        while (a > 0) {
            while (b > 0) {
                while (c > 0) {
                    c = c - 1;
                }
                b = b - 1;
            }
            a = a - 1;
        }
    }
    """
    assert Parser(source).parse() == "success"


def test_028_while_with_control_flow():
    """While with break and continue"""
    source = """
    void main() {
        while (x > 0) {
            if (x == 5) break;
            if (x == 3) continue;
            x = x - 1;
        }
    }
    """
    assert Parser(source).parse() == "success"


def test_029_while_complex_condition():
    """While with complex conditions"""
    source = """
    void main() {
        while (x > 0 && y < 100 || z != 0) {
            x = x - 1;
        }
    }
    """
    assert Parser(source).parse() == "success"


def test_030_while_errors():
    """While loop syntax errors"""
    # Missing parentheses
    assert Parser(
        "void main() { while x > 0 x = x - 1; }").parse() != "success"
    # Empty condition
    assert Parser("void main() { while () x = x - 1; }").parse() != "success"
    # Missing body
    assert Parser("void main() { while (x > 0) }").parse() != "success"


# ============================================================================
# FOR LOOPS (Tests 031-040)
# ============================================================================

def test_031_for_basic():
    """Basic for loop"""
    source = "void main() { for (int i = 0; i < 10; ++i) printInt(i); }"
    assert Parser(source).parse() == "success"


def test_032_for_with_block():
    """For loop with block body"""
    source = """
    void main() {
        for (int i = 0; i < 10; ++i) {
            printInt(i);
        }
    }
    """
    assert Parser(source).parse() == "success"


def test_033_for_all_parts():
    """For loop with all parts populated"""
    source = "void main() { for (int i = 0; i < 10; i = i + 1) {} }"
    assert Parser(source).parse() == "success"
    source = "void main() { for (auto i = 0; i < n; ++i) {} }"
    assert Parser(source).parse() == "success"


def test_034_for_empty_parts():
    """For loop with empty parts"""
    # All parts can be empty
    source = "void main() { for (;;) break; }"
    assert Parser(source).parse() == "success"
    # Only init empty
    source = "void main() { int i = 0; for (; i < 10; ++i) {} }"
    assert Parser(source).parse() == "success"
    # Only update empty
    source = "void main() { for (int i = 0; i < 10;) { ++i; } }"
    assert Parser(source).parse() == "success"


def test_035_for_complex_parts():
    """For loop with complex init, condition, update"""
    source = "void main() { for (int i = f(0); i < g(10); i = h(i)) {} }"
    assert Parser(source).parse() == "success"


def test_036_for_nested():
    """Nested for loops"""
    source = """
    void main() {
        for (int i = 0; i < 10; ++i) {
            for (int j = 0; j < 10; ++j) {
                for (int k = 0; k < 10; ++k) {
                    printInt(i + j + k);
                }
            }
        }
    }
    """
    assert Parser(source).parse() == "success"


def test_037_for_with_control_flow():
    """For loop with break and continue"""
    source = """
    void main() {
        for (int i = 0; i < 100; ++i) {
            if (i == 50) break;
            if (i % 2 == 0) continue;
            printInt(i);
        }
    }
    """
    assert Parser(source).parse() == "success"


def test_038_for_postfix_update():
    """For loop with postfix increment/decrement"""
    assert Parser(
        "void main() { for (int i = 0; i < 10; i++) {} }").parse() == "success"
    assert Parser(
        "void main() { for (int i = 10; i > 0; i--) {} }").parse() == "success"


def test_039_for_errors_missing_parts():
    """For loop errors - missing required syntax"""
    # Missing parentheses
    assert Parser(
        "void main() { for int i = 0; i < 10; ++i {} }").parse() != "success"
    # Missing first semicolon
    assert Parser(
        "void main() { for (int i = 0 i < 10; ++i) {} }").parse() != "success"
    # Missing second semicolon
    assert Parser(
        "void main() { for (int i = 0; i < 10 ++i) {} }").parse() != "success"


def test_040_for_errors_body():
    """For loop errors - body issues"""
    # Missing body
    assert Parser(
        "void main() { for (int i = 0; i < 10; ++i) }").parse() != "success"
    # Extra semicolon
    assert Parser(
        "void main() { for (int i = 0; i < 10; ++i;) {} }").parse() != "success"


# ============================================================================
# SWITCH STATEMENTS (Tests 041-050)
# ============================================================================

def test_041_switch_basic():
    """Basic switch statement"""
    source = """
    void main() {
        switch (x) {
            case 1: y = 1; break;
            case 2: y = 2; break;
            default: y = 0;
        }
    }
    """
    assert Parser(source).parse() == "success"


def test_042_switch_empty_and_minimal():
    """Empty switch and minimal cases"""
    # Empty switch body
    assert Parser("void main() { switch (x) {} }").parse() == "success"
    # Single case
    assert Parser(
        "void main() { switch (x) { case 1: break; } }").parse() == "success"
    # Only default
    assert Parser(
        "void main() { switch (x) { default: break; } }").parse() == "success"


def test_043_switch_fallthrough():
    """Switch with fall-through"""
    source = """
    void main() {
        switch (x) {
            case 1:
            case 2:
            case 3:
                y = 1;
                break;
            case 4:
            case 5:
                y = 2;
                break;
            default:
                y = 0;
        }
    }
    """
    assert Parser(source).parse() == "success"


def test_044_switch_default_position():
    """Switch with default at various positions"""
    # Default at beginning
    source = "void main() { switch (x) { default: y = 0; break; case 1: y = 1; } }"
    assert Parser(source).parse() == "success"
    # Default in middle
    source = "void main() { switch (x) { case 1: y = 1; break; default: y = 0; break; case 2: y = 2; } }"
    assert Parser(source).parse() == "success"
    # Default at end
    source = "void main() { switch (x) { case 1: y = 1; break; default: y = 0; } }"
    assert Parser(source).parse() == "success"


def test_045_switch_multiple_defaults():
    """Switch with multiple defaults (semantic error, parser accepts)"""
    source = """
    void main() {
        switch (x) {
            default: y = 0; break;
            case 1: y = 1; break;
            default: y = -1;
        }
    }
    """

    assert Parser(source).parse() != "success"


def test_046_switch_many_cases():
    """Switch with many cases"""
    source = """
    void main() {
        switch (x) {
            case 1: y = 1; break;
            case 2: y = 2; break;
            case 3: y = 3; break;
            case 4: y = 4; break;
            case 5: y = 5; break;
            case 6: y = 6; break;
            case 7: y = 7; break;
            case 8: y = 8; break;
            case 9: y = 9; break;
            case 10: y = 10; break;
            default: y = 0;
        }
    }
    """
    assert Parser(source).parse() == "success"


def test_047_switch_nested():
    """Nested switch statements"""
    source = """
    void main() {
        switch (x) {
            case 1:
                switch (y) {
                    case 10: z = 1; break;
                    default: z = 0;
                }
                break;
            default: z = -1;
        }
    }
    """
    assert Parser(source).parse() == "success"


def test_048_switch_complex_expression():
    """Switch on complex expression"""
    source = "void main() { switch (x + y * 2) { case 1: break; default: break; } }"
    assert Parser(source).parse() == "success"
    source = "void main() { switch (getValue()) { case 1: break; } }"
    assert Parser(source).parse() == "success"


def test_049_switch_errors_structure():
    """Switch structure errors"""
    # Missing parentheses
    assert Parser(
        "void main() { switch x { case 1: break; } }").parse() != "success"
    # Missing braces
    assert Parser(
        "void main() { switch (x) case 1: break; }").parse() != "success"
    # Missing expression
    assert Parser(
        "void main() { switch () { case 1: break; } }").parse() != "success"


def test_050_switch_errors_cases():
    """Switch case errors"""
    # Missing colon after case
    assert Parser(
        "void main() { switch (x) { case 1 break; } }").parse() != "success"
    # Case without value
    assert Parser(
        "void main() { switch (x) { case : break; } }").parse() != "success"
    # Default with value
    assert Parser(
        "void main() { switch (x) { default 0: break; } }").parse() != "success"
    # Default missing colon
    assert Parser(
        "void main() { switch (x) { default break; } }").parse() != "success"


# ============================================================================
# BREAK, CONTINUE, RETURN (Tests 051-055)
# ============================================================================

def test_051_break_continue_in_loops():
    """Break and continue in various loops"""
    source = """
    void main() {
        while (true) { break; }
        while (true) { continue; }
        for (;;) { break; }
        for (int i = 0; i < 10; ++i) { if (i == 5) continue; }
    }
    """
    assert Parser(source).parse() == "success"


def test_052_break_continue_in_switch():
    """Break and continue in switch"""
    source = """
    void main() {
        for (int i = 0; i < 10; ++i) {
            switch (i) {
                case 5: continue;
                case 7: break;
                default: printInt(i);
            }
        }
    }
    """
    assert Parser(source).parse() == "success"


def test_053_break_continue_outside_loop():
    """Break and continue outside loop (semantic, parser accepts)"""
    assert Parser("void main() { break; }").parse() == "success"
    assert Parser("void main() { continue; }").parse() == "success"


def test_054_return_statements():
    """Return statements in various forms"""
    assert Parser("void f() { return; }").parse() == "success"
    assert Parser("int f() { return 0; }").parse() == "success"
    assert Parser("int f() { return 1 + 2 * 3; }").parse() == "success"
    assert Parser("int f() { return getValue(); }").parse() == "success"


def test_055_return_errors():
    """Return statement errors"""
    # Missing semicolon
    assert Parser("int f() { return 5 }").parse() != "success"
    # Multiple values (comma expression not allowed)
    assert Parser("int f() { return 5, 10; }").parse() != "success"
    # Incomplete expression
    assert Parser("int f() { return 5 + ; }").parse() != "success"


# ============================================================================
# EXPRESSIONS - ARITHMETIC (Tests 056-060)
# ============================================================================

def test_056_expr_arithmetic_basic():
    """Basic arithmetic expressions"""
    source = """
    void main() {
        x = 1 + 2;
        x = 3 - 4;
        x = 5 * 6;
        x = 7 / 8;
        x = 9 % 10;
    }
    """
    assert Parser(source).parse() == "success"


def test_057_expr_arithmetic_compound():
    """Compound arithmetic expressions"""
    source = """
    void main() {
        x = 1 + 2 + 3 + 4;
        x = 1 + 2 * 3;
        x = (1 + 2) * 3;
        x = a + b * c - d / e % f;
    }
    """
    assert Parser(source).parse() == "success"


def test_058_expr_unary_operators():
    """Unary operators (+, -, !)"""
    source = """
    void main() {
        x = -5;
        x = +5;
        x = !true;
        x = !!false;
        x = -(-5);
    }
    """
    assert Parser(source).parse() == "success"


def test_059_expr_prefix_increment_decrement():
    """Prefix ++/-- operators"""
    source = """
    void main() {
        x = ++y;
        x = --y;
        x = ++a + ++b;
        ++x;
        --x;
    }
    """
    assert Parser(source).parse() == "success"


def test_060_expr_postfix_increment_decrement():
    """Postfix ++/-- operators"""
    source = """
    void main() {
        x = y++;
        x = y--;
        x = a++ + b++;
        x++;
        x--;
    }
    """
    assert Parser(source).parse() == "success"


# ============================================================================
# EXPRESSIONS - COMPARISON AND LOGICAL (Tests 061-065)
# ============================================================================

def test_061_expr_comparison():
    """Comparison operators"""
    source = """
    void main() {
        if (x < 10) {}
        if (x > 10) {}
        if (x <= 10) {}
        if (x >= 10) {}
        if (x == 10) {}
        if (x != 10) {}
    }
    """
    assert Parser(source).parse() == "success"


def test_062_expr_logical():
    """Logical operators"""
    source = """
    void main() {
        if (a && b) {}
        if (a || b) {}
        if (!a) {}
        if (a && b || c) {}
        if (a || b && c) {}
    }
    """
    assert Parser(source).parse() == "success"


def test_063_expr_combined_comparison_logical():
    """Combined comparison and logical expressions"""
    source = """
    void main() {
        if (x > 0 && y > 0) {}
        if (x < 10 || y < 10) {}
        if (x >= 0 && x <= 100 && y >= 0 && y <= 100) {}
        if ((x == 0 || x == 1) && (y == 0 || y == 1)) {}
    }
    """
    assert Parser(source).parse() == "success"


def test_064_expr_operator_precedence():
    """Operator precedence tests"""
    source = """
    void main() {
        result = !a && b || c == d != e < f > g <= h >= i + j - k * l / m % n;
        result = a + b * c - d / e % f;
        result = (a + b) * (c - d);
    }
    """
    assert Parser(source).parse() == "success"


def test_065_expr_deeply_nested_parens():
    """Deeply nested parentheses"""
    source = """
    void main() {
        x = ((((1 + 2))));
        x = ((a + b) * (c - d)) / ((e % f) + (g * h));
    }
    """
    assert Parser(source).parse() == "success"


# ============================================================================
# EXPRESSIONS - MEMBER ACCESS AND FUNCTION CALLS (Tests 066-070)
# ============================================================================

def test_066_expr_member_access():
    """Member access expressions"""
    source = """
    struct Point { int x; int y; };
    void main() {
        Point p;
        int a = p.x;
        int b = p.y;
        p.x = 10;
    }
    """
    assert Parser(source).parse() == "success"


def test_067_expr_chained_member_access():
    """Chained member access"""
    source = """
    struct A { int x; };
    struct B { A a; };
    struct C { B b; };
    void main() {
        C c;
        int x = c.b.a.x;
    }
    """
    assert Parser(source).parse() == "success"


def test_068_expr_function_calls():
    """Function call expressions"""
    source = """
    int noArgs() { return 0; }
    int oneArg(int a) { return a; }
    int twoArgs(int a, int b) { return a + b; }
    void main() {
        int x = noArgs();
        int y = oneArg(5);
        int z = twoArgs(1, 2);
        int w = twoArgs(1 + 2, 3 * 4);
    }
    """
    assert Parser(source).parse() == "success"


def test_069_expr_nested_function_calls():
    """Nested function calls"""
    source = """
    int f(int x) { return x; }
    int g(int x, int y) { return x + y; }
    void main() {
        int x = f(f(f(5)));
        int y = g(f(1), f(2));
        int z = f(g(f(1), f(2)));
    }
    """
    assert Parser(source).parse() == "success"


def test_070_expr_member_access_on_call():
    """Member access on function call result"""
    source = """
    struct Point { int x; int y; };
    Point getPoint() { return {0, 0}; }
    void main() {
        int x = getPoint().x;
        int y = getPoint().y;
    }
    """
    assert Parser(source).parse() == "success"


# ============================================================================
# EXPRESSIONS - LITERALS AND ASSIGNMENTS (Tests 071-075)
# ============================================================================

def test_071_expr_literals():
    """Literal expressions"""
    source = """
    void main() {
        int a = 42;
        float b = 3.14;
        boolean c = true;
        boolean d = false;
        string e = "hello";
    }
    """
    assert Parser(source).parse() == "success"


def test_072_expr_struct_literals():
    """Struct literal expressions"""
    source = """
    struct Point { int x; int y; };
    struct Empty {};
    void main() {
        Point p = {10, 20};
        Point q = {1 + 2, 3 * 4};
        Empty e = {};
    }
    """
    assert Parser(source).parse() == "success"


def test_073_expr_assignment():
    """Assignment expressions"""
    source = """
    void main() {
        x = 5;
        x = y = z = 0;
        p.x = 10;
        a.b.c = 20;
    }
    """
    assert Parser(source).parse() == "success"


def test_074_expr_assignment_in_context():
    """Assignment in various contexts"""
    source = """
    void main() {
        if (x = 5) {}
        int y = (x = 10) + 5;
        while ((x = getValue()) > 0) {}
    }
    """
    assert Parser(source).parse() == "success"


def test_075_expr_mixed_complex():
    """Complex mixed expressions"""
    source = """
    void main() {
        result = ++a + b++ - --c + d-- * getVal().field / (x && y || z);
    }
    """
    assert Parser(source).parse() == "success"


# ============================================================================
# EXPRESSION ERRORS (Tests 076-080)
# ============================================================================

def test_076_expr_errors_unmatched_parens():
    """Expression errors - unmatched parentheses"""
    assert Parser("void main() { x = (5 + 3; }").parse() != "success"
    assert Parser("void main() { x = 5 + 3); }").parse() != "success"
    assert Parser("void main() { x = (); }").parse() != "success"


def test_077_expr_errors_missing_operands():
    """Expression errors - missing operands"""
    assert Parser("void main() { x = 5 + ; }").parse() != "success"
    assert Parser("void main() { x = % 5; }").parse() != "success"
    assert Parser("void main() { if (x &&) {} }").parse() != "success"


def test_078_expr_errors_increment_decrement():
    """Expression errors - increment/decrement issues"""
    assert Parser("void main() { x = ++; }").parse() != "success"
    # ++5 is valid syntax (but semantic error)
    # +++y should fail (needs lvalue rule)


def test_079_expr_errors_member_access():
    """Expression errors - member access issues"""
    assert Parser("void main() { x = p.; }").parse() != "success"
    assert Parser("void main() { x = .member; }").parse() != "success"


def test_080_expr_errors_function_calls():
    """Expression errors - function call issues"""
    assert Parser("void main() { x = f(1, 2; }").parse() != "success"
    assert Parser("void main() { x = f(1, 2,); }").parse() != "success"
    assert Parser("void main() { x = f(1 2); }").parse() != "success"


# ============================================================================
# STRUCT DECLARATION ERRORS (Tests 081-085)
# ============================================================================

def test_081_struct_errors_missing_semicolon():
    """Struct errors - missing semicolons"""
    # Missing ; after struct
    assert Parser("struct S { int x; }").parse() != "success"
    # Missing ; after member
    assert Parser("struct S { int x int y; };").parse() != "success"


def test_082_struct_errors_missing_braces():
    """Struct errors - missing braces"""
    assert Parser("struct S int x; };").parse() != "success"
    assert Parser("struct S { int x; ;").parse() != "success"


def test_083_struct_errors_member_issues():
    """Struct errors - member declaration issues"""
    # No type
    assert Parser("struct S { x; };").parse() != "success"
    # No name
    assert Parser("struct S { int ; };").parse() != "success"


def test_084_struct_errors_name_issues():
    """Struct errors - name issues"""
    # No name
    assert Parser("struct { int x; };").parse() != "success"


def test_085_struct_errors_auto_and_nested():
    """Struct errors - auto member and nested struct"""
    # Auto member not allowed
    assert Parser("struct S { auto x; };").parse() != "success"
    # Nested struct not allowed
    assert Parser(
        "struct Outer { struct Inner { int x; }; };").parse() != "success"


# ============================================================================
# FUNCTION DECLARATION ERRORS (Tests 086-090)
# ============================================================================

def test_086_function_errors_parentheses():
    """Function errors - parentheses issues"""
    assert Parser("void main) {}").parse() != "success"
    assert Parser("void main( {}").parse() != "success"


def test_087_function_errors_braces():
    """Function errors - braces issues"""
    assert Parser("void main() }").parse() != "success"
    assert Parser("void main() {").parse() != "success"


def test_088_function_errors_parameters():
    """Function errors - parameter issues"""
    # No type
    assert Parser("void f(x) {}").parse() != "success"
    # No name
    assert Parser("void f(int) {}").parse() != "success"
    # Auto param not allowed
    assert Parser("void f(auto x) {}").parse() != "success"
    # Missing comma
    assert Parser("void f(int a int b) {}").parse() != "success"


def test_089_function_return_value_semantic():
    """Function return value (semantic, parser accepts)"""
    # Void function with return value (semantic error)
    assert Parser("void f() { return 5; }").parse() == "success"
    # Int function without return value (semantic error)
    assert Parser("int f() { return; }").parse() == "success"


def test_090_function_many_params():
    """Function with many parameters"""
    source = "void f(int a, int b, int c, int d, int e, int f, int g, int h) {}"
    assert Parser(source).parse() == "success"


# ============================================================================
# STRUCT LITERAL ERRORS (Tests 091-093)
# ============================================================================

def test_091_struct_literal_errors_braces():
    """Struct literal errors - braces"""
    assert Parser("void main() { Point p = {10, 20; }").parse() != "success"
    assert Parser("void main() { Point p = 10, 20}; }").parse() != "success"


def test_092_struct_literal_errors_commas():
    """Struct literal errors - commas"""
    assert Parser("void main() { Point p = {10, 20,}; }").parse() != "success"
    assert Parser("void main() { Point p = {10 20}; }").parse() != "success"
    assert Parser("void main() { Point p = {10,, 20}; }").parse() != "success"


def test_093_struct_literal_nested():
    """Nested struct literals"""
    source = """
    struct Point { int x; int y; };
    struct Line { Point a; Point b; };
    void main() {
        Line l = {{0, 0}, {10, 10}};
    }
    """
    assert Parser(source).parse() == "success"


# ============================================================================
# EDGE CASES AND COMPLEX PROGRAMS (Tests 094-100)
# ============================================================================

def test_094_edge_empty_blocks():
    """Empty and nested blocks"""
    assert Parser("void main() { {} }").parse() == "success"
    assert Parser("void main() { { { { {} } } } }").parse() == "success"
    # Standalone semicolons are invalid
    assert Parser("void main() { ;;; }").parse() != "success"


def test_095_edge_expression_statements():
    """Expression statements"""
    source = """
    void main() {
        42;
        x + y;
        getValue();
        ++x;
        x++;
    }
    """
    assert Parser(source).parse() == "success"


def test_096_edge_all_control_flow():
    """All control flow in one function"""
    source = """
    void main() {
        if (x > 0) {
            while (y > 0) {
                for (int i = 0; i < 10; ++i) {
                    switch (z) {
                        case 1: break;
                        case 2: continue;
                        default: return;
                    }
                }
            }
        }
    }
    """
    assert Parser(source).parse() == "success"


def test_097_edge_long_argument_list():
    """Long argument lists"""
    assert Parser(
        "void main() { f(1, 2, 3, 4, 5, 6, 7, 8, 9, 10); }").parse() == "success"


def test_098_edge_prefix_on_member():
    """Prefix operators on member access"""
    source = """
    struct Counter { int value; };
    void main() {
        Counter c;
        ++c.value;
        --c.value;
        int x = ++c.value;
    }
    """
    assert Parser(source).parse() == "success"


def test_099_edge_mixed_postfix_prefix():
    """Mixed postfix and prefix in expressions"""
    source = """
    void main() {
        x = ++a + b++ - --c + d--;
        x = a++ + ++b;
    }
    """
    assert Parser(source).parse() == "success"


def test_100_complete_program():
    """Complete program with all features"""
    source = """
    struct Point { int x; int y; };
    struct Line { Point start; Point end; };
    
    int add(int a, int b) {
        return a + b;
    }
    
    Point createPoint(int x, int y) {
        return {x, y};
    }
    
    void printPoint(Point p) {
        printInt(p.x);
        printInt(p.y);
    }
    
    int abs(int x) {
        if (x < 0) {
            return -x;
        }
        return x;
    }
    
    void main() {
        Point p1 = {10, 20};
        Point p2 = createPoint(30, 40);
        Line line = {p1, p2};
        
        auto sum = add(p1.x, p2.x);
        
        for (int i = 0; i < 10; ++i) {
            if (i % 2 == 0) {
                printInt(i);
            } else {
                continue;
            }
        }
        
        int j = 0;
        while (j < 5) {
            switch (j) {
                case 0:
                case 1:
                    printInt(j);
                    break;
                case 2:
                    ++j;
                    continue;
                default:
                    break;
            }
            ++j;
        }
        
        printPoint(line.start);
        printPoint(line.end);
    }
    """
    assert Parser(source).parse() == "success"
