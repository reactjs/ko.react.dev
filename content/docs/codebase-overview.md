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

This section will give you an overview of the React codebase organization, its conventions, and the implementation.
이 섹션은 React 코드베이스 구조와 관습 그리고 구현에 대한 개요를 설명하고 있습니다.

If you want to [contribute to React](/docs/how-to-contribute.html) we hope that this guide will help you feel more comfortable making changes.
[React에 기여](/docs/how-to-contribute.html)하는 데에 있어서 이 문서를 통해 수월하게 프로젝트를 수정할 수 있기를 바랍니다.

We don't necessarily recommend any of these conventions in React apps. Many of them exist for historical reasons and might change with time.
React 앱을 개발하는데 있어서 아래와 같은 관습들을 반드시 추천하지는 않습니다. 대부분의 관습들이 이전에 많이 사용 되었으며 차차 수정 될 것입니다.

### External Dependencies {#external-dependencies}
### 외부 의존성{#external-dependencies}

React has almost no external dependencies. Usually, a `require()` points to a file in React's own codebase. However, there are a few relatively rare exceptions.
React는 외부 의존성을 거의 갖지 않습니다. `require()` 함수는 통상적으로 React 내부의 파일을 참조합니다. 하지만 몇 가지의 다음과 같은 예외가 존재합니다.

