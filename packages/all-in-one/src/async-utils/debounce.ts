/**
 * debounce function
 * @param fn
 * @param delay
 * @returns
 */
export const debounce = (fn: Function, delay: number) => {
  let timer: number | undefined;

  return (...args: any[]) => {
    clearTimeout(timer);
    timer = (setTimeout as Window['setTimeout'])(() => {
      fn(...args);
    }, delay);
  };
};
