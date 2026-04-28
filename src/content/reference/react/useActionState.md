---
title: useActionState
---

<Intro>

`useActionState`는 [Action](/reference/react/useTransition#functions-called-in-starttransition-are-called-actions)을 사용해 사이드 이펙트를 동반한 상태 업데이트를 할 수 있게 해주는 React Hook입니다.

```js
const [state, dispatchAction, isPending] = useActionState(reducerAction, initialState, permalink?);
```

</Intro>

<InlineToc />

---

## 레퍼런스 {/*reference*/}

### `useActionState(reducerAction, initialState, permalink?)` {/*useactionstate*/}

컴포넌트의 최상위 레벨에서 `useActionState`를 호출하여 Action의 결과에 대한 상태를 생성합니다.

```js
import { useActionState } from 'react';

function reducerAction(previousState, actionPayload) {
  // ...
}

function MyCart({initialState}) {
  const [state, dispatchAction, isPending] = useActionState(reducerAction, initialState);
  // ...
}
```

[아래에서 더 많은 예시를 확인하세요.](#usage)

#### 매개변수 {/*parameters*/}

* `reducerAction`: Action이 트리거될 때 호출될 함수입니다. 호출될 때 첫 번째 인수로 이전 상태(초기에는 제공한 `initialState`, 이후에는 이전 반환값)를 받고, 두 번째 인수로 `dispatchAction`에 전달된 `actionPayload`를 받습니다.
* `initialState`: 상태의 초깃값입니다. React는 `dispatchAction`이 처음 호출된 이후에는 이 인수를 무시합니다.
* **선택 사항** `permalink`: 이 폼이 수정하는 고유한 페이지 URL을 포함하는 문자열입니다.
  * 점진적 향상(progressive enhancement)과 함께 [React Server Components](/reference/rsc/server-components)를 사용하는 페이지에서 사용하기 위한 용도입니다.
  * `reducerAction`이 [Server Function](/reference/rsc/server-functions)이고 JavaScript 번들이 로드되기 전에 폼이 제출되면, 브라우저는 현재 페이지의 URL이 아닌 지정된 permalink URL로 이동합니다.

#### 반환값 {/*returns*/}

`useActionState`는 정확히 세 개의 값을 가진 배열을 반환합니다.

1. 현재 상태. 첫 번째 렌더링 중에는 전달한 `initialState`와 일치합니다. `dispatchAction`이 호출된 후에는 `reducerAction`이 반환한 값과 일치하게 됩니다.
2. [Actions](/reference/react/useTransition#functions-called-in-starttransition-are-called-actions) 내부에서 호출하는 `dispatchAction` 함수.
3. 이 Hook에 대해 디스패치된 Action이 대기 중(pending)인지 알려주는 `isPending` 플래그.

#### 주의 사항 {/*caveats*/}

* `useActionState`는 Hook이므로 **컴포넌트의 최상위 레벨** 또는 직접 만든 커스텀 Hook 안에서만 호출할 수 있습니다. 반복문이나 조건문 내부에서는 호출할 수 없습니다. 필요하다면 새 컴포넌트를 추출하여 상태를 그 안으로 옮기세요.
* React는 `dispatchAction`에 대한 여러 호출을 차례대로 큐에 넣고 실행합니다. `reducerAction`의 각 호출은 이전 호출의 결과를 받습니다.
* `dispatchAction` 함수는 안정적인 식별자를 가집니다. 따라서 Effect 의존성 배열에서 생략되는 경우가 많지만, 포함하더라도 Effect가 실행되지는 않습니다. 린터가 오류 없이 의존성을 생략할 수 있게 해준다면 생략하는 것이 안전합니다. [Effect 의존성 제거에 대해 더 알아보기](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect).
* `permalink` 옵션을 사용할 때, 대상 페이지에도 동일한 폼 컴포넌트(동일한 `reducerAction`과 `permalink` 포함)가 렌더링되어 React가 상태를 전달하는 방법을 알 수 있도록 해야 합니다. 페이지가 상호작용 가능해지면 이 매개변수는 아무런 영향을 미치지 않습니다.
* Server Functions를 사용할 때, `initialState`는 [직렬화 가능(serializable)](/reference/rsc/use-server#serializable-parameters-and-return-values)해야 합니다(일반 객체, 배열, 문자열, 숫자와 같은 값).
* `dispatchAction`이 오류를 던지면, React는 대기 중인 모든 Action을 취소하고 가장 가까운 [Error Boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary)를 표시합니다.
* 진행 중인 Action이 여러 개 있는 경우, React는 이들을 일괄 처리(batch)합니다. 이는 향후 릴리스에서 제거될 수 있는 한계점입니다.

<Note>

`dispatchAction`은 반드시 Action 안에서 호출되어야 합니다.

[`startTransition`](/reference/react/startTransition)으로 감싸거나, [Action prop](/reference/react/useTransition#exposing-action-props-from-components)으로 전달할 수 있습니다. 해당 스코프 밖에서 호출하면 Transition의 일부로 취급되지 않으며 개발 모드에서 [에러 로그를 남깁니다](#async-function-outside-transition).

</Note>

---

### `reducerAction` 함수 {/*reduceraction*/}

`useActionState`에 전달된 `reducerAction` 함수는 이전 상태를 받고 새로운 상태를 반환합니다.

`useReducer`의 리듀서와는 달리 `reducerAction`은 비동기적일 수 있으며 사이드 이펙트를 수행할 수 있습니다.

```js
async function reducerAction(previousState, actionPayload) {
  const newState = await post(actionPayload);
  return newState;
}
```

`dispatchAction`을 호출할 때마다 React는 `actionPayload`와 함께 `reducerAction`을 호출합니다. 리듀서는 데이터를 게시(posting)하는 등의 사이드 이펙트를 수행하고 새 상태를 반환합니다. `dispatchAction`이 여러 번 호출되면 React는 이를 순서대로 큐에 넣고 실행하여 이전 호출의 결과가 현재 호출의 `previousState`로 전달되도록 합니다.

#### 매개변수 {/*reduceraction-parameters*/}

* `previousState`: 마지막 상태입니다. 처음에는 `initialState`와 동일합니다. `dispatchAction`이 처음 호출된 이후에는 마지막으로 반환된 상태와 같아집니다.

* **선택 사항** `actionPayload`: `dispatchAction`에 전달된 인수입니다. 어떤 타입의 값이든 될 수 있습니다. `useReducer`의 관례와 유사하게 일반적으로 Action을 식별하는 `type` 프로퍼티와 추가 정보가 담긴 선택적 프로퍼티를 가진 객체입니다.

#### 반환값 {/*reduceraction-returns*/}

`reducerAction`은 새 상태를 반환하고 해당 상태로 리렌더링하기 위한 Transition을 트리거합니다.

#### 주의 사항 {/*reduceraction-caveats*/}

* `reducerAction`은 동기적일 수도 있고 비동기적일 수도 있습니다. 알림을 표시하는 등의 동기적 Action이나 서버에 업데이트를 게시하는 등의 비동기적 Action을 수행할 수 있습니다.
* `reducerAction`은 사이드 이펙트를 허용하도록 설계되었기 때문에 `<StrictMode>`에서 두 번 호출되지 않습니다.
* `reducerAction`의 반환 타입은 `initialState`의 타입과 일치해야 합니다. TypeScript가 불일치를 추론할 경우, 상태 타입을 명시적으로 지정해야 할 수도 있습니다.
* `reducerAction`의 `await` 이후에 상태를 설정하는 경우, 현재는 상태 업데이트를 추가적인 `startTransition`으로 감싸야 합니다. 자세한 정보는 [startTransition](/reference/react/useTransition#react-doesnt-treat-my-state-update-after-await-as-a-transition) 문서를 참고하세요.
* Server Functions를 사용할 때, `actionPayload`는 [직렬화 가능(serializable)](/reference/rsc/use-server#serializable-parameters-and-return-values)해야 합니다(일반 객체, 배열, 문자열, 숫자와 같은 값).

<DeepDive>

#### 왜 `reducerAction`이라고 부르나요? {/*why-is-it-called-reduceraction*/}

`useActionState`에 전달된 함수는 다음과 같은 이유로 *reducer action*이라고 불립니다.

- `useReducer`와 같이 이전 상태를 새로운 상태로 *축소(reduce)*하기 때문입니다.
- Transition 내부에서 호출되고 사이드 이펙트를 수행할 수 있는 *Action*이기 때문입니다.

개념적으로 `useActionState`는 `useReducer`와 같지만 리듀서 안에서 사이드 이펙트를 수행할 수 있다는 점이 다릅니다.

</DeepDive>

---

## 사용법 {/*usage*/}

### Action에 상태 추가하기 {/*adding-state-to-an-action*/}

컴포넌트의 최상위 레벨에서 `useActionState`를 호출하여 Action의 결과에 대한 상태를 생성하세요.

```js [[1, 7, "count"], [2, 7, "dispatchAction"], [3, 7, "isPending"]]
import { useActionState } from 'react';

async function addToCartAction(prevCount) {
  // ...
}
function Counter() {
  const [count, dispatchAction, isPending] = useActionState(addToCartAction, 0);

  // ...
}
```

`useActionState`는 정확히 세 개의 항목이 포함된 배열을 반환합니다.

1. 제공한 초기 상태로 설정된 <CodeStep step={1}>현재 상태</CodeStep>.
2. `reducerAction`을 트리거할 수 있게 해주는 <CodeStep step={2}>Action 디스패처</CodeStep>.
3. Action이 진행 중인지 알려주는 <CodeStep step={3}>보류 상태(pending state)</CodeStep>.

`addToCartAction`을 호출하려면 <CodeStep step={2}>Action 디스패처</CodeStep>를 호출하세요. React는 이전 개수와 함께 `addToCartAction` 호출을 큐에 넣습니다.

<Sandpack>

```js src/App.js
import { useActionState, startTransition } from 'react';
import { addToCart } from './api';
import Total from './Total';

export default function Checkout() {
  const [count, dispatchAction, isPending] = useActionState(async (prevCount) => {
    return await addToCart(prevCount)
  }, 0);

  function handleClick() {
    startTransition(() => {
      dispatchAction();
    });
  }

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <div className="row">
        <span>Eras Tour Tickets</span>
        <span>Qty: {count}</span>
      </div>
      <div className="row">
        <button onClick={handleClick}>Add Ticket{isPending ? ' 🌀' : '  '}</button>
      </div>
      <hr />
      <Total quantity={count} />
    </div>
  );
}
```

```js src/Total.js
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

export default function Total({quantity}) {
  return (
    <div className="row total">
      <span>Total</span>
      <span>{formatter.format(quantity * 9999)}</span>
    </div>
  );
}
```

```js src/api.js
export async function addToCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return count + 1;
}

export async function removeFromCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return Math.max(0, count - 1);
}
```

```css
.checkout {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: system-ui;
}

.checkout h2 {
  margin: 0 0 8px 0;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.row button {
  margin-left: auto;
  min-width: 150px;
}

.total {
  font-weight: bold;
}

hr {
  width: 100%;
  border: none;
  border-top: 1px solid #ccc;
  margin: 4px 0;
}

button {
  padding: 8px 16px;
  cursor: pointer;
}
```

</Sandpack>

"Add Ticket"을 클릭할 때마다 React는 `addToCartAction` 호출을 대기열에 넣습니다. React는 모든 티켓이 추가될 때까지 보류 상태를 표시하고, 최종 상태로 리렌더링을 진행합니다.

<DeepDive>

#### `useActionState` 큐잉(Queuing) 방식 {/*how-useactionstate-queuing-works*/}

"Add Ticket"을 여러 번 클릭해 보세요. 클릭할 때마다 새로운 `addToCartAction`이 큐에 쌓입니다. 인위적인 1초의 지연 시간이 있으므로 4번 클릭하면 완료하는 데 약 4초가 걸립니다.

**이는 `useActionState` 설계상 의도된 동작입니다.**

React는 다음 `addToCartAction` 호출에 `prevCount`를 전달하기 위해 이전 `addToCartAction`의 결과를 기다려야 합니다. 즉, 다음 Action을 호출하기 전에 이전 Action이 끝날 때까지 기다려야 합니다.

일반적으로 [useOptimistic과 함께 사용하여](#using-with-useoptimistic) 이 문제를 해결할 수 있지만, 더 복잡한 경우에는 [대기 중인 Action 취소하기](#cancelling-queued-actions)를 고려하거나 `useActionState`를 사용하지 않는 것을 고려해 볼 수 있습니다.

</DeepDive>

---

### 여러 Action 타입 사용하기 {/*using-multiple-action-types*/}

여러 타입을 처리하기 위해 `dispatchAction`에 인수를 전달할 수 있습니다.

관례상 보통 switch 문으로 작성합니다. switch의 각 case에서 다음 상태를 계산하고 반환합니다. 인수는 어떤 형태든 가질 수 있지만 Action을 식별하는 `type` 프로퍼티를 가진 객체를 전달하는 것이 일반적입니다.

<Sandpack>

```js src/App.js
import { useActionState, startTransition } from 'react';
import { addToCart, removeFromCart } from './api';
import Total from './Total';

export default function Checkout() {
  const [count, dispatchAction, isPending] = useActionState(updateCartAction, 0);

  function handleAdd() {
    startTransition(() => {
      dispatchAction({ type: 'ADD' });
    });
  }

  function handleRemove() {
    startTransition(() => {
      dispatchAction({ type: 'REMOVE' });
    });
  }

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <div className="row">
        <span>Eras Tour Tickets</span>
        <span className="stepper">
          <span className="qty">{isPending ? '🌀' : count}</span>
          <span className="buttons">
            <button onClick={handleAdd}>▲</button>
            <button onClick={handleRemove}>▼</button>
          </span>
        </span>
      </div>
      <hr />
      <Total quantity={count} isPending={isPending}/>
    </div>
  );
}

async function updateCartAction(prevCount, actionPayload) {
  switch (actionPayload.type) {
    case 'ADD': {
      return await addToCart(prevCount);
    }
    case 'REMOVE': {
      return await removeFromCart(prevCount);
    }
  }
  return prevCount;
}
```

```js src/Total.js
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

export default function Total({quantity, isPending}) {
  return (
    <div className="row total">
      <span>Total</span>
      {isPending ? '🌀 Updating...' : formatter.format(quantity * 9999)}
    </div>
  );
}
```

```js src/api.js hidden
export async function addToCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return count + 1;
}

export async function removeFromCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return Math.max(0, count - 1);
}
```

```css
.checkout {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: system-ui;
}

.checkout h2 {
  margin: 0 0 8px 0;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stepper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty {
  min-width: 20px;
  text-align: center;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.buttons button {
  padding: 0 8px;
  font-size: 10px;
  line-height: 1.2;
  cursor: pointer;
}

.pending {
  width: 20px;
  text-align: center;
}

.total {
  font-weight: bold;
}

hr {
  width: 100%;
  border: none;
  border-top: 1px solid #ccc;
  margin: 4px 0;
}
```

</Sandpack>

수량을 늘리거나 줄이기 위해 클릭하면 `"ADD"` 또는 `"REMOVE"`가 디스패치됩니다. `reducerAction` 내에서 수량을 업데이트하기 위해 각각 다른 API가 호출됩니다.

이 예시에서는 Action의 보류 상태(pending state)를 사용하여 수량과 총합을 대체하고 있습니다. 수량을 즉시 업데이트하는 등 즉각적인 피드백을 제공하려면 `useOptimistic`을 사용할 수 있습니다.

<DeepDive>

#### `useActionState`는 `useReducer`와 어떻게 다른가요? {/*useactionstate-vs-usereducer*/}

이 예시가 `useReducer`와 매우 비슷해 보일 수 있지만 그 목적이 다릅니다.

- UI의 상태를 관리하려면 **`useReducer`를 사용하세요**. 리듀서는 순수(pure)해야 합니다.

- Action의 상태를 관리하려면 **`useActionState`를 사용하세요**. 리듀서는 사이드 이펙트를 수행할 수 있습니다.

`useActionState`는 사용자 Action으로 인한 사이드 이펙트를 처리하기 위한 `useReducer`라고 생각할 수 있습니다. 이전 Action을 기반으로 다음 실행할 Action을 계산하기 때문에 [호출을 차례대로 대기열에 추가](#how-useactionstate-queuing-works)해야 합니다. 여러 Action을 병렬로 수행하려면 `useState`와 `useTransition`을 직접 사용하세요.

</DeepDive>

---

### `useOptimistic`과 함께 사용하기 {/*using-with-useoptimistic*/}

`useActionState`를 [`useOptimistic`](/reference/react/useOptimistic)과 결합하여 즉각적인 UI 피드백을 표시할 수 있습니다.


<Sandpack>

```js src/App.js
import { useActionState, startTransition, useOptimistic } from 'react';
import { addToCart, removeFromCart } from './api';
import Total from './Total';

export default function Checkout() {
  const [count, dispatchAction, isPending] = useActionState(updateCartAction, 0);
  const [optimisticCount, setOptimisticCount] = useOptimistic(count);

  function handleAdd() {
    startTransition(() => {
      setOptimisticCount(c => c + 1);
      dispatchAction({ type: 'ADD' });
    });
  }

  function handleRemove() {
    startTransition(() => {
      setOptimisticCount(c => c - 1);
      dispatchAction({ type: 'REMOVE' });
    });
  }

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <div className="row">
        <span>Eras Tour Tickets</span>
        <span className="stepper">
          <span className="pending">{isPending && '🌀'}</span>
          <span className="qty">{optimisticCount}</span>
          <span className="buttons">
            <button onClick={handleAdd}>▲</button>
            <button onClick={handleRemove}>▼</button>
          </span>
        </span>
      </div>
      <hr />
      <Total quantity={optimisticCount} isPending={isPending}/>
    </div>
  );
}

async function updateCartAction(prevCount, actionPayload) {
  switch (actionPayload.type) {
    case 'ADD': {
      return await addToCart(prevCount);
    }
    case 'REMOVE': {
      return await removeFromCart(prevCount);
    }
  }
  return prevCount;
}
```

```js src/Total.js
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

export default function Total({quantity, isPending}) {
  return (
    <div className="row total">
      <span>Total</span>
      <span>{isPending ? '🌀 Updating...' : formatter.format(quantity * 9999)}</span>
    </div>
  );
}
```

```js src/api.js hidden
export async function addToCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return count + 1;
}

export async function removeFromCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return Math.max(0, count - 1);
}
```

```css
.checkout {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: system-ui;
}

.checkout h2 {
  margin: 0 0 8px 0;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stepper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty {
  min-width: 20px;
  text-align: center;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.buttons button {
  padding: 0 8px;
  font-size: 10px;
  line-height: 1.2;
  cursor: pointer;
}

.pending {
  width: 20px;
  text-align: center;
}

.total {
  font-weight: bold;
}

hr {
  width: 100%;
  border: none;
  border-top: 1px solid #ccc;
  margin: 4px 0;
}
```

</Sandpack>


`setOptimisticCount`는 즉각적으로 수량을 업데이트하고 `dispatchAction()`은 `updateCartAction`을 큐에 넣습니다. 수량과 총합 모두에 대기 상태 표시기를 띄워 사용자의 업데이트가 아직 적용 중이라는 피드백을 제공합니다.

---


### Action prop과 함께 사용하기 {/*using-with-action-props*/}

[Action prop](/reference/react/useTransition#exposing-action-props-from-components)을 노출하는 컴포넌트에 `dispatchAction` 함수를 전달하는 경우 `startTransition`이나 `useOptimistic`을 직접 호출할 필요가 없습니다.

이 예시는 `QuantityStepper` 컴포넌트의 `increaseAction` 및 `decreaseAction` prop을 사용하는 방법을 보여줍니다.

<Sandpack>

```js src/App.js
import { useActionState } from 'react';
import { addToCart, removeFromCart } from './api';
import QuantityStepper from './QuantityStepper';
import Total from './Total';

export default function Checkout() {
  const [count, dispatchAction, isPending] = useActionState(updateCartAction, 0);

  function addAction() {
    dispatchAction({type: 'ADD'});
  }

  function removeAction() {
    dispatchAction({type: 'REMOVE'});
  }

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <div className="row">
        <span>Eras Tour Tickets</span>
        <QuantityStepper
          value={count}
          increaseAction={addAction}
          decreaseAction={removeAction}
        />
      </div>
      <hr />
      <Total quantity={count} isPending={isPending} />
    </div>
  );
}

async function updateCartAction(prevCount, actionPayload) {
  switch (actionPayload.type) {
    case 'ADD': {
      return await addToCart(prevCount);
    }
    case 'REMOVE': {
      return await removeFromCart(prevCount);
    }
  }
  return prevCount;
}
```

```js src/QuantityStepper.js
import { startTransition, useOptimistic } from 'react';

export default function QuantityStepper({value, increaseAction, decreaseAction}) {
  const [optimisticValue, setOptimisticValue] = useOptimistic(value);
  const isPending = value !== optimisticValue;
  function handleIncrease() {
    startTransition(async () => {
      setOptimisticValue(c => c + 1);
      await increaseAction();
    });
  }

  function handleDecrease() {
    startTransition(async () => {
      setOptimisticValue(c => Math.max(0, c - 1));
      await decreaseAction();
    });
  }

  return (
    <span className="stepper">
      <span className="pending">{isPending && '🌀'}</span>
      <span className="qty">{optimisticValue}</span>
      <span className="buttons">
        <button onClick={handleIncrease}>▲</button>
        <button onClick={handleDecrease}>▼</button>
      </span>
    </span>
  );
}
```

```js src/Total.js
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

export default function Total({quantity, isPending}) {
  return (
    <div className="row total">
      <span>Total</span>
      {isPending ? '🌀 Updating...' : formatter.format(quantity * 9999)}
    </div>
  );
}
```

```js src/api.js hidden
export async function addToCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return count + 1;
}

export async function removeFromCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return Math.max(0, count - 1);
}
```

```css
.checkout {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: system-ui;
}

.checkout h2 {
  margin: 0 0 8px 0;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stepper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty {
  min-width: 20px;
  text-align: center;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.buttons button {
  padding: 0 8px;
  font-size: 10px;
  line-height: 1.2;
  cursor: pointer;
}

.pending {
  width: 20px;
  text-align: center;
}

.total {
  font-weight: bold;
}

hr {
  width: 100%;
  border: none;
  border-top: 1px solid #ccc;
  margin: 4px 0;
}
```

</Sandpack>

`<QuantityStepper>`는 Transition, 보류 상태(pending state), 카운트를 낙관적으로 업데이트하는 기능이 이미 내장되어 있기 때문에 Action에게 *무엇(what)*을 바꿀지만 알려주면 *어떻게(how)* 바꿀지는 컴포넌트가 대신 처리해 줍니다.

---

### 큐에 대기 중인 Action 취소하기 {/*cancelling-queued-actions*/}

`AbortController`를 사용하여 보류 중인 Action을 취소할 수 있습니다.

<Sandpack>

```js src/App.js
import { useActionState, useRef } from 'react';
import { addToCart, removeFromCart } from './api';
import QuantityStepper from './QuantityStepper';
import Total from './Total';

export default function Checkout() {
  const abortRef = useRef(null);
  const [count, dispatchAction, isPending] = useActionState(updateCartAction, 0);

  async function addAction() {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    abortRef.current = new AbortController();
    await dispatchAction({ type: 'ADD', signal: abortRef.current.signal });
  }

  async function removeAction() {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    abortRef.current = new AbortController();
    await dispatchAction({ type: 'REMOVE', signal: abortRef.current.signal });
  }

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <div className="row">
        <span>Eras Tour Tickets</span>
        <QuantityStepper
          value={count}
          increaseAction={addAction}
          decreaseAction={removeAction}
        />
      </div>
      <hr />
      <Total quantity={count} isPending={isPending} />
    </div>
  );
}

async function updateCartAction(prevCount, actionPayload) {
  switch (actionPayload.type) {
    case 'ADD': {
      try {
        return await addToCart(prevCount, { signal: actionPayload.signal });
      } catch (e) {
        return prevCount + 1;
      }
    }
    case 'REMOVE': {
      try {
        return await removeFromCart(prevCount, { signal: actionPayload.signal });
      } catch (e) {
        return Math.max(0, prevCount - 1);
      }
    }
  }
  return prevCount;
}
```

```js src/QuantityStepper.js
import { startTransition, useOptimistic } from 'react';

export default function QuantityStepper({value, increaseAction, decreaseAction}) {
  const [optimisticValue, setOptimisticValue] = useOptimistic(value);
  const isPending = value !== optimisticValue;
  function handleIncrease() {
    startTransition(async () => {
      setOptimisticValue(c => c + 1);
      await increaseAction();
    });
  }

  function handleDecrease() {
    startTransition(async () => {
      setOptimisticValue(c => Math.max(0, c - 1));
      await decreaseAction();
    });
  }

  return (
          <span className="stepper">
      <span className="pending">{isPending && '🌀'}</span>
      <span className="qty">{optimisticValue}</span>
      <span className="buttons">
        <button onClick={handleIncrease}>▲</button>
        <button onClick={handleDecrease}>▼</button>
      </span>
    </span>
  );
}
```

```js src/Total.js
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

export default function Total({quantity, isPending}) {
  return (
    <div className="row total">
      <span>Total</span>
      {isPending ? '🌀 Updating...' : formatter.format(quantity * 9999)}
    </div>
  );
}
```

```js src/api.js hidden
class AbortError extends Error {
  name = 'AbortError';
  constructor(message = 'The operation was aborted') {
    super(message);
  }
}

function sleep(ms, signal) {
  if (!signal) return new Promise((resolve) => setTimeout(resolve, ms));
  if (signal.aborted) return Promise.reject(new AbortError());

  return new Promise((resolve, reject) => {
    const id = setTimeout(() => {
      signal.removeEventListener('abort', onAbort);
      resolve();
    }, ms);

    const onAbort = () => {
      clearTimeout(id);
      reject(new AbortError());
    };

    signal.addEventListener('abort', onAbort, { once: true });
  });
}
export async function addToCart(count, opts) {
  await sleep(1000, opts?.signal);
  return count + 1;
}

export async function removeFromCart(count, opts) {
  await sleep(1000, opts?.signal);
  return Math.max(0, count - 1);
}
```

```css
.checkout {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: system-ui;
}

.checkout h2 {
  margin: 0 0 8px 0;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stepper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty {
  min-width: 20px;
  text-align: center;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.buttons button {
  padding: 0 8px;
  font-size: 10px;
  line-height: 1.2;
  cursor: pointer;
}

.pending {
  width: 20px;
  text-align: center;
}

.total {
  font-weight: bold;
}

hr {
  width: 100%;
  border: none;
  border-top: 1px solid #ccc;
  margin: 4px 0;
}
```

</Sandpack>

증가 또는 감소 버튼을 여러 번 클릭해 보고 아무리 많이 클릭하더라도 총합이 1초 내에 업데이트되는 것을 확인해 보세요. 이 기능은 `AbortController`를 이용해 이전 Action을 "완료" 처리하고 다음 Action이 바로 진행되도록 만들기 때문에 작동합니다.

<Pitfall>

Action을 중단(aborting)하는 것이 항상 안전하지는 않습니다.

예를 들어, Action이 데이터베이스 쓰기와 같은 변경 작업(mutation)을 수행하는 경우, 네트워크 요청을 중단한다고 해서 서버 측 변경이 취소되지는 않습니다. 이것이 `useActionState`가 기본적으로 중단 기능을 사용하지 않는 이유입니다. 사이드 이펙트를 안전하게 무시하거나 재시도할 수 있다고 확신할 때만 사용하는 것이 안전합니다.

</Pitfall>

---

### `<form>` Action prop과 함께 사용하기 {/*use-with-a-form*/}

`dispatchAction` 함수를 `<form>`의 `action` prop으로 전달할 수 있습니다.

이 방식으로 사용하면 React가 자동으로 폼 제출을 Transition으로 감싸주기 때문에 `startTransition`을 직접 호출할 필요가 없습니다. `reducerAction`은 이전 상태와 제출된 `FormData`를 받게 됩니다.

<Sandpack>

```js src/App.js
import { useActionState, useOptimistic } from 'react';
import { addToCart, removeFromCart } from './api';
import Total from './Total';

export default function Checkout() {
  const [count, dispatchAction, isPending] = useActionState(updateCartAction, 0);
  const [optimisticCount, setOptimisticCount] = useOptimistic(count);

  async function formAction(formData) {
    const type = formData.get('type');
    if (type === 'ADD') {
      setOptimisticCount(c => c + 1);
    } else {
      setOptimisticCount(c => Math.max(0, c - 1));
    }
    return dispatchAction(formData);
  }

  return (
    <form action={formAction} className="checkout">
      <h2>Checkout</h2>
      <div className="row">
        <span>Eras Tour Tickets</span>
        <span className="stepper">
          <span className="pending">{isPending && '🌀'}</span>
          <span className="qty">{optimisticCount}</span>
          <span className="buttons">
            <button type="submit" name="type" value="ADD">▲</button>
            <button type="submit" name="type" value="REMOVE">▼</button>
          </span>
        </span>
      </div>
      <hr />
      <Total quantity={count} isPending={isPending} />
    </form>
  );
}

async function updateCartAction(prevCount, formData) {
  const type = formData.get('type');
  switch (type) {
    case 'ADD': {
      return await addToCart(prevCount);
    }
    case 'REMOVE': {
      return await removeFromCart(prevCount);
    }
  }
  return prevCount;
}
```

```js src/Total.js
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

export default function Total({quantity, isPending}) {
  return (
    <div className="row total">
      <span>Total</span>
      {isPending ? '🌀 Updating...' : formatter.format(quantity * 9999)}
    </div>
  );
}
```

```js src/api.js hidden
export async function addToCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return count + 1;
}

export async function removeFromCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return Math.max(0, count - 1);
}
```

```css
.checkout {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: system-ui;
}

.checkout h2 {
  margin: 0 0 8px 0;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stepper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty {
  min-width: 20px;
  text-align: center;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.buttons button {
  padding: 0 8px;
  font-size: 10px;
  line-height: 1.2;
  cursor: pointer;
}

.pending {
  width: 20px;
  text-align: center;
}

.total {
  font-weight: bold;
}

hr {
  width: 100%;
  border: none;
  border-top: 1px solid #ccc;
  margin: 4px 0;
}
```

</Sandpack>

이 예시에서는 사용자가 스테퍼 화살표를 클릭하면 버튼이 폼을 제출하고 `useActionState`는 폼 데이터와 함께 `updateCartAction`을 호출합니다. 또한 `useOptimistic`을 활용하여 서버가 업데이트를 확인하는 동안 새로운 수량을 즉시 표시합니다.

<RSC>

[Server Function](/reference/rsc/server-functions)과 함께 사용할 때, `useActionState`는 하이드레이션(React가 서버 렌더링 HTML에 부착되는 과정)이 완료되기 전에 서버의 응답을 표시할 수 있게 해줍니다. 동적 콘텐츠가 있는 페이지의 경우 점진적 향상(JavaScript가 로드되기 전에 폼이 작동하도록 허용)을 위해 선택적인 `permalink` 매개변수를 사용할 수도 있습니다. 이는 일반적으로 프레임워크가 대신 처리해 줍니다.

</RSC>

폼과 함께 Action을 사용하는 방법에 대한 자세한 내용은 [`<form>`](/reference/react-dom/components/form#handle-form-submission-with-a-server-function) 문서를 참조하세요.

---

### 오류 처리하기 {/*handling-errors*/}

`useActionState`로 오류를 처리하는 방법에는 두 가지가 있습니다.

백엔드에서 오는 "수량 부족" 같은 알려진 유효성 검사 오류의 경우, 이를 `reducerAction` 상태의 일부로 반환하여 UI에 표시할 수 있습니다.

`undefined is not a function` 같은 알 수 없는 오류의 경우에는 에러를 직접 던질(throw) 수 있습니다. React는 큐에 대기 중인 모든 Action을 취소하고 `useActionState` 훅에서 오류를 다시 발생시켜 가장 가까운 [Error Boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary)를 표시하게 됩니다.

<Sandpack>

```js src/App.js
import {useActionState, startTransition} from 'react';
import {ErrorBoundary} from 'react-error-boundary';
import {addToCart} from './api';
import Total from './Total';

function Checkout() {
  const [state, dispatchAction, isPending] = useActionState(
    async (prevState, quantity) => {
      const result = await addToCart(prevState.count, quantity);
      if (result.error) {
        // API의 오류를 상태로 반환합니다
        return {...prevState, error: `Could not add quanitiy ${quantity}: ${result.error}`};
      }

      if (!isPending) {
        // 첫 번째 디스패치에 대해 오류 상태를 지웁니다.
        return {count: result.count, error: null};
      }

      // 새 카운트와 발생한 오류를 반환합니다.
      return {count: result.count, error: prevState.error};


    },
    {
      count: 0,
      error: null,
    }
  );

  function handleAdd(quantity) {
    startTransition(() => {
      dispatchAction(quantity);
    });
  }

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <div className="row">
        <span>Eras Tour Tickets</span>
        <span>
          {isPending && '🌀 '}Qty: {state.count}
        </span>
      </div>
      <div className="buttons">
        <button onClick={() => handleAdd(1)}>Add 1</button>
        <button onClick={() => handleAdd(10)}>Add 10</button>
        <button onClick={() => handleAdd(NaN)}>Add NaN</button>
      </div>
      {state.error && <div className="error">{state.error}</div>}
      <hr />
      <Total quantity={state.count} isPending={isPending} />
    </div>
  );
}



export default function App() {
  return (
    <ErrorBoundary
      fallbackRender={({resetErrorBoundary}) => (
        <div className="checkout">
          <h2>Something went wrong</h2>
          <p>The action could not be completed.</p>
          <button onClick={resetErrorBoundary}>Try again</button>
        </div>
      )}>
      <Checkout />
    </ErrorBoundary>
  );
}
```

```js src/Total.js
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

export default function Total({quantity, isPending}) {
  return (
    <div className="row total">
      <span>Total</span>
      <span>
        {isPending ? '🌀 Updating...' : formatter.format(quantity * 9999)}
      </span>
    </div>
  );
}
```

```js src/api.js hidden
export async function addToCart(count, quantity) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (quantity > 5) {
    return {error: 'Quantity not available'};
  } else if (isNaN(quantity)) {
    throw new Error('Quantity must be a number');
  }
  return {count: count + quantity};
}
```

```css
.checkout {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: system-ui;
}

.checkout h2 {
  margin: 0 0 8px 0;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total {
  font-weight: bold;
}

hr {
  width: 100%;
  border: none;
  border-top: 1px solid #ccc;
  margin: 4px 0;
}

button {
  padding: 8px 16px;
  cursor: pointer;
}

.buttons {
  display: flex;
  gap: 8px;
}

.error {
  color: red;
  font-size: 14px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```

</Sandpack>

이 예시에서 "Add 10"은 유효성 검사 오류를 반환하는 API를 시뮬레이션하며, `updateCartAction`은 이를 상태에 저장하고 인라인으로 표시합니다. 반면 "Add NaN"은 유효하지 않은 카운트를 만들어 `updateCartAction`이 에러를 던지게 만들고, 이 에러는 `useActionState`를 통해 `ErrorBoundary`로 전파되어 리셋(reset) UI를 표시하게 됩니다.


---

## 문제 해결 {/*troubleshooting*/}

### `isPending` 플래그가 업데이트되지 않습니다 {/*ispending-not-updating*/}

`dispatchAction`을 (Action prop을 통하지 않고) 수동으로 호출하고 있다면, 호출부를 [`startTransition`](/reference/react/startTransition)으로 감쌌는지 확인하세요.

```js
import { useActionState, startTransition } from 'react';

function MyComponent() {
  const [state, dispatchAction, isPending] = useActionState(myAction, null);

  function handleClick() {
    // ✅ 올바른 방법: startTransition으로 감싸기
    startTransition(() => {
      dispatchAction();
    });
  }

  // ...
}
```

`dispatchAction`이 Action prop에 전달되면 React가 자동으로 이를 Transition으로 감싸줍니다.

---

### 내 Action이 폼 데이터를 읽을 수 없습니다 {/*action-cannot-read-form-data*/}

`useActionState`를 사용할 때, `reducerAction`은 첫 번째 인수로 이전 상태(또는 초기 상태)라는 추가적인 인수를 받게 됩니다. 따라서 제출된 폼 데이터는 첫 번째가 아니라 두 번째 인수가 됩니다.

```js {2,7}
// useActionState를 사용하지 않을 때
function action(formData) {
  const name = formData.get('name');
}

// useActionState를 사용할 때
function action(prevState, formData) {
  const name = formData.get('name');
}
```

---

### 내 Action이 무시되고 건너뜁니다 {/*actions-skipped*/}

`dispatchAction`을 여러 번 호출했는데 그중 일부가 실행되지 않는다면, 이는 이전 `dispatchAction` 호출에서 오류가 발생했기 때문일 수 있습니다.

`reducerAction`이 에러를 던지면 React는 이후 큐에 있는 모든 `dispatchAction` 호출을 건너뜁니다.

이 문제를 해결하려면 `reducerAction` 안에서 오류를 포착(catch)하고 에러를 던지는 대신 오류 상태를 반환하세요.

```js
async function myReducerAction(prevState, data) {
  try {
    const result = await submitData(data);
    return { success: true, data: result };
  } catch (error) {
    // ✅ 에러를 던지는 대신 오류 상태를 반환합니다
    return { success: false, error: error.message };
  }
}
```

---

### 상태가 초기화되지 않습니다 {/*reset-state*/}

`useActionState`는 내장된 초기화(reset) 함수를 제공하지 않습니다. 상태를 리셋하려면 `reducerAction`이 리셋 신호를 처리하도록 설계할 수 있습니다.

```js
const initialState = { name: '', error: null };

async function formAction(prevState, payload) {
  // 리셋 처리
  if (payload === null) {
    return initialState;
  }
  // 일반적인 Action 로직
  const result = await submitData(payload);
  return result;
}

function MyComponent() {
  const [state, dispatchAction, isPending] = useActionState(formAction, initialState);

  function handleReset() {
    startTransition(() => {
      dispatchAction(null); // 리셋을 트리거하기 위해 null을 전달
    });
  }

  // ...
}
```

또는 `useActionState`를 사용하는 컴포넌트에 `key` prop을 추가하여 새로운 상태로 강제로 다시 마운트되게 만들거나, 제출 후 자동으로 리셋되는 `<form>`의 `action` prop을 사용할 수도 있습니다.

---

### "An async function with useActionState was called outside of a transition." 에러가 발생합니다 {/*async-function-outside-transition*/}

Transition 안에서 `dispatchAction`을 호출하는 것을 빠뜨리는 실수를 자주 합니다.

<ConsoleBlockMulti>
<ConsoleLogLine level="error">

An async function with useActionState was called outside of a transition. This is likely not what you intended (for example, isPending will not update correctly). Either call the returned function inside startTransition, or pass it to an `action` or `formAction` prop.

</ConsoleLogLine>
</ConsoleBlockMulti>


이 오류는 `dispatchAction`이 반드시 Transition 내부에서 실행되어야 하기 때문에 발생합니다.

```js
function MyComponent() {
  const [state, dispatchAction, isPending] = useActionState(myAsyncAction, null);

  function handleClick() {
    // ❌ 잘못된 방법: Transition 외부에서 dispatchAction 호출
    dispatchAction();
  }

  // ...
}
```

이 문제를 해결하려면 호출을 [`startTransition`](/reference/react/startTransition)으로 감싸세요.

```js
import { useActionState, startTransition } from 'react';

function MyComponent() {
  const [state, dispatchAction, isPending] = useActionState(myAsyncAction, null);

  function handleClick() {
    // ✅ 올바른 방법: startTransition으로 감싸기
    startTransition(() => {
      dispatchAction();
    });
  }

  // ...
}
```

또는 `dispatchAction`을 Action prop으로 전달하면 알아서 Transition 내에서 호출됩니다.

```js
function MyComponent() {
  const [state, dispatchAction, isPending] = useActionState(myAsyncAction, null);

  // ✅ 올바른 방법: action prop이 자동으로 Transition으로 감싸줍니다.
  return <Button action={dispatchAction}>...</Button>;
}
```

---

### "Cannot update action state while rendering" 에러가 발생합니다 {/*cannot-update-during-render*/}

렌더링 중에는 `dispatchAction`을 호출할 수 없습니다.

<ConsoleBlock level="error">

Cannot update action state while rendering.

</ConsoleBlock>

이렇게 하면 `dispatchAction`이 상태 업데이트를 예약하고 이로 인해 리렌더링이 트리거되며 다시 `dispatchAction`을 호출하는 무한 루프가 발생합니다.

```js
function MyComponent() {
  const [state, dispatchAction, isPending] = useActionState(myAction, null);

  // ❌ 잘못된 방법: 렌더링 중에 dispatchAction 호출
  dispatchAction();

  // ...
}
```

이 문제를 해결하려면 폼 제출이나 버튼 클릭과 같은 사용자 이벤트에 대한 응답으로만 `dispatchAction`을 호출하세요.
