package tutor

import (
	"fmt"
	"math"
	"strings"
)

// 引用类型
func DemoReference() {
	fmt.Println()
	fmt.Println("> DemoReference")

	DemoPointer()
	DemoStruct()
	DemoArray()
	DemoMap()
	DemoFuncVal()
}

/*
指针类型
*/
func DemoPointer() {
	fmt.Println()
	fmt.Println("- DemoPointer")

	{
		// 基础指针 => 保存内存地址
		i, j := 42, 2701

		p := &i                 // 指向 i
		fmt.Println("*p =", *p) // 通过指针读取 i 的值
		*p = 21                 // 通过指针设置 i 的值
		fmt.Println("i =", i)   // 查看 i 的值

		p = &j                // 指向 j
		*p = *p / 37          // 通过指针对 j 进行除法运算
		fmt.Println("j =", j) // 查看 j 的值
	}
}

type Vertex struct {
	X int
	Y int
}

/*
结构体
*/
func DemoStruct() {
	fmt.Println()
	fmt.Println("- DemoStruct")

	{
		// 普通结构体, 用 . 访问属性
		v := Vertex{1, 2}
		v.X = 4
		fmt.Println("v =", v)

		// 隐式指针访问
		p := &v
		p.Y = 10
		fmt.Println("p =", p)
	}

	{
		// 指定字段名，不依赖顺序
		var (
			v1 = Vertex{1, 2}  // 创建一个 Vertex 类型的结构体
			v2 = Vertex{X: 1}  // Y:0 被隐式地赋予
			v3 = Vertex{}      // X:0 Y:0
			p  = &Vertex{1, 2} // 创建一个 *Vertex 类型的结构体（指针）
		)

		fmt.Println("v1 =", v1)
		fmt.Println("v2 =", v2)
		fmt.Println("v3 =", v3)
		fmt.Println("p  =", p)
	}
}

/*
数组 / 切片
数组固定大小；切片为动态大小
*/
func DemoArray() {
	fmt.Println()
	fmt.Println("- DemoArray")

	{
		fmt.Println()
		fmt.Println("- array")

		// 普通数组
		var a [2]string
		a[0] = "Hello"
		a[1] = "World"
		fmt.Println(a[0], a[1])
		fmt.Println(a)

		// 初始化列表
		primes := [6]int{2, 3, 5, 7, 11, 13}
		fmt.Println("primes =", primes)
		primes = [6]int{2, 3, 5, 7}
		fmt.Println("primes =", primes)
	}

	{
		fmt.Println()
		fmt.Println("- slice")

		primes := [6]int{2, 3, 5, 7, 11, 13}

		// 切片 => 动态大小
		var s []int = primes[1:4]
		fmt.Println("s =", s)
	}

	{
		fmt.Println()
		fmt.Println("- slice reference")

		// 切片 => 对于数组空间的引用

		// 原始数组
		names := [4]string{
			"John",
			"Paul",
			"George",
			"Ringo",
		}
		fmt.Println("names =", names)

		a := names[0:2]
		b := names[1:3]
		fmt.Println("a, b =", a, b)

		b[0] = "XXX"
		fmt.Println("a, b =", a, b)
		fmt.Println("names =", names)
	}

	{
		// 切片文法 => 无长度数组
		// 创建数组后，返回切片引用
		fmt.Println()
		fmt.Println("- slice constructor")

		q := []int{2, 3, 5, 7, 11, 13}
		fmt.Println(q)

		r := []bool{true, false, true, true, false, true}
		fmt.Println(r)

		s := []struct {
			i int
			b bool
		}{
			{2, true},
			{3, false},
			{5, true},
			{7, true},
			{11, false},
			{13, true},
		}
		fmt.Println(s)
	}

	{
		// 默认上下界
		fmt.Println()
		fmt.Println("- slice range")

		s := []int{2, 3, 5, 7, 11, 13}

		s = s[1:4]
		fmt.Println(s)

		s = s[:2]
		fmt.Println(s)

		s = s[1:]
		fmt.Println(s)
	}

	{
		// 切片容量
		fmt.Println()
		fmt.Println("- slice len & capacity")

		s := []int{2, 3, 5, 7, 11, 13}
		printSlice(s)

		// 截取切片使其长度为 0
		s = s[:0]
		printSlice(s)

		// 拓展其长度
		s = s[:4]
		printSlice(s)

		// 舍弃前两个值
		s = s[2:]
		printSlice(s)
	}

	{
		// 切片空值
		fmt.Println()
		fmt.Println("- slice empty val")

		var s []int
		fmt.Println(s, len(s), cap(s))
		if s == nil {
			fmt.Println("nil!")
		}
	}

	{
		// 创建切片
		fmt.Println()
		fmt.Println("- slice make")

		a := make([]int, 5)
		printSlice2("a", a)

		b := make([]int, 0, 5)
		printSlice2("b", b)
		fmt.Println("b is nil =", b == nil)

		// 对 b 重新切片，总是从底层数组切
		x := b[0:5]
		for i := 0; i < 5; i++ {
			x[i] = i
		}
		printSlice2("x", x)

		c := b[:2]
		printSlice2("c", c)

		d := c[2:5]
		printSlice2("d", d)
	}

	{
		// 二维切片(二维数组)
		fmt.Println()
		fmt.Println("- slice nested")

		// 创建一个井字板（经典游戏）
		board := [][]string{
			{"_", "_", "_"},
			{"_", "_", "_"},
			{"_", "_", "_"},
		}

		// 两个玩家轮流打上 X 和 O
		board[0][0] = "X"
		board[2][2] = "O"
		board[1][2] = "X"
		board[1][0] = "O"
		board[0][2] = "X"

		for i := 0; i < len(board); i++ {
			fmt.Printf("%s\n", strings.Join(board[i], " "))
		}
	}

	{
		// 追加元素
		fmt.Println()
		fmt.Println("- slice append")

		var s []int
		printSlice(s)
		fmt.Println("s is nil =", s == nil)

		// 添加一个空切片
		s = append(s, 0)
		printSlice(s)

		// 这个切片会按需增长
		s = append(s, 1)
		printSlice(s)

		// 可以一次性添加多个元素
		s = append(s, 2, 3, 4)
		printSlice(s)
	}

	{
		// 遍历切片
		fmt.Println()
		fmt.Println("- slice traverse")

		var pow = []int{1, 2, 4, 8, 16, 32, 64, 128}

		for i, v := range pow {
			fmt.Printf("2**%d = %d\n", i, v)
		}
	}
}

