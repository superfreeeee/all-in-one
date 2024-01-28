const asArray = <T>(value: T | T[]): T[] => (Array.isArray(value) ? value : [value]);

export const createGroupLog = (group?: string) => {
  let flushed = false;
  const messages: string[] = [];
  let queue: string[] = [];

  const nextMessage = () => {
    // restore last log
    if (queue.length > 0) {
      messages.push(queue.join('\n'));
    }

    // next log queue
    queue = [];
  };

  // 下一个 log
  const next = (msg?: string | string[]) => {
    if (flushed) {
      console.warn('group.next after flushed, try create another group');
      return;
    }

    nextMessage();

    if (msg !== undefined) {
      add(msg);
    }
  };

  // 当前 log 添加内容
  const add = (msg: string | string[] = '') => {
    if (flushed) {
      console.warn('group.add after flushed, try create another group');
      return;
    }

    queue.push(...asArray(msg));
  };

  // 输出
  const output = () => {
    if (flushed) {
      console.warn('group.output after flushed, try create another group');
      return;
    }

    nextMessage();
    flushed = true;

    console.group(group);

    messages.forEach((msg) => {
      console.log(msg);
    });

    console.groupEnd();
  };

  return {
    next,
    add,
    output,
  };
};

/**
 * console.group
 * @param cb
 * @param collapse
 */
export function logGroup(title: string, cb: () => void | Promise<void>, collapse = true): void {
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
