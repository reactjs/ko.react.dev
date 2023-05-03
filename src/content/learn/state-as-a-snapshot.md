---
title: 스냅샷으로서의 State
---

<Intro>

State 변수는 읽고 쓸 수 있는 일반 자바스크립트 변수처럼 보일 수 있습니다. 그러나 state는 스냅샷 처럼 작동합니다. state를 설정하여도 이미 가지고 있는 state는 변경되지 않고, 대신에 다시 렌더링을 실행합니다.

</Intro>

<YouWillLearn>

* state 설정이 어떻게 다시 렌더링을 실행하는지
* 언제 그리고 어떻게 state가 업데이트되는지
* state를 설정한 후에 왜 state값이 즉시 업데이트되지 않는지
* 이벤트 핸들러가 어떻게 state의 "스냅샷"에 접근하는지

</YouWillLearn>

## state를 설정하여 렌더링을 실행합니다. {/*setting-state-triggers-renders*/}

You might think of your user interface as changing directly in response to the user event like a click. In React, it works a little differently from this mental model. On the previous page, you saw that [setting state requests a re-render](/learn/render-and-commit#step-1-trigger-a-render) from React. This means that for an interface to react to the event, you need to *update the state*.

예시에서 "전송" 버튼을 눌렀을 때, `setIsSent(true)`는 UI를 다시 렌더링하도록 React에 알려줍니다.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('Hi!');
  if (isSent) {
    return <h1>Your message is on its way!</h1>
  }
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      setIsSent(true);
      sendMessage(message);
    }}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}

function sendMessage(message) {
  // ...
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

버튼을 클릭하면 다음과 같이 됩니다.

1. `onSubmit` 이벤트 핸들러가 실행됩니다.
2. `setIsSent(true)`가 `isSent`를 `true`로 설정하고 새로운 렌더링을 큐에 넣습니다.
3. React는 새로운 `isSent`값에 따라 컴포넌트를 다시 렌더링합니다.

state와 렌더링의 관계를 자세히 살펴보겠습니다.

## 렌더링은 적시에 스냅샷을 생성합니다. {/*rendering-takes-a-snapshot-in-time*/}

["렌더링"](/learn/render-and-commit#step-2-react-renders-your-components)은 React가 함수 컴포넌트를 호출하는 것을 의미합니다. 함수에서 반환하는 JSX는 시간에 따른 UI의 스냅샷과 같습니다. 컴포넌트의 props, 이벤트 핸들러, 로컬 변수들 모두 계산됩니다. **렌더링 시점의 state 사용.**

사진이나 동영상 프레임과 다르게 반환하는 UI "스냅샷"은 대화형입니다. 스냅샷은 입력에 대한 응답으로 발생하는 일을 지정하는 이벤트 핸들러와 같은 로직을 포함하고 있습니다. 그런 다음 React는 스냅샷과 일치하도록 화면을 업데이트하고 이벤트 핸들러를 연결합니다. 결과적으로 버튼을 누르면 JSX의 클릭 핸들러를 실행합니다.

React가 컴포넌트를 다시 렌더링할 때.

1. React가 함수를 다시 호출합니다.
2. 함수가 새 JSX 스냅샷을 반환합니다.
3. 그런 다음 React는 반환된 스냅샷과 일치하도록 화면을 업데이트합니다.

<IllustrationBlock title="다시 렌더링" sequential>
    <Illustration caption="React가 함수를 호출합니다" src="/images/docs/illustrations/i_render1.png" />
    <Illustration caption="스냅샷을 계산합니다" src="/images/docs/illustrations/i_render2.png" />
    <Illustration caption="DOM tree를 업데이트 합니다" src="/images/docs/illustrations/i_render3.png" />
</IllustrationBlock>

컴포넌트의 메모리인 state는 함수가 반환된 후 사라지는 일반 변수와 다릅니다. 함수 외부에 있는 것처럼 실제로 React 자체에 "살아있는" State를 나타냅니다. React가 컴포넌트를 호출하면 특정 렌더링의 state에 대한 스냅샷을 제공합니다. 컴포넌트는 JSX에 새로운 props 및 이벤트 핸들러 세트가 있는 UI 스냅샷을 반환하며 모두 계산됩니다.**렌더링의 state 사용!**

<IllustrationBlock sequential>
  <Illustration caption="React에게 상태를 업데이트하라고 알립니다" src="/images/docs/illustrations/i_state-snapshot1.png" />
  <Illustration caption="React는 state를 업데이트 합니다" src="/images/docs/illustrations/i_state-snapshot2.png" />
  <Illustration caption="React는 state의 스냅샷을 컴포넌트에 전달합니다" src="/images/docs/illustrations/i_state-snapshot3.png" />
</IllustrationBlock>

이것이 어떻게 동작하는지 보여주기 위한 작은 실험이 있습니다. 이 예시에서, "+3"버튼을 클릭하면 `setNumber(number + 1)`를 세 번 호출하기 때문에 카운터가 세 번 증가할 것으로 예상할 수 있습니다.

"+3" 버튼을 클릭하면 어떻게 되는지 확인해봅시다.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1);
        setNumber(number + 1);
        setNumber(number + 1);
      }}>+3</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

