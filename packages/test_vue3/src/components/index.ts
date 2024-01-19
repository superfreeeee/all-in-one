import { defineAsyncComponent } from 'vue';

export const LazyComponent = defineAsyncComponent(() => {
  return new Promise((resolve) => setTimeout(resolve, 1000)).then(
    () => import('./LazyComponent.vue'),
  );
});
