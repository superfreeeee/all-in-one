import { renderHook } from '@testing-library/react';
import { useMount } from './useMount';

describe('useMount tests', () => {
  test('basic test', () => {
    let isMount = false;

    renderHook(() => {
      useMount(() => (isMount = true));
      expect(isMount).toBe(false);
    });

    expect(isMount).toBe(true);
  });
});
