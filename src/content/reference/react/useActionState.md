---
title: useActionState
---

<Intro>

`useActionState`는 폼 액션의 결과를 기반으로 state를 업데이트할 수 있도록 제공하는 Hook입니다.

```js
const [state, formAction, isPending] = useActionState(fn, initialState, permalink?);
```

</Intro>

<Note>

이전 React Canary 버전에서는 이 API가 React DOM에 포함되어 있었고, `useFormState`라고 불렸습니다.

</Note>

<InlineToc />

---

## 레퍼런스 {/*reference*/}

### `useActionState(action, initialState, permalink?)` {/*useactionstate*/}

{/* TODO T164397693: link to actions documentation once it exists */}

컴포넌트 함수(또는 최상위 레벨)에서 `useActionState`를 호출하여 [폼 액션이 실행될 때](/reference/react-dom/components/form) 업데이트되는 컴포넌트 state를 생성합니다. `useActionState`는 기존의 폼 액션 함수와 초기 state를 전달받고, 폼에서 사용할 새로운 액션을 반환합니다. 또한 최신 폼 state와 액션이 진행 중인지 여부(`isPending`)도 반환합니다. 이때 최신 폼 state는 `useActionState`에 전달한 함수에도 함께 전달됩니다.

```js
import { useActionState } from "react";

async function increment(previousState, formData) {
  return previousState + 1;
}

function StatefulForm({}) {
  const [state, formAction] = useActionState(increment, 0);
  return (
    <form>
      {state}
      <button formAction={formAction}>Increment</button>
    </form>
  );
}
```

폼 state는 폼을 마지막으로 제출했을 때 액션에서 반환되는 값입니다. 아직 폼을 제출하지 않았다면, `initialState`로 설정됩니다.

서버 함수(Server Function)와 함께 사용하는 경우, `useActionState`를 통해 하이드레이션(hydration)이 끝나기 전에도 폼 제출에 대한 서버 응답을 표시할 수 있습니다.

If used with a Server Function, `useActionState` allows the server's response from submitting the form to be shown even before hydration has completed. {/*TODO*/}

