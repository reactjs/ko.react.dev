/**
 * Returns error message using the given source and target texts.
 *
 * @param {string} source `'${source}'` part in return value.
 * @param {string} target `'${target}'` part in return value.
 * @returns {string} The error message. `'${source}'은/는 '${target}'(으)로 번역되어야 합니다.`
 */
function errMsgTranslateGlossary(source, target) {
  return `'${source}'은/는 '${target}'(으)로 번역되어야 합니다.`;
}

// Export the module
module.exports = {
  errMsgTranslateGlossary,
};
