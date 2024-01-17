---
title: 탈출구
---

<Intro>

일부 컴포넌트는 React 외부의 시스템을 제어하고 동기화해야 할 수 있습니다. 예를 들어 브라우저 API를 사용해 input에 초점을 맞추거나, React 없이 구현된 비디오 플레이어를 재생 및 일시 정지하거나, 원격 서버에 연결해서 메시지를 수신해야 할 수 있습니다. 이 장에서는 React의 "외부"로 나가서 외부 시스템에 연결할 수 있는 탈출구를 배웁니다. 대부분의 애플리케이션 로직과 데이터 흐름은 이러한 기능에 의존해서는 안 됩니다.

</Intro>

<YouWillLearn isChapter={true}>

* [다시 렌더링하지 않고 정보를 "기억"하는 방법](/learn/referencing-values-with-refs)
* [React가 관리하는 DOM 엘리먼트에 접근하는 방법](/learn/manipulating-the-dom-with-refs)
* [컴포넌트를 외부 시스템과 동기화하는 방법](/learn/synchronizing-with-effects)
* [컴포넌트에서 불필요한 Effect를 제거하는 방법](/learn/you-might-not-need-an-effect)
* [Effect의 생명주기가 컴포넌트와 어떻게 다른지](/learn/lifecycle-of-reactive-effects)
* [일부 값이 Effect를 다시 발생시키는 것을 막는 방법](/learn/separating-events-from-effects)
* [Effect 재실행을 줄이는 방법](/learn/removing-effect-dependencies)
* [컴포넌트 간 로직을 공유하는 방법](/learn/reusing-logic-with-custom-hooks)

</YouWillLearn>

## Ref로 값 참조하기 {/*referencing-values-with-refs*/}

컴포넌트가 일부 정보를 “기억”하고 싶지만, 해당 정보가 [렌더링을 유발](/learn/render-and-commit)하지 않도록 하려면 ref를 사용하세요.

```js
const ref = useRef(0);
```

state처럼 ref는 다시 렌더링하는 사이에 React에 의해 유지됩니다. 다만 state의 설정은 컴포넌트가 다시 렌더링 되지만, ref의 변경은 그렇지 않습니다! `ref.current` 프로퍼티를 통해 해당 ref의 현재 값에 접근할 수 있습니다.

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('You clicked ' + ref.current + ' times!');
  }

  return (
    <button onClick={handleClick}>
      Click me!
    </button>
  );
}
```

</Sandpack>

ref는 React가 추적하지 않는 컴포넌트의 비밀 주머니와 같습니다. 예를 들어 ref를 사용하여 컴포넌트의 렌더링 출력에 영향을 주지 않는 [timeout ID](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#return_value), [DOM 엘리먼트](https://developer.mozilla.org/en-US/docs/Web/API/Element) 및 기타 객체를 저장할 수 있습니다.

<LearnMore path="/learn/referencing-values-with-refs">

ref를 사용하여 정보를 기억하는 방법을 배우려면 **[Ref로 값 참조하기](/learn/referencing-values-with-refs)** 를 읽어보세요.

</LearnMore>

## Ref로 DOM 조작하기 {/*manipulating-the-dom-with-refs*/}

React는 렌더링 결과물에 맞춰 DOM 변경을 자동으로 처리하기 때문에 컴포넌트에서 자주 DOM을 조작해야 할 필요는 없습니다. 하지만 가끔 특정 노드에 포커스를 옮기거나, 스크롤 위치를 옮기거나, 위치와 크기를 측정하기 위해서 React가 관리하는 DOM 요소에 접근해야 할 때가 있습니다. React는 이런 작업을 수행하는 내장 방법을 제공하지 않기 때문에 DOM 노드에 접근하기 위한 ref가 필요할 것입니다. 예를 들어 버튼을 클릭하면 ref를 사용해 input에 포커스를 옮길 것입니다.

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

<LearnMore path="/learn/manipulating-the-dom-with-refs">

React가 관리하는 DOM 엘리먼트에 접근하는 방법을 배우려면 **[Ref로 DOM 조작하기](/learn/manipulating-the-dom-with-refs)** 를 읽어보세요.

</LearnMore>

## Effect로 값 동기화하기 {/*synchronizing-with-effects*/}

일부 컴포넌트는 외부 시스템과 동기화해야 합니다. 예를 들어 React state에 따라 React가 아닌 컴포넌트를 제어하거나, 채팅 서버에 대한 연결을 설정하거나, 컴포넌트가 화면에 나타났을 때 분석 로그를 보낼 수 있습니다. 특정 이벤트를 처리하는 이벤트 핸들러와 달리 Effect는 렌더링 후 일부 코드를 실행합니다. 컴포넌트를 React 외부 시스템과 동기화할 때 이를 사용하세요.

Play/Pause를 몇 번 누르고 비디오 플레이어가 `isPlaying` prop 값에 어떻게 동기화되는지 확인하세요.

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying]);

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

많은 Effect는 스스로 "클린업"하기도 합니다. 예를 들어 채팅 서버에 대한 연결을 설정하는 Effect는 해당 서버에서 컴포넌트의 연결을 끊는 방법을 React에 알려주는 *클린업 함수* 를 반환해야 합니다.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the chat!</h1>;
}
```

