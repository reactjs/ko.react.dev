---
id: concurrent-mode-patterns
title: 컨커런트 UI 패턴 (Experimental)
permalink: docs/concurrent-mode-patterns.html
prev: concurrent-mode-suspense.html
next: concurrent-mode-adoption.html
---

>경고
>
>이 페이지의 내용은 **안정된 배포판에서 [사용할 수 없는](/docs/concurrent-mode-adoption.html) 실험적인 기능**입니다. 프로덕션 애플리케이션에 실험적인 React 빌드를 의존하지 마십시오. 이 기능은 React에 편입되기 전에 경고 없이 크게 변경될 수 있습니다.
>
>이 문서는 조기수용자와 관심있는 사람들을 대상으로 작성되었습니다. React 초기 입문자라면 이 기능에 대해 신경쓰지 않아도 괜찮습니다. 이 기능을 지금 당장 배울 필요는 없습니다.

일반적으로 상태가 갱신될 때 화면의 즉각적인 변화를 기대합니다. 왜냐하면 애플리케이션이 사용자 입력에 대해 즉각적으로 반응하는 상태를 유지하고 싶기 때문입니다. 하지만 **화면에 나타나는 변화를 지연하고** 싶은 경우도 있습니다.

예를 들어 한 페이지에서 다른 페이지로 전환하고 다음 화면에 필요한 코드나 데이터가 전혀 준비되어 있지 않으면 순간적으로 빈 화면에 로딩중인 모습이 보이고 답답할 수 있습니다. 이전 화면을 좀더 길게 보여주고 싶을 수도 있습니다. React에서 이런 패턴을 구현하기란 역사적으로 어려웠습니다. 컨커런트 모드는 기존 문제를 해결하기 위한 새로운 도구를 제공합니다.

