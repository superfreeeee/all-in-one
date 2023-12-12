import { act, renderHook } from '@testing-library/react';

import { useBoolean } from './useBoolean';

describe('useBoolean tests', () => {
  test('basic test', () => {
    const { result } = renderHook(() => useBoolean());
    const current = () => result.current[0];

    expect(current()).toBe(false);
    act(() => result.current[1].setTrue());
    expect(current()).toBe(true);
    act(() => result.current[1].setFalse());
    expect(current()).toBe(false);
    act(() => result.current[1].toggle());
    expect(current()).toBe(true);
  });
});
