<template>
  <div
    id="demo-computed-watch"
    class="demo"
  >
    <h2>Demo: Computed and Watch</h2>

    <h3>计算属性</h3>
    <div>
      <div>count: {{ count }}</div>
      <div>{{ countStr }}</div>
      <button @click="incrementCount">incrementCount</button>
      <div>点击 incrementCount 查看 count, countStr 变化</div>
      <div>点击 incrementCount 查看 console watch 监听响应式属性</div>
    </div>

    <h3>
      计算属性: 响应式检查
      <button @click="renderCount += 1">re-render: {{ renderCount }}</button>
    </h3>
    <div>
      <div>依赖 methods, 每次点击都会刷新: {{ getCurrentTime() }}</div>
      <div>依赖 computed, 非响应式计算属性: {{ computedCurrentTime }}</div>
      <div>computed 依赖 methods: {{ computedCurrentTime2 }}</div>
      <div>nested computed, 嵌套计算属性: {{ computedCurrentTime3 }}</div>
    </div>

    <h3>表单绑定</h3>
  </div>
</template>

<script>
export default {
  name: 'DemoComputedWatch',
  data() {
    return {
      count: 1,
      renderCount: 1,
    };
  },
  computed: {
    countStr() {
      return `countStr: this.count = ${this.count}`;
    },
    computedCurrentTime() {
      return new Date().toLocaleString();
    },
    computedCurrentTime2() {
      /**
       * computed 依赖 methods，重渲染不会刷新
       * 证明 getCurrentTime 方法本身并不是响应式的
       */
      return this.getCurrentTime();
    },
    computedCurrentTime3() {
      /**
       * countStr 改变时会联动
       * 证明 computed 属性是响应式的
       */
      return this.countStr;
    },
  },
  watch: {
    /**
     * 监听响应式属性 count
     */
    count(val, oldVal) {
      console.log(`watch count: val=${val}, oldVal=${oldVal}`);
    },
    /**
     * 监听非响应式方法
     * ! => 可以监听但是没有意义
     */
    getCurrentTime() {
      console.log('watch getCurrentTime');
    },
  },
  methods: {
    incrementCount() {
      this.count += 1;
    },
    getCurrentTime() {
      return new Date().toLocaleString();
    },
  },
};
</script>
