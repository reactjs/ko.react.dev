---
id: conditional-rendering
title: 조건부 렌더링
permalink: docs/conditional-rendering.html
prev: handling-events.html
next: lists-and-keys.html
redirect_from:
  - "tips/false-in-jsx.html"
---

React에서는 원하는 동작을 캡슐화하는 컴포넌트를 만들 수 있습니다. 이렇게 하면 애플리케이션의 상태에 따라서 컴포넌트 중 몇 개만을 렌더링할 수 있습니다.

React에서 조건부 렌더링은 JavaScript에서의 조건 처리와 같이 동작합니다. [`if`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/if...else) 나 [`조건부 연산자`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) 와 같은 JavaScript 연산자를 현재 상태를 나타내는 엘리먼트를 만드는 데에 사용하세요. 그러면 React는 현재 상태에 맞게 UI를 업데이트할 것입니다.

아래 두 컴포넌트가 있다고 가정해 봅시다.

```js
function UserGreeting(props) {
  return <h1>Welcome back!</h1>;
}

function GuestGreeting(props) {
  return <h1>Please sign up.</h1>;
}
```

이제 사용자의 로그인 상태에 맞게 위 컴포넌트 중 하나를 보여주는 `Greeting` 컴포넌트를 만듭니다,

```javascript{3-7,11,12}
function Greeting(props) {
  const isLoggedIn = props.isLoggedIn;
  if (isLoggedIn) {
    return <UserGreeting />;
  }
  return <GuestGreeting />;
}

ReactDOM.render(
  // Try changing to isLoggedIn={true}:
  <Greeting isLoggedIn={false} />,
  document.getElementById('root')
);
```

