import { ListNode, addTwoNumbers } from './2_addTwoNumbers';

const tests = [
  {
    l1: [2, 4, 3],
    l2: [5, 6, 4],
    ans: [7, 0, 8],
  },
  {
    l1: [0],
    l2: [0],
    ans: [0],
  },
];

const createNode = (nums: number[]) => {
  let node = null;
  for (let i = nums.length - 1; i >= 0; i--) {
    node = new ListNode(nums[i], node);
  }
  return node;
};

const toArray = (node: ListNode) => {
  const res = [];
  while (node) {
    res.push(node.val);
    node = node.next;
  }
  return res;
};

tests.forEach(({ l1, l2, ans }, i) => {
  test(`test ${i + 1}`, () => {
    const actual = addTwoNumbers(createNode(l1), createNode(l2));
    expect(toArray(actual)).toEqual(ans);
  });
});
