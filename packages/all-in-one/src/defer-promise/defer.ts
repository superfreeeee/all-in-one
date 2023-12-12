export type Deferred<T, E = any> = Promise<T> & {
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: E) => void;
  promise: Promise<T>;
};

export type DeferOptions = {
  timeout?: number;
};

export const defer = <T, E extends Error = Error>({ timeout }: DeferOptions = {}): Deferred<T, E> => {
  let _resolve: any, _reject: any; // ignore type check
  const deferred = new Promise<T>((resolve, reject) => {
    _resolve = resolve;
    _reject = reject;

    if (timeout != null) {
      setTimeout(() => {
        reject(new Error('Deferred timeout rejected'));
      }, timeout);
    }
  });
  (deferred as Deferred<T, E>).resolve = _resolve;
  (deferred as Deferred<T, E>).reject = _reject;
  (deferred as Deferred<T, E>).promise = deferred;

  return deferred as Deferred<T, E>;
};
