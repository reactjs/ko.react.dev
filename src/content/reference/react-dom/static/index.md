---
title: Static React DOM APIs
---

<Intro>

<<<<<<< HEAD
`react-dom/static` API를 사용하면 React 컴포넌트를 위한 정적 HTML을 생성할 수 있습니다. 이는 스트리밍 API에 비해 제한된 기능을 가지고 있습니다. [프레임워크](/learn/start-a-new-react-project#production-grade-react-frameworks)가 대신 호출할 수도 있습니다. 대부분의 컴포넌트는 이를 가져오거나 사용할 필요가 없습니다.
=======
The `react-dom/static` APIs let you generate static HTML for React components. They have limited functionality compared to the streaming APIs. A [framework](/learn/start-a-new-react-project#full-stack-frameworks) may call them for you. Most of your components don't need to import or use them.
>>>>>>> e9a7cb1b6ca1659b42d81555ecef0cd554b7a983

</Intro>

---

## Static APIs for Web Streams {/*static-apis-for-web-streams*/}

다음 메서드들은 브라우저, Deno, 및 일부 최신 엣지 런타임을 포함하는 [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) 환경에서만 사용할 수 있습니다.

* [`prerender`](/reference/react-dom/static/prerender)는 React 트리를 [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)을 사용하여 정적 HTML로 렌더링합니다.


---

## Static APIs for Node.js Streams {/*static-apis-for-nodejs-streams*/}

다음 메서드들은 [Node.js Streams](https://nodejs.org/api/stream.html) 환경에서만 사용할 수 있습니다.

* [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream)은 React 트리를 [Node.js Stream](https://nodejs.org/api/stream.html)을 사용하여 정적 HTML로 렌더링합니다.


