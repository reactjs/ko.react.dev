---
title: 'Ref로 값 참조하기'
---

<Intro>

컴포넌트가 일부 정보를 "기억"하고 싶지만, 해당 정보가 [렌더링을 유발](/learn/render-and-commit)하지 않도록 하려면 *ref*를 사용하세요.

</Intro>

<YouWillLearn>

- 컴포넌트 ref를 어떻게 추가하는가
- ref의 값이 어떻게 업데이트되는가
- ref가 state와 어떻게 다른가
- ref를 어떻게 안전하게 사용할까

</YouWillLearn>

## 컴포넌트에 ref를 추가하기 {/*adding-a-ref-to-your-component*/}

React에서 `useRef` Hook을 가져와 컴포넌트에 ref를 추가할 수 있습니다.

```js
import { useRef } from 'react';
```

컴포넌트 내에서 `useRef` Hook을 호출하고 참조할 초깃값을 유일한 인자로 전달합니다. 예를 들어 다음은 값 `0`에 대한 ref 입니다.

```js
const ref = useRef(0);
```

`useRef` 는 다음과 같은 객체를 반환합니다.

```js
{
  current: 0 // useRef에 전달한 값 
}
```

<Illustration src="/images/docs/illustrations/i_ref.png" alt="An arrow with 'current' written on it stuffed into a pocket with 'ref' written on it." />

`ref.current` 프로퍼티를 통해 해당 ref의 current 값에 접근할 수 있습니다. 이 값은 의도적으로 변경할 수 있으므로 읽고 쓸 수 있습니다. React가 추적하지 않는 구성 요소의 비밀 주머니라 할 수 있습니다. (이것이 바로 React의 단방향 데이터 흐름에서 "escape hatch"가 되는 것입니다--아래에서 자세히 설명하고 있습니다!)

여기서 버튼은 클릭할 때마다 `ref.current`를 증가시킵니다.

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

ref는 숫자를 가리키지만, [state](/learn/state-a-components-memory)처럼 문자열, 객체, 심지어 함수 등 모든 것을 가리킬 수 있습니다. state와 달리 ref는 읽고 수정할 수 있는 `current` 프로퍼티를 가진 일반 자바스크립트 객체입니다.

**컴포넌트는 모든 증가에 대하여 다시 렌더링 되지 않습니다.** state와 마찬가지로 ref도 React에 리렌더에 의해 유지됩니다. 그러나, state를 설정하면 컴포넌트가 다시 렌더링 됩니다. ref를 변경하면 다시 렌더링 되지 않습니다!

## 예시: 스톱워치 작성하기 {/*example-building-a-stopwatch*/}

ref와 state를 단일 컴포넌트로 결합할 수 있습니다. 예를 들어 사용자가 버튼을 눌러 시작하거나 중지할 수 있는 스톱워치를 만들어봅시다. 사용자가 "시작"을 누른 후 시간이 얼마나 지났는지 표시하려면 시작 버튼을 누른 시기와 현재 시각을 추적해야 합니다. **이 정보는 렌더링에 사용되므로 state를 유지합니다.**

```js
const [startTime, setStartTime] = useState(null);
const [now, setNow] = useState(null);
```

