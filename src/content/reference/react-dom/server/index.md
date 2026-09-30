---
title: Server React DOM APIs
---

<Intro>

`react-dom/server` API를 사용하면 React 컴포넌트를 HTML로 서버 사이드 렌더링할 수 있습니다. 이 API는 일반적으로 앱의 최상위 레벨에서 초기 HTML을 생성할 때 서버에서만 사용됩니다. [프레임워크](/learn/creating-a-react-app#full-stack-frameworks)가 대신 호출할 수도 있습니다. 대부분의 컴포넌트는 이를 import하거나 사용할 필요가 없습니다.

</Intro>

---

## Web 스트림용 서버 API {/*server-apis-for-web-streams*/}

다음 메서드들은 브라우저, Deno 및 일부 최신 엣지 런타임을 포함하는 [Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)이 있는 환경에서만 사용할 수 있습니다.

* [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream)은 React 트리를 [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)으로 렌더링합니다.
* [`resume`](/reference/react-dom/server/resume)은 [`prerender`](/reference/react-dom/static/prerender) 결과를 [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)으로 재개합니다.


<Note>

Node.js에도 호환성을 위해 이 메서드들이 포함되어 있지만, 성능이 더 낮아 권장되지 않습니다. 대신 [전용 Node.js API](#server-apis-for-nodejs-streams)를 사용하세요.

</Note>
---

## Node.js 스트림용 서버 API {/*server-apis-for-nodejs-streams*/}

이 메서드들은 [Node.js 스트림](https://nodejs.org/api/stream.html)을 지원하는 환경에서만 사용할 수 있습니다.

* [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream)은 React 트리를 파이프 가능한 [Node.js 스트림](https://nodejs.org/api/stream.html)으로 렌더링합니다.
* [`resumeToPipeableStream`](/reference/react-dom/server/resumeToPipeableStream)은 [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream) 결과를 파이프 가능한 [Node.js 스트림](https://nodejs.org/api/stream.html)으로 재개합니다.

---

## 스트리밍을 지원하지 않는 환경을 위한 레거시 서버 API {/*legacy-server-apis-for-non-streaming-environments*/}

다음 메서드들은 Stream을 지원하지 않는 환경에서 사용할 수 있습니다.

* [`renderToString`](/reference/react-dom/server/renderToString)은 React 트리를 문자열로 렌더링합니다.
* [`renderToStaticMarkup`](/reference/react-dom/server/renderToStaticMarkup)은 상호작용하지 않는 React 트리를 문자열로 렌더링합니다.

위 메서드들은 스트리밍 API와 비교하여 기능이 제한적입니다.
