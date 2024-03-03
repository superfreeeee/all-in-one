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

const arrowFunc = () => {};
