---
title: useTransition
---

<Intro>

`useTransition`은 UI를 차단하지 않고 상태를 업데이트할 수 있는 React Hook입니다.

```js
const [isPending, startTransition] = useTransition()
```

</Intro>

<InlineToc />

---

## 레퍼런스 {/*reference*/}

### `useTransition()` {/*usetransition*/}

컴포넌트의 최상위 수준에서 `useTransition`을 호출하여 일부 state 업데이트를 transition으로 표시합니다.

```js
import { useTransition } from 'react';

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  // ...
}
```

[아래에서 더 많은 예시를 확인하세요.](#usage)

#### 매개변수 {/*parameters*/}

`useTransition`은 어떤 매개변수도 받지 않습니다.

#### 반환값 {/*returns*/}

`useTransition`은 정확히 두 개의 항목이 있는 배열을 반환합니다.

1. 보류 중인 transition이 있는지를 알려주는 `isPending` 플래그입니다.
2. state 업데이트를 transition으로 표시할 수 있는 [`startTransition` 함수](#starttransition)입니다.

---

### `startTransition` 함수 {/*starttransition*/}

`useTransition`이 반환하는 `startTransition` 함수를 사용하면 state 업데이트를 transition으로 표시할 수 있습니다.

```js {6,8}
function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

#### 매개변수 {/*starttransition-parameters*/}

* `scope`: 하나 이상의 [`set` 함수](/reference/react/useState#setstate)를 호출하여 일부 state를 업데이트하는 함수입니다. React는 매개변수 없이 `scope`를 즉시 호출하고 `scope` 함수를 호출하는 동안 동기적으로 예약된 모든 state 업데이트를 transition으로 표시합니다. 이는 [non-blocking](#marking-a-state-update-as-a-non-blocking-transition)이며 [원치 않는 로딩을 표시하지 않습니다.](#preventing-unwanted-loading-indicators)

#### 반환값 {/*starttransition-returns*/}

`startTransition`은 아무것도 반환하지 않습니다.

#### 주의 사항 {/*starttransition-caveats*/}

* `useTransition`은 Hook이므로 컴포넌트나 커스텀 Hook 내부에서만 호출할 수 있습니다. 다른 곳(예시: 데이터 라이브러리)에서 transition을 시작해야 하는 경우, 독립형 [`startTransition`](/reference/react/startTransition)을 호출하세요.

* 해당 state의 `set` 함수에 액세스할 수 있는 경우에만 업데이트를 transition으로 래핑할 수 있습니다. 일부 prop이나 커스텀 Hook 값에 대한 응답으로 transition을 시작하려면 [`useDeferredValue`](/reference/react/useDeferredValue)를 사용해 보세요.

* `startTransition`에 전달하는 함수는 동기식이어야 합니다. React는 이 함수를 즉시 실행하여 실행하는 동안 발생하는 모든 state 업데이트를 transition으로 표시합니다. 나중에 더 많은 state 업데이트를 수행하려고 하면(예시: timeout), transition으로 표시되지 않습니다.

* Transition으로 표시된 state 업데이트는 다른 state 업데이트에 의해 중단됩니다. 예를 들어, transition 내에서 차트 컴포넌트를 업데이트한 다음 차트가 다시 렌더링 되는 도중에 입력을 시작하면 React는 입력 업데이트를 처리한 후 차트 컴포넌트에서 렌더링 작업을 다시 시작합니다.

* Transition 업데이트는 텍스트 입력을 제어하는 데 사용할 수 없습니다.

* 진행 중인 transition이 여러 개 있는 경우, React는 현재 transition을 함께 일괄 처리합니다. 이는 향후 릴리즈에서 제거될 가능성이 높은 제한 사항입니다.

---

## 사용법 {/*usage*/}

### state 업데이트를 non-blocking transition으로 표시 {/*marking-a-state-update-as-a-non-blocking-transition*/}

컴포넌트의 최상위 수준에서 `useTransition`을 호출하여 state 업데이트를 non-blocking *transitions*으로 표시하세요.

```js [[1, 4, "isPending"], [2, 4, "startTransition"]]
import { useState, useTransition } from 'react';

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  // ...
}
```

`useTransition`은 정확히 두 개의 항목이 있는 배열을 반환합니다.

1. 보류 중인 transition이 있는지를 알려주는 <CodeStep step={1}>`isPending` 플래그</CodeStep>입니다.
2. state 업데이트를 transition으로 표시할 수 있는 <CodeStep step={2}>`startTransition` 함수</CodeStep>입니다.

그 후 다음과 같이 state 업데이트를 transition으로 표시할 수 있습니다.

```js {6,8}
function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

Transition을 사용하면 느린 디바이스에서도 사용자 인터페이스 업데이트의 반응성을 유지할 수 있습니다.

Transition을 사용하면 리렌더링 도중에도 UI가 반응성을 유지합니다. 예를 들어 사용자가 탭을 클릭했다가 마음이 바뀌어 다른 탭을 클릭하면 첫 번째 리렌더링이 완료될 때까지 기다릴 필요 없이 다른 탭을 클릭할 수 있습니다.

<Recipes titleText="useTransition과 일반 state 업데이트의 차이점" titleId="examples">

#### Transition에서 현재 탭 업데이트 {/*updating-the-current-tab-in-a-transition*/}

이 예시에서는 "Posts" 탭이 **인위적으로 느려지도록** 하여 렌더링하는 데 최소 1초가 걸리도록 했습니다.

"posts"을 클릭한 다음 바로 "Contact"를 클릭합니다. 이렇게 하면 "Posts"의 느린 렌더링이 중단됩니다. "Contact" 탭이 즉시 표시됩니다. 이 state 업데이트는 transition으로 표시되므로 느리게 다시 렌더링해도 사용자 인터페이스가 멈추지 않습니다.

<Sandpack>

```js
import { useState, useTransition } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);      
    });
  }

  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => selectTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => selectTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => selectTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js TabButton.js
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      onClick();
    }}>
      {children}
    </button>
  )
}

```

```js AboutTab.js
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // 한 번 로깅 합니다. 실제 속도 저하는 SlowPost 컴포넌트 내부에 있습니다.
  console.log('[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // 항목당 1 ms 동안 아무것도 하지 않음으로써 매우 느린 코드를 대리 실행합니다.
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
```

</Sandpack>

<Solution />

#### Transition 없이 현재 탭 업데이트 {/*updating-the-current-tab-without-a-transition*/}

이 예시에서도 "Posts" 탭이 렌더링하는 데 최소 1초가 걸리도록 **인위적으로 느려지게** 했습니다. 이전 예시와 달리 이 state 업데이트는 **transition이 아닙니다.**

"posts"을 클릭한 다음 바로 "Contact"를 클릭합니다. 속도가 느려진 탭을 렌더링하는 동안 앱이 멈추고 UI가 응답하지 않는 것을 확인할 수 있습니다. 이 state 업데이트는 transition이 아니므로 느리게 다시 렌더링 되면 사용자 인터페이스가 정지됩니다.

<Sandpack>

```js
import { useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    setTab(nextTab);
  }

  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => selectTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => selectTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => selectTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js TabButton.js
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      onClick();
    }}>
      {children}
    </button>
  )
}

```

```js AboutTab.js
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // 한 번 로깅합니다. 실제 속도 저하는 SlowPost 컴포넌트 내부에 있습니다.
  console.log('[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // 항목당 1 ms 동안 아무것도 하지 않음으로써 매우 느린 코드를 대리 실행합니다.
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### Transition에서 상위 컴포넌트 업데이트 {/*updating-the-parent-component-in-a-transition*/}

`useTransition` 호출에서도 부모 컴포넌트의 state를 업데이트할 수 있습니다. 예를 들어, 아래의 `TabButton` 컴포넌트는 `onClick` 로직을 transition으로 래핑합니다.

```js {8-10}
export default function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        onClick();
      });
    }}>
      {children}
    </button>
  );
}
```

부모 컴포넌트가 `onClick` 이벤트 핸들러 내에서 state를 업데이트하기 때문에 해당 state 업데이트는 transition으로 표시됩니다. 그렇기 때문에 앞의 예시에서처럼 "posts"을 클릭한 다음 바로 "Contact"를 클릭할 수 있습니다. 선택한 탭을 업데이트하는 것은 transition으로 표시되므로 사용자 상호작용을 차단하지 않습니다.

<Sandpack>

```js
import { useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => setTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        onClick();
      });
    }}>
      {children}
    </button>
  );
}
```

```js AboutTab.js
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // 한 번 로깅합니다. 실제 속도 저하는 SlowPost 컴포넌트 내부에 있습니다.
  console.log('[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // 항목당 1 ms 동안 아무것도 하지 않음으로써 매우 느린 코드를 대리 실행합니다.
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
```

</Sandpack>

---

### Transition 중에 보류 중인 시각적 state 표시 {/*displaying-a-pending-visual-state-during-the-transition*/}

`useTransition`이 반환하는 `isPending` boolean 값을 사용하여 transition이 진행 중임을 사용자에게 표시할 수 있습니다. 예를 들어 탭 버튼은 특별한 "pending" 시각적 상태를 가질 수 있습니다.

```js {4-6}
function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  // ...
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  // ...
```

이제 탭 버튼 자체가 바로 업데이트되므로 "Posts"을 클릭하는 반응이 더 빨라진 것을 확인할 수 있습니다.

<Sandpack>

```js
import { useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => setTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
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
        onClick();
      });
    }}>
      {children}
    </button>
  );
}
```

```js AboutTab.js
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // 한 번 로깅합니다. 실제 속도 저하는 SlowPost 컴포넌트 내부에 있습니다.
  console.log('[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // 항목당 1 ms 동안 아무것도 하지 않음으로써 매우 느린 코드를 대리 실행합니다.
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

---

### 원치 않는 로딩 표시기 방지 {/*preventing-unwanted-loading-indicators*/}

이 예시에서 `PostsTab` 컴포넌트는 [Suspense-enabled](/reference/react/Suspense) 데이터 소스를 사용하여 일부 데이터를 가져옵니다. "Posts" 탭을 클릭하면 `PostsTab` 컴포넌트가 *suspends* 되어 가장 가까운 로딩 폴백이 나타납니다.

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
        onClick={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => setTab('posts')}
      >
        Posts
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => setTab('contact')}
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

