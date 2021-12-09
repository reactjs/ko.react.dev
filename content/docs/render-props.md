---
id: render-props
title: Render Props
permalink: docs/render-props.html
---

["render prop"](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce)란, React 컴포넌트 간에 코드를 공유하기 위해 함수 props를 이용하는 간단한 테크닉입니다.

render props 패턴으로 구현된 컴포넌트는 자체적으로 렌더링 로직을 구현하는 대신, react 엘리먼트 요소를 반환하고 이를 호출하는 함수를 사용합니다.

```jsx
<DataProvider render={data => (
  <h1>Hello {data.target}</h1>
)}/>
```

render props를 사용하는 라이브러리는 [React Router](https://reacttraining.com/react-router/web/api/Route/Route-render-methods), [Downshift](https://github.com/paypal/downshift), [Formik](https://github.com/jaredpalmer/formik)이 있습니다.

이 문서에서는 render props가 왜 유용하고, 어떻게 여러분의 프로젝트에 적용할 수 있을지에 관해 이야기 하겠습니다.

## 횡단 관심사(Cross-Cutting Concerns)를 위한 render props 사용법 {#use-render-props-for-cross-cutting-concerns}

컴포넌트는 React에서 코드의 재사용성을 위해 사용하는 주요 단위입니다. 하지만 컴포넌트에서 캡슐화된 상태나 동작을 같은 상태를 가진 다른 컴포넌트와 공유하는 방법이 항상 명확하지는 않습니다.

예를 들면, 아래 컴포넌트는 웹 애플리케이션에서 마우스 위치를 추적하는 로직입니다.

```js
class MouseTracker extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>
        <h1>Move the mouse around!</h1>
        <p>The current mouse position is ({this.state.x}, {this.state.y})</p>
      </div>
    );
  }
}
```

스크린 주위로 마우스 커서를 움직이면, 컴포넌트가 마우스의 (x, y) 좌표를 `<p>`에 나타냅니다.

여기서 질문입니다. 다른 컴포넌트에서 이 행위를 재사용하려면 어떻게 해야 할까요? 즉, 다른 컴포넌트에서 커서(cursor) 위치에 대해 알아야 할 경우, 쉽게 공유할 수 있도록 캡슐화할 수 있습니까?

React에서 컴포넌트는 코드 재사용의 기본 단위이므로, 우리가 필요로 하는 마우스 커서 트래킹 행위를 `<Mouse>` 컴포넌트로 캡슐화하여 어디서든 사용할 수 있게 리팩토링 해보겠습니다.

```js
// <Mouse> 컴포넌트는 우리가 원하는 행위를 캡슐화 합니다...
class Mouse extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>

        {/* ...하지만 <p>가 아닌 다른것을 렌더링하려면 어떻게 해야 할까요? */}
        <p>The current mouse position is ({this.state.x}, {this.state.y})</p>
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <>
        <h1>Move the mouse around!</h1>
        <Mouse />
      </>
    );
  }
}
```

이제 `<Mouse>` 컴포넌트는 마우스 움직임 이벤트를 감지하고, 마우스 커서의 `(x, y)`위치를 저장하는 행위를 캡슐화했습니다. 그러나 아직 완벽하게 재사용할 수 있는 건 아닙니다.

예를 들어, 마우스 주위에 고양이 그림을 보여주는 `<Cat>` 컴포넌트를 생각해 보겠습니다. 우리는 `<Cat mouse={{x, y}}>` prop을 통해 Cat 컴포넌트에 마우스 좌표를 전달해주고 화면에 어떤 위치에 이미지를 보여줄지 알려 주고자 합니다.

첫 번째 방법으로는, 다음과 같이 `<Mouse>` 컴포넌트의 *render 메서드안에* `<Cat>` 컴포넌트를 넣어 렌더링하는 방법이 있습니다.

```js
class Cat extends React.Component {
  render() {
    const mouse = this.props.mouse;
    return (
      <img src="/cat.jpg" style={{ position: 'absolute', left: mouse.x, top: mouse.y }} />
    );
  }
}

class MouseWithCat extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>

        {/*
          여기서 <p>를 <Cat>으로 바꿀 수 있습니다. ... 그러나 이 경우
          Mouse 컴포넌트를 사용할 때 마다 별도의 <MouseWithSomethingElse>
          컴포넌트를 만들어야 합니다, 그러므로 <MouseWithCat>는
          아직 정말로 재사용이 가능한게 아닙니다.
        */}
        <Cat mouse={this.state} />
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>
        <MouseWithCat />
      </div>
    );
  }
}
```

이러한 접근 방법은 특정 사례에서는 적용할 수 있지만, 우리가 원하는 행위의 캡슐화(마우스 트래킹)라는 목표는 달성하지 못했습니다. 이제 우리는 다른 사용 예시에서도 언제든지 마우스 위치를 추적할 수 있는 새로운 component(`<MouseWithCat>`과 근본적으로 다른)를 만들어야 합니다.

여기에 render prop를 사용할 수 있습니다. `<Mouse>` 컴포넌트 안에 `<Cat>` 컴포넌트를 하드 코딩(hard-coding)해서 결과물을 바꾸는 대신에, `<Mouse>`에게 동적으로 렌더링할 수 있도록 해주는 함수 prop을 제공하는 것입니다. — 이것이 render prop의 개념입니다.

```js
class Cat extends React.Component {
  render() {
    const mouse = this.props.mouse;
    return (
      <img src="/cat.jpg" style={{ position: 'absolute', left: mouse.x, top: mouse.y }} />
    );
  }
}

class Mouse extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>

        {/*
          <Mouse>가 무엇을 렌더링하는지에 대해 명확히 코드로 표기하는 대신,
          `render` prop을 사용하여 무엇을 렌더링할지 동적으로 결정할 수 있습니다.
        */}
        {this.props.render(this.state)}
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>
        <Mouse render={mouse => (
          <Cat mouse={mouse} />
        )}/>
      </div>
    );
  }
}
```

이제 <Mouse> 컴포넌트의 행위를 복제하기 위해 하드 코딩할 필요 없이 `render` 함수에 prop으로 전달해줌으로써, `<Mouse>` 컴포넌트는 동적으로 트래킹 기능을 가진 컴포넌트들을 렌더링할 수 있습니다.

정리하자면, **render prop은 무엇을 렌더링할지 컴포넌트에 알려주는 함수입니다.**

이 테크닉은 행위(마우스 트래킹 같은)를 매우 쉽게 공유할 수 있도록 만들어 줍니다. 해당 행위를 적용하려면, `<Mouse>` 를 그리고 현재 (x, y) 커서 위치에 무엇을 그릴지에 대한 정보를 prop을 통해 넘겨주기만 하면 됩니다.

render props에 대해 한가지 흥미로운 점은 대부분의 [higher-order components](/docs/higher-order-components.html)(HOC)에 render props pattern을 이식할 수 있습니다. 예를 들면, `<Mouse>` 컴포넌트보다 withMouse HOC를 더 선호한다면 render prop을 이용해서 다음과 같이 쉽게 HOC를 만들 수 있습니다.

```js
// 어떤 이유 때문에 HOC를 만들기 원한다면, 쉽게 구현할 수 있습니다.
// render prop을 이용해서 일반적인 컴포넌트를 만드세요!
function withMouse(Component) {
  return class extends React.Component {
    render() {
      return (
        <Mouse render={mouse => (
          <Component {...this.props} mouse={mouse} />
        )}/>
      );
    }
  }
}
```

따라서 render props를 사용하면 두 가지 패턴 모두 사용이 가능합니다.

## `render` 이외의 Props 사용법 {#using-props-other-than-render}

여기서 중요하게 기억해야 할 것은, “render props pattern”으로 불리는 이유로 *꼭 prop name으로 `render`를 사용할 필요는 없습니다.* 사실, [*어떤* 함수형 prop이든 render prop이 될 수 있습니다.](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce)

위 예시에서는 `render`를 사용했지만, 우리는 `children` prop을 더 쉽게 사용할 수 있습니다.

```js
<Mouse children={mouse => (
  <p>The mouse position is {mouse.x}, {mouse.y}</p>
)}/>
```

실제로 JSX element의 “어트리뷰트”목록에 하위 어트리뷰트 이름(예를들면 render)을 지정할 필요는 없습니다. 대신에, element *안에* 직접 꽂아넣을 수 있습니다!

```js
<Mouse>
  {mouse => (
    <p>The mouse position is {mouse.x}, {mouse.y}</p>
  )}
</Mouse>
```

이 테크닉은 [react-motion](https://github.com/chenglou/react-motion) API에서 실제로 사용된 것을 볼 수 있습니다.

이 테크닉은 자주 사용되지 않기 때문에, API를 디자인할 때 `children`은 함수 타입을 가지도록 `propTypes`를 지정하는 것이 좋습니다.

```js
Mouse.propTypes = {
  children: PropTypes.func.isRequired
};
```

## 주의사항 {#caveats}

### React.PureComponent에서 render props pattern을 사용할 땐 주의해주세요. {#be-careful-when-using-render-props-with-reactpurecomponent}

render props 패턴을 사용하면 [`React.PureComponent`](/docs/react-api.html#reactpurecomponent)를 사용할 때 발생하는 이점이 사라질 수 있습니다. 얕은 prop 비교는 새로운 prop에 대해 항상 `false`를 반환합니다. 이 경우 `render`마다 render prop으로 넘어온 값을 항상 새로 생성합니다.

위에서 사용했던 `<Mouse>` 컴포넌트를 이용해서 예를 들어보겠습니다. mouse에 `React.Component` 대신에 `React.PureComponent`를 사용하면 다음과 같은 코드가 됩니다.

```js
class Mouse extends React.PureComponent {
  // 위와 같은 구현체...
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>

        {/*
          이것은 좋지 않습니다! `render` prop이 가지고 있는 값은
          각각 다른 컴포넌트를 렌더링 할 것입니다.
        */}
        <Mouse render={mouse => (
          <Cat mouse={mouse} />
        )}/>
      </div>
    );
  }
}
```

이 예시에서 `<MouseTracker>`가 render 될때마다, `<Mouse render>`의 prop으로 넘어가는 함수가 계속 새로 생성됩니다. 따라서 `React.PureComponent`를 상속받은 `<Mouse>` 컴포넌트 효과가 사라지게 됩니다.

이 문제를 해결하기 위해서, 다음과 같이 인스턴스 메서드를 사용해서 prop을 정의합니다.

```js
class MouseTracker extends React.Component {
  // `this.renderTheCat`를 항상 생성하는 매서드를 정의합니다.
  // 이것은 render를 사용할 때 마다 *같은* 함수를 참조합니다.
  renderTheCat(mouse) {
    return <Cat mouse={mouse} />;
  }

  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>
        <Mouse render={this.renderTheCat} />
      </div>
    );
  }
}
```

prop을 정적으로 정의할 수 없는 경우에는 `<Mouse>` 컴포넌트는 `React.Component`를 상속받아야 합니다.
