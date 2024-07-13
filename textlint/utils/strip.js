/**
 * Remove text inside double quotes `""` from the input string.
 *
 * @param {string} text The input string.
 * @returns {string} The string with text inside double quotes `""` removed.
 */
function stripDoubleQuotes(text) {
  return text.replace(/"[^"]*"/g, '');
}

/**
 * Remove text inside parentheses `()` from the input string.
 *
 * @param {string} text The input string.
 * @returns {string} The string with text inside parentheses `()` removed.
 */
function stripParentheses(text) {
  return text.replace(/\([^)]*\)/g, '');
}

module.exports = {
  stripDoubleQuotes,
  stripParentheses,
};
