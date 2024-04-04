# Golang libs

Home Page: any

| Package Name ; repository / homepage                                         | Category                    | Usage               | Use Level  | Tags |
| ---------------------------------------------------------------------------- | --------------------------- | ------------------- | ---------- | ---- |
| gin       <br/> https://gin-gonic.com/, https://github.com/gin-gonic/gin     | Web framework(be-framework) |                     | production |      |
| beego     <br/> https://beego.wiki/, https://github.com/beego/beego          | Web framework               |                     | production |      |
| echo      <br/> https://echo.labstack.com/, https://github.com/labstack/echo | Web framework               |                     | production |      |
| fiber     <br/> https://docs.gofiber.io/, https://github.com/gofiber/fiber   | Web framework               |                     | production |      |
| iris      <br/> https://www.iris-go.com/, https://github.com/kataras/iris    | Web framework               |                     | production |      |
| revel     <br/> https://revel.github.io/, https://github.com/revel/revel     | Web framework               |                     | production |      |
| buffalo   <br/> https://gobuffalo.io/, https://github.com/gobuffalo/buffalo  | Web framework               |                     | production |      |
|                                                                              |                             |                     |            |      |
| -         <br/>                                                              |                             |                     | production |      |
|                                                                              |                             |                     |            |      |
| gorilla   <br/> github.com/gorilla/mux                                       | Web library                 | HTTP server Routing | production |      |
| mysql     <br/> github.com/go-sql-driver/mysql                               |                             | MySQL driver        | production |      |
|                                                                              |                             |                     |            |      |

## Comment

- gin, echo, fiber, iris, buffalo 皆使用类似 express 风格，handler 参数使用 context

```ts
const app = express()

app.get(path, (req, res) => {
  // handler
})
```

- beego, revel 使用 controller MVC 架构
