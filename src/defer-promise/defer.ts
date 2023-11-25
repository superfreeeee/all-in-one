export interface Deferred<T, E extends Error = Error> {
  promise: Promise<T>;
  resolve: (res: T) => void;
  reject: (err: E) => void;
}

export interface DeferOptions {
  timeout?: number;
}

export const defer = <T, E extends Error = Error>({ timeout }: DeferOptions = {}) => {
  const deferred = {} as Deferred<T, E>;
  deferred.promise = new Promise<T>((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;

    if (timeout != null) {
      setTimeout(() => {
        reject(new Error('Deferred timeout rejected'));
      }, timeout);
    }
  });
  return deferred;
};
