package tutor

import (
	"fmt"
	"math"
)

type Vertex2 struct {
	X, Y float64
}

func (v *Vertex2) Abs() float64 {
	return math.Sqrt(v.X*v.X + v.Y*v.Y)
}

// 指针可改变原对象；值改变副本 => 存在拷贝赋值
func (v *Vertex2) Scale(f float64) {
	v.X = v.X * f
	v.Y = v.Y * f
}

// 同包内，自定义类型 定义方法
type MyFloat float64

func (f MyFloat) Abs() float64 {
	if f < 0 {
		return float64(-f)
	}
	return float64(f)
}

/*
OOP 编程
*/
func DemoOOP() {
	fmt.Println()
	fmt.Println("> DemoOOP")

	DemoMethods()
	DemoInterface()
}

/*
结构体方法
*/
func DemoMethods() {
	fmt.Println()
	fmt.Println("- DemoMethods")

	{
		// 结构体方法
		v := Vertex2{3, 4}
		fmt.Println("v.Abs() =", v.Abs())
	}

	{
		// 自定义类型方法
		f := MyFloat(-math.Sqrt2)
		fmt.Println("f.Abs() =", f.Abs())
	}

	{
		v := Vertex2{3, 4}
		v.Scale(10)
		fmt.Println("v.Abs() =", v.Abs())
	}
}

type Abser interface {
	Abs() float64
}

/*
接口
*/
func DemoInterface() {
	fmt.Println()
	fmt.Println("- DemoInterface")

	{
		var a Abser
		f := MyFloat(-math.Sqrt2)
		v := Vertex2{3, 4}

		a = f  // a MyFloat 实现了 Abser
		a = &v // a *Vertex 实现了 Abser

		// 下面一行，v 是一个 Vertex（而不是 *Vertex）
		// 所以没有实现 Abser。
		// a = v

		fmt.Println(a.Abs())
	}
}

type IPAddr [4]byte

// TODO: 给 IPAddr 添加一个 "String() string" 方法
func (addr IPAddr) String() string {
	return fmt.Sprintf("%v.%v.%v.%v", addr[0], addr[1], addr[2], addr[3])
}
