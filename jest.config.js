module.exports = {
  verbose: true,
  testURL: 'http://localhost/',
  setupFiles: ['raf/polyfill', '<rootDir>/test/setupTest.ts'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  transform: {
    '^.+\\.(ts|tsx)$': '<rootDir>/node_modules/ts-jest',
  },
  testMatch: ['<rootDir>/test/**/?(*.)(spec|test).(ts|js)?(x)'],
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
};
