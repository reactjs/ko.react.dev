---
title: findDOMNode
---

<Deprecated>

이 API는 향후 React의 주요 버전에서 제거될 예정입니다. [대안들을 살펴보세요.](#alternatives)

</Deprecated>

<Intro>

`findDOMNode`는 React의 [클래스 컴포넌트](/reference/react/Component)에서 브라우저의 DOM 노드를 찾는 방법입니다.

```js
const domNode = findDOMNode(componentInstance)
```

</Intro>

<InlineToc />

---

## 레퍼런스 {/*reference*/}

### `findDOMNode(componentInstance)` {/*finddomnode*/}

`findDOMNode`를 호출하여 주어진 [클래스 컴포넌트](/reference/react/Component)에서 브라우저의 DOM 노드를 찾습니다.

```js
import { findDOMNode } from 'react-dom';

const domNode = findDOMNode(componentInstance);
```

[아래 예시를 참고하세요.](#usage)

#### 매개변수 {/*parameters*/}

* `componentInstance`: [`컴포넌트`](/reference/react/Component) 하위 클래스의 인스턴스입니다. 예를 들어 클래스 컴포넌트의 경우 `this`가 포함되어 있습니다.


#### 반환 {/*returns*/}

`findDOMNode`는 주어진 `componentInstance`에서 가장 처음 등장하는 브라우저 DOM 노드를 반환합니다. 컴포넌트가 `null`이나 `false`를 렌더링할 경우 `findDOMNode`는 `null`을 반환합니다. 컴포넌트가 문자열을 렌더링하면 `findDOMNode`는 그 값을 포함한 텍스트 DOM 노드를 반환합니다.

#### 주의사항 {/*caveats*/}

* 컴포넌트가 배열이나 다수의 자식을 가진 [Fragment](/reference/react/Fragment)를 반환할 수 있습니다. 이런 경우 `findDOMNode`는 해당하는 DOM 노드 중 비어있지 않은 첫 번째 자식을 반환합니다.

* `findDOMNode`는 컴포넌트가 마운트 되었을 때(즉, 컴포넌트가 DOM에 배치되었을 때)만 동작합니다. 컴포넌트가 아직 마운트 되지 않은 상태에서 호출할 경우 (예시로 컴포넌트가 생성되기 전인 `render()` 내에서 `findDOMNode()`를 호출하는 경우) 예외가 발생합니다.

* `findDOMNode`는 호출할 당시의 결과만 반환합니다. 이후에 자식 컴포넌트가 다른 노드를 렌더링하더라도, 그 변화에 대해 알 수 없습니다.

* `findDOMNode`는 클래스 컴포넌트에서만 사용할 수 있습니다. 함수 컴포넌트에서는 사용할 수 없습니다.

---

## 사용법 {/*usage*/}

### 클래스 컴포넌트의 root DOM 노드를 찾기 {/*finding-the-root-dom-node-of-a-class-component*/}

[클래스 컴포넌트](/reference/react/Component) 인스턴스에서 `findDOMNode`를 호출하여 (주로 `this`) 이를 렌더링한 DOM 노드를 찾습니다.

```js {3}
class AutoselectingInput extends Component {
  componentDidMount() {
    const input = findDOMNode(this);
    input.select()
  }

  render() {
    return <input defaultValue="Hello" />
  }
}
```

여기서 `input` 변수는 `<input>` DOM 요소를 값으로 갖게 됩니다. 이제 이것을 통해 작업이 가능해집니다. 예를 들어 "Show example"을 클릭하여 입력창을 마운트하고, [`input.select()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select)로 입력창의 모든 문자를 선택하도록 합니다.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Show example
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js src/AutoselectingInput.js active
import { Component } from 'react';
import { findDOMNode } from 'react-dom';

class AutoselectingInput extends Component {
  componentDidMount() {
    const input = findDOMNode(this);
    input.select()
  }

  render() {
    return <input defaultValue="Hello" />
  }
}

export default AutoselectingInput;
```

</Sandpack>

---

## 대안 {/*alternatives*/}

### ref를 통해 컴포넌트의 DOM 노드 읽기 {/*reading-components-own-dom-node-from-a-ref*/}

`findDOMNode`를 사용하는 코드는 JSX 노드와 이에 해당하는 코드 사이의 연결이 명시적이지 않아 취약합니다. 예시로 `<input />`를 `<div>`로 감싸보세요.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Show example
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js src/AutoselectingInput.js active
import { Component } from 'react';
import { findDOMNode } from 'react-dom';

class AutoselectingInput extends Component {
  componentDidMount() {
    const input = findDOMNode(this);
    input.select()
  }
  render() {
    return <input defaultValue="Hello" />
  }
}

export default AutoselectingInput;
```

</Sandpack>

이제 코드가 깨질 텐데, 코드는 `findDOMNode(this)`가 `<input>` DOM 노드를 찾을 것으로 기대하고 있었지만 실제로 찾은 것은 `<div>` DOM 노드이기 때문입니다. 이러한 문제를 방지하기 위해 특정 DOM 노드를 관리할 때는 [`createRef`](/reference/react/createRef)를 사용하세요.

이 예시에선 `findDOMNode`는 더 이상 사용하지 않습니다. 대신 `inputRef = createRef(null)`를 클래스의 인스턴스 필드에 정의하였습니다. 여기서 `this.inputRef.current`를 통해 DOM 노드를 읽을 수 있습니다. 이것을 JSX에 붙이려면, `<input ref={this.inputRef} />`를 렌더링합니다. 이 작업은 DOM 노드를 사용하는 코드와 JSX를 연결합니다.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Show example
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js src/AutoselectingInput.js active
import { createRef, Component } from 'react';

class AutoselectingInput extends Component {
  inputRef = createRef(null);

  componentDidMount() {
    const input = this.inputRef.current;
    input.select()
  }

  render() {
    return (
      <input ref={this.inputRef} defaultValue="Hello" />
    );
  }
}

export default AutoselectingInput;
```

</Sandpack>

클래스 컴포넌트를 사용하지 않는 최신 React에서는, [`useRef`](/reference/react/useRef)를 대신 호출하여 동일한 기능을 구현합니다.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Show example
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js src/AutoselectingInput.js active
import { useRef, useEffect } from 'react';

export default function AutoselectingInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    const input = inputRef.current;
    input.select();
  }, []);

  return <input ref={inputRef} defaultValue="Hello" />
}
```

</Sandpack>

[refs를 사용한 DOM 조작에 대해 더 알아보세요.](/learn/manipulating-the-dom-with-refs)

---

### forwarded ref를 사용하여 자식 컴포넌트의 DOM 노드를 읽기 {/*reading-a-child-components-dom-node-from-a-forwarded-ref*/}

이 예시에서는 `findDOMNode(this)`가 다른 컴포넌트에 속한 DOM 노드를 찾습니다. `AutoselectingInput` 컴포넌트는 브라우저의 `<input>`을 렌더링하는 `MyInput` 컴포넌트를 렌더링합니다.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Show example
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js src/AutoselectingInput.js active
import { Component } from 'react';
import { findDOMNode } from 'react-dom';
import MyInput from './MyInput.js';

class AutoselectingInput extends Component {
  componentDidMount() {
    const input = findDOMNode(this);
    input.select()
  }
  render() {
    return <MyInput />;
  }
}

export default AutoselectingInput;
```

