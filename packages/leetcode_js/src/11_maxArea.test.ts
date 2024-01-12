import { maxArea } from './11_maxArea';

const tests = [
  {
    height: [1, 8, 6, 2, 5, 4, 8, 3, 7],
    ans: 49,
    only: false,
  },
  {
    height: [1, 1],
    ans: 1,
    only: false,
  },
];

tests.forEach(({ height, ans, only }, i) => {
  const testFn = only ? test.only : test;
  testFn(`test ${i + 1}`, () => {
    const res = maxArea(height);
    expect(res).toEqual(ans);
  });
});
