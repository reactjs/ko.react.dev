---
id: JSX 더 자세히
title: JSX 더 자세히
permalink: docs/jsx-in-depth.html
redirect_from:
  - "docs/jsx-spread.html"
  - "docs/jsx-gotchas.html"
  - "tips/if-else-in-JSX.html"
  - "tips/self-closing-tag.html"
  - "tips/maximum-number-of-jsx-root-nodes.html"
  - "tips/children-props-type.html"
  - "docs/jsx-in-depth-zh-CN.html"
  - "docs/jsx-in-depth-ko-KR.html"
---
근본적으로, JSX는 `React.createElement(component, props, ...children)` 함수에 대한 문법적 설탕을 제공할 뿐입니다. 다음 JSX 코드는:

```js
<MyButton color="blue" shadowSize={2}>
  Click Me
</MyButton>
```

아래와 같이 컴파일됩니다.

```js
React.createElement(
  MyButton,
  {color: 'blue', shadowSize: 2},
  'Click Me'
)
```
자식 컴포넌트가 없다면 아래와 같이 자기 자신을 닫는 형태의 태그를 쓸 수 있습니다.

```js
<div className="sidebar" />
```

위의 코드는 아래와 같이 컴파일 됩니다.

```js
React.createElement(
  'div',
  {className: 'sidebar'},
  null
)
```
특정 JSX가 어떻게 JavaScript로 변환되는지 시험해보고 싶다면 [온라인 babel 컴파일러](babel://jsx-simple-example)를 사용해보세요.

If you want to test out how some specific JSX is converted into JavaScript, you can try out [the online Babel compiler](babel://jsx-simple-example).

## React Element의 타입 지정하기 {#specifying-the-react-element-type}

JSX 태그의 첫 부분은 React element의 타입을 결정합니다.

대문자로 시작하는 JSX 태그는 React component를 지정합니다. 이 태그들은 같은 이름을 가진 변수들을 직접 참조합니다. 만약 `<Foo />`와 같은 JSX 표현을 쓰려고 한다면 Foo가 반드시 스코프 내에 존재해야 합니다.


### React가 스코프 내에 존재해야 합니다 {#react-must-be-in-scope}

JSX는 `React.createElement`를 호출하는 코드로 컴파일 되기 때문에 `React` 라이브러리 역시 JSX 코드와 같은 스코프 내에 존재해야만 합니다.

<!-- original was ==> For example, both of the imports are necessary in this code, even though `React` and `CustomButton` are not directly referenced from JavaScript // added in reference to JSX tag as it was difficult to refer to its usage without mentioning, please check if appropriate.-->
아래의 예시를 통해 보면, `React`와 `CustomButton`는 JavaScript 코드에선 직접적으로 사용되진 않지만 JSX 태그로 사용하기 위해 꼭 import 해야합니다.

```js{1,2,5}
import React from 'react';
import CustomButton from './CustomButton';

function WarningButton() {
  // return React.createElement(CustomButton, {color: 'red'}, null);
  return <CustomButton color="red" />;
}
```
만약 JavaScript 번들러를 사용하지 않고 `<script>` 태그를 통해 React를 불러왓다면 `React`는 전역 변수로서 존재하기 때문에 별도로 불러올 필요가 없습니다.

### JSX 타입을 위한 점 표기법 사용 {#using-dot-notation-for-jsx-type}

JSX 내에서도 점 표기법을 사용하여 React component를 참조할 수 있습니다. 이 방법은 하나의 모듈에서 복수의 React component들을 export 하는 경우에 편리하게 사용할 수 있습니다. 예를 들어, 만약 `MyComponents.DatePicker`이 component 하면, 아래와 같은 방법으로 직접 사용할 수 있습니다.

```js{10}
import React from 'react';

const MyComponents = {
  DatePicker: function DatePicker(props) {
    return <div>Imagine a {props.color} datepicker here.</div>;
  }
}

function BlueDatePicker() {
  return <MyComponents.DatePicker color="blue" />;
}
```
### 사용자 정의 Component는 반드시 대문자로 시작해야합니다 {#user-defined-components-must-be-capitalized}

Element가 소문자로 시작하는 경우에는 `<div>` 나 `<span>` 같은 내장 컴포넌트라는 것을 뜻하며 `'div'` 나 `'span'` 같은 문자열 형태로 `React.createElement`에 전달됩니다. `<Foo />`와 같이 대문자로 시작하는 타입들은 `React.createElement(Foo)`의 형태로 컴파일 되며 JavaScript 파일 내에 사용자가 정의했거나 import 한 component를 가리킵니다.

Component의 이름은 대문자로 시작하는 것을 추천합니다. 만약 소문자로 시작하는 component를 사용해야 한다면, 대문자로 시작하는 변수에 할당한 뒤 JSX에서 이 변수를 사용하세요.

예를 들어 아래의 코드는 예상대로 실행되지 않을 것 입니다.

```js{3,4,10,11}
import React from 'react';

// Wrong! This is a component and should have been capitalized:
function hello(props) {
  // Correct! This use of <div> is legitimate because div is a valid HTML tag:
  return <div>Hello {props.toWhat}</div>;
}

function HelloWorld() {
  // Wrong! React thinks <hello /> is an HTML tag because it's not capitalized:
  return <hello toWhat="World" />;
}
```

이를 고치기 위해 우리는 `hello` 를 `Hello`로 바꾸고 이를 참조할 때 `<Hello />`를 사용할 것 입니다. 

```js{3,4,10,11}
import React from 'react';

// Correct! This is a component and should be capitalized:
function Hello(props) {
  // Correct! This use of <div> is legitimate because div is a valid HTML tag:
  return <div>Hello {props.toWhat}</div>;
}

function HelloWorld() {
  // Correct! React knows <Hello /> is a component because it's capitalized.
  return <Hello toWhat="World" />;
}
```

### 실행 중에 타입 선택하기 {#choosing-the-type-at-runtime}

React element 타입에 일반적인 표현식은 사용할 수 없습니다. 만약 element 타입을 지정할 때 일반적인 표현식을 사용하고자 한다면 대문자로 시작하는 변수에 배정한 후 사용할 수 있습니다. 예를 들어 아래와 같이 prop에 따라 다른 component를 render 해야하는 경우들이 종종 있습니다.

```js{10,11}
import React from 'react';
import { PhotoStory, VideoStory } from './stories';

const components = {
  photo: PhotoStory,
  video: VideoStory
};

function Story(props) {
  // Wrong! JSX type can't be an expression.
  return <components[props.storyType] story={props.story} />;
}
```

To fix this, we will assign the type to a capitalized variable first:

```js{10-12}
import React from 'react';
import { PhotoStory, VideoStory } from './stories';

const components = {
  photo: PhotoStory,
  video: VideoStory
};

function Story(props) {
  // Correct! JSX type can be a capitalized variable.
  const SpecificStory = components[props.storyType];
  return <SpecificStory story={props.story} />;
}
```

## JSX 안에서의 prop 사용 {#props-in-jsx}

JSX 안에서 prop을 사용하는 방법은 여러가지가 있습니다.

### JavaScript Expressions as Props {#javascript-expressions-as-props}

아래의 예시와 같이 JavaScript 표현을 `{}` 안에 넣음으로 JSX 안에서 prop으로 사용할 수 있습니다. 

```js
<MyComponent foo={1 + 2 + 3 + 4} />
```

For `MyComponent`, the value of `props.foo` will be `10` because the expression `1 + 2 + 3 + 4` gets evaluated.

`if` statements and `for` loops are not expressions in JavaScript, so they can't be used in JSX directly. Instead, you can put these in the surrounding code. For example:

```js{3-7}
function NumberDescriber(props) {
  let description;
  if (props.number % 2 == 0) {
    description = <strong>even</strong>;
  } else {
    description = <i>odd</i>;
  }
  return <div>{props.number} is an {description} number</div>;
}
```

You can learn more about [conditional rendering](/docs/conditional-rendering.html) and [loops](/docs/lists-and-keys.html) in the corresponding sections.

### String Literals {#string-literals}

You can pass a string literal as a prop. These two JSX expressions are equivalent:

```js
<MyComponent message="hello world" />

<MyComponent message={'hello world'} />
```

When you pass a string literal, its value is HTML-unescaped. So these two JSX expressions are equivalent:

```js
<MyComponent message="&lt;3" />

<MyComponent message={'<3'} />
```

This behavior is usually not relevant. It's only mentioned here for completeness.

### Props Default to "True" {#props-default-to-true}

If you pass no value for a prop, it defaults to `true`. These two JSX expressions are equivalent:

```js
<MyTextBox autocomplete />

<MyTextBox autocomplete={true} />
```

In general, we don't recommend using this because it can be confused with the [ES6 object shorthand](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Object_initializer#New_notations_in_ECMAScript_2015) `{foo}` which is short for `{foo: foo}` rather than `{foo: true}`. This behavior is just there so that it matches the behavior of HTML.

### Spread Attributes {#spread-attributes}

If you already have `props` as an object, and you want to pass it in JSX, you can use `...` as a "spread" operator to pass the whole props object. These two components are equivalent:

```js{7}
function App1() {
  return <Greeting firstName="Ben" lastName="Hector" />;
}

function App2() {
  const props = {firstName: 'Ben', lastName: 'Hector'};
  return <Greeting {...props} />;
}
```

You can also pick specific props that your component will consume while passing all other props using the spread operator.

```js{2}
const Button = props => {
  const { kind, ...other } = props;
  const className = kind === "primary" ? "PrimaryButton" : "SecondaryButton";
  return <button className={className} {...other} />;
};

const App = () => {
  return (
    <div>
      <Button kind="primary" onClick={() => console.log("clicked!")}>
        Hello World!
      </Button>
    </div>
  );
};
```

In the example above, the `kind` prop is safely consumed and *is not* passed on to the `<button>` element in the DOM.
All other props are passed via the `...other` object making this component really flexible. You can see that it passes an `onClick` and `children` props.

Spread attributes can be useful but they also make it easy to pass unnecessary props to components that don't care about them or to pass invalid HTML attributes to the DOM. We recommend using this syntax sparingly.  

## Children in JSX {#children-in-jsx}

In JSX expressions that contain both an opening tag and a closing tag, the content between those tags is passed as a special prop: `props.children`. There are several different ways to pass children:

### String Literals {#string-literals-1}

You can put a string between the opening and closing tags and `props.children` will just be that string. This is useful for many of the built-in HTML elements. For example:

```js
<MyComponent>Hello world!</MyComponent>
```

This is valid JSX, and `props.children` in `MyComponent` will simply be the string `"Hello world!"`. HTML is unescaped, so you can generally write JSX just like you would write HTML in this way:

```html
<div>This is valid HTML &amp; JSX at the same time.</div>
```

JSX removes whitespace at the beginning and ending of a line. It also removes blank lines. New lines adjacent to tags are removed; new lines that occur in the middle of string literals are condensed into a single space. So these all render to the same thing:

```js
<div>Hello World</div>

<div>
  Hello World
</div>

<div>
  Hello
  World
</div>

<div>

  Hello World
</div>
```

### JSX Children {#jsx-children}

You can provide more JSX elements as the children. This is useful for displaying nested components:

```js
<MyContainer>
  <MyFirstComponent />
  <MySecondComponent />
</MyContainer>
```

You can mix together different types of children, so you can use string literals together with JSX children. This is another way in which JSX is like HTML, so that this is both valid JSX and valid HTML:

```html
<div>
  Here is a list:
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
</div>
```

A React component can also return an array of elements:

```js
render() {
  // No need to wrap list items in an extra element!
  return [
    // Don't forget the keys :)
    <li key="A">First item</li>,
    <li key="B">Second item</li>,
    <li key="C">Third item</li>,
  ];
}
```

### JavaScript Expressions as Children {#javascript-expressions-as-children}

You can pass any JavaScript expression as children, by enclosing it within `{}`. For example, these expressions are equivalent:

```js
<MyComponent>foo</MyComponent>

<MyComponent>{'foo'}</MyComponent>
```

This is often useful for rendering a list of JSX expressions of arbitrary length. For example, this renders an HTML list:

```js{2,9}
function Item(props) {
  return <li>{props.message}</li>;
}

function TodoList() {
  const todos = ['finish doc', 'submit pr', 'nag dan to review'];
  return (
    <ul>
      {todos.map((message) => <Item key={message} message={message} />)}
    </ul>
  );
}
```

JavaScript expressions can be mixed with other types of children. This is often useful in lieu of string templates:

```js{2}
function Hello(props) {
  return <div>Hello {props.addressee}!</div>;
}
```

### Functions as Children {#functions-as-children}

Normally, JavaScript expressions inserted in JSX will evaluate to a string, a React element, or a list of those things. However, `props.children` works just like any other prop in that it can pass any sort of data, not just the sorts that React knows how to render. For example, if you have a custom component, you could have it take a callback as `props.children`:

```js{4,13}
// Calls the children callback numTimes to produce a repeated component
function Repeat(props) {
  let items = [];
  for (let i = 0; i < props.numTimes; i++) {
    items.push(props.children(i));
  }
  return <div>{items}</div>;
}

function ListOfTenThings() {
  return (
    <Repeat numTimes={10}>
      {(index) => <div key={index}>This is item {index} in the list</div>}
    </Repeat>
  );
}
```

Children passed to a custom component can be anything, as long as that component transforms them into something React can understand before rendering. This usage is not common, but it works if you want to stretch what JSX is capable of.

### Booleans, Null, and Undefined Are Ignored {#booleans-null-and-undefined-are-ignored}

`false`, `null`, `undefined`, and `true` are valid children. They simply don't render. These JSX expressions will all render to the same thing:

```js
<div />

<div></div>

<div>{false}</div>

<div>{null}</div>

<div>{undefined}</div>

<div>{true}</div>
```

This can be useful to conditionally render React elements. This JSX only renders a `<Header />` if `showHeader` is `true`:

```js{2}
<div>
  {showHeader && <Header />}
  <Content />
</div>
```

One caveat is that some ["falsy" values](https://developer.mozilla.org/en-US/docs/Glossary/Falsy), such as the `0` number, are still rendered by React. For example, this code will not behave as you might expect because `0` will be printed when `props.messages` is an empty array:

```js{2}
<div>
  {props.messages.length &&
    <MessageList messages={props.messages} />
  }
</div>
```

To fix this, make sure that the expression before `&&` is always boolean:

```js{2}
<div>
  {props.messages.length > 0 &&
    <MessageList messages={props.messages} />
  }
</div>
```

Conversely, if you want a value like `false`, `true`, `null`, or `undefined` to appear in the output, you have to [convert it to a string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#String_conversion) first:

```js{2}
<div>
  My JavaScript variable is {String(myVariable)}.
</div>
```