```js TabButton.js
export default function TabButton({ children, isActive, onClick }) {
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      onClick();
    }}>
      {children}
    </button>
  );
}
```

```js AboutTab.js hidden
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js PostsTab.js hidden
import { fetchData } from './data.js';

// Note: 이 컴포넌트는 실험적인 API를 사용하여 작성되었습니다.
// 아직 안정된 버전의 React에서는 사용할 수 없습니다.

// 지금 바로 따라 할 수 있는 현실적인 예시를 보려면 Relay 또는
// Next.js와 같이 Suspense와 통합된 프레임워크를 사용해 보세요.

function PostsTab() {
  const posts = use(fetchData('/posts'));
  return (
    <ul className="items">
      {posts.map(post =>
        <Post key={post.id} title={post.title} />
      )}
    </ul>
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

// 데모를 실행하기 위한 임시 버그 해결 방법입니다.
// TODO: 버그가 수정되면 실제 구현체로 교체합니다.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },      
    );
    throw promise;
  }
}
```

```js ContactTab.js hidden
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```


```js data.js hidden
// Note: 데이터 가져오기를 수행하는 방식은 Suspense와 함께
// 사용하는 프레임워크에 따라 다릅니다.
// 일반적으로 캐싱 로직은 프래임워크 내부에 있습니다.

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
  // 가짜 딜레이를 추가하여 대기 시간을 눈에 띄게 만듭니다.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 500; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

로딩 표시기를 표시하기 위해 전체 탭 컨테이너를 숨기면 사용자 경험이 어색해집니다. `TabButton`에 `useTransition`을 추가하면 탭 버튼에 보류 중인 상태를 표시할 수 있습니다.

"Posts"을 클릭하면 더 이상 전체 탭 컨테이너가 스피너로 바뀌지 않습니다.

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
        onClick={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => setTab('posts')}
      >
        Posts
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => setTab('contact')}
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

```js TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
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
        onClick();
      });
    }}>
      {children}
    </button>
  );
}
```

```js AboutTab.js hidden
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js PostsTab.js hidden
import { fetchData } from './data.js';

