---
id: react-component
title: React.Component
layout: docs
category: Reference
permalink: docs/react-component.html
redirect_from:
  - "docs/component-api.html"
  - "docs/component-specs.html"
  - "docs/component-specs-ko-KR.html"
  - "docs/component-specs-zh-CN.html"
  - "tips/UNSAFE_componentWillReceiveProps-not-triggered-after-mounting.html"
  - "tips/dom-event-listeners.html"
  - "tips/initial-ajax.html"
  - "tips/use-react-with-other-libraries.html"
---

이 문서에서는 React 컴포넌트 class를 다루는 API들을 자세히 소개합니다. 이 문서를 읽는 당신이 [컴포넌트와 props](/docs/components-and-props.html), [state와 생명주기](/docs/state-and-lifecycle.html) 등과 같은 기초적인 React의 개념들에 익숙하다고 가정하고 있습니다. 그렇지 않다면, 먼저 읽으시길 바랍니다.

## 개요 {#overview}

React를 사용할 때는 컴포넌트를 class 또는 함수로 정의할 수 있습니다. class로 정의된 컴포넌트는 아래에 자세히 설명하고 있듯 보다 많은 기능을 제공합니다. React 컴포넌트 class를 정의하려면 `React.Component`를 상속받아야 합니다.

```js
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

[`render()`](#render)는 `React.Component`의 하위 class에서 *반드시* 정의해야 하는 메서드입니다. 그 외에 이 문서에서 설명하는 메서드들은 선택 사항입니다.

**컴포넌트 클래스를 직접 만들어서 사용하지 마세요.** React 컴포넌트를 사용할 때에는 [상속보다 합성을 주로 사용합니다](/docs/composition-vs-inheritance.html).

> 주의
>
> React를 사용할 때 반드시 ES6 class 문법을 사용하지 않아도 됩니다. 그 대신 `create-react-class` 모듈 또는 이와 유사한 별도의 추상화를 사용해도 됩니다. 자세한 정보는 [ES6 없이 사용하는 React](/docs/react-without-es6.html) 문서에서 확인할 수 있습니다.

### 컴포넌트 생명주기 {#the-component-lifecycle}

모든 컴포넌트는 여러 종류의 "생명주기 메서드"를 가지며, 이 메서드를 오버라이딩하여 특정 시점에 코드가 실행되도록 설정할 수 있습니다. [이 생명주기 도표](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)를 필요할 때마다 활용하면 좋습니다. 아래 목록에서 자주 사용되는 생명주기 메서드를 **진하게** 표시했습니다. 나머지 것들은 상대적으로 자주 사용되지 않습니다.

#### 마운트 {#mounting}

아래 메서드들은 컴포넌트의 인스턴스가 생성되어 DOM 상에 삽입될 때에 순서대로 호출됩니다.

- [**`constructor()`**](#constructor)
- [`static getDerivedStateFromProps()`](#static-getderivedstatefromprops)
- [**`render()`**](#render)
- [**`componentDidMount()`**](#componentdidmount)

> 주의
>
> 아래 메서드는 기존에 사용되었지만 이제는 [사용하면 안 됩니다](/blog/2018/03/27/update-on-async-rendering.html).
>
>- [`UNSAFE_componentWillMount()`](#unsafe_componentwillmount)

#### 업데이트 {#updating}

props 또는 state가 변경되면 갱신이 발생합니다. 아래 메서드들은 컴포넌트가 다시 렌더링될 때 순서대로 호출됩니다.

- [`static getDerivedStateFromProps()`](#static-getderivedstatefromprops)
- [`shouldComponentUpdate()`](#shouldcomponentupdate)
- [**`render()`**](#render)
- [`getSnapshotBeforeUpdate()`](#getsnapshotbeforeupdate)
- [**`componentDidUpdate()`**](#componentdidupdate)

> 주의
>
> 아래 메서드는 기존에 사용되었지만 이제는 [사용하면 안 됩니다](/blog/2018/03/27/update-on-async-rendering.html).
>
>- [`UNSAFE_componentWillUpdate()`](#unsafe_componentwillupdate)
>- [`UNSAFE_componentWillReceiveProps()`](#unsafe_componentwillreceiveprops)

#### 마운트 해제 {#unmounting}

아래 메서드는 컴포넌트가 DOM 상에서 제거될 때에 호출됩니다.

- [**`componentWillUnmount()`**](#componentwillunmount)

#### 오류 처리 {#error-handling}

아래 메서드들은 자식 컴포넌트를 렌더링하거나, 자식 컴포넌트가 생명주기 메서드를 호출하거나, 또는 자식 컴포넌트가 생성자 메서드를 호출하는 과정에서 오류가 발생했을 때에 호출됩니다.

- [`static getDerivedStateFromError()`](#static-getderivedstatefromerror)
- [`componentDidCatch()`](#componentdidcatch)

### 기타 API {#other-apis}

이 외에도 컴포넌트는 몇몇 API를 제공합니다.

  - [`setState()`](#setstate)
  - [`forceUpdate()`](#forceupdate)

### class 프로퍼티 {#class-properties}

  - [`defaultProps`](#defaultprops)
  - [`displayName`](#displayname)

### 인스턴스 프로퍼티 {#instance-properties}

  - [`props`](#props)
  - [`state`](#state)

* * *

## 참고서 {#reference}

### 자주 사용되는 생명주기 메서드 {#commonly-used-lifecycle-methods}

이 섹션에서 다루는 메서드들을 사용하면 React 컴포넌트를 만들 때에 마주치는 대부분의 경우를 해결할 수 있습니다. [이 생명주기 도표](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)를 시각 자료로 활용하면 좋습니다.

### `render()` {#render}

```javascript
render()
```

`render()` 메서드는 클래스 컴포넌트에서 반드시 구현돼야하는 유일한 메서드입니다.

이 메서드가 호출되면 `this.props`와 `this.state`의 값을 활용하여 아래의 것 중 하나를 반환해야 합니다.

- **React 엘리먼트.** 보통 [JSX](/docs/introducing-jsx.html)를 사용하여 생성됩니다. 예를 들어, `<div />`와 `<MyComponent />`는 React가 DOM 노드 또는 사용자가 정의한 컴포넌트를 만들도록 지시하는 React 엘리먼트입니다.
- **배열과 Fragment.** `render()`를 통하여 여러 개의 엘리먼트를 반환합니다. 자세한 정보는 [Fragments](/docs/fragments.html) 문서를 통하여 확인할 수 있습니다.
- **Portal.** 별도의 DOM 하위 트리에 자식 엘리먼트를 렌더링합니다. 자세한 정보는 [Portals](/docs/portals.html)에서 확인할 수 있습니다.
- **문자열과 숫자.** 이 값들은 DOM 상에 텍스트 노드로서 렌더링됩니다.
- **Boolean 또는 null.** 아무것도 렌더링하지 않습니다. (대부분의 경우 `return test && <Child />` 패턴을 지원하는 데에 사용되며, 여기서 `test`는 boolean 값입니다.)

`render()` 함수는 순수해야 합니다. 즉, 컴포넌트의 state를 변경하지 않고, 호출될 때마다 동일한 결과를 반환해야 하며, 브라우저와 직접적으로 상호작용을 하지 않습니다.

브라우저와 상호작용하는 작업이 필요하다면, 해당 작업을 `componentDidMount()`이나 다른 생명주기 메서드 내에서 수행하세요. `render()`를 순수하게 유지하여야 컴포넌트의 동작을 이해하기 쉽습니다.

> 주의
>
> [`shouldComponentUpdate()`](#shouldcomponentupdate)가 false를 반환하면 `render()`는 호출되지 않습니다.

* * *

### `constructor()` {#constructor}

```javascript
constructor(props)
```

**메서드를 바인딩하거나 state를 초기화하는 작업이 없다면, 해당 React 컴포넌트에는 생성자를 구현하지 않아도 됩니다.**

React 컴포넌트의 생성자는 해당 컴포넌트가 마운트되기 전에 호출됩니다. `React.Component`를 상속한 컴포넌트의 생성자를 구현할 때에는 다른 구문에 앞서 `super(props)`를 호출해야 합니다. 그렇지 않으면 `this.props`가 생성자 내에서 정의되지 않아 버그로 이어질 수 있습니다.

React에서 생성자는 보통 아래의 두 가지 목적을 위하여 사용됩니다:

* `this.state`에 객체를 할당하여 [지역 state](/docs/state-and-lifecycle.html)를 초기화
* 인스턴스에 [이벤트 처리](/docs/handling-events.html) 메서드를 바인딩

`constructor()` 내부에서 **`setState()`를 호출하면 안 됩니다.** 컴포넌트에 지역 state가 필요하다면 생성자 내에서 `this.state`에 초기 state 값을 할당하면 됩니다.

```js
constructor(props) {
  super(props);
  // 여기서 this.setState()를 호출하면 안 됩니다!
  this.state = { counter: 0 };
  this.handleClick = this.handleClick.bind(this);
}
```

생성자는 `this.state`를 직접 할당할 수 있는 유일한 곳입니다. 그 외의 메서드에서는 `this.setState()`를 사용해야 합니다.

생성자 내에서는 부수 효과를 발생시키거나 구독 작업(subscription)을 수행하면 안 됩니다. 해당 경우에는 `componentDidMount()`를 대신 사용하세요.

> 주의
>
> **state에 props를 복사하면 안 됩니다! 가장 흔히 범하는 실수 중 하나입니다.**
>
>```js
>constructor(props) {
>  super(props);
>  // 이렇게 하지 마세요!
>  this.state = { color: props.color };
>}
>```
>
> 이것은 불필요한 작업이며(`this.props.color`를 직접 사용하면 됩니다), 버그를 발생시킵니다(`color` props의 값이 변하더라도 state에 반영되지 않습니다).
>
> **props의 갱신을 의도적으로 무시해야 할 때만 이와 같은 패턴을 사용하기 바랍니다.** 이 경우, 해당 props의 이름을 `initialColor` 또는 `defaultColor` 등으로 변경하는 편이 자연스럽습니다. 그러면 이후 필요에 따라 컴포넌트가 [`key`를 변경](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key)하여 초기 state를 "재설정"하도록 강제할 수 있습니다.
>
> props의 값에 의존하는 state가 필요할 때 어떻게 해야 하는지에 대하여 알고 싶다면, 우리가 작성한 [state로부터 값을 가져오지 않는 법에 대한 블로그 글](/blog/2018/06/07/you-probably-dont-need-derived-state.html)을 읽어보세요.

* * *

### `componentDidMount()` {#componentdidmount}

```javascript
componentDidMount()
```

`componentDidMount()`는 컴포넌트가 마운트된 직후, 즉 트리에 삽입된 직후에 호출됩니다. DOM 노드가 있어야 하는 초기화 작업은 이 메서드에서 이루어지면 됩니다. 외부에서 데이터를 불러와야 한다면, 네트워크 요청을 보내기 적절한 위치입니다.

이 메서드는 데이터 구독을 설정하기 좋은 위치입니다. 데이터 구독이 이루어졌다면, `componentWillUnmount()`에서 구독 해제 작업을 반드시 수행하기 바랍니다.

`componentDidMount()`에서 **즉시 `setState()`를 호출하는 경우도** 있습니다. 이로 인하여 추가적인 렌더링이 발생하지만, 브라우저가 화면을 갱신하기 전에 이루어질 것입니다. 이 경우 `render()`가 두 번 호출되지만, 사용자는 그 중간 과정을 볼 수 없을 것입니다. 이런 사용 방식은 성능 문제로 이어지기 쉬우므로 주의가 필요합니다. 대부분의 경우, 앞의 방식을 대신하여 `constructor()` 메서드에서 초기 state를 할당할 수 있습니다. 하지만 모달(Modal) 또는 툴팁과 같이 렌더링에 앞서 DOM 노드의 크기나 위치를 먼저 측정해야 하는 경우 이러한 방식이 필요할 수 있습니다.

* * *

### `componentDidUpdate()` {#componentdidupdate}

```javascript
componentDidUpdate(prevProps, prevState, snapshot)
```

`componentDidUpdate()`는 갱신이 일어난 직후에 호출됩니다. 이 메서드는 최초 렌더링에서는 호출되지 않습니다.

컴포넌트가 갱신되었을 때 DOM을 조작하기 위하여 이 메서드를 활용하면 좋습니다. 또한, 이전과 현재의 props를 비교하여 네트워크 요청을 보내는 작업도 이 메서드에서 이루어지면 됩니다 (가령, props가 변하지 않았다면 네트워크 요청을 보낼 필요가 없습니다).

```js
componentDidUpdate(prevProps) {
  // 전형적인 사용 사례 (props 비교를 잊지 마세요)
  if (this.props.userID !== prevProps.userID) {
    this.fetchData(this.props.userID);
  }
}
```

`componentDidUpdate()`에서 **`setState()`를 즉시 호출할 수도 있지만,** 위의 예시처럼 **조건문으로 감싸지** 않으면 무한 반복이 발생할 수 있다는 점에 주의하세요. 또한 추가적인 렌더링을 유발하여, 비록 사용자는 눈치채지 못할지라도 컴포넌트 성능에 영향을 미칠 수 있습니다. 상위에서 내려온 prop을 그대로 state에 저장하는 것은 좋지 않으며, 그 대신 prop을 직접 사용하는 것이 좋습니다. 이와 관련된 자세한 정보는 [props를 state에 복사하는 것이 버그를 유발하는 이유](/blog/2018/06/07/you-probably-dont-need-derived-state.html)에서 확인할 수 있습니다.

컴포넌트에서 `getSnapshotBeforeUpdate()`를 구현한다면, 해당 메서드가 반환하는 값은 `componentDidUpdate()`에 세 번째 "snapshot" 인자로 넘겨집니다. 반환값이 없다면 해당 인자는 undefined를 가집니다.

> 주의
>
> `componentDidUpdate()`는 [`shouldComponentUpdate()`](#shouldcomponentupdate)가 false를 반환하면 호출되지 않습니다.

* * *

### `componentWillUnmount()` {#componentwillunmount}

```javascript
componentWillUnmount()
```

`componentWillUnmount()`는 컴포넌트가 마운트 해제되어 제거되기 직전에 호출됩니다. 이 메서드 내에서 타이머 제거, 네트워크 요청 취소, `componentDidMount()` 내에서 생성된 구독 해제 등 필요한 모든 정리 작업을 수행하세요.

이제 컴포넌트는 다시 렌더링되지 않으므로, `componentWillUnmount()` 내에서 **`setState()`를 호출하면 안 됩니다.** 컴포넌트 인스턴스가 마운트 해제되고 나면, 절대로 다시 마운트되지 않습니다.

* * *

### 잘 사용하지 않는 생명주기 메서드 {#rarely-used-lifecycle-methods}

이 섹션에서 다루는 메서드들은 잘 사용되지 않습니다. 유용하게 사용되는 경우가 아주 가끔 있지만, 대부분의 컴포넌트에서는 필요하지 않습니다. 대부분의 메서드들은 [이 생명주기 도표](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)의 최상단에 위치하는 "덜 일반적인 라이프 사이클 표시" 체크박스를 클릭하면 확인할 수 있습니다.

### `shouldComponentUpdate()` {#shouldcomponentupdate}

```javascript
shouldComponentUpdate(nextProps, nextState)
```

`shouldComponentUpdate()`를 사용하면 현재 state 또는 props의 변화가 컴포넌트의 출력 결과에 영향을 미치는지 여부를 React가 알 수 있습니다. 기본 동작은 매 state 변화마다 다시 렌더링을 수행하는 것이며, 대부분의 경우 기본 동작에 따라야 합니다.

`shouldComponentUpdate()`는 props 또는 state가 새로운 값으로 갱신되어서 렌더링이 발생하기 직전에 호출됩니다. 기본값은 `true`입니다. 이 메서드는 초기 렌더링 또는 `forceUpdate()`가 사용될 때에는 호출되지 않습니다.

이 메서드는 오직 **[성능 최적화](/docs/optimizing-performance.html)**만을 위한 것입니다. 렌더링을 방지하는 목적으로 사용할 경우 버그로 이어질 수 있습니다. `shouldComponentUpdate()`의 내용을 직접 작성하는 대신에 [`PureComponent`](/docs/react-api.html#reactpurecomponent)를 사용하는 것이 좋습니다. `PureComponent`는 props와 state에 대하여 얕은 비교를 수행하고, 해야 할 갱신 작업을 건너뛸 확률을 낮춥니다.

이 메서드를 직접 작성할 자신이 있다면, `this.props`와 `nextProps`, 그리고 `this.state`와 `nextState`를 비교한 뒤 `false`를 반환하는 것으로 React가 갱신 작업을 건너뛰게 만들 수 있습니다. 여기서 `false`를 반환하는 것이 자식 컴포넌트들이 각자가 가진 state의 변화에 따라 다시 렌더링을 수행하는 것을 막는 것은 아니라는 점에 주의하시길 바랍니다.

`shouldComponentUpdate()` 내에서 깊은 동일성 검사를 수행하거나 `JSON.stringify()`를 사용하는 것을 권하지 않습니다. 아주 비효율적이며 성능을 떨어트릴 수 있습니다.

현재, `shouldComponentUpdate()`가 `false`를 반환할 경우 [`UNSAFE_componentWillUpdate()`](#unsafe_componentwillupdate), [`render()`](#render), 그리고 [`componentDidUpdate()`](#componentdidupdate)는 호출되지 않습니다. 나중에는 `shouldComponentUpdate()`를 엄격한 지시자가 아닌 힌트로서 다루게 될 것이고, `false`의 반환을 반환하더라도 컴포넌트가 계속해서 다시 렌더링을 수행할 것입니다.

* * *

### `static getDerivedStateFromProps()` {#static-getderivedstatefromprops}

```js
static getDerivedStateFromProps(props, state)
```

`getDerivedStateFromProps`는 최초 마운트 시와 갱신 시 모두에서 `render` 메서드를 호출하기 직전에 호출됩니다. state를 갱신하기 위한 객체를 반환하거나, `null`을 반환하여 아무 것도 갱신하지 않을 수 있습니다.

이 메서드는 시간이 흐름에 따라 변하는 props에 state가 의존하는 [아주 드문 사용례](/blog/2018/06/07/you-probably-dont-need-derived-state.html#when-to-use-derived-state)를 위하여 존재합니다. 예를 들어, 무엇을 움직이도록 만들지 결정하기 위하여 이전과 현재의 자식 엘리먼트를 비교하는 `<Transition>`와 같은 컴포넌트를 구현할 때에 편리하게 사용할 수 있습니다.

state를 끌어오면 코드가 장황해지고, 이로 인하여 컴포넌트를 이해하기 어려워집니다. [보다 간단한 다른 대안들에 익숙해지는 것을 권장합니다.](/blog/2018/06/07/you-probably-dont-need-derived-state.html)

* props 변화에 대응한 **부수 효과를 발생**시켜야 한다면 (예를 들어, 데이터 가져오기 또는 애니메이션), [`componentDidUpdate`](#componentdidupdate) 생명주기를 대신해서 사용하세요.

* **props가 변화했을 때에만 일부 데이터를 다시 계산** 하고 싶다면, [Memoization Helper](/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization)를 대신해서 사용하세요.

* **props가 변화할 때에 일부 state를 재설정** 하고 싶다면, [완전 제어 컴포넌트](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) 또는 [`key`를 사용하는 완전 비제어 컴포넌트](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key)로 만들어서 사용하세요.

이 메서드는 컴포넌트 인스턴스에 접근할 수 없습니다. 인스턴스 접근이 필요하다면, class 정의 외부에서 컴포넌트의 props와 state에 대한 순수 함수를 추출하여 `getDerivedStateFromProps()`와 다른 클래스 메서드 간에 코드를 공유 및 재사용할 수 있습니다.

이 메서드는 이유와 상관없이 렌더링 때마다 *매번* 실행되므로 주의하세요. 이는 `UNSAFE_componentWillReceiveProps`와는 다른데, 이 메서드의 경우 부모 컴포넌트가 다시 렌더링을 발생시켰을 때에만 실행되고, 해당 컴포넌트 내에서 지역적인 `setState`가 발생한 경우에는 실행되지 않습니다.

* * *

### `getSnapshotBeforeUpdate()` {#getsnapshotbeforeupdate}

```javascript
getSnapshotBeforeUpdate(prevProps, prevState)
```

`getSnapshotBeforeUpdate()`는 가장 마지막으로 렌더링된 결과가 DOM 등에 반영되었을 때에 호출됩니다. 이 메서드를 사용하면 컴포넌트가 DOM으로부터 스크롤 위치 등과 같은 정보를 이후 변경되기 전에 얻을 수 있습니다. 이 생명주기가 반환하는 값은 `componentDidUpdate()`에 인자로 전달됩니다.

이 메서드에 대한 사용례는 흔하지 않지만, 채팅 화면처럼 스크롤 위치를 따로 처리하는 작업이 필요한 UI 등을 생각해볼 수 있습니다.

스냅샷 값을 반환하거나 `null`을 반환합니다.

사용하는 예시는 아래와 같습니다.

`embed:react-component-reference/get-snapshot-before-update.js`

위의 예시에서는 `getSnapshotBeforeUpdate`의 `scrollHeight` 프로퍼티 값을 아는 것이 중요한데, `render`와 같은 "렌더링" 단계의 생명주기와 `getSnapshotBeforeUpdate`와 `componentDidUpdate`와 같은 "커밋" 단계의 생명주기 간에 지연 시간이 발생할 수 있기 때문입니다.

* * *

### Error Boundary {#error-boundaries}

[Error boundary](/docs/error-boundaries.html)는 자식 컴포넌트 트리 내의 자바스크립트 오류를 감지하고, 해당 오류를 기록하며, 충돌이 발생한 컴포넌트 트리를 대신하여 대체 UI를 표시하는 React 컴포넌트입니다. Error boundary의 하위 트리에 존재하는 렌더링 과정, 생명주기 메서드, 모든 생성자에 대하여 오류를 감지해냅니다.

클래스 컴포넌트에 `static getDerivedStateFromError()` 또는 `componentDidCatch()`를 정의할 경우 해당 컴포넌트는 Error boundary가 됩니다. 두 생명주기 내에서 state를 갱신하게 되면 하위 트리 내의 처리되지 않은 자바스크립트 오류를 발생시키고, 대체 UI를 표시합니다.

반드시 Error boundary는 예측하지 않은 예외를 처리하여 복구하는 경우에만 사용하기 바랍니다. **제어 흐름**을 조작하는 데에는 사용하지 마세요.

자세한 정보는 [*React 16에서 오류 처리하기*](/blog/2017/07/26/error-handling-in-react-16.html) 문서에서 확인할 수 있습니다.

> 주의
>
> Error boundary는 트리 내에서 자신보다 **하위에** 존재하는 컴포넌트에 대한 오류만을 감지해냅니다. 즉, Error boundary는 자기 자신에 대한 오류를 감지할 수 없습니다.

### `static getDerivedStateFromError()` {#static-getderivedstatefromerror}
```javascript
static getDerivedStateFromError(error)
```

이 생명주기 메서드는 하위의 자손 컴포넌트에서 오류가 발생했을 때 호출됩니다.
이 메서드는 매개변수로 오류를 전달받고, 갱신된 state 값을 반드시 반환해야 합니다.

```js{7-10,13-16}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // state를 갱신하여 다음 렌더링에서 대체 UI를 표시합니다.
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      // 별도로 작성한 대체 UI를 렌더링할 수도 있습니다.
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

