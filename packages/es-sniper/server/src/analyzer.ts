import { debounce, throttle } from 'lodash-es';
import { type Node, type Scopable, isScopable, Function } from '@babel/types';
import parser from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';

/**
 * 基于 @babel/parser 的 统一 parse 方法
 * 保证插件对齐
 *
 * @param code
 * @returns
 */
export const parseCode = (code: string) => {
  const ast = parser.parse(code, {
    sourceType: 'unambiguous',
    plugins: ['typescript', 'jsx'],
  });

  return ast;
};

type ScopeLen = {
  line: number;
  depth: number; // 0-based
  local: number;
};

/**
 * 解析作用域 bindings
 *
 * @description
 * 基于 @babel/traverse
 *
 * @param root
 * @returns
 */
export const getScopeLens = (root: Node): ScopeLen[] => {
  const scopePaths: NodePath<Scopable>[] = [];

  traverse(root, {
    Scope: (path) => {
      if (isScopable(path.node)) {
        scopePaths.push(path as NodePath<Scopable>);
      }
    },
  });

  return scopePaths.map((path) => {
    let depth = 0;
    let currentScope = path.scope;
    while (currentScope.parent) {
      currentScope = currentScope.parent;
      depth += 1;
    }

    const scopeLen: ScopeLen = {
      line: path.node.loc!.start.line || 0,
      depth,
      local: Object.keys(path.scope.bindings).length,
    };

    return scopeLen;
  });
};

// binding => ref count
type ConsumptionInfo = Record<string, number>;

type ConsumptionLen = {
  line: number;
  consumption: ConsumptionInfo;
};

export const getFunctionConsumptions = (root: Node) => {
  const functionScopePathMap = new Map<NodePath, ConsumptionInfo>();
  const scopePaths: NodePath<Scopable>[] = [];

  traverse(root, {
    Scope: (path) => {
      if (isScopable(path.node)) {
        scopePaths.push(path as NodePath<Scopable>);
      }
    },
    Function: (path) => {
      functionScopePathMap.set(path, {});
    },
  });

  const addConsumption = (refPath: NodePath, binding: string) => {
    const consumptionMap = functionScopePathMap.get(refPath.scope.path);
    if (consumptionMap) {
      consumptionMap[binding] = (consumptionMap[binding] ?? 0) + 1;
    }
  };

  scopePaths.forEach((scopePath) => {
    const currentScope = scopePath.scope;
    for (const [key, binding] of Object.entries(currentScope.bindings)) {
      const allRefs = [
        ...binding.referencePaths,
        ...binding.constantViolations,
      ];
      for (const refPath of allRefs) {
        // 忽略当前作用域的依赖，只计算外部依赖
        if (currentScope === refPath.scope) continue;
        addConsumption(refPath, key);
      }
    }
  });

  const consumptionLens: ConsumptionLen[] = [];

  for (const [path, consumption] of functionScopePathMap.entries()) {
    consumptionLens.push({
      line: path.node.loc?.start.line || -1,
      consumption,
    });
  }

  // console.log('> consumptionLens', consumptionLens);

  return consumptionLens;
};

/**
 * 代码解析
 * 1. 解析作用域
 * @param code
 * @returns
 */
const analyzeCode = (code: string) => {
  try {
    const ast = parseCode(code);

    const scopeLens = getScopeLens(ast);
    const consumptionLens = getFunctionConsumptions(ast);

    return { ast, scopeLens, consumptionLens };
  } catch (error) {
    console.error('[analyzeCode] error', error);
    return undefined;
  }
};

export const debouncedAnalyzeCode = debounce(analyzeCode, 500);
