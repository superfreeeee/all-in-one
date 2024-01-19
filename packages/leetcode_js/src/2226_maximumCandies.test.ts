import { maximumCandies } from './2226_maximumCandies';

type Fn = typeof maximumCandies;
type Params = Parameters<Fn>;
type Result = ReturnType<Fn>;

const tests: [...Params, Result, boolean][] = [
  [
    // paste unit test in demo here
    // args
    [5, 8, 6],
    3,

    5, // ans
    false, // only
  ],
  [
    // args
    [2, 5],
    11,

    0, // ans
    false, // only
  ],
  [
    // args
    [9, 10, 1, 2, 10, 9, 9, 10, 2, 2],
    3,

    10, // ans
    false, // only
  ],
];

tests.forEach((config, i) => {
  const args = config.slice(0, config.length - 2) as Params;
  const ans = config[config.length - 2];
  const only = config[config.length - 1];

  const testFn = only ? test.only : test;
  testFn(`test ${i + 1}`, () => {
    const res = maximumCandies(...args);
    expect(res).toEqual(ans);
  });
});
