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

> Note:
>
> `ReactDOM.render()` controls the contents of the container node you pass in. Any existing DOM elements inside are replaced when first called. Later calls use React’s DOM diffing algorithm for efficient updates.
>
> `ReactDOM.render()` does not modify the container node (only modifies the children of the container). It may be possible to insert a component to an existing DOM node without overwriting the existing children.
>
> `ReactDOM.render()` currently returns a reference to the root `ReactComponent` instance. However, using this return value is legacy
> and should be avoided because future versions of React may render components asynchronously in some cases. If you need a reference to the root `ReactComponent` instance, the preferred solution is to attach a
> [callback ref](/docs/more-about-refs.html#the-ref-callback-attribute) to the root element.
>
> Using `ReactDOM.render()` to hydrate a server-rendered container is deprecated and will be removed in React 17. Use [`hydrate()`](#hydrate) instead.

* * *

### `hydrate()` {#hydrate}

```javascript
ReactDOM.hydrate(element, container[, callback])
```

Same as [`render()`](#render), but is used to hydrate a container whose HTML contents were rendered by [`ReactDOMServer`](/docs/react-dom-server.html). React will attempt to attach event listeners to the existing markup.

React expects that the rendered content is identical between the server and the client. It can patch up differences in text content, but you should treat mismatches as bugs and fix them. In development mode, React warns about mismatches during hydration. There are no guarantees that attribute differences will be patched up in case of mismatches. This is important for performance reasons because in most apps, mismatches are rare, and so validating all markup would be prohibitively expensive.

If a single element's attribute or text content is unavoidably different between the server and the client (for example, a timestamp), you may silence the warning by adding `suppressHydrationWarning={true}` to the element. It only works one level deep, and is intended to be an escape hatch. Don't overuse it. Unless it's text content, React still won't attempt to patch it up, so it may remain inconsistent until future updates.

If you intentionally need to render something different on the server and the client, you can do a two-pass rendering. Components that render something different on the client can read a state variable like `this.state.isClient`, which you can set to `true` in `componentDidMount()`. This way the initial render pass will render the same content as the server, avoiding mismatches, but an additional pass will happen synchronously right after hydration. Note that this approach will make your components slower because they have to render twice, so use it with caution.

Remember to be mindful of user experience on slow connections. The JavaScript code may load significantly later than the initial HTML render, so if you render something different in the client-only pass, the transition can be jarring. However, if executed well, it may be beneficial to render a "shell" of the application on the server, and only show some of the extra widgets on the client. To learn how to do this without getting the markup mismatch issues, refer to the explanation in the previous paragraph.

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
