---
title: "커스텀 훅을 이용하는 로직 재사용하기"
---

<Intro>

리액트는 `useState`, `useContext`, 그리고 `useEffect`과같이 몇몇 내재하고 있는 훅이 존재합니다. 가끔 당신은 조금 더 구체적인 목적을 가진 훅이 존재하길 바랄 때도 있을 겁니다. 예를 들어, 데이터를 가져온다던가, 사용자가 온라인 상태인지 계속 확인한다던가, 혹은 채팅방에 연결하기 위한 목적들처럼요. 당신은 리액트에서 다음과 같은 훅들을 찾기는 어려울 것입니다. 하지만 당신은 당신 애플리케이션의 필요에 알맞은 당신만의 훅을 만들 수 있습니다.

</Intro>

<YouWillLearn>

- 커스텀 훅이 무엇이고, 어떻게 본인만의 훅을 작성하는 지
- 컴포넌트 간 로직을 재사용하는 방법
- 나만의 커스텀 훅 이름 짓기와 구조 잡기
- 언제 그리고 왜 커스텀 훅을 추출해야 하는지

</YouWillLearn>

## 커스텀 훅: 컴포넌트간 로직 공유하기 {/*custom-hooks-sharing-logic-between-components*/}

당신이 네트워크에 크게 의존하는 앱 (대부분의 앱이 그렇듯) 을 개발 중이라고 생각해 보세요. 유저가 당신의 앱을 사용하는 동안 네트워크가 갑자기 사라진다면, 당신은 유저에게 경고하고 싶을 겁니다. 이런 경우 어떻게 하실 건가요? 당신의 컴포넌트에는 다음 두 가지가 필요할 것입니다.

1. 네트워크가 온라인 상태인지 아닌지 추적하는 하나의 state
2. 전역 [`online (온라인)`](https://developer.mozilla.org/en-US/docs/Web/API/Window/online_event), [`offline (오프라인)`](https://developer.mozilla.org/en-US/docs/Web/API/Window/offline_event) 이벤트를 구독하고, 이에 맞춰 state를 업데이트하는 Effect

This will keep your component [synchronized](/learn/synchronizing-with-effects) with the network status. You might start with something like this:

두 가지 요소는 당신의 컴포넌트가 네트워크 상태와 [동기화](/learn/synchronizing-with-effects) 되도록 합니다. 당신은 다음과 같이 구현할 수 있습니다.

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return <h1>{isOnline ? '✅ 온라인' : '❌ 연결 안 됨'}</h1>;
}
```

</Sandpack>

당신의 네트워크를 껐다 켰다 해보세요. 그리고 당신의 행동에 따라 `StatusBar` 가 어떻게 업데이트되는지 확인해 보세요.

이제 당신이 다른 컴포넌트에서 같은 로직을 *또* 사용한다고 상상해 보세요. 당신은 네트워크가 꺼졌을 때, "저장" 대신 "재연결 중..."을 보여주며 비활성화된 저장 버튼을 구현하고 싶다고 가정해 봅시다.

구현하기 위해, 당신은 `SaveButton` 안에 앞서 사용한 `isOnline` state과 Effect를 복사 붙여넣기 할 수 있습니다 :

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function SaveButton() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  function handleSaveClick() {
    console.log('✅ 진행사항 저장됨');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? '진행사항 저장' : '재연결 중...'}
    </button>
  );
}
```

</Sandpack>

만약 당신이 네트워크를 껐을 때, 버튼의 모양이 바뀌는지 확인해 봅시다.

위의 두 컴포넌트는 잘 동작합니다. 하지만 둘 사이의 논리가 중복되는 점은 아쉽습니다. 두 컴포넌트가 다른 *시각적 모양*을 갖고 있다고 해도, 당신은 둘 사이의 로직을 재사용하길 원합니다.

### Extracting your own custom Hook from a component {/*extracting-your-own-custom-hook-from-a-component*/}

[`useState`](/reference/react/useState) 그리고 [`useEffect`](/reference/react/useEffect)와 비슷한 내장된 `useOnlineStatus` 훅이 있다고 상상해 봅시다. 그럼 두 컴포넌트를 단순화할 수 있고, 당신은 둘 간의 중복을 제거할 수 있게 됩니다 : 

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ 온라인' : '❌ 연결 안 됨'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ 진행사항 저장됨');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? '진행사항 저장' : '재연결 중...'}
    </button>
  );
}
```

내장된 훅이 없다고 해도, 당신은 스스로 만들어 낼 수 있습니다. `useOnlineStatus` 함수를 정의하고, 앞서 작성한 컴포넌트들의 중복되는 코드를 바꿔보세요 : 

```js {2-16}
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

함수의 마지막에 `isOnline`을 반환하면, 당신의 컴포넌트가 그 값을 읽을 수 있게 해줍니다. :

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ 온라인' : '❌ 연결 안 됨'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ 진행사항 저장됨');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? '진행사항 저장' : '재연결 중...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js useOnlineStatus.js
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

</Sandpack>

네트워크에 따라 두 컴포넌트가 업데이트되는지 확인해 봅시다.

이제 당신의 컴포넌트는 반복되는 로직이 많지 않게 되었습니다. **중요한 건, 두 컴포넌트 내부 코드가 *어떻게 그것을 하는지* (브라우저 이벤트 구독하기) 보다 *그들이 무엇을 하려는지* (온라인 state 사용하기)에 대해 설명하고 있다는 점입니다.**

당신이 커스텀 훅을 만들어 낼 때, 브라우저 API나 외부 시스템과 소통하는 방법과 같은 불필요한 세부 사항을 숨길 수 있습니다. 컴포넌트의 코드는 당신의 목적만을 나타낼 뿐 실행 방법에 대해선 나타내지 않습니다. 

### 훅의 이름은 항상 `use`로 시작해야 합니다. {/*hook-names-always-start-with-use*/}

리액트 애플리케이션은 여러 컴포넌트로 만들어집니다. 컴포넌트들은 내장되거나 직접 작성한 훅으로 만들어집니다. 당신은 종종 다른 사람들에 의해 만들어진 훅을 사용했을 것입니다. 하지만 때에 따라 당신은 당신만의 훅을 만들어야 할 때도 있습니다.

이때, 다음의 작명 규칙을 준수해야 합니다. :

