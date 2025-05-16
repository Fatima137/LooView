/** @type {import('jest').Config} */
const config = {
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    // haal mappen ui-componenten nu uit src in plaats van uit __mocks__
    '^@/components/ui/(.*)$': '<rootDir>/src/components/ui/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
    // overige mocks
    '../../context/AuthContext': '<rootDir>/__mocks__/context/AuthContext.ts',
    '../../lib/firebase':     '<rootDir>/__mocks__/lib/firebase.ts',
    '^lucide-react$':         '<rootDir>/__mocks__/lucide-react.ts',
  },
  testEnvironment: 'jsdom',
  transformIgnorePatterns: [
    '/node_modules/(?!(lucide-react|@radix-ui)/)',
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
};
module.exports = config;