사용자가 "시작"을 누르면 [`setInterval`](https://developer.mozilla.org/docs/Web/API/setInterval)을 사용하여 100밀리초마다 시간을 업데이트합니다.

<Sandpack>

```js
import { useState } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);

  function handleStart() {
    // 카운팅을 시작합니다.
    setStartTime(Date.now());
    setNow(Date.now());

    setInterval(() => {
      // 10ms 마다 현재 시간을 업데이트 합니다. 
      setNow(Date.now());
    }, 10);
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  return (
    <>
      <h1>Time passed: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>
        Start
      </button>
    </>
  );
}
```

</Sandpack>

"Stop" 버튼을 누르면 `now` state 변수의 업데이트를 중지하기 위해 기존 interval을 취소해야 합니다. 이를 위해 [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval)을 호출하면 됩니다. 그러나 이전에 사용자가 시작을 눌렀을 때 `setInterval` 호출로 반환된 interval ID를 제공해야 합니다. interval ID는 어딘가에 보관해야 합니다. **interval ID는 렌더링에 사용되지 않으므로 ref에 저장할 수 있습니다.**

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);
  const intervalRef = useRef(null);

  function handleStart() {
    setStartTime(Date.now());
    setNow(Date.now());

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 10);
  }

  function handleStop() {
    clearInterval(intervalRef.current);
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  return (
    <>
      <h1>Time passed: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>
        Start
      </button>
      <button onClick={handleStop}>
        Stop
      </button>
    </>
  );
}
```

</Sandpack>

렌더링에 정보를 사용할 때 해당 정보를 state로 유지합니다. event handler에게만 필요한 정보이고 변경이 일어날 때 리렌더가 필요하지 않다면, ref를 사용하는 것이 더 효율적일 수 있습니다.

## ref와 state의 차이 {/*differences-between-refs-and-state*/}

ref가 state보다 덜 "엄격한" 것으로 생각될 수 있습니다-예를 들어, 항상 state 설정 함수를 사용하지 않고 변경할 수 있습니다. 하지만 대부분은 state를 사용하고 싶을 것입니다. ref는 자주 필요하지 않은 "escape hatch"입니다. state와 ref를 비교한 것은 다음과 같습니다.

| refs                                                          | state                                                                                              |
|---------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| `useRef(initialValue)` 는 `{ current: initialValue }` 을 반환합니다. | `useState(initialValue)` 은 state 변수의 현재 값과 setter 함수 `[value, setValue]` 를 반환합니다.                  |
| state를 바꿔도 리렌더 되지 않습니다.                                       | state를 바꾸면 리렌더 됩니다.                                                                                |
| Mutable-렌더링 프로세스 외부에서 `current` 값을 수정 및 업데이트할 수 있습니다.         | "Immutable"—state 를 수정하기 위해서는 state 설정 함수를 반드시 사용하여 리렌더 대기열에 넣어야 합니다.                              |
| 렌더링 중에는 `current` 값을 읽거나 쓰면 안 됩니다.                            | 언제든지 state를 읽을 수 있습니다. 그러나 각 렌더마다 변경되지 않는 자체적인 state의 [snapshot](/learn/state-as-a-snapshot)이 있습니다. 

다음은 state와 함께 구현되는 카운터 버튼입니다.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      You clicked {count} times
    </button>
  );
}
```

</Sandpack>

`count` 값이 표시되므로 state 값을 사용하는 것이 타당합니다. 카운터의 값이 `setCount()`로 설정되면 React는 컴포넌트를 다시 렌더링하고 새 카운트를 반영하도록 화면이 업데이트됩니다.

