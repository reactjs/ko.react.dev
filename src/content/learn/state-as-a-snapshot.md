---
title: 스냅샷으로서의 State
---

<Intro>

State 변수는 읽고 쓸 수 있는 일반 자바스크립트 변수처럼 보일 수 있습니다. 하지만 state는 스냅샷처럼 동작합니다. state 변수를 설정하여도 이미 가지고 있는 state 변수는 변경되지 않고, 대신 리렌더링이 발동됩니다.

</Intro>

<YouWillLearn>

* state 설정으로 리렌더링이 동작하는 방식
* state 업데이트 시기 및 방법
* state를 설정한 직후에 state가 업데이트되지 않는 이유
* 이벤트 핸들러가 state의 "스냅샷"에 접근하는 방법

</YouWillLearn>

## state를 설정하면 렌더링이 동작합니다 {/*setting-state-triggers-renders*/}

클릭과 같은 사용자 이벤트에 반응하여 사용자 인터페이스가 직접 변경된다고 생각할 수 있습니다. React에서는 이 멘탈 모델과는 조금 다르게 작동합니다. 이전 페이지에서 [state를 설정하면 React에 리렌더링을 요청](/learn/render-and-commit#step-1-trigger-a-render)하는 것을 보았습니다. 즉, 인터페이스가 이벤트에 반응하려면 state를 업데이트해야 합니다.


이 예시에서는 "send"를 누르면 `setIsSent(true)`는 React에 UI를 다시 렌더링하도록 지시합니다. 

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

버튼을 클릭하면 다음과 같은 일이 발생합니다.

1. `onSubmit` 이벤트 핸들러가 실행됩니다.
2. `setIsSent(true)`가 `isSent`를 `true`로 설정하고 새로운 렌더링을 큐에 넣습니다.
3. React는 새로운 `isSent`값에 따라 컴포넌트를 다시 렌더링합니다.

state와 렌더링의 관계를 자세히 살펴보겠습니다.

## 렌더링은 그 시점의 스냅샷을 찍습니다. {/*rendering-takes-a-snapshot-in-time*/}

["렌더링"](/learn/render-and-commit#step-2-react-renders-your-components)이란 React가 컴포넌트, 즉 함수를 호출한다는 뜻입니다. 해당 함수에서 반환하는 JSX는 시간상 UI의 스냅
샷과 같습니다. prop, 이벤트 핸들러, 로컬 변수는 모두 **렌더링 당시의 state를 사용해** 계산됩니다.

사진이나 동영상 프레임과 달리 반환하는 UI "스냅샷"은 대화형입니다. 여기에는 입력에 대한 응답으로 어떤 일이 일어날지 지정하는 이벤트 핸들러와 같은 로직이 포함됩니다. 그러면 React는 이 스냅샷과 일치하도록 화면을 업데이트하고 이벤트 핸들러를 연결합니다. 결과적으로 버튼을 누르면 JSX의 클릭 핸들러가 발동됩니다.

React가 컴포넌트를 다시 렌더링할 때.

1. React가 함수를 다시 호출합니다.
2. 함수가 새로운 JSX 스냅샷을 반환합니다.
3. 그러면 React가 반환한 스냅샷과 일치하도록 화면을 업데이트합니다.

<IllustrationBlock title="다시 렌더링" sequential>
    <Illustration caption="React가 함수를 호출합니다" src="/images/docs/illustrations/i_render1.png" />
    <Illustration caption="스냅샷을 계산합니다" src="/images/docs/illustrations/i_render2.png" />
    <Illustration caption="DOM tree를 업데이트 합니다" src="/images/docs/illustrations/i_render3.png" />
</IllustrationBlock>

컴포넌트의 메모리로써 state는 함수가 반환된 후 사라지는 일반 변수와 다릅니다. state는 실제로 함수 외부에 마치 선반에 있는 것처럼 React 자체에 “존재”합니다. React가 컴포넌트를 호출하면 특정 렌더링에 대한 state의 스냅샷을 제공합니다. 컴포넌트는 **해당 렌더링의 state 값을 사용해** 계산된 새로운 props 세트와 이벤트 핸들러가 포함된 UI의 스냅샷을 JSX에 반환합니다!

<IllustrationBlock sequential>
  <Illustration caption="React에 state를 업데이트하라고 명령합니다" src="/images/docs/illustrations/i_state-snapshot1.png" />
  <Illustration caption="React가 state 값을 업데이트 합니다" src="/images/docs/illustrations/i_state-snapshot2.png" />
  <Illustration caption="React는 상태 값의 스냅샷을 컴포넌트에 전달합니다" src="/images/docs/illustrations/i_state-snapshot3.png" />
</IllustrationBlock>

다음은 이것이 어떻게 작동하는지 보여주는 간단한 실험입니다. 이 예제에서는 ‘+3’ 버튼을 클릭하면 `setNumber(number + 1)`를 세 번 호출하므로 카운터가 세 번 증가할 것으로 예상할 수 있습니다.

"+3" 버튼을 클릭하면 어떻게 되는지 확인해 봅시다.

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

이 `number`는 클릭당 한 번만 증가한다는 점에 유의하세요!

**state를 설정하면 다음 렌더링에 대해서만 변경됩니다.** 첫 번째 렌더링에서 `number`는 `0`이었습니다. 따라서 해당 렌더링의 `onClick` 핸들러에서 `setNumber(number + 1)`가 호출된 후에도 `number`의 값은 여전히 `0`입니다.

```js
<button onClick={() => {
  setNumber(number + 1);
  setNumber(number + 1);
  setNumber(number + 1);
}}>+3</button>
```

이 버튼의 클릭 핸들러가 React에 지시하는 작업은 다음과 같습니다.

1. `setNumber(number + 1)`: `number`는 `0`이므로 `setNumber(0 + 1)`입니다.
    - React는 다음 렌더링에서 `number`를 `1`로 변경할 준비를 합니다.
2. `setNumber(number + 1)`: `number`는 `0`이므로 `setNumber(0 + 1)`입니다.
    - React는 다음 렌더링에서 `number`를 `1`로 변경할 준비를 합니다.
3. `setNumber(number + 1)`: `number`는 `0`이므로 `setNumber(0 + 1)`입니다.
    - React는 다음 렌더링에서 `number`를 `1`로 변경할 준비를 합니다.

`setNumber(number + 1)`를 세 번 호출했지만, 이 렌더링에서 이벤트 핸들러에서 `number`는 항상 `0`이므로 state를 `1`로 세 번 설정합니다. 이것이 이벤트 핸들러가 완료된 후 React가 컴포넌트 안의 `number` 를 `3`이 아닌 `1`로  다시 렌더링하는 이유입니다.

코드에서 state 변수를 해당 값으로 대입하여 이를 시각화할 수도 있습니다. 이 렌더링에서 `number` state 변수는 `0`이므로 이벤트 핸들러는 다음과 같습니다.

```js
<button onClick={() => {
  setNumber(0 + 1);
  setNumber(0 + 1);
  setNumber(0 + 1);
}}>+3</button>
```

다음 렌더링에서는 `number`가 `1`이므로 렌더링의 클릭 핸들러는 다음과 같이 표시됩니다.

```js
<button onClick={() => {
  setNumber(1 + 1);
  setNumber(1 + 1);
  setNumber(1 + 1);
}}>+3</button>
```

그렇기 때문에 버튼을 다시 클릭하면 카운터가 `2`로 설정되고, 다음 클릭 시에는 `3`으로 설정되는 방식입니다.

## 시간 경과에 따른 State {/*state-over-time*/}

재미있네요. 이 버튼을 클릭하면 어떤 경고창이 표시되는지 맞혀보세요.

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

하지만 경고창에 타이머를 설정하여 컴포넌트가 다시 렌더링 된 후에만 발동하도록 하면 어떨까요? “0” 또는 “5”라고 표시될까요? 맞춰보세요!

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

React에 저장된 state는 경고창이 실행될 때 변경되었을 수 있지만 사용자가 상호작용한 시점에 state 스냅샷을 사용하는 건 이미 예약되어 있던 것입니다!

**state 변수의 값은** 이벤트 핸들러의 코드가 비동기적이더라도 **렌더링 내에서 절대 변경되지 않습니다.** 해당 렌더링의 `onClick` 내에서, `setNumber(number + 5)`가 호출된 후에도 `number`의 값은 계속 `0`입니다. 이 값은 컴포넌트를 호출해 React가 UI의 “스냅샷을 찍을” 때 “고정”된 값입니다.

다음은 이벤트 핸들러가 타이밍 실수를 줄이는 방법을 보여주는 예입니다. 아래는 5초 지연된 메시지를 보내는 양식입니다. 이 시나리오를 상상해 보세요.

1. "Send" 버튼을 누르면 Alice에게 "Hello"가 전송됩니다.
2. 5초 지연이 끝나기 전에 "To" 필드의 값을 "Bob"으로 변경합니다.

`alert`에 어떤 내용이 표시되기를 기대하나요? “앨리스에게 인사했습니다”라고 표시될까요, 아니면 “당신은 밥에게 인사했습니다”라고 표시될까요? 알고 있는 내용을 바탕으로 추측해보고, 다음의 코드를 실행해 보세요.

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

**React는 렌더링의 이벤트 핸들러 내에서 state 값을 "고정"으로 유지합니다.** 코드가 실행되는 동안 state가 변경되었는지를 걱정할 필요가 없습니다.

하지만 다시 렌더링하기 전에 최신 state를 읽고 싶다면 어떻게 해야 할까요? 다음 페이지에서 설명하는 [state 갱신 함수](/learn/queueing-a-series-of-state-updates)를 사용하면 됩니다!

<Recap>

* state를 설정하면 새 렌더링을 요청합니다.
* React는 컴포넌트 외부에 마치 선반에 보관하듯 state를 저장합니다.
* `useState`를 호출하면 React는 해당 렌더링에 대한 state의 스냅샷을 제공합니다.
* 변수와 이벤트 핸들러는 다시 렌더링해도 “살아남지” 않습니다. 모든 렌더링에는 고유한 이벤트 핸들러가 있습니다.
* 모든 렌더링(및 그 안의 함수)은 항상 React가 그 렌더링에 제공한 state의 스냅샷을 "보게" 됩니다.
* 렌더링 된 JSX에 대해 생각하는 방식과 유사하게 이벤트 핸들러에서 state를 대체할 수 있습니다.
* 과거에 생성된 이벤트 핸들러는 그것이 생성된 렌더링 시점의 state 값을 갖습니다.

</Recap>



<Challenges>

#### 신호등 구현하기 {/*implement-a-traffic-light*/}

다음은 버튼을 누르면 토글되는 신호등 컴포넌트입니다.

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

클릭 핸들러에 `alert`를 추가하세요. 신호등이 녹색이고 "걷기"라고 표시되면 버튼을 클릭하면 "다음은 정지입니다"라고 표시되어야 합니다. 신호등이 빨간색이고 "중지"라고 표시되면 버튼을 클릭하면 "다음은 걷기입니다"라고 표시되어야 합니다.

`alert`를 `setWalk` 호출 전이나 후에 넣는 것이 차이가 있을까요?

<Solution>

`alert`는 다음과 같이 작성해야 합니다.

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

`setWalk` 호출 앞에 넣든, 뒤에 넣든 아무런 차이가 없습니다. 해당 렌더링의 `walk` 값은 고정되어 있습니다. `setWalk`를 호출하면 다음 렌더링에 대해서만 변경되고, 이전 렌더링의 이벤트 핸들러에는 영향을 미치지 않습니다.

이 라인은 처음에는 직관적이지 않게 보일 수 있습니다.

```js
alert(walk ? 'Stop is next' : 'Walk is next');
```

하지만 이렇게 읽으면 이해가 될 것입니다. “신호등에 ‘Walk now’가 표시되면, 메시지에 ‘Stop is next.’라고, 표시되어야 합니다.” 이벤트 핸들러 내부의 `walk` 변수는 해당 렌더링의 값인 `walk`와 일치하며 변경되지 않습니다.

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
