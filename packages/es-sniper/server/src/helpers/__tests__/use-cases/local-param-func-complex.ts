export {};

function localFunc(
  paramVar: number, //
  paramDefault: string = '',
  { objPatternProp, arr: [, arrItem] },
  { objPatternPropWithDefault = 0, ...objPatternPropRest } = {},
  [, arrPatternItem],
  [, arrPatternItemWithDefault = 1] = [],
  ...paramRest
): void {}