1. **리액트 컴포넌트의 이름은 항상 대문자로 시작해야 합니다.** (예시 : `StatusBar`, `SaveButton`) 또한 리액트 컴포넌트는 JSX처럼 어떻게 보이는지 리액트가 알 수 있는 무언가를 반환해야 합니다.
2. **훅의 이름은 `use` 뒤에 대문자로 시작해야 합니다. (예시 : [`useState`](/reference/react/useState) (내장된 훅) or `useOnlineStatus` (앞서 작성한 커스텀 훅).) 훅들은 어떤 값이든 반환할 수 있습니다.

이런 규칙들은 당신이 컴포넌트를 볼 때, 어디에 state, Effect 및 다른 리액트 기능들이 "숨어" 있는지 알 수 있게 해줍니다. 예를 들어, 만약 당신이 컴포넌트 안에 `getColor()`라는 함수를 보았다면, 당신은 해당 함수의 이름이 `use`로 시작하지 않으므로 함수 안에 리액트 state가 있을 수 없다는 것을 확신할 수 있습니다. 반대로 `useOnlineStatus()` 함수의 경우 높은 확률로 내부에 다른 훅을 사용하고 있을 수 있습니다!

<Note>

만약 당신의 linter가 [리액트에 맞춰있다면](/learn/editor-setup#linting), 작명 규칙을 지키게합니다. 위의 코드로 다시 올라가 `useOnlineStatus`를 `getOnlineStatus`로 바꿔보세요. linter가 당신이 내부에서 `useState`나 `useEffect`를 사용하는 것을 더 이상 허용하지 않을 겁니다. 오로지 훅과 컴포넌트만 다른 훅을 사용할 수 있습니다!

</Note>

<DeepDive>

#### use로 시작되는 모든 함수들이 렌더링되는 동안 불러와지나요? {/*should-all-functions-called-during-rendering-start-with-the-use-prefix*/}

아닙니다. 훅을 *호출*하지 않는 함수는 훅*일* 필요가 없습니다.

만약 당신의 함수가 어떤 훅도 호출하지 않는다면, `use`를 이름 앞에 작성하는 것을 피하세요. 대신, `use` 없이 일반적인 함수로 작성하세요. 예를 들어 `useSorted`가 훅을 호출하지 않는다면 `getSorted`로 변경할 수 있습니다. 

```js
// 🔴 안 좋은 예시 : 훅을 사용하고 있지 않는 훅.
function useSorted(items) {
  return items.slice().sort();
}

// ✅ 좋은 예시 : 훅을 사용하지 않는 일반 함수.
function getSorted(items) {
  return items.slice().sort();
}
```

다음의 예시는 당신이 조건문을 포함해 어디든 일반 함수를 사용할 수 있다는 것을 보여줍니다.

```js
function List({ items, shouldSort }) {
  let displayedItems = items;
  if (shouldSort) {
    // ✅ getSorted()가 훅이 아니기 때문에 조건에 따라 호출할 수 있습니다. 
    displayedItems = getSorted(items);
  }
  // ...
}
```

적어도 하나의 훅을 내부에서 사용한다면 반드시 함수 앞에 `use`를 작성해야 합니다. (그리고 이 자체로 훅이 됩니다.)

```js
// ✅ 좋은 예시 : 훅을 사용하는 훅
function useAuth() {
  return useContext(Auth);
}
```

기술적으로 이건 리액트에 의해 강요되진 않습니다. 원칙적으로 당신은 다른 훅을 사용하지 않는 훅을 만들 수 있습니다. 이건 가끔 혼란스럽고 제한되기 때문에 해당 방식을 피하는 것이 가장 좋습니다. 하지만, 매우 드물게 이런 방식이 도움이 될 때도 있습니다. 예를 들어 지금 당장은 함수에서 어떤 훅도 사용하지 않지만, 미래에 훅을 호출할 계획이 있다면 `use`를 앞에 붙여 이름 짓는 것이 가능합니다.

```js {3-4}
// ✅ 좋은 예시 : 추후에 다른 훅을 사용할 가능성이 있는 훅
function useAuth() {
  // TODO: 인증이 수행될 때 해당 코드를 useContext(Auth)를 반환하는 코드로 바꾸기
  return TEST_USER;
}
```

그럼, 컴포넌트는 조건에 따라 호출할 수 없게 됩니다. 이건 실제로 훅을 내부에 추가해 호출할 때 매우 중요합니다. 만약 지금이든 나중이든 훅을 내부에서 사용할 계획이 없다면, 훅으로 만들지 마세요.

</DeepDive>

### 커스텀 훅은 state 그 자체를 공유하는게 아닌 state 저장 로직을 공유하도록 합니다. {/*custom-hooks-let-you-share-stateful-logic-not-state-itself*/}

앞선 예시에서, 우리가 네트워크를 껐다 켰을 때 양쪽 컴포넌트가 함께 업데이트되었습니다. 그렇다고 해서 `isOnline` state 변수가 두 컴포넌트 간 공유되었다고 생각하면 안 됩니다. 다음의 코드를 확인해 보세요. :

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  // ...
}

function SaveButton() {
  const isOnline = useOnlineStatus();
  // ...
}
```

우리가 중복된 부분을 걷어내기 전에도 동일하게 동작합니다. :

```js {2-5,10-13}
function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    // ...
  }, []);
  // ...
}

function SaveButton() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    // ...
  }, []);
  // ...
}
```

완전히 독립적인 두 state 변수와 Effect가 있음을 확인할 수 있습니다. 그들은 우리가 동일한 외부 변수(네트워크의 연결 state)를 동기화했기 때문에 같은 시간에 같은 값을 가지고 있을 뿐입니다. 

이걸 더 잘 표현하기 위해 다른 예시가 필요할 겁니다. 다음의 `Form` 컴포넌트를 살펴보세요 :

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('Mary');
  const [lastName, setLastName] = useState('Poppins');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <label>
        First name:
        <input value={firstName} onChange={handleFirstNameChange} />
      </label>
      <label>
        Last name:
        <input value={lastName} onChange={handleLastNameChange} />
      </label>
      <p><b>Good morning, {firstName} {lastName}.</b></p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

There's some repetitive logic for each form field:

1. There's a piece of state (`firstName` and `lastName`).
1. There's a change handler (`handleFirstNameChange` and `handleLastNameChange`).
1. There's a piece of JSX that specifies the `value` and `onChange` attributes for that input.

You can extract the repetitive logic into this `useFormInput` custom Hook:

각각의 폼 입력에 반복되는 로직이 있습니다.

1. state가 존재합니다. (`firstName`와 `lastName`)
2. 변화를 다루는 함수가 존재합니다. (`handleFirstNameChange`와 `handleLastNameChange`).
3. 해당 입력에 대한 `value`와 `onChange`의 속성을 지정하는 JSX가 존재합니다. 

당신은 `useFormInput` 커스텀 훅을 통해 반복되는 로직을 추출할 수 있습니다.

<Sandpack>

```js
import { useFormInput } from './useFormInput.js';

