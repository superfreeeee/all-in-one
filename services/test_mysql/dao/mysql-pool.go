package dao

import (
	"database/sql"
	"fmt"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

func init() {
	initDb(CreateDbOptions{
		Username: "dev",
		Password: "123456789",
		DbName:   "test_go",
	})
}

type CreateDbOptions struct {
	Username string
	Password string
	DbName   string
}

var db *sql.DB

func initDb(options CreateDbOptions) {
	_db, err := sql.Open("mysql", fmt.Sprintf("%s:%s@/%s", options.Username, options.Password, options.DbName))
	if err != nil {
		panic(err.Error())
	}

	// _db.SetMaxOpenConns(10)
	// _db.SetMaxIdleConns(5)
	_db.SetConnMaxLifetime(time.Minute * 60)

	err = _db.Ping()
	if err != nil {
		panic(err.Error())
	}

	fmt.Println("Successfully connected to the database")

	db = _db
}

func GetDb() *sql.DB {
	return db
}
