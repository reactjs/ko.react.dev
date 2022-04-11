---
id: state-and-lifecycle
title: State and Lifecycle
permalink: docs/state-and-lifecycle.html
redirect_from:
  - "docs/interactivity-and-dynamic-uis.html"
prev: components-and-props.html
next: handling-events.html
---

이 페이지는 React 컴포넌트 안의 state와 생명주기에 대한 개념을 소개해 줍니다. [자세한 컴포넌트 API 레퍼런스는 여기](/docs/react-component.html)에서 찾을 수 있습니다.

<<<<<<< HEAD
[이전 섹션](/docs/rendering-elements.html#updating-the-rendered-element)에서 다뤄본 째깍거리는 시계 예시를 다시 살펴보겠습니다. [엘리먼트 렌더링](/docs/rendering-elements.html#rendering-an-element-into-the-dom)에서는 UI를 업데이트하는 한 가지 방법만 배웠으며, 렌더링 된 출력값을 변경하기 위해 `ReactDOM.render()`를 호출했습니다.
=======
Consider the ticking clock example from [one of the previous sections](/docs/rendering-elements.html#updating-the-rendered-element). In [Rendering Elements](/docs/rendering-elements.html#rendering-an-element-into-the-dom), we have only learned one way to update the UI. We call `root.render()` to change the rendered output:
>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b

```js{10}
const root = ReactDOM.createRoot(document.getElementById('root'));
  
function tick() {
  const element = (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {new Date().toLocaleTimeString()}.</h2>
    </div>
  );
  root.render(element);
}

setInterval(tick, 1000);
```

[**CodePen에서 시도해보기**](https://codepen.io/gaearon/pen/gwoJZk?editors=0010)

이 섹션에서는 `Clock` 컴포넌트를 완전히 재사용하고 캡슐화하는 방법을 배울 것입니다. 이 컴포넌트는 스스로 타이머를 설정할 것이고 매초 스스로 업데이트할 것입니다.

시계가 생긴 것에 따라 캡슐화하는 것으로 시작할 수 있습니다.

```js{5-8,13}
const root = ReactDOM.createRoot(document.getElementById('root'));

function Clock(props) {
  return (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {props.date.toLocaleTimeString()}.</h2>
    </div>
  );
}

function tick() {
  root.render(<Clock date={new Date()} />);
}

setInterval(tick, 1000);
```

[**CodePen에서 시도해보기**](https://codepen.io/gaearon/pen/dpdoYR?editors=0010)

그러나 여기에는 중요한 요건이 누락되어 있습니다. `Clock`이 타이머를 설정하고 매초 UI를 업데이트하는 것이 `Clock`의 구현 세부사항이 되어야 합니다.

이상적으로 한 번만 코드를 작성하고 `Clock`이 스스로 업데이트하도록 만들려고 합니다.

```js{2}
root.render(<Clock />);
```

이것을 구현하기 위해서 `Clock` 컴포넌트에 "state"를 추가해야 합니다.

State는 props와 유사하지만, 비공개이며 컴포넌트에 의해 완전히 제어됩니다.


## 함수에서 클래스로 변환하기 {#converting-a-function-to-a-class}

다섯 단계로 `Clock`과 같은 함수 컴포넌트를 클래스로 변환할 수 있습니다.

1. `React.Component`를 확장하는 동일한 이름의 [ES6 class](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Classes)를 생성합니다.

2. `render()`라고 불리는 빈 메서드를 추가합니다.

3. 함수의 내용을 `render()` 메서드 안으로 옮깁니다.

4. `render()` 내용 안에 있는 `props`를 `this.props`로 변경합니다.

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

[**CodePen에서 시도해보기**](https://codepen.io/gaearon/pen/zKRGpo?editors=0010)

`Clock`은 이제 함수가 아닌 클래스로 정의됩니다.

`render` 메서드는 업데이트가 발생할 때마다 호출되지만, 같은 DOM 노드로 `<Clock />`을 렌더링하는 경우 `Clock` 클래스의 단일 인스턴스만 사용됩니다. 이것은 로컬 state와 생명주기 메서드와 같은 부가적인 기능을 사용할 수 있게 해줍니다.

## 클래스에 로컬 State 추가하기 {#adding-local-state-to-a-class}

세 단계에 걸쳐서 `date`를 props에서 state로 이동해 보겠습니다.

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

2) 초기 `this.state`를 지정하는 [class constructor](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Classes#Constructor_(%EC%83%9D%EC%84%B1%EC%9E%90))를 추가합니다.

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

여기서 어떻게 `props`를 기본 constructor에 전달하는지 유의해주세요.

```js{2}
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }
```

클래스 컴포넌트는 항상 `props`로 기본 constructor를 호출해야 합니다.

3) `<Clock />` 요소에서 `date` prop을 삭제합니다.

```js{2}
root.render(<Clock />);
```

타이머 코드는 나중에 다시 컴포넌트로 추가하도록 하겠습니다.

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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Clock />);
```

[**CodePen에서 시도해보기**](https://codepen.io/gaearon/pen/KgQpJd?editors=0010)

다음으로 `Clock`이 스스로 타이머를 설정하고 매초 스스로 업데이트하도록 만들어 보겠습니다.

## 생명주기 메서드를 클래스에 추가하기 {#adding-lifecycle-methods-to-a-class}

많은 컴포넌트가 있는 애플리케이션에서 컴포넌트가 삭제될 때 해당 컴포넌트가 사용 중이던 리소스를 확보하는 것이 중요합니다.

`Clock`이 처음 DOM에 렌더링 될 때마다 [타이머를 설정](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval)하려고 합니다. 이것은 React에서 "마운팅"이라고 합니다.

또한 `Clock`에 의해 생성된 DOM이 삭제될 때마다 [타이머를 해제](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/clearInterval)하려고 합니다. 이것은 React에서 “언마운팅”이라고 합니다.

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

이러한 메서드들은 "생명주기 메서드"라고 불립니다.

`componentDidMount()` 메서드는 컴포넌트 출력물이 DOM에 렌더링 된 후에 실행됩니다. 이 장소가 타이머를 설정하기에 좋은 장소입니다.

```js{2-5}
  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }
```

`this` (`this.timerID`)에서 어떻게 타이머 ID를 제대로 저장하는지 주의해주세요.

`this.props`가 React에 의해 스스로 설정되고 `this.state`가 특수한 의미가 있지만, 타이머 ID와 같이 데이터 흐름 안에 포함되지 않는 어떤 항목을 보관할 필요가 있다면 자유롭게 클래스에 수동으로 부가적인 필드를 추가해도 됩니다.

`componentWillUnmount()` 생명주기 메서드 안에 있는 타이머를 분해해 보겠습니다.

```js{2}
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
```

마지막으로 `Clock` 컴포넌트가 매초 작동하도록 하는 `tick()`이라는 메서드를 구현해 보겠습니다.

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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Clock />);
```

[**CodePen에서 시도해보기**](https://codepen.io/gaearon/pen/amqdNA?editors=0010)

이제 시계는 매초 째깍거립니다.

현재 어떤 상황이고 메서드가 어떻게 호출되는지 순서대로 빠르게 요약해 보겠습니다.

<<<<<<< HEAD
1) `<Clock />`가 `ReactDOM.render()`로 전달되었을 때 React는 `Clock` 컴포넌트의 constructor를 호출합니다. `Clock`이 현재 시각을 표시해야 하기 때문에 현재 시각이 포함된 객체로 `this.state`를 초기화합니다. 나중에 이 state를 업데이트할 것입니다.
=======
1) When `<Clock />` is passed to `root.render()`, React calls the constructor of the `Clock` component. Since `Clock` needs to display the current time, it initializes `this.state` with an object including the current time. We will later update this state.
>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b

2) React는 `Clock` 컴포넌트의 `render()` 메서드를 호출합니다. 이를 통해 React는 화면에 표시되어야 할 내용을 알게 됩니다. 그 다음 React는 `Clock`의 렌더링 출력값을 일치시키기 위해 DOM을 업데이트합니다.

