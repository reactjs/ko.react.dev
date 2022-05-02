---
id: test-utils
title: 테스팅 도구
permalink: docs/test-utils.html
layout: docs
category: Reference
---

**Importing**

```javascript
import ReactTestUtils from 'react-dom/test-utils'; // ES6
var ReactTestUtils = require('react-dom/test-utils'); // npm과 ES5
```

## 개요 {#overview}

`ReactTestUtils`는 여러분이 선택한 테스팅 프레임워크에서 테스트를 쉽게 진행할 수 있도록 해 줍니다. Facebook에서는 [Jest](https://facebook.github.io/jest/)를 이용해 더욱 쉽게 JavaScript 테스트를 하고 있습니다. Jest 웹사이트의 [React 자습서](https://jestjs.io/docs/tutorial-react) 문서를 통해 Jest를 시작하는 방법에 대해서 알아보세요.

> 주의
>
> Facebook에서는 [React Testing Library](https://testing-library.com/react) 사용을 권장합니다. 이 라이브러리는 사용자가 컴포넌트를 사용하는 것처럼 테스트를 작성할 수 있도록 설계되었습니다.
>
> React v16 이하에서는 [Enzyme](https://airbnb.io/enzyme/)을 통해 React 컴포넌트의 출력을 쉽게 검증하고 조작하고 탐색할 수 있습니다.



 - [`act()`](#act)
 - [`mockComponent()`](#mockcomponent)
 - [`isElement()`](#iselement)
 - [`isElementOfType()`](#iselementoftype)
 - [`isDOMComponent()`](#isdomcomponent)
 - [`isCompositeComponent()`](#iscompositecomponent)
 - [`isCompositeComponentWithType()`](#iscompositecomponentwithtype)
 - [`findAllInRenderedTree()`](#findallinrenderedtree)
 - [`scryRenderedDOMComponentsWithClass()`](#scryrendereddomcomponentswithclass)
 - [`findRenderedDOMComponentWithClass()`](#findrendereddomcomponentwithclass)
 - [`scryRenderedDOMComponentsWithTag()`](#scryrendereddomcomponentswithtag)
 - [`findRenderedDOMComponentWithTag()`](#findrendereddomcomponentwithtag)
 - [`scryRenderedComponentsWithType()`](#scryrenderedcomponentswithtype)
 - [`findRenderedComponentWithType()`](#findrenderedcomponentwithtype)
 - [`renderIntoDocument()`](#renderintodocument)
 - [`Simulate`](#simulate)

## 참조사항 {#reference}

### `act()` {#act}

컴포넌트의 진단을 준비하기 위해서는 컴포넌트를 렌더링하고 갱신해주는 코드를 `act()`를 호출한 것의 안에 넣어줘야 합니다. 이를 통해 React를 브라우저 내에서 동작하는 것과 비슷한 환경에서 테스트할 수 있습니다.

>주의
>
>`react-test-renderer`를 사용한다면, 똑같이 작동하는 `act` export가 제공됩니다.

예를 들어, 다음과 같은 `Counter` 컴포넌트가 있다고 해봅시다.


```js
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: 0};
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
  }
  componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`;
  }
  handleClick() {
    this.setState(state => ({
      count: state.count + 1,
    }));
  }
  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={this.handleClick}>
          Click me
        </button>
      </div>
    );
  }
}
```

이런 방식으로 테스트 할 수 있습니다.

```js{3,20-22,29-31}
import React from 'react';
import ReactDOM from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import Counter from './Counter';

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it('can render and update a counter', () => {
  // 첫 render와 componentDidMount를 테스트
  act(() => {
    ReactDOM.createRoot(container).render(<Counter />);
  });
  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('You clicked 0 times');
  expect(document.title).toBe('You clicked 0 times');

  // 두 번째 render와 componentDidUpdate를 테스트
  act(() => {
    button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });
  expect(label.textContent).toBe('You clicked 1 times');
  expect(document.title).toBe('You clicked 1 times');
});
```

- DOM 이벤트 발행은 DOM 컨테이너가 `document` 객체에 추가되었을 때만 작동한다는 점을 잊지마세요. 불필요하게 반복 되는 코드를 줄이기 위해서 [`react-testing-library`](https://testing-library.com/react)와 같은 라이브러리를 사용할 수 있습니다.

- [테스트 방법](/docs/testing-recipes.html) 문서에 `act()`의 동작 방식에 대한 자세한 내용이 예시와 사용법과 함께 포함되어 있습니다.

* * *

### `mockComponent()` {#mockcomponent}

```javascript
mockComponent(
  componentClass,
  [mockTagName]
)
```

모의 컴포넌트 모듈을 이 메서드에 넘겨 유용한 메서드들을 붙여 증강해 더미 React 컴포넌트로 사용할 수 있습니다. 보통의 경우처럼 렌더링 하지 않고 그 대신 컴포넌트는 간단하게 `<div>` 태그가 됩니다. `mockTagName`값을 넘겨준다면 `<div>`대신 다른 태그로 만들어 줄 수 있습니다.


> 주의
>
> `mockComponent()`는 더 이상 쓰이지 않는 API입니다. [`jest.mock()`](https://jestjs.io/docs/tutorial-react-native#mock-native-modules-using-jestmock) 사용을 추천합니다.

* * *

### `isElement()` {#iselement}

```javascript
isElement(element)
```

`element`가 React의 element라면 `true`를 반환합니다.

* * *

### `isElementOfType()` {#iselementoftype}

```javascript
isElementOfType(
  element,
  componentClass
)
```

`element`가 `componentClass` 타입의 React element라면 `true`를 반환합니다.

* * *

### `isDOMComponent()` {#isdomcomponent}

```javascript
isDOMComponent(instance)
```

`instance`가 `<div>`나 `<span>`같은 DOM 컴포넌트라면 `true`를 반환합니다.

* * *

### `isCompositeComponent()` {#iscompositecomponent}

```javascript
isCompositeComponent(instance)
```

`instance`가 클래스나 함수 같이 사용자가 정의한 컴포넌트라면 `true`를 반환합니다.

* * *

### `isCompositeComponentWithType()` {#iscompositecomponentwithtype}

```javascript
isCompositeComponentWithType(
  instance,
  componentClass
)
```

`instance`가 `componentClass` 타입을 가진 컴포넌트라면 `true`를 반환합니다.

* * *

### `findAllInRenderedTree()` {#findallinrenderedtree}

```javascript
findAllInRenderedTree(
  tree,
  test
)
```

`tree`의 모든 컴포넌트를 탐색하여 `test(component)`가 `true`일 때 모든 컴포넌트를 축적합니다. 이 함수는 그 자체만으로는 유용하지 않지만, 다른 테스트 도구의 기반이 됩니다.

* * *

### `scryRenderedDOMComponentsWithClass()` {#scryrendereddomcomponentswithclass}

```javascript
scryRenderedDOMComponentsWithClass(
  tree,
  className
)
```

렌더링 된 트리에서 조건 `className`에 만족하는 class명을 가지고 있는 DOM 컴포넌트의 DOM 엘리먼트를 모두 검색합니다.

* * *

### `findRenderedDOMComponentWithClass()` {#findrendereddomcomponentwithclass}

```javascript
findRenderedDOMComponentWithClass(
  tree,
  className
)
```

[`scryRenderedDOMComponentsWithClass()`](#scryrendereddomcomponentswithclass)와 기능이 유사하나 결과값이 하나라고 가정하고 그 결과값만을 반환합니다. 두 개 이상의 결과값이 있다면 예외를 반환합니다.

* * *

### `scryRenderedDOMComponentsWithTag()` {#scryrendereddomcomponentswithtag}

```javascript
scryRenderedDOMComponentsWithTag(
  tree,
  tagName
)
```

렌더링 된 트리 내에서 조건 `tagName`에 만족하는 tag명을 가진 DOM 컴포넌트의 DOM 엘리먼트를 모두 검색합니다.

* * *

### `findRenderedDOMComponentWithTag()` {#findrendereddomcomponentwithtag}

```javascript
findRenderedDOMComponentWithTag(
  tree,
  tagName
)
```

[`scryRenderedDOMComponentsWithTag()`](#scryrendereddomcomponentswithtag)와 기능이 유사하나 결과값이 하나라고 가정하고 그 결과값만을 반환합니다. 두 개 이상의 결과값이 있다면 예외를 뱉습니다.

* * *

### `scryRenderedComponentsWithType()` {#scryrenderedcomponentswithtype}

```javascript
scryRenderedComponentsWithType(
  tree,
  componentClass
)
```

`componentClass` 타입을 가진 모든 인스턴스를 검색합니다.

* * *

### `findRenderedComponentWithType()` {#findrenderedcomponentwithtype}

```javascript
findRenderedComponentWithType(
  tree,
  componentClass
)
```

[`scryRenderedComponentsWithType()`](#scryrenderedcomponentswithtype)와 기능이 유사하나 결과값이 하나라고 가정하고 그 결과값만을 반환합니다. 두 개 이상의 결과값이 있다면 예외를 뱉습니다.

***

### `renderIntoDocument()` {#renderintodocument}

```javascript
renderIntoDocument(element)
```

React 엘리먼트를 document내의 떨어져 있는 DOM 노드에 렌더링합니다. **이 함수를 쓰려면 DOM이 필요합니다.** 이 함수는 다음 코드와 같은 기능을 합니다.

```js
const domContainer = document.createElement('div');
ReactDOM.createRoot(domContainer).render(element);
```

> 주의
>
> `window`, `window.document`와 `window.document.createElement`는 `React`를 **가져와서 사용하기 전에도** 전역적으로 사용할 수 있습니다. 그렇지 않다면 React는 DOM에 접근할 수 없다고 간주할 것이며 `setState`와 같은 메서드들이 작동하지 않을 것 입니다.

* * *

## 다른 테스팅 도구들 {#other-utilities}

### `Simulate` {#simulate}

```javascript
Simulate.{eventName}(
  element,
  [eventData]
)
```

이벤트 데이터인 `eventData`를 옵션으로 준 DOM 노드에 붙이는 이벤트를 시뮬레이팅합니다.

`Simulate`는 [React가 이해하는 모든 이벤트](/docs/events.html#supported-events)를 위한 메서드를 가집니다.


**엘리먼트 클릭**

```javascript
// <button ref={(node) => this.button = node}>...</button>
const node = this.button;
ReactTestUtils.Simulate.click(node);
```

**입력 필드의 값을 바꾼 뒤 ENTER키 누르기**

```javascript
// <input ref={(node) => this.textInput = node} />
const node = this.textInput;
node.value = 'giraffe';
ReactTestUtils.Simulate.change(node);
ReactTestUtils.Simulate.keyDown(node, {key: "Enter", keyCode: 13, which: 13});
```

> 주의
>
> 컴포넌트 내에서 사용하고 있는 keyCode, which와 같은 이벤트 프로퍼티는 별도로 제공해주어야 합니다. React에서는 이러한 이벤트 프로퍼티를 자동으로 만들어 주지 않습니다.


* * *
