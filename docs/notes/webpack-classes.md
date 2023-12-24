# EntryOptionPlugin > EntryPlugin

注入 entry：`compilation.addEntry`

# Dependency

依赖项，moduleGraph 计算用？

```js
// source: lib/Dependency.js
class Dependency {
	constructor() {
		/** @type {Module | undefined} */
		this._parentModule = undefined;
		/** @type {DependenciesBlock | undefined} */
		this._parentDependenciesBlock = undefined;
		/** @type {number} */
		this._parentDependenciesBlockIndex = -1;
		// TODO check if this can be moved into ModuleDependency
		/** @type {boolean} */
		this.weak = false;
		// TODO check if this can be moved into ModuleDependency
		/** @type {boolean} */
		this.optional = false;
		this._locSL = 0; // loc.start line
		this._locSC = 0; // loc.start column
		this._locEL = 0; // loc.end line
		this._locEC = 0; // loc.end column
		this._locI = undefined; // loc.index
		this._locN = undefined; // loc.name
		this._loc = undefined; // created loc
	}

	/**
   * 依赖类型？
	 * @returns {string} a display name for the type of dependency
	 */
	get type() {
		return "unknown";
	}

	/**
   * 依赖模块类型
   * cjs | amd | esm
	 * @returns {string} a dependency category, typical categories are "commonjs", "amd", "esm"
	 */
	get category() {
		return "unknown";
	}

	/**
   * 源码位置
	 * @returns {DependencyLocation} location
	 */
	get loc() {
		if (this._loc !== undefined) return this._loc;
		/** @type {SyntheticDependencyLocation & RealDependencyLocation} */
		const loc = {};
		if (this._locSL > 0) {
			loc.start = { line: this._locSL, column: this._locSC };
		}
		if (this._locEL > 0) {
			loc.end = { line: this._locEL, column: this._locEC };
		}
		if (this._locN !== undefined) {
			loc.name = this._locN;
		}
		if (this._locI !== undefined) {
			loc.index = this._locI;
		}
		return (this._loc = loc);
	}

	set loc(loc) {
		if ("start" in loc && typeof loc.start === "object") {
			this._locSL = loc.start.line || 0;
			this._locSC = loc.start.column || 0;
		} else {
			this._locSL = 0;
			this._locSC = 0;
		}
		if ("end" in loc && typeof loc.end === "object") {
			this._locEL = loc.end.line || 0;
			this._locEC = loc.end.column || 0;
		} else {
			this._locEL = 0;
			this._locEC = 0;
		}
		if ("index" in loc) {
			this._locI = loc.index;
		} else {
			this._locI = undefined;
		}
		if ("name" in loc) {
			this._locN = loc.name;
		} else {
			this._locN = undefined;
		}
		this._loc = loc;
	}

	/**
	 * @param {number} startLine start line
	 * @param {number} startColumn start column
	 * @param {number} endLine end line
	 * @param {number} endColumn end column
	 */
	setLoc(startLine, startColumn, endLine, endColumn) {
		this._locSL = startLine;
		this._locSC = startColumn;
		this._locEL = endLine;
		this._locEC = endColumn;
		this._locI = undefined;
		this._locN = undefined;
		this._loc = undefined;
	}

	/**
	 * @returns {string | undefined} a request context
	 */
	getContext() {
		return undefined;
	}

	/**
	 * @returns {string | null} an identifier to merge equal requests
	 */
	getResourceIdentifier() {
		return null;
	}

	/**
   * 影响引用方
	 * @returns {boolean | TRANSITIVE} true, when changes to the referenced module could affect the referencing module; TRANSITIVE, when changes to the referenced module could affect referencing modules of the referencing module
	 */
	couldAffectReferencingModule() {
		return TRANSITIVE;
	}

	/**
	 * Returns the referenced module and export
	 * @deprecated
	 * @param {ModuleGraph} moduleGraph module graph
	 * @returns {never} throws error
	 */
	getReference(moduleGraph) {
		throw new Error(
			"Dependency.getReference was removed in favor of Dependency.getReferencedExports, ModuleGraph.getModule and ModuleGraph.getConnection().active"
		);
	}

	/**
	 * Returns list of exports referenced by this dependency
	 * @param {ModuleGraph} moduleGraph module graph
	 * @param {RuntimeSpec} runtime the runtime for which the module is analysed
	 * @returns {(string[] | ReferencedExport)[]} referenced exports
	 */
	getReferencedExports(moduleGraph, runtime) {
		return Dependency.EXPORTS_OBJECT_REFERENCED;
	}

	/**
	 * @param {ModuleGraph} moduleGraph module graph
	 * @returns {null | false | function(ModuleGraphConnection, RuntimeSpec): ConnectionState} function to determine if the connection is active
	 */
	getCondition(moduleGraph) {
		return null;
	}

	/**
	 * Returns the exported names
	 * @param {ModuleGraph} moduleGraph module graph
	 * @returns {ExportsSpec | undefined} export names
	 */
	getExports(moduleGraph) {
		return undefined;
	}

	/**
	 * Returns warnings
	 * @param {ModuleGraph} moduleGraph module graph
	 * @returns {WebpackError[] | null | undefined} warnings
	 */
	getWarnings(moduleGraph) {
		return null;
	}

	/**
	 * Returns errors
	 * @param {ModuleGraph} moduleGraph module graph
	 * @returns {WebpackError[] | null | undefined} errors
	 */
	getErrors(moduleGraph) {
		return null;
	}

	/**
	 * Update the hash
	 * @param {Hash} hash hash to be updated
	 * @param {UpdateHashContext} context context
	 * @returns {void}
	 */
	updateHash(hash, context) {}

	/**
	 * implement this method to allow the occurrence order plugin to count correctly
	 * @returns {number} count how often the id is used in this dependency
	 */
	getNumberOfIdOccurrences() {
		return 1;
	}

	/**
	 * @param {ModuleGraph} moduleGraph the module graph
	 * @returns {ConnectionState} how this dependency connects the module to referencing modules
	 */
	getModuleEvaluationSideEffectsState(moduleGraph) {
		return true;
	}

	/**
	 * @param {string} context context directory
	 * @returns {Module | null} a module
	 */
	createIgnoredModule(context) {
		return getIgnoredModule();
	}

	/**
	 * @param {ObjectSerializerContext} context context
	 */
	serialize({ write }) {
		write(this.weak);
		write(this.optional);
		write(this._locSL);
		write(this._locSC);
		write(this._locEL);
		write(this._locEC);
		write(this._locI);
		write(this._locN);
	}

	/**
	 * @param {ObjectDeserializerContext} context context
	 */
	deserialize({ read }) {
		this.weak = read();
		this.optional = read();
		this._locSL = read();
		this._locSC = read();
		this._locEL = read();
		this._locEC = read();
		this._locI = read();
		this._locN = read();
	}
}

/** @type {string[][]} */
Dependency.NO_EXPORTS_REFERENCED = [];
/** @type {string[][]} */
Dependency.EXPORTS_OBJECT_REFERENCED = [[]];
```

