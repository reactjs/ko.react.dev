const TextLintTester = require('textlint-tester');
const rule = require('../rules/no-endline-colon');

const tester = new TextLintTester();

tester.run('no-endline-colon', rule, {
  valid: ['아래와 같습니다.', '제목: 설명입니다.'],
  invalid: [
    {
      text: '아래와 같습니다:',
      errors: [{index: 8}],
    },
    {
      text: '아래와 같습니다;',
      errors: [{index: 8}],
    },
    {
      text: '여러 줄일 때\n아래와 같습니다:\n',
      errors: [{index: 16}],
    },
  ],
});
