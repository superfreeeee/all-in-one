/**
 * Hook Test
 */
import { act, renderHook } from '@testing-library/react';
import { useEffect, useRef, useState } from 'react';

import { useStateRef } from './useStateRef';

interface NumsRecord {
  num1: number;
  num2: number;
}

describe('useStateRef tests', () => {
  test('basic test', () => {
    const { result } = renderHook(() => {
      /**
       * 原始状态
       */
      const [num, setNum] = useState(0);

      /**
       * ref 副本
       */
      const basicNumRef = useRef(num);
      useEffect(() => {
        basicNumRef.current = num;
      }, [num]);
      const closestNumRef = useStateRef(num);

      /**
       * 记录结果
       */
      const numsBeforeEffect = useRef<NumsRecord>();
      numsBeforeEffect.current = {
        num1: basicNumRef.current,
        num2: closestNumRef.current,
      };

      const numsAfterEffect = useRef<NumsRecord>();
      useEffect(() => {
        numsAfterEffect.current = {
          num1: basicNumRef.current,
          num2: closestNumRef.current,
        };
      });

      return {
        num,
        setNum,
        numsBeforeEffect,
        numsAfterEffect,
      };
    });

    (
      [
        { action: () => {}, res: [0, [0, 0], [0, 0]] },
        { action: () => result.current.setNum(1), res: [1, [0, 1], [1, 1]] },
        { action: () => result.current.setNum(2), res: [2, [1, 2], [2, 2]] },
      ] as Array<{
        action: VoidFunction;
        res: [
          currentNum: number,
          numsBefore: [num1Before: number, num2Before: number],
          numsAfter: [num1After: number, num2After: number],
        ];
      }>
    ).forEach(({ action, res }) => {
      act(() => action());

      expect(result.current.num).toBe(res[0]);
      expect(result.current.numsBeforeEffect.current).toEqual({
        num1: res[1][0],
        num2: res[1][1],
      });
      expect(result.current.numsAfterEffect.current).toEqual({
        num1: res[2][0],
        num2: res[2][1],
      });
    });
  });
});
