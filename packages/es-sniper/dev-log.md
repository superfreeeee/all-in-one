# Features

# TODO

## core features

- ~~[x] 解析作用域~~ => 直接基于 @babel/traverse 解析即可
  - [x] 解析作用域
    - [x] ArrowFunctionExpression 处理：没有 block 的情况不会经过 BlockStatment => 增加无 body 情况的参数解析
  - [x] 提取变量信息
    - [x] 局部变量
    - [x] 参数变量
    - [x] import 变量
  - [x] 测试用例：只生成 TS 的（TS 节点应该能覆盖 JS）
    - [x] 全局：变量 `global-var.ts`
    - [x] 全局：函数 `global-func.ts`
    - [x] 全局：箭头函数 `global-func-arrow.ts`
    - [x] 全局：箭头函数（无 body） `global-func-arrow-no-body.ts`
    - [x] 全局：import 变量 `global-var-import.ts`
    - [x] 局部：变量 `local-var.ts`
    - [x] 局部：函数参数 `local-param-func.ts`
    - [x] 局部：箭头函数函数 `local-param-func-arrow.ts`
    - [x] 局部：箭头函数（无 body）函数 `local-param-func-arrow-no-body.ts`
    - [x] 局部：复杂函数参数解构 `local-param-func-complex.ts`
    - [x] 局部：普通 for 循环定义 `local-var-for.ts`
    - [x] 局部：for-x 循环定义 `local-var-for-x.ts`

- [ ] 解析函数复杂度
  - [ ] 变量消费统计：local、closure、import、global
    - [ ] 区分 import, global
    - [ ] 考虑是否合并作用域 + 函数分析
  - ~~[ ] 校验是否为纯函数~~ => 代码结构上 LVal 较难分析是否修改
    - ~~[ ] 区分 get / set 纯函数~~

- [ ] 作用域嵌套深度计算
  - [ ] 保留祖先作用域信息

## UX

- [ ] 异常处理
  - [ ] AST 解析失败？
- [ ] 输出信息持续优化

## build

- [ ] watch 集成到 .vscode prelaunch 任务
- [ ] client 改用 vite 进行编译
- [ ] 打包 vsix 时 server 问题解决
