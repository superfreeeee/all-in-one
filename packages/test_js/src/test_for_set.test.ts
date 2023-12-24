test('add set in for', () => {
  let max = 0;

  let next = 4;
  const set = new Set([1, 2, 3]);
  for (const num of set) {
    if (num > max) {
      max = num;
    }

    if (num <= 10) {
      // add when traverse set
      set.add(next);
      next += 1;
    }
  }

  expect(max).toBe(13);
});
