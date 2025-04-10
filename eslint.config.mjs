/* eslint-disable import/no-anonymous-default-export */
import mark from 'eslint-plugin-mark';

export default [
  {
    ignores: ['**/*.js', '**/*.mjs', '**/*.cjs'],
  },
  {
    ...mark.configs.baseGfm,
    files: ['src/content/**/*.md'],
    rules: {
      'mark/no-curly-quote': [
        'error',
        {leftSingleQuotationMark: false, rightSingleQuotationMark: false},
      ],
      'mark/no-double-space': 'error',
      'mark/no-git-conflict-marker': ['error', {skipCode: false}],
      'mark/no-irregular-whitespace': [
        'error',
        {skipCode: false, skipInlineCode: false},
      ],
    },
  },
];
