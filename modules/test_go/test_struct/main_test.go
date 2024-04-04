package test_struct

import (
	"fmt"
	"math"
	"testing"
)

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
func TestStructAndPointer(t *testing.T) {
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

func TestStructMethod(t *testing.T) {
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

type Scalable interface {
	Scale(float64)
}

type ScalablePointer interface {
	ScalePointer(float64)
}

type Size struct {
	base float64
}

func (s *Size) Scale(x float64) {
	s.base *= x
}

/*
测试方法实现
值 方法 vs 指针 方法
*/
func TestInterfaceVertex(t *testing.T) {
	// 引用方法 => 无法改变原本的对象
	var scalable Scalable
	scalable = Vertex{3, 4}
	fmt.Println(scalable)
	scalable.Scale(10)
	fmt.Println(scalable)
}

func TestInterfaceSize(t *testing.T) {
	var scalable Scalable
	scalable = &Size{1.0}
	// val, ok := var.(type) 做类型转换
	if size, ok := scalable.(*Size); ok {
		fmt.Println("size =", size)
	} else {
		t.Fatal("convert failed")
	}
}

/*
不同实现混用
*/
func TestInterface2(t *testing.T) {
	// 指针方法 => 可以改变原对象
	// 赋值的时候就必须是指针类型
	var scalable ScalablePointer
	scalable = &Vertex{3, 4}
	fmt.Println(scalable)
	scalable.ScalePointer(10)
	fmt.Println(scalable)
}
