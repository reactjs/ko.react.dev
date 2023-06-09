---
title: Effect로 동기화
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

**프로덕션 환경에서는 `"✅ Connecting..."`이 한 번만 출력됩니다.** 컴포넌트를 다시 마운트하는 것은 정리가 필요한 Effect를 찾는 데 도움이 되는 개발 단계에서만 발생합니다. [엄격 모드](/reference/react/StrictMode)를 해제하여 개발 동작을 선택 해제할 수 있지만, 계속 켜두는 것이 좋습니다. 이렇게 하면 위와 같은 버그를 많이 발견할 수 있습니다.

## 개발 과정에서 Effect가 두 번 발생하면 어떻게 처리하나요? {/*how-to-handle-the-effect-firing-twice-in-development*/}

React는 지난 예제에서와 같이 버그를 찾기 위해 개발 중에 컴포넌트를 의도적으로 다시 마운트합니다. **올바른 질문은 "어떻게 Effect를 한 번 실행하는가?"가 아니라 "어떻게 Effect를 다시 마운트한 후 작동하도록 수정하는가"입니다.**

일반적으로 정답은 정리 함수를 구현하는 것입니다. 정리 함수를 사용하면 Effect가 수행하던 작업을 중지하거나 취소할 수 있습니다. 경험상 사용자가 한 번 실행되는 Effect(프로덕션 환경)와 _설정_ -> _정리_ -> _설정_ 순서(개발 환경)를 구분할 수 없어야 한다는 것입니다.

작성하게 될 대부분의 Effect는 아래의 일반적인 패턴 중 하나에 해당합니다.

### non-React 위젯 제어 {/*controlling-non-react-widgets*/}

때때로 React로 작성되지 않은 UI 위젯을 추가해야 할 때가 있습니다. 예를 들어 페이지에 지도 컴포넌트를 추가한다고 가정해 보겠습니다. 이 컴포넌트에는 `setZoomLevel` 메서드가 있으며, React 코드의 `zoomLevel` 상태 변수와 줌 레벨을 동기화하고자 합니다. Effect는 다음과 비슷하게 보일 것입니다:

```js
useEffect(() => {
  const map = mapRef.current;
  map.setZoomLevel(zoomLevel);
}, [zoomLevel]);
```

이 경우 정리가 필요하지 않습니다. 개발 단계에서 React는 Effect를 두 번 호출하지만, 같은 값으로 `setZoomLevel`을 두 번 호출해도 아무 일도 일어나지 않으므로 문제가 되지 않습니다. 속도가 약간 느려질 수 있지만 프로덕션에서는 불필요하게 다시 마운트되지 않으므로 문제가 되지 않습니다.

일부 API는 연속으로 두 번 호출하는 것을 허용하지 않을 수 있습니다. 예를 들어, 내장된 [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement) 요소의 [`showModal`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) 메서드는 두 번 호출하면 throw됩니다. 정리 함수를 구현하고 대화 상자를 닫도록 합니다:

```js {4}
useEffect(() => {
  const dialog = dialogRef.current;
  dialog.showModal();
  return () => dialog.close();
}, []);
```

개발 환경에서 Effect는 `showModal()`를 호출한 다음 즉시 `close()`를 호출한 다음 다시 `showModal`를 호출합니다. 이는 프로덕션 환경에서 볼 수 있는 것처럼 `showModal()`을 한 번 호출하는 것과 동일하게 사용자에게 보여집니다.

### 이벤트 구독 {/*subscribing-to-events*/}

Effect가 무언가를 구독하는 경우 정리 함수에서 구독을 취소해야 합니다:

