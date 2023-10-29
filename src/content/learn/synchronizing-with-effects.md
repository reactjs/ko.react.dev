---
title: 'Effect로 동기화하기'
---

<Intro>

일부 컴포넌트에서는 외부 시스템과 동기화해야 할 수 있습니다. 예를 들어 React의 state을 기준으로 React와 상관없는 구성 요소를 제어하거나, 서버 연결을 설정하거나, 구성 요소가 화면에 나타날 때 분석 목적의 로그를 전송할 수도 있습니다. *Effect*를 사용하면 렌더링 후 특정 코드를 실행하여 React 외부의 시스템과 컴포넌트를 동기화할 수 있습니다.

</Intro>

<YouWillLearn>

- Effect가 무엇인지
- Effect가 이벤트와 다른 점
- 컴포넌트에서 Effect를 선언하는 방법
- 불필요한 Effect 재실행을 건너뛰는 방법
- 개발 중에 Effect가 두 번 실행되는 이유와 해결 방법

</YouWillLearn>

## Effect란 무엇이고 이벤트와는 어떻게 다른가요? {/*what-are-effects-and-how-are-they-different-from-events*/}

Effect에 대해 자세히 알아보기 전에, 컴포넌트 내부의 2가지 로직 유형에 대해 알아야 합니다.

- **렌더링 코드**([UI 표현하기](/learn/description-the-UI)에 소개됨)를 주관하는 로직은 컴포넌트의 최상단에 위치하며, props와 state를 적절히 변형해 결과적으로 JSX를 반환합니다. [렌더링 코드 로직은 순수해야 합니다.](/learn/keep-components-pure) 수학 공식처럼 결과만 계산해야 하고, 그 외에는 아무것도 하지 말아야 합니다.

- **이벤트 핸들러**([상호작용 더하기](/learn/adding-interactivity)에 소개됨)는 단순한 계산 용도가 아닌 무언가를 *하는* 컴포넌트 내부의 중첩 함수입니다. 이벤트 핸들러는 입력 필드를 업데이트하거나, 제품을 구입하기 위해 HTTP POST 요청을 보내거나, 사용자를 다른 화면으로 이동시킬 수 있습니다. 이벤트 핸들러에는 특정 사용자 작업(예: 버튼 클릭 또는 입력)으로 인해 발생하는 ["부수 효과"](https://en.wikipedia.org/wiki/Side_effect_(computer_science))(이러한 부수 효과가 프로그램 상태를 변경합니다.)를 포함합니다.

가끔은 이것으로 충분하지 않습니다. 화면에 보일 때마다 채팅 서버에 접속해야 하는 `ChatRoom` 컴포넌트를 생각해 보세요. 서버에 접속하는 것은 순수한 계산이 아니고 부수 효과를 발생시키기 때문에 렌더링 중에는 할 수 없습니다. 하지만 클릭 한 번으로 `ChatRoom`이 표시되는 특정 이벤트는 하나도 없습니다.

**Effect**는 렌더링 자체에 의해 발생하는 부수 효과를 특정하는 것으로, 특정 이벤트가 아닌 렌더링에 의해 직접 발생합니다. 채팅에서 메시지를 보내는 것은 *이벤트*입니다. 왜냐하면 이것은 사용자가 특정 버튼을 클릭함에 따라 직접적으로 발생합니다. 그러나 서버 연결 설정은 *Effect*입니다. 왜냐하면 이것은 컴포넌트의 표시를 주관하는 어떤 상호 작용과도 상관없이 발생해야 합니다. Effect는 [커밋](/learn/render-and-commit)이 끝난 후에 화면 업데이트가 이루어지고 나서 실행됩니다. 이 시점이 React 컴포넌트를 외부 시스템(네트워크 또는 써드파티 라이브러리와 같은)과 동기화하기 좋은 타이밍입니다.

<Note>

이 텍스트에서의 대문자 "Effect"는 위에서 언급한 React에 특화된 정의를 나타내며, 곧 렌더링에 의한 부수 효과를 의미합니다. 보다 일반적인 프로그래밍 개념을 언급할 때에는 "부수 효과"라고 말하겠습니다.

</Note>


## Effect가 필요 없을지도 모릅니다 {/*you-might-not-need-an-effect*/}

**컴포넌트에 Effect를 무작정 추가하지 마세요.** Effect는 주로 React 코드를 벗어난 특정 *외부* 시스템과 동기화하기 위해 사용됩니다. 이는 브라우저 API, 써드파티 위젯, 네트워크 등을 포함합니다. 만약 당신의 Effect가 단순히 다른 상태에 기반하여 일부 상태를 조정하는 경우에는 [Effect가 필요하지 않을 수 있습니다.](/learn/you-might-not-need-an-effect)

## Effect를 작성하는 법 {/*how-to-write-an-effect*/}

Effect를 작성하기 위해서는 다음 세 단계를 따릅니다.

1. **Effect 선언.** 기본적으로 Effect는 모든 렌더링 후에 실행됩니다.
2. **Effect 의존성 지정.** 대부분의 Effect는 모든 렌더링 후가 아닌 *필요할 때*만 다시 실행되어야 합니다. 예를 들어, 페이드 인 애니메이션은 컴포넌트가 나타날 때에만 트리거 되어야 합니다. 채팅 방에 연결, 연결 해제하는 것은 컴포넌트가 나타나거나 사라질 때 또는 채팅 방이 변경될 때만 발생해야 합니다. *의존성*을 지정하여 이를 제어하는 방법을 배우게 될 것입니다.
3. **필요한 경우 클린업 함수 추가.** 일부 Effect는 수행 중이던 작업을 중지, 취소 또는 정리하는 방법을 지정해야 할 수 있습니다. 예를 들어, "연결"은 "연결 해제"가 필요하며, "구독"은 "구독 취소"가 필요하고, "불러오기(fetch)"는 "취소" 또는 "무시"가 필요합니다. 이런 경우에 Effect에서 *클린업 함수(cleanup function)*를 반환하여 어떻게 수행하는지 배우게 될 것입니다.

각 단계를 자세히 살펴보겠습니다.

### 1단계: Effect 선언하기 {/*step-1-declare-an-effect*/}

컴포넌트 내에서 Effect를 선언하려면, React에서 [`useEffect` 훅](/reference/react/useEffect)을 import 하세요.

```js
import { useEffect } from 'react';
```

그런 다음, 컴포넌트의 최상위 레벨에서 호출하고 Effect 내부에 코드를 넣으세요.

```js {2-4}
function MyComponent() {
  useEffect(() => {
    // 이곳의 코드는 *모든* 렌더링 후에 실행됩니다
  });
  return <div />;
}
```

컴포넌트가 렌더링 될 때마다 React는 화면을 업데이트한 다음 `useEffect` 내부의 코드를 실행합니다. 다시 말해, **`useEffect`는 화면에 렌더링이 반영될 때까지 코드 실행을 "지연"시킵니다.**

이제 외부 시스템과 동기화하기 위해 어떻게 Effect를 사용할 수 있는지 알아보겠습니다. `<VideoPlayer>`라는 React 컴포넌트를 살펴보겠습니다. 이 컴포넌트를 `isPlaying`이라는 props를 통해 재생 중인지 일시 정지 상태인지 제어하는 것이 좋아 보이네요.

```js
<VideoPlayer isPlaying={isPlaying} />;
```

커스텀 `VideoPlayer` 컴포넌트는 내장 브라우저 [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) 태그를 렌더링 합니다.

```js
function VideoPlayer({ src, isPlaying }) {
  // TODO: isPlaying을 활용하여 무언가 수행하기
  return <video src={src} />;
}
```

그러나 `<video>` 태그에는 `isPlaying` prop이 없습니다. 이를 제어하는 유일한 방법은 DOM 요소에서 수동으로 [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) 및 [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) 메서드를 호출하는 것입니다. **`isPlaying` prop의 값(현재 비디오가 재생 중인지 여부)을 `play()` 및 `pause()`와 같은 호출과 동기화해야 합니다.**

먼저 `<video>` DOM 노드의 [ref를 가져와야](/learn/manipulating-the-dom-with-refs) 합니다.

`play()` 또는 `pause()`를 렌더링 중에 호출하려고 시도할 수 있겠지만, 이는 올바른 접근이 아닙니다.

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  if (isPlaying) {
    ref.current.play();  // 렌더링 중에 이를 호출하는 것이 허용되지 않습니다.
  } else {
    ref.current.pause(); // 역시 이렇게 호출하면 바로 위의 호출과 충돌이 발생합니다.
  }

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? '일시정지' : '재생'}
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

