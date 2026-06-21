"""
Lexer test cases for TyC compiler
Comprehensive test suite covering all lexical elements (100 tests)
"""

import pytest
from tests.utils import Tokenizer


# ==========================================================================
# Keywords (tests 001-005)
# ==========================================================================

def test_001_keywords_control_flow():
    """Keywords: if, else, for, while, switch, case, default, break, continue, return"""
    assert Tokenizer("if").get_tokens_as_string() == "if,<EOF>"
    assert Tokenizer("else").get_tokens_as_string() == "else,<EOF>"
    assert Tokenizer("for").get_tokens_as_string() == "for,<EOF>"
    assert Tokenizer("while").get_tokens_as_string() == "while,<EOF>"
    assert Tokenizer("switch").get_tokens_as_string() == "switch,<EOF>"
    assert Tokenizer("case").get_tokens_as_string() == "case,<EOF>"
    assert Tokenizer("default").get_tokens_as_string() == "default,<EOF>"
    assert Tokenizer("break").get_tokens_as_string() == "break,<EOF>"
    assert Tokenizer("continue").get_tokens_as_string() == "continue,<EOF>"
    assert Tokenizer("return").get_tokens_as_string() == "return,<EOF>"


def test_002_keywords_types():
    """Keywords: int, float, string, void, auto, struct"""
    assert Tokenizer("int").get_tokens_as_string() == "int,<EOF>"
    assert Tokenizer("float").get_tokens_as_string() == "float,<EOF>"
    assert Tokenizer("string").get_tokens_as_string() == "string,<EOF>"
    assert Tokenizer("void").get_tokens_as_string() == "void,<EOF>"
    assert Tokenizer("auto").get_tokens_as_string() == "auto,<EOF>"
    assert Tokenizer("struct").get_tokens_as_string() == "struct,<EOF>"


def test_003_keywords_all():
    """All keywords in sequence"""
    source = "auto break case continue default else float for if int return string struct switch void while"
    expected = "auto,break,case,continue,default,else,float,for,if,int,return,string,struct,switch,void,while,<EOF>"
    assert Tokenizer(source).get_tokens_as_string() == expected


def test_004_keywords_case_sensitive():
    """Keywords are case-sensitive (INT, Int, IF are identifiers)"""
    assert Tokenizer("INT").get_tokens_as_string() == "INT,<EOF>"
    assert Tokenizer("Int").get_tokens_as_string() == "Int,<EOF>"
    assert Tokenizer("IF").get_tokens_as_string() == "IF,<EOF>"
    assert Tokenizer("RETURN").get_tokens_as_string() == "RETURN,<EOF>"


def test_005_keywords_as_prefix_suffix():
    """Identifiers with keywords as prefix/suffix"""
    assert Tokenizer("integer").get_tokens_as_string() == "integer,<EOF>"
    assert Tokenizer("myint").get_tokens_as_string() == "myint,<EOF>"
    assert Tokenizer(
        "returnValue").get_tokens_as_string() == "returnValue,<EOF>"
    assert Tokenizer("automate").get_tokens_as_string() == "automate,<EOF>"


# ==========================================================================
# Operators (tests 006-012)
# ==========================================================================

def test_006_operators_arithmetic():
    """Arithmetic operators: + - * / %"""
    assert Tokenizer("+").get_tokens_as_string() == "+,<EOF>"
    assert Tokenizer("-").get_tokens_as_string() == "-,<EOF>"
    assert Tokenizer("*").get_tokens_as_string() == "*,<EOF>"
    assert Tokenizer("/").get_tokens_as_string() == "/,<EOF>"
    assert Tokenizer("%").get_tokens_as_string() == "%,<EOF>"
    assert Tokenizer("+ - * / %").get_tokens_as_string() == "+,-,*,/,%,<EOF>"


def test_007_operators_comparison():
    """Comparison operators: == != < > <= >="""
    assert Tokenizer("==").get_tokens_as_string() == "==,<EOF>"
    assert Tokenizer("!=").get_tokens_as_string() == "!=,<EOF>"
    assert Tokenizer("<").get_tokens_as_string() == "<,<EOF>"
    assert Tokenizer(">").get_tokens_as_string() == ">,<EOF>"
    assert Tokenizer("<=").get_tokens_as_string() == "<=,<EOF>"
    assert Tokenizer(">=").get_tokens_as_string() == ">=,<EOF>"


