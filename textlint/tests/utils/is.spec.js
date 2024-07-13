const assert = require('assert');
const functions = require('../../utils/is');
const testCases = require('../../data/utils/is.spec');

describe('Util is strictEqual testing', function () {
  Object.keys(testCases).forEach((funcName) => {
    describe(funcName, function () {
      testCases[funcName].forEach((testCase) => {
        it(`${testCase.actual} => ${testCase.expected}`, function () {
          assert.strictEqual(
            functions[funcName](testCase.actual),
            testCase.expected
          );
        });
      });
    });
  });
});