export default function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');

  return (
    <>
      <label>
        First name:
        <input {...firstNameProps} />
      </label>
      <label>
        Last name:
        <input {...lastNameProps} />
      </label>
      <p><b>Good morning, {firstNameProps.value} {lastNameProps.value}.</b></p>
    </>
  );
}
```

```js useFormInput.js active
import { useState } from 'react';

export function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue);

  function handleChange(e) {
    setValue(e.target.value);
  }

  const inputProps = {
    value: value,
    onChange: handleChange
  };

  return inputProps;
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

`value`라고 불리는 state 변수가 *한 번만* 정의된다는 것을 기억하세요.

이와 달리, `Form` 컴포넌트는 `useFormInput`을 **두 번** 호출합니다.

```js
function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');
  // ...
```

위의 예시는 왜 두 개의 다른 state 변수를 정의하는 식으로 동작하는지 보여줍니다.

**커스텀 훅은 우리가 *state 그 자체*가 아닌 *state 저장 로직*을 공유하도록 해줍니다. 같은 훅을 호출하더라도 각각의 훅 호출은 완전히 독립되어 있습니다.** 이것이 위의 두 코드가 완전히 같은 이유입니다. 만약 당신이 원한다면 위로 돌아가 비교해 보세요. 커스텀 훅을 추출하기 전과 후가 동일합니다.

대신 당신이 여러 컴포넌트 간 state 자체를 공유할 필요가 있다면, [state를 위로 올려 전달하세요](/learn/sharing-state-between-components).

## 훅 사이에 상호작용하는 값 전달하기 {/*passing-reactive-values-between-hooks*/}

당신의 커스텀 훅 안의 코드는 컴포넌트가 재렌더될 때마다 다시 돌아갈 겁니다. 이게 바로 커스컴 훅이 (컴포넌트처럼) [순수해야하는 이유](/learn/keeping-components-pure) 입니다. 커스텀 훅을 당신 컴포넌트 본체의 한 부분이라고 생각하세요!

