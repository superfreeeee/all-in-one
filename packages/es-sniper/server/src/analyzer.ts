import { throttle } from 'lodash-es';
import parser from '@babel/parser';
import { Scope, ScopeManager } from './helpers/scope';

export const parseCode = (code: string) => {
  console.log('[parseCode] active');

  const ast = parser.parse(code, {
    sourceType: 'unambiguous',
    plugins: ['typescript', 'jsx'],
  });

  const manager = new ScopeManager(ast);

  console.log('[parseCode] scope', manager.createMinify());

  const scopeCollections = [] as any[];
  const traverseScope = (scope: Scope, depth = 0) => {
    const line = scope.node?.loc?.start.line;
    const localCount = scope.variables.length;
    scopeCollections.push({ line, depth, localCount });
    scope.children.forEach((child) => {
      traverseScope(child, depth + 1);
    });
  };
  traverseScope(manager.rootScope);

  return {
    ast,
    scope: manager.createMinify(),
    collections: scopeCollections,
  };
};

export const throttledParseCode = throttle(parseCode, 2000);
