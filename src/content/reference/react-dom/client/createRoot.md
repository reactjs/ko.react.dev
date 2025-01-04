---
title: createRoot
---

<Intro>

`createRoot`로 브라우저 DOM 노드 안에 React 컴포넌트를 표시하는 루트를 생성할 수 있습니다.

```js
const root = createRoot(domNode, options?)
```

</Intro>

<InlineToc />

---

## 레퍼런스 {/*reference*/}

### `createRoot(domNode, options?)` {/*createroot*/}

`createRoot`를 호출하면 브라우저 DOM 엘리먼트 안에 콘텐츠를 표시할 수 있는 React 루트를 생성합니다.
```js
import { createRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = createRoot(domNode);
```

React는 `domNode`에 대한 루트를 생성하고 그 안에 있는 DOM을 관리합니다. 루트를 생성한 후에는 [`root.render`](#root-render)를 호출해 그 안에 React 컴포넌트를 표시해야 합니다.

```js
root.render(<App />);
```

온전히 React만으로 작성된 앱에서는 일반적으로 루트 컴포넌트에 대한 `createRoot` 호출이 하나만 있습니다. 페이지의 일부에 React를 "뿌려서" 사용하는 페이지의 경우에는 루트를 필요로 하는 만큼 작성할 수 있습니다.

[아래 예시를 참고하세요.](#usage)

#### 매개변수 {/*parameters*/}

* `domNode`: [DOM 엘리먼트](https://developer.mozilla.org/en-US/docs/Web/API/Element). React는 DOM 엘리먼트에 대한 루트를 생성하고 렌더링된 React 콘텐츠를 표시하는 `render`와 같은 함수를 루트에서 호출할 수 있도록 합니다.

* **optional** `options`: React 루트에 대한 옵션을 가진 객체입니다.
  * **optional** `onCaughtError`: Callback called when React catches an error in an Error Boundary. Called with the `error` caught by the Error Boundary, and an `errorInfo` object containing the `componentStack`.
  * **optional** `onUncaughtError`: Callback called when an error is thrown and not caught by an Error Boundary. Called with the `error` that was thrown, and an `errorInfo` object containing the `componentStack`.
  * **optional** `onRecoverableError`: React가 오류로부터 자동으로 복구될 때 호출되는 콜백. Called with an `error` React throws, and an `errorInfo` object containing the `componentStack`. Some recoverable errors may include the original error cause as `error.cause`.
  * **optional** `identifierPrefix`: React가 [`useId`](/reference/react/useId)에 의해 생성된 ID에 사용하는 문자열 접두사. 같은 페이지에서 여러개의 루트를 사용할 때 충돌을 피하는 데 유용합니다.

#### 반환값 {/*returns*/}

`createRoot`는 [`render`](#root-render)와 [`unmount`](#root-unmount) 두 가지 메서드를 포함한 객체를 반환합니다.

#### 주의 사항 {/*caveats*/}
* 앱이 서버에서 렌더링 되는 경우 `createRoot()`는 사용할 수 없습니다. 대신 [`hydrateRoot()`](/reference/react-dom/client/hydrateRoot)를 사용하세요.
* 앱에서 `createRoot` 호출이 단 한번만 있을 가능성이 높습니다. 프레임워크를 사용하는 경우 프레임워크가 이 호출을 대신 수행할 수도 있습니다.
* 컴포넌트의 자식이 아닌 DOM 트리의 다른 부분(예: 모달 또는 툴팁)에 JSX 조각을 렌더링하려는 경우, `createRoot` 대신 [`createPortal`](/reference/react-dom/createPortal)을 사용하세요.

---

### `root.render(reactNode)` {/*root-render*/}

`root.render`를 호출하여 [JSX](/learn/writing-markup-with-jsx) 조각("React 노드")을 React 루트의 브라우저 DOM 노드에 표시합니다.

```js
root.render(<App />);
```

React는 `root`에 `<App />`을 표시하고 그 안에 있는 DOM을 관리합니다.

[아래 예시를 참고하세요.](#usage)

#### 매개변수 {/*root-render-parameters*/}

* `reactNode`: 표시하려는 *React 노드*. 일반적으로 `<App />`과 같은 JSX 조각이 되지만, [`createElement()`](/reference/react/createElement)로 작성한 React 엘리먼트, 문자열, 숫자, `null`, `undefined` 등을 전달할 수도 있습니다.


#### 반환값 {/*root-render-returns*/}

`root.render`는 `undefined`를 반환합니다.

#### 주의 사항 {/*root-render-caveats*/}

* `root.render`를 처음 호출하면 React는 React 컴포넌트를 렌더링하기 전에 React 루트 내부의 모든 기존 HTML 콘텐츠를 지웁니다.

* 서버에서 또는 빌드 중에 React에 의해 생성된 HTML이 루트의 DOM 노드에 포함된 경우, 대신 이벤트 핸들러를 기존 HTML에 첨부하는 [`hydrateRoot()`](/reference/react-dom/client/hydrateRoot)를 사용하세요.

* 동일한 루트에서 `render`를 두 번 이상 호출하면, React는 필요에 따라 DOM을 업데이트하여 사용자가 전달한 최신 JSX를 반영합니다. React는 이전에 렌더링 된 트리와 ["비교"](/learn/preserving-and-resetting-state)해서 재사용할 수 있는 부분과 다시 만들어야 하는 부분을 결정합니다. 동일한 루트에서 `render`를 다시 호출하는 것은 루트 컴포넌트에서 [`set` 함수](/reference/react/useState#setstate)를 호출하는 것과 비슷합니다. React는 불필요한 DOM 업데이트를 피합니다.

---

### `root.unmount()` {/*root-unmount*/}

`root.unmount`를 호출하면 React 루트 내부에서 렌더링된 트리를 삭제합니다.

```js
root.unmount();
```

온전히 React만으로 작성된 앱에는 일반적으로 `root.unmount`에 대한 호출이 없습니다.

이 함수는 주로 React 루트의 DOM 노드(또는 그 조상 노드)가 다른 코드에 의해 DOM에서 제거될 수 있는 경우에 유용합니다. 예를 들어 DOM에서 비활성 탭을 제거하는 jQuery 탭 패널을 상상해 보세요. 탭이 제거되면 그 안에 있는 모든 것(내부의 React 루트를 포함)이 DOM에서 제거됩니다. 이 경우 `root.unmount`를 호출하여 제거된 루트의 콘텐츠 관리를 "중지"하도록 React에 지시해야 합니다. 그렇지 않으면 제거된 루트 내부의 컴포넌트는 구독과 같은 전역 리소스를 정리하고 확보하는 법을 모르는 채로 있게 됩니다.

`root.unmount`를 호출하면 루트에 있는 모든 컴포넌트가 마운트 해제되고, 트리상의 이벤트 핸들러나 State가 제거되며, 루트 DOM 노드에서 React가 "분리"됩니다.


#### 매개변수 {/*root-unmount-parameters*/}

`root.unmount`는 매개변수를 받지 않습니다.


#### 반환값 {/*root-unmount-returns*/}

`root.unmount` returns `undefined`.

#### 주의 사항 {/*root-unmount-caveats*/}

* `root.unmount`를 호출하면 트리의 모든 컴포넌트가 마운트 해제되고 루트 DOM 노드에서 React가 "분리"됩니다.

* `root.unmount`를 한 번 호출한 후에는 같은 루트에서 `root.render`를 다시 호출할 수 없습니다. 마운트 해제된 루트에서 `root.render`를 호출하려고 하면 "마운트 해제된 루트를 업데이트할 수 없습니다.<sup>Cannot update an unmounted root</sup>" 오류가 발생합니다. 그러나 해당 노드의 이전 루트가 마운트 해제된 후 동일한 DOM 노드에 새로운 루트를 만들 수는 있습니다.

---

## 사용법 {/*usage*/}

### 온전히 React만으로 작성된 앱 렌더링하기 {/*rendering-an-app-fully-built-with-react*/}

앱이 온전히 React만으로 작성된 경우, 전체 앱에 대해 단일 루트를 생성하세요.

```js [[1, 3, "document.getElementById('root')"], [2, 4, "<App />"]]
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

일반적으로 이 코드는 시작할 때 한 번만 실행하면 됩니다.

1. HTML에 정의된 <CodeStep step={1}>브라우저 DOM 노드</CodeStep>를 찾으세요.
2. 앱 내부에 <CodeStep step={2}>React 컴포넌트</CodeStep>를 표시하세요.

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <!-- This is the DOM node -->
    <div id="root"></div>
  </body>
</html>
```

```js src/index.js active
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
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

**앱이 온전히 React만으로 작성된 경우, 추가적으로 루트를 더 만들거나 [`root.render`](#root-render)를 다시 호출할 필요가 없습니다.**

이 시점부터 React는 전체 앱의 DOM을 관리합니다. 컴포넌트를 더 추가하려면 [ `App` 컴포넌트 안에 중첩](/learn/importing-and-exporting-components)시키세요. UI 업데이트는 각 컴포넌트의 [State를 통해](/reference/react/useState) 수행할 수 있습니다. 모달이나 툴팁과 같은 추가 콘텐츠를 DOM 노드 외부에 표시해야 하는 경우 [Portal로 렌더링](/reference/react-dom/createPortal)하세요.

<Note>

HTML이 비어있으면, 앱의 자바스크립트 코드가 로드되고 실행될 때까지 사용자에게 빈 페이지가 표시됩니다.

```html
<div id="root"></div>
```

이것은 매우 느리게 느껴질 수 있습니다! 이 문제를 해결하기 위해 [서버에서 또는 빌드 중에](/reference/react-dom/server) 컴포넌트로부터 초기 HTML을 생성할 수 있습니다. 그러면 방문자는 자바스크립트 코드가 로드되기 전에 텍스트를 읽고, 이미지를 보고, 링크를 클릭할 수 있습니다. 이 최적화를 기본적으로 수행하는 [프레임워크를 사용](/learn/start-a-new-react-project#production-grade-react-frameworks)하는 것이 좋습니다. 실행 시점에 따라 이를 *서버 측 렌더링<sup>SSR</sup>* 또는 *정적 사이트 생성<sup>SSG</sup>* 이라고 합니다.

</Note>

<Pitfall>

**서버 측 렌더링이나 정적 사이트 생성을 사용하는 앱은 `createRoot` 대신 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot)를 호출해야 합니다.** 그러면 React는 DOM 노드를 파괴하고 다시 생성하는 대신 HTML으로부터 *Hydrate*(재사용)합니다.
</Pitfall>

---

### React로 부분적으로 작성된 페이지 렌더링하기 {/*rendering-a-page-partially-built-with-react*/}

페이지가 [React만으로 작성되지 않은 경우](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page), React가 관리하는 각 최상위 UI에 대한 루트를 생성하기 위해 `createRoot`를 여러 번 호출할 수 있습니다. 루트마다 [`root.render`](#root-render)를 호출함으로써 각각 다른 콘텐츠를 표시할 수 있습니다.

다음 예시에서는 서로 다른 두 개의 React 컴포넌트를 `index.html` 파일에 정의된 두 개의 DOM 노드에 렌더링합니다.

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <nav id="navigation"></nav>
    <main>
      <p>This paragraph is not rendered by React (open index.html to verify).</p>
      <section id="comments"></section>
    </main>
  </body>
</html>
```

```js src/index.js active
import './styles.css';
import { createRoot } from 'react-dom/client';
import { Comments, Navigation } from './Components.js';

const navDomNode = document.getElementById('navigation');
const navRoot = createRoot(navDomNode);
navRoot.render(<Navigation />);

const commentDomNode = document.getElementById('comments');
const commentRoot = createRoot(commentDomNode);
commentRoot.render(<Comments />);
```

```js src/Components.js
export function Navigation() {
  return (
    <ul>
      <NavLink href="/">Home</NavLink>
      <NavLink href="/about">About</NavLink>
    </ul>
  );
}

function NavLink({ href, children }) {
  return (
    <li>
      <a href={href}>{children}</a>
    </li>
  );
}

export function Comments() {
  return (
    <>
      <h2>Comments</h2>
      <Comment text="Hello!" author="Sophie" />
      <Comment text="How are you?" author="Sunil" />
    </>
  );
}

function Comment({ text, author }) {
  return (
    <p>{text} — <i>{author}</i></p>
  );
}
```

```css
nav ul { padding: 0; margin: 0; }
nav ul li { display: inline-block; margin-right: 20px; }
```

</Sandpack>

[`document.createElement()`](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement)를 사용하여 새 DOM 노드를 생성하고 문서에 수동으로 추가할 수도 있습니다.

```js
const domNode = document.createElement('div');
const root = createRoot(domNode);
root.render(<Comment />);
document.body.appendChild(domNode); // You can add it anywhere in the document
```

DOM 노드에서 React 트리를 제거하고 이 트리가 사용하는 모든 리소스를 정리하려면 [`root.unmount`](#root-unmount)를 호출하세요.

```js
root.unmount();
```

이 기능은 React 컴포넌트가 다른 프레임워크로 작성된 앱 내부에 있는 경우에 주로 유용합니다.

---

### Updating a root component {/*updating-a-root-component*/}

같은 루트에서 `render`를 두 번 이상 호출할 수도 있습니다. 컴포넌트 트리 구조가 이전 렌더링과 일치하는 한, React는 [기존 State를 유지](/learn/preserving-and-resetting-state)합니다. 다음 예시에서 입력 창에 어떻게 타이핑하든 관계없이, 매 초 반복되는 `render` 호출로 인한 업데이트가 아무런 문제를 일으키지 않음을 주목하세요.

<Sandpack>

```js src/index.js active
import { createRoot } from 'react-dom/client';
import './styles.css';
import App from './App.js';

const root = createRoot(document.getElementById('root'));

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

`render`를 여러 번 호출하는 경우는 흔하지 않습니다. 일반적으로는, 컴포넌트가 [State를 업데이트](/reference/react/useState)합니다.

### Show a dialog for uncaught errors {/*show-a-dialog-for-uncaught-errors*/}

By default, React will log all uncaught errors to the console. To implement your own error reporting, you can provide the optional `onUncaughtError` root option:

```js [[1, 6, "onUncaughtError"], [2, 6, "error", 1], [3, 6, "errorInfo"], [4, 10, "componentStack"]]
import { createRoot } from 'react-dom/client';

const root = createRoot(
  document.getElementById('root'),
  {
    onUncaughtError: (error, errorInfo) => {
      console.error(
        'Uncaught error',
        error,
        errorInfo.componentStack
      );
    }
  }
);
root.render(<App />);
```

The <CodeStep step={1}>onUncaughtError</CodeStep> option is a function called with two arguments:

1. The <CodeStep step={2}>error</CodeStep> that was thrown.
2. An <CodeStep step={3}>errorInfo</CodeStep> object that contains the <CodeStep step={4}>componentStack</CodeStep> of the error.

You can use the `onUncaughtError` root option to display error dialogs:

<Sandpack>

```html index.html hidden
<!DOCTYPE html>
<html>
<head>
  <title>My app</title>
</head>
<body>
<!--
  Error dialog in raw HTML
  since an error in the React app may crash.
-->
<div id="error-dialog" class="hidden">
  <h1 id="error-title" class="text-red"></h1>
  <h3>
    <pre id="error-message"></pre>
  </h3>
  <p>
    <pre id="error-body"></pre>
  </p>
  <h4 class="-mb-20">This error occurred at:</h4>
  <pre id="error-component-stack" class="nowrap"></pre>
  <h4 class="mb-0">Call stack:</h4>
  <pre id="error-stack" class="nowrap"></pre>
  <div id="error-cause">
    <h4 class="mb-0">Caused by:</h4>
    <pre id="error-cause-message"></pre>
    <pre id="error-cause-stack" class="nowrap"></pre>
  </div>
  <button
    id="error-close"
    class="mb-10"
    onclick="document.getElementById('error-dialog').classList.add('hidden')"
  >
    Close
  </button>
  <h3 id="error-not-dismissible">This error is not dismissible.</h3>
</div>
<!-- This is the DOM node -->
<div id="root"></div>
</body>
</html>
```

```css src/styles.css active
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }

#error-dialog {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: white;
  padding: 15px;
  opacity: 0.9;
  text-wrap: wrap;
  overflow: scroll;
}

.text-red {
  color: red;
}

.-mb-20 {
  margin-bottom: -20px;
}

.mb-0 {
  margin-bottom: 0;
}

.mb-10 {
  margin-bottom: 10px;
}

pre {
  text-wrap: wrap;
}

pre.nowrap {
  text-wrap: nowrap;
}

.hidden {
 display: none;
}
```

```js src/reportError.js hidden
function reportError({ title, error, componentStack, dismissable }) {
  const errorDialog = document.getElementById("error-dialog");
  const errorTitle = document.getElementById("error-title");
  const errorMessage = document.getElementById("error-message");
  const errorBody = document.getElementById("error-body");
  const errorComponentStack = document.getElementById("error-component-stack");
  const errorStack = document.getElementById("error-stack");
  const errorClose = document.getElementById("error-close");
  const errorCause = document.getElementById("error-cause");
  const errorCauseMessage = document.getElementById("error-cause-message");
  const errorCauseStack = document.getElementById("error-cause-stack");
  const errorNotDismissible = document.getElementById("error-not-dismissible");

  // Set the title
  errorTitle.innerText = title;

  // Display error message and body
  const [heading, body] = error.message.split(/\n(.*)/s);
  errorMessage.innerText = heading;
  if (body) {
    errorBody.innerText = body;
  } else {
    errorBody.innerText = '';
  }

  // Display component stack
  errorComponentStack.innerText = componentStack;

  // Display the call stack
  // Since we already displayed the message, strip it, and the first Error: line.
  errorStack.innerText = error.stack.replace(error.message, '').split(/\n(.*)/s)[1];

  // Display the cause, if available
  if (error.cause) {
    errorCauseMessage.innerText = error.cause.message;
    errorCauseStack.innerText = error.cause.stack;
    errorCause.classList.remove('hidden');
  } else {
    errorCause.classList.add('hidden');
  }
  // Display the close button, if dismissible
  if (dismissable) {
    errorNotDismissible.classList.add('hidden');
    errorClose.classList.remove("hidden");
  } else {
    errorNotDismissible.classList.remove('hidden');
    errorClose.classList.add("hidden");
  }

  // Show the dialog
  errorDialog.classList.remove("hidden");
}

export function reportCaughtError({error, cause, componentStack}) {
  reportError({ title: "Caught Error", error, componentStack,  dismissable: true});
}

export function reportUncaughtError({error, cause, componentStack}) {
  reportError({ title: "Uncaught Error", error, componentStack, dismissable: false });
}

export function reportRecoverableError({error, cause, componentStack}) {
  reportError({ title: "Recoverable Error", error, componentStack,  dismissable: true });
}
```

```js src/index.js active
import { createRoot } from "react-dom/client";
import App from "./App.js";
import {reportUncaughtError} from "./reportError";
import "./styles.css";

const container = document.getElementById("root");
const root = createRoot(container, {
  onUncaughtError: (error, errorInfo) => {
    if (error.message !== 'Known error') {
      reportUncaughtError({
        error,
        componentStack: errorInfo.componentStack
      });
    }
  }
});
root.render(<App />);
```

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [throwError, setThrowError] = useState(false);

  if (throwError) {
    foo.bar = 'baz';
  }

  return (
    <div>
      <span>This error shows the error dialog:</span>
      <button onClick={() => setThrowError(true)}>
        Throw error
      </button>
    </div>
  );
}
```

</Sandpack>


### Displaying Error Boundary errors {/*displaying-error-boundary-errors*/}

By default, React will log all errors caught by an Error Boundary to `console.error`. To override this behavior, you can provide the optional `onCaughtError` root option to handle errors caught by an [Error Boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary):

```js [[1, 6, "onCaughtError"], [2, 6, "error", 1], [3, 6, "errorInfo"], [4, 10, "componentStack"]]
import { createRoot } from 'react-dom/client';

const root = createRoot(
  document.getElementById('root'),
  {
    onCaughtError: (error, errorInfo) => {
      console.error(
        'Caught error',
        error,
        errorInfo.componentStack
      );
    }
  }
);
root.render(<App />);
```

The <CodeStep step={1}>onCaughtError</CodeStep> option is a function called with two arguments:

1. The <CodeStep step={2}>error</CodeStep> that was caught by the boundary.
2. An <CodeStep step={3}>errorInfo</CodeStep> object that contains the <CodeStep step={4}>componentStack</CodeStep> of the error.

You can use the `onCaughtError` root option to display error dialogs or filter known errors from logging:

<Sandpack>

```html index.html hidden
<!DOCTYPE html>
<html>
<head>
  <title>My app</title>
</head>
<body>
<!--
  Error dialog in raw HTML
  since an error in the React app may crash.
-->
<div id="error-dialog" class="hidden">
  <h1 id="error-title" class="text-red"></h1>
  <h3>
    <pre id="error-message"></pre>
  </h3>
  <p>
    <pre id="error-body"></pre>
  </p>
  <h4 class="-mb-20">This error occurred at:</h4>
  <pre id="error-component-stack" class="nowrap"></pre>
  <h4 class="mb-0">Call stack:</h4>
  <pre id="error-stack" class="nowrap"></pre>
  <div id="error-cause">
    <h4 class="mb-0">Caused by:</h4>
    <pre id="error-cause-message"></pre>
    <pre id="error-cause-stack" class="nowrap"></pre>
  </div>
  <button
    id="error-close"
    class="mb-10"
    onclick="document.getElementById('error-dialog').classList.add('hidden')"
  >
    Close
  </button>
  <h3 id="error-not-dismissible">This error is not dismissible.</h3>
</div>
<!-- This is the DOM node -->
<div id="root"></div>
</body>
</html>
```

```css src/styles.css active
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }

#error-dialog {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: white;
  padding: 15px;
  opacity: 0.9;
  text-wrap: wrap;
  overflow: scroll;
}

.text-red {
  color: red;
}

.-mb-20 {
  margin-bottom: -20px;
}

.mb-0 {
  margin-bottom: 0;
}

.mb-10 {
  margin-bottom: 10px;
}

pre {
  text-wrap: wrap;
}

pre.nowrap {
  text-wrap: nowrap;
}

.hidden {
 display: none;
}
```

```js src/reportError.js hidden
function reportError({ title, error, componentStack, dismissable }) {
  const errorDialog = document.getElementById("error-dialog");
  const errorTitle = document.getElementById("error-title");
  const errorMessage = document.getElementById("error-message");
  const errorBody = document.getElementById("error-body");
  const errorComponentStack = document.getElementById("error-component-stack");
  const errorStack = document.getElementById("error-stack");
  const errorClose = document.getElementById("error-close");
  const errorCause = document.getElementById("error-cause");
  const errorCauseMessage = document.getElementById("error-cause-message");
  const errorCauseStack = document.getElementById("error-cause-stack");
  const errorNotDismissible = document.getElementById("error-not-dismissible");

  // Set the title
  errorTitle.innerText = title;

  // Display error message and body
  const [heading, body] = error.message.split(/\n(.*)/s);
  errorMessage.innerText = heading;
  if (body) {
    errorBody.innerText = body;
  } else {
    errorBody.innerText = '';
  }

  // Display component stack
  errorComponentStack.innerText = componentStack;

  // Display the call stack
  // Since we already displayed the message, strip it, and the first Error: line.
  errorStack.innerText = error.stack.replace(error.message, '').split(/\n(.*)/s)[1];

  // Display the cause, if available
  if (error.cause) {
    errorCauseMessage.innerText = error.cause.message;
    errorCauseStack.innerText = error.cause.stack;
    errorCause.classList.remove('hidden');
  } else {
    errorCause.classList.add('hidden');
  }
  // Display the close button, if dismissible
  if (dismissable) {
    errorNotDismissible.classList.add('hidden');
    errorClose.classList.remove("hidden");
  } else {
    errorNotDismissible.classList.remove('hidden');
    errorClose.classList.add("hidden");
  }

  // Show the dialog
  errorDialog.classList.remove("hidden");
}

export function reportCaughtError({error, cause, componentStack}) {
  reportError({ title: "Caught Error", error, componentStack,  dismissable: true});
}

export function reportUncaughtError({error, cause, componentStack}) {
  reportError({ title: "Uncaught Error", error, componentStack, dismissable: false });
}

export function reportRecoverableError({error, cause, componentStack}) {
  reportError({ title: "Recoverable Error", error, componentStack,  dismissable: true });
}
```

```js src/index.js active
import { createRoot } from "react-dom/client";
import App from "./App.js";
import {reportCaughtError} from "./reportError";
import "./styles.css";

const container = document.getElementById("root");
const root = createRoot(container, {
  onCaughtError: (error, errorInfo) => {
    if (error.message !== 'Known error') {
      reportCaughtError({
        error,
        componentStack: errorInfo.componentStack,
      });
    }
  }
});
root.render(<App />);
```

```js src/App.js
import { useState } from 'react';
import { ErrorBoundary } from "react-error-boundary";

export default function App() {
  const [error, setError] = useState(null);

  function handleUnknown() {
    setError("unknown");
  }

  function handleKnown() {
    setError("known");
  }

  return (
    <>
      <ErrorBoundary
        fallbackRender={fallbackRender}
        onReset={(details) => {
          setError(null);
        }}
      >
        {error != null && <Throw error={error} />}
        <span>This error will not show the error dialog:</span>
        <button onClick={handleKnown}>
          Throw known error
        </button>
        <span>This error will show the error dialog:</span>
        <button onClick={handleUnknown}>
          Throw unknown error
        </button>
      </ErrorBoundary>

    </>
  );
}

function fallbackRender({ resetErrorBoundary }) {
  return (
    <div role="alert">
      <h3>Error Boundary</h3>
      <p>Something went wrong.</p>
      <button onClick={resetErrorBoundary}>Reset</button>
    </div>
  );
}

function Throw({error}) {
  if (error === "known") {
    throw new Error('Known error')
  } else {
    foo.bar = 'baz';
  }
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.0.0-rc-3edc000d-20240926",
    "react-dom": "19.0.0-rc-3edc000d-20240926",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```

</Sandpack>

### Displaying a dialog for recoverable errors {/*displaying-a-dialog-for-recoverable-errors*/}

React may automatically render a component a second time to attempt to recover from an error thrown in render. If successful, React will log a recoverable error to the console to notify the developer. To override this behavior, you can provide the optional `onRecoverableError` root option:

```js [[1, 6, "onRecoverableError"], [2, 6, "error", 1], [3, 10, "error.cause"], [4, 6, "errorInfo"], [5, 11, "componentStack"]]
import { createRoot } from 'react-dom/client';

const root = createRoot(
  document.getElementById('root'),
  {
    onRecoverableError: (error, errorInfo) => {
      console.error(
        'Recoverable error',
        error,
        error.cause,
        errorInfo.componentStack,
      );
    }
  }
);
root.render(<App />);
```

The <CodeStep step={1}>onRecoverableError</CodeStep> option is a function called with two arguments:

1. The <CodeStep step={2}>error</CodeStep> that React throws. Some errors may include the original cause as <CodeStep step={3}>error.cause</CodeStep>.
2. An <CodeStep step={4}>errorInfo</CodeStep> object that contains the <CodeStep step={5}>componentStack</CodeStep> of the error.

You can use the `onRecoverableError` root option to display error dialogs:

<Sandpack>

```html index.html hidden
<!DOCTYPE html>
<html>
<head>
  <title>My app</title>
</head>
<body>
<!--
  Error dialog in raw HTML
  since an error in the React app may crash.
-->
<div id="error-dialog" class="hidden">
  <h1 id="error-title" class="text-red"></h1>
  <h3>
    <pre id="error-message"></pre>
  </h3>
  <p>
    <pre id="error-body"></pre>
  </p>
  <h4 class="-mb-20">This error occurred at:</h4>
  <pre id="error-component-stack" class="nowrap"></pre>
  <h4 class="mb-0">Call stack:</h4>
  <pre id="error-stack" class="nowrap"></pre>
  <div id="error-cause">
    <h4 class="mb-0">Caused by:</h4>
    <pre id="error-cause-message"></pre>
    <pre id="error-cause-stack" class="nowrap"></pre>
  </div>
  <button
    id="error-close"
    class="mb-10"
    onclick="document.getElementById('error-dialog').classList.add('hidden')"
  >
    Close
  </button>
  <h3 id="error-not-dismissible">This error is not dismissible.</h3>
</div>
<!-- This is the DOM node -->
<div id="root"></div>
</body>
</html>
```

```css src/styles.css active
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }

#error-dialog {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: white;
  padding: 15px;
  opacity: 0.9;
  text-wrap: wrap;
  overflow: scroll;
}

.text-red {
  color: red;
}

.-mb-20 {
  margin-bottom: -20px;
}

.mb-0 {
  margin-bottom: 0;
}

.mb-10 {
  margin-bottom: 10px;
}

pre {
  text-wrap: wrap;
}

pre.nowrap {
  text-wrap: nowrap;
}

.hidden {
 display: none;
}
```

```js src/reportError.js hidden
function reportError({ title, error, componentStack, dismissable }) {
  const errorDialog = document.getElementById("error-dialog");
  const errorTitle = document.getElementById("error-title");
  const errorMessage = document.getElementById("error-message");
  const errorBody = document.getElementById("error-body");
  const errorComponentStack = document.getElementById("error-component-stack");
  const errorStack = document.getElementById("error-stack");
  const errorClose = document.getElementById("error-close");
  const errorCause = document.getElementById("error-cause");
  const errorCauseMessage = document.getElementById("error-cause-message");
  const errorCauseStack = document.getElementById("error-cause-stack");
  const errorNotDismissible = document.getElementById("error-not-dismissible");

  // Set the title
  errorTitle.innerText = title;

  // Display error message and body
  const [heading, body] = error.message.split(/\n(.*)/s);
  errorMessage.innerText = heading;
  if (body) {
    errorBody.innerText = body;
  } else {
    errorBody.innerText = '';
  }

  // Display component stack
  errorComponentStack.innerText = componentStack;

  // Display the call stack
  // Since we already displayed the message, strip it, and the first Error: line.
  errorStack.innerText = error.stack.replace(error.message, '').split(/\n(.*)/s)[1];

  // Display the cause, if available
  if (error.cause) {
    errorCauseMessage.innerText = error.cause.message;
    errorCauseStack.innerText = error.cause.stack;
    errorCause.classList.remove('hidden');
  } else {
    errorCause.classList.add('hidden');
  }
  // Display the close button, if dismissible
  if (dismissable) {
    errorNotDismissible.classList.add('hidden');
    errorClose.classList.remove("hidden");
  } else {
    errorNotDismissible.classList.remove('hidden');
    errorClose.classList.add("hidden");
  }

  // Show the dialog
  errorDialog.classList.remove("hidden");
}

export function reportCaughtError({error, cause, componentStack}) {
  reportError({ title: "Caught Error", error, componentStack,  dismissable: true});
}

export function reportUncaughtError({error, cause, componentStack}) {
  reportError({ title: "Uncaught Error", error, componentStack, dismissable: false });
}

export function reportRecoverableError({error, cause, componentStack}) {
  reportError({ title: "Recoverable Error", error, componentStack,  dismissable: true });
}
```

```js src/index.js active
import { createRoot } from "react-dom/client";
import App from "./App.js";
import {reportRecoverableError} from "./reportError";
import "./styles.css";

const container = document.getElementById("root");
const root = createRoot(container, {
  onRecoverableError: (error, errorInfo) => {
    reportRecoverableError({
      error,
      cause: error.cause,
      componentStack: errorInfo.componentStack,
    });
  }
});
root.render(<App />);
```

```js src/App.js
import { useState } from 'react';
import { ErrorBoundary } from "react-error-boundary";

// 🚩 Bug: Never do this. This will force an error.
let errorThrown = false;
export default function App() {
  return (
    <>
      <ErrorBoundary
        fallbackRender={fallbackRender}
      >
        {!errorThrown && <Throw />}
        <p>This component threw an error, but recovered during a second render.</p>
        <p>Since it recovered, no Error Boundary was shown, but <code>onRecoverableError</code> was used to show an error dialog.</p>
      </ErrorBoundary>

    </>
  );
}

function fallbackRender() {
  return (
    <div role="alert">
      <h3>Error Boundary</h3>
      <p>Something went wrong.</p>
    </div>
  );
}

function Throw({error}) {
  // Simulate an external value changing during concurrent render.
  errorThrown = true;
  foo.bar = 'baz';
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.0.0-rc-3edc000d-20240926",
    "react-dom": "19.0.0-rc-3edc000d-20240926",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```

</Sandpack>


---
## 문제 해결 {/*troubleshooting*/}

### 루트를 생성했는데 아무것도 표시되지 않습니다 {/*ive-created-a-root-but-nothing-is-displayed*/}

실제로 앱을 루트에 **렌더링**하는 것을 잊지 않았는지 확인하세요.

```js {5}
import { createRoot } from 'react-dom/client';
import App from './App.js';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

`root.render(...)` 명령 없이는 아무것도 표시되지 않습니다.

---

### I'm getting an error: "You passed a second argument to root.render" {/*im-getting-an-error-you-passed-a-second-argument-to-root-render*/}

A common mistake is to pass the options for `createRoot` to `root.render(...)`:

<ConsoleBlock level="error">

Warning: You passed a second argument to root.render(...) but it only accepts one argument.

</ConsoleBlock>

To fix, pass the root options to `createRoot(...)`, not `root.render(...)`:
```js {2,5}
// 🚩 Wrong: root.render only takes one argument.
root.render(App, {onUncaughtError});

// ✅ Correct: pass options to createRoot.
const root = createRoot(container, {onUncaughtError});
root.render(<App />);
```

---

### "대상 컨테이너가 DOM 엘리먼트가 아닙니다" 라는 오류가 발생합니다. {/*im-getting-an-error-target-container-is-not-a-dom-element*/}

This error means that whatever you're passing to `createRoot` is not a DOM node.

If you're not sure what's happening, try logging it:

```js {2}
const domNode = document.getElementById('root');
console.log(domNode); // ???
const root = createRoot(domNode);
root.render(<App />);
```

예를 들어 `domNode`가 `null`이면 [`getElementById`](https://developer.mozilla.org/ko/docs/Web/API/Document/getElementById) 가 `null`을 반환했음을 의미합니다. 이는 호출 시점에 문서에 지정된 ID를 가진 노드가 없는 경우에 발생합니다. 여기에는 몇 가지 이유가 있을 수 있습니다.

1. 찾고자 하는 ID가 HTML 파일에서 사용한 ID와 다를 수 있습니다. 오타가 있는지 확인하세요!
2. 번들의 `<script>` 태그는 HTML에서 그보다 *뒤에* 있는 DOM 노드를 "인식할" 수 없습니다.

또다른 일반적인 사례는 `createRoot(domNode)` 대신 `createRoot(<App />)`으로 작성했을 경우입니다.

---

### "함수가 React 자식으로 유효하지 않습니다" 오류가 발생합니다. {/*im-getting-an-error-functions-are-not-valid-as-a-react-child*/}

이 오류는 `root.render`에 전달하는 것이 React 컴포넌트가 아님을 의미합니다.

이 오류는 `<Component />` 대신 `Component`로 `root.render`를 호출할 때 발생할 수 있습니다.

```js {2,5}
// 🚩 Wrong: App is a function, not a Component.
root.render(App);

// ✅ Correct: <App /> is a component.
root.render(<App />);
```

또는 함수를 호출한 결과 대신 `root.render`에 함수 자체를 전달했을 때도 발생할 수 있습니다.

```js {2,5}
// 🚩 Wrong: createApp is a function, not a component.
root.render(createApp);

// ✅ Correct: call createApp to return a component.
root.render(createApp());
```

---

### 서버에서 렌더링된 HTML이 처음부터 다시 생성됩니다 {/*my-server-rendered-html-gets-re-created-from-scratch*/}

앱이 서버에서 렌더링되고 React의 초기 HTML을 포함하는 경우에, 루트를 생성해서 `root.render`를 호출하면, 모든 HTML이 삭제되고 모든 DOM 노드가 처음부터 다시 생성되는 것을 볼 수 있습니다. 이렇게 하면 속도가 느려지고, 포커스와 스크롤 위치가 재설정되며, 그 밖의 다른 사용자 입력들이 손실될 수 있습니다.

서버에서 렌더링된 앱은 `createRoot` 대신 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot)를 사용해야 합니다.

```js {1,4-7}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(
  document.getElementById('root'),
  <App />
);
```

API가 다르다는 점에 유의하세요. 특히, 일반적으로는 `root.render`를 아예 호출하지 않습니다.
