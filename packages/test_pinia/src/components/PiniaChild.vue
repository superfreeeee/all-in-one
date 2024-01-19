<template>
  <div class="block">
    <div>counter.doubleCount: {{ counter.doubleCount }}</div>
    <div>counter.innerCount: {{ counter.innerCount }}</div>
    <div>* 直接使用绝对的保持响应式的</div>

    <br />

    <div>doubleCount: {{ doubleCount }}</div>
    <div>innerCount: {{ innerCount }}</div>
    <div>* 取出来之后响应式就失效了</div>

    <br />

    <div>innerCountRef: {{ innerCountRef }}</div>
    <div>doubleCountRef: {{ doubleCountRef }}</div>
    <div>level2: {{ level2 }}</div>

    <br />

    <div>reactiveObj: {{ reactiveObj }}</div>

    <br />

    <div>reactiveObj.data: {{ reactiveObjData }}</div>
    <div>reactiveObj.inner.data: {{ reactiveObjInnerData }}</div>

    <br />

    <div>reactiveObj.data: {{ reactiveObjData2 }}</div>
    <div>reactiveObj.inner.data: {{ reactiveObjInnerData2 }}</div>
    <button @click="reactiveObj.data++">inc data</button>
    <button @click="reactiveObj.inner.data++">inc inner data</button>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import { storeToRefs } from 'pinia';
import { useCounterStore } from '@/stores/counter';

const counter = useCounterStore();
const doubleCount = counter.doubleCount;
const innerCount = counter.innerCount;

const {
  innerCount: innerCountRef, //
  doubleCount: doubleCountRef,
} = storeToRefs(counter);
console.log({ innerCountRef });

const level2 = innerCountRef.value.level2;
console.log({ level2 });

const reactiveObj = reactive({ data: 1, inner: { data: 2 } });
console.log({ reactiveObj });
const reactiveObjData = reactiveObj.data;
const reactiveObjInnerData = reactiveObj.inner.data;

const reactiveObjData2 = computed(() => reactiveObj.data);
const reactiveObjInnerData2 = computed(() => reactiveObj.inner.data);
</script>
