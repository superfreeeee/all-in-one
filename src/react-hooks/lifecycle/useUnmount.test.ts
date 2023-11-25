import { renderHook } from '@testing-library/react';
import { useUnmount } from './useUnmount';

describe('useUnmount tests', () => {
  test('basic test', () => {
    let isUnmount = false;
    const { rerender, unmount } = renderHook(() => useUnmount(() => (isUnmount = true)));

    expect(isUnmount).toBe(false);
    rerender();
    expect(isUnmount).toBe(false);
    rerender();
    expect(isUnmount).toBe(false);
    unmount();
    expect(isUnmount).toBe(true);
  });
});
