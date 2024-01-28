<template>
  <div class="demo">
    <h1>ObjectRef</h1>

    <div>data: {{ data }}</div>
    <button @click="resetData">reset data</button>
    <button @click="resetInnerData">reset inner data</button>
    <button @click="resetDeepData">reset deep data</button>

    <div>data.value: {{ data.value }}</div>
    <button @click="data.value += 1">increment</button>

    <div>data.inner.value: {{ data.inner.value }}</div>
    <button @click="data.inner.value += 1">increment</button>

    <div>data.inner.deep.value: {{ data.inner.deep.value }}</div>
    <button @click="data.inner.deep.value += 1">increment</button>

    <div>inner1: {{ inner1 }}</div>
    <!-- 这里的 inner1 会是一个悬空对象，不联动 -->
    <!-- <button @click="inner1.value += 1">increment</button> -->

    <div>inner2: {{ inner2 }}</div>
    <button @click="inner2.value += 1">increment</button>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, unref, watch, watchEffect } from 'vue';
import { cloneDeep } from 'lodash-es';
import { logGroup } from '@/utils/log';
import { watchDeep } from '@/utils/watch';

const data = ref({
  value: 0,
  inner: {
    value: 10,
    deep: {
      value: 100,
    },
  },
});

const resetData = () => {
  data.value = {
    value: 0,
    inner: {
      value: 10,
      deep: {
        value: 100,
      },
    },
  };
};

const resetInnerData = () => {
  data.value.inner = {
    value: 10,
    deep: {
      value: 100,
    },
  };
};

const resetDeepData = () => {
  data.value.inner.deep = {
    value: 100,
  };
};

const printData = () => {
  console.log('data.value.value             :', data.value.value);
  console.log('data.value.inner.value       :', data.value.inner.value);
  console.log('data.value.inner.deep.value  :', data.value.inner.deep.value);
};

logGroup(
  '[ObjectRef] setup',
  () => {
    console.log('data        :', data);
    console.log('data.value  :', data.value);

    console.log('data.value.value  :', data.value.value);
    console.log('data.value.inner  :', data.value.inner);

    console.log('data.value.inner.value  :', data.value.inner.value);
    console.log('data.value.inner.deep   :', data.value.inner.deep);

    console.log('data.value.inner.deep.value  :', data.value.inner.deep.value);
  },
  // false,
);

/**
 * 1. watch ref 对象
 * ref 指向一个 object 的时候，value 指向一个 reactive 对象
 * 监听 data 相当于只有在替换整个对象的时候才会响应
 */
watch(data, (value, oldValue) => {
  logGroup(
    '[ObjectRef] 1. watch ref object',
    () => {
      console.log('value        :', value);
      console.log('oldValue     :', oldValue);

      printData();
    },
    // false,
  );
});

/**
 * 2. watch reactive 对象
 * value 跟 oldValue 都直接指向原对象，就不存在 old value 的部分了
 * resetData 后，替换了整个 reactive 对象，这里的 2. 监听器就会失效了
 */
watch(data.value, (value, oldValue) => {
  logGroup(
    '[ObjectRef] 2. watch reactive object: data.value',
    () => {
      console.log('value     :', value);
      console.log('oldValue  :', oldValue);

      printData();
    },
    // false,
  );
});

/**
 * 3. watch 嵌套 reactive 对象
 * 今天 watch 的是 reactive 对象的时候，value 跟 oldValue 就没什么意义了
 * 更新 inner 以内的值才会响应
 *
 * resetInnerData 或是 resetData 后
 * 当前 watch 的 inner 对象已经丢弃，所以不会再监听了
 */
watch(data.value.inner, (value, oldValue) => {
  logGroup(
    '[ObjectRef] 3. watch nested reactive object: data.value.inner',
    () => {
      console.log('value     :', value);
      console.log('oldValue  :', oldValue);

      printData();
    },
    // false,
  );
});

const inner1 = data.value.inner;

