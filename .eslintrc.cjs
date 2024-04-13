// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

/** @type {import("eslint").Linter.Config} */
const config = {
  root: true,
  plugins: [
    '@typescript-eslint',
    'security',
    'unused-imports',
    'sonarjs',
    'unicorn',
  ],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: [
        'plugin:security/recommended-legacy',
        'plugin:sonarjs/recommended',
        'plugin:unicorn/recommended',
        'plugin:jest/recommended',
      ],
      env: {
        node: true,
        jest: true,
        'jest/globals': true,
        es2021: true,
      },
      parserOptions: {
        project: path.join(__dirname, 'tsconfig.json'),
      },
      rules: {
        'unicorn/prevent-abbreviations': 'off',
        'unicorn/no-abusive-eslint-disable': 'off',
        'unicorn/no-array-callback-reference': 'off',
        'unicorn/prefer-module': 'off',
        'unicorn/no-empty-file': 'off',
        'unicorn/prefer-top-level-await': 'off',
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/no-unused-vars': ['error'],
        '@typescript-eslint/no-explicit-any': ['error'],
        'security/detect-object-injection': ['error'],
        complexity: ['error', 7],
        'spaced-comment': [2, 'always'],
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: path.join(__dirname, 'tsconfig.json'),
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    '@typescript-eslint/consistent-type-imports': [
      'warn',
      {
        prefer: 'type-imports',
        fixStyle: 'inline-type-imports',
      },
    ],
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    'no-console': ['error'],
  },
};

module.exports = config;
