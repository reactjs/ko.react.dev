---
title: '반응형 effects의 생명주기'
---

<Intro>

effects는 컴포넌트와 다른 생명주기를 가집니다. 컴포넌트는 마운트, 업데이트 또는 마운트 해제할 수 있습니다. effect는 동기화를 시작하고 나중에 동기화를 중지하는 두 가지 작업만 할 수 있습니다. 이 사이클은 시간이 지남에 따라 변하는 props와 state에 의존하는 effect의 경우 여러 번 발생할 수 있습니다. React는 effect의 의존성을 올바르게 지정했는지 확인하는 린터 규칙을 제공합니다. 이렇게 하면 effect가 최신 props와 state에 동기화됩니다.

</Intro>

<YouWillLearn>

- effect의 생명주기가 컴포넌트의 생명주기와 다른 점
- 각 effect를 개별적으로 생각하는 방법
- effect를 다시 동기화해야 하는 시기와 그 이유
- effect의 의존성이 결정되는 방법
- 값이 유동적이라는 것의 의미
- 빈 의존성 배열이 의미하는 것
- React가 린터로 의존성이 올바른지 확인하는 방법
- 린터에 동의하지 않을 때 해야 할 일

</YouWillLearn>

## effect의 생명주기 {/*the-lifecycle-of-an-effect*/}

모든 React 컴포넌트는 동일한 생명주기를 거칩니다.

- 컴포넌트는 화면에 추가될 때 _마운트_ 됩니다.
- 컴포넌트는 일반적으로 상호작용에 대한 응답으로 새로운 props나 state를 수신하면 _업데이트_ 됩니다.
- 컴포넌트가 화면에서 제거되면 _마운트가 해제_ 됩니다.

**컴포넌트에 대해 생각하기에는 좋지만 effects에 대해서는 생각하지 _않는_ 것이 좋습니다.** 대신 컴포넌트의 생명주기와 독립적으로 각 effect를 생각해보세요. effect는 [외부 시스템을 현재 props 및 state와 동기화](/learn/synchronizing-with-effects)하는 방법을 설명합니다. 코드가 변경되면 동기화를 더 자주 또는 덜 자주 수행해야 합니다.

이 점을 설명하기 위해 컴포넌트를 채팅 서버에 연결하는 effect를 예로 들어보겠습니다.

```js
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
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

effect의 본문에는 **동기화 시작** 방법이 명시되어 있습니다.

```js {2-3}
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
    // ...
```

effect에서 반환되는 cleanup function는 **동기화를 중지**하는 방법을 지정합니다.

```js {5}
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
    // ...
