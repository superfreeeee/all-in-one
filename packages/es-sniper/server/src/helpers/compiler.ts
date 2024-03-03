import parser from '@babel/parser';

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
