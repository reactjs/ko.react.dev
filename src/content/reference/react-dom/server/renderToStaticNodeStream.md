---
title: renderToStaticNodeStream
---

<Intro>

`renderToStaticNodeStream` 은 상호작용하지 않는 React 트리를 [Node.js Readable Stream](https://nodejs.org/api/stream.html#readable-streams) 으로 렌더링합니다.

```js
const stream = renderToStaticNodeStream(reactNode)
```

</Intro>

<InlineToc />

---

## 참조 {/*reference*/}

### `renderToStaticNodeStream(reactNode)` {/*rendertostaticnodestream*/}

서버에서 `renderToStaticNodeStream` 을 호출하여 [Node.js Readable Stream](https://nodejs.org/api/stream.html#readable-streams) 을 불러옵니다.

```js
import { renderToStaticNodeStream } from 'react-dom/server';

const stream = renderToStaticNodeStream(<Page />);
stream.pipe(response);
```

[아래에서 더 많은 예시를 참고하세요.](#usage)

stream 은 React 컴포넌트의 상호작용하지 않는 HTML 출력을 생성합니다.

#### 매개변수 {/*parameters*/}

* `reactNode`: HTML 로 렌더링할 React 노드. 예를 들어 `<Page />` 와 같은 JSX 엘리먼트.

#### 반환값 {/*returns*/}

HTML 문자열을 출력하는 [Node.js Readable Stream](https://nodejs.org/api/stream.html#readable-streams) 입니다. 결과 HTML은 클라이언트에서 hydrate 할 수 없습니다.

#### 주의사항 {/*caveats*/}

* `renderToStaticNodeStream` 의 출력값은 hydrate 할 수 없습니다.

* 이 메서드는 출력값이 반환되기 전에 모든 [Suspense boundaries](/reference/react/Suspense) 가 완료되기를 기다립니다.

* React 18부터 이 메서드는 모든 출력값을 버퍼링하기 때문에 스트리밍의 이점을 제공하지 않습니다.

* 반환된 스트림은 utf-8로 인코딩된 바이트 스트림입니다. 다른 방식으로 인코딩된 스트림이 필요하다면, 트랜스코딩을 위한 변환 스트림을 제공하는 [iconv-lite](https://www.npmjs.com/package/iconv-lite) 와 같은 프로젝트를 살펴보세요.

---

## 사용법 {/*usage*/}

### React 트리를 정적 HTML로 Node.js Readable Stream 에 렌더링 하기 {/*rendering-a-react-tree-as-static-html-to-a-nodejs-readable-stream*/}

`renderToStaticNodeStream` 을 호출하여 서버 응답으로 파이프 통신 할 수 있는 [Node.js Readable Stream](https://nodejs.org/api/stream.html#readable-streams) 을 불러옵니다.

```js {5-6}
import { renderToStaticNodeStream } from 'react-dom/server';

// 라우트 핸들러 문법은 백엔드 프레임워크에 따라 다릅니다.
app.use('/', (request, response) => {
  const stream = renderToStaticNodeStream(<Page />);
  stream.pipe(response);
});
```

stream 은 React 컴포넌트의 상호작용하지 않는 초기 HTML 출력을 생성합니다.

<Pitfall>

이 메서드는 **hydrate 될 수 없고 상호작용하지 않는 HTML** 을 렌더링합니다. 이 메서드는 React를 간단한 정적 페이지 생성기로 사용하거나 이메일과 같은 완전히 정적인 콘텐츠를 렌더링할 때 유용합니다.

상호작용을 위한 앱은 서버에서 [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream)을, 클라이언트에서 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot)를 사용해야 합니다.

</Pitfall>