3) `Clock` 출력값이 DOM에 삽입되면, React는 `componentDidMount()` 생명주기 메서드를 호출합니다. 그 안에서 `Clock` 컴포넌트는 매초 컴포넌트의 `tick()` 메서드를 호출하기 위한 타이머를 설정하도록 브라우저에 요청합니다.

4) 매초 브라우저가 `tick()` 메서드를 호출합니다. 그 안에서 `Clock` 컴포넌트는 `setState()`에 현재 시각을 포함하는 객체를 호출하면서 UI 업데이트를 진행합니다. `setState()` 호출 덕분에 React는 state가 변경된 것을 인지하고 화면에 표시될 내용을 알아내기 위해 `render()` 메서드를 다시 호출합니다. 이 때 `render()` 메서드 안의 `this.state.date`가 달라지고 렌더링 출력값은 업데이트된 시각을 포함합니다. React는 이에 따라 DOM을 업데이트합니다.

5) `Clock` 컴포넌트가 DOM으로부터 한 번이라도 삭제된 적이 있다면 React는 타이머를 멈추기 위해 `componentWillUnmount()` 생명주기 메서드를 호출합니다.

## State를 올바르게 사용하기 {#using-state-correctly}

`setState()`에 대해서 알아야 할 세 가지가 있습니다.

