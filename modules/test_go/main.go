package main

import (
	"fmt"
	"math/rand"

	"example.com/test_go/tutor"
	"example.com/test_lib"
)

func main() {
	fmt.Println("Hello World")
	fmt.Println("My favorite number is", rand.Intn(10))
	test_lib.Hello("Superfree")

	tutor.TutorStart()
}
