---
id: react-dom-server
title: ReactDOMServer
layout: docs
category: Reference
permalink: docs/react-dom-server.html
---

<div class="scary">

> These docs are old and won't be updated. Go to [react.dev](https://react.dev/) for the new React docs.
>
> These new documentation pages teach modern React:
>
> - [`react-dom`: Server APIs](https://react.dev/reference/react-dom/server)

</div>

`ReactDOMServer` 객체를 통해 컴포넌트를 정적 마크업으로 렌더링할 수 있습니다. 대체로 이것은 Node 서버에서 사용됩니다.

```js
// ES modules
import * as ReactDOMServer from 'react-dom/server';
// CommonJS
var ReactDOMServer = require('react-dom/server');
```

## 개요 {#overview}

These methods are only available in the **environments with [Node.js Streams](https://nodejs.org/api/stream.html):**

- [`renderToPipeableStream()`](#rendertopipeablestream)
- [`renderToNodeStream()`](#rendertonodestream) (Deprecated)
- [`renderToStaticNodeStream()`](#rendertostaticnodestream)

These methods are only available in the **environments with [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)** (this includes browsers, Deno, and some modern edge runtimes):

- [`renderToReadableStream()`](#rendertoreadablestream)

The following methods can be used in the environments that don't support streams:

- [`renderToString()`](#rendertostring)
- [`renderToStaticMarkup()`](#rendertostaticmarkup)

## Reference {#reference}

### `renderToPipeableStream()` {#rendertopipeablestream}

<div class="scary">

> This content is out of date.
>
> Read the new React documentation for [`renderToPipeableStream`](https://react.dev/reference/react-dom/server/renderToPipeableStream).

</div>

```javascript
ReactDOMServer.renderToPipeableStream(element, options)
```

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

* * *

### `renderToReadableStream()` {#rendertoreadablestream}

<div class="scary">

> This content is out of date.
>
> Read the new React documentation for [`renderToReadableStream`](https://react.dev/reference/react-dom/server/renderToReadableStream).

</div>

```javascript
ReactDOMServer.renderToReadableStream(element, options);
```

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

* * *

### `renderToNodeStream()`  (Deprecated) {#rendertonodestream}

<div class="scary">

> This content is out of date.
>
> Read the new React documentation for [`renderToNodeStream`](https://react.dev/reference/react-dom/server/renderToNodeStream).

</div>

```javascript
ReactDOMServer.renderToNodeStream(element)
```

Render a React element to its initial HTML. Returns a [Node.js Readable stream](https://nodejs.org/api/stream.html#stream_readable_streams) that outputs an HTML string. The HTML output by this stream is exactly equal to what [`ReactDOMServer.renderToString`](#rendertostring) would return. You can use this method to generate HTML on the server and send the markup down on the initial request for faster page loads and to allow search engines to crawl your pages for SEO purposes.

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

> 주의
>
> 서버에서만 사용할 수 있습니다. 이 API는 브라우저에서 작동하지 않습니다.
>
> 반환되는 스트림은 utf-8로 인코딩된 바이트 스트림을 반환합니다. 다른 방법으로 인코딩된 스트림이 필요할 경우, 텍스트 트랜스코딩을 위한 Transform 스트림을 제공하는 [iconv-lite](https://www.npmjs.com/package/iconv-lite)와 같은 프로젝트를 살펴보세요.

* * *

### `renderToStaticNodeStream()` {#rendertostaticnodestream}

<div class="scary">

> This content is out of date.
>
> Read the new React documentation for [`renderToStaticNodeStream`](https://react.dev/reference/react-dom/server/renderToStaticNodeStream).

</div>

```javascript
ReactDOMServer.renderToStaticNodeStream(element)
```

[`renderToNodeStream`](#rendertonodestream)과 비슷하지만 `data-reactroot`와 같이 React에서 내부적으로 사용하는 추가적인 DOM 어트리뷰트를 만들지 않습니다. 여분의 어트리뷰트를 제거함으로써 약간의 바이트를 절약할 수 있으므로 React를 간단한 정적 페이지 생성기로 사용하고 싶은 경우에 유용합니다.

이 스트림이 출력하는 HTML 문자열은 [`ReactDOMServer.renderToStaticMarkup`](#rendertostaticmarkup)이 반환하는 값과 정확히 일치합니다.

If you plan to use React on the client to make the markup interactive, do not use this method. Instead, use [`renderToNodeStream`](#rendertonodestream) on the server and [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on the client.

> 주의
>
> 서버에서만 사용할 수 있습니다. 이 API는 브라우저에서 작동하지 않습니다.
>
> The stream returned from this method will return a byte stream encoded in utf-8. If you need a stream in another encoding, take a look at a project like [iconv-lite](https://www.npmjs.com/package/iconv-lite), which provides transform streams for transcoding text.

* * *

### `renderToString()` {#rendertostring}

<div class="scary">

> This content is out of date.
>
> Read the new React documentation for [`renderToString`](https://react.dev/reference/react-dom/server/renderToString).

</div>

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

<div class="scary">

> This content is out of date.
>
> Read the new React documentation for [`renderToStaticMarkup`](https://react.dev/reference/react-dom/server/renderToStaticMarkup).

</div>

```javascript
ReactDOMServer.renderToStaticMarkup(element)
```

Similar to [`renderToString`](#rendertostring), except this doesn't create extra DOM attributes that React uses internally, such as `data-reactroot`. This is useful if you want to use React as a simple static page generator, as stripping away the extra attributes can save some bytes.

If you plan to use React on the client to make the markup interactive, do not use this method. Instead, use [`renderToString`](#rendertostring) on the server and [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on the client.
