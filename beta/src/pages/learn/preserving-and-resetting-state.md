---
title: State를 보존하고 초기화하기
---

<Intro>

각 컴포넌트는 독립된 state를 가집니다. React는 UI 트리에서의 위치를 통해 각 state가 어떤 컴포넌트에 속하는지 추적합니다. 리렌더링마다 언제 state를 보존하고 또 state를 초기화할지 컨트롤할 수 있습니다.

</Intro>

<YouWillLearn>

* React가 컴포넌트 구조를 어떻게 "보는지"
* React가 언제 state를 보존하고 언제 초기화하는지
* 어떻게 React가 state를 초기화하도록 강제할 수 있는지
* key와 타입이 state 보존에 어떻게 영향을 주는지

</YouWillLearn>

## UI 트리 {/*the-ui-tree*/}

브라우저는 UI를 모델링할 때 여러 트리 구조를 사용합니다. [DOM](https://developer.mozilla.org/ko/docs/Web/API/Document_Object_Model/Introduction)은 HTML 엘리먼트를 나타내고, [CSSOM](https://developer.mozilla.org/ko/docs/Web/API/CSS_Object_Model)은 CSS를 나타냅니다. 또 [접근성 트리](https://developer.mozilla.org/docs/Glossary/Accessibility_tree)라는 것도 있습니다!

또한 React는 당신이 만드는 UI를 관리하고 모델링하기 위한 트리 구조도 가지고 있습니다. React는 JSX로부터 **UI 트리**를 만듭니다. 그리고 React DOM은 UI 트리와 일치하도록 브라우저 DOM을 업데이트합니다. (React Native는 이 트리를 각 모바일 플랫폼에 맞는 엘리먼트로 번역합니다.)

<<<<<<< HEAD
<img alt="React는 컴포넌트를 가지고 UI 트리 구조로 바꿉니다. 그리고 ReactDOM은 이것을 DOM을 이용해 브라우저에서 HTML로 바꿉니다." src="/images/docs/sketches/s_react-dom-tree.png" />
=======
<DiagramGroup>

<Diagram name="preserving_state_dom_tree" height={193} width={864} alt="Diagram with three sections arranged horizontally. In the first section, there are three rectangles stacked vertically, with labels 'Component A', 'Component B', and 'Component C'. Transitioning to the next pane is an arrow with the React logo on top labeled 'React'. The middle section contains a tree of components, with the root labeled 'A' and two children labeled 'B' and 'C'. The next section is again transitioned using an arrow with the React logo on top labeled 'React'. The third and final section is a wireframe of a browser, containing a tree of 8 nodes, which has only a subset highlighted (indicating the subtree from the middle section).">

From components, React creates a UI tree which React DOM uses to render the DOM

</Diagram>

</DiagramGroup>
>>>>>>> 951fae39f0e12dc061f1564d02b2f4707c0541c4

## State는 트리에서의 위치에 묶여있습니다 {/*state-is-tied-to-a-position-in-the-tree*/}

컴포넌트에 state를 줄 때 state가 컴포넌트 안에 "살고" 있다고 생각할 수도 있습니다. 하지만 사실 state는 React 안에 있습니다. React는 컴포넌트가 UI 트리에 있는 위치를 이용해 React가 가지고 있는 각 state를 알맞은 컴포넌트와 연결합니다.


여기 동일한 `<Counter />` JSX 태그가 다른 두 군데에서 렌더링되고 있습니다.

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const counter = <Counter />;
  return (
    <div>
      {counter}
      {counter}
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

<<<<<<< HEAD
이것이 다음과 같이 트리도 바뀝니다.

<img alt="JSX가 트리가 된다." src="/images/docs/sketches/s_jsx-to-tree.png" />
=======
Here's how these look as a tree:    

<DiagramGroup>

<Diagram name="preserving_state_tree" height={248} width={395} alt="Diagram of a tree of React components. The root node is labeled 'div' and has two children. Each of the children are labeled 'Counter' and both contain a state bubble labeled 'count' with value 0.">

React tree

</Diagram>

</DiagramGroup>
>>>>>>> 951fae39f0e12dc061f1564d02b2f4707c0541c4

**이 둘은 각각 트리에서 자기 고유의 위치에 렌더링되어 있으므로 분리되어있는 카운터입니다.** 일반적으로 React를 사용할 때 위치에 대해 생각할 필요는 없지만 React가 어떻게 작동하는지 이해할 때 유용합니다.

React에서 화면의 각 컴포넌트는 완전히 분리된 state를 가집니다. 예를 들어, 두 `Counter` 컴포넌트를 나란히 렌더링하면 그들은 각각 자신만의 독립된 `score`과 `hover` state를 가지게 됩니다.

두 카운터를 클릭해보고 서로 영향을 끼치지 않는 것을 확인해보세요.

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  return (
    <div>
      <Counter />
      <Counter />
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

<<<<<<< HEAD
React는 같은 컴포넌트를 같은 위치에 렌더링하는 동안만 state를 유지합니다. 이것을 확인하기 위해 두 카운터를 증가시킨 후 "Render the second counter" 체크 박스를 해제하고 다시 선택해보세요.
=======
As you can see, when one counter is updated, only the state for that component is updated:


<DiagramGroup>

<Diagram name="preserving_state_increment" height={248} width={441} alt="Diagram of a tree of React components. The root node is labeled 'div' and has two children. The left child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0. The right child is labeled 'Counter' and contains a state bubble labeled 'count' with value 1. The state bubble of the right child is highlighted in yellow to indicate its value has updated.">

Updating state

</Diagram>

</DiagramGroup>


React will keep the state around for as long as you render the same component at the same position. To see this, increment both counters, then remove the second component by unchecking "Render the second counter" checkbox, and then add it back by ticking it again:
>>>>>>> 951fae39f0e12dc061f1564d02b2f4707c0541c4

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [showB, setShowB] = useState(true);
  return (
    <div>
      <Counter />
      {showB && <Counter />} 
      <label>
        <input
          type="checkbox"
          checked={showB}
          onChange={e => {
            setShowB(e.target.checked)
          }}
        />
        Render the second counter
      </label>
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

두 번째 카운터를 렌더링하지 않을 때 그 state가 완전히 사라지는 것을 확인해보세요. 이는 React가 컴포넌트를 제거할 때 그 state도 같이 제거하기 때문입니다.

<<<<<<< HEAD
<img alt="React가 컴포넌트를 트리에서 지울 때 state도 함께 제거합니다" src="/images/docs/sketches/s_remove-ui.png" />
=======
<DiagramGroup>

<Diagram name="preserving_state_remove_component" height={253} width={422} alt="Diagram of a tree of React components. The root node is labeled 'div' and has two children. The left child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0. The right child is missing, and in its place is a yellow 'poof' image, highlighting the component being deleted from the tree.">

Deleting a component

</Diagram>

</DiagramGroup>
>>>>>>> 951fae39f0e12dc061f1564d02b2f4707c0541c4

"Render the second counter"를 누를 때 두 번째 `Counter`와 그 state는 처음부터 초기화되고(`score = 0`) DOM에 추가됩니다.

<<<<<<< HEAD
<img alt="React가 UI를 DOM 트리에 추가할 때 모든 state를 새로 시작합니다." src="/images/docs/sketches/s_add-back-ui.png" />
=======
<DiagramGroup>

<Diagram name="preserving_state_add_component" height={258} width={500} alt="Diagram of a tree of React components. The root node is labeled 'div' and has two children. The left child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0. The right child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0. The entire right child node is highlighted in yellow, indicating that it was just added to the tree.">

Adding a component

</Diagram>

</DiagramGroup>
>>>>>>> 951fae39f0e12dc061f1564d02b2f4707c0541c4

**React는 컴포넌트가 UI 트리에서 그 자리에 렌더링되는 한 state를 유지합니다.** 만약 그것을 제거하거나 같은 자리에 다른 컴포넌트가 렌더링되면 React는 그 state를 버립니다.

## 같은 자리의 같은 컴포넌트는 state를 보존합니다 {/*same-component-at-the-same-position-preserves-state*/}

다음 예시에는 서로 다른 두 `<Counter />` 태그가 있습니다.

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <Counter isFancy={true} /> 
      ) : (
        <Counter isFancy={false} /> 
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

체크 박스를 선택하거나 선택 해제할 때 카운터 state는 초기화되지 않습니다. `isFancy`가 `true`이든 `false`이든 `<Counter />`는 값은 자리에 있습니다. root `App` 컴포넌트가 반환한 `div`의 첫 번째 자식으로 있죠.

<<<<<<< HEAD
<img alt="React는 렌더링할 때 컴포넌트와 UI 트리에서의 위치만 봅니다." src="/images/docs/sketches/s_ui-swap.png" />
=======
<DiagramGroup>

<Diagram name="preserving_state_same_component" height={461} width={600} alt="Diagram with two sections separated by an arrow transitioning between them. Each section contains a layout of components with a parent labeled 'App' containing a state bubble labeled isFancy. This component has one child labeled 'div', which leads to a prop bubble containing isFancy (highlighted in purple) passed down to the only child. The last child is labeled 'Counter' and contains a state bubble with label 'count' and value 3 in both diagrams. In the left section of the diagram, nothing is highlighted and the isFancy parent state value is false. In the right section of the diagram, the isFancy parent state value has changed to true and it is highlighted in yellow, and so is the props bubble below, which has also changed its isFancy value to true.">

Updating the `App` state does not reset the `Counter` because `Counter` stays in the same position

</Diagram>

</DiagramGroup>
>>>>>>> 951fae39f0e12dc061f1564d02b2f4707c0541c4


첫 번째 자리의 같은 컴포넌트이기 때문에 React의 관점에서는 같은 카운터입니다.

<<<<<<< HEAD
<Illustration src="/images/docs/illustrations/i_react-is-blind-to-ui-swap.png" alt="React가 두 컴포넌트를 저울질하고 있고 서로 다른 색이지만 같은 것으로 봅니다." />

=======
>>>>>>> 951fae39f0e12dc061f1564d02b2f4707c0541c4
<Gotcha>

**React는 JSX 마크업에서가 아닌 UI 트리에서의 위치에 관심이 있다는 것을** 기억하세요! 이 컴포넌트는 `if` 안과 밖에 다른 `<Counter />`를 가진 `return` 문을 두 개 가지고 있습니다.

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  if (isFancy) {
    return (
      <div>
        <Counter isFancy={true} />
        <label>
          <input
            type="checkbox"
            checked={isFancy}
            onChange={e => {
              setIsFancy(e.target.checked)
            }}
          />
          Use fancy styling
        </label>
      </div>
    );
  }
  return (
    <div>
      <Counter isFancy={false} />
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

체크 박스를 선택할 때 state가 초기화될 거라고 생각했을 수도 있지만 그렇지 않습니다! **두 `<Counter />` 태그가 같은 위치에 렌더링되기** 때문이죠. React는 함수 안 어디에 조건문이 있는지 모릅니다. React는 당신이 반환하는 트리만 "봅니다". 두 상황에서 `App` 컴포넌트는 `<Counter />`를 첫 번째 자식으로 가진 `<div>`를 반환합니다. 이것이 React가 두 `<Counter />`를 _같은_ 것으로 보는 이유입니다.

그들이 같은 "주소"를 갖는다고 생각할 수도 있습니다. root의 첫 번째 자식의 첫 번째 자식으로요. 이것이 당신이 어떻게 로직을 만들었는지와 상관없이 React가 이전과 다음 렌더링 사이에 컴포넌트를 맞추는 방법입니다.

</Gotcha>

## 같은 위치의 다른 컴포넌트는 state를 초기화합니다 {/*different-components-at-the-same-position-reset-state*/}

다음 예시에서 체크 박스를 선택하면 `<Counter>`가 `<p>`로 교체됩니다.

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isPaused, setIsPaused] = useState(false);
  return (
    <div>
      {isPaused ? (
        <p>See you later!</p> 
      ) : (
        <Counter /> 
      )}
      <label>
        <input
          type="checkbox"
          checked={isPaused}
          onChange={e => {
            setIsPaused(e.target.checked)
          }}
        />
        Take a break
      </label>
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

여기서 당신은 같은 자리의 _다른_ 컴포넌트 타입으로 바꿉니다. 처음에는 `<div>`가 `Counter`를 갖고 있습니다. 하지만 `p`로 바꾸면 React는 UI 트리에서 `Counter`와 그 state를 제거합니다.

<<<<<<< HEAD
<img alt="UI 트리에서 컴포넌트와 state를 제거하기" src="/images/docs/sketches/s_ui-component-swap.png" />
=======
<DiagramGroup>

<Diagram name="preserving_state_diff_pt1" height={290} width={753} alt="Diagram with three sections, with an arrow transitioning each section in between. The first section contains a React component labeled 'div' with a single child labeled 'Counter' containing a state bubble labeled 'count' with value 3. The middle section has the same 'div' parent, but the child component has now been deleted, indicated by a yellow 'proof' image. The third section has the same 'div' parent again, now with a new child labeled 'p', highlighted in yellow.">

When `Counter` changes to `p`, the `Counter` is deleted and the `p` is added

</Diagram>

</DiagramGroup>

<DiagramGroup>

<Diagram name="preserving_state_diff_pt2" height={290} width={753} alt="Diagram with three sections, with an arrow transitioning each section in between. The first section contains a React component labeled 'p'. The middle section has the same 'div' parent, but the child component has now been deleted, indicated by a yellow 'proof' image. The third section has the same 'div' parent again, now with a new child labeled 'Counter' containing a state bubble labeled 'count' with value 0, highlighted in yellow.">

When switching back, the `p` is deleted and the `Counter` is added

</Diagram>

</DiagramGroup>
>>>>>>> 951fae39f0e12dc061f1564d02b2f4707c0541c4

또한 **같은 위치에 다른 컴포넌트를 렌더링할 때 컴포넌트는 그의 전체 서브 트리의 state를 초기화합니다.** 이것이 어떻게 작동하는지 보기 위해 카운터를 증가시키고 체크 박스를 체크해보세요.

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <div>
          <Counter isFancy={true} /> 
        </div>
      ) : (
        <section>
          <Counter isFancy={false} />
        </section>
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

체크 박스를 선택할 때 카운터 state가 초기화됩니다. `div`의 첫 번째 자식으로 `Counter`를 렌더링하는 것에서 `section`의 첫 번째 자식으로 바꾸지만요. 자식 `div`가 DOM에서 제거될 때 그것의 전체 하위 트리(`Counter`와 그 state를 포함해서)는 제거됩니다.

<<<<<<< HEAD
<img alt="첫 번째 자식이 다르면 잊으세요!" src="/images/docs/sketches/s_ui-components-swap.png" />
=======
<DiagramGroup>

<Diagram name="preserving_state_diff_same_pt1" height={350} width={794} alt="Diagram with three sections, with an arrow transitioning each section in between. The first section contains a React component labeled 'div' with a single child labeled 'section', which has a single child labeled 'Counter' containing a state bubble labeled 'count' with value 3. The middle section has the same 'div' parent, but the child components have now been deleted, indicated by a yellow 'proof' image. The third section has the same 'div' parent again, now with a new child labeled 'div', highlighted in yellow, also with a new child labeled 'Counter' containing a state bubble labeled 'count' with value 0, all highlighted in yellow.">

When `section` changes to `div`, the `section` is deleted and the new `div` is added

</Diagram>

</DiagramGroup>

<DiagramGroup>

<Diagram name="preserving_state_diff_same_pt2" height={350} width={794} alt="Diagram with three sections, with an arrow transitioning each section in between. The first section contains a React component labeled 'div' with a single child labeled 'div', which has a single child labeled 'Counter' containing a state bubble labeled 'count' with value 0. The middle section has the same 'div' parent, but the child components have now been deleted, indicated by a yellow 'proof' image. The third section has the same 'div' parent again, now with a new child labeled 'section', highlighted in yellow, also with a new child labeled 'Counter' containing a state bubble labeled 'count' with value 0, all highlighted in yellow.">

When switching back, the `div` is deleted and the new `section` is added

</Diagram>

</DiagramGroup>
>>>>>>> 951fae39f0e12dc061f1564d02b2f4707c0541c4

경험상(rule of thumb) **리렌더링할 때 state를 유지하고 싶다면, 트리 구조가 "같아야" 합니다.** 만약 구조가 다르다면 React가 트리에서 컴포넌트를 지울 때 state로 지우기 때문에 state가 유지되지 않습니다.

<Gotcha>

이것이 컴포넌트 함수를 중첩해서 정의하면 안 되는 이유입니다.

여기, `MyComponent` 안에서 `MyTextField` 컴포넌트 함수를 정의하고 있습니다.

<Sandpack>

```js
import { useState } from 'react';

export default function MyComponent() {
  const [counter, setCounter] = useState(0);

  function MyTextField() {
    const [text, setText] = useState('');

    return (
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
    );
  }

  return (
    <>
      <MyTextField />
      <button onClick={() => {
        setCounter(counter + 1)
      }}>Clicked {counter} times</button>
    </>
  );
}
```

</Sandpack>


버튼을 누를 때마다 입력 state가 사라집니다! 이것은 `MyComponent`를 렌더링할 때마다 *다른* `MyTextField` 함수가 만들어지기 때문입니다. 따라서 같은 함수에서 *다른* 컴포넌트를 렌더링할 때마다 React는 그 아래의 모든 state를 초기화합니다. 이런 문제를 피하려면 **항상 컴포넌트를 중첩해서 정의하지 않고 최상위 범위에서 정의해야 합니다.**

</Gotcha>

## 같은 위치에서 state를 초기화하기 {/*resetting-state-at-the-same-position*/}

기본적으로 React는 컴포넌트가 같은 위치를 유지하면 state를 유지합니다. 보통 이것이 당신이 원하는 행동이기 때문에 기본 동작으로서 타당합니다. 그러나 가끔 컴포넌트 state를 초기화하고 싶을 때가 있습니다. 두 선수가 턴마다 자신의 점수를 추적하는 앱을 한번 봅시다.

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        <Counter person="Taylor" />
      ) : (
        <Counter person="Sarah" />
      )}
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Next player!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}'s score: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

지금은 선수를 바꿀 때 점수가 유지됩니다. 두 `Counter`가 같은 위치에 나타나기 때문에 React는 그들을 `person` props가 변경된 *같은* `Counter`로 봅니다.

<<<<<<< HEAD
<Illustration src="/images/docs/illustrations/i_react-is-blind-to-ui-swap.png" alt="React는 두 컴포넌트를 저울질하고 서로 색이 다르지만 같은 것으로 봅니다." />

하지만 개념적으로 이 앱에서 둘은 분리된 카운터이어야합니다. UI에서 같은 위치에 나타나지만 하나는 Taylor를 위한 카운터이고 다른 하나는 Sarah를 위한 것입니다.
=======
But conceptually, in this app they should be two separate counters. They might appear in the same place in the UI, but one is a counter for Taylor, and another is a counter for Sarah.
>>>>>>> 951fae39f0e12dc061f1564d02b2f4707c0541c4

이 둘을 바꿀 때 state를 초기화하기 위한 두 가지 방법이 있습니다.

1. 다른 위치에 컴포넌트를 렌더링하기
2. 각 컴포넌트에 `key`로 명시적인 식별자를 제공하기


### 선택지 1: 다른 위치에 컴포넌트를 렌더링하기 {/*option-1-rendering-a-component-in-different-positions*/}

두 `Counter`가 독립적이기를 원한다면 둘을 다른 위치에 렌더링할 수 있습니다.

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA &&
        <Counter person="Taylor" />
      }
      {!isPlayerA &&
        <Counter person="Sarah" />
      }
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Next player!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}'s score: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