def test_008_operators_logical():
    """Logical operators: && || !"""
    assert Tokenizer("&&").get_tokens_as_string() == "&&,<EOF>"
    assert Tokenizer("||").get_tokens_as_string() == "||,<EOF>"
    assert Tokenizer("!").get_tokens_as_string() == "!,<EOF>"


def test_009_operators_increment_decrement():
    """Increment/decrement operators: ++ --"""
    assert Tokenizer("++").get_tokens_as_string() == "++,<EOF>"
    assert Tokenizer("--").get_tokens_as_string() == "--,<EOF>"
    assert Tokenizer("x++").get_tokens_as_string() == "x,++,<EOF>"
    assert Tokenizer("--x").get_tokens_as_string() == "--,x,<EOF>"


def test_010_operators_assignment_member():
    """Assignment and member access: = ."""
    assert Tokenizer("=").get_tokens_as_string() == "=,<EOF>"
    assert Tokenizer(".").get_tokens_as_string() == ".,<EOF>"
    assert Tokenizer("a.b").get_tokens_as_string() == "a,.,b,<EOF>"
    assert Tokenizer("x = y").get_tokens_as_string() == "x,=,y,<EOF>"


def test_011_operators_compound_sequences():
    """Compound operator sequences: +++, ---, ===, <=>"""
    assert Tokenizer("x+++y").get_tokens_as_string() == "x,++,+,y,<EOF>"
    assert Tokenizer("x---y").get_tokens_as_string() == "x,--,-,y,<EOF>"
    assert Tokenizer("===").get_tokens_as_string() == "==,=,<EOF>"
    assert Tokenizer("<=>").get_tokens_as_string() == "<=,>,<EOF>"


def test_012_operators_with_spacing():
    """Operators with spacing become separate tokens"""
    assert Tokenizer("+ +").get_tokens_as_string() == "+,+,<EOF>"
    assert Tokenizer("- -").get_tokens_as_string() == "-,-,<EOF>"
    assert Tokenizer("= =").get_tokens_as_string() == "=,=,<EOF>"
    assert Tokenizer("< =").get_tokens_as_string() == "<,=,<EOF>"
    assert Tokenizer("! =").get_tokens_as_string() == "!,=,<EOF>"


# ==========================================================================
# Separators (tests 013-015)
# ==========================================================================

def test_013_separators_all():
    """All separators: { } ( ) ; , :"""
    assert Tokenizer("{").get_tokens_as_string() == "{,<EOF>"
    assert Tokenizer("}").get_tokens_as_string() == "},<EOF>"
    assert Tokenizer("(").get_tokens_as_string() == "(,<EOF>"
    assert Tokenizer(")").get_tokens_as_string() == "),<EOF>"
    assert Tokenizer(";").get_tokens_as_string() == ";,<EOF>"
    assert Tokenizer(",").get_tokens_as_string() == ",,<EOF>"
    assert Tokenizer(":").get_tokens_as_string() == ":,<EOF>"


def test_014_separators_together():
    """All separators in sequence"""
    assert Tokenizer("{}();,:").get_tokens_as_string() == "{,},(,),;,,,:,<EOF>"


def test_015_separators_in_context():
    """Separators in code context"""
    assert Tokenizer("f(a, b)").get_tokens_as_string() == "f,(,a,,,b,),<EOF>"
    assert Tokenizer("{ x; }").get_tokens_as_string() == "{,x,;,},<EOF>"
    assert Tokenizer("case 1:").get_tokens_as_string() == "case,1,:,<EOF>"


# ==========================================================================
# Integer Literals (tests 016-020)
# ==========================================================================

def test_016_integer_basic():
    """Basic integer literals: 0, single digit, multiple digits"""
    assert Tokenizer("0").get_tokens_as_string() == "0,<EOF>"
    assert Tokenizer("5").get_tokens_as_string() == "5,<EOF>"
    assert Tokenizer("12345").get_tokens_as_string() == "12345,<EOF>"
    assert Tokenizer("999999999").get_tokens_as_string() == "999999999,<EOF>"


def test_017_integer_leading_zeros():
    """Integer with leading zeros"""
    assert Tokenizer("007").get_tokens_as_string() == "007,<EOF>"
    assert Tokenizer("000123").get_tokens_as_string() == "000123,<EOF>"


def test_018_integer_negative_is_operator():
    """Negative sign is operator, not part of literal"""
    assert Tokenizer("-42").get_tokens_as_string() == "-,42,<EOF>"
    assert Tokenizer("-0").get_tokens_as_string() == "-,0,<EOF>"


