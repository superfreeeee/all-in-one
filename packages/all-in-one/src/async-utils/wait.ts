/**
 * Create a Promise waiting for ${delay} to resolve
 * @param delay resolve in delay ms
 * @returns
 */
export const wait = (delay: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
