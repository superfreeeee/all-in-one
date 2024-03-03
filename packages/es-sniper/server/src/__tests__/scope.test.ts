import { test } from 'vitest';

import path from 'path';
import fs from 'fs';
import parser from '@babel/parser';
import { ScopeManager } from '../helpers/scope';

const DEMO_JS_PATH = path.resolve(__dirname, './data/test-js.js');

test('smoke test for scope analyze', () => {
  console.log(`using code: ${DEMO_JS_PATH}`);
  const code = fs.readFileSync(DEMO_JS_PATH).toString();

  const ast = parser.parse(code, {
    sourceType: 'unambiguous',
    plugins: ['typescript', 'jsx'],
  });
  // console.log('> ast');
  // console.log(ast);
  // console.log();

  const scopeManager = new ScopeManager(ast);

  console.log('> scopeManager.root');
  console.log(
    JSON.stringify(
      scopeManager.rootScope,
      (key, value) => {
        // 只看变量
        const showVarOnly = false;
        // const showVarOnly = true;
        if (
          showVarOnly &&
          value &&
          typeof value === 'object' &&
          value.variables &&
          value.children
        ) {
          const { variables, children } = value;
          return { variables, children };
        }

        if (['parent', 'node'].includes(key)) {
          return '<ignore>';
        }

        return value;
      },
      2,
    ),
  );
  console.log();
});
