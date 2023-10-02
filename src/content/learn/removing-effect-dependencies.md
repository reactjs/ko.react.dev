---
title: Effect 의존성 제거하기
---

<Intro>

Effect를 작성하면 린터는 Effect의 의존성 목록에 Effect가 읽는 모든 반응형 값(예를 들어 props 및 State)을 포함했는지 확인합니다. 이렇게 하면 Effect가 컴포넌트의 최신 props 및 State와 동기화 상태를 유지할 수 있습니다. 불필요한 의존성으로 인해 Effect가 너무 자주 실행되거나 무한 루프를 생성할 수도 있습니다. 이 가이드를 따라 Effect에서 불필요한 의존성을 검토하고 제거하세요.

</Intro>

<YouWillLearn>

* Effect 의존성 무한 루프를 수정하는 방법
* 의존성을 제거하고자 할 때 해야 할 일
* Effect에 "반응"하지 않고 Effect에서 값을 읽는 방법
* 객체와 함수 의존성을 피하는 방법과 이유
* 의존성 린터를 억제하는 것이 위험한 이유와 대신 할 수 있는 일

</YouWillLearn>

## 의존성은 코드와 일치해야 합니다. {/*dependencies-should-match-the-code*/}

Effect를 작성할 때는 먼저 Effect가 수행하기를 원하는 작업을 [시작하고 중지](/learn/lifecycle-of-reactive-effects#the-lifecycle-of-an-effect)하는 방법을 지정합니다.

```js {5-7}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  	// ...
}
```

그런 다음 Effect 의존성을 비워두면(`[]`) 린터가 올바른 의존성을 제안합니다.

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
  }, []); // <-- Fix the mistake here!
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

```js chat.js
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

린터에 표시된 내용에 따라 채우세요:

```js {6}
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
}
```

[Effect는 반응형 값에 "반응"합니다.](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) `roomId`는 반응형 값이므로(재렌더링으로 인해 변경될 수 있음), 린터는 이를 의존성으로 지정했는지 확인합니다. `roomId`가 다른 값을 받으면 React는 Effect를 다시 동기화합니다. 이렇게 하면 채팅이 선택된 방에 연결된 상태를 유지하고 드롭다운에 '반응'합니다.

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

```js chat.js
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

### 의존성을 제거하려면 의존성이 아님을 증명하세요 {/*to-remove-a-dependency-prove-that-its-not-a-dependency*/}

Effect의 의존성을 "선택"할 수 없다는 점에 유의하세요. Effect의 코드에서 사용되는 모든 <CodeStep step={2}>반응형 값</CodeStep>은 의존성 목록에 선언되어야 합니다. 의존성 목록은 주변 코드에 의해 결정됩니다.

```js [[2, 3, "roomId"], [2, 5, "roomId"], [2, 8, "roomId"]]
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) { // This is a reactive value
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // This Effect reads that reactive value
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ So you must specify that reactive value as a dependency of your Effect
  // ...
}
```

