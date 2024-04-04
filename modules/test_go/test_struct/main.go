package test_struct

import (
	"fmt"
	"math"
)

func TestStruct() {
	// fmt.Println("> TestStruct")
	// TestStructImpl()
	// TestInterfaceImpl()
}

type Vertex struct {
	X float64
	Y float64
}

func (v Vertex) Distance() float64 {
	return math.Sqrt(v.X*v.X + v.Y*v.Y)
}

func (v *Vertex) DistancePointer() float64 {
	return math.Sqrt(v.X*v.X + v.Y*v.Y)
}

func (v Vertex) Scale(x float64) {
	v.X *= x
	v.Y *= x
}

func (v *Vertex) ScalePointer(x float64) {
	v.X *= x
	v.Y *= x
}

/*
结构体 类型 方法实现
对象引用 vs 指针引用
*/
func TestStructImpl() {
	{
		fmt.Println("\n- TestStructImpl 1")
		// 栈对象
		v := Vertex{3, 4}
		fmt.Println(v)
		fmt.Println(v.Distance())
		fmt.Println(v.DistancePointer())

		// 引用对象
		p := &v
		fmt.Println(p)
		fmt.Println(p.Distance())
		fmt.Println(p.DistancePointer())
	}

	{
		fmt.Println("\n- TestStructImpl 2")

		// 对象引用 => 产生拷贝
		v := Vertex{5, 12}
		v.Scale(10)
		fmt.Println(v)

		// 使用指针 => 修改原对象
		v.ScalePointer(10)
		fmt.Println(v)

		// 指针类型，也一样，始终需要指针方法来比避免拷贝
		p := &v
		p.Scale(0.1)
		fmt.Println(p)

		p.ScalePointer(0.1)
		fmt.Println(p)
	}
}

type Scalable interface {
	Scale(float64)
}

type ScalablePointer interface {
	ScalePointer(float64)
}

/*
测试方法实现
值 方法 vs 指针 方法
*/
func TestInterfaceImpl() {
	{
		fmt.Println("\n- TestInterfaceImpl 1")
		// 引用方法 => 无法改变原本的对象
		var scalable Scalable
		scalable = Vertex{3, 4}
		scalable.Scale(10)
		fmt.Println(scalable)
	}

	{
		fmt.Println("\n- TestInterfaceImpl 2")
		// 指针方法 => 可以改变原对象
		// 赋值的时候就必须是指针类型
		var scalable ScalablePointer
		scalable = &Vertex{3, 4}
		scalable.ScalePointer(10)
		fmt.Println(scalable)
	}
}
