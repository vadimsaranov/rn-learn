module.exports = {
  extends: ['expo', 'prettier', 'eslint:recommended'],
  plugins: ['prettier'],
  ignorePatterns: ['app-example'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    'no-eq-null': 'warn',
  },
  env: {
    node: true,
  },
};
