package q101

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func isSymmetric(root *TreeNode) bool {
	return check(root.Left, root.Right)
}

func check(n1, n2 *TreeNode) bool {
	if n1 == nil && n2 == nil {
		return true
	}
	if n1 == nil || n2 == nil {
		return false
	}
	return n1.Val == n2.Val &&
		check(n1.Left, n2.Right) &&
		check(n1.Right, n2.Left)
}
