import { act, renderHook } from '@testing-library/react';
import { useHashMutex } from './useHashMutex';
import { useForceUpdate } from '../react-hooks';

describe('useHashMutex tests', () => {
  test('basic test', () => {
    const { result } = renderHook(() => {
      const mutex = useHashMutex();
      const forceUpdate = useForceUpdate();
      return { mutex, forceUpdate };
    });

    const mutex1 = result.current.mutex;
    // test singleton after re-render
    act(() => result.current.forceUpdate());
    expect(result.current.mutex).toBe(mutex1);

    const mutex2 = result.current.mutex;
    const isExpired1 = mutex1.next();
    const isExpired2 = mutex2.next();

    expect(isExpired1()).toBe(true);
    expect(isExpired2()).toBe(false);
  });
});
