import type { Config } from 'jest';

const config: Config = {
  verbose: false,
  transform: {
    '^.+\\.(js|ts)$': 'ts-jest',
  },
  testEnvironment: 'node',
  forceExit: true,
  detectOpenHandles: true,
  moduleDirectories: ['node_modules'],
};

export default config;
