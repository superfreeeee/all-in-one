import { wait } from './wait';

test('wait', async () => {
  const DELAY = 10;
  const start = Date.now();
  await wait(DELAY);
  const end = Date.now();
  expect(end - start).toBeGreaterThanOrEqual(DELAY);
});