```js {6}
useEffect(() => {
  function handleScroll(e) {
    console.log(window.scrollX, window.scrollY);
  }
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

개발 환경에서 Effect는 `addEventListener()`를 호출한 다음 즉시 `removeEventListener()`를 호출한 다음 동일한 핸들러로 다시 `addEventListener()`를 호출합니다. 따라서 한 번에 하나의 활성 구독만 있을 수 있습니다. 이는 프로덕션 환경에서와 같이 `addEventListener()`를 한 번 호출하는 것과 동일하게 사용자에게 보여집니다.

### 애니메이션 트리거 {/*triggering-animations*/}

Effect가 무언가를 애니메이션화하는 경우 정리 함수는 애니메이션을 초기 값으로 재설정해야 합니다:

```js {4-6}
useEffect(() => {
  const node = ref.current;
  node.style.opacity = 1; // 애니메이션 트리거
  return () => {
    node.style.opacity = 0; // 초기 값으로 재설정
  };
}, []);
```

개발 환경에서는 불투명도를 `1`로 설정한 다음, `0`으로 설정한 다음, 다시 `1`로 설정합니다. 이렇게 하면 프로덕션에서 직접 `1`로 설정하는 것과 동일하게 사용자에게 표시됩니다. Tweening을 지원하는 타사 애니메이션 라이브러리를 사용하는 경우 정리 함수를 사용하면 타기임라인이 초기 상태로 재설정됩니다.

### 데이터 가져오기 {/*fetching-data*/}

Effect가 무언가를 가져오는 경우, 정리 함수는 [가져오기를 중단](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)하거나 결과를 무시해야합니다:

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

이미 발생한 네트워크 요청을 "실행 취소"할 수는 없지만, 정리 함수를 사용하면 _더 이상 관련성이 없는_ 가져오기가 애플리케이션에 계속 영향을 미치지 않도록 할 수 있습니다. `userId`가 `Alice`에서 `Bob`으로 변경된 경우, 정리 함수는 `Alice`에 대한 응답이 `Bob` 이후에 도착하더라도 응답을 무시하도록 보장합니다.

**개발 환경에서 네트워크 탭에 두 개의 가져오기가 표시됩니다.** 잘못된 것은 없습니다. 위의 접근 방식을 사용하면 첫 번째 Effect가 즉시 정리되어 `ignore` 변수의 복사본이 `true`로 설정됩니다. 따라서 추가 요청이 있더라도 `if (!ignore)` 검사 덕분에 상태에 영향을 미치지 않습니다.

**프로덕션 환경에서는 요청이 하나만 있을 것입니다.** 개발 환경에서 두 번째 요청이 번거로운 경우 요청의 중복을 제거하고 컴포넌트 간에 응답을 캐시하는 솔루션을 사용하는 것이 가장 좋은 방법입니다:

```js
function TodoList() {
  const todos = useSomeDataLibrary(`/api/user/${userId}/todos`);
  // ...
```

이렇게 하면 개발 환경이 개선될 뿐만 아니라 애플리케이션의 속도도 빨라집니다. 예를 들어 사용자가 뒤로가기 버튼을 누르면 일부 데이터가 캐시되므로 다시 로드될 때까지 기다릴 필요가 없습니다. 이러한 캐시를 직접 구축하거나 Effect에서 수동 가져오기를 대체하는 여러 방법 중 하나를 사용할 수 있습니다.

<DeepDive>

#### Effect에서 데이터 가져오기를 대체하는 좋은 대안은 무엇인가요? {/*what-are-good-alternatives-to-data-fetching-in-effects*/}

특히 완전한 클라이언트 측 앱에서 Effect 내에서 `fetch`를 호출해서 데이터를 가져오는 것은 [널리 사용되는 방법](https://www.robinwieruch.de/react-hooks-fetch-data/)입니다. 그러나 이것은 매우 수동적인 접근 방식이며 상당한 단점이 있습니다:

- **Effect는 서버에서 실행되지 않습니다.** 즉, 초기 서버에서 렌더링되는 HTML에는 데이터가 없는 로딩 상태만 포함됩니다. 클라이언트 컴퓨터는 모든 자바스크립트를 다운로드하고 앱을 렌더링해야만 이제 데이터를 로드해야 한다는 것을 알게 됩니다. 이는 매우 효율적이지 않습니다.
- **Effect에서 직접 가져오기를 사용하면 "Network waterfalls"를 쉽게 만들 수 있습니다.** 부모 컴포넌트를 렌더링하면 일부 데이터를 가져오고, 자식 컴포넌트를 렌더링하면 자식 컴포넌트가 데이터 가져오기 시작합니다. 네트워크가 매우 빠르지 않은 경우 모든 데이터를 병렬로 가져오는 것보다 훨씬 느립니다.
- **Effect에서 직접 가져오기는 일반적으로 데이터를 미리 로드하거나 캐시하지 않는다는 의미입니다.** 예를 들어 컴포넌트가 언마운트했다가 다시 마운트하는 경우 데이터를 다시 가져와야 합니다.
- **인체공학적이지 않습니다.** [경쟁 조건](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect)과 같은 버그가 발생하지 않는 방식으로 가져오기 호출을 작성할 때는 꽤 많은 상용구 코드가 필요합니다.

이 단점 목록은 React에만 국한된 것이 아닙니다. 모든 라이브러리를 사용한 마운트에서 데이터를 가져올 때 적용됩니다. 라우팅과 마찬가지로 데이터 불러오기도 제대로 수행하기가 쉽지 않으므로 다음과 같은 접근 방식을 권장합니다:

- **프레임워크를 사용하는 경우 [프레임워크](/learn/start-a-new-react-project#production-grade-react-frameworks)에 내장된 데이터 불러오기 메커니즘을 사용하세요.**  최신 React 프레임워크는 효율적이고 위의 함정을 겪지 않는 통합 데이터 불러오기 메커니즘을 갖추고 있습니다.
- **그렇지 않으면 클라이언트 측 캐시를 사용하거나 만드는 것이 좋습니다.** 인기 있는 오픈 소스 솔루션으로는 [React Query](https://tanstack.com/query/latest), [useSWR](https://swr.vercel.app/), [React Router 6.4+.](https://beta.reactrouter.com/en/main/start/overview)가 있습니다. 자체 솔루션을 구축할 수도 있는데, 이 경우 내부적으로 Effect를 사용하되 요청 중복 제거, 응답 캐싱, Network waterfall 방지(데이터 사전 로드 또는 라우트에 데이터 요구 사항 올리기)를 위한 로직을 추가할 수 있습니다.

이 두 가지 방법 중 어느 것도 적합하지 않은 경우 Effect에서 직접 데이터를 계속 가져올 수 있습니다.

</DeepDive>

### 분석 전송 {/*sending-analytics*/}

페이지 방문 시 애널리틱스 이벤트를 전송하는 이 코드를 살펴보겠습니다:

```js
useEffect(() => {
  logVisit(url); // POST 요청을 보냄
}, [url]);
```

개발 환경에서는 모든 URL에 대해 `logVisit`이 두 번 호출되므로 이 문제를 해결하고 싶을 수 있습니다. **우리는 이 코드를 그대로 유지하는 것을 추천합니다.** 앞의 예시와 마찬가지로 한 번 실행하는 것과 두 번 실행하는 것 사이에는 *사용자가 볼 수 있는* 동작의 차이가 없습니다. 실용적인 관점에서 볼 때, 개발 기기의 로그가 프로덕션 메트릭을 왜곡하는 것을 원치 않기 때문에 `logVisit`은 개발 단계에서 아무 작업도 수행해서는 안 됩니다. 컴포넌트는 파일을 저장할 때마다 다시 마운트되므로 어쨋든 개발 과정에서 추가 방문을 기록합니다.

**프로덕션 환경에서는, 중복된 방문 로그가 없습니다.**

전송 중인 분석 이벤트를 디버깅하려면 앱을 스테이징 환경(프로덕션 모드에서 실행)에 배포하거나 [엄격 모드](/reference/react/StrictMode)의 개발 전용 리마운트 체크를 일시적으로 해제할 수 있습니다.  Effect 대신 라우트 변경 이벤트 핸들러에서 분석을 전송할 수도 있습니다. 보다 정확한 분석을 위해 [intersection observers](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)를 사용하면 뷰포트에 어떤 컴포넌트가 있는지, 얼마나 오래 표시되는지 추적할 수 있습니다.

### Effect가 아닌 것: 애플리케이션 초기화 {/*not-an-effect-initializing-the-application*/}

일부 로직은 애플리케이션이 시작할 때 한 번만 실행되어야 합니다. 당신은 이를 컴포넌트 외부에 배치할 수 있습니다:

```js {2-3}
if (typeof window !== 'undefined') { // 브라우저에서 실행 중인지 확인합니다.
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ...
}
```

이렇게 하면 브라우저가 페이지를 로드한 후 해당 로직이 한 번만 실행되도록 보장합니다.

### Effect가 아닌 것: 제품을 사는 것 {/*not-an-effect-buying-a-product*/}

가끔 정리 함수를 작성하더라도 사용자가 Effect를 두 번 실행하는 결과를 방지할 방법이 없는 경우가 있습니다. 예를 들어 Effect가 제품 구매와 같은 POST 요청을 전송할 수 있습니다:

```js {2-3}
useEffect(() => {
  // 🔴 Wrong: 이 Effect는 개발 중에 두 번 실행되어 코드에 문제가 있음을 노출합니다.
  fetch('/api/buy', { method: 'POST' });
}, []);
```

당신은 제품을 두 번 구매하고 싶지 않을 것입니다. 하지만 이 로직을 Effect에 넣지 말아야 하는 이유도 바로 여기에 있습니다. 사용자가 다른 페이지로 이동한 후 뒤로가기 버튼을 누르면 어떻게 되나요? Effect가 다시 실행됩니다. 사용자가 페이지를 *방문*했을 때 제품을 구매하는 것이 아니라 사용자가 구매 버튼을 *클릭*했을 때 제품을 구매하기를 원합니다.

구매는 렌더링이 아니라 특정 상호 작용으로 인해 발생합니다. 사용자가 버튼을 누를 때만 실행되어야 합니다. **Effect를 삭제하고 `/api/buy` 요청을 구매 버튼 이벤트 핸들러로 이동합니다**:

```js {2-3}
  function handleClick() {
    // ✅ 구매는 특정 상호 작용으로 인해 발생하므로 이벤트입니다.
    fetch('/api/buy', { method: 'POST' });
  }
```

**이는 다시 마운트하면 애플리케이션의 로직이 깨지는 경우 일반적으로 기존 버그가 발견된다는 것을 보여줍니다.** 사용자 관점에서 페이지를 방문하는 것이 페이지를 방문하고 링크를 클릭한 다음 뒤로가기 버튼을 누르는 것과 다르지 않아야 합니다. React는 개발 단계에서 컴포넌트를 한 번 다시 마운트하여 이 원칙을 준수하는지 확인합니다.

## 모든 것을 종합하기 {/*putting-it-all-together*/}

이 플레이그라운드를 통해 실제로 Effect가 어떻게 작동하는지 "느껴볼" 수 있습니다.

이 예에서는 [`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout)을 사용하여 Effect가 실행된 후 3초 후에 입력 텍스트가 포함된 콘솔 로그가 표시되도록 예약합니다. 정리 함수는 보류 중인 시간 초과를 취소합니다. "컴포넌트 마운트"를 눌러 시작하세요:

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

