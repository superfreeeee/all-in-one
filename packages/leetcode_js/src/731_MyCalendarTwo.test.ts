import { MyCalendarTwo } from './731_MyCalendarTwo';

type Fn = typeof MyCalendarTwo;
// type Params = Parameters<Fn>;
type Params = [number, number][];
type Result = boolean[];

const tests: [...Params, Result, boolean][] = [
  [
    // paste unit test in demo here
    // args
    [10, 20],
    [50, 60],
    [10, 40],
    [5, 15],
    [5, 10],
    [25, 55],

    [true, true, true, false, true, true], // ans
    false, // only
  ],
];

tests.forEach((config, i) => {
  const args = config.slice(0, config.length - 2) as Params;
  const ans = config[config.length - 2];
  const only = config[config.length - 1];

  const testFn = only ? test.only : test;
  testFn(`test ${i + 1}`, () => {
    const calendar = new MyCalendarTwo();
    const res = args.map((arg) => calendar.book(arg[0], arg[1]));
    // const res = args.map((arg) => {
    //   const success = calendar.book(arg[0], arg[1]);
    //   console.log({ arg, success });
    //   return success;
    // });
    expect(res).toEqual(ans);
  });
});