* 처음에는 `isPlayerA`가 `true`입니다. 따라서 첫 번째 자리에 `Counter`가 있고 두 번째 자리는 비어있습니다.
* "Next player"를 클릭하면 첫 번째 자리는 비워지고 두 번째 자리에 `Counter`가 옵니다.

<DiagramGroup>

<Diagram name="preserving_state_diff_position_p1" height={375} width={504} alt="Diagram with a tree of React components. The parent is labeled 'Scoreboard' with a state bubble labeled isPlayerA with value 'true'. The only child, arranged to the left, is labeled Counter with a state bubble labeled 'count' and value 0. All of the left child is highlighted in yellow, indicating it was added.">

Initial state

</Diagram>

<Diagram name="preserving_state_diff_position_p2" height={375} width={504} alt="Diagram with a tree of React components. The parent is labeled 'Scoreboard' with a state bubble labeled isPlayerA with value 'false'. The state bubble is highlighted in yellow, indicating that it has changed. The left child is replaced with a yellow 'poof' image indicating that it has been deleted and there is a new child on the right, highlighted in yellow indicating that it was added. The new child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0.">

Clicking "next"

</Diagram>

<Diagram name="preserving_state_diff_position_p3" height={375} width={504} alt="Diagram with a tree of React components. The parent is labeled 'Scoreboard' with a state bubble labeled isPlayerA with value 'true'. The state bubble is highlighted in yellow, indicating that it has changed. There is a new child on the left, highlighted in yellow indicating that it was added. The new child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0. The right child is replaced with a yellow 'poof' image indicating that it has been deleted.">

