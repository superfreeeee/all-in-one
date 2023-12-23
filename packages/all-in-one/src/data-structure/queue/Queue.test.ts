import { Queue } from './Queue';

describe('Queue tests', () => {
  test('mvp test', () => {
    const queue = new Queue<number>();

    expect(queue.size()).toBe(0);
    expect(queue.dequeue()).toBeUndefined();

    expect(queue.enqueue(1)).toBe(1);
    expect(queue.enqueue(2)).toBe(2);
    expect(queue.enqueue(3)).toBe(3);

    expect(queue.dequeue()).toBe(1);
    expect(queue.dequeue()).toBe(2);
    expect(queue.dequeue()).toBe(3);
    expect(queue.dequeue()).toBeUndefined();
  });
});