```js src/chat.js
export function createConnection() {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting...');
    },
    disconnect() {
      console.log('❌ Disconnected.');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
```

</Sandpack>

개발 모드에서 React는 즉시 실행되고 Effect를 한 번 더 클린업합니다. 그래서 `"✅ Connecting..."`이 두 번 인쇄되는 것입니다. 이렇게 하여 클린업 함수를 구현하는 것을 잊지 않도록 합니다.

<LearnMore path="/learn/synchronizing-with-effects">

컴포넌트를 외부 시스템과 동기화하는 방법을 배우려면 **[Effect로 값 동기화하기](/learn/synchronizing-with-effects)** 를 읽어보세요.

</LearnMore>

## Effect가 필요하지 않은 경우 {/*you-might-not-need-an-effect*/}

Effect는 React 패러다임에서 벗어날 수 있는 탈출구입니다. Effect를 사용하면 React를 “벗어나” 컴포넌트를 외부 시스템과 동기화할 수 있습니다. 외부 시스템이 관여하지 않는 경우 (예를 들어 일부 props 또는 state가 변경될 때 컴포넌트의 state를 업데이트하려는 경우) Effect가 필요하지 않습니다. 불필요한 Effect를 제거하면 코드를 더 쉽게 따라갈 수 있고, 실행 속도가 빨라지며, 에러 발생 가능성이 줄어듭니다.

Effect가 필요하지 않은 두 가지 일반적인 경우가 있습니다.
- **렌더링을 위해 데이터를 변환하는 데 Effect가 필요하지 않습니다.**
- **사용자 이벤트를 핸들링하는 데 Effect가 필요하지 않습니다.**

예를 들어 다른 state에 따라 일부 state를 조정하는 데는 Effect가 필요하지 않습니다.

```js {5-9}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');

  // 🔴 Avoid: redundant state and unnecessary Effect
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
  // ...
}
```

대신에 렌더링하는 동안 가능한 한 많이 계산하세요.

```js {4-5}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  // ✅ Good: calculated during rendering
  const fullName = firstName + ' ' + lastName;
  // ...
}
```

그러나 외부 시스템과 동기화하려면 Effects가 *필요* 합니다.

<LearnMore path="/learn/you-might-not-need-an-effect">

불필요한 Effect를 제거하는 방법을 배우려면 **[Effect가 필요하지 않은 경우](/learn/you-might-not-need-an-effect)** 를 읽어보세요.

</LearnMore>

## React Effect의 생명주기 {/*lifecycle-of-reactive-effects*/}

