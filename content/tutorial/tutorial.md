---
id: tutorial
title: "자습서: React 시작하기"
layout: tutorial
sectionid: tutorial
permalink: tutorial/tutorial.html
redirect_from:
  - "docs/tutorial.html"
  - "docs/why-react.html"
  - "docs/tutorial-ja-JP.html"
  - "docs/tutorial-ko-KR.html"
  - "docs/tutorial-zh-CN.html"
---

이 자습서는 React에 대한 어떤 지식도 가정하지 않습니다.

## 자습서를 시작하기 전에 {#before-we-start-the-tutorial}

우리는 자습서에서 작은 게임을 만들 것입니다. **게임을 만드고 싶지 않기 때문에 자습서를 건너뛰고 싶을 수 있습니다 -- 그래도 기회를 주세요.** 자습서에서 배우는 기술은 React 앱을 만드는 데 있어 기본이며 그것을 마스터하면 React에 대해 깊이 이해할 수 있습니다.

> 팁
>
> 자습서는 **실습을 통해 배우기**를 선호하는 사람들에 맞춰 설계 되었습니다. 기초부터 개념을 학습하길 선호한다면 [단계별 가이드](/docs/hello-world.html)를 확인해보세요. 자습서와 단계별 가이드는 상호 보완적입니다.

자습서는 아래와 같이 몇 가지 구역으로 나뉩니다.

