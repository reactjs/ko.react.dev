---
id: react-dom-server
title: ReactDOMServer
layout: docs
category: Reference
permalink: docs/react-dom-server.html
---

`ReactDOMServer` 객체를 통해 컴포넌트를 정적 마크업으로 렌더링할 수 있습니다. 대체로 이것은 Node 서버에서 사용됩니다.

```js
// ES modules
import ReactDOMServer from 'react-dom/server';
// CommonJS
var ReactDOMServer = require('react-dom/server');
```

## 개요 {#overview}

다음 메서드는 서버와 브라우저 환경에서 사용할 수 있습니다.

- [`renderToString()`](#rendertostring)
- [`renderToStaticMarkup()`](#rendertostaticmarkup)

다음 추가 메서드는 **서버에서만 사용할 수 있는** `stream` 패키지에 의존성이 있어 브라우저에서는 작동하지 않습니다.

- [`renderToPipeableStream()`](#rendertopipeablestream)
- [`renderToReadableStream()`](#rendertoreadablestream)
- [`renderToNodeStream()`](#rendertonodestream) (Deprecated)
- [`renderToStaticNodeStream()`](#rendertostaticnodestream)

* * *

## 참조 {#reference}

### `renderToString()` {#rendertostring}

```javascript
ReactDOMServer.renderToString(element)
```

React 엘리먼트의 초기 HTML을 렌더링합니다. React는 HTML 문자열을 반환합니다. 빠른 페이지 로드를 위해 초기 요청 시에 서버에서 HTML을 생성하여 마크업을 보내거나, 검색 엔진 최적화를 위해 검색 엔진이 페이지를 크롤링할 수 있도록 하는데 사용할 수 있습니다.

<<<<<<< HEAD
이미 서버 렌더링 된 마크업이 있는 노드에서 [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate)를 호출할 경우 React는 이를 보존하고 이벤트 핸들러만 연결함으로써 매우 뛰어난 첫 로드 성능을 보여줍니다.
=======
If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

* * *

### `renderToStaticMarkup()` {#rendertostaticmarkup}

```javascript
ReactDOMServer.renderToStaticMarkup(element)
```

[`renderToString`](#rendertostring)과 비슷하지만 `data-reactroot`와 같이 React에서 내부적으로 사용하는 추가적인 DOM 어트리뷰트를 만들지 않습니다. 여분의 어트리뷰트를 제거함으로써 약간의 바이트를 절약할 수 있으므로 React를 간단한 정적 페이지 생성기로 사용하고 싶은 경우에 유용합니다.

<<<<<<< HEAD
클라이언트에서 React를 사용하여 상호작용이 가능한 마크업을 만들려면 이 메서드를 사용하지 마세요. 대신 서버에서 [`renderToString`](#rendertostring)을 사용하고 클라이언트에서 [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate)를 사용해주세요.
=======
If you plan to use React on the client to make the markup interactive, do not use this method. Instead, use [`renderToString`](#rendertostring) on the server and [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on the client.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

* * *

### `renderToPipeableStream()` {#rendertopipeablestream}

```javascript
ReactDOMServer.renderToPipeableStream(element, options)
```

Render a React element to its initial HTML. Returns a [Control object](https://github.com/facebook/react/blob/3f8990898309c61c817fbf663f5221d9a00d0eaa/packages/react-dom/src/server/ReactDOMFizzServerNode.js#L49-L54) that allows you to pipe the output or abort the request. Fully supports Suspense and streaming of HTML with "delayed" content blocks "popping in" later through javascript execution. [Read more](https://github.com/reactwg/react-18/discussions/37)

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

> Note:
>
> This is a Node.js specific API and modern server environments should use renderToReadableStream instead.
>

```
const {pipe, abort} = renderToPipeableStream(
  <App />,
  {
    onAllReady() {
      res.statusCode = 200;
      res.setHeader('Content-type', 'text/html');
      pipe(res);
    },
    onShellError(x) {
      res.statusCode = 500;
      res.send(
        '<!doctype html><p>Loading...</p><script src="clientrender.js"></script>'
      );
    }
  }
);
```

* * *

### `renderToReadableStream()` {#rendertoreadablestream}

```javascript
    ReactDOMServer.renderToReadableStream(element, options);
```

Streams a React element to its initial HTML. Returns a [Readable Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream). Fully supports Suspense and streaming of HTML. [Read more](https://github.com/reactwg/react-18/discussions/127)

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

```
let controller = new AbortController();
try {
  let stream = await renderToReadableStream(
    <html>
      <body>Success</body>
    </html>,
    {
      signal: controller.signal,
    }
  );
  
  // This is to wait for all suspense boundaries to be ready. You can uncomment
  // this line if you don't want to stream to the client
  // await stream.allReady;

  return new Response(stream, {
    headers: {'Content-Type': 'text/html'},
  });
} catch (error) {
  return new Response(
    '<!doctype html><p>Loading...</p><script src="clientrender.js"></script>',
    {
      status: 500,
      headers: {'Content-Type': 'text/html'},
    }
  );
}
```
* * *

### `renderToNodeStream()` {#rendertonodestream} (Deprecated)

```javascript
ReactDOMServer.renderToNodeStream(element)
```

React 엘리먼트의 초기 HTML을 렌더링합니다. HTML 문자열을 출력하는 [Readable 스트림](https://nodejs.org/api/stream.html#stream_readable_streams)을 반환합니다. 이 스트림이 출력하는 HTML 문자열은 [`ReactDOMServer.renderToString`](#rendertostring)이 반환하는 값과 정확히 일치합니다. 빠른 페이지 로드를 위해 초기 요청 시에 서버에서 HTML을 생성하여 마크업을 보내거나, 검색 엔진 최적화를 위해 검색 엔진이 페이지를 크롤링할 수 있도록 하는데 사용할 수 있습니다.

<<<<<<< HEAD
이미 서버 렌더링 된 마크업이 있는 노드에서 [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate)를 호출할 경우 React는 이를 보존하고 이벤트 핸들러만 연결함으로써 매우 뛰어난 첫 로드 성능을 보여줍니다.
=======
If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

> 주의
>
> 서버에서만 사용할 수 있습니다. 이 API는 브라우저에서 작동하지 않습니다.
>
> 반환되는 스트림은 utf-8로 인코딩된 바이트 스트림을 반환합니다. 다른 방법으로 인코딩된 스트림이 필요할 경우, 텍스트 트랜스코딩을 위한 Transform 스트림을 제공하는 [iconv-lite](https://www.npmjs.com/package/iconv-lite)와 같은 프로젝트를 살펴보세요.

* * *

### `renderToStaticNodeStream()` {#rendertostaticnodestream}

```javascript
ReactDOMServer.renderToStaticNodeStream(element)
```

[`renderToNodeStream`](#rendertonodestream)과 비슷하지만 `data-reactroot`와 같이 React에서 내부적으로 사용하는 추가적인 DOM 어트리뷰트를 만들지 않습니다. 여분의 어트리뷰트를 제거함으로써 약간의 바이트를 절약할 수 있으므로 React를 간단한 정적 페이지 생성기로 사용하고 싶은 경우에 유용합니다.

이 스트림이 출력하는 HTML 문자열은 [`ReactDOMServer.renderToStaticMarkup`](#rendertostaticmarkup)이 반환하는 값과 정확히 일치합니다.

<<<<<<< HEAD
클라이언트에서 React를 사용하여 상호작용이 가능한 마크업을 만들려면 이 메서드를 사용하지 마세요. 대신 서버에서 [`renderToNodeStream`](#rendertonodestream)을 사용하고 클라이언트에서 [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate)를 사용해주세요.
=======
If you plan to use React on the client to make the markup interactive, do not use this method. Instead, use [`renderToNodeStream`](#rendertonodestream) on the server and [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on the client.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

> 주의
>
> 서버에서만 사용할 수 있습니다. 이 API는 브라우저에서 작동하지 않습니다.
>
> 반환되는 스트림은 utf-8로 인코딩된 바이트 스트림을 반환합니다. 다른 방법으로 인코딩된 스트림이 필요할 경우, 텍스트 트랜스코딩을 위한 Transform 스트림을 제공하는 [iconv-lite](https://www.npmjs.com/package/iconv-lite)와 같은 프로젝트를 살펴보세요.
