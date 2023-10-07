---
title: hydrate
---

<Deprecated>

이 API는 향후 React의 주요 버전에서 제거될 예정입니다.

`hydrate`는 React 18에서 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot)로 바뀌었습니다. React 18에서 `hydrate`를 사용하면 앱이 React 17을 사용하는 것처럼 동작할 것이라는 경고가 표시됩니다. 더 자세한 내용은 [여기](/blog/2022/03/08/react-18-upgrade-guide#updates-to-client-rendering-apis)를 참고하세요.

</Deprecated>

<Intro>

React 17 이하에서, `hydrate`는 [`react-dom/server`](/reference/react-dom/server)로부터 생성된 React 컴포넌트의 HTML 콘텐츠를 브라우저 DOM 노드에 표시할 수 있도록 해줍니다.

```js
hydrate(reactNode, domNode, callback?)
```

</Intro>

<InlineToc />

---

## 레퍼런스 {/*reference*/}

### `hydrate(reactNode, domNode, callback?)` {/*hydrate*/}

React 17 이하에서 `hydrate`를 호출하면 React가 서버 환경에서 미리 렌더링한 HTML에 React를 연결(attach)할 수 있습니다.

```js
import { hydrate } from 'react-dom';

hydrate(reactNode, domNode);
```

React는 `domNode`에 있는 HTML에 연결되고, 그 내부의 DOM 관리를 맡습니다. React로 빌드된 앱은 보통 `hydrate`를 루트 컴포넌트에서 딱 한 번 실행합니다.

[더 다양한 예시를 읽어보세요.](#usage)

#### 매개변수 {/*parameters*/}

* `reactNode`: HTML을 렌더링하기 위해 사용되는 React 노드입니다. React 17의 `renderToString(<App />)`같은 `ReactDOM Server` 메서드로 렌더링 된 `<App />`처럼, 일반적으로 JSX 조각 형태입니다.

* `domNode`: 서버에서 루트 요소로 렌더링 된 [DOM 요소](https://developer.mozilla.org/en-US/docs/Web/API/Element)입니다.

* **optional**: `callback`: 컴포넌트가 hydrate 된 후 호출되는 함수입니다.

#### 반환 값 {/*returns*/}

`hydrate`는 null을 반환합니다.

#### 주의 사항 {/*caveats*/}
* `hydrate`는 클라이언트에서 렌더링 된 콘텐츠가 서버에서 렌더링 된 콘텐츠와 동일할 것이라고 예상합니다. 텍스트 콘텐츠의 차이 정도는 React가 조정할 수 있긴 하지만, 불일치는 버그로 간주하고 수정해야 합니다.
* 개발 모드에서 React는 hydration 중 일어난 불일치에 대해 경고합니다. 불일치하는 경우 어트리뷰트 차이가 조정된다는 보장은 없습니다. 이는 성능상의 이유로 중요한데, 대부분의 앱에서 불일치가 발생하는 경우는 드물기 때문에 모든 마크업의 유효성을 검사하는 데 엄청난 비용이 들기 때문입니다.
* 각 앱에서 `hydrate`는 한 번만 실행하세요. 프레임워크를 사용하는 경우 프레임워크가 대신 호출하고 있을 것입니다.
* 앱이 서버에서 렌더링 된 HTML 없이 클라이언트에서만 렌더링 되는 경우엔 `hydrate()`를 사용할 수 없습니다. 이럴 때는 [render()](/reference/react-dom/render)(React 17 이하) 또는 [createRoot()](/reference/react-dom/client/createRoot)(React 18+)를 사용하세요.

---

## 사용법 {/*usage*/}

`hydrate`로 <CodeStep step={1}>React 컴포넌트</CodeStep>를 서버에서 렌더링 된 <CodeStep step={2}>브라우저 DOM 노드</CodeStep>에 연결하세요.

```js [[1, 3, "<App />"], [2, 3, "document.getElementById('root')"]]
import { hydrate } from 'react-dom';

hydrate(<App />, document.getElementById('root'));
```

`hydrate()`로 클라이언트에서만 동작하는 (서버 측에서 렌더링 되는 HTML이 없는) 앱을 만들 순 없습니다. 이럴 때는 [render()](/reference/react-dom/render)(React 17 이하) 또는 [createRoot()](/reference/react-dom/client/createRoot)(React 18+)를 사용하세요.

### 서버에서 렌더링 된 HTML Hydrate 하기 {/*hydrating-server-rendered-html*/}

React에서 "hydration"은 React가 서버 환경에서 미리 렌더링한 HTML에 연결하는 방식을 말합니다. 클라이언트에서 hydration이 일어나면 React는 서버에서 생성된 마크업에 이벤트 리스너를 연결하고 앱 렌더링을 이어받으려고 합니다.

React로 빌드된 앱에서는 **보통 앱이 시작될 때 단 한 번 하나의 루트만 hydate 합니다**.

<Sandpack>

```html public/index.html
<!--
  <div id="root">...</div> 내의 HTML 콘텐츠는
  react-dom/server을 통해 App으로부터 생성된 부분입니다.
-->
<div id="root"><h1>Hello, world!</h1></div>
```

```js index.js active
import './styles.css';
import { hydrate } from 'react-dom';
import App from './App.js';

hydrate(<App />, document.getElementById('root'));
```

```js App.js
export default function App() {
  return <h1>Hello, world!</h1>;
}
```

</Sandpack>

대부분의 경우 `hydrate`를 다시 호출하거나 다른 곳에서 더 호출할 필요는 없습니다. React는 `hydrate`가 호출된 시점부터 애플리케이션의 DOM을 관리합니다. UI를 업데이트해야 한다면 [state를 사용하면 됩니다.](/reference/react/useState)

hydration에 대한 더 자세한 내용은 [`hydrateRoot` 문서](/reference/react-dom/client/hydrateRoot)를 참고하세요.

---

### 불가피한 hydration 불일치 에러 무시하기 {/*suppressing-unavoidable-hydration-mismatch-errors*/}

단일 요소의 어트리뷰트나 텍스트 콘텐츠가 서버와 클라이언트 간 다를 수밖에 없는 경우(예: 타임스탬프), hydration 불일치 경고를 무시하도록 처리할 수 있습니다.

hydration 경고를 무시하려면 `suppressHydrationWarning={true}`를 추가하세요.

<Sandpack>

```html public/index.html
<!--
  <div id="root">...</div> 내의 HTML 콘텐츠는
  react-dom/server을 통해 App으로부터 생성된 부분입니다.
-->
<div id="root"><h1>Current Date: 01/01/2020</h1></div>
```

```js index.js
import './styles.css';
import { hydrate } from 'react-dom';
import App from './App.js';

hydrate(<App />, document.getElementById('root'));
```

```js App.js active
export default function App() {
  return (
    <h1 suppressHydrationWarning={true}>
      Current Date: {new Date().toLocaleDateString()}
    </h1>
  );
}
```

</Sandpack>

이 방법은 한 레벨 깊이에서만 작동하며 임시방편일 뿐입니다. 텍스트 콘텐츠가 아닌 이상 React는 조정을 시도하지 않을 것이므로 향후 업데이트가 있을 때까지 일관적이지 않은 상태로 남을 수 있습니다. 남용하지 마세요.

---

### 서로 다른 클라이언트 및 서버 콘텐츠 처리하기 {/*handling-different-client-and-server-content*/}

서버와 클라이언트에서 의도적으로 다른 것을 렌더링하는 경우, 투 패스 렌더링(two-pass rendering)을 사용해 볼 수 있습니다. `isClient` 같은 [state](/reference/react/useState)를 선언해 [effect](/reference/react/useEffect)에서 `true`로 바꿔 사용하면 됩니다.

<Sandpack>

```html public/index.html
<!--
  <div id="root">...</div> 내의 HTML 콘텐츠는
  react-dom/server을 통해 App으로부터 생성된 부분입니다.
-->
<div id="root"><h1>Is Server</h1></div>
```

```js index.js
import './styles.css';
import { hydrate } from 'react-dom';
import App from './App.js';

hydrate(<App />, document.getElementById('root'));
```

```js App.js active
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

이렇게 하면 첫 번째 렌더링 패스(render pass)에서 서버와 같은 콘텐츠를 렌더링하므로 불일치를 피할 수 있으면서도, hydration 직후 추가 렌더링 패스가 동기적으로 발생하도록 할 수 있습니다.

<Pitfall>

이 방법을 사용하면 컴포넌트가 두 번 렌더링 되어야 하므로 hydration 속도가 느려집니다. 자바스크립트 코드는 초기 HTML 렌더링보다 상당히 늦게 로드될 수 있고, hydration 직후에 다른 UI를 렌더링하면 사용자가 어색하게 느낄 여지가 있습니다. 인터넷 속도가 느린 사용자의 경험에 유의하세요.

</Pitfall>
