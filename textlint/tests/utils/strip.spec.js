const assert = require('assert');
const functions = require('../../utils/strip');
const testCases = require('../../data/utils/strip.spec');

describe('Util strip strictEqual testing', function () {
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
