module.exports = {
  errMsgTranslateGlossary: [
    // source: Nothing, target: Nothing
    {
      actual: {
        source: '',
        target: '',
      },
      expected: `''은/는 ''(으)로 번역되어야 합니다.`,
    },
    // source: Nothing, target: Something
    {
      actual: {
        source: '',
        target: '무언가',
      },
      expected: `''은/는 '무언가'(으)로 번역되어야 합니다.`,
    },
    // source: Something, target: Nothing
    {
      actual: {
        source: 'Something',
        target: '',
      },
      expected: `'Something'은/는 ''(으)로 번역되어야 합니다.`,
    },
    // source: Something, target: Something
    {
      actual: {
        source: 'Something',
        target: '무언가',
      },
      expected: `'Something'은/는 '무언가'(으)로 번역되어야 합니다.`,
    },
  ],
};
