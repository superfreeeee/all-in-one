<template>
  <div id="demo-computed-attr" class="demo">
    <h1>Demo: 计算属性</h1>

    <h2>计算属性: ref</h2>
    <div class="block">
      <div>{{ computedRefCount }}</div>
      <button @click="refCount++">increment</button>
    </div>

    <br />

    <h2>计算属性: reactive</h2>
    <div class="block">
      <div>{{ computedReactiveCount }}</div>
      <button @click="reactiveCount.count++">increment</button>
      <div>点击 increment, 浅层 ref 不具备响应式</div>
      <div>toString 加入后，会监听 .value</div>
    </div>

    <br />

    <h2>可写计算属性</h2>
    <div class="block">
      <div>id: {{ id }}</div>
      <div>name: {{ name }}</div>
      <div>info: {{ info }}</div>
      <button @click="nextInfo">nextInfo</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';

const refCount = ref(0);

const computedRefCount = computed(() => {
  return `refCount = ${refCount.value}`;
});

const reactiveCount = reactive({
  count: 0
  // toString(this: { count: number }) {
  //   return `{ count: ${this.count} }`;
  // }
});

const computedReactiveCount = computed(() => {
  console.log('computedReactiveCount update');
  // 监听第一层不会产生监听
  return `reactiveCount = ${reactiveCount}`;
});

const names = ['John', 'Ann', 'Jack'];

const id = ref(0);
const nameIndex = ref(0);

const name = computed(() => names[nameIndex.value]);

const info = computed({
  get() {
    return `${id.value}. ${name.value}`;
  },
  set(newValue) {
    const [newId, newName] = newValue.split('. ');
    id.value = Number(newId);
    const nextIndex = names.indexOf(newName);
    nameIndex.value = nextIndex >= 0 ? nextIndex : 0;
  }
});

const nextInfo = () => {
  info.value = `${id.value + 1}. ${names[(nameIndex.value + 1) % names.length]}`;
};
</script>