처음에 세 개의 로그가 표시됩니다: `Schedule "a" log`, `Cancel "a" log`, 다시 `Schedule "a" log`가 표시됩니다. 3초 후에는 `a`라는 로그가 표시됩니다. 앞서 배운 것처럼, schedule/cancel 쌍이 추가되는 이유는 React가 개발 단계에서 컴포넌트를 한 번 다시 마운트하여 정리 함수를 잘 구현했는지 확인하기 때문입니다.

이제 입력을 `abc`로 수정합니다. 충분히 빠르게 수행하면 `Schedule "ab" log` 뒤에 바로 `Cancel "ab" log`와 `Schedule "abc" log`가 표시됩니다. **React는 항상 다음 렌더링의 Effect 전에 이전 렌더링의 Effect를 정리합니다.** 그렇기 때문에 입력을 빠르게 입력하더라도 한 번에 최대 한 번만 타임아웃이 예약됩니다. 입력을 몇 번 편집하고 콘솔을 보면서 Effect가 어떻게 정리되는지 느껴보세요.

입력에 무언가를 입력한 다음 즉시 "컴포넌트 마운트 해제"를 누릅니다. 마운트를 해제하면 마지막 렌더링의 Effect가 어떻게 정리되는지 보세요. 여기서는 Effect가 실행될 기회를 갖기 전에 마지막 타임아웃을 지웁니다.