이를 ref와 함께 구현하려고 하면 React는 컴포넌트를 다시 렌더링하지 않으므로 카운트가 변경되는 것을 볼 수 없습니다! 이 버튼을 클릭해도 **텍스트가 업데이트되지 않는** 방법을 확인해봅시다.

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let countRef = useRef(0);

  function handleClick() {
    // 이것은 컴포넌트의 리렌더를 일으키지 않습니다!
    countRef.current = countRef.current + 1;
  }

  return (
    <button onClick={handleClick}>
      You clicked {countRef.current} times
    </button>
  );
}
```

</Sandpack>

이것이 render 중에 `ref.current`를 출력하면 신뢰할 수 없는 코드가 나오는 이유입니다. 이 부분이 필요하면 state를 대신 사용해야 합니다..

<DeepDive>

#### useRef는 내부적으로 어떻게 동작하나요? {/*how-does-useref-work-inside*/}

`useState`와 `useRef`가 모두 React에 의해 제공되지만, 원칙적으로 `useRef`는 `useState` 위에 구현될 수 있습니다. React 내부에서 `useRef`가 이렇게 구현되는 것을 상상할 수 있습니다.

```js
// Inside of React
function useRef(initialValue) {
  const [ref, unused] = useState({ current: initialValue });
  return ref;
}
```

첫 번째 렌더 중에 `useRef`는 `{ current: initialValue }`을 반환합니다. 이 객체는 React에 의해 저장되므로 다음 렌더 중에 같은 객체가 반환됩니다. 이 예시에서는 state setter가 어떻게 사용되지 않는지 주의하세요. `useRef`는 항상 동일한 객체를 반환해야 하므로 필요하지 않습니다!

React는 `useRef`가 실제로 충분히 일반적이기 때문에 built-in 버전을 제공합니다. setter가 없는 일반적인 state 변수라고 생각할 수 있습니다. 객체 지향 프로그래밍에 익숙하다면 refs는 인스턴스 필드를 상기시킬 수 있습니다-하지만 `this.something` 대신에 `somethingRef.current` 처럼 써야 합니다.

</DeepDive>

## refs를 사용할 시기 {/*when-to-use-refs*/}

일반적으로 컴포넌트가 React를 "외부"와 외부 API--컴포넌트의 형태에 영향을 미치지 않는 브라우저 API 와 통신해야 할 때 ref를 사용합니다. 다음은 몇 가지 특별한 상황입니다.

- [timeout IDs](https://developer.mozilla.org/ko/docs/Web/API/setTimeout)를 저장
- [다음 페이지](/learn/manipulating-the-dom-with-refs)에서 다루는 [DOM 엘리먼트](https://developer.mozilla.org/ko/docs/Web/API/Element) 저장 및 조작
- JSX를 계산하는 데 필요하지 않은 다른 객체 저장

컴포넌트가 일부 값을 저장해야 하지만 렌더링 로직에 영향을 미치지 않는 경우, refs를 선택합니다.

## refs의 좋은 예시 {/*best-practices-for-refs*/}

다음 원칙을 따르면 컴포넌트를 보다 쉽게 예측할 수 있습니다.

- **refs를 escape hatch로 간주합니다.** Refs는 외부 시스템이나 브라우저 API로 작업할 때 유용합니다. 애플리케이션 로직과 데이터 흐름의 상당 부분이 refs에 의존한다면 접근 방식을 재고해 보는 것이 좋습니다.
- **렌더링 중에 `ref.current`를 읽거나 쓰지 마세요.** 렌더링 중에 일부 정보가 필요한 경우 [state](/learn/state-a-components-memory)를 대신 사용하세요. `ref.current`가 언제 변하는지 React는 모르기 때문에 렌더링할 때 읽어도 컴포넌트의 동작을 예측하기 어렵습니다. (`if (!ref.current) ref.current = new Thing()` 과 같은 코드는 첫 번째 렌더 중에 ref를 한 번만 설정하는 경우가 예외입니다.)

React state의 제한은 refs에 적용되지 않습니다. 예를 들어 state는 [모든 render에 대한 snapshot](/learn/state-as-a-snapshot) 및 [동기적으로 업데이트되지 않는 것](/learn/queue-a-series-the-updates)과 같이 작동합니다. 그러나 ref의 current 값을 변조하면 다음과 같이 즉시 변경됩니다.

```js
ref.current = 5;
console.log(ref.current); // 5
```

그 이유는 **ref 자체가 일반 자바스크립트 객체**처럼 동작하기 때문입니다.

또한 ref로 작업할 때 [mutation 방지](/learn/updating-objects-in-state)에 대해 걱정할 필요가 없습니다. 변형하는 객체가 렌더링에 사용되지 않는 한, React는 ref 혹은 해당 콘텐츠를 어떻게 처리하든 신경 쓰지 않습니다.

## Refs 와 DOM {/*refs-and-the-dom*/}

임의의 값을 ref로 지정할 수 있습니다. 그러나 ref의 가장 일반적인 사용 사례는 DOM 엘리먼트에 액세스하는 것입니다. 예를 들어 프로그래밍 방식으로 입력의 초점을 맞추려는 경우 유용합니다. `<div ref={myRef}>`와 같은 JSX의 `ref` 어트리뷰트에 ref를 전달하면 React는 해당 DOM 엘리먼트를 `myRef.current`에 넣습니다. 이에 대한 자세한 내용은 [Refs를 사용하여 DOM 조작](/learn/manipulating-the-dom-with-refs)에서 확인할 수 있습니다.

<Recap>

- Refs는 렌더링에 사용되지 않는 값을 고정하기 위한 escape hatch이며, 자주 필요하지는 않습니다.
- ref는 읽거나 설정할 수 있는 `current`라는 프로퍼티를 호출할 수 있는 자바스크립트 순수객체입니다.
- `useRef` Hook을 호출해 ref를 달라고 React에 요청할 수 있습니다.
- state와 마찬가지로 ref는 컴포넌트의 렌더링 간에 정보를 유지할 수 있습니다.
- state와 달리 ref의 `current` 값을 설정하면 리렌더가 트리거되지 않습니다.
- 렌더링 중에 `ref.current`를 읽거나 쓰지 마세요. 컴포넌트를 예측하기 어렵게 만듭니다.

</Recap>

<Challenges>

#### 정상적으로 동작하지 않는 채팅 입력창 수정 {/*fix-a-broken-chat-input*/}

메시지를 입력하고 "Send"를 클릭합니다. "Sent!" 경고창(alert)이 나타나기 전에 3초 정도 지연된다는 것을 알 수 있습니다. 이 지연된 시간 동안 "Undo" 버튼을 볼 수 있습니다. 누르세요. 이 "Undo" 버튼은 "Sent!" 메시지가 나타나지 않도록 합니다. `handleSend` 중 저장된 timeout ID에 대해 [`clearTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/clearTimeout)을 호출하면 됩니다. 그러나 "Undo"를 클릭한 후에도 "Sent!" 메시지가 계속 나타납니다. 왜 작동이 되지 않는지 찾아서 고쳐봅시다.

