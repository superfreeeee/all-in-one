import { strStr } from './28_strStr';

const tests = [
  {
    haystack: 'sadbutsad',
    needle: 'sad',
    ans: 0,
    only: false,
  },
  {
    haystack: 'leetcode',
    needle: 'leeto',
    ans: -1,
  },
  {
    haystack: 'aaaac',
    needle: 'aac',
    ans: 2,
    // only: true,
    only: false,
  },
  {
    haystack: '',
    needle: 'abababcc',
    ans: -1,
    // only: true,
    only: false,
  },
  {
    haystack: 'aaabbaaabbaaabbab',
    needle: 'aaabbab',
    ans: 10,
    // only: true,
    only: false,
  },
  {
    haystack: 'abcdeabcdfabcdgabcdhabcdiabcdjabcdk',
    needle: 'abcdj',
    ans: 25,
  },
];

tests.forEach(({ haystack, needle, ans, only }, i) => {
  const testFn = only ? test.only : test;
  testFn(`test ${i + 1}`, () => {
    const res = strStr(haystack, needle);
    expect(res).toEqual(ans);
  });
});
