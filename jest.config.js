// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // 提供 Next.js 应用的路径
  dir: './',
})

// Jest 的自定义配置
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/domain/(.*)$': '<rootDir>/domain/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '^@/hooks/(.*)$': '<rootDir>/hooks/$1',
    '^@/infra/(.*)$': '<rootDir>/infra/$1',
    '^@/app/(.*)$': '<rootDir>/app/$1',
  },
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'domain/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
}

module.exports = createJestConfig(customJestConfig)