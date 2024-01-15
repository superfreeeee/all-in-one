<template>
  <div id="app">
    <img
      alt="Vue logo"
      src="./assets/logo.png"
    />
    <HelloWorld msg="Welcome to Your Vue.js App" />

    <!-- 数据绑定 -->
    <!-- <DemoDataBinding /> -->
    <demo-data-binding />

    <!-- 计算属性 / 监听属性 -->
    <!-- 感觉用大驼峰辨识度更高 -->
    <DemoComputedWatch />

    <!-- 条件渲染 -->
    <DemoConditionalRender />

    <!-- 列表渲染 -->
    <DemoListRender />

    <!-- 事件处理 -->
    <DemoEventHandler />

    <!-- 表单绑定 -->
    <DemoFormBinding />

    <!-- 组件基础: props -->
    <DemoComponentProps />

    <!-- 组件懒加载 -->
    <DemoComponentLazy />

    <DemoComponentLifecycle />

    <!-- 边缘场景 -->
    <EdgeCase />
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue';
import DemoDataBinding from './demos/data-binding.vue';
import DemoConditionalRender from './demos/conditional-render.vue';
import DemoComputedWatch from './demos/computed-watch.vue';
import DemoListRender from './demos/list-render.vue';
import DemoEventHandler from './demos/event-handler.vue';
import DemoFormBinding from './demos/form-binding.vue';
import DemoComponentProps from './demos/component-props.vue';
import DemoComponentLazy from './demos/component-lazy.vue';
import DemoComponentLifecycle from './demos/component-lifecycle.vue';
import EdgeCase from './demos/edge-case.vue';

export default {
  name: 'App',
  components: {
    HelloWorld,
    DemoDataBinding,
    DemoConditionalRender,
    DemoComputedWatch,
    DemoListRender,
    DemoEventHandler,
    DemoFormBinding,
    DemoComponentProps,
    DemoComponentLazy,
    DemoComponentLifecycle,
    EdgeCase,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

/* demo block */
.demo {
  background-color: rgba(174, 174, 174, 0.24);
  padding: 16px 0;
  border-radius: 8px;
}

.demo > h1,
.demo > h2,
.demo > h3 {
  margin: 0;
}

.demo + .demo {
  margin-top: 12px;
}

.block {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
