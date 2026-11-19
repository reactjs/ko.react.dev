---
title: useEffectEvent
---

<Intro>

`useEffectEvent`는 Effect 내부의 비반응형 로직을 추출해 [Effect 이벤트](/learn/separating-events-from-effects#declaring-an-effect-event)라고 불리는 재사용 가능한 함수로 만들 수 있게 해주는 React Hook입니다.

```js
const onEvent = useEffectEvent(callback)
```

</Intro>

<InlineToc />

## 레퍼런스 {/*reference*/}

### `useEffectEvent(callback)` {/*useeffectevent*/}

Effect 이벤트를 선언하기 위해 컴포넌트의 최상위 레벨에서 `useEffectEvent`를 호출하세요. Effect 이벤트는 `useEffect`와 같이 Effect 내부에서 호출 가능한 함수입니다.

```js {4,6}
import { useEffectEvent, useEffect } from 'react';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('연결됨!', theme);
  });
}
```

[아래에서 더 많은 예시를 확인하세요.](#usage)

#### 매개변수 {/*parameters*/}

- `callback`: Effect 이벤트를 위한 로직을 포함하는 함수입니다. `useEffectEvent`로 Effect 이벤트를 정의했을 때, `callback`은 실행할 때마다 항상 최신의 props와 state 값을 참조합니다. 이를 통해 오래된 클로저 문제를 피할 수 있습니다.

#### 반환값 {/*returns*/}

Effect 이벤트 함수를 반환합니다. `useEffect`, `useLayoutEffect` 또는 `useInsertionEffect` 내부에서 이 함수를 호출할 수 있습니다.

#### 주의 사항 {/*caveats*/}

- **Effect 내부에서만 호출하세요:** Effect 이벤트는 오로지 Effect 내부에서만 호출해야 합니다. Effect 이벤트를 사용하는 Effect보다 먼저 정의하세요. 다른 컴포넌트나 Hook으로 전달하지 마세요. [`eslint-plugin-react-hooks`](/reference/eslint-plugin-react-hooks) 린터(버전 6.1.1 또는 최신)는 Effect 이벤트를 잘못된 맥락에서 호출하는 것을 방지하기 위해 이 제한을 강제합니다.
- **의존성 지름길이 아닙니다:** Effect의 의존성 배열에 의존성을 적는 것을 피하기 위해 `useEffectEvent`를 사용하지 마세요. 이는 버그를 숨기고 코드를 이해하기 어렵게 만듭니다. 명시적으로 의존성을 작성하거나 필요한 경우 이전 값을 비교하기 위해 ref를 사용하세요.
- **비반응형 로직을 위해 사용하세요:** 변하는 값에 의존하지 않는 로직을 추출하기 위해서만 `useEffectEvent`를 사용하세요.

<DeepDive>

#### Effect 이벤트가 안정적이지 않은 이유는 무엇인가요? {/*why-are-effect-events-not-stable*/}

`useState`의 `set` 함수나 ref와 달리 Effect 이벤트 함수는 안정된 식별성을 갖지 않습니다. 이들의 식별성은 의도적으로 렌더링마다 바뀝니다.

```js
// 🔴 잘못된 예시: Effect 이벤트를 의존성에 포함
useEffect(() => {
  onSomething();
}, [onSomething]); // ESLint가 이에 대해 경고합니다
```

이는 의도적인 설계 선택입니다. Effect 이벤트는 같은 컴포넌트 안의 Effect 내부에서만 호출되도록 만들어졌습니다. 지역적으로만 호출할 수 있고 다른 컴포넌트에 전달하거나 의존성 배열에 포함할 수 없으므로, 안정된 식별성은 아무 목적도 없으며 오히려 버그를 숨길 수 있습니다.

안정적이지 않은 식별성은 런타임 단언처럼 동작합니다. 코드가 함수 식별성에 잘못 의존한다면 Effect가 렌더링마다 다시 실행되는 것을 보게 되어 버그가 분명하게 드러납니다.

이 설계는 Effect 이벤트가 개념적으로 특정 Effect에 속하며, 반응성을 벗어나기 위한 범용 API가 아니라는 점을 강조합니다.

</DeepDive>

---

## 사용법 {/*usage*/}

### 최신 props와 state를 읽기 {/*reading-the-latest-props-and-state*/}

일반적으로 Effect 내부에서 반응형 값을 읽을 때는 의존성 배열에 그 값을 포함해야 합니다. 그러면 값이 바뀔 때마다 Effect가 다시 실행되며, 보통 이것이 바람직한 동작입니다.

그러나 몇몇 사례에서는 이 값들이 변할 때 Effect를 다시 실행하지 않으면서 Effect 내부에서 최신 props 또는 state를 읽고 싶을 수 있습니다.

Effect 내부에서 이 값들을 반응형으로 만들지 않고 [최신 props와 state를 읽으려면](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events) Effect 이벤트 내부에 포함하세요.

```js [[1, 1, "onConnected"]]
const onConnected = useEffectEvent(() => {
  if (!muted) {
    showNotification('연결됨!');
  }
});
```

`useEffectEvent`는 `event callback`을 받아 <CodeStep step={1}>Effect 이벤트</CodeStep>를 반환합니다. Effect 이벤트는 Effect를 다시 실행하지 않고도 Effect 내부에서 호출할 수 있는 함수입니다.

```js [[1, 3, "onConnected"]]
useEffect(() => {
  const connection = createConnection(roomId);
  connection.on('connected', onConnected);
  connection.connect();
  return () => {
    connection.disconnect();
  }
}, [roomId]);
```

`onConnected`는 <CodeStep step={1}>Effect 이벤트</CodeStep>이므로, `muted`와 `onConnected`는 Effect 의존성에 포함되지 않습니다.

<Pitfall>

##### Effect 이벤트로 의존성 지정을 건너뛰지 마세요 {/*pitfall-skip-dependencies*/}

`useEffectEvent`를 사용해 "불필요하다"고 생각하는 의존성 지정을 피하고 싶을 수 있습니다. 하지만 이는 버그를 숨기고 코드를 이해하기 어렵게 만듭니다.

```js
// 🔴 잘못된 예시: 의존성을 숨기기 위해 Effect 이벤트 사용
const logVisit = useEffectEvent(() => {
  log(pageUrl);
});

useEffect(() => {
  logVisit()
}, []); // pageUrl이 누락되어 기록을 놓칩니다
```

어떤 값이 Effect를 다시 실행해야 한다면 그 값을 의존성으로 유지하세요. Effect를 정말로 다시 실행시키면 안 되는 로직에만 Effect 이벤트를 사용하세요.

자세한 내용은 [Effect에서 이벤트 분리하기](/learn/separating-events-from-effects)를 참고하세요.

</Pitfall>

---

### 최신 값으로 타이머 사용하기 {/*using-a-timer-with-latest-values*/}

Effect에서 `setInterval`이나 `setTimeout`을 사용할 때, 값이 변경될 때마다 타이머를 다시 시작하지 않고 렌더링의 최신 값을 읽고 싶은 경우가 많습니다.

이 카운터는 매초 현재 `increment` 값만큼 `count`를 증가시킵니다. `onTick` Effect 이벤트는 interval을 다시 시작하지 않고 최신 `count`와 `increment`를 읽습니다.

<Sandpack>

```js
import { useState, useEffect, useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  const onTick = useEffectEvent(() => {
    setCount(count + increment);
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
        <button onClick={() => setCount(0)}>초기화</button>
      </h1>
      <hr />
      <p>
        매초 다음 값만큼 증가:
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

</Sandpack>

타이머가 실행 중일 때 증가 값을 바꿔 보세요. 카운터는 새 증가 값을 즉시 사용하지만, 타이머는 다시 시작되지 않고 부드럽게 계속 실행됩니다.

---

### 최신 값으로 이벤트 리스너 사용하기 {/*using-an-event-listener-with-latest-values*/}

Effect에서 이벤트 리스너를 설정할 때, 콜백에서 렌더링의 최신 값을 읽어야 하는 경우가 많습니다. `useEffectEvent`가 없다면 그 값들을 의존성에 포함해야 하므로, 값이 바뀔 때마다 리스너가 제거되고 다시 추가됩니다.

이 예시는 커서를 따라가는 점을 보여주지만, "점 움직이게 하기"가 체크된 경우에만 움직입니다. `onMove` Effect 이벤트는 Effect를 다시 실행하지 않고 항상 최신 `canMove` 값을 읽습니다.

<Sandpack>

```js
import { useState, useEffect, useEffectEvent } from 'react';

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
        <input
          type="checkbox"
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

체크박스를 토글하고 커서를 움직여 보세요. 점은 체크박스 state에 즉시 반응하지만, 이벤트 리스너는 컴포넌트가 마운트될 때 한 번만 설정됩니다.

---

### 외부 시스템에 다시 연결하지 않기 {/*showing-a-notification-without-reconnecting*/}

`useEffectEvent`의 일반적인 사용 사례는 Effect에 대한 응답으로 무언가를 해야 하지만, 그 "무언가"가 Effect를 다시 실행시키고 싶지 않은 값에 의존하는 경우입니다.

이 예시에서 채팅 컴포넌트는 방에 연결하고 연결되면 알림을 보여줍니다. 사용자는 체크박스로 알림을 음소거할 수 있습니다. 하지만 사용자가 설정을 바꿀 때마다 채팅방에 다시 연결되기를 원하지는 않습니다.

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
import { useState, useEffect, useEffectEvent } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

function ChatRoom({ roomId, muted }) {
  const onConnected = useEffectEvent((roomId) => {
    console.log('✅ ' + roomId + '에 연결됨 (음소거: ' + muted + ')');
    if (!muted) {
      showNotification(roomId + '에 연결됨');
    }
  });

  useEffect(() => {
    const connection = createConnection(roomId);
    console.log('⏳ ' + roomId + '에 연결 중...');
    connection.on('connected', () => {
      onConnected(roomId);
    });
    connection.connect();
    return () => {
      console.log('❌ ' + roomId + '에서 연결 끊김');
      connection.disconnect();
    }
  }, [roomId]);

  return <h1>{roomId} 방에 오신 것을 환영합니다!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [muted, setMuted] = useState(false);
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
          checked={muted}
          onChange={e => setMuted(e.target.checked)}
        />
        알림 음소거
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        muted={muted}
      />
    </>
  );
}
```

```js src/chat.js
const serverUrl = 'https://localhost:1234';

export function createConnection(roomId) {
  // 실제 구현에서는 서버에 실제로 연결합니다
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
        throw Error('핸들러를 두 번 추가할 수 없습니다.');
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

방을 전환해 보세요. 채팅이 다시 연결되고 알림이 표시됩니다. 이제 알림을 음소거해 보세요. `muted`는 Effect가 아니라 Effect 이벤트 내부에서 읽히므로, 채팅은 연결된 상태로 유지됩니다.

---

### 커스텀 Hook에서 Effect 이벤트 사용하기 {/*using-effect-events-in-custom-hooks*/}

직접 만든 커스텀 Hook 내부에서도 `useEffectEvent`를 사용할 수 있습니다. 이를 통해 일부 값은 비반응형으로 유지하면서 Effect를 캡슐화하는 재사용 가능한 Hook을 만들 수 있습니다.

<Sandpack>

```js
import { useState, useEffect, useEffectEvent } from 'react';

function useInterval(callback, delay) {
  const onTick = useEffectEvent(callback);

  useEffect(() => {
    if (delay === null) {
      return;
    }
    const id = setInterval(() => {
      onTick();
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
}

function Counter({ incrementBy }) {
  const [count, setCount] = useState(0);

  useInterval(() => {
    setCount(c => c + incrementBy);
  }, 1000);

  return (
    <div>
      <h2>카운트: {count}</h2>
      <p>매초 {incrementBy}씩 증가합니다</p>
    </div>
  );
}

export default function App() {
  const [incrementBy, setIncrementBy] = useState(1);

  return (
    <>
      <label>
        증가 값:{' '}
        <select
          value={incrementBy}
          onChange={(e) => setIncrementBy(Number(e.target.value))}
        >
          <option value={1}>1</option>
          <option value={5}>5</option>
          <option value={10}>10</option>
        </select>
      </label>
      <hr />
      <Counter incrementBy={incrementBy} />
    </>
  );
}
```

```css
label { display: block; margin-bottom: 8px; }
```

</Sandpack>

이 예시에서 `useInterval`은 interval을 설정하는 커스텀 Hook입니다. 전달된 `callback`은 Effect 이벤트로 감싸지므로, 렌더링마다 새 `callback`이 전달되어도 interval은 재설정되지 않습니다.

---

## 문제 해결 {/*troubleshooting*/}

### 오류가 발생합니다: "A function wrapped in useEffectEvent can't be called during rendering" {/*cant-call-during-rendering*/}

이 오류는 컴포넌트의 렌더링 단계 중에 Effect 이벤트 함수를 호출하고 있다는 뜻입니다. Effect 이벤트는 Effect 내부 또는 다른 Effect 이벤트 내부에서만 호출할 수 있습니다.

```js
function MyComponent({ data }) {
  const onLog = useEffectEvent(() => {
    console.log(data);
  });

  // 🔴 잘못된 예시: 렌더링 중 호출
  onLog();

  // ✅ 올바른 예시: Effect에서 호출
  useEffect(() => {
    onLog();
  }, []);

  return <div>{data}</div>;
}
```

렌더링 중에 로직을 실행해야 한다면 `useEffectEvent`로 감싸지 마세요. 로직을 직접 호출하거나 Effect 내부로 옮기세요.

---

### 린트 오류가 발생합니다: "Functions returned from useEffectEvent must not be included in the dependency array" {/*effect-event-in-deps*/}

"Functions returned from useEffectEvent must not be included in the dependency array"와 같은 경고가 보이면 Effect 이벤트를 의존성에서 제거하세요.

```js
const onSomething = useEffectEvent(() => {
  // ...
});

// 🔴 잘못된 예시: 의존성에 Effect 이벤트 포함
useEffect(() => {
  onSomething();
}, [onSomething]);

// ✅ 올바른 예시: 의존성에 Effect 이벤트 없음
useEffect(() => {
  onSomething();
}, []);
```

Effect 이벤트는 의존성으로 지정하지 않고 Effect에서 호출하도록 설계되었습니다. 함수 식별성이 [의도적으로 안정적이지 않기](#why-are-effect-events-not-stable) 때문에 린터가 이를 강제합니다. 의존성에 포함하면 Effect가 렌더링마다 다시 실행됩니다.

---

### 린트 오류가 발생합니다: "... is a function created with useEffectEvent, and can only be called from Effects" {/*effect-event-called-outside-effect*/}

"... is a function created with React Hook `useEffectEvent`, and can only be called from Effects and Effect Events"와 같은 경고가 보이면 함수를 잘못된 위치에서 호출하고 있다는 뜻입니다.

```js
const onSomething = useEffectEvent(() => {
  console.log(value);
});

// 🔴 잘못된 예시: 이벤트 핸들러에서 호출
function handleClick() {
  onSomething();
}

// 🔴 잘못된 예시: 자식 컴포넌트에 전달
return <Child onSomething={onSomething} />;

// ✅ 올바른 예시: Effect에서 호출
useEffect(() => {
  onSomething();
}, []);
```

Effect 이벤트는 자신이 정의된 컴포넌트의 Effect에서만 지역적으로 사용되도록 특별히 설계되었습니다. 이벤트 핸들러에 쓰거나 자식에게 전달할 콜백이 필요하다면 일반 함수나 `useCallback`을 대신 사용하세요.
