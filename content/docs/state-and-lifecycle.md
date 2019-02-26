---
id: state-and-lifecycle
title: State and Lifecycle
title: state 와 생명주기
permalink: docs/state-and-lifecycle.html
redirect_from:
  - "docs/interactivity-and-dynamic-uis.html"
prev: components-and-props.html
next: handling-events.html
---

This page introduces the concept of state and lifecycle in a React component. You can find a [detailed component API reference here](/docs/react-component.html).
이 페이지는 React 컴포넌트 안의 state와 생명주기에 대한 개념을 소개해 줍니다. [자세한 컴포넌트 API 레퍼런스는 여기](/docs/react-component.html)에서 찾을 수 있습니다.

Consider the ticking clock example from [one of the previous sections](/docs/rendering-elements.html#updating-the-rendered-element). In [Rendering Elements](/docs/rendering-elements.html#rendering-an-element-into-the-dom), we have only learned one way to update the UI. We call `ReactDOM.render()` to change the rendered output:
[이전 섹션](/docs/rendering-elements.html#updating-the-rendered-element)에서 다뤄본 째깍거리는 시계 예시를 다시 살펴보겠습니다. [엘리먼트 렌더링](/docs/rendering-elements.html#rendering-an-element-into-the-dom)에서는 UI를 업데이트하는 한 가지 방법만 배웠으며, 렌더링 된 출력값을 변경하기 위해 `ReactDOM.render()`를 호출했습니다.

```js{8-11}
function tick() {
  const element = (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {new Date().toLocaleTimeString()}.</h2>
    </div>
  );
  ReactDOM.render(
    element,
    document.getElementById('root')
  );
}

setInterval(tick, 1000);
```

[**Try it on CodePen**](http://codepen.io/gaearon/pen/gwoJZk?editors=0010)
[**CodePen에서 시도해 보기**](http://codepen.io/gaearon/pen/gwoJZk?editors=0010)

In this section, we will learn how to make the `Clock` component truly reusable and encapsulated. It will set up its own timer and update itself every second.
이 섹션에서는 `Clock` 컴포넌트를 완전히 재사용하고 캡슐화하는 방법을 배울 것입니다. 이 컴포넌트는 스스로 타이머를 설정할 것이고 매초 스스로 업데이트할 것입니다.

We can start by encapsulating how the clock looks:
시계가 생긴 것에 따라 캡슐화하는 것으로 시작할 수 있습니다.

```js{3-6,12}
function Clock(props) {
  return (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {props.date.toLocaleTimeString()}.</h2>
    </div>
  );
}

function tick() {
  ReactDOM.render(
    <Clock date={new Date()} />,
    document.getElementById('root')
  );
}

setInterval(tick, 1000);
```

[**Try it on CodePen**](http://codepen.io/gaearon/pen/dpdoYR?editors=0010)
[**CodePen에서 시도해 보기**](http://codepen.io/gaearon/pen/dpdoYR?editors=0010)

However, it misses a crucial requirement: the fact that the `Clock` sets up a timer and updates the UI every second should be an implementation detail of the `Clock`.
그러나 여기에는 중요한 요건이 누락되어 있습니다. `Clock`이 타이머를 설정하고 매초 UI를 업데이트하는 것이 `Clock`의 구현 세부사항이 되어야 합니다.

Ideally we want to write this once and have the `Clock` update itself:
이상적으로 한 번만 코드를 작성하고 `Clock`이 스스로 업데이트하도록 만들려고 합니다.

```js{2}
ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

To implement this, we need to add "state" to the `Clock` component.
이것을 구현하기 위해서 `Clock` 컴포넌트에 "state"를 추가해야 합니다.

State is similar to props, but it is private and fully controlled by the component.
State는 props와 유사하지만, 비공개이며 컴포넌트에 의해 완전히 제어됩니다.

We [mentioned before](/docs/components-and-props.html#functional-and-class-components) that components defined as classes have some additional features. Local state is exactly that: a feature available only to classes.
[이전에 언급한 것과 같이](/docs/components-and-props.html#functional-and-class-components) 클래스로 정의된 컴포넌트는 부가적인 기능들이 있습니다.
클래스에서만 가능한 특징인 로컬 state가 바로 그것입니다.

## Converting a Function to a Class {#converting-a-function-to-a-class}
## 함수형에서 클래스로 변환하기 {#converting-a-function-to-a-class}

You can convert a function component like `Clock` to a class in five steps:
다섯 단계로 `Clock`과 같은 함수형 컴포넌트를 클래스로 변환할 수 있습니다. 

1. Create an [ES6 class](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes), with the same name, that extends `React.Component`.
1. `React.Component`를 확장하는 동일한 이름의 [ES6 class](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes)를 생성합니다.

2. Add a single empty method to it called `render()`.
2. `render()`라고 불리는 빈 메서드를 추가합니다.

3. Move the body of the function into the `render()` method.
3. 함수의 내용을 `render()` 메서드 안으로 옮깁니다.

4. Replace `props` with `this.props` in the `render()` body.
4. `render()` 내용 안에 있는 `props`를 `this.props`로 변경합니다.

5. Delete the remaining empty function declaration.
5. 남아있는 빈 함수 선언을 삭제합니다.

```js
class Clock extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.props.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

[**Try it on CodePen**](http://codepen.io/gaearon/pen/zKRGpo?editors=0010)
[**CodePen에서 시도해 보기**](http://codepen.io/gaearon/pen/zKRGpo?editors=0010)

`Clock` is now defined as a class rather than a function.
`Clock`은 이제 함수가 아닌 클래스로 정의됩니다.

The `render` method will be called each time an update happens, but as long as we render `<Clock />` into the same DOM node, only a single instance of the `Clock` class will be used. This lets us use additional features such as local state and lifecycle methods.
`render` 메서드는 업데이트가 발생할 때마다 호출되지만, 같은 DOM 노드로 `<Clock />`을 렌더링하는 경우 `Clock` 클래스의 단일 인스턴스만 사용됩니다. 이것은 로컬 state와 생명주기 메서드와 같은 부가적인 기능을 사용할 수 있게 해줍니다.

## Adding Local State to a Class {#adding-local-state-to-a-class}
## 클래스에 로컬 State 추가하기{#adding-local-state-to-a-class}

We will move the `date` from props to state in three steps:
세 단계에 걸쳐서 `date`를 props에서 state로 이동해 보겠습니다.

1) Replace `this.props.date` with `this.state.date` in the `render()` method:
1) `render()` 메서드 안에 있는 `this.props.date`를 `this.state.date`로 변경합니다.

```js{6}
class Clock extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

2) Add a [클래스 constructor](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes#Constructor) that assigns the initial `this.state`:
2) 초기 `this.state`를 지정하는 [class constructor](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes#Constructor)를 추가합니다.

```js{4}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

Note how we pass `props` to the base constructor:
여기서 어떻게 `props`를 기본 constructor에 전달하는지 유의하십시오.

```js{2}
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }
```

Class components should always call the base constructor with `props`.
클래스 컴포넌트는 항상 `props`로 기본 constructor를 호출해야 합니다.

3) Remove the `date` prop from the `<Clock />` element:
3) `<Clock />` 요소에서 `date` prop을 삭제합니다.

```js{2}
ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

We will later add the timer code back to the component itself.
타이머 코드는 나중에 다시 컴포넌트로 추가하도록 하겠습니다.

The result looks like this:
결과는 다음과 같습니다.

```js{2-5,11,18}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

[**Try it on CodePen**](http://codepen.io/gaearon/pen/KgQpJd?editors=0010)
[**CodePen에서 시도해 보기**](http://codepen.io/gaearon/pen/KgQpJd?editors=0010)

Next, we'll make the `Clock` set up its own timer and update itself every second.
다음으로 `Clock`이 스스로 타이머를 설정하고 매초 스스로 업데이트하도록 만들어 보겠습니다.

## Adding Lifecycle Methods to a Class {#adding-lifecycle-methods-to-a-class}
## 생명주기 메서드를 클래스에 추가하기 {#adding-lifecycle-methods-to-a-class}

In applications with many components, it's very important to free up resources taken by the components when they are destroyed.
많은 컴포넌트가 있는 응용프로그램에서 컴포넌트가 삭제될 때 해당 컴포넌트가 사용 중이던 리소스를 확보하는 것이 중요합니다.

We want to [set up a timer](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval) whenever the `Clock` is rendered to the DOM for the first time. This is called "mounting" in React.
`Clock`이 처음 DOM에 렌더링 될 때마다 [타이머를 설정](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval)하려고 합니다. 이것은 React에서 "마운팅"이라고 합니다.

We also want to [clear that timer](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/clearInterval) whenever the DOM produced by the `Clock` is removed. This is called "unmounting" in React.
또한 `Clock`에 의해 생산된 DOM이 삭제될 때마다 [타이머를 해제](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/clearInterval)하려고 합니다.

We can declare special methods on the component class to run some code when a component mounts and unmounts:
컴포넌트 클래스에서 특별한 메서드를 선언하여 컴포넌트가 마운트되거나 언마운트 될 때 일부 코드를 작동할 수 있습니다.

```js{7-9,11-13}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

These methods are called "lifecycle methods".
이러한 메서드들은 "생명주기 매서드"라고 불립니다.

The `componentDidMount()` method runs after the component output has been rendered to the DOM. This is a good place to set up a timer:
`componentDidMount()` 메서드는 컴포넌트 출력물이 DOM에 렌더링 된 후에 실행됩니다. 이 장소가 타이머를 설정하기에 가장 좋아 보입니다.

```js{2-5}
  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }
```

Note how we save the timer ID right on `this`.
`this`에서 어떻게 타이머 ID를 제대로 저장하는지 유의하십시오.

While `this.props` is set up by React itself and `this.state` has a special meaning, you are free to add additional fields to the class manually if you need to store something that doesn’t participate in the data flow (like a timer ID).
`this.props`가 React에 의해 스스로 설정되고 `this.state`가 특수한 의미가 있지만, (타이머 ID)와 같이 데이터 흐름 안에 포함되지 않는 어떤 항목을 보관할 필요가 있다면 자유롭게 클래스에 수동으로 부가적인 필드를 추가해도 됩니다.

We will tear down the timer in the `componentWillUnmount()` lifecycle method:
`componentWillUnmount()` 생명주기 메서드 안에 있는 타이머를 분해해 보겠습니다.

```js{2}
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
```

Finally, we will implement a method called `tick()` that the `Clock` component will run every second.
마지막으로 `Clock` 컴포넌트가 매초 작동하도록 하는 `tick()`이라는 메서드를 구현해 보겠습니다.
It will use `this.setState()` to schedule updates to the component local state:
이것은 컴포넌트 로컬 state를 업데이트하기 위해 `this.setState()`를 사용합니다.

```js{18-22}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

[**Try it on CodePen**](http://codepen.io/gaearon/pen/amqdNA?editors=0010)
[**CodePen에서 시도해 보기**](http://codepen.io/gaearon/pen/amqdNA?editors=0010)

Now the clock ticks every second.
이제 시계는 매초 째깍거립니다.

Let's quickly recap what's going on and the order in which the methods are called:
현재 어떤 상황이고 매서드가 어떻게 호출되는지 순서대로 빠르게 요약해 보겠습니다.

1) When `<Clock />` is passed to `ReactDOM.render()`, React calls the constructor of the `Clock` component. Since `Clock` needs to display the current time, it initializes `this.state` with an object including the current time. We will later update this state.
1) `<Clock />`가 `ReactDOM.render()`로 전달되었을 때 React는 `Clock` 컴포넌트의 constructor를 호출합니다. `Clock`이 현재 시각을 표시해야 하기 때문에 현재 시각이 포함된 객체로 `this.state`를 초기화합니다. 나중에 이 state를 업데이트할 것입니다.

2) React then calls the `Clock` component's `render()` method. This is how React learns what should be displayed on the screen. React then updates the DOM to match the `Clock`'s render output.
2) React는 `Clock` 컴포넌트의 `render()` 메서드를 호출합니다. 이를 통해 React는 화면에 표시되어야 할 내용을 알게 됩니다. 그다음 React는 `Clock`의 렌더링 출력값을 일치시키기 위해 DOM을 업데이트합니다.

3) When the `Clock` output is inserted in the DOM, React calls the `componentDidMount()` lifecycle method. Inside it, the `Clock` component asks the browser to set up a timer to call the component's `tick()` method once a second.
3) `Clock` 출력값이 DOM에 삽입되면, React는 `componentDidMount()` 생명주기 메서드를 호출합니다. 그 안에서 `Clock` 컴포넌트는 매초 컴포넌트의 `tick()` 메서드를 호출하기 위한 타이머를 설정하도록 브라우저에 요청합니다. 

4) Every second the browser calls the `tick()` method. Inside it, the `Clock` component schedules a UI update by calling `setState()` with an object containing the current time. Thanks to the `setState()` call, React knows the state has changed, and calls the `render()` method again to learn what should be on the screen. This time, `this.state.date` in the `render()` method will be different, and so the render output will include the updated time. React updates the DOM accordingly.
4) 매초 브라우저가 `tick()` 메서드를 호출합니다. 그 안에서 `Clock` 컴포넌트는 `setState()`와 현재 시각을 포함하는 객체를 호출하면서 UI 업데이트를 진행합니다. `setState()` 호출 덕분에 React는 state가 변경된 것을 인지하고 화면에 표시될 내용을 알아내기 위해 `render()` 메서드를 다시 호출합니다.

