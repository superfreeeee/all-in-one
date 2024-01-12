import { removeDuplicates } from './80_removeDuplicates';

type Fn = typeof removeDuplicates;
type Params = Parameters<Fn>;
type Result = ReturnType<Fn>;

const tests: [...Params, [Result, number[]], boolean][] = [
  [
    // paste unit test in demo here
    // args
    [1, 1, 1, 2, 2, 3],

    [5, [1, 1, 2, 2, 3]], // ans
    false, // only
  ],
  [
    // args
    [0, 0, 1, 1, 1, 1, 2, 3, 3],

    [7, [0, 0, 1, 1, 2, 3, 3]], // ans
    false, // only
  ],
];

tests.forEach((config, i) => {
  const args = config.slice(0, config.length - 2) as Params;
  const ans = config[config.length - 2] as [Result, number[]];
  const only = config[config.length - 1];

  const testFn = only ? test.only : test;
  testFn(`test ${i + 1}`, () => {
    const res = removeDuplicates(...args);
    expect(res).toEqual(ans[0]);
    expect(args[0].slice(0, res)).toEqual(ans[1]);
  });
});
