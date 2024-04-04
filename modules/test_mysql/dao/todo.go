package dao

import (
	"database/sql"
	"log"
	"time"
)

type TodoItem struct {
	Id          int
	Title       string
	Description string
	CreateTime  time.Time
	UpdateTime  time.Time
}

func ParseTodoList(rows *sql.Rows) []TodoItem {
	var todoList []TodoItem

	// 处理结果
	for rows.Next() {
		var item TodoItem
		var create_time_raw []uint8
		var update_time_raw []uint8

		err := rows.Scan(&item.Id, &item.Title, &item.Description, &create_time_raw, &update_time_raw)
		if err != nil {
			panic(err.Error())
		}

		create_time, err := time.Parse("2006-01-02 15:04:05", string(create_time_raw))
		if err != nil {
			log.Fatal(err)
			continue
		}
		item.CreateTime = create_time
		update_time, err := time.Parse("2006-01-02 15:04:05", string(update_time_raw))
		if err != nil {
			log.Fatal(err)
			continue
		}
		item.UpdateTime = update_time

		todoList = append(todoList, item)
	}

	return todoList
}