5) If the `Clock` component is ever removed from the DOM, React calls the `componentWillUnmount()` lifecycle method so the timer is stopped.
5) `Clock` 컴포넌트가 DOM으로부터 한 번이라도 삭제된 적이 있다면 React는 타이머를 멈추기 위해 `componentWillUnmount()` 생명주기 메서드를 호출합니다.

## Using State Correctly {#using-state-correctly}
## State를 올바르게 사용하기 {#using-state-correctly}

There are three things you should know about `setState()`.
`setState()`에 대해서 알아야 할 세 가지가 있습니다.

### Do Not Modify State Directly {#do-not-modify-state-directly}
### 직접 State를 수정하지 마십시오 {#do-not-modify-state-directly}

For example, this will not re-render a component:
예를 들어, 이 코드는 컴포넌트를 다시 렌더링하지 않습니다.

```js
// Wrong
this.state.comment = 'Hello';
```

Instead, use `setState()`:
대신에 `setState()`를 사용합니다.

```js
// Correct
this.setState({comment: 'Hello'});
```

The only place where you can assign `this.state` is the constructor.
`this.state`를 지정할 수 있는 유일한 공간은 바로 constructor입니다.

### State Updates May Be Asynchronous {#state-updates-may-be-asynchronous}
### State 업데이트는 비동기적일 수도 있습니다. {#state-updates-may-be-asynchronous}

