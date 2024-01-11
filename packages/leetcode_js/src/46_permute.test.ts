import { permute } from './46_permute';

const tests = [
  {
    nums: [1, 2, 3],
    ans: [
      [1, 2, 3],
      [1, 3, 2],
      [2, 1, 3],
      [2, 3, 1],
      [3, 1, 2],
      [3, 2, 1],
    ],
    only: false,
    // only: true,
  },
  {
    nums: [0, 1],
    ans: [
      [0, 1],
      [1, 0],
    ],
    only: false,
  },
  {
    nums: [1],
    ans: [[1]],
    only: false,
  },
];

const ansToSet = (ans: number[][]) => {
  return new Set(ans.map((arr) => arr.join('_')));
};

const compare = (ans1: number[][], ans2: number[][]) => {
  const set1 = ansToSet(ans1);
  const set2 = ansToSet(ans2);
  if (set1.size !== set2.size) {
    return false;
  }
  for (const s of set1) {
    if (set2.has(s)) {
      set2.delete(s);
    } else {
      return false;
    }
  }
  return set2.size === 0;
};

tests.forEach(({ nums, ans, only }, i) => {
  const testFn = only ? test.only : test;
  testFn(`test ${i + 1}`, () => {
    const res = permute(nums);

    const isEqual = compare(res, ans);
    if (!isEqual) {
      console.log({ res, ans });
    }
    expect(isEqual).toBe(true);
  });
});
