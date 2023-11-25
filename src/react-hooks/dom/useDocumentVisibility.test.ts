import { renderHook } from '@testing-library/react';
import { useDocumentVisibility } from './useDocumentVisibility';

describe('useDocumentVisibility tests', () => {
  test('basic test', () => {
    const { result } = renderHook(() => useDocumentVisibility());
    expect(result.current).toBe('visible');
    document.dispatchEvent(new Event('visibilitychange', { data: 'hidden' } as any));
    // TODO how to change visibilityState in jsdom still unknown
    expect(result.current).toBe('visible');
  });
});