React may batch multiple `setState()` calls into a single update for performance.
React는 성능을 위해 여러 `setState()` 호출을 단일 업데이트로 한꺼번에 처리할 수 있습니다.

Because `this.props` and `this.state` may be updated asynchronously, you should not rely on their values for calculating the next state.
`this.props`와 `this.state`가 비동기적으로 업데이트될 수 있기 때문에 다음 state를 계산할 때 해당 값에 의존해서는 안 됩니다.

For example, this code may fail to update the counter:
예를 들어 다음 코드는 카운터 업데이트에 실패할 수 있습니다. 

```js
// Wrong
this.setState({
  counter: this.state.counter + this.props.increment,
});
```

To fix it, use a second form of `setState()` that accepts a function rather than an object. That function will receive the previous state as the first argument, and the props at the time the update is applied as the second argument:
이를 수정하기 위해 객체보다는 함수를 인자로 사용하는 다른 형태의 `setState()`를 사용합니다. 그 함수는 이전 state를 첫 번째 인자로 받아들일 것이고, 업데이트가 적용된 시점의 props를 두 번째 인자로 받아들일 것입니다.

```js
// Correct
this.setState((state, props) => ({
  counter: state.counter + props.increment
}));
```

We used an [arrow function](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions) above, but it also works with regular functions:
위에서는 [화살표 함수](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions)를 사용했지만, 일반적인 함수에서도 정상적으로 작동합니다.

