---
title: hydrateRoot
---

<Intro>

`hydrateRoot`는 이전에 [`react-dom/server`](/reference/react-dom/server)로 생성된 HTML 콘텐츠를 가진 브라우저 DOM 노드 안에 React 컴포넌트를 표시할 수 있게 해줍니다.

```js
const root = hydrateRoot(domNode, reactNode, options?)
```

</Intro>

<InlineToc />

---

## 레퍼런스 {/*reference*/}

### `hydrateRoot(domNode, reactNode, options?)` {/*hydrateroot*/}

`hydrateRoot`를 호출하여 이미 서버 환경에서 렌더링된 기존 HTML에 React를 "붙여넣기" 합니다.

```js
import { hydrateRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = hydrateRoot(domNode, reactNode);
```

React는 `domNode` 내부에 존재하는 HTML에 연결되어, 그 내부의 DOM 관리를 맡게 됩니다. React로 완전히 구축된 앱은 일반적으로 루트 컴포넌트와 함께 하나의 `hydrateRoot` 호출만 가집니다.

[아래 예시를 참고하세요.](#usage)

#### 매개변수 {/*parameters*/}

* `domNode`: 서버에서 루트 요소<sup>Element</sup>로 렌더링된 [DOM 요소](https://developer.mozilla.org/en-US/docs/Web/API/Element).

* `reactNode`: 기존 HTML에 렌더링하기 위한 "React 노드" 입니다. 주로 `ReactDOM Server`의 `renderToPipeableStream(<App />)`와 같은 메서드로 렌더링된 `<App />`과 같은 JSX 조각들입니다.

* **optional** `options`: React 루트에 대한 옵션을 가진 객체입니다.
  * **optional** `onCaughtError`: React가 Error Boundary에서 오류를 잡았을 때 호출되는 콜백입니다. Error Boundary에서 잡은 `error`와 `componentStack`을 포함하는 `errorInfo` 객체와 함께 호출됩니다.
  * **optional** `onUncaughtError`: 오류가 Error Boundary에 의해 잡히지 않았을 때 호출되는 콜백입니다. 발생한 `error`와 `componentStack`을 포함하는 `errorInfo` 객체와 함께 호출됩니다.
  * **optional** `onRecoverableError`: React가 오류로부터 자동으로 복구될 때 호출되는 콜백입니. React가 던지는 `error`와 `componentStack`을 포함하는 `errorInfo` 객체와 함께 호출됩니다. 복구 가능한 오류는 원본 오류 원인을 `error.cause`로 포함할 수 있습니다.
  * **optional** `identifierPrefix`: React가 [`useId`](/reference/react/useId)에 의해 생성된 ID에 사용하는 문자열 접두사. 같은 페이지에서 여러개의 루트를 사용할 때 충돌을 피하는 데 유용합니다. 서버에서 사용한 값과 반드시 동일한 값이어야 합니다.

#### 반환값 {/*returns*/}

`hydrateRoot`는 [`render`](#root-render)와 [`unmount`](#root-unmount) 두 가지 메서드를 포함한 객체를 반환합니다.

#### 주의 사항 {/*caveats*/}

* `hydrateRoot()`는 렌더링된 컨텐츠가 서버에서 렌더링된 컨텐츠와 동일할 것을 기대합니다. 따라서 불일치 사항은 버그로 취급하고 수정해야 합니다.
* 개발 모드에서는 React가 Hydration 중 불일치에 대해 경고합니다. 불일치가 발생할 경우 속성 차이가 수정될 것이라는 보장은 없습니다. 이는 성능상의 이유로 중요한데, 대부분의 앱에서 불일치는 드물기 때문에 모든 마크업을 검증하는 것은 매우 비효율적이기 때문입니다.
* 앱에서 `hydrateRoot` 호출이 단 한번만 있을 가능성이 높습니다. 프레임워크를 사용한다면, 프레임워크가 이 호출을 대신 수행할 수도 있습니다.
* 앱을 사전에 렌더링된 HTML 없이 클라이언트에서 직접 렌더링한다면, `hydrateRoot()`는 지원되지 않습니다. [`createRoot()`](/reference/react-dom/client/createRoot)를 대신 사용해주세요.

---

### `root.render(reactNode)` {/*root-render*/}

브라우저 DOM 요소 내에서 Hydrate된 React 루트 안의 React 컴포넌트를 업데이트 하려면 `root.render`를 호출하세요.

```js
root.render(<App />);
```

React는 Hydrate된 `root`에서 `<App />`을 업데이트합니다.

[아래 예시를 참고하세요.](#usage)

#### 매개변수 {/*root-render-parameters*/}

* `reactNode`: 업데이트하고 싶은 "React 노드"입니다. 주로 `<App />`같은 JSX를 매개변수로 넘기지만, [`createElement()`](/reference/react/createElement)로 만든 React 요소 혹은 문자열, 숫자, `null`, `undefined`를 넘겨도 됩니다.

#### 반환값 {/*root-render-returns*/}

`root.render`는 `undefined`를 반환합니다.

#### 주의 사항 {/*root-render-caveats*/}

* 루트가 Hydrate를 완료하기 전에 `root.render`를 호출하면, React는 서버에서 렌더링된 HTML을 모두 없애고 클라이언트에서 렌더링된 컴포넌트들로 완전히 교체합니다.

---

### `root.unmount()` {/*root-unmount*/}

`root.unmount`를 호출하면 React 루트 내부에서 렌더링된 트리를 삭제합니다.

```js
root.unmount();
```

온전히 React만으로 작성된 앱에는 일반적으로 `root.unmount`에 대한 호출이 없습니다.

이 함수는 주로 React 루트의 DOM 노드(또는 그 조상 노드)가 다른 코드에 의해 DOM에서 제거될 수 있는 경우에 유용합니다. 예를 들어 DOM에서 비활성 탭을 제거하는 jQuery 탭 패널을 상상해 보세요. 탭이 제거되면 그 안에 있는 모든 것(내부의 React 루트를 포함)이 DOM에서 제거됩니다. 이 경우 `root.unmount`를 호출하여 제거된 루트의 콘텐츠 관리를 "중지"하도록 React에 지시해야 합니다. 그렇지 않으면 제거된 루트 내부의 컴포넌트는 구독과 같은 전역 리소스를 정리하고 확보하는 법을 모르는 채로 있게 됩니다.

`root.unmount`를 호출하면 루트에 있는 모든 컴포넌트가 마운트 해제되고, 트리상의 이벤트 핸들러나 State가 제거되며, 루트 DOM 노드에서 React가 "분리"됩니다.
Calling `root.unmount` will unmount all the components in the root and "detach" React from the root DOM node, including removing any event handlers or state in the tree.

#### 매개변수 {/*root-unmount-parameters*/}

`root.unmount`는 매개변수를 받지 않습니다.


#### Returns {/*root-unmount-returns*/}

`root.unmount` returns `undefined`.

#### 주의 사항 {/*root-unmount-caveats*/}

* `root.unmount`를 호출하면 트리의 모든 컴포넌트가 마운트 해제되고 루트 DOM 노드에서 React가 "분리"됩니다.

* `root.unmount`를 한 번 호출한 후에는 같은 루트에서 `root.render`를 다시 호출할 수 없습니다. 마운트 해제된 루트에서 `root.render`를 호출하려고 하면 "마운트 해제된 루트를 업데이트할 수 없습니다.<sup>Cannot update an unmounted root</sup>" 오류가 발생합니다.

---

## 사용법 {/*usage*/}

### 서버에서 렌더링된 HTML을 Hydrate하기 {/*hydrating-server-rendered-html*/}

[`react-dom/server`](/reference/react-dom/client/createRoot)로 앱의 HTML을 생성했다면, 클라이언트에서 *Hydrate* 해주어야 합니다.

```js [[1, 3, "document.getElementById('root')"], [2, 3, "<App />"]]
import { hydrateRoot } from 'react-dom/client';

hydrateRoot(document.getElementById('root'), <App />);
```

위 코드를 통해 서버 HTML을 <CodeStep step={1}>브라우저 DOM 노드</CodeStep>에서 <CodeStep step={2}>React 컴포넌트</CodeStep>를 이용해 Hydrate 해줄 것 입니다. 주로 앱을 시작할 때 단 한 번 실행할 것입니다. 프레임워크를 사용중이라면 프레임워크가 대신 실행해 줄 것입니다.

앱을 Hydrate 하기 위해서 React는 컴포넌트의 로직을 사전에 서버에서 만들어 진 HTML에 "붙여넣을"것 입니다. Hydration을 통해 서버에서 만들어진 최초의 HTML 스냅샷을 브라우저에서 완전히 인터랙티브한 앱으로 바꿔주게 됩니다.

<Sandpack>

```html public/index.html
<!--
  <div id="root">...</div> 안의 HTML 내용들은
  react-dom/server으로 만들어진 App입니다.
-->
<div id="root"><h1>Hello, world!</h1><button>You clicked me <!-- -->0<!-- --> times</button></div>
```

```js src/index.js active
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(
  document.getElementById('root'),
  <App />
);
```

```js src/App.js
import { useState } from 'react';

export default function App() {
  return (
    <>
      <h1>Hello, world!</h1>
      <Counter />
    </>
  );
}

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      You clicked me {count} times
    </button>
  );
}
```

</Sandpack>

`hydrateRoot`를 다시 호출하거나 다른 곳에서 더 호출할 필요는 없습니다. 이 시점부터 React가 애플리케이션의 DOM을 다루게 됩니다. 대신 UI를 갱신하기 위해선 [State를 사용](/reference/react/useState)해야 합니다.

<Pitfall>

`hydrateRoot`에 전달한 React 트리는 서버에서 만들었던 React 트리 결과물과 동일해야 합니다.

이는 사용자 경험을 위해서 중요합니다. 사용자는 서버에서 만들어진 HTML을 자바스크립트 코드가 로드될 때까지 둘러보게 됩니다. 앱의 로딩을 더 빠르게 하기 위해 서버는 일종의 신기루로서 React 결과물인 HTML 스냅샷을 만들어 보여줍니다. 갑자기 다른 컨텐츠를 보여주게 되면 신기루가 깨져버리게 됩니다. 이런 이유로 서버에서 렌더링한 결과물과 클라이언트에서 최초로 렌더링한 결과물이 같아야 합니다.

주로 아래와 같은 원인들로 Hydration 오류가 일어납니다.

* React를 통해 만들어진 HTML의 루트 노드안에 공백 혹은 개행같은 추가적인 공백.
* `typeof window !== 'undefined'`과 같은 조건을 렌더링 로직에서 사용.
* [`window.matchMedia`](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia)같은 브라우저에서만 사용가능한 API를 렌더링 로직에 사용.
* 서버와 클라이언트에서 서로 다른 데이터를 렌더링.

React는 Hydration 오류에서 복구됩니다, 하지만 **다른 버그들과 같이 반드시 고쳐줘야 합니다.** 가장 나은 경우는 그저 느려지기만 할 뿐이지만, 최악의 경우엔 이벤트 핸들러가 다른 요소<sup>Element</sup>에 붙어버립니다.

</Pitfall>

---

### `document` 전체를 Hydrate하기 {/*hydrating-an-entire-document*/}

React로 앱을 모두 만들었을 경우 [`<html>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/html) 태그를 포함해 JSX로 된 전체 `document`를 렌더링할 수 있습니다.

```js {3,13}
function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css"></link>
        <title>My app</title>
      </head>
      <body>
        <Router />
      </body>
    </html>
  );
}
```

전체 `document`를 Hydrate하기 위해선 전역 변수인 [`document`](https://developer.mozilla.org/en-US/docs/Web/API/Window/document)를 `hydrateRoot`의 첫번째 인수로 넘깁니다.

```js {4}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

---

### 어쩔 수 없는 Hydration 불일치 오류 억제하기 {/*suppressing-unavoidable-hydration-mismatch-errors*/}

어떤 요소<sup>Element</sup>의 속성이나 텍스트 컨텐츠가 서버와 클라이언트에서 어쩔 수 없이 다를 땐(예를 들어, timestamp를 이용했다거나), Hydration 불일치 경고를 안보이게 할 수 있습니다.

해당 요소에서 Hydration 경고를 끄기 위해선 `suppressHydrationWarning={true}`를 추가하면 됩니다.

<Sandpack>

```html public/index.html
<!--
  <div id="root">...</div> 안의 HTML 내용들은
  react-dom/server으로 만들어진 App입니다.
-->
<div id="root"><h1>Current Date: <!-- -->01/01/2020</h1></div>
```

```js src/index.js
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document.getElementById('root'), <App />);
```

```js src/App.js active
export default function App() {
  return (
    <h1 suppressHydrationWarning={true}>
      Current Date: {new Date().toLocaleDateString()}
    </h1>
  );
}
```

</Sandpack>

이것은 한 단계 아래까지만 적용되며 탈출구<sup>Escape Hatch</sup>를 의도한 것입니다. 남용하지 마세요. 텍스트 컨텐츠가 아닌 한 React는 잘못된 부분을 수정하지 않을 것이며, 갱신이 일어나기 전까지는 불일치 상태로 남아있을 것입니다.

---

### 서로 다른 클라이언트와 서버 컨텐츠 다루기 {/*handling-different-client-and-server-content*/}

의도적으로 서버와 클라이언트에서 서로 다른 내용을 렌더링하길 원한다면, 서버와 클라이언트에서 서로 다른 방법으로 렌더링하면 됩니다. 클라이언트에서 서버와는 다른 것을 렌더링할 때 클라이언트에선 [Effect](/reference/react/useEffect)에서 `true`로 할당되는 `isClient`같은 [State 변수](/reference/react/useState)를 읽을 수 있습니다.

<Sandpack>

```html public/index.html
<!--
  <div id="root">...</div> 안의 HTML 내용들은
  react-dom/server으로 만들어진 App입니다.
-->
<div id="root"><h1>Is Server</h1></div>
```

```js src/index.js
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document.getElementById('root'), <App />);
```

{/* kind of an edge case, seems fine to use this hack here */}
```js src/App.js active
import { useState, useEffect } from "react";

export default function App() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <h1>
      {isClient ? 'Is Client' : 'Is Server'}
    </h1>
  );
}
```

</Sandpack>

이 방법은 처음엔 서버와 동일한 결과물을 렌더링하여 불일치 문제를 피하고, Hydration 후에 새로운 결과물이 동기적으로 렌더링됩니다.

<Pitfall>

이 방법은 두 번 렌더링해야 하기 때문에 Hydration을 느리게 합니다. 느린 통신 상태일 경우에 사용자 경험을 염두하세요. 초기 HTML이 렌더링된 한참 후에야 자바스크립트 코드를 불러옵니다. 따라서 Hydration 이후에 바로 다른 UI를 렌더링하는 것은 사용자에게 UI가 삐걱거리는 것처럼 보일 수 있습니다.

</Pitfall>

---

### Hydration된 루트 컴포넌트를 업데이트하기 {/*updating-a-hydrated-root-component*/}

루트의 Hydration이 끝난 후에, [`root.render`](#root-render)를 호출해 React 컴포넌트의 루트를 업데이트 할 수 있습니다. **[`createRoot`](/reference/react-dom/client/createRoot)와는 다르게 HTML로 최초의 컨텐츠가 이미 렌더링 되어 있기 때문에 자주 사용할 필요는 없습니다.**

Hydration 후 어떤 시점에 `root.render`를 호출한다면, 그리고 컴포넌트의 트리 구조가 이전에 렌더링했던 구조와 일치한다면, React는 [State를 그대로 보존합니다.](/learn/preserving-and-resetting-state) 입력 창<sup>Input</sup>에 어떻게 타이핑하든지 간에 문제가 발생하지 않습니다. 즉, 아래 예시에서처럼 매초 마다 상태를 업데이트하는 반복적인 `render`를 문제 없이 렌더링 한다는 것을 알 수 있습니다.

<Sandpack>

```html public/index.html
<!--
  <div id="root">...</div>안의 모든 HTML 컨텐츠는 react-dom/server를 통해 만들어 렌더링한 <App />입니다.
-->
<div id="root"><h1>Hello, world! <!-- -->0</h1><input placeholder="Type something here"/></div>
```

```js src/index.js active
import { hydrateRoot } from 'react-dom/client';
import './styles.css';
import App from './App.js';

const root = hydrateRoot(
  document.getElementById('root'),
  <App counter={0} />
);

let i = 0;
setInterval(() => {
  root.render(<App counter={i} />);
  i++;
}, 1000);
```

```js src/App.js
export default function App({counter}) {
  return (
    <>
      <h1>Hello, world! {counter}</h1>
      <input placeholder="Type something here" />
    </>
  );
}
```

</Sandpack>

Hydration된 루트에서 [`root.render`](#root-render)를 호출하는 것은 흔한 일은 아닙니다. 내부 컴포넌트 중 한 곳에서 [useState](/reference/react/useState)를 사용하는 것이 일반적입니다.

### 프로덕션 환경에서 오류 로깅하기 {/*error-logging-in-production*/}

React는 기본적으로 모든 오류를 콘솔에 출력합니다. 사용자 정의 오류 보고 기능을 구현하기 위해서 `onUncaughtError`, `onCaughtError`, `onRecoverableError`와 같은 에러 핸들러 루트 옵션을 제공할 수 있습니다.

```js [[1, 7, "onCaughtError"], [2, 7, "error", 1], [3, 7, "errorInfo"], [4, 11, "componentStack", 15]]
import { hydrateRoot } from "react-dom/client";
import App from "./App.js";
import { reportCaughtError } from "./reportError";

const container = document.getElementById("root");
const root = hydrateRoot(container, <App />, {
  onCaughtError: (error, errorInfo) => {
    if (error.message !== "Known error") {
      reportCaughtError({
        error,
        componentStack: errorInfo.componentStack,
      });
    }
  },
});
```

<CodeStep step={1}>onCaughtError</CodeStep> 옵션은 다음 두 개의 인자를 받는 함수입니다.

1. 발생한 <CodeStep step={2}>error</CodeStep> 객체.
2. 오류의 <CodeStep step={4}>componentStack</CodeStep> 정보를 포함한 <CodeStep step={3}>errorInfo</CodeStep> 객체.

`onUncaughtError`와 `onRecoverableError`를 함께 사용하면, 사용자 정의 오류 보고 시스템을 구현할 수 있습니다.

<Sandpack>

```js src/reportError.js
function reportError({ type, error, errorInfo }) {
  // 구체적인 구현은 여러분에게 맡깁니다.
  // `console.error()`는 설명을 위한 용도입니다.
  console.error(type, error, "Component Stack: ");
  console.error("Component Stack: ", errorInfo.componentStack);
}

export function onCaughtErrorProd(error, errorInfo) {
  if (error.message !== "Known error") {
    reportError({ type: "Caught", error, errorInfo });
  }
}

export function onUncaughtErrorProd(error, errorInfo) {
  reportError({ type: "Uncaught", error, errorInfo });
}

export function onRecoverableErrorProd(error, errorInfo) {
  reportError({ type: "Recoverable", error, errorInfo });
}
```

```js src/index.js active
import { hydrateRoot } from "react-dom/client";
import App from "./App.js";
import {
  onCaughtErrorProd,
  onRecoverableErrorProd,
  onUncaughtErrorProd,
} from "./reportError";

const container = document.getElementById("root");
hydrateRoot(container, <App />, {
  // 개발 환경에서는 이 옵션들을 제거하고
  // React의 기본 핸들러를 사용하거나 직접 오버레이를 구현하는 것을 권장합니다.
  // 여기서는 편의를 위해 조건 없이 핸들러를 지정했습니다.
  onCaughtError: onCaughtErrorProd,
  onRecoverableError: onRecoverableErrorProd,
  onUncaughtError: onUncaughtErrorProd,
});
```

```js src/App.js
import { Component, useState } from "react";

function Boom() {
  foo.bar = "baz";
}

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

export default function App() {
  const [triggerUncaughtError, settriggerUncaughtError] = useState(false);
  const [triggerCaughtError, setTriggerCaughtError] = useState(false);

  return (
    <>
      <button onClick={() => settriggerUncaughtError(true)}>
        Trigger uncaught error
      </button>
      {triggerUncaughtError && <Boom />}
      <button onClick={() => setTriggerCaughtError(true)}>
        Trigger caught error
      </button>
      {triggerCaughtError && (
        <ErrorBoundary>
          <Boom />
        </ErrorBoundary>
      )}
    </>
  );
}
```

```html public/index.html hidden
<!DOCTYPE html>
<html>
<head>
  <title>My app</title>
</head>
<body>
<!--
  Purposefully using HTML content that differs from the server-rendered content to trigger recoverable errors.
-->
<div id="root">Server content before hydration.</div>
</body>
</html>
```
</Sandpack>

## 문제 해결 {/*troubleshooting*/}


### 다음과 같은 오류가 발생합니다: "You passed a second argument to root.render" {/*im-getting-an-error-you-passed-a-second-argument-to-root-render*/}

`hydrateRoot` 옵션을 `root.render(...)`에 전달하는 실수가 흔히 일어나곤 합니다.

<ConsoleBlock level="error">

Warning: You passed a second argument to root.render(…) but it only accepts one argument.

</ConsoleBlock>

수정하려면 루트 옵션을 `root.render(...)` 대신  `hydrateRoot(...)`에 전달하세요.
```js {2,5}
// 🚩 잘못된 방법: `root.render`는 하나의 인수만 받습니다.
root.render(App, {onUncaughtError});

// ✅ 올바른 방법: 옵션을 `createRoot`에 전달하세요.
const root = hydrateRoot(container, <App />, {onUncaughtError});
```
