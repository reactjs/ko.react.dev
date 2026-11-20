---
title: use
---

<Intro>

`use`는 렌더링 중에 [Promise](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise)나 [Context](/learn/passing-data-deeply-with-context)와 같은 데이터를 참조하는 React API입니다.

```js
const value = use(resource);
```

</Intro>

<InlineToc />

---

## 레퍼런스 {/*reference*/}

### `use(context)` {/*use-context*/}

[Context](/learn/passing-data-deeply-with-context)의 값을 읽으려면 Context를 전달해 `use`를 호출하세요. [`useContext`](/reference/react/useContext)와 달리 `use`는 `if`와 같은 조건문과 반복문 내부에서 호출할 수 있습니다.

```js
import { use } from 'react';

function Button() {
  const theme = use(ThemeContext);
  // ...
```

[아래 예시를 참고하세요.](#usage-context)

#### 매개변수 {/*context-parameters*/}

* `context`: [`createContext`](/reference/react/createContext)로 생성한 [Context](/learn/passing-data-deeply-with-context)입니다.

#### 반환값 {/*context-returns*/}

전달한 Context의 값을 반환합니다. 이 값은 호출하는 컴포넌트 위에 있는 가장 가까운 Context Provider에 따라 정해집니다. Provider가 없으면 반환된 값은 [`createContext`](/reference/react/createContext)에 전달한 `defaultValue`가 됩니다.

#### 주의 사항 {/*context-caveats*/}

* `use`는 컴포넌트나 Hook 내부에서만 호출할 수 있습니다.
* [서버 컴포넌트](/reference/rsc/server-components)에서는 `use`로 Context를 읽을 수 없습니다.

---

### `use(promise)` {/*use-promise*/}

[Promise](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise)의 리졸브된 값을 읽으려면 Promise를 전달해 `use`를 호출하세요. Promise가 대기<sup>Pending</sup> 중인 동안 `use`를 호출하는 컴포넌트는 *일시 중단*<sup>Suspend</sup>됩니다. 이름과 달리 `use`는 Hook이 아닙니다. Hook과 다르게 `if`와 같은 조건문과 반복문 내부에서 호출할 수 있습니다.

```js
import { use } from 'react';

function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  // ...
```

`use`를 호출하는 컴포넌트가 [Suspense](/reference/react/Suspense) 경계로 둘러싸여 있으면 Promise가 대기 중인 동안 Fallback이 표시됩니다. Promise가 리졸브되면 Suspense Fallback은 `use`가 반환한 데이터를 사용해 렌더링된 컴포넌트로 대체됩니다. Promise가 거부되면 가장 가까운 [Error Boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary)의 Fallback이 표시됩니다.

[아래 예시를 참고하세요.](#usage-promises)

#### 매개변수 {/*promise-parameters*/}

* `promise`: 리졸브된 값을 읽으려는 [Promise](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise)입니다. 리렌더링 간에 같은 인스턴스를 재사용할 수 있도록 Promise를 [캐시](#caching-promises-for-client-components)해야 합니다.

#### 반환값 {/*promise-returns*/}

Promise의 리졸브된 값을 반환합니다.

#### 주의 사항 {/*promise-caveats*/}

* `use`는 컴포넌트나 Hook 내부에서만 호출할 수 있습니다.
* `use`는 try-catch 블록 내부에서 호출할 수 없습니다. 대신 컴포넌트를 [Error Boundary](#displaying-an-error-with-an-error-boundary)로 래핑해 오류를 포착하고 Fallback을 표시하세요.
* `use`에 전달하는 Promise는 리렌더링 간에 같은 Promise 인스턴스를 재사용할 수 있도록 캐시해야 합니다. [아래 Promise 캐싱 방법을 참고하세요.](#caching-promises-for-client-components)
* 서버 컴포넌트에서 클라이언트 컴포넌트로 Promise를 전달할 때 리졸브된 값은 [직렬화 가능](/reference/rsc/use-client#serializable-types)해야 합니다.

---

### `use(browser())` {/*use-browser*/}

브라우저에서만 렌더링되어야 하는 컴포넌트에서 [`browser`](/reference/react-dom/browser)가 반환한 값을 전달해 `use`를 호출하세요.

```js
import { use } from 'react';
import { browser } from 'react-dom';

function BrowserOnly() {
  use(browser('This component requires browser APIs.'));
  return <BrowserContent />;
}
```

서버 렌더링 동안 `use(browser())`를 호출하는 컴포넌트는 일시 중단되고, React는 가장 가까운 [`<Suspense>`](/reference/react/Suspense) 경계의 Fallback을 HTML에 포함합니다. 브라우저에서는 `use(browser())`가 `undefined`를 반환하므로 컴포넌트가 정상적으로 렌더링됩니다.

[아래 예시를 참고하세요.](#rendering-a-component-only-in-the-browser)

#### 매개변수 {/*browser-parameters*/}

* `browserValue`: [`browser`](/reference/react-dom/browser)가 반환한 값입니다.

#### 반환값 {/*browser-returns*/}

`use(browser())`는 브라우저에서 `undefined`를 반환합니다.

#### 주의 사항 {/*browser-caveats*/}

* `use(browser())`를 호출하는 컴포넌트는 서버 렌더링 동안 `<Suspense>` 경계 내부에 있어야 합니다. 경계가 없으면 서버 렌더링이 실패합니다.
* React 서버 컴포넌트 앱에서는 `use(browser())`를 [서버 컴포넌트](/reference/rsc/server-components)가 아니라 [클라이언트 컴포넌트](/reference/rsc/use-client)에서 호출해야 합니다.

---

## Context 사용법 {/*usage-context*/}

### `use`를 사용하여 Context 참조하기 {/*reading-context-with-use*/}

[Context](/learn/passing-data-deeply-with-context)가 `use`에 전달되면 [`useContext`](/reference/react/useContext)와 유사하게 작동합니다. `useContext`는 컴포넌트의 최상위 수준에서 호출해야 하지만, `use`는 `if`와 같은 조건문이나 `for`와 같은 반복문 내부에서 호출할 수 있습니다.

```js [[2, 4, "theme"], [1, 4, "ThemeContext"]]
import { use } from 'react';

function Button() {
  const theme = use(ThemeContext);
  // ...
```

`use`는 전달한 <CodeStep step={1}>Context</CodeStep>의 <CodeStep step={2}>Context Value</CodeStep>를 반환합니다. Context 값을 결정하기 위해 React는 컴포넌트 트리를 탐색하고 해당 Context에 대해 **위에서 가장 가까운 Context Provider**를 찾습니다.

Context를 `Button`에 전달하려면 `Button` 또는 상위 컴포넌트 중 하나를 해당 Context Provider로 래핑합니다.

```js [[1, 3, "ThemeContext"], [2, 3, "\\"dark\\""], [1, 5, "ThemeContext"]]
function MyPage() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  );
}

function Form() {
  // ... 버튼 렌더링 ...
}
```

Provider와 `Button` 사이에 얼마나 많은 컴포넌트가 있는지는 중요하지 않습니다. `Form` 내부의 *어느 곳이든* `Button`이 `use(ThemeContext)`를 호출하면 `"dark"`를 값으로 받습니다.

[`useContext`](/reference/react/useContext)와 달리, <CodeStep step={2}>`use`</CodeStep>는 <CodeStep step={1}>`if`</CodeStep>와 같은 조건문과 반복문 내부에서 호출할 수 있습니다.

```js [[1, 2, "if"], [2, 3, "use"]]
function HorizontalRule({ show }) {
  if (show) {
    const theme = use(ThemeContext);
    return <hr className={theme} />;
  }
  return false;
}
```

<CodeStep step={2}>`use`</CodeStep>는 <CodeStep step={1}>`if`</CodeStep> 내부에서 호출되므로 Context에서 조건부로 값을 참조할 수 있습니다.

<Pitfall>

`useContext`와 마찬가지로, `use(context)`는 항상 이를 호출하는 컴포넌트의 **위쪽에서** 가장 가까운 Context Provider를 찾습니다. 위쪽으로 탐색하며, `use(context)`를 호출하는 컴포넌트 내부의 Context Provider는 고려하지 **않습니다**.

</Pitfall>

<Sandpack>

```js
import { createContext, use } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  )
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button show={true}>Sign up</Button>
      <Button show={false}>Log in</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = use(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ show, children }) {
  if (show) {
    const theme = use(ThemeContext);
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {children}
      </button>
    );
  }
  return false
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

### Context에서 Promise 읽기 {/*reading-a-promise-from-context*/}

Prop drilling 없이 비동기 데이터를 공유하려면 Promise를 Context 값으로 설정한 다음 `use(context)`로 읽고 `use(promise)`로 리졸브합니다.

```js
import { use } from 'react';
import { UserContext } from './UserContext';

function Profile() {
  const userPromise = use(UserContext);
  const user = use(userPromise);
  return <h1>{user.name}</h1>;
}
```

`use(context)`는 Context 값 자체를 기다리지 않으므로 값을 읽으려면 `use`를 두 번 호출해야 합니다. Context보다 먼저 고려할 만한 대안은 [Context를 사용하기 전에 고려할 것](/learn/passing-data-deeply-with-context#before-you-use-context)을 참고하세요.

Promise가 대기 중인 동안 해당 서브트리만 일시 중단되도록 Promise를 읽는 컴포넌트를 [Suspense](/reference/react/Suspense) 경계로 래핑하세요. `use`로 Promise를 읽는 방법은 아래 [Promise 사용법](#usage-promises)에서 자세히 알아보세요.

<Pitfall>

이 패턴을 [서버 컴포넌트](/reference/rsc/server-components)와 함께 사용할 때 Promise를 다시 가져오려면 Context에 Promise를 설정하는 서버 컴포넌트를 다시 불러와야 합니다. 트리 상단에서 Context에 Promise를 설정하면 앱의 많은 부분을 불필요하게 다시 불러오게 되므로 피하세요.

</Pitfall>

---

## Promise 사용법 {/*usage-promises*/}

### `use`로 Promise 읽기 {/*reading-a-promise-with-use*/}

리졸브된 값을 읽으려면 Promise를 전달해 `use`를 호출하세요. Promise가 대기 중인 동안 컴포넌트는 [일시 중단](/reference/react/Suspense)됩니다.

```js [[1, 4, "use(albumsPromise)"]]
import { use } from 'react';

function Albums({ albumsPromise }) {
  const albums = use(albumsPromise);
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
```

Promise가 대기 중인 동안 React가 Fallback을 표시할 수 있도록 <CodeStep step={1}>`use`</CodeStep>를 호출하는 컴포넌트를 [Suspense](/reference/react/Suspense) 경계로 래핑하세요. 일시 중단된 컴포넌트 위에 있는 가장 가까운 Suspense 경계가 Fallback을 표시합니다. Promise가 리졸브되면 React는 `use`로 값을 읽고 Fallback을 렌더링된 컴포넌트로 대체합니다.

<Recipes titleText="use로 Promise를 읽는 것과 Effect에서 데이터를 가져오는 것의 차이점" titleId="examples-promise">

#### `use`로 데이터 가져오기 {/*fetching-data-with-use*/}

이 예시에서 `Albums`는 캐시된 Promise를 전달해 `use`를 호출합니다. Promise가 대기 중인 동안 컴포넌트는 일시 중단되고 React는 가장 가까운 Suspense Fallback을 표시합니다. 거부된 Promise는 가장 가까운 [Error Boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary)로 전파됩니다.

<Sandpack>

```js src/App.js active
import { use, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { fetchData } from './data.js';

export default function App() {
  return (
    <ErrorBoundary fallback={<p>Could not fetch albums.</p>}>
      <Suspense fallback={<Loading />}>
        <Albums />
      </Suspense>
    </ErrorBoundary>
  );
}

function Albums() {
  const albums = use(fetchData('/albums'));
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

function Loading() {
  return <h2>Loading...</h2>;
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
  if (url === '/albums') {
    return await getAlbums();
  } else {
    throw Error('Not implemented');
  }
}

async function getAlbums() {
  // 대기 시간을 눈에 띄게 만들기 위해 가짜 지연을 추가합니다.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
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
  }];
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```

</Sandpack>

<Solution />

#### `useEffect`로 데이터 가져오기 {/*fetching-data-with-useeffect*/}

`use`가 나오기 전에는 Effect에서 데이터를 가져오고 데이터가 도착하면 state를 업데이트하는 방식을 흔히 사용했습니다. `use`와 비교하면 이 방식은 로딩 상태와 오류 상태를 직접 관리해야 합니다. Effect에서 데이터를 가져오는 방식을 권장하지 않는 이유는 [Effect가 필요하지 않은 경우](/learn/you-might-not-need-an-effect#fetching-data)에서 자세히 알아보세요.

<Sandpack>

```js src/App.js active
import { useState, useEffect } from 'react';
import { fetchAlbums } from './data.js';

export default function App() {
  const [albums, setAlbums] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAlbums()
      .then(data => {
        setAlbums(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

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
```

```js src/data.js hidden
export async function fetchAlbums() {
  // 대기 시간을 눈에 띄게 만들기 위해 가짜 지연을 추가합니다.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
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
  }];
}
```

</Sandpack>

<Solution />

</Recipes>

<Pitfall>

##### `use`에 전달하는 Promise는 캐시해야 합니다 {/*promises-must-cached*/}

렌더링 중에 생성한 Promise는 렌더링할 때마다 다시 생성되므로 React가 Suspense Fallback을 반복해서 표시하고 콘텐츠가 나타나지 않습니다.

```js
function Albums() {
  // 🔴 `fetch`는 렌더링할 때마다 새로운 Promise를 생성합니다.
  const albums = use(fetch('/albums'));
  // ...
}
```

대신 캐시, [Suspense를 지원하는 프레임워크](/reference/react/Suspense#suspense-enabled-frameworks) 또는 서버 컴포넌트에서 받은 Promise를 전달하세요.

```js
// ✅ fetchData는 캐시에서 Promise를 읽습니다.
const albums = use(fetchData('/albums'));
```

</Pitfall>

<DeepDive>

#### 왜 Promise는 렌더링할 때마다 다시 생성되나요? {/*why-promises-recreated*/}

[React는 마운트되기 전에 일시 중단된 렌더링의 state를 보존하지 않습니다](/reference/react/Suspense#caveats). 일시 중단될 때마다 React는 처음부터 다시 렌더링을 시도하므로 렌더링 중에 생성한 Promise는 모두 다시 생성됩니다.

다음은 렌더링 중에 Promise가 의도치 않게 다시 생성되는 흔한 경우입니다.

```js
function Albums() {
  // 🔴 `fetch`는 렌더링할 때마다 새로운 Promise를 생성합니다.
  const albums = use(fetch('/albums'));

  // 🔴 캐시되지 않은 `async` 함수를 호출하면 렌더링할 때마다 새로운 Promise가 생성됩니다.
  const albums = use((async () => {
    const res = await fetch('/albums');
    return res.json();
  })());

  // 🔴 `.then`을 붙이면 `fetchData`가 캐시되어 있더라도
  // 렌더링할 때마다 새로운 Promise가 반환됩니다.
  const albums = use(fetchData('/albums').then(res => res.json()));
  // ...
}
```

이상적으로는 이벤트 핸들러, 라우트 로더, 서버 컴포넌트 같은 곳에서 렌더링 전에 Promise를 생성하고 `use`를 호출하는 컴포넌트에 전달합니다. 렌더링할 때가 되어서야 데이터를 가져오면 네트워크 요청이 늦어지고 워터폴<sup>Waterfall</sup>이 생길 수 있습니다.

```js
// ✅ fetchData는 캐시에서 Promise를 읽습니다.
const albums = use(fetchData('/albums'));
```

</DeepDive>

---

### 클라이언트 컴포넌트에서 Promise 캐싱하기 {/*caching-promises-for-client-components*/}

클라이언트 컴포넌트에서 `use`에 전달하는 Promise는 리렌더링 간에 같은 Promise 인스턴스를 재사용할 수 있도록 캐시해야 합니다. 렌더링 중에 새로운 Promise를 직접 생성하면 React는 리렌더링할 때마다 Suspense Fallback을 표시합니다.

```js
// ✅ 렌더링 간에 같은 Promise를 재사용하도록 Promise를 캐시합니다
let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}
```

`fetchData` 함수는 같은 URL로 호출될 때마다 같은 Promise를 반환합니다. 리렌더링 시 `use`가 같은 Promise를 받으면 일시 중단하지 않고 이미 리졸브된 값을 동기적으로 읽습니다.

<Note>

Promise를 캐시하는 방법은 Suspense와 함께 사용하는 프레임워크에 따라 다릅니다. 프레임워크는 일반적으로 캐싱 메커니즘을 내장하고 있습니다. 프레임워크를 사용하지 않는다면 위와 같은 간단한 모듈 수준 캐시나 [Suspense를 지원하는 데이터 소스](/reference/react/Suspense#what-activates-a-suspense-boundary)를 사용할 수 있습니다.

</Note>

아래 예시에서 "Re-render"를 클릭하면 `App`의 state가 업데이트되어 리렌더링이 발생합니다. `fetchData`가 캐시된 같은 Promise를 반환하므로 `Albums`는 Suspense Fallback을 다시 표시하지 않고 값을 동기적으로 읽습니다.

<Sandpack>

```js src/App.js active
import { use, Suspense, useState } from 'react';
import { fetchData } from './data.js';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(count + 1)}>
        Re-render
      </button>
      <p>Render count: {count}</p>
      <Suspense fallback={<p>Loading...</p>}>
        <Albums />
      </Suspense>
    </>
  );
}

function Albums() {
  const albums = use(fetchData('/albums'));
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
  if (url === '/albums') {
    return await getAlbums();
  } else {
    throw Error('Not implemented');
  }
}

async function getAlbums() {
  // 대기 시간을 눈에 띄게 만들기 위해 가짜 지연을 추가합니다.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
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
  }];
}
```

</Sandpack>

<DeepDive>

#### Promise 캐시를 구현하는 방법 {/*how-to-implement-a-promise-cache*/}

기본적인 캐시는 렌더링 간에 같은 인스턴스를 재사용할 수 있도록 URL을 키로 Promise를 저장합니다. 데이터가 이미 준비되어 있을 때 불필요한 Suspense Fallback도 피하려면 Promise에 `status`와 `value`(또는 `reason`) 필드를 설정할 수 있습니다. React는 `use`가 호출될 때 이 필드를 확인합니다. `status`가 `'fulfilled'`이면 일시 중단하지 않고 `value`를 동기적으로 읽습니다. `status`가 `'rejected'`이면 `reason`을 던집니다. 필드가 없거나 `'pending'`이면 일시 중단합니다.

```js
let cache = new Map();

function fetchData(url) {
  if (!cache.has(url)) {
    const promise = getData(url);
    promise.status = 'pending';
    promise.then(
      value => {
        promise.status = 'fulfilled';
        promise.value = value;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    cache.set(url, promise);
  }
  return cache.get(url);
}
```

이 방식은 주로 Suspense와 호환되는 데이터 레이어를 만드는 라이브러리 작성자에게 유용합니다. `status` 필드가 없는 Promise에는 React가 자체적으로 필드를 설정하지만, 직접 설정하면 데이터가 이미 준비되어 있을 때 추가 렌더링을 피할 수 있습니다.

이 캐시 패턴은 [데이터 다시 가져오기](#re-fetching-data-in-client-components)와 [호버 시 데이터 미리 불러오기](#preloading-data-on-hover)의 기반이 됩니다. 다시 가져오기에서는 캐시 키를 바꾸면 데이터를 새로 가져오고, 미리 불러오기에서는 `fetchData`를 일찍 호출하므로 `use`가 읽을 때쯤 Promise가 이미 리졸브되어 있을 수 있습니다.

</DeepDive>

<Pitfall>

##### Promise가 이미 처리<sup>Settled</sup>되었는지에 따라 `use` 호출을 건너뛰지 마세요. {/*conditional-use*/}

다른 Hook과 달리 `use`는 조건문과 반복문 내부에서 호출할 수 있지만, Promise는 항상 `use`로 읽어야 합니다. `use`를 우회하려고 `promise.status`나 `promise.value`를 절대 직접 읽지 마세요. 항상 Promise를 `use`에 전달하고 React가 처리하도록 하세요.


```js
// 🔴 Promise 상태를 직접 읽어 `use`를 우회하지 마세요
if (promise.status === 'fulfilled') {
  return promise.value;
}
const value = use(promise);
```

```js
// ✅ Promise를 `use`에 전달해 React가 Promise를 추적하도록 합니다
const value = use(promise);
```

이런 식으로 `use`를 우회하면 React의 Suspense 최적화와 React DevTools의 Suspense 기능이 깨질 수 있습니다. `use(promise)`를 조건부로 호출할 수는 있지만, Promise 자체를 기준으로 `use(promise)` 호출 여부를 정하지는 마세요.

</Pitfall>

---

### 클라이언트 컴포넌트에서 데이터 다시 가져오기 {/*re-fetching-data-in-client-components*/}

같은 URL의 데이터를 새로 고치려면(예를 들어 "Refresh" 버튼으로) [`startTransition`](/reference/react/startTransition) 내부에서 캐시 항목을 무효화하고 데이터를 다시 가져오세요. 반환된 Promise를 state에 저장해 리렌더링을 일으키세요. 업데이트가 Transition 내부에 있으므로 새로운 Promise가 대기 중인 동안 React는 기존 콘텐츠를 계속 표시합니다.

```js
function App() {
  const [albumsPromise, setAlbumsPromise] = useState(fetchData('/albums'));
  const [isPending, startTransition] = useTransition();

  function handleRefresh() {
    startTransition(() => {
      setAlbumsPromise(refetchData('/albums'));
    });
  }
  // ...
}
```

`refetchData`는 이전 캐시 항목을 지우고 같은 URL에서 데이터를 새로 가져오기 시작합니다. 반환된 Promise를 state에 저장하면 Transition 내부에서 리렌더링이 발생합니다. 리렌더링되면 `Albums`가 새로운 Promise를 받습니다. `use`는 이 Promise를 기다리며 일시 중단되고, 그동안 React는 이전 콘텐츠를 계속 표시합니다.

<Sandpack>

```js src/App.js active
import { Suspense, useState, useTransition } from 'react';
import { use } from 'react';
import { fetchData, refetchData } from './data.js';

export default function App() {
  const [albumsPromise, setAlbumsPromise] = useState(
    () => fetchData('/the-beatles/albums')
  );
  const [isPending, startTransition] = useTransition();

  function handleRefresh() {
    startTransition(() => {
      setAlbumsPromise(refetchData('/the-beatles/albums'));
    });
  }

  return (
    <>
      <button
        onClick={handleRefresh}
        disabled={isPending}
      >
        {isPending ? 'Refreshing...' : 'Refresh'}
      </button>
      <div style={{ opacity: isPending ? 0.6 : 1 }}>
        <Suspense fallback={<Loading />}>
          <Albums albumsPromise={albumsPromise} />
        </Suspense>
      </div>
    </>
  );
}

function Albums({ albumsPromise }) {
  const albums = use(albumsPromise);
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

function Loading() {
  return <h2>Loading...</h2>;
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

export function refetchData(url) {
  cache.delete(url);
  return fetchData(url);
}

async function getData(url) {
  if (url.startsWith('/the-beatles/albums')) {
    return await getAlbums();
  } else {
    throw Error('Not implemented');
  }
}

async function getAlbums() {
  // 대기 시간을 눈에 띄게 만들기 위해 가짜 지연을 추가합니다.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
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
  }];
}
```

```css
button { margin-bottom: 10px; }
```

</Sandpack>

<Note>

Suspense를 지원하는 프레임워크는 일반적으로 자체 캐싱 및 무효화 메커니즘을 제공합니다. 위의 커스텀 캐시는 패턴을 이해하는 데 유용하지만, 실제로는 프레임워크의 데이터 가져오기 솔루션을 사용하는 것이 좋습니다.

</Note>

---

### 호버 시 데이터 미리 불러오기 {/*preloading-data-on-hover*/}

호버 이벤트가 발생할 때 `fetchData`를 호출하면 데이터가 필요해지기 전에 미리 불러오기 시작할 수 있습니다. `fetchData`는 Promise를 캐시하므로 사용자가 클릭할 때쯤에는 데이터가 이미 준비되어 있을 수 있습니다. `use`가 Promise를 읽을 때 이미 리졸브되어 있다면 React는 Suspense Fallback을 표시하지 않고 컴포넌트를 즉시 렌더링합니다.

```js
<button
  onMouseEnter={() => fetchData(`/${id}/albums`)}
  onClick={() => {
    startTransition(() => {
      setArtistId(id);
    });
  }}
>
```

이 예시에서는 아티스트 버튼에 마우스를 올리면 백그라운드에서 해당 아티스트의 앨범을 가져오기 시작합니다. 먼저 마우스를 올리지 않고 클릭하면 로딩 Fallback이 표시됩니다. 클릭하기 전에 버튼에 잠시 마우스를 올려 두고 차이를 확인해 보세요.

<Sandpack>

```js src/App.js active
import { Suspense, useState, useTransition } from 'react';
import Albums from './Albums.js';
import { fetchData } from './data.js';

export default function App() {
  const [artistId, setArtistId] = useState('the-beatles');
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <div>
        {['the-beatles', 'led-zeppelin', 'pink-floyd'].map(id => (
          <button
            key={id}
            onMouseEnter={() => {
              fetchData(`/${id}/albums`);
            }}
            onClick={() => {
              startTransition(() => {
                setArtistId(id);
              });
            }}
          >
            {id === 'the-beatles' ? 'The Beatles' :
             id === 'led-zeppelin' ? 'Led Zeppelin' :
             'Pink Floyd'}
          </button>
        ))}
      </div>
      <Suspense key={artistId} fallback={<Loading />}>
        <Albums artistId={artistId} />
      </Suspense>
    </>
  );
}

function Loading() {
  return <h2>Loading...</h2>;
}
```

```js src/Albums.js
import { use } from 'react';
import { fetchData } from './data.js';

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
```

```js src/data.js hidden
// Note: 데이터 페칭 방법은
// Suspense와 함께 사용하는 프레임워크에 따라 달라집니다.
// 일반적으로 캐싱 로직은 프레임워크 내부에 있습니다.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    const promise = getData(url);
    // `use`가 호출되기 전에 Promise가 리졸브된 경우(예: 호버 시 미리 불러올 때)
    // React가 값을 동기적으로 읽을 수 있도록
    // status 필드를 설정합니다.
    promise.status = 'pending';
    promise.then(
      value => {
        promise.status = 'fulfilled';
        promise.value = value;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    cache.set(url, promise);
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/the-beatles/albums')) {
    return await getAlbums('the-beatles');
  } else if (url.startsWith('/led-zeppelin/albums')) {
    return await getAlbums('led-zeppelin');
  } else if (url.startsWith('/pink-floyd/albums')) {
    return await getAlbums('pink-floyd');
  } else {
    throw Error('Not implemented');
  }
}

async function getAlbums(artistId) {
  // 대기 시간을 눈에 띄게 만들기 위해 가짜 지연을 추가합니다.
  await new Promise(resolve => {
    setTimeout(resolve, 800);
  });

  if (artistId === 'the-beatles') {
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
    }];
  } else if (artistId === 'led-zeppelin') {
    return [{
      id: 10,
      title: 'Coda',
      year: 1982
    }, {
      id: 9,
      title: 'In Through the Out Door',
      year: 1979
    }, {
      id: 8,
      title: 'Presence',
      year: 1976
    }];
  } else {
    return [{
      id: 7,
      title: 'The Wall',
      year: 1979
    }, {
      id: 6,
      title: 'Animals',
      year: 1977
    }, {
      id: 5,
      title: 'Wish You Were Here',
      year: 1975
    }];
  }
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

---

### 서버에서 클라이언트로 데이터 스트리밍하기 {/*streaming-data-from-server-to-client*/}

서버 컴포넌트에서 클라이언트 컴포넌트로 Promise를 Prop으로 전달하면 서버에서 클라이언트로 데이터를 스트리밍할 수 있습니다.

```js
import { fetchMessage } from './lib.js';
import { Message } from './message.js';

export default function App() {
  const messagePromise = fetchMessage();
  return (
    <Suspense fallback={<p>waiting for message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

그러면 클라이언트 컴포넌트는 Prop으로 받은 Promise를 `use` API에 전달합니다. 이렇게 하면 클라이언트 컴포넌트는 서버 컴포넌트가 처음 생성한 Promise의 값을 읽을 수 있습니다.

```js
// message.js
'use client';

import { use } from 'react';

export function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Here is the message: {messageContent}</p>;
}
```
`Message`는 [Suspense](/reference/react/Suspense) 경계로 래핑되어 있으므로 Promise가 리졸브될 때까지 Fallback이 표시됩니다. Promise가 리졸브되면 `use` API가 값을 읽고 `Message` 컴포넌트가 Suspense Fallback을 대체합니다.

<Sandpack>

```js src/message.js active
"use client";

import { use, Suspense } from "react";

function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Here is the message: {messageContent}</p>;
}

export function MessageContainer({ messagePromise }) {
  return (
    <Suspense fallback={<p>⌛Downloading message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

```js src/App.js hidden
import { useState } from "react";
import { MessageContainer } from "./message.js";

function fetchMessage() {
  return new Promise((resolve) => setTimeout(resolve, 1000, "⚛️"));
}

export default function App() {
  const [messagePromise, setMessagePromise] = useState(null);
  const [show, setShow] = useState(false);
  function download() {
    setMessagePromise(fetchMessage());
    setShow(true);
  }

  if (show) {
    return <MessageContainer messagePromise={messagePromise} />;
  } else {
    return <button onClick={download}>Download message</button>;
  }
}
```

```js src/index.js hidden
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

// TODO: Codesandbox 서버 컴포넌트 데모 환경이
// 만들어지면 그 환경을 사용하도록
// 이 예시를 업데이트합니다
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

</Sandpack>

<DeepDive>

#### Promise를 서버 컴포넌트에서 처리해야 하나요, 아니면 클라이언트 컴포넌트에서 처리해야 하나요? {/*resolve-promise-in-server-or-client-component*/}

Promise가 있다면 언젠가는 값을 읽기 위해 Promise를 언래핑해야 합니다. 서버 컴포넌트에서는 `await`으로, 클라이언트 컴포넌트에서는 `use`로 Promise를 언래핑합니다.

보통 가장 간단한 방법은 Promise를 생성한 곳에서 `await`하는 것입니다. 데이터가 준비될 때까지 서버 컴포넌트가 일시 중단되고, 그 아래에 있는 모든 것도 함께 기다립니다.

```js
// 서버 컴포넌트
export default async function App() {
  const messageContent = await fetchMessage();
  return <Message messageContent={messageContent} />;
}
```

하지만 바로 언래핑할 필요는 없습니다. Promise를 Prop으로 전달해 트리의 더 깊은 곳에서 언래핑할 수도 있습니다. Promise를 읽는 컴포넌트는 여전히 일시 중단되지만, 트리에서 그 부분만 데이터를 기다립니다. 그 컴포넌트를 [`<Suspense>`](/reference/react/Suspense) 경계로 래핑하면 페이지의 나머지 부분이 즉시 렌더링되는 동안 Fallback을 표시할 수 있습니다.

예를 들어 더 깊은 곳에 있는 서버 컴포넌트는 전달받은 Promise를 `await`할 수 있습니다.

```js
import { Suspense } from 'react';

// 서버 컴포넌트
export default function App() {
  const messagePromise = fetchMessage();
  return (
    <Suspense fallback={<p>⌛Downloading message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}

// 서버 컴포넌트
async function Message({ messagePromise }) {
  const messageContent = await messagePromise;
  return <p>{messageContent}</p>;
}
```

또는 별도의 파일에서 클라이언트 컴포넌트가 같은 Promise를 `use`로 언래핑할 수도 있습니다.

```js
// 클라이언트 컴포넌트
'use client';

import { use } from 'react';

export function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>{messageContent}</p>;
}
```

Promise를 아래로 전달하는 방식은 두 경우 모두 똑같이 동작합니다. 어느 쪽이든 Promise를 읽는 곳에서 일시 중단되고, 그 위에 있는 UI는 차단하지 않습니다. 유일한 차이는 클라이언트 컴포넌트는 렌더링 중에 `await`할 수 없으므로 대신 `use`로 Promise를 언래핑한다는 점입니다. 흔한 예로는 마우스를 올리거나 클릭한 뒤에야 데이터가 필요한 팝오버나 툴팁 같은 상호작용 콘텐츠가 있습니다.

Suspense 경계를 어디에 배치할지는 [콘텐츠를 한꺼번에 함께 보여주기](/reference/react/Suspense#revealing-content-together-at-once)를 참고하세요.

</DeepDive>

---

### Error Boundary를 사용하여 오류 표시하기 {/*displaying-an-error-with-an-error-boundary*/}

`use`에 전달한 Promise가 거부되면 오류는 가장 가까운 [Error Boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary)로 전파됩니다. Promise가 거부될 때 Fallback을 표시하려면 `use`를 호출하는 컴포넌트를 Error Boundary로 래핑하세요.

아래 예시에서 `fetchData`는 첫 번째 시도에서는 거부되고 다시 시도하면 성공합니다. Error Boundary는 이 오류를 포착하고 "Try again" 버튼이 있는 Fallback을 표시합니다.

<Sandpack>

```js src/App.js active
import { use, Suspense, useState, startTransition } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { fetchData, refetchData } from "./data.js";

export default function App() {
  const [albumsPromise, setAlbumsPromise] = useState(
    () => fetchData('/the-beatles/albums')
  );

  function handleRetry() {
    startTransition(() => {
      setAlbumsPromise(refetchData('/the-beatles/albums'));
    });
  }

  return (
    <ErrorBoundary
      resetKeys={[albumsPromise]}
      fallbackRender={() => (
        <>
          <p>⚠️ Something went wrong loading the albums.</p>
          <button onClick={handleRetry}>Try again</button>
        </>
      )}
    >
      <Suspense fallback={<p>Loading...</p>}>
        <Albums albumsPromise={albumsPromise} />
      </Suspense>
    </ErrorBoundary>
  );
}

function Albums({ albumsPromise }) {
  const albums = use(albumsPromise);
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
```

```js src/data.js hidden
// Note: 데이터 페칭 방법은
// Suspense와 함께 사용하는 프레임워크에 따라 달라집니다.
// 일반적으로 캐싱 로직은 프레임워크 내부에 있습니다.

let cache = new Map();
let retried = false;

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

export function refetchData(url) {
  cache.delete(url);
  retried = true;
  return fetchData(url);
}

async function getData(url) {
  // 로딩 상태가 보이도록 가짜 지연을 추가합니다.
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (url === '/the-beatles/albums') {
    // Error Boundary를 보여주기 위해 첫 번째 시도는 실패시키고,
    // 다시 시도하면 성공합니다.
    if (!retried) {
      throw new Error('Example Error: Failed to fetch albums');
    }
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
    }];
  }
  throw new Error('Not implemented');
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```
</Sandpack>

---

## 브라우저 사용법 {/*usage-browser*/}

### 브라우저에서만 컴포넌트 렌더링하기 {/*rendering-a-component-only-in-the-browser*/}

브라우저에서만 렌더링되어야 하는 컴포넌트 안에서 [`browser`](/reference/react-dom/browser)가 반환한 값을 `use`에 전달하세요.

초기 HTML에서 로딩 Fallback을 보려면 **새로고침**을 클릭하세요. 하이드레이션 이후 React는 `localStorage`에서 불러온 초안을 표시합니다.

<Sandpack>

```js src/App.js active
import { Suspense, use, useState } from 'react';
import { browser } from 'react-dom';

function SavedDraft() {
  use(browser('The draft is stored in localStorage.'));
  const [draft, setDraft] = useState(
    () => localStorage.getItem('draft') ?? ''
  );

  function handleChange(event) {
    const nextDraft = event.target.value;
    setDraft(nextDraft);
    localStorage.setItem('draft', nextDraft);
  }

  return (
    <label>
      Draft:
      <textarea
        value={draft}
        onChange={handleChange}
        rows={4}
        cols={30}
      />
    </label>
  );
}

export default function App() {
  return (
    <>
      <h1>Saved draft</h1>
      <Suspense fallback={<p>Loading draft...</p>}>
        <SavedDraft />
      </Suspense>
    </>
  );
}
```

```js src/Document.js hidden
import App from './App.js';

export default function Document() {
  return (
    <html lang="en">
      <head>
        <title>Saved draft</title>
        <style>{`
          h1 { font-size: 24px; margin-top: 0; }
          label, textarea { display: block; }
          textarea { margin-top: 5px; }
        `}</style>
      </head>
      <body>
        <App />
      </body>
    </html>
  );
}
```

```js src/index.js hidden
import { hydrateRoot } from 'react-dom/client';
import { renderToReadableStream } from 'react-dom/server';
import Document from './Document.js';
import { flushReadableStreamToFrame } from './demo-helpers.js';
import './styles.css';

async function main(frame) {
  const stream = await renderToReadableStream(<Document />);
  await flushReadableStreamToFrame(stream, frame);

  // Fallback과 하이드레이션된 콘텐츠가 모두 보이도록 대기합니다.
  await new Promise(resolve => setTimeout(resolve, 1200));
  hydrateRoot(frame.contentDocument, <Document />);
}

main(document.getElementById('preview'));
```

```js src/demo-helpers.js hidden
export async function flushReadableStreamToFrame(readable, frame) {
  const doc = frame.contentWindow.document;
  const decoder = new TextDecoder();
  const reader = readable.getReader();

  while (true) {
    const {done, value} = await reader.read();
    if (done) {
      break;
    }
    doc.write(decoder.decode(value, {stream: true}));
  }

  doc.write(decoder.decode());
  doc.close();
}
```

```html public/index.html hidden
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Browser-only rendering</title>
</head>
<body>
  <iframe id="preview" title="Rendered page"></iframe>
</body>
</html>
```

```css src/styles.css hidden
iframe {
  width: 100%;
  height: 160px;
  border: 0;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
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

서버 렌더링 동안 `use(browser())`는 컴포넌트를 일시 중단하고, React는 가장 가까운 Suspense 경계의 Fallback을 HTML에 포함합니다. 브라우저에서는 `use(browser())`가 `undefined`를 반환하고 저장된 초안이 정상적으로 렌더링됩니다.

---

## 문제 해결 {/*troubleshooting*/}

### "Suspense Exception: This is not a real error!" 오류가 발생합니다 {/*suspense-exception-error*/}

try-catch 블록 내부에서 `use`를 호출하고 있는 경우입니다. `use`는 Suspense와 연동하기 위해 내부적으로 예외를 던지므로 try-catch로 감쌀 수 없습니다. 대신 `use`를 호출하는 컴포넌트를 [Error Boundary](#displaying-an-error-with-an-error-boundary)로 래핑해 오류를 처리하세요.

```jsx
function Albums({ albumsPromise }) {
  try {
    // ❌ `use`를 try-catch로 감싸지 마세요
    const albums = use(albumsPromise);
  } catch (e) {
    return <p>Error</p>;
  }
  // ...
```

대신 컴포넌트를 Error Boundary로 래핑하세요.

```jsx
function Albums({ albumsPromise }) {
  // ✅ try-catch 없이 `use`를 호출합니다
  const albums = use(albumsPromise);
  // ...
```

```jsx
// ✅ Error Boundary를 사용해 오류를 처리합니다
<ErrorBoundary fallback={<p>Error</p>}>
  <Albums albumsPromise={albumsPromise} />
</ErrorBoundary>
```

---

### "A component was suspended by an uncached promise" 경고가 표시됩니다 {/*uncached-promise-error*/}

`use`에 전달한 Promise가 캐시되지 않아 React가 리렌더링 간에 재사용할 수 없는 경우입니다.

이 문제는 렌더링 중에 `fetch`나 `async` 함수를 직접 호출할 때 흔히 발생합니다.

```js
function Albums() {
  // 🔴 렌더링할 때마다 새로운 Promise를 생성합니다
  const albums = use(fetch('/albums'));
  // ...
}
```

이를 해결하려면 같은 인스턴스가 재사용되도록 Promise를 캐시하세요.

```js
// ✅ fetchData는 같은 URL에 대해 같은 Promise를 반환합니다
const albums = use(fetchData('/albums'));
```

자세한 내용은 [클라이언트 컴포넌트에서 Promise 캐싱하기](#caching-promises-for-client-components)를 참고하세요.
