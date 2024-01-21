import { search } from './33_search';

type Fn = typeof search;
type Params = Parameters<Fn>;
type Result = ReturnType<Fn>;

const tests: [...Params, Result, boolean][] = [
  [
    // paste unit test in demo here
    // args
    [4, 5, 6, 7, 0, 1, 2],
    0,

    4, // ans
    false, // only
  ],
  [
    // args
    [4, 5, 6, 7, 0, 1, 2],
    3,

    -1, // ans
    false, // only
  ],
  [
    // args
    [1],
    0,

    -1, // ans
    false, // only
  ],
  [
    // args
    [1, 3],
    1,

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
    const res = search(...args);
    expect(res).toEqual(ans);
  });
});
