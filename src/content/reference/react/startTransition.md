---
title: startTransition
---

<Intro>

`startTransition`을 사용하면 UI의 일부를 백그라운드에서 렌더링할 수 있습니다.

```js
startTransition(action)
```

</Intro>

<InlineToc />

---

## 레퍼런스 {/*reference*/}

### `startTransition(action)` {/*starttransition*/}

`startTransition` 함수는 State 업데이트를 Transition으로 표시할 수 있게 해줍니다.

```js {7,9}
import { startTransition } from 'react';

function TabContainer() {
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

[아래 예시를 참고하세요.](#usage)

#### 매개변수 {/*parameters*/}

* `action`: 하나 이상의 [`set` 함수](/reference/react/useState#setstate)를 호출하여 일부 State를 업데이트하는 함수입니다. React는 매개변수 없이 `action`을 즉시 호출하고 `action` 함수를 호출하는 동안 동기적으로 예약된 모든 State 업데이트를 Transition으로 표시합니다. Any async calls awaited in the `action` will be included in the transition, but currently require wrapping any `set` functions after the `await` in an additional `startTransition` (see [Troubleshooting](/reference/react/useTransition#react-doesnt-treat-my-state-update-after-await-as-a-transition)). State updates marked as Transitions will be [non-blocking](#marking-a-state-update-as-a-non-blocking-transition) and [will not display unwanted loading indicators](/reference/react/useTransition#preventing-unwanted-loading-indicators).

#### 반환값 {/*returns*/}

`startTransition`은 아무것도 반환하지 않습니다.

#### 주의 사항 {/*caveats*/}

* `startTransition`은 Transition이 대기<sup>Pending</sup> 중인지 추적할 수 있는 방법을 제공하지 않습니다. 대기 중인 Transition을 표시하려면 [`useTransition`](/reference/react/useTransition)이 필요합니다.

* 해당 State의 `set` 함수에 접근할 수 있는 경우에만 업데이트를 Transition으로 래핑할 수 있습니다. 일부 Props나 Custom Hook 반환 값에 대한 응답으로 Transition을 시작하려면 [`useDeferredValue`](/reference/react/useDeferredValue)를 대신 사용하세요.

* The function you pass to `startTransition` is called immediately, marking all state updates that happen while it executes as Transitions. If you try to perform state updates in a `setTimeout`, for example, they won't be marked as Transitions. {/*TODO*/}

* You must wrap any state updates after any async requests in another `startTransition` to mark them as Transitions. This is a known limitation that we will fix in the future (see [Troubleshooting](/reference/react/useTransition#react-doesnt-treat-my-state-update-after-await-as-a-transition)).

* Transition으로 표시된 State 업데이트는 다른 State 업데이트에 의해 중단됩니다. 예를 들어, Transition 내에서 차트 컴포넌트를 업데이트하지만 차트가 다시 렌더링되는 동안 입력을 시작하면 React는 입력 State 업데이트를 처리한 후 차트 컴포넌트에서 렌더링 작업을 다시 시작합니다.

* Transition 업데이트는 텍스트 입력을 제어하는 데 사용할 수 없습니다.

* 만약 진행 중인 Transition이 여러 개 있는 경우, React에서는 함께 일괄 처리 합니다. 이는 향후 릴리즈에서 제거될 가능성이 높은 제한 사항입니다.

---

## 사용법 {/*usage*/}

### State 업데이트를 Non-Blocking Transition으로 표시 {/*marking-a-state-update-as-a-non-blocking-transition*/}

`startTransition`으로 래핑함으로써 State 업데이트를 *Transition*으로 표시할 수 있습니다.

```js {7,9}
import { startTransition } from 'react';

function TabContainer() {
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

Transition을 사용하면 느린 장치에서도 사용자 인터페이스 업데이트의 반응성을 유지할 수 있습니다.

Transition을 사용하면 UI가 리렌더링 도중에도 반응성을 유지합니다. 예를 들어 사용자가 탭을 클릭 했다가 마음이 바뀌어 다른 탭을 클릭하면 첫 번째 리렌더링이 완료될 때 까지 기다릴 필요 없이 다른 탭을 클릭할 수 있습니다.

<Note>

`startTransition`은 [`useTransition`](/reference/react/useTransition)과 매우 유사하지만, Transition이 대기 중인지 추적하는 `isPending` 플래그를 제공하지 않습니다. `useTransition`을 사용할 수 없을 때 `startTransition`을 호출할 수 있습니다. 예를 들어, `startTransition`은 데이터 라이브러리에서와 같이 컴포넌트 외부에서 작동합니다.

[Transition에 대한 학습 및 예시는 `useTransition` 페이지에서 확인하세요.](/reference/react/useTransition)


</Note>
