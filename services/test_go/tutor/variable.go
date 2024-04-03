package tutor

import (
	"fmt"
	"math"
	"math/cmplx"
)

// 包作用域
var s string
var i int
var b bool

// 多值
var b1, b2 bool = true, false

var (
	ToBe    bool       = false
	MaxInt  uint64     = 1<<64 - 1
	Complex complex128 = cmplx.Sqrt(-5 + 12i)
)

func DemoVariable() {
	fmt.Println()
	fmt.Println("> DemoVariable")

	fmt.Println("s =", s, len(s))
	fmt.Println("i =", i)
	fmt.Println("b =", b)
	fmt.Println("b1 =", b1)
	fmt.Println("b2 =", b2)

	{
		// 初始化
		var x, y int = 1, 2
		fmt.Printf("x = %d, y = %d\n", x, y)
	}

	// var 简化写法 :=
	z := 0
	fmt.Printf("z = %d\n", z)

	{
		fmt.Println()
		fmt.Println("- more types")

		// 复杂类型
		// %T 类型
		// %v 值
		fmt.Printf("Type: %T Value: %v\n", ToBe, ToBe)
		fmt.Printf("Type: %T Value: %v\n", MaxInt, MaxInt)
		fmt.Printf("Type: %T Value: %v\n", Complex, Complex)
	}

	{
		fmt.Println()
		fmt.Println("- default")

		// 空值
		var i int
		var f float64
		var b bool
		var s string
		fmt.Printf("%v %v %v %q\n", i, f, b, s)
	}

	{
		fmt.Println()
		fmt.Println("- convert")

		// 类型转换
		var x, y int = 3, 4
		var f float64 = math.Sqrt(float64(x*x + y*y))
		var z uint = uint(f)
		fmt.Println(x, y, z)
	}

	{
		fmt.Println()
		fmt.Println("- type inference")

		// 类型推导
		i := 42           // int
		f := 3.142        // float64
		g := 0.867 + 0.5i // complex128
		fmt.Println(i, f, g)
	}

	{
		fmt.Println()
		fmt.Println("- const")

		// 常量，一定要用 =，不能用 :=
		const World = "世界"
		fmt.Println("Hello", World)
		fmt.Println("Happy", Pi, "Day")

		const Truth = true
		fmt.Println("Go rules?", Truth)
	}
}

const Pi = 3.14
