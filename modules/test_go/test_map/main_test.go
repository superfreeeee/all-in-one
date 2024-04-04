package test_panic

import (
	"log"
	"testing"
)

func Test(t *testing.T) {
	m := map[int]string{
		1: "test-1",
		2: "test-2",
		3: "test-3",
	}
	log.Println(m)
	for key, val := range m {
		log.Printf("key=%v, val=%v\n", key, val)
	}
}