```js
// Correct
this.setState(function(state, props) {
  return {
    counter: state.counter + props.increment
  };
});
```

### State Updates are Merged {#state-updates-are-merged}
### State 업데이트는 병합됩니다 {#state-updates-are-merged}

When you call `setState()`, React merges the object you provide into the current state.
`setState()`를 호출할 때 React는 제공한 객체를 현재 state로 병합합니다.

For example, your state may contain several independent variables:
예를 들어, state는 다양한 독립적인 변수를 포함할 수 있습니다. 

```js{4,5}
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      comments: []
    };
  }
```

Then you can update them independently with separate `setState()` calls:
별도의 `setState()` 호출로 이러한 변수를 독립적으로 업데이트할 수 있습니다.

```js{4,10}
  componentDidMount() {
    fetchPosts().then(response => {
      this.setState({
        posts: response.posts
      });
    });

    fetchComments().then(response => {
      this.setState({
        comments: response.comments
      });
    });
  }
```

The merging is shallow, so `this.setState({comments})` leaves `this.state.posts` intact, but completely replaces `this.state.comments`.
병합은 얕게 이루어지기 때문에 `this.setState({comments})`는 `this.state.posts`에 영향을 주진 않지만 `this.state.comments`는 완전히 대체됩니다. 

## The Data Flows Down {#the-data-flows-down}
## 데이터 흐름은 아래로 {#the-data-flows-down}