<Hint>

모든 렌더에서 컴포넌트를 처음부터 실행(및 변수를 초기화)하기 때문에 `let timeoutID`와 같은 regular 변수는 렌더와 리렌더 사이에 "존재"하지 않습니다. timeout ID는 다른 곳에 보관해야 할까요?

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  let timeoutID = null;

  function handleSend() {
    setIsSending(true);
    timeoutID = setTimeout(() => {
      alert('Sent!');
      setIsSending(false);
    }, 3000);
  }

  function handleUndo() {
    setIsSending(false);
    clearTimeout(timeoutID);
  }

  return (
    <>
      <input
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        disabled={isSending}
        onClick={handleSend}>
        {isSending ? 'Sending...' : 'Send'}
      </button>
      {isSending &&
        <button onClick={handleUndo}>
          Undo
        </button>
      }
    </>
  );
}
```

</Sandpack>

<Solution>

컴포넌트가 리렌더 때마다(예를 들면 state를 설정하는 경우) 모든 지역 변수가 처음부터 초기화됩니다. 따라서 timeout ID를 `timeoutID`와 같은 로컬 변수에 저장한 다음 나중에 다른 이벤트 핸들러가 이를 "볼" 수 없습니다. 대신 ref에 저장하면 이 ref는 렌더 사이에 React에 보존됩니다.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const timeoutRef = useRef(null);

  function handleSend() {
    setIsSending(true);
    timeoutRef.current = setTimeout(() => {
      alert('Sent!');
      setIsSending(false);
    }, 3000);
  }

  function handleUndo() {
    setIsSending(false);
    clearTimeout(timeoutRef.current);
  }

  return (
    <>
      <input
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        disabled={isSending}
        onClick={handleSend}>
        {isSending ? 'Sending...' : 'Send'}
      </button>
      {isSending &&
        <button onClick={handleUndo}>
          Undo
        </button>
      }
    </>
  );
}
```

