import { useRef } from 'react';

type noop = (this: any, ...args: any[]) => any;

type PickFunction<T extends noop> = (this: ThisParameterType<T>, ...args: Parameters<T>) => ReturnType<T>;

/**
 *
 * @param fn
 * @returns
 */
export const useEvent = <T extends noop>(fn: T) => {
  const fnRef = useRef<T>(fn);
  fnRef.current = fn;

  const persistFn = useRef<PickFunction<T>>();
  if (!persistFn.current) {
    persistFn.current = function (this, ...args) {
      return fnRef.current.apply(this, args);
    };
  }

  return persistFn.current;
};
