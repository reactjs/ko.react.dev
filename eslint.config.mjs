import mark from 'eslint-plugin-mark';

export default [
  {
    ignores: ['**/*.js', '**/*.mjs', '**/*.cjs'],
  },
  {
    ...mark.configs.baseGfm,
    files: ['src/content/**/*.md'],
    rules: {
      'mark/no-double-spaces': 'error',
    },
  },
];
