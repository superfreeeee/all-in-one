import { MaxHeap } from './MaxHeap';

describe('MaxHeap tests', () => {
  test('mvp test', () => {
    const heap = MaxHeap.from([2, 3, 4, 5, 10]);

    expect(heap.size()).toBe(5);

    expect(heap.next()).toBe(10);
    expect(heap.popMax()).toBe(10);

    expect(heap.popMax()).toBe(5);
    expect(heap.popMax()).toBe(4);
    expect(heap.popMax()).toBe(3);
    expect(heap.popMax()).toBe(2);

    expect(heap.findMax()).toBeUndefined();
    expect(heap.popMax()).toBeUndefined();
    expect(heap.size()).toBe(0);
  });
});
