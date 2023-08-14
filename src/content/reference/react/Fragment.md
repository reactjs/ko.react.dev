---
title: <Fragment> (<>...</>)
---

<Intro>
`<Fragment>`는 종종 `<>...</>` 구문으로 사용되고, 래퍼 노드 없이 엘리먼트를 그룹화할 수 있습니다.


```js
<>
  <OneChild />
  <AnotherChild />
</>
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `<Fragment>` {/*fragment*/}

하나의 엘리먼트가 필요한 상황에서 엘리먼트를 `<Fragment>`로 감싸서 그룹화하세요. `Fragment` 안에서 그룹화된 엘리먼트는 DOM 결과물에 영향을 주지 않습니다. 즉, 엘리먼트가 그룹화되지 않은 것과 같습니다. 대부분의 경우 빈 JSX 태그인 `<></>`는 `<Fragment></Fragment>`의 줄임말입니다.

#### Props {/*props*/}
- **optional** `key`: 명시적 `<Fragment>`로 선언된 Fragment에는 [key](/learn/rendering-lists#keeping-list-items-in-order-with-key)를 사용할 수 있습니다.

#### 주의 사항 {/*caveats*/}

- Fragment에 `key`를 사용하려면 `<>...</>` 구문을 사용할 수 없습니다. 명시적으로 `react`에서 `Fragment`를 import하고 `<Fragment key={yourKey}>...</Fragment>`를 렌더링해야 합니다.

- React는 `<><Child /></>`에서 `[<Child />]`로 렌더링하거나 (또는 반대의 경우), 혹은 `<><Child /></>` 에서 `<Child />` 렌더링하거나 (또는 반대의 경우) [state를 초기화](/learn/preserving-and-resetting-state)하지 않습니다. 이는 오직 single level까지 적용됩니다. 예를 들어 `<><><Child /></></>` 에서 `<Child />`로 렌더링하는 것은 state가 초기화됩니다. 정확한 semantics는 [여기](https://gist.github.com/clemmy/b3ef00f9507909429d8aa0d3ee4f986b)서 참조하실 수 있습니다.

---

## 사용법 {/*usage*/}

### 여러 엘리먼트 반환하기 {/*returning-multiple-elements*/}

여러 엘리먼트를 함께 그룹화하기 위해 `Fragment`나 `<>...</>` 문법을 사용하세요. 한 개의 엘리먼트가 존재할 수 있는 곳에 여러 엘리먼트를 넣을 수 있습니다. 예를 들어 컴포넌트는 한 개의 엘리먼트만 반환할 수 있지만 Fragment를 사용하여 여러 엘리먼트를 함께 그룹화하여 반환할 수 있습니다.


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

Fragment로 엘리먼트를 그룹화하면 DOM 엘리먼트와 같은 다른 컨테이너로 엘리먼트를 감싸는 경우와는 달리 레이아웃이나 스타일에 영향을 주지 않기 때문에 Fragment는 효과적입니다. 브라우저로 아래 예제를 검사하면 모든 `<h1>`, `<article>` DOM 노드가 래퍼 없이 형제 노드로 나타나는 것을 볼 수 있습니다. 

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

#### 특별한 문법 없이 Fragment를 작성하는 방법은 무엇입니까? {/*how-to-write-a-fragment-without-the-special-syntax*/}

위의 예시는 React에서 `Fragment`를 import 하는 것과 동일합니다.

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

일반적으로 [`Fragment`에 `key`를 넘겨야 하는 경우]((#rendering-a-list-of-fragments))가 아니라면 이 기능은 필요하지 않습니다.

</DeepDive>

---

### 변수에 여러 엘리먼트 할당 {/*assigning-multiple-elements-to-a-variable*/}

다른 엘리먼트와 마찬가지로 Fragment를 변수에 할당하고 props로 전달하는 등의 작업을 할 수 있습니다.

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

### Fragment 리스트 렌더링 {/*rendering-a-list-of-fragments*/}

`<></>` 문법을 사용하는 대신 명시적으로 `Fragment`를 작성해야 하는 상황이 있습니다. [반복을 통해 여러 엘리먼트를 렌더링할 때](/learn/rendering-lists) 각 요소에 `key`를 할당해야 합니다. 반복 안에 엘리먼트가 Fragment인 경우 `key` 속성을 제공하기 위해 일반 JSX 엘리먼트 문법을 사용해야 합니다.

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

DOM을 검사하여 Fragment 자식 주위에 래퍼 엘리먼트가 없는지 확인할 수 있습니다.

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
