---
title: 서버 함수
---

<RSC>

서버 함수는 [React 서버 컴포넌트](/reference/rsc/server-components)에서 사용합니다.

**참고:** 2024년 9월까지, 우리는 모든 서버 함수를 "서버 액션"으로 불렀습니다. 만약 서버 함수를 action prop으로 전달하거나 action 내부에서 호출된다면 이는 서버 액션이지만, 모든 서버 함수가 서버 액션은 아닙니다. 이 문서의 명명 규칙은 서버 함수가 여러 용도로 사용될 수 있다는 점을 반영하여 업데이트했습니다.

</RSC>

<Intro>

서버 함수<sup>Server Functions</sup>를 사용하면 클라이언트 컴포넌트가 서버에서 실행되는 비동기 함수를 호출할 수 있습니다.

</Intro>

<InlineToc />

<Note>

#### 서버 함수를 지원하려면 어떻게 해야 하나요? {/*how-do-i-build-support-for-server-functions*/}

React 19의 서버 함수는 안정적이며 마이너<sup>Minor</sup> 버전 간에는 변경되지 않습니다. 그러나 React 서버 컴포넌트 번들러나 프레임워크에서 서버 함수를 구현하는 데 사용되는 기본 API는 유의적 버전<sup>SemVer</sup>을 따르지 않으며 React 19.x의 마이너<sup>Minor</sup> 버전 간에 변경될 수 있습니다.

서버 함수를 번들러나 프레임워크로 지원하려면, 특정 React 버전에 고정하거나 Canary 릴리즈를 사용하는 것을 권장합니다. 향후 서버 함수를 구현하는 데 사용되는 API를 안정화하기 위해 번들러 및 프레임워크와 계속 협력할 것입니다.

</Note>

서버 함수가 [`"use server"`](/reference/rsc/use-server) 지시어로 정의되면, 프레임워크는 자동으로 서버 함수에 대한 참조를 생성하고 해당 참조를 클라이언트 컴포넌트에 전달합니다. 클라이언트에서 해당 함수를 호출하면, React는 서버에 함수를 실행하라는 요청<sup>Request</sup>을 보내고 결과를 반환합니다.

서버 함수는 서버 컴포넌트에서 생성하여 클라이언트 컴포넌트에 Props로 전달할 수 있으며, 클라이언트 컴포넌트에서 가져와서 사용할 수도 있습니다.

## 사용법 {/*usage*/}

<<<<<<< HEAD
### 서버 컴포넌트에서 서버 함수 만들기 {/*creating-a-server-function-from-a-server-component*/}
=======
### Creating a Server Function in a Server Component {/*creating-a-server-function-from-a-server-component*/}
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

서버 컴포넌트는 `"use server"` 지시어로 서버 함수를 정의할 수 있습니다.

```js [[2, 7, "'use server'"], [1, 5, "createNote"], [1, 12, "createNote"]]
// 서버 컴포넌트
import Button from './Button';

<<<<<<< HEAD
function EmptyNote () {
  async function createNote() {
    // 서버 함수
=======
function EmptyNote() {
  async function createNoteAction() {
    // Server Function
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3
    'use server';

    await db.notes.create();
  }

<<<<<<< HEAD
  return <Button onClick={createNote}/>;
=======
  return <Button onClick={createNoteAction} />;
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3
}
```

React가 `EmptyNote` 서버 컴포넌트를 렌더링할 때, `createNoteAction` 함수에 대한 참조를 생성하고, 그 참조를 `Button` 클라이언트 컴포넌트에 전달합니다. 버튼을 클릭하면, React는 제공된 참조를 통해 `createNoteAction` 함수를 실행하도록 서버에 요청<sup>Request</sup>을 보냅니다.

```js {5}
"use client";

export default function Button({onClick}) {
  console.log(onClick);
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNoteAction'}
  return <button onClick={() => onClick()}>Create Empty Note</button>;
}
```

자세한 내용은 [`"use server"`](/reference/rsc/use-server) 문서를 참조하세요.

<<<<<<< HEAD

### 클라이언트 컴포넌트에서 서버 함수 가져오기 {/*importing-server-functions-from-client-components*/}
=======
### Importing a Server Function into a Client Component {/*importing-server-functions-from-client-components*/}
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

