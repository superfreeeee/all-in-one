<template>
  <div id="demo-component-basic" class="demo">
    <h1>Demo: 组件基础</h1>

    <h3>组件基础</h3>
    <div>
      <div>* 大部分都在代码注释里面了</div>
      <component :is="compType">这个是动态组件: {{ compType }}</component>
      <button @click="toggleType">切换组件类型</button>
    </div>

    <br />

    <h3>Props 参数传递</h3>
    <div>
      <div>* 使用 defineProps 声明 props</div>
      <div>* 使用 withDefaults 添加默认值</div>
      <div>* 使用 toRefs 转换成响应式对象</div>
    </div>

    <br />

    <h3>Emits 自定义事件触发</h3>
    <div>
      <div>* 使用 defineEmits 声明 emits</div>
      <div>* 使用范型约束 emit 事件类型</div>
      <div>* 使用 options 配置校验函数</div>
    </div>

    <br />

    <h3>v-model 可以使用 defineModel 定义</h3>
    <div>
      <div>* 子组件使用 defineModel</div>
      <div>* 父组件使用 v-model 绑定</div>
      <div>* 3.4 版以上的能力，算了吧</div>
      <div>* v-model:xxx 可以同时绑定多个</div>
    </div>

    <br />

    <h3>Attributes 属性</h3>
    <div>
      <div>* 这东西居然还会继承，真 tmsb</div>
      <div>* 使用 defineOptions({ inheritAttrs: false }) 取消继承</div>
      <div>* （应该其他 options API 也是一样的）</div>
      <div>* 模版内使用 $attr 访问</div>
      <div>* script useAttrs 访问</div>
    </div>

    <br />

    <h3>Slots 插槽</h3>
    <div>
      <div>* 跟 Vue2 类似</div>
      <div>* template + `v-slot:xx`, `#xxx` 声明模版</div>
      <div>* slot name="xxx" 作为模版出口</div>
      <div>* #xxx="slotProps" 可以在模版内获取子组件状态，可解构</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  id: number;
}

// defineProps 定义 props
const props = withDefaults(defineProps<Props>(), {
  id: -1,
});

console.log('[ComponentBasic] props', { ...props });

// defineEmits 定义 emits => 自定义事件
const emit = defineEmits<{
  (e: 'custom-event', id: number): void;
}>();
emit('custom-event', 1);

const compType = ref('div');
const toggleType = () => {
  compType.value = compType.value === 'div' ? 'span' : 'div';
};
</script>
