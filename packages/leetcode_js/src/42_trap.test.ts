import { trap } from './42_trap';

type Fn = typeof trap;
type Params = Parameters<Fn>;
type Result = ReturnType<Fn>;

const tests: [...Params, Result, boolean][] = [
  [
    // paste unit test in demo here
    // args
    [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],

    6, // ans
    false, // only
  ],
  [
    // args
    [4, 2, 0, 3, 2, 5],

    9, // ans
    false, // only
  ],
];

tests.forEach((config, i) => {
  const args = config.slice(0, config.length - 2) as Params;
  const ans = config[config.length - 2];
  const only = config[config.length - 1];

  const testFn = only ? test.only : test;
  testFn(`test ${i + 1}`, () => {
    const res = trap(...args);
    expect(res).toEqual(ans);
  });
});
