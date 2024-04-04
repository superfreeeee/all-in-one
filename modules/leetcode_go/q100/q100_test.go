package q100

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func Test(t *testing.T) {
	assert.Equal(
		t,
		isSameTree(
			&TreeNode{
				Val:   5,
				Left:  &TreeNode{Val: 3},
				Right: &TreeNode{Val: 3},
			},
			&TreeNode{
				Val:   5,
				Left:  &TreeNode{Val: 3},
				Right: &TreeNode{Val: 3},
			},
		),
		true,
	)
	assert.Equal(
		t,
		isSameTree(
			&TreeNode{
				Val:   5,
				Left:  &TreeNode{Val: 3},
				Right: &TreeNode{Val: 3},
			},
			&TreeNode{
				Val:   1,
				Left:  &TreeNode{Val: 2},
				Right: &TreeNode{Val: 3},
			},
		),
		false,
	)
}
