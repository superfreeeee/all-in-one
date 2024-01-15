<template>
  <div
    id="demo-edge-case"
    class="demo"
  >
    <h2>Demo: Edge Case</h2>

    <h3>边缘场景</h3>
    <div
      class="block"
      ref="accessor"
    >
      <button @click="accessRoot">使用 $root 访问根实例</button>
      <button @click="accessParent">使用 $parent 访问父组件实例</button>
      <MyLoading ref="loading" />
      <button @click="accessRefs">使用 $refs 访问元素/组件引用</button>
    </div>

    <h3>依赖注入</h3>
    <div>
      <div>使用 provide 返回 context</div>
      <div>使用 inject 从 context 获取可用对象</div>
      <div>类似 react 中的 useContext</div>
      <!-- // TODO demo -->
    </div>

    <h3>组件循环注册</h3>
    <div>
      <div>1. 在 beforeCreate 内主动向 $options.components 注册</div>
      <div>2. 组件异步注册 => component: import('xxx')</div>
      <!-- // TODO demo -->
    </div>

    <h3>命令式监听事件</h3>
    <div>
      <div>
        <button @click="listenByCode">使用 $on $once 监听目标实例事件</button>
      </div>
    </div>

    <!-- // TODO inline-template -->

    <h3>强制重渲染</h3>
    <div>
      <div>currentTime: {{ new Date().toLocaleString() }}</div>
      <button @click="forceUpdate">forceUpdate 重渲染，观察上面时间变化</button>
    </div>
  </div>
</template>

<script>
import MyLoading from '../components/MyLoading.vue';

export default {
  components: {
    MyLoading,
  },
  methods: {
    accessRoot() {
      console.log('accessRoot', this.$root);
    },
    accessParent() {
      console.log('accessParent', this.$parent);
    },
    accessRefs() {
      console.log('accessRefs', this.$refs);
    },
    forceUpdate() {
      console.log('invoke forceUpdate');
      this.$forceUpdate();
    },
    listenByCode() {
      this.$on('custom', (t) => {
        console.log(`[demo-edge-case] custom ${t}`);
      });

      let count = 5;
      const timer = setInterval(() => {
        this.$emit('custom', new Date().toLocaleString());

        if (count-- < 0) {
          clearInterval(timer);
        }
      }, 1000);
    },
  },
};
</script>
