---
title: Server Actions
canary: true
---

<Intro>

Server Actions를 사용하면 클라이언트 컴포넌트가 서버에서 실행되는 비동기 함수를 호출할 수 있습니다.

</Intro>

<InlineToc />

<Note>

#### Server Actions에 대한 지원은 어떻게 구축하나요? {/*how-do-i-build-support-for-server-actions*/}

React 19의 Server Actions는 안정적이고 주요 버전 간에 중단되지 않지만, React 서버 컴포넌트 bundler 또는 프레임워크에서 Server Actions를 구현하는 데 사용되는 API는 semver를 따르지 않으며 React 19.x의 마이너 버전에서는 중단될 수 있습니다.

Server Actions를 bundler 또는 프레임워크로 지원하려면, 특정 React 버전에 고정하거나 카나리(Canary) 릴리즈를 사용하는 것이 좋습니다. 향후 Server Actions를 구현하는 데 사용되는 API를 안정화하기 위해 bundler 및 프레임워크와 계속 협력할 예정입니다.

</Note>

Server Action이 `"use server"` 지시어로 정의되면, 프레임워크는 자동으로 서버 함수에 대한 참조를 생성하고 해당 참조를 클라이언트 컴포넌트에 전달합니다. 클라이언트에서 해당 함수가 호출되면, React는 서버에 함수를 실행하라는 요청을 보내고 결과를 반환합니다.

Server Actions는 서버 컴포넌트에서 생성하여 클라이언트 컴포넌트 props로 전달하거나 클라이언트 컴포넌트에서 가져와서 사용할 수 있습니다.

### 서버 컴포넌트에서 Server Action 만들기 {/*creating-a-server-action-from-a-server-component*/}

서버 컴포넌트는 `"use server"` 지시어로 Server Actions를 정의할 수 있습니다.

```js [[2, 7, "'use server'"], [1, 5, "createNoteAction"], [1, 12, "createNoteAction"]]
// Server Component
import Button from './Button';

function EmptyNote () {
  async function createNoteAction() {
    // Server Action
    'use server';
    
    await db.notes.create();
  }

  return <Button onClick={createNoteAction}/>;
}
```

React가 `EmptyNote` 서버 컴포넌트를 렌더링할 때, `createNoteAction` 함수에 대한 참조를 생성하고, 그 참조를 `Button` 클라이언트 컴포넌트에 전달합니다. 버튼이 클릭 되면, React는 제공된 참조로 `createNoteAction` 함수를 실행하라는 요청을 서버로 보냅니다.

```js {5}
"use client";

export default function Button({onClick}) { 
  console.log(onClick); 
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNoteAction'}
  return <button onClick={onClick}>Create Empty Note</button>
}
```

자세한 내용은 [`"use server"`](/reference/rsc/use-server) 문서를 참조하세요.


### 클라이언트 컴포넌트에서 Server Actions 가져오기 {/*importing-server-actions-from-client-components*/}

클라이언트 컴포넌트는 `"use server"` 지시어를 사용하는 파일에서 Server Actions를 가져올 수 있습니다.

```js [[1, 3, "createNoteAction"]]
"use server";

export async function createNoteAction() {
  await db.notes.create();
}

```

bundler가 `EmptyNote` 클라이언트 컴포넌트를 빌드할 때, bundle에서 `createNoteAction` 함수에 대한 참조를 생성합니다. 버튼이 클릭 되면, React는 제공된 참조를 사용해 `createNoteAction` 함수를 실행하도록 서버에 요청을 보냅니다.

```js [[1, 2, "createNoteAction"], [1, 5, "createNoteAction"], [1, 7, "createNoteAction"]]
"use client";
import {createNoteAction} from './actions';

function EmptyNote() {
  console.log(createNoteAction);
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNoteAction'}
  <button onClick={createNoteAction} />
}
```

자세한 내용은 [`"use server"`](/reference/rsc/use-server) 문서를 참조하세요.

