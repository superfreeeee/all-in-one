package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	// Get 方法 demo
	router.GET("/ping", ping)

	// 路径参数匹配
	router.GET("/param/:id", handleParamId)

	// POST 方法 demo
	router.POST("/post", post)

	// 静态资源
	// 访问 http://localhost:8999/assets/demo.json
	router.Static("/assets", "./assets")

	// 加载 HTML 模版
	router.LoadHTMLGlob("templates/*")
	// 访问 http://localhost:8999/html/index
	router.GET("/html/index", htmlIndex)

	// 模拟长时间任务
	router.GET("/long-sync", longSync)
	router.GET("/long-async", longAsync)

	// 重定向
	// 访问 http://localhost:8999/redirect
	router.GET("/redirect", redirect)

	// createServer(router)
	// 默认监听 0.0.0.0:8080 上启动服务
	// makefile 内指定环境变量 PORT 为 8999
	router.Run()
}

/*
Get 方法 demo
*/
func ping(c *gin.Context) {
	c.JSON(200, gin.H{"message": "pong"})
}

/*
匹配路径参数
*/
func handleParamId(c *gin.Context) {
	id := c.Param("id")

	c.JSON(200, gin.H{"id": id})
}

/*
POST 方法 demo
c.Query 获取查询参数
c.PostForm 查询 body
*/
func post(c *gin.Context) {
	/*
		获取完整 query 对象 => map[string]string
	*/
	query := GetQueryParams(c)
	for k, v := range query {
		fmt.Printf("key=%s, value=%s\n", k, v)
	}

	id := c.Query("id")
	page := c.DefaultQuery("page", "0")
	name := c.PostForm("name")
	message := c.PostForm("message")

	fmt.Printf("id: %s; page: %s; name: %s; message: %s\n", id, page, name, message)

	// res := fmt.Sprintf("id: %s; page: %s; name: %s; message: %s", id, page, name, message)
	c.JSON(200, gin.H{
		"id":      id,
		"page":    page,
		"name":    name,
		"message": message,
	})
}

func GetQueryParams(c *gin.Context) map[string]string {
	/*
		获取完整 query 对象
	*/
	query := c.Request.URL.Query()
	var queryMap = make(map[string]string, len(query))
	for k := range query {
		queryMap[k] = c.Query(k)
	}
	return queryMap
}

/*
返回基于 templates/index.html 模版
*/
func htmlIndex(c *gin.Context) {
	c.HTML(http.StatusOK, "index.html", gin.H{
		"title":  "Main website",
		"header": "Main Content",
	})
}

/*
长时间任务（同步）
*/
func longSync(c *gin.Context) {
	time.Sleep(3 * time.Second)

	log.Println("Done! in path " + c.Request.URL.Path)
}

/*
长时间任务（异步）
*/
func longAsync(c *gin.Context) {
	c = c.Copy()

	/*
		启动一个 goroutine 负责长时间任务
	*/
	go func() {
		time.Sleep(3 * time.Second)

		log.Println("Done! in path " + c.Request.URL.Path)
	}()
}

func createServer(router *gin.Engine) {
	server := &http.Server{
		Addr:    ":" + os.Getenv("PORT"),
		Handler: router,
	}

	go func() {
		err := server.ListenAndServe()
		// 服务连接
		if err != nil && err != http.ErrServerClosed {
			fmt.Println("Server started!")
			log.Fatalf("listen: %s\n", err)
		}
	}()

	// 等待中断信号以优雅地关闭服务器（设置 5 秒的超时时间）
	quit := make(chan os.Signal)
	signal.Notify(quit, os.Interrupt)
	<-quit
	log.Println("Shutdown Server ...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := server.Shutdown(ctx); err != nil {
		log.Fatal("Server Shutdown:", err)
	}
	log.Println("Server exiting")
}

/*
重定向到 google
*/
func redirect(c *gin.Context) {
	// 307 / 308 重定向状态码
	c.Redirect(http.StatusTemporaryRedirect, "http://www.google.com/")
	// c.Redirect(http.StatusPermanentRedirect, "http://www.google.com/")
}
