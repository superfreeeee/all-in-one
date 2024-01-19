<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue';
import TheWelcome from './components/TheWelcome.vue';
import ComponentBasic from './demos/ComponentBasic.vue';
import ComputedAttr from './demos/ComputedAttr.vue';
import DataProvider from './demos/DataProvider.vue';
import DomRef from './demos/DomRef.vue';
import AsyncComponent from './demos/AsyncComponent.vue';
import LifecycleHooks from './demos/LifecycleHooks.vue';
import ReactiveBase from './demos/ReactiveBase.vue';
import WatchMode from './demos/WatchMode.vue';
import CustomDirectives from './demos/CustomDirectives.vue';
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />
    </div>
  </header>

  <main>
    <TheWelcome />
  </main>

  <!-- demo -->

  <!-- 响应式基础 -->
  <ReactiveBase />

  <!-- 计算属性 -->
  <ComputedAttr />

  <!-- TODO class / style 绑定 -->
  <div class="demo">
    <h1>class / style 绑定</h1>
    <div>内置了类似 clsx 的实现</div>
  </div>

  <!-- TODO 条件渲染 -->
  <div class="demo">
    <h1>条件渲染 v-if, v-show</h1>
    <div>与 Vue2 相似</div>
    <div>template 可作为 React.Fragment 使用</div>
    <div>使用 template + v-for > v-if 取代 v-for + v-if 共用</div>
  </div>

  <!-- TODO 列表渲染 -->
  <div class="demo">
    <h1>列表渲染 v-for</h1>
    <div>与 Vue2 相似</div>
  </div>

  <!-- 生命周期钩子 -->
  <LifecycleHooks />

  <!-- 侦听器 -->
  <WatchMode />

  <!-- 模版引用 -->
  <DomRef />

  <!-- 组件基础 -->
  <ComponentBasic :id="0" />

  <!-- 依赖注入 -->
  <DataProvider />

  <!-- 动态组件 -->
  <AsyncComponent />

  <!-- 自定义指令 -->
  <CustomDirectives />
</template>

<style scoped>
header {
  display: flex;
  place-items: center;
  padding-right: calc(var(--section-gap) / 2);
  line-height: 1.5;
}

header .wrapper {
  display: flex;
  place-items: flex-start;
  flex-wrap: wrap;
}

.logo {
  display: block;
  margin: 0 2rem 0 0;
}
</style>
