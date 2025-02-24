module.exports = {
  extends: ['expo', 'prettier', 'eslint:recommended'],
  plugins: ['prettier', 'react', 'react-native'],
  ignorePatterns: ['app-example'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    'no-eq-null': 'warn',
    'react-native/no-inline-styles': 2,
  },
  env: {
    node: true,
  },
};
