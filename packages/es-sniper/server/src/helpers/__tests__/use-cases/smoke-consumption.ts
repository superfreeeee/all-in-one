// export {};

// {
//   // AssignmentExpression
//   const n1 = 1;
//   let tmp;
//   const n2 = (tmp = n1);
// }

// {
//   const outer = 1;

//   {
//     // MemberExpression
//     const obj = {
//       inner: { deep: { value: 3 } },
//     };
//     const objInner = obj.inner;
//     const objInner2 = obj['inner'];
//     ({ ...obj['inner'], innerAlias: outer }).innerAlias;
//   }
// }

// {
//   // ObjectExpression
// }

// function add(x, y) {}

// (a, b) => {};

const [a = 1] = [];
