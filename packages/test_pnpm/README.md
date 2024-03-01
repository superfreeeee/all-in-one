# test_pnpm

- `pnpm.overrides`、`pnpm.resolutions` 于 yarn resolutions 作用相同，`overrides` 优先级更高

- npm 版本号通配符

https://juejin.cn/post/7057420490851221518

- 非 workspace 子项目，应该使用下面命令进行 install

```sh
pnpm i --ignore-workspace
```
