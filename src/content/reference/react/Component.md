---
title: Component
---

<Pitfall>

컴포넌트를 class 대신 함수로 정의하는 것을 추천합니다. [마이그레이션 방법을 확인하세요.](#alternatives)

</Pitfall>

<Intro>

`Component`는 [자바스크립트 class](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Classes)로 정의된 React 컴포넌트의 기본 class입니다. React에서 클래스 컴포넌트를 계속 지원하지만, 새 코드에서는 사용하지 않는 것을 추천합니다.

```js
class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

</Intro>

<InlineToc />

---

## 레퍼런스 {/*reference*/}

### `Component` {/*component*/}

React 컴포넌트를 class로 정의하려면, 내장 `Component` class를 확장하고 [`render` 메서드](#render)를 정의하세요.

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

`render` 메서드만 필수고 다른 메서드는 선택 사항입니다.

[아래의 더 많은 예시를 확인하세요.](#usage)

---

### `context` {/*context*/}

클래스 컴포넌트의 [context](/learn/passing-data-deeply-with-context)는 `this.context`로 사용할 수 있습니다. [`static contextType`](#static-contexttype)(modern) 또는 [`static contextTypes`](#static-contexttypes)(deprecated)를 사용하여 *어떤* context를 받길 원하는지 지정해야만 사용할 수 있습니다.

클래스 컴포넌트는 한 번에 하나의 context만 읽을 수 있습니다.

```js {2,5}
class Button extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {this.props.children}
      </button>
    );
  }
}

```

<Note>

클래스 컴포넌트에서 `this.context`를 읽는 것은 함수 컴포넌트에서 [`useContext`](/reference/react/useContext)와 같습니다.

[마이그레이션 방법을 확인하세요.](#migrating-a-component-with-context-from-a-class-to-a-function)

</Note>

---

### `props` {/*props*/}

클래스 컴포넌트에 전달되는 props는 `this.props`로 사용할 수 있습니다.

```js {3}
class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

<Greeting name="Taylor" />
```

<Note>

클래스 컴포넌트에서 `this.props`를 읽는 것은 함수 컴포넌트에서 [props를 선언하는 것](/learn/passing-props-to-a-component#step-2-read-props-inside-the-child-component)와 같습니다.

[마이그레이션 방법을 확인하세요.](#migrating-a-simple-component-from-a-class-to-a-function)

</Note>

---

### `refs` {/*refs*/}

<Deprecated>

이 API는 React의 향후 주요 버전에서 제거될 예정입니다. [대신 `createRef`를 사용하세요.](/reference/react/createRef)

</Deprecated>

컴포넌트에 대한 [legacy string refs](https://ko.reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs)에 액세스할 수 있습니다.

---

### `state` {/*state*/}

클래스 컴포넌트의 state는 `this.state`로 사용할 수 있습니다. `state` 필드는 반드시 객체여야합니다. state를 직접 변경하지 마세요. state를 변경하려면 새 state로 `setState`를 호출하세요.

```js {2-4,7-9,18}
class Counter extends Component {
  state = {
    age: 42,
  };

  handleAgeChange = () => {
    this.setState({
      age: this.state.age + 1 
    });
  };

  render() {
    return (
      <>
        <button onClick={this.handleAgeChange}>
        Increment age
        </button>
        <p>You are {this.state.age}.</p>
      </>
    );
  }
}
```

<Note>

클래스 컴포넌트에서 `state`를 정의하는 것은 함수 컴포넌트에서 [`useState`](/reference/react/useState)를 호출하는 것과 같습니다.

[마이그레이션 방법을 확인하세요.](#migrating-a-component-with-state-from-a-class-to-a-function)

</Note>

---

### `constructor(props)` {/*constructor*/}

클래스 컴포넌트가 *마운트*(화면에 추가됨)되기 전에 [constructor](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Classes/constructor)가 실행됩니다. 일반적으로 constructor는 React에서 두 가지 목적으로만 사용됩니다. state를 선언하고 class 메서드를 class 인스턴스에 [바인딩](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_objects/Function/bind)할 수 있습니다.

```js {2-6}
class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = { counter: 0 };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // ...
  }
```

최신 자바스크립트 문법을 사용한다면 constructor는 거의 필요하지 않습니다. 대신 최신 브라우저와 [Babel](https://babeljs.io/)과 같은 도구에서 모두 지원되는 [공용 class 필드 문법](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Classes/Public_class_fields)을 사용하여 위의 코드를 다시 작성할 수 있습니다.

```js {2,4}
class Counter extends Component {
  state = { counter: 0 };