</Sandpack>

</Solution>


#### 리렌더를 못하는 컴포넌트 수정 {/*fix-a-component-failing-to-re-render*/}

이 버튼은 "On"과 "Off"를 표시하게 되어 있습니다. 그러나 항상 "Off"로 표시됩니다. 코드가 뭐가 잘못됐나요? 고쳐봅시다.

<Sandpack>

```js
import { useRef } from 'react';

export default function Toggle() {
  const isOnRef = useRef(false);

  return (
    <button onClick={() => {
      isOnRef.current = !isOnRef.current;
    }}>
      {isOnRef.current ? 'On' : 'Off'}
    </button>
  );
}
```

</Sandpack>

<Solution>

예시에서 ref의 current 값은 렌더링 출력에 사용됩니다. `{isOnRef.current ? 'On' : 'Off'}`. 이것은 이 정보가 ref에 있어서는 안 되며, 대신 state여야 한다는 표시입니다. 이 문제를 해결하려면 ref를 제거하고 state를 대신 사용합니다.

<Sandpack>

```js
import { useState } from 'react';

export default function Toggle() {
  const [isOn, setIsOn] = useState(false);

  return (
    <button onClick={() => {
      setIsOn(!isOn);
    }}>
      {isOn ? 'On' : 'Off'}
    </button>
  );
}
```

</Sandpack>

</Solution>

#### debouncing 수정 {/*fix-debouncing*/}

