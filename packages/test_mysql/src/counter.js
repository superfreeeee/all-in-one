const { createConnectionPool, withServices } = require('./services/connection');

const TASK_LEN = 100;

const timer = {
  _startTime: null,
  start() {
    this._startTime = Date.now();
  },
  done() {
    console.log(`> time = ${Date.now() - this._startTime}ms`);
  },
};

const main = async () => {
  const pool = createConnectionPool();

  /**
   * 0. 重置 num
   */
  await withServices(pool, async ({ updateCounter, getCounter }) => {
    await updateCounter(1, 0);
    console.log('> 0. item:', await getCounter(1));
  });

  /**
   * 实验 1
   * 先 select 然后 update + 没有使用事务
   */
  timer.start();
  await Promise.all(
    Array.from({ length: TASK_LEN }).map(async () => {
      await withServices(pool, async ({ queryAndIncrementCounter }) => {
        await queryAndIncrementCounter(1);
      });
    }),
  );
  // await withServices(pool, async ({ getCounter, queryAndIncrementCounter }) => {
  //   await Promise.all(Array.from({ length: 100 }).map(() => queryAndIncrementCounter(1)));
  //   console.log('> 1. item:', await getCounter(1));
  // });

  await withServices(pool, async ({ getCounter }) => {
    console.log('> 1. item:', await getCounter(1));
  });
  timer.done();

  /**
   * 实验 2
   * update 语句原子化操作
   */
  timer.start();
  await withServices(pool, async ({ getCounter, incrementCounterAtomic }) => {
    await Promise.all(Array.from({ length: TASK_LEN }).map(() => incrementCounterAtomic(1)));
    console.log('> 2. item:', await getCounter(1));
  });
  timer.done();

  /**
   * 实验 3
   * 先 select 然后 update + 使用事务
   * ! 这里需要保证，每个事务使用单独的 connection
   */
  timer.start();
  await Promise.all(
    Array.from({ length: TASK_LEN }).map(async () => {
      await withServices(pool, async ({ queryAndIncrementCounterWithTransaction }) => {
        await queryAndIncrementCounterWithTransaction(1);
      });
    }),
  );

  await withServices(pool, async ({ getCounter }) => {
    console.log('> 3. item:', await getCounter(1));
  });
  timer.done();

  pool.end();
};

main();
