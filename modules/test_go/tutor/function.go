package tutor

import "fmt"

// 函数签名
func add(x int, y int) int {
	return x + y
}

// 共享类型
func sub(x, y int) int {
	return x - y
}

// 多值返回
func swap(x, y int) (int, int) {
	return y, x
}

// 命名返回 => 预定义返回变量
func double(x int) (res int) {
	res = x * 2
	return
}

func DemoFunction() {
	fmt.Println()
	fmt.Println("> DemoFunction")
	fmt.Println("1 + 2 =", add(1, 2))
	fmt.Println("1 - 2 =", sub(1, 2))

	x, y := swap(1, 2)
	fmt.Println("x =", x, ", y =", y)

	fmt.Println("double(1) =", double(1))
}
