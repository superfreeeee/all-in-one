import { useEffect } from 'react';

/**
 * Sync document.title
 * ignore input title when title === undefined
 * @param title
 */
export const useDocumentTitle = (title?: string) => {
  useEffect(() => {
    if (title === undefined) {
      return;
    }

    const originTitle = document.title;

    document.title = title;
    return () => {
      // recover title
      document.title = originTitle;
    };
  }, [title]);
};