[아래에서 더 많은 예시를 확인해 보세요.](#usage)

#### 매개변수 {/*parameters*/}

* `fn`: 폼이 제출되거나 버튼이 눌렸을 때 호출될 함수입니다. 함수가 호출되면 첫 번째 인수로 폼의 이전 state가 전달됩니다(처음에는 `initialState`, 그 뒤로는 액션의 마지막 반환값). 그 뒤 일반적인 폼 액션과 동일하게 인수들이 이어집니다.
* `initialState`: 초기 state로 사용될 직렬화 가능한 값입니다. 액션이 처음 호출된 뒤에는 더 이상 이 값이 사용되지 않습니다.
* **optional** `permalink`: 점진적 향상(progressive enhancement) 기법을 사용하는 동적 콘텐츠(예: 피드) 페이지에서 유용한 옵션입니다. `fn`이 [서버 함수(Server Function)](/reference/rsc/server-functions)이고, 자바스크립트 번들이 로드되기 전에 폼이 제출된다면 브라우저는 현재 페이지가 아니라 이 `permalink` URL로 이동합니다. React가 상태를 올바르게 이어 받기 위해, 대상 페이지에서도 동일한 폼 컴포넌트를 렌더링해야 합니다(`fn`과 `permalink`가 동일해야 함). 폼이 하이드레이션된 뒤에는 이 매개변수는 더 이상 영향을 주지 않습니다.

* `fn`: The function to be called when the form is submitted or button pressed. When the function is called, it will receive the previous state of the form (initially the `initialState` that you pass, subsequently its previous return value) as its initial argument, followed by the arguments that a form action normally receives.
* `initialState`: The value you want the state to be initially. It can be any serializable value. This argument is ignored after the action is first invoked.
* **optional** `permalink`: A string containing the unique page URL that this form modifies. For use on pages with dynamic content (e.g. feeds) in conjunction with progressive enhancement: if `fn` is a [server function](/reference/rsc/server-functions) and the form is submitted before the JavaScript bundle loads, the browser will navigate to the specified permalink URL, rather than the current page's URL. Ensure that the same form component is rendered on the destination page (including the same action `fn` and `permalink`) so that React knows how to pass the state through. Once the form has been hydrated, this parameter has no effect. {/*TODO*/}

{/* TODO T164397693: link to serializable values docs once it exists */}

#### 반환값 {/*returns*/}

`useActionState`는 다음 세 가지 값을 담은 배열을 반환합니다.

1. 현재 state입니다. 첫 렌더링 시에는 `initialState`와 일치하며, 액션이 실행된 후에는 액션이 반환한 값과 일치합니다.
2. `<form>` 컴포넌트의 `action` prop이나 폼 내부 `<button>` 컴포넌트의 `formAction` prop에 전달할 수 있는 새 액션입니다.
3. 폼 액션이 진행 중인지 여부를 알려주는 `isPending` 플래그입니다.

#### 주의 사항 {/*caveats*/}

* React 서버 컴포넌트를 지원하는 프레임워크에서 `useActionState`를 사용하면, 클라이언트 자바스크립트 실행 전에도 폼과 상호작용할 수 있습니다. 만약 서버 컴포넌트를 사용하지 않는다면, 이는 단순히 컴포넌트 로컬 state와 동일하게 동작합니다.
* `useActionState`에 전달된 함수는 첫 번째 인수로 이전 또는 초기 state를 추가로 받습니다. 즉, 직접 폼 액션을 사용했을 때와 비교해 함수의 시그니처가 달라질 수 있습니다.

---

## 사용법 {/*usage*/}

### 폼 액션에서 반환된 정보 사용하기 {/*using-information-returned-by-a-form-action*/}

컴포넌트의 최상위 레벨에서 `useActionState`를 호출하면, 폼이 마지막으로 제출되었을 때 액션이 반환한 값에 접근할 수 있습니다.

```js [[1, 5, "state"], [2, 5, "formAction"], [3, 5, "action"], [4, 5, "null"], [2, 8, "formAction"]]
import { useActionState } from 'react';
import { action } from './actions.js';

function MyComponent() {
  const [state, formAction] = useActionState(action, null);
  // ...
  return (
    <form action={formAction}>
      {/* ... */}
    </form>
  );
}
```

`useActionState`가 반환하는 배열은 다음과 같은 요소를 갖습니다:

1. 폼의 <CodeStep step={1}>현재 state</CodeStep>입니다. 처음에는 전달한 <CodeStep step={4}>초기 state</CodeStep>로 설정되며, 폼이 제출된 후에는 전달한 <CodeStep step={3}>액션</CodeStep>의 반환값으로 설정됩니다.
2. `<form>`의 `action` prop에 전달할 <CodeStep step={2}>새로운 액션</CodeStep>입니다.
3. 액션이 처리되는 동안 사용할 수 있는 <CodeStep step={1}>대기(Pending) state</CodeStep>입니다.

폼 제출 시, <CodeStep step={3}>액션</CodeStep> 함수가 호출되고 그 반환값이 폼의 새로운 <CodeStep step={1}>현재 state</CodeStep>가 됩니다.

또한 <CodeStep step={3}>액션</CodeStep> 함수는 새롭게 추가된 첫 번째 인수로 폼의 <CodeStep step={1}>현재 state</CodeStep>를 받습니다. (처음엔 <CodeStep step={4}>초기 state</CodeStep>, 그 후에는 직전 반환값) 나머지 인수들은 일반 폼 액션 호출과 동일합니다.

```js [[3, 1, "action"], [1, 1, "currentState"]]
function action(currentState, formData) {
  // ...
  return 'next state';
}
```

<Recipes titleText="폼 제출 후 정보 표시하기" titleId="display-information-after-submitting-a-form">

#### 오류 표시하기 {/*display-form-errors*/}

서버 함수(Server Function)에서 반환된 오류 메시지나 토스트 메시지를 표시하려면, 해당 액션을 `useActionState`로 감싸 주세요.

To display messages such as an error message or toast that's returned by a Server Function, wrap the action in a call to `useActionState`.

<Sandpack>

```js src/App.js
import { useActionState } from "react";
import { addToCart } from "./actions.js";

function AddToCartForm({itemID, itemTitle}) {
  const [message, formAction, isPending] = useActionState(addToCart, null);
  return (
    <form action={formAction}>
      <h2>{itemTitle}</h2>
      <input type="hidden" name="itemID" value={itemID} />
      <button type="submit">Add to Cart</button>
      {isPending ? "Loading..." : message}
    </form>
  );
}

export default function App() {
  return (
    <>
      <AddToCartForm itemID="1" itemTitle="JavaScript: The Definitive Guide" />
      <AddToCartForm itemID="2" itemTitle="JavaScript: The Good Parts" />
    </>
  );
}
```

```js src/actions.js
"use server";

export async function addToCart(prevState, queryData) {
  const itemID = queryData.get('itemID');
  if (itemID === "1") {
    return "Added to cart";
  } else {
    // Add a fake delay to make waiting noticeable.
    await new Promise(resolve => {
      setTimeout(resolve, 2000);
    });
    return "Couldn't add to cart: the item is sold out.";
  }
}
```

```css src/styles.css hidden
form {
  border: solid 1px black;
  margin-bottom: 24px;
  padding: 12px;
}

form button {
  margin-right: 12px;
}
```
</Sandpack>

<Solution />

#### 폼 제출 후 구조화된 정보 표시하기 {/*display-structured-information-after-submitting-a-form*/}

서버 함수(Server Function)의 반환값은 직렬화 가능한 어떤 값이든 가능합니다. 예를 들어, 액션 성공 여부를 나타내는 불리언, 오류 메시지, 업데이트된 객체 등 다양하게 활용할 수 있습니다.

The return value from a Server Function can be any serializable value. For example, it could be an object that includes a boolean indicating whether the action was successful, an error message, or updated information. {/*TODO*/}

<Sandpack>

```js src/App.js
import { useActionState, useState } from "react";
import { addToCart } from "./actions.js";

function AddToCartForm({itemID, itemTitle}) {
  const [formState, formAction] = useActionState(addToCart, {});
  return (
    <form action={formAction}>
      <h2>{itemTitle}</h2>
      <input type="hidden" name="itemID" value={itemID} />
      <button type="submit">Add to Cart</button>
      {formState?.success &&
        <div className="toast">
          Added to cart! Your cart now has {formState.cartSize} items.
        </div>
      }
      {formState?.success === false &&
        <div className="error">
          Failed to add to cart: {formState.message}
        </div>
      }
    </form>
  );
}

export default function App() {
  return (
    <>
      <AddToCartForm itemID="1" itemTitle="JavaScript: The Definitive Guide" />
      <AddToCartForm itemID="2" itemTitle="JavaScript: The Good Parts" />
    </>
  );
}
```

```js src/actions.js
"use server";

export async function addToCart(prevState, queryData) {
  const itemID = queryData.get('itemID');
  if (itemID === "1") {
    return {
      success: true,
      cartSize: 12,
    };
  } else {
    return {
      success: false,
      message: "The item is sold out.",
    };
  }
}
```

```css src/styles.css hidden
form {
  border: solid 1px black;
  margin-bottom: 24px;
  padding: 12px;
}

form button {
  margin-right: 12px;
}
```
</Sandpack>

<Solution />

</Recipes>

## 문제 해결 {/*troubleshooting*/}

### 액션이 더 이상 제출된 폼 데이터를 읽을 수 없습니다 {/*my-action-can-no-longer-read-the-submitted-form-data*/}

액션을 `useActionState`로 감싸면 *첫 번째 인수*로 “이전(또는 현재) state”가 추가됩니다. 따라서 일반적인 폼 액션과 달리, 제출된 폼 데이터는 *두 번째 인수*에서 확인해야 합니다.

```js
function action(currentState, formData) {
  // ...
}
```
