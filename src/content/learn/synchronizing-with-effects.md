---
title: Effect와 동기화
---

<Intro>

일부 컴포넌트는 외부 시스템과 동기화해야 합니다. 예를 들어, React의 상태에 따라 React 컴포넌트가 아닌 다른 컴포넌트를 제어하거나 서버와 연결을 하거나, 컴포넌트가 화면에 표시될 때 분석 로그를 전송할 수 있습니다. *Effects*를 사용하면 렌더링 후 일부 코드를 실행하여 React 외부의 시스템과 동기화할 수 있습니다.

</Intro>

<YouWillLearn>

- Effect의 의미
- 이벤트와 Effect의 다른점
- 컴포넌트에 Effect를 선언하는 방법
- Effect를 불필요하게 다시 실행하지 않는 방법
- 개발 환경에서 Effect가 두 번 실행되는 이유와 해결 방법

</YouWillLearn>

## Effect란 무엇이고 이벤트와 어떻게 다른가요? {/*what-are-effects-and-how-are-they-different-from-events*/}

Effect에 들어가기 전에 React 컴포넌트 내부에 있는 두 가지 유형의 로직에 익숙해져야 합니다.

- **렌더링 코드**([Describing the UI](/learn/describing-the-ui)에서 소개됨)는 컴포넌트의 최상위 레벨에 있습니다. 여기에서 props와 state를 가져와서 변환하고 화면에 표시할 JSX를 반환합니다. [렌더링 코드는 순수해야 합니다.](/learn/keeping-components-pur) 수학 공식처럼 결과만 _계산_ 하고 다른 작업은 수행하지 않아야 합니다.