마지막으로, 위의 컴포넌트를 편집하고 정리 함수를 주석 처리하여 시간 초과가 취소되지 않도록 합니다. `abcde`를 빠르게 입력해보세요. What do you expect to happen in three seconds? 3초 후에 어떤 일이 일어날 것으로 예상하시나요? 시간 초과 내에 `console.log(text)`가 *최신* 텍스트를 출력하고 5개의 `abcde` 로그를 생성할까요? 여러분의 직관을 확인해보세요!

3초 후, 5개의 `abcde` 로그가 아니라 일련의 로그(`a`, `ab`, `abc`, `abcd`, `abcde`)가 표시되어야 합니다. **각 Effect는 해당 렌더링에서 `text` 값을 "캡처"합니다.** 텍스트 상태가 변경되었는지 여부는 중요하지 않습니다. `text = 'ab'`로 렌더링된 Effect는 항상 `'ab'`로 표시됩니다. 다시 말해서, 각 렌더링의 Effect는 서로 분리되어 있습니다. 이것이 어떻게 작동하는지 궁금하다면 [클로저](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)에 대해 읽어보세요.

<DeepDive>

#### 각 렌더링에는 고유한 Effect가 있습니다 {/*each-render-has-its-own-effects*/}

당신은 `useEffect`를 렌더링 결과에 동작을 "첨부"하는 것으로 생각할 수 있습니다. 이 Effect를 생각해보세요:

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

