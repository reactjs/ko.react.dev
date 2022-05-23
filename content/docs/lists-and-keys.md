---
id: lists-and-keys
title: 리스트와 Key
permalink: docs/lists-and-keys.html
prev: conditional-rendering.html
next: forms.html
---

먼저 JavaScript에서 리스트를 어떻게 변환하는지 살펴봅시다.

아래는 [`map()`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/map)함수를 이용하여 `numbers` 배열의 값을 두배로 만든 후 `map()`에서 반환하는 새 배열을 `doubled` 변수에 할당하고 로그를 확인하는 코드입니다.

```javascript{2}
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((number) => number * 2);
console.log(doubled);
```

이 코드는 콘솔에 `[2, 4, 6, 8, 10]`을 출력합니다.

React에서 배열을 [엘리먼트](/docs/rendering-elements.html) 리스트로 만드는 방식은 이와 거의 동일 합니다.

### 여러개의 컴포넌트 렌더링 하기 {#rendering-multiple-components}

엘리먼트 모음을 만들고 중괄호 `{}`를 이용하여 [JSX에 포함](/docs/introducing-jsx.html#embedding-expressions-in-jsx) 시킬 수 있습니다.

아래의 JavaScript [`map()`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/map) 함수를 사용하여 `numbers` 배열을 반복 실행합니다. 각 항목에 대해 `<li>` 엘리먼트를 반환하고 엘리먼트 배열의 결과를 `listItems`에 저장합니다.

```javascript{2-4}
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li>{number}</li>
);
```

<<<<<<< HEAD
`listItems` 배열을 `<ul>`엘리먼트 안에 포함하고 [DOM에 렌더링합니다.](/content/docs/rendering-elements.html#rendering-an-element-into-the-dom)
=======
Then, we can include the entire `listItems` array inside a `<ul>` element:
>>>>>>> 3aac8c59848046fb427aab4373a7aadd7069a24c

```javascript{2}
<ul>{listItems}</ul>
```

[**CodePen에서 실행하기**](https://codepen.io/gaearon/pen/GjPyQr?editors=0011)

이 코드는 1부터 5까지의 숫자로 이루어진 리스트를 보여줍니다.

### 기본 리스트 컴포넌트 {#basic-list-component}

일반적으로 [컴포넌트](/docs/components-and-props.html) 안에서 리스트를 렌더링합니다.

이전 예시를 `numbers` 배열을 받아서 순서 없는 엘리먼트 리스트를 출력하는 컴포넌트로 리팩토링할 수 있습니다.

```javascript{3-5,7,13}
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li>{number}</li>
  );
  return (
    <ul>{listItems}</ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<NumberList numbers={numbers} />);
```

이 코드를 실행하면 리스트의 각 항목에 key를 넣어야 한다는 경고가 표시됩니다. "key"는 엘리먼트 리스트를 만들 때 포함해야 하는 특수한 문자열 어트리뷰트입니다. 다음 섹션에서 key의 중요성에 대해서 더 설명하겠습니다.
이제 `numbers.map()` 안에서 리스트의 각 항목에 `key`를 할당하여 키 누락 문제를 해결하겠습니다.

```javascript{4}
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li key={number.toString()}>
      {number}
    </li>
  );
  return (
    <ul>{listItems}</ul>
  );
}
```

[**CodePen에서 실행하기**](https://codepen.io/gaearon/pen/jrXYRR?editors=0011)

## Key {#keys}

Key는 React가 어떤 항목을 변경, 추가 또는 삭제할지 식별하는 것을 돕습니다. key는 엘리먼트에 안정적인 고유성을 부여하기 위해 배열 내부의 엘리먼트에 지정해야 합니다.

```js{3}
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li key={number.toString()}>
    {number}
  </li>
);
```

Key를 선택하는 가장 좋은 방법은 리스트의 다른 항목들 사이에서 해당 항목을 고유하게 식별할 수 있는 문자열을 사용하는 것입니다. 대부분의 경우 데이터의 ID를 key로 사용합니다.

```js{2}
const todoItems = todos.map((todo) =>
  <li key={todo.id}>
    {todo.text}
  </li>
);
```

렌더링 한 항목에 대한 안정적인 ID가 없다면 최후의 수단으로 항목의 인덱스를 key로 사용할 수 있습니다.

```js{2,3}
const todoItems = todos.map((todo, index) =>
  // Only do this if items have no stable IDs
  <li key={index}>
    {todo.text}
  </li>
);
```

항목의 순서가 바뀔 수 있는 경우 key에 인덱스를 사용하는 것은 권장하지 않습니다. 이로 인해 성능이 저하되거나 컴포넌트의 state와 관련된 문제가 발생할 수 있습니다. Robin Pokorny's가 작성한 글인 [인덱스를 key로 사용할 경우 부정적인 영향에 대한 상세 설명](https://medium.com/@robinpokorny/index-as-a-key-is-an-anti-pattern-e0349aece318)을 참고하시길 바랍니다. 리스트 항목에 명시적으로 key를 지정하지 않으면 React는 기본적으로 인덱스를 key로 사용합니다.

더 자세히 알고 싶다면 [왜 key가 필요한가에 대한 더 자세한 설명](/docs/reconciliation.html#recursing-on-children)을 읽어보세요.

### Key로 컴포넌트 추출하기 {#extracting-components-with-keys}

키는 주변 배열의 context에서만 의미가 있습니다.

예를 들어 `ListItem` 컴포넌트를 [추출](/docs/components-and-props.html#extracting-components) 한 경우 `ListItem` 안에 있는 `<li>` 엘리먼트가 아니라 배열의 `<ListItem />` 엘리먼트가 key를 가져야 합니다.

**예시: 잘못된 Key 사용법**

```javascript{4,5,14,15}
function ListItem(props) {
  const value = props.value;
  return (
    // 틀렸습니다! 여기에는 key를 지정할 필요가 없습니다.
    <li key={value.toString()}>
      {value}
    </li>
  );
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // 틀렸습니다! 여기에 key를 지정해야 합니다.
    <ListItem value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}
```

**예시: 올바른 Key 사용법**

```javascript{2,3,9,10}
function ListItem(props) {
  // 맞습니다! 여기에는 key를 지정할 필요가 없습니다.
  return <li>{props.value}</li>;
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // 맞습니다! 배열 안에 key를 지정해야 합니다.
    <ListItem key={number.toString()} value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}
```

[**CodePen에서 실행하기**](https://codepen.io/gaearon/pen/ZXeOGM?editors=0010)

경험상 `map()` 함수 내부에 있는 엘리먼트에 key를 넣어 주는 게 좋습니다.

### Key는 형제 사이에서만 고유한 값이어야 한다. {#keys-must-only-be-unique-among-siblings}

Key는 배열 안에서 형제 사이에서 고유해야 하고 전체 범위에서 고유할 필요는 없습니다. 두 개의 다른 배열을 만들 때 동일한 key를 사용할 수 있습니다.

```js{2,5,11,12,19,21}
function Blog(props) {
  const sidebar = (
    <ul>
      {props.posts.map((post) =>
        <li key={post.id}>
          {post.title}
        </li>
      )}
    </ul>
  );
  const content = props.posts.map((post) =>
    <div key={post.id}>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
    </div>
  );
  return (
    <div>
      {sidebar}
      <hr />
      {content}
    </div>
  );
}

const posts = [
  {id: 1, title: 'Hello World', content: 'Welcome to learning React!'},
  {id: 2, title: 'Installation', content: 'You can install React from npm.'}
];

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Blog posts={posts} />);
```

[**CodePen에서 실행하기**](https://codepen.io/gaearon/pen/NRZYGN?editors=0010)

React에서 key는 힌트를 제공하지만 컴포넌트로 전달하지는 않습니다. 컴포넌트에서 key와 동일한 값이 필요하면 다른 이름의 prop으로 명시적으로 전달합니다.

```js{3,4}
const content = posts.map((post) =>
  <Post
    key={post.id}
    id={post.id}
    title={post.title} />
);
```

위 예시에서 `Post` 컴포넌트는 `props.id`를 읽을 수 있지만 `props.key`는 읽을 수 없습니다.

### JSX에 map() 포함시키기 {#embedding-map-in-jsx}

위 예시에서 별도의 `listItems` 변수를 선언하고 이를 JSX에 포함했습니다.

```js{3-6}
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <ListItem key={number.toString()}
              value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}
```

JSX를 사용하면 중괄호 안에 [모든 표현식을 포함](/docs/introducing-jsx.html#embedding-expressions-in-jsx) 시킬 수 있으므로 `map()` 함수의 결과를 인라인으로 처리할 수 있습니다.

```js{5-8}
function NumberList(props) {
  const numbers = props.numbers;
  return (
    <ul>
      {numbers.map((number) =>
        <ListItem key={number.toString()}
                  value={number} />
      )}
    </ul>
  );
}
```

[**CodePen에서 실행하기**](https://codepen.io/gaearon/pen/BLvYrB?editors=0010)

이 방식을 사용하면 코드가 더 깔끔해 지지만, 이 방식을 남발하는 것은 좋지 않습니다. JavaScript와 마찬가지로 가독성을 위해 변수로 추출해야 할지 아니면 인라인으로 넣을지는 개발자가 직접 판단해야 합니다. `map()` 함수가 너무 중첩된다면 [컴포넌트로 추출](/docs/components-and-props.html#extracting-components) 하는 것이 좋습니다.
