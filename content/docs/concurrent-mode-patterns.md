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

>경고
>
> 이 페이지의 내용은 **안정된 배포판에서 [사용할 수 없는](/docs/concurrent-mode-adoption.html) 실험적인 기능**입니다. 프로덕션 애플리케이션에 실험적인 React 빌드를 의존하지 마십시오. 이 기능은 React에 편입되기 전에 경고 없이 크게 변경될 수 있습니다.
>
> 이 문서는 얼리어답터와 호기심넘치는 사람들을 위해 작성되었습니다. **React 초기 입문자라면 이 기능에 신경쓰지 않아도 괜찮습니다.** -- 이 내용을 지금 당장 배울 필요는 없습니다. 데이터 패칭을 위한 튜토리얼을 찾는다면 [이 문서](https://www.robinwieruch.de/react-hooks-fetch-data/)를 보세요.

</div>

일반적으로 상태가 갱신될 때 화면의 즉각적인 변화를 기대합니다. 애플리케이션이 사용자 입력에 반응하는 것을 유지하고 싶기 때문입니다. 하지만 **화면에 나타나는 변화를 지연하고** 싶은 경우도 있습니다.

예를 들어 한 페이지에서 다른 페이지로 전환할 때 다음 화면에 필요한 코드나 데이터가 전혀 준비되어 있지 않으면 순간적으로 빈 화면에 로딩중인 모습이 보이고 답답할 수 있습니다. 이전 화면을 좀더 길게 보여주고 싶을 때도 있습니다. React에서 이런 패턴을 구현하기란 오랫동안 어려웠습니다. 컨커런트 모드는 이 문제를 해결하기 위한 새로운 도구를 제공합니다.

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
  - [서스펜스 목록](#suspenselist)
- [다음 단계](#next-steps)

## 트랜지션 {#transitions}

이전 [데이터를 가져오기 위한 서스펜스](/docs/concurrent-mode-suspense.html) 페이지의 [데모를](https://codesandbox.io/s/infallible-feather-xjtbu) 다시 살펴봅시다.

프로필을 활성화하기 위해 "Next" 버튼을 누르면 페이지의 데이터가 바로 사라지고 전체 화면에 로딩 화면을 다시 보게 됩니다. '의도치 않은' 로딩 상태라고 할 수 있습니다. **새 화면을 위한 컨텐츠를 불러오는 동안 화면 전환을 생략할 수 있다면 좋을 것입니다.**

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
  const [startTransition, isPending] = useTransition({
    timeoutMs: 3000
  });
  // ...
```

**이 코드만으로는 아무것도 실행하지 않습니다.** 상태를 갱신하기 위해 훅의 반환값을 사용해야 합니다. `useTransition`의 반환값은 두가지입니다.

* `startTransition`는 함수입니다. React에 **어떤** 상태변화를 지연하고 싶은지 지정할 수 있습니다.
* `isPending`는 불리언 값입니다. 트랜지션 진행 유무를 알 수 있습니다.

바로 아래에서 사용하겠습니다.

`useTransition` 훅에 설정 객체를 전달했다는 것을 명심하세요. `timeoutMs` 프로퍼티는 **트랜지션이 완료될 때까지 얼마나 오랫동안 기다릴 것인지** 결정합니다. `{timeoutMs: 3000}` 를 전달한다면 "다음 프로필을 불러오는데 3초보다 오래 걸린다면 로딩 상태를 보여주고 그 전까진 계속 이전 화면을 보여줘도 괜찮아" 라는 의미입니다.

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

**[CodeSandbox에서 시도해보세요](https://codesandbox.io/s/musing-driscoll-6nkie)**

"Next" 버튼을 몇 번 눌러보세요. 이미 매우 다른 느낌입니다. **클릭으로 즉시 빈 화면이 보이는 대신 잠깐동안 이전 페이지가 지속적으로 보입니다.** 데이터가 완전히 로드되면 React는 새로운 화면으로 전환합니다.

만약 API 응답까지 5초가 걸린다면 React가 이전 화면을 포기하고 3초 뒤에 다음 화면으로 어쨌든 변하는 걸 [확인할 수 있습니다](https://codesandbox.io/s/relaxed-greider-suewh). `{timeoutMs: 3000}` 설정을 `useTransition()` 훅에 전달했기 때문입니다. `{timeoutMs: 60000}`를 전달한다면 일분동안 기다릴겁니다.

### 지연 인디케이터 추가하기 {#adding-a-pending-indicator}

[마지막 예제](https://codesandbox.io/s/musing-driscoll-6nkie)에서도 여전히 망가진듯한 느낌이 있습니다. "나쁜" 로딩 상태를 보지 않는 것은 확실히 좋지만 **아무런 진행 상태를 보여주지 않는 것은 훨씬 나쁩니다!** "Next" 버튼을 클릭하고 화면에 아무런 변화가 없다면 앱이 망가진 것같다고 느낄 수 있습니다.

`useTransition()` 호출은 `startTransition` 그리고 `isPending` 두 값을 반환합니다.

```js
  const [startTransition, isPending] = useTransition({ timeoutMs: 3000 });
```

`startTransition`는 이미 상태 갱신 부분을 래핑하는데 사용했습니다. 이제 `isPending`도 사용할 차례입니다. React가 알려주는 이 불리언값은 현재 트랜지션이 끝나기를 기다리고 있는지 알려줍니다. 이 값을 사용해서 현재 무언가 진행중이라고 보여줄 수 있습니다.

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

**[CodeSandbox에서 시도해보세요](https://codesandbox.io/s/jovial-lalande-26yep)**

이제 훨씬 나아보이네요! 버튼을 여러번 누르는 것은 이상하기 때문에 버튼을 클릭하면 비활성화됩니다. 그리고 사용자에게 앱이 멈추지 않았다는 것을 알려주기 위해 "Loading..." 이라고 알려줍니다.

### 변화 살펴보기 {#reviewing-the-changes}

[원본 예제](https://codesandbox.io/s/infallible-feather-xjtbu) 이후로 변경된 모든 사항을 살펴보겠습니다.

```js{3-5,9,11,14,19}
function App() {
  const [resource, setResource] = useState(initialResource);
  const [startTransition, isPending] = useTransition({
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

**[CodeSandbox에서 시도해보세요](https://codesandbox.io/s/jovial-lalande-26yep)**

7줄의 코드만으로 트랜지션을 추가했습니다.

* `useTransition` 훅을 가져와 컴포넌트의 상태 갱신 부분에 사용했습니다.
* `{timeoutMs: 3000}` 옵션을 전달하여 최대 3초간 이전 화면을 유지하도록 설정했습니다.
* React가 상태 갱신을 지연할 수 있도록 상태 갱신 코드를 `startTransition` 함수로 래핑했습니다.
* `isPending`을 이용하여 사용자에게 작업 상황을 알리고 버튼을 비활성화합니다.


결과적으로 "Next" 버튼을 눌러도 의도하지 않은 로딩 상태로 바로 전환되지 않고 이전 화면에서 진행 상태를 알려줍니다.

### 어디에서 갱신이 발생하나요? {#where-does-the-update-happen}

위 예제를 구현하는 것은 엄청 어렵진 않았습니다. 하지만 어떻게 이게 작동하는지에 대해서 생각하기 시작하면 약간 어지러울 수 있습니다. 상태를 설정했는데 어떻게 그 결과를 바로 볼 수 없는 걸까요? **어디에서** 다음 `<ProfilePage>` 렌더링이 어디에서 일어날까요?

두 '버전'의 `<ProfilePage>`가 동시에 존재하는 것은 명확합니다. 이전 스크린 화면에서 로딩 상태까지 보여주고 있기 때문에 이전 버전이 존재한다는 것을 알 수 있습니다. 그리고 새 버전 또한 **어디엔가** 존재한다는 것을 압니다. 왜냐하면 그것을 기다리고 있기 때문이죠!

**하지만 어떻게 두 가지 버전의 같은 컴포넌트가 동시에 존재할 수 있는 걸까요?**

이것이 컨커런트 모드의 존재 이유입니다. React의 작업은 '브랜치'의 상태 갱신과 비슷하다고 [앞서 언급했습니다](/docs/concurrent-mode-intro.html#intentional-loading-sequences). 이 개념을 잡기 위한 또 다른 방법은 `startTransition` 함수로 상태 갱신 코드를 래핑하는 것은 공상과학 영화처럼 **다른 평행 우주**에서 렌더링을 한다고 생각하는 것입니다. 다른 우주를 직접 "볼" 수는 없습니다. 하지만 무언가 일어나고 있다는 신호(`isPending`)를 들을 수 있습니다. 갱신이 준비되면 '우주들'이 다시 병합되고 그 결과를 화면에서 볼 수 있습니다!

[이 데모](https://codesandbox.io/s/jovial-lalande-26yep)를 좀 더 가지고 놀고 무엇이 일어나는지 상상해보세요.

물론 두 버전의 트리 렌더링이 **동시에** 일어나진 않습니다. 컴퓨터의 모든 프로그램들이 동시에 실행된다는 것이 허상인 것처럼요. 운영체제는 다른 애플리케이션들을 매우 빠르게 전환합니다. 비슷하게 React도 화면에 보이는 트리 버전과 다음에 노출하기 위해 "준비중"인 버전을 전환할 수 있습니다.

`useTransition` 같은 API를 사용하면 원하는 사용자 경험에 초점을 맞출 수 있고 어떻게 구현했는지에 대한 생각은 하지 않아도 됩니다. `startTransition`에 래핑된 트랜지션이 "브랜치"나 "다른 세계"에서 일어난다는 비유는 이해에 도움이 될 수 있습니다.

### 트랜지션은 모든 곳에 있습니다. {#transitions-are-everywhere}

[Suspense walkthrough](/docs/concurrent-mode-suspense.html)에서 어떤 컴포넌트라도 추가적인 데이터가 필요하지만 준비되지 않았다면 언제든지 '서스펜드' 할 수 있다는 것을 배웠습니다. 중단 상태를 처리하기 위해 `<Suspense>`를 트리의 다른 부분에 전략적으로 배치할 수는 있지만 항상 충분하지는 않습니다.

하나의 프로필만 있던 [첫번째 서스펜스 데모](https://codesandbox.io/s/frosty-hermann-bztrp)로 돌아가봅시다. 이 예제는 오직 데이터를 한 번만 페치합니다. 서버 변경사항을 검사하기 위한 "Refresh" 버튼을 추가하겠습니다.

첫번째 시도는 다음과 같이 생겼습니다.

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

**[CodeSandbox에서 시도해보세요](https://codesandbox.io/s/boring-shadow-100tf)**

이 예제에선 페이지가 로드되거나 "Refresh" 버튼을 누를 때 마다 데이터를 패치합니다. `fetchUserAndPosts()`의 반환값을 상태에 저장하여 하위 컴포넌트들이 요청에서 가져온 데이터를 읽을 수 있게 하겠습니다.

[이 예제](https://codesandbox.io/s/boring-shadow-100tf)를 보면 "Refresh" 버튼을 누르는 것은 동작합니다. `<ProfileDetails>` 와 `<ProfileTimeline>` 컴포넌트들은 새로운 최신 데이터를 표현하는 `resource` 프롭을 전달받습니다. `fetchUserAndPosts` 호출 직후에 아무런 응답을 받지 못했기 때문에 컴포넌트는 바로 '서스펜드' 상태가 되고 화면에는 폴백을 보게 됩니다. 응답을 받은 뒤엔 새롭게 갱신된 포스트를 볼 수 있습니다. (우리의 목 API는 3초 마다 새로운 포스트를 추가합니다.)

하지만 위 경험은 자연스럽지 않습니다. 우리는 한 페이지를 브라우징 하고 있었는데 버튼을 클릭한 직후에 바로 로딩 상태로 전환되어 사용자를 혼란스럽게 합니다. **이전처럼, 의도치 않은 로딩 상태를 숨기기 위해서 상태 갱신을 트랜지션에 래핑할 수 있습니다:**

```js{2-5,9-11,21}
function ProfilePage() {
  const [startTransition, isPending] = useTransition({
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

**[CodeSandbox에서 시도해보세요](https://codesandbox.io/s/sleepy-field-mohzb)**

훨씬 나아 보입니다! "Refresh" 버튼을 클릭해도 우리가 브라우징하고 있는 페이지가 사라지지 않습니다. 우리는 인라인으로 뭔가 로딩되고 있다는 것을 보고 데이터가 준비된 이후에 새로운 데이터가 보여집니다.

### 디자인시스템에 트랜지션 구축하기 {#baking-transitions-into-the-design-system}

이제 `useTransition`의 필요성이 **매우** 일반적이라는 걸 알 수 있습니다. 사용자가 상호작용하는 대상을 실수로 숨기지 않도록 컴포넌트를 서스펜드 상태로 만들 수 있는 대부분 버튼클릭이나 상호작용은 `useTransition`으로 래핑해야 합니다.

위 작업은 컴포넌트 사이에 많은 반복적인 코드 생산으로 이어질 수 있습니다. 이것이 **일반적으로 디자인 시스템에 `useTransition` 사용하는 것을 추천하는 이유입니다**. 예를 들어 트랜지션 로직을 커스텀 `<Button>` 컴포넌트로 추출할 수 있습니다.

```js{7-9,20,24}
function Button({ children, onClick }) {
  const [startTransition, isPending] = useTransition({
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

**[CodeSandbox에서 시도해보세요](https://codesandbox.io/s/modest-ritchie-iufrh)**

명심하세요 버튼은 **어떤** 상태를 갱신하던지 관여하지 않습니다. 이것은 onClick 이벤트 핸들러에서 발생하는 모든 상태 갱신을 transition에 포함시킵니다. 이제 `<Button>`이 트랜지션 설정을 대신 해주기 때문에 `<ProfilePage>` 컴포넌트에 트랜지션 설정을 해줄 필요가 없습니다.

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

**[CodeSandbox에서 시도해보세요](https://codesandbox.io/s/modest-ritchie-iufrh)**

버튼을 클릭하면 트랜지션이 시작되고 그 안에 `props.onClick()` 이 호출되서 `<ProfilePage>` 컴포넌트에서 `handleRefreshClick` 함수가 실행됩니다. 새로운 데이터를 가져 오기 시작하지만 트랜지션 내부라서 폴백이 보여지지 않으며 'useTransition' 호출에 지정된 10초가 지나지 않았습니다. 트랜지션이 보류중인 동안 버튼에 인라인으로 로딩 인디케이터를 봅니다.

이제 컨커런트 모드가 구성 요소의 격리 수준 및 모듈성을 희생하지 않고도 우수한 사용자 경험을 만드는지 배웠습니다. React는 트랜지션을 조정합니다.

## 세 단계 {#the-three-steps}

지금까지 갱신에 진행될 수 있는 다양한 시각적 상태를 살펴보았습니다. 이 섹션에서는 상태 변화 단계에 이름을 부여하고 각 단계별로 어떻게 진행되는지 이야기해보겠습니다.

<br>

<img src="../images/docs/cm-steps-simple.png" alt="세 단계" />

맨 마지막 단계에 **완료** 단계가 있습니다. 최종적으로 우리가 달성하고 싶어하는 상태입니다. 다음 화면을 전부 렌더링하고 더 이상 로딩할 데이터가 없는 순간을 의미합니다.

화면이 완료 상태가 되기 전에 특정 데이터나 코드를 불러와야 할 수 있습니다. 다음 화면에 있지만 일부 데이터를 여전히 가져오고 있는 경우 "스켈레톤" 상태라고 말합니다.

마지막으로 스켈레톤 상태로 우리를 이끄는 주요한 두 가지 방법이 있습니다. 구체적인 예를 통해 차이점을 설명하겠습니다.

### 기본: 후퇴 → 스켈레톤 → 완료 {#default-receded-skeleton-complete}

[이 예제](https://codesandbox.io/s/prod-grass-g1lh5)를 열고 "Open Profile" 버튼을 클릭하세요. 여러 시각적 상태를 단계별로 볼 수 있습니다:

* **후퇴:** 잠시동안 `<h1>Loading the app...</h1>` 폴백이 보입니다.
* **스켈레톤:** `<ProfilePage>` 컴포넌트와 내부의 `<h2>Loading posts...</h2>` 폴백이 보입니다.
* **완료:** 별도의 내부 폴백 없이 `<ProfilePage>` 가 보입니다. 모든 것이 준비되었습니다.

어떻게 후퇴와 스켈레톤 상태를 구분할 수 있을까요? 차이점은 **후퇴**상태는 '한 단계 뒤로가기' 로 느껴지고, **스켈레톤** 상태는 더 많은 컨텐츠를 보여주기 위해서 '한 단계 앞으로 가기' 에 가까운 느낌입니다.

이 예제에선 `<HomePage>` 로 여정을 시작합니다:

```js
<Suspense fallback={...}>
  {/* previous screen */}
  <HomePage />
</Suspense>
```

클릭하면 React는 다음 화면을 렌더링하기 시작합니다:

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

`<ProfileDetails>` 와 `<ProfileTimeline>` 모두 렌더링에 필요한 데이터를 준비하는 동안 서스펜드됩니다:

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

컴포넌트가 서스펜드 되면 React는 가장 가까운 폴백을 표시합니다. `<ProfileDetails>`의 가장 가까운 폴백은 최상위 수준에 있습니다:

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

최상위 수준에서 폴백되기 때문에 버튼을 클릭할 때 "한 단계 뒤로 간 느낌"이 듭니다. 이전에 유용한 컨텐츠를 보여주던 `<Suspense>` 바운더리는 폴백을 보여주기 위해 '후퇴'해야 합니다. 이것을 **후퇴**상태라고 부릅니다.

더 많은 데이터를 불러올 수록 React는 렌더링을 다시 시도하고 `<ProfileDetails>`는 성공적으로 렌더링됩니다. 마침내 **스켈레톤** 상태에 돌입했습니다. 몇가지 빠졌지만 새로운 페이지가 보입니다:

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

`useTransition`할 때 React는 이전 화면에 '잔류'할 수 있게 합니다. 그리고 진행 인디케이터를 보여줍니다. 이걸 **보류**상태라고 부릅니다. 기존 컨텐츠가 사라지지 않고 잔류한 채로 상호작용이 가능하기 때문에 **후퇴** 상태보다 훨씬 좋게 느껴집니다.

차이를 느끼기 위해 두 예제를 비교해보세요:

* 기본: [후퇴 → 스켈레톤 → 완성](https://codesandbox.io/s/prod-grass-g1lh5)
* **권장: [보류 → 스켈레톤 → 완성](https://codesandbox.io/s/focused-snow-xbkvl)**

두 예제의 유일한 차이점은 첫 번째는 일반 `<button>`을 사용하지만 두 번째는 커스텀 `<Button>` 구성 요소를 `useTransition`와 함께 사용한다는 것입니다.

### 지연평가 요소를 `<Suspense>`로 래핑하기 {#wrap-lazy-features-in-suspense}

[이 예제](https://codesandbox.io/s/nameless-butterfly-fkw5q)를 열어보세요. 버튼을 누르면 페이지가 전환되기 전에 몇 초간 보류 상태가 보여집니다. 이 트랜지션은 자연스럽고 좋습니다.

완전 새로운 기능을 프로필 페이지에 추가할 것입니다. 한 사람에 대한 재밌는 사실 목록을 말이죠:

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

**[CodeSandbox에서 시도해보세요](https://codesandbox.io/s/focused-mountain-uhkzg)**

이제 "Open Profile"을 누르면 뭔가 잘못됬다는걸 느낄겁니다. 트랜지션을 수행하는데 7초나 걸렸습니다! trivia API가 너무 느리기 때문입니다. API를 좀 더 빠르게 만들 수 없다고 가정해봅시다. 이 제약을 가지고 어떻게 유저 경험을 개선할 수 있을까요?

보류 상태에 너무 오랫동안 잔류하고 싶지 않다면, 처음으로 생각나는 직관적인 방법은  `useTransition`의 `timeoutMs` 설정을 `3000`정도로 작게 만드는 것입니다. 이 방법을 [여기](https://codesandbox.io/s/practical-kowalevski-kpjg4)에서 시도해볼 수 있습니다. 너무 긴 보류 상태에서 벗어날 수는 있지만 여전히 유용한 정보를 볼 수는 없습니다!

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

**[CodeSandbox에서 시도해보세요](https://codesandbox.io/s/condescending-shape-s6694)**

위 예제는 중요한 인사이트를 보여줍니다. React는 항상 가능한 빨리 스켈레톤 상태로 가려고 합니다. 어디에서나 긴 시간제한으로 트랜지션을 사용하더라도 React는 후퇴 상태를 피하기 위해 필요 이상으로 보류 상태를 유지하지 않습니다.

**일부 기능이 중요하지 않다면 `<Suspense>`로 래핑하여 나중에 불러올 수 있게 하세요.** 이렇게하면 가능한 한 빨리 나머지 컨텐츠를 표시 할 수 있습니다. 반대로, 예제에서 `<ProfileDetails>`와 같이 일부 컴포넌트 없이 화면을 표시 할 가치가 없는 경우는 `<Suspense>`로 래핑하지 마세요. 그러면 다음 트랜지션이 준비 될 때까지 "대기"합니다.

### 서스펜스 공개 "기차" {#suspense-reveal-train}

이미 다음 화면에 있을 때 때때로 다른 `<Suspense>` 경계를 '잠금 해제'하는 데 필요한 데이터가 빠르게 연속적으로 도착합니다. 예를 들어, 두 개의 서로 다른 응답이 각각 1000ms와 1050ms 후에 도착할 수 있습니다. 이미 1초 기다렸다면 50ms 더 기다릴 수 없습니다. React가 정기적으로 도착하는 "기차"와 같이 스케줄에 `<Suspense>` 경계를 표시하는 이유입니다. 이것은 레이아웃 쓰레싱 및 사용자에게 보여주는 시각적 변화의 수를 줄이기 위해 약간의 지연을 트레이드오프합니다.

[여기에서](https://codesandbox.io/s/admiring-mendeleev-y54mk) 데모를 볼 수 있습니다. "포스트" 및 "재미있는 사실" 응답은 서로 100ms 이내에 있습니다. React는 두 응답을 통합하여 서스펜스 경계를 함께 "공개"합니다.

### 보류 인디케이터 지연하기 {#delaying-a-pending-indicator}

`Button` 컴포넌트가 클릭되면 즉시 보류 상태 인디케이터를 보여줍니다:

```js{2,13}
function Button({ children, onClick }) {
  const [startTransition, isPending] = useTransition({
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

**[CodeSandbox에서 시도해보세요](https://codesandbox.io/s/floral-thunder-iy826)**

이 신호는 유저에게 뭔가 작업되고 있다고 알려줍니다. 하지만 트랜지션이 상대적으로 짧다면(500ms 이내) 너무 산만해지고 트랜지션 자체가 너무 느리게 느껴질 수 있습니다.

이에 한 가지 가능한 해결책은 **스피너 자체가** 표시되지 않도록하는 지연하는 것입니다.

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

**[CodeSandbox에서 시도해보세요](https://codesandbox.io/s/gallant-spence-l6wbk)**

With this change, even though we're in the Pending state, we don't display any indication to the user until 500ms has passed. This may not seem like much of an improvement when the API responses are slow. But compare how it feels [before](https://codesandbox.io/s/thirsty-liskov-1ygph) and [after](https://codesandbox.io/s/hardcore-http-s18xr) when the API call is fast. Even though the rest of the code hasn't changed, suppressing a "too fast" loading state improves the perceived performance by not calling attention to the delay.

이 변경으로 보류 상태에 있더라도 500ms가 지날 때 까지 사용자에게 인디케이터가 보이지 않습니다. API 응답이 느리면 개선되지 않은 것처럼 보일 수 있습니다. 그러나 API 호출이 빠를 때 [이전 예제](https://codesandbox.io/s/thirsty-liskov-1ygph)과 [다음 예제](https://codesandbox.io/s/hardcore-http-s18xr)를 비교해보세요. 나머지 코드는 변경되지 않았지만 "너무 빠른" 로딩 상태를 억제하고 지연에 주의를 주지 않으면서 성능인식을 개선할 수 있습니다.

### 요약 {#recap}

지금까지 배운 가장 중요한 것들:

* 기본적으로 로딩 순서는 후퇴 → 스켈레톤 → 완료 입니다.
* 후퇴 상태는 기존 컨텐츠를 숨겨버리기 때문에 좋은 인터페이스는 아닙니다.
* `useTransition`을 사용하여 보류 상태를 보여줄 수 있습니다. 다음 화면이 준비되는 동안 이전 화면을 계속 보여줍니다.
* 특정 컴포넌트가 트랜지션을 지연하는걸 원치 않는다면 `<Suspense>` 경계를 래핑하여 회피할 수 있습니다.
* 매번 `useTransition`을 모든 컴포넌트에서 처리하지 않고 디자인 시스템에 적용해놓을 수 있습니다.

## 기타 패턴들 {#other-patterns}

트랜지션은 가장 일반적인 컨커런트모드 패턴이지만 몇 가지 유용한 패턴이 더 있습니다.

### 높은 우선순위 상태와 낮은 우선순위 상태 분할하기 {#splitting-high-and-low-priority-state}

When you design React components, it is usually best to find the "minimal representation" of state. For example, instead of keeping `firstName`, `lastName`, and `fullName` in state, it's usually better keep only `firstName` and `lastName`, and then calculate `fullName` during rendering. This lets us avoid mistakes where we update one state but forget the other state.

React 컴포넌트를 설계할 때 일반적으로 "최소한 표현" 상태를 찾는 것이 좋습니다. 예를 들어 `firstName`, `lastName`, `fullName`를 전부 상태에 저장해놓기 보다는 `firstName`, `lastName`만 저장해놓고 렌더링 과정에서 `fullName`을 계산하는 것이 낫습니다. 상태를 갱신할 때 실수의 여지를 없애고 다른 상태를 신경쓰지 않아도 되기 때문입니다.

그런데 컨커런트 모드에서는 다른 상태의 변수들에 데이터 '중복'을 원할 수도 있습니다. 다음 작은 앱을 생각해봅시다:

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

**[CodeSandbox에서 시도해보세요](https://codesandbox.io/s/brave-villani-ypxvf)**

인풋에 타이핑하면 `<Transition>` 컴포넌트는 서스펜드되고 데이터가 준비될 때 까지 `<p>Loading...</p>` 폴백이 보입니다. 이상적인 형태는 아닙니다. 다음 번역을 가져오는 동안 **이전**번역을 볼 수 있다면 더 좋을 것입니다.

사실 콘솔을 열어보면 다음과 같은 경고가 보일 겁니다:

```
Warning: App triggered a user-blocking update that suspended.

The fix is to split the update into multiple parts: a user-blocking update to provide immediate feedback, and another update that triggers the bulk of the changes.

Refer to the documentation for useTransition to learn how to implement this pattern.
```

앞에서 말했듯이 일부 상태 갱신으로 컴포넌트가 서스펜드되면 해당 상태 갱신은 트랜지션으로 래핑되어야합니다. 컴포넌트에 `useTransition`을 추가해봅시다:

```js{4-6,10,13}
function App() {
  const [query, setQuery] = useState(initialQuery);
  const [resource, setResource] = useState(initialResource);
  const [startTransition, isPending] = useTransition({
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

**[CodeSandbox에서 시도해보세요](https://codesandbox.io/s/zen-keldysh-rifos)**

인풋에 입력해보세요. 뭔가 잘못됬습니다! 인풋 갱신이 굉장히 느립니다.

첫번째 문제(트랜지션 바깥에서 서스펜드 되는 것)은 해결했습니다. 하지만 이제 트랜지션 때문에 상태 갱신이 즉각적으로 반영되지 않고 이것은 제어된 인풋을 조작하기엔 부적절합니다!

위 문제에 대한 해결책은 **상태를 두 파트로 분리하는 것입니다:** 즉각적으로 업데이트 되어야 하는 높은 우선순위 파트와 트랜지션에서 조금 기다려도 되는 낮은 우선순위 파트로요.

예제에서 우리는 이미 두 상태 변수를 가지고 있습니다. 입력 텍스트는 `query` 그리고 번역 정보를 `resource`에서 읽습니다. `query` 상태는 즉각적으로 반영되어야 하지만 `resource` 변화는 트랜지션을 발생시켜야 합니다. (예를들어 새로운 번역 데이터를 가져오기 같은 동작)

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

**[CodeSandbox에서 시도해보세요](https://codesandbox.io/s/lively-smoke-fdf93)**

이 변경으로 예상대로 작동합니다. 입풋 입력은 즉각 반영되고 번역은 타이핑된 내용을 나중에 따라갑니다.

### Deferring a Value {#deferring-a-value}

기본적으로 React는 항상 일관적인 UI를 렌더링합니다. 다음 코드를 생각해봅시다:

```js
<>
  <ProfileDetails user={user} />
  <ProfileTimeline user={user} />
</>
```

React guarantees that whenever we look at these components on the screen, they will reflect data from the same `user`. If a different `user` is passed down because of a state update, you would see them changing together. You can't ever record a screen and find a frame where they would show values from different `user`s. (If you ever run into a case like this, file a bug!)

React는 화면에서 이러한 구성 요소를 볼 때마다 동일한 '사용자'의 데이터를 반영합니다. 상태 업데이트로 인해 다른 `user`가 전달되면 함께 변경되는 것을 볼 수 있습니다. 화면을 기록 할 수없고 다른 사용자의 값을 표시 할 프레임을 찾을 수 없습니다. (이와 같은 경우에 버그가 있으면 버그 리포트해주세요!)

React는 화면에 이런 컴포넌트를 볼 때마다 동일한 `user` 데이터를 반영합니다. 상태 갱신으로 다른 `user`가 전달되면 함께 변경되는걸 볼 수 있습니다. 

대부분의 상황에서 말이 됩니다. 비일관적인 UI는 혼란스럽고 사용자들을 오해하게 만듭니다. (For example, it would be terrible if a messenger's Send button and the conversation picker pane "disagreed" about which thread is currently selected.)

하지만 때때로 의도적인 비일관성을 도입하는게 도움될 때도 있습니다. 위에서 했던 것 처럼 직접 '분할'할 수도 있지만 React는 이를 위해 내장 훅을 제공합니다:

```js
import { useDeferredValue } from 'react';

const deferredValue = useDeferredValue(value, {
  timeoutMs: 5000
});
```

위 기능을 보여주기 위해, [프로필 스위치 예제](https://codesandbox.io/s/musing-ramanujan-bgw2o)를 사용합니다. "Next" 버튼을 클릭하고 전환하는데 1초가 걸리는지 확인해보세요.

사용자 디테일 정보를 가져오는 작업이 매우 빠르고 300 밀리세컨드 안쪽이라고 가정해봅시다. 현재 일관된 프로필 페이지를 표시하려면 사용자 세부 정보와 게시물이 모두 필요하기 때문에 1초간 기다려야 합니다. 하지만 세부 정보를 더 빨리 표시하려면 어떻게 해야 할까요?

일관성을 희생해서, 우리는 트랜지션을 지연시키는 컴포넌트에 부실한 데이터를 전달할 수 있습니다. 그것이 `useDeferredValue()`가 하는 일입니다:

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

**[CodeSandbox에서 시도해보세요](https://codesandbox.io/s/vigorous-keller-3ed2b)**

The tradeoff we're making here is that `<ProfileTimeline>` will be inconsistent with other components and potentially show an older item. Click "Next" a few times, and you'll notice it. But thanks to that, we were able to cut down the transition time from 1000ms to 300ms.

Whether or not it's an appropriate tradeoff depends on the situation. But it's a handy tool, especially when the content doesn't change noticeably between items, and the user might not even realize they were looking at a stale version for a second.

It's worth noting that `useDeferredValue` is not *only* useful for data fetching. It also helps when an expensive component tree causes an interaction (e.g. typing in an input) to be sluggish. Just like we can "defer" a value that takes too long to fetch (and show its old value despite others components updating), we can do this with trees that take too long to render.

For example, consider a filterable list like this:

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

**[CodeSandbox에서 시도해보세요](https://codesandbox.io/s/pensive-shirley-wkp46)**

In this example, **every item in `<MySlowList>` has an artificial slowdown -- each of them blocks the thread for a few milliseconds**. We'd never do this in a real app, but this helps us simulate what can happen in a deep component tree with no single obvious place to optimize.

We can see how typing in the input causes stutter. Now let's add `useDeferredValue`:

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

**[CodeSandbox에서 시도해보세요](https://codesandbox.io/s/infallible-dewdney-9fkv9)**

Now typing has a lot less stutter -- although we pay for this by showing the results with a lag.

How is this different from debouncing? Our example has a fixed artificial delay (3ms for every one of 80 items), so there is always a delay, no matter how fast our computer is. However, the `useDeferredValue` value only "lags behind" if the rendering takes a while. There is no minimal lag imposed by React. With a more realistic workload, you can expect the lag to adjust to the user’s device. On fast machines, the lag would be smaller or non-existent, and on slow machines, it would be more noticeable. In both cases, the app would remain responsive. That’s the advantage of this mechanism over debouncing or throttling, which always impose a minimal delay and can't avoid blocking the thread while rendering.

Even though there is an improvement in responsiveness, this example isn't as compelling yet because Concurrent Mode is missing some crucial optimizations for this use case. Still, it is interesting to see that features like `useDeferredValue` (or `useTransition`) are useful regardless of whether we're waiting for network or for computational work to finish.

### SuspenseList {#suspenselist}

`<SuspenseList>` is the last pattern that's related to orchestrating loading states.

Consider this example:

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

**[CodeSandbox에서 시도해보세요](https://codesandbox.io/s/proud-tree-exg5t)**

The API call duration in this example is randomized. If you keep refreshing it, you will notice that sometimes the posts arrive first, and sometimes the "fun facts" arrive first.

This presents a problem. If the response for fun facts arrives first, we'll see the fun facts below the `<h2>Loading posts...</h2>` fallback for posts. We might start reading them, but then the *posts* response will come back, and shift all the facts down. This is jarring.

One way we could fix it is by putting them both in a single boundary:

```js
<Suspense fallback={<h2>Loading posts and fun facts...</h2>}>
  <ProfileTimeline resource={resource} />
  <ProfileTrivia resource={resource} />
</Suspense>
```

**[CodeSandbox에서 시도해보세요](https://codesandbox.io/s/currying-violet-5jsiy)**

The problem with this is that now we *always* wait for both of them to be fetched. However, if it's the *posts* that came back first, there's no reason to delay showing them. When fun facts load later, they won't shift the layout because they're already below the posts.

Other approaches to this, such as composing Promises in a special way, are increasingly difficult to pull off when the loading states are located in different components down the tree.

To solve this, we will import `SuspenseList`:

```js
import { SuspenseList } from 'react';
```

`<SuspenseList>` coordinates the "reveal order" of the closest `<Suspense>` nodes below it:

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

**[CodeSandbox에서 시도해보세요](https://codesandbox.io/s/black-wind-byilt)**

The `revealOrder="forwards"` option means that the closest `<Suspense>` nodes inside this list **will only "reveal" their content in the order they appear in the tree -- even if the data for them arrives in a different order**. `<SuspenseList>` has other interesting modes: try changing `"forwards"` to `"backwards"` or `"together"` and see what happens.

You can control how many loading states are visible at once with the `tail` prop. If we specify `tail="collapsed"`, we'll see *at most one* fallback at the time. You can play with it [here](https://codesandbox.io/s/adoring-almeida-1zzjh).

Keep in mind that `<SuspenseList>` is composable, like anything in React. For example, you can create a grid by putting several `<SuspenseList>` rows inside a `<SuspenseList>` table.

## Next Steps {#next-steps}

Concurrent Mode offers a powerful UI programming model and a set of new composable primitives to help you orchestrate delightful user experiences.

It's a result of several years of research and development, but it's not finished. In the section on [adopting Concurrent Mode](/docs/concurrent-mode-adoption.html), we'll describe how you can try it and what you can expect.
