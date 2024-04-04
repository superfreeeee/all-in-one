package test_array

import (
	"fmt"
	"testing"
)

func Test(t *testing.T) {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("panic:", r)
		}
	}()

	template := []string{
		"Hello 1",
		"Hello 2",
		"Hello 3",
	}
	fmt.Println(template[1])
	// 越界 => 触发 panic
	fmt.Println(template[3])
}
