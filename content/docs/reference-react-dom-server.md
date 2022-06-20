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
import * as ReactDOMServer from 'react-dom/server';
// CommonJS
var ReactDOMServer = require('react-dom/server');
```

## 개요 {#overview}

<<<<<<< HEAD
다음 메서드는 서버와 브라우저 환경에서 사용할 수 있습니다.
=======
These methods are only available in the **environments with [Node.js Streams](https://nodejs.dev/learn/nodejs-streams):**

- [`renderToPipeableStream()`](#rendertopipeablestream)
- [`renderToNodeStream()`](#rendertonodestream) (Deprecated)
- [`renderToStaticNodeStream()`](#rendertostaticnodestream)

These methods are only available in the **environments with [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)** (this includes browsers, Deno, and some modern edge runtimes):

- [`renderToReadableStream()`](#rendertoreadablestream)

The following methods can be used in the environments that don't support streams:
>>>>>>> df2673d1b6ec0cc6657fd58690bbf30fa1e6e0e6

- [`renderToString()`](#rendertostring)
- [`renderToStaticMarkup()`](#rendertostaticmarkup)

<<<<<<< HEAD
다음 추가 메서드는 **서버에서만 사용할 수 있는** `stream` 패키지에 의존성이 있어 브라우저에서는 작동하지 않습니다.

- [`renderToNodeStream()`](#rendertonodestream)
- [`renderToStaticNodeStream()`](#rendertostaticnodestream)

* * *

## 참조 {#reference}
=======
## Reference {#reference}
>>>>>>> df2673d1b6ec0cc6657fd58690bbf30fa1e6e0e6

### `renderToPipeableStream()` {#rendertopipeablestream}

```javascript
ReactDOMServer.renderToPipeableStream(element, options)
```

<<<<<<< HEAD
React 엘리먼트의 초기 HTML을 렌더링합니다. React는 HTML 문자열을 반환합니다. 빠른 페이지 로드를 위해 초기 요청 시에 서버에서 HTML을 생성하여 마크업을 보내거나, 검색 엔진 최적화를 위해 검색 엔진이 페이지를 크롤링할 수 있도록 하는데 사용할 수 있습니다.

이미 서버 렌더링 된 마크업이 있는 노드에서 [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate)를 호출할 경우 React는 이를 보존하고 이벤트 핸들러만 연결함으로써 매우 뛰어난 첫 로드 성능을 보여줍니다.
=======
Render a React element to its initial HTML. Returns a stream with a `pipe(res)` method to pipe the output and `abort()` to abort the request. Fully supports Suspense and streaming of HTML with "delayed" content blocks "popping in" via inline `<script>` tags later. [Read more](https://github.com/reactwg/react-18/discussions/37)

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

```javascript
let didError = false;
const stream = renderToPipeableStream(
  <App />,
  {
    onShellReady() {
      // The content above all Suspense boundaries is ready.
      // If something errored before we started streaming, we set the error code appropriately.
      res.statusCode = didError ? 500 : 200;
      res.setHeader('Content-type', 'text/html');
      stream.pipe(res);
    },
    onShellError(error) {
      // Something errored before we could complete the shell so we emit an alternative shell.
      res.statusCode = 500;
      res.send(
        '<!doctype html><p>Loading...</p><script src="clientrender.js"></script>'
      );
    },
    onAllReady() {
      // If you don't want streaming, use this instead of onShellReady.
      // This will fire after the entire page content is ready.
      // You can use this for crawlers or static generation.

      // res.statusCode = didError ? 500 : 200;
      // res.setHeader('Content-type', 'text/html');
      // stream.pipe(res);
    },
    onError(err) {
      didError = true;
      console.error(err);
    },
  }
);
```

See the [full list of options](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-dom/src/server/ReactDOMFizzServerNode.js#L36-L46).

> Note:
>
> This is a Node.js-specific API. Environments with [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API), like Deno and modern edge runtimes, should use [`renderToReadableStream`](#rendertoreadablestream) instead.
>
>>>>>>> df2673d1b6ec0cc6657fd58690bbf30fa1e6e0e6

* * *

### `renderToReadableStream()` {#rendertoreadablestream}

```javascript
ReactDOMServer.renderToReadableStream(element, options);
```

<<<<<<< HEAD
[`renderToString`](#rendertostring)과 비슷하지만 `data-reactroot`와 같이 React에서 내부적으로 사용하는 추가적인 DOM 어트리뷰트를 만들지 않습니다. 여분의 어트리뷰트를 제거함으로써 약간의 바이트를 절약할 수 있으므로 React를 간단한 정적 페이지 생성기로 사용하고 싶은 경우에 유용합니다.

클라이언트에서 React를 사용하여 상호작용이 가능한 마크업을 만들려면 이 메서드를 사용하지 마세요. 대신 서버에서 [`renderToString`](#rendertostring)을 사용하고 클라이언트에서 [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate)를 사용해주세요.
=======
Streams a React element to its initial HTML. Returns a Promise that resolves to a [Readable Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream). Fully supports Suspense and streaming of HTML. [Read more](https://github.com/reactwg/react-18/discussions/127)

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

```javascript
let controller = new AbortController();
let didError = false;
try {
  let stream = await renderToReadableStream(
    <html>
      <body>Success</body>
    </html>,
    {
      signal: controller.signal,
      onError(error) {
        didError = true;
        console.error(error);
      }
    }
  );
  
  // This is to wait for all Suspense boundaries to be ready. You can uncomment
  // this line if you want to buffer the entire HTML instead of streaming it.
  // You can use this for crawlers or static generation:

  // await stream.allReady;

  return new Response(stream, {
    status: didError ? 500 : 200,
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

See the [full list of options](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-dom/src/server/ReactDOMFizzServerBrowser.js#L27-L35).

> Note:
>
> This API depends on [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API). For Node.js, use [`renderToPipeableStream`](#rendertopipeablestream) instead.
>
>>>>>>> df2673d1b6ec0cc6657fd58690bbf30fa1e6e0e6

* * *

### `renderToNodeStream()`  (Deprecated) {#rendertonodestream}

```javascript
ReactDOMServer.renderToNodeStream(element)
```

<<<<<<< HEAD
React 엘리먼트의 초기 HTML을 렌더링합니다. HTML 문자열을 출력하는 [Readable 스트림](https://nodejs.org/api/stream.html#stream_readable_streams)을 반환합니다. 이 스트림이 출력하는 HTML 문자열은 [`ReactDOMServer.renderToString`](#rendertostring)이 반환하는 값과 정확히 일치합니다. 빠른 페이지 로드를 위해 초기 요청 시에 서버에서 HTML을 생성하여 마크업을 보내거나, 검색 엔진 최적화를 위해 검색 엔진이 페이지를 크롤링할 수 있도록 하는데 사용할 수 있습니다.

이미 서버 렌더링 된 마크업이 있는 노드에서 [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate)를 호출할 경우 React는 이를 보존하고 이벤트 핸들러만 연결함으로써 매우 뛰어난 첫 로드 성능을 보여줍니다.
=======
Render a React element to its initial HTML. Returns a [Node.js Readable stream](https://nodejs.org/api/stream.html#stream_readable_streams) that outputs an HTML string. The HTML output by this stream is exactly equal to what [`ReactDOMServer.renderToString`](#rendertostring) would return. You can use this method to generate HTML on the server and send the markup down on the initial request for faster page loads and to allow search engines to crawl your pages for SEO purposes.

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.
>>>>>>> df2673d1b6ec0cc6657fd58690bbf30fa1e6e0e6

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
>>>>>>> df2673d1b6ec0cc6657fd58690bbf30fa1e6e0e6

> 주의
>
> 서버에서만 사용할 수 있습니다. 이 API는 브라우저에서 작동하지 않습니다.
>
<<<<<<< HEAD
> 반환되는 스트림은 utf-8로 인코딩된 바이트 스트림을 반환합니다. 다른 방법으로 인코딩된 스트림이 필요할 경우, 텍스트 트랜스코딩을 위한 Transform 스트림을 제공하는 [iconv-lite](https://www.npmjs.com/package/iconv-lite)와 같은 프로젝트를 살펴보세요.
=======
> The stream returned from this method will return a byte stream encoded in utf-8. If you need a stream in another encoding, take a look at a project like [iconv-lite](https://www.npmjs.com/package/iconv-lite), which provides transform streams for transcoding text.

* * *

### `renderToString()` {#rendertostring}

```javascript
ReactDOMServer.renderToString(element)
```

Render a React element to its initial HTML. React will return an HTML string. You can use this method to generate HTML on the server and send the markup down on the initial request for faster page loads and to allow search engines to crawl your pages for SEO purposes.

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

> Note
>
> This API has limited Suspense support and does not support streaming.
>
> On the server, it is recommended to use either [`renderToPipeableStream`](#rendertopipeablestream) (for Node.js) or [`renderToReadableStream`](#rendertoreadablestream) (for Web Streams) instead.

* * *

### `renderToStaticMarkup()` {#rendertostaticmarkup}

```javascript
ReactDOMServer.renderToStaticMarkup(element)
```

Similar to [`renderToString`](#rendertostring), except this doesn't create extra DOM attributes that React uses internally, such as `data-reactroot`. This is useful if you want to use React as a simple static page generator, as stripping away the extra attributes can save some bytes.

If you plan to use React on the client to make the markup interactive, do not use this method. Instead, use [`renderToString`](#rendertostring) on the server and [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on the client.
>>>>>>> df2673d1b6ec0cc6657fd58690bbf30fa1e6e0e6
