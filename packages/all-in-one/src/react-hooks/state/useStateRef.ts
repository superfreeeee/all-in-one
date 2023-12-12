import { useRef } from 'react';

/**
 * Create MutableRefObject for given react state
 * @param state
 * @returns
 */
export const useStateRef = <T>(state: T): React.MutableRefObject<T> => {
  const stateRef = useRef<T>(state);
  stateRef.current = state;
  return stateRef;
};
