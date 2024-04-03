package q95

import "fmt"

type TreeNode struct {
	Val   int
	Left  *TreeNode
	Right *TreeNode
}

func (node *TreeNode) String() string {
	if node == nil {
		return "null"
	}
	return fmt.Sprintf("[%v, %v, %v]", node.Left.String(), node.Val, node.Right.String())
}

func generateTrees(n int) []*TreeNode {
	return walk(1, n)
}

func walk(i int, j int) []*TreeNode {
	if i > j {
		return []*TreeNode{nil}
	}
	res := []*TreeNode{}
	for mid := i; mid <= j; mid++ {
		Lefts, Rights := walk(i, mid-1), walk(mid+1, j)
		for _, left := range Lefts {
			for _, right := range Rights {
				res = append(res, &TreeNode{Val: mid, Left: left, Right: right})
			}
		}
	}
	return res
}

func Test() {
	fmt.Println("> q95")
	nodes := generateTrees(3)
	for _, node := range nodes {
		fmt.Printf("[%v]\n", node.String())
	}
}
