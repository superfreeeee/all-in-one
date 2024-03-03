/**
 * @deprecated
 * ! 吐了，@babel/traverse 里面都已经有了。。。
 */
import traverse, { NodePath } from '@babel/traverse';
import {
  type Node,
  isIdentifier,
  isArrowFunctionExpression,
  isFunctionExpression,
  isFunctionDeclaration,
  isRestElement,
  type Identifier,
  type RestElement,
  type Pattern,
  isAssignmentPattern,
  isObjectPattern,
  isArrayPattern,
  isPattern,
  isObjectProperty,
  isForXStatement,
  isForStatement,
  isVariableDeclaration,
  type VariableDeclaration,
  type LVal,
  type PatternLike,
  type BlockStatement,
  isExpression,
  type ImportDeclaration,
} from '@babel/types';

export type ScopeVariable = {
  id: string;
  // 本地变量 / 函数参数
  // ! 这里就不区分 var 还是 func
  source: 'local' | 'param' | 'import';
};

export type Scope = {
  type: 'program' | 'block' | 'function';
  node: Node;
  nodeExtra: Record<string, any>;
  variables: ScopeVariable[];
  children: Scope[];
  parent: Scope | null;
};

export type ScopeJSON = Pick<Scope, 'type' | 'nodeExtra' | 'variables'> & {
  children: ScopeJSON[];
};

export class ScopeAnalyzerError extends Error {}

/**
 * 作用域解析器
 */
export class ScopeAnalyzer {
  private readonly _ast: Node;

  private readonly _root: Scope;

  private currentScope: Scope;

  private scopeMap: WeakMap<Node, Scope> = new WeakMap();

  constructor(ast: Node) {
    this._ast = ast;
    this._root = this.initRootScope();
    this.currentScope = this._root;

    this.parse();
    this.currentScope = this._root; // reset to root after parse
  }

  get root() {
    return this._root;
  }

  get ast() {
    return this._ast;
  }

  /**
   * 初始化根作用域
   * @returns
   */
  private initRootScope() {
    const root: Scope = {
      type: 'program',
      node: this._ast,
      nodeExtra: {},
      variables: [],
      children: [],
      parent: null,
    };

    this.scopeMap.set(this._ast, root);

    return root;
  }

  /**
   * 进入新作用域
   *
   * @param type
   * @param node
   * @param nodeExtra
   */
  private enterScope(
    type: Scope['type'],
    node: Node,
    nodeExtra: Record<string, any> = {},
  ) {
    const baseExtra = {
      type: node.type,
    };

    const newScope: Scope = {
      type,
      node,
      nodeExtra: {
        ...baseExtra,
        ...nodeExtra,
      },
      variables: [] as any[],
      children: [] as any[],
      parent: this.currentScope,
    };

    this.scopeMap.set(node, newScope);

    this.currentScope.children.push(newScope);
    this.currentScope = newScope;
  }

  /**
   * 离开作用域
   */
  private exitScope() {
    if (this.currentScope.parent) {
      this.currentScope = this.currentScope.parent;
    }
  }

  /**
   * 解析作用域
   */
  private parse(): void {
    /**
     * 遍历所有节点
     */
    traverse(this._ast, {
      BlockStatement: {
        enter: (path) => {
          // 匹配额外信息的块作用域
          const parsed = this.parseBlockStatementAdditional(path);

          if (parsed) return;

          const parent = path.parent;
          // 3. 普通块
          // if (parent.type !== 'BlockStatement') {
          //   console.log('> parent.type', parent.type);
          // }
          this.enterScope('block', path.node, { parentType: parent.type });
        },
        exit: () => {
          this.exitScope();
        },
      },
      // 特别处理 () => <expression>，没有 BlockStatement 但还是存在局部变量
      ArrowFunctionExpression: (path) => {
        if (isExpression(path.node.body)) {
          this.enterScope('function', path.node);
          this.parseFunctionParams(path.node.params);
          this.exitScope();
        }
      },
      /**
       * 变量声明
       * @param path
       */
      VariableDeclaration: (path) => {
        this.parseVariableDeclaration(path.node);
      },
      /**
       * Import statement
       * @param path
       */
      ImportDeclaration: (path) => {
        this.parseImportDeclaration(path.node);
      },
      /**
       * 函数声明
       * @param path
       */
      FunctionDeclaration: (path) => {
        const node = path.node;
        this.currentScope.variables.push({
          id: node.id!.name,
          source: 'local',
        });
      },
    });
  }

