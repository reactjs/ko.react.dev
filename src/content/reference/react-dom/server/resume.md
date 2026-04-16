---
title: resume
---

<Intro>

`resume`은 [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)을 이용해 사전 렌더링된 React 트리를 스트리밍합니다.

```js
const stream = await resume(reactNode, postponedState, options?)
```

</Intro>

<InlineToc />

<Note>

이 API는 [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)에 의존합니다. Node.js에서는 [`resumeToPipeableStream`](/reference/react-dom/server/resumeToPipeableStream)을 대신 사용하세요.

</Note>

---

## 레퍼런스 {/*reference*/}

### `resume(node, postponedState, options?)` {/*resume*/}

`resume`을 호출해 사전 렌더링된 React 트리의 렌더링을 재개하고, 이를 HTML로 [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)에 렌더링합니다.


```js
import { resume } from 'react-dom/server';
import {getPostponedState} from './storage';

async function handler(request, writable) {
  const postponed = await getPostponedState(request);
  const resumeStream = await resume(<App />, postponed);
  return resumeStream.pipeTo(writable)
}
```

[아래에서 더 많은 예시를 확인하세요.](#usage)

#### 매개변수 {/*parameters*/}

* `reactNode`: `prerender`를 호출할 때 전달한 React 노드입니다. 예를 들어, `<App />`과 같은 JSX 엘리먼트입니다. 전체 문서를 나타낼 것으로 예상되므로 `App` 컴포넌트는 `<html>` 태그를 렌더링해야 합니다.
* `postponedState`: [prerender API](/reference/react-dom/static/prerender)에서 반환된 불분명한 `postpone` 객체로, 저장해 둔 위치(예: Redis, 파일, S3)에서 불러옵니다.
* **optional** `options`: 스트리밍 옵션을 지정할 수 있는 객체입니다.
  * **optional** `nonce`: [`script-src` Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src)에서 스크립트를 허용하기 위한 [`nonce`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#nonce) 문자열입니다.
  * **optional** `signal`: [서버 렌더링을 중단](/reference/react-dom/server/renderToReadableStream#aborting-server-rendering)하고 나머지를 클라이언트에서 렌더링할 수 있게 하는 [중단 신호](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)입니다.
  * **optional** `onError`: 서버 오류가 발생할 때마다, [복구 가능](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-outside-the-shell) 또는 [불가능](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-inside-the-shell)에 관계없이 호출되는 콜백입니다. 기본적으로 `console.error`만 호출합니다. [충돌 보고를 기록](/reference/react-dom/server/renderToReadableStream#logging-crashes-on-the-server)하도록 재정의하는 경우에도 반드시 `console.error`를 호출해야 합니다.


#### 반환값 {/*returns*/}

`resume`은 Promise를 반환합니다.

- `resume`이 [shell](/reference/react-dom/server/renderToReadableStream#specifying-what-goes-into-the-shell)을 성공적으로 생성하면, 해당 Promise는 [Writable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/WritableStream)으로 파이프할 수 있는 [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)으로 이행됩니다.
- shell에서 오류가 발생하면, 해당 Promise는 그 오류와 함께 거부됩니다.

반환된 스트림은 다음과 같은 추가적인 프로퍼티를 가지고 있습니다.

* `allReady`: 모든 렌더링이 완료되면 이행되는 Promise입니다. [크롤러와 정적 생성을 위해](/reference/react-dom/server/renderToReadableStream#waiting-for-all-content-to-load-for-crawlers-and-static-generation) 응답을 반환하기 전에 `await stream.allReady`를 사용할 수 있습니다. 이렇게 하면 점진적 로딩은 사용할 수 없습니다. 스트림에는 최종 HTML이 포함됩니다.

#### 주의 사항 {/*caveats*/}

- `resume`은 `bootstrapScripts`, `bootstrapScriptContent`, `bootstrapModules` 옵션을 받지 않습니다. 대신 `postponedState`를 생성하는 `prerender` 호출에 이 옵션들을 전달해야 합니다. 또한 쓰기 가능한 스트림에 부트스트랩 콘텐츠를 수동으로 주입할 수도 있습니다.
- `prerender`와 `resume`에서 접두사가 동일해야 하므로, `resume`은 `identifierPrefix`를 받지 않습니다.
- `nonce`는 prerender에 전달할 수 없으므로, prerender에 스크립트를 제공하지 않는 경우에만 `resume`에 `nonce`를 전달해야 합니다.
- `resume`은 사전 렌더링이 완전히 완료되지 않은 컴포넌트를 찾을 때까지 루트부터 다시 렌더링합니다. 사전 렌더링이 완전히 완료된 컴포넌트(해당 컴포넌트와 자식들의 사전 렌더링이 모두 완료된 경우)만 완전히 건너뜁니다.


## 사용법 {/*usage*/}

### 사전 렌더링 재개하기 {/*resuming-a-prerender*/}

<Sandpack>

```js src/App.js hidden
```

```html public/index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <iframe id="container"></iframe>
</body>
</html>
```

```js src/index.js
import {
  flushReadableStreamToFrame,
  getUser,
  Postponed,
  sleep,
} from "./demo-helpers";
import { StrictMode, Suspense, use, useEffect } from "react";
import { prerender } from "react-dom/static";
import { resume } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";

function Header() {
  return <header>Me and my descendants can be prerendered</header>;
}

const { promise: cookies, resolve: resolveCookies } = Promise.withResolvers();

function Main() {
  const { sessionID } = use(cookies);
  const user = getUser(sessionID);

  useEffect(() => {
    console.log("reached interactivity!");
  }, []);

  return (
    <main>
      Hello, {user.name}!
      <button onClick={() => console.log("hydrated!")}>
        Clicking me requires hydration.
      </button>
    </main>
  );
}

function Shell({ children }) {
  // In a real app, this is where you would put your html and body.
  // We're just using tags here we can include in an existing body for demonstration purposes
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}

function App() {
  return (
    <Shell>
      <Suspense fallback="loading header">
        <Header />
      </Suspense>
      <Suspense fallback="loading main">
        <Main />
      </Suspense>
    </Shell>
  );
}

async function main(frame) {
  // Layer 1
  const controller = new AbortController();
  const prerenderedApp = prerender(<App />, {
    signal: controller.signal,
    onError(error) {
      if (error instanceof Postponed) {
      } else {
        console.error(error);
      }
    },
  });
  // We're immediately aborting in a macrotask.
  // Any data fetching that's not available synchronously, or in a microtask, will not have finished.
  setTimeout(() => {
    controller.abort(new Postponed());
  });

  const { prelude, postponed } = await prerenderedApp;
  await flushReadableStreamToFrame(prelude, frame);

  // Layer 2
  // Just waiting here for demonstration purposes.
  // In a real app, the prelude and postponed state would've been serialized in Layer 1 and Layer would deserialize them.
  // The prelude content could be flushed immediated as plain HTML while
  // React is continuing to render from where the prerender left off.
  await sleep(2000);

  // You would get the cookies from the incoming HTTP request
  resolveCookies({ sessionID: "abc" });

  const stream = await resume(<App />, postponed);

  await flushReadableStreamToFrame(stream, frame);

  // Layer 3
  // Just waiting here for demonstration purposes.
  await sleep(2000);

  hydrateRoot(frame.contentWindow.document, <App />);
}

main(document.getElementById("container"));

```

```js src/demo-helpers.js
export async function flushReadableStreamToFrame(readable, frame) {
  const document = frame.contentWindow.document;
  const decoder = new TextDecoder();
  for await (const chunk of readable) {
    const partialHTML = decoder.decode(chunk);
    document.write(partialHTML);
  }
}

// This doesn't need to be an error.
// You can use any other means to check if an error during prerender was
// from an intentional abort or a real error.
export class Postponed extends Error {}

// We're just hardcoding a session here.
export function getUser(sessionID) {
  return {
    name: "Alice",
  };
}

export function sleep(timeoutMS) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeoutMS);
  });
}
```

</Sandpack>

### 추가로 읽어보기 {/*further-reading*/}

재개 동작은 `renderToReadableStream`과 유사합니다. 더 많은 예시는 [`renderToReadableStream`의 사용법 섹션](/reference/react-dom/server/renderToReadableStream#usage)을 확인하세요.
[`prerender`의 사용법 섹션](/reference/react-dom/static/prerender#usage)에는 `prerender` 사용 방법에 대한 예시가 포함되어 있습니다.
