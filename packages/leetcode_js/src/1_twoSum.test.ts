import { twoSum } from './1_twoSum';

const tests = [
  {
    nums: [2, 7, 11, 15],
    target: 9,
    res: [0, 1],
  },
  {
    nums: [3, 2, 4],
    target: 6,
    res: [1, 2],
  },
  {
    nums: [3, 3],
    target: 6,
    res: [0, 1],
  },
];

tests.forEach(({ nums, target, res }, i) => {
  test(`test ${i + 1}`, () => {
    const actual = twoSum(nums, target);
    expect(actual).toEqual(res);
  });
});
