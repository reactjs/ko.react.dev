---
title: createPortal
---

<Intro>

`createPortal`을 사용하면 일부 자식을 DOM의 다른 부분으로 렌더링할 수 있습니다.

`createPortal` lets you render some children into a different part of the DOM.


```js
<div>
  <SomeComponent />
  {createPortal(children, domNode)}
</div>
```

</Intro>

<InlineToc />

---

## Reference 레퍼런스 {/*reference*/}

### `createPortal(children, domNode)` {/*createportal*/}

Portal을 생성하려면 `createPortal`을 호출하여 일부 JSX와 렌더링할 DOM 노드를 전달합니다.

To create a portal, call `createPortal`, passing some JSX, and the DOM node where it should be rendered:

```js
import { createPortal } from 'react-dom';

// ...

<div>
  <p>This child is placed in the parent div.</p>
  {createPortal(
    <p>This child is placed in the document body.</p>,
    document.body
  )}
</div>
```

[여기서 더 많은 예시들을 확인하세요.](#usage)
[See more examples below.](#usage)

Portal은 DOM 노드의 물리적 배치만 변경합니다.
다른 모든 방식으로, portal에 렌더링하는 JSX는 이를 렌더링하는 React 컴포넌트의 자식 노드 역할을 합니다. 예를 들어, 자식은 부모 트리가 제공하는 context에 액세스할 수 있으며, 이벤트는 React 트리에 따라 자식에서 부모로 버블업됩니다.

A portal only changes the physical placement of the DOM node. In every other way, the JSX you render into a portal acts as a child node of the React component that renders it. For example, the child can access the context provided by the parent tree, and events bubble up from children to parents according to the React tree.

#### Parameters 매개변수 {/*parameters*/}

* `children` : JSX의 일부(예를 들어 `<div />` 또는 `<SomeComponent />`), [Fragment](/reference/react/Fragment)(`<>...</>`), 문자열이나 숫자 또는 이들의 배열과 같이 React로 렌더링할 수 있는 모든 것입니다. 
* `children`: Anything that can be rendered with React, such as a piece of JSX (e.g. `<div />` or `<SomeComponent />`), a [Fragment](/reference/react/Fragment) (`<>...</>`), a string or a number, or an array of these.

* `domNode` : `document.getElementById()`가 반환하는 것과 같은 일부 DOM 노드. 노드가 이미 존재해야 합니다. 업데이트 중에 다른 DOM 노드를 전달하면 포털 콘텐츠가 다시 생성됩니다.
* `domNode`: Some DOM node, such as those returned by `document.getElementById()`. The node must already exist. Passing a different DOM node during an update will cause the portal content to be recreated.

#### Returns {/*returns*/}

`createPortal`은 JSX에 포함하거나 React 컴포넌트에서 반환할 수 있는 React 노드를 반환합니다. React가 렌더링 출력에서 이를 발견하면, 제공된 `children`을 제공된 `domNode` 안에 배치합니다. 

`createPortal` returns a React node that can be included into JSX or returned from a React component. If React encounters it in the render output, it will place the provided `children` inside the provided `domNode`.

#### Caveats 주의 사항 {/*caveats*/}

* Portal의 이벤트는 DOM 트리가 아닌 React 트리에 따라 전파됩니다. 예를 들어, portal 내부를 클릭했을 때 포털이 `<div onClick>`으로 감싸져 있으면 해당 `onClick` 핸들러가 실행됩니다. 이로 인해 문제가 발생하면 포털 내부에서 이벤트 전파를 중지하거나 portal 자체를 React 트리에서 위로 이동하세요.
* Events from portals propagate according to the React tree rather than the DOM tree. For example, if you click inside a portal, and the portal is wrapped in `<div onClick>`, that `onClick` handler will fire. If this causes issues, either stop the event propagation from inside the portal, or move the portal itself up in the React tree.

---

## Usage 사용 방법 {/*usage*/}

### Rendering to a different part of the DOM DOM의 다른 부분으로 렌더링하기 {/*rendering-to-a-different-part-of-the-dom*/}

*Portal*를 사용하면 컴포넌트가 일부 자식을 DOM의 다른 위치로 렌더링할 수 있습니다. 이를 통해 컴포넌트의 일부가 어떤 컨테이너에 있든 그 컨테이너에서 "탈출"할 수 있습니다. 예를 들어 컴포넌트는 모달 대화상자나 툴팁을 페이지의 나머지 부분 위와 외부에 표시할 수 있습니다.

*Portal* let your components render some of their children into a different place in the DOM. This lets a part of your component "escape" from whatever containers it may be in. For example, a component can display a modal dialog or a tooltip that appears above and outside of the rest of the page.

Portal을 생성하려면 <CodeStep step={1}>일부 JSX</CodeStep>와 함께 `createPortal`의 결과를 렌더링하고 <CodeStep step={2}>DOM 노드가 있어야 할 위치</CodeStep>를 지정합니다.

To create a portal, render the result of `createPortal` with <CodeStep step={1}>some JSX</CodeStep> and the <CodeStep step={2}>DOM node where it should go</CodeStep>:

```js [[1, 8, "<p>This child is placed in the document body.</p>"], [2, 9, "document.body"]]
import { createPortal } from 'react-dom';

function MyComponent() {
  return (
    <div style={{ border: '2px solid black' }}>
      <p>This child is placed in the parent div.</p>
      {createPortal(
        <p>This child is placed in the document body.</p>,
        document.body
      )}
    </div>
  );
}
```

React는 사용자가 <CodeStep step={1}>전달한 JSX</CodeStep>에 대한 DOM 노드를 사용자가 <CodeStep step={2}>제공한 DOM 노드</CodeStep> 안에 넣습니다.

React will put the DOM nodes for <CodeStep step={1}>the JSX you passed</CodeStep> inside of the <CodeStep step={2}>DOM node you provided</CodeStep>.


Portal이 없다면 두 번째 `<p>`는 상위 `<div>` 안에 배치되지만 portal은 이를 [`document.body`:] 안으로 "순간이동"합니다.

Without a portal, the second `<p>` would be placed inside the parent `<div>`, but the portal "teleported" it into the [`document.body`:](https://developer.mozilla.org/en-US/docs/Web/API/Document/body)

<Sandpack>

```js
import { createPortal } from 'react-dom';

export default function MyComponent() {
  return (
    <div style={{ border: '2px solid black' }}>
      <p>This child is placed in the parent div.</p>
      {createPortal(
        <p>This child is placed in the document body.</p>,
        document.body
      )}
    </div>
  );
}
```

</Sandpack>

두 번째 단락이 테두리가 있는 부모 `<div>` 외부에 시각적으로 어떻게 나타나는지 주목하세요. 개발자 도구로 DOM 구조를 검사하면 두 번째 `<p>`가 `<body>`에 바로 배치된 것을 확인할 수 있습니다.

Notice how the second paragraph visually appears outside the parent `<div>` with the border. If you inspect the DOM structure with developer tools, you'll see that the second `<p>` got placed directly into the `<body>`:

```html {4-6,9}
<body>
  <div id="root">
    ...
      <div style="border: 2px solid black">
        <p>This child is placed inside the parent div.</p>
      </div>
    ...
  </div>
  <p>This child is placed in the document body.</p>
</body>
```

Portal은 DOM 노드의 물리적 배치만 변경합니다. 다른 모든 면에서 portal에 렌더링하는 JSX는 이를 렌더링하는 React 컴포넌트의 자식 노드 역할을 합니다. 예를 들어 자식은 부모 트리가 제공하는 컨텍스트에 액세스할 수 있으며 이벤트는 여전히 React 트리에 따라 자식에서 부모로 버블업됩니다.

A portal only changes the physical placement of the DOM node. In every other way, the JSX you render into a portal acts as a child node of the React component that renders it. For example, the child can access the context provided by the parent tree, and events still bubble up from children to parents according to the React tree.

---

### Rendering a modal dialog with a portal portal이 있는 모달 대화 상자 렌더링하기 {/*rendering-a-modal-dialog-with-a-portal*/}

대화 상자를 불러오는 컴포넌트가 `overflow: hidden` 또는 대화 상자를 방해하는 다른 스타일이 있는 컨테이너 안에 있더라도 portal을 사용하여 페이지의 나머지 부분 위에 떠 있는 모달 대화 상자를 만들 수 있습니다.

You can use a portal to create a modal dialog that floats above the rest of the page, even if the component that summons the dialog is inside a container with `overflow: hidden` or other styles that interfere with the dialog.

이 예시에서 두 컨테이너에는 모달 대화 상자를 방해하는 스타일이 있지만, portal에 렌더링된 스타일은 영향을 받지 않는데, 그 이유는 DOM에서 모달이 상위 JSX 요소에 포함되지 않기 때문입니다.

In this example, the two containers have styles that disrupt the modal dialog, but the one rendered into a portal is unaffected because, in the DOM, the modal is not contained within the parent JSX elements.

<Sandpack>

```js App.js active
import NoPortalExample from './NoPortalExample';
import PortalExample from './PortalExample';

export default function App() {
  return (
    <>
      <div className="clipping-container">
        <NoPortalExample  />
      </div>
      <div className="clipping-container">
        <PortalExample />
      </div>
    </>
  );
}
```

```js NoPortalExample.js
import { useState } from 'react';
import ModalContent from './ModalContent.js';

export default function NoPortalExample() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Show modal without a portal
      </button>
      {showModal && (
        <ModalContent onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
```

```js PortalExample.js active
import { useState } from 'react';
import { createPortal } from 'react-dom';
import ModalContent from './ModalContent.js';

export default function PortalExample() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Show modal using a portal
      </button>
      {showModal && createPortal(
        <ModalContent onClose={() => setShowModal(false)} />,
        document.body
      )}
    </>
  );
}
```

```js ModalContent.js
export default function ModalContent({ onClose }) {
  return (
    <div className="modal">
      <div>I'm a modal dialog</div>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
```


```css styles.css
.clipping-container {
  position: relative;
  border: 1px solid #aaa;
  margin-bottom: 12px;
  padding: 12px;
  width: 250px;
  height: 80px;
  overflow: hidden;
}

.modal {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  box-shadow: rgba(100, 100, 111, 0.3) 0px 7px 29px 0px;
  background-color: white;
  border: 2px solid rgb(240, 240, 240);
  border-radius: 12px;
  position:  absolute;
  width: 250px;
  top: 70px;
  left: calc(50% - 125px);
  bottom: 70px;
}
```

</Sandpack>

<Pitfall>

Portal을 사용할 때 앱에 액세스할 수 있는지 확인하는 것이 중요합니다. 예를 들어 사용자가 portal 안팎으로 자연스럽게 초점을 이동할 수 있도록 키보드 포커스를 관리해야 할 수 있습니다.

It's important to make sure that your app is accessible when using portals. For instance, you may need to manage keyboard focus so that the user can move the focus in and out of the portal in a natural way.

모달을 만들 때는 [WAI-ARIA 모달 제작 관행](https://www.w3.org/WAI/ARIA/apg/#dialog_modal)을 따르세요. 커뮤니티 패키지를 사용하는 경우 해당 패키지가 접근 가능한지, 이 가이드라인을 따르고 있는지 확인하세요.

Follow the [WAI-ARIA Modal Authoring Practices](https://www.w3.org/WAI/ARIA/apg/#dialog_modal) when creating modals. If you use a community package, ensure that it is accessible and follows these guidelines.

</Pitfall>

---

### Rendering React components into non-React server markup React 컴포넌트를 비 React 서버 마크업으로 렌더링하기 {/*rendering-react-components-into-non-react-server-markup*/}

Portals은 React 루트가 React로 빌드되지 않은 정적 또는 서버 렌더링 페이지의 일부일 때 유용할 수 있습니다. 예를 들어, 페이지가 Rails와 같은 서버 프레임워크로 빌드된 경우 사이드바와 같은 정적 영역 내에 인터랙티브 영역을 만들 수 있습니다. [여러 개의 개별 React 루트](/reference/react-dom/client/createRoot#rendering-a-page-partially-built-with-react)를 사용하는 것과 비교하여, portals을 사용하면 앱의 일부가 DOM의 다른 부분에 렌더링되더라도 공유 상태를 가진 단일 React 트리로 취급할 수 있습니다.

Portals can be useful if your React root is only part of a static or server-rendered page that isn't built with React. For example, if your page is built with a server framework like Rails, you can create areas of interactivity within static areas such as sidebars. Compared with having [multiple separate React roots,](/reference/react-dom/client/createRoot#rendering-a-page-partially-built-with-react) portals let you treat the app as a single React tree with shared state even though its parts render to different parts of the DOM.

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <h1>Welcome to my hybrid app</h1>
    <div class="parent">
      <div class="sidebar">
        This is server non-React markup
        <div id="sidebar-content"></div>
      </div>
      <div id="root"></div>
    </div>
  </body>
</html>
```

```js index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js App.js active
import { createPortal } from 'react-dom';

const sidebarContentEl = document.getElementById('sidebar-content');

export default function App() {
  return (
    <>
      <MainContent />
      {createPortal(
        <SidebarContent />,
        sidebarContentEl
      )}
    </>
  );
}

function MainContent() {
  return <p>This part is rendered by React</p>;
}

function SidebarContent() {
  return <p>This part is also rendered by React!</p>;
}
```

```css
.parent {
  display: flex;
  flex-direction: row;
}

#root {
  margin-top: 12px;
}

.sidebar {
  padding:  12px;
  background-color: #eee;
  width: 200px;
  height: 200px;
  margin-right: 12px;
}

#sidebar-content {
  margin-top: 18px;
  display: block;
  background-color: white;
}

p {
  margin: 0;
}
```

</Sandpack>

---

### Rendering React components into non-React DOM nodes React 컴포넌트를 비 React DOM 노드로 렌더링하기 {/*rendering-react-components-into-non-react-dom-nodes*/}

Portal을 사용해 React 외부에서 관리되는 DOM 노드의 콘텐츠를 관리할 수도 있습니다. 예를 들어, React가 아닌 맵 위젯과 통합하고 팝업 안에 React 콘텐츠를 렌더링하고 싶다고 가정해 봅시다. 이렇게 하려면 렌더링할 DOM 노드를 저장할 `popupContainer` 상태 변수를 선언하세요.

You can also use a portal to manage the content of a DOM node that's managed outside of React. For example, suppose you're integrating with a non-React map widget and you want to render React content inside a popup. To do this, declare a `popupContainer` state variable to store the DOM node you're going to render into:

```js
const [popupContainer, setPopupContainer] = useState(null);
```

서드파티 위젯을 만들 때 위젯이 반환하는 DOM 노드를 저장하여 렌더링할 수 있도록 합니다.

When you create the third-party widget, store the DOM node returned by the widget so you can render into it:

```js {5-6}
useEffect(() => {
  if (mapRef.current === null) {
    const map = createMapWidget(containerRef.current);
    mapRef.current = map;
    const popupDiv = addPopupToMapWidget(map);
    setPopupContainer(popupDiv);
  }
}, []);
```

이렇게 하면 `createPortal`을 사용하여 React 콘텐츠가 사용 가능해지면 `popupContainer`로 렌더링할 수 있습니다.

This lets you use `createPortal` to render React content into `popupContainer` once it becomes available:

```js {3-6}
return (
  <div style={{ width: 250, height: 250 }} ref={containerRef}>
    {popupContainer !== null && createPortal(
      <p>Hello from React!</p>,
      popupContainer
    )}
  </div>
);
```

다음은 실행할 수 있는 전체 예제입니다.

Here is a complete example you can play with:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "leaflet": "1.9.1",
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

```js App.js
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { createMapWidget, addPopupToMapWidget } from './map-widget.js';

export default function Map() {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [popupContainer, setPopupContainer] = useState(null);

  useEffect(() => {
    if (mapRef.current === null) {
      const map = createMapWidget(containerRef.current);
      mapRef.current = map;
      const popupDiv = addPopupToMapWidget(map);
      setPopupContainer(popupDiv);
    }
  }, []);

  return (
    <div style={{ width: 250, height: 250 }} ref={containerRef}>
      {popupContainer !== null && createPortal(
        <p>Hello from React!</p>,
        popupContainer
      )}
    </div>
  );
}
```

```js map-widget.js
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';

export function createMapWidget(containerDomNode) {
  const map = L.map(containerDomNode);
  map.setView([0, 0], 0);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map);
  return map;
}

export function addPopupToMapWidget(map) {
  const popupDiv = document.createElement('div');
  L.popup()
    .setLatLng([0, 0])
    .setContent(popupDiv)
    .openOn(map);
  return popupDiv;
}
```

```css
button { margin: 5px; }
```

</Sandpack>
