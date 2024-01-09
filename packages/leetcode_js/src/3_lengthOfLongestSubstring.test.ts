import { lengthOfLongestSubstring } from './3_lengthOfLongestSubstring';

const tests = [
  {
    s: 'abcabcbb',
    ans: 3,
  },
  {
    s: 'bbbbb',
    ans: 1,
  },
  {
    s: 'pwwkew',
    ans: 3,
  },
];

tests.forEach(({ s, ans }, i) => {
  test(`test ${i + 1}`, () => {
    const res = lengthOfLongestSubstring(s);
    expect(res).toEqual(ans);
  });
});
