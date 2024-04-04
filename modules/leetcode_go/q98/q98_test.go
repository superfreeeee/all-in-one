package q98

import (
	"fmt"
	"testing"
)

func Test(t *testing.T) {
	fmt.Println("> q98")
	fmt.Println(isValidBST(
		&TreeNode{
			Val: 5,
			Left: &TreeNode{
				Val:   3,
				Left:  &TreeNode{Val: 2},
				Right: &TreeNode{Val: 4},
			},
			Right: &TreeNode{
				Val:   7,
				Left:  &TreeNode{Val: 6},
				Right: &TreeNode{Val: 8},
			},
		}),
	)
}
