import { useSingle } from '../react-hooks';
import { HashMutex } from './HashMutex';

/**
 * Hook version for HashMutex creation
 * @returns
 */
export const useHashMutex = () => {
  return useSingle(() => new HashMutex());
};
