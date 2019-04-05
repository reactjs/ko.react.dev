---
id: react-without-jsx
title: JSX 없이 사용하는 React
permalink: docs/react-without-jsx.html
---

React를 사용할 때 JSX는 필수가 아닙니다. 빌드 환경에서 컴파일 설정을 하고 싶지 않을 때 JSX 없이 React를 사용하는 것은 특히 편리합니다.

각 JSX 엘리먼트는 `React.createElement(component, props, ...children)`를 호출하기 위한 문법 설탕입니다. 그래서 JSX로 할 수 있는 모든 것은 순수 JavaScript로도 할 수 있습니다.

예를 들어 다음의 JSX로 작성된 코드는

```js
class Hello extends React.Component {
  render() {
    return <div>Hello {this.props.toWhat}</div>;
  }
}

ReactDOM.render(
  <Hello toWhat="World" />,
  document.getElementById('root')
);
```

아래처럼 JSX를 사용하지 않은 코드로 컴파일될 수 있습니다.

```js
class Hello extends React.Component {
  render() {
    return React.createElement('div', null, `Hello ${this.props.toWhat}`);
  }
}

ReactDOM.render(
  React.createElement(Hello, {toWhat: 'World'}, null),
  document.getElementById('root')
);
```

JSX가 JavaScript로 변환되는 예시를 더 보고 싶다면 [the online Babel compiler](babel://jsx-simple-example)를 참고하세요.

컴포넌트는 문자열이나 `React.Component`의 하위 클래스 또는 무상태 컴포넌트를 위한 순수 함수로 제공됩니다.

`React.createElement`를 너무 많이 입력하는 것이 피곤하다면 짧은 변수에 할당하는 방법이 있습니다.

```js
const e = React.createElement;

ReactDOM.render(
  e('div', null, 'Hello World'),
  document.getElementById('root')
);
```

`React.createElement`를 짧은 변수에 할당하면 편리하게 JSX 없이 React를 사용할 수 있습니다.

더 간결한 구문을 제공하는 [`react-hyperscript`](https://github.com/mlmorg/react-hyperscript)나 [`hyperscript-helpers`](https://github.com/ohanhi/hyperscript-helpers) 같은 커뮤니티 프로젝트를 참고해도 좋습니다.
