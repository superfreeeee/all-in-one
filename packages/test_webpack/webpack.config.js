const { CheckCompileHooksPlugin } = require('./CheckCompileHooksPlugin');

/** @type {import('webpack').Configuration} */
const config = {
  mode: 'development',

  // devtool: 'inline-source-map',
  devtool: 'source-map',

  entry: {
    index: './src/index.js',
  },

  output: {
    clean: true,
  },

  plugins: [
    new CheckCompileHooksPlugin(process.env.DEBUG === 'true'), //
  ],
};

module.exports = config;
