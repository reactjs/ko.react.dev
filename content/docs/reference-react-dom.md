---
id: react-dom
title: ReactDOM
layout: docs
category: Reference
permalink: docs/react-dom.html
---

<<<<<<< HEAD
React를 `<script>` 태그로 불러온다면 `ReactDOM` 글로벌 영역에서 상위 레벨 API를 이용할 수 있습니다. npm과 ES6를 사용한다면 `import ReactDOM from 'react-dom'`로 쓸 수 있습니다. npm과 ES5의 경우에는 `var ReactDOM = require('react-dom')`로 쓸 수 있습니다.
=======
The `react-dom` package provides DOM-specific methods that can be used at the top level of your app and as an escape hatch to get outside the React model if you need to.

```js
import * as ReactDOM from 'react-dom';
```

If you use ES5 with npm, you can write:

```js
var ReactDOM = require('react-dom');
```

The `react-dom` package also provides modules specific to client and server apps:
- [`react-dom/client`](/docs/react-dom-client.html)
- [`react-dom/server`](/docs/react-dom-server.html)
>>>>>>> 6d965422a4056bac5f93f92735364cb08bcffc6b

## 개요 {#overview}

<<<<<<< HEAD
`react-dom` package는 앱의 최상위 레벨에서 사용할 수 있는 DOM에 특화된 메서드와 필요한 경우 React 모델 외부로 나갈 수 있는 해결책을 제공합니다. 대다수 컴포넌트는 이 모듈을 사용할 필요가 없습니다.
=======
The `react-dom` package exports these methods:
- [`createPortal()`](#createportal)
- [`flushSync()`](#flushsync)
>>>>>>> 6d965422a4056bac5f93f92735364cb08bcffc6b

These `react-dom` methods are also exported, but are considered legacy:
- [`render()`](#render)
- [`hydrate()`](#hydrate)
- [`findDOMNode()`](#finddomnode)
- [`unmountComponentAtNode()`](#unmountcomponentatnode)

> Note: 
> 
> Both `render` and `hydrate` have been replaced with new [client methods](/docs/react-dom-client.html) in React 18. These methods will warn that your app will behave as if it's running React 17 (learn more [here](https://reactjs.org/link/switch-to-createroot)).

### 브라우저 지원 {#browser-support}

<<<<<<< HEAD
React는 Internet Explorer 9과 상위 버전을 포함한 모든 주요 브라우저를 지원합니다. 그러나 IE 9과 IE 10과 같은 구형 브라우저는 [폴리필(polyfill)이 필요합니다](/docs/javascript-environment-requirements.html).
=======
React supports all modern browsers, although [some polyfills are required](/docs/javascript-environment-requirements.html) for older versions.
>>>>>>> 6d965422a4056bac5f93f92735364cb08bcffc6b

> 주의
>
<<<<<<< HEAD
> 우리는 ES5 메서드를 지원하지 않는 구형 브라우저를 지원하지 않지만, 페이지에 [es5-shim과 es5-sham](https://github.com/es-shims/es5-shim)과 같은 폴리필을 포함한다면 앱이 구형 브라우저에서도 동작할 수 있습니다. 이 길을 선택한다면 스스로 해결해야 합니다.

* * *
=======
> We do not support older browsers that don't support ES5 methods or microtasks such as Internet Explorer. You may find that your apps do work in older browsers if polyfills such as [es5-shim and es5-sham](https://github.com/es-shims/es5-shim) are included in the page, but you're on your own if you choose to take this path.
>>>>>>> 6d965422a4056bac5f93f92735364cb08bcffc6b

## 참조 {#reference}

### `createPortal()` {#createportal}

```javascript
createPortal(child, container)
```

<<<<<<< HEAD
React 엘리먼트를 `container` DOM에 렌더링하고 컴포넌트에 대한 [참조](/docs/more-about-refs.html)를 반환합니다([무상태 컴포넌트](/docs/components-and-props.html#function-and-class-components)는 `null`을 반환합니다).
=======
Creates a portal. Portals provide a way to [render children into a DOM node that exists outside the hierarchy of the DOM component](/docs/portals.html).

### `flushSync()` {#flushsync}

```javascript
flushSync(callback)
```

Force React to flush any updates inside the provided callback synchronously. This ensures that the DOM is updated immediately.

```javascript
// Force this state update to be synchronous.
flushSync(() => {
  setCount(count + 1);
});
// By this point, DOM is updated.
```

> Note:
> 
> `flushSync` can significantly hurt performance. Use sparingly.
> 
> `flushSync` may force pending Suspense boundaries to show their `fallback` state.
> 
> `flushSync` may also run pending effects and synchronously apply any updates they contain before returning.
> 
> `flushSync` may also flush updates outside the callback when necessary to flush the updates inside the callback. For example, if there are pending updates from a click, React may flush those before flushing the updates inside the callback.

## Legacy Reference {#legacy-reference}
### `render()` {#render}
```javascript
render(element, container[, callback])
```

> Note:
>
> `render` has been replaced with `createRoot` in React 18. See [createRoot](/docs/react-dom-client.html#createroot) for more info.

Render a React element into the DOM in the supplied `container` and return a [reference](/docs/more-about-refs.html) to the component (or returns `null` for [stateless components](/docs/components-and-props.html#function-and-class-components)).
>>>>>>> 6d965422a4056bac5f93f92735364cb08bcffc6b

React 엘리먼트가 이전에 `container` 내부에 렌더링 되었다면 해당 엘리먼트는 업데이트하고 최신의 React 엘리먼트를 반영하는 데 필요한 DOM만 변경합니다.

추가적인 콜백이 제공된다면 컴포넌트가 렌더링되거나 업데이트된 후 실행됩니다.

> 주의
>
<<<<<<< HEAD
> `ReactDOM.render()`는 전달한 컨테이너 노드의 콘텐츠를 제어합니다. 처음 호출할 때 기존의 DOM 엘리먼트를 교체하며 이후의 호출은 React의 DOM diffing 알고리즘을 사용하여 더욱 효율적으로 업데이트합니다.
>
> `ReactDOM.render()`는 컨테이너 노드를 수정하지 않고 컨테이너의 하위 노드만 수정합니다. 그렇기 때문에 자식 노드를 덮어쓸 필요 없이 기존의 DOM 노드에 컴포넌트를 추가할 수 있습니다.
>
> `ReactDOM.render()`는 현재 `ReactComponent` 루트(root) 인스턴스에 대한 참조를 반환합니다. 그러나 이 반환 값을 사용하는 것은 레거시이며 React 신규 버전이 컴포넌트를 비동기로 렌더링하는 경우가 있기 때문에 피해야 합니다. `ReactComponent` 인스턴스의 참조가 필요하다면 권장하는 해결책은 루트 엘리먼트에 [콜백 ref](/docs/refs-and-the-dom.html#callback-refs)를 붙이는 것입니다.
>
> `ReactDOM.render()`를 사용해 서버에서 렌더링한 컨테이너에 이벤트를 보충하는 것은 권장되지 않으며 React 17 버전에서 삭제될 예정입니다. [`hydrate()`](#hydrate)를 사용해주세요.
=======
> `render()` controls the contents of the container node you pass in. Any existing DOM elements inside are replaced when first called. Later calls use React’s DOM diffing algorithm for efficient updates.
>
> `render()` does not modify the container node (only modifies the children of the container). It may be possible to insert a component to an existing DOM node without overwriting the existing children.
>
> `render()` currently returns a reference to the root `ReactComponent` instance. However, using this return value is legacy
> and should be avoided because future versions of React may render components asynchronously in some cases. If you need a reference to the root `ReactComponent` instance, the preferred solution is to attach a
> [callback ref](/docs/refs-and-the-dom.html#callback-refs) to the root element.
>
> Using `render()` to hydrate a server-rendered container is deprecated. Use [`hydrateRoot()`](#hydrateroot) instead.
>>>>>>> 6d965422a4056bac5f93f92735364cb08bcffc6b

* * *

### `hydrate()` {#hydrate}

```javascript
hydrate(element, container[, callback])
```

<<<<<<< HEAD
[`render()`](#render)와 동일하지만 HTML 콘텐츠가 [`ReactDOMServer`](/docs/react-dom-server.html)로 렌더링 된 컨테이너에 이벤트를 보충하기 위해 사용됩니다. React는 기존 마크업에 이벤트 리스너를 연결합니다.
=======
> Note:
>
> `hydrate` has been replaced with `hydrateRoot` in React 18. See [hydrateRoot](/docs/react-dom-client.html#hydrateroot) for more info.

Same as [`render()`](#render), but is used to hydrate a container whose HTML contents were rendered by [`ReactDOMServer`](/docs/react-dom-server.html). React will attempt to attach event listeners to the existing markup.
>>>>>>> 6d965422a4056bac5f93f92735364cb08bcffc6b

React는 렌더링 된 콘텐츠가 서버와 클라이언트 간에 같을 것으로 예상합니다. React가 텍스트 콘텐츠의 차이를 고칠 수는 있지만 이러한 불일치를 버그로 취급하여 고쳐야 합니다. 개발 모드에서 React는 이벤트 보충 중 발생하는 불일치에 대해 경고합니다. 불일치가 발생하는 경우에 어트리뷰트 차이를 고친다는 보장이 없습니다. 대다수의 애플리케이션에서 불일치가 발생하는 경우는 많지 않으며 발생하는 경우 모든 마크업을 검증하는 것이 매우 큰 비용을 수반하기 때문에 성능상의 이유로 중요한 문제입니다.

서버와 클라이언트 사이에서 단일 엘리먼트의 어트리뷰트나 텍스트가 불가피하게 다르다면(예를 들어 timestamp의 경우) 그 엘리먼트에 `suppressHydrationWarning={true}`를 추가하는 것으로 경고를 끌 수 있습니다. 이는 한 단계까지만 작동하며 의도된 해결책입니다. 절대 남용하지 마세요. 텍스트가 아니라면 React는 해당 엘리먼트를 고치지 않을 것이며 이후의 업데이트까지 일치하지 않은 채로 남아있을 것입니다.

서버와 클라이언트 간의 차이를 의도한다면 2단계 렌더링을 사용할 수 있습니다. 클라이언트에서 다르게 렌더링 되는 컴포넌트는 `componentDidMount()`에서 `true`로 설정할 수 있는 `this.state.isClient`와 같은 상태 변수를 읽을 수 있습니다. 이 방식으로 초기 렌더 단계는 서버와 같은 콘텐츠를 렌더링하여 불일치를 방지하지만, 이벤트 보충 직후에 추가적인 단계가 동기적으로 발생합니다. 이 방식은 컴포넌트를 두 번 렌더링하게 만들어 속도를 느리게 할 수 있기 때문에 주의를 기울여야 합니다.

느린 연결에서의 사용자 경험에 유의해야 합니다. JavaScript 코드는 최초 HTML 렌더링보다 매우 늦게 로드될 수 있으며 클라이언트 전용 단계에서 다른 무언가를 렌더링한다면 그 전환 과정에서 방해를 받을 수 있습니다. 그러나 정상적으로 실행된다면 서버에 애플리케이션 "shell"을 렌더링하고 클라이언트에서 일부 추가 위젯만 표시하는 것이 효과적일 수 있습니다. 마크업 불일치 문제없이 이 방식을 사용하길 원한다면 이전 단락의 설명을 참고해주세요.

* * *

### `unmountComponentAtNode()` {#unmountcomponentatnode}

```javascript
unmountComponentAtNode(container)
```

<<<<<<< HEAD
마운트된 React 컴포넌트를 DOM에서 제거하고 컴포넌트의 이벤트 핸들러와 state를 정리합니다. 컨테이너에 아무런 컴포넌트도 마운트 되지 않았다면 해당 함수를 호출하더라도 아무런 동작을 하지 않습니다. 컴포넌트가 마운트 해제되었다면 `true`, 마운트 해제할 컴포넌트가 존재하지 않는다면 `false`를 반환합니다.
=======
> Note:
>
> `unmountComponentAtNode` has been replaced with `root.unmount()` in React 18. See [createRoot](/docs/react-dom-client.html#createroot) for more info.

Remove a mounted React component from the DOM and clean up its event handlers and state. If no component was mounted in the container, calling this function does nothing. Returns `true` if a component was unmounted and `false` if there was no component to unmount.
>>>>>>> 6d965422a4056bac5f93f92735364cb08bcffc6b

* * *

### `findDOMNode()` {#finddomnode}

> 주의
>
> `findDOMNode`는 기본 DOM 노드를 이용하는 데에 사용되는 해결책입니다. 대부분의 경우에서 이 해결책을 사용하는 것은 컴포넌트 추상화를 위반하기 때문에 권장하지 않습니다. [이 메서드는 `StrictMode`에서 권장되지 않습니다.](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)

```javascript
findDOMNode(component)
```

매개 변수로 전달받은 컴포넌트가 DOM 내부에 마운트되었다면 컴포넌트에 해당하는 네이티브 브라우저의 DOM 엘리먼트를 반환합니다. 해당 메서드는 form 필드 값이나 DOM 성능 측정과 같이 DOM에서 값을 읽을 때 유용합니다. **대부분의 경우에서 DOM 노드에 ref를 붙일 수 있으며 `findDOMNode`를 사용할 필요가 전혀 없습니다.**

컴포넌트가 `null`이나 `false`를 렌더링하는 경우 `findDOMNode`은 `null`을 반환합니다. 컴포넌트가 문자를 반환하는 경우 `findDOMNode`은 문자 값을 포함하고 있는 텍스트 DOM 노드를 반환합니다. React 16부터 컴포넌트는 여러 개의 자식을 가진 fragment를 반환할 수 있으며 이 경우에 `findDOMNode`는 비어있지 않은 첫 번째 자식에 해당하는 DOM 노드를 반환합니다.

> 주의
>
> `findDOMNode`는 마운트된 컴포넌트에만 동작합니다(즉 컴포넌트는 DOM 내부에 존재해야 합니다). 아직 마운트되지 않은 컴포넌트를 대상으로 해당 메서드를 호출한다면(예를 들어 아직 생성되지 않은 컴포넌트의 `render()`에서 `findDOMNode()`를 호출하는 것) exception이 발생합니다.
>
> `findDOMNode`은 함수 컴포넌트에서는 사용할 수 없습니다.

* * *
<<<<<<< HEAD

### `createPortal()` {#createportal}

```javascript
ReactDOM.createPortal(child, container)
```

portal을 생성합니다. Portal은 [DOM 컴포넌트 구조의 외부에 존재하는 DOM 노드에 자식을 렌더링](/docs/portals.html)하는 방법을 제공합니다.
=======
>>>>>>> 6d965422a4056bac5f93f92735364cb08bcffc6b
