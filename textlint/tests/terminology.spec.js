const TextLintTester = require('textlint-tester');
const rule = require('../rules/terminology');

const tester = new TextLintTester();

tester.run('terminology', rule, {
  valid: [
    '메서드',
    '서드 파티',
    '예시',
    '애플리케이션',
    '함수 컴포넌트',
    '생명주기',
  ],
  invalid: [
    {
      text: '한 문장에 연속하는 용어 메소드와 메소드와 메쏘드를 테스트합니다.',
      errors: [{index: 14}, {index: 19}, {index: 24}],
    },
    {
      text: '서드파티와 써드파티와 써드 파티',
      errors: [{index: 0}, {index: 6}, {index: 12}],
    },
    {
      text: '예제',
      errors: [{index: 0}],
    },
    {
      text: '응용프로그램과 어플리케이션',
      errors: [{index: 0}, {index: 8}],
    },
    {
      text: '함수형 컴포넌트',
      errors: [{index: 0}],
    },
    {
      text: '라이프사이클',
      errors: [{index: 0}],
    },
  ],
});
