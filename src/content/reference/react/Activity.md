---
title: <Activity>
version: experimental
---

<Experimental>

**이 API는 실험적이며 아직 React의 안정 버전에서 사용할 수 없습니다.**

React 패키지를 최신 실험적 버전으로 업그레이드하여 시도해 볼 수 있습니다.

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

React의 실험적 버전에는 버그가 포함될 수 있습니다. 프로덕션 환경에서는 사용하지 마세요.

</Experimental>

<Intro>

<<<<<<< HEAD
`<Activity>`를 사용하면 UI 일부를 숨기거나 보여줄 수 있습니다.

=======
`<Activity>` lets you hide and restore the UI and internal state of its children.
>>>>>>> 27d86ffe6ec82e3642c6490d2187bae2271020a4

```js
<Activity mode={visibility}>
  <Sidebar />
</Activity>
```

</Intro>

<InlineToc />

---

## 레퍼런스 {/*reference*/}

### `<Activity>` {/*activity*/}

<<<<<<< HEAD
UI 일부를 `<Activity>`로 감싸서 표시 상태를 관리할 수 있습니다.
=======
You can use Activity to hide part of your application:
>>>>>>> 27d86ffe6ec82e3642c6490d2187bae2271020a4

```js [[1, 1, "\\"hidden\\""], [2, 2, "<Sidebar />"], [3, 1, "\\"visible\\""]]
<Activity mode={isShowingSidebar ? "visible" : "hidden"}>
  <Sidebar />
</Activity>
```

<<<<<<< HEAD
"hidden" 상태일 때 `<Activity />`의 `children`은 페이지에 표시되지 않습니다. 새로운 `<Activity>`가 "hidden" 상태로 마운트되면 페이지의 표시되는 콘텐츠를 차단하지 않으면서 낮은 우선순위로 콘텐츠를 사전 렌더링하지만, Effect를 생성하여 마운트하지는 않습니다. "visible" Activity가 "hidden"으로 전환되면 모든 Effect를 제거하여 개념적으로는 마운트 해제되지만, 상태는 저장됩니다. 이를 통해 "hidden" Activity의 상태를 재생성하지 않고도 "visible"과 "hidden" 상태 간의 빠른 전환이 가능합니다.

앞으로는 메모리 등 리소스 상황에 따라, "hidden" Activity의 상태가 자동으로 제거될 수 있습니다.

#### Props {/*props*/}

* `children`: 실제로 렌더링하려는 UI입니다.
* **optional** `mode`: "visible" 또는 "hidden" 중 하나입니다. 기본값은 "visible"입니다. "hidden"일 때는 자식 컴포넌트의 업데이트가 낮은 우선순위로 지연됩니다. 컴포넌트는 Activity가 "visible"로 전환할 때까지 Effect를 생성하지 않습니다. "visible" Activity가 "hidden"으로 전환되면 Effect가 제거됩니다.
=======
When an Activity boundary is <CodeStep step={1}>hidden</CodeStep>, React will visually hide <CodeStep step={2}>its children</CodeStep> using the `display: "none"` CSS property. It will also destroy their Effects, cleaning up any active subscriptions.

While hidden, children still re-render in response to new props, albeit at a lower priority than the rest of the content.

When the boundary becomes <CodeStep step={3}>visible</CodeStep> again, React will reveal the children with their previous state restored, and re-create their Effects.

In this way, Activity can be thought of as a mechanism for rendering "background activity". Rather than completely discarding content that's likely to become visible again, you can use Activity to maintain and restore that content's UI and internal state, while ensuring that your hidden content has no unwanted side effects.