# ModuleDependency > Dependency

```js
// source: lib/dependencies/ModuleDependency.js
class ModuleDependency extends Dependency {
	/**
	 * @param {string} request request path which needs resolving
	 */
	constructor(request) {
		super();
		this.request = request; // file path
		this.userRequest = request;
		this.range = undefined;
		// assertions must be serialized by subclasses that use it
		/** @type {Record<string, any> | undefined} */
		this.assertions = undefined;
		this._context = undefined;
	}

	/**
	 * @returns {string | undefined} a request context
	 */
	getContext() {
		return this._context;
	}

	/**
	 * @returns {string | null} an identifier to merge equal requests
	 */
	getResourceIdentifier() {
		let str = `context${this._context || ""}|module${this.request}`;
		if (this.assertions !== undefined) {
			str += JSON.stringify(this.assertions);
		}
		return str;
	}

	/**
   * 影响引用方
	 * @returns {boolean | TRANSITIVE} true, when changes to the referenced module could affect the referencing module; TRANSITIVE, when changes to the referenced module could affect referencing modules of the referencing module
	 */
	couldAffectReferencingModule() {
		return true;
	}

	/**
	 * @param {string} context context directory
	 * @returns {Module | null} a module
	 */
	createIgnoredModule(context) {
		const RawModule = getRawModule();
		return new RawModule(
			"/* (ignored) */",
			`ignored|${context}|${this.request}`,
			`${this.request} (ignored)`
		);
	}

	/**
	 * @param {ObjectSerializerContext} context context
	 */
	serialize(context) {
		const { write } = context;
		write(this.request);
		write(this.userRequest);
		write(this._context);
		write(this.range);
		super.serialize(context);
	}

	/**
	 * @param {ObjectDeserializerContext} context context
	 */
	deserialize(context) {
		const { read } = context;
		this.request = read();
		this.userRequest = read();
		this._context = read();
		this.range = read();
		super.deserialize(context);
	}
}

ModuleDependency.Template = DependencyTemplate;
```

