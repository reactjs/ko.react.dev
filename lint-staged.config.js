module.exports = {
  '*': 'yarn editorconfig-checker',
  '*.{js,ts,jsx,tsx,css}': 'yarn prettier',
  'src/**/*.md': ['yarn fix-headings', 'yarn textlint-lint'],
  'textlint/**/*.js': 'yarn textlint-test',
  'textlint/data/rules/translateGlossary.js': 'yarn textlint-docs',
  'textlint/generators/genTranslateGlossaryDocs.js': 'yarn textlint-docs',
};
