<template>
  <div
    id="demo-component-lifecycle"
    class="demo"
  >
    <h2>Demo: Component LifeCycle</h2>

    <div>
      <div>
        <button @click="reRender">点击重渲组件，观察 updated 钩子</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DemoComponentLifecycle',

  methods: {
    reRender() {
      this.$forceUpdate();
    },
  },

  beforeCreate() {
    console.log('[demo-component-lifecycle] beforeCreate');
  },
  created() {
    console.log('[demo-component-lifecycle] created');
  },

  beforeMount() {
    console.log('[demo-component-lifecycle] beforeMount');
  },
  mounted() {
    console.log('[demo-component-lifecycle] mounted');
  },

  beforeUpdate() {
    console.log('[demo-component-lifecycle] beforeUpdate');
  },
  updated() {
    console.log('[demo-component-lifecycle] updated');
  },
};
</script>
