---
title: '자습서: 틱택토 게임'
---

<Intro>

이 자습서에서는 작은 틱택토 게임을 만들어 볼 것입니다. 이 자습서는 현재 사용되는 React 지식을 전제로 하지 않습니다. 이 자습서에서 배우게 될 기술은 모든 React 앱을 만드는데 기본이 되는 기술이며 이 기술을 완전히 이해하면 React에 대해 깊게 이해할 수 있습니다.

</Intro>

<Note>

이 자습서는 **직접 해보면서 배우는 것**을 선호하고, 빠르게 무언가를 만들어 보고 싶은 분들을 위해 설계되었습니다.
각 개념을 단계별로 학습하는 것을 선호한다면 [UI 표현하기](/learn/describing-the-ui)부터 시작하세요.

</Note>

자습서는 아래와 같이 몇 가지 부문으로 나뉩니다.

- [자습서 환경설정](#setup-for-the-tutorial)은 자습서를 따를 수 있는 **시작점**을 제공합니다.
- [개요](#overview)에서는 React의 **핵심**(컴포넌트, props, state)을 배울 수 있습니다.
- [게임 완료하기](#completing-the-game)에서는 React 개발에서 **가장 흔히 쓰이는 기술**을 배울 수 있습니다.
- [시간여행 추가하기](#adding-time-travel)에서는 React의 고유한 강점에 대해 **더 깊은 통찰력**을 얻을 수 있습니다.

### 무엇을 만들까요? {/*what-are-you-building*/}

이 자습서에서는 React로 상호작용하는 틱택토 게임을 만들어 볼 것입니다.

완성하면 어떤 모습인지 아래에서 확인해 보세요.

<Sandpack>

```js src/App.js
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
  const [history, setHistory] = useState(() => [Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    if (currentMove === nextMove) {
      return;
    }
    
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

```css src/styles.css
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

코드가 아직 이해되지 않거나 문법이 익숙하지 않더라도 걱정하지 마세요! 이 자습서의 목표는 React와 그 문법을 이해하는 데 도움을 주는 것입니다.

자습서를 계속하기 전에 위의 틱택토 게임을 확인하세요. 눈에 띄는 기능 중 하나는 보드 오른쪽의 번호가 있는 목록입니다. 이 목록은 게임에서 발생한 모든 움직임의 기록을 제공하며 게임이 진행됨에 따라 업데이트됩니다.

완성된 틱택토 게임을 플레이해 보셨다면 계속 진행하세요. 자습서는 더 간단한 템플릿에서 시작할 것입니다. 다음 단계는 게임 만들기를 시작하기 위한 설정을 다룹니다.

## 자습서 환경설정 {/*setup-for-the-tutorial*/}

아래의 실시간 코드 편집기에서 오른쪽 위의 **Fork** 버튼을 클릭하여 새 탭에서 CodeSandBox 편집기를 열어주세요. CodeSandBox를 사용하면 브라우저에서 코드를 작성할 수 있으며 사용자가 만든 앱이 어떻게 보이는지 즉시 확인할 수 있습니다. 새 탭에는 텅 빈 사각형과 이 자습서의 시작 코드가 표시되어야 합니다.

<Sandpack>

```js src/App.js
export default function Square() {
  return <button className="square">X</button>;
}
```

```css src/styles.css
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

<Note>

로컬 개발 환경을 사용하여 이 자습서를 진행할 수도 있습니다. 로컬 환경에서 진행을 원한다면 아래와 같이 수행하세요.

<<<<<<< HEAD
1. [Node.js](https://nodejs.org/ko/)를 설치하세요.
1. 앞서 열었던 CodeSandBox 탭에서 왼쪽 위 모서리의 버튼을 누르고 메뉴를 열어 **File > Export to ZIP**을 선택하여 보관된 파일을 로컬로 내려받으세요.
1. 파일의 압축을 풀고, 터미널을 열어 `cd` 명령어로 압축을 푼 디렉터리로 이동하세요.
1. `npm install` 명령어를 실행하여 의존성을 설치하세요.
1. `npm start` 명령어를 실행하여 로컬 서버를 시작하고 프롬프트에 따라 브라우저에서 실행 중인 코드를 확인하세요.
=======
1. Install [Node.js](https://nodejs.org/en/)
1. In the CodeSandbox tab you opened earlier, press the top-left corner button to open the menu, and then choose **Download Sandbox** in that menu to download an archive of the files locally
1. Unzip the archive, then open a terminal and `cd` to the directory you unzipped
1. Install the dependencies with `npm install`
1. Run `npm start` to start a local server and follow the prompts to view the code running in a browser
>>>>>>> 2372ecf920ac4cda7c900f9ac7f9c0cd4284f281

문제가 생기더라도 좌절하지 마세요! 로컬 환경 대신 온라인에서 자습서를 진행하시고 로컬 설정은 나중에 다시 시도하세요.

</Note>

## 개요 {/*overview*/}

이제 환경 설정이 완료되었으니, React의 개요를 살펴보겠습니다!

### 초기 코드 살펴보기 {/*inspecting-the-starter-code*/}

CodeSandBox에는 세 가지 주요 구역이 있습니다.

![CodeSandBox의 초기 코드](../images/tutorial/react-starter-code-codesandbox.png)

1. `App.js`, `index.js`, `style.css` 와 같은 파일 목록과 `public` 폴더가 있는 _파일_ 구역
1. 선택한 파일의 소스 코드를 볼 수 있는 _코드 편집기_
1. 작성한 코드가 어떻게 보이는지 확인할 수 있는 _브라우저_ 구역

_파일_ 구역에서 `App.js` 파일을 선택하세요. _코드 편집기_ 에서 해당 파일의 내용이 있어야 합니다.

```jsx
export default function Square() {
  return <button className="square">X</button>;
}
```

_브라우저_ 구역에 아래와 같이 X가 있는 사각형이 표시되어야 합니다.

![x가 채워진 사각형](../images/tutorial/x-filled-square.png)

이제 초기 코드의 파일을 살펴보겠습니다.

#### `App.js` {/*appjs*/}

`App.js`의 코드는 _컴포넌트_ 를 생성합니다. React에서 컴포넌트는 사용자 인터페이스 일부를 표시하는 재사용 가능한 코드의 조각입니다. 컴포넌트는 애플리케이션의 UI 엘리먼트를 렌더링, 관리, 업데이트할 때 사용합니다. 컴포넌트를 한 줄씩 살펴보면서 무슨 일이 일어나는지 알아보겠습니다.

```js {1}
export default function Square() {
  return <button className="square">X</button>;
}
```

첫 번째 줄은 `Square` 함수를 정의합니다. JavaScript의 `export` 키워드는 이 함수를 파일 외부에서 접근할 수 있도록 만들어 줍니다. `default` 키워드는 코드를 사용하는 다른 파일에서 이 함수가 파일의 주요 함수임을 알려줍니다.

```js {2}
export default function Square() {
  return <button className="square">X</button>;
}
```

두 번째 줄은 버튼을 반환합니다. JavaScript의 `return` 키워드는 해당 키워드 뒤에 오는 모든 것이 함수 호출자에게 값으로 반환됨을 의미합니다. `<button>`은 *JSX 엘리먼트*입니다. JSX 엘리먼트는 JavaScript 코드와 HTML 태그의 조합으로 표시할 내용을 설명합니다. `className="square"`는 버튼 *prop* 또는 프로퍼티로, CSS에 버튼의 스타일을 지정하는 방법을 알려줍니다. `X`는 버튼 내부에 표시되는 텍스트이며, `</button>`은 JSX 엘리먼트를 닫아 버튼 내부에 다음 콘텐츠를 배치해서는 안 됨을 나타냅니다.
#### `styles.css` {/*stylescss*/}

CodeSandBox의 _파일_ 구역에서 `styles.css` 파일을 여세요. 이 파일은 React 앱의 스타일을 정의합니다. 처음 두 개의 _CSS 선택자_ 인 `*`와 `body`는 앱 대부분의 스타일을 정의하고, `.square` 선택자는 className 프로퍼티가 `square`로 설정된 모든 컴포넌트의 스타일을 정의합니다. 초기 코드에서는 `App.js` 파일의 Square 컴포넌트의 버튼과 매치됩니다.

#### `index.js` {/*indexjs*/}

CodeSandBox의 _파일_ 구역에서 `index.js` 파일을 여세요. 자습서를 진행하는 중에는 이 파일을 편집하지 않지만, 이 파일은 `App.js` 파일에서 만든 컴포넌트와 웹 브라우저 사이의 다리 역할을 합니다.

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';
```

<<<<<<< HEAD
1~5줄은 아래에 있는 필요한 모든 코드를 한 곳으로 가져옵니다.
=======
Lines 1-5 bring all the necessary pieces together: 
>>>>>>> 2372ecf920ac4cda7c900f9ac7f9c0cd4284f281

* React
* 웹 브라우저와 상호작용하는 React의 라이브러리 (React DOM)
* 컴포넌트의 스타일
* `App.js`에서 만든 컴포넌트

파일의 나머지 코드는 모든 코드를 한데 모아 최종 결과물을 `public` 폴더의 `index.html`에 주입합니다.

### 보드 만들기 {/*building-the-board*/}

`App.js`로 돌아가서 자습서의 나머지 부분을 진행하겠습니다.

현재 보드에는 사각형이 하나뿐이지만 게임을 진행하려면 9개가 필요합니다. 간단하게 사각형을 복사해서 붙여 넣어 보면 아래처럼 두 개의 사각형을 만들 수 있습니다.

```js {2}
export default function Square() {
  return <button className="square">X</button><button className="square">X</button>;
}
```

하지만 다음과 같은 오류가 발생합니다.

<ConsoleBlock level="error">

/src/App.js: Adjacent JSX elements must be wrapped in an enclosing tag. Did you want a JSX Fragment `<>...</>`?

</ConsoleBlock>

React 컴포넌트는 두 개의 버튼처럼 인접한 여러 개의 JSX 엘리먼트가 아닌 단일 JSX 엘리먼트를 반환해야 합니다. 이 오류는 *Fragments*(`<>` 와 `</>`)를 사용하여 다음과 같이 여러 개의 인접한 JSX 엘리먼트를 감싸 해결할 수 있습니다.

```js {3-6}
export default function Square() {
  return (
    <>
      <button className="square">X</button>
      <button className="square">X</button>
    </>
  );
}
```

이제 사각형이 두 개가 되었습니다.

![두개의 X가 채워진 사각형](../images/tutorial/two-x-filled-squares.png)

훌륭합니다! 이제 간단히 복사-붙여넣기 몇 번만 하면 9개의 사각형을 만들 수 있습니다.

![한 줄에 X가 채워진 9개의 사각형](../images/tutorial/nine-x-filled-squares.png)

이런! 사각형이 보드에 필요한 격자 모양이 아니라 한 줄로 되어있습니다. 이 문제를 해결하려면 `div`를 사용하여 사각형을 행으로 그룹화하고 몇 가지 CSS 클래스를 추가해야 합니다. 이 과정에서 각 사각형에 번호를 부여하여 표시되는 위치를 알 수 있게 하겠습니다.

`App.js` 파일에서 `Square` 컴포넌트를 다음과 같이 업데이트하세요.

```js {3-19}
export default function Square() {
  return (
    <>
      <div className="board-row">
        <button className="square">1</button>
        <button className="square">2</button>
        <button className="square">3</button>
      </div>
      <div className="board-row">
        <button className="square">4</button>
        <button className="square">5</button>
        <button className="square">6</button>
      </div>
      <div className="board-row">
        <button className="square">7</button>
        <button className="square">8</button>
        <button className="square">9</button>
      </div>
    </>
  );
}
```

`styles.css` 에 정의된 CSS는 `board-row`라는 `className`으로 지정된 div를 스타일 합니다. 이제 스타일된 div를 사용하여 컴포넌트를 행으로 그룹화하여 틱택토 보드를 완성하겠습니다.

![1부터 9까지의 숫자가 채워진 틱택토 보드](../images/tutorial/number-filled-board.png)

하지만 문제가 있습니다. `Square`로 이름 지어진 컴포넌트가 더 이상 하나의 사각형이 아닙니다. 이 문제를 수정하기 위해 `Board`로 이름을 변경하겠습니다.

```js {1}
export default function Board() {
  //...
}
```

이 시점에서 코드는 다음과 같아야 합니다.

<Sandpack>

```js
export default function Board() {
  return (
    <>
      <div className="board-row">
        <button className="square">1</button>
        <button className="square">2</button>
        <button className="square">3</button>
      </div>
      <div className="board-row">
        <button className="square">4</button>
        <button className="square">5</button>
        <button className="square">6</button>
      </div>
      <div className="board-row">
        <button className="square">7</button>
        <button className="square">8</button>
        <button className="square">9</button>
      </div>
    </>
  );
}
```

```css src/styles.css
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

<Note>

어휴… 입력할 내용이 많네요! 이 페이지에서 코드를 복사하여 붙여 넣어도 괜찮습니다. 하지만 조금 더 도전해 보고 싶다면 코드를 스스로 작성하고, 스스로 작성한 코드만 복사하는 것을 권장합니다.

</Note>

### props를 통해 데이터 전달하기 {/*passing-data-through-props*/}

다음으로 사용자가 사각형을 클릭할 때 사각형의 값을 비어있는 상태에서 “X”로 변경해야 합니다. 조금 전 보드를 만들었던 방법으로는 사각형을 변경하는 코드를 9번 (각 사각형당 한번) 복사해서 붙여 넣어야 합니다! 복사-붙여넣기 대신 React의 컴포넌트 아키텍처를 사용하면 재사용할 수 있는 컴포넌트를 만들어서 지저분하고 중복된 코드를 피할 수 있습니다.

먼저 `Board` 컴포넌트에서 첫 번째 사각형을 정의하는 줄(`<button className="square">1</button>`)을 새 `Square` 컴포넌트로 복사하세요.

```js {1-3}
function Square() {
  return <button className="square">1</button>;
}

export default function Board() {
  // ...
}
```

다음으로, Board 컴포넌트를 JSX 문법을 사용하여 해당 `Square` 컴포넌트를 렌더링하도록 수정하세요.

```js {5-19}
// ...
export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
}
```

브라우저의 `div`와 달리, 직접 만든 `Board`와 `Square` 컴포넌트는 반드시 대문자로 시작해야 한다는 점에 유의하세요.

보드를 살펴보겠습니다.

![1로 채워진 보드](../images/tutorial/board-filled-with-ones.png)

이런! 이전에 가지고 있던 번호가 채워진 사각형이 사라졌습니다. 이제 각 사각형은 “1”로 표시됩니다. 이 문제를 해결하기 위해 *props*를 사용하여 각 사각형이 가져야 할 값을 부모 컴포넌트(`Board`)에서 자식 컴포넌트(`Square`)로 전달하겠습니다.

`Square` 컴포넌트를 `Board`에서 전달할 prop `value`를 읽도록 수정하세요.

```js {1}
function Square({ value }) {
  return <button className="square">1</button>;
}
```

`function Square({ value })`는 사각형 컴포넌트에 `value` prop를 전달할 수 있음을 나타냅니다. 

이제 모든 사각형에 `1` 대신 `value`를 표시하겠습니다. 아래와 같이 해보세요.

```js {2}
function Square({ value }) {
  return <button className="square">value</button>;
}
```

이런, 원하던 것과는 다른 결과입니다.

![value로 채워진 보드](../images/tutorial/board-filled-with-value.png)

컴포넌트에서 단어 “value”가 아닌 JavaScript 변수 `value`가 렌더링 되어야 합니다. JSX에서 “JavaScript로 탈출”하려면, 중괄호가 필요합니다. JSX에서 `value` 주위에 중괄호를 다음과 같이 추가하세요.

```js {2}
function Square({ value }) {
  return <button className="square">{value}</button>;
}
```

지금은 빈 보드가 표시되어야 합니다.

![비어있는 보드](../images/tutorial/empty-board.png)

보드가 비어있는 이유는 `Board` 컴포넌트가 렌더링하는 각 `Square` 컴포넌트에 아직 `value` prop를 전달하지 않았기 때문입니다. 이 문제를 해결하기 위해 `Board` 컴포넌트가 렌더링하는 각 `Square` 컴포넌트에 `value` prop를 추가하겠습니다.

```js {5-7,10-12,15-17}
export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square value="1" />
        <Square value="2" />
        <Square value="3" />
      </div>
      <div className="board-row">
        <Square value="4" />
        <Square value="5" />
        <Square value="6" />
      </div>
      <div className="board-row">
        <Square value="7" />
        <Square value="8" />
        <Square value="9" />
      </div>
    </>
  );
}
```

이제 숫자가 있는 보드가 다시 표시됩니다.

![1부터 9까지의 숫자로 채워진 틱택토 보드](../images/tutorial/number-filled-board.png)

수정된 코드는 다음과 같습니다.

<Sandpack>

```js src/App.js
function Square({ value }) {
  return <button className="square">{value}</button>;
}

export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square value="1" />
        <Square value="2" />
        <Square value="3" />
      </div>
      <div className="board-row">
        <Square value="4" />
        <Square value="5" />
        <Square value="6" />
      </div>
      <div className="board-row">
        <Square value="7" />
        <Square value="8" />
        <Square value="9" />
      </div>
    </>
  );
}
```

```css src/styles.css
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

