---
title: 'Ref로 DOM 조작하기'
---

<Intro>

React는 렌더링 결과물에 맞춰 [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction) 변경을 처리하기 때문에 컴포넌트에서 자주 DOM을 조작해야 할 필요는 없습니다. 하지만 가끔 특정 노드에 포커스를 옮기거나, 스크롤 위치를 옮기거나, 위치와 크기를 측정하기 위해서 React가 관리하는 DOM 요소에 접근해야 할 때가 있습니다. React는 이런 작업을 수행하는 내장 방법을 제공하지 않기 때문에 DOM 노드에 접근하기 위한 [ref](/learn/referencing-values-with-refs#refs-and-the-dom)가 필요할 것입니다.

</Intro>

<YouWillLearn>

- `ref` 속성으로 React가 관리하는 DOM 노드에 접근하는 법
- `ref` JSX 속성과 `useRef` 훅의 관련성
- 다른 컴포넌트의 DOM 노드에 접근하는 법
- React가 관리하는 DOM을 수정해도 안전한 경우

</YouWillLearn>

## 노드 ref 가져오기 {/*getting-a-ref-to-the-node*/}

React가 관리하는 DOM 노드에 접근하기 위해 `useRef` Hook을 가져옵니다.

```js
import { useRef } from 'react';
```

컴포넌트 안에서 ref를 선언하기 위해 방금 가져온 Hook을 사용합니다.

```js
const myRef = useRef(null);
```

마지막으로 이전에 선언한 ref를 DOM 노드에 ref 속성으로 전달합니다.

```js
<div ref={myRef}>
```

`useRef` Hook은 `current`라는 단일 속성을 가진 객체를 반환합니다. 초기에는 'myRef.current'가 'null'이 됩니다. React가 이 `<div>`에 대한 DOM 노드를 생성할 때, React는 이 노드에 대한 참조를 `myRef.current`에 넣습니다. 그리고 이 DOM 노드를 [이벤트 핸들러](/learn/responding-to-events)에서 접근하거나 노드에 정의된 내장 [브라우저 API](https://developer.mozilla.org/docs/Web/API/Element)를 사용할 수 있습니다.

```js
// 예를 들어 이렇게 브라우저 API를 사용할 수 있습니다
myRef.current.scrollIntoView();
```

### 예시: 텍스트 입력에 포커스 이동하기 {/*example-focusing-a-text-input*/}

이 예시에서, 버튼을 클릭하면 input 요소로 포커스를 이동합니다.

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
2. 선언한 `inputRef`를 `<input ref={inputRef}>`로 전달합니다. 이 행위는 **React에게 이 `<input>`의 DOM 노드를 `inputRef.current`에 넣어줘** 라고 하는 것입니다.
3. `handleClick` 함수에서 `inputRef.current`에서 input DOM 노드를 읽고 `inputRef.current.focus()`로 [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus)를 호출합니다.
4. `<button>`과 `onClick`으로 `handleClick` 이벤트 핸들러를 전달합니다.

DOM 조작이 ref를 사용하는 가장 일반적인 사용처지만, `useRef` Hook은 setTimeout Timer ID 같은 React 외부 요소를 저장하는 용도로도 사용할 수 있습니다. 상태(state)와 비슷하게 ref는 렌더링 사이에도 유지됩니다. ref를 설정하더라도 컴포넌트의 렌더링을 다시 유발하지 않는 상태 변수로 생각해도 괜찮습니다! [Ref와 값 참조](/learn/referencing-values-with-refs)에서 ref에 대해 자세히 배울 수 있습니다.

### 예시: 한 요소로 스크롤을 이동하기 {/*example-scrolling-to-an-element*/}

한 컴포넌트에서 하나 이상의 ref를 가질 수 있습니다. 이 예시에서는, 상응하는 이미지 DOM 노드로 화면 중앙 정렬하기 위해 [`scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) 메서드를 호출하는 버튼 세 개와 이미지 세 개가 있는 캐로셀이 있습니다.

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

<DeepDive title="ref 콜백을 사용하여 ref 리스트 관리하기">

위 예시에서는 미리 정의된 숫자의 ref가 있었습니다. 하지만 때때로 목록의 아이템마다 ref가 필요할 수도 있고, 얼마나 많은 ref가 필요할지 예측할 수 없는 경우도 있습니다. 그럴 때 아래 코드는 **작동하지 않습니다**.

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

**`ref` 속성에 함수를 넘기는 것**이 해결책입니다. React는 ref를 주입할 때 DOM node와 함께 ref 콜백을 호출합니다. 그리고 청소해야 할 때(clear 혹은 unmount)는 null과 함께 호출합니다. 이를 응용하여 배열 혹은 [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)으로 관리하고 어떤 배열의 순서나 특정할 수 있는 식별자를 이용하여 어떤 ref에도 접근할 수 있습니다.

아래 예시는 긴 목록에서 특정 노드에 스크롤하기 위해 앞에서 말한 접근법을 사용합니다.

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
      // Map을 사용하기 위해 처음에 초기화합니다.
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

이 예시에서 `itemsRef`는 DOM 노드 하나를 가지고 있지 않습니다. 대신에 식별자와 DOM 노드 키맵으로 연결된 [Map](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)을 가지고 있습니다. ([Ref는 아무 값이나 가질 수 있습니다!](/learn/referencing-values-with-refs)) 모든 리스트 아이템에 있는 `ref` 콜백은 Map 변경을 처리합니다.

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

`<input />`같은 브라우저 요소를 출력하는 내장 컴포넌트에 ref를 주입할 때 React는 ref의 `current` 프로퍼티를 그에 해당하는 DOM 노드(브라우저의 실제 `<input />` 같은)로 설정합니다.

하지만 `<MyInput />` 같은 **직접 만든** 컴포넌트에 ref를 주입할 때는 `null`이 기본적으로 주어집니다. 여기 예시가 있습니다. 버튼을 클릭할 때 인풋 요소에 포커스 **되지 않는것을** 주목하세요.

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

버튼을 클릭하면 콘솔에 에러메세지가 출력될 것입니다.

> Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?

React는 기본적으로 다른 컴포넌트의 DOM 노드에 접근하는 것을 허용하지 않습니다. 컴포넌트의 자식도 예외는 아닙니다! 이것은 의도적인 설계입니다. Ref는 신중하게 혹은 자제해서 사용해야 하는 탈출구입니다. 직접 다른 컴포넌트의 DOM 노드를 조작하는 것은 코드가 쉽게 깨지게 만듭니다.

대신 특정 컴포넌트에서 소유한 DOM 노드를 선택적으로 노출시킬 수 있습니다. 컴포넌트는 자식 중 하나를 "전달"하도록 지정할 수 있습니다. 여기 `MyInput`이 어떻게 `forwardRef` API를 사용할 수 있는지 살펴보세요.

```js
const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});
```

작동하는 원리는 다음과 같습니다.

1. `<MyInput ref={inputRef} />`으로 React가 대응되는 DOM 노드를 `inputRef.current`에 대입하도록 설정합니다. 하지만 이것은 전적으로 `MyInput` 컴포넌트의 선택에 달려 있습니다, 기본적으로는 이렇게 동작하지 않습니다.
2. `MyInput` 컴포넌트는 `forwardRef`를 통해 선언되었습니다. 이것은 `props` 다음에 선언된 **두 번째 `ref` 인수로 위에서 `inputRef`를 수신하도록 선택합니다.**
3. `MyInput`은 자체적으로 수신받은 `ref`를 컴포넌트 내부의 `<input>`으로 전달합니다.

이제 버튼을 클릭하면 입력요소로 포커스가 잘 이동합니다.

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

이 패턴은 디자인시스템에서 버튼, 입력요소 등 저수준 컴포넌트에서 DOM 노드를 전달하기 위해 매우 흔하게 사용됩니다. 한편으로는 폼, 목록 혹은 페이지 섹션 등 고수준 컴포넌트에서는 의도하지 않은 DOM 구조 의존성 문제를 피하고자 일반적으로 DOM 노드를 노출하지 않습니다.

<DeepDive title="명령형 처리방식으로 하위 API 노출하기">

위 예시에서 `MyInput` 컴포넌트는 DOM 입력 요소를 그대로 노출했습니다. 그리고 부모 컴포넌트에서 DOM 노드의 `focus()`를 호출할 수 있게 되었습니다. 하지만 이로 인해 부모 컴포넌트에서 DOM 노드의 CSS 스타일을 직접 변경하는 등의 예상 못 한 작업을 할 수 있습니다. 몇몇 상황에서는 제한적인 기능만 노출하고 싶을 수 있습니다. `useImperativeHandle`을 사용하여 그렇게 할 수 있습니다.

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
    // Only expose focus and nothing else
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

여기 `MyInput` 안쪽 `realInputRef`은 실제 DOM 노드를 가지고 있습니다. 하지만 `useImperativeHandle`로 React가 ref를 참조하는 부모 컴포넌트에 직접 구성한 객체를 전달하도록 지시합니다. 따라서 `Form` 컴포넌트 안쪽의 `inputRef.current`은 `foucs` 메서드만 가지고 있습니다. 이 경우, ref는 DOM 노드가 아니라 `useImperativeHandle` 호출에서 직접 구성한 객체가 됩니다.

</DeepDive>

## When React attaches the refs {/*when-react-attaches-the-refs*/}

In React, every update is split in [two phases](/learn/render-and-commit#step-3-react-commits-changes-to-the-dom)

* During **render,** React calls your components to figure out what should be on the screen.
* During **commit,** React applies changes to the DOM.

In general, you [don't want](/learn/referencing-values-with-refs#best-practices-for-refs) to access refs during rendering. That goes for refs holding DOM nodes as well. During the first render, the DOM nodes have not yet been created, so `ref.current` will be `null`. And during the rendering of updates, the DOM nodes haven't been updated yet. So it's too early to read them.

React sets `ref.current` during the commit. Before updating the DOM, React sets the affected `ref.current` values to `null`. After updating the DOM, React immediately sets them to the corresponding DOM nodes.

**Usually, you will access refs from event handlers.** If you want to do something with a ref, but there is no particular event to do it in, you might need an effect. We will discuss effects on the next pages.

<DeepDive title="Flushing state updates synchronously with flushSync">

Consider code like this, which adds a new todo and scrolls the screen down to the last child of the list. Notice how, for some reason, it always scrolls to the todo that was *just before* the last added one

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

The issue is with these two lines

```js
setTodos([ ...todos, newTodo]);
listRef.current.lastChild.scrollIntoView();
```

In React, [state updates are queued](/learn/queueing-a-series-of-state-updates). Usually, this is what you want. However, here it causes a problem because `setTodos` does not immediately update the DOM. So the time you scroll the list to its last element, the todo has not yet been added. This is why scrolling always "lags behind" by one item.

To fix this issue, you can force React to update ("flush") the DOM synchronously. To do this, import `flushSync` from `react-dom` and **wrap the state update** into a `flushSync` call

```js
flushSync(() => {
  setTodos([ ...todos, newTodo]);
});
listRef.current.lastChild.scrollIntoView();
```

This will instruct React to update the DOM synchronously right after the code wrapped in `flushSync` executes. As a result, the last todo will already be in the DOM by the time you try to scroll to it

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

## Best practices for DOM manipulation with refs {/*best-practices-for-dom-manipulation-with-refs*/}

Refs are an escape hatch. You should only use them when you have to "step outside React." Common examples of this include managing focus, scroll position, or calling browser APIs that React does not expose.

If you stick to non-destructive actions like focusing and scrolling, you shouldn't encounter any problems. However, if you try to **modify** the DOM manually, you can risk conflicting with the changes React is making.

To illustrate this problem, this example includes a welcome message and two buttons. The first button toggles its presence using [conditional rendering](/learn/conditional-rendering) and [state](/learn/state-a-components-memory), as you would usually do in React. The second button uses the [`remove()` DOM API](https://developer.mozilla.org/en-US/docs/Web/API/Element/remove) to forcefully remove it from the DOM outside of React's control.

Try pressing "Toggle with setState" a few times. The message should disappear and appear again. Then press "Remove from the DOM". This will forcefully remove it. Finally, press "Toggle with setState"

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

After you've manually removed the DOM element, trying to use `setState` to show it again will lead to a crash. This is because you've changed the DOM, and React doesn't know how to continue managing it correctly.

**Avoid changing DOM nodes managed by React.** Modifying, adding children to, or removing children from elements that are managed by React can lead to inconsistent visual results or crashes like above.

However, this doesn't mean that you can't do it at all. It requires caution. **You can safely modify parts of the DOM that React has _no reason_ to update.** For example, if some `<div>` is always empty in the JSX, React won't have a reason to touch its children list. Therefore, it is safe to manually add or remove elements there.

<Recap>

- Refs are a generic concept, but most often you'll use them to hold DOM elements.
- You instruct React to put a DOM node into `myRef.current` by passing `<div ref={myRef}>`.
- Usually, you will use refs for non-destructive actions like focusing, scrolling, or measuring DOM elements.
- A component doesn't expose its DOM nodes by default. You can opt into exposing a DOM node by using `forwardRef` and passing the second `ref` argument down to a specific node.
- Avoid changing DOM nodes managed by React.
- If you do modify DOM nodes managed by React, modify parts that React has no reason to update.

</Recap>



<Challenges>

### Play and pause the video {/*play-and-pause-the-video*/}

In this example, the button toggles a state variable to switch between a playing and a paused state. However, in order to actually play or pause the video, toggling state is not enough. You also need to call [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) and [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) on the DOM element for the `<video>`. Add a ref to it, and make the button work.

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
      <video width="250">
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
      <button onClick={handleClick}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
    </>
  )
}
```

```css
button { display: block }
```

</Sandpack>

<Solution>

Declare a ref and put it on the `<video>` element. Then call `ref.current.play()` and `ref.current.pause()` in the event handler depending on the next state.

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
      <video width="250" ref={ref}>
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
      <button onClick={handleClick}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
    </>
  )
}
```

```css
button { display: block }
```

</Sandpack>

</Solution>

### Focus the search field {/*focus-the-search-field*/}

Make it so that clicking the "Search" button puts focus into the field.

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

Add a ref to the input, and call `focus()` on the DOM node to focus it

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

### Scrolling an image carousel {/*scrolling-an-image-carousel*/}

This image carousel has a "Next" button that switches the active image. Make the gallery scroll horizontally to the active image on click. You will want to call [`scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) on the DOM node of the active image

