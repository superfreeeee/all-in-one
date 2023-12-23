export interface IStack<T> {
  push(data: T): number;
  pop(): T | undefined;
  size(): number;
}

export class Stack<T> implements IStack<T> {
  private _stack: T[] = [];

  push(data: T): number {
    return this._stack.push(data);
  }

  pop(): T | undefined {
    return this._stack.pop();
  }

  size(): number {
    return this._stack.length;
  }
}