클라이언트 컴포넌트는 `"use server"` 지시어를 사용하는 파일에서 서버 함수를 가져올 수 있습니다.

```js [[1, 4, "createNote"]]
// actions.js
"use server";

export async function createNote() {
  await db.notes.create();
}
```

번들러가 `EmptyNote` 클라이언트 컴포넌트를 빌드할 때, 번들에서 `createNote` 함수에 대한 참조를 생성합니다. 버튼을 클릭하면, React는 제공된 참조를 통해 `createNote` 함수를 실행하도록 서버에 요청<sup>Request</sup>을 보냅니다.

<<<<<<< HEAD
```js [[1, 3, "createNote"], [1, 6, "createNote"], [1, 8, "createNote"]]
=======
```js [[1, 4, "createNote"], [1, 7, "createNote"], [1, 9, "createNote"]]
// EmptyNote.js
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3
"use client";

import {createNote} from './actions';

function EmptyNote() {
  console.log(createNote);
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNote'}
  return <button onClick={() => createNote()}>Create Empty Note</button>;
}
```

자세한 내용은 [`"use server"`](/reference/rsc/use-server) 문서를 참조하세요.

<<<<<<< HEAD
### 액션으로 서버 함수 구성하기 {/*server-functions-with-actions*/}
=======
### Calling a Server Function from an Action {/*server-functions-with-actions*/}
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

서버 함수는 클라이언트의 액션<sup>Action</sup>과 함께 구성할 수 있습니다.

```js [[1, 4, "updateName"]]
// actions.js
"use server";

export async function updateName(name) {
  if (!name) {
    return {error: 'Name is required'};
  }
  await db.users.updateName(name);
  return {error: null};
}
```

```js [[1, 5, "updateName"], [1, 15, "updateName"], [2, 13, "submitAction"], [2, 28, "submitAction"]]
// UpdateName.js
"use client";

import {useState, useTransition} from 'react';
import {updateName} from './actions';

function UpdateName() {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  const [isPending, startTransition] = useTransition();

  function submitAction() {
    startTransition(async () => {
      const {error} = await updateName(name);
      // State updates after await aren't automatically marked as Transitions,
      // so wrap them in another startTransition.
      startTransition(() => {
        setError(error);
        if (!error) {
          setName('');
        }
      });
    });
  }

  return (
    <form action={submitAction}>
      <input
        type="text"
        name="name"
        value={name}
        onChange={event => setName(event.target.value)}
        disabled={isPending}
      />
      {error && <span>Failed: {error}</span>}
    </form>
  );
}
```

이렇게 하면 클라이언트의 액션으로 래핑하여 서버 함수의 `isPending` 상태에 접근할 수 있습니다.

<<<<<<< HEAD
자세한 내용은 [`<form>` 외부에서 서버 함수 호출하기](/reference/rsc/use-server#calling-a-server-function-outside-of-form) 문서를 참조하세요.

### 서버 함수를 사용한 폼 액션 {/*using-server-functions-with-form-actions*/}
=======
For more, see the docs for [Calling a Server Function outside of `<form>`](/reference/rsc/use-server#calling-a-server-function-outside-of-form).

### Passing a Server Function to the `<form>` `action` prop {/*using-server-functions-with-form-actions*/}
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

서버 함수는 React 19의 새로운 폼<sup>Form</sup> 기능과 함께 동작합니다.

<<<<<<< HEAD
서버 함수를 폼에 전달하여 폼을 서버에 자동으로 제출할 수 있습니다.
=======
Pass a Server Function to the `<form>` `action` prop to submit the form to the server. React passes the submitted [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) to the Server Function as its first argument:
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

```js [[1, 4, "updateName"]]
// actions.js
"use server";

export async function updateName(formData) {
  const name = formData.get('name');
  if (typeof name !== 'string' || !name) {
    throw new Error('Name is required');
  }
  await db.users.updateName(name);
}
```

```js [[1, 4, "updateName"], [1, 8, "updateName"]]
// UpdateName.js
"use client";

import {updateName} from './actions';

