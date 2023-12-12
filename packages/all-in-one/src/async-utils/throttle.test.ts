import { throttle } from './throttle';
import { wait } from './wait';

test('test throttle 1', async () => {
  let count = 0;
  const increment = () => count++;

  const throttledIncrement = throttle(increment, 10);

  // call 5 times immediately
  throttledIncrement();
  throttledIncrement();
  throttledIncrement();
  throttledIncrement();
  throttledIncrement();

  expect(count).toBe(0);

  await wait(20);

  expect(count).toBe(1);
});

test('test throttle 2', async () => {
  let count = 0;
  const increment = () => count++;

  const throttledIncrement = throttle(increment, 10);

  // call 5 times with 5ms delay
  throttledIncrement(); // ...1
  await wait(5);
  expect(count).toBe(0);

  throttledIncrement(); // x
  await wait(15); // +1
  expect(count).toBe(1);

  throttledIncrement(); // ...2
  await wait(5);
  expect(count).toBe(1);

  throttledIncrement(); // x
  await wait(15); // +2
  throttledIncrement(); // ...3
  await wait(5);
  expect(count).toBe(2);
  await wait(15); // +3
  throttledIncrement(); // ...4
  await wait(15);

  expect(count).toBe(4);
});
