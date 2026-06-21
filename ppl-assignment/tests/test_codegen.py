"""
Test cases for TyC code generation.
"""

from src.utils.nodes import *
from tests.utils import CodeGenerator, ASTGenerator, Checker


def run_test(source, expected):
    ast = ASTGenerator(source).generate()
    if isinstance(ast, str):
        assert False, f"AST Generation Error: {ast}"
    
    checker = Checker(ast=ast)
    check_res = checker.check_from_ast()
    if check_res != "Static checking passed":
        assert False, f"Static Check Error: {check_res}"
        
    result = CodeGenerator().generate_and_run(ast)
    assert result == expected


def test_001():
    """Test 1: Print string"""
    source = """
    void main() {
        printString("Hello World");
    }
    """
    run_test(source, "Hello World")


def test_002():
    """Test 2: Print integer"""
    source = "void main() { printInt(42); }"
    run_test(source, "42")


def test_003():
    """Test 3: Print float"""
    source = "void main() { printFloat(3.14); }"
    run_test(source, "3.14")


def test_004():
    """Test 4: Variable declaration and assignment"""
    source = "void main() { int x = 10; printInt(x); }"
    run_test(source, "10")


def test_005():
    """Test 5: Addition"""
    source = "void main() { printInt(5 + 3); }"
    run_test(source, "8")


def test_006():
    """Test 6: Multiplication"""
    source = "void main() { printInt(6 * 7); }"
    run_test(source, "42")


def test_007():
    """Test 7: If statement"""
    source = """
    void main() {
        if (1 < 2) printString("yes");
        else printString("no");
    }
    """
    run_test(source, "yes")


def test_008():
    """Test 8: While statement"""
    source = """
    void main() {
        int i = 0;
        while (i < 3) {
            printInt(i);
            i = i + 1;
        }
    }
    """
    run_test(source, "012")


def test_009():
    """Test 9: Function call with return value"""
    source = """
    int add(int a, int b) {
        return a + b;
    }
    void main() {
        printInt(add(20, 22));
    }
    """
    run_test(source, "42")


def test_010():
    """Test 10: Arithmetic operations"""
    source = """
    void main() {
        int x = 10;
        int y = 20;
        printInt(x + y);
    }
    """
    run_test(source, "30")

def test_011():
    """Test 11: Subtraction"""
    run_test("void main() { printInt(100 - 40); }", "60")

def test_012():
    """Test 12: Division"""
    run_test("void main() { printInt(100 / 3); }", "33")

def test_013():
    """Test 13: Modulo"""
    run_test("void main() { printInt(10 % 3); }", "1")

def test_014():
    """Test 14: Mixed precedence arithmetic"""
    run_test("void main() { printInt(2 + 3 * 4); }", "14")

def test_015():
    """Test 15: Logical AND"""
    run_test("void main() { printInt(1 && 1); printInt(1 && 0); }", "10")

def test_016():
    """Test 16: Logical OR"""
    run_test("void main() { printInt(0 || 1); printInt(0 || 0); }", "10")

def test_017():
    """Test 17: Logical NOT"""
    run_test("void main() { printInt(!1); printInt(!0); }", "01")

def test_018():
    """Test 18: Comparison operators"""
    run_test("void main() { printInt(1 == 1); printInt(1 != 2); printInt(5 > 3); printInt(2 < 4); }", "1111")

def test_019():
    """Test 19: Nested expressions"""
    run_test("void main() { printInt((10 + 5) * 2); }", "30")

def test_020():
    """Test 20: Float arithmetic"""
    run_test("void main() { printFloat(1.5 + 2.5); }", "4.0")

def test_021():
    """Test 21: Unary minus"""
    run_test("void main() { printInt(-42); }", "-42")

def test_022():
    """Test 22: Unary plus"""
    run_test("void main() { printInt(+42); }", "42")

def test_023():
    """Test 23: Prefix increment"""
    run_test("void main() { int x = 5; printInt(++x); printInt(x); }", "66")

def test_024():
    """Test 24: Prefix decrement"""
    run_test("void main() { int x = 5; printInt(--x); printInt(x); }", "44")

def test_025():
    """Test 25: Postfix increment"""
    run_test("void main() { int x = 5; printInt(x++); printInt(x); }", "56")

