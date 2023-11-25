import React, { useCallback, useState } from 'react';

interface UseInputUtils {
  setInput: React.Dispatch<React.SetStateAction<string>>;
  reset: VoidFunction;
}

/**
 * Hook for <input type="text">
 * @param initValue
 * @returns
 */
export const useInput = (
  initValue: string = '',
): [string, React.ChangeEventHandler<HTMLInputElement>, UseInputUtils] => {
  const [input, setInput] = useState(initValue);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }, []);

  const reset = useCallback(() => {
    setInput(initValue);
  }, [initValue]);

  return [input, onChange, { setInput, reset }];
};
