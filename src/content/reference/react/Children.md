---
title: Children
---

<Pitfall>

`Children`을 사용하는 것은 일반적이지 않고 취약한 코드가 될 수 있습니다. [일반적으로 사용하는 대안을 살펴보세요.](#alternatives)

</Pitfall>

<Intro>

`Children`을 사용해서 [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children)로 받은 JSX를 조작하고 변환할 수 있습니다.

```js
const mappedChildren = Children.map(children, child =>
  <div className="Row">
    {child}
  </div>
);

```

</Intro>

<InlineToc />

---

## 레퍼런스 {/*reference*/}

### `Children.count(children)` {/*children-count*/}

`Children.count(children)`는 `children` 데이터 구조의 자식 요소 수를 반환합니다.

```js src/RowList.js active
import { Children } from 'react';

function RowList({ children }) {
  return (
    <>
      <h1>Total rows: {Children.count(children)}</h1>
      ...
    </>
  );
}
```

[아래 예시 보기](#counting-children)

#### 파라미터 {/*children-count-parameters*/}

* `children`: 컴포넌트에서 받은 [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children)의 값.

#### 반환값 {/*children-count-returns*/}

`children` 내부 노드의 수.

#### 주의 사항 {/*children-count-caveats*/}

- 빈 노드(`null`, `undefined` 혹은 Boolean), 문자열, 숫자, [React 엘리먼트](/reference/react/createElement)는 개별 노드로 간주합니다. 배열 자체는 개별 노드가 아니지만 배열의 자식 요소는 개별 노드로 간주합니다. **React 엘리먼트의 하위 요소는 순회하지 않습니다.** React 엘리먼트는 렌더링 되지 않으며 자식 요소를 순회하지 않습니다. [Fragments](/reference/react/Fragment) 역시 순회하지 않습니다.

---

### `Children.forEach(children, fn, thisArg?)` {/*children-foreach*/}

`Children.forEach(children, fn, thisArg?)`는 `children` 데이터 구조의 모든 자식 요소에 대해 특정 코드를 실행합니다.

```js src/RowList.js active
import { Children } from 'react';

function SeparatorList({ children }) {
  const result = [];
  Children.forEach(children, (child, index) => {
    result.push(child);
    result.push(<hr key={index} />);
  });
  // ...
```

[아래 예시 보기](#running-some-code-for-each-child)

#### 파라미터 {/*children-foreach-parameters*/}

* `children`: 컴포넌트에서 받은 [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children)의 값.
* `fn`: [배열의`forEach` 메서드](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) 콜백처럼 각 자식 요소에서 실행할 함수. 자식 요소를 첫 번째 인수로, 인덱스를 두 번째 인수로 받습니다. 인덱스는 0에서 시작해서 호출할 때마다 증가합니다.
* **optional** `thisArg`: `fn` 함수가 호출될 때 사용될 [`this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)의 값. 생략 시 `undefined`로 간주합니다.

#### 반환값 {/*children-foreach-returns*/}

`Children.forEach`는 `undefined`를 반환합니다.

#### 주의 사항 {/*children-foreach-caveats*/}

- 빈 노드(`null`, `undefined` 혹은 Boolean), 문자열, 숫자, [React 엘리먼트](/reference/react/createElement)는 개별 노드로 간주합니다. 배열 자체는 개별 노드가 아니지만 배열의 자식 요소는 개별 노드로 간주합니다. **React 엘리먼트의 하위 요소는 순회하지 않습니다.** React 엘리먼트는 렌더링 되지 않으며 자식 요소를 순회하지 않습니다. [Fragments](/reference/react/Fragment) 역시 순회하지 않습니다.

---

### `Children.map(children, fn, thisArg?)` {/*children-map*/}

`Children.map(children, fn, thisArg?)`은 `children` 데이터 구조에서 각 자식 요소를 매핑하거나 변환합니다.

```js src/RowList.js active
import { Children } from 'react';

function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

[아래 예시 보기](#transforming-children)

#### 파라미터 {/*children-map-parameters*/}

* `children`: 컴포넌트에서 받은 [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children)의 값.
* `fn`: [베열의 `map` 메서드](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) 콜백같은 매핑 함수. 자식 요소를 첫 번째 인수로, 인덱스를 두 번째 인수로 받습니다. 인덱스는 0에서 시작해서 호출할 때마다 증가합니다. 함수는 빈 노드(`null`, `undefined` 혹은 Boolean), 문자열, 숫자, React 엘리먼트 혹은 다른 React 노드의 배열과 같은 React 노드를 반환해야 합니다.
* **optional** `thisArg`: `fn` 함수가 호출될 때 사용될 [`this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)의 값. 생략시 `undefined`로 간주합니다.

#### 반환값 {/*children-map-returns*/}

`children`이 `null`이거나 `undefined`일 땐 해당 값을 반환합니다.


그렇지 않은 경우 `fn` 함수에서 반환한 노드들로 구성된 평면 배열을 반환합니다. 반환된 배열은 `null`과 `undefined`를 제외하고 반환된 노드를 모두 포함합니다.

#### 주의 사항 {/*children-map-caveats*/}

- 빈 노드(`null`, `undefined` 혹은 Boolean), 문자열, 숫자, [React 엘리먼트](/reference/react/createElement)는 개별 노드로 간주합니다. 배열 자체는 개별 노드가 아니지만 배열의 자식 요소는 개별 노드로 간주합니다. **React 엘리먼트의 하위 요소는 순회하지 않습니다.** React 엘리먼트는 렌더링 되지 않으며 자식 요소를 순회하지 않습니다. [Fragments](/reference/react/Fragment) 역시 순회하지 않습니다.

- `fn`에서 key를 가진 엘리먼트(혹은 엘리먼트의 배열)을 반환하는 경우, **반환된 엘리먼트의 key는 `children`의 원본 항목의 key와 자동으로 결합됩니다.** `fn`에서 배열로 여러 엘리먼트를 반환하는 경우, 각 엘리먼트의 key는 서로 간에만 고유하면 됩니다.
---

### `Children.only(children)` {/*children-only*/}


`Children.only(children)`은 `children`이 단일 React 엘리먼트인지 확인합니다.

```js
function Box({ children }) {
  const element = Children.only(children);
  // ...
```

#### 파라미터 {/*children-only-parameters*/}

* `children`: 컴포넌트에서 받은 [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children)의 값.

#### 반환값 {/*children-only-returns*/}

`children`이 [유효한 엘리먼트](/reference/react/isValidElement)라면 그 엘리먼트를 반환합니다.
그렇지 않다면, 에러를 throw합니다.

#### 주의 사항 {/*children-only-caveats*/}

- 이 메서드는 **`children`으로 배열 (예를 들어 `Children.map`의 반환 값)을 넘기면 항상 예외를 발생시킵니다.** 다시 말해 `children`은 단일 엘리먼트의 배열이 아니라 단일 React 엘리먼트여야 합니다.

---

### `Children.toArray(children)` {/*children-toarray*/}

`Children.toArray(children)`은 `children` 데이터 구조로부터 배열을 생성합니다.

```js src/ReversedList.js active
import { Children } from 'react';

export default function ReversedList({ children }) {
  const result = Children.toArray(children);
  result.reverse();
  // ...
```

#### 파라미터 {/*children-toarray-parameters*/}

* `children`: 컴포넌트에서 받은 [`children` prop](/learn/passing-props-to-a-component#passing-jsx-as-children)의 값.

#### 반환값 {/*children-toarray-returns*/}

`children`에 속한 엘리먼트를 평면 배열로 반환합니다.

#### 주의 사항 {/*children-toarray-caveats*/}


- 빈 노드(`null`, `undefined`, 혹은 Booleans)는 반환된 배열에서 생략됩니다. **반환된 엘리먼트의 key는 기존 엘리먼트의 key, 중첩 수준과 위치를 기준으로 계산되므로** 배열을 평면화하더라도 동작이 변경되지 않습니다.

---

## 사용법 {/*usage*/}

### children 변환하기 {/*transforming-children*/}

`Children.map`은 [`children` prop로 받은](/learn/passing-props-to-a-component#passing-jsx-as-children) JSX를 변환합니다.

```js {6,10}
import { Children } from 'react';

function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

위 예시에서 `RowList`는 모든 자식 요소를 `<div className="Row">`로 감싸줍니다. 부모 컴포넌트가 `RowList`에 세 개의 `<p>` 태그를 `children` prop로 넘겨준다고 가정해 봅시다.

```js
<RowList>
  <p>This is the first item.</p>
  <p>This is the second item.</p>
  <p>This is the third item.</p>
</RowList>
```

위에 나온 `RowList` 구현을 통해 렌더링 된 최종 결과는 다음과 같습니다.

```js
<div className="RowList">
  <div className="Row">
    <p>This is the first item.</p>
  </div>
  <div className="Row">
    <p>This is the second item.</p>
  </div>
  <div className="Row">
    <p>This is the third item.</p>
  </div>
</div>
```

`Children.map`은 [`map()`을 사용해 배열을 변환](/learn/rendering-lists)하는 것과 유사하지만, `children` 데이터 구조가 *불분명하게* 취급된다는 차이가 있습니다. 즉, 배열일 수 있다고 하더라도 항상 배열이거나 다른 특정한 데이터 타입일 것이라고 가정해서는 안 됩니다. 그렇기 때문에 `children`을 변환할 때는 `Children.map`을 사용해야 합니다.

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>This is the first item.</p>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </RowList>
  );
}
```

```js src/RowList.js active
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

<DeepDive>

#### children prop는 왜 항상 배열이 아닌가요? {/*why-is-the-children-prop-not-always-an-array*/}

React에서 `children` prop는 *불분명한* 데이터 구조로 취급됩니다. `children`이 구조화된 방식에 의존할 수 없다는 의미입니다. 변환하거나 필터링하거나 개수를 세기 위해서는 `Children` 메서드를 사용해야 합니다.

실제로 `children` 데이터 구조는 내부적으로 배열로 표현되고는 합니다. 그러나 만약 하나의 자식만 있다면 React는 불필요한 메모리 오버헤드를 방지하기 위해 배열을 추가로 생성하지 않습니다. `children` prop에 직접 접근하지 않고 `Children` 메서드를 사용한다면, 실제로 React가 데이터 구조를 어떻게 구현했더라도 코드는 깨지지 않습니다.

`children`이 배열이더라도 `Children.map`을 유용하게 쓸 수 있습니다. 예를 들어 `Children.map`은 반환된 엘리먼트의 [key](/learn/rendering-lists#keeping-list-items-in-order-with-key)를 전달받은 `children`의 key와 병합합니다. 이를 통해 위 예시처럼 감싸지더라도 원본 JSX 자식 요소는 key를 잃어버리지 않습니다.

</DeepDive>

<Pitfall>

`children` 데이터 구조는 JSX로 전달된 컴포넌트의 **렌더링 결과를 포함하지 않습니다.** 아래 예시에서 `RowList`가 받은 `children`에는 세 개가 아닌 두 개의 아이템만 포함됩니다.

1. `<p>This is the first item.</p>`
2. `<MoreRows />`

그렇기 때문에 아래 예시에서는 두 개의 래퍼만 생성됩니다.

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>This is the first item.</p>
      <MoreRows />
    </RowList>
  );
}

function MoreRows() {
  return (
    <>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </>
  );
}
```

```js src/RowList.js
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

`children`을 조작할 때 `<MoreRows />`와 같은 **내부 컴포넌트의 렌더링 된 결과에 접근할 방법은 없습니다.** 그렇기 때문에 [대안을 사용하는 것이 좋습니다.](#alternatives)

</Pitfall>

---

### 각 자식 요소에서 코드 실행하기 {/*running-some-code-for-each-child*/}

`Children.forEach`는 `children` 데이터 구조의 각 자식 요소를 반복합니다. 반환되는 값은 없고 [배열의 `forEach` 메서드](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)와 유사합니다. 자체 배열을 구성하는 등 커스텀 로직을 실행할 때 사용할 수 있습니다.

<Sandpack>

```js
import SeparatorList from './SeparatorList.js';

export default function App() {
  return (
    <SeparatorList>
      <p>This is the first item.</p>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </SeparatorList>
  );
}
```

```js src/SeparatorList.js active
import { Children } from 'react';

export default function SeparatorList({ children }) {
  const result = [];
  Children.forEach(children, (child, index) => {
    result.push(child);
    result.push(<hr key={index} />);
  });
  result.pop(); // Remove the last separator
  return result;
}
```

</Sandpack>

<Pitfall>

위에서 언급했듯 `children`을 조작할 때 내부 컴포넌트의 렌더링 된 결과에 접근할 방법은 없습니다. 그렇기 때문에 [대안을 사용하는 것이 좋습니다.](#alternatives)

</Pitfall>

---

### children 카운팅하기 {/*counting-children*/}

`Children.count(children)`는 자식 요소의 수를 계산합니다.

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>This is the first item.</p>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </RowList>
  );
}
```

```js src/RowList.js active
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      <h1 className="RowListHeader">
        Total rows: {Children.count(children)}
      </h1>
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.RowListHeader {
  padding-top: 5px;
  font-size: 25px;
  font-weight: bold;
  text-align: center;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

<Pitfall>

위에서 언급했듯 `children`을 조작할 때 내부 컴포넌트의 렌더링 된 결과에 접근할 방법은 없습니다. 그렇기 때문에 [대안을 사용하는 것이 좋습니다.](#alternatives)

</Pitfall>

---

### children 배열로 병합하기 {/*converting-children-to-an-array*/}

`Children.toArray(children)`는 `children` 데이터 구조를 일반적인 JavaScript 배열로 변경합니다. 이것을 사용해서 [`filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter), [`sort`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort), [`reverse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse)와 같은 배열의 내장 메서드를 조작할 수 있습니다.

<Sandpack>

```js
import ReversedList from './ReversedList.js';

export default function App() {
  return (
    <ReversedList>
      <p>This is the first item.</p>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </ReversedList>
  );
}
```

```js src/ReversedList.js active
import { Children } from 'react';

export default function ReversedList({ children }) {
  const result = Children.toArray(children);
  result.reverse();
  return result;
}
```

</Sandpack>

<Pitfall>

위에서 언급했듯 `children`을 조작할 때 내부 컴포넌트의 렌더링 된 결과에 접근할 방법은 없습니다. 그렇기 때문에 [대안을 사용하는 것이 좋습니다.](#alternatives)

</Pitfall>

---

## 대안 {/*alternatives*/}

<Note>

아래와 같이 사용되는 `Children`(대문자 `C`) API의 대안에 대한 설명입니다.

```js
import { Children } from 'react';
```

소문자 `c`인 [`children`prop](/learn/passing-props-to-a-component#passing-jsx-as-children)와 혼동해서는 안 됩니다. [`children`prop](/learn/passing-props-to-a-component#passing-jsx-as-children)는 좋은 방법이고 권장되는 방식입니다.

</Note>

### 여러 컴포넌트 노출하기 {/*exposing-multiple-components*/}

`Children` 메서드로 자식 요소를 조작하는 코드는 취약할 수 있습니다. JSX에서 컴포넌트에 자식 요소를 전달할 때 해당 컴포넌트가 개별 자식 요소를 조작하거나 변환될 수 있기 때문입니다.

가능한 한 `Children` 메서드는 사용하지 않는 것이 좋습니다. 예를 들어 `RowList`의 각 자식 요소를 `<div className="Row">`로 감싸려면, `Row` 컴포넌트를 내보내고 다음과 같이 각 row를 직접 감싸는 것을 권장합니다.

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList>
      <Row>
        <p>This is the first item.</p>
      </Row>
      <Row>
        <p>This is the second item.</p>
      </Row>
      <Row>
        <p>This is the third item.</p>
      </Row>
    </RowList>
  );
}
```

```js src/RowList.js
export function RowList({ children }) {
  return (
    <div className="RowList">
      {children}
    </div>
  );
}

export function Row({ children }) {
  return (
    <div className="Row">
      {children}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

`Children.map`과 달리 이 방식은 모든 자식 요소를 자동으로 감싸지 않습니다. **그러나 [`Children.map`의 앞선 예시](#transforming-children)와 달리 더 많은 컴포넌트를 추출해도 동작한다는 중요한 이점이 있습니다.**
예를 들어 `MoreRows` 컴포넌트를 직접 추출하더라도 동작합니다.

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList>
      <Row>
        <p>This is the first item.</p>
      </Row>
      <MoreRows />
    </RowList>
  );
}

function MoreRows() {
  return (
    <>
      <Row>
        <p>This is the second item.</p>
      </Row>
      <Row>
        <p>This is the third item.</p>
      </Row>
    </>
  );
}
```

```js src/RowList.js
export function RowList({ children }) {
  return (
    <div className="RowList">
      {children}
    </div>
  );
}

export function Row({ children }) {
  return (
    <div className="Row">
      {children}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

`<MoreRows />`가 단일 자식 요소이자 단일 row로 취급되기 때문에 `Children.map`은 동작하지 않습니다.

---

### prop로 객체 배열 받기 {/*accepting-an-array-of-objects-as-a-prop*/}

prop로 명시적으로 배열을 전달할 수 있습니다. 예를 들어, 아래 예시에서 `RowList`는 `rows` 배열을 prop로 받습니다.

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList rows={[
      { id: 'first', content: <p>This is the first item.</p> },
      { id: 'second', content: <p>This is the second item.</p> },
      { id: 'third', content: <p>This is the third item.</p> }
    ]} />
  );
}
```

```js src/RowList.js
export function RowList({ rows }) {
  return (
    <div className="RowList">
      {rows.map(row => (
        <div className="Row" key={row.id}>
          {row.content}
        </div>
      ))}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

`rows`는 일반적인 JavaScript 배열이기 때문에, `RowList` 컴포넌트는 [`map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)과 같은 내장 배열 메서드를 사용할 수 있습니다.

이 패턴은 구조화된 데이터를 자식 요소와 함께 전달할 때 더 유용합니다. 아래 예시에서 `TabSwitcher` 컴포넌트는 `tabs` prop로 객체 배열을 받습니다.

<Sandpack>

```js
import TabSwitcher from './TabSwitcher.js';

export default function App() {
  return (
    <TabSwitcher tabs={[
      {
        id: 'first',
        header: 'First',
        content: <p>This is the first item.</p>
      },
      {
        id: 'second',
        header: 'Second',
        content: <p>This is the second item.</p>
      },
      {
        id: 'third',
        header: 'Third',
        content: <p>This is the third item.</p>
      }
    ]} />
  );
}
```

```js src/TabSwitcher.js
import { useState } from 'react';

export default function TabSwitcher({ tabs }) {
  const [selectedId, setSelectedId] = useState(tabs[0].id);
  const selectedTab = tabs.find(tab => tab.id === selectedId);
  return (
    <>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setSelectedId(tab.id)}
        >
          {tab.header}
        </button>
      ))}
      <hr />
      <div key={selectedId}>
        <h3>{selectedTab.header}</h3>
        {selectedTab.content}
      </div>
    </>
  );
}
```

</Sandpack>

JSX로 자식 요소를 전달할 때와 달리 이런 방식은 각 아이템에 `header`와 같은 추가 정보를 연결할 수 있습니다. `tabs`가 배열 구조이고 직접 다뤄지기 때문에 `Children` 메서드는 필요하지 않습니다.

---

### render prop로 렌더링 커스텀하기 {/*calling-a-render-prop-to-customize-rendering*/}

모든 개별 항목에 대해 JSX를 생성하는 대신 JSX를 반환하는 함수를 전달하고 필요할 때 해당 함수를 호출할 수도 있습니다. 아래 예시에서 `App` 컴포넌트는 `renderContent` 함수를 `TabSwitcher` 컴포넌트에 전달합니다. `TabSwitcher` 컴포넌트는 선택된 탭에 대해서만 `renderContent`를 호출합니다.

<Sandpack>

```js
import TabSwitcher from './TabSwitcher.js';

export default function App() {
  return (
    <TabSwitcher
      tabIds={['first', 'second', 'third']}
      getHeader={tabId => {
        return tabId[0].toUpperCase() + tabId.slice(1);
      }}
      renderContent={tabId => {
        return <p>This is the {tabId} item.</p>;
      }}
    />
  );
}
```

```js src/TabSwitcher.js
import { useState } from 'react';

export default function TabSwitcher({ tabIds, getHeader, renderContent }) {
  const [selectedId, setSelectedId] = useState(tabIds[0]);
  return (
    <>
      {tabIds.map((tabId) => (
        <button
          key={tabId}
          onClick={() => setSelectedId(tabId)}
        >
          {getHeader(tabId)}
        </button>
      ))}
      <hr />
      <div key={selectedId}>
        <h3>{getHeader(selectedId)}</h3>
        {renderContent(selectedId)}
      </div>
    </>
  );
}
```

</Sandpack>

`renderContent`와 같이 사용자 인터페이스의 일부를 어떻게 렌더링할지 정의하는 prop를 *render prop*라고 합니다. 하지만 특별한 것은 아닙니다. 단지 일반적인 함수의 prop일 뿐입니다.

Render props는 함수이므로 정보를 전달할 수 있습니다.
아래 예시에서 `RowList` 컴포넌트는 각 row의 `id`와 `index`를 `renderRow`에 render prop로 전달하고, `index`가 짝수인 row를 강조합니다.

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList
      rowIds={['first', 'second', 'third']}
      renderRow={(id, index) => {
        return (
          <Row isHighlighted={index % 2 === 0}>
            <p>This is the {id} item.</p>
          </Row> 
        );
      }}
    />
  );
}
```

```js src/RowList.js
import { Fragment } from 'react';

export function RowList({ rowIds, renderRow }) {
  return (
    <div className="RowList">
      <h1 className="RowListHeader">
        Total rows: {rowIds.length}
      </h1>
      {rowIds.map((rowId, index) =>
        <Fragment key={rowId}>
          {renderRow(rowId, index)}
        </Fragment>
      )}
    </div>
  );
}

export function Row({ children, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {children}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.RowListHeader {
  padding-top: 5px;
  font-size: 25px;
  font-weight: bold;
  text-align: center;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}

.RowHighlighted {
  background: #ffa;
}
```

</Sandpack>

부모 컴포넌트와 자식 컴포넌트가 자식 요소를 직접 조작하지 않고도 효과적으로 협력할 수 있는 좋은 예시입니다.

---

## 문제 해결 {/*troubleshooting*/}

### 커스텀 컴포넌트를 전달했을 때 `Children` 메서드가 렌더링 결과를 보여주지 않는 경우 {/*i-pass-a-custom-component-but-the-children-methods-dont-show-its-render-result*/}

`RowList`에 두 개의 자식 요소를 아래와 같이 전달했다고 가정해 봅시다.

```js
<RowList>
  <p>First item</p>
  <MoreRows />
</RowList>
```

`RowList` 내부에서 `Children.count(children)`를 실행시킨다면 결과는 `2`입니다. `MoreRows`가 10개의 다른 요소를 렌더링하거나 `null`을 반환하더라도, `Children.count(children)`는 `2`입니다. `RowList` 관점에서는 그것이 받은 JSX만 고려할 뿐 `MoreRows` 컴포넌트의 내부는 고려하지 않습니다.

이런 제약때문에 컴포넌트를 추출하기 어려울 수 있습니다. 그렇기 때문에 `Children` 대신 [대안](#alternatives)을 사용하는 것이 좋습니다.