// Note: 이 컴포넌트는 실험적인 API를 사용하여 작성되었습니다.
// 아직 안정된 버전의 React에서는 사용할 수 없습니다.

// 지금 바로 따라 할 수 있는 현실적인 예시를 보려면 Relay 또는
// Next.js와 같이 Suspense와 통합된 프레임워크를 사용해 보세요.

function PostsTab() {
  const posts = use(fetchData('/posts'));
  return (
    <ul className="items">
      {posts.map(post =>
        <Post key={post.id} title={post.title} />
      )}
    </ul>
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

// 데모를 실행하기 위한 임시 버그 해결 방법입니다.
// TODO: 버그가 수정되면 실제 구현체로 교체합니다.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },      
    );
    throw promise;
  }
}
```

```js ContactTab.js hidden
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```


```js data.js hidden
// Note: 데이터 가져오기를 수행하는 방식은 Suspense와 함께
// 사용하는 프레임워크에 따라 다릅니다.
// 일반적으로 캐싱 로직은 프래임워크 내부에 있습니다.

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
  // 가짜 딜레이를 추가하여 대기 시간을 눈에 띄게 만듭니다.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 500; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

[Suspense에서 transition을 사용하는 방법에 대해 자세히 알아보세요.](/reference/react/Suspense#preventing-already-revealed-content-from-hiding)

<Note>

Transition은 *이미 표시된* 콘텐츠(예시: 탭 컨테이너)를 숨기지 않을 만큼만 "대기"합니다. 만약 Posts 탭에 [중첩된 `<Suspense>` 경계](/reference/react/Suspense#revealing-nested-content-as-it-loads)가 있는 경우 transition은 이를 "대기"하지 않습니다.

</Note>

---

### Suspense-enabled 라우터 구축 {/*building-a-suspense-enabled-router*/}

React 프레임워크나 라우터를 구축하는 경우 페이지 탐색을 transition으로 표시하는 것이 좋습니다.

```js {3,6,8}
function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }
  // ...
```

두 가지 이유로 이 방법을 권장합니다.

- [Transition은 중단할 수 있으므로](#marking-a-state-update-as-a-non-blocking-transition) 사용자는 리렌더링이 완료될 때까지 기다릴 필요 없이 바로 클릭할 수 있습니다.
- [Transition은 원치 않는 로딩 표시기를 방지하므로](#preventing-unwanted-loading-indicators) 사용자가 탐색 시 갑작스러운 이동을 방지할 수 있습니다.

다음은 탐색을 위해 transition을 사용하는 아주 간단한 라우터 예시입니다.

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js App.js
import { Suspense, useState, useTransition } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout isPending={isPending}>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}
```

```js Layout.js
export default function Layout({ children, isPending }) {
  return (
    <div className="layout">
      <section className="header" style={{
        opacity: isPending ? 0.7 : 1
      }}>
        Music Browser
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      Open The Beatles artist page
    </button>
  );
}
```

```js ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js Albums.js hidden
import { fetchData } from './data.js';

// Note: 이 컴포넌트는 실험적인 API를 사용하여 작성되었습니다.
// 아직 안정된 버전의 React에서는 사용할 수 없습니다.

// 지금 바로 따라 할 수 있는 현실적인 예시를 보려면 Relay 또는
// Next.js와 같이 Suspense와 통합된 프레임워크를 사용해 보세요.

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}

// 데모를 실행하기 위한 임시 버그 해결 방법입니다.
// TODO: 버그가 수정되면 실제 구현체로 교체합니다.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },      
    );
    throw promise;
  }
}
```

```js Biography.js hidden
import { fetchData } from './data.js';

