---
title: unmountComponentAtNode
---

<Deprecated>

이 API는 향후 React의 주요 버전에서 제거될 예정입니다.

React 18에서 `unmountComponentAtNode`는 [`root.unmount()`](/reference/react-dom/client/createRoot#root-unmount)로 교체되었습니다.

</Deprecated>

<Intro>

`unmountComponentAtNode`는 DOM에 마운트된 React 컴포넌트를 제거합니다.

```js
unmountComponentAtNode(domNode)
```

</Intro>

<InlineToc />

---

## 레퍼런스 {/*reference*/}

### `unmountComponentAtNode(domNode)` {/*unmountcomponentatnode*/}

`unmountComponentAtNode`를 호출해서 DOM에 마운트된 React 컴포넌트를 제거하고 관련된 이벤트 핸들러와 state를 정리합니다.

```js
import { unmountComponentAtNode } from 'react-dom';

const domNode = document.getElementById('root');
render(<App />, domNode);

unmountComponentAtNode(domNode);
```

[아래에서 더 많은 예시를 확인하세요.](#usage)

#### 매개변수 {/*parameters*/}

* `domNode`: [DOM 엘리먼트입니다.](https://developer.mozilla.org/en-US/docs/Web/API/Element) React는 이 엘리먼트에 마운트된 컴포넌트를 제거합니다.

#### 반환값 {/*returns*/}

`unmountComponentAtNode`는 컴포넌트가 마운트 해제되면 `true`를 반환하고 그렇지 않으면 `false`를 반환합니다.

---

## 사용법 {/*usage*/}

`unmountComponentAtNode`를 호출해서 <CodeStep step={2}>브라우저 DOM 노드</CodeStep>에서 <CodeStep step={1}>마운트된 React 컴포넌트</CodeStep>를 제거하고 관련된 이벤트 핸들러와 state를 정리합니다.

```js [[1, 5, "<App />"], [2, 5, "rootNode"], [2, 8, "rootNode"]]
import { render, unmountComponentAtNode } from 'react-dom';
import App from './App.js';

const rootNode = document.getElementById('root');
render(<App />, rootNode);

// ...
unmountComponentAtNode(rootNode);
```

### DOM 엘리먼트에서 React 애플리케이션 제거하기 {/*removing-a-react-app-from-a-dom-element*/}

때때로 기존 페이지나 일부만 React로 작성된 페이지에서 React를 "포함" 하고 싶을 수 있습니다. 이런 경우 렌더링된 DOM 노드에서 UI와 state 및 리스너를 모두 제거해서 React 애플리케이션을 "중지" 해야될 수 있습니다.

아래 예시에서는 "Render React App"을 클릭하면 React 애플리케이션을 렌더링합니다. "Unmount React App"을 클릭하면 React 애플리케이션을 제거합니다.

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <button id='render'>Render React App</button>
    <button id='unmount'>Unmount React App</button>
    <!-- This is the React App node -->
    <div id='root'></div>
  </body>
</html>
```

```js index.js active
import './styles.css';
import { render, unmountComponentAtNode } from 'react-dom';
import App from './App.js';

const domNode = document.getElementById('root');

document.getElementById('render').addEventListener('click', () => {
  render(<App />, domNode);
});

document.getElementById('unmount').addEventListener('click', () => {
  unmountComponentAtNode(domNode);
});
```

```js App.js
export default function App() {
  return <h1>Hello, world!</h1>;
}
```

</Sandpack>