def test_019_integer_in_expressions():
    """Integers in expressions"""
    assert Tokenizer("5+10").get_tokens_as_string() == "5,+,10,<EOF>"
    assert Tokenizer("100 >= 50").get_tokens_as_string() == "100,>=,50,<EOF>"
    assert Tokenizer("f(10, 20, 30)").get_tokens_as_string(
    ) == "f,(,10,,,20,,,30,),<EOF>"


def test_020_integer_sequence():
    """Sequence of integers"""
    assert Tokenizer("1 2 3 4 5").get_tokens_as_string() == "1,2,3,4,5,<EOF>"


# ==========================================================================
# Float Literals (tests 021-030)
# ==========================================================================

def test_021_float_basic():
    """Basic float literals"""
    assert Tokenizer("0.0").get_tokens_as_string() == "0.0,<EOF>"
    assert Tokenizer("3.14").get_tokens_as_string() == "3.14,<EOF>"
    assert Tokenizer(
        "0.123456789").get_tokens_as_string() == "0.123456789,<EOF>"


def test_022_float_no_leading_digit():
    """Float starting with dot (.5)"""
    assert Tokenizer(".5").get_tokens_as_string() == ".5,<EOF>"
    assert Tokenizer(".123").get_tokens_as_string() == ".123,<EOF>"


def test_023_float_no_trailing_digit():
    """Float ending with dot (5.)"""
    assert Tokenizer("5.").get_tokens_as_string() == "5.,<EOF>"
    assert Tokenizer("123.").get_tokens_as_string() == "123.,<EOF>"


def test_024_float_with_exponent():
    """Float with exponent (e/E)"""
    assert Tokenizer("1.5e10").get_tokens_as_string() == "1.5e10,<EOF>"
    assert Tokenizer("2.5e-3").get_tokens_as_string() == "2.5e-3,<EOF>"
    assert Tokenizer("3.14E5").get_tokens_as_string() == "3.14E5,<EOF>"
    assert Tokenizer("1.5e+10").get_tokens_as_string() == "1.5e+10,<EOF>"


def test_025_float_exponent_no_decimal():
    """Float with exponent but no decimal point"""
    assert Tokenizer("1e4").get_tokens_as_string() == "1e4,<EOF>"
    assert Tokenizer("2E-3").get_tokens_as_string() == "2E-3,<EOF>"
    assert Tokenizer("5e0").get_tokens_as_string() == "5e0,<EOF>"


def test_026_float_dot_with_exponent():
    """Float with dot and exponent"""
    assert Tokenizer(".5e2").get_tokens_as_string() == ".5e2,<EOF>"
    assert Tokenizer("5.e2").get_tokens_as_string() == "5.e2,<EOF>"


def test_027_float_invalid_patterns():
    """Invalid float patterns become separate tokens"""
    assert Tokenizer(".").get_tokens_as_string() == ".,<EOF>"
    assert Tokenizer(".e5").get_tokens_as_string() == ".,e5,<EOF>"
    assert Tokenizer("1e").get_tokens_as_string() == "1,e,<EOF>"
    assert Tokenizer("1e+").get_tokens_as_string() == "1,e,+,<EOF>"


def test_028_float_multiple_dots():
    """Multiple dots in sequence"""
    assert Tokenizer("1.2.3").get_tokens_as_string() == "1.2,.3,<EOF>"


def test_029_float_followed_by_identifier():
    """Float followed by identifier (member access pattern)"""
    assert Tokenizer("123.abc").get_tokens_as_string() == "123.,abc,<EOF>"
    assert Tokenizer(".abc").get_tokens_as_string() == ".,abc,<EOF>"


def test_030_float_in_expression():
    """Float in expression context"""
    assert Tokenizer("3.14 * 2.0").get_tokens_as_string() == "3.14,*,2.0,<EOF>"
    assert Tokenizer("5.+3").get_tokens_as_string() == "5.,+,3,<EOF>"


# ==========================================================================
# String Literals (tests 031-040)
# ==========================================================================

def test_031_string_basic():
    """Basic string literals"""
    assert Tokenizer('"hello"').get_tokens_as_string() == "hello,<EOF>"
    assert Tokenizer(
        '"hello world"').get_tokens_as_string() == "hello world,<EOF>"
    assert Tokenizer('"123abc456"').get_tokens_as_string() == "123abc456,<EOF>"


