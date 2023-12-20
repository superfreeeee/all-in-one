const PLUGIN_NAME = 'CheckCompileHooksPlugin';

class CheckCompileHooksPlugin {
  constructor(isDebug) {
    this.isDebug = isDebug;
  }

  log(...args) {
    if (this.isDebug) {
      return;
    }
    console.log(
      ...args.map((arg) => {
        if (typeof arg === 'object' && arg !== null) {
          let id = 0;
          const cache = new Map();
          return JSON.stringify(
            arg,
            function (key, value) {
              if (typeof value === 'object' && typeof value !== null) {
                if (cache.has(value)) {
                  return `* circular ${cache.get(key)}: ${key}`;
                }
                cache.set(value, id++);
              }
              return value;
            },
            2
          );
        }
        return arg;
      })
    );
  }

  /**
   *
   * @param {import('webpack').Compiler} compiler
   */
  apply(compiler) {
    compiler.hooks.environment.tap(PLUGIN_NAME, () => {
      debugger;
      this.log('>>> compiler - 1 environment');
      this.log({ context: compiler.context });
      this.log();
    });

    compiler.hooks.afterEnvironment.tap(PLUGIN_NAME, () => {
      debugger;
      this.log('>>> compiler - 2 afterEnvironment');
      this.log();
    });

    compiler.hooks.entryOption.tap(PLUGIN_NAME, (context, entry) => {
      debugger;
      this.log('>>> compiler - 3 entryOption');
      this.log({ context, entry });
      // delete compiler.options.entry.index;
      this.log();
    });

    compiler.hooks.make.tap(PLUGIN_NAME, (compilation) => {
      debugger;
      this.log('>>> compiler - 4 make');
      for (const entryName in compiler.options.entry) {
        const entry = compiler.options.entry[entryName];
        this.log(`entry = ${entryName}`, entry);
      }
      this.log();
    });

    compiler.hooks.emit.tap(PLUGIN_NAME, (compilation) => {
      debugger;
      this.log('>>> compiler - 5 emit');
      for (const key in compilation.assets) {
        const asset = compilation.assets[key];
        this.log(`asset: ${key}, size: ${asset.size()}`);
      }
      this.log();
    });

    compiler.hooks.assetEmitted.tap(
      PLUGIN_NAME,
      (file, { content, source, outputPath, targetPath }) => {
        debugger;
        this.log('>>> compiler - 6 assetEmitted');
        this.log({ file, /* content, source, */ outputPath, targetPath });
        this.log();
      }
    );

    compiler.hooks.afterEmit.tap(PLUGIN_NAME, (compilation) => {
      debugger;
      this.log('>>> compiler - 7 afterEmit');
      for (const key in compilation.assets) {
        const asset = compilation.assets[key];
        this.log(`asset: ${key}, size: ${asset.size()}`);
      }
      this.log();
    });
  }
}

exports.CheckCompileHooksPlugin = CheckCompileHooksPlugin;
