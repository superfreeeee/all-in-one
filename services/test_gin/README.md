# test_gin

## gin

https://gin-gonic.com/zh-cn/docs/quickstart/

## 测试

先启动 gin 服务

```sh
go run .

# 或是用 Makefile 里面写好的
make run
```

使用 curl 发起 http 请求，测试用例写在 Makefile 里面

```sh
# GET 测试
make ping

# POST 测试
make post
```
