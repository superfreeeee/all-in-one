# Compiler Hooks

- 1. environment

`compiler.context` 为执行 webpack 根目录

- 2. afterEnvironment

- 3. entryOption

entry 解析完成阶段，修改原 entry 对象

EntryPlugin 在 `compiler - compilation` 阶段注入 `dependencyFactories`
EntryPlugin 在 `compiler - make` 阶段调用 `compilation.addEntry`

- afterPlugins

所有内置 Plugin apply 完成阶段

- afterResolvers

内置 resolve 配置完成阶段

- initialize

- beforeRun

- run

- watchRun

- normalModuleFactory

- contextModuleFactory

- beforeCompile

- compile

- thisCompilation

- compilation

- 4. make

- afterCompile

- shouldEmit

- 5. emit

资源解析完成，输出到 outputFileSystem 前

适合**修改产物**操作，修改 `compilation.assets`

- 6. assetEmitted

按文件粒度解析 asset

- 7. afterEmit

输出到 outputFileSystem 后

适合**查询最终生成产物**操作，查询 `compilation.assets`

- done

- additionalPass

- failed

- invalid

- watchClose

- shutdown

- infrastructureLog

- log

# Compilation Hooks

- buildModule

- rebuildModule

- failedModule

- succeedModule

- stillValidModule

- addEntry

- failedEntry

- succeedEntry

- dependencyReferencedExports

- executeModule

- prepareModuleExecution

- finishModules

module 解析完成阶段

`InferAsyncModulesPlugin` => 标记 async

- finishRebuildingModule

- unseal

- seal

- beforeChunks

- afterChunks

- optimizeDependencies

- afterOptimizeDependencies

- optimize

- optimizeModules

- afterOptimizeModules

- optimizeChunks

- afterOptimizeChunks

- optimizeTree

- afterOptimizeTree

- optimizeChunkModules

- afterOptimizeChunkModules

- shouldRecord

- additionalChunkRuntimeRequirements

- runtimeRequirementInChunk

- additionalModuleRuntimeRequirements

- runtimeRequirementInModule

- additionalTreeRuntimeRequirements

- runtimeRequirementInTree

- runtimeModule

- reviveModules

- beforeModuleIds

- moduleIds

- optimizeModuleIds

- afterOptimizeModuleIds

- reviveChunks

- beforeChunkIds

- chunkIds

- optimizeChunkIds

- afterOptimizeChunkIds

- recordModules

- recordChunks

- optimizeCodeGeneration

- beforeModuleHash

- afterModuleHash

- beforeCodeGeneration

- afterCodeGeneration

- beforeRuntimeRequirements

- afterRuntimeRequirements

- beforeHash

- contentHash

- afterHash

- recordHash

- record

- beforeModuleAssets

- shouldGenerateChunkAssets

- beforeChunkAssets

- additionalChunkAssets

- additionalAssets

- optimizeChunkAssets

- afterOptimizeChunkAssets

- optimizeAssets

- afterOptimizeAssets

- processAssets

- afterProcessAssets

- processAdditionalAssets

- needAdditionalSeal

- afterSeal

- renderManifest

- fullHash

- chunkHash

- moduleAsset

- chunkAsset

- assetPath

- needAdditionalPass

- childCompiler

- log

- processWarnings

- processErrors

- statsPreset

- statsNormalize

- statsFactory

- statsPrinter

