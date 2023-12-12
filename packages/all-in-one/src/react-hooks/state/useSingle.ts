import { useRef } from 'react';

/**
 * Use singleton instance
 *
 * @example
 * ```ts
 * const Component = () => {
 *   const singletonItem = useSingle(createItem);
 * };
 * ```
 *
 * @param factory create instance
 * @returns
 */
export const useSingle = <T>(factory: () => T): T => {
  const instanceRef = useRef<T>();
  if (!instanceRef.current) {
    instanceRef.current = factory();
  }
  return instanceRef.current;
};
