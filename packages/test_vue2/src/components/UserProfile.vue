<template>
  <div>
    <div>username: {{ username }}</div>
    <div>innerUsername: {{ innerUsername }}</div>
    <div>* innerUsername 将 props 绑定到 data</div>
    <div>* innerUsername 不会跟随 username 改变了</div>
    <br />

    <div>age: {{ age }}</div>
    <div>isGraduated: {{ isGraduated }}</div>
    <div>login time: {{ new Date().toLocaleString() }}</div>
    <br />

    <div>currentTime: {{ data.currentTime }}</div>
    <div>innerCurrentTime: {{ innerData.currentTime }}</div>
    <div>* innerData 传递的是响应式对象</div>
    <div>* innerData 与 data 为相同引用，会跟随响应式</div>
  </div>
</template>

<script>
export default {
  // 数组形式
  // props: ['username', 'age', 'isGraduated'],

  // 对象 / schema 表达式
  props: {
    username: String,
    // 指定类型
    age: Number,

    isGraduated: {
      type: Boolean,
      // 默认值
      default: true,
    },

    data: Object,
  },

  data() {
    return {
      innerUsername: this.username,
      innerData: this.data,
    };
  },
};
</script>
