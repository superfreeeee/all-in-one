package q98

import "math"

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func isValidBST(root *TreeNode) bool {
	ch := make(chan int)
	go (func() {
		defer close(ch)
		walkInorder(root, ch)
	})()
	cur := math.MinInt
	for val := range ch {
		if val <= cur {
			return false
		}
		cur = val
	}
	return true
}

func walkInorder(node *TreeNode, ch chan int) {
	if node != nil {
		walkInorder(node.Left, ch)
		// fmt.Println("walkInorder", node.Val)
		ch <- node.Val
		walkInorder(node.Right, ch)
	}
}
