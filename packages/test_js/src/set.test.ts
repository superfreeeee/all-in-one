import { test, expect } from 'vitest';

test('modify when iterate set', () => {
  let max = 0;
  let next = 4;

  const set = new Set([1, 2, 3]);
  console.log('init:', set);

  // modify when iterate set
  for (const num of set) {
    if (num > max) {
      max = num;
    }

    if (num <= 10) {
      // add when traverse set
      set.add(next);
      console.log(`${num}: add => ${next}`, set);
      next += 1;
    }
  }

  expect(max).toBe(13);
});
