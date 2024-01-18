import { sleep } from './sleep';

test('sleep', async () => {
  const DELAY = 10;
  const start = Date.now();
  await sleep(DELAY);
  const end = Date.now();
  expect(end - start).toBeGreaterThanOrEqual(DELAY);
});
