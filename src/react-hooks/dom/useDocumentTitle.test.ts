import { useState } from 'react';
import { act, renderHook } from '@testing-library/react';
import { useDocumentTitle } from './useDocumentTitle';

describe('useDocumentTitle tests', () => {
  test('basic test', () => {
    const initTitle = (document.title = '__init_title');

    const { result, unmount } = renderHook(() => {
      const [title, setTitle] = useState<string | undefined>();
      useDocumentTitle(title);
      return setTitle;
    });

    expect(document.title).toBe(initTitle);

    act(() => result.current('a'));
    expect(document.title).toBe('a');

    act(() => result.current('b'));
    expect(document.title).toBe('b');

    unmount();
    expect(document.title).toBe(initTitle);
  });

  test('no middle state test', () => {
    const { result } = renderHook(() => {
      const [title, setTitle] = useState<string | undefined>();
      useDocumentTitle(title);
      return setTitle;
    });

    const initTitle = (document.title = '__init_title');
    let currentTitle = initTitle;
    const setTitle = (title: string) => {
      result.current(title);
      currentTitle = title;
    };

    const observer = new MutationObserver((mutationList) => {
      mutationList.forEach((mutation) => {
        expect(mutation.target.textContent).toBe(currentTitle);
      });
    });

    const title = document.head.querySelector('title');
    observer.observe(title, { characterData: true, subtree: true, childList: true });

    act(() => setTitle('a'));

    observer.disconnect();
  });
});
