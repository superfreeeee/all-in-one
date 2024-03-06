import { test } from 'vitest';

/**
 * 对象代理，理解 receiver 与 target 差异
 */
test('Proxy receiver', () => {
  const obj = { id: 1 };

  const objProxy = new Proxy(obj, {
    /**
     *
     * @param target 代理原目标对象
     * @param property
     * @param receiver 代理对象
     * @returns
     */
    get(target, property, receiver) {
      console.log({
        target,
        targetIsObj: target === obj,
        property,
        receiver,
        receiverIsProxy: receiver === objProxy,
        targetIsReceiver: target === receiver,
      });
      return Reflect.get(target, property, receiver);
    },
  });

  console.log(`id = ${objProxy.id}`);
});

/**
 * 尝试一下如果 get 方法里面使用 Reflect + receiver 与直接访问 target 的区别
 */
test('Proxy dont pass receiver in get', () => {
  const obj = {
    _id: 1,
    get id() {
      return this._id;
    },
  };

  /**
   * 使用 Relfect 的例子
   * proxy handler 能感知到 id 跟 _id
   */
  console.log('> Proxy with Reflect');
  const proxyA = new Proxy(obj, {
    get(target, prop, receiver) {
      console.log(`get ${prop.toString()}, target =`, target);
      return Reflect.get(target, prop, receiver);
    },
  });
  console.log(`id = ${proxyA.id}`);

  /**
   * 而不使用 Reflect 的时候
   * 就简单感知到 id
   * 而 id 的 getter 执行的时候，就与 proxy 无关了
   */
  console.log('> Proxy with target');
  const proxyB = new Proxy(obj, {
    get(target, prop, receiver) {
      console.log(`get ${prop.toString()}, target =`, target);
      return (target as any)[prop];
    },
  });
  console.log(`id = ${proxyB.id}`);
});

/**
 * 函数的代理
 */
test('Function Proxy', () => {
  const func = function (this: { id: number }, ...args: any[]) {
    console.log(`greet: id = ${this.id}`);
    return { res: 0 };
  };

  const funcProxy = new Proxy(func, {
    /**
     * 代理函数，函数调用时触发
     * @param target 代理目标函数
     * @param thisArg
     * @param args
     */
    apply(target, thisArg, args) {
      console.log({
        target,
        // 这里的 target 是代理函数，就没有 proxy 对象了
        targetIsFunc: target === func,
        thisArg,
        args,
      });
      console.log('applied!');
      return Reflect.apply(target, thisArg, args);
    },
  });

  console.log('res:', funcProxy.call({ id: 1 }, 1, 2, 3));
});
