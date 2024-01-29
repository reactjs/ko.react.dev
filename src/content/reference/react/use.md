---
title: use
canary: true
---

<Canary>

`use` Hook은 현재 React의 Canary 채널과 실험 채널에서만 사용할 수 있습니다. 자세한 내용은 [React 릴리즈 채널](https://ko.react.dev/community/versioning-policy#all-release-channels)에서 확인할 수 있습니다.

</Canary>

<Intro>

`use`는 [Promise](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise)나 [context](https://ko.react.dev/learn/passing-data-deeply-with-context)와 같은 데이터를 참조하는 React Hook입니다.


```js
const value = use(resource);
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `use(resource)` {/*use*/}

컴포넌트에서 [Promise](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise)나 [context](https://ko.react.dev/learn/passing-data-deeply-with-context)와 같은 데이터를 참조하려면 `use`를 사용합니다.


```jsx
import { use } from 'react';

function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  // ...
```

다른 React Hook과 달리 `use`는 `if`와 같은 조건문과 반복문 내부에서 호출할 수 있습니다.
다른 React Hook과 같이 `use`는 컴포넌트 또는 Hook에서만 호출할 수 있습니다.

Promise와 함께 호출될 때 `use` Hook은 [Suspense](https://ko.react.dev/reference/react/Suspense) 및 [error boundary](https://ko.react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)와 통합됩니다.
`use`에 전달된 Promise가 보류되는 동안 `use`를 호출하는 컴포넌트는 *일시 중단*됩니다.
`use`를 호출하는 컴포넌트가 Suspense 경계로 둘러싸여 있으면 fallback이 표시됩니다.
Promise가 리졸브되면 Suspense fallback은 `use` Hook이 반환한 컴포넌트로 대체됩니다.
`use`에 전달된 Promise가 거부되면 가장 가까운 Error Boundary의 fallback이 표시됩니다.

[사용법 확인하기](#usage)

#### 매개변수 {/*parameters*/}

* `resource`: 참조하려는 데이터입니다. 데이터는 [Promise](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise)나 [context](https://ko.react.dev/learn/passing-data-deeply-with-context)일 수 있습니다.

#### 반환값 {/*returns*/}

`use` Hook은 [Promise](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise)나 [context](https://ko.react.dev/learn/passing-data-deeply-with-context)에서 참조한 값을 반환합니다.


#### 주의 사항 {/*caveats*/}

* `use` Hook은 컴포넌트나 Hook 내부에서 호출되어야 합니다.
* [서버 컴포넌트](https://ko.react.dev/reference/react/use-server)에서 데이터를 fetch 할 때는 `use`보다 `async` 및 `await`를 사용합니다.
* `async` 및 `await`은 `await`이 호출된 시점부터 렌더링을 시작하는 반면 `use`는 데이터가 리졸브된 후 컴포넌트를 리렌더링합니다.
* [클라이언트 컴포넌트](https://ko.react.dev/reference/react/use-client)에서 Promise를 생성하는 것보다 [서버 컴포넌트](https://ko.react.dev/reference/react/use-server)에서 Promise를 생성하여 클라이언트 컴포넌트에 전달하는 것이 좋습니다. 클라이언트 컴포넌트에서 생성된 Promise는 렌더링할 때마다 다시 생성됩니다. 서버 컴포넌트에서 클라이언트 컴포넌트로 전달된 Promise는 리렌더링 전반에 걸쳐 안정적입니다. [예시 확인하기](#streaming-data-from-server-to-client).


---

## 사용법 {/*usage*/}

### `use`를 사용하여 context 참조하기 {/*reading-context-with-use*/}

[context](https://ko.react.dev/learn/passing-data-deeply-with-context)가 `use`에 전달되면 [`useContext`](https://ko.react.dev/reference/react/useContext)와 유사하게 작동합니다. `useContext`는 컴포넌트의 최상위 수준에서 호출해야 하지만 `use`는 `if`와 같은 조건문이나 `for`과 같은 반복문 내부에서 호출할 수 있습니다. `use`는 유연하므로 `useContext`보다 선호됩니다.

```js [[2, 4, "theme"], [1, 4, "ThemeContext"]]
import { use } from 'react';

function Button() {
  const theme = use(ThemeContext);
  // ... 
```

`use`는 전달한 <CodeStep step={1}>context</CodeStep>의 <CodeStep step={2}>context 값</CodeStep>을 반환합니다. context 값을 결정하기 위해 React는 컴포넌트 트리를 검색하고 **위에서 가장 가까운 context provider**를 찾습니다.

context를 `Button`에 전달하려면 `Button` 또는 상위 컴포넌트 중 하나를 context provider로 래핑합니다.

```js [[1, 3, "ThemeContext"], [2, 3, "\\"dark\\""], [1, 5, "ThemeContext"]]
function MyPage() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  );
}

function Form() {
  // ... 버튼 렌더링 ...
}
```

provider와 `Button` 사이에 얼마나 많은 컴포넌트가 있는지는 중요하지 않습니다. `Form` 내부의 *어느 곳이든* `Button`이 `use(ThemeContext)`를 호출하면 `"dark"`를 값으로 받습니다

[`useContext`](https://ko.react.dev/reference/react/useContext)와 달리 <CodeStep step={2}>`use`</CodeStep>는 <CodeStep step={1}>`if`</CodeStep>와 같은 조건문과 반복문 내부에서 호출할 수 있습니다.


```js [[1, 2, "if"], [2, 3, "use"]]
function HorizontalRule({ show }) {
  if (show) {
    const theme = use(ThemeContext);
    return <hr className={theme} />;
  }
  return false;
}
```

<CodeStep step={2}>`use`</CodeStep>는 <CodeStep step={1}>`if`</CodeStep> 내부에서 호출되므로 context에서 조건부로 값을 참조할 수 있습니다.


<Pitfall>

`useContext`와 마찬가지로 `use(context)`는 호출 컴포넌트의 **위에서** 가장 가까운 context provider를 찾습니다. 위쪽으로 검색하며 `use(context)`를 호출 컴포넌트 내부의 context provider는 고려하지 **않습니다**.

</Pitfall>

<Sandpack>

```js
import { createContext, use } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
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

```json package.json hidden
{
  "dependencies": {
    "react": "18.3.0-canary-9377e1010-20230712",
    "react-dom": "18.3.0-canary-9377e1010-20230712",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js"
}
```

</Sandpack>

### 서버에서 클라이언트로 데이터 스트리밍하기 {/*streaming-data-from-server-to-client*/}

<CodeStep step={1}>서버 컴포넌트</CodeStep>에서 <CodeStep step={2}>클라이언트 컴포넌트</CodeStep>로 Promise prop을 전달하여 서버에서 클라이언트로 데이터를 스트리밍할 수 있습니다.

```js [[1, 4, "App"], [2, 2, "Message"], [3, 7, "Suspense"], [4, 8, "messagePromise", 30], [4, 5, "messagePromise"]]
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

<CodeStep step={2}>클라이언트 컴포넌트</CodeStep>는 <CodeStep step={4}>prop으로 받은 Promise</CodeStep>를 <CodeStep step={5}>`use`</CodeStep> Hook에 전달합니다.
<CodeStep step={2}>Client Component</CodeStep>는 서버 컴포넌트가 처음에 생성한 <CodeStep step={4}>Promise</CodeStep>에서 값을 읽을 수 있습니다.

```js [[2, 6, "Message"], [4, 6, "messagePromise"], [4, 7, "messagePromise"], [5, 7, "use"]]
// message.js
'use client';

import { use } from 'react';

export function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Here is the message: {messageContent}</p>;
}
```

<CodeStep step={2}>`Message`</CodeStep>는 <CodeStep step={3}>[`Suspense`](https://ko.react.dev/reference/react/Suspense)</CodeStep>로 래핑되어 있으므로 Promise가 리졸브될 때까지 fallback이 표시됩니다. Promise가 리졸브되면 <CodeStep step={5}>`use`</CodeStep> Hook이 값을 참조하고 <CodeStep step={2}>`Message`</CodeStep> 컴포넌트가 Suspense fallback을 대체합니다.

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
// TODO: `use` Hook이 안정적으로 릴리즈되면 canary 대신 안정적인 React에서 가져올 수 있도록 업데이트
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

// TODO: 이 예제를 업데이트하여 작성한 후 Codesandbox Server Component 데모 환경을 사용합니다
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "18.3.0-canary-9377e1010-20230712",
    "react-dom": "18.3.0-canary-9377e1010-20230712",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js"
}
```
</Sandpack>

