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

- [`renderToNodeStream()`](#rendertonodestream)
- [`renderToStaticNodeStream()`](#rendertostaticnodestream)

* * *

## 참조 {#reference}

### `renderToString()` {#rendertostring}

```javascript
ReactDOMServer.renderToString(element)
```

React 엘리먼트의 초기 HTML을 렌더링합니다. React는 HTML 문자열을 반환합니다. 빠른 페이지 로드를 위해 초기 요청 시에 서버에서 HTML을 생성하여 마크업을 보내거나, 검색 엔진 최적화를 위해 검색 엔진이 페이지를 크롤링할 수 있도록 하는데 사용할 수 있습니다.

이미 서버 렌더링 된 마크업이 있는 노드에서 [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate)를 호출할 경우 React는 이를 보존하고 이벤트 핸들러만 연결함으로써 매우 뛰어난 첫 로드 성능을 보여줍니다.

* * *

### `renderToStaticMarkup()` {#rendertostaticmarkup}

```javascript
ReactDOMServer.renderToStaticMarkup(element)
```

[`renderToString`](#rendertostring)과 비슷하지만 `data-reactroot`와 같이 React에서 내부적으로 사용하는 추가적인 DOM 어트리뷰트를 만들지 않습니다. 여분의 어트리뷰트를 제거함으로써 약간의 바이트를 절약할 수 있으므로 React를 간단한 정적 페이지 생성기로 사용하고 싶은 경우에 유용합니다.

클라이언트에서 React를 사용하여 상호작용이 가능한 마크업을 만들려면 이 메서드를 사용하지 마십시오. 대신 서버에서 [`renderToString`](#rendertostring)을 사용하고 클라이언트에서 [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate)를 사용하십시오.

* * *

### `renderToNodeStream()` {#rendertonodestream}

```javascript
ReactDOMServer.renderToNodeStream(element)
```

React 엘리먼트의 초기 HTML을 렌더링합니다. HTML 문자열을 출력하는 [Readable 스트림](https://nodejs.org/api/stream.html#stream_readable_streams)을 반환합니다. 이 스트림이 출력하는 HTML 문자열은 [`ReactDOMServer.renderToString`](#rendertostring)이 반환하는 값과 정확히 일치합니다. 빠른 페이지 로드를 위해 초기 요청 시에 서버에서 HTML을 생성하여 마크업을 보내거나, 검색 엔진 최적화를 위해 검색 엔진이 페이지를 크롤링할 수 있도록 하는데 사용할 수 있습니다.

이미 서버 렌더링 된 마크업이 있는 노드에서 [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate)를 호출할 경우 React는 이를 보존하고 이벤트 핸들러만 연결함으로써 매우 뛰어난 첫 로드 성능을 보여줍니다.

> 주의
>
> 서버에서만 사용할 수 있습니다. 이 API는 브라우저에서 작동하지 않습니다.
>
> 반환되는 스트림은 utf-8로 인코딩된 바이트 스트림을 반환합니다. 다른 방법으로 인코딩된 스트림이 필요할 경우, 텍스트 트랜스코딩을 위한 Transform 스트림을 제공하는 [iconv-lite](https://www.npmjs.com/package/iconv-lite)와 같은 프로젝트를 살펴보십시오.

* * *

### `renderToStaticNodeStream()` {#rendertostaticnodestream}

```javascript
ReactDOMServer.renderToStaticNodeStream(element)
```

[`renderToNodeStream`](#rendertonodestream)과 비슷하지만 `data-reactroot`와 같이 React에서 내부적으로 사용하는 추가적인 DOM 어트리뷰트를 만들지 않습니다. 여분의 어트리뷰트를 제거함으로써 약간의 바이트를 절약할 수 있으므로 React를 간단한 정적 페이지 생성기로 사용하고 싶은 경우에 유용합니다.

이 스트림이 출력하는 HTML 문자열은 [`ReactDOMServer.renderToStaticMarkup`](#rendertostaticmarkup)이 반환하는 값과 정확히 일치합니다.

클라이언트에서 React를 사용하여 상호작용이 가능한 마크업을 만들려면 이 메서드를 사용하지 마십시오. 대신 서버에서 [`renderToNodeStream`](#rendertonodestream)을 사용하고 클라이언트에서 [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate)를 사용하십시오.

> 주의
>
> 서버에서만 사용할 수 있습니다. 이 API는 브라우저에서 작동하지 않습니다.
>
> 반환되는 스트림은 utf-8로 인코딩된 바이트 스트림을 반환합니다. 다른 방법으로 인코딩된 스트림이 필요할 경우, 텍스트 트랜스코딩을 위한 Transform 스트림을 제공하는 [iconv-lite](https://www.npmjs.com/package/iconv-lite)와 같은 프로젝트를 살펴보십시오.
