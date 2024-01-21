# Vue 2 学习指南

https://v2.cn.vuejs.org/v2/guide/index.html

- 主要学习内容
- 带 `!` 为使用重点关注
- 带 `~` 为可选学习能力

## 1. 数据绑定

- `v-bind` 绑定属性
- `v-on` 绑定事件
- ! 浅层 data（primitive） 跟深层 reactive 对象的区分

## 2. 计算属性 & 监听属性

- `computed` 自动依赖收集
- `watch` 监听响应式目标属性

## 3. 条件渲染

- `v-if, v-else-if, v-else`
- `v-show`

## 4. 列表渲染

- `v-for`
- `for-in / for-of` 写法参数
- 遍历 array: `(value, index) in array`
- 遍历 object: `(value, key, index) in array`
- ! key 的选用

## 5. 事件处理

- `v-on:xxx / @xxx` 绑定事件
- `vm.$emit` 触发自定义事件

## 6. 表单绑定

- `v-model` 绑定规则
- 基础控件类型
  - `input`
  - `textarea`
  - `checkbox`
  - `radio`
  - `select`
- ~ 自定义组件 v-model 使用 `model` option
  - 写法参考 `CustomComponentModel.vue` 组件

## 7. 组件基础

- `props` 绑定、定义、类型约束
- ~ 非定义 `props` 继承逻辑

### 7.1 组件生命周期

- ! 注意各阶段差异，主要体现在状态更新时机、dom 挂载时机、dom 更新时机

### 7.2 组件懒加载

- ! 代码切割边界 & 注册顺序 & 加载阶段（load、mount）区分非常重要
  - 参考 `component-lazy.vue` 组件

# Vue 3 学习指南（增量）

以 vue2 为基础（部分 React 基础），仅补充差异点

## 1. 响应式基础

- ref、reactive 差异
- ! 响应式原理（深层监听）

### 1.1 计算属性

- computed 响应式源：计算过程需要经过 getter 才能够追踪

### 1.2 侦听器

- watch 监听目标：ref 对象、getter 方法、reactive 对象引用
- watchEffect 收集是否正确

## 2. 定制属性

- class / style 属性特殊内置逻辑（内置 clsx 实现）

## 3. 条件渲染

- `template` 标签为 `React.Fragement` 等价品
- ! `v-for`、`v-if` 优先级问题

## 4. 列表渲染

- `v-for` 用法与 vue2 一样

## 5. 模版引用

- 给定 ref 对象，可以对标 `React.useRef`
- 接受 callback ref，一样对标 React callback ref
- ref 自定义组件，指向 vm 实例

## 6. 组件基础

### 6.1 生命周期

- 与 vue2 一样
- 注意钩子名称与生命周期对应
- ! 新增 setup 阶段

### 6.2 参数传递

- `defineProps` 获取 props
- `withDefaults` 给定默认值
- `toRefs` 转换成组件内部状态（产生响应式链）

### 6.3 自定义事件

- `defineEmits` 定义 emit
- 使用类型约束事件
- 使用 options 配置校验规则

### 6.4 自定义 v-model

- `defineModel` 定义内部 data
- ~ v-model:xxx 可以同时绑定多个

### ~ 6.5 组件属性

- ~ `defineOptions` 获取非 props 定义的继承属性

### 6.6 插槽

- `useSlots` 获取插槽

### 6.7 动态组件

- 懒加载
- ! setup 阶段与 load 阶段区分
- ! 可以使用 defineComponent 区分

## 7. 依赖注入

- 类似 React Context API
- setup 使用 `provide / inject` 方法
- options 使用 `provide / inject` 配置

## 8. 自定义指令

- `v-xxx` 自定义指令，指令对于 dom 元素各生命周期
