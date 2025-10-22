---
title: captureOwnerStack
---

<Intro>

`captureOwnerStack`는 개발 환경에서 현재 Owner Stack을 읽고, 사용할 수 있다면 문자열 반환합니다.

```js
const stack = captureOwnerStack();
```

</Intro>

<InlineToc />

---

## 레퍼런스 {/*reference*/}

### `captureOwnerStack()` {/*captureownerstack*/}

`captureOwnerStack`을 호출하여 현재 Owner Stack을 가져옵니다.

```js {5,5}
import * as React from 'react';

function Component() {
  if (process.env.NODE_ENV !== 'production') {
    const ownerStack = React.captureOwnerStack();
    console.log(ownerStack);
  }
}
```

#### 매개변수 {/*parameters*/}

`captureOwnerStack`는 매개변수를 받지 않습니다.

#### 반환값 {/*returns*/}

`captureOwnerStack`은 `string`이나 `null`을 반환합니다.

Owner Stacks은 다음 경우에 사용할 수 있습니다.
- 컴포넌트 렌더링 시
- Effect (예: `useEffect`)
- React 이벤트 핸들러 (예: `<button onClick={...} />`)
- React 오류 핸들러 ([React 루트 옵션](/reference/react-dom/client/createRoot#parameters) `onCaughtError`, `onRecoverableError`, `onUncaughtError`)

Owner Stack을 사용할 수 없는 경우, `null`을 반환합니다. ([문제해결: Owner Stack이 `null`인 경우](#the-owner-stack-is-null))

#### 주의 사항 {/*caveats*/}

- Owner Stack은 개발 환경에서만 사용할 수 있습니다. `captureOwnerStack`은 개발 환경 밖에서는 항상 `null`을 반환합니다.

<DeepDive>

#### Owner Stack vs Component Stack {/*owner-stack-vs-component-stack*/}

The Owner Stack is different from the Component Stack available in React error handlers like [`errorInfo.componentStack` in `onUncaughtError`](/reference/react-dom/client/hydrateRoot#error-logging-in-production).

예를 들어 다음 코드를 살펴보겠습니다.

<Sandpack>

```js src/App.js
import {Suspense} from 'react';

function SubComponent({disabled}) {
  if (disabled) {
    throw new Error('disabled');
  }
}

export function Component({label}) {
  return (
    <fieldset>
      <legend>{label}</legend>
      <SubComponent key={label} disabled={label === 'disabled'} />
    </fieldset>
  );
}

function Navigation() {
  return null;
}

export default function App({children}) {
  return (
    <Suspense fallback="loading...">
      <main>
        <Navigation />
        {children}
      </main>
    </Suspense>
  );
}
```

```js src/index.js
import {captureOwnerStack} from 'react';
import {createRoot} from 'react-dom/client';
import App, {Component} from './App.js';
import './styles.css';

createRoot(document.createElement('div'), {
  onUncaughtError: (error, errorInfo) => {
    // The stacks are logged instead of showing them in the UI directly to
    // highlight that browsers will apply sourcemaps to the logged stacks.
    // Note that sourcemapping is only applied in the real browser console not
    // in the fake one displayed on this page.
    // Press "fork" to be able to view the sourcemapped stack in a real console.
    console.log(errorInfo.componentStack);
    console.log(captureOwnerStack());
  },
}).render(
  <App>
    <Component label="disabled" />
  </App>
);
```

```html public/index.html hidden
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <p>Check the console output.</p>
  </body>
</html>
```

</Sandpack>

`SubComponent`에서 오류가 날 수 있습니다.
해당 오류의 컴포넌트 Stack은 다음과 같을 것입니다.

```
at SubComponent
at fieldset
at Component
at main
at React.Suspense
at App
```

그러나, Owner Stack에는 다음 내용만 나타납니다.

```
at Component
```

`App`과 DOM 컴포넌트들(예: `fieldset`)은 `SubComponent`를 포함하는 노드를 "생성하는" 데에 기여하지 않기 때문 이 스택에 포함되지 않습니다. `App`과 DOM 컴포넌트들은 노드를 전달할 뿐입니다. `App`은 `<SubComponent />`를 통해 `SubComponent`를 포함한 노드를 생성하는 `Component`와 달리 `children` 노드만 렌더링합니다.

`Navigation`과 `legend`는 `<SubComponent />`를 포함하는 노드의 형제 요소이기 때문에 스택에 전혀 포함되지 않습니다.

`SubComponent`는 이미 호출 스택에 포함되어 있기 떄문에 Owner Stack에 나타나지 않습니다.

</DeepDive>

## 사용법 {/*usage*/}

### 커스텀 오류 오버레이 개선하기 {/*enhance-a-custom-error-overlay*/}

```js [[1, 5, "console.error"], [4, 7, "captureOwnerStack"]]
import { captureOwnerStack } from "react";
import { instrumentedConsoleError } from "./errorOverlay";

const originalConsoleError = console.error;
console.error = function patchedConsoleError(...args) {
  originalConsoleError.apply(console, args);
  const ownerStack = captureOwnerStack();
  onConsoleError({
    // Keep in mind that in a real application, console.error can be
    // called with multiple arguments which you should account for.
    consoleMessage: args[0],
    ownerStack,
  });
};
```

<CodeStep step={1}>`console.error`</CodeStep> 호출을 가로채서 오류 오버레이에 표시하고 싶다면, <CodeStep step={2}>`captureOwnerStack`</CodeStep>을 호출하여 `OwnerStack`을 포함할 수 있습니다.

<Sandpack>

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

h1 {
  margin-top: 0;
  font-size: 22px;
}

h2 {
  margin-top: 0;
  font-size: 20px;
}

code {
  font-size: 1.2em;
}

ul {
  padding-inline-start: 20px;
}

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

```html public/index.html hidden
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
  <h1 id="error-title" class="text-red">Error</h1>
  <p>
    <pre id="error-body"></pre>
  </p>
  <h2 class="-mb-20">Owner Stack:</h4>
  <pre id="error-owner-stack" class="nowrap"></pre>
  <button
    id="error-close"
    class="mb-10"
    onclick="document.getElementById('error-dialog').classList.add('hidden')"
  >
    Close
  </button>
</div>
<!-- This is the DOM node -->
<div id="root"></div>
</body>
</html>

```

```js src/errorOverlay.js

export function onConsoleError({ consoleMessage, ownerStack }) {
  const errorDialog = document.getElementById("error-dialog");
  const errorBody = document.getElementById("error-body");
  const errorOwnerStack = document.getElementById("error-owner-stack");

  // Display console.error() message
  errorBody.innerText = consoleMessage;

  // Display owner stack
  errorOwnerStack.innerText = ownerStack;

  // Show the dialog
  errorDialog.classList.remove("hidden");
}
```

```js src/index.js active
import { captureOwnerStack } from "react";
import { createRoot } from "react-dom/client";
import App from './App';
import { onConsoleError } from "./errorOverlay";
import './styles.css';

const originalConsoleError = console.error;
console.error = function patchedConsoleError(...args) {
  originalConsoleError.apply(console, args);
  const ownerStack = captureOwnerStack();
  onConsoleError({
    // Keep in mind that in a real application, console.error can be
    // called with multiple arguments which you should account for.
    consoleMessage: args[0],
    ownerStack,
  });
};

const container = document.getElementById("root");
createRoot(container).render(<App />);
```

```js src/App.js
function Component() {
  return <button onClick={() => console.error('Some console error')}>Trigger console.error()</button>;
}

export default function App() {
  return <Component />;
}
```

</Sandpack>

## 문제 해결 {/*troubleshooting*/}

### Owner Stack이 `null`인 경우 {/*the-owner-stack-is-null*/}

`captureOwnerStack`이 `setTimeout` 콜백과 같이 React가 제어하지 않는 함수 바깥에서 호출됐을 경우, `fetch` 호출 후, 커스텀 DOM 이벤트 핸들러 등에서는 Owner Stack이 `null`이 됩니다. 렌더링 중이나 Effect, React 이벤트 핸들러, React 오류 핸들러 (예: `hydrateRoot#options.onCaughtError`) 내에서만 생성됩니다.

아래 예시에서, 버튼을 클릭하면 빈 Owner Stack이 로그로 출력됩니다. 그 이유는 `captureOwnerStack`이 커스텀 이벤트 핸들러 내에서 호출되었기 때문입니다. Owner Stack은 더 이른 시점, 예를 들어 이펙트 내부에서 `captureOwnerStack`를 호출하도록 이동시켜야 올바르게 캡처할 수 있습니다.
<Sandpack>

```js
import {captureOwnerStack, useEffect} from 'react';

export default function App() {
  useEffect(() => {
    // Should call `captureOwnerStack` here.
    function handleEvent() {
      // Calling it in a custom DOM event handler is too late.
      // The Owner Stack will be `null` at this point.
      console.log('Owner Stack: ', captureOwnerStack());
    }

    document.addEventListener('click', handleEvent);

    return () => {
      document.removeEventListener('click', handleEvent);
    }
  })

  return <button>Click me to see that Owner Stacks are not available in custom DOM event handlers</button>;
}
```

</Sandpack>

### `captureOwnerStack`을 사용할 수 없는 경우 {/*captureownerstack-is-not-available*/}

`captureOwnerStack`은 개발 환경 빌드에서만 Export됩니다. 프로덕션 환경 빌드에서는 `undefined`입니다. `captureOwnerStack`이 개발과 프로덕션이 모두 번들링되는 파일에서 사용될 때는 네임스페이스 `import`를 사용하고 조건부로 접근해야 합니다.

```js
// Don't use named imports of `captureOwnerStack` in files that are bundled for development and production.
import {captureOwnerStack} from 'react';
// Use a namespace import instead and access `captureOwnerStack` conditionally.
import * as React from 'react';

if (process.env.NODE_ENV !== 'production') {
  const ownerStack = React.captureOwnerStack();
  console.log('Owner Stack', ownerStack);
}
```
