/**
 * console.group
 * @param cb
 * @param collapse
 */
export function logGroup(
  title: string,
  cb: () => void | Promise<void>,
  collapse = true,
): void {
  console[collapse ? 'groupCollapsed' : 'group'](title);

  const p = cb();
  if (p) {
    p.finally(() => {
      console.groupEnd();
    });
  } else {
    console.groupEnd();
  }
}
