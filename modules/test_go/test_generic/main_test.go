package test_generic

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func Test(t *testing.T) {
	assert.Equal(t, max(1, 2), 2)
	assert.Equal(t, max(1.0, 2.0), 2.0)

	assert.Equal(t, abs(1), 1)
	assert.Equal(t, abs(-1), 1)
	assert.Equal(t, abs(1.0), 1.0)
	assert.Equal(t, abs(-1.0), 1.0)
}

// 泛型定义
// [T type]
func max[V int | float64](v1, v2 V) V {
	if v1 < v2 {
		return v2
	}
	return v1
}

// 联合类型必须使用 interface
type Number interface {
	int | float64
}

// 在编译期间确定实现方法
func abs[V Number](v V) V {
	if v < 0 {
		return -v
	}
	return v
}
