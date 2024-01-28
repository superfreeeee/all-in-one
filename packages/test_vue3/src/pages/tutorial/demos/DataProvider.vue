<template>
  <div id="demo-data-provider" class="demo">
    <h1>Demo: 依赖注入</h1>

    <div>其实就是 Context api</div>

    <h3>基础用法</h3>
    <div>
      <DataConsumer />
      <div>* app.provide 全局注册</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DataConsumer from '../components/DataConsumer.vue';
import { defineComponent, provide, ref } from 'vue';

const dataRaw = { count: 1 };

provide('dataRaw', dataRaw);

const data = ref({ count: 1 });

provide('data', data);

setTimeout(() => {
  dataRaw.count++;

  setTimeout(() => {
    data.value.count++;
  }, 500);
}, 500);

// options API 使用 provide/inject 注入
// defineComponent({
//   provide() {
//     return {};
//   },
// });
</script>
