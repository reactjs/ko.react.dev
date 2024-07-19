/**
 * Check if a string contains any Korean characters.
 *
 * @param {string} text The string to check.
 * @returns {boolean} Returns true if the string contains Korean characters, false otherwise.
 */
function isKoreanIncluded(text) {
  const regex = /[ㄱ-ㅎㅏ-ㅣ가-힣]/;

  return regex.test(text);
}

module.exports = {
  isKoreanIncluded,
};
