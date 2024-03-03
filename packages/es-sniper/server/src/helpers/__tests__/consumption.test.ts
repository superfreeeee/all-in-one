import { test } from 'vitest';
import path from 'path';
import fs from 'fs';
import { parseCode } from '../compiler';
import { ConsumptionAnalyzer } from '../consumption';
import traverse, { NodePath, Scope } from '@babel/traverse';
import { Scopable } from '@babel/types';

test('smoke test', () => {
  try {
    const SMOKE_TEST_CASE = path.resolve(__dirname, './use-cases/smoke-consumption.ts');
    const code = fs.readFileSync(SMOKE_TEST_CASE).toString();

    const ast = parseCode(code);

    const scopePaths: NodePath<Scopable>[] = [];

    traverse(ast, {
      Scopable: (path) => {
        scopePaths.push(path);
      },
    });

    // console.log('> scopePaths', scopePaths);
    console.log(
      '> scopes',
      scopePaths.map((path) => {
        return {
          type: path.node.type,
        };
      }),
    );

    // console.log('> ast', ast.program.body);
    // console.log(ast.program.body[3].declarations[0].id.elements[0]);
    // console.log(ast.program.body[2].declarations[0].init);

    // const consumptionAnalyzer = ConsumptionAnalyzer.parse(ast);
  } catch (error) {
    console.error(error);
  }
});
