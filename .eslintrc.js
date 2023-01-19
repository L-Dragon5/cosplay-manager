module.exports = {
  parserOptions: {
    sourceType: 'module',
  },
  plugins: ['prettier', 'simple-import-sort', 'import'],
  extends: [
    'airbnb',
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
  ],
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    jest: true,
    node: true,
  },
  rules: {
    'jsx-a11y/href-no-hash': ['off'],
    'react/jsx-filename-extension': ['warn', { extensions: ['.js', '.jsx'] }],
    'max-len': [
      'warn',
      {
        code: 80,
        tabWidth: 2,
        comments: 80,
        ignoreComments: false,
        ignoreTrailingComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      },
    ],
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
  },
};
