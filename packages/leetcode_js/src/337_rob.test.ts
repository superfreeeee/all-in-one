import { TreeNode, rob } from './337_rob';

type Fn = typeof rob;
type Params = Parameters<Fn>;
type Result = ReturnType<Fn>;

const createTree = (nums: (number | null)[]) => {
  let n = nums.length;
  if (n === 0 || !nums[0]) {
    return null;
  }

  const root = new TreeNode(nums[0]);
  const queue = [root];
  let i = 1;
  let nextVal: number | null;
  while (i < n && queue.length > 0) {
    const next = queue.shift() as TreeNode;

    nextVal = nums[i++];
    if (nextVal) {
      next.left = new TreeNode(nextVal);
      queue.push(next.left);
    }

    if (i >= n) break;
    nextVal = nums[i++];
    if (nextVal) {
      next.right = new TreeNode(nextVal);
      queue.push(next.right);
    }
  }
  return root;
};

const tests: [...Params, Result, boolean][] = [
  [
    // paste unit test in demo here
    // args
    createTree([3, 2, 3, null, 3, null, 1]),

    7, // ans
    false, // only
  ],
  [
    // args
    createTree([3, 4, 5, 1, 3, null, 1]),

    9, // ans
    false, // only
  ],
];

tests.forEach((config, i) => {
  const args = config.slice(0, config.length - 2) as Params;
  const ans = config[config.length - 2];
  const only = config[config.length - 1];

  const testFn = only ? test.only : test;
  testFn(`test ${i + 1}`, () => {
    const res = rob(...args);
    expect(res).toEqual(ans);
  });
});
