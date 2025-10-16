---
title: Static React DOM APIs
---

<Intro>

The `react-dom/static` APIs let you generate static HTML for React components. They have limited functionality compared to the streaming APIs. A [framework](/learn/start-a-new-react-project#full-stack-frameworks) may call them for you. Most of your components don't need to import or use them.

</Intro>

---

## Static APIs for Web Streams {/*static-apis-for-web-streams*/}

다음 메서드들은 브라우저, Deno, 및 일부 최신 엣지 런타임을 포함하는 [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) 환경에서만 사용할 수 있습니다.

* [`prerender`](/reference/react-dom/static/prerender) renders a React tree to static HTML with a [Readable Web Stream.](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)
* <ExperimentalBadge /> [`resumeAndPrerender`](/reference/react-dom/static/resumeAndPrerender) continues a prerendered React tree to static HTML with a [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream).

Node.js also includes these methods for compatibility, but they are not recommended due to worse performance. Use the [dedicated Node.js APIs](#static-apis-for-nodejs-streams) instead.

---

## Static APIs for Node.js Streams {/*static-apis-for-nodejs-streams*/}

다음 메서드들은 [Node.js Streams](https://nodejs.org/api/stream.html) 환경에서만 사용할 수 있습니다.

* [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream) renders a React tree to static HTML with a [Node.js Stream.](https://nodejs.org/api/stream.html)
* <ExperimentalBadge /> [`resumeAndPrerenderToNodeStream`](/reference/react-dom/static/resumeAndPrerenderToNodeStream) continues a prerendered React tree to static HTML with a [Node.js Stream.](https://nodejs.org/api/stream.html)

