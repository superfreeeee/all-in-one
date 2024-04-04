package tutor

import (
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
)

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

func TestFunction(t *testing.T) {
	fmt.Println("1 + 2 =", add(1, 2))
	fmt.Println("1 - 2 =", sub(1, 2))

	assert.Equal(t, add(1, 2), 3)
	assert.Equal(t, sub(1, 2), -1)

	x, y := 1, 2
	assert.Equal(t, []int{x, y}, []int{1, 2})

	x, y = swap(x, y)
	fmt.Println("x =", x, ", y =", y)
	assert.Equal(t, []int{x, y}, []int{2, 1})

	fmt.Println("double(1) =", double(1))
	assert.Equal(t, double(1), 2)
}
