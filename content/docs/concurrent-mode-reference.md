---
id: concurrent-mode-reference
title: Concurrent 모드 API 참고서 (실험 단계)
permalink: docs/concurrent-mode-reference.html
prev: concurrent-mode-adoption.html
---

<style>
.scary > blockquote {
  background-color: rgba(237, 51, 21, 0.2);
  border-left-color: #ed3315;
}
</style>

<div class="scary">

>주의
>
<<<<<<< HEAD
>이 페이지는 **안정된 배포판에서는 [아직 사용할 수 없는](/docs/concurrent-mode-adoption.html) 실험적인 기능들에 관해 설명합니다.** 프로덕션용 앱에선 React의 실험 배포판을 사용하지 마세요. 이 기능들은 React의 일부가 되기 전에 경고 없이 크게 변경될 수 있습니다.
>
>이 문서는 얼리어답터들과 궁금해하시는 분들을 위해 제작된 문서입니다. **React를 처음 접해본다면 이러한 기능들을 걱정하지 않아도 됩니다.** 그 기능들을 바로 배울 필요는 없습니다.
=======
>This page was about experimental features that aren't yet available in a stable release. It was aimed at early adopters and people who are curious.
>
>Much of the information on this page is now outdated and exists only for archival purposes. **Please refer to the [React 18 Alpha announcement post](/blog/2021/06/08/the-plan-for-react-18.html
) for the up-to-date information.**
>
>Before React 18 is released, we will replace this page with stable documentation.
>>>>>>> f3baa6d075c8de475b688abf035d7054bc8a9606

</div>

이 페이지는 React [Concurrent 모드](/docs/concurrent-mode-intro.html)에 대한 API 참고서입니다. 도입부에 대한 가이드를 찾고 있다면, [Concurrent UI 패턴](/docs/concurrent-mode-patterns.html)을 확인해주세요.

**주의: 이는 커뮤니티 프리뷰이며 최종적으로 안정된 배포판이 아닙니다. 향후에 이 API는 변경될 수도 있습니다. 본인의 책임하에 사용하세요!**