> 주의
>
> `getDerivedStateFromError()`는 "render" 단계에서 호출되므로, 부수 효과를 발생시키면 안 됩니다. 해당 경우에는 `componentDidCatch()`를 대신 사용하세요.

* * *

### `componentDidCatch()` {#componentdidcatch}

```javascript
componentDidCatch(error, info)
```

이 생명주기 메서드는 자손 컴포넌트에서 오류가 발생했을 때에 호출되며, 2개의 매개변수를 전달받습니다.

1. `error` - 발생한 오류
2. `info` - [어떤 컴포넌트가 오류를 발생시켰는지에 대한 정보](/docs/error-boundaries.html#component-stack-traces)를 포함한 `componentStack` 키를 갖고 있는 객체

`componentDidCatch()`는 "커밋" 단계에서 호출되므로, 부수 효과를 발생시켜도 됩니다. 아래와 같이 오류 로그 기록 등을 위하여 사용하면 됩니다.

```js{12-19}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // state를 갱신하여 다음 렌더링에서 대체 UI를 표시합니다.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Example "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    logComponentStackToMyService(info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // 별도로 작성한 대체 UI를 렌더링할 수도 있습니다.
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

> 주의
>
> 오류 이벤트 내에서는 `setState()`의 호출을 통하여 `componentDidCatch()`로 구현된 대체 UI를 렌더링할 수 있습니다. 하지만 이런 방식은 나중 릴리즈에서는 사용할 수 없게 을 것입니다.
> 대체 UI 렌더링 제어를 하려면 `static getDerivedStateFromError()`를 대신 사용하세요.

* * *

### 레거시 생명주기 메서드 {#legacy-lifecycle-methods}

아래의 생명주기 메서드들은 "레거시"로 분류됩니다. 즉 여전히 작동하지만, 새로 작성하는 코드에서는 사용하지 않을 것을 권장합니다. 레거시 생명주기 메서드를 최신 문법으로 전환(migration)하는 방법에 대한 자세한 정보는 [이 블로그 문서](/blog/2018/03/27/update-on-async-rendering.html)에서 확인할 수 있습니다.

### `UNSAFE_componentWillMount()` {#unsafe_componentwillmount}

```javascript
UNSAFE_componentWillMount()
```

> 주의
>
> 이 생명주기 메서드의 기존 이름은 `componentWillMount`입니다. 이 이름은 버전 17까지 그대로 유지될 것입니다. [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles)를 사용하면 컴포넌트를 최신 문법으로 자동 갱신시킬 수 있습니다.

`UNSAFE_componentWillMount()`는 마운트가 발생하기 전에 호출됩니다. `render()`가 실행되기 전에 호출되므로, 이 메서드 내에서 `setState()`를 동기적으로 호출하더라도 추가적인 렌더링이 발생하지 않습니다. state를 초기화하는 경우라면, 보통은 `constructor()`를 사용하는 것이 좋습니다.

이 메서드 내에서 부수 효과를 발생시키거나 구독 작업(subscription)을 수행하면 안 됩니다. 해당 경우에는 `componentDidMount()`를 대신 사용하세요.

이 메서드는 서버 렌더링에서 호출되는 유일한 생명주기 메서드입니다.

* * *

### `UNSAFE_componentWillReceiveProps()` {#unsafe_componentwillreceiveprops}

```javascript
UNSAFE_componentWillReceiveProps(nextProps)
```

> 주의
>
> 이 생명주기 메서드의 기존 이름은 `componentWillReceiveProps`입니다. 이 이름은 버전 17까지 그대로 유지될 것입니다. [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles)를 사용하면 컴포넌트를 최신 문법으로 자동 갱신시킬 수 있습니다.

> 주의
>
> 이 생명주기 메서드를 사용하면 버그를 만들거나, 일관성을 해칠 수 있습니다.
>
> * props 변화에 대응한 **부수 효과를 발생**시켜야 한다면 (예를 들어, 데이터 가져오기 또는 애니메이션), [`componentDidUpdate`](#componentdidupdate) 생명주기를 대신해서 사용하세요.
> * **props가 변화할 때에 일부 데이터를 다시 계산**하기 위하여 `componentWillReceiveProps`를 사용하였다면, [Memoization Helper](/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization)를 대신해서 사용하세요.
> * **props가 변화할 때에 일부 state를 재설정**하기 위하여 `componentWillReceiveProps`를 사용하였다면, [완전 제어 컴포넌트](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) 또는 [`key`를 사용하는 완전 비제어 컴포넌트](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key)로 만들어서 사용하세요.
>
> 다른 사용 사례의 경우는 [가져온 state에 대하여 다룬 블로그 글에서 추천하는 방법을 따르세요](/blog/2018/06/07/you-probably-dont-need-derived-state.html).

`UNSAFE_componentWillReceiveProps()`는 마운트된 컴포넌트가 새로운 props를 전달받기 전에 호출됩니다. props 변화에 대응하여 state를 갱신해야 한다면(예를 들어, state를 재설정하기), `this.props`와 `nextProps`를 비교하고 이 메서드 내에서 `this.setState()`를 사용하여 state를 바꾸면 됩니다.

부모 컴포넌트가 해당 컴포넌트가 다시 렌더링하게 만든 경우, props가 변화하지 않았더라도 이 메서드가 호출된다는 점에 주의하세요. 변화가 발생했을 때만 메서드를 실행시키려면 반드시 props의 현재값과 다음값을 비교해야 합니다.

React는 [마운팅할 때](#mounting)에서는 `UNSAFE_componentWillReceiveProps()`를 호출하지 않으며, 초기 props를 가지지 않습니다. 이 메서드가 호출되는 경우는 컴포넌트의 props가 변화했을 때입니다. `this.setState()`를 호출하면, 대부분의 경우 `UNSAFE_componentWillReceiveProps()`를 발생시키지 않습니다.

* * *

### `UNSAFE_componentWillUpdate()` {#unsafe_componentwillupdate}

```javascript
UNSAFE_componentWillUpdate(nextProps, nextState)
```

> 주의
>
> 이 생명주기 메서드의 기존 이름은 `componentWillUpdate`입니다. 이 이름은 버전 17까지 그대로 유지될 것입니다. [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles)를 사용하면 컴포넌트를 최신 문법으로 자동 갱신시킬 수 있습니다.

`UNSAFE_componentWillUpdate()`는 새로운 props 또는 state가 전달되어서 렌더링이 이루어지기 전에 호출됩니다. 이 메서드 내에서 갱신이 이루어지기 전에 미리 준비할 수 있습니다. 이 메서드는 초기 렌더링에서는 호출되지 않습니다.

이 메서드 내에서는 `this.setState()`를 호출할 수 없다는 점에 주의하세요. 또한 React 컴포넌트가 갱신되도록 만드는 그 어떤 작업(예를 들어, Redux Action을 Dispatch하기)도 `UNSAFE_componentWillUpdate()`가 결과값을 반환하기 전에는 이루어지면 안 됩니다.

통상적으로 이 메서드는 `componentDidUpdate()`로 대체할 수 있습니다. 이 메서드 내에서 DOM에 대한 정보를 얻는다면(예를 들어, 스크롤 위치 저장하기), 해당 코드를 `getSnapshotBeforeUpdate()`로 이전하는 것이 가능합니다.

> Note
>
> `UNSAFE_componentWillUpdate()`는 [`shouldComponentUpdate()`](#shouldcomponentupdate)이 `false`를 반환한다면 호출되지 않습니다.

* * *

## 기타 API {#other-apis-1}

위에서 설명한 생명주기 메서드들과 달리 아래의 메서드들은 *사용자가* 컴포넌트 내에서 직접 호출할 수 있습니다.

단 2개의 메서드, `setState()`와 `forceUpdate()`만이 존재합니다.

### `setState()` {#setstate}

```javascript
setState(updater, [callback])
```

`setState()`는 컴포넌트 state의 변경 사항을 대기열에 집어넣고, React에게 해당 컴포넌트와 그 자식들이 갱신된 state를 사용하여 다시 렌더링되어야 한다고 알립니다. 이 메서드는 이벤트 핸들러와 서버 응답 등에 따라 UI를 갱신할 때에 가장 많이 사용하는 메서드입니다.

`setState()`는 컴포넌트를 갱신하는 데에 있어 즉각적인 명령이 아니라 *요청*이라고 생각하시기 바랍니다. 인지 성능(Perceived Performance)의 향상을 위하여 React는 이 메서드의 실행을 지연시키고 여러 컴포넌트를 한번에 갱신할 수도 있습니다. React는 state 변화가 즉시 적용되는 것을 보장하지 않습니다.

`setState()`는 컴포넌트를 항상 즉각적으로 갱신하지는 않습니다. 오히려 여러 변경 사항과 함께 일괄적으로 갱신하거나, 나중으로 미룰 수도 있습니다. 이로 인하여 `setState()`를 호출하자마자 `this.state`에 접근하는 것이 잠재적인 문제가 될 수 있습니다. 그 대신에 `componentDidUpdate` 또는 `setState`의 콜백(`setState(updater, callback)`)을 사용하세요. 둘 다 갱신이 적용된 뒤에 실행되는 것이 보장됩니다. 이전 state 값을 기준으로 state 값을 설정해야 한다면, 아래에 설명된 `updater` 인자에 대한 내용을 읽어보세요.

`shouldComponentUpdate()`가 `false`를 반환하지 않는다면 `setState()`는 항상 렌더링이 다시 발생하도록 만듭니다. 가변 객체의 사용으로 인하여 `shouldComponentUpdate()` 내에서 조건부 렌더링을 구현할 수 없다면, 새로운 state가 이전의 state와 다를 때에만 `setState()`를 호출하세요. 그래야 불필요하게 다시 렌더링이 발생하지 않습니다.

첫번째 인자 `updater`는 다음과 같은 형태를 가지는 함수입니다.

```javascript
(state, props) => stateChange
```

`state`는 변경 사항이 적용되는 시점에 컴포넌트가 가지는 state에 대한 참조입니다. `state`는 직접 변경하면 안 됩니다. 대신, 전달된 `state`와 `props`를 기반으로 새로운 객체를 만들어서 변경 사항을 표현해야 합니다. 예를 들어, `props.step`만큼 state의 어떤 값을 증가시키고 싶은 상황을 가정해봅시다.

```javascript
this.setState((state, props) => {
  return {counter: state.counter + props.step};
});
```

`updater` 함수로 전달된 `state`와 `props`는 최신값임이 보장됩니다. `updater`의 결과는 `state`에 얕게 병합됩니다.

`setState()`로 전달되는 두번째 매개변수는 `setState`의 실행이 완료되고 컴포넌트가 다시 렌더링된 뒤에 실행될 함수에 대한 콜백으로, 생략할 수 있습니다. 보통 이러한 방식의 실행에는 `componentDidUpdate()`의 사용을 권장합니다.

`setState()`에 전달하는 첫번째 인자로 아래와 같이 객체를 전달하는 것도 가능합니다.

```javascript
setState(stateChange[, callback])
```

이렇게 하면 `stateChange` 객체는 새로운 state에 얕게 병합됩니다. 예를 들어, 쇼핑 카트의 상품 수량(`quantity`)을 조정하려면 아래와 같이 작성하면 됩니다.

```javascript
this.setState({quantity: 2})
```

이러한 형태의 `setState()`도 마찬가지로 비동기적으로 수행되며, 같은 주기 동안 여러번 호출된다면 일괄적으로 처리될 수 있습니다. 예를 들어, 같은 주기 동안 상품 수량을 한번 이상 증가시키게 되면, 아래의 코드와 동일한 결과를 만들게 됩니다.

```javaScript
Object.assign(
  previousState,
  {quantity: state.quantity + 1},
  {quantity: state.quantity + 1},
  ...
)
```

`setState`의 연이은 호출은 같은 주기 내의 바로 직전 호출 결과를 덮어쓰고, 따라서 수량값이 한번만 증가될 것입니다. 다음 state의 값이 이전 state의 값에 기반한다면, 아래와 같이 `updater`의 함수 형태를 대신 사용하는 것이 좋습니다.

```js
this.setState((state) => {
  return {quantity: state.quantity + 1};
});
```

자세한 정보는 아래의 문서들에서 확인할 수 있습니다.

* [State와 생명주기 안내](/docs/state-and-lifecycle.html)
* [자세히 알아보기: `setState()` 호출은 언제, 그리고 왜 일괄 처리되는가?](https://stackoverflow.com/a/48610973/458193)
* [자세히 알아보기: `this.state`는 왜 즉시 갱신되지 않는가?](https://github.com/facebook/react/issues/11527#issuecomment-360199710)

* * *

### `forceUpdate()` {#forceupdate}

```javascript
component.forceUpdate(callback)
```

컴포넌트의 state 또는 props가 변경되면, 컴포넌트가 다시 렌더링되는 것이 기본 동작입니다. 어떤 컴포넌트의 `render()` 메서드가 다른 데이터값에 의존하는 경우, React로 하여금 `forceUpdate()`를 호출하여 렌더링을 다시 수행하도록 만들 수 있습니다.

`forceUpdate()`를 호출하면 컴포넌트의 `render()`가 호출되는데, 이때 `shouldComponentUpdate()`는 무시하고 건너뜁니다. 그러면 자식 컴포넌트들에 대하여 통상적인 생명주기 메서드가 실행되는데, 여기에는 개별 자식들의 `shouldComponentUpdate()`도 포함됩니다. React는 마크업이 변화했을 때에만 DOM을 갱신할 것입니다.

보통 `render()` 내에서는 `forceUpdate()`를 사용하지 말아야 하며, 오직 `this.props`와 `this.state`의 값만을 사용하여야 합니다.

* * *

## class 프로퍼티 {#class-properties-1}

### `defaultProps` {#defaultprops}

`defaultProps`는 컴포넌트 클래스 자체 내에서 프로퍼티로서 정의될 수 있고, 이를 통하여 해당 class의 기본 props 값을 설정할 수 있습니다. 아래 예시와 같이, `null`이 아닌 아직 정의되지 않은 `undefined`인 props를 다룰 때 사용됩니다.

```js
class CustomButton extends React.Component {
  // ...
}

CustomButton.defaultProps = {
  color: 'blue'
};
```

`props.color`에 값이 제공되지 않았다면, 기본값인 `'blue'`로 설정될 것입니다.

```js
  render() {
    return <CustomButton /> ; // props.color는  blue로 설정됩니다
  }
```

`props.color`에 `null` 값이 제공된다면, 해당 값은 `null`로 유지됩니다.

```js
  render() {
    return <CustomButton color={null} /> ; // props.color는 null으로 유지됩니다
  }
```

* * *

### `displayName` {#displayname}

`displayName` 문자열은 디버깅 메시지 표시에 사용됩니다. 대부분의 경우 이 값을 설정하지 않아도 되는데, 왜냐하면 해당 컴포넌트를 정의하는 함수 또는 class의 이름으로부터 추론되기 때문입니다. 디버깅을 위하여 다른 이름을 표시하거나 고차 컴포넌트 생성을 위하여 명시적으로 이 값을 설정하고 싶다면, [쉬운 디버깅을 위한 Display Name 래핑하기](/docs/higher-order-components.html#convention-wrap-the-display-name-for-easy-debugging)를 통하여 자세한 정보를 확인하세요.

* * *

## 인스턴스 프로퍼티 {#instance-properties-1}

### `props` {#props}

`this.props`는 해당 컴포넌트가 호출된 곳에서 정의한 props를 포함하고 있습니다. props에 대하여 더 알고 싶다면 [컴포넌트와 props](/docs/components-and-props.html) 문서를 확인하세요.

특히 `this.props.children`은 특별한 prop으로, 일반적인 태그가 아닌 JSX 표현으로 작성된 자식 태그로 정의되는 경우가 많습니다.

### `state` {#state}

state는 어떤 컴포넌트에만 한정하여 사용되는 데이터를 포함하며, 해당 데이터는 시간이 지남에 따라 변경될 수 있습니다. state는 사용자가 자유롭게 정의할 수 있으며, 일반적인 자바스크립트 객체이어야 합니다.

The state contains data specific to this component that may change over time. The state is user-defined, and it should be a plain JavaScript object.

어떤 값이 렌더링 또는 데이터 흐름 상에서 (예를 들어, 타이머의 ID) 사용되지 않는다면, 해당 값을 state에 넣지 않아도 됩니다. 그러한 값은 컴포넌트 인스턴스의 필드로 정의할 수 있습니다.

자세한 정보는 [State와 생명주기](/docs/state-and-lifecycle.html) 문서에서 확인할 수 있습니다.

`this.state`를 직접 변경하면 안 됩니다. 왜냐하면 이후 호출되는 `setState()`가 이전에 적용된 변경 사항을 덮어쓰기 때문입니다. `this.state`를 불변적(Immutable)인 데이터로 취급하세요.
