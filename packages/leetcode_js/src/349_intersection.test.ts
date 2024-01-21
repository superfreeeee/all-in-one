import { intersection } from './349_intersection';

type Fn = typeof intersection;
type Params = Parameters<Fn>;
type Result = ReturnType<Fn>;

const tests: [...Params, Result, boolean][] = [
  [
    // paste unit test in demo here
    // args
    [1, 2, 2, 1],
    [2, 2],

    [2], // ans
    false, // only
  ],
  [
    // args
    [4, 9, 5],
    [9, 4, 9, 8, 4],

    [9, 4], // ans
    false, // only
  ],
];

tests.forEach((config, i) => {
  const args = config.slice(0, config.length - 2) as Params;
  const ans = config[config.length - 2];
  const only = config[config.length - 1];

  const testFn = only ? test.only : test;
  testFn(`test ${i + 1}`, () => {
    const res = intersection(...args);
    expect(res).toEqual(ans);
  });
});
