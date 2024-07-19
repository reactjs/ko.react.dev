const TextLintTester = require('textlint-tester').default;
const data = require('../../data/rules/translateGlossary');
const rule = require('../../rules/translateGlossary');
const {errMsgTranslateGlossary} = require('../../utils/errMsg');

const tester = new TextLintTester();

describe('translateGlossary', function () {
  Object.values(data).forEach((type1) => {
    Object.values(type1).forEach((type2) => {
      type2.forEach(({target, meta}) => {
        tester.run(`term: ${meta.term}`, rule, {
          invalid: [
            {
              text: `한글이 포함된 Str node. ${meta.term} 가나다 abc.`,
              errors: [
                {
                  message: errMsgTranslateGlossary(meta.term, target),
                },
              ],
            },
          ],
          valid: [
            `한글이 포함된 Str node. "${meta.term}" 라마바 def.`, // stripDoubleQuotes func should be applied.
            `한글이 포함된 Str node. (${meta.term}) 사아자 ghi.`, // stripParentheses func should be applied.
            target,
          ],
        });
      });
    });
  });
});