Clicking "next" again

</Diagram>

</DiagramGroup>

> 각 `Counter`의 state는 DOM에서 지워질 때마다 제거됩니다. 이것이 버튼을 누를 때마다 초기화되는 이유입니다.

이 방법은 같은 자리에 적은 수의 독립된 컴포넌트만을 가지고 있을 때 편리합니다. 이 예시에서는 두 개밖에 없기 때문에 JSX에서 각각 렌더링하기 번거롭지 않습니다.

### 선택지 2: key를 이용해 state를 초기화하기 {/*option-2-resetting-state-with-a-key*/}

State를 초기화하는 좀 더 일반적인 방법이 또 있습니다.

[배열을 렌더링할 때](/learn/rendering-lists#keeping-list-items-in-order-with-key) `key`를 봤을 것입니다. key는 배열을 위한 것만은 아닙니다! React가 컴포넌트를 구별할 수 있도록 key를 사용할 수도 있습니다. 기본적으로 React는 컴포넌트를 구별하기 위해 부모 안에서의 순서("첫 번째 카운터", "두 번째 카운터")를 이용합니다. 그러나 key를 이용하면 React에게 단지 *첫 번째* 카운터나 *두 번째* 카운터가 아니라 특정한 카운터라고 말해줄 수 있습니다. 예를 들면 *Taylor의* 카운터처럼요. 이렇게 트리 어디에서 나타나든 React는 *Taylor의* 카운터라는 것을 알 수 있습니다.

다음 예시에서 두 `<Counter />`는 JSX에서 같은 위치에 나타나지만, state를 공유하지는 않습니다.

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        <Counter key="Taylor" person="Taylor" />
      ) : (
        <Counter key="Sarah" person="Sarah" />
      )}
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Next player!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}'s score: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Taylor와 Sarah를 바꾸지만, state를 유지하지는 않습니다. **당신이 다른 `key`를 주었기** 때문이죠.

