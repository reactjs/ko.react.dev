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

[`action`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#action): a URL or function. When a URL is passed to `action` the form will behave like the HTML form component. When a function is passed to `action` the function will handle the form submission in a Transition following [the Action prop pattern](/reference/react/useTransition#exposing-action-props-from-components). The function passed to `action` may be async and will be called with a single argument containing the [form data](https://developer.mozilla.org/en-US/docs/Web/API/FormData) of the submitted form. The `action` prop can be overridden by a `formAction` attribute on a `<button>`, `<input type="submit">`, or `<input type="image">` component.

#### 주의 사항 {/*caveats*/}

* 함수를 `action`이나 `formAction`에 전달하면, HTTP 메서드는 `method` 프로퍼티의 값과 관계없이 POST로 처리합니다.

---

## 사용법 {/*usage*/}

### 클라이언트에서 폼 제출 처리하기 {/*handle-form-submission-on-the-client*/}

폼이 제출될 때 함수를 실행하기 위해, 폼의 `action` 프로퍼티에 함수를 전달하세요. [`formData`](https://developer.mozilla.org/ko/docs/Web/API/FormData)가 함수에 인수로 전달되어, 폼에서 전달된 데이터에 접근할 수 있습니다. 이 점이 URL만 받던 기존 [HTML action](https://developer.mozilla.org/ko/docs/Web/HTML/Element/form)과의 차이점입니다. After the `action` function succeeds, all uncontrolled field elements in the form are reset.

<Sandpack>

```js src/App.js
export default function Search() {
  function search(formData) {
    const query = formData.get("query");
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

### 서버 함수에서 폼 제출 처리하기 {/*handle-form-submission-with-a-server-action*/}

입력 및 제출 버튼과 함께 `<form>`을 렌더링하세요. 폼을 제출할 때 해당 함수를 실행하기 위해 서버 함수([`'use server'`](/reference/rsc/use-server)가 표시된 함수)를 폼의 `action` 프로퍼티로 전달하세요.

`<form action>`에 서버 함수를 전달하면 자바스크립트가 활성화되기 전이나 코드가 로드되기 전에 사용자가 폼을 제출할 수 있습니다. 이는 연결 상태나 기계가 느리거나 자바스크립트가 비활성화된 사용자에게 유용하고, `action` 프로퍼티에 URL이 전달될 때와 폼이 동작하는 방식은 비슷합니다.

`<form>`의 액션에 데이터를 제공하기 위해 폼 필드의 `hidden`을 사용할 수 있습니다. 서버 함수는 [`formData`](https://developer.mozilla.org/ko/docs/Web/API/FormData) 대신 `hidden`이 적용된 폼 필드 데이터를 불러올 수 있습니다.


```jsx
import { updateCart } from './lib.js';

function AddToCart({productId}) {
  async function addToCart(formData) {
    'use server'
    const productId = formData.get('productId')
    await updateCart(productId)
  }
  return (
    <form action={addToCart}>
        <input type="hidden" name="productId" value={productId} />
        <button type="submit">장바구니에 추가</button>
    </form>
  );
}
```

폼 액션에 따른 데이터를 제공하기 위해 `hidden` 폼 필드를 사용하는 대신에 <CodeStep step={1}>`bind`</CodeStep>를 호출해 추가 인수를 제공할 수 있습니다. 이렇게 하면 함수에 인수로 전달되는 <CodeStep step={3}>`formData`</CodeStep> 외에 새 인수(<CodeStep step={2}>`productId`</CodeStep>)가 함수에 바인딩됩니다.

```jsx [[1, 8, "bind"], [2,8, "productId"], [2,4, "productId"], [3,4, "formData"]]
import { updateCart } from './lib.js';

function AddToCart({productId}) {
  async function addToCart(productId, formData) {
    "use server";
    await updateCart(productId)
  }
  const addProductToCart = addToCart.bind(null, productId);
  return (
    <form action={addProductToCart}>
      <button type="submit">장바구니에 추가</button>
    </form>
  );
}
```

`<form>`이 [서버 컴포넌트](/reference/rsc/use-client)에 의해 렌더링되고 [서버 함수](/reference/rsc/server-functions)가 `<form>`의 `action` 프로퍼티에 전달되면, 폼은 [점진적으로 향상](https://developer.mozilla.org/ko/docs/Glossary/Progressive_Enhancement)됩니다.

### 폼이 제출되는 동안 대기 상태 보여주기 {/*display-a-pending-state-during-form-submission*/}

폼이 제출되는 동안 대기<sup>Pending</sup> 상태를 보여주기 위해, `<form>`이 렌더링되는 컴포넌트 안에서 `useFormStatus` Hook을 호출해 반환된 `pending` 프로퍼티를 읽을 수 있습니다.

여기 폼이 제출되고 있음을 나타내기 위해 `pending` 프로퍼티를 사용하였습니다.

<Sandpack>

```js src/App.js
import { useFormStatus } from "react-dom";
import { submitForm } from "./actions.js";

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
export async function submitForm(query) {
    await new Promise((res) => setTimeout(res, 1000));
}
```

</Sandpack>

`useFormStatus` Hook에 대해 더 알고 싶다면, [참고 문서](/reference/react-dom/hooks/useFormStatus)를 확인하세요.

### 낙관적으로 폼 데이터 업데이트하기 {/*optimistically-updating-form-data*/}

`useOptimistic` Hook은 네트워크 요청과 같은 백그라운드의 작업이 끝나기 전에 사용자 인터페이스에 낙관적으로 업데이트하는 방법을 제공합니다. 폼의 맥락에서 이 기술은 앱을 더욱 반응형으로 느끼게 해줍니다. 사용자가 폼을 제출하면 인터페이스는 사용자가 기대하는 결과물로 즉시 업데이트됩니다.

예를 들어, 사용자가 폼에 메시지를 입력하고 "전송" 버튼을 클릭하면 `useOptimistic` Hook은 "전송중..." 라벨과 함께 메시지가 서버에 보내지기 전에 리스트에 즉시 보입니다. 이러한 '낙관적인' 접근 방식은 속도와 반응성이 뛰어나다는 인상을 줍니다. 그다음 폼은 실제로 백그라운드에 메시지 보내기를 시도합니다. 서버에 메시지가 잘 도착하면, "전송중..." 라벨은 사라집니다.


<Sandpack>


```js src/App.js
import { useOptimistic, useState, useRef } from "react";
import { deliverMessage } from "./actions.js";

function Thread({ messages, sendMessage }) {
  const formRef = useRef();
  async function formAction(formData) {
    addOptimisticMessage(formData.get("message"));
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
    { text: "Hello there!", sending: false, key: 1 }
  ]);
  async function sendMessage(formData) {
    const sentMessage = await deliverMessage(formData.get("message"));
    setMessages((messages) => [...messages, { text: sentMessage }]);
  }
  return <Thread messages={messages} sendMessage={sendMessage} />;
}
```

```js src/actions.js
export async function deliverMessage(message) {
  await new Promise((res) => setTimeout(res, 1000));
  return message;
}
```

</Sandpack>

[//]: # 'Uncomment the next line, and delete this line after the `useOptimistic` reference documentation page is published'
[//]: # 'To learn more about the `useOptimistic` Hook see the [reference documentation](/reference/react/useOptimistic).'

### 폼 제출 오류 처리하기 {/*handling-form-submission-errors*/}

`<form>`의 `action` 프로퍼티로 전달된 어떤 함수는 오류를 던지기도 합니다. 이런 오류를 `<form>`에 에러 바운더리를 감싸 해결할 수 있습니다. 만약 `<form>`의 `action` 프로퍼티에서 호출된 함수가 오류를 던진다면 에러 바운더리의 Fallback이 보이게 됩니다.

<Sandpack>

```js src/App.js
import { ErrorBoundary } from "react-error-boundary";

export default function Search() {
  function search() {
    throw new Error("search error");
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
    "react": "19.0.0-rc-3edc000d-20240926",
    "react-dom": "19.0.0-rc-3edc000d-20240926",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```

</Sandpack>

### 자바스크립트 없이 폼 제출 오류 보여주기 {/*display-a-form-submission-error-without-javascript*/}

점진적 향상을 위해 자바스크립트 번들이 로드되기 전 오류 메시지를 보여주기 위해 다음 요소들이 지켜져야 합니다.

1. `<form>` be rendered by a [Client Component](/reference/rsc/use-client)
1. the function passed to the `<form>`'s `action` prop be a [Server Function](/reference/rsc/server-functions)
1. the `useActionState` Hook be used to display the error message

`useActionState`는 [서버 함수](/reference/rsc/use-server)와 초기 State라는 두 개의 매개변수를 가집니다. `useActionState`는 State 변수와 액션이라는 두 개의 값을 반환합니다. `useActionState`를 통해 반환된 액션은 폼의 `action` 프로퍼티에 전달될 수 있습니다. `useActionState`를 통해 반환된 상태 변수는 오류 메시지를 보여주는 데 사용됩니다. `useActionState`에 전달된 [서버 함수](/reference/rsc/server-functions)에서 반환된 값은 State 변수를 업데이트하는 데 사용됩니다.

<Sandpack>

```js src/App.js
import { useActionState } from "react";
import { signUpNewUser } from "./api";

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
  }
  const [message, signupAction] = useActionState(signup, null);
  return (
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
  );
}
```

```js src/api.js hidden
let emails = [];

export async function signUpNewUser(newEmail) {
  if (emails.includes(newEmail)) {
    throw new Error("이 이메일 주소는 이미 등록되었습니다.");
  }
  emails.push(newEmail);
}
```

</Sandpack>

[`useActionState`](/reference/react/useActionState) 문서를 통해 폼 작업에서 상태를 업데이트하는 방법에 대해 자세히 알아보세요.

### 다양한 제출 타입 처리하기 {/*handling-multiple-submission-types*/}

사용자가 누른 버튼에 따라 여러 제출 작업을 처리하도록 폼을 설계할 수 있습니다. 폼 내부의 각 버튼은 `formAction` 프로퍼티를 설정하여 고유한 동작 또는 동작과 연결할 수 있습니다.

사용자가 특정 버튼을 클릭하면 폼이 제출되고 해당 버튼의 속성 및 동작으로 정의된 해당 동작이 실행됩니다. 예를 들어, 폼은 기본적으로 검토를 위해 문서를 제출하지만 `formAction`이 설정된 별도의 버튼이 있어 문서를 초안으로 저장할 수 있습니다.

<Sandpack>

```js src/App.js
export default function Search() {
  function publish(formData) {
    const content = formData.get("content");
    const button = formData.get("button");
    alert(`'${button}' 버튼으로 '${content}'가 발행되었습니다.`);
  }

  function save(formData) {
    const content = formData.get("content");
    alert(`'${content}' 초안이 저장되었습니다!`);
  }

  return (
    <form action={publish}>
      <textarea name="content" rows={4} cols={40} />
      <br />
      <button type="submit" name="button" value="submit">발행</button>
      <button formAction={save}>초안 저장</button>
    </form>
  );
}
```

</Sandpack>
