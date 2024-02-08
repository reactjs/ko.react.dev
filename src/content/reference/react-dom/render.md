---
title: 렌더링하기
---

<Deprecated>

이 API는 향후 React 메이저 버전에서 삭제될 예정입니다.

React 18에서 `render`는 [`createRoot`](/reference/react-dom/client/createRoot)로 교체되었습니다. React 18에서 `render`를 사용하면 앱이 React 17을 실행하는 것처럼 동작하므로 경고를 표시합니다. 자세한 내용은 [클라이언트 렌더링 API 업데이트](/blog/2022/03/08/react-18-upgrade-guide#updates-to-client-rendering-apis)를 참조하세요.

</Deprecated>

<Intro>

`render`는 [JSX](/learn/writing-markup-with-jsx) ("React node")를 브라우저 DOM 노드로 렌더링합니다.

```js
render(reactNode, domNode, callback?)
```

</Intro>

<InlineToc />

---

## 레퍼런스 {/*reference*/}

### `render(reactNode, domNode, callback?)` {/*render*/}

React 컴포넌트를 브라우저 DOM 요소 내에 표시하려면 `render`를 호출하세요.

```js
import { render } from 'react-dom';

const domNode = document.getElementById('root');
render(<App />, domNode);
```

React는 `domNode` 내에 `<App />`을 표시하고 해당 DOM을 관리합니다.

보통 React로 완전히 구축된 앱은 `render`를 최상 컴포넌트와 함께 한 번만 호출합니다. 페이지의 “일부분”에 React를 사용하는 경우 필요한 만큼 `render`를 호출할 수 있습니다.

[아래 예시를 참고하세요.](#usage)

#### 매개변수 {/*parameters*/}

* `reactNode`: 표시하려는 *React node*입니다. 보통 `<App />`과 같은 JSX를 사용하지만 [`createElement()`](/reference/react/createElement)로 구성된 React 요소, 문자열, 숫자, `null`, 또는 `undefined`를 전달할 수 있습니다.

* `domNode`: [DOM 요소](https://developer.mozilla.org/ko/docs/Web/API/Element)입니다. React는 전달한 `reactNode`를 이 DOM 요소 내에 표시합니다. 이후로 React는 `domNode` 내부의 DOM을 관리하고 React 트리가 변경될 때 업데이트합니다.

* **optional** `callback`: 함수입니다. 전달하면 React는 컴포넌트가 DOM에 배치된 후에 이를 호출합니다.


#### 반환값 {/*returns*/}

`render`는 일반적으로 `null`을 반환합니다. 하지만 전달한 `reactNode`가 *class 컴포넌트*인 경우, 해당 컴포넌트의 인스턴스를 반환합니다.

#### 주의 사항 {/*caveats*/}

* React 18에서 `render`는 [`createRoot`](/reference/react-dom/client/createRoot)로 교체되었습니다. React 18 이상에서는 `createRoot`를 사용하세요.

* 처음 `render`를 호출하면 React는 React 컴포넌트를 렌더링하기 전에 해당 `domNode` 내 존재하는 HTML을 모두 초기화합니다. 서버에서 혹은 빌드 중에 React에 의해 생성된 HTML이 `domNode`에 포함되어 있다면 기존 HTML에 이벤트 핸들러를 연결하는 [`hydrate()`](/reference/react-dom/hydrate)를 대신 사용하세요.

* 동일한 `domNode`에서 `render`를 두 번 이상 호출하면 React는 최신 JSX를 반영하기 위해 필요한 만큼 DOM을 업데이트합니다. React는 이전에 렌더링 된 트리와 ["맞춰보며"](/learn/preserving-and-resetting-state) 재사용할 수 있는 DOM 부분과 재생성해야 하는 DOM 부분을 결정합니다. 동일한 `domNode`에 `render`를 재호출하는 것은 최상단 컴포넌트에서 [`set` 함수](/reference/react/useState#setstate)를 호출하는 것과 유사합니다. React는 불필요한 DOM 업데이트를 방지합니다.

* 앱 전체가 React로 구축된 경우, `render` 호출은 앱에서 한 번만 발생할 것입니다. (프레임워크를 사용하는 경우, 이 호출을 대신 수행할 수 있습니다) 자식 컴포넌트가 아니라 DOM 트리의 다른 부분(예시: 모달 또는 툴팁)에 JSX를 렌더링하려면 `render` 대신 [`createPortal`](/reference/react-dom/createPortal)을 사용하세요.

---

## 사용법 {/*usage*/}

<CodeStep step={1}>React 컴포넌트</CodeStep>를 <CodeStep step={2}>브라우저 DOM 노드</CodeStep> 안에 표시하려면 `render`를 호출하세요.

```js [[1, 4, "<App />"], [2, 4, "document.getElementById('root')"]]
import { render } from 'react-dom';
import App from './App.js';

render(<App />, document.getElementById('root'));
```

### 최상단 컴포넌트 렌더링하기 {/*rendering-the-root-component*/}

React로 완전히 구축된 앱에서는 "최상단('root')" 컴포넌트를 렌더링하기 위해--**일반적으로 시작할 때 한 번만 이 작업을 수행합니다.**

<Sandpack>

```js src/index.js active
import './styles.css';
import { render } from 'react-dom';
import App from './App.js';

render(<App />, document.getElementById('root'));
```

```js src/App.js
export default function App() {
  return <h1>Hello, world!</h1>;
}
```

</Sandpack>

보통 `render`를 다시 호출하거나 다른 곳에서 호출할 필요는 없습니다. 이 시점부터 React가 애플리케이션의 DOM을 관리합니다. UI를 업데이트하려면 컴포넌트에서 [state를 사용](/reference/react/useState)할 것입니다.

---

### 여러 개의 최상단 컴포넌트 렌더링하기 {/*rendering-multiple-roots*/}

[완전히 React로 구축된](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page) 페이지가 아니라면 React가 관리하는 최상위 UI마다 `render`를 호출하세요.

<Sandpack>

```html public/index.html
<nav id="navigation"></nav>
<main>
  <p>This paragraph is not rendered by React (open index.html to verify).</p>
  <section id="comments"></section>
</main>
```

```js src/index.js active
import './styles.css';
import { render } from 'react-dom';
import { Comments, Navigation } from './Components.js';

render(
  <Navigation />,
  document.getElementById('navigation')
);

render(
  <Comments />,
  document.getElementById('comments')
);
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

[`unmountComponentAtNode()`](/reference/react-dom/unmountComponentAtNode)를 사용하여 렌더링 된 트리를 제거할 수 있습니다.

---

### 렌더링 된 트리 업데이트하기 {/*updating-the-rendered-tree*/}

동일한 DOM 노드에서 `render`를 여러 번 호출할 수 있습니다. 이전에 렌더링 된 구조와 컴포넌트 트리가 일치한다면 React는 [state를 보존](/learn/preserving-and-resetting-state)합니다.

<Sandpack>

```js src/index.js active
import { render } from 'react-dom';
import './styles.css';
import App from './App.js';

let i = 0;
setInterval(() => {
  render(
    <App counter={i} />,
    document.getElementById('root')
  );
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

`render`를 여러 번 호출하는 것은 일반적이지 않습니다. 보통 컴포넌트 내에서 [상태를 업데이트](/reference/react/useState)합니다.