// Note: 이 컴포넌트는 실험적인 API를 사용하여 작성되었습니다.
// 아직 안정된 버전의 React에서는 사용할 수 없습니다.

// 지금 바로 따라 할 수 있는 현실적인 예시를 보려면 Relay 또는
// Next.js와 같이 Suspense와 통합된 프레임워크를 사용해 보세요.

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}

// 데모를 실행하기 위한 임시 버그 해결 방법입니다.
// TODO: 버그가 수정되면 실제 구현체로 교체합니다.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },      
    );
    throw promise;
  }
}
```

```js Panel.js hidden
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js data.js hidden
// Note: 데이터 가져오기를 수행하는 방식은 Suspense와 함께
// 사용하는 프레임워크에 따라 다릅니다.
// 일반적으로 캐싱 로직은 프래임워크 내부에 있습니다.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // 가짜 딜레이를 추가하여 대기 시간을 눈에 띄게 만듭니다.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles were an English rock band, 
    formed in Liverpool in 1960, that comprised 
    John Lennon, Paul McCartney, George Harrison 
    and Ringo Starr.`;
}

async function getAlbums() {
  // 가짜 딜레이를 추가하여 대기 시간을 눈에 띄게 만듭니다.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];
}
```

```css
main {
  min-height: 200px;
  padding: 10px;
}

.layout {
  border: 1px solid black;
}

.header {
  background: #222;
  padding: 10px;
  text-align: center;
  color: white;
}

.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

<Note>

[Suspense-enabled](/reference/react/Suspense) 라우터는 기본적으로 탐색 업데이트를 transition으로 래핑할 것으로 예상됩니다.

</Note>

---

## 문제 해결 {/*troubleshooting*/}

### Transition에서 입력 업데이트가 작동하지 않습니다 {/*updating-an-input-in-a-transition-doesnt-work*/}

입력을 제어하는 state 변수에는 transition을 사용할 수 없습니다.

```js {4,10}
const [text, setText] = useState('');
// ...
function handleChange(e) {
  // ❌ 제어된 입력 state에 transition을 사용할 수 없습니다.
  startTransition(() => {
    setText(e.target.value);
  });
}
// ...
return <input value={text} onChange={handleChange} />;
```

이는 transition이 non-blocking이지만, 변경 이벤트에 대한 응답으로 입력을 업데이트하는 것은 동기적으로 이루어져야 하기 때문입니다. 입력에 대한 응답으로 transition을 실행하려면 두 가지 옵션이 있습니다.

1. 두 개의 개별 state 변수를 선언할 수 있습니다. 하나는 입력 state(항상 동기적으로 업데이트됨) 용이고 다른 하나는 transition시 업데이트할 state입니다. 이를 통해 동기 state를 사용하여 입력을 제어하고 (입력보다 "지연"되는) transition state 변수를 나머지 렌더링 로직에 전달할 수 있습니다.
2. 또는 state 변수가 하나 있고 실제 값보다 "지연"되는 [`useDeferredValue`](/reference/react/useDeferredValue)를 추가할 수 있습니다. 그러면 non-blocking 리렌더링이 새로운 값을 자동으로 "따라잡기" 위해 트리거됩니다.

---

### React가 state 업데이트를 transition으로 처리하지 않습니다 {/*react-doesnt-treat-my-state-update-as-a-transition*/}

state 업데이트를 transition으로 래핑할 때는 `startTransition` 호출 *도중*에 발생해야 합니다.

```js
startTransition(() => {
  // ✅ startTransition 호출 *도중* state 설정
  setPage('/about');
});
```

`startTransition`에 전달하는 함수는 동기식이어야 합니다.

아래와 같은 업데이트는 transition으로 표시할 수 없습니다.

```js
startTransition(() => {
  // ❌ startTransition 호출 *후에* state 설정
  setTimeout(() => {
    setPage('/about');
  }, 1000);
});
```

대신 다음과 같이 할 수 있습니다.

```js
setTimeout(() => {
  startTransition(() => {
    // ✅ startTransition 호출 *도중* state 설정
    setPage('/about');
  });
}, 1000);
```

마찬가지로 업데이트를 이와 같은 transition으로 표시할 수 없습니다.

```js
startTransition(async () => {
  await someAsyncFunction();
  // ❌ startTransition 호출 *후에* state 설정
  setPage('/about');
});
```

하지만 이 방법이 대신 동작합니다.

```js
await someAsyncFunction();
startTransition(() => {
  // ✅ startTransition 호출 *도중* state 설정
  setPage('/about');
});
```

---

### 컴포넌트 외부에서 `useTransition`을 호출하고 싶습니다 {/*i-want-to-call-usetransition-from-outside-a-component*/}

Hook이기 때문에 컴포넌트 외부에서 `useTransition`을 호출할 수 없습니다. 이 경우 대신 독립형 [`startTransition`](/reference/react/startTransition) 메서드를 사용하세요. 동일한 방식으로 작동하지만 `isPending` 표시기를 제공하지 않습니다.

---

### `startTransition`에 전달한 함수는 즉시 실행됩니다 {/*the-function-i-pass-to-starttransition-executes-immediately*/}

이 코드를 실행하면 1, 2, 3이 출력됩니다.

```js {1,3,6}
console.log(1);
startTransition(() => {
  console.log(2);
  setPage('/about');
});
console.log(3);
```

**1, 2, 3을 출력할 것으로 예상됩니다.** `startTransition`에 전달한 함수는 지연되지 않습니다. 브라우저 `setTimeout`과 달리 나중에 콜백을 실행하지 않습니다. React는 함수를 즉시 실행하지만, *함수가 실행되는 동안* 예약된 모든 상태 업데이트는 트랜지션으로 표시됩니다. 아래와 같이 작동한다고 상상하면 됩니다.

```js
// React 작동 방식의 간소화된 버전

let isInsideTransition = false;

function startTransition(scope) {
  isInsideTransition = true;
  scope();
  isInsideTransition = false;
}

function setState() {
  if (isInsideTransition) {
    // ... transition state 업데이트 예약 ...
  } else {
    // ... 긴급 state 업데이트 예약 ...
  }
}
```
