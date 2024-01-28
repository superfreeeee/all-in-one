<script setup lang="ts">
import { computed, h, ref, watchEffect } from 'vue';
import ObjectRef from './demos/ObjectRef.vue';
import PrimitiveRef from './demos/PrimitiveRef.vue';
import WatchDeepTest from './demos/WatchDeepTest.vue';

enum Tab {
  PrimitiveRef,
  ObjectRef,
  WatchDeepTest,
}

const tabs = [
  {
    key: Tab.PrimitiveRef,
    text: 'PrimitiveRef',
    // 原始值
    Comp: PrimitiveRef, // 好像直接用 Comp 就可以了，不需要 h 渲染
    render: () => h(PrimitiveRef),
  },
  {
    key: Tab.ObjectRef,
    text: 'ObjectRef',
    // 响应式
    Comp: ObjectRef,
    render: () => h(ObjectRef),
  },
  {
    key: Tab.WatchDeepTest,
    text: 'WatchDeepTest',
    // 深度监听
    Comp: WatchDeepTest,
    render: () => h(WatchDeepTest),
  },
];

const getLastTab = (): Tab => {
  try {
    const lastKey = JSON.parse(localStorage.getItem('__test_vue3-currentTab') || '');
    if (lastKey && tabs.find((tab) => tab.key === lastKey)) {
      return lastKey;
    }
  } catch {
    //
  }
  return tabs[0].key;
};

const currentTabKey = ref(getLastTab());
const currentTab = computed(() => {
  return tabs.find((tab) => tab.key === currentTabKey.value) || tabs[0];
});

watchEffect(() => {
  localStorage.setItem('__test_vue3-currentTab', JSON.stringify(currentTab.value.key));
});
</script>

<template>
  <div>
    <button
      v-for="tab in tabs"
      :key="tab.key"
      :disabled="currentTab.key === tab.key"
      @click="currentTabKey = tab.key"
    >
      {{ tab.text }}
    </button>
  </div>

  <!-- 传入 .vue 文件 => SFC 组件 -->
  <component :is="currentTab.Comp" :key="currentTab.key" />

  <!-- 传入 render 函数 => 相当于 SFC 组件 -->
  <!-- <component :is="currentTab.render" :key="currentTab.key" /> -->
</template>
