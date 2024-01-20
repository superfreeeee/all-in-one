import { mySqrt } from './69_mySqrt';

type Fn = typeof mySqrt;
type Params = Parameters<Fn>;
type Result = ReturnType<Fn>;

const tests: [...Params, Result, boolean][] = [
  [
    // paste unit test in demo here
    // args
    4,

    2, // ans
    false, // only
  ],
  [
    // args
    8,

    2, // ans
    false, // only
  ],
  [
    // args
    3,

    1, // ans
    false, // only
  ],
];

tests.forEach((config, i) => {
  const args = config.slice(0, config.length - 2) as Params;
  const ans = config[config.length - 2];
  const only = config[config.length - 1];

  const testFn = only ? test.only : test;
  testFn(`test ${i + 1}`, () => {
    const res = mySqrt(...args);
    expect(res).toEqual(ans);
  });
});
