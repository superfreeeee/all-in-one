# webpack 源码解析

# 流程拆解

## createCompiler 创建编译器

```js
// source: /lib/webpack.js
/**
 * @param {WebpackOptions} rawOptions options object
 * @returns {Compiler} a compiler
 */
const createCompiler = rawOptions => {
  // 参数结构常态化
	const options = getNormalizedWebpackOptions(rawOptions);
  // 默认参数
	applyWebpackOptionsBaseDefaults(options);


	const compiler = new Compiler(
		/** @type {string} */ (options.context),
		options
	);

  // Node 环境准备
	new NodeEnvironmentPlugin({
		infrastructureLogging: options.infrastructureLogging
	}).apply(compiler);

  // 应用用户插件
	if (Array.isArray(options.plugins)) {
		for (const plugin of options.plugins) {
			if (typeof plugin === "function") {
				plugin.call(compiler, compiler);
			} else if (plugin) {
				plugin.apply(compiler);
			}
		}
	}

  // 还是一些默认参数
	applyWebpackOptionsDefaults(options);

	compiler.hooks.environment.call();
	compiler.hooks.afterEnvironment.call();

  // 基于配置应用内置插件
	new WebpackOptionsApply().process(options, compiler);

	compiler.hooks.initialize.call();

	return compiler;
};
```

- 核心概念
  - `getNormalizedWebpackOptions` 常态化配置
  - `applyWebpackOptionsBaseDefaults` 默认配置补充
  - `NodeEnvironmentPlugin` Node 环境准备
  - `applyWebpackOptionsDefaults` 默认配置补充
  - `WebpackOptionsApply` 应用内置插件

## NodeEnvironmentPlugin Node 环境准备

```js
// source: lib/node/NodeEnvironmentPlugin.js
const fs = require("graceful-fs");

class NodeEnvironmentPlugin {
	/**
	 * @param {Object} options options
	 * @param {InfrastructureLogging} options.infrastructureLogging infrastructure logging options
	 */
	constructor(options) {
		this.options = options;
	}

	/**
	 * Apply the plugin
	 * @param {Compiler} compiler the compiler instance
	 * @returns {void}
	 */
	apply(compiler) {
		const { infrastructureLogging } = this.options;
    // 初始化 infrastructureLogger
		compiler.infrastructureLogger = createConsoleLogger({
			level: infrastructureLogging.level || "info",
			debug: infrastructureLogging.debug || false,
			console:
				infrastructureLogging.console ||
				nodeConsole({
					colors: infrastructureLogging.colors,
					appendOnly: infrastructureLogging.appendOnly,
					stream: infrastructureLogging.stream
				})
		});
    // 初始化 inputFileSystem
		compiler.inputFileSystem = new CachedInputFileSystem(fs, 60000);
		const inputFileSystem = compiler.inputFileSystem;
    // 初始化 outputFileSystem
		compiler.outputFileSystem = fs;
    // 初始化 intermediateFileSystem
		compiler.intermediateFileSystem = fs;
    // 初始化 watchFileSystem
		compiler.watchFileSystem = new NodeWatchFileSystem(
			compiler.inputFileSystem
		);
		compiler.hooks.beforeRun.tap("NodeEnvironmentPlugin", compiler => {
			if (compiler.inputFileSystem === inputFileSystem) {
				compiler.fsStartTime = Date.now();
				inputFileSystem.purge();
			}
		});
	}
}
```

- 核心概念
  - 初始化 compiler.infrastructureLogger = `createConsoleLogger`
  - 初始化 compiler.inputFileSystem = `CachedInputFileSystem(fs)`
  - 初始化 compiler.outputFileSystem = 直接依赖三方 `graceful-fs`
  - 初始化 compiler.intermediateFileSystem = 直接依赖三方 `graceful-fs`
  - 初始化 compiler.watchFileSystem = `NodeWatchFileSystem`

## WebpackOptionsApply 应用内置插件 ing

