import { throttle } from 'lodash-es';
import parser from '@babel/parser';
import { Scope, ScopeAnalyzer } from './helpers/scope';

/**
 * 代码解析
 * 1. 解析作用域
 * @param code
 * @returns
 */
const analyzeCode = (code: string) => {
  console.log('[parseCode] active');

  const ast = parser.parse(code, {
    sourceType: 'unambiguous',
    plugins: ['typescript', 'jsx'],
  });

  const scope = ScopeAnalyzer.parse(ast);
  console.log('[parseCode] scope', scope);

  const scopeLens = scopeToLens(scope);
  console.log('[parseCode] scopeLens', scope);

  return { ast, scope, scopeLens };
};

export const throttledAnalyzeCode = throttle(analyzeCode, 2000);

type ScopeLen = {
  line: number;
  depth: number; // 0-based
  local: number;
};

/**
 * 作用域转换成 CodeLens 信息
 * @param scope
 * @returns
 */
export const scopeToLens = (scope: Scope): ScopeLen[] => {
  const scopeLens: ScopeLen[] = [];

  const parseScope = (scope: Scope, depth: number) => {
    const { node, variables, children } = scope;
    const line = node?.loc?.start.line;
    const local = variables.length;

    if (line == null) {
      console.error('Scope line unknown', node);
    } else {
      scopeLens.push({ line, depth, local });
    }

    for (const child of children) {
      parseScope(child, depth + 1);
    }
  };

  parseScope(scope, 0);

  return scopeLens;
};