### 사용자와 상호작용하는 컴포넌트 만들기 {/*making-an-interactive-component*/}

이제 `Square` 컴포넌트를 클릭하면 `X`로 채워보겠습니다. `Square` 내부에 `handleClick` 함수를 선언하세요. 그런 다음 `Square` 컴포넌트에서 반환된 JSX 버튼의 props에 `onClick`을 추가하세요.

```js {2-4,9}
function Square({ value }) {
  function handleClick() {
    console.log('clicked!');
  }

  return (
    <button
      className="square"
      onClick={handleClick}
    >
      {value}
    </button>
  );
}
```

이제 사각형을 클릭하면, CodeSandBox의 _브라우저_ 구역에 있는 _콘솔_ 탭에 `"clicked!"` 라는 로그가 표시됩니다. 사각형을 한 번 더 클릭하면 `"clicked!"` 라는 로그가 다시 생성됩니다. 같은 메시지가 포함된 콘솔 로그를 반복해도 콘솔에 더 많은 줄이 생기지 않습니다. 대신 첫 번째 `"clicked!"` 로그 옆의 숫자가 증가하는 것을 볼 수 있습니다.

<Note>

만약 로컬 개발 환경을 사용하여 이 자습서를 진행한다면, 브라우저의 콘솔을 열어야 합니다. 예를 들어, Chrome 브라우저를 사용하는 경우, 키보드 단축키 **Shift + Ctrl + J** (Windows/Linux 환경) 또는 **Option + ⌘ + J** (macOS 환경)를 사용하여 콘솔을 볼 수 있습니다.