```js
// source: lib/WebpackOptionsApply.js
class WebpackOptionsApply extends OptionsApply {
	constructor() {
		super();
	}

	/**
	 * @param {WebpackOptions} options options object
	 * @param {Compiler} compiler compiler object
	 * @returns {WebpackOptions} options object
	 */
	process(options, compiler) {
		compiler.outputPath = options.output.path;
		compiler.recordsInputPath = options.recordsInputPath || null;
		compiler.recordsOutputPath = options.recordsOutputPath || null;
		compiler.name = options.name;

    // 配置 options.externals => ExternalsPlugin
		if (options.externals) {
			//@ts-expect-error https://github.com/microsoft/TypeScript/issues/41697
			const ExternalsPlugin = require("./ExternalsPlugin");
			new ExternalsPlugin(options.externalsType, options.externals).apply(
				compiler
			);
		}

    // 配置 options.externalsPresets.node => NodeTargetPlugin
		if (options.externalsPresets.node) {
			const NodeTargetPlugin = require("./node/NodeTargetPlugin");
			new NodeTargetPlugin().apply(compiler);
		}

    // 配置 options.externalsPresets.electronMain => ElectronTargetPlugin
		if (options.externalsPresets.electronMain) {
			//@ts-expect-error https://github.com/microsoft/TypeScript/issues/41697
			const ElectronTargetPlugin = require("./electron/ElectronTargetPlugin");
			new ElectronTargetPlugin("main").apply(compiler);
		}

    // 配置 options.externalsPresets.electronPreload => ElectronTargetPlugin
		if (options.externalsPresets.electronPreload) {
			//@ts-expect-error https://github.com/microsoft/TypeScript/issues/41697
			const ElectronTargetPlugin = require("./electron/ElectronTargetPlugin");
			new ElectronTargetPlugin("preload").apply(compiler);
		}

    // 配置 options.externalsPresets.electronRenderer => ElectronTargetPlugin
		if (options.externalsPresets.electronRenderer) {
			//@ts-expect-error https://github.com/microsoft/TypeScript/issues/41697
			const ElectronTargetPlugin = require("./electron/ElectronTargetPlugin");
			new ElectronTargetPlugin("renderer").apply(compiler);
		}

    // ! 更多 externals 先忽略
		if (
			options.externalsPresets.electron &&
			!options.externalsPresets.electronMain &&
			!options.externalsPresets.electronPreload &&
			!options.externalsPresets.electronRenderer
		) {
			//@ts-expect-error https://github.com/microsoft/TypeScript/issues/41697
			const ElectronTargetPlugin = require("./electron/ElectronTargetPlugin");
			new ElectronTargetPlugin().apply(compiler);
		}

    // ! 更多 externals 先忽略
		if (options.externalsPresets.nwjs) {
			//@ts-expect-error https://github.com/microsoft/TypeScript/issues/41697
			const ExternalsPlugin = require("./ExternalsPlugin");
			new ExternalsPlugin("node-commonjs", "nw.gui").apply(compiler);
		}

    // ! 更多 externals 先忽略
		if (options.externalsPresets.webAsync) {
			//@ts-expect-error https://github.com/microsoft/TypeScript/issues/41697
			const ExternalsPlugin = require("./ExternalsPlugin");
			new ExternalsPlugin("import", ({ request, dependencyType }, callback) => {
				if (dependencyType === "url") {
					if (/^(\/\/|https?:\/\/|#)/.test(request))
						return callback(null, `asset ${request}`);
				} else if (options.experiments.css && dependencyType === "css-import") {
					if (/^(\/\/|https?:\/\/|#)/.test(request))
						return callback(null, `css-import ${request}`);
				} else if (
					options.experiments.css &&
					/^(\/\/|https?:\/\/|std:)/.test(request)
				) {
					if (/^\.css(\?|$)/.test(request))
						return callback(null, `css-import ${request}`);
					return callback(null, `import ${request}`);
				}
				callback();
			}).apply(compiler);
		} else if (options.externalsPresets.web) {
			//@ts-expect-error https://github.com/microsoft/TypeScript/issues/41697
			const ExternalsPlugin = require("./ExternalsPlugin");
			new ExternalsPlugin("module", ({ request, dependencyType }, callback) => {
				if (dependencyType === "url") {
					if (/^(\/\/|https?:\/\/|#)/.test(request))
						return callback(null, `asset ${request}`);
				} else if (options.experiments.css && dependencyType === "css-import") {
					if (/^(\/\/|https?:\/\/|#)/.test(request))
						return callback(null, `css-import ${request}`);
				} else if (/^(\/\/|https?:\/\/|std:)/.test(request)) {
					if (options.experiments.css && /^\.css((\?)|$)/.test(request))
						return callback(null, `css-import ${request}`);
					return callback(null, `module ${request}`);
				}
				callback();
			}).apply(compiler);
		} else if (options.externalsPresets.node) {
			if (options.experiments.css) {
				//@ts-expect-error https://github.com/microsoft/TypeScript/issues/41697
				const ExternalsPlugin = require("./ExternalsPlugin");
				new ExternalsPlugin(
					"module",
					({ request, dependencyType }, callback) => {
						if (dependencyType === "url") {
							if (/^(\/\/|https?:\/\/|#)/.test(request))
								return callback(null, `asset ${request}`);
						} else if (dependencyType === "css-import") {
							if (/^(\/\/|https?:\/\/|#)/.test(request))
								return callback(null, `css-import ${request}`);
						} else if (/^(\/\/|https?:\/\/|std:)/.test(request)) {
							if (/^\.css(\?|$)/.test(request))
								return callback(null, `css-import ${request}`);
							return callback(null, `module ${request}`);
						}
						callback();
					}
				).apply(compiler);
			}
		}

    // 配置 options.externalsPresets.electronRenderer => ElectronTargetPlugin
		new ChunkPrefetchPreloadPlugin().apply(compiler);

    // 配置 options.output.chunkFormat => ArrayPushCallbackChunkFormatPlugin | CommonJsChunkFormatPlugin | ModuleChunkFormatPlugin
		if (typeof options.output.chunkFormat === "string") {
			switch (options.output.chunkFormat) {
				case "array-push": {
					const ArrayPushCallbackChunkFormatPlugin = require("./javascript/ArrayPushCallbackChunkFormatPlugin");
					new ArrayPushCallbackChunkFormatPlugin().apply(compiler);
					break;
				}
				case "commonjs": {
					const CommonJsChunkFormatPlugin = require("./javascript/CommonJsChunkFormatPlugin");
					new CommonJsChunkFormatPlugin().apply(compiler);
					break;
				}
				case "module": {
					const ModuleChunkFormatPlugin = require("./esm/ModuleChunkFormatPlugin");
					new ModuleChunkFormatPlugin().apply(compiler);
					break;
				}
				default:
					throw new Error(
						"Unsupported chunk format '" + options.output.chunkFormat + "'."
					);
			}
		}

    // 配置 options.output.enabledChunkLoadingTypes => EnableChunkLoadingPlugin
		if (options.output.enabledChunkLoadingTypes.length > 0) {
			for (const type of options.output.enabledChunkLoadingTypes) {
				const EnableChunkLoadingPlugin = require("./javascript/EnableChunkLoadingPlugin");
				new EnableChunkLoadingPlugin(type).apply(compiler);
			}
		}

    // 配置 options.output.enabledWasmLoadingTypes => EnableWasmLoadingPlugin
		if (options.output.enabledWasmLoadingTypes.length > 0) {
			for (const type of options.output.enabledWasmLoadingTypes) {
				const EnableWasmLoadingPlugin = require("./wasm/EnableWasmLoadingPlugin");
				new EnableWasmLoadingPlugin(type).apply(compiler);
			}
		}

    // 配置 options.output.enabledLibraryTypes => EnableLibraryPlugin
		if (options.output.enabledLibraryTypes.length > 0) {
			for (const type of options.output.enabledLibraryTypes) {
				const EnableLibraryPlugin = require("./library/EnableLibraryPlugin");
				new EnableLibraryPlugin(type).apply(compiler);
			}
		}

    // 配置 options.output.pathinfo => ModuleInfoHeaderPlugin
		if (options.output.pathinfo) {
			const ModuleInfoHeaderPlugin = require("./ModuleInfoHeaderPlugin");
			new ModuleInfoHeaderPlugin(options.output.pathinfo !== true).apply(
				compiler
			);
		}

    // 配置 options.output.clean => CleanPlugin
		if (options.output.clean) {
			const CleanPlugin = require("./CleanPlugin");
			new CleanPlugin(
				options.output.clean === true ? {} : options.output.clean
			).apply(compiler);
		}

    // 配置 options.devtool => EvalSourceMapDevToolPlugin | SourceMapDevToolPlugin | EvalDevToolModulePlugin
		if (options.devtool) {
			if (options.devtool.includes("source-map")) {
				const hidden = options.devtool.includes("hidden");
				const inline = options.devtool.includes("inline");
				const evalWrapped = options.devtool.includes("eval");
				const cheap = options.devtool.includes("cheap");
				const moduleMaps = options.devtool.includes("module");
				const noSources = options.devtool.includes("nosources");
				const Plugin = evalWrapped
					? require("./EvalSourceMapDevToolPlugin")
					: require("./SourceMapDevToolPlugin");
				new Plugin({
					filename: inline ? null : options.output.sourceMapFilename,
					moduleFilenameTemplate: options.output.devtoolModuleFilenameTemplate,
					fallbackModuleFilenameTemplate:
						options.output.devtoolFallbackModuleFilenameTemplate,
					append: hidden ? false : undefined,
					module: moduleMaps ? true : cheap ? false : true,
					columns: cheap ? false : true,
					noSources: noSources,
					namespace: options.output.devtoolNamespace
				}).apply(compiler);
			} else if (options.devtool.includes("eval")) {
				const EvalDevToolModulePlugin = require("./EvalDevToolModulePlugin");
				new EvalDevToolModulePlugin({
					moduleFilenameTemplate: options.output.devtoolModuleFilenameTemplate,
					namespace: options.output.devtoolNamespace
				}).apply(compiler);
			}
		}

    // 向 normalModuleFactory 注册 js parser 与 generator
		new JavascriptModulesPlugin().apply(compiler);
    // 向 normalModuleFactory 注册 json parser 与 generator
		new JsonModulesPlugin().apply(compiler);
    // 向 normalModuleFactory 注册 asset parser 与 generator
		new AssetModulesPlugin().apply(compiler);

    // options checking
		if (!options.experiments.outputModule) {
			if (options.output.module) {
				throw new Error(
					"'output.module: true' is only allowed when 'experiments.outputModule' is enabled"
				);
			}
			if (options.output.enabledLibraryTypes.includes("module")) {
				throw new Error(
					"library type \"module\" is only allowed when 'experiments.outputModule' is enabled"
				);
			}
			if (options.externalsType === "module") {
				throw new Error(
					"'externalsType: \"module\"' is only allowed when 'experiments.outputModule' is enabled"
				);
			}
		}

    // ? skip experiments
		if (options.experiments.syncWebAssembly) {
			const WebAssemblyModulesPlugin = require("./wasm-sync/WebAssemblyModulesPlugin");
			new WebAssemblyModulesPlugin({
				mangleImports: options.optimization.mangleWasmImports
			}).apply(compiler);
		}

    // ? skip experiments
		if (options.experiments.asyncWebAssembly) {
			const AsyncWebAssemblyModulesPlugin = require("./wasm-async/AsyncWebAssemblyModulesPlugin");
			new AsyncWebAssemblyModulesPlugin({
				mangleImports: options.optimization.mangleWasmImports
			}).apply(compiler);
		}

    // ? skip experiments
		if (options.experiments.css) {
			const CssModulesPlugin = require("./css/CssModulesPlugin");
			new CssModulesPlugin(options.experiments.css).apply(compiler);
		}

    // ? skip experiments
		if (options.experiments.lazyCompilation) {
			const LazyCompilationPlugin = require("./hmr/LazyCompilationPlugin");
			const lazyOptions =
				typeof options.experiments.lazyCompilation === "object"
					? options.experiments.lazyCompilation
					: null;
			new LazyCompilationPlugin({
				backend:
					typeof lazyOptions.backend === "function"
						? lazyOptions.backend
						: require("./hmr/lazyCompilationBackend")({
								...lazyOptions.backend,
								client:
									(lazyOptions.backend && lazyOptions.backend.client) ||
									require.resolve(
										`../hot/lazy-compilation-${
											options.externalsPresets.node ? "node" : "web"
										}.js`
									)
						  }),
				entries: !lazyOptions || lazyOptions.entries !== false,
				imports: !lazyOptions || lazyOptions.imports !== false,
				test: (lazyOptions && lazyOptions.test) || undefined
			}).apply(compiler);
		}

    // ? skip experiments
		if (options.experiments.buildHttp) {
			const HttpUriPlugin = require("./schemes/HttpUriPlugin");
			const httpOptions = options.experiments.buildHttp;
			new HttpUriPlugin(httpOptions).apply(compiler);
		}

    // 注入 entry => compilation.addEntry
		new EntryOptionPlugin().apply(compiler);
		// 触发 entryOption 钩子
		compiler.hooks.entryOption.call(options.context, options.entry);

    // runtime 模块注入
		new RuntimePlugin().apply(compiler);

		new InferAsyncModulesPlugin().apply(compiler);

		new DataUriPlugin().apply(compiler);
		new FileUriPlugin().apply(compiler);

		new CompatibilityPlugin().apply(compiler);
		new HarmonyModulesPlugin({
			topLevelAwait: options.experiments.topLevelAwait
		}).apply(compiler);
		if (options.amd !== false) {
			const AMDPlugin = require("./dependencies/AMDPlugin");
			const RequireJsStuffPlugin = require("./RequireJsStuffPlugin");
			new AMDPlugin(options.amd || {}).apply(compiler);
			new RequireJsStuffPlugin().apply(compiler);
		}
		new CommonJsPlugin().apply(compiler);
		new LoaderPlugin({}).apply(compiler);
		if (options.node !== false) {
			const NodeStuffPlugin = require("./NodeStuffPlugin");
			new NodeStuffPlugin(options.node).apply(compiler);
		}
		new APIPlugin({
			module: options.output.module
		}).apply(compiler);
		new ExportsInfoApiPlugin().apply(compiler);
		new WebpackIsIncludedPlugin().apply(compiler);
		new ConstPlugin().apply(compiler);
		new UseStrictPlugin().apply(compiler);
		new RequireIncludePlugin().apply(compiler);
		new RequireEnsurePlugin().apply(compiler);
		new RequireContextPlugin().apply(compiler);
		new ImportPlugin().apply(compiler);
		new ImportMetaContextPlugin().apply(compiler);
		new SystemPlugin().apply(compiler);
		new ImportMetaPlugin().apply(compiler);
		new URLPlugin().apply(compiler);
		new WorkerPlugin(
			options.output.workerChunkLoading,
			options.output.workerWasmLoading,
			options.output.module,
			options.output.workerPublicPath
		).apply(compiler);

		new DefaultStatsFactoryPlugin().apply(compiler);
		new DefaultStatsPresetPlugin().apply(compiler);
		new DefaultStatsPrinterPlugin().apply(compiler);

		new JavascriptMetaInfoPlugin().apply(compiler);

		if (typeof options.mode !== "string") {
			const WarnNoModeSetPlugin = require("./WarnNoModeSetPlugin");
			new WarnNoModeSetPlugin().apply(compiler);
		}

		const EnsureChunkConditionsPlugin = require("./optimize/EnsureChunkConditionsPlugin");
		new EnsureChunkConditionsPlugin().apply(compiler);
		if (options.optimization.removeAvailableModules) {
			const RemoveParentModulesPlugin = require("./optimize/RemoveParentModulesPlugin");
			new RemoveParentModulesPlugin().apply(compiler);
		}
		if (options.optimization.removeEmptyChunks) {
			const RemoveEmptyChunksPlugin = require("./optimize/RemoveEmptyChunksPlugin");
			new RemoveEmptyChunksPlugin().apply(compiler);
		}
		if (options.optimization.mergeDuplicateChunks) {
			const MergeDuplicateChunksPlugin = require("./optimize/MergeDuplicateChunksPlugin");
			new MergeDuplicateChunksPlugin().apply(compiler);
		}
		if (options.optimization.flagIncludedChunks) {
			const FlagIncludedChunksPlugin = require("./optimize/FlagIncludedChunksPlugin");
			new FlagIncludedChunksPlugin().apply(compiler);
		}
		if (options.optimization.sideEffects) {
			const SideEffectsFlagPlugin = require("./optimize/SideEffectsFlagPlugin");
			new SideEffectsFlagPlugin(
				options.optimization.sideEffects === true
			).apply(compiler);
		}
		if (options.optimization.providedExports) {
			const FlagDependencyExportsPlugin = require("./FlagDependencyExportsPlugin");
			new FlagDependencyExportsPlugin().apply(compiler);
		}
		if (options.optimization.usedExports) {
			const FlagDependencyUsagePlugin = require("./FlagDependencyUsagePlugin");
			new FlagDependencyUsagePlugin(
				options.optimization.usedExports === "global"
			).apply(compiler);
		}
		if (options.optimization.innerGraph) {
			const InnerGraphPlugin = require("./optimize/InnerGraphPlugin");
			new InnerGraphPlugin().apply(compiler);
		}
		if (options.optimization.mangleExports) {
			const MangleExportsPlugin = require("./optimize/MangleExportsPlugin");
			new MangleExportsPlugin(
				options.optimization.mangleExports !== "size"
			).apply(compiler);
		}
		if (options.optimization.concatenateModules) {
			const ModuleConcatenationPlugin = require("./optimize/ModuleConcatenationPlugin");
			new ModuleConcatenationPlugin().apply(compiler);
		}
		if (options.optimization.splitChunks) {
			const SplitChunksPlugin = require("./optimize/SplitChunksPlugin");
			new SplitChunksPlugin(options.optimization.splitChunks).apply(compiler);
		}
		if (options.optimization.runtimeChunk) {
			const RuntimeChunkPlugin = require("./optimize/RuntimeChunkPlugin");
			new RuntimeChunkPlugin(options.optimization.runtimeChunk).apply(compiler);
		}
		if (!options.optimization.emitOnErrors) {
			const NoEmitOnErrorsPlugin = require("./NoEmitOnErrorsPlugin");
			new NoEmitOnErrorsPlugin().apply(compiler);
		}
		if (options.optimization.realContentHash) {
			const RealContentHashPlugin = require("./optimize/RealContentHashPlugin");
			new RealContentHashPlugin({
				hashFunction: options.output.hashFunction,
				hashDigest: options.output.hashDigest
			}).apply(compiler);
		}
		if (options.optimization.checkWasmTypes) {
			const WasmFinalizeExportsPlugin = require("./wasm-sync/WasmFinalizeExportsPlugin");
			new WasmFinalizeExportsPlugin().apply(compiler);
		}
		const moduleIds = options.optimization.moduleIds;
		if (moduleIds) {
			switch (moduleIds) {
				case "natural": {
					const NaturalModuleIdsPlugin = require("./ids/NaturalModuleIdsPlugin");
					new NaturalModuleIdsPlugin().apply(compiler);
					break;
				}
				case "named": {
					const NamedModuleIdsPlugin = require("./ids/NamedModuleIdsPlugin");
					new NamedModuleIdsPlugin().apply(compiler);
					break;
				}
				case "hashed": {
					const WarnDeprecatedOptionPlugin = require("./WarnDeprecatedOptionPlugin");
					const HashedModuleIdsPlugin = require("./ids/HashedModuleIdsPlugin");
					new WarnDeprecatedOptionPlugin(
						"optimization.moduleIds",
						"hashed",
						"deterministic"
					).apply(compiler);
					new HashedModuleIdsPlugin({
						hashFunction: options.output.hashFunction
					}).apply(compiler);
					break;
				}
				case "deterministic": {
					const DeterministicModuleIdsPlugin = require("./ids/DeterministicModuleIdsPlugin");
					new DeterministicModuleIdsPlugin().apply(compiler);
					break;
				}
				case "size": {
					const OccurrenceModuleIdsPlugin = require("./ids/OccurrenceModuleIdsPlugin");
					new OccurrenceModuleIdsPlugin({
						prioritiseInitial: true
					}).apply(compiler);
					break;
				}
				default:
					throw new Error(
						`webpack bug: moduleIds: ${moduleIds} is not implemented`
					);
			}
		}
		const chunkIds = options.optimization.chunkIds;
		if (chunkIds) {
			switch (chunkIds) {
				case "natural": {
					const NaturalChunkIdsPlugin = require("./ids/NaturalChunkIdsPlugin");
					new NaturalChunkIdsPlugin().apply(compiler);
					break;
				}
				case "named": {
					const NamedChunkIdsPlugin = require("./ids/NamedChunkIdsPlugin");
					new NamedChunkIdsPlugin().apply(compiler);
					break;
				}
				case "deterministic": {
					const DeterministicChunkIdsPlugin = require("./ids/DeterministicChunkIdsPlugin");
					new DeterministicChunkIdsPlugin().apply(compiler);
					break;
				}
				case "size": {
					//@ts-expect-error https://github.com/microsoft/TypeScript/issues/41697
					const OccurrenceChunkIdsPlugin = require("./ids/OccurrenceChunkIdsPlugin");
					new OccurrenceChunkIdsPlugin({
						prioritiseInitial: true
					}).apply(compiler);
					break;
				}
				case "total-size": {
					//@ts-expect-error https://github.com/microsoft/TypeScript/issues/41697
					const OccurrenceChunkIdsPlugin = require("./ids/OccurrenceChunkIdsPlugin");
					new OccurrenceChunkIdsPlugin({
						prioritiseInitial: false
					}).apply(compiler);
					break;
				}
				default:
					throw new Error(
						`webpack bug: chunkIds: ${chunkIds} is not implemented`
					);
			}
		}
		if (options.optimization.nodeEnv) {
			const DefinePlugin = require("./DefinePlugin");
			new DefinePlugin({
				"process.env.NODE_ENV": JSON.stringify(options.optimization.nodeEnv)
			}).apply(compiler);
		}
		if (options.optimization.minimize) {
			for (const minimizer of options.optimization.minimizer) {
				if (typeof minimizer === "function") {
					minimizer.call(compiler, compiler);
				} else if (minimizer !== "..." && minimizer) {
					minimizer.apply(compiler);
				}
			}
		}

		if (options.performance) {
			const SizeLimitsPlugin = require("./performance/SizeLimitsPlugin");
			new SizeLimitsPlugin(options.performance).apply(compiler);
		}

		new TemplatedPathPlugin().apply(compiler);

		new RecordIdsPlugin({
			portableIds: options.optimization.portableRecords
		}).apply(compiler);

		new WarnCaseSensitiveModulesPlugin().apply(compiler);

		const AddManagedPathsPlugin = require("./cache/AddManagedPathsPlugin");
		new AddManagedPathsPlugin(
			options.snapshot.managedPaths,
			options.snapshot.immutablePaths
		).apply(compiler);

		if (options.cache && typeof options.cache === "object") {
			const cacheOptions = options.cache;
			switch (cacheOptions.type) {
				case "memory": {
					if (isFinite(cacheOptions.maxGenerations)) {
						//@ts-expect-error https://github.com/microsoft/TypeScript/issues/41697
						const MemoryWithGcCachePlugin = require("./cache/MemoryWithGcCachePlugin");
						new MemoryWithGcCachePlugin({
							maxGenerations: cacheOptions.maxGenerations
						}).apply(compiler);
					} else {
						//@ts-expect-error https://github.com/microsoft/TypeScript/issues/41697
						const MemoryCachePlugin = require("./cache/MemoryCachePlugin");
						new MemoryCachePlugin().apply(compiler);
					}
					if (cacheOptions.cacheUnaffected) {
						if (!options.experiments.cacheUnaffected) {
							throw new Error(
								"'cache.cacheUnaffected: true' is only allowed when 'experiments.cacheUnaffected' is enabled"
							);
						}
						compiler.moduleMemCaches = new Map();
					}
					break;
				}
				case "filesystem": {
					const AddBuildDependenciesPlugin = require("./cache/AddBuildDependenciesPlugin");
					for (const key in cacheOptions.buildDependencies) {
						const list = cacheOptions.buildDependencies[key];
						new AddBuildDependenciesPlugin(list).apply(compiler);
					}
					if (!isFinite(cacheOptions.maxMemoryGenerations)) {
						//@ts-expect-error https://github.com/microsoft/TypeScript/issues/41697
						const MemoryCachePlugin = require("./cache/MemoryCachePlugin");
						new MemoryCachePlugin().apply(compiler);
					} else if (cacheOptions.maxMemoryGenerations !== 0) {
						//@ts-expect-error https://github.com/microsoft/TypeScript/issues/41697
						const MemoryWithGcCachePlugin = require("./cache/MemoryWithGcCachePlugin");
						new MemoryWithGcCachePlugin({
							maxGenerations: cacheOptions.maxMemoryGenerations
						}).apply(compiler);
					}
					if (cacheOptions.memoryCacheUnaffected) {
						if (!options.experiments.cacheUnaffected) {
							throw new Error(
								"'cache.memoryCacheUnaffected: true' is only allowed when 'experiments.cacheUnaffected' is enabled"
							);
						}
						compiler.moduleMemCaches = new Map();
					}
					switch (cacheOptions.store) {
						case "pack": {
							const IdleFileCachePlugin = require("./cache/IdleFileCachePlugin");
							const PackFileCacheStrategy = require("./cache/PackFileCacheStrategy");
							new IdleFileCachePlugin(
								new PackFileCacheStrategy({
									compiler,
									fs: compiler.intermediateFileSystem,
									context: options.context,
									cacheLocation: cacheOptions.cacheLocation,
									version: cacheOptions.version,
									logger: compiler.getInfrastructureLogger(
										"webpack.cache.PackFileCacheStrategy"
									),
									snapshot: options.snapshot,
									maxAge: cacheOptions.maxAge,
									profile: cacheOptions.profile,
									allowCollectingMemory: cacheOptions.allowCollectingMemory,
									compression: cacheOptions.compression,
									readonly: cacheOptions.readonly
								}),
								cacheOptions.idleTimeout,
								cacheOptions.idleTimeoutForInitialStore,
								cacheOptions.idleTimeoutAfterLargeChanges
							).apply(compiler);
							break;
						}
						default:
							throw new Error("Unhandled value for cache.store");
					}
					break;
				}
				default:
					// @ts-expect-error Property 'type' does not exist on type 'never'. ts(2339)
					throw new Error(`Unknown cache type ${cacheOptions.type}`);
			}
		}
		new ResolverCachePlugin().apply(compiler);

		if (options.ignoreWarnings && options.ignoreWarnings.length > 0) {
			const IgnoreWarningsPlugin = require("./IgnoreWarningsPlugin");
			new IgnoreWarningsPlugin(options.ignoreWarnings).apply(compiler);
		}

		compiler.hooks.afterPlugins.call(compiler);
		if (!compiler.inputFileSystem) {
			throw new Error("No input filesystem provided");
		}
		compiler.resolverFactory.hooks.resolveOptions
			.for("normal")
			.tap("WebpackOptionsApply", resolveOptions => {
				resolveOptions = cleverMerge(options.resolve, resolveOptions);
				resolveOptions.fileSystem = compiler.inputFileSystem;
				return resolveOptions;
			});
		compiler.resolverFactory.hooks.resolveOptions
			.for("context")
			.tap("WebpackOptionsApply", resolveOptions => {
				resolveOptions = cleverMerge(options.resolve, resolveOptions);
				resolveOptions.fileSystem = compiler.inputFileSystem;
				resolveOptions.resolveToContext = true;
				return resolveOptions;
			});
		compiler.resolverFactory.hooks.resolveOptions
			.for("loader")
			.tap("WebpackOptionsApply", resolveOptions => {
				resolveOptions = cleverMerge(options.resolveLoader, resolveOptions);
				resolveOptions.fileSystem = compiler.inputFileSystem;
				return resolveOptions;
			});
		compiler.hooks.afterResolvers.call(compiler);
		return options;
	}
}
```

