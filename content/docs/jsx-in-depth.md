---
id: jsx-in-depth
title: JSX 이해하기
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

근본적으로, JSX는 `React.createElement(component, props, ...children)` 함수에 대한 문법적 설탕을 제공할 뿐입니다.

```js
<MyButton color="blue" shadowSize={2}>
  Click Me
</MyButton>
```

위의 코드는 아래와 같이 컴파일됩니다.

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


## React Element의 타입 지정하기 {#specifying-the-react-element-type}

JSX 태그의 첫 부분은 React element의 타입을 결정합니다.

대문자로 시작하는 JSX 태그는 React 컴포넌트를 지정합니다. 이 태그들은 같은 이름을 가진 변수들을 직접 참조합니다. 만약 `<Foo />`와 같은 JSX 표현을 쓰려고 한다면 Foo가 반드시 스코프 내에 존재해야 합니다.


### React가 스코프 내에 존재해야 합니다 {#react-must-be-in-scope}

JSX는 `React.createElement`를 호출하는 코드로 컴파일 되기 때문에 `React` 라이브러리 역시 JSX 코드와 같은 스코프 내에 존재해야만 합니다.

아래의 예시를 통해 보면, `React`와 `CustomButton`는 JavaScript 코드에선 직접적으로 사용되진 않지만 JSX 태그로 사용하기 위해 꼭 import 해야합니다.

```js{1,2,5}
import React from 'react';
import CustomButton from './CustomButton';

function WarningButton() {
  // return React.createElement(CustomButton, {color: 'red'}, null);
  return <CustomButton color="red" />;
}
```

JavaScript 번들러를 사용하지 않고 `<script>` 태그를 통해 React를 불러왔다면 `React`는 전역 변수로 존재하기 때문에 별도로 불러올 필요가 없습니다.

### JSX 타입을 위한 점 표기법 사용 {#using-dot-notation-for-jsx-type}

JSX 내에서도 점 표기법을 사용하여 React 컴포넌트를 참조할 수 있습니다. 이 방법은 하나의 모듈에서 복수의 React 컴포넌트들을 export 하는 경우에 편리하게 사용할 수 있습니다. 예를 들어, 만약 `MyComponents.DatePicker`가 컴포넌트라면, 아래와 같은 방법으로 직접 사용할 수 있습니다.

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

### 사용자 정의 컴포넌트는 반드시 대문자로 시작해야합니다 {#user-defined-components-must-be-capitalized}

Element가 소문자로 시작하는 경우에는 `<div>` 나 `<span>` 같은 내장 컴포넌트라는 것을 뜻하며 `'div'` 나 `'span'` 같은 문자열 형태로 `React.createElement`에 전달됩니다. `<Foo />`와 같이 대문자로 시작하는 타입들은 `React.createElement(Foo)`의 형태로 컴파일 되며 JavaScript 파일 내에 사용자가 정의했거나 import 한 컴포넌트를 가리킵니다.

컴포넌트의 이름은 대문자로 시작하는 것을 추천합니다. 만약 소문자로 시작하는 컴포넌트를 사용해야 한다면, 대문자로 시작하는 변수에 할당한 뒤 JSX에서 이 변수를 사용하세요.

예를 들어 아래의 코드는 예상대로 실행되지 않을 것 입니다.

```js{3,4,10,11}
import React from 'react';

// 잘못된 사용법입니다! 아래는 컴포넌트이므로 대문자화 해야 합니다.
function hello(props) {
  // 올바른 사용법입니다! 아래의 <div> 사용법은 유효한 HTML 태그이기 때문에 유효합니다.
  return <div>Hello {props.toWhat}</div>;
}

function HelloWorld() {
  // 잘못된 사용법입니다! React는 <hello />가 대문자가 아니기 때문에 HTML 태그로 인식하게 됩니다.
  return <hello toWhat="World" />;
}
```

