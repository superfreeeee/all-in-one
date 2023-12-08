/**
 * Create array if given object is not an array
 * @param items
 * @returns
 */
export function asArray<T>(items: undefined): undefined;
export function asArray<T>(items: T): T[];
export function asArray<T>(items: T[]): T[];
export function asArray<T>(items: T | T[] | undefined): T[] | undefined {
  if (items === undefined) {
    return undefined;
  }
  return Array.isArray(items) ? items : [items];
}