이 코드가 올바르지 않은 이유는 렌더링 중에 DOM 노드를 조작하려고 시도하기 때문입니다. React에서는 [렌더링이 JSX의 순수한 계산](/learn/keeping-components-pure)이어야 하며, DOM 수정과 같은 부수 효과를 포함해서는 안됩니다.

게다가, 처음으로 `VideoPlayer`가 호출될 때 해당 DOM이 아직 존재하지 않습니다! React는 컴포넌트가 JSX를 반환할 때까지 어떤 DOM을 생성할지 모르기 때문에 `play()` 또는 `pause()`를 호출할 DOM 노드가 아직 없습니다.

해결책은 **부수 효과를 렌더링 연산에서 분리하기 위해 `useEffect`로 감싸는 것입니다.**

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

DOM 업데이트를 Effect로 감싸면 React가 화면을 업데이트한 다음에 Effect가 실행됩니다.

`VideoPlayer` 컴포넌트가 렌더링 될 때(처음 호출하거나 다시 렌더링 할 때) 몇 가지 일이 발생합니다. 먼저 React는 화면을 업데이트하여 `<video>` 태그가 올바른 속성과 함께 DOM에 있는지 확인합니다. 그런 다음 React는 Effect를 실행합니다. 마지막으로 Effect에서는 `isPlaying` 값에 따라 `play()` 또는 `pause()`를 호출합니다.

"재생" 또는 "일시 정지"를 여러 번 눌러보고 비디오 플레이어가 `isPlaying` 값과 동기화되는지 확인해 보세요.

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
        {isPlaying ? '일시 정지' : '재생'}
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

이 예제에서 React 상태와 동기화된 "외부 시스템"은 브라우저 미디어 API였습니다. 이와 비슷한 접근 방식으로 React가 아닌 레거시 코드(예: jQuery 플러그인)를 선언적인 React 컴포넌트로 감싸는 데에도 사용할 수 있습니다.

실제로 비디오 플레이어를 제어하는 것은 훨씬 복잡합니다. play()를 호출하는 것이 실패할 수 있으며, 사용자는 컴포넌트의 UI가 아닌 브라우저 내장 컨트롤을 사용하여 동영상을 재생 또는 일시 정지할 수 있습니다. 이 예제는 매우 단순화되었고 불완전한 것임을 유의해주세요.

<Pitfall>

기본적으로, Effect는 *모든* 렌더링 후에 실행됩니다. 이러한 이유로 다음과 같은 코드는 **무한 루프를 만들어낼** 것입니다.

```js
const [count, setCount] = useState(0);
useEffect(() => {
  setCount(count + 1);
});
```

Effect는 렌더링의 *결과*로 실행됩니다. state를 설정하면 렌더링이 *트리거*됩니다. Effect 안에서 즉시 상태를 설정하는 것은 기계의 전원 플러그를 기계 그 자체에 연결하는 것과 비슷합니다. Effect가 실행되고 상태가 설정되면 재렌더링이 발생하고, Effect가 다시 실행되고 상태가 설정되면 또 다른 재렌더링이 발생하며, 이런 식으로 계속됩니다.

Effect는 일반적으로 컴포넌트를 *외부* 시스템과 동기화하는 데 사용됩니다. 외부 시스템이 없고 다른 상태에 기반하여 상태를 조정하려는 경우에는 [Effect가 필요하지 않을 수 있습니다.](/learn/you-might-not-need-an-effect)

</Pitfall>

### 2단계: Effect의 의존성 지정하기 {/*step-2-specify-the-effect-dependencies*/}

기본적으로, Effect는 *모든* 렌더링 후에 실행됩니다. 이는 종종 **원하는 동작이 아닐 수 있습니다:**

- 때때로 느릴 수 있습니다. 외부 시스템과 동기화하는 것이 항상 즉시 이루어지지 않기 때문에 필요하지 않을 경우에는 실행을 건너뛰고 싶을 수 있습니다. 예를 들어, 모든 키 입력마다 채팅 서버에 다시 연결하길 원하지 않을 것입니다.
- 때때로 잘못될 수 있습니다. 예를 들어, 모든 키 입력마다 컴포넌트 fade-in 애니메이션을 트리거하길 원하지 않을 것입니다. 애니메이션은 컴포넌트가 처음 나타날 때에만 한 번 실행되어야 합니다.

이 문제를 설명하기 위해 이전 예제에 몇 가지 `console.log` 호출과 부모 컴포넌트의 상태를 업데이트하는 텍스트 입력을 추가한 예제를 살펴보겠습니다. 입력할 때 Effect가 다시 실행되는 것을 주목하세요.

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('video.play() 호출');
      ref.current.play();
    } else {
      console.log('video.pause() 호출');
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
        {isPlaying ? '일시 정지' : '재생'}
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

React에게 Effect를 **불필요하게 다시 실행하지 않도록 지시**하려면 `useEffect` 호출의 두 번째 인자로 *의존성(dependencies)* 배열을 지정하세요. 먼저 위의 예제에 빈 `[]` 배열을 14번째 줄에 추가하면 됩니다.

```js {3}
  useEffect(() => {
    // ...
  }, []);
```

`'isPlaying'`에 대한 의존성이 누락되었다는 오류가 표시될 것입니다.

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('video.play() 호출');
      ref.current.play();
    } else {
      console.log('video.pause() 호출');
      ref.current.pause();
    }
  }, []); // 이 코드는 에러를 유발합니다

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? '일시 정지' : '재생'}
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

문제는 Effect 내부의 코드가 어떤 작업을 수행할지 결정하기 위해 `isPlaying` prop에 *의존*하지만 이 의존성이 명시적으로 선언되지 않았다는 것입니다. 이 문제를 해결하려면 의존성 배열에 `isPlaying`을 추가하세요.

```js {2,7}
  useEffect(() => {
    if (isPlaying) { // 여기서 사용하니까...
      // ...
    } else {
      // ...
    }
  }, [isPlaying]); // ...여기에 선언되어야겠네!
```

