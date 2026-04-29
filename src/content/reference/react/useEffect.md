---
title: useEffect
---

<Intro>

`useEffect`는 [외부 시스템과 컴포넌트를 동기화](/learn/synchronizing-with-effects)하는 React Hook입니다.

```js
useEffect(setup, dependencies?)
```

</Intro>

<InlineToc />

---

## 레퍼런스 {/*reference*/}

### `useEffect(setup, dependencies?)` {/*useeffect*/}

컴포넌트의 최상위 레벨에서 `useEffect`를 호출하여 Effect를 선언할 수 있습니다.

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);
  // ...
}
```

[아래에서 더 많은 예시를 보세요.](#usage)

#### 매개변수 {/*parameters*/}

+ `setup(설정)`: Effect의 로직이 포함된 함수입니다. 설정 함수는 선택적으로 *clean up(정리)* 함수를 반환할 수 있습니다. React는 컴포넌트가 DOM에 추가된 이후에 설정 함수를 실행합니다. 의존성의 변화에 따라 컴포넌트가 리렌더링이 되었을 경우, (설정 함수에 정리 함수를 추가했었다면) React는 이전 렌더링에 사용된 값으로 정리 함수를 실행한 후 새로운 값으로 설정 함수를 실행합니다. 컴포넌트가 DOM에서 제거된 경우에도 정리 함수를 실행합니다.

+ `dependencies`**(선택사항)**: `설정` 함수의 코드 내부에서 참조되는 모든 반응형 값들이 포함된 배열로 구성됩니다. 반응형 값에는 props와 state, 모든 변수 및 컴포넌트 body에 직접적으로 선언된 함수들이 포함됩니다. 린터가 [React 환경에 맞게 설정되어 있을 경우](/learn/editor-setup#linting), 린터는 모든 반응형 값들이 의존성에 제대로 명시되어 있는지 검증할 것입니다. 의존성 배열은 항상 일정한 수의 항목을 가지고 있어야 하며 `[dep1, dep2, dep3]`과 같이 작성되어야 합니다. React는 각각의 의존성들을 [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 비교법을 통해 이전 값과 비교합니다. 의존성을 생략할 경우, Effect는 컴포넌트가 리렌더링될 때마다 실행됩니다. [인수에 의존성 배열을 추가했을 때, 빈 배열을 추가했을 때, 의존성을 추가하지 않았을 때의 차이를 확인해 보세요.](#examples-dependencies)

#### 반환값 {/*returns*/}

`useEffect`는 `undefined`를 반환합니다.

#### 주의 사항 {/*caveats*/}

* `useEffect`는 Hook이므로 컴포넌트의 최상위 또는 커스텀 Hook에서만 호출할 수 있습니다. 반복문이나 조건문에서는 사용할 수 없습니다. 필요한 경우 새로운 컴포넌트를 추출하고 해당 컴포넌트로 state를 이동해서 사용할 수 있습니다.

* 외부 시스템과 컴포넌트를 동기화할 필요가 없는 경우, [Effect를 선언할 필요가 없을 수 있습니다.](/learn/you-might-not-need-an-effect)

* Strict Mode를 사용할 경우, React는 실제 첫 번째 설정 함수가 실행되기 이전에 **개발 모드에만 한정하여 한 번의 추가적인 설정 + 정리 사이클을 실행합니다.** 이는 정리 로직이 설정 로직을 완벽히 "반영"하고 설정 로직이 수행하는 작업을 중단하거나 취소할 수 있는지를 확인하는 스트레스 테스트입니다. 이에 따라 문제가 생길 경우, [정리 함수를 구현하십시오.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

* 만약 의존성이 객체이거나 컴포넌트 내부에 선언된 함수일 경우에는 Effect가 필요 이상으로 재실행될 수 있습니다. 이를 수정하려면 불필요한 [객체 의존성](#removing-unnecessary-object-dependencies)이나 [함수 의존성](#updating-state-based-on-previous-state-from-an-effect)을 제거하세요. 또는 [state 업데이트를 추출](#updating-state-based-on-previous-state-from-an-effect)하거나 Effect 밖으로 [비 반응형 로직](#reading-the-latest-props-and-state-from-an-effect)을 빼낼 수 있습니다.

* Effect가 사용자 상호작용(클릭 등)에 의해 발생하지 않았다면, React는 일반적으로 **Effect를 실행하기 전에 브라우저가 업데이트된 화면을 먼저 렌더링하도록 합니다.** 만약 Effect가 시각적인 작업을 수행하고 (예: 툴팁의 위치 조정), 이에 따라 지연이 눈에 띄게 나타난다면 (예: 깜빡임 현상), `useEffect` 대신 [`useLayoutEffect`](/reference/react/useLayoutEffect)를 사용하세요.

* Effect가 사용자 상호작용(클릭 등)으로 인해 발생한 경우, **React는 화면이 업데이트되어 브라우저가 화면을 그리기 전에 Effect를 실행할 수 있습니다.** 이것이 Effect의 결과를 이벤트 시스템이 관찰할 수 있도록 보장합니다. 이는 대개 예상대로 작동하지만, `alert()`와 같이 작업을 브라우저가 화면을 그린 후로 미뤄야 하는 경우 `setTimeout`을 활용할 수 있습니다. 자세한 내용은 [reactwg/react-18/128](https://github.com/reactwg/react-18/discussions/128)을 참조하세요.

* Effect가 사용자 상호작용(클릭 등)에 의해 발생했더라도, **React는 때로 Effect 내부의 상태 업데이트를 처리하기 전에 브라우저가 화면을 다시 그리도록 허용할 수 있습니다.** 이는 대개 예상대로 작동하지만, 브라우저가 화면을 다시 그리지 않도록 막아야 하는 상황이라면 `useEffect` 대신 [`useLayoutEffect`](/reference/react/useLayoutEffect)를 사용해야 합니다.

* Effect는 **client 환경에서만 동작합니다.** 서버 렌더링에서는 동작하지 않습니다.

---

## 사용방법 {/*usage*/}

### 외부 시스템과 연결 {/*connecting-to-an-external-system*/}

몇몇 컴포넌트들은 페이지에 표시되는 동안 네트워크나 브라우저 API, 또는 서드파티 라이브러리와의 연결이 유지되어야 합니다. React에 제어되지 않는 이러한 시스템들을 *외부 시스템(external)* 이라 부릅니다.

[컴포넌트를 외부 시스템과 연결](/learn/synchronizing-with-effects)하려면 컴포넌트의 최상위 레벨에서 `useEffect`를 호출해야 합니다.

```js [[1, 8, "const connection = createConnection(serverUrl, roomId);"], [1, 9, "connection.connect();"], [2, 11, "connection.disconnect();"], [3, 13, "[serverUrl, roomId]"]]
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);
  // ...
}
```

`useEffect`는 2개의 인수가 필요합니다.

1. 외부 시스템과 컴포넌트를 연결하는 <CodeStep step={1}>설정 코드</CodeStep>가 포함된 *설정 함수*
   - 외부 시스템과의 연결을 해제하는 <CodeStep step={2}>정리 코드</CodeStep>가 포함된 *정리 함수*를 반환할 수 있습니다.
2. 위 함수 내부에서 사용하는 컴포넌트에서 비롯된 반응형 값들을 포함하는 <CodeStep step={3}>의존성 배열</CodeStep>

**React는 설정 함수와 정리 함수가 필요할 때마다 호출할 수 있으며, 이는 여러 번 호출될 수 있습니다.**

1. 컴포넌트가 화면에 추가되었을 때 <CodeStep step={1}>설정 코드</CodeStep>가 동작합니다 *(마운트 시)*.
2. <CodeStep step={3}>의존성</CodeStep>이 변경된 컴포넌트가 리렌더링 될 때마다 아래 동작을 수행합니다.
   - 먼저 <CodeStep step={2}>정리 코드</CodeStep>가 오래된 props와 state와 함께 실행됩니다.
   - 이후, <CodeStep step={1}>설정 코드</CodeStep>가 새로운 props와 state와 함께 실행됩니다.
3. 컴포넌트가 화면에서 제거된 이후에 <CodeStep step={2}>정리 코드</CodeStep>가 마지막으로 실행됩니다 *(마운트 해제 시)*.

**위의 예시를 통해 순서를 설명해 보겠습니다.**

위의 `ChatRoom` 컴포넌트가 화면에 추가되면 초기 `serverUrl`과 `roomId`를 이용해 채팅방과 연결될 것입니다. 리렌더링에 의해 `serverUrl` 또는 `roomId`가 변경된다면 (예를 들어 사용자가 드롭다운 메뉴를 이용해 다른 채팅방을 선택할 경우) *Effect는 이전 채팅방과의 연결을 해제하고 다음 채팅방과 연결합니다.* `ChatRoom` 컴포넌트가 화면에서 제거된다면 Effect는 마지막 채팅방과 이뤄진 연결을 해제할 것입니다.

React는 **[버그를 발견하기 위해](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed) 개발모드에서 <CodeStep step={1}>설정</CodeStep>이 실행되기 전에 <CodeStep step={1}>설정</CodeStep>과 <CodeStep step={2}>정리</CodeStep>를 한 번 더 실행시킵니다.** 이는 스트레스 테스트의 하나로써 Effect의 로직이 정확하게 수행되고 있는지를 검증합니다. 만약 가시적인 이슈가 보인다면 정리 함수의 로직에 놓친 부분이 있는 것입니다. 정리 함수는 설정 함수의 어떠한 동작이라도 중지하거나 실행 취소를 할 수 있어야 하며, 사용자는 *설정* 함수가 한 번 호출될 때와 *설정* → *정리* → *설정* 순서로 호출될 때의 차이를 느낄 수 없어야 합니다.

**[각각의 Effect를 독립적인 프로세스로 작성](/learn/lifecycle-of-reactive-effects#each-effect-represents-a-separate-synchronization-process)하고 [정확한 설정/정리 사이클을 고려하세요.](/learn/lifecycle-of-reactive-effects#thinking-from-the-effects-perspective)** 컴포넌트의 마운트, 업데이트, 마운트 해제 여부는 중요하지 않아야 합니다. 정리 로직이 설정 로직과 정확하게 "미러링"될 때, Effect는 설정과 정리를 필요한 만큼 견고하게 처리합니다.

<Note>

Effect는 (채팅 시스템과 같은) 외부 시스템과 [컴포넌트가 동기화를 유지](/learn/synchronizing-with-effects)할 수 있도록 합니다. *외부 시스템*은 React에 의해 컨트롤되지 않는 모든 코드를 의미합니다. 예를 들어:

* <CodeStep step={1}>[`setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)</CodeStep>에 의해 관리되는 타이머 또는 <CodeStep step={2}>[`clearInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval)</CodeStep>.
* <CodeStep step={1}>[`window.addEventListener()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)</CodeStep>을 이용한 이벤트 구독 또는 <CodeStep step={2}>[`window.removeEventListener()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener)</CodeStep>.
* <CodeStep step={1}>`animation.start()`</CodeStep>와 같은 서드 파티 애니메이션 라이브러리 API 또는 <CodeStep step={2}>`animation.reset()`</CodeStep>.

**만약 외부 시스템과 React를 연결할 필요가 없다면 [Effect를 사용할 필요가 없을 수 있습니다.](/learn/you-might-not-need-an-effect)**

</Note>

<Recipes titleText="외부 시스템과 연결 예시" titleId="examples-connecting">

#### 채팅 서버와 연결 {/*connecting-to-a-chat-server*/}

이 예시에서는 `ChatRoom` 컴포넌트의 Effect를 통해 `chat.js`로 정의된 외부 시스템과 연결을 유지합니다. "Open chat"을 누르면 `ChatRoom` 컴포넌트가 나타납니다. 이 샌드박스는 개발 모드에서 동작하므로 [추가적인 연결-연결해제 사이클](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed)이 동작합니다. 드롭다운 메뉴나 input을 이용해 `roomId` 또는 `serverUrl`를 변경하고 어떻게 Effect가 chat을 재연결하는지 확인해 보세요. "Close chat"을 눌러 Effect가 마지막에 연결되었던 chat을 연결 해제하는 것도 확인해 보세요.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // 실제 구현은 실제로 서버에 연결됩니다.
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

<Solution />

#### 전역 브라우저 이벤트 감시하기 {/*listening-to-a-global-browser-event*/}

이 예시에서는 DOM 자체를 외부 시스템으로 사용합니다. 일반적으로 JSX와 함께 이벤트 리스너를 명시하지만 이 예시에서 외부 시스템은 브라우저 DOM 자체입니다. 일반적으로 JSX를 이용해 이벤트 리스너를 지정하지만 이 방식만으로는 전역 window 객체를 감시할 수 없습니다. Effect을 이용해 React를 window 객체와 연결해서 이벤트를 감시할 수 있습니다. `pointermove` 이벤트를 감시할 경우, 커서(또는 손가락)의 위치를 추적하고 빨간 점을 해당 위치로 이동시킬 수 있습니다.

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => {
      window.removeEventListener('pointermove', handleMove);
    };
  }, []);

  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity: 0.6,
      transform: `translate(${position.x}px, ${position.y}px)`,
      pointerEvents: 'none',
      left: -20,
      top: -20,
      width: 40,
      height: 40,
    }} />
  );
}
```

```css
body {
  min-height: 300px;
}
```

</Sandpack>

<Solution />

#### 애니메이션 동작시키기 {/*triggering-an-animation*/}

이 예시에서 외부 시스템은 `animation.js`파일에 있는 라이브러리입니다. 이 라이브러리는 DOM 노드를 인자로 받는 `FadeInAnimation`라는 자바스크립트 클래스를 제공하며, 이 클래스는 애니메이션을 제어하기 위한 `start()`과 `stop()` 메서드를 노출합니다. 이 컴포넌트는 [ref를 이용하여](/learn/manipulating-the-dom-with-refs) DOM 노드에 접근합니다. Effect는 ref를 통해 DOM 노드를 읽고, 컴포넌트가 나타날 때 해당 노드의 애니메이션을 자동으로 시작시킵니다.

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { FadeInAnimation } from './animation.js';

function Welcome() {
  const ref = useRef(null);

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(1000);
    return () => {
      animation.stop();
    };
  }, []);

  return (
    <h1
      ref={ref}
      style={{
        opacity: 0,
        color: 'white',
        padding: 50,
        textAlign: 'center',
        fontSize: 50,
        backgroundImage: 'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)'
      }}
    >
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js src/animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    if (this.duration === 0) {
      // Jump to end immediately
      this.onProgress(1);
    } else {
      this.onProgress(0);
      // Start animating
      this.startTime = performance.now();
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress < 1) {
      // We still have more frames to paint
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onProgress(progress) {
    this.node.style.opacity = progress;
  }
  stop() {
    cancelAnimationFrame(this.frameId);
    this.startTime = null;
    this.frameId = null;
    this.duration = 0;
  }
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
```

</Sandpack>

<Solution />

#### 모달 대화 상자 제어하기 {/*controlling-a-modal-dialog*/}

이 예시에서 외부 시스템은 브라우저 DOM입니다. `ModalDialog` 컴포넌트는 [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog) 요소를 렌더링합니다. Effect를 사용하여 `isOpen` prop을 [`showModal()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal)과 [`close()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/close)메서드 호출에 동기화합니다.

<Sandpack>

```js
import { useState } from 'react';
import ModalDialog from './ModalDialog.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Open dialog
      </button>
      <ModalDialog isOpen={show}>
        Hello there!
        <br />
        <button onClick={() => {
          setShow(false);
        }}>Close</button>
      </ModalDialog>
    </>
  );
}
```

```js src/ModalDialog.js active
import { useEffect, useRef } from 'react';

