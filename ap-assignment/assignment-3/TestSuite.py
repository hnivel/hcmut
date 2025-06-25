import unittest
from TestUtils import TestUtils


class TestSymbolTable(unittest.TestCase):
    """
    INSERT Operations
    """

    def test_01(self):
        """Valid: lowercase identifier with number, type number"""
        input = ["INSERT a1 number"]
        expected = ["success"]
        self.assertTrue(TestUtils.check(input, expected, 101))

    def test_02(self):
        """Valid: simple lowercase identifier, type string"""
        input = ["INSERT b string"]
        expected = ["success"]
        self.assertTrue(TestUtils.check(input, expected, 102))

    def test_03(self):
        """Valid: identifier with underscore in middle"""
        input = ["INSERT a_bc number"]
        expected = ["success"]
        self.assertTrue(TestUtils.check(input, expected, 103))

    def test_04(self):
        """Valid: identifier with uppercase in middle"""
        input = ["INSERT aBc number"]
        expected = ["success"]
        self.assertTrue(TestUtils.check(input, expected, 104))

    def test_05(self):
        """Valid: complex identifier with numbers, uppercase, underscore"""
        input = ["INSERT a1B2_c3 number"]
        expected = ["success"]
        self.assertTrue(TestUtils.check(input, expected, 105))

    def test_06(self):
        """Invalid: identifier name starts with uppercase"""
        input = ["INSERT Xnumber number"]
        expected = ["Invalid: INSERT Xnumber number"]
        self.assertTrue(TestUtils.check(input, expected, 106))

    def test_07(self):
        """Invalid: identifier name starts with digit"""
        input = ["INSERT 1abc number"]
        expected = ["Invalid: INSERT 1abc number"]
        self.assertTrue(TestUtils.check(input, expected, 107))

    def test_08(self):
        """Invalid: identifier name contains special character $"""
        input = ["INSERT ab$c number"]
        expected = ["Invalid: INSERT ab$c number"]
        self.assertTrue(TestUtils.check(input, expected, 108))

    def test_09(self):
        """Invalid: identifier name contains special character @"""
        input = ["INSERT ab@c number"]
        expected = ["Invalid: INSERT ab@c number"]
        self.assertTrue(TestUtils.check(input, expected, 109))

    def test_10(self):
        """Invalid: identifier name contains space"""
        input = ["INSERT ab c number"]
        expected = ["Invalid: INSERT ab c number"]
        self.assertTrue(TestUtils.check(input, expected, 110))

    def test_11(self):
        """Invalid: identifier name starts with underscore"""
        input = ["INSERT _abc number"]
        expected = ["Invalid: INSERT _abc number"]
        self.assertTrue(TestUtils.check(input, expected, 111))

    def test_12(self):
        """Invalid: missing identifier name"""
        input = ["INSERT number"]
        expected = ["Invalid: INSERT number"]
        self.assertTrue(TestUtils.check(input, expected, 112))

    def test_13(self):
        """Invalid: missing identifier type"""
        input = ["INSERT abc"]
        expected = ["Invalid: INSERT abc"]
        self.assertTrue(TestUtils.check(input, expected, 113))

    def test_14(self):
        """Invalid: invalid identifier type"""
        input = ["INSERT abc boolean"]
        expected = ["Invalid: INSERT abc boolean"]
        self.assertTrue(TestUtils.check(input, expected, 114))

    def test_15(self):
        """Invalid: identifier type with uppercase (Number)"""
        input = ["INSERT abc Number"]
        expected = ["Invalid: INSERT abc Number"]
        self.assertTrue(TestUtils.check(input, expected, 115))

    def test_16(self):
        """Invalid: identifier type typo (numbr)"""
        input = ["INSERT abc numbr"]
        expected = ["Invalid: INSERT abc numbr"]
        self.assertTrue(TestUtils.check(input, expected, 116))

    def test_17(self):
        """Invalid: more than 2 arguments"""
        input = ["INSERT abc number extra"]
        expected = ["Invalid: INSERT abc number extra"]
        self.assertTrue(TestUtils.check(input, expected, 117))

    def test_18(self):
        """Invalid: missing both identifier name and identifier type"""
        input = ["INSERT"]
        expected = ["Invalid: INSERT"]
        self.assertTrue(TestUtils.check(input, expected, 118))

    def test_19(self):
        """Redeclared: identifier in same scope"""
        input = ["INSERT abc number", "INSERT abc number"]
        expected = ["Redeclared: INSERT abc number"]
        self.assertTrue(TestUtils.check(input, expected, 119))

    def test_20(self):
        """Valid: complex valid name with string type"""
        input = ["INSERT abc123_Xy string"]
        expected = ["success"]
        self.assertTrue(TestUtils.check(input, expected, 120))

    """
    ASSIGN Operations
    """

    def test_21(self):
        """Valid: assign integer constant to number variable"""
        input = ["INSERT x number", "ASSIGN x 123"]
        expected = ["success", "success"]
        self.assertTrue(TestUtils.check(input, expected, 121))

    def test_22(self):
        """Valid: assign string constant to string variable"""
        input = ["INSERT s string", "ASSIGN s 'abc'"]
        expected = ["success", "success"]
        self.assertTrue(TestUtils.check(input, expected, 122))

    def test_23(self):
        """TypeMismatch: assign integer to string variable"""
        input = ["INSERT s string", "ASSIGN s 123"]
        expected = ["TypeMismatch: ASSIGN s 123"]
        self.assertTrue(TestUtils.check(input, expected, 123))

    def test_24(self):
        """TypeMismatch: assign string to number variable"""
        input = ["INSERT x number", "ASSIGN x 'abc'"]
        expected = ["TypeMismatch: ASSIGN x 'abc'"]
        self.assertTrue(TestUtils.check(input, expected, 124))

    def test_25(self):
        """Undeclared: assign to undeclared variable"""
        input = ["ASSIGN x 123"]
        expected = ["Undeclared: ASSIGN x 123"]
        self.assertTrue(TestUtils.check(input, expected, 125))

    def test_26(self):
        """Undeclared: assign undeclared variable as value"""
        input = ["INSERT x number", "ASSIGN x y"]
        expected = ["Undeclared: ASSIGN x y"]
        self.assertTrue(TestUtils.check(input, expected, 126))

    def test_27(self):
        """Valid: assign variable to variable of same type"""
        input = ["INSERT x number", "INSERT y number",
                 "ASSIGN y 5", "ASSIGN x y"]
        expected = ["success", "success", "success", "success"]
        self.assertTrue(TestUtils.check(input, expected, 127))

    def test_28(self):
        """TypeMismatch: assign variable of different type"""
        input = ["INSERT x number", "INSERT y string",
                 "ASSIGN y 'abc'", "ASSIGN x y"]
        expected = ["TypeMismatch: ASSIGN x y"]
        self.assertTrue(TestUtils.check(input, expected, 128))

    def test_29(self):
        """Invalid: assign negative integer"""
        input = ["INSERT x number", "ASSIGN x -123"]
        expected = ["Invalid: ASSIGN x -123"]
        self.assertTrue(TestUtils.check(input, expected, 129))

    def test_30(self):
        """Invalid: assign float number"""
        input = ["INSERT x number", "ASSIGN x 12.3"]
        expected = ["Invalid: ASSIGN x 12.3"]
        self.assertTrue(TestUtils.check(input, expected, 130))

    def test_31(self):
        """Invalid: assign string with underscore"""
        input = ["INSERT s string", "ASSIGN s 'abc_1'"]
        expected = ["Invalid: ASSIGN s 'abc_1'"]
        self.assertTrue(TestUtils.check(input, expected, 131))

    def test_32(self):
        """Invalid: assign string with special character @"""
        input = ["INSERT s string", "ASSIGN s 'abc@'"]
        expected = ["Invalid: ASSIGN s 'abc@'"]
        self.assertTrue(TestUtils.check(input, expected, 132))

    def test_33(self):
        """Invalid: assign string with space"""
        input = ["INSERT s string", "ASSIGN s 'a b'"]
        expected = ["Invalid: ASSIGN s 'a b'"]
        self.assertTrue(TestUtils.check(input, expected, 133))

    def test_34(self):
        """Invalid: invalid identifier name"""
        input = ["INSERT s string", "ASSIGN _s ''"]
        expected = ["Invalid: ASSIGN _s ''"]
        self.assertTrue(TestUtils.check(input, expected, 134))

    def test_35(self):
        """Valid: assign empty string to string variable"""
        input = ["INSERT s string", "ASSIGN s ''"]
        expected = ["success", "success"]
        self.assertTrue(TestUtils.check(input, expected, 135))

    def test_36(self):
        """Valid: assign string with only letters to string variable"""
        input = ["INSERT s string", "ASSIGN s 'abcDEF'"]
        expected = ["success", "success"]
        self.assertTrue(TestUtils.check(input, expected, 136))

    def test_37(self):
        """Valid: assign string with letters and digits to string variable"""
        input = ["INSERT s string", "ASSIGN s 'a1B2'"]
        expected = ["success", "success"]
        self.assertTrue(TestUtils.check(input, expected, 137))

    def test_38(self):
        """Invalid: assign string missing closing quote"""
        input = ["INSERT s string", "ASSIGN s 'abc"]
        expected = ["Invalid: ASSIGN s 'abc"]
        self.assertTrue(TestUtils.check(input, expected, 138))

    def test_39(self):
        """Invalid: assign string missing opening quote"""
        input = ["INSERT s string", "ASSIGN s abc'"]
        expected = ["Invalid: ASSIGN s abc'"]
        self.assertTrue(TestUtils.check(input, expected, 139))

    def test_40(self):
        """Valid: assign variable from outer scope"""
        input = ["INSERT x number", "BEGIN", "ASSIGN x 10", "END"]
        expected = ["success", "success"]
        self.assertTrue(TestUtils.check(input, expected, 140))
    """
    BEGIN/END Block Operations
    """

    def test_41(self):
        """Valid: simple BEGIN/END block"""
        input = ["BEGIN", "END"]
        expected = []
        self.assertTrue(TestUtils.check(input, expected, 141))

    def test_42(self):
        """Valid: nested BEGIN/END blocks"""
        input = ["BEGIN", "BEGIN", "END", "END"]
        expected = []
        self.assertTrue(TestUtils.check(input, expected, 142))

    def test_43(self):
        """Valid: variable redeclaration in inner block"""
        input = [
            "INSERT x number",
            "BEGIN",
            "INSERT x string",
            "END"
        ]
        expected = ["success", "success"]
        self.assertTrue(TestUtils.check(input, expected, 143))

    def test_44(self):
        """Valid: accessing variable from outer scope"""
        input = [
            "INSERT x number",
            "ASSIGN x 10",
            "BEGIN",
            "ASSIGN x 20",
            "END"
        ]
        expected = ["success", "success", "success"]
        self.assertTrue(TestUtils.check(input, expected, 144))

    def test_45(self):
        """Valid: accessing variables across multiple nested scopes"""
        input = [
            "INSERT x number",
            "BEGIN",
            "INSERT y string",
            "BEGIN",
            "INSERT z number",
            "ASSIGN x 30",
            "END",
            "END"
        ]
        expected = ["success", "success", "success", "success"]
        self.assertTrue(TestUtils.check(input, expected, 145))

    def test_46(self):
        """UnclosedBlock: missing END for innermost BEGIN"""
        input = [
            "BEGIN",
            "BEGIN",
            "END"
        ]
        expected = ["UnclosedBlock: 1"]
        self.assertTrue(TestUtils.check(input, expected, 146))

    def test_47(self):
        """UnclosedBlock: multiple unclosed blocks"""
        input = [
            "BEGIN",
            "BEGIN",
            "BEGIN"
        ]
        expected = ["UnclosedBlock: 3"]
        self.assertTrue(TestUtils.check(input, expected, 147))

    def test_48(self):
        """UnknownBlock: END without matching BEGIN"""
        input = [
            "INSERT x number",
            "END"
        ]
        expected = ["UnknownBlock"]
        self.assertTrue(TestUtils.check(input, expected, 148))

    def test_49(self):
        """UnknownBlock: too many END statements"""
        input = [
            "BEGIN",
            "END",
            "END"
        ]
        expected = ["UnknownBlock"]
        self.assertTrue(TestUtils.check(input, expected, 149))

    def test_50(self):
        """Valid: complex nesting with variable shadowing"""
        input = [
            "INSERT x number",
            "BEGIN",
            "INSERT x string",
            "BEGIN",
            "INSERT x number",
            "END",
            "END"
        ]
        expected = ["success", "success", "success"]
        self.assertTrue(TestUtils.check(input, expected, 150))

    def test_51(self):
        """Valid: assigning to shadowed variable"""
        input = [
            "INSERT x number",
            "ASSIGN x 10",
            "BEGIN",
            "INSERT x string",
            "ASSIGN x 'hello'",
            "END",
            "ASSIGN x 20"
        ]
        expected = ["success", "success", "success",
                    "success", "success"]
        self.assertTrue(TestUtils.check(input, expected, 151))

    def test_52(self):
        """Valid: deep nesting with five levels"""
        input = [
            "BEGIN",
            "BEGIN",
            "BEGIN",
            "BEGIN",
            "BEGIN",
            "END",
            "END",
            "END",
            "END",
            "END"
        ]
        expected = []
        self.assertTrue(TestUtils.check(input, expected, 152))

    def test_53(self):
        """UnclosedBlock: program ends with unclosed blocks"""
        input = [
            "INSERT x number",
            "BEGIN",
            "INSERT y string"
        ]
        expected = ["UnclosedBlock: 1"]
        self.assertTrue(TestUtils.check(input, expected, 153))

    def test_54(self):
        """Valid: empty BEGIN/END blocks between operations"""
        input = [
            "INSERT x number",
            "BEGIN",
            "END",
            "ASSIGN x 10"
        ]
        expected = ["success", "success"]
        self.assertTrue(TestUtils.check(input, expected, 154))

    def test_55(self):
        """TypeMismatch: assign across blocks with type mismatch"""
        input = [
            "INSERT x number",
            "BEGIN",
            "INSERT y string",
            "ASSIGN x y"
        ]
        expected = ["TypeMismatch: ASSIGN x y"]
        self.assertTrue(TestUtils.check(input, expected, 155))
    """
    LOOKUP Operations
    """

    def test_56(self):
        """Valid: lookup variable in current scope"""
        input = [
            "INSERT x number",
            "LOOKUP x"
        ]
        expected = ["success", "0"]
        self.assertTrue(TestUtils.check(input, expected, 156))

    def test_57(self):
        """Valid: lookup variable in outer scope"""
        input = [
            "INSERT x number",
            "BEGIN",
            "LOOKUP x",
            "END"
        ]
        expected = ["success", "0"]
        self.assertTrue(TestUtils.check(input, expected, 157))

    def test_58(self):
        """Undeclared: lookup for non-existent variable"""
        input = [
            "INSERT x number",
            "LOOKUP y"
        ]
        expected = ["Undeclared: LOOKUP y"]
        self.assertTrue(TestUtils.check(input, expected, 158))

    def test_59(self):
        """Valid: lookup shadowed variable (should find innermost)"""
        input = [
            "INSERT x number",
            "BEGIN",
            "INSERT x string",
            "LOOKUP x",
            "END"
        ]
        expected = ["success", "success", "1"]
        self.assertTrue(TestUtils.check(input, expected, 159))

    def test_60(self):
        """Valid: lookup in deep nesting, same name variables"""
        input = [
            "INSERT x number",
            "BEGIN",
            "BEGIN",
            "BEGIN",
            "INSERT x string",
            "LOOKUP x",
            "END",
            "END",
            "END"
        ]
        expected = ["success", "success", "3"]
        self.assertTrue(TestUtils.check(input, expected, 160))

    def test_61(self):
        """Valid: lookup after scope closed (should find in outer scope)"""
        input = [
            "INSERT x number",
            "BEGIN",
            "INSERT y string",
            "END",
            "LOOKUP x"
        ]
        expected = ["success", "success", "0"]
        self.assertTrue(TestUtils.check(input, expected, 161))

    def test_62(self):
        """Undeclared: lookup variable after its scope is closed"""
        input = [
            "BEGIN",
            "INSERT x number",
            "END",
            "LOOKUP x"
        ]
        expected = ["Undeclared: LOOKUP x"]
        self.assertTrue(TestUtils.check(input, expected, 162))

    def test_63(self):
        """Invalid: lookup with no arguments"""
        input = ["LOOKUP"]
        expected = ["Invalid: LOOKUP"]
        self.assertTrue(TestUtils.check(input, expected, 163))

    def test_64(self):
        """Invalid: lookup with invalid identifier (starts with number)"""
        input = ["LOOKUP 1x"]
        expected = ["Invalid: LOOKUP 1x"]
        self.assertTrue(TestUtils.check(input, expected, 164))

    def test_65(self):
        """Invalid: lookup with invalid identifier (starts with uppercase)"""
        input = ["LOOKUP Xyz"]
        expected = ["Invalid: LOOKUP Xyz"]
        self.assertTrue(TestUtils.check(input, expected, 165))

    def test_66(self):
        """Invalid: lookup with invalid identifier (contains special character @)"""
        input = ["LOOKUP x@y"]
        expected = ["Invalid: LOOKUP x@y"]
        self.assertTrue(TestUtils.check(input, expected, 166))

    def test_67(self):
        """Valid: lookup across multiple nested scopes"""
        input = [
            "INSERT a number",
            "BEGIN",
            "INSERT b string",
            "BEGIN",
            "INSERT c number",
            "LOOKUP a",
            "LOOKUP b",
            "LOOKUP c",
            "END",
            "END"
        ]
        expected = ["success", "success", "success", "0", "1", "2"]
        self.assertTrue(TestUtils.check(input, expected, 167))

    def test_68(self):
        """Valid: lookup with example from problem statement"""
        input = [
            "INSERT x number",
            "INSERT y string",
            "BEGIN",
            "INSERT x number",
            "LOOKUP x",
            "LOOKUP y",
            "END"
        ]
        expected = ["success", "success", "success", "1", "0"]
        self.assertTrue(TestUtils.check(input, expected, 168))

    def test_69(self):
        """Valid: lookup variable after multiple redeclarations in different scopes"""
        input = [
            "INSERT x number",
            "BEGIN",
            "INSERT x string",
            "BEGIN",
            "INSERT x number",
            "END",
            "LOOKUP x",
            "END",
            "LOOKUP x"
        ]
        expected = ["success", "success", "success", "1", "0"]
        self.assertTrue(TestUtils.check(input, expected, 169))

    def test_70(self):
        """Undeclared: attempt lookup after error in previous operation"""
        input = [
            "INSERT x number",
            "ASSIGN y 10",
            "LOOKUP x"
        ]
        expected = ["Undeclared: ASSIGN y 10"]
        self.assertTrue(TestUtils.check(input, expected, 170))

    """
    PRINT Operations
    """

    def test_71(self):
        """Valid: simple PRINT in global scope"""
        input = [
            "INSERT x number",
            "INSERT y string",
            "PRINT"
        ]
        expected = ["success", "success", "x//0 y//0"]
        self.assertTrue(TestUtils.check(input, expected, 171))

    def test_72(self):
        """Valid: PRINT with example from problem statement"""
        input = [
            "INSERT x number",
            "INSERT y string",
            "BEGIN",
            "INSERT x number",
            "INSERT z number",
            "PRINT",
            "END"
        ]
        expected = ["success", "success",
                    "success", "success", "y//0 x//1 z//1"]
        self.assertTrue(TestUtils.check(input, expected, 172))

    def test_73(self):
        """Invalid: PRINT with arguments"""
        input = ["PRINT arg"]
        expected = ["Invalid: PRINT arg"]
        self.assertTrue(TestUtils.check(input, expected, 173))

    def test_74(self):
        """Valid: PRINT in empty scope"""
        input = ["PRINT"]
        expected = [""]
        self.assertTrue(TestUtils.check(input, expected, 174))

    def test_75(self):
        """Valid: PRINT with multiple shadowed variables"""
        input = [
            "INSERT x number",
            "BEGIN",
            "INSERT y string",
            "INSERT x string",
            "BEGIN",
            "INSERT z number",
            "PRINT",
            "END",
            "END"
        ]
        expected = ["success", "success", "success",
                    "success", "y//1 x//1 z//2"]
        self.assertTrue(TestUtils.check(input, expected, 175))

    def test_76(self):
        """Valid: PRINT after multiple BEGIN/END operations"""
        input = [
            "INSERT x number",
            "BEGIN",
            "INSERT y string",
            "END",
            "INSERT z number",
            "PRINT"
        ]
        expected = ["success", "success", "success", "x//0 z//0"]
        self.assertTrue(TestUtils.check(input, expected, 176))

    def test_77(self):
        """Valid: PRINT in nested scope with no variables in inner scope"""
        input = [
            "INSERT x number",
            "INSERT y string",
            "BEGIN",
            "PRINT",
            "END"
        ]
        expected = ["success", "success", "x//0 y//0"]
        self.assertTrue(TestUtils.check(input, expected, 177))

    def test_78(self):
        """Valid: PRINT in global scope after multiple scopes close"""
        input = [
            "INSERT x number",
            "BEGIN",
            "INSERT y string",
            "BEGIN",
            "INSERT z number",
            "END",
            "END",
            "PRINT"
        ]
        expected = ["success", "success", "success", "x//0"]
        self.assertTrue(TestUtils.check(input, expected, 178))

    def test_79(self):
        """Valid: multiple PRINT operations in different scopes"""
        input = [
            "INSERT x number",
            "PRINT",
            "BEGIN",
            "INSERT y string",
            "PRINT",
            "END",
            "PRINT"
        ]
        expected = ["success", "x//0", "success", "x//0 y//1", "x//0"]
        self.assertTrue(TestUtils.check(input, expected, 179))

    def test_80(self):
        """Valid: PRINT with variables declared in order of inner to outer scope"""
        input = [
            "BEGIN",
            "INSERT x number",
            "BEGIN",
            "INSERT y string",
            "PRINT",
            "END",
            "END"
        ]
        expected = ["success", "success", "x//1 y//2"]
        self.assertTrue(TestUtils.check(input, expected, 180))

    """
    RPRINT Operations
    """

    def test_81(self):
        """Valid: simple RPRINT in global scope"""
        input = [
            "INSERT x number",
            "INSERT y string",
            "RPRINT"
        ]
        expected = ["success", "success", "y//0 x//0"]
        self.assertTrue(TestUtils.check(input, expected, 181))

    def test_82(self):
        """Valid: RPRINT with example from problem statement"""
        input = [
            "INSERT x number",
            "INSERT y string",
            "BEGIN",
            "INSERT x number",
            "INSERT z number",
            "RPRINT",
            "END"
        ]
        expected = ["success", "success",
                    "success", "success", "z//1 x//1 y//0"]
        self.assertTrue(TestUtils.check(input, expected, 182))

    def test_83(self):
        """Invalid: RPRINT with arguments"""
        input = ["RPRINT arg"]
        expected = ["Invalid: RPRINT arg"]
        self.assertTrue(TestUtils.check(input, expected, 183))

    def test_84(self):
        """Valid: RPRINT in empty scope"""
        input = ["RPRINT"]
        expected = [""]
        self.assertTrue(TestUtils.check(input, expected, 184))

    def test_85(self):
        """Valid: RPRINT with multiple shadowed variables"""
        input = [
            "INSERT x number",
            "BEGIN",
            "INSERT y string",
            "INSERT x string",
            "BEGIN",
            "INSERT z number",
            "RPRINT",
            "END",
            "END"
        ]
        expected = ["success", "success", "success",
                    "success", "z//2 x//1 y//1"]
        self.assertTrue(TestUtils.check(input, expected, 185))

    def test_86(self):
        """Valid: compare PRINT and RPRINT in same scope"""
        input = [
            "INSERT x number",
            "INSERT y string",
            "BEGIN",
            "INSERT z number",
            "PRINT",
            "RPRINT",
            "END"
        ]
        expected = ["success", "success", "success",
                    "x//0 y//0 z//1", "z//1 y//0 x//0"]
        self.assertTrue(TestUtils.check(input, expected, 186))

    def test_87(self):
        """Valid: RPRINT in nested scope with no variables in inner scope"""
        input = [
            "INSERT x number",
            "INSERT y string",
            "BEGIN",
            "RPRINT",
            "END"
        ]
        expected = ["success", "success", "y//0 x//0"]
        self.assertTrue(TestUtils.check(input, expected, 187))

    def test_88(self):
        """Valid: RPRINT after multiple BEGIN/END operations"""
        input = [
            "INSERT x number",
            "BEGIN",
            "INSERT y string",
            "END",
            "INSERT z number",
            "RPRINT"
        ]
        expected = ["success", "success", "success", "z//0 x//0"]
        self.assertTrue(TestUtils.check(input, expected, 188))

    def test_89(self):
        """Valid: multiple RPRINT operations in different scopes"""
        input = [
            "INSERT x number",
            "RPRINT",
            "BEGIN",
            "INSERT y string",
            "RPRINT",
            "END",
            "RPRINT"
        ]
        expected = ["success", "x//0", "success", "y//1 x//0", "x//0"]
        self.assertTrue(TestUtils.check(input, expected, 189))

    def test_90(self):
        """Valid: complex nesting with RPRINT in each level"""
        input = [
            "INSERT a number",
            "BEGIN",
            "INSERT b string",
            "RPRINT",
            "BEGIN",
            "INSERT c number",
            "RPRINT",
            "BEGIN",
            "INSERT d string",
            "RPRINT",
            "END",
            "END",
            "END"
        ]
        expected = ["success", "success", "b//1 a//0", "success",
                    "c//2 b//1 a//0", "success", "d//3 c//2 b//1 a//0"]
        self.assertTrue(TestUtils.check(input, expected, 190))

    """
    Complex Test Cases
    """

    def test_91(self):
        """Complex: deep nesting with operations across all levels"""
        input = [
            "INSERT global number",
            "ASSIGN global 100",
            "BEGIN",
            "INSERT level1 string",
            "ASSIGN level1 'first'",
            "LOOKUP global",
            "BEGIN",
            "INSERT level2 number",
            "INSERT global string",
            "ASSIGN global 'shadowed'",
            "LOOKUP level1",
            "BEGIN",
            "LOOKUP global",
            "LOOKUP level2",
            "PRINT",
            "RPRINT",
            "END",
            "LOOKUP global",
            "END",
            "LOOKUP global",
            "END"
        ]
        expected = [
            "success", "success",
            "success",
            "success", "0",
            "success",
            "success", "success", "1",
            "2", "2", "level1//1 level2//2 global//2", "global//2 level2//2 level1//1",
            "2",
            "0"
        ]
        self.assertTrue(TestUtils.check(input, expected, 191))

    def test_92(self):
        """Complex: error propagation stops execution"""
        input = [
            "INSERT x number",
            "BEGIN",
            "ASSIGN y 10",
            "INSERT z number",
            "END",
            "ASSIGN x 20"
        ]
        expected = ["Undeclared: ASSIGN y 10"]
        self.assertTrue(TestUtils.check(input, expected, 192))

    def test_93(self):
        """Complex: multiple redeclarations and shadowing across scopes"""
        input = [
            "INSERT x number",
            "ASSIGN x 10",
            "INSERT y string",
            "ASSIGN y 'global'",
            "BEGIN",
            "INSERT x string",
            "INSERT z number",
            "ASSIGN x 'level1'",
            "ASSIGN z 100",
            "LOOKUP x",
            "LOOKUP y",
            "BEGIN",
            "INSERT x number",
            "INSERT y number",
            "ASSIGN x 999",
            "ASSIGN y 888",
            "LOOKUP x",
            "LOOKUP y",
            "LOOKUP z",
            "END",
            "LOOKUP x",
            "LOOKUP y",
            "END",
            "ASSIGN x 50",
            "LOOKUP x"
        ]
        expected = [
            "success", "success", "success", "success",
            "success", "success", "success", "success", "1", "0",
            "success", "success", "success", "success", "2", "2", "1",
            "1", "0",
            "success", "0"
        ]
        self.assertTrue(TestUtils.check(input, expected, 193))

    def test_94(self):
        """Complex: variable visibility with PRINT/RPRINT after operations"""
        input = [
            "INSERT a number",
            "ASSIGN a 1",
            "INSERT b string",
            "ASSIGN b 'global'",
            "BEGIN",
            "INSERT c number",
            "ASSIGN c 2",
            "INSERT a string",
            "ASSIGN a 'local'",
            "PRINT",
            "BEGIN",
            "INSERT d number",
            "ASSIGN d 3",
            "PRINT",
            "RPRINT",
            "END",
            "PRINT",
            "END",
            "PRINT"
        ]
        expected = [
            "success", "success", "success", "success",
            "success", "success", "success", "success", "b//0 c//1 a//1",
            "success", "success", "b//0 c//1 a//1 d//2", "d//2 a//1 c//1 b//0",
            "b//0 c//1 a//1",
            "a//0 b//0"
        ]
        self.assertTrue(TestUtils.check(input, expected, 194))

    def test_95(self):
        """Complex: LOOKUP chain after multiple assignments"""
        input = [
            "INSERT x number",
            "INSERT y number",
            "INSERT z number",
            "ASSIGN x 100",
            "ASSIGN y 200",
            "ASSIGN z 300",
            "BEGIN",
            "INSERT w number",
            "ASSIGN w 400",
            "BEGIN",
            "LOOKUP x",
            "LOOKUP y",
            "LOOKUP z",
            "LOOKUP w",
            "END",
            "LOOKUP x",
            "LOOKUP y",
            "LOOKUP z",
            "LOOKUP w",
            "END",
            "LOOKUP x",
            "LOOKUP y",
            "LOOKUP z"
        ]
        expected = [
            "success", "success", "success", "success", "success", "success",
            "success", "success",
            "0", "0", "0", "1",
            "0", "0", "0", "1",
            "0", "0", "0"
        ]
        self.assertTrue(TestUtils.check(input, expected, 195))

    def test_96(self):
        """Complex: BEGIN/END blocks with boundary conditions"""
        input = [
            "BEGIN",
            "INSERT x number",
            "BEGIN",
            "BEGIN",
            "BEGIN",
            "BEGIN",
            "INSERT y string",
            "ASSIGN y 'deepest'",
            "LOOKUP x",
            "END",
            "END",
            "END",
            "END",
            "ASSIGN x 50",
            "LOOKUP x",
            "END",
            "BEGIN",
            "LOOKUP x",
            "END"
        ]
        expected = ["Undeclared: LOOKUP x"]
        self.assertTrue(TestUtils.check(input, expected, 196))

    def test_97(self):
        """Complex: invalid instructions followed by valid ones"""
        input = [
            "INSERT validName number",
            "INSERT 1invalidName number",
            "ASSIGN validName 100",
            "LOOKUP validName"
        ]
        expected = ["Invalid: INSERT 1invalidName number"]
        self.assertTrue(TestUtils.check(input, expected, 197))

    def test_98(self):
        """Complex: type checking across multiple scopes"""
        input = [
            "INSERT num number",
            "INSERT str string",
            "ASSIGN num 100",
            "ASSIGN str 'text'",
            "BEGIN",
            "INSERT localNum number",
            "INSERT localStr string",
            "ASSIGN localNum 200",
            "ASSIGN localStr 'local'",
            "ASSIGN localNum str",
            "END"
        ]
        expected = ["TypeMismatch: ASSIGN localNum str"]
        self.assertTrue(TestUtils.check(input, expected, 198))

    def test_99(self):
        """Complex: edge cases with empty strings and values"""
        input = [
            "INSERT s1 string",
            "INSERT s2 string",
            "INSERT n number",
            "ASSIGN s1 ''",
            "ASSIGN s2 'abc123'",
            "ASSIGN n 0",
            "LOOKUP s1",
            "LOOKUP s2",
            "LOOKUP n",
            "BEGIN",
            "ASSIGN s1 '0'",
            "ASSIGN n 9999",
            "PRINT",
            "END",
            "RPRINT"
        ]
        expected = [
            "success", "success", "success", "success", "success", "success",
            "0", "0", "0",
            "success", "success", "s1//0 s2//0 n//0",
            "n//0 s2//0 s1//0"
        ]
        self.assertTrue(TestUtils.check(input, expected, 199))

    def test_100(self):
        """Complex: comprehensive test with all operations"""
        input = [
            "INSERT counter number",
            "INSERT message string",
            "ASSIGN counter 0",
            "ASSIGN message 'start'",
            "BEGIN",
            "INSERT temp number",
            "ASSIGN temp 100",
            "ASSIGN counter 1",
            "PRINT",
            "BEGIN",
            "INSERT counter string",
            "ASSIGN counter 'shadowed'",
            "INSERT flag number",
            "ASSIGN flag 1",
            "LOOKUP message",
            "RPRINT",
            "BEGIN",
            "INSERT local number",
            "ASSIGN local 999",
            "LOOKUP counter",
            "LOOKUP temp",
            "LOOKUP flag",
            "PRINT",
            "END",
            "LOOKUP local",
            "END",
            "ASSIGN temp 200",
            "LOOKUP counter",
            "PRINT",
            "END"
        ]
        expected = ["Undeclared: LOOKUP local"]
        self.assertTrue(TestUtils.check(input, expected, 200))