/**
 * 4. watch 解构后的 inner 对象
 *
 * 这里 inner1 指向的是 reactive 对象，所以可以直接 watch
 * resetInnerData 后 inner 就被换掉了，所以响应式会失效
 */
watch(inner1, (value, oldValue) => {
  logGroup(
    '[ObjectRef] 4. watch destruct reactive object: inner1',
    () => {
      console.log('value     :', value);
      console.log('oldValue  :', oldValue);
    },
    // false,
  );
});

/**
 * 计算属性
 */
const inner2 = computed(() => {
  return data.value.inner;
  // return cloneDeep(data.value.inner);
  // return unref({
  //   value: 10,
  //   deep: {
  //     value: 100,
  //   },
  // });
  // const inner = data.value.inner;
  // return cloneDeep(inner);
});

/**
 * 5. watch computed 的嵌套 reactive 对象
 *
 * 这里 inner2 指向的是一个 { value: ReactiveObject }
 * 所以需要 watch inner2.value
 * 跟 watch reactive 对象一样，resetInnerData 后就失效了
 *
 * watch inner2 监听的是对象引用的改变
 * watch inner2.value 是监听对象内容的改变（所谓的深度响应式）
 */
watch(inner2.value, (value, oldValue) => {
  logGroup(
    '[ObjectRef] 5. watch computed nested object: inner2.value',
    () => {
      console.log('value     :', value);
      console.log('oldValue  :', oldValue);
    },
    // false,
  );
});

/**
 * 6. watch getter 内访问 reactive 对象
 */
watch(
  () => {
    /**
     * 如果使用 getter 访问到深层的 value
     * 这时候同时也会监听到 inner 对象的改变
     *
     * 5. watch reactive 对象的时候，无法监听整个对象的替换
     * 但是 6. 使用 getter 就可以了
     *
     * 另一个是 5. 的例子里面也会对 deep.value 进行响应
     * 但是 6. 只会响应 inner 对象的替换与 value 值的改变，不再响应 deep 的改变
     */
    console.log('[ObjectRef] 6. watch getter, computed', {
      inner2: inner2.value,
      value: inner2.value.value,
    });

    return {};
  },
  (value, oldValue) => {
    logGroup(
      '[ObjectRef] 6. watch getter: inner2.value.value',
      () => {
        console.log('value     :', value);
        console.log('oldValue  :', oldValue);
      },
      // false,
    );
  },
);

/**
 * 7. watchEffect 访问 reactive 对象
 *
 * 与 6. 的例子雷同，监听了目标值与整个 inner 对象的改变
 *
 * resetInnerData 后，watchEffect 居然会在 watch 后面执行
 * 7. 比 8. 要晚响应？？
 */
watchEffect(() => {
  console.log('[ObjectRef] 7. watchEffect', data.value.inner.value);
});

/**
 * 8. watch deep
 *
 * 在 getter 里面也访问 deep.value, 才能监听到目标属性变化
 */
watch(
  () => {
    console.log('[ObjectRef] 8. watch getter, computed', {
      inner2: inner2.value,
      value: inner2.value.value,
      deep: inner2.value.deep,
      deepValue: inner2.value.deep.value,
    });

    return {};
  },
  (value, oldValue) => {
    logGroup(
      '[ObjectRef] 8. watch getter: inner2.value.value',
      () => {
        console.log('value     :', value);
        console.log('oldValue  :', oldValue);
      },
      // false,
    );
  },
);

/**
 * 9. 深度监听，同时监听引用变化
 */
watchDeep(inner2, (value, onCleanUp) => {
  console.log('[ObjectRef] 9. watchDeep', {
    inner2: inner2,
    'inner2.value': inner2.value,
    callbackValue: value,
    value: value.value,
    deepValue: value.deep.value,
  });

  onCleanUp(() => {
    console.log('[ObjectRef] 9. watchDeep cleanup');
  });
});
</script>
