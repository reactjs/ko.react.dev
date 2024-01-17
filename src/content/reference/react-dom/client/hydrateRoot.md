---
title: hydrateRoot
---

<Intro>

`hydrateRoot`는 [`react-dom/server`](/reference/react-dom/server)를 통해 사전에 만들어진 HTML로 그려진 브라우저 DOM 노드 내부에 React 컴포넌트를 렌더링합니다.

```js
const root = hydrateRoot(domNode, reactNode, options?)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `hydrateRoot(domNode, reactNode, options?)` {/*hydrateroot*/}

서버 환경에서 React로 앞서 만들어진 HTML에 후에 만들어진 React를 `hydrateRoot`를 호출해 "붙입니다".

```js
import { hydrateRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = hydrateRoot(domNode, reactNode);
```

React는 `domNode` 내부의 HTML에 붙어, 내부 DOM을 직접 관리할 것입니다. App을 React로 전부 만들었다면 보통은 단 하나의 root component와 함께 `hydrateRoot`를 한 번 호출할 것입니다.

[아래 여러 예시를 확인해보세요.](#usage)

#### Parameters {/*parameters*/}

* `domNode`: 서버에서 root element로 렌더링된 [DOM element](https://developer.mozilla.org/en-US/docs/Web/API/Element)

* `reactNode`: 앞서 존재하는 HTML에 렌더링하기 위한 "React 노드" 입니다. 주로 `ReactDOM Server`의 `renderToPipeableStream(<App />)`와 같은 메소드로 렌더링된  `<App />`같은 JSX 조각들입니다.

* **optional** `options`: React root에 옵션을 주기 위한 객체입니다.

  * **optional** `onRecoverableError`: React가 에러에서 자동으로 회복되었을 때 호출하는 콜백함수.
  * **optional** `identifierPrefix`: React가 ID로 사용하는 접두사로 [`useId`](/reference/react/useId)로 만들어진 값입니다. 같은 페이지에서 여러 root를 사용할 때 충돌을 피할 때 유용하게 사용할 수 있습니다. 서버에서 사용한 값과 반드시 동일한 값이어야 합니다.

#### Returns {/*returns*/}

`hydrateRoot`는 2가지 메소드가 포함된 객체를 반환합니다 : [`render`](#root-render) 그리고 [`unmount`.](#root-unmount)

#### Caveats {/*caveats*/}

* `hydrateRoot()`는 서버에서 렌더링된 내용과 후에 렌더링된 내용이 동일할 것을 기대합니다. 따라서 동일하지 않은 부분들은 직접 버그로 취급해주거나 고쳐줘야 합니다.
* 개발 모드에선, React가 hydration 중에 동일하지 않은 부분에 대해 경고해줍니다. 속성이 동일하지 않을 경우에 해당 속성이 올바르게 적용될 것이라고 보장할 수 없습니다. 모든 markup을 보장하지 않는 것은 성능면에서 중요하기 때문입니다. markup이 동일하지 않는 경우는 드물기 때문에 모든 markup을 검증하는 비용은 굉장히 비쌉니다.
* 여러분은 App에서 `hydrateRoot`를 단 한 번만 호출하게 될 것입니다. 만약 프레임워크를 사용한다면, 프레임워크가 대신 호출해 줄 것입니다.
* App을 사전에 렌더링된 HTML 없이 클라이언트에서 직접 렌더링을 한다면 `hydrateRoot()`은 지원되지 않습니다. [`createRoot()`](/reference/react-dom/client/createRoot)를 대신 사용해주세요.

---

### `root.render(reactNode)` {/*root-render*/}

hydrate된 React root부터 내부 컴포넌트를 새로운 React 컴포넌트로 갱신하기 위해 `root.render`를 호출해주세요. 브라우저 DOM 요소들도 함께 갱신됩니다.

```js
root.render(<App />);
```

React는 hydrate된 `root`부터 내부를 `<App />`으로 갱신합니다.

[아래 예시를 확인해보세요.](#usage)

#### Parameters {/*root-render-parameters*/}

* `reactNode`: 갱신하고 싶은 "React 노드"입니다. 주로 `<App />`같은 JSX를 파라미터로 넘기지만, [`createElement()`](/reference/react/createElement)로 만든 React 엘리먼트를 넘겨도 되고 문자열이나 숫자, `null`, 혹은 `undefined`를 넘겨도 됩니다.

#### Returns {/*root-render-returns*/}

`root.render`는 `undefined`를 반환합니다.

#### Caveats {/*root-render-caveats*/}

* hydrate가 끝나기 전에 `root.render`를 호출하면 React는 서버에서 렌더링된 HTML을 모두 없애고 클라이언트에서 렌더링된 컴포넌트들로 완전히 교체합니다.

---

### `root.unmount()` {/*root-unmount*/}

`root.unmount`를 호출해 React root부터 그 하위에 렌더링된 트리를 삭제합니다.

```js
root.unmount();
```

처음부터 끝까지 React로 만든 앱은 `root.unmount`를 호출할 경우가 거의 없습니다.

주로 React root부터 혹은 그 상위에서부터 시작된 DOM node들을 다른 코드에 의해 DOM에서 삭제되어야 하는 경우 유용합니다. 예를 들어, jQuery 탭 패널이 활성화 되어 있지 않은 탭을 DOM에서 지운다고 가정해봅시다. 탭이 지워지면, React root와 그 내부를 포함해 그 안의 모든 것이 지워지게 되고 DOM에서 또한 지워지게 됩니다. `root.unmount`를 호출해 React에게 삭제된 컨텐츠들을 "그만" 다루라고 알려주어야 합니다. 그렇지 않으면 삭제되어버린 React root 내부의 컴포넌트들은 삭제되지 않을 것이며, "구독"처럼 컴퓨팅 자원을 자유롭게 놓아주지 못하게 됩니다.

`root.unmount`를 호출하면 root 내부의 모든 컴포넌트를 unmount하고 root DOM node에서 React를 "떼어"냅니다. root 내부의 event handler와 state까지 모두 포함해 unmount 및 삭제됩니다.

#### Parameters {/*root-unmount-parameters*/}

`root.unmount`는 그 어떤 파라미터도 받지 않습니다.


#### Returns {/*root-unmount-returns*/}

`root.unmount` returns `undefined`.

#### Caveats {/*root-unmount-caveats*/}

* `root.unmount`를 호출하면 root부터 그 안의 모든 컴포넌트가 unmount되고 root DOM node에서 React를 떼어냅니다.

* `root.unmount`를 한번 호출한 이후엔 `root.render`를 root에 다시 사용할 수 없습니다. unmount된 root에 다시 `root.render`를 호출하려고 한다면 "Cannot update an unmounted root" 에러를 throw하게 됩니다.

---

## 사용 예시 {/*usage*/}

### 서버에서 렌더링된 HTML을 hydrate하기 {/*hydrating-server-rendered-html*/}

[`react-dom/server`](/reference/react-dom/client/createRoot)로 앱의 HTML을 생성했다면, 클라이언트에서 *hydrate*해주어야 합니다.

```js [[1, 3, "document.getElementById('root')"], [2, 3, "<App />"]]
import { hydrateRoot } from 'react-dom/client';

hydrateRoot(document.getElementById('root'), <App />);
```

위 코드를 통해 서버 HTML을 <CodeStep step={1}>브라우저 DOM node</CodeStep>에서 <CodeStep step={2}>React 컴포넌트</CodeStep>를 이용해 hydrate 해줄 것 입니다. 주로 앱을 시작할 때 단 한 번 실행하게 될 것입니다. 프레임워크를 사용중이라면 프레임워크가 알아서 실행해 줄 것입니다.

앱을 hydrate하기 위해서 React는 컴포넌트의 로직을 사전에 서버에서 만들어 진 HTML에 "붙일"것 입니다. Hydration을 통해 서버에서 만들어진 최초의 HTML 스냅샷을 브라우저에서 완전히 인터랙티브한 앱으로 바꿔주게 됩니다.

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

`hydrateRoot`를 다시 호출하거나 다른 곳에서 더 호출할 필요는 없습니다. 이 시점부터 React가 애플리케이션의 DOM을 다루게 됩니다. 대신 UI를 갱신하기 위해선 [state를 사용](/reference/react/useState)해야 합니다.

<Pitfall>

`hydrateRoot`에 전달한 React 트리는 서버에서 만들었던 React 트리 결과물과 동일해야 합니다.

이는 사용자 경험을 위해서 중요합니다. 유저는 서버에서 만들어진 HTML을 JavaScript 코드가 로드될 때까지 둘러보게 됩니다. 앱의 로딩을 더 빠르게 하기 위해 서버는 일종의 신기루로서 React 결과물인 HTML 스냅샷을 만들어 보여줍니다. 갑자기 다른 컨텐츠를 보여주게 되면 신기루가 깨져버리게 됩니다. 이런 이유로 서버에서 렌더링한 결과물과 클라이언트에서 최초로 렌더링한 결과물이 같아야 합니다.

주로 아래와 같은 원인으로 hydration 에러가 일어납니다.

* React를 통해 만들어진 HTML의 root node안에 새 줄같은 추가적인 공백.
* `typeof window !== 'undefined'`과 같은 조건을 렌더링 로직에서 사용함.
* [`window.matchMedia`](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia)같은 브라우저에서만 사용가능한 API를 렌더링 로직에 사용함.
* 서버와 클라이언트에서 서로 다른 데이터를 렌더링함.

React는 hydration 에러에서 복구됩니다, 하지만 **다른 버그들과 같이 반드시 고쳐줘야 합니다.** 가장 나은 경우는 그저 느려지기만 할 뿐이지만, 최악의 경우엔 이벤트 핸들러가 다른 element에 붙어버립니다.

</Pitfall>

---

### document 전체를 hydrate하기 {/*hydrating-an-entire-document*/}

React로 앱을 모두 만들었을 경우 [`<html>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/html)태그를 포함해 JSX로 된 전체 document를 렌더링할 수 있습니다.

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

