# Golang 测试

## 内存分配测试

- 分析对象分配在栈上还是堆上

```sh
go build -gcflags="-m" test_alloc/main.go
```

## 包引用

- lib 包需要在根目录写一个 `lib.go` 或类似的，指定同名 package

```go
// test_lib/lib.go
package test_lib

func Hello() {}
```

- 当前包需要执行以下命令进行关联

```sh
# 本地 lib 路径关联
go mod edit -replace example.com/test_lib=../test_lib
# 安装版本
go mod tidy
```
