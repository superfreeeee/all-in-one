/**
 * Create a Promise waiting for ${delay} to resolve
 * @param delay ms
 * @returns
 */
export const sleep = (delay: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
