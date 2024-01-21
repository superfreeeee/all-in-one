import { searchRange } from './34_searchRange';

type Fn = typeof searchRange;
type Params = Parameters<Fn>;
type Result = ReturnType<Fn>;

const tests: [...Params, Result, boolean][] = [
  [
    // paste unit test in demo here
    // args
    [5, 7, 7, 8, 8, 10],
    8,

    [3, 4], // ans
    false, // only
  ],
  [
    // args
    [5, 7, 7, 8, 8, 10],
    6,

    [-1, -1], // ans
    false, // only
  ],
  [
    // args
    [],
    0,

    [-1, -1], // ans
    false, // only
  ],
  [
    // args
    [1],
    1,

    [0, 0], // ans
    false, // only
  ],
];

tests.forEach((config, i) => {
  const args = config.slice(0, config.length - 2) as Params;
  const ans = config[config.length - 2];
  const only = config[config.length - 1];

  const testFn = only ? test.only : test;
  testFn(`test ${i + 1}`, () => {
    const res = searchRange(...args);
    expect(res).toEqual(ans);
  });
});