[반응형 값](/learn/lifecycle-of-reactive-effects#all-variables-declared-in-the-component-body-are-reactive)에는 props와 컴포넌트 내부에서 직접 선언된 모든 변수 및 함수가 포함됩니다. `roomId`는 반응형 값이므로 의존성 목록에서 제거할 수 없습니다. 린터가 허용하지 않습니다.

```js {8}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // 🔴 React Hook useEffect has a missing dependency: 'roomId'
  // ...
}
```

그리고 린터가 맞을 것입니다! `roomId`는 시간이 지남에 따라 변경될 수 있으므로 코드에 버그가 발생할 수 있습니다.

**의존성을 제거하려면 해당 컴포넌트가 의존성이 될 *필요가 없다는 것*을 린터에 "증명"하세요.** 예를 들어 `roomId`를 컴포넌트 밖으로 이동시켜서 반응형값이 아니고 재렌더링 시에도 변경되지 않음을 증명할 수 있습니다.

```js {2,9}
const serverUrl = 'https://localhost:1234';
const roomId = 'music'; // Not a reactive value anymore

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ All dependencies declared
  // ...
}
```

이제 `roomId`는 반응형 값이 아니므로(재렌더링할 때 변경할 수 없으므로) 의존성이 될 필요가 없습니다.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'music';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js chat.js
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

이것이 [빈(`[]`) 의존성 목록](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means)을 지정할 수 있는 이유입니다. Effect는 더 이상 반응형 값에 의존하지 않으므로 컴포넌트의 props나 State가 변경될 때 Effect를 다시 실행할 필요가 없습니다.

### 의존성을 변경하려면 코드를 변경하세요. {/*to-change-the-dependencies-change-the-code*/}

작업 흐름에서 패턴을 발견했을 수도 있습니다.

1. 먼저 Effect의 코드 또는 반응형 값 선언 방식을 **변경**합니다.
2. 그런 다음, **변경한 코드에 맞게** 의존성을 조정합니다.
3. 의존성 목록이 마음에 들지 않으면 **첫 번째 단계로 돌아가서** 코드를 다시 변경합니다. (그리고 코드를 다시 변경하세요).

마지막 부분이 중요합니다. 의존성을 변경하려면 먼저 주변 코드를 변경하세요. 의존성 목록은 [Effect의 코드에서 사용하는 모든 반응형 값의 목록](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency)이라고 생각하면 됩니다. 이 목록에 무엇을 넣을지는 사용자가 선택하지 않습니다. 이 목록은 코드를 설명합니다. 의존성 목록을 변경하려면 코드를 변경하세요.

이것은 방정식을 푸는 것처럼 느껴질 수 있습니다. 예를 들어 의존성 제거와 같은 목표를 설정하고 그 목표에 맞는 코드를 "찾아야" 합니다. 모든 사람이 방정식을 푸는 것을 재미있어하는 것은 아니며, Effect를 작성할 때도 마찬가지입니다! 다행히도 아래에 시도해 볼 수 있는 일반적인 레시피 목록이 있습니다.

<Pitfall>

기존 코드베이스가 있는 경우 이와 같이 린터를 억제하는 Effect가 있을 수 있습니다.

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 Avoid suppressing the linter like this:
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

**의존성이 코드와 일치하지 않으면 버그가 발생할 위험이 매우 높습니다.** 린터를 억제하면 Effect가 의존하는 값에 대해 React에 "거짓말"을 하게 됩니다.

대신 다음에 소개할 기술을 사용하세요.

</Pitfall>

<DeepDive>

#### 의존성 린터를 억제하는 것이 왜 위험한가요? {/*why-is-suppressing-the-dependency-linter-so-dangerous*/}

린터를 억제하면 매우 직관적이지 않은 버그가 발생하여 찾아서 수정하기가 어렵습니다. 한 가지 예시를 들어보겠습니다.

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  function onTick() {
	setCount(count + increment);
  }

  useEffect(() => {
    const id = setInterval(onTick, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

```css
button { margin: 10px; }
```

</Sandpack>

"마운트할 때만" Effect를 실행하고 싶다고 가정해 봅시다. [빈(`[]`) 의존성](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means)이 그렇게 한다는 것을 읽었으므로 린터를 무시하고 `[]` 의존성을 강제로 지정하기로 결정했습니다.

이 카운터는 두 개의 버튼으로 설정할 수 있는 양만큼 매초마다 증가해야 합니다. 하지만 이 Effect가 아무 것도 의존하지 않는다고 React에 "거짓말"을 했기 때문에, React는 초기 렌더링에서 계속 `onTick` 함수를 사용합니다. [이 렌더링에서](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time) `count`는 `0`이었고 `increment`는 `1`이었습니다. 그래서 이 렌더링의 `onTick`은 항상 매초마다 `setCount(0 + 1)`를 호출하고 항상 `1`이 표시됩니다. 이와 같은 버그는 여러 컴포넌트에 분산되어 있을 때 수정하기가 더 어렵습니다.

린터를 무시하는 것보다 더 좋은 해결책은 항상 있습니다! 이 코드를 수정하려면 의존성 목록에 `onTick`을 추가해야 합니다. (interval을 한 번만 설정하려면 [onTick을 Effect Event로 만드세요.](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events))

**의존성 린트 오류는 컴파일 오류로 처리하는 것이 좋습니다. 이를 억제하지 않으면 이와 같은 버그가 발생하지 않습니다.** 이 페이지의 나머지 부분에서는 이 경우와 다른 경우에 대한 대안을 설명합니다.

</DeepDive>

## 불필요한 의존성 제거하기 {/*removing-unnecessary-dependencies*/}

코드를 반영하기 위해 Effect의 의존성을 조정할 때마다 의존성 목록을 살펴보십시오. 이러한 의존성 중 하나라도 변경되면 Effect가 다시 실행되는 것이 합리적일까요? 가끔 대답은 "아니오"입니다.

* 다른 조건에서 Effect의 *다른 부분*을 다시 실행하고 싶을 수도 있습니다.
* 일부 의존성의 변경에 "반응"하지 않고 "최신 값"만 읽고 싶을 수도 있습니다.
* 의존성은 객체나 함수이기 때문에 *의도치 않게* 너무 자주 변경될 수 있습니다.

올바른 해결책을 찾으려면 Effect에 대한 몇 가지 질문에 답해야 합니다. 몇 가지 질문을 살펴봅시다.

### 이 코드를 이벤트 핸들러로 옮겨야 하나요? {/*should-this-code-move-to-an-event-handler*/}

가장 먼저 고려해야 할 것은 이 코드가 Effect 되어야 하는지 여부입니다.

폼을 상상해 봅시다. 제출할 때 `submitted` State 변수를 `true`로 설정합니다. POST 요청을 보내고 알림을 표시해야 합니다. 이 로직은 `submitted`가 `true`가 될 때 "반응"하는 Effect 안에 넣었습니다.

```js {6-8}
function Form() {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) {
      // 🔴 Avoid: Event-specific logic inside an Effect
      post('/api/register');
      showNotification('Successfully registered!');
    }
  }, [submitted]);

  function handleSubmit() {
    setSubmitted(true);
  }

  // ...
}
```

나중에 현재 테마에 따라 알림 메시지의 스타일을 지정하고 싶으므로 현재 테마를 읽습니다. `theme`는 컴포넌트 본문에서 선언되었기때문에 이는 반응형 값이므로 의존성으로 추가합니다.

```js {3,9,11}
function Form() {
  const [submitted, setSubmitted] = useState(false);
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (submitted) {
      // 🔴 Avoid: Event-specific logic inside an Effect
      post('/api/register');
      showNotification('Successfully registered!', theme);
    }
  }, [submitted, theme]); // ✅ All dependencies declared

  function handleSubmit() {
    setSubmitted(true);
  }  

  // ...
}
```

이렇게 하면 버그가 발생하게 됩니다. 먼저 폼을 제출한 다음 어두운 테마와 밝은 테마 간 전환한다고 가정해 보겠습니다. `theme`이 변경되고 Effect가 다시 실행되어 동일한 알림이 다시 표시됩니다!

**여기서 문제는 이것이 애초에 Effect가 아니어야 한다는 점입니다.** 이 POST 요청을 보내고 특정 상호작용인 폼 제출에 대한 응답으로 알림을 표시하고 싶다는 것입니다. 특정 상호작용에 대한 응답으로 일부 코드를 실행하려면 해당 로직을 해당 이벤트 핸들러에 직접 넣어야 합니다.

```js {6-7}
function Form() {
  const theme = useContext(ThemeContext);

  function handleSubmit() {
    // ✅ Good: Event-specific logic is called from event handlers
    post('/api/register');
    showNotification('Successfully registered!', theme);
  }  

  // ...
}
```

이제 코드가 이벤트 핸들러에 있고, 이는 반응형 코드가 아니므로 사용자가 폼을 제출할 때만 실행됩니다. [이벤트 핸들러와 Effect 중에서 선택하는 방법](/learn/separating-events-from-effects#reactive-values-and-reactive-logic)과 [불필요한 Effect를 삭제하는 방법](/learn/you-might-not-need-an-effect)에 대해 자세히 알아보세요.

### Effect 가 관련 없는 여러 가지 작업을 수행하나요? {/*is-your-effect-doing-several-unrelated-things*/}

다음으로 스스로에게 물어봐야 할 질문은 Effect가 서로 관련이 없는 여러 가지 작업을 수행하고 있는지 여부입니다.

사용자가 도시와 지역을 선택해야 하는 배송 폼을 만든다고 가정해 보겠습니다. 선택한 `country`에 따라 서버에서 `cities` 목록을 가져와 드롭다운에 표시합니다.

```js
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  const [city, setCity] = useState(null);

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
  }, [country]); // ✅ All dependencies declared

  // ...
```

[Effect에서 데이터를 페칭하는](/learn/you-might-not-need-an-effect#fetching-data) 좋은 예시입니다. `country` props에 따라 `cities` State를 네트워크와 동기화하고 있습니다. `ShippingForm`이 표시되는 즉시 그리고 `country`가 변경될 때마다 (어떤 상호작용이 원인이든 상관없이) 데이터를 가져와야 하므로 이벤트 핸들러에서는 이 작업을 수행할 수 없습니다.

이제 도시 지역에 대한 두 번째 셀렉트박스를 추가하여 현재 선택된 `city`의 `areas`을 가져온다고 가정해 보겠습니다. 동일한 Effect 내에 지역 목록에 대한 두 번째 `fetch` 호출을 추가하는 것으로 시작할 수 있습니다.

```js {15-24,28}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);

  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    // 🔴 Avoid: A single Effect synchronizes two independent processes
    if (city) {
      fetch(`/api/areas?city=${city}`)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setAreas(json);
          }
        });
    }
    return () => {
      ignore = true;
    };
  }, [country, city]); // ✅ All dependencies declared

  // ...
```

하지만 이제 Effect가 `city` State 변수를 사용하므로 의존성 목록에 `city`를 추가해야 했습니다. 이로 인해 사용자가 다른 도시를 선택하면 Effect가 다시 실행되어 `fetchCities(country)`를 호출하는 문제가 발생했습니다. 결과적으로 불필요하게 도시 목록을 여러 번 다시 가져오게 됩니다.

**이 코드의 문제점은 서로 관련이 없는 두 가지를 동기화하고 있다는 것입니다.**

1. `country` props를 기반으로 `cities` State를 네트워크에 동기화하려고 합니다.
2. `city` State를 기반으로 `areas` State를 네트워크에 동기화하려고 합니다.

로직을 두 개의 Effect로 분할하고, 각 Effect는 동기화해야 하는 props즈에 반응합니다.


```js {19-33}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
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
  }, [country]); // ✅ All dependencies declared

  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);
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
  }, [city]); // ✅ All dependencies declared

  // ...
```

이제 첫 번째 Effect는 `country`가 변경될 때만 다시 실행되고, 두 번째 Effect는 `city`가 변경될 때 다시 실행됩니다. 목적에 따라 분리했으니, 서로 다른 두 가지가 두 개의 개별 Effect에 의해 동기화됩니다. 두 개의 개별 Effect에는 두 개의 개별 의존성 목록이 있으므로 의도치 않게 서로를 트리거하지 않습니다.

최종 코드는 원본보다 길지만 Effect를 분할하는 것이 여전히 정확합니다. [각 Effect는 독립적인 동기화 프로세스를 나타내야 합니다.](/learn/lifecycle-of-reactive-effects#each-effect-represents-a-separate-synchronization-process) 이 예시에서는 한 Effect를 삭제해도 다른 Effect의 로직이 깨지지 않습니다. 즉, *서로 다른 것을 동기화*하므로 분할하는 것이 좋습니다. [중복이 걱정된다면 반복되는 로직을 커스텀 훅으로 추출](/learn/reusing-logic-with-custom-hooks#when-to-use-custom-hooks)하여 이 코드를 개선할 수 있습니다.

### 다음 State를 계산하기 위해 어떤 State를 읽고 있나요? {/*are-you-reading-some-state-to-calculate-the-next-state*/}

이 Effect는 새 메시지가 도착할 때마다 새로 생성된 배열로 `messages` State 변수를 업데이트합니다.

```js {2,6-8}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages([...messages, receivedMessage]);
    });
    // ...
```

`messages` 변수를 사용하여 모든 기존 메시지로 시작하는 [새 배열을 생성](/learn/updating-arrays-in-state)하고 마지막에 새 메시지를 추가합니다. 하지만 `messages`는 Effect에서 읽는 반응형 값이므로 의존성이어야 합니다.

```js {7,10}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages([...messages, receivedMessage]);
    });
    return () => connection.disconnect();
  }, [roomId, messages]); // ✅ All dependencies declared
  // ...
```

그리고 `messages`를 의존성으로 만들면 문제가 발생합니다.

메시지를 수신할 때마다 `setMessages()`는 컴포넌트가 수신된 메시지를 포함하는 새 `messages` 배열로 재렌더링하도록 합니다. 하지만 이 Effect는 이제 `messages`에 따라 달라지므로 Effect도 다시 동기화됩니다. 따라서 새 메시지가 올 때마다 채팅이 다시 연결됩니다. 사용자가 원하지 않을 것입니다!

이 문제를 해결하려면 Effect 내에서 `messages`를 읽지 마세요. 대신 [업데이터 함수](/reference/react/useState#updating-state-based-on-the-previous-state)를 `setMessages`에 전달하세요:

```js {7,10}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

**이제 Effect가 `messages` 변수를 전혀 읽지 않는 것을 알 수 있습니다.** `msgs => [...msgs, receivedMessage]`와 같은 업데이터 함수만 전달하면 됩니다. React는 [업데이터 함수를 대기열에 넣고](/learn/queueing-a-series-of-state-updates) 다음 렌더링 중에 `msgs` 인수를 제공합니다. 이 때문에 Effect 자체는 더 이상 `messages`에 의존할 필요가 없습니다. 이 수정으로 인해 채팅 메시지를 수신해도 더 이상 채팅이 다시 연결되지 않습니다.

### 값의 변경에 '반응'하지 않고 값을 읽고 싶으신가요? {/*do-you-want-to-read-a-value-without-reacting-to-its-changes*/}

<Wip>

이 섹션에서는 아직 안정된 버전의 React로 **출시되지 않은 실험적인 API**에 대해 설명합니다.

</Wip>

사용자가 새 메시지를 수신할 때 `isMuted`가 `true`가 아닌 경우 사운드를 재생하고 싶다고 가정해 보겠습니다.

```js {3,10-12}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
      if (!isMuted) {
        playSound();
      }
    });
    // ...
```

이제 Effect의 코드에서 `isMuted`를 사용하므로 의존성에 추가해야 합니다.

```js {10,15}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
      if (!isMuted) {
        playSound();
      }
    });
    return () => connection.disconnect();
  }, [roomId, isMuted]); // ✅ All dependencies declared
  // ...
```

문제는 (사용자가 `isMuted` 토글을 누르는 등) `isMuted`가 변경될 때마다 Effect가 다시 동기화되고 채팅에 다시 연결된다는 점입니다. 이는 바람직한 사용자 경험이 아닙니다! (이 예시에서는 린터를 비활성화해도 작동하지 않습니다. 그렇게 하면 `isMuted`가 이전 값으로 '고착'됩니다.)

이 문제를 해결하려면 Effect에서 반응해서는 안 되는 로직을 추출해야 합니다. 이 Effect가 `isMuted`의 변경에 "반응"하지 않기를 원합니다. [이 비반응 로직을 Effect 이벤트로 옮기면 됩니다](/learn/separating-events-from-effects#declaring-an-effect-event):

```js {1,7-12,18,21}
import { useState, useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  const onMessage = useEffectEvent(receivedMessage => {
    setMessages(msgs => [...msgs, receivedMessage]);
    if (!isMuted) {
      playSound();
    }
  });

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

Effect 이벤트를 사용하면 Effect를 반응형 부분(`roomId`와 같은 반응형 값과 그 변경에 "반응"해야 하는)과 비반응형 부분(`onMessage`가 `isMuted`를 읽는 것처럼 최신 값만 읽는)으로 나눌 수 있습니다. **이제 Effect 이벤트 내에서 `isMuted`를 읽었으므로 Effect의 의존성이 될 필요가 없습니다.** 그 결과, "Muted" 설정을 켜고 끌 때 채팅이 다시 연결되지 않아 원래 문제가 해결되었습니다!

#### props를 이벤트 핸들러로 감싸기 {/*wrapping-an-event-handler-from-the-props*/}

컴포넌트가 이벤트 핸들러를 props로 받을 때 비슷한 문제가 발생할 수 있습니다.

```js {1,8,11}
function ChatRoom({ roomId, onReceiveMessage }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onReceiveMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId, onReceiveMessage]); // ✅ All dependencies declared
  // ...
```

부모 컴포넌트가 렌더링할 때마다 *다른* `onReceiveMessage` 함수를 전달한다고 가정해 보겠습니다.

```js {3-5}
<ChatRoom
  roomId={roomId}
  onReceiveMessage={receivedMessage => {
    // ...
  }}
/>
```

`onReceiveMessage`는 의존성이므로 부모가 재렌더링할 때마다 Effect가 다시 동기화됩니다. 그러면 채팅에 다시 연결됩니다. 이 문제를 해결하려면 호출을 Effect 이벤트로 감싸세요:

```js {4-6,12,15}
function ChatRoom({ roomId, onReceiveMessage }) {
  const [messages, setMessages] = useState([]);

  const onMessage = useEffectEvent(receivedMessage => {
    onReceiveMessage(receivedMessage);
  });

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

Effect 이벤트는 반응하지 않으므로 의존성으로 지정할 필요가 없습니다. 그 결과, 부모 컴포넌트가 재렌더링할 때마다 다른 함수를 전달하더라도 채팅이 더 이상 다시 연결되지 않습니다.

#### 반응형 코드와 비반응형 코드 분리 {/*separating-reactive-and-non-reactive-code*/}

이 예시에서는 `roomId`가 변경될 때마다 방문을 기록하려고 합니다. 모든 로그에 현재 `notificationCount`를 포함하고 싶지만 `notificationCount` 변경으로 로그 이벤트가 촉발하는 것은 원하지 않습니다.

해결책은 다시 비반응형 코드를 Effect 이벤트로 분리하는 것입니다.

```js {2-4,7}
function Chat({ roomId, notificationCount }) {
  const onVisit = useEffectEvent(visitedRoomId => {
    logVisit(visitedRoomId, notificationCount);
  });

  useEffect(() => {
    onVisit(roomId);
  }, [roomId]); // ✅ All dependencies declared
  // ...
}
```

로직이 `roomId`와 관련하여 반응하기를 원하므로 Effect 내부에서 `roomId`를 읽습니다. 그러나 `notificationCount`를 변경하여 추가 방문을 기록하는 것은 원하지 않으므로 Effect 이벤트 내부에서 `notificationCount`를 읽습니다. [Effect 이벤트를 사용하여 Effect에서 최신 props와 State를 읽는 방법에 대해 자세히 알아보세요.](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events)

### 일부 반응형 값이 의도치 않게 변경되나요? {/*does-some-reactive-value-change-unintentionally*/}

Effect가 특정 값에 '반응'하기를 원하지만, 그 값이 원하는 것보다 더 자주 변경되어 사용자의 관점에서 실제 변경 사항을 반영하지 못할 수도 있습니다. 예를 들어 컴포넌트 본문에 `options` 객체를 생성한 다음 Effect 내부에서 해당 객체를 읽는다고 가정해 보겠습니다.

```js {3-6,9}
function ChatRoom({ roomId }) {
  // ...
  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    // ...
```

이 객체는 컴포넌트 본문에서 선언되므로 [반응형 값](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values)입니다. Effect 내에서 이와 같은 반응형 값을 읽으면 의존성으로 선언합니다. 이렇게 하면 Effect가 변경 사항에 "반응"하게 됩니다.

```js {3,6}
  // ...
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ All dependencies declared
  // ...
```

의존성으로 선언하는 것이 중요합니다! 이렇게 하면 예를 들어 `roomId`가 변경되면 Effect가 새 `options`으로 채팅에 다시 연결됩니다. 하지만 위 코드에도 문제가 있습니다. 이를 확인하려면 아래 샌드박스의 인풋에 타이핑하고 콘솔에서 어떤 일이 발생하는지 살펴보세요:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // Temporarily disable the linter to demonstrate the problem
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

```js chat.js
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

위의 샌드박스에서 입력은 `message` State 변수만 업데이트합니다. 사용자 입장에서는 이것이 채팅 연결에 영향을 미치지 않아야 합니다. 하지만 `message`를 업데이트할 때마다 컴포넌트가 재렌더링됩니다. 컴포넌트가 재렌더링되면 그 안에 있는 코드가 처음부터 다시 실행됩니다.

`ChatRoom` 컴포넌트를 재렌더링할 때마다 새로운 `options` 객체가 처음부터 새로 생성됩니다. React는 `options` 객체가 마지막 렌더링 중에 생성된 `options` 객체와 *다른 객체*임을 인식합니다. 그렇기 때문에 (`options`에 따라 달라지는) Effect를 다시 동기화하고 사용자가 입력할 때 채팅이 다시 연결됩니다.

**이 문제는 객체와 함수에만 영향을 줍니다. 자바스크립트에서는 새로 생성된 객체와 함수가 다른 모든 객체와 구별되는 것으로 간주됩니다. 그 안의 내용이 동일할 수 있다는 것은 중요하지 않습니다!**

```js {7-8}
// During the first render
const options1 = { serverUrl: 'https://localhost:1234', roomId: 'music' };

// During the next render
const options2 = { serverUrl: 'https://localhost:1234', roomId: 'music' };

// These are two different objects!
console.log(Object.is(options1, options2)); // false
```

**객체 및 함수 의존성으로 인해 Effect가 필요 이상으로 자주 재동기화될 수 있습니다.**

그렇기 때문에 가능하면 객체와 함수를 Effect의 의존성으로 사용하지 않는 것이 좋습니다. 대신 컴포넌트 외부나 Effect 내부로 이동하거나 원시 값을 추출해 보세요.

#### 정적 객체와 함수를 컴포넌트 외부로 이동 {/*move-static-objects-and-functions-outside-your-component*/}

객체가 프롶티 및 State에 의존하지 않는 경우 해당 객체를 컴포넌트 외부로 이동할 수 있습니다.

```js {1-4,13}
const options = {
  serverUrl: 'https://localhost:1234',
  roomId: 'music'
};

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ All dependencies declared
  // ...
```

이렇게 하면 린터가 반응하지 않는다는 것을 증명할 수 있습니다. 재렌더링의 결과로 변경될 수 없으므로 의존성이 될 필요가 없습니다. 이제 `ChatRoom`을 재렌더링해도 Effect가 다시 동기화되지 않습니다.

이는 함수에도 적용됩니다.

```js {1-6,12}
function createOptions() {
  return {
    serverUrl: 'https://localhost:1234',
    roomId: 'music'
  };
}

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ All dependencies declared
  // ...
```

`createOptions`는 컴포넌트 외부에서 선언되므로 반응형 값이 아닙니다. 그렇기 때문에 Effect의 의존성에 지정할 필요가 없으며, Effect가 다시 동기화되지 않는 이유이기도 합니다.

#### Effect 내에서 동적 객체 및 함수 이동 {/*move-dynamic-objects-and-functions-inside-your-effect*/}

객체가 `roomId` props처럼 재렌더링의 결과로 변경될 수 있는 반응형 값에 의존하는 경우, 컴포넌트 외부로 끌어낼 수 없습니다. 하지만 Effect의 코드 *내부*로 이동시킬 수는 있습니다.

```js {7-10,11,14}
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
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

이제 `options`이 Effect 내부에서 선언되었으므로 더 이상 Effect의 의존성이 아닙니다. 대신 Effect에서 사용하는 유일한 반응형 값은 `roomId`입니다. `roomId`는 객체나 함수가 아니기 때문에 의도치 않게 달라지지 않을 것이라고 확신할 수 있습니다. 자바스크립트에서 숫자와 문자열은 그 내용에 따라 비교됩니다.

```js {7-8}
// During the first render
const roomId1 = 'music';

// During the next render
const roomId2 = 'music';

// These two strings are the same!
console.log(Object.is(roomId1, roomId2)); // true
```

이 수정 덕분에 입력을 수정해도 더 이상 채팅이 다시 연결되지 않습니다.

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

```js chat.js
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

그러나 예상대로 `roomId` 드롭다운을 변경하면 다시 연결됩니다.

이는 함수에서도 마찬가지입니다.

```js {7-12,14}
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
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

Effect 내에서 로직을 그룹화하기 위해 자신만의 함수를 작성할 수 있습니다. Effect 내부에서 선언하는 한, 반응형 값이 아니므로 Effect의 의존성이 될 필요가 없습니다.

#### 객체에서 원시 값 읽기 {/*read-primitive-values-from-objects*/}

가끔 props에서 객체를 받을 수도 있습니다.

```js {1,5,8}
function ChatRoom({ options }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ All dependencies declared
  // ...
```

렌더링 중에 부모 컴포넌트가 객체를 생성한다는 점이 위험합니다.

```js {3-6}
<ChatRoom
  roomId={roomId}
  options={{
    serverUrl: serverUrl,
    roomId: roomId
  }}
/>
```

이렇게 하면 부모 컴포넌트가 재렌더링할 때마다 Effect가 다시 연결됩니다. 이 문제를 해결하려면 Effect 외부의 객체에서 정보를 읽고 객체 및 함수 의존성을 피하십시오:

```js {4,7-8,12}
function ChatRoom({ options }) {
  const [message, setMessage] = useState('');

  const { roomId, serverUrl } = options;
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ All dependencies declared
  // ...
```

로직은 약간 반복적입니다 (Effect 외부의 객체에서 일부 값을 읽은 다음 Effect 내부에 동일한 값을 가진 객체를 만듭니다). 하지만 Effect가 실제로 어떤 정보에 의존하는지 매우 명확하게 알 수 있습니다. 부모 컴포넌트에 의해 의도치 않게 객체가 다시 생성된 경우 채팅이 다시 연결되지 않습니다. 하지만 `options.roomId` 또는 `options.serverUrl`이 실제로 다른 경우 채팅이 다시 연결됩니다.

#### 함수에서 원시값 계산 {/*calculate-primitive-values-from-functions*/}

함수에 대해서도 동일한 접근 방식을 사용할 수 있습니다. 예를 들어 부모 컴포넌트가 함수를 전달한다고 가정해 보겠습니다.

```js {3-8}
<ChatRoom
  roomId={roomId}
  getOptions={() => {
    return {
      serverUrl: serverUrl,
      roomId: roomId
    };
  }}
/>
```

의존성을 만들지 않으려면 (그리고 재렌더링할 때 다시 연결되는 것을 방지하려면) Effect 외부에서 호출하세요. 이렇게 하면 객체가 아니며 Effect 내부에서 읽을 수 있는 `roomId` 및 `serverUrl` 값을 얻을 수 있습니다.

```js {1,4}
function ChatRoom({ getOptions }) {
  const [message, setMessage] = useState('');

  const { roomId, serverUrl } = getOptions();
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ All dependencies declared
  // ...
```

이는 렌더링 중에 호출해도 안전하므로 [순수](/learn/keeping-components-pure) 함수에서만 작동합니다. 함수가 이벤트 핸들러이지만 변경 사항으로 인해 Effect가 다시 동기화되는 것을 원하지 않는 경우, [대신 Effect 이벤트로 함수를 감싸세요.](#do-you-want-to-read-a-value-without-reacting-to-its-changes)

<Recap>

- 의존성은 항상 코드와 일치해야 합니다.
- 의존성이 마음에 들지 않으면 코드를 수정해야 합니다.
- 린터를 억제하면 매우 혼란스러운 버그가 발생하므로 항상 피해야 합니다.
- 의존성을 제거하려면 해당 의존성이 필요하지 않다는 것을 린터에게 "증명"해야 합니다.
- 특정 상호작용에 대한 응답으로 일부 코드가 실행되어야 하는 경우 해당 코드를 이벤트 핸들러로 이동하세요.
- Effect의 다른 부분이 다른 이유로 다시 실행되어야 하는 경우 여러 개의 Effect로 분할하세요.
- 이전 State를 기반으로 일부 State를 업데이트하려면 업데이터 함수를 전달하세요.
- "반응"하지 않고 최신 값을 읽으려면 Effect에서 Effect 이벤트를 추출하세요.
- 자바스크립트에서 객체와 함수는 서로 다른 시간에 생성된 경우 서로 다른 것으로 간주됩니다.
- 객체와 함수의 의존성을 피하세요. 컴포넌트 외부나 Effect 내부로 이동하세요.

</Recap>

<Challenges>

#### 인터벌 초기화 수정하기 {/*fix-a-resetting-interval*/}

이 Effect는 매초마다 증가되는 인터벌을 설정합니다. 이상한 일이 발생하는 것을 발견했습니다. 인터벌이 증가될 때마다 인터벌이 파괴되고 다시 생성되는 것 같습니다. 인터벌이 계속 다시 생성되지 않도록 코드를 수정하세요.

<Hint>

이 Effect 코드가 `count`에 의존하는 것 같습니다. 이 의존성이 필요하지 않은 방법이 있을까요? 해당 값에 의존성을 추가하지 않고 이전 값을 기반으로 `count` State를 업데이트하는 방법이 있을 것입니다.

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('✅ Creating an interval');
    const id = setInterval(() => {
      console.log('⏰ Interval tick');
      setCount(count + 1);
    }, 1000);
    return () => {
      console.log('❌ Clearing an interval');
      clearInterval(id);
    };
  }, [count]);

  return <h1>Counter: {count}</h1>
}
```

</Sandpack>

<Solution>

Effect 내부에서 `count` State를 `count + 1`로 업데이트하고 싶습니다. 그러나 이렇게 하면 Effect가 틱할 때마다 변경되는 `count`에 의존하게되므로 매 틱마다 인터벌이 다시 만들어집니다.

이 문제를 해결하려면 [업데이터 함수](/reference/react/useState#updating-state-based-on-the-previous-state)를 사용하여 `setCount(count + 1)` 대신 `setCount(c => c + 1)`를 작성합니다.

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('✅ Creating an interval');
    const id = setInterval(() => {
      console.log('⏰ Interval tick');
      setCount(c => c + 1);
    }, 1000);
    return () => {
      console.log('❌ Clearing an interval');
      clearInterval(id);
    };
  }, []);

  return <h1>Counter: {count}</h1>
}
```

</Sandpack>

Effect 내부에서 `count`를 읽는 대신 `c => c + 1` 명령어("이 숫자를 증가시켜라!")를 React에 전달합니다. React는 다음 렌더링에 이를 적용합니다. 그리고 Effect 내부에서 `count` 값을 더 이상 읽을 필요가 없으므로 Effect의 의존성을 비워둘 수 있습니다(`[]`). 이렇게 하면 매 틱마다 Effect가 인터벌을 다시 생성하지 않아도 됩니다.

</Solution>

#### 애니메이션을 다시 촉발하는 현상 고치기 {/*fix-a-retriggering-animation*/}

이 예시에서는 "Show"를 누르면 환영 메시지가 페이드인 합니다. 애니메이션은 1초 정도 걸립니다."Remove"를 누르면 환영 메시지가 즉시 사라집니다. 페이드인 애니메이션의 로직은 `animation.js` 파일에서 일반 자바스크립트 애니메이션 루프로 구현됩니다. 이 로직을 변경할 필요는 없습니다. 서드파티 라이브러리로 처리하면 됩니다. Effect는 돔 노드에 대한 `FadeInAnimation` 인스턴스를 생성한 다음 `start(duration)` 또는 `stop()`을 호출하여 애니메이션을 제어합니다. `duration`은 슬라이더로 제어합니다. 슬라이더를 조정하여 애니메이션이 어떻게 변하는지 확인하세요.

이 코드는 이미 작동하지만 변경하고 싶은 부분이 있습니다. 현재 `duration` State 변수를 제어하는 슬라이더를 움직이면 애니메이션이 다시 촉발됩니다. Effect가 `duration` 변수에 "반응"하지 않도록 동작을 변경하세요. "Show"를 누르면 Effect는 슬라이더의 현재 `duration을` 사용해야 합니다. 그러나 슬라이더를 움직이는 것만으로 애니메이션이 다시 촉발되어서는 안 됩니다.

<Hint>

Effect 안에 반응성이 없어야 하는 코드가 있나요? 비반응형 코드를 Effect 밖으로 옮기려면 어떻게 해야 하나요?

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
import { useState, useEffect, useRef } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { FadeInAnimation } from './animation.js';

function Welcome({ duration }) {
  const ref = useRef(null);

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(duration);
    return () => {
      animation.stop();
    };
  }, [duration]);

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
  const [duration, setDuration] = useState(1000);
  const [show, setShow] = useState(false);

  return (
    <>
      <label>
        <input
          type="range"
          min="100"
          max="3000"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
        />
        <br />
        Fade in duration: {duration} ms
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome duration={duration} />}
    </>
  );
}
```

```js animation.js
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

<Solution>

Effect는 `duration`의 최신 값을 읽어야 하지만, `duration`의 변화에 "반응"하지 않기를 원합니다. 애니메이션을 시작하기 위해 `duration`을 사용하지만 애니메이션이 시작해도 반응하지 않습니다. 반응하지 않는 코드를 추출하고 Effect에서 해당 함수를 호출합니다.

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
import { useState, useEffect, useRef } from 'react';
import { FadeInAnimation } from './animation.js';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

function Welcome({ duration }) {
  const ref = useRef(null);

  const onAppear = useEffectEvent(animation => {
    animation.start(duration);
  });

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    onAppear(animation);
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
  const [duration, setDuration] = useState(1000);
  const [show, setShow] = useState(false);

  return (
    <>
      <label>
        <input
          type="range"
          min="100"
          max="3000"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
        />
        <br />
        Fade in duration: {duration} ms
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome duration={duration} />}
    </>
  );
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

`onAppear`와 같은 Effect 이벤트는 반응형 이벤트가 아니므로 애니메이션을 다시 촉발시키지 않고도 내부의 `duration`을 읽을 수 있습니다.

</Solution>

#### 채팅 재연결 문제 해결하기 {/*fix-a-reconnecting-chat*/}

이 예시에서는 'Toggle theme'을 누를 때마다 채팅이 다시 연결됩니다. 왜 이런 일이 발생하나요? 서버 URL을 편집하거나 다른 채팅방을 선택할 때만 채팅이 다시 연결되도록 실수를 수정하세요.

`chat.js`를 외부 서드파티 라이브러리로 취급하여 API를 확인하기 위해 참조할 수는 있지만 편집해서는 안됩니다.

<Hint>

이 문제를 해결하는 방법은 여러 가지가 있지만 궁극적으로 객체를 의존성으로 사용하지 않으려는 것입니다.

</Hint>

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle theme
      </button>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
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
      <ChatRoom options={options} />
    </div>
  );
}
```

```js ChatRoom.js active
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ options }) {
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

  return <h1>Welcome to the {options.roomId} room!</h1>;
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
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

<Solution>

Effect가 `options` 객체에 의존하기 때문에 다시 실행되고 있습니다. 객체는 의도치 않게 다시 생성될 수 있으므로 가능하면 Effect의 의존성 요소로 지정하지 않도록 해야 합니다.

<<<<<<< HEAD
가장 덜 공격적인 수정 방법은 Effect 외부에서 `roomId`와 `serverUrl`을 읽은 다음 Effect가 이러한 기본 값에 의존하도록 만드는 것입니다(의도치 않게 변경할 수 없음). Effect 내부에서 객체를 생성하면 `createConnection`으로 전달됩니다.
=======
The least invasive fix is to read `roomId` and `serverUrl` right outside the Effect, and then make the Effect depend on those primitive values (which can't change unintentionally). Inside the Effect, create an object and pass it to `createConnection`:
>>>>>>> 68f417a600c7d7b8c4131e39f8a843a856ae3909

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle theme
      </button>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
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
      <ChatRoom options={options} />
    </div>
  );
}
```

```js ChatRoom.js active
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ options }) {
  const { roomId, serverUrl } = options;
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return <h1>Welcome to the {options.roomId} room!</h1>;
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
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

객체의 `options` props를 보다 구체적인 `roomId` 및 `serverUrl` props로 대체하는 것이 더 좋을 것입니다.

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle theme
      </button>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
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
        serverUrl={serverUrl}
      />
    </div>
  );
}
```

```js ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ roomId, serverUrl }) {
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return <h1>Welcome to the {roomId} room!</h1>;
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
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

가능하면 원시 props를 사용하면 나중에 컴포넌트를 더 쉽게 최적화할 수 있습니다.

</Solution>

#### 다시, 채팅 재연결 문제 수정하기 {/*fix-a-reconnecting-chat-again*/}

이 예시는 암호화 여부와 상관없이 채팅에 연결됩니다. 체크박스를 토글하면 암호화가 켜져 있을 때와 꺼져 있을 때 콘솔에 표시되는 메시지가 달라지는 것을 확인할 수 있습니다. 채팅방을 변경해 보세요. 그런 다음 테마를 토글해 보세요. 채팅방에 연결되면 몇 초마다 새 메시지를 받게 됩니다. 메시지의 색상이 선택한 테마와 일치하는지 확인하세요.

이 예시에서는 테마를 변경하려고 할 때마다 채팅이 다시 연결됩니다. 이 문제를 수정하세요. 수정 후 테마를 변경해도 채팅이 다시 연결되지 않지만, 암호화 설정을 토글하거나 채팅방을 변경하면 다시 연결됩니다.

`chat.js`의 코드를 변경하지 마세요. 그 외에는 동일한 동작을 초래하는 한 어떤 코드든 변경할 수 있습니다. 예를 들어 어떤 props가 전달되는지를 확인하고 변경하는 것이 도움이 될 수 있습니다.

<Hint>

두 개의 함수를 전달하고 있습니다. `onMessage`와 `createConnection`입니다. 이 두 함수는 `App`이 다시 렌더링할 때마다 처음부터 새로 생성됩니다. 매번 새로운 값으로 간주되기 때문에 Effect를 다시 촉발시킵니다.

이러한 함수 중 하나가 이벤트 핸들러입니다. 이벤트 핸들러 함수의 새 값에 '반응'하지 않고 이벤트 핸들러를 Effect로 호출하는 방법을 알고 계신가요? 유용할 것 같습니다!

이러한 함수 중 다른 함수는 가져온 API 메서드에 일부 State를 전달하기 위해서만 존재합니다. 이 함수가 정말 필요한가요? 전달되는 필수 정보는 무엇인가요? 일부 import를 `App.js`에서 `ChatRoom.js`로 옮겨야 할 수도 있습니다.

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

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';
import { showNotification } from './notifications.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
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
        onMessage={msg => {
          showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
        }}
        createConnection={() => {
          const options = {
            serverUrl: 'https://localhost:1234',
            roomId: roomId
          };
          if (isEncrypted) {
            return createEncryptedConnection(options);
          } else {
            return createUnencryptedConnection(options);
          }
        }}
      />
    </>
  );
}
```

```js ChatRoom.js active
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function ChatRoom({ roomId, createConnection, onMessage }) {
  useEffect(() => {
    const connection = createConnection();
    connection.on('message', (msg) => onMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [createConnection, onMessage]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js chat.js
export function createEncryptedConnection({ serverUrl, roomId }) {
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
      console.log('✅ 🔐 Connecting to "' + roomId + '" room... (encrypted)');
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
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
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

export function createUnencryptedConnection({ serverUrl, roomId }) {
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
      console.log('✅ Connecting to "' + roomId + '" room (unencrypted)...');
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
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
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
label, button { display: block; margin-bottom: 5px; }
```

</Sandpack>

<Solution>

이 문제를 해결하는 올바른 방법은 여러 가지가 있는데, 그 중 한 가지 해결책을 소개합니다.

원래 예시에서는 테마를 변경하면 다른 `onMessage` 및 `createConnection` 함수가 생성되어 전달되었습니다. Effect가 이러한 함수에 의존했기 때문에 테마를 전환할 때마다 채팅이 다시 연결되었습니다.

`message`의 문제를 해결하려면 `onMessage`를 Effect 이벤트로 감싸야 했습니다.

```js {1,2,6}
export default function ChatRoom({ roomId, createConnection, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    // ...
```

`onMessage` props와 달리 `onReceiveMessage` Effect 이벤트는 반응하지 않습니다. 그렇기 때문에 Effect의 의존성이 될 필요가 없습니다. 따라서 `onMessage`를 변경해도 채팅이 다시 연결되지 않습니다.

반응형이어야 하기 때문에 `createConnection`으로는 동일한 작업을 수행할 수 없습니다. 사용자가 암호화 연결과 비암호화 연결 사이를 전환하거나 사용자가 현재 방을 전환하면 Effect가 다시 촉발되기를 원합니다. 하지만 `createConnection`은 함수이기 때문에 이 함수가 읽는 정보가 실제로 변경되었는지 여부를 확인할 수 없습니다. 이 문제를 해결하려면 `App` 컴포넌트에서 `createConnection`을 전달하는 대신 원시값인 `roomId` 및 `isEncrypted`를 전달하세요:

```js {2-3}
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
        onMessage={msg => {
          showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
        }}
      />
```

이제 `App`에서 전달하지 않고 Effect 내부로 `createConnection` 함수를 옮길 수 있습니다.

```js {1-4,6,10-20}
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
      if (isEncrypted) {
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }
    // ...
```

이 두 가지 변경 사항 이후에는 Effect가 더 이상 함수 값에 의존하지 않습니다.

```js {1,8,10,21}
export default function ChatRoom({ roomId, isEncrypted, onMessage }) { // Reactive values
  const onReceiveMessage = useEffectEvent(onMessage); // Not reactive

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId // Reading a reactive value
      };
      if (isEncrypted) { // Reading a reactive value
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }

    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]); // ✅ All dependencies declared
```

그 결과, 의미 있는 정보(`roomId` 또는 `isEncrypted`)가 변경될 때만 채팅이 다시 연결됩니다.

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

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

import { showNotification } from './notifications.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
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
        isEncrypted={isEncrypted}
        onMessage={msg => {
          showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
        }}
      />
    </>
  );
}
```

```js ChatRoom.js active
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
      if (isEncrypted) {
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }

    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js chat.js
export function createEncryptedConnection({ serverUrl, roomId }) {
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
      console.log('✅ 🔐 Connecting to "' + roomId + '" room... (encrypted)');
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
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
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

export function createUnencryptedConnection({ serverUrl, roomId }) {
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
      console.log('✅ Connecting to "' + roomId + '" room (unencrypted)...');
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
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
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
label, button { display: block; margin-bottom: 5px; }
```

</Sandpack>

</Solution>

</Challenges>
