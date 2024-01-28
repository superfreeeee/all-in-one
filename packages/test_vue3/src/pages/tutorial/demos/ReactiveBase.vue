<template>
  <div id="demo-reactive-base" class="demo">
    <h1>Demo: 响应式基础</h1>

    <h2>经典 Counter</h2>
    <div class="block">
      <div>count: {{ count }}</div>
      <button @click="increment">increment</button>

      <div ref="nestedCount">deepCounter.nested: {{ deepCounter.nested }}</div>
      <div>deepCounter.arr: {{ deepCounter.arr }}</div>
      <button @click="mutateDeeply">mutateDeeply</button>
    </div>

    <br />

    <h2>ref 对象解构</h2>
    <div class="block">
      <div>refCounter: {{ refCounter }}</div>
      <button @click="refCounter.count++">increment refCounter</button>

      <div>reactiveCounter: {{ reactiveCounter }}</div>
      <button @click="reactiveCounter.count++">increment reactiveCounter</button>
      <div>可以使用 toRefs 重新转换成 ref 对象</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCounter, useNestedCounter, useDestructCounter } from '@/hooks/useCounter';

const { count, increment } = useCounter();

const { deepCounter, nestedCount, mutateDeeply } = useNestedCounter();

const { refCounter, reactiveCounter } = useDestructCounter();
</script>
