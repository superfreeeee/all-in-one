import { debounce } from './debounce';
import { wait } from './wait';

test('test debounce 1', async () => {
  let count = 0;
  const increment = () => count++;

  const debouncedIncrement = debounce(increment, 10);

  // call 5 times immediately
  debouncedIncrement();
  debouncedIncrement();
  debouncedIncrement();
  debouncedIncrement();
  debouncedIncrement();

  // debounce wont active synchronous
  expect(count).toBe(0);

  await wait(20);

  // active once
  expect(count).toBe(1);
});

test('test debounce 2', async () => {
  let count = 0;
  const increment = () => count++;

  const debouncedIncrement = debounce(increment, 10);

  // call 5 times with 20ms delay
  debouncedIncrement();

  await wait(20);
  expect(count).toBe(1);

  debouncedIncrement();

  await wait(20);
  expect(count).toBe(2);

  debouncedIncrement();

  await wait(20);
  expect(count).toBe(3);

  debouncedIncrement();

  await wait(20);
  expect(count).toBe(4);

  debouncedIncrement();

  await wait(20);
  expect(count).toBe(5);
});
