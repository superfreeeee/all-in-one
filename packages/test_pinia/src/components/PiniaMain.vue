<template>
  <div class="demo">
    <h2>Pinia</h2>

    <h3>Counter store</h3>
    <div class="block">
      <div>count: {{ counter.count }}</div>
      <button @click="counter.increment">increment</button>

      <br />

      <PiniaChild />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCounterStore } from '@/stores/counter';
import PiniaChild from './PiniaChild.vue';

const counter = useCounterStore();
</script>
