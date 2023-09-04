---
title: lazy
---

<Intro>

`lazy`는 로딩 중인 컴포넌트 코드가 처음으로 렌더링 될 때까지 연기할 수 있습니다.

```js
const SomeComponent = lazy(load)
```

</Intro>

<InlineToc />

---

## 레퍼런스 {/*reference*/}

### `lazy(load)` {/*lazy*/}

lazy를 이용하여 로딩하는 React 컴포넌트를 선언하려면 컴포넌트 외부에서 `lazy`를 호출하세요.

```js
import { lazy } from 'react';

const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
```

[아래에서 더 많은 예시를 확인하세요.](#usage)

#### 매개변수 {/*parameters*/}

* `load`: [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 또는 또 다른 *thenable* (`then` 메서드가 있는 Promise 유사 객체)을 반환하는 함수입니다. React는 반환된 컴포넌트를 처음 렌더링하려고 할 때까지 `load`를 호출하지 않을 것입니다. React는 먼저 `load`를 실행한 후 `load`가 이행될 때까지 기다렸다가 이행된 값을 React 컴포넌트로 렌더링합니다. 반환된 Promise와 Promise의 이행된 값이 모두 캐시 되므로 React는 `load`를 두 번 이상 호출하지 않습니다. Promise가 거부하면 React는 가장 가까운 Error Boundary를 처리하기 위해 Error Boundary에 대한 거부 사유를 `throw` 할 것입니다.

#### 반환값 {/*returns*/}

`lazy`는 트리에 렌더링할 수 있는 React 컴포넌트를 반환합니다. 컴포넌트의 코드가 여전히 로드되는 동안 렌더링을 시도하면 일시 중지됩니다. 로딩 중에 로딩 인디케이터를 표시하려면 [`<Suspense>`](/reference/react/Suspense)를 사용합니다.

---

### `load` 함수 {/*load*/}

#### 매개변수 {/*load-parameters*/}

`load`는 매개변수를 수신하지 않습니다.

#### 반환값 {/*load-returns*/}

[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 또는 다른 *thenable* (`then` 메서드가 있는 Promise 유사 객체)을 반환해야 합니다. 결국 함수, [`memo`](/reference/react/memo) 또는 [`forwardRef`](/reference/react/forwardRef) 컴포넌트와 같은 유효한 React 컴포넌트 유형으로 이행해야 합니다.

---

## 사용법 {/*usage*/}

### Suspense와 Lazy-loading 컴포넌트 {/*suspense-for-code-splitting*/}

일반적으로 정적 [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) 선언으로 컴포넌트를 가져옵니다.

```js
import MarkdownPreview from './MarkdownPreview.js';
```

해당 컴포넌트 코드가 처음 렌더링 될 때까지 로드하는 것을 연기하려면 import를 다음과 같이 대체합니다.

```js
import { lazy } from 'react';

const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
```

위의 코드는 [동적 `import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)에 의존하므로 번들러 또는 프레임워크의 지원이 필요할 수 있습니다.

이제 요청에 따라 컴포넌트의 코드가 로드되므로 로드하는 동안 표시할 항목도 지정해야 합니다. lazy 컴포넌트 또는 해당 부모 컴포넌트 중 하나를 [`<Suspense>`](/reference/react/Suspense) 바운더리로 감싸서 이 작업을 수행할 수 있습니다.

```js {1,4}
<Suspense fallback={<Loading />}>
  <h2>Preview</h2>
  <MarkdownPreview />
 </Suspense>
```

이 예시에서 `MarkdownPreview` 코드는 렌더링을 시도할 때까지 로드되지 않습니다. `MarkdownPreview`가 아직 로딩되지 않는 경우에는 그 자리에 `Loading` 코드가 대신 표시됩니다. 체크박스를 선택해 보세요.

<Sandpack>

```js App.js
import { useState, Suspense, lazy } from 'react';
import Loading from './Loading.js';

const MarkdownPreview = lazy(() => delayForDemo(import('./MarkdownPreview.js')));

export default function MarkdownEditor() {
  const [showPreview, setShowPreview] = useState(false);
  const [markdown, setMarkdown] = useState('Hello, **world**!');
  return (
    <>
      <textarea value={markdown} onChange={e => setMarkdown(e.target.value)} />
      <label>
        <input type="checkbox" checked={showPreview} onChange={e => setShowPreview(e.target.checked)} />
        Show preview
      </label>
      <hr />
      {showPreview && (
        <Suspense fallback={<Loading />}>
          <h2>Preview</h2>
          <MarkdownPreview markdown={markdown} />
        </Suspense>
      )}
    </>
  );
}

// 로딩 상태를 확인하기 위해 fixed delay를 추가합니다.
function delayForDemo(promise) {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  }).then(() => promise);
}
```

```js Loading.js
export default function Loading() {
  return <p><i>Loading...</i></p>;
}
```

```js MarkdownPreview.js
import { Remarkable } from 'remarkable';

const md = new Remarkable();

export default function MarkdownPreview({ markdown }) {
  return (
    <div
      className="content"
      dangerouslySetInnerHTML={{__html: md.render(markdown)}}
    />
  );
}
```

```json package.json hidden
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
label {
  display: block;
}

input, textarea {
  margin-bottom: 10px;
}

body {
  min-height: 200px;
}
```

</Sandpack>

이 데모는 인위적인 지연으로 로드됩니다. 다음에 체크박스를 선택 해제하고 다시 선택하면 `Preview`가 캐시 되어 로딩 상태가 되지 않습니다. 로딩 상태를 다시 보려면 샌드박스에서 "Reset"을 클릭하세요.

[Suspense를 사용하여 로딩 상태를 관리하는 방법에 대해 자세히 알아보세요.](/reference/react/Suspense)

---

## 문제 해결 {/*troubleshooting*/}

### `lazy` 컴포넌트의 상태가 예기치 않게 재설정됩니다. {/*my-lazy-components-state-gets-reset-unexpectedly*/}

`lazy` 컴포넌트를 다른 컴포넌트 내부에서 선언하지 마세요.

```js {4-5}
import { lazy } from 'react';

function Editor() {
  // 🔴 잘못된 방법: 이렇게 하면 다시 렌더링할 때 모든 상태가 재설정됩니다.
  const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
  // ...
}
```

대신 항상 모듈의 최상위 수준에서 선언하세요.

```js {3-4}
import { lazy } from 'react';

// ✅ 올바른 방법: lazy 컴포넌트를 컴포넌트 외부에서 선언합니다.
const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));

function Editor() {
  // ...
}
```
