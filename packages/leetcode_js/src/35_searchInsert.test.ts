import { searchInsert } from './35_searchInsert';

type Fn = typeof searchInsert;
type Params = Parameters<Fn>;
type Result = ReturnType<Fn>;

const tests: [...Params, Result, boolean][] = [
  [
    // paste unit test in demo here
    // args
    [1, 3, 5, 6],
    5,

    2, // ans
    false, // only
  ],
  [
    // args
    [1, 3, 5, 6],
    2,

    1, // ans
    false, // only
  ],
  [
    // args
    [1, 3, 5, 6],
    7,

    4, // ans
    false, // only
  ],
];

tests.forEach((config, i) => {
  const args = config.slice(0, config.length - 2) as Params;
  const ans = config[config.length - 2];
  const only = config[config.length - 1];

  const testFn = only ? test.only : test;
  testFn(`test ${i + 1}`, () => {
    const res = searchInsert(...args);
    expect(res).toEqual(ans);
  });
});
