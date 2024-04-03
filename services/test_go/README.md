# Golang 测试

## 内存分配测试

- 分析对象分配在栈上还是堆上

```sh
go build -gcflags="-m" test_alloc/main.go
```