def test_032_string_empty():
    """Empty string"""
    assert Tokenizer('""').get_tokens_as_string() == ",<EOF>"


def test_033_string_escape_sequences():
    """Valid escape sequences: \\b \\f \\r \\n \\t \\" \\\\"""
    assert Tokenizer(r'"\b"').get_tokens_as_string() == r"\b,<EOF>"
    assert Tokenizer(r'"\f"').get_tokens_as_string() == r"\f,<EOF>"
    assert Tokenizer(r'"\r"').get_tokens_as_string() == r"\r,<EOF>"
    assert Tokenizer(r'"\n"').get_tokens_as_string() == r"\n,<EOF>"
    assert Tokenizer(r'"\t"').get_tokens_as_string() == r"\t,<EOF>"
    assert Tokenizer(r'"\""').get_tokens_as_string() == r'\",<EOF>'
    assert Tokenizer(r'"\\"').get_tokens_as_string() == r"\\,<EOF>"


def test_034_string_all_escapes():
    """String with all escape sequences"""
    assert Tokenizer(r'"\b\f\r\n\t\"\\"').get_tokens_as_string(
    ) == r"\b\f\r\n\t\"\\,<EOF>"


def test_035_string_mixed_content():
    """String with mixed content and escapes"""
    assert Tokenizer(r'"hello\tworld"').get_tokens_as_string(
    ) == r"hello\tworld,<EOF>"
    assert Tokenizer(r'"line1\nline2"').get_tokens_as_string(
    ) == r"line1\nline2,<EOF>"
    assert Tokenizer(r'"He said: \"Hello\""').get_tokens_as_string(
    ) == r'He said: \"Hello\",<EOF>'
    assert Tokenizer(r'"C:\\path\\to\\file"').get_tokens_as_string(
    ) == r"C:\\path\\to\\file,<EOF>"


def test_036_string_consecutive_escapes():
    """Consecutive escape sequences"""
    assert Tokenizer(r'"\\\\"').get_tokens_as_string() == r"\\\\,<EOF>"
    assert Tokenizer(r'"\"\"\""').get_tokens_as_string() == r'\"\"\",<EOF>'


def test_037_string_special_chars():
    """String with special characters (invalid outside string)"""
    assert Tokenizer('"@#$%^&*()"').get_tokens_as_string() == "@#$%^&*(),<EOF>"
    assert Tokenizer('"test!@#$%"').get_tokens_as_string() == "test!@#$%,<EOF>"


def test_038_string_in_context():
    """String in code context"""
    assert Tokenizer('printString("test")').get_tokens_as_string(
    ) == "printString,(,test,),<EOF>"


def test_039_string_consecutive():
    """Consecutive string literals"""
    assert Tokenizer(
        '"hello" "world"').get_tokens_as_string() == "hello,world,<EOF>"


def test_040_string_very_long():
    """Very long string literal"""
    long_str = 'a' * 500
    assert Tokenizer('"' + long_str +
                     '"').get_tokens_as_string() == long_str + ',<EOF>'


# ==========================================================================
# Identifiers (tests 041-050)
# ==========================================================================

def test_041_identifier_basic():
    """Basic identifiers"""
    assert Tokenizer("x").get_tokens_as_string() == "x,<EOF>"
    assert Tokenizer("variable").get_tokens_as_string() == "variable,<EOF>"
    assert Tokenizer("myVariable").get_tokens_as_string() == "myVariable,<EOF>"


def test_042_identifier_with_underscore():
    """Identifiers with underscores"""
    assert Tokenizer("_").get_tokens_as_string() == "_,<EOF>"
    assert Tokenizer("_private").get_tokens_as_string() == "_private,<EOF>"
    assert Tokenizer(
        "my_variable").get_tokens_as_string() == "my_variable,<EOF>"
    assert Tokenizer("var_").get_tokens_as_string() == "var_,<EOF>"
    assert Tokenizer("___").get_tokens_as_string() == "___,<EOF>"
    assert Tokenizer("my__var").get_tokens_as_string() == "my__var,<EOF>"


def test_043_identifier_with_digits():
    """Identifiers with digits"""
    assert Tokenizer("var123").get_tokens_as_string() == "var123,<EOF>"
    assert Tokenizer("x1y2z3").get_tokens_as_string() == "x1y2z3,<EOF>"
    assert Tokenizer("_123").get_tokens_as_string() == "_123,<EOF>"


