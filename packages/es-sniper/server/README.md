# EsSniperServer

## features

## TODO

- [ ] 解析作用域
  - [x] 解析作用域
    - [ ] ArrowFunctionExpression 处理：没有 block 的情况不会经过 BlockStatment => 增加无 body 情况的参数解析
  - [x] 提取变量信息
    - [x] 局部变量
    - [x] 参数变量
  - [ ] 测试用例
    - [ ] 全局：变量
    - [ ] 全局：函数
    - [ ] 全局：箭头函数
    - [ ] 局部：变量
    - [ ] 局部：函数参数
    - [ ] 局部：箭头函数函数
    - [ ] 局部：箭头函数（无 body）函数
- [ ] 解析函数复杂度
  - [ ] 变量消费统计：local、closure、global
  - [ ] 校验是否为纯函数
    - [ ] 区分 get / set 纯函数
- [ ] 作用域嵌套深度计算
  - [ ] 保留祖先作用域信息
