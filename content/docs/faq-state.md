---
id: faq-state
title: 컴포넌트 State
permalink: docs/faq-state.html
layout: docs
category: FAQ
---

### `setState`는 어떤 일을 하나요? {#what-does-setstate-do}

`setState()`는 `state` 객체의 변경사항을 대기열에 밀어 넣습니다. state가 변경되면, 컴포넌트는 변경사항을 다시 렌더링하여 반영합니다.

### `state`와 `props`의 차이점은 무엇인가요? {#what-is-the-difference-between-state-and-props}

[`props`](/docs/components-and-props.html) ("properties"의 줄임말) 와 [`state`](/docs/state-and-lifecycle.html) 는 일반 JavaScript 객체입니다. 두 객체 모두 렌더링 출력 결과에 영향을 주는 정보를 갖고 있는데, 한 가지 중요한 점에서 다릅니다. `props`는 (함수 매개변수처럼) 컴포넌트*에* 전달되는 반면 `state`는 (함수 안에 선언된 변수처럼) 컴포넌트 *안에서* 관리됩니다.

언제 `prop`와 `state`를 사용하는지를 더 알고 싶다면 아래 자료를 확인해보세요.
* [Props vs State](https://github.com/uberVU/react-guide/blob/master/props-vs-state.md)
* [ReactJS: Props vs. State](https://lucybain.com/blog/2016/react-state-vs-pros/)

### 왜 `setState`가 잘못된 값을 주는 걸까요? {#why-is-setstate-giving-me-the-wrong-value}

React에서 `this.props`와 `this.state`는 모두 *렌더링 된* 값을 나타냅니다. 예를 들면, 현재 화면에 보이는 것들이 있습니다.

`setState` 호출은 비동기적으로 이뤄집니다. 따라서 `setState`  호출 직후 새로운 값이 `this.state` 에 반영될 거라고 믿어서는 안 됩니다. 만약 현재 state에 기반하여 값을 계산해야 한다면 객체 대신 updater 함수를 전달하세요. (자세한 내용은 아래를 확인하세요.)

예시 코드는 예상대로 동작하지 *않을 것*입니다.

```jsx
incrementCount() {
  // Note: 이 코드는 예상대로 동작하지 *않을 것*입니다.
  this.setState({count: this.state.count + 1});
}

handleSomething() {
  // `this.state.count`가 0에서 시작한다고 해봅시다.
  this.incrementCount();
  this.incrementCount();
  this.incrementCount();
  // React가 컴포넌트를 다시 렌더링할 때 `this.state.count`는 3이 될 것 같은 예상과는 달리 1이 됩니다.

  // 이것은 `incrementCount()` 함수가 `this.state.count`에서 값을 읽어 오는데
  // React는 컴포넌트가 다시 렌더링 될 때까지 `this.state.count`를 업데이트하지 않기 때문입니다.
  // 따라서 `incrementCount()`는 `this.state.count`에서 연달아 0 값을 읽고 나서 마지막에 이 값을 1로 변경합니다.

  // 이 문제의 해결 방법은 아래에 설명되어 있습니다!
}
```

이 문제의 해결 방법은 아래에서 확인하세요.

### 어떻게 하면 현재 state에 의존하는 값으로 state를 업데이트할 수 있나요? {#how-do-i-update-state-with-values-that-depend-on-the-current-state}

`setState` 가 가장 최신의 state 값을 사용하도록 보장하기 위해서는 `setState` 에 객체 대신 함수를 전달하세요.

### `setState`에 객체를 전달하는 것과 함수를 전달하는 것은 어떤 차이가 있나요? {#what-is-the-difference-between-passing-an-object-or-a-function-in-setstate}

updater 함수를 전달하면 updater 함수 안에서 현재 state 값에 접근할 수 있게 됩니다. `setState` 호출은 일괄 처리되므로 연관된 업데이트를 묶어주고, 충돌 없이 하나씩 ~ 됨을 보장합니다. (?????????)

this lets you chain updates and ensure they build on top of each other instead of conflicting:

```jsx
incrementCount() {
  this.setState((state) => {
    // 중요: 값을 업데이트할 때 `this.state` 대신 `state`로부터 값을 읽어옵니다.
    return {count: state.count + 1}
  });
}

handleSomething() {
  // `this.state.count`가 0에서 시작한다고 해봅시다.
  this.incrementCount();
  this.incrementCount();
  this.incrementCount();

  // 지금 `this.state.count`의 값을 읽어 보면 이 값은 여전히 0일 것입니다.
  // 하지만 React가 컴포넌트를 다시 렌더링하게 되면 이 값은 3이 됩니다.
}
```

[setState에 대해 더 공부하기](/docs/react-component.html#setstate)

### 언제 `setState` 가 비동기적인가요? {#when-is-setstate-asynchronous}

현재 `setState` 는 이벤트 핸들러 안에서 비동기적입니다. 이 사실은 예를 들자면 `부모` 와 `자식` 이 click 이벤트 중 동시에 `setState` 를 호출한다면 `자식` 은 다시 렌더링 되지 않는다는 것을 보장합니다. 대신, React는 브라우저 이벤트가 끝날 시점에 state 업데이트를 "한 번에 몰아서 ?? (flushes)". 이것은 더 큰 앱에서 눈에 띄는 성능 향상을 끌어냅니다.

This is an implementation detail so avoid relying on it directly. In the future versions, React will batch updates by default in more cases.

### 왜 React는 `this.state` 를 동기적으로 업데이트하지 않나요? {#why-doesnt-react-update-thisstate-synchronously}

이전 섹션에서 설명했듯이, React는 다시 렌더링을 시작하기 전에, 모든 컴포넌트가 자신의 이벤트 핸들러 내에서 `setState()` 를 호출할 때까지 내부적으로 "기다리고 있습니다". 이를 통해 불필요한 렌더링을 방지하면서 성능을 향상시킵니다.

그러나 React는 왜 렌더링 없이 즉시 `this.state` 를 업데이트하지 않는지를 여전히 궁금해하실 수도 있습니다.

두 가지 중요한 이유가 존재합니다.

* `props` 와 `state` 사이의 일관성을 해칠 수 있으며 이것은 디버깅하기 매우 힘든 이슈를 일으킬 수 있기 때문입니다.
* This would make some of the new features we're working on impossible to implement.

이 [GitHub 코멘트](https://github.com/facebook/react/issues/11527#issuecomment-360199710)에서 더욱 자세한 예시를 확인할 수 있습니다.

### Redux 나 MobX 같은 상태('state') 관리 라이브러리를 사용해야 하나요? {#should-i-use-a-state-management-library-like-redux-or-mobx}

[아마도 그렇습니다.](https://redux.js.org/faq/general#when-should-i-use-redux)

추가적인 라이브러리를 사용하기 전에 먼저 React에 익숙해지는 게 좋습니다. React만으로도 꽤 복잡한 애플리케이션을 만들 수 있습니다. 
