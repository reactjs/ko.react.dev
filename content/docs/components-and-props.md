---
id: components-and-props
title: Components와 Props
permalink: docs/components-and-props.html
redirect_from:
  - "docs/reusable-components.html"
  - "docs/reusable-components-zh-CN.html"
  - "docs/transferring-props.html"
  - "docs/transferring-props-it-IT.html"
  - "docs/transferring-props-ja-JP.html"
  - "docs/transferring-props-ko-KR.html"
  - "docs/transferring-props-zh-CN.html"
  - "tips/props-in-getInitialState-as-anti-pattern.html"
  - "tips/communicate-between-components.html"
prev: rendering-elements.html
next: state-and-lifecycle.html
---

<<<<<<< HEAD
컴포넌트를 통해 UI를 재사용 가능한 개별적인 여러 조각으로 나누고, 각 조각을 개별적으로 살펴볼 수 있습니다. 이 페이지에서는 컴포넌트의 개념을 소개합니다. [자세한 컴포넌트 API 레퍼런스는 여기](/docs/react-component.html)에서 확인할 수 있습니다.
=======
> Try the new React documentation.
> 
> These new documentation pages teach modern React and include live examples:
>
> - [Your First Component](https://beta.reactjs.org/learn/your-first-component)
> - [Passing Props to a Component](https://beta.reactjs.org/learn/passing-props-to-a-component)
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

Components let you split the UI into independent, reusable pieces, and think about each piece in isolation. This page provides an introduction to the idea of components. You can find a [detailed component API reference here](/docs/react-component.html).
>>>>>>> 5647a9485db3426d62b5a8203f4499c01bcd789b

개념적으로 컴포넌트는 JavaScript 함수와 유사합니다. "props"라고 하는 임의의 입력을 받은 후, 화면에 어떻게 표시되는지를 기술하는 React 엘리먼트를 반환합니다.

## 함수 컴포넌트와 클래스 컴포넌트 {#function-and-class-components}

컴포넌트를 정의하는 가장 간단한 방법은 JavaScript 함수를 작성하는 것입니다.

```js
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

이 함수는 데이터를 가진 하나의 "props" (props는 속성을 나타내는 데이터입니다) 객체 인자를 받은 후 React 엘리먼트를 반환하므로 유효한 React 컴포넌트입니다. 이러한 컴포넌트는 JavaScript 함수이기 때문에 말 그대로 "함수 컴포넌트"라고 호칭합니다.

또한 [ES6 class](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes)를 사용하여 컴포넌트를 정의할 수 있습니다.

```js
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

React의 관점에서 볼 때 위 두 가지 유형의 컴포넌트는 동일합니다.

class는 몇 가지 추가 기능이 있으며 이에 대해서는 [다음 장](/docs/state-and-lifecycle.html)에서 설명합니다. 그때까지는 간결성을 위해 함수 컴포넌트를 사용하겠습니다.
함수 컴포넌트와 클래스 컴포넌트 둘 다 몇 가지 추가 기능이 있으며 이에 대해서는 [다음 장](/docs/state-and-lifecycle.html)에서 설명합니다.

## 컴포넌트 렌더링 {#rendering-a-component}

이전까지는 DOM 태그만을 사용해 React 엘리먼트를 나타냈습니다.

```js
const element = <div />;
```

React 엘리먼트는 사용자 정의 컴포넌트로도 나타낼 수 있습니다.

```js
const element = <Welcome name="Sara" />;
```

React가 사용자 정의 컴포넌트로 작성한 엘리먼트를 발견하면 JSX 어트리뷰트와 자식을 해당 컴포넌트에 단일 객체로 전달합니다. 이 객체를 "props"라고 합니다.

다음은 페이지에 "Hello, Sara"를 렌더링하는 예시입니다.

```js{1,6}
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
const element = <Welcome name="Sara" />;
root.render(element);
```

**[CodePen에서 시험해보기](https://codepen.io/gaearon/pen/YGYmEG?editors=1010)**

이 예시에서는 다음과 같은 일들이 일어납니다.

1. `<Welcome name="Sara" />` 엘리먼트로 `root.render()`를 호출합니다.
2. React는 `{name: 'Sara'}`를 props로 하여 `Welcome` 컴포넌트를 호출합니다.
3. `Welcome` 컴포넌트는 결과적으로  `<h1>Hello, Sara</h1>` 엘리먼트를 반환합니다.
4. React DOM은 `<h1>Hello, Sara</h1>` 엘리먼트와 일치하도록 DOM을 효율적으로 업데이트합니다.



>**주의: 컴포넌트의 이름은 항상 대문자로 시작합니다.**
>
>React는 소문자로 시작하는 컴포넌트를 DOM 태그로 처리합니다. 예를 들어 `<div />`는 HTML div 태그를 나타내지만, `<Welcome />`은 컴포넌트를 나타내며 범위 안에 `Welcome`이 있어야 합니다.
>
>이 규칙에 대한 자세한 내용은 [여기](/docs/jsx-in-depth.html#user-defined-components-must-be-capitalized)에서 확인할 수 있습니다.


## 컴포넌트 합성 {#composing-components}

컴포넌트는 자신의 출력에 다른 컴포넌트를 참조할 수 있습니다. 이는 모든 세부 단계에서 동일한 추상 컴포넌트를 사용할 수 있음을 의미합니다. React 앱에서는 버튼, 폼, 다이얼로그, 화면 등의 모든 것들이 흔히 컴포넌트로 표현됩니다.

예를 들어 `Welcome`을 여러 번 렌더링하는 `App` 컴포넌트를 만들 수 있습니다.

```js{8-10}
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

function App() {
  return (
    <div>
      <Welcome name="Sara" />
      <Welcome name="Cahal" />
      <Welcome name="Edite" />
    </div>
  );
}
```

**[CodePen에서 시험해보기](https://codepen.io/gaearon/pen/KgQKPr?editors=1010)**

일반적으로 새 React 앱은 최상위에 단일 `App` 컴포넌트를 가지고 있습니다. 하지만 기존 앱에 React를 통합하는 경우에는 `Button`과 같은 작은 컴포넌트부터 시작해서 뷰 계층의 상단으로 올라가면서 점진적으로 작업해야 할 수 있습니다.

## 컴포넌트 추출 {#extracting-components}

컴포넌트를 여러 개의 작은 컴포넌트로 나누는 것을 두려워하지 마세요.

다음 `Comment` 컴포넌트를 살펴봅시다.

```js
function Comment(props) {
  return (
    <div className="Comment">
      <div className="UserInfo">
        <img className="Avatar"
          src={props.author.avatarUrl}
          alt={props.author.name}
        />
        <div className="UserInfo-name">
          {props.author.name}
        </div>
      </div>
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

**[CodePen에서 시험해보기](https://codepen.io/gaearon/pen/VKQwEo?editors=1010)**

이 컴포넌트는 `author`(객체), `text`(문자열) 및 `date`(날짜)를 props로 받은 후 소셜 미디어 웹 사이트의 코멘트를 나타냅니다.

이 컴포넌트는 구성요소들이 모두 중첩 구조로 이루어져 있어서 변경하기 어려울 수 있으며, 각 구성요소를 개별적으로 재사용하기도 힘듭니다. 이 컴포넌트에서 몇 가지 컴포넌트를 추출하겠습니다.

먼저 `Avatar`를 추출하겠습니다.

```js{3-6}
function Avatar(props) {
  return (
    <img className="Avatar"
      src={props.user.avatarUrl}
      alt={props.user.name}
    />
  );
}
```

`Avatar` 는 자신이 `Comment` 내에서 렌더링 된다는 것을 알 필요가 없습니다. 따라서 props의 이름을 `author`에서 더욱 일반화된 `user`로 변경하였습니다. 

props의 이름은 사용될 context가 아닌 컴포넌트 자체의 관점에서 짓는 것을 권장합니다.

이제 `Comment` 가 살짝 단순해졌습니다. 

```js{5}
function Comment(props) {
  return (
    <div className="Comment">
      <div className="UserInfo">
        <Avatar user={props.author} />
        <div className="UserInfo-name">
          {props.author.name}
        </div>
      </div>
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

다음으로 `Avatar` 옆에 사용자의 이름을 렌더링하는 `UserInfo` 컴포넌트를 추출하겠습니다.

```js{3-8}
function UserInfo(props) {
  return (
    <div className="UserInfo">
      <Avatar user={props.user} />
      <div className="UserInfo-name">
        {props.user.name}
      </div>
    </div>
  );
}
```

`Comment` 가 더욱 단순해졌습니다.

```js{4}
function Comment(props) {
  return (
    <div className="Comment">
      <UserInfo user={props.author} />
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

**[CodePen에서 시험해보기](https://codepen.io/gaearon/pen/rrJNJY?editors=1010)**

처음에는 컴포넌트를 추출하는 작업이 지루해 보일 수 있습니다. 하지만 재사용 가능한 컴포넌트를 만들어 놓는 것은 더 큰 앱에서 작업할 때 두각을 나타냅니다. UI 일부가 여러 번 사용되거나 (`Button`, `Panel`, `Avatar`), UI 일부가 자체적으로 복잡한 (`App`, `FeedStory`, `Comment`) 경우에는 별도의 컴포넌트로 만드는 게 좋습니다.

## props는 읽기 전용입니다.  {#props-are-read-only}

함수 컴포넌트나 클래스 컴포넌트 모두 컴포넌트의 자체 props를 수정해서는 안 됩니다. 다음 `sum` 함수를 살펴봅시다.

```js
function sum(a, b) {
  return a + b;
}
```

이런 함수들은 [순수 함수](https://en.wikipedia.org/wiki/Pure_function)라고 호칭합니다. 입력값을 바꾸려 하지 않고 항상 동일한 입력값에 대해 동일한 결과를 반환하기 때문입니다.

반면에 다음 함수는 자신의 입력값을 변경하기 때문에 순수 함수가 아닙니다.

```js
function withdraw(account, amount) {
  account.total -= amount;
}
```

React는 매우 유연하지만 한 가지 엄격한 규칙이 있습니다.

**모든 React 컴포넌트는 자신의 props를 다룰 때 반드시 순수 함수처럼 동작해야 합니다.**

물론 애플리케이션 UI는 동적이며 시간에 따라 변합니다. [다음 장](/docs/state-and-lifecycle.html)에서는 "state"라는 새로운 개념을 소개합니다. React 컴포넌트는 state를 통해 위 규칙을 위반하지 않고 사용자 액션, 네트워크 응답 및 다른 요소에 대한 응답으로 시간에 따라 자신의 출력값을 변경할 수 있습니다.
