import { nextTick, reactive, ref } from 'vue';

export const useCounter = () => {
  const count = ref(0);

  const increment = () => {
    count.value += 1;
  };

  return { count, increment };
};

export const useNestedCounter = () => {
  const deepCounter = ref({
    nested: { count: 0 },
    arr: ['foo', 'bar']
  });

  const nestedCount = ref<HTMLDivElement | null>(null);

  function checkNested(id: number) {
    console.log(`mutateDeeply ${id}`, { count: deepCounter.value.nested.count });
    console.log('nestedCount', nestedCount.value?.innerHTML);
  }

  async function mutateDeeply() {
    // nested-count
    checkNested(1);

    // 以下都会按照期望工作
    deepCounter.value.nested.count++;
    deepCounter.value.arr.push('baz');

    checkNested(2);

    await nextTick();

    checkNested(3);
  }

  return {
    deepCounter,
    nestedCount,
    mutateDeeply
  };
};

export const useDestructCounter = () => {
  const refCounter = ref({ count: 0 });
  const reactiveCounter = reactive({ count: 0 });

  return {
    refCounter: { count: refCounter.value.count },
    reactiveCounter: { count: reactiveCounter.count }
  };
};