<Note>

서버 컴포넌트에서 클라이언트 컴포넌트로 Promise를 전달할 때 리졸브된 값이 직렬화 가능해야 합니다. 함수는 직렬화할 수 없으므로 Promise의 리졸브 값이 될 수 없습니다.

</Note>


<DeepDive>

#### 서버 또는 클라이언트 컴포넌트에서 프로미스를 리졸브해만 하나요? {/*resolve-promise-in-server-or-client-component*/}

Promise는 서버 컴포넌트에서 클라이언트 컴포넌트로 전달될 수 있으며 `use` Hook을 통해 클라이언트 컴포넌트에서 리졸브됩니다. 또한 서버 컴포넌트에서 `await`을 사용하여 Promise를 리졸브하고 데이터를 클라이언트 컴포넌트에 `prop`으로 전달하는 방법도 존재합니다.

```js
export default async function App() {
  const messageContent = await fetchMessage();
  return <Message messageContent={messageContent} />
}
```

하지만 [서버 컴포넌트](https://ko.react.dev/reference/react/use-server)에서 `await`을 사용하면 `await` 문이 완료될 때까지 렌더링이 차단됩니다. 서버 컴포넌트에서 클라이언트 컴포넌트로 Promise를 prop으로 전달하면 Promise가 서버 컴포넌트의 렌더링을 차단하는 것을 방지할 수 있습니다.

</DeepDive>

### 거부된 Promise 처리하기 {/*dealing-with-rejected-promises*/}

경우에 따라 `use`에 전달된 Promise가 거부될 수 있습니다. 거부된 프로미스를 처리하는 방법은 2가지가 존재합니다.

1. [error boundary를 사용하여 오류를 표시하기](#displaying-an-error-to-users-with-error-boundary)
2. [`Promise.catch`로 대체 값 제공하기](#providing-an-alternative-value-with-promise-catch)

<Pitfall>

`use`는 try-catch 블록에서 호출할 수 없습니다. try-catch 블록 대신 [컴포넌트를 Error Boundary로 래핑]((#displaying-an-error-to-users-with-error-boundary))하거나 Promise의 [`catch` 메서드를 사용하여 대체 값을 제공합니다.]((#providing-an-alternative-value-with-promise-catch))
</Pitfall>

####  error boudary를 사용하여 오류 표시하기 {/*error-boudary를-사용하여-오류-표시하기*/}
 {/*displaying-an-error-to-users-with-error-boundary*/}

Promise가 거부될 때 오류를 표시하고 싶다면 [error boundary](https://ko.react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)를 사용합니다. error boundary를 사용하려면 `use` Hook을 호출하는 컴포넌트를 error boundary로 래핑합니다. `use`에 전달된 Promise가 거부되면 error boundary에 대한 fallback이 표시됩니다.

<Sandpack>

```js src/message.js active
"use client";

import { use, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export function MessageContainer({ messagePromise }) {
  return (
    <ErrorBoundary fallback={<p>⚠️Something went wrong</p>}>
      <Suspense fallback={<p>⌛Downloading message...</p>}>
        <Message messagePromise={messagePromise} />
      </Suspense>
    </ErrorBoundary>
  );
}

function Message({ messagePromise }) {
  const content = use(messagePromise);
  return <p>Here is the message: {content}</p>;
}
```

```js src/App.js hidden
import { useState } from "react";
import { MessageContainer } from "./message.js";

function fetchMessage() {
  return new Promise((resolve, reject) => setTimeout(reject, 1000));
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
// TODO: `use` Hook이 안정적으로 릴리즈되면 canary 대신 안정적인 React에서 가져올 수 있도록 업데이트
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

// TODO: 이 예제를 업데이트하여 작성한 후 Codesandbox Server Component 데모 환경을 사용합니다
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "18.3.0-canary-9377e1010-20230712",
    "react-dom": "18.3.0-canary-9377e1010-20230712",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```
</Sandpack>

### `Promise.catch`를 사용하여 대체 값 제공하기 {/*providing-an-alternative-value-with-promise-catch*/}

`use`에 전달된 Promise가 거부될 때 대체 값을 제공하려면 Promise의 <CodeStep step={1}>[`catch`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch)</CodeStep>메서드를 사용합니다.

```js [[1, 6, "catch"],[2, 7, "return"]]
import { Message } from './message.js';

export default function App() {
  const messagePromise = new Promise((resolve, reject) => {
    reject();
  }).catch(() => {
    return "no new message found.";
  });

  return (
    <Suspense fallback={<p>waiting for message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

Promise의 <CodeStep step={1}>`catch`</CodeStep> 메서드를 사용하려면 Promise 객체에서 <CodeStep step={1}>`catch`</CodeStep>를 호출합니다. <CodeStep step={1}>`catch`</CodeStep>는 오류 메시지를 인자로 받는 함수를 인수로 받습니다. <CodeStep step={1}>`catch`</CodeStep>에 전달된 함수가 <CodeStep step={2}>반환하는</CodeStep>하는 값은 모두 Promise의 리졸브 값으로 사용됩니다.

---

## 트러블슈팅 {/*troubleshooting*/}


### "Suspense Exception: This is not a real error!" {/*suspense-exception-error*/}

React 컴포넌트 또는 hook 함수 외부에서, 혹은 try-catch 블록에서 `use`를 호출하고 있는 경우입니다. try-catch 블록 내에서 `use`를 호출하는 경우 컴포넌트를 error boundary로 래핑하거나 Promise의 `catch`를 호출하여 에러를 발견하고 Promise를 다른 값으로 리졸브합니다. [예시 확인하기](#dealing-with-rejected-promises)

React 컴포넌트나 Hook 함수 외부에서 `use`를 호출하는 경우 `use` 호출을 React 컴포넌트나 Hook 함수로 이동합니다.


```jsx
function MessageComponent({messagePromise}) {
  function download() {
    // ❌ `use`를 호출하는 함수가 컴포넌트나 hook이 아닙니다.
    const message = use(messagePromise);
    // ...
```

컴포넌트 클로저 외부에서 `use`를 호출합니다. 여기서 `use`를 호출하는 함수는 컴포넌트 또는 Hook입니다.

```jsx
function MessageComponent({messagePromise}) {
  // ✅ `use`가 컴포넌트에서 호출되고 있습니다.
  const message = use(messagePromise);
  // ...
```
