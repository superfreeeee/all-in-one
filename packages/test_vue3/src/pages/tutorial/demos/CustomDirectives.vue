<template>
  <div id="demo-custom-directives" class="demo">
    <h1>Demo: 自定义指令</h1>

    <h3>基础用法</h3>
    <div class="block">
      <input v-fill:foo.bar="{ data: 'audoFill' }" />
      <div>* setup 中定义 vXxx 变量</div>
      <div>* options 中使用 directives 定义</div>
      <div>* app.directive 全局注册</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { createGroupLog } from '@/utils/log';

const vFill = {
  mounted: (el: any, binding: any) => {
    el.value = 'auto filled by v-fill';

    const group = createGroupLog('[v-fill] mounted');
    group.add(`arg: ${binding.arg}`);
    group.add(`modifiers: ${JSON.stringify(binding.modifiers)}`);
    group.add(`value: ${JSON.stringify(binding.value)}`);
    group.output();
  },
};
</script>
