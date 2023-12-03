# 基础结构

- 主 bundle 结构

```ts
// 各模块产物
// moduleId => factory(module, __webpack_exports__, __webpack_require__): void;
var __webpack_modules__ = {};

// 调用模块
function __webpack_require__(moduleId) {}

// __webpack_modules__ 别名
// expose the modules object (__webpack_modules__)
__webpack_require__.m = __webpack_modules__;

// 拦截器 require interpretors
__webpack_require__.i = [];

// hasOwnProperty shorthand
__webpack_require__.o = (obj, prop): boolean => {};

// define harmony exports
__webpack_require__.d = (exports, definition) => {};

// lazy 模块 interpretors
__webpack_require__.f = {};

// 加载 lazy 模块
__webpack_require__.e = (chunkId): Promise<void[]> => {};

// 标记为 ESM 模块
__webpack_require__.r = (exports) => {};

// publicPath 资源公共路径
__webpack_require__.p = scriptUrl;

// 计算 chunk filename
__webpack_require__.u = (chunkId) => '';

// 请求异步模块
__webpack_require__.l = (url, done, key, chunkId) => {};

// 全局对象
__webpack_require__.g = globalThis || window;
```

- 异步 chunk 结构

```ts
self["webpackChunktest_webpack_loader"].push([
	// moduleIds
	[moduleId],
	// modules = { moduleId => factory }
	{}
])
```

# 内部结构

## `__webpack_require__` 调用模块

- 实现

```ts
// 模块缓存
// moduleId => { id, exports }
// The module cache
var __webpack_module_cache__ = {};

// 模块调用
// The require function
function __webpack_require__(moduleId) {
	// Check if module is in cache
	var cachedModule = __webpack_module_cache__[moduleId];
	if (cachedModule !== undefined) {
		if (cachedModule.error !== undefined) throw cachedModule.error;
    // 缓存，返回 exports
		return cachedModule.exports;
	}

	// Create a new module (and put it into the cache)
	var module = __webpack_module_cache__[moduleId] = {
		id: moduleId,
		// no module.loaded needed
		exports: {}
	};

	// Execute the module function
	try {
		var execOptions = { id: moduleId, module: module, factory: __webpack_modules__[moduleId], require: __webpack_require__ };
    // apply interpretors
		__webpack_require__.i.forEach(function(handler) { handler(execOptions); });
		module = execOptions.module;
    // 加载模块
		execOptions.factory.call(
      module.exports,
      module,
      module.exports,
      execOptions.require,
    );
	} catch(e) {
		module.error = e;
		throw e;
	}

	// Return the exports of the module
	return module.exports;
}
```

- 同步模块转换

```ts
import { add } from './utils';

// 转换成
const __module__ = __webpack_require__(/*! ./utils */ "./src/utils.js")
__module__.add; // ...
```

## `__webpack_modules__` 模块结构

```ts
// 各模块产物
// moduleId => factory(module, __webpack_exports__, __webpack_require__): void;
var __webpack_modules__ = ({
  //cjs 模块写法
  'cjs module example': (module) => {
    module.exports = { /* ... */ };
  },
  // esm 模块写法
  'esm module example': () => {
    __webpack_require__.r(__webpack_exports__);
    __webpack_require__.d(__webpack_exports__, {
      "default": () => (__WEBPACK_DEFAULT_EXPORT__),
      add: () => (/* binding */ add)
    });

    // export const 直接按名称约定生成绑定
    const add = () => {};

    // 约定 export default 名 => __WEBPACK_DEFAULT_EXPORT__
    const __WEBPACK_DEFAULT_EXPORT__ = { /* ... */ };
  }
});
```

## `__webpack_require__.o` hasOwnProperty 别名

```ts
// hasOwnProperty shorthand
__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
```

## `__webpack_require__.d` 定义模块导出

使用 `Object.defineProperty` 定义

```ts
/* webpack/runtime/define property getters */
(() => {
	// define getter functions for harmony exports
  __webpack_require__.d = (exports, definition) => {
  	for(var key in definition) {
  		if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
  			// definition key 写入 exports
  			Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
  		}
  	}
  };
})();
```