  handleClick = () => {
    // ...
  }
```

constructor는 부수 효과 또는 구독을 포함하면 안됩니다.

#### 매개변수 {/*constructor-parameters*/}

* `props`: 컴포넌트의 초기 props.

#### 반환값 {/*constructor-returns*/}

`constructor`는 아무것도 반환해서는 안 됩니다.

#### 주의사항 {/*constructor-caveats*/}

* constructor에서 부수 효과 또는 구독을 실행하지 마세요. 대신 [`componentDidMount`](#componentdidmount)를 사용하세요.

* constructor 내부에서는 다른 명령어보다 `super(props)`를 먼저 호출해야 합니다. 그렇게 하지 않으면, constructor가 실행되는 동안 `this.props`는 `undefined`가 되어 혼란스럽고 버그가 발생할 수 있습니다.

* constructor는 [`this.state`](#state)를 직접 할당할 수 있는 유일한 위치입니다. 다른 모든 메서드에서는 [`this.setState()`](#setstate)를 대신 사용해야 합니다. constructor에서 setState를 호출하지 마십시오.

* [서버 렌더링](/reference/react-dom/server)을 사용할 때, constructor는 서버에서 역시 실행되고, 뒤이어 [`render`](#render) 메서드도 실행됩니다. 그러나 `componentDidMount` 또는 `componentWillUnmount`와 같은 수명 주기 메서드는 서버에서 실행되지 않습니다.

* [Strict 모드](/reference/react/StrictMode)가 설정되면 React는 개발 중인 `constructor`를 두 번 호출한 다음 인스턴스 중 하나를 삭제합니다. 이를 통해 `constructor` 외부로 옮겨져야 하는 우발적인 부수 효과를 파악할 수 있습니다.

<Note>

함수 컴포넌트에 `constructor`와 정확히 동등한 것은 없습니다. 함수 컴포넌트에 state를 선언하려면 [`useState`](/reference/react/useState)를 호출하세요. 초기 state를 다시 계산하지 않으려면 [함수를 `useState`에 전달](/reference/react/useState#avoiding-recreating-the-initial-state)하세요.

</Note>

---

### `componentDidCatch(error, info)` {/*componentdidcatch*/}

`componentDidCatch`를 정의하면, 일부 자식 컴포넌트(먼 자식을 포함)가 에러를 발생시킬 때 React가 이를 호출합니다. 이를 통해 운영 중인 에러 보고 서비스에 에러를 기록할 수 있습니다.

일반적으로, 에러에 대한 응답으로 state를 업데이트하고 사용자에게 에러 메시지를 표시할 수 있는 [`static getDerivedStateFromError`](#static-getderivedstatefromerror)와 함께 사용됩니다. 이런 여러 메서드를 사용하는 컴포넌트를 *오차 경계*라고 합니다.

[예시를 확인하세요.](#catching-rendering-errors-with-an-error-boundary)

#### 매개변수 {/*componentdidcatch-parameters*/}

* `error`: 발생한 에러입니다. 실제로, 보통은 [`에러`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Error)의 인스턴스가 되지만 JavaScript에서 문자열 또는 `null`을 포함한 어떤 값이든 [`던질`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/throw) 수 있기 때문에 보장되지 않습니다.

* `info`: 에러에 대한 추가 정보를 포함하는 객체입니다. 이것의 `componentStack` 필드는 모든 부모 컴포넌트의 이름과 출처 위치뿐만 아니라 던진 컴포넌트의 스택 추적을 포함합니다. 프로덕션에서, 컴포넌트의 이름은 최소화됩니다. 프로덕션 에러 보고를 설정하면 일반 JavaScript 에러 스택과 동일한 방법으로 소스맵을 사용하여 컴포넌트 스택을 디코딩할 수 있습니다.

#### 반환값 {/*componentdidcatch-returns*/}

`componentDidCatch`는 아무것도 반환해서는 안 됩니다.

#### 주의사항 {/*componentdidcatch-caveats*/}

* 과거에는 UI를 업데이트하고 대체 에러 메세지를 표시하기 위해 `setState`를 `componentDidCatch` 안에서 호출하는 것이 일반적이었습니다. 이는 [`static getDerivedStateFromError`](#static-getderivedstatefromerror)를 정의하기 위해 더 이상 사용되지 않습니다.

* React의 프로덕션과 개발 빌드는 `componentDidCatch`가 에러를 처리하는 방식이 약간 다릅니다. 개발에서는, 에러는 `window`까지 버블업될 것이며, 이는 `window.onerror` 또는 `window.addEventListener('error', callback)`가 `componentDidCatch`에 의해 탐지된 에러를 가로챈다는 것을 의미합니다. 대신 프로덕션에서, 에러는 버블업되지 않을 것이며, 이는 어떤 상위 에러 처리기든 `componentDidCatch`에 의해 명시적으로 탐지되지 않은 에러만을 수신하는 것을 의미합니다.

<Note>

함수 컴포넌트에 `componentDidCatch`와 직접적으로 동등한 것은 아직 없습니다. 클래스 컴포넌트 생성을 피하려면, 위와 같이 `ErrorBoundary` 컴포넌트를 하나 작성하여 앱 전체에 사용합니다. 그렇지 않으면, 그것을 해주는 [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary) package를 사용할 수 있습니다.

</Note>

---

### `componentDidMount()` {/*componentdidmount*/}

`componentDidMount` 메서드를 정의하면 구성 요소가 화면에 추가 *(마운트)* 될 때 React가 호출합니다. 이것은 데이터 가져오기를 시작하거나, 구독을 설정하거나, DOM 노드를 조작하는 일반적인 장소입니다.

`componentDidMount`를 구현하면 일반적으로 버그를 방지하기 위해 다른 생명주기 메서드를 구현해야 합니다. 예를 들어, `componentDidMount`가 일부 state나 props를 읽는 경우 변경 사항을 처리하기 위해 [`componentDidUpdate`](#componentdidupdate)를 구현하고 `componentDidMount`가 수행하던 작업을 정리하기 위해 [`componentWillUnmount`](#componentwillunmount)도 구현해야 합니다.

```js {6-8}
class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  // ...
}
```

[더 많은 예시를 확인하세요.](#adding-lifecycle-methods-to-a-class-component)

#### 매개변수 {/*componentdidmount-parameters*/}

`componentDidMount`는 매개변수를 사용하지 않습니다.

#### 반환값 {/*componentdidmount-returns*/}

`componentDidMount`는 아무것도 반환해서는 안 됩니다.

#### 주의사항 {/*componentdidmount-caveats*/}

- [Strict 모드](/reference/react/StrictMode)가 켜져 있으면 개발 중인 React가 `componentDidMount`를 호출한 다음 [`componentWillUnmount`](#componentwillunmount)를 호출하고 `componentDidMount`를 다시 호출합니다. 이를 통해 `componentWillUnmount`를 구현하는 것을 잊었거나 로직이 `componentDidMount`가 수행하는 작업을 완전히 "미러링"하지 않는 경우를 알 수 있습니다.

- `componentDidMount`에서 [`setState`](#setstate)를 즉시 호출할 수 있지만, 가능하면 피하는 것이 가장 좋습니다. 이는 추가 렌더링을 일으키지만 브라우저가 화면을 업데이트하기 전에 일어납니다. 이 경우 [`render`](#render)가 두 번 호출되더라도 사용자는 중간 state를 볼 수 없습니다. 이 패턴은 종종 성능 문제를 발생시키므로 주의하여 사용하십시오. 대부분의 경우 [`constructor`](#constructor)에서 초기 state를 대신 할당할 수 있습니다. 그러나 모달이나 툴팁과 같이 크기나 위치에 따라 달라지는 것을 렌더링하기 전에 DOM 노드를 측정해야 하는 경우에는 필요할 수 있습니다.

<Note>

많은 사용 사례에서 `componentDidMount`, `componentDidUpdate` 및 `componentWillUnmount`를 클래스 컴포넌트에 함께 정의하는 것은 함수 컴포넌트에서 [`useEffect`](/reference/react/useEffect)를 호출하는 것과 같습니다. 드물지만 브라우저 페인트 전에 코드를 실행하는 것이 중요한 경우에는 [`useLayoutEffect`](/reference/react/useLayoutEffect)를 사용하는 것이 더 적합합니다.

[마이그레이션 방법을 확인하세요.](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Note>

---

### `componentDidUpdate(prevProps, prevState, snapshot?)` {/*componentdidupdate*/}

`componentDidUpdate` 메서드를 정의하면 컴포넌트가 업데이트된 props 또는 state로 다시 렌더링된 직후 React가 이 메서드를 호출합니다. 이 메서드는 초기 렌더링에 호출되지 않습니다.

업데이트 후 DOM을 조작하는 데 사용할 수 있습니다. 또한 현재 props를 이전 props와 비교하는 한 네트워크 요청을 수행하는 일반적인 장소이기도 합니다(예: props가 변경되지 않은 경우 네트워크 요청이 필요하지 않을 수 있습니다). 일반적으로 [`componentDidMount`](#componentdidmount) 및 [`componentWillUnmount`](#componentwillunmount)와 함께 사용합니다.

```js {10-18}
class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  // ...
}
```

[더 많은 예시를 확인하세요.](#adding-lifecycle-methods-to-a-class-component)


#### 매개변수 {/*componentdidupdate-parameters*/}

* `prevProps`: 업데이트 이전의 props. `prevProps`와 [`this.props`](#props)를 비교하여 변경된 내용을 확인합니다.

* `prevState`: 업데이트 전 state. `prevState`를 [`this.state`](#state)와 비교하여 변경된 내용을 확인합니다.

* `snapshot`: [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate)를 구현한 경우, `snapshot`에는 해당 메서드에서 반환한 값이 포함됩니다. 그렇지 않으면 `undefined`가 됩니다.

#### 반환값 {/*componentdidupdate-returns*/}

`componentDidUpdate`는 아무것도 반환하지 않아야 합니다.

#### 주의사항 {/*componentdidupdate-caveats*/}

- [`shouldComponentUpdate`](#shouldcomponentupdate)가 정의되어 있으면 `componentDidUpdate`가 호출되지 않고 `false`를 반환합니다.

- `componentDidUpdate` 내부의 로직은 일반적으로 `this.props`를 `prevProps`와 비교하고 `this.state`를 `prevState`와 비교하는 조건으로 래핑해야 합니다. 그렇지 않으면 무한 루프가 생성될 위험이 있습니다.

- `componentDidUpdate`에서 [`setState`](#setstate)를 즉시 호출할 수도 있지만 가능하면 피하는 것이 가장 좋습니다. 추가 렌더링이 트리거되지만 브라우저가 화면을 업데이트하기 전에 발생합니다. 이렇게 하면 이 경우 [`render`](#render)가 두 번 호출되더라도 사용자에게 중간 state가 표시되지 않습니다. 이 패턴은 종종 성능 문제를 일으키지만 드물게 모달이나 툴팁처럼 크기나 위치에 따라 달라지는 것을 렌더링하기 전에 DOM 노드를 측정해야 하는 경우에 필요할 수 있습니다.

<Note>

많은 사용 사례에서 `componentDidMount`, `componentDidUpdate` 및 `componentWillUnmount`를 클래스 컴포넌트에 함께 정의하는 것은 함수 컴포넌트에서 [`useEffect`](/reference/react/useEffect)를 호출하는 것과 같습니다. 드물지만 브라우저 페인트 전에 코드를 실행하는 것이 중요한 경우에는 [`useLayoutEffect`](/reference/react/useLayoutEffect)를 사용하는 것이 더 적합합니다.

[마이그레이션 방법을 확인하세요.](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Note>
---

### `componentWillMount()` {/*componentwillmount*/}

<Deprecated>

이 API의 이름이 `componentWillMount`에서 [`UNSAFE_componentWillMount`](#unsafe_componentwillmount)로 변경되었습니다. 이전 이름은 더 이상 사용되지 않습니다. 향후 React의 주요 버전에서는 새로운 이름만 작동합니다.

컴포넌트를 자동으로 업데이트하려면 [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles)를 실행하세요.

</Deprecated>

---

### `componentWillReceiveProps(nextProps)` {/*componentwillreceiveprops*/}

<Deprecated>

이 API의 이름이 `componentWillReceiveProps`에서 [`UNSAFE_componentWillReceiveProps`](#unsafe_componentwillreceiveprops)로 변경되었습니다. 이전 이름은 더 이상 사용되지 않습니다. 향후 React의 주요 버전에서는 새로운 이름만 작동합니다.

컴포넌트를 자동으로 업데이트하려면 [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles)를 실행하세요.

</Deprecated>

---

### `componentWillUpdate(nextProps, nextState)` {/*componentwillupdate*/}

<Deprecated>

이 API의 이름이 `componentWillUpdate`에서 [`UNSAFE_componentWillUpdate`](#unsafe_componentwillupdate)로 변경되었습니다. 이전 이름은 더 이상 사용되지 않습니다. 향후 React의 주요 버전에서는 새로운 이름만 작동합니다.

컴포넌트를 자동으로 업데이트하려면 [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles)를 실행하세요.

</Deprecated>

---

### `componentWillUnmount()` {/*componentwillunmount*/}

`componentWillUnmount` 메서드를 정의하면 React는 컴포넌트가 화면에서 제거 *(마운트 해제)* 되기 전에 이 메서드를 호출합니다. 이는 데이터 불러오기를 취소하거나 구독을 제거하는 일반적인 장소입니다.

`componentWillUnmount` 내부의 로직은 [`componentDidMount`](#componentdidmount) 내부의 로직을 "미러링"해야 합니다. 예를 들어 `componentDidMount`가 구독을 설정하면 `componentWillUnmount`는 해당 구독을 정리해야 합니다. `componentWillUnmount`의 정리 로직이 일부 props나 state를 읽는 경우, 일반적으로 이전 props나 state에 해당하는 리소스(예: 구독)를 정리하기 위해 [`componentDidUpdate`](#componentdidupdate)도 구현해야 합니다.

```js {20-22}
class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  // ...
}
```

[더 많은 예시를 확인하세요.](#adding-lifecycle-methods-to-a-class-component)

#### 매개변수 {/*componentwillunmount-parameters*/}

`componentWillUnmount`는 어떤 매개변수도 받지 않습니다.

#### 반환값 {/*componentwillunmount-returns*/}

`componentWillUnmount`는 아무것도 반환하지 않아야 합니다.

#### 주의사항 {/*componentwillunmount-caveats*/}

- [Strict 모드](/reference/react/StrictMode)가 켜져 있으면 개발 시 React는 [`componentDidMount`](#componentdidmount)를 호출한 다음 즉시 `componentWillUnmount`를 호출한 다음 `componentDidMount`를 다시 호출합니다. 이렇게 하면 `componentWillUnmount`를 구현하는 것을 잊어버렸거나 그 로직이 `componentDidMount`의 동작을 완전히 "미러링"하지 않는지 확인할 수 있습니다.

<Note>

많은 사용 사례에서 `componentDidMount`, `componentDidUpdate` 및 `componentWillUnmount`를 클래스 컴포넌트에 함께 정의하는 것은 함수 컴포넌트에서 [`useEffect`](/reference/react/useEffect)를 호출하는 것과 같습니다. 드물지만 브라우저 페인트 전에 코드를 실행하는 것이 중요한 경우에는 [`useLayoutEffect`](/reference/react/useLayoutEffect)를 사용하는 것이 더 적합합니다.

[마이그레이션 방법을 확인하세요.](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Note>

---

### `forceUpdate(callback?)` {/*forceupdate*/}

컴포넌트를 강제로 다시 렌더링합니다.

일반적으로는 필요하지 않습니다. 컴포넌트의 [`render`](#render) 메서드가 [`this.props`](#props), [`this.state`](#state) 또는 [`this.context`](#context)에서만 읽는 경우, 컴포넌트 내부 또는 부모 중 하나에서 [`setState`](#setstate)를 호출하면 자동으로 다시 렌더링됩니다. 하지만 컴포넌트의 `render` 메서드가 외부 데이터 소스로부터 직접 읽어오는 경우, 데이터 소스가 변경될 때 사용자 인터페이스를 업데이트하도록 React에 지시해야 합니다. 이것이 바로 `forceUpdate`가 할 수 있는 일입니다.

`forceUpdate`의 모든 사용을 피하고 `render`에서 `this.props`와 `this.state`로부터만 읽도록 하세요.

#### 매개변수 {/*forceupdate-parameters*/}

* **optional** `callback`: 지정한 경우 React는 업데이트가 커밋된 후 사용자가 제공한 `callback`을 호출합니다.

#### 반환값 {/*forceupdate-returns*/}

`forceUpdate`는 아무것도 반환하지 않습니다.

#### 주의사항 {/*forceupdate-caveats*/}

- `forceUpdate`를 호출하면 React는 [`shouldComponentUpdate`](#shouldcomponentupdate)를 호출하지 않고 다시 렌더링합니다.

<Note>

외부 데이터 소스를 읽는 것과 `forceUpdate`를 사용하여 변경된 내용에 따라 클래스 컴포넌트를 다시 렌더링하도록 강제하는 것은 함수 컴포넌트에서 [`useSyncExternalStore`](/reference/react/useSyncExternalStore)로 대체되었습니다.

</Note>

---

### `getChildContext()` {/*getchildcontext*/}

<Deprecated>

이 API는 향후 React의 주요 버전에서 제거될 예정입니다. [대신 `Context.Provider`를 사용하세요.](/reference/react/createContext#provider)

</Deprecated>

이 컴포넌트가 제공하는 [legacy context](https://ko.reactjs.org/docs/legacy-context.html)에 대한 값을 지정할 수 있습니다.

---

### `getSnapshotBeforeUpdate(prevProps, prevState)` {/*getsnapshotbeforeupdate*/}

`getSnapshotBeforeUpdate`를 구현하면 React가 DOM을 업데이트하기 바로 전에 호출합니다. 이를 통해 컴포넌트가 잠재적으로 변경되기 전에 DOM에서 일부 정보(예: 스크롤 위치)를 캡처할 수 있습니다. 이 생명주기 메서드가 반환하는 모든 값은 [`componentDidUpdate`](#componentdidupdate)에 매개변수로 전달됩니다.

예를 들어 업데이트 중에 스크롤 위치를 유지해야 하는 채팅 스레드와 같은 UI에서 이 메서드를 사용할 수 있습니다.

```js {7-15,17}
class ScrollingList extends React.Component {
  constructor(props) {
    super(props);
    this.listRef = React.createRef();
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // 목록에 새 항목을 추가하고 있나요?
    // 나중에 스크롤을 조정할 수 있도록 스크롤 위치를 캡처합니다.
    if (prevProps.list.length < this.props.list.length) {
      const list = this.listRef.current;
      return list.scrollHeight - list.scrollTop;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // 스냅샷 값이 있으면 방금 새 항목을 추가한 것입니다.
    // 새 항목이 기존 항목을 시야 밖으로 밀어내지 않도록 스크롤을 조정합니다.
    // (여기서 스냅샷은 getSnapshotBeforeUpdate에서 반환된 값입니다.)
    if (snapshot !== null) {
      const list = this.listRef.current;
      list.scrollTop = list.scrollHeight - snapshot;
    }
  }

  render() {
    return (
      <div ref={this.listRef}>{/* ...contents... */}</div>
    );
  }
}
```

위의 예시에서는 `getSnapshotBeforeUpdate`에서 직접 `scrollHeight` 속성을 읽는 것이 중요합니다. [`render`](#render), [`UNSAFE_componentWillReceiveProps`](#unsafe_componentwillreceiveprops) 또는 [`UNSAFE_componentWillUpdate`](#unsafe_componentwillupdate)가 호출되는 시점과 React가 DOM을 업데이트하는 시점 사이에 잠재적인 시간 간격이 있기 때문에 이러한 여러 메서드에서 이(역주: `scrollHeight`)를 읽는 것은 안전하지 않습니다.

#### 매개변수 {/*getsnapshotbeforeupdate-parameters*/}

* `prevProps`: 업데이트 이전의 props. `prevProps`와 [`this.props`](#props)를 비교하여 변경된 내용을 확인합니다.

* `prevState`: 업데이트 전 state. `prevState`를 [`this.state`](#state)와 비교하여 변경된 내용을 확인합니다.

#### 반환값 {/*getsnapshotbeforeupdate-returns*/}

원하는 유형의 스냅샷 값 또는 `null`을 반환해야 합니다. 반환한 값은 [componentDidUpdate](#componentdidupdate)의 세 번째 인자로 전달됩니다.

#### 주의사항 {/*getsnapshotbeforeupdate-caveats*/}

- [`shouldComponentUpdate`](#shouldcomponentupdate)가 정의되어 있으면 `getSnapshotBeforeUpdate`가 호출되지 않고 `false`를 반환합니다.

<Note>

현재로서는 함수 컴포넌트에 대한 `getSnapshotBeforeUpdate`와 동등한 함수가 없습니다. 이 사용 사례는 매우 드물지만, 이 기능이 필요한 경우 현재로서는 클래스 컴포넌트를 작성해야 합니다.

</Note>

---

### `render()` {/*render*/}

`render` 메서드는 클래스 컴포넌트에서 유일하게 필요한 메서드입니다.

`render` 메서드는 화면에 표시할 내용을 지정해야 합니다, 예를 들어

```js {4-6}
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

React는 언제든 `render`를 호출할 수 있으므로 특정 시간에 실행된다고 가정해서는 안 됩니다. 일반적으로 `render` 메서드는 [JSX](/learn/writing-markup-with-jsx)를 반환해야 하지만 몇 가지 (문자열과 같은) [다른 반환 유형](#render-returns)이 지원됩니다. 반환된 JSX를 계산하기 위해 `render` 메서드는 [`this.props`](#props), [`this.state`](#state) 및 [`this.context`](#context)를 읽을 수 있습니다.

`render` 메서드는 순수 함수로 작성해야 합니다. 즉, props, state 및 context가 동일한 경우 동일한 결과를 반환해야 합니다. 또한 (구독 설정과 같은) 부수 효과를 포함하거나 브라우저 API와 상호작용해서는 안 됩니다. 부수 효과는 이벤트 핸들러나 [`componentDidMount`](#componentdidmount)와 같은 메서드에서 발생해야 합니다.

#### 매개변수 {/*render-parameters*/}

* `prevProps`: 업데이트 이전의 props. `prevProps`와 [`this.props`](#props)를 비교하여 변경된 내용을 확인합니다.

* `prevState`: 업데이트 전 state. `prevState`를 [`this.state`](#state)와 비교하여 변경된 내용을 확인합니다.

#### 반환값 {/*render-returns*/}

`render`는 유효한 모든 React 노드를 반환할 수 있습니다. 여기에는 `<div />`, 문자열, 숫자, [portals](/reference/react-dom/createPortal), 빈 노드(`null`, `undefined`, `true`, `false`) 및 React 노드의 배열과 같은 React 엘리먼트가 포함됩니다.

#### 주의사항 {/*render-caveats*/}

- `render`는 props, state, context의 순수한 함수로 작성되어야 합니다. 부수 효과가 없어야 합니다.

- [`shouldComponentUpdate`](#shouldcomponentupdate)가 정의되고 `false`를 반환하면 `render`가 호출되지 않습니다.

- [Strict 모드](/reference/react/StrictMode)가 켜져 있으면 React는 개발 과정에서 `render`를 두 번 호출한 다음 결과 중 하나를 버립니다. 이렇게 하면 `render` 메서드에서 제거해야 하는 우발적인 부수 효과를 알아차릴 수 있습니다.

- `render` 호출과 후속 `componentDidMount` 또는 `componentDidUpdate` 호출 사이에는 일대일 대응이 없습니다. `render` 호출 결과 중 일부는 유익할 때 React에 의해 버려질 수 있습니다.

---

### `setState(nextState, callback?)` {/*setstate*/}

`setState`를 호출하여 React 컴포넌트의 state를 업데이트합니다.

```js {8-10}
class Form extends Component {
  state = {
    name: 'Taylor',
  };

  handleNameChange = (e) => {
    const newName = e.target.value;
    this.setState({
      name: newName
    });
  }

  render() {
    return (
      <>
        <input value={this.state.name} onChange={this.handleNameChange} />
        <p>Hello, {this.state.name}.
      </>
    );
  }
}
```

`setState`는 컴포넌트 state에 대한 변경 사항을 큐에 넣습니다. 이 컴포넌트와 그 자식이 새로운 state로 다시 렌더링해야 한다는 것을 React에게 알려줍니다. 이것이 상호작용에 반응하여 사용자 인터페이스를 업데이트하는 주요 방법입니다.

<Pitfall>

`setState`를 호출해도 이미 실행 중인 코드의 현재 state는 변경되지 **않습니다**.

```js {6}
function handleClick() {
  console.log(this.state.name); // "Taylor"
  this.setState({
    name: 'Robin'
  });
  console.log(this.state.name); // Still "Taylor"!
}
```

오로지 *다음* 렌더링부터 `this.state`가 반환할 내용에만 영향을 줍니다.

</Pitfall>

`setState`에 함수를 전달할 수도 있습니다. 이 함수를 사용하면 이전 state를 기반으로 state를 업데이트할 수 있습니다.

```js {2-6}
  handleIncreaseAge = () => {
    this.setState(prevState => {
      return {
        age: prevState.age + 1
      };
    });
  }
```

이 작업을 수행할 필요는 없지만 동일한 이벤트 중에 state를 여러 번 업데이트하려는 경우 유용합니다.

#### 매개변수 {/*setstate-parameters*/}

* `nextState`: 객체 또는 함수 중 하나입니다.
  * 객체를 `nextState`로 전달하면 `this.state`에 얕게(shallowly) 병합됩니다.
  * 함수를 `nextState`로 전달하면 _업데이터 함수_ 로 취급됩니다. 이 함수는 순수해야 하고, pending state와 props를 인자로 받아야 하며, `this.state`에 얕게(shallowly) 병합할 객체를 반환해야 합니다. React는 업데이터 함수를 큐에 넣고 컴포넌트를 다시 렌더링합니다. 다음 렌더링 중에 React는 큐에 있는 모든 업데이터를 이전 state에 적용하여 다음 state를 계산합니다.

* **optional** `callback`: 지정한 경우 React는 업데이트가 커밋된 후 사용자가 제공한 `callback`을 호출합니다.

#### 반환값 {/*setstate-returns*/}

`setState`는 아무것도 반환하지 않습니다.

#### 주의사항 {/*setstate-caveats*/}

- `setState`를 컴포넌트를 업데이트하는 즉각적인 명령이 아닌 *요청*으로 생각하세요. 여러 컴포넌트가 이벤트에 반응하여 state를 업데이트하면 React는 업데이트를 batch하고 이벤트가 끝날 때 단일 패스로 함께 다시 렌더링합니다. 드물게 특정 state 업데이트를 강제로 동기화하여 적용해야 하는 경우, [`flushSync`](/reference/react-dom/flushSync)로 래핑할 수 있지만, 이 경우 성능이 저하될 수 있습니다.

- `setState`는 `this.state`를 즉시 업데이트하지 않습니다. 따라서 `setState`를 호출한 직후 `this.state`를 읽는 것은 잠재적인 위험이 될 수 있습니다. 대신, 업데이트가 적용된 후에 실행되도록 보장되는 [`componentDidUpdate`](#componentdidupdate) 또는 setState `callback` 인자를 사용하십시오. 이전 state를 기반으로 state를 설정해야 하는 경우 위에서 설명한 대로 함수를 `nextState`에 전달할 수 있습니다.

<Note>

클래스 컴포넌트에서 `setState`를 호출하는 것은 함수 컴포넌트에서 [`set` 함수](/reference/react/useState#setstate)를 호출하는 것과 유사합니다.

[마이그레이션 방법을 확인하세요.](#migrating-a-component-with-state-from-a-class-to-a-function)

</Note>

---

### `shouldComponentUpdate(nextProps, nextState, nextContext)` {/*shouldcomponentupdate*/}

`shouldComponentUpdate`를 정의하면 React가 이를 호출하여 재렌더링을 건너뛸 수 있는지 여부를 결정합니다.

직접 작성을 원하는 것이 확실하다면, `this.props`를 `nextProps`와, `this.state`를 `nextState`와 비교하고 `false`를 반환하여 React에 업데이트를 건너뛸 수 있음을 알릴 수 있습니다.

```js {6-18}
class Rectangle extends Component {
  state = {
    isHovered: false
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.position.x === this.props.position.x &&
      nextProps.position.y === this.props.position.y &&
      nextProps.size.width === this.props.size.width &&
      nextProps.size.height === this.props.size.height &&
      nextState.isHovered === this.state.isHovered
    ) {
      // 변경된 사항이 없으므로 다시 렌더링할 필요가 없습니다.
      return false;
    }
    return true;
  }

  // ...
}

```

새로운 props나 state가 수신되면 렌더링하기 전에 React가 `shouldComponentUpdate`를 호출합니다. 기본값은 `true`입니다. 이 메서드는 초기 렌더링이나 [`forceUpdate`](#forceupdate)가 사용될 때는 호출되지 않습니다.

#### 매개변수 {/*shouldcomponentupdate-parameters*/}

- `nextProps`: 컴포넌트가 렌더링할 다음 props입니다. `nextProps`와 [`this.props`](#props)를 비교하여 무엇이 변경되었는지 확인합니다.
- `nextState`: 컴포넌트가 렌더링할 다음 state입니다. `nextState`와 [`this.state`](#props)를 비교하여 무엇이 변경되었는지 확인합니다.
- `nextContext`: 컴포넌트가 렌더링할 다음 context입니다. `nextContext`를 [`this.context`](#context)와 비교하여 변경된 내용을 확인합니다. [`static contextType`](#static-contexttype)(modern) 또는 [`static contextTypes`](#static-contexttypes)(legacy)를 지정한 경우에만 사용할 수 있습니다.

#### 반환값 {/*shouldcomponentupdate-returns*/}

컴포넌트를 다시 렌더링하려면 `true`를 반환합니다. 이것이 기본 동작입니다.

React에 재렌더링을 건너뛸 수 있음을 알리려면 `false`를 반환합니다.

#### 주의사항 {/*shouldcomponentupdate-caveats*/}

- 이 메서드는 *오직* 성능 최적화를 위해서만 존재합니다. 이 메서드 없이 컴포넌트가 중단되는 경우 먼저 그 문제를 해결하세요.

- `shouldComponentUpdate`를 직접 작성하는 대신 [`PureComponent`](/reference/react/PureComponent)를 사용하는 것을 고려하세요. `PureComponent`는 props와 state를 얕게(shallowly) 비교하여 필요한 업데이트를 건너뛸 가능성을 줄여줍니다.

- `shouldComponentUpdate`에서 완전 일치(deep equality) 검사를 하거나 `JSON.stringify`를 사용하는 것은 권장하지 않습니다. 이는 성능을 예측할 수 없고 모든 prop과 state의 데이터 구조에 의존적이게 합니다. 최상의 경우 애플리케이션에 몇 초씩 멈추는 현상이 발생하고 최악의 경우 애플리케이션이 충돌할 위험이 있습니다.

- `false`를 반환해도 자식 컴포넌트들에서 *그들의* state가 변경될 때 다시 렌더링되는 것을 막지는 못합니다.

- `false`를 반환한다고 해서 컴포넌트가 다시 렌더링되지 않는다는 *보장*은 없습니다. React는 반환값을 힌트로 사용하지만 다른 이유로 컴포넌트를 다시 렌더링하는 것이 합리적일 경우 여전히 렌더링을 선택할 수 있습니다.

<Note>

`shouldComponentUpdate`로 클래스 컴포넌트를 최적화하는 것은 [`memo`](/reference/react/memo)로 함수 컴포넌트를 최적화하는 것과 유사합니다. 함수 컴포넌트는 [`useMemo`](/reference/react/useMemo)를 통해 더 세분화된 최적화도 제공합니다.

</Note>

---

### `UNSAFE_componentWillMount()` {/*unsafe_componentwillmount*/}

`UNSAFE_componentWillMount`를 정의하면 React는 [`constructor`](#constructor) 바로 뒤에 이를 호출합니다. 이 메서드는 역사적인 이유로만 존재하며 새로운 코드에서 사용해서는 안 됩니다. 대신 다른 대안을 사용하세요.

- state를 초기화하려면 [`state`](#state)를 class 필드로 선언하거나 [`constructor`](#constructor) 내에서 `this.state`를 설정하세요.
- 부수 효과를 실행하거나 구독을 설정해야 하는 경우 해당 로직을 [`componentDidMount`](#componentdidmount)로 옮기세요.

[안전하지 않은 생명주기에서 벗어나 마이그레이션한 사례를 확인하세요.](https://ko.legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#examples)

#### 매개변수 {/*unsafe_componentwillmount-parameters*/}

`UNSAFE_componentWillMount`는 어떠한 매개변수도 받지 않습니다.

#### 반환값 {/*unsafe_componentwillmount-returns*/}

`UNSAFE_componentWillMount`는 아무것도 반환하지 않아야 합니다.

#### 주의사항 {/*unsafe_componentwillmount-caveats*/}

- 컴포넌트가 [`static getDerivedStateFromProps`](#static-getderivedstatefromprops) 또는 [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate)를 구현하는 경우 `UNSAFE_componentWillMount`가 호출되지 않습니다.

- 이름과는 달리, 앱이 [`Suspense`](/reference/react/Suspense)와 같은 최신 React 기능을 사용하는 경우 `UNSAFE_componentWillMount`는 컴포넌트가 마운트*될 것*을 보장하지 않습니다. 렌더링 시도가 일시 중단되면(예를 들어 일부 자식 컴포넌트의 코드가 아직 로드되지 않았기 때문에) React는 진행 중인 트리를 버리고 다음 시도에서 컴포넌트를 처음부터 구성하려고 시도합니다. 이것이 바로 이 메서드가 "안전하지 않은" 이유입니다. 마운팅에 의존하는 코드(예: 구독 추가)는 [`componentDidMount`](#componentdidmount)로 이동해야 합니다.

- `UNSAFE_componentWillMount`는 [서버 렌더링](/reference/react-dom/server) 중에 실행되는 유일한 생명주기 메서드입니다. 모든 실용적인 용도로 볼 때 [`constructor`](#constructor)와 동일하므로 이러한 유형의 로직에는 `constructor`를 대신 사용해야 합니다.

<Note>

클래스 컴포넌트 내 `UNSAFE_componentWillMount` 내부에서 [`setState`](#setstate)를 호출하여 state를 초기화하는 것은 함수 컴포넌트에서 해당 state를 [`useState`](/reference/react/useState)에 초기 state로 전달하는 것과 동일합니다.

</Note>

---

### `UNSAFE_componentWillReceiveProps(nextProps, nextContext)` {/*unsafe_componentwillreceiveprops*/}

`UNSAFE_componentWillReceiveProps`를 정의하면 컴포넌트가 새로운 props를 수신할 때 React가 이를 호출합니다. 이 메서드는 역사적인 이유로만 존재하며 새로운 코드에서 사용해서는 안 됩니다. 대신 다른 방법을 사용하세요.

- props 변경에 대한 응답으로 **부수 효과를 실행**(예: 데이터 가져오기, 애니메이션 실행, 구독 재초기화)해야 하는 경우 해당 로직을 [`componentDidUpdate`](#componentdidupdate)로 옮기세요.
- **props가 변경될 때만 일부 데이터를 다시 계산하지 않아야** 하는 경우 대신 [memoization helper](https://ko.legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization)를 사용하세요.
- **props가 변경될 때 일부 상태를 "초기화"** 해야 하는 경우, 컴포넌트를 [완전히 제어](https://ko.legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component)하거나 [key로 완전히 제어하지 않도록](https://ko.legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) 만드는 것이 좋습니다.
- **props가 변경될 때 일부 state를 "조정"** 해야 하는 경우 렌더링 중에 props만으로 필요한 모든 정보를 계산할 수 있는지 확인하세요. 계산할 수 없는 경우 [`static getDerivedStateFromProps`](/reference/react/Component#static-getderivedstatefromprops)를 대신 사용하세요.

[안전하지 않은 생명주기에서 벗어나 마이그레이션한 사례를 확인하세요.](https://ko.legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props)

#### 매개변수 {/*unsafe_componentwillreceiveprops-parameters*/}

- `nextProps`: 컴포넌트가 부모 컴포넌트로부터 받으려는 다음 props입니다. `nextProps`와 [`this.props`](#props)를 비교하여 무엇이 변경되었는지 확인합니다.
- `nextContext`: 컴포넌트가 가장 가까운 공급자(provider)로부터 받으려는 다음 props입니다. `nextContext`를 [`this.context`](#context)와 비교하여 변경된 내용을 확인합니다. [`static contextType`](#static-contexttype)(modern) 또는 [`static contextTypes`](#static-contexttypes)(legacy)를 지정한 경우에만 사용할 수 있습니다.

#### 반환값 {/*unsafe_componentwillreceiveprops-returns*/}

`UNSAFE_componentWillReceiveProps`는 아무것도 반환하지 않아야 합니다.

#### 주의사항 {/*unsafe_componentwillreceiveprops-caveats*/}

- 컴포넌트가 [`static getDerivedStateFromProps`](#static-getderivedstatefromprops) 또는 [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate)를 구현하는 경우 `UNSAFE_componentWillReceiveProps`가 호출되지 않습니다.

- 이름과는 달리, 앱이 [`Suspense`](/reference/react/Suspense)와 같은 최신 React 기능을 사용하는 경우 `UNSAFE_componentWillReceiveProps`는 컴포넌트가 해당 props를 수신*할 것*을 보장하지 않습니다. 렌더링 시도가 일시 중단되면(예를 들어 일부 자식 컴포넌트의 코드가 아직 로드되지 않았기 때문에) React는 진행 중인 트리를 버리고 다음 시도 중에 컴포넌트를 처음부터 다시 구성하려고 시도합니다. 다음 렌더링을 시도할 때쯤이면 props가 달라져 있을 수 있습니다. 이것이 바로 이 메서드가 "안전하지 않은" 이유입니다. 커밋된 업데이트에 대해서만 실행되어야 하는 코드(예: 구독 재설정)는 [`componentDidUpdate`](#componentdidupdate)로 이동해야 합니다.

- `UNSAFE_componentWillReceiveProps`는 컴포넌트가 지난번과 *다른* props를 받았다는 것을 의미하지 않습니다. `nextProps`와 `this.props`를 직접 비교하여 변경된 사항이 있는지 확인해야 합니다.

- React는 마운트하는 동안 초기 props와 함께 `UNSAFE_componentWillReceiveProps`를 호출하지 않습니다. 컴포넌트의 일부 props가 업데이트될 경우에만 이 메서드를 호출합니다. 예를 들어, 일반적으로 같은 컴포넌트 내부에서 [`setState`](#setstate)를 호출해도 `UNSAFE_componentWillReceiveProps`가 트리거되지 않습니다.

<Note>

클래스 컴포넌트에서 `UNSAFE_componentWillReceiveProps` 내부의 [`setState`](#setstate)를 호출하여 state를 "조정"하는 것은 함수 컴포넌트에서 [렌더링 중에 `useState`에서 `set` 함수를 호출하는 것](/reference/react/useState#storing-information-from-previous-renders)과 동일합니다.

</Note>

---

### `UNSAFE_componentWillUpdate(nextProps, nextState)` {/*unsafe_componentwillupdate*/}

`UNSAFE_componentWillUpdate`를 정의하면 React는 새 props나 state로 렌더링하기 전에 이를 호출합니다. 이 메서드는 역사적인 이유로만 존재하며 새로운 코드에서 사용해서는 안 됩니다. 대신 다른 대안을 사용하세요.

- props나 state 변경에 대한 응답으로 부수 효과(예: 데이터 가져오기, 애니메이션 실행, 구독 재초기화)를 실행해야 하는 경우, 해당 로직을 [`componentDidUpdate`](#componentdidupdate)로 이동하세요.
- 나중에 [`componentDidUpdate`](#componentdidupdate)에서 사용할 수 있도록 DOM에서 일부 정보(예: 현재 스크롤 위치를 저장하기 위해)를 읽어야 하는 경우, 대신 [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate) 내부에서 읽습니다.

[안전하지 않은 생명주기에서 벗어나 마이그레이션한 사례를 확인하세요.](https://ko.legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#examples)

#### 매개변수 {/*unsafe_componentwillupdate-parameters*/}

- `nextProps`: 컴포넌트가 렌더링할 다음 props입니다. `nextProps`와 [`this.props`](#props)를 비교하여 무엇이 변경되었는지 확인합니다.
- `nextState`: 컴포넌트가 렌더링할 다음 state입니다. `nextState`와 [`this.state`](#props)를 비교하여 무엇이 변경되었는지 확인합니다.

#### 반환값 {/*unsafe_componentwillupdate-returns*/}

`UNSAFE_componentWillUpdate`는 아무것도 반환하지 않아야 합니다.

#### 주의사항 {/*unsafe_componentwillupdate-caveats*/}

- [`shouldComponentUpdate`](#shouldcomponentupdate)가 정의된 경우 `UNSAFE_componentWillUpdate`는 호출되지 않으며 `false`를 반환합니다.

- 컴포넌트가 [`static getDerivedStateFromProps`](#static-getderivedstatefromprops) 또는 [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate)를 구현하는 경우 `UNSAFE_componentWillUpdate`가 호출되지 않습니다.

- `componentWillUpdate` 중에 [`setState`](#setstate)를 호출하는 것(또는 Redux 액션을 dispatch하는 것과 같이 `setState`가 호출되도록 하는 모든 메서드)은 지원되지 않습니다.

- 이름과는 달리, 앱이 [`Suspense`](/reference/react/Suspense)와 같은 최신 React 기능을 사용하는 경우 `UNSAFE_componentWillUpdate`가 컴포넌트가 업데이트*할 것*을 보장하지는 않습니다. 렌더링 시도가 일시 중단되면(예를 들어 일부 하위 컴포넌트의 코드가 아직 로드되지 않았기 때문에) React는 진행 중인 트리를 버리고 다음 시도에서 컴포넌트를 처음부터 새로 구성하려고 시도합니다. 다음 렌더링 시도 시에는 props와 state가 달라질 수 있습니다. 이것이 바로 이 메서드가 "안전하지 않은" 이유입니다. 커밋된 업데이트에 대해서만 실행되어야 하는 코드(예: 구독 재설정)는 [`componentDidUpdate`](#componentdidupdate)로 이동해야 합니다.

- `UNSAFE_componentWillUpdate`는 컴포넌트가 지난번과 *다른* props나 state를 받았다는 것을 의미하지 않습니다. `nextProps`를 `this.props`와, `nextState`를 `this.state`와 직접 비교하여 변경된 사항이 있는지 확인해야 합니다.

- React는 마운트하는 동안 초기 props와 state와 함께 `UNSAFE_componentWillUpdate`를 호출하지 않습니다.

<Note>

함수 컴포넌트에는 `UNSAFE_componentWillUpdate`와 직접적으로 대응하는 것이 없습니다.

</Note>

---

### `static childContextTypes` {/*static-childcontexttypes*/}

<Deprecated>

이 API는 향후 React의 주요 버전에서 제거될 예정입니다. [대신 `static contextType`을 사용하세요.](#static-contexttype)

</Deprecated>

이 컴포넌트가 제공하는 [legacy context](https://ko.reactjs.org/docs/legacy-context.html)를 지정할 수 있습니다.

---

### `static contextTypes` {/*static-contexttypes*/}

<Deprecated>

이 API는 향후 React의 주요 버전에서 제거될 예정입니다. [대신 `static contextType`을 사용하세요.](#static-contexttype)

</Deprecated>

이 컴포넌트가 사용할 [legacy context](https://ko.reactjs.org/docs/legacy-context.html)를 지정할 수 있습니다.

---

### `static contextType` {/*static-contexttype*/}

클래스 컴포넌트에서 [`this.context`](#context-instance-field) 를 읽으려면 읽어야 하는 context를 지정해야 합니다. `static contextType`으로 지정하는 context는 이전에 [`createContext`](/reference/react/createContext)로 생성한 값이어야 합니다.

```js {2}
class Button extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {this.props.children}
      </button>
    );
  }
}
```

<Note>

클래스 컴포넌트에서 `this.context`를 읽는 것은 함수 컴포넌트에서 [`useContext`](/reference/react/useContext)와 같습니다.

[마이그레이션 방법을 확인하세요.](#migrating-a-component-with-context-from-a-class-to-a-function)

</Note>

---

### `static defaultProps` {/*static-defaultprops*/}

`static defaultProps`를 정의하여 class의 기본 props을 설정할 수 있습니다. `undefined`와 누락된 props에는 사용되지만 `null` props에는 사용되지 않습니다.

예를 들어, `color` prop의 기본값을 `'blue'`로 정의하는 방법은 다음과 같습니다.

```js {2-4}
class Button extends Component {
  static defaultProps = {
    color: 'blue'
  };

  render() {
    return <button className={this.props.color}>click me</button>;
  }
}
```

`color` props이 제공되지 않거나 `undefined`인 경우 기본적으로 '`blue'`로 설정됩니다.

```js
<>
  {/* this.props.color is "blue" */}
  <Button />

  {/* this.props.color is "blue" */}
  <Button color={undefined} />

  {/* this.props.color is null */}
  <Button color={null} />

  {/* this.props.color is "red" */}
  <Button color="red" />
</>
```

<Note>

클래스 컴포넌트에서 `defaultProps`를 정의하는 것은 함수 컴포넌트에서 [default values](/learn/passing-props-to-a-component#specifying-a-default-value-for-a-prop)를 사용하는 것과 유사합니다.

</Note>

---

### `static propTypes` {/*static-proptypes*/}

[`prop-types`](https://www.npmjs.com/package/prop-types) 라이브러리와 함께 `static propTypes`를 정의하여 컴포넌트에서 허용되는 props의 유형을 선언할 수 있습니다. 이러한 유형은 렌더링 중과 개발 중에만 확인됩니다.

```js
import PropTypes from 'prop-types';

class Greeting extends React.Component {
  static propTypes = {
    name: PropTypes.string
  };

  render() {
    return (
      <h1>Hello, {this.props.name}</h1>
    );
  }
}
```

<Note>

런타임에 prop 타입을 확인하는 대신 [TypeScript](https://www.typescriptlang.org/ko/)를 사용하는 것을 추천합니다.

</Note>

---

### `static getDerivedStateFromError(error)` {/*static-getderivedstatefromerror*/}

`static getDerivedStateFromError`를 정의하면 렌더링 도중 자식 컴포넌트(멀리 떨어진 자식 포함)가 에러를 던질 때 React가 이를 호출합니다. 이렇게 하면 UI를 지우는 대신 오류 메시지를 표시할 수 있습니다.

일반적으로 일부 분석 서비스에 오류 보고서를 보낼 수 있는 [`componentDidCatch`](#componentDidCatch)와 함께 사용됩니다. 이러한 메서드가 있는 컴포넌트를 *오류 경계(error boundary)* 라고 합니다.

[예시를 확인하세요.](#catching-rendering-errors-with-an-error-boundary)

#### 매개변수 {/*static-getderivedstatefromerror-parameters*/}

* `error`: 던져진 오류입니다. 실제로는 일반적으로 [`Error`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Error)의 인스턴스가 되지만, 자바스크립트에서는 문자열이나 심지어 `null`을 포함한 모든 값을 [`throw`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/throw) 할 수 있으므로 보장되지는 않습니다.

#### 반환값 {/*static-getderivedstatefromerror-returns*/}

`static getDerivedStateFromError`는 컴포넌트에 오류 메시지를 표시하도록 지시하는 state를 반환해야 합니다.

#### 주의사항 {/*static-getderivedstatefromerror-caveats*/}

* `static getDerivedStateFromError`는 순수 함수여야 합니다. 예를 들어 분석 서비스를 호출하는 등의 부수 효과를 수행하려면 [`componentDidCatch`](#componentdidcatch)도 구현해야 합니다.

<Note>

함수 컴포넌트에서 `static getDerivedStateFromError`에 대해 직접적으로 동등한 것은 아직 없습니다. 클래스 컴포넌트를 만들지 않으려면 위와 같이 하나의 `ErrorBoundary` 컴포넌트를 작성하고 앱 전체에서 사용하세요. 또는 이를 수행하는 [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary) package를 사용하세요.

</Note>

---

### `static getDerivedStateFromProps(props, state)` {/*static-getderivedstatefromprops*/}

`static getDerivedStateFromProps`를 정의하면 React는 초기 마운트 및 후속 업데이트 모두에서 [`render`](#render)를 호출하기 바로 전에 이를 호출합니다. state를 업데이트하려면 객체를 반환하고, 아무것도 업데이트하지 않으려면 `null`을 반환해야 합니다.

이 메서드는 시간이 지남에 따라 props의 변경에 따라 상태가 달라지는 [드문 사용 사례](https://ko.legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#when-to-use-derived-state)를 위해 존재합니다. 예를 들어, 이 `Form` 컴포넌트는 `userId` props가 변경되면 `email` state를 재설정합니다.

```js {7-18}
class Form extends Component {
  state = {
    email: this.props.defaultEmail,
    prevUserID: this.props.userID
  };

  static getDerivedStateFromProps(props, state) {
    // 현재 사용자가 변경될 때마다,
    // 해당 사용자와 연결된 state의 모든 부분을 재설정합니다.
    // 이 간단한 예제에서는 이메일만 해당됩니다.
    if (props.userID !== state.prevUserID) {
      return {
        prevUserID: props.userID,
        email: props.defaultEmail
      };
    }
    return null;
  }

  // ...
}
```

이 패턴을 사용하려면 props의 이전 값(예: userID)을 state(예: prevUserID)로 유지해야 한다는 점에 유의하세요.

<Pitfall>

state를 파생하면 코드가 장황해지고 컴포넌트에 대해 생각하기 어려워집니다. [더 간단한 대안에 익숙해지도록 하세요.](https://ko.legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html)

- props 변경에 대한 응답으로 부수 효과(예: 데이터 불러오기 또는 애니메이션)를 수행해야 하는 경우, 대신 [`componentDidUpdate`](#componentdidupdate) 메서드를 사용하세요.
- **props이 변경될 때만 일부 데이터를 다시 계산**하려면 [memoization helper를 대신 사용하세요.](https://ko.legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization)
- **prop이 변경될 때 일부 상태를 "초기화"** 하려면 컴포넌트를 [완전히 제어](https://ko.legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component)하거나 [key로 완전히 제어하지 않도록](https://ko.legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) 만드는 것이 좋습니다.

</Pitfall>

#### 매개변수 {/*static-getderivedstatefromprops-parameters*/}

- `props`: 컴포넌트가 렌더링할 다음 props입니다.
- `state`: 컴포넌트가 렌더링할 다음 state입니다.

#### 반환값 {/*static-getderivedstatefromprops-returns*/}

`static getDerivedStateFromProps`는 state를 업데이트할 객체를 반환하거나, 아무것도 업데이트하지 않으면 `null`을 반환합니다.

#### 주의사항 {/*static-getderivedstatefromprops-caveats*/}

- 이 메서드는 원인에 관계없이 *모든* 렌더링에서 호출됩니다. 이는 부모가 다시 렌더링을 일으킬 때만 발동하고 로컬 `setState`의 결과가 아닐 때만 발동하는 [`UNSAFE_componentWillReceiveProps`](#unsafe_cmoponentwillreceiveprops)와는 다릅니다.

- 이 메서드에는 컴포넌트 인스턴스에 대한 액세스 권한이 없습니다. 원하는 경우 클래스 정의 외부 컴포넌트 props 및 state의 순수 함수를 추출하여 `static getDerivedStateFromProps`와 다른 클래스 메서드 사이에 일부 코드를 재사용할 수 있습니다.

<Note>

클래스 컴포넌트에서 `static getDerivedStateFromProps`를 구현하는 것은 함수 컴포넌트에서 [렌더링하는 동안 `useState`에서 `set` 함수를 호출하는 것](/reference/react/useState#storing-information-from-previous-renders)과 동일합니다.

</Note>

---

## 사용법 {/*usage*/}

### 클래스 컴포넌트 정의하기 {/*defining-a-class-component*/}

React 컴포넌트를 class로 정의하려면 기본 제공 `Component` class를 확장하고 [`render` 메서드](#render)를 정의합니다,

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

React는 화면에 표시할 내용을 파악해야 할 때마다 [`render`](#render) 메서드를 호출합니다. 보통은 [JSX](/learn/writing-markup-with-jsx)를 반환합니다. `render` 메서드는 [순수 함수](https://en.wikipedia.org/wiki/Pure_function)여야 합니다. JSX만 계산해야 합니다.

[함수 컴포넌트](/learn/your-first-component#defining-a-component)와 마찬가지로 클래스 컴포넌트는 부모 컴포넌트로부터 [props로 정보를 받는 것](/learn/your-first-component#defining-a-component)이 가능합니다. 하지만 props를 읽는 문법은 다릅니다. 예를 들어, 부모 컴포넌트가 `<Greeting name="Taylor" />`를 렌더링하는 경우, `this.props.name`과 같이 [`this.props`](#props)에서 `name` prop을 읽을 수 있습니다.

<Sandpack>

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

export default function App() {
  return (
    <>
      <Greeting name="Sara" />
      <Greeting name="Cahal" />
      <Greeting name="Edite" />
    </>
  );
}
```

</Sandpack>

클래스 컴포넌트 내부에서는 Hooks(`use`로 시작하는 함수, 예를 들어 [`useState`](/reference/react/useState))가 지원되지 않습니다.

<Pitfall>

컴포넌트를 클래스 대신 함수로 정의하는 것을 추천합니다. [마이그레이션 방법을 확인하세요.](#migrating-a-simple-component-from-a-class-to-a-function)

</Pitfall>

---

### 클래스 컴포넌트에 state 추가하기 {/*adding-state-to-a-class-component*/}

클래스에 [state](/learn/state-a-components-memory)를 추가하려면 [`state`](#state)라는 프로퍼티에 객체를 할당합니다. 상태를 업데이트하려면 [`this.setState`](#setstate)를 호출합니다.

<Sandpack>

```js
import { Component } from 'react';

export default class Counter extends Component {
  state = {
    name: 'Taylor',
    age: 42,
  };

  handleNameChange = (e) => {
    this.setState({
      name: e.target.value
    });
  }

  handleAgeChange = () => {
    this.setState({
      age: this.state.age + 1 
    });
  };

  render() {
    return (
      <>
        <input
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        <button onClick={this.handleAgeChange}>
          Increment age
        </button>
        <p>Hello, {this.state.name}. You are {this.state.age}.</p>
      </>
    );
  }
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack> 

<Pitfall>

컴포넌트를 클래스 대신 함수로 정의하는 것을 추천합니다. [마이그레이션 방법을 확인하세요.](#migrating-a-component-with-state-from-a-class-to-a-function)

</Pitfall>

---

### 클래스 컴포넌트에 생명주기 메서드 추가하기 {/*adding-lifecycle-methods-to-a-class-component*/}

클래스에서 정의할 수 있는 몇 가지 특별한 메서드가 있습니다.

[`componentDidMount`](#componentdidmount) 메서드를 정의하면 컴포넌트가 화면에 추가 *(마운트)* 될 때 React가 이를 호출합니다. 컴포넌트가 props나 state 변경으로 인해 다시 렌더링되면 React는 [`componentDidUpdate`](#componentdidupdate)를 호출합니다. 컴포넌트가 화면에서 제거 *(마운트 해제)* 된 후 React는 [`componentWillUnmount`](#componentwillunmount)를 호출합니다.

`componentDidMount`를 구현하는 경우 일반적으로 버그를 피하기 위해 세 가지 생명주기를 모두 구현해야 합니다. 예를 들어 `componentDidMount`가 state나 props를 읽었다면 해당 변경 사항을 처리하기 위해 `componentDidUpdate`도 구현해야 하고, `componentDidMount`가 수행하던 작업을 정리하기 위해 `componentWillUnmount`도 구현해야 합니다.

예를 들어 이 `ChatRoom` 컴포넌트는 채팅 연결을 props 및 state와 동기화하여 유지합니다:

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js ChatRoom.js active
import { Component } from 'react';
import { createConnection } from './chat.js';

export default class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  setupConnection() {
    this.connection = createConnection(
      this.state.serverUrl,
      this.props.roomId
    );
    this.connection.connect();    
  }

  destroyConnection() {
    this.connection.disconnect();
    this.connection = null;
  }

  render() {
    return (
      <>
        <label>
          Server URL:{' '}
          <input
            value={this.state.serverUrl}
            onChange={e => {
              this.setState({
                serverUrl: e.target.value
              });
            }}
          />
        </label>
        <h1>Welcome to the {this.props.roomId} room!</h1>
      </>
    );
  }
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

[Strict 모드](/reference/react/StrictMode)가 켜져 있을 때 개발할 때 React는 `componentDidMount`를 호출하고, 즉시 `componentWillUnmount`를 호출한 다음, `componentDidMount`를 다시 호출합니다. 이렇게 하면 `componentWillUnmount`를 구현하는 것을 잊어버렸거나 그 로직이 `componentDidMount`의 동작을 완전히 "미러링"하지 않는지 알 수 있습니다.

<Pitfall>

컴포넌트를 클래스 대신 함수로 정의하는 것을 추천합니다. [마이그레이션 방법을 확인하세요.](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Pitfall>

---

### 오류 경계(error boundary)로 렌더링 오류 포착하기 {/*catching-rendering-errors-with-an-error-boundary*/}

기본적으로 애플리케이션이 렌더링 도중 에러를 발생시키면 React는 화면에서 해당 UI를 제거합니다. 이를 방지하기 위해 UI의 일부를 *에러 경계*로 감싸면 됩니다. 에러 경계는 에러가 발생한 부분 대신 오류 메시지와 같은 fallback UI를 표시할 수 있는 특수 컴포넌트입니다.

오류 경계 컴포넌트를 구현하려면 오류에 대한 응답으로 state를 업데이트하고 사용자에게 오류 메시지를 표시할 수 있는 [`static getDerivedStateFromError`](#static-getderivedstatefromerror)를 제공해야 합니다. 또한 선택적으로 [`componentDidCatch`](#componentdidcatch)를 구현하여 분석 서비스에 오류를 기록하는 등의 추가 로직을 추가할 수도 있습니다.

```js {7-10,12-19}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // state를 업데이트하여 다음 렌더링에 fallback UI가 표시되도록 합니다.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Example "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    logErrorToMyService(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // 사용자 지정 fallback UI를 렌더링할 수 있습니다.
      return this.props.fallback;
    }

    return this.props.children;
  }
}
```

그런 다음 컴포넌트 트리의 일부를 래핑할 수 있습니다.

```js {1,3}
<ErrorBoundary fallback={<p>Something went wrong</p>}>
  <Profile />
</ErrorBoundary>
```

`Profile` 또는 그 하위 컴포넌트가 오류를 발생시키면 `ErrorBoundary`가 해당 오류를 "포착"하고 사용자가 제공한 오류 메시지와 함께 fallback UI를 표시한 다음 프로덕션 오류 보고서를 오류 보고 서비스에 전송합니다.

모든 컴포넌트를 별도의 오류 경계로 묶을 필요는 없습니다. [오류 경계의 세분화](https://aweary.dev/fault-tolerance-react/)를 고려할 때는 오류 메시지를 표시하는 것이 적절한 위치를 고려하세요. 예를 들어 메시징 앱의 경우 대화 목록 주위에 오류 경계를 배치하는 것이 좋습니다. 또한 모든 개별 메시지 주위에 오류 경계를 배치하는 것도 좋습니다. 하지만 모든 아바타 주위에 경계를 배치하는 것은 적절하지 않습니다.

<Note>

현재 에러 경계를 함수 컴포넌트로 작성할 수 있는 방법은 없습니다. 하지만 에러 경계 클래스를 직접 작성할 필요는 없습니다. 예를 들어 [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary)를 대신 사용할 수 있습니다.

</Note>

---

## 대안 {/*alternatives*/}

### 클래스에서 함수로 간단한 컴포넌트 마이그레이션하기 {/*migrating-a-simple-component-from-a-class-to-a-function*/}

일반적으로 [컴포넌트를 함수로 대신 정의합니다.](/learn/your-first-component#defining-a-component)

예를 들어 이 `Greeting` 클래스 컴포넌트를 함수로 변환한다고 가정해 보겠습니다.

<Sandpack>

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

export default function App() {
  return (
    <>
      <Greeting name="Sara" />
      <Greeting name="Cahal" />
      <Greeting name="Edite" />
    </>
  );
}
```

</Sandpack>

`Greeting`이라는 함수를 정의합니다. 여기로 `render` 함수의 본문을 이동합니다.

```js
function Greeting() {
  // ... render 메서드의 코드를 여기로 옮깁니다 ...
}
```

`this.props.name` 대신 [구조 분해 문법을 사용하여](/learn/passing-props-to-a-component) `name` prop을 정의하고 직접 읽습니다.

```js
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}
```

다음은 전체 예제입니다.

<Sandpack>

```js
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

export default function App() {
  return (
    <>
      <Greeting name="Sara" />
      <Greeting name="Cahal" />
      <Greeting name="Edite" />
    </>
  );
}
```

</Sandpack>

---

### state가 있는 컴포넌트를 클래스에서 함수로 마이그레이션하기 {/*migrating-a-component-with-state-from-a-class-to-a-function*/}

이 `Counter` 클래스 컴포넌트를 함수로 변환한다고 가정해 봅시다.

<Sandpack>

```js
import { Component } from 'react';

export default class Counter extends Component {
  state = {
    name: 'Taylor',
    age: 42,
  };

  handleNameChange = (e) => {
    this.setState({
      name: e.target.value
    });
  }

  handleAgeChange = (e) => {
    this.setState({
      age: this.state.age + 1 
    });
  };

  render() {
    return (
      <>
        <input
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        <button onClick={this.handleAgeChange}>
          Increment age
        </button>
        <p>Hello, {this.state.name}. You are {this.state.age}.</p>
      </>
    );
  }
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

필요한 [state 변수](/reference/react/useState#adding-state-to-a-component)가 있는 함수를 선언하는 것으로 시작하세요.

```js {4-5}
import { useState } from 'react';

function Counter() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);
  // ...
```

다음으로 이벤트 핸들러를 변환합니다.

```js {5-7,9-11}
function Counter() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleAgeChange() {
    setAge(age + 1);
  }
  // ...
```

마지막으로, `this`으로 시작하는 모든 레퍼런스를 컴포넌트에서 정의한 변수 및 함수로 바꿉니다. 예를 들어, `this.state.age`를 `age`로 바꾸고 `this.handleNameChange`를 `handleNameChange`로 바꿉니다.

다음은 완전히 변환된 컴포넌트입니다.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleAgeChange() {
    setAge(age + 1);
  }

  return (
    <>
      <input
        value={name}
        onChange={handleNameChange}
      />
      <button onClick={handleAgeChange}>
        Increment age
      </button>
      <p>Hello, {name}. You are {age}.</p>
    </>
  )
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

---

### 생명주기 메서드가 있는 컴포넌트를 클래스에서 함수로 마이그레이션하기 {/*migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function*/}

생명주기 메서드가 있는 `ChatRoom` 클래스 컴포넌트를 함수로 변환한다고 가정해 보겠습니다.

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js ChatRoom.js active
import { Component } from 'react';
import { createConnection } from './chat.js';

export default class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  setupConnection() {
    this.connection = createConnection(
      this.state.serverUrl,
      this.props.roomId
    );
    this.connection.connect();    
  }

  destroyConnection() {
    this.connection.disconnect();
    this.connection = null;
  }

  render() {
    return (
      <>
        <label>
          Server URL:{' '}
          <input
            value={this.state.serverUrl}
            onChange={e => {
              this.setState({
                serverUrl: e.target.value
              });
            }}
          />
        </label>
        <h1>Welcome to the {this.props.roomId} room!</h1>
      </>
    );
  }
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // 실제 구현은 실제로 서버에 연결됩니다.
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

먼저 [`componentWillUnmount`](#componentwillunmount)가 [`componentDidMount`](#componentdidmount)와 반대 동작을 하는지 확인합니다. 위의 예시에서는 `componentDidMount`가 설정한 연결을 끊습니다. 이러한 로직이 누락된 경우 먼저 추가하세요.

다음으로, [`componentDidUpdate`](#componentdidupdate) 메서드가 `componentDidMount`에서 사용 중인 props 및 state의 변경 사항을 처리하는지 확인합니다. 위의 예시에서 `componentDidMount`는 `this.state.serverUrl`과 `this.props.roomId`를 읽는 `setupConnection`을 호출합니다. 이 때문에 `componentDidUpdate`는 `this.state.serverUrl`과 `this.props.roomId`가 변경되었는지 확인하고, 변경된 경우 연결을 재설정합니다. `componentDidUpdate` 로직이 누락되었거나 모든 관련 props 및 state의 변경 사항을 처리하지 않는 경우 먼저 해당 로직을 수정하세요.

위의 예시에서, 생명주기 메서드 내부의 로직은 컴포넌트를 React 외부의 시스템(채팅 서버)에 연결합니다. 컴포넌트를 외부 시스템에 연결하려면 [이 로직을 하나의 Effect로 설명하세요.](/reference/react/useEffect#connecting-to-an-external-system)

```js {6-12}
import { useState, useEffect } from 'react';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);

  // ...
}
```

이 [`useEffect`](/reference/react/useEffect) 호출은 위의 생명주기 메서드의 로직과 동일합니다. 생명주기 메서드가 서로 관련이 없는 여러 가지 작업을 수행하는 경우, [이를 여러 개의 독립적인 Effect로 분할하세요.](/learn/removing-effect-dependencies#is-your-effect-doing-several-unrelated-things) 다음은 완전한 예제입니다.

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // 실제 구현은 실제로 서버에 연결됩니다.
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

<Note>

컴포넌트가 외부 시스템과 동기화되지 않는 경우 [Effect가 필요하지 않을 수 있습니다.](/learn/you-might-not-need-an-effect)

</Note>

---

### context가 있는 컴포넌트를 클래스에서 함수로 마이그레이션하기 {/*migrating-a-component-with-context-from-a-class-to-a-function*/}

이 예제에서 `Panel` 및 `Button` 클래스 컴포넌트는 [`this.context`](#context)에서 [context](/learn/passing-data-deeply-with-context)를 읽습니다:

<Sandpack>

```js
import { createContext, Component } from 'react';

const ThemeContext = createContext(null);

class Panel extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'panel-' + theme;
    return (
      <section className={className}>
        <h1>{this.props.title}</h1>
        {this.props.children}
      </section>
    );    
  }
}

class Button extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {this.props.children}
      </button>
    );
  }
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

export default function MyApp() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  )
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

함수 컴포넌트로 변환할 때는 `this.context`를 [`useContext`](/reference/react/useContext) 호출로 바꾸세요.

<Sandpack>

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

export default function MyApp() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  )
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>
