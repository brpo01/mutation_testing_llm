public class MutationTest {

    // AOR: Replace arithmetic operators (+, -, *, /, %) with alternatives
    public int applyAOR(int a, int b) {
        return a + b; // mutation: a - b, a * b, etc.
    }

    // AOD: Delete one operand from an arithmetic operation
    public int applyAOD(int a, int b) {
        return a; // mutation: a + b, but b is deleted
    }

    // ROR: Replace relational operators (<, <=, >, >=, ==, !=)
    public boolean applyROR(int a, int b) {
        return a > b; // mutation: a < b, a >= b, etc.
    }

    // LVR: Replace literal values with boundary or extreme values
    public int applyLVR() {
        int x = 42; // mutation: replace with 0, 1, Integer.MAX_VALUE, etc.
        return x;
    }

    public static void main(String[] args) {
        MutationTest test = new MutationTest();
        System.out.println(test.applyAOR(5, 3));
        System.out.println(test.applyAOD(10, 4));
        System.out.println(test.applyROR(10, 20));
        System.out.println(test.applyLVR());
    }
}