// len 为切片大小
// cap 为底层数组大小
func printSlice(s []int) {
	fmt.Printf("len=%d cap=%d %v\n", len(s), cap(s), s)
}

func printSlice2(s string, x []int) {
	fmt.Printf("%s len=%d cap=%d %v\n", s, len(x), cap(x), x)
}

/*
映射类型
*/
func DemoMap() {
	fmt.Println()
	fmt.Println("- DemoMap")

	type Vertex struct {
		Lat, Long float64
	}

	var m map[string]Vertex

	{
		// 普通 map
		fmt.Println()
		fmt.Println("- map")

		m = make(map[string]Vertex)
		m["Bell Labs"] = Vertex{40.68433, -74.39967}
		fmt.Println("m[\"Bell Labs\"] =", m["Bell Labs"])
		fmt.Println("m =", m)
		val, ok := m["Bell Labs2"]
		fmt.Println("val, ok =", val, ok)

		var m = map[string]Vertex{
			"Bell Labs": {40.68433, -74.39967},
			"Google":    {37.42202, -122.08408},
		}
		fmt.Println("m =", m)
	}

	{
		// map 操作
		fmt.Println()
		fmt.Println("- map CRUD")

		m := make(map[string]int)

		// 插入元素
		m["Answer"] = 42
		fmt.Println("The value:", m["Answer"])

		// 修改元素
		m["Answer"] = 48
		fmt.Println("The value:", m["Answer"])

		// 删除元素
		delete(m, "Answer")
		fmt.Println("The value:", m["Answer"])

		// 获取元素
		v, ok := m["Answer"]
		fmt.Println("The value:", v, "Present?", ok)
	}

	{
		// WordCount 操作
		fmt.Println()
		fmt.Println("- map practice: WordCount")

		fmt.Println(WordCount("I am learning Go!"))
		fmt.Println(WordCount("The quick brown fox jumped over the lazy dog."))
		fmt.Println(WordCount("I ate a donut. Then I ate another donut."))
	}
}

func WordCount(s string) map[string]int {
	wordCount := make(map[string]int)
	words := strings.Fields(s)
	for _, word := range words {
		if count, ok := wordCount[word]; ok {
			wordCount[word] = count + 1
		} else {
			wordCount[word] = 1
		}
	}
	return wordCount
}

/*
函数作为值
*/
func DemoFuncVal() {
	fmt.Println()
	fmt.Println("- DemoFuncVal")

	{
		// 函数作为参数传递
		fmt.Println()
		fmt.Println("- func as parameters")

		hypot := func(x, y float64) float64 {
			return math.Sqrt(x*x + y*y)
		}
		// 求毕氏定理斜边
		fmt.Println("hypot(5, 12)      =", hypot(5, 12))

		// 3, 4 斜边
		fmt.Println("compute(hypot)    =", compute(hypot))
		// 3 ** 4
		fmt.Println("compute(math.Pow) =", compute(math.Pow))
	}

	{
		// 闭包
		fmt.Println()
		fmt.Println("- func closure")

		// 两个闭包各自累加
		pos, neg := adder(), adder()
		for i := 0; i < 10; i++ {
			fmt.Println(
				pos(i),
				neg(-2*i),
			)
		}
	}
}

func compute(fn func(float64, float64) float64) float64 {
	return fn(3, 4)
}

func adder() func(int) int {
	sum := 0
	return func(x int) int {
		sum += x
		return sum
	}
}