- **이벤트 핸들러**([Adding Interactivity](/learn/adding-interactivity)에서 소개됨)는 컴포넌트 내부에 중첩된 함수로, 단순히 계산만 하는 것이 아니라 *작업을 수행*합니다. 이벤트 핸들러는 입력 필드를 업데이트하거나, 제품 구매를 위해 HTTP POST 요청을 제출하거나, 사용자를 다른 화면으로 안내할 수 있습니다. 이벤트 핸들러에는 특정 사용자 액션(예: 버튼 클릭 또는 입력)으로 인해 발생하는 ["부작용"](https://en.wikipedia.org/wiki/Side_effect_(computer_science))(프로그램의 상태를 변경)이 포함됩니다.

때로는 이것만으로는 충분하지 않습니다. 화면에 표시될 때마다 채팅 서버에 연결해야 하는 `ChatRoom` 컴포넌트를 생각해 보세요. 서버에 연결하는 것은 순수한 계산이 아니므로(부수적인 효과) 렌더링 중에 발생할 수 없습니다. 그러나 클릭과 같은 특정 이벤트 하나만으로는 `ChatRoom`을 표시할 수 없습니다.

***Effect*를 사용하면 특정 이벤트가 아닌 렌더링 자체로 인해 발생하는 부작용을 지정할 수 있습니다.** 채팅에서 메시지를 보내는 것은 사용자가 특정 버튼을 클릭함으로써 직접 발생하므로 *이벤트*에 해당합니다. 그러나 서버 연결 설정은 컴포넌트가 표시되도록 한 상호작용과 상관없이 발생해야 하므로 *Effect*입니다. Effect는 화면이 업데이트된 후 [커밋](/learn/render-and-commit)이 끝날 때 실행됩니다. 이 때는 React 컴포넌트를 외부 시스템(예: 네트워크 또는 타사 라이브러리)과 동기화하기에 좋은 시기입니다.

<Note>

이 글에서 대문자로 표시된 "Effect"는 위의 React 관련 정의, 즉 렌더링으로 인해 발생하는 부작용을 의미합니다. 더 넓은 프로그래밍 개념을 언급하기 위해 "부작용(side effect)"이라고 하겠습니다.

</Note>


## Effect가 필요하지 않을 수도 있습니다 {/*you-might-not-need-an-effect*/}

**컴포넌트에 Effect를 추가하는 것을 서두르지 마세요.** Effect는 일반적으로 React 코드에서 벗어나 외부 시스템과동기화할 때 사용된다는 점을 기억하세요. 여기에는 브라우저 API, 타사 위젯, 네트워크 등이 포함됩니다. Effect가 다른 상태에 따라 일부 상태만 조정하는 경우 [Effect가 필요하지 않을 수도 있습니다.](/learn/you-might-not-need-an-effect)

## Effect를 작성하는 방법 {/*how-to-write-an-effect*/}

Effect를 작성하려면 다음 세 단계를 따르세요:

1. **Effect를 선언합니다.** 기본적으로 Effect는 렌더링할 때마다 실행됩니다.
2. **Effect 의존성을 지정합니다.** 대부분의 Effect는 매번 렌더링할 때마다 실행하는 것이 아니라 *필요할 때만* 다시 실행해야 합니다. 예를 들어 fade-in 애니메이션은 컴포넌트가 나타날 때만 트리거되어야 합니다. 대화방 연결 및 연결 해제는 컴포넌트가 나타났다가 사라지거나 대화방이 변경될 때만 발생해야 합니다. 여러분은 *의존성*을 지정하여 이를 제어하는 방법을 배우게 됩니다.
3. **필요한 경우 정리 수함수를 추가합니다.** 일부 Effect는 수행 중이던 작업을 중지, 실행 취소 또는 정리하는 방법을 지정해야 합니다. 예를 들어, "연결"에는 "연결 끊기", "구독"에는 "구독 취소", "fetch"에는 "취소" 또는 "무시"가 필요합니다. 여러분은 *정리 함수*를 반환하여 이를 수행하는 방법을 배우게 됩니다.

각 단계를 자세히 살펴보겠습니다.

### Step 1: Effect 선언 {/*step-1-declare-an-effect*/}

컴포넌트에서 Effect를 선언하려면 React에서 [`useEffect` Hook](/reference/react/useEffect)을 가져옵니다:

```js
import { useEffect } from 'react';
```

그런 다음 컴포넌트의 최상위 수준에서 호출하고 Effect 안에 코드를 넣습니다:

```js {2-4}
function MyComponent() {
  useEffect(() => {
    // 여기의 코드는 *매번* 렌더링 후에 실행됩니다.
  });
  return <div />;
}
```

컴포넌트가 렌더링될 때마다 React는 화면을 업데이트한 *다음* `useEffect` 내부에서 코드를 실행합니다. 다시 말해, **`useEffect`는 해당 렌더링이 화면에 반영될 때까지 코드 실행을 "지연"시킵니다.**

Effect를 사용하여 외부 시스템과 동기화하는 방법을 살펴봅시다. `<VideoPlayer>` React 컴포넌트를 생각해봅시다. 이 컴포넌트에 `isPlaying` prop을 전달해 재생 또는 일시정지 여부를 제어하면 좋을 것입니다:

```js
<VideoPlayer isPlaying={isPlaying} />;
```

당신의 커스텀 `VideoPlayer` 컴포넌트는 기본 제공 브라우저 [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) 태그를 렌더링합니다:

```js
function VideoPlayer({ src, isPlaying }) {
  // TODO: isPlaying을 사용해서 작업하기
  return <video src={src} />;
}
```

그러나, 브라우저 `<video>` 태그에는 `isPlaying` prop이 없습니다. 이를 제어하는 유일한 방법은 DOM 요소에서 [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) 및 [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) 메서드를 수동으로 호출하는 것입니다. **동영상이 현재 재생 중인지 여부를 알려주는 `isPlaying` prop의 값을 `play()` 및 `pause()`등의 호출과 동기화해야 합니다.**

우리는 먼저 `<video>` DOM 노드에 대한 [참조를 가져와야](/learn/manipulating-the-dom-with-refs) 합니다.

렌더링 중에 `play()` 또는 `pause()`를 호출하고 싶을 수 있지만 이는 올바르지 않습니다:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  if (isPlaying) {
    ref.current.play();  // 렌더링 중에 이 함수를 호출하는 것은 허용되지 않습니다.
  } else {
    ref.current.pause(); // 이 또한, 허용되지 않습니다.
  }

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

이 코드가 올바르지 않은 이유는 렌더링 중에 DOM 노드로 무언가를 하려고 하기 때문입니다. React에서 [렌더링은 JSX의 순수한 계산](/learn/keeping-components-pure)이어야 하며 DOM 수정과 같은 부작용을 포함하지 않아야 합니다.

게다가 `VideoPlayer`를 처음 호출할 때, 그 DOM은 아직 존재하지 않습니다! React는 JSX를 반환할 때까지 어떤 DOM을 생성할지 모르기 때문에 아직 `play()` 또는 `pause()`를 호출할 DOM 노드가 존재하지 않습니다.

여기서 해결책은 **부수 효과를 `useEffect`로 래핑하여 렌더링 계산에서 제외하는 것입니다**:

```js {6,12}
import { useEffect, useRef } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}
```

DOM 업데이트를 Effect에 래핑하면 React가 먼저 화면을 업데이트합니다. 그런 다음 Effect가 실행됩니다.

`VideoPlayer` 컴포넌트가 렌더링될 때(처음 렌더링 되거나 다시 렌더링되는 경우) 몇 가지 일이 발생합니다. 먼저, React가 화면을 업데이트하여 `<video>` 태그가 올바른 props와 함께 DOM에 있는지 확인합니다. 그런 다음 React가 Effect를 실행합니다. 마지막으로 Effect는 `isPlaying`의 값에 따라 `play()` 또는 `pause()`를 호출합니다.

Play/Pause를 여러 번 누르고 동영상 플레이어가 `isPlaying` 값과 어떻게 동기화되는지 확인합니다:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

이 예제에서 React state에 동기화한 "외부 시스템"은 브라우저 media API 였습니다. 당신은 비슷한 접근 방식을 사용하여 레거시 non-React 코드(예: jQuery 플러그인)를 선언적 React 컴포넌트로 래핑할 수 있습니다.

동영상 플레이어를 제어하는 것은 실제로는 훨씬 더 복잡하다는 점에 유의하세요. `play()` 호출이 실패할 수도 있고, 사용자가 내장된 브라우저 컨트롤을 사용하여 재생하거나 일시 정지할 수도 있습니다. 이 예시는 매우 단순하고 불완전합니다.

<Pitfall>

기본적으로 Effect는 렌더링할 때마다 실행됩니다. 그렇기 때문에 이와 같은 코드는 **무한 루프를 생성합니다:**

```js
const [count, setCount] = useState(0);
useEffect(() => {
  setCount(count + 1);
});
```

Effect는 렌더링의 *결과*로 실행됩니다. 상태를 업데이트하면 렌더링이 *트리거*됩니다. Effect에서 상태를 업데이트하는 것은 전원 콘텐트를 자체에 꽂는 것과 같습니다. Effect가 실행되고, 상태를 업데이트하면 다시 렌더링이 발생하고, 다시 렌더링이 발생하면 Effect가 실행되고, 다시 상태를 업데이트하면 또 다시 렌더링이 발생하는 식입니다.

Effect는 보통 컴포넌트를 *외부* 시스템과 동기화해야 합니다. 외부 시스템이 없고 다른 상태를 기반으로 일부 상태만 조정하려는 경우 [Effect가 필요하지 않을 수 있습니다.](/learn/you-might-not-need-an-effect)

</Pitfall>

### Step 2: Effect의 의존성 지정 {/*step-2-specify-the-effect-dependencies*/}

기본적으로 Effect는 렌더링할 때마다 실행됩니다. 종종, 이는 당신이 **원하지 않는 동작일 수 있습니다:**

- 때로는 속도가 느릴 수 있습니다. 외부 시스템과의 동기화가 항상 즉각적인 것은 아니므로 꼭 필요한 경우가 아니라면 동기화를 건너뛰는 것이 좋습니다. 예를 들어, 키 입력 시마다 채팅 서버에 다시 연결하고 싶지는 않을 수 있습니다.
- 때로는 잘못된 경우가 있습니다. 예를 들어 키 입력 시마다 컴포넌트 페이드인 애니메이션을 트리거하고 싶지 않을 수 있습니다. 애니메이션은 컴포넌트가 처음 나타날 때 한 번만 재생되어야 합니다.

이 문제를 설명하기 위해 몇 개의 `console.log` 호출과 부모 컴포넌트의 상태를 업데이트하는 텍스트 입력이 포함된 이전 예시를 보여드리겠습니다. 입력하면 이펙트가 다시 실행되는 것을 확인할 수 있습니다:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Calling video.play()');
      ref.current.play();
    } else {
      console.log('Calling video.pause()');
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

`useEffect` 호출의 두 번째 인수로 *의존성 배열*을 지정하여 React가 **불필요하게 Effect를 다시 실행하는 것을 건너뛰도록** 지시할 수 있습니다. 위의 예시 14라인에 빈 `[]` 배열을 추가하는 것으로 시작하세요:

```js {3}
  useEffect(() => {
    // ...
  }, []);
```

당신은 다음과 같은 에러를 볼 것입니다. `React Hook useEffect has a missing dependency: 'isPlaying'`:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Calling video.play()');
      ref.current.play();
    } else {
      console.log('Calling video.pause()');
      ref.current.pause();
    }
  }, []); // 이로 인해 에러가 발생합니다.

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

