/** @type {import('@babel/core').TransformOptions} */
const options = {
  presets: [
    '@babel/preset-env', //
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
};

console.log('babel config:', options);

module.exports = options;
