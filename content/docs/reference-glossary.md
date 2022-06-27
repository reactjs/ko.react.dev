---
id: glossary
title: React 기술 용어 모음
layout: docs
category: Reference
permalink: docs/glossary.html

---

## 싱글 페이지 애플리케이션 {#single-page-application}

싱글 페이지 애플리케이션(Single-page application, SPA)은 하나의 HTML 페이지와 애플리케이션 실행에 필요한 JavaScript와 CSS 같은 모든 자산을 로드하는 애플리케이션입니다. 페이지 또는 후속 페이지의 상호작용은 서버로부터 새로운 페이지를 불러오지 않으므로 페이지가 다시 로드되지 않습니다.

React를 사용하여 싱글 페이지 애플리케이션을 만들 수 있지만, 필수 사항은 아닙니다. 기존 웹사이트 일부분의 상호작용을 개선하기 위하여 React를 사용할 수 있습니다. React로 작성된 코드는 PHP와 같은 서버에 의해 렌더된 마크업 또는 다른 클라이언트사이드 라이브러리와 함께 문제없이 공존할 수 있습니다. 사실, Facebook에서는 위와 같은 방식으로 React를 사용하고 있습니다.

## ES6, ES2015, ES2016 등 {#es6-es2015-es2016-etc}

이 약어들은 모두 ECMAScript 언어 명세의 최신 버전을 나타내며, JavaScript는 이를 구현한 것입니다. ES6 버전(ES2015로도 알려져 있습니다)에는 이전 버전에 없던 화살표 함수(arrow function), class, 템플릿 리터럴(template literal), `let` 과 `const` 구문과 같은 많은 추가 사항이 포함되어 있습니다. 특정 버전에 대한 자세한 내용은 [여기](https://en.wikipedia.org/wiki/ECMAScript#Versions)에서 확인할 수 있습니다.

## 컴파일러 {#compilers}

JavaScript 컴파일러(Compiler)는 JavaScript 코드를 변환하고 다른 형식으로 JavaScript 코드를 반환합니다. 일반적으로 ES6 문법을 구형 브라우저에서도 동작할 수 있도록 변환하는 데 많이 사용합니다. [Babel](https://babeljs.io/)은 React와 함께 가장 널리 사용되는 컴파일러입니다.

## 번들러 {#bundlers}

번들러(Bundler)는 분리된 JavaScript와 CSS 모듈 코드를 브라우저에 최적화된 여러 개의 파일로 결합합니다. React 애플리케이션에서 널리 사용되는 번들러에는 [Webpack](https://webpack.js.org/)과 [Browserify](http://browserify.org/)가 있습니다.

## 패키지 관리자 {#package-managers}

패키지 관리자는 프로젝트의 종속성을 관리할 수 있는 도구입니다. [npm](https://www.npmjs.com/)과 [Yarn](https://yarnpkg.com/)은 React 애플리케이션에서 자주 사용되는 패키지 관리자입니다. 두 패키지 관리자 모두 같은 npm 패키지 레지스트리의 클라이언트입니다.

## CDN {#cdn}

CDN은 Content Delivery Network의 약자입니다. CDN은 전 세계의 서버 네트워크에서 캐시된 정적 콘텐츠를 제공합니다.

## JSX {#jsx}

JSX는 JavaScript의 확장 문법입니다. JSX는 템플릿 언어와 비슷해 보이지만, JavaScript의 강력한 기능들을 모두 사용할 수 있습니다. JSX는 `React.createElement()`의 호출을 통해 일반 JavaScript 객체인 "React 엘리먼트"(React element)로 컴파일됩니다. JSX에 대한 기본 소개는 [여기](/docs/introducing-jsx.html)에서 확인할 수 있으며 JSX에 대한 자세한 튜토리얼은 [여기](/docs/jsx-in-depth.html)에서 확인할 수 있습니다.

React DOM은 HTML 어트리뷰트(attribute) 이름 대신 캐멀케이스(camelCase)를 네이밍 컨벤션으로 사용합니다. 예를 들어, JSX에서 `tabindex`는 `tabIndex`로 작성합니다. `class` 어트리뷰트는 JavaScript의 예약어이므로 `className`으로 작성합니다.

<<<<<<< HEAD
```js
const name = 'Clementine';
ReactDOM.render(
  <h1 className="hello">My name is {name}!</h1>,
  document.getElementById('root')
);
=======
```jsx
<h1 className="hello">My name is Clementine!</h1>
>>>>>>> c1c3d1db304adfa5446accb0312e60d515188414
```

## [엘리먼트](/docs/rendering-elements.html) {#elements}

React 엘리먼트(React Element)는 React 애플리캐이션을 구성하는 블록입니다. 엘리먼트는 "컴포넌트(Component)"라는 널리 알려진 개념과 혼동되기 쉽습니다. 엘리먼트는 화면에 보이는 것들을 기술하며, React 엘리먼트는 변경되지 않습니다.

```js
const element = <h1>Hello, world</h1>;
```

일반적으로 엘리먼트는 직접 사용되지 않고 컴포넌트로부터 반환됩니다.

## [컴포넌트](/docs/components-and-props.html) {#components}

React 컴포넌트는 페이지에 렌더링할 React 엘리먼트를 반환하는 작고 재사용 가능한 코드 조각입니다. 가장 간단한 React 컴포넌트는 React 엘리먼트를 반환하는 일반 JavaScript 함수입니다.

```js
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

컴포넌트는 ES6 class로도 작성할 수 있습니다.

```js
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

컴포넌트는 기능별로 나눌 수 있으며 다른 컴포넌트 안에서 사용할 수 있습니다. 컴포넌트는 다른 컴포넌트, 배열, 문자열 그리고 숫자를 반환할 수 있습니다. 화면을 구성하는 데 자주 사용되는 UI(Button, Panel, Avatar), 혹은 복잡한 UI(App, FeedStory, Comment) 컴포넌트는 재사용 가능한 컴포넌트가 될 수 있습니다. 컴포넌트의 이름은 항상 대문자로 시작해야 합니다 (`<Wrapper/>` **(o)** `<wrapper/>` **(x)**). 컴포넌트 렌더링에 대한 자세한 내용은 [이 문서](/docs/components-and-props.html#rendering-a-component)를 참고하세요.

### [`props`](/docs/components-and-props.html) {#props}

`props`는 컴포넌트의 입력값입니다. `props`는 부모 컴포넌트로부터 자식 컴포넌트로 전달된 데이터입니다.

`props`는 읽기 전용이라는 것에 주의하세요. `props`는 어떤 방식으로든 수정해서는 안 됩니다.

```js
// 틀린 예
props.number = 42;
```

사용자의 입력 또는 네트워크 응답에 반응하여 어떤 값을 수정해야 한다면 `state`를 사용하세요.

### `props.children` {#propschildren}

모든 컴포넌트에서 `props.children`를 사용할 수 있습니다. `props.children`은 컴포넌트의 여는 태그와 닫는 태그 사이의 내용을 포함합니다. 예를 들어,

```js
<Welcome>Hello world!</Welcome>
```

`Hello world!` 문자열은 `Welcome` 컴포넌트의 `props.children`으로 사용할 수 있습니다.

```js
function Welcome(props) {
  return <p>{props.children}</p>;
}
```

Class로 정의된 컴포넌트에서는 `this.props.children`을 사용합니다.

```js
class Welcome extends React.Component {
  render() {
    return <p>{this.props.children}</p>;
  }
}
```

### [`state`](/docs/state-and-lifecycle.html#adding-local-state-to-a-class) {#state}

컴포넌트와 관련된 일부 데이터가 시간에 따라 변경될 경우 `state`가 필요합니다. 예를 들어, `Checkbox` 컴포넌트는 `isChecked` state가 필요할 수 있으며, `NewsFeed` 컴포넌트는 `fetchedPosts`를 컴포넌트의 state를 통해 계속 주시하려고 할 수 있습니다.

`state`와 `props`의 가장 중요한 차이점은 `props`는 부모 컴포넌트로부터 전달받지만, `state`는 컴포넌트에서 관리된다는 것입니다. 컴포넌트는 `props`를 변경할 수 없지만, `state`는 변경할 수 있습니다.

데이터가 변경되는 각 특정한 부분에 대해, 해당 상태(state)를 "소유"하는 컴포넌트는 하나만 존재해야 합니다. 서로 다른 두 컴포넌트의 상태를 동기화하려고 하지마세요. 대신, 공통 상태를 두 컴포넌트의 공통 조상으로 [끌어올리고](/docs/lifting-state-up.html) 해당 데이터를 두 컴포넌트에 props로 전달하세요.

## [생명주기 메서드](/docs/state-and-lifecycle.html#adding-lifecycle-methods-to-a-class) {#lifecycle-methods}

생명주기 메서드(Lifecycle method)는 컴포넌트의 각각의 단계에서 실행되는 커스텀 기능입니다. 컴포넌트가 만들어지고 DOM에 삽입될 때([mounting](/docs/react-component.html#mounting)), 컴포넌트가 업데이트될 때 및 컴포넌트가 DOM에서 마운트 해제될 때(unmounted) 혹은 제거될 때 사용할 수 있는 기능을 제공합니다.

 ## [제어 컴포넌트](/docs/forms.html#controlled-components) vs. [비제어 컴포넌트](/docs/uncontrolled-components.html)

React는 두 가지 방식으로 form 입력을 처리합니다.

React에 의해 입력값이 제어되는 엘리먼트를 *제어 컴포넌트(controlled component)* 라고 합니다. 사용자가 제어 컴포넌트에 데이터를 입력하면 변경 이벤트 핸들러가 호출되고 코드가 (업데이트된 값으로 다시 렌더링에 의해) 입력의 유효 여부를 결정합니다. 다시 렌더링하지 않으면 form 엘리먼트는 변경되지 않은 상태로 유지됩니다.

*비제어 컴포넌트(uncontrolled component)*는 form 엘리먼트가 React 외부에서 작동하는 것처럼 작동합니다. 사용자가 form 필드(input box, dropdown 등)에 데이터를 입력하면 업데이트된 정보가 React에서 별도 처리할 필요 없이 엘리먼트에 반영됩니다. 그러나, 이는 특정 필드가 특정 값을 갖도록 강제할 수 없다는 의미이기도 합니다.

대부분은 controlled component를 사용해야 합니다.

## [Key](/docs/lists-and-keys.html) {#keys}

"key"는 엘리먼트의 배열을 만들 때 포함해야 하는 특별한 문자열입니다. key는 React가 어떤 항목을 변경, 추가 혹은 삭제할지 식별하는 것을 돕습니다. 엘리먼트들을 안정적으로 식별할 수 있도록 배열 내의 엘리먼트에 key를 제공해야 합니다.

Key는 같은 배열에 포함된 다른 요소 사이에서만 고윳값을 가지면 됩니다. 전체 애플리케이션 또는 단일 컴포넌트 전체에서 고윳값을 가질 필요는 없습니다.

`Math.random()` 같은 값을 Key로 사용하면 안 됩니다. React가 항목 추가, 제거 또는 다시 정렬할 시기를 결정할 수 있도록 Key는 다시 렌더링하는 과정 동안 "안정적으로 식별 가능"해야 합니다. 이상적으로, Key는 `post.id`와 같이 데이터에서 사용되는 유일하고 안정적인 식별자를 사용하는 것이 좋습니다.

## [Ref](/docs/refs-and-the-dom.html) {#refs}

React는 컴포넌트에 접근할 수 있는 특수한 어트리뷰트를 지원합니다. `ref` 어트리뷰트 [`React.createRef()` 함수](/docs/react-api.html#reactcreateref), 콜백 함수, 혹은 문자열(레거시 API에서)로 생성할 수 있습니다. ref 어트리뷰트가 콜백 함수인 경우, 함수는 DOM 엘리먼트나 class 인스턴스를 인자로 받습니다. 이를 통해 컴포넌트 인스턴스나 DOM 엘리먼트에 직접 접근할 수 있습니다.

Ref를 가능한 한 적게 사용하세요. 앱에서 Ref를 사용하여 "작동되는 부분"이 많다면 [하향식 데이터 흐름](/docs/lifting-state-up.html)을 사용하는 것이 더 좋습니다.

## [이벤트](/docs/handling-events.html) {#events}

React 엘리먼트에서 이벤트를 처리할 때는 일반적인 방식과는 구문상의 차이점이 있습니다.

* React 이벤트 핸들러는 소문자가 아닌 캐멀케이스(camelCase)를 사용합니다.
* JSX를 사용하면 문자열이 아닌 함수로 이벤트 핸들러를 전달합니다.

## [재조정](/docs/reconciliation.html) {#reconciliation}

컴포넌트의 state나 props가 변경되면 React는 새로 반환된 컴포넌트를 이전에 렌더링된 컴포넌트와 비교하여 실제 DOM을 업데이트 해야하는지 결정합니다. 두 컴포넌트가 동일하지 않다면, React는 DOM을 업데이트 합니다. 이 과정을 재조정(Reconciliation)이라고 합니다.
