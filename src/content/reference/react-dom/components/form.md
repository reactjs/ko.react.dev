---
title: "<form>"
---

<Intro>

[내장 브라우저 `<form>` 컴포넌트](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form)로 정보 제출을 위한 대화형 컨트롤을 만들 수 있습니다.

```js
<form action={search}>
    <input name="query" />
    <button type="submit">검색</button>
</form>
```

</Intro>

<InlineToc />

---

## 레퍼런스 {/*reference*/}

### `<form>` {/*form*/}

정보 제출을 위한 대화형 컨트롤을 생성하기 위해, [내장 브라우저 `<form>` 컴포넌트](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form)를 렌더링하세요.

```js
<form action={search}>
    <input name="query" />
    <button type="submit">검색</button>
</form>
```

[아래 예시를 참고하세요.](#usage)

#### Props {/*props*/}

`<form>`은 모든 [공통 엘리먼트 Props](/reference/react-dom/components/common#common-props)를 지원합니다.

* [`action`](https://developer.mozilla.org/ko/docs/Web/HTML/Element/form#action): URL을 담은 문자열 또는 함수입니다. URL을 전달하면 폼은 표준 HTML 폼처럼 동작합니다. 함수를 전달하면 해당 함수가 폼 제출을 처리합니다. [`action` Prop으로 폼 제출 처리하기](#handle-form-submission-with-an-action-prop)를 참고하세요.
  * `action`에 함수를 전달하면 React는 [Action Prop 패턴](/reference/react/useTransition#exposing-action-props-from-components)에 따라 [Transition](/reference/react/useTransition) 내에서 함수를 실행합니다.
  * 함수는 비동기(async)일 수 있습니다. React는 제출된 폼의 [폼 데이터](https://developer.mozilla.org/ko/docs/Web/API/FormData)를 담은 단일 인수로 함수를 호출합니다.
  * `<button>`, `<input type="submit">`, 또는 `<input type="image">`의 `formAction` Prop으로 `action`을 재정의할 수 있습니다.
* [`method`](https://developer.mozilla.org/ko/docs/Web/HTML/Element/form#method): `action`이 URL일 때 사용할 HTTP 메서드를 지정하는 문자열입니다. 기본값은 `get`입니다.
* `onSubmit`: [`Event` 핸들러](/reference/react-dom/components/common#react-event-object) 함수입니다. 폼이 제출될 때 호출됩니다. [이벤트 핸들러로 폼 제출 처리하기](#handle-form-submission-with-an-event-handler)를 참고하세요.

#### 주의 사항 {/*caveats*/}

* 함수를 `action`이나 `formAction`에 전달하면, HTTP 메서드는 `method` 프로퍼티의 값과 관계없이 `POST`로 처리합니다.
* 함수를 `action`이나 `formAction`에 전달하면, React는 Action이 성공한 후 모든 [비제어](/reference/react-dom/components/input#reading-the-input-values-when-submitting-a-form) 필드 엘리먼트를 초기화합니다. [Action 이후 폼 값 유지하기](#preserve-form-values-after-an-action)를 참고하세요.

---

## 사용법 {/*usage*/}

### 이벤트 핸들러로 폼 제출 처리하기 {/*handle-form-submission-with-an-event-handler*/}

폼이 제출될 때 코드를 실행하려면 `onSubmit` 이벤트 핸들러에 함수를 전달하세요. 기본적으로 브라우저는 폼 데이터를 현재 URL로 전송하고 페이지를 새로고침합니다. 이벤트 핸들러에서 [`e.preventDefault()`](https://developer.mozilla.org/ko/docs/Web/API/Event/preventDefault)를 호출하면 이러한 기본 동작을 방지할 수 있습니다.

`action`에도 함수를 전달한 경우, `onSubmit`에서 `e.preventDefault()`를 호출하지 않는 한 React는 `onSubmit` 이후에 `action` 함수를 실행합니다.

<Sandpack>

```js src/App.js
export default function Search() {
  function handleSubmit(e) {
    // 브라우저가 페이지를 다시 로드하지 않도록 방지합니다.
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const query = formData.get('query');
    alert(`'${query}'을(를) 검색했습니다.`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="query" />
      <button type="submit">검색</button>
    </form>
  );
}
```

</Sandpack>

<Note>

`onSubmit`은 모든 버전의 React에서 작동하며 [제출 이벤트](https://developer.mozilla.org/ko/docs/Web/API/HTMLFormElement/submit_event)에 직접 접근할 수 있게 해줍니다. React 19부터는 폼 제출에 [`action` Prop](#handle-form-submission-with-an-action-prop)을 사용하는 것이 권장됩니다. `action`을 사용하면 React가 [Transition](/reference/react/useTransition) 내에서 제출을 실행하고 여러 제출에 걸쳐 대기 상태와 동시성을 관리합니다. 또한 낙관적 업데이트, Error Boundary, [서버 함수](/reference/rsc/server-functions)도 사용할 수 있습니다.

</Note>

---

### `action` Prop으로 폼 제출 처리하기 {/*handle-form-submission-with-an-action-prop*/}

폼이 제출될 때 실행할 함수를 `action` Prop에 전달하세요. React는 `name` 어트리뷰트가 있는 모든 입력 필드의 값을 담은 [`FormData`](https://developer.mozilla.org/ko/docs/Web/API/FormData) 객체와 함께 함수를 호출합니다. 입력 필드는 [비제어](/reference/react-dom/components/input#reading-the-input-values-when-submitting-a-form) 컴포넌트일 수 있으므로, `value`/`onChange` 쌍이나 `onSubmit` 핸들러, `e.preventDefault()`가 필요하지 않습니다.

`action`에 함수를 전달하면 React는 다음과 같이 동작합니다.

* [Transition](/reference/react/useTransition) 내에서 함수를 실행합니다.
* [`useFormStatus`](/reference/react-dom/hooks/useFormStatus)를 통해 자식 컴포넌트에서 대기 상태를 사용할 수 있게 합니다.
* 발생한 모든 오류를 가장 가까운 Error Boundary로 전파합니다.
* 함수가 성공하면 폼의 비제어 필드를 초기화합니다. 값을 유지하려면 [Action 이후 폼 값 유지하기](#preserve-form-values-after-an-action)를 참고하세요.

제출을 수동으로 처리하는 경우 [`requestFormReset`으로 동일한 초기화 동작을 요청](/reference/react-dom/requestFormReset#requesting-a-reset-in-a-custom-form-action)할 수 있습니다.

Action은 Transition 내에서 실행되므로 [`useActionState`](/reference/react/useActionState)를 사용하여 폼 상태를 관리하고 [`useOptimistic`](/reference/react/useOptimistic)을 사용하여 낙관적 UI를 구현할 수도 있습니다. [서버 함수](/reference/rsc/server-functions)와 점진적 향상에 대해서는 [서버 함수로 폼 제출 처리하기](#handle-form-submission-with-a-server-function)를 참고하세요.

<Sandpack>

```js src/App.js
export default function Search() {
  function search(formData) {
    const query = formData.get('query');
    alert(`'${query}'을(를) 검색했습니다.`);
  }
  return (
    <form action={search}>
      <input name="query" />
      <button type="submit">검색</button>
    </form>
  );
}
```

</Sandpack>

---

### 서버 함수로 폼 제출 처리하기 {/*handle-form-submission-with-a-server-function*/}

`<form>`의 `action` Prop은 사용자가 폼을 제출할 때 서버 함수([`'use server'`](/reference/rsc/use-server)가 표시된 함수)를 실행할 수 있습니다. 사용자는 자바스크립트가 로드되기 전이나 자바스크립트가 비활성화된 경우에도 폼을 제출할 수 있습니다. 이는 `action`에 URL을 전달했을 때 폼이 동작하는 방식과 일치합니다.

React는 폼의 [`FormData`](https://developer.mozilla.org/ko/docs/Web/API/FormData)와 함께 서버 함수를 호출하며, `name` 어트리뷰트가 있는 모든 입력 필드를 포함합니다. Props에서 전달받은 ID와 같은 추가 데이터를 전달하려면 [Action에 추가 데이터 전달하기](#passing-extra-data-to-an-action)를 참고하세요.

```jsx
import { addComment } from './actions.js';

function CommentForm() {
  return (
    <form action={addComment}>
      <textarea name="comment" />
      <button type="submit">Comment</button>
    </form>
  );
}
```

```js
// actions.js
'use server';

export async function addComment(formData) {
  const comment = formData.get('comment');
  // ...
}
```

<DeepDive>

#### Action에 추가 데이터 전달하기 {/*passing-extra-data-to-an-action*/}

Action은 제출된 [`FormData`](https://developer.mozilla.org/ko/docs/Web/API/FormData)를 받습니다. Props로 전달받은 ID처럼 사용자가 직접 입력하지 않은 데이터를 포함하려면 다음 방법 중 하나를 사용하세요.

* **숨겨진 필드(`hidden`)** 는 `FormData`에 값을 추가합니다. 값은 HTML에 나타나며 `formData.get`은 문자열을 반환합니다. 사용자는 자바스크립트가 로드되기 전에 폼을 제출할 수 있습니다.
* **`bind`로 바인딩하기** 는 `formData` 앞에 서버 함수의 인수로 값을 전달합니다. 인수는 원래 타입을 유지하므로 숫자는 숫자로 유지됩니다. 값은 반드시 [직렬화 가능](/reference/rsc/use-server#serializable-parameters-and-return-values)해야 합니다. 사용자는 자바스크립트가 로드되기 전에 폼을 제출할 수 있습니다.
* **컴포넌트 내부 함수** 는 Props와 State를 직접 읽습니다. 자바스크립트가 로드된 후에 실행되며 해당 값들로 서버 함수를 호출합니다.

클라이언트는 숨겨진 필드 값과 바인딩된 인수를 전송합니다. 로그인한 사용자가 해당 Action을 수행할 권한이 있는지 서버에서 반드시 확인하세요. [보안 고려 사항](/reference/rsc/use-server#security)을 참고하세요.

#### 숨겨진 필드 {/*passing-extra-data-hidden-fields*/}

서버 컴포넌트에서 `name`과 `value`를 가진 `<input type="hidden">`을 렌더링하세요. React는 Action에 전달되는 `FormData`에 해당 값을 포함합니다.

```jsx
// Server Component
import { updateCart } from './lib.js';

function AddToCart({ productId }) {
  async function addToCart(formData) {
    'use server';
    await updateCart(formData.get('productId'));
  }
  return (
    <form action={addToCart}>
      <input type="hidden" name="productId" value={productId} />
      <button type="submit">Add to Cart</button>
    </form>
  );
}
```

제출 버튼으로 폼을 제출할 때 React는 해당 제출 버튼의 `name`과 `value`도 `FormData`에 포함합니다.

#### `bind`로 바인딩하기 {/*passing-extra-data-bind*/}

서버 컴포넌트에서 서버 함수에 [`bind`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)를 호출하고 바인딩된 함수를 `action`에 전달하세요. `bind`의 첫 번째 인수로는 `null`을 전달합니다. `null` 뒤의 각 인수는 폼이 제출될 때 React가 전달하는 `formData` 인수보다 앞에 위치합니다.

```jsx
// Server Component
import { updateCart } from './lib.js';

function AddToCart({ productId }) {
  async function addToCart(productId, formData) {
    'use server';
    await updateCart(productId);
  }
  const addProductToCart = addToCart.bind(null, productId);
  return (
    <form action={addProductToCart}>
      <button type="submit">장바구니에 추가</button>
    </form>
  );
}
```

폼이 제출되면 React는 `addProductToCart(formData)`를 호출하고, 이는 `addToCart(productId, formData)`를 호출합니다.

[`useActionState`](/reference/react/useActionState)도 함께 사용하는 경우, 서버 함수는 `productId`, `previousState`, `formData` 순서로 인수를 받습니다. 해당 함수를 별도의 파일에 정의하고 클라이언트 컴포넌트에서 바인딩하세요.

#### 컴포넌트 내부 함수 {/*passing-extra-data-function*/}

컴포넌트의 Props나 State를 읽을 수 있도록 클라이언트 컴포넌트 내부에서 `action`에 전달할 함수를 정의하세요. 해당 함수는 그 값들을 서버 함수에 전달합니다.

```jsx
// AddToCart.js
'use client';

import { updateCart } from './actions.js';

function AddToCart({ productId }) {
  async function addToCart(formData) {
    await updateCart(productId, formData);
  }
  return (
    <form action={addToCart}>
      <button type="submit">Add to Cart</button>
    </form>
  );
}
```

```js
// actions.js
'use server';

export async function updateCart(productId, formData) {
  // ...
}
```

`addToCart`는 브라우저에서 실행되므로 폼을 제출하려면 먼저 컴포넌트의 자바스크립트가 로드되어야 합니다.

</DeepDive>

---

### 폼이 제출되는 동안 대기 상태 보여주기 {/*display-a-pending-state-during-form-submission*/}

폼이 제출되는 동안 대기<sup>Pending</sup> 상태를 보여주기 위해, `<form>` 내부에 렌더링되는 컴포넌트 안에서 [`useFormStatus`](/reference/react-dom/hooks/useFormStatus) Hook을 호출해 반환된 `pending` 프로퍼티를 읽을 수 있습니다.

여기 폼이 제출되고 있음을 나타내기 위해 `pending` 프로퍼티를 사용하였습니다.

<Sandpack>

```js src/App.js
import { useFormStatus } from 'react-dom';
import { submitForm } from './actions.js';

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "제출중..." : "제출"}
    </button>
  );
}

function Form({ action }) {
  return (
    <form action={action}>
      <Submit />
    </form>
  );
}

export default function App() {
  return <Form action={submitForm} />;
}
```

```js src/actions.js hidden
export async function submitForm(formData) {
  await new Promise((res) => setTimeout(res, 1000));
}
```

</Sandpack>

`useFormStatus` Hook에 대해 더 알고 싶다면, [참고 문서](/reference/react-dom/hooks/useFormStatus)를 확인하세요.

---

### 낙관적으로 폼 데이터 업데이트하기 {/*optimistically-updating-form-data*/}

[`useOptimistic`](/reference/react/useOptimistic) Hook은 네트워크 요청과 같은 백그라운드의 작업이 끝나기 전에 사용자 인터페이스에 낙관적으로 업데이트하는 방법을 제공합니다. 폼의 맥락에서 이 기술은 앱을 더욱 반응형으로 느끼게 해줍니다. 사용자가 폼을 제출하면 서버의 응답을 기다려 변경 사항을 반영하는 대신, 인터페이스는 사용자가 기대하는 결과물로 즉시 업데이트됩니다.

예를 들어, 사용자가 폼에 메시지를 입력하고 "전송" 버튼을 클릭하면 `useOptimistic` Hook은 "전송중..." 라벨과 함께 메시지가 서버에 보내지기 전에 리스트에 즉시 보입니다. 이러한 '낙관적인' 접근 방식은 속도와 반응성이 뛰어나다는 인상을 줍니다. 그다음 폼은 실제로 백그라운드에 메시지 보내기를 시도합니다. 서버에 메시지가 잘 도착하면, "전송중..." 라벨은 사라집니다.

<Sandpack>

```js src/App.js
import { startTransition, useOptimistic, useState, useRef } from 'react';
import { deliverMessage } from './actions.js';

function Thread({ messages, sendMessage }) {
  const formRef = useRef(null);
  async function formAction(formData) {
    addOptimisticMessage(formData.get('message'));
    formRef.current.reset();
    await sendMessage(formData);
  }
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [
      ...state,
      {
        text: newMessage,
        sending: true
      }
    ]
  );

  return (
    <>
      {optimisticMessages.map((message, index) => (
        <div key={index}>
          {message.text}
          {!!message.sending && <small> (전송중...)</small>}
        </div>
      ))}
      <form action={formAction} ref={formRef}>
        <input type="text" name="message" placeholder="Hello!" />
        <button type="submit">전송</button>
      </form>
    </>
  );
}

export default function App() {
  const [messages, setMessages] = useState([
    { text: 'Hello there!', sending: false, key: 1 }
  ]);
  async function sendMessage(formData) {
    const sentMessage = await deliverMessage(formData.get('message'));
    startTransition(() => {
      setMessages((messages) => [...messages, { text: sentMessage }]);
    });
  }
  return <Thread messages={messages} sendMessage={sendMessage} />;
}
```

```js src/actions.js
export async function deliverMessage(message) {
  // 메시지 전송 지연을 시뮬레이션합니다.
  await new Promise((res) => setTimeout(res, 1000));
  return message;
}
```

</Sandpack>

`useOptimistic` Hook에 대해 더 알고 싶다면, [참고 문서](/reference/react/useOptimistic)를 확인하세요.

---

### 폼 제출 오류 처리하기 {/*handling-form-submission-errors*/}

`<form>`의 `action` 프로퍼티로 전달된 함수에서 발생하는 오류를 처리하려면 `<form>`을 [Error Boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary)로 감싸세요. 함수에서 오류를 던지면 React는 Error Boundary의 Fallback을 표시합니다.

<Sandpack>

```js src/App.js
import { ErrorBoundary } from 'react-error-boundary';

export default function Search() {
  function search() {
    throw new Error('search error');
  }
  return (
    <ErrorBoundary
      fallback={<p>폼 제출 중에 오류가 발생했습니다.</p>}
    >
      <form action={search}>
        <input name="query" />
        <button type="submit">검색</button>
      </form>
    </ErrorBoundary>
  );
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```

</Sandpack>

#### 자바스크립트가 로드되기 전에 폼 제출 오류 처리하기 {/*display-a-form-submission-error-without-javascript*/}

점진적 향상을 위해 자바스크립트 번들이 로드되기 전 오류 메시지를 보여주려면 다음 요소들이 지켜져야 합니다.

1. `<form>`이 [클라이언트 컴포넌트](/reference/rsc/use-client)에 의해 렌더링되어야 합니다.
1. `<form>`의 `action` 프로퍼티에 전달된 함수가 [서버 함수](/reference/rsc/server-functions)여야 합니다.
1. 오류 메시지를 표시하기 위해 [`useActionState`](/reference/react/useActionState) Hook을 사용해야 합니다.

[`'use server'`](/reference/rsc/use-server) 지시어를 사용하여 별도의 파일에 서버 함수를 정의하세요. 이 함수는 이전 State와 제출된 `FormData`를 차례로 받습니다.

```js
// actions.js
'use server';

import { signUpNewUser } from './api.js';

export async function signup(previousState, formData) {
  const email = formData.get('email');
  try {
    await signUpNewUser(email);
    return null;
  } catch (error) {
    return error.message;
  }
}
```

클라이언트 컴포넌트에서 서버 함수를 `useActionState`에 전달하세요. 반환된 Action을 폼의 `action` 프로퍼티에 전달하고 반환된 State를 렌더링합니다.

```js
// Signup.js
'use client';

import { useActionState } from 'react';
import { signup } from './actions.js';

export default function Signup() {
  const [message, signupAction] = useActionState(signup, null);
  return (
    <form action={signupAction}>
      <label htmlFor="email">이메일: </label>
      <input name="email" id="email" placeholder="react@example.com" />
      <button>가입하기</button>
      {message && <p>{message}</p>}
    </form>
  );
}
```

자바스크립트가 로드되기 전에 폼이 제출되면 React는 서버에서 렌더링된 응답에 서버 함수가 반환한 오류 메시지를 포함합니다.

---

### Action 이후 폼 값 유지하기 {/*preserve-form-values-after-an-action*/}

`action` 또는 `formAction`에 전달된 함수가 오류를 던지지 않고 완료되면 React는 폼의 [비제어 필드](/reference/react-dom/components/input#reading-the-input-values-when-submitting-a-form)를 초기화합니다. 수정 사항을 저장한 후나 Action이 [유효성 검사 오류](/reference/react/useActionState#displaying-validation-errors-and-preserving-form-values)를 반환할 때 제출된 값을 그대로 유지하고 싶을 수 있습니다.

이러한 값을 유지하려면 [`useState`](/reference/react/useState)로 값을 저장하고 각 필드의 [`defaultValue`](/reference/react-dom/components/input#providing-an-initial-value-for-an-input)에 전달하세요. Action이 완료될 때 State를 업데이트합니다. React는 폼을 초기화하기 전에 업데이트된 기본값을 적용하므로 필드는 해당 값을 유지합니다.

제목을 변경하고 **Save**를 클릭해 보세요. 이 예시에서 [`useFormStatus`](/reference/react-dom/hooks/useFormStatus)는 1초간의 시뮬레이션된 요청 동안 "Saving..."을 표시합니다. 그 후 `setTitle`이 저장된 제목을 업데이트하고 입력 필드에 그 값을 유지합니다.

<Sandpack>

```js src/App.js
import { startTransition, useState } from 'react';
import SaveButton from './SaveButton.js';

export default function EditForm() {
  const [title, setTitle] = useState('My draft');

  async function saveAction(formData) {
    await new Promise((res) => setTimeout(res, 1000));
    startTransition(() => {
      setTitle(formData.get('title'));
    });
  }

  return (
    <form action={saveAction}>
      <input name="title" defaultValue={title} />
      <SaveButton />
      <p>Saved title: {title}</p>
    </form>
  );
}
```

```js src/SaveButton.js hidden
import { useFormStatus } from 'react-dom';

export default function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Save'}
    </button>
  );
}
```

</Sandpack>

[`await` 이후](/reference/react/useTransition#react-doesnt-treat-my-state-update-after-await-as-a-transition)의 `setTitle` 호출을 Transition 업데이트로 표시하려면 또 다른 [`startTransition`](/reference/react/startTransition)이 필요합니다.

`saveAction`은 또한 [서버 함수](/reference/rsc/server-functions)를 호출하고 그 반환값을 저장할 수도 있습니다.

```js
// actions.js
'use server';

import { saveTitle } from './api.js';

export async function submitTitle(formData) {
  const title = formData.get('title');
  await saveTitle(title);
  return title;
}
```

컴포넌트 파일 상단에 [`'use client'`](/reference/rsc/use-client)를 추가하고, `submitTitle`을 가져온 뒤 `saveAction`을 교체하세요. 폼의 나머지 부분은 동일하게 유지됩니다.

```js
import { submitTitle } from './actions.js';

async function saveAction(formData) {
  const savedTitle = await submitTitle(formData);
  startTransition(() => {
    setTitle(savedTitle);
  });
}
```

#### 자바스크립트가 로드되기 전에 폼 값 유지하기 {/*preserving-form-values-before-javascript-loads*/}

[`useActionState`](/reference/react/useActionState)를 사용하면 React는 Hydration이 완료되기 전에 [서버 함수](/reference/rsc/server-functions)의 반환값을 표시할 수 있습니다. 폼은 해당 값을 새로운 기본값으로 사용할 수 있습니다. [클라이언트 컴포넌트](/reference/rsc/use-client)에서 `useActionState`는 서버 함수를 받아 폼의 `action` 프로퍼티에 전달할 Action을 반환합니다.

오류에 대한 동일한 동작은 [자바스크립트가 로드되기 전에 폼 제출 오류 처리하기](#display-a-form-submission-error-without-javascript)를 참고하세요.

서버 함수는 이전 State와 제출된 `FormData`를 차례로 받습니다. 이 예시에서 `updateTitle`은 제목을 저장하고 새로운 State가 될 `{ title }`을 반환합니다. `state.title`을 `defaultValue`에 전달하면 초기화 후에도 저장된 제목이 유지됩니다.

```js
// actions.js
'use server';

import { saveTitle } from './api.js';

export async function updateTitle(previousState, formData) {
  const title = formData.get('title');
  await saveTitle(title);
  return { title };
}
```

```js
// EditForm.js
'use client';

import { useActionState } from 'react';
import { updateTitle } from './actions.js';

export default function EditForm() {
  const [state, updateTitleAction, isPending] = useActionState(updateTitle, {
    title: 'My draft',
  });

  return (
    <form action={updateTitleAction}>
      <input name="title" defaultValue={state.title} />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
```

<DeepDive>

#### 폼 초기화를 제어하는 다른 방법 {/*other-ways-to-control-form-resets*/}

위의 예시들은 초기화 전에 제출된 모든 값을 저장하여 유지합니다. 어떤 값을 유지할지, 또는 언제 초기화를 실행할지 선택할 수도 있습니다.

* **유효성 검사에 실패했을 때만 값 유지하기.** 모든 제출에서 동일한 형태의 State를 반환하세요. 유효성 검사에 실패하면 제출된 `FormData`를 포함하고 `state.submitted?.get('title') ?? ''`로 각 필드를 읽습니다. 유효성 검사에 성공하면 해당 `FormData`를 `null`로 설정하여 초기화 시 필드가 비워지도록 합니다. [`useActionState`](/reference/react/useActionState#displaying-validation-errors-and-preserving-form-values)에서 이 패턴을 확인할 수 있습니다.

* **`onSubmit`으로 초기화 건너뛰기.** `onSubmit`에서 제출을 처리하고, `e.preventDefault()`를 호출한 뒤 [`startTransition`](/reference/react/useTransition) 내부에서 Action을 실행하세요. 폼의 `action`이 실행되지 않으므로 React는 폼을 초기화하지 않습니다.

* **특정 시점에 초기화하기.** 폼 엘리먼트의 [`reset()`](https://developer.mozilla.org/ko/docs/Web/API/HTMLFormElement/reset) 메서드를 호출하여 비제어 필드를 기본값으로 즉시 초기화합니다. Action이나 Transition의 일부로 초기화를 예약하려면 대신 `react-dom`의 [`requestFormReset`](/reference/react-dom/requestFormReset)을 호출하세요.

* **폼과 컴포넌트 State 함께 초기화하기.** 폼을 렌더링하는 컴포넌트의 [`key`](/learn/preserving-and-resetting-state#resetting-a-form-with-a-key)를 변경하세요. React가 컴포넌트와 해당 DOM을 다시 생성하므로 모든 필드와 로컬 State가 초기화됩니다.

</DeepDive>

---

### 다양한 제출 타입 처리하기 {/*handling-multiple-submission-types*/}

폼에는 각각 다른 Action을 실행하는 여러 개의 제출 버튼이 있을 수 있습니다. `formAction`이 없는 버튼은 폼의 `action`을 실행하고, `formAction`이 있는 버튼은 대신 자체 Action을 실행합니다. 예를 들어, 아래 폼은 기본적으로 글을 발행하지만 **초안 저장** 버튼은 글을 발행하지 않고 현재 내용을 저장합니다. 여기서는 [`useActionState`](/reference/react/useActionState)를 사용하여 저장된 초안을 유지합니다.

<Sandpack>

```js src/App.js
import { useActionState } from 'react';

export default function ArticleForm() {
  // 제출 후 저장된 초안을 유지합니다.
  const [formState, dispatchFormState] = useActionState((state, payload) => {
    const content = payload.data.get('content');
    switch (payload.type) {
      case 'save':
        alert(`'${content}' 초안이 저장되었습니다!`);
        return payload.data;
      case 'publish':
        alert(`'${content}'가 발행되었습니다!`);
        return new FormData();
      default:
        return state;
    }
  }, new FormData());

  function publish(formData) {
    dispatchFormState({
      type: 'publish',
      data: formData,
    });
  }

  function save(formData) {
    dispatchFormState({
      type: 'save',
      data: formData,
    });
  }

  return (
    <form action={publish}>
      <textarea
        name="content"
        rows={4}
        cols={40}
        defaultValue={formState?.get('content') || ''}
      />
      <br />
      <button type="submit" name="button" value="submit">발행</button>
      <button formAction={save}>초안 저장</button>
    </form>
  );
}
```

</Sandpack>

---

## 문제 해결 {/*troubleshooting*/}

### 제출 후 폼 필드가 비워집니다 {/*my-form-fields-are-cleared-after-submission*/}

`action`이나 `formAction`에 전달된 함수가 성공하면 React는 폼의 비제어 필드를 기본값으로 초기화합니다. `defaultValue`가 없는 텍스트 필드는 비워집니다. 오류를 던지는 대신 유효성 검사 오류를 반환하는 경우에도 이러한 초기화가 실행됩니다.

제출된 값을 유지하려면 값을 State에 저장하고 필드의 `defaultValue`에 전달하세요. 예시는 [Action 이후 폼 값 유지하기](#preserve-form-values-after-an-action) 또는 [유효성 검사 실패 시 값 유지하기](/reference/react/useActionState#displaying-validation-errors-and-preserving-form-values)를 참고하세요.
