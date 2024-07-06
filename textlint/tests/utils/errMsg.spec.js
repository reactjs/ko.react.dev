const assert = require('assert');
const functions = require('../../utils/errMsg');
const testCases = require('../../data/utils/errMsg.spec');

describe('Util errMsg strictEqual testing', function () {
  Object.keys(testCases).forEach((funcName) => {
    describe(funcName, function () {
      testCases[funcName].forEach((testCase) => {
        it(`${testCase.actual.source}, ${testCase.actual.target} => ${testCase.expected}`, function () {
          assert.strictEqual(
            functions[funcName](testCase.actual.source, testCase.actual.target),
            testCase.expected
          );
        });
      });
    });
  });
});