만약 커스텀 훅이 당신의 컴포넌트와 함께 재렌더된다면, 항상 가장 최신의 props와 state를 전달받을 것입니다. 이게 무슨 말인지 살펴보기 위해 아래의 채팅방 예시를 확인해 보세요. 서버 URL이나 채팅방을 바꾼다고 생각해봅시다. :

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

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
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js chat.js
export function createConnection({ serverUrl, roomId }) {
  // 실제 구현은 실제로 서버에 연결됩니다.
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

`serverUrl`나 `roomId`를 변경할 때, Effect는 [당신의 변화에 "반응"](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values)하며 재동기화합니다. 당신은 Effect의 의존성이 변경될 때마다 채팅방을 재연결하는 콘솔 메시지를 보낼 수 있습니다. 

이제 Effect 코드를 커스텀 훅 안에 넣어봅시다. :

```js {2-13}
export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

당신의 `ChatRoom` 컴포넌트가 내부 동작이 어떻게 동작하는지 걱정할 필요 없이 커스텀 훅을 호출할 수 있게 해줍니다.

```js {4-7}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

매우 간단해졌습니다! (그런데도 똑같이 동작합니다)

로직이 props와 state 변화에 따라 *여전히 응답*하는 것을 확인해 보세요. 서버 URL이나 방을 변경해 보세요. :

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

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
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js ChatRoom.js active
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js useChatRoom.js
import { useEffect } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

```js chat.js
export function createConnection({ serverUrl, roomId }) {
  // 실제 구현은 실제로 서버에 연결됩니다.
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

어떻게 훅의 반환 값을 가져올 수 있는지 확인해 보세요. :

```js {2}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

그리고 반환 값을 다른 훅에 입력해보세요.

```js {6}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

매번 `ChatRoom`가 재렌더될 때마다, 훅에 최신 `roomId`와 `serverUrl` 값을 넘겨줍니다. 이게 바로 재렌더 이후에 값이 달라지는지 여부에 관계없이 Effect가 재연결하는 이유입니다. (만약 당신이 오디오 또는 비디오 처리 소프트웨어를 작업해 본 적이 있다면, 이처럼 훅을 연결하는 것이 시각적 혹은 청각적 효과를 연결하는 것을 떠오르게 할 겁니다. 이게 바로 `useState`의 결과를 `useChatRoom`의 입력으로 "넣어주는 것"과 같습니다.)

### 커스텀 훅에 이벤트 핸들러 넘겨주기 {/*passing-event-handlers-to-custom-hooks*/}

<Wip>

이 섹션은 리액트의 안정화 버전에 **아직 반영되지 않은 실험적인 API**를 설명하고 있습니다.

</Wip>

만약 당신이 `useChatRoom`을 더 많은 컴포넌트에서 사용하길 원한다면, 컴포넌트가 본인의 동작을 커스텀할 수 있길 바랄 것입니다. 예를 들어, 최근 메시지가 도착했을 때 무엇을 해야 하는지에 대한 로직이 훅 안에 하드코딩 되어있다고 해봅시다. :

```js {9-11}
export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

당신이 이 로직을 컴포넌트에 되돌려 놓고 싶다고 해봅시다. : 

```js {7-9}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl,
    onReceiveMessage(msg) {
      showNotification('New message: ' + msg);
    }
  });
  // ...
```

이게 동작하게 하기 위해, 당신의 커스텀 훅을 정의된 옵션 중 하나인 `onReceiveMessage`를 갖도록 해봅시다.

```js {1,10,13}
export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onReceiveMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl, onReceiveMessage]); // ✅ 모든 의존성이 정의됨.
}
```

이대로도 동작하지만, 커스텀 훅이 이벤트 핸들러를 허용할 때 하나 더 개선할 수 있는 부분이 있습니다.

컴포넌트가 재렌더될 때마다 채팅방을 재연결하는 원인이 되기 때문에, 의존성에 `onReceiveMessage`를 추가하는 것은 이상적이지 않습니다. [이 이벤트 핸들러를 의존성에서 제거하기 위해 Effect 이벤트로 감싸주세요. :](/learn/removing-effect-dependencies#wrapping-an-event-handler-from-the-props)

```js {1,4,5,15,18}
import { useEffect, useEffectEvent } from 'react';
// ...

export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  const onMessage = useEffectEvent(onReceiveMessage);

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ 모든 의존성이 정의됨.
}
```

이제 `ChatRoom`가 재렌더될 때마다 채팅방이 재연결되지 않습니다. 여기 커스텀 훅에 이벤트 핸들러를 넘겨주는 직접 다뤄볼 수 있는  제대로 동작하는 예시가 있습니다. :

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

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
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js ChatRoom.js active
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';
import { showNotification } from './notifications.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl,
    onReceiveMessage(msg) {
      showNotification('New message: ' + msg);
    }
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js useChatRoom.js
import { useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection } from './chat.js';

export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  const onMessage = useEffectEvent(onReceiveMessage);

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

```js chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

이제 `useChatRoom`을 사용하기 위해 `useChatRoom`이 *어떻게* 동작하는지 알 필요가 없습니다. 다른 컴포넌트에 추가하거나, 다른 옵션을 전달해도 똑같이 동작할 겁니다. 이게 바로 커스텀 훅의 힘입니다.

## 언제 커스텀 훅을 사용해야 하는지 {/*when-to-use-custom-hooks*/}

당신은 모든 자잘한 중복되는 코드들까지 커스텀 훅으로 분리할 필요가 없습니다. 어떤 중복된 코드는 괜찮습니다. 예를 들어, 앞선 예시처럼 하나의 `useState`를 감싸기 위한 `useFormInput`을 분리하는 것은 불필요합니다.

하지만 Effect를 사용하든 사용하지 않든, 커스텀 훅 안에 그것을 감싸는 게 좋은지 아닌지 고려하세요. [당신은 Effect를 자주 쓸 필요가 없을지 모릅니다.](/learn/you-might-not-need-an-effect) 만약 당신이 Effect를 사용한다면, 그건 당신이 외부 시스템과 동기화한다던가 리액트가 내장하지 않은 API를 위해 무언가를 하는 등 "리액트에서 벗어나기" 위함일 겁니다. 커스텀 훅으로 감싸는 것은 당신의 목적을 정확하게 전달하고 어떻게 데이터가 그것을 통해 흐르는지 알 수 있게 해줍니다.

예를 들어 두 가지 목록을 보여주는 `ShippingForm` 컴포넌트를 살펴봅시다. 하나는 도시의 목록을 보여주고, 다른 하나는 선택된 도시의 구역 목록을 보여줍니다. 당신은 아마 코드를 다음과 같이 작성하기 시작할 겁니다. : 

```js {3-16,20-35}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  // 이 Effect는 나라별 도시를 불러옵니다.
  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [country]);

  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);
  // 이 Effect 선택된 도시의 구역을 불러옵니다.
  useEffect(() => {
    if (city) {
      let ignore = false;
      fetch(`/api/areas?city=${city}`)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setAreas(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [city]);

  // ...
```

이 코드들이 반복됨에도 불구하고, [Effect들을 따로 분리하는 것이 옳습니다.](/learn/removing-effect-dependencies#is-your-effect-doing-several-unrelated-things) 그들은 다른 두 가지(도시, 구역)를 동기화합니다. 따라서 하나의 Effect로 통합시킬 필요가 없습니다. 대신 당신은 `ShippingForm` 컴포넌트를 `useData`라는 커스텀 훅을 통해 공통된 로직을 추출할 수 있습니다. : 

```js {2-18}
function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    if (url) {
      let ignore = false;
      fetch(url)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setData(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [url]);
  return data;
}
```

이제 `ShippingForm` 컴포넌트 내부의 Effect들을 `useData`로 교체할 수 있습니다.

```js {2,4}
function ShippingForm({ country }) {
  const cities = useData(`/api/cities?country=${country}`);
  const [city, setCity] = useState(null);
  const areas = useData(city ? `/api/areas?city=${city}` : null);
  // ...
```

커스텀 훅을 추출하는 것은 데이터의 흐름을 명확하게 해줍니다. 당신은 `url`을 입력하고 `data`를 받습니다. `useData`안의 Effect를 "숨김으로써" 당신은 다른 사람이 `ShippingForm` 컴포넌트에 [불필요한 의존성](/learn/removing-effect-dependencies)을 추가하는 것을 막을 수 있습니다. 시간이 지나면 앱의 대부분 Effect들은 커스텀 훅 안에 있을 겁니다.

<DeepDive>

#### 당신의 커스텀 훅이 구체적인 고급 사용 사례에 집중하도록 하기 {/*keep-your-custom-hooks-focused-on-concrete-high-level-use-cases*/}

커스텀 훅의 이름을 고르는 것부터 시작해 봅시다. 만약 당신이 명확한 이름을 고르기 위해 고군분투한다면, 그건 아마 당신이 사용하는 Effect가 당신의 컴포넌트 로직의 일부분에 너무 결합하여 있다는 의미일 겁니다. 그리고 아직 분리될 준비가 안 됐다는 뜻입니다.

이상적으로 커스텀 훅의 이름은 코드를 자주 작성하는 사람이 아니더라도 커스텀 훅이 무슨 일을 하고, 무엇을 props로 받고, 무엇을 반환하는지 알 수 있도록 아주 명확해야 합니다. :

* ✅ `useData(url)`
* ✅ `useImpressionLog(eventName, extraData)`
* ✅ `useChatRoom(options)`

외부 시스템과 동기화할 때, 커스텀 훅의 이름은 좀 더 기술적이고 해당 시스템을 특정하는 용어를 사용하는 것이 좋습니다. 해당 시스템에 친숙한 사람에게도 명확한 이름이라면 좋습니다. :

* ✅ `useMediaQuery(query)`
* ✅ `useSocket(url)`
* ✅ `useIntersectionObserver(ref, options)`

**커스텀 훅이 구체적인 고급 사용 사례에 집중할 수 있도록 하세요.** `useEffect` API 그 자체를 위한 대책이나 편리하게 감싸는 용도로 동작하는 커스텀 "생명 주기" 훅을 생성하거나 사용하는 것을 피하세요. :

* 🔴 `useMount(fn)`
* 🔴 `useEffectOnce(fn)`
* 🔴 `useUpdateEffect(fn)`

예를 들어, 이 `useMount` 훅은 코드가 "마운트 시"에만 동작하는 것을 확인하기 위해 만들어졌습니다.

```js {4-5,14-15}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // 🔴 안 좋은 예 : 커스텀 "생명 주기" 훅을 사용
  useMount(() => {
    const connection = createConnection({ roomId, serverUrl });
    connection.connect();

    post('/analytics/event', { eventName: 'visit_chat' });
  });
  // ...
}

// 🔴 안 좋은 예 : 커스텀 "생명 주기" 훅을 생성
function useMount(fn) {
  useEffect(() => {
    fn();
  }, []); // 🔴 React Hook useEffect은 'fn'의 의존성을 갖고 있지 않음.
}
```

**`useMount`과 같은 커스텀 "생명 주기" 훅은 전형적인 리액트와 맞지 않습니다.** 예를 들어 이 코드 예시는 문제가 있지만(`roomId`나 `serverUrl`의 변화에 반응하지 않음.), 린터는 오직 직접적인 `useEffect` 호출만 체크하기 때문에 당신에게 경고하지 않습니다. 린터는 당신의 훅에 대해 모르고 있습니다.

만약 Effect를 작성하고 있다면, 리액트 API를 직접적으로 사용하세요. :

```js
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // ✅ 좋은 예시 : 두 Effect는 목적에 따라 나뉘어 있습니다.

  useEffect(() => {
    const connection = createConnection({ serverUrl, roomId });
    connection.connect();
    return () => connection.disconnect();
  }, [serverUrl, roomId]);

  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_chat', roomId });
  }, [roomId]);

  // ...
}
```

그렇게 되면 당신은 (그럴 필요는 없지만) 커스텀 훅을 서로 다른 고급 사용 예시에 따라 분리할 수 있습니다. :

```js
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // ✅ Great: custom Hooks named after their purpose
  useChatRoom({ serverUrl, roomId });
  useImpressionLog('visit_chat', { roomId });
  // ...
}
```

**좋은 커스텀 훅은 호출 코드가 하는 일을 제한하면서 좀 더 선언적으로 만들 수 있습니다.** 예를 들어, `useChatRoom(options)`은 오직 채팅방과 연결할 수 있지만, `useImpressionLog(eventName, extraData)`은 애널리틱스에만 노출된 기록(Impression log)을 보낼 수 있습니다. 만약 당신의 커스텀 훅 API가 사용 사례를 제한하지 않고 너무 추상적이라면, 장기적으로는 그것이 해결할 수 있는 것보다 더 많은 문제를 만들 가능성이 높습니다.

</DeepDive>

### 커스텀 훅은 더 나은 패턴으로 변경할 수 있도록 도와줍니다. {/*custom-hooks-help-you-migrate-to-better-patterns*/}

Effect는 [도피구](/learn/escape-hatches) 입니다: 당신이 "리액트에서 벗어나"는 것이 필요할 때나 사용 시에 괜찮은 내장된 해결 방법이 없는 경우, 사용합니다. 시간이 지나며 리액트 팀의 목표는 더 구체적인 문제에 더 구체적인 해결 방법을 제공해 당신의 앱에 있는 Effect의 숫자를 최소한으로 줄이는 것입니다. 커스텀 훅으로 Effect를 감싸는 것은 이런 해결 방법들이 가능해질 때 당신의 코드를 쉽게 업그레이드할 수 있게 해줍니다.

예시로 돌아가 봅시다. :

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js useOnlineStatus.js active
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

</Sandpack>

위의 예시에서 `useOnlineStatus`는 한 쌍의 [`useState`](/reference/react/useState)와 [`useEffect`.](/reference/react/useEffect) 과 함께 실행됩니다. 하지만 이건 가장 좋은 해결 방법은 아닙니다. 이 해결 방법이 고려하지 못한 수많은 예외 상황이 존재합니다. 예를 들어, 이건 컴포넌트가 마운트됐을 때, `isOnline`이 이미 `true`라고 가정합니다. 하지만 이것은 네트워크가 이미 꺼졌을 때 틀린 가정이 됩니다. 당신은 이런 상황을 확인하기 위해 브라우저 [`navigator.onLine`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine) API를 사용할 수도 있습니다. 하지만 이걸 직접적으로 사용하게 되면 초기 HTML을 생성하기 위한 서버에선 동작하지 않습니다. 짧게 말하면 코드는 보완되어야 합니다.

운 좋게도 리액트 18은 당신을 위해 이런 모든 문제를 신경 써주는 [`useSyncExternalStore`](/reference/react/useSyncExternalStore)라고 불리는 섬세한 API를 포함합니다. 여기 새 API의 장점을 가지고 다시 쓰인 `useOnlineStatus`이 있습니다.

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js useOnlineStatus.js active
import { useSyncExternalStore } from 'react';

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

export function useOnlineStatus() {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine, // 클라이언트의 값을 받아오는 방법
    () => true // 서버의 값을 받아오는 방법
  );
}

```