- 核心概念
  - externals 相关配置
    - options.externals => `ExternalsPlugin`
    - options.externalsPresets.node => `NodeTargetPlugin`
    - options.externalsPresets.electronMain => `ElectronTargetPlugin`
    - options.externalsPresets.electronPreload => `ElectronTargetPlugin`
    - options.externalsPresets.electronRenderer => `ElectronTargetPlugin`
  - `ChunkPrefetchPreloadPlugin` 插件 ???
  - output 相关配置
    - options.output.chunkFormat => `ArrayPushCallbackChunkFormatPlugin | CommonJsChunkFormatPlugin | ModuleChunkFormatPlugin`
    - options.output.enabledChunkLoadingTypes => `EnableChunkLoadingPlugin`
    - options.output.enabledWasmLoadingTypes => `EnableWasmLoadingPlugin`
    - options.output.enabledLibraryTypes => `EnableLibraryPlugin`
    - options.output.pathinfo => `ModuleInfoHeaderPlugin`
    - options.output.clean => `CleanPlugin`
  - options.devtool => `EvalSourceMapDevToolPlugin | SourceMapDevToolPlugin | EvalDevToolModulePlugin`
  - `JavascriptModulesPlugin` 注册 js 类型 parser、generator
  - `JsonModulesPlugin` 注册 json 类型 parser、generator
  - `AssetModulesPlugin` 注册 asset 类型 parser、generator
  - `EntryOptionPlugin` 注入 entry
  - `RuntimePlugin` 注入 runtime 模块
    - `compilation#runtimeRequirementInModule`
    - `compilation#runtimeRequirementInTree`

## JavascriptModulesPlugin 模块解析工厂

在 `compiler#compilation` 钩子上，向 `normalModuleFactory` 注册 `JavascriptParser`、`JavascriptGenerator` 等工具

