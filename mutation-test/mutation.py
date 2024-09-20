class MutationTest:

    # AOR: Replace arithmetic operators
    def apply_aor(self, a, b):
        return a + b  # mutation: a - b, a * b, etc.

    # AOD: Delete one operand from arithmetic operation
    def apply_aod(self, a, b):
        return a  # mutation: delete b

    # ROR: Replace relational operators
    def apply_ror(self, a, b):
        return a > b  # mutation: a < b, a >= b, etc.

    # LVR: Replace literal values
    def apply_lvr(self):
        x = 42  # mutation: replace with 0, 1, etc.
        return x

# Example usage
test = MutationTest()
print(test.apply_aor(5, 3))
print(test.apply_aod(10, 4))
print(test.apply_ror(10, 20))
print(test.apply_lvr())
