---
title: <Fragment> (<>...</>)
---

<Intro>

`<Fragment>`는 `<>...</>` 문법으로 자주 사용되며, 래퍼 노드 없이 엘리먼트를 그룹화할 수 있게 해줍니다.

<<<<<<< HEAD
<Canary> Fragment는 `ref`를 받을 수도 있으며, 래퍼 엘리먼트를 추가하지 않고도 기본 DOM 노드와 상호작용할 수 있습니다. 아래 레퍼런스와 사용법을 참고하세요.</Canary>
=======
<Canary>Fragments can also accept refs, which enable interacting with underlying DOM nodes without adding wrapper elements.</Canary>
>>>>>>> 8bb31acb86bf68fa33d97dd0f1b834dfa71e2b1a

```js
<>
  <OneChild />
  <AnotherChild />
</>
```

</Intro>

<InlineToc />

---

## 레퍼런스 {/*reference*/}

### `<Fragment>` {/*fragment*/}

하나의 엘리먼트가 필요한 상황에서 엘리먼트를 `<Fragment>`로 감싸서 그룹화하세요. `Fragment` 안에서 그룹화된 엘리먼트는 DOM 결과물에 영향을 주지 않습니다. 즉, 엘리먼트가 그룹화되지 않은 것과 같습니다. 대부분의 경우 빈 JSX 태그인 `<></>`는 `<Fragment></Fragment>`의 축약형입니다.