```js
// source: lib/javascript/JavascriptModulesPlugin.js
/** @type {WeakMap<Compilation, CompilationHooks>} */
const compilationHooksMap = new WeakMap();

const PLUGIN_NAME = "JavascriptModulesPlugin";

class JavascriptModulesPlugin {
	/**
	 * ? 按 compilation 创建 hooks
	 * @param {Compilation} compilation the compilation
	 * @returns {CompilationHooks} the attached hooks
	 */
	static getCompilationHooks(compilation) {
		if (!(compilation instanceof Compilation)) {
			throw new TypeError(
				"The 'compilation' argument must be an instance of Compilation"
			);
		}
		let hooks = compilationHooksMap.get(compilation);
		if (hooks === undefined) {
			hooks = {
				renderModuleContent: new SyncWaterfallHook([
					"source",
					"module",
					"renderContext"
				]),
				renderModuleContainer: new SyncWaterfallHook([
					"source",
					"module",
					"renderContext"
				]),
				renderModulePackage: new SyncWaterfallHook([
					"source",
					"module",
					"renderContext"
				]),
				render: new SyncWaterfallHook(["source", "renderContext"]),
				renderContent: new SyncWaterfallHook(["source", "renderContext"]),
				renderStartup: new SyncWaterfallHook([
					"source",
					"module",
					"startupRenderContext"
				]),
				renderChunk: new SyncWaterfallHook(["source", "renderContext"]),
				renderMain: new SyncWaterfallHook(["source", "renderContext"]),
				renderRequire: new SyncWaterfallHook(["code", "renderContext"]),
				inlineInRuntimeBailout: new SyncBailHook(["module", "renderContext"]),
				embedInRuntimeBailout: new SyncBailHook(["module", "renderContext"]),
				strictRuntimeBailout: new SyncBailHook(["renderContext"]),
				chunkHash: new SyncHook(["chunk", "hash", "context"]),
				useSourceMap: new SyncBailHook(["chunk", "renderContext"])
			};
			compilationHooksMap.set(compilation, hooks);
		}
		return hooks;
	}

	constructor(options = {}) {
		this.options = options;
		/** @type {WeakMap<Source, TODO>} */
		this._moduleFactoryCache = new WeakMap();
	}

	/**
	 * Apply the plugin
	 * @param {Compiler} compiler the compiler instance
	 * @returns {void}
	 */
	apply(compiler) {
		compiler.hooks.compilation.tap(
			PLUGIN_NAME,
			(compilation, { normalModuleFactory }) => {
				const hooks = JavascriptModulesPlugin.getCompilationHooks(compilation);
				// 注册 parser
				normalModuleFactory.hooks.createParser
					.for(JAVASCRIPT_MODULE_TYPE_AUTO)
					.tap(PLUGIN_NAME, options => {
						return new JavascriptParser("auto");
					});
				normalModuleFactory.hooks.createParser
					.for(JAVASCRIPT_MODULE_TYPE_DYNAMIC)
					.tap(PLUGIN_NAME, options => {
						return new JavascriptParser("script");
					});
				normalModuleFactory.hooks.createParser
					.for(JAVASCRIPT_MODULE_TYPE_ESM)
					.tap(PLUGIN_NAME, options => {
						return new JavascriptParser("module");
					});
			  // 注册 generator
				normalModuleFactory.hooks.createGenerator
					.for(JAVASCRIPT_MODULE_TYPE_AUTO)
					.tap(PLUGIN_NAME, () => {
						return new JavascriptGenerator();
					});
				normalModuleFactory.hooks.createGenerator
					.for(JAVASCRIPT_MODULE_TYPE_DYNAMIC)
					.tap(PLUGIN_NAME, () => {
						return new JavascriptGenerator();
					});
				normalModuleFactory.hooks.createGenerator
					.for(JAVASCRIPT_MODULE_TYPE_ESM)
					.tap(PLUGIN_NAME, () => {
						return new JavascriptGenerator();
					});
				compilation.hooks.renderManifest.tap(PLUGIN_NAME, (result, options) => {
					const {
						hash,
						chunk,
						chunkGraph,
						moduleGraph,
						runtimeTemplate,
						dependencyTemplates,
						outputOptions,
						codeGenerationResults
					} = options;

					const hotUpdateChunk = chunk instanceof HotUpdateChunk ? chunk : null;

					let render;
					const filenameTemplate =
						JavascriptModulesPlugin.getChunkFilenameTemplate(
							chunk,
							outputOptions
						);
					if (hotUpdateChunk) {
						render = () =>
							this.renderChunk(
								{
									chunk,
									dependencyTemplates,
									runtimeTemplate,
									moduleGraph,
									chunkGraph,
									codeGenerationResults,
									strictMode: runtimeTemplate.isModule()
								},
								hooks
							);
					} else if (chunk.hasRuntime()) {
						render = () =>
							this.renderMain(
								{
									hash,
									chunk,
									dependencyTemplates,
									runtimeTemplate,
									moduleGraph,
									chunkGraph,
									codeGenerationResults,
									strictMode: runtimeTemplate.isModule()
								},
								hooks,
								compilation
							);
					} else {
						if (!chunkHasJs(chunk, chunkGraph)) {
							return result;
						}

						render = () =>
							this.renderChunk(
								{
									chunk,
									dependencyTemplates,
									runtimeTemplate,
									moduleGraph,
									chunkGraph,
									codeGenerationResults,
									strictMode: runtimeTemplate.isModule()
								},
								hooks
							);
					}

					result.push({
						render,
						filenameTemplate,
						pathOptions: {
							hash,
							runtime: chunk.runtime,
							chunk,
							contentHashType: "javascript"
						},
						info: {
							javascriptModule: compilation.runtimeTemplate.isModule()
						},
						identifier: hotUpdateChunk
							? `hotupdatechunk${chunk.id}`
							: `chunk${chunk.id}`,
						hash: chunk.contentHash.javascript
					});

					return result;
				});
				compilation.hooks.chunkHash.tap(PLUGIN_NAME, (chunk, hash, context) => {
					hooks.chunkHash.call(chunk, hash, context);
					if (chunk.hasRuntime()) {
						this.updateHashWithBootstrap(
							hash,
							{
								hash: "0000",
								chunk,
								codeGenerationResults: context.codeGenerationResults,
								chunkGraph: context.chunkGraph,
								moduleGraph: context.moduleGraph,
								runtimeTemplate: context.runtimeTemplate
							},
							hooks
						);
					}
				});
				compilation.hooks.contentHash.tap(PLUGIN_NAME, chunk => {
					const {
						chunkGraph,
						codeGenerationResults,
						moduleGraph,
						runtimeTemplate,
						outputOptions: {
							hashSalt,
							hashDigest,
							hashDigestLength,
							hashFunction
						}
					} = compilation;
					const hash = createHash(hashFunction);
					if (hashSalt) hash.update(hashSalt);
					if (chunk.hasRuntime()) {
						this.updateHashWithBootstrap(
							hash,
							{
								hash: "0000",
								chunk,
								codeGenerationResults,
								chunkGraph: compilation.chunkGraph,
								moduleGraph: compilation.moduleGraph,
								runtimeTemplate: compilation.runtimeTemplate
							},
							hooks
						);
					} else {
						hash.update(`${chunk.id} `);
						hash.update(chunk.ids ? chunk.ids.join(",") : "");
					}
					hooks.chunkHash.call(chunk, hash, {
						chunkGraph,
						codeGenerationResults,
						moduleGraph,
						runtimeTemplate
					});
					const modules = chunkGraph.getChunkModulesIterableBySourceType(
						chunk,
						"javascript"
					);
					if (modules) {
						const xor = new StringXor();
						for (const m of modules) {
							xor.add(chunkGraph.getModuleHash(m, chunk.runtime));
						}
						xor.updateHash(hash);
					}
					const runtimeModules = chunkGraph.getChunkModulesIterableBySourceType(
						chunk,
						WEBPACK_MODULE_TYPE_RUNTIME
					);
					if (runtimeModules) {
						const xor = new StringXor();
						for (const m of runtimeModules) {
							xor.add(chunkGraph.getModuleHash(m, chunk.runtime));
						}
						xor.updateHash(hash);
					}
					const digest = /** @type {string} */ (hash.digest(hashDigest));
					chunk.contentHash.javascript = nonNumericOnlyHash(
						digest,
						hashDigestLength
					);
				});
				compilation.hooks.additionalTreeRuntimeRequirements.tap(
					PLUGIN_NAME,
					(chunk, set, { chunkGraph }) => {
						if (
							!set.has(RuntimeGlobals.startupNoDefault) &&
							chunkGraph.hasChunkEntryDependentChunks(chunk)
						) {
							set.add(RuntimeGlobals.onChunksLoaded);
							set.add(RuntimeGlobals.require);
						}
					}
				);
				compilation.hooks.executeModule.tap(PLUGIN_NAME, (options, context) => {
					const source = options.codeGenerationResult.sources.get("javascript");
					if (source === undefined) return;
					const { module, moduleObject } = options;
					const code = source.source();

					const fn = vm.runInThisContext(
						`(function(${module.moduleArgument}, ${module.exportsArgument}, ${RuntimeGlobals.require}) {\n${code}\n/**/})`,
						{
							filename: module.identifier(),
							lineOffset: -1
						}
					);
					try {
						fn.call(
							moduleObject.exports,
							moduleObject,
							moduleObject.exports,
							context.__webpack_require__
						);
					} catch (e) {
						e.stack += printGeneratedCodeForStack(
							options.module,
							/** @type {string} */ (code)
						);
						throw e;
					}
				});
				compilation.hooks.executeModule.tap(PLUGIN_NAME, (options, context) => {
					const source = options.codeGenerationResult.sources.get("runtime");
					if (source === undefined) return;
					let code = source.source();
					if (typeof code !== "string") code = code.toString();

					const fn = vm.runInThisContext(
						`(function(${RuntimeGlobals.require}) {\n${code}\n/**/})`,
						{
							filename: options.module.identifier(),
							lineOffset: -1
						}
					);
					try {
						fn.call(null, context.__webpack_require__);
					} catch (e) {
						e.stack += printGeneratedCodeForStack(options.module, code);
						throw e;
					}
				});
			}
		);
	}

	static getChunkFilenameTemplate(chunk, outputOptions) {
		if (chunk.filenameTemplate) {
			return chunk.filenameTemplate;
		} else if (chunk instanceof HotUpdateChunk) {
			return outputOptions.hotUpdateChunkFilename;
		} else if (chunk.canBeInitial()) {
			return outputOptions.filename;
		} else {
			return outputOptions.chunkFilename;
		}
	}

	/**
	 * @param {Module} module the rendered module
	 * @param {ChunkRenderContext} renderContext options object
	 * @param {CompilationHooks} hooks hooks
	 * @param {boolean} factory true: renders as factory method, false: pure module content
	 * @returns {Source} the newly generated source from rendering
	 */
	renderModule(module, renderContext, hooks, factory) {
		const {
			chunk,
			chunkGraph,
			runtimeTemplate,
			codeGenerationResults,
			strictMode
		} = renderContext;
		try {
			const codeGenResult = codeGenerationResults.get(module, chunk.runtime);
			const moduleSource = codeGenResult.sources.get("javascript");
			if (!moduleSource) return null;
			if (codeGenResult.data !== undefined) {
				const chunkInitFragments = codeGenResult.data.get("chunkInitFragments");
				if (chunkInitFragments) {
					for (const i of chunkInitFragments)
						renderContext.chunkInitFragments.push(i);
				}
			}
			const moduleSourcePostContent = tryRunOrWebpackError(
				() =>
					hooks.renderModuleContent.call(moduleSource, module, renderContext),
				"JavascriptModulesPlugin.getCompilationHooks().renderModuleContent"
			);
			let moduleSourcePostContainer;
			if (factory) {
				const runtimeRequirements = chunkGraph.getModuleRuntimeRequirements(
					module,
					chunk.runtime
				);
				const needModule = runtimeRequirements.has(RuntimeGlobals.module);
				const needExports = runtimeRequirements.has(RuntimeGlobals.exports);
				const needRequire =
					runtimeRequirements.has(RuntimeGlobals.require) ||
					runtimeRequirements.has(RuntimeGlobals.requireScope);
				const needThisAsExports = runtimeRequirements.has(
					RuntimeGlobals.thisAsExports
				);
				const needStrict = module.buildInfo.strict && !strictMode;
				const cacheEntry = this._moduleFactoryCache.get(
					moduleSourcePostContent
				);
				let source;
				if (
					cacheEntry &&
					cacheEntry.needModule === needModule &&
					cacheEntry.needExports === needExports &&
					cacheEntry.needRequire === needRequire &&
					cacheEntry.needThisAsExports === needThisAsExports &&
					cacheEntry.needStrict === needStrict
				) {
					source = cacheEntry.source;
				} else {
					const factorySource = new ConcatSource();
					const args = [];
					if (needExports || needRequire || needModule)
						args.push(
							needModule
								? module.moduleArgument
								: "__unused_webpack_" + module.moduleArgument
						);
					if (needExports || needRequire)
						args.push(
							needExports
								? module.exportsArgument
								: "__unused_webpack_" + module.exportsArgument
						);
					if (needRequire) args.push(RuntimeGlobals.require);
					if (!needThisAsExports && runtimeTemplate.supportsArrowFunction()) {
						factorySource.add("/***/ ((" + args.join(", ") + ") => {\n\n");
					} else {
						factorySource.add("/***/ (function(" + args.join(", ") + ") {\n\n");
					}
					if (needStrict) {
						factorySource.add('"use strict";\n');
					}
					factorySource.add(moduleSourcePostContent);
					factorySource.add("\n\n/***/ })");
					source = new CachedSource(factorySource);
					this._moduleFactoryCache.set(moduleSourcePostContent, {
						source,
						needModule,
						needExports,
						needRequire,
						needThisAsExports,
						needStrict
					});
				}
				moduleSourcePostContainer = tryRunOrWebpackError(
					() => hooks.renderModuleContainer.call(source, module, renderContext),
					"JavascriptModulesPlugin.getCompilationHooks().renderModuleContainer"
				);
			} else {
				moduleSourcePostContainer = moduleSourcePostContent;
			}
			return tryRunOrWebpackError(
				() =>
					hooks.renderModulePackage.call(
						moduleSourcePostContainer,
						module,
						renderContext
					),
				"JavascriptModulesPlugin.getCompilationHooks().renderModulePackage"
			);
		} catch (e) {
			e.module = module;
			throw e;
		}
	}

	/**
	 * @param {RenderContext} renderContext the render context
	 * @param {CompilationHooks} hooks hooks
	 * @returns {Source} the rendered source
	 */
	renderChunk(renderContext, hooks) {
		const { chunk, chunkGraph } = renderContext;
		const modules = chunkGraph.getOrderedChunkModulesIterableBySourceType(
			chunk,
			"javascript",
			compareModulesByIdentifier
		);
		const allModules = modules ? Array.from(modules) : [];
		let strictHeader;
		let allStrict = renderContext.strictMode;
		if (!allStrict && allModules.every(m => m.buildInfo.strict)) {
			const strictBailout = hooks.strictRuntimeBailout.call(renderContext);
			strictHeader = strictBailout
				? `// runtime can't be in strict mode because ${strictBailout}.\n`
				: '"use strict";\n';
			if (!strictBailout) allStrict = true;
		}
		/** @type {ChunkRenderContext} */
		const chunkRenderContext = {
			...renderContext,
			chunkInitFragments: [],
			strictMode: allStrict
		};
		const moduleSources =
			Template.renderChunkModules(chunkRenderContext, allModules, module =>
				this.renderModule(module, chunkRenderContext, hooks, true)
			) || new RawSource("{}");
		let source = tryRunOrWebpackError(
			() => hooks.renderChunk.call(moduleSources, chunkRenderContext),
			"JavascriptModulesPlugin.getCompilationHooks().renderChunk"
		);
		source = tryRunOrWebpackError(
			() => hooks.renderContent.call(source, chunkRenderContext),
			"JavascriptModulesPlugin.getCompilationHooks().renderContent"
		);
		if (!source) {
			throw new Error(
				"JavascriptModulesPlugin error: JavascriptModulesPlugin.getCompilationHooks().renderContent plugins should return something"
			);
		}
		source = InitFragment.addToSource(
			source,
			chunkRenderContext.chunkInitFragments,
			chunkRenderContext
		);
		source = tryRunOrWebpackError(
			() => hooks.render.call(source, chunkRenderContext),
			"JavascriptModulesPlugin.getCompilationHooks().render"
		);
		if (!source) {
			throw new Error(
				"JavascriptModulesPlugin error: JavascriptModulesPlugin.getCompilationHooks().render plugins should return something"
			);
		}
		chunk.rendered = true;
		return strictHeader
			? new ConcatSource(strictHeader, source, ";")
			: renderContext.runtimeTemplate.isModule()
			? source
			: new ConcatSource(source, ";");
	}

	/**
	 * @param {MainRenderContext} renderContext options object
	 * @param {CompilationHooks} hooks hooks
	 * @param {Compilation} compilation the compilation
	 * @returns {Source} the newly generated source from rendering
	 */
	renderMain(renderContext, hooks, compilation) {
		const { chunk, chunkGraph, runtimeTemplate } = renderContext;

		const runtimeRequirements = chunkGraph.getTreeRuntimeRequirements(chunk);
		const iife = runtimeTemplate.isIIFE();

		const bootstrap = this.renderBootstrap(renderContext, hooks);
		const useSourceMap = hooks.useSourceMap.call(chunk, renderContext);

		const allModules = Array.from(
			chunkGraph.getOrderedChunkModulesIterableBySourceType(
				chunk,
				"javascript",
				compareModulesByIdentifier
			) || []
		);

		const hasEntryModules = chunkGraph.getNumberOfEntryModules(chunk) > 0;
		/** @type {Set<Module> | undefined} */
		let inlinedModules;
		if (bootstrap.allowInlineStartup && hasEntryModules) {
			inlinedModules = new Set(chunkGraph.getChunkEntryModulesIterable(chunk));
		}

		let source = new ConcatSource();
		let prefix;
		if (iife) {
			if (runtimeTemplate.supportsArrowFunction()) {
				source.add("/******/ (() => { // webpackBootstrap\n");
			} else {
				source.add("/******/ (function() { // webpackBootstrap\n");
			}
			prefix = "/******/ \t";
		} else {
			prefix = "/******/ ";
		}
		let allStrict = renderContext.strictMode;
		if (!allStrict && allModules.every(m => m.buildInfo.strict)) {
			const strictBailout = hooks.strictRuntimeBailout.call(renderContext);
			if (strictBailout) {
				source.add(
					prefix +
						`// runtime can't be in strict mode because ${strictBailout}.\n`
				);
			} else {
				allStrict = true;
				source.add(prefix + '"use strict";\n');
			}
		}

		/** @type {ChunkRenderContext} */
		const chunkRenderContext = {
			...renderContext,
			chunkInitFragments: [],
			strictMode: allStrict
		};

		const chunkModules = Template.renderChunkModules(
			chunkRenderContext,
			inlinedModules
				? allModules.filter(
						m => !(/** @type {Set<Module>} */ (inlinedModules).has(m))
				  )
				: allModules,
			module => this.renderModule(module, chunkRenderContext, hooks, true),
			prefix
		);
		if (
			chunkModules ||
			runtimeRequirements.has(RuntimeGlobals.moduleFactories) ||
			runtimeRequirements.has(RuntimeGlobals.moduleFactoriesAddOnly) ||
			runtimeRequirements.has(RuntimeGlobals.require)
		) {
			source.add(prefix + "var __webpack_modules__ = (");
			source.add(chunkModules || "{}");
			source.add(");\n");
			source.add(
				"/************************************************************************/\n"
			);
		}

		if (bootstrap.header.length > 0) {
			const header = Template.asString(bootstrap.header) + "\n";
			source.add(
				new PrefixSource(
					prefix,
					useSourceMap
						? new OriginalSource(header, "webpack/bootstrap")
						: new RawSource(header)
				)
			);
			source.add(
				"/************************************************************************/\n"
			);
		}

		const runtimeModules =
			renderContext.chunkGraph.getChunkRuntimeModulesInOrder(chunk);

		if (runtimeModules.length > 0) {
			source.add(
				new PrefixSource(
					prefix,
					Template.renderRuntimeModules(runtimeModules, chunkRenderContext)
				)
			);
			source.add(
				"/************************************************************************/\n"
			);
			// runtimeRuntimeModules calls codeGeneration
			for (const module of runtimeModules) {
				compilation.codeGeneratedModules.add(module);
			}
		}
		if (inlinedModules) {
			if (bootstrap.beforeStartup.length > 0) {
				const beforeStartup = Template.asString(bootstrap.beforeStartup) + "\n";
				source.add(
					new PrefixSource(
						prefix,
						useSourceMap
							? new OriginalSource(beforeStartup, "webpack/before-startup")
							: new RawSource(beforeStartup)
					)
				);
			}
			const lastInlinedModule = last(inlinedModules);
			const startupSource = new ConcatSource();
			startupSource.add(`var ${RuntimeGlobals.exports} = {};\n`);
			for (const m of inlinedModules) {
				const renderedModule = this.renderModule(
					m,
					chunkRenderContext,
					hooks,
					false
				);
				if (renderedModule) {
					const innerStrict = !allStrict && m.buildInfo.strict;
					const runtimeRequirements = chunkGraph.getModuleRuntimeRequirements(
						m,
						chunk.runtime
					);
					const exports = runtimeRequirements.has(RuntimeGlobals.exports);
					const webpackExports =
						exports && m.exportsArgument === RuntimeGlobals.exports;
					let iife = innerStrict
						? "it need to be in strict mode."
						: inlinedModules.size > 1
						? // TODO check globals and top-level declarations of other entries and chunk modules
						  // to make a better decision
						  "it need to be isolated against other entry modules."
						: chunkModules
						? "it need to be isolated against other modules in the chunk."
						: exports && !webpackExports
						? `it uses a non-standard name for the exports (${m.exportsArgument}).`
						: hooks.embedInRuntimeBailout.call(m, renderContext);
					let footer;
					if (iife !== undefined) {
						startupSource.add(
							`// This entry need to be wrapped in an IIFE because ${iife}\n`
						);
						const arrow = runtimeTemplate.supportsArrowFunction();
						if (arrow) {
							startupSource.add("(() => {\n");
							footer = "\n})();\n\n";
						} else {
							startupSource.add("!function() {\n");
							footer = "\n}();\n";
						}
						if (innerStrict) startupSource.add('"use strict";\n');
					} else {
						footer = "\n";
					}
					if (exports) {
						if (m !== lastInlinedModule)
							startupSource.add(`var ${m.exportsArgument} = {};\n`);
						else if (m.exportsArgument !== RuntimeGlobals.exports)
							startupSource.add(
								`var ${m.exportsArgument} = ${RuntimeGlobals.exports};\n`
							);
					}
					startupSource.add(renderedModule);
					startupSource.add(footer);
				}
			}
			if (runtimeRequirements.has(RuntimeGlobals.onChunksLoaded)) {
				startupSource.add(
					`${RuntimeGlobals.exports} = ${RuntimeGlobals.onChunksLoaded}(${RuntimeGlobals.exports});\n`
				);
			}
			source.add(
				hooks.renderStartup.call(startupSource, lastInlinedModule, {
					...renderContext,
					inlined: true
				})
			);
			if (bootstrap.afterStartup.length > 0) {
				const afterStartup = Template.asString(bootstrap.afterStartup) + "\n";
				source.add(
					new PrefixSource(
						prefix,
						useSourceMap
							? new OriginalSource(afterStartup, "webpack/after-startup")
							: new RawSource(afterStartup)
					)
				);
			}
		} else {
			const lastEntryModule = last(
				chunkGraph.getChunkEntryModulesIterable(chunk)
			);
			const toSource = useSourceMap
				? (content, name) =>
						new OriginalSource(Template.asString(content), name)
				: content => new RawSource(Template.asString(content));
			source.add(
				new PrefixSource(
					prefix,
					new ConcatSource(
						toSource(bootstrap.beforeStartup, "webpack/before-startup"),
						"\n",
						hooks.renderStartup.call(
							toSource(bootstrap.startup.concat(""), "webpack/startup"),
							lastEntryModule,
							{
								...renderContext,
								inlined: false
							}
						),
						toSource(bootstrap.afterStartup, "webpack/after-startup"),
						"\n"
					)
				)
			);
		}
		if (
			hasEntryModules &&
			runtimeRequirements.has(RuntimeGlobals.returnExportsFromRuntime)
		) {
			source.add(`${prefix}return ${RuntimeGlobals.exports};\n`);
		}
		if (iife) {
			source.add("/******/ })()\n");
		}

		/** @type {Source} */
		let finalSource = tryRunOrWebpackError(
			() => hooks.renderMain.call(source, renderContext),
			"JavascriptModulesPlugin.getCompilationHooks().renderMain"
		);
		if (!finalSource) {
			throw new Error(
				"JavascriptModulesPlugin error: JavascriptModulesPlugin.getCompilationHooks().renderMain plugins should return something"
			);
		}
		finalSource = tryRunOrWebpackError(
			() => hooks.renderContent.call(finalSource, renderContext),
			"JavascriptModulesPlugin.getCompilationHooks().renderContent"
		);
		if (!finalSource) {
			throw new Error(
				"JavascriptModulesPlugin error: JavascriptModulesPlugin.getCompilationHooks().renderContent plugins should return something"
			);
		}

		finalSource = InitFragment.addToSource(
			finalSource,
			chunkRenderContext.chunkInitFragments,
			chunkRenderContext
		);
		finalSource = tryRunOrWebpackError(
			() => hooks.render.call(finalSource, renderContext),
			"JavascriptModulesPlugin.getCompilationHooks().render"
		);
		if (!finalSource) {
			throw new Error(
				"JavascriptModulesPlugin error: JavascriptModulesPlugin.getCompilationHooks().render plugins should return something"
			);
		}
		chunk.rendered = true;
		return iife ? new ConcatSource(finalSource, ";") : finalSource;
	}

	/**
	 * @param {Hash} hash the hash to be updated
	 * @param {RenderBootstrapContext} renderContext options object
	 * @param {CompilationHooks} hooks hooks
	 */
	updateHashWithBootstrap(hash, renderContext, hooks) {
		const bootstrap = this.renderBootstrap(renderContext, hooks);
		for (const key of Object.keys(bootstrap)) {
			hash.update(key);
			if (Array.isArray(bootstrap[key])) {
				for (const line of bootstrap[key]) {
					hash.update(line);
				}
			} else {
				hash.update(JSON.stringify(bootstrap[key]));
			}
		}
	}

	/**
	 * @param {RenderBootstrapContext} renderContext options object
	 * @param {CompilationHooks} hooks hooks
	 * @returns {{ header: string[], beforeStartup: string[], startup: string[], afterStartup: string[], allowInlineStartup: boolean }} the generated source of the bootstrap code
	 */
	renderBootstrap(renderContext, hooks) {
		const {
			chunkGraph,
			codeGenerationResults,
			moduleGraph,
			chunk,
			runtimeTemplate
		} = renderContext;

		const runtimeRequirements = chunkGraph.getTreeRuntimeRequirements(chunk);

		const requireFunction = runtimeRequirements.has(RuntimeGlobals.require);
		const moduleCache = runtimeRequirements.has(RuntimeGlobals.moduleCache);
		const moduleFactories = runtimeRequirements.has(
			RuntimeGlobals.moduleFactories
		);
		const moduleUsed = runtimeRequirements.has(RuntimeGlobals.module);
		const requireScopeUsed = runtimeRequirements.has(
			RuntimeGlobals.requireScope
		);
		const interceptModuleExecution = runtimeRequirements.has(
			RuntimeGlobals.interceptModuleExecution
		);

		const useRequire =
			requireFunction || interceptModuleExecution || moduleUsed;

		/**
		 * @type {{startup: string[], beforeStartup: string[], header: string[], afterStartup: string[], allowInlineStartup: boolean}}
		 */
		const result = {
			header: [],
			beforeStartup: [],
			startup: [],
			afterStartup: [],
			allowInlineStartup: true
		};

		let { header: buf, startup, beforeStartup, afterStartup } = result;

		if (result.allowInlineStartup && moduleFactories) {
			startup.push(
				"// module factories are used so entry inlining is disabled"
			);
			result.allowInlineStartup = false;
		}
		if (result.allowInlineStartup && moduleCache) {
			startup.push("// module cache are used so entry inlining is disabled");
			result.allowInlineStartup = false;
		}
		if (result.allowInlineStartup && interceptModuleExecution) {
			startup.push(
				"// module execution is intercepted so entry inlining is disabled"
			);
			result.allowInlineStartup = false;
		}

		if (useRequire || moduleCache) {
			buf.push("// The module cache");
			buf.push("var __webpack_module_cache__ = {};");
			buf.push("");
		}

		if (useRequire) {
			buf.push("// The require function");
			buf.push(`function ${RuntimeGlobals.require}(moduleId) {`);
			buf.push(Template.indent(this.renderRequire(renderContext, hooks)));
			buf.push("}");
			buf.push("");
		} else if (runtimeRequirements.has(RuntimeGlobals.requireScope)) {
			buf.push("// The require scope");
			buf.push(`var ${RuntimeGlobals.require} = {};`);
			buf.push("");
		}

		if (
			moduleFactories ||
			runtimeRequirements.has(RuntimeGlobals.moduleFactoriesAddOnly)
		) {
			buf.push("// expose the modules object (__webpack_modules__)");
			buf.push(`${RuntimeGlobals.moduleFactories} = __webpack_modules__;`);
			buf.push("");
		}

		if (moduleCache) {
			buf.push("// expose the module cache");
			buf.push(`${RuntimeGlobals.moduleCache} = __webpack_module_cache__;`);
			buf.push("");
		}

		if (interceptModuleExecution) {
			buf.push("// expose the module execution interceptor");
			buf.push(`${RuntimeGlobals.interceptModuleExecution} = [];`);
			buf.push("");
		}

		if (!runtimeRequirements.has(RuntimeGlobals.startupNoDefault)) {
			if (chunkGraph.getNumberOfEntryModules(chunk) > 0) {
				/** @type {string[]} */
				const buf2 = [];
				const runtimeRequirements =
					chunkGraph.getTreeRuntimeRequirements(chunk);
				buf2.push("// Load entry module and return exports");
				let i = chunkGraph.getNumberOfEntryModules(chunk);
				for (const [
					entryModule,
					entrypoint
				] of chunkGraph.getChunkEntryModulesWithChunkGroupIterable(chunk)) {
					const chunks = entrypoint.chunks.filter(c => c !== chunk);
					if (result.allowInlineStartup && chunks.length > 0) {
						buf2.push(
							"// This entry module depends on other loaded chunks and execution need to be delayed"
						);
						result.allowInlineStartup = false;
					}
					if (
						result.allowInlineStartup &&
						someInIterable(
							moduleGraph.getIncomingConnectionsByOriginModule(entryModule),
							([originModule, connections]) =>
								originModule &&
								connections.some(c => c.isTargetActive(chunk.runtime)) &&
								someInIterable(
									chunkGraph.getModuleRuntimes(originModule),
									runtime =>
										intersectRuntime(runtime, chunk.runtime) !== undefined
								)
						)
					) {
						buf2.push(
							"// This entry module is referenced by other modules so it can't be inlined"
						);
						result.allowInlineStartup = false;
					}

					let data;
					if (codeGenerationResults.has(entryModule, chunk.runtime)) {
						const result = codeGenerationResults.get(
							entryModule,
							chunk.runtime
						);
						data = result.data;
					}
					if (
						result.allowInlineStartup &&
						(!data || !data.get("topLevelDeclarations")) &&
						(!entryModule.buildInfo ||
							!entryModule.buildInfo.topLevelDeclarations)
					) {
						buf2.push(
							"// This entry module doesn't tell about it's top-level declarations so it can't be inlined"
						);
						result.allowInlineStartup = false;
					}
					if (result.allowInlineStartup) {
						const bailout = hooks.inlineInRuntimeBailout.call(
							entryModule,
							renderContext
						);
						if (bailout !== undefined) {
							buf2.push(
								`// This entry module can't be inlined because ${bailout}`
							);
							result.allowInlineStartup = false;
						}
					}
					i--;
					const moduleId = chunkGraph.getModuleId(entryModule);
					const entryRuntimeRequirements =
						chunkGraph.getModuleRuntimeRequirements(entryModule, chunk.runtime);
					let moduleIdExpr = JSON.stringify(moduleId);
					if (runtimeRequirements.has(RuntimeGlobals.entryModuleId)) {
						moduleIdExpr = `${RuntimeGlobals.entryModuleId} = ${moduleIdExpr}`;
					}
					if (
						result.allowInlineStartup &&
						entryRuntimeRequirements.has(RuntimeGlobals.module)
					) {
						result.allowInlineStartup = false;
						buf2.push(
							"// This entry module used 'module' so it can't be inlined"
						);
					}
					if (chunks.length > 0) {
						buf2.push(
							`${i === 0 ? `var ${RuntimeGlobals.exports} = ` : ""}${
								RuntimeGlobals.onChunksLoaded
							}(undefined, ${JSON.stringify(
								chunks.map(c => c.id)
							)}, ${runtimeTemplate.returningFunction(
								`${RuntimeGlobals.require}(${moduleIdExpr})`
							)})`
						);
					} else if (useRequire) {
						buf2.push(
							`${i === 0 ? `var ${RuntimeGlobals.exports} = ` : ""}${
								RuntimeGlobals.require
							}(${moduleIdExpr});`
						);
					} else {
						if (i === 0) buf2.push(`var ${RuntimeGlobals.exports} = {};`);
						if (requireScopeUsed) {
							buf2.push(
								`__webpack_modules__[${moduleIdExpr}](0, ${
									i === 0 ? RuntimeGlobals.exports : "{}"
								}, ${RuntimeGlobals.require});`
							);
						} else if (entryRuntimeRequirements.has(RuntimeGlobals.exports)) {
							buf2.push(
								`__webpack_modules__[${moduleIdExpr}](0, ${
									i === 0 ? RuntimeGlobals.exports : "{}"
								});`
							);
						} else {
							buf2.push(`__webpack_modules__[${moduleIdExpr}]();`);
						}
					}
				}
				if (runtimeRequirements.has(RuntimeGlobals.onChunksLoaded)) {
					buf2.push(
						`${RuntimeGlobals.exports} = ${RuntimeGlobals.onChunksLoaded}(${RuntimeGlobals.exports});`
					);
				}
				if (
					runtimeRequirements.has(RuntimeGlobals.startup) ||
					(runtimeRequirements.has(RuntimeGlobals.startupOnlyBefore) &&
						runtimeRequirements.has(RuntimeGlobals.startupOnlyAfter))
				) {
					result.allowInlineStartup = false;
					buf.push("// the startup function");
					buf.push(
						`${RuntimeGlobals.startup} = ${runtimeTemplate.basicFunction("", [
							...buf2,
							`return ${RuntimeGlobals.exports};`
						])};`
					);
					buf.push("");
					startup.push("// run startup");
					startup.push(
						`var ${RuntimeGlobals.exports} = ${RuntimeGlobals.startup}();`
					);
				} else if (runtimeRequirements.has(RuntimeGlobals.startupOnlyBefore)) {
					buf.push("// the startup function");
					buf.push(
						`${RuntimeGlobals.startup} = ${runtimeTemplate.emptyFunction()};`
					);
					beforeStartup.push("// run runtime startup");
					beforeStartup.push(`${RuntimeGlobals.startup}();`);
					startup.push("// startup");
					startup.push(Template.asString(buf2));
				} else if (runtimeRequirements.has(RuntimeGlobals.startupOnlyAfter)) {
					buf.push("// the startup function");
					buf.push(
						`${RuntimeGlobals.startup} = ${runtimeTemplate.emptyFunction()};`
					);
					startup.push("// startup");
					startup.push(Template.asString(buf2));
					afterStartup.push("// run runtime startup");
					afterStartup.push(`${RuntimeGlobals.startup}();`);
				} else {
					startup.push("// startup");
					startup.push(Template.asString(buf2));
				}
			} else if (
				runtimeRequirements.has(RuntimeGlobals.startup) ||
				runtimeRequirements.has(RuntimeGlobals.startupOnlyBefore) ||
				runtimeRequirements.has(RuntimeGlobals.startupOnlyAfter)
			) {
				buf.push(
					"// the startup function",
					"// It's empty as no entry modules are in this chunk",
					`${RuntimeGlobals.startup} = ${runtimeTemplate.emptyFunction()};`,
					""
				);
			}
		} else if (
			runtimeRequirements.has(RuntimeGlobals.startup) ||
			runtimeRequirements.has(RuntimeGlobals.startupOnlyBefore) ||
			runtimeRequirements.has(RuntimeGlobals.startupOnlyAfter)
		) {
			result.allowInlineStartup = false;
			buf.push(
				"// the startup function",
				"// It's empty as some runtime module handles the default behavior",
				`${RuntimeGlobals.startup} = ${runtimeTemplate.emptyFunction()};`
			);
			startup.push("// run startup");
			startup.push(
				`var ${RuntimeGlobals.exports} = ${RuntimeGlobals.startup}();`
			);
		}
		return result;
	}

	/**
	 * @param {RenderBootstrapContext} renderContext options object
	 * @param {CompilationHooks} hooks hooks
	 * @returns {string} the generated source of the require function
	 */
	renderRequire(renderContext, hooks) {
		const {
			chunk,
			chunkGraph,
			runtimeTemplate: { outputOptions }
		} = renderContext;
		const runtimeRequirements = chunkGraph.getTreeRuntimeRequirements(chunk);
		const moduleExecution = runtimeRequirements.has(
			RuntimeGlobals.interceptModuleExecution
		)
			? Template.asString([
					`var execOptions = { id: moduleId, module: module, factory: __webpack_modules__[moduleId], require: ${RuntimeGlobals.require} };`,
					`${RuntimeGlobals.interceptModuleExecution}.forEach(function(handler) { handler(execOptions); });`,
					"module = execOptions.module;",
					"execOptions.factory.call(module.exports, module, module.exports, execOptions.require);"
			  ])
			: runtimeRequirements.has(RuntimeGlobals.thisAsExports)
			? Template.asString([
					`__webpack_modules__[moduleId].call(module.exports, module, module.exports, ${RuntimeGlobals.require});`
			  ])
			: Template.asString([
					`__webpack_modules__[moduleId](module, module.exports, ${RuntimeGlobals.require});`
			  ]);
		const needModuleId = runtimeRequirements.has(RuntimeGlobals.moduleId);
		const needModuleLoaded = runtimeRequirements.has(
			RuntimeGlobals.moduleLoaded
		);
		const content = Template.asString([
			"// Check if module is in cache",
			"var cachedModule = __webpack_module_cache__[moduleId];",
			"if (cachedModule !== undefined) {",
			outputOptions.strictModuleErrorHandling
				? Template.indent([
						"if (cachedModule.error !== undefined) throw cachedModule.error;",
						"return cachedModule.exports;"
				  ])
				: Template.indent("return cachedModule.exports;"),
			"}",
			"// Create a new module (and put it into the cache)",
			"var module = __webpack_module_cache__[moduleId] = {",
			Template.indent([
				needModuleId ? "id: moduleId," : "// no module.id needed",
				needModuleLoaded ? "loaded: false," : "// no module.loaded needed",
				"exports: {}"
			]),
			"};",
			"",
			outputOptions.strictModuleExceptionHandling
				? Template.asString([
						"// Execute the module function",
						"var threw = true;",
						"try {",
						Template.indent([moduleExecution, "threw = false;"]),
						"} finally {",
						Template.indent([
							"if(threw) delete __webpack_module_cache__[moduleId];"
						]),
						"}"
				  ])
				: outputOptions.strictModuleErrorHandling
				? Template.asString([
						"// Execute the module function",
						"try {",
						Template.indent(moduleExecution),
						"} catch(e) {",
						Template.indent(["module.error = e;", "throw e;"]),
						"}"
				  ])
				: Template.asString([
						"// Execute the module function",
						moduleExecution
				  ]),
			needModuleLoaded
				? Template.asString([
						"",
						"// Flag the module as loaded",
						`${RuntimeGlobals.moduleLoaded} = true;`,
						""
				  ])
				: "",
			"// Return the exports of the module",
			"return module.exports;"
		]);
		return tryRunOrWebpackError(
			() => hooks.renderRequire.call(content, renderContext),
			"JavascriptModulesPlugin.getCompilationHooks().renderRequire"
		);
	}
}
```

- 核心概念
  - `normalModuleFactory` 模块解析

## RuntimePlugin runtime 模块注入

```js
// source: lib/RuntimePlugin.js
const GLOBALS_ON_REQUIRE = [
	RuntimeGlobals.chunkName,
	RuntimeGlobals.runtimeId,
	RuntimeGlobals.compatGetDefaultExport,
	RuntimeGlobals.createFakeNamespaceObject,
	RuntimeGlobals.createScript,
	RuntimeGlobals.createScriptUrl,
	RuntimeGlobals.getTrustedTypesPolicy,
	RuntimeGlobals.definePropertyGetters,
	RuntimeGlobals.ensureChunk,
	RuntimeGlobals.entryModuleId,
	RuntimeGlobals.getFullHash,
	RuntimeGlobals.global,
	RuntimeGlobals.makeNamespaceObject,
	RuntimeGlobals.moduleCache,
	RuntimeGlobals.moduleFactories,
	RuntimeGlobals.moduleFactoriesAddOnly,
	RuntimeGlobals.interceptModuleExecution,
	RuntimeGlobals.publicPath,
	RuntimeGlobals.baseURI,
	RuntimeGlobals.relativeUrl,
	RuntimeGlobals.scriptNonce,
	RuntimeGlobals.uncaughtErrorHandler,
	RuntimeGlobals.asyncModule,
	RuntimeGlobals.wasmInstances,
	RuntimeGlobals.instantiateWasm,
	RuntimeGlobals.shareScopeMap,
	RuntimeGlobals.initializeSharing,
	RuntimeGlobals.loadScript,
	RuntimeGlobals.systemContext,
	RuntimeGlobals.onChunksLoaded
];

