import React, { useEffect } from 'react';
import { useEvent } from '../utils/useEvent';

type DomTarget = Node;

/**
 *
 * @param targetRef
 * @param cb
 */
export const useClickOutside = (targetRef: React.RefObject<DomTarget>, cb: (e: MouseEvent) => void) => {
  const cbRef = useEvent(cb);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (targetRef.current.contains(e.target as Element)) {
        cbRef(e);
      }
    };

    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('click', onClick);
    };
  }, [targetRef, cbRef]);
};
