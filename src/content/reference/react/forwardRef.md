---
title: forwardRef
---

<Intro>

`forwardRef` 를 사용하면 컴포넌트가 [ref.](/learn/manipulating-the-dom-with-refs)를 사용하여 부모 컴포넌트의 DOM 노드를 노출할 수 있습니다.

```js
const SomeComponent = forwardRef(render)
```

</Intro>

<InlineToc />

---

## 레퍼런스 {/*reference*/}

### `forwardRef(render)` {/*forwardref*/}

컴포넌트가 ref를 받아 하위 컴포넌트로 전달하도록 하려면 `forwardRef()`를 호출하세요.

```js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  // ...
});
```

[아래에서 더 많은 예시를 확인하세요.](#usage)

#### 매개변수 {/*parameters*/}

* `render`: 컴포넌트의 렌더링 함수입니다. React는 컴포넌트가 부모로부터 받은 props와 `ref`로 이 함수를 호출합니다. 반환하는 JSX는 컴포넌트의 결과가 됩니다.

#### 반환값 {/*returns*/}

`forwardRef`는 JSX에서 렌더링할 수 있는 React 컴포넌트를 반환합니다. 일반 함수로 정의된 React 컴포넌트와 다르게, `forwardRef`가 반환하는 컴포넌트는 `ref` prop도 받을 수 있습니다.

#### 주의 {/*caveats*/}

* Strict Mode에서 React는 [실수로 발생한 결함을 찾기 위해](#my-initializer-or-updater-function-runs-twice) **렌더링 함수를 두 번 호출**합니다. 이는 개발 환경 전용 동작이며 프로덕션 환경에는 영향을 미치지 않습니다. 렌더링 함수가 순수함수인 경우(그래야만 합니다.) 컴포넌트 로직에 영향을 미치지 않습니다. 호출 결과 중 하나의 결과는 무시됩니다.


---

### `render` 함수 {/*render-function*/}

`forwardRef`는 render 함수를 인수로 받습니다. React는 `props`와 `ref`와 함께 이 함수를 호출합니다.

```js
const MyInput = forwardRef(function MyInput(props, ref) {
  return (
    <label>
      {props.label}
      <input ref={ref} />
    </label>
  );
});
```

#### 매개변수 {/*render-parameters*/}

* `props`: 부모 컴포넌트가 전달한 props입니다.

* `ref`: 부모 컴포넌트가 전달한 `ref` 어트리뷰트입니다. `ref`는 객체나 함수일 수 있습니다. 부모 컴포넌트가 ref를 전달하지 않은 경우 `null`이 됩니다. 전달받은 `ref`를 다른 컴포넌트에 전달하거나 [`useImperativeHandle`.](/reference/react/useImperativeHandle)에 전달해야 합니다.

#### 반환값 {/*render-returns*/}

`forwardRef`는 JSX에서 렌더링할 수 있는 React 컴포넌트를 반환합니다. 일반 함수로 정의된 React 컴포넌트와 다르게 `forwardRef` 에 의해 반환되는 컴포넌트는 `ref` prop를 받을 수 있습니다.

---

## 사용법 {/*usage*/}

### 부모 컴포넌트에 DOM 노드 노출하기 {/*exposing-a-dom-node-to-the-parent-component*/}

기본적으로 각 컴포넌트의 DOM 노드는 비공개입니다. 그러나 때로는 부모에 DOM 노드를 노출하는 것이 유용할 수 있습니다. 예를 들어 focus 하기 위해 노출할 수 있습니다. 이를 위해 컴포넌트 정의를 `forwardRef()`로 감싸주면 됩니다.

```js {3,11}
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} />
    </label>
  );
});
```

props 다음에 두 번째 인수로 <CodeStep step={1}>ref</CodeStep>를 받게 됩니다. 노출하려는 DOM 노드에 이를 전달합니다.

```js {8} [[1, 3, "ref"], [1, 8, "ref", 30]]
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});
```

이렇게 하면 부모인 `Form` 컴포넌트가 `MyInput`에 의해 노출된 <CodeStep step={2}>`<input>` DOM 노드</CodeStep>에 접근할 수 있습니다.

```js [[1, 2, "ref"], [1, 10, "ref", 41], [2, 5, "ref.current"]]
function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

이 `Form` 컴포넌트는 `MyInput` 에게 [ref를 전달](/reference/react/useRef#manipulating-the-dom-with-a-ref)합니다. `MyInput` 컴포넌트는 해당 ref를 `<input>` 태그에 전달합니다. 결과적으로 `Form` 컴포넌트는 해당 `<input>` DOM 노드에 접근하여 [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus)를 호출할 수 있습니다.

컴포넌트 내부의 DOM 노드의 ref를 노출하면 나중에 컴포넌트의 내부를 변경하기가 더 어려워진다는 점에 유의하세요. 일반적으로 버튼이나 텍스트 input과 같이 재사용할 수 있는 저수준 컴포넌트에서 DOM 노드를 노출하지만, 아바타나 댓글 같은 애플리케이션 레벨의 컴포넌트에서는 노출하고 싶지 않을 것입니다.

<Recipes title="ref 전달 예시">

#### 텍스트 input에 초점 맞추기 {/*focusing-a-text-input*/}

버튼을 클릭하면 input에 포커스 됩니다. `Form` 컴포넌트는 ref를 정의하고 이를 `MyInput` 컴포넌트로 전달합니다. `MyInput` 컴포넌트는 해당 ref를 `input`으로 전달합니다. 이렇게 하면 `Form` 컴포넌트가 `input`의 포커스를 줄 수 있습니다.

<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});

export default MyInput;
```

```css
input {
  margin: 5px;
}
```

</Sandpack>

<Solution />

#### 비디오 재생 및 정지하기 {/*playing-and-pausing-a-video*/}

버튼을 클릭하면 `<video>` DOM 노드에서 [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) 및 [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause)를 호출합니다. `App` 컴포넌트는 ref를 정의하고 이를 `MyVideoPlayer` 컴포넌트에 전달합니다. `MyVideoPlayer` 컴포넌트는 해당 ref를 브라우저 `<video>` 노드로 전달합니다. 이렇게 하면 `App` 컴포넌트가 `<video>`를 재생하고 정지할 수 있습니다.

<Sandpack>

```js
import { useRef } from 'react';
import MyVideoPlayer from './MyVideoPlayer.js';

export default function App() {
  const ref = useRef(null);
  return (
    <>
      <button onClick={() => ref.current.play()}>
        Play
      </button>
      <button onClick={() => ref.current.pause()}>
        Pause
      </button>
      <br />
      <MyVideoPlayer
        ref={ref}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
        type="video/mp4"
        width="250"
      />
    </>
  );
}
```

```js MyVideoPlayer.js
import { forwardRef } from 'react';

const VideoPlayer = forwardRef(function VideoPlayer({ src, type, width }, ref) {
  return (
    <video width={width} ref={ref}>
      <source
        src={src}
        type={type}
      />
    </video>
  );
});

export default VideoPlayer;
```

```css
button { margin-bottom: 10px; margin-right: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### 여러 컴포넌트를 통해 ref 전달하기 {/*forwarding-a-ref-through-multiple-components*/}

`ref`를 DOM 노드로 전달하지 않고 `MyInput`과 같은 컴포넌트로 전달할 수 있습니다.

```js {1,5}
const FormField = forwardRef(function FormField(props, ref) {
  // ...
  return (
    <>
      <MyInput ref={ref} />
      ...
    </>
  );
});
```

`MyInput` 컴포넌트가 `<input>`에 ref를 전달하면 `FormField`의 ref는 해당 `<input>`을 얻을 수 있습니다.

```js {2,5,10}
function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <FormField label="Enter your name:" ref={ref} isRequired={true} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

`Form` 컴포넌트는 ref를 정의하고 이를 `FormField`에 전달합니다. `FormField` 컴포넌트는 해당 ref를 `MyInput`으로 전달하고, 이 컴포넌트는  `<input>` DOM 노드로 전달합니다. 이것이 `Form`이 `<input>` DOM 노드에 접근하는 방식입니다.


<Sandpack>

```js
import { useRef } from 'react';
import FormField from './FormField.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <FormField label="Enter your name:" ref={ref} isRequired={true} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js FormField.js
import { forwardRef, useState } from 'react';
import MyInput from './MyInput.js';

const FormField = forwardRef(function FormField({ label, isRequired }, ref) {
  const [value, setValue] = useState('');
  return (
    <>
      <MyInput
        ref={ref}
        label={label}
        value={value}
        onChange={e => setValue(e.target.value)} 
      />
      {(isRequired && value === '') &&
        <i>Required</i>
      }
    </>
  );
});

export default FormField;
```


```js MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef((props, ref) => {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});

export default MyInput;
```

```css
input, button {
  margin: 5px;
}
```

</Sandpack>

---

### DOM 노드 대신 명령형 핸들 노출하기 {/*exposing-an-imperative-handle-instead-of-a-dom-node*/}

전체 DOM 노드를 노출하는 대신 제한된 메서드 집합과 함께 *명령형 핸들*이라고 하는 사용자 정의 객체를 노출할 수 있습니다. 이를 위해 DOM 노드를 보유할 별도의 ref를 정의해야 합니다.

```js {2,6}
const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  // ...

  return <input {...props} ref={inputRef} />;
});
```

전달받은 `ref`를 [`useImperativeHandle`](/reference/react/useImperativeHandle)에 전달하고 노출하려는 값을 `ref`에 지정합니다.

```js {6-15}
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});
```

일부 컴포넌트가 `MyInput`의 ref를 받으면 DOM 노드 대신 `{ focus, scrollIntoView }` 객체만 받습니다. 이를 통해 노출하는 DOM 노드의 정보를 최소한으로 제한할 수 있습니다.

<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
    // This won't work because the DOM node isn't exposed:
    // ref.current.style.opacity = 0.5;
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js MyInput.js
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});