</Note>

다음으로 사각형 컴포넌트가 클릭 된 것을 “기억”하고 “X” 표시로 채워보겠습니다. 컴포넌트는 무언가 “기억”하기 위해 *state*를 사용합니다.

React는 컴포넌트에서 호출하여 무언가를 “기억”할 수 있는 `useState`라는 특별한 함수를 제공합니다. `Square`의 현재 값을 state에 저장하고 `Square`가 클릭 되면 값을 변경해 보도록 하겠습니다.

파일 상단에서 `useState`를 불러오세요. `Square` 컴포넌트에서 value prop을 제거하는 대신, `Square` 컴포넌트의 시작 부분에 `useState`를 호출하는 새 줄을 추가하고 `value`라는 이름의 state 변수를 반환하도록 하세요.

```js {1,3,4}
import { useState } from 'react';

function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    //...
```

`value`는 값을 저장하고 `setValue`는 값을 변경하는 데 사용하는 함수입니다. `useState`에 전달된 `null`은 이 state 변수의 초깃값으로 사용되므로 현재 `value`는 `null`과 같습니다.

`Square` 컴포넌트는 더 이상 props를 허용하지 않으므로 보드 컴포넌트가 생성한 9개의 사각형 컴포넌트에서 `value` prop를 제거하세요.

```js {6-8,11-13,16-18}
// ...
export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
}
```

이제 `Square`가 클릭 되었을 때 “X”를 표시하도록 변경하겠습니다. `console.log("clicked!");` 이벤트 핸들러를 `setValue('X');`로 변경하세요. 이제 `Square` 컴포넌트는 다음과 같습니다.

```js {5}
function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    setValue('X');
  }

  return (
    <button
      className="square"
      onClick={handleClick}
    >
      {value}
    </button>
  );
}
```

`onClick` 핸들러에서 `set` 함수를 호출함으로써 React에 `<button>`이 클릭 될 때마다 `Square`를 다시 렌더링하도록 했습니다. 업데이트 후 `Square`의 `value`는 `'X'`가 되므로, 앞으로 보드에서 `“X”`를 볼 수 있습니다. 사각형을 클릭하면 “X”가 표시됩니다.

![보드에 x를 추가하기](../images/tutorial/tictac-adding-x-s.gif)

각 사각형에는 고유한 state가 있습니다. 각 사각형에 저장된 `value`는 다른 사각형과 완전히 독립적입니다. 컴포넌트에서 `set` 함수를 호출하면 React는 그 안에 있는 자식 컴포넌트도 자동으로 업데이트합니다.

위의 변경 사항을 적용한 코드는 다음과 같습니다.

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    setValue('X');
  }

  return (
    <button
      className="square"
      onClick={handleClick}
    >
      {value}
    </button>
  );
}

export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
}
```

```css src/styles.css
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

### React 개발자 도구 {/*react-developer-tools*/}

React 개발자 도구를 사용하면 React 컴포넌트의 props와 state를 확인할 수 있습니다. CodeSandBox의 _브라우저_ 구역 하단에서 React 개발자 도구 탭을 찾을 수 있습니다.

![CodeSandbox의 React 개발자 도구](../images/tutorial/codesandbox-devtools.png)

화면에서 특정 컴포넌트를 검사하려면 React 개발자 도구의 왼쪽 위 모서리에 있는 버튼을 사용하세요.

![React 개발자 도구로 페이지의 컴포넌트 선택하기](../images/tutorial/devtools-select.gif)

<Note>

로컬 환경에서 개발하는 경우, React 개발자 도구는 [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en), [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/), 그리고 [Edge](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil) 브라우저의 확장 프로그램으로 사용할 수 있습니다. 설치 후 브라우저 개발자 도구에 React를 사용하는 사이트를 위한 *Components* 탭이 나타납니다.

</Note>

## 게임 완료하기 {/*completing-the-game*/}

이제 틱택토 게임을 위한 기본적인 구성 요소는 모두 갖추었습니다. 게임을 완성하기 위해서는 보드에 “X”와 “O”를 번갈아 배치해야 하며, 승자를 결정할 방법이 필요합니다.

### state 끌어올리기 {/*lifting-state-up*/}

현재 각 `Square` 컴포넌트는 게임 state의 일부를 유지합니다. 틱택토 게임에서 승자를 확인하려면 `Board`가 9개의 `Square` 컴포넌트 각각의 state를 어떻게든 알고 있어야 합니다.

