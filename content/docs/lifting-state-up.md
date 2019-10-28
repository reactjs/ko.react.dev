---
id: lifting-state-up
title: State 끌어올리기
permalink: docs/lifting-state-up.html
prev: forms.html
next: composition-vs-inheritance.html
redirect_from:
  - "docs/flux-overview.html"
  - "docs/flux-todo-list.html"
---

종종 동일한 데이터에 대한 변경사항을 여러 컴포넌트에 반영해야 할 필요가 있습니다. 이럴 때는 가장 가까운 공통 조상으로 state를 끌어올리는 것이 좋습니다. 이런 일을 어떻게 할 수 있을지 지금부터 살펴봅시다.

이번 섹션에서는 주어진 온도에서 물의 끓는 여부를 추정하는 온도 계산기를 만들어볼 것입니다.

먼저 `BoilingVerdict`라는 이름의 컴포넌트부터 만들어봅시다. 이 컴포넌트는 섭씨온도를 의미하는 `celsius` prop를 받아서 이 온도가 물이 끓기에 충분한지 여부를 출력합니다.

```js{3,5}
function BoilingVerdict(props) {
  if (props.celsius >= 100) {
    return <p>The water would boil.</p>;
  }
  return <p>The water would not boil.</p>;
}
```

그 다음으로 `Calculator`라는 컴포넌트를 만들어보겠습니다. 이 컴포넌트는 온도를 입력할 수 있는 `<input>`을 렌더링하고 그 값을 `this.state.temperature`에 저장합니다.

또한 현재 입력값에 대한 `BoilingVerdict` 컴포넌트를 렌더링합니다.

```js{5,9,13,17-21}
class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {temperature: ''};
  }

  handleChange(e) {
    this.setState({temperature: e.target.value});
  }

  render() {
    const temperature = this.state.temperature;
    return (
      <fieldset>
        <legend>Enter temperature in Celsius:</legend>
        <input
          value={temperature}
          onChange={this.handleChange} />
        <BoilingVerdict
          celsius={parseFloat(temperature)} />
      </fieldset>
    );
  }
}
```

