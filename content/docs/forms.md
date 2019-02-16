---
id: forms
title: 폼
permalink: docs/forms.html
prev: lists-and-keys.html
next: lifting-state-up.html
redirect_from:
  - "tips/controlled-input-null-value.html"
  - "docs/forms-zh-CN.html"
---

HTML 폼 엘리머트는 폼 엘리머트 자체가 내부 상태를 가지기 때문에, React의 다른 DOM 엘리머트와 조금 다르게 동작합니다. 예를 들어, 순수한 HTML에서 이 폼은 name을 입력받습니다.   

```html
<form>
  <label>
    Name:
    <input type="text" name="name" />
  </label>
  <input type="submit" value="Submit" />
</form>
```

이 폼은 사용자가 폼을 전송하면 새로운 페이지로 이동하는 기본 HTML 폼 동작을 수행합니다. 만약 React에서 동일한 동작을 원한다면 그대로 사용하면 됩니다. 그러나 대부분의 경우, JavaScript 함수로 폼의 전송을 처리하고 사용자가 폼에 입력한 데이터에 접근하도록 하는 것이 편리합니다. 이를 위한 표준 방식은 "제어되는 컴포넌트 (controlled components)"라고 불리는 기술을 이용하는 것입니다. 

## 제어되는 컴포넌트 (Controlled Component) {#controlled-components}

