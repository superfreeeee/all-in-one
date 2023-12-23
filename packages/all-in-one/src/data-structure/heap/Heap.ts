export interface IHeap<T> {
  insert(data: T): number;
  next(): T | undefined;
  pop(): T | undefined;
  size(): number;
}
