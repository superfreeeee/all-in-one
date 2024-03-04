# vscode 插件开发

# examples

- 各 API 实现 demo，可以配合 GPT 服用更快速

https://github.com/microsoft/vscode-extension-samples

# Demo

## Hello World 构成

https://code.visualstudio.com/api/get-started/extension-anatomy

- `package.json`
  - `contributes.commands` 注册可用命令
  - 命令 id 为 `<extension>:<command>`
  - `<publisher>.<name>` 作为插件唯一 id
- `src/extension.ts`
  - `vscode.commands.registerCommand` 注册命令实现

## 使用 vite 构建

https://www.eliostruyf.com/vite-bundling-visual-studio-code-extension/

蛮好的教程的，简单的从 webpack 过渡到 vite

## 打包 / 发布

- 使用 vsce

https://code.visualstudio.com/api/working-with-extensions/publishing-extension

```sh
vsce package  # 生成 vsix 产物
vsce publish  # 发布到市场上
```

# 各项能力

## Commands 命令

https://code.visualstudio.com/api/references/vscode-api#commands

- 注册命令 `commands.registerCommand`
- 触发命令 `commands.executeCommand`

- 常见命令
  - `editor.action.addCommentLine` 添加注释行 = `Command + /`

## Window 窗口

https://code.visualstudio.com/api/references/vscode-api#window

- `window.activeTextEditor` 获取当前 textEditor

### TextEditor 编辑器

https://code.visualstudio.com/api/references/vscode-api#TextEditor

- `TextEditor.document: TextDocument` 当前打开文本
- `TextEditor.selection: Selection` 选中区域

## 基础对象

### Selection 选中区域

https://code.visualstudio.com/api/references/vscode-api#Selection

- `Selection.anchor` 选中起点
- `Selection.active` 选中终点 = 当前 cursor
- `Selection.start` 选中前端点
- `Selection.end` 选中后端点
- `Selection.isEmpty` 无选中
- `Selection.isReversed` 反向选中（后往前选）（无选中时为 true，判断条件看起来是 start > end）
- `Selection.isSingleLine` 是否选中单行
