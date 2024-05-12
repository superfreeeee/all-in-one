/**
 * Create a Promise waiting for ${delay} to resolve
 * @param delay ms
 * @returns
 */
export function sleep(delay: number): Promise<void> {
  return new Promise<void>((resolve) => setTimeout(resolve, delay));
}
