class ResultOk<T> {
  readonly data: T;

  constructor(data: T) {
    this.data = data;
  }
}

class ResultErr<E extends Error> {
  readonly err: E;

  constructor(err: E) {
    this.err = err;
  }
}

type ResultInfo<T, E extends Error> =
  | {
      success: true;
      variant: ResultOk<T>;
    }
  | {
      success: false;
      variant: ResultErr<E>;
    };

export class Result<T, E extends Error> {
  private readonly info: ResultInfo<T, E>;

  private constructor(info: ResultInfo<T, E>) {
    this.info = info;
  }

  /**
   * Create ResultOk variant
   * @param data
   * @returns
   */
  static Ok<T, E extends Error>(data: T) {
    return new Result<T, E>({
      success: true,
      variant: new ResultOk(data),
    });
  }

  /**
   * Create ResultErr variant
   * @param err
   * @returns
   */
  static Err<T, E extends Error>(err: E) {
    return new Result<T, E>({
      success: false,
      variant: new ResultErr(err),
    });
  }

  /**
   * Check variant is Ok
   */
  get isOk() {
    return this.info.success;
  }

  /**
   * Check variant is Err
   */
  get isErr() {
    return !this.info.success;
  }

  /**
   * Return data if variant is Ok, else throw error
   * @returns
   */
  unwrap(): T {
    if (this.info.success) {
      return this.info.variant.data;
    }

    throw this.info.variant.err;
  }

  /**
   * Return err if variant is Err, else return null
   * @returns
   */
  catch(): E | null {
    if (!this.info.success) {
      return this.info.variant.err;
    }

    return null;
  }

  /**
   * Invoke callback if variant is Ok, return callback is called
   * @param callback
   * @returns
   */
  okThen(callback: (data: T) => Promise<void>): Promise<boolean>;
  okThen(callback: (data: T) => void): boolean;
  okThen(callback: (data: T) => void | Promise<void>): boolean | Promise<boolean> {
    if (this.info.success) {
      const res = callback(this.info.variant.data);
      if (res?.then) {
        return res.then(() => true);
      } else {
        return true;
      }
    }
    return false;
  }

  /**
   * Invoke callback if variant is Err, return callback is called
   * @param callback
   * @returns
   */
  errThen(callback: (err: E) => void): boolean {
    if (!this.info.success) {
      callback(this.info.variant.err);
      return true;
    }
    return false;
  }
}