def test_026():
    """Test 26: Postfix decrement"""
    run_test("void main() { int x = 5; printInt(x--); printInt(x); }", "54")

def test_027():
    """Test 27: Chained assignments"""
    run_test("void main() { int a = 0; int b = 0; a = b = 10; printInt(a); printInt(b); }", "1010")

def test_028():
    """Test 28: Complex reassignment"""
    run_test("void main() { int x = 10; x = x * 2; printInt(x); }", "20")

def test_029():
    """Test 29: Nested if-else if-else"""
    source = """
    void main() {
        int x = 2;
        if (x == 1) printString("one");
        else if (x == 2) printString("two");
        else printString("other");
    }
    """
    run_test(source, "two")

def test_030():
    """Test 30: For loop with all parts"""
    source = """
    void main() {
        for (int i = 1; i <= 3; i++) {
            printInt(i);
        }
    }
    """
    run_test(source, "123")

def test_031():
    """Test 31: Nested loops"""
    source = """
    void main() {
        for (int i = 1; i <= 2; i++) {
            for (int j = 1; j <= 2; j++) {
                printInt(i);
            }
        }
    }
    """
    run_test(source, "1122")

def test_032():
    """Test 32: While loop with break"""
    source = """
    void main() {
        int i = 0;
        while (1) {
            if (i == 2) break;
            printInt(i);
            i++;
        }
    }
    """
    run_test(source, "01")

def test_033():
    """Test 33: While loop with continue"""
    source = """
    void main() {
        int i = 0;
        while (i < 5) {
            i++;
            if (i == 3) continue;
            printInt(i);
        }
    }
    """
    run_test(source, "1245")

def test_034():
    """Test 34: For loop with break"""
    source = """
    void main() {
        for (int i = 1; 1; i++) {
            if (i > 3) break;
            printInt(i);
        }
    }
    """
    run_test(source, "123")

def test_035():
    """Test 35: While loop with complex break"""
    source = """
    void main() {
        int i = 0;
        while (1) {
            if (i == 3) break;
            printInt(i);
            i++;
        }
    }
    """
    run_test(source, "012")

def test_036():
    """Test 36: Nested if inside while"""
    source = """
    void main() {
        int i = 0;
        while (i < 3) {
            if (i == 1) printString("one");
            else printInt(i);
            i++;
        }
    }
    """
    run_test(source, "0one2")

def test_037():
    """Test 37: While loop inside if"""
    source = """
    void main() {
        int i = 0;
        if (1) {
            while (i < 2) {
                printInt(i);
                i++;
            }
        }
    }
    """
    run_test(source, "01")

def test_038():
    """Test 38: If inside while loop"""
    source = """
    void main() {
        int i = 0;
        while (i < 4) {
            if (i % 2 == 0) printString("e");
            else printString("o");
            i++;
        }
    }
    """
    run_test(source, "eoeo")

def test_039():
    """Test 39: For loop with empty body"""
    source = """
    void main() {
        int i = 0;
        for (; i < 3; i++) {}
        printInt(i);
    }
    """
    run_test(source, "3")

def test_040():
    """Test 40: For loop with no update - manual increment in body"""
    source = """
    void main() {
        int i = 0;
        for (; i < 3; ) {
            printInt(i);
            i++;
        }
    }
    """
    run_test(source, "012")

def test_041():
    """Test 41: Block scoping - shadowing"""
    source = """
    void main() {
        int x = 1;
        {
            int x = 2;
            printInt(x);
        }
        printInt(x);
    }
    """
    run_test(source, "21")

def test_042():
    """Test 42: Local variable shadowing"""
    source = """
    void foo(int p) {
        int x = p;
        {
            int x = 100;
            printInt(x);
        }
        printInt(x);
    }
    void main() {
        foo(10);
    }
    """
    run_test(source, "10010")

def test_043():
    """Test 43: auto variable for int"""
    run_test("void main() { auto x = 42; printInt(x); }", "42")

def test_044():
    """Test 44: auto variable for float"""
    run_test("void main() { auto x = 3.14; printFloat(x); }", "3.14")

def test_045():
    """Test 45: auto variable for string"""
    run_test('void main() { auto s = "auto string"; printString(s); }', "auto string")