사용자가 앱을 탐색할 때 정확히 어떤 일이 발생하는지 살펴봅시다.

#### 초기 렌더링 {/*initial-render*/}

사용자가 `<ChatRoom roomId="general" />`을 방문합니다. 이 컴포넌트에서 `roomId`를 `'general'`로 [대체한다고 생각](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time)해봅시다:

```js
  // 첫 렌더링에 대한 JSX (roomId = "general")
  return <h1>Welcome to general!</h1>;
```

**Effect는 렌더링 결과의 일부이기도 합니다.** 첫 렌더링의 Effect는 다음과 같습니다:

```js
  // 첫 렌더링에 대한 Effect (roomId = "general")
  () => {
    const connection = createConnection('general');
    connection.connect();
    return () => connection.disconnect();
  },
  // 첫 렌더링에 대한 의존성 배열 (roomId = "general")
  ['general']
```

React는 `'general'` 채팅방에 연결되는 이 Effect를 실행합니다.

#### 같은 의존성으로 리렌더링 {/*re-render-with-same-dependencies*/}

`<ChatRoom roomId="general" />`이 다시 렌더링되었다고 가정해 보겠습니다. JSX 출력은 동일합니다:

```js
  // 두 번째 렌더링에 대한 JSX (roomId = "general")
  return <h1>Welcome to general!</h1>;
```

React는 렌더링 출력이 변경되지 않았다고 판단하여 DOM을 업데이트하지 않습니다.

두 번째 렌더링의 Effect는 다음과 같습니다:

```js
  // 두 번째 렌더링에 대한 Effect (roomId = "general")
  () => {
    const connection = createConnection('general');
    connection.connect();
    return () => connection.disconnect();
  },
  // 두 번째 렌더링에 대한 의존성 배열 (roomId = "general")
  ['general']
```

React는 두 번째 렌더링의 `['general']`을 첫 번째 렌더링의 `['general']`와 비교합니다. **모든 의존성이 동일하기 때문에 React는 두 번째 렌더링의 Effect를 *무시합니다*.** 호출되지 않습니다.

#### 다양한 의존성을 사용하여 리렌더링 {/*re-render-with-different-dependencies*/}

그런 다음 사용자는 `<ChatRoom roomId="travel" />`을 방문합니다. 이번에는 컴포넌트가 다른 JSX를 반환합니다:

```js
  // 세 번째 렌더링에 대한 JSX (roomId = "travel")
  return <h1>Welcome to travel!</h1>;
```

React가 DOM을 업데이트하여 `"Welcome to general"`를 `"Welcome to travel"`로 변경합니다.

세 번째 렌더링의 Effect는 다음과 같습니다:

```js
  //세 번째 렌더링에 대한 Effect (roomId = "travel")
  () => {
    const connection = createConnection('travel');
    connection.connect();
    return () => connection.disconnect();
  },
  // 세 번째 렌더링에 대한 의존성 배열 (roomId = "travel")
  ['travel']
```

React는 세 번째 렌더링의 `['travel']`을 두 번째 렌더링의 `['general']`과 비교합니다. 하나의 의존성이 다릅니다: `Object.is('travel', 'general')`는 `false`입니다. Effect는 생략될 수 없습니다.

**React가 세 번째 렌더링에서 Effect를 적용하기 전에 마지막으로 실행한 Effect를 정리해야 합니다.** 두 번째 렌더링의 Effect가 건너뛰었기 때문에 React는 첫 번째 렌더링의 Effect를 정리해야 합니다. 첫 번째 렌더링까지 스크롤하면 해당 정리 함수에서 `createConnection('general')`으로 생성된 연결에 대해 `disconnect()`를 호출하는 것을 볼 수 있습니다. 이는 앱에서 `'general'` 대화방의 연결을 끊습니다.

