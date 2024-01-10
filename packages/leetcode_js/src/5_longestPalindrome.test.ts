import { longestPalindrome } from './5_longestPalindrome';

const tests = [
  {
    s: 'babad',
    ans: 'bab',
  },
  {
    s: 'cbbd',
    ans: 'bb',
  },
  {
    s: 'abcbcbcba',
    ans: 'abcbcbcba',
  },
];

tests.forEach(({ s, ans }, i) => {
  test(`test ${i + 1}`, () => {
    const res = longestPalindrome(s);
    expect(res).toEqual(ans);
  });
});
