---
title: useFormStatus
canary: true
---

<Canary>

`useFormStatus` Hook은 현재 React의 Canary 채널과 실험적인 채널에서만 사용할 수 있습니다. 자세한 내용은 [React 릴리즈 채널](/community/versioning-policy#all-release-channels)에서 확인할 수 있습니다.

</Canary>

<Intro>

`useFormStatus`는 마지막 폼 제출의 상태 정보를 제공하는 Hook입니다.

```js
const { pending, data, method, action } = useFormStatus();
```

</Intro>

<InlineToc />

---

## 레퍼런스 {/*reference*/}

### `useFormStatus()` {/*use-form-status*/}

`useFormStatus` Hook은 마지막 폼 제출의 상태 정보를 제공합니다.

```js {5},[[1, 6, "status.pending"]]
import { useFormStatus } from "react-dom";
import action from './actions';

function Submit() {
  const status = useFormStatus();
  return <button disabled={status.pending}>Submit</button>
}

export default function App() {
  return (
    <form action={action}>
      <Submit />
    </form>
  );
}
```

상태 정보를 제공받기 위해 `Submit` 컴포넌트를 `<form>` 내부에 렌더링해야 합니다. 이 Hook은 폼이 현재 제출하고 있는 상태인지를 의미하는 <CodeStep step={1}>`pending`</CodeStep> 프로퍼티와 같은 상태 정보를 반환합니다.

위의 예시에서 `Submit` 컴포넌트는 폼이 제출 중일 때 `<button>`을 누를 수 없도록 하기 위해 이 정보를 활용합니다.

[아래에서 더 많은 예시를 확인해 보세요.](#usage)

#### 매개변수 {/*parameters*/}

`useFormStatus`은 어떤 매개변수도 받지 않습니다.

#### 반환값 {/*returns*/}

다음의 프로퍼티를 가지는 `status` 객체를 반환합니다:

* `pending`: 불리언 값입니다. `true`라면 상위 `<form>`이 아직 제출 중이라는 것을 의미합니다. 그렇지 않으면 `false`입니다.

* `data`: [`FormData 인터페이스`](https://developer.mozilla.org/ko/docs/Web/API/FormData)를 구현한 객체로, 상위 `<form>`이 제출하는 데이터를 포함합니다. 활성화된 제출이 없거나 상위에 `<form>`이 없는 경우에는 `null`입니다.

* `method`: `'get'` 또는 `'post'` 중 하나의 문자열 값입니다. 이 프로퍼티는 상위 `<form>`이 `GET` 또는 `POST` [HTTP 메서드](https://developer.mozilla.org/ko/docs/Web/HTTP/Methods)를 사용하여 제출되는지를 나타냅니다. 기본적으로 `<form>`은 `GET` 메서드를 사용하며 [`method`](https://developer.mozilla.org/ko/docs/Web/HTML/Element/form#method) 프로퍼티를 통해 지정할 수 있습니다.

[//]: # (Link to `<form>` documentation. "Read more on the `action` prop on `<form>`.")
* `action`: 상위 `<form>`의 `action` 프로퍼티로 전달한 함수의 레퍼런스입니다. 상위 `<form>`이 없는 경우에는 이 프로퍼티는 `null`입니다. `action` 프로퍼티에 URI 값이 제공되었거나 `action` 프로퍼티가 지정되지 않았을 경우에는 `status.action`은 `null`입니다.

#### 주의 사항 {/*caveats*/}

* `useFormStatus` Hook은 `<form>` 내부에 렌더링한 컴포넌트에서 호출해야 합니다.
* `useFormStatus`는 오직 상위 `<form>`에 대한 상태 정보만 반환합니다. 동일한 컴포넌트나 자식 컴포넌트에서 렌더링한 `<form>`의 상태 정보는 반환하지 않습니다.

---

## 사용법 {/*usage*/}

### 폼을 제출하는 동안 보류 중인 상태로 표시하기 {/*display-a-pending-state-during-form-submission*/}
폼을 제출하는 동안 보류 상태를 표시하려면 `<form>` 내에서 렌더링한 컴포넌트에서 `useFormStatus` Hook을 호출하고 반환된 `pending` 프로퍼티를 확인하세요.

여기서는 `pending` 프로퍼티를 사용하여 폼이 제출 중인지를 나타냅니다.

<Sandpack>

```js src/App.js
import { useFormStatus } from "react-dom";
import { submitForm } from "./actions.js";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Submitting..." : "Submit"}
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

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```
</Sandpack>  

<Pitfall>

##### `useFormStatus`는 동일한 컴포넌트에서 렌더링한 `<form>`에 대한 상태 정보를 반환하지 않습니다. {/*useformstatus-will-not-return-status-information-for-a-form-rendered-in-the-same-component*/}

`useFormStatus` Hook은 상위 `<form>`에 대한 정보만 반환합니다. Hook을 호출하는 동일한 컴포넌트나 자식 컴포넌트에서 렌더링한 `<form>`의 상태 정보는 반환하지 않습니다.

```js
function Form() {
  // 🚩 `pending`은 절대 true가 되지 않습니다
  // useFormStatus는 현재 컴포넌트에서 렌더링한 폼을 추적하지 않습니다
  const { pending } = useFormStatus();
  return <form action={submit}></form>;
}
```

대신 `<form>` 내부에 위치한 컴포넌트에서 `useFormStatus`를 호출합니다.

```js
function Submit() {
  // ✅ `pending`은 Submit 컴포넌트를 감싸는 폼에서 파생됩니다
  const { pending } = useFormStatus(); 
  return <button disabled={pending}>...</button>;
}

function Form() {
  // `useFormStatus`가 추적하는 <form>입니다
  return (
    <form action={submit}>
      <Submit />
    </form>
  );
}
```

</Pitfall>

### 제출한 폼 데이터 읽기 {/*read-form-data-being-submitted*/}

`useFormStatus`에서 반환된 상태 정보의 `data` 프로퍼티를 사용하여 사용자가 제출한 데이터를 표시할 수 있습니다.

여기에 사용자가 이름을 요청할 수 있는 폼이 있습니다. `useFormStatus`를 사용하여 사용자가 요청한 사용자 이름을 확인하는 임시 상태 메시지를 표시할 수 있습니다.

<Sandpack>

```js src/UsernameForm.js active
import {useState, useMemo, useRef} from 'react';
import {useFormStatus} from 'react-dom';

export default function UsernameForm() {
  const {pending, data} = useFormStatus();

  const [showSubmitted, setShowSubmitted] = useState(false);
  const submittedUsername = useRef(null);
  const timeoutId = useRef(null);

  useMemo(() => {
    if (pending) {
      submittedUsername.current = data?.get('username');
      if (timeoutId.current != null) {
        clearTimeout(timeoutId.current);
      }

      timeoutId.current = setTimeout(() => {
        timeoutId.current = null;
        setShowSubmitted(false);
      }, 2000);
      setShowSubmitted(true);
    }
  }, [pending, data]);

  return (
    <>
      <label>Request a Username: </label><br />
      <input type="text" name="username" />
      <button type="submit" disabled={pending}>
        {pending ? 'Submitting...' : 'Submit'}
      </button>
      {showSubmitted ? (
        <p>Submitted request for username: {submittedUsername.current}</p>
      ) : null}
    </>
  );
}
```

```js src/App.js
import UsernameForm from './UsernameForm';
import { submitForm } from "./actions.js";

export default function App() {
  return (
    <form action={submitForm}>
      <UsernameForm />
    </form>
  );
}
```

```js src/actions.js hidden
export async function submitForm(query) {
    await new Promise((res) => setTimeout(res, 1000));
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```
</Sandpack>  

---

## 문제 해결 {/*troubleshooting*/}

### `status.pending`이 절대로 `true`가 되지 않습니다 {/*pending-is-never-true*/}

`useFormStatus`는 오직 상위 `<form>`에 대한 상태 정보만 반환합니다.

`useFormStatus`를 호출하는 컴포넌트가 `<form>`에 감싸져 있지 않다면, `status.pending`은 항상 `false`를 반환합니다. `useFormStatus`가 `<form>` 엘리먼트의 자식 컴포넌트에서 호출되는지 확인하세요.

`useFormStatus`는 동일한 컴포넌트에서 렌더링한 `<form>`의 상태를 추적하지 않습니다. 자세한 내용은 [주의하세요!](#useformstatus-will-not-return-status-information-for-a-form-rendered-in-the-same-component) 에서 확인할 수 있습니다.

