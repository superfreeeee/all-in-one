import { MyCalendar } from './729_MyCalendar';

type Fn = typeof MyCalendar;
// type Params = Parameters<Fn>;
type Params = [number, number][];
type Result = boolean[];

const tests: [...Params, Result, boolean][] = [
  [
    // paste unit test in demo here
    // args
    [10, 20],
    [15, 25],
    [20, 30],

    [true, false, true], // ans
    false, // only
  ],
  [
    // paste unit test in demo here
    // args
    [97, 100],
    [33, 51],
    [89, 100],
    [83, 100],
    [75, 92],
    [76, 95],
    [19, 30],
    [53, 63],
    [8, 23],
    [18, 37],
    [87, 100],
    [83, 100],
    [54, 67],
    [35, 48],
    [58, 75],
    [70, 89],
    [13, 32],
    [44, 63],
    [51, 62],
    [2, 15],

    [
      true,
      true,
      false,
      false,
      true,
      false,
      true,
      true,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      true,
    ], // ans
    false, // only
  ],
];

tests.forEach((config, i) => {
  const args = config.slice(0, config.length - 2) as Params;
  const ans = config[config.length - 2];
  const only = config[config.length - 1];

  const testFn = only ? test.only : test;
  testFn(`test ${i + 1}`, () => {
    const calendar = new MyCalendar();
    const res = args.map((arg) => calendar.book(arg[0], arg[1]));
    // const res = args.map((arg) => {
    //   const success = calendar.book(arg[0], arg[1]);
    //   console.log({ arg, success });
    //   return success;
    // });
    expect(res).toEqual(ans);
  });
});
