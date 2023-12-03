import { defer } from './index';

describe('defer tests', () => {
  test('resolve test', async () => {
    const deferred = defer<number>();
    deferred.resolve(1);
    expect(await deferred).toBe(1);
  });

  test('reject test', async () => {
    const deferred = defer();
    const error = new Error('test');
    deferred.reject(error);
    try {
      await deferred;
      throw new Error('unexpect error');
    } catch (err) {
      expect(err).toBe(error);
    }
  });

  test('await promise', async () => {
    const deferred = defer<object>();
    deferred.resolve({});

    const res1 = await deferred;
    const res2 = await deferred.promise;
    expect(res1).toBe(res2);
  });

  test('timeout test', async () => {
    const deferred = defer({ timeout: 0 });
    const unexpectedError = new Error('unexpect error');
    setTimeout(() => {
      deferred.reject(unexpectedError);
    }, 100);
    try {
      await deferred;
    } catch (err) {
      expect(err).not.toBe(unexpectedError);
    }
  });
});
