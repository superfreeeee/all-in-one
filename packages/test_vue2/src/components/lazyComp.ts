// @ts-ignore
import MyLoading from './MyLoading.vue';

export const LazyComp = () => ({
  component: new Promise((resolve) => {
    // @ts-ignore
    const Comp = import('./LazyComp.vue');

    /**
     * ! 2s 后加载组件
     */
    setTimeout(() => {
      resolve(Comp);
    }, 2000);
  }),

  loading: MyLoading,

  /**
   * 加载状态处理
   * https://v2.cn.vuejs.org/v2/guide/components-dynamic-async.html#%E5%A4%84%E7%90%86%E5%8A%A0%E8%BD%BD%E7%8A%B6%E6%80%81
   *
   * delay 200ms 后进入 loading 态
   * 防止页面抖动
   */
  delay: 200,
});