The [fbjs repository](https://github.com/facebook/fbjs) exists because React shares some small utilities with libraries like [Relay](https://github.com/facebook/relay), and we keep them in sync. We don't depend on equivalent small modules in the Node ecosystem because we want Facebook engineers to be able to make changes to them whenever necessary. None of the utilities inside fbjs are considered to be public API, and they are only intended for use by Facebook projects such as React.
[Replay](https://github.com/facebook/relay)와 같은 라이브러리를 포함하여 몇 가지 유틸리티를 사용하기 위해, React는 [fbjs](https://github.com/facebook/fbjs)에 대한 의존성을 갖고 있으며 동기화하고 있습니다. React는 페이스북 개발자들이 필요할 때마다 수정할 수 있도록 Node와 같이 작은 모듈에 의존적이지 않게 구성했습니다. fbjs의 어떤 유틸리티도 public API로 고려하지 않았으며, 오직 React와 같은 Facebook 프로젝트에서만 사용됩니다.

### Top-Level Folders {#top-level-folders}
### 최상위 폴더 {#top-level-folders}

After cloning the [React repository](https://github.com/facebook/react), you will see a few top-level folders in it:
[React 저장소](https://github.com/facebook/react)를 클론하게 되면, 다음과 같은 몇개의 최상위 폴더를 볼 수 있습니다.

* [`packages`](https://github.com/facebook/react/tree/master/packages) contains metadata (such as `package.json`) and the source code (`src` subdirectory) for all packages in the React repository. **If your change is related to the code, the `src` subdirectory of each package is where you'll spend most of your time.**
* [`fixtures`](https://github.com/facebook/react/tree/master/fixtures) contains a few small React test applications for contributors.
* `build` is the build output of React. It is not in the repository but it will appear in your React clone after you [build it](/docs/how-to-contribute.html#development-workflow) for the first time.

* [`packages`](https://github.com/facebook/react/tree/master/packages) 폴더는 React 저장소에 있는 모든 패키지들에 대해 `package.json`과 같은 메타데이터와 `src` 폴더를 포함하고 있습니다. **코드와 관련된 부분을 수정하고자 한다면, 각 패키지의 `src`폴더에 변경 할 점이 가장 많습니다.
* [`fixtures`](https://github.com/facebook/react/tree/master/fixtures)에는 기여자들을 위한 몇가지의 React 테스트 어플리케이션이 존재합니다.
* `build` 폴더에는 React의 빌드 결과가 생성됩니다. 저장소에는 존재하지 않지만, React를 클론하고 처음 [빌드](/docs/how-to-contribute.html#development-workflow)할 시 생성됩니다.

The documentation is hosted [in a separate repository from React](https://github.com/reactjs/reactjs.org).
설명 문서는 React로부터 [분리된 저장소](https://github.com/reactjs/reactjs.org)에 존재합니다.

There are a few other top-level folders but they are mostly used for the tooling and you likely won't ever encounter them when contributing.
위에서 언급한거와 다른 최상위 폴더가 존재하지만 대부분 기여하는데 있어서 사용되지 않을 것입니다.

### Colocated Tests {#colocated-tests}
### 병치된 테스트 {#colocated-tests}

We don't have a top-level directory for unit tests. Instead, we put them into a directory called `__tests__` relative to the files that they test.
해당 프로젝트에는 유닛 테스트를 위한 상위 디렉토리가 존재하지 않습니다. 대신 소스 코드와 함께 `__tests__`라는 디렉토리 내부에 테스트 코드를 병치했습니다.

For example, a test for [`setInnerHTML.js`](https://github.com/facebook/react/blob/87724bd87506325fcaf2648c70fc1f43411a87be/src/renderers/dom/client/utils/setInnerHTML.js) is located in [`__tests__/setInnerHTML-test.js`](https://github.com/facebook/react/blob/87724bd87506325fcaf2648c70fc1f43411a87be/src/renderers/dom/client/utils/__tests__/setInnerHTML-test.js) right next to it.
예를 들어, [`setInnerHTML.js`](https://github.com/facebook/react/blob/87724bd87506325fcaf2648c70fc1f43411a87be/src/renderers/dom/client/utils/setInnerHTML.js)에 대한 테스트 코드는 [`__tests__/setInnerHTML-test.js`](https://github.com/facebook/react/blob/87724bd87506325fcaf2648c70fc1f43411a87be/src/renderers/dom/client/utils/__tests__/setInnerHTML-test.js)에 존재합니다.

### Warnings and Invariants {#warnings-and-invariants}
### 경고와 불변 {#warnings-and-invariants}

The React codebase uses the `warning` module to display warnings:
React 프로젝트는 경고를 표시하기 위해 다음과 같이 `warning` 모듈을 사용합니다.

```js
var warning = require('warning');

warning(
  2 + 2 === 4,
  'Math is not working today.'
);
```

**The warning is shown when the `warning` condition is `false`.**
**경고는 `warning` 옵션이 `false`로 설정되어 있을 때 표시됩니다.**

One way to think about it is that the condition should reflect the normal situation rather than the exceptional one.
위의 모듈을 사용하는 데에 있어 고려할 점은, 해당 옵션이 예외적인 경우보다 일반적인 상황을 반영해야 한다는 것입니다.

It is a good idea to avoid spamming the console with duplicate warnings:
다음과 같은 코드를 통해 경고가 중복되어 콘솔이 불필요하게 복잡해지는 상황을 피할 수 있습니다.

```js
var warning = require('warning');

var didWarnAboutMath = false;
if (!didWarnAboutMath) {
  warning(
    2 + 2 === 4,
    'Math is not working today.'
  );
  didWarnAboutMath = true;
}
```

Warnings are only enabled in development. In production, they are completely stripped out. If you need to forbid some code path from executing, use `invariant` module instead:
경고는 개발 시에만 표시됩니다. 배포 시에는 경고가 완전히 무시됩니다. 실행 시에 몇 가지 코드를 무시하기 위해서, 다음과 같이 `invariant` 모듈을 활용할 수 있습니다.

```js
var invariant = require('invariant');

invariant(
  2 + 2 === 4,
  'You shall not pass!'
);
```

**The invariant is thrown when the `invariant` condition is `false`.**
**`invariant` 옵션이 `false`로 설정되어 있을 때 불변이 발생합니다.**

"Invariant" is just a way of saying "this condition always holds true". You can think about it as making an assertion.
'불변'은 '해당 조건이 항상 참일 경우'를 의미합니다. 코드의 동작을 확실하게 하기 위한 요소라고 생각할 수 있습니다.

It is important to keep development and production behavior similar, so `invariant` throws both in development and in production. The error messages are automatically replaced with error codes in production to avoid negatively affecting the byte size.
개발과 배포 시의 프로그램 동작을 유사하게 만들어서 `invariant` 모듈이 동시에 발생하도록 하는 것이 중요합니다. 에러 메세지는 배포 시에 자동으로 에러 코드로 변경되어 바이트 크기에 부정적인 영항을 미치는 것을 방지합니다.

### Development and Production {#development-and-production}
### 개발과 배포 {#development-and-production}

You can use `__DEV__` pseudo-global variable in the codebase to guard development-only blocks of code.
의사 전역 변수 `__DEV__`를 사용하여 개발시에만 작동하는 코드를 보호할 수 있습니다.

It is inlined during the compile step, and turns into `process.env.NODE_ENV !== 'production'` checks in the CommonJS builds.
해당 변수는 컴파일 단계에서 한번에 처리되며, CommonJS 빌드 시에 `process.env.NODE_ENV !== 'production'`로 변환됩니다.

For standalone builds, it becomes `true` in the unminified build, and gets completely stripped out with the `if` blocks it guards in the minified build.
스탠드얼론 빌드의 경우, 해당 변수는 unminified 빌드에서 `true`로 취급되며 minified 빌드에서는 `if` 블록을 포함하여 전부 제거됩니다. 

```js
if (__DEV__) {
  // This code will only run in development.
}
```

### Flow {#flow}
### 플로우 {#flow}

We recently started introducing [Flow](https://flow.org/) checks to the codebase. Files marked with the `@flow` annotation in the license header comment are being typechecked.
React는 최근 [Flow](https://flow.org/) 검사를 사용하기 시작했습니다. 라이센스 내용을 포함한 주석에 `@flow` 표시가 포함된 파일은 자료형 검사를 받게 됩니다.

We accept pull requests [adding Flow annotations to existing code](https://github.com/facebook/react/pull/7600/files). Flow annotations look like this:
해당 프로젝트는 [이미 존재하는 코드에 대한 Flow 표시 추가](https://github.com/facebook/react/pull/7600/files)에 대한 풀 리퀘스트를 허용하고 있습니다. Flow 표시는 다음과 같이 구성되어 있습니다.

```js
ReactRef.detachRefs = function(
  instance: ReactInstance,
  element: ReactElement | string | number | null | false,
): void {
  // ...
}
```

When possible, new code should use Flow annotations.
You can run `yarn flow` locally to check your code with Flow.

가능하면 새로 작성하는 코드에 Flow 표시를 포함해 주십시오.
`yarn flow` 명령어를 통해 개인적으로 Flow에 대한 코드 검사를 수행할 수 있습니다.

### Dynamic Injection {#dynamic-injection}
### 동적 참조 {#dynamic-injection}

React uses dynamic injection in some modules. While it is always explicit, it is still unfortunate because it hinders understanding of the code. The main reason it exists is because React originally only supported DOM as a target. React Native started as a React fork. We had to add dynamic injection to let React Native override some behaviors.
React는 몇 가지 모듈에서 동적 참조를 사용합니다. 동적 참조는 항상 명시적임에도 불구하고 코드에 대한 이해를 방해하는 요소입니다. 동적 참조가 존재하는 주된 이유는 React가 근본적으로 돔을 대상으로만 지원하기 때문입니다. React 는 React의 복사본에서 시작되었기 때문에 몇 가지 동작을 수행하기 위해 동적 참조를 필요로 했습니다.

You may see modules declaring their dynamic dependencies like this:
다음과 같은 동적 의존성을 가진 모듈들을 확인할 수 있습니다.

```js
// Dynamically injected
var textComponentClass = null;

// Relies on dynamically injected value
function createInstanceForText(text) {
  return new textComponentClass(text);
}

var ReactHostComponent = {
  createInstanceForText,

  // Provides an opportunity for dynamic injection
  injection: {
    injectTextComponentClass: function(componentClass) {
      textComponentClass = componentClass;
    },
  },
};

module.exports = ReactHostComponent;
```

The `injection` field is not handled specially in any way. But by convention, it means that this module wants to have some (presumably platform-specific) dependencies injected into it at runtime.
`injection` 필드는 특별하게 처리되지는 않습니다. 다만 관습적으로 해당 필드는 런타임 시에 (플랫폼 관련 요소와 같은) 몇 가지 종속성을 참조하고자 함을 의미합니다.

There are multiple injection points in the codebase. In the future, we intend to get rid of the dynamic injection mechanism and wire up all the pieces statically during the build.
해당 코드베이스에는 다수의 동적 참조 부분이 존재합니다. React는 향후 동적 참조에 관련된 매커니즘을 제거하고, 빌드 시에 정적으로 병합하는 방식을 사용할 것입니다.

### Multiple Packages {#multiple-packages}
### 다양한 패키지 {#multiple-packages}

React is a [monorepo](https://danluu.com/monorepo/). Its repository contains multiple separate packages so that their changes can be coordinated together, and issues live in one place.
React는 [monorepo](https://danluu.com/monorepo/)입니다. 해당 저장소는 복수의 분리된 패키지를 포함하고 있으며, 각각의 수정은 함께 반영되고 한 곳에서 이슈를 교환합니다.

### React Core {#react-core}
### React 코어 {#react-core}

The "core" of React includes all the [top-level `React` APIs](/docs/top-level-api.html#react), for example:
React의 '코어'는 모든 [최상위 `React` API](/docs/top-level-api.html#react)를 포함합니다. 예를 들면 다음과 같습니다.

* `React.createElement()`
* `React.Component`
* `React.Children`

**React core only includes the APIs necessary to define components.** It does not include the [reconciliation](/docs/reconciliation.html) algorithm or any platform-specific code. It is used both by React DOM and React Native components.
**React 코어는 컴포넌트를 정의하는 데에 필요한 API만 포함하고 있습니다.** React 코어는 [재조정](/docs/reconciliation.html) 알고리즘과 플랫폼 특화된 코드를 포함하고 있지 않습니다. 해당 코어는 React 돔과 React 네이티브의 컴포넌트에서 동시에 사용됩니다.

The code for React core is located in [`packages/react`](https://github.com/facebook/react/tree/master/packages/react) in the source tree. It is available on npm as the [`react`](https://www.npmjs.com/package/react) package. The corresponding standalone browser build is called `react.js`, and it exports a global called `React`.
React 코어의 소스 코드는 [`packages/react`](https://github.com/facebook/react/tree/master/packages/react)에 위치하고 있습니다. 해당 코드는 npm에서 [`react`](https://www.npmjs.com/package/react) 패키지를 통해 받을 수 있습니다. 관련된 스탠드얼론 브라우저 빌드는 `react.js`로 부르며, 전역에서 `React` 키워드를 통해 접근할 수 있습니다.

### Renderers {#renderers}
### 렌더러 {#renderers}

React was originally created for the DOM but it was later adapted to also support native platforms with [React Native](https://facebook.github.io/react-native/). This introduced the concept of "renderers" to React internals.
React는 원래 돔을 위해 만들어졌지만 이후 [React 네이티브](https://facebook.github.io/react-native/)를 통해 네이티브 플랫폼 또한 지원하게 되었습니다. 본 문단은 React 내부의 '렌더러'에 대해서 간략히 소개합니다.

**Renderers manage how a React tree turns into the underlying platform calls.**
**렌더러는 React 트리가 어떻게 플랫폼에 종속적으로 변환되어야 하는지를 관리합니다.**

Renderers are also located in [`packages/`](https://github.com/facebook/react/tree/master/packages/):
렌더러는 [`packages/`](https://github.com/facebook/react/tree/master/packages/)에 위치하며 다음과 같이 존재합니다.

* [React DOM Renderer](https://github.com/facebook/react/tree/master/packages/react-dom) renders React components to the DOM. It implements [top-level `ReactDOM` APIs](/docs/react-dom.html) and is available as [`react-dom`](https://www.npmjs.com/package/react-dom) npm package. It can also be used as standalone browser bundle called `react-dom.js` that exports a `ReactDOM` global.
* [React Native Renderer](https://github.com/facebook/react/tree/master/packages/react-native-renderer) renders React components to native views. It is used internally by React Native.
* [React Test Renderer](https://github.com/facebook/react/tree/master/packages/react-test-renderer) renders React components to JSON trees. It is used by the [Snapshot Testing](https://facebook.github.io/jest/blog/2016/07/27/jest-14.html) feature of [Jest](https://facebook.github.io/jest) and is available as [react-test-renderer](https://www.npmjs.com/package/react-test-renderer) npm package.

* [React DOM Renderer](https://github.com/facebook/react/tree/master/packages/react-dom)는 React 컴포넌트를 돔으로 렌더링합니다. 해당 구현은 [최상위 레벨 `ReactDOM` API](/docs/react-dom.html)에 존재하며 npm의 [`react-dom`](https://www.npmjs.com/package/react-dom) 패키지로 받을 수 있습니다. 또한 스탠드얼론 브라우저에서 `react-dom.js`를 통해 전역 `ReactDOM` 키워드로 접근할 수 있습니다.
* [React Native Renderer](https://github.com/facebook/react/tree/master/packages/react-native-renderer)는 React 컴포넌트를 네이티브 뷰로 렌더링합니다. 해당 렌더러는 React 네이티브에서 내부적으로 사용됩니다.
* [React Test Renderer](https://github.com/facebook/react/tree/master/packages/react-test-renderer)는 React 컴포넌트를 JSON 형식의 트리로 렌더링합니다. 해당 렌더러는 [Jest](https://facebook.github.io/jest)의 [Snapshot Testing](https://facebook.github.io/jest/blog/2016/07/27/jest-14.html)로 사용되며, npm [react-test-renderer](https://www.npmjs.com/package/react-test-renderer) 패키지로 받을 수 있습니다.

The only other officially supported renderer is [`react-art`](https://github.com/facebook/react/tree/master/packages/react-art). It used to be in a separate [GitHub repository](https://github.com/reactjs/react-art) but we moved it into the main source tree for now.
공식적으로 지원하는 별도의 렌더러는 유일하게 [`react-art`](https://github.com/facebook/react/tree/master/packages/react-art)입니다. [GitHub 저장소](https://github.com/reactjs/react-art)에서 분리되어 있었지만, 현재는 메인 소스 트리에 옮겼습니다.

>**Note:**
>
>Technically the [`react-native-renderer`](https://github.com/facebook/react/tree/master/packages/react-native-renderer) is a very thin layer that teaches React to interact with React Native implementation. The real platform-specific code managing the native views lives in the [React Native repository](https://github.com/facebook/react-native) together with its components.
>**참조:**
>
>기술적으로 [`react-native-renderer`](https://github.com/facebook/react/tree/master/packages/react-native-renderer)는 React 네이티브 구현과의 상호작용을 위한 매우 얇은 레이어입니다. 네이티브 뷰를 위한 실제 플랫폼 관련 코드는 [React 네이티브 저장소](https://github.com/facebook/react-native)에 컴포넌트와 함께 존재합니다.

### Reconcilers {#reconcilers}
### 재조정자 {#reconcilers}

Even vastly different renderers like React DOM and React Native need to share a lot of logic. In particular, the [reconciliation](/docs/reconciliation.html) algorithm should be as similar as possible so that declarative rendering, custom components, state, lifecycle methods, and refs work consistently across platforms.
심지어 React 돔과 React 네이티와 같은 대단히 상이한 렌더러들도 많은 부분에 있어서 로직을 공유해야 합니다. 특히 [재조정](/docs/reconciliation.html) 알고리즘은 가능한 한 비슷해야 합니다. 이를 통해 렌더링, 사용자 정의 컴포넌트, 상태, 생명주기 메소드, 레퍼런스가 플랫폼에 상관없이 일관적으로 작동해야 합니다.

To solve this, different renderers share some code between them. We call this part of React a "reconciler". When an update such as `setState()` is scheduled, the reconciler calls `render()` on components in the tree and mounts, updates, or unmounts them.
이를 해결하기 위해 서로 다른 렌더러들은 몇 가지의 코드를 공유하며, 이를 '재조정자'라고 부릅니다. `setState()`와 같은 함수가 수정되어야 할 때, 재조정자는 트리에 있는 컴포넌트의 `render()`함수를 호출하고 마운트하며 업데이트하거나 마운트를 해제합니다.

Reconcilers are not packaged separately because they currently have no public API. Instead, they are exclusively used by renderers such as React DOM and React Native.
재조정자는 현재로서는 어떠한 public API도 존재하지 않기 때문에 개별적인 패키지로 존재하지 않습니다. 대신 React 돔과 React 네이티브와 같은 렌더러에 개별적으로 사용됩니다.

### Stack Reconciler {#stack-reconciler}
### 스택 재조정자 {#stack-reconciler}

The "stack" reconciler is the implementation powering React 15 and earlier. We have since stopped using it, but it is documented in detail in the [next section](/docs/implementation-notes.html).
'스택' 재조정자는 React 15 이하 버전에서 구현되었습니다. 현재에는 이를 사용하지 않지만, [다음 섹션](/docs/implementation-notes.html)에서 자세한 사항이 기록되어 있습니다.

### Fiber Reconciler {#fiber-reconciler}
### Fiber 재조정자 {#fiber-reconciler}

The "fiber" reconciler is a new effort aiming to resolve the problems inherent in the stack reconciler and fix a few long-standing issues. It has been the default reconciler since React 16.
'fiber' 재조정자는 스택 재조정자에서의 상속에 대한 문제를 해결하고 오래된 몇 가지의 오류를 고치는 데에 중점을 둔 새로운 결과입니다. 해당 재조정자는 React 16 버전부터 기본적으로 사용되기 시작했습니다.

Its main goals are:
해당 재조정자의 목표는 다음과 같습니다.

* Ability to split interruptible work in chunks.
* Ability to prioritize, rebase and reuse work in progress.
* Ability to yield back and forth between parents and children to support layout in React.
* Ability to return multiple elements from `render()`.
* Better support for error boundaries.
* 중단 불가능한 작업을 청크로 분할하는 기능.
* 진행 중인 작업의 우선 순위 지정, 재배치 및 재사용 기능
* React의 레이아웃을 지원하기 위해 부모와 자식 간에 양보를 할 수 있는 기능
* `render()`로 부터의 다중 요소 반환 기능
* 오류 경계에 대한 지원 강화.

You can read more about React Fiber Architecture [here](https://github.com/acdlite/react-fiber-architecture) and [here](https://medium.com/react-in-depth/inside-fiber-in-depth-overview-of-the-new-reconciliation-algorithm-in-react-e1c04700ef6e). While it has shipped with React 16, the async features are not enabled by default yet.
React Fiber 구조에 대해 [여기](https://github.com/acdlite/react-fiber-architecture)와 [여기](https://medium.com/react-in-depth/inside-fiber-in-depth-overview-of-the-new-reconciliation-algorithm-in-react-e1c04700ef6e)를 통해 더 자세히 확인할 수 있습니다. React 16과 함께 제공되는 한편, 비동기 기능은 아직 기본적으로 활성화되지 않습니다.

Its source code is located in [`packages/react-reconciler`](https://github.com/facebook/react/tree/master/packages/react-reconciler).
해당 소스코드는 [`packages/react-reconciler`](https://github.com/facebook/react/tree/master/packages/react-reconciler)에 위치하고 있습니다.

### Event System {#event-system}
### 이벤트 시스템 {#event-system}

React implements a synthetic event system which is agnostic of the renderers and works both with React DOM and React Native. Its source code is located in [`packages/events`](https://github.com/facebook/react/tree/master/packages/events).
React에는 렌더러 비종속적인 복합 이벤트 시스템이 구현되어 있으며 React 돔과 React 네이티브에서 동시에 작동합니다. 해당 코드는 [`packages/events`](https://github.com/facebook/react/tree/master/packages/events)에 존재합니다.

There is a [video with a deep code dive into it](https://www.youtube.com/watch?v=dRo_egw7tBc) (66 mins).
해당 코드를 사용하는 [영상](https://www.youtube.com/watch?v=dRo_egw7tBc)(66분)을 참고하십시오.

### What Next? {#what-next}
### 다음 읽을거리는? {#what-next}

Read the [next section](/docs/implementation-notes.html) to learn about the pre-React 16 implementation of reconciler in more detail. We haven't documented the internals of the new reconciler yet.
[다음 섹션](/docs/implementation-notes.html)을 읽고 재조정자에 대한 pre-React 16 구현에 대해 더 자세하게 배워보세요. 새로운 재조정자에 대한 내부적인 설명은 아직 작성되지 않았습니다.