어떻게 접근하는 것이 좋을까요? `Board`가 각각의 `Square`에 해당 `Square`의 state를 “요청”해야 한다고 생각해 보겠습니다. 이 접근 방식은 React에서 기술적으로는 가능하지만, 코드가 이해하기 어렵고 버그에 취약하며 리팩토링하기 어렵기 때문에 권장하지 않습니다. 가장 좋은 접근 방식은 게임의 state를 각 `Square`가 아닌 부모 `Board` 컴포넌트에 저장하는 것입니다. `Board` 컴포넌트는 각 사각형에 숫자를 전달했을 때와 같이 prop를 전달하여 각 Square에 표시할 내용을 정할 수 있습니다.

**여러 자식 컴포넌트에서 데이터를 수집하거나 두 자식 컴포넌트가 서로 통신하도록 하려면, 부모 컴포넌트에서 공유 state를 선언하세요. 부모 컴포넌트는 props를 통해 해당 state를 자식 컴포넌트에 전달할 수 있습니다. 이렇게 하면 자식 컴포넌트가 서로 동기화되고 부모 컴포넌트와도 동기화되도록 유지할 수 있습니다.**

React 컴포넌트를 리팩토링할 때 부모 컴포넌트로 state를 끌어올리는 것은 흔히 쓰이는 방법입니다.

이번 기회에 직접 사용해 보도록 하겠습니다. `Board` 컴포넌트를 편집하여 9개 사각형에 해당하는 9개의 null의 배열을 기본값으로 하는 state 변수 `squares`를 선언하세요.

```js {3}
// ...
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    // ...
  );
}
```

`Array(9).fill(null)`은 9개의 엘리먼트로 배열을 생성하고 각 엘리먼트를 `null`로 설정합니다. 그 주위에 있는 `useState()` 호출은 처음에 해당 배열로 설정된  state 변수 `squares`를 선언합니다. 배열의 각 항목은 사각형의 값에 해당합니다. 나중에 보드를 채우면, `squares` 배열은 다음과 같은 모양이 됩니다.

```jsx
['O', null, 'X', 'X', 'X', 'O', 'O', null, null]
```

이제 `Board` 컴포넌트는 렌더링하는 각 `Square` 컴포넌트에 `value` prop를 전달해야 합니다.

```js {6-8,11-13,16-18}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} />
        <Square value={squares[1]} />
        <Square value={squares[2]} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} />
        <Square value={squares[4]} />
        <Square value={squares[5]} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} />
        <Square value={squares[7]} />
        <Square value={squares[8]} />
      </div>
    </>
  );
}
```

다음으로 보드 컴포넌트에서 각 `value` prop를 받을 수 있도록 `Square` 컴포넌트를 수정하겠습니다. 이를 위해 사각형 컴포넌트에서 `value`의 상태 추적과 버튼의 `onClick` prop를 제거해야 합니다.

```js {1,2}
function Square({value}) {
  return <button className="square">{value}</button>;
}
```

이때의 보드는 텅 비어있습니다.

![텅 빈 보드](../images/tutorial/empty-board.png)

코드는 다음과 같습니다.

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value }) {
  return <button className="square">{value}</button>;
}

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} />
        <Square value={squares[1]} />
        <Square value={squares[2]} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} />
        <Square value={squares[4]} />
        <Square value={squares[5]} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} />
        <Square value={squares[7]} />
        <Square value={squares[8]} />
      </div>
    </>
  );
}
```

```css src/styles.css
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

이제 각 사각형은 `'X'` , `'O'` , 또는 빈 사각형의 경우 `null`이 되는 `value` prop를 받습니다.

다음으로 `Square`가 클릭 되었을 때 발생하는 동작을 변경하겠습니다. 이제 `Board` 컴포넌트가 어떤 사각형이 채워졌는지를 관리하므로 `Square`가 `Board`의 state를 업데이트할 방법을 만들어야 합니다. 컴포넌트는 자신이 정의한 state에만 접근할 수 있으므로 `Square`에서 `Board`의 state를 직접 변경할 수 없습니다.

대신에 `Board` 컴포넌트에서 `Square` 컴포넌트로 함수를 전달하고 사각형이 클릭 될 때 `Square` 가 해당 함수를 호출하도록 할 수 있습니다. `Square` 컴포넌트가 클릭 될 때 호출할 함수부터 시작하겠습니다. `onSquareClick`으로 해당 함수를 호출하세요.

```js {3}
function Square({ value }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}
```

다음으로, `Square` 컴포넌트의 props에 `onSquareClick` 함수를 추가하세요.

```js {1}
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}
```

이제 `onSquareClick` prop을 `Board` 컴포넌트의 `handleClick` 함수와 연결하세요. `onSquareClick` 함수를 `handleClick`과 연결하려면 첫 번째 `Square` 컴포넌트의 `onSquareClick` prop에 해당 함수를 전달하면 됩니다.

```js {7}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={handleClick} />
        //...
  );
}
```

마지막으로 보드 컴포넌트 내부에 `handleClick` 함수를 정의하여 보드의 state를 담고 있는 `squares` 배열을 업데이트하세요.

```js {4-8}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick() {
    const nextSquares = squares.slice();
    nextSquares[0] = "X";
    setSquares(nextSquares);
  }

  return (
    // ...
  )
}
```

`handleClick` 함수는 JavaScript의 `slice()` 배열 메서드를 사용하여 `squares` 배열의 사본 `nextSquares`를 생성합니다. 그런 다음 `handleClick` 함수는 `nextSquares` 배열의 첫 번째 사각형(인덱스 `[0]`)에 `X`를 추가하여 업데이트합니다.

`setSquares` 함수를 호출하면 React는 컴포넌트의 state가 변경되었음을 알 수 있습니다. 그러면 `squares`의 state를 사용하는 컴포넌트(`Board`)와 그 하위 컴포넌트(보드를 구성하는 `Square` 컴포넌트)가 다시 렌더링 됩니다.

<Note>

