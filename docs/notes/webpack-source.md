# webpack 源码解析

# 流程拆解

## createCompiler 创建编译器

```ts
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

```ts
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

```ts
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

		new JavascriptModulesPlugin().apply(compiler);
		new JsonModulesPlugin().apply(compiler);
		new AssetModulesPlugin().apply(compiler);

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

		if (options.experiments.syncWebAssembly) {
			const WebAssemblyModulesPlugin = require("./wasm-sync/WebAssemblyModulesPlugin");
			new WebAssemblyModulesPlugin({
				mangleImports: options.optimization.mangleWasmImports
			}).apply(compiler);
		}

		if (options.experiments.asyncWebAssembly) {
			const AsyncWebAssemblyModulesPlugin = require("./wasm-async/AsyncWebAssemblyModulesPlugin");
			new AsyncWebAssemblyModulesPlugin({
				mangleImports: options.optimization.mangleWasmImports
			}).apply(compiler);
		}

		if (options.experiments.css) {
			const CssModulesPlugin = require("./css/CssModulesPlugin");
			new CssModulesPlugin(options.experiments.css).apply(compiler);
		}

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

		if (options.experiments.buildHttp) {
			const HttpUriPlugin = require("./schemes/HttpUriPlugin");
			const httpOptions = options.experiments.buildHttp;
			new HttpUriPlugin(httpOptions).apply(compiler);
		}

		new EntryOptionPlugin().apply(compiler);
		compiler.hooks.entryOption.call(options.context, options.entry);

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
    // 配置 options.output.chunkFormat => ArrayPushCallbackChunkFormatPlugin | CommonJsChunkFormatPlugin | ModuleChunkFormatPlugin
    // 配置 options.output.enabledChunkLoadingTypes => EnableChunkLoadingPlugin
    // 配置 options.output.enabledWasmLoadingTypes => EnableWasmLoadingPlugin
    // 配置 options.output.enabledLibraryTypes => EnableLibraryPlugin
    // 配置 options.output.pathinfo => ModuleInfoHeaderPlugin
    // 配置 options.output.clean => CleanPlugin
  - 配置 options.devtool => EvalSourceMapDevToolPlugin | SourceMapDevToolPlugin | EvalDevToolModulePlugin
  - `JavascriptModulesPlugin` 注册 parser、generator 等 JS 解析工厂
  - `JsonModulesPlugin`
  - `AssetModulesPlugin`

## Next

- 核心概念
  - 
