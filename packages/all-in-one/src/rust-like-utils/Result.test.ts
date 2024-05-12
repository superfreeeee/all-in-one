import { sleep } from '../async-utils/sleep';
import { Result } from './Result';

describe('Result test', () => {
  test('Ok variant test', async () => {
    const result = Result.Ok(1);
    expect(result.isOk).toBe(true);
    expect(result.isErr).toBe(false);
    expect(result.unwrap()).toBe(1);
    expect(result.catch()).toBe(null);

    let callbackNum = 0;

    // okThen
    expect(
      result.okThen((num) => {
        callbackNum += 1;
        return num; // accidentally return
      }),
    ).toBe(true);
    expect(callbackNum).toBe(1);

    // asyncThen
    const thenResult = result.okThen(async (num) => {
      await sleep(10);
      callbackNum += 1;
    });
    expect(thenResult).resolves.toEqual(true);
    expect(callbackNum).toBe(1);

    await thenResult;
    expect(callbackNum).toBe(2);
  });

  test('Err variant test', () => {
    const msg = 'my error';
    const error = new Error(msg);
    const result = Result.Err(error);
    expect(result.isOk).toBe(false);
    expect(result.isErr).toBe(true);
    expect(() => result.unwrap()).toThrow(msg);
    expect(result.catch()).toBe(error);

    expect(
      result.okThen((res) => {
        throw new Error('okThen should not be called');
      }),
    ).toBe(false);
  });
});
