import { expect, beforeEach } from 'vitest';

/**
 * 1-based step checker
 * @returns
 */
export const createStepChecker = () => {
  let currentStep = 1;

  function expectStep(step: number) {
    expect(currentStep).toBe(step);
    currentStep += 1;
  }

  expectStep.reset = () => {
    currentStep = 1;
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
