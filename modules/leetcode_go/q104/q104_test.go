package q104

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func Test(t *testing.T) {
	assert.Equal(
		t,
		maxDepth(
			&TreeNode{
				Left: &TreeNode{
					Left: &TreeNode{Val: 1},
					Val:  2,
					Right: &TreeNode{
						Val:   3,
						Right: &TreeNode{Val: 0},
					},
				},
				Val: 5,
			},
		),
		4,
	)
}
