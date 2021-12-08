---
title: 웹사이트에 React 추가
---

<Intro>

React는 처음부터 점진적인 도입을 위해 설계되었으며, 필요한 만큼 React를 사용할 수 있습니다. 마이크로 프론트 엔드, 기존 시스템 혹은 단순히 React 사용 여부와 관계없이 몇 줄의 코드만으로 HTML 페이지에 인터렉티브한 React 컴포넌트를 추가할 수 있습니다. 빌드 도구 없이 말이죠!

</Intro>

## 1분 안에 React 추가 {/*add-react-in-one-minute*/}

1분 안에 기존 HTML 페이지에 React 컴포넌트를 추가할 수 있습니다. 자신의 웹 사이트나 [빈 HTML 파일](https://gist.github.com/rachelnabors/7b33305bf33776354797a2e3c1445186/archive/859eac2f7079c9e1f0a6eb818a9684a464064d80.zip)에 시도해 보세요. 인터넷 연결과 메모장(또는 VSCode—[설정 방법](/learn/editor-setup/)에 대한 가이드를 확인하세요.) 같은 텍스트 편집기만 있으면 됩니다. 

### 1단계: HTML에 엘리먼트 추가 {/*step-1-add-an-element-to-the-html*/}

편집하려는 HTML 페이지에서 빈 `<div>` 태그와 같은 HTML 엘리먼트에 고유 id를 추가하여 React로 무언가 표시하고 싶은 지점에 추가합니다.

`div` 와 같은 "컨테이너" 엘리먼트는 `<body>` 태그 내부의 아무 곳에나 배치할 수 있습니다. React는 HTML 엘리먼트 내의 기존 콘텐츠를 대체하므로 보통 비어 있습니다. 한 페이지에 이러한 HTML 엘리먼트를 필요한 만큼 가질 수 있습니다.

```html {3}
<!-- ... 기존 HTML ... -->

<div id="component-goes-here"></div>

<!-- ... 기존 HTML ... -->
```

### 2단계: 스크립트 태그 추가 {/*step-2-add-the-script-tags*/}

HTML 페이지에서 닫는 `</body>` 태그 바로 앞에 다음 파일에 대한 3개의 `<script>` 태그를 추가 합니다.

- [**react.development.js**](https://unpkg.com/react@17/umd/react.development.js) 는 React의 핵심을 로드합니다.
- [**react-dom.development.js**](https://unpkg.com/react-dom@17/umd/react-dom.development.js) 로 React는 HTML 엘리먼트를 [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model)에 렌더링할 수 있습니다.
- **like_button.js** 는 3단계에서 컴포넌트를 작성하는 곳입니다!

<Gotcha>

배포할 때 "development.js"를 "production.min.js"로 바꾸세요.

</Gotcha>

```html
  <!-- 페이지 끝 -->
  <script src="https://unpkg.com/react@17/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js" crossorigin></script>
  <script src="like_button.js"></script>
</body>
```

### 3단계: React 컴포넌트 만들기 {/*step-3-create-a-react-component*/}

HTML 페이지 옆에 **like_button.js** 파일을 생성하여 다음의 코드를 조각을 넣고 저장합니다. 이 코드는 `LikeButton` 이라는 React 컴포넌트를 정의합니다. [가이드에서 컴포넌트를 만드는 자세한 방법을 알아볼 수 있습니다.](/learn/your-first-component)

```js
'use strict';

function LikeButton() {
  const [liked, setLiked] = React.useState(false);

  if (liked) {
    return 'You liked this!';
  }

  return React.createElement(
    'button',
    {
      onClick: () => setLiked(true),
    },
    'Like'
  );
}
```

### 4단계: 페이지에 React 컴포넌트 추가 {/*step-4-add-your-react-component-to-the-page*/}

마지막으로 **like_button.js** 하단에 두 줄을 추가합니다. 이 두 줄의 코드는  1단계에서 HTML에 추가한 `<div>`를 찾은 다음 그 안에 React 컴포넌트 "Like" 버튼을 추가합니다.

```js
const domContainer = document.getElementById('component-goes-here');
ReactDOM.render(React.createElement(LikeButton), domContainer);
```

**축하합니다! 웹사이트에 첫 번째 React 컴포넌트를 렌더링했습니다!**

- [예제 전체 소스 코드 보기](https://gist.github.com/rachelnabors/c64b3aeace8a191cf5ea6fb5202e66c9)
- [예제 전체 다운로드 (2KB 압축)](https://gist.github.com/rachelnabors/c64b3aeace8a191cf5ea6fb5202e66c9/archive/7b41a88cb1027c9b5d8c6aff5212ecd3d0493504.zip)

#### 컴포넌트를 재사용할 수 있습니다! {/*you-can-reuse-components*/}

동일한 HTML 페이지 여러 위치에 React 컴포넌트를 추가할 수 있습니다. React기반 페이지가 서로 분리되어 있는 동안 가장 유용합니다. `ReactDOM.render()` 를 여러 번 호출함으로써 여러 개의 컨테이너 엘리먼트를 사용할 수 있습니다.

1. **index.html**에서 `<div id="component-goes-here-too"></div>` 컨테이너 엘리먼트를 추가합니다.
2. 새 컨테이너 엘리먼트를 위해 **like_button.js**에서  `ReactDOM.render()` 를 추가합니다.

```js {6,7,8,9}
ReactDOM.render(
  React.createElement(LikeButton),
  document.getElementById('component-goes-here')
);

ReactDOM.render(
  React.createElement(LikeButton),
  document.getElementById('component-goes-here-too')
);
```

Check out ["Like" 버튼을 세 번 추가하고 일부 데이터를 전달하는 예시](https://gist.github.com/rachelnabors/c0ea05cc33fbe75ad9bbf78e9044d7f8)를 확인하세요!

### 5단계: 프로덕션용 JavaScript 코드 경량화 {/*step-5-minify-javascript-for-production*/}

코드 경량화가 되지 않은 JavaScript는 사용자의 페이지 로딩 속도를 늦출 수 있습니다. 웹사이트를 프로덕션에 배포하기 전에 스크립트를 경량화하는 것이 좋습니다.

- 스크립트에 **코드 경량화 단계가 없는 경우** [한 가지 설정 방법](https://gist.github.com/gaearon/42a2ffa41b8319948f9be4076286e1f3)이 있습니다.
- 애플리케이션 스크립트를 **이미 코드 경량화를 한 경우** 배포된 HTML이 다음과 같이 `production.min.js`로 끝나는 React 버전을 로드하도록 하면 사이트가 프로덕션 할 준비가 됩니다.

```html
<script src="https://unpkg.com/react@17/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js" crossorigin></script>
```

## Try React with JSX {/*try-react-with-jsx*/}

The examples above rely on features that are natively supported by browsers. This is why **like_button.js** uses a JavaScript function call to tell React what to display:

```js
return React.createElement('button', {onClick: () => setLiked(true)}, 'Like');
```

However, React also offers an option to use [JSX](/learn/writing-markup-with-jsx), an HTML-like JavaScript syntax, instead:

```jsx
return <button onClick={() => setLiked(true)}>Like</button>;
```

These two code snippets are equivalent. JSX is popular syntax for describing markup in JavaScript. Many people find it familiar and helpful for writing UI code--both with React and with other libraries. You might see "markup sprinkled throughout your JavaScript" in other projects!

> You can play with transforming HTML markup into JSX using [this online converter](https://babeljs.io/en/repl#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=DwIwrgLhD2B2AEcDCAbAlgYwNYF4DeAFAJTw4B88EAFmgM4B0tAphAMoQCGETBe86WJgBMAXJQBOYJvAC-RGWQBQ8FfAAyaQYuAB6cFDhkgA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=es2015%2Creact%2Cstage-2&prettier=false&targets=&version=7.4.3).

### Try JSX {/*try-jsx*/}

The quickest way to try JSX in your project is to add the Babel compiler to your page's `<head>` along with React and ReactDOM like so:

```html {6}
<!-- ... rest of <head> ... -->

<script src="https://unpkg.com/react@17/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js" crossorigin></script>

<script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>

</head>
<!-- ... rest of <body> ... -->
```

Now you can use JSX in any `<script>` tag by adding `type="text/babel"` attribute to it. For instance:

```jsx {1}
<script type="text/babel">
  ReactDOM.render(
  <h1>Hello, world!</h1>, document.getElementById('root') );
</script>
```

To convert **like_button.js** to use JSX:

1. In **like_button.js**, replace

```js
return React.createElement(
  'button',
  {
    onClick: () => setLiked(true),
  },
  'Like'
);
```

with:

```jsx
return <button onClick={() => setLiked(true)}>Like</button>;
```

2. In **index.html**, add `type="text/babel"` to the like button's script tag:

```html
<script src="like_button.js" type="text/babel"></script>
```

Here is [an example HTML file with JSX](https://raw.githubusercontent.com/reactjs/reactjs.org/main/static/html/single-file-example.html) that you can download and play with.

This approach is fine for learning and creating simple demos. However, it makes your website slow and **isn't suitable for production**. When you're ready to move forward, remove this new `<script>` tag and the `type="text/babel"` attributes you've added. Instead, in the next section you will set up a JSX preprocessor to convert all your `<script>` tags automatically.

### Add JSX to a project {/*add-jsx-to-a-project*/}

Adding JSX to a project doesn't require complicated tools like a [bundler](/learn/start-a-new-react-project#custom-toolchains) or a development server. Adding a JSX preprocessor is a lot like adding a CSS preprocessor.

Go to your project folder in the terminal, and paste these two commands (**Be sure you have [Node.js](https://nodejs.org/) installed!**):

1. `npm init -y` (if it fails, [here's a fix](https://gist.github.com/gaearon/246f6380610e262f8a648e3e51cad40d))
2. `npm install babel-cli@6 babel-preset-react-app@3`

You only need npm to install the JSX preprocessor. You won't need it for anything else. Both React and the application code can stay as `<script>` tags with no changes.

Congratulations! You just added a **production-ready JSX setup** to your project.

### Run the JSX Preprocessor {/*run-the-jsx-preprocessor*/}

You can preprocess JSX so that every time you save a file with JSX in it, the transform will be re-run, converting the JSX file into a new, plain JavaScript file.

1. Create a folder called **src**
2. In your terminal, run this command: `npx babel --watch src --out-dir . --presets react-app/prod ` (Don't wait for it to finish! This command starts an automated watcher for JSX.)
3. Move your JSX-ified **like_button.js** to the new **src** folder (or create a **like_button.js** containing this [JSX starter code](https://gist.githubusercontent.com/rachelnabors/ffbc9a0e33665a58d4cfdd1676f05453/raw/652003ff54d2dab8a1a1e5cb3bb1e28ff207c1a6/like_button.js))

The watcher will create a preprocessed **like_button.js** with the plain JavaScript code suitable for the browser.

<Gotcha>

If you see an error message saying "You have mistakenly installed the `babel` package", you might have missed [the previous step](#add-jsx-to-a-project). Perform it in the same folder, and then try again.

</Gotcha>

As a bonus, this also lets you use modern JavaScript syntax features like classes without worrying about breaking older browsers. The tool we just used is called Babel, and you can learn more about it from [its documentation](https://babeljs.io/docs/en/babel-cli/).

If you're getting comfortable with build tools and want them to do more for you, [we cover some of the most popular and approachable toolchains here](/learn/start-a-new-react-project).

<DeepDive title="React without JSX">

Originally JSX was introduced to make writing components with React feel as familiar as writing HTML. Since then, the syntax has become widespread. However, there may be instances where you do not want to use or cannot use JSX. You have two options:

- Use a JSX alternative like [htm](https://github.com/developit/htm) which doesn't use a compiler—it uses JavaScript's native Tagged Templates.
- Use [`React.createElement()`](/reference/createelement), which has a special structure explained below.

With JSX, you would write a component like so:

```jsx
function Hello(props) {
  return <div>Hello {props.toWhat}</div>;
}

ReactDOM.render(<Hello toWhat="World" />, document.getElementById('root'));
```

With `React.createElement()`, you would write it like this:

```js
function Hello(props) {
  return React.createElement('div', null, `Hello ${props.toWhat}`);
}

ReactDOM.render(
  React.createElement(Hello, {toWhat: 'World'}, null),
  document.getElementById('root')
);
```

It accepts three arguments: `React.createElement(component, props, children)`. Here's how they work:

1. A **component**, which can be a string representing an HTML element or a function component
2. An object of any [**props** you want to pass](/learn/passing-props-to-a-component)
3. An object of any **children** the component might have, such as text strings

If you get tired of typing `React.createElement()`, one common pattern is to assign a shorthand:

```js
const e = React.createElement;

ReactDOM.render(e('div', null, 'Hello World'), document.getElementById('root'));
```

If you use this shorthand form for `React.createElement()`, it can be almost as convenient to use React without JSX.

</DeepDive>
