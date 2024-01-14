<template>
  <div
    id="demo-data-binding"
    class="demo"
  >
    <h2>Demo: Data Binding</h2>

    <h3>数据绑定</h3>
    <div>
      <!-- {{ 绑定文本 }} -->
      <!-- `v-bind:xxx` 绑定属性 -->
      <div v-bind:style="messageStyle">message: {{ message }}</div>
      <!-- `:xxx` 绑定属性 -->
      <div :style="messageStyle">{{ `绑定表达式: message="${message}"` }}</div>
    </div>

    <h3>方法绑定: 点击后查看 console</h3>
    <div>
      <!-- `v-on:xxx` 绑定事件 -->
      <button v-on:click="onBtnClick">方法绑定 v-on:click</button>
      <!-- `@xxx` 绑定事件 -->
      <button @click="onBtnClick">方法绑定 @click</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DemoDataBinding',
  data() {
    return {
      message: '数据绑定 message',
      messageStyle: {
        'text-decoration': 'underline',
      },
      count: 1,
    };
  },
  methods: {
    onBtnClick(e) {
      console.log('onBtnClick', e);
    },
  },
};
</script>

<style scoped>
.text {
  text-decoration: underline;
}
</style>
