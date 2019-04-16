---
id: add-react-to-a-website
title: 웹 사이트에 React 추가하기
permalink: docs/add-react-to-a-website.html
redirect_from:
  - "docs/add-react-to-an-existing-app.html"
prev: getting-started.html
next: create-a-new-react-app.html
---

크건 작건 필요한 만큼의 React를 사용해보세요.

React는 처음부터 점진적으로 채택되도록 디자인되었습니다. 그러므로 **크건 작건 필요한 만큼의 React를 사용할 수 있습니다.** 아마 기존페이지에 단지 약간의 "인터랙티브 UI 요소"를 원한다면 React 컴포넌트는 아주 좋은 선택입니다.

대부분의 웹사이트는 단일페이지 애플리케이션이 아니며 그럴 필요도 없습니다. 당신의 웹사이트 일부분에서 **빌드 도구 없이 몇줄의 코드로** React를 실습해 볼 수 있고, 이 부분을 서서히 확장하거나 약간에 동적 위젯을 포함할 수 있습니다.

---
 
- [1분 만에 React 추가하기](#add-react-in-one-minute)
- [Optional: JSX로 React 활용해보기](#optional-try-react-with-jsx) (bundler 없이!)

## 1분 만에 React 추가하기 {#add-react-in-one-minute}

이 섹션에서 어떻게 React 컴포넌트를 기존에 HTML 페이지에 추가할 수 있는지 볼 것입니다. 자신의 웹사이트나 빈 HTML 파일을 만들어 연습할 수 있습니다.

어떠한 설치나 복잡한 도구 없이 **인터넷에 연결되어 있고 몇분의 시간만 있다면 이번 섹션을 완수할 수 있습니다.**

Optional: [모든 예제 다운받기 (2KB 압축됨)](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605/archive/f6c882b6ae18bde42dcf6fdb751aae93495a2275.zip)

### Step 1: HTML에 DOM 컨테이너 추가하기 {#step-1-add-a-dom-container-to-the-html}

먼저 수정할 HTML page를 열어주세요. 그리고 빈 `<div>` 태그를 보여주고 싶은 곳에 다음의 예시처럼 만듭니다.

```html{3}
<!-- ... existing HTML ... -->

<div id="like_button_container"></div>

<!-- ... existing HTML ... -->
```

`<div>` HTML 태그에 유니크한 `id` 속성을 부여해 줄 수 있습니다. 부여한 `id`는 JavaScript를 이용해 이 태그를 찾게 해주고 그 태그 안에서 React 컴포넌트를 보여줄 수 있게 해줍니다.

>팁
>
> `<body>`태그 안 **어디든** `<div>`컨테이너를 배치할 수 있다면 페이지에 어디든 필요한 만큼 독립적인 DOM 컨테이너를 가질 수 있습니다. 그것은 보통 비어있고 -- React는 어떠한 내용도 DOM 컨테이너 안에 채울 수 있습니다.

### Step 2: Script 추가하기{#step-2-add-the-script-tags}

다음은 HTML page에 `</body>`태그와 가까운 곳에 다음 세 줄의 `<script>`태그를 추가합니다.

```html{5,6,9}
  <!-- ... other HTML ... -->

  <!-- React 불러오기. -->
  <!-- Note: 서버에 deploying 할때, "development.js" 와 "production.min.js"로 대체하세요. -->
  <script src="https://unpkg.com/react@16/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js" crossorigin></script>

  <!-- React 컴포넌트 불러오기. -->
  <script src="like_button.js"></script>

</body>
```

처음 두 태그는 React를 불러오고 세 번째 태그는 컴포넌트 코드를 불러옵니다.

### Step 3: React 컴포넌트 생성하기 {#step-3-create-a-react-component}

HTML page가 있는 곳에  `like_button.js` 파일을 생성합니다 

**[this starter code](https://cdn.rawgit.com/gaearon/0b180827c190fe4fd98b4c7f570ea4a8/raw/b9157ce933c79a4559d2aa9ff3372668cce48de7/LikeButton.js)** 이 링크를 열어 내용을 복사한 후 방금 생성한 파일에 붙여넣기를 합니다.

>팁
>
>이 코드는 React 컴포넌트를 `LikeButton`이라고 정의합니다. 아직 이해하지 못하더라도 걱정 마세요 -- 나중에 [자습서 시작하기](/tutorial/tutorial.html)와 [주요 개념 안내](/docs/hello-world.html) 코스에서  React의 기본 요소를 다룰 것입니다. 지금은 화면에 그대로 따라하기만 하세요

**[the starter code](https://cdn.rawgit.com/gaearon/0b180827c190fe4fd98b4c7f570ea4a8/raw/b9157ce933c79a4559d2aa9ff3372668cce48de7/LikeButton.js)** 다음에 `like_button.js`의 아랫부분에 두줄을 추가해주세요 

```js{3,4}
// ... the starter code 붙여넣기 ...

const domContainer = document.querySelector('#like_button_container');
ReactDOM.render(e(LikeButton), domContainer);
```

이 두줄의 코드는 HTML에 처음에 추가한 `<div>` 태그를 찾습니다. 그 뒤에 React 컴포넌트 안 있는 "Like" 버튼을 보여줍니다.

### 이게 답니다! {#thats-it}

네 번째 스텝은 없습니다. **당신은 방금 웹사이트에 첫 번째 React 컴포넌트를 추가했습니다**

다음 섹션을 확인하세요. React의 더 많은 팁이 모여있습니다.

**[전체 예제코드 보기](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605)**

**[전체 예제 다운받기 (2KB 압축됨)](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605/archive/f6c882b6ae18bde42dcf6fdb751aae93495a2275.zip)**

### 팁: 컴포넌트 재사용하기 {#tip-reuse-a-component}

보통 HTML page 여러 곳에 React 컴포넌트를 보여줄 수 있습니다. 여기 이 예제는 약간의 데이터를 전달하는 "Like" 버튼을 세 번 보여주는 예시이다.

[전체 예제코드 보기](https://gist.github.com/gaearon/faa67b76a6c47adbab04f739cba7ceda)

[전체 예제 다운받기 (2KB 압축됨)](https://gist.github.com/gaearon/faa67b76a6c47adbab04f739cba7ceda/archive/9d0dd0ee941fea05fd1357502e5aa348abb84c12.zip)

>Note
>
>이 전략은 React를 사용하는 부분이 서로 독립될 때 대게 유용합니다. 이 전략 말고도 React 코드 안에 [컴포넌트 합성](/docs/components-and-props.html#composing-components)이라는 다른 쉬운 방법도 있습니다.

### 팁: 제품을 위한 JavaScript 압축 {#tip-minify-javascript-for-production}

웹사이트의 프로덕션 배포 전 JavaScript의 압축을 하지 않는다면 현저히 느린 페이지를 서비스하게 될 것입니다.

이미 애플리케이션 스크립트의 압축을 했다면 **당신의 사이트는 프로덕션 준비가 됐습니다.** HTML을 확실히 배포했다면 `production.min.js`의 끝부분에서 해당 버전의 React를 불러옵니다.

```js
<script src="https://unpkg.com/react@16/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js" crossorigin></script>
```

코드에 압축을 위한 어떠한 단계도 거치지 않았다면 [이 방법을 실행해보세요](https://gist.github.com/gaearon/42a2ffa41b8319948f9be4076286e1f3).

## Optional: JSX로 React 활용해보기 {#optional-try-react-with-jsx}

네이티브 브라우저에서 이 예제는 진행되었습니다. 이 사실은 왜 JavaScript를 사용하고 React로 무언가를 보여주기 위해 JavaScript function을 부르는지에 대한 이유입니다.

```js
const e = React.createElement;

// Display a "Like" <button>
return e(
  'button',
  { onClick: () => this.setState({ liked: true }) },
  'Like'
);
```

한편 React는 [JSX](/docs/introducing-jsx.html)를 사용하기 위한 옵션을 제공합니다.

```js
// Display a "Like" <button>
return (
  <button onClick={() => this.setState({ liked: true })}>
    Like
  </button>
);
```

이 두 코드는 완전히 동일합니다. JSX는 [분명히 옵션](/docs/react-without-jsx.html)이지만 대부분의 사람은 UI code를 쓰는데 React와 다른 라이브러리 모두에서 도움이 된다는 걸 알게 되었습니다.

당신은 [이 온라인 컨버터](https://babeljs.io/repl#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=Q&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&sourceType=module&lineWrap=true&presets=es2015%2Creact%2Cstage-2%2Cstage-3&prettier=true&targets=Node-6.12&version=6.26.0&envVersion=)에서 JSX를 사용하고 실행할 수 있습니다.

### 빠르게 JSX 사용해보기 {#quickly-try-jsx}

프로젝트에서 JSX를 사용해보는 가장 빠른 방법은 이 `<script>`를 페이지에 추가하는 것입니다.

```html
<script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
```

이제 어떠한 `<script>` 태그에서도 `type="text/babel"`속성을 추가한다면 JSX를 사용할 수 있습니다. 여기에서 [JSX를 포함한 예제 HTML코드](https://raw.githubusercontent.com/reactjs/reactjs.org/master/static/html/single-file-example.html)를 다운받고 실행해 볼 수 있습니다.

이 접근법은 공부나 간단한 데모를 만드는데 적합합니다. 그러나 이 방법은 웹사이트를 느리게 만들고 **프로덕션에는 적합하지 않습니다.** 이제는 앞으로 나아갈 준비를 해야할 때입니다. 추가했던 이 `<script>`태그와 `type="text/babel"` 속성을 지우시고 대신에 다음 섹션에서 모든 스크립트 태그를 변환해줄 JSX 전처리기(preprocessor)를 설치해야 합니다. 

### 프로젝트에 JSX 추가하기 {#add-jsx-to-a-project}

더는 JSX를 프로젝트에 추가하기 위해 복잡한 bundler나 개발 서버와 같은 도구는 필요 없습니다. 본질적으로 JSX를 추가하는 것은 **수많은 CSS 전처리기(preprocessor) 같은 것을 추가하는 것과 같습니다.** 오직 필요한 것은 [Node.js](https://nodejs.org/)를 컴퓨터에 설치하는 것입니다.

터미널에서 프로젝트 폴더로 이동 후 다음 두 커맨드를 붙여넣으세요.

1. **Step 1:** Run `npm init -y` (실패한다면 [이곳을 참고하세요](https://gist.github.com/gaearon/246f6380610e262f8a648e3e51cad40d))
2. **Step 2:** Run `npm install babel-cli@6 babel-preset-react-app@3`

>팁
>
>우리는 **여기서 JSX 전처리(preprocessor)기를 설치하는 데만 npm을 사용할 것입니다.** 그리고 다른 곳에서는 필요하지 않습니다. 그리고 React와 애플리케이션 코드 둘 다 아무 수정 없이 `<script>` 태그를 그대로 사용할 수 있습니다.

축하합니다! 이제 **프로덕션할 준비가 된 JSX setup**을 프로젝트에 추가했습니다.
### JSX Preprocessor 실행하기 {#run-jsx-preprocessor}

`src` 라는 폴더를 만들고 터미널에서 이 커맨드를 실행하세요.

```
npx babel --watch src --out-dir . --presets react-app/prod 
```

>Note
>
>`npx` 는 오타가 아닙니다. -- 이것은 [npm 5.2+ 때부터 있던 패키지 실행 도구 입니다.](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b).
>
>"You have mistakenly installed the `babel` package" 에러 메시지를 보았다면 [이전 스텝에서](#add-jsx-to-a-project) 실수가 있었을 겁니다. 같은 폴더 안에서 실행했는지 확인해 보시고 다시 시도해 보세요.

끝나기를 기다리지 마세요 -- 이 커맨드는 시작하고 JSX를 자동으로 감시(watch)하는 커맨드입니다.

지금 **[JSX starter code](https://cdn.rawgit.com/gaearon/c8e112dc74ac44aac4f673f2c39d19d1/raw/09b951c86c1bf1116af741fa4664511f2f179f0a/like_button.js)**와 같은  `src/like_button.js`라는 새로운 파일을 생성했다면, 이 감시자(watcher)는 `like_button.js`파일을 전처리(preprocessor)해 브라우저에 적합한 순수 JavaScript code 생성할 것입니다. 그리고 소스 파일에 JSX를 수정할 때 자동으로 다시 실행되고 변환시켜줄 것입니다.

보너스 팁으로 클래스와 같은 최신 JavaScript 문법 기능을 구형 브라우저에서 수행할 때 망가질 걱정은 안 해도 됩니다. 이를 위한 도구는 Babel이라 불리고 자세한 내용은 [이 문서](https://babeljs.io/docs/en/babel-cli/)로부터 배울 수 있습니다.

빌드 도구에 익숙해지고 더 많은 일을 할 수 있기를 원한다면 [다음 섹션](/docs/create-a-new-react-app.html)에서는 가장 인기 있고 접근하기 쉬운 툴 체인에 대해 설명합니다. 그렇지 않더라도 이 스크립트 태그는 정상적으로 작동합니다.