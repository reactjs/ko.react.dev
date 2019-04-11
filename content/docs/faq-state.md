---
id: faq-state
title: 컴포넌트 State
permalink: docs/faq-state.html
layout: docs
category: FAQ
---

### `setState`는 무슨 일을 하나요? {#what-does-setstate-do}

`setState()`는 `state` 객체의 변경사항을 대기열에 밀어넣습니다. state가 변경되면, 컴포넌트는 다시 렌더링하여 변경사항을 반영합니다.

### `state`와 `props`의 차이점은 무엇인가요? {#what-is-the-difference-between-state-and-props}

[`props`](/docs/components-and-props.html) ("properties"의 줄임말) 와 [`state`](/docs/state-and-lifecycle.html) 는 순수 JavaScript 객체입니다. 두 객체 모두 렌더링 출력에 영향을 주는 정보를 지니고 있는데, 한 가지 중요한 방식에서 차이점을 보입니다. `props`는 (함수 매개변수처럼) 컴포넌트*에게* 전달되는 반면 `state`는 (함수 안에 선언된 변수처럼) 컴포넌트 *안에서* 관리됩니다.

언제 `prop`와 `state`를 사용하는지에 대해 더 알고싶다면 아래 자료를 확인해보세요.
* [Props vs State](https://github.com/uberVU/react-guide/blob/master/props-vs-state.md)
* [ReactJS: Props vs. State](https://lucybain.com/blog/2016/react-state-vs-pros/)

### 왜 `setState`가 잘못된 값을 주는 걸까요? {#why-is-setstate-giving-me-the-wrong-value}

React에서 `this.props`와 `this.state`는 모두 *렌더링된* 값을 나타냅니다. 예를 들면, 현재 화면에 보이는 것들이 있습니다.

`setState` 호출은 비동기적입니다. 따라서 `setState` 호출 직후 새로운 값이 `this.state` 에 반영되는 것이 보장되지 않습니다. 만약 현재 state에 해당하는 값을 계산해야 한다면 객체 대신 updater 함수를 넘기세요 (아래 자세한 내용이 있습니다).

예시 코드는 예상대로 동작하지 *않을 것입니다.*

```jsx
incrementCount() {
  // Note: this will *not* work as intended.
  this.setState({count: this.state.count + 1});
}

handleSomething() {
  // `this.state.count`가 0에서 시작한다고 해봅시다.
  this.incrementCount();
  this.incrementCount();
  this.incrementCount();
  // React가 컴포넌트를 다시 렌더링할 때, `this.state.count`는 3이 될 것 같지만 사실 1이 됩니다.

  // 이것은 위에 정의된 `incrementCount()` 함수가 `this.state.count`로부터 값을 읽어오지만
  // React는 컴포넌트가 다시 렌더링될 때까지 `this.state.count`를 업데이트 하지 않습니다.
  // 따라서 `incrementCount()`는 매번 `this.state.count`의 값을 0으로 읽은 뒤 값을 1로 설정합니다.

  // 이 문제의 해결 방법은 아래에 설명되어 있습니다!
}
```

어떻게 이 문제를 해결하는지 알아봅시다.

### 어떻게 하면 현재 state에 의존하는 값들로 state를 업데이트할 수 있나요? {#how-do-i-update-state-with-values-that-depend-on-the-current-state}

`setState` 에 객체 대신 함수를 전달하세요. 이를 통해 이 함수 호출이 (아래 나와 있는) 가장 최근에 업데이트된 state를 항상 사용한다는 사실을 보장할 수 있습니다.

### `setState`에 객체를 전달하는 것과 함수를 전달하는 것의 차이는 무엇인가요? {#what-is-the-difference-between-passing-an-object-or-a-function-in-setstate}

업데이트 함수를 전달하면 updater 안에서 현재 state 값에 접근 할 수 있게 됩니다. Since `setState` calls are batched, this lets you chain updates and ensure they build on top of each other instead of conflicting:

```jsx
incrementCount() {
  this.setState((state) => {
    // 중요: 업데이트를 할 때 `this.state` 대신 `state`를 읽습니다.
    return {count: state.count + 1}
  });
}

handleSomething() {
  // `this.state.count`가 0에서 시작한다고 해봅시다.
  this.incrementCount();
  this.incrementCount();
  this.incrementCount();

  // 이제 `this.state.count`를 읽으면 이 값은 여전히 0일 것입니다.
  // 하지만 React re-renders the 컴포넌트, it will be 3.
}
```

[setState에 대해 더 공부하기](/docs/react-component.html#setstate)

### 언제 `setState` 가 비동기인가요? {#when-is-setstate-asynchronous}

현재 `setState` 는 이벤트 핸들러 안에서 비동기적입니다.

This ensures, for example, that if both `Parent` and `Child` call `setState` during a click event, `Child` isn't re-rendered twice. Instead, React "flushes" the state updates at the end of the browser event. This results in significant performance improvements in larger apps.

This is an implementation detail so avoid relying on it directly. In the future versions, React will batch updates by default in more cases.

### 왜 React는`this.state` 를 동기적으로 업데이트하지 않나요? {#why-doesnt-react-update-thisstate-synchronously}

이전 섹션에서 설명했듯이, React는 다시 렌더링을 하기 전에 내부적으로 모든 컴포넌트가 자신의 이벤트 핸들러에서 `setState()` 를 호출하기 전까지 "기다립니다". 이를 통해 불필요한 리렌더링을 방지하면서 성능을 증가시킵니다.

그러나 왜 React가 리렌더링하지 않고 즉시 `this.state` 를 업데이트하지 않는지에 대해 여전히 궁금해하실 수도 있습니다.

두 가지 주된 원인이 존재합니다.

* `props` 와 `state` 사이의 일관성을 해칠 수 있으며 이것은 디버깅하기 매우 힘든 이슈를 일으킬 수 있기 때문입니다.
* This would make some of the new features we're working on impossible to implement.

This [GitHub 코멘트](https://github.com/facebook/react/issues/11527#issuecomment-360199710) dives deep into the specific examples.

### Redux나 MobX와 같은 상태('state') 관리 라이브러리를 사용해야 하나요? {#should-i-use-a-state-management-library-like-redux-or-mobx}

[아마도 그렇습니다.](https://redux.js.org/faq/general#when-should-i-use-redux)

추가적인 라이브러리를 사용하기전에 먼저 React에 익숙해지는 게 좋습니다. React만으로도 꽤 복잡한 애플리케이션을 만들 수 있습니다.
