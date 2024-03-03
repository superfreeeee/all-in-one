// // 声明变量
// const funcA = () => {};
// const funcB = function () {};
// const funcC = function funcC() {};
// function funcD() {}

// // IIFE
// (() => {})();
// (function () {})();
// (function namedIIFE() {})();

// 函数参数
function foo(
  a,
  // AssignmentPattern, left=Identifier, right=NumericLiteral
  b = 1,
  // AssignmentPattern, left=Identifier, right=ObjectExpression
  c = {},
  // ObjectPattern
  { d },
  // AssignmentPattern, left=ObjectPattern, right=ObjectExpression
  { e = 2, f: { g: [, , h], i: j = 3 } = {} } = {},
  // ArrayPattern
  [, k],
  ...l
) {
  let x = 1;

  {
    let x = 10;
    let y = 20;
    console.log(x + y);
  }

  if (true) {
    const const_if = 3;
  }

  console.log(x);

  function innerFunc() {}
}

for (let i = 0; i < 10; i++) {}

for (const item of []) {
}

for (const { itemKey } of []) {
}

for (const { a = 2, b: { c: [, d, e], f: i = 3 } = {} } in []) {
}

export {};
