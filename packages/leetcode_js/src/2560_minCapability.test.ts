import { minCapability } from './2560_minCapability';

type Fn = typeof minCapability;
type Params = Parameters<Fn>;
type Result = ReturnType<Fn>;

const tests: [...Params, Result, boolean][] = [
  [
    // paste unit test in demo here
    // args
    [2, 3, 5, 9],
    2,

    5, // ans
    false, // only
  ],
  [
    // args
    [2, 7, 9, 3, 1],
    2,

    2, // ans
    false, // only
  ],
  [
    // args
    [
      5038, 3053, 2825, 3638, 4648, 3259, 4948, 4248, 4940, 2834, 109, 5224,
      5097, 4708, 2162, 3438, 4152, 4134, 551, 3961, 2294, 3961, 1327, 2395,
      1002, 763, 4296, 3147, 5069, 2156, 572, 1261, 4272, 4158, 5186, 2543,
      5055, 4735, 2325, 1206, 1019, 1257, 5048, 1563, 3507, 4269, 5328, 173,
      5007, 2392, 967, 2768, 86, 3401, 3667, 4406, 4487, 876, 1530, 819, 1320,
      883, 1101, 5317, 2305, 89, 788, 1603, 3456, 5221, 1910, 3343, 4597,
    ],
    28,

    4134, // ans
    false, // only
  ],
];

tests.forEach((config, i) => {
  const args = config.slice(0, config.length - 2) as Params;
  const ans = config[config.length - 2];
  const only = config[config.length - 1];

  const testFn = only ? test.only : test;
  testFn(`test ${i + 1}`, () => {
    const res = minCapability(...args);
    expect(res).toEqual(ans);
  });
});
