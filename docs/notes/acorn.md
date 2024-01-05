# acorn 模块设计

- token 相关
  - `tokenize.js` token 匹配 => lexer 部分
  - `tokentype.js` token 类型
  - `tokencontext.js` token 匹配过程上下文，括号匹配、generator 函数域

# acorn AST 数据结构设计

```typescript
export interface Position {
  /** 1-based */
  line: number;
  /** 0-based */
  column: number;
}

export interface SourceLocation {
  source?: string | null;
  start: Position;
  end: Position;
}

export interface Node {
  start: number
  end: number
  type: string
  range?: [number, number]
  loc?: SourceLocation | null
}

export interface Program extends Node {
  type: "Program"
  body: Array<Statement | ModuleDeclaration>
  sourceType: "script" | "module"
}

```

# acorn_rs 模块设计

- Parser
  - lexer: Lexer
  - 
  - parse(): Node
  - parse_top_level(program: Node): Node
  - parse_statement(): Node
  - 
  - static parse(): Node

- Lexer
  - input: String
  - pos: u32
  - cur_line: u32
  - line_start: u32
  - 
  - next_token(): Token
  - current_pos(): Position

```rs
struct Lexer {
  input: String,
  pos: u32,
  cur_line: u32,
  line_start: u32,
}

impl Lexer {
  fn next_token(): Token
  fn current_pos(): Position
}

struct Token {
  _type: TokenType,
  value: String,
  start: BytePos,
  end: BytePos,
  loc: SourceLocation,
}

struct BytePos(u32);

struct CharPos(usize);

// Range in acorn
struct Span {
  start: BytePos,
  end: BytePos,
}

// Position in acorn
struct Location {
  /// 1-base
  line: CharPos,
  /// 0-base
  col: CharPos,
}

struct SourceLocation {
  start: Location,
  end: Location,
  source: Option<String>
}
```

# acorn_rs AST 节点设计

```rs
struct Node {
  span: Span,
  body: Vec<Statement | ModuleDeclaration>
  // TODO range
  // TODO loc
}

struct Program {
  span: Span,
  source_type: SourceType,
}

struct SourceType {
  lang: Language,
  kind: ModuleKind,
  variant: LanguageVariant,
}

enum Language {
  JavaScript,
  TypeScript,
}

enum ModuleKind {
  Script,
  Module,
}

enum LanguageVariant {
  Standard,
  Jsx,
}
```

- Node
