---
id: hooks-state
title: Using the State Hook
permalink: docs/hooks-state.html
next: hooks-effect.html
prev: hooks-overview.html
---

<<<<<<< HEAD
*Hook*은 React 16.8버전에 새로 추가되었습니다. Hook은 클래스 컴포넌트를 작성하지 않아도 state와 같은 특징들을 사용할 수 있습니다.
=======
> Try the new React documentation.
> 
> These new documentation pages teach modern React and include live examples:
>
> - [State: A Component's Memory](https://beta.reactjs.org/learn/state-a-components-memory)
> - [`useState`](https://beta.reactjs.org/reference/react/useState)
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

*Hooks* are a new addition in React 16.8. They let you use state and other React features without writing a class.
>>>>>>> 47adefd30c46f486428d8231a68e639d62f02c9e

[Hook 소개](/docs/hooks-intro.html)에서 아래 예시를 통해 Hook과 친해졌습니다.

```js{4-5}
import React, { useState } from 'react';

function Example() {
  // 새로운 state 변수를 선언하고, count라 부르겠습니다.
  const [count, setCount] = useState(0);

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

아래의 클래스 예시와 비교하며 Hook의 특징에 대해 배울 예정입니다.

## Hook과 같은 기능을 하는 클래스 예시 {#equivalent-class-example}

React에서 클래스를 사용해봤다면, 아래의 코드는 익숙할 겁니다.

```js
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
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

위 코드에서 state는 `{ count: 0 }`이며 사용자가 `this.setState()`를 호출하는 버튼을 클릭했을 때 `state.count`를 증가시킵니다. 위의 클래스 예시를 해당 페이지에서 계속 사용할 예정입니다.

>주의
>
>좀 더 현실적인 예시가 아닌, counter 예시를 사용하는지 궁금할 수 있습니다. counter 예시를 사용한 이유는, Hook을 잘 이해할 수 있도록 도와주는 가장 기초적인 내용이 될 수 있기 때문입니다.

## Hook과 함수 컴포넌트 {#hooks-and-function-components}

React의 함수 컴포넌트는 이렇게 생겼습니다.

```js
const Example = (props) => {
  // 여기서 Hook을 사용할 수 있습니다!
  return <div />;
}
```

또는 이렇게 생겼습니다.

```js
function Example(props) {
  // 여기서 Hook을 사용할 수 있습니다!
  return <div />;
}
```

함수 컴포넌트를 "state가 없는 컴포넌트"로 알고 있었을 겁니다. 하지만 Hook은 React state를 함수 안에서 사용할 수 있게 해줍니다.

Hook은 클래스 안에서 **동작하지 않습니다.** 하지만 클래스를 작성하지 않고 사용할 수 있습니다.

## Hook이란? {#whats-a-hook}

React의 `useState` Hook을 사용해봅시다!

```js{1}
import React, { useState } from 'react';

function Example() {
  // ...
}
```

**Hook이란?** Hook은 특별한 함수입니다. 예를 들어 `useState`는 state를 함수 컴포넌트 안에서 사용할 수 있게 해줍니다. 다른 Hook들은 나중에 살펴봅시다!

**언제 Hook을 사용할까?** 함수 컴포넌트를 사용하던 중 state를 추가하고 싶을 때 클래스 컴포넌트로 바꾸곤 했을 겁니다. 하지만 이제 함수 컴포넌트 안에서 Hook을 이용하여 state를 사용할 수 있습니다.

>주의
>
>컴포넌트 안에서 Hook을 사용할 때 몇 가지 특별한 규칙이 있습니다. 나중에 [Hook의 규칙](/docs/hooks-rules.html)에서 살펴보도록 할게요!

## state 변수 선언하기 {#declaring-a-state-variable}

클래스를 사용할 때, constructor 안에서 `this.state`를 `{ count: 0 }`로 설정함으로써 `count`를 `0`으로 초기화했습니다.

```js{4-6}
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }
```

함수 컴포넌트는 `this`를 가질 수 없기 때문에 `this.state`를 할당하거나 읽을 수 없습니다. 대신, `useState` Hook을 직접 컴포넌트에 호출합니다.

```js{4,5}
import React, { useState } from 'react';

function Example() {
  // 새로운 state 변수를 선언하고, 이것을 count라 부르겠습니다.
  const [count, setCount] = useState(0);
```

**`useState`를 호출하는 것은 무엇을 하는 걸까요?** "state 변수"를 선언할 수 있습니다. 위에 선언한 변수는 `count`라고 부르지만 `banana`처럼 아무 이름으로 지어도 됩니다. `useState`는 클래스 컴포넌트의 `this.state`가 제공하는 기능과 똑같습니다. 일반적으로 일반 변수는 함수가 끝날 때 사라지지만, state 변수는 React에 의해 사라지지 않습니다.

**`useState`의 인자로 무엇을 넘겨주어야 할까요?** `useState()`Hook의 인자로 넘겨주는 값은 state의 초기 값입니다. 함수 컴포넌트의 state는 클래스와 달리 객체일 필요는 없고, 숫자 타입과 문자 타입을 가질 수 있습니다. 위의 예시는 사용자가 버튼을 얼마나 많이 클릭했는지 알기를 원하므로 `0`을 해당 state의 초기 값으로 선언했습니다. (2개의 다른 변수를 저장하기를 원한다면 `useState()`를 두 번 호출해야 합니다.)

**`useState`는 무엇을 반환할까요?** state 변수, 해당 변수를 갱신할 수 있는 함수 이 두 가지 쌍을 반환합니다. 이것이 바로 `const [count, setCount] = useState()`라고 쓰는 이유입니다. 클래스 컴포넌트의 `this.state.count`와 `this.setState`와 유사합니다. 이러한 문법에 익숙하지 않다면 [현재 페이지의 끝](/docs/hooks-state.html#tip-what-do-square-brackets-mean)에서 살펴볼게요.

이제 `useState`를 이용하여 많은 것을 만들 수 있습니다.

```js{4,5}
import React, { useState } from 'react';

function Example() {
  // 새로운 state 변수를 선언하고, 이것을 count라 부르겠습니다.
  const [count, setCount] = useState(0);
```

`count`라고 부르는 state 변수를 선언하고 `0`으로 초기화합니다. React는 해당 변수를 리렌더링할 때 기억하고, 가장 최근에 갱신된 값을 제공합니다. `count` 변수의 값을 갱신하려면 `setCount`를 호출하면 됩니다.

>주의
>
>왜 `createState`가 아닌, `useState`로 이름을 지었을까요?
>
>컴포넌트가 렌더링할 때 오직 한 번만 생성되기 때문에 "Create"라는 이름은 꽤 정확하지 않을 수 있습니다. 컴포넌트가 다음 렌더링을 하는 동안 `useState`는 현재 state를 줍니다. Hook 이름이 항상 `use`로 시작하는 이유도 있습니다. [Hook의 규칙](/docs/hooks-rules.html)에서 나중에 살펴보도록 할게요.

## state 가져오기 {#reading-state}

클래스 컴포넌트는 count를 보여주기 위해 `this.state.count`를 사용합니다.

```js
  <p>You clicked {this.state.count} times</p>
```

반면 함수 컴포넌트는 `count`를 직접 사용할 수 있습니다.

```js
  <p>You clicked {count} times</p>
```

## state 갱신하기 {#updating-state}

클래스 컴포넌트는 `count`를 갱신하기 위해 `this.setState()`를 호출합니다.

```js{1}
  <button onClick={() => this.setState({ count: this.state.count + 1 })}>
    Click me
  </button>
```

반면 함수 컴포넌트는 `setCount`와 `count` 변수를 가지고 있으므로 `this`를 호출하지 않아도 됩니다.

```js{1}
  <button onClick={() => setCount(count + 1)}>
    Click me
  </button>
```

## 요약 {#recap}

**아래 코드를 한 줄 한 줄 살펴보고**, 얼마나 이해했는지 체크해봅시다.

<!--
  I'm not proud of this line markup. Please somebody fix this.
  But if GitHub got away with it for years we can cheat.
-->
```js {1,4,9}
 1:  import React, { useState } from 'react';
 2:
 3:  function Example() {
 4:    const [count, setCount] = useState(0);
 5:
 6:    return (
 7:      <div>
 8:        <p>You clicked {count} times</p>
 9:        <button onClick={() => setCount(count + 1)}>
10:         Click me
11:        </button>
12:      </div>
13:    );
14:  }
```

* **첫 번째 줄:** `useState` Hook을 React에서 가져옵니다.
* **네 번째 줄:** `useState` Hook을 이용하면 state 변수와 해당 state를 갱신할 수 있는 함수가 만들어집니다. 또한, `useState`의 인자의 값으로 `0`을 넘겨주면 `count` 값을 0으로 초기화할 수 있습니다.
* **아홉 번째 줄:** 사용자가 버튼 클릭을 하면 `setCount` 함수를 호출하여 state 변수를 갱신합니다. React는 새로운 `count` 변수를 `Example` 컴포넌트에 넘기며 해당 컴포넌트를 리렌더링합니다.

많은 것들이 있기 때문에 처음에는 다소 어려울 수 있습니다. 설명이 이해가 잘 안 된다면, 위의 코드를 천천히 다시 읽어보세요. 클래스 컴포넌트에서 사용하던 state 동작 방식을 잊고, 새로운 눈으로 위의 코드를 보면 분명히 이해가 갈 것입니다.

### 팁: 대괄호가 의미하는 것은 무엇일까요? {#tip-what-do-square-brackets-mean}

대괄호를 이용하여 state 변수를 선언하는 것을 보셨을 겁니다.

```js
  const [count, setCount] = useState(0);
```

대괄호 왼쪽의 state 변수는 사용하고 싶은 이름으로 선언할 수 있습니다.

```js
  const [fruit, setFruit] = useState('banana');
```

위 자바스크립트 문법은 ["배열 구조 분해"](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#배열_구조_분해)라고 하고, `fruit`과 `setFruit`, 총 2개의 값을 만들고 있습니다. 즉, `useState`를 사용하면 `fruit`이라는 첫 번째 값과 `setFruit`라는 두 번째 값을 반환합니다. 아래의 코드와 같은 효과를 낼 수 있습니다.

```js
  var fruitStateVariable = useState('banana'); // 두 개의 아이템이 있는 쌍을 반환
  var fruit = fruitStateVariable[0]; // 첫 번째 아이템
  var setFruit = fruitStateVariable[1]; // 두 번째 아이템
```

`useState`를 이용하여 변수를 선언하면 2개의 아이템 쌍이 들어있는 배열로 만들어집니다. 첫 번째 아이템은 현재 변수를 의미하고, 두 번째 아이템은 해당 변수를 갱신해주는 함수입니다. 배열 구조 분해라는 특별한 방법으로 변수를 선언해주었기 때문에 `[0]`이나 `[1]`로 배열에 접근하는 것은 좋지 않을 수 있습니다.

>주의
>
>`this`를 React에 알리지 않았는데, 어떻게 React가 특정 컴포넌트에서 `useState`를 사용한 것을 아는 지 궁금해할 수 있습니다. [이 질문](/docs/hooks-faq.html#how-does-react-associate-hook-calls-with-components)과 다른 궁금 사항들은 나중에 살펴보겠습니다.

### 팁: 여러 개의 state 변수를 사용하기 {#tip-using-multiple-state-variables}

`[something, setSomething]`의 쌍처럼 state 변수를 선언하는 것은 유용합니다. 왜냐하면 여러 개의 변수를 선언할 때 각각 다른 이름을 줄 수 있기 때문입니다.

```js
function ExampleWithManyStates() {
  // 여러 개의 state를 선언할 수 있습니다!
  const [age, setAge] = useState(42);
  const [fruit, setFruit] = useState('banana');
  const [todos, setTodos] = useState([{ text: 'Learn Hooks' }]);
```

위의 코드는 `age`, `fruit`, `todos`라는 지역 변수를 가지며 개별적으로 갱신할 수 있습니다.

```js
  function handleOrangeClick() {
    // this.setState({ fruit: 'orange' })와 같은 효과를 냅니다.
    setFruit('orange');
  }
```

여러 개의 state 변수를 **사용하지 않아도 됩니다.** state 변수는 객체와 배열을 잘 가지고 있을 수 있으므로 서로 연관있는 데이터를 묶을 수 있습니다. 하지만 클래스 컴포넌트의 `this.setState`와 달리 state를 갱신하는 것은 병합하는 것이 아니라 *대체*하는 것입니다.

독립적인 state 변수 분할에 대한 추가적인 권장 사항을 자주 묻는 질문에서 볼 수 있습니다. [자주 묻는 질문](/docs/hooks-faq.html#should-i-use-one-or-many-state-variables).

## 다음 단계 {#next-steps}

이번 페이지에서 React의 Hook 중 하나인 `useState`에 대해 배웠습니다. `useState`를 이용하면 함수 컴포넌트 안에서 state를 사용할 수 있습니다.

Hook은 함수 컴포넌트에서 React의 특징을 갖게 해주는 함수입니다. Hook은 항상 `use`라는 키워드로 시작하며 `useState` 이외에 아직 보지 못한 많은 Hook들이 있습니다.

**다음 강좌를 이어서 합시다. [다음 Hook 강좌: `useEffect`.](/docs/hooks-effect.html)** 다음에 배울 Hook은 클래스 컴포넌트의 생명주기와 비슷한 퍼포먼스를 낼 수 있습니다.