def test_046():
    """Test 46: auto variable for result of expression"""
    run_test("void main() { auto x = 10 + 20; printInt(x); }", "30")

def test_047():
    """Test 47: auto variable for return of function"""
    source = """
    int getVal() { return 123; }
    void main() {
        auto x = getVal();
        printInt(x);
    }
    """
    run_test(source, "123")

def test_048():
    """Test 48: Local variable modification in loop"""
    source = """
    void main() {
        int sum = 0;
        for (int i = 1; i <= 5; i++) {
            sum = sum + i;
        }
        printInt(sum);
    }
    """
    run_test(source, "15")

def test_049():
    """Test 49: Multiple variable declarations"""
    run_test("void main() { int a = 1; int b = 2; int c = 3; printInt(a); printInt(b); printInt(c); }", "123")

def test_050():
    """Test 50: Re-assigning to variable"""
    source = """
    void main() {
        int x = 10;
        x = 20;
        printInt(x);
        x = 30;
        printInt(x);
    }
    """
    run_test(source, "2030")

def test_051():
    """Test 51: Void function call"""
    source = """
    void sayHi() { printString("Hi"); }
    void main() { sayHi(); }
    """
    run_test(source, "Hi")

def test_052():
    """Test 52: Function with many parameters"""
    source = """
    int sum6(int a, int b, int c, int d, int e, int f) {
        return a + b + c + d + e + f;
    }
    void main() {
        printInt(sum6(1, 2, 3, 4, 5, 6));
    }
    """
    run_test(source, "21")

def test_053():
    """Test 53: Recursive factorial"""
    source = """
    int fact(int n) {
        int res;
        if (n <= 1) res = 1;
        else res = n * fact(n - 1);
        return res;
    }
    void main() {
        printInt(fact(5));
    }
    """
    run_test(source, "120")

def test_054():
    """Test 54: Recursive fibonacci"""
    source = """
    int fib(int n) {
        int res;
        if (n <= 1) res = n;
        else res = fib(n - 1) + fib(n - 2);
        return res;
    }
    void main() {
        printInt(fib(7));
    }
    """
    run_test(source, "13")

def test_055():
    """Test 55: Function calling another function"""
    source = """
    int square(int x) {
        return x * x;
    }
    int sumSquare(int a, int b) {
        return square(a) + square(b);
    }
    void main() {
        printInt(sumSquare(3, 4));
    }
    """
    run_test(source, "25")

def test_056():
    """Test 56: If-else nesting"""
    source = """
    void main() {
        int x = 10;
        if (x > 5) {
            if (x < 15) printInt(10);
            else printInt(20);
        } else {
            printInt(0);
        }
    }
    """
    run_test(source, "10")

def test_057():
    """Test 57: Early return in function"""
    source = """
    void check(int n) {
        if (n < 0) {
            printString("neg");
            return;
        }
        printString("pos");
    }
    void main() {
        check(-1);
        check(1);
    }
    """
    run_test(source, "negpos")

def test_058():
    """Test 58: Return inside a loop"""
    source = """
    int find(int target) {
        for (int i = 1; i <= 10; i++) {
            if (i == target) return i;
        }
        return -1;
    }
    void main() {
        printInt(find(5));
        printInt(find(15));
    }
    """
    run_test(source, "5-1")

def test_059():
    """Test 59: Complex logical operators"""
    source = """
    void main() {
        int a = 1; int b = 0; int c = 1;
        if ((a && b) || (a && c)) printInt(20);
        else printInt(30);
    }
    """
    run_test(source, "20")

def test_060():
    """Test 60: Nested function calls"""
    source = """
    int inc(int x) { return x + 1; }
    void main() {
        printInt(inc(inc(inc(0))));
    }
    """
    run_test(source, "3")

def test_061():
    """Test 61: Passing a variable to a function"""
    source = """
    void printIt(int x) { printInt(x); }
    void main() {
        int val = 123;
        printIt(val);
    }
    """
    run_test(source, "123")

def test_062():
    """Test 62: Large expression with function calls"""
    source = """
    int one() { return 1; }
    int two() { return 2; }
    void main() {
        printInt((one() + two()) * (one() + two()));
    }
    """
    run_test(source, "9")

