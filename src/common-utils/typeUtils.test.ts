import { asArray } from './typeUtils';

describe('asArray tests', () => {
  test('primitive', () => {
    expect(asArray(undefined)).toEqual(undefined);
    expect(asArray(null)).toEqual([null]);
    expect(asArray(1)).toEqual([1]);
    expect(asArray('1')).toEqual(['1']);
    expect(asArray(true)).toEqual([true]);
    expect(asArray({ id: 1 })).toEqual([{ id: 1 }]);
  });

  test('array', () => {
    const arr = [1, 2, 3];
    expect(asArray(arr)).toBe(arr);
  });
});
