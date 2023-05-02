---
title: cloneElement
---

<Pitfall>

`cloneElement`를 사용하는 것은 흔하지 않으며, 불안정한 코드를 만들 수 있습니다. [일반적인 대안을 확인하세요.](#alternatives)

</Pitfall>

<Intro>

`cloneElement`를 사용하면 엘리먼트를 기준으로 새로운 React 엘리먼트를 만들 수 있습니다.

```js
const clonedElement = cloneElement(element, props, ...children)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `cloneElement(element, props, ...children)` {/*cloneelement*/}

엘리먼트를 기준으로 하되, `props`와 `children`을 다르게 하여 새로운 React 엘리먼트를 만들기 위해 `cloneElement`를 호출하세요.

```js
import { cloneElement } from 'react';

// ...
const clonedElement = cloneElement(
  <Row title="Cabbage">
    Hello
  </Row>,
  { isHighlighted: true },
  'Goodbye'
);

console.log(clonedElement); // <Row title="Cabbage">Goodbye</Row>
```

[예제를 더 보려면 아래를 참고하세요.](#usage)

#### Parameters {/*parameters*/}

* `element`: `element` 인자는 유효한 React 엘리먼트여야 합니다. 예를 들어, `<Something />`과 같은 JSX 노드, [`createElement`](/reference/react/createElement)로 호출한 결과물 또는 다른 `cloneElement`로 호출한 결과물이 될 수 있습니다.

* `props`: `props` 인자는 객체 또는 `null`이어야 합니다. `null`을 전달하면 복제된 엘리먼트는 원본 `element.props`를 모두 유지합니다. 그렇지 않으면 `props` 객체의 각 prop에 대해 반환된 엘리먼트는 `element.props`의 값보다 `props`의 값을 "우선"합니다. 나머지 `props`는 원본 `element.props`에서 채워집니다. `props.key` 또는 `props.ref`를 전달하면 원본의 것을 대체합니다.

* **(선택 사항)** `...children`: 0개 이상의 자식 노드를 필요로 합니다. React 엘리먼트, 문자열, 숫자, [portals](/reference/react-dom/createPortal), 빈 노드 (`null`, `undefined`, `true`, `false`) 및 React 노드 배열을 포한 모든 React 노드가 해당될 수 있습니다. `...children` 인자를 전달하지 않으면 원본 `element.props.children`이 유지됩니다.


#### Returns {/*returns*/}

`cloneElement`는 다음과 같은 프로퍼티를 가진 React 엘리먼트 객체를 반환합니다.

* `type`: `element.type`과 동일합니다.
* `props`: `element.props`와 전달한 `props`를 얕게 병합한 결과입니다.
* `ref`: `props.ref`에 의해 재정의되지 않은 경우 원본 `element.ref`입니다.
* `key`: `props.key`에 의해 재정의되지 않은 경우 원본 `element.key`입니다.

일반적으로 컴포넌트에서 엘리먼트를 반환하거나 다른 엘리먼트의 자식으로 만듭니다. 엘리먼트의 프로퍼티를 읽을 수 있지만, 생성된 후에는 모든 엘리먼트를 불투명하게 취급하고 렌더링하는 것이 좋습니다.

#### 주의 {/*caveats*/}

* 엘리먼트를 복제해도 **원본 엘리먼트는 수정되지 않습니다.**

* You should only **pass children as multiple arguments to `cloneElement` if they are all statically known,** like `cloneElement(element, null, child1, child2, child3)`. If your children are dynamic, pass the entire array as the third argument: `cloneElement(element, null, listItems)`. This ensures that React will [warn you about missing `key`s](/learn/rendering-lists#keeping-list-items-in-order-with-key) for any dynamic lists. For static lists this is not necessary because they never reorder.

* **자식이 모두 정적으로 알려져 있는 경우에만** `cloneElement(element, null, child1, child2, child3)`와 같이 **자식을 여러 개의 인자로 전달해야 합니다.** 자식이 동적으로 생성되었다면 `cloneElement(element, null, listItems)`와 같이 전체 배열을 세 번째 인자로 전달해야합니다. 이렇게 하면 React가 모든 동적 리스트에 대해 [key가 누락되었다는 경고](/learn/rendering-lists#keeping-list-items-in-order-with-key)를 보여줍니다. 정적 리스트의 경우는 순서가 변경되지 않으므로 이 작업은 필요하지 않습니다.

---

## Usage {/*usage*/}

### Overriding props of an element {/*overriding-props-of-an-element*/}

To override the props of some <CodeStep step={1}>React element</CodeStep>, pass it to `cloneElement` with the <CodeStep step={2}>props you want to override</CodeStep>:

```js [[1, 5, "<Row title=\\"Cabbage\\" />"], [2, 6, "{ isHighlighted: true }"], [3, 4, "clonedElement"]]
import { cloneElement } from 'react';

// ...
const clonedElement = cloneElement(
  <Row title="Cabbage" />,
  { isHighlighted: true }
);
```

Here, the resulting <CodeStep step={3}>cloned element</CodeStep> will be `<Row title="Cabbage" isHighlighted={true} />`.

**Let's walk through an example to see when it's useful.**

Imagine a `List` component that renders its [`children`](/learn/passing-props-to-a-component#passing-jsx-as-children) as a list of selectable rows with a "Next" button that changes which row is selected. The `List` component needs to render the selected `Row` differently, so it clones every `<Row>` child that it has received, and adds an extra `isHighlighted: true` or `isHighlighted: false` prop:

```js {6-8}
export default function List({ children }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {Children.map(children, (child, index) =>
        cloneElement(child, {
          isHighlighted: index === selectedIndex 
        })
      )}
```

Let's say the original JSX received by `List` looks like this:

```js {2-4}
<List>
  <Row title="Cabbage" />
  <Row title="Garlic" />
  <Row title="Apple" />
</List>
```

By cloning its children, the `List` can pass extra information to every `Row` inside. The result looks like this:

```js {4,8,12}
<List>
  <Row
    title="Cabbage"
    isHighlighted={true} 
  />
  <Row
    title="Garlic"
    isHighlighted={false} 
  />
  <Row
    title="Apple"
    isHighlighted={false} 
  />
</List>
```

Notice how pressing "Next" updates the state of the `List`, and highlights a different row:

<Sandpack>

```js
import List from './List.js';
import Row from './Row.js';
import { products } from './data.js';

export default function App() {
  return (
    <List>
      {products.map(product =>
        <Row
          key={product.id}
          title={product.title} 
        />
      )}
    </List>
  );
}
```

```js List.js active
import { Children, cloneElement, useState } from 'react';

export default function List({ children }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {Children.map(children, (child, index) =>
        cloneElement(child, {
          isHighlighted: index === selectedIndex 
        })
      )}
      <hr />
      <button onClick={() => {
        setSelectedIndex(i =>
          (i + 1) % Children.count(children)
        );
      }}>
        Next
      </button>
    </div>
  );
}
```

```js Row.js
export default function Row({ title, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
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

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

To summarize, the `List` cloned the `<Row />` elements it received and added an extra prop to them.

<Pitfall>

Cloning children makes it hard to tell how the data flows through your app. Try one of the [alternatives.](#alternatives)

</Pitfall>

---

## Alternatives {/*alternatives*/}

### Passing data with a render prop {/*passing-data-with-a-render-prop*/}

Instead of using `cloneElement`, consider accepting a *render prop* like `renderItem`. Here, `List` receives `renderItem` as a prop. `List` calls `renderItem` for every item and passes `isHighlighted` as an argument: 

```js {1,7}
export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return renderItem(item, isHighlighted);
      })}
```

The `renderItem` prop is called a "render prop" because it's a prop that specifies how to render something. For example, you can pass a `renderItem` implementation that renders a `<Row>` with the given `isHighlighted` value:

```js {3,7}
<List
  items={products}
  renderItem={(product, isHighlighted) =>
    <Row
      key={product.id}
      title={product.title}
      isHighlighted={isHighlighted}
    />
  }
/>
```

The end result is the same as with `cloneElement`:

```js {4,8,12}
<List>
  <Row
    title="Cabbage"
    isHighlighted={true} 
  />
  <Row
    title="Garlic"
    isHighlighted={false} 
  />
  <Row
    title="Apple"
    isHighlighted={false} 
  />
</List>
```

However, you can clearly trace where the `isHighlighted` value is coming from.

<Sandpack>

```js
import List from './List.js';
import Row from './Row.js';
import { products } from './data.js';

export default function App() {
  return (
    <List
      items={products}
      renderItem={(product, isHighlighted) =>
        <Row
          key={product.id}
          title={product.title}
          isHighlighted={isHighlighted}
        />
      }
    />
  );
}
```

```js List.js active
import { useState } from 'react';

export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return renderItem(item, isHighlighted);
      })}
      <hr />
      <button onClick={() => {
        setSelectedIndex(i =>
          (i + 1) % items.length
        );
      }}>
        Next
      </button>
    </div>
  );
}
```

```js Row.js
export default function Row({ title, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
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

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

This pattern is preferred to `cloneElement` because it is more explicit.

---

### Passing data through context {/*passing-data-through-context*/}

Another alternative to `cloneElement` is to [pass data through context.](/learn/passing-data-deeply-with-context)


For example, you can call [`createContext`](/reference/react/createContext) to define a `HighlightContext`:

```js
export const HighlightContext = createContext(false);
```

Your `List` component can wrap every item it renders into a `HighlightContext` provider:

```js {8,10}
export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return (
          <HighlightContext.Provider key={item.id} value={isHighlighted}>
            {renderItem(item)}
          </HighlightContext.Provider>
        );
      })}
```

With this approach, `Row` does not need to receive an `isHighlighted` prop at all. Instead, it reads the context:

```js Row.js {2}
export default function Row({ title }) {
  const isHighlighted = useContext(HighlightContext);
  // ...
```

This allows the calling component to not know or worry about passing `isHighlighted` to `<Row>`:

```js {4}
<List
  items={products}
  renderItem={product =>
    <Row title={product.title} />
  }
/>
```

Instead, `List` and `Row` coordinate the highlighting logic through context.

<Sandpack>

```js
import List from './List.js';
import Row from './Row.js';
import { products } from './data.js';

export default function App() {
  return (
    <List
      items={products}
      renderItem={(product) =>
        <Row title={product.title} />
      }
    />
  );
}
```

```js List.js active
import { useState } from 'react';
import { HighlightContext } from './HighlightContext.js';

export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return (
          <HighlightContext.Provider
            key={item.id}
            value={isHighlighted}
          >
            {renderItem(item)}
          </HighlightContext.Provider>
        );
      })}
      <hr />
      <button onClick={() => {
        setSelectedIndex(i =>
          (i + 1) % items.length
        );
      }}>
        Next
      </button>
    </div>
  );
}
```

```js Row.js
import { useContext } from 'react';
import { HighlightContext } from './HighlightContext.js';

