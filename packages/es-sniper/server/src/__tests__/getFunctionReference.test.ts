import { test } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';
import { getFunctionConsumptions, parseCode } from '../analyzer';

test('smoke test', () => {
  const code = readFileSync(path.resolve(__dirname, './data/scope-demo.ts'), {
    encoding: 'utf-8',
  });

  const ast = parseCode(code);

  getFunctionConsumptions(ast);
});