```js
node.scrollIntoView({
  behavior: 'smooth',
  block: 'nearest',
  inline: 'center'
});
```

<Hint>

You don't need to have a ref to every image for this exercise. It should be enough to have a ref to the currently active image, or to the list itself. Use `flushSync` to ensure the DOM is updated *before* you scroll.

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

You can declare a `selectedRef`, and then pass it conditionally only to the current image

```js
<li ref={index === i ? selectedRef : null}>
```

When `index === i`, meaning that the image is the selected one, the `<li>` will receive the `selectedRef`. React will make sure that `selectedRef.current` always points at the correct DOM node.

Note that the `flushSync` call is necessary to force React to update the DOM before the scroll. Otherwise, `selectedRef.current` would always point at the previously selected item.

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

### Focus the search field with separate components {/*focus-the-search-field-with-separate-components*/}

Make it so that clicking the "Search" button puts focus into the field. Note that each component is defined in a separate file and shouldn't be moved out of it. How do you connect them together?

<Hint>

You'll need `forwardRef` to opt into exposing a DOM node from your own component like `SearchInput`.

</Hint>

<Sandpack>

```js App.js
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

```js SearchButton.js
export default function SearchButton() {
  return (
    <button>
      Search
    </button>
  );
}
```

```js SearchInput.js
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

You'll need to add an `onClick` prop to the `SearchButton`, and make the `SearchButton` pass it down to the browser `<button>`. You'll also pass a ref down to `<SearchInput>`, which will forward it to the real `<input>` and populate it. Finally, in the click handler, you'll call `focus` on the DOM node stored inside that ref.

<Sandpack>

```js App.js
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

```js SearchButton.js
export default function SearchButton({ onClick }) {
  return (
    <button onClick={onClick}>
      Search
    </button>
  );
}
```

```js SearchInput.js
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