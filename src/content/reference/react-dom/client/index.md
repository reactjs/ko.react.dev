---
title: Client React DOM APIs
---

<Intro>

The `react-dom/client` APIs let you render React components on the client (in the browser). These APIs are typically used at the top level of your app to initialize your React tree. A [framework](/learn/start-a-new-react-project#full-stack-frameworks) may call them for you. Most of your components don't need to import or use them.

</Intro>

---

## Client APIs {/*client-apis*/}

* [`createRoot`](/reference/react-dom/client/createRoot)를 사용하면 브라우저 DOM 노드 안에 React 컴포넌트를 표시하는 루트를 생성할 수 있습니다.
* [`hydrateRoot`](/reference/react-dom/client/hydrateRoot)를 사용하면 이전에 [`react-dom/server`](/reference/react-dom/server)에 의해 생성된 HTML 콘텐츠가 있는 브라우저 DOM 노드 안에 React 컴포넌트를 표시할 수 있습니다.
---

## 지원 브라우저 {/*browser-support*/}

React는 Internet Explorer 9 이상을 포함한 모든 대중적인 브라우저를 지원합니다. IE 9, IE 10 이하 같은 구형 브라우저에서는 일부 폴리필이 필요합니다.
