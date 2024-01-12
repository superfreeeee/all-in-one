import { isPalindrome } from './125_isPalindrome';

type Fn = typeof isPalindrome;
type Params = Parameters<Fn>;
type Result = ReturnType<Fn>;

const tests: [...Params, Result, boolean][] = [
  [
    // paste unit test in demo here
    // args
    'A man, a plan, a canal: Panama',

    true, // ans
    false, // only
  ],
  [
    // args
    'race a car',

    false, // ans
    false, // only
  ],
];

tests.forEach((config, i) => {
  const args = config.slice(0, config.length - 2) as Params;
  const ans = config[config.length - 2];
  const only = config[config.length - 1];

  const testFn = only ? test.only : test;
  testFn(`test ${i + 1}`, () => {
    const res = isPalindrome(...args);
    expect(res).toEqual(ans);
  });
});
