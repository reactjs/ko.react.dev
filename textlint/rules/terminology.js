/**
 * 외래어 표기 및 약속된 용어를 위한 규칙
 */
module.exports = function(context) {
  const {Syntax} = context;
  return {
    [Syntax.Str](node) {
      const {getSource, RuleError, report} = context;
      const text = getSource(node);

      for (const term of terms) {
        for (const expression of term.expressions) {
          let result;
          while ((result = expression.exec(text))) {
            report(
              node,
              new RuleError(term.message, {
                index: result.index,
              }),
            );
          }
        }
      }
    },
  };
};

/**
 * 전역 검색을 위한 일련의 정규표현식을 생성합니다.
 * @param {RegExp[]} args
 * @return {RegExp[]} 'g' 플래그가 설정된 일련의 정규표현식
 */
const g = args => args.map(arg => new RegExp(arg, 'g'));

/**
 * @typedef {Object} Terminology
 * @property {string} value - 올바른 용어
 * @property {RegExp[]} expressions - 올바르지 못한 용어에 대한 일련의 정규표현식
 * @property {string} message - 에러 메시지
 *
 * @type {Terminology[]}
 */
const terms = [
  {
    // http://www.korean.go.kr/front/onlineQna/onlineQnaView.do?mn_id=61&qna_seq=11976
    value: '메서드',
    expressions: [/메소드/, /메쏘드/],
    message: 'method는 메서드가 올바른 표현입니다',
  },
  {
    // https://opendict.korean.go.kr/dictionary/view?sense_no=1251028
    value: '서드 파티',
    expressions: [/서드파티/, /써드파티/, /써드 파티/],
    message: 'third party는 서드 파티가 올바른 표현입니다',
  },
  {
    value: '예시',
    expressions: [/예제/],
    message: 'example은 예시로 표현합니다.',
  },
  {
    value: '애플리케이션',
    expressions: [/응용프로그램/, /어플리케이션/],
    message: 'application은 애플리케이션으로 표현합니다.',
  },
  {
    value: '함수 컴포넌트',
    expressions: [/함수형 컴포넌트/],
    message: 'function(al) component는 함수 컴포넌트로 표현합니다.',
  },
  {
    value: '생명주기',
    expressions: [/라이프사이클/],
    message: 'life cycle은 생명주기로 표현합니다.',
  },
].map(term => ({...term, expressions: g(term.expressions)}));
