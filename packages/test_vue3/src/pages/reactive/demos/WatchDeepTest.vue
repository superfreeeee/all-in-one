<template>
  <div class="demo">
    <h1>WatchDeepTest</h1>

    <div>counter: {{ counter }}</div>
    <button @click="resetCounter">resetCounter</button>

    <div>count: {{ counter.count }}</div>
    <button @click="counter.count++">count + 1</button>

    <div>inner.value: {{ counter.inner.value }}</div>
    <button @click="counter.inner.value++">inner.value + 1</button>
    <button @click="resetInner">resetInner</button>
  </div>
</template>

<script setup lang="ts">
import { logGroup } from '@/utils/log';
import { watchDeep } from '@/utils/watch';
import { ref } from 'vue';

const counter = ref({ count: 0, inner: { value: 100 } });

watchDeep(counter, (counter, onCleanUp) => {
  const count = counter.count;
  const value = counter.inner.value;

  logGroup(
    '[WatchDeepTest] watchDeep callback',
    () => {
      console.log('counter  :', counter);
      console.log('count    :', count);
      console.log('value    :', value);
    },
    false,
  );

  /**
   * 打开注释，可以看到在 cleanup 阶段能够通过闭包捕获旧的值
   */
  // onCleanUp(() => {
  //   logGroup(
  //     '[WatchDeepTest] watchDeep onCleanUp',
  //     () => {
  //       console.log('counter  :', counter);
  //       console.log('count    :', count);
  //       console.log('value    :', value);
  //     },
  //     false,
  //   );
  // });
});

// 替换整个对象
const resetCounter = () => {
  counter.value = { count: 0, inner: { value: 100 } };
};

// 替换 inner 对象
const resetInner = () => {
  counter.value.inner = { value: 100 };
};
</script>