</Sandpack>

어떻게 이 변경을 하기 위해 **다른 컴포넌트들을 변경하지 않아**도 되는지 알아봅시다. :

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  // ...
}

function SaveButton() {
  const isOnline = useOnlineStatus();
  // ...
}
```

커스텀 훅으로 Effect를 감싸는 것이 종종 유용한 이유는 다음과 같습니다.

1. 매우 명확하게 Effect로 주고받는 데이터 흐름을 만들 때
2. 컴포넌트가 Effect의 정확한 실행보다 목적에 집중하도록 할 때
3. 리액트가 새 기능을 추가할 때, 다른 컴포넌트의 변경 없이 이 Effect를 삭제할 수 있을 때

[디자인 시스템](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969)과 과 마찬가지로, 앱의 컴포넌트에서 일반적인 관용구를 추출하여 커스텀 훅으로 만드는 것이 도움이 될 수 있습니다. 이렇게 하면 컴포넌트의 코드가 의도에 집중할 수 있고, Effect를 자주 작성하지 않아도 됩니다. 리액트 커뮤니티에서 많은 훌륭한 커스텀 Hook을 관리하고 있습니다.

<DeepDive>

#### 리액트가 데이터 패칭을 위한 내부 해결책을 제공할까요? {/*will-react-provide-any-built-in-solution-for-data-fetching*/}

아직 세부적인 사항을 작업 중이지만, 앞으로는 이와 같은 데이터 가져오기를 작성하게 될 것으로 예상합니다:

```js {1,4,6}
import { use } from 'react'; // 아직 사용 불가능합니다!

