<template>
  <div id="demo-watch-mode" class="demo">
    <h1>Demo: 侦听器</h1>

    <h3>监听 ref</h3>
    <div class="block">
      <div>count: {{ count }}</div>
      <button @click="count++">increment</button>
      <div>counter: {{ counter }}</div>
      <button @click="counter.count++">increment</button>
      <button @click="counter.inner.count++">increment inner</button>
      <button @click="counter = { count: 0, inner: { count: 0 } }">reset</button>
      <button @click="watchAgain">watchAgain</button>

      <div>* 相当于 watch 需要接受的目标必须是一个响应式对象</div>
      <div>* 可以是一个带简单值的 ref = { value: primitive }</div>
      <div>* 或是一个深层的 reactive 对象 reactive = { attr: value }</div>
      <div>* 深层的 reactive 对象不可以指向简单类型否则 watch 无法收集依赖</div>
      <div>* watch reactive.attr, reactive = { attr: primitive } 时会失效</div>
      <div>* 相当于直接去监听了 ref.value 一样</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const count = ref(0);

watch(count, () => {
  console.log('watch count', { count: count.value });
});

const counter = ref({ count: 0, inner: { count: 0 } });

const watchCounterValue = () => {
  console.log('重新监听 counter.value');

  return watch(counter.value, () => {
    console.log('watch counter.value', counter.value);
    console.log('监听 counter.value 相当于监听 ref 指向的 reactive 对象，可以感知嵌套元素');
  });
};

let cancel = watchCounterValue();

const watchAgain = () => {
  cancel();
  cancel = watchCounterValue();
};

watch(counter, () => {
  console.log('watch counter', { count: counter.value.count });
  console.log('counter 替换之后，之前的 watch counter.value 就无效了，点击 watch again 重新监听');
});

watch(
  () => count.value,
  () => {
    console.log(
      'watch count',
      { count: count.value }, //
      '\n* 也可以直接给一个 getter 自动收集依赖',
    );
  },
);
</script>