`number`는 클릭당 한 번만 증가합니다!

**state를 설정하면 *다음* 렌더링에 대해서만 변경됩니다.** 첫 번째 렌더링을 하는동안, `number`는 `0` 이었습니다. 이것이 "첫 번째 렌더링의" `onClick`핸들러에서 `setNumber(number + 1)`가 호출된 후에도 `number`의 값이 여전히 `0`인 이유입니다.

```js
<button onClick={() => {
  setNumber(number + 1);
  setNumber(number + 1);
  setNumber(number + 1);
}}>+3</button>
```

다음은 버튼의 클릭 핸들러가 전달하는 React가 해야 할 일들입니다.

1. `setNumber(number + 1)`: `number` is `0` so `setNumber(0 + 1)`.
    - React는 다음 렌더링에서 `number`를 `1`로 변경할 준비를 합니다.
2. `setNumber(number + 1)`: `number` is `0` so `setNumber(0 + 1)`.
    - React는 다음 렌더링에서 `number`를 `1`로 변경할 준비를 합니다.
3. `setNumber(number + 1)`: `number` is `0` so `setNumber(0 + 1)`.
    - React는 다음 렌더링에서 `number`를 `1`로 변경할 준비를 합니다.

`setNumber(number + 1)`를 세 번 호출했지만 *렌더링*의 이벤트 핸들러에서 `number`는 항상 `0`이므로 state를 `1`로 세 번 설정합니다. 이것이 이벤트 핸들러가 완료된 후 React가 '3'이 아닌 '1'과 같은 `number로 구성 요소를 다시 렌더링하는 이유입니다.

코드에서 state를 해당 값으로 이를 시각화할 수도 있습니다. *렌더링*의 경우 `number` state가 `0` 이므로 이벤트 핸들러는 다음과 같습니다.

```js
<button onClick={() => {
  setNumber(0 + 1);
  setNumber(0 + 1);
  setNumber(0 + 1);
}}>+3</button>
```

다음 렌더링의 경우 `number`는 `1`이므로 *렌더링의* 클릭 핸들러는 다음과 같습니다.

```js
<button onClick={() => {
  setNumber(1 + 1);
  setNumber(1 + 1);
  setNumber(1 + 1);
}}>+3</button>
```

이것이 버튼을 다시 클릭하면 카운터가 `2`로 설정되고 다음 클릭에서 `3`'으로 설정되는 방식인 이유입니다.

## 시간 경과에 따른 State {/*state-over-time*/}

정말 재밌죠. 이 버튼을 클릭하면 무엇을 경고할지 추측해 보세요.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        alert(number);
      }}>+5</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

이전의 대체 메서드를 사용하면 경고창이 "0"을 표시한다고 추측할 수 있습니다.

```js
setNumber(0 + 5);
alert(0);
```

그러나 경고창에 타이머를 설정하여 컴포넌트가 다시 렌더링 된 _이후에_ 실행하면 어떻게 될까요? "0" 또는 "5" 일까요? 추측해보세요!

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setTimeout(() => {
          alert(number);
        }, 3000);
      }}>+5</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

놀라셨나요? 대체 메서드를 사용하면 경고에 전달된 state의 "스냅샷"을 볼 수 있습니다.

```js
setNumber(0 + 5);
setTimeout(() => {
  alert(0);
}, 3000);
```

React에 저장된 state는 경고창이 실행될 때 변경되었을 수 있지만 사용자가 상호 작용할 때 state의 스냅샷을 사용하여 예정되었습니다!

이벤트 핸들러의 코드가 비동기적일지라도, **state 값은 렌더링 내에서 절대 변경되지 않습니다.** *렌더링의* `onClick` 내부에서 `setNumber(number + 5)`가 호출된 후에도 `number`의 값은 계속 `0`입니다. React가 컴포넌트를 호출하여 UI의 "스냅샷을 찍었을 때" 값이 "고정"되었습니다.

다음은 이벤트 핸들러가 타이밍 실수를 덜 하게 만드는 방법의 예시입니다. 다음은 5초 지연 메시지를 보내는 양식입니다. 이 시나리오를 상상해보세요.

1. "Send" 버튼을 누르면 Alice에게 "Hello"가 전송됩니다.
2. 5초 지연이 끝나기 전에 "To" 필드의 값을 "Bob"으로 변경합니다.

`경고창`이 표시될 것으로 예상되는 내용은 무엇입니까? "앨리스에게 인사했습니다"가 표시될까요? 아니면 "밥에게 인사했습니다"라고 표시될까요? 알고 있는 내용을 바탕으로 추측한 다음 시도해 보세요.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [to, setTo] = useState('Alice');
  const [message, setMessage] = useState('Hello');

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      alert(`You said ${message} to ${to}`);
    }, 5000);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        To:{' '}
        <select
          value={to}
          onChange={e => setTo(e.target.value)}>
          <option value="Alice">Alice</option>
          <option value="Bob">Bob</option>
        </select>
      </label>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

**React는 렌더링의 이벤트 핸들러 내에서 state를 "고정"으로 유지합니다.** 코드가 실행되는 동안 state가 변경되었는지를 걱정할 필요가 없습니다.

그러나 다시 렌더링하기 전에 최신 state를 읽고 싶다면 어떻게 해야 할까요? 다음 페이지에서 다룰 [state 갱신 함수](/learn/queueing-a-series-of-state-updates)를 사용하고 싶을 것입니다.

<Recap>

* state를 설정하면 새 렌더링이 요청됩니다
* React는 선반에 있는 것처럼 구성 요소 외부에 state를 저장합니다. (as if on a shelf)
* `useState`를 호출하면 React는 *렌더링*의 state에 대한 스냅샷을 제공합니다.
* 변수 및 이벤트 핸들러는 "생존"하여 다시 렌더링 되지 않습니다. 모든 렌더링에는 고유의 이벤트 핸들러가 있습니다.
* 모든 렌더링(및 그 안의 함수)은 항상 React가 *그*렌더링에 부여한 state의 스냅샷을 "볼" 것입니다.
* 렌더링 된 JSX에 대해 생각하는 방식과 유사하게 이벤트 핸들러에서 state를 대체할 수 있습니다.
* 과거에 생성된 이벤트 핸들러는 생성되었을 당시 렌더링의 state 값을 가집니다.

</Recap>



<Challenges>

#### 신호등을 구현해봅시다 {/*implement-a-traffic-light*/}

<<<<<<< HEAD
다음은 버튼을 눌렀을 때 켜지는 횡단보도 조명 컴포넌트입니다.
=======
Here is a crosswalk light component that toggles when the button is pressed:
>>>>>>> 69ca3dfd (Fixes grammar (#5967))

<Sandpack>

```js
import { useState } from 'react';

