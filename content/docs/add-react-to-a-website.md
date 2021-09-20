---
id: add-react-to-a-website
title: 웹사이트에 React 추가
permalink: docs/add-react-to-a-website.html
redirect_from:
  - "docs/add-react-to-an-existing-app.html"
prev: getting-started.html
next: create-a-new-react-app.html
---

React는 필요한 만큼만 사용하면 됩니다. 적게든 많게든 말이죠.

React는 처음부터 점진적으로 도입할 수 있게 설계되었습니다. **그래서 React는 필요한 만큼만 사용하면 됩니다.** 아마 기존 페이지에 "상호작용"이라는 조미료를 첨가하기만 하고 싶을 수도 있습니다. 이럴 때 React 컴포넌트를 쓰면 좋습니다.

오늘날 웹사이트의 대부분은 싱글 페이지가 아니고 그래야 할 필요도 없습니다. **빌드 도구 없이 몇 줄의 코드만으로** 웹사이트의 작은 부분에 먼저 React를 도입해보세요. React의 비중을 천천히 늘릴 수도 있고 아니면 동적인 위젯을 몇 개 추가하는 것으로 끝낼 수도 있습니다.

---

- [React 1분 내로 추가하기](#add-react-in-one-minute)
- [선택사항: JSX로 React 해보기](#optional-try-react-with-jsx) (번들러가 필요없습니다!)

## 1분 내로 React 추가하기 {#add-react-in-one-minute}

이 글에서는 기존 페이지에 리액트를 추가하는 법에 대해서 다룹니다. 기존의 웹사이트에서 시도 해보셔도 좋고, 연습삼아 새로운 HTML 파일에서 시도해보셔도 좋습니다.

복잡한 도구를 쓰거나 뭔가를 따로 설치해야 할 필요도 없습니다. **약간의 시간과 함께 인터넷만 연결 되어 있다면 이 문서에서 다루는 것을 모두 해볼 수 있습니다.**

선택사항: [예제의 전체 소스코드 다운로드 (2KB로 압축됨)](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605/archive/f6c882b6ae18bde42dcf6fdb751aae93495a2275.zip)

### 1단계: HTML 파일에 DOM 컨테이너 설치 {#step-1-add-a-dom-container-to-the-html}

먼저, 편집할 HTML 파일을 엽니다. 그 다음 비어있는 `<div>` 태그를 추가해줍니다. 이 태그가 바로 React를 통해 원하는 내용을 표시할 수 있는 위치가 됩니다. 다음과 같이 말이죠.

```html{3}
<!-- ... existing HTML ... -->

<div id="like_button_container"></div>

<!-- ... existing HTML ... -->
```

이 `<div>` 태그에  유일한 HTML 속성인 `id`를 부여해줍니다. 이를 통해 JavaScript가 태그를 찾고 찾은 태그 안에 React 컴포넌트를 표시할 수 있게됩니다.

>팁
>
>컨테이너 `<div>` 태그는 이 처럼 `<body>` 태그 안 쪽 **어디서든** 추가할 수 있습니다. 한 페이지에서도 독립적인 DOM 컨테이너를 원하는 만큼 추가할 수 있습니다. 보통 이 태그는 비어있습니다. React가 DOM 컨테이너 안에 내용을 추가해줍니다.

### 2단계: 스크립트 태그 추가하기 {#step-2-add-the-script-tags}

그 다음, `<script>` 태그 3개를 닫는 태그인 `</body>` 앞에 추가해줍니다.

```html{5,6,9}
  <!-- ... 다른 HTML ... -->

  <!-- React를 실행. -->
  <!-- 주의: 사이트를 배포할 때는 "development.js"를 "production.min.js"로 대체하세요. -->
  <script src="https://unpkg.com/react@17/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js" crossorigin></script>

  <!-- 만든 React 컴포넌트를 실행. -->
  <script src="like_button.js"></script>

</body>
```

처음 두 태그는 React를 실행시키고 3번 째 코드는 만든 컴포넌트를 실행시킵니다.

### 3단계: React 컴포넌트 만들기 {#step-3-create-a-react-component}

 `like_button.js` 라는 이름으로 HTML 페이지 옆에 새 파일을 만듭니다.

 이 **[스타터 코드](https://gist.github.com/gaearon/0b180827c190fe4fd98b4c7f570ea4a8/raw/b9157ce933c79a4559d2aa9ff3372668cce48de7/LikeButton.js)** 를 열고 코드를 방금 만든 파일에 복사해줍니다.

>팁
>
>이 코드는 `LikeButton` 이라는 React 컴포넌트를 정의해줍니다. 지금 당장 이해가 안 되어도 걱정 마세요. React에 대한 개념을 쌓아 나가는 것은 나중에 [자습서](/tutorial/tutorial.html)와 [주요 개념 가이드](/docs/hello-world.html)에서 다룰 겁니다. 그러니 지금 당장은, 컴포넌트를 화면에 띄우는 데 집중해봅시다!

`like_button.js`의 맨 뒷 줄, 그러니까 아까 붙여넣은 **[스타터 코드](https://gist.github.com/gaearon/0b180827c190fe4fd98b4c7f570ea4a8/raw/b9157ce933c79a4559d2aa9ff3372668cce48de7/LikeButton.js)** 뒤에 다음 코드 두 줄을 추가해줍니다.

```js{3,4}
// ... 복사했던 스타터 코드 ...

const domContainer = document.querySelector('#like_button_container');
ReactDOM.render(e(LikeButton), domContainer);
```

이 두줄의 코드는 첫 단계에서 HTML 페이지에 추가했던 `<div>` 태그를 찾아주고 그 안에 "좋아요" 버튼이라는 React 컴포넌트를 추가해줍니다.

### 다 끝났습니다! {#thats-it}

다음 단계는 없습니다. **당신은 방금 웹사이트에 처음으로 React 컴포넌트를 추가했습니다.**

다음 차례들에 React를 기존 프로젝트에 결합하는데 도움이 될만한 정보들이 더 있습니다.

**[예제 전체 소스 코드 보기](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605)**

**[예제 전체 다운로드 (2KB로 압축됨)](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605/archive/f6c882b6ae18bde42dcf6fdb751aae93495a2275.zip)**

### 팁: 컴포넌트 재사용 {#tip-reuse-a-component}

보통은 하나의 웹페이지에 여러 React 컴포넌트를 설치하게 됩니다. 다음 예제는 "좋아요" 버튼 3개를 만들고 그 컴포넌트들에 데이터를 넘겨주는 코드입니다.

[예제 전체 소스 코드 보기](https://gist.github.com/gaearon/faa67b76a6c47adbab04f739cba7ceda)

[예제 전체 다운로드 (2KB로 압축됨)](https://gist.github.com/gaearon/faa67b76a6c47adbab04f739cba7ceda/archive/9d0dd0ee941fea05fd1357502e5aa348abb84c12.zip)

>주의
>
>이 방법은 대개 페이지에서 React로 만들어진 부분들이 서로 격리 되어있을 때 유용합니다. React 코드 내에서는 [컴포넌트 합성](/docs/components-and-props.html#composing-components)을 사용하는 편이 더 쉽습니다.

### 팁: 프로덕션을 위한 JavaScript의 압축 {#tip-minify-javascript-for-production}

프로덕션을 위해 웹사이트를 배포하기 전에 JavaScript 파일을 압축하지 않는다면 웹사이트를 사용할 때 눈에 띄는 성능 저하가 일어날 겁니다.

애플리케이션 스크립트를 이미 압축했을 경우 배포된 HTML 파일이 `production.min.js`로 끝나는 React 파일을 확실히 실행하기만 하면 **사이트는 프로덕션 준비가 완료된 겁니다.**

```js
<script src="https://unpkg.com/react@17/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js" crossorigin></script>
```

스크립트를 압축하는 절차가 따로 없다면 [이 사이트를 참고해서 설정해보세요.](https://gist.github.com/gaearon/42a2ffa41b8319948f9be4076286e1f3)

## 선택사항: JSX로 React 해보기 {#optional-try-react-with-jsx}

<<<<<<< HEAD
지금까지 다뤘던 예제들은 브라우저가 기본적으로 지원하는 요소들만을 사용했습니다. 때문에 React가 어떤 것을 표시할지 결정 해주는 JavaScript의 함수들을 사용했습니다.
=======
In the examples above, we only relied on features that are natively supported by browsers. This is why we used a JavaScript function call to tell React what to display:
>>>>>>> f0a9793dff9f8e86ec365bfadb0b4b23c6f618ce

```js
const e = React.createElement;

// "좋아요" <button>을 표시
return e(
  'button',
  { onClick: () => this.setState({ liked: true }) },
  'Like'
);
```

하지만, React에서는 [JSX](/docs/introducing-jsx.html)라는 또 다른 선택지가 있습니다.

```js
//  "좋아요" <button>을 표시
return (
  <button onClick={() => this.setState({ liked: true })}>
    Like
  </button>
);
```

위 두 코드들은 같은 기능을 수행합니다. **JSX는 [필수가 아닌 선택사항](/docs/react-without-jsx.html)**이지만 사람들은 UI 코드를 짤 때 JSX를 쓰는 것이 더 편리하다고 생각합니다. React와 다른 라이브러리들에서도 말이죠.

[이 온라인 변화기](https://babeljs.io/en/repl#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=DwIwrgLhD2B2AEcDCAbAlgYwNYF4DeAFAJTw4B88EAFmgM4B0tAphAMoQCGETBe86WJgBMAXJQBOYJvAC-RGWQBQ8FfAAyaQYuAB6cFDhkgA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=es2015%2Creact%2Cstage-2&prettier=false&targets=&version=7.4.3)를 통해서 JSX로 여러 가지 작업을 해볼 수 있습니다.

### JSX 빠르게 시도해보기 {#quickly-try-jsx}

기존 프로젝트에서 JSX 태그를 써보는 제일 빠른 방법은 이 `<script>` 태그를 집어넣는 겁니다.

```html
<script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
```

<<<<<<< HEAD
이제 어떤 `<script>` 태그에서든 `type="text/babel"`성질을 추가하면 JSX를 사용할 수 있습니다. 이 [JSX를 사용한 예제 HTML 파일](https://raw.githubusercontent.com/reactjs/reactjs.org/master/static/html/single-file-example.html)로 여러 가지 작업들을 해보세요.
=======
Now you can use JSX in any `<script>` tag by adding `type="text/babel"` attribute to it. Here is [an example HTML file with JSX](https://raw.githubusercontent.com/reactjs/reactjs.org/main/static/html/single-file-example.html) that you can download and play with.
>>>>>>> f0a9793dff9f8e86ec365bfadb0b4b23c6f618ce

이런 식의 접근 방법은 공부 목적이나 간단한 데모 사이트를 만들기 위함이라면 괜찮습니다. 그러나, 이 방법은 사이트를 느리게 만들고 **프로덕션에서는 맞지 않습니다.** 한 단계 앞으로 나아갈 준비가 되었다면 새로 추가한 `<script>` 태그와 `type="text/babel"` 어트리뷰트를 제거해보세요. 다음 차례에서는 `<script>` 태그를 자동으로 변환시켜줄 JSX 전처리기를 만들 겁니다.

### 프로젝트에 JSX 추가하기 {#add-jsx-to-a-project}

JSX를 프로젝트에 추가하는 데에는 복잡한 번들러나 개발 서버가 필요하지 않습니다. 핵심은, JSX를 추가하는 건 **마치 CSS 전처리기를 추가하는 것과 같다는 겁니다.** 오직 필요한 건 컴퓨터에 [Node.js](https://nodejs.org/)를 설치하는 겁니다.

터미널에서 프로젝트 파일에 접근하고 다음 두 명령어를 붙여넣기 하세요.

1. **1단계:** `npm init -y` 를 실행하세요. (실패한다면 [여기서 해결할 수 있습니다.](https://gist.github.com/gaearon/246f6380610e262f8a648e3e51cad40d))
2. **2단계:** `npm install babel-cli@6 babel-preset-react-app@3`를 실행하세요.

>팁
>
>**JSX 전처리기를 설치할 때 npm은 여기서만 쓰면 됩니다.**  다른 단계에서는 npm이 쓰일 일이 없습니다. React와 애플리케이션 코드는 둘다 똑같이 `<script>` 태그로 유지할 수 있습니다.

축하합니다! 당신은 프로젝트에 **프로덕션 준비가 된 JSX 설정**을 끝마쳤습니다.


### JSX 전처리기 실행하기 {#run-jsx-preprocessor}

`src` 폴더를 만들고 다음 터미널 명령어를 실행하세요.

```
npx babel --watch src --out-dir . --presets react-app/prod
```

>주의
>
>`npx`는 오타가 아닙니다. -- [npm 5.2버전 이상에 내장된 패키지 실행 도구](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b)입니다.
>
>"`babel` 패키지 설치가 잘못 수행되었습니다."라는 에러 메시지를 보았다면, [그 전 단계들](#add-jsx-to-a-project)에서 몇 가지 놓쳤을 수도 있습니다. 동일한 폴더에서 이를 실행하고 다시 시도해보세요.

끝날 때 까지 기다릴 필요가 없습니다. 이 명령어는 자동화 된 JSX 감시기를 실행합니다.

**[JSX 스타터 코드](https://gist.github.com/gaearon/c8e112dc74ac44aac4f673f2c39d19d1/raw/09b951c86c1bf1116af741fa4664511f2f179f0a/like_button.js)**를 통해 `src/like_button.js`라는 파일을 만들어주면, 감시기가 전처리 되어 브라우저와 호환되는 순수 JavaScript로 구성된 `like_button.js`를 생성합니다. JSX를 포함한 소스 파일을 편집하면 이 과정이 자동으로 다시 실행됩니다.

덤으로 이 감시기는 구형 브라우저와의 호환성 문제를 걱정할 필요 없이 클래스와 같은 모던 JavaScript 문법을 쓸 수 있게 해줍니다. 아까 사용했던 도구는 Babel이라고 부릅니다. Babel에 대한 자세한 정보는 [공식 문서](http://babeljs.io/docs/en/babel-cli/)에서 볼 수 있습니다.

이런 빌드 도구들에 익숙해지고 더 많은 것을 해보고 싶어진다고 느끼기 시작한다면, [다음 문서](/docs/create-a-new-react-app.html) 에서 가장 널리 쓰이고 접근성이 좋은 툴체인들을 소개하고 있으니 확인해보세요. 만약 그렇지 않아도 괜찮다면, 이 스크립트 태그만으로도 충분합니다!