예시에서 모든 버튼 클릭 핸들러는 ["debounced"](https://redd.one/blog/debounce-vs-throttle)입니다. 어떤 의미인지 보려면 버튼 중 하나를 누르세요. 1초 후에 메시지가 어떻게 표시되는지 확인해볼게요. 메시지 대기 중에 버튼을 누르면 타이머가 리셋됩니다. 따라서 같은 버튼을 여러 번 빠르게 클릭하면 *다음* 클릭이 멈출 때까지 메시지가 나타나지 않습니다. debouncing을 사용하면 사용자가 "작업이 중지될" 때까지 일부 작업을 지연시킬 수 있습니다.

예시는 작동하지만, 의도한 대로 작동하지 않습니다. 버튼은 독립적이지 않습니다. 문제를 보려면 버튼 중 하나를 클릭한 다음 즉시 다른 버튼을 클릭합니다. 지연된 후에 양쪽 버튼의 메시지를 볼 수 있을 것이라고 예상할 것입니다. 그러나 마지막 버튼의 메시지만 표시됩니다. 첫 번째 버튼의 메시지가 사라집니다.

왜 두 버튼이 서로 간섭하는 것일까요? 문제를 찾아 해결해 봅시다.

<Hint>

마지막 timeout ID 변수는 모든 `DebouncedButton` 컴포넌트 간에 공유됩니다. 따라서 한 버튼을 클릭하면 다른 버튼의 시간 초과가 재설정됩니다. 버튼별로 timeout ID를 따로 저장할 수 있을까요?

</Hint>

<Sandpack>

```js
import { useState } from 'react';

let timeoutID;

function DebouncedButton({ onClick, children }) {
    return (
        <button onClick={() => {
            clearTimeout(timeoutID);
            timeoutID = setTimeout(() => {
                onClick();
            }, 1000);
        }}>
            {children}
        </button>
    );
}

export default function Dashboard() {
    return (
        <>
            <DebouncedButton
                onClick={() => alert('Spaceship launched!')}
            >
                Launch the spaceship
            </DebouncedButton>
            <DebouncedButton
                onClick={() => alert('Soup boiled!')}
            >
                Boil the soup
            </DebouncedButton>
            <DebouncedButton
                onClick={() => alert('Lullaby sung!')}
            >
                Sing a lullaby
            </DebouncedButton>
        </>
    )
}
```

```css
button { display: block; margin: 10px; }
```

</Sandpack>

<Solution>

`timeoutID`와 같은 변수는 모든 컴포넌트 간에 공유됩니다. 그러므로 두 번째 버튼을 클릭하면 첫 번째 버튼의 처리시간 초과가 재설정됩니다. 이 문제를 해결하기 위해 ref에서 시간 초과를 유지할 수 있습니다. 각 버튼은 자체 ref를 갖게 되므로 서로 충돌하지 않습니다. 두 개의 버튼을 빠르게 클릭하면 두 개의 메시지가 모두 표시됩니다.

<Sandpack>

```js
import { useState, useRef } from 'react';

function DebouncedButton({ onClick, children }) {
    const timeoutRef = useRef(null);
    return (
        <button onClick={() => {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                onClick();
            }, 1000);
        }}>
            {children}
        </button>
    );
}

export default function Dashboard() {
    return (
        <>
            <DebouncedButton
                onClick={() => alert('Spaceship launched!')}
            >
                Launch the spaceship
            </DebouncedButton>
            <DebouncedButton
                onClick={() => alert('Soup boiled!')}
            >
                Boil the soup
            </DebouncedButton>
            <DebouncedButton
                onClick={() => alert('Lullaby sung!')}
            >
                Sing a lullaby
            </DebouncedButton>
        </>
    )
}
```

```css
button { display: block; margin: 10px; }
```

</Sandpack>

</Solution>

#### 최신 state 읽기 {/*read-the-latest-state*/}

이 예시에서는 "보내기"를 누른 후 메시지가 표시되기 전에 약간의 지연이 발생합니다. "hello"를 입력하고 보내기를 누른 다음 입력을 빠르게 다시 편집합니다. 편집한 내용에도 불구하고 경고창(alert)에는 여전히 "hello"([그 당시](/learn/state-as-a-snapshot#state-over-time) state 값 버튼이 클릭 됨)가 표시됩니다.

보통 이런 행동은 앱에서 원하는 것입니다. 그러나 일부 비동기 코드가 일부 state의 *최신* 버전을 읽기를 원하는 경우가 있습니다. 클릭 당시가 아니라 *현제* 입력 텍스트를 경고창(alert)에 표시하도록 할 수 있는 방법이 있을까요?

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
    const [text, setText] = useState('');

    function handleSend() {
        setTimeout(() => {
            alert('Sending: ' + text);
        }, 3000);
    }

    return (
        <>
            <input
                value={text}
                onChange={e => setText(e.target.value)}
            />
            <button
                onClick={handleSend}>
                Send
            </button>
        </>
    );
}
```

</Sandpack>

<Solution>

state는 [snapshot 처럼](/learn/state-as-a-snapshot) 작동하므로 타임아웃과 같은 비동기 작업에서 최신 state를 읽을 수 없습니다. 그러나 최신 입력 텍스트를 ref에 유지할 수 있습니다. ref는 변경할 수 있으므로 언제든지 `current` 프로퍼티를 읽을 수 있습니다. current 텍스트는 렌더링에도 사용되므로, 이 예에서는 state 변수(렌더링을 위한) *둘 다*와 ref(시간 초과 시 읽음)가 필요합니다. current ref를 수동으로 업데이트해야 합니다.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
    const [text, setText] = useState('');
    const textRef = useRef(text);

    function handleChange(e) {
        setText(e.target.value);
        textRef.current = e.target.value;
    }

    function handleSend() {
        setTimeout(() => {
            alert('Sending: ' + textRef.current);
        }, 3000);
    }

    return (
        <>
            <input
                value={text}
                onChange={handleChange}
            />
            <button
                onClick={handleSend}>
                Send
            </button>
        </>
    );
}
```

</Sandpack>

</Solution>

</Challenges>