[See more examples below.](#usage)

#### Props {/*props*/}

* `children`: The UI you intend to show and hide.
* `mode`: A string value of either `'visible'` or `'hidden'`. If omitted, defaults to `'visible'`. 
>>>>>>> 27d86ffe6ec82e3642c6490d2187bae2271020a4

#### 주의 사항 {/*caveats*/}

<<<<<<< HEAD
- 숨겨진 상태에서 `<Activity>`의 `children`은 페이지에 숨겨집니다.
- `<Activity>`는 "visible"에서 "hidden"으로 전환할 때 React나 DOM 상태를 제거하지 않고 모든 Effect를 마운트 해제합니다. 이는 마운트 시 한 번만 실행될 것으로 예상되는 Effect가 "hidden"에서 "visible"로 전환할 때 다시 실행됨을 의미합니다. 개념적으로는 "hidden" Activity는 마운트 해제되지만, 제거되지는 않습니다. 이러한 동작으로 인한 예상치 못한 부작용을 잡기 위해 [`<StrictMode>`](/reference/react/StrictMode)를 사용하는 것을 추천합니다.
- `<ViewTransition>`과 함께 사용할 때 전환에서 나타나는 숨겨진 Activity는 "enter" 애니메이션을 활성화합니다. 전환에서 숨겨지는 표시되는 Activity는 "exit" 애니메이션을 활성화합니다.
- `<Activity mode="hidden">`으로 감싸진 UI 부분은 SSR 응답에 포함되지 않습니다.
- `<Activity mode="visible">`으로 감싸진 UI 부분은 다른 콘텐츠보다 낮은 우선순위로 하이드레이션됩니다.
=======
- If an Activity is rendered inside of a [ViewTransition](/reference/react/ViewTransition), and it becomes visible as a result of an update caused by [startTransition](/reference/react/startTransition), it will activate the ViewTransition's `enter` animation. If it becomes hidden, it will activate its `exit` animation.
>>>>>>> 27d86ffe6ec82e3642c6490d2187bae2271020a4

---

## 사용법 {/*usage*/}

<<<<<<< HEAD
### UI 일부 사전 렌더링하기 {/*pre-render-part-of-the-ui*/}

`<Activity mode="hidden">`을 사용하여 UI 일부를 사전 렌더링할 수 있습니다.
=======
### Restoring the state of hidden components {/*restoring-the-state-of-hidden-components*/}

In React, when you want to conditionally show or hide a component, you typically mount or unmount it based on that condition:
>>>>>>> 27d86ffe6ec82e3642c6490d2187bae2271020a4

```jsx
{isShowingSidebar && (
  <Sidebar />
)}
```

But unmounting a component destroys its internal state, which is not always what you want.

When you hide a component using an Activity boundary instead, React will "save" its state for later:

```jsx
<Activity mode={isShowingSidebar ? "visible" : "hidden"}>
  <Sidebar />
</Activity>
```

<<<<<<< HEAD
Activity가 `mode="hidden"`으로 렌더링되면 `children`은 페이지에 표시되지 않지만, 페이지의 표시되는 콘텐츠보다 낮은 우선순위로 렌더링됩니다.

나중에 `mode`가 "visible"로 전환되면 사전 렌더링 된 자식 컴포넌트가 마운트되고 표시됩니다. 이를 통해 사용자가 다음에 상호작용을 할 가능성이 높은 UI 부분을 미리 준비하여 로딩 시간을 줄일 수 있습니다.

다음은 [`useTransition`](/reference/react/useTransition#preventing-unwanted-loading-indicators)에서 가져온 예시입니다. `PostsTab` 컴포넌트는 `use`를 사용하여 일부 데이터를 가져옵니다. "Posts" 탭을 클릭하면 `PostsTab` 컴포넌트가 일시 중단되어 버튼 로딩 상태가 나타납니다.
=======
This makes it possible to hide and then later restore components in the state they were previously in.

The following example has a sidebar with an expandable section. You can press "Overview" to reveal the three subitems below it. The main app area also has a button that hides and shows the sidebar.

Try expanding the Overview section, and then toggling the sidebar closed then open:
>>>>>>> 27d86ffe6ec82e3642c6490d2187bae2271020a4

<Sandpack>

```js src/App.js active
import { useState } from 'react';
import Sidebar from './Sidebar.js';

export default function App() {
  const [isShowingSidebar, setIsShowingSidebar] = useState(true);

  return (
    <>
      {isShowingSidebar && (
        <Sidebar />
      )}

      <main>
        <button onClick={() => setIsShowingSidebar(!isShowingSidebar)}>
          Toggle sidebar
        </button>
        <h1>Main content</h1>
      </main>
    </>
  );
}
```

```js src/Sidebar.js
import { useState } from 'react';

<<<<<<< HEAD
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
=======
export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false)
  
  return (
    <nav>
      <button onClick={() => setIsExpanded(!isExpanded)}>
        Overview
        <span className={`indicator ${isExpanded ? 'down' : 'right'}`}>
          &#9650;
        </span>
      </button>

      {isExpanded && (
        <ul>
          <li>Section 1</li>
          <li>Section 2</li>
          <li>Section 3</li>
        </ul>
      )}
    </nav>
  );
>>>>>>> 27d86ffe6ec82e3642c6490d2187bae2271020a4
}
```

```css
body { height: 275px; margin: 0; }
#root {
  display: flex;
  gap: 10px;
  height: 100%;
}
nav {
  padding: 10px;
  background: #eee;
  font-size: 14px;
  height: 100%;
}
main {
  padding: 10px;
}
p {
  margin: 0;
}
h1 {
  margin-top: 10px;
}
.indicator {
  margin-left: 4px;
  display: inline-block;
  rotate: 90deg;
}
.indicator.down {
  rotate: 180deg;
}
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

<<<<<<< HEAD
이 예시에서 "Posts" 탭을 클릭할 때 게시물이 로드될 때까지 기다려야 합니다.

숨겨진 `<Activity>`로 비활성 탭을 사전 렌더링하여 "Posts" 탭의 지연 시간을 줄일 수 있습니다.
=======
The Overview section always starts out collapsed. Because we unmount the sidebar when `isShowingSidebar` flips to `false`, all its internal state is lost.

This is a perfect use case for Activity. We can preserve the internal state of our sidebar, even when visually hiding it.

Let's replace the conditional rendering of our sidebar with an Activity boundary:

```jsx {7,9}
// Before
{isShowingSidebar && (
  <Sidebar />
)}

// After
<Activity mode={isShowingSidebar ? 'visible' : 'hidden'}>
  <Sidebar />
</Activity>
```

and check out the new behavior:
>>>>>>> 27d86ffe6ec82e3642c6490d2187bae2271020a4

<Sandpack>

```js src/App.js active
import { unstable_Activity as Activity, useState } from 'react';
import Sidebar from './Sidebar.js';

export default function App() {
  const [isShowingSidebar, setIsShowingSidebar] = useState(true);

  return (
    <>
      <Activity mode={isShowingSidebar ? 'visible' : 'hidden'}>
        <Sidebar />
      </Activity>

      <main>
        <button onClick={() => setIsShowingSidebar(!isShowingSidebar)}>
          Toggle sidebar
        </button>
        <h1>Main content</h1>
      </main>
    </>
  );
}
```

```js src/Sidebar.js
import { useState } from 'react';

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false)
  
  return (
    <nav>
      <button onClick={() => setIsExpanded(!isExpanded)}>
        Overview
        <span className={`indicator ${isExpanded ? 'down' : 'right'}`}>
          &#9650;
        </span>
      </button>

      {isExpanded && (
        <ul>
          <li>Section 1</li>
          <li>Section 2</li>
          <li>Section 3</li>
        </ul>
      )}
    </nav>
  );
}
<<<<<<< HEAD

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
=======
>>>>>>> 27d86ffe6ec82e3642c6490d2187bae2271020a4
```

```css
body { height: 275px; margin: 0; }
#root {
  display: flex;
  gap: 10px;
  height: 100%;
}
nav {
  padding: 10px;
  background: #eee;
  font-size: 14px;
  height: 100%;
}
main {
  padding: 10px;
}
p {
  margin: 0;
}
h1 {
  margin-top: 10px;
}
.indicator {
  margin-left: 4px;
  display: inline-block;
  rotate: 90deg;
}
.indicator.down {
  rotate: 180deg;
}
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

