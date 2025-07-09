---
title: <Activity>
version: experimental
---

<Experimental>

**이 API는 실험적이며 아직 React의 안정 버전에서 사용할 수 없습니다.**

React 패키지를 최신 실험적 버전으로 업그레이드하여 시도해볼 수 있습니다.

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

React의 실험적 버전에는 버그가 포함될 수 있습니다. 프로덕션 환경에서는 사용하지 마세요.

</Experimental>

<Intro>

`<Activity>`를 사용하면 UI의 일부를 숨기거나 보여줄 수 있습니다.


```js
<Activity mode={mode}>
  <Page />
</Activity>
```

</Intro>

<InlineToc />

---

## 레퍼런스 {/*reference*/}

### `<Activity>` {/*activity*/}

UI의 일부를 `<Activity>`로 감싸서 표시 상태를 관리할 수 있습니다.

```js
import {unstable_Activity as Activity} from 'react';

<Activity mode={isVisible ? 'visible' : 'hidden'}>
  <Page />
</Activity>
```

"hidden" 상태일 때 `<Activity />`의 `children`은 페이지에 표시되지 않습니다. 새로운 `<Activity>`가 "hidden" 상태로 마운트되면 페이지의 표시되는 콘텐츠를 차단하지 않으면서 낮은 우선순위로 콘텐츠를 사전 렌더링하지만, Effect를 생성하여 마운트하지는 않습니다. "visible" Activity가 "hidden"으로 전환되면 모든 Effect를 제거하여 개념적으로는 마운트 해제되지만 상태는 저장됩니다. 이를 통해 "hidden" Activity의 상태를 재생성하지 않고도 "visible"과 "hidden" 상태 간의 빠른 전환이 가능합니다.

앞으로는 메모리 등 리소스 상황에 따라, "hidden" Activity의 상태가 자동으로 제거될 수 있습니다.

#### Props {/*props*/}

* `children`: 실제로 렌더링하려는 UI입니다.
* **optional** `mode`: "visible" 또는 "hidden" 중 하나입니다. 기본값은 "visible"입니다. "hidden"일 때는 자식 컴포넌트의 업데이트가 낮은 우선순위로 지연됩니다. 컴포넌트는 Activity가 "visible"로 전환할 때까지 Effect를 생성하지 않습니다. "visible" Activity가 "hidden"으로 전환되면 Effect가 제거됩니다.

#### 주의 사항 {/*caveats*/}

- 숨겨진 상태에서 `<Activity>`의 `children`은 페이지에 숨겨집니다.
- `<Activity>`는 "visible"에서 "hidden"으로 전환할 때 React나 DOM 상태를 제거하지 않고 모든 Effect를 마운트 해제합니다. 이는 마운트 시 한 번만 실행될 것으로 예상되는 Effect가 "hidden"에서 "visible"로 전환할 때 다시 실행됨을 의미합니다. 개념적으로는 "hidden" Activity는 마운트 해제되지만 파괴되지는 않습니다. 이러한 동작으로 인한 예상치 못한 부작용을 잡기 위해 [`<StrictMode>`](/reference/react/StrictMode)를 사용하는 것을 추천합니다.
- `<ViewTransition>`과 함께 사용할 때 전환에서 나타나는 숨겨진 Activity는 "enter" 애니메이션을 활성화합니다. 전환에서 숨겨지는 표시되는 Activity는 "exit" 애니메이션을 활성화합니다.
- `<Activity mode="hidden">`으로 감싸진 UI 부분은 SSR 응답에 포함되지 않습니다.
- `<Activity mode="visible">`으로 감싸진 UI 부분은 다른 콘텐츠보다 낮은 우선순위로 하이드레이션됩니다.

---

## 사용법 {/*usage*/}

### UI 일부 사전 렌더링하기 {/*pre-render-part-of-the-ui*/}

`<Activity mode="hidden">`을 사용하여 UI의 일부를 사전 렌더링할 수 있습니다.

