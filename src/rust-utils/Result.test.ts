import Result from './Result';

describe('Result test', () => {
  test('ok test', () => {
    const result = Result.ok(1);

    expect(result.isOk).toBe(true);
    expect(result.isError).toBe(false);
    expect(result.unwrap()).toBe(1);
  });

  test('error test', () => {
    class MyError extends Error {}

    const msg = 'my error';
    const result = Result.error(new MyError(msg));

    expect(result.isOk).toBe(false);
    expect(result.isError).toBe(true);
    expect(() => result.unwrap()).toThrowError(msg);
  });

  test('catch test', () => {
    expect(Result.ok(1).catch()).toBe(null);
    const error = new SyntaxError();
    expect(Result.error(error).catch()).toBe(error);
  });
});