Our sidebar's internal state is now restored, without any changes to its implementation.

---

<<<<<<< HEAD
### UI 일부의 상태 유지하기 {/*keeping-state-for-part-of-the-ui*/}
=======
### Restoring the DOM of hidden components {/*restoring-the-dom-of-hidden-components*/}
>>>>>>> 27d86ffe6ec82e3642c6490d2187bae2271020a4

Since Activity boundaries hide their children using `display: none`, their children's DOM is also preserved when hidden. This makes them great for maintaining ephemeral state in parts of the UI that the user is likely to interact with again.

<<<<<<< HEAD
`<Activity>`를 "visible"에서 "hidden"으로 전환하여 UI 일부의 상태를 유지할 수 있습니다.
=======
In this example, the Contact tab has a `<textarea>` where the user can enter a message. If you enter some text, change to the Home tab, then change back to the Contact tab, the draft message is lost:
>>>>>>> 27d86ffe6ec82e3642c6490d2187bae2271020a4

<Sandpack>

```js src/App.js 
import { useState } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Contact from './Contact.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('contact');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        Home
      </TabButton>
      <TabButton
        isActive={activeTab === 'contact'}
        onClick={() => setActiveTab('contact')}
      >
        Contact
      </TabButton>

      <hr />

      {activeTab === 'home' && <Home />}
      {activeTab === 'contact' && <Contact />}
    </>
  );
}
```

