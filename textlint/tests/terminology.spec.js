const TextLintTester = require('textlint-tester');
const rule = require('../rules/terminology');

const tester = new TextLintTester();

tester.run('terminology', rule, {
  valid: ['메서드', '서드파티'],
  invalid: [
    {
      text: '한 문장에 연속하는 용어 메소드와 메소드와 메쏘드를 테스트합니다.',
      errors: [{index: 14}, {index: 19}, {index: 24}],
    },
    {
      text: '써드파티',
      errors: [{index: 0}],
    },
  ],
});
