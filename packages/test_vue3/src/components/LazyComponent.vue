<template>
  <div>This is Lazy Component</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

console.log('[LazyComponent] LazyComponent load 阶段');

export default defineComponent({
  setup() {
    console.log('[LazyComponent] LazyComponent setup 阶段');
  },
});
</script>
