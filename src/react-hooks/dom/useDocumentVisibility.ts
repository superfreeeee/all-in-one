import { useEffect, useState } from 'react';

const getVisibility = () => document.visibilityState;

/**
 * Sync document.visibilityState
 * @returns
 */
export const useDocumentVisibility = (): DocumentVisibilityState => {
  const [visibility, setVisibility] = useState(getVisibility);

  useEffect(() => {
    const onVisibilityChange = () => {
      setVisibility(getVisibility());
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return visibility;
};
