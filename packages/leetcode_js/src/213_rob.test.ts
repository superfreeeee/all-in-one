import { rob } from './213_rob';

type Fn = typeof rob;
type Params = Parameters<Fn>;
type Result = ReturnType<Fn>;

const tests: [...Params, Result, boolean][] = [
  [
    // paste unit test in demo here
    // args
    [2, 3, 2],

    3, // ans
    false, // only
  ],
  [
    // args
    [1, 2, 3, 1],

    4, // ans
    false, // only
  ],
  [
    // args
    [1, 2, 3],

    3, // ans
    false, // only
  ],
  [
    // args
    [0],

    0, // ans
    false, // only
  ],
];

tests.forEach((config, i) => {
  const args = config.slice(0, config.length - 2) as Params;
  const ans = config[config.length - 2];
  const only = config[config.length - 1];

  const testFn = only ? test.only : test;
  testFn(`test ${i + 1}`, () => {
    const res = rob(...args);
    expect(res).toEqual(ans);
  });
});
