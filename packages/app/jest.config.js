module.exports = {
  name: 'app',
  displayName: 'APP',
  preset: 'react-native',
  rootDir: './',
  testPathIgnorePatterns: ['/node_modules/', './dist'],
  setupFilesAfterEnv: ['<rootDir>/test/setupTestFramework.js'],
  globalSetup: '<rootDir>/test/setup.js',
  globalTeardown: '<rootDir>/test/teardown.js',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testRegex: '(/__tests__/[a-zA-Z]+(\\.)(test|spec))\\.(js|ts|tsx)?$',
  transform: {
    '^.+\\.(js|ts|tsx)$': require.resolve('@golden-stack/babel-jest'),
  },
};
