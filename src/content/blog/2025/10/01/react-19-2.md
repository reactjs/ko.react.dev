---
title: "React 19.2"
author: React 팀
date: 2025/10/01
description: React 19.2에는 Activity, React 성능 트랙, useEffectEvent 등의 새로운 기능이 추가되었습니다.
---

2025년 10월 1일, React 팀

---

<Intro>

React 19.2가 npm에 공개되었습니다!

</Intro>

이번 릴리즈는 지난 12월 React 19, 6월 React 19.1에 이어 지난 한 해 동안 세 번째 릴리즈입니다. 이 글에서는 React 19.2의 새로운 기능 개요와 주목할 만한 변경 사항을 중점적으로 다룰 예정입니다.

<InlineToc />

---

## 새로운 React 기능 {/*new-react-features*/}

### `<Activity />` {/*activity*/}

`<Activity>`를 사용하면 앱을 제어하고 우선순위를 지정할 수 있는 "활동"으로 나눌 수 있습니다.

Activity는 앱의 특정 부분을 조건부로 렌더링하는 대안으로 사용할 수 있습니다.

```js
// Before
{isVisible && <Page />}

// After
<Activity mode={isVisible ? 'visible' : 'hidden'}>
  <Page />
</Activity>
```

React 19.2에서 Activity는 `visible`과 `hidden` 두 가지 모드를 지원합니다.

- `hidden`: 자식 요소를 숨기고, 이펙트를 마운트 해제하며, React가 더 이상 작업할 것이 없을 때까지 모든 업데이트를 지연시킵니다.
- `visible`: 자식 요소를 표시하고, 이펙트를 마운트하며, 업데이트가 정상적으로 처리되도록 허용합니다.

이는 앱의 숨겨진 부분을 화면에 보이는 어떤 것의 성능에도 영향을 미치지 않으면서 미리 렌더링하고 계속 렌더링할 수 있음을 의미합니다.

Activity를 사용하면 사용자가 다음에 탐색할 가능성이 있는 앱의 숨겨진 부분을 렌더링하거나, 사용자가 떠난 부분의 상태를 저장할 수 있습니다. 이는 백그라운드에서 데이터, CSS, 이미지를 로드하여 탐색을 더 빠르게 하고, 뒤로 가기 탐색 시 입력 필드와 같은 상태를 유지하는 데 도움이 됩니다.

앞으로는 다양한 사용 사례를 위해 Activity에 더 많은 모드를 추가할 계획입니다.

Activity 사용 방법에 대한 예시는 [Activity 문서](/reference/react/Activity)를 참조하세요.

---

### `useEffectEvent` {/*use-effect-event*/}

`useEffect`의 일반적인 패턴 중 하나는 외부 시스템으로부터 어떤 종류의 "이벤트"에 대해 앱 코드에 알리는 것입니다. 예를 들어, 채팅방이 연결될 때 알림을 표시하고 싶을 수 있습니다.

```js {5,11}
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId, theme]);
  // ...
```

위 코드의 문제는 이러한 "이벤트" 내에서 사용되는 값의 변경이 주변 Effect를 다시 실행하게 만든다는 것입니다. 예를 들어, `theme`을 변경하면 채팅방이 다시 연결됩니다. 이는 `roomId`처럼 Effect 로직 자체와 관련된 값에는 타당하지만, `theme`에는 타당하지 않습니다.

이 문제를 해결하기 위해 대부분의 사용자는 린트 규칙을 비활성화하고 의존성을 제외합니다. 그러나 나중에 Effect를 업데이트해야 할 때 린터가 더 이상 의존성을 최신 상태로 유지하는 데 도움을 줄 수 없으므로 버그가 발생할 수 있습니다.

`useEffectEvent`를 사용하면 이 로직의 "이벤트" 부분을 이를 내보내는 Effect에서 분리할 수 있습니다.

```js {2,3,4,9}
function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ 모든 의존성이 선언됨 (Effect Events는 의존성이 아님)
  // ...
```

