---
id: react-without-es6
title: ES6 없이 사용하는 React
permalink: docs/react-without-es6.html
---

보통 React 컴포넌트를 정의할 때 JavaScript의 class를 사용한다면 이와 같을 겁니다.

```javascript
class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

아직 ES6를 사용하지 않는다면, 그 대신 `create-react-class` 모듈을 사용할 수도 있습니다.


```javascript
var createReactClass = require('create-react-class');
var Greeting = createReactClass({
  render: function() {
    return <h1>Hello, {this.props.name}</h1>;
  }
});
```

ES6 class의 API는 몇몇 차이점을 제외하고는 `createReactClass()`와 비슷합니다.

## Props 기본값 선언 {#declaring-default-props}

함수와 ES6의 class를 통해 `defaultProps`를 컴포넌트 그 자체의 속성으로서 정의할 수 있습니다.

```javascript
class Greeting extends React.Component {
  // ...
}

Greeting.defaultProps = {
  name: 'Mary'
};
```

`createReactClass()`를 사용한다면, 인자로 넘겨지는 객체 내에서 `getDefaultProps()`를 함수로 정의해야 합니다.

```javascript
var Greeting = createReactClass({
  getDefaultProps: function() {
    return {
      name: 'Mary'
    };
  },

  // ...

});
```

## 초기 State 정의 {#setting-the-initial-state}

ES6 class의 생성자에서 `this.state`에 값을 할당하면 state의 초기값을 정의할 수 있습니다.

```javascript
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: props.initialCount};
  }
  // ...
}
```

 `createReactClass()`를 사용할 때마다 초기 state를 반환하는 `getInitialState` 메서드를 제공해야만 합니다.

```javascript
var Counter = createReactClass({
  getInitialState: function() {
    return {count: this.props.initialCount};
  },
  // ...
});
```

## 자동 바인딩 {#autobinding}

ES6 class로서 선언된 React 컴포넌트에서 메서드는 일반적인 ES6 class일 때와 비슷합니다. 즉, `this`를 인스턴스에 자동으로 바인딩하지 않습니다. 따라서 이 경우에는 생성자에서 별도로 `.bind(this)`를 사용해 주어야 합니다.

```javascript
class SayHello extends React.Component {
  constructor(props) {
    super(props);
    this.state = {message: 'Hello!'};
    // 이 부분이 중요합니다!
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    alert(this.state.message);
  }

  render() {
    // `this.handleClick`이 바인딩 되었기 때문에, 이를 이벤트 핸들러로 사용할 수 있습니다.
    return (
      <button onClick={this.handleClick}>
        Say hello
      </button>
    );
  }
}
```

반면에 `createReactClass()`를 사용한다면, 알아서 모든 메서드를 바인딩하기 때문에 위의 과정이 필요하지는 않습니다.

```javascript
var SayHello = createReactClass({
  getInitialState: function() {
    return {message: 'Hello!'};
  },

  handleClick: function() {
    alert(this.state.message);
  },

  render: function() {
    return (
      <button onClick={this.handleClick}>
        Say hello
      </button>
    );
  }
});
```

이는 ES6의 class를 사용해 이벤트 핸들러를 만드는 경우에는 다른 방법으로 처리할 때 보다 반복되는 코드가 많아진다는 뜻입니다. 하지만 큰 규모의 애플리케이션에서는 class를 사용하는 경우에 성능이 조금 더 좋아집니다.

<<<<<<< HEAD

보일러플레이트 코드를 정 쓰기 싫다면, **실험적인** [Class Properties](https://babeljs.io/docs/plugins/transform-class-properties/) 문법을 Babel을 통해 사용할 수도 있습니다.
=======
If the boilerplate code is too unattractive to you, you may use [ES2022 Class Properties](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Public_class_fields#public_instance_fields) syntax:
>>>>>>> c1c3d1db304adfa5446accb0312e60d515188414


```javascript
class SayHello extends React.Component {
  constructor(props) {
    super(props);
    this.state = {message: 'Hello!'};
  }
<<<<<<< HEAD
  // 경고: 이 문법은 실험적입니다!
  // 화살표 함수를 통해 메서드를 바인딩합니다.
=======
  