export default function TrafficLight() {
  const [walk, setWalk] = useState(true);

  function handleClick() {
    setWalk(!walk);
  }

  return (
    <>
      <button onClick={handleClick}>
        Change to {walk ? 'Stop' : 'Walk'}
      </button>
      <h1 style={{
        color: walk ? 'darkgreen' : 'darkred'
      }}>
        {walk ? 'Walk' : 'Stop'}
      </h1>
    </>
  );
}
```

```css
h1 { margin-top: 20px; }
```

</Sandpack>

클릭 핸들러에 `경고창`을 추가합니다. 신호등이 녹색이고 "Walk"라고 표시되면 버튼을 클릭하면 "Stop is next"라고 표시되어야 합니다. 표시등이 빨간색이고 "중지"라고 표시되면 버튼을 클릭하면 "다음은 걷기"라고 표시되어야 합니다.

`setWalk` 호출 전 또는 후에 `경고창`을 설정하는지에 차이가 있을까요?

<Solution>

`경고창`은 다음과 같아야 합니다.

<Sandpack>

```js
import { useState } from 'react';

export default function TrafficLight() {
  const [walk, setWalk] = useState(true);

  function handleClick() {
    setWalk(!walk);
    alert(walk ? 'Stop is next' : 'Walk is next');
  }

  return (
    <>
      <button onClick={handleClick}>
        Change to {walk ? 'Stop' : 'Walk'}
      </button>
      <h1 style={{
        color: walk ? 'darkgreen' : 'darkred'
      }}>
        {walk ? 'Walk' : 'Stop'}
      </h1>
    </>
  );
}
```

```css
h1 { margin-top: 20px; }
```

</Sandpack>

경고창을 `setWalk` 호출 전후에 배치하든 상관없이 차이가 없습니다. 렌더링의 `walk` 값은 고정되어 있습니다. `setWalk`를 호출하면 *다음* 렌더링에 대해서만 변경되지만, 이전 렌더링의 이벤트 핸들러에는 영향을 미치지 않습니다.

이 라인은 처음에는 직관적이지 않게 보일 수 있습니다.

```js
alert(walk ? 'Stop is next' : 'Walk is next');
```

그러나 다음과 같이 읽는다면 의미가 있습니다. "신호등이 'Walk now'로 표시되면 메시지는 'Stop is next'라고 표시되어야 합니다." 이벤트 핸들러 내부의 `walk` 변수는 렌더링의 `walk` 값과 일치하고 변하지 않습니다.

대체 메서드를 적용하여 이것이 올바른지 확인할 수 있습니다. `walk`가 `true`이면 다음과 같은 결과를 얻습니다.

```js
<button onClick={() => {
  setWalk(false);
  alert('Stop is next');
}}>
  Change to Stop
</button>
<h1 style={{color: 'darkgreen'}}>
  Walk
</h1>
```

따라서 "Change to Stop"을 클릭하면 `walk`가 `false`로 설정된 렌더링이 대기열에 추가되고 "Stop is next"라는 경고가 표시됩니다.

</Solution>

</Challenges>