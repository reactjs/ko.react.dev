/**
 * 문장 끝 쌍점(:)과 쌍반점(;)에 대한 규칙
 */
module.exports = function(context) {
  const {Syntax} = context;
  return {
    [Syntax.Str](node) {
      const {getSource, RuleError, report} = context;
      const text = getSource(node);
      const match = text.match(/[:;]$/);
      if (match) {
        report(
          node,
          new RuleError('문장 끝에 쌍점(:)과 쌍반점(;)은 사용하지 않습니다', {
            index: match.index,
          }),
        );
      }
    },
  };
};