def test_044_identifier_starts_with_digit():
    """Starting with digit becomes number + identifier"""
    assert Tokenizer("123abc").get_tokens_as_string() == "123,abc,<EOF>"
    assert Tokenizer("3var").get_tokens_as_string() == "3,var,<EOF>"


def test_045_identifier_case_variations():
    """Case variations (case-sensitive)"""
    assert Tokenizer("CONSTANT").get_tokens_as_string() == "CONSTANT,<EOF>"
    assert Tokenizer("MyVar myvar MYVAR").get_tokens_as_string(
    ) == "MyVar,myvar,MYVAR,<EOF>"


def test_046_identifier_long():
    """Long identifiers"""
    long_id = "a" * 100
    assert Tokenizer(long_id).get_tokens_as_string() == long_id + ",<EOF>"
    assert Tokenizer("thisIsAVeryLongIdentifierName").get_tokens_as_string(
    ) == "thisIsAVeryLongIdentifierName,<EOF>"


def test_047_identifier_multiple():
    """Multiple identifiers"""
    assert Tokenizer("x y z").get_tokens_as_string() == "x,y,z,<EOF>"
    assert Tokenizer("a b c d e").get_tokens_as_string() == "a,b,c,d,e,<EOF>"


def test_048_identifier_number_underscore():
    """Number followed by underscore becomes two tokens"""
    assert Tokenizer("123_456").get_tokens_as_string() == "123,_456,<EOF>"


def test_049_identifier_vs_keyword():
    """Identifiers similar to keywords"""
    assert Tokenizer("integer").get_tokens_as_string() == "integer,<EOF>"
    assert Tokenizer("floatValue").get_tokens_as_string() == "floatValue,<EOF>"
    assert Tokenizer("automate").get_tokens_as_string() == "automate,<EOF>"


def test_050_identifier_complex():
    """Complex identifier patterns"""
    assert Tokenizer("variable_name_123").get_tokens_as_string(
    ) == "variable_name_123,<EOF>"
    assert Tokenizer("_a1_b2_c3_").get_tokens_as_string() == "_a1_b2_c3_,<EOF>"


# ==========================================================================
# Comments (tests 051-058)
# ==========================================================================

def test_051_comment_line_basic():
    """Line comment basic"""
    assert Tokenizer("// This is a comment").get_tokens_as_string() == "<EOF>"
    assert Tokenizer("//").get_tokens_as_string() == "<EOF>"


def test_052_comment_line_after_code():
    """Line comment after code"""
    assert Tokenizer(
        "int x; // comment").get_tokens_as_string() == "int,x,;,<EOF>"
    assert Tokenizer(
        "x = 5; // inline comment").get_tokens_as_string() == "x,=,5,;,<EOF>"


def test_053_comment_line_ends_at_newline():
    """Line comment ends at newline"""
    assert Tokenizer(
        "// comment\nx = 5;").get_tokens_as_string() == "x,=,5,;,<EOF>"


def test_054_comment_block_basic():
    """Block comment basic"""
    assert Tokenizer("/* comment */").get_tokens_as_string() == "<EOF>"
    assert Tokenizer("/**/").get_tokens_as_string() == "<EOF>"
    assert Tokenizer("/* * */").get_tokens_as_string() == "<EOF>"


def test_055_comment_block_multiline():
    """Block comment multiline"""
    assert Tokenizer(
        "/* line1\nline2\nline3 */").get_tokens_as_string() == "<EOF>"


def test_056_comment_block_between_code():
    """Block comment between code"""
    assert Tokenizer(
        "int /* comment */ x;").get_tokens_as_string() == "int,x,;,<EOF>"


def test_057_comment_not_nested():
    """Block comments are not nested"""
    assert Tokenizer(
        "/* outer /* inner */ x").get_tokens_as_string() == "x,<EOF>"
    assert Tokenizer("/* /* inner */ */").get_tokens_as_string() == "*,/,<EOF>"


def test_058_comment_markers_in_other():
    """Comment markers have no meaning in other comment type"""
    # /* */ have no meaning in line comment
    assert Tokenizer(
        "// /* this is not a block */ still line\nx").get_tokens_as_string() == "x,<EOF>"
    # // has no meaning in block comment
    assert Tokenizer("/* // not line */ x").get_tokens_as_string() == "x,<EOF>"


# ==========================================================================
# Whitespace (tests 059-062)
# ==========================================================================

