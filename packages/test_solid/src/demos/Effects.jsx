import { batch, createEffect, createSignal } from 'solid-js';

/**
 * 副作用 effects
 * @returns
 */
export const EffectsDemo = () => {
  const [count, setCount] = createSignal(0);
  const [count2, setCount2] = createSignal(10);

  /**
   * =============== 1. 普通 createEffect ===============
   * 普通副作用: 自动收集依赖
   * 类似 vue 的 watchEffect
   */
  createEffect(() => {
    console.log(`[EffectsDemo] 1. count = ${count()}`);
    console.log(`[EffectsDemo] 1. count2 = ${count2()}`);
  });

  /**
   * =============== 2. 嵌套 createEffect ==============
   * 外层 effect 触发会同时触发内层 effect
   * 同时内层 effect 也算是独立存在的 effect
   */
  createEffect(() => {
    console.log(`[EffectsDemo] 2. count = ${count()}`);
    createEffect(() => {
      console.log(`[EffectsDemo] 2. count2 = ${count2()}`);
    });
  });

  /**
   * =============== 3. 同步模式 ===============
   * setter 方法是同步更新的
   */
  const [base, setBase] = createSignal(0);
  const [double, setDouble] = createSignal(0);

  // 其他 effects 拿到的数据一定是同步的
  createEffect(() => {
    console.log(`[EffectsDemo] 3.1 double = ${double()}`);
  });

  createEffect(() => {
    // ! 如果在这里加上 double 依赖，第二个 effect 会执行两次
    // console.log(`[EffectsDemo] 3.2 double = ${double()}`);
    setDouble(base() * 2);
  });

  // 其他 effects 拿到的数据一定是同步的
  createEffect(() => {
    console.log(`[EffectsDemo] 3.3 double = ${double()}`);
  });

  /**
   * =============== 4. 异步模式 ===============
   * 使用 batch 批量更新 signal
   */
  const [syncA, setSyncA] = createSignal(0);
  const [syncB, setSyncB] = createSignal(0);

  createEffect(() => {
    console.log(`[EffectsDemo] 4. syncA = ${syncA()}, syncB = ${syncB()}`);
  });

  /**
   * updateIndividual 会触发上面的 effect#4 两次
   * 同步模式的原因，setter 会立即触发 effect
   */
  const updateIndividual = () => {
    setSyncA((prev) => prev + 1);
    setSyncB((prev) => prev + 1);
  };

  /**
   * updateBatch 只会触发上面的 effect#4 一次
   */
  const updateBatch = () => {
    batch(() => {
      updateIndividual();
    });
  };

  return (
    <div class="block">
      <h3>Effects</h3>
      <div>count: {count()}</div>
      <button onClick={() => setCount(count() + 1)}>increment</button>

      <div>count2: {count2()}</div>
      <button onClick={() => setCount2(count2() + 1)}>increment</button>

      <div>base: {base()}</div>
      <div>double: {double()}</div>
      <button onClick={() => setBase(base() + 1)}>increment</button>

      <div>syncA: {syncA()}</div>
      <div>syncB: {syncB()}</div>
      <button onClick={updateIndividual}>updateIndividual</button>
      <button onClick={updateBatch}>updateBatch</button>
    </div>
  );
};