Effect는 컴포넌트와 다른 생명주기를 가집니다. 컴포넌트는 마운트, 업데이트 또는 언마운트할 수 있습니다. 반면 Effect는 동기화를 시작하거나 후에 동기화를 중지하는 두 가지 작업만 할 수 있습니다. Effect가 시간에 따라 변하는 props와 state에 의존하는 경우 이 주기는 여러 번 발생할 수 있습니다.

다음 Effect는 `roomId` prop의 값에 의존합니다. Props는 다시 렌더링할 때 변할 수 있는 *반응형 값* 입니다. `roomId`가 변경되면 Effect가 *다시 동기화* (및 서버에 다시 연결)합니다.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
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
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
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

React는 Effect의 의존성을 올바르게 명시했는지 확인하는 린터 규칙을 제공합니다. 위의 예시에서 의존성 목록에 `roomId`를 명시하는 것을 잊어버렸다면, 린터가 해당 버그를 자동으로 찾아낼 것입니다.

<LearnMore path="/learn/lifecycle-of-reactive-effects">

Effect의 생명주기가 컴포넌트와 어떻게 다른지를 배우려면 **[React Effect의 생명주기](/learn/lifecycle-of-reactive-effects)** 를 읽어보세요.

</LearnMore>

## Effect에서 이벤트 분리하기 {/*separating-events-from-effects*/}

<Wip>

이 섹션에서는 아직 안정된 버전의 React로 **출시되지 않은 실험적인 API**에 대해 설명합니다.

</Wip>

이벤트 핸들러는 같은 상호작용을 반복하는 경우에만 다시 실행됩니다. Effect는 이벤트 핸들러와 달리 prop이나 state 변수 등 읽은 값이 마지막 렌더링 때와 다르면 다시 동기화합니다. 때로는 두 동작이 섞여서 어떤 값에는 반응해 다시 실행되지만, 다른 값에는 그러지 않는 Effect를 원할 때도 있습니다. 이 페이지에서 그 방법을 알려드리겠습니다.

Effect 내의 모든 코드는 *반응형* 이며, 읽은 반응형 값이 다시 렌더링되는 것으로 인해 변경되면 다시 실행됩니다. 예를 들어 다음의 Effect는 `roomId` 또는 `theme`이 변경되면 채팅에 다시 연결됩니다:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, theme]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'} 
      />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

이것은 이상적이지 않습니다. `roomId`가 변경된 경우에만 채팅에 다시 연결하고 싶습니다. `theme`를 전환해도 채팅에 다시 연결되지 않아야 합니다! `theme`를 읽는 코드를 Effect에서 *Effect Event* 로 옮기세요.

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'} 
      />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js src/notifications.js hidden
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

Effect Event 내부의 코드는 반응이 아니므로 `theme`를 변경해도 더 이상 Effect가 다시 연결하지 않습니다.

<LearnMore path="/learn/separating-events-from-effects">

일부 값이 Effect를 다시 발생시키는 것을 막는 방법을 배우려면 **[Effect에서 이벤트 분리하기](/learn/separating-events-from-effects)** 를 읽어보세요.

</LearnMore>

## Effect의 의존성 제거하기 {/*removing-effect-dependencies*/}

Effect를 작성하면 린터는 Effect의 의존성 목록에 Effect가 읽는 모든 반응형 값(예를 들어 props 및 State)을 포함했는지 확인합니다. 이렇게 하면 Effect가 컴포넌트의 최신 props 및 State와 동기화 상태를 유지할 수 있습니다. 불필요한 의존성으로 인해 Effect가 너무 자주 실행되거나 무한 루프를 생성할 수도 있습니다. 이 가이드를 따라 Effect에서 불필요한 의존성을 검토하고 제거하세요.

예를 들어 다음 Effect는 사용자가 input을 편집할 때마다 다시 생성되는 `options` 객체에 의존합니다.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

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
  // A real implementation would actually connect to the server
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

