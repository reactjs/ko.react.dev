---
title: 기존 프로젝트에 React 추가하기
---

<Intro>

기존 프로젝트에 일부 상호작용 요소를 추가하고 싶다면, React에 프로젝트를 다시 작성할 필요가 없습니다. 기존의 스택에 React를 추가하고 어디에서나 상호작용할 수 있는 React 컴포넌트를 렌더링하세요.

</Intro>

<Note>

**로컬 개발환경에 [Node.js](https://nodejs.org/en/)를 설치해야 합니다.** 온라인에서 [try React](/learn/installation#try-react)를 실행하거나 간단한 HTML에서도 React를 사용할 수 있지만, 현실적으로 개발을 위해 사용하는 대부분의 JavaScript 도구는 Node.js가 필요합니다.

</Note>

## 기존 웹사이트의 전체 하위 경로에 React 사용하기 {/*using-react-for-an-entire-subroute-of-your-existing-website*/}

`example.com`이라는 또 다른 서버 기술 (Rails와 같은) 로 빌드한 기존 웹 앱이 있고, `example.com/some-app/`으로 시작하는 모든 경로를 React로 완전히 구현하고 싶다고 가정해 보겠습니다.

다음과 같이 설정하는 것을 추천합니다.

1. [React 기반 프레임워크](/learn/start-a-new-react-project) 중 하나를 사용하여 **앱의 React 부분을 빌드하세요.**

2. 사용하는 프레임워크 설정에서 **`/some-app` 을 *기본 경로*로 명시하세요.** (방법은 다음과 같습니다. [Next.js](https://nextjs.org/docs/api-reference/next.config.js/basepath), [Gatsby](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting/path-prefix/))

3. **서버 또는 프락시를 구성**하여 `/some-app/` 아래의 모든 요청이 React 애플리케이션에서 처리되도록 하세요.

이는 앱의 React 부분이 이러한 프레임워크에 내장된 [최고의 사례들로부터 이점을 얻을 수 있습니다.](/learn/start-a-new-react-project#can-i-use-react-without-a-framework)

많은 React 기반의 프레임워크는 풀스택이며 React 앱이 서버를 활용할 수 있도록 합니다. 그러나 서버에서 JavaScript를 실행할 수 없거나 실행하고 싶지 않은 경우에도 동일한 접근방식을 사용할 수 있습니다. 이러한 경우에는 HTML/CSS/JS 내보내기(Next.js의 경우 [`next export` output](https://nextjs.org/docs/advanced-features/static-html-export), Gatsby의 경우 기본값)를 `/some-app/`에서 대신 제공하세요.

## 기존 페이지의 일부분에 React 사용하기 {/*using-react-for-a-part-of-your-existing-page*/}

이미 다른 기술(Rails와 같은 서버 기술 또는 Backbone과 같은 클라이언트 기술)로 빌드된 기존 페이지가 있고 해당 페이지 어딘가에 상호작용할 수 있는 React 컴포넌트를 렌더링하고 싶다고 가정해 봅시다. 이는 React 컴포넌트를 통합하는 일반적인 방식입니다.-- 실제로 수년 동안 Meta에서 대부분의 React 사용을 이런 식으로 하였습니다!

이 방식은 두 가지 단계로 수행할 수 있습니다.

1. [JSX syntax](/learn/writing-markup-with-jsx)을 사용할 수 있게 **JavaScript 환경을 설정**하고 [`import`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/import) / [`export`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/export) 문법을 통해 코드를 모듈로 분리한 다음 [npm](https://www.npmjs.com/) 패키지 레지스트리의 패키지(예: React)를 사용하세요.

2. 해당 페이지에서 보고 싶은 곳에 **React 컴포넌트를 렌더링하세요.**

정확한 접근 방식은 기존 페이지의 설정에 따라 다르기 때문에, 몇 가지 세부 사항을 함께 살펴보겠습니다.

### 1단계 : 모듈 JavaScript 환경 설정하기 {/*step-1-set-up-a-modular-javascript-environment*/}

모듈 JavaScript 환경은 모든 코드를 한 파일에 작성하는 것이 아닌 각각의 React 컴포넌트를 개별 파일로 작성할 수 있게 합니다. 또한 React 자체를 포함한 다른 개발자들이 [npm](https://www.npmjs.com/) 레지스트리에 배포한 모든 훌륭한 패키지들을 사용할 수 있습니다. 이 방법은 기존 설정에 따라 다르게 진행될 것입니다.

* **이미 애플리케이션이 `import` 구문을 이용해 파일로 분리하고 있다면** 기존에 가지고 있는 설정을 이용해 보세요. JS 코드에서 `<div />`를 작성하면 구문 오류가 발생하는지 확인해 보세요. 구문 오류가 발생한다면  [Babel을 이용한 JavaScript 코드 변환](https://babeljs.io/setup)이 필요할 수 있으며 JSX를 사용하려면 [Babel React 프리셋](https://babeljs.io/docs/babel-preset-react)을 활성화해야 할 수 있습니다.

* **애플레키에션이 JavaScript 모듈을 컴파일하기 위한 기존 설정이 없다면,** [Vite](https://vitejs.dev/)를 이용하여 설정하세요. Vite 커뮤니티는 Rails, Django, Laravel을 포함한 [다양한 백엔드 프레임워크와의 통합](https://github.com/vitejs/awesome-vite#integrations-with-backends)을 지원하고 있습니다. 사용 중인 백엔드 프레임워크가 목록에 없다면 [이 가이드를 참고하여](https://vitejs.dev/guide/backend-integration.html) Vite 빌드를 백엔드와 수동으로 통합하세요. 

설정이 제대로 작동하는지 확인하려면 프로젝트 폴더에서 아래 커맨드를 실행하세요.

<TerminalBlock>
npm install react react-dom
</TerminalBlock>

그리고 메인 JavaScript 파일(`index.js` 혹은 `main.js`라고 불리는 파일일 수 있습니다.)의 최상단에 다음 코드 라인을 추가하세요.

<Sandpack>

```html index.html hidden
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <!-- 기존 페이지 컨텐츠 (이 예제에서는 이 부분이 대체됩니다)-->
  </body>
</html>
```

```js index.js active
import { createRoot } from 'react-dom/client';

// 기존 HTML 컨텐츠를 지웁니다.
document.body.innerHTML = '<div id="app"></div>';

// 대신에 여러분이 작성한 React 컴포넌트를 렌더링합니다.
const root = createRoot(document.getElementById('app'));
root.render(<h1>Hello, world</h1>);
```

</Sandpack>

페이지의 전체 내용이 "Hello, world!"로 바뀌었다면 모든 것이 정상적으로 작동하고 있는 겁니다! 계속해서 읽어보세요.

<Note>

처음으로 기존 프로젝트에 모듈 JavaScript 환경을 통합하기는 다소 어려워 보일 수 있으나 그만한 가치가 있는 일입니다! 어려움을 겪는 부분이 있다면 우리의 [커뮤니티 리소스](/community)나 [Vite 채팅](https://chat.vitejs.dev/)을 이용해 보세요.

</Note>


### 2단계 : 페이지 어디에서든 React 컴포넌트 렌더링하기 {/*step-2-render-react-components-anywhere-on-the-page*/}
이전 단계에서는, 메인 파일 최상단에 이 코드를 넣었습니다.

```js
import { createRoot } from 'react-dom/client';

// 기존 HTML 컨텐츠를 지웁니다.
document.body.innerHTML = '<div id="app"></div>';

// 대신에 여러분이 작성한 React 컴포넌트를 렌더링합니다.
const root = createRoot(document.getElementById('app'));
root.render(<h1>Hello, world</h1>);
```

당연히 실제로는 기존 HTML 콘텐츠를 지우고 싶지 않을 겁니다!

이 코드를 삭제하세요.

대신 React 컴포넌트를 HTML의 특정 위치에 렌더링하고 싶을 것입니다. HTML 페이지를 열고(또는 이를 생성하는 서버 템플릿) HTML 태그에 고유한 `id` 속성을 추가하세요. 

```html
<!-- ... html의 어딘가 ... -->
<nav id="navigation"></nav>
<!-- ... 더 많은 html ... -->
```

이렇게 하면 HTML 요소를 [`document.getElementById`](https://developer.mozilla.org/ko/docs/Web/API/Document/getElementById)를 통해 찾고 찾은 [`createRoot`](/reference/react-dom/client/createRoot)에 전달함으로써 해당 요소 내부에 React 컴포넌트를 렌더링할 수 있습니다.

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <p>This paragraph is a part of HTML.</p>
    <nav id="navigation"></nav>
    <p>This paragraph is also a part of HTML.</p>
  </body>
</html>
```

```js index.js active
import { createRoot } from 'react-dom/client';

function NavigationBar() {
  // TODO: 실제로 네비게이션 바를 구현합니다.
  return <h1>Hello from React!</h1>;
}

const domNode = document.getElementById('navigation');
const root = createRoot(domNode);
root.render(<NavigationBar />);
```

</Sandpack>

기존에 존재하던 'index.html'의 원본 HTML 컨텐츠가 그대로 남아있는 것을 확인할 수 있습니다. 하지만 이제는 `<nav id="navigation">` 안에 개발자가 직접 작성한 `NavigationBar` React 컴포넌트가 나타납니다. 기존 HTML 페이지에서 React 컴포넌트가 렌더링 되는 것에 대하여 더 알아보려면 [`createRoot` usage documentation](/reference/react-dom/client/createRoot#rendering-a-page-partially-built-with-react)를 읽어보세요.

기존 프로젝트에서 React를 도입할 때, 일반적으로 작은 상호작용 컴포넌트(예: 버튼)에서 시작하여 점진적으로 "상위 구조로 확장하면서" 결국에는 전체 페이지가 React로 빌드될 때까지 이 과정을 반복하게 됩니다. 이 지점에 도달한다면 React의 장점을 최대한 활용하기 위해 [React 프레임워크](/learn/start-a-new-react-project)로 마이그레이션하는 것을 권장합니다.

## 기존 네이티브 모바일 앱에서 React Native 사용하기 {/*using-react-native-in-an-existing-native-mobile-app*/}

[React Native](https://reactnative.dev/) 역시 기존 네이티브 앱에 점진적으로 통합할 수 있습니다. 안드로이드(Java 또는 Kotlin)나 iOS(Objective-C 또는 Swift) 앱을 개발하고 있다면,[이 가이드를 참고하여](https://reactnative.dev/docs/integration-with-ex요isting-apps) React Native 화면을 추가해보세요.