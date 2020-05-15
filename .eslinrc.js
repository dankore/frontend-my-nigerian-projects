module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  parser: 'babel-eslint',
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    allowImportExportEverywhere: true,
  },

  extends: 'eslint:recommended',
  extends: ['prettier'],
  rules: {
    'no-unused-vars': [2, { args: 'all', argsIgnorePattern: '^_' }],
    'no-warning-comments': 0,
    'prettier/prettier': [
      'error',
      {
        semi: false,
        singleQuote: true,
        printWidth: 100,
        tabWidth: 2,
        useTabs: false,
        trailingComma: 'es5',
        bracketSpacing: true,
        parser: 'flow',
      },
    ],
  },
};
