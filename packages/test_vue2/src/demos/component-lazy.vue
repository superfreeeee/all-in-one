<template>
  <div
    id="demo-component-lazy"
    class="demo"
  >
    <h2>Demo: Lazy Component</h2>

    <h3>组件懒加载</h3>
    <div>
      <button @click="showLazyCompGlobal = !showLazyCompGlobal">
        showLazyCompGlobal
      </button>
      <lazy-comp-global v-if="showLazyCompGlobal" />
      <LazyCompGlobal v-if="showLazyCompGlobal" />
    </div>

    <h3>组件级别懒加载</h3>
    <div>
      <button @click="showLazyComp = !showLazyComp">showLazyComp</button>
      <LazyComp v-if="showLazyComp" />
    </div>

    <h3>懒加载状态处理: delay 200ms</h3>
    <div>
      <div>200ms 后未加载完成则显示 loading 态</div>
      <button @click="showLazyComp2 = !showLazyComp2">showLazyComp2</button>
      <LazyComp2 v-if="showLazyComp2" />
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { LazyComp } from '../components/lazyComp.ts';

console.log('load DemoComponentLazy');

// register LazyComp
Vue.component(
  /**
   * ! 注册连字号的时候，大驼峰无效
   */
  // 'lazy-comp-global',
  /**
   * ! 注册大驼峰的时候，连字号也能用
   */
  'LazyCompGlobal',
  /**
   * 懒加载组件
   */
  () => import('../components/LazyComp.vue'),
);

export default {
  components: {
    /**
     * 组件级别懒加载
     */
    LazyComp: () => import('../components/LazyComp.vue'),
    LazyComp2: LazyComp,
  },
  data() {
    return {
      showLazyCompGlobal: false,
      showLazyComp: false,
      showLazyComp2: false,
    };
  },
};
</script>
