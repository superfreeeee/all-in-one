import { test } from 'vitest';
import path from 'path';
import fs from 'fs';
import { parseCode } from '../compiler';
import traverse, { NodePath } from '@babel/traverse';
import { Pattern, Scopable, isScopable } from '@babel/types';

test('smoke test', () => {
  try {
    const SMOKE_TEST_CASE = path.resolve(__dirname, './use-cases/scope-demo.ts');
    const code = fs.readFileSync(SMOKE_TEST_CASE).toString();

    const ast = parseCode(code);

    const scopePaths: NodePath<Scopable>[] = [];

    traverse(ast, {
      Scope: (path) => {
        if (isScopable(path.node)) {
          scopePaths.push(path as NodePath<Scopable>);
        }
      },
    });

    // console.log('> scopePaths', scopePaths);
    console.log(
      '> scopes',
      JSON.stringify(
        scopePaths.map((path) => {
          return {
            type: path.node.type,
            line: path.node.loc?.start.line,
            variables: Object.entries(path.scope.bindings).map(([id, binding]) => {
              return { id, kind: binding.kind };
            }),
          };
        }),
        null,
        2,
      ),
      new Set(scopePaths.map((path) => path.scope)).size,
    );

    // console.log('> ast', ast.program.body);
    // console.log(ast.program.body[3].declarations[0].id.elements[0]);
    // console.log(ast.program.body[2].declarations[0].init);

    // const consumptionAnalyzer = ConsumptionAnalyzer.parse(ast);
  } catch (error) {
    console.error(error);
  }
});
