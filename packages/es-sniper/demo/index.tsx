import React from 'react';
import { useState } from 'react';

console.log('load index.tsx');

export const Counter = () => {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <div>count: {count}</div>
      <button onClick={increment}>increment</button>
      <button onClick={(event) => setCount(0)}>reset</button>
    </div>
  );
};
