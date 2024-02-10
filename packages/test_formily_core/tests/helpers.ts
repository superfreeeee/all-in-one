import { expect, beforeEach } from 'vitest';

/**
 * 1-based step checker
 * @returns
 */
export const createStepChecker = () => {
  let currentStep = 1;
  let enableLog = true;

  function expectStep(step: number, info?: string) {
    expect(currentStep).toBe(step);
    currentStep += 1;
    enableLog && info && console.log(`${step}: ${info}`);
  }

  expectStep.reset = () => {
    currentStep = 1;
    enableLog = true;
  };

  expectStep.hide = () => {
    enableLog = false;
  };

  return expectStep;
};

/**
 * stepChecker + auto reset
 * @returns
 */
export const createGlobalStepChecker = () => {
  const expectStep = createStepChecker();

  // 重置 expectStep
  beforeEach(() => {
    expectStep.reset();
  });

  return expectStep;
};

/**
 * 使用 push 的方式记录
 */
export const createStepRecorder = () => {
  let steps: string[] = [];

  const record = (step: string) => steps.push(step);

  const show = () => {
    console.log('> steps', steps);
  };

  const _expect = (expected: string[]) => {
    expect(steps).toEqual(expected);
  };

  const reset = () => {
    steps = [];
  };

  return { record, show, expect: _expect, reset };
};

/**
 * scope 内共享的 recorder
 * @returns
 */
export const createSharedStepRecorder = () => {
  const recorder = createStepRecorder();

  // 重置 expectStep
  beforeEach(() => {
    recorder.reset();
  });

  return recorder;
};
