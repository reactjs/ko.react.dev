---
title: useRef
---

<Intro>

`useRef`는 렌더링에 필요하지 않은 값을 참조할 수 있는 React Hook입니다.

```js
const ref = useRef(initialValue)
```

</Intro>

<InlineToc />

---

## 레퍼런스 {/*reference*/}

### `useRef(initialValue)` {/*useref*/}

컴포넌트의 최상위 레벨에서 `useRef`를 호출하여 [ref](/learn/referencing-values-with-refs)를 선언합니다.

```js
import { useRef } from 'react';

function MyComponent() {
  const intervalRef = useRef(0);
  const inputRef = useRef(null);
  // ...
```

[아래에서 더 많은 예시를 확인하세요.](#usage)

#### 매개변수 {/*parameters*/}

* `initialValue`: ref 객체의 `current`프로퍼티 초기 설정값입니다. 여기에는 어떤 유형의 값이든 지정할 수 있습니다. 이 인자는 초기 렌더링 이후부터는 무시됩니다.

#### 반환값 {/*returns*/}

`useRef`는 단일 프로퍼티를 가진 객체를 반환합니다:

* `current`: 처음에는 전달한 `initialValue`로 설정됩니다. 나중에 다른 값으로 바꿀 수 있습니다. ref 객체를 JSX 노드의 `ref`어트리뷰트로 React에 전달하면 React는 `current`프로퍼티를 설정합니다.

다음 렌더링에서 `useRef`는 동일한 객체를 반환합니다.

#### 주의사항 {/*caveats*/}

* `ref.current` 프로퍼티는 state와 달리 변이할 수 있습니다. 그러나 렌더링에 사용되는 객체(예: state의 일부)를 포함하는 경우 해당 객체를 변이해서는 안 됩니다.
* `ref.current` 프로퍼티를 변경해도 React는 컴포넌트를 다시 렌더링하지 않습니다. ref는 일반 JavaScript 객체이기 때문에 React는 사용자가 언제 변경했는지 알지 못합니다.
* [초기화](#avoiding-recreating-the-ref-contents)를 제외하고는 렌더링 중에 `ref.current`를 쓰거나 *읽지* 마세요. 이렇게 하면 컴포넌트의 동작을 예측할 수 없게 됩니다.
* Strict Mode에서 React는 **컴포넌트 함수를 두 번 호출하여** [의도하지 않은 불순물을 찾을 수 있도록 돕습니다.](#my-initializer-or-updater-function-runs-twice) 이는 개발 환경 전용 동작이며 상용 환경에는 영향을 미치지 않습니다. 각 ref 객체는 두 번 생성되고 그중 하나는 버려집니다. 컴포넌트 함수가 순수하다면(그래야만 합니다), 컴포넌트의 로직에 영향을 미치지 않습니다.

---

## 사용법 {/*usage*/}

### ref로 값 참조하기 {/*referencing-a-value-with-a-ref*/}

컴포넌트의 최상위 레벨에서 `useRef`를 호출하여 하나 이상의 [ref](/learn/referencing-values-with-refs)를 선언합니다.

```js [[1, 4, "intervalRef"], [3, 4, "0"]]
import { useRef } from 'react';

function Stopwatch() {
  const intervalRef = useRef(0);
  // ...
```

`useRef`는 처음에 제공한 <CodeStep step={3}>초기값</CodeStep>으로 설정된 단일 <CodeStep step={2}>`current` 프로퍼티</CodeStep>가 있는 <CodeStep step={1}>ref 객체</CodeStep>를 반환합니다.

다음 렌더링에서 `useRef`는 동일한 객체를 반환합니다. 정보를 저장하고 나중에 읽을 수 있도록 `current` 속성을 변경할 수 있습니다. [state](/reference/react/useState)가 떠오를 수 있지만, 둘 사이에는 중요한 차이점이 있습니다.

**ref를 변경해도 리렌더링을 촉발하지 않습니다.** 즉 ref는 컴포넌트의 시각적 출력에 영향을 미치지 않는 정보를 저장하는 데 적합합니다. 예를 들어 [interval ID](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)를 저장했다가 나중에 불러와야 하는 경우 ref에 넣을 수 있습니다. ref 내부의 값을 업데이트하려면 <CodeStep step={2}>`current` 프로퍼티</CodeStep>를 수동으로 변경해야 합니다:

```js [[2, 5, "intervalRef.current"]]
function handleStartClick() {
  const intervalId = setInterval(() => {
    // ...
  }, 1000);
  intervalRef.current = intervalId;
}
```

나중에 ref에서 해당 interval ID를 읽어 [해당 interval을 취소](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval)할 수 있습니다:

```js [[2, 2, "intervalRef.current"]]
function handleStopClick() {
  const intervalId = intervalRef.current;
  clearInterval(intervalId);
}
```

ref를 사용하면 다음을 보장합니다:

- (렌더링할 때마다 재설정되는 일반 변수와 달리) 리렌더링 사이에 **정보를 저장**할 수 있습니다.
- (리렌더링을 촉발하는 state 변수와 달리) 변경해도 **리렌더링을 촉발하지 않습니다.**
- (정보가 공유되는 외부 변수와 달리) 각각의 컴포넌트에 **로컬로 저장됩니다.**

ref를 변경해도 다시 렌더링되지 않으므로 화면에 표시되는 정보를 저장하는 데는 ref가 적합하지 않습니다. 대신 state를 사용하세요. 더 자세한 내용은 [`useRef`와 `useState` 중 선택하기](/learn/referencing-values-with-refs#differences-between-refs-and-state)에서 확인하세요.

<Recipes titleText="useRef로 값을 참조하는 예시" titleId="examples-value">

#### counter 클릭하기 {/*click-counter*/}

이 컴포넌트는 ref를 사용하여 버튼이 클릭된 횟수를 추적합니다. 클릭 횟수는 이벤트 핸들러에서만 읽고 쓰기 때문에 여기서는 state 대신 ref를 사용해도 괜찮습니다.

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

JSX에 `{ref.current}`를 표시하면 클릭 시 번호가 업데이트되지 않습니다. `ref.current`를 설정해도 리렌더링을 촉발하지 않기 때문입니다. 렌더링에 사용하는 정보는 ref가 아닌 state여야 합니다.

<Solution />

#### 스톱워치 {/*a-stopwatch*/}

예제에서는 state와 ref의 조합을 사용합니다. `startTime`과 `now`는 모두 렌더링에 사용되기 때문에 state 변수입니다. 그러나 버튼을 누를 때 interval을 멈출 수 있게 하기 위해선 [interval ID](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)도 보유해야 합니다. interval ID는 렌더링에 사용되지 않으므로 ref에 보관하고 수동으로 업데이트하는 것이 적절합니다.

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

<Solution />

</Recipes>

<Pitfall>

**렌더링 중에는 `ref.current`를 쓰거나 _읽지_ 마세요.**

React는 컴포넌트의 본문이 [순수 함수처럼 동작하기](/learn/keeping-components-pure)를 기대합니다:

- 입력값들([props](/learn/passing-props-to-a-component), [state](/learn/state-a-components-memory), [context](/learn/passing-data-deeply-with-context))이 동일하면 완전히 동일한 JSX를 반환해야 합니다.
- 다른 순서나 다른 인수를 사용하여 호출해도 다른 호출의 결과에 영향을 미치지 않아야 합니다.

**렌더링 중에** ref를 읽거나 쓰면 이러한 기대가 깨집니다.

```js {3-4,6-7}
function MyComponent() {
  // ...
  // 🚩 Don't write a ref during rendering
  myRef.current = 123;
  // ...
  // 🚩 Don't read a ref during rendering
  return <h1>{myOtherRef.current}</h1>;
}
```

**대신 이벤트 핸들러나 Effect에서** ref를 읽거나 쓸 수 있습니다.

```js {4-5,9-10}
function MyComponent() {
  // ...
  useEffect(() => {
    // ✅ You can read or write refs in effects
    myRef.current = 123;
  });
  // ...
  function handleClick() {
    // ✅ You can read or write refs in event handlers
    doSomething(myOtherRef.current);
  }
  // ...
}
```

렌더링 중에 무언가를 읽거나 [써야](/reference/react/useState#storing-information-from-previous-renders)*만* 하는 경우, 대신 [state를 사용](/reference/react/useState)하세요.

<<<<<<< HEAD
컴포넌트는 이러한 규칙을 어기더라도 여전히 작동할 수도 있지만, React에 추가되는 대부분의 새로운 기능들은 이러한 기대에 의존합니다. 자세한 내용은 [컴포넌트를 순수하게 유지하기](/learn/keeping-components-pure#where-you-_can_-cause-side-effects)에서 확인하세요.
=======
When you break these rules, your component might still work, but most of the newer features we're adding to React will rely on these expectations. Read more about [keeping your components pure.](/learn/keeping-components-pure#where-you-_can_-cause-side-effects)
>>>>>>> a472775b7c15f41b21865db1698113ca49ca95c4

</Pitfall>

---

### ref로 DOM 조작하기 {/*manipulating-the-dom-with-a-ref*/}

ref를 사용하여 [DOM](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API)을 조작하는 것은 특히 일반적입니다. React에는 이를 위한 기본 지원이 있습니다.

먼저 <CodeStep step={3}>초기값</CodeStep>이 `null`인 <CodeStep step={1}>ref 객체</CodeStep>를 선언하세요:

```js [[1, 4, "inputRef"], [3, 4, "null"]]
import { useRef } from 'react';

function MyComponent() {
  const inputRef = useRef(null);
  // ...
```

그런 다음 ref 객체를 `ref` 속성으로 조작하려는 DOM 노드의 JSX에 전달하세요:

```js [[1, 2, "inputRef"]]
  // ...
  return <input ref={inputRef} />;
```

React가 DOM 노드를 생성하고 화면에 그린 후, React는 ref 객체의 <CodeStep step={2}>`current`프로퍼티</CodeStep>를 DOM 노드로 설정합니다. 이제 DOM 노드 `<input>` 접근해 [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus)와 같은 메서드를 호출할 수 있습니다.

```js [[2, 2, "inputRef.current"]]
  function handleClick() {
    inputRef.current.focus();
  }
```

노드가 화면에서 제거되면 React는 `current` 프로퍼티를 다시 `null`로 설정합니다.

자세한 내용은 [ref로 DOM 조작하기](/learn/manipulating-the-dom-with-refs)에서 알아보세요.

<Recipes titleText="useRef로 DOM을 조작하는 예시" titleId="examples-dom">

#### 텍스트 input에 초점 맞추기 {/*focusing-a-text-input*/}

이 예제에서는 버튼을 클릭하면 입력에 초점이 맞춰집니다:

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

<Solution />

#### 이미지 스크롤하기 {/*scrolling-an-image-into-view*/}

이 예제에서는 버튼을 클릭하면 이미지가 스크롤됩니다. 목록 DOM 노드에 대한 ref를 사용한 다음 DOM [`querySelectorAll`](https://developer.mozilla.org/ko/docs/Web/API/Document/querySelectorAll) API를 호출하여 스크롤하려는 이미지를 찾습니다.

<Sandpack>

```js
import { useRef } from 'react';

export default function CatFriends() {
  const listRef = useRef(null);

  function scrollToIndex(index) {
    const listNode = listRef.current;
    // 다음 코드는 특정 DOM 구조를 가정합니다:
    const imgNode = listNode.querySelectorAll('li > img')[index];
    imgNode.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  return (
    <>
      <nav>
        <button onClick={() => scrollToIndex(0)}>
          Tom
        </button>
        <button onClick={() => scrollToIndex(1)}>
          Maru
        </button>
        <button onClick={() => scrollToIndex(2)}>
          Jellylorum
        </button>
      </nav>
      <div>
        <ul ref={listRef}>
          <li>
            <img
              src="https://placekitten.com/g/200/200"
              alt="Tom"
            />
          </li>
          <li>
            <img
              src="https://placekitten.com/g/300/200"
              alt="Maru"
            />
          </li>
          <li>
            <img
              src="https://placekitten.com/g/250/200"
              alt="Jellylorum"
            />
          </li>
        </ul>
      </div>
    </>
  );
}
```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

<Solution />

#### 비디오 재생 및 정지하기 {/*playing-and-pausing-a-video*/}

이 예제에서는 ref를 사용하여 `<video>` DOM 노드에서 [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) 및 [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause)를 호출합니다.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const ref = useRef(null);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);

    if (nextIsPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <video
        width="250"
        ref={ref}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

<Solution />

#### 컴포넌트에 ref 노출하기 {/*exposing-a-ref-to-your-own-component*/}

때로는 부모 컴포넌트가 컴포넌트 내부의 DOM을 조작할 수 있도록 하고 싶을 때가 있습니다. 예를 들어 `MyInput` 컴포넌트를 작성하는 중인데, 부모 컴포넌트가 (부모가 접근할 수 없는) `MyInput`의 input에 포커스를 맞출 수 있게 하고 싶을 수 있습니다. `useRef`로 input을 붙잡고 [`forwardRef`](/reference/react/forwardRef)로 이를 부모 컴포넌트에 노출시킬 수 있습니다. [자세한 내용은 여기에서 확인하세요.](/learn/manipulating-the-dom-with-refs#accessing-another-components-dom-nodes)

<Sandpack>

```js
import { forwardRef, useRef } from 'react';

const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

### ref 콘텐츠 재생성 피하기 {/*avoiding-recreating-the-ref-contents*/}

React는 초기에 ref 값을 한 번 저장하고, 다음 렌더링부터는 이를 무시합니다.

```js
function Video() {
  const playerRef = useRef(new VideoPlayer());
  // ...
```

`new VideoPlayer()`의 결과는 초기 렌더링에만 사용되지만, 호출 자체는 이후의 모든 렌더링에서도 여전히 계속 이뤄집니다. 이는 값비싼 객체를 생성하는 경우 낭비일 수 있습니다.

이 문제를 해결하려면 대신 다음과 같이 ref를 초기화할 수 있습니다:

```js
function Video() {
  const playerRef = useRef(null);
  if (playerRef.current === null) {
    playerRef.current = new VideoPlayer();
  }
  // ...
```

일반적으로 렌더링 중에 `ref.current`를 쓰거나 읽는 것은 허용되지 않습니다. 하지만 이 경우에는 결과가 항상 동일하고 초기화 중에만 조건이 실행되므로 충분히 예측할 수 있으므로 괜찮습니다.

<DeepDive>

#### useRef를 초기화할 때 null 검사를 피하는 방법 {/*how-to-avoid-null-checks-when-initializing-use-ref-later*/}

타입 검사기를 사용하면서 항상 `null`을 검사하고 싶지 않다면 다음과 같은 패턴을 대신 사용해 볼 수 있습니다:

```js
function Video() {
  const playerRef = useRef(null);

  function getPlayer() {
    if (playerRef.current !== null) {
      return playerRef.current;
    }
    const player = new VideoPlayer();
    playerRef.current = player;
    return player;
  }

  // ...
```

여기서 `playerRef` 자체는 nullable합니다. 하지만 타입 검사기에 `getPlayer()`가 `null`을 반환하는 경우가 없다는 것을 확신시킬 수 있어야 합니다. 그런 다음 이벤트 핸들러에서 `getPlayer()`를 사용하십시오.

</DeepDive>

---

## 문제 해결 {/*troubleshooting*/}

### 커스텀 컴포넌트에 대한 ref를 얻을 수 없습니다 {/*i-cant-get-a-ref-to-a-custom-component*/}

컴포넌트에 `ref`를 전달하고자 다음과 같이 하면:

```js
const inputRef = useRef(null);

return <MyInput ref={inputRef} />;
```

다음과 같은 오류가 발생할 것입니다:

<ConsoleBlock level="error">

경고: 함수 컴포넌트에는 ref를 지정할 수 없습니다. 이 ref에 접근하려는 시도는 실패합니다. React.forwardRef()를 사용하려고 하셨나요?

</ConsoleBlock>

기본적으로 컴포넌트는 내부의 DOM 노드에 대한 ref를 외부로 노출하지 않습니다.

이 문제를 해결하려면 ref를 가져오고자 하는 컴포넌트를 찾으세요:

```js
export default function MyInput({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={onChange}
    />
  );
}
```

그런 다음 아래와 같이 [`forwardRef`](/reference/react/forwardRef)로 감싸세요:

```js {3,8}
import { forwardRef } from 'react';

const MyInput = forwardRef(({ value, onChange }, ref) => {
  return (
    <input
      value={value}
      onChange={onChange}
      ref={ref}
    />
  );
});

export default MyInput;
```

그러면 부모 컴포넌트가 ref를 가져올 수 있습니다.

자세한 내용은 [다른 컴포넌트의 DOM 노드에 접근하기](/learn/manipulating-the-dom-with-refs#accessing-another-components-dom-nodes)에서 확인하세요.
