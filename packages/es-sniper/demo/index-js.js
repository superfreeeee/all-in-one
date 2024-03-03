console.log('load index.js');

const add = (x, y) => {
  const c = 1;
  return x + y + c;
};

function foo() {
  let x = 1;

  {
    let x = 10;
    let y = 20;
    console.log(x + y);

    function inner(x, y) {}
  }

  console.log(x);
}

export {};
