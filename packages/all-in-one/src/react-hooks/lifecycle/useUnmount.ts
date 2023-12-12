import { useEffect } from 'react';

/**
 * Invoke cb when Component unmount (useEffect with empty deps)
 * @param cb
 */
export const useUnmount = (cb: VoidFunction) => {
  useEffect(() => () => cb(), []);
};
