---
id: concurrent-mode-reference
title: Concurrent 모드 API Reference (실험적)
permalink: docs/concurrent-mode-reference.html
prev: concurrent-mode-adoption.html
---

>주의:
>
>이 페이지는 **안정된 배포판에서는 [아직 사용할 수 없는](/docs/concurrent-mode-adoption.html) 실험적인 기능들에 관해 설명합니다. 프로덕션용 앱에선 리액터의 실험 배포판을 사용하지 마세요. 이 기능들은 React에 일부가 되기 전에 경고 없이 크게 변경될 수 있습니다.
>
>이 문서는 얼리어답터들과 궁금해하시는 분들을 위해 제작된 문서입니다. React에 처음 접해본다면 이러한 기능들을 걱정하지 않아도 됩니다. 그 기능들을 바로 배울 필요는 없습니다

이 페이지는 React[Concurrent 모드](/docs/concurrent-mode-intro.html)에 대한 API Reference입니다 도입부에 대한 가이드를 찾고 있다면, [Concurrent UI 패턴](/docs/concurrent-mode-patterns.html)을 확인하세요

**주의: 이는 커뮤니티 프리뷰이며 최종적으로 안정된 배포판이 아닙니다. 향후에 이 API는 변경될 수도 있습니다. 본인의 책임하에 사용하세요!**

