---
title: Client React DOM APIs
---

<Intro>

`react-dom/client` API를 사용하면 클라이언트(브라우저)에서 React 컴포넌트를 렌더링 할 수 있습니다. 이러한 API는 일반적으로 앱의 최상위 수준에서 React 트리를 초기화하기 위해 사용됩니다. [프레임워크](/learn/start-a-new-react-project#production-grade-react-frameworks) 대신 호출할 수도 있습니다. 대부분의 컴포넌트는 이를 가져오거나 사용할 필요가 없습니다.
</Intro>

---

## Client APIs {/*client-apis*/}

* [`createRoot`](/reference/react-dom/client/createRoot)를 사용하면 브라우저 DOM 노드 안에 React 컴포넌트를 표시하는 루트를 생성할 수 있습니다.
* [`hydrateRoot`](/reference/react-dom/client/hydrateRoot)를 사용하면 이전에 [`react-dom/server`.](/reference/react-dom/server)에 의해 생성된 HTML 콘텐츠가 있는 브라우저 DOM 노드 내에 React 컴포넌트를 표시할 수 있습니다.
---

## 지원 브라우저 {/*browser-support*/}

React는 Internet Explorer 9 이상을 포함한 모든 인기 브라우저를 지원합니다. IE 9, IE 10 이하 같은 구형 브라우저에서는 일부 폴리필이 필요합니다.
