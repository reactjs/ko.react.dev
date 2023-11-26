---
title: "React 18로 업그레이드하는 방법"
---

2022년 3월 8일, [Rick Hanlon](https://twitter.com/rickhanlonii)

---

<Intro>

React 18은 [릴리스 노트](/blog/2022/03/29/react-v18)에서 언급한 대로 새로운 동시성 렌더러를 도입하여 기존 애플리케이션에 점진적으로 적용할 계획입니다. 이 글에서는 React 18로 업그레이드하는 방법을 단계별로 소개하겠습니다.

React 18로 업그레이드하는 과정에서 발생하는 [문제를 알려주세요](https://github.com/facebook/react/issues/new/choose).

</Intro>

<Note>

React Native 사용자의 경우, React 18은 React Native의 향후 버전에 탑재될 것입니다. 이는 새로운 기능을 활용하기 위해 React 18이 이 글에서 소개되는 새로운 React Native 아키텍처에 의존하기 때문입니다. 자세한 정보는 [React Conf 키노트](https://www.youtube.com/watch?v=FZ0cG47msEk&t=1530s)를 확인해주세요.

</Note>

---

## 설치 {/*installing*/}

최신 버전의 React를 설치하기 위해 다음 명령어를 입력하세요.

```bash
npm install react react-dom
```

혹은 yarn을 사용한다면 다음 명령어를 입력하세요.

```bash
yarn add react react-dom
```

## 클라이언트 렌더링 API 관련 업데이트 {/*updates-to-client-rendering-apis*/}

React 18을 처음 설치하면 콘솔 창에 다음과 같은 경고 메시지가 표시될 것입니다.

<ConsoleBlock level="error">

ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot

</ConsoleBlock>

React 18은 사용자들이 더 편리하게 root 요소들을 관리할 수 있는 최신 root API를 도입합니다. 이에 더불어 최신 root API는 새로운 동시성 렌더러를 동작시켜 동시성 기능을 사용할 수 있게 합니다.

```js
// 변경 전
import { render } from 'react-dom';
const container = document.getElementById('app');
render(<App tab="home" />, container);

// 변경 후
import { createRoot } from 'react-dom/client';
const container = document.getElementById('app');
const root = createRoot(container); // 만약 TypeScript를 사용한다면 createRoot(container!)
root.render(<App tab="home" />);
```

`unmountComponentAtNode`는 `root.unmount`로 변경되었습니다.

```js
// 변경 전
unmountComponentAtNode(container);

// 변경 후
root.unmount();
```

또한 Suspense를 사용할 때 일반적으로 기대한 결과가 나오지 않기 때문에 콜백 함수를 렌더링 메서드에서 제거했습니다.

```js
// 변경 전
const container = document.getElementById('app');
render(<App tab="home" />, container, () => {
  console.log('rendered');
});

// 변경 후
function AppWithCallbackAfterRender() {
  useEffect(() => {
    console.log('rendered');
  });

  return <App tab="home" />
}

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<AppWithCallbackAfterRender />);
```

<Note>

구형 렌더링 콜백 API에 정확히 대응하는 대안은 없으며, 사용자의 사용 방식에 따라 다를 수 있습니다. 자세한 정보는 현재 진행 중인 그룹 포스트인 [Replacing render with createRoot](https://github.com/reactwg/react-18/discussions/5)를 확인할 수 있습니다.

</Note>

마지막으로, hydration으로 서버 측 렌더링(SSR)을 이용할 경우에는 `hydrate`를 `hydrateRoot`로 업그레이드하세요.

```js
// 변경 전
import { hydrate } from 'react-dom';
const container = document.getElementById('app');
hydrate(<App tab="home" />, container);

// 변경 후
import { hydrateRoot } from 'react-dom/client';
const container = document.getElementById('app');
const root = hydrateRoot(container, <App tab="home" />);
// createRoot와는 달리, root.render()를 별도로 호출할 필요가 없습니다.
```

자세한 정보는 [진행 중인 디스커션](https://github.com/reactwg/react-18/discussions/5)을 확인할 수 있습니다.

<Note>

**업그레이드 이후에도 앱이 작동하지 않는다면 `<StrictMode>`로 감싸여 있지 않은지 확인해 보세요.** [React 18에서는 Strict 모드가 더 엄격해져서](#updates-to-strict-mode), 모든 컴포넌트가 개발 모드의 추가된 검사 항목을 만족시키지 못할 수 있습니다. Strict 모드를 제거함으로써 문제를 해결할 수 있다면, 업그레이드 중에 제거한 다음, 통합 개발 환경이나 코드 편집기가 표시하는 오류들을 해결된 후에 다시 추가할 수 있습니다 (트리의 상단 또는 일부분에).

</Note>

## Updates to Server Rendering APIs {/*updates-to-server-rendering-apis*/}

이번 배포에서는 서버와 스트리밍 SSR에서 Suspense를 최대한 지원하기 위해 `react-dom/server` API를 개편했습니다. 이 개편을 통해, 서버에서 점진적인 Suspense 스트리밍을 지원하지 않는 구형 Node 스트리밍 API를 더 이상 사용하지 않게 되었습니다.

이 API를 사용하면 다음과 같은 경고가 표시됩니다.

* `renderToNodeStream`: **더 이상 사용되지 않음 ⛔️️**

대신에 Node 환경에서 스트리밍하려면 다음 API를 사용하세요.
* `renderToPipeableStream`: **새로 추가됨 ✨**

더불어 Deno나 Cloudflare workers와 같은 최신 런타임 환경에서 Suspense를 활용하여 스트리밍 SSR를 지원하기 위해 새로운 API를 도입합니다.
* `renderToReadableStream`: **새로 추가됨 ✨**

다음 API들은 계속 작동되긴 하지만, Suspense 지원이 제한될 것입니다.
* `renderToString`: **제한됨** ⚠️
* `renderToStaticMarkup`: **제한됨** ⚠️

마지막으로, 이 API는 앞으로도 이메일을 렌더링할 예정입니다.
* `renderToStaticNodeStream`

서버 렌더링 API 변경 사항과 관련된 자세한 정보는 작업 중인 그룹 포스트 [Upgrading to React 18 on the server](https://github.com/reactwg/react-18/discussions/22), [deep dive on the new Suspense SSR Architecture](https://github.com/reactwg/react-18/discussions/37), 그리고 React Conf 2021에서 [Shaundai Person](https://twitter.com/shaundai)이 발표한 [Streaming Server Rendering with Suspense](https://www.youtube.com/watch?v=pj5N-Khihgc)에서 확인할 수 있습니다.

## TypeScript 사용 시 타입 작성에 대한 업데이트 {/*updates-to-typescript-definitions*/}

프로젝트에 TypeScript를 사용하고 있다면, `@types/react`와 `@types/react-dom` 의존성을 최신 버전으로 업데이트해야 합니다. 새로운 타입들을 사용하면 더 안전하게 작업할 수 있으며, 기존의 타입 체커가 감지하지 못했던 이슈들을 찾아낼 수 있습니다. 가장 눈에 띄는 변화는 `children` 프로퍼티를 명확한 리스트로 정의해야 한다는 것입니다. 아래의 예시를 확인해보세요.

```typescript{3}
interface MyButtonProps {
  color: string;
  children?: React.ReactNode;
}
```

[React 18 typings pull request](https://github.com/DefinitelyTyped/DefinitelyTyped/pull/56210)에서 타입 변경 내용을 전체적으로 확인할 수 있습니다. 이 링크는 라이브러리 타입 수정 내용을 담고 있어 코드를 어떻게 수정해야 하는지 확인할 수 있습니다. [automated migration script](https://github.com/eps1lon/types-react-codemod)를 사용하여 애플리케이션 코드에 최신이고 더 안전한 타입을 빠르게 적용할 수 있습니다.

타이핑에 버그를 발견하면 DefinitelyTyped 저장소에 [이슈를 제기해 주세요](https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/new?category=issues-with-a-types-package).

## 자동 Batching {/*automatic-batching*/}


React 18은 자동으로 더 많은 batching을 수행하여 놀라운 성능 향상을 이뤘습니다. Batching이란 더 나은 성능을 위해 여러 개의 상태 업데이트를 단 한 번의 리렌더링으로 처리하는 것을 말합니다. React 18 이전에는 React 이벤트 핸들러 내에서의 상태 업데이트만 batching을 수행해 왔습니다. 그러나 프로미스, setTimeout, 네이티브 이벤트 핸들러 또는 다른 이벤트들은 React에서 기본적으로 batching을 수행하지 않았죠. 다음 예시를 확인하세요.

```js
// React 18 이전에는 오직 React 이벤트들만 batch되었습니다.

function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React는 마지막에 단 한 번만 리렌더링합니다. (그게 batching이죠!)
}

setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React는 각 상태 업데이트마다 한 번씩, 총 두 번 렌더링합니다. (batching 없음)
}, 1000);
```


React 18를 시작으로 `createRoot`를 사용하여 모든 업데이트가 자동으로 배치될 것입니다. 이는 timeout, 프로미스, 네이티브 이벤트 핸들러 또는 다른 이벤트 내의 업데이트도 React 이벤트 내의 업데이트와 같이 batch 될 것임을 의미합니다.
```js
// React 18 이후로 timeout, 프로미스,
// 네이티브 이벤트 핸들러 또는 다른 이벤트 내의 업데이트도 batch 됩니다.

function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React는 마지막에 단 한 번만 리렌더링합니다. (그게 batching이죠!)
}

setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React는 마지막에 단 한 번만 리렌더링합니다. (그게 batching이죠!)
}, 1000);
```

이는 엄청난 변화이지만, 이를 통해 렌더링 작업에 수고를 줄일 수 있고, 애플리케이션의 성능도 향상될 것으로 예상합니다. 자동 batching을 원하지 않는 경우, `flushSync`를 사용할 수도 있습니다.

```js
import { flushSync } from 'react-dom';

function handleClick() {
  flushSync(() => {
    setCounter(c => c + 1);
  });
  // 이 시점에서 React는 DOM을 업데이트합니다.
  flushSync(() => {
    setFlag(f => !f);
  });
  // 이 시점에서 React는 DOM을 업데이트합니다.
}
```

자세한 정보는 [Automatic batching deep dive](https://github.com/reactwg/react-18/discussions/21)에서 확인할 수 있습니다.

## 라이브러리를 위한 새로운 API {/*new-apis-for-libraries*/}

React 18 워킹 그룹은 스타일이나 외부 저장 장치와 같은 특정 목적을 위한 동시성 렌더링을 지원하기 위해 라이브러리 관리자들과 협력하여 새로운 API를 개발했습니다. React 18을 지원하기 위해서는 일부 라이브러리들은 다음 API 중 하나로 변경해야 할 수도 있습니다.

* `useSyncExternalStore`는 외부 저장 장치의 업데이트를 실시간으로 반영하여 외부 저장 장치가 동시성 불러오기를 지원할 수 있도록 하는 새로운 hook입니다. 이 API는 React 외부의 상태를 포함하는 라이브러리에서 사용하는 것을 추천합니다. 자세한 정보는 [useSyncExternalStore overview post](https://github.com/reactwg/react-18/discussions/70)와 [useSyncExternalStore API details](https://github.com/reactwg/react-18/discussions/86)에서 확인할 수 있습니다.

* `useInsertionEffect`는 CSS-in-JS 라이브러리가 렌더링 시 스타일 주입과 같은 성능 이슈를 개선하는 새로운 hook입니다. 이미 CSS-in-JS 라이브러리를 만든 경우가 아니라면 이 hook을 사용할 필요는 없을 것입니다. 이 hook은 DOM이 변경된 후 실행되지만, 레이아웃 effect가 새로운 레이아웃을 읽어 들이기 전에 실행됩니다. 자세한 정보는 [Library Upgrade Guide for `<style>`](https://github.com/reactwg/react-18/discussions/110)에서 확인할 수 있습니다.

또, React 18은 동시성 렌더링을 위해 startTransition, useDeferredValue, 그리고 useId와 같은 새로운 API를 도입합니다. 더 자세한 내용은 [release post](/blog/2022/03/29/react-v18)에서 확인할 수 있습니다.

## Strict 모드 업데이트 {/*updates-to-strict-mode*/}

차후에는 React에 새로운 기능을 추가하여 UI의 섹션을 추가하거나 제거할 수 있게 할 계획입니다. 예를 들면, 사용자가 뒤로 가기를 누르면 React가 즉시 이전 화면을 보여줄 수 있도록 하는 거죠. 이를 위해 React는 이전과 동일한 컴포넌트 상태를 사용하여 트리를 마운트 해제하고 다시 마운트할 것입니다.

이 기능은 React의 성능을 대폭 향상할 것이지만, 컴포넌트들이 effect들이 여러 번 마운트되었다가 사라지는 것에 아무런 영향을 받지 않아야 합니다. 대부분의 effect들은 변함없이 계속 작동하겠지만, 어떤 것들은 단 한 번만 마운트되고 사라질 수 있도록 설계되어 있습니다.

React 18은 이러한 문제를 시각적으로 보여주기 위해 Strict 모드에 개발 전용 검사를 새롭게 도입합니다. 이 검사는 컴포넌트가 처음 마운트될 때 자동으로 언마운트한 다음, 이전 상태를 복원하면서 다시 마운트할 것입니다.

이 업데이트 이전에는 React가 다음과 같이 컴포넌트를 마운트하고 effect를 생성했습니다.

```
* React가 컴포넌트를 마운트합니다.
    * 레이아웃 effect가 생성됩니다.
    * 이펙트 effect가 생성됩니다.
```

React 18의 Strict 모드에서는 개발 전용 모드에서 React가 컴포넌트를 마운트 해제하고 다시 마운트하는 것을 실험합니다.

```
* React가 컴포넌트를 마운트합니다.
    * 레이아웃 effect가 생성됩니다.
    * 이펙트 effect가 생성됩니다.
* React가 컴포넌트를 마운트 해제하는 것을 시뮬레이션합니다.
    * 레이아웃 effect가 사라집니다.
    * Effect가 사라집니다.
* React는 컴포넌트를 이전 상태로 다시 마운트하는 것을 시뮬레이션합니다.
    * 레이아웃 effect 셋업 코드가 실행됩니다.
    * Effect 셋업 코드가 실행됩니다.
```

자세한 정보는 워킹 그룹 포스트인 [Adding Reusable State to StrictMode](https://github.com/reactwg/react-18/discussions/19)와 [How to support Reusable State in Effects](https://github.com/reactwg/react-18/discussions/18)에서 확인할 수 있습니다.

## 테스트 환경 구축하기 {/*configuring-your-testing-environment*/}

`createRoot`를 사용하기 위해 처음으로 테스트들을 업데이트하면 테스트 콘솔 창에서 다음과 같은 경고 메시지가 표시될 수 있습니다.

<ConsoleBlock level="error">

The current testing environment is not configured to support act(...)

</ConsoleBlock>

이를 해결하려면 테스트를 실행하기 전에 `globalThis.IS_REACT_ACT_ENVIRONMENT`값을 `true`로 설정하세요.

```js
// 테스트 셋업 파일
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
```

이 변수는 React에 유닛 테스트와 유사한 환경에서 실행 중임을 알리기 위함입니다. 업데이트된 사항을 `act`로 감싸지 않으면 React가 유용한 경고 메시지들을 표시합니다.

React에 `act`가 필요 없다고 알리려면 해당 변수를 `false`로 설정할 수 있습니다. 이렇게 하면 전체 브라우저 환경을 시뮬레이션하는 종단 간 테스트에 유용하게 사용할 수 있습니다.

결국에는 테스트 라이브러리가 이를 자동으로 설정해줄 것으로 예상합니다. 예를 들어, [React Testing Library의 다음 버전은 추가적인 설정 없이도 React 18을 지원하는 기능이 내장되어 있습니다](https://github.com/testing-library/react-testing-library/issues/509#issuecomment-917989936).

[`act` 테스트 API와 유관 변경 사항에 대한 추가 정보](https://github.com/reactwg/react-18/discussions/102)는 워킹 그룹에서 확인할 수 있습니다.

## Internet Explorer 지원 중단 {/*dropping-support-for-internet-explorer*/}

이번 배포에서 React는 [2022년 6월 15일에 지원이 종료되는](https://blogs.windows.com/windowsexperience/2021/05/19/the-future-of-internet-explorer-on-windows-10-is-in-microsoft-edge) Internet Explorer의 지원을 중단합니다.
이러한 변경 사항을 적용하는 이유는 React 18에서 도입된 새로운 기능들이 IE에서 적절하게 폴리필 할 수 없는 마이크로 태스크와 같은 모던 브라우저 기능을 사용하기 때문입니다.

Internet Explorer를 지원해야 하는 경우 React 17을 사용하는 것을 권장합니다.

## 더 이상 사용되지 않는 것들 {/*deprecations*/}

* `react-dom`: `ReactDOM.render`가 더 이상 사용되지 않습니다. 사용하면 경고가 표시되고 앱이 React 17 모드로 실행됩니다.
* `react-dom`: `ReactDOM.hydrate`가 더 이상 사용되지 않습니다. 사용하면 경고가 표시되고 앱이 React 17 모드로 실행됩니다.
* `react-dom`: `ReactDOM.unmountComponentAtNode`가 더 이상 사용되지 않습니다.
* `react-dom`: `ReactDOM.renderSubtreeIntoContainer`가 더 이상 사용되지 않습니다.
* `react-dom/server`: `ReactDOMServer.renderToNodeStream`이 더 이상 사용되지 않습니다.

## 이 밖의 획기적인 변화 {/*other-breaking-changes*/}

* **일관된 useEffect 타이밍**: click이나 keydown 이벤트와 같은 개별적인 사용자 입력 이벤트 중에 업데이트가 트리거된 경우 React는 항상 동기적으로 이펙트 함수를 플러시합니다. 이전에는 동작이 언제나 예측 가능하거나 일관적이지 않았습니다.
* **Hydration 오류 강화**: 텍스트 콘텐츠가 누락되거나 추가되어 Hydration 불일치가 발생하는 경우 이제 경고가 아닌 오류로 처리됩니다. React는 더 이상 서버 마크업과 일치시키기 위해 클라이언트에서 노드를 삽입하거나 삭제하여 개별 노드를 "패치 업" 하려고 시도하지 않으며, 트리에서 가장 가까운 `<Suspense>` 바운더리까지 클라이언트 렌더링으로 되돌립니다. 이렇게 하면 Hydration 트리의 일관성을 유지하고 Hydration 불일치로 인해 발생할 수 있는 잠재적인 개인정보 보호 및 보안 허점을 방지할 수 있습니다.
* **항상 일관성을 유지하는 Suspense 트리**: 컴포넌트가 트리에 완전히 추가되기 전에 일시 중단되면 React는 불완전한 상태로 트리에 추가하거나 그 이펙트를 실행하지 않습니다. 대신 React는 새 트리를 완전히 버리고 비동기 작업이 완료될 때까지 기다린 다음 처음부터 다시 렌더링을 시도합니다. React는 브라우저를 블로킹하지 않고 다시 시도해 동시에 렌더링합니다.
* **Suspense가 있는 레이아웃 효과**: 트리가 다시 일시 중단되고 fallback으로 되돌아갈 때, React는 레이아웃 효과를 정리(clean-up)한 후 경계 안의 콘텐츠가 다시 표시될 때 레이아웃 효과를 다시 생성합니다. 이는 Suspense와 함께 사용할 때 컴포넌트 라이브러리가 레이아웃을 올바르게 측정하지 못하던 문제를 해결합니다.
* **새로운 JS 환경 요구 사항**: React는 이제 `Promise`, `Symbol`, `Object.assign`을 포함한 최신 브라우저 기능에 의존합니다. 최신 브라우저 기능을 기본적으로 제공하지 않거나 호환되지 않는 구현이 있는 Internet Explorer와 같은 구형 브라우저 및 기기를 지원하는 경우 번들된 애플리케이션에 전역 폴리필을 포함하는 것을 고려하세요.

## 이 밖의 주목할 만한 변화 {/*other-notable-changes*/}

### React {/*react*/}

* **이제 컴포넌트들이 `undefined`를 렌더링할 수 있습니다.** React는 더 이상 컴포넌트에서 `undefined`를 반환할 때 경고하지 않습니다. 이렇게 함으로써 컴포넌트는 컴포넌트 트리의 중간에 허용된 값과 일관된 값을 반환하게 됩니다. JSX 앞에 `return` 문을 빼먹는 실수와 같은 문제를 방지하기 위해 린터를 사용하는 것을 권장합니다.
* **테스트에서 `act` 경고는 이제 선택 사항입니다.** 종단 간 테스트를 실행하는 경우 `act` 경고 메시지는 불필요합니다. 이 경고 메시지가 쓸모 있는 [유닛 테스트에서만 활성화할 수 있도록](https://github.com/reactwg/react-18/discussions/102) 만들었습니다.
* **이제 마운트가 해제된 컴포넌트에서 `setState` 관련 경고가 나타나지 않습니다.** 이전에는 `setState`를 마운트가 해제된 컴포넌트에서 호출할 때 메모리 누수에 대한 경고가 표시되었습니다. 이 경고는 구독을 위해 추가되었지만, 대부분의 경우 상태 설정에 문제가 없을 때 이 경고를 마주치게 되어 코드를 더 나빠지게 만드는 대안을 찾아야 했습니다. React 18에서는 이 경고를 [제거했습니다](https://github.com/facebook/react/pull/22114).
* **더 이상 콘솔 로그를 억제하지 않습니다.** Strict 모드를 사용할 때 React는 예기치 않은 부작용을 감지하기 위해 각 컴포넌트를 두 번 렌더링합니다. React 17에서는 두 번째 렌더링의 콘솔 로그를 억제하여 로그를 더 쉽게 읽을 수 있게 했습니다. 그러나 [커뮤니티의 피드백](https://github.com/facebook/react/issues/21783)에 따라 이 억제를 제거했습니다. 이제 React DevTools가 설치되어 있다면 두 번째 로그의 렌더링이 회색으로 표시되며 완전히 억제하는 옵션도 사용할 수 있습니다. (기본적으로 꺼져 있음)
* **메모리 사용을 개선했습니다.** React는 이제 마운트가 해제될 때 더 많은 내부 필드를 정리하여 코드에 존재할 수 있는 수정되지 않은 메모리 누수의 영향을 덜 심하게 만듭니다.

### React DOM 서버 {/*react-dom-server*/}

* **`renderToString`** 은 이제 서버에서 서스펜딩할 때 더 이상 오류가 발생하지 않습니다. 대신 가장 가까운 `<Suspense>` 경계에 fallback HTML을 출력하고, 그런 다음 클라이언트에서 동일한 콘텐츠를 다시 렌더링하도록 시도합니다. 여전히 `renderToPipeableStream` 또는 `renderToReadableStream`과 같은 스트리밍 API로 전환하는 것이 좋습니다.
* **`renderToStaticMarkup`** 은 이제 서버에서 서스펜딩할 때 더 이상 오류가 발생하지 않습니다. 대신 가장 가까운 `<Suspense>` 경계에 fallback HTML을 출력합니다.

## 변경 명세 {/*changelog*/}

[여기에서 전체 변경 명세](https://github.com/facebook/react/blob/main/CHANGELOG.md)를 확인할 수 있습니다.