이를 고치기 위해 우리는 `hello` 를 `Hello`로 바꾸고 이를 참조할 때 `<Hello />`를 사용할 것 입니다.

```js{3,4,10,11}
import React from 'react';

// 올바른 사용법입니다. 아래는 컴포넌트이므로 대문자로 시작해야 합니다.
function Hello(props) {
  // 올바른 사용법입니다! 아래의 <div> 사용법은 유효한 HTML 태그이기 때문에 유효합니다.
  return <div>Hello {props.toWhat}</div>;
}

function HelloWorld() {
  // 올바른 사용법입니다! React는 <Hello />가 대문자로 시작하기 때문에 컴포넌트로 인식합니다.
  return <Hello toWhat="World" />;
}
```

### 실행 중에 타입 선택하기 {#choosing-the-type-at-runtime}

React element 타입에 일반적인 표현식은 사용할 수 없습니다. 만약 element 타입을 지정할 때 일반적인 표현식을 사용하고자 한다면 대문자로 시작하는 변수에 배정한 후 사용할 수 있습니다. 예를 들어 아래와 같이 prop에 따라 다른 컴포넌트를 render 해야 하는 경우들이 종종 있습니다.

```js{10,11}
import React from 'react';
import { PhotoStory, VideoStory } from './stories';

const components = {
  photo: PhotoStory,
  video: VideoStory
};

function Story(props) {
  // 잘못된 사용법입니다! JSX 타입은 표현식으로 사용할 수 없습니다.
  return <components[props.storyType] story={props.story} />;
}
```

이를 고치기 위해 우선 타입을 대문자로 시작하는 변수에 지정합니다.

```js{10-12}
import React from 'react';
import { PhotoStory, VideoStory } from './stories';

const components = {
  photo: PhotoStory,
  video: VideoStory
};

function Story(props) {
  // 올바른 사용법입니다! 대문자로 시작하는 변수는 JSX 타입으로 사용할 수 있습니다.
  const SpecificStory = components[props.storyType];
  return <SpecificStory story={props.story} />;
}
```

## JSX 안에서의 prop 사용 {#props-in-jsx}

JSX 안에서 prop을 사용하는 방법은 여러 가지가 있습니다.

### JavaScript Expressions as Props {#javascript-expressions-as-props}

아래의 예시와 같이 JavaScript 표현을 `{}` 안에 넣어서 JSX 안에서 prop으로 사용할 수 있습니다.

```js
<MyComponent foo={1 + 2 + 3 + 4} />
```
`MyComponent`의 `props.foo`의 값은 `1 + 2 + 3 + 4`의 표현식이 계산되기 때문에 `10`입니다.

`if` 구문과 `for` 루프는 JavaScript 표현식이 아니기 때문에 JSX 안에서 그대로 사용할 수 없습니다. 하지만 아래의 예시와 같이 JSX 밖의 주변 코드에서 사용할 수 있습니다.

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

더 자세한 [조건부 렌더링](/docs/conditional-rendering.html) 과 [리스트와 Key](/docs/lists-and-keys.html) 관련 문서를 참고해주세요.

### 문자열 리터럴 {#string-literals}

문자열 리터럴은 prop으로 넘겨줄 수 있습니다. 아래의 두 JSX 표현은 동일한 표현입니다.

```js
<MyComponent message="hello world" />

<MyComponent message={'hello world'} />
```

문자열 리터럴을 넘겨줄 때, 그 값은 HTML 이스케이프 처리가 되지 않습니다. 따라서 아래의 두 JSX 표현은 동일한 표현입니다.

```js
<MyComponent message="&lt;3" />

<MyComponent message={'<3'} />
```

이 동작은 보통 신경 쓰지 않아도 되지만, 문서의 완전성을 위해서 언급해둡니다.

### Props의 기본값은 "True" {#props-default-to-true}

Prop에 어떤 값도 넘기지 않을 경우, 기본값은 `true`입니다. 아래의 두 JSX 표현은 동일한 표현입니다.

