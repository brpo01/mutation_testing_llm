class MutationTest {

    // AOR: Replace arithmetic operators
    applyAOR(a, b) {
        return a + b; // mutation: a - b, a * b, etc.
    }

    // AOD: Delete one operand from arithmetic operation
    applyAOD(a, b) {
        return a; // mutation: delete b
    }

    // ROR: Replace relational operators
    applyROR(a, b) {
        return a > b; // mutation: a < b, a >= b, etc.
    }

    // LVR: Replace literal values
    applyLVR() {
        let x = 42; // mutation: replace with 0, 1, etc.
        return x;
    }
}

// Example usage
const test = new MutationTest();
console.log(test.applyAOR(5, 3));
console.log(test.applyAOD(10, 4));
console.log(test.applyROR(10, 20));
console.log(test.applyLVR());
