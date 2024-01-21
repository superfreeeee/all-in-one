const fs = require('fs');
const path = require('path');

function raiseInvalidArgs() {
  throw new Error(`unaccepted args: ${args}`);
}

function raiseDuplicateQuestion(cur) {
  throw new Error(`duplicate question: ${cur}`);
}

console.log('> generate leetcode');

const args = process.argv.slice(2);
const [num, funcName] = args;

// ========== validate args ==========
// num + name
if (args.length !== 2) {
  raiseInvalidArgs();
}

// num is number
if (isNaN(Number(num))) {
  raiseInvalidArgs();
}

// non empty name
if (!funcName) {
  raiseInvalidArgs();
}

// ========== check file ==========
const fileName = `${num}_${funcName}`;

const dir = fs.readdirSync(path.resolve(__dirname, 'src'));
const duplicateQuestion = dir.find((file) => {
  const [curNum] = file.split('.')[0].split('_');
  // enable same function name
  return curNum === num || file.startsWith(fileName);
});
if (duplicateQuestion) {
  raiseDuplicateQuestion(duplicateQuestion);
}

// ========== gen file ==========
fs.writeFileSync(
  path.resolve(__dirname, 'src', `${fileName}.ts`),
  `\
// paste question code here


// generate by ../generate.js
export { ${funcName} };
`,
);

fs.writeFileSync(
  path.resolve(__dirname, 'src', `${fileName}.test.ts`),
  `\
import { ${funcName} } from './${fileName}';

type Fn = typeof ${funcName};
type Params = Parameters<Fn>;
type Result = ReturnType<Fn>;

const tests: [...Params, Result, boolean][] = [
  [
    // paste unit test in demo here
    // args

    undefined, // ans
    false, // only
  ],
  [
    // args

    undefined, // ans
    false, // only
  ],
];

tests.forEach((config, i) => {
  const args = config.slice(0, config.length - 2) as Params;
  const ans = config[config.length - 2];
  const only = config[config.length - 1];

  const testFn = only ? test.only : test;
  testFn(\`test \${i + 1}\`, () => {
    const res = ${funcName}(...args);
    expect(res).toEqual(ans);
  });
});
`,
);
