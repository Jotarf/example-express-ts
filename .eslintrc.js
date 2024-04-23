module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['plugin:@typescript-eslint/recommended'],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    'no-empty-function': 'error',
    'no-cond-assign': 'error',
    'no-constant-condition': 'error',
    'no-dupe-else-if': 'error',
    'no-import-assign': 'error',
    'no-unreachable': 'error',
    'no-unsafe-optional-chaining': 'error',
    'use-isnan': 'error'
  }
}
