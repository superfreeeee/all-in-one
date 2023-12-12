/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',

  // test
  testMatch: [
    // '**/__tests__/**/*.[jt]s?(x)', // default config
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],

  // coverage
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],
  coveragePathIgnorePatterns: [
    'src/react-hooks/index.ts', // export file
    '__tests__',
  ],

  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest', { sourceMaps: 'inline' }],
  },
};

if (process.env.UNSET_COVERAGE === 'true') {
  delete config.collectCoverageFrom;
}

console.log('jest config:', config);

module.exports = config;
