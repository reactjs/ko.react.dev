---
title: <Profiler>
---

<Intro>

`<Profiler>`는 프로그래밍 방식으로 React 트리의 렌더링 성능을 측정할 수 있습니다.

```js
<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>
```

</Intro>

<InlineToc />

---

## 레퍼런스 {/*reference*/}

### `<Profiler>` {/*profiler*/}

렌더링 성능을 측정하기 위해서 컴포넌트 트리를 `<Profiler>`로 감싸줍니다.

```js
<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>
```

#### Props {/*props*/}

* `id`: 성능을 측정하는 UI 부분을 식별하기 위한 문자열입니다.
* `onRender`: 프로파일링 된 트리 내의 컴포넌트가 업데이트될 때마다 React가 호출하는 [`onRender` 콜백](#onrender-callback)입니다. 렌더링 된 내용과 소요된 시간에 대한 정보를 받고 있습니다.

#### 주의 사항 {/*caveats*/}

* 프로파일링은 추가적인 오버헤드를 더하기 때문에, **프로덕션 빌드에서는 기본적으로 비활성화가 되어있습니다.** 프로덕션 프로파일링을 사용하려면, [특정 프로덕션 빌드를 활성화](https://fb.me/react-profiling) 해야합니다.
---

### `onRender` 콜백 {/*onrender-callback*/}

React는 `onRender` 콜백을 렌더링 된 내용과 같이 호출합니다.

```js
function onRender(id, phase, actualDuration, baseDuration, startTime, commitTime) {
  // 렌더링 시간 집계 혹은 로그...
}
```

#### 매개변수 {/*onrender-parameters*/}

* `id`: 커밋된 `<Profiler>` 트리의 문자열 `id` 프로퍼티입니다. 프로파일러를 다중으로 사용하고 있는 트리 내에서 어떤 부분이 커밋 되었는지 식별할 수 있도록 해줍니다.
* `phase`: `"mount"`, `"update"` 혹은 `"nested-update"`. 트리가 최초로 마운트되었는지 또는 props, state 또는 hook의 변경으로 인해 리렌더링 되었는지 알 수 있습니다.
* `actualDuration`: 현재 업데이트에 대해 `<Profiler>`와 자식들을 렌더링하는데 소요된 시간(밀리초)입니다. 이는 하위 트리가 memoization을 얼마나 잘 사용하는지를 나타냅니다 (e.g. [`memo`](/reference/react/memo) 와 [`useMemo`](/reference/react/useMemo)). 많은 자식이 특정 props가 변경되는 경우에만 다시 리렌더링이 되어야 하므로 이상적으로는 이 값은 최초 마운트 이후에는 많이 감소해야 합니다.
* `baseDuration`: 최적화 없이 전체 `<Profiler>` 하위트리에 대해 걸리는 시간을 추정하는 소요된 시간(밀리초)입니다. 트리에 있는 각 컴포넌트의 가장 최근 렌더링 시간을 합산하여 계산됩니다. 이 값은 최악의 렌더링 비용(예: 최초 마운트 또는 memoization이 없는 트리)을 추정합니다. `actualDuration` 과 비교하여 memoization이 작동하는지 확인합니다.
* `startTime`: React가 현재 업데이트 렌더링을 시작한 시점에 대한 숫자 타임스탬프입니다.
* `commitTime`: React가 현재 업데이트를 커밋한 시점에 대한 숫자 타임스탬프입니다. 이 값은 커밋된 모든 프로파일러 간에 공유되므로 원하는 경우 그룹화할 수 있습니다.

---

## 사용법 {/*usage*/}

### 프로그래밍 방식으로 렌더링 성능 측정 {/*measuring-rendering-performance-programmatically*/}

React 트리를 `<Profiler>` 컴포넌트로 감싸서 렌더링 성능을 측정합니다.

```js {2,4}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <PageContent />
</App>
```

트리 내의 컴포넌트가 업데이트를 커밋할 때마다 React가 호출하는 `id`(문자열)와 `onRender` 콜백(함수), 두 개의 props가 요구됩니다.

<Pitfall>

프로파일링은 추가적인 오버헤드를 더하기 때문에, **프로덕션 빌드에서는 기본적으로 비활성화가 되어있습니다.** 프로덕션 프로파일링을 사용하려면, [특정 프로덕션 빌드를 활성화](https://fb.me/react-profiling)해야 합니다.

</Pitfall>

<Note>

`<Profiler>`는 프로그래밍 방식으로 측정값들을 모아줍니다. 상호작용할 수 있는 프로파일러를 찾고 있다면, [React Developer Tools](/learn/react-developer-tools)의 프로파일러 탭을 사용해 보세요. 브라우저 확장 프로그램으로써 유사한 기능을 제공합니다.

</Note>

---

### 애플리케이션의 부분별 측정 {/*measuring-different-parts-of-the-application*/}

`<Profiler>` 컴포넌트들을 다중으로 사용하여 애플리케이션의 부분별로 측정할 수 있습니다.

```js {5,7}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <Profiler id="Content" onRender={onRender}>
    <Content />
  </Profiler>
</App>
```

`<Profiler>` 컴포넌트들을 중첩해서 사용할 수 있습니다.

```js {5,7,9,12}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <Profiler id="Content" onRender={onRender}>
    <Content>
      <Profiler id="Editor" onRender={onRender}>
        <Editor />
      </Profiler>
      <Preview />
    </Content>
  </Profiler>
</App>
```

`<Profiler>`는 가벼운 컴포넌트이지만 사용할 때마다 애플리케이션에 약간의 CPU 및 메모리 오버헤드가 추가되기 때문에 필요할 때만 사용해야 합니다. 

---

