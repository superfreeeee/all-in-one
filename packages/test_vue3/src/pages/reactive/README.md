# 响应式测试

## PrimitiveRef 原始值的响应式

- 结论
  - watch 目标: 单个 ref、ref 数组
  - watch getter: getter 会对 ref 响应，getter 返回值决定是否调用 callback

- best practice
  - watch 依赖 ref 变化直接 watch ref 对象或是 ref 数组
  - watch 依赖某个值的变化的时候使用 getter，getter 的作用相当于一个独立的 computed 对象，会对计算值进行缓存

## ObjectRef 深层对象的响应式

- 结论
  - watch ref 监听的是 value 的改变
  - watch reactive 监听的是对象属性的改变（深度响应式）
  - watch reactive 的时候，替换整个对象响应式会失效（因为指向了旧对象）
  - watch 使用 getter 的时候，同时访问到 value 跟深层 props 的 getter，可以同时实现 value 与 prop 改变的监听

- best practice
  - watch ref + reactive 对象的时候，可以尽可能使用 getter 访问到底，返回 `{}` 保证 callback 总是响应
  - 使用 computed 访问到具体的值，然后 watch 这个 computedRef
  - computed 如果返回的还是对象，还是会退化到 watch reactive 的模式

- 结论
  - 想要一次监听深层对象的所有属性响应 => 需要 watch reactive 对象，但是 reactive 对象整体替换时会失去响应式
  - 想要同时监听值与整个对象对象的引用改变 => 需要使用 getter 去访问指定属性，但是就没办法同时监听所有属性了

- best practice
  - 要同时监听深层属性 + 对象引用，需要在 watch 内重新监听新 reactive 对象