def test_059_whitespace_basic():
    """Basic whitespace: space, tab, newline"""
    assert Tokenizer("int     x").get_tokens_as_string() == "int,x,<EOF>"
    assert Tokenizer("int\t\tx").get_tokens_as_string() == "int,x,<EOF>"
    assert Tokenizer("int\n\nx").get_tokens_as_string() == "int,x,<EOF>"


def test_060_whitespace_all_types():
    """All whitespace types: space, tab, newline, CR, form feed"""
    assert Tokenizer(
        "int\t\n  x  \r\n;").get_tokens_as_string() == "int,x,;,<EOF>"
    assert Tokenizer("int\fx").get_tokens_as_string() == "int,x,<EOF>"
    assert Tokenizer("int\rx").get_tokens_as_string() == "int,x,<EOF>"


def test_061_whitespace_only():
    """Input with only whitespace"""
    assert Tokenizer("   \t\n\r\f   ").get_tokens_as_string() == "<EOF>"


def test_062_whitespace_empty():
    """Empty input"""
    assert Tokenizer("").get_tokens_as_string() == "<EOF>"


# ==========================================================================
# Error Cases - Illegal Escapes (tests 063-072)
# ==========================================================================

def test_063_illegal_escape_common():
    """Common illegal escape sequences: \\a \\v \\x \\z"""
    assert "Illegal Escape" in Tokenizer(r'"test\a"').get_tokens_as_string()
    assert "Illegal Escape" in Tokenizer(r'"test\v"').get_tokens_as_string()
    assert "Illegal Escape" in Tokenizer(r'"test\x"').get_tokens_as_string()
    assert "Illegal Escape" in Tokenizer(r'"test\z"').get_tokens_as_string()


def test_064_illegal_escape_digits():
    """Illegal escape with digits: \\0 \\1 (octal not supported)"""
    assert "Illegal Escape" in Tokenizer(r'"test\0"').get_tokens_as_string()
    assert "Illegal Escape" in Tokenizer(r'"test\1"').get_tokens_as_string()


def test_065_illegal_escape_special_chars():
    """Illegal escape with special characters"""
    assert "Illegal Escape" in Tokenizer(
        r'"test\ "').get_tokens_as_string()  # space
    assert "Illegal Escape" in Tokenizer(r'"test\?"').get_tokens_as_string()
    assert "Illegal Escape" in Tokenizer(r'"test\%"').get_tokens_as_string()
    assert "Illegal Escape" in Tokenizer(r'"test\["').get_tokens_as_string()


def test_066_illegal_escape_single_quote():
    """Illegal escape with single quote (\\' not valid in TyC)"""
    assert "Illegal Escape" in Tokenizer(r'"test\'"').get_tokens_as_string()


def test_067_illegal_escape_hex():
    """Hex escape not supported (\\x80)"""
    assert "Illegal Escape" in Tokenizer(r'"\x80"').get_tokens_as_string()


def test_068_illegal_escape_unicode():
    """Unicode escape not supported (\\u1234)"""
    assert "Illegal Escape" in Tokenizer(
        r'"unicode\u1234"').get_tokens_as_string()


def test_069_illegal_escape_at_start():
    """Illegal escape at start of string"""
    assert "Illegal Escape" in Tokenizer(r'"\xhello"').get_tokens_as_string()
    result = Tokenizer(r'"\aabc"').get_tokens_as_string()
    assert "Illegal Escape" in result
    assert r"\a" in result


def test_070_illegal_escape_after_valid():
    """Illegal escape after valid escapes"""
    result = Tokenizer(r'"\n\t\a"').get_tokens_as_string()
    assert "Illegal Escape" in result
    assert r"\n\t\a" in result


def test_071_illegal_escape_content():
    """Illegal escape message includes content up to illegal sequence"""
    result = Tokenizer(r'"abc\xdef"').get_tokens_as_string()
    assert "Illegal Escape" in result
    assert r"abc\x" in result


def test_072_illegal_escape_before_unclosed():
    """Illegal escape detected before unclosed string (error order)"""
    # Has both illegal escape \x and unclosed - illegal escape wins
    assert "Illegal Escape" in Tokenizer(r'"hello\x').get_tokens_as_string()
    assert "Illegal Escape" in Tokenizer('"hello\\a\n').get_tokens_as_string()


# ==========================================================================
# Error Cases - Unclosed Strings (tests 073-080)
# ==========================================================================

