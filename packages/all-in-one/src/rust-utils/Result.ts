export default class Result<T, E extends Error> {
  private readonly success: boolean;

  private readonly data: T | undefined;
  private readonly error: E | undefined;

  protected constructor(success: boolean, data?: T, error?: E) {
    this.success = success;
    this.data = data;
    this.error = error;
  }

  static ok<T, E extends Error>(data: T) {
    return new Result<T, E>(true, data);
  }

  static error<T, E extends Error>(error: E) {
    return new Result<T, E>(false, undefined, error);
  }

  get isOk() {
    return this.success;
  }

  get isError() {
    return !this.success;
  }

  unwrap(): T {
    if (this.success) {
      return this.data as T;
    } else {
      throw this.error;
    }
  }

  catch(): E | null {
    return this.success ? null : (this.error as E); // E 必存在
  }
}
