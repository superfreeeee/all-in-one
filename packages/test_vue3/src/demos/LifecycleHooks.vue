<template>
  <div id="demo-lifecycle-hooks" class="demo">
    <h1>Demo: 生命周期钩子</h1>

    <h2>计算属性: ref</h2>
    <div class="block">
      <div ref="refEl">ref target</div>
    </div>

    <br />

    <h2>通过 nextTick 渲染后 dom</h2>
    <div class="block" ref="nextTickDom">
      <div>count: {{ count }}</div>
      <div>double: {{ double }}</div>
      <button @click="increment">increment</button>
      <div>状态是同步更新的</div>
      <div>真实 dom 是异步更新</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeMount, onBeforeUpdate, onMounted, onUpdated, ref } from 'vue';
import { createGroupLog } from '@/utils/log';

const refEl = ref<HTMLDivElement | null>(null);
const nextTickDom = ref<HTMLDivElement | null>(null);

const collectNextTickDom = () => {
  return [
    'checkNextTickDom:',
    ...(nextTickDom.value?.innerHTML
      .match(/<div>(.*?)<\/div>/g)
      ?.map((row) => row.replace(/<div>(.*?)<\/div>/, '$1')) ?? []),
  ];
};

const count = ref(0);

const double = computed(() => {
  console.log('on double re-computed');
  return count.value * 2;
});

const collectRefState = () => {
  return [
    'checkRefState:', //
    `count: ${count.value}`,
    `double: ${double.value}`,
  ];
};

const increment = async () => {
  const group = createGroupLog('increment');
  group.next('increment 1:');
  group.add('> 状态改变前');
  group.add();
  group.add(collectRefState());
  group.add();
  group.add(collectNextTickDom());

  count.value += 1;

  group.next('increment 2:');
  group.add('> 状态改变后');
  group.add();
  group.add(collectRefState());
  group.add();
  group.add(collectNextTickDom());

  await nextTick();

  group.next('increment 3:');
  group.add('> nextTick 在 updated 后');
  group.add();
  group.add(collectRefState());
  group.add();
  group.add(collectNextTickDom());

  group.output();
};

// mounted 阶段
onBeforeMount(() => {
  const group = createGroupLog('[LifecycleHooks] onBeforeMount');
  group.add(`refEl: ${refEl.value}`);
  group.add(`refEl textContent: ${refEl.value?.textContent}`);
  group.add();
  group.add('* onBeforeMount 执行 dom 挂载前');
  group.output();
});

onMounted(() => {
  const group = createGroupLog('[LifecycleHooks] onMounted');
  group.add(`refEl: ${refEl.value}`);
  group.add(`refEl textContent: ${refEl.value?.textContent}`);
  group.add();
  group.add('* onBeforeMount 执行 dom 挂载后');
  group.output();
});

// updated 阶段
onBeforeUpdate(() => {
  const group = createGroupLog('[LifecycleHooks] onBeforeUpdate');
  group.add(collectNextTickDom());
  group.add();
  group.add('* onBeforeUpdate 执行在 dom 应用前');
  group.output();
});

onUpdated(() => {
  const group = createGroupLog('[LifecycleHooks] onUpdated');
  group.add(collectNextTickDom());
  group.add();
  group.add('* onBeforeUpdate 执行在 dom 应用后');
  group.output();
});
</script>