def test_073_unclosed_string_basic():
    """Unclosed string at EOF"""
    assert "Unclosed String" in Tokenizer('"hello').get_tokens_as_string()
    assert "Unclosed String" in Tokenizer('"').get_tokens_as_string()


def test_074_unclosed_string_at_newline():
    """Unclosed string at newline"""
    assert "Unclosed String" in Tokenizer('"hello\n').get_tokens_as_string()


def test_075_unclosed_string_at_cr():
    """Unclosed string at carriage return"""
    assert "Unclosed String" in Tokenizer('"hello\r').get_tokens_as_string()


def test_076_unclosed_string_with_valid_escapes():
    """Unclosed string with valid escape sequences"""
    assert "Unclosed String" in Tokenizer(r'"hello\n').get_tokens_as_string()
    assert "Unclosed String" in Tokenizer(r'"hello\t').get_tokens_as_string()


def test_077_unclosed_string_with_escaped_quote():
    """Unclosed string with escaped quote"""
    assert "Unclosed String" in Tokenizer(
        r'"test\"more').get_tokens_as_string()


def test_078_unclosed_string_ending_backslash():
    """Unclosed string ending with backslash"""
    assert "Unclosed String" in Tokenizer(r'"test\\').get_tokens_as_string()


def test_079_unclosed_string_long():
    """Unclosed long string"""
    assert "Unclosed String" in Tokenizer(
        '"this is a very long string without closing').get_tokens_as_string()


def test_080_unclosed_string_after_code():
    """Unclosed string after valid code"""
    result = Tokenizer('int x = "test').get_tokens_as_string()
    assert "Unclosed String" in result


# ==========================================================================
# Error Cases - Invalid Characters (tests 081-085)
# ==========================================================================

def test_081_invalid_char_common():
    """Common invalid characters: @ # $ ` ~"""
    assert "Error Token" in Tokenizer("@").get_tokens_as_string()
    assert "Error Token" in Tokenizer("#").get_tokens_as_string()
    assert "Error Token" in Tokenizer("$").get_tokens_as_string()
    assert "Error Token" in Tokenizer("`").get_tokens_as_string()
    assert "Error Token" in Tokenizer("~").get_tokens_as_string()


def test_082_invalid_char_in_code():
    """Invalid characters in code context"""
    assert "Error Token" in Tokenizer("int @x;").get_tokens_as_string()
    assert "Error Token" in Tokenizer("int #x;").get_tokens_as_string()
    assert "Error Token" in Tokenizer("int $x;").get_tokens_as_string()


def test_083_invalid_char_caret_question():
    """Invalid characters: ^ ?"""
    assert "Error Token" in Tokenizer("x^y").get_tokens_as_string()
    assert "Error Token" in Tokenizer("x?y").get_tokens_as_string()


def test_084_invalid_char_single_pipe_ampersand():
    """Single | and & are invalid (need || and &&)"""
    assert "Error Token" in Tokenizer("x | y").get_tokens_as_string()
    assert "Error Token" in Tokenizer("x & y").get_tokens_as_string()
    assert "Error Token" in Tokenizer("& &").get_tokens_as_string()
    assert "Error Token" in Tokenizer("| |").get_tokens_as_string()


def test_085_invalid_char_brackets():
    """Square brackets are invalid"""
    result = Tokenizer("[x]").get_tokens_as_string()
    assert "Error Token" in result


# ==========================================================================
# Complex Expressions (tests 086-095)
# ==========================================================================

def test_086_complex_variable_declaration():
    """Variable declaration"""
    assert Tokenizer(
        "auto x = 5 + 3 * 2;").get_tokens_as_string() == "auto,x,=,5,+,3,*,2,;,<EOF>"
    assert Tokenizer(
        "int y = 10;").get_tokens_as_string() == "int,y,=,10,;,<EOF>"


def test_087_complex_function_declaration():
    """Function declaration"""
    expected = "int,add,(,int,a,,,int,b,),{,return,a,+,b,;,},<EOF>"
    assert Tokenizer(
        "int add(int a, int b) { return a + b; }").get_tokens_as_string() == expected


def test_088_complex_struct_declaration():
    """Struct declaration"""
    expected = "struct,Point,{,int,x,;,int,y,;,},;,<EOF>"
    assert Tokenizer(
        "struct Point { int x; int y; };").get_tokens_as_string() == expected


