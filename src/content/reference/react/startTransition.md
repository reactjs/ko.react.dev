---
title: startTransition
---

<Intro>

`startTransition`은 UI를 Blocking 않고 상태를 업데이트할 수 있게 해줍니다.

```js
startTransition(scope)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `startTransition(scope)` {/*starttransitionscope*/}

`startTransition` 함수는 상태 업데이트를 transition으로 표시할 수 있게 해줍니다.

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

[See more examples below.](#usage)

#### 매개변수 {/*parameters*/}

<<<<<<< HEAD
* `scope`: 하나 이상의 [`set` 함수](/reference/react/useState#setstate)를 호출하여 일부 state를 업데이트하는 함수입니다. React는 매개변수 없이 `scope`를 즉시 호출하고 `scope` 함수를 호출하는 동안 동기적으로 예약된 모든 state 업데이트를 transition으로 표시합니다. 이는 [non-blocking](#marking-a-state-update-as-a-non-blocking-transition)이며 [원치 않는 로딩을 표시하지 않습니다.](#preventing-unwanted-loading-indicators)
=======
* `scope`: A function that updates some state by calling one or more [`set` functions.](/reference/react/useState#setstate) React immediately calls `scope` with no arguments and marks all state updates scheduled synchronously during the `scope` function call as transitions. They will be [non-blocking](/reference/react/useTransition#marking-a-state-update-as-a-non-blocking-transition) and [will not display unwanted loading indicators.](/reference/react/useTransition#preventing-unwanted-loading-indicators)
>>>>>>> 315cb7a38a1645623fc55501429285ab680b8a6a

#### 반환 값 {/*returns*/}

`startTransition`은 아무것도 반환하지 않습니다.

#### 주의사항 {/*caveats*/}

* `startTransition`은 transition이 진행 중인지 추적할 수 있는 방법을 제공하지 않습니다. 진행 중인 transition을 표시하려면 [`useTransition`](/reference/react/useTransition)이 필요합니다.

* 해당 state의 `set` 함수에 접근할 수 있는 경우에만 업데이트를 transition으로 래핑할 수 있습니다. 일부 props이나 custom Hook 반환 값에 대한 응답으로 transition을 시작하려면 [`useDeferredValue`](/reference/react/useDeferredValue)를 대신 사용하세요.

* `startTransition`에 전달하는 함수는 동기식이어야 합니다. React는 이 함수를 즉시 실행하여 실행하는 동안 발생하는 모든 state 업데이트를 transition으로 표시합니다. 나중에 더 많은 state 업데이트를 수행하려고 하면(예시: timeout), transition으로 표시되지 않습니다.

* Transition으로 표시된 state 업데이트는 다른 state 업데이트에 의해 중단됩니다. 예를 들어, transition 내에서 차트 컴포넌트를 업데이트하지만 차트가 다시 렌더링되는 동안 입력을 시작하면 React는 입력 state 업데이트를 처리한 후 차트 컴포넌트에서 렌더링 작업을 다시 시작합니다.

* Transition 업데이트는 텍스트 입력을 제어하는 데 사용할 수 없습니다.

* 만약 진행 중인 transition이 여러 개 있는 경우, React에서는 함께 일괄 처리 합니다. 이는 향후 릴리즈에서 제거될 가능성이 높은 제한 사항입니다.

---

## 사용법 {/*usage*/}

### state 업데이트를 non-blocking transition으로 표시 {/*marking-a-state-update-as-a-non-blocking-transition*/}

`startTransition`으로 래핑함으로써 state 업데이트를 *transition*으로 표시할 수 있습니다.

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

`startTransition`은 [`useTransition`](/reference/react/useTransition)과 매우 유사하지만, transition이 진행 중인지 추적하는 `isPending` 플래그를 제공하지 않습니다. `useTransition`을 사용할 수 없을 때 `startTransition`을 호출할 수 있습니다. 예를 들어, `startTransition`은 데이터 라이브러리에서와 같이 컴포넌트 외부에서 작동합니다.

[Transition에 대한 학습 및 예제는 `useTransition` 페이지에서 확인하세요.](/reference/react/useTransition)


</Note>
