package q110

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func Test(t *testing.T) {
	assert.Equal(
		t,
		isBalanced(
			&TreeNode{
				Left: &TreeNode{
					Left: &TreeNode{Val: 1},
					Val:  2,
					Right: &TreeNode{
						Left: &TreeNode{Val: 0},
						Val:  3,
					},
				},
				Val: 5,
			},
		),
		false,
	)
}