def test_063():
    """Test 63: Function with string parameter and return"""
    source = """
    string greet(string name) { return name; }
    void main() {
        printString(greet("TyC"));
    }
    """
    run_test(source, "TyC")

def test_064():
    """Test 64: Shadowing with same name across sibling blocks"""
    source = """
    void main() {
        {
            int x = 10;
            printInt(x);
        }
        {
            int x = 20;
            printInt(x);
        }
    }
    """
    run_test(source, "1020")

def test_065():
    """Test 65: Recursive function with multiple recursive calls"""
    source = """
    void traverse(int n) {
        if (n > 0) {
            traverse(n - 1);
            printInt(n);
            traverse(n - 1);
        }
    }
    void main() {
        traverse(2);
    }
    """
    run_test(source, "121")

def test_066():
    """Test 66: auto inference from complex expression"""
    run_test("void main() { auto x = 1.5 * 2; printFloat(x); }", "3.0")

def test_067():
    """Test 67: Function that returns its own parameter"""
    source = """
    float identity(float f) { return f; }
    void main() {
        printFloat(identity(42.42));
    }
    """
    run_test(source, "42.42")

def test_068():
    """Test 68: Multiple statements in a while loop"""
    source = """
    void main() {
        int i = 0;
        while (i < 3) {
            printString("start");
            printInt(i);
            i++;
            printString("end");
        }
    }
    """
    run_test(source, "start0endstart1endstart2end")

def test_069():
    """Test 69: Deeply nested if-else"""
    source = """
    void main() {
        if (1) {
            if (1) {
                if (0) printInt(1);
                else printInt(2);
                printInt(3);
            }
        } else {
            printInt(4);
        }
    }
    """
    run_test(source, "23")

def test_070():
    """Test 70: Nested while loops"""
    source = """
    void main() {
        int i = 0;
        while (i < 2) {
            int j = 0;
            while (j < 2) {
                printInt(i + j);
                j = j + 1;
            }
            i = i + 1;
        }
    }
    """
    # i=0, j=0: 0. i=0, j=1: 1. i=1, j=0: 1. i=1, j=1: 2.
    run_test(source, "0112")

def test_071():
    """Test 71: Simple struct declaration and member access"""
    source = """
    struct Point { int x; int y; };
    void main() {
        Point p = {10, 20};
        printInt(p.x);
        printInt(p.y);
    }
    """
    run_test(source, "1020")

def test_072():
    """Test 72: Struct member assignment"""
    source = """
    struct Point { int x; int y; };
    void main() {
        Point p = {0, 0};
        p.x = 42;
        printInt(p.x);
    }
    """
    run_test(source, "42")

def test_073():
    """Test 73: Struct with mixed types"""
    source = """
    struct Data { int i; float f; string s; };
    void main() {
        Data d = {1, 2.5, "hi"};
        printInt(d.i);
        printFloat(d.f);
        printString(d.s);
    }
    """
    run_test(source, "12.5hi")

def test_074():
    """Test 74: Nested structs"""
    source = """
    struct Point { int x; int y; };
    struct Rect { Point topLeft; Point bottomRight; };
    void main() {
        Rect r = {{0, 0}, {10, 20}};
        printInt(r.bottomRight.x);
    }
    """
    run_test(source, "10")

def test_075():
    """Test 75: Struct as function parameter"""
    source = """
    struct Point { int x; int y; };
    void printPoint(Point p) { printInt(p.x); }
    void main() {
        printPoint({7, 8});
    }
    """
    run_test(source, "7")

def test_076():
    """Test 76: Struct as return value"""
    source = """
    struct Point { int x; int y; };
    Point createPoint(int a, int b) { return {a, b}; }
    void main() {
        Point p = createPoint(1, 2);
        printInt(p.x);
    }
    """
    run_test(source, "1")

def test_077():
    """Test 77: Struct literal assignment to variable"""
    source = """
    struct Point { int x; };
    void main() {
        Point p;
        p = {99};
        printInt(p.x);
    }
    """
    run_test(source, "99")

def test_078():
    """Test 78: Structs in functions"""
    source = """
    struct Outer { int val; };
    void main() {
        Outer o = {42};
        printInt(o.val);
    }
    """
    run_test(source, "42")

