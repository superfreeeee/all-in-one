package test_fuzz

import (
	"math"
	"testing"

	"github.com/stretchr/testify/assert"
)

/*
模糊测试
*/
func FuzzTest(f *testing.F) {
	/*
		可以通过 Add 主动扩展 baseline
		并作为普通测试用例存在
	*/
	cases := []int{1, 3, 5, 7, -2, -4, -6, -8, -3001}
	for _, val := range cases {
		f.Add(val)
	}

	/*
		测试时增加 -fuzz=Fuzz
		会自动生成用例

		失败用例会自动写入 testdata 目录，作为下次测试的 baseline
	*/
	f.Fuzz(func(t *testing.T, num int) {
		assert.Equal(t, abs(num), int(math.Abs(float64(num))))
	})
}

func abs(x int) int {
	if x < 0 {
		return -x
	}
	return x
}