  // Using an arrow here binds the method:
>>>>>>> c1c3d1db304adfa5446accb0312e60d515188414
  handleClick = () => {
    alert(this.state.message);
  };

  render() {
    return (
      <button onClick={this.handleClick}>
        Say hello
      </button>
    );
  }
}
```

<<<<<<< HEAD
위 코드에서 쓰인 문법은 **실험적인** 상태이므로 그 내용이 변할 수 있거나, JavaScript에 반영되지 않을 수 있습니다.

=======
You also have a few other options:
>>>>>>> c1c3d1db304adfa5446accb0312e60d515188414

안전한 길을 원한다면 몇 가지 선택지가 있습니다.

* 생성자에서 메서드들을 바인딩합니다.
* `onClick={(e) => this.handleClick(e)}`와 같이 화살표 함수를 사용합니다.
* `createReactClass`를 계속 사용합니다.

## Mixins {#mixins}

>**주의**
>
>ES6에서는 처음부터 mixin에 대한 어떠한 지원도 없었습니다. 따라서, React에서 ES6 class를 사용하고자 하는 경우에도 mixin에 대한 별도의 지원은 없습니다.
>
>
>**또한 저희 팀은 mixin을 사용한 Codebase에서 수 많은 문제점들을 발견했습니다. 이에 따라 저희는 [새로 작성하는 코드에서는 mixin을 사용하지 않는 것을 추천드립니다.](/blog/2016/07/13/mixins-considered-harmful.html)**

>
>해당 글은 참고목적으로만 보시길 바랍니다.

가끔은 전혀 다른 컴포넌트들이 어느 정도 유사한 기능을 공유할 수도 있습니다. 간혹 발생하는 이러한 경우를 번역과 링크에 관한 [횡단 관심사](https://ko.wikipedia.org/wiki/횡단_관심사)라고 부릅니다.
이 문제에 대한 대처법으로서 `createReactClass`를 통해 더 이상 쓰이지 않는 코드인 `mixins`을 사용할 수 있습니다.

mixin을 사용하는 흔한 예로는 시간 간격을 두고 반복적으로 스스로 내용을 갱신하는 컴포넌트를 만들고자 할 경우가 있습니다. 이는 `setInterval()`을 사용하면 간단하게 만들 수 있지만, 메모리를 절약하기 위해서 컴포넌트를 더 이상 사용하지 않을 때 이를 취소하는 것이 중요합니다. React는 [생명주기 메서드](/docs/react-component.html#the-component-lifecycle)를 제공합니다. 생명주기 메서드는 컴포넌트가 생성되거나 파괴되기 직전에 이를 알려주는 역할을 합니다. 생명주기 메서드를 이용하는 간단한 mixin을 만들어 보겠습니다. 이 mixin은 컴포넌트가 파괴될 때 자동으로 정리되는 `setInterval()` 함수 기능을 제공해 줍니다.


```javascript
var SetIntervalMixin = {
  componentWillMount: function() {
    this.intervals = [];
  },
  setInterval: function() {
    this.intervals.push(setInterval.apply(null, arguments));
  },
  componentWillUnmount: function() {
    this.intervals.forEach(clearInterval);
  }
};

var createReactClass = require('create-react-class');

var TickTock = createReactClass({
  mixins: [SetIntervalMixin], // mixin을 사용
  getInitialState: function() {
    return {seconds: 0};
  },
  componentDidMount: function() {
    this.setInterval(this.tick, 1000); // mixin에서 메서드를 호출
  },
  tick: function() {
    this.setState({seconds: this.state.seconds + 1});
  },
  render: function() {
    return (
      <p>
        React has been running for {this.state.seconds} seconds.
      </p>
    );
  }
});

const root = ReactDOM.createRoot(document.getElementById('example'));
root.render(<TickTock />);
```

하나의 컴포넌트가 같은 생명주기 메서드를 정의한 여러 mixin을 사용한다고 생각해봅시다. 예를 든다면, mixin들이 컴포넌트가 파괴될 때 어떠한 정리 동작을 하려고 할 수도 있습니다. 이 때는 모든 생명주기 메서드의 호출이 보장됩니다. mixin에서 정의된 생명주기 메서드들은 mixin이 나열된 순서대로 작동되며 그 뒤에 컴포넌트의 메서드가 호출됩니다.
