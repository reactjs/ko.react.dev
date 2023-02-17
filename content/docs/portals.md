---
id: portals
title: Portals
permalink: docs/portals.html
---

> Try the new React documentation.
> 
> These new documentation pages teach modern React and include live examples:
>
> - [`createPortal`](https://beta.reactjs.org/reference/react-dom/createPortal)
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

Portals provide a first-class way to render children into a DOM node that exists outside the DOM hierarchy of the parent component.

```js
ReactDOM.createPortal(child, container)
```

첫 번째 인자(`child`)는 엘리먼트, 문자열, 혹은 fragment와 같은 어떤 종류이든 [렌더링할 수 있는 React 자식](/docs/react-component.html#render)입니다. 두 번째 인자(`container`)는 DOM 엘리먼트입니다.

## 사용법 {#usage}

보통 컴포넌트 렌더링 메서드에서 엘리먼트를 반환할 때 그 엘리먼트는 부모 노드에서 가장 가까운 자식으로 DOM에 마운트됩니다.

```js{4,6}
render() {
  // React는 새로운 div를 마운트하고 그 안에 자식을 렌더링합니다.
  return (
    <div>
      {this.props.children}
    </div>
  );
}
```

그런데 가끔 DOM의 다른 위치에 자식을 삽입하는 것이 유용할 수 있습니다.

```js{6}
render() {
  // React는 새로운 div를 생성하지 *않고* `domNode` 안에 자식을 렌더링합니다.
  // `domNode`는 DOM 노드라면 어떠한 것이든 유효하고, 그것은 DOM 내부의 어디에 있든지 상관없습니다.
  return ReactDOM.createPortal(
    this.props.children,
    domNode
  );
}
```

portal의 전형적인 유스케이스는 부모 컴포넌트에 `overflow: hidden`이나 `z-index`가 있는 경우이지만, 시각적으로 자식을 "튀어나오도록" 보여야 하는 경우도 있습니다. 예를 들어, 다이얼로그, 호버카드나 툴팁과 같은 것입니다.

>주의
>
> portal을 이용하여 작업할 때 [키보드 포커스 관리](/docs/accessibility.html#programmatically-managing-focus)가 매우 중요하다는 것을 염두에 두세요.
>
> For modal dialogs, ensure that everyone can interact with them by following the [WAI-ARIA Modal Authoring Practices](https://www.w3.org/WAI/ARIA/apg/patterns/dialogmodal/).

[**CodePen에서 실행하기**](https://codepen.io/gaearon/pen/yzMaBd)

## Portal을 통한 이벤트 버블링 {#event-bubbling-through-portals}

portal이 DOM 트리의 어디에도 존재할 수 있다 하더라도 모든 다른 면에서 일반적인 React 자식처럼 동작합니다. context와 같은 기능은 자식이 portal이든지 아니든지 상관없이 정확하게 같게 동작합니다. 이는 *DOM 트리*에서의 위치에 상관없이 portal은 여전히 *React 트리*에 존재하기 때문입니다.

이것에는 이벤트 버블링도 포함되어 있습니다. portal 내부에서 발생한 이벤트는 *React 트리*에 포함된 상위로 전파될 것입니다. *DOM 트리*에서는 그 상위가 아니라 하더라도 말입니다. 다음의 HTML 구조를 가정해 봅시다.

```html
<html>
  <body>
    <div id="app-root"></div>
    <div id="modal-root"></div>
  </body>
</html>
```

`#app-root` 안에 있는 `Parent` 컴포넌트는 형제 노드인 `#modal-root` 안의 컴포넌트에서 전파된 이벤트가 포착되지 않았을 경우 그것을 포착할 수 있습니다.

```js{28-31,42-49,53,61-63,70-71,74}
// 여기 이 두 컨테이너는 DOM에서 형제 관계입니다.
const appRoot = document.getElementById('app-root');
const modalRoot = document.getElementById('modal-root');

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  componentDidMount() {
    // Portal 엘리먼트는 Modal의 자식이 마운트된 후 DOM 트리에 삽입됩니다.
    // 요컨대, 자식은 어디에도 연결되지 않은 DOM 노드로 마운트됩니다.
    // 자식 컴포넌트가 마운트될 때 그것을 즉시 DOM 트리에 연결해야만 한다면,
    // 예를 들어, DOM 노드를 계산한다든지 자식 노드에서 'autoFocus'를 사용한다든지 하는 경우에,
    // Modal에 state를 추가하고 Modal이 DOM 트리에 삽입되어 있을 때만 자식을 렌더링해주세요.
    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(
      this.props.children,
      this.el
    );
  }
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {clicks: 0};
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // 이것은 Child에 있는 버튼이 클릭 되었을 때 발생하고 Parent의 state를 갱신합니다.
    // 비록 버튼이 DOM 상에서 직계 자식이 아니라고 하더라도 말입니다.
    this.setState(state => ({
      clicks: state.clicks + 1
    }));
  }

  render() {
    return (
      <div onClick={this.handleClick}>
        <p>Number of clicks: {this.state.clicks}</p>
        <p>
          Open up the browser DevTools
          to observe that the button
          is not a child of the div
          with the onClick handler.
        </p>
        <Modal>
          <Child />
        </Modal>
      </div>
    );
  }
}

function Child() {
  // 이 버튼에서의 클릭 이벤트는 부모로 버블링됩니다.
  // 왜냐하면 'onClick' 속성이 정의되지 않았기 때문입니다.
  return (
    <div className="modal">
      <button>Click</button>
    </div>
  );
}

const root = ReactDOM.createRoot(appRoot);
root.render(<Parent />);
```

[**CodePen에서 실행하기**](https://codepen.io/gaearon/pen/jGBWpE)

portal에서 버블링된 이벤트를 부모 컴포넌트에서 포착한다는 것은 본질적으로 portal에 의존하지 않는 조금 더 유연한 추상화 개발이 가능함을 나타냅니다.
예를 들어, `<Modal />` 컴포넌트를 렌더링할 때 부모는 그것이 portal을 사용했는지와 관계없이 `<Modal />`의 이벤트를 포착할 수 있습니다.
