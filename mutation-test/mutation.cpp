#include <iostream>

class MutationTest {
public:
    // AOR: Replace arithmetic operators
    int applyAOR(int a, int b) {
        return a + b; // mutation: a - b, a * b, etc.
    }

    // AOD: Delete one operand from arithmetic operation
    int applyAOD(int a, int b) {
        return a; // mutation: delete b
    }

    // ROR: Replace relational operators
    bool applyROR(int a, int b) {
        return a > b; // mutation: a < b, a >= b, etc.
    }

    // LVR: Replace literal values
    int applyLVR() {
        int x = 42; // mutation: replace with 0, 1, etc.
        return x;
    }
};

int main() {
    MutationTest test;
    std::cout << test.applyAOR(5, 3) << std::endl;
    std::cout << test.applyAOD(10, 4) << std::endl;
    std::cout << test.applyROR(10, 20) << std::endl;
    std::cout << test.applyLVR() << std::endl;
    return 0;
}