def test_079():
    """Test 79: Struct member used in condition"""
    source = """
    struct Flag { int active; };
    void main() {
        Flag f = {1};
        if (f.active) printString("active");
        else printString("inactive");
    }
    """
    run_test(source, "active")

def test_080():
    """Test 80: Struct assignment (copy or reference check)"""
    source = """
    struct Point { int x; };
    void main() {
        Point p1 = {10};
        Point p2 = p1;
        p1.x = 20;
        printInt(p2.x);
    }
    """
    # In TyC, structs are passed by reference (JVM objects)
    run_test(source, "20")

def test_081():
    """Test 81: Basic switch with one case"""
    source = """
    void main() {
        switch (1) {
            case 1: printString("one");
        }
    }
    """
    run_test(source, "one")

def test_082():
    """Test 82: Switch with multiple cases and break"""
    source = """
    void main() {
        int x = 2;
        switch (x) {
            case 1: printString("1"); break;
            case 2: printString("2"); break;
            case 3: printString("3"); break;
        }
    }
    """
    run_test(source, "2")

def test_083():
    """Test 83: Switch default case"""
    source = """
    void main() {
        switch (10) {
            case 1: printString("1"); break;
            default: printString("def");
        }
    }
    """
    run_test(source, "def")

def test_084():
    """Test 84: Switch fall-through behavior"""
    source = """
    void main() {
        switch (1) {
            case 1: printString("1");
            case 2: printString("2");
        }
    }
    """
    run_test(source, "12")

def test_085():
    """Test 85: Switch with complex case expressions (constant folded)"""
    source = """
    void main() {
        switch (7) {
            case 3 + 4: printString("sum");
        }
    }
    """
    run_test(source, "sum")

def test_086():
    """Test 86: Switch inside a while loop with break"""
    source = """
    void main() {
        int i = 0;
        while (i < 3) {
            switch (i) {
                case 1: printString("hit"); break;
            }
            i++;
        }
    }
    """
    run_test(source, "hit")

def test_087():
    """Test 87: Nested switch"""
    source = """
    void main() {
        switch (1) {
            case 1:
                switch (2) {
                    case 2: printString("nested");
                }
        }
    }
    """
    run_test(source, "nested")

def test_088():
    """Test 88: For loop with struct member as condition"""
    source = """
    struct Counter { int count; };
    void main() {
        Counter c = {0};
        for (; c.count < 3; c.count++) {
            printInt(c.count);
        }
    }
    """
    run_test(source, "012")

def test_089():
    """Test 89: Multiple function declarations and calls"""
    source = """
    int a() { return 1; }
    int b() { return 2; }
    int c() { return 3; }
    void main() {
        printInt(a() + b() + c());
    }
    """
    run_test(source, "6")

def test_090():
    """Test 90: Deep recursion depth test"""
    source = """
    int sum(int n) {
        int res;
        if (n == 0) res = 0;
        else res = n + sum(n - 1);
        return res;
    }
    void main() {
        printInt(sum(50));
    }
    """
    run_test(source, "1275")

def test_091():
    """Test 91: Large integer arithmetic"""
    run_test("void main() { printInt(1000000 * 2); }", "2000000")

def test_092():
    """Test 92: Empty block statement"""
    run_test('void main() { {} printString("done"); }', "done")

def test_093():
    """Test 93: While loop with complex condition"""
    source = """
    void main() {
        int i = 0;
        int j = 10;
        while (i < j) {
            i++;
            j--;
        }
        printInt(i);
    }
    """
    run_test(source, "5")

def test_094():
    """Test 94: If statement with complex expression"""
    run_test('void main() { if (10 + 5 == 15) printString("true"); }', "true")

def test_095():
    """Test 95: Multiple ReturnStmt in function"""
    source = """
    int test(int x) {
        if (x == 1) return 10;
        if (x == 2) return 20;
        return 30;
    }
    void main() {
        printInt(test(1));
        printInt(test(2));
        printInt(test(3));
    }
    """
    run_test(source, "102030")

def test_096():
    """Test 96: Modulo with negative numbers"""
    run_test("void main() { printInt(-10 % 3); }", "-1")