function ShippingForm({ country }) {
  const cities = use(fetch(`/api/cities?country=${country}`));
  const [city, setCity] = useState(null);
  const areas = city ? use(fetch(`/api/areas?city=${city}`)) : null;
  // ...
```

만약 당신이 앱에 `useData`과 같은 커스텀 훅을 사용한다면, 모든 컴포넌트에 수동으로 Effect를 작성하는 것보다 최종적으로 권장되는 접근 방식으로 변경하는 것이 더 적은 변경이 필요합니다. 그러나 이전의 접근 방식도 충분히 잘 동작하기 때문에 Effect 사용을 즐긴다면 그렇게 사용해도 됩니다. 

</DeepDive>

### There is more than one way to do it {/*there-is-more-than-one-way-to-do-it*/}

### 여러 방법이 존재합니다. {/*there-is-more-than-one-way-to-do-it*/}

당신이 브라우저의 [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) API를 이용해 **처음부터** 페이드 인 애니메이션을 구현한다고 생각해 봅시다. 당신은 아마 애니메이션을 반복시키기 위해 Effect부터 작성할 겁니다. 각각의 애니메이션 프레임 동안 당신은 [참조해 둔 ref](/learn/manipulating-the-dom-with-refs) DOM 노드의 투명도를 `1`에 도달할 때까지 변경할 수 있습니다. 코드는 다음과 같이 작성될 겁니다. : 

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';

function Welcome() {
  const ref = useRef(null);

  useEffect(() => {
    const duration = 1000;
    const node = ref.current;

    let startTime = performance.now();
    let frameId = null;

    function onFrame(now) {
      const timePassed = now - startTime;
      const progress = Math.min(timePassed / duration, 1);
      onProgress(progress);
      if (progress < 1) {
        // 아직 그려야 할 프레임이 많습니다.
        frameId = requestAnimationFrame(onFrame);
      }
    }

    function onProgress(progress) {
      node.style.opacity = progress;
    }

    function start() {
      onProgress(0);
      startTime = performance.now();
      frameId = requestAnimationFrame(onFrame);
    }

    function stop() {
      cancelAnimationFrame(frameId);
      startTime = null;
      frameId = null;
    }

    start();
    return () => stop();
  }, []);

  return (
    <h1 className="welcome" ref={ref}>
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

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

이 컴포넌트의 가독성을 위해 로직을 추출해 `useFadeIn` 커스텀 훅을 만들어 봅시다.

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
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

```js useFadeIn.js
import { useEffect } from 'react';

export function useFadeIn(ref, duration) {
  useEffect(() => {
    const node = ref.current;

    let startTime = performance.now();
    let frameId = null;

    function onFrame(now) {
      const timePassed = now - startTime;
      const progress = Math.min(timePassed / duration, 1);
      onProgress(progress);
      if (progress < 1) {
        // 아직 그려야 할 프레임이 많습니다.
        frameId = requestAnimationFrame(onFrame);
      }
    }

    function onProgress(progress) {
      node.style.opacity = progress;
    }

    function start() {
      onProgress(0);
      startTime = performance.now();
      frameId = requestAnimationFrame(onFrame);
    }

    function stop() {
      cancelAnimationFrame(frameId);
      startTime = null;
      frameId = null;
    }

    start();
    return () => stop();
  }, [ref, duration]);
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

`useFadeIn` 코드를 유지할 수도 있지만 더 리팩토링할 수도 있습니다. 예를 들어 `useFadeIn` 밖으로 애니메이션 반복 설정 로직을 빼내 `useAnimationLoop` 커스텀 훅으로 만들 수 있습니다.

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
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

```js useFadeIn.js active
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export function useFadeIn(ref, duration) {
  const [isRunning, setIsRunning] = useState(true);

  useAnimationLoop(isRunning, (timePassed) => {
    const progress = Math.min(timePassed / duration, 1);
    ref.current.style.opacity = progress;
    if (progress === 1) {
      setIsRunning(false);
    }
  });
}

function useAnimationLoop(isRunning, drawFrame) {
  const onFrame = useEffectEvent(drawFrame);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const startTime = performance.now();
    let frameId = null;

    function tick(now) {
      const timePassed = now - startTime;
      onFrame(timePassed);
      frameId = requestAnimationFrame(tick);
    }

    tick();
    return () => cancelAnimationFrame(frameId);
  }, [isRunning]);
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

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

</Sandpack>

하지만, *반드시* 이처럼 작성할 필요는 없습니다. 당신은 일반 함수와 마찬가지로 궁극적으로 코드의 여러 부분 사이의 경계를 어디에 그릴지 결정해야 합니다. 매우 다르게 접근할 수도 있습니다. Effect 내부의 로직을 유지하는 대신, 대부분의 중요한 로직을 자바스크립트의 [클래스](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Classes) 내부로 이동시킬 수 있습니다.

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
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

```js useFadeIn.js active
import { useState, useEffect } from 'react';
import { FadeInAnimation } from './animation.js';

export function useFadeIn(ref, duration) {
  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(duration);
    return () => {
      animation.stop();
    };
  }, [ref, duration]);
}
```

```js animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    this.onProgress(0);
    this.startTime = performance.now();
    this.frameId = requestAnimationFrame(() => this.onFrame());
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress === 1) {
      this.stop();
    } else {
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
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

Effect는 외부 시스템과 리액트를 연결할 수 있게 해줍니다. 예를 들어 여러 애니메이션을 연결하는 것처럼 Effects 간의 조정이 더 많이 필요할수록, 위의 코드 예시처럼 Effect와 훅 밖으로 로직을 *완전히* 분리하는 것이 합리적입니다. 그렇게 당신이 분리한 코드는 "외부 시스템"이 *될 것입니다* Effect는 당신이 리액트 밖으로 내보낸 시스템에 메시지만 보내면 되기 때문에 이런 방식은 Effect가 심플한 상태를 유지하도록 합니다.

위의 예시는 페이드인 로직이 자바스크립트로 작성되어야 하는 경우라고 가정합니다. 하지만 이런 특정 페이드인 애니메이션은  일반 [CSS 애니메이션](https://developer.mozilla.org/ko/docs/Web/CSS/CSS_Animations/Using_CSS_animations)으로 구현하는 것이 더 간단하고 훨씬 효율적입니다.

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import './welcome.css';

function Welcome() {
  return (
    <h1 className="welcome">
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

```css styles.css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
```

```css welcome.css active
.welcome {
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);

  animation: fadeIn 1000ms;
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

```

</Sandpack>

가끔 당신은 훅이 필요하지 않을 수 있습니다!

<Recap>

- 커스텀 훅을 사용하면 컴포넌트 간 로직을 공유할 수 있습니다.
- 커스텀 훅의 이름은 `use` 뒤에 대문자로 시작되어야 합니다.
- 커스텀 훅은 state 자체가 아닌 state 저장 로직만 공유합니다.
- 하나의 훅에서 다른 훅으로 반응형 값을 전달할 수 있고, 값은 최신 상태로 유지됩니다.
- 모든 훅은 컴포넌트가 재렌더될 때 마다 재실행됩니다.
- 커스텀 훅의 코드는 컴포넌트 코드처럼 순수해야 합니다.
- 커스텀 훅을 통해 받는 이벤트 핸들러는 Effect로 감싸야 합니다.
- `useMount`같은 커스텀 훅을 생성하면 안 됩니다. 용도를 명확히 하세요.
- 코드의 경계를 선택하는 방법과 위치는 여러분이 결정할 수 있습니다.

</Recap>

<Challenges>

#### `useCounter` 훅 추출하기 {/*extract-a-usecounter-hook*/}

이 컴포넌트는 매초 증가하는 숫자를 보여주기 위해 state 변수와 Effect를 사용합니다. `useCounter`라는 커스텀 훅으로 이 로직을 분리해 봅시다. 우리의 목표는 정확히 다음과 같이 동작하는 `Counter`를 만드는 것입니다.

```js
export default function Counter() {
  const count = useCounter();
  return <h1>Seconds passed: {count}</h1>;
}
```

`useCounter.js` 에 커스텀 훅을 작성하고 `Counter.js` 파일에 가져와야 합니다.

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return <h1>Seconds passed: {count}</h1>;
}
```

```js useCounter.js
// Write your custom Hook in this file!
```

</Sandpack>

<Solution>

코드가 다음과 같아야 합니다.

<Sandpack>

```js
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter();
  return <h1>Seconds passed: {count}</h1>;
}
```

```js useCounter.js
import { useState, useEffect } from 'react';

export function useCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return count;
}
```

</Sandpack>

`App.js`가 더 이상 `useState`와 `useEffect`를 가져오지 않아도 된다는 것을 기억하세요.

</Solution>

#### 카운터의 지연을 수정 가능하게 하기 {/*make-the-counter-delay-configurable*/}

이 예시에는 슬라이더를 통해 조작되는 `delay`라는 state 변수가 있지만 사용되고 있지 않습니다. `useCounter` 커스텀 훅에 `delay` 값을 전달해, 하드 코딩된 `1000` ms이 아닌 전달된 `delay` 값을 사용하도록 해봅시다.

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const [delay, setDelay] = useState(1000);
  const count = useCounter();
  return (
    <>
      <label>
        Tick duration: {delay} ms
        <br />
        <input
          type="range"
          value={delay}
          min="10"
          max="2000"
          onChange={e => setDelay(Number(e.target.value))}
        />
      </label>
      <hr />
      <h1>Ticks: {count}</h1>
    </>
  );
}
```

```js useCounter.js
import { useState, useEffect } from 'react';

export function useCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return count;
}
```

</Sandpack>

<Solution>

`useCounter(delay)`에 `delay` 값을 넘겨준 뒤, 훅 내부에서 하드 코딩된 `1000` 값 대신 `delay`를 사용해 봅시다. Effect의 의존성에 `delay`를 추가해야 합니다. 이렇게 되면 `delay`가 변경되면 간격이 재설정됩니다.

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const [delay, setDelay] = useState(1000);
  const count = useCounter(delay);
  return (
    <>
      <label>
        Tick duration: {delay} ms
        <br />
        <input
          type="range"
          value={delay}
          min="10"
          max="2000"
          onChange={e => setDelay(Number(e.target.value))}
        />
      </label>
      <hr />
      <h1>Ticks: {count}</h1>
    </>
  );
}
```

```js useCounter.js
import { useState, useEffect } from 'react';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
  return count;
}
```

</Sandpack>

</Solution>

#### `useCounter`에서 `useInterval` 분리하기 {/*extract-useinterval-out-of-usecounter*/}

이제 `useCounter`는 두 가지 일을 합니다. 간격을 설정하고, 간격마다 state 변수를 증가시킵니다. 간격을 설정하는 로직을 `useInterval`라는 이름의 다른 훅으로 분리해 봅시다. 이 훅은 `onTick` 콜백과 `delay`, 두 가지 props가 필요합니다. 이렇게 변경하면 `useCounter`은 다음과 같이 보일 것입니다. :

```js
export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

