---
id: faq-functions
title: 컴포넌트에 함수 전달하기
permalink: docs/faq-functions.html
layout: docs
category: FAQ
---

### 컴포넌트로 onClick과 같은 이벤트 핸들러를 어떻게 전달 할까요? {#how-do-i-pass-an-event-handler-like-onclick-to-a-component}

자식 컴포넌트에 프로퍼티로 이벤트 핸들러와 다른 함수들을 전달합니다.

```jsx
<button onClick={this.handleClick}>
```

핸들러 안에서 부모 컴포넌트에 접근할 필요가 있으면 컴포넌트 인스턴스에 함수를 바인딩해 주어야 합니다.

### 컴포넌트 인스턴스로 함수를 어떻게 바인딩할까요? {#how-do-i-bind-a-function-to-a-component-instance}

사용하고 있는 문법과 빌드 단계에 따라 `this.props`, `this.state`와 같은 컴포넌트의 어트리뷰트에 함수들이 확실히 접근할 수 있도록 만드는 방법은 여러 가지가 있습니다.

#### 생성자에서 바인딩하기 (ES2015) {#bind-in-constructor-es2015}

```jsx
class Foo extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    console.log('Click happened');
  }
  render() {
    return <button onClick={this.handleClick}>Click Me</button>;
  }
}
```

<<<<<<< HEAD
#### 클래스 프로퍼티 (Stage 3 Proposal) {#class-properties-stage-3-proposal}

```jsx
class Foo extends Component {
  // 주의: 이 문법은 실험단계이며 아직 표준이 아닙니다.
=======
#### Class Properties (ES2022) {#class-properties-es2022}

```jsx
class Foo extends Component {
>>>>>>> 4808a469fa782cead9802619b0341b27b342e2d3
  handleClick = () => {
    console.log('Click happened');
  };
  render() {
    return <button onClick={this.handleClick}>Click Me</button>;
  }
}
```

#### render 메서드 안에서 바인딩하기 {#bind-in-render}

```jsx
class Foo extends Component {
  handleClick() {
    console.log('Click happened');
  }
  render() {
    return <button onClick={this.handleClick.bind(this)}>Click Me</button>;
  }
}
```

>**주의**
>
>`Function.prototype.bind`를 render 메서드에서 사용하면 컴포넌트가 렌더링할 때마다 새로운 함수를 생성하기 때문에 성능에 영향을 줄 수 있습니다.

#### render 메서드 안에서 화살표 함수 사용 {#arrow-function-in-render}

```jsx
class Foo extends Component {
  handleClick() {
    console.log('Click happened');
  }
  render() {
    return <button onClick={() => this.handleClick()}>Click Me</button>;
  }
}
```

>**주의**
>
> render 메서드 안에서 화살표 함수를 사용하면 컴포넌트가 렌더링할 때마다 새로운 함수를 만들기 때문에 엄격한 비교에 의해 최적화가 깨질 수 있습니다.

### render 메서드 안에서 화살표 함수를 사용해도 괜찮을까요? {#is-it-ok-to-use-arrow-functions-in-render-methods}

이 방법은 대체로 사용해도 괜찮고, 콜백 함수로 매개변수를 전달해 주는 가장 쉬운 방법입니다.

성능 문제가 있다면 반드시 최적화를 해야 합니다.

### 바인딩이 필요한 이유는 무엇일 까요? {#why-is-binding-necessary-at-all}

자바스크립트에서 아래 두 개의 코드 조각은 **동일하지 않습니다**.

```js
obj.method();
```

```js
var method = obj.method;
method();
```

바인딩 메서드는 두 번째 코드 조각이 첫 번째 코드조각과 같은 방식으로 작동하도록 만들어 줍니다.

일반적으로 React에서 다른 컴포넌트에 메서드를 **전달**해 줄 때만 바인딩해 주면 됩니다. 예를 들어 `<button onClick={this.handleClick}>`는 `this.handleClick`을 전달하여 바인딩합니다. 그렇지만 `render` 메서드나 생명주기 메서드는 다른 컴포넌트로 전달하지 않기 때문에 바인딩할 필요가 없습니다.

[Yehuda Katz의 글](https://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/)에서 바인딩이 무엇인지, JavaScript에서 어떻게 함수가 작동하는지에 대해 상세히 알 수 있습니다.

### 왜 컴포넌트가 렌더링할 때마다 함수가 호출될까요? {#why-is-my-function-being-called-every-time-the-component-renders}

컴포넌트로 함수를 전달할 때 _호출하지 않는지_ 확인합니다.

```jsx
render() {
  // 잘못된 방법: handleClick은 레퍼런스로 전달되지 않고 호출되었습니다!
  return <button onClick={this.handleClick()}>Click Me</button>
}
```

위와 같은 방식이 아니라 괄호 없이 _함수 그 자체를 전달해야 합니다._

```jsx
render() {
  // 올바른 방법 : handleClick이 레퍼런스로 전달되었습니다.
  return <button onClick={this.handleClick}>Click Me</button>
}
```

### 이벤트 핸들러나 콜백에 어떻게 매개변수를 전달할나요? {#how-do-i-pass-a-parameter-to-an-event-handler-or-callback}

이벤트 핸들러에 화살표 함수를 사용하여 감싼 다음에 매개변수를 넘겨줄 수 있습니다.

```jsx
<button onClick={() => this.handleClick(id)} />
```

`.bind`를 호출한 것과 같습니다.

```jsx
<button onClick={this.handleClick.bind(this, id)} />
```

#### 예시: 화살표 함수를 이용하여 매개변수 전달하기 {#example-passing-params-using-arrow-functions}

```jsx
const A = 65 // ASCII character code

