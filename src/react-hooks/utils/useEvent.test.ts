import { useState } from 'react';
import { act, renderHook } from '@testing-library/react';
import { useEvent } from './useEvent';

describe('useEvent tests', () => {
  test('basic test', () => {
    const { result } = renderHook(() => {
      const [num, setNum] = useState(0);
      const getNum = useEvent(() => num);
      return { num, setNum, getNum };
    });

    const { getNum } = result.current;

    expect(result.current.num).toBe(0);

    act(() => result.current.setNum(1));
    expect(result.current.num).toBe(1);
    expect(getNum()).toBe(1);
  });
});
