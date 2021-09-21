---
id: react-api
title: React 최상위 API
layout: docs
category: Reference
permalink: docs/react-api.html
redirect_from:
  - "docs/reference.html"
  - "docs/clone-with-props.html"
  - "docs/top-level-api.html"
  - "docs/top-level-api-ja-JP.html"
  - "docs/top-level-api-ko-KR.html"
  - "docs/top-level-api-zh-CN.html"
---

`React`는 React 라이브러리의 진입점입니다. `<script>` 태그를 사용하여 React를 불러오게 되면 전역 객체 `React`를 통하여 최상위 API를 사용할 수 있습니다. npm에서 ES6를 사용하는 경우, `import React from 'react'`를 작성하면 됩니다. npm에서 ES5를 사용하는 경우, `var React = require('react')`를 작성하면 됩니다.

## 개요 {#overview}

### 컴포넌트 {#components}

React 컴포넌트를 사용하면 UI를 독립적이고 재사용할 수 있는 부분으로 나누고 각 부분을 분리하여 생각할 수 있습니다. React 컴포넌트는 `React.Component` 또는 `React.PureComponent`로 세부적으로 나누어 정의할 수 있습니다.

- [`React.Component`](#reactcomponent)
- [`React.PureComponent`](#reactpurecomponent)

ES6 class를 사용하지 않는다면, `create-react-class` 모듈을 대신 사용해도 됩니다. 자세한 정보는 [ES6 없이 React를 사용하기](/docs/react-without-es6.html) 문서에서 확인할 수 있습니다.

React 컴포넌트를 정의할 때 래핑될 수 있는 함수의 형태로 할 수도 있습니다.

- [`React.memo`](#reactmemo)

### React 엘리먼트 생성하기 {#creating-react-elements}

UI의 형태를 설명하는 데에 [JSX를 사용할 것](/docs/introducing-jsx.html)을 권장합니다. 각 JSX 엘리먼트는 단지 [`React.createElement()`](#createelement)를 호출하는 편리한 문법에 불과합니다. JSX를 사용할 경우 아래의 메서드들을 직접 호출하는 일은 거의 없습니다.

- [`createElement()`](#createelement)
- [`createFactory()`](#createfactory)

자세한 정보는 [JSX 없이 React 사용하기](/docs/react-without-jsx.html) 문서에서 확인할 수 있습니다.

### 엘리먼트 변환하기 {#transforming-elements}

`React`는 엘리먼트를 조작하는 API들을 제공합니다.

- [`cloneElement()`](#cloneelement)
- [`isValidElement()`](#isvalidelement)
- [`React.Children`](#reactchildren)

### Fragments {#fragments}

또한 `React`는 래퍼 없이 여러 엘리먼트를 렌더링할 수 있는 컴포넌트를 제공합니다.

- [`React.Fragment`](#reactfragment)

### Refs {#refs}

- [`React.createRef`](#reactcreateref)
- [`React.forwardRef`](#reactforwardref)

### Suspense {#suspense}

Suspense를 사용하면 컴포넌트가 렌더링하기 전에 다른 작업이 먼저 이루어지도록 "대기합니다". 현재 Suspense는 단 하나의 사용 사례 [`React.lazy`를 사용하여 컴포넌트를 동적으로 불러오기](/docs/code-splitting.html#reactlazy)만 지원합니다. 나중에는 데이터 불러오기와 같은 사용 사례를 지원할 계획입니다.

- [`React.lazy`](#reactlazy)
- [`React.Suspense`](#reactsuspense)

### Hooks {#hooks}

*Hooks*는 React 16.8에 새로 추가되었습니다. Hooks를 사용하면 class를 사용하지 않아도 state와 React 기능들을 사용할 수 있도록 해줍니다. Hooks만을 다루는 [문서](/docs/hooks-intro.html)와 API 문서가 존재합니다.

- [기본적인 Hooks](/docs/hooks-reference.html#basic-hooks)
  - [`useState`](/docs/hooks-reference.html#usestate)
  - [`useEffect`](/docs/hooks-reference.html#useeffect)
  - [`useContext`](/docs/hooks-reference.html#usecontext)
- [추가적인 Hooks](/docs/hooks-reference.html#additional-hooks)
  - [`useReducer`](/docs/hooks-reference.html#usereducer)
  - [`useCallback`](/docs/hooks-reference.html#usecallback)
  - [`useMemo`](/docs/hooks-reference.html#usememo)
  - [`useRef`](/docs/hooks-reference.html#useref)
  - [`useImperativeHandle`](/docs/hooks-reference.html#useimperativehandle)
  - [`useLayoutEffect`](/docs/hooks-reference.html#uselayouteffect)
  - [`useDebugValue`](/docs/hooks-reference.html#usedebugvalue)

* * *

## Reference {#reference}

### `React.Component` {#reactcomponent}

`React.Component`는 [ES6 class](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes)를 사용하여 React 컴포넌트를 정의할 때에 기초가 되는 class입니다.

```javascript
class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

`React.Component` 기초 class와 관련된 메서드와 속성 목록은 [React.Component API Reference](/docs/react-component.html)에서 확인할 수 있습니다.

* * *

### `React.PureComponent` {#reactpurecomponent}

`React.PureComponent`는 [`React.Component`](#reactcomponent)와 비슷합니다. [`React.Component`](#reactcomponent)는 [`shouldComponentUpdate()`](/docs/react-component.html#shouldcomponentupdate)를 구현하지 않지만, `React.PureComponent`는 props와 state를 이용한 얕은 비교를 구현한다는 차이점만이 존재합니다.

React 컴포넌트의 `render()` 함수가 동일한 props와 state에 대하여 동일한 결과를 렌더링한다면, `React.PureComponent`를 사용하여 경우에 따라 성능 향상을 누릴 수 있습니다.

> 주의
>
> `React.PureComponent`의 `shouldComponentUpdate()`는 컴포넌트에 대하여 얕은 비교만을 수행합니다. 따라서 컴포넌트에 복잡한 자료 구조가 포함되어있다면, 깊은 차이가 존재함에도 불구하고 차이가 없다고 판단하는 잘못된 결과를 만들어낼 수 있습니다. props와 state의 구조가 간단할 것으로 예상될 때에만 `PureComponent`를 상속하고, 깊은 자료 구조의 변화가 있다면 [`forceUpdate()`](/docs/react-component.html#forceupdate)를 사용하세요. 또는 중첩된 데이터들을 빠르게 비교할 수 있도록 하려면 [불변 객체](https://facebook.github.io/immutable-js/)의 사용을 검토해보세요.
>
> 더 나아가 `React.PureComponent`의 `shouldComponentUpdate()`는 컴포넌트의 하위 트리에 대한 props 갱신 작업을 수행하지 않습니다. 자식 컴포넌트들이 "순수"한지 꼭 확인하기 바랍니다.

* * *

### `React.memo` {#reactmemo}

```javascript
const MyComponent = React.memo(function MyComponent(props) {
  /* props를 사용하여 렌더링 */
});
```

`React.memo`는 [고차 컴포넌트(Higher Order Component)](/docs/higher-order-components.html)입니다.

당신의 컴포넌트가 동일한 props로 동일한 결과를 렌더링해낸다면, `React.memo`를 호출하고 결과를 메모이징(Memoizing)하도록 래핑하여 경우에 따라 성능 향상을 누릴 수 있습니다. 즉, React는 컴포넌트를 렌더링하지 않고 마지막으로 렌더링된 결과를 재사용합니다.

`React.memo`는 props 변화에만 영향을 줍니다. `React.memo`로 감싸진 함수 컴포넌트 구현에 [`useState`](/docs/hooks-state.html), [`useReducer`](/docs/hooks-reference.html#usereducer) 또는 [`useContext`](/docs/hooks-reference.html#usecontext) 훅을 사용한다면, 여전히 state나 context가 변할 때 다시 렌더링됩니다.

props가 갖는 복잡한 객체에 대하여 얕은 비교만을 수행하는 것이 기본 동작입니다. 다른 비교 동작을 원한다면, 두 번째 인자로 별도의 비교 함수를 제공하면 됩니다.

```javascript
function MyComponent(props) {
  /* props를 사용하여 렌더링 */
}
function areEqual(prevProps, nextProps) {
  /*
  nextProp가 prevProps와 동일한 값을 가지면 true를 반환하고, 그렇지 않다면 false를 반환
  */
}
export default React.memo(MyComponent, areEqual);
```

이 메서드는 오직 **[성능 최적화](/docs/optimizing-performance.html)**를 위하여 사용됩니다. 렌더링을 "방지"하기 위하여 사용하지 마세요. 버그를 만들 수 있습니다.

> 주의
>
> class 컴포넌트의 [`shouldComponentUpdate()`](/docs/react-component.html#shouldcomponentupdate) 메서드와 달리, `areEqual` 함수는 props들이 서로 같으면 `true`를 반환하고, props들이 서로 다르면 `false`를 반환합니다. 이것은 `shouldComponentUpdate`와 정반대의 동작입니다.

* * *

### `createElement()` {#createelement}

```javascript
React.createElement(
  type,
  [props],
  [...children]
)
```

인자로 주어지는 타입에 따라 새로운 [React 엘리먼트](/docs/rendering-elements.html)를 생성하여 반환합니다. type 인자로는 태그 이름 문자열(`'div'` 또는 `'span'` 등), [React 컴포넌트](/docs/components-and-props.html) 타입, 또는 [React Fragment](#reactfragment) 타입 중 하나가 올 수 있습니다.

JSX로 작성된 코드는 `React.createElement()`를 사용하는 형태로 변환됩니다. JSX를 사용할 경우 `React.createElement()`를 직접 호출하는 일은 거의 없습니다. 자세한 정보는 [JSX 없이 React 사용하기](/docs/react-without-jsx.html) 문서에서 확인할 수 있습니다.

* * *

### `cloneElement()` {#cloneelement}

```
React.cloneElement(
  element,
  [config],
  [...children]
)
```

`element`를 기준으로 새로운 React 엘리먼트를 복사하고 반환합니다. `config`는 `key`와 `ref` 그리고 모든 새로운 props를 포함해야 합니다. 새로운 엘리먼트에는 원본 엘리먼트가 가졌던 props가 새로운 props와 얕게 합쳐진 뒤 주어집니다. 새로운 자식들은 기존의 자식들을 대체합니다. `config`에 `key`와 `ref`가 없다면 원본 엘리먼트의 `key`와 `ref`는 그대로 유지됩니다.

`React.cloneElement()`는 아래의 구문과 거의 동등합니다.

```js
<element.type {...element.props} {...props}>{children}</element.type>
```

그렇지만 `ref`들이 유지된다는 점이 다릅니다. 즉 조상이 가지고 있을 `ref`를 사용하여 자식 엘리먼트에 접근하는 것이 허용됩니다. 새로운 엘리먼트에 덧붙여지는 것과 동일한 `ref`를 얻을 수 있습니다. 새로운 `ref` 또는 `key`가 있다면 이전 값을 대체합니다.

이 API는 더 이상 사용되지 않는 `React.addons.cloneWithProps()`를 대체합니다.

* * *

### `createFactory()` {#createfactory}

```javascript
React.createFactory(type)
```

주어진 타입의 React 엘리먼트를 만들어내는 함수를 반환합니다. [`React.createElement()`](#createelement)와 마찬가지로 type 인자는 태그 이름 문자열(`'div'` 또는 `'span'` 등), [React 컴포넌트](/docs/components-and-props.html) 타입, 또는 [React Fragment](#reactfragment) 타입 중 하나가 올 수 있습니다.

이 헬퍼 함수는 레거시 기능으로 간주되며, 대신 JSX 문법을 사용하거나 `React.createElement()`를 직접 사용하는 것이 좋습니다.

JSX를 사용할 경우 `React.createFactory()`를 직접 호출하는 일은 거의 없습니다. 자세한 정보는 [JSX 없이 React 사용하기](/docs/react-without-jsx.html) 문서에서 확인할 수 있습니다.

* * *

### `isValidElement()` {#isvalidelement}

```javascript
React.isValidElement(object)
```

객체가 React 엘리먼트인지 확인합니다. `true` 또는 `false`를 반환합니다.

* * *

### `React.Children` {#reactchildren}

`React.Children`는 불투명(Opaque) 자료 구조인 `this.props.children`를 다루는 유틸리티 함수들을 제공합니다.

#### `React.Children.map` {#reactchildrenmap}

```javascript
React.Children.map(children, function[(thisArg)])
```

`children`에 포함된 각 자식에 대하여 `this`를 `thisArg`의 값으로 설정한 함수를 호출합니다. `children`이 배열일 경우, 이 배열의 각 자식에 대하여 함수가 호출됩니다. `children`이 `null` 또는 `undefined`일 경우, 이 메서드는 배열이 아니라 `null` 또는 `undefined`를 반환합니다.

> 주의
>
> `children`이 `Fragment`일 경우, `children`은 단일 자식으로 취급되어 순회하지 않습니다.

#### `React.Children.forEach` {#reactchildrenforeach}

```javascript
React.Children.forEach(children, function[(thisArg)])
```

[`React.Children.map()`](#reactchildrenmap)와 비슷하지만, 배열을 반환하지 않습니다.

#### `React.Children.count` {#reactchildrencount}

```javascript
React.Children.count(children)
```

`children`에 포함된 컴포넌트의 개수를 반환합니다. `map` 또는 `forEach`로 전달된 콜백이 호출된 횟수와 동일한 값입니다.

#### `React.Children.only` {#reactchildrenonly}

```javascript
React.Children.only(children)
```

`children`이 단 하나의 자식(React 엘리먼트)를 갖는지 확인하고 해당 자식 엘리먼트를 반환합니다. 그렇지 않을 경우 오류를 발생시킵니다.

> 주의
>
> `React.Children.only()`는 [`React.Children.map()`](#reactchildrenmap)의 반환값을 허용하지 않는데, 왜냐하면 반환값이 React 엘리먼트가 아니라 배열이기 때문입니다.

#### `React.Children.toArray` {#reactchildrentoarray}

```javascript
React.Children.toArray(children)
```

각 자식에 `key`가 할당된 배열을 `children` 불투명(opaque) 자료 구조로 반환합니다. `render()` 메서드에서 `children`의 집합을 다루고 싶을 때, 특히 `this.props.children`을 하부로 전달하기 전에 다시 정렬하거나 일부만 잘라내고 싶을 때에 유용합니다.

> 주의
>
> `React.Children.toArray()`는 `children`을 평평하게(Flatten) 만들 때, 중첩된 배열들의 의미를 보존하기 위하여 `key`를 변경합니다. 즉, `toArray`는 반환되는 배열에 `key` 값을 덧붙여서 각 엘리먼트가 갖는 `key`가 평평해진 배열 내에서만 유효한 범위를 형성하도록 해줍니다.

* * *

### `React.Fragment` {#reactfragment}

`React.Fragment` 컴포넌트를 사용하면 `render()` 메서드 안에서 추가적인 DOM 엘리먼트를 생성하지 않아도 여러 엘리먼트를 반환할 수 있습니다.

```javascript
render() {
  return (
    <React.Fragment>
      Some text.
      <h2>A heading</h2>
    </React.Fragment>
  );
}
```

축약형인 `<></>` 문법으로도 동일하게 사용할 수 있습니다. 자세한 정보는 [React v16.2.0: Fragment에 대한 향상된 지원](/blog/2017/11/28/react-v16.2.0-fragment-support.html)에서 확인할 수 있습니다.

### `React.createRef` {#reactcreateref}

`React.createRef`는 React 엘리먼트에 `ref` 어트리뷰트로 붙일 수 있는 [ref](/docs/refs-and-the-dom.html)를 생성합니다.
`embed:16-3-release-blog-post/create-ref-example.js`

### `React.forwardRef` {#reactforwardref}

`React.forwardRef`는 전달받은 [`ref`](/docs/refs-and-the-dom.html) 어트리뷰트를 하부 트리 내의 다른 컴포넌트로 전달하는 React 컴포넌트를 생성합니다. 이 기법은 잘 사용되지 않지만, 아래의 두 시나리오에서는 특히 유용합니다.

* [DOM 엘리먼트로 ref 전달하기](/docs/forwarding-refs.html#forwarding-refs-to-dom-components)
* [고차 컴포넌트(Higher Order Component)로 ref 전달하기](/docs/forwarding-refs.html#forwarding-refs-in-higher-order-components)

`React.forwardRef`는 렌더링에 사용될 함수를 인자로 받을 수 있습니다. React는 이 함수를 두 개 인자 `props`와 `ref`를 사용하여 호출하고, 이 함수는 React 노드를 반환합니다.

`embed:reference-react-forward-ref.js`

위의 예시에서 React는 `<FancyButton ref={ref}>` 엘리먼트에 주어진 `ref`를 `React.forwardRef` 호출시 렌더링 함수에 2번째 인자로 전달합니다. 이 렌더링 함수는 `ref`를 `<button ref={ref}>` 엘리먼트에 전달합니다.

따라서 React가 해당 ref를 붙이고 난 뒤, `ref.current`는 `<button>` DOM 엘리먼트 인스턴스를 직접 가리키게 됩니다.

자세한 정보는 [ref 전달하기](/docs/forwarding-refs.html)에서 확인할 수 있습니다.

### `React.lazy` {#reactlazy}

`React.lazy()`를 사용하면 동적으로 불러오는 컴포넌트를 정의할 수 있습니다. 그러면 번들의 크기를 줄이고, 초기 렌더링에서 사용되지 않는 컴포넌트를 불러오는 작업을 지연시킬 수 있습니다.

사용 방법은 [Code Splitting](/docs/code-splitting.html#reactlazy) 문서에서 익힐 수 있습니다. 또한 사용 방법을 자세히 다룬 [이 글](https://medium.com/@pomber/lazy-loading-and-preloading-components-in-react-16-6-804de091c82d)을 읽어보는 것도 좋습니다.

```js
// 이 컴포넌트는 동적으로 불러옵니다
const SomeComponent = React.lazy(() => import('./SomeComponent'));
```

`lazy`한 컴포넌트를 렌더링하려면 렌더링 트리 상위에 `<React.Suspense>` 컴포넌트가 존재해야 한다는 점에 유의하세요. 이를 활용하여 로딩 지시기(Loading indicator)를 나타낼 수 있습니다.


> **주의**
>
> 동적 `import`와 함께 `React.lazy`를 사용하려면 JS 환경이 프라미스(Promise)를 지원해야 합니다. IE11 이하에서는 폴리필(Polyfill)이 필요합니다.

### `React.Suspense` {#reactsuspense}

`React.Suspense`를 사용하면 트리 상에 아직 렌더링이 준비되지 않은 컴포넌트가 있을 때 로딩 지시기(Loading indicator)를 나타낼 수 있습니다. 현재로서는 지연시켜서 불러오는 컴포넌트가 `<React.Suspense>`의 **유일한** 사용 사례입니다.

```js
// 이 컴포넌트는 동적으로 불러옵니다
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    // Displays <Spinner> until OtherComponent loads
    <React.Suspense fallback={<Spinner />}>
      <div>
        <OtherComponent />
      </div>
    </React.Suspense>
  );
}
```

관련된 내용을 [Code Splitting 가이드](/docs/code-splitting.html#reactlazy) 문서에서 설명하고 있습니다. `lazy`한 컴포넌트는 `Suspense` 트리 내의 깊숙한 곳에 위치할 수 있다는 점에 유의하세요. 즉, `Suspense`가 모든 컴포넌트를 감쌀 필요는 없다는 것입니다. 가장 좋은 사용법은 로딩 지시기를 보여주고 싶은 지점에 `<Suspense>`를 작성하는 것이지만, Code Splitting을 하고자 하는 지점 어디서든지 `lazy()`를 써야 할 것입니다.

현재 지원되고 있지는 않지만, 나중에는 `Suspense`가 데이터 불러오기 등의 시나리오를 지원하도록 할 계획입니다. 이와 관련된 내용은 [로드맵](/blog/2018/11/27/react-16-roadmap.html) 문서에서 확인할 수 있습니다.

> 주의
>
>`React.lazy()`와 `<React.Suspense>`는 아직 `ReactDOMServer`에서 지원하지 않습니다. 이 제한 사항은 나중에 해결될 것입니다.
