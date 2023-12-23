import { IHeap } from './Heap';
import { left, parent, right } from './utils';

export class MaxHeap<T> implements IHeap<T> {
  private _heap: T[] = [];

  static from<T>(origin: T[]): MaxHeap<T> {
    const heap = new MaxHeap<T>();
    const datas = origin.slice();
    heap._heap = datas;
    for (let i = parent(datas.length - 1); i >= 0; i--) {
      heap.heapify(i);
    }
    return heap;
  }

  insert(data: T): number {
    const len = this._heap.push(data);

    let cur = len - 1;
    while (cur > 0) {
      const p = parent(cur);
      if (this._heap[p] >= this._heap[cur]) {
        break;
      }
      this.swap(cur, p);
      cur = p;
    }

    return len;
  }

  next(): T | undefined {
    return this._heap[0];
  }

  findMax(): T | undefined {
    return this.next();
  }

  pop(): T | undefined {
    const len = this._heap.length;
    if (len === 0) {
      return undefined;
    }
    if (len === 1) {
      return this._heap.pop();
    }
    this.swap(0, len - 1);
    const data = this._heap.pop();
    this.heapify(0);
    return data;
  }

  popMax(): T | undefined {
    return this.pop();
  }

  size(): number {
    return this._heap.length;
  }

  private swap(from: number, to: number) {
    [this._heap[from], this._heap[to]] = [this._heap[to], this._heap[from]];
  }

  /**
   * @param pos
   */
  private heapify(pos: number) {
    const len = this._heap.length;
    const leftPos = left(pos);
    if (leftPos >= len) {
      return;
    }

    let max = pos;
    const rightPos = right(pos);
    if (this._heap[leftPos] > this._heap[max]) {
      max = leftPos;
    }
    if (rightPos < len && this._heap[rightPos] > this._heap[max]) {
      max = rightPos;
    }

    if (max !== pos) {
      this.swap(pos, max);
      this.heapify(max);
    }
  }
}
