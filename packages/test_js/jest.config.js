/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',

  // test
  testMatch: [
    // '**/__tests__/**/*.[jt]s?(x)', // default config
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],

  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest', { sourceMaps: 'inline' }],
  },
};

console.log('jest config:', config);

module.exports = config;