JavaScript는 [클로저](https://developer.mozilla.org/ko/docs/Web/JavaScript/Closures)를 지원하므로 내부 함수가(예: `handleClick`) 외부 함수(예: `Board`)에 정의된 변수 및 함수에 접근할 수 있습니다. `handleClick` 함수는 `squares`의 state를 읽고 `setSquares` 메서드를 호출할 수 있는데, 이 두 함수는 `Board` 함수 내부에 정의되어 있기 때문입니다.

</Note>

이제 보드에 X를 추가할 수 있게 되었지만 가능한 건 오직 왼쪽 위 사각형뿐입니다. `handleClick` 함수는 왼쪽 위 사각형(인덱스 `0`)만 업데이트하도록 하드 코딩되어 있습니다. 모든 사각형을 업데이트할 수 있도록 `handleClick` 함수를 수정하겠습니다. `handleClick` 함수에 업데이트할 사각형의 인덱스를 나타내는 인수 `i`를 추가하세요.

```js {4,6}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    nextSquares[i] = "X";
    setSquares(nextSquares);
  }

  return (
    // ...
  )
}
```

다음으로 인수 `i`를 `handleClick`에 전달해야 합니다. 사각형의 `onSquareClick` prop를 아래와 같이 JSX에서 직접 `handleClick(0)`으로 설정할 수도 있지만 이 방법은 작동하지 않습니다.

```jsx
<Square value={squares[0]} onSquareClick={handleClick(0)} />
```

이유는 다음과 같습니다. `handleClick(0)` 호출은 보드 컴포넌트 렌더링의 일부가 됩니다. `handleClick(0)`은 `setSquares`를 호출하여 보드 컴포넌트의 state를 변경하기 때문에 보드 컴포넌트 전체가 다시 렌더링 됩니다. 하지만 이 과정에서 `handleClick(0)`은 다시 실행되기 때문에 무한 루프에 빠지게 됩니다.

<ConsoleBlock level="error">

Too many re-renders. React limits the number of renders to prevent an infinite loop.

</ConsoleBlock>

왜 이러한 문제가 더 일찍 발생하지 않았을까요?

이전에 `onSquareClick={handleClick}`을 전달할 땐 함수를 *호출*한 것이 아니라 `handleClick` 함수를 prop로 전달했기 때문입니다. 하지만 지금은 `handleClick(0)`의 괄호를 보면 알 수 있듯이 해당 함수를 호출하고 있으므로 해당 함수가 너무 일찍 실행됩니다. 사용자가 클릭하기 전까지 `handleClick` 함수를 호출하면 *안 됩*니다!

이 문제를 해결하려면 `handleClick(0)`을 호출하는 `handleFirstSquareClick` 함수를 만들고, `handleClick(1)`을 호출하는 `handleSecondSquareClick`을 만들고… 계속해서 만들면 됩니다. 그리고 아까와 같이 호출하는 대신 `onSquareClick={handleFirstSquareClick}`와 같은 함수를 prop로 전달 해 주면 됩니다. 이렇게 하면 무한 루프를 해결할 수 있습니다.

하지만 9개의 서로 다른 함수를 정의하고 각각에 이름을 붙이는 것은 너무 장황합니다. 대신 이렇게 해보겠습니다.

```js {6}
export default function Board() {
  // ...
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        // ...
  );
}
```

새로운 문법 `() =>`에 주목하세요. 여기서 `() => handleClick(0)`은 *화살표 함수*로, 함수를 짧게 정의하는 방법입니다. 사각형이 클릭 되면 `=>` “화살표” 뒤의 코드가 실행되어 `handleClick(0)`을 호출합니다.

이제 전달한 화살표 함수에서 `handleClick`을 호출하도록 나머지 8개의 사각형 컴포넌트를 수정해야 합니다. `handleClick`을 호출할 때 인수가 올바른 사각형의 인덱스에 해당하는지 확인하세요.

```js {6-8,11-13,16-18}
export default function Board() {
  // ...
  return (
    <>
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
};
```

이제 보드의 사각형을 클릭하여 X를 다시 추가할 수 있습니다.

![보드를 X로 채우기](../images/tutorial/tictac-adding-x-s.gif)

하지만 이번에는 모든 state 관리가 사각형이 아닌 `Board` 컴포넌트에서 처리됩니다!

코드는 다음과 같습니다.

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    nextSquares[i] = 'X';
    setSquares(nextSquares);
  }

  return (
    <>
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
```

```css src/styles.css
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

이제 `Board`가 모든 state를 관리하므로 부모 `Board` 컴포넌트는 자식 `Square` 컴포넌트가 올바르게 표시될 수 있도록 props를 전달합니다. `Square`를 클릭하면 자식 `Square` 컴포넌트가 부모 `Board` 컴포넌트에 보드의 state를 업데이트하도록 요청합니다. `Board`의 state가 변경되면 `Board` 컴포넌트와 모든 자식 `Square` 컴포넌트가 자동으로 다시 렌더링 됩니다. `Board` 컴포넌트에 속한 모든 사각형의 state를 유지하면 나중에 승자를 결정할 수 있습니다.

사용자가 보드의 왼쪽 위 사각형을 클릭하여 `X`를 추가하면 어떤 일이 발생하는지 다시 한번 정리해 보겠습니다.

1. 왼쪽 위 사각형을 클릭하면 `button`이 `Square`로부터 `onClick` prop로 받은 함수가 실행됩니다. `Square` 컴포넌트는 보드에서 해당 함수를 `onSquareClick` props로 받았습니다. `Board` 컴포넌트는 JSX에서 해당 함수를 직접 정의했습니다. 이 함수는 `0`을 인수로 `handleClick`을 호출합니다.
1. `handleClick`은 인수 `0`을 사용하여 `squares` 배열의 첫 번째 엘리먼트를 `null`에서 `X`로 업데이트합니다.
1. `Board` 컴포넌트의 `squares` state가 업데이트되어 `Board`와 그 모든 자식이 다시 렌더링 됩니다. 이에 따라 인덱스가 `0`인 `Square` 컴포넌트의 `value` prop가 `null`에서 `X`로 변경됩니다.

최종적으로 사용자는 왼쪽 위 사각형을 클릭한 후 비어있는 사각형이 `X`로 변경된 것을 확인할 수 있습니다.

<Note>

DOM `<button>` 엘리먼트의 `onClick` 어트리뷰트는 빌트인 컴포넌트이기 때문에 React에서 특별한 의미를 갖습니다. 사용자 정의 컴포넌트, 예를 들어 사각형의 경우 이름은 사용자가 원하는 대로 지을 수 있습니다. `Square`의 `onSquareClick` prop나 `Board`의 `handleClick` 함수에 어떠한 이름을 붙여도 코드는 동일하게 작동합니다. React에서는 주로 이벤트를 나타내는 prop에는 `onSomething`과 같은 이름을 사용하고, 이벤트를 처리하는 함수를 정의 할 때는 `handleSomething`과 같은 이름을 사용합니다.

</Note>

### 불변성이 왜 중요할까요 {/*why-immutability-is-important*/}

`handleClick`에서 기존 배열을 수정하는 대신 `.slice()`를 호출하여 `squares` 배열의 사본을 생성하는 방법에 주목하세요. 그 이유를 설명하기 위해 불변성과 불변성을 배우는 것이 중요한 이유에 대해 논의해 보겠습니다.

일반적으로 데이터를 변경하는 방법에는 두 가지가 있습니다. 첫 번째 방법은 데이터의 값을 직접 변경하여 데이터를 _변형_ 하는 것입니다. 두 번째 방법은 원하는 변경 사항이 있는 새 복사본으로 데이터를 대체하는 것입니다. 다음은 `squares` 배열을 변형한 경우의 모습입니다.

```jsx
const squares = [null, null, null, null, null, null, null, null, null];
squares[0] = 'X';
// Now `squares` is ["X", null, null, null, null, null, null, null, null];
```

그리고 아래는 `squares` 배열을 변형하지 않고 데이터를 변경한 경우의 모습입니다.

```jsx
const squares = [null, null, null, null, null, null, null, null, null];
const nextSquares = ['X', null, null, null, null, null, null, null, null];
// Now `squares` is unchanged, but `nextSquares` first element is 'X' rather than `null`
```

최종 결과는 같지만, 원본 데이터를 직접 변형하지 않음으로써 몇 가지 이점을 얻을 수 있습니다.

불변성을 사용하면 복잡한 기능을 훨씬 쉽게 구현할 수 있습니다. 우리는 이 자습서의 뒷부분에서 게임의 진행 과정을 검토하고 과거 움직임으로 “돌아가기”를 할 수 있는 “시간 여행” 기능을 구현할 예정입니다. 특정 작업을 실행 취소하고 다시 실행하는 기능은 이 게임에만 국한된 것이 아닌 앱의 일반적인 요구사항입니다. 직접적인 데이터 변경을 피하면 이전 버전의 데이터를 그대로 유지하여 나중에 재사용(또는 초기화)할 수 있습니다.

불변성을 사용하는 것의 또 다른 장점이 있습니다. 기본적으로 부모 컴포넌트의 state가 변경되면 모든 자식 컴포넌트가 자동으로 다시 렌더링 됩니다. 여기에는 변경 사항이 없는 자식 컴포넌트도 포함됩니다. 리렌더링 자체가 사용자에게 보이는 것은 아니지만 성능상의 이유로 트리의 영향을 받지 않는 부분의 리렌더링을 피하는 것이 좋습니다. 불변성을 사용하면 컴포넌트가 데이터의 변경 여부를 저렴한 비용으로 판단할 수 있습니다. [`memo` API 레퍼런스](/reference/react/memo)에서 React가 컴포넌트를 다시 렌더링할 시점을 선택하는 방법에 대해 살펴볼 수 있습니다.

### 순서 정하기 {/*taking-turns*/}

이제 이 틱택토 게임에서 가장 큰 결함인 “O”를 보드에 표시할 수 없다는 문제를 수정할 차례입니다.

기본적으로 첫 번째 이동을 “X”로 설정합니다. 이제 보드 컴포넌트에 또 다른 state를 추가하여 추적해 보겠습니다.

```js {2}
function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  // ...
}
```

플레이어가 움직일 때마다 다음 플레이어를 결정하기 위해 불리언 값인 `xIsNext`가 반전되고 게임의 state가 저장됩니다. `Board`의 `handleClick` 함수를 업데이트하여 `xIsNext`의 값을 반전시키세요.

```js {7,8,9,10,11,13}
export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  return (
    //...
  );
}
```

이제 다른 사각형을 클릭하면 정상적으로 `X`와 `O`가 번갈아 표시됩니다!

하지만 다른 문제가 발생했습니다. 같은 사각형을 여러 번 클릭해 보세요.

![O가 X를 덮어씁니다.](../images/tutorial/o-replaces-x.gif)

`O`가 `X`를 덮어씌웁니다! 이렇게 하면 게임이 좀 더 흥미로워질 수 있지만 지금은 원래의 규칙을 유지하겠습니다.

지금은 `X`와 `O`로 사각형을 표시할 때 먼저 해당 사각형에 이미 `X` 또는 `O`값이 있는지 확인하고 있지 않습니다. *일찍이 돌아와서* 이 문제를 해결하기 위해 사각형에 이미 `X`와 `O`가 있는지 확인하겠습니다. 사각형이 이미 채워져 있는 경우 보드의 state를 업데이트하기 전에 `handleClick` 함수에서 조기에 `return` 하겠습니다.

```js {2,3,4}
function handleClick(i) {
  if (squares[i]) {
    return;
  }
  const nextSquares = squares.slice();
  //...
}
```

이제 빈 사각형에 `X` 또는 `O`만 추가할 수 있습니다! 코드는 다음과 같습니다.

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    if (squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  return (
    <>
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
```

```css src/styles.css
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

### 승자 결정하기 {/*declaring-a-winner*/}

이제 어느 플레이어의 다음 차례인지 표시했으니, 게임의 승자가 결정되어 더 이상 차례를 만들 필요가 없을 때도 표시해야 합니다. 이를 위해 9개의 사각형 배열을 가져와서 승자를 확인하고 적절하게 `'X'` , `'O'` , 또는 `null`을 반환하는 도우미 함수 `calculateWinner`를 추가하겠습니다. `calculateWinner` 함수에 대해 너무 걱정하지 마세요. 이 함수는 React에서만 국한되는 함수가 아닙니다.

```js src/App.js
export default function Board() {
  //...
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
    [2, 4, 6]
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

<Note>

`calculateWinner` 함수를 `Board`의 앞에 정의하든 뒤에 정의하든 상관없습니다. 여기에선 컴포넌트를 편집할 때마다 편집기 상에서 스크롤 할 필요가 없도록 마지막에 배치하겠습니다.

</Note>

`Board` 컴포넌트의 `handleClick` 함수에서 `calculateWinner(squares)`를 호출하여 플레이어가 이겼는지 확인하세요. 이 검사는 사용자가 이미 `X` 또는 `O`가 있는 사각형을 클릭했는지를 확인하는 것과 동시에 수행할 수 있습니다. 두 경우 모두 함수를 조기 반환하겠습니다.

```js {2}
function handleClick(i) {
  if (squares[i] || calculateWinner(squares)) {
    return;
  }
  const nextSquares = squares.slice();
  //...
}
```

게임이 끝났을 때 플레이어에게 알리기 위해 “Winner: X” 또는 “Winner: O”라고 표시하겠습니다. 이렇게 하려면 `Board` 컴포넌트에 `status` 구역을 추가하면 됩니다. 게임이 끝나면 status는 승자를 표시하고 게임이 진행 중인 경우 다음 플레이어의 차례를 표시합니다.

```js {3-9,13}
export default function Board() {
  // ...
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        // ...
  )
}
```

축하합니다! 이제 제대로 작동하는 틱택토 게임을 만들었습니다. 그리고 방금 React의 기본도 배웠습니다. 그러니 여기서 진정한 승자는 바로 _여러분_ 입니다. 코드는 다음과 같습니다.

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

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
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
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

```css src/styles.css
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

## 시간여행 추가하기 {/*adding-time-travel*/}

마지막 연습으로 게임의 이전 동작으로 "시간을 거슬러 올라가는" 기능을 만들어 보겠습니다.

### 이동 히스토리 저장하기 {/*storing-a-history-of-moves*/}

`squares` 배열을 변형하면 시간 여행을 구현하기는 매우 어려울 것입니다.

하지만 우리는 `slice()`를 사용하여 매번 이동할 때마다 `squares` 배열의 새 복사본을 만들고 이를 불변으로 처리했습니다. 덕분에 `squares` 배열의 모든 과거 버전을 저장할 수 있고 이미 발생한 턴 사이를 탐색할 수 있습니다.

과거의 `squares` 배열을 `history`라는 다른 배열에 저장하고 이 배열을 새로운 state 변수로 저장하겠습니다. `history` 배열은 첫 번째 이동부터 마지막 이동까지 모든 보드 state를 나타내며 다음과 같은 모양을 갖습니다.

```jsx
[
  // Before first move
  [null, null, null, null, null, null, null, null, null],
  // After first move
  [null, null, null, null, 'X', null, null, null, null],
  // After second move
  [null, null, null, null, 'X', null, null, null, 'O'],
  // ...
]
```

### 한 번 더 state 끌어올리기 {/*lifting-state-up-again*/}

이제 과거 이동 목록을 표시하기 위해 새로운 최상위 컴포넌트 `Game`을 작성하세요. 여기에 전체 게임 기록을 포함하는 `history` state를 배치하겠습니다.

`history` state를 `Game` 컴포넌트에 배치하면 자식 `Board` 컴포넌트에서 `squares` state를 제거할 수 있습니다. `Square` 컴포넌트에서 `Board` 컴포넌트로 state를 “끌어올렸던” 것처럼, 이제 `Board` 컴포넌트에서 최상위 `Game` 컴포넌트로 state를 끌어올릴 수 있습니다. 이렇게 하면 `Game` 컴포넌트가 `Board` 컴포넌트의 데이터를 완전히 제어하고 `Board`의 `history`에서 이전 순서를 렌더링하도록 지시할 수 있습니다.

먼저 `export default`가 있는 `Game` 컴포넌트를 추가하세요. 일부 마크업 안에 `Board` 컴포넌트를 렌더링하도록 하세요.

```js {1,5-16}
function Board() {
  // ...
}

export default function Game() {
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
      <div className="game-info">
        <ol>{/*TODO*/}</ol>
      </div>
    </div>
  );
}
```

`export default` 키워드를 `function Board() {` 선언 앞에서 제거하고 `function Game() {` 선언 앞에 추가한 것에 유의하세요. 이것은 `index.js` 파일에서 `Board` 컴포넌트 대신 `Game` 컴포넌트를 최상위 컴포넌트로 사용하도록 지시합니다. `Game` 컴포넌트가 반환하는 내용에 추가한 div는 나중에 보드에 추가할 게임 정보를 위한 공간을 확보합니다.

다음 플레이어와 이동 기록을 추적하기 위해 `Game` 컴포넌트에 몇개의 state를 추가하세요.

```js {2-3}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  // ...
```

`[Array(9).fill(null)]`은 단일 항목배열로 그 자체가 9개의 `null`의 배열이라는 점에 유의하세요.

현재 이동에 대한 사각형을 렌더링하려면 `history`에서 마지막 사각형의 배열을 읽어야 합니다. 렌더링 중에 계산할 수 있는 충분한 정보가 이미 있으므로 `useState`는 필요하지 않습니다.

```js {4}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];
  // ...
```

다음으로 `Game` 컴포넌트 안에 `Board` 컴포넌트가 게임을 업데이트할 때 호출할 `handlePlay` 함수를 만드세요. `xIsNext` , `currentSquares` , `handlePlay` 를 `Board` 컴포넌트에 props로 전달하세요.

```js {6-8,13}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    // TODO
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        //...
  )
}
```

`Board` 컴포넌트가 props에 의해 완전히 제어되도록 만들겠습니다. `Board` 컴포넌트를 `xIsNext`, `squares`, 그리고 플레이어가 움직일 때마다 `Board`가 업데이트된 사각형을 배열로 호출할 수 있는 새로운 `onPlay` 함수를 props로 받도록 변경하세요. 다음으로 `Board` 함수에서 `useState`를 호출하는 처음 두 줄을 제거하세요.

```js {1}
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    //...
  }
  // ...
}
```

이제 `Board` 컴포넌트의 `handleClick`에 있는 `setSquares` 및 `setXIsNext` 호출을 새로운 `onPlay` 함수에 대한 단일 호출로 대체함으로써 사용자가 사각형을 클릭할 때 `Game` 컴포넌트가 `Board`를 업데이트할 수 있습니다.

```js {12}
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }
  //...
}
```

`Board` 컴포넌트는 `Game` 컴포넌트가 전달한 props에 의해 완전히 제어됩니다. 게임이 다시 작동하게 하려면 `Game` 컴포넌트에서 `handlePlay` 함수를 구현해야 합니다.

`handlePlay`가 호출되면 무엇을 해야 할까요? 이전의 보드는 업데이트된 `setSquares`를 호출했지만, 이제는 업데이트된 `squares` 배열을 `onPlay`로 전달한다는 걸 기억하세요.

`handlePlay` 함수는 리렌더링을 트리거하기 위해 `Game`의 state를 업데이트해야 하지만, 더 이상 호출할 수 있는 `setSquares` 함수가 없으며 대신 이 정보를 저장하기 위해 `history` state 변수를 사용하고 있습니다. 업데이트된 `squares` 배열을 새 히스토리 항목으로 추가하여 `history`를 업데이트해야 하고, Board에서 했던 것처럼 `xIsNext` 값을 반전시켜야 합니다.

```js {4-5}
export default function Game() {
  //...
  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }
  //...
}
```

위에서 `[...history, nextSquares]` 는 `history`에 있는 모든 항목을 포함하는 새 배열을 만들고 그 뒤에 `nextSquares`를 만듭니다. (`...history` [*전개 구문*](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Spread_syntax)을 "`history` 의 모든 항목 열거"로 읽을 수 있습니다)

예를 들어, `history`가 `[[null,null,null], ["X",null,null]]`이고 `nextSquares` 가 `["X",null,"O"]`라면 새로운 `[...history, nextSquares]` 배열은 `[[null,null,null], ["X",null,null], ["X",null,"O"]]`가 될 것입니다.

이 시점에서 state를 `Game` 컴포넌트로 옮겼으므로 리팩토링 전과 마찬가지로 UI가 완전히 작동해야 합니다. 이 시점에서 코드의 모습은 다음과 같습니다.

<Sandpack>

```js src/App.js
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
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{/*TODO*/}</ol>
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

```css src/styles.css
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

### 과거 움직임 보여주기 {/*showing-the-past-moves*/}

이제 틱택토 게임의 히스토리를 기록하므로, 플레이어에게 과거 이동 목록을 보여줄 수 있습니다.

`<button>`과 같은 React 엘리먼트는 일반 JavaScript 객체이므로 애플리케이션에서 전달할 수 있습니다. React에서 여러 엘리먼트를 렌더링하려면 React 엘리먼트 배열을 사용할 수 있습니다.

이미 state에 이동 `history` 배열이 있으므로 이를 React 엘리먼트 배열로 변환해야 합니다. JavaScript에서 한 배열을 다른 배열로 변환하려면 [배열 `map` 메서드](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/map)를 사용하면 됩니다.

```jsx
[1, 2, 3].map((x) => x * 2) // [2, 4, 6]
```

`map`을 사용해 이동의 `history`를 화면의 버튼을 나타내는 React 엘리먼트로 변환하고, 과거의 이동으로 “점프”할 수 있는 버튼 목록을 표시하세요. `Game` 컴포넌트에서 `history`를 `map` 해보겠습니다.

```js {11-13,15-27,35}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    // TODO
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li>
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
```

아래에서 코드가 어떻게 보이는지 확인할 수 있습니다. 개발자 도구 콘솔에 다음과 같은 오류 메시지가 표시되어야 합니다:

<ConsoleBlock level="warning">
경고: 배열 또는 반복자의 각 자식 요소는 고유한 "key" 속성을 가져야 합니다. &#96;Game&#96;의 렌더 메서드를 확인하세요.
</ConsoleBlock>
  
다음 부문에서 이 오류를 수정하겠습니다.

<Sandpack>

```js src/App.js
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
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    // TODO
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li>
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

```css src/styles.css
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

`map`으로 `history` 배열을 반복할 때 전달한 함수 내에서 `squares` 인수는 `history`의 각 엘리먼트를 통과하고, `move` 인수는 각 배열 인덱스를 통과합니다: `0`, `1`, `2`, … (대부분은 실제 배열 엘리먼트가 필요하지만, 이 경우에는 이동 목록을 렌더링하기 위해 인덱스만 있어도 됩니다.)

틱택토 게임 history의 각 이동에 대해 버튼 `<button>`이 포함된 목록 항목 `<li>`를 생성하세요. 버튼에는 (아직 구현하지 않은) `jumpTo`라는 함수를 호출하는 `onClick` 핸들러가 있습니다.

현재로서는 개발자 도구 콘솔에 게임의 발생한 동작 목록과 오류가 표시되어야 합니다. "key" 오류가 무엇을 의미하는지 알아보겠습니다.

### Key 선택하기 {/*picking-a-key*/}

리스트를 렌더링할 때 React는 렌더링 된 각 리스트 항목에 대한 몇 가지 정보를 저장합니다. 리스트를 업데이트할 때 React는 무엇이 변경되었는지 확인해야 합니다. 리스트의 항목은 추가, 제거, 재정렬 또는 업데이트될 수 있습니다.

아래의 리스트가

```html
<li>Alexa: 7 tasks left</li>
<li>Ben: 5 tasks left</li>
```

다음과 같이 변한다고 상상해 보세요.

```html
<li>Ben: 9 tasks left</li>
<li>Claudia: 8 tasks left</li>
<li>Alexa: 5 tasks left</li>
```

아마 task의 개수가 업데이트 되었을 뿐만 아니라 Alexa와 Ben의 순서가 바뀌고 Claudia가 두 사람 사이에 추가되었다고 생각할 것입니다. 그러나 React는 컴퓨터 프로그램이므로 우리가 의도한 바가 무엇인지 알지 못합니다. 그러므로 리스트의 항목에 _key_ 프로퍼티를 지정하여 각 리스트의 항목이 다른 항목과 다르다는 것을 구별해 주어야 합니다. 만약 데이터베이스에서 데이터를 불러와서 사용한다면 Alexa, Ben, Claudia의 데이터베이스 ID를 key로 사용할 수 있습니다.

```js {1}
<li key={user.id}>
  {user.name}: {user.taskCount} tasks left
</li>
```

리스트가 다시 렌더링 되면 React는 각 리스트 항목의 key를 가져와서 이전 리스트의 항목에서 일치하는 key를 탐색합니다. 현재 리스트에서 이전에 존재하지 않았던 key가 있으면 React는 컴포넌트를 생성합니다. 만약 현재 리스트에 이전 리스트에 존재했던 key를 가지고 있지 않다면 React는 그 key를 가진 컴포넌트를 제거합니다. 두 key가 일치한다면 해당 컴포넌트는 이동합니다.

key는 각 React가 각 컴포넌트를 구별할 수 있도록 하여 컴포넌트가 다시 렌더링 될 때 React가 해당 컴포넌트의 state를 유지할 수 있게 합니다. 컴포넌트의 key가 변하면 컴포넌트는 제거되고 새로운 state와 함께 다시 생성됩니다.

`key`는 React에서 특별하고 미리 지정된 프로퍼티입니다. 엘리먼트가 생성되면 React는 `key` 프로퍼티를 추출하여 반환되는 엘리먼트에 직접 key를 저장합니다. `key`가 props로 전달되는 것처럼 보일 수 있지만, React는 자동으로 `key`를 사용해 업데이트할 컴포넌트를 결정합니다. 부모가 지정한 `key`가 무엇인지 컴포넌트는 알 수 없습니다.

**동적인 리스트를 만들 때마다 적절한 key를 할당하는 것을 강력하게 추천합니다.** 적절한 key가 없는 경우 데이터를 재구성하는 것을 고려해 보세요.

key가 지정되지 않은 경우, React는 경고를 표시하며 배열의 인덱스를 기본 key로 사용합니다. 배열 인덱스를 key로 사용하면 리스트 항목의 순서를 바꾸거나 항목을 추가/제거할 때 문제가 발생합니다. 명시적으로 `key={i}`를 전달하면 경고는 사라지지만 배열의 인덱스를 사용할 때와 같은 문제가 발생하므로 대부분은 추천하지 않습니다.

key는 전역적으로 고유할 필요는 없으며 컴포넌트와 해당 컴포넌트의 형제 컴포넌트 사이에서만 고유하면 됩니다.

### 시간여행 구현하기 {/*implementing-time-travel*/}

틱택토 게임의 기록에서 과거의 각 이동에는 해당 이동의 일련번호인 고유 ID가 있습니다. 이동은 중간에 순서를 바꾸거나 삭제하거나 삽입할 수 없으므로 이동 인덱스를 key로 사용하는 것이 안전합니다.

`Game` 함수에서 `<li key={move}>`로 key를 추가할 수 있으며 렌더링 된 게임을 다시 로드하면 React의 “key” 에러가 사라질 것입니다.

```js {4}
const moves = history.map((squares, move) => {
  //...
  return (
    <li key={move}>
      <button onClick={() => jumpTo(move)}>{description}</button>
    </li>
  );
});
```

<Sandpack>

```js src/App.js
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
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    // TODO
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

```css src/styles.css
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

`jumpTo`를 구현하기 전에 사용자가 현재 어떤 단계를 보고 있는지를 추적할 수 있는 `Game` 컴포넌트가 필요합니다. 이를 위해 기본값이 `0`인 `currentMove` 라는 새 state 변수를 정의하세요.

```js {4}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[history.length - 1];
  //...
}
```

다음으로 `Game` 내부의 `jumpTo` 함수를 업데이트하여 해당 `currentMove`를 업데이트하세요. 또한 `currentMove`를 변경하는 숫자가 짝수면 `xIsNext`를 `true`로 설정하세요.

```js {4-5}
export default function Game() {
  // ...
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
  }
  //...
}
```

이제 사각형을 클릭할 때 호출되는 `Game`의 `handlePlay` 함수 내용을 두 가지 변경하겠습니다.

- “시간을 거슬러 올라가서” 그 시점에서 새로운 이동을 하는 경우 해당 시점까지의 히스토리만 유지해야 합니다. `history`의 모든 항목(`...` 전개 구문) 뒤에 `nextSquares`를 추가하는 대신 `history.slice(0, currentMove + 1)`의 모든 항목 뒤에 추가하여 이전 히스토리의 해당 부분만 유지하도록 하겠습니다.
- 이동할 때마다 최신 히스토리 항목을 가리키도록 `currentMove`를 업데이트하세요.

```js {2-4}
function handlePlay(nextSquares) {
  const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
  setHistory(nextHistory);
  setCurrentMove(nextHistory.length - 1);
  setXIsNext(!xIsNext);
}
```

마지막으로 항상 마지막 동작을 렌더링하는 대신 현재 선택한 동작을 렌더링하도록 `Game` 컴포넌트를 수정하겠습니다.

```js {5}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  // ...
}
```

게임 히스토리의 특정 단계를 클릭하면 틱택토 보드가 즉시 업데이트되어 해당 단계가 발생한 시점의 보드 모양이 표시됩니다.

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({value, onSquareClick}) {
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
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
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

```css src/styles.css
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

### 최종 정리 {/*final-cleanup*/}

코드를 자세히 살펴보면 `currentMove`가 짝수일 때는 `xIsNext === true`가 되고, `currentMove`가 홀수일 때는 `xIsNext === false`가 되는 것을 알 수 있습니다. 즉, `currentMove`의 값을 알고 있다면 언제나 `xIsNext`가 무엇인지 알아낼 수 있습니다.

이 두 가지 state를 모두 저장할 이유가 없습니다. 항상 중복되는 state는 피하세요. state에 저장하는 것을 단순화하면 버그를 줄이고 코드를 더 쉽게 이해할 수 있습니다. `Game`을 변경하여 더 이상 `xIsNext`를 별도의 state 변수로 저장하지 않고 `currentMove`를 기반으로 알아내도록 수정하겠습니다.

```js {4,11,15}
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
  // ...
}
```

더 이상 `xIsNext` state 선언이나 `setXIsNext` 호출이 필요하지 않습니다. 이제 컴포넌트를 코딩하는 동안 실수를 하더라도 `xIsNext`가 `currentMove`와 동기화되지 않을 가능성이 없습니다.

### 마무리 {/*wrapping-up*/}

축하합니다! 여러분은 틱택토 게임을 만들었습니다.

- 틱택토를 플레이할 수 있습니다.
- 플레이어가 게임에서 이겼을 때를 표시합니다.
- 게임이 진행됨에 따라 히스토리를 저장합니다.
- 플레이어가 게임 히스토리를 검토하고 게임 보드의 이전 버전을 볼 수 있습니다.

수고하셨습니다! 이제 React가 어떻게 작동하는지 어느 정도 이해하셨기를 바랍니다.

최종 결과물을 아래에서 확인하세요.

<Sandpack>

```js src/App.js
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

```css src/styles.css
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

시간이 남거나 새로운 React 기술을 연습하고 싶다면 아래에 틱택토 게임을 개선할 수 있는 몇 가지 아이디어가 있습니다. 아이디어는 난이도가 낮은 순으로 정렬되어 있습니다.

1. 현재 이동에 대해서만 버튼 대신 “당신은 #번째 순서에 있습니다…”를 표시해 보세요.
1. `Board`를 하드 코딩 하는 대신 두 개의 루프를 사용하여 사각형을 만들도록 다시 작성해 보세요.
1. 동작을 오름차순 또는 내림차순으로 정렬할 수 있는 토글 버튼을 추가해 보세요.
1. 누군가 승리하면 승리의 원인이 된 세 개의 사각형을 강조 표시해 보세요. (아무도 승리하지 않으면 무승부라는 메시지를 표시하세요. )
1. 이동 히스토리 목록에서 각 이동의 위치를 형식(열, 행)으로 표시해 보세요.

이 자습서를 통해 엘리먼트, 컴포넌트, props, state를 포함한 React의 개념에 대해 살펴봤습니다. 이제 이러한 개념이 게임을 만들 때 어떻게 작동하는지 보았으니, [React로 사고하기](/learn/thinking-in-react)를 통해 앱의 UI를 만들 때 동일한 React 개념이 어떻게 작동하는지 확인해 보세요.