- [Concurrent 모드 활성화](#concurrent-mode)
    - [`루트만들기`](#createroot)
    - [`Blocking루트만들기`](#createblockingroot)
- [서스펜스](#suspense)
    - [`서스펜스`](#suspensecomponent)
    - ['서스펜스목록`](#suspenselist)
    - [`전환사용`](#usetransition)
    - [`지연된값사용`](#usedeferredvalue)

## Concurrent 모드 활성화{#concurrent-mode}

### `루트만들기` {#createroot}

```js
ReactDOM.createRoot(rootNode).render(<App />);
```

ReactDOM.render( />, rootNode)`을 대체하고 Concurrent 모드를 활성화합니다.

Concurrent 모드에 대한 더 자세한 설명이 필요하다면, [Concurrent Mode documentation.](/docs/concurrent-mode-intro.html)을 참고하세요

### `Blocking루트만들기` {#createblockingroot}

```js
ReactDOM.createBlockingRoot(rootNode).render()
```

`ReactDOM.render( />, rootNode)`를 대체하고 [Blocking 모드](/docs/concurrent-mode-adoption.html#migration-step-blocking-mode)를 활성화합니다.

Concurrent 모드를 선택하면 React 작동 방식의 의미가 변경됩니다, 즉 Concurrent 모드를 몇몇 컴포넌트 내에서는 Concurrent 모드를 사용할 수 없게 됩니다. 이 때문에, 몇몇 앱은 Concurrent 모드로 직접적인 마이그레이션을 할 수 없습니다.

Blocking 모드는 Concurrent 모드의 일부만 포함하며 직접 마이그레이션 할 수 없는 앱의 중간 마이그레이션 단계로 사용됩니다.

## 서스펜스 API {#suspense}

### `서스펜스` {#suspensecomponent}

```js
<Suspense fallback={<h1>Loading...</h1>}>
  <ProfilePhoto />
  <ProfileDetails />
</Suspense>
```

‘서스펜스’는 렌더링 하기 전에 컴포넌트가 무언가를 “대기”하도록 만들고, 기다리는 동안에 폴백을 보여줍니다.

위 예시에서는, ‘ProfileDetails’가 데이터를 가져오기 위해 비동기적 호출을 기다립니다 ‘ProfileDetails’와 ‘ProfilePhoto’를 기다리는 동안엔 ‘Loading…’ 폴백을 표시합니다 ‘<서스펜스>’ 내에 모든 아이가 로드되기 전까지는, 폴백을 계속 표시해야 한다는 점에 유의해야 합니다.

‘서스펜스’는 두 개의 props를 사용합니다:
* **폴백**은 로드 표시기를 사용합니다 폴백은 ‘서스펜스’ 컴포넌트의 모든 아이가 렌더링을 마치기 전까지 표시됩니다.
* **불안정한_폴백피하기**는 부울 방식을 사용합니다 이 도구는 초기 로드 중에 이 경계에 대한 “무시” 여부를 알려줍니다. 향후 배포판에서 이 API는 제거될 수 있습니다.

### `<서스펜스목록>` {#suspenselist}

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

‘서스펜스목록’은 사용자에게 출력되는 순서를 변경하여 일시 중단할 수도 있는 컴포넌트를 조정할 수 있습니다.

여러 컴포넌트가 데이터를 가져올 때, 예상치 못한 순서로 가져올 수도 있지만, ‘서스펜스 목록’에 있는 이 도구들로 감싸면, React는 이전 항목을 표시하기 전까지 목록에 있는 항목을 출력하지 않습니다. (이 동작은 수정할 수 있습니다)

‘서스펜스 목록’은 두 개의 props를 사용합니다:
* **순서표시(앞,뒤, 동시에)**는 ‘서스펜스목록’ 아이들이 표시되는 순서를 정의합니다.
 * ’동시에’는 하나씩 표시하는 것 대신에 준비된 *모두*를 표시합니다.
* **테일(축소, 숨김)**은 ‘서스펜스목록’에서 언 로드된 항목을 표시하는 방법을 나타냅니다
 * 기본적으로, ‘서스펜스목록’은 목록에 모든 폴백을 표시합니다
 * ‘축소’는 목록에서 다음 폴백만 표시합니다
 * ‘숨김’은 언 로드된 항목을 표시하지 않습니다.

‘서스펜스 목록’은 ‘서스펜스 목록’ 하에 있고 가장 인접한 ‘서스펜스’ 와 ‘서스펜스 목록’ 컴포넌트에만 동작한다는 점에 유의하세요 서스펜스 목록은 한 단계 더 깊은 경계는 검색하지 않지만, ‘서스펜스 목록’의 여러 컴포넌트를 중첩해 그리드를 형성할 수는 있습니다.

### `useTransition` {#usetransition}

```js
const SUSPENSE_CONFIG = { timeoutMs: 2000 };

const [startTransition, isPending] = useTransition(SUSPENSE_CONFIG);
```

`useTransition`은 **다음 화면으로 전환**하기 전에 컨텐츠가 로드 될 때까지 대기함으로써 컴포넌트가 바람직하지 않은 로딩 상태를 피할 수 있습니다. 또한 컴포넌트가 후속 렌더링까지 더 느린 데이터 페치 업데이트를 지연시켜 보다 중요한 업데이트를 즉시 렌더링 할 수 있습니다.

`useTransition` hook은 배열에서 두 개의 값을 반환합니다.
* `startTransition`은 callback을 받는 함수입니다. React에게 지연하고자 하는 상태를 전하기 위해 이 함수를 사용할 수 있습니다.
*'isPending'은 부울입니다. 전환이 완료되기를 기다리고 있는지 알려주는 React의 방식입니다.

**일부 상태 업데이트로 컴포넌트가 중단되면 해당 상태 업데이트는 전환으로 래핑되어야 합니다.**

```js
const SUSPENSE_CONFIG = {timeoutMs: 2000 };

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

위 코드에서는 데이터 페칭을 `startTransition`으로 래핑했습니다. 이를 통해 다음 프로필 페이지의 렌더링과 연관된 ‘스피너’를 2초동안(`timeoutMS`에 표시된 시간) 지연시키면서 프로필 데이터를 바로 가져올 수 있습니다.

`isPending` 부울은 React에게 컴포넌트가 전환중임을 알리기 때문에, 이전 프로필 페이지에 로딩텍스트를 표시하여 사용자에게 알려줍니다.

** 전환에 대한 자세한 내용은 [Concurrent UI 패턴](/docs/concurrent-mode-patterns.html#transitions)를 참고하세요.**

#### useTransition Config {#usetransition-config}

```js
const SUSPENSE_CONFIG = { timeoutMs: 2000 };
```

`useTransition`은 `timeoutMS`가 포함 된 **선택적인 서스펜스 Config**를 허용합니다. 이 시간초과(밀리 초 내에 일어나는)는 다음 상태(위의 예제에서 새로운 프로필 페이지)를 표시하기 전에 대기시간을 React에게 알려줍니다.

**참고: 여러 모듈간에 서스펜스 Config를 공유하는 것이 좋습니다.**


### `useDeferredValue` {#usedeferredvalue}

```js
const deferredValue = useDeferredValue(value, { timeoutMs: 2000 });
```

최대 `timeoutMS` 동안 "지연된" 값의 지연된 버전을 반환하세요.

이는 흔히 사용자 입력을 기반으로 즉시 렌더링되는 것과 데이터 패칭을 기다려야 할 때 인터페이스를 반응적으로 유지하는 데에 사용합니다.

이에 대한 좋은 예는 텍스트 입력입니다.

```js
function App() {
  const [text, setText] = useState("hello");
  const deferredText = useDeferredValue(text, {timeoutMs: 2000 }); 

  return (
    <div className="App">
      {/* Keep passing the current text to the input */}
      <input value={text} onChange={handleChange} />
      ...
      {/* But the list is allowed to "lag behind" when necessary */}
      <MySlowList text={deferredText} />
    </div>
  );
 }
```

이를 통해 `입력`에 대한 새 텍스트를 즉시 표시 할 수 있으므로 웹페이지가 반응적으로 느껴지도록 합니다. 한편, `MySlowList`는 업데이트 전에 ‘timeoutMS’에 따라 최대 2초 동안 “지연”되어 백그라운드에서 현재 텍스트를 렌더링 할 수 있습니다. 

**값의 지연에 대한 상세한 내용은 [Concurrent UI 패턴](/docs/concurrent-mode-patterns.html#deferring-a-value)를 참고하세요.**

#### useDeferredValue Config {#usedeferredvalue-config}

```js
const SUSPENSE_CONFIG = { timeoutMs: 2000 };
```

`useDeferredValue`는 `timeoutMS`가 있는 **선택적인 서스펜스 Config**를 허용합니다. 이 시간초과(밀리초 내에 일어나는)는 지연된 값이 지연 될 수 있는 시간을 React에게 알립니다.

React는 네트워크와 장치가 허용할 때 항상 더 짧은 지연시간을 사용하려고 합니다.