```js
{isPlayerA ? (
  <Counter key="Taylor" person="Taylor" />
) : (
  <Counter key="Sarah" person="Sarah" />
)}
```

`key`를 명시하면 React는 부모 내에서의 순서 대신에 `key` 자체를 위치의 일부로 사용합니다. 이것이 컴포넌트를 JSX에서 같은 자리에 렌더링하지만 React 관점에서는 다른 카운터인 이유입니다. 결과적으로 그들은 절대 state를 공유하지 않습니다. 카운터가 화면에 나타날 때마다 state가 새로 만들어집니다. 그리고 카운터가 제거될 때 마다 state도 제거됩니다. 그들을 토글할 때마다 state가 계속 state가 초기화됩니다.

<<<<<<< HEAD
<Illustration src="/images/docs/illustrations/i_keys-in-trees.png" alt="React는 같은 타입의 컴포넌트라도 다른 key를 가지고 있으면 그들을 구별합니다." />

> key가 전역적으로 유일하지는 않다는 것을 기억하세요. key는 **부모 안의** 위치에서만 유효합니다.
=======
> Remember that keys are not globally unique. They only specify the position *within the parent*.
>>>>>>> 951fae39f0e12dc061f1564d02b2f4707c0541c4

### key를 이용해 폼을 초기화하기 {/*resetting-a-form-with-a-key*/}

