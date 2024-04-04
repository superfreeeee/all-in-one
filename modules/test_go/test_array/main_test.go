package test_array

import (
	"fmt"
	"testing"
)

func Test(t *testing.T) {
	defer CatchPanic()

	go raise()

	template := []string{
		"Hello 1",
		"Hello 2",
		"Hello 3",
	}
	fmt.Println(template[1])
	fmt.Println(template[3])
}

func raise() {
	defer CatchPanic()

	panic("raise panic")
}

func CatchPanic() {
	if r := recover(); r != nil {
		fmt.Println("panic:", r)
	}
}