```js
<MyTextBox autocomplete />

<MyTextBox autocomplete={true} />
```

일반적으로 위의 예시와 같은 방식으로 사용하지 않는 것을 권장하는데 이는 [ES6 object shorthand](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Object_initializer#ECMAScript_2015의_새로운_표기법) 와 헷갈릴 수 있기 때문입니다. `{foo}` 는 `{foo: true}` 가 아닌 `{foo: foo}`와 동일합니다. 이는 HTML 동작 방식과 일치하기 위해 남겨두었습니다.

### 속성 펼치기 {#spread-attributes}

`props`에 해당하는 객체를 이미 가지고 있다면,`...`를 "전개" 연산자로 사용해 전체 객체를 그대로 넘겨줄 수 있습니다. 아래의 두 컴포넌트는 동일합니다.

```js{7}
function App1() {
  return <Greeting firstName="Ben" lastName="Hector" />;
}

function App2() {
  const props = {firstName: 'Ben', lastName: 'Hector'};
  return <Greeting {...props} />;
}
```

컴포넌트가 사용하게 될 특정 prop을 선택하고 나머지 prop은 전개 연산자를 통해 넘길 수 있습니다.

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

위의 예시의 `kind` prop은 소비되고 DOM의 `button` element에 넘겨지지 *않습니다.*
다른 모든 prop은 `...other` 객체를 통해서 넘겨지며 이 컴포넌트를 유연하게 만들어줍니다. `onClick`과 `children` prop으로 넘겨지는 것을 볼 수 있습니다.

전개 연산자는 유용하지만 불필요한 prop을 컴포넌트에 넘기거나 유효하지 않은 HTML 속성들을 DOM에 넘기기도 합니다. 꼭 필요할 때만 사용하는 것을 권장합니다.

## JSX에서 자식 다루기 {#children-in-jsx}

여는 태그와 닫는 태그가 있는 JSX 표현에서 두 태그 사이의 내용은 `props.children`이라는 특수한 prop으로 넘겨집니다. 자식을 넘기는 방법은 여러 가지가 있습니다.

### 문자열 리터럴 {#string-literals-1}

여는 태그와 닫는 태그 사이에 문자열 리터럴을 넣을 수 있고 이 때 `props.children`은 그 문자열이 됩니다. 이는 아래의 예시와 같이 많은 HTML 내장 element에 유용합니다.

```js
<MyComponent>Hello world!</MyComponent>
```

이는 유효한 JSX입니다. 여기서 `MyComponent`의 `props.children`은 `"Hello world!"`입니다. HTML은 이스케이프 처리가 되지 않으며, 일반적으로 아래와 같이 HTML을 쓰는 방식으로 JSX를 쓸 수 있습니다.

```html
<div>This is valid HTML &amp; JSX at the same time.</div>
```

JSX는 각 줄의 처음과 끝에 있는 공백을 제거합니다. 빈 줄 역시 제거합니다. 태그에 붙어있는 개행도 제거되며 문자열 리터럴 중간에 있는 개행은 한 개의 공백으로 대체됩니다. 따라서 아래의 예시들은 전부 똑같이 렌더링됩니다.

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

### JSX를 자식으로 사용하기 {#jsx-children}

JSX element를 자식으로 넘겨 줄 수 있습니다. 이는 중첩된 컴포넌트를 보여줄 때 유용합니다.

```js
<MyContainer>
  <MyFirstComponent />
  <MySecondComponent />
</MyContainer>
```

다양한 타입의 자식들을 섞어서 사용할 수 있습니다. 그래서 문자열 리터럴을 JSX 자식과 함께 사용할 수 있습니다. 이는 JSX를 HTML과 같은 방식으로 구동되는 점 중 하나입니다. 아래의 예시는 JSX와 HTML 모두에서 유효합니다.

```html
<div>
  Here is a list:
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
</div>
```

React 컴포넌트는 element로 이루어진 배열을 반환할 수 있습니다.

```js
render() {
  // 리스트 아이템들을 추가적인 엘리먼트로 둘러쌀 필요 없습니다!
  return [
    // key 지정을 잊지 마세요 :)
    <li key="A">First item</li>,
    <li key="B">Second item</li>,
    <li key="C">Third item</li>,
  ];
}
```

### JavaScript 표현식을 자식으로 사용하기 {#javascript-expressions-as-children}

`{}`에 감싸서 JavaScript 표현식도 자식으로 넘길 수 있습니다. 아래의 예시들은 동일한 표현입니다.

```js
<MyComponent>foo</MyComponent>

<MyComponent>{'foo'}</MyComponent>
```

이는 임의의 길이를 가진 JSX 표현식의 배열을 랜더링 할 때 종종 유용하게 사용됩니다. 아래의 예시는 HTML 배열로 랜더됩니다.

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

JavaScript 표현식은 다른 타입의 자식과 같이 쓸 수 있습니다. 이는 문자열 탬플릿을 대신해서 종종 유용합니다.

```js{2}
function Hello(props) {
  return <div>Hello {props.addressee}!</div>;
}
```

### 함수를 자식으로 사용하기 {#functions-as-children}

보통 JSX에 삽입된 JavaScript 표현식은 문자열, React element 혹은 이들의 배열로 환산됩니다. 하지만 `props.children`은 다른 prop들과 마찬가지로 React가 렌더링 할 수 있는 데이터의 형태뿐만 아니라 어떤 형태의 데이터도 넘겨질 수 있습니다. 아래의 예시와 같이 직접 만든 컴포넌트가 있다면 `props.children`을 통해서 콜백을 넘겨받을 수 있습니다.

```js{4,13}
// 자식 콜백인 numTimes를 호출하여 반복되는 컴포넌트를 생성합니다.
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

직접 만든 컴포넌트에 넘겨지는 자식들은 렌더되기 전에 React가 이해할 수 있는 형태로 변환된다면 어떤 것이든 넘겨질 수 있습니다. 이런 사용법은 일반적이지 않지만, JSX의 기능의 확장성을 확인하고 싶다면 사용할 수 있습니다.

### boolean, null, undefined는 무시됩니다. {#booleans-null-and-undefined-are-ignored}

`false`, `null`, `undefined`와 `true`는 유효한 자식입니다. 그저 렌더링 되지 않을 뿐입니다. 아래의 JSX 표현식들은 동일하게 렌더링됩니다.

```js
<div />

<div></div>

<div>{false}</div>

<div>{null}</div>

<div>{undefined}</div>

<div>{true}</div>
```

이는 React element들을 조건부 렌더링할 때 유용합니다. 아래의 JSX는 `showHeader`가 `true`일 때 동일하게 `<Header />`를 렌더하게 됩니다.

```js{2}
<div>
  {showHeader && <Header />}
  <Content />
</div>
```

한 가지 주의해야 할 점은 `0`과 같은 ["falsy" 값들](https://developer.mozilla.org/ko/docs/Glossary/Falsy)은 React가 렌더링 한다는 점입니다. 예를 들어, 아래의 예시는 `props.messages`가 빈 배열일 때 예상과는 다르게 0을 출력하게 됩니다.

```js{2}
<div>
  {props.messages.length &&
    <MessageList messages={props.messages} />
  }
</div>
```

이를 고치려면 `&&` 앞의 표현식이 언제나 진리값이 되도록 해야합니다.

```js{2}
<div>
  {props.messages.length > 0 &&
    <MessageList messages={props.messages} />
  }
</div>
```

반대로 `false`, `true`, `null` 또는 `undefined`와 같은 값들을 출력하고 싶다면 먼저 [문자열로 전환](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/String#String_conversion) 해야합니다.

```js{2}
<div>
  My JavaScript variable is {String(myVariable)}.
</div>
```
