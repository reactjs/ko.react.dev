---
title: useEffectEvent
---

<Intro>

<<<<<<< HEAD
`useEffectEvent`는 Effect 내부의 비반응형 로직을 추출해 [Effect 이벤트](/learn/separating-events-from-effects#declaring-an-effect-event)라고 불리는 재사용 가능한 함수로 만들 수 있게 해주는 React Hook입니다.
=======
`useEffectEvent` is a React Hook that lets you separate events from Effects.
>>>>>>> 7c90c6eb4bb93a5eacb9cb4ad4ca496c32984636

```js
const onEvent = useEffectEvent(callback)
```

</Intro>

<InlineToc />

<<<<<<< HEAD
## 레퍼런스 {/*reference*/}

### `useEffectEvent(callback)` {/*useeffectevent*/}

Effect 이벤트를 선언하기 위해 컴포넌트의 최상위 레벨에서 `useEffectEvent`를 호출하세요. Effect 이벤트는 `useEffect`와 같이 Effect 내부에서 호출 가능한 함수입니다.
=======
---

## Reference {/*reference*/}

### `useEffectEvent(callback)` {/*useeffectevent*/}

Call `useEffectEvent` at the top level of your component to create an Effect Event.
>>>>>>> 7c90c6eb4bb93a5eacb9cb4ad4ca496c32984636

```js {4,6}
import { useEffectEvent, useEffect } from 'react';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });
}
```

<<<<<<< HEAD
[아래에서 더 많은 예시를 확인하세요.](#usage)
=======
Effect Events are a part of your Effect logic, but they behave more like an event handler. They always “see” the latest values from render (like props and state) without re-synchronizing your Effect, so they're excluded from Effect dependencies. See [Separating Events from Effects](/learn/separating-events-from-effects#extracting-non-reactive-logic-out-of-effects) to learn more. 

[See more examples below.](#usage)
>>>>>>> 7c90c6eb4bb93a5eacb9cb4ad4ca496c32984636

#### 매개변수 {/*parameters*/}

<<<<<<< HEAD
- `callback`: Effect 이벤트를 위한 로직을 포함하는 함수입니다. `useEffectEvent`로 Effect 이벤트를 정의했을 때, `callback`은 실행할 때마다 항상 최신의 props와 state 값을 참조합니다. 이를 통해 오래된 클로저 문제를 피할 수 있습니다.
=======
* `callback`: A function containing the logic for your Effect Event. The function can accept any number of arguments and return any value. When you call the returned Effect Event function, the `callback` always accesses the latest committed values from render at the time of the call. 
>>>>>>> 7c90c6eb4bb93a5eacb9cb4ad4ca496c32984636

#### 반환값 {/*returns*/}

<<<<<<< HEAD
Effect 이벤트 함수를 반환합니다. `useEffect`, `useLayoutEffect` 또는 `useInsertionEffect` 내부에서 이 함수를 호출할 수 있습니다.
=======
`useEffectEvent` returns an Effect Event function with the same type signature as your `callback`. 

You can call this function inside `useEffect`, `useLayoutEffect`, `useInsertionEffect`, or from within other Effect Events in the same component.
>>>>>>> 7c90c6eb4bb93a5eacb9cb4ad4ca496c32984636

#### 주의 사항 {/*caveats*/}

<<<<<<< HEAD
- **Effect 내부에서만 호출하세요:** Effect 이벤트는 오로지 Effect 내부에서만 호출해야 합니다. 그것을 사용하는 Effect 이전에 그것을 정의하세요. 다른 컴포넌트나 훅으로 그것을 전달하지 마세요. [`eslint-plugin-react-hooks`](/reference/eslint-plugin-react-hooks) 린터(버전 6.1.1 또는 최신)는 Effect 이벤트를 잘못된 맥락에서 호출하는 것을 방지하기 위해 이 제한을 강제할 것입니다.
- **의존성 지름길이 아닙니다:** Effect의 의존성 배열에 의존성을 적는 것을 피하기 위해 `useEffectEvent`를 사용하지 마세요. 이것은 버그를 숨기고 코드를 이해하는 것을 어렵게 합니다. 명시적으로 의존성을 작성하거나 필요한 경우 이전 값을 비교하기 위해 ref를 사용하세요.
- **비반응형 로직을 위해 사용하세요:** 변하는 값에 의존하지 않는 로직을 추출하기 위해서만 `useEffectEvent`를 사용하세요.
=======
* `useEffectEvent` is a Hook, so you can only call it **at the top level of your component** or your own Hooks. You can't call it inside loops or conditions. If you need that, extract a new component and move the Effect Event into it.
* Effect Events can only be called from inside Effects or other Effect Events. Do not call them during rendering or pass them to other components or Hooks. The [`eslint-plugin-react-hooks`](/reference/eslint-plugin-react-hooks) linter enforces this restriction.
* Do not use `useEffectEvent` to avoid specifying dependencies in your Effect's dependency array. This hides bugs and makes your code harder to understand. Only use it for logic that is genuinely an event fired from Effects.
* Effect Event functions do not have a stable identity. Their identity intentionally changes on every render.
>>>>>>> 7c90c6eb4bb93a5eacb9cb4ad4ca496c32984636

<DeepDive>

#### Why are Effect Events not stable? {/*why-are-effect-events-not-stable*/}

Unlike `set` functions from `useState` or refs, Effect Event functions do not have a stable identity. Their identity intentionally changes on every render:

```js
// 🔴 Wrong: including Effect Event in dependencies
useEffect(() => {
  onSomething();
}, [onSomething]); // ESLint will warn about this
```

This is a deliberate design choice. Effect Events are meant to be called only from within Effects in the same component. Since you can only call them locally and cannot pass them to other components or include them in dependency arrays, a stable identity would serve no purpose, and would actually mask bugs.

The non-stable identity acts as a runtime assertion: if your code incorrectly depends on the function identity, you'll see the Effect re-running on every render, making the bug obvious.

This design reinforces that Effect Events conceptually belong to a particular effect, and are not a general purpose API to opt-out of reactivity.

</DeepDive>

---

## 사용법 {/*usage*/}

<<<<<<< HEAD
### 최신 props와 state를 읽기 {/*reading-the-latest-props-and-state*/}

전형적으로, Effect 내부에서 반응형 값을 읽을 때, 의존성 배열에 그것을 포함해야 합니다. 이것은 값이 바뀔 때 마다 Effect가 다시 동작하도록 하고, 이것은 보통 바람직한 동작입니다.

그러나 몇몇의 사례에서, 이 값들이 변할 때 Effect가 다시 동작하지 않고 Effect 내부에서 가장 최신의 props 또는 state를 읽고 싶어할 수 있습니다.

Effect 내부에서 이 값들을 반응형으로 만드는 것 없이 [최신 props와 state를 읽기 위해](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events) Effect 이벤트 내부에 그것들을 포함하세요.
=======

### Using an event in an Effect {/*using-an-event-in-an-effect*/}

Call `useEffectEvent` at the top level of your component to create an *Effect Event*:

>>>>>>> 7c90c6eb4bb93a5eacb9cb4ad4ca496c32984636

```js [[1, 1, "onConnected"]]
const onConnected = useEffectEvent(() => {
  if (!muted) {
    showNotification('Connected!');
  }
});
```

`useEffectEvent` accepts an `event callback` and returns an <CodeStep step={1}>Effect Event</CodeStep>. The Effect Event is a function that can be called inside of Effects without re-connecting the Effect:

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

Since `onConnected` is an <CodeStep step={1}>Effect Event</CodeStep>, `muted` and `onConnect` are not in the Effect dependencies.

<Pitfall>

##### Don't use Effect Events to skip dependencies {/*pitfall-skip-dependencies*/}

It might be tempting to use `useEffectEvent` to avoid listing dependencies that you think are "unnecessary." However, this hides bugs and makes your code harder to understand:

```js
// 🔴 Wrong: Using Effect Events to hide dependencies
const logVisit = useEffectEvent(() => {
  log(pageUrl);
});

useEffect(() => {
  logVisit()
}, []); // Missing pageUrl means you miss logs
```

If a value should cause your Effect to re-run, keep it as a dependency. Only use Effect Events for logic that genuinely should not re-trigger your Effect.

See [Separating Events from Effects](/learn/separating-events-from-effects) to learn more.

</Pitfall>

---

### Using a timer with latest values {/*using-a-timer-with-latest-values*/}

When you use `setInterval` or `setTimeout` in an Effect, you often want to read the latest values from render without restarting the timer whenever those values change.

This counter increments `count` by the current `increment` value every second. The `onTick` Effect Event reads the latest `count` and `increment` without causing the interval to restart:

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
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
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

<<<<<<< HEAD
이 예시에서, `url`이 바뀔 때(새로운 페이지 방문을 로깅하기 위해) Effect는 랜더 이후에 다시 동작해야 합니다. 그러나 이것은 `numberOfItems`가 바뀔 때 다시 동작하면 **안됩니다**. 로깅 로직을 Effect 이벤트로 감싸 `numberOfItems`는 비반응형이 됩니다. 이것은 항상 Effect를 트리거 하는 것 없이 최신의 값을 읽습니다.

`url`과 같은 반응형 값을 Effect 이벤트의 인수로 전달할 수 있습니다. 이로써, 이벤트 내부의 비반응형 값에 접근할 때 이것들을 반응형으로 유지할 수 있습니다.
=======
```css
button { margin: 10px; }
```

</Sandpack>
>>>>>>> 7c90c6eb4bb93a5eacb9cb4ad4ca496c32984636

Try changing the increment value while the timer is running. The counter immediately uses the new increment value, but the timer keeps ticking smoothly without restarting.

---

### Using an event listener with latest values {/*using-an-event-listener-with-latest-values*/}

When you set up an event listener in an Effect, you often need to read the latest values from render in the callback. Without `useEffectEvent`, you would need to include the values in your dependencies, causing the listener to be removed and re-added on every change.

This example shows a dot that follows the cursor, but only when "Can move" is checked. The `onMove` Effect Event always reads the latest `canMove` value without re-running the Effect:

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
        The dot is allowed to move
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

Toggle the checkbox and move your cursor. The dot responds immediately to the checkbox state, but the event listener is only set up once when the component mounts.

---

### Avoid reconnecting to external systems {/*showing-a-notification-without-reconnecting*/}

A common use case for `useEffectEvent` is when you want to do something in response to an Effect, but that "something" depends on a value you don't want to react to.

In this example, a chat component connects to a room and shows a notification when connected. The user can mute notifications with a checkbox. However, you don't want to reconnect to the chat room every time the user changes the settings:

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
    console.log('✅ Connected to ' + roomId + ' (muted: ' + muted + ')');
    if (!muted) {
      showNotification('Connected to ' + roomId);
    }
  });

  useEffect(() => {
    const connection = createConnection(roomId);
    console.log('⏳ Connecting to ' + roomId + '...');
    connection.on('connected', () => {
      onConnected(roomId);
    });
    connection.connect();
    return () => {
      console.log('❌ Disconnected from ' + roomId);
      connection.disconnect();
    }
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [muted, setMuted] = useState(false);
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
          checked={muted}
          onChange={e => setMuted(e.target.checked)}
        />
        Mute notifications
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

Try switching rooms. The chat reconnects and shows a notification. Now mute the notifications. Since `muted` is read inside the Effect Event rather than the Effect, the chat stays connected.

---

### Using Effect Events in custom Hooks {/*using-effect-events-in-custom-hooks*/}

You can use `useEffectEvent` inside your own custom Hooks. This lets you create reusable Hooks that encapsulate Effects while keeping some values non-reactive:

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
      <h2>Count: {count}</h2>
      <p>Incrementing by {incrementBy} every second</p>
    </div>
  );
}

export default function App() {
  const [incrementBy, setIncrementBy] = useState(1);

  return (
    <>
      <label>
        Increment by:{' '}
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

In this example, `useInterval` is a custom Hook that sets up an interval. The `callback` passed to it is wrapped in an Effect Event, so the interval does not reset even if a new `callback` is passed in every render.

---

## Troubleshooting {/*troubleshooting*/}

### I'm getting an error: "A function wrapped in useEffectEvent can't be called during rendering" {/*cant-call-during-rendering*/}

This error means you're calling an Effect Event function during the render phase of your component. Effect Events can only be called from inside Effects or other Effect Events.

```js
function MyComponent({ data }) {
  const onLog = useEffectEvent(() => {
    console.log(data);
  });

  // 🔴 Wrong: calling during render
  onLog();

  // ✅ Correct: call from an Effect
  useEffect(() => {
    onLog();
  }, []);

  return <div>{data}</div>;
}
```

If you need to run logic during render, don't wrap it in `useEffectEvent`. Call the logic directly or move it into an Effect.

---

### I'm getting a lint error: "Functions returned from useEffectEvent must not be included in the dependency array" {/*effect-event-in-deps*/}

If you see a warning like "Functions returned from `useEffectEvent` must not be included in the dependency array", remove the Effect Event from your dependencies:

```js
const onSomething = useEffectEvent(() => {
  // ...
});

// 🔴 Wrong: Effect Event in dependencies
useEffect(() => {
  onSomething();
}, [onSomething]);

// ✅ Correct: no Effect Event in dependencies
useEffect(() => {
  onSomething();
}, []);
```

Effect Events are designed to be called from Effects without being listed as dependencies. The linter enforces this because the function identity is [intentionally not stable](#why-are-effect-events-not-stable). Including it would cause your Effect to re-run on every render.

---

### I'm getting a lint error: "... is a function created with useEffectEvent, and can only be called from Effects" {/*effect-event-called-outside-effect*/}

If you see a warning like "... is a function created with React Hook `useEffectEvent`, and can only be called from Effects and Effect Events", you're calling the function from the wrong place:

```js
const onSomething = useEffectEvent(() => {
  console.log(value);
});

// 🔴 Wrong: calling from event handler
function handleClick() {
  onSomething();
}

// 🔴 Wrong: passing to child component
return <Child onSomething={onSomething} />;

// ✅ Correct: calling from Effect
useEffect(() => {
  onSomething();
}, []);
```

Effect Events are specifically designed to be used in Effects local to the component they're defined in. If you need a callback for event handlers or to pass to children, use a regular function or `useCallback` instead.