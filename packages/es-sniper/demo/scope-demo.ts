import * as utils from './utils';

const localVar = 0;

function localFunc(
  paramVar: number, //
  paramDefault: string = '',
  { objPatternProp, arr: [, arrItem] },
  { objPatternPropWithDefault = 0, ...objPatternPropRest } = {},
  [, arrPatternItem],
  [, arrPatternItemWithDefault = 1] = [],
  ...paramRest
): void {}

const arrowFunc = () => null;

if (true) {
  const x = 1;

  if (true) {
    if (true) {
      if (true) {
        if (true) {
          if (true) {
            if (true) {
              const a = 1;
            }
          }
        }
      }
    }
  }
}

function func1() {
  const x = 0;
  const y = 0;

  function func2() {
    const x1 = 0;
    const y1 = 0;

    function func3() {
      const x2 = x1 - x;
      const y2 = y1 - y;

      function func4() {}
    }
  }
}