### 직접 State를 수정하지 마세요 {#do-not-modify-state-directly}

예를 들어, 이 코드는 컴포넌트를 다시 렌더링하지 않습니다.

```js
// Wrong
this.state.comment = 'Hello';
```

대신에 `setState()`를 사용합니다.

```js
// Correct
this.setState({comment: 'Hello'});
```

`this.state`를 지정할 수 있는 유일한 공간은 바로 constructor입니다.

### State 업데이트는 비동기적일 수도 있습니다. {#state-updates-may-be-asynchronous}

React는 성능을 위해 여러 `setState()` 호출을 단일 업데이트로 한꺼번에 처리할 수 있습니다.

`this.props`와 `this.state`가 비동기적으로 업데이트될 수 있기 때문에 다음 state를 계산할 때 해당 값에 의존해서는 안 됩니다.

예를 들어, 다음 코드는 카운터 업데이트에 실패할 수 있습니다.

```js
// Wrong
this.setState({
  counter: this.state.counter + this.props.increment,
});
```

이를 수정하기 위해 객체보다는 함수를 인자로 사용하는 다른 형태의 `setState()`를 사용합니다. 그 함수는 이전 state를 첫 번째 인자로 받아들일 것이고, 업데이트가 적용된 시점의 props를 두 번째 인자로 받아들일 것입니다.

```js
// Correct
this.setState((state, props) => ({
  counter: state.counter + props.increment
}));
```

위에서는 [화살표 함수](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Functions/%EC%95%A0%EB%A1%9C%EC%9A%B0_%ED%8E%91%EC%85%98)를 사용했지만, 일반적인 함수에서도 정상적으로 작동합니다.

```js
// Correct
this.setState(function(state, props) {
  return {
    counter: state.counter + props.increment
  };
});
```

### State 업데이트는 병합됩니다 {#state-updates-are-merged}

`setState()`를 호출할 때 React는 제공한 객체를 현재 state로 병합합니다.

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

병합은 얕게 이루어지기 때문에 `this.setState({comments})`는 `this.state.posts`에 영향을 주진 않지만 `this.state.comments`는 완전히 대체됩니다.

## 데이터는 아래로 흐릅니다 {#the-data-flows-down}

부모 컴포넌트나 자식 컴포넌트 모두 특정 컴포넌트가 유상태인지 또는 무상태인지 알 수 없고, 그들이 함수나 클래스로 정의되었는지에 대해서 관심을 가질 필요가 없습니다.

이 때문에 state는 종종 로컬 또는 캡슐화라고 불립니다. state가 소유하고 설정한 컴포넌트 이외에는 어떠한 컴포넌트에도 접근할 수 없습니다.

컴포넌트는 자신의 state를 자식 컴포넌트에 props로 전달할 수 있습니다.

```js
<FormattedDate date={this.state.date} />
```

`FormattedDate` 컴포넌트는 `date`를 자신의 props로 받을 것이고 이것이 `Clock`의 state로부터 왔는지, `Clock`의 props에서 왔는지, 수동으로 입력한 것인지 알지 못합니다.

```js
function FormattedDate(props) {
  return <h2>It is {props.date.toLocaleTimeString()}.</h2>;
}
```

[**CodePen에서 시도해보기**](https://codepen.io/gaearon/pen/zKRqNB?editors=0010)

일반적으로 이를 "하향식(top-down)" 또는 "단방향식" 데이터 흐름이라고 합니다. 모든 state는 항상 특정한 컴포넌트가 소유하고 있으며 그 state로부터 파생된 UI 또는 데이터는 오직 트리구조에서 자신의 "아래"에 있는 컴포넌트에만 영향을 미칩니다.

트리구조가 props들의 폭포라고 상상하면 각 컴포넌트의 state는 임의의 점에서 만나지만 동시에 아래로 흐르는 부가적인 수원(water source)이라고 할 수 있습니다.

모든 컴포넌트가 완전히 독립적이라는 것을 보여주기 위해 `App` 렌더링하는 세 개의 `<Clock>`을 만들었습니다.

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
```

[**CodePen에서 시도해보기**](https://codepen.io/gaearon/pen/vXdGmd?editors=0010)

각 `Clock`은 자신만의 타이머를 설정하고 독립적으로 업데이트를 합니다.

React 앱에서 컴포넌트가 유상태 또는 무상태에 대한 것은 시간이 지남에 따라 변경될 수 있는 구현 세부 사항으로 간주합니다. 유상태 컴포넌트 안에서 무상태 컴포넌트를 사용할 수 있으며, 그 반대 경우도 마찬가지로 사용할 수 있습니다.
