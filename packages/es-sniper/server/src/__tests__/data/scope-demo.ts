function scopeOnce() {
  let x = 0;

  x; // references
  x = 1;

  function scopeTwo() {
    x; // references
    x = 2;

    let y = 10;

    if (true) {
      x; // references
    }

    function scopeThree() {
      x; // references
      x = 3;
      y; // references
      y = 20;

      scopeTwo();
    }
  }
}

let counter = { value: 0 };

const increment = () => {
  // counter = { value: 0 };
  counter.value += 1;
};

const reset = () => {
  counter = { value: 0 };
};

// const getQueryId = (x: number, y: number) => {
//   const params = new URLSearchParams(location.search);
//   const z = x + y;
// };
