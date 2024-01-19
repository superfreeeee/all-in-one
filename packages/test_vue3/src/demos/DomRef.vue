<template>
  <div id="demo-dom-ref" class="demo">
    <h1>Demo: 模版引用</h1>

    <h3>DOM ref</h3>
    <div class="block">
      <div>onMounted 后自动 focus 到 input 框内</div>
      <input type="text" ref="defaultInput" />
    </div>

    <br />

    <h3>v-for 循环 refs</h3>
    <div>
      <div>* 这里居然不保证顺序，傻眼</div>
      <div>* 不推荐使用数组 ref 吧， ref 到父元素，然后再查询子元素会更好</div>
    </div>

    <br />

    <h3>ref function</h3>
    <div>
      <div>* 这里跟 react 一样，接受 RefFn 回调</div>
      <div>* :ref="func", func: (element) => void</div>
    </div>

    <br />

    <h3>组件引用</h3>
    <div>
      <div>* 默认引用子组件的 Vue 实例，即 vm 对象</div>
      <div>* 使用 setup 的时候，需要使用 defineExpose 对外暴露</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, ref, watch } from 'vue';

const defaultInput = ref<HTMLInputElement | null>(null);

const messages: any[] = [];

watch(defaultInput, (input) => {
  messages.push(['watch defaultInput:', input]);
});

onBeforeMount(() => {
  messages.push([
    'onBeforeMount: input ref', //
    defaultInput,
    '\n* beforeMount 阶段 dom 还没挂载',
  ]);
});

onMounted(() => {
  messages.push([
    'onMounted: input ref', //
    defaultInput,
    '\n* mount 阶段 dom 挂载完成',
  ]);

  defaultInput.value?.focus();
});

setTimeout(() => {
  console.group('DomRef: input ref');
  messages.forEach((msg) => {
    console.log(...msg);
  });
  console.groupEnd();
}, 1000);
</script>
