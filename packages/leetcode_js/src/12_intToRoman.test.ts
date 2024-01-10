import { intToRoman } from './12_intToRoman';

const tests = [
  {
    num: 3,
    ans: 'III',
  },
  {
    num: 4,
    ans: 'IV',
  },
  {
    num: 9,
    ans: 'IX',
  },
  {
    num: 58,
    ans: 'LVIII',
  },
  {
    num: 1994,
    ans: 'MCMXCIV',
  },
];

tests.forEach(({ num, ans }, i) => {
  test(`test ${i + 1}`, () => {
    const res = intToRoman(num);
    expect(res).toEqual(ans);
  });
});
