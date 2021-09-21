---
id: codebase-overview
title: Codebase Overview
layout: contributing
permalink: docs/codebase-overview.html
prev: how-to-contribute.html
next: implementation-notes.html
redirect_from:
  - "contributing/codebase-overview.html"
---

이 섹션은 React 코드베이스 구조와 관례, 그리고 구현에 대한 개요를 설명하고 있습니다.

[React에 기여](/docs/how-to-contribute.html)하고자 한다면, 이 문서를 참고하여 프로젝트를 수정하길 바랍니다.

React 앱을 개발하는데 있어서 아래 관례들의 사용을 반드시 추천하지는 않습니다. 대부분의 관례들은 이전에 많이 사용된 것들이며, 차차 수정될 것입니다.

### 최상위 폴더 {#top-level-folders}

[React 저장소](https://github.com/facebook/react)를 클론하게 되면, 다음과 같은 몇 개의 최상위 폴더를 볼 수 있습니다.

* [`packages`](https://github.com/facebook/react/tree/main/packages) 폴더는 React 저장소에 있는 모든 패키지들에 대해 `package.json`과 같은 메타데이터와 `src` 폴더를 포함하고 있습니다. **만약 변경하고자 하는 부분이 코드와 관련되어 있다면, `src` 폴더에 대부분을 할애하게 될 것입니다.**
* [`fixtures`](https://github.com/facebook/react/tree/main/fixtures)에는 기여자들을 위한 몇 가지 React 테스트 애플리케이션이 존재합니다.
* `build` 폴더에는 React의 빌드 결과가 생성됩니다. 저장소에는 존재하지 않지만, React를 클론하고 처음 [빌드](/docs/how-to-contribute.html#development-workflow)할 시 생성됩니다.

설명 문서는 React로부터 [분리된 저장소](https://github.com/reactjs/reactjs.org)에 존재합니다.

위에서 언급한 것 외에 별도의 최상위 폴더가 존재하지만, 대부분 기여하는데 있어서 사용되지 않을 것입니다.

### Colocated 테스트 {#colocated-tests}

해당 프로젝트에는 유닛 테스트를 위한 상위 디렉토리가 존재하지 않습니다. 대신 소스 코드와 함께 `__tests__` 디렉토리 내부에 테스트 코드를 함께 넣어뒀습니다.

예를 들어, [`setInnerHTML.js`](https://github.com/facebook/react/blob/87724bd87506325fcaf2648c70fc1f43411a87be/src/renderers/dom/client/utils/setInnerHTML.js)에 대한 테스트 코드는 [`__tests__/setInnerHTML-test.js`](https://github.com/facebook/react/blob/87724bd87506325fcaf2648c70fc1f43411a87be/src/renderers/dom/client/utils/__tests__/setInnerHTML-test.js)에 존재합니다.

### 경고와 불변식 {#warnings-and-invariants}

React 코드베이스에서는 `console.error`를 사용해 경고를 표시합니다.

```js
if (__DEV__) {
  console.error('Something is wrong.');
}
```

경고는 개발 시에만 표시되며 배포 시에는 완전히 무시됩니다. 실행 시에 몇 가지 코드를 무시하기 위해서, 다음과 같이 `invariant` 모듈을 활용할 수 있습니다.

```js
var invariant = require('invariant');

invariant(
  2 + 2 === 4,
  'You shall not pass!'
);
```

**`invariant`의 대상 조건식이 `false`일 때 예외가 발생합니다.**

'불변식'은 '해당 조건식이 항상 참일 경우'를 의미합니다. 코드의 동작을 확실하게 하기 위한 요소라고 생각할 수 있습니다.

개발용과 배포용 프로그램이 서로 유사하게 동작하는 것은 중요합니다. 따라서 `invariant` 예외는 개발용과 배포용 프로그램에서 동시에 발생합니다. 오류 메시지는 배포용 프로그램에서 오류 코드로 자동 변환됩니다.

### 개발과 배포 {#development-and-production}

의사 전역 변수 `__DEV__`를 사용하여 개발 시에만 작동하는 코드를 작성할 수 있습니다.

해당 변수는 컴파일 단계에서 한번에 처리되며, CommonJS 빌드 시에 `process.env.NODE_ENV !== 'production'`로 변환됩니다.

스탠드얼론 빌드의 경우, 해당 변수는 압축하지 않을 시 `true`로 취급되며 압축 시 `if` 블록을 포함하여 전부 제거됩니다.

```js
if (__DEV__) {
  // This code will only run in development.
}
```

### Flow {#flow}

React는 최근 [Flow](https://flow.org/) 검사를 도입하기 시작했습니다. 라이센스 주석에 `@flow` 표시가 포함된 파일은 자료형 검사를 받게 됩니다.

해당 프로젝트는 [이미 존재하는 코드에 대한 Flow 형식 추가](https://github.com/facebook/react/pull/7600/files)에 대한 풀 리퀘스트를 허용하고 있습니다. Flow 검사 형식은 다음과 같이 구성되어 있습니다.

```js
ReactRef.detachRefs = function(
  instance: ReactInstance,
  element: ReactElement | string | number | null | false,
): void {
  // ...
}
```

가능하면 새로 작성하는 코드에 Flow 검사 형식을 포함해 주길 바랍니다.
`yarn flow` 명령어를 통해 Flow에 대한 형식 검사를 직접 수행해 볼 수 있습니다.

### 다양한 패키지 {#multiple-packages}

React는 [monorepo](https://danluu.com/monorepo/)입니다. 해당 저장소는 여러 분리된 패키지를 포함하고 있으며, 각 변경점들은 함께 반영되고 모든 이슈는 한 곳에서 관리됩니다.

### React 코어 {#react-core}

React의 '코어'는 모든 [최상위 `React` API](/docs/react-api.html#react)를 포함합니다. 예를 들면 다음과 같습니다.

* `React.createElement()`
* `React.Component`
* `React.Children`

**React 코어는 컴포넌트를 정의하는 데에 필요한 API만 포함하고 있습니다.** React 코어는 [재조정](/docs/reconciliation.html) 알고리즘과 플랫폼 전용 코드를 포함하고 있지 않습니다. 해당 코어는 React DOM과 React 네이티브의 컴포넌트에서 동시에 사용됩니다.

React 코어의 소스 코드는 [`packages/react`](https://github.com/facebook/react/tree/main/packages/react)에 위치하고 있습니다. 해당 코드는 npm에서 [`react`](https://www.npmjs.com/package/react) 패키지로 받을 수 있습니다. 관련된 스탠드얼론 브라우저 빌드는 `react.js`이며, 전역에서 `React` 키워드를 통해 접근할 수 있습니다.

### 렌더러 {#renderers}

React는 원래 DOM을 대상으로 하여 개발됐지만, 이후 [React 네이티브](https://reactnative.dev/)를 통해 네이티브 플랫폼 또한 지원하게 되었습니다. 본 문단은 React 내부의 '렌더러'에 대해 간략히 소개합니다.

**렌더러는 React 트리의 플랫폼 종속적인 변환 방법을 관리합니다.**

렌더러는 [`packages/`](https://github.com/facebook/react/tree/main/packages/) 폴더 안에 다음과 같이 존재합니다.

* [React DOM Renderer](https://github.com/facebook/react/tree/main/packages/react-dom)는 React 컴포넌트를 DOM으로 렌더링합니다. 해당 렌더러는 [최상위 레벨 `ReactDOM` API](/docs/react-dom.html)에 구현되어 있으며 npm에서 [`react-dom`](https://www.npmjs.com/package/react-dom) 패키지로 받을 수 있습니다. 또한 스탠드얼론 브라우저에서 `react-dom.js`를 통해 전역 `ReactDOM` 키워드로 접근할 수 있습니다.
* [React Native Renderer](https://github.com/facebook/react/tree/main/packages/react-native-renderer)는 React 컴포넌트를 네이티브 뷰로 렌더링합니다. 해당 렌더러는 React 네이티브 내부에서 사용됩니다.
* [React Test Renderer](https://github.com/facebook/react/tree/main/packages/react-test-renderer)는 React 컴포넌트를 JSON 형식으로 렌더링합니다. 해당 렌더러는 [Jest](https://facebook.github.io/jest)의 [Snapshot 테스트](https://facebook.github.io/jest/blog/2016/07/27/jest-14.html)에 사용되며, npm에서 [react-test-renderer](https://www.npmjs.com/package/react-test-renderer) 패키지로 받을 수 있습니다.

언급한 것 외에 공식적으로 지원하는 렌더러는 [`react-art`](https://github.com/facebook/react/tree/main/packages/react-art)로 유일합니다. [GitHub 저장소](https://github.com/reactjs/react-art)에서 분리되어 있었지만, 현재는 메인 소스 트리로 옮겨졌습니다.

>**주의**
>
>[`react-native-renderer`](https://github.com/facebook/react/tree/main/packages/react-native-renderer)는 React 네이티브 구현체와 상호작용하는 매우 얇은 레이어입니다. 네이티브 뷰를 관리하는 실제 플랫폼 관련 코드는 [React 네이티브 저장소](https://github.com/facebook/react-native)에 존재합니다.

### 재조정자 {#reconcilers}

React DOM과 React 네이티브 같은 매우 다른 경우를 포함하여, 렌더러들은 상당 부분 동작 방식을 서로 공유해야 합니다. 특히 [재조정](/docs/reconciliation.html) 알고리즘의 경우는 더욱 그렇습니다. 이를 통해 렌더링, 사용자 정의 컴포넌트, 상태, 생명주기 메서드, 레퍼런스가 플랫폼에 상관없이 일관적으로 작동해야 합니다.

이를 해결하기 위해 서로 다른 렌더러들은 몇 가지의 코드를 공유하며, 해당 부분을 '재조정자'라고 부릅니다. `setState()`와 같은 함수가 수정되어야 할 때, 재조정자는 트리에 있는 컴포넌트의 `render()` 함수를 호출한 후 마운트나 업데이트, 혹은 마운트해제를 실시합니다.

재조정자는 현재로서는 어떠한 public API도 존재하지 않기 때문에 개별적인 패키지로서 존재하지 않습니다. 대신 React DOM과 React 네이티브 같은 렌더러에 개별적으로 사용됩니다.

### 스택 재조정자 {#stack-reconciler}

'스택' 재조정자는 React 15 이하에서 구현되었습니다. 현재는 더 이상 지원하지 않지만, [다음 섹션](/docs/implementation-notes.html)에서 자세한 사항을 살펴볼 수 있습니다.

### 파이버 재조정자 {#fiber-reconciler}

'파이버' 재조정자는 스택 재조정자에서 발생한 문제를 해결하고 몇 가지 오래된 오류를 고치는 데에 중점을 두기 위해 고안되었습니다. 해당 재조정자는 React 16부터 기본적으로 사용됩니다.

해당 재조정자의 목표는 다음과 같습니다.

* 중단 불가능한 작업을 청크로 분할하는 기능
* 진행 중인 작업의 우선 순위 지정, 재배치 및 재사용에 관한 기능
* React의 레이아웃을 지원하기 위한 계층별 배치 순서 처리 기능
* `render()` 함수로부터의 다중 요소 반환 기능
* 에러 경계에 대한 향상된 지원

React 파이버 구조에 대해 [여기](https://github.com/acdlite/react-fiber-architecture)와 [여기](https://medium.com/react-in-depth/inside-fiber-in-depth-overview-of-the-new-reconciliation-algorithm-in-react-e1c04700ef6e)를 통해 더 자세히 확인할 수 있습니다. 파이버 재조정자는 React 16과 함께 제공되지만, 비동기 기능은 아직 기본적으로 활성화되지 않습니다.

해당 소스 코드는 [`packages/react-reconciler`](https://github.com/facebook/react/tree/main/packages/react-reconciler)에서 확인할 수 있습니다.

### 이벤트 시스템 {#event-system}

React는 네이티브 이벤트 위에 레이어를 구현하여 크로스 브라우저 차이를 제거했습니다. 해당 코드는 [`packages/react-dom/src/events`](https://github.com/facebook/react/tree/main/packages/react-dom/src/events)에서 확인할 수 있습니다.

해당 코드에 대한 상세한 설명은 다음의 [영상](https://www.youtube.com/watch?v=dRo_egw7tBc) (66분)을 참고하세요.

### 다음 내용은? {#what-next}

[다음 섹션](/docs/implementation-notes.html)을 읽고 재조정자에 대한 pre-React 16 구현에 대해 더 자세하게 배워보세요. 새로운 재조정자에 대한 설명은 아직 작성되지 않았습니다.
