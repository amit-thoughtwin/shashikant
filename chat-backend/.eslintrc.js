module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ['airbnb-base'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/no-import-module-exports': 'off',
    'import/prefer-default-export': 'off',
    'import/no-dynamic-require': 'off',
    'global-require': 'off',
    'prefer-const': 'off',
    'no-console': 'off',
    'no-await-in-loop': 'off',
    'no-debugger': 'off',
    'no-param-reassign': 'off',

  },
  ignorePatterns: [
    '**/*.ejs',
  ],
};