`useInterval.js` 파일에 `useInterval`을 작성하고 `useCounter.js` 파일에 가져오세요.


<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter(1000);
  return <h1>Seconds passed: {count}</h1>;
}
```

```js useCounter.js
import { useState, useEffect } from 'react';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
  return count;
}
```

```js useInterval.js
// 훅을 여기에 작성하세요!
```

</Sandpack>

<Solution>

`useInterval` 내부의 로직은 간격을 설정하고 초기화해야 합니다. 그 외에 다른 것은 필요하지 않습니다.

<Sandpack>

```js
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter(1000);
  return <h1>Seconds passed: {count}</h1>;
}
```

```js useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js useInterval.js active
import { useEffect } from 'react';

export function useInterval(onTick, delay) {
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => clearInterval(id);
  }, [onTick, delay]);
}
```

</Sandpack>

이 해결 방법은 다음에 해결해야할 약간의 도전 과제가 있습니다.

</Solution>

#### 간격 재설정 고치기 {/*fix-a-resetting-interval*/}

이 예시에서 *두 개의* 별개의 간격이 존재합니다.

`useCounter`를 호출하는 `App` 컴포넌트는 카운터를 매초 업데이트하기 위해 `useInterval`를 호출합니다. 그러나 `App` 는 `useInterval`를 2초에 한 번씩 랜덤하게 배경색을 변경하기 위해 `useInterval`를 *또* 호출합니다.

이런 이유로 배경을 업데이트하는 콜백은 절대 실행되지 않습니다. `useInterval` 내부에 로그를 남겨보세요.

```js {2,5}
  useEffect(() => {
    console.log('✅ Setting up an interval with delay ', delay)
    const id = setInterval(onTick, delay);
    return () => {
      console.log('❌ Clearing an interval with delay ', delay)
      clearInterval(id);
    };
  }, [onTick, delay]);
