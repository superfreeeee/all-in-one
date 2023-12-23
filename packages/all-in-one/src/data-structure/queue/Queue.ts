export interface IQueue<T> {
  enqueue(data: T): number;
  dequeue(): T | undefined;
  size(): number;
}

export class Queue<T> implements IQueue<T> {
  private _stack: T[] = [];

  enqueue(data: T): number {
    return this._stack.push(data);
  }

  dequeue(): T | undefined {
    return this._stack.shift();
  }

  size(): number {
    return this._stack.length;
  }
}
