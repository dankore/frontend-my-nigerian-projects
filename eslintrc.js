module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  parser: 'babel-eslint',
  plugins: ['prettier', 'plugin:react/recommended'],
  parserOptions: {
    ecmaVersion: 2018,
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: 'module',
    allowImportExportEverywhere: true,
  },

  extends: ['eslint:recommended', 'prettier', 'prettier/babel', 'prettier/react', 'prettier/standard'],
};