```js
<Activity mode={tab === "posts" ? "visible" : "hidden"}>
  <PostsTab />
</Activity>
```

Activity가 `mode="hidden"`으로 렌더링되면 `children`은 페이지에 표시되지 않지만 페이지의 표시되는 콘텐츠보다 낮은 우선순위로 렌더링됩니다.

나중에 `mode`가 "visible"로 전환되면 사전 렌더링된 자식 컴포넌트가 마운트되고 표시됩니다. 이를 통해 사용자가 다음에 상호작용할 가능성이 높은 UI 부분을 미리 준비하여 로딩 시간을 줄일 수 있습니다.

다음은 [`useTransition`](/reference/react/useTransition#preventing-unwanted-loading-indicators)에서 가져온 예시입니다. `PostsTab` 컴포넌트는 `use`를 사용하여 일부 데이터를 가져옵니다. "Posts" 탭을 클릭하면 `PostsTab` 컴포넌트가 일시 중단되어 버튼 로딩 상태가 나타납니다.

<Sandpack>

```js
import { Suspense, useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <Suspense fallback={<h1>🌀 Loading...</h1>}>
      <TabButton
        isActive={tab === 'about'}
        action={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        action={() => setTab('posts')}
      >
        Posts
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        action={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </Suspense>
  );
}
```


```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        action();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js hidden
import {unstable_ViewTransition as ViewTransition} from 'react';

export default function AboutTab() {
  return (
    <ViewTransition>
      <p>Welcome to my profile!</p>
    </ViewTransition>
  );
}
```

```js src/PostsTab.js hidden
import {use, unstable_ViewTransition as ViewTransition} from 'react';
import { fetchData } from './data.js';

function PostsTab() {
  const posts = use(fetchData('/posts'));
  return (
    <ViewTransition>
    <ul className="items">
      {posts.map(post =>
        <Post key={post.id} title={post.title} />
      )}
    </ul>
      </ViewTransition>
  );
}

function Post({ title }) {
  return (
    <li className="item">
      {title}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js hidden
import {unstable_ViewTransition as ViewTransition} from 'react';

export default function ContactTab() {
  return (
    <ViewTransition>
      <p>
        Send me a message!
      </p>
      <textarea />
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </ViewTransition>
  );
}
```


```js src/data.js hidden
// Note: 데이터 페칭 방법은
// Suspense와 함께 사용하는 프레임워크에 따라 달라집니다.
// 일반적으로 캐싱 로직은 프레임워크 내부에 있습니다.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/posts')) {
    return await getPosts();
  } else {
    throw Error('Not implemented');
  }
}

async function getPosts() {
  // 대기 시간을 눈에 띄게 만들기 위해 가짜 지연을 추가합니다.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 10; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

이 예시에서 "Posts" 탭을 클릭할 때 게시물이 로드될 때까지 기다려야 합니다.

숨겨진 `<Activity>`로 비활성 탭을 사전 렌더링하여 "Posts" 탭의 지연 시간을 줄일 수 있습니다.

<Sandpack>

```js
import { Suspense, useState, unstable_Activity as Activity } from "react";
import TabButton from "./TabButton.js";
import AboutTab from "./AboutTab.js";
import PostsTab from "./PostsTab.js";
import ContactTab from "./ContactTab.js";

export default function TabContainer() {
  const [tab, setTab] = useState("about");
  return (
    <Suspense fallback={<h1>🌀 Loading...</h1>}>
      <TabButton isActive={tab === "about"} action={() => setTab("about")}>
        About
      </TabButton>
      <TabButton isActive={tab === "posts"} action={() => setTab("posts")}>
        Posts
      </TabButton>
      <TabButton isActive={tab === "contact"} action={() => setTab("contact")}>
        Contact
      </TabButton>
      <hr />
      <Activity mode={tab === "about" ? "visible" : "hidden"}>
        <AboutTab />
      </Activity>
      <Activity mode={tab === "posts" ? "visible" : "hidden"}>
        <PostsTab />
      </Activity>
      <Activity mode={tab === "contact" ? "visible" : "hidden"}>
        <ContactTab />
      </Activity>
    </Suspense>
  );
}
```


```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        action();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js hidden
import {unstable_ViewTransition as ViewTransition} from 'react';

export default function AboutTab() {
  return (
    <ViewTransition>
      <p>Welcome to my profile!</p>
    </ViewTransition>
  );
}
```

```js src/PostsTab.js hidden
import {use, unstable_ViewTransition as ViewTransition} from 'react';
import { fetchData } from './data.js';

function PostsTab() {
  const posts = use(fetchData('/posts'));
  return (
    <ViewTransition>
    <ul className="items">
      {posts.map(post =>
        <Post key={post.id} title={post.title} />
      )}
    </ul>
      </ViewTransition>
  );
}

function Post({ title }) {
  return (
    <li className="item">
      {title}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js hidden
import {unstable_ViewTransition as ViewTransition} from 'react';

export default function ContactTab() {
  return (
    <ViewTransition>
      <p>
        Send me a message!
      </p>
      <textarea />
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </ViewTransition>
  );
}
```


```js src/data.js hidden
// Note: 데이터 페칭 방법은
// Suspense와 함께 사용하는 프레임워크에 따라 달라집니다.
// 일반적으로 캐싱 로직은 프레임워크 내부에 있습니다.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/posts')) {
    return await getPosts();
  } else {
    throw Error('Not implemented');
  }
}

async function getPosts() {
  // 대기 시간을 눈에 띄게 만들기 위해 가짜 지연을 추가합니다.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 10; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

---

### UI 일부의 상태 유지하기 {/*keeping-state-for-part-of-the-ui*/}


`<Activity>`를 "visible"에서 "hidden"으로 전환하여 UI 일부의 상태를 유지할 수 있습니다.

```js
<Activity mode={tab === "posts" ? "visible" : "hidden"}>
  <PostsTab />
</Activity>
```

Activity가 `mode="visible"`에서 "hidden"으로 전환되면 `children`은 페이지에서 숨겨지고 모든 Effect를 제거하여 마운트 해제되지만 React와 DOM 상태는 유지됩니다.

나중에 `mode`가 "visible"로 전환되면 저장된 상태가 모든 Effect를 생성하여 자식 컴포넌트를 마운트할 때 재사용됩니다. 이를 통해 사용자가 다시 상호작용할 가능성이 높은 UI 부분의 상태를 유지하여 DOM이나 React 상태를 유지할 수 있습니다.

다음은 [`useTransition`](/reference/react/useTransition#preventing-unwanted-loading-indicators)에서 가져온 예시입니다. `ContactTab`은 보낼 메시지 초안이 담긴 `<textarea>`를 포함합니다. 텍스트를 입력하고 다른 탭으로 변경한 다음 "Contact" 탭을 다시 클릭하면 메시지 초안이 사라집니다.


<Sandpack>

```js
import { Suspense, useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('contact');
  return (
    <Suspense fallback={<h1>🌀 Loading...</h1>}>
      <TabButton
        isActive={tab === 'about'}
        action={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        action={() => setTab('posts')}
      >
        Posts
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        action={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </Suspense>
  );
}
```


```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        action();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js hidden
import {unstable_ViewTransition as ViewTransition} from 'react';

export default function AboutTab() {
  return (
    <ViewTransition>
      <p>Welcome to my profile!</p>
    </ViewTransition>
  );
}
```

```js src/PostsTab.js hidden
import {use, unstable_ViewTransition as ViewTransition} from 'react';
import { fetchData } from './data.js';

function PostsTab() {
  const posts = use(fetchData('/posts'));
  return (
    <ViewTransition>
    <ul className="items">
      {posts.map(post =>
        <Post key={post.id} title={post.title} />
      )}
    </ul>
      </ViewTransition>
  );
}

function Post({ title }) {
  return (
    <li className="item">
      {title}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js hidden
import {unstable_ViewTransition as ViewTransition} from 'react';

export default function ContactTab() {
  return (
    <ViewTransition>
      <p>
        Send me a message!
      </p>
      <textarea />
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </ViewTransition>
  );
}
```


```js src/data.js hidden
// Note: 데이터 페칭 방법은
// Suspense와 함께 사용하는 프레임워크에 따라 달라집니다.
// 일반적으로 캐싱 로직은 프레임워크 내부에 있습니다.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/posts')) {
    return await getPosts();
  } else {
    throw Error('Not implemented');
  }
}

async function getPosts() {
  // 대기 시간을 눈에 띄게 만들기 위해 가짜 지연을 추가합니다.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 10; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

이는 사용자가 입력한 DOM 상태를 잃게 됩니다. `<Activity>`로 비활성 탭을 숨겨서 Contact 탭의 상태를 유지할 수 있습니다.


<Sandpack>

```js
import { Suspense, useState, unstable_Activity as Activity } from "react";
import TabButton from "./TabButton.js";
import AboutTab from "./AboutTab.js";
import PostsTab from "./PostsTab.js";
import ContactTab from "./ContactTab.js";

export default function TabContainer() {
  const [tab, setTab] = useState("about");
  return (
    <Suspense fallback={<h1>🌀 Loading...</h1>}>
      <TabButton isActive={tab === "about"} action={() => setTab("about")}>
        About
      </TabButton>
      <TabButton isActive={tab === "posts"} action={() => setTab("posts")}>
        Posts
      </TabButton>
      <TabButton isActive={tab === "contact"} action={() => setTab("contact")}>
        Contact
      </TabButton>
      <hr />
      <Activity mode={tab === "about" ? "visible" : "hidden"}>
        <AboutTab />
      </Activity>
      <Activity mode={tab === "posts" ? "visible" : "hidden"}>
        <PostsTab />
      </Activity>
      <Activity mode={tab === "contact" ? "visible" : "hidden"}>
        <ContactTab />
      </Activity>
    </Suspense>
  );
}
```


```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        action();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js hidden
import {unstable_ViewTransition as ViewTransition} from 'react';

export default function AboutTab() {
  return (
    <ViewTransition>
      <p>Welcome to my profile!</p>
    </ViewTransition>
  );
}
```

```js src/PostsTab.js hidden
import {use, unstable_ViewTransition as ViewTransition} from 'react';
import { fetchData } from './data.js';

function PostsTab() {
  const posts = use(fetchData('/posts'));
  return (
    <ViewTransition>
    <ul className="items">
      {posts.map(post =>
        <Post key={post.id} title={post.title} />
      )}
    </ul>
      </ViewTransition>
  );
}

function Post({ title }) {
  return (
    <li className="item">
      {title}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js hidden
import {unstable_ViewTransition as ViewTransition} from 'react';

export default function ContactTab() {
  return (
    <ViewTransition>
      <p>
        Send me a message!
      </p>
      <textarea />
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </ViewTransition>
  );
}
```


```js src/data.js hidden
// Note: 데이터 페칭 방법은
// Suspense와 함께 사용하는 프레임워크에 따라 달라집니다.
// 일반적으로 캐싱 로직은 프레임워크 내부에 있습니다.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/posts')) {
    return await getPosts();
  } else {
    throw Error('Not implemented');
  }
}

async function getPosts() {
  // 대기 시간을 눈에 띄게 만들기 위해 가짜 지연을 추가합니다.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 10; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

---

## 문제 해결 {/*troubleshooting*/}

### Activity가 숨겨져 있을 때 Effect가 마운트되지 않습니다 {/*effects-dont-mount-when-an-activity-is-hidden*/}

`<Activity>`가 "hidden"일 때 모든 Effect가 마운트 해제됩니다. 개념적으로는 컴포넌트가 마운트 해제되지만 React는 나중에 사용할 상태를 저장합니다.

이는 Activity의 기능입니다. 숨겨진 UI 부분에 대한 구독이 이루어지지 않아 숨겨진 콘텐츠에 대한 작업량이 줄어들기 때문입니다. 또한 비디오 일시 정지와 같은 정리 작업(Activity 없이 마운트 해제했을 때 예상되는 동작)이 실행됩니다. Activity가 "visible"로 전환되면 Effect를 생성하여 마운트하고, 이때 구독하고 비디오를 재생합니다.

각 버튼에 대해 다른 비디오가 재생되는 다음 예시를 살펴보세요.


<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';
import './checker.js';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    const videoRef = ref.current;
    videoRef.play();
    
    return () => {
      videoRef.pause();
    }
  }, []);

  return <video ref={ref} src={src} muted loop playsInline/>;
}

export default function App() {
  const [video, setVideo] = useState(1);
  return (
    <>
      <div>
        <button onClick={() => setVideo(1)}>Big Buck Bunny</button>
        <button onClick={() => setVideo(2)}>Elephants Dream</button>
      </div>
      {video === 1 &&
        <VideoPlayer key={1}
          // 'Big Buck Bunny'는 Blender 재단이 CC 3.0 라이선스로 제공하며, archive.org에서 호스팅됩니다.
          src="https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4" />

      }
      {video === 2 && 
        <VideoPlayer key={2}
          // 'Elephants Dream'은 Orange Open Movie Project Studio가 제작하고 CC-3.0 라이선스로 제공하며, archive.org에서 호스팅됩니다.
          src="https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4"
        />
      }
    </>
  );
}
```

```js src/checker.js hidden
let interval = setInterval(() => {
  const videos = Array.from(document.querySelectorAll('video'));
  const playing = videos.filter(
    (v) => !v.paused
  );
  if (playing.length > 1) {
    console.error(`Multiple playing videos: ${playing.length}`);
  }
    
}, 50);
```


```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
video { width: 300px; margin-top: 10px; }
```

</Sandpack>


비디오를 변경하고 다시 돌아올 때마다 비디오가 처음부터 다시 로드됩니다. 상태를 유지하려면 두 비디오를 모두 렌더링하고 비활성 비디오를 `display: none`으로 숨기려고 할 수 있습니다. 하지만 이렇게 하면 두 비디오가 동시에 재생됩니다.


<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';
import VideoChecker from './checker.js';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    const videoRef = ref.current;
    videoRef.play();
    
    return () => {
      videoRef.pause();
    }
  }, []);

  return <video ref={ref} src={src} muted loop playsInline/>;
}

export default function App() {
  const [video, setVideo] = useState(1);
  return (
    <>
      <div>
        <button onClick={() => setVideo(1)}>Big Buck Bunny</button>
        <button onClick={() => setVideo(2)}>Elephants Dream</button>
      </div>
      <div style={{display: video === 1 ? 'block' : 'none'}}>
        <VideoPlayer
          // 'Big Buck Bunny'는 Blender 재단이 CC 3.0 라이선스로 제공하며, archive.org에서 호스팅됩니다.
          src="https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4" />

      </div>
      <div style={{display: video === 2 ? 'block' : 'none'}}>
        <VideoPlayer
          // 'Elephants Dream'은 Orange Open Movie Project Studio가 제작하고 CC-3.0 라이선스로 제공하며, archive.org에서 호스팅됩니다.
          src="https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4"
        />
      </div>
      <VideoChecker />
    </>
  );
}
```

```js src/checker.js hidden
import {useRef, useEffect} from 'react';

export default function VideoChecker() {
  const hasLogged = useRef(false);

  useEffect(() => {
    let interval = setInterval(() => {
      if (hasLogged.current === false) {

        const videos = Array.from(document.querySelectorAll('video'));
        const playing = videos.filter(
          (v) => !v.paused
        );
        if (hasLogged.current === false && playing.length > 1) {
          hasLogged.current = true;
          console.error(`Multiple playing videos: ${playing.length}`);
        }
      }

    }, 50);
    
    return () => {
      hasLogged.current = false;
      clearInterval(interval);
    }
  });
  
}

```


```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
video { width: 300px; margin-top: 10px; }
```

</Sandpack>

이는 Activity가 숨겨진 상태에서 Effect를 마운트했을 때 발생하는 일과 유사합니다. 마찬가지로 Activity가 숨길 때 Effect를 마운트 해제하지 않으면 비디오가 백그라운드에서 계속 재생됩니다.

Activity는 처음에 "hidden" 상태로 렌더링할 때 Effect를 생성하지 않고 "visible"에서 "hidden"으로 전환할 때 모든 Effect를 제거함으로써 이 문제를 해결합니다.


<Sandpack>

```js
import { useState, useRef, useEffect, unstable_Activity as Activity } from 'react';
import VideoChecker from './checker.js';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    const videoRef = ref.current;
    videoRef.play();
    
    return () => {
      videoRef.pause();
    }
  }, []);

  return <video ref={ref} src={src} muted loop playsInline/>;
}

export default function App() {
  const [video, setVideo] = useState(1);
  return (
    <>
      <div>
        <button onClick={() => setVideo(1)}>Big Buck Bunny</button>
        <button onClick={() => setVideo(2)}>Elephants Dream</button>
      </div>
      <Activity mode={video === 1 ? 'visible' : 'hidden'}>
        <VideoPlayer
          // 'Big Buck Bunny'는 Blender 재단이 CC 3.0 라이선스로 제공하며, archive.org에서 호스팅됩니다.
          src="https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4" />
      </Activity>
      <Activity mode={video === 2 ? 'visible' : 'hidden'}>
        <VideoPlayer
          // 'Elephants Dream'은 Orange Open Movie Project Studio가 제작하고 CC-3.0 라이선스로 제공하며, archive.org에서 호스팅됩니다.
          src="https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4"
        />
      </Activity>
      <VideoChecker />
    </>
  );
}
```

```js src/checker.js hidden
import {useRef, useEffect} from 'react';

export default function VideoChecker() {
  const hasLogged = useRef(false);

  useEffect(() => {
    let interval = setInterval(() => {
      if (hasLogged.current === false) {

        const videos = Array.from(document.querySelectorAll('video'));
        const playing = videos.filter(
          (v) => !v.paused
        );
        if (hasLogged.current === false && playing.length > 1) {
          hasLogged.current = true;
          console.error(`Multiple playing videos: ${playing.length}`);
        }
      }

    }, 50);
    
    return () => {
      hasLogged.current = false;
      clearInterval(interval);
    }
  });
  
}

```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
video { width: 300px; margin-top: 10px; }
```

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

이러한 이유로 Activity를 개념적으로는 컴포넌트를 "마운트 해제"하고 "재마운트"하되 React나 DOM 상태는 나중에 사용할 수 있도록 저장하는 것으로 생각하는 것이 좋습니다. 실제로는 [You Might Not Need an Effect](learn/you-might-not-need-an-effect) 가이드를 따랐다면 예상대로 작동합니다. 문제가 있는 Effect를 적극적으로 찾으려면 Activity 마운트 해제와 마운트를 적극적으로 수행하여 예상치 못한 부작용을 잡아내는 [`<StrictMode>`](/reference/react/StrictMode)를 추가하는 것을 추천합니다.

### 숨겨진 Activity가 SSR에서 렌더링되지 않습니다 {/*my-hidden-activity-is-not-rendered-in-ssr*/}

서버 사이드 렌더링 중에 `<Activity mode="hidden">`을 사용하면 Activity의 콘텐츠가 SSR 응답에 포함되지 않습니다. 이는 콘텐츠가 페이지에 표시되지 않고 초기 렌더링에 필요하지 않기 때문입니다. SSR 응답에 콘텐츠를 포함해야 한다면 [`useDeferredValue`](/reference/react/useDeferredValue)를 사용하여 콘텐츠의 렌더링을 지연시키는 것과 같은 다른 접근 방법을 사용할 수 있습니다.
