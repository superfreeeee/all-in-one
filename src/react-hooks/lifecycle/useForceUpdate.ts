import { useReducer } from 'react';

/**
 * Return force re-render method
 * @returns
 */
export const useForceUpdate = (): (() => void) => {
  const [, forceUpdate] = useReducer<any>(() => ({}), null);
  return forceUpdate;
};
