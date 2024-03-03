import { describe, expect, test } from 'vitest';

import path from 'path';
import fs from 'fs';
import { ScopeAnalyzer, ScopeVariable } from '../scope-impl';
import { parseCode } from '../compiler';

const parseFile = (filePath: string) => {
  const code = fs.readFileSync(filePath).toString();

  const ast = parseCode(code);

  const scopeAnalyzer = new ScopeAnalyzer(ast);
  const scope = scopeAnalyzer.root;

  return {
    code,
    ast,
    scope,
    scopeAnalyzer,
  };
};

type VarCheckTestOption = {
  source: string;
  variables: ScopeVariable[];
};

const createVarCheckTests = (options: VarCheckTestOption[]) => {
  for (const option of options) {
    const testName = path.basename(option.source);

    test(testName, () => {
      const { scope } = parseFile(option.source);
      expect(scope.variables).toEqual(option.variables);
    });
  }
};

describe('global scope tests', () => {
  // 全局變量測試用例
  createVarCheckTests([
    {
      source: path.resolve(__dirname, './use-cases/global-var.ts'),
      variables: [{ id: 'localVar', source: 'local' }],
    },
    {
      source: path.resolve(__dirname, './use-cases/global-func.ts'),
      variables: [{ id: 'localFunc', source: 'local' }],
    },
    {
      source: path.resolve(__dirname, './use-cases/global-func-arrow.ts'),
      variables: [{ id: 'localFunc', source: 'local' }],
    },
    {
      source: path.resolve(__dirname, './use-cases/global-func-arrow-no-body.ts'),
      variables: [{ id: 'localFunc', source: 'local' }],
    },
    {
      source: path.resolve(__dirname, './use-cases/global-var-import.ts'),
      variables: [
        { source: 'import', id: 'addDefault' },
        { source: 'import', id: 'utils' },
        { source: 'import', id: 'addDefault2' },
        { source: 'import', id: 'add' },
        { source: 'import', id: 'addAlias' },
      ],
    },
  ]);
});

describe('local scope tests', () => {
  const TEST_CASE_LOCAL_1 = path.resolve(__dirname, './use-cases/local-var.ts');
  const TEST_CASE_LOCAL_2 = path.resolve(__dirname, './use-cases/local-param-func.ts');
  const TEST_CASE_LOCAL_3 = path.resolve(__dirname, './use-cases/local-param-func-arrow.ts');
  const TEST_CASE_LOCAL_4 = path.resolve(__dirname, './use-cases/local-param-func-arrow-no-body.ts');
  const TEST_CASE_LOCAL_5 = path.resolve(__dirname, './use-cases/local-param-func-complex.ts');
  const TEST_CASE_LOCAL_6 = path.resolve(__dirname, './use-cases/local-var-for.ts');
  const TEST_CASE_LOCAL_7 = path.resolve(__dirname, './use-cases/local-var-for-x.ts');

  // 局部變量測試用例
  test('local-var', () => {
    const { scope } = parseFile(TEST_CASE_LOCAL_1);
    expect(scope.children).toMatchObject([
      {
        type: 'block',
        nodeExtra: {
          type: 'BlockStatement',
        },
        variables: [{ id: 'localVar', source: 'local' }],
      },
    ]);
  });

  test('local-param', () => {
    const { scope } = parseFile(TEST_CASE_LOCAL_2);
    expect(scope.children).toMatchObject([
      {
        type: 'function',
        nodeExtra: {
          type: 'FunctionDeclaration',
          name: 'localFunc',
        },
        variables: [{ id: 'paramVar', source: 'param' }],
      },
    ]);
  });

  test('local-param-arrow', () => {
    const { scope } = parseFile(TEST_CASE_LOCAL_3);
    expect(scope.children).toMatchObject([
      {
        type: 'function',
        nodeExtra: {
          type: 'ArrowFunctionExpression',
        },
        variables: [{ id: 'paramVar', source: 'param' }],
      },
    ]);
  });

  test('local-param-arrow-no-body', () => {
    const { scope } = parseFile(TEST_CASE_LOCAL_4);
    expect(scope.children).toMatchObject([
      {
        type: 'function',
        nodeExtra: {
          type: 'ArrowFunctionExpression',
        },
        variables: [{ id: 'paramVar', source: 'param' }],
      },
    ]);
  });

  test('local-param-complex', () => {
    const { scope } = parseFile(TEST_CASE_LOCAL_5);
    expect(scope.children).toMatchObject([
      {
        type: 'function',
        nodeExtra: {
          type: 'FunctionDeclaration',
          name: 'localFunc',
        },
        variables: [
          { source: 'param', id: 'paramVar' },
          { source: 'param', id: 'paramDefault' },
          { source: 'param', id: 'objPatternProp' },
          { source: 'param', id: 'arrItem' },
          { source: 'param', id: 'objPatternPropWithDefault' },
          { source: 'param', id: 'objPatternPropRest' },
          { source: 'param', id: 'arrPatternItem' },
          { source: 'param', id: 'arrPatternItemWithDefault' },
          { source: 'param', id: 'paramRest' },
        ],
      },
    ]);
  });

  test('local-var-for', () => {
    const { scope } = parseFile(TEST_CASE_LOCAL_6);
    expect(scope.children).toMatchObject([
      {
        type: 'block',
        nodeExtra: {
          type: 'ForStatement',
        },
        variables: [
          { source: 'local', id: 'i' },
          { source: 'local', id: 'len' },
        ],
      },
    ]);
  });

  test('local-var-for-x', () => {
    const { scope } = parseFile(TEST_CASE_LOCAL_7);
    expect(scope.children).toMatchObject([
      {
        type: 'block',
        nodeExtra: {
          type: 'ForOfStatement',
        },
        variables: [
          { source: 'local', id: 'key' },
          { source: 'local', id: 'value' },
        ],
      },
      {
        type: 'block',
        nodeExtra: {
          type: 'ForOfStatement',
        },
        // ignore LVal in for-x
        variables: [],
      },
    ]);
  });
});

describe('toJSON test', () => {
  const TEST_CASE_SELF = path.resolve(__dirname, './scope.test.ts');

  test('self toJSON', () => {
    const { scopeAnalyzer } = parseFile(TEST_CASE_SELF);
    const json = scopeAnalyzer.toJSON();
    fs.writeFileSync(path.resolve(__dirname, 'scope.test.json'), JSON.stringify(json, null, 2));
  });
});
