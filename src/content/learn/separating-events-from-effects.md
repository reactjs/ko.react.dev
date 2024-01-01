---
title: 'Effect에서 이벤트 분리하기'
---

<Intro>

이벤트 핸들러는 같은 상호작용을 반복하는 경우에만 재실행됩니다. Effect는 이벤트 핸들러와 달리 prop이나 state 변수 등 읽은 값이 마지막 렌더링 때와 다르면 다시 동기화합니다. 때로는 두 동작이 섞여서 어떤 값에는 반응해 재실행되지만, 다른 값에는 그러지 않는 Effect를 원할 때도 있습니다. 이 페이지에서 그 방법을 알려드리겠습니다.

</Intro>

<YouWillLearn>

- 이벤트 핸들러와 Effect 중에 선택하는 방법
- Effect는 반응형이고 이벤트 핸들러는 아닌 이유
- Effect의 코드 일부가 반응형이 아니길 원한다면 해야 할 것
- Effect Event의 정의와 Effect에서 추출하는 방법
- Effect Event를 사용해 Effect에서 최근의 props와 state를 읽는 방법

</YouWillLearn>

## 이벤트 핸들러와 Effect 중에 선택하기 {/*choosing-between-event-handlers-and-effects*/}

먼저 이벤트 핸들러와 Effect의 차이점에 대해 간단히 알아보겠습니다.

채팅방 컴포넌트를 구현한다고 상상해 보세요. 요구사항은 아래와 같습니다.

1. 채팅방 컴포넌트는 선택된 채팅방에 자동으로 연결해야 합니다.
2. "전송" 버튼을 클릭하면 채팅에 메시지를 전송해야 합니다.