문제는 Effect 내부의 코드가 `isPlaying` 프로퍼티에 *의존하여* 수행할 작업을 결정하는데 의존성이 명시적으로 선언되어 있지 않았다는 점입니다. 이 문제를 해결하려면 의존성 배열에 `isPlaying`을 추가하세요.

```js {2,7}
  useEffect(() => {
    if (isPlaying) { // 여기에 사용됩니다...
      // ...
    } else {
      // ...
    }
  }, [isPlaying]); // ...따라서 여기에서 선언해야 합니다!
```

이제 모든 의존성이 선언되었으므로 오류가 없습니다. 의존성 배열로 `[isPlaying]`을 지정하면 React가 `isPlaying`이 이전 렌더링 때와 동일한 경우 Effect를 다시 실행하지 않고 건너뛰도록 지시합니다. 이렇게 변경하면 input에 입력해도 Effect가 다시 실행되지 않지만 Play/Pause 버튼을 누르면 실행됩니다:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Calling video.play()');
      ref.current.play();
    } else {
      console.log('Calling video.pause()');
      ref.current.pause();
    }
  }, [isPlaying]);

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

의존성 배열은 여러 개의 의존성을 포함할 수 있습니다. React는 지정한 *모든* 의존성 값이 이전 렌더링에서 가졌던 값과 정확히 동일한 경우에만 Effect를 다시 실행하는 것을 건너뜁니다. React는 [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 비교를 사용하여 의존성 값을 비교합니다. 자세한 내용은 [`useEffect` reference](/reference/react/useEffect#reference)에서 참조하세요.

**의존성을 "선택"할 수 없다는 점에 유의하세요.** 지정한 의존성이 Effect 내부 코드를 기반으로 React가 예상하는 것과 일치하지 않으면 린트 오류가 발생합니다. 이 오류는 코드에서 많은 버그를 잡는 데 도움이 됩니다. 일부 코드가 다시 실행되는 것을 원하지 않는다면 [해당 의존성이 "필요"하지 않도록 *Effect 코드 자체를 편집하세요.*](/learn/lifecycle-of-reactive-effects#what-to-do-when-you-dont-want-to-re-synchronize)

<Pitfall>

의존성 배열이 없는 경우와 빈 `[]` 의존성 배열이 있는 경우의 동작은 다릅니다:

```js {3,7,11}
useEffect(() => {
  // 모든 렌더링 후에 실행됩니다.
});

useEffect(() => {
  // 마운트 시(컴포넌트가 표시될 때)에만 실행됩니다.
}, []);

useEffect(() => {
  // 마운트 되었을 때 *그리고* 마지막 렌더링 이후 a 또는 b가 변경된 경우에도 실행됩니다.
}, [a, b]);
```

다음 단계에서는 "마운트"가 무엇을 의미하는지 자세히 살펴보겠습니다.

</Pitfall>

<DeepDive>

#### 의존성 배열에서 ref가 생략된 이유는 무엇인가요? {/*why-was-the-ref-omitted-from-the-dependency-array*/}

이 Effect는 `ref`와 `isPlaying`을 _모두_ 사용하지만 의존성으로 선언된 것은 `isPlaying`뿐입니다:

```js {9}
function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);
  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying]);
```

이는 `ref` 객체가 *안정적인 정체성*을 가지고 있기 때문입니다: React는 모든 렌더링에서 동일한 `useRef` 호출에서 [항상 동일한 객체를 얻을 수 있도록](/reference/react/useRef#returns) 보장합니다. 이는 절대 변경되지 않으므로 그 자체로 Effect가 다시 실행되지 않습니다. 따라서 포함 여부는 중요하지 않습니다. 포함해도 괜찮습니다:

```js {9}
function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);
  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying, ref]);
```

`useState`가 반환하는 [`set` 함수](/reference/react/useState#setstate)도 안정적인 정체성을 가지므로 의존성에서 생략되는 경우가 많습니다. 린터를 통해 오류 없이 의존성을 생략할 수 있다면 그렇게 해도 안전합니다.

항상 안정적인 종속성을 생략하는 것은 린터가 오브젝트가 안정적이라는 것을 "인지"할 수 있을 때만 작동합니다. 예를 들어 부모 컴포넌트에서 `ref`를 전달받은 경우 의존성 배열에 이를 지정해야 합니다. 하지만 부모 컴포넌트가 항상 동일한 참조를 전달하는지, 아니면 여러 참조 중 하나를 조건부로 전달하는지 알 수 없기 때문에 이 방법이 좋습니다. 따라서 Effect는 전달되는 참조에 따라 달라집니다.

</DeepDive>

### Step 3: 필요한 경우 정리 함수 추가 {/*step-3-add-cleanup-if-needed*/}

다른 예를 생각해봅시다. 당신은 `ChatRoom`이라는 컴포넌트를 만들고 있고 이 컴포넌트가 나타날 때 채팅 서버에 연결을 해야 합니다. 당신에게는 `connect()` 및 `disconnect()` 메서드가 있는 객체를 반환하는 `createConnection()` API가 제공됩니다. 컴포넌트가 사용자에게 표시되는 동안 어떻게 연결 상태를 유지하나요?

Effect 로직을 작성하여 시작하십시오:

```js
useEffect(() => {
  const connection = createConnection();
  connection.connect();
});
```

리렌더링 이후 채팅에 연결할 때마다 속도가 느려지므로 의존성 배열을 추가합니다:

```js {4}
useEffect(() => {
  const connection = createConnection();
  connection.connect();
}, []);
```

**Effect 내부의 코드는 props나 state를 사용하지 않으므로 의존성 배열은 `[]` (비어있음)입니다. 이는 컴포넌트가 "마운트"될 때, 즉 화면에 처음 나타날 때만 이 코드를 실행하도록 React에 지시합니다.**

이 코드를 실행해 보겠습니다:

<Sandpack>

```js
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
  }, []);
  return <h1>Welcome to the chat!</h1>;
}
```

```js chat.js
export function createConnection() {
  // 실제 구현은 실제로 서버에 연결됩니다
  return {
    connect() {
      console.log('✅ Connecting...');
    },
    disconnect() {
      console.log('❌ Disconnected.');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
```

</Sandpack>

이 Effect는 마운트 시에만 실행되므로 콘솔에서 `"✅ Connecting..."`이 한 번 출력될 것으로 예상할 수 있습니다. **그러나 콘솔을 확인하면 `"✅ Connecting..."`이 두 번 출력됩니다. 왜 이런 현상이 발생하나요?**

`ChatRoom` 컴포넌트가 다양한 화면이 있는 더 큰 앱의 일부라고 상상해 보세요. 사용자는 `ChatRoom` 페이지에서 여정을 시작합니다. 컴포넌트가 마운트하고 `connection.connect()`를 호출합니다. 그런 다음 사용자가 다른 화면(예: 설정 페이지)으로 이동한다고 가정해 보세요. `ChatRoom` 컴포넌트가 언마운트됩니다. 마지막으로 사용자가 뒤로 버튼을 클릭하면 `ChatRoom`이 다시 마운트됩니다. 이렇게 하면 두 번째 연결이 설정되지만 첫 번째 연결은 해제되지 않습니다! 사용자가 앱을 탐색할 때 연결은 계속 쌓이게 됩니다.

이와 같은 버그는 광범위한 수동 테스트 없이는 놓치기 쉽습니다. 버그를 빠르게 발견할 수 있도록 개발 단계에서는 React는 모든 컴포넌트를 최초 마운트 직후에 한 번씩 다시 마운트합니다.

`"✅ Connecting..."` 로그를 두 번 확인하면 컴포넌트가 마운트 해제될 때 코드가 연결을 닫지 않는 실제 문제를 파악하는데 도움이 됩니다.

이 문제를 해결하려면 Effect에서 *정리 함수*를 반환하세요:

```js {4-6}
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []);
```

React는 Effect가 다시 실행되기 전에 매번 정리 함수를 호출하고, 컴포넌트가 언마운트(제거)될 때 마지막으로 한 번 더 호출합니다. 정리 함수가 구현되면 어떤 일이 발생하는지 살펴봅시다:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the chat!</h1>;
}
```

```js chat.js
export function createConnection() {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting...');
    },
    disconnect() {
      console.log('❌ Disconnected.');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
```

</Sandpack>

개발 모드에서 콘솔 로그가 3개가 생겼습니다:

1. `"✅ Connecting..."`
2. `"❌ Disconnected."`
3. `"✅ Connecting..."`

**이것은 개발 모드에서 올바른 동작입니다.** 컴포넌트를 다시 마운트함으로써 React는 다른 곳으로 이동하거나 뒤로 이동해도 코드가 손상되지 않는지 확인합니다. 연결을 끊었다가 다시 연결하는 것이 정확히 일어나야 할 일입니다! 정리 함수를 잘 구현하면 Effect를 한 번 실행하는 것과 Effect를 실행하고 정리한 후 다시 실행하는 것 사이에 사용자에게 보이는 눈에 띄는 차이가 없어야 합니다. React가 개발 중 코드에 버그가 있는지 검사하기 때문에 connect/disconnect 호출 쌍이 추가로 있습니다. 이것은 정상적인 현상이니 없애려고 하지 마세요!

**프로덕션 환경에서는 `"✅ Connecting..."`이 한 번만 출력됩니다.** 컴포넌트를 다시 마운트하는 것은 정리가 필요한 Effect를 찾는 데 도움이 되는 개발 단계에서만 발생합니다. [Strict Mode](/reference/react/StrictMode)를 해제하여 개발 동작을 선택 해제할 수 있지만, 계속 켜두는 것이 좋습니다. 이렇게 하면 위와 같은 버그를 많이 발견할 수 있습니다.

## How to handle the Effect firing twice in development? {/*how-to-handle-the-effect-firing-twice-in-development*/}

React intentionally remounts your components in development to find bugs like in the last example. **The right question isn't "how to run an Effect once", but "how to fix my Effect so that it works after remounting".**

Usually, the answer is to implement the cleanup function.  The cleanup function should stop or undo whatever the Effect was doing. The rule of thumb is that the user shouldn't be able to distinguish between the Effect running once (as in production) and a _setup → cleanup → setup_ sequence (as you'd see in development).

Most of the Effects you'll write will fit into one of the common patterns below.

### Controlling non-React widgets {/*controlling-non-react-widgets*/}

Sometimes you need to add UI widgets that aren't written to React. For example, let's say you're adding a map component to your page. It has a `setZoomLevel()` method, and you'd like to keep the zoom level in sync with a `zoomLevel` state variable in your React code. Your Effect would look similar to this:

```js
useEffect(() => {
  const map = mapRef.current;
  map.setZoomLevel(zoomLevel);
}, [zoomLevel]);
```

Note that there is no cleanup needed in this case. In development, React will call the Effect twice, but this is not a problem because calling `setZoomLevel` twice with the same value does not do anything. It may be slightly slower, but this doesn't matter because it won't remount needlessly in production.

Some APIs may not allow you to call them twice in a row. For example, the [`showModal`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) method of the built-in [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement) element throws if you call it twice. Implement the cleanup function and make it close the dialog:

```js {4}
useEffect(() => {
  const dialog = dialogRef.current;
  dialog.showModal();
  return () => dialog.close();
}, []);
```

In development, your Effect will call `showModal()`, then immediately `close()`, and then `showModal()` again. This has the same user-visible behavior as calling `showModal()` once, as you would see in production.

### Subscribing to events {/*subscribing-to-events*/}

If your Effect subscribes to something, the cleanup function should unsubscribe:

```js {6}
useEffect(() => {
  function handleScroll(e) {
    console.log(window.scrollX, window.scrollY);
  }
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

In development, your Effect will call `addEventListener()`, then immediately `removeEventListener()`, and then `addEventListener()` again with the same handler. So there would be only one active subscription at a time. This has the same user-visible behavior as calling `addEventListener()` once, as in production.

### Triggering animations {/*triggering-animations*/}

If your Effect animates something in, the cleanup function should reset the animation to the initial values:

```js {4-6}
useEffect(() => {
  const node = ref.current;
  node.style.opacity = 1; // Trigger the animation
  return () => {
    node.style.opacity = 0; // Reset to the initial value
  };
}, []);
```

In development, opacity will be set to `1`, then to `0`, and then to `1` again. This should have the same user-visible behavior as setting it to `1` directly, which is what would happen in production. If you use a third-party animation library with support for tweening, your cleanup function should reset the timeline to its initial state.

### Fetching data {/*fetching-data*/}

If your Effect fetches something, the cleanup function should either [abort the fetch](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) or ignore its result:

```js {2,6,13-15}
useEffect(() => {
  let ignore = false;

  async function startFetching() {
    const json = await fetchTodos(userId);
    if (!ignore) {
      setTodos(json);
    }
  }

  startFetching();

  return () => {
    ignore = true;
  };
}, [userId]);
```

You can't "undo" a network request that already happened, but your cleanup function should ensure that the fetch that's _not relevant anymore_ does not keep affecting your application. If the `userId` changes from `'Alice'` to `'Bob'`, cleanup ensures that the `'Alice'` response is ignored even if it arrives after `'Bob'`.

**In development, you will see two fetches in the Network tab.** There is nothing wrong with that. With the approach above, the first Effect will immediately get cleaned up so its copy of the `ignore` variable will be set to `true`. So even though there is an extra request, it won't affect the state thanks to the `if (!ignore)` check.

**In production, there will only be one request.** If the second request in development is bothering you, the best approach is to use a solution that deduplicates requests and caches their responses between components:

```js
function TodoList() {
  const todos = useSomeDataLibrary(`/api/user/${userId}/todos`);
  // ...
```

This will not only improve the development experience, but also make your application feel faster. For example, the user pressing the Back button won't have to wait for some data to load again because it will be cached. You can either build such a cache yourself or use one of the many alternatives to manual fetching in Effects.

<DeepDive>

#### What are good alternatives to data fetching in Effects? {/*what-are-good-alternatives-to-data-fetching-in-effects*/}

Writing `fetch` calls inside Effects is a [popular way to fetch data](https://www.robinwieruch.de/react-hooks-fetch-data/), especially in fully client-side apps. This is, however, a very manual approach and it has significant downsides:

- **Effects don't run on the server.** This means that the initial server-rendered HTML will only include a loading state with no data. The client computer will have to download all JavaScript and render your app only to discover that now it needs to load the data. This is not very efficient.
- **Fetching directly in Effects makes it easy to create "network waterfalls".** You render the parent component, it fetches some data, renders the child components, and then they start fetching their data. If the network is not very fast, this is significantly slower than fetching all data in parallel.
- **Fetching directly in Effects usually means you don't preload or cache data.** For example, if the component unmounts and then mounts again, it would have to fetch the data again.
- **It's not very ergonomic.** There's quite a bit of boilerplate code involved when writing `fetch` calls in a way that doesn't suffer from bugs like [race conditions.](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect)

This list of downsides is not specific to React. It applies to fetching data on mount with any library. Like with routing, data fetching is not trivial to do well, so we recommend the following approaches:

- **If you use a [framework](/learn/start-a-new-react-project#production-grade-react-frameworks), use its built-in data fetching mechanism.** Modern React frameworks have integrated data fetching mechanisms that are efficient and don't suffer from the above pitfalls.
- **Otherwise, consider using or building a client-side cache.** Popular open source solutions include [React Query](https://tanstack.com/query/latest), [useSWR](https://swr.vercel.app/), and [React Router 6.4+.](https://beta.reactrouter.com/en/main/start/overview) You can build your own solution too, in which case you would use Effects under the hood, but add logic for deduplicating requests, caching responses, and avoiding network waterfalls (by preloading data or hoisting data requirements to routes).

You can continue fetching data directly in Effects if neither of these approaches suit you.

</DeepDive>

### Sending analytics {/*sending-analytics*/}

Consider this code that sends an analytics event on the page visit:

```js
useEffect(() => {
  logVisit(url); // Sends a POST request
}, [url]);
```

In development, `logVisit` will be called twice for every URL, so you might be tempted to try to fix that. **We recommend keeping this code as is.** Like with earlier examples, there is no *user-visible* behavior difference between running it once and running it twice. From a practical point of view, `logVisit` should not do anything in development because you don't want the logs from the development machines to skew the production metrics. Your component remounts every time you save its file, so it logs extra visits in development anyway.

**In production, there will be no duplicate visit logs.**

To debug the analytics events you're sending, you can deploy your app to a staging environment (which runs in production mode) or temporarily opt out of [Strict Mode](/reference/react/StrictMode) and its development-only remounting checks. You may also send analytics from the route change event handlers instead of Effects. For more precise analytics, [intersection observers](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) can help track which components are in the viewport and how long they remain visible.

### Not an Effect: Initializing the application {/*not-an-effect-initializing-the-application*/}

Some logic should only run once when the application starts. You can put it outside your components:

```js {2-3}
if (typeof window !== 'undefined') { // Check if we're running in the browser.
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ...
}
```

This guarantees that such logic only runs once after the browser loads the page.

### Not an Effect: Buying a product {/*not-an-effect-buying-a-product*/}

Sometimes, even if you write a cleanup function, there's no way to prevent user-visible consequences of running the Effect twice. For example, maybe your Effect sends a POST request like buying a product:

```js {2-3}
useEffect(() => {
  // 🔴 Wrong: This Effect fires twice in development, exposing a problem in the code.
  fetch('/api/buy', { method: 'POST' });
}, []);
```

You wouldn't want to buy the product twice. However, this is also why you shouldn't put this logic in an Effect. What if the user goes to another page and then presses Back? Your Effect would run again. You don't want to buy the product when the user *visits* a page; you want to buy it when the user *clicks* the Buy button.

Buying is not caused by rendering; it's caused by a specific interaction. It should run only when the user presses the button. **Delete the Effect and move your `/api/buy` request into the Buy button event handler:**

```js {2-3}
  function handleClick() {
    // ✅ Buying is an event because it is caused by a particular interaction.
    fetch('/api/buy', { method: 'POST' });
  }
```

**This illustrates that if remounting breaks the logic of your application, this usually uncovers existing bugs.** From the user's perspective, visiting a page shouldn't be different from visiting it, clicking a link, and pressing Back. React verifies that your components abide by this principle by remounting them once in development.

## Putting it all together {/*putting-it-all-together*/}

This playground can help you "get a feel" for how Effects work in practice.

This example uses [`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout) to schedule a console log with the input text to appear three seconds after the Effect runs. The cleanup function cancels the pending timeout. Start by pressing "Mount the component":

<Sandpack>

```js
import { useState, useEffect } from 'react';

function Playground() {
  const [text, setText] = useState('a');

  useEffect(() => {
    function onTimeout() {
      console.log('⏰ ' + text);
    }

    console.log('🔵 Schedule "' + text + '" log');
    const timeoutId = setTimeout(onTimeout, 3000);

    return () => {
      console.log('🟡 Cancel "' + text + '" log');
      clearTimeout(timeoutId);
    };
  }, [text]);

  return (
    <>
      <label>
        What to log:{' '}
        <input
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </label>
      <h1>{text}</h1>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Unmount' : 'Mount'} the component
      </button>
      {show && <hr />}
      {show && <Playground />}
    </>
  );
}
```

</Sandpack>

You will see three logs at first: `Schedule "a" log`, `Cancel "a" log`, and `Schedule "a" log` again. Three second later there will also be a log saying `a`. As you learned earlier, the extra schedule/cancel pair is because React remounts the component once in development to verify that you've implemented cleanup well.

Now edit the input to say `abc`. If you do it fast enough, you'll see `Schedule "ab" log` immediately followed by `Cancel "ab" log` and `Schedule "abc" log`. **React always cleans up the previous render's Effect before the next render's Effect.** This is why even if you type into the input fast, there is at most one timeout scheduled at a time. Edit the input a few times and watch the console to get a feel for how Effects get cleaned up.

Type something into the input and then immediately press "Unmount the component". Notice how unmounting cleans up the last render's Effect. Here, it clears the last timeout before it has a chance to fire.

Finally, edit the component above and comment out the cleanup function so that the timeouts don't get cancelled. Try typing `abcde` fast. What do you expect to happen in three seconds? Will `console.log(text)` inside the timeout print the *latest* `text` and produce five `abcde` logs? Give it a try to check your intuition!

Three seconds later, you should see a sequence of logs (`a`, `ab`, `abc`, `abcd`, and `abcde`) rather than five `abcde` logs. **Each Effect "captures" the `text` value from its corresponding render.**  It doesn't matter that the `text` state changed: an Effect from the render with `text = 'ab'` will always see `'ab'`. In other words, Effects from each render are isolated from each other. If you're curious how this works, you can read about [closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures).

<DeepDive>

#### Each render has its own Effects {/*each-render-has-its-own-effects*/}

You can think of `useEffect` as "attaching" a piece of behavior to the render output. Consider this Effect:

```js
export default function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to {roomId}!</h1>;
}
```

Let's see what exactly happens as the user navigates around the app.

#### Initial render {/*initial-render*/}

The user visits `<ChatRoom roomId="general" />`. Let's [mentally substitute](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time) `roomId` with `'general'`:

```js
  // JSX for the first render (roomId = "general")
  return <h1>Welcome to general!</h1>;
```

**The Effect is *also* a part of the rendering output.** The first render's Effect becomes:

```js
  // Effect for the first render (roomId = "general")
  () => {
    const connection = createConnection('general');
    connection.connect();
    return () => connection.disconnect();
  },
  // Dependencies for the first render (roomId = "general")
  ['general']
```

React runs this Effect, which connects to the `'general'` chat room.

#### Re-render with same dependencies {/*re-render-with-same-dependencies*/}

Let's say `<ChatRoom roomId="general" />` re-renders. The JSX output is the same:

```js
  // JSX for the second render (roomId = "general")
  return <h1>Welcome to general!</h1>;
```

React sees that the rendering output has not changed, so it doesn't update the DOM.

The Effect from the second render looks like this:

```js
  // Effect for the second render (roomId = "general")
  () => {
    const connection = createConnection('general');
    connection.connect();
    return () => connection.disconnect();
  },
  // Dependencies for the second render (roomId = "general")
  ['general']
```

React compares `['general']` from the second render with `['general']` from the first render. **Because all dependencies are the same, React *ignores* the Effect from the second render.** It never gets called.

#### Re-render with different dependencies {/*re-render-with-different-dependencies*/}

Then, the user visits `<ChatRoom roomId="travel" />`. This time, the component returns different JSX:

```js
  // JSX for the third render (roomId = "travel")
  return <h1>Welcome to travel!</h1>;
```

React updates the DOM to change `"Welcome to general"` into `"Welcome to travel"`.

The Effect from the third render looks like this:

```js
  // Effect for the third render (roomId = "travel")
  () => {
    const connection = createConnection('travel');
    connection.connect();
    return () => connection.disconnect();
  },
  // Dependencies for the third render (roomId = "travel")
  ['travel']
```

React compares `['travel']` from the third render with `['general']` from the second render. One dependency is different: `Object.is('travel', 'general')` is `false`. The Effect can't be skipped.

**Before React can apply the Effect from the third render, it needs to clean up the last Effect that _did_ run.** The second render's Effect was skipped, so React needs to clean up the first render's Effect. If you scroll up to the first render, you'll see that its cleanup calls `disconnect()` on the connection that was created with `createConnection('general')`. This disconnects the app from the `'general'` chat room.

After that, React runs the third render's Effect. It connects to the `'travel'` chat room.

#### Unmount {/*unmount*/}

Finally, let's say the user navigates away, and the `ChatRoom` component unmounts. React runs the last Effect's cleanup function. The last Effect was from the third render. The third render's cleanup destroys the `createConnection('travel')` connection. So the app disconnects from the `'travel'` room.

#### Development-only behaviors {/*development-only-behaviors*/}

When [Strict Mode](/reference/react/StrictMode) is on, React remounts every component once after mount (state and DOM are preserved). This [helps you find Effects that need cleanup](#step-3-add-cleanup-if-needed) and exposes bugs like race conditions early. Additionally, React will remount the Effects whenever you save a file in development. Both of these behaviors are development-only.

</DeepDive>

<Recap>

- Unlike events, Effects are caused by rendering itself rather than a particular interaction.
- Effects let you synchronize a component with some external system (third-party API, network, etc).
- By default, Effects run after every render (including the initial one).
- React will skip the Effect if all of its dependencies have the same values as during the last render.
- You can't "choose" your dependencies. They are determined by the code inside the Effect.
- Empty dependency array (`[]`) corresponds to the component "mounting", i.e. being added to the screen.
- In Strict Mode, React mounts components twice (in development only!) to stress-test your Effects.
- If your Effect breaks because of remounting, you need to implement a cleanup function.
- React will call your cleanup function before the Effect runs next time, and during the unmount.

</Recap>

<Challenges>

#### Focus a field on mount {/*focus-a-field-on-mount*/}

In this example, the form renders a `<MyInput />` component.

Use the input's [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) method to make `MyInput` automatically focus when it appears on the screen. There is already a commented out implementation, but it doesn't quite work. Figure out why it doesn't work, and fix it. (If you're familiar with the `autoFocus` attribute, pretend that it does not exist: we are reimplementing the same functionality from scratch.)

<Sandpack>

```js MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ value, onChange }) {
  const ref = useRef(null);

  // TODO: This doesn't quite work. Fix it.
  // ref.current.focus()    

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('Taylor');
  const [upper, setUpper] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your name:
            <MyInput
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={upper}
              onChange={e => setUpper(e.target.checked)}
            />
            Make it uppercase
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>


To verify that your solution works, press "Show form" and verify that the input receives focus (becomes highlighted and the cursor is placed inside). Press "Hide form" and "Show form" again. Verify the input is highlighted again.

`MyInput` should only focus _on mount_ rather than after every render. To verify that the behavior is right, press "Show form" and then repeatedly press the "Make it uppercase" checkbox. Clicking the checkbox should _not_ focus the input above it.

<Solution>

Calling `ref.current.focus()` during render is wrong because it is a *side effect*. Side effects should either be placed inside an event handler or be declared with `useEffect`. In this case, the side effect is _caused_ by the component appearing rather than by any specific interaction, so it makes sense to put it in an Effect.

To fix the mistake, wrap the `ref.current.focus()` call into an Effect declaration. Then, to ensure that this Effect runs only on mount rather than after every render, add the empty `[]` dependencies to it.

<Sandpack>

```js MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ value, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    ref.current.focus();
  }, []);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('Taylor');
  const [upper, setUpper] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your name:
            <MyInput
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={upper}
              onChange={e => setUpper(e.target.checked)}
            />
            Make it uppercase
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

</Solution>

#### Focus a field conditionally {/*focus-a-field-conditionally*/}

This form renders two `<MyInput />` components.

Press "Show form" and notice that the second field automatically gets focused. This is because both of the `<MyInput />` components try to focus the field inside. When you call `focus()` for two input fields in a row, the last one always "wins".

Let's say you want to focus the first field. The first `MyInput` component now receives a boolean `shouldFocus` prop set to `true`. Change the logic so that `focus()` is only called if the `shouldFocus` prop received by `MyInput` is `true`.

<Sandpack>

```js MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ shouldFocus, value, onChange }) {
  const ref = useRef(null);

  // TODO: call focus() only if shouldFocus is true.
  useEffect(() => {
    ref.current.focus();
  }, []);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  const [upper, setUpper] = useState(false);
  const name = firstName + ' ' + lastName;
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your first name:
            <MyInput
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              shouldFocus={true}
            />
          </label>
          <label>
            Enter your last name:
            <MyInput
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              shouldFocus={false}
            />
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

To verify your solution, press "Show form" and "Hide form" repeatedly. When the form appears, only the *first* input should get focused. This is because the parent component renders the first input with `shouldFocus={true}` and the second input with `shouldFocus={false}`. Also check that both inputs still work and you can type into both of them.

<Hint>

You can't declare an Effect conditionally, but your Effect can include conditional logic.

</Hint>

<Solution>

Put the conditional logic inside the Effect. You will need to specify `shouldFocus` as a dependency because you are using it inside the Effect. (This means that if some input's `shouldFocus` changes from `false` to `true`, it will focus after mount.)

<Sandpack>

```js MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ shouldFocus, value, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    if (shouldFocus) {
      ref.current.focus();
    }
  }, [shouldFocus]);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  const [upper, setUpper] = useState(false);
  const name = firstName + ' ' + lastName;
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your first name:
            <MyInput
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              shouldFocus={true}
            />
          </label>
          <label>
            Enter your last name:
            <MyInput
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              shouldFocus={false}
            />
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

</Solution>

#### Fix an interval that fires twice {/*fix-an-interval-that-fires-twice*/}

This `Counter` component displays a counter that should increment every second. On mount, it calls [`setInterval`.](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) This causes `onTick` to run every second. The `onTick` function increments the counter.

However, instead of incrementing once per second, it increments twice. Why is that? Find the cause of the bug and fix it.

<Hint>

Keep in mind that `setInterval` returns an interval ID, which you can pass to [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval) to stop the interval.

</Hint>

<Sandpack>

```js Counter.js active
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function onTick() {
      setCount(c => c + 1);
    }

    setInterval(onTick, 1000);
  }, []);

  return <h1>{count}</h1>;
}
```

```js App.js hidden
import { useState } from 'react';
import Counter from './Counter.js';

export default function Form() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} counter</button>
      <br />
      <hr />
      {show && <Counter />}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

<Solution>

When [Strict Mode](/reference/react/StrictMode) is on (like in the sandboxes on this site), React remounts each component once in development. This causes the interval to be set up twice, and this is why each second the counter increments twice.

However, React's behavior is not the *cause* of the bug: the bug already exists in the code. React's behavior makes the bug more noticeable. The real cause is that this Effect starts a process but doesn't provide a way to clean it up.

To fix this code, save the interval ID returned by `setInterval`, and implement a cleanup function with [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval):

<Sandpack>

```js Counter.js active
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function onTick() {
      setCount(c => c + 1);
    }

    const intervalId = setInterval(onTick, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return <h1>{count}</h1>;
}
```

```js App.js hidden
import { useState } from 'react';
import Counter from './Counter.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} counter</button>
      <br />
      <hr />
      {show && <Counter />}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

In development, React will still remount your component once to verify that you've implemented cleanup well. So there will be a `setInterval` call, immediately followed by `clearInterval`, and `setInterval` again. In production, there will be only one `setInterval` call. The user-visible behavior in both cases is the same: the counter increments once per second.

</Solution>

#### Fix fetching inside an Effect {/*fix-fetching-inside-an-effect*/}

This component shows the biography for the selected person. It loads the biography by calling an asynchronous function `fetchBio(person)` on mount and whenever `person` changes. That asynchronous function returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) which eventually resolves to a string. When fetching is done, it calls `setBio` to display that string under the select box.

<Sandpack>

```js App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);

  useEffect(() => {
    setBio(null);
    fetchBio(person).then(result => {
      setBio(result);
    });
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Loading...'}</i></p>
    </>
  );
}
```

```js api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('This is ' + person + '’s bio.');
    }, delay);
  })
}

