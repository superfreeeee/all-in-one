package main

import (
	"fmt"
	"sync"
	"time"

	"example.com/test_go/dao"
	_ "github.com/go-sql-driver/mysql"
)

func main() {
	db := dao.GetDb()
	defer db.Close()

	var wg sync.WaitGroup
	var mutex sync.Mutex
	for i := 0; i < 10; i++ {
		wg.Add(1)
		go (func(i int) {
			defer wg.Done()

			// 执行查询
			rows, err := db.Query("SELECT * FROM todo")
			if err != nil {
				panic(err.Error())
			}
			defer rows.Close()

			todoList := dao.ParseTodoList(rows)

			mutex.Lock()
			fmt.Printf("Query %d\n", i)
			fmt.Println(i, todoList)
			time.Sleep(time.Millisecond * 100)
			mutex.Unlock()
		})(i)
	}

	wg.Wait()

}