이제 모든 의존성이 의존성 배열 안에 선언되어 오류가 없을 것입니다. 의존성 배열로 `[isPlaying]`을 지정하면 React에게 이전 렌더링 중에 `isPlaying`이 이전과 동일하다면 Effect를 다시 실행하지 않도록 해야 한다고 알려줍니다. 이 변경으로 입력란에 입력을 입력하면 Effect가 다시 실행되지 않고, 재생/일시 정지 버튼을 누르면 Effect가 실행됩니다.

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('video.play() 호출');
      ref.current.play();
    } else {
      console.log('video.pause() 호출');
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
        {isPlaying ? '일시 정지' : '재생'}
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

의존성 배열에는 여러 개의 종속성을 포함할 수 있습니다. React는 지정한 모든 종속성이 이전 렌더링의 그것과 정확히 동일한 값을 가진 경우에만 Effect를 다시 실행하지 않습니다. React는 [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 비교를 사용하여 종속성 값을 비교합니다. 자세한 내용은 [`useEffect` 참조 문서](/reference/react/useEffect#reference)를 참조하세요.

**의존성을 "선택"할 수 없다는 점에 유의하세요.** 의존성 배열에 지정한 종속성이 Effect 내부의 코드를 기반으로 React가 기대하는 것과 일치하지 않으면 린트 에러가 발생합니다. 이를 통해 코드 내의 많은 버그를 잡을 수 있습니다. 코드가 다시 실행되길 원하지 않는 경우, [*Effect 내부를 수정하여* 그 종속성이 "필요"하지 않도록 만드세요.](/learn/lifecycle-of-reactive-effects#what-to-do-when-you-dont-want-to-re-synchronize)

<Pitfall>

의존성 배열이 없는 경우와 *빈* `[]` 의존성 배열이 있는 경우의 동작이 다릅니다.

```js {3,7,11}
useEffect(() => {
  // 모든 렌더링 후에 실행됩니다
});

useEffect(() => {
  // 마운트될 때만 실행됩니다 (컴포넌트가 나타날 때)
}, []);

useEffect(() => {
 // 마운트될 때 실행되며, *또한* 렌더링 이후에 a 또는 b 중 하나라도 변경된 경우에도 실행됩니다
}, [a, b]);
```

다음 단계에서 "마운트(mount)"가 무엇을 의미하는지 자세히 살펴보겠습니다.

</Pitfall>

<DeepDive>

#### 왜 ref는 의존성 배열에서 생략해도 되나요? {/*why-was-the-ref-omitted-from-the-dependency-array*/}

이 Effect는 `ref`와 `isPlaying`을 _모두_ 사용하지만, 의존성 배열 안에 선언된 것은 `isPlaying` 뿐입니다.

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

이것은 `ref` 객체가 *안정된 식별성(stable identity)*을 가지기 때문입니다. React는 동일한 `useRef` 호출에서 항상 [같은 객체를 얻을 수 있음을](/reference/react/useRef#returns) 보장합니다. 이 객체는 절대 변경되지 않기 때문에 자체적으로 Effect를 다시 실행시키지 않습니다. 따라서 `ref`는 의존성 배열에 포함하든 포함하지 않든 상관없습니다. 포함해도 문제없습니다.

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

[`useState`](/reference/react/useState#setstate)로 반환되는 `set` 함수들도 안정된 식별성을 가지기 때문에, 종종 이러한 함수들도 의존성에서 생략되는 것을 볼 수 있습니다. 린터가 의존성을 생략해도 오류를 표시하지 않는다면 그렇게 해도 안전합니다.

안정된 식별성을 가진 의존성을 생략하는 것은 린터가 해당 객체가 안정적임을 "알 수" 있는 경우에만 작동합니다. 예를 들어, `ref`가 부모 컴포넌트에서 전달되었다면, 의존성 배열에 명시해야 합니다. 이것은 좋은 접근 방식입니다. 왜냐하면 부모 컴포넌트가 항상 동일한 ref를 전달하는지 또는 여러 ref 중 하나를 조건부로 전달하는지 알 수 없기 때문입니다. 따라서 당신의 Effect는 전달되는 ref에 따라 달라질 것입니다.

</DeepDive>

### 3단계: 필요하다면 클린업을 추가하세요 {/*step-3-add-cleanup-if-needed*/}

다른 예시를 고려해 보겠습니다. 사용자에게 표시될 때 채팅 서버에 연결해야 하는 `ChatRoom` 컴포넌트를 작성 중입니다. `createConnection()` API가 주어지며, 이 API는 `connect()` 및 `disconnect()` 메서드를 가진 객체를 반환합니다. 사용자에게 표시되는 동안 컴포넌트가 채팅 서버와의 연결을 유지하려면 어떻게 해야 할까요?

먼저 Effect를 작성해 보겠습니다.

```js
useEffect(() => {
  const connection = createConnection();
  connection.connect();
});
```

매번 재렌더링 후에 채팅 서버에 연결하는 것은 느리므로 의존성 배열을 추가합니다.

```js {4}
useEffect(() => {
  const connection = createConnection();
  connection.connect();
}, []);
```

**Effect 내부의 코드는 어떠한 props나 상태도 사용하지 않으므로, 의존성 배열은 `[]` (빈 배열)입니다. 이는 React에게 이 코드를 컴포넌트가 "마운트"될 때만 실행하도록 알려줍니다. 즉, 화면에 처음으로 나타날 때에만 실행되게 됩니다.**

이 코드를 실행해 보겠습니다.

<Sandpack>

```js
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
  }, []);
  return <h1>채팅에 오신걸 환영합니다!</h1>;
}
```

```js chat.js
export function createConnection() {
  // 실제 구현은 정말로 채팅 서버에 연결하는 것이 되어야 합니다.
  return {
    connect() {
      console.log('✅ 연결 중...');
    },
    disconnect() {
      console.log('❌ 연결이 끊겼습니다.');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
```

</Sandpack>

이 Effect는 마운트될 때만 실행되므로 콘솔에 "✅ 연결 중..."이 한 번 출력될 것으로 예상할 수 있습니다. 그러나 콘솔을 확인해 보면 "✅ 연결 중..."이 두 번 출력됩니다. 왜 그럴까요?

ChatRoom 컴포넌트가 여러 화면으로 구성된 큰 앱의 일부라고 가정해 보겠습니다. 사용자가 ChatRoom 페이지에서 여정을 시작합니다. 컴포넌트가 마운트되고 connection.connect()를 호출합니다. 그런 다음 사용자가 다른 화면으로 이동한다고 상상해보세요. 예를 들어, 설정 페이지로 이동할 수 있습니다. ChatRoom 컴포넌트가 언마운트됩니다. 마지막으로 사용자가 뒤로 가기 버튼을 클릭하고 ChatRoom이 다시 마운트됩니다. 이렇게 되면 두 번째 연결이 설정되지만 첫 번째 연결은 종료되지 않았습니다! 사용자가 앱을 탐색하는 동안 연결은 종료되지 않고 계속 쌓일 것입니다.

이와 같은 버그는 앱의 이곳저곳을 수동으로 테스트해보지 않으면 놓치기 쉽습니다. 이러한 문제를 빠르게 파악할 수 있도록 React는 개발 모드에서 초기 마운트 후 모든 컴포넌트를 한 번 다시 마운트합니다.

"✅ 연결 중..." 로그가 두 번 출력되는 것을 보면 결국 무엇이 문제인지 알 수 있습니다. 컴포넌트가 언마운트될 때 연결을 닫지 않는 문제가 바로 그것이죠.

이 문제를 해결하려면 Effect에서 클린업 함수를 반환하면 됩니다.

```js {4-6}
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []);
```

React는 Effect가 다시 실행되기 전마다 클린업 함수를 호출하고, 컴포넌트가 언마운트(제거)될 때에도 마지막으로 호출합니다. 클린업 함수가 구현된 경우 어떤 일이 일어나는지 살펴보겠습니다.

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
  return <h1>채팅에 오신걸 환영합니다!</h1>;
}
```

```js chat.js
export function createConnection() {
  // 실제 구현은 정말로 채팅 서버에 연결하는 것이 되어야 합니다.
  return {
    connect() {
      console.log('✅ 연결 중...');
    },
    disconnect() {
      console.log('❌ 연결 해제됨');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
```

</Sandpack>

이제 개발 모드에서 세 개의 콘솔 로그를 확인할 수 있습니다:

1. `"✅ 연결 중..."`
2. `"❌ 연결 해제됨"`
3. `"✅ 연결 중..."`

**이것이 개발 모드에서 올바른 동작입니다.** 컴포넌트를 다시 마운트함으로써 React는 사용자가 다른 부분을 탐색하고 다시 돌아와도 코드가 깨지지 않을 것임을 확인합니다. 연결을 해제하고 다시 연결하는 것이 바로 일어나는 일입니다! 클린업을 잘 구현하면 Effect를 한 번 실행하는 것과 실행, 클린업, 이후 다시 실행하는 것 사이에 사용자에게 보이는 차이가 없어야 합니다. 개발 중에는 연결/해제 호출이 하나 더 있는데, 이는 React가 개발 중에 코드를 검사하여 버그를 찾는 것입니다. 이것은 정상적인 동작입니다 - 이것을 없애려고 하지 마세요!

**배포 환경에서는 `"✅ 연결 중..."`이 한 번만 출력됩니다.** 컴포넌트를 다시 마운트하는 것은 개발 중에만 발생하며 클린업이 필요한 Effect를 찾아주는 데 도움을 줍니다. 개발 동작에서 벗어나려면 [Strict Mode](/reference/react/StrictMode)를 끄는 것도 가능하지만, 켜둘 것을 권장합니다. 이렇게 하면 위와 같은 많은 버그를 찾을 수 있습니다.

## 개발 중에 Effect가 두 번 실행되는 경우를 다루는 방법 {/*개발-중에-effect가-두-번-실행되는-경우를-다루는-방법*/}

React는 마지막 예시와 같은 버그를 찾기 위해 개발 중에 컴포넌트를 명시적으로 다시 마운트합니다. **"Effect를 한 번 실행하는 방법"이 아니라 "어떻게 Effect가 다시 마운트된 후에도 작동하도록 고칠 것인가"라는 것이 옳은 질문입니다.**

일반적으로 정답은 클린업 함수를 구현하는 것입니다. 클린업 함수는 Effect가 수행하던 작업을 중단하거나 되돌리는 역할을 합니다. 기본 원칙은 사용자가 Effect가 한 번 실행되는 것(배포 환경과 같이)과 _설정 → 클린업 → 설정_ 순서(개발 중에 볼 수 있는 것) 간에 차이를 느끼지 못해야 합니다.

작성할 대부분의 Effect는 아래의 일반적인 패턴 중 하나에 해당될 것입니다.

### React로 작성되지 않은 위젯 제어하기 {/*controlling-non-react-widgets*/}

가끔씩 React로 작성되지 않은 UI 위젯을 추가해야 할 때가 있습니다. 예를 들어, 페이지에 지도 컴포넌트를 추가한다고 가정해 보겠습니다. 이 지도 컴포넌트에는 `setZoomLevel()` 메서드가 있으며, `zoomLevel` state 변수와 동기화하려고 할 것입니다. Effect는 다음과 비슷할 것입니다.

```js
useEffect(() => {
  const map = mapRef.current;
  map.setZoomLevel(zoomLevel);
}, [zoomLevel]);
```

이 경우에는 클린업이 필요하지 않음을 유의하세요. 개발 모드에서 React는 Effect를 두 번 호출하지만, 동일한 값을 가지고 `setZoomLevel`을 두 번 호출하는 것은 아무런 문제가 되지 않습니다. 약간 느릴 수 있지만, 이것은 제품 환경에서 불필요하게 다시 마운트되지 않기 때문에 문제가 되지 않습니다.

일부 API는 연속해서 두 번 호출하는 것을 허용하지 않을 수도 있습니다. 예를 들어 내장된 [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement) 요소의 [`showModal`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) 메서드는 두 번 호출하면 예외를 던집니다. 클린업 함수를 구현하고 이 함수에서 대화 상자를 닫도록 만들어보세요.

```js {4}
useEffect(() => {
  const dialog = dialogRef.current;
  dialog.showModal();
  return () => dialog.close();
}, []);
```

개발 중에는 Effect가 `showModal()`을 호출한 다음 즉시 `close()`를 호출하고 다시 `showModal()`을 호출합니다. 이것은 사용자가 확인할 수 있는 동작이며 제품 환경에서 볼 수 있는 것과 동일합니다.

### 이벤트 구독하기 {/*subscribing-to-events*/}

만약 Effect가 어떤 것을 구독한다면, 클린업 함수에서 구독을 해지해야 합니다.

```js {6}
useEffect(() => {
  function handleScroll(e) {
    console.log(window.scrollX, window.scrollY);
  }
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

개발 중에는 Effect가 `addEventListener()`를 호출한 다음 즉시 `removeEventListener()`를 호출하고, 그다음 동일한 핸들러로 `addEventListener()`를 호출합니다. 따라서 한 번에 하나의 활성 구독만 있게 됩니다. 이것은 제품 환경에서 한 번 `addEventListener()`를 호출하는 것과 동일한 동작을 가집니다.

### 애니메이션 트리거 {/*triggering-animations*/}

Effect가 어떤 요소를 애니메이션으로 표시하는 경우, 클린업 함수에서 애니메이션을 초기 값으로 재설정해야 합니다.

```js {4-6}
useEffect(() => {
  const node = ref.current;
  node.style.opacity = 1; // Trigger the animation
  return () => {
    node.style.opacity = 0; // Reset to the initial value
  };
}, []);
```

개발 중에는 불투명도가 `1`로 설정되고, 그런 다음 `0`으로 설정되고, 다시 `1`로 설정됩니다. 이것은 제품 환경에서 `1`로 직접 설정하는 것과 동일한 동작을 가집니다. tweening을 지원하는 서드파티 애니메이션 라이브러리를 사용하는 경우 클린업 함수에서 타임라인을 초기 상태로 재설정해야 합니다.

### 데이터 페칭 {/*fetching-data*/}

만약 Effect가 어떤 데이터를 가져온다면, 클린업 함수에서는 [fetch를 중단](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)하거나 결과를 무시해야 합니다.

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

이미 발생한 네트워크 요청을 "실행 취소"할 수는 없지만, 클린업 함수는 더 이상 관련이 없는 페치가 애플리케이션에 계속 영향을 미치지 않도록 보장해야 합니다. `userId`가 `'Alice'`에서 `'Bob'`으로 변경되면 클린업은 `'Bob'`이후에 도착하더라도 `'Alice'` 응답을 무시하도록 보장합니다.

**개발 중에는 네트워크 탭에서 두 개의 페치가 표시됩니다.** 이는 문제가 없습니다. 위의 접근 방식을 사용하면 첫 번째 Effect는 즉시 클린업되어 `ignore` 변수의 복사본이 `true`로 설정됩니다. 따라서 추가 요청이 있더라도 `if (!ignore)` 검사 덕분에 state에 영향을 미치지 않습니다.

**제품 환경에서는 하나의 요청만 있을 것입니다.** 개발 중에 두 번째 요청이 문제라면, 가장 좋은 방법은 중복 요청을 제거하고 컴포넌트 간에 응답을 캐시하는 솔루션을 사용하는 것입니다:

```js
function TodoList() {
  const todos = useSomeDataLibrary(`/api/user/${userId}/todos`);
  // ...
```

이렇게 하면 개발 환경을 개선하는데 도움이 될 뿐만 아니라 애플리케이션의 반응 속도도 향상됩니다. 예를 들어 사용자가 뒤로 가기 버튼을 눌렀을 때 데이터를 다시 로드하는 것을 기다릴 필요가 없습니다. 데이터가 캐시되기 때문입니다. 이러한 캐시를 직접 구축하거나 비슷한 효과를 누릴 수 있는 여러 대안 중 하나를 사용할 수 있습니다.

<DeepDive>

#### Effect에서 데이터를 가져오는 좋은 대안은 무엇인가요? {/*what-are-good-alternatives-to-data-fetching-in-effects*/}

Effect 안에서 `fetch` 호출을 작성하는 것은 [데이터를 가져오는](https://www.robinwieruch.de/react-hooks-fetch-data/) [인기 있는 방법](https://www.robinwieruch.de/react-hooks-fetch-data/)입니다, 특히 완전히 클라이언트 측 앱에서는요. 하지만 이는 매우 수동적인 접근 방식이며 중요한 단점이 있습니다.

- **Effect는 서버에서 실행되지 않습니다.** 따라서 초기 서버 렌더링된 HTML은 데이터가 없는 로딩 상태만 포함하게 됩니다. 클라이언트 컴퓨터는 모든 JavaScript를 다운로드하고 앱을 렌더링해야만 데이터를 로드해야 한다는 것을 알게 될 것입니다. 이는 효율적이지 않습니다.
- **Effect 안에서 직접 가져오면 "네트워크 폭포"를 쉽게 만들 수 있습니다.** 부모 컴포넌트를 렌더링하면 일부 데이터를 가져오고 자식 컴포넌트를 렌더링한 다음 그들이 데이터를 가져오기 시작합니다. 네트워크가 빠르지 않으면 이는 모든 데이터를 병렬로 가져오는 것보다 훨씬 느립니다.
- **Effect 안에서 직접 가져오는 것은 일반적으로 데이터를 미리 로드하거나 캐시하지 않음을 의미합니다.** 예를 들어 컴포넌트가 언마운트되고 다시 마운트되면 데이터를 다시 가져와야 합니다.
- **그리 편리하지 않습니다.** `fetch` 호출을 작성할 때 [경쟁 상태](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect)와 같은 버그에 영향을 받지 않는 방식으로 작성하는 데 꽤 많은 보일러플레이트 코드가 필요합니다.

이 단점 목록은 React에만 해당되는 것은 아닙니다. 어떤 라이브러리에서든 마운트 시에 데이터를 가져온다면 비슷한 단점이 존재합니다. 마운트 시에 데이터를 페칭하는 것도 라우팅과 마찬가지로 잘 수행하기 어려운 작업이므로 다음 접근 방식을 권장합니다.

- **[프레임워크](/learn/start-a-new-react-project#production-grade-react-frameworks)를 사용하는 경우 해당 프레임워크의 내장 데이터 페칭 메커니즘을 사용하세요.** 현대적인 React 프레임워크에는 위의 단점을 겪지 않는 효율적이고 통합적인 데이터 페칭 메커니즘이 포함되어 있습니다.
- **그렇지 않은 경우 클라이언트 측 캐시를 사용하거나 구축하는 것을 고려하세요.** 인기 있는 오픈 소스 솔루션으로는 [React Query](https://tanstack.com/query/latest), [useSWR](https://swr.vercel.app/) 및 [React Router 6.4+](https://beta.reactrouter.com/en/main/start/overview)이 있습니다. 직접 솔루션을 구축할 수도 있으며 이 경우 Effect를 내부적으로 사용하면서 요청 중복을 제거하고 응답을 캐시하고 네트워크 폭포를 피하는 로직을 추가할 것입니다. (데이터를 사전에 로드하거나 데이터 요구 사항을 라우트)

이러한 접근 방식 중 어느 것도 적합하지 않은 경우, Effect 내에서 데이터를 직접 가져오는 것을 계속하셔도 됩니다.

</DeepDive>

### 분석 보내기 {/*sending-analytics*/}

페이지 방문 시 분석 이벤트를 보내는 다음 코드를 고려해보세요.

```js
useEffect(() => {
  logVisit(url); // POST 요청을 보냄
}, [url]);
```

개발 환경에서는 `logVisit`가 각 URL에 대해 두 번 호출될 것입니다. 그래서 이를 수정하고 싶을 수 있습니다. **우리는 이 코드를 그대로 유지하는 것을 권장합니다.** 이전 예제와 마찬가지로 한 번 실행하거나 두 번 실행하는 것 사이에서 *사용자가 볼 수 있는* 동작 차이가 없습니다. 실제로 개발 환경에서는 `logVisit`가 아무 작업도 수행하지 않아야 합니다. 왜냐하면 개발 환경의 로그가 제품 지표를 왜곡시키지 않도록 하기 위함입니다. 컴포넌트는 파일을 저장할 때마다 재마운트되므로 개발 환경에서는 추가적인 방문 기록을 로그에 남기게 됩니다.

**제품 환경에서는 중복된 방문 로그가 없을 것입니다.**

보내는 분석 이벤트를 디버깅하려면 앱을 스테이징 환경(제품 모드로 실행)에 배포하거나 [Strict Mode](/reference/react/StrictMode)를 일시적으로 사용 중지하여 개발 환경 전용의 재마운팅 검사를 수행할 수 있습니다. 또한 Effect 대신 라우트 변경 이벤트 핸들러에서 분석을 보낼 수도 있습니다. 더 정밀한 분석을 위해 [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)를 사용하여 어떤 컴포넌트가 뷰포트에 있는지와 얼마나 오래 보이는지 추적하는 데 도움이 될 수 있습니다.

### Effect가 아닌 경우: 애플리케이션 초기화 {/*not-an-effect-initializing-the-application*/}

일부 로직은 애플리케이션 시작 시에 한 번만 실행되어야 합니다. 이러한 로직은 컴포넌트 외부에 배치할 수 있습니다.

```js {2-3}
if (typeof window !== 'undefined') { // 브라우저에서 실행 중인지 확인합니다.
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ...
}
```

위와 같이 컴포넌트 외부에서 해당 로직을 실행하면, 해당 로직은 브라우저가 페이지를 로드한 후 한 번만 실행됨이 보장됩니다.

### Effect가 아닌 경우: 제품 구입하기 {/*not-an-effect-buying-a-product*/}

가끔은 클린업 함수를 작성하더라도 Effect가 두 번 실행되는 것에 대해 사용자가 확인할 수 있는 결과를 방지할 방법이 없을 수 있습니다. 예를 들어, 아래와 같이 제품을 구매하는 POST 요청을 보내는 Effect가 있다고 가정해 보겠습니다.

```js {2-3}
useEffect(() => {
  // 🔴 잘못된 방법: 이 Effect는 개발 환경에서 두 번 실행되며 코드에 문제가 드러납니다.
  fetch('/api/buy', { method: 'POST' });
}, []);
```

사용자는 제품을 두 번 구매하고 싶지 않을 것입니다. 그러나 이것은 이러한 로직을 Effect에 넣지 않아야 하는 이유입니다. 사용자가 다른 페이지로 이동한 다음 뒤로 가기 버튼을 누르는 경우 어떻게 될까요? Effect가 다시 실행됩니다. 사용자가 페이지를 방문할 때 제품을 구매하려고 하지 않으며, 사용자가 "구매" 버튼을 클릭할 때 제품을 구매하고 싶은 것입니다.

구매는 렌더링에 의해 발생하는 것이 아니라 특정 상호 작용에 의해 발생합니다. 사용자가 버튼을 누를 때만 실행되어야 합니다. **Effect를 삭제하고 `/api/buy` 요청을 Buy 버튼의 이벤트 핸들러로 이동하세요.**

```js {2-3}
  function handleClick() {
    // ✅ 구매는 특정 상호 작용에 의해 발생하는 이벤트입니다.
    fetch('/api/buy', { method: 'POST' });
  }
```

**만약 컴포넌트를 다시 마운트했을 때 애플리케이션의 로직이 깨진다면, 기존에 존재하던 버그가 드러난 것입니다.** 사용자의 관점에서 페이지를 방문하는 것과 페이지를 방문하고, 링크를 클릭한 다음, 뒤로 가기 버튼을 눌러서 다시 페이지로 돌아온것 과 차이가 없어야 합니다. React는 개발 환경에서 컴포넌트를 한 번 다시 마운트하여 이 원칙을 준수하는지 확인합니다.

## 위에서 설명한 모든 것들 적용해보기 {/*putting-it-all-together*/}

이 플레이그라운드를 살펴보면 실제로 Effect가 어떻게 작동하는지에 대한 "느낌을 얻을" 수 있습니다.

이 예제는 [`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout)을 사용하여 Effect가 실행된 후 3초 후에 입력 텍스트와 함께 콘솔 로그가 표시되도록 합니다. 클린업 함수는 실행을 기다리는 타임아웃을 취소합니다. "컴포넌트 마운트" 버튼을 눌러 시작하세요.

<Sandpack>

```js
import { useState, useEffect } from 'react';

function Playground() {
  const [text, setText] = useState('a');

  useEffect(() => {
    function onTimeout() {
      console.log('⏰ ' + text);
    }

    console.log('🔵 스케줄 로그 "' + text);
    const timeoutId = setTimeout(onTimeout, 3000);

    return () => {
      console.log('🟡 취소 로그 "' + text);
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
        컴포넌트 {show ? '언마운트' : '마운트'}
      </button>
      {show && <hr />}
      {show && <Playground />}
    </>
  );
}
```

</Sandpack>

처음에는 `Schedule "a" log`, `Cancel "a" log`, 그리고 다시 `Schedule "a" log` 라는 세 가지 로그를 볼 수 있을 것입니다. 몇 초 후에는 `a`라는 로그가 나타날 것입니다. 이전에 배운 내용처럼 추가된 스케줄/취소 쌍은 React가 컴포넌트를 개발 중에 한 번 다시 마운트하여 정리를 제대로 구현했는지 확인하기 때문입니다.

이제 입력란을 `abc`로 수정해 보세요. 충분히 빠르게 입력하면 `Schedule "ab" log` 바로 뒤에 `Cancel "ab" log`와 `Schedule "abc" log`가 나타날 것입니다. **React는 항상 이전 렌더의 Effect를 다음 렌더의 Effect보다 먼저 정리합니다.** 따라서 빠르게 입력하더라도 한 번에 최대 하나의 타임아웃만 예약되는 것을 볼 수 있습니다. 입력을 몇 번 해보면서 Effect가 어떻게 정리되는지 느껴보세요.

입력란에 무언가를 입력한 다음 "컴포넌트 언마운트"를 눌러보세요. 언마운트가 마지막 렌더의 Effect를 정리함을 주목하세요. 여기서는 타임아웃이 실행되기 전에 마지막 타임아웃이 취소됩니다.

마지막으로 위 컴포넌트를 수정하고 정리 함수의 주석 처리를 해제하여 타임아웃이 취소되지 않도록 해보세요. `abcde`를 빠르게 입력해 보세요. 몇 초 후에 무엇이 기대되는지 생각해 보세요. 타임아웃 내부의 `console.log(text)`가 가장 최근의 `text`를 출력하고 다섯 번의 `abcde` 로그가 생성될까요? 직접 시도하여 확인해 보세요!

수 초 후에 `a`, `ab`, `abc`, `abcd`, 그리고 `abcde`라는 일련의 로그를 볼 수 있을 것입니다. **각 Effect는 해당 렌더의 `text` 값을 "캡처"합니다.** `text` 상태가 변경되었는지 여부는 중요하지 않습니다. `text = 'ab'` 렌더의 Effect에서는 항상 `'ab'`를 볼 것입니다. 다시 말해, 각 렌더의 Effect는 서로 격리되어 있습니다. 이 작동 방식에 대해서 궁금하다면 [클로저](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)에 대해 읽어볼 수 있습니다.

<DeepDive>

#### 각각의 렌더링은 각각의 고유한 Effect를 갖습니다. {/*each-render-has-its-own-effects*/}

`useEffect`를 렌더링 결과물에 "부착"하는 것으로 생각할 수 있습니다. 다음과 같은 Effect를 고려해 보세요.

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

이제 사용자가 앱을 탐색하는 동안 정확히 어떤 일이 일어나는지 알아보겠습니다.

#### 초기 렌더링 {/*initial-render*/}

사용자가 `<ChatRoom roomId="general" />`을 방문합니다. 이때, `roomId`를 `'general'`로 [멘탈모델 위에서 대체](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time)해보겠습니다.

```js
  // 첫 번째 렌더링에 대한 JSX (roomId = "general")
  return <h1>Welcome to general!</h1>;
```

**Effect 또한 렌더링 결과물의 일부입니다.** 첫 번째 렌더링의 Effect는 다음과 같습니다.

```js
  // 첫 번째 렌더링에 대한 이펙트 (roomId = "general")
  () => {
    const connection = createConnection('general');
    connection.connect();
    return () => connection.disconnect();
  },
  // 첫 번째 렌더링의 의존성 (roomId = "general")
  ['general']
```

React는 이 Effect를 실행하며, `'general'` 채팅방에 연결합니다.

#### 같은 의존성 사이에서의 재랜더링 {/*re-render-with-same-dependencies*/}

`<ChatRoom roomId="general" />`가 다시 렌더링된다고 가정해봅시다. JSX 결과물은 동일합니다.

```js
  // 두 번째 렌더링에 대한 JSX (roomId = "general")
  return <h1>Welcome to general!</h1>;
```

React는 렌더링 출력이 변경되지 않았기 때문에 DOM을 업데이트하지 않습니다.

두 번째 렌더링에서의 Effect는 다음과 같습니다.

```js
  // 두 번째 렌더링에 대한 Effect (roomId = "general")
  () => {
    const connection = createConnection('general');
    connection.connect();
    return () => connection.disconnect();
  },
  // 두 번째 렌더링에 대한 의존성 (roomId = "general")
  ['general']
```

React는 두 번째 렌더링에서의 `['general']`를 첫 번째 렌더링에서의 `['general']`와 비교합니다. **모든 의존성이 동일하므로 React는 두 번째 렌더링에서의 Effect를 *무시*합니다.** 해당 Effect는 호출되지 않습니다.

#### 다른 의존성으로 재렌더링 {/*re-render-with-different-dependencies*/}

그럼, 사용자가 `<ChatRoom roomId="travel" />`을 탐색합니다. 이번에는 컴포넌트가 다른 JSX를 반환합니다.

```js
  // 세 번째 렌더링에 대한 JSX (roomId = "travel")
  return <h1>Welcome to travel!</h1>;
```

React는 DOM을 업데이트하여 `"Welcome to general"`을 `"Welcome to travel"`로 변경합니다.

세 번째 렌더링에서의 Effect는 다음과 같습니다:

```js
  // 세 번째 렌더링에 대한 Effect (roomId = "travel")
  () => {
    const connection = createConnection('travel');
    connection.connect();
    return () => connection.disconnect();
  },
  // 세 번째 렌더링에 대한 의존성 (roomId = "travel")
  ['travel']
```

React는 세 번째 렌더링에서의 `['travel']`와 두 번째 렌더링에서의 `['general']`를 비교합니다. 하나의 의존성이 다릅니다: `Object.is('travel', 'general')`은 `false`입니다. Effect는 건너뛸 수 없습니다.

**React는 세 번째 렌더링의 Effect를 적용하기 전에 먼저 실행된 Effect를 정리해야 합니다.** 두 번째 렌더링의 Effect가 건너뛰어졌기 때문에, React는 첫 번째 렌더링의 Effect를 정리해야 합니다. 처음 렌더링되었을 때 스크롤하면, `createConnection('general')`로 생성된 연결에 대해 `disconnect()`를 호출하는 것을 볼 수 있습니다. 이로써 앱은 `'general'` 채팅방과의 연결이 해제됩니다.

그 후에 React는 세 번째 렌더링의 Effect를 실행합니다. `'travel'` 채팅방에 연결합니다.

#### 언마운트 {/*unmount*/}

마지막으로, 사용자가 다른 페이지로 이동하게 되어 `ChatRoom` 컴포넌트가 언마운트됩니다. React는 마지막 Effect의 클린업 함수를 실행합니다. 마지막 Effect는 세 번째 렌더링에서 온 것입니다. 세 번째 렌더링의 클린업은 `createConnection('travel')` 연결을 종료합니다. 그래서 앱은 `'travel'` 채팅방과의 연결을 해제하게 됩니다.

#### 개발 환경에서만의 동작 {/*development-only-behaviors*/}

[Strict Mode](/reference/react/StrictMode)가 활성화된 경우, React는 모든 컴포넌트를 한 번 마운트한 후에 다시 마운트합니다(state와 DOM은 보존됩니다). 이는 [클린업이 필요한 Effect를 찾는 데 도움이 되며](#step-3-add-cleanup-if-needed) 경쟁 조건과 같은 버그를 초기에 드러날 수 있게 합니다. 게다가 React는 개발 중 파일을 저장할 때마다 Effect를 다시 마운트합니다. 이러한 두 가지 동작은 개발 환경에서만 적용됩니다.

</DeepDive>

<Recap>

- 이벤트와 달리 Effect는 특정 상호작용이 아닌 렌더링 자체에 의해 발생합니다.
- Effect를 사용하면 컴포넌트를 외부 시스템(타사 API, 네트워크 등)과 동기화할 수 있습니다.
- 기본적으로 Effect는 모든 렌더링(초기 렌더링 포함) 후에 실행됩니다.
- React는 모든 의존성이 마지막 렌더링과 동일한 값을 가지면 Effect를 건너뜁니다.
- 의존성을 "선택"할 수 없습니다. 의존성은 Effect 내부의 코드에 의해 결정됩니다.
- 빈 의존성 배열(`[]`)은 컴포넌트 "마운팅"(화면에 추가됨)을 의미합니다.
- Strict Mode에서 React는 컴포넌트를 두 번 마운트합니다(개발 환경에서만!) 이는 Effect의 스트레스 테스트를 위한 것입니다.
- Effect가 다시 마운트로 인해 중단된 경우 클린업 함수를 구현해야 합니다.
- React는 Effect가 다음에 실행되기 전에 정리 함수를 호출하며, 언마운트 중에도 호출합니다.

</Recap>

<Challenges>

#### 마운트시 input 필드에 포커스하기 {/*focus-a-field-on-mount*/}

이 예시에서는 form이 `<MyInput />` 컴포넌트를 렌더링합니다.

화면에 나타날 때 `MyInput`이 자동으로 포커스되도록 입력의 [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) 메서드를 사용하세요. 이미 주석 처리된 구현이 있지만 제대로 작동하지 않습니다. 왜 작동하지 않는지 확인하고 수정해 보세요. (`autoFocus` 속성은 존재하지 않는 것으로 가정하세요. 우리는 처음부터 동일한 기능을 다시 구현하고 있습니다.)

<Sandpack>

```js MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ value, onChange }) {
  const ref = useRef(null);

  // TODO: 작동하지 않는다. 고쳐야함
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
      <button onClick={() => setShow(s => !s)}>form {show ? '숨기기' : '보기'}</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            이름을 입력하세요:
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
            대문자로 만들기
          </label>
          <p>안녕하세요, <b>{upper ? name.toUpperCase() : name}님</b></p>
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


솔루션이 제대로 작동하는지 확인하려면 "form 보기"를 누르고 입력란이 포커스되는지 확인하세요.(강조 표시, 커서가 내부에 배치됨). "form 숨기기"를 누르고 다시 "form 보기"를 눌러 입력란이 다시 강조 표시되는지 확인하세요.

`MyInput`은 렌더링 후 매번 포커스되는 것이 아니라 _마운트 시에만_ 포커스되어야 합니다. 이 동작이 올바른지 확인하려면 "form 보기"를 누른 다음 "대문자로 만들기" 체크박스를 반복해서 클릭하세요. 체크박스를 클릭해도 상단의 입력란은 포커스가 _되지 않아야_ 합니다.

<Solution>

렌더링 중에 `ref.current.focus()`를 호출하는 것은 적절하지 않습니다. *부수 효과*이기 때문입니다. 부수 효과는 이벤트 핸들러 내부에 배치하거나 `useEffect`로 선언해야 합니다. 이 경우에는 부작용이 특정 상호작용이 아니라 컴포넌트가 나타나는 것에 의해 _발생되기_ 때문에 Effect 내부에 넣는 것이 맞습니다.

실수를 고치려면 `ref.current.focus()` 호출을 Effect 선언으로 감싸세요. 그런 다음, 이 Effect가 렌더링 후 매번 실행되는 것이 아니라 마운트 시에만 실행되도록 하려면 빈 `[]` 의존성을 추가하세요.

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
      <button onClick={() => setShow(s => !s)}>form {show ? '숨기기' : '보기'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            이름을 입력하세요:
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
            대문자로 만들기
          </label>
          <p>안녕하세요, <b>{upper ? name.toUpperCase() : name}</b>님</p>
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

#### 조건부로 input 필드에 포커스하기 {/*focus-a-field-conditionally*/}

이 form은 두 개의 `<MyInput />` 컴포넌트를 렌더링합니다.

"form 보기"를 누르면 두 번째 필드가 자동으로 포커스됩니다. 이는 두 `<MyInput />` 컴포넌트 모두 내부의 필드에 포커스를 주려고 하기 때문입니다. 두 개의 입력 필드에 연속해서 `focus()`를 호출하면 마지막 호출이 항상 "승리하게" 됩니다.

이제 첫 번째 필드에 포커스를 주려면 첫 번째 `MyInput` 컴포넌트가 `true`로 설정된 `shouldFocus` prop을 받도록 변경해야 합니다. 변경된 로직에 따라 `MyInput`이 받은 `shouldFocus` prop이 `true`일 때에만 `focus()`가 호출되도록 변경해 보세요.

<Sandpack>

```js MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ shouldFocus, value, onChange }) {
  const ref = useRef(null);

  // TODO: shouldFocus가 true일때만 호출되도록
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
      <button onClick={() => setShow(s => !s)}>form {show ? '숨기기' : '보기'}</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            이름을 입력하세요:
            <MyInput
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              shouldFocus={true}
            />
          </label>
          <label>
            성을 입력하세요:
            <MyInput
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              shouldFocus={false}
            />
          </label>
          <p>안녕하세요, <b>{upper ? name.toUpperCase() : name}</b>님</p>
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

해당 코드를 실행하고 주어진 검증 방법을 따라 진행해 봅시다. "form 보기" 버튼을 반복적으로 누르고 "form 숨기기" 버튼을 클릭하여 결과를 확인할 수 있습니다. form이 나타날 때, *첫 번째* 입력 필드에만 포커스가 설정됩니다. 부모 컴포넌트가 첫 번째 입력 필드를 `shouldFocus={true}`로 렌더링하고 두 번째 입력 필드를 `shouldFocus={false}`로 렌더링하기 때문입니다. 또한 두 입력 필드 모두 정상적으로 작동하며, 둘 다 텍스트를 입력할 수 있습니다.

<Hint>

조건부로 `useEffect`를 선언할 수는 없지만, `useEffect` 내부에 조건부 로직을 포함시켜 원하는 동작을 구현할 수 있습니다.

</Hint>

<Solution>

조건부 로직을 Effect 내부로 넣어주세요. `shouldFocus`를 Effect 내에서 사용하므로 이를 의존성으로 명시해야 합니다. (만약 어떤 input의 `shouldFocus`가 `false`에서 `true`로 변경된다면, 마운트 후에 포커스가 될 것입니다.)

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
      <button onClick={() => setShow(s => !s)}>form {show ? '숨기기' : '보기'}</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            이름을 입력하세요:
            <MyInput
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              shouldFocus={true}
            />
          </label>
          <label>
            성을 입력하세요:
            <MyInput
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              shouldFocus={false}
            />
          </label>
          <p>안녕하세요, <b>{upper ? name.toUpperCase() : name}님</b></p>
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

#### 두 번 실행되는 interval 고치기 {/*fix-an-interval-that-fires-twice*/}

아래 'Counter' 컴포넌트는 매 초마다 증가하는 카운터를 나타냅니다. 컴포넌트가 마운트될 때 [`setInterval`](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)을 호출합니다. 이로 인해 'onTick' 함수가 매 초마다 실행됩니다. 'onTick' 함수는 카운터를 증가시킵니다.

하지만 1초마다 한 번씩 증가하는 대신 두 번씩 증가합니다. 왜 그럴까요? 버그의 원인을 찾아 수정하세요

<Hint>

`setInterval`은 interval ID를 반환하는데, 이를 [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval) 함수에 전달하여 interval을 중지할 수 있습니다.

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
      <button onClick={() => setShow(s => !s)}>카운터 {show ? '숨기기' : '보기'}</button>
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

[Strict Mode](/reference/react/StrictMode)가 활성화된 경우 (이 사이트의 코드 예제 샌드박스처럼), React는 개발 중에 각 컴포넌트를 한 번씩 리마운트합니다. 이로 인해 간격이 두 번 설정되어 매 초마다 카운터가 두 번 증가합니다.

그러나 React의 동작이 버그의 *원인*은 아닙니다. 버그는 코드에 있습니다. React의 동작은 버그를 더 눈에 띄게 만듭니다. 실제 문제는 이 Effect가 프로세스를 시작한 후에 클린업할 수 있는 방법을 제공하지 않는 것입니다.

이 코드를 수정하려면 `setInterval`에 의해 반환된 interval ID를 저장하고, [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval)을 사용하여 클린업 함수를 구현하세요.

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
      <button onClick={() => setShow(s => !s)}>카운터 {show ? '숨기기' : '보기'}</button>
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

개발 중에 React는 여전히 컴포넌트를 한 번 리마운트하여 클린업이 잘 구현되었는지 확인합니다. 따라서 최초의 `setInterval` 호출 이후에, 바로 다음 `clearInterval`, 그리고 다시 `setInterval` 호출이 발생합니다. 프로덕션(운영 환경)에서는 `setInterval` 호출이 한 번만 있을 것입니다. 개발 환경과 운영 환경 모두 사용자가 볼 수 있는 동작은 동일합니다. 카운터가 1초마다 한 번씩 증가하는 것이죠.

</Solution>

#### Effect 내부에서의 잘못된 데이터 페칭 고치기 {/*fix-fetching-inside-an-effect*/}

이 컴포넌트는 select 태그로 선택한 사람의 일대기를 보여줍니다. 이 컴포넌트는 선택된 `person`이 변경될 때마다, 또한 마운트될 때마다 비동기 함수 `fetchBio(person)`를 호출하여 일대기를 불러옵니다. 이 비동기 함수는 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)를 반환하며, 이 Promise는 결국 문자열로 resolve됩니다. 불러오기가 완료되면 `setBio`를 호출하여 해당 문자열을 select의 option으로 표시합니다.

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
      resolve('이것은 ' + person + '의 일대기입니다.');
    }, delay);
  })
}

```

</Sandpack>


이 코드에 버그가 있습니다. "Alice"를 선택한 다음 "Bob"을 선택한 다음 바로 "Taylor"을 선택하면 버그가 발생합니다. 충분히 빠르게 이 작업을 수행하면 버그를 확인할 수 있습니다. Taylor가 선택되었지만 아래 단락에는 "이것은 Bob의 전기입니다."라고 표시됩니다.

이러한 현상이 발생하는 이유는 무엇일까요? 이 Effect 내부의 버그를 수정하세요.

<Hint>

Effect가 비동기로 무언가를 가져오는 경우 일반적으로 클린업이 필요합니다.

</Hint>

<Solution>

버그를 트리거하려면 다음 순서대로 진행되어야 합니다:

- `'Bob'`을 선택하면 `fetchBio('Bob')`가 트리거됩니다.
- `'Taylor'`을 선택하면 `fetchBio('Taylor')`가 트리거됩니다.
- **`'Taylor'`의 일대기를 가져오는 작업이 `'Bob'`의 일대기를 가져오는 작업보다 *먼저* 완료됩니다.**
- `'Taylor'` 렌더링의 Effect가 `setBio('This is Taylor’s bio')`를 호출합니다.
- `'Bob'`의 일대기를 가져오는 작업이 완료됩니다.
- `'Bob'` 렌더링의 Effect가 `setBio('This is Bob’s bio')`를 호출합니다.

이렇게 하면 Taylor가 선택되었음에도 불구하고 Bob의 일대기가 표시됩니다. 이와 같은 버그는 두 개의 비동기 작업이 "경쟁(race)"하며 작업 완료의 순서를 예상할 수 없는 [경쟁 조건(race condition)](https://en.wikipedia.org/wiki/Race_condition)이라고 합니다.

이 경쟁 조건을 해결하려면 클린업 함수를 추가하세요.

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
      resolve('이것은 ' + person + '의 일대기입니다.');
    }, delay);
  })
}

```

</Sandpack>

각 렌더링의 Effect는 자체 `ignore` 변수를 가지고 있습니다. 처음에 `ignore` 변수는 `false`로 설정됩니다. 그러나 Effect가 클린업되면(예: 다른 사람을 선택할 때), 해당 Effect의 `ignore` 변수는 `true`로 설정됩니다. 이제 어떤 순서로 요청이 완료되는지는 중요하지 않습니다. 마지막 사람의 Effect만 `ignore`가 `false`로 설정되므로 `setBio(result)`를 호출합니다. 이전 Effect는 정리되었으므로 `if (!ignore)` 검사가 `setBio` 호출을 방지합니다:

- `'Bob'`을 선택하면 `fetchBio('Bob')`가 트리거됩니다.
- `'Taylor'`을 선택하면 `fetchBio('Taylor')`가 트리거되며 이전(Bob의) Effect가 **정리(cleaned up)**됩니다.
- `'Taylor'`의 일대기를 가져오는 작업이 `'Bob'`의 일대기를 가져오는 작업보다 *먼저* 완료됩니다.
- `'Taylor'` 렌더링의 Effect가 `setBio('This is Taylor’s bio')`를 호출합니다.
- `'Bob'`의 일대기를 가져오는 작업이 완료됩니다.
- `'Bob'` 렌더링의 Effect는 **`ignore` 플래그가 `true`로 설정되었기 때문에 아무 일도 수행하지 않습니다.**

오래된 API 호출의 결과를 무시하는 것 외에도 더 이상 필요하지 않은 요청을 취소하기 위해 [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)를 사용할 수도 있습니다. 그러나 이것만으로는 경쟁 조건에 대한 충분한 보호가 이뤄지지 않습니다. 피치 못할 상황에서는 추가적인 비동기 작업이 후행할 수 있으므로 `ignore`와 같은 명시적 플래그를 사용하는 것이 이러한 종류의 문제를 가장 안전하게 해결하는 가장 신뢰할 수 있는 방법입니다.

</Solution>

</Challenges>

