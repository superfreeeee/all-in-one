import { renderHook } from '@testing-library/react';
import { useSingle } from './useSingle';

describe('useSingle tests', () => {
  test('basic test', () => {
    let i = 0;
    const createItem = () => {
      i += 1;
      return { id: i };
    };

    const { result, rerender } = renderHook(() => useSingle(createItem));
    const a = result.current;
    expect(a.id).toBe(1);

    rerender();

    const b = result.current;
    expect(a).toBe(b);
  });
});