key로 state를 초기화하는 것은 특히 폼을 다룰 때 유용합니다.

다음 채팅 앱에서 `<Chat>` 컴포넌트는 문자열 입력 state를 가지고 있습니다.

<Sandpack>

```js App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat contact={to} />
    </div>
  )
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Chat to ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

입력란에 타이핑한 후에 "Alice"나 "Bob"을 눌러 다른 수신자를 선택해보세요. `<Chat>`이 트리의 같은 곳에서 렌더링되기 때문에 입력값이 유지되는 것을 볼 수 있습니다.

**많은 앱에서 이런 동작을 원하겠지만 채팅 앱에서는 아닙니다!** 유저가 실수로 클릭해서 이미 입력한 내용을 잘못된 사람에게 보내는 것은 바람직하지 않습니다. 이것을 고치기 위해 `key`를 추가해봅시다.

```js
<Chat key={to.id} contact={to} />
```

이것은 다른 수신자를 선택할 때 `Chat` 컴포넌트가 그 트리에 있는 모든 state를 포함해서 처음부터 다시 생성되는 것을 보장해줍니다. React는 DOM 엘리먼트도 다시 사용하는 대신 새로 만들 것입니다.

이제 수신자를 바꿀 때마다 입력란이 비워지게 됩니다.

<Sandpack>

```js App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat key={to.id} contact={to} />
    </div>
  )
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Chat to ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<DeepDive title="제거된 컴포넌트의 state를 보존하기">

실제 채팅 앱에서는 이전의 수신자를 선택했을 때 입력값이 복구되는 것을 원할 것입니다. 보이지 않는 컴포넌트의 state를 "살아 있게"하는 몇 가지 방법이 있습니다.