코드를 이미 구현했다고 하겠습니다. 그런데 그 코드를 어디에 넣어야 할지 확실하지 않습니다. 이벤트 핸들러와 Effect 중에 무엇을 사용해야 할까요? 이 질문에 답해야 할 때마다 [해당 코드가 실행되어야 하는 *이유*](/learn/synchronizing-with-effects#what-are-effects-and-how-are-they-different-from-events)를 고려해 보세요.

### 이벤트 핸들러는 특정 상호작용에 대한 응답으로 실행된다 {/*event-handlers-run-in-response-to-specific-interactions*/}

사용자 관점에서 메시지는 "전송" 버튼이 클릭 되었기 *때문에* 전송되어야 합니다. 다른 때나 다른 이유로 메시지가 전송되면 사용자는 꽤 당황할 것입니다. 그러므로 메시지를 전송하는 건 이벤트 핸들러가 되어야 합니다. 이벤트 핸들러는 특정 상호작용을 처리하게 해줍니다.

```js {4-6}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');
  // ...
  function handleSendClick() {
    sendMessage(message);
  }
  // ...
  return (
    <>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSendClick}>전송</button>;
    </>
  );
}
```

이벤트 핸들러를 사용하면 사용자가 버튼을 누를 *때만* `sendMessage(message)`가 실행될 것이라고 확신할 수 있습니다.

### Effect는 동기화가 필요할 때마다 실행된다 {/*effects-run-whenever-synchronization-is-needed*/}

채팅방 컴포넌트는 채팅방과의 연결을 유지해야 한다는 요구사항도 떠올려 보세요. 이 코드는 어디에 넣어야 할까요?

이 코드를 실행하는 *이유*는 어떠한 특정 상호작용이 아닙니다. 사용자가 채팅방 화면으로 이동한 이유나 방법은 상관없습니다. 사용자가 현재 채팅방 화면을 보고 상호작용할 수 있으므로 컴포넌트는 선택된 채팅 서버에 계속 연결되어 있어야 합니다. 채팅방 컴포넌트가 앱의 첫 화면이고 사용자가 아무런 상호작용을 하지 않은 경우라 해도 *여전히* 연결되어 있어야 합니다. 그러므로 이 코드는 Effect입니다.

```js {3-9}
function ChatRoom({ roomId }) {
  // ...
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

이렇게 코드를 작성하면 사용자가 수행하는 특정 상호작용에 *상관없이* 현재 선택된 채팅 서버와 항상 연결된 상태임을 확신할 수 있습니다. 사용자가 앱을 열기만 했든 다른 방을 선택했든 다른 화면으로 이동했다가 다시 돌아왔든, 컴포넌트가 현재 선택된 방과 *동기화된 상태를 유지*할 것이고 [필요할 때마다 다시 연결](/learn/lifecycle-of-reactive-effects#why-synchronization-may-need-to-happen-more-than-once)할 것을 Effect가 보장합니다.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection, sendMessage } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  function handleSendClick() {
    sendMessage(message);
  }

  return (
    <>
      <h1>{roomId} 방에 오신 것을 환영합니다!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSendClick}>전송</button>
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        채팅방 선택:{' '}
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
        {show ? '채팅 닫기' : '채팅 열기'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/chat.js
export function sendMessage(message) {
  console.log('🔵 전송한 메시지: ' + message);
}

export function createConnection(serverUrl, roomId) {
  // 실제 구현은 실제로 서버에 연결했을 것입니다.
  return {
    connect() {
      console.log('✅ ' + serverUrl + '의 "' + roomId + '" 방에 연결 중...');
    },
    disconnect() {
      console.log('❌ ' + serverUrl + '의 "' + roomId + '" 방과 연결 해제');
    }
  };
}
```

```css
input, select { margin-right: 20px; }
```

</Sandpack>

## 반응형 값과 반응형 로직 {/*reactive-values-and-reactive-logic*/}

이벤트 핸들러는 버튼 클릭과 같이 항상 "수동으로" 트리거 되지만, Effect는 동기화 유지에 필요한 만큼 자주 실행 및 재실행되기 때문에 "자동으로" 트리거 된다고 직감적으로 말할 수도 있습니다.

이에 대해 더 정확하게 생각하는 방법이 있습니다.

컴포넌트 본문 내부에 선언된 props, state, 변수를 <CodeStep step={2}>반응형 값</CodeStep>이라고 합니다. 이 예시에서 `serverUrl`은 반응형 값이 아니지만 `roomId`와 `message`는 반응형 값입니다. 반응형 값은 데이터 렌더링 과정에 관여합니다.

```js [[2, 3, "roomId"], [2, 4, "message"]]
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // ...
}
```

이러한 반응형 값은 리렌더링으로 인해 변경될 수 있습니다. 예를 들어 사용자가 `message`를 편집하거나 드롭다운에서 다른 `roomId`를 선택하는 경우가 있습니다. 이벤트 핸들러와 Effect는 변화에 다르게 반응합니다.

- **이벤트 핸들러 내부의 로직은 *반응형*이 아닙니다**. 사용자가 같은 상호작용(예: 클릭)을 반복하지 않는 한 재실행되지 않습니다. 이벤트 핸들러는 변화에 "반응"하지 않으면서 반응형 값을 읽을 수 있습니다.
- **Effect 내부의 로직은 *반응형*입니다.** Effect에서 반응형 값을 읽는 경우 [그 값을 의존성으로 지정해야 합니다.](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) 그렇게 하면 리렌더링이 그 값을 바꾸는 경우 React가 새로운 값으로 Effect의 로직을 다시 실행합니다.

이 차이를 설명하기 위해 이전 예시를 다시 보겠습니다.

### 이벤트 핸들러 내부의 로직은 반응형이 아니다 {/*logic-inside-event-handlers-is-not-reactive*/}

아래의 코드 라인을 보세요. 이 로직이 반응형이어야 할까요, 아닐까요?

```js [[2, 2, "message"]]
    // ...
    sendMessage(message);
    // ...
```

사용자 관점에서 **`message`를 바꾸는 것이 메시지를 전송하고 싶다는 의미는 _아닙니다._** 사용자가 입력 중이라는 의미일 뿐입니다. 즉 메시지를 전송하는 로직은 반응형이어서는 안 됩니다. <CodeStep step={2}>반응형 값</CodeStep>이 변경되었다는 이유만으로 로직이 재실행되어서는 안 됩니다. 그러므로 이 로직은 이벤트 핸들러에 속합니다.

```js {2}
  function handleSendClick() {
    sendMessage(message);
  }
```

이벤트 핸들러는 반응형이 아니므로 `sendMessage(message)`는 사용자가 전송 버튼을 클릭할 때만 실행될 것입니다.

### Effect 내부의 로직은 반응형이다 {/*logic-inside-effects-is-reactive*/}

이제 아래의 코드 라인으로 돌아가 봅시다.

```js [[2, 2, "roomId"]]
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    // ...
```

사용자 관점에서 **`roomId`를 바꾸는 것은 다른 방에 연결하고 싶다는 의미입니다.** 즉 방에 연결하기 위한 로직은 반응형이어야 합니다. 우리는 이 코드가 <CodeStep step={2}>반응형 값</CodeStep>을 "따라가고" 그 값이 바뀌면 다시 실행되기를 원합니다. 그러므로 이 로직은 Effect에 속합니다.

```js {2-3}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId]);
```

Effect는 반응형이므로 `createConnection(serverUrl, roomId)`와 `connection.connect()`는 구별되는 모든 `roomId` 값에 대해 실행될 겁니다. Effect는 채팅 연결과 현재 선택된 방의 동기화를 유지해 줍니다.

## Effect에서 비반응형 로직 추출하기 {/*extracting-non-reactive-logic-out-of-effects*/}

반응형 로직과 비반응형 로직을 섞으려 한다면 더 까다로워집니다.

예를 들어 사용자가 채팅에 연결할 때 알림을 보여주는 상황을 상상해 보세요. 올바른 색상의 알림을 보여주기 위해 props로부터 현재 테마(dark 또는 light)를 읽습니다.

```js {1,4-6}
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('연결됨!', theme);
    });
    connection.connect();
    // ...
```

그러나 `theme`은 (리렌더링으로 변경될 수 있는) 반응형 값이고 [Effect가 읽는 모든 반응형 값은 의존성으로 선언되어야 합니다.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) 그러므로 `theme`을 Effect의 의존성으로 지정해야 합니다.

```js {5,11}
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('연결됨!', theme);
    });
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId, theme]); // ✅ 모든 의존성 선언됨
  // ...
```

이 예제로 이것저것 해보면서 사용자 경험상의 문제를 발견할 수 있을지 확인해 보세요.

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
      showNotification('연결됨!', theme);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, theme]);

  return <h1>{roomId} 방에 오신 것을 환영합니다!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        채팅방 선택:{' '}
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
        어두운 테마 사용
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
  // 실제 구현은 실제로 서버에 연결했을 것입니다.
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
        throw Error('핸들러는 두 번 추가할 수 없습니다.');
      }
      if (event !== 'connected') {
        throw Error('"connected" 이벤트만 지원됩니다.');
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

`roomId`가 변경되면 채팅은 예상대로 다시 연결됩니다. 하지만 `theme`도 의존성이므로 dark 테마와 light 테마 사이를 전환할 때마다 채팅도 다시 연결됩니다. 좋지 않습니다!

다시 말해 아래의 코드 라인이 비록 (반응형인) Effect 내부에 있지만 반응형이 *아니길* 바랍니다.

```js
      // ...
      showNotification('연결됨!', theme);
      // ...
```

이 비반응형 로직을 주변의 반응형 Effect로부터 분리할 방법이 필요합니다.

### Effect Event 선언하기 {/*declaring-an-effect-event*/}

<Wip>

이 단락에서는 **아직 안정된 버전의 React로 출시되지 않은 실험적인 API**를 설명합니다.

</Wip>

이 비반응형 로직을 Effect에서 추출하려면 [`useEffectEvent`](/reference/react/experimental_useEffectEvent)라는 특수한 Hook을 사용하세요.

```js {1,4-6}
import { useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('연결됨!', theme);
  });
  // ...
```

여기서 `onConnected`를 *Effect Event*라고 합니다. Effect 로직의 일부이지만 이벤트 핸들러와 훨씬 비슷하게 동작합니다. 내부의 로직은 반응형이 아니며 항상 props와 state의 최근 값을 "바라봅니다".

이제 Effect 내부에서 Effect Event인 `onConnected`를 호출할 수 있습니다.

```js {2-4,9,13}
function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('연결됨!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ 모든 의존성이 선언됨
  // ...
```

이렇게 하면 문제가 해결됩니다. Effect의 의존성 목록에서 `onConnected`를 *제거*해야 한다는 것에 유의하세요. **Effect Event는 반응형이 아니므로 의존성에서 제외되어야 합니다.**

새로운 동작이 예상대로 작동하는지 확인해 보세요.

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
    showNotification('연결됨!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>{roomId} 방에 오신 것을 환영합니다!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        채팅방 선택:{' '}
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
        어두운 테마 사용
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
  // 실제 구현은 실제로 서버에 연결했을 것입니다.
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
        throw Error('핸들러는 두 번 추가할 수 없습니다.');
      }
      if (event !== 'connected') {
        throw Error('"connected" 이벤트만 지원됩니다.');
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

Effect Event가 이벤트 핸들러와 아주 비슷하다고 생각할 수 있습니다. 이벤트 핸들러는 사용자의 상호작용에 대한 응답으로 실행되는 반면에 Effect Event는 Effect에서 직접 트리거 된다는 것이 주요한 차이점입니다. Effect Event를 사용하면 Effect의 반응성과 반응형이어서는 안 되는 코드 사이의 "연결을 끊어줍니다".

### Effect Event로 최근 props와 state 읽기 {/*reading-latest-props-and-state-with-effect-events*/}

<Wip>

이 단락에서는 **아직 안정된 버전의 React로 출시되지 않은 실험적인 API**를 설명합니다.

</Wip>

Effect Event는 의존성 린터를 억제하고 싶었을 많은 패턴을 수정하게 합니다.

예를 들어 페이지 방문을 기록하기 위한 Effect가 있다고 해보겠습니다.

```js
function Page() {
  useEffect(() => {
    logVisit();
  }, []);
  // ...
}
```

이후 사이트에 여러 경로가 추가되고 이제 `Page` 컴포넌트는 현재 경로가 담긴 `url`을 prop으로 받습니다. `logVisit`에 `url`을 전달하여 호출하려는데 의존성 린터가 불평합니다.

```js {1,3}
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, []); // 🔴 React Hook useEffect has a missing dependency: 'url'
  // ...
}
```

이 코드로 무엇을 하려는 것인지 생각해 보세요. 각 URL은 서로 다른 페이지를 나타내므로 각 URL에 대한 방문을 *따로 기록하려 합니다*. 즉 이 `logVisit` 호출은 `url`에 반응형*이어야 합니다*. 그러므로 이런 경우에는 의존성 린터의 말을 따라 `url`을 의존성으로 추가하는 것이 합리적입니다.

```js {4}
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, [url]); // ✅ 모든 의존성이 선언됨
  // ...
}
```

이제 모든 페이지 방문기록에 장바구니의 물건 개수도 포함하려 한다고 해보겠습니다.

```js {2-3,6}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  useEffect(() => {
    logVisit(url, numberOfItems);
  }, [url]); // 🔴 React Hook useEffect has a missing dependency: 'numberOfItems'
  // ...
}
```

Effect 내부에서 `numberOfItems`를 사용했으므로 린터는 이를 의존성에 추가해달라고 부탁합니다. 하지만 `logVisit` 호출이 `numberOfItems`에 반응하지 *않길* 원합니다. 사용자가 장바구니에 무언가를 넣어 `numberOfItems`가 변경되는 것이 사용자가 페이지를 다시 방문했음을 *의미하지는 않습니다*. 즉 *페이지 방문*은 어떤 의미에서 "이벤트"입니다. 이 이벤트는 특정한 시점에 발생합니다.

코드를 두 부분으로 나눠보세요.

```js {5-7,10}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onVisit(url);
  }, [url]); // ✅ 모든 의존성 선언됨
  // ...
}
```

여기서 `onVisit`은 Effect Event입니다. 그 내부의 코드는 반응형이 아닙니다. 그러므로 `numberOfItems` (또는 다른 반응형 값!)의 변경이 주변 코드를 재실행시킬 걱정 없이 사용할 수 있습니다.

반면에 Effect 자체는 여전히 반응형입니다. Effect 내부의 코드는 prop인 `url`을 사용하므로 다른 `url`로 리렌더링 될 때마다 Effect가 재실행됩니다. 그로 인해 Effect Event인 `onVisit`가 호출될 것입니다.

결과적으로 prop인 `url` 변경될 때마다 `logVisit`을 호출할 것이고 항상 최근의 `numberOfItems`를 읽을 것입니다. 하지만 `numberOfItems` 혼자만 변경되면 어떠한 코드도 재실행되지 않습니다.

<Note>

인수 없이 `onVisit()`을 호출하고 그 내부에서 `url`을 읽을 수 있는지 궁금할 수도 있습니다.

```js {2,6}
  const onVisit = useEffectEvent(() => {
    logVisit(url, numberOfItems);
  });

  useEffect(() => {
    onVisit();
  }, [url]);
```

이렇게 해도 읽을 수 있지만 `url`을 Effect Event에 명시적으로 전달하는 것이 좋습니다. **`url`을 Effect Event에 인수로 전달함으로써 다른 `url`로 페이지를 방문하는 것이 사용자 관점에서는 별도의 "이벤트"임을 나타내는 것입니다.** `visitedUrl`은 발생한 "이벤트"의 *일부분*입니다.

```js {1-2,6}
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onVisit(url);
  }, [url]);
```

Effect Event가 `visitedUrl`을 명시적으로 "요구"하므로 `url`을 Effect의 의존성에서 실수로 제거하는 일은 이제 있을 수 없습니다. 의존성에서 `url`을 제거하면 (별개의 페이지 방문을 하나로 취급하게 되는데) 린터가 경고할 것입니다. `onVisit`이 `url`에 반응하기를 원하므로 `url`을 (반응형이 아닌) `onVisit` 내부에서 읽지 말고 Effect에서 전달해 줍니다.

이것은 Effect 내부에 비동기 로직이 있는 경우에 특히 중요해집니다.

```js {6,8}
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    setTimeout(() => {
      onVisit(url);
    }, 5000); // 방문 기록을 지연시킴
  }, [url]);
```

여기서 `onVisit` 내부의 `url`은 (이미 변경되었을 수 있는) *최근의* `url`에 해당하지만 `visitedUrl`은 최초에 이 Effect (및 `onVisit` 호출)을 실행하게 만든 `url`에 해당합니다.

</Note>

<DeepDive>

#### 대안으로 의존성 린터를 억제하는 것은 괜찮은가요? {/*is-it-okay-to-suppress-the-dependency-linter-instead*/}

기존 코드베이스에서는 아래와 같이 린트 규칙이 억제된 것을 가끔 볼 수 있습니다.

```js {7-9}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  useEffect(() => {
    logVisit(url, numberOfItems);
    // 🔴 이런 식으로 린터를 억제하는 것은 피하세요.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);
  // ...
}
```

`useEffectEvent`가 React의 안정적인 기능이 되면 **린터를 절대로 억제하지 않을 것**을 추천합니다.

규칙을 억제하는 것의 첫 번째 단점은 코드에 추가한 새로운 반응형 의존성에 Effect가 "반응"해야 할 때 React가 더 이상 경고하지 않는다는 것입니다. 이전 예제에서는 React가 의존성에 `url`을 추가하라고 상기시켜 주었기 *때문에* 그렇게 했습니다. 린터를 억제하면 해당 Effect에 대한 향후 편집에 대해 이러한 알림을 더 이상 받지 않게 됩니다. 이는 버그로 이어집니다.

다음은 린터를 억제하여 발생하는 혼란스러운 버그의 예시입니다. 이 예시에서 `handleMove` 함수는 점이 커서를 따라가야 하는지를 결정하기 위해 state 변수 `canMove`의 현재 값을 읽어야 합니다. 그러나 `handleMove` 내부에서 `canMove`는 항상 `true`입니다.

왜 그런지 알겠나요?

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  function handleMove(e) {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  }

  useEffect(() => {
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)}
        />
        점 움직이게 하기
      </label>
      <hr />
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
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>


이 코드의 문제는 린터를 억제한다는 것입니다. 억제하는 것을 제거하면 이 Effect가 `handleMove` 함수에 의존해야 함을 알게 될 것입니다. `handleMove`는 컴포넌트 본문 내부에서 선언되어서 반응형 값이기 때문입니다. 모든 반응형 값은 의존성으로 지정되어야 하며 그렇지 않으면 시간이 지남에 따라 오래되어 최근 값과 달라질 가능성이 있습니다!

기존 코드의 작성자는 Effect가 반응형 값에 의존하지 않는다고(`[]`) React에 "거짓말"을 했습니다. 그러므로 React는 `canMove`가 (`handleMove`와 함께) 변경된 후에 Effect를 다시 동기화하지 않았습니다. React가 Effect를 다시 동기화하지 않았기 때문에 리스너로 부착된 `handleMove`는 초기 렌더링 과정에서 생성된 `handleMove` 함수입니다. 초기 렌더링 과정에서 `canMove`가 `true`였으므로 초기 렌더링 과정에서 생성된 `handleMove`는 영원히 `true`를 바라보게 됩니다.

**린터를 억제하지 않으면 오래된 값으로 인한 문제가 절대 발생하지 않습니다.**

`useEffectEvent`를 사용하면 린터에 "거짓말"을 할 필요가 없으며 코드는 기대한 대로 동작합니다.

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
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

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  const onMove = useEffectEvent(e => {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  });

  useEffect(() => {
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)}
        />
        점 움직이게 하기
      </label>
      <hr />
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
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>

`useEffectEvent`가 *항상* 올바른 해결책이라는 의미는 아닙니다. `useEffectEvent`는 반응형이 아니길 원하는 코드 라인에만 적용해야 합니다. 위의 샌드박스에서는 Effect의 코드가 `canMove`에 반응하길 원하지 않았습니다. 그러므로 Effect Event로 추출하는 것이 합리적이었습니다.

린터 억제의 다른 올바른 대안에 대해서는 [Effect 의존성 제거하기](/learn/removing-effect-dependencies)를 읽어보세요.

</DeepDive>

### Effect Event의 한계 {/*limitations-of-effect-events*/}

<Wip>

이 단락에서는 **아직 안정된 버전의 React로 출시되지 않은 실험적인 API**를 설명합니다.

</Wip>

Effect Event는 사용할 수 있는 방법이 매우 제한적입니다.

* **Effect 내부에서만 호출하세요.**
* **절대로 다른 컴포넌트나 Hook에 전달하지 마세요.**

예를 들어 아래와 같이 Effect Event를 선언하고 전달하지 마세요.

```js {4-6,8}
function Timer() {
  const [count, setCount] = useState(0);

  const onTick = useEffectEvent(() => {
    setCount(count + 1);
  });

  useTimer(onTick, 1000); // 🔴 금지: Effect Event 전달하기

  return <h1>{count}</h1>
}

function useTimer(callback, delay) {
  useEffect(() => {
    const id = setInterval(() => {
      callback();
    }, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay, callback]); // 의존성에 "callback"을 지정해야 함
}
```

그 대신 Effect Event는 항상 자신을 사용하는 Effect의 바로 근처에 선언하세요.

```js {10-12,16,21}
function Timer() {
  const [count, setCount] = useState(0);
  useTimer(() => {
    setCount(count + 1);
  }, 1000);
  return <h1>{count}</h1>
}

function useTimer(callback, delay) {
  const onTick = useEffectEvent(() => {
    callback();
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick(); // ✅ 바람직함: Effect 내부에서 지역적으로만 호출됨
    }, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay]); // "onTick"(Effect Event)를 의존성으로 지정할 필요 없음
}
```

Effect Event는 Effect의 코드 중 비반응형인 "부분"입니다. Effect Event는 자신을 사용하는 Effect 근처에 있어야 합니다.

<Recap>

- 이벤트 핸들러는 특정 상호작용에 대한 응답으로 실행됩니다.
- Effect는 동기화가 필요할 때마다 실행됩니다.
- 이벤트 핸들러 내부의 로직은 반응형이 아닙니다.
- Effect 내부의 로직은 반응형입니다.
- Effect의 비반응형 로직은 Effect Event로 옮길 수 있습니다.
- Effect Event는 Effect 내부에서만 호출하세요.
- Effect Event를 다른 컴포넌트나 Hook에 전달하지 마세요.

</Recap>

<Challenges>

#### 업데이트되지 않는 변수 고치기 {/*fix-a-variable-that-doesnt-update*/}

아래의 `Timer` 컴포넌트에는 매초 증가하는 state 변수 `count`가 있습니다. 증가량은 state 변수 `increment`에 저장됩니다. 변수 `increment`는 더하기와 빼기 버튼으로 제어할 수 있습니다.

하지만 더하기 버튼을 아무리 많이 클릭해도 카운터는 여전히 매초 1씩 증가합니다. 이 코드는 무엇이 잘못되었을까요? Effect의 코드 내부에서 `increment`는 왜 항상 `1`일까요? 실수를 찾아 고쳐보세요.

<Hint>

이 코드를 고치려면 규칙을 따르는 것으로 충분합니다.

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h1>
        카운터: {count}
        <button onClick={() => setCount(0)}>재설정</button>
      </h1>
      <hr />
      <p>
        초당 증가량:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

<Solution>

Effect의 버그를 찾을 때는 늘 그렇듯 억제된 린터 규칙이 있는지 찾는 것부터 시작하세요.

린터를 억제하는 주석을 제거하면 React는 이 Effect의 코드가 `increment`에 의존한다고 알려줄 것입니다. 하지만 여러분은 이 Effect가 어떠한 반응형 값에도 의존하지 않는다고(`[]`) 함으로써 React에 "거짓말"을 했습니다. 의존성 배열에 `increment`를 추가하세요.

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [increment]);

  return (
    <>
      <h1>
        카운터: {count}
        <button onClick={() => setCount(0)}>재설정</button>
      </h1>
      <hr />
      <p>
        초당 증가량:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

이제 `increment`가 변경되면 React는 Effect를 다시 동기화시킬 것이고 그로 인해 interval은 재시작될 것입니다.

</Solution>

#### 멈추는 카운터 고치기 {/*fix-a-freezing-counter*/}

아래의 `Timer` 컴포넌트에는 매초 증가하는 state 변수 `count`가 있습니다. 증가량은 state 변수 `increment`에 저장되며 더하기와 빼기 버튼으로 제어할 수 있습니다. 예를 들어 더하기 버튼을 9번 누르면 `count`가 이제 매초 1이 아닌 10씩 증가하는 것을 확인할 수 있습니다.

이 사용자 인터페이스에는 작은 문제가 있습니다. 더하기 또는 빼기 버튼을 초당 한 번보다 빠르게 계속 누르면 타이머 자체가 잠시 멈춘 것처럼 보입니다. 타이머는 마지막으로 버튼을 누른 후 1초가 지나야 다시 시작됩니다. 타이머가 중단되지 않고 *매초* tick 하도록 이 현상의 원인을 찾고 문제를 해결하세요.

<Hint>

타이머를 설정하는 Effect가 `increment` 값에 "반응"하는 것으로 보입니다. `setCount`를 호출하려고 현재의 `increment` 값을 사용하는 코드 라인이 정말 반응형이어야 할까요?

</Hint>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
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

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [increment]);

  return (
    <>
      <h1>
        카운터: {count}
        <button onClick={() => setCount(0)}>재설정</button>
      </h1>
      <hr />
      <p>
        초당 증가량:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

<Solution>

Effect 내부의 코드가 state 변수 `increment`를 사용하는 것이 문제입니다. Effect가 `increment`에 의존하므로 `increment`가 변경될 때마다 Effect가 다시 동기화되고 그로 인해 interval이 clear 됩니다. 타이머가 시작되려고 할 때마다 매번 interval을 clear 하면 타이머가 멈춘 것처럼 보일 것입니다.

이 문제를 해결하려면 Effect에서 Effect Event를 `onTick`으로 추출하세요.

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
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

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick();
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, []);

  return (
    <>
      <h1>
        카운터: {count}
        <button onClick={() => setCount(0)}>재설정</button>
      </h1>
      <hr />
      <p>
        초당 증가량:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```


```css
button { margin: 10px; }
```

</Sandpack>

`onTick`은 Effect Event이므로 내부의 코드는 반응형이 아닙니다. `increment`가 변해도 Effect를 트리거 하지 않습니다.

</Solution>

#### 조정할 수 없는 딜레이 고치기 {/*fix-a-non-adjustable-delay*/}

이 예제에서는 지연 시간인 interval을 사용자화할 수 있습니다. interval은 state 변수 `delay`에 저장되어 있고 두 개의 버튼으로 업데이트됩니다. 그러나 `delay`가 1000밀리초(즉 1초)가 될 때까지 "+100 ms" 버튼을 눌러도 타이머가 여전히 매우 빠르게(100밀리초마다) 증가하는 것을 알 수 있습니다. 마치 `delay`의 변화가 무시되는 것 같습니다. 버그를 찾아 고치세요.

<Hint>

Effect Event 내부의 코드는 반응형이 아닙니다. `setInterval` 호출이 재실행되길 _원할_ 경우가 있을까요?

</Hint>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
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

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);
  const [delay, setDelay] = useState(100);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  const onMount = useEffectEvent(() => {
    return setInterval(() => {
      onTick();
    }, delay);
  });

  useEffect(() => {
    const id = onMount();
    return () => {
      clearInterval(id);
    }
  }, []);

  return (
    <>
      <h1>
        카운터: {count}
        <button onClick={() => setCount(0)}>재설정</button>
      </h1>
      <hr />
      <p>
        증가량:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
      <p>
        증가 지연 시간:
        <button disabled={delay === 100} onClick={() => {
          setDelay(d => d - 100);
        }}>–100 ms</button>
        <b>{delay} ms</b>
        <button onClick={() => {
          setDelay(d => d + 100);
        }}>+100 ms</button>
      </p>
    </>
  );
}
```


```css
button { margin: 10px; }
```

</Sandpack>

<Solution>

위 예제의 문제는 코드가 실제로 해야 하는 일을 고려하지 않고 `onMount`라는 Effect Event로 추출했다는 것입니다. Effect Event는 코드 일부를 비반응형으로 만들고 싶다는 특정한 이유가 있을 때만 추출해야 합니다. 하지만 `setInterval` 호출은 state 변수 `delay`에 *반응해야 합니다*. `delay`가 변경되면 interval이 다시 설정되기를 원하는 겁니다! 이 코드를 고치려면 모든 반응형 코드를 Effect 내부로 다시 가져오세요.

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
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

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);
  const [delay, setDelay] = useState(100);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick();
    }, delay);
    return () => {
      clearInterval(id);
    }
  }, [delay]);

  return (
    <>
      <h1>
        카운터: {count}
        <button onClick={() => setCount(0)}>재설정</button>
      </h1>
      <hr />
      <p>
        증가량:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
      <p>
        증가 지연 시간:
        <button disabled={delay === 100} onClick={() => {
          setDelay(d => d - 100);
        }}>–100 ms</button>
        <b>{delay} ms</b>
        <button onClick={() => {
          setDelay(d => d + 100);
        }}>+100 ms</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

코드의 *목적*보다는 *타이밍*에 초점을 두는 `onMount` 같은 함수는 보통 의심해 봐야 합니다. 언뜻 보기에 "더 잘 설명한다"라고 느낄 수 있지만 의도를 모호하게 합니다. 경험상 Effect Event는 *사용자* 관점에서 일어나는 일에 부합해야 합니다. 예를 들어 `onMessage`, `onTick`, `onVisit` 또는 `onConnected`는 Effect Event의 이름으로 좋습니다. 내부의 코드는 반응형일 필요가 없을 가능성이 높습니다. 반면에 `onMount`, `onUpdate`, `onUnmount` 또는 `onAfterRender`는 너무 일반적이어서 *반응형이어야 하는* 코드를 실수로 넣기 쉽습니다. 그러므로 Effect Event의 이름은 코드가 실행된 시점이 아니라 *사용자가 일어났다고 생각하는 일*을 따서 지어야 합니다.

</Solution>

#### 지연된 알림 고치기 {/*fix-a-delayed-notification*/}

이 컴포넌트는 채팅방에 참여하면 알림을 보여줍니다. 하지만 알림을 바로 보여주지는 않습니다. 대신 의도적으로 2초 정도 지연시켜서 사용자가 UI를 둘러볼 수 있도록 합니다.

대부분 동작하지만, 버그가 있습니다. 드롭다운을 "general"에서 "travel"로 변경한 다음 "music"으로 아주 빠르게 변경해 보세요. 2초 안에 변경하면 (기대한 대로!) 두 개의 알림이 보이지만 *둘 다* "music에 오신 것을 환영합니다"라고 합니다.

"general"에서 "travel"로 전환한 다음 "music"으로 매우 빠르게 전환할 때 첫 번째 알림은 "travel에 오신 것을 환영합니다"이고 두 번째 알림은 "music에 오신 것을 환영합니다"가 되도록 고쳐보세요. (추가 도전으로 *이미* 알림이 올바른 방을 보여주도록 만들었다면 나중의 알림만 보여주도록 코드를 바꿔보세요.)

<Hint>

Effect는 자신이 어느 방에 연결했는지 알고 있습니다. Effect Event에 전달하고 싶을 만한 정보는 없나요?

</Hint>

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
    showNotification(roomId + '에 오신 것을 환영합니다', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      setTimeout(() => {
        onConnected();
      }, 2000);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>{roomId} 방에 오신 것을 환영합니다!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        채팅방 선택:{' '}
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
        어두운 테마 사용
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
  // 실제 구현은 실제로 서버에 연결했을 것입니다.
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
        throw Error('핸들러는 두 번 추가할 수 없습니다.');
      }
      if (event !== 'connected') {
        throw Error('"connected" 이벤트만 지원됩니다.');
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

<Solution>

Effect Event 내부의 `roomId`는 *Effect Event가 호출되는 시점*의 값입니다.

Effect Event는 2초의 지연 후에 호출됩니다. travel 방에서 music 방으로 빠르게 전환하는 경우 travel 방의 알림을 보여줄 때쯤이면 `roomId`는 이미 `"music"`입니다. 그러므로 두 알림 모두 "music에 오신 것을 환영합니다"를 보여줍니다.

이 문제를 고치려면 Effect Event 내부에서 *최근의* `roomId`를 읽는 게 아니라 아래의 `connectedRoomId`처럼 Effect Event의 매개변수로 만드세요. 그다음 Effect에서 `onConnected(roomId)`로 호출해서 `roomId`를 전달하세요.

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
  const onConnected = useEffectEvent(connectedRoomId => {
    showNotification(connectedRoomId + '에 오신 것을 환영합니다', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      setTimeout(() => {
        onConnected(roomId);
      }, 2000);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>{roomId} 방에 오신 것을 환영합니다!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        채팅방 선택:{' '}
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
        어두운 테마 사용
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
  // 실제 구현은 실제로 서버에 연결했을 것입니다.
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
        throw Error('핸들러는 두 번 추가할 수 없습니다.');
      }
      if (event !== 'connected') {
        throw Error('"connected" 이벤트만 지원됩니다.');
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

`roomId`가 `"travel"`로 설정된 (그래서 `"travel"` 방에 연결된) Effect는 `"travel"`에 대한 알림을 보여줄 것입니다. `roomId`가 `"music"`으로 설정된 (그래서 `"music"` 방에 연결된) Effect는 `"music"`에 대한 알림을 보여줄 것입니다. 다시 말해 `theme`은 항상 최근 값을 사용하는 반면에 `connectedRoomId`는 (반응형인) Effect에서 비롯됩니다.

추가 도전을 해결하려면 알림의 timeout ID를 저장하고 Effect의 클린업 함수에서 해제하면 됩니다.

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
  const onConnected = useEffectEvent(connectedRoomId => {
    showNotification(connectedRoomId + '에 오신 것을 환영합니다', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    let notificationTimeoutId;
    connection.on('connected', () => {
      notificationTimeoutId = setTimeout(() => {
        onConnected(roomId);
      }, 2000);
    });
    connection.connect();
    return () => {
      connection.disconnect();
      if (notificationTimeoutId !== undefined) {
        clearTimeout(notificationTimeoutId);
      }
    };
  }, [roomId]);

  return <h1>{roomId} 방에 오신 것을 환영합니다!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        채팅방 선택:{' '}
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
        어두운 테마 사용
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
  // 실제 구현은 실제 서버에 연결했을 것입니다.
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
        throw Error('핸들러는 두 번 추가할 수 없습니다.');
      }
      if (event !== 'connected') {
        throw Error('"connected" 이벤트만 지원됩니다.');
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

이것으로 이미 예약된 (하지만 아직 표시되지 않은) 알림은 방을 바꿀 때 취소되는 것이 보장됩니다.

</Solution>

</Challenges>