#### Props {/*props*/}
- `key`**(선택사항)**: 명시적 `<Fragment>`로 선언된 `Fragment`에는 [`key`](/learn/rendering-lists#keeping-list-items-in-order-with-key)를 사용할 수 있습니다.

<<<<<<< HEAD
- <CanaryBadge />  `ref`**(선택사항)**: ref 객체(예: [`useRef`](/reference/react/useRef)에서 반환된 것) 또는 [콜백 함수](/reference/react-dom/components/common#ref-callback)입니다. React는 `Fragment`로 감싼 DOM 노드와 상호작용하기 위한 메서드를 구현한 `FragmentInstance`를 ref 값으로 제공합니다.

### <CanaryBadge /> FragmentInstance {/*fragmentinstance*/}

`Fragment`에 `ref`를 전달하면, React는 `Fragment`로 감싼 DOM 노드와 상호작용하기 위한 메서드가 포함된 `FragmentInstance` 객체를 제공합니다.

**이벤트 처리 메서드**
- `addEventListener(type, listener, options?)`: Fragment의 모든 최상위 DOM 자식에 이벤트 리스너를 추가합니다.
- `removeEventListener(type, listener, options?)`: Fragment의 모든 최상위 DOM 자식에서 이벤트 리스너를 제거합니다.
- `dispatchEvent(event)`: Fragment의 가상 자식에 이벤트를 디스패치하여 추가된 리스너를 호출하며, DOM 부모로 버블링될 수 있습니다.

**레이아웃 메서드**
- `compareDocumentPosition(otherNode)`: Fragment의 문서 위치를 다른 노드와 비교합니다.
  - Fragment에 자식이 있으면 네이티브 `compareDocumentPosition` 값이 반환됩니다.
  - 빈 Fragment는 React 트리 내에서 위치를 비교하며 `Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC`을 포함합니다.
  - 포탈이나 다른 삽입으로 인해 React 트리와 DOM 트리에서 다른 관계를 가진 엘리먼트는 `Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC`입니다.
- `getClientRects()`: 모든 자식의 경계 사각형을 나타내는 `DOMRect` 객체의 평탄화된 배열을 반환합니다.
- `getRootNode()`: Fragment의 부모 DOM 노드를 포함하는 루트 노드를 반환합니다.

**포커스 관리 메서드**
- `focus(options?)`: Fragment 내의 첫 번째 포커스 가능한 DOM 노드에 포커스합니다. 중첩된 자식에 대해 깊이 우선으로 포커스를 시도합니다.
- `focusLast(options?)`: Fragment 내의 마지막 포커스 가능한 DOM 노드에 포커스합니다. 중첩된 자식에 대해 깊이 우선으로 포커스를 시도합니다.
- `blur()`: `document.activeElement`가 Fragment 내에 있으면 포커스를 제거합니다.

**옵저버 메서드**
- `observeUsing(observer)`: IntersectionObserver 또는 ResizeObserver로 Fragment의 DOM 자식을 관찰하기 시작합니다.
- `unobserveUsing(observer)`: 지정된 옵저버로 Fragment의 DOM 자식 관찰을 중지합니다.
=======
- **optional** `key`: Fragments declared with the explicit `<Fragment>` syntax may have [keys.](/learn/rendering-lists#keeping-list-items-in-order-with-key)
- <CanaryBadge /> **optional** `ref`: A ref object (e.g. from [`useRef`](/reference/react/useRef)) or [callback function](/reference/react-dom/components/common#ref-callback). React provides a `FragmentInstance` as the ref value that implements methods for interacting with the DOM nodes wrapped by the Fragment.
>>>>>>> 8bb31acb86bf68fa33d97dd0f1b834dfa71e2b1a

#### 주의 사항 {/*caveats*/}

<<<<<<< HEAD
- Fragment에 `key`를 사용하려면 `<>...</>` 구문을 사용할 수 없습니다. 명시적으로 `react`에서 `Fragment`를 불러오고<sup>Import</sup> `<Fragment key={yourKey}>...</Fragment>`를 렌더링해야 합니다.

- React는 `<><Child /></>`에서 `[<Child />]`로 렌더링하거나 (또는 반대의 경우), 혹은 `<><Child /></>` 에서 `<Child />` 렌더링하거나 (또는 반대의 경우) [State를 초기화](/learn/preserving-and-resetting-state)하지 않습니다. 이는 오직 한 단계 깊이<sup>Single Level Deep</sup>까지만 적용됩니다. 예를 들어 `<><><Child /></></>` 에서 `<Child />`로 렌더링하는 것은 State가 초기화됩니다. 정확한 의미는 [여기](https://gist.github.com/clemmy/b3ef00f9507909429d8aa0d3ee4f986b)서 확인할 수 있습니다.

- <CanaryBadge /> Fragment에 `ref`를 전달하려면 `<>...</>` 문법을 사용할 수 없습니다. 명시적으로 `'react'`에서 `Fragment`를 불러오고 `<Fragment ref={yourRef}>...</Fragment>`를 렌더링해야 합니다.
=======
* If you want to pass `key` to a Fragment, you can't use the `<>...</>` syntax. You have to explicitly import `Fragment` from `'react'` and render `<Fragment key={yourKey}>...</Fragment>`.

* React does not [reset state](/learn/preserving-and-resetting-state) when you go from rendering `<><Child /></>` to `[<Child />]` or back, or when you go from rendering `<><Child /></>` to `<Child />` and back. This only works a single level deep: for example, going from `<><><Child /></></>` to `<Child />` resets the state. See the precise semantics [here.](https://gist.github.com/clemmy/b3ef00f9507909429d8aa0d3ee4f986b)

* <CanaryBadge /> If you want to pass `ref` to a Fragment, you can't use the `<>...</>` syntax. You have to explicitly import `Fragment` from `'react'` and render `<Fragment ref={yourRef}>...</Fragment>`.

---

### <CanaryBadge /> `FragmentInstance` {/*fragmentinstance*/}

When you pass a `ref` to a Fragment, React provides a `FragmentInstance` object. It implements methods for interacting with the first-level DOM children wrapped by the Fragment.

* [`addEventListener`](#addeventlistener) and [`removeEventListener`](#removeeventlistener) manage event listeners across all first-level DOM children.
* [`dispatchEvent`](#dispatchevent) dispatches an event on the Fragment, which can bubble to the DOM parent.
* [`focus`](#focus), [`focusLast`](#focuslast), and [`blur`](#blur) manage focus across all nested children depth-first.
* [`observeUsing`](#observeusing) and [`unobserveUsing`](#unobserveusing) attach and detach `IntersectionObserver` or `ResizeObserver` instances.
* [`getClientRects`](#getclientrects) returns bounding rectangles of all first-level DOM children.
* [`getRootNode`](#getrootnode) returns the root node of the Fragment's parent.
* [`compareDocumentPosition`](#comparedocumentposition) compares the Fragment's position with another node.
* [`scrollIntoView`](#scrollintoview) scrolls the Fragment's children into view.

---

#### `addEventListener(type, listener, options?)` {/*addeventlistener*/}

Adds an event listener to all first-level DOM children of the Fragment.

```js
fragmentRef.current.addEventListener('click', handleClick);
```

##### Parameters {/*addeventlistener-parameters*/}

* `type`: A string representing the event type to listen for (e.g. `'click'`, `'focus'`).
* `listener`: The event handler function.
* **optional** `options`: An options object or boolean for capture, matching the [DOM `addEventListener` API.](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)

##### Returns {/*addeventlistener-returns*/}

`addEventListener` does not return anything (`undefined`).

---

#### `removeEventListener(type, listener, options?)` {/*removeeventlistener*/}

Removes an event listener from all first-level DOM children of the Fragment.

```js
fragmentRef.current.removeEventListener('click', handleClick);
```

##### Parameters {/*removeeventlistener-parameters*/}

* `type`: The event type string.
* `listener`: The event handler function to remove.
* **optional** `options`: An options object or boolean, matching the [DOM `removeEventListener` API.](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener)

##### Returns {/*removeeventlistener-returns*/}

`removeEventListener` does not return anything (`undefined`).

---

#### `dispatchEvent(event)` {/*dispatchevent*/}

Dispatches an event on the Fragment. Added event listeners are called, and the event can bubble to the Fragment's DOM parent.

```js
fragmentRef.current.dispatchEvent(new Event('custom', { bubbles: true }));
```

##### Parameters {/*dispatchevent-parameters*/}

* `event`: An [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event) object to dispatch. If `bubbles` is `true`, the event bubbles to the Fragment's parent DOM node.

##### Returns {/*dispatchevent-returns*/}

`true` if the event was not cancelled, `false` if `preventDefault()` was called.

---

#### `focus(options?)` {/*focus*/}

Focuses the first focusable DOM node in the Fragment. Unlike calling `element.focus()` on a DOM element, this method searches *all* nested children depth-first until it finds a focusable element—not just the element itself or its direct children.

```js
fragmentRef.current.focus();
```

##### Parameters {/*focus-parameters*/}

* **optional** `options`: A [`FocusOptions`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#options) object (e.g. `{ preventScroll: true }`).

##### Returns {/*focus-returns*/}

`focus` does not return anything (`undefined`).

---

#### `focusLast(options?)` {/*focuslast*/}

Focuses the last focusable DOM node in the Fragment. Searches nested children depth-first, then iterates in reverse.

```js
fragmentRef.current.focusLast();
```

##### Parameters {/*focuslast-parameters*/}

* **optional** `options`: A [`FocusOptions`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#options) object.

##### Returns {/*focuslast-returns*/}

`focusLast` does not return anything (`undefined`).

---

#### `blur()` {/*blur*/}

Removes focus from the active element if it is within the Fragment. If `document.activeElement` is not within the Fragment, `blur` does nothing.

```js
fragmentRef.current.blur();
```

##### Returns {/*blur-returns*/}

`blur` does not return anything (`undefined`).

---

#### `observeUsing(observer)` {/*observeusing*/}

Starts observing all first-level DOM children of the Fragment with the provided observer.

```js
const observer = new IntersectionObserver(callback, options);
fragmentRef.current.observeUsing(observer);
```

##### Parameters {/*observeusing-parameters*/}

* `observer`: An [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver) or [`ResizeObserver`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) instance.

##### Returns {/*observeusing-returns*/}

`observeUsing` does not return anything (`undefined`).

---

#### `unobserveUsing(observer)` {/*unobserveusing*/}

Stops observing the Fragment's DOM children with the specified observer.

```js
fragmentRef.current.unobserveUsing(observer);
```

##### Parameters {/*unobserveusing-parameters*/}

* `observer`: The same `IntersectionObserver` or `ResizeObserver` instance previously passed to [`observeUsing`](#observeusing).

##### Returns {/*unobserveusing-returns*/}

`unobserveUsing` does not return anything (`undefined`).

---

#### `getClientRects()` {/*getclientrects*/}

Returns a flat array of [`DOMRect`](https://developer.mozilla.org/en-US/docs/Web/API/DOMRect) objects representing the bounding rectangles of all first-level DOM children.

```js
const rects = fragmentRef.current.getClientRects();
```

##### Returns {/*getclientrects-returns*/}

An `Array<DOMRect>` containing the bounding rectangles of all children.

---

#### `getRootNode(options?)` {/*getrootnode*/}

Returns the root node containing the Fragment's parent DOM node, matching the behavior of [`Node.getRootNode()`](https://developer.mozilla.org/en-US/docs/Web/API/Node/getRootNode).

```js
const root = fragmentRef.current.getRootNode();
```

##### Parameters {/*getrootnode-parameters*/}

* **optional** `options`: An object with a `composed` boolean property, matching the [DOM `getRootNode` API.](https://developer.mozilla.org/en-US/docs/Web/API/Node/getRootNode#options)

##### Returns {/*getrootnode-returns*/}

A `Document`, `ShadowRoot`, or the `FragmentInstance` itself if there is no parent DOM node.

---

#### `compareDocumentPosition(otherNode)` {/*comparedocumentposition*/}

Compares the document position of the Fragment with another node, returning a bitmask matching the behavior of [`Node.compareDocumentPosition()`](https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition).

```js
const position = fragmentRef.current.compareDocumentPosition(otherElement);
```

##### Parameters {/*comparedocumentposition-parameters*/}

* `otherNode`: The DOM node to compare against.

##### Returns {/*comparedocumentposition-returns*/}

A bitmask of [position flags](https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition#return_value). Empty Fragments and Fragments with children rendered through a [portal](/reference/react-dom/createPortal) include `Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC` in the result.

---

#### `scrollIntoView(alignToTop?)` {/*scrollintoview*/}

Scrolls the Fragment's children into view. When `alignToTop` is `true` or omitted, scrolls to align the first child with the top of the scrollable ancestor. When `alignToTop` is `false`, scrolls to align the last child with the bottom.

```js
fragmentRef.current.scrollIntoView();
```

##### Parameters {/*scrollintoview-parameters*/}

* **optional** `alignToTop`: A boolean. If `true` (the default), scrolls the first child to the top of the scrollable area. If `false`, scrolls the last child to the bottom. Unlike [`Element.scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView), this method does not accept a `ScrollIntoViewOptions` object.

##### Returns {/*scrollintoview-returns*/}

`scrollIntoView` does not return anything (`undefined`).

##### Caveats {/*scrollintoview-caveats*/}

* `scrollIntoView` does not accept an options object. Passing one throws an error. Use the `alignToTop` boolean instead.
* When the Fragment has no children, `scrollIntoView` scrolls the nearest sibling or parent into view as a fallback.

---

#### `FragmentInstance` Caveats {/*fragmentinstance-caveats*/}

* Methods that target children (such as `addEventListener`, `observeUsing`, and `getClientRects`) operate on *first-level host (DOM) children* of the Fragment. They do not directly target children nested inside another DOM element.
* `focus` and `focusLast` search nested children depth-first for focusable elements, unlike event and observer methods which only target first-level host children.
* `observeUsing` does not work on text nodes. React logs a warning in development if the Fragment contains only text children.
* React does not apply event listeners added via `addEventListener` to hidden [`<Activity>`](/reference/react/Activity) trees. When an `Activity` boundary switches from hidden to visible, listeners are applied automatically.
* Each first-level DOM child of a Fragment with a `ref` gets a `reactFragments` property—a `Set<FragmentInstance>` containing all Fragment instances that own the element. This enables [caching a shared observer](#caching-global-intersection-observer) across multiple Fragments.
>>>>>>> 8bb31acb86bf68fa33d97dd0f1b834dfa71e2b1a

---

## 사용법 {/*usage*/}

### 여러 엘리먼트 반환하기 {/*returning-multiple-elements*/}

여러 엘리먼트를 함께 그룹화하기 위해 `Fragment`나 `<>...</>` 문법을 사용하세요. 한 개의 엘리먼트가 존재할 수 있는 곳에 여러 엘리먼트를 넣을 수 있습니다. 예를 들어 컴포넌트는 한 개의 엘리먼트만 반환할 수 있지만 `Fragment`를 사용하여 여러 엘리먼트를 함께 그룹화하여 반환할 수 있습니다.

```js {3,6}
function Post() {
  return (
    <>
      <PostTitle />
      <PostBody />
    </>
  );
}
```

`Fragment`로 엘리먼트를 그룹화하면 DOM 엘리먼트와 같은 다른 컨테이너로 엘리먼트를 감싸는 경우와는 달리, 레이아웃이나 스타일에 영향을 주지 않기 때문에 `Fragment`는 효과적입니다. 브라우저로 아래 예시를 검사하면 모든 `<h1>`, `<article>` DOM 노드가 래퍼 없이 형제 노드로 나타나는 것을 볼 수 있습니다.

<Sandpack>

```js
export default function Blog() {
  return (
    <>
      <Post title="An update" body="It's been a while since I posted..." />
      <Post title="My new blog" body="I am starting a new blog!" />
    </>
  )
}

function Post({ title, body }) {
  return (
    <>
      <PostTitle title={title} />
      <PostBody body={body} />
    </>
  );
}

function PostTitle({ title }) {
  return <h1>{title}</h1>
}

function PostBody({ body }) {
  return (
    <article>
      <p>{body}</p>
    </article>
  );
}
```

</Sandpack>

<DeepDive>

#### 특별한 문법 없이 `Fragment`를 작성하는 방법은 무엇인가요? {/*how-to-write-a-fragment-without-the-special-syntax*/}

위의 예시는 React에서 `Fragment`를 불러오는<sup>Import</sup> 것과 동일합니다.

```js {1,5,8}
import { Fragment } from 'react';

function Post() {
  return (
    <Fragment>
      <PostTitle />
      <PostBody />
    </Fragment>
  );
}
```

일반적으로 [`Fragment`에 `key`를 넘겨야 하는 경우](#rendering-a-list-of-fragments)가 아니라면 이 기능은 필요하지 않습니다.

</DeepDive>

---

### 변수에 여러 엘리먼트 할당 {/*assigning-multiple-elements-to-a-variable*/}

다른 엘리먼트와 마찬가지로 `Fragment`를 변수에 할당하고 Props로 전달하는 등의 작업을 할 수 있습니다.

```js
function CloseDialog() {
  const buttons = (
    <>
      <OKButton />
      <CancelButton />
    </>
  );
  return (
    <AlertDialog buttons={buttons}>
      Are you sure you want to leave this page?
    </AlertDialog>
  );
}
```

---

### 텍스트와 함께 엘리먼트 그룹화 {/*grouping-elements-with-text*/}

`Fragment`를 사용하여 텍스트를 컴포넌트와 함께 그룹화할 수 있습니다.

```js
function DateRangePicker({ start, end }) {
  return (
    <>
      From
      <DatePicker date={start} />
      to
      <DatePicker date={end} />
    </>
  );
}
```

---

### `Fragment` 리스트 렌더링 {/*rendering-a-list-of-fragments*/}

`<></>` 문법을 사용하는 대신 명시적으로 `Fragment`를 작성해야 하는 상황이 있습니다. [반복을 통해 여러 엘리먼트를 렌더링할 때](/learn/rendering-lists) 각 요소에 `key`를 할당해야 합니다. 반복 안에 엘리먼트가 `Fragment`인 경우 `key` 속성을 제공하기 위해 일반 JSX 엘리먼트 문법을 사용해야 합니다.

```js {3,6}
function Blog() {
  return posts.map(post =>
    <Fragment key={post.id}>
      <PostTitle title={post.title} />
      <PostBody body={post.body} />
    </Fragment>
  );
}
```

DOM을 검사하여 `Fragment` 자식 주위에 래퍼 엘리먼트가 없는 것을 확인할 수 있습니다.

<Sandpack>

```js
import { Fragment } from 'react';

const posts = [
  { id: 1, title: 'An update', body: "It's been a while since I posted..." },
  { id: 2, title: 'My new blog', body: 'I am starting a new blog!' }
];

export default function Blog() {
  return posts.map(post =>
    <Fragment key={post.id}>
      <PostTitle title={post.title} />
      <PostBody body={post.body} />
    </Fragment>
  );
}

function PostTitle({ title }) {
  return <h1>{title}</h1>
}

function PostBody({ body }) {
  return (
    <article>
      <p>{body}</p>
    </article>
  );
}
```

</Sandpack>

---

<<<<<<< HEAD
### <CanaryBadge /> Fragment ref를 사용한 DOM 상호작용 {/*using-fragment-refs-for-dom-interaction*/}

Fragment ref를 사용하면 래퍼 엘리먼트를 추가하지 않고도 Fragment로 감싼 DOM 노드와 상호작용할 수 있습니다. 이벤트 처리, 가시성 추적, 포커스 관리, 그리고 `ReactDOM.findDOMNode()`와 같이 더 이상 사용되지 않는 패턴을 대체하는 데 유용합니다.
=======
### <CanaryBadge /> Adding event listeners without a wrapper element {/*adding-event-listeners-without-wrapper*/}

Fragment `ref`s let you add event listeners to a group of elements without adding a wrapper DOM node. Use a [ref callback](/reference/react-dom/components/common#ref-callback) to attach and clean up listeners:

<Sandpack>
>>>>>>> 8bb31acb86bf68fa33d97dd0f1b834dfa71e2b1a

```js
import { Fragment, useState, useRef, useEffect } from 'react';

function ClickableFragment({ children, onClick }) {
  const fragmentRef = useRef(null);
  useEffect(() => {
    const fragmentInstance = fragmentRef.current;
    if (fragmentInstance === null) {
      return;
    }
    fragmentInstance.addEventListener('click', onClick);
    return () => {
      fragmentInstance.removeEventListener(
        'click',
        onClick
      );
    };
  }, [onClick])
  return (
    <Fragment ref={fragmentRef}>
      {children}
    </Fragment>
  );
}

export default function App() {
  const [clicks, setClicks] = useState(0);

  return (
    <>
      <p>Total clicks: {clicks}</p>
      <ClickableFragment onClick={() => {
        setClicks(c => c + 1);
      }}>
        <button>Button A</button>
        <button>Button B</button>
        <button>Button C</button>
      </ClickableFragment>
    </>
  );
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

The `addEventListener` call applies the listener to every first-level DOM child of the Fragment. When children are dynamically added or removed, the `FragmentInstance` automatically adds or removes the listener.

<DeepDive>

#### Which children does a Fragment ref target? {/*which-children-does-a-fragment-ref-target*/}

A `FragmentInstance` targets the **first-level host (DOM) children** of the Fragment. Consider this tree:

```js
<Fragment ref={ref}>
  <div id="A" />
  <Wrapper>
    <div id="B">
      <div id="C" />
    </div>
  </Wrapper>
  <div id="D" />
</Fragment>
```

`Wrapper` is a React component, so the `FragmentInstance` looks through it to find DOM nodes. The targeted children are `A`, `B`, and `D`. `C` is not targeted because it is nested inside the DOM element `B`.

Methods like `addEventListener`, `observeUsing`, and `getClientRects` operate on these first-level DOM children. `focus` and `focusLast` are different—they search *all* nested children depth-first to find focusable elements.

</DeepDive>

---

<<<<<<< HEAD
### <CanaryBadge /> Fragment ref로 가시성 추적하기 {/*tracking-visibility-with-fragment-refs*/}

Fragment ref는 가시성 추적과 교차 관찰에 유용합니다. 자식 컴포넌트가 ref를 노출하지 않아도 콘텐츠가 화면에 보이는 시점을 모니터링할 수 있습니다.
=======
### <CanaryBadge /> Managing focus across a group of elements {/*managing-focus-across-elements*/}

Fragment `ref`s provide `focus`, `focusLast`, and `blur` methods that operate across all DOM nodes within the Fragment:
>>>>>>> 8bb31acb86bf68fa33d97dd0f1b834dfa71e2b1a

<Sandpack>

```js
import { Fragment, useRef } from 'react';

function FormFields({ children }) {
  const fragmentRef = useRef(null);

  return (
    <>
      <div className="buttons">
        <button onClick={() => {
          fragmentRef.current.focus();
        }}>
          Focus first
        </button>
        <button onClick={() => {
          fragmentRef.current.focusLast();
        }}>
          Focus last
        </button>
        <button onClick={() => {
          fragmentRef.current.blur();
        }}>
          Blur
        </button>
      </div>
      <Fragment ref={fragmentRef}>
        {children}
      </Fragment>
    </>
  );
}

// Even though the inputs are deeply nested,
// focus() searches depth-first to find them.
export default function App() {
  return (
    <FormFields>
      <fieldset>
        <legend>Shipping</legend>
        <label>
          Street: <input name="street" />
        </label>
        <label>
          City: <input name="city" />
        </label>
      </fieldset>
    </FormFields>
  );
}
```

```css
.buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

label {
  display: inline-block;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

Calling `focus()` focuses the `street` input—even though it is nested inside a `<fieldset>` and `<label>`. `focus()` searches depth-first through all nested children, not just direct children of the Fragment. `focusLast()` does the same in reverse, and `blur()` removes focus if the currently focused element is within the Fragment.

---

### <CanaryBadge /> Scrolling a group of elements into view {/*scrolling-group-into-view*/}

Use `scrollIntoView` to scroll a Fragment's children into view without a wrapper element. Pass `true` (or omit the argument) to scroll the first child to the top. Pass `false` to scroll the last child to the bottom:

<Sandpack>

```js
import { Fragment, useRef } from 'react';

function ScrollableSection({ children }) {
  const fragmentRef = useRef(null);

  return (
    <>
      <div className="buttons">
        <button onClick={() => {
          fragmentRef.current.scrollIntoView();
        }}>
          Scroll to top
        </button>
        <button onClick={() => {
          fragmentRef.current.scrollIntoView(false);
        }}>
          Scroll to bottom
        </button>
      </div>
      <div className="container">
        <Fragment ref={fragmentRef}>
          {children}
        </Fragment>
      </div>
    </>
  );
}

const items = [];
for (let i = 1; i <= 25; i++) {
  items.push('Item ' + i);
}

export default function App() {
  return (
    <ScrollableSection>
      <h3>Section Start</h3>
      {items.map((item) => (
        <p key={item}>{item}</p>
      ))}
      <h3>Section End</h3>
    </ScrollableSection>
  );
}
```

```css
.buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.container {
  height: 200px;
  overflow-y: auto;
  border: 2px solid #c4c4c4;
  border-radius: 4px;
  padding: 10px;
}

h3 {
  margin: 4px 0;
  /* Padding to handle offset of global sticky nav when scrolling for example */
  padding-top: 4em;
  color: #1a73e8;
}

p {
  margin: 4px 0;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

---

### <CanaryBadge /> Observing visibility without a wrapper element {/*observing-visibility-without-wrapper*/}

Use `observeUsing` to attach an `IntersectionObserver` to all first-level DOM children of a Fragment. This lets you track visibility without requiring child components to expose `ref`s or adding a wrapper element:

<Sandpack>

```js
import {
  Fragment,
  useRef,
  useLayoutEffect,
  useState,
} from 'react';
import Card from './Card';

function VisibleGroup({ onVisibilityChange, children }) {
  const fragmentRef = useRef(null);

  useLayoutEffect(() => {
    const visibleElements = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            visibleElements.add(e.target);
          } else {
            visibleElements.delete(e.target);
          }
        });
        onVisibilityChange(visibleElements.size > 0);
      }
    );
    const fragmentInstance = fragmentRef.current;
    fragmentInstance.observeUsing(observer);
    return () => {
      fragmentInstance.unobserveUsing(observer);
    };
  }, [onVisibilityChange]);

  return (
    <Fragment ref={fragmentRef}>
      {children}
    </Fragment>
  );
}

export default function App() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className={isVisible ? 'page visible' : 'page'}>
      <div className="filler">Scroll down</div>
      <VisibleGroup onVisibilityChange={setIsVisible}>
        <Card title="First section" />
        <Card title="Second section" />
      </VisibleGroup>
      <div className="filler">Scroll up</div>
    </div>
  );
}
```

<<<<<<< HEAD
이 패턴은 Effect 기반 가시성 로깅의 대안이며, Effect 기반 방식은 대부분의 경우 안티패턴입니다. Effect에만 의존하면 렌더링된 컴포넌트가 사용자에게 실제로 보이는지 보장할 수 없습니다.

---

### <CanaryBadge /> Fragment ref로 포커스 관리하기 {/*focus-management-with-fragment-refs*/}

Fragment ref는 Fragment 내의 모든 DOM 노드에서 동작하는 포커스 관리 메서드를 제공합니다.
=======
```css
.page {
  transition: background 0.3s;
}

.page.visible {
  background: #d4edda;
}

.filler {
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-size: 14px;
}

.card {
  padding: 16px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 8px 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  font-weight: 600;
  font-size: 14px;
}
```

```js src/Card.js hidden
export default function Card({ title }) {
  return <div className="card">{title}</div>;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

---

### <CanaryBadge /> Caching a global IntersectionObserver {/*caching-global-intersection-observer*/}

A common performance optimization for sites with many observers is to share a single IntersectionObserver per config and route its entries to the correct callbacks based on which element intersected. Fragment `ref`s support this same pattern through the `reactFragments` property.
>>>>>>> 8bb31acb86bf68fa33d97dd0f1b834dfa71e2b1a

Each first-level DOM child of a Fragment with a `ref` has a `reactFragments` property: a `Set` of `FragmentInstance` objects that contain that element. When the shared observer fires, you can use this property to look up which `FragmentInstance` owns the intersecting element and run the right callbacks.

<Sandpack>

```js src/App.js active
import { useState, useCallback } from 'react';
import ObservedGroup from './ObservedGroup';
import Card from './Card';

export default function App() {
  const [bgColor, setBgColor] = useState(null);

  const onGreen = useCallback((entry) => {
    if (entry.isIntersecting) {
      setBgColor('#d4edda');
    }
  }, []);

  const onBlue = useCallback((entry) => {
    if (entry.isIntersecting) {
      setBgColor('#cce5ff');
    }
  }, []);

  return (
    <div className="page" style={{
      background: bgColor || 'white',
    }}>
      <div className="filler">Scroll down</div>
      <ObservedGroup onIntersection={onGreen}>
        <Card title="Green section" className="green" />
      </ObservedGroup>
      <div className="filler" />
      <ObservedGroup onIntersection={onBlue}>
        <Card title="Blue section" className="blue" />
      </ObservedGroup>
      <div className="filler">Scroll up</div>
    </div>
  );
}
```

```js src/ObservedGroup.js
import {
  Fragment,
  useRef,
  useLayoutEffect,
} from 'react';

const callbackMap = new WeakMap();
const observerCache = new Map();

function getOptionsKey(options) {
  const root = options?.root ?? null;
  const rootMargin = options?.rootMargin ?? '0px';
  const threshold = options?.threshold ?? 0;
  return `${rootMargin}|${threshold}`;
}

function getSharedObserver(
  fragmentInstance,
  onIntersection,
  options,
) {
  // Register this callback for the
  // fragment instance.
  const existing =
    callbackMap.get(fragmentInstance);
  callbackMap.set(
    fragmentInstance,
    existing
      ? [...existing, onIntersection]
      : [onIntersection],
  );

  const key = getOptionsKey(options);
  if (observerCache.has(key)) {
    return observerCache.get(key);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        // Look up which FragmentInstances own
        // this element.
        const fragmentInstances =
          entry.target.reactFragments;
        if (fragmentInstances) {
          for (const inst of fragmentInstances) {
            const callbacks =
              callbackMap.get(inst) || [];
            callbacks.forEach(cb => cb(entry));
          }
        }
      }
    },
    options,
  );

  observerCache.set(key, observer);
  return observer;
}

export default function ObservedGroup({
  onIntersection,
  options,
  children,
}) {
  const fragmentRef = useRef(null);

  useLayoutEffect(() => {
    const fragmentInstance = fragmentRef.current;
    const observer = getSharedObserver(
      fragmentInstance,
      onIntersection,
      options,
    );
    fragmentInstance.observeUsing(observer);
    return () => {
      fragmentInstance.unobserveUsing(observer);
      callbackMap.delete(fragmentInstance);
    };
  }, [onIntersection, options]);

  return (
    <Fragment ref={fragmentRef}>
      {children}
    </Fragment>
  );
}
```

<<<<<<< HEAD
`focus()` 메서드는 Fragment 내의 첫 번째 포커스 가능한 엘리먼트에 포커스하고, `focusLast()`는 마지막 포커스 가능한 엘리먼트에 포커스합니다.
=======
```css
.page {
  transition: background 0.3s;
}

.filler {
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-size: 14px;
}

.card {
  padding: 16px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 0 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  font-weight: 600;
  font-size: 14px;
}

.card.green {
  border-left: 3px solid #28a745;
}

.card.blue {
  border-left: 3px solid #007bff;
}
```

```js src/Card.js hidden
export default function Card({ title, className }) {
  return <div className={'card' + (className ? ' ' + className : '')}>{title}</div>;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

Multiple `ObservedGroup` components with the same options reuse a single `IntersectionObserver`. When either section scrolls into view, the shared observer fires and uses `reactFragments` to route the entry to the correct callback.
>>>>>>> 8bb31acb86bf68fa33d97dd0f1b834dfa71e2b1a