[**CodePen에서 실행하기**](https://codepen.io/gaearon/pen/ZpVxNq?editors=0011)

이 예시는 `isLoggedIn` prop에 따라서 다른 인사말을 렌더링 합니다.

### 엘리먼트 변수 {#element-variables}

엘리먼트를 저장하기 위해 변수를 사용할 수 있습니다. 출력의 다른 부분은 변하지 않은 채로 컴포넌트의 일부를 조건부로 렌더링 할 수 있습니다.

로그아웃과 로그인 버튼을 나타내는 두 컴포넌트가 있다고 가정해 보세요.

```js
function LoginButton(props) {
  return (
    <button onClick={props.onClick}>
      Login
    </button>
  );
}

function LogoutButton(props) {
  return (
    <button onClick={props.onClick}>
      Logout
    </button>
  );
}
```

아래의 예시에서는 `LoginControl`이라는 [유상태 컴포넌트](/docs/state-and-lifecycle.html#adding-local-state-to-a-class) 를 만들 것입니다.

이 컴포넌트는 현재 상태에 맞게 `<LoginButton />`이나 `<LogoutButton />`을 렌더링합니다. 또한 이전 예시에서의 `<Greeting />`도 함께 렌더링합니다.

```javascript{20-25,29,30}
class LoginControl extends React.Component {
  constructor(props) {
    super(props);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.state = {isLoggedIn: false};
  }

  handleLoginClick() {
    this.setState({isLoggedIn: true});
  }

  handleLogoutClick() {
    this.setState({isLoggedIn: false});
  }

  render() {
    const isLoggedIn = this.state.isLoggedIn;
    let button;

    if (isLoggedIn) {
      button = <LogoutButton onClick={this.handleLogoutClick} />;
    } else {
      button = <LoginButton onClick={this.handleLoginClick} />;
    }

    return (
      <div>
        <Greeting isLoggedIn={isLoggedIn} />
        {button}
      </div>
    );
  }
}

ReactDOM.render(
  <LoginControl />,
  document.getElementById('root')
);
```

[**CodePen에서 실행하기**](https://codepen.io/gaearon/pen/QKzAgB?editors=0010)

변수를 선언하고 `if`를 사용해서 조건부로 렌더링 하는 것은 좋은 방법이지만 더 짧은 구문을 사용하고 싶을 때가 있을 수 있습니다. 여러 조건을 JSX 안에서 인라인(inline)으로 처리할 방법 몇 가지를 아래에서 소개하겠습니다.

### 논리 && 연산자로 If를 인라인으로 표현하기{#inline-if-with-logical--operator}

<<<<<<< HEAD
JSX 안에는 중괄호를 이용해서 [표현식을 포함](/docs/introducing-jsx.html#embedding-expressions-in-jsx) 할 수 있습니다. 그 안에 JavaScript의 논리 연산자 `&&`를 사용하면 쉽게 엘리먼트를 조건부로 넣을 수 있습니다.
=======
You may [embed expressions in JSX](/docs/introducing-jsx.html#embedding-expressions-in-jsx) by wrapping them in curly braces. This includes the JavaScript logical `&&` operator. It can be handy for conditionally including an element:
>>>>>>> 63332462bb5afa18ac7a716975b679f4c23cc8a1

```js{6-10}
function Mailbox(props) {
  const unreadMessages = props.unreadMessages;
  return (
    <div>
      <h1>Hello!</h1>
      {unreadMessages.length > 0 &&
        <h2>
          You have {unreadMessages.length} unread messages.
        </h2>
      }
    </div>
  );
}

const messages = ['React', 'Re: React', 'Re:Re: React'];
ReactDOM.render(
  <Mailbox unreadMessages={messages} />,
  document.getElementById('root')
);
```

[**CodePen에서 실행하기**](https://codepen.io/gaearon/pen/ozJddz?editors=0010)

JavaScript에서 `true && expression`은 항상 `expression`으로 평가되고 `false && expression`은 항상 `false`로 평가됩니다.

따라서 `&&` 뒤의 엘리먼트는 조건이 `true`일때 출력이 됩니다. 조건이 `false`라면 React는 무시합니다.

### 조건부 연산자로 If-Else구문 인라인으로 표현하기{#inline-if-else-with-conditional-operator}

엘리먼트를 조건부로 렌더링하는 다른 방법은 조건부 연산자인 [`condition ? true: false`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Conditional_Operator)를 사용하는 것입니다.

아래의 예시에서는 짧은 구문을 조건부로 렌더링합니다.

```javascript{5}
render() {
  const isLoggedIn = this.state.isLoggedIn;
  return (
    <div>
      The user is <b>{isLoggedIn ? 'currently' : 'not'}</b> logged in.
    </div>
  );
}
```

가독성은 좀 떨어지지만, 더 큰 표현식에도 이 구문을 사용할 수 있습니다.

```js{5,7,9}
render() {
  const isLoggedIn = this.state.isLoggedIn;
  return (
    <div>
      {isLoggedIn
        ? <LogoutButton onClick={this.handleLogoutClick} />
        : <LoginButton onClick={this.handleLoginClick} />
      }
    </div>
  );
}
```

JavaScript와 마찬가지로, 가독성이 좋다고 생각하는 방식을 선택하면 됩니다. 또한 조건이 너무 복잡하다면 [컴포넌트를 분리](/docs/components-and-props.html#extracting-components)하기 좋을 때 일 수도 있다는 것을 기억하세요.

### 컴포넌트가 렌더링하는 것을 막기 {#preventing-component-from-rendering}

가끔 다른 컴포넌트에 의해 렌더링될 때 컴포넌트 자체를 숨기고 싶을 때가 있을 수 있습니다. 이때는 렌더링 결과를 출력하는 대신 `null`을 반환하면 해결할 수 있습니다.

아래의 예시에서는 `<WarningBanner />`가 `warn` prop의 값에 의해서 렌더링됩니다. prop이 `false`라면 컴포넌트는 렌더링하지 않게 됩니다.

```javascript{2-4,29}
function WarningBanner(props) {
  if (!props.warn) {
    return null;
  }

  return (
    <div className="warning">
      Warning!
    </div>
  );
}

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showWarning: true};
    this.handleToggleClick = this.handleToggleClick.bind(this);
  }

  handleToggleClick() {
    this.setState(state => ({
      showWarning: !state.showWarning
    }));
  }

  render() {
    return (
      <div>
        <WarningBanner warn={this.state.showWarning} />
        <button onClick={this.handleToggleClick}>
          {this.state.showWarning ? 'Hide' : 'Show'}
        </button>
      </div>
    );
  }
}

ReactDOM.render(
  <Page />,
  document.getElementById('root')
);
```

[**CodePen에서 실행하기**](https://codepen.io/gaearon/pen/Xjoqwm?editors=0010)

컴포넌트의 `render` 메서드로부터 `null`을 반환하는 것은 생명주기 메서드 호출에 영향을 주지 않습니다. 그 예로 `componentDidUpdate`는 계속해서 호출되게 됩니다.