module.exports = {
  projects: ['<rootDir>'],
  displayName: 'dev-pass-database-connection-tests',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        /* ts-jest config goes here in Jest */
      },
    ],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/utils',
  coverageThreshold: {
    global: {
      lines: 90,
      branches: 90,
      functions: 90,
      statements: 90,
    },
  },
};