해당 채팅에 메시지를 입력할 때마다 채팅이 다시 연결되는 것을 원치 않을 것입니다. 이 문제를 해결하려면 Effect 내에서 `options` 객체를 생성하여 Effect가 `roomId` 문자열에만 의존하도록 하세요.

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
  // A real implementation would actually connect to the server
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

의존성 목록을 편집하여 `options` 의존성을 제거하지 않았음을 알 수 있습니다. 그것은 잘못된 방법일 것입니다. 대신 주변 코드를 변경함으로써 의존성을 *불필요* 하게 만들었습니다. 의존성 목록을 Effect의 코드에서 사용하는 모든 반응형 값의 목록으로 생각하세요. 이 목록에 무엇을 넣을 것인지 의도적으로 선택하는 것이 아닙니다. 이 목록은 당신의 코드를 설명합니다. 의존성 목록을 변경하려면, 코드를 변경하세요.

<LearnMore path="/learn/removing-effect-dependencies">

Effect 재실행을 줄이는 방법을 배우려면 **[Effect의 의존성 제거하기](/learn/removing-effect-dependencies)** 를 읽어보세요.

</LearnMore>

## 커스텀 Hook으로 로직 재사용하기 {/*reusing-logic-with-custom-hooks*/}

React는 `useState`, `useContext`, 그리고 `useEffect`같은 Hook들이 내장되어 있습니다. 때로는 데이터를 가져오거나 사용자가 온라인 상태인지 여부를 추적하거나 대화방에 연결하는 등 조금 더 구체적인 목적을 가진 Hook이 존재하길 바랄 수도 있습니다. 이를 위해 애플리케이션의 필요에 따라 자신만의 Hook을 만들 수 있습니다.

이번 예제에서는 `usePointerPosition` 커스텀 Hook은 커서 위치를 추적하는 반면 `useDelayedValue` 커스텀 Hook은 전달한 값보다 특정 밀리초만큼 "지연"된 값을 반환합니다. 샌드박스 미리보기 영역 위로 커서를 이동하면 커서를 따라 움직이는 점의 흔적을 확인할 수 있습니다.

<Sandpack>

```js
import { usePointerPosition } from './usePointerPosition.js';
import { useDelayedValue } from './useDelayedValue.js';

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos4, 50);
  return (
    <>
      <Dot position={pos1} opacity={1} />
      <Dot position={pos2} opacity={0.8} />
      <Dot position={pos3} opacity={0.6} />
      <Dot position={pos4} opacity={0.4} />
      <Dot position={pos5} opacity={0.2} />
    </>
  );
}

function Dot({ position, opacity }) {
  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity,
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

```js src/usePointerPosition.js
import { useState, useEffect } from 'react';

export function usePointerPosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);
  return position;
}
```

```js src/useDelayedValue.js
import { useState, useEffect } from 'react';

export function useDelayedValue(value, delay) {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    setTimeout(() => {
      setDelayedValue(value);
    }, delay);
  }, [value, delay]);

  return delayedValue;
}
```

```css
body { min-height: 300px; }
```

</Sandpack>

커스텀 Hook을 생성하고, 함께 구성하고, 서로 데이터를 전달하고, 컴포넌트 사이에서 재사용할 수 있습니다. 앱이 성장함에 따라 이미 작성한 커스텀 Hook을 재사용할 수 있으므로 직접 작성하는 Effect의 수가 줄어들 것입니다. 또한 React 커뮤니티에서 관리하는 훌륭한 커스텀 Hook이 많습니다.

<LearnMore path="/learn/reusing-logic-with-custom-hooks">

컴포넌트 간 로직을 공유하는 방법을 배우려면 **[커스텀 Hook으로 로직 재사용하기](/learn/reusing-logic-with-custom-hooks)** 를 읽어보세요.

</LearnMore>

## 다음은 무엇인가요? {/*whats-next*/}

이 장을 한 페이지씩 읽어보려면 [Ref로 값 참조하기](/learn/referencing-values-with-refs)로 이동하세요!