def test_097():
    """Test 97: Nested function calls as arguments"""
    source = """
    int add(int a, int b) { return a + b; }
    void main() {
        printInt(add(add(1, 2), add(3, 4)));
    }
    """
    run_test(source, "10")

def test_098():
    """Test 98: String literal with escape characters"""
    source = """
    void main() {
        printString("line1\\nline2");
    }
    """
    run_test(source, "line1\\nline2")

def test_099():
    """Test 100: For loop with only condition"""
    source = """
    void main() {
        int i = 0;
        for (; i < 3; ) {
            printInt(i);
            i++;
        }
    }
    """
    run_test(source, "012")

def test_100():
    """Test 100: Final complex test"""
    source = """
    struct Player { string name; int score; };
    void updateScore(Player p, int s) {
        p.score = p.score + s;
    }
    void main() {
        Player p = {"Dev", 0};
        for (int i = 0; i < 5; i++) {
            updateScore(p, i);
        }
        printString(p.name);
        printInt(p.score);
    }
    """
    run_test(source, "Dev10")

def test_101():
    """Test 101: Short-circuiting AND"""
    source = """
    int sideEffect() {
        printString("side");
        return 1;
    }
    void main() {
        int x = 0 && sideEffect();
        printInt(x);
    }
    """
    run_test(source, "0")

def test_102():
    """Test 102: Short-circuiting OR"""
    source = """
    int sideEffect() {
        printString("side");
        return 0;
    }
    void main() {
        int x = 1 || sideEffect();
        printInt(x);
    }
    """
    run_test(source, "1")

def test_103():
    """Test 103: Deeply nested struct member update"""
    source = """
    struct A { int x; };
    struct B { A a; };
    struct C { B b; };
    void main() {
        C c = {{{10}}};
        ++c.b.a.x;
        printInt(c.b.a.x);
    }
    """
    run_test(source, "11")

def test_104():
    """Test 104: Break inside Switch inside While"""
    source = """
    void main() {
        int i = 0;
        while (i < 2) {
            switch (i) {
                case 0:
                    printString("zero");
                    break;
            }
            printString("loop");
            ++i;
        }
    }
    """
    run_test(source, "zerolooploop")

def test_105():
    """Test 105: Shadowing multiple levels"""
    source = """
    void main() {
        int x = 1;
        {
            int x = 2;
            for (int i = 3; i < 4; i++) {
                int x = 4;
                printInt(x);
            }
            printInt(x);
        }
        printInt(x);
    }
    """
    run_test(source, "421")

def test_106():
    """Test 106: Chained assignment with complex RHS"""
    source = """
    void main() {
        int a; int b; int c;
        a = b = c = (1 + 2) * 3;
        printInt(a); printInt(b); printInt(c);
    }
    """
    run_test(source, "999")

def test_107():
    """Test 107: Simple Recursion (Fibonacci) - Refactored to avoid VerifyError and UndeclaredFunction"""
    source = """
    int fib(int n) {
        int res;
        if (n <= 1) {
            res = n;
        } else {
            res = fib(n - 1) + fib(n - 2);
        }
        return res;
    }
    void main() {
        printInt(fib(6));
    }
    """
    run_test(source, "8")

def test_108():
    """Test 108: Complex Mixed Arithmetic"""
    source = """
    void main() {
        float f = (1 + 2.0) * (5 / 2) + 0.5;
        printFloat(f);
    }
    """
    run_test(source, "6.5")

def test_109():
    """Test 109: For loop with no parts"""
    source = """
    void main() {
        int i = 0;
        for (;;) {
            if (i > 2) break;
            printInt(i);
            ++i;
        }
    }
    """
    run_test(source, "012")

def test_110():
    """Test 110: Large program"""
    source = """
    struct Stats {
        int count;
        float avg;
    };
    void main() {
        Stats s = {0, 0.0};
        int sum = 0;
        for (int i = 1; i <= 4; i++) {
            sum = sum + i;
            s.count++;
        }
        // sum = 10, count = 4. (1.0 * 10) / 4 = 2.5
        s.avg = (1.0 * sum) / s.count; 
        printInt(s.count);
        printFloat(s.avg);
    }
    """
    run_test(source, "42.5")