* [자습서 설정](#setup-for-the-tutorial)은 자습서를 따를 수 있는 **시작점**을 안내합니다.
* [개요](#overview)는 React의 **기본**(components, props, state)을 알려줍니다.
* [게임 완성하기](#completing-the-game)는 React 개발에서 사용하는 **가장 일반적인 기술**을 가르쳐 줄 것입니다.
* [시간여행 추가하기](#adding-time-travel)는 React의 고유한 강점에 대한 **깊은 통찰력**을 줄 것입니다.

자습서를 익히기 위해 모든 부분을 한 번에 완료할 필요는 없습니다. 한 두 구역이라도 가능한 한 많이 시도 해보세요.

<<<<<<< HEAD
이 자습서를 따라하기 위해 코드를 복사하여 붙여넣는 것도 괜찮지만 직접 코드를 따라 적기를 추천합니다. 이 방식은 몸으로 기억하는 것과 더 강한 이해에 도움을 줄 것입니다.

### 무엇을 구현하나요? {#what-are-we-building}
=======
### What Are We Building? {#what-are-we-building}
>>>>>>> 9a20ea51911e5ddc095b23306a9f367cd5df0856

우리는 React로 대화형 틱택토 게임을 만드는 방법을 알려드릴 것입니다.

최종 결과물은 **[이 페이지](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**에서 확인할 수 있습니다. 코드가 이해가 되지 않거나 코드의 문법에 익숙하지 않더라도 걱정마세요! 자습서의 목적은 React와 React 문법에 대한 이해를 돕는 것입니다.

자습서를 진행하기 전에 틱택토 게임을 체험해보길 추천합니다. 주목할만한 특징 중 하나는 게임판 오른쪽에 번호가 매겨진 목록이 있다는 것입니다. 목록은 게임에서 일어난 모든 이동의 기록을 보여주며 게임을 진행하면 업데이트 됩니다.

틱택토 게임에 익숙해졌다면 종료해도 괜찮습니다. 우리는 자습서의 간단한 템플릿에서 시작할 것입니다. 다음 단계에서는 게임 구현을 시작하기 위한 설정을 다룹니다.

### 사전 준비 {#prerequisites}

당신이 HTML과 JavaScript에 어느정도 익숙하다고 가정하지만 다른 프로그래밍 언어를 사용하더라도 자습서를 따라갈 수 있습니다. 또한 함수, 객체, 배열, 가능하다면 클래스 같은 프로그래밍 개념에 익숙하다고 가정합니다.

JavaScript를 다시 보고싶다면 [이 가이드](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript)를 추천합니다. JavaScript의 최신 버전인 ES6의 몇 가지 기능을 사용한다는 사실에 주목해주세요. 자습서에서는 [화살표 함수](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions), [클래스](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), [`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let), [`const`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const)를 사용합니다. [Babel REPL](babel://es5-syntax-example)을 사용하여 ES6 코드가 어떻게 컴파일되는지 확인할 수 있습니다.

## 자습서 설정 {#setup-for-the-tutorial}

자습서를 완성하는 방법에는 두 가지가 있습니다. 브라우저에서 코드를 작성해도 되고 컴퓨터에 로컬 개발 환경을 설정해도 됩니다.

### 설정 옵션 1: 브라우저에 코드 작성하기 {#setup-option-1-write-code-in-the-browser}

이 옵션은 가장 빠르게 시작하는 방식입니다!

먼저 새 탭에서 **[시작 코드](https://codepen.io/gaearon/pen/oWWQNa?editors=0010)**를 열어주세요. 새 탭은 비어있는 틱택토 게임판과 React 코드를 보여줄 것입니다. 우리는 자습서에서 React 코드를 편집할 것입니다.

이제 두 번째 설정 옵션을 건너뛰고 [개요](#overview) 단락으로 넘어가서 React에 대한 개요를 확인해주세요.

### 설정 옵션 2: 로컬 개발 환경 {#setup-option-2-local-development-environment}

이 방식은 완전히 선택사항이며 이 자습서에 반드시 필요한 것은 아닙니다!

<br>

<details>

<summary><b>선택 사항: 선호하는 텍스트 편집기를 사용하기 위한 지침</b></summary>

이 설정은 더 많은 작업을 요구하지만 당신이 선택한 편집기를 사용하여 자습서를 완성할 수 있게 합니다. 아래의 단계를 따라주세요.

1. 최신 버전의 [Node.js](https://nodejs.org/en/)가 설치되어 있는지 확인해주세요.
2. [Create React App 설치 지침](/docs/create-a-new-react-app.html#create-react-app)을 따라 새로운 프로젝트를 생성해주세요.

```bash
npx create-react-app my-app
```

3. 새로운 프로젝트의 `src/` 폴더에 있는 모든 파일을 삭제해주세요.

> 주의
>
> **`src` 폴더 전체가 아니라 폴더 내부의 기존 소스 파일들만 삭제 해주세요.** 다음 단계에서 기본 소스 파일을 이 프로젝트의 예제로 바꿀 것입니다.

```bash
cd my-app
cd src

# Mac 또는 Linux 사용자의 경우
rm -f *

# Windows 사용자
del *

# 다시 프로젝트 폴더로 돌아가세요.
cd ..
```

4. `src/` 폴더에 `index.css`라는 파일을 생성하고 [이 CSS 코드](https://codepen.io/gaearon/pen/oWWQNa?editors=0100)를 추가해주세요.

5. `src/` 폴더에 `index.js`라는 파일을 생성하고 [이 JS 코드](https://codepen.io/gaearon/pen/oWWQNa?editors=0010)를 추가해주세요.

6. 위에서 생성한 `index.js`의 상단에 아래 세 줄을 추가해주세요.

```js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
```

이제 프로젝트 폴더에서 `npm start` 명령어를 실행하고 브라우저에서 `http://localhost:3000`를 열면 비어있는 틱택토 필드를 확인할 수 있습니다.

에디터에서 구문 강조 표시를 설정하기 위해 [이 지침](https://babeljs.io/docs/editors/)을 따르길 권장합니다.

</details>

### 도와주세요, 막히는 부분이 있어요! {#help-im-stuck}

막히는 부분이 생겼다면 [커뮤니티에서 지원하는 자료](/community/support.html)를 확인해보세요. 특히 [Reactiflux Chat](https://discord.gg/0ZcbPKXt5bZjGY5n)은 빠르게 도움을 받을 수 있는 좋은 방법입니다. 원하는 답을 얻지 못하거나 계속 막힌 상태라면 이슈를 제출해주세요. 우리가 도와드리겠습니다.

## 개요 {#overview}

이제 설정을 완료했으니 React의 개요를 살펴보겠습니다!

### React가 무엇인가요? {#what-is-react}

React는 사용자 인터페이스를 구축하기 위한 선언적이고 효율적이며 유연한 JavaScript 라이브러리 입니다. "컴포넌트"라고 불리는 작고 고립된 코드의 파편을 이용하여 복잡한 UI를 구성하도록 돕습니다.

React는 몇 가지 종류의 컴포넌트를 가지지만 우리는 `React.Component`의 하위 클래스를 사용해보겠습니다.

```javascript
class ShoppingList extends React.Component {
  render() {
    return (
      <div className="shopping-list">
        <h1>Shopping List for {this.props.name}</h1>
        <ul>
          <li>Instagram</li>
          <li>WhatsApp</li>
          <li>Oculus</li>
        </ul>
      </div>
    );
  }
}

// 사용 예제: <ShoppingList name="Mark" />
```

XML과 유사한 재밌는 태그를 사용할 것입니다. 우리는 컴포넌트를 사용하여 React에게 화면에 표현하고 싶은 것이 무엇인지 알려줍니다. 데이터가 변경될 때 React는 컴포넌트를 효율적으로 업데이트하고 다시 렌더링합니다.

여기에서 ShoppingList는 **React 컴포넌트 클래스** 또는 **React 컴포넌트 타입**입니다. 개별 컴포넌트는 `props`라는 매개변수를 받아오고 `render` 함수를 통해 표시할 뷰 계층 구조를 반환합니다.

`render`함수는 화면에서 보고자 하는 *내용*을 반환합니다. React는 설명을 전달받고 결과를 표시합니다. 특히 `render`는 렌더링할 내용을 경량화한 **React 엘리먼트**를 반환합니다. 다수의 React 개발자는 "JSX"라는 특수한 문법을 사용하여 React의 구조를 보다 쉽게 작성합니다. `<div />` 구문은 빌드하는 시점에서 `React.createElement('div')`로 변환됩니다. 위에서 본 예제는 아래와 같이 변화합니다.

```javascript
return React.createElement('div', {className: 'shopping-list'},
  React.createElement('h1', /* ... h1 children ... */),
  React.createElement('ul', /* ... ul children ... */)
);
```

[전체 코드는 여기서 확인해주세요.](babel://tutorial-expanded-version)

`createElement()`에 대해 궁금한 점이 있다면 [API 참조](/docs/react-api.html#createelement)에서 자세한 설명을 확인할 수 있습니다. 하지만 자습서에서는 이 방식이 아니라 JSX를 계속 사용할 것입니다.

JSX는 JavaScript의 강력한 기능을 가지고 있습니다. JSX 내부의 중괄호 안에 *어떤* JavaScript 표현식도 사용할 수 있습니다. React 엘리먼트는 JavaScript 객체이며 변수에 저장하거나 프로그램 여기저기에 전달할 수 있습니다.

`ShoppingList` 컴포넌트는 `<div />`와 `<li />` 같은 내각 DOM 컴포넌트만을 렌더링하지만 컴포넌트를 조합하여 커스텀 React 컴포넌트를 렌더링하는 것도 가능합니다. 예를 들어 `<ShoppingList />`를 작성하여 모든 쇼핑 목록을 참조할 수 있습니다. React 컴포넌트는 캡슐화되어 독립적으로 동작할 수 있습니다. 이러한 이유로 단순한 컴포넌트를 사용하여 복잡한 UI를 구현할 수 있습니다.

## 시작 코드 살펴보기 {#inspecting-the-starter-code}

**브라우저에서** 자습서 작성을 하는 경우 새 탭에서 **[시작 코드](https://codepen.io/gaearon/pen/oWWQNa?editors=0010)**를 열어주세요. **로컬 환경에서** 진행하는 경우 프로젝트 폴더에서 `src/index.js`를 열어주세요(이 파일은 [설정](#setup-option-2-local-development-environment)에서 다룬 적이 있습니다).

시작 코드는 제작할 틱택토의 기본 틀입니다. CSS 스타일은 제공되기 때문에 React를 배우는 것과 게임을 프로그래밍하는 데에만 집중하면 됩니다.

코드를 살펴보면 세 가지 React 컴포넌트를 확인할 수 있습니다.

* Square
* Board
* Game

Square 컴포넌트는 `<button>`을 렌더링하고 Board는 사각형 9개를 렌더링합니다. Game 컴포넌트는 게임 판을 렌더링하며 나중에 수정할 자리 표시자 값을 가지고 있습니다. 지금은 사용자와 상호작용하는 컴포넌트가 없습니다.

### Props를 통해 데이터 전달하기 {#passing-data-through-props}

본격적으로 시작하기 위해 Board 컴포넌트에서 Square 컴포넌트로 데이터를 전달해 봅시다.

자습서를 따를 때 복사/붙여넣기가 아니라 손으로 직접 코드를 작성하길 추천합니다. 이렇게 하면 코드를 몸으로 기억하고 이해력을 더 높일 수 있습니다.

Square에 `value`라는 prop을 전달하기 위해 Board의 `renderSquare` 함수 코드를 수정해주세요.

```js{3}
class Board extends React.Component {
  renderSquare(i) {
    return <Square value={i} />;
  }
```

값을 보여주기 위해 Square의 `render` 함수에서 `{/* TODO */}`를 `{this.props.value}`로 수정해주세요.

```js{5}
class Square extends React.Component {
  render() {
    return (
      <button className="square">
        {this.props.value}
      </button>
    );
  }
}
```

변경 전:

![React Devtools](../images/tutorial/tictac-empty.png)

변경 후: 렌더링된 결과에서 각 사각형에 숫자가 표시됩니다.

![React Devtools](../images/tutorial/tictac-numbers.png)

**[지금까지의 전체 코드 확인하기](https://codepen.io/gaearon/pen/aWWQOG?editors=0010)**

축하합니다! 부모 Board 컴포넌트에서 자식 Square 컴포넌트로 "prop을 전달"하였습니다. props 전달하기는 React 앱에서 부모에서 자식으로 정보가 어떻게 흘러가는지 알려줍니다.

### 대화형 컴포넌트 만들기 {#making-an-interactive-component}

Square 컴포넌트를 클릭하면 "X"가 체크되도록 만들어봅시다.
먼저 Square 컴포넌트의 `render()` 함수에서 반환하는 버튼 태그를 아래와 같이 변경해주세요.

```javascript{4}
class Square extends React.Component {
  render() {
    return (
      <button className="square" onClick={function() { alert('click'); }}>
        {this.props.value}
      </button>
    );
  }
}
```

Square를 클릭하면 브라우저에서 경고 창이 뜨는 것을 확인할 수 있습니다.

> 주의
>
> 타이핑 횟수를 줄이고 [`this`의 혼란스러운 동작](https://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/)을 피하기 위해 아래부터는 이벤트 핸들러에 [화살표 함수](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)를 사용하겠습니다.
>
>```javascript{4}
>class Square extends React.Component {
>  render() {
>    return (
>      <button className="square" onClick={() => alert('click')}>
>        {this.props.value}
>      </button>
>    );
>  }
>}
>```
>
> `onClick={() => alert('click')}`이 어떻게 동작하는지 살펴보면 `onClick` prop으로 *함수*를 전달하고 있습니다. React는 클릭했을 때에만 이 함수를 호출할 것입니다. `() =>`을 잊어버리고 `onClick={alert('click')}`이라고 작성하는 것은 흔히 발생하는 실수이며 컴포넌트가 다시 렌더링할 때 마다 경고 창을 띄울 것입니다.

다음 단계로 Square 컴포넌트를 클릭한 것을 "기억하게" 만들어 "X" 표시를 채워 넣으려고 합니다. 무언가를 "기억하기"위해 component는 **state**를 사용합니다.

React 컴포넌트는 생성자에 `this.state`를 설정하는 것으로 state를 가질 수 있습니다. `this.state`는 정의된 React 컴포넌트에 대해 비공개로 간주해야 합니다. 이제 Square의 현재 값을 `this.state`에 저장하고 Square를 클릭하는 경우 변경하겠습니다.

우선 클래스에 생성자를 추가하여 state를 초기화합니다.

```javascript{2-7}
class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }

  render() {
    return (
      <button className="square" onClick={() => alert('click')}>
        {this.props.value}
      </button>
    );
  }
}
```

> 주의
>
> [JavaScript 클래스](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)에서 하위 클래스의 생성자를 정의할 때 항상 `super`를 호출해야합니다. 모든 React 컴포넌트 클래스는 `생성자`를 가질 때 `super(props)` 호출 구문부터 작성해야 합니다.

이제 Square를 클릭할 때 현재 state 값을 표시하기 위해 `render` 함수를 변경할 것입니다.

* `<button>` 태그 안 `this.props.value`를 `this.state.value`로 변경해주세요.
* `onClick={...}` 이벤트 핸들러를 `onClick={() => this.setState({value: 'X'})}`로 변경해주세요.
* 가독성을 높이기 위해 `className`과 `onClick` props를 별도의 줄에 넣어주세요.

이와 같은 변경 후에 Square의 `render` 함수에서 반환하는 `<button>` 태그는 아래의 형태와 같습니다.

```javascript{12-13,15}
class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }

  render() {
    return (
      <button
        className="square"
        onClick={() => this.setState({value: 'X'})}
      >
        {this.state.value}
      </button>
    );
  }
}
```

Square의 `render` 함수 내부에서 `onClick` 핸들러를 통해 `this.setState`를 호출하는 것으로 React에게 `<button>`을 클릭할 때 Square가 다시 렌더링해야 한다고 알릴 수 있습니다. 업데이트 이후에 Square의 `this.state.value`는 `'X'`가 되어 게임 판에서 `X`가 나타나는 것을 확인할 수 있습니다. 어떤 Square를 클릭하던 `X`가 나타날 것입니다.

컴포넌트에서 `setState`를 호출하면 React는 자동으로 컴포넌트 내부의 자식 컴포넌트 역시 업데이트합니다.

**[지금까지의 전체 코드 확인하기](https://codepen.io/gaearon/pen/VbbVLg?editors=0010)**

### 개발자 도구 {#developer-tools}

[Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)과 [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)의 React Devtools 확장 프로그램을 사용하면 브라우저 개발자 도구에서 React 컴포넌트 트리를 검사할 수 있습니다.

<img src="../images/tutorial/devtools.png" alt="React Devtools" style="max-width: 100%">

React DevTools를 통해 React 컴포넌트의 props와 state도 확인할 수 있습니다.

React DevTools를 설치한 후에 페이지의 모든 엘리먼트에 오른쪽 클릭을 하고 "요소 검사"를 클릭하여 개발자 도구를 열면 탭의 오른쪽 끝에 React 탭을 확인하실 수 있습니다.

**그러나 CodePen에서 도구를 사용하기 위해선 몇 가지 단계가 추가로 필요합니다.**

1. 로그인하세요. 또는 가입 후 이메일을 확인해주세요 (스팸 방지를 위해 필요).
2. "Fork" 버튼을 클릭하세요.
3. "Change View"를 클릭하여 "Debug mode"를 선택해주세요.
4. 새 탭이 열리면 개발자 도구에서 React 탭을 확인해주세요.

## Completing the Game {#completing-the-game}

We now have the basic building blocks for our tic-tac-toe game. To have a complete game, we now need to alternate placing "X"s and "O"s on the board, and we need a way to determine a winner.

### Lifting State Up {#lifting-state-up}

Currently, each Square component maintains the game's state. To check for a winner, we'll maintain the value of each of the 9 squares in one location.

We may think that Board should just ask each Square for the Square's state. Although this approach is possible in React, we discourage it because the code becomes difficult to understand, susceptible to bugs, and hard to refactor. Instead, the best approach is to store the game's state in the parent Board component instead of in each Square. The Board component can tell each Square what to display by passing a prop, [just like we did when we passed a number to each Square](#passing-data-through-props).

**To collect data from multiple children, or to have two child components communicate with each other, you need to declare the shared state in their parent component instead. The parent component can pass the state back down to the children by using props; this keeps the child components in sync with each other and with the parent component.**

Lifting state into a parent component is common when React components are refactored -- let's take this opportunity to try it out.

Add a constructor to the Board and set the Board's initial state to contain an array of 9 nulls corresponding to the 9 squares:

```javascript{2-7}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
    };
  }

  renderSquare(i) {
    return <Square value={i} />;
  }
```

When we fill the board in later, the `this.state.squares` array will look something like this:

```javascript
[
  'O', null, 'X',
  'X', 'X', 'O',
  'O', null, null,
]
```

The Board's `renderSquare` method currently looks like this:

```javascript
  renderSquare(i) {
    return <Square value={i} />;
  }
```

In the beginning, we [passed the `value` prop down](#passing-data-through-props) from the Board to show numbers from 0 to 8 in every Square. In a different previous step, we replaced the numbers with an "X" mark [determined by Square's own state](#making-an-interactive-component). This is why Square currently ignores the `value` prop passed to it by the Board.

We will now use the prop passing mechanism again. We will modify the Board to instruct each individual Square about its current value (`'X'`, `'O'`, or `null`). We have already defined the `squares` array in the Board's constructor, and we will modify the Board's `renderSquare` method to read from it:

```javascript{2}
  renderSquare(i) {
    return <Square value={this.state.squares[i]} />;
  }
```

**[View the full code at this point](https://codepen.io/gaearon/pen/gWWQPY?editors=0010)**

Each Square will now receive a `value` prop that will either be `'X'`, `'O'`, or `null` for empty squares.

Next, we need to change what happens when a Square is clicked. The Board component now maintains which squares are filled. We need to create a way for the Square to update the Board's state. Since state is considered to be private to a component that defines it, we cannot update the Board's state directly from Square.

Instead, we'll pass down a function from the Board to the Square, and we'll have Square call that function when a square is clicked. We'll change the `renderSquare` method in Board to:

```javascript{5}
  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }
```

>Note
>
>We split the returned element into multiple lines for readability, and added parentheses so that JavaScript doesn't insert a semicolon after `return` and break our code.

Now we're passing down two props from Board to Square: `value` and `onClick`. The `onClick` prop is a function that Square can call when clicked. We'll make the following changes to Square:

* Replace `this.state.value` with `this.props.value` in Square's `render` method
* Replace `this.setState()` with `this.props.onClick()` in Square's `render` method
* Delete the `constructor` from Square because Square no longer keeps track of the game's state

After these changes, the Square component looks like this:

```javascript{1,2,6,8}
class Square extends React.Component {
  render() {
    return (
      <button
        className="square"
        onClick={() => this.props.onClick()}
      >
        {this.props.value}
      </button>
    );
  }
}
```

When a Square is clicked, the `onClick` function provided by the Board is called. Here's a review of how this is achieved:

1. The `onClick` prop on the built-in DOM `<button>` component tells React to set up a click event listener.
2. When the button is clicked, React will call the `onClick` event handler that is defined in Square's `render()` method.
3. This event handler calls `this.props.onClick()`. The Square's `onClick` prop was specified by the Board.
4. Since the Board passed `onClick={() => this.handleClick(i)}` to Square, the Square calls `this.handleClick(i)` when clicked.
5. We have not defined the `handleClick()` method yet, so our code crashes. If you click a square now, you should see a red error screen saying something like "this.handleClick is not a function".

>Note
>
>The DOM `<button>` element's `onClick` attribute has a special meaning to React because it is a built-in component. For custom components like Square, the naming is up to you. We could give any name to the Square's `onClick` prop or Board's `handleClick` method, and the code would work the same. In React, it's conventional to use `on[Event]` names for props which represent events and `handle[Event]` for the methods which handle the events.

When we try to click a Square, we should get an error because we haven't defined `handleClick` yet. We'll now add `handleClick` to the Board class:

```javascript{9-13}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
    };
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = 'X';
    this.setState({squares: squares});
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    const status = 'Next player: X';

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
```

**[View the full code at this point](https://codepen.io/gaearon/pen/ybbQJX?editors=0010)**

After these changes, we're again able to click on the Squares to fill them, the same as we had before. However, now the state is stored in the Board component instead of the individual Square components. When the Board's state changes, the Square components re-render automatically. Keeping the state of all squares in the Board component will allow it to determine the winner in the future.

Since the Square components no longer maintain state, the Square components receive values from the Board component and inform the Board component when they're clicked. In React terms, the Square components are now **controlled components**. The Board has full control over them.

Note how in `handleClick`, we call `.slice()` to create a copy of the `squares` array to modify instead of modifying the existing array. We will explain why we create a copy of the `squares` array in the next section.

### Why Immutability Is Important {#why-immutability-is-important}

In the previous code example, we suggested that you use the `.slice()` operator to create a copy of the `squares` array to modify instead of modifying the existing array. We'll now discuss immutability and why immutability is important to learn.

There are generally two approaches to changing data. The first approach is to *mutate* the data by directly changing the data's values. The second approach is to replace the data with a new copy which has the desired changes.

#### Data Change with Mutation {#data-change-with-mutation}
```javascript
var player = {score: 1, name: 'Jeff'};
player.score = 2;
// Now player is {score: 2, name: 'Jeff'}
```

#### Data Change without Mutation {#data-change-without-mutation}
```javascript
var player = {score: 1, name: 'Jeff'};

var newPlayer = Object.assign({}, player, {score: 2});
// Now player is unchanged, but newPlayer is {score: 2, name: 'Jeff'}

// Or if you are using object spread syntax proposal, you can write:
// var newPlayer = {...player, score: 2};
```

The end result is the same but by not mutating (or changing the underlying data) directly, we gain several benefits described below.

#### Complex Features Become Simple {#complex-features-become-simple}

Immutability makes complex features much easier to implement. Later in this tutorial, we will implement a "time travel" feature that allows us to review the tic-tac-toe game's history and "jump back" to previous moves. This functionality isn't specific to games -- an ability to undo and redo certain actions is a common requirement in applications. Avoiding direct data mutation lets us keep previous versions of the game's history intact, and reuse them later.

#### Detecting Changes {#detecting-changes}

Detecting changes in mutable objects is difficult because they are modified directly. This detection requires the mutable object to be compared to previous copies of itself and the entire object tree to be traversed.

Detecting changes in immutable objects is considerably easier. If the immutable object that is being referenced is different than the previous one, then the object has changed.

#### Determining When to Re-Render in React {#determining-when-to-re-render-in-react}

The main benefit of immutability is that it helps you build _pure components_ in React. Immutable data can easily determine if changes have been made which helps to determine when a component requires re-rendering.

You can learn more about `shouldComponentUpdate()` and how you can build *pure components* by reading [Optimizing Performance](/docs/optimizing-performance.html#examples).

### Function Components {#function-components}

We'll now change the Square to be a **function component**.

In React, **function components** are a simpler way to write components that only contain a `render` method and don't have their own state. Instead of defining a class which extends `React.Component`, we can write a function that takes `props` as input and returns what should be rendered. Function components are less tedious to write than classes, and many components can be expressed this way.

Replace the Square class with this function:

```javascript
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}
```

We have changed `this.props` to `props` both times it appears.

**[View the full code at this point](https://codepen.io/gaearon/pen/QvvJOv?editors=0010)**

>Note
>
>When we modified the Square to be a function component, we also changed `onClick={() => this.props.onClick()}` to a shorter `onClick={props.onClick}` (note the lack of parentheses on *both* sides).

### Taking Turns {#taking-turns}

We now need to fix an obvious defect in our tic-tac-toe game: the "O"s cannot be marked on the board.

We'll set the first move to be "X" by default. We can set this default by modifying the initial state in our Board constructor:

```javascript{6}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  }
```

Each time a player moves, `xIsNext` (a boolean) will be flipped to determine which player goes next and the game's state will be saved. We'll update the Board's `handleClick` function to flip the value of `xIsNext`:

```javascript{3,6}
  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }
```

With this change, "X"s and "O"s can take turns. Try it!

Let's also change the "status" text in Board's `render` so that it displays which player has the next turn:

```javascript{2}
  render() {
    const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

    return (
      // the rest has not changed
```

After applying these changes, you should have this Board component:

```javascript{6,11-16,29}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
```

**[View the full code at this point](https://codepen.io/gaearon/pen/KmmrBy?editors=0010)**

### Declaring a Winner {#declaring-a-winner}

Now that we show which player's turn is next, we should also show when the game is won and there are no more turns to make. Copy this helper function and paste it at the end of the file:

```javascript
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

Given an array of 9 squares, this function will check for a winner and return `'X'`, `'O'`, or `null` as appropriate.

We will call `calculateWinner(squares)` in the Board's `render` function to check if a player has won. If a player has won, we can display text such as "Winner: X" or "Winner: O". We'll replace the `status` declaration in Board's `render` function with this code:

```javascript{2-8}
  render() {
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      // the rest has not changed
```

We can now change the Board's `handleClick` function to return early by ignoring a click if someone has won the game or if a Square is already filled:

```javascript{3-5}
  handleClick(i) {
    const squares = this.state.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }
```

**[View the full code at this point](https://codepen.io/gaearon/pen/LyyXgK?editors=0010)**

Congratulations! You now have a working tic-tac-toe game. And you've just learned the basics of React too. So *you're* probably the real winner here.

## Adding Time Travel {#adding-time-travel}

As a final exercise, let's make it possible to "go back in time" to the previous moves in the game.

### Storing a History of Moves {#storing-a-history-of-moves}

If we mutated the `squares` array, implementing time travel would be very difficult.

However, we used `slice()` to create a new copy of the `squares` array after every move, and [treated it as immutable](#why-immutability-is-important). This will allow us to store every past version of the `squares` array, and navigate between the turns that have already happened.

We'll store the past `squares` arrays in another array called `history`. The `history` array represents all board states, from the first to the last move, and has a shape like this:

```javascript
history = [
  // Before first move
  {
    squares: [
      null, null, null,
      null, null, null,
      null, null, null,
    ]
  },
  // After first move
  {
    squares: [
      null, null, null,
      null, 'X', null,
      null, null, null,
    ]
  },
  // After second move
  {
    squares: [
      null, null, null,
      null, 'X', null,
      null, null, 'O',
    ]
  },
  // ...
]
```

Now we need to decide which component should own the `history` state.

### Lifting State Up, Again {#lifting-state-up-again}

We'll want the top-level Game component to display a list of past moves. It will need access to the `history` to do that, so we will place the `history` state in the top-level Game component.

Placing the `history` state into the Game component lets us remove the `squares` state from its child Board component. Just like we ["lifted state up"](#lifting-state-up) from the Square component into the Board component, we are now lifting it up from the Board into the top-level Game component. This gives the Game component full control over the Board's data, and lets it instruct the Board to render previous turns from the `history`.

First, we'll set up the initial state for the Game component within its constructor:

```javascript{2-10}
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
    };
  }

  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}
```

Next, we'll have the Board component receive `squares` and `onClick` props from the Game component. Since we now have a single click handler in Board for many Squares, we'll need to pass the location of each Square into the `onClick` handler to indicate which Square was clicked. Here are the required steps to transform the Board component:

* Delete the `constructor` in Board.
* Replace `this.state.squares[i]` with `this.props.squares[i]` in Board's `renderSquare`.
* Replace `this.handleClick(i)` with `this.props.onClick(i)` in Board's `renderSquare`.

The Board component now looks like this:

```javascript{17,18}
class Board extends React.Component {
  handleClick(i) {
    const squares = this.state.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
```

We'll update the Game component's `render` function to use the most recent history entry to determine and display the game's status:

```javascript{2-11,16-19,22}
  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
```

Since the Game component is now rendering the game's status, we can remove the corresponding code from the Board's `render` method. After refactoring, the Board's `render` function looks like this:

```js{1-4}
  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
```

Finally, we need to move the `handleClick` method from the Board component to the Game component. We also need to modify `handleClick` because the Game component's state is structured differently. Within the Game's `handleClick` method, we concatenate new history entries onto `history`.

```javascript{2-4,10-12}
  handleClick(i) {
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      xIsNext: !this.state.xIsNext,
    });
  }
```

>Note
>
>Unlike the array `push()` method you might be more familiar with, the `concat()` method doesn't mutate the original array, so we prefer it.

At this point, the Board component only needs the `renderSquare` and `render` methods. The game's state and the `handleClick` method should be in the Game component.

**[View the full code at this point](https://codepen.io/gaearon/pen/EmmOqJ?editors=0010)**

### Showing the Past Moves {#showing-the-past-moves}

Since we are recording the tic-tac-toe game's history, we can now display it to the player as a list of past moves.

We learned earlier that React elements are first-class JavaScript objects; we can pass them around in our applications. To render multiple items in React, we can use an array of React elements.

In JavaScript, arrays have a [`map()` method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) that is commonly used for mapping data to other data, for example:

```js
const numbers = [1, 2, 3];
const doubled = numbers.map(x => x * 2); // [2, 4, 6]
```

Using the `map` method, we can map our history of moves to React elements representing buttons on the screen, and display a list of buttons to "jump" to past moves.

Let's `map` over the `history` in the Game's `render` method:

```javascript{6-15,34}
  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
```

**[View the full code at this point](https://codepen.io/gaearon/pen/EmmGEa?editors=0010)**

For each move in the tic-tac-toes's game's history, we create a list item `<li>` which contains a button `<button>`. The button has a `onClick` handler which calls a method called `this.jumpTo()`. We haven't implemented the `jumpTo()` method yet. For now, we should see a list of the moves that have occurred in the game and a warning in the developer tools console that says:

>  Warning:
>  Each child in an array or iterator should have a unique "key" prop. Check the render method of "Game".

Let's discuss what the above warning means.

### Picking a Key {#picking-a-key}

When we render a list, React stores some information about each rendered list item. When we update a list, React needs to determine what has changed. We could have added, removed, re-arranged, or updated the list's items.

Imagine transitioning from

```html
<li>Alexa: 7 tasks left</li>
<li>Ben: 5 tasks left</li>
```

to

```html
<li>Ben: 9 tasks left</li>
<li>Claudia: 8 tasks left</li>
<li>Alexa: 5 tasks left</li>
```

In addition to the updated counts, a human reading this would probably say that we swapped Alexa and Ben's ordering and inserted Claudia between Alexa and Ben. However, React is a computer program and does not know what we intended. Because React cannot know our intentions, we need to specify a *key* property for each list item to differentiate each list item from its siblings. One option would be to use the strings `alexa`, `ben`, `claudia`. If we were displaying data from a database, Alexa, Ben, and Claudia's database IDs could be used as keys.

```html
<li key={user.id}>{user.name}: {user.taskCount} tasks left</li>
```

When a list is re-rendered, React takes each list item's key and searches the previous list's items for a matching key. If the current list has a key that didn't exist before, React creates a component. If the current list is missing a key that existed in the previous list, React destroys the previous component. If two keys match, the corresponding component is moved. Keys tell React about the identity of each component which allows React to maintain state between re-renders. If a component's key changes, the component will be destroyed and re-created with a new state.

`key` is a special and reserved property in React (along with `ref`, a more advanced feature). When an element is created, React extracts the `key` property and stores the key directly on the returned element. Even though `key` may look like it belongs in `props`, `key` cannot be referenced using `this.props.key`. React automatically uses `key` to decide which components to update. A component cannot inquire about its `key`.

**It's strongly recommended that you assign proper keys whenever you build dynamic lists.** If you don't have an appropriate key, you may want to consider restructuring your data so that you do.

If no key is specified, React will present a warning and use the array index as a key by default. Using the array index as a key is problematic when trying to re-order a list's items or inserting/removing list items. Explicitly passing `key={i}` silences the warning but has the same problems as array indices and is not recommended in most cases.

Keys do not need to be globally unique; they only need to be unique between components and their siblings.


### Implementing Time Travel {#implementing-time-travel}

In the tic-tac-toe game's history, each past move has a unique ID associated with it: it's the sequential number of the move. The moves are never re-ordered, deleted, or inserted in the middle, so it's safe to use the move index as a key.

In the Game component's `render` method, we can add the key as `<li key={move}>` and React's warning about keys should disappear:

```js{6}
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
```

**[View the full code at this point](https://codepen.io/gaearon/pen/PmmXRE?editors=0010)**

Clicking any of the list item's buttons throws an error because the `jumpTo` method is undefined. Before we implement `jumpTo`, we'll add `stepNumber` to the Game component's state to indicate which step we're currently viewing.

First, add `stepNumber: 0` to the initial state in Game's `constructor`:

```js{8}
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }
```

Next, we'll define the `jumpTo` method in Game to update that `stepNumber`. We also set `xIsNext` to true if the number that we're changing `stepNumber` to is even:

```javascript{5-10}
  handleClick(i) {
    // this method has not changed
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    // this method has not changed
  }
```

We will now make a few changes to the Game's `handleClick` method which fires when you click on a square.

The `stepNumber` state we've added reflects the move displayed to the user now. After we make a new move, we need to update `stepNumber` by adding `stepNumber: history.length` as part of the `this.setState` argument. This ensures we don't get stuck showing the same move after a new one has been made.

We will also replace reading `this.state.history` with `this.state.history.slice(0, this.state.stepNumber + 1)`. This ensures that if we "go back in time" and then make a new move from that point, we throw away all the "future" history that would now become incorrect.

```javascript{2,13}
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
```

Finally, we will modify the Game component's `render` method from always rendering the last move to rendering the currently selected move according to `stepNumber`:

```javascript{3}
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // the rest has not changed
```

If we click on any step in the game's history, the tic-tac-toe board should immediately update to show what the board looked like after that step occurred.

**[View the full code at this point](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**

### Wrapping Up {#wrapping-up}

Congratulations! You've created a tic-tac-toe game that:

* Lets you play tic-tac-toe,
* Indicates when a player has won the game,
* Stores a game's history as a game progresses,
* Allows players to review a game's history and see previous versions of a game's board.

Nice work! We hope you now feel like you have a decent grasp on how React works.

Check out the final result here: **[Final Result](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**.

If you have extra time or want to practice your new React skills, here are some ideas for improvements that you could make to the tic-tac-toe game which are listed in order of increasing difficulty:

1. Display the location for each move in the format (col, row) in the move history list.
2. Bold the currently selected item in the move list.
3. Rewrite Board to use two loops to make the squares instead of hardcoding them.
4. Add a toggle button that lets you sort the moves in either ascending or descending order.
5. When someone wins, highlight the three squares that caused the win.
6. When no one wins, display a message about the result being a draw.

Throughout this tutorial, we touched on React concepts including elements, components, props, and state. For a more detailed explanation of each of these topics, check out [the rest of the documentation](/docs/hello-world.html). To learn more about defining components, check out the [`React.Component` API reference](/docs/react-component.html).
