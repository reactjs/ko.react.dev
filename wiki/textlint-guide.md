# `textlint` 가이드

React 공식 문서 한국어 번역 시 활용하는 [`textlint`](https://textlint.github.io/)에 대해 설명합니다.

## 무엇인가요?

```bash
translateGlossary: '인터랙션'은/는 '상호작용'(으)로 번역되어야 합니다.
ko.react.dev/src/content/blog/2022/06/15/react-labs-what-we-have-been-working-on-june-2022.md:74:22
                                           v
    73.
    74. 이러한 문제를 해결하는 새로운 버전의 인터랙션 추적 API(`startTransition`을 통해 시작되므로 가칭 트랜지션 추적이라고 함)를 개발 중입니다.
    75.
                                           ^

translateGlossary: '튜토리얼'은/는 '자습서'(으)로 번역되어야 합니다.
ko.react.dev/src/content/blog/2023/03/16/introducing-react-dev.md:60:35
                                                       v
    59.
    60. 직접 해보며 배우고 싶다면, 다음으로 [Tic-Tac-Toe 튜토리얼](/learn/tutorial-tic-tac-toe)을 확인하는 것을 추천합니다. React로 작은 게임을 구현하는 것을 자
세히 설명하면서, 동시에 일상적으로 사용할 기술을 가르칩니다. 여기에 구현하게 될 내용이 있습니다.
    61.
                                                       ^
```

`textlint`는 텍스트(`.txt`)와 마크다운(`.md`, `.mdx`)을 위한 린터<sup>Linter</sup>이며 자바스크립트<sup>JavaScript</sup>로 구현되어 있습니다. [ESLint](https://eslint.org/)가 자바스크립트에 가지는 역할과 같습니다.

## 어떻게 실행할 수 있나요?

[`package.json`](/package.json) 상에 `scripts`로 등록해 두었기에, 아래와 같은 커맨드로 실행할 수 있습니다.

### 1. 규칙 검사

가장 많이 활용되는 커맨드입니다.

```bash
yarn textlint-lint
```

### 2. 테스트 실행

```bash
yarn textlint-test
```

### 3. 규칙에 따른 문서 생성

```bash
yarn textlint-docs
```

## 어떤 영역을 검사하나요?

`textlint`는 공식 문서에 실질적으로 나타나는 부분인 [`/src/content`](/src/content/) 폴더 내부의 마크다운(`.md`) 파일만을 검사합니다.

### 마크다운 문서 내부에서 검사하지 않는 영역

> [!NOTE]
>
> - `textlint`는 마크다운 문서를 AST Tree로 파싱<sup>Parsing</sup> 합니다. ko.react.dev에서 구현한 규칙은 `@textlint/text-to-ast-14.0.5` 패키지에 의해 AST Tree로 파싱 된 노드<sup>Node</sup>들 중 `Str` 노드만을 검사합니다. ([`/textlint/rules/translateGlossary.js` 참고](/textlint/rules/translateGlossary.js))
>
> - 또한, 모든 `Str` 노드를 검사하는 것은 아닙니다. 영어 원문 번역본이 계속해서 추가되기에, 오직 영어만으로 구성된 `Str` 노드는 검사에서 제외합니다. 즉, 파싱된 `Str` 노드 중 한글이 하나라도 포함된 문장만을 검사합니다. ([`/textlint/utils/is.js` 참고](/textlint/utils/is.js))
>
> - 이외에도, ko.react.dev에서는 `""` 및 `()`로 감싸져 있는 문장은 검사하지 않습니다. `""`에는 주로 에러 메시지 등 영어 원문 그 자체의 내용이 들어가는 경우가 많으며, `()` 역시 독자의 이해를 위해 영어 원문이 그대로 들어가는 경우가 많기 때문입니다. ([`/textlint/utils/strip.js` 참고](/textlint/utils/strip.js))

#### 1. 코드 블럭

````md
```js
const hello = 'world';
```
````

#### 2. 인라인 코드 블럭

```md
`hello world`
```

#### 3. 한글이 포함되지 않은 문장

```md
This text will not be linted.
```

#### 4. 쌍따옴표(`""`)로 감싸져 있는 문장

```md
"이 문장은 검사되지 않습니다."
```

#### 5. 소괄호(`()`)로 감싸져 있는 문장

```md
(이 문장은 검사되지 않습니다.)
```

## 특정 문맥에서 비활성화할 수 있나요?

영어 표현을 부득이 하게 사용해야 할 경우, 위에서 언급한 쌍따옴표(`""`)및 소괄호(`()`)를 활용하여 특정 문장을 감쌀 것을 권장합니다.

위 방법을 사용할 수 없는 경우, `textlint`에서 제공하는 [Filter Rule](https://textlint.github.io/docs/configuring.html#filter-rule) 중 하나인 [`textlint-filter-rule-comments`](https://github.com/textlint/textlint-filter-rule-comments)를 사용해서 비활성화할 수 있습니다. 이미 추가되어 있으니 아래처럼 사용하시면 됩니다.

```md
<!-- textlint-disable -->

주석 사이에 있는 글은 모든 규칙이 비활성화됩니다.

<!-- textlint-enable -->
```

예를 들어, 한글 문장 안에 의도적으로 번역하지 않은 영어 원문을 사용해야 하는 경우 사용을 고려해 볼 수 있습니다. 이는 `textlint`가 검사하는 일부 영역에 대해 의도적으로 **규칙을 해제(예외를 설정)** 하는 것입니다.

## 새로운 규칙(rule)을 어떻게 만드나요?

[`textlint`의 공식 문서 Creating Rules](https://textlint.github.io/docs/rule.html)를 숙지하고 다음 과정을 진행해주세요.

### ko.react.dev에서만 사용하는 규칙인 경우

`textlint`와 관련된 모든 코드는 [`/textlint`](/textlint) 폴더에 작성합니다.

#### 1. [`/textlint/rules`](/textlint/rules) 폴더에 1개 규칙에 1개 파일 생성

특정 규칙은 `textlint` 커맨드 라인의 `--rulesdir` 옵션을 통해 실행되므로, `/textlint/rules` 폴더 하위에는 규칙과 파일을 대응시켜 작성해주세요.

#### 2. [`/textlint/tests/rules`](/textlint/tests/rules) 폴더에 테스트 코드 작성

[`textlint-tester`](https://github.com/textlint/textlint/tree/master/packages/textlint-tester)를 활용해서 작성한 규칙에 대응되는 테스트를 작성해주세요. 올바른 사례와 올바르지 못한 사용 사례를 포함하고, 올바르지 못한 사례는 번역자가 빠르게 수정할 수 있도록 `index`를 통해 오류가 발생한 위치를 알맞게 안내하고 있는지 검증해주세요.

아래처럼 실행하면 모든 규칙 구현에 대한 테스트를 실행할 수 있습니다.

```bash
yarn textlint-test
```

### 외부 규칙을 사용하는 경우

아래와 같은 예시를 따라주세요.

#### 1. `yarn`을 통해 특정 패키지를 개발 의존성으로 설치

```bash
yarn add --dev textlint-rule-allowed-uris
```

#### 2. [`/.textlintrc`](/.textlintrc) 파일을 해당 규칙에 맞게 수정

```javascript
module.exports = {
  rules: {
    'allowed-uris': {
      allowed: {
        links: [/google/],
      },
    },
  },
};
```

## 주의해야 할 사항이 있나요?

- `--fix` 옵션을 통해 자동으로 수정할 수 있는 [Fixable Rule](https://textlint.github.io/docs/rule-fixable.html)은 의도적으로 작성하지 않았습니다. 사람이 코드로 작성한 규칙이기 때문에 완벽하지 않으며 번역자가 인지하지 못한 채로 수정되기보다 문맥을 확인하고 수정하는 방향이 바람직하다고 생각하기 때문입니다.

- `textlint`의 검사 기능은 의도적으로 최대한 느슨하게 만들었습니다. 엄격하게 검사를 진행할 경우, 번역 간 문장 이해 및 흐름에 방해가 될 수 있기 때문입니다.

- `.json` 파일 형식으로 구현된 사이드바 메뉴 상의 내용들은 검사하지 않습니다. 따라서, 사이드바 메뉴 상에 표현된 내용들은 직접 수정해야 합니다. `src/sidebarBlog.json` 등이 이에 해당합니다.

- React 문서상의 링크를 연결하기 위해 구현한 `{/* ... */}` 내부의 문자열은 항상 영어로만 구성되므로, [마크다운 문서 내부에서 검사하지 않는 영역](#마크다운-문서-내부에서-검사하지-않는-영역)의 설정에 의해 검사가 자동으로 제외됩니다.
