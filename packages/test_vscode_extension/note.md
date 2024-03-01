# vscode 插件开发

## Hello World 构成

https://code.visualstudio.com/api/get-started/extension-anatomy

- `package.json`
  - `contributes.commands` 注册可用命令
  - 命令 id 为 `<extension>:<command>`
  - `<publisher>.<name>` 作为插件唯一 id
- `src/extension.ts`
  - `vscode.commands.registerCommand` 注册命令实现

## 打包 / 发布

- 使用 vsce

https://code.visualstudio.com/api/working-with-extensions/publishing-extension

```sh
vsce package  # 生成 vsix 产物
vsce publish  # 发布到市场上
```

# demo

- 各 API 实现 demo，可以配合 GPT 服用更快速

https://github.com/microsoft/vscode-extension-samples