export default MyInput;
```

```css
input {
  margin: 5px;
}
```

</Sandpack>

[명령형 핸들 사용에 대해 자세히 알아보세요.](/reference/react/useImperativeHandle)

<Pitfall>

**ref를 과도하게 사용하지 마세요.** 노드로 스크롤 하기, 노드에 포커스하기, 애니메이션 트리거하기, 텍스트 선택하기 등 prop로 표현할 수 없는 필수적인 동작에만 ref를 사용해야 합니다.

**prop로 무언가를 표현할 수 있다면 ref를 사용해서는 안 됩니다.** 예를 들어 `Modal` 컴포넌트에서 `{ open, close }`와 같은 명령형 핸들을 노출하는 대신 `<Modal isOpen={isOpen} />`과 같이 prop `isOpen`을 사용하는 것이 더 좋습니다. [Effects](/learn/synchronizing-with-effects)는 props를 통해 명령형 동작을 노출하는 데 도움이 될 수 있습니다.

</Pitfall>

---

## 문제해결 {/*troubleshooting*/}

### 컴포넌트가 `forwardRef`로 감싸져 있지만, 컴포넌트의 `ref`는 항상 `null`입니다. {/*my-component-is-wrapped-in-forwardref-but-the-ref-to-it-is-always-null*/}

일반적으로 `ref`를 실제로 사용하는 것을 잊어버렸다는 것입니다.

예를 들어 이 컴포넌트는 `ref`로 아무것도 하지 않습니다.

```js {1}
const MyInput = forwardRef(function MyInput({ label }, ref) {
  return (
    <label>
      {label}
      <input />
    </label>
  );
});
```

이 문제를 해결하려면 `ref`를 DOM 노드나 ref를 받을 수 있는 다른 컴포넌트에 전달하세요.

```js {1,5}
const MyInput = forwardRef(function MyInput({ label }, ref) {
  return (
    <label>
      {label}
      <input ref={ref} />
    </label>
  );
});
```

일부 로직이 조건부인 경우 `MyInput`의 `ref`가 `null`일 수 있습니다.

```js {1,5}
const MyInput = forwardRef(function MyInput({ label, showInput }, ref) {
  return (
    <label>
      {label}
      {showInput && <input ref={ref} />}
    </label>
  );
});
```

`showInput`이 `false`이면 ref가 어떤 노드로도 전달되지 않으며 `MyInput`의 ref는 비어 있게 됩니다. 이 예제의 `Panel`과 같이 조건이 다른 컴포넌트 안에 숨겨져 있는 경우 특히 이 점을 놓치기 쉽습니다.

```js {5,7}
const MyInput = forwardRef(function MyInput({ label, showInput }, ref) {
  return (
    <label>
      {label}
      <Panel isExpanded={showInput}>
        <input ref={ref} />
      </Panel>
    </label>
  );
});
```
