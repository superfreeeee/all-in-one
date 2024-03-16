import {
  children,
  createEffect,
  createMemo,
  createSignal,
  mergeProps,
  splitProps,
} from 'solid-js';

/**
 * 组件
 * @returns
 */
export const ComponentsDemo = () => {
  return (
    <div class="block">
      <h3>Components</h3>

      <ConditionalRender />
      <StylingDemo />
      <PropsHandling />
    </div>
  );
};

/**
 * 条件渲染 => 与 react 相似
 */
const ConditionalRender = () => {
  const [open, setOpen] = createSignal(false);

  const [count, setCount] = createSignal(0);

  return (
    <div class="block">
      <h5>ConditionalRender</h5>

      <div class="row">
        <span>open: {`${open()}`}</span>
        <button onClick={() => setOpen((prev) => !prev)}>toggle</button>
      </div>
      {open() ? (
        <div>
          Open Block
          {console.log('[ComponentsDemo.ConditionalRender] render Open Block')}
        </div>
      ) : (
        <div>
          Close Block
          {console.log('[ComponentsDemo.ConditionalRender] render Close Block')}
        </div>
      )}

      <div class="row">
        <span>count: {count()}</span>
        <button onClick={() => setCount((prev) => (prev + 1) % 4)}>next</button>
      </div>
      {count() > 1 ? (
        <div>
          count = 2 or 3
          {console.log('[ComponentsDemo.ConditionalRender] count big')}
        </div>
      ) : (
        <div>
          count = 0 or 1
          {console.log('[ComponentsDemo.ConditionalRender] count small')}
        </div>
      )}
    </div>
  );
};

/**
 * 样式渲染
 * @returns
 */
const StylingDemo = () => {
  return (
    <div class="block">
      <h5>StylingDemo</h5>

      {/* style 支持 string */}
      <div style="color: red">red text</div>
      {/* style 也支持 object */}
      <div style={{ color: 'red', 'font-size': '20px' }}>small red text</div>
      {/* class 只支持简单 string */}
      <div class="red samll">class text</div>
      {/* classList 只支持 object */}
      <div classList={{ red: false, small: true }}>classList text</div>
    </div>
  );
};

/**
 * props 处理
 * @returns
 */
const PropsHandling = () => {
  const [count, setCount] = createSignal(0);
  const item = createMemo(() => {
    return { count: count() };
  });

  createEffect(() => {
    console.log('[ComponentsDemo.PropsHandling] item', item());
  });

  return (
    <div class="block">
      <h5>PropsHandling</h5>

      <div>count: {count()}</div>
      <button onClick={() => setCount((prev) => prev + 1)}>increment</button>
      <MergeProps
        count={count}
        val={count()}
      />
      <SplitProps count={count()} />
      <PassingChildren>
        <div>count: {count()}</div>
      </PassingChildren>
    </div>
  );
};

/**
 * props 合并
 * @param {{ count: import('solid-js').Accessor<number>, val: number }} param0
 * @returns
 */
const MergeProps = (props) => {
  const { count, val } = props;

  const propsA = Object.assign({ shadowVal: 'hello' }, props);
  const propsB = mergeProps({ shadowVal: 'hello' }, props);

  createEffect(() => {
    console.log(`[ComponentsDemo.MergeProps] count = ${count()}`);
  });

  /**
   * 直接展开 props 的时候不会保留响应式
   */
  createEffect(() => {
    console.log(`[ComponentsDemo.MergeProps] val = ${val}`);
  });

  /**
   * props 为响应式对象
   */
  createEffect(() => {
    console.log(`[ComponentsDemo.MergeProps] props.val = ${props.val}`);
  });

  /**
   * mergeProps 的会继承响应式
   */
  createEffect(() => {
    console.log('[ComponentsDemo.MergeProps] propsB', propsB);
  });

  /**
   * Object.assign 不会继承 props 的响应式
   */
  createEffect(() => {
    console.log('[ComponentsDemo.MergeProps] propsA', propsA);
  });

  return null;
};

/**
 * props 解构
 * @param {{ count: number }} props
 * @returns
 */
const SplitProps = (props) => {
  const [countProps, restProps] = splitProps(props, ['count']);

  console.log('[ComponentsDemo.SplitProps] countProps', countProps);
  console.log('[ComponentsDemo.SplitProps] restProps', restProps);

  return null;
};

/**
 * children props
 * @param {*} props
 * @returns
 */
const PassingChildren = (props) => {
  const _children = children(() => props.children);

  const childrenEl = _children();

  return (
    <div>
      <h5>PassingChildren</h5>
      {/* 
        // ! 这里的心智有点重
        // ! _children() 渲染多次只有最后一次生效
        // ! 提前取出 childrenEl 也是只有第二次生效
      */}
      {childrenEl}
      <div>1</div>
      {childrenEl}
      {/* {_children()} */}
      {/* {_children()} */}
      {/* {_children()} */}
    </div>
  );
};
