---
title: 웹사이트에 React 추가하기
---

<Intro>

React는 처음부터 점진적인 도입을 위해 설계되었으며, 필요한 만큼 React를 사용할 수 있습니다. 마이크로 프론트엔드, 기존 시스템 혹은 단순히 React 사용 여부와 관계없이 몇 줄의 코드만으로 HTML 페이지에 인터렉티브한 React 컴포넌트를 추가할 수 있습니다. 빌드 도구 없이 말이죠!

</Intro>

## 1분 안에 React 추가하기 {/*add-react-in-one-minute*/}

1분 안에 기존 HTML 페이지에 React 컴포넌트를 추가할 수 있습니다. 자신의 웹 사이트나 [빈 HTML 파일](https://gist.github.com/rachelnabors/7b33305bf33776354797a2e3c1445186/archive/859eac2f7079c9e1f0a6eb818a9684a464064d80.zip)에 시도해 보세요. 인터넷 연결과 메모장(또는 VSCode—[설정 방법](/learn/editor-setup/)에 대한 가이드를 확인하세요.) 같은 텍스트 편집기만 있으면 됩니다! 

### 1단계: HTML에 엘리먼트 추가하기 {/*step-1-add-an-element-to-the-html*/}

편집하려는 HTML 페이지에서 빈 `<div>` 태그와 같은 HTML 엘리먼트에 고유 `id`를 추가하여 React로 무언가 표시하고 싶은 곳에 추가합니다.

`<div>` 와 같은 "컨테이너" 엘리먼트는 `<body>` 태그 내부의 아무 곳에나 배치할 수 있습니다. React는 HTML 엘리먼트 내의 기존 콘텐츠를 대체하므로 보통 비어 있습니다. 한 페이지에 이러한 HTML 엘리먼트를 필요한 만큼 가질 수 있습니다.

```html {3}
<!-- ... 기존 HTML ... -->

<div id="component-goes-here"></div>

<!-- ... 기존 HTML ... -->
```

### 2단계: 스크립트 태그 추가하기 {/*step-2-add-the-script-tags*/}

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

### 4단계: 페이지에 React 컴포넌트 추가하기 {/*step-4-add-your-react-component-to-the-page*/}

마지막으로 **like_button.js** 하단에 두 줄을 추가합니다. 이 두 줄의 코드는 1단계에서 HTML에 추가한 `<div>`를 찾은 다음 그 안에 React 컴포넌트 "Like" 버튼을 추가합니다.

```js
const domContainer = document.getElementById('component-goes-here');
ReactDOM.render(React.createElement(LikeButton), domContainer);
```

**축하합니다! 웹사이트에 첫 번째 React 컴포넌트를 렌더링했습니다!**

- [예제 전체 소스 코드 보기](https://gist.github.com/rachelnabors/c64b3aeace8a191cf5ea6fb5202e66c9)
- [예제 전체 다운로드 (2KB 압축)](https://gist.github.com/rachelnabors/c64b3aeace8a191cf5ea6fb5202e66c9/archive/7b41a88cb1027c9b5d8c6aff5212ecd3d0493504.zip)

#### 컴포넌트를 재사용할 수 있습니다! {/*you-can-reuse-components*/}

동일한 HTML 페이지 여러 위치에 React 컴포넌트를 추가할 수 있습니다. React 기반 페이지가 서로 분리되어 있는 동안 가장 유용합니다. `ReactDOM.render()` 를 여러 번 호출함으로써 여러 개의 컨테이너 엘리먼트를 사용할 수 있습니다.

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

### 5단계: 프로덕션용 JavaScript 코드 경량화하기 {/*step-5-minify-javascript-for-production*/}

코드 경량화가 되지 않은 JavaScript는 사용자의 페이지 로딩 속도를 늦출 수 있습니다. 웹사이트를 프로덕션에 배포하기 전에 스크립트를 경량화하는 것이 좋습니다.

- 스크립트에 **코드 경량화 단계가 없는 경우** [한 가지 설정 방법](https://gist.github.com/gaearon/42a2ffa41b8319948f9be4076286e1f3)이 있습니다.
- 애플리케이션 스크립트를 **이미 코드 경량화한 경우** 배포된 HTML이 다음과 같이 `production.min.js`로 끝나는 React 버전을 로드해야만 사이트가 프로덕션 할 준비가 됩니다.

```html
<script src="https://unpkg.com/react@17/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js" crossorigin></script>
```

## JSX로 React 사용하기 {/*try-react-with-jsx*/}

위의 예시는 브라우저에서 기본적으로 지원하는 기능에 의존합니다. 이것이 **like_button.js** 가 자바스크립트 함수 호출을 사용하여 추가할 내용을 React에 알리는 이유입니다.

```js
return React.createElement('button', {onClick: () => setLiked(true)}, 'Like');
```

하지만 React는 HTML과 유사한 자바스크립트 문법인 [JSX](/learn/writing-markup-with-jsx)를 사용하는 옵션도 제공합니다.

```jsx
return <button onClick={() => setLiked(true)}>Like</button>;
```

위에 두 코드 조각은 동일한 동작을 합니다. JSX는 자바스크립트에서 마크업을 설명하는데 널리 사용되고 있는 문법입니다. 많은 사람이 React와 다른 라이브러리에서 UI 코드 작성에 익숙하고 유용하다고 생각합니다. 다른 프로젝트에서 "자바스크립트 전체에 흩어져 있는 마크업"을 볼 수 있을지도 모릅니다!

> [온라인 변환기](https://babeljs.io/en/repl#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=DwIwrgLhD2B2AEcDCAbAlgYwNYF4DeAFAJTw4B88EAFmgM4B0tAphAMoQCGETBe86WJgBMAXJQBOYJvAC-RGWQBQ8FfAAyaQYuAB6cFDhkgA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=es2015%2Creact%2Cstage-2&prettier=false&targets=&version=7.4.3)에서 HTML 마크업을 JSX로 변환할 수 있습니다.

### JSX 사용하기 {/*try-jsx*/}

프로젝트에서 JSX를 시도하는 가장 빠른 방법은 페이지 `<head>`에 Babel 컴파일러를 React 및 ReactDOM과 같이 추가하는 것입니다.

```html {6}
<!-- ... 나머지 <head> ... -->

<script src="https://unpkg.com/react@17/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js" crossorigin></script>

<script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>

</head>
<!-- ... 나머지 <body> ... -->
```

이제 `<script>` 태그에 `type="text/babel"` 을 추가해서 JSX를 사용할 수 있습니다. 예를 들어

```jsx {1}
<script type="text/babel">
  ReactDOM.render(
  <h1>Hello, world!</h1>, document.getElementById('root') );
</script>
```

JSX 사용을 위해 **like_button.js**를 변환하려면

1. **like_button.js**에서 아래의 코드를 

```js
return React.createElement(
  'button',
  {
    onClick: () => setLiked(true),
  },
  'Like'
);
```

다음 코드로 교체합니다.

```jsx
return <button onClick={() => setLiked(true)}>Like</button>;
```

2. **index.html**의 "Like" 버튼 스크립트 태그에 `type="text/babel"`을 추가합니다.

```html
<script src="like_button.js" type="text/babel"></script>
```

다운로드하고 사용할 수 있는 [JSX가 있는 HTML 파일 예시](https://raw.githubusercontent.com/reactjs/reactjs.org/main/static/html/single-file-example.html)가 있습니다.

간단한 데모나 학습을 위해 사용하기 좋은 접근법입니다. 하지만 웹사이트가 느려지고 **프로덕션에는 적합하지 않습니다.** 앞으로 나아갈 준비가 되면 새 `<script>` 태그와 `type="text/babel"` 을 추가한 속성을 제거하세요. 대신 다음 섹션에서는 모든 `<script>` 태그를 자동으로 변환하도록 JSX 전처리기를 설정합니다. 

### 프로젝트에 JSX 추가하기 {/*add-jsx-to-a-project*/}

프로젝트에 JSX를 추가하는 것은 [번들러](/learn/start-a-new-react-project#custom-toolchains)나 개발 서버와 같은 복잡한 도구가 필요 없습니다. JSX 전처리기를 추가하는 것은 CSS 전처리기를 추가하는 것과 매우 비슷합니다.

터미널에서 프로젝트 폴더에 들어가서 두 명령어를 붙여넣으세요. (**[Node.js](https://nodejs.org/)가 설치되어있는지 확인하세요!**)

1. `npm init -y` (실패하면, [여기에 수정 사항이 있습니다.](https://gist.github.com/gaearon/246f6380610e262f8a648e3e51cad40d))
2. `npm install babel-cli@6 babel-preset-react-app@3`

JSX 전처리기를 설치하려면 npm만 있으면 됩니다. 다른 용도로는 필요하지 않습니다. React와 애플리케이션 코드는 모두 변경 없이 `<script>` 태그로 유지될 수 있습니다.

축하합니다! 프로젝트에 **프로덕션 준비 JSX 설정**을 추가했습니다.

### JSX 전처리기 실행하기 {/*run-the-jsx-preprocessor*/}

JSX가 포함된 파일을 저장할 때마다 변환이 다시 실행되어 JSX 파일을 새로운 일반 자바스크립트 파일로 변환하도록 JSX를 전처리할 수 있습니다.

1. **src** 폴더를 생성합니다.
2. 터미널에서 다음 명령어를 실행합니다. `npx babel --watch src --out-dir . --presets react-app/prod ` (완료될 때까지 기다리지 마세요! 이 명령어는 JSX를 위한 자동화된 watcher를 작동시킵니다.)
3. JSX로 통합된 **like_button.js** 를 새 **src** 폴더로 이동합니다. (또는 [JSX 시작 코드](https://gist.githubusercontent.com/rachelnabors/ffbc9a0e33665a58d4cfdd1676f05453/raw/652003ff54d2dab8a1a1e5cb3bb1e28ff207c1a6/like_button.js)를 포함하는 **like_button.js**를 생성합니다.)

이 watcher는 브라우저에 적합한 일반 자바스크립트 코드로 사전처리된 **like_button.js** 를 생성합니다.

<Gotcha>

"`babel` 패키지를 잘못 설치했습니다"라는 오류 메시지가 나타나면 [이전 단계](#add-jsx-to-a-project)를 놓쳤을지도 모릅니다. 동일한 폴더에서 수행한 후 다시 시도하세요.

</Gotcha>

추가로 모던 자바스크립트의 클래스 같은 최신 문법은 오래된 브라우저에서 작동하지 않는 것에 대해 걱정 없이 사용할 수 있습니다. 방금 사용한 도구는 Babel이라고 하며 [설명서](https://babeljs.io/docs/en/babel-cli/)에서 자세히 알아볼 수 있습니다.

빌드 도구에 익숙해지고 더 많은 작업을 원하는 경우 [여기에서 가장 인기 있고 접근하기 쉬운 툴 체인을 다루세요](/learn/start-a-new-react-project).

<DeepDive title="React without JSX">

원래 JSX는 React로 컴포넌트를 작성하는 것이 HTML을 작성하는 것만큼 친숙하게 느껴지도록 하기 위해 도입되었습니다. 그 이후로 이 문법이 널리 퍼졌습니다. 그러나 JSX를 사용하고 싶지 않거나 사용할 수 없는 경우가 있을 수도 있습니다. 두 가지 옵션이 있습니다.

<<<<<<< HEAD
- [htm](https://github.com/developit/htm)과 같이 컴파일러를 사용하지 않는 JSX 대안을 사용하세요.—자바스크립트의 기본 태그가 지정된 템플릿을 사용합니다.
- 아래에서 설명하는 특별한 구조를 가진 [`React.createElement()`](/reference/createelement)을 사용하세요.
=======
- Use a JSX alternative like [htm](https://github.com/developit/htm) which doesn't use a compiler—it uses JavaScript's native Tagged Templates.
- Use [`React.createElement()`](/apis/createelement), which has a special structure explained below.
>>>>>>> 20f0fe280f3c122df7541256b983c46e21e33b20

JSX를 사용하면 다음과 같이 컴포넌트를 작성할 수 있습니다.

```jsx
function Hello(props) {
  return <div>Hello {props.toWhat}</div>;
}

ReactDOM.render(<Hello toWhat="World" />, document.getElementById('root'));
```

`React.createElement()`를 사용하면 다음과 같이 작성할 수 있습니다.

```js
function Hello(props) {
  return React.createElement('div', null, `Hello ${props.toWhat}`);
}

ReactDOM.render(
  React.createElement(Hello, {toWhat: 'World'}, null),
  document.getElementById('root')
);
```

`React.createElement(component, props, children)`는 세 가지 인수를 허용합니다. 작동 방식은 다음과 같습니다.

1. HTML 엘리먼트 또는 함수 컴포넌트를 나타내는 문자열일 수 있는 **컴포넌트**
2. [전달하려는 모든 **props**](/learn/passing-props-to-a-component)의 객체
3. 텍스트 문자열과 같이 컴포넌트가 가질 수 있는 모든 **자식** 객체

`React.createElement()`를 입력하는 것이 지루하다면 한 가지 일반적인 패턴은 축약어를 지정하는 것입니다.

```js
const e = React.createElement;

ReactDOM.render(e('div', null, 'Hello World'), document.getElementById('root'));
```

`React.createElement()`에 축약어를 사용 한다면 JSX 없이 React를 사용하는 것처럼 편리할 것입니다.

</DeepDive>
