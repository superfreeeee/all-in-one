import { removeDuplicates } from './26_removeDuplicates';

type Fn = typeof removeDuplicates;
type Params = Parameters<Fn>;
type Result = ReturnType<Fn>;

const tests: [...Params, Result, boolean][] = [
  [
    // paste unit test in demo here
    // args
    [1, 1, 2],

    2, // ans
    false, // only
  ],
  [
    // args
    [0, 0, 1, 1, 1, 2, 2, 3, 3, 4],

    5, // ans
    false, // only
  ],
];

tests.forEach((config, i) => {
  const args = config.slice(0, config.length - 2) as Params;
  const ans = config[config.length - 2];
  const only = config[config.length - 1];

  const testFn = only ? test.only : test;
  testFn(`test ${i + 1}`, () => {
    const res = removeDuplicates(...args);
    expect(res).toEqual(ans);
  });
});
