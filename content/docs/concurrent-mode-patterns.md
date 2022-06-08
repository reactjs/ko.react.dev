---
id: concurrent-mode-patterns
title: 컨커런트 UI 패턴 (실험)
permalink: docs/concurrent-mode-patterns.html
prev: concurrent-mode-suspense.html
next: concurrent-mode-adoption.html
---

<style>
.scary > blockquote {
  background-color: rgba(237, 51, 21, 0.2);
  border-left-color: #ed3315;
}
</style>

<div class="scary">

>주의:
>
>이 페이지는 **업데이트 되지 않은 페이지**이며 기록을 목적으로 존재합니다.
>
>React 18에서는 컨커런트(동시성)를 지원합니다. 컨커런트 모드 동작은 [새 기능을 사용할 때](https://reactjs.org/blog/2022/03/29/react-v18.html#gradually-adopting-concurrent-features) 자동으로 활성화됩니다.
>
>**최신 정보는 다음을 참조하세요.**
>* [React 18 공지](https://reactjs.org/blog/2022/03/29/react-v18.html)
>* [React 18로 업그레이드](https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html)
>* [React Conf 2021 영상](http://localhost:8000/blog/2021/12/17/react-conf-2021-recap.html)
>
>**React 18의 컨커런트 API에 대한 자세한 내용은 다음을 참조하세요.**
>* [`React.Suspense`](https://reactjs.org/docs/react-api.html#reactsuspense) 참조
>* [`React.startTransition`](https://reactjs.org/docs/react-api.html#starttransition) 참조
>* [`React.useTransition`](https://reactjs.org/docs/hooks-reference.html#usetransition) 참조
>* [`React.useDeferredValue`](https://reactjs.org/docs/hooks-reference.html#usedeferredvalue) 참조
>
>이 페이지의 일부는 오래되었거나 잘못된 콘텐츠가 포함되어 있습니다.

</div>

일반적으로 상태가 갱신될 때 화면의 즉각적인 변화를 기대합니다. 애플리케이션이 사용자 입력에 반응하는 것을 유지하고 싶기 때문입니다. 하지만 **화면에 나타나는 변화를 지연하고** 싶은 경우도 있습니다.

예를 들어 한 페이지에서 다른 페이지로 전환할 때 다음 화면에 필요한 코드나 데이터가 전혀 준비되어 있지 않으면 순간적으로 빈 화면에 로딩 중인 모습이 보이고 답답할 수 있습니다. 이전 화면을 좀 더 길게 보여주고 싶을 때도 있습니다. React에서 이런 패턴을 구현하기란 오랫동안 어려웠습니다. 컨커런트 모드는 이 문제를 해결하기 위한 새로운 도구를 제공합니다.

- [트랜지션](#transitions)
  - [setState를 트랜지션에 래핑하기](#wrapping-setstate-in-a-transition)
  - [지연 인디케이터 추가하기](#adding-a-pending-indicator)
  - [변화 살펴보기](#reviewing-the-changes)
  - [어디에서 갱신이 발생하나요?](#where-does-the-update-happen)
  - [트랜지션은 모든 곳에 있습니다](#transitions-are-everywhere)
  - [디자인 시스템에 트랜지션 구축하기](#baking-transitions-into-the-design-system)
- [세 단계](#the-three-steps)
  - [기본: 후퇴 → 스켈레톤 → 완료](#default-receded-skeleton-complete)
  - [권장: 보류 → 스켈레톤 → 완료](#preferred-pending-skeleton-complete)
  - [지연평가 요소를 `<Suspense>`로 래핑하기](#wrap-lazy-features-in-suspense)
  - [서스펜스 공개 '기차'](#suspense-reveal-train)
  - [보류 인디케이터 지연하기](#delaying-a-pending-indicator)
  - [요약](#recap)
- [기타 패턴](#other-patterns)
  - [낮은 우선순위 상태와 높은 우선순위 상태 분할하기](#splitting-high-and-low-priority-state)
  - [값 지연하기](#deferring-a-value)
  - [SuspenseList](#suspenselist)
- [다음 단계](#next-steps)

## 트랜지션 {#transitions}

Let's revisit [this demo](https://codesandbox.io/s/sparkling-field-41z4r3) from the previous page about [Suspense for Data Fetching](/docs/concurrent-mode-suspense.html).

프로필을 활성화하기 위해 "Next" 버튼을 누르면 페이지의 데이터가 바로 사라지고 전체 화면에 로딩 화면을 다시 보게 됩니다. '의도치 않은' 로딩 상태라고 할 수 있습니다. **새 화면을 위한 콘텐츠를 불러오는 동안 화면 전환을 생략할 수 있다면 좋을 것입니다.**

React는 이 문제를 해결하기 위해 새로운 `useTransition()` 내장 훅을 제공합니다.

세 단계에 걸쳐 사용할 수 있습니다.

먼저 컨커런트 모드를 사용해야 합니다. [컨커런트 모드 채택](/docs/concurrent-mode-adoption.html)에 대해서는 이후 더 많은 이야기를 나눌 것입니다. 지금은 이 기능이 작동하려면 `ReactDOM.render()` 대신 `ReactDOM.createRoot()`를 사용해야 함을 아는 것으로 충분합니다.

```js
const rootElement = document.getElementById("root");
// 컨커런트 모드로 설정
ReactDOM.createRoot(rootElement).render(<App />);
```

그 다음 React에서 `useTransition` 훅을 가져와서 사용합니다.

```js
import React, { useState, useTransition, Suspense } from "react";
```

마지막으로 `App` 컴포넌트에서 사용합니다.

```js{3-5}
function App() {
  const [resource, setResource] = useState(initialResource);
  const [isPending, startTransition] = useTransition({
    timeoutMs: 3000
  });
  // ...
```

**이 코드만으로는 아무것도 실행하지 않습니다.** 상태를 갱신하기 위해 훅의 반환 값을 사용해야 합니다. `useTransition`의 반환 값은 두가지입니다.

* `isPending`는 불리언 값입니다. 트랜지션 진행 여부를 알 수 있습니다.
* `startTransition`는 함수입니다. React에 **어떤** 상태변화를 지연하고 싶은지 지정할 수 있습니다.

바로 아래에서 사용하겠습니다.

<div class="scary">

>주의:
>
>이전 실험 릴리스 및 데모에서는 반환 값의 순서가 반대였습니다.

</div>

`useTransition` 훅에 설정 객체를 전달했다는 것을 명심하세요. `timeoutMs` 프로퍼티는 **트랜지션이 완료될 때까지 얼마나 오랫동안 기다릴 것인지** 결정합니다. `{timeoutMs: 3000}` 를 전달한다면 "다음 프로필을 불러오는 데 3초보다 오래 걸린다면 로딩 상태를 보여주고 그전까진 계속 이전 화면을 보여줘도 괜찮아"라는 의미입니다.

### setState를 트랜지션에 래핑하기 {#wrapping-setstate-in-a-transition}

"Next" 버튼 클릭 이벤트 핸들러는 현재 프로필 상태를 설정합니다.

```js{4}
<button
  onClick={() => {
    const nextUserId = getNextId(resource.userId);
    setResource(fetchProfileData(nextUserId));
  }}
>
```

위 상태 업데이트를 `startTransition` 함수로 래핑합니다. 의도하지 않은 로딩 상태 트랜지션에 **React가 이 상태 업데이트를 지연시켜도 괜찮다**고 전달하는 방법입니다.

```js{3,6}
<button
  onClick={() => {
    startTransition(() => {
      const nextUserId = getNextId(resource.userId);
      setResource(fetchProfileData(nextUserId));
    });
  }}
>
```

**[Try it on CodeSandbox](https://codesandbox.io/s/vigilant-feynman-kpjy8w)**

"Next" 버튼을 몇 번 눌러보세요. 이미 매우 다른 느낌입니다. **클릭으로 즉시 빈 화면이 보이는 대신 잠깐 이전 페이지가 지속해서 보입니다.** 데이터가 완전히 로드되면 React는 새로운 화면으로 전환합니다.

If we make our API responses take 5 seconds, [we can confirm](https://codesandbox.io/s/heuristic-leftpad-9hit59) that now React "gives up" and transitions anyway to the next screen after 3 seconds. This is because we passed `{timeoutMs: 3000}` to `useTransition()`. For example, if we passed `{timeoutMs: 60000}` instead, it would wait a whole minute.

### 지연 인디케이터 추가하기 {#adding-a-pending-indicator}

There's still something that feels broken about [our last example](https://codesandbox.io/s/vigilant-feynman-kpjy8w). Sure, it's nice not to see a "bad" loading state. **But having no indication of progress at all feels even worse!** When we click "Next", nothing happens and it feels like the app is broken.

`useTransition()` 호출은 `startTransition` 그리고 `isPending` 두 값을 반환합니다.

```js
  const [isPending, startTransition, ] = useTransition({ timeoutMs: 3000 });
```

`startTransition`는 이미 상태 갱신 부분을 래핑하는데 사용했습니다. 이제 `isPending`도 사용할 차례입니다. React가 알려주는 이 불리언값은 현재 트랜지션이 끝나기를 기다리고 있는지 알려줍니다. 이 값을 사용해서 현재 무언가 진행 중이라고 보여줄 수 있습니다.

```js{4,14}
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
    {isPending ? "Loading..." : null}
    <ProfilePage resource={resource} />
  </>
);
```

**[Try it on CodeSandbox](https://codesandbox.io/s/frosty-haslett-ds0h9h)**

이제 훨씬 나아 보이네요! 버튼을 여러 번 누르는 것은 이상하기 때문에 버튼을 클릭하면 비활성화됩니다. 그리고 사용자에게 앱이 멈추지 않았다는 것을 알려주기 위해 "Loading..."이라고 알려줍니다.

### 변화 살펴보기 {#reviewing-the-changes}

Let's take another look at all the changes we've made since the [original example](https://codesandbox.io/s/nice-shadow-zvosx0):

```js{3-5,9,11,14,19}
function App() {
  const [resource, setResource] = useState(initialResource);
  const [isPending, startTransition, ] = useTransition({
    timeoutMs: 3000
  });
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
      {isPending ? "Loading..." : null}
      <ProfilePage resource={resource} />
    </>
  );
}
```

**[Try it on CodeSandbox](https://codesandbox.io/s/frosty-haslett-ds0h9h)**

7줄의 코드만으로 트랜지션을 추가했습니다.

* `useTransition` 훅을 가져와 상태를 업데이트하는 컴포넌트에서 사용했습니다.
* `{timeoutMs: 3000}` 옵션을 전달하여 최대 3초간 이전 화면을 유지하도록 설정했습니다.
* React가 상태 갱신을 지연할 수 있도록 상태 갱신 코드를 `startTransition` 함수로 래핑했습니다.
* `isPending`을 이용하여 사용자에게 작업 상황을 알리고 버튼을 비활성화합니다.

결과적으로 "Next" 버튼을 눌러도 의도하지 않은 로딩 상태로 바로 전환되지 않고 이전 화면에서 진행 상태를 알려줍니다.

### 어디에서 갱신이 발생하나요? {#where-does-the-update-happen}

위 예시를 구현하는 것은 엄청 어렵진 않았습니다. 하지만 어떻게 이게 작동하는지에 대해서 생각하기 시작하면 약간 어지러울 수 있습니다. 상태를 설정했는데 어떻게 그 결과를 바로 볼 수 없는 걸까요? **어디에서** 다음 `<ProfilePage>` 렌더링이 어디에서 일어날까요?

두 '버전'의 `<ProfilePage>`가 동시에 존재하는 것은 명확합니다. 이전 스크린 화면에서 로딩 상태까지 보여주고 있기 때문에 이전 버전이 존재한다는 것을 알 수 있습니다. 그리고 새 버전 또한 **어디엔가** 존재한다는 것을 압니다. 왜냐하면 그것을 기다리고 있기 때문이죠!

**하지만 어떻게 두 가지 버전의 같은 컴포넌트가 동시에 존재할 수 있는 걸까요?**

이것이 컨커런트 모드의 존재 이유입니다. React의 작업은 '브랜치'의 상태 갱신과 비슷하다고 [앞서 언급했습니다](/docs/concurrent-mode-intro.html#intentional-loading-sequences). 이 개념을 잡기 위한 또 다른 방법은 `startTransition` 함수로 상태 갱신 코드를 래핑하는 것은 공상과학 영화처럼 **다른 평행 우주**에서 렌더링한다고 생각하는 것입니다. 다른 우주를 직접 "볼" 수는 없습니다. 하지만 무언가 일어나고 있다는 신호(`isPending`)를 들을 수 있습니다. 갱신이 준비되면 '우주들'이 다시 병합되고 그 결과를 화면에서 볼 수 있습니다!

[이 데모](https://codesandbox.io/s/frosty-haslett-ds0h9h)를 좀 더 가지고 놀고 무엇이 일어나는지 상상해보세요.

물론 두 버전의 트리 렌더링이 **동시에** 일어나진 않습니다. 컴퓨터의 모든 프로그램이 동시에 실행된다는 것이 허상인 것처럼요. 운영체제는 다른 애플리케이션들을 매우 빠르게 전환합니다. 비슷하게 React도 화면에 보이는 트리 버전과 다음에 노출하기 위해 "준비중"인 버전을 전환할 수 있습니다.

`useTransition` 같은 API를 사용하면 원하는 사용자 경험에 초점을 맞출 수 있고 어떻게 구현했는지 생각 하지 않아도 됩니다. `startTransition`에 래핑된 트랜지션이 "브랜치"나 "다른 세계"에서 일어난다는 비유는 이해에 도움이 될 수 있습니다.

### 트랜지션은 모든 곳에 있습니다. {#transitions-are-everywhere}

[Suspense walkthrough](/docs/concurrent-mode-suspense.html)에서 어떤 컴포넌트라도 추가적인 데이터가 필요하지만 준비되지 않았다면 언제든지 '서스펜드' 할 수 있다는 것을 배웠습니다. 중단 상태를 처리하기 위해 `<Suspense>`를 트리의 다른 부분에 전략적으로 배치할 수는 있지만 항상 충분하지는 않습니다.

하나의 프로필만 있던 [첫 번째 서스펜스 데모](https://codesandbox.io/s/frosty-hermann-bztrp)로 돌아가 봅시다. 이 예시는 오직 데이터를 한 번만 페치합니다. 서버 변경사항을 검사하기 위한 "Refresh" 버튼을 추가하겠습니다.

첫 번째 시도는 다음과 같이 생겼습니다.

```js{6-8,13-15}
const initialResource = fetchUserAndPosts();

function ProfilePage() {
  const [resource, setResource] = useState(initialResource);

  function handleRefreshClick() {
    setResource(fetchUserAndPosts());
  }

  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails resource={resource} />
      <button onClick={handleRefreshClick}>
        Refresh
      </button>
      <Suspense fallback={<h1>Loading posts...</h1>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
    </Suspense>
  );
}
```

**[Try it on CodeSandbox](https://codesandbox.io/s/trusting-brown-6hj0m0)**

이 예시에선 페이지가 로드되거나 "Refresh" 버튼을 누를 때 마다 데이터를 가져옵니다. `fetchUserAndPosts()`의 반환값을 상태에 저장하여 하위 컴포넌트들이 요청에서 가져온 데이터를 읽을 수 있게 하겠습니다.

We can see in [this example](https://codesandbox.io/s/trusting-brown-6hj0m0) that pressing "Refresh" works. The `<ProfileDetails>` and `<ProfileTimeline>` components receive a new `resource` prop that represents the fresh data, they "suspend" because we don't have a response yet, and we see the fallbacks. When the response loads, we can see the updated posts (our fake API adds them every 3 seconds).

하지만 위 경험은 자연스럽지 않습니다. 우리는 한 페이지를 브라우징하고 있었는데 버튼을 클릭한 직후에 바로 로딩 상태로 전환되어 사용자를 혼란스럽게 합니다. **이전처럼, 의도치 않은 로딩 상태를 숨기기 위해서 상태 갱신을 트랜지션에 래핑할 수 있습니다.**

```js{2-5,9-11,21}
function ProfilePage() {
  const [isPending, startTransition, ] = useTransition({
    // Wait 10 seconds before fallback
    timeoutMs: 10000
  });
  const [resource, setResource] = useState(initialResource);

  function handleRefreshClick() {
    startTransition(() => {
      setResource(fetchProfileData());
    });
  }

  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails resource={resource} />
      <button
        onClick={handleRefreshClick}
        disabled={isPending}
      >
        {isPending ? "Refreshing..." : "Refresh"}
      </button>
      <Suspense fallback={<h1>Loading posts...</h1>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
    </Suspense>
  );
}
```

**[Try it on CodeSandbox](https://codesandbox.io/s/zealous-mccarthy-fiiwu2)**

훨씬 나아 보입니다! "Refresh" 버튼을 클릭해도 우리가 브라우징하고 있는 페이지가 사라지지 않습니다. 우리는 인라인으로 뭔가 로딩되고 있다는 것을 보고 데이터가 준비된 이후에 새로운 데이터가 보입니다.

### 디자인시스템에 트랜지션 구축하기 {#baking-transitions-into-the-design-system}

이제 `useTransition`의 필요성이 **매우** 일반적이라는 걸 알 수 있습니다. 사용자가 상호작용하는 대상을 실수로 숨기지 않도록 컴포넌트를 서스펜드 상태로 만들 수 있는 대부분 버튼클릭이나 상호작용은 `useTransition`으로 래핑해야 합니다.

위 작업은 컴포넌트 사이에 많은 반복적인 코드 생산으로 이어질 수 있습니다. 이것이 **일반적으로 디자인 시스템에 `useTransition` 사용하는 것을 추천하는 이유입니다**. 예를 들어 트랜지션 로직을 커스텀 `<Button>` 컴포넌트로 추출할 수 있습니다.

```js{7-9,20,24}
function Button({ children, onClick }) {
  const [isPending, startTransition, ] = useTransition({
    timeoutMs: 10000
  });

  function handleClick() {
    startTransition(() => {
      onClick();
    });
  }

  const spinner = (
    // ...
  );

  return (
    <>
      <button
        onClick={handleClick}
        disabled={isPending}
      >
        {children}
      </button>
      {isPending ? spinner : null}
    </>
  );
}
```

**[Try it on CodeSandbox](https://codesandbox.io/s/heuristic-cerf-8bo4rk)**

명심하세요 버튼은 **어떤** 상태를 갱신하던지 관여하지 않습니다. 이것은 onClick 이벤트 핸들러에서 발생하는 모든 상태 갱신을 transition에 포함합니다. 이제 `<Button>`이 트랜지션 설정을 대신해 주기 때문에 `<ProfilePage>` 컴포넌트에 트랜지션 설정을 해줄 필요가 없습니다.

```js{4-6,11-13}
function ProfilePage() {
  const [resource, setResource] = useState(initialResource);

  function handleRefreshClick() {
    setResource(fetchProfileData());
  }

  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails resource={resource} />
      <Button onClick={handleRefreshClick}>
        Refresh
      </Button>
      <Suspense fallback={<h1>Loading posts...</h1>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
    </Suspense>
  );
}
```

**[Try it on CodeSandbox](https://codesandbox.io/s/heuristic-cerf-8bo4rk)**

버튼을 클릭하면 트랜지션이 시작되고 그 안에 `props.onClick()` 이 호출되서 `<ProfilePage>` 컴포넌트에서 `handleRefreshClick` 함수가 실행됩니다. 새로운 데이터를 가져오기 시작하지만 트랜지션 내부라서 폴백이 보여지지 않으며 'useTransition' 호출에 지정된 10초가 지나지 않았습니다. 트랜지션이 보류중인 동안 버튼에 인라인으로 로딩 인디케이터를 봅니다.

이제 컨커런트 모드가 컴포넌트의 격리 수준 및 모듈성을 희생하지 않고도 우수한 사용자 경험을 만드는지 배웠습니다. React는 트랜지션을 조정합니다.

## 세 단계 {#the-three-steps}

지금까지 갱신에 진행될 수 있는 다양한 시각적 상태를 살펴보았습니다. 이 부문에서는 상태 변화 단계에 이름을 부여하고 단계별로 어떻게 진행되는지 이야기해보겠습니다.

<br>

<img src="../images/docs/cm-steps-simple.png" alt="세 단계" />

맨 마지막 단계에 **완료** 단계가 있습니다. 최종적으로 우리가 달성하고 싶어 하는 상태입니다. 다음 화면을 전부 렌더링하고 더 로딩할 데이터가 없는 순간을 의미합니다.

화면이 완료 상태가 되기 전에 특정 데이터나 코드를 불러와야 할 수 있습니다. 다음 화면에 있지만 일부 데이터를 여전히 가져오고 있는 경우 "스켈레톤" 상태라고 말합니다.

마지막으로 스켈레톤 상태로 우리를 이끄는 주요한 두 가지 방법이 있습니다. 구체적인 예를 통해 차이점을 설명하겠습니다.

### 기본: 후퇴 → 스켈레톤 → 완료 {#default-receded-skeleton-complete}

Open [this example](https://codesandbox.io/s/xenodochial-breeze-khk2fh) and click "Open Profile". You will see several visual states one by one:

* **후퇴:** 잠깐 `<h1>Loading the app...</h1>` 폴백이 보입니다.
* **스켈레톤:** `<ProfilePage>` 컴포넌트와 내부의 `<h2>Loading posts...</h2>` 폴백이 보입니다.
* **완료:** 별도의 내부 폴백 없이 `<ProfilePage>` 가 보입니다. 모든 것이 준비되었습니다.

어떻게 후퇴와 스켈레톤 상태를 구분할 수 있을까요? 차이점은 **후퇴**상태는 '한 단계 뒤로 가기' 로 느껴지고, **스켈레톤** 상태는 더 많은 콘텐츠를 보여주기 위해서 '한 단계 앞으로 가기' 에 가까운 느낌입니다.

이 예시에선 `<HomePage>` 로 여정을 시작합니다.

```js
<Suspense fallback={...}>
  {/* previous screen */}
  <HomePage />
</Suspense>
```

클릭하면 React는 다음 화면을 렌더링하기 시작합니다.

```js
<Suspense fallback={...}>
  {/* next screen */}
  <ProfilePage>
    <ProfileDetails />
    <Suspense fallback={...}>
      <ProfileTimeline />
    </Suspense>
  </ProfilePage>
</Suspense>
```

`<ProfileDetails>` 와 `<ProfileTimeline>` 모두 렌더링에 필요한 데이터를 준비하는 동안 서스펜드됩니다.

```js{4,6}
<Suspense fallback={...}>
  {/* next screen */}
  <ProfilePage>
    <ProfileDetails /> {/* suspends! */}
    <Suspense fallback={<h2>Loading posts...</h2>}>
      <ProfileTimeline /> {/* suspends! */}
    </Suspense>
  </ProfilePage>
</Suspense>
```

컴포넌트가 서스펜드 되면 React는 가장 가까운 폴백을 표시합니다. `<ProfileDetails>`의 가장 가까운 폴백은 최상위 수준에 있습니다.

```js{2,3,7}
<Suspense fallback={
  // <ProfileDetails> 가 아직 준비되지 않아서 이 폴백이 보입니다.
  <h1>Loading the app...</h1>
}>
  {/* 다음 화면 */}
  <ProfilePage>
    <ProfileDetails /> {/* 서스펜드됩니다! */}
    <Suspense fallback={...}>
      <ProfileTimeline />
    </Suspense>
  </ProfilePage>
</Suspense>
```

최상위 수준에서 폴백되기 때문에 버튼을 클릭할 때 "한 단계 뒤로 간 느낌"이 듭니다. 이전에 유용한 콘텐츠를 보여주던 `<Suspense>` 경계는 폴백을 보여주기 위해 '후퇴'해야 합니다. 이것을 **후퇴**상태라고 부릅니다.

더 많은 데이터를 불러올 수록 React는 렌더링을 다시 시도하고 `<ProfileDetails>`는 성공적으로 렌더링됩니다. 마침내 **스켈레톤** 상태에 돌입했습니다. 몇 가지 빠졌지만 새로운 페이지가 보입니다.

```js{6,7,9}
<Suspense fallback={...}>
  {/* 다음 화면 */}
  <ProfilePage>
    <ProfileDetails />
    <Suspense fallback={
      // <ProfileTimeline> 가 아직 준비되지 않아서 이 폴백이 보입니다.
      <h2>Loading posts...</h2>
    }>
      <ProfileTimeline /> {/* 서스펜드됩니다! */}
    </Suspense>
  </ProfilePage>
</Suspense>
```

마지막으로 부족한 데이터도 준비되어 **완료** 상태가 됩니다.

이 시나리오 (Receded → Skeleton → Complete)는 가장 기본적인 형태입니다. 하지만 후퇴 상태는 아주 쾌적한 상태는 아닙니다. 왜냐하면 후퇴상태는 기존 정보를 '숨겨버리기' 때문입니다. React가 `useTransition`을 이용하여 다른 시퀀스 (**보류** → 스켈레톤 → 완료)를 선택할 수 있게 하는 이유입니다.

### 권장: 보류 → 스켈레톤 → 완료 {#preferred-pending-skeleton-complete}

`useTransition`할 때 React는 이전 화면에 '잔류'할 수 있게 합니다. 그리고 진행 인디케이터를 보여줍니다. 이걸 **보류**상태라고 부릅니다. 기존 콘텐츠가 사라지지 않고 잔류한 채로 상호작용이 가능하기 때문에 **후퇴** 상태보다 훨씬 좋게 느껴집니다.

차이를 느끼기 위해 두 예시를 비교해보세요.

* Default: [Receded → Skeleton → Complete](https://codesandbox.io/s/xenodochial-breeze-khk2fh)
* **Preferred: [Pending → Skeleton → Complete](https://codesandbox.io/s/serene-pascal-w3no1l)**

두 예시의 유일한 차이점은 첫 번째는 일반 `<button>`을 사용하지만 두 번째는 커스텀 `<Button>` 컴포넌트를 `useTransition`와 함께 사용한다는 것입니다.

### 지연평가 요소를 `<Suspense>`로 래핑하기 {#wrap-lazy-features-in-suspense}

Open [this example](https://codesandbox.io/s/crazy-browser-0tdg6m). When you press a button, you'll see the Pending state for a second before moving on. This transition feels nice and fluid.

완전 새로운 기능을 프로필 페이지에 추가할 것입니다. 한 사람에 대한 재밌는 사실 목록을 말이죠.

```js{8,13-25}
function ProfilePage({ resource }) {
  return (
    <>
      <ProfileDetails resource={resource} />
      <Suspense fallback={<h2>Loading posts...</h2>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
      <ProfileTrivia resource={resource} />
    </>
  );
}

function ProfileTrivia({ resource }) {
  const trivia = resource.trivia.read();
  return (
    <>
      <h2>Fun Facts</h2>
      <ul>
        {trivia.map(fact => (
          <li key={fact.id}>{fact.text}</li>
        ))}
      </ul>
    </>
  );
}
```

**[Try it on CodeSandbox](https://codesandbox.io/s/agitated-snowflake-m3scjk)**

이제 "Open Profile"을 누르면 뭔가 잘못됐다는걸 느낄 겁니다. 트랜지션을 수행하는 데 7초나 걸렸습니다! trivia API가 너무 느리기 때문입니다. API를 좀 더 빠르게 만들 수 없다고 가정해봅시다. 이 제약과 어떻게 사용자 경험을 개선할 수 있을까요?

If we don't want to stay in the Pending state for too long, our first instinct might be to set `timeoutMs` in `useTransition` to something smaller, like `3000`. You can try this [here](https://codesandbox.io/s/nervous-galileo-ln6pbh). This lets us escape the prolonged Pending state, but we still don't have anything useful to show!

이 문제를 해결하기 위한 더 간단한 방법이 있습니다. `<Suspense>`를 래핑해서 **트랜지션을 짧게 만드는 것 대신 트랜지션에서 느린 컴포넌트를 제외할 수 있습니다**.

```js{8,10}
function ProfilePage({ resource }) {
  return (
    <>
      <ProfileDetails resource={resource} />
      <Suspense fallback={<h2>Loading posts...</h2>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
      <Suspense fallback={<h2>Loading fun facts...</h2>}>
        <ProfileTrivia resource={resource} />
      </Suspense>
    </>
  );
}
```

**[Try it on CodeSandbox](https://codesandbox.io/s/mutable-silence-wffd1t)**

위 예시는 중요한 인사이트를 보여줍니다. React는 항상 가능한 빨리 스켈레톤 상태로 가려고 합니다. 어디에서나 긴 시간제한으로 트랜지션을 사용하더라도 React는 후퇴 상태를 피하고자 필요 이상으로 보류 상태를 유지하지 않습니다.

**일부 기능이 중요하지 않다면 `<Suspense>`로 래핑하여 나중에 불러올 수 있게 하세요.** 이렇게하면 가능한 빨리 나머지 콘텐츠를 표시할 수 있습니다. 반대로, 예시에서 `<ProfileDetails>`와 같이 일부 컴포넌트 없이 화면을 표시 할 가치가 없는 경우는 `<Suspense>`로 래핑하지 마세요. 그러면 다음 트랜지션이 준비될 때까지 "대기"합니다.

### 서스펜스 공개 "기차" {#suspense-reveal-train}

이미 다음 화면에 있을 때 때때로 다른 `<Suspense>` 경계를 '잠금 해제'하는 데 필요한 데이터가 빠르게 연속적으로 도착합니다. 예를 들어, 두 개의 서로 다른 응답이 각각 1000ms와 1050ms 후에 도착할 수 있습니다. 이미 1초 기다렸다면 50ms 더 기다릴 수 없습니다. React가 정기적으로 도착하는 "기차"와 같이 스케줄에 `<Suspense>` 경계를 표시하는 이유입니다. 이것은 레이아웃 쓰레싱 및 사용자에게 보여주는 시각적 변화의 수를 줄이기 위해 약간의 지연을 트레이드오프합니다.

You can see a demo of this [here](https://codesandbox.io/s/ecstatic-sammet-zeddc4). The "posts" and "fun facts" responses come within 100ms of each other. But React coalesces them and "reveals" their Suspense boundaries together.

### 보류 인디케이터 지연하기 {#delaying-a-pending-indicator}

`Button` 컴포넌트가 클릭 되면 즉시 보류 상태 인디케이터를 보여줍니다.

```js{2,13}
function Button({ children, onClick }) {
  const [isPending, startTransition, ] = useTransition({
    timeoutMs: 10000
  });

  // ...

  return (
    <>
      <button onClick={handleClick} disabled={isPending}>
        {children}
      </button>
      {isPending ? spinner : null}
    </>
  );
}
```

**[Try it on CodeSandbox](https://codesandbox.io/s/jolly-http-n94od0)**

이 신호는 사용자에게 뭔가 작업되고 있다고 알려줍니다. 하지만 트랜지션이 상대적으로 짧다면(500ms 이내) 너무 산만해지고 트랜지션 자체가 너무 느리게 느껴질 수 있습니다.

이에 한 가지 가능한 해결책은 **스피너 자체가** 표시되지 않도록 하는 지연하는 것입니다.

```css
.DelayedSpinner {
  animation: 0s linear 0.5s forwards makeVisible;
  visibility: hidden;
}

@keyframes makeVisible {
  to {
    visibility: visible;
  }
}
```

```js{2-4,10}
const spinner = (
  <span className="DelayedSpinner">
    {/* ... */}
  </span>
);

return (
  <>
    <button onClick={handleClick}>{children}</button>
    {isPending ? spinner : null}
  </>
);
```

**[Try it on CodeSandbox](https://codesandbox.io/s/optimistic-night-4td1me)**

With this change, even though we're in the Pending state, we don't display any indication to the user until 500ms has passed. This may not seem like much of an improvement when the API responses are slow. But compare how it feels [before](https://codesandbox.io/s/priceless-water-yw7zw4) and [after](https://codesandbox.io/s/mystifying-noether-tnxftn) when the API call is fast. Even though the rest of the code hasn't changed, suppressing a "too fast" loading state improves the perceived performance by not calling attention to the delay.

### 요약 {#recap}

지금까지 배운 가장 중요한 것들

* 기본적으로 로딩 순서는 후퇴 → 스켈레톤 → 완료 입니다.
* 후퇴 상태는 기존 콘텐츠를 숨겨버리기 때문에 좋은 인터페이스는 아닙니다.
* `useTransition`을 사용하여 보류 상태를 보여줄 수 있습니다. 다음 화면이 준비되는 동안 이전 화면을 계속 보여줍니다.
* 특정 컴포넌트가 트랜지션을 지연하는 걸 원치 않는다면 `<Suspense>` 경계를 래핑하여 회피할 수 있습니다.
* 매번 `useTransition`을 모든 컴포넌트에서 처리하지 않고 디자인 시스템에 적용해놓을 수 있습니다.

## 기타 패턴들 {#other-patterns}

트랜지션은 가장 일반적인 컨커런트모드 패턴이지만 몇 가지 유용한 패턴이 더 있습니다.

### 높은 우선순위 상태와 낮은 우선순위 상태 분할하기 {#splitting-high-and-low-priority-state}

React 컴포넌트를 설계할 때 일반적으로 "최소한 표현" 상태를 찾는 것이 좋습니다. 예를 들어 `firstName`, `lastName`, `fullName`를 전부 상태에 저장해놓기보다는 `firstName`, `lastName`만 저장해놓고 렌더링 과정에서 `fullName`을 계산하는 것이 낫습니다. 상태를 갱신할 때 실수의 여지를 없애고 다른 상태를 신경쓰지 않아도 되기 때문입니다.

그런데 컨커런트 모드에서는 다른 상태의 변수들에 데이터 '중복'을 원할 수도 있습니다. 다음 작은 애플리케이션을 생각해봅시다.

```js
const initialQuery = "Hello, world";
const initialResource = fetchTranslation(initialQuery);

function App() {
  const [query, setQuery] = useState(initialQuery);
  const [resource, setResource] = useState(initialResource);

  function handleChange(e) {
    const value = e.target.value;
    setQuery(value);
    setResource(fetchTranslation(value));
  }

  return (
    <>
      <input
        value={query}
        onChange={handleChange}
      />
      <Suspense fallback={<p>Loading...</p>}>
        <Translation resource={resource} />
      </Suspense>
    </>
  );
}

function Translation({ resource }) {
  return (
    <p>
      <b>{resource.read()}</b>
    </p>
  );
}
```

**[Try it on CodeSandbox](https://codesandbox.io/s/boring-frost-t5ijqm)**

인풋에 타이핑하면 `<Transition>` 컴포넌트는 서스펜드되고 데이터가 준비될 때까지 `<p>Loading...</p>` 폴백이 보입니다. 이상적인 형태는 아닙니다. 다음 번역을 가져오는 동안 **이전**번역을 볼 수 있다면 더 좋을 것입니다.

사실 콘솔을 열어보면 다음과 같은 경고가 보일 겁니다.

```
Warning: App triggered a user-blocking update that suspended.

The fix is to split the update into multiple parts: a user-blocking update to provide immediate feedback, and another update that triggers the bulk of the changes.

Refer to the documentation for useTransition to learn how to implement this pattern.
```

앞에서 말했듯이 일부 상태 갱신으로 컴포넌트가 서스펜드되면 해당 상태 갱신은 트랜지션으로 래핑되어야합니다. 컴포넌트에 `useTransition`을 추가해봅시다.

```js{4-6,10,13}
function App() {
  const [query, setQuery] = useState(initialQuery);
  const [resource, setResource] = useState(initialResource);
  const [isPending, startTransition, ] = useTransition({
    timeoutMs: 5000
  });

  function handleChange(e) {
    const value = e.target.value;
    startTransition(() => {
      setQuery(value);
      setResource(fetchTranslation(value));
    });
  }

  // ...

}
```

**[Try it on CodeSandbox](https://codesandbox.io/s/wizardly-swirles-476m52)**

인풋에 입력해보세요. 뭔가 잘못됐습니다! 인풋 갱신이 아주 느립니다.

첫번째 문제(트랜지션 바깥에서 서스펜드 되는 것)은 해결했습니다. 하지만 이제 트랜지션 때문에 상태 갱신이 즉각적으로 반영되지 않고 이것은 제어된 인풋을 조작하기엔 부적절합니다!

위 문제에 대한 해결책은 **상태를 두 파트로 분리하는 것입니다.** 즉각적으로 갱신되어야 하는 높은 우선순위 파트와 트랜지션에서 조금 기다려도 되는 낮은 우선순위 파트로요.

예시에서 우리는 이미 두 상태 변수를 가지고 있습니다. 입력 텍스트는 `query` 그리고 번역 정보를 `resource`에서 읽습니다. `query` 상태는 즉각적으로 반영되어야 하지만 `resource` 변화는 트랜지션을 발생시켜야 합니다. (예를 들어 새로운 번역 데이터를 가져오기 같은 동작)

즉 올바른 수정은 `setQuery`를 트랜지션 바깥에 놓고 `setResource`는 그대로 트랜지션 안에 두는 것입니다.

```js{4,5}
function handleChange(e) {
  const value = e.target.value;

  // Outside the transition (urgent)
  setQuery(value);

  startTransition(() => {
    // Inside the transition (may be delayed)
    setResource(fetchTranslation(value));
  });
}
```

**[Try it on CodeSandbox](https://codesandbox.io/s/elegant-kalam-dhlrkz)**

이 변경으로 예상대로 작동합니다. 입풋 입력은 즉각 반영되고 번역은 타이핑된 내용을 나중에 따라갑니다.

### 값 지연하기 {#deferring-a-value}

기본적으로 React는 항상 일관적인 UI를 렌더링합니다. 다음 코드를 생각해봅시다.

```js
<>
  <ProfileDetails user={user} />
  <ProfileTimeline user={user} />
</>
```

React는 화면에서 이런 컴포넌트를 볼 때마다 동일한 '사용자'의 데이터를 반영합니다. 상태 업데이트로 인해 다른 `user`가 전달되면 함께 변경되는 것을 볼 수 있습니다. 화면을 기록할 수 없고 다른 사용자의 값을 표시할 프레임을 찾을 수 없습니다. (혹시 이런 상황을 목격하시면 버그를 보고해주세요!)

React는 화면에 이런 컴포넌트를 볼 때마다 동일한 `user` 데이터를 반영합니다. 상태 갱신으로 다른 `user`가 전달되면 함께 변경되는걸 볼 수 있습니다.

대부분의 상황에선 일관적인 UI가 자연스럽습니다. 비일관적인 UI는 혼란스럽고 사용자들을 오해하게 만듭니다. (예를 들어 메신저의 '보내기' 버튼이 현재 선택된 대화 스레드에 메세지를 보내지 않는다고 생각해보세요.)

하지만 때때로 의도적인 비일관성을 도입하는 게 도움 될 때도 있습니다. 위에서 했던 것처럼 직접 '분할'할 수도 있지만, React는 이를 위해 내장 훅을 제공합니다.

```js
import { useDeferredValue } from 'react';

const deferredValue = useDeferredValue(value, {
  timeoutMs: 5000
});
```

To demonstrate this feature, we'll use [the profile switcher example](https://codesandbox.io/s/quirky-carson-vs6g0i). Click the "Next" button and notice how it takes 1 second to do a transition.

사용자 디테일 정보를 가져오는 작업이 매우 빠르고 300밀리세컨드 안쪽이라고 가정해봅시다. 현재 일관된 프로필 페이지를 표시하려면 사용자 세부 정보와 게시물이 모두 필요하기 때문에 1초간 기다려야 합니다. 하지만 세부 정보를 더 빨리 표시하려면 어떻게 해야 할까요?

일관성을 희생해서, 트랜지션을 지연시키는 컴포넌트에 부실한(오래된) 데이터를 전달할 수 있습니다. 그것이 `useDeferredValue()`가 하는 일입니다.

```js{2-4,10,11,21}
function ProfilePage({ resource }) {
  const deferredResource = useDeferredValue(resource, {
    timeoutMs: 1000
  });
  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails resource={resource} />
      <Suspense fallback={<h1>Loading posts...</h1>}>
        <ProfileTimeline
          resource={deferredResource}
          isStale={deferredResource !== resource}
        />
      </Suspense>
    </Suspense>
  );
}

function ProfileTimeline({ isStale, resource }) {
  const posts = resource.posts.read();
  return (
    <ul style={{ opacity: isStale ? 0.7 : 1 }}>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

**[Try it on CodeSandbox](https://codesandbox.io/s/dazzling-fog-o6ovhr)**

이 예시의 트레이드오프는 `<ProfileTimeline>` 이 다른 컴포넌트들과 비일관적으로 오래된 정보를 보여줄 수 있게 된다는 것입니다. "Next" 버튼을 여러 번 클릭해보면 알게 될 겁니다. 하지만 다행스럽게도 우리는 트랜지션에 드는 시간을 1000ms에서 300ms로 줄였습니다.

이런 트레이드오프가 적절한지는 상황에 달려 있습니다. 하지만 이것은 매우 편리한 도구입니다. 특히 콘텐츠 사이의 내용이 눈에 띄게 변경되지 경우에요. 사용자는 짧은 시간 동안 오래된 내용을 보고 있다는 것도 인지하지 못할 수 있습니다.

`useDeferredValue`는 데이터를 가져올 때 유용할 뿐만 아니라, 무거운 컴포넌트 트리로 상호작용이 느려지는 경우에도 도움이 됩니다(예를 들어 인풋에 타이핑할 때). 긴 요청을 지연시키는 것처럼(그리고 다른 컴포넌트가 갱신되는 동안 예전 값을 보여주고요) 렌더링에 오랜 시간이 필요한 트리에도 적용할 수 있습니다.

예를 들어 다음과 같은 필터 기능이 포함된 목록을 생각해봅시다.

```js
function App() {
  const [text, setText] = useState("hello");

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <div className="App">
      <label>
        Type into the input:{" "}
        <input value={text} onChange={handleChange} />
      </label>
      ...
      <MySlowList text={text} />
    </div>
  );
}
```

**[Try it on CodeSandbox](https://codesandbox.io/s/runtime-pine-kl2yff)**

이 예시에선 **`<MySlowList>`의 모든 아이템은 고의로 속도 저하를 유도합니다. 각 아이템은 스레드를 몇 밀리세컨드 동안 차단합니다.** 실제 애플리케이션에서는 절대 이렇게 만들진 않겠지만 최적화가 불가능한 깊은 컴포넌트 트리를 시뮬레이션하는 용도로 생각해주세요.

인풋에 타이핑하면 어떻게 버벅대는지 볼 수 있습니다. 이제 `useDeferredValue`를 추가해봅시다.

```js{3-5,18}
function App() {
  const [text, setText] = useState("hello");
  const deferredText = useDeferredValue(text, {
    timeoutMs: 5000
  });

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <div className="App">
      <label>
        Type into the input:{" "}
        <input value={text} onChange={handleChange} />
      </label>
      ...
      <MySlowList text={deferredText} />
    </div>
  );
}
```

**[Try it on CodeSandbox](https://codesandbox.io/s/charming-goldwasser-6kuh4m)**

이제 타이핑해도 덜 버벅대긴 하지만 결과가 지연되어 보입니다.

디바운싱과 비교하여 뭐가 다를까요? 우리의 예시는 고정된 지연시간(80항목들에 대해서 3ms)을 가지고, 컴퓨터가 얼마나 빠르던 지연이 발생합니다. 하지만 `useDeferredValue` 값은 렌더링에 시간이 걸리는 경우에만 '지연'됩니다. React로 인해 발생하는 최소 지연은 없습니다. 더욱 현실적인 작업량으로 지연이 사용자의 기기에 맞게 조정될 수 있습니다. 빠른 기계에서는 지연이 더 작거나 존재하지 않으며 느린 기계에서는 눈에 띄게 나타납니다. 두 경우 모두, 앱의 반응성이 유지됩니다. 이 메커니즘이 항상 지연을 발생시키며 렌더링 중 스레드를 차단하는 스로틀링이나 디바운싱에 비해 가지는 장점입니다.

응답성이 향상했더라도 이 예시는 아직 설득력이 부족합니다. 왜냐하면 컨커런트 모드에 이 예시의 주요 최적화를 놓치고 있기 때문입니다. 여전히 'useDeferredValue'(또는 'useTransition`)와 같은 기능이 네트워크를 기다리고 있는지 계산 작업이 완료되는지와 관계없이 유용하다는 점이 흥미롭습니다.

### SuspenseList {#suspenselist}

`<SuspenseList>`는 로딩 상태들을 조율하는 것과 관련된 마지막 패턴입니다.

다음 예시를 살펴봅시다.

```js{5-10}
function ProfilePage({ resource }) {
  return (
    <>
      <ProfileDetails resource={resource} />
      <Suspense fallback={<h2>Loading posts...</h2>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
      <Suspense fallback={<h2>Loading fun facts...</h2>}>
        <ProfileTrivia resource={resource} />
      </Suspense>
    </>
  );
}
```

**[Try it on CodeSandbox](https://codesandbox.io/s/hardcore-river-14ecuq)**

이 예시에서 API 호출 시간은 무작위입니다. 계속 새로고침 하다 보면 어떨 땐 포스트가 먼저 보이고 어떨 땐 재밌는 사실들이 먼저 보입니다.

재밌는 사실 응답이 먼저 도착하면 `<h2>Loading posts...</h2>` 포스트 폴백 밑의 재밌는 사실을 보게 됩니다. 재밌는 사실을 읽기 시작하는데 갑자기 포스트 응답도 도착하고 재밌는 사실들은 포스트의 밑으로 밀려납니다. 이건 자연스럽지 않습니다.

이 문제를 고치는 한 가지 방법은 두 컴포넌트 모두 같은 서스펜스 경계에 두는 것입니다.

```js
<Suspense fallback={<h2>Loading posts and fun facts...</h2>}>
  <ProfileTimeline resource={resource} />
  <ProfileTrivia resource={resource} />
</Suspense>
```

**[Try it on CodeSandbox](https://codesandbox.io/s/quirky-meadow-w1c61p)**

이 방법의 문제는 이제 **항상** 두 데이터를 가져올 때까지 기다려야 한다는 것입니다. 하지만 포스트가 먼저 도착한다면 둘 다 지연시킬 필요는 없습니다. 재밌는 사실이 나중에 로드되면 포스트 영역이 이미 잡혀 있기 때문에 갑자기 레이아웃이 밀려나지 않습니다.

Promise를 특정 방법으로 병합하는 것 같은 다른 접근법은 로딩 상태가 트리 밑의 다른 컴포넌트에 있을 때 점점 어려워집니다.

이 문제를 해결하기 위해 `SuspenseList`를 가져오겠습니다.

```js
import { SuspenseList } from 'react';
```

`<SuspenseList>`는 하위 트리에 있는 `<Suspense>`의 공개 순서를 조율합니다.

```js{3,11}
function ProfilePage({ resource }) {
  return (
    <SuspenseList revealOrder="forwards">
      <ProfileDetails resource={resource} />
      <Suspense fallback={<h2>Loading posts...</h2>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
      <Suspense fallback={<h2>Loading fun facts...</h2>}>
        <ProfileTrivia resource={resource} />
      </Suspense>
    </SuspenseList>
  );
}
```

**[Try it on CodeSandbox](https://codesandbox.io/s/empty-leaf-lp7eom)**

`revealOrder="forwards"`옵션은 내부 리스트에 인접한 `<Suspense>` 노드들은 **트리에 나타난 순서대로 '나타난다'는 것을 의미합니다. 설령 다른 순서로 데이터가 도착하더라도 말이죠. `<SuspenseList>`는 다른 흥미로운 모드도 있습니다. `"forwards"`를 `"backwards"` 나 `"together"`로 바꿔보고 어떻게 되는지 확인해보세요.

You can control how many loading states are visible at once with the `tail` prop. If we specify `tail="collapsed"`, we'll see *at most one* fallback at a time. You can play with it [here](https://codesandbox.io/s/keen-leaf-gccxd8).

`<SuspenseList>`은 React의 다른 요소들처럼 합성가능하다는 점을 상기해두세요. 예를 들어 `<SuspenseList>` 테이블을 담는 여러 `<SusepnseList>` 열을 여러개 가진 그리드를 만들 수도 있습니다.

## 다음 단계 {#next-steps}

컨커런트 모드는 강력한 UI 프로그래밍 모델과 좋은 사용자 경험 조직하는 데 도움을 주는 기본 기능들을 제공합니다.

이것은 몇 년의 연구와 개발에 걸친 결과물이지만 아직 끝나지 않았습니다. [컨커런트 모드 채택하기](/docs/concurrent-mode-adoption.html) 부문에서 어떻게 컨커런트 모드를 시작할 수 있고 어떤 것을 기대할 수 있는지 서술하겠습니다.
