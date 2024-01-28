<template>
  <div class="demo">
    <h1>PrimitiveRef</h1>

    <!-- 非响应式对象 -->
    <div>count0: {{ count0 }}</div>
    <button @click="count0.value++">increment</button>

    <!-- 响应式对象 -->
    <div>count: {{ count }}</div>
    <button @click="count++">increment</button>

    <div>count2: {{ count2 }}</div>
    <button @click="count2++">increment</button>
    <button @click="count2 = 0">reset</button>

    <!-- 计算对象 -->
    <div>countPair: {{ countPair }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { logGroup } from '@/utils/log';

const count0 = { value: 0 };

/**
 * watch 普通对象，会出现 warn 警告
 * ! 出现 warning
 */
// watch(count0, () => {
//   logGroup('[PrimitiveRef] 0. watch raw object', () => {
//     console.log('count0 :', count0);
//   });
// });

const count = ref(0);
logGroup('[PrimitiveRef] setup', () => {
  console.log('count        :', count);
  console.log('count.value  :', count.value);
});

/**
 * watch ref 对象
 */
watch(count, (value, oldValue, onCleanup) => {
  logGroup('[PrimitiveRef] 1. watch ref', () => {
    console.log('count.value  :', count.value);
    // value 为 watch 目标的值
    console.log('value        :', value);
    console.log('oldValue     :', oldValue);
  });

  onCleanup(() => {
    console.log('[PrimitiveRef] 1. watch ref cleanup');
  });
});

/**
 * watch getter 对象
 * 这里的 getter 看似与 computed 对象作用一致
 */
watch(
  () => {
    // getter 会监听响应式对象
    console.log('[PrimitiveRef] 2. watch getter, computed', count.value);

    /**
     * 但是由返回值变化，决定是否执行 callback
     * 返回 Date.now 的时候每次都不一样，必执行 callback
     */
    return count.value;
    // return 0;
    // return {};
    // return Date.now();
  },
  (value, oldValue) => {
    logGroup('[PrimitiveRef] 2. watch getter, callback', () => {
      console.log('count.value  :', count.value);
      console.log('value        :', value);
      console.log('oldValue     :', oldValue);
    });
  },
);

const count2 = ref(100);

/**
 * watch 数组
 */
watch([count, count2], (value, oldValue) => {
  logGroup('[PrimitiveRef] 3. watch array, callback', () => {
    console.log('count.value  :', count.value);
    console.log('count2.value :', count2.value);
    console.log('value        :', value);
    console.log('oldValue     :', oldValue);
  });
});

/**
 * watch 数组带普通对象
 * ! 出现 warning
 */
// watch([count0, count2], (value, oldValue) => {
//   logGroup('[PrimitiveRef] 4. watch array, callback', () => {
//     console.log('value        :', value);
//     console.log('oldValue     :', oldValue);
//   });
// });

/**
 * watch 数组
 */
watch(
  () => {
    console.log('[PrimitiveRef] 5. watch getter array, computed', {
      count: count.value,
      count2: count2.value,
    });

    /**
     * 使用 getter 的时候，直接比较返回值
     * 返回 [] 与返回 {} 一样，直接比较引用
     *
     * 结论看下来是推荐直接使用 ref 数组
     * 除非依赖某个计算值的变化
     */
    // return [];
    // return [count.value];
    /**
     * 这里无论值是否改变，数组引用总是变化
     * 测试发现，value 不改变的时候（重复 reset），值相同的时候并不会触发响应式
     */
    return [count.value, count2.value];
    // return count.value; // 这里相当于只监听了 count "值" 的变化
  },
  (value, oldValue) => {
    logGroup(
      '[PrimitiveRef] 5. watch getter array, callback',
      () => {
        console.log('count.value  :', count.value);
        console.log('count2.value :', count2.value);
        console.log('value        :', value);
        console.log('oldValue     :', oldValue);
      },
      // false,
    );
  },
);

const countPair = computed(() => {
  console.log('[PrimitiveRef] 6. computed target', {
    count: count.value,
    count2: count2.value,
  });

  /**
   * 这里理论上返回的都是新对象
   * 返回 0 的时候，返回值不变化会缓存，同时不会触发监听变化
   */
  return [count.value, count2.value];
  // return 0;
});

/**
 * watch computed 对象
 */
watch(countPair, (value, oldValue) => {
  logGroup(
    '[PrimitiveRef] 7. watch computed, callback',
    () => {
      console.log('value        :', value);
      console.log('oldValue     :', oldValue);
    },
    // false,
  );
});
</script>
