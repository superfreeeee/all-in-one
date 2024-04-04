package q110

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func isBalanced(root *TreeNode) bool {
	return getHeight(root) != -1
}

func getHeight(root *TreeNode) int {
	if root == nil {
		return 0
	}
	left := getHeight(root.Left)
	if left == -1 {
		return -1
	}
	right := getHeight(root.Right)
	if right == -1 {
		return -1
	}
	if abs(left-right) <= 1 {
		return max(left, right) + 1
	}
	return -1
}

func abs(v int) int {
	if v < 0 {
		return -v
	}
	return v
}

func max(v1, v2 int) int {
	if v1 < v2 {
		return v2
	}
	return v1
}
