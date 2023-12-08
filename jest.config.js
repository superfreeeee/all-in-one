/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],
  coveragePathIgnorePatterns: [
    'src/react-hooks/index.ts', // export file
  ],
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest', { sourceMaps: 'inline' }],
  },
};

console.log('jest config:', config);

module.exports = config;