DOM 이벤트와 유사하게, Effect 이벤트는 항상 최신 props와 상태를 "봅니다".

**Effect 이벤트는 의존성 배열에 선언해서는 안 됩니다**. 린터가 이를 의존성으로 삽입하려고 하지 않도록 `eslint-plugin-react-hooks@latest`로 업그레이드해야 합니다. Effect 이벤트는 "자신"의 Effect와 동일한 컴포넌트 또는 Hook 내에서만 선언할 수 있습니다. 이러한 제약은 린터에 의해 검증됩니다.

<Note>

#### `useEffectEvent`를 사용해야 하는 경우 {/*when-to-use-useeffectevent*/}

`useEffectEvent`는 사용자 이벤트 대신 Effect에서 발생(발화)하는 개념적으로 "이벤트"인 함수에 사용해야 합니다 (이것이 "Effect 이벤트"인 이유입니다). 모든 것을 `useEffectEvent`로 감쌀 필요는 없으며, 린트 오류를 숨기기 위해서만 사용해서는 안 됩니다. 이는 버그로 이어질 수 있습니다.

이벤트 Effect를 생각하는 방법에 대한 자세한 내용은 [이벤트와 Effect 분리하기](/learn/separating-events-from-effects#extracting-non-reactive-logic-out-of-effects)를 참조하세요.

</Note>

---

### `cacheSignal` {/*cache-signal*/}

<RSC>

`cacheSignal`은 [리액트 서버 컴포넌트](/reference/rsc/server-components)에서만 사용됩니다.

</RSC>

`cacheSignal`을 사용하면 [`cache()`](/reference/react/cache)의 수명이 끝났을 때 알 수 있습니다:

```
import {cache, cacheSignal} from 'react';
const dedupedFetch = cache(fetch);

async function Component() {
  await dedupedFetch(url, { signal: cacheSignal() });
}
```

이를 통해 결과가 더 이상 캐시에서 사용되지 않을 때 작업을 정리하거나 중단할 수 있습니다. 예를 들어:

- React가 렌더링을 성공적으로 완료한 경우
- 렌더링이 중단된 경우
- 렌더링이 실패한 경우

자세한 내용은 [`cacheSignal` 문서](/reference/react/cacheSignal)를 참조하세요.

---

### 성능 트랙 {/*performance-tracks*/}

React 19.2는 Chrome DevTools 성능 프로필에 새로운 [커스텀 트랙](https://developer.chrome.com/docs/devtools/performance/extension) 세트를 추가하여 React 앱의 성능에 대한 더 많은 정보를 제공합니다:

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <picture >
      <source srcset="/images/blog/react-labs-april-2025/perf_tracks.png" />
      <img className="w-full light-image" src="/images/blog/react-labs-april-2025/perf_tracks.webp" />
  </picture>
  <picture >
      <source srcset="/images/blog/react-labs-april-2025/perf_tracks_dark.png" />
      <img className="w-full dark-image" src="/images/blog/react-labs-april-2025/perf_tracks_dark.webp" />
  </picture>
</div>

[React 성능 트랙 문서](/reference/dev-tools/react-performance-tracks)에 트랙에 포함된 모든 내용이 설명되어 있지만, 여기서는 개략적인 개요를 제공합니다.

#### Scheduler ⚛ {/*scheduler-*/}

스케줄러 트랙은 사용자 상호작용을 위한 "블로킹(blocking)" 또는 `startTransition` 내부 업데이트를 위한 "트랜지션(transition)"과 같이 React가 다양한 우선순위에 대해 작업하는 내용을 보여줍니다. 각 트랙 내부에서는 업데이트를 예약한 이벤트 및 해당 업데이트의 렌더링이 발생한 시점과 같이 수행되는 작업 유형을 볼 수 있습니다.

또한 업데이트가 다른 우선순위를 기다리면서 차단되는 시점 또는 React가 계속하기 전에 페인트를 기다리는 시점과 같은 정보도 표시합니다. 스케줄러 트랙은 React가 코드를 다양한 우선순위로 분할하고 작업을 완료한 순서를 이해하는 데 도움이 됩니다.

포함된 모든 내용을 보려면 [스케쥴러 트랙](/reference/dev-tools/react-performance-tracks#scheduler) 문서를 참조하세요.

#### Components ⚛ {/*components-*/}

컴포넌트 트랙은 React가 렌더링하거나 이펙트를 실행하기 위해 작업하는 컴포넌트 트리를 보여줍니다. 내부에서는 자식 요소가 마운트되거나 이펙트가 마운트될 때 "마운트(Mount)" 또는 React 외부 작업에 양보하여 렌더링이 차단될 때 "차단(Blocked)"과 같은 레이블을 볼 수 있습니다.

컴포넌트 트랙은 컴포넌트가 렌더링되거나 이펙트를 실행하는 시점과 해당 작업을 완료하는 데 걸리는 시간을 이해하여 성능 문제를 식별하는 데 도움이 됩니다.

포함된 모든 내용을 보려면 [컴포넌트 트랙](/reference/dev-tools/react-performance-tracks#components) 문서를 참조하세요.

---

## 새로운 React DOM 기능 {/*new-react-dom-features*/}

### 부분 사전 렌더링 {/*partial-pre-rendering*/}

19.2에서는 앱의 일부를 미리 렌더링하고 나중에 렌더링을 재개할 수 있는 새로운 기능을 추가했습니다.

이 기능은 "부분 사전 렌더링(Partial Pre-rendering)"이라고 불리며, 앱의 정적 부분을 미리 렌더링하여 CDN에서 제공한 다음 셸(shell) 렌더링을 재개하여 나중에 동적 콘텐츠로 채울 수 있도록 합니다.

앱을 나중에 재개하기 위해 미리 렌더링하려면 먼저 `AbortController`와 함께 `prerender`를 호출합니다:

```
const {prelude, postponed} = await prerender(<App />, {
  signal: controller.signal,
});

// 나중에 사용하기 위해 지연된(postponed) 상태를 저장합니다.
await savePostponedState(postponed);

// prelude를 클라이언트 또는 CDN으로 전송합니다.
```

그런 다음, `prelude` 셸을 클라이언트에 반환하고, 나중에 `resume`을 호출하여 SSR 스트림으로 "재개"할 수 있습니다:

```
const postponed = await getPostponedState(request);
const resumeStream = await resume(<App />, postponed);

// 스트림을 클라이언트로 전송합니다.
```

또는 `resumeAndPrerender`를 호출하여 SSG를 위한 정적 HTML을 얻기 위해 재개할 수 있습니다:

```
const postponedState = await getPostponedState(request);
const { prelude } = await resumeAndPrerender(<App />, postponedState);

// 완성된 HTML prelude를 CDN으로 전송합니다.
```

자세한 내용은 새로운 API 문서에서 확인할 수 있습니다:
- `react-dom/server`
  - [`resume`](/reference/react-dom/server/resume): 웹 스트림용.
  - [`resumeToPipeableStream`](/reference/react-dom/server/resumeToPipeableStream): Node 스트림용.
- `react-dom/static`
  - [`resumeAndPrerender`](/reference/react-dom/static/resumeAndPrerender): 웹 스트림용.
  - [`resumeAndPrerenderToNodeStream`](/reference/react-dom/static/resumeAndPrerenderToNodeStream): Node 스트림용.

또한, `prerender` API는 이제 `resume` API로 전달할 `postpone` 상태를 반환합니다.

---

## 주목할 만한 변경 사항 {/*notable-changes*/}

### SSR을 위한 Suspense Boundary 배치 {/*batching-suspense-boundaries-for-ssr*/}

클라이언트에서 렌더링될 때와 서버 사이드 렌더링에서 스트리밍될 때 Suspense Boundary가 다르게 나타나는 동작 버그를 수정했습니다.

19.2부터 React는 서버 렌더링된 Suspense Boundary의 노출을 짧은 시간 동안 배치(batch)하여 더 많은 콘텐츠가 함께 노출되고 클라이언트 렌더링 동작과 일치하도록 합니다.

<Diagram name="19_2_batching_before" height={162} width={1270} alt="Diagram with three sections, with an arrow transitioning each section in between. The first section contains a page rectangle showing a glimmer loading state with faded bars. The second panel shows the top half of the page revealed and highlighted in blue. The third panel shows the entire the page revealed and highlighted in blue.">

이전에는 스트리밍 서버 사이드 렌더링 동안 Suspense 콘텐츠가 즉시 폴백을 대체했습니다.

</Diagram>

<Diagram name="19_2_batching_after" height={162} width={1270} alt="Diagram with three sections, with an arrow transitioning each section in between. The first section contains a page rectangle showing a glimmer loading state with faded bars. The second panel shows the same page. The third panel shows the entire the page revealed and highlighted in blue.">

React 19.2에서는 Suspense Boundary가 짧은 시간 동안 배치되어 더 많은 콘텐츠를 함께 노출할 수 있습니다.

</Diagram>

이 수정은 또한 SSR 중 Suspense에 대한 `<ViewTransition>` 지원을 위한 앱을 준비합니다. 더 많은 콘텐츠를 함께 노출함으로써 애니메이션이 더 큰 콘텐츠 배치에서 실행될 수 있으며, 가깝게 스트리밍되는 콘텐츠의 체인 애니메이션을 피할 수 있습니다.

<Note>

React는 스로틀링이 핵심 웹 바이탈 및 검색 순위에 영향을 미치지 않도록 휴리스틱을 사용합니다.

예를 들어, 총 페이지 로드 시간이 2.5초([LCP](https://web.dev/articles/lcp)에 대해 "좋음"으로 간주되는 시간)에 가까워지면 React는 배치를 중단하고 즉시 콘텐츠를 노출하여 스로틀링이 측정 항목을 놓치는 이유가 되지 않도록 합니다.

</Note>

---

### SSR: Node용 웹 스트림 지원 {/*ssr-web-streams-support-for-node*/}

React 19.2는 Node.js에서 스트리밍 SSR을 위한 웹 스트림(Web Streams) 지원을 추가합니다:
- [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream)은 이제 Node.js에서 사용할 수 있습니다
- [`prerender`](/reference/react-dom/static/prerender)는 이제 Node.js에서 사용할 수 있습니다

새로운 `resume` API도 마찬가지입니다:
- [`resume`](/reference/react-dom/server/resume)은 Node.js에서 사용할 수 있습니다.
- [`resumeAndPrerender`](/reference/react-dom/static/resumeAndPrerender)는 Node.js에서 사용할 수 있습니다.


<Pitfall>

#### Node.js에서 서버 사이드 렌더링에는 Node 스트림을 선호하세요 {/*prefer-node-streams-for-server-side-rendering-in-nodejs*/}

Node.js 환경에서는 여전히 Node 스트림 API 사용을 강력히 권장합니다:

- [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream)
- [`resumeToPipeableStream`](/reference/react-dom/server/resumeToPipeableStream)
- [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream)
- [`resumeAndPrerenderToNodeStream`](/reference/react-dom/static/resumeAndPrerenderToNodeStream)

이는 Node에서 Node 스트림이 웹 스트림보다 훨씬 빠르며, 웹 스트림은 기본적으로 압축을 지원하지 않아 사용자가 의도치 않게 스트리밍의 이점을 놓칠 수 있기 때문입니다.

</Pitfall>

---

### `eslint-plugin-react-hooks` v6 {/*eslint-plugin-react-hooks*/}

또한 `eslint-plugin-react-hooks@latest`를 공개했으며, `recommended` 프리셋에 기본적으로 플랫 config를 포함하고 새로운 React 컴파일러 기반 규칙을 옵트인(opt-in)할 수 있도록 했습니다.

레거시 config를 계속 사용하려면 `recommended-legacy`로 변경할 수 있습니다:

```diff
- extends: ['plugin:react-hooks/recommended']
+ extends: ['plugin:react-hooks/recommended-legacy']
```

컴파일러 활성화 규칙의 전체 목록은 [린터 문서](/reference/eslint-plugin-react-hooks#recommended)를 참조하세요.

전체 변경 사항 목록은 [`eslint-plugin-react-hooks` 변경 로그](https://github.com/facebook/react/blob/main/packages/eslint-plugin-react-hooks/CHANGELOG.md#610)를 참조하세요.

---

### 기본 `useId` 접두사 업데이트 {/*update-the-default-useid-prefix*/}

19.2에서는 기본 `useId` 접두사를 `:r:`(19.0.0) 또는 `«r»`(19.1.0)에서 `_r_`로 업데이트하고 있습니다.

CSS 선택자에 유효하지 않은 특수 문자를 사용하는 원래 의도는 사용자가 작성한 ID와 충돌할 가능성이 낮다는 것이었습니다. 그러나 View Transition을 지원하려면 `useId`에 의해 생성된 ID가 `view-transition-name` 및 XML 1.0 이름에 유효한지 확인해야 합니다.

---

## 변경 로그 {/*changelog*/}

기타 주목할 만한 변경 사항
- `react-dom`: 호이스팅 가능한 스타일에서 nonce 사용 허용 [#32461](https://github.com/facebook/react/pull/32461)
- `react-dom`: React 소유 노드가 텍스트 콘텐츠도 포함하는 경우 컨테이너로 사용하는 것에 대한 경고 [#32774](https://github.com/facebook/react/pull/32774)

주목할 만한 버그 수정
- `react`: Context를 "SomeContext.Provider" 대신 "SomeContext"로 문자열화 [#33507](https://github.com/facebook/react/pull/33507)
- `react`: popstate 이벤트에서 useDeferredValue의 무한 루프 수정 [#32821](https://github.com/facebook/react/pull/32821)
- `react`: useDeferredValue에 초기 값이 전달될 때의 버그 수정 [#34376](https://github.com/facebook/react/pull/34376)
- `react`: 클라이언트 액션(Client Actions)으로 양식을 제출할 때의 충돌 수정 [#33055](https://github.com/facebook/react/pull/33055)
- `react`: 다시 중단되는(resuspend) 탈수된(dehydrated) Suspense Boundary의 콘텐츠 숨기기/숨김 해제 [#32900](https://github.com/facebook/react/pull/32900)
- `react`: 핫 리로드(Hot Reload) 중 넓은 트리에서 스택 오버플로우 방지 [#34145](https://github.com/facebook/react/pull/34145)
- `react`: 다양한 위치에서 컴포넌트 스택 개선 [#33629](https://github.com/facebook/react/pull/33629), [#33724](https://github.com/facebook/react/pull/33724), [#32735](https://github.com/facebook/react/pull/32735), [#33723](https://github.com/facebook/react/pull/33723)
- `react`: React.lazy로 지연된 컴포넌트 내 React.use 사용 시 버그 수정 [#33941](https://github.com/facebook/react/pull/33941)
- `react-dom`: ARIA 1.3 속성 사용 시 경고 중단 [#34264](https://github.com/facebook/react/pull/34264)
- `react-dom`: 깊게 중첩된 Suspense 폴백 내 Suspense 버그 수정 [#33467](https://github.com/facebook/react/pull/33467)
- `react-dom`: 렌더링 중 중단 후 중단 시 행잉(hanging) 방지 [#34192](https://github.com/facebook/react/pull/34192)

전체 변경 사항 목록은 [변경 로그](https://github.com/facebook/react/blob/main/CHANGELOG.md)를 참조하세요.


---

이 글을 작성해주신 [Ricky Hanlon](https://bsky.app/profile/ricky.fm), 그리고 이 글을 검토해주신 [Dan Abramov](https://bsky.app/profile/danabra.mov), [Matt Carroll](https://twitter.com/mattcarrollcode), [Jack Pope](https://jackpope.me), [Joe Savona](https://x.com/en_JS)에게 감사드립니다.
