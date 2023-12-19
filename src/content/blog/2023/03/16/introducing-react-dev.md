---
title: "react.dev를 소개합니다"
---

2023년 3월 16일 [Dan Abramov](https://twitter.com/dan_abramov)와 [Rachel Nabors](https://twitter.com/rachelnabors)가 작성함

---

<Intro>

오늘 React와 React 문서의 새로운 보금자리인 [react.dev](https://react.dev)를 출시하게 되어 기쁩니다. 이 글에서는 새로운 사이트에 대해 소개해 드리겠습니다.

</Intro>

---

## 요약 {/*tldr*/}

* 새로운 React 사이트 ([react.dev](https://react.dev)) 는 함수 컴포넌트와 Hooks를 사용한 현대적인 React를 가르칩니다.
* 다이어그램, 삽화, 도전 과제, 그리고 600개 이상의 새로운 상호 작용하는 예시를 포함했습니다.
* 예전 React 문서 사이트는 이제 [legacy.reactjs.org](https://legacy.reactjs.org)로 이전되었습니다.

## 새로운 사이트, 새로운 도메인, 새로운 홈페이지 {/*new-site-new-domain-new-homepage*/}

우선, 조금의 정리를 진행하겠습니다.

새로운 문서의 출시를 축하하고, 더욱 중요한 것은 오래된 내용과 새로운 내용을 명확하게 구분하기 위해, 더 짧은 [react.dev](https://react.dev) 도메인으로 이전했습니다. 예전 [reactjs.org](https://reactjs.org) 도메인은 이제 이곳으로 리다이렉트할 것입니다.

예전 React 문서는 이제 [legacy.reactjs.org](https://legacy.reactjs.org)에 보관되었습니다. 예전 내용으로 가는 모든 기존 링크는 "웹을 망가트리는 것"을 방지하기 위해 자동으로 해당 위치로 리다이렉트할 것이지만, 레거시 사이트는 더 이상 업데이트 받지 않을 것입니다.

믿기 힘들겠지만, React는 곧 10살이 됩니다. JavaScript 시대에, 이건 마치 한 세기와 같습니다! 오늘날 React가 사용자 인터페이스를 만들기 위한 훌륭한 방법인 이유를 반영하기 위해 [React 홈페이지를 갱신하고](https://react.dev), 현대적인 React 기반 프레임워크를 더욱 명확하게 언급하기 위해 시작 가이드를 업데이트했습니다.

아직 새로운 홈페이지를 보지 않았다면, 꼭 확인해 보세요!

## Hooks를 사용한 현대적인 React에 전념하기 {/*going-all-in-on-modern-react-with-hooks*/}

2018년에 React Hooks를 발표했을 때, Hooks 문서는 클래스 컴포넌트에 익숙한 독자를 가정했습니다. 이는 커뮤니티가 Hooks를 매우 빠르게 채택하는 데 도움이 되었지만, 시간이 지나면서 예전 문서는 새로운 독자에게 적합하지 않았습니다. 새로운 독자는 클래스 컴포넌트와 Hooks를 사용한 것으로 React를 두 번 배워야만 했습니다.

**새로운 문서는 Hooks를 사용한 React를 처음부터 가르칩니다.** 문서는 두 가지 주요 섹션으로 나뉘어져 있습니다.

* **[React 배우기](/learn)** 는 React를 기초부터 스스로 학습할 수 있는 과정입니다.
* **[API 레퍼런스](/reference)** 는 모든 React API에 대한 세부 내용과 사용 예시를 제공합니다.

각 섹션에서 무슨 내용을 알 수 있는지 자세히 살펴보겠습니다.

<Note>

아직 Hook 기반의 동등한 것이 없는 몇 가지 희귀한 클래스 컴포넌트 사용 사례가 여전히 있습니다. 클래스 컴포넌트는 그대로 지원되고, 새로운 사이트의 [Legacy API](/reference/react/legacy) 섹션에 문서화되어 있습니다.

</Note>

## 빠르게 시작하기 {/*quick-start*/}

학습 섹션은 [빠르게 시작하기](/learn) 페이지로 시작됩니다. 이는 React를 짧게 소개하는 여정입니다. 컴포넌트, props, state 같은 개념에 대한 문법을 소개하지만, 그들을 어떻게 사용하는지에 대한 세부 내용을 다루진 않습니다.

직접 해보며 배우고 싶다면, 다음으로 [Tic-Tac-Toe 튜토리얼](/learn/tutorial-tic-tac-toe)을 확인하는 것을 추천합니다. React로 작은 게임을 구현하는 것을 자세히 설명하면서, 동시에 일상적으로 사용할 기술을 가르칩니다. 여기에 구현하게 될 내용이 있습니다.

<Sandpack>

```js App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

```css styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

또한 많은 사람에게 React를 "완전히 이해시켜 준" 튜토리얼인 [React로 사고하기](/learn/thinking-in-react)도 강조하고 싶습니다. **두 가지 클래식 튜토리얼 모두 함수 컴포넌트와 Hooks를 사용하도록 업데이트했고,** 따라서 새 튜토리얼만큼 좋습니다.

<Note>

위쪽에 있는 예제는 *샌드박스*입니다. 우리는 600개 이상의 많은 샌드박스를 사이트 전체 모든 곳에 추가했습니다. 아무 샌드박스나 편집할 수 있고, 우측 상단에 있는 "Fork"를 눌러 별도의 탭에서 열 수 있습니다. 샌드박스는 React API를 빠르게 갖고 놀면서, 아이디어를 탐구하고, 이해를 확인하게 해줍니다.

</Note>

## 단계별로 React 배우기 {/*learn-react-step-by-step*/}

세상에 있는 모든 사람이 React를 무료로 배울 동등한 기회를 가지길 바랍니다.

이것이 학습 섹션이 여러 개의 장으로 구분된 자기 주도 학습 과정으로 구성된 이유입니다. 처음 두 장은 React의 기초에 관해서 설명합니다. React가 처음이거나 기억을 되살리고 싶다면, 여기서부터 시작하세요.

- **[UI 표현하기](/learn/describing-the-ui)**에서는 컴포넌트로 어떻게 정보를 표시하는지 가르칩니다. 
- **[상호작용 추가하기](/learn/adding-interactivity)**에서는 사용자 입력에 대한 응답으로 화면을 어떻게 업데이트하는지 가르칩니다. 

다음 두 장은 더욱 고급 내용을 다루며, 더 복잡한 부분에 대해서 깊은 통찰을 줄 것입니다. 

- **[State 관리하기](/learn/managing-state)**에서는 앱의 복잡성이 증가함에 따라 어떻게 로직을 조직화하는지 가르칩니다. 
- **[탈출구](/learn/escape-hatches)**에서는 React "외부로 탈출"할 방법과, 이를 수행하기에 가장 적절한 시기를 가르칩니다.

모든 장은 여러 개의 관련된 페이지로 구성되어 있습니다. 대부분의 페이지는 특정 기술이나 기법을 가르칩니다-예를 들어, [JSX로 마크업 작성하기](/learn/writing-markup-with-jsx), [State에 있는 객체 업데이트하기](/learn/updating-objects-in-state)나 [컴포넌트 간 State 공유하기](/learn/sharing-state-between-components) 같은 것들이 있습니다. [렌더와 커밋](/learn/render-and-commit), [스냅샷으로서의 State](/learn/state-as-a-snapshot)와 같은 몇몇 페이지들은 아이디어를 설명하는 것에 집중합니다. 그리고 지난 몇 년 동안의 경험을 기반으로 제안을 공유하는 [Effect가 필요하지 않을 수 있습니다](/learn/you-might-not-need-an-effect) 같은 페이지도 몇 개 있습니다.

이러한 장들을 순서대로 읽을 필요는 없습니다. 누가 그런 시간이 있을까요?! 하지만 읽을 수도 있습니다. 학습 섹션에 있는 페이지는 오로지 이전 페이지에 소개된 개념에만 의존합니다. 책처럼 읽고 싶다면, 도전해 보세요!

### 도전 과제로 이해를 확인하세요 {/*check-your-understanding-with-challenges*/}

학습 섹션에 있는 대부분의 페이지는 이해를 확인하기 위한 몇 가지 도전 과제로 끝납니다. 예를 들어, 여기 [조건부 렌더링](/learn/conditional-rendering#challenges) 페이지에 있는 몇 가지 도전 과제가 있습니다.

지금 당장 풀지 않아도 됩니다! *정말로* 원하지 않는다면 말입니다.

<Challenges noTitle={true}>

#### `? :`로 미완료 항목에 대한 아이콘을 보여주세요 {/*show-an-icon-for-incomplete-items-with--*/}

`isPacked` 가 `true`가 아니라면 ❌를 렌더링하기 위해 조건 연산자 (`cond ? a : b`)를 사용하세요.

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✔'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked ? '✔' : '❌'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

</Solution>

#### `&&`로 항목의 중요성을 보여주세요 {/*show-the-item-importance-with-*/}

이 예시에서는, 각 `Item`이 숫자로 된 `importance` prop을 받습니다. 오직 중요도가 0이 아닌 항목만 "_(중요도: X)_"을 이탤릭체로 렌더링하기 위해 `&&` 연산자를 사용하세요. 아이템 목록은 최종적으로 이렇게 되어야 합니다:

* 우주복 _(중요도: 9)_
* 금색 잎사귀가 달린 헬멧
* Tam의 사진 _(중요도: 6)_

두 라벨 사이에 공백을 넣는 것을 잊지 마세요!

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          importance={9} 
          name="Space suit" 
        />
        <Item 
          importance={0} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          importance={6} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

이렇게 하면 해결할 수 있습니다.

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
      {importance > 0 && ' '}
      {importance > 0 &&
        <i>(Importance: {importance})</i>
      }
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          importance={9} 
          name="Space suit" 
        />
        <Item 
          importance={0} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          importance={6} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

만약 `importance`가 `0`일 경우, `0`이 결과로 렌더링 되지 않도록 `importance && ...`보다 `importance > 0 && ...`로 작성해야 한다는 것을 주의하세요!

이 해결책에서는, 독립된 두 개의 조건이 name과 importance 라벨 사이에 공백을 넣기 위해 사용되었습니다. 그 대신에, `importance > 0 && <> <i>...</i></>` 같이 선행 공백에 있는 Fragment를 사용하거나 `importance > 0 && <i> ...</i>` 같이 `<i>`내부에 바로 공백을 추가할 수 있습니다.

</Solution>

</Challenges>

좌측 하단에 있는 "Show solution" 버튼을 주목해 보세요. 스스로 확인하고 싶을 때 유용하게 사용할 수 있습니다!

### 다이어그램과 삽화로 직관력을 높여보세요 {/*build-an-intuition-with-diagrams-and-illustrations*/}

코드와 단어만으로 어떤 것을 설명하기 어려운 경우, 직관적으로 도움을 주는 다이어그램을 추가했습니다. 예를 들어, 여기 [State를 보장하고 재설정하기](/learn/preserving-and-resetting-state)에 있는 다이어그램 중 하나가 있습니다.

<Diagram name="preserving_state_diff_same_pt1" height={350} width={794} alt="다이어그램에는 세 개의 섹션이 있으며, 각 섹션 사이에 전환되는 화살표가 있습니다. 첫 번째 섹션에는 'div'로 레이블 된 React 컴포넌트가 있습니다. 이 컴포넌트의 단일 자식으로 'section'이라고 레이블 된 섹션이 있으며, 그 안에 'Counter'라고 레이블 된 컴포넌트가 있습니다. 이 컴포넌트 안에는 'count'라고 레이블 된 state 버블이 있으며 값은 3입니다. 중간 섹션에는 동일한 'div' 부모가 있지만, 이제는 하위 컴포넌트들이 삭제되었습니다. 이를 노란색 'proof' 이미지로 표시합니다. 세 번째 섹션에는 다시 동일한 'div' 부모가 있으며, 이번에는 'div'라고 레이블 된 새로운 하위 컴포넌트가 추가되었습니다. 이 컴포넌트 안에는 'Counter'라고 레이블 된 컴포넌트가 있으며, 그 안에 'count'라고 레이블 된 state 버블이 있습니다. 이번에는 값이 0으로 표시됩니다. 모든 부분이 노란색으로 강조되어 있습니다.">

`section`이 `div`로 변경될 때, `section`은 삭제되고 새로운 `div`가 추가됩니다.

</Diagram>

또한 문서 곳곳에서 몇몇 삽화를 보게 될 것입니다--여기 [화면을 그리는 브라우저](/learn/render-and-commit#epilogue-browser-paint) 중 하나가 있습니다.

<Illustration alt="'카드 요소가 있는 정물화'를 그리는 브라우저" src="/images/docs/illustrations/i_browser-paint.png" />

브라우저 공급업체에게 이 표현이 100% 과학적으로 정확하다는 확인을 받았습니다.

## 새로운, 상세한 API 레퍼런스 {/*a-new-detailed-api-reference*/}

[API 레퍼런스](/reference/react)에서, 이제 모든 React API는 전용 페이지를 가집니다. 모든 종류의 API들이 포함됩니다.

- [`useState`](/reference/react/useState) 같은 내장 Hooks
- [`<Suspense>`](/reference/react/Suspense) 같은 내장 컴포넌트
- [`<input>`](/reference/react-dom/components/input) 같은 브라우저 내장 컴포넌트
- [`renderToPipeableStream`](/reference/react-dom/server/renderToReadableStream) 같은 프레임워크 지향 API
- [`memo`](/reference/react/memo) 같은 그 밖의 React API

모든 API 페이지가 *레퍼런스* 와 *사용법*을 포함하는 최소 두 개의 세그먼트로 나뉘어 있다는 것을 알 수 있습니다.

[레퍼런스](/reference/react/useState#reference)는 인자와 반환 값을 나열하여 형식적인 API 서명을 설명합니다. 이는 간결하지만, 해당 API에 익숙하지 않다면 약간 추상적으로 느껴질 수 있습니다. 이것은 API를 어떻게 사용하는지가 아닌, API가 무엇을 하는지를 설명합니다.

[사용법](/reference/react/useState#usage)은 동료나 친구가 설명하는 것처럼 실제로 API를 사용하는 이유와 방법을 보여줍니다. **이는 React 팀에서 각 API가 어떻게 사용되기를 의도한 것인지에 대한 표준적인 시나리오**를 보여줍니다. 색상 있는 코드 스니펫, 서로 다른 API들을 함께 사용하는 예시, 복사 및 붙여넣기 할 수 있는 레시피를 추가했습니다.

<Recipes titleText="Basic useState examples" titleId="examples-basic">

#### 카운터 (숫자) {/*counter-number*/}

이 예시에서 `count` state 변수는 숫자를 저장합니다. 버튼을 누르면 숫자가 증가합니다.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      You pressed me {count} times
    </button>
  );
}
```

</Sandpack>

<Solution />

#### 텍스트 필드 (문자열) {/*text-field-string*/}

이 예시에서 `text` state 변수는 문자열을 저장합니다. 문자를 입력할 때, `handleChange`가 브라우저의 input DOM 요소로부터 가장 최근에 입력된 값을 읽고 state를 업데이트하기 위해 `setText`를 호출합니다. 이에 따라 현재의 `text`를 아래에 표시할 수 있습니다.

<Sandpack>

```js
import { useState } from 'react';

export default function MyInput() {
  const [text, setText] = useState('hello');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <input value={text} onChange={handleChange} />
      <p>You typed: {text}</p>
      <button onClick={() => setText('hello')}>
        Reset
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

#### 체크박스 (불리언) {/*checkbox-boolean*/}

이 예시에서 `liked` state 변수는 불리언을 저장합니다. input 요소를 클릭할 때, `setLiked`가 브라우저 체크박스의 선택 여부에 따라 `liked` state 변수를 업데이트합니다. `liked`는 체크박스 아래에 있는 문구를 렌더링하는 데 사용됩니다. 

<Sandpack>

```js
import { useState } from 'react';

export default function MyCheckbox() {
  const [liked, setLiked] = useState(true);

  function handleChange(e) {
    setLiked(e.target.checked);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={liked}
          onChange={handleChange}
        />
        I liked this
      </label>
      <p>You {liked ? 'liked' : 'did not like'} this.</p>
    </>
  );
}
```

</Sandpack>

<Solution />

#### 양식 (두 가지 변수) {/*form-two-variables*/}

하나의 컴포넌트에서 여러 개의 state 변수를 선언할 수 있습니다. 각각의 state 변수는 완전히 독립적입니다.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  return (
    <>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => setAge(age + 1)}>
        Increment age
      </button>
      <p>Hello, {name}. You are {age}.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

또한 몇몇 API 페이지는 (일반적인 문제에 대한) [트러블슈팅](/reference/react/useEffect#troubleshooting)과 (더 이상 사용하지 않는 API와 관련된) [대안](/reference/react-dom/findDOMNode#alternatives)을 포함하고 있습니다.

이러한 접근 방식이 API 레퍼런스를 단순히 인자를 찾는 용도뿐만 아니라, 각 API가 어떤 다양한 작업을 수행할 수 있는지, 어떻게 다른 API와 연결되어 있는지를 확인하는 데 유용하게 될 것을 기대합니다.

## 다음은 무엇인가요? {/*whats-next*/}

우리의 작은 여정을 마무리할 차례입니다! 새로운 웹 사이트를 둘러보며 마음에 드는 점과 안 드는 점을 찾아보고, [익명 설문조사](https://www.surveymonkey.co.uk/r/PYRPF3X)나 [이슈 트래커](https://github.com/reactjs/reactjs.org/issues)에 계속해서 피드백을 남겨주세요.

이 프로젝트가 출시되기까지 오랜 시간이 걸렸다는 것을 알고 있습니다. React 커뮤니티에 걸맞은 높은 품질 기준을 유지하고자 했습니다. 이 문서를 작성하고 모든 예시를 만들면서 몇몇 기존 설명에서의 오류, React의 버그, 심지어 현재 해결하기 위해 노력하고 있는 React 디자인의 빈 곳까지 발견했습니다. 새로운 문서가 앞으로 React 자체를 더 높은 기준에 맞추도록 도와줄 것을 기대합니다.

웹 사이트의 내용과 기능을 확장해달라는 많은 요청을 들었습니다. 예를 들어,

- 모든 예시에 대한 TypeScript 버전을 제공하기 
- 업데이트된 성능, 테스트, 접근성 가이드 만들기 
- React 서버 컴포넌트를 지원하는 프레임워크로부터 독립적으로 문서화하기 
- 새로운 문서가 번역되도록 전 세계 커뮤니티와 협업하기 
- 새로운 웹 사이트에 놓친 기능 추가하기 (예를 들어, 이 블로그를 위한 RSS)

이제 [react.dev](https://react.dev/)가 출시되었으니, 제삼자 React 교육 자료를 "따라잡는" 데서 벗어나 새로운 정보를 추가하고 새 웹 사이트를 더욱 개선하는 데 집중할 수 있게 되었습니다. 

React를 배우기에 가장 좋은 시기가 왔다고 생각합니다.

## 누가 작업하고 있나요? {/*who-worked-on-this*/}

React 팀에서 [Rachel Nabors](https://twitter.com/rachelnabors/)는 프로젝트를 이끌고 (삽화도 제공했습니다), [Dan Abramov](https://twitter.com/dan_abramov)는 커리큘럼을 설계했습니다. 또한 두 사람은 대부분의 내용을 함께 저술했습니다.

물론, 이렇게 큰 프로젝트는 혼자서 진행되는 것이 아닙니다. 감사할 분들이 많습니다!

[Sylwia Vargas](https://twitter.com/SylwiaVargas)는 "foo/bar/baz"와 고양이만 있던 예시를 전 세계의 과학자, 예술가, 그리고 도시들을 소개하는 내용으로 개선했습니다. [Maggie Appleton](https://twitter.com/Mappletons)은 간단한 스케치를 명확한 다이어그램 시스템으로 변경했습니다.

추가적인 글쓰기에 기여하신 [David McCabe](https://twitter.com/mcc_abe), [Sophie Alpert](https://twitter.com/sophiebits), [Rick Hanlon](https://twitter.com/rickhanlonii), [Andrew Clark](https://twitter.com/acdlite), [Matt Carroll](https://twitter.com/mattcarrollcode)에게 감사드립니다. 또한 아이디어와 피드백을 주신 [Natalia Tepluhina](https://twitter.com/n_tepluhina)와 [Sebastian Markbåge](https://twitter.com/sebmarkbage)에게 감사드립니다.

웹 사이트 디자인을 해주신 [Dan Lebowitz](https://twitter.com/lebo)와 샌드박스 디자인을 해주신 [Razvan Gradinar](https://dribbble.com/GradinarRazvan)에게 감사드립니다.

프론트엔드 개발에서는, 프로토타입 개발을 해주신 [Jared Palmer](https://twitter.com/jaredpalmer)에게 감사드립니다. UI 개발에 도움을 주신 [ThisDotLabs](https://www.thisdot.co/)의 [Dane Grant](https://twitter.com/danecando)와 [Dustin Goodman](https://twitter.com/dustinsgoodman)에게 감사드립니다. 샌드박스 통합 작업을 진행해 주신 [CodeSandbox](https://codesandbox.io/)의 [Ives van Hoorne](https://twitter.com/CompuIves), [Alex Moldovan](https://twitter.com/alexnmoldovan), [Jasper De Moor](https://twitter.com/JasperDeMoor), [Danilo Woznica](https://twitter.com/danilowoz)에게 감사드립니다. 세부 개발과 색상 및 미세한 세부 사항을 다듬는 디자인 작업을 해주신 [Rick Hanlon](https://twitter.com/rickhanlonii)에게 감사드립니다. 웹 사이트에 새로운 기능을 추가하고 유지하는 데 도움 주신 [Harish Kumar](https://www.strek.in/)와 [Luna Ruan](https://twitter.com/lunaruan)에게 감사드립니다. 

알파, 베타 테스트에 참여하기 위해 자발적으로 시간 내어 주신 분들께 큰 감사를 드립니다. 여러분의 열정과 소중한 피드백 덕분에 이 문서를 만들어 낼 수 있었습니다. 특별한 인사를 드리고 싶은 분은 React Conf 2021에서 React 문서를 이용했던 경험을 이야기해 주신 베타 테스터, [Debbie O'Brien](https://twitter.com/debs_obrien) 입니다. 

끝으로, 이 노력의 영감이 된 React 커뮤니티에 감사드립니다. 여러분은 우리가 이 일을 하는 이유이며, 새로운 문서가 여러분이 원하는 어떤 사용자 인터페이스든 React를 사용하여 구현하는 데 도움이 되길 바랍니다.
