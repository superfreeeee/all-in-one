package main

import (
	"fmt"
	"math/rand"

	"example.com/test_go/test_alloc"
	"example.com/test_go/test_struct"
	"example.com/test_go/tutor"
)

func main() {
	fmt.Println("Hello World")
	fmt.Println("My favorite number is", rand.Intn(10))

	tutor.TutorStart()
	test_struct.TestStruct()
	test_alloc.TestAlloc()
}
