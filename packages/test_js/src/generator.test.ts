import { test } from 'vitest';

function* range(start: number, end: number) {
  for (let i = start; i < end; i++) {
    yield i;
  }
}

test('mock array iterator', () => {
  for (const num of range(1, 5)) {
    console.log({ num });
  }
});

test('generator runner', () => {
  const runner = (g: Generator<number, void>) => {
    let res = g.next(); // first yield

    while (!res.done) {
      // log none done res
      console.log(res);
      res = g.next(res.value);
    }
  };

  runner(range(1, 5));
});
