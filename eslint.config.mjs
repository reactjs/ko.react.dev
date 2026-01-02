/* eslint-disable import/no-anonymous-default-export */
import md from 'eslint-markdown';

export default [
  {
    ignores: ['**/*.js', '**/*.mjs', '**/*.cjs'],
  },
  {
    ...md.configs.base,
    files: ['src/content/**/*.md'],
    rules: {
      'md/no-curly-quote': [
        'error',
        {
          checkLeftSingleQuotationMark: false,
          checkRightSingleQuotationMark: false,
        },
      ],
      'md/no-double-space': 'error',
      'md/no-git-conflict-marker': ['error', {skipCode: false}],
      'md/no-irregular-whitespace': [
        'error',
        {skipCode: false, skipInlineCode: false},
      ],
    },
  },
];