  /**
   * 尝试匹配变量
   * 从基础节点 Identifier | RestElement | Pattern 内类型提炼变量
   * @param node
   */
  private parseVariable(
    node: Identifier | RestElement | Pattern,
    source: ScopeVariable['source'],
  ) {
    // 1. Identifier => 简单参数
    if (isIdentifier(node)) {
      this.currentScope.variables.push({
        id: node.name,
        source,
      });
      return;
    }

    // 2. RestElement => 剩余参数
    if (isRestElement(node)) {
      this.parseLVal(node.argument, source);
      return;
    }

    // 3. AssignmentPattern => 带默认值参数
    if (isAssignmentPattern(node)) {
      if (
        isIdentifier(node.left) ||
        isObjectPattern(node.left) ||
        isArrayPattern(node.left)
      ) {
        this.parseVariable(node.left, source);
      }
      // ? ignore other expression
      return;
    }

    // 4. ArrayPattern => 数组解构表达式
    if (isArrayPattern(node)) {
      for (const element of node.elements) {
        // element := null | PatternLike | LVal
        if (!element) continue;
        this.parseLVal(element, source);
      }
      return;
    }

    // 5. ObjectPattern => 对象解构表达式
    if (isObjectPattern(node)) {
      for (const property of node.properties) {
        if (isRestElement(property)) {
          this.parseVariable(property, source);
          continue;
        }

        if (isObjectProperty(property)) {
          const value = property.value;
          // value := Expression | PatternLike
          this.parseLVal(value as PatternLike, source); // 理论上只应该出现 PatternLike
        }

        // ! unreachable, property is never
      }
      return;
    }

    // ! unreachable, param is never
  }

  /**
   * LVal 中存在变量声明，只能是 Identifier | RestElement | Pattern
   * @param node
   * @param source
   */
  private parseLVal(node: LVal, source: ScopeVariable['source']) {
    if (isIdentifier(node) || isRestElement(node) || isPattern(node)) {
      this.parseVariable(node, source);
    }
  }

  /**
   * 函数参数匹配 := 函数表达式 | 函数声明
   *
   * @param params
   * @returns
   */
  private parseFunctionParams(params: (Identifier | RestElement | Pattern)[]) {
    if (params.length === 0) return;

    for (const param of params) {
      this.parseVariable(param, 'param');
    }
  }

  /**
   * 变量声明列表
   * 1. Statement
   * 2. ForStatement => init
   * 3. ForXStatement => left
   *
   * 一定都是 local
   * @param variableDeclaration
   */
  private parseVariableDeclaration(variableDeclaration: VariableDeclaration) {
    for (const declaration of variableDeclaration.declarations) {
      this.parseLVal(declaration.id, 'local');
    }
  }

  /**
   * 进入块作用域额外变量
   * 1. 函数 => 匹配函数参数
   * 2. for 表达式 => 匹配变量声明列表
   */
  private parseBlockStatementAdditional(
    path: NodePath<BlockStatement>,
  ): boolean {
    const parent = path.parent;

    // 1. ArrowFunctionExpression => 箭头函数表达式
    // () => {}
    if (isArrowFunctionExpression(parent)) {
      this.enterScope('function', parent);

      this.parseFunctionParams(parent.params);
      return true;
    }

    // 2. isFunctionExpression | isFunctionDeclaration => 函数声明 / 函数表达式
    if (isFunctionExpression(parent) || isFunctionDeclaration(parent)) {
      const name = parent.id?.name || '<anonymous>';
      this.enterScope('function', parent, { name });

      this.parseFunctionParams(parent.params);
      return true;
    }

    // 3. ForStatement => 普通 for 表达式
    if (isForStatement(parent)) {
      this.enterScope('block', parent);

      if (isVariableDeclaration(parent.init)) {
        this.parseVariableDeclaration(parent.init);
      }
      return true;
    }

    // 4. ForXStatement => for-in / for-of
    if (isForXStatement(parent)) {
      this.enterScope('block', parent);

      if (isVariableDeclaration(parent.left)) {
        this.parseVariableDeclaration(parent.left);
      }
      // ignore LVal in for-x
      return true;
    }

    return false;
  }

  /**
   * 收集 import 变量
   * @param node
   */
  private parseImportDeclaration(node: ImportDeclaration) {
    for (const spec of node.specifiers) {
      this.currentScope.variables.push({
        id: spec.local.name,
        source: 'import',
      });
    }
  }

  /**
   * transform to non-curly json-object
   */
  toJSON(): ScopeJSON {
    return this.scopeToJSON(this._root);
  }

  private scopeToJSON(scope: Scope): ScopeJSON {
    const { type, nodeExtra, variables, children } = scope;
    const childrenJSON = children.map((child) => this.scopeToJSON(child));

    const scopeJSON: ScopeJSON = {
      type,
      nodeExtra,
      variables,
      children: childrenJSON,
    };

    return scopeJSON;
  }
}
