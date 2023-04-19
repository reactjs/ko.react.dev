---
id: profiler
title: Profiler API
layout: docs
category: Reference
permalink: docs/profiler.html
---

<div class="scary">

> These docs are old and won't be updated. Go to [react.dev](https://react.dev/) for the new React docs.
> 
> These new documentation pages teach modern React:
>
> - [`<Profiler>`](https://react.dev/reference/react/Profiler)

</div>

`Profiler`는 React 애플리케이션이 렌더링하는 빈도와 렌더링 "비용"을 측정합니다.
Profiler의 목적은 [메모이제이션 같은 성능 최적화 방법](/docs/hooks-faq.html#how-to-memoize-calculations)을 활용할 수 있는 애플리케이션의 느린 부분들을 식별해내는 것입니다.

>주의
>
> 프로파일링은 약간의 오버헤드를 만들기 때문에 **[프로덕션 빌드](/docs/optimizing-performance.html#use-the-production-build)에서는 비활성화되어 있습니다.**.
>
>프로덕션에서 프로파일링을 활성화하길 원하신다면 React에서 제공하는 특별 프로덕션 빌드를 통해서 활성화하실 수 있습니다.
>다음 링크에서 이 특별 빌드에 대해서 더 읽어보실 수 있습니다 [fb.me/react-profiling](https://fb.me/react-profiling)

## 사용법 {#usage}

`Profiler`는 React 트리 내에 어디에나 추가될 수 있으며 트리의 특정 부분의 렌더링 비용을 계산해줍니다.
이는 두 가지 props를 요구합니다: `id` (문자열) 와 `onRender` 콜백 (함수)이며 React 트리 내 컴포넌트에 업데이트가 "커밋"되면 호출됩니다.

예를 들어, `Navigation` 컴포넌트와 자손 컴포넌트들을 프로파일하기 위해서는

```js{3}
render(
  <App>
    <Profiler id="Navigation" onRender={callback}>
      <Navigation {...props} />
    </Profiler>
    <Main {...props} />
  </App>
);
```

복수의 `Profiler` 컴포넌트로 애플리케이션의 다른 부분들을 계산할 수 있습니다
```js{3,6}
render(
  <App>
    <Profiler id="Navigation" onRender={callback}>
      <Navigation {...props} />
    </Profiler>
    <Profiler id="Main" onRender={callback}>
      <Main {...props} />
    </Profiler>
  </App>
);
```

`Profiler` 컴포넌트는 하위 트리의 다른 컴포넌트들을 계산하기 위해 중첩해서 사용할 수 있습니다
```js{3,5,8}
render(
  <App>
    <Profiler id="Panel" onRender={callback}>
      <Panel {...props}>
        <Profiler id="Content" onRender={callback}>
          <Content {...props} />
        </Profiler>
        <Profiler id="PreviewPane" onRender={callback}>
          <PreviewPane {...props} />
        </Profiler>
      </Panel>
    </Profiler>
  </App>
);
```

>주의사항
>
>`Profiler`는 가벼운 컴포넌트이지만 필요할 때만 사용해야 합니다. 각 Profiler는 애플리케이션에 조금의 CPU와 메모리 비용을 추가하게 됩니다.

## `onRender` 콜백 {#onrender-callback}

`Profiler`는 `onRender` 함수를 prop으로 요구합니다.
React는 프로파일 트리 내의 컴포넌트에 업데이트가 "커밋"될 때마다 이 함수를 호출합니다.
이 함수는 무엇이 렌더링 되었는지 그리고 얼마나 걸렸는지 설명하는 입력값을 받게 됩니다.

```js
function onRenderCallback(
  id, // 방금 커밋된 Profiler 트리의 "id"
  phase, // "mount" (트리가 방금 마운트가 된 경우) 혹은 "update"(트리가 리렌더링된 경우)
  actualDuration, // 커밋된 업데이트를 렌더링하는데 걸린 시간
  baseDuration, // 메모이제이션 없이 하위 트리 전체를 렌더링하는데 걸리는 예상시간 
  startTime, // React가 언제 해당 업데이트를 렌더링하기 시작했는지
  commitTime, // React가 해당 업데이트를 언제 커밋했는지
  interactions // 이 업데이트에 해당하는 상호작용들의 집합
) {
  // 렌더링 타이밍을 집합하거나 로그...
}
```

각 prop에 대해 좀 더 자세히 알아보겠습니다

* **`id: string`** - 
방금 커밋된 `Profiler` 트리의 `id` prop.
복수의 프로파일러를 사용하고 있다면 트리의 어느 부분이 커밋되엇는지 식별하는데 사용할 수 있습니다.
* **`phase: "mount" | "update"`** -
해당 트리가 방금 마운트된 건지 prop, state 혹은 hooks의 변화로 인하여 리렌더링 된 건지 식별합니다.
* **`actualDuration: number`** -
현재 업데이트에 해당하는 `Profiler`와 자손 컴포넌트들을 렌더하는데 걸린 시간
이것은 하위 트리가 얼마나 메모이제이션을 잘 활용하고 있는지를 암시합니다 (e.g. [`React.memo`](/docs/react-api.html#reactmemo), [`useMemo`](/docs/hooks-reference.html#usememo), [`shouldComponentUpdate`](/docs/hooks-faq.html#how-do-i-implement-shouldcomponentupdate)).
이상적으로 대다수의 자손 컴포넌트들은 특정 prop이 변할 경우에만 리렌더링이 필요하기 때문에 이 값은 초기 렌더링 이후에 상당 부분 감소해야 합니다.
* **`baseDuration: number`** -
`Profiler` 트리 내 개별 컴포넌트들의 가장 최근 `render` 시간의 지속기간
이 값은 렌더링 비용의 최악 케이스를 계산해줍니다(e.g. 초기 마운트 혹은 메모이제이션이 없는 트리)
* **`startTime: number`** -
React가 현재 업데이트에 대해 렌더링을 시작한 시간의 타임 스탬프.
* **`commitTime: number`** -
React가 현재 업데이트를 커밋한 시간의 타임 스탬프
이 값은 모든 프로파일러들이 공유하기 때문에 원한다면 그룹을 지을 수 있습니다.
* **`interactions: Set`** -
업데이트가 계획되었을 때 추적하고 있던 ["상호작용"](https://fb.me/react-interaction-tracing)의 집합 (e.g. `render` 혹은 `setState`가 호출되었을 때).

>주의
>
>상호작용을 추적하는 API는 아직 시험단계에 있지만, 상호작용은 업데이트의 원인을 식별하는데 사용할 수 있습니다
>
>다음의 링크에서 더 자세히 알아볼 수 있습니다 [fb.me/react-interaction-tracing](https://fb.me/react-interaction-tracing)
