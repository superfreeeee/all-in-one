import { Node } from '@babel/types';
import { ScopeAnalyzer } from './scope';

export class ConsumptionAnalyzer {
  readonly ast: Node;

  private scopeAnalyzer: ScopeAnalyzer;

  constructor(scopeAnalyzer: ScopeAnalyzer) {
    this.scopeAnalyzer = scopeAnalyzer;
    this.ast = this.scopeAnalyzer.ast;
  }

  private parse() {}
}
