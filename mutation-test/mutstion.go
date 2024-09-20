package main

import "fmt"

type MutationTest struct{}

// AOR: Replace arithmetic operators
func (m MutationTest) ApplyAOR(a int, b int) int {
    return a + b // mutation: a - b, a * b, etc.
}

// AOD: Delete one operand from arithmetic operation
func (m MutationTest) ApplyAOD(a int, b int) int {
    return a // mutation: delete b
}

// ROR: Replace relational operators
func (m MutationTest) ApplyROR(a int, b int) bool {
    return a > b // mutation: a < b, a >= b, etc.
}

// LVR: Replace literal values
func (m MutationTest) ApplyLVR() int {
    x := 42 // mutation: replace with 0, 1, etc.
    return x
}

func main() {
    test := MutationTest{}
    fmt.Println(test.ApplyAOR(5, 3))
    fmt.Println(test.ApplyAOD(10, 4))
    fmt.Println(test.ApplyROR(10, 20))
    fmt.Println(test.ApplyLVR())
}
