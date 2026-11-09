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

* [`action`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#action): A string containing a URL, or a function. If you pass a URL, the form behaves like a standard HTML form. If you pass a function, it handles the submission. See [Handling form submission with an action prop](#handle-form-submission-with-an-action-prop).
  * If you pass a function to `action`, React runs it in a [Transition](/reference/react/useTransition) following [the Action prop pattern](/reference/react/useTransition#exposing-action-props-from-components).
  * The function may be async. React calls it with a single argument containing the [form data](https://developer.mozilla.org/en-US/docs/Web/API/FormData) of the submitted form.
  * A `formAction` prop on a `<button>`, `<input type="submit">`, or `<input type="image">` overrides this `action`.
* [`method`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#method): A string that specifies the HTTP method to use when `action` is a URL. Defaults to `get`.
* `onSubmit`: An [`Event` handler](/reference/react-dom/components/common#react-event-object) function. Fires when the form is submitted. See [Handling form submission with an event handler](#handle-form-submission-with-an-event-handler).

#### 주의 사항 {/*caveats*/}

<<<<<<< HEAD
* 함수를 `action`이나 `formAction`에 전달하면, HTTP 메서드는 `method` 프로퍼티의 값과 관계없이 POST로 처리합니다.
=======
* If you pass a function to `action` or `formAction`, the HTTP method will be `POST` regardless of the value of the `method` prop.
* If you pass a function to `action` or `formAction`, React resets all [uncontrolled](/reference/react-dom/components/input#reading-the-input-values-when-submitting-a-form) field elements after the Action succeeds. See [Preserving form values after an Action](#preserve-form-values-after-an-action).
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

---

## 사용법 {/*usage*/}

<<<<<<< HEAD
### 클라이언트에서 폼 제출 처리하기 {/*handle-form-submission-on-the-client*/}

폼이 제출될 때 함수를 실행하기 위해, 폼의 `action` 프로퍼티에 함수를 전달하세요. [`formData`](https://developer.mozilla.org/ko/docs/Web/API/FormData)가 함수에 인수로 전달되어, 폼에서 전달된 데이터에 접근할 수 있습니다. 이 점이 URL만 받던 기존 [HTML action](https://developer.mozilla.org/ko/docs/Web/HTML/Element/form)과의 차이점입니다. After the `action` function succeeds, all uncontrolled field elements in the form are reset.
=======
### Handling form submission with an event handler {/*handle-form-submission-with-an-event-handler*/}

Pass a function to the `onSubmit` event handler to run code when the form is submitted. By default, the browser sends the form data to the current URL and refreshes the page. Calling [`e.preventDefault()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault) in the event handler overrides this behavior.

If you also pass a function to `action`, React runs it after `onSubmit` unless `onSubmit` calls `e.preventDefault()`.

<Sandpack>

```js src/App.js
export default function Search() {
  function handleSubmit(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const query = formData.get('query');
    alert(`You searched for '${query}'`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="query" />
      <button type="submit">Search</button>
    </form>
  );
}
```

</Sandpack>

<Note>

`onSubmit` works in every version of React and gives you direct access to the [submit event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event). Starting in React 19, the [`action` prop](#handle-form-submission-with-an-action-prop) is the preferred API for form submissions. With `action`, React runs the submission in a [Transition](/reference/react/useTransition) and manages pending state and concurrency across multiple submissions. You can also use optimistic updates, Error Boundaries, and [Server Functions](/reference/rsc/server-functions).

</Note>

---

### Handling form submission with an action prop {/*handle-form-submission-with-an-action-prop*/}

Pass a function to the `action` prop to run it when the form is submitted. React calls the function with a [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) object containing the values of every input with a `name` attribute. Your inputs can be [uncontrolled](/reference/react-dom/components/input#reading-the-input-values-when-submitting-a-form). You don't need `value`/`onChange` pairs, an `onSubmit` handler, or `e.preventDefault()`.

When you pass a function to `action`, React:

* Runs the function in a [Transition](/reference/react/useTransition).
* Makes the pending state available to child components via [`useFormStatus`](/reference/react-dom/hooks/useFormStatus).
* Propagates any errors to the nearest Error Boundary.
* Resets the form's uncontrolled fields when the function succeeds. To keep their values, see [Preserving form values after an Action](#preserve-form-values-after-an-action).

Because the Action runs in a Transition, you can also use [`useActionState`](/reference/react/useActionState) to manage form state and [`useOptimistic`](/reference/react/useOptimistic) for optimistic UI. For [Server Functions](/reference/rsc/server-functions) and progressive enhancement, see [Handling form submission with a Server Function](#handle-form-submission-with-a-server-function).
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

<Sandpack>

```js src/App.js
export default function Search() {
  function search(formData) {
<<<<<<< HEAD
    const query = formData.get("query");
    alert(`'${query}'을(를) 검색했습니다.`);
=======
    const query = formData.get('query');
    alert(`You searched for '${query}'`);
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3
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

<<<<<<< HEAD
### 서버 함수에서 폼 제출 처리하기 {/*handle-form-submission-with-a-server-function*/}

입력 및 제출 버튼과 함께 `<form>`을 렌더링하세요. 폼을 제출할 때 해당 함수를 실행하기 위해 서버 함수([`'use server'`](/reference/rsc/use-server)가 표시된 함수)를 폼의 `action` 프로퍼티로 전달하세요.

`<form action>`에 서버 함수를 전달하면 자바스크립트가 활성화되기 전이나 코드가 로드되기 전에 사용자가 폼을 제출할 수 있습니다. 이는 연결 상태나 기계가 느리거나 자바스크립트가 비활성화된 사용자에게 유용하고, `action` 프로퍼티에 URL이 전달될 때와 폼이 동작하는 방식은 비슷합니다.

`<form>`의 액션에 데이터를 제공하기 위해 폼 필드의 `hidden`을 사용할 수 있습니다. 서버 함수는 [`formData`](https://developer.mozilla.org/ko/docs/Web/API/FormData) 대신 `hidden`이 적용된 폼 필드 데이터를 불러올 수 있습니다.

=======
---

### Handling form submission with a Server Function {/*handle-form-submission-with-a-server-function*/}

A `<form>`'s `action` prop can run a Server Function (a function marked with [`'use server'`](/reference/rsc/use-server)) when the user submits the form. Users can submit that form before JavaScript loads or when JavaScript is disabled. This matches how forms behave when you pass a URL to `action`.

React calls the Server Function with the form's [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) and includes every input with a `name` attribute. To pass additional data, such as an ID from props, see [Passing extra data to an Action](#passing-extra-data-to-an-action).
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

```jsx
import { addComment } from './actions.js';

function CommentForm() {
  return (
<<<<<<< HEAD
    <form action={addToCart}>
        <input type="hidden" name="productId" value={productId} />
        <button type="submit">장바구니에 추가</button>
=======
    <form action={addComment}>
      <textarea name="comment" />
      <button type="submit">Comment</button>
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3
    </form>
  );
}
```

<<<<<<< HEAD
폼 액션에 따른 데이터를 제공하기 위해 `hidden` 폼 필드를 사용하는 대신에 <CodeStep step={1}>`bind`</CodeStep>를 호출해 추가 인수를 제공할 수 있습니다. 이렇게 하면 함수에 인수로 전달되는 <CodeStep step={3}>`formData`</CodeStep> 외에 새 인수(<CodeStep step={2}>`productId`</CodeStep>)가 함수에 바인딩됩니다.
=======
```js
// actions.js
'use server';
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

export async function addComment(formData) {
  const comment = formData.get('comment');
  // ...
}
```

<DeepDive>

#### Passing extra data to an Action {/*passing-extra-data-to-an-action*/}

An Action receives the submitted [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData). To include data the user did not enter, such as an ID from props, use one of these approaches:

* **Hidden fields** add the value to `FormData`. The value appears in the HTML, and `formData.get` returns a string. Users can submit the form before JavaScript loads.
* **Binding with `bind`** passes the value as an argument to a Server Function, before `formData`. The argument keeps its type, so a number stays a number. It must be [serializable](/reference/rsc/use-server#serializable-parameters-and-return-values). Users can submit the form before JavaScript loads.
* **A function in the component** reads props and state directly. It runs after JavaScript loads, then calls a Server Function with those values.

The client sends hidden field values and bound arguments. Check on the server that the logged-in user is allowed to perform the Action. See [Security considerations](/reference/rsc/use-server#security).

#### Hidden fields {/*passing-extra-data-hidden-fields*/}

In a Server Component, render an `<input type="hidden">` with a `name` and `value`. React includes that value in the `FormData` passed to the Action.

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

React includes a submit button's `name` and `value` in `FormData` when that button submits the form.

#### Binding with `bind` {/*passing-extra-data-bind*/}

In a Server Component, call [`bind`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) on the Server Function and pass the bound function to `action`. Pass `null` as the first argument to `bind`. Each argument after `null` comes before the `formData` argument React passes when the form is submitted.

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

<<<<<<< HEAD
`<form>`이 [서버 컴포넌트](/reference/rsc/use-client)에 의해 렌더링되고 [서버 함수](/reference/rsc/server-functions)가 `<form>`의 `action` 프로퍼티에 전달되면, 폼은 [점진적으로 향상](https://developer.mozilla.org/ko/docs/Glossary/Progressive_Enhancement)됩니다.

### 폼이 제출되는 동안 대기 상태 보여주기 {/*display-a-pending-state-during-form-submission*/}
=======
When the form is submitted, React calls `addProductToCart(formData)`, which calls `addToCart(productId, formData)`.

If you also use [`useActionState`](/reference/react/useActionState), the Server Function receives `productId`, `previousState`, and `formData`, in that order. Define that function in a separate file and bind it from the Client Component.

#### A function in the component {/*passing-extra-data-function*/}

Define the function passed to `action` in the Client Component so it can read the component's props or state. That function passes those values to a Server Function.

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

Because `addToCart` runs in the browser, the component's JavaScript must load before the form can submit.

</DeepDive>

---

### Displaying a pending state during form submission {/*display-a-pending-state-during-form-submission*/}

To display a pending state when a form is being submitted, you can call the [`useFormStatus`](/reference/react-dom/hooks/useFormStatus) Hook in a component rendered in a `<form>` and read the `pending` property returned.
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

폼이 제출되는 동안 대기<sup>Pending</sup> 상태를 보여주기 위해, `<form>`이 렌더링되는 컴포넌트 안에서 `useFormStatus` Hook을 호출해 반환된 `pending` 프로퍼티를 읽을 수 있습니다.

여기 폼이 제출되고 있음을 나타내기 위해 `pending` 프로퍼티를 사용하였습니다.

<Sandpack>

```js src/App.js
import { useFormStatus } from 'react-dom';
import { submitForm } from './actions.js';

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
<<<<<<< HEAD
      {pending ? "제출중..." : "제출"}
=======
      {pending ? 'Submitting...' : 'Submit'}
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3
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

<<<<<<< HEAD
`useFormStatus` Hook에 대해 더 알고 싶다면, [참고 문서](/reference/react-dom/hooks/useFormStatus)를 확인하세요.

### 낙관적으로 폼 데이터 업데이트하기 {/*optimistically-updating-form-data*/}

`useOptimistic` Hook은 네트워크 요청과 같은 백그라운드의 작업이 끝나기 전에 사용자 인터페이스에 낙관적으로 업데이트하는 방법을 제공합니다. 폼의 맥락에서 이 기술은 앱을 더욱 반응형으로 느끼게 해줍니다. 사용자가 폼을 제출하면 인터페이스는 사용자가 기대하는 결과물로 즉시 업데이트됩니다.

예를 들어, 사용자가 폼에 메시지를 입력하고 "전송" 버튼을 클릭하면 `useOptimistic` Hook은 "전송중..." 라벨과 함께 메시지가 서버에 보내지기 전에 리스트에 즉시 보입니다. 이러한 '낙관적인' 접근 방식은 속도와 반응성이 뛰어나다는 인상을 줍니다. 그다음 폼은 실제로 백그라운드에 메시지 보내기를 시도합니다. 서버에 메시지가 잘 도착하면, "전송중..." 라벨은 사라집니다.
=======
To learn more about the `useFormStatus` Hook, see the [reference documentation](/reference/react-dom/hooks/useFormStatus).

---

### Optimistically updating form data {/*optimistically-updating-form-data*/}

The [`useOptimistic`](/reference/react/useOptimistic) Hook provides a way to optimistically update the user interface before a background operation, like a network request, completes. In the context of forms, this technique helps to make apps feel more responsive. When a user submits a form, instead of waiting for the server's response to reflect the changes, the interface is immediately updated with the expected outcome.
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3


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
  // Simulate a message delivery delay
  await new Promise((res) => setTimeout(res, 1000));
  return message;
}
```

</Sandpack>

To learn more about the `useOptimistic` Hook, see the [reference documentation](/reference/react/useOptimistic).

---

### 폼 제출 오류 처리하기 {/*handling-form-submission-errors*/}

<<<<<<< HEAD
`<form>`의 `action` 프로퍼티로 전달된 어떤 함수는 오류를 던지기도 합니다. 이런 오류를 `<form>`에 에러 바운더리를 감싸 해결할 수 있습니다. 만약 `<form>`의 `action` 프로퍼티에서 호출된 함수가 오류를 던진다면 에러 바운더리의 Fallback이 보이게 됩니다.
=======
To handle errors thrown by a function passed to a `<form>`'s `action` prop, wrap the form in an [Error Boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary). React displays the boundary's fallback when the function throws.
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

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

<<<<<<< HEAD
### 자바스크립트 없이 폼 제출 오류 보여주기 {/*display-a-form-submission-error-without-javascript*/}
=======
#### Handling form submission errors before JavaScript loads {/*display-a-form-submission-error-without-javascript*/}
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

점진적 향상을 위해 자바스크립트 번들이 로드되기 전 오류 메시지를 보여주기 위해 다음 요소들이 지켜져야 합니다.

1. `<form>` be rendered by a [Client Component](/reference/rsc/use-client)
1. the function passed to the `<form>`'s `action` prop be a [Server Function](/reference/rsc/server-functions)
1. the [`useActionState`](/reference/react/useActionState) Hook be used to display the error message

<<<<<<< HEAD
`useActionState`는 [서버 함수](/reference/rsc/use-server)와 초기 State라는 두 개의 매개변수를 가집니다. `useActionState`는 State 변수와 액션이라는 두 개의 값을 반환합니다. `useActionState`를 통해 반환된 액션은 폼의 `action` 프로퍼티에 전달될 수 있습니다. `useActionState`를 통해 반환된 상태 변수는 오류 메시지를 보여주는 데 사용됩니다. `useActionState`에 전달된 [서버 함수](/reference/rsc/server-functions)에서 반환된 값은 State 변수를 업데이트하는 데 사용됩니다.
=======
Define the Server Function in a separate file with the [`'use server'`](/reference/rsc/use-server) directive. It receives the previous state followed by the submitted `FormData`:
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

```js
// actions.js
'use server';

import { signUpNewUser } from './api.js';

<<<<<<< HEAD
export default function Page() {
  async function signup(prevState, formData) {
    "use server";
    const email = formData.get("email");
    try {
      await signUpNewUser(email);
      alert(`"${email}"을 등록했어요`);
    } catch (err) {
      return err.toString();
    }
=======
export async function signup(previousState, formData) {
  const email = formData.get('email');
  try {
    await signUpNewUser(email);
    return null;
  } catch (error) {
    return error.message;
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3
  }
}
```

In a Client Component, pass the Server Function to `useActionState`. Pass the returned Action to the form's `action` prop and render the returned state:

```js
// Signup.js
'use client';

import { useActionState } from 'react';
import { signup } from './actions.js';

export default function Signup() {
  const [message, signupAction] = useActionState(signup, null);
  return (
<<<<<<< HEAD
    <>
      <h1>뉴스레터에 가입하세요</h1>
      <p>같은 이메일로 두 번 가입하여 오류를 확인하세요.</p>
      <form action={signupAction} id="signup-form">
        <label htmlFor="email">이메일: </label>
        <input name="email" id="email" placeholder="react@example.com" />
        <button>가입하기</button>
        {!!message && <p>{message}</p>}
      </form>
    </>
=======
    <form action={signupAction}>
      <label htmlFor="email">Email: </label>
      <input name="email" id="email" placeholder="react@example.com" />
      <button>Sign up</button>
      {message && <p>{message}</p>}
    </form>
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3
  );
}
```

If the form is submitted before JavaScript loads, React includes the Server Function's returned error message in the server-rendered response.

<<<<<<< HEAD
export async function signUpNewUser(newEmail) {
  if (emails.includes(newEmail)) {
    throw new Error("이 이메일 주소는 이미 등록되었습니다.");
=======
---

### Preserving form values after an Action {/*preserve-form-values-after-an-action*/}

When a function passed to `action` or `formAction` completes without throwing, React resets the form's [uncontrolled fields](/reference/react-dom/components/input#reading-the-input-values-when-submitting-a-form). You may want to keep the submitted values after saving edits, or when the Action returns a [validation error](/reference/react/useActionState#displaying-validation-errors-and-preserving-form-values).

To preserve those values, you can store them with [`useState`](/reference/react/useState) and pass them to each field's [`defaultValue`](/reference/react-dom/components/input#providing-an-initial-value-for-an-input). Update the state when the Action finishes. React applies the updated defaults before resetting the form, so the fields keep those values.

Try changing the title and clicking **Save**. In this example, [`useFormStatus`](/reference/react-dom/hooks/useFormStatus) shows "Saving..." during a simulated one-second request. Then `setTitle` updates the saved title and preserves it in the input.

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
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3
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

<<<<<<< HEAD
[`useActionState`](/reference/react/useActionState) 문서를 통해 폼 작업에서 상태를 업데이트하는 방법에 대해 자세히 알아보세요.
=======
The call to `setTitle` [after `await`](/reference/react/useTransition#react-doesnt-treat-my-state-update-after-await-as-a-transition) needs another [`startTransition`](/reference/react/startTransition) to mark it as a Transition update.

`saveAction` can also call a [Server Function](/reference/rsc/server-functions) and store its return value:

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

Add [`'use client'`](/reference/rsc/use-client) at the top of the component's file, import `submitTitle`, and replace `saveAction`. The rest of the form stays the same:

```js
import { submitTitle } from './actions.js';

async function saveAction(formData) {
  const savedTitle = await submitTitle(formData);
  startTransition(() => {
    setTitle(savedTitle);
  });
}
```

#### Preserving form values before JavaScript loads {/*preserving-form-values-before-javascript-loads*/}

With [`useActionState`](/reference/react/useActionState), React can display a [Server Function](/reference/rsc/server-functions)'s returned value before hydration completes. The form can use those values as its new defaults. In a [Client Component](/reference/rsc/use-client), `useActionState` receives the Server Function and returns an Action for the form's `action` prop.

See [Handling form submission errors before JavaScript loads](#display-a-form-submission-error-without-javascript) for the same behavior with errors.

The Server Function receives the previous state followed by the submitted `FormData`. In this example, `updateTitle` saves the title and returns `{ title }`, which becomes the new state. Passing `state.title` to `defaultValue` preserves the saved title after the reset:

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

#### Other ways to control form resets {/*other-ways-to-control-form-resets*/}

The examples above keep every submitted value by storing it before the reset. You can also choose which values survive, or when the reset runs:

* **Keep values only when validation fails.** Return the same state shape from every submission. When validation fails, include the submitted `FormData` and read each field with `state.submitted?.get('title') ?? ''`. When validation succeeds, set that `FormData` to `null` so the reset clears those fields. [`useActionState`](/reference/react/useActionState#displaying-validation-errors-and-preserving-form-values) shows this pattern.

* **Skip the reset with `onSubmit`.** Handle the submission in `onSubmit`, call `e.preventDefault()`, and run the Action inside [`startTransition`](/reference/react/useTransition). Because the form's `action` does not run, React does not reset the form.

* **Reset at a specific moment.** Call the form element's [`reset()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/reset) method to immediately reset uncontrolled fields to their default values. To schedule a reset as part of an Action or Transition, call [`requestFormReset`](/blog/2024/12/05/react-19#form-actions) from `react-dom` instead.

* **Reset the form and the component state together.** Change the [`key`](/learn/preserving-and-resetting-state#resetting-a-form-with-a-key) of the component that renders the form. React recreates the component and its DOM, which resets the fields and any local state.

</DeepDive>

---
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

### 다양한 제출 타입 처리하기 {/*handling-multiple-submission-types*/}

<<<<<<< HEAD
사용자가 누른 버튼에 따라 여러 제출 작업을 처리하도록 폼을 설계할 수 있습니다. 폼 내부의 각 버튼은 `formAction` 프로퍼티를 설정하여 고유한 동작 또는 동작과 연결할 수 있습니다.

사용자가 특정 버튼을 클릭하면 폼이 제출되고 해당 버튼의 속성 및 동작으로 정의된 해당 동작이 실행됩니다. 예를 들어, 폼은 기본적으로 검토를 위해 문서를 제출하지만 `formAction`이 설정된 별도의 버튼이 있어 문서를 초안으로 저장할 수 있습니다.
=======
A form can have more than one submit button, each running a different Action. A button without `formAction` runs the form's `action`; a button with `formAction` runs its own Action instead. For example, the form below publishes an article by default, but its **Save draft** button stores the current content without publishing it. It uses [`useActionState`](/reference/react/useActionState) to preserve the saved draft:
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

<Sandpack>

```js src/App.js
import { useActionState } from 'react';

export default function ArticleForm() {
  // Preserve the saved draft after submission
  const [formState, dispatchFormState] = useActionState((state, payload) => {
    const content = payload.data.get('content');
    switch (payload.type) {
      case 'save':
        alert(`Your draft of '${content}' was saved!`);
        return payload.data;
      case 'publish':
        alert(`'${content}' was published!`);
        return new FormData();
      default:
        return state;
    }
  }, new FormData());

  function publish(formData) {
<<<<<<< HEAD
    const content = formData.get("content");
    const button = formData.get("button");
    alert(`'${button}' 버튼으로 '${content}'가 발행되었습니다.`);
  }

  function save(formData) {
    const content = formData.get("content");
    alert(`'${content}' 초안이 저장되었습니다!`);
=======
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
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3
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

## Troubleshooting {/*troubleshooting*/}

### My form fields are cleared after submission {/*my-form-fields-are-cleared-after-submission*/}

When a function passed to `action` or `formAction` succeeds, React resets the form's uncontrolled fields to their default values. Text fields without a `defaultValue` become empty. Returning a validation error instead of throwing also triggers this reset.

To keep a submitted value, store it in state and pass it to the field's `defaultValue`. See [Preserving form values after an Action](#preserve-form-values-after-an-action) for examples, or [preserving values when validation fails](/reference/react/useActionState#displaying-validation-errors-and-preserving-form-values).