Neither parent nor child components can know if a certain component is stateful or stateless, and they shouldn't care whether it is defined as a function or a class.
부모 컴포넌트나 자식 컴포넌트 모두 특정 컴포넌트가 유상태인지 또는 무상태인지 알 수 없고, 그들이 함수형이나 클래스로 정의되었는지에 대해서 관심을 가질 필요가 없습니다.

This is why state is often called local or encapsulated. It is not accessible to any component other than the one that owns and sets it.
이 때문에 state는 종종 로컬 또는 캡슐화라고 불립니다. state가 소유하고 설정한 컴포넌트 이외에는 어떠한 컴포넌트에도 접근할 수 없습니다.

A component may choose to pass its state down as props to its child components:
컴포넌트는 자신의 state를 자식 컴포넌트에 props로 전달할 수 있습니다.

```js
<h2>It is {this.state.date.toLocaleTimeString()}.</h2>
```

This also works for user-defined components:
이것 또한 사용자 정의된 컴포넌트에도 적용 가능합니다.

```js
<FormattedDate date={this.state.date} />
```

The `FormattedDate` component would receive the `date` in its props and wouldn't know whether it came from the `Clock`'s state, from the `Clock`'s props, or was typed by hand:
`FormattedDate` 컴포넌트는 `date`를 자신의 props로 받을 것이고 이것이 `Clock`의 state로부터 왔는지, `Clock`의 props에서 왔는지, 수동으로 입력한 것인지 알지 못합니다.

```js
function FormattedDate(props) {
  return <h2>It is {props.date.toLocaleTimeString()}.</h2>;
}
```

[**Try it on CodePen**](http://codepen.io/gaearon/pen/zKRqNB?editors=0010)
[**CodePen에서 시도해 보기**](http://codepen.io/gaearon/pen/zKRqNB?editors=0010)

This is commonly called a "top-down" or "unidirectional" data flow. Any state is always owned by some specific component, and any data or UI derived from that state can only affect components "below" them in the tree.
일반적으로 이를 "하향식(top-down)" 또는 "단방향식" 데이터 흐름이라고 합니다. 모든 state는 항상 특정한 컴포넌트가 소유하고 있으며 그 state로부터 파생된 UI 또는 데이터는 오직 트리구조에서 자신의 "아래"에 있는 컴포넌트에만 영향을 미칩니다. 

If you imagine a component tree as a waterfall of props, each component's state is like an additional water source that joins it at an arbitrary point but also flows down.
트리구조가 prop들의 폭포라고 상상하면 각 컴포넌트의 state는 임의의 점에서 만나지만 동시에 아래로 흐르는 부가적인 수원이라고 할 수 있습니다.

To show that all components are truly isolated, we can create an `App` component that renders three `<Clock>`s:
모든 컴포넌트가 완전히 독립적이라는 것을 보여주기 위해 `App`와 렌더링하는 세 개의 `<Clock>`을 만들었습니다.

```js{4-6}
function App() {
  return (
    <div>
      <Clock />
      <Clock />
      <Clock />
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

[**Try it on CodePen**](http://codepen.io/gaearon/pen/vXdGmd?editors=0010)
[**CodePen에서 시도해 보기**](http://codepen.io/gaearon/pen/vXdGmd?editors=0010)

Each `Clock` sets up its own timer and updates independently.
각 `Clock`은 자신만의 타이머를 설정하고 독립적으로 업데이트를 합니다.

In React apps, whether a component is stateful or stateless is considered an implementation detail of the component that may change over time. You can use stateless components inside stateful components, and vice versa.
React 앱에서 컴포넌트가 유상태 또는 무상태에 대한 것은 시간이 지남에 따라 변경될 수 있는 구현 세부 사항으로 간주합니다. 유상태 컴포넌트 안에서 무상태 컴포넌트를 사용할 수 있으며, 그 반대 경우도 마찬가지로 사용할 수 있습니다.