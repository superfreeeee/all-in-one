import { useRef } from 'react';

/**
 * Count render times
 * @returns
 */
export const useRenderCount = (): number => {
  const countRef = useRef(0);
  countRef.current += 1;
  return countRef.current;
};
