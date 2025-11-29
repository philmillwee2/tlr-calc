module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    // Exclude CLI layer and entry points from coverage (ink-testing-library compatibility issues)
    '!src/cli.tsx',
    '!src/api/index.ts',
  ],
  coverageThreshold: {
    // Only enforce coverage on API layer (business logic)
    // CLI layer tests were deferred due to ink-testing-library compatibility issues
    './src/api/spreadsheet/**/*.ts': {
      branches: 75,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        jsx: 'react',
        esModuleInterop: true,
        moduleResolution: 'bundler',
      },
    }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(ink-testing-library|ink|ink-select-input|ink-text-input)/)',
  ],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
};
