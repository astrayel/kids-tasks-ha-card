module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  globals: {
    customElements: 'readonly',
    HTMLElement: 'readonly',
    __DEV__: 'readonly',
    __PROD__: 'readonly'
  },
  rules: {
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-console': 'off', // Allow console in development
    'prefer-const': 'warn',
    'no-var': 'error'
  }
};