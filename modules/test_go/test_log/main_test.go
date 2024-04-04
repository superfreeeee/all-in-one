package test_log

import (
	"log"
	"testing"
)

func Test(t *testing.T) {
	defer func() {
		recover()
	}()

	// 设置前缀
	log.SetPrefix("test log: ")
	// 模式，默认 3
	// 0001: 日期
	// 0010: 时间
	// 0100: 时间到微秒
	// 1000: 文件路径
	log.SetFlags(3)

	for i := 0; i < 10; i++ {
		if i == 5 {
			// Fatal 后会直接 os.Exit
			// log.Fatalln("failed")
		} else {
			log.Println("i =", i)
		}
	}
}