- [Concurrent 모드 활성화](#concurrent-mode)
    - [`createRoot`](#createroot)
- [Suspense](#suspense)
    - [`Suspense`](#suspensecomponent)
    - [`SuspenseList`](#suspenselist)
    - [`useTransition`](#usetransition)
    - [`useDeferredValue`](#usedeferredvalue)

## Concurrent 모드 활성화 {#concurrent-mode}

### `createRoot` {#createroot}

```js
ReactDOM.createRoot(rootNode).render(<App />);
```

`ReactDOM.render(<App />, rootNode)`을 대체하고 Concurrent 모드를 활성화합니다.

Concurrent 모드에 대한 더 자세한 설명이 필요하다면, [Concurrent Mode 문서](/docs/concurrent-mode-intro.html)를 참고해주세요.

## Suspense API {#suspense}

### `Suspense` {#suspensecomponent}

```js
<Suspense fallback={<h1>Loading...</h1>}>
  <ProfilePhoto />
  <ProfileDetails />
</Suspense>
```

`Suspense`는 컴포넌트가 렌더링되기 전에 무언가를 "기다릴 수 있도록 하며", 기다리는 동안에 폴백을 보여줍니다.

<<<<<<< HEAD
위 예시에서 `ProfileDetails`는 일부 데이터를 가져 오기 위해 비동기 API 호출을 기다리고 있습니다. `ProfileDetails`와 `ProfilePhoto`를 기다리는 동안에 `Loading...` 폴백을 대신 보여줍니다. `<Suspense>`의 모든 자식이 로드될 때까지 폴백을 계속 표시한다는 점에 주의해주세요.
=======
In this example, `ProfileDetails` is waiting for an asynchronous API call to fetch some data. While we wait for `ProfileDetails` and `ProfilePhoto`, we will show the `Loading...` fallback instead. It is important to note that until all children inside `<Suspense>` have loaded, we will continue to show the fallback.
>>>>>>> f3baa6d075c8de475b688abf035d7054bc8a9606

`Suspense`는 두 개의 props를 사용합니다.
* **fallback**은 로딩 표시기를 받아들입니다. 폴백은 `Suspense` 컴포넌트의 모든 자식이 렌더링을 마치기 전까지 표시됩니다.
* **unstable_avoidThisFallback**은 boolean을 받아들입니다. 초기 로드할 때 이 경계를 보여주는 걸 건너뛸 지 말 지 React에게 알려줍니다. 향후 배포판에서 이 API는 제거될 수 있습니다.

### `<SuspenseList>` {#suspenselist}

```js
<SuspenseList revealOrder="forwards">
  <Suspense fallback={'Loading...'}>
    <ProfilePicture id={1} />
  </Suspense>
  <Suspense fallback={'Loading...'}>
    <ProfilePicture id={2} />
  </Suspense>
  <Suspense fallback={'Loading...'}>
    <ProfilePicture id={3} />
  </Suspense>
  ...
</SuspenseList>
```

`SuspenseList`는 컴포넌트가 사용자에게 표시되는 순서를 조정하여 일시 중단 할 수 있는 많은 컴포넌트를 조정하는 데 도움을 줍니다.

여러 컴포넌트가 데이터를 가져올 때 예상하지 못한 순서로 데이터가 도착할 수 있습니다. `SuspenseList`로 이러한 항목을 감싸면, React는 이전 항목을 표시하기 전까지 목록에 있는 항목을 출력하지 않습니다. (이 동작은 수정할 수 있습니다)

`SuspenseList`은 두 개의 props를 사용합니다.
* **revealOrder(forwards, backwards, together)**는 `SuspenseList` 자식이 표시되는 순서를 정의합니다.
  * `together`는 하나씩 표시하지 않고 준비됐을 때 *모두 한번에* 표시합니다.
* **tail (collapsed, hidden)**은 `SuspenseList`에서 로드되지 않은 항목을 표시하는 방법을 나타냅니다.
    * 기본적으로, `SuspenseList`는 목록에 있는 모든 폴백을 표시합니다.
    * `collapsed`는 목록에서 다음 폴백만 표시합니다.
    * `hidden`은 로드되지 않은 항목을 표시하지 않습니다.

`SuspenseList`는 `SuspenseList` 컴포넌트 아래에 있고 가장 인접한 `Suspense`와 `SuspenseList` 컴포넌트에만 동작한다는 점에 주의해주세요. 한 단계보다 깊은 경계는 검색하지 않지만 여러 `SuspenseList` 컴포넌트를 중첩해 그리드를 형성할 수는 있습니다.

### `useTransition` {#usetransition}

```js
const SUSPENSE_CONFIG = { timeoutMs: 2000 };

const [startTransition, isPending] = useTransition(SUSPENSE_CONFIG);
```

`useTransition`은 **다음 화면으로 transition**하기 전에 컨텐츠가 로드 될 때까지 대기함으로써 컴포넌트가 바람직하지 않은 로딩 상태를 피할 수 있게 해줍니다. 또한 컴포넌트가 더 중요한 업데이트를 즉시 렌더링 할 수 있도록 후속 렌더링까지 느린 데이터 가져오기를 지연시킬 수 있습니다.

`useTransition` hook은 배열에서 두 개의 값을 반환합니다.
* `startTransition`은 callback을 받는 함수입니다. React에게 지연하고자 하는 상태를 말해주기 위해 이 함수를 사용할 수 있습니다.
* `isPending`은 boolean입니다. transition이 완료되기를 기다리고 있는지 알려주는 React의 방식입니다.

**일부 상태 업데이트로 컴포넌트가 중단되면 해당 상태 업데이트는 transition으로 감싸져야 합니다.**

```js
const SUSPENSE_CONFIG = { timeoutMs: 2000 };

function App() {
  const [resource, setResource] = useState(initialResource);
  const [startTransition, isPending] = useTransition(SUSPENSE_CONFIG);
  return (
    <>
      <button
        disabled={isPending}
        onClick={() => {
          startTransition(() => {
            const nextUserId = getNextId(resource.userId);
            setResource(fetchProfileData(nextUserId));
          });
        }}
      >
        Next
      </button>
      {isPending ? " Loading..." : null}
      <Suspense fallback={<Spinner />}>
        <ProfilePage resource={resource} />
      </Suspense>
    </>
  );
}
```

위 코드에서 데이터 조회를 `startTransition`으로 감쌌습니다. 이를 통해 다음 프로필 페이지의 렌더링과 연관된 `Spinner`를 2초동안(`timeoutMS`에 표시된 시간) 지연시키면서 프로필 데이터를 바로 가져올 수 있습니다.

`isPending` boolean은 React에게 컴포넌트가 transition 중이라는 걸 알리기 때문에, 이전 프로필 페이지에 로딩 텍스트를 표시하여 사용자에게 알려줍니다.

**Transition에 대한 자세한 내용은 [Concurrent UI 패턴](/docs/concurrent-mode-patterns.html#transitions)를 참고해주세요.**

#### useTransition Config {#usetransition-config}

```js
const SUSPENSE_CONFIG = { timeoutMs: 2000 };
```

`useTransition`은 `timeoutMS`가 포함된 **선택적인 Suspense Config**를 허용합니다. 이 시간초과(밀리 초 내에 일어나는)는 다음 상태(위의 예시에서 새로운 프로필 페이지)를 표시하기 전에 기다리는 시간을 React에게 알려줍니다.


**주의: 여러 모듈 간에 Suspense Config를 공유하는 것이 좋습니다.**


### `useDeferredValue` {#usedeferredvalue}

```js
const deferredValue = useDeferredValue(value, { timeoutMs: 2000 });
```

최대 `timeoutMS` 동안 "뒤처질 수 있는" 값의 지연된 버전을 반환하세요.

이는 흔히 사용자 입력을 기반으로 즉시 렌더링하거나 데이터 조회를 기다려야 할 때 인터페이스를 반응적으로 유지하는 데에 사용합니다.

이에 대한 좋은 예시는 텍스트 입력입니다.

```js
function App() {
  const [text, setText] = useState("hello");
  const deferredText = useDeferredValue(text, { timeoutMs: 2000 });

  return (
    <div className="App">
      {/* input에 현재 텍스트를 계속 전달합니다. */}
      <input value={text} onChange={handleChange} />
      ...
      {/* 하지만 이 목록은 필요한 경우 "뒤처질" 수 있습니다. */}
      <MySlowList text={deferredText} />
    </div>
  );
 }
```

이를 통해 `input`에 대한 새로운 텍스트를 즉시 표시 할 수 있으므로 웹페이지가 반응적으로 느껴지도록 합니다. 한편, `MySlowList`는 업데이트 전에 `timeoutMS`에 따라 최대 2초 동안 "뒤처져서" 백그라운드에서 현재 텍스트로 렌더링 할 수 있습니다.

**값의 지연에 대한 상세한 내용은 [Concurrent UI 패턴](/docs/concurrent-mode-patterns.html#deferring-a-value)을 참고해주세요.**

#### useDeferredValue Config {#usedeferredvalue-config}

```js
const SUSPENSE_CONFIG = { timeoutMs: 2000 };
```

`useDeferredValue`는 `timeoutMS`가 있는 **선택적인 Suspense Config**를 허용합니다. 이 시간초과(밀리초 내에 일어나는)는 뒤처진 값이 얼마나 지연될 수 있는지 React에게 알립니다.

React는 네트워크와 장치가 허용할 때 항상 더 짧은 지연을 사용하려고 합니다.
