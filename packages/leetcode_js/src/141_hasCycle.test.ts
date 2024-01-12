import { ListNode, hasCycle } from './141_hasCycle';

type Fn = typeof hasCycle;
type Params = Parameters<Fn>;
type Result = ReturnType<Fn>;

const createList = (nums: number[], pos: number) => {
  const head = new ListNode();
  let cur = head;
  nums.forEach((num) => {
    cur = cur.next = new ListNode(num, null);
  });

  if (pos >= 0) {
    let target = head.next;
    while (pos-- > 0) {
      target = target!.next;
    }
    cur.next = target;
  }

  return head.next;
};

const tests: [...Params, Result, boolean][] = [
  [
    // paste unit test in demo here
    // args
    createList([3, 2, 0, -4], 1),

    true, // ans
    false, // only
  ],
  [
    // args
    createList([1, 2], 0),

    true, // ans
    false, // only
  ],
  [
    // args
    createList([1], -1),

    false, // ans
    false, // only
  ],
];

tests.forEach((config, i) => {
  const args = config.slice(0, config.length - 2) as Params;
  const ans = config[config.length - 2];
  const only = config[config.length - 1];

  const testFn = only ? test.only : test;
  testFn(`test ${i + 1}`, () => {
    const res = hasCycle(...args);
    expect(res).toEqual(ans);
  });
});
