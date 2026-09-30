---
title: Static React DOM APIs
---

<Intro>

`react-dom/static` API를 사용하면 React 컴포넌트의 정적 HTML을 생성할 수 있습니다. 이 API는 스트리밍 API와 비교해 기능이 제한적입니다. [프레임워크](/learn/creating-a-react-app#full-stack-frameworks)가 대신 호출할 수도 있습니다. 대부분의 컴포넌트는 이를 import하거나 사용할 필요가 없습니다.

</Intro>

---

## Web 스트림용 정적 API {/*static-apis-for-web-streams*/}

다음 메서드들은 브라우저, Deno, 및 일부 최신 엣지 런타임을 포함하는 [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) 환경에서만 사용할 수 있습니다.

* [`prerender`](/reference/react-dom/static/prerender)는 React 트리를 [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)을 사용해 정적 HTML로 렌더링합니다.
* <ExperimentalBadge /> [`resumeAndPrerender`](/reference/react-dom/static/resumeAndPrerender)는 사전 렌더링된 React 트리를 [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)을 사용해 정적 HTML로 이어서 렌더링합니다.

Node.js에도 호환성을 위해 이 메서드들이 포함되어 있지만, 성능이 더 낮아 권장되지 않습니다. 대신 [전용 Node.js API](#static-apis-for-nodejs-streams)를 사용하세요.

---

## Node.js 스트림용 정적 API {/*static-apis-for-nodejs-streams*/}

다음 메서드들은 [Node.js Streams](https://nodejs.org/api/stream.html) 환경에서만 사용할 수 있습니다.

* [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream)은 React 트리를 [Node.js Stream](https://nodejs.org/api/stream.html)을 사용해 정적 HTML로 렌더링합니다.
* <ExperimentalBadge /> [`resumeAndPrerenderToNodeStream`](/reference/react-dom/static/resumeAndPrerenderToNodeStream)은 사전 렌더링된 React 트리를 [Node.js Stream](https://nodejs.org/api/stream.html)을 사용해 정적 HTML로 이어서 렌더링합니다.