그 후 React는 세 번째 Effect를 실행합니다. `'travel'` 채팅방에 연결됩니다.

#### 언마운트 {/*unmount*/}

마지막으로, 사용자가 다른 곳으로 이동하고 `ChatRoom` 컴포넌트가 언마운트된다고 가정해 봅시다. React는 마지막 Effect의 정리 함수를 실행합니다. 마지막 Effect는 세 번째 렌더링에서 나온 것입니다. 세 번째 렌더링의 정리 함수는 `createConnection('travel')` 연결을 파괴합니다. 따라서 앱은 `'travel'` 대화방의 연결을 끊습니다.

#### 개발 환경 전용 동작 {/*development-only-behaviors*/}

[엄격 모드](/reference/react/StrictMode)가 켜져 있으면 React는 마운트 후 모든 컴포넌트를 한 번 다시 마운트합니다.(상태와 DOM은 보존됩니다.) 이렇게 하면 [정리가 필요한 Effect를 찾고](#step-3-add-cleanup-if-needed) 경쟁 조건과 같은 버그를 조기에 발견할 수 있습니다. 추가적으로, React는 개발 중인 파일을 저장할 때마다 Effect를 다시 마운트 합니다. 이 두가지 동작은 모두 개발 전용입니다.

</DeepDive>

<Recap>

- 이벤트와 달리, Effect는 특정 상호작용이 아닌 렌더링 자체로 인해 발생합니다.
- Effect를 사용하면 컴포넌트를 외부 시스템(타사 API, 네트워크 등)과 동기화할 수 있습니다.
- 기본적으로 Effect는 모든 렌더링(초기 렌더링 포함) 후에 실행됩니다.
- 모든 의존성의 값이 마지막 렌더링 때와 같으면 React는 Effect를 건너뜁니다.
- 의존성을 "선택"할 수는 없습니다. 의존 요소는 Effect 내부 코드에 의해 결정됩니다.
- 빈 의존성 배열(`[]`)은 컴포넌트 "마운트", 즉 화면에 추가되는 것에 해당합니다.
- 엄격 모드에서 React는 컴포넌트를 두 번 마운트하여(개발 환경에서만!) Effect를 스트레스 테스트합니다.
- 다시 마운트되는 것으로 인해 Effect가 손상된 경우 정리 함수를 구현해야 합니다.
- React는 다음 Effect가 실행되지 전과 마운트 해제 중에 정리 함수를 호출합니다.

</Recap>

<Challenges>

#### 마운트시에 필드에 포커스 맞추기 {/*focus-a-field-on-mount*/}

이 예제에서는 폼이 `<MyInput />` 컴포넌트를 렌더링합니다.

입력의 [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) 메서드를 사용하여 `MyInput`이 화면에 표시될 때 자동으로 포커스를 맞추도록 합니다. 이미 주석 처리된 구현이 있지만 제대로 동작하지 않습니다. 작동하지 않는 이유를 파악하고 수정하세요.(`autoFocus` 속성에 익숙하다면 이 속성이 존재하지 않는다고 생각하세요: 동일한 기능을 처음부터 다시 구현하고 있기 때문입니다.)

<Sandpack>

```js MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ value, onChange }) {
  const ref = useRef(null);

  // TODO: 이것은 제대로 작동하지 않습니다. 고쳐보세요.
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


솔루션이 동작하는지 확인하려면 "Show form"을 누르고 input이 포커스를 받는지(강조 표시되고 커서가 내부에 위치하는지) 확인합니다. "Hide form"과 "Show form"을 다시 누릅니다. input이 다시 강조 표시되는지 확인합니다.

`MyInput`은 매번 렌더링할 때가 아니라 _마운트할 때만_ 포커스를 맞춰야 합니다. 동작이 올바른지 확인하려면 "Show form"을 누른 다음 "Make it uppercase" 체크박스를 반복해서 누릅니다. 체크박스를 클릭해도 input에 포커스가 맞춰져서는 _안_ 됩니다.

<Solution>

렌더링 중에 `ref.current.focus()`를 호출하는 것은 *부작용*이 발생하므로 잘못된 것입니다. 부작용은 이벤트 핸들러 내부에 배치하거나 `useEffect`와 함께 선언해야 합니다. 이 경우 부작용은 특정 상호작용이 아니라 나타나는 컴포넌트로 인해 발생하는 Effect에 넣는 것이 좋습니다.

실수를 수정하려면 `ref.current.focus()` 호출을 Effect 선언으로 래핑하세요. 그런 다음, 이 Effect가 렌더링할 때마다 실행되는 것이 아닌 마운트할 때만 실행되도록 빈 `[]` 의존성 배열을 추가합니다.

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

#### 조건부로 필드에 포커스하기 {/*focus-a-field-conditionally*/}

이 폼은 두개의 `<MyInput />` 컴포넌트를 렌더링합니다.

"Show form"을 누르면 두 번째 필드에 자동으로 포커스가 맞춰지는 것을 확인할 수 있습니다. 이는 두 `<MyInput />` 컴포넌트 모두 내부의 필드에 포커스를 맞추려고 시도하기 때문입니다. 두 input 필드에 대해 연속으로 `focus()`를 호출하면 항상 마지막 input 필드가 "승리"합니다.

첫 번째 필드에 포커스을 맞추고 싶다고 가정해보겠습니다. 이제 첫 번째 `MyInput` 컴포넌트는 `true`로 설정된 불리언 `shouldFocus` prop을 받습니다. `MyInput`이 수신한 `shouldFocus` prop이 `true`인 경우에만 `focus()`가 호출되도록 로직을 변경합니다.

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

솔루션을 증명하려면 "Show form"과 "Hide form"를 반복해서 누릅니다. 양식이 나타나면 *첫 번째* input에만 포커스가 맞춰져야 합니다. 이는 부모 컴포넌트가 첫 번째 input은 `shouldFocus={false}`로, 두 번째 입력은 `shouldFocus={false}`로 렌더링하기 때문입니다. 또한 두 input이 모두 작동하고 두 input에 모두 입력할 수 있는지 확인합니다.

<Hint>

당신은 조건부로 Effect를 선언할 수는 없지만 Effect에서 조건부 논리를 포함할 수는 있습니다.

</Hint>

<Solution>

Effect안에 조건부 로직을 넣습니다. Effect 내부에서 사용하므로 `shouldFocus`를 의존성으로 지정해야 합니다.(즉, 일부 input의 `shouldFocus`가 `false`에서 `true`로 변경되면 마운트 후에 포커스를 맞춥니다.)

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

#### 두 번 실행되는 interval 수정하기 {/*fix-an-interval-that-fires-twice*/}

이 `Counter` 컴포넌트는 매초마다 증가해야 하는 카운터를 표시합니다. 마운트하면 이 컴포넌트는 [`setInterval`](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)을 호출합니다. 이렇게 하면 `onTick`이 매초마다 실행됩니다. `onTick` 함수는 카운터를 증가시킵니다.

그러나 초당 한 번씩 증가하는 대신 두 번씩 증가합니다. 왜 그럴까요? 버그의 원인을 찾아서 수정해보세요.

<Hint>

`setInterval`은 interval ID를 반환하며, 이를 [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval)에 전달하여 interval을 중지할 수 있습니다.

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

[엄격 모드](/reference/react/StrictMode)가 켜져 있으면(이 사이트의 샌드박스와 같이) React는 개발 중에 각 컴포넌트를 한 번씩 다시 마운트합니다. 이로 인해 interval이 두 번 설정되므로 초마다 카운터가 두 번씩 증가합니다.

그러나 React의 동작이 버그의 *원인*은 아닙니다: 버그는 이미 코드에 존재합니다. React의 동작은 버그를 더 눈에 띄게 만듭니다. 진짜 원인은 이 Effect가 프로세스를 시작하지만 이를 정리할 방법을 제공하지 않기 때문입니다.

이 코드를 수정하려면 `setInterval`이 반환한 interval ID를 저장하고 [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval)로 정리 함수를 구현하세요:

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

개발 환경에서, React는 정리 함수를 잘 구현했는지 확인하기 위해 컴포넌트를 한 번 다시 마운트합니다. 따라서 `setInterval` 호출이 있고, 바로 뒤에 `clearInterval` 호출이 있고, 다시 `setInterval` 호출이 있을 것입니다. 프로덕션 환경에서는 `setInterval` 호출이 한 번만 있을 것입니다. 두 경우 모두 사용자에게 표시되는 동작은 동일합니다: 카운터가 초당 한 번씩 증가합니다.

</Solution>

#### Effect 내부 가져오기 수정 {/*fix-fetching-inside-an-effect*/}

이 컴포넌트는 선택한 인물의 약력을 표시합니다. 이 컴포넌트는 마운트할 때와 `person`이 변경될 때마다 비동기 함수 `fetchBio(person)`를 호출하여 약력을 로드합니다. 이 비동기 함수는 결국 문자열로 resolve되는 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)를 반환합니다. 가져오기가 완료되면 `setBio`를 호출하여 select box 아래에 해당 문자열을 표시합니다.

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


이 코드에는 버그가 있습니다. 먼저 "Alice"를 선택합니다. 그런 다음 "Bob"을 선택한 다음 바로 뒤에 "Taylor"를 선택합니다. 이 작업을 충분히 빠르게 수행하면 해당 버그를 발견할 수 있습니다: Taylor가 선택되었지만 아래 단락에 "This is Bob's bio."라고 표시됩니다.

왜 이런 일이 발생하나요? 이 Effect 내부의 버그를 수정하세요.

<Hint>

Effect가 비동기적으로 무언가를 가져오는 경우 일반적으로 정리 함수가 필요합니다.

</Hint>

<Solution>

버그를 트리거하려면 다음 순서로 일이 발생해야 합니다:

- `Bob`을 선택하면 `fetchBio('Bob')`가 트리거됩니다.
- `Taylor`를 선택하면 `fetchBio('Taylor')`가 트리거됩니다.
- **`'Taylor'` 가져오기가 `'Bob'` 가져오기 전에 완료됩니다.**
- `'Taylor'`의 렌더링 Effect가 `setBio('This is Taylor’s bio')`를 호출합니다.
- `'Bob'` 가져오기가 완료됩니다.
- `'Bob'`의 렌더링 Effect가 `setBio('This is Bob’s bio')`를 호출합니다.

이것이 Taylor가 선택되었는데도 Bob의 약력이 표시되는 이유입니다. 이와 같은 버그를 [race conditions](https://en.wikipedia.org/wiki/Race_condition)이라고 부르는 이유는 두 개의 비동기 연산이 서로 "경쟁"하고 있으며 예상치 못한 순서로 도착할 수 있기 때문입니다.

이 경쟁 조건을 수정하려면 정리 함수를 추가하세요:

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

각 렌더링의 Effect에는 자체 `ignore` 변수가 있습니다. 처음에는, `ignore` 변수가 `false`로 설정됩니다. 그러나 Effect가 정리되면(다른 사람을 선택하는 경우 등) `ignore` 변수가 참이 됩니다. 따라서 이제 요청이 완료되는 순서는 중요하지 않습니다. 마지막 사람의 Effect만 `ignore` 변수가 거짓으로 설정되어 있으므로 `setBio(result)`를 호출합니다. 과거의 Effect는 정리되었으므로 `if(!ignore)` 검사는 `setBio`를 호출하지 못하도록 합니다:

- `Bob`을 선택하면 `fetchBio('Bob')`가 트리거됩니다.
- `'Taylor'`를 선택하면 `fetchBio('Taylor')`가 트리거되고 **이전 Bob의 Effect가 정리됩니다.**
- `'Taylor'` 가져오기가 `'Bob'` 가져오기 *전에* 완료됩니다.
- `'Taylor'` 렌더링의 Effect는 `setBio('This is Taylor’s bio')`를 호출합니다.
- `'Bob'`의 가져오기가 완료됩니다.
- `'Bob'`의 렌더링의 Effect는 `ignore` 플래그가 `true`로 설정되었기 때문에 아무 작업도 수행하지 않습니다.

오래된 API 호출의 결과를 무시하는 것 외에도 [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)를 사용하여 더 이상 필요하지 않은 요청을 취소할 수도 있습니다. 그러나 이것만으로는 경쟁 조건을 방지하기에 충분하지 않습니다. 가져오기 이후에 더 많은 비동기 단계가 연쇄적으로 발생할 수 있으므로 `ignore`과 같은 명시적 플래그를 사용하는 것이 이러한 유형의 문제를 해결하는 가장 신뢰할 수 있는 방법입니다.

</Solution>

</Challenges>