function UpdateName() {
  return (
    <form action={updateName}>
      <input type="text" name="name" />
    </form>
  );
}
```

<<<<<<< HEAD
폼 제출이 성공하면, React는 자동으로 폼을 재설정합니다. `useActionState`를 추가하여 대기<sup>Pending</sup> 상태 혹은 마지막 응답<sup>Response</sup>에 접근하거나, 점진적 향상을 지원할 수 있습니다.
=======
When the Server Function passed to the `<form>` `action` prop succeeds, React automatically resets the form's uncontrolled fields. Users can submit the form before its JavaScript bundle loads. Use `useActionState` to access the Action's pending state and most recent return value.
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

자세한 내용은 [폼<sup>Form</sup>에서의 서버 함수](/reference/rsc/use-server#server-functions-in-forms) 문서를 참조하세요.

<<<<<<< HEAD
### `useActionState`를 사용한 서버 함수 {/*server-functions-with-use-action-state*/}

액션 대기<sup>Pending</sup> 상태와 마지막으로 반환된 응답<sup>Response</sup>에 접근하는 일반적인 경우에는 `useActionState`를 사용하여 서버 함수를 호출할 수 있습니다.
=======
### Calling a Server Function with `useActionState` {/*server-functions-with-use-action-state*/}

Call a Server Function with `useActionState` to access the Action's pending state and most recent return value. The Server Function receives the previous state as its first argument and the submitted [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) as its second argument. Its return value becomes the next state:
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

```js [[1, 4, "updateName"]]
// actions.js
"use server";

export async function updateName(previousState, formData) {
  const name = formData.get('name');
  if (typeof name !== 'string' || !name) {
    return {error: 'Name is required'};
  }
  await db.users.updateName(name);
  return {error: null};
}
```

```js [[1, 5, "updateName"], [1, 8, "updateName"], [2, 8, "submitAction"], [2, 11, "submitAction"]]
// UpdateName.js
"use client";

import {useActionState} from 'react';
import {updateName} from './actions';

function UpdateName() {
  const [state, submitAction, isPending] = useActionState(updateName, {error: null});

  return (
    <form action={submitAction}>
      <input type="text" name="name" disabled={isPending} />
      {state.error && <span>Failed: {state.error}</span>}
    </form>
  );
}
```

<<<<<<< HEAD
서버 함수 함께 `useActionState`를 사용하는 경우, React는 Hydration이 완료되기 전에 입력된 폼 제출을 자동으로 다시 실행합니다. 즉, 사용자는 앱이 Hydration 되기 전에도 앱과 상호작용을 할 수 있습니다.
=======
When the function passed to `useActionState` is a Server Function, users can submit the form before hydration finishes. React can display the Server Function's return value before JavaScript loads.
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

자세한 내용은 [`useActionState`](/reference/react/useActionState) 문서를 참조하세요.

<<<<<<< HEAD
### `useActionState`를 통한 점진적 향상 {/*progressive-enhancement-with-useactionstate*/}
=======
To keep submitted values or control when the form resets, see [Preserving form values after an Action](/reference/react-dom/components/form#preserve-form-values-after-an-action).

### Supporting progressive enhancement with `useActionState` {/*progressive-enhancement-with-useactionstate*/}
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

서버 함수는 `useActionState`의 세 번째 인수를 통한 점진적 향상도 지원합니다.

```js [[1, 5, "updateName"], [1, 8, "updateName"], [2, 8, "/name/update"], [3, 8, "submitAction"], [3, 11, "submitAction"]]
// UpdateName.js
"use client";

import {useActionState} from 'react';
import {updateName} from './actions';

function UpdateName() {
  const [, submitAction] = useActionState(updateName, {error: null}, `/name/update`);

  return (
    <form action={submitAction}>
      ...
    </form>
  );
}
```

<<<<<<< HEAD
<CodeStep step={2}>permalink</CodeStep>가 `useActionState`에 제공될 때, 자바스크립트 번들이 로드되기 전에 폼이 제출되면 React는 제공된 URL로 리디렉션합니다.
=======
If you pass the <CodeStep step={2}>`permalink`</CodeStep> to `useActionState`, the browser navigates to that URL when the form is submitted before the JavaScript bundle loads. At the destination, render the same form component with the same Server Function and `permalink` so React can pass the returned state to it.
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

자세한 내용은 [`useActionState`](/reference/react/useActionState) 문서를 참조하세요.
