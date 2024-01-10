import { longestCommonPrefix } from './14_longestCommonPrefix';

const tests = [
  {
    strs: ['flower', 'flow', 'flight'],
    ans: 'fl',
  },
  {
    strs: ['dog', 'racecar', 'car'],
    ans: '',
  },
];

tests.forEach(({ strs, ans }, i) => {
  test(`test ${i + 1}`, () => {
    const res = longestCommonPrefix(strs);
    expect(res).toEqual(ans);
  });
});
