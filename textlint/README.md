# textlint for ko.reactjs.org

React 공식 페이지 한국어 번역 시 활용하는 [textlint](https://textlint.github.io/)에 대해 설명합니다.

## 무엇인가요?

![textlint lint result](https://user-images.githubusercontent.com/7760903/53157203-58da9580-3604-11e9-88dc-59b96b01fe66.png)

textlint는 텍스트와 마크다운을 위한 linter이며 JavaScript로 구현되어 있습니다. [ESLint](https://eslint.org/)가 JavaScript에 가지는 역할과 같습니다.

## 특정 문맥에서 비활성화할 수 있나요?

[Filter Rule](https://textlint.github.io/docs/configuring.html#filter-rule) 중 하나인 [textlint-filter-rule-comments](https://github.com/textlint/textlint-filter-rule-comments)를 사용해서 비활성화할 수 있습니다. 미리 추가해놨으니 아래처럼 사용하시면 됩니다.

```md
<!-- textlint-disable -->

주석 사이에 있는 글은 모든 규칙이 비활성화됩니다.

<!-- textlint-enable -->
```

## 새로운 규칙(rule)을 어떻게 만드나요?

[textlint의 공식 문서 Creating Rules](https://textlint.github.io/docs/rule.html)를 숙지하고 다음 과정을 진행해주세요. 모든 코드는 `textlint` 폴더에서 작성됩니다.

- **`rules` 폴더에 1개의 규칙에 1개의 파일 생성**

커맨드 라인의 `--rulesdir` 옵션을 통해 실행되므로 `rules` 폴더 하위에는 규칙과 파일을 대응시켜서 작성해주세요.

- **`tests` 폴더에 테스트 코드 작성**

[`textlint-tester`](https://github.com/textlint/textlint/tree/master/packages/textlint-tester)를 활용해서 작성한 규칙에 대응되는 테스트를 작성해주세요. 올바른 사례와 올바르지 못한 사용 사례를 포함하고 올바르지 못한 사례는 번역자가 빠르게 수정할 수 있도록 `index`를 통해 오류가 발생한 위치를 알맞게 안내하고 있는지 검증해주세요.

아래처럼 실행한다면 모든 규칙 구현에 대한 테스트를 실행할 수 있습니다.

```
$ yarn test:textlint
```

## 주의해야 할 사항이 있나요?

- 모든 글이 번역된 상태가 아니며 번역이 완료되어도 새로운 글은 계속해서 번역이 되어야 하기 때문에 git pre-commit hook에서만 textlint를 실행하며 전체 마크다운 파일을 대상으로 CI에서 실행할 계획은 없습니다. 규칙의 구현에 대한 테스트는 CI에서 실행됩니다.
- `--fix`를 통해 자동으로 수정할 수 있는 [Fixable Rule](https://textlint.github.io/docs/rule-fixable.html)은 의도적으로 작성하지 않습니다. 사람이 코드로 작성한 규칙이기 때문에 완벽하지 않으며 번역자가 인지하지 못한 채로 수정되기보다 문맥을 확인하고 수정하는 방향이 바람직하다고 생각하기 때문입니다.
