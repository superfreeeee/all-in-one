package q95

import (
	"fmt"
	"testing"
)

func Test(t *testing.T) {
	fmt.Println("> q95")
	nodes := generateTrees(3)
	for _, node := range nodes {
		fmt.Printf("[%v]\n", node.String())
	}
}
