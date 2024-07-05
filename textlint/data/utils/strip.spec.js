module.exports = {
  stripDoubleQuotes: [
    // Left: Nothing, Inner: Nothing, Right: Nothing
    {
      actual: '""',
      expected: '',
    },
    // Left: Nothing, Inner: Nothing, Right: Something
    {
      actual: '"" not-stripped-right',
      expected: ' not-stripped-right',
    },
    // Left: Nothing, Inner: Something, Right: Nothing
    {
      actual: '"stripped"',
      expected: '',
    },
    // Left: Nothing, Inner: Something, Right: Something
    {
      actual: '"stripped" not-stripped-right',
      expected: ' not-stripped-right',
    },
    // Left: Something, Inner: Nothing, Right: Nothing
    {
      actual: 'not-stripped-left ""',
      expected: 'not-stripped-left ',
    },
    // Left: Something, Inner: Nothing, Right: Something
    {
      actual: 'not-stripped-left "" not-stripped-right',
      expected: 'not-stripped-left  not-stripped-right',
    },
    // Left: Something, Inner: Something, Right: Nothing
    {
      actual: 'not-stripped-left "stripped"',
      expected: 'not-stripped-left ',
    },
    // Left: Something, Inner: Something, Right: Something
    {
      actual: 'not-stripped-left "stripped" not-stripped-right',
      expected: 'not-stripped-left  not-stripped-right',
    },
    // With only one double quote
    {
      actual: 'this double quote " should not be stripped',
      expected: 'this double quote " should not be stripped',
    },
  ],
  stripParentheses: [
    // Left: Nothing, Inner: Nothing, Right: Nothing
    {
      actual: '()',
      expected: '',
    },
    // Left: Nothing, Inner: Nothing, Right: Something
    {
      actual: '() not-stripped-right',
      expected: ' not-stripped-right',
    },
    // Left: Nothing, Inner: Something, Right: Nothing
    {
      actual: '(stripped)',
      expected: '',
    },
    // Left: Nothing, Inner: Something, Right: Something
    {
      actual: '(stripped) not-stripped-right',
      expected: ' not-stripped-right',
    },
    // Left: Something, Inner: Nothing, Right: Nothing
    {
      actual: 'not-stripped-left ()',
      expected: 'not-stripped-left ',
    },
    // Left: Something, Inner: Nothing, Right: Something
    {
      actual: 'not-stripped-left () not-stripped-right',
      expected: 'not-stripped-left  not-stripped-right',
    },
    // Left: Something, Inner: Something, Right: Nothing
    {
      actual: 'not-stripped-left (stripped)',
      expected: 'not-stripped-left ',
    },
    // Left: Something, Inner: Something, Right: Something
    {
      actual: 'not-stripped-left (stripped) not-stripped-right',
      expected: 'not-stripped-left  not-stripped-right',
    },
    // With only one left parentheses
    {
      actual: 'this left parentheses ( should not be stripped',
      expected: 'this left parentheses ( should not be stripped',
    },
    // With only one right parentheses
    {
      actual: 'this right parentheses ) should not be stripped',
      expected: 'this right parentheses ) should not be stripped',
    },
  ],
};
