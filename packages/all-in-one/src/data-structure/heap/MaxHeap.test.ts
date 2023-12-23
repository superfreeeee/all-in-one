import { MaxHeap } from './MaxHeap';
import { parent } from './utils';

const validateMaxHeap = (heap: MaxHeap<any>) => {
  const arr = (heap as any)._heap;

  for (let i = 1, len = arr.length; i < len; i++) {
    expect(arr[parent(i)]).toBeGreaterThanOrEqual(arr[i]);
  }
};

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

  test('insert test', () => {
    const heap = new MaxHeap<number>();

    for (let i = 1; i <= 10; i++) {
      expect(heap.insert(i)).toBe(i);
      validateMaxHeap(heap);
    }

    for (let i = 20; i >= 11; i--) {
      expect(heap.insert(i)).toBe(31 - i);
      validateMaxHeap(heap);
    }
  });
});