- 현재 채팅만 렌더링하는 대신 _모든_ 채팅을 렌더링하고 CSS로 안 보이게 할 수 있습니다. chat을 트리에서 사라지지 않을 것이고 따라서 그들의 state는 유지됩니다. 이 방법은 간단한 UI에서 잘 작동합니다. 하지만 숨겨진 트리가 커지고 많은 DOM 노드를 가지고 있다면 매우 느려질 것입니다.
- [state를 상위로 올리고](/learn/sharing-state-between-components) 각 수신자의 임시 메시지를 부모 컴포넌트에 가지고 있을 수 있습니다. 이 방법에서 부모가 중요한 정보를 가지고 있기 때문에 자식 컴포넌트가 제거되어도 상관이 없습니다. 이것이 가장 일반적인 해법입니다.
- React state 이외의 다른 저장소를 이용할 수도 있습니다. 예를 들어 유저가 페이지를 실수로 닫아도 메시지를 유지하고 싶을 수도 있습니다. 이때 [`localStorage`](https://developer.mozilla.org/ko/docs/Web/API/Window/localStorage)에 메시지를 저장하고 이를 이용해 `Chat` 컴포넌트를 초기화할 수 있습니다.

어떤 방법을 선택하더라도 _Alice와의_ 채팅은 _Bob과의_ 채팅과 개념상 구별되기 때문에 현재 수신자를 기반으로 `<Chat>` 트리에 `key`를 주는 것이 타당합니다.

</DeepDive>

<Recap>

- React는 같은 컴포넌트가 같은 자리에 렌더링되는 한 state를 유지합니다.
- state는 JSX 태그에 저장되지 않습니다. state는 JSX으로 만든 트리 위치와 연관됩니다.
- 컴포넌트에 다른 key를 주어서 그 하위 트리를 초기화하도록 강제할 수 있습니다.
- 중첩해서 컴포넌트를 정의하면 원치 않게 state가 초기화될 수 있기 때문에 그렇게 하지 마세요.

</Recap>



<Challenges>

### 입력 문자열이 사라지는 것 고치기 {/*fix-disappearing-input-text*/}

이 예시에서 버튼을 누르면 메시지를 보여줍니다. 하지만 버튼을 누르는 것은 또한 원치 않게 state를 초기화합니다. 왜 이런 현상이 일어날까요? 버튼을 눌러도 입력 문자열이 초기화되지 않도록 고쳐보세요.

<Sandpack>

```js App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  if (showHint) {
    return (
      <div>
        <p><i>Hint: Your favorite city?</i></p>
        <Form />
        <button onClick={() => {
          setShowHint(false);
        }}>Hide hint</button>
      </div>
    );
  }
  return (
    <div>
      <Form />
      <button onClick={() => {
        setShowHint(true);
      }}>Show hint</button>
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>

<Solution>

`Form`이 다른 위치에 렌더링되기 때문에 문제가 생깁니다. `if` 문에서는 `<div>`의 두 번째 자식이지만 `else` 문에서는 첫 번째 자식입니다. 따라서 각 위치에서 컴포넌트 타입이 바뀌게 됩니다. 첫 번째 위치는 `p`와 `Form` 사이를 바뀌고 두 번째 위치에서는 `Form`과 `button` 사이에서 바뀝니다. React는 컴포넌트 타입이 변할 때마다 state를 초기화합니다.

분기를 합쳐서 `Form`를 항상 같은 자리에서 렌더링하는 것이 가장 쉬운 해결 방법입니다.

<Sandpack>

```js App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  return (
    <div>
      {showHint &&
        <p><i>Hint: Your favorite city?</i></p>
      }
      <Form />
      {showHint ? (
        <button onClick={() => {
          setShowHint(false);
        }}>Hide hint</button>
      ) : (
        <button onClick={() => {
          setShowHint(true);
        }}>Show hint</button>
      )}
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>


엄밀히 말하면 `else` 문의 `<Form />` 앞에 `null`을 추가해서 `if` 문에서와 트리 구조를 일치시켜도 됩니다.

<Sandpack>

```js App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  if (showHint) {
    return (
      <div>
        <p><i>Hint: Your favorite city?</i></p>
        <Form />
        <button onClick={() => {
          setShowHint(false);
        }}>Hide hint</button>
      </div>
    );
  }
  return (
    <div>
      {null}
      <Form />
      <button onClick={() => {
        setShowHint(true);
      }}>Show hint</button>
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>

이 방법에서 `Form`은 항상 두 번째 자식이기 때문에 같은 위치를 유지하고 state를 유지합니다. 하지만 이 접근 방식은 훨씬 애매하고 다른 사람이 `null`을 지워버릴 리스크를 남깁니다. 

</Solution>

### 두 필드를 맞바꾸기 {/*swap-two-form-fields*/}

다음 폼은 first name과 last name을 입력받습니다. 또한 어떤 필드가 앞에 가는지를 조절하는 체크 박스로 있습니다. 체크 박스를 선택하면 "Last name" 필드가 "First name" 필드 앞에 나타납니다.

거의 모든 작업에는 버그가 있습니다. "First name"에 입력을 하고 체크 박스를 선택해도 문자열은 "Last name"이 된 첫 번째 인풋에 그대로 있습니다. 순서를 바꿀 때 입력 문자열도 *이동*하도록 수정해보세요.

<Hint>

이 필드들에게 부모 내에서의 위치는 충분하지 않은 것 같습니다. 리렌더링될 때 React에게 state를 연결하는 방법을 알려줄 수 있을까요?

</Hint>

<Sandpack>

```js App.js
import { useState } from 'react';

export default function App() {
  const [reverse, setReverse] = useState(false);
  let checkbox = (
    <label>
      <input
        type="checkbox"
        checked={reverse}
        onChange={e => setReverse(e.target.checked)}
      />
      Reverse order
    </label>
  );
  if (reverse) {
    return (
      <>
        <Field label="Last name" /> 
        <Field label="First name" />
        {checkbox}
      </>
    );
  } else {
    return (
      <>
        <Field label="First name" /> 
        <Field label="Last name" />
        {checkbox}
      </>
    );    
  }
}

function Field({ label }) {
  const [text, setText] = useState('');
  return (
    <label>
      {label}:{' '}
      <input
        type="text"
        value={text}
        placeholder={label}
        onChange={e => setText(e.target.value)}
      />
    </label>
  );
}
```

```css
label { display: block; margin: 10px 0; }
```

</Sandpack>

<Solution>

`if`와 `else`문 안의 두 `<Field>` 컴포넌트에게 `key`를 주십시오. 이로써 부모 안에서의 순서가 바뀌더라도 React에게 각 `<Field>`의 올바른 state를 어떻게 "맞출지" 알려줄 수 있습니다.

<Sandpack>

```js App.js
import { useState } from 'react';

export default function App() {
  const [reverse, setReverse] = useState(false);
  let checkbox = (
    <label>
      <input
        type="checkbox"
        checked={reverse}
        onChange={e => setReverse(e.target.checked)}
      />
      Reverse order
    </label>
  );
  if (reverse) {
    return (
      <>
        <Field key="lastName" label="Last name" /> 
        <Field key="firstName" label="First name" />
        {checkbox}
      </>
    );
  } else {
    return (
      <>
        <Field key="firstName" label="First name" /> 
        <Field key="lastName" label="Last name" />
        {checkbox}
      </>
    );    
  }
}

function Field({ label }) {
  const [text, setText] = useState('');
  return (
    <label>
      {label}:{' '}
      <input
        type="text"
        value={text}
        placeholder={label}
        onChange={e => setText(e.target.value)}
      />
    </label>
  );
}
```

```css
label { display: block; margin: 10px 0; }
```

</Sandpack>

</Solution>

### 폼 세부내용을 초기화하기 {/*reset-a-detail-form*/}

여기 수정 가능한 연락처 목록이 있습니다. 연락처 상세 정보를 수정하고 "Save"를 눌러 갱신하거나 "Reset"을 눌러 수정한 것을 되돌릴 수 있습니다.

Alice와 같이 다른 연락처를 선택했을 때 state는 갱신되지만, 폼은 여전히 이전 내용을 보여줍니다. 다른 연락처를 선택했을 때 폼이 초기화되도록 수정해보세요.

<Sandpack>

```js App.js
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        initialData={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js ContactList.js
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js EditContact.js
import { useState } from 'react';

export default function EditContact({ initialData, onSave }) {
  const [name, setName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email);
  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: initialData.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(initialData.name);
        setEmail(initialData.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Solution>

`EditContact` 컴포넌트에 `key={selectedId}`를 주세요. 이로써 다른 연락처를 선택하면 폼이 초기화됩니다.

<Sandpack>

```js App.js
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        key={selectedId}
        initialData={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js ContactList.js
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js EditContact.js
import { useState } from 'react';

export default function EditContact({ initialData, onSave }) {
  const [name, setName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email);
  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: initialData.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(initialData.name);
        setEmail(initialData.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

</Solution>

### 이미지가 로딩될 동안 이미지가 안 보이게 하기 {/*clear-an-image-while-its-loading*/}

"Next"를 누르면 브라우저는 다음 이미지를 불러오기 시작합니다. 하지만 같은 `<img>` 태그에서 보이기 때문에 기본적으로 다음 이미지를 불러오기 전까지 기존 이미지가 나옵니다. 만약 설명과 이미지가 항상 일치해야 한다면 이것은 바람직하지 않은 동작입니다. "Next"를 누르는 순간 이전 이미지가 안 보이도록 바꾸어보세요.

<Hint>

React가 DOM을 재사용하지 않고 새로 만들게 하는 방법이 있을까요?

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const hasNext = index < images.length - 1;

  function handleClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  let image = images[index];
  return (
    <>
      <button onClick={handleClick}>
        Next
      </button>
      <h3>
        Image {index + 1} of {images.length}
      </h3>
      <img src={image.src} />
      <p>
        {image.place}
      </p>
    </>
  );
}

let images = [{
  place: 'Penang, Malaysia',
  src: 'https://i.imgur.com/FJeJR8M.jpg'
}, {
  place: 'Lisbon, Portugal',
  src: 'https://i.imgur.com/dB2LRbj.jpg'
}, {
  place: 'Bilbao, Spain',
  src: 'https://i.imgur.com/z08o2TS.jpg'
}, {
  place: 'Valparaíso, Chile',
  src: 'https://i.imgur.com/Y3utgTi.jpg'
}, {
  place: 'Schwyz, Switzerland',
  src: 'https://i.imgur.com/JBbMpWY.jpg'
}, {
  place: 'Prague, Czechia',
  src: 'https://i.imgur.com/QwUKKmF.jpg'
}, {
  place: 'Ljubljana, Slovenia',
  src: 'https://i.imgur.com/3aIiwfm.jpg'
}];
```

```css
img { width: 150px; height: 150px; }
```

</Sandpack>

<Solution>

`<img>` 태그에 `key`를 줄 수 있습니다. `key`가 바뀌면 React는 `<img>` DOM 노드를 새로 다시 만듭니다. 이미지를 불러오는 동안 이미지가 잠깐 깜박이는데 앱의 모든 이미지가 이처럼 작동하기를 원하지는 않을 것입니다. 하지만 이미지와 설명이 항상 일치하도록 할 때는 일리가 있습니다.

<Sandpack>

```js
import { useState } from 'react';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const hasNext = index < images.length - 1;

  function handleClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  let image = images[index];
  return (
    <>
      <button onClick={handleClick}>
        Next
      </button>
      <h3>
        Image {index + 1} of {images.length}
      </h3>
      <img key={image.src} src={image.src} />
      <p>
        {image.place}
      </p>
    </>
  );
}

let images = [{
  place: 'Penang, Malaysia',
  src: 'https://i.imgur.com/FJeJR8M.jpg'
}, {
  place: 'Lisbon, Portugal',
  src: 'https://i.imgur.com/dB2LRbj.jpg'
}, {
  place: 'Bilbao, Spain',
  src: 'https://i.imgur.com/z08o2TS.jpg'
}, {
  place: 'Valparaíso, Chile',
  src: 'https://i.imgur.com/Y3utgTi.jpg'
}, {
  place: 'Schwyz, Switzerland',
  src: 'https://i.imgur.com/JBbMpWY.jpg'
}, {
  place: 'Prague, Czechia',
  src: 'https://i.imgur.com/QwUKKmF.jpg'
}, {
  place: 'Ljubljana, Slovenia',
  src: 'https://i.imgur.com/3aIiwfm.jpg'
}];
```

```css
img { width: 150px; height: 150px; }
```

</Sandpack>

</Solution>

### 배열에서 잘못 지정된 state 고치기 {/*fix-misplaced-state-in-the-list*/}

다음 예시에서 배열의 각 `Contact`는 "Show email"이 눌렸는지에 대한 state를 갖고 있습니다. Alice의 "Show email"을 누르고 "Show in reverse order" 체크 박스를 선택해보세요. 아래쪽으로 내려간 Alice의 이메일은 닫혀있고 대신 _Taylor_의 이메일이 열려있는 것을 볼 수 있습니다.

순서와 관계없이 확장 state가 각 연락처와 연관되도록 고쳐보세요.

<Sandpack>

```js App.js
import { useState } from 'react';
import Contact from './Contact.js';

export default function ContactList() {
  const [reverse, setReverse] = useState(false);

  const displayedContacts = [...contacts];
  if (reverse) {
    displayedContacts.reverse();
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          value={reverse}
          onChange={e => {
            setReverse(e.target.checked)
          }}
        />{' '}
        Show in reverse order
      </label>
      <ul>
        {displayedContacts.map((contact, i) =>
          <li key={i}>
            <Contact contact={contact} />
          </li>
        )}
      </ul>
    </>
  );
}

const contacts = [
  { id: 0, name: 'Alice', email: 'alice@mail.com' },
  { id: 1, name: 'Bob', email: 'bob@mail.com' },
  { id: 2, name: 'Taylor', email: 'taylor@mail.com' }
];
```

```js Contact.js
import { useState } from 'react';

export default function Contact({ contact }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <p><b>{contact.name}</b></p>
      {expanded &&
        <p><i>{contact.email}</i></p>
      }
      <button onClick={() => {
        setExpanded(!expanded);
      }}>
        {expanded ? 'Hide' : 'Show'} email
      </button>
    </>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  margin-bottom: 20px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Solution>

이 예제에서는 배열의 인덱스를 `key`로 사용해서 문제가 발생합니다.

```js
{displayedContacts.map((contact, i) =>
  <li key={i}>
```

하지만 우리는 state가 _각 특정 연락처_와 연관되기를 바랍니다.

대신 연락처 ID를 `key`로 사용해서 문제를 해결할 수 있습니다.

<Sandpack>

```js App.js
import { useState } from 'react';
import Contact from './Contact.js';

export default function ContactList() {
  const [reverse, setReverse] = useState(false);

  const displayedContacts = [...contacts];
  if (reverse) {
    displayedContacts.reverse();
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          value={reverse}
          onChange={e => {
            setReverse(e.target.checked)
          }}
        />{' '}
        Show in reverse order
      </label>
      <ul>
        {displayedContacts.map(contact =>
          <li key={contact.id}>
            <Contact contact={contact} />
          </li>
        )}
      </ul>
    </>
  );
}

const contacts = [
  { id: 0, name: 'Alice', email: 'alice@mail.com' },
  { id: 1, name: 'Bob', email: 'bob@mail.com' },
  { id: 2, name: 'Taylor', email: 'taylor@mail.com' }
];
```

```js Contact.js
import { useState } from 'react';

export default function Contact({ contact }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <p><b>{contact.name}</b></p>
      {expanded &&
        <p><i>{contact.email}</i></p>
      }
      <button onClick={() => {
        setExpanded(!expanded);
      }}>
        {expanded ? 'Hide' : 'Show'} email
      </button>
    </>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  margin-bottom: 20px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

State는 트리의 위치와 연관됩니다. `key`는 위치에 순서 대신 이름을 줄 수 있게 해 줍니다.

</Solution>

</Challenges>