class Alphabet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      justClicked: null,
      letters: Array.from({length: 26}, (_, i) => String.fromCharCode(A + i))
    };
  }
  handleClick(letter) {
    this.setState({ justClicked: letter });
  }
  render() {
    return (
      <div>
        Just clicked: {this.state.justClicked}
        <ul>
          {this.state.letters.map(letter =>
            <li key={letter} onClick={() => this.handleClick(letter)}>
              {letter}
            </li>
          )}
        </ul>
      </div>
    )
  }
}
```

#### 예시: data-attributes를 사용해서 매개변수 전달하기 {#example-passing-params-using-data-attributes}

다른 방법으로 이벤트 핸들러에 필요한 데이터를 저장하기 위해 DOM API를 사용할 수 있습니다. 이 방법은 아주 많은 요소를 최적화하거나 React.PureComponent 동일성 검사에 의존하는 렌더링 트리를 사용할 때 고려해 볼 만합니다.

```jsx
const A = 65 // ASCII character code

class Alphabet extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      justClicked: null,
      letters: Array.from({length: 26}, (_, i) => String.fromCharCode(A + i))
    };
  }

  handleClick(e) {
    this.setState({
      justClicked: e.target.dataset.letter
    });
  }

  render() {
    return (
      <div>
        Just clicked: {this.state.justClicked}
        <ul>
          {this.state.letters.map(letter =>
            <li key={letter} data-letter={letter} onClick={this.handleClick}>
              {letter}
            </li>
          )}
        </ul>
      </div>
    )
  }
}
```

### 어떻게 함수가 너무 빨리, 너무 많이 호출되는 것을 막을 수 있나요? {#how-can-i-prevent-a-function-from-being-called-too-quickly-or-too-many-times-in-a-row}

`onClick` 또는 `onScroll`과 같은 이벤트 핸들러를 사용하고 있을 때 콜백이 너무 빠르게 호출되지 않도록 콜백이 실행되는 속도를 제어할 수 있습니다. 다음의 함수들을 사용하면 됩니다.

- **throttling**: 시간 기반 빈도에 따른 변경 샘플링 (예시 [`_.throttle`](https://lodash.com/docs#throttle))
- **debouncing**: 비활성 주기 이후에 변경 적용 (예시 [`_.debounce`](https://lodash.com/docs#debounce))
- **`requestAnimationFrame` throttling**: [`requestAnimationFrame`](https://developer.mozilla.org/ko/docs/Web/API/window/requestAnimationFrame) (예시 [`raf-schd`](https://github.com/alexreardon/raf-schd))을 기반으로 한 변경 샘플링

`throttle`과 `debounce` 함수를 비교하고 싶으면 [시각화](http://demo.nimius.net/debounce_throttle/)를 확인하면 됩니다.

> 주의
>
> `_.debounce`, `_.throttle`, `raf-schd`는 지연되는 콜백을 취소하는 메서드 `cancel`을 제공합니다. `componentWillUnmount`에서 이 함수를 사용하거나 또는 지연된 함수 내에서 컴포넌트가 마운트가 되어있음을 확인해야 합니다.

#### Throttle {#throttle}

Throttling은 함수가 주어진 시간 동안에 한 번 이상 호출되는 것을 막습니다. 아래는 "click" 핸들러에 throttling을 사용하여 초당 한 번만 호출되도록 한 예시입니다.

```jsx
import throttle from 'lodash.throttle';

class LoadMoreButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleClickThrottled = throttle(this.handleClick, 1000);
  }

  componentWillUnmount() {
    this.handleClickThrottled.cancel();
  }

  render() {
    return <button onClick={this.handleClickThrottled}>Load More</button>;
  }

  handleClick() {
    this.props.loadMore();
  }
}
```

#### Debounce {#debounce}

Debouncing은 함수가 마지막으로 호출된 후 특정 시간까지 실행되지 않도록 해줍니다. 빠르게 발행하는 이벤트(예시 스크롤, 키보드 이벤트)의 응답으로 어떤 비싼 계산을 수행해야 할 때 사용하면 좋습니다. 아래의 예시는 250 밀리초 이내의 텍스트 입력을 Debouncing했습니다.

```jsx
import debounce from 'lodash.debounce';

class Searchbox extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.emitChangeDebounced = debounce(this.emitChange, 250);
  }

  componentWillUnmount() {
    this.emitChangeDebounced.cancel();
  }

  render() {
    return (
      <input
        type="text"
        onChange={this.handleChange}
        placeholder="Search..."
        defaultValue={this.props.value}
      />
    );
  }

  handleChange(e) {
    this.emitChangeDebounced(e.target.value);
  }

  emitChange(value) {
    this.props.onChange(value);
  }
}
```

#### `requestAnimationFrame` throttling {#requestanimationframe-throttling}

[`requestAnimationFrame`](https://developer.mozilla.org/ko/docs/Web/API/window/requestAnimationFrame)은 렌더링 성능을 위해 브라우저에서 최적화된 시간에 함수가 실행되도록 함수를 큐잉하는 방법입니다. `requestAnimationFrame`의 큐로 들어간 함수는 다음 프레임에서 실행됩니다. 브라우저는 1초당 60 프레임(60 fps)을 보장하기 위해 열심히 일합니다. 하지만 브라우저가 이를 하지 못할때 저절로 프레임을 *제한*합니다. 예를 들면 한 기기가 30 fps만 처리할 수 있다면 1초 동안 30 프레임만 얻을 수 있습니다. throttling을 위해 `requestAnimationFrame`을 사용하면 1초에 60번 이상 업데이트하는 것을 막을 수 있습니다. 1초당 100번 업데이트하도록 브라우저에 일을 만들어 주어도, 유저는 이를 확인할 수 없습니다.

>**주의**
>
>이 기법을 사용하면, 프레임에 가장 마지막으로 게재된 값만 사용하게 됩니다. 최적화가 어떻게 작동하는지에 대한 예시는 [`MDN`](https://developer.mozilla.org/ko/docs/Web/Events/scroll)에서 확인할 수 있습니다.

```jsx
import rafSchedule from 'raf-schd';

class ScrollListener extends React.Component {
  constructor(props) {
    super(props);

    this.handleScroll = this.handleScroll.bind(this);

    // 업데이트 일정을 정하는 함수를 만듭니다.
    this.scheduleUpdate = rafSchedule(
      point => this.props.onScroll(point)
    );
  }

  handleScroll(e) {
    // 스크롤 이벤트를 받게 되면 업데이트를 일정에 추가합니다.
    // 한 프레임 안에 많은 업데이트를 받으면 오직 마지막 값만 게재합니다.
    this.scheduleUpdate({ x: e.clientX, y: e.clientY });
  }

  componentWillUnmount() {
    // 마운트 해제 중에 임시상태의 업데이트들을 모두 취소합니다.
    this.scheduleUpdate.cancel();
  }

  render() {
    return (
      <div
        style={{ overflow: 'scroll' }}
        onScroll={this.handleScroll}
      >
        <img src="/my-huge-image.jpg" />
      </div>
    );
  }
}
```

#### 속도 제한 테스트 방법 {#testing-your-rate-limiting}

속도 제한 코드가 잘 작동하는지 테스트할 때, 빨리 감기 기능을 사용하는 것이 좋습니다. [`jest`](https://facebook.github.io/jest/)를 사용한다면 [`mock timers`](https://facebook.github.io/jest/docs/en/timer-mocks.html)를 빨리 감기 도구로 사용할 수 있습니다. `requestAnimationFrame` throttling을 사용한다면 애니메이션 프레임의 틱을 제어하기 위한 툴로
[`raf-stub`](https://github.com/alexreardon/raf-stub)를 보면 좋습니다.