### 액션으로 Server Actions 구성하기 {/*composing-server-actions-with-actions*/}

Server Actions는 클라이언트의 액션과 함께 구성할 수 있습니다.

```js [[1, 3, "updateName"]]
"use server";

export async function updateName(name) {
  if (!name) {
    return {error: 'Name is required'};
  }
  await db.users.updateName(name);
}
```

```js [[1, 3, "updateName"], [1, 13, "updateName"], [2, 11, "submitAction"],  [2, 23, "submitAction"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  const [isPending, startTransition] = useTransition();

  const submitAction = async () => {
    startTransition(async () => {
      const {error} = await updateName(name);
      if (!error) {
        setError(error);
      } else {
        setName('');
      }
    })
  }
  
  return (
    <form action={submitAction}>
      <input type="text" name="name" disabled={isPending}/>
      {state.error && <span>Failed: {state.error}</span>}
    </form>
  )
}
```

이렇게 하면 클라이언트의 액션으로 래핑하여 Server Action의 `isPending` 상태에 액세스할 수 있습니다.

자세한 내용은 [`<form>` 외부에서 Server Action 호출하기](/reference/rsc/use-server#calling-a-server-action-outside-of-form) 문서를 참조하세요.

### Server Actions를 사용한 폼 액션 {/*form-actions-with-server-actions*/}

Server Actions는 React 19의 새로운 Form 기능과 함께 작동합니다.

Server Action을 Form에 전달하여 폼을 서버에 자동으로 제출할 수 있습니다.


```js [[1, 3, "updateName"], [1, 7, "updateName"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  return (
    <form action={updateName}>
      <input type="text" name="name" />
    </form>
  )
}
```

Form 제출이 성공하면, React는 자동으로 폼을 재설정합니다. 보류 상태, 마지막 응답에 액세스하거나 점진적인 향상을 지원하기 위해 `useActionState`를 추가할 수 있습니다.

자세한 내용은 [Server Actions 형식](/reference/rsc/use-server#server-actions-in-forms) 문서를 참조하세요.

### `useActionState`를 사용한 Server Actions {/*server-actions-with-use-action-state*/}

액션 보류 상태와 마지막으로 반환된 응답에 액세스하기만 하면 되는 일반적인 경우에는 `useActionState`를 사용하여 Server Actions를 구성할 수 있습니다.

```js [[1, 3, "updateName"], [1, 6, "updateName"], [2, 6, "submitAction"], [2, 9, "submitAction"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  const [state, submitAction, isPending] = useActionState(updateName, {error: null});

  return (
    <form action={submitAction}>
      <input type="text" name="name" disabled={isPending}/>
      {state.error && <span>Failed: {state.error}</span>}
    </form>
  );
}
```

Server Actions와 함께 `useActionState`를 사용하는 경우, React는 hydration이 완료되기 전에 입력된 폼 제출 또한 자동으로 재생합니다. 즉, 사용자는 앱이 hydration 되기 전에도 앱과 상호작용을 할 수 있습니다.

자세한 내용은 [`useActionState`](/reference/react-dom/hooks/useFormState) 문서를 참조하세요.

### `useActionState`를 통한 점진적 향상 {/*progressive-enhancement-with-useactionstate*/}

Server Actions는 `useActionState`의 세 번째 인수를 통해 점진적 향상도 지원합니다.

```js [[1, 3, "updateName"], [1, 6, "updateName"], [2, 6, "/name/update"], [3, 6, "submitAction"], [3, 9, "submitAction"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  const [, submitAction] = useActionState(updateName, null, `/name/update`);

  return (
    <form action={submitAction}>
      ...
    </form>
  );
}
```

<CodeStep step={2}>permalink</CodeStep>가 `useActionState`에 제공될 때, 자바스크립트 bundle이 로드되기 전에 폼이 제출되면 React는 제공된 URL로 리디렉션합니다.

자세한 내용은 [`useActionState`](/reference/react-dom/hooks/useFormState) 문서를 참조하세요.
