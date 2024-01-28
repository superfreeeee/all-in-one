import { watch, type Ref, type WatchOptions, type WatchStopHandle, onBeforeUnmount } from 'vue';

type WatchDeepCallback<T> = (
  value: T, //
  onCleanUp: (cleanUpFn: () => void) => void,
) => void;

/**
 * 深度监听 ref 指向深度对象
 *
 * @param target
 * @param cb
 * @param options
 * @returns
 */
export const watchDeep = <T extends object = any>(
  target: Ref<T>,
  cb: WatchDeepCallback<T>,
  options?: WatchOptions,
): WatchStopHandle => {
  let isFirst = true;

  // 深度监听 target 属性
  let unwatchReactive: VoidFunction | null;
  const watchReactive = () => {
    // 除了第一次监听，剩下的都要 immediate
    const immediate = isFirst ? options?.immediate : true;
    isFirst = false;

    return watch(
      target.value,
      (value, oldValue, onCleanUp) => {
        cb(value, onCleanUp);
      },
      {
        ...options,
        immediate,
      }, // watch 的同时直接触发
    );
  };

  /**
   * 这里算是同步创建的 watch
   */
  // 监听 target 引用改变
  const cleanRoot = watch(
    target,
    (value, oldValue, onCleanUp) => {
      // 重新深度监听
      unwatchReactive = watchReactive(); // 这里是异步创建的 watch，需要手动 unwatch

      onCleanUp(unwatchReactive);
    },
    {
      immediate: true, // 立即执行一次，也就是深度监听
    },
  );

  // 所有异步 watch 需要在 beforeUnmount 阶段清理
  onBeforeUnmount(() => {
    unwatchReactive?.();
  });

  // 主动 unwatch
  return () => {
    unwatchReactive?.();
    cleanRoot();
  };
};
