module.exports = {
  linters: {
    '*.md': ['textlint --rulesdir textlint/rules'],
  },
  ignore: ['textlint/fixtures/*'],
};
