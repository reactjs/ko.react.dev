---
title: 'Ref로 DOM 조작하기'
---

<Intro>

React는 렌더링 결과물에 맞춰 [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction) 변경을 자동으로 처리하기 때문에 컴포넌트에서 자주 DOM을 조작해야 할 필요는 없습니다. 하지만 가끔 특정 노드에 포커스를 옮기거나, 스크롤 위치를 옮기거나, 위치와 크기를 측정하기 위해서 React가 관리하는 DOM 요소에 접근해야 할 때가 있습니다. React는 이런 작업을 수행하는 내장 방법을 제공하지 않기 때문에 DOM 노드에 접근하기 위한 *ref*가 필요할 것입니다.

</Intro>

<YouWillLearn>

- `ref` 어트리뷰트로 React가 관리하는 DOM 노드에 접근하는 법
- `ref` JSX 어트리뷰트와 `useRef` Hook의 관련성
- 다른 컴포넌트의 DOM 노드에 접근하는 법
- React가 관리하는 DOM을 수정해도 안전한 경우

</YouWillLearn>

## ref로 노드 가져오기 {/*getting-a-ref-to-the-node*/}

먼저 React가 관리하는 DOM 노드에 접근하기 위해 `useRef` Hook을 가져옵니다.

```js
import { useRef } from 'react';
```

컴포넌트 안에서 ref를 선언하기 위해 방금 가져온 Hook을 사용합니다.

```js
const myRef = useRef(null);
```

마지막으로 ref를 DOM 노드를 가져와야하는 JSX tag 에 `ref` 어트리뷰트로 전달합니다.

```js
<div ref={myRef}>
```

