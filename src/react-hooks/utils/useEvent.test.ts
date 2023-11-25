import { useState } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { useEvent } from './useEvent';

describe('useEvent tests', () => {
  test('basic test', async () => {
    const { result } = renderHook(() => {
      const [num, setNum] = useState(0);
      const getNum = useEvent(() => num);
      return { num, setNum, getNum };
    });

    const { getNum } = result.current;

    expect(result.current.num).toBe(0);
    await waitFor(() => {
      result.current.setNum(1);
      expect(result.current.num).toBe(1);
      expect(getNum()).toBe(1);
    });
  });
});
