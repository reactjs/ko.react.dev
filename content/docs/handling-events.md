---
id: handling-events
title: 이벤트 처리하기
permalink: docs/handling-events.html
prev: state-and-lifecycle.html
next: conditional-rendering.html
redirect_from:
  - "docs/events-ko-KR.html"
---

React 엘리먼트에서 이벤트를 처리하는 방식은 DOM 엘리먼트에서 이벤트를 처리하는 방식과 매우 유사합니다. 몇 가지 문법 차이는 다음과 같습니다.

* React의 이벤트는 소문자 대신 캐멀 케이스(camelCase)를 사용합니다. 
* JSX를 사용하여 문자열이 아닌 함수로 이벤트 핸들러를 전달합니다.

예를 들어, HTML은 다음과 같습니다.

```html
<button onclick="activateLasers()">
  Activate Lasers
</button>
```

React에서는 약간 다릅니다.

```js{1}
<button onClick={activateLasers}>
  Activate Lasers
</button>
```

<<<<<<< HEAD
또 다른 차이점으로, React에서는 `false`를 반환해도 기본 동작을 방지할 수 없습니다. 반드시 `preventDefault`를 명시적으로 호출해야 합니다. 예를 들어, 일반 HTML에서는 새 페이지를 여는 링크의 기본 동작을 방지하기 위해 다음과 같은 코드를 작성합니다.
=======
Another difference is that you cannot return `false` to prevent default behavior in React. You must call `preventDefault` explicitly. For example, with plain HTML, to prevent the default form behavior of submitting, you can write:
>>>>>>> 68e4efcf93b6e589355f6aa3cbc3f3c811c0ad37

```html
<form onsubmit="console.log('You clicked submit.'); return false">
  <button type="submit">Submit</button>
</form>
```

React에서는 다음과 같이 작성할 수 있습니다.

```js{3}
function Form() {
  function handleSubmit(e) {
    e.preventDefault();
    console.log('You clicked submit.');
  }

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Submit</button>
    </form>
  );
}
```

여기서 `e`는 합성 이벤트입니다. React는 [W3C 명세](https://www.w3.org/TR/DOM-Level-3-Events/)에 따라 합성 이벤트를 정의하기 때문에 브라우저 호환성에 대해 걱정할 필요가 없습니다. React 이벤트는 브라우저 고유 이벤트와 정확히 동일하게 동작하지는 않습니다.  더 자세한 사항은 [`합성 이벤트`](/docs/events.html)을 참고하시기 바랍니다.

React를 사용할 때 DOM 엘리먼트가 생성된 후 리스너를 추가하기 위해 `addEventListener`를 호출할 필요가 없습니다. 대신, 엘리먼트가 처음 렌더링될 때 리스너를 제공하면 됩니다.

[ES6 클래스](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Classes)를 사용하여 컴포넌트를 정의할 때, 일반적인 패턴은 이벤트 핸들러를 클래스의 메서드로 만드는 것입니다. 예를 들어, 다음 `Toggle` 컴포넌트는 사용자가 "ON"과 "OFF" 상태를 토글 할 수 있는 버튼을 렌더링합니다.

```js{6,7,10-14,18}
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};

    // 콜백에서 `this`가 작동하려면 아래와 같이 바인딩 해주어야 합니다.
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }));
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    );
  }
}

ReactDOM.render(
  <Toggle />,
  document.getElementById('root')
);
```

[**CodePen에서 실행하기**](https://codepen.io/gaearon/pen/xEmzGg?editors=0010)

JSX 콜백 안에서 `this`의 의미에 대해 주의해야 합니다. JavaScript에서 클래스 메서드는 기본적으로 [바인딩](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)되어 있지 않습니다. `this.handleClick`을 바인딩하지 않고 `onClick`에 전달하였다면, 함수가 실제 호출될 때 `this`는 `undefined`가 됩니다.

이는 React만의 특수한 동작이 아니며, [JavaScript에서 함수가 작동하는 방식](https://www.smashingmagazine.com/2014/01/understanding-javascript-function-prototype-bind/)의 일부입니다. 일반적으로 `onClick={this.handleClick}`과 같이 뒤에 `()`를 사용하지 않고 메서드를 참조할 경우, 해당 메서드를 바인딩 해야 합니다.

만약 `bind`를 호출하는 것이 불편하다면, 이를 해결할 수 있는 두 가지 방법이 있습니다. 실험적인 [퍼블릭 클래스 필드 문법](https://babeljs.io/docs/plugins/transform-class-properties/)을 사용하고 있다면, 클래스 필드를 사용하여 콜백을 올바르게 바인딩할 수 있습니다.

```js{2-6}
class LoggingButton extends React.Component {
  // 이 문법은 `this`가 handleClick 내에서 바인딩되도록 합니다.
  // 주의: 이 문법은 *실험적인* 문법입니다.
  handleClick = () => {
    console.log('this is:', this);
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        Click me
      </button>
    );
  }
}
```

[Create React App](https://github.com/facebookincubator/create-react-app)에서는 이 문법이 기본적으로 설정되어 있습니다.

만약 클래스 필드 문법을 사용하고 있지 않다면, 콜백에 [화살표 함수](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions)를 사용하는 방법도 있습니다.

```js{7-9}
class LoggingButton extends React.Component {
  handleClick() {
    console.log('this is:', this);
  }

  render() {
    // 이 문법은 `this`가 handleClick 내에서 바인딩되도록 합니다.
    return (
      <button onClick={() => this.handleClick()}>
        Click me
      </button>
    );
  }
}
```

이 문법의 문제점은 `LoggingButton`이 렌더링될 때마다 다른 콜백이 생성된다는 것입니다. 대부분의 경우 문제가 되지 않으나, 콜백이 하위 컴포넌트에 props로서 전달된다면 그 컴포넌트들은 추가로 다시 렌더링을 수행할 수도 있습니다. 이러한 종류의 성능 문제를 피하고자, 생성자 안에서 바인딩하거나 클래스 필드 문법을 사용하는 것을 권장합니다.

## 이벤트 핸들러에 인자 전달하기 {#passing-arguments-to-event-handlers}

루프 내부에서는 이벤트 핸들러에 추가적인 매개변수를 전달하는 것이 일반적입니다. 예를 들어, `id`가 행의 ID일 경우 다음 코드가 모두 작동합니다.

```js
<button onClick={(e) => this.deleteRow(id, e)}>Delete Row</button>
<button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>
```

위 두 줄은 동등하며 각각 [화살표 함수](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)와 [`Function.prototype.bind`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind)를 사용합니다.

두 경우 모두 React 이벤트를 나타내는 `e` 인자가 ID 뒤에 두 번째 인자로 전달됩니다. 화살표 함수를 사용하면 명시적으로 인자를 전달해야 하지만 `bind`를 사용할 경우 추가 인자가 자동으로 전달됩니다.