`useRef` Hook은 `current`라는 단일 속성을 가진 객체를 반환합니다. 초기에는 'myRef.current'가 'null'이 됩니다. React가 이 `<div>`에 대한 DOM 노드를 생성할 때, React는 이 노드에 대한 참조를 `myRef.current`에 넣습니다. 그리고 이 DOM 노드를 [이벤트 핸들러](/learn/responding-to-events)에서 접근하거나 노드에 정의된 내장 [브라우저 API](https://developer.mozilla.org/docs/Web/API/Element)를 사용할 수 있습니다.

```js
// 예를 들어 이렇게 브라우저 API를 사용할 수 있습니다
myRef.current.scrollIntoView();
```

### 예시: 텍스트 입력에 포커스 이동하기 {/*example-focusing-a-text-input*/}

이 예시에서 버튼을 클릭하면 input 요소로 포커스를 이동합니다.

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

위 예시를 구현하기 위해서

1. `useRef` Hook을 사용하여 `inputRef`를 선언합니다.
2. 선언한 `inputRef`를 `<input ref={inputRef}>`처럼 전달합니다. 이 행위는 **React에 이 `<input>`의 DOM 노드를 `inputRef.current`에 넣어줘** 라고 하는 것입니다.
3. `handleClick` 함수에서 `inputRef.current`에서 input DOM 노드를 읽고 `inputRef.current.focus()`로 [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus)를 호출합니다.
4. `<button>`의 `onClick`으로 `handleClick` 이벤트 핸들러를 전달합니다.

DOM 조작이 ref를 사용하는 가장 일반적인 사용처지만 `useRef` Hook은 setTimeout Timer ID 같은 React 외부 요소를 저장하는 용도로도 사용할 수 있습니다. state와 비슷하게 ref는 렌더링 사이에도 유지됩니다. ref를 설정하더라도 컴포넌트의 렌더링을 다시 유발하지 않는 state와 유사합니다. [Ref와 값 참조](/learn/referencing-values-with-refs)에서 ref에 대해 자세히 배울 수 있습니다.

### 예시: 한 요소로 스크롤을 이동하기 {/*example-scrolling-to-an-element*/}

한 컴포넌트에서 하나 이상의 ref를 가질 수 있습니다. 이 예시에서는 이미지 3개가 있는 캐러셀이 있습니다. 각 버튼은 브라우저 [`scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) 메서드를 해당 DOM 노드로 호출하여 이미지를 중앙에 배치합니다.

<Sandpack>

```js
import { useRef } from 'react';

export default function CatFriends() {
  const firstCatRef = useRef(null);
  const secondCatRef = useRef(null);
  const thirdCatRef = useRef(null);

  function handleScrollToFirstCat() {
    firstCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function handleScrollToSecondCat() {
    secondCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function handleScrollToThirdCat() {
    thirdCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  return (
    <>
      <nav>
        <button onClick={handleScrollToFirstCat}>
          Tom
        </button>
        <button onClick={handleScrollToSecondCat}>
          Maru
        </button>
        <button onClick={handleScrollToThirdCat}>
          Jellylorum
        </button>
      </nav>
      <div>
        <ul>
          <li>
            <img
              src="https://placekitten.com/g/200/200"
              alt="Tom"
              ref={firstCatRef}
            />
          </li>
          <li>
            <img
              src="https://placekitten.com/g/300/200"
              alt="Maru"
              ref={secondCatRef}
            />
          </li>
          <li>
            <img
              src="https://placekitten.com/g/250/200"
              alt="Jellylorum"
              ref={thirdCatRef}
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

<DeepDive>

#### ref 콜백을 사용하여 ref 리스트 관리하기 {/*how-to-manage-a-list-of-refs-using-a-ref-callback*/}

위 예시에서는 미리 정해진 숫자만큼 ref가 있었습니다. 하지만 때때로 목록의 아이템마다 ref가 필요할 수도 있고, 얼마나 많은 ref가 필요할지 예측할 수 없는 경우도 있습니다. 그럴 때 아래 코드는 **작동하지 않습니다**.

```js
<ul>
  {items.map((item) => {
    // 작동하지 않습니다!
    const ref = useRef(null);
    return <li ref={ref} />;
  })}
</ul>
```

왜냐하면 **Hook은 컴포넌트의 최상단에서만 호출되어야 하기 때문입니다**. `useRef`를 반복문, 조건문 혹은 `map()` 안쪽에서 호출할 수 없습니다.

이 문제를 해결하는 한 방법은 부모 요소에서 단일 ref를 얻고, [`querySelectorAll`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll)과 같은 DOM 조작 메서드를 사용하여 그 안에서 개별 자식 노드를 "찾는" 것입니다. 하지만 이는 다루기가 힘들며 DOM 구조가 바뀌는 경우 작동하지 않을 수 있습니다.

또 다른 해결책은 **`ref` 어트리뷰트에 함수를 전달하는 것**입니다. 이것을 "ref 콜백"이라고 합니다. React는 ref를 설정할 때 DOM 노드와 함께 ref 콜백을 호출하며, ref를 지울 때에는 null을 전달합니다. 이를 통해 자체 배열이나 [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)을 유지하고, 인덱스나 특정 ID를 사용하여 어떤 ref에든 접근할 수 있습니다. 

아래 예시는 긴 목록에서 특정 노드에 스크롤 하기 위해 앞에서 말한 접근법을 사용합니다.

<Sandpack>

```js
import { useRef } from 'react';

export default function CatFriends() {
  const itemsRef = useRef(null);

  function scrollToId(itemId) {
    const map = getMap();
    const node = map.get(itemId);
    node.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function getMap() {
    if (!itemsRef.current) {
      // 처음 사용하는 경우, Map을 초기화합니다.
      itemsRef.current = new Map();
    }
    return itemsRef.current;
  }

  return (
    <>
      <nav>
        <button onClick={() => scrollToId(0)}>
          Tom
        </button>
        <button onClick={() => scrollToId(5)}>
          Maru
        </button>
        <button onClick={() => scrollToId(9)}>
          Jellylorum
        </button>
      </nav>
      <div>
        <ul>
          {catList.map(cat => (
            <li
              key={cat.id}
              ref={(node) => {
                const map = getMap();
                if (node) {
                  map.set(cat.id, node);
                } else {
                  map.delete(cat.id);
                }
              }}
            >
              <img
                src={cat.imageUrl}
                alt={'Cat #' + cat.id}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const catList = [];
for (let i = 0; i < 10; i++) {
  catList.push({
    id: i,
    imageUrl: 'https://placekitten.com/250/200?image=' + i
  });
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

이 예시에서 `itemsRef`는 하나의 DOM 노드를 가지고 있지 않습니다. 대신에 식별자와 DOM 노드로 연결된 [Map](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)을 가지고 있습니다. ([Ref는 어떤 값이든 가질 수 있습니다!](/learn/referencing-values-with-refs)) 모든 리스트 아이템에 있는 [`ref` 콜백](/reference/react-dom/components/common#ref-callback)은 Map 변경을 처리합니다.

```js
<li
  key={cat.id}
  ref={node => {
    const map = getMap();
    if (node) {
      // Map에 노드를 추가합니다
      map.set(cat.id, node);
    } else {
      // Map에서 노드를 제거합니다
      map.delete(cat.id);
    }
  }}
>
```

위 방법으로 이후 Map에서 개별적인 DOM 노드를 읽을 수 있습니다.

</DeepDive>

## 다른 컴포넌트의 DOM 노드 접근하기 {/*accessing-another-components-dom-nodes*/}

`<input />`같은 브라우저 요소를 출력하는 내장 컴포넌트에 ref를 주입할 때 React는 ref의 `current` 프로퍼티를 그에 해당하는 (브라우저의 실제 `<input />` 같은) DOM 노드로 설정합니다.

하지만 `<MyInput />` 같이 **직접 만든** 컴포넌트에 ref를 주입할 때는 `null`이 기본적으로 주어집니다. 여기 앞서 말한 내용을 설명하는 예시가 있습니다. 버튼을 클릭할 때 input 요소에 포커스 **되지 않는 것을** 주목하세요.

<Sandpack>

```js
import { useRef } from 'react';

function MyInput(props) {
  return <input {...props} />;
}

export default function MyForm() {
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

문제를 인지할 수 있도록, React는 콘솔에 오류 메시지를 출력합니다.

<ConsoleBlock level="error">

Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?

</ConsoleBlock>

React는 기본적으로 다른 컴포넌트의 DOM 노드에 접근하는 것을 허용하지 않습니다. 컴포넌트의 자식도 예외는 아닙니다! 이것은 의도적인 설계입니다. Ref는 자제해서 사용해야 하는 탈출구입니다. 직접 다른 컴포넌트의 DOM 노드를 조작하는 것은 코드가 쉽게 깨지게 만듭니다.

대신 특정 컴포넌트에서 소유한 DOM 노드를 선택적으로 노출할 수 있습니다. 컴포넌트는 자식 중 하나에 ref를 "전달"하도록 지정할 수 있습니다. 여기 `MyInput`이 어떻게 `forwardRef` API를 사용할 수 있는지 살펴보세요.

```js
const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});
```

작동하는 원리는 다음과 같습니다.

1. `<MyInput ref={inputRef} />`으로 React가 대응되는 DOM 노드를 `inputRef.current`에 대입하도록 설정합니다. 하지만 이것은 전적으로 `MyInput` 컴포넌트의 선택에 달려 있습니다, 기본적으로는 이렇게 동작하지 않습니다.
2. `MyInput` 컴포넌트는 `forwardRef`를 통해 선언되었습니다. 이것은 `props` 다음에 선언된 **두 번째 `ref` 인수를 통해 상위의 `inputRef`를 받을 수 있도록 합니다.**
3. `MyInput`은 자체적으로 수신받은 `ref`를 컴포넌트 내부의 `<input>`으로 전달합니다.

이제 버튼을 클릭하면 input 요소로 포커스가 잘 이동합니다.

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

이 패턴은 디자인 시스템에서 버튼, 입력 요소 등의 저수준 컴포넌트에서 DOM 노드를 전달하기 위해 매우 흔하게 사용됩니다. 반면 폼, 목록 혹은 페이지 섹션 등의 고수준 컴포넌트에서는 의도하지 않은 DOM 구조 의존성 문제를 피하고자 일반적으로 DOM 노드를 노출하지 않습니다.

<DeepDive>

#### 명령형 처리방식으로 하위 API 노출하기 {/*exposing-a-subset-of-the-api-with-an-imperative-handle*/}

위 예시에서 `MyInput` 컴포넌트는 DOM 입력 요소를 그대로 노출했습니다. 그리고 부모 컴포넌트에서 DOM 노드의 `focus()`를 호출할 수 있게 되었습니다. 하지만 이에 따라 부모 컴포넌트에서 DOM 노드의 CSS 스타일을 직접 변경하는 등의 예상치 못 한 작업을 할 수 있습니다. 몇몇 상황에서는 노출된 기능을 제한하고 싶을 수 있는데, 이 때  `useImperativeHandle`을 사용합니다.

<Sandpack>

```js
import {
  forwardRef,
  useRef,
  useImperativeHandle
} from 'react';

const MyInput = forwardRef((props, ref) => {
  const realInputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    // 오직 focus만 노출합니다.
    focus() {
      realInputRef.current.focus();
    },
  }));
  return <input {...props} ref={realInputRef} />;
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

여기 `MyInput` 내부의 `realInputRef`는 실제 input DOM 노드를 가지고 있습니다. 하지만 `useImperativeHandle`을 사용하여 React가 ref를 참조하는 부모 컴포넌트에 직접 구성한 객체를 전달하도록 지시합니다. 따라서 `Form` 컴포넌트 안쪽의 `inputRef.current`는 `foucs` 메서드만 가지고 있습니다. 이 경우 ref는 DOM 노드가 아니라 `useImperativeHandle` 호출에서 직접 구성한 객체가 됩니다.

</DeepDive>

## React가 ref를 부여할 때 {/*when-react-attaches-the-refs*/}

React의 모든 갱신은 [두 단계](/learn/render-and-commit#step-3-react-commits-changes-to-the-dom)로 나눌 수 있습니다.

* **렌더링** 단계에서 React는 화면에 무엇을 그려야 하는지 알아내도록 컴포넌트를 호출합니다.
* **커밋** 단계에서 React는 변경사항을 DOM에 적용합니다.

일반적으로 렌더링하는 중 ref에 접근하는 것을 [원하지 않습니다](/learn/referencing-values-with-refs#best-practices-for-refs). DOM 노드를 보유하는 ref도 마찬가지입니다. 첫 렌더링에서 DOM 노드는 아직 생성되지 않아서 `ref.current`는 `null`인 상태입니다. 그리고 갱신에 의한 렌더링에서 DOM 노드는 아직 업데이트되지 않은 상태입니다. 두 상황 모두 ref를 읽기에 너무 이른 상황입니다.

React는 `ref.current`를 커밋 단계에서 설정합니다. DOM을 변경하기 전에 React는 관련된 `ref.current` 값을 미리 `null`로 설정합니다. 그리고 DOM을 변경한 후 React는 즉시 대응하는 DOM 노드로 다시 설정합니다.

**대부분 `ref` 접근은 이벤트 핸들러 안에서 일어납니다.** ref를 사용하여 뭔가를 하고 싶지만, 그것을 시행할 특정 이벤트가 없을 때 effect가 필요할 수 있습니다. effect에 대해서 다음 페이지에서 이야기해 보겠습니다.

<DeepDive>

#### flushSync로 state 변경을 동적으로 플러시하기 {/*flushing-state-updates-synchronously-with-flush-sync*/}

새로운 할 일을 추가하고 할 일 목록의 마지막으로 화면 스크롤을 내리는 아래 코드를 봅시다. 어떤 이유에 의해 마지막으로 추가된 할 일의 직전으로 항상 스크롤 되는 것을 관찰하세요.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function TodoList() {
  const listRef = useRef(null);
  const [text, setText] = useState('');
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAdd() {
    const newTodo = { id: nextId++, text: text };
    setText('');
    setTodos([ ...todos, newTodo]);
    listRef.current.lastChild.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }

  return (
    <>
      <button onClick={handleAdd}>
        Add
      </button>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <ul ref={listRef}>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}

let nextId = 0;
let initialTodos = [];
for (let i = 0; i < 20; i++) {
  initialTodos.push({
    id: nextId++,
    text: 'Todo #' + (i + 1)
  });
}
```

</Sandpack>

문제는 다음 두 줄에 있습니다.

```js
setTodos([ ...todos, newTodo]);
listRef.current.lastChild.scrollIntoView();
```

React에서 [state 갱신은 큐에 쌓여 비동기적으로 처리됩니다](/learn/queueing-a-series-of-state-updates). 이렇게 동작하는 것은 일반적으로 기대하는 방향입니다. 하지만 여기에선 `setTodos`가 DOM을 바로 업데이트하지 않기 때문에 문제가 발생합니다. 그래서 할 일 목록의 마지막 노드로 스크롤 할 때, DOM에 아직 새로운 할 일이 추가되지 않은 상태입니다. 위 예시에서 스크롤이 계속 한 항목에 뒤처지는 이유입니다.

이 문제를 고치기 위해 React가 DOM 변경을 동기적으로 수행하도록 할 수 있습니다. 이를 위해 `react-dom` 패키지의 `flushSync`를 가져오고 state 업데이트를 `flushSync` 호출로 감싸면 됩니다.

```js
flushSync(() => {
  setTodos([ ...todos, newTodo]);
});
listRef.current.lastChild.scrollIntoView();
```

위의 내용은 `flushSync`로 감싼 코드가 실행된 직후 React가 동기적으로 DOM을 변경하도록 지시합니다. 결과적으로 마지막 할 일은 스크롤 하기 전에 항상 DOM에 추가되어 있을 것입니다.

<Sandpack>

```js
import { useState, useRef } from 'react';
import { flushSync } from 'react-dom';

export default function TodoList() {
  const listRef = useRef(null);
  const [text, setText] = useState('');
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAdd() {
    const newTodo = { id: nextId++, text: text };
    flushSync(() => {
      setText('');
      setTodos([ ...todos, newTodo]);
    });
    listRef.current.lastChild.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }

  return (
    <>
      <button onClick={handleAdd}>
        Add
      </button>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <ul ref={listRef}>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}

let nextId = 0;
let initialTodos = [];
for (let i = 0; i < 20; i++) {
  initialTodos.push({
    id: nextId++,
    text: 'Todo #' + (i + 1)
  });
}
```

</Sandpack>

</DeepDive>

## ref로 DOM을 조작하는 모범 사례 {/*best-practices-for-dom-manipulation-with-refs*/}

Ref는 탈출구입니다. "React에서 벗어나야 할 때"만 사용해야 합니다. 포커스 혹은 스크롤 위치를 관리하거나, React가 노출하지 않는 브라우저 API를 호출하는 등의 작업이 이에 포함됩니다.

포커스 및 스크롤 관리 같은 비 파괴적인 행동을 고수한다면 어떤 문제도 마주치지 않을 것입니다. 하지만 DOM을 직접 수정하는 시도를 한다면 React가 만들어 내는 변경 사항과 충돌을 발생시킬 위험을 감수해야 합니다.

이 문제를 이해하기 위해 이번 예시에서는 환영 문구와 두 버튼을 포함하고 있습니다. 첫 버튼은 일반적인 React [조건부 렌더링](/learn/conditional-rendering)과 [state](/learn/state-a-components-memory)를 사용하여 노드 존재 여부를 토글 합니다. 두 번째 버튼은 [DOM API의 `remove()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/remove)를 사용하여 React의 제어 밖에서 노드를 강제적으로 삭제합니다.

"Toggle with setState"를 몇 차례 눌러보세요. 메시지가 반복적으로 나타나거나 사라질 것입니다. 이후 "Remove from the DOM"을 눌러보세요. 이것은 강제적으로 노드를 삭제합니다. 마지막으로 "Toggle with setState"를 다시 눌러보세요.

<Sandpack>

```js
import {useState, useRef} from 'react';

export default function Counter() {
  const [show, setShow] = useState(true);
  const ref = useRef(null);

  return (
    <div>
      <button
        onClick={() => {
          setShow(!show);
        }}>
        Toggle with setState
      </button>
      <button
        onClick={() => {
          ref.current.remove();
        }}>
        Remove from the DOM
      </button>
      {show && <p ref={ref}>Hello world</p>}
    </div>
  );
}
```

```css
p,
button {
  display: block;
  margin: 10px;
}
```

</Sandpack>

DOM 요소를 직접 삭제한 뒤 `setState`를 사용하여 다시 DOM 노드를 노출하는 것은 충돌을 발생시킵니다. DOM을 직접 변경했을 때 React는 DOM 노드를 올바르게 계속 관리할 방법을 모르기 때문입니다.

**React가 관리하는 DOM 노드를 직접 바꾸려 하지 마세요.** React가 관리하는 DOM 요소에 대한 수정, 자식 추가 혹은 자식 삭제는 비일관적인 시각적 결과 혹은 위 예시처럼 충돌로 이어집니다.

하지만 항상 이것을 할 수 없다는 의미는 아닙니다. 주의 깊게 사용해야 합니다. **안전하게 React가 업데이트할 이유가 없는 DOM 노드 일부를 수정할 수 있습니다.** 예를 들어 몇몇 `<div>`가 항상 빈 채로 JSX에 있다면, React는 해당 노드의 자식 요소를 건드릴 이유가 없습니다. 따라서 빈 노드에서 엘리먼트를 추가하거나 삭제하는 것은 안전합니다.

<Recap>

- Ref는 범용적인 개념이지만 많은 경우 DOM 요소를 참조하기 위해 사용합니다.
- `<div ref={myRef}>`로 React가 myRef.current에 DOM Node를 대입하도록 지시할 수 있습니다.
- 많은 경우 ref는 포커싱, 스크롤링, DOM 요소 크기 혹은 위치 측정 등 비 파괴적인 행동을 위해 사용됩니다.
- 컴포넌트는 기본적으로 DOM 노드를 노출하지 않습니다. `forwardRef`와 두 번째 `ref` 인자를 특정 노드에 전달하는 것으로 선택적으로 노출할 수 있습니다.
- React가 관리하는 DOM 노드를 직접 바꾸려 하지 마세요.
- React가 관리하는 DOM 노드를 수정하려 한다면, React가 변경할 이유가 없는 부분만 수정하세요.

</Recap>

<Challenges>

#### 비디오 재생과 멈춤 {/*play-and-pause-the-video*/}

이 예시에서 버튼은 재생과 멈춤 상태를 토글 합니다. 하지만 실제로 비디오가 재생되거나 멈추기 위해서는 state를 변경하는 것으로 충분하지 않습니다. `<video>` DOM 요소의 [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play)와 [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause)를 호출해야 합니다. ref를 추가하고 버튼이 작동하게 만들어보세요.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <video width="250">
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  )
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

추가적인 도전을 하고자 한다면, 비디오를 마우스 오른쪽 버튼으로 클릭하고 내장된 브라우저 미디어 컨트롤을 사용하여 재생할 때도 "재생" 버튼이 비디오의 재생 여부와 동기화될 수 있도록 하세요. 이를 위해 비디오의 `onPlay`와 `onPause` 이벤트를 청취할 수 있습니다.

<Solution>

ref를 선언하고 `<video>` 요소에 추가해 보세요. 그리고 다음 상태에 종속된 이벤트 핸들러에서 `ref.current.play()`와 `ref.current.pause()`를 호출하세요.

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
  )
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

내장된 브라우저 컨트롤을 처리하기 위해, `<video>` 요소에 `onPlay`와 `onPause` 핸들러를 추가하고 해당 핸들러에서 `setIsPlaying`을 호출할 수 있습니다. 이 방식을 통해 사용자가 브라우저 컨트롤을 사용하여 비디오를 재생할 경우, state가 이에 맞게 조정됩니다.

</Solution>

#### 검색 필드에 포커스하기 {/*focus-the-search-field*/}

"Search" 버튼을 클릭하면 입력 필드에 포커스가 이동하도록 만들어 보세요.

<Sandpack>

```js
export default function Page() {
  return (
    <>
      <nav>
        <button>Search</button>
      </nav>
      <input
        placeholder="Looking for something?"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

input에 ref를 추가하고 `focus()`를 호출하여 포커스를 이동하세요.

<Sandpack>

```js
import { useRef } from 'react';

export default function Page() {
  const inputRef = useRef(null);
  return (
    <>
      <nav>
        <button onClick={() => {
          inputRef.current.focus();
        }}>
          Search
        </button>
      </nav>
      <input
        ref={inputRef}
        placeholder="Looking for something?"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

</Solution>

#### 이미지 캐러셀 스크롤링 {/*scrolling-an-image-carousel*/}

이 이미지 캐러셀은 활성화된 이미지를 전환하는 "Next" 버튼이 있습니다. 클릭할 때 갤러리가 활성화된 이미지로 수평 스크롤 되도록 만들어 봅시다. 활성화된 이미지의 DOM 노드에서 [`scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) 호출이 필요할 수 있습니다.

```js
node.scrollIntoView({
  behavior: 'smooth',
  block: 'nearest',
  inline: 'center'
});
```

<Hint>

이 활동을 위해 모든 이미지에 `ref`를 부여할 필요는 없습니다. 현재 활성화된 이미지 혹은 리스트 자체와 연결되는 ref 하나면 충분합니다. `flushSync`를 사용해서 스크롤 하기 전에 DOM이 변경되도록 하세요.

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function CatFriends() {
  const [index, setIndex] = useState(0);
  return (
    <>
      <nav>
        <button onClick={() => {
          if (index < catList.length - 1) {
            setIndex(index + 1);
          } else {
            setIndex(0);
          }
        }}>
          Next
        </button>
      </nav>
      <div>
        <ul>
          {catList.map((cat, i) => (
            <li key={cat.id}>
              <img
                className={
                  index === i ?
                    'active' :
                    ''
                }
                src={cat.imageUrl}
                alt={'Cat #' + cat.id}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const catList = [];
for (let i = 0; i < 10; i++) {
  catList.push({
    id: i,
    imageUrl: 'https://placekitten.com/250/200?image=' + i
  });
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

img {
  padding: 10px;
  margin: -10px;
  transition: background 0.2s linear;
}

.active {
  background: rgba(0, 100, 150, 0.4);
}
```

</Sandpack>

<Solution>

`selectedRef`를 선언하고 조건적으로 현재 활성화된 이미지에 전달할 수 있습니다.

```js
<li ref={index === i ? selectedRef : null}>
```

`index === i` 조건이 만족할 때 이 이미지가 선택된 이미지라는 뜻이고 그 `<li>`은 `selectedRef`를 받을 것입니다. React는 `selectedRef.current`가 현재 선택된 올바른 DOM 노드를 올바르게 가리키도록 합니다.

스크롤 하기 전에 React가 DOM 변경을 끝내기 위해 `flushSync` 호출이 필요하다는 것을 주의하세요. 그렇지 않다면 `selectedRef.current`는 항상 이전에 선택된 아이템을 가리키고 있을 것입니다.

<Sandpack>

```js
import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';

export default function CatFriends() {
  const selectedRef = useRef(null);
  const [index, setIndex] = useState(0);

  return (
    <>
      <nav>
        <button onClick={() => {
          flushSync(() => {
            if (index < catList.length - 1) {
              setIndex(index + 1);
            } else {
              setIndex(0);
            }
          });
          selectedRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
          });
        }}>
          Next
        </button>
      </nav>
      <div>
        <ul>
          {catList.map((cat, i) => (
            <li
              key={cat.id}
              ref={index === i ?
                selectedRef :
                null
              }
            >
              <img
                className={
                  index === i ?
                    'active'
                    : ''
                }
                src={cat.imageUrl}
                alt={'Cat #' + cat.id}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const catList = [];
for (let i = 0; i < 10; i++) {
  catList.push({
    id: i,
    imageUrl: 'https://placekitten.com/250/200?image=' + i
  });
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

img {
  padding: 10px;
  margin: -10px;
  transition: background 0.2s linear;
}

.active {
  background: rgba(0, 100, 150, 0.4);
}
```

</Sandpack>

</Solution>

#### 별개의 컴포넌트에서 검색 필드에 포커스 이동하기 {/*focus-the-search-field-with-separate-components*/}

"Search" 버튼을 클릭하면 포커스가 필드에 놓이도록 해보세요. 각 컴포넌트는 별개의 파일에 정의되어 있고 코드의 위치를 옮겨서는 안 된다는 점을 명심하세요. 별개의 컴포넌트들을 어떻게 연결할 수 있을까요?

<Hint>

`SearchInput`같은 컴포넌트에서 `forwardRef`를 사용해서 DOM 노드를 노출할 필요가 있습니다.

</Hint>

<Sandpack>

```js src/App.js
import SearchButton from './SearchButton.js';
import SearchInput from './SearchInput.js';

export default function Page() {
  return (
    <>
      <nav>
        <SearchButton />
      </nav>
      <SearchInput />
    </>
  );
}
```

```js src/SearchButton.js
export default function SearchButton() {
  return (
    <button>
      Search
    </button>
  );
}
```

```js src/SearchInput.js
export default function SearchInput() {
  return (
    <input
      placeholder="Looking for something?"
    />
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

`SearchButton`에 `onClick` prop을 추가하고 `SearchButton`은 `onClick`을 브라우저의 `<button>`에 전달하도록 만드세요. 또 `<SearchInput>`에 ref를 사용하고 실제 `<input>`이 연결되도록 해야 합니다. 마지막으로 클릭 핸들러에서 ref에 저장된 DOM 노드 내부의 `focus`를 호출하세요.

<Sandpack>

```js src/App.js
import { useRef } from 'react';
import SearchButton from './SearchButton.js';
import SearchInput from './SearchInput.js';

export default function Page() {
  const inputRef = useRef(null);
  return (
    <>
      <nav>
        <SearchButton onClick={() => {
          inputRef.current.focus();
        }} />
      </nav>
      <SearchInput ref={inputRef} />
    </>
  );
}
```

```js src/SearchButton.js
export default function SearchButton({ onClick }) {
  return (
    <button onClick={onClick}>
      Search
    </button>
  );
}
```

```js src/SearchInput.js
import { forwardRef } from 'react';

export default forwardRef(
  function SearchInput(props, ref) {
    return (
      <input
        ref={ref}
        placeholder="Looking for something?"
      />
    );
  }
);
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

</Solution>

</Challenges>