[**CodePen에서 실행하기**](https://codepen.io/gaearon/pen/ZXeOBm?editors=0010)

## 두 번째 Input 추가하기 {#adding-a-second-input}

새 요구사항으로써 섭씨 입력 필드뿐만 아니라 화씨 입력 필드를 추가하고 두 필드 간에 동기화 상태를 유지하도록 해보겠습니다.

`Calculator`에서 `TemperatureInput` 컴포넌트를 빼내는 작업부터 시작해봅시다. 또한 `"c"` 또는 `"f"`의 값을 가질 수 있는 `scale` prop를 추가할 것입니다.

```js{1-4,19,22}
const scaleNames = {
  c: 'Celsius',
  f: 'Fahrenheit'
};

class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {temperature: ''};
  }

  handleChange(e) {
    this.setState({temperature: e.target.value});
  }

  render() {
    const temperature = this.state.temperature;
    const scale = this.props.scale;
    return (
      <fieldset>
        <legend>Enter temperature in {scaleNames[scale]}:</legend>
        <input value={temperature}
               onChange={this.handleChange} />
      </fieldset>
    );
  }
}
```

이제 `Calculator`가 분리된 두 개의 온도 입력 필드를 렌더링하도록 변경할 수 있습니다.

```js{5,6}
class Calculator extends React.Component {
  render() {
    return (
      <div>
        <TemperatureInput scale="c" />
        <TemperatureInput scale="f" />
      </div>
    );
  }
}
```

[**CodePen에서 실행하기**](https://codepen.io/gaearon/pen/jGBryx?editors=0010)

이제 두 개의 입력 필드를 갖게 되었습니다. 그러나 둘 중 하나에 온도를 입력하더라도 다른 하나는 갱신되지 않는 문제가 있습니다. 이것은 두 입력 필드 간에 동기화 상태를 유지하고자 했던 원래 요구사항과는 맞지 않습니다.

또한 `Calculator`에서 `VoilingVerdict`도 역시 보여줄 수 없는 상황입니다. 현재 입력된 온도 정보가 `TemperatureInput` 안에 숨겨져 있으므로 `Calculator`는 그 값을 알 수 없기 때문입니다.

## 변환 함수 작성하기 {#writing-conversion-functions}

먼저, 섭씨를 화씨로, 또는 그 반대로 변환해주는 함수를 작성해보겠습니다.

```js
function toCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5 / 9;
}

function toFahrenheit(celsius) {
  return (celsius * 9 / 5) + 32;
}
```

이 두 함수는 숫자를 변환합니다. 이제 `temperature` 문자열과 변환 함수를 인수로 취해서 문자열을 반환하는 또 다른 함수를 작성해보겠습니다. 그리고 그것을 한 입력값에 기반해 나머지 입력값을 계산하는 용도로 사용할 것입니다.

이 함수는 올바르지 않은 `temperature` 값에 대해서는 빈 문자열을 반환하고 값을 소수점 세 번째 자리로 반올림하여 출력합니다.

```js
function tryConvert(temperature, convert) {
  const input = parseFloat(temperature);
  if (Number.isNaN(input)) {
    return '';
  }
  const output = convert(input);
  const rounded = Math.round(output * 1000) / 1000;
  return rounded.toString();
}
```

예를 들어 `tryConvert('abc', toCelsius)`는 빈 문자열을 반환하고 `tryConvert('10.22', toFahrenheit)`는 `'50.396'`을 반환합니다.

## State 끌어올리기 {#lifting-state-up}

현재는 두 `TemperatureInput` 컴포넌트가 각각의 입력값을 각자의 state에 독립적으로 저장하고 있습니다.

```js{5,9,13}
class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {temperature: ''};
  }

  handleChange(e) {
    this.setState({temperature: e.target.value});
  }

  render() {
    const temperature = this.state.temperature;
    // ...
```

그러나 우리는 두 입력값이 서로의 것과 동기화된 상태로 있길 원합니다. 섭씨온도 입력값을 변경할 경우 화씨온도 입력값 역시 변환된 온도를 반영할 수 있어야 하며, 그 반대의 경우에도 마찬가지여야 합니다.

React에서 state를 공유하는 일은 그 값을 필요로 하는 컴포넌트 간의 가장 가까운 공통 조상으로 state를 끌어올림으로써 이뤄낼 수 있습니다. 이렇게 하는 방법을 "state 끌어올리기"라고 부릅니다. 이제 `TemperatureInput`이 개별적으로 가지고 있던 지역 state를 지우는 대신 `Calculator`로 그 값을 옮겨놓을 것입니다.

`Calculator`가 공유될 state를 소유하고 있으면 이 컴포넌트는 두 입력 필드의 현재 온도에 대한 "진리의 원천(source of truth)"이 됩니다. 이를 통해 두 입력 필드가 서로 간에 일관된 값을 유지하도록 만들 수 있습니다. 두 `TemperatureInput` 컴포넌트의 props가 같은 부모인 `Calculator`로부터 전달되기 때문에, 두 입력 필드는 항상 동기화된 상태를 유지할 수 있게 됩니다.

어떻게 동작하는지 차근차근 살펴봅시다.

우선, `TemperatureInput` 컴포넌트에서 `this.state.temperature`를 `this.props.temperature`로 대체할 것입니다. 지금은 `this.props.temperature`가 이미 존재한다고 가정해봅시다. 나중에는 이 값을 `Calculator`로부터 건네야 할 것입니다.

```js{3}
  render() {
    // Before: const temperature = this.state.temperature;
    const temperature = this.props.temperature;
    // ...
```

[props는 읽기 전용](/docs/components-and-props.html#props-are-read-only)입니다. `temperature`가 지역 state였을 때는 그 값을 변경하기 위해서 그저 `TemperatureInput`의 `this.setState()`를 호출하는 걸로 충분했습니다. 그러나 이제 `temperature`가 부모로부터 prop로 전달되기 때문에 `TemperatureInput`은 그 값을 제어할 능력이 없습니다.

React에서는 보통 이 문제를 컴포넌트를 "제어" 가능하게 만드는 방식으로 해결합니다. DOM `<input>`이 `value`와 `onChange` prop를 건네받는 것과 비슷한 방식으로, 사용자 정의된 `TemperatureInput` 역시 `temperature`와 `onTemperatureChange` props를 자신의 부모인 `Calculator`로부터 건네받을 수 있습니다.

이제 `TemperatureInput`에서 온도를 갱신하고 싶으면 `this.props.onTemperatureChange`를 호출하면 됩니다.

```js{3}
  handleChange(e) {
    // Before: this.setState({temperature: e.target.value});
    this.props.onTemperatureChange(e.target.value);
    // ...
```

>주의
>
>사용자 정의 컴포넌트에서 `temperature`와 `onTemperatureChange` prop의 이름이 특별한 의미를 갖진 않습니다. 일관된 컨벤션으로 `value`와 `onChange`을 사용할 수도 있으며, 여러분이 원하는 그 어떤 이름이든지 사용할 수 있습니다.

`onTemperatureChange` prop는 부모 컴포넌트인 `Calculator`로부터 `temperature` prop와 함께 제공될 것입니다. 이를 이용해 자신의 지역 state를 수정해서 변경사항을 처리하므로, 변경된 새 값을 전달받은 두 입력 필드는 모두 리렌더링될 것입니다. `Calculator`의 새로운 구현체는 조금 뒤에 살펴보겠습니다.

`Calculator`의 변경사항을 들여다보기 전에 `TemperatureInput` 컴포넌트에 대한 변경사항부터 요약해보겠습니다. 이 컴포넌트의 지역 state를 제거했으며 `this.state.temperature` 대신에 `this.props.temperature`를 읽어오도록 변경했습니다. state를 변경하고 싶을 경우 `this.setState()` 대신에 `Calculator`로부터 건네받은 `this.props.onTemperatureChange()`를 호출하도록 만들었습니다.

```js{8,12}
class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onTemperatureChange(e.target.value);
  }

  render() {
    const temperature = this.props.temperature;
    const scale = this.props.scale;
    return (
      <fieldset>
        <legend>Enter temperature in {scaleNames[scale]}:</legend>
        <input value={temperature}
               onChange={this.handleChange} />
      </fieldset>
    );
  }
}
```

이제 다시 `Calculator` 컴포넌트로 와 봅시다.

`temperature`와 `scale`의 현재 입력값을 이 컴포넌트의 지역 state에 저장합니다. 이것은 우리가 입력 필드들로부터 "끌어올린" state이며 그들에 대한 "진리의 원천(source of truth)"으로 작용할 것입니다. 또한 두 입력 필드를 렌더링하기 위해서 알아야 하는 모든 데이터를 최소한으로 표현한 것이기도 합니다.

예를 들어서 섭씨 입력 필드에 37을 입력하면 `Calculator` 컴포넌트의 state는 다음과 같을 것입니다.

```js
{
  temperature: '37',
  scale: 'c'
}
```

이후에 화씨 입력 필드의 값을 212로 수정하면 `Calculator`의 state는 다음과 같은 모습일 것입니다.

```js
{
  temperature: '212',
  scale: 'f'
}
```

두 입력 필드에 모두 값을 저장하는 일도 가능했지만 결국은 불필요한 작업이었던 것입니다. 가장 최근에 변경된 입력값과 그 값이 나타내는 단위를 저장하는 것만으로도 충분합니다. 그러고 나면 현재의 `temperature`와 `scale`에 기반해 다른 입력 필드의 값을 추론할 수 있습니다.

두 입력 필드의 값이 동일한 state로부터 계산되기 때문에 이 둘은 항상 동기화된 상태를 유지하게 됩니다.

```js{6,10,14,18-21,27-28,31-32,34}
class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.handleCelsiusChange = this.handleCelsiusChange.bind(this);
    this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);
    this.state = {temperature: '', scale: 'c'};
  }

  handleCelsiusChange(temperature) {
    this.setState({scale: 'c', temperature});
  }

  handleFahrenheitChange(temperature) {
    this.setState({scale: 'f', temperature});
  }

  render() {
    const scale = this.state.scale;
    const temperature = this.state.temperature;
    const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature;
    const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature;

    return (
      <div>
        <TemperatureInput
          scale="c"
          temperature={celsius}
          onTemperatureChange={this.handleCelsiusChange} />
        <TemperatureInput
          scale="f"
          temperature={fahrenheit}
          onTemperatureChange={this.handleFahrenheitChange} />
        <BoilingVerdict
          celsius={parseFloat(celsius)} />
      </div>
    );
  }
}
```

[**CodePen에서 실행하기**](https://codepen.io/gaearon/pen/WZpxpz?editors=0010)

이제 어떤 입력 필드를 수정하든 간에 `Calculator`의 `this.state.temperature`와 `this.state.scale`이 갱신됩니다. 입력 필드 중 하나는 있는 그대로의 값을 받으므로 사용자가 입력한 값이 보존되고, 다른 입력 필드의 값은 항상 다른 하나에 기반해 재계산됩니다.

입력값을 변경할 때 일어나는 일들을 정리해보겠습니다.

* React는 DOM `<input>`의 `onChange`에 지정된 함수를 호출합니다. 위 예시의 경우 `TemperatureInput`의 `handleChange` 메서드에 해당합니다.
* `TemperatureInput` 컴포넌트의 `handleChange` 메서드는 새로 입력된 값과 함께 `this.props.onTemperatureChange()`를 호출합니다. `onTemperatureChange`를 포함한 이 컴포넌트의 props는 부모 컴포넌트인 `Calculator`로부터 제공받은 것입니다.
* 이전 렌더링 단계에서, `Calculator`는 섭씨 `TemperatureInput`의 `onTemperatureChange`를 `Calculator`의 `handleCelsiusChange` 메서드로, 화씨 `TemperatureInput`의 `onTemperatureChange`를 `Calculator`의 `handleFahrenheitChange` 메서드로 지정해놓았습니다. 따라서 우리가 둘 중에 어떤 입력 필드를 수정하느냐에 따라서 `Calculator`의 두 메서드 중 하나가 호출됩니다.
* 이들 메서드는 내부적으로 `Calculator` 컴포넌트가 새 입력값, 그리고 현재 수정한 입력 필드의 입력 단위와 함께 `this.setState()`를 호출하게 함으로써 React에게 자신을 다시 렌더링하도록 요청합니다.
* React는 UI가 어떻게 보여야 하는지 알아내기 위해 `Calculator` 컴포넌트의 `render` 메서드를 호출합니다. 두 입력 필드의 값은 현재 온도와 활성화된 단위를 기반으로 재계산됩니다. 온도의 변환이 이 단계에서 수행됩니다.
* React는 `Calculator`가 전달한 새 props와 함께 각 `TemperatureInput` 컴포넌트의 `render` 메서드를 호출합니다. 그러면서 UI가 어떻게 보여야 할지를 파악합니다.
* React는 `BoilingVerdict` 컴포넌트에게 섭씨온도를 props로 건네면서 그 컴포넌트의 `render` 메서드를 호출합니다.
* React DOM은 물의 끓는 여부와 올바른 입력값을 일치시키는 작업과 함께 DOM을 갱신합니다. 값을 변경한 입력 필드는 현재 입력값을 그대로 받고, 다른 입력 필드는 변환된 온도 값으로 갱신됩니다.

입력 필드의 값을 변경할 때마다 동일한 절차를 거치고 두 입력 필드는 동기화된 상태로 유지됩니다.

## 교훈 {#lessons-learned}

React 애플리케이션 안에서 변경이 일어나는 데이터에 대해서는 "진리의 원천(source of truth)"을 하나만 두어야 합니다. 보통의 경우, state는 렌더링에 그 값을 필요로 하는 컴포넌트에 먼저 추가됩니다. 그러고 나서 다른 컴포넌트도 역시 그 값이 필요하게 되면 그 값을 그들의 가장 가까운 공통 조상으로 끌어올리면 됩니다. 다른 컴포넌트 간에 존재하는 state를 동기화시키려고 노력하는 대신 [하향식 데이터 흐름](/docs/state-and-lifecycle.html#the-data-flows-down)에 기대는 걸 추천합니다.

state를 끌어올리는 작업은 양방향 바인딩 접근 방식보다 더 많은 "보일러 플레이트" 코드를 유발하지만, 버그를 찾고 격리하기 더 쉽게 만든다는 장점이 있습니다. 어떤 state든 간에 특정 컴포넌트 안에서 존재하기 마련이고 그 컴포넌트가 자신의 state를 스스로 변경할 수 있으므로 버그가 존재할 수 있는 범위가 크게 줄어듭니다. 또한 사용자의 입력을 거부하거나 변형하는 자체 로직을 구현할 수도 있습니다.

어떤 값이 props 또는 state로부터 계산될 수 있다면, 아마도 그 값을 state에 두어서는 안 됩니다. 예를 들어 `celsiusValue`와 `fahrenheitValue`를 둘 다 저장하는 대신, 단지 최근에 변경된 `temperature`와 `scale`만 저장하면 됩니다. 다른 입력 필드의 값은 항상 그 값들에 기반해서 `render()` 메서드 안에서 계산될 수 있습니다. 이를 통해 사용자 입력값의 정밀도를 유지한 채 다른 필드의 입력값에 반올림을 지우거나 적용할 수 있게 됩니다.

<<<<<<< HEAD
UI에서 무언가 잘못된 부분이 있을 경우, [React Developer Tools](https://github.com/facebook/react-devtools)를 이용하여 props를 검사하고 state를 갱신할 책임이 있는 컴포넌트를 찾을 때까지 트리를 따라 탐색해보세요. 이렇게 함으로써 소스 코드에서 버그를 추적할 수 있습니다.
=======
When you see something wrong in the UI, you can use [React Developer Tools](https://github.com/facebook/react/tree/master/packages/react-devtools) to inspect the props and move up the tree until you find the component responsible for updating the state. This lets you trace the bugs to their source:
>>>>>>> 081bb31226919062938ef924472ba1b4170facfc

<img src="../images/docs/react-devtools-state.gif" alt="Monitoring State in React DevTools" max-width="100%" height="100%">
