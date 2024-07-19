module.exports = {
  isKoreanIncluded: [
    // Should return true for string containing Korean characters
    {
      actual: '안녕하세요',
      expected: true,
    },
    {
      actual: 'ㄱ',
      expected: true,
    },
    {
      actual: 'ㅏ',
      expected: true,
    },
    {
      actual: 'Hello 안녕하세요',
      expected: true,
    },
    {
      actual: '123 안녕하세요',
      expected: true,
    },
    {
      actual: 'Hello 123 !@#$%^&*() 한글 こんにちは 你好     ',
      expected: true,
    },
    // Should return false for string not containing Korean characters
    {
      actual: 'Hello', // English
      expected: false,
    },
    {
      actual: 'こんにちは', // Japanese
      expected: false,
    },
    {
      actual: '你好', // Chinese
      expected: false,
    },
    {
      actual: '123', // Number
      expected: false,
    },
    {
      actual: '!@#$%^&*()', // Special
      expected: false,
    },
    // Should return false for empty string
    {
      actual: '',
      expected: false,
    },
    // Should return false for string containing only spaces
    {
      actual: ' ',
      expected: false,
    },
    {
      actual: '     ',
      expected: false,
    },
  ],
};