export default function ModalDialog({ isOpen, children }) {
  const ref = useRef();

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const dialog = ref.current;
    dialog.showModal();
    return () => {
      dialog.close();
    };
  }, [isOpen]);

  return <dialog ref={ref}>{children}</dialog>;
}
```

```css
body {
  min-height: 300px;
}
```

</Sandpack>

<Solution />

#### 요소의 가시성 추적 {/*tracking-element-visibility*/}

이 예시에서 외부 시스템은 브라우저 DOM입니다. `App` 컴포넌트는 긴 리스트 목록을 표시한 다음 `Box` 컴포넌트를 표시하고 다시 긴 리스트 목록을 표시합니다. 목록을 아래로 스크롤 해보세요. `Box` 컴포넌트 전체가 뷰포트 내에서 완전히 보일 때 배경 색상이 검은색으로 변경되는 것을 확인해 보세요. 이를 구현하기 위해 `Box` 컴포넌트는 [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)를 관리하는 Effect를 사용합니다. 이 브라우저 API는 DOM 요소가 뷰포트 내에서 가시성이 변경될 때를 알려줍니다.

<Sandpack>

```js
import Box from './Box.js';

export default function App() {
  return (
    <>
      <LongSection />
      <Box />
      <LongSection />
      <Box />
      <LongSection />
    </>
  );
}

