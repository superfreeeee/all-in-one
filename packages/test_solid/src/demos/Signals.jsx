import { createSignal } from 'solid-js';

/**
 * 基础状态 signal 使用 => createSignal
 * @returns
 */
export const SignalsDemo = () => {
  const [count, setCount] = createSignal(0);

  return (
    <div class="block">
      <h3>Signals</h3>
      {/* 访问状态 => getter */}
      <div>count: {count()}</div>
      {/* 更新状态 => setter */}
      <button onClick={() => setCount(count() + 1)}>increment</button>
      {/* 更新状态 => updater */}
      <button onClick={() => setCount((count) => count + 1)}>increment2</button>
    </div>
  );
};
