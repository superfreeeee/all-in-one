import { Stack } from './Stack';

describe('Stack tests', () => {
  test('mvp test', () => {
    const stack = new Stack<number>();

    expect(stack.size()).toBe(0);
    expect(stack.pop()).toBeUndefined();

    expect(stack.push(1)).toBe(1);
    expect(stack.push(2)).toBe(2);
    expect(stack.push(3)).toBe(3);

    expect(stack.pop()).toBe(3);
    expect(stack.pop()).toBe(2);
    expect(stack.pop()).toBe(1);
    expect(stack.pop()).toBeUndefined();
  });
});
