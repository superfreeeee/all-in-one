/**
 * callback 写法 与 Promise 写法调度测速
 */
import { test } from 'vitest';

type TestVars = { loop: number; delay: number };

const createTimer = ({ loop, delay }: TestVars) => {
  let _startTime = 0;

  return {
    start: () => (_startTime = performance.now()),
    done: () => {
      const _endTime = performance.now();
      console.log(
        [
          `loop           : ${loop.toExponential()}`,
          `delay per task : ${delay}ms`,
          `time           : ${_endTime - _startTime}ms`,
        ].join('\n'),
      );
    },
  };
};

const createTests = ({ loop, delay, index }: TestVars & { index: number }) => {
  const timer = createTimer({ loop, delay });

  /**
   * callback 写法测试
   */
  test(`callback test ${index}`, async () => {
    return new Promise<void>((resolve, reject) => {
      try {
        let count = 0;

        // 异步任务，使用 callback 同步通知外侧
        const asyncTask = (cb: VoidFunction) =>
          setTimeout(() => {
            count += 1;

            cb();
          }, delay);

        // benchmark
        timer.start();
        for (let i = 0; i < loop; i++) {
          asyncTask(() => {
            if (count === loop) {
              resolve();
              timer.done();
            }
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  });

  /**
   * Promise 写法测试
   */
  test(`promise test ${index}`, async () => {
    return new Promise<void>((resolve, reject) => {
      try {
        let count = 0;

        // 异步任务，使用 Promise 通知外侧结束时机点
        const asyncTask = () =>
          new Promise<void>((resolve) => {
            setTimeout(() => {
              count += 1;

              resolve();
            }, delay);
          });

        // benchmark
        timer.start();
        const tasks = [];
        for (let i = 0; i < loop; i++) {
          tasks.push(asyncTask());
        }
        Promise.all(tasks).then(() => {
          resolve();
          timer.done();
        });
      } catch (error) {
        reject(error);
      }
    });
  });
};

(
  [
    /**
     * 1. loop 变化 + delay 不变
     */
    // ====================
    // { loop: 100, delay: 0 },
    // { loop: 1000, delay: 0 },
    // { loop: 10000, delay: 0 },
    // { loop: 100000, delay: 0 },
    // { loop: 1000000, delay: 0 },
    // ====================
    // { loop: 1, delay: 100 },
    // { loop: 10, delay: 100 },
    // { loop: 100, delay: 100 },
    // { loop: 1000, delay: 100 },
    // { loop: 10000, delay: 100 },
    // ====================
    // { loop: 100000, delay: 100 },
    // { loop: 200000, delay: 100 },
    // { loop: 300000, delay: 100 },
    // { loop: 400000, delay: 100 },
    // ====================
    /**
     * 1w loop，跑 4 次
     * callback 耗时 12, 5, 7, 4ms
     * Promise  耗时 10, 10, 8, 5ms
     */
    // { loop: 10000, delay: 500 },
    // { loop: 10000, delay: 500 },
    // { loop: 10000, delay: 500 },
    // { loop: 10000, delay: 500 },
    // ====================
    /**
     * 3w loop，跑 4 次
     * callback 耗时 28, 6, 8, 5ms
     * Promise  耗时 19, 15, 12, 6ms
     */
    // { loop: 30000, delay: 500 },
    // { loop: 30000, delay: 500 },
    // { loop: 30000, delay: 500 },
    // { loop: 30000, delay: 500 },
    // ====================
    /**
     * 2. loop 不变 + delay 变化
     */
    // ====================
    // { loop: 1000, delay: 0 },
    // { loop: 1000, delay: 10 },
    // { loop: 1000, delay: 100 },
    // { loop: 1000, delay: 1000 },
    // ====================
    // 40w 次任务平均处理都落在 120-200ms 之间
    // { loop: 400000, delay: 100 },
    // { loop: 400000, delay: 200 },
    // { loop: 400000, delay: 300 },
    // { loop: 400000, delay: 400 },
  ] as TestVars[]
).forEach((item, index) => {
  createTests({ ...item, index });
});