HTML에서 `<input>`, `<textarea>`, `<select>`와 같은 폼 엘리먼트는 일반적으로 사용자의 입력을 기반으로 자신의 state를 관리하고 업데이트한다. React에서는 변경할 수 있는 state가 일반적으로 컴포넌트의 state 속성에 유지되며 [`setState()`](/docs/react-component.html#setstate)에 의해 업데이트됩니다.

우리는 React state를 "신뢰 가능한 단일 소스 (single source of truth)"로 만들어 두 요소를 결합할 수 있습니다. 그런 다음 한 폼을 렌더링하는 React 컴포넌트는 다음 사용자 입력시 그 폼에서 발생하는 일을 제어합니다. 이러한 방식으로 React에 의해 값이 제어되는 입력 폼 엘리먼트를 "제어되는 컴포넌트 (controlled component)"라고 합니다.

예를 들어, 만약 이전 예제가 전송될 때 이름을 기록하길 원한다면 폼을 제어되는 컴포넌트 (controlled component)로 작성할 수 있습니다:

```javascript{4,10-12,24}
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

[**CodePen에서 실행하기**](https://codepen.io/gaearon/pen/VmmPgp?editors=0010)

`value` 어트리뷰트는 폼 엘리먼트에 설정되므로 표시되는 값은 항상 `this.state.value`가 되고 React state는 신뢰 가능한 단일소스 (single source of truth)가 됩니다. React state를 업데이트하기 위해 모든 키스트로크에서 `handleChange`가 동작하기 때문에 사용자가 입력할 때 보여지는 값이 업데이트됩니다.

제어되는 컴포넌트로 모든 state 변이에는 연관된 핸들러 기능이 있습니다. 이것을 통해 사용자 입력을 수정하거나 유효성을 검사하는 것이 간단해집니다. 예를들어, 이름이 모두 대문자로 쓰여지게 하고 싶다 `handleChange`를 다음과 같이 사용할 수 있습니다:   

```javascript{2}
handleChange(event) {
  this.setState({value: event.target.value.toUpperCase()});
}
```

## textarea 태그 {#the-textarea-tag}

HTML에서 `<textarea>` 엘리먼트는 텍스트를 자식으로 정의합니다:

```html
<textarea>
  Hello there, this is some text in a text area
</textarea>
```

React에서 `<textarea>`는 `value` 어트리뷰트는 대신 사용합니다. 이렇게하면 `<textarea>`를 사용하는 폼은 한 줄 입력을 사용하는 폼과 유사하게 작성할 수 있습니다:  

```javascript{4-6,12-14,26}
class EssayForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Please write an essay about your favorite DOM element.'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('An essay was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Essay:
          <textarea value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

`this.state.value`를 생성자에서 초기화하므로 textare는 일부 텍스트를 가진채 시작됩니다.

## select 태그 {#the-select-tag}

HTML에서 `<select>`는 드롭 다운 목록을 만듭니다. 예를 들어, 이 HTML은 과일 드롭 다운 목록을 만듭니다: 

```html
<select>
  <option value="grapefruit">Grapefruit</option>
  <option value="lime">Lime</option>
  <option selected value="coconut">Coconut</option>
  <option value="mango">Mango</option>
</select>
```

`selected` 옵션이 있으므로 Coconut 옵션이 초기값이 된다. React에서는 `selected` 어트리뷰트를 사용하는 대신 최상단 `select`태그에 `value` 어트리뷰트를 사용합니다. 한 곳에서 업데이트만 하면되기 때문에 제어되는 컴포넌트에서 사용하기 더 편합니다. 예를 들어: 

```javascript{4,10-12,24}
class FlavorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: 'coconut'};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('Your favorite flavor is: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Pick your favorite flavor:
          <select value={this.state.value} onChange={this.handleChange}>
            <option value="grapefruit">Grapefruit</option>
            <option value="lime">Lime</option>
            <option value="coconut">Coconut</option>
            <option value="mango">Mango</option>
          </select>
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

[**CodePen에서 실행하기**](https://codepen.io/gaearon/pen/JbbEzX?editors=0010)

전반적으로 `<input type="text">`, `<textarea>` 및 `<select>` 모두 매우 유사하게 동작합니다. - 모두 제어된 컴포넌트를 구현하는데 `value` 어트리뷰트를 허용합니다.   

> Note
>
> `select` 태그에 multiple 옵션을 허용한다면 `value` 어트리뷰트에 배열을 전달할 수 있습니다.
>
>```js
><select multiple={true} value={['B', 'C']}>
>```

## file input 태그 {#the-file-input-tag}

HTML에서 `<input type="file">`는 사용자가 하나 이상의 파일을 자신의 장치 저장소에서 서버로 업로드하거나 [File API](https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications)를 통해 JavaScript로 조작할 수 있습니다.

```html
<input type="file" />
```

읽기 전용이기때문에 React에서 **제어되지 않는** 컴포넌트입니다. [문서 뒷부분](/docs/uncontrolled-components.html#the-file-input-tag)에서 다른 제어되지 않는 컴포넌트와 함께 설명하고 있습니다. 

## 다중 입력 제어하기 {#handling-multiple-inputs}

여러 `input` 엘리먼트를 제어해야할 때, 각 엘리먼트에 `name` 어트리뷰트를 추가하고 수행할 작업이 `event.target.name`의 값으로 선택하게 할 수 있습니다. 

예를 들어:

```javascript{15,18,28,37}
class Reservation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isGoing: true,
      numberOfGuests: 2
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <form>
        <label>
          Is going:
          <input
            name="isGoing"
            type="checkbox"
            checked={this.state.isGoing}
            onChange={this.handleInputChange} />
        </label>
        <br />
        <label>
          Number of guests:
          <input
            name="numberOfGuests"
            type="number"
            value={this.state.numberOfGuests}
            onChange={this.handleInputChange} />
        </label>
      </form>
    );
  }
}
```

[**CodePen에서 실행하기**](https://codepen.io/gaearon/pen/wgedvV?editors=0010)

주어진 입력 name에 일치하는 state를 업데이트하기 위해 ES6의 [computed property name](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Object_initializer#Computed_property_names) 구문을 사용하고 있습니다.

```js{2}
this.setState({
  [name]: value
});
```

ES5 코드는 아래와 같습니다:

```js{2}
var partialState = {};
partialState[name] = value;
this.setState(partialState);
```

또한, `setState()`는 자동적으로 [현재 state에 일부 state를 병합](/docs/state-and-lifecycle.html#state-updates-are-merged)하기 때문에 바뀐 부분에 대해서만 호출하면 됩니다.

## 제어되는 Input Null 값 {#controlled-input-null-value}

[제어되는 컴포넌트](/docs/forms.html#controlled-components)에 prop 값을 지정하면 원하는 경우가 아니라면 사용자가 변경할 수 없습니다. 만약 `value`를 설정햇는데 여전히 수정할 수 있다면 실수로 `value`를 `undefined`나 `null`로 설정했을 수 있습니다.

(The input is locked at first but becomes editable after a short delay.)

아래 코드가 이것을 증명합니다. (첫번째 입력은 잠겨있지만 몇 초후 입력이 가능하게 됩니다.)

```javascript
ReactDOM.render(<input value="hi" />, mountNode);

setTimeout(function() {
  ReactDOM.render(<input value={null} />, mountNode);
}, 1000);

```

## 제어되는 컴포넌트의 대안 {#alternatives-to-controlled-components}

데이터를 변경할 수 있는 모든 방법에 대해 이벤트 처리기를 작성하고 React 구성 요소를 통해 모든 입력 상태를 파이프해야하기 때문에, 때로는 제어되는 컴포넌트를 사용하는 것이 지루할 수 있습니다. 특히 기존의 코드베이스를 React로 변경하고자 할 때나 React가 아닌 라이브러리와 React 애플리케이션을 통합하고자 할 때 짜증날 수 있습니다. 이러한 경우에 입력 폼을 구현하기 위한 대체 기술인 [제어되지 않는 컴포넌트](/docs/uncontrolled-components.html)를 확인할 수 있습니다.   

## 완전한 해결책 {#fully-fledged-solutions}

유효성 검사, 방문한 필드 추적 및 폼 전송 처리와 같은 완벽한 해결을 원한하면 [Formik](https://jaredpalmer.com/formik)이 대중적인 선택 중 하나입니다. 그러나 Formik은 제어되는 컴포넌트와 state 관리의 원리가 같기때문에 배우는걸 쉽게 생각하면 안됩니다. 