## `__webpack_require__.r` 标记 ESM 模块

```ts
// 模块标记为 ESM 模块
__webpack_require__.r = (exports) => {
  if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
    // exports.toString() => 'Module'
  	Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
  }
  // exports.__esModule = true
  Object.defineProperty(exports, '__esModule', { value: true });
}
```

## `__webpack_require__.g` 全局对象

```ts
__webpack_require__.g = (function() {
	if (typeof globalThis === 'object') return globalThis;
	try {
		return this || new Function('return this')();
	} catch (e) {
		if (typeof window === 'object') return window;
	}
})();
```

## `__webpack_require__.p` 资源公共路径

```ts
/* webpack/runtime/publicPath */
(() => {
	var scriptUrl;
  if (__webpack_require__.g.importScripts)
    scriptUrl = __webpack_require__.g.location + "";
  var document = __webpack_require__.g.document;
  if (!scriptUrl && document) {
  	if (document.currentScript)
  		scriptUrl = document.currentScript.src;
  	if (!scriptUrl) {
  		var scripts = document.getElementsByTagName("script");
  		if(scripts.length) {
  			var i = scripts.length - 1;
  			while (i > -1 && !scriptUrl) scriptUrl = scripts[i--].src;
  		}
  	}
  }
  // When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
  // or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
  if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
  scriptUrl = scriptUrl
    // 清理 hash
  	.replace(/#.*$/, "")
  	// 清理 query
  	.replace(/\?.*$/, "")
  	// 清理最后一段 path，即当前资源
  	.replace(/\/[^\/]+$/, "/");
  // publicPath 仅替换资源名称的部分
  __webpack_require__.p = scriptUrl;
})();
```

## `__webpack_require__.u` chunk filename

```ts
/* webpack/runtime/get javascript chunk filename */
(() => {
	// This function allow to reference async chunks
  __webpack_require__.u = (chunkId) => {
  	// return url for filenames based on template
  	return "" + chunkId + ".js";
  };
})();
```

## `__webpack_require__.l` 请求异步模块

```ts
/* webpack/runtime/load script */
(() => {
	var inProgress = {};
	var dataWebpackPrefix = "test_webpack_loader:";

	// loadScript function to load a script via script tag
	__webpack_require__.l = (url, done, key, chunkId) => {
		// url => [done] 加载中, callback 加到队列直接结束
		if(inProgress[url]) { inProgress[url].push(done); return; }
		
		var script, needAttach;
		if(key !== undefined) {
			var scripts = document.getElementsByTagName("script");
			for(var i = 0; i < scripts.length; i++) {
				var s = scripts[i];
				// <script src={url} data-webpack={key} />
				if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
			}
		}
		// 没找到 script 标签 => 首次加载
		if(!script) {
			needAttach = true;
			script = document.createElement('script');
	
			script.charset = 'utf-8';
			script.timeout = 120;
			if (__webpack_require__.nc) {
				script.setAttribute("nonce", __webpack_require__.nc);
			}
			script.setAttribute("data-webpack", dataWebpackPrefix + key);
	
			script.src = url;
		}
		inProgress[url] = [done]; // 首次加载

		// timeout, onerror, onload
		var onScriptComplete = (prev, event) => {
			// avoid mem leaks in IE.
			script.onerror = script.onload = null;
			clearTimeout(timeout); // 结束 timeout
			var doneFns = inProgress[url]; // 响应队列
			delete inProgress[url];
			script.parentNode && script.parentNode.removeChild(script); // 清理标签
			doneFns && doneFns.forEach((fn) => (fn(event))); // 先执行回调
			if(prev) return prev(event); // 执行原回调 script.onerror, onload 之类的
		}
		// timeout = onScriptComplete(undefinec, { type, target })
		var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
		// timeout = onScriptComplete(script.onerror, error event)
		script.onerror = onScriptComplete.bind(null, script.onerror);
		// timeout = onScriptComplete(script.onload, load event)
		script.onload = onScriptComplete.bind(null, script.onload);
		needAttach && document.head.appendChild(script);
	};
})();
```

## `__webpack_require__.e` 模块懒加载

- 实现