```

직관적으로 React는 컴포넌트가 마운트될 때 **동기화를 시작**하고 컴포넌트가 마운트 해제될 때 **동기화를 중지**할 것이라고 생각할 수 있습니다. 하지만 이것이 이야기의 끝이 아닙니다! 때로는 컴포넌트가 마운트된 상태에서 **동기화를 여러 번 시작하고 중지**해야 할 수도 있습니다.

이러한 동작이 필요한 _이유_ 와 _발생 시기_, 그리고 이러한 동작을 제어할 수 있는 _방법_ 을 살펴보겠습니다.

<Note>

일부 effects는 cleanup function를 전혀 반환하지 않습니다. [대부분의 경우]((/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)) 함수를 반환하고 싶겠지만, 그렇지 않은 경우 React는 빈 cleanup function를 반환한 것처럼 동작합니다.

</Note>

### 동기화가 두 번 이상 수행되어야 하는 이유 {/*why-synchronization-may-need-to-happen-more-than-once*/}

이 `ChatRoom` 컴포넌트가 사용자가 드롭다운에서 선택한 `roomId` prop을 받는다고 가정해 보겠습니다. 처음에 사용자가 `"general"` 대화방을 `roomId`로 선택했다고 가정해 봅시다. 앱에 `"general"` 채팅방이 표시됩니다.

```js {3}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId /* "general" */ }) {
  // ...
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

UI가 표시되면 React가 effect를 실행하여 **동기화를 시작**합니다. `"general"` 방에 연결됩니다.

```js {3,4}
function ChatRoom({ roomId /* "general" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // "general" 방에 연결
    connection.connect();
    return () => {
      connection.disconnect(); // "general" 방에서 연결 해제
    };
  }, [roomId]);
  // ...
```

지금까지는 괜찮습니다.

나중에 사용자가 드롭다운에서 다른 방(예: `"travel"`)을 선택합니다. 먼저 React가 UI를 업데이트합니다.

```js {1}
function ChatRoom({ roomId /* "travel" */ }) {
  // ...
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

다음에 어떤 일이 일어날지 생각해 보세요. 사용자는 UI에서 `"travel"`이 선택된 대화방임을 알 수 있습니다. 그러나 지난번에 실행된 effect는 여전히 `"general"` 대화방에 연결되어 있습니다. **`roomId` prop이 변경되었기 때문에 그때 effect가 수행한 작업(`"general"` 방에 연결)이 더 이상 UI와 일치하지 않습니다.**

이 시점에서 React가 두 가지 작업을 수행하기를 원합니다.

1. 이전 roomId와의 동기화를 중지합니다(`"general"` 방에서 연결 끊기).
2. 새 roomId와 동기화 시작(`"travel"` 방에 연결)

**다행히도, 여러분은 이미 이 두 가지를 수행하는 방법을 React에 가르쳤습니다!** effect의 본문에는 동기화를 시작하는 방법이 명시되어 있고, cleanup function에는 동기화를 중지하는 방법이 명시되어 있습니다. 이제 React가 해야 할 일은 올바른 순서로 올바른 props와 state로 호출하기만 하면 됩니다. 정확히 어떻게 일어나는지 살펴보겠습니다.

### React가 effect를 재동기화하는 방법 {/*how-react-re-synchronizes-your-effect*/}

`ChatRoom` 컴포넌트가 `roomId` prop에 새로운 값을 받았다는 것을 기억하세요. 이전에는 `"general"`이었지만 이제는 `"travel"`입니다. 다른 방에 다시 연결하려면 React가 effect를 다시 동기화해야 합니다.

**동기화를 중지**하기 위해 React는 `"general"` 방에 연결한 후 effect가 반환한 cleanup function를 호출합니다. `roomId`가 `"general"`이었기 때문에, cleanup function는 `"general"` 방에서 연결을 끊습니다.

```js {6}
function ChatRoom({ roomId /* "general" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // "general" 방에 연결
    connection.connect();
    return () => {
      connection.disconnect(); // "general" 방에서 연결 해제
    };
    // ...
```

그러면 React는 이 렌더링 중에 여러분이 제공한 effect를 실행합니다. 이번에는 `roomId`가 `"travel"`이므로 `"travel"` 채팅방과 **동기화되기 시작**합니다(결국 cleanup function도 호출될 때까지).

```js {3,4}
function ChatRoom({ roomId /* "travel" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // "travel" 방에 연결
    connection.connect();
    // ...
```

덕분에 이제 사용자가 UI에서 선택한 방과 동일한 방에 연결됩니다. 재앙을 피했습니다!

컴포넌트가 다른 `roomId`로 다시 렌더링할 때마다 effect가 다시 동기화됩니다. 예를 들어 사용자가 `roomId`를 `"travel"`에서 `"music"`으로 변경한다고 가정해 봅시다. React는 다시 cleanup function를 호출하여 effect **동기화를 중지**합니다(`"travel"` 방에서 연결을 끊습니다). 그런 다음 새 `roomId` prop로 본문을 실행하여 **동기화를 다시 시작**합니다(`"music"` 방에 연결).

마지막으로 사용자가 다른 화면으로 이동하면 `ChatRoom`이 마운트를 해제합니다. 이제 연결 상태를 유지할 필요가 전혀 없습니다. React는 마지막으로 effect **동기화를 중지**하고 `"music"` 채팅방에서 연결을 끊습니다.

### effect의 관점에서 생각하기 {/*thinking-from-the-effects-perspective*/}

`ChatRoom` 컴포넌트의 관점에서 일어난 모든 일을 요약해 보겠습니다.

1. `roomId`가 `"general"`으로 설정되어 마운트된 `ChatRoom`
2. `roomId`가 `"travel"`으로 설정되어 업데이트된 `ChatRoom`
3. `roomId`가 `"music"`으로 설정되어 업데이트된 `ChatRoom`
3. 마운트 해제된 `ChatRoom`

컴포넌트의 생명주기에서 이러한 각 시점에서 effect는 다른 작업을 수행했습니다.

1. effect가 `"general"` 대화방에 연결됨
2. `"general"` 방에서 연결이 끊어지고 `"travel"` 방에 연결된 effect
3. `"travel"` 룸에서 연결이 끊어지고 `"music"` 룸에 연결된 effect
4. `"music"` 룸에서 연결이 끊어진 effect

이제 effect 자체의 관점에서 무슨 일이 일어났는지 생각해 봅시다.

```js
  useEffect(() => {
    // roomId로 지정된 방에 연결된 effect...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      // ...연결이 끊어질 때까지
      connection.disconnect();
    };
  }, [roomId]);
```

이 코드의 구조는 어던 일이 일어났는지 겹치지 않는 시간의 연속으로 보는 데 영감을 줄 수 있습니다.

1. `"general"` 방에 연결된 effect (연결이 끊어질 때까지)
2. `"travel"` 방에 연결된 effect (연결이 끊어질 때까지)
3. `"music"` 방에 연결된 effect (연결이 끊어질 때까지)

이전에는 컴포넌트의 관점에서 생각했습니다. 컴포넌트의 관점에서 보면 effect를 '렌더링 후' 또는 '마운트 해제 전'과 같은 특정 시점에 실행되는 '콜백' 또는 '생명주기 이벤트'로 생각하기 쉬웠습니다. 이러한 사고 방식은 매우 빠르게 복잡해지므로 피하는 것이 가장 좋습니다.

**대신 항상 한 번에 하나의 시작/중지 사이클에만 집중하세요. 컴포넌트를 마운트, 업데이트 또는 마운트 해제하는 것은 중요하지 않습니다. 동기화를 시작하는 방법과 중지하는 방법만 설명하면 됩니다. 이 작업을 잘 수행하면 필요한 횟수만큼 effect를 시작하고 중지할 수 있는 탄력성을 확보할 수 있습니다.**

이렇게 하면 JSX를 생성하는 렌더링 로직을 작성할 때 컴포넌트가 마운트되는지 업데이트되는지 생각하지 않는 방법을 떠올릴 수 있습니다. 화면에 무엇이 표시되어야 하는지 설명하면 [나머지는 React가 알아서 처리합니다](/learn/reacting-to-input-with-state).

### React가 effect를 다시 동기화될 수 있는지 확인하는 방법 {/*how-react-verifies-that-your-effect-can-re-synchronize*/}

다음은 여러분이 플레이할 수 있는 라이브 예시입니다. "채팅 열기"를 눌러 `ChatRoom` 컴포넌트를 마운트합니다

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

```js chat.js
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

컴포넌트가 처음 마운트될 때 3개의 로그가 표시됩니다.

1. `✅ https://localhost:1234... 에서 "general" 룸에 연결 중입니다.` *(개발 전용)*
2. `❌ https://localhost:1234 에서 "일반" 방에서 연결 해제되었습니다.` *(개발 전용)*
3. `✅ https://localhost:1234... 에서 "general" 룸에 연결 중입니다.`

처음 두 개의 로그는 개발 전용입니다. 개발 시 React는 항상 각 컴포넌트를 한 번씩 다시 마운트합니다.

**React는 개발 단계에서 즉시 강제로 동기화를 수행하여 effect가 다시 동기화할 수 있는지 확인합니다.** 이는 도어록이 작동하는지 확인하기 위해 문을 열었다가 다시 닫는 것을 떠올리게 할 수 있습니다. React는 개발 과정에서 effect를 한 번 더 시작하고 중지하여 [정리를 잘 구현했는지](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development) 확인합니다.

실제로 effect가 다시 동기화되는 주된 이유는 effect가 사용하는 일부 데이터가 변경된 경우입니다. 위의 sandbox에서 선택한 채팅방을 변경합니다. `roomId`가 변경되면 effect가 다시 동기화되는 것을 확인할 수 있습니다.

그러나 다시 동기화해야 하는 더 특이한 경우도 있습니다. 예를 들어, 채팅이 열려 있는 상태에서 위의 sandbox에서 `serverUrl`을 편집해 보세요. 코드 편집에 대한 응답으로 effect가 어떻게 다시 동기화되는지 주목하세요. 앞으로 React는 재동기화에 의존하는 더 많은 기능을 추가할 수 있습니다.

### React가 effect를 다시 동기화해야 한다는 것을 인식하는 방법 { *how-react-knows-that-it-needs-to-re-synchronize-the-effect*/} {/*react가-effect를-다시-동기화해야-한다는-것을-인식하는-방법--how-react-knows-that-it-needs-to-re-synchronize-the-effect*/}

`roomId`가 변경된 후 effect를 다시 동기화해야 한다는 것을 어떻게 React가 알았는지 궁금할 것입니다. 그것은 여러분이 [종속성 목록](/learn/synchronizing-with-effects#step-2-specify-the-effect-dependencies)에 `roomId`를 포함시킴으로써 해당 코드가 `roomId`에 종속되어 있다고 React에 알렸기 때문입니다.

```js {1,3,8}
function ChatRoom({ roomId }) { // roomId prop은 시간이 지남에 따라 변경될 수 있습니다.
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // 이 effect는 roomId를 읽습니다.
    connection.connect();
    return () => {
      connection.disconnect();
    };
    
  }, [roomId]); // 따라서 React에게 이 effect가 roomId에 "의존"한다고 알려줍니다.
  // ...
```

작동 방식은 다음과 같습니다.

1. `roomId`가 `prop`이므로 시간이 지남에 따라 변경될 수 있다는 것을 알고 있습니다.
2. effect가 `roomId`를 읽는다는 것을 알았습니다 (따라서 로직이 나중에 변경될 수 있는 값에 따라 달라집니다).
3. 그렇기 때문에 `roomId`를 effect의 종속성으로 지정한 것입니다 (`roomId` 가 변경되면 다시 동기화되도록).

컴포넌트가 다시 렌더링될 때마다 React는 전달한 의존성 배열을 살펴봅니다. 배열의 값 중 하나라도 이전 렌더링 중에 전달한 동일한 지점의 값과 다르면 React는 effect를 다시 동기화합니다.

예를 들어, 초기 렌더링 중에 `["general"]`을 전달했는데 나중에 다음 렌더링 중에 `["travel"]`을 전달한 경우, React는 `"general"`과 `"travel"`을 비교합니다. 이 값들은 ([`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)와 비교) 다른 값이기 때문에 React는 effect를 다시 동기화합니다. 반면에 컴포넌트가 다시 렌더링되지만 `roomId`가 변경되지 않은 경우, effect는 동일한 방에 연결된 상태로 유지됩니다.

### 각 effect는 별도의 동기화 프로세스를 나타냅니다. { *each-effect-represents-a-separate-synchronization-process*/} {/*각-effect는-별도의-동기화-프로세스를-나타냅니다--each-effect-represents-a-separate-synchronization-process*/}

이 로직은 이미 작성한 effect와 동시에 실행되어야 하므로 관련 없는 로직을 effect에 추가하지 마세요. 예를 들어 사용자가 회의실을 방문할 때 분석 이벤트를 전송하고 싶다고 가정해 보겠습니다. 이미 `roomId`에 의존하는 effect가 있으므로 거기에 분석 호출을 추가하고 싶을 수 있습니다.

```js {3}
function ChatRoom({ roomId }) {
  useEffect(() => {
    logVisit(roomId);
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

하지만 나중에 이 effect에 연결을 다시 설정해야 하는 다른 종속성을 추가한다고 가정해 보겠습니다. 이 effect가 다시 동기화되면 의도하지 않은 동일한 방에 대해 `logVisit(roomId)`도 호출합니다. 방문을 기록하는 것은 연결과는 **별개의 프로세스**입니다. 두 개의 개별 effect로 작성하세요.

```js {2-4}
function ChatRoom({ roomId }) {
  useEffect(() => {
    logVisit(roomId);
  }, [roomId]);

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    // ...
  }, [roomId]);
  // ...
}
```

**코드의 각 effect는 별도의 독립적인 동기화 프로세스를 나타내야 합니다.**

위의 예시에서는 한 effect를 삭제해도 다른 effect의 로직이 깨지지 않습니다. 이는 서로 다른 것을 동기화하므로 분리하는 것이 합리적이라는 것을 나타냅니다. 반면에 일관된 로직을 별도의 effect로 분리하면 코드가 "더 깔끔해" 보일 수 있지만 [유지 보수가 더 어려워집니다.](/learn/you-might-not-need-an-effect#chains-of-computations) 따라서 코드가 더 깔끔해 보이는지 여부가 아니라 프로세스가 동일하거나 분리되어 있는지를 고려해야 합니다.

## 반응형 값에 "반응"하는 effect {/*effects-react-to-reactive-values*/}

effect에서 두 개의 변수(`serverUrl` 및 `roomId`)를 읽지만 종속성으로 `roomId`만 지정했습니다.

```js {5,10}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
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

`serverUrl`이 종속성이 될 필요가 없는 이유는 무엇인가요?

이는 재렌더링으로 인해 `serverUrl`이 변경되지 않기 때문입니다. 컴포넌트가 몇 번이나 다시 렌더링하든, 그 이유와 상관없이 항상 동일합니다. `serverUrl`은 절대 변경되지 않으므로 종속성으로 지정하는 것은 의미가 없습니다. 결국 종속성은 시간이 지남에 따라 변경될 때만 무언가를 수행합니다!

반면에 `roomId`는 다시 렌더링할 때 달라질 수 있습니다. 컴포넌트 내부에서 선언된 **Props, state 및 기타 값은 렌더링 중에 계산되고 React 데이터 흐름에 참여하기 때문에 _반응형_ 입니다.**

`serverUrl`이 state 변수라면 반응형일 것입니다. 반응형 값은 종속성에 포함되어야 합니다.

```js {2,5,10}
function ChatRoom({ roomId }) { // Props는 시간이 지남에 따라 변화합니다.
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // State는 시간이 지남에 따라 변화합니다.

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // effect는 Props와 state를 읽습니다.
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // 따라서 이 effect는 props과 state에 "의존"한다고 React에 알려줍니다.
  // ...
}
```

`serverUrl`을 종속성으로 포함하면 effect가 변경된 후 다시 동기화되도록 할 수 있습니다.

이 sandbox에서 선택한 대화방을 변경하거나 서버 URL을 수정해 보세요.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
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

```js chat.js
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

`roomId` 또는 `serverUrl`과 같은 반응형 값을 변경할 때마다 effect가 채팅 서버에 다시 연결합니다.

### 빈 종속성이 있는 effect의 의미 {/*what-an-effect-with-empty-dependencies-means*/}

`serverUrl`과 `roomId`를 모두 컴포넌트 외부로 이동하면 어떻게 되나요?

```js {1,2}
const serverUrl = 'https://localhost:1234';
const roomId = 'general';

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ 선언된 모든 종속성
  // ...
}
```

이제 effect의 코드는 *어떤* 반응형 값도 사용하지 않으므로 종속성이 비어 있을 수 있습니다(`[]`).

컴포넌트의 관점에서 생각해보면, 빈 `[]` 의존성 배열은 이 effect가 컴포넌트가 마운트될 때만 채팅방에 연결되고 컴포넌트가 마운트 해제될 때만 연결이 끊어진다는 것을 의미합니다. (React는 로직을 스트레스 테스트하기 위해 개발 단계에서 [한 번 더 동기화](#how-react-verifies-that-your-effect-can-re-synchronize)한다는 점을 기억하세요).


<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
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

```js chat.js
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

하지만 [effect의 관점에서 생각](#thinking-from-the-effects-perspective)하면 마운트 및 마운트 해제에 대해 전혀 생각할 필요가 없습니다. 중요한 것은 effect가 동기화를 시작하고 중지하는 작업을 지정한 것입니다. 현재는 반응형 종속성이 없습니다. 하지만 사용자가 시간이 지남에 따라 `roomId` 또는 `serverUrl`을 변경하려는 경우(그리고 반응형이 되는 경우) effect의 코드는 변경되지 않습니다. 종속성에 추가하기만 하면 됩니다.

### 컴포넌트 본문에서 선언된 모든 변수는 반응형입니다. {/*all-variables-declared-in-the-component-body-are-reactive*/}

props와 state만 반응형 값인 것은 아닙니다. 이들로부터 계산하는 값도 반응형입니다. props나 state가 변경되면 컴포넌트가 다시 렌더링되고 그로부터 계산된 값도 변경됩니다. 이 때문에 effect에서 사용하는 컴포넌트 본문의 모든 변수는 effect 종속성 목록에 있어야 합니다.

사용자가 드롭다운에서 채팅 서버를 선택할 수 있지만 설정에서 기본 서버를 구성할 수도 있다고 가정해 봅시다. 이미 settings state를 [context](/learn/scaling-up-with-reducer-and-context)에 넣어서 해당 context에서 `settings`을 읽었다고 가정해 보겠습니다. 이제 props에서 선택한 서버와 기본 서버를 기준으로 `serverUrl`을 계산합니다.

```js {3,5,10}
function ChatRoom({ roomId, selectedServerUrl }) { // roomId는 반응형입니다.
  const settings = useContext(SettingsContext); // settings는 반응형입니다.
  const serverUrl = selectedServerUrl ?? settings.defaultServerUrl; // serverUrl는 반응형입니다.
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // effect는 roomId 와 serverUrl를 읽습니다.
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // 따라서 둘 중 하나가 변경되면 다시 동기화해야 합니다!
  // ...
}
```

이 예제에서 `serverUrl`은 prop나 state 변수가 아닙니다. 렌더링 중에 계산하는 일반 변수입니다. 하지만 렌더링 중에 계산되므로 재렌더링으로 인해 변경될 수 있습니다. 이것이 바로 반응형인 이유입니다.

**컴포넌트 내부의 모든 값(컴포넌트 본문의 props, state, 변수 포함)은 반응형입니다. 모든 반응형 값은 다시 렌더링할 때 변경될 수 있으므로 반응형 값을 effect의 종속 요소로 포함시켜야 합니다.**

즉, effect는 컴포넌트 본문의 모든 값에 "반응"합니다.

<DeepDive>

#### 전역 또는 변경 가능한 값이 종속성이 될 수 있나요? {/*can-global-or-mutable-values-be-dependencies*/}

변경 가능한 값(전역 변수 포함)은 반응하지 않습니다.

**[`location.pathname`](https://developer.mozilla.org/en-US/docs/Web/API/Location/pathname)과 같은 변경 가능한 값은 종속성이 될 수 없습니다.** 이 값은 변경 가능하므로 React 렌더링 데이터 흐름 외부에서 언제든지 변경할 수 있습니다. 이 값을 변경해도 컴포넌트가 다시 렌더링되지는 않습니다. 따라서 종속성에서 지정했더라도 React는 effect가 변경될 때 effect를 다시 동기화할지 *알 수 없습니다.* 또한 렌더링 도중(의존성을 계산할 때) 변경 가능한 데이터를 읽는 것은 [렌더링의 순수성](/learn/keeping-components-pure)을 깨뜨리기 때문에 React의 규칙을 위반합니다. 대신, [`useSyncExternalStore`](/learn/you-might-not-need-an-effect#subscribing-to-an-external-store)를 사용하여 외부 변경 가능한 값을 읽고 구독해야 합니다.

**[`ref.current`](/reference/react/useRef#reference)와 같이 변경 가능한 값이나 이 값에서 읽은 것 역시 종속성이 될 수 없습니다.** `useRef`가 반환하는 `ref` 객체 자체는 종속성이 될 수 있지만 `current` prop는 의도적으로 변경 가능합니다. 이를 통해 [재렌더링을 트리거하지 않고도 무언가를 추적할 수 있습니다.](/learn/referencing-values-with-refs) 하지만 변경해도 다시 렌더링이 트리거되지 않기 때문에 반응형 값이 아니며, React는 이 값이 변경될 때 effect를 다시 실행할지 알지 못합니다.

이 페이지에서 아래에서 배우게 되겠지만, 린터는 이러한 문제를 자동으로 확인합니다.

</DeepDive>

### React는 모든 반응형 값을 종속성으로 지정했는지 확인합니다. {/*react-verifies-that-you-specified-every-reactive-value-as-a-dependency*/}

린터가 [React에 대해 구성](/learn/editor-setup#linting)된 경우, effect의 코드에서 사용되는 모든 반응형 값이 종속성으로 선언되었는지 확인합니다. 예를 들어, `roomId`와 `serverUrl`이 모두 반응형이기 때문에 이것은 린트 오류입니다.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) { // roomId는 반응형입니다.
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // serverUrl는 반응형입니다.

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // <-- 여기 무언가 잘못되었습니다!

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

```js chat.js
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

이것은 React 오류처럼 보일 수 있지만 실제로는 코드의 버그를 지적하는 것입니다. `roomId`와 `serverUrl`은 시간이 지남에 따라 변경될 수 있지만, 변경 시 effect를 다시 동기화하는 것을 잊어버리고 있습니다. 사용자가 UI에서 다른 값을 선택한 후에도 초기 `roomId`와 `serverUrl`에 연결된 상태로 유지됩니다.

버그를 수정하려면 린터의 제안에 따라 effect의 종속 요소로 `roomId` 및 `serverUrl`을 지정하세요.

```js {9}
function ChatRoom({ roomId }) { // roomId는 반응형입니다.
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // serverUrl는 반응형입니다.
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]); // ✅ 선언된 모든 종속성
  // ...
}
```

위의 sandbox에서 이 수정 방법을 시도해 보세요. 린터 오류가 사라지고 필요할 때 채팅이 다시 연결되는지 확인합니다.

<Note>

어떤 경우에는 컴포넌트 내부에서 값이 선언되더라도 절대 변하지 않는다는 것을 React가 *알고 있습니다.* 예를 들어, `useState`에서 반환되는 [`set` 함수](/reference/react/useState#setstate)와 [`useRef`](/reference/react/useRef)에서 반환되는 ref 객체는 *안정적*이며, 다시 렌더링해도 변경되지 않도록 보장됩니다. 안정된 값은 반응하지 않으므로 목록에서 생략할 수 있습니다. 이러한 값은 변경되지 않으므로 포함해도 상관없습니다.

</Note>

### 다시 동기화하지 않으려는 경우 어떻게 해야 하나요? {/*what-to-do-when-you-dont-want-to-re-synchronize*/}

이전 예제에서는 `roomId`와 `serverUrl`를 종속성으로 나열하여 린트 오류를 수정했습니다.

**그러나 대신 이러한 값이 반응형 값이 아니라는 것, 즉 재렌더링의 결과로 변경*될 수 없다*는 것을 린터에 "증명"할 수 있습니다.** 예를 들어 `serverUrl`과 `roomId`가 렌더링에 의존하지 않고 항상 같은 값을 갖는다면 컴포넌트 외부로 옮길 수 있습니다. 이제 종속성이 될 필요가 없습니다.

```js {1,2,11}
const serverUrl = 'https://localhost:1234'; // serverUrl는 반응형이 아닙니다.
const roomId = 'general'; // roomId는 반응형입니다.

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ 선언된 모든 종속성
  // ...
}
```

*effect 내부*로 이동할 수도 있습니다. 렌더링 중에 계산되지 않으므로 반응하지 않습니다:

```js {3,4,10}
function ChatRoom() {
  useEffect(() => {
    const serverUrl = 'https://localhost:1234'; // serverUrl는 반응형이 아닙니다.
    const roomId = 'general'; // roomId는 반응형입니다.
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ 선언된 모든 종속성
  // ...
}
```

**effect는 반응형 코드 블록입니다.** 내부에서 읽은 값이 변경되면 다시 동기화됩니다. 상호작용당 한 번만 실행되는 이벤트 핸들러와 달리 effect는 동기화가 필요할 때마다 실행됩니다.

**종속성을 "선택"할 수 없습니다.** 종속성에는 effect에서 읽은 모든 [반응형 값](#all-variables-declared-in-the-component-body-are-reactive)이 포함되어야 합니다. 린터가 이를 강제합니다. 때때로 이로 인해 무한 루프와 같은 문제가 발생하거나 effect가 너무 자주 다시 동기화될 수 있습니다. 린터를 억제하여 이러한 문제를 해결하지 마세요! 대신 시도할 수 있는 방법은 다음과 같습니다.

* **effect가 독립적인 동기화 프로세스를 나타내는지 확인하세요.** effect가 아무것도 동기화하지 않는다면 [불필요한 것일 수 있습니다.](/learn/you-might-not-need-an-effect) 여러 개의 독립적인 것을 동기화하는 경우 [분할](#each-effect-represents-a-separate-synchronization-process)하세요.

* **props이나 state에 "반응"하지 않고 effect를 다시 동기화하지 않고 최신 값을 읽으려면** effect를 반응하는 부분(effect에 유지할 것)과 반응하지 않는 부분(_effect 이벤트_ 라고 하는 것으로 추출할 수 있는 것)으로 분리하면 됩니다. [이벤트와 effect를 분리하는 방법을 읽어보세요.](/learn/separating-events-from-effects)

* **객체와 함수를 종속성으로 사용하지 마세요.** 렌더링 중에 오브젝트와 함수를 생성한 다음 effect에서 읽으면 렌더링할 때마다 오브젝트와 함수가 달라집니다. 그러면 매번 effect를 다시 동기화해야 합니다. [effect에서 불필요한 종속성을 제거하는 방법에 대해 자세히 읽어보세요.](/learn/removing-effect-dependencies)

<Pitfall>

린터는 여러분의 친구이지만 그 힘은 제한되어 있습니다. 린터는 종속성이 *잘못*되었을 때만 알 수 있습니다. 각 사례를 해결하는 *최선*의 방법은 알지 못합니다. 만약 린터가 종속성을 제안하지만 이를 추가하면 루프가 발생한다고 해서 린터를 무시해야 한다는 의미는 아닙니다. 해당 값이 반응적이지 않고 종속성이 될 *필요*가 없도록 effect 내부(또는 외부)의 코드를 변경해야 합니다.

기존 코드베이스가 있는 경우 이와 같이 린터를 억제하는 effect가 있을 수 있습니다.

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 이런 식으로 린트를 억누르지 마세요.
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

[다음](/learn/separating-events-from-effects) [페이지](/learn/removing-effect-dependencies)에서는 규칙을 위반하지 않고 이 코드를 수정하는 방법을 알아보세요. 언제나 고칠 가치가 있습니다!

</Pitfall>

<Recap>

- 컴포넌트는 마운트, 업데이트, 마운트 해제할 수 있습니다.
- 각 effect는 주변 컴포넌트와 별도의 라이프사이클을 가집니다.
- 각 effect는 시작 및 중지할 수 있는 별도의 동기화 프로세스를 설명합니다.
- effect를 작성하고 읽을 때는 컴포넌트의 관점(마운트, 업데이트 또는 마운트 해제 방법)이 아닌 각 개별 effect의 관점(동기화 *시작* 및 *중지* 방법)에서 생각하세요.
- 컴포넌트 본문 내부에 선언된 값은 "반응형"입니다.
- 반응형 값은 시간이 지남에 따라 변경될 수 있으므로 effect를 다시 동기화해야 합니다.
- 린터는 effect 내부에서 사용된 모든 반응형 값이 종속성으로 지정되었는지 확인합니다.
- 린터에 의해 플래그가 지정된 모든 오류는 합법적인 오류입니다. 규칙을 위반하지 않도록 코드를 수정할 수 있는 방법은 항상 있습니다.

</Recap>

<Challenges>

#### 모든 키 입력 시 재연결 문제 수정 {/*fix-reconnecting-on-every-keystroke*/}

이 예제에서 `ChatRoom` 컴포넌트는 컴포넌트가 마운트될 때 채팅방에 연결되고, 마운트가 해제되면 연결이 끊어지며, 다른 채팅방을 선택하면 다시 연결됩니다. 이 동작은 올바른 것이므로 계속 작동하도록 해야 합니다.

하지만 문제가 있습니다. 하단의 메시지 상자 입력란에 입력할 때마다 `ChatRoom`*도* 채팅에 다시 연결됩니다. (콘솔을 지우고 입력란에 입력하면 이 문제를 확인할 수 있습니다.) 이런 일이 발생하지 않도록 문제를 해결하세요.

<Hint>

이 effect에 대한 종속성 배열을 추가해야 할 수도 있습니다. 어떤 종속성이 있어야 할까요?

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  });

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
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

```js chat.js
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

<Solution>

이 effect에는 종속성 배열이 전혀 없었기 때문에 렌더링할 때마다 다시 동기화되었습니다. 먼저 종속성 배열을 추가합니다. 그런 다음 effect에서 사용하는 모든 반응형 값이 배열에 지정되어 있는지 확인합니다. 예를 들어 `roomId`는 반응형이므로(props이므로) 배열에 포함되어야 합니다. 이렇게 하면 사용자가 다른 방을 선택해도 채팅이 다시 연결됩니다. 반면 `serverUrl`은 컴포넌트 외부에 정의됩니다. 그렇기 때문에 배열에 포함할 필요가 없습니다.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
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

```js chat.js
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

</Solution>

#### 동기화 켜기 및 끄기 {/*switch-synchronization-on-and-off*/}

이 예제에서 effect는 창 [`pointermove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointermove_event) 이벤트를 구독하여 화면에서 분홍색 점을 이동합니다. 미리 보기 영역 위로 마우스를 가져가서(또는 모바일 장치에서 화면을 터치하여) 분홍색 점이 어떻게 움직이는지 확인해 보세요.

체크박스도 있습니다. 체크 박스를 선택하면 `canMove` state 변수가 토글되지만 이 state 변수는 코드의 어느 곳에서도 사용되지 않습니다. 여러분의 임무는 `canMove`가 `false`일 때(체크박스가 체크된 상태) 점의 이동이 중지되도록 코드를 변경하는 것입니다. 체크 박스를 다시 켜고 `canMove`를 `true`로 설정하면 상자가 다시 움직여야 합니다. 즉, 도트가 움직일 수 있는지 여부는 체크 박스의 체크 여부와 동기화 state를 유지해야 합니다.

<Hint>

effect는 조건부로 선언할 수 없습니다. 하지만 effect 내부의 코드는 조건을 사용할 수 있습니다!

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);

  return (
    <>
      <label>
        <input type="checkbox"
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

<Solution>

한 가지 해결책은 `setPosition` 호출을 `if (canMove) { ... }` 조건으로 감싸는 것입니다.

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      if (canMove) {
        setPosition({ x: e.clientX, y: e.clientY });
      }
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, [canMove]);

  return (
    <>
      <label>
        <input type="checkbox"
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

또는 *이벤트 구독 로직*을 `if (canMove) { ... }` 조건으로 래핑할 수 있습니다:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    if (canMove) {
      window.addEventListener('pointermove', handleMove);
      return () => window.removeEventListener('pointermove', handleMove);
    }
  }, [canMove]);

  return (
    <>
      <label>
        <input type="checkbox"
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

이 두 경우 모두 `canMove`는 effect 내부에서 읽는 반응형 변수입니다. 그렇기 때문에 effect 종속성 목록에 지정해야 합니다. 이렇게 하면 값이 변경될 때마다 effect가 다시 동기화됩니다.

</Solution>

#### 오래된 값 버그 조사하기 {/*investigate-a-stale-value-bug*/}

이 예제에서는 체크박스가 켜져 있으면 분홍색 점이 움직여야 하고 체크박스가 꺼져 있으면 움직임을 멈춰야 합니다. 이를 위한 로직은 이미 구현되어 있습니다. `handleMove` 이벤트 핸들러는 `canMove` state 변수를 확인합니다.

그러나 어떤 이유에서인지 `handleMove` 내부의 `canMove` state 변수는 체크박스를 체크한 후에도 항상 `true`인 "오래된" state인 것처럼 보입니다. 어떻게 이런 일이 가능할까요? 코드에서 실수를 찾아서 수정하세요.

<Hint>

린터 규칙이 억압되는 것이 보이면 억압을 제거하세요! 보통 이 부분에서 실수가 발생합니다.

</Hint>

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

<Solution>

원래 코드의 문제는 의존성 린터를 억제하는 것이었습니다. 억제를 제거하면 이 effect가 `handleMove` 함수에 의존한다는 것을 알 수 있습니다. `handleMove`는 컴포넌트 본문 내부에서 선언되어 반응형 값이 되기 때문입니다. 모든 반응형 값은 종속성으로 지정해야 하며, 그렇지 않으면 시간이 지나면 낡아질 수 있습니다!

원본 코드 작성자는 effect가 어떤 반응형 값에도 의존(`[]`)하지 않는다고 말함으로써 React에 "거짓말"을 했습니다. 이것이 바로 React가 `canMove`가 변경된 후 effect를 다시 동기화하지 않은 이유입니다(그리고 `handleMove`도 함께). React가 effect를 재동기화하지 않았기 때문에 리스너로 첨부된 `handleMove`는 초기 렌더링 중에 생성된 `handleMove` 함수입니다. 초기 렌더링 동안 `canMove`는 `true`이었기 때문에 초기 렌더링의 `handleMove`는 영원히 그 값을 보게 됩니다.

**린터를 억제하지 않으면 오래된 값으로 인한 문제가 발생하지 않습니다.** 이 버그를 해결하는 방법에는 몇 가지가 있지만 항상 린터 억제를 제거하는 것부터 시작해야 합니다. 그런 다음 코드를 변경하여 린트 오류를 수정하세요.

effect 종속성을 `[handleMove]`로 변경할 수 있지만, 렌더링할 때마다 새로 정의되는 함수가 *될 것*이므로 종속성 배열을 모두 제거하는 것이 좋습니다. 그러면 렌더링할 때마다 effect가 다시 동기화됩니다:

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
  });

  return (
    <>
      <label>
        <input type="checkbox"
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

이 솔루션은 작동하지만 이상적이지는 않습니다. effect 안에 `console.log('Resubscribing')`을 넣으면 렌더링할 때마다 재구독하는 것을 확인할 수 있습니다. 재구독은 빠르지만 너무 자주 하는 것은 피하는 것이 좋습니다.

더 나은 해결책은 핸들무브 함수를 effect *내부*로 옮기는 것입니다. 그러면 `handleMove`는 반응형 값이 아니므로 effect가 함수에 종속되지 않습니다. 대신, 이제 코드가 effect 내부에서 읽는 `canMove`에 의존해야 합니다. 이제 effect가 `canMove`의 값과 동기화 state를 유지하므로 원하는 동작과 일치합니다.

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      if (canMove) {
        setPosition({ x: e.clientX, y: e.clientY });
      }
    }

    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, [canMove]);

  return (
    <>
      <label>
        <input type="checkbox"
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

effect 본문에 `console.log('Resubscribing')`를 추가하면 이제 체크 박스를 토글하거나(`canMove` 변경 사항) 코드를 편집할 때만 다시 구독하는 것을 확인할 수 있습니다. 이렇게 하면 항상 재구독하던 이전 접근 방식보다 개선되었습니다.

[이벤트와 effect 분리하기](/learn/separating-events-from-effects)에서 이러한 유형의 문제에 대한 보다 일반적인 접근 방식을 배우게 됩니다.

</Solution>

#### 연결 스위치 수정 {/*fix-a-connection-switch*/}

이 예제에서 `chat.js`의 채팅 서비스는 `createEncryptedConnection`과 `createUnencryptedConnection`이라는 두 개의 서로 다른 API를 노출합니다. 루트 `App` 컴포넌트는 사용자가 암호화 사용 여부를 선택할 수 있도록 한 다음, 해당 API 메서드를 하위 `ChatRoom` 컴포넌트에 `createConnection` prop로 전달합니다.

처음에는 콘솔 로그에 연결이 암호화되지 않았다고 표시됩니다. 체크 박스를 켜면 아무 일도 일어나지 않습니다. 그러나 그 후에 선택한 대화방을 변경하면 채팅이 다시 연결*되고* 콘솔 메시지에서 볼 수 있듯이 암호화가 활성화됩니다. 이것은 버그입니다. 체크 박스를 토글해*도* 채팅이 다시 연결되도록 버그를 수정했습니다.

<Hint>

린터를 억제하는 것은 항상 의심스러운 일입니다. 버그일까요?

</Hint>

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
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
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        createConnection={isEncrypted ?
          createEncryptedConnection :
          createUnencryptedConnection
        }
      />
    </>
  );
}
```

```js ChatRoom.js active
import { useState, useEffect } from 'react';

export default function ChatRoom({ roomId, createConnection }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js chat.js
export function createEncryptedConnection(roomId) {
  // 실제 구현은 실제로 서버에 연결됩니다.
  return {
    connect() {
      console.log('✅ 🔐 Connecting to "' + roomId + '... (encrypted)');
    },
    disconnect() {
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // 실제 구현은 실제로 서버에 연결됩니다.
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '... (unencrypted)');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

린터 억제를 제거하면 린트 오류가 표시됩니다. 문제는 `createConnection`이 props이기 때문에 반응형 값이라는 것입니다. 시간이 지남에 따라 변경될 수 있습니다! (실제로 사용자가 체크박스를 선택하면 부모 컴포넌트가 다른 값의 `createConnection` prop을 전달합니다.) 실제로 그래야 합니다. 이것이 바로 종속성이 되어야 하는 이유입니다. 목록에 포함시켜 버그를 수정하세요.

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
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
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        createConnection={isEncrypted ?
          createEncryptedConnection :
          createUnencryptedConnection
        }
      />
    </>
  );
}
```

```js ChatRoom.js active
import { useState, useEffect } from 'react';

export default function ChatRoom({ roomId, createConnection }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, createConnection]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js chat.js
export function createEncryptedConnection(roomId) {
  // 실제 구현은 실제로 서버에 연결됩니다.
  return {
    connect() {
      console.log('✅ 🔐 Connecting to "' + roomId + '... (encrypted)');
    },
    disconnect() {
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // 실제 구현은 실제로 서버에 연결됩니다.
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '... (unencrypted)');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

`createConnection`이 종속성이라는 것은 맞습니다. 하지만 누군가 이 프로퍼티의 값으로 인라인 함수를 전달하도록 `App` 컴포넌트를 편집할 수 있기 때문에 이 코드는 약간 취약합니다. 이 경우 `App` 컴포넌트가 다시 렌더링할 때마다 값이 달라지므로 effect가 너무 자주 다시 동기화될 수 있습니다. 이를 방지하려면 대신 `isEncrypted`를 전달할 수 있습니다:

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
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
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
      />
    </>
  );
}
```

```js ChatRoom.js active
import { useState, useEffect } from 'react';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted }) {
  useEffect(() => {
    const createConnection = isEncrypted ?
      createEncryptedConnection :
      createUnencryptedConnection;
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js chat.js
export function createEncryptedConnection(roomId) {
  // 실제 구현은 실제로 서버에 연결됩니다.
  return {
    connect() {
      console.log('✅ 🔐 Connecting to "' + roomId + '... (encrypted)');
    },
    disconnect() {
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // 실제 구현은 실제로 서버에 연결됩니다.
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '... (unencrypted)');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

이 버전에서는 `App` 컴포넌트가 함수 대신 boolean prop를 전달합니다. effect 내에서 어떤 함수를 사용할지 결정합니다. `createEncryptedConnection`과 `createUnencryptedConnection`은 모두 컴포넌트 외부에서 선언되므로 반응형이 아니므로 종속성이 될 필요가 없습니다. 이에 대한 자세한 내용은 [effect 종속성 제거하기](/learn/removing-effect-dependencies)에서 확인할 수 있습니다.

</Solution>

#### select box 체인 채우기 {/*populate-a-chain-of-select-boxes*/}

이 예제에는 두 개의 select box가 있습니다. 하나의 select box에서 사용자는 행성을 선택할 수 있습니다. 다른 select box는 사용자가 해당 *행성의* 장소를 선택할 수 있도록 합니다. 두 번째 상자는 아직 작동하지 않습니다. 여러분의 임무는 선택한 행성의 장소를 표시하도록 만드는 것입니다.

첫 번째 select box의 작동 방식을 살펴보겠습니다. 이 상자는 `"/planets"` API 호출의 결과로 `planetList` state를 채웁니다. 현재 선택된 행성의 ID는 `planetId` state 변수에 보관됩니다. `placeList` state 변수가 `"/planets/" + planetId + "/places"` API 호출의 결과로 채워지도록 몇 가지 추가 코드를 추가할 위치를 찾아야 합니다.

이 코드를 올바르게 구현하면 행성을 선택하면 장소 목록이 채워져야 합니다. 행성을 변경하면 장소 목록이 변경되어야 합니다.

<Hint>

두 개의 독립적인 동기화 프로세스가 있는 경우 두 개의 개별 effect를 작성해야 합니다.

</Hint>

<Sandpack>

```js App.js
import { useState, useEffect } from 'react';
import { fetchData } from './api.js';

export default function Page() {
  const [planetList, setPlanetList] = useState([])
  const [planetId, setPlanetId] = useState('');

  const [placeList, setPlaceList] = useState([]);
  const [placeId, setPlaceId] = useState('');

  useEffect(() => {
    let ignore = false;
    fetchData('/planets').then(result => {
      if (!ignore) {
        console.log('Fetched a list of planets.');
        setPlanetList(result);
        setPlanetId(result[0].id); // 첫 번째 행성을 선택합니다.
      }
    });
    return () => {
      ignore = true;
    }
  }, []);

  return (
    <>
      <label>
        Pick a planet:{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        Pick a place:{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>You are going to: {placeId || '???'} on {planetId || '???'} </p>
    </>
  );
}
```

```js api.js hidden
export function fetchData(url) {
  if (url === '/planets') {
    return fetchPlanets();
  } else if (url.startsWith('/planets/')) {
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    if (!match || !match[1] || !match[1].length) {
      throw Error('Expected URL like "/planets/earth/places". Received: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('Expected URL like "/planets" or "/planets/earth/places". Received: "' + url + '".');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: 'Earth'
      }, {
        id: 'venus',
        name: 'Venus'
      }, {
        id: 'mars',
        name: 'Mars'        
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) expects a string argument. ' +
      'Instead received: ' + planetId + '.'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: 'Laos'
        }, {
          id: 'spain',
          name: 'Spain'
        }, {
          id: 'vietnam',
          name: 'Vietnam'        
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: 'Aurelia'
        }, {
          id: 'diana-chasma',
          name: 'Diana Chasma'
        }, {
          id: 'kumsong-vallis',
          name: 'Kŭmsŏng Vallis'        
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: 'Aluminum City'
        }, {
          id: 'new-new-york',
          name: 'New New York'
        }, {
          id: 'vishniac',
          name: 'Vishniac'
        }]);
      } else throw Error('Unknown planet ID: ' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

두 가지 독립적인 동기화 프로세스가 있습니다.

- 첫 번째 선택 상자는 원격 행성 목록에 동기화됩니다.
- 두 번째 선택 상자는 현재 `planetId`에 대한 원격 장소 목록과 동기화됩니다.

그렇기 때문에 두 개의 개별 effect로 설명하는 것이 합리적입니다. 다음은 이를 수행하는 방법에 대한 예시입니다.

<Sandpack>

```js App.js
import { useState, useEffect } from 'react';
import { fetchData } from './api.js';

export default function Page() {
  const [planetList, setPlanetList] = useState([])
  const [planetId, setPlanetId] = useState('');

  const [placeList, setPlaceList] = useState([]);
  const [placeId, setPlaceId] = useState('');

  useEffect(() => {
    let ignore = false;
    fetchData('/planets').then(result => {
      if (!ignore) {
        console.log('Fetched a list of planets.');
        setPlanetList(result);
        setPlanetId(result[0].id); // 첫 번째 행성을 선택합니다.
      }
    });
    return () => {
      ignore = true;
    }
  }, []);

  useEffect(() => {
    if (planetId === '') {
      // 첫 번째 상자에서는 아직 아무것도 선택되지 않았습니다.
      return;
    }

    let ignore = false;
    fetchData('/planets/' + planetId + '/places').then(result => {
      if (!ignore) {
        console.log('Fetched a list of places on "' + planetId + '".');
        setPlaceList(result);
        setPlaceId(result[0].id); // 첫 번째 장소를 선택합니다.
      }
    });
    return () => {
      ignore = true;
    }
  }, [planetId]);

  return (
    <>
      <label>
        Pick a planet:{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        Pick a place:{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>You are going to: {placeId || '???'} on {planetId || '???'} </p>
    </>
  );
}
```

```js api.js hidden
export function fetchData(url) {
  if (url === '/planets') {
    return fetchPlanets();
  } else if (url.startsWith('/planets/')) {
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    if (!match || !match[1] || !match[1].length) {
      throw Error('Expected URL like "/planets/earth/places". Received: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('Expected URL like "/planets" or "/planets/earth/places". Received: "' + url + '".');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: 'Earth'
      }, {
        id: 'venus',
        name: 'Venus'
      }, {
        id: 'mars',
        name: 'Mars'        
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) expects a string argument. ' +
      'Instead received: ' + planetId + '.'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: 'Laos'
        }, {
          id: 'spain',
          name: 'Spain'
        }, {
          id: 'vietnam',
          name: 'Vietnam'        
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: 'Aurelia'
        }, {
          id: 'diana-chasma',
          name: 'Diana Chasma'
        }, {
          id: 'kumsong-vallis',
          name: 'Kŭmsŏng Vallis'        
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: 'Aluminum City'
        }, {
          id: 'new-new-york',
          name: 'New New York'
        }, {
          id: 'vishniac',
          name: 'Vishniac'
        }]);
      } else throw Error('Unknown planet ID: ' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

이 코드는 약간 반복적입니다. 하지만 그렇다고 해서 이를 하나의 effect로 결합해야 하는 이유는 없습니다! 이렇게 하면 두 effect의 종속성을 하나의 목록으로 결합한 다음 행성을 변경하면 모든 행성 목록을 다시 가져와야 합니다. effect는 코드 재사용을 위한 도구가 아닙니다.

대신 반복을 줄이기 위해 아래의 `useSelectOptions`와 같은 커스텀 Hook에 일부 로직을 추출할 수 있습니다:

<Sandpack>

```js App.js
import { useState } from 'react';
import { useSelectOptions } from './useSelectOptions.js';

export default function Page() {
  const [
    planetList,
    planetId,
    setPlanetId
  ] = useSelectOptions('/planets');

  const [
    placeList,
    placeId,
    setPlaceId
  ] = useSelectOptions(planetId ? `/planets/${planetId}/places` : null);

  return (
    <>
      <label>
        Pick a planet:{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList?.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        Pick a place:{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList?.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>You are going to: {placeId || '...'} on {planetId || '...'} </p>
    </>
  );
}
```

```js useSelectOptions.js
import { useState, useEffect } from 'react';
import { fetchData } from './api.js';

export function useSelectOptions(url) {
  const [list, setList] = useState(null);
  const [selectedId, setSelectedId] = useState('');
  useEffect(() => {
    if (url === null) {
      return;
    }

    let ignore = false;
    fetchData(url).then(result => {
      if (!ignore) {
        setList(result);
        setSelectedId(result[0].id);
      }
    });
    return () => {
      ignore = true;
    }
  }, [url]);
  return [list, selectedId, setSelectedId];
}
```

```js api.js hidden
export function fetchData(url) {
  if (url === '/planets') {
    return fetchPlanets();
  } else if (url.startsWith('/planets/')) {
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    if (!match || !match[1] || !match[1].length) {
      throw Error('Expected URL like "/planets/earth/places". Received: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('Expected URL like "/planets" or "/planets/earth/places". Received: "' + url + '".');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: 'Earth'
      }, {
        id: 'venus',
        name: 'Venus'
      }, {
        id: 'mars',
        name: 'Mars'        
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) expects a string argument. ' +
      'Instead received: ' + planetId + '.'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: 'Laos'
        }, {
          id: 'spain',
          name: 'Spain'
        }, {
          id: 'vietnam',
          name: 'Vietnam'        
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: 'Aurelia'
        }, {
          id: 'diana-chasma',
          name: 'Diana Chasma'
        }, {
          id: 'kumsong-vallis',
          name: 'Kŭmsŏng Vallis'        
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: 'Aluminum City'
        }, {
          id: 'new-new-york',
          name: 'New New York'
        }, {
          id: 'vishniac',
          name: 'Vishniac'
        }]);
      } else throw Error('Unknown planet ID: ' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

sandbox에서 `useSelectOptions.js` 탭을 확인하여 작동 방식을 확인하세요. 이상적으로는 애플리케이션의 대부분의 effect는 사용자가 직접 작성했든 커뮤니티에서 작성했든 결국 커스텀 hook으로 대체되어야 합니다. 커스텀 hook은 동기화 로직을 숨기므로 호출 컴포넌트는 effect에 대해 알지 못합니다. 앱을 계속 개발하다 보면 선택할 수 있는 Hook 팔레트를 개발하게 될 것이고, 결국에는 컴포넌트에 effect를 자주 작성할 필요가 없게 될 것입니다.

</Solution>

</Challenges>
