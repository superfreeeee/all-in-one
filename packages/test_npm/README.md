# test_npm

## pre, post script

https://docs.npmjs.com/cli/v10/using-npm/scripts#pre--post-scripts

scripts 脚本命令为 `pre_`、`post_` 前缀的会作为目标命令的前置、后置生命周期钩子

## demo: echo 命令

以 `echo` 命令为例，执行

```sh
npm run echo
```

实际上会执行三条命令

```sh
> test_npm@1.0.0 preecho
> echo 'before script:echo'

before script:echo

> test_npm@1.0.0 echo
> echo 'Run script:echo'

Run script:echo

> test_npm@1.0.0 postecho
> echo 'after script:echo'

after script:echo
```

## example: dev 实际 lib 包开发场景

以 `dev` 命令为例

```sh
npm i
```

在 `install` 完成后，同时首次编译 lib 包

```sh
npm run dev
```

`dev` 开发场景下启动 watch 模式实时编译模块
