---
title: Server React DOM APIs
---

<Intro>

`react-dom/server` API를 사용하면 React 컴포넌트를 서버 측에서 HTML로 렌더링할 수 있습니다. 이 API는 앱의 최상위 레벨에 있는 서버에서만 초기 HTML을 생성하는 데 사용됩니다. [프레임워크](/learn/start-a-new-react-project#production-grade-react-frameworks)가 대신 호출할 수도 있습니다. 대부분의 컴포넌트는 이를 가져오거나 사용할 필요가 없습니다.

</Intro>

---

## Server APIs for Node.js Streams {/*server-apis-for-nodejs-streams*/}

다음 메서드들은 [Node.js Stream](https://nodejs.org/api/stream.html)이 있는 환경에서만 사용할 수 있습니다.

* [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream)은 React 트리를 [Pipeable Node.js Stream](https://nodejs.org/api/stream.html)으로 렌더링합니다.

---

## Server APIs for Web Streams {/*server-apis-for-web-streams*/}

다음 메서드들은 브라우저, Deno 및 일부 최신 엣지 런타임을 포함하는 [Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)이 있는 환경에서만 사용할 수 있습니다.

* [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream)은 React 트리를 [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)으로 렌더링합니다.

---

## Legacy Server APIs for non-streaming environments {/*legacy-server-apis-for-non-streaming-environments*/}

다음 메서드들은 Stream을 지원하지 않는 환경에서 사용할 수 있습니다.

* [`renderToString`](/reference/react-dom/server/renderToString)은 React 트리를 문자열로 렌더링합니다.
* [`renderToStaticMarkup`](/reference/react-dom/server/renderToStaticMarkup)은 상호작용하지 않는 React 트리를 문자열로 렌더링합니다.

위 메서드들은 스트리밍 API와 비교하여 기능이 제한적입니다.