# EntryDependency > ModuleDependency > Dependency

```js
// source: lib/dependencies/EntryDependency.js
class EntryDependency extends ModuleDependency {
	/**
	 * @param {string} request request path for entry
	 */
	constructor(request) {
		super(request);
	}

  // 类型为 entry
	get type() {
		return "entry";
	}

  // entry 统一作为 esm 依赖
	get category() {
		return "esm";
	}
}
```

# NullDependency > Dependency

```js
// source: lib/dependencies/NullDependency.js
class NullDependency extends Dependency {
	// 空依赖
	get type() {
		return "null";
	}

	/**
	 * @returns {boolean | TRANSITIVE} true, when changes to the referenced module could affect the referencing module; TRANSITIVE, when changes to the referenced module could affect referencing modules of the referencing module
	 */
	couldAffectReferencingModule() {
		return false;
	}
}

NullDependency.Template = class NullDependencyTemplate extends (
	DependencyTemplate
) {
	/**
	 * @param {Dependency} dependency the dependency for which the template should be applied
	 * @param {ReplaceSource} source the current replace source which can be modified
	 * @param {DependencyTemplateContext} templateContext the context object
	 * @returns {void}
	 */
	apply(dependency, source, templateContext) {}
};
```

# DependenciesBlock

# Module > DependenciesBlock

# RuntimeModule > Module > DependenciesBlock

