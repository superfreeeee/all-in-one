/**
 * short cut for console.group
 * @param cb
 * @param collapse
 */
export function logGroup(
  title: string,
  cb: () => void | Promise<void>,
  collapse = false, // expand on first develop
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
