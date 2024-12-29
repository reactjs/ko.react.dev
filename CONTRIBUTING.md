# 기여하기

React 문서 기여에 관심을 가져주셔서 감사합니다!

## 행동 강령

페이스북<sup>Facebook</sup>은 프로젝트 참가자가 준수해야 하는 행동 강령을 채택했습니다. [전문을 읽어보세요](https://code.facebook.com/codeofconduct). 어떤 행동이 허용되고 허용되지 않는지 확인할 수 있습니다.

## 기술 문서 작성 팁

기술 문서를 작성할 때 염두에 두어야 할 사항에 대한 [좋은 요약](https://medium.com/@kvosswinkel/coding-like-a-journalist-ee52360a16bc)입니다.

## 글에 대한 가이드라인

**섹션마다 의도적으로 다른 스타일을 사용합니다.**

이 문서는 다양한 학습 스타일과 사용 사례를 고려하여 분할되어 있습니다. 본문을 수정할 때는 주변 글의 톤<sup>Tone</sup>과 스타일<sup>Style</sup>에 맞게 작성하도록 주의하세요. 새로운 글을 작성할 때는 같은 섹션에 있는 다른 글들과 톤을 맞추도록 하세요. 각 섹션의 의도와 동기는 아래에서 확인할 수 있습니다.

**[React 학습하기](https://ko.react.dev/learn)** 섹션은 기초 개념을 단계별로 소개하기 위해 만들어졌습니다. 여기서 제공되는 글들은 이전에 설명된 지식을 바탕으로 하므로, 글 간 앞뒤 개념이 중복되거나 꼬이지 않도록 주의하세요. 독자는 첫 번째 글부터 마지막 글까지 순서대로 읽으며 개념을 익힐 수 있어야 하며, 추가 설명을 위해 미리 앞선 개념들을 살펴보지 않도록 해야 합니다. 이런 이유로 상태<sup>State</sup>는 이벤트<sup>Event</sup>보다 먼저 설명되고, 'React로 사고하기' 파트에서 `ref`를 사용하지 않는 등 특정 순서가 정해져 있습니다. 동시에 'React 학습하기'는 React 개념에 대한 참고 자료 역할을 하므로, 개념들에 대한 정의와 상호 관계를 엄격하게 다루어야 합니다.

**[API 참고서](https://ko.react.dev/reference/react)** 섹션은 개념이 아닌 API별로 정리되어 있으며, 가능한 한 모든 경우를 포함하는 것을 목표로 합니다. 'React 학습하기'에서 간단히 다뤘거나 생략한 예외 사항<sup>Edge Cases</sup> 혹은 권장 사항<sup>Recommendations</sup>은 해당 API의 레퍼런스 문서에 추가로 언급해야 합니다.

**스스로 작성한 지침<sup>Instructions</sup>을 실천해 보세요.**

예를 들어, 단계별 가이드를 작성한다면, 직접 그 지침을 따라가 보며 누락된 내용이나 순서가 맞지 않는 부분을 찾아보세요. 실제로 지침을 순서대로 진행하다보면, 작성자가 설명하지 않은 배경지식이 있거나, 단계가 뒤섞여 있는 등의 문제를 발견할 수 있습니다. 가능하다면 다른 사람에게 지침을 따라보게 하고, 그들이 어려움을 겪는 부분을 관찰하는 것도 좋은 방법입니다. 사소해 보이지만 예상치 못한 곳에서 문제가 생길 수 있습니다.

## 코드 예시에 대한 가이드라인

### 구문<sup>Syntax</sup>

#### 가능하면 `createElement` 대신 JSX를 사용하세요

단, `createElement` 자체를 설명해야 하는 경우는 예외입니다.

#### 가능하면 `const`, 필요한 경우에는 `let`을 사용하고, `var`는 사용하지 마세요

ES5만 다루는 경우라면 이 규칙은 무시하세요.

#### ES5의 기능만으로 간단하게 작성할 수 있는 경우, ES6의 기능을 무조건적으로 사용하지 마세요

ES6가 아직 낯선 사람도 많습니다. 이미 여러 곳에서 `const` / `let`, 클래스, 화살표 함수 등을 사용하고 있지만, 그에 상응하는 ES5 코드가 간단하고 가독성이 좋다면 ES5를 사용하는 것도 고려하세요.

특히 최상위 함수에서는 `const myFunction = () => ...`과 같은 화살표 함수 대신에 이름 있는 `function` 선언을 선호합니다. 하지만 컴포넌트 내 `this` 컨텍스트를 유지해야 하는 경우에는 화살표 함수를 사용하세요. 새로운 문법을 사용할 때는 장단점을 모두 따져보고 결정하세요.

#### 아직 표준화되지 않은 기능은 사용하지 마세요

예를 들어, 다음 코드처럼 작성하지 마세요.

```js
class MyComponent extends React.Component {
  state = {value: ''};
  handleChange = (e) => {
    this.setState({value: e.target.value});
  };
}
```

대신, 다음처럼 작성하세요.

```js
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {value: ''};
  }
  handleChange(e) {
    this.setState({value: e.target.value});
  }
}
```

실험적인 제안<sup>Experimental Proposal</sup>에 대해 설명하는 경우라면 예외로 하되, 코드와 주변 글에서 실험적임<sup>Experimental</sup>을 명시하세요.

### 스타일

- 세미콜론을 사용하세요.
- 함수 이름과 괄호 사이에는 공백을 넣지 마세요. (`method () {}`가 아닌, `method() {}` 형태.)
- 고민될 때는 [Prettier](https://prettier.io/playground/)의 기본 스타일을 따르세요.
- Hooks, Effects, Transitions 같은 React 관련 개념은 항상 대문자로 시작하세요.

### 하이라이팅

마크다운<sup>Markdown</sup>의 코드 블록에서는 `js`를 사용하세요:

````
```js
// 코드
```
````

간혹 숫자와 함께 사용되는 블록이 있습니다.
이는 특정 줄을 강조하기 위한 용도입니다.

한 줄을 강조하는 예시.

````
```js {2}
function hello() {
  // 이 줄이 강조됩니다
}
```
````

일정 범위를 강조하는 예시.

````
```js {2-4}
function hello() {
  // 여기부터
  // 시작해서
  // 여기까지 강조됩니다
}
```
````

여러 범위를 강조하는 예시.

````
```js {2-4,6}
function hello() {
  // 여기부터
  // 시작해서
  // 여기까지 강조됩니다
  console.log('hello');
  // 이 줄도 강조됩니다
  console.log('there');
}
```
````

코드를 이동하거나 순서를 바꿨다면, 강조하는 줄도 같이 수정해야 한다는 점을 잊지 마세요.

강조 기능은 독자가 놓치기 쉬운 구체적인 부분에 주의를 환기해주므로 적극적으로 사용하길 권장합니다.