```js src/TabButton.js
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/Contact.js active
export default function Contact() {
  return (
    <div>
      <p>Send me a message!</p>

      <textarea />

      <p>You can find me online here:</p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </div>
  );
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

This is because we're fully unmounting `Contact` in `App`. When the Contact tab unmounts, the `<textarea>` element's internal DOM state is lost.

If we switch to using an Activity boundary to show and hide the active tab, we can preserve the state of each tab's DOM. Try entering text and switching tabs again, and you'll see the draft message is no longer reset:

<Sandpack>

```js src/App.js active
import { useState, unstable_Activity as Activity } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Contact from './Contact.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('contact');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        Home
      </TabButton>
      <TabButton
        isActive={activeTab === 'contact'}
        onClick={() => setActiveTab('contact')}
      >
        Contact
      </TabButton>

      <hr />

      <Activity mode={activeTab === 'home' ? 'visible' : 'hidden'}>
        <Home />
      </Activity>
      <Activity mode={activeTab === 'contact' ? 'visible' : 'hidden'}>
        <Contact />
      </Activity>
    </>
  );
}
```

```js src/TabButton.js
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/Contact.js 
export default function Contact() {
  return (
    <div>
      <p>Send me a message!</p>

      <textarea />

      <p>You can find me online here:</p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </div>
  );
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

Again, the Activity boundary let us preserve the Contact tab's internal state without changing its implementation.

---

### Pre-rendering content that's likely to become visible {/*pre-rendering-content-thats-likely-to-become-visible*/}

So far, we've seen how Activity can hide some content that the user has interacted with, without discarding that content's ephemeral state.

But Activity boundaries can also be used to _prepare_ content that the user has yet to see for the first time:

```jsx [[1, 1, "\\"hidden\\""]]
<Activity mode="hidden">
  <SlowComponent />
</Activity>
```

<<<<<<< HEAD
Activity가 `mode="visible"`에서 "hidden"으로 전환되면 `children`은 페이지에서 숨겨지고 모든 Effect를 제거하여 마운트 해제되지만, React와 DOM 상태는 유지됩니다.

나중에 `mode`가 "visible"로 전환되면 저장된 상태가 모든 Effect를 생성하여 자식 컴포넌트를 마운트할 때 재사용됩니다. 이를 통해 사용자가 다시 상호작용할 가능성이 높은 UI 부분의 상태를 유지하여 DOM이나 React 상태를 유지할 수 있습니다.

다음은 [`useTransition`](/reference/react/useTransition#preventing-unwanted-loading-indicators)에서 가져온 예시입니다. `ContactTab`은 보낼 메시지 초안이 담긴 `<textarea>`를 포함합니다. 텍스트를 입력하고 다른 탭으로 변경한 다음 "Contact" 탭을 다시 클릭하면 메시지 초안이 사라집니다.
=======
When an Activity boundary is <CodeStep step={1}>hidden</CodeStep> during its initial render, its children won't be visible on the page — but they will _still be rendered_, albeit at a lower priority than the visible content, and without mounting their Effects.

This _pre-rendering_ allows the children to load any code or data they need ahead of time, so that later, when the Activity boundary becomes visible, the children can appear faster with reduced loading times.

Let's look at an example.
>>>>>>> 27d86ffe6ec82e3642c6490d2187bae2271020a4

In this demo, the Posts tab loads some data. If you press it, you'll see a Suspense fallback displayed while the data is being fetched:

<Sandpack>

```js src/App.js
import { useState, Suspense } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Posts from './Posts.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        Home
      </TabButton>
      <TabButton
        isActive={activeTab === 'posts'}
        onClick={() => setActiveTab('posts')}
      >
        Posts
      </TabButton>

      <hr />

      <Suspense fallback={<h1>🌀 Loading...</h1>}>
        {activeTab === 'home' && <Home />}
        {activeTab === 'posts' && <Posts />}
      </Suspense>
    </>
  );
}
```

```js src/TabButton.js hidden
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/Posts.js
import { use } from 'react';
import { fetchData } from './data.js';

export default function Posts() {
  const posts = use(fetchData('/posts'));

  return (
    <ul className="items">
      {posts.map(post =>
        <li className="item" key={post.id}>
          {post.title}
        </li>
      )}
    </ul>
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
video { width: 300px; margin-top: 10px; aspect-ratio: 16/9; }
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

<<<<<<< HEAD
이는 사용자가 입력한 DOM 상태를 잃게 됩니다. `<Activity>`로 비활성 탭을 숨겨서 Contact 탭의 상태를 유지할 수 있습니다.
=======
This is because `App` doesn't mount `Posts` until its tab is active.
>>>>>>> 27d86ffe6ec82e3642c6490d2187bae2271020a4

If we update `App` to use an Activity boundary to show and hide the active tab, `Posts` will be pre-rendered when the app first loads, allowing it to fetch its data before it becomes visible.

Try clicking the Posts tab now:

<Sandpack>

```js src/App.js
import { useState, Suspense, unstable_Activity as Activity } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Posts from './Posts.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        Home
      </TabButton>
      <TabButton
        isActive={activeTab === 'posts'}
        onClick={() => setActiveTab('posts')}
      >
        Posts
      </TabButton>

      <hr />

      <Suspense fallback={<h1>🌀 Loading...</h1>}>
        <Activity mode={activeTab === 'home' ? 'visible' : 'hidden'}>
          <Home />
        </Activity>
        <Activity mode={activeTab === 'posts' ? 'visible' : 'hidden'}>
          <Posts />
        </Activity>
      </Suspense>
    </>
  );
}
```

```js src/TabButton.js hidden
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/Posts.js
import { use } from 'react';
import { fetchData } from './data.js';

