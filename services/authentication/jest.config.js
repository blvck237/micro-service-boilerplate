const ts_preset = require('ts-jest/jest-preset');

module.exports = {
  ...ts_preset,
  preset: '@shelf/jest-mongodb',
  modulePaths: ['<rootDir>/node_modules/'],
  setupFiles: ['<rootDir>/.setupJest.js'],
  moduleNameMapper: {
    // This is needed to make the tests work with the @shelf/jest-mongodb and @jesr/expect preset
    '^@core/(.*)': '<rootDir>/src/core/$1',
    '^@config/(.*)': '<rootDir>/src/config/$1',
    '^@gql/(.*)': '<rootDir>/src/gql/$1',
    '^@loaders/(.*)': '<rootDir>/src/loaders/$1',
    '^@interfaces/(.*)': '<rootDir>/src/interfaces/$1',
    '^@utils/(.*)': '<rootDir>/src/utils/$1',
    '^@resolvers/(.*)': '<rootDir>/src/resolvers/$1',
    '^@typings/(.*)': '<rootDir>/src/types/$1',
    '^@repositories/(.*)': '<rootDir>/src/repositories/$1',
    '^@services/(.*)': '<rootDir>/src/services/$1',
  },
  testTimeout: 10000,
};
