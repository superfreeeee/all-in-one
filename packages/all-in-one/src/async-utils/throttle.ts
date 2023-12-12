/**
 * throttle function
 * @param fn
 * @param delay
 * @returns
 */
export const throttle = (fn: Function, delay: number) => {
  let lock = false;

  return (...args: any[]) => {
    if (lock) {
      return;
    }
    lock = true;
    setTimeout(() => {
      fn(...args);
      lock = false;
    }, delay);
  };
};