export default function Row({ title }) {
  const isHighlighted = useContext(HighlightContext);
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js HighlightContext.js
import { createContext } from 'react';

export const HighlightContext = createContext(false);
```

```js data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
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

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

[Learn more about passing data through context.](/reference/react/useContext#passing-data-deeply-into-the-tree)

---

### Extracting logic into a custom Hook {/*extracting-logic-into-a-custom-hook*/}

Another approach you can try is to extract the "non-visual" logic into your own Hook, and use the information returned by your Hook to decide what to render. For example, you could write a `useList` custom Hook like this:

```js
import { useState } from 'react';

export default function useList(items) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  function onNext() {
    setSelectedIndex(i =>
      (i + 1) % items.length
    );
  }

  const selected = items[selectedIndex];
  return [selected, onNext];
}
```

Then you could use it like this:

```js {2,9,13}
export default function App() {
  const [selected, onNext] = useList(products);
  return (
    <div className="List">
      {products.map(product =>
        <Row
          key={product.id}
          title={product.title}
          isHighlighted={selected === product}
        />
      )}
      <hr />
      <button onClick={onNext}>
        Next
      </button>
    </div>
  );
}
```

The data flow is explicit, but the state is inside the `useList` custom Hook that you can use from any component:

<Sandpack>

```js
import Row from './Row.js';
import useList from './useList.js';
import { products } from './data.js';

export default function App() {
  const [selected, onNext] = useList(products);
  return (
    <div className="List">
      {products.map(product =>
        <Row
          key={product.id}
          title={product.title}
          isHighlighted={selected === product}
        />
      )}
      <hr />
      <button onClick={onNext}>
        Next
      </button>
    </div>
  );
}
```

```js useList.js
import { useState } from 'react';

export default function useList(items) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  function onNext() {
    setSelectedIndex(i =>
      (i + 1) % items.length
    );
  }

  const selected = items[selectedIndex];
  return [selected, onNext];
}
```

```js Row.js
export default function Row({ title, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
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

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

This approach is particularly useful if you want to reuse this logic between different components.
