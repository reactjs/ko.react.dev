const data = require('../data/translateGlossary');

/**
 * Look for all the `Str` type `node` on the AST Tree.
 *
 * @param {RuleContext} context
 * @returns
 */
module.exports = function ({Syntax, report, getSource, locator, RuleError}) {
  return {
    [Syntax.Str](node) {
      const text = getSource(node);

      data.forEach(({source, target}) => {
        source.forEach((typo) => {
          // Do not use 'g' flag with Textlint's 'pretty-error' option. It prevents Textlint from finding the exact location.
          const match = text.match(new RegExp(typo, 'i'));

          if (match) {
            report(
              node,
              new RuleError(
                `'${typo}'은/는 '${target}'(으)로 번역되어야 합니다.`,
                {
                  padding: locator.range([
                    match.index,
                    match.index + text.length,
                  ]),
                }
              )
            );
          }
        });
      });
    },
  };
};
