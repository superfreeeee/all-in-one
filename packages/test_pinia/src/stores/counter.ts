import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0);

  const doubleCount = computed(() => count.value * 2);

  const innerCount = computed(() => ({
    count: count.value,
    doubleCount: doubleCount.value,
    level2: { count: count.value },
  }));

  function increment() {
    count.value++;
  }

  return { count, doubleCount, increment, innerCount };
});