```

</Sandpack>


There is a bug in this code. Start by selecting "Alice". Then select "Bob" and then immediately after that select "Taylor". If you do this fast enough, you will notice that bug: Taylor is selected, but the paragraph below says "This is Bob's bio."

Why does this happen? Fix the bug inside this Effect.

<Hint>

If an Effect fetches something asynchronously, it usually needs cleanup.

</Hint>

<Solution>

To trigger the bug, things need to happen in this order:

- Selecting `'Bob'` triggers `fetchBio('Bob')`
- Selecting `'Taylor'` triggers `fetchBio('Taylor')`
- **Fetching `'Taylor'` completes *before* fetching `'Bob'`**
- The Effect from the `'Taylor'` render calls `setBio('This is Taylor’s bio')`
- Fetching `'Bob'` completes
- The Effect from the `'Bob'` render calls `setBio('This is Bob’s bio')`

This is why you see Bob's bio even though Taylor is selected. Bugs like this are called [race conditions](https://en.wikipedia.org/wiki/Race_condition) because two asynchronous operations are "racing" with each other, and they might arrive in an unexpected order.

To fix this race condition, add a cleanup function:

<Sandpack>

```js App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);
  useEffect(() => {
    let ignore = false;
    setBio(null);
    fetchBio(person).then(result => {
      if (!ignore) {
        setBio(result);
      }
    });
    return () => {
      ignore = true;
    }
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Loading...'}</i></p>
    </>
  );
}
```

```js api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('This is ' + person + '’s bio.');
    }, delay);
  })
}

```

</Sandpack>

Each render's Effect has its own `ignore` variable. Initially, the `ignore` variable is set to `false`. However, if an Effect gets cleaned up (such as when you select a different person), its `ignore` variable becomes `true`. So now it doesn't matter in which order the requests complete. Only the last person's Effect will have `ignore` set to `false`, so it will call `setBio(result)`. Past Effects have been cleaned up, so the `if (!ignore)` check will prevent them from calling `setBio`:

- Selecting `'Bob'` triggers `fetchBio('Bob')`
- Selecting `'Taylor'` triggers `fetchBio('Taylor')` **and cleans up the previous (Bob's) Effect**
- Fetching `'Taylor'` completes *before* fetching `'Bob'`
- The Effect from the `'Taylor'` render calls `setBio('This is Taylor’s bio')`
- Fetching `'Bob'` completes
- The Effect from the `'Bob'` render **does not do anything because its `ignore` flag was set to `true`**

In addition to ignoring the result of an outdated API call, you can also use [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) to cancel the requests that are no longer needed. However, by itself this is not enough to protect against race conditions. More asynchronous steps could be chained after the fetch, so using an explicit flag like `ignore` is the most reliable way to fix this type of problems.

</Solution>

</Challenges>