```js src/MyInput.js
export default function MyInput() {
  return <input defaultValue="Hello" />;
}
```

</Sandpack>

`AutoselectingInput` 컴포넌트의 내부에서 `findDOMNode(this)`를 호출하면, `<input>`에 대한 JSX가 `MyInput` 컴포넌트 내부에 숨겨져 있더라도 문제없이 `<input>` DOM 노드를 찾아낼 수 있습니다. 이러한 동작이 위 예시에서는 편리해 보일 수 있겠지만, 결국은 취약한 코드로 가는 밑거름이 됩니다. 만약 나중에 코드를 수정하며 `MyInput`을 `<div>`로 감싼다고 생각해 보세요. `<input>`을 찾을 것으로 기대하던 `AutoselectingInput`의 코드를 깨뜨리게 됩니다.

위 예시의 `findDOMNode`를 대체하려면, 두 컴포넌트가 협력해야 합니다.

1. `AutoSelectingInput`에서는 ref를 선언해야 하고, [이전의 예시](#reading-components-own-dom-node-from-a-ref)처럼 `<MyInput>`으로 전달합니다.
2. `MyInput`은 [`forwardRef`](/reference/react/forwardRef)로 선언해야 하며, 해당 ref를 가져와 `<input>` 노드로 전달합니다.

아래 방식으로 사용하면 더 이상 `findDOMNode`가 필요하지 않습니다.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Show example
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js src/AutoselectingInput.js active
import { createRef, Component } from 'react';
import MyInput from './MyInput.js';

class AutoselectingInput extends Component {
  inputRef = createRef(null);

  componentDidMount() {
    const input = this.inputRef.current;
    input.select()
  }

  render() {
    return (
      <MyInput ref={this.inputRef} />
    );
  }
}

export default AutoselectingInput;
```

```js src/MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  return <input ref={ref} defaultValue="Hello" />;
});

export default MyInput;
```

</Sandpack>

클래스 컴포넌트 대신 함수 컴포넌트에서 사용할 때는 이런 코드로 동작합니다.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Show example
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js src/AutoselectingInput.js active
import { useRef, useEffect } from 'react';
import MyInput from './MyInput.js';

export default function AutoselectingInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    const input = inputRef.current;
    input.select();
  }, []);

  return <MyInput ref={inputRef} defaultValue="Hello" />
}
```

```js src/MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  return <input ref={ref} defaultValue="Hello" />;
});

export default MyInput;
```

</Sandpack>

---

### 감싸주는 `<div>` 요소 추가하기 {/*adding-a-wrapper-div-element*/}

컴포넌트는 종종 자식의 위치와 크기를 알아야 할 때가 있습니다. 때문에 `findDOMNode(this)`를 사용하여 자식들을 찾고, 측정을 위해 [`getBoundingClientRect`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)와 같은 DOM 메서드를 사용하게 됩니다.

이러한 사용 사례에 직접적으로 대응되는 방법이 없기 때문에 `findDOMNode`는 더 이상 사용되지 않음에도 React에서 완전히 사라지지는 않았습니다. 그동안 이를 해결하기 위해 콘텐츠 주위를 `<div>` 노드로 감싸주고, 그 노드의 ref를 가져왔습니다. 하지만, 콘텐츠를 감싸는 요소를 추가하는 방법은 스타일을 손상할 수 있습니다.

```js
<div ref={someRef}>
  {children}
</div>
```

이는 특정 항목에 초점을 맞추고 스크롤을 하는 경우에도 적용됩니다.
