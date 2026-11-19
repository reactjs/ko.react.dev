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

Fragment에 `ref`를 전달하면 React는 `FragmentInstance` 객체를 제공합니다. 이 객체는 Fragment로 감싼 최상위 DOM 자식과 상호작용하기 위한 메서드를 구현합니다.

* [`addEventListener`](#addeventlistener)와 [`removeEventListener`](#removeeventlistener)는 모든 최상위 DOM 자식의 이벤트 리스너를 관리합니다.
* [`dispatchEvent`](#dispatchevent)는 Fragment에서 이벤트를 발생시키며, 이 이벤트는 DOM 부모로 버블링될 수 있습니다.
* [`focus`](#focus), [`focusLast`](#focuslast), [`blur`](#blur)는 중첩된 모든 자식을 깊이 우선으로 탐색하며 포커스를 관리합니다.
* [`observeUsing`](#observeusing)과 [`unobserveUsing`](#unobserveusing)은 `IntersectionObserver` 또는 `ResizeObserver` 인스턴스를 연결하고 해제합니다.
* [`getClientRects`](#getclientrects)는 모든 최상위 DOM 자식의 경계 사각형을 반환합니다.
* [`getRootNode`](#getrootnode)는 Fragment 부모의 루트 노드를 반환합니다.
* [`compareDocumentPosition`](#comparedocumentposition)은 Fragment의 위치를 다른 노드와 비교합니다.
* [`scrollIntoView`](#scrollintoview)는 Fragment의 자식이 화면에 보이도록 스크롤합니다.

---

#### `addEventListener(type, listener, options?)` {/*addeventlistener*/}

Fragment의 모든 최상위 DOM 자식에 이벤트 리스너를 추가합니다.

```js
fragmentRef.current.addEventListener('click', handleClick);
```

##### 매개변수 {/*addeventlistener-parameters*/}

* `type`: 수신할 이벤트 타입을 나타내는 문자열입니다(예: `'click'`, `'focus'`).
* `listener`: 이벤트 핸들러 함수입니다.
* **선택 사항** `options`: 캡처 여부를 지정하는 옵션 객체 또는 불리언 값으로, [DOM `addEventListener` API](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)와 동일합니다.

##### 반환값 {/*addeventlistener-returns*/}

`addEventListener`는 아무것도 반환하지 않습니다(`undefined`).

---

#### `removeEventListener(type, listener, options?)` {/*removeeventlistener*/}

Fragment의 모든 최상위 DOM 자식에서 이벤트 리스너를 제거합니다.

```js
fragmentRef.current.removeEventListener('click', handleClick);
```

##### 매개변수 {/*removeeventlistener-parameters*/}

* `type`: 이벤트 타입 문자열입니다.
* `listener`: 제거할 이벤트 핸들러 함수입니다.
* **선택 사항** `options`: 옵션 객체 또는 불리언 값으로, [DOM `removeEventListener` API](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener)와 동일합니다.

##### 반환값 {/*removeeventlistener-returns*/}

`removeEventListener`는 아무것도 반환하지 않습니다(`undefined`).

---

#### `dispatchEvent(event)` {/*dispatchevent*/}

Fragment에서 이벤트를 발생시킵니다. 추가된 이벤트 리스너가 호출되며, 이벤트는 Fragment의 DOM 부모로 버블링될 수 있습니다.

```js
fragmentRef.current.dispatchEvent(new Event('custom', { bubbles: true }));
```

##### 매개변수 {/*dispatchevent-parameters*/}

* `event`: 발생시킬 [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event) 객체입니다. `bubbles`가 `true`이면 이벤트가 Fragment의 부모 DOM 노드로 버블링됩니다.

##### 반환값 {/*dispatchevent-returns*/}

이벤트가 취소되지 않았다면 `true`를, `preventDefault()`가 호출되었다면 `false`를 반환합니다.

---

#### `focus(options?)` {/*focus*/}

Fragment 안에서 포커스할 수 있는 첫 번째 DOM 노드에 포커스를 줍니다. DOM 엘리먼트에서 `element.focus()`를 호출하는 것과 달리, 이 메서드는 엘리먼트 자신이나 직접적인 자식만 확인하지 않고 포커스할 수 있는 엘리먼트를 찾을 때까지 중첩된 *모든* 자식을 깊이 우선으로 탐색합니다.

```js
fragmentRef.current.focus();
```

##### 매개변수 {/*focus-parameters*/}

* **선택 사항** `options`: [`FocusOptions`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#options) 객체입니다(예: `{ preventScroll: true }`).

##### 반환값 {/*focus-returns*/}

`focus`는 아무것도 반환하지 않습니다(`undefined`).

---

#### `focusLast(options?)` {/*focuslast*/}

Fragment 안에서 포커스할 수 있는 마지막 DOM 노드에 포커스를 줍니다. 중첩된 자식을 깊이 우선으로 탐색한 뒤 역순으로 순회합니다.

```js
fragmentRef.current.focusLast();
```

##### 매개변수 {/*focuslast-parameters*/}

* **선택 사항** `options`: [`FocusOptions`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#options) 객체입니다.

##### 반환값 {/*focuslast-returns*/}

`focusLast`는 아무것도 반환하지 않습니다(`undefined`).

---

#### `blur()` {/*blur*/}

활성 엘리먼트가 Fragment 안에 있다면 포커스를 해제합니다. `document.activeElement`가 Fragment 안에 없다면 `blur`는 아무 동작도 하지 않습니다.

```js
fragmentRef.current.blur();
```

##### 반환값 {/*blur-returns*/}

`blur`는 아무것도 반환하지 않습니다(`undefined`).

---

#### `observeUsing(observer)` {/*observeusing*/}

전달한 옵저버로 Fragment의 모든 최상위 DOM 자식을 관찰하기 시작합니다.

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

지정한 옵저버로 Fragment의 DOM 자식을 관찰하는 것을 중지합니다.

```js
fragmentRef.current.unobserveUsing(observer);
```

##### 매개변수 {/*unobserveusing-parameters*/}

* `observer`: 앞서 [`observeUsing`](#observeusing)에 전달했던 것과 같은 `IntersectionObserver` 또는 `ResizeObserver` 인스턴스입니다.

##### 반환값 {/*unobserveusing-returns*/}

`unobserveUsing`은 아무것도 반환하지 않습니다(`undefined`).

---

#### `getClientRects()` {/*getclientrects*/}

모든 최상위 DOM 자식의 경계 사각형을 나타내는 [`DOMRect`](https://developer.mozilla.org/en-US/docs/Web/API/DOMRect) 객체를 하나의 평탄한 배열로 반환합니다.

```js
const rects = fragmentRef.current.getClientRects();
```

##### 반환값 {/*getclientrects-returns*/}

모든 자식의 경계 사각형을 담은 `Array<DOMRect>`입니다.

---

#### `getRootNode(options?)` {/*getrootnode*/}

Fragment의 부모 DOM 노드를 포함하는 루트 노드를 반환하며, [`Node.getRootNode()`](https://developer.mozilla.org/en-US/docs/Web/API/Node/getRootNode)와 동일하게 동작합니다.

```js
const root = fragmentRef.current.getRootNode();
```

##### 매개변수 {/*getrootnode-parameters*/}

* **선택 사항** `options`: 불리언 값인 `composed` 프로퍼티를 가진 객체로, [DOM `getRootNode` API](https://developer.mozilla.org/en-US/docs/Web/API/Node/getRootNode#options)와 동일합니다.

##### 반환값 {/*getrootnode-returns*/}

`Document` 또는 `ShadowRoot`를 반환하며, 부모 DOM 노드가 없다면 `FragmentInstance` 자신을 반환합니다.

---

#### `compareDocumentPosition(otherNode)` {/*comparedocumentposition*/}

Fragment와 다른 노드의 문서 내 위치를 비교하고, [`Node.compareDocumentPosition()`](https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition)과 동일하게 비트마스크를 반환합니다.

```js
const position = fragmentRef.current.compareDocumentPosition(otherElement);
```

##### 매개변수 {/*comparedocumentposition-parameters*/}

* `otherNode`: 비교할 DOM 노드입니다.

##### 반환값 {/*comparedocumentposition-returns*/}

[위치 플래그](https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition#return_value)로 이루어진 비트마스크입니다. 빈 Fragment와 [포털](/reference/react-dom/createPortal)을 통해 렌더링된 자식을 가진 Fragment는 결과에 `Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC`을 포함합니다.

---

#### `scrollIntoView(alignToTop?)` {/*scrollintoview*/}

Fragment의 자식이 화면에 보이도록 스크롤합니다. `alignToTop`이 `true`이거나 생략되면 첫 번째 자식이 스크롤 가능한 조상 엘리먼트의 위쪽에 맞춰지도록 스크롤합니다. `alignToTop`이 `false`이면 마지막 자식이 아래쪽에 맞춰지도록 스크롤합니다.

```js
fragmentRef.current.scrollIntoView();
```

##### 매개변수 {/*scrollintoview-parameters*/}

* **선택 사항** `alignToTop`: 불리언 값입니다. `true`(기본값)이면 첫 번째 자식을 스크롤 영역의 위쪽으로 스크롤합니다. `false`이면 마지막 자식을 아래쪽으로 스크롤합니다. [`Element.scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView)와 달리 이 메서드는 `ScrollIntoViewOptions` 객체를 받지 않습니다.

##### 반환값 {/*scrollintoview-returns*/}

`scrollIntoView`는 아무것도 반환하지 않습니다(`undefined`).

##### 주의 사항 {/*scrollintoview-caveats*/}

* `scrollIntoView`는 옵션 객체를 받지 않습니다. 옵션 객체를 전달하면 오류가 발생하므로 대신 불리언 값인 `alignToTop`을 사용하세요.
* Fragment에 자식이 없으면 `scrollIntoView`는 대신 가장 가까운 형제나 부모가 화면에 보이도록 스크롤합니다.

---

#### `FragmentInstance` 주의 사항 {/*fragmentinstance-caveats*/}

* 자식을 대상으로 하는 메서드(`addEventListener`, `observeUsing`, `getClientRects` 등)는 Fragment의 *최상위 호스트(DOM) 자식*에서 동작합니다. 다른 DOM 엘리먼트 안에 중첩된 자식은 직접 대상으로 삼지 않습니다.
* 최상위 호스트 자식만 대상으로 하는 이벤트 및 옵저버 메서드와 달리, `focus`와 `focusLast`는 중첩된 자식을 깊이 우선으로 탐색해 포커스할 수 있는 엘리먼트를 찾습니다.
* `observeUsing`은 텍스트 노드에서는 동작하지 않습니다. Fragment에 텍스트 자식만 있으면 React는 개발 환경에서 경고를 출력합니다.
* React는 `addEventListener`로 추가한 이벤트 리스너를 숨겨진 [`<Activity>`](/reference/react/Activity) 트리에는 적용하지 않습니다. `Activity` 경계가 숨김 상태에서 표시 상태로 바뀌면 리스너가 자동으로 적용됩니다.
* `ref`를 가진 Fragment의 각 최상위 DOM 자식에는 `reactFragments` 프로퍼티가 생깁니다. 이 프로퍼티는 해당 엘리먼트를 소유한 모든 Fragment 인스턴스를 담은 `Set<FragmentInstance>`입니다. 이를 통해 여러 Fragment에서 [공유 옵저버를 캐싱](#caching-global-intersection-observer)할 수 있습니다.

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

### 래퍼 엘리먼트 없이 이벤트 리스너 추가하기 {/*adding-event-listeners-without-wrapper*/}

Fragment `ref`를 사용하면 래퍼 DOM 노드를 추가하지 않고도 여러 엘리먼트에 이벤트 리스너를 추가할 수 있습니다. [`ref` 콜백](/reference/react-dom/components/common#ref-callback)을 사용해 리스너를 연결하고 정리하세요.

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

`addEventListener`를 호출하면 Fragment의 모든 최상위 DOM 자식에 리스너가 적용됩니다. 자식이 동적으로 추가되거나 제거되면 `FragmentInstance`가 자동으로 리스너를 추가하거나 제거합니다.

<DeepDive>

#### Fragment ref는 어떤 자식을 대상으로 하나요? {/*which-children-does-a-fragment-ref-target*/}

`FragmentInstance`는 Fragment의 **최상위 호스트(DOM) 자식**을 대상으로 합니다. 다음 트리를 살펴봅시다.

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

`Wrapper`는 React 컴포넌트이므로 `FragmentInstance`는 그 안을 들여다보며 DOM 노드를 찾습니다. 대상이 되는 자식은 `A`, `B`, `D`입니다. `C`는 DOM 엘리먼트 `B` 안에 중첩되어 있으므로 대상이 아닙니다.

`addEventListener`, `observeUsing`, `getClientRects` 같은 메서드는 이러한 최상위 DOM 자식에서 동작합니다. `focus`와 `focusLast`는 다릅니다. 이 두 메서드는 포커스할 수 있는 엘리먼트를 찾기 위해 중첩된 *모든* 자식을 깊이 우선으로 탐색합니다.

</DeepDive>

---

### 여러 엘리먼트에 걸쳐 포커스 관리하기 {/*managing-focus-across-elements*/}

Fragment `ref`는 Fragment 안의 모든 DOM 노드를 대상으로 동작하는 `focus`, `focusLast`, `blur` 메서드를 제공합니다.

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

// input이 깊이 중첩되어 있더라도
// focus()는 깊이 우선으로 탐색해 찾아냅니다.
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

`focus()`를 호출하면 `street` 입력 필드가 `<fieldset>`과 `<label>` 안에 중첩되어 있더라도 포커스를 받습니다. `focus()`는 Fragment의 직접적인 자식뿐 아니라 중첩된 모든 자식을 깊이 우선으로 탐색합니다. `focusLast()`는 같은 작업을 역순으로 수행하며, `blur()`는 현재 포커스된 엘리먼트가 Fragment 안에 있으면 포커스를 해제합니다.

---

### 여러 엘리먼트가 화면에 보이도록 스크롤하기 {/*scrolling-group-into-view*/}

`scrollIntoView`를 사용하면 래퍼 엘리먼트 없이 Fragment의 자식이 화면에 보이도록 스크롤할 수 있습니다. `true`를 전달하거나 인수를 생략하면 첫 번째 자식을 위쪽으로 스크롤합니다. `false`를 전달하면 마지막 자식을 아래쪽으로 스크롤합니다.

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
  /* 스크롤할 때 전역 고정 내비게이션 바에 가려지지 않도록 위쪽 여백을 줍니다 */
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

### 래퍼 엘리먼트 없이 가시성 관찰하기 {/*observing-visibility-without-wrapper*/}

`observeUsing`을 사용해 Fragment의 모든 최상위 DOM 자식에 `IntersectionObserver`를 연결하세요. 이렇게 하면 자식 컴포넌트가 `ref`를 노출하거나 래퍼 엘리먼트를 추가하지 않아도 가시성을 추적할 수 있습니다.

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

### 전역 IntersectionObserver 캐싱하기 {/*caching-global-intersection-observer*/}

옵저버가 많은 사이트에서 흔히 쓰는 성능 최적화 기법은 설정마다 IntersectionObserver를 하나만 두고 공유하면서, 어떤 엘리먼트가 교차했는지에 따라 각 항목<sup>Entry</sup>을 알맞은 콜백으로 전달하는 것입니다. Fragment `ref`는 `reactFragments` 프로퍼티를 통해 같은 패턴을 지원합니다.

`ref`를 가진 Fragment의 각 최상위 DOM 자식에는 `reactFragments` 프로퍼티가 있으며, 이는 해당 엘리먼트를 포함하는 `FragmentInstance` 객체의 `Set`입니다. 공유 옵저버가 실행되면 이 프로퍼티로 교차한 엘리먼트를 소유한 `FragmentInstance`를 찾아 알맞은 콜백을 실행할 수 있습니다.

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
  // 이 Fragment 인스턴스에 대한
  // 콜백을 등록합니다.
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
        // 이 엘리먼트를 소유한
        // FragmentInstance를 찾습니다.
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

옵션이 같은 여러 `ObservedGroup` 컴포넌트는 하나의 `IntersectionObserver`를 재사용합니다. 두 섹션 중 하나가 스크롤되어 화면에 들어오면 공유 옵저버가 실행되고, `reactFragments`를 사용해 항목을 알맞은 콜백으로 전달합니다.
