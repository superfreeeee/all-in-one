package test_alloc

import (
	"fmt"
)

type MyStruct struct {
	data [1024]byte
}

func createStruct() *MyStruct {
	s := MyStruct{} // 在栈上分配 MyStruct 对象
	return &s
}

/*
测试内存分配是否逃逸 => 查看是在栈上还是堆上分配内存
*/
func AllocStruct() {
	// 1. 返回 *MyStruct => 移动到堆上
	s := createStruct()

	// 2. 当前作用域对象 => 分配在栈上
	s2 := MyStruct{}
	s.data[0] = s2.data[0]

	s3 := &MyStruct{}
	s3.data = s2.data
	// 打印的时候，使用了指针 => 因此逃逸到堆上了
	// fmt.Println(s3)
	// 不打印的时候 => 一直都存在在栈上
}

func AllocPrimitive() {
	x := getX()
	fmt.Println(*x)
	setX(x, 20)
	fmt.Println(*x)
}

func getX() *int {
	x := 10
	return &x
}

func setX(x *int, val int) {
	*x = val
}
