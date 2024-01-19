<template>
  <div id="demo-dynamic-component" class="demo">
    <h1>Demo: 异步组件</h1>

    <div>
      <LazyComponent />
    </div>
  </div>
</template>

<script setup lang="ts">
import { LazyComponent } from '@/components';
</script>
