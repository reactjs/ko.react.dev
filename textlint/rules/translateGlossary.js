const data = require('../data/rules/translateGlossary');
const {errMsgTranslateGlossary} = require('../utils/errMsg');
const {isKoreanIncluded} = require('../utils/is');
const {stripDoubleQuotes, stripParentheses} = require('../utils/strip');

/**
 * Rule for the Translate Glossary
 *
 * @param {RuleContext} context
 * @returns
 */
module.exports = function ({Syntax, report, getSource, locator, RuleError}) {
  return {
    [Syntax.Str](node) {
      const text = getSource(node);
      const textStripped = stripParentheses(stripDoubleQuotes(text));

      if (!isKoreanIncluded(textStripped)) return; // Textlint only when korean is included in `textStripped`.

      Object.values(data).forEach((type1) => {
        Object.values(type1).forEach((type2) => {
          type2.forEach(({sources, target}) => {
            sources.forEach((source) => {
              const matchIndex = text.match(new RegExp(source, 'i')); // Do not use 'g' flag with textlint's CLI 'pretty-error' option. It prevents textlint from finding the exact locations.
              const match = textStripped.match(new RegExp(source, 'i'));

              if (match) {
                report(
                  node,
                  new RuleError(errMsgTranslateGlossary(match[0], target), {
                    padding: locator.range([
                      matchIndex.index,
                      matchIndex.index + text.length,
                    ]),
                  })
                );
              }
            });
          });
        });
      });
    },
  };
};
