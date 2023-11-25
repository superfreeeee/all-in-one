import { renderHook, act } from '@testing-library/react';
import { useRenderCount } from '../utils';
import { useForceUpdate } from './useForceUpdate';

describe('useForceUpdate tests', () => {
  test('basic test', () => {
    const { result } = renderHook(() => {
      const count = useRenderCount();
      const forceUpdate = useForceUpdate();
      return { count, forceUpdate };
    });

    expect(result.current.count).toBe(1);

    act(() => result.current.forceUpdate());
    expect(result.current.count).toBe(2);

    act(() => result.current.forceUpdate());
    act(() => result.current.forceUpdate());
    expect(result.current.count).toBe(4);
  });
});
