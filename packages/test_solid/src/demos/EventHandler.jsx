import { onMount } from 'solid-js';

/**
 * 事件处理
 * @returns
 */
export const EventHandler = () => {
  const nativeOnClick = (e) => {
    console.log('[EventHandler] nativeOnClick', e);
  };

  const delegatedOnClick = (e) => {
    console.log('[EventHandler] delegateOnClick', e);
  };

  const boundOnClick = (payload, e) => {
    console.log('[EventHandler] boundOnClick', e, { payload });
  };

  return (
    <div class="block">
      <h3>EventHandler</h3>
      {/* 原生事件 => 绑定在节点上，走 dom 树 */}
      <button on:click={nativeOnClick}>native event</button>
      {/* 代理事件 => 绑定在 document 上，走组件树 */}
      <button onClick={delegatedOnClick}>delegated event</button>

      {/* 绑定事件参数，看来只能绑一个，类似 redux 只有一个 payload */}
      <button onClick={[boundOnClick, { id: 1 }]}>binding event</button>

      <PropagationDifer />
      <InputEvent />
    </div>
  );
};

/**
 * 事件冒泡
 * @returns
 */
const PropagationDifer = () => {
  /** @type {import("solid-js").Ref<HTMLDivElement>} */
  let ref;

  onMount(() => {
    ref.addEventListener('click', (e) => {
      console.log('[EventHandler] click container native', e);
    });
  });

  /**
   * 代理事件 会同时被代理事件、原生事件的 stopPropagation 阻止
   * @param {*} e
   */
  const onClickContainer = (e) => {
    console.log('[EventHandler] click container delegated', e);
  };

  /**
   *
   * @param {PointerEvent} e
   */
  const onClickItem = (e) => {
    console.log('[EventHandler] click item', e);
    e.stopPropagation();
  };

  return (
    <div
      class="block"
      ref={ref}
      onClick={onClickContainer}
    >
      {/* 代理事件 没办法阻断原生事件 冒泡 */}
      <button onClick={onClickItem}>click item : delegated</button>
      <button on:click={onClickItem}>click item : native</button>
    </div>
  );
};

const InputEvent = () => {
  const onInput = (e) => {
    console.log('[EventHandler] onInput', e, e.target.value);
  };

  const onChange = (e) => {
    console.log('[EventHandler] onChange', e, e.target.value);
  };

  return (
    <input
      type="text"
      // 原生 input 事件是在输入过程触发
      on:input={onInput}
      // 原生 change 事件是在 unfocus 后触发
      on:change={onChange}
    />
  );
};
