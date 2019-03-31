---
id: lists-and-keys
title: 리스트와 Key
permalink: docs/lists-and-keys.html
prev: conditional-rendering.html
next: forms.html
---

First, let's review how you transform lists in JavaScript.
먼저, 자바스크립트에서 리스트를 어떻게 변환하는지 살펴봅시다.

Given the code below, we use the [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) function to take an array of `numbers` and double their values. We assign the new array returned by `map()` to the variable `doubled` and log it:
아래 코드에서 [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)함수를 이용하여 `numbers` 배열의 값을 두배로 만든 후 `map()`에서 반환하는 새 배열을 `doubled` 변수에 할당하고 로그를 확인 합니다.
```javascript{2}
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((number) => number * 2);
console.log(doubled);
```

This code logs `[2, 4, 6, 8, 10]` to the console.
이 코드는 콘솔에 `[2, 4, 6, 8, 10]`을 표시합니다.
In React, transforming arrays into lists of [elements](/docs/rendering-elements.html) is nearly identical.
React에서 배열을 [엘리먼트](/docs/rendering-elements.html) 리스트로 만드는 방식은 이와 거의 동일 합니다.

### Rendering Multiple Components {#rendering-multiple-components}
### 여러개의 컴포넌트 렌더링 하기 {#rendering-multiple-components}
You can build collections of elements and [include them in JSX](/docs/introducing-jsx.html#embedding-expressions-in-jsx) using curly braces `{}`.
엘리먼트 모음을 만들고 중괄호 `{}`를 이용하여 [JSX에 포함](/docs/introducing-jsx.html#embedding-expressions-in-jsx)시킬 수 있습니다.


Below, we loop through the `numbers` array using the JavaScript [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) function. We return a `<li>` element for each item. Finally, we assign the resulting array of elements to `listItems`:
아래에서 Javascript [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) 함수를 사용하여 `numbers` 배열을 반복 실행 합니다. 각 항목에 대해 `<li>` 엘리먼트를 반환하고, 엘리먼트 배열의 결과를 `listItems`에 지정 합니다.

```javascript{2-4}
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li>{number}</li>
);
```

We include the entire `listItems` array inside a `<ul>` element, and [render it to the DOM](/docs/rendering-elements.html#rendering-an-element-into-the-dom):
전체 `listItems` 배열을 `<ul>`엘리먼트 안에 포함시키고 [DOM에 렌더링합니다.](/docs/rendering-elements.html#rendering-an-element-into-the-dom):

```javascript{2}
ReactDOM.render(
  <ul>{listItems}</ul>,
  document.getElementById('root')
);
```

[**Try it on CodePen**](https://codepen.io/gaearon/pen/GjPyQr?editors=0011)
[**CodePen에서 실행하기**](https://codepen.io/gaearon/pen/GjPyQr?editors=0011)

This code displays a bullet list of numbers between 1 and 5.
이 코드는 1부터 5까지의 숫자로 이루어진 리스트를 보여줍니다.
### Basic List Component {#basic-list-component}
### 기본 리스트 컴포넌트 {#basic-list-component}

Usually you would render lists inside a [component](/docs/components-and-props.html).
일반적으로 [컴포넌트](/docs/components-and-props.html) 안에서 리스트를 렌더링합니다.

We can refactor the previous example into a component that accepts an array of `numbers` and outputs a list of elements.
이전 예제를 `numbers` 배열을 받아서 순서 없는 엘리먼트 리스트로 출력하는 컴포넌트로 리팩토링할 수 있습니다.

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
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

When you run this code, you'll be given a warning that a key should be provided for list items. A "key" is a special string attribute you need to include when creating lists of elements. We'll discuss why it's important in the next section.
이 코드를 실행하면 리스트의 각 항목에 key를 넣어야 한다는 경고가 표시됩니다. "key"는 엘리먼트 리스트를 만들 때 포함해야 하는 특수한 문자열 속성입니다. 다음 섹션에서 key의 중요성에 대해서 더 설명하겠습니다.
Let's assign a `key` to our list items inside `numbers.map()` and fix the missing key issue.
`numbers.map()` 안에서 리스트의 각 항목에 `key`를 할당하여 키 누락 문제를 해결하겠습니다.

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

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

[**Try it on CodePen**](https://codepen.io/gaearon/pen/jrXYRR?editors=0011)
[**CodePen에서 실행하기**](https://codepen.io/gaearon/pen/jrXYRR?editors=0011)

## Keys {#keys}
## Key {#keys}

Keys help React identify which items have changed, are added, or are removed. Keys should be given to the elements inside the array to give the elements a stable identity:
Key는 React가 어떤 항목의 변경, 추가 또는 제거할지 식별하는 것을 돕습니다. key는 엘리먼트에 안정적인 고유성을 부여하기 위해 배열 내부의 엘리먼트에 지정해야 합니다.

```js{3}
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li key={number.toString()}>
    {number}
  </li>
);
```

The best way to pick a key is to use a string that uniquely identifies a list item among its siblings. Most often you would use IDs from your data as keys:
Key를 선택하는 가장 좋은 방법은 리스트의 다른 항목들 사이에서 해당 항목을 고유하게 식별할 수 있는 문자열을 사용 하는 것 입니다. 대부분의 경우 데이터의 ID를 key로 사용합니다.

```js{2}
const todoItems = todos.map((todo) =>
  <li key={todo.id}>
    {todo.text}
  </li>
);
```

When you don't have stable IDs for rendered items, you may use the item index as a key as a last resort:
렌더링 된 항목에 대한 안정적인 ID가 없다면, 최후의 수단으로 항목의 인덱스를 key로 사용할 수 있습니다.

```js{2,3}
const todoItems = todos.map((todo, index) =>
  // Only do this if items have no stable IDs
  <li key={index}>
    {todo.text}
  </li>
);
```

We don't recommend using indexes for keys if the order of items may change. This can negatively impact performance and may cause issues with component state. Check out Robin Pokorny's article for an [in-depth explanation on the negative impacts of using an index as a key](https://medium.com/@robinpokorny/index-as-a-key-is-an-anti-pattern-e0349aece318). If you choose not to assign an explicit key to list items then React will default to using indexes as keys.
항목의 순서가 바뀔 수 있는 경우 key에 인덱스를 사용하는 것은 권장되지 않습니다. 이로 인해 성능이 저하되거나 컴포넌트의 state와 관련된 문제가 발생할 수 있습니다. Robin Pokorny's가 작성한 아티클인 [인덱스를 key로 사용할 경우 부정적인 영향에 대한 상세 설명](https://medium.com/@robinpokorny/index-as-a-key-is-an-anti-pattern-e0349aece318)을 참고 하시길 바랍니다. 만약 리스트 항목에 명시적으로 key를 지정하지 않으면 React는 기본적으로 인덱스를 key로 사용합니다.

Here is an [in-depth explanation about why keys are necessary](/docs/reconciliation.html#recursing-on-children) if you're interested in learning more.
더 자세히 알고 싶다면 [왜 키가 필요한가에 대한 더 깊은 설명](/docs/reconciliation.html#recursing-on-children)을 읽어보세요.

### Extracting Components with Keys {#extracting-components-with-keys}
### Key로 컴포넌트 추출하기 {#extracting-components-with-keys}

Keys only make sense in the context of the surrounding array.
키는 주변 배열의 context에서만 의미가 있습니다.

For example, if you [extract](/docs/components-and-props.html#extracting-components) a `ListItem` component, you should keep the key on the `<ListItem />` elements in the array rather than on the `<li>` element in the `ListItem` itself.
예를 들어 , `ListItem` 컴포넌트를 [추출](/docs/components-and-props.html#extracting-components) 한 경우, `ListItem` 안에있는 `<li>` 엘리먼트가 아니라 배열의 `<ListItem />` 엘리먼트가 key를 가져야 합니다.

**Example: Incorrect Key Usage**
**예시: 잘못된 Key 사용법**

```javascript{4,5,14,15}
function ListItem(props) {
  const value = props.value;
  return (
    // Wrong! There is no need to specify the key here:
    // 틀렸습니다! 여기에는 key를 지정할 필요가 없습니다.
    <li key={value.toString()}>
      {value}
    </li>
  );
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // Wrong! The key should have been specified here:
    // 틀렸습니다! 여기에 key를 지정해야 합니다.
    <ListItem value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

**Example: Correct Key Usage**
**예시: 

```javascript{2,3,9,10}
function ListItem(props) {
  // Correct! There is no need to specify the key here:
  // 맞습니다! 여기에는 key를 지정할 필요가 없습니다.
  return <li>{props.value}</li>;
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // Correct! Key should be specified inside the array.
    // 맞습니다! 배열 안에 key를 지정해야 합니다.
    <ListItem key={number.toString()}
              value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

[**Try it on CodePen**](https://codepen.io/gaearon/pen/ZXeOGM?editors=0010)
[**CodePen에서 실행하기**](https://codepen.io/gaearon/pen/ZXeOGM?editors=0010)


A good rule of thumb is that elements inside the `map()` call need keys.
경험상 `map()` 함수 내부에 있는 엘리먼트에 key를 넣어 주는게 좋습니다.


### Keys Must Only Be Unique Among Siblings {#keys-must-only-be-unique-among-siblings}
### Key는 주변 항목들 중에서만 고유한 값이어야 한다. {#keys-must-only-be-unique-among-siblings}

Keys used within arrays should be unique among their siblings. However they don't need to be globally unique. We can use the same keys when we produce two different arrays:
Key는 배열안에서 주변 항목에 대해 고유해야 하고, 전체 범위에서 고유할 필요는 없습니다. 두 개의 다른 배열을 만들 때 동일한 key를 사용할 수 있습니다.

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
ReactDOM.render(
  <Blog posts={posts} />,
  document.getElementById('root')
);
```

[**Try it on CodePen**](https://codepen.io/gaearon/pen/NRZYGN?editors=0010)
[**CodePen에서 실행하기**](https://codepen.io/gaearon/pen/NRZYGN?editors=0010)

Keys serve as a hint to React but they don't get passed to your components. If you need the same value in your component, pass it explicitly as a prop with a different name:
React에서 key는 힌트를 제공하지만 컴포넌트로 전달되지는 않습니다. 컴포넌트에서 동일한 값을 필요로하면 다른 이름의 prop를 명시적으로 전달 합니다.

```js{3,4}
const content = posts.map((post) =>
  <Post
    key={post.id}
    id={post.id}
    title={post.title} />
);
```

With the example above, the `Post` component can read `props.id`, but not `props.key`.
위 예제에서 `Post`컴포넌트는 `props.id`는 읽을 수 있지만 `props.key`는 읽을 수 없습니다.

### Embedding map() in JSX {#embedding-map-in-jsx}
### JSX에 map() 포함시키기 {#embedding-map-in-jsx}

In the examples above we declared a separate `listItems` variable and included it in JSX:
위 예제에서는 별도의 `listItems` 변수를 선언하고 이를 JSX에 포함시켰습니다.

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

JSX allows [embedding any expression](/docs/introducing-jsx.html#embedding-expressions-in-jsx) in curly braces so we could inline the `map()` result:
JSX를 사용하면 중괄호 안에 [모든 표현식을 포함](/docs/introducing-jsx.html#embedding-expressions-in-jsx)시킬 수 있으므로 `map()` 결과를 인라인으로 처리할 수 있습니다.

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

[**Try it on CodePen**](https://codepen.io/gaearon/pen/BLvYrB?editors=0010)
[**CodePen에서 실행하기**](https://codepen.io/gaearon/pen/BLvYrB?editors=0010)

Sometimes this results in clearer code, but this style can also be abused. Like in JavaScript, it is up to you to decide whether it is worth extracting a variable for readability. Keep in mind that if the `map()` body is too nested, it might be a good time to [extract a component](/docs/components-and-props.html#extracting-components).

이 방식을 사용하면 코드가 더 깔끔할수 있지만, 이 방식을 남용하는 것은 좋지 않습니다. Javascript와 마찬가지로, 가독성을 위해 변수로 추출해야할지 아니면 인라인으로 넣을지는 개발자가 직접 판단 해야 합니다. `map()` 함수가 너무 중첩되어있다면, [컴포넌트로 추출](/docs/components-and-props.html#extracting-components) 하는 것이 좋습니다.
