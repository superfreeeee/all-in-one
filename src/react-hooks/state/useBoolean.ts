import { useCallback, useState } from 'react';

/**
 * use bool state
 * @param initValue
 * @returns
 */
export const useBoolean = (initValue: boolean = false) => {
  const [state, setState] = useState(initValue);

  const setTrue = useCallback(() => {
    setState(true);
  }, []);

  const setFalse = useCallback(() => {
    setState(false);
  }, []);

  const toggle = useCallback(() => {
    setState(!state);
  }, [state]);

  return [state, { setTrue, setFalse, toggle }] as const;
};

export default useBoolean;
