/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],
};

console.log('jest config:', config);

module.exports = config;