export default function Posts() {
  const posts = use(fetchData('/posts'));

  return (
    <ul className="items">
      {posts.map(post =>
        <li className="item" key={post.id}>
          {post.title}
        </li>
      )}
    </ul>
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
video { width: 300px; margin-top: 10px; aspect-ratio: 16/9; }
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

`Posts` was able to prepare itself for a faster render, thanks to the hidden Activity boundary.

---

Pre-rendering components with hidden Activity boundaries is a powerful way to reduce loading times for parts of the UI that the user is likely to interact with next.

<Note>

**Only Suspense-enabled data sources will be fetched during pre-rendering.** They include:

- Data fetching with Suspense-enabled frameworks like [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) and [Next.js](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming#streaming-with-suspense)
- Lazy-loading component code with [`lazy`](/reference/react/lazy)
- Reading the value of a cached Promise with [`use`](/reference/react/use)

Activity **does not** detect data that is fetched inside an Effect.

The exact way you would load data in the `Posts` component above depends on your framework. If you use a Suspense-enabled framework, you'll find the details in its data fetching documentation.

Suspense-enabled data fetching without the use of an opinionated framework is not yet supported. The requirements for implementing a Suspense-enabled data source are unstable and undocumented. An official API for integrating data sources with Suspense will be released in a future version of React. 

</Note>

---


### Speeding up interactions during page load {/*speeding-up-interactions-during-page-load*/}

React includes an under-the-hood performance optimization called Selective Hydration. It works by hydrating your app's initial HTML _in chunks_, enabling some components to become interactive even if other components on the page haven't loaded their code or data yet.

Suspense boundaries participate in Selective Hydration, because they naturally divide your component tree into units that are independent from one another:

```jsx
function Page() {
  return (
    <>
      <MessageComposer />

      <Suspense fallback="Loading chats...">
        <Chats />
      </Suspense>
    </>
  )
}
```

Here, `MessageComposer` can be fully hydrated during the initial render of the page, even before `Chats` is mounted and starts to fetch its data.

So by breaking up your component tree into discrete units, Suspense allows React to hydrate your app's server-rendered HTML in chunks, enabling parts of your app to become interactive as fast as possible.

But what about pages that don't use Suspense?

Take this tabs example:

```jsx
function Page() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <>
      <TabButton onClick={() => setActiveTab('home')}>
        Home
      </TabButton>
      <TabButton onClick={() => setActiveTab('video')}>
        Video
      </TabButton>

      {activeTab === 'home' && (
        <Home />
      )}
      {activeTab === 'video' && (
        <Video />
      )}
    </>
  )
}
```

Here, React must hydrate the entire page all at once. If `Home` or `Video` are slower to render, they could make the tab buttons feel unresponsive during hydration.

Adding Suspense around the active tab would solve this:

```jsx {13,20}
function Page() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <>
      <TabButton onClick={() => setActiveTab('home')}>
        Home
      </TabButton>
      <TabButton onClick={() => setActiveTab('video')}>
        Video
      </TabButton>

      <Suspense fallback={<Placeholder />}>
        {activeTab === 'home' && (
          <Home />
        )}
        {activeTab === 'video' && (
          <Video />
        )}
      </Suspense>
    </>
  )
}
```

...but it would also change the UI, since the `Placeholder` fallback would be displayed on the initial render.

Instead, we can use Activity. Since Activity boundaries show and hide their children, they already naturally divide the component tree into independent units. And just like Suspense, this feature allows them to participate in Selective Hydration.

Let's update our example to use Activity boundaries around the active tab:

```jsx {13-18}
function Page() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <>
      <TabButton onClick={() => setActiveTab('home')}>
        Home
      </TabButton>
      <TabButton onClick={() => setActiveTab('video')}>
        Video
      </TabButton>

      <Activity mode={activeTab === "home" ? "visible" : "hidden"}>
        <Home />
      </Activity>
      <Activity mode={activeTab === "video" ? "visible" : "hidden"}>
        <Video />
      </Activity>
    </>
  )
}
```

Now our initial server-rendered HTML looks the same as it did in the original version, but thanks to Activity, React can hydrate the tab buttons first, before it even mounts `Home` or `Video`.

---

Thus, in addition to hiding and showing content, Activity boundaries help improve your app's performance during hydration by letting React know which parts of your page can become interactive in isolation.

And even if your page doesn't ever hide part of its content, you can still add always-visible Activity boundaries to improve hydration performance:

```jsx
function Page() {
  return (
    <>
      <Post />

      <Activity>
        <Comments />
      </Activity>
    </>
  );
} 
```

---

## 문제 해결 {/*troubleshooting*/}

<<<<<<< HEAD
### Activity가 숨겨져 있을 때 Effect가 마운트되지 않습니다 {/*effects-dont-mount-when-an-activity-is-hidden*/}

`<Activity>`가 "hidden"일 때 모든 Effect가 마운트 해제됩니다. 개념적으로는 컴포넌트가 마운트 해제되지만, React는 나중에 사용할 상태를 저장합니다.

이는 Activity의 기능입니다. 숨겨진 UI 부분에 대한 구독이 이루어지지 않아 숨겨진 콘텐츠에 대한 작업량이 줄어들기 때문입니다. 또한 비디오 일시 정지와 같은 정리 작업(Activity 없이 마운트 해제했을 때 예상되는 동작)이 실행됩니다. Activity가 "visible"로 전환되면 Effect를 생성하여 마운트하고, 이때 구독하고 비디오를 재생합니다.

각 버튼에 대해 다른 비디오가 재생되는 다음 예시를 살펴보세요.
=======
### My hidden components have unwanted side effects {/*my-hidden-components-have-unwanted-side-effects*/}

An Activity boundary hides its content by setting `display: none` on its children and cleaning up any of their Effects. So, most well-behaved React components that properly clean up their side effects will already be robust to being hidden by Activity.

But there _are_ some situations where a hidden component behaves differently than an unmounted one. Most notably, since a hidden component's DOM is not destroyed, any side effects from that DOM will persist, even after the component is hidden.
>>>>>>> 27d86ffe6ec82e3642c6490d2187bae2271020a4

As an example, consider a `<video>` tag. Typically it doesn't require any cleanup, because even if you're playing a video, unmounting the tag stops the video and audio from playing in the browser. Try playing the video and then pressing Home in this demo:

<Sandpack>

```js src/App.js active
import { useState } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Video from './Video.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('video');

  return (
    <>
<<<<<<< HEAD
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
=======
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        Home
      </TabButton>
      <TabButton
        isActive={activeTab === 'video'}
        onClick={() => setActiveTab('video')}
      >
        Video
      </TabButton>

      <hr />

      {activeTab === 'home' && <Home />}
      {activeTab === 'video' && <Video />}
>>>>>>> 27d86ffe6ec82e3642c6490d2187bae2271020a4
    </>
  );
}
```

```js src/TabButton.js hidden
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

<<<<<<< HEAD

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
=======
  return (
    <button onClick={onClick}>
      {children}
    </button>
>>>>>>> 27d86ffe6ec82e3642c6490d2187bae2271020a4
  );
}
```

<<<<<<< HEAD
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
=======
```js src/Home.js
export default function Home() {
  return (
    <p>Welcome to my profile!</p>
>>>>>>> 27d86ffe6ec82e3642c6490d2187bae2271020a4
  );
}
```

```js src/Video.js 
export default function Video() {
  return (
    <video
      // 'Big Buck Bunny' licensed under CC 3.0 by the Blender foundation. Hosted by archive.org
      src="https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4"
      controls
      playsInline
    />

  );
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
video { width: 300px; margin-top: 10px; aspect-ratio: 16/9; }
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

<<<<<<< HEAD
이러한 이유로 Activity를 개념적으로는 컴포넌트를 "마운트 해제"하고 "재마운트"하되 React나 DOM 상태는 나중에 사용할 수 있도록 저장하는 것으로 생각하는 것이 좋습니다. 실제로는 [You Might Not Need an Effect](learn/you-might-not-need-an-effect) 가이드를 따랐다면 예상대로 작동합니다. 문제가 있는 Effect를 적극적으로 찾으려면 Activity 마운트 해제와 마운트를 적극적으로 수행하여 예상치 못한 부작용을 잡아내는 [`<StrictMode>`](/reference/react/StrictMode)를 추가하는 것을 추천합니다.

### 숨겨진 Activity가 SSR에서 렌더링되지 않습니다 {/*my-hidden-activity-is-not-rendered-in-ssr*/}

서버 사이드 렌더링 중에 `<Activity mode="hidden">`을 사용하면 Activity의 콘텐츠가 SSR 응답에 포함되지 않습니다. 이는 콘텐츠가 페이지에 표시되지 않고 초기 렌더링에 필요하지 않기 때문입니다. SSR 응답에 콘텐츠를 포함해야 한다면 [`useDeferredValue`](/reference/react/useDeferredValue)를 사용하여 콘텐츠의 렌더링을 지연시키는 것과 같은 다른 접근 방법을 사용할 수 있습니다.
=======
The video stops playing as expected.

Now, let's say we wanted to preserve the timecode where the user last watched, so that when they tab back to the video, it doesn't start over from the beginning again.

This is a great use case for Activity!

Let's update `App` to hide the inactive tab with a hidden Activity boundary instead of unmounting it, and see how the demo behaves this time:

<Sandpack>

```js src/App.js active
import { useState, unstable_Activity as Activity } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Video from './Video.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('video');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        Home
      </TabButton>
      <TabButton
        isActive={activeTab === 'video'}
        onClick={() => setActiveTab('video')}
      >
        Video
      </TabButton>

      <hr />

      <Activity mode={activeTab === 'home' ? 'visible' : 'hidden'}>
        <Home />
      </Activity>
      <Activity mode={activeTab === 'video' ? 'visible' : 'hidden'}>
        <Video />
      </Activity>
    </>
  );
}
```

```js src/TabButton.js hidden
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/Video.js 
export default function Video() {
  return (
    <video
      controls
      playsInline
      // 'Big Buck Bunny' licensed under CC 3.0 by the Blender foundation. Hosted by archive.org
      src="https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4"
    />

  );
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
video { width: 300px; margin-top: 10px; aspect-ratio: 16/9; }
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

Whoops! The video and audio continue to play even after it's been hidden, because the tab's `<video>` element is still in the DOM.

To fix this, we can add an Effect with a cleanup function that pauses the video:

```jsx {2,4-10,14}
export default function VideoTab() {
  const ref = useRef();

  useLayoutEffect(() => {
    const videoRef = ref.current;

    return () => {
      videoRef.pause()
    }
  }, []);

  return (
    <video
      ref={ref}
      controls
      playsInline
      src="..."
    />

  );
}
```

We call `useLayoutEffect` instead of `useEffect` because conceptually the clean-up code is tied to the component's UI being visually hidden. If we used a regular effect, the code could be delayed by (say) a re-suspending Suspense boundary or a View Transition.

Let's see the new behavior. Try playing the video, switching to the Home tab, then back to the Video tab:

<Sandpack>

```js src/App.js active
import { useState, unstable_Activity as Activity } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Video from './Video.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('video');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        Home
      </TabButton>
      <TabButton
        isActive={activeTab === 'video'}
        onClick={() => setActiveTab('video')}
      >
        Video
      </TabButton>

      <hr />

      <Activity mode={activeTab === 'home' ? 'visible' : 'hidden'}>
        <Home />
      </Activity>
      <Activity mode={activeTab === 'video' ? 'visible' : 'hidden'}>
        <Video />
      </Activity>
    </>
  );
}
```

```js src/TabButton.js hidden
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/Video.js 
import { useRef, useLayoutEffect } from 'react';

export default function Video() {
  const ref = useRef();

  useLayoutEffect(() => {
    const videoRef = ref.current

    return () => {
      videoRef.pause()
    };
  }, [])

  return (
    <video
      ref={ref}
      controls
      playsInline
      // 'Big Buck Bunny' licensed under CC 3.0 by the Blender foundation. Hosted by archive.org
      src="https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4"
    />

  );
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
video { width: 300px; margin-top: 10px; aspect-ratio: 16/9; }
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

It works great! Our cleanup function ensures that the video stops playing if it's ever hidden by an Activity boundary, and even better, because the `<video>` tag is never destroyed, the timecode is preserved, and the video itself doesn't need to be initialized or downloaded again when the user switches back to keep watching it.

This is a great example of using Activity to preserve ephemeral DOM state for parts of the UI that become hidden, but the user is likely to interact with again soon.

---

Our example illustrates that for certain tags like `<video>`, unmounting and hiding have different behavior. If a component renders DOM that has a side effect, and you want to prevent that side effect when an Activity boundary hides it, add an Effect with a return function to clean it up.

The most common cases of this will be from the following tags:

  - `<video>`
  - `<audio>`
  - `<iframe>`

Typically, though, most of your React components should already be robust to being hidden by an Activity boundary. And conceptually, you should think of "hidden" Activities as being unmounted.

To eagerly discover other Effects that don't have proper cleanup, which is important not only for Activity boundaries but for many other behaviors in React, we recommend using [`<StrictMode>`](/reference/react/StrictMode). 

---


### My hidden components have Effects that aren't running {/*my-hidden-components-have-effects-that-arent-running*/}

When an `<Activity>` is "hidden", all its children's Effects are cleaned up. Conceptually, the children are unmounted, but React saves their state for later. This is a feature of Activity because it means subscriptions won't be active for hidden parts of the UI, reducing the amount of work needed for hidden content.

If you're relying on an Effect mounting to clean up a component's side effects, refactor the Effect to do the work in the returned cleanup function instead.

To eagerly find problematic Effects, we recommend adding [`<StrictMode>`](/reference/react/StrictMode) which will eagerly perform Activity unmounts and mounts to catch any unexpected side-effects. 
>>>>>>> 27d86ffe6ec82e3642c6490d2187bae2271020a4
