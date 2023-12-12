import { useEffect } from 'react';

/**
 * Invoke cb when Component mounted (useEffect with empty deps)
 * @param cb
 */
export const useMount = (cb: VoidFunction) => {
  useEffect(() => {
    cb();
  }, []);
};
