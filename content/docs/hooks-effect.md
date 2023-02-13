---
id: hooks-state
title: Using the Effect Hook
permalink: docs/hooks-effect.html
next: hooks-rules.html
prev: hooks-state.html
---

<<<<<<< HEAD
*Hooks*는 React 16.8버전에 새로 추가되었습니다. Hook은 클래스 컴포넌트를 작성하지 않아도 state와 같은 특징들을 사용할 수 있습니다.
=======
> Try the new React documentation.
> 
> These new documentation pages teach modern React and include live examples:
>
> - [Synchronizing with Effects](https://beta.reactjs.org/learn/synchronizing-with-effects)
> - [You Might Not Need an Effect](https://beta.reactjs.org/learn/you-might-not-need-an-effect)
> - [`useEffect`](https://beta.reactjs.org/reference/react/useEffect)
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

*Hooks* are a new addition in React 16.8. They let you use state and other React features without writing a class.
>>>>>>> 47adefd30c46f486428d8231a68e639d62f02c9e

*Effect Hook*을 사용하면 함수 컴포넌트에서 side effect를 수행할 수 있습니다.

```js{1,6-10}
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // componentDidMount, componentDidUpdate와 같은 방식으로
  useEffect(() => {
    // 브라우저 API를 이용하여 문서 타이틀을 업데이트합니다.
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

위의 코드는 [이전 페이지의 카운터 예시](/docs/hooks-state.html)를 바탕으로 하지만, 문서의 타이틀을 클릭 횟수가 포함된 문장으로 표현할 수 있도록 새로운 기능을 더했습니다.

데이터 가져오기, 구독(subscription) 설정하기, 수동으로 React 컴포넌트의 DOM을 수정하는 것까지 이 모든 것이 side effects입니다. 이런 기능들(operations)을 side effect(혹은 effect)라 부르는 것이 익숙하지 않을 수도 있지만, 아마도 이전에 만들었던 컴포넌트에서 위의 기능들을 구현해보았을 것입니다.

>팁
>
>React의 class 생명주기 메서드에 친숙하다면, `useEffect` Hook을 `componentDidMount`와 `componentDidUpdate`, `componentWillUnmount`가 합쳐진 것으로 생각해도 좋습니다.

React 컴포넌트에는 일반적으로 두 종류의 side effects가 있습니다. 정리(clean-up)가 필요한 것과 그렇지 않은 것. 이 둘을 어떻게 구분해야 할지 자세하게 알아봅시다.

## 정리(Clean-up)를 이용하지 않는 Effects {#effects-without-cleanup}

**React가 DOM을 업데이트한 뒤 추가로 코드를 실행해야 하는 경우가 있습니다.** 네트워크 리퀘스트, DOM 수동 조작, 로깅 등은 정리(clean-up)가 필요 없는 경우들입니다. 이러한 예들은 실행 이후 신경 쓸 것이 없기 때문입니다. class와 hook이 이러한 side effects를 어떻게 다르게 구현하는지 비교해봅시다.

### Class를 사용하는 예시 {#example-using-classes}

React의 class 컴포넌트에서 `render` 메서드 그 자체는 side effect를 발생시키지 않습니다. 이때는 아직 이른 시기로서 이러한 effect를 수행하는 것은 React가 DOM을 업데이트하고 난 *이후*입니다.

React class에서 side effect를 `componentDidMount`와 `componentDidUpdate`에 두는 것이 바로 이 때문입니다. 예시로 돌아와서 React가 DOM을 바꾸고 난 뒤 문서 타이틀을 업데이트하는 React counter 클래스 컴포넌트를 봅시다.

```js{9-15}
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
  }

  componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`;
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    );
  }
}
```

위 코드에서 **class 안의 두 개의 생명주기 메서드에 같은 코드가 중복되는 것에 주의합시다**

이는 컴포넌트가 이제 막 마운트된 단계인지 아니면 업데이트되는 것인지에 상관없이 같은 side effect를 수행해야 하기 때문입니다. 개념적으로 렌더링 이후에는 항상 같은 코드가 수행되기를 바라는 것이죠. 하지만 React 클래스 컴포넌트는 그러한 메서드를 가지고 있지 않습니다. 함수를 별개의 메서드로 뽑아낸다고 해도 여전히 두 장소에서 함수를 불러내야 합니다.

이제 `useEffect` Hook에서 같은 기능을 어떻게 구현하는지 보겠습니다.

### Hook을 이용하는 예시 {#example-using-hooks}

아래의 코드는 위에서 이미 보았던 것이지만 이번에는 좀 더 자세히 살펴보겠습니다.

```js{1,6-8}
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

**`useEffect`가 하는 일은 무엇일까요?** useEffect Hook을 이용하여 우리는 React에게 컴포넌트가 렌더링 이후에 어떤 일을 수행해야하는 지를 말합니다. React는 우리가 넘긴 함수를 기억했다가(이 함수를 ‘effect’라고 부릅니다) DOM 업데이트를 수행한 이후에 불러낼 것입니다. 위의 경우에는 effect를 통해 문서 타이틀을 지정하지만, 이 외에도 데이터를 가져오거나 다른 명령형(imperative) API를 불러내는 일도 할 수 있습니다.

**`useEffect`를 컴포넌트 안에서 불러내는 이유는 무엇일까요?** `useEffect`를 컴포넌트 내부에 둠으로써 effect를 통해 `count` state 변수(또는 그 어떤 prop에도)에 접근할 수 있게 됩니다. 함수 범위 안에 존재하기 때문에 특별한 API 없이도 값을 얻을 수 있는 것입니다. Hook은 자바스크립트의 클로저를 이용하여 React에 한정된 API를 고안하는 것보다 자바스크립트가 이미 가지고 있는 방법을 이용하여 문제를 해결합니다.

**`useEffect`는 렌더링 이후에 매번 수행되는 걸까요?** 네, 기본적으로 첫번째 렌더링*과* 이후의 모든 업데이트에서 수행됩니다.(나중에 [effect를 필요에 맞게 수정하는 방법](#tip-optimizing-performance-by-skipping-effects)에 대해 다룰 것입니다.) 마운팅과 업데이트라는 방식으로 생각하는 대신 effect를 렌더링 이후에 발생하는 것으로 생각하는 것이 더 쉬울 것입니다. React는 effect가 수행되는 시점에 이미 DOM이 업데이트되었음을 보장합니다.

### 상세한 설명 {#detailed-explanation}

effect에 대해 좀 더 알아보았으니 아래의 코드들을 더 쉽게 이해할 수 있을 것입니다.

```js
function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });
}
```

`count` state 변수를 선언한 뒤 React에게 effect를 사용함을 말하고 있습니다. `useEffect` Hook에 함수를 전달하고 있는데 이 함수가 바로 effect입니다. 이 effect 내부에서 `document.title`이라는 브라우저 API를 이용하여 문서 타이틀을 지정합니다. 같은 함수 내부에 있기 때문에 최신의 `count`를 바로 얻을 수 있습니다. 컴포넌트를 렌더링할 때 React는 우리가 이용한 effect를 기억하였다가 DOM을 업데이트한 이후에 실행합니다. 이는 맨 첫 번째 렌더링은 물론 그 이후의 모든 렌더링에 똑같이 적용됩니다.

숙련된 자바스크립트 개발자라면 `useEffect`에 전달된 함수가 모든 렌더링에서 다르다는 것을 알아챘을지도 모릅니다. 이는 의도된 것으로서, `count` 값이 제대로 업데이트 되는지에 대한 걱정 없이 effect 내부에서 그 값을 읽을 수 있게 하는 부분이기도 합니다. 리렌더링하는 때마다 모두 이전과 _다른_ effect로 교체하여 전달합니다. 이 점이 렌더링의 결과의 한 부분이 되게 만드는 점인데, 각각의 effect는 특정한 렌더링에 속합니다. [이 페이지의 뒷부분](#explanation-why-effects-run-on-each-update)에서 이것이 왜 유용한지에 대해서 더 자세히 다룰 것입니다.

>팁
>
>`componentDidMount` 혹은 `componentDidUpdate`와는 달리 `useEffect`에서 사용되는 effect는 브라우저가 화면을 업데이트하는 것을 차단하지 않습니다. 이를 통해 애플리케이션의 반응성을 향상해줍니다. 대부분의 effect는 동기적으로 실행될 필요가 없습니다. 흔하지는 않지만 (레이아웃의 측정과 같은) 동기적 실행이 필요한 경우에는 `useEffect`와 동일한 API를 사용하는 [`useLayoutEffect`](/docs/hooks-reference.html#uselayouteffect)라는 별도의 Hook이 존재합니다.

## 정리(clean-up)를 이용하는 Effects {#effects-with-cleanup}

위에서 정리(clean-up)가 필요하지 않은 side effect를 보았지만, 정리(clean-up)가 필요한 effect도 있습니다. 외부 데이터에 **구독(subscription)을 설정해야 하는 경우**를 생각해보겠습니다. 이런 경우에 메모리 누수가 발생하지 않도록 정리(clean-up)하는 것은 매우 중요합니다. class와 Hook을 사용하는 두 경우를 비교해보겠습니다.

### Class를 사용하는 예시 {#example-using-classes-1}

React class에서는 흔히 `componentDidMount`에 구독(subscription)을 설정한 뒤 `componentWillUnmount`에서 이를 정리(clean-up)합니다. 친구의 온라인 상태를 구독할 수 있는 ChatAPI 모듈의 예를 들어보겠습니다. 다음은 class를 이용하여 상태를 구독(subscribe)하고 보여주는 코드입니다.

```js{8-26}
class FriendStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOnline: null };
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  handleStatusChange(status) {
    this.setState({
      isOnline: status.isOnline
    });
  }

  render() {
    if (this.state.isOnline === null) {
      return 'Loading...';
    }
    return this.state.isOnline ? 'Online' : 'Offline';
  }
}
```

`componentDidMount`와 `componentWillUnmount`가 어떻게 대칭을 이루고 있는지를 봅시다. 두 개의 메서드 내에 개념상 똑같은 effect에 대한 코드가 있음에도 불구하고 생명주기 메서드는 이를 분리하게 만듭니다.

>주의
>
>눈썰미가 좋은 독자들은 이 예시가 완전하기 위해서는 `componentDidUpdate`가 필요하다는 것을 눈치챘을 것입니다. 이에 대해서는 [다음 섹션](#explanation-why-effects-run-on-each-update)에서 다룰 것입니다.

### Hook을 이용하는 예시 {#example-using-hooks-1}

이제 이 컴포넌트를 Hook을 이용하여 구현해봅시다.

정리(clean-up)의 실행을 위해 별개의 effect가 필요하다고 생각할 수도 있습니다. 하지만 구독(subscription)의 추가와 제거를 위한 코드는 결합도가 높기 때문에 useEffect는 이를 함께 다루도록 고안되었습니다. effect가 함수를 반환하면 React는 그 함수를 정리가 필요한 때에 실행시킬 것입니다.

```js{6-16}
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    // effect 이후에 어떻게 정리(clean-up)할 것인지 표시합니다.
    return function cleanup() {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

**effect에서 함수를 반환하는 이유는 무엇일까요?** 이는 effect를 위한 추가적인 정리(clean-up) 메커니즘입니다. 모든 effect는 정리를 위한 함수를 반환할 수 있습니다. 이 점이 구독(subscription)의 추가와 제거를 위한 로직을 가까이 묶어둘 수 있게 합니다. 구독(subscription)의 추가와 제거가 모두 하나의 effect를 구성하는 것입니다.

**React가 effect를 정리(clean-up)하는 시점은 정확히 언제일까요?** React는 컴포넌트가 마운트 해제되는 때에 정리(clean-up)를 실행합니다. 하지만 위의 예시에서 보았듯이 effect는 한번이 아니라 렌더링이 실행되는 때마다 실행됩니다. React가 다음 차례의 effect를 실행하기 전에 이전의 렌더링에서 파생된 effect 또한 정리하는 이유가 바로 이 때문입니다. 이것이 [버그를 방지하는 데에 어떻게 도움이 되는지](#explanation-why-effects-run-on-each-update) 그리고 [성능 저하 문제가 발생할 경우 effect를 건너뛰는 방법](#tip-optimizing-performance-by-skipping-effects)에 대해서 이다음으로 논의해봅시다.

>주의
>
>effect에서 반드시 유명함수(named function)를 반환해야 하는 것은 아닙니다. 목적을 분명히 하기 위해 `정리(clean-up)`라고 부르고 있지만 화살표 함수를 반환하거나 다른 이름으로 불러도 무방합니다.

## 요약 {#recap}

`useEffect`가 컴포넌트의 렌더링 이후에 다양한 side effects를 표현할 수 있음을 위에서 배웠습니다. effect에 정리(clean-up)가 필요한 경우에는 함수를 반환합니다.

```js
  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
```

정리(clean-up)가 필요없는 경우에는 어떤 것도 반환하지 않습니다.

```js
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });
```

이처럼 effect Hook은 두 가지 경우를 한 개의 API로 통합합니다.

-------------

**effect hook이 어떻게 작동하는지에 대해 충분히 이해했거나, 내용이 이해하기 어렵다고 생각된다면 [다음 페이지의 Hook의 규칙](/docs/hooks-rules.html)로 넘어가도 좋습니다.**

-------------

## effect를 이용하는 팁{#tips-for-using-effects}

이제 숙련된 React 사용자들이라면 보다 궁금해할 `useEffect`에 대해 좀 더 깊이 알아보겠습니다. 이 부분은 지금 바로 읽어야 하는 것은 아니며, 언제라도 effect hook의 자세한 이해가 필요할 때 돌아와서 읽어도 좋습니다.

### 팁: 관심사를 구분하려고 한다면 Multiple Effect를 사용합니다{#tip-use-multiple-effects-to-separate-concerns}

Hook이 [탄생한 동기](/docs/hooks-intro.html#complex-components-become-hard-to-understand)가 된 문제 중의 하나가 생명주기 class 메서드가 관련이 없는 로직들은 모아놓고, 관련이 있는 로직들은 여러 개의 메서드에 나누어 놓는 경우가 자주 있다는 것입니다. 이전의 예시에서도 보았던 카운터와 친구의 상태 지표 로직을 결합한 컴포넌트를 보겠습니다.

```js
class FriendStatusWithCounter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0, isOnline: null };
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`;
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  handleStatusChange(status) {
    this.setState({
      isOnline: status.isOnline
    });
  }
  // ...
```

`document.title`을 설정하는 로직이 `componentDidMount`와 `componentDidUpdate`에 나누어져 있습니다. 구독(subscription)로직 또한 `componentDidMount`와 `componentWillUnmount`에 나누어져 있네요. `componentDidMount`가 두 가지의 작업을 위한 코드를 모두 가지고 있습니다.

Hook을 이용하여 이 문제를 어떻게 해결할 수 있을까요? [*State* Hook을 여러 번 사용할 수 있는 것](/docs/hooks-state.html#tip-using-multiple-state-variables)처럼 effect 또한 여러 번 사용할 수 있습니다. Effect를 이용하여 서로 관련이 없는 로직들을 갈라놓을 수 있습니다.

```js{3,8}
function FriendStatusWithCounter(props) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  const [isOnline, setIsOnline] = useState(null);
  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
  // ...
}
```

Hook을 이용하면 생명주기 메서드에 따라서가 아니라 **코드가 무엇을 하는지에 따라** 나눌 수가 있습니다. React는 컴포넌트에 사용된 *모든* effect를 지정된 순서에 맞춰 적용합니다.

### 설명: effect가 업데이트 시마다 실행되는 이유 {#explanation-why-effects-run-on-each-update}

class에 익숙하다면 왜 effect 정리(clean-up)가 마운트 해제되는 때에 한번만이 아니라 모든 리렌더링 시에 실행되는지가 궁금할 것입니다. 이러한 디자인이 버그가 적은 컴포넌트를 만드는 데에 어떻게 도움이 되는지 다음의 예시를 통해 알아봅시다.

[이 페이지의 위](#example-using-classes-1)에서 봤던 친구가 온라인인지 아닌지 표시하는 `FriendStatus` 컴포넌트 예시를 생각해봅시다. class는 `this.props`로부터 `friend.id`를 읽어내고 컴포넌트가 마운트된 이후에 친구의 상태를 구독하며 컴포넌트가 마운트를 해제할 때에 구독을 해지합니다.

```js
  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }
```

**그런데 컴포넌트가 화면에 표시되어있는 동안 `friend` prop이 변한다면** 무슨 일이 일어날까요? 컴포넌트는 다른 친구의 온라인 상태를 계속 표시할 것입니다. 버그인 거죠. 또한 마운트 해제가 일어날 동안에는 구독 해지 호출이 다른 친구 ID를 사용하여 메모리 누수나 충돌이 발생할 수도 있습니다.

클래스 컴포넌트에서는 이런 경우들을 다루기 위해 `componentDidUpdate`를 사용합니다.

```js{8-19}
  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentDidUpdate(prevProps) {
    // 이전 friend.id에서 구독을 해지합니다.
    ChatAPI.unsubscribeFromFriendStatus(
      prevProps.friend.id,
      this.handleStatusChange
    );
    // 다음 friend.id를 구독합니다.
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }
```

React 애플리케이션의 흔한 버그 중의 하나가 `componentDidUpdate`를 제대로 다루지 않는 것입니다.

이번에는 Hook을 사용하는 컴포넌트를 생각해봅시다.

```js
function FriendStatus(props) {
  // ...
  useEffect(() => {
    // ...
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });
```

이 경우에는 버그에 시달리지 않습니다.(달리 바꾼 것도 없는데 말이죠.)

`useEffect`가 *기본적으로* 업데이트를 다루기 때문에 더는 업데이트를 위한 특별한 코드가 필요 없습니다. 다음의 effect를 적용하기 전에 이전의 effect는 정리(clean-up)합니다. 구독과 구독 해지 호출을 반복해서 만들어내는 컴포넌트를 통해 이를 가시화해봅시다.

```js
// { friend: { id: 100 } } state을 사용하여 마운트합니다.
ChatAPI.subscribeToFriendStatus(100, handleStatusChange);     // 첫번째 effect가 작동합니다.

// { friend: { id: 200 } } state로 업데이트합니다.
ChatAPI.unsubscribeFromFriendStatus(100, handleStatusChange); // 이전의 effect를 정리(clean-up)합니다.
ChatAPI.subscribeToFriendStatus(200, handleStatusChange);     // 다음 effect가 작동합니다.

// { friend: { id: 300 } } state로 업데이트합니다.
ChatAPI.unsubscribeFromFriendStatus(200, handleStatusChange); // 이전의 effect를 정리(clean-up)합니다.
ChatAPI.subscribeToFriendStatus(300, handleStatusChange);     // 다음 effect가 작동합니다.

// 마운트를 해제합니다.
ChatAPI.unsubscribeFromFriendStatus(300, handleStatusChange); // 마지막 effect를 정리(clean-up)합니다.
```

이러한 방식으로 동작하는 것이 일관성을 유지해주며 클래스 컴포넌트에서는 흔히 업데이트 로직을 빼먹으면서 발생할 수 있는 버그를 예방합니다.

### 팁: Effect를 건너뛰어 성능 최적화하기 {#tip-optimizing-performance-by-skipping-effects}

모든 렌더링 이후에 effect를 정리(clean-up)하거나 적용하는 것이 때때로 성능 저하를 발생시키는 경우도 있습니다. 클래스 컴포넌트의 경우에는 `componentDidUpdate`에서 `prevProps`나 `prevState`와의 비교를 통해 이러한 문제를 해결할 수 있습니다.

```js
componentDidUpdate(prevProps, prevState) {
  if (prevState.count !== this.state.count) {
    document.title = `You clicked ${this.state.count} times`;
  }
}
```

이러한 요구 조건은 흔하기 때문에 `useEffect` Hook API에 이미 내재하여 있습니다. 특정 값들이 리렌더링 시에 변경되지 않는다면 React로 하여금 effect를 *건너뛰도록* 할 수 있습니다. `useEffect`의 선택적 인수인 두 번째 인수로 배열을 넘기면 됩니다.

```js{3}
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]); // count가 바뀔 때만 effect를 재실행합니다.
```

위의 예시에서 우리는 `[count]`를 두 번째 인수로 넘깁니다. 이것이 의미하는 바는 다음과 같습니다. `count`가 `5`이고 컴포넌트가 리렌더링된 이후에도 여전히 `count`는 변함없이 `5`라면 React는 이전 렌더링 시의 값 `[5]`를 그다음 렌더링 때의 `[5]`와 비교합니다. 배열 내의 모든 값이 같기 때문에(`5 === 5`) React는 effect를 건너뛰게 됩니다. 이런 식으로 최적화가 가능합니다.

`count`가 `6`으로 업데이트된 뒤에 렌더링하면 React는 이전에 렌더링된 값 `[5]`를 그다음 렌더링 시의 `[6]`와 비교합니다. 이때 `5 !== 6` 이기 때문에 React는 effect를 재실행합니다. 배열 내에 여러 개의 값이 있다면 그중의 단 하나만 다를지라도 React는 effect를 재실행합니다.

이것은 정리(clean-up)를 사용하는 effect의 경우에도 동일하게 작용합니다.

```js{10}
useEffect(() => {
  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
  return () => {
    ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
  };
}, [props.friend.id]); // props.friend.id가 바뀔 때만 재구독합니다.
```

두 번째 인자는 빌드 시 변환에 의해 자동으로 추가될 수도 있습니다.

>주의
>
>이 최적화 방법을 사용한다면 배열이 **컴포넌트 범위 내에서 바뀌는 값들과 effect에 의해 사용되는 값들을 모두 포함하는 것**을 기억해주세요. 그렇지 않으면 현재 값이 아닌 이전의 렌더링 때의 값을 참고하게 됩니다. 이에 대해서는 [함수를 다루는 방법](/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies)과 [의존성 배열이 자주 바뀔 때는 어떻게 해야 하는가](/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often)에서 더 자세히 알아볼 수 있습니다.
>
>effect를 실행하고 이를 정리(clean-up)하는 과정을 (마운트와 마운트 해제 시에)딱 한 번씩만 실행하고 싶다면, 빈 배열(`[]`)을 두 번째 인수로 넘기면 됩니다. 이렇게 함으로써 React로 하여금 여러분의 effect가 prop이나 state의 *그 어떤* 값에도 의존하지 않으며 따라서 재실행되어야 할 필요가 없음을 알게 하는 것입니다. 이는 의존성 배열의 작동 방법을 그대로 따라서 사용하는 것일 뿐이며 특별한 방법인 것은 아닙니다.
>
>빈 배열(`[]`)을 넘기게 되면, effect 안의 prop과 state는 초깃값을 유지하게 됩니다. 빈 배열(`[]`)을 두 번째 인수로 넘기는 것이 기존에 사용하던 `componentDidMount`와 `componentWillUnmount` 모델에 더 가깝지만, effect의 잦은 재실행을 피할 수 있는 [더 나은](/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies) [해결방법](/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often)이 있습니다. 또한 React는 브라우저가 다 그려질 때까지 `useEffect`의 실행을 지연하기 때문에 추가적인 작업을 더하는 것이 큰 문제가 되지는 않습니다.
>
>[`exhaustive-deps`](https://github.com/facebook/react/issues/14920) 규칙을 [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) 패키지에 포함하는 것을 추천합니다. 이 패키지는 의존성이 바르지 않게 지정되었을 때 경고하고 수정하도록 알려줍니다.

## 다음 단계 {#next-steps}

여기까지 오느라 수고가 많으셨습니다. 긴 글이지만 끝까지 읽으면서 많은 궁금증이 해결되었기를 바랍니다. 지금까지 배운 State Hook과 Effect Hook을 결합하면 *많은 것*을 할 수 있습니다. class를 이용하는 대부분의 경우를 구현할 수 있습니다. 구현되지 않는 경우에는 [additional Hooks](/docs/hooks-reference.html)이 도움이 될 것입니다.

우리는 [동기](/docs/hooks-intro.html#motivation)에 서술되어있는 문제들을 Hook이 어떻게 해결할 수 있는지 알아가고 있습니다. 어떻게 effect의 정리(clean-up)가 `componentDidUpdate`와 `componentWillUnmount`에서의 중복을 피하고, 관련 있는 코드들을 한곳에 모이게 하며 버그를 줄일 수 있게 도와주는지 알아보았습니다. 또한 effect를 그 목적에 따라 어떻게 구분하는지도 보았습니다. 이는 클래스 컴포넌트에서는 할 수 없는 일이었죠.

지금 이 시점에서 여러분은 Hook이 어떻게 작동하는 것인지 궁금해하고 있을 것입니다. 어떻게 React는 리렌더링 시에 특정한 `useState`의 실행이 어떤 state 변수에 상응하는지 아는 것일까요? 어떻게 React는 이전과 그다음 effect를 업데이트 때마다 "매치업하는(일치하는)" 것일까요? **이에 대해서는 다음 장에서 Hook의 작동에 핵심적인 [Hook의 규칙](/docs/hooks-rules.html)을 통해서 배워볼 것입니다.**
