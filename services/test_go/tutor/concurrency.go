package tutor

import (
	"fmt"
	"sync"
	"time"
)

func DemoConcurrency() {
	fmt.Println("> DemoConcurrency")
	// 1
	// TestGoRoutine()
	// 2
	// TestChannelRecv()
	// 3
	// TestBufferedChannel()
	// 4
	// TestRangeChannel()
	// 5
	// TestSelectChannel()
	// 6
	// TestSyncMutex()
}

/*
1. 普通 go routine
*/
func TestGoRoutine() {
	go say("world")
	say("hello")
}

func say(s string) {
	for i := 0; i < 5; i++ {
		time.Sleep(100 * time.Millisecond)
		fmt.Println(s)
	}
}

/*
2. 管道作为接收器
*/
func TestChannelRecv() {
	s := []int{7, 2, 8, -9, 4, 0}

	c := make(chan int)
	// 加法并发
	go sum(s[:len(s)/2], c)
	go sum(s[len(s)/2:], c)
	x, y := <-c, <-c // receive from c

	fmt.Println(x, y, x+y)
}

func sum(s []int, c chan int) {
	sum := 0
	for _, v := range s {
		sum += v
	}
	c <- sum // send sum to c
}

/*
3. 带缓冲管道
*/
func TestBufferedChannel() {
	ch := make(chan int, 2)
	ch <- 1
	fmt.Println(<-ch)

	go (func() {
		time.Sleep(time.Second)
		ch <- 2
	})()

	fmt.Println(<-ch)
}

/*
4. 使用 range 展开；使用 close 结束通道
*/
func TestRangeChannel() {
	fmt.Println("- TestRangeChannel")
	c := make(chan int, 10)
	go fibonacci(cap(c), c)
	for i := range c {
		fmt.Println(i)
	}

	v, ok := <-c
	fmt.Printf("v = %v, ok = %v\n", v, ok)
}

func fibonacci(n int, c chan int) {
	x, y := 1, 1
	for i := 0; i < n; i++ {
		c <- x
		x, y = y, x+y
	}
	// 结束通道
	close(c)
}

/*
5. select 多 routine 并发
*/
func TestSelectChannel() {
	{
		// select 会选择第一个可用事件
		c := make(chan int)
		quit := make(chan int)
		go func() {
			for i := 0; i < 10; i++ {
				fmt.Println(<-c)
			}
			quit <- 0
		}()
		fibonacciSelect(c, quit)
	}

	{
		// default 在都不可选的时候触发
		tick := time.Tick(100 * time.Millisecond)
		boom := time.After(500 * time.Millisecond)
		for {
			select {
			// 每 100ms 触发一次
			case <-tick:
				fmt.Println("tick.")
			// 500ms 后触发
			case <-boom:
				fmt.Println("BOOM!")
				return
			default:
				fmt.Println("    .")
				// 每次触发一次休息 50ms
				time.Sleep(50 * time.Millisecond)
			}
		}
	}
}

func fibonacciSelect(c, quit chan int) {
	x, y := 0, 1
	for {
		select {
		case c <- x:
			x, y = y, x+y
		case <-quit:
			fmt.Println("quit")
			return
		}
	}
}

type SafeCounter struct {
	mu     sync.Mutex
	values map[string]int
}

func (c *SafeCounter) Inc(key string) {
	c.mu.Lock()
	c.values[key] += 1
	c.mu.Unlock()
}

func (c *SafeCounter) Value(key string) int {
	c.mu.Lock()
	defer c.mu.Unlock()
	return c.values[key]
}

/*
6. 并发锁
*/
func TestSyncMutex() {
	c := SafeCounter{values: make(map[string]int)}
	for i := 0; i < 1000; i++ {
		go c.Inc("somekey")
	}
	fmt.Println(c.Value("somekey"))
	time.Sleep(100 * time.Millisecond)
	fmt.Println(c.Value("somekey"))
}
