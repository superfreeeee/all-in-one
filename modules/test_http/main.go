package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/gorilla/mux"
)

type UserItem struct {
	Id   int    `json:"id"` // `json:"<key>"`
	Name string `json:"name"`
}

func main() {
	router := mux.NewRouter()

	// 1. 普通路由
	router.HandleFunc("/", Chain(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Hello, you've requested: %s\n", r.URL.Path)
	}, Logging()))

	// 2. 静态文件服务器
	// fs := http.FileServer(http.Dir("static/"))
	// http.Handle("/static/", http.StripPrefix("/static/", fs))
	fs := http.FileServer(http.Dir("static"))
	router.PathPrefix("/static/").Handler(http.StripPrefix("/static/", fs))

	// 3. 路径参数
	router.HandleFunc("/user/{userId}", Chain(GetUserById, Logging()))

	// 启动 server
	http.ListenAndServe(":8080", router)

	log.Printf("Server start %v.\n", "http://localhost:8080")
}

type Middleware func(http.HandlerFunc) http.HandlerFunc

// compose 函数
func Chain(handler http.HandlerFunc, middlewares ...Middleware) http.HandlerFunc {
	for _, middleware := range middlewares {
		handler = middleware(handler)
	}
	return handler
}

// 日志中间件
// Logging logs all requests with its path and the time it took to process
func Logging() Middleware {

	// Create a new Middleware
	return func(handler http.HandlerFunc) http.HandlerFunc {

		// wrap handler
		// Define the http.HandlerFunc
		return func(w http.ResponseWriter, r *http.Request) {

			// Do middleware things
			start := time.Now()
			defer func() { log.Println(r.URL.Path, time.Since(start)) }()

			// Call the next middleware/handler in chain
			handler(w, r)
		}
	}
}

func GetUserById(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userId, err := strconv.Atoi(vars["userId"])
	if err != nil {
		fmt.Fprintln(w, err)
		return
	}

	log.Println("userId:", userId)

	userFile, err := os.ReadFile("static/users.json")
	if err != nil {
		fmt.Fprintln(w, err)
		return
	}

	var userList []UserItem
	err = json.Unmarshal(userFile, &userList)
	if err != nil {
		fmt.Fprintln(w, err)
		return
	}

	log.Println("userList:", userList)

	var data *UserItem
	for _, user := range userList {
		if user.Id == userId {
			data = &user
			break
		}
	}

	if data == nil {
		fmt.Fprintf(w, "User id %v not found\n", userId)
		return
	}

	body, err := json.Marshal(data)
	if err != nil {
		fmt.Fprintln(w, err)
		return
	}

	fmt.Fprintf(w, string(body))
}
