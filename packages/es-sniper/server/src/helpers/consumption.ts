/**
 * @deprecated
 * ! 可以尝试基于 @babel/traverse 的 scope 与 reference 解析，不需要自己写了
 */
import {
  Expression,
  Identifier,
  Node,
  isArrayExpression,
  isIdentifier,
  isObjectProperty,
  isSpreadElement,
} from '@babel/types';
import { ScopeAnalyzer } from './scope-impl';
import traverse, { NodePath, TraverseOptions } from '@babel/traverse';

export class ConsumptionAnalyzer {
  private scopeAnalyzer: ScopeAnalyzer;

  /**
   * 静态方法
   * @param ast
   * @returns
   */
  static parse(ast: Node) {
    const scopeAnalyzer = new ScopeAnalyzer(ast);
    const consumptionAnalyzer = new ConsumptionAnalyzer(scopeAnalyzer);
    return consumptionAnalyzer;
  }

  constructor(scopeAnalyzer: ScopeAnalyzer) {
    this.scopeAnalyzer = scopeAnalyzer;

    this.parse();
  }

  /**
   * 解析函数消费
   */
  private parse() {
    const collected = new Set<string>();
    const idKey = (id: Identifier) =>
      `${id.name}_${id.loc?.start.line}:${id.loc?.start.column}`;

    const collect = (id: Identifier) => {
      collected.add(idKey(id));
    };

    const maybeIdentifierConsumption = (node: Node) => {
      if (isIdentifier(node)) {
        collect(node);
      }
    };

    traverse(this.scopeAnalyzer.ast, {
      BlockStatement: (path) => {
        console.log('> BlockStatement', {
          // scopeKeys: Object.keys(path.scope),
          labels: path.scope.labels,
          globals: { ...path.scope.globals },
          references: { ...path.scope.references },
          bindings: { ...path.scope.bindings },
          uids: { ...path.scope.uids },
        });
      },

      // Identifier: (path) => {
      //   if (!collected.has(idKey(path.node))) {
      //     console.log(`uncapture id = ${idKey(path.node)}`);
      //   }
      // },

      // /**
      //  * AssignmentExpression := <left> = <right>
      //  * @param path
      //  */
      // AssignmentExpression: (path) => {
      //   maybeIdentifierConsumption(path.node.right);
      // },

      // /**
      //  * MemberExpression := <object>.<property>
      //  */
      // MemberExpression: (path) => {
      //   maybeIdentifierConsumption(path.node.object);
      // },

      // /**
      //  * ObjectExpression := { <properties> }
      //  */
      // ObjectExpression: (path) => {
      //   for (const prop of path.node.properties) {
      //     if (isObjectProperty(prop)) {
      //       maybeIdentifierConsumption(prop.value);
      //     } else if (isSpreadElement(prop)) {
      //       maybeIdentifierConsumption(prop.argument);
      //     }
      //   }
      // },

      // Expression: {
      //   enter: (path) => {
      //     lastCaptureMap.set(path, capture);
      //     capture = true;
      //   },
      //   exit: (path) => {
      //     capture = lastCaptureMap.get(path)!;
      //   },
      // },

      // Expression: (path) => {
      //   this.pasreExpression(path.node);
      // },
    });

    // console.log(collected);
  }

  private pasreExpression(expression: Expression) {
    // 1. ArrayExpression
    if (isArrayExpression(expression)) {
      for (const element of expression.elements) {
        // null
        if (!element) continue;
        // SpreadElement
        if (isSpreadElement(element)) {
          this.pasreExpression(element.argument);
          continue;
        }
        // Expression
        this.pasreExpression(element);
      }
      return;
    }

    // ArrayExpression |
    // AssignmentExpression |
    // BinaryExpression |
    // CallExpression |
    // ConditionalExpression |
    // FunctionExpression |
    // Identifier |
    // StringLiteral |
    // NumericLiteral |
    // NullLiteral |
    // BooleanLiteral |
    // RegExpLiteral |
    // LogicalExpression |
    // MemberExpression |
    // NewExpression |
    // ObjectExpression |
    // SequenceExpression |
    // ParenthesizedExpression |
    // ThisExpression |
    // UnaryExpression |
    // UpdateExpression |
    // ArrowFunctionExpression |
    // ClassExpression |
    // ImportExpression |
    // MetaProperty |
    // Super |
    // TaggedTemplateExpression |
    // TemplateLiteral |
    // YieldExpression |
    // AwaitExpression |
    // Import |
    // BigIntLiteral |
    // OptionalMemberExpression |
    // OptionalCallExpression |
    // TypeCastExpression |
    // JSXElement |
    // JSXFragment |
    // BindExpression |
    // DoExpression |
    // RecordExpression |
    // TupleExpression |
    // DecimalLiteral |
    // ModuleExpression |
    // TopicReference |
    // PipelineTopicExpression |
    // PipelineBareFunction |
    // PipelinePrimaryTopicReference |
    // TSInstantiationExpression |
    // TSAsExpression |
    // TSSatisfiesExpression |
    // TSTypeAssertion |
    // TSNonNullExpression;

    // if (isAssignmentExpression)
  }
}
