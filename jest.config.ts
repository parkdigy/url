import type { Config } from 'jest';

const config: Config = {
  verbose: false,
  transform: {
    '^.+\\.(js|ts)$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }],
  },
  testEnvironment: 'node',
  forceExit: true,
  detectOpenHandles: true,
  moduleDirectories: ['node_modules'],
};

module.exports = config;