```js
// source: lib/RuntimeModule.js
const TYPES = new Set([WEBPACK_MODULE_TYPE_RUNTIME]);

class RuntimeModule extends Module {
	/**
	 * @param {string} name a readable name
	 * @param {number=} stage an optional stage
	 */
	constructor(name, stage = 0) {
		super(WEBPACK_MODULE_TYPE_RUNTIME);
		this.name = name;
		this.stage = stage;
		this.buildMeta = {};
		this.buildInfo = {};
		/** @type {Compilation | undefined} */
		this.compilation = undefined;
		/** @type {Chunk | undefined} */
		this.chunk = undefined;
		/** @type {ChunkGraph | undefined} */
		this.chunkGraph = undefined;
		this.fullHash = false;
		this.dependentHash = false;
		/** @type {string | undefined} */
		this._cachedGeneratedCode = undefined;
	}

	/**
	 * @param {Compilation} compilation the compilation
	 * @param {Chunk} chunk the chunk
	 * @param {ChunkGraph} chunkGraph the chunk graph
	 * @returns {void}
	 */
	attach(compilation, chunk, chunkGraph = compilation.chunkGraph) {
		this.compilation = compilation;
		this.chunk = chunk;
		this.chunkGraph = chunkGraph;
	}

	/**
	 * @returns {string} a unique identifier of the module
	 */
	identifier() {
		return `webpack/runtime/${this.name}`;
	}

	/**
	 * @param {RequestShortener} requestShortener the request shortener
	 * @returns {string} a user readable identifier of the module
	 */
	readableIdentifier(requestShortener) {
		return `webpack/runtime/${this.name}`;
	}

	/**
	 * @param {NeedBuildContext} context context info
	 * @param {function((WebpackError | null)=, boolean=): void} callback callback function, returns true, if the module needs a rebuild
	 * @returns {void}
	 */
	needBuild(context, callback) {
		return callback(null, false);
	}

	/**
	 * @param {WebpackOptions} options webpack options
	 * @param {Compilation} compilation the compilation
	 * @param {ResolverWithOptions} resolver the resolver
	 * @param {InputFileSystem} fs the file system
	 * @param {function(WebpackError=): void} callback callback function
	 * @returns {void}
	 */
	build(options, compilation, resolver, fs, callback) {
		// do nothing
		// should not be called as runtime modules are added later to the compilation
		callback();
	}

	/**
	 * ! 具体 Module 实现 this.generate()
	 * @param {Hash} hash the hash used to track dependencies
	 * @param {UpdateHashContext} context context
	 * @returns {void}
	 */
	updateHash(hash, context) {
		hash.update(this.name);
		hash.update(`${this.stage}`);
		try {
			if (this.fullHash || this.dependentHash) {
				// Do not use getGeneratedCode here, because i. e. compilation hash might be not
				// ready at this point. We will cache it later instead.
				hash.update(this.generate());
			} else {
				hash.update(this.getGeneratedCode());
			}
		} catch (err) {
			hash.update(/** @type {Error} */ (err).message);
		}
		super.updateHash(hash, context);
	}

	/**
	 * @returns {Set<string>} types available (do not mutate)
	 */
	getSourceTypes() {
		return TYPES;
	}

	/**
	 * @param {CodeGenerationContext} context context for code generation
	 * @returns {CodeGenerationResult} result
	 */
	codeGeneration(context) {
		const sources = new Map();
		const generatedCode = this.getGeneratedCode();
		if (generatedCode) {
			sources.set(
				WEBPACK_MODULE_TYPE_RUNTIME,
				this.useSourceMap || this.useSimpleSourceMap
					? new OriginalSource(generatedCode, this.identifier())
					: new RawSource(generatedCode)
			);
		}
		return {
			sources,
			runtimeRequirements: null
		};
	}

	/**
	 * @param {string=} type the source type for which the size should be estimated
	 * @returns {number} the estimated size of the module (must be non-zero)
	 */
	size(type) {
		try {
			const source = this.getGeneratedCode();
			return source ? source.length : 0;
		} catch (e) {
			return 0;
		}
	}

	/* istanbul ignore next */
	/**
	 * @abstract
	 * @returns {string | null} runtime code
	 */
	generate() {
		const AbstractMethodError = require("./AbstractMethodError");
		throw new AbstractMethodError();
	}

	/**
	 * @returns {string | null} runtime code
	 */
	getGeneratedCode() {
		if (this._cachedGeneratedCode) {
			return /** @type {string | null} */ (this._cachedGeneratedCode);
		}
		return (this._cachedGeneratedCode = this.generate());
	}

	/**
	 * @returns {boolean} true, if the runtime module should get it's own scope
	 */
	shouldIsolate() {
		return true;
	}
}

/**
 * Runtime modules without any dependencies to other runtime modules
 */
RuntimeModule.STAGE_NORMAL = 0;

/**
 * Runtime modules with simple dependencies on other runtime modules
 */
RuntimeModule.STAGE_BASIC = 5;

/**
 * Runtime modules which attach to handlers of other runtime modules
 */
RuntimeModule.STAGE_ATTACH = 10;

/**
 * Runtime modules which trigger actions on bootstrap
 */
RuntimeModule.STAGE_TRIGGER = 20;

module.exports = RuntimeModule;
```

# HelperRuntimeModule > RuntimeModule > Module > DependenciesBlock

```js
// source: lib/runtime/HelperRuntimeModule.js
class HelperRuntimeModule extends RuntimeModule {
	/**
	 * @param {string} name a readable name
	 */
	constructor(name) {
		super(name);
	}
}
```

#