function LongSection() {
  const items = [];
  for (let i = 0; i < 50; i++) {
    items.push(<li key={i}>Item #{i} (keep scrolling)</li>);
  }
  return <ul>{items}</ul>
}
```

```js src/Box.js active
import { useRef, useEffect } from 'react';

export default function Box() {
  const ref = useRef(null);

  useEffect(() => {
    const div = ref.current;
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        document.body.style.backgroundColor = 'black';
        document.body.style.color = 'white';
      } else {
        document.body.style.backgroundColor = 'white';
        document.body.style.color = 'black';
      }
    }, {
       threshold: 1.0
    });
    observer.observe(div);
    return () => {
      observer.disconnect();
    }
  }, []);

  return (
    <div ref={ref} style={{
      margin: 20,
      height: 100,
      width: 100,
      border: '2px solid black',
      backgroundColor: 'blue'
    }} />
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

### 커스텀 Hook을 Effect로 감싸기 {/*wrapping-effects-in-custom-hooks*/}

Effect는 ["탈출구"](/learn/escape-hatches) 입니다. "React 바깥으로 나가야 할 때"와 유즈케이스에 필요한 빌트인 솔루션이 없을 때 사용합니다. 만약 Effect를 자주 작성해야 한다면 컴포넌트가 의존하고 있는 공통적인 동작들을 [커스텀 Hook](/learn/reusing-logic-with-custom-hooks)으로 추출해야 한다는 신호일 수 있습니다.

예시로 아래의 `useChatRoom` 커스텀 Hook은 Effect의 로직을 조금 더 선언적인 API로 보일 수 있도록 숨겨줍니다.

```js {1,11}
function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

이제 이 커스텀 Hook을 어떤 컴포넌트에서도 이용할 수 있습니다.

```js {4-7}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```


또한 React 생태계에는 각종 목적에 맞는 훌륭한 커스텀 Hook들도 많이 존재합니다.

[이 링크를 통해 커스텀 Hook에 대해 더 많이 공부해보세요.](/learn/reusing-logic-with-custom-hooks)

<Recipes titleText="커스텀 Hook에서 Effect를 활용하는 예시" titleId="examples-custom-hooks">

#### 커스텀 `useChatRoom` Hook {/*custom-usechatroom-hook*/}

이 예시는 [이전 예시](#examples-connecting) 중 하나와 동일하지만 로직이 커스텀 Hook으로 추출되었습니다.

<Sandpack>

```js
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/useChatRoom.js
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // 실제 구현은 실제로 서버에 연결됩니다.
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

<Solution />

#### 커스텀 `useWindowListener` Hook {/*custom-usewindowlistener-hook*/}

이 예시는 [이전 예시](#examples-connecting) 중 하나와 동일하지만 로직이 커스텀 Hook으로 추출되었습니다.

<Sandpack>

```js
import { useState } from 'react';
import { useWindowListener } from './useWindowListener.js';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useWindowListener('pointermove', (e) => {
    setPosition({ x: e.clientX, y: e.clientY });
  });

  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity: 0.6,
      transform: `translate(${position.x}px, ${position.y}px)`,
      pointerEvents: 'none',
      left: -20,
      top: -20,
      width: 40,
      height: 40,
    }} />
  );
}
```

```js src/useWindowListener.js
import { useState, useEffect } from 'react';

export function useWindowListener(eventType, listener) {
  useEffect(() => {
    window.addEventListener(eventType, listener);
    return () => {
      window.removeEventListener(eventType, listener);
    };
  }, [eventType, listener]);
}
```

```css
body {
  min-height: 300px;
}
```

</Sandpack>

<Solution />

#### 커스텀 `useIntersectionObserver` Hook {/*custom-useintersectionobserver-hook*/}

이 예시는 [이전 예시](#examples-connecting) 중 하나와 동일하지만 로직이 부분적으로 커스텀 Hook으로 추출되었습니다.

<Sandpack>

```js
import Box from './Box.js';

export default function App() {
  return (
    <>
      <LongSection />
      <Box />
      <LongSection />
      <Box />
      <LongSection />
    </>
  );
}

function LongSection() {
  const items = [];
  for (let i = 0; i < 50; i++) {
    items.push(<li key={i}>Item #{i} (keep scrolling)</li>);
  }
  return <ul>{items}</ul>
}
```

```js src/Box.js active
import { useRef, useEffect } from 'react';
import { useIntersectionObserver } from './useIntersectionObserver.js';

export default function Box() {
  const ref = useRef(null);
  const isIntersecting = useIntersectionObserver(ref);

  useEffect(() => {
   if (isIntersecting) {
      document.body.style.backgroundColor = 'black';
      document.body.style.color = 'white';
    } else {
      document.body.style.backgroundColor = 'white';
      document.body.style.color = 'black';
    }
  }, [isIntersecting]);

  return (
    <div ref={ref} style={{
      margin: 20,
      height: 100,
      width: 100,
      border: '2px solid black',
      backgroundColor: 'blue'
    }} />
  );
}
```

```js src/useIntersectionObserver.js
import { useState, useEffect } from 'react';

export function useIntersectionObserver(ref) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const div = ref.current;
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      setIsIntersecting(entry.isIntersecting);
    }, {
       threshold: 1.0
    });
    observer.observe(div);
    return () => {
      observer.disconnect();
    }
  }, [ref]);

  return isIntersecting;
}
```

</Sandpack>

<Solution />

</Recipes>

---

### React로 작성되지 않은 위젯 제어하기 {/*controlling-a-non-react-widget*/}

가끔은 컴포넌트의 prop 또는 state를 외부 시스템과 동기화해야할 때가 있습니다.

예를 들어 React 없이 작성된 서드 파티 지도 위젯이나 비디오 플레이어 컴포넌트가 있다면 이 컴포넌트의 state를 현재 React 컴포넌트의 state와 일치하도록 하기 위해 Effect를 사용할 수 있습니다. 이 Effect는 `map-widget.js`에 정의된 `MapWidget` 클래스의 인스턴스를 생성합니다. `Map` 컴포넌트의 `zoomLevel` prop을 변경할 때, Effect는 해당 클래스 인스턴스의 `setZoom()`을 호출하여 동기화를 유지합니다.

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

```js src/App.js
import { useState } from 'react';
import Map from './Map.js';

export default function App() {
  const [zoomLevel, setZoomLevel] = useState(0);
  return (
    <>
      Zoom level: {zoomLevel}x
      <button onClick={() => setZoomLevel(zoomLevel + 1)}>+</button>
      <button onClick={() => setZoomLevel(zoomLevel - 1)}>-</button>
      <hr />
      <Map zoomLevel={zoomLevel} />
    </>
  );
}
```

```js src/Map.js active
import { useRef, useEffect } from 'react';
import { MapWidget } from './map-widget.js';

export default function Map({ zoomLevel }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current === null) {
      mapRef.current = new MapWidget(containerRef.current);
    }

    const map = mapRef.current;
    map.setZoom(zoomLevel);
  }, [zoomLevel]);

  return (
    <div
      style={{ width: 200, height: 200 }}
      ref={containerRef}
    />
  );
}
```

```js src/map-widget.js
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';

export class MapWidget {
  constructor(domNode) {
    this.map = L.map(domNode, {
      zoomControl: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      scrollWheelZoom: false,
      zoomAnimation: false,
      touchZoom: false,
      zoomSnap: 0.1
    });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);
    this.map.setView([0, 0], 0);
  }
  setZoom(level) {
    this.map.setZoom(level);
  }
}
```

```css
button { margin: 5px; }
```

</Sandpack>

이 예시에서는 정리 함수가 필요하지 않습니다. 이는 `MapWidget` 클래스가 클래스에 전달된 DOM 노드만 관리하기 때문입니다. `Map` 컴포넌트가 트리에서 제거된 후, 브라우저의 자바스크립트 엔진에 의해 DOM 노드와 `MapWidget` 클래스 인스턴스 모두가 자동으로 가비지 컬렉션에 의해 정리됩니다.

---

### Effect를 이용한 데이터 페칭 {/*fetching-data-with-effects*/}

Effect를 사용하여 컴포넌트의 데이터를 페칭할 수 있습니다. [프레임워크를 사용한다면](/learn/creating-a-react-app#full-stack-frameworks) Effect를 직접 작성하는 것보다 프레임워크의 데이터 페칭 메커니즘을 사용하는 것이 훨씬 더 효율적이라는 점에 유의하세요.

만약 직접 Effect를 작성하여 데이터를 페칭하고 싶다면, 코드는 다음과 같을 수 있습니다.

```js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);

  useEffect(() => {
    let ignore = false;
    setBio(null);
    fetchBio(person).then(result => {
      if (!ignore) {
        setBio(result);
      }
    });
    return () => {
      ignore = true;
    };
  }, [person]);

  // ...
```

`ignore` 변수의 초기값이 `false`로 설정되고 정리 함수 동작 중에 `true`로 설정되는 것에 주목하세요. 이 로직은 [코드가 "경쟁 상태(race conditions)"에 빠지지 않도록 보장해 줍니다.](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect) 네트워크 요청을 보낸 순서와 응답을 받는 순서가 다르게 동작할 수 있기 때문에 이러한 처리가 필요합니다.

<Sandpack>

{/* TODO(@poteto) - investigate potential false positives in react compiler validation */}
```js src/App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);
  useEffect(() => {
    let ignore = false;
    setBio(null);
    fetchBio(person).then(result => {
      if (!ignore) {
        setBio(result);
      }
    });
    return () => {
      ignore = true;
    }
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Loading...'}</i></p>
    </>
  );
}
```

```js src/api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('This is ' + person + '’s bio.');
    }, delay);
  })
}
```

</Sandpack>

또한 [`async` / `await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) 구문을 사용하여 코드를 다시 작성할 수 있지만 여전히 정리 함수를 제공해야 합니다.

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);
  useEffect(() => {
    async function startFetching() {
      setBio(null);
      const result = await fetchBio(person);
      if (!ignore) {
        setBio(result);
      }
    }

    let ignore = false;
    startFetching();
    return () => {
      ignore = true;
    }
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Loading...'}</i></p>
    </>
  );
}
```

```js src/api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('This is ' + person + '’s bio.');
    }, delay);
  })
}
```

</Sandpack>

Effect에서 직접 데이터 페칭 로직을 작성하면 나중에 캐싱 기능이나 서버 렌더링과 같은 최적화를 추가하기 어려워집니다. [자체 제작된 커스텀 Hook이나 커뮤니티에 의해 유지보수되는 Hook을 사용하는 편이 더 간단합니다.](/learn/reusing-logic-with-custom-hooks#when-to-use-custom-hooks)

<DeepDive>

#### Effect에서 데이터를 페칭하는 좋은 대안은 무엇인가요? {/*what-are-good-alternatives-to-data-fetching-in-effects*/}

Effect 내부에서 `fetch` 호출을 작성하는 것은 클라이언트 사이드 앱에서 데이터를 페칭하는 [가장 인기 있는 방법입니다.](https://www.robinwieruch.de/react-hooks-fetch-data/) 하지만 이것은 매우 수동적인 접근 방식이며 큰 단점이 있습니다.

- **Effect는 서버에서는 실행되지 않습니다.** 이는 초기 서버 렌더링 된 HTML이 데이터가 없는 state만을 포함한다는 것을 의미합니다. 클라이언트 컴퓨터는 모든 자바스크립트를 다운로드 받고 앱을 렌더링한 다음 데이터를 로드합니다. 이는 효율적이지 않을 수 있습니다.
- **Effect 내부에서 직접 페칭을 하는 것은 네트워크 폭포(network waterfalls)가 생성되기 쉽게 합니다.** 부모 컴포넌트 렌더링 후 일부 데이터를 페칭하고 나서 자식 컴포넌트가 렌더링 됩니다. 이후 자식 컴포넌트가 자신의 데이터를 페칭하기 시작합니다. 네트워크의 속도가 빠르지 않다면 이 방법은 모든 데이터를 병렬로 페칭하는 것보다 훨씬 느립니다.
- **Effect 내부에서 직접 데이터를 페칭하는 것은 일반적으로 데이터를 미리 로드하거나 캐싱하지 않는다는 것을 의미합니다.** 예를 들어 컴포넌트가 마운트 해제되고 다시 마운트되었을 때 데이터를 다시 가져와야 합니다.
- **사용하기 매우 불편한 방법입니다.** [경쟁 조건](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect)과 같은 버그를 발생시키지 않도록 fetch 호출을 작성할 때 상당한 양의 보일러 플레이트 코드가 필요합니다.

이러한 단점은 React만 해당되는 것이 아닙니다. 다른 라이브러리를 사용하여 데이터를 페칭할 때도 해당됩니다. 라우팅과 마찬가지로 데이터 페칭은 세부적인 사항이 많으므로 다음과 같은 접근 방식을 권장합니다.

- **[프레임워크](/learn/creating-a-react-app#full-stack-frameworks)를 사용한다면, 내장된 데이터 페칭 메커니즘을 사용하세요.** 최신 React 프레임워크는 효율적이며 위와 같은 단점에서 자유로운 통합 데이터 페칭 메커니즘을 갖추고 있습니다.
- **그렇지 않다면, 클라이언트 사이드 캐시를 사용하거나 직접 만드는 것을 고려해 보세요.** 인기 있는 오픈 소스 솔루션으로는 [TanStack Query](https://tanstack.com/query/latest/), [useSWR](https://swr.vercel.app/), [React Router 6.4+](https://beta.reactrouter.com/en/main/start/overview) 등이 있습니다. 직접 솔루션을 구축할 수도 있는데, 이 경우 내부적으로는 Effect를 사용하면서도 요청 중복 제거, 응답 캐싱, 네트워크 폭포 방지(데이터를 미리 로드하거나 데이터 요구 사항을 라우트로 끌어올리는 방식)를 위한 로직을 추가하게 됩니다.

만약 이러한 접근 방식이 적합하지 않다면 Effect 내부에서 데이터를 페칭하는 것을 계속 진행할 수 있습니다.

</DeepDive>

---

### 반응형값 의존성 지정 {/*specifying-reactive-dependencies*/}

**Effect의 의존성을 "선택"할 수 없다는 점에 유의하세요.** Effect 코드에서 사용하는 모든 <CodeStep step={2}>반응형 값</CodeStep>은 의존성으로 선언되어야 합니다. Effect의 의존성 배열은 코드에 의해 결정됩니다.

```js [[2, 1, "roomId"], [2, 2, "serverUrl"], [2, 5, "serverUrl"], [2, 5, "roomId"], [2, 8, "serverUrl"], [2, 8, "roomId"]]
function ChatRoom({ roomId }) { // 이것은 반응형 값입니다
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // 이것도 반응형 값입니다

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // 이 Effect는 이 반응형 값들을 읽습니다
    connection.connect();
    return () => connection.disconnect();
  }, [serverUrl, roomId]); // ✅ 그래서 이 값들을 Effect의 의존성으로 지정해야 합니다
  // ...
}
```

`serverUrl` 또는 `roomId`가 변경될 때마다 Effect는 새로운 값을 이용해 채팅을 다시 연결할 것입니다.

**[반응형 값](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values)** 에는 props와 컴포넌트 내부에 선언된 모든 변수나 함수들이 포함됩니다. `roomId`와 `serverUrl`은 반응형 값이므로 이들을 의존성에서 제거하면 안 됩니다. 이들을 누락했을 때 [린터가 React 환경에 맞게 설정되어 있었다면](/learn/editor-setup#linting) 린터는 이것을 수정해야 하는 실수로 표시합니다.

```js {8}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // 🔴 React Hook useEffect has missing dependencies: 'roomId' and 'serverUrl'
  // ...
}
```

**의존성을 제거하려면 [그것이 의존성이 되지 않아야 함을 린터에 증명해야 합니다.](/learn/removing-effect-dependencies#removing-unnecessary-dependencies)** 예를 들어, `serverUrl` 을 컴포넌트 밖으로 이동하여 그것이 반응적이지 않고 리렌더링될 때 변경되지 않을 것임을 증명할 수 있습니다.

```js {1,8}
const serverUrl = 'https://localhost:1234'; // 더 이상 반응형 값이 아님

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ 모든 의존성이 선언됨
  // ...
}
```

이제 `serverUrl`은 반응형 값이 아니며 (리렌더링될 때 변경되지 않을 것이므로), 의존성에 추가할 필요가 없습니다. **Effect의 코드가 어떤 반응형 값도 사용하지 않는다면 그 의존성 목록은 비어있어야 합니다. (`[]`)**

```js {1,2,9}
const serverUrl = 'https://localhost:1234'; // 더 이상 반응형 값이 아님
const roomId = 'music'; // 더 이상 반응형 값이 아님

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ 모든 의존성이 선언됨
  // ...
}
```

[의존성이 비어있는 Effect](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means)는 컴포넌트의 props나 state가 변경되도 다시 실행되지 않습니다.

<Pitfall>

기존의 코드 베이스에서 아래와 같이 린터를 억제하고 있는 일부 Effect가 있을 수 있습니다.

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 Avoid suppressing the linter like this:
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

**의존성이 코드와 일치하지 않을 때 버그가 도입될 위험이 큽니다.** 린터를 억제함으로써 Effect가 의존하는 값에 대해 React가 '거짓말'을 하게 됩니다. 린터를 속이는 대신 [이러한 값들이 불필요하다는 것을 증명하세요.](/learn/removing-effect-dependencies#removing-unnecessary-dependencies)

</Pitfall>

<Recipes titleText="반응형 값을 의존성으로 추가하는 예시" titleId="examples-dependencies">

#### 의존성 배열 전달 {/*passing-a-dependency-array*/}

의존성을 명시하면 Effect는 **초기 렌더링 후 _그리고_ 의존성 값 변경과 함께 리렌더링이 된 후 동작합니다.**

```js {3}
useEffect(() => {
  // ...
}, [a, b]); // a나 b가 다르면 다시 실행됨
```

아래 예시에서는 `serverUrl`와 `roomId`은 [반응형 값](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values)이므로 둘 다 의존성으로 지정해야 합니다. 결과적으로 드롭다운에서 다른 방을 선택하거나 서버 URL 입력을 편집하면 채팅이 다시 연결됩니다. 그러나 `message`는 Effect에서 사용되지 않으므로(의존성이 아니므로), 메세지를 편집해도 대화가 다시 연결되지 않습니다.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
      <label>
        Your message:{' '}
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
        <button onClick={() => setShow(!show)}>
          {show ? 'Close chat' : 'Open chat'}
        </button>
      </label>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId}/>}
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // 실제 구현은 실제로 서버에 연결됩니다.
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { margin-bottom: 10px; }
button { margin-left: 5px; }
```

</Sandpack>

<Solution />

#### 빈 의존성 배열 전달 {/*passing-an-empty-dependency-array*/}

만약 Effect가 정말 어떤 반응형 값도 사용하지 않는다면 그것은 **초기 렌더링 이후 한번만 실행됩니다.**

```js {3}
useEffect(() => {
  // ...
}, []); // 다시 실행되지 않음 (개발 환경에서만 한번 실행)
```

**개발 환경에서는 빈 의존성 배열이 있더라도 버그를 찾기 위해 설정과 정리가 [한번 더 실행됩니다.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)**

이 예시에서 `serverUrl`와 `roomId`는 모두 하드코딩되어 있습니다. 컴포넌트 외부에서 선언되었으므로 반응형 값이 아니며, 따라서 의존성이 아닙니다. 의존성 배열이 비어있으므로 Effect는 리렌더링될 때까지 실행되지 않습니다.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'music';

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <label>
        Your message:{' '}
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom />}
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // 실제 구현은 실제로 서버에 연결됩니다.
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

</Sandpack>

<Solution />


#### 의존성 배열을 전달하지 않았을 때 {/*passing-no-dependency-array-at-all*/}

의존성 배열을 아예 사용하지 않을 경우, Effect는 컴포넌트의 모든 렌더링과 리렌더링마다 동작합니다.

```js {3}
useEffect(() => {
  // ...
}); // 항상 다시 실행됨
```

이 예시에서 Effect는 `serverUrl`과 `roomId`를 변경할 때 다시 실행하는 것은 합리적입니다. 그러나 `message`를 변경할때도 다시 실행되므로 바람직하지 않습니다. 보통은 이런 이슈를 방지하고자 의존성 배열을 명시합니다.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }); // 의존성 배열이 아예 없음

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
      <label>
        Your message:{' '}
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
        <button onClick={() => setShow(!show)}>
          {show ? 'Close chat' : 'Open chat'}
        </button>
      </label>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId}/>}
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // 실제 구현은 실제로 서버에 연결됩니다.
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { margin-bottom: 10px; }
button { margin-left: 5px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### Effect에서 이전 state를 기반으로 state 업데이트하기 {/*updating-state-based-on-previous-state-from-an-effect*/}

Effect에서 이전 state를 기반으로 state를 업데이트하려면 문제가 발생할 수 있습니다.

```js {6,9}
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(count + 1); // 초마다 카운터를 증가시키고 싶습니다...
    }, 1000)
    return () => clearInterval(intervalId);
  }, [count]); // 🚩 ... 하지만 'count'를 의존성으로 명시하면 항상 인터벌이 초기화됩니다.
  // ...
}
```

`count`가 반응형 값이므로 반드시 의존성 배열에 추가해야 합니다. 그러나 `count`가 변경되는 것은 Effect가 정리된 후 다시 설정되는 것을 야기하므로 `count`는 계속 증가할 것입니다. 이상적이지 않은 방식입니다.

이러한 현상을 방지하려면 [`c => c + 1` state 변경함수](/reference/react/useState#updating-state-based-on-the-previous-state)를 `setCount`에 추가하세요.

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(c => c + 1); // ✅ State 업데이터를 전달
    }, 1000);
    return () => clearInterval(intervalId);
  }, []); // ✅ 이제 count는 의존성이 아닙니다

  return <h1>{count}</h1>;
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

`c => c + 1`을 `count + 1` 대신 전달하고 있으므로, [Effect는 더 이상 `count`에 의존하지 않습니다.](/learn/removing-effect-dependencies#are-you-reading-some-state-to-calculate-the-next-state) 이 수정으로 인해 `count`가 변경될 때마다 Effect가 정리 및 설정을 다시 실행할 필요가 없게 됩니다.

---


### 불필요한 객체 의존성 제거하기 {/*removing-unnecessary-object-dependencies*/}

Effect가 렌더링 중에 생성된 객체나 함수에 의존하는 경우, 너무 자주 실행될 수 있습니다. 예를 들어 이 Effect는 매 렌더링 후에 다시 연결됩니다. 이는 [렌더링마다 `options` 객체가 다르기 때문입니다.](/learn/removing-effect-dependencies#does-some-reactive-value-change-unintentionally)

```js {6-9,12,15}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = { // 🚩 이 객체는 재 렌더링 될 때마다 새로 생성됩니다
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options); // 객체가 Effect 안에서 사용됩니다
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // 🚩 결과적으로, 의존성이 재 렌더링 때마다 다릅니다
  // ...
```

렌더링 중에 생성된 객체를 의존성으로 사용하는 것을 피하세요. 대신 객체를 Effect 내에서 생성하세요.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // 실제 구현은 실제로 서버에 연결됩니다.
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

이제 `options` 객체를 Effect 내에서 생성하면, Effect 자체는 roomId 문자열에만 의존합니다.

이 수정으로 입력란에 텍스트를 입력하더라도 채팅이 다시 연결되지 않습니다. 객체와는 달리 `roomId`와 같은 문자열은 다른 값으로 설정하지 않는 한 변경되지 않습니다. [의존성 제거에 관한 자세한 내용은 여기를 참고하세요.](/learn/removing-effect-dependencies)

---

### 불필요한 함수 의존성 제거하기 {/*removing-unnecessary-function-dependencies*/}

Effect가 렌더링 중에 생성된 객체나 함수에 의존하는 경우, 너무 자주 실행될 수 있습니다. 예를 들어 이 Effect는 매 렌더링 후에 다시 연결됩니다. 이는 [렌더링마다 `createOptions` 함수가 다르기 때문입니다.](/learn/removing-effect-dependencies#does-some-reactive-value-change-unintentionally)

```js {4-9,12,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  function createOptions() { // 🚩 이 함수는 재 렌더링 될 때마다 새로 생성됩니다
    return {
      serverUrl: serverUrl,
      roomId: roomId
    };
  }

  useEffect(() => {
    const options = createOptions(); // 함수가 Effect 안에서 사용됩니다
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // 🚩 결과적으로, 의존성이 재 렌더링 때마다 다릅니다
  // ...
```

리렌더링마다 함수를 처음부터 생성하는 것 그 자체로는 문제가 되지 않고, 이를 최적화할 필요는 없습니다. 그러나 이것을 Effect의 의존성으로 사용하는 경우 Effect가 리렌더링 후마다 다시 실행되게 합니다.

렌더링 중에 생성된 함수를 의존성으로 사용하는 것을 피하세요. 대신 Effect 내에서 함수를 선언하세요.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() {
      return {
        serverUrl: serverUrl,
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // 실제 구현은 실제로 서버에 연결됩니다.
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

`createOptions` 함수가 Effect 내부에 선언되었으므로, Effect 자체는 `roomId` 문자열에만 의존합니다. 이 수정을 통해 입력란에 입력하는 것만으로 채팅이 다시 연결되지 않습니다. `roomId`와 같은 문자열은 다른 값으로 설정하지 않는 한 변경되지 않기 때문입니다. [의존성 제거에 대한 자세한 내용은 여기를 참고하세요.](/learn/removing-effect-dependencies)

---

### Effect에서 최신 props와 state를 읽기 {/*reading-the-latest-props-and-state-from-an-effect*/}

기본적으로 Effect에서 반응형 값을 읽을 때는 해당 값을 의존성으로 추가해야 합니다. 이를 통해 Effect가 그 값의 모든 변경에 "반응"하도록 보장합니다. 대부분의 의존성에서는 이것이 원하는 동작입니다.

**그러나 때로는 Effect에서 최신 props와 state를 '반응'하지 않고 읽고 싶을 수 있습니다.** 예를 들어 페이지 방문마다 쇼핑 카트에 담긴 항목 수를 기록하고 싶다고 가정해 보겠습니다.

```js {3}
function Page({ url, shoppingCart }) {
  useEffect(() => {
    logVisit(url, shoppingCart.length);
  }, [url, shoppingCart]); // ✅ 모든 의존성이 선언됨
  // ...
}
```

**`url`이 변경될 때마다 새로운 페이지 방문을 기록하고 싶지만, `shoppingCart`만 변경되었을 때는 기록하고 싶지 *않다면* 어떻게 해야 할까요?** [반응형 규칙](#specifying-reactive-dependencies)을 위반하지 않고는 `shoppingCart`를 의존성에서 제외할 수 없습니다. 하지만 어떤 코드가 Effect 내부에서 호출되더라도 그 코드가 변경에 '반응'하기를 *원하지 않는다고* 표현할 수 있습니다. [`useEffectEvent`](/reference/react/useEffectEvent) Hook으로 [*Effect 이벤트*를 선언](/learn/separating-events-from-effects#declaring-an-effect-event)하고, `shoppingCart`를 읽는 코드를 그 안으로 옮기세요.

```js {2-4,7,8}
function Page({ url, shoppingCart }) {
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, shoppingCart.length)
  });

  useEffect(() => {
    onVisit(url);
  }, [url]); // ✅ 모든 의존성이 선언됨
  // ...
}
```

**Effect 이벤트는 반응적이지 않으며 Effect의 의존성에서 배제되어야 합니다.** Effect 이벤트에는 비 반응형 코드(Effect 이벤트 로직은 최신 props와 state를 읽을 수 있음)를 배치할 수 있습니다. `onVisit`내의 `shoppingCart`를 읽음으로써 `shoppingCart`의 변경으로 인한 Effect의 재실행을 방지합니다.

[Effect 이벤트가 어떻게 반응형 및 비 반응형 코드를 분리하는 데 도움이 되는지에 대한 자세한 내용은 여기를 읽어보세요.](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events)


---

### 서버와 클라이언트에서 다른 컨텐츠를 표시하기 {/*displaying-different-content-on-the-server-and-the-client*/}

앱이 ([직접](/reference/react-dom/server) 혹은 [프레임워크](/learn/creating-a-react-app#full-stack-frameworks)를 통해) 서버 렌더링을 사용하는 경우, 컴포넌트는 두 가지 서로 다른 환경에서 렌더링됩니다. 서버에서는 초기 HTML을 생성하기 위해 렌더링됩니다. 클라이언트에서는 React가 렌더링 코드를 다시 실행하여 해당 HTML에 이벤트 핸들러를 연결할 수 있도록 합니다. 이러한 이유로 [hydration](/reference/react-dom/client/hydrateRoot#hydrating-server-rendered-html)이 동작하려면 초기 렌더링 결과물이 클라이언트와 서버에서 동일해야 합니다.

드물게 클라이언트에서 다른 내용을 표시해야 할 수 있습니다. 예를 들어 앱이 [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)에서 일부 데이터를 읽는 경우, 이를 서버에서 구현할 수 없습니다. 다음은 이것을 구현하는 방법입니다.


{/* TODO(@poteto) - investigate potential false positives in react compiler validation */}
```js
function MyComponent() {
  const [didMount, setDidMount] = useState(false);

  useEffect(() => {
    setDidMount(true);
  }, []);

  if (didMount) {
    // ... 클라이언트 전용 JSX 반환 ...
  }  else {
    // ... 초기 JSX 반환 ...
  }
}
```

앱이 로딩 중인 동안 사용자는 초기 렌더링 출력을 볼 것입니다. 그다음 로딩 및 hydration이 완료되면 Effect가 실행되어 `didMount`를 `true`로 설정하면서 다시 렌더링이 동작합니다. 이로써 클라이언트 전용 렌더링 출력으로 전환됩니다. Effect는 서버에서 실행되지 않으므로 초기 서버 렌더링 중의 `didMount`는 `false`가 됩니다.

이 패턴은 적절히 사용해야 합니다. 느린 연결 환경을 가진 사용자는 초기 렌더링 화면을 상당한 시간 동안 볼 것이므로 컴포넌트의 모양을 급변시키지 않는 것이 좋습니다. 많은 경우에는 CSS를 사용하여 조건부로 다양한 것들을 표시하는 방법으로 대처할 수 있습니다.

---

## 트러블 슈팅 {/*troubleshooting*/}

### Effect가 컴포넌트 마운트 시 2번 동작합니다. {/*my-effect-runs-twice-when-the-component-mounts*/}

개발 환경에서 Strict Mode가 활성화되면 React는 실제 설정 이전에 설정과 정리를 한번 더 실행합니다.

이것은 Effect의 로직이 올바르게 구현되었는지 확인하는 스트레스 테스트입니다. 이에 따라 눈에 띄는 문제가 발생한다면 정리 함수에 어떤 로직이 누락되었을 수 있습니다. 정리 함수는 설정 함수가 수행한 것을 중지하거나 되돌릴 수 있어야 합니다. 일반적인 지침으로는 사용자가 설정이 한번 호출되는 것(배포 환경과 같이)과 설정 → 정리 → 설정 순서로 호출되는 것을 구별할 수 없어야 한다는 것입니다.

이것이 [버그를 찾는 데 어떻게 도움이 되며,](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed) [로직을 어떻게 수정하는지](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)에 자세히 알아보려면 여기를 읽어보세요.

---

### Effect가 매 리렌더링마다 실행됩니다. {/*my-effect-runs-after-every-re-render*/}

먼저 의존성 배열에 값을 추가했는지 확인해 보세요.

```js {3}
useEffect(() => {
  // ...
}); // 🚩 의존성 배열이 없음. 재 렌더링 될 때마다 재실행됨!
```

의존성 배열을 명시했음에도 Effect가 여전히 반복해서 실행된다면 의존성이 렌더링마다 다르기 때문입니다.

이 문제를 해결하기 위해 콘솔에 의존성을 수동으로 기록하는 방법으로 디버깅할 수 있습니다.

```js {5}
  useEffect(() => {
    // ..
  }, [serverUrl, roomId]);

  console.log([serverUrl, roomId]);
```

그다음 콘솔에서 기록된 다른 렌더링 배열을 마우스 오른쪽 버튼으로 클릭하고 두 배열 모두에 대해 전역 변수로 저장을 선택할 수 있습니다. 첫 번째 요소가 `temp1`이고 두 번째 요소가 `temp2`라고 가정하면 브라우저 콘솔을 사용하여 양쪽 배열의 각 의존성이 동일한지 확인할 수 있습니다.

```js
Object.is(temp1[0], temp2[0]); // 첫 번째 의존성이 배열 간에 동일한가요?
Object.is(temp1[1], temp2[1]); // 두 번째 의존성이 배열 간에 동일한가요?
Object.is(temp1[2], temp2[2]); // ... 나머지 모든 의존성도 확인합니다  ...
```

렌더링마다 다른 의존성을 찾아냈다면 일반적으로 다음 중 하나의 방법으로 수정할 수 있습니다.

- [Effect에서 이전 state를 기반으로 state 업데이트하기](#updating-state-based-on-previous-state-from-an-effect)
- [불필요한 객체 의존성 제거하기](#removing-unnecessary-object-dependencies)
- [불필요한 함수 의존성 제거하기](#removing-unnecessary-function-dependencies)
- [Effect에서 최신 props와 state를 읽기](#reading-the-latest-props-and-state-from-an-effect)

최후의 수단으로 (이러한 방법들이 도움이 되지 않은 경우), [`useMemo`](/reference/react/useMemo#memoizing-a-dependency-of-another-hook)나 [`useCallback`](/reference/react/useCallback#preventing-an-effect-from-firing-too-often)(함수의 경우)을 이용할 수 있습니다.

---

### Effect가 무한 반복됩니다. {/*my-effect-keeps-re-running-in-an-infinite-cycle*/}

Effect가 무한 반복되려면 다음 두 가지 조건이 충족되어야 합니다.

- Effect에서 state를 업데이트함.
- 변경된 state가 리렌더링을 유발하며, 이에 따라 Effect의 종속성이 변경됨.

문제를 해결하기 전에 Effect가 외부 시스템(DOM, 네트워크, 서드파티 위젯 등)에 연결되어 있는지 스스로 자문해보세요. Effect에서 왜 state를 변경했나요? 변경된 state가 외부 시스템과 동기화됐나요? 또는 Effect를 통해 애플리케이션의 데이터 흐름을 관리하려고 하는 건가요?

외부 시스템이 없다면 [Effect를 제거](/learn/you-might-not-need-an-effect)해서 로직을 단순화할 수 있는지 고려해보세요.

만약 실제로 어떤 외부 시스템과 동기화 중이라면 Effect가 state를 언제 어떤 조건에서 업데이트해야 하는지에 대해 고려해 보세요. 컴포넌트의 시각적 출력에 영향을 주는 state가 변했나요? 렌더링에 사용되지 않는 데이터를 추적해야 한다면 리렌더링을 야기하지 않는 [ref](/reference/react/useRef#referencing-a-value-with-a-ref)가 더 적합할 수 있습니다. Effect가 필요 이상으로 state를 업데이트하는지(리렌더링을 야기하지 않도록) 확인해 보세요.

마지막으로 Effect가 제대로 된 시점에 state를 업데이트했지만 여전히 무한 반복되는 경우, 해당 state의 업데이트가 Effect의 종속성의 변경을 야기했을 수 있습니다. [종속성 변경을 디버깅하는 방법을 읽어보세요.](/reference/react/useEffect#my-effect-runs-after-every-re-render)

---

### 컴포넌트가 마운트 해제되지 않았음에도 정리 함수가 실행됩니다. {/*my-cleanup-logic-runs-even-though-my-component-didnt-unmount*/}

정리 함수는 마운트 해제 시 뿐만 아니라 변경된 종속성으로 인한 모든 리렌더링 전에 실행됩니다. 또한 개발 환경에서는 React가 [컴포넌트가 마운트된 직후에 한 번 더 설정과 정리를 실행합니다.](#my-effect-runs-twice-when-the-component-mounts)

설정 코드와 상응하는 정리 코드가 없다면 보통은 코드에 문제가 있을 가능성이 높습니다.

```js {2-5}
useEffect(() => {
  // 🔴 피하세요: 상응하는 설정 로직이 없는 정리 로직
  return () => {
    doSomething();
  };
}, []);
```

정리 로직은 설정 로직과 '대칭'이어야 하며 설정이 수행한 것을 중지하거나 되돌릴 수 있어야 합니다.

```js {2-3,5}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);
```

[Effect의 생명주기와 컴포넌트의 생명주기가 어떻게 다른지 확인해 보세요.](/learn/lifecycle-of-reactive-effects#the-lifecycle-of-an-effect)

---

### Effect가 시각적인 작업을 수행하며, 실행되기 전에 깜빡임이 보입니다. {/*my-effect-does-something-visual-and-i-see-a-flicker-before-it-runs*/}

Effect가 `브라우저가 화면을 그리는 것`을 차단해야 하는 경우 `useEffect`를 [`useLayoutEffect`](/reference/react/useLayoutEffect)로 대체하세요. **이것은 대부분의 Effect에는 필요하지 않습니다.** 브라우저 페인팅 이전에 Effect를 실행하는 것이 중요한 경우에만 필요합니다. 예를 들어 사용자가 보기 전에 툴팁의 위치를 측정하고 지정해야 하는 경우가 있습니다.
