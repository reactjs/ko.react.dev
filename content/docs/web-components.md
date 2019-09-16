---
id: web-components
title: 웹 컴포넌트
permalink: docs/web-components.html
redirect_from:
  - "docs/webcomponents.html"
---

React와 [웹 컴포넌트](https://developer.mozilla.org/ko/docs/Web/Web_Components)는 서로 다른 문제를 해결하기 위해 만들어졌습니다. 웹 컴포넌트는 재사용할 수 있는 컴포넌트에 강한 캡슐화를 제공하는 반면, React는 데이터와 DOM을 동기화하는 선언적 라이브러리를 제공합니다.

두 목표는 상호보완적입니다. React에서 웹 컴포넌트를 사용할지, 웹 컴포넌트를 React에서 사용할지, 둘 다 사용할지는 자유롭게 정하실 수 있습니다.

## React에서 웹 컴포넌트 사용하기 {#using-web-components-in-react}

```javascript
class HelloMessage extends React.Component {
  render() {
    return <div>Hello <x-search>{this.props.name}</x-search>!</div>;
  }
}
```

> 주의
>
> 웹 컴포넌트는 종종 강제성을 띠는 API를 열어놓고 있습니다. 예를 들어, `video`라는 웹 컴포넌트는 `play()`나 `pause()`라는 함수를 열어놓고 있을 것입니다. 이러한 웹 컴포넌트의 강제성을 띠는 API에 접근하기 위해서, DOM 노드에 직접 ref를 지정하는 것이 필요할 수 있습니다. 서드 파티 웹 컴포넌트를 사용 중이라면, 가장 좋은 해결방법은 웹 컴포넌트의 래퍼로서 동작하는 React 컴포넌트를 작성하는 것입니다.
>
> 웹 컴포넌트에서 나온 이벤트들은 React 렌더링 트리에 올바르게 전파되지 않을 수 있습니다. 이를 해결하기 위해 이벤트를 다루기 위한 핸들러를 React 컴포넌트 내에 각각 만들어야합니다.

많은 사람이 공통으로 착각하는 부분 중 하나로, 웹 컴포넌트는 “className”이 아닌 “class”를 사용합니다.

```javascript
function BrickFlipbox() {
  return (
    <brick-flipbox class="demo">
      <div>front</div>
      <div>back</div>
    </brick-flipbox>
  );
}
```

## 웹 컴포넌트에서 React 사용하기 {#using-react-in-your-web-components}

```javascript
class XSearch extends HTMLElement {
  connectedCallback() {
    const mountPoint = document.createElement('span');
    this.attachShadow({ mode: 'open' }).appendChild(mountPoint);

    const name = this.getAttribute('name');
    const url = 'https://www.google.com/search?q=' + encodeURIComponent(name);
    ReactDOM.render(<a href={url}>{name}</a>, mountPoint);
  }
}
customElements.define('x-search', XSearch);
```

>주의
>
<<<<<<< HEAD
>Babel로 클래스를 변환하면 이 코드가 작동하지 **않을 것**입니다. [해당 문제](https://github.com/w3c/webcomponents/issues/587)를 참조해주시기 바랍니다.
>이 문제를 해결하려면 웹 컴포넌트를 불러오기 전에 [custom-elements-es5-adapter](https://github.com/webcomponents/webcomponentsjs#custom-elements-es5-adapterjs)를 추가하기 바랍니다.
=======
>This code **will not** work if you transform classes with Babel. See [this issue](https://github.com/w3c/webcomponents/issues/587) for the discussion.
>Include the [custom-elements-es5-adapter](https://github.com/webcomponents/polyfills/tree/master/packages/webcomponentsjs#custom-elements-es5-adapterjs) before you load your web components to fix this issue.
>>>>>>> 6dcb963479953586f462ce31fddf35158c0598a0