def test_089_complex_if_statement():
    """If statement with logical operators"""
    expected = "if,(,x,>,0,&&,y,<,10,),{,z,=,x,+,y,;,},<EOF>"
    assert Tokenizer(
        "if (x > 0 && y < 10) { z = x + y; }").get_tokens_as_string() == expected


def test_090_complex_for_loop():
    """For loop"""
    expected = "for,(,int,i,=,0,;,i,<,10,;,++,i,),{,sum,=,sum,+,i,;,},<EOF>"
    assert Tokenizer(
        "for (int i = 0; i < 10; ++i) { sum = sum + i; }").get_tokens_as_string() == expected


def test_091_complex_switch_statement():
    """Switch statement"""
    expected = "switch,(,x,),{,case,1,:,y,=,1,;,break,;,default,:,y,=,0,;,},<EOF>"
    assert Tokenizer(
        "switch (x) { case 1: y = 1; break; default: y = 0; }").get_tokens_as_string() == expected


def test_092_complex_member_access():
    """Member access chains"""
    assert Tokenizer(
        "p.x = p.y + 10;").get_tokens_as_string() == "p,.,x,=,p,.,y,+,10,;,<EOF>"
    assert Tokenizer("a.b.c.d.e").get_tokens_as_string(
    ) == "a,.,b,.,c,.,d,.,e,<EOF>"


def test_093_complex_function_call():
    """Nested function calls"""
    expected = "result,=,add,(,mul,(,a,,,b,),,,div,(,c,,,d,),),;,<EOF>"
    assert Tokenizer(
        "result = add(mul(a, b), div(c, d));").get_tokens_as_string() == expected


def test_094_complex_nested_expression():
    """Nested parentheses and operators"""
    expected = "x,=,(,a,+,b,),*,(,c,-,d,),/,(,e,%,f,),;,<EOF>"
    assert Tokenizer(
        "x = (a + b) * (c - d) / (e % f);").get_tokens_as_string() == expected
    assert Tokenizer("((((x))))").get_tokens_as_string(
    ) == "(,(,(,(,x,),),),),<EOF>"


def test_095_complex_logical_expression():
    """Complex logical expression"""
    expected = "result,=,(,x,>,0,||,y,<,0,),&&,!,(,z,==,0,),;,<EOF>"
    assert Tokenizer(
        "result = (x > 0 || y < 0) && !(z == 0);").get_tokens_as_string() == expected


# ==========================================================================
# Full Programs (tests 096-100)
# ==========================================================================

def test_096_full_program_simple():
    """Simple complete program"""
    source = 'void main() { printInt(42); }'
    expected = "void,main,(,),{,printInt,(,42,),;,},<EOF>"
    assert Tokenizer(source).get_tokens_as_string() == expected


def test_097_full_program_with_struct():
    """Program with struct"""
    source = 'struct S{int x;};int f(int a){return a+1;}void main(){S s={5};printInt(s.x);}'
    expected = "struct,S,{,int,x,;,},;,int,f,(,int,a,),{,return,a,+,1,;,},void,main,(,),{,S,s,=,{,5,},;,printInt,(,s,.,x,),;,},<EOF>"
    assert Tokenizer(source).get_tokens_as_string() == expected


def test_098_full_program_with_comments():
    """Program with comments"""
    source = """
    // Main function
    void main() {
        /* Initialize */
        int x = 5;
        printInt(x); // print
    }
    """
    expected = "void,main,(,),{,int,x,=,5,;,printInt,(,x,),;,},<EOF>"
    assert Tokenizer(source).get_tokens_as_string() == expected


def test_099_full_program_all_features():
    """Program using all token types"""
    source = """
    struct Point { int x; int y; };
    int main() {
        Point p = {10, 20};
        return p.x + p.y;
    }
    """
    expected = "struct,Point,{,int,x,;,int,y,;,},;,int,main,(,),{,Point,p,=,{,10,,,20,},;,return,p,.,x,+,p,.,y,;,},<EOF>"
    assert Tokenizer(source).get_tokens_as_string() == expected


def test_100_full_program_no_spaces():
    """Dense code without optional spaces"""
    source = "x=y+z*w/v%u;a.b.c++;if(x>0&&y<10){z=1;}else{z=0;}"
    expected = "x,=,y,+,z,*,w,/,v,%,u,;,a,.,b,.,c,++,;,if,(,x,>,0,&&,y,<,10,),{,z,=,1,;,},else,{,z,=,0,;,},<EOF>"
    assert Tokenizer(source).get_tokens_as_string() == expected