```ts
/* webpack/runtime/ensure chunk */
(() => {
  __webpack_require__.f = {};
	// This file contains only the entry chunk.
  // The chunk loading function for additional chunks
  // 加载 lazy 模块 main
  __webpack_require__.e = (chunkId) => {
  	return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
  		__webpack_require__.f[key](chunkId, promises);
  		return promises;
  	}, []));
  };
})();

/* webpack/runtime/jsonp chunk loading */
(() => {
	// object to store loaded and loading chunks
  // undefined = chunk not loaded, null = chunk preloaded/prefetched
  // [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
  var installedChunks = {
  	// chunkId => 0 加载完成
  	// chunkId => [resolve, reject, promise] 加载中
  	"main": 0
  };

  // 加载 lazy 模块内容
  __webpack_require__.f.j = (chunkId, promises) => {
  		// JSONP chunk loading for javascript
  		var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
  		if(installedChunkData !== 0) { // 0 means "already installed".
  		  // 0 表示加载完成

  			// a Promise means "currently loading".
  			if(installedChunkData) {
  				// promise 为加载中
  				promises.push(installedChunkData[2]);
  			} else {
  				if(true) { // all chunks have JS
  					// setup Promise in chunk cache
  					var promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
  					promises.push(installedChunkData[2] = promise);

  					// start chunk loading
  					// 资源 url
  					var url = __webpack_require__.p + __webpack_require__.u(chunkId);
  					// create error before stack unwound to get useful stacktrace later
  					// 记录当前的 Error stack
  					var error = new Error();
						// 加载完成后事件
  					var loadingEnded = (event) => {
  						if(__webpack_require__.o(installedChunks, chunkId)) {
								// 重新从 installedChunks 取
  							installedChunkData = installedChunks[chunkId];
								// 重置 installedChunks[chunkId]
  							if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
								// 
  							if(installedChunkData) {
  								var errorType = event && (event.type === 'load' ? 'missing' : event.type);
  								var realSrc = event && event.target && event.target.src;
  								error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
  								error.name = 'ChunkLoadError';
  								error.type = errorType;
  								error.request = realSrc;
  								installedChunkData[1](error);
  							}
  						}
  					};
  					__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
  				}
  			}
  		}
  };

	// no prefetching
  
  // no preloaded
  
  // no HMR
  
  // no HMR manifest
  
  // no on chunks loaded
  
  // install a JSONP callback for chunk loading
  var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
		// 异步模块结构
  	var [chunkIds, moreModules, runtime] = data;
  	// add "moreModules" to the modules object,
  	// then flag all "chunkIds" as loaded and fire callback
  	var moduleId, chunkId, i = 0;
		// 检查异步加载模块内 installedChunks 是否有非 0
  	if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
  		for(moduleId in moreModules) {
  			if(__webpack_require__.o(moreModules, moduleId)) {
					// 先加载到 __webpack_modules__ 内
  				__webpack_require__.m[moduleId] = moreModules[moduleId];
  			}
  		}
			// JSONP 注入
  		if(runtime) var result = runtime(__webpack_require__);
  	}
  	if(parentChunkLoadingFunction) parentChunkLoadingFunction(data); // origin push
  	for(;i < chunkIds.length; i++) {
  		chunkId = chunkIds[i];
  		if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
				// installedChunks 下非 0 模块 => 执行一下 resolve
  			installedChunks[chunkId][0]();
  		}
  		installedChunks[chunkId] = 0;
  	}
  
  }
  
	// 异步模块列表
  var chunkLoadingGlobal = self["webpackChunktest_webpack_loader"] = self["webpackChunktest_webpack_loader"] || [];
	// webpackJsonpCallback(data), data 为异步模块的 [[moduleIds], { moduleId => factory }]
  chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
  chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
})();
```

- 异步模块转换

```ts
import('./utils').then(({ add }) => {});

// 转换成
// Promise.resolve(/*! import() */) // 如果有相同 import
__webpack_require__.e(/*! import() */ "src_utils_js") // 异步加载到 modules 内
	.then(__webpack_require__.bind(__webpack_require__, /*! ./utils */ "./src/utils.js")) // 从 modules 内取
	.then(({ add }) => {});
```
