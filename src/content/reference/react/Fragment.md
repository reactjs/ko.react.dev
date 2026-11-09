---
title: <Fragment> (<>...</>)
---

<Intro>

`<Fragment>`는 `<>...</>` 문법으로 자주 사용되며, 래퍼 노드 없이 엘리먼트를 그룹화할 수 있게 해줍니다.

<Canary> Fragment는 `ref`를 받을 수도 있으며, 래퍼 엘리먼트를 추가하지 않고도 기본 DOM 노드와 상호작용할 수 있습니다. 아래 레퍼런스와 사용법을 참고하세요.</Canary>

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

- <CanaryBadge />  `ref`**(선택사항)**: ref 객체(예: [`useRef`](/reference/react/useRef)에서 반환된 것) 또는 [콜백 함수](/reference/react-dom/components/common#ref-callback)입니다. React는 `Fragment`로 감싼 DOM 노드와 상호작용하기 위한 메서드를 구현한 `FragmentInstance`를 ref 값으로 제공합니다.

#### 주의 사항 {/*caveats*/}

- Fragment에 `key`를 사용하려면 `<>...</>` 구문을 사용할 수 없습니다. 명시적으로 `react`에서 `Fragment`를 불러오고<sup>Import</sup> `<Fragment key={yourKey}>...</Fragment>`를 렌더링해야 합니다.

- React는 `<><Child /></>`에서 `[<Child />]`로 렌더링하거나 (또는 반대의 경우), 혹은 `<><Child /></>` 에서 `<Child />` 렌더링하거나 (또는 반대의 경우) [State를 초기화](/learn/preserving-and-resetting-state)하지 않습니다. 이는 오직 한 단계 깊이<sup>Single Level Deep</sup>까지만 적용됩니다. 예를 들어 `<><><Child /></></>` 에서 `<Child />`로 렌더링하는 것은 State가 초기화됩니다. 정확한 의미는 [여기](https://gist.github.com/clemmy/b3ef00f9507909429d8aa0d3ee4f986b)서 확인할 수 있습니다.

- <CanaryBadge /> Fragment에 `ref`를 전달하려면 `<>...</>` 문법을 사용할 수 없습니다. 명시적으로 `'react'`에서 `Fragment`를 불러오고 `<Fragment ref={yourRef}>...</Fragment>`를 렌더링해야 합니다.

---

### `FragmentInstance` {/*fragmentinstance*/}

Fragment에 `ref`를 전달하면 React는 `FragmentInstance` 객체를 제공합니다. 이 객체는 Fragment로 감싼 1단계 자식 DOM 노드와 상호작용하기 위한 메서드를 구현합니다.

* [`addEventListener`](#addeventlistener) 및 [`removeEventListener`](#removeeventlistener): 모든 1단계 자식 DOM에 걸쳐 이벤트 리스너를 관리합니다.
* [`dispatchEvent`](#dispatchevent): Fragment에서 이벤트를 발생시키며, 이 이벤트는 상위 DOM으로 버블링될 수 있습니다.
* [`focus`](#focus), [`focusLast`](#focuslast), [`blur`](#blur): 깊이 우선으로 중첩된 모든 자식에 걸쳐 포커스를 관리합니다.
* [`observeUsing`](#observeusing) 및 [`unobserveUsing`](#unobserveusing): `IntersectionObserver` 또는 `ResizeObserver` 인스턴스를 연결하거나 해제합니다.
* [`getClientRects`](#getclientrects): 모든 1단계 자식 DOM의 경계 사각형(bounding rectangles) 배열을 반환합니다.
* [`getRootNode`](#getrootnode): Fragment 상위 항목의 루트 노드를 반환합니다.
* [`compareDocumentPosition`](#comparedocumentposition): Fragment의 위치를 다른 노드와 비교합니다.
* [`scrollIntoView`](#scrollintoview): Fragment의 자식이 화면에 보이도록 스크롤합니다.

---

#### `addEventListener(type, listener, options?)` {/*addeventlistener*/}

Fragment의 모든 1단계 자식 DOM에 이벤트 리스너를 추가합니다.

```js
fragmentRef.current.addEventListener('click', handleClick);
```

##### 매개변수 {/*addeventlistener-parameters*/}

* `type`: 수신 대기할 이벤트 타입을 나타내는 문자열(예: `'click'`, `'focus'`)입니다.
* `listener`: 이벤트 핸들러 함수입니다.
* **선택사항** `options`: 캡처 여부를 지정하는 불리언 또는 옵션 객체이며, [DOM `addEventListener` API](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)와 일치합니다.

##### 반환값 {/*addeventlistener-returns*/}

`addEventListener`는 아무것도 반환하지 않습니다(`undefined`).

---

#### `removeEventListener(type, listener, options?)` {/*removeeventlistener*/}

Fragment의 모든 1단계 자식 DOM에서 이벤트 리스너를 제거합니다.

```js
fragmentRef.current.removeEventListener('click', handleClick);
```

##### 매개변수 {/*removeeventlistener-parameters*/}

* `type`: 이벤트 타입 문자열입니다.
* `listener`: 제거할 이벤트 핸들러 함수입니다.
* **선택사항** `options`: 옵션 객체 또는 불리언이며, [DOM `removeEventListener` API](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener)와 일치합니다.

##### 반환값 {/*removeeventlistener-returns*/}

`removeEventListener`는 아무것도 반환하지 않습니다(`undefined`).

---

#### `dispatchEvent(event)` {/*dispatchevent*/}

Fragment에서 이벤트를 발생시킵니다. 등록된 이벤트 리스너가 호출되며, 이벤트는 Fragment의 상위 DOM 노드로 버블링될 수 있습니다.

```js
fragmentRef.current.dispatchEvent(new Event('custom', { bubbles: true }));
```

##### 매개변수 {/*dispatchevent-parameters*/}

* `event`: 발생시킬 [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event) 객체입니다. `bubbles`가 `true`이면 이벤트가 Fragment의 상위 DOM 노드로 버블링됩니다.

##### 반환값 {/*dispatchevent-returns*/}

이벤트가 취소되지 않았으면 `true`, `preventDefault()`가 호출되었으면 `false`를 반환합니다.

---

#### `focus(options?)` {/*focus*/}

Fragment 내에서 포커스 가능한 첫 번째 DOM 노드에 포커스를 맞춥니다. DOM 엘리먼트에서 `element.focus()`를 호출하는 것과 달리, 이 메서드는 엘리먼트 자체나 직계 자식뿐만 아니라 포커스 가능한 요소를 찾을 때까지 중첩된 *모든* 자식을 깊이 우선으로 탐색합니다.

```js
fragmentRef.current.focus();
```

##### 매개변수 {/*focus-parameters*/}

* **선택사항** `options`: [`FocusOptions`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#options) 객체입니다(예: `{ preventScroll: true }`).

##### 반환값 {/*focus-returns*/}

`focus`는 아무것도 반환하지 않습니다(`undefined`).

---

#### `focusLast(options?)` {/*focuslast*/}

Fragment 내에서 포커스 가능한 마지막 DOM 노드에 포커스를 맞춥니다. 중첩된 자식을 깊이 우선으로 탐색한 후 역순으로 순회합니다.

```js
fragmentRef.current.focusLast();
```

##### 매개변수 {/*focuslast-parameters*/}

* **선택사항** `options`: [`FocusOptions`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#options) 객체입니다.

##### 반환값 {/*focuslast-returns*/}

`focusLast`는 아무것도 반환하지 않습니다(`undefined`).

---

#### `blur()` {/*blur*/}

활성 엘리먼트가 Fragment 내에 있는 경우 포커스를 제거합니다. `document.activeElement`가 Fragment 내에 있지 않으면 `blur`는 아무 작업도 수행하지 않습니다.

```js
fragmentRef.current.blur();
```

##### 반환값 {/*blur-returns*/}

`blur`는 아무것도 반환하지 않습니다(`undefined`).

---

#### `observeUsing(observer)` {/*observeusing*/}

제공된 옵저버로 Fragment의 모든 1단계 자식 DOM에 대한 관찰을 시작합니다.

```js
const observer = new IntersectionObserver(callback, options);
fragmentRef.current.observeUsing(observer);
```

##### 매개변수 {/*observeusing-parameters*/}

* `observer`: [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver) 또는 [`ResizeObserver`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) 인스턴스입니다.

##### 반환값 {/*observeusing-returns*/}

`observeUsing`은 아무것도 반환하지 않습니다(`undefined`).

---

#### `unobserveUsing(observer)` {/*unobserveusing*/}

지정된 옵저버를 사용한 Fragment 자식 DOM에 대한 관찰을 중지합니다.

```js
fragmentRef.current.unobserveUsing(observer);
```

##### 매개변수 {/*unobserveusing-parameters*/}

* `observer`: 이전에 [`observeUsing`](#observeusing)에 전달했던 것과 동일한 `IntersectionObserver` 또는 `ResizeObserver` 인스턴스입니다.

##### 반환값 {/*unobserveusing-returns*/}

`unobserveUsing`은 아무것도 반환하지 않습니다(`undefined`).

---

#### `getClientRects()` {/*getclientrects*/}

모든 1단계 자식 DOM의 경계 사각형을 나타내는 [`DOMRect`](https://developer.mozilla.org/en-US/docs/Web/API/DOMRect) 객체의 평탄한 배열을 반환합니다.

```js
const rects = fragmentRef.current.getClientRects();
```

##### 반환값 {/*getclientrects-returns*/}

모든 자식의 경계 사각형이 포함된 `Array<DOMRect>`입니다.

---

#### `getRootNode(options?)` {/*getrootnode*/}

[`Node.getRootNode()`](https://developer.mozilla.org/en-US/docs/Web/API/Node/getRootNode) 동작과 일치하게 Fragment의 상위 DOM 노드를 포함하는 루트 노드를 반환합니다.

```js
const root = fragmentRef.current.getRootNode();
```

##### 매개변수 {/*getrootnode-parameters*/}

* **선택사항** `options`: [DOM `getRootNode` API](https://developer.mozilla.org/en-US/docs/Web/API/Node/getRootNode#options)와 일치하는 `composed` 불리언 프로퍼티를 가진 객체입니다.

##### 반환값 {/*getrootnode-returns*/}

`Document`, `ShadowRoot`, 또는 상위 DOM 노드가 없는 경우 `FragmentInstance` 자체를 반환합니다.

---

#### `compareDocumentPosition(otherNode)` {/*comparedocumentposition*/}

Fragment의 문서 위치를 다른 노드와 비교하여 [`Node.compareDocumentPosition()`](https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition) 동작과 일치하는 비트마스크를 반환합니다.

```js
const position = fragmentRef.current.compareDocumentPosition(otherElement);
```

##### 매개변수 {/*comparedocumentposition-parameters*/}

* `otherNode`: 비교 대상이 되는 DOM 노드입니다.

##### 반환값 {/*comparedocumentposition-returns*/}

[위치 플래그](https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition#return_value) 비트마스크입니다. 빈 Fragment 및 [포털](/reference/react-dom/createPortal)을 통해 렌더링된 자식이 있는 Fragment는 결과에 `Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC`을 포함합니다.

---

#### `scrollIntoView(alignToTop?)` {/*scrollintoview*/}

Fragment의 자식이 화면에 보이도록 스크롤합니다. `alignToTop`이 `true`이거나 생략된 경우 스크롤 가능한 상위 요소의 상단에 첫 번째 자식이 맞춰지도록 스크롤합니다. `alignToTop`이 `false`인 경우 하단에 마지막 자식이 맞춰지도록 스크롤합니다.

```js
fragmentRef.current.scrollIntoView();
```

##### 매개변수 {/*scrollintoview-parameters*/}

* **선택사항** `alignToTop`: 불리언입니다. `true`(기본값)이면 스크롤 가능한 영역의 상단으로 첫 번째 자식을 스크롤합니다. `false`이면 하단으로 마지막 자식을 스크롤합니다. [`Element.scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView)와 달리 이 메서드는 `ScrollIntoViewOptions` 객체를 허용하지 않습니다.

##### 반환값 {/*scrollintoview-returns*/}

`scrollIntoView`는 아무것도 반환하지 않습니다(`undefined`).

##### 주의 사항 {/*scrollintoview-caveats*/}

* `scrollIntoView`는 옵션 객체를 허용하지 않습니다. 옵션 객체를 전달하면 오류가 발생합니다. 대신 `alignToTop` 불리언을 사용하세요.
* Fragment에 자식이 없는 경우, `scrollIntoView`는 폴백으로 가장 가까운 형제 또는 상위 요소를 화면에 보이도록 스크롤합니다.

---

#### `FragmentInstance` 주의 사항 {/*fragmentinstance-caveats*/}

* 자식을 대상으로 하는 메서드(예: `addEventListener`, `observeUsing`, `getClientRects`)는 Fragment의 *1단계 호스트(DOM) 자식*에서 작동합니다. 다른 DOM 엘리먼트 내에 중첩된 자식을 직접 대상으로 하지 않습니다.
* `focus` 및 `focusLast`는 1단계 호스트 자식만을 대상으로 하는 이벤트 및 옵저버 메서드와 달리, 포커스 가능한 엘리먼트를 찾기 위해 중첩된 자식을 깊이 우선으로 탐색합니다.
* `observeUsing`은 텍스트 노드에서 작동하지 않습니다. Fragment에 텍스트 자식만 포함된 경우 React는 개발 환경에서 경고를 기록합니다.
* React는 숨겨진 [`<Activity>`](/reference/react/Activity) 트리에 `addEventListener`로 추가된 이벤트 리스너를 적용하지 않습니다. `Activity` 경계가 숨김에서 표시로 전환되면 리스너가 자동으로 적용됩니다.
* `ref`가 있는 Fragment의 각 1단계 자식 DOM은 해당 엘리먼트를 소유한 모든 Fragment 인스턴스를 포함하는 `Set<FragmentInstance>`인 `reactFragments` 프로퍼티를 갖습니다. 이를 통해 여러 Fragment에 걸쳐 [공유 옵저버를 캐싱](#caching-global-intersection-observer)할 수 있습니다.

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

### Adding event listeners without a wrapper element {/*adding-event-listeners-without-wrapper*/}

Fragment `ref`s let you add event listeners to a group of elements without adding a wrapper DOM node. Use a [ref callback](/reference/react-dom/components/common#ref-callback) to attach and clean up listeners:

<Sandpack>

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
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
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

### Managing focus across a group of elements {/*managing-focus-across-elements*/}

Fragment `ref`s provide `focus`, `focusLast`, and `blur` methods that operate across all DOM nodes within the Fragment:

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
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

Calling `focus()` focuses the `street` input—even though it is nested inside a `<fieldset>` and `<label>`. `focus()` searches depth-first through all nested children, not just direct children of the Fragment. `focusLast()` does the same in reverse, and `blur()` removes focus if the currently focused element is within the Fragment.

---

### Scrolling a group of elements into view {/*scrolling-group-into-view*/}

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
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

---

### Observing visibility without a wrapper element {/*observing-visibility-without-wrapper*/}

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
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

---

### Caching a global IntersectionObserver {/*caching-global-intersection-observer*/}

A common performance optimization for sites with many observers is to share a single IntersectionObserver per config and route its entries to the correct callbacks based on which element intersected. Fragment `ref`s support this same pattern through the `reactFragments` property.

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
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

Multiple `ObservedGroup` components with the same options reuse a single `IntersectionObserver`. When either section scrolls into view, the shared observer fires and uses `reactFragments` to route the entry to the correct callback.
