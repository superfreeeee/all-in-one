export interface IHeap<T> {
  next(): T | undefined;
  pop(): T | undefined;
  size(): number;
}
