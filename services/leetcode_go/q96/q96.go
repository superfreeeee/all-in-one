package q96

func numTrees(n int) int {
	mem := make(map[int]int)
	return walk(n, &mem)
}

func walk(n int, mem *map[int]int) int {
	if n <= 0 {
		return 1
	}
	if val, ok := (*mem)[n]; ok {
		return val
	}
	res := 0
	for i := 1; i <= n; i++ {
		res += walk(i-1, mem) * walk(n-i, mem)
	}
	(*mem)[n] = res
	return res
}
