package q104

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func maxDepth(root *TreeNode) int {
	if root == nil {
		return 0
	}
	return maxInt(maxDepth(root.Left), maxDepth(root.Right)) + 1
}

func maxInt(num1, num2 int) int {
	if num1 <= num2 {
		return num2
	}
	return num1
}
