---
title: renderToNodeStream
---

<Deprecated>

이 API는 향후 React의 주요 버전에서 제거될 예정입니다. 대신 [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream)을 사용하세요.

</Deprecated>

<Intro>

`renderToNodeStream` React 트리를 [Node.js Readable Stream.](https://nodejs.org/api/stream.html#readable-streams)으로 렌더링합니다.

```js
const stream = renderToNodeStream(reactNode)
```

</Intro>

<InlineToc />

---

## 참조 {/*reference*/}

### `renderToNodeStream(reactNode)` {/*rendertonodestream*/}

서버에서 `renderToNodeStream`을 호출하여 응답으로 파이핑할 수 있는 [Node.js Readable Stream](https://nodejs.org/api/stream.html#readable-streams)을 가져옵니다.

```js
import { renderToNodeStream } from 'react-dom/server';

const stream = renderToNodeStream(<App />);
stream.pipe(response);
```

클라이언트에서 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot)를 호출하여 서버에서 생성된 HTML을 인터랙티브하게 만들 수 있습니다.

[아래 예시를 참고하세요.](#usage)

#### 파라미터 {/*parameters*/}

* `reactNode`: A React node you want to render to HTML. For example, a JSX element like `<App />`.
HTML로 렌더링하려는 React 노드입니다. 예를 들어, `<App />`과 같은 JSX 엘리먼트입니다.
#### 반환 {/*returns*/}

HTML 문자열을 출력하는 [Node.js Readable Stream](https://nodejs.org/api/stream.html#readable-streams)를 반환합니다.

#### 주의사항 {/*caveats*/}

* 이 메서드는 출력을 반환하기 전에 모든 [Suspense boundaries](/reference/react/Suspense))가 완료될 때까지 기다립니다.

* React 18부터 이 메서드는 모든 출력을 버퍼링하므로 실제로 스트리밍 이점을 제공하지 않습니다. 그렇기 때문에 대신 [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream)으로 마이그레이션할 것을 권장합니다.

* 반환된 스트림은 utf-8로 인코딩된 바이트 스트림입니다. 다른 인코딩으로 된 스트림이 필요한 경우 텍스트 트랜스코딩을 위한 트랜스폼 스트림을 제공하는 [iconv-lite](https://www.npmjs.com/package/iconv-lite)와 같은 프로젝트를 살펴보세요.

---

## 사용법 {/*usage*/}

### React 트리를 HTML로 Node.js Readable Stream에 렌더링하기 {/*rendering-a-react-tree-as-html-to-a-nodejs-readable-stream*/}

`renderToNodeStream` 을 호출하여 서버 응답으로 파이핑할 수 있는 [Node.js Readable Stream](https://nodejs.org/api/stream.html#readable-streams)을 가져옵니다.

```js {5-6}
import { renderToNodeStream } from 'react-dom/server';

// 라우트 핸들러 구문은 백엔드 프레임워크에 따라 다릅니다.
app.use('/', (request, response) => {
  const stream = renderToNodeStream(<App />);
  stream.pipe(response);
});
```

스트림은 React 컴포넌트의 초기에 상호작용하지 않는 HTML 결과물을 생성합니다. 클라이언트에서는 서버에서 생성된 HTML을 *hydrate* 처리하고 상호작용하도록 만들기 위해 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot)를 호출해야 합니다.
