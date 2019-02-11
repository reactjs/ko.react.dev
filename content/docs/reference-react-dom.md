---
id: react-dom
title: ReactDOM
layout: docs
category: Reference
permalink: docs/react-dom.html
---

만약 당신이 React를 `<script>` 태그로 로드한다면, `ReactDOM` 글로벌 영역에서 상위 레벨 API들을 이용할 수 있습니다. 만약 npm과 ES6를 사용한다면, 당신은 `import ReactDOM from 'react-dom'`로 쓸 수 있습니다. npm과 ES5의 경우에는 `var ReactDOM = require('react-dom')`로 쓸 수 있습니다.

## 개요 {#overview}

`react-dom` 패키지는 당신의 앱 최상위 레벨에서 사용할 수 있는 DOM에 특화된 메소드들, 그리고 필요한 경우 React 모델 외부로 나갈 수 있는 탈출구를 제공합니다. 대다수의 컴포넌트들은 이 모듈을 사용할 필요가 없습니다.

- [`render()`](#render)
- [`hydrate()`](#hydrate)
- [`unmountComponentAtNode()`](#unmountcomponentatnode)
- [`findDOMNode()`](#finddomnode)
- [`createPortal()`](#createportal)

### 브라우저 지원 {#browser-support}

React는 Internet Explorer 9과 그 이후 버전을 포함한 모든 주요 브라우저들을 지원합니다. 그러나 IE 9과 IE 10과 같은 구형 브라우저는 [polyfill이 필요합니다](/docs/javascript-environment-requirements.html).

> 주의
>
> 우리는 ES5 메소드를 사용할 수 없는 구형 브라우저를 지원하지 않지만, 만약 어플리케이션의 페이지에 [es5-shim과 es5-sham](https://github.com/es-shims/es5-shim)과 같은 polyfill을 포함시킨다면 당신의 앱이 구형 브라우저에서도 동작한다는 것을 알 수 있을 것입니다. 이 방식을 선택한다면 당신은 스스로 해결해 나갈 것입니다.

* * *

## 레퍼런스 {#reference}

### `render()` {#render}

```javascript
ReactDOM.render(element, container[, callback])
```

React 엘리먼트를 DOM의 제공된 `컨테이너` 내부에 렌더링하고 [레퍼런스](/docs/more-about-refs.html)를 컴포넌트로 반환합니다 ([상태가 없는 컴포넌트](/docs/components-and-props.html#functional-and-class-components)의 경우 `null`을 반환합니다).

만약 React 엘리먼트가 이전에 `컨테이너` 내부에 렌더링 되었다면, 해당 구문은 업데이트를 수행하며 최신의 React 엘리먼트를 반영하는 데에 필요한 DOM만 변경합니다.

만약 선택적인 콜백이 제공된다면, 컴포넌트의 렌더링 또는 업데이트 이후에 실행됩니다.

> 주의
>
> `ReactDOM.render()`는 당신이 전달한 컨테이너 노드의 컨텐츠를 제어합니다. 이 구문을 처음 호출할 때 기존의 DOM 엘리먼트를 교체하며, 이후의 호출은 React의 DOM diffing 알고리즘을 사용하여 보다 효율적으로 업데이트 합니다.
>
> `ReactDOM.render()`는 컨테이너 노드를 수정하지 않고 컨테이너의 하위 노드들만 수정합니다. 그렇기 때문에 자식 노드를 덮어쓸 필요 없이 기존의 DOM 노드에 컴포넌트를 추가할 수 있습니다.
>
> `ReactDOM.render()`는 현재 `ReactComponent` 루트 인스턴스에 대한 레퍼런스를 반환합니다. 그러나 이 반환값을 사용하는 것은 레거시이며 React 신규 버전이 컴포넌트를 비동기로 렌더링 하는 경우가 있기 때문에 피해야 합니다. 만약 당신이 `ReactComponent` 인스턴스의 레퍼런스가 필요하다면, 권장하는 해결책은 루트 엘리먼트에 [콜백 레퍼런스](/docs/more-about-refs.html#the-ref-callback-attribute)를 첨부하는 것입니다.
>
> 서버에서 렌더링한 컨테이너를 공급하기 위해 `ReactDOM.render()`를 사용하는 것은 deprecated 되었으며 React 17 버전에서 삭제될 예정입니다. [`hydrate()`](#hydrate)를 사용해주세요.

* * *

### `hydrate()` {#hydrate}

```javascript
ReactDOM.hydrate(element, container[, callback])
```

[`render()`](#render)와 동일하지만, HTML 컨텐츠가 [`ReactDOMServer`](/docs/react-dom-server.html)로 렌더링된 컨테이너를 공급하기 위해 사용됩니다. React는 기존 마크업에 이벤트 리스너를 연결할 것입니다.

React는 렌더링된 컨텐츠가 서버와 클라이언트 간에 동일할 것으로 예상합니다. React가 텍스트 컨텐츠의 차이를 고칠 수는 있지만 당신은 이러한 불일치를 버그로 취급하여 고쳐야 합니다. 개발 모드에서 React는 공급 중 발생하는 불일치에 대해 경고합니다. 불일치가 발생하는 경우에 속성 차이를 고친다는 보장이 없습니다. 대다수의 앱에서 불일치가 발생하는 경우는 많지 않으며, 발생하는 경우 모든 마크업을 검증하는 것이 매우 큰 비용을 수반하기 때문에 성능상의 이유로 중요한 문제입니다.

만약 서버와 클라이언트 사이에서 단일 엘리먼트의 속성이나 텍스트가 불가피하게 다르다면 (예를 들어, timestamp와 같은 경우), 당신은 그 엘리먼트에 `suppressHydrationWarning={true}`를 추가하는 것으로 경고를 끌 수 있습니다. 이는 한 단계까지만 작동하며 탈출구로써 의도한 것입니다. 절때 남용하지 마세요. 텍스트가 아니라면 React는 해당 엘리먼트를 고치지 않을 것이며 이후의 업데이트까지 차이나는대로 남아있을 것입니다.

만약 당신이 서버와 클라이언트 간의 차이를 의도한다면, 당신은 2 패스 렌더링을 사용할 수 있습니다. 클라이언트에서 다르게 렌더링 되는 컴포넌트는 `componentDidMount()`에서 `true`로 설정할 수 있는 `this.state.isClient`와 같은 상태 변수를 읽을 수 있습니다. 이 방식으로 초기 렌더 패스는 서버와 동일한 컨텐츠를 렌더링하여 불일치를 방지하지만, 공급 직후에 추가 패스가 동기로 발생합니다. 이 방식은 당신의 컴포넌트를 두 번 렌더링하게 만들어 속도를 느리게 할 수 있기 때문에 주의를 기울여야 합니다.

느린 연결에서의 사용자 경험에 유의해야 합니다. JavaScript 코드는 최초 HTML 렌더링보다 매우 늦게 로드될 수 있으며, 만약 당신이 클라이언트 전용 패스에서 다른 무언가를 렌더링한다면 그 전환 과정에서 방해를 받을 수 있습니다. 그러나 정상적으로 실행된다면 서버에 어플리케이션 "shell"을 렌더링하고 클라이언트에서 일부 추가 위젯만 표시하는 것이 효과적일 수 있습니다. 마크업 불일치 문제 없이 이 방식을 사용하길 원한다면 이전 단락의 설명을 참고해주세요.

* * *

### `unmountComponentAtNode()` {#unmountcomponentatnode}

```javascript
ReactDOM.unmountComponentAtNode(container)
```

Remove a mounted React component from the DOM and clean up its event handlers and state. If no component was mounted in the container, calling this function does nothing. Returns `true` if a component was unmounted and `false` if there was no component to unmount.

* * *

### `findDOMNode()` {#finddomnode}

> Note:
>
> `findDOMNode` is an escape hatch used to access the underlying DOM node. In most cases, use of this escape hatch is discouraged because it pierces the component abstraction. [It has been deprecated in `StrictMode`.](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)

```javascript
ReactDOM.findDOMNode(component)
```
If this component has been mounted into the DOM, this returns the corresponding native browser DOM element. This method is useful for reading values out of the DOM, such as form field values and performing DOM measurements. **In most cases, you can attach a ref to the DOM node and avoid using `findDOMNode` at all.**

When a component renders to `null` or `false`, `findDOMNode` returns `null`. When a component renders to a string, `findDOMNode` returns a text DOM node containing that value. As of React 16, a component may return a fragment with multiple children, in which case `findDOMNode` will return the DOM node corresponding to the first non-empty child.

> Note:
>
> `findDOMNode` only works on mounted components (that is, components that have been placed in the DOM). If you try to call this on a component that has not been mounted yet (like calling `findDOMNode()` in `render()` on a component that has yet to be created) an exception will be thrown.
>
> `findDOMNode` cannot be used on function components.

* * *

### `createPortal()` {#createportal}

```javascript
ReactDOM.createPortal(child, container)
```

Creates a portal. Portals provide a way to [render children into a DOM node that exists outside the hierarchy of the DOM component](/docs/portals.html).
