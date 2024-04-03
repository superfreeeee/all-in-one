package tutor

import (
	"fmt"
	"math"
	"runtime"
)

// 流程控制章节
func DemoFlow() {
	fmt.Println()
	fmt.Println("> DemoFlow")

	DemoLoop()
	DemoConditional()
	DemoDefer()
}

// 循环
func DemoLoop() {
	fmt.Println()
	fmt.Println("- DemoLoop")

	{
		// 普通 for
		sum := 0
		for i := 0; i < 10; i++ {
			sum += i
		}
		fmt.Println("sum =", sum)
	}

	{
		// while
		sum, i := 0, 0
		for i < 10 {
			sum += i
			i++
		}
		fmt.Println("sum =", sum)
	}

	{
		// 无限循环
		i := 0
		for {
			fmt.Println("i =", i)
			i++
			if i > 10 {
				break
			}
		}
	}
}

// 条件分支
func DemoConditional() {
	fmt.Println()
	fmt.Println("- DemoConditional")

	{
		// 不用 ()
		x := 1
		if x > 0 {
			fmt.Println("x > 0")
		} else {
			fmt.Println("x <= 0")
		}
	}

	{
		// 简单表达式, 作用域内可用
		if x, y := 1, 2; x < y {
			fmt.Printf("x=%v < y=%v\n", x, y)
		}
	}

	{
		// 牛顿法
		num := 123456.0
		res, times := Sqrt(num)
		fmt.Println("num =", num)
		fmt.Println("Sqrt(num)      =", res)
		fmt.Println("math.Sqrt(num) =", math.Sqrt(num))
		fmt.Println("times =", times)
	}

	{
		// switch 写法
		// 自动添加 break，需要写 fallthrough 来继续
		fmt.Print("Go runs on ")
		switch os := runtime.GOOS; os {
		case "darwin":
			fmt.Println("OS X.")
			fallthrough
		case "linux":
			fmt.Println("Linux.")
		default:
			// freebsd, openbsd,
			// plan9, windows...
			fmt.Printf("%s.\n", os)
		}
	}

	{
		// switch 调用顺序 => 上到下
		ret1 := func() int {
			fmt.Println("ret1")
			return 1
		}
		ret2 := func() int {
			fmt.Println("ret2")
			return 2
		}

		switch x := 1; x {
		case ret2():
			fmt.Println("x is 2")
		case ret1():
			fmt.Println("x is 1")
		default:
			fmt.Println("default")
		}
	}

	{
		// 无条件 switch => 多重 if-esle 简化写法
		x, y := 1, 2
		switch {
		case x > y:
			fmt.Println("x > y")
		case x < y:
			fmt.Println("x < y")
		default:
			fmt.Println("x == y")
		}
	}
}

func Sqrt(x float64) (float64, int) {
	z, time := x/2, 0
	for {
		time += 1
		z0 := z - (z*z-x)/(2*z)
		if z0 == z {
			return z0, time
		}
		z = z0
	}
}

// defer 用法*
func DemoDefer() {
	fmt.Println()
	fmt.Println("- DemoDefer")

	deferParams()
	deferStack()
}

func deferParams() {
	getOne := func() int {
		fmt.Println("getOne")
		return 1
	}
	// 参数会立即计算
	// 函数调用会延迟
	defer fmt.Println("getOne =", getOne())

	fmt.Println("after deferParams")
}

func deferStack() {
	// defer 的调用先进后出
	defer fmt.Println("defer 3")
	defer fmt.Println("defer 2")
	defer fmt.Println("defer 1")

	fmt.Println("after deferStack")
}
