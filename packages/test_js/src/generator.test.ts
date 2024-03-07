import { test } from 'vitest';

function* range(start: number, end: number) {
  for (let i = start; i < end; i++) {
    yield i;
  }
}

/**
 * generator 作为迭代器被 for-of 消费
 */
test('mock array iterator', () => {
  for (const num of range(1, 5)) {
    console.log({ num });
  }
});

/**
 * Runner 自动执行 generator
 */
test('generator runner', () => {
  const runner = (g: Generator<number, void>) => {
    let res = g.next(); // first yield

    while (!res.done) {
      // log none done res
      console.log(res);
      res = g.next(res.value);
    }
  };

  runner(range(1, 5));
});

/**
 * 异步 generator
 */
test('async generator', async () => {
  async function* syncTask(callback: (res: any) => void) {
    type Task = () => Promise<any>;
    const tasks: Task[] = [];

    let isRunning = false;
    const syncRunner = async () => {
      if (isRunning) {
        return;
      }
      isRunning = true;

      let nextTask: Task | undefined;
      while ((nextTask = tasks.shift())) {
        const res = await nextTask();
        callback(res);
      }

      isRunning = false;
    };

    while (true) {
      // @ts-ignore
      const task: Task = yield;
      console.log('task', task);
      tasks.push(task);
      syncRunner();
    }
  }

  let startTime = performance.now();
  const getTime = () => performance.now() - startTime;
  const taskRunner = syncTask((res) => {
    console.log('res:', res, getTime());
  });

  const delay = (res: any, timeout: number) =>
    new Promise<any>((resolve) => setTimeout(() => resolve(res), timeout));

  taskRunner.next();
  taskRunner.next(async () => delay(1, 200));
  taskRunner.next(async () => delay(2, 100));
  taskRunner.next(async () => delay(3, 50));

  await new Promise((resolve) => setTimeout(resolve, 1000));
});