const MODULE_DEPENDENCIES = {
	[RuntimeGlobals.moduleLoaded]: [RuntimeGlobals.module],
	[RuntimeGlobals.moduleId]: [RuntimeGlobals.module]
};

const TREE_DEPENDENCIES = {
	[RuntimeGlobals.definePropertyGetters]: [RuntimeGlobals.hasOwnProperty],
	[RuntimeGlobals.compatGetDefaultExport]: [
		RuntimeGlobals.definePropertyGetters
	],
	[RuntimeGlobals.createFakeNamespaceObject]: [
		RuntimeGlobals.definePropertyGetters,
		RuntimeGlobals.makeNamespaceObject,
		RuntimeGlobals.require
	],
	[RuntimeGlobals.initializeSharing]: [RuntimeGlobals.shareScopeMap],
	[RuntimeGlobals.shareScopeMap]: [RuntimeGlobals.hasOwnProperty]
};

class RuntimePlugin {
	/**
	 * @param {Compiler} compiler the Compiler
	 * @returns {void}
	 */
	apply(compiler) {
		compiler.hooks.compilation.tap("RuntimePlugin", compilation => {
			const globalChunkLoading = compilation.outputOptions.chunkLoading;
			/**
			 * @param {Chunk} chunk chunk
			 * @returns {boolean} true, when chunk loading is disabled for the chunk
			 */
			const isChunkLoadingDisabledForChunk = chunk => {
				const options = chunk.getEntryOptions();
				const chunkLoading =
					options && options.chunkLoading !== undefined
						? options.chunkLoading
						: globalChunkLoading;
				return chunkLoading === false;
			};
			// 注册 RuntimeRequirementsDependency
			compilation.dependencyTemplates.set(
				RuntimeRequirementsDependency,
				new RuntimeRequirementsDependency.Template()
			);
			// 注册 runtime 全局变量 1
			for (const req of GLOBALS_ON_REQUIRE) {
				compilation.hooks.runtimeRequirementInModule
					.for(req)
					.tap("RuntimePlugin", (module, set) => {
						set.add(RuntimeGlobals.requireScope);
					});
				compilation.hooks.runtimeRequirementInTree
					.for(req)
					.tap("RuntimePlugin", (module, set) => {
						set.add(RuntimeGlobals.requireScope);
					});
			}
			// 注册 runtime 全局变量 2
			for (const req of Object.keys(TREE_DEPENDENCIES)) {
				const deps =
					TREE_DEPENDENCIES[/** @type {keyof TREE_DEPENDENCIES} */ (req)];
				compilation.hooks.runtimeRequirementInTree
					.for(req)
					.tap("RuntimePlugin", (chunk, set) => {
						for (const dep of deps) set.add(dep);
					});
			}
			// 注册 runtime 模块用全局变量
			for (const req of Object.keys(MODULE_DEPENDENCIES)) {
				const deps =
					MODULE_DEPENDENCIES[/** @type {keyof MODULE_DEPENDENCIES} */ (req)];
				compilation.hooks.runtimeRequirementInModule
					.for(req)
					.tap("RuntimePlugin", (chunk, set) => {
						for (const dep of deps) set.add(dep);
					});
			}
			// 注册 __webpack_require__.d 实现
			compilation.hooks.runtimeRequirementInTree
				.for(RuntimeGlobals.definePropertyGetters)
				.tap("RuntimePlugin", chunk => {
					compilation.addRuntimeModule(
						chunk,
						new DefinePropertyGettersRuntimeModule()
					);
					return true;
				});
			// 注册 __webpack_require__.r 实现
			compilation.hooks.runtimeRequirementInTree
				.for(RuntimeGlobals.makeNamespaceObject)
				.tap("RuntimePlugin", chunk => {
					compilation.addRuntimeModule(
						chunk,
						new MakeNamespaceObjectRuntimeModule()
					);
					return true;
				});
			// 注册 __webpack_require__.t 实现
			compilation.hooks.runtimeRequirementInTree
				.for(RuntimeGlobals.createFakeNamespaceObject)
				.tap("RuntimePlugin", chunk => {
					compilation.addRuntimeModule(
						chunk,
						new CreateFakeNamespaceObjectRuntimeModule()
					);
					return true;
				});
			// 注册 __webpack_require__.o 实现
			compilation.hooks.runtimeRequirementInTree
				.for(RuntimeGlobals.hasOwnProperty)
				.tap("RuntimePlugin", chunk => {
					compilation.addRuntimeModule(
						chunk,
						new HasOwnPropertyRuntimeModule()
					);
					return true;
				});
			// 注册 __webpack_require__.n 实现
			compilation.hooks.runtimeRequirementInTree
				.for(RuntimeGlobals.compatGetDefaultExport)
				.tap("RuntimePlugin", chunk => {
					compilation.addRuntimeModule(
						chunk,
						new CompatGetDefaultExportRuntimeModule()
					);
					return true;
				});
			// 注册 __webpack_require__.j 实现
			compilation.hooks.runtimeRequirementInTree
				.for(RuntimeGlobals.runtimeId)
				.tap("RuntimePlugin", chunk => {
					compilation.addRuntimeModule(chunk, new RuntimeIdRuntimeModule());
					return true;
				});
			// 注册 __webpack_require__.p 实现
			compilation.hooks.runtimeRequirementInTree
				.for(RuntimeGlobals.publicPath)
				.tap("RuntimePlugin", (chunk, set) => {
					const { outputOptions } = compilation;
					const { publicPath: globalPublicPath, scriptType } = outputOptions;
					const entryOptions = chunk.getEntryOptions();
					const publicPath =
						entryOptions && entryOptions.publicPath !== undefined
							? entryOptions.publicPath
							: globalPublicPath;

					if (publicPath === "auto") {
						const module = new AutoPublicPathRuntimeModule();
						if (scriptType !== "module") set.add(RuntimeGlobals.global);
						compilation.addRuntimeModule(chunk, module);
					} else {
						const module = new PublicPathRuntimeModule(publicPath);

						if (
							typeof publicPath !== "string" ||
							/\[(full)?hash\]/.test(publicPath)
						) {
							module.fullHash = true;
						}

						compilation.addRuntimeModule(chunk, module);
					}
					return true;
				});
			// 注册 __webpack_require__.g 实现
			compilation.hooks.runtimeRequirementInTree
				.for(RuntimeGlobals.global)
				.tap("RuntimePlugin", chunk => {
					compilation.addRuntimeModule(chunk, new GlobalRuntimeModule());
					return true;
				});
			// 注册 __webpack_require__.a 实现
			compilation.hooks.runtimeRequirementInTree
				.for(RuntimeGlobals.asyncModule)
				.tap("RuntimePlugin", chunk => {
					compilation.addRuntimeModule(chunk, new AsyncModuleRuntimeModule());
					return true;
				});
			// 注册 __webpack_require__.y 实现
			compilation.hooks.runtimeRequirementInTree
				.for(RuntimeGlobals.systemContext)
				.tap("RuntimePlugin", chunk => {
					const { outputOptions } = compilation;
					const { library: globalLibrary } = outputOptions;
					const entryOptions = chunk.getEntryOptions();
					const libraryType =
						entryOptions && entryOptions.library !== undefined
							? entryOptions.library.type
							: globalLibrary.type;

					if (libraryType === "system") {
						compilation.addRuntimeModule(
							chunk,
							new SystemContextRuntimeModule()
						);
					}
					return true;
				});
			// 注册 __webpack_require__.u 实现
			compilation.hooks.runtimeRequirementInTree
				.for(RuntimeGlobals.getChunkScriptFilename)
				.tap("RuntimePlugin", (chunk, set) => {
					if (
						typeof compilation.outputOptions.chunkFilename === "string" &&
						/\[(full)?hash(:\d+)?\]/.test(
							compilation.outputOptions.chunkFilename
						)
					) {
						set.add(RuntimeGlobals.getFullHash);
					}
					compilation.addRuntimeModule(
						chunk,
						new GetChunkFilenameRuntimeModule(
							"javascript",
							"javascript",
							RuntimeGlobals.getChunkScriptFilename,
							chunk =>
								chunk.filenameTemplate ||
								(chunk.canBeInitial()
									? compilation.outputOptions.filename
									: compilation.outputOptions.chunkFilename),
							false
						)
					);
					return true;
				});
			// 注册 __webpack_require__.k 实现
			compilation.hooks.runtimeRequirementInTree
				.for(RuntimeGlobals.getChunkCssFilename)
				.tap("RuntimePlugin", (chunk, set) => {
					if (
						typeof compilation.outputOptions.cssChunkFilename === "string" &&
						/\[(full)?hash(:\d+)?\]/.test(
							compilation.outputOptions.cssChunkFilename
						)
					) {
						set.add(RuntimeGlobals.getFullHash);
					}
					compilation.addRuntimeModule(
						chunk,
						new GetChunkFilenameRuntimeModule(
							"css",
							"css",
							RuntimeGlobals.getChunkCssFilename,
							chunk =>
								getChunkFilenameTemplate(chunk, compilation.outputOptions),
							set.has(RuntimeGlobals.hmrDownloadUpdateHandlers)
						)
					);
					return true;
				});
			compilation.hooks.runtimeRequirementInTree
				.for(RuntimeGlobals.getChunkUpdateScriptFilename)
				.tap("RuntimePlugin", (chunk, set) => {
					if (
						/\[(full)?hash(:\d+)?\]/.test(
							compilation.outputOptions.hotUpdateChunkFilename
						)
					)
						set.add(RuntimeGlobals.getFullHash);
					compilation.addRuntimeModule(
						chunk,
						new GetChunkFilenameRuntimeModule(
							"javascript",
							"javascript update",
							RuntimeGlobals.getChunkUpdateScriptFilename,
							c => compilation.outputOptions.hotUpdateChunkFilename,
							true
						)
					);
					return true;
				});
			compilation.hooks.runtimeRequirementInTree
				.for(RuntimeGlobals.getUpdateManifestFilename)
				.tap("RuntimePlugin", (chunk, set) => {
					if (
						/\[(full)?hash(:\d+)?\]/.test(
							compilation.outputOptions.hotUpdateMainFilename
						)
					) {
						set.add(RuntimeGlobals.getFullHash);
					}
					compilation.addRuntimeModule(
						chunk,
						new GetMainFilenameRuntimeModule(
							"update manifest",
							RuntimeGlobals.getUpdateManifestFilename,
							compilation.outputOptions.hotUpdateMainFilename
						)
					);
					return true;
				});
			compilation.hooks.runtimeRequirementInTree
				.for(RuntimeGlobals.ensureChunk)
				.tap("RuntimePlugin", (chunk, set) => {
					const hasAsyncChunks = chunk.hasAsyncChunks();
					if (hasAsyncChunks) {
						set.add(RuntimeGlobals.ensureChunkHandlers);
					}
					compilation.addRuntimeModule(
						chunk,
						new EnsureChunkRuntimeModule(set)
					);
					return true;
				});
			compilation.hooks.runtimeRequirementInTree
				.for(RuntimeGlobals.ensureChunkIncludeEntries)
				.tap("RuntimePlugin", (chunk, set) => {
					set.add(RuntimeGlobals.ensureChunkHandlers);
				});
			compilation.hooks.runtimeRequirementInTree
				.for(RuntimeGlobals.shareScopeMap)
				.tap("RuntimePlugin", (chunk, set) => {
					compilation.addRuntimeModule(chunk, new ShareRuntimeModule());
					return true;
				});
			compilation.hooks.runtimeRequirementInTree
				.for(RuntimeGlobals.loadScript)
				.tap("RuntimePlugin", (chunk, set) => {
					const withCreateScriptUrl = !!compilation.outputOptions.trustedTypes;
					if (withCreateScriptUrl) {
						set.add(RuntimeGlobals.createScriptUrl);
					}
					const withFetchPriority = set.has(RuntimeGlobals.hasFetchPriority);
					compilation.addRuntimeModule(
						chunk,
						new LoadScriptRuntimeModule(withCreateScriptUrl, withFetchPriority)
					);
					return true;
				});
			compilation.hooks.runtimeRequirementInTree
				.for(RuntimeGlobals.createScript)
				.tap("RuntimePlugin", (chunk, set) => {
					if (compilation.outputOptions.trustedTypes) {
						set.add(RuntimeGlobals.getTrustedTypesPolicy);
					}
					compilation.addRuntimeModule(chunk, new CreateScriptRuntimeModule());
					return true;
				});
			compilation.hooks.runtimeRequirementInTree
				.for(RuntimeGlobals.createScriptUrl)
				.tap("RuntimePlugin", (chunk, set) => {
					if (compilation.outputOptions.trustedTypes) {
						set.add(RuntimeGlobals.getTrustedTypesPolicy);
					}
					compilation.addRuntimeModule(
						chunk,
						new CreateScriptUrlRuntimeModule()
					);
					return true;
				});
			compilation.hooks.runtimeRequirementInTree
				.for(RuntimeGlobals.getTrustedTypesPolicy)
				.tap("RuntimePlugin", (chunk, set) => {
					compilation.addRuntimeModule(
						chunk,
						new GetTrustedTypesPolicyRuntimeModule(set)
					);
					return true;
				});
			compilation.hooks.runtimeRequirementInTree
				.for(RuntimeGlobals.relativeUrl)
				.tap("RuntimePlugin", (chunk, set) => {
					compilation.addRuntimeModule(chunk, new RelativeUrlRuntimeModule());
					return true;
				});
			compilation.hooks.runtimeRequirementInTree
				.for(RuntimeGlobals.onChunksLoaded)
				.tap("RuntimePlugin", (chunk, set) => {
					compilation.addRuntimeModule(
						chunk,
						new OnChunksLoadedRuntimeModule()
					);
					return true;
				});
			compilation.hooks.runtimeRequirementInTree
				.for(RuntimeGlobals.baseURI)
				.tap("RuntimePlugin", chunk => {
					if (isChunkLoadingDisabledForChunk(chunk)) {
						compilation.addRuntimeModule(chunk, new BaseUriRuntimeModule());
						return true;
					}
				});
			compilation.hooks.runtimeRequirementInTree
				.for(RuntimeGlobals.scriptNonce)
				.tap("RuntimePlugin", chunk => {
					compilation.addRuntimeModule(chunk, new NonceRuntimeModule());
					return true;
				});
			// TODO webpack 6: remove CompatRuntimeModule
			compilation.hooks.additionalTreeRuntimeRequirements.tap(
				"RuntimePlugin",
				(chunk, set) => {
					const { mainTemplate } = compilation;
					if (
						mainTemplate.hooks.bootstrap.isUsed() ||
						mainTemplate.hooks.localVars.isUsed() ||
						mainTemplate.hooks.requireEnsure.isUsed() ||
						mainTemplate.hooks.requireExtensions.isUsed()
					) {
						compilation.addRuntimeModule(chunk, new CompatRuntimeModule());
					}
				}
			);
			JavascriptModulesPlugin.getCompilationHooks(compilation).chunkHash.tap(
				"RuntimePlugin",
				(chunk, hash, { chunkGraph }) => {
					const xor = new StringXor();
					for (const m of chunkGraph.getChunkRuntimeModulesIterable(chunk)) {
						xor.add(chunkGraph.getModuleHash(m, chunk.runtime));
					}
					xor.updateHash(hash);
				}
			);
		});
	}
}
```

- 核心概念：注入 webpack runtime 代码
  - `DefinePropertyGettersRuntimeModule` => `RuntimeGlobals.definePropertyGetters = __webpack_require__.d` 实现
  - `MakeNamespaceObjectRuntimeModule` => `RuntimeGlobals.makeNamespaceObject = __webpack_require__.r` 实现
  - `CreateFakeNamespaceObjectRuntimeModule` => `RuntimeGlobals.createFakeNamespaceObject = __webpack_require__.t` 实现
  - `HasOwnPropertyRuntimeModule` => `RuntimeGlobals.hasOwnProperty = __webpack_require__.o` 实现
  - `CompatGetDefaultExportRuntimeModule` => `RuntimeGlobals.compatGetDefaultExport = __webpack_require__.n` 实现
	- ... 其他

## DefinePropertyGettersRuntimeModule

```js
// source: lib/runtime/DefinePropertyGettersRuntimeModule.js
class DefinePropertyGettersRuntimeModule extends HelperRuntimeModule {
	constructor() {
		super("define property getters");
	}

	/**
	 * @returns {string | null} runtime code
	 */
	generate() {
		const compilation = /** @type {Compilation} */ (this.compilation);
		const { runtimeTemplate } = compilation;
		// fn = '__webpack_require__.d'
		const fn = RuntimeGlobals.definePropertyGetters;
		return Template.asString([
			"// define getter functions for harmony exports",
			`${fn} = ${runtimeTemplate.basicFunction("exports, definition", [
				`for(var key in definition) {`,
				Template.indent([
					`if(${RuntimeGlobals.hasOwnProperty}(definition, key) && !${RuntimeGlobals.hasOwnProperty}(exports, key)) {`,
					Template.indent([
						"Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });"
					]),
					"}"
				]),
				"}"
			])};`
		]);
	}
}

module.exports = DefinePropertyGettersRuntimeModule;
```

- 核心概念
  - `generate` 阶段生成代码

## Next

- 核心概念
  - 
