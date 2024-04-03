package q101

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func Test(t *testing.T) {
	assert.Equal(
		t,
		isSymmetric(
			&TreeNode{
				Left: &TreeNode{
					Left:  &TreeNode{Val: 1},
					Val:   2,
					Right: &TreeNode{Val: 3},
				},
				Val: 5,
				Right: &TreeNode{
					Left:  &TreeNode{Val: 3},
					Val:   2,
					Right: &TreeNode{Val: 1},
				},
			},
		),
		true,
	)
	assert.Equal(
		t,
		isSymmetric(
			&TreeNode{
				Left: &TreeNode{
					Left:  &TreeNode{Val: 1},
					Val:   2,
					Right: &TreeNode{Val: 3},
				},
				Val: 5,
				Right: &TreeNode{
					Left:  &TreeNode{Val: 1},
					Val:   2,
					Right: &TreeNode{Val: 3},
				},
			},
		),
		false,
	)
}
