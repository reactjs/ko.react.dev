---
title: <Fragment> (<>...</>)
---

<Intro>

`<Fragment>`는 `<>...</>` 문법으로 자주 사용되며, 래퍼 노드 없이 엘리먼트를 그룹화할 수 있게 해줍니다.

<Canary> Fragment는 ref를 받을 수도 있으며, 래퍼 엘리먼트를 추가하지 않고도 기본 DOM 노드와 상호작용할 수 있습니다. 아래 레퍼런스와 사용법을 참고하세요.</Canary>

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

하나의 엘리먼트가 필요한 상황에서 엘리먼트를 `<Fragment>`로 감싸서 그룹화하세요. `Fragment` 안에서 그룹화된 엘리먼트는 DOM 결과물에 영향을 주지 않습니다. 즉, 엘리먼트가 그룹화되지 않은 것과 같습니다. 대부분의 경우 빈 JSX 태그인 `<></>`는 `<Fragment></Fragment>`의 줄임말입니다.

#### Props {/*props*/}
- **optional** `key`: 명시적 `<Fragment>`로 선언된 Fragment에는 [`key`](/learn/rendering-lists#keeping-list-items-in-order-with-key)를 사용할 수 있습니다.

- <CanaryBadge />  **optional** `ref`: ref 객체(예: [`useRef`](/reference/react/useRef)에서 반환된 것) 또는 [콜백 함수](/reference/react-dom/components/common#ref-callback)입니다. React는 Fragment로 감싼 DOM 노드와 상호작용하기 위한 메서드를 구현한 `FragmentInstance`를 ref 값으로 제공합니다.

### <CanaryBadge /> FragmentInstance {/*fragmentinstance*/}

Fragment에 ref를 전달하면, React는 Fragment로 감싼 DOM 노드와 상호작용하기 위한 메서드가 포함된 `FragmentInstance` 객체를 제공합니다.

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

- Fragment에 `key`를 사용하려면 `<>...</>` 구문을 사용할 수 없습니다. 명시적으로 `react`에서 `Fragment`를 불러오고<sup>Import</sup> `<Fragment key={yourKey}>...</Fragment>`를 렌더링해야 합니다.

- React는 `<><Child /></>`에서 `[<Child />]`로 렌더링하거나 (또는 반대의 경우), 혹은 `<><Child /></>` 에서 `<Child />` 렌더링하거나 (또는 반대의 경우) [State를 초기화](/learn/preserving-and-resetting-state)하지 않습니다. 이는 오직 한 단계 깊이<sup>Single Level Deep</sup>까지만 적용됩니다. 예를 들어 `<><><Child /></></>` 에서 `<Child />`로 렌더링하는 것은 State가 초기화됩니다. 정확한 의미는 [여기](https://gist.github.com/clemmy/b3ef00f9507909429d8aa0d3ee4f986b)서 확인할 수 있습니다.

- <CanaryBadge /> Fragment에 `ref`를 전달하려면 `<>...</>` 문법을 사용할 수 없습니다. 명시적으로 `'react'`에서 `Fragment`를 불러오고 `<Fragment ref={yourRef}>...</Fragment>`를 렌더링해야 합니다.

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

### <CanaryBadge /> Fragment ref를 사용한 DOM 상호작용 {/*using-fragment-refs-for-dom-interaction*/}

Fragment ref를 사용하면 래퍼 엘리먼트를 추가하지 않고도 Fragment로 감싼 DOM 노드와 상호작용할 수 있습니다. 이벤트 처리, 가시성 추적, 포커스 관리, 그리고 `ReactDOM.findDOMNode()`와 같이 더 이상 사용되지 않는 패턴을 대체하는 데 유용합니다.

```js
import { Fragment } from 'react';

function ClickableFragment({ children, onClick }) {
  return (
    <Fragment ref={fragmentInstance => {
      fragmentInstance.addEventListener('click', handleClick);
      return () => fragmentInstance.removeEventListener('click', handleClick);
    }}>
      {children}
    </Fragment>
  );
}
```
---

### <CanaryBadge /> Fragment ref로 가시성 추적하기 {/*tracking-visibility-with-fragment-refs*/}

Fragment ref는 가시성 추적과 교차 관찰에 유용합니다. 자식 컴포넌트가 ref를 노출하지 않아도 콘텐츠가 화면에 보이는 시점을 모니터링할 수 있습니다.

```js {19,21,31-34}
import { Fragment, useRef, useLayoutEffect } from 'react';

function VisibilityObserverFragment({ threshold = 0.5, onVisibilityChange, children }) {
  const fragmentRef = useRef(null);

  useLayoutEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        onVisibilityChange(entries.some(entry => entry.isIntersecting))
      },
      { threshold }
    );
    
    fragmentRef.current.observeUsing(observer);
    return () => fragmentRef.current.unobserveUsing(observer);
  }, [threshold, onVisibilityChange]);

  return (
    <Fragment ref={fragmentRef}>
      {children}
    </Fragment>
  );
}

function MyComponent() {
  const handleVisibilityChange = (isVisible) => {
    console.log('Component is', isVisible ? 'visible' : 'hidden');
  };

  return (
    <VisibilityObserverFragment onVisibilityChange={handleVisibilityChange}>
      <SomeThirdPartyComponent />
      <AnotherComponent />
    </VisibilityObserverFragment>
  );
}
```

이 패턴은 Effect 기반 가시성 로깅의 대안이며, Effect 기반 방식은 대부분의 경우 안티패턴입니다. Effect에만 의존하면 렌더링된 컴포넌트가 사용자에게 실제로 보이는지 보장할 수 없습니다.

---

### <CanaryBadge /> Fragment ref로 포커스 관리하기 {/*focus-management-with-fragment-refs*/}

Fragment ref는 Fragment 내의 모든 DOM 노드에서 동작하는 포커스 관리 메서드를 제공합니다.

```js
import { Fragment, useRef } from 'react';

function FocusFragment({ children }) {
  return (
    <Fragment ref={(fragmentInstance) => fragmentInstance?.focus()}>
      {children}
    </Fragment>
  );
}
```

`focus()` 메서드는 Fragment 내의 첫 번째 포커스 가능한 엘리먼트에 포커스하고, `focusLast()`는 마지막 포커스 가능한 엘리먼트에 포커스합니다.
