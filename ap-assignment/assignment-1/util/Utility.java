public class Utility {

    /**
     * Test whether a specific number is a prime number.
     *
     * @param number the number
     * @return <code>true</code> if <code>number</code> is a prime number.
     */
    public static boolean isPrime(int number) {
        if (number <= 1) {
            return false;
        }

        for (int i = 2; i <= Math.sqrt(number); i++) {
            if (number % i == 0) {
                return false;
            }
        }
        return true;
    }

    /**
     * Test whether a specific number is a square number.
     *
     * @param number the number
     * @return <code>true</code> if <code>number</code> is a square number.
     */
    public static boolean isSquare(int number) {
        int x = (int) Math.sqrt(number);
        return x * x == number;
    }

    /**
     * Determine whether a number is a Fibonacci number and returns its index in the
     * sequence.
     * Fibonacci numbers are calculated as follows:
     * F(0) = 0, F(1) = 1, F(n) = F(n - 1) + F(n - 2), for n >= 2.
     *
     * @param number The number to check if it belongs to the Fibonacci sequence.
     * @return The index (n) if the number is a Fibonacci number, or -1 if it is not
     *         a Fibonacci number.
     */
    public static int getFibonacciIndex(int number) {
        if (number < 0) {
            return -1;
        }
        int a = 0;
        int b = 1;
        int index = 2;
        while (b < number) {
            int temporary = a + b;
            a = b;
            b = temporary;
            index++;
        }
        return (b == number) ? index : -1;
    }
}