- [트랜지션](#transitions)
  - [트랜지션 사이에 setState 감싸기](#wrapping-setstate-in-a-transition)
  - [보류 상태 지시하기](#adding-a-pending-indicator)
  - [변화 살펴보기](#reviewing-the-changes)
  - [어디에서 갱신이 발생하나요?](#where-does-the-update-happen)
  - [트랜지션은 모든 곳에서 발생합니다](#transitions-are-everywhere)
  - [디자인 시스템에 트랜지션 구축하기](#baking-transitions-into-the-design-system)
- [세 단계](#the-three-steps)
  - [Default: Receded → Skeleton → Complete](#default-receded-skeleton-complete)
  - [Preferred: Pending → Skeleton → Complete](#preferred-pending-skeleton-complete)
  - [Wrap Lazy Features in `<Suspense>`](#wrap-lazy-features-in-suspense)
  - [Suspense Reveal “Train”](#suspense-reveal-train)
  - [Delaying a Pending Indicator](#delaying-a-pending-indicator)
  - [Recap](#recap)
- [기타 패턴](#other-patterns)
  - [Splitting High and Low Priority State](#splitting-high-and-low-priority-state)
  - [Deferring a Value](#deferring-a-value)
  - [SuspenseList](#suspenselist)
- [다음 단계](#next-steps)

## 트랜지션 {#transitions}

이전 [데이터 패치와 서스펜스](/docs/concurrent-mode-suspense.html) 페이지의 [데모를](https://codesandbox.io/s/infallible-feather-xjtbu) 다시 살펴봅시다.

프로필을 활성화하기 위해 "Next" 버튼을 누르면 페이지가 즉시 사라지고 페이지 전체가 로딩 상태가 됩니다. "바라지 않는" 로딩 상태라고 할 수 있습니다. **새로운 화면을 위한 컨텐츠를 불러오는 동안 즉각적인 화면 전환을 생략할 수 있다면 좋을 것입니다.**

React는 이 상황을 해결하기 위해 새로운 `useTransition()` 내장 훅을 제공합니다.

세 단계에 걸쳐 사용할 수 있습니다.

먼저 컨커런트 모드를 사용해야 합니다. [컨커런트 모드 채택](/docs/concurrent-mode-adoption.html)에 대해서는 이후 더 많은 이야기를 나눌 것입니다. 지금은 이 기능이 작동하려면 `ReactDOM.render()` 대신 `ReactDOM.createRoot()`를 사용해야 함을 아는 것 정도로 충분합니다.

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

**이 코드 자체로는 아무것도 동작하지 않습니다.** 상태를 갱신하기 위해 훅의 반환값을 사용해야 합니다. `useTransition`의 반환값은 두가지입니다.

* `startTransition`는 어떤 상태 갱신을 지연하고 싶은지 React에게 알려주는 함수입니다.
* `isPending`은 지금 트랜지션이 일어나고 있다고 React가 우리에게 알려주는 불리언 값입니다.

바로 아래에서 사용하겠습니다.

`useTransition` 훅에 설정 객체를 전달했다는 것을 명심하세요. `timeoutMs` 프로퍼티는 **얼마나 오랫동안 트랜지션이 완료될 때까지 기다릴 것인지** 결정합니다. `{timeoutMs: 3000}` 를 전달한다면 "다음 프로필을 불러오는데 3초보다 오래 걸린다면 로딩 상태를 보여주고 그 전까진 계속 이전 화면을 보여줘도 괜찮아" 라는 의미입니다.

### 트랜지션 사이에 `setState` 감싸기 {#wrapping-setstate-in-a-transition}

"Next" 버튼 클릭 이벤트 핸들러는 현재 프로필 상태를 설정합니다.

```js{4}
<button
  onClick={() => {
    const nextUserId = getNextId(resource.userId);
    setResource(fetchProfileData(nextUserId));
  }}
>
```

위 상태 업데이트를 `startTransition` 함수로 래핑합니다. 이것이 의도하지 않은 로딩 상태 전환에 대해 **React가 이 상태 업데이트를 지연시켜도 괜찮다**고 전달하는 방법입니다.

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

### 변화를 살펴보기 {#reviewing-the-changes}

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

이 전환을 추가하는데 7줄의 코드가 필요했습니다.

* `useTransition` 훅을 가져와 상태를 갱신하는 컴포넌트에서 사용했습니다.
* `{timeoutMs: 3000}` 옵션을 전달하여 최대 3초간 이전 화면을 유지하도록 설정했습니다.
* React가 상태 갱신을 지연할 수 있도록 상태 갱신 코드를 `startTransition` 함수로 래핑했습니다.
* `isPending`을 이용하여 사용자에게 작업 상황을 알리고 버튼을 비활성화합니다.

결과적으로 "Next" 버튼을 눌러도 즉각적으로 의도하지 않은 로딩 상태로 전환되지 않고 이전 화면에서 진행 상태를 알려줍니다.

### 어디에서 전환이 이루어지나요? {#where-does-the-update-happen}

위 예제를 구현하는 것은 엄청 어렵진 않았습니다. 하지만 어떻게 이게 작동하는지에 대해서 생각하기 시작하면 약간 어지러울 수 있습니다. 상태를 설정했는데 어떻게 그 결과를 바로 볼 수 없는 걸까요? **어디에서** 다음 `<ProfilePage>` 렌더링이 어디에서 일어날까요?

두 '버전'의 `<ProfilePage>`가 동시에 존재하는 것은 명확합니다. 이전 스크린 화면에서 로딩 상태까지 보여주고 있기 때문에 이전 버전이 존재한다는 것을 알 수 있습니다. 그리고 새 버전 또한 **어디엔가** 존재한다는 것을 압니다. 왜냐하면 그것을 기다리고 있기 때문이죠!

**하지만 어떻게 두 가지 버전의 같은 컴포넌트가 동시에 존재할 수 있는 걸까요?**

이것이 컨커런트 모드의 존재 이유입니다. React의 작업은 '브랜치'의 상태 갱신과 비슷하다고 [앞서 언급했습니다](/docs/concurrent-mode-intro.html#intentional-loading-sequences). 이 개념을 잡기 위한 또 다른 방법은 `startTransition` 함수로 상태 갱신 코드를 래핑하는 것은 공상과학 영화처럼 **다른 평행 우주**에서 렌더링을 한다고 생각하는 것입니다. 다른 우주를 직접 "볼" 수는 없습니다. 하지만 무언가 일어나고 있다는 신호(`isPending`)를 들을 수 있습니다. 갱신이 준비되면 '우주들'이 다시 병합되고 그 결과를 화면에서 볼 수 있습니다!

[이 데모](https://codesandbox.io/s/jovial-lalande-26yep)를 좀 더 가지고 놀고 무엇이 일어나는지 상상해보세요.

물론 두 버전의 트리 렌더링이 **동시에** 일어나진 않습니다. 컴퓨터의 모든 프로그램들이 동시에 실행된다는 것이 허상인 것처럼요. 운영체제는 다른 애플리케이션들을 매우 빠르게 전환합니다. 비슷하게 React도 화면에 보이는 트리 버전과 다음에 노출하기 위해 "준비중"인 버전을 전환할 수 있습니다.

`useTransition` 같은 API를 사용하면 원하는 사용자 경험에 초점을 맞출 수 있고 어떻게 구현했는지에 대한 생각은 하지 않아도 됩니다. 그래도 `startTransition`에 래핑된 전환이 "브랜치"나 "다른 세계"에서 일어난다는 비유는 여전히 도움이 될 수 있습니다.
An API like `useTransition` lets you focus on the desired user experience, and not think about the mechanics of how it's implemented. Still, it can be a helpful metaphor to imagine that updates wrapped in `startTransition` happen "on a branch" or "in a different world".

### 전환은 모든 곳에 있습니다. {#transitions-are-everywhere}

[Suspense walkthrough](/docs/concurrent-mode-suspense.html)에서 어떤 컴포넌트라도 추가적인 데이터가 필요하지만 준비되지 않았다면 언제든지 '서스펜드' 할 수 있다는 것을 배웠습니다. 중단 상태를 처리하기 위해 `<Suspense>`를 트리의 다른 부분에 전략적으로 배치할 수는 있지만 항상 충분하지는 않습니다.

Let's get back to our [first Suspense demo](https://codesandbox.io/s/frosty-hermann-bztrp) where there was just one profile. Currently, it fetches the data only once. We'll add a "Refresh" button to check for server updates.

Our first attempt might look like this:

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

In this example, we start data fetching at the load *and* every time you press "Refresh". We put the result of calling `fetchUserAndPosts()` into state so that components below can start reading the new data from the request we just kicked off.

We can see in [this example](https://codesandbox.io/s/boring-shadow-100tf) that pressing "Refresh" works. The `<ProfileDetails>` and `<ProfileTimeline>` components receive a new `resource` prop that represents the fresh data, they "suspend" because we don't have a response yet, and we see the fallbacks. When the response loads, we can see the updated posts (our fake API adds them every 3 seconds).

However, the experience feels really jarring. We were browsing a page, but it got replaced by a loading state right as we were interacting with it. It's disorienting. **Just like before, to avoid showing an undesirable loading state, we can wrap the state update in a transition:**

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

This feels a lot better! Clicking "Refresh" doesn't pull us away from the page we're browsing anymore. We see something is loading "inline", and when the data is ready, it's displayed.

### Baking Transitions Into the Design System {#baking-transitions-into-the-design-system}

We can now see that the need for `useTransition` is *very* common. Pretty much any button click or interaction that can lead to a component suspending needs to be wrapped in `useTransition` to avoid accidentally hiding something the user is interacting with.

This can lead to a lot of repetitive code across components. This is why **we generally recommend to bake `useTransition` into the *design system* components of your app**. For example, we can extract the transition logic into our own `<Button>` component:

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

Note that the button doesn't care *what* state we're updating. It's wrapping *any* state updates that happen during its `onClick` handler into a transition. Now that our `<Button>` takes care of setting up the transition, the `<ProfilePage>` component doesn't need to set up its own:

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

When a button gets clicked, it starts a transition and calls `props.onClick()` inside of it -- which triggers `handleRefreshClick` in the `<ProfilePage>` component. We start fetching the fresh data, but it doesn't trigger a fallback because we're inside a transition, and the 10 second timeout specified in the `useTransition` call hasn't passed yet. While a transition is pending, the button displays an inline loading indicator.

We can see now how Concurrent Mode helps us achieve a good user experience without sacrificing isolation and modularity of components. React coordinates the transition.

## The Three Steps {#the-three-steps}

By now we have discussed all of the different visual states that an update may go through. In this section, we will give them names and talk about the progression between them.

<br>

<img src="../images/docs/cm-steps-simple.png" alt="Three steps" />

At the very end, we have the **Complete** state. That's where we want to eventually get to. It represents the moment when the next screen is fully rendered and isn't loading more data.

But before our screen can be Complete, we might need to load some data or code. When we're on the next screen, but some parts of it are still loading, we call that a **Skeleton** state.

Finally, there are two primary ways that lead us to the Skeleton state. We will illustrate the difference between them with a concrete example.

### Default: Receded → Skeleton → Complete {#default-receded-skeleton-complete}

Open [this example](https://codesandbox.io/s/prod-grass-g1lh5) and click "Open Profile". You will see several visual states one by one:

* **Receded**: For a second, you will see the `<h1>Loading the app...</h1>` fallback.
* **Skeleton:** You will see the `<ProfilePage>` component with `<h2>Loading posts...</h2>` inside.
* **Complete:** You will see the `<ProfilePage>` component with no fallbacks inside. Everything was fetched.

How do we separate the Receded and the Skeleton states? The difference between them is that the **Receded** state feels like "taking a step back" to the user, while the **Skeleton** state feels like "taking a step forward" in our progress to show more content.

In this example, we started our journey on the `<HomePage>`:

```js
<Suspense fallback={...}>
  {/* previous screen */}
  <HomePage />
</Suspense>
```

After the click, React started rendering the next screen:

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

Both `<ProfileDetails>` and `<ProfileTimeline>` need data to render, so they suspend:

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

When a component suspends, React needs to show the closest fallback. But the closest fallback to `<ProfileDetails>` is at the top level:

```js{2,3,7}
<Suspense fallback={
  // We see this fallback now because of <ProfileDetails>
  <h1>Loading the app...</h1>
}>
  {/* next screen */}
  <ProfilePage>
    <ProfileDetails /> {/* suspends! */}
    <Suspense fallback={...}>
      <ProfileTimeline />
    </Suspense>
  </ProfilePage>
</Suspense>
```

This is why when we click the button, it feels like we've "taken a step back". The `<Suspense>` boundary which was previously showing useful content (`<HomePage />`) had to "recede" to showing the fallback (`<h1>Loading the app...</h1>`). We call that a **Receded** state.

As we load more data, React will retry rendering, and `<ProfileDetails>` can render successfully. Finally, we're in the **Skeleton** state. We see the new page with missing parts:

```js{6,7,9}
<Suspense fallback={...}>
  {/* next screen */}
  <ProfilePage>
    <ProfileDetails />
    <Suspense fallback={
      // We see this fallback now because of <ProfileTimeline>
      <h2>Loading posts...</h2>
    }>
      <ProfileTimeline /> {/* suspends! */}
    </Suspense>
  </ProfilePage>
</Suspense>
```

Eventually, they load too, and we get to the **Complete** state.

This scenario (Receded → Skeleton → Complete) is the default one. However, the Receded state is not very pleasant because it "hides" existing information. This is why React lets us opt into a different sequence (**Pending** → Skeleton → Complete) with `useTransition`.

### Preferred: Pending → Skeleton → Complete {#preferred-pending-skeleton-complete}

When we `useTransition`, React will let us "stay" on the previous screen -- and show a progress indicator there. We call that a **Pending** state. It feels much better than the Receded state because none of our existing content disappears, and the page stays interactive.

You can compare these two examples to feel the difference:

* Default: [Receded → Skeleton → Complete](https://codesandbox.io/s/prod-grass-g1lh5)
* **Preferred: [Pending → Skeleton → Complete](https://codesandbox.io/s/focused-snow-xbkvl)**

The only difference between these two examples is that the first uses regular `<button>`s, but the second one uses our custom `<Button>` component with `useTransition`.

### Wrap Lazy Features in `<Suspense>` {#wrap-lazy-features-in-suspense}

Open [this example](https://codesandbox.io/s/nameless-butterfly-fkw5q). When you press a button, you'll see the Pending state for a second before moving on. This transition feels nice and fluid.

We will now add a brand new feature to the profile page -- a list of fun facts about a person:

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

If you press "Open Profile" now, you can tell something is wrong. It takes whole seven seconds to make the transition now! This is because our trivia API is too slow. Let's say we can't make the API faster. How can we improve the user experience with this constraint?

If we don't want to stay in the Pending state for too long, our first instinct might be to set `timeoutMs` in `useTransition` to something smaller, like `3000`. You can try this [here](https://codesandbox.io/s/practical-kowalevski-kpjg4). This lets us escape the prolonged Pending state, but we still don't have anything useful to show!

There is a simpler way to solve this. **Instead of making the transition shorter, we can "disconnect" the slow component from the transition** by wrapping it into `<Suspense>`:

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

This reveals an important insight. React always prefers to go to the Skeleton state as soon as possible. Even if we use transitions with long timeouts everywhere, React will not stay in the Pending state for longer than necessary to avoid the Receded state.

**If some feature isn't a vital part of the next screen, wrap it in `<Suspense>` and let it load lazily.** This ensures we can show the rest of the content as soon as possible. Conversely, if a screen is *not worth showing* without some component, such as `<ProfileDetails>` in our example, do *not* wrap it in `<Suspense>`. Then the transitions will "wait" for it to be ready.

### Suspense Reveal "Train" {#suspense-reveal-train}

When we're already on the next screen, sometimes the data needed to "unlock" different `<Suspense>` boundaries arrives in quick succession. For example, two different responses might arrive after 1000ms and 1050ms, respectively. If you've already waited for a second, waiting another 50ms is not going to be perceptible. This is why React reveals `<Suspense>` boundaries on a schedule, like a "train" that arrives periodically. This trades a small delay for reducing the layout thrashing and the number of visual changes presented to the user.

You can see a demo of this [here](https://codesandbox.io/s/admiring-mendeleev-y54mk). The "posts" and "fun facts" responses come within 100ms of each other. But React coalesces them and "reveals" their Suspense boundaries together. 

### Delaying a Pending Indicator {#delaying-a-pending-indicator}

Our `Button` component will immediately show the Pending state indicator on click:

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

This signals to the user that some work is happening. However, if the transition is relatively short (less than 500ms), it might be too distracting and make the transition itself feel *slower*.

One possible solution to this is to *delay the spinner itself* from displaying:

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

### Recap {#recap}

The most important things we learned so far are:

* By default, our loading sequence is Receded → Skeleton → Complete.
* The Receded state doesn't feel very nice because it hides existing content.
* With `useTransition`, we can opt into showing a Pending state first instead. This will keep us on the previous screen while the next screen is being prepared.
* If we don't want some component to delay the transition, we can wrap it in its own `<Suspense>` boundary.
* Instead of doing `useTransition` in every other component, we can build it into our design system.

## Other Patterns {#other-patterns}

Transitions are probably the most common Concurrent Mode pattern you'll encounter, but there are a few more patterns you might find useful.

### Splitting High and Low Priority State {#splitting-high-and-low-priority-state}

When you design React components, it is usually best to find the "minimal representation" of state. For example, instead of keeping `firstName`, `lastName`, and `fullName` in state, it's usually better keep only `firstName` and `lastName`, and then calculate `fullName` during rendering. This lets us avoid mistakes where we update one state but forget the other state.

However, in Concurrent Mode there are cases where you might *want* to "duplicate" some data in different state variables. Consider this tiny translation app:

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

Notice how when you type into the input, the `<Translation>` component suspends, and we see the `<p>Loading...</p>` fallback until we get fresh results. This is not ideal. It would be better if we could see the *previous* translation for a bit while we're fetching the next one.

In fact, if we open the console, we'll see a warning:

```
Warning: App triggered a user-blocking update that suspended.

The fix is to split the update into multiple parts: a user-blocking update to provide immediate feedback, and another update that triggers the bulk of the changes.

Refer to the documentation for useTransition to learn how to implement this pattern.
```

As we mentioned earlier, if some state update causes a component to suspend, that state update should be wrapped in a transition. Let's add `useTransition` to our component:

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

Try typing into the input now. Something's wrong! The input is updating very slowly.

We've fixed the first problem (suspending outside of a transition). But now because of the transition, our state doesn't update immediately, and it can't "drive" a controlled input!

The answer to this problem **is to split the state in two parts:** a "high priority" part that updates immediately, and a "low priority" part that may wait for a transition.

In our example, we already have two state variables. The input text is in `query`, and we read the translation from `resource`. We want changes to the `query` state to happen immediately, but changes to the `resource` (i.e. fetching a new translation) should trigger a transition.

So the correct fix is to put `setQuery` (which doesn't suspend) *outside* the transition, but `setResource` (which will suspend) *inside* of it.

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

With this change, it works as expected. We can type into the input immediately, and the translation later "catches up" to what we have typed.

### Deferring a Value {#deferring-a-value}

By default, React always renders a consistent UI. Consider code like this:

```js
<>
  <ProfileDetails user={user} />
  <ProfileTimeline user={user} />
</>
```

React guarantees that whenever we look at these components on the screen, they will reflect data from the same `user`. If a different `user` is passed down because of a state update, you would see them changing together. You can't ever record a screen and find a frame where they would show values from different `user`s. (If you ever run into a case like this, file a bug!)

This makes sense in the vast majority of situations. Inconsistent UI is confusing and can mislead users. (For example, it would be terrible if a messenger's Send button and the conversation picker pane "disagreed" about which thread is currently selected.)

However, sometimes it might be helpful to intentionally introduce an inconsistency. We could do it manually by "splitting" the state like above, but React also offers a built-in Hook for this:

```js
import { useDeferredValue } from 'react';

const deferredValue = useDeferredValue(value, {
  timeoutMs: 5000
});
```

To demonstrate this feature, we'll use [the profile switcher example](https://codesandbox.io/s/musing-ramanujan-bgw2o). Click the "Next" button and notice how it takes 1 second to do a transition.

Let's say that fetching the user details is very fast and only takes 300 milliseconds. Currently, we're waiting a whole second because we need both user details and posts to display a consistent profile page. But what if we want to show the details faster?

If we're willing to sacrifice consistency, we could **pass potentially stale data to the components that delay our transition**. That's what `useDeferredValue()` lets us do:

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

Whether or not it's an appropriate tradeoff depends on the situation. But it's a handy tool, especially when the content doesn't change very visible between items, and the user might not even realize they were looking at a stale version for a second.

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
