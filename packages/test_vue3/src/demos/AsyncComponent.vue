<template>
  <div id="demo-dynamic-component" class="demo">
    <h1>Demo: 异步组件</h1>

    <div>
      <div>* 注释下面这一行，观察 setup 阶段触发变化</div>
      <div>* 使用第二种 import ，观察 load 阶段触发差异</div>
      <LazyComponent />
    </div>
  </div>
</template>

<script setup lang="ts">
// import { LazyComponent } from '@/components';
// 同步加载组件
import LazyComponent from '@/components/LazyComponent.vue';

console.log('LazyComponent', LazyComponent);
</script>
