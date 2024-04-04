package test_panic

import (
	"fmt"
	"log"
	"testing"
)

func Test(t *testing.T) {
	defer CatchPanic()
	// panic 后还是会执行所有 defer 方法
	defer func() {
		fmt.Println("defer 1")
		panic("panic in defer")
	}()

	arr := make([]int, 0)
	fmt.Println(arr[0])
}

func CatchPanic() {
	if r := recover(); r != nil {
		log.Println("[CatchPanic]", r)
	}
}