```

로그가 당신이 생각했던 대로 잘 동작하나요? 만약 어떤 Effect가 불필요하게 재동기화한다면, 당신은 어떤 의존성이 원인이 되었는지 예측할 수 있나요? 해당 Effect에서 [그 의존성을 제거하는](/learn/removing-effect-dependencies) 방법이 있나요?

당신이 이 문제를 해결한 뒤, 배경 화면이 2초마다 바뀔 수 있다고 예상합니다.

<Hint>

`useInterval`가 이벤트 리스너를 하나의 prop로 받는 것처럼 보입니다. 이 이벤트 리스너를 감싸 Effect의 의존성이 될 필요가 없도록 만드는 방법을 생각해 낼 수 있나요?

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
import { useCounter } from './useCounter.js';
import { useInterval } from './useInterval.js';

export default function Counter() {
  const count = useCounter(1000);

  useInterval(() => {
    const randomColor = `hsla(${Math.random() * 360}, 100%, 50%, 0.2)`;
    document.body.style.backgroundColor = randomColor;
  }, 2000);

  return <h1>Seconds passed: {count}</h1>;
}
```

```js useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js useInterval.js
import { useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export function useInterval(onTick, delay) {
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => {
      clearInterval(id);
    };
  }, [onTick, delay]);
}
```

</Sandpack>

<Solution>

[앞서 그랬던 것처럼](/learn/reusing-logic-with-custom-hooks#passing-event-handlers-to-custom-hooks) `useInterval` 내부에서 콜백을 Effect 이벤트로 감싸주세요.

이 방법은 `onTick`을 Effect의 의존성에서 빼낼 수 있도록 합니다. Effect는 컴포넌트가 재렌더될 때마다 재동기화하지 않을 것이고 배경색을 변경 간격 역시 변경되는 기회가 오기 전에 매초 초기화되는 일은 없게 됩니다.

이제 각 간격은 원하는 대로 동작하고 서로를 방해하지 않습니다. :


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
import { useCounter } from './useCounter.js';
import { useInterval } from './useInterval.js';

export default function Counter() {
  const count = useCounter(1000);

  useInterval(() => {
    const randomColor = `hsla(${Math.random() * 360}, 100%, 50%, 0.2)`;
    document.body.style.backgroundColor = randomColor;
  }, 2000);

  return <h1>Seconds passed: {count}</h1>;
}
```

```js useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js useInterval.js active
import { useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export function useInterval(callback, delay) {
  const onTick = useEffectEvent(callback);
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => clearInterval(id);
  }, [delay]);
}
```

</Sandpack>

</Solution>

#### 엇갈린 움직임 구현하기 {/*implement-a-staggering-movement*/}

이 예시에선 `usePointerPosition()` 훅이 최근 포인터의 위치를 추적합니다. 커서나 손을 미리보기 화면 위로 이동하면 빨간 점이 움직임을 따라가는 것을 확인할 수 있습니다. 이 위치는 `pos1` 변수에 저장됩니다.

실제로는 다섯 개의 다른 점이 렌더되고 있습니다. 모든 점이 같은 위치에 나타나기 때문에 보이지 않습니다. 이 부분을 수정해야 합니다. 대신 구현해야 하는 것은 "엇갈린" 움직임입니다. 각 점이 이전 점의 경로를 "따라야" 합니다. 예를 들어 커서를 빠르게 움직이면 첫 번째 점이 빠르게 뒤쫓고, 두 번째 점이 첫 번째 점을 약간의 지연을 두고 따라가고, 세 번째 점이 두 번째 점을 따라가는 방식으로 움직여야 합니다.

당신은 `useDelayedValue` 커스텀 훅을 구현해야 합니다. 현재 구현은 제공된 `value`를 반환하지만, 대신 밀리초 이전의 `delay`를 받으려고 합니다. 이를 위해선 state와 Effect가 필요할 수 있습니다.

`useDelayedValue`를 값을 구현하고 나면 점들이 서로 따라 움직이는 것을 볼 수 있을 것입니다.

<Hint>

`delayedValue`을 커스텀 훅 안에 state 변수로 저장해야 합니다. `value`가 변경되면 Effect를 실행하고 싶을 것입니다. 이 Effect는 `delay`만큼의 시간이 지난 후 `delayedValue`을 업데이트해야 합니다. `setTimeout`을 호출하는 것이 도움이 될 수 있습니다.

이 Effect를 정리해야 하나요? 왜 또는 왜 안 되나요?

</Hint>

<Sandpack>

```js
import { usePointerPosition } from './usePointerPosition.js';

function useDelayedValue(value, delay) {
  // TODO: 이 훅 실행하기
  return value;
}

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos3, 50);
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

```js usePointerPosition.js
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

```css
body { min-height: 300px; }
```

</Sandpack>

<Solution>

다음은 동작하는 버전입니다. state 변수로 `delayedValue`를 유지합니다. `value`가 업데이트되면, Effect는 `delayedValue`를 업데이트하기 위한 타임아웃을 예약해 둡니다. 이게 바로 `delayedValue`가 항상 진짜 `value`보다 "뒤처지는" 이유입니다.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { usePointerPosition } from './usePointerPosition.js';

function useDelayedValue(value, delay) {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    setTimeout(() => {
      setDelayedValue(value);
    }, delay);
  }, [value, delay]);

  return delayedValue;
}

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos3, 50);
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

```js usePointerPosition.js
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

```css
body { min-height: 300px; }
```

</Sandpack>

이 Effect는 정리할 필요가 "없다"는 걸 기억하세요. 만약 정리 기능에 `clearTimeout`를 호출했다면 매번 `value`는 변경되고, 이미 예정된 타임아웃을 리셋할 겁니다. 동작이 계속 유지되도록 하기 위해 당신은 모든 타임아웃이 동작하길 바랄 겁니다.

</Solution>

</Challenges>