전체 document를 hydrate하기 위해선 글로벌 변수인 [`document`](https://developer.mozilla.org/en-US/docs/Web/API/Window/document)를 `hydrateRoot`의 첫번째 인자로 넘깁니다:

```js {4}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

---

### 어쩔 수 없는 hydration 불일치 에러 억제하기 {/*suppressing-unavoidable-hydration-mismatch-errors*/}

어떤 element의 속성이나 text content가 서버와 클라이언트에서 어쩔 수 없이 다를 땐(예를 들어, timestamp를 이용했다거나), hydration 불일치 경고를 안보이게 할 수 있습니다.

해당 element에서 hydration 경고를 끄기 위해선 `suppressHydrationWarning={true}`를 추가하면 됩니다.

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

이것은 한 단계 아래까지만 적용되며 비상 탈출구를 의도한 것입니다. 남용하지 마세요. text context가 아닌 한, React는 잘못된 부분을 수정하지 않을 것이며 갱신이 일어나기 전까지는 불일치한 상태로 남아있을 것입니다.

---

### 서로 다른 클라이언트와 서버 컨텐츠 다루기 {/*handling-different-client-and-server-content*/}

의도적으로 서버와 클라이언트에서 서로 다른 내용을 렌더링하길 원한다면, 서버와 클라이언트에서 서로 다른 방법으로 렌더링하면 됩니다. 클라이언트에서 서버와는 다른 것을 렌더링할 때 클라이언트에선 [Effect](/reference/react/useEffect)에서 `true`로 할당되는 `isClient`같은 [상태 변수](/reference/react/useState)를 읽을 수 있습니다.

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

이 방법은 처음엔 서버와 동일한 결과물을 렌더링하게 되어 불일치 문제를 피하게 되고, hydration후에 새로운 결과물이 동기적으로 렌더링됩니다.

<Pitfall>

이 방법은 2번 렌더링해야 하기 때문에 hydration을 느리게 합니다. 느린 통신 상태일 경우에 사용자 경험을 염두하세요. 초기 HTML이 렌더된 한참 이후에야 JavaScript 코드를 불러오게 됩니다. 따라서 hydration 이후에 바로 다른 UI를 렌더링하는 것은 유저에게 UI가 삐걱거리는 것처럼 보일 수 있습니다.

</Pitfall>

---

### hydrate된 root 컴포넌트를 업데이트하기 {/*updating-a-hydrated-root-component*/}

root의 hydrating이 끝난 이후에, [`root.render`](#root-render)를 호출해 React 컴포넌트의 root를 업데이트 할 수 있습니다. **[`createRoot`](/reference/react-dom/client/createRoot)와는 다르게 HTML로 최초의 컨텐츠가 이미 렌더링 되어 있기 때문에 자주 사용할 필요는 없습니다.**

hydration 후 어떤 시점에 `root.render`를 호출한다면, 그리고 컴포넌트의 트리 구조가 이전에 렌더링했던 구조와 일치한다면, React는 [상태를 그대로 보존합니다.](/learn/preserving-and-resetting-state) input에 어떻게 타이핑하는지에 따라 문제가 발생하지 않습니다. 즉, 아래 예시에서처럼 매초 마다 상태를 업데이트하는 반복적인 `render`는 문제 없이 렌더링 된다는 것을 볼 수 있습니다:

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

hydrate된 root에 [`root.render`](#root-render)를 호출하는 것은 흔한 일은 아닙니다. 내부 컴포넌트 중 한 곳에서 [상태 업데이트](/reference/react/useState)를 하는 것이 일반적입니다.
