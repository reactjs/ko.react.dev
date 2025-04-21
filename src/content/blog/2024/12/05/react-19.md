---
title: "React v19"
author: React 팀
date: 2024/12/05
description: React 19가 npm에서 이제 사용이 가능합니다! 이 포스트에서 React 19의 새로운 기능들에 대한 개요와 도입하는 방법에 관해 설명합니다.
---
{/*<!-- eslint-disable mark/no-double-space -->*/}
2024년 12월 5일 by [React 팀](/community/team)

---
<Note>

### React 19는 이제 안정되었습니다! {/*react-19-is-now-stable*/}

React 19 RC가 4월에 처음 공유된 이후 다음이 추가되었습니다.

- **중단된 트리의 사전 워밍**: [Suspense 개선 사항](/blog/2024/04/25/react-19-upgrade-guide#improvements-to-suspense)을 참고하세요.
- **React DOM 정적 API들**: [새로운 React DOM 정적 API들](#new-react-dom-static-apis)을 참고하세요.

_이 게시물의 날짜는 안정된 버전의 릴리즈 날짜를 반영하도록 업데이트되었습니다._

</Note>

<Intro>

React v19가 이제 npm에서 사용 가능합니다!

</Intro>

[React 19 업그레이드 가이드](/blog/2024/04/25/react-19-upgrade-guide)에서 React 19로 앱을 업그레이드하는 단계별 지침을 공유했습니다. 이 포스트에서 React 19의 새로운 기능들과 이를 도입하는 방법을 제공합니다.

- [React 19의 새로운 기능](#whats-new-in-react-19)
- [React 19의 개선 사항](#improvements-in-react-19)
- [업그레이드 방법](#how-to-upgrade)

주요 변경 사항 목록은 [업그레이드 가이드](/blog/2024/04/25/react-19-upgrade-guide)를 참고하세요.

---

## React 19의 새로운 기능 {/*whats-new-in-react-19*/}

## 액션 {/*actions*/}

React 앱에서 일반적인 사용 사례 중 하나는 데이터 변경을 수행한 뒤 응답에 따라 상태를 변경하는 것입니다. 예를 들어, 사용자가 이름을 변경하는 폼을 제출하면 API 요청을 보내고 그 응답을 처리해야 합니다. 이전에는 대기 상태, 에러, 낙관적 업데이트, 순차적 요청을 수동으로 처리해야 했습니다.

예를 들어, `useState`로 대기, 에러 상태를 처리할 수 있었습니다.

```js
// 액션 이전
function UpdateName({}) {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async () => {
    setIsPending(true);
    const error = await updateName(name);
    setIsPending(false);
    if (error) {
      setError(error);
      return;
    }
    redirect("/path");
  };

  return (
    <div>
      <input value={name} onChange={(event) => setName(event.target.value)} />
      <button onClick={handleSubmit} disabled={isPending}>
        Update
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}
```

React 19에서는 비동기 함수를 사용하여 대기 상태, 에러, 폼, 낙관적 업데이트를 자동으로 처리할 수 있도록 지원을 추가했습니다.

예를 들어, `useTransition`을 통해 대기 상태를 다룰 수 있습니다.

```js
// 액션을 통해 대기 상태를 활용
function UpdateName({}) {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(async () => {
      const error = await updateName(name);
      if (error) {
        setError(error);
        return;
      }
      redirect("/path");
    })
  };

  return (
    <div>
      <input value={name} onChange={(event) => setName(event.target.value)} />
      <button onClick={handleSubmit} disabled={isPending}>
        Update
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}
```

비동기 전환은 즉시 `isPending` 상태를 true로 설정하고, 비동기 요청을 수행한 후, 모든 전환이 완료되면 `isPending`을 false로 변경합니다. 이를 통해 데이터가 변경되는 동안에도 현재 UI 반응성과 상호작용성을 유지할 수 있습니다.

<Note>

#### 관습에 따르면 비동기 전환을 사용하는 함수들을 "액션"이라고 부릅니다. {/*by-convention-functions-that-use-async-transitions-are-called-actions*/}

액션은 데이터 제출을 자동으로 관리합니다.

- **대기 상태**: 액션은 요청 시작 시 대기 상태를 활성화하고 최종 상태가 커밋되었을때 자동으로 초기화합니다.
- **낙관적 업데이트**: 액션은 새로운 [`useOptimistic`](#new-hook-optimistic-updates)훅을 통해 사용자가 요청을 제출하는 동안 즉각적인 피드백을 표시할 수 있습니다.
- **에러 처리**: 액션은 요청 실패 시 Error Boundaries를 보여주고 낙관적 업데이트를 원래 값으로, 자동으로 돌려놓습니다.
- **폼**: `<form>` 엘리먼트는 `action` 및 `formAction` props에 함수를 전달하는 것을 지원합니다. `action` props에 함수가 전달되면 기본적으로 액션을 사용하며 제출 후 폼을 자동으로 초기화합니다.

</Note>

액션을 기반으로, React 19는 낙관적 업데이트를 관리하는 [`useOptimistic`](#new-hook-optimistic-updates)와 액션을 위한 일반적인 케이스를 처리하는 [`React.useActionState`](#new-hook-useactionstate) 훅을 도입했습니다. `react-dom`에서는 폼 처리를 자동화하는 [`<form>` 액션](#form-actions)과 폼 내의 공통 케이스를 지원하는 [`useFormStatus`](#new-hook-useformstatus)를 추가했습니다.

React 19에서 간단한 예시가 있습니다.

```js
// <form> 액션과 useActionState의 사용
function ChangeName({ name, setName }) {
  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const error = await updateName(formData.get("name"));
      if (error) {
        return error;
      }
      redirect("/path");
      return null;
    },
    null,
  );

  return (
    <form action={submitAction}>
      <input type="text" name="name" />
      <button type="submit" disabled={isPending}>Update</button>
      {error && <p>{error}</p>}
    </form>
  );
}
```

다음 섹션에서 React 19의 새로운 기능들을 분석해 보겠습니다.

### 새로운 훅 `useActionState` {/*new-hook-useactionstate*/}

액션의 일반적인 경우를 더 쉽게 처리하기 위해 `useActionState`라는 새로운 훅을 추가했습니다.

```js
const [error, submitAction, isPending] = useActionState(
  async (previousState, newName) => {
    const error = await updateName(newName);
    if (error) {
      // 액션에 대한 결과를 리턴할 수 있습니다.
      // 여기서 에러를 리턴합니다.
      return error;
    }

    // 정상 결과를 다룹니다.
    return null;
  },
  null,
);
```

`useActionState`는 함수 (액션)을 받아서 이를 호출하는 래핑 된 액션을 반환합니다. 이것이 작동하는 이유는 액션들이 조합 가능하기 때문입니다. 래핑된 액션이 호출되면 `useActionState`는 액션의 마지막 결과를 `data`로 액션의 대기 상태를 `pending`으로 반환합니다.

<Note>

`React.useActionState` 는 Canary 릴리즈에서 `ReactDOM.useFormState` 불렸지만 이름이 변경되었고 `useFormState`는 폐기되었습니다.

더 많은 정보는 [#28491](https://github.com/facebook/react/pull/28491)을 참고하세요.

</Note>

더 많은 정보는 [`useActionState`](/reference/react/useActionState) 문서를 참고하세요.

### React DOM: `<form>` 액션 {/*form-actions*/}

액션은 또한 React 19의 새로운 `<form>`기능과 `react-dom`을 통합하였습니다. `<form>`, `<input>`, 그리고 `<button>` 엘리먼트의 `action`과 `formAction` 속성에 함수를 전달하여 Action으로 폼을 자동으로 제출할 수 있도록 지원이 추가되었습니다.

```js [[1,1,"actionFunction"]]
<form action={actionFunction}>
```

`<form>` 액션이 성공하면 React는 비제어 컴포넌트의 경우폼을 자동으로 재설정합니다. 만일 수동으로 `<form>`을 재설정해야 하는 경우, 새로운 React DOM API인 `requestFormReset`을 호출할 수 있습니다.

더 많은 정보는 [`<form>`](/reference/react-dom/components/form), [`<input>`](/reference/react-dom/components/input) 그리고 `<button>`을 위한 `react-dom` 문서를 참고하세요.

### React DOM: 새로운 훅: `useFormStatus` {/*new-hook-useformstatus*/}

디자인 시스템에서는 컴포넌트로 props를 내려보내지 않고 `<form>` 내 정보에 접근해야 하는 디자인 컴포넌트를 작성하는 것이 일반적입니다. 이는 Context를 통해 수행할 수 있지만 일반적인 경우를 더 쉽게 만들기 위해 새로운 훅 `useFormStatus`을 추가했습니다.

```js [[1, 4, "pending"], [1, 5, "pending"]]
import {useFormStatus} from 'react-dom';

function DesignButton() {
  const {pending} = useFormStatus();
  return <button type="submit" disabled={pending} />
}
```

`useFormStatus`는 마치 폼이 Context 프로바이더인 것처럼 부모 `<form>`의 상태를 읽습니다.

더 많은 정보는 `react-dom`의 [`useFormStatus`](/reference/react-dom/hooks/useFormStatus) 문서를 참고하세요.

### 새로운 훅: `useOptimistic` {/*new-hook-optimistic-updates*/}

데이터 변경을 수행할 때 또 다른 일반적인 UI 패턴은 비동기 요청이 진행되는 동안 최종 상태를 낙관적으로 보여주는 것입니다. React 19에서는 이를 더 쉽게 만들기 위해 새로운 훅 `useOptimistic`를 추가했습니다.

```js {2,6,13,19}
function ChangeName({currentName, onUpdateName}) {
  const [optimisticName, setOptimisticName] = useOptimistic(currentName);

  const submitAction = async formData => {
    const newName = formData.get("name");
    setOptimisticName(newName);
    const updatedName = await updateName(newName);
    onUpdateName(updatedName);
  };

  return (
    <form action={submitAction}>
      <p>Your name is: {optimisticName}</p>
      <p>
        <label>Change Name:</label>
        <input
          type="text"
          name="name"
          disabled={currentName !== optimisticName}
        />
      </p>
    </form>
  );
}
```

`useOptimistic`훅은 `updateName` 요청이 진행 중일 때 `optimisticName`을 즉시 렌더링할 것입니다. 업데이트가 끝나거나 에러가 발생했을 때 React는 자동으로 `currentName` 값을 이전으로 되돌립니다.

더 많은 정보는 [`useOptimistic`](/reference/react/useOptimistic)문서를 참고하세요.

### 새로운 API: `use` {/*new-feature-use*/}

React 19에서 렌더링에서 resources를 읽기 위해 새로운 API `use`를 발표했습니다.

예를 들어 `use`를 통해 promise를 읽을 수 있고 React는 promie를 처리할 때까지 중단할 것입니다.

```js {1,5}
import {use} from 'react';

function Comments({commentsPromise}) {
  // `use`는 promise가 처리될때까지 중단될것입니다.
  const comments = use(commentsPromise);
  return comments.map(comment => <p key={comment.id}>{comment}</p>);
}

function Page({commentsPromise}) {
  // Comments 컴포넌트에서 `use`가 중단될 때
  // Suspense boundary가 보일 것 입니다.
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Comments commentsPromise={commentsPromise} />
    </Suspense>
  )
}
```

<Note>

#### `use`는 더 이상 렌더링 중에 프로미스 생성을 지원하지 않습니다. {/*use-does-not-support-promises-created-in-render*/}

만약 렌더링 중에 프로미스를 생성해 `use`에 전달하려고 하면 React는 경고를 표시할 것입니다.

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

A component was suspended by an uncached promise. Creating promises inside a Client Component or hook is not yet supported, except via a Suspense-compatible library or framework.

</ConsoleLogLine>

</ConsoleBlockMulti>

해결하려면 프로미스 캐싱을 위한 Suspense 기반 라이브러리나 프레임워크에서 프로미스를 전달해야 합니다. 앞으로 렌더링에서 프로미스를 더 쉽게 캐시할 수 있는 기능을 배포할 계획입니다.

</Note>

또한 `use`로 컨텍스트를 읽을 수 있으며 이를 통해 조기 반환 후와 같은 조건으로 컨텍스트를 읽을 수 있습니다.

```js {1,11}
import {use} from 'react';
import ThemeContext from './ThemeContext'

function Heading({children}) {
  if (children == null) {
    return null;
  }

  // useContext는 동작하지 않습니다.
  // 조기 반환으로 인해서
  const theme = use(ThemeContext);
  return (
    <h1 style={{color: theme.color}}>
      {children}
    </h1>
  );
}
```

`use` API는 훅과 유사하게 오직 렌더링 중일때만 호출됩니다. 훅과 달리 `use`는 조건적으로 호출됩니다. 앞으로 `use`를 사용하여 렌더링 중일 때 리소스들을 소비하도록 더 많은 방법을 지원할 계획입니다.

더 많은 정보는 [`use`](/reference/react/use)문서를 참고하세요.

## 새로운 React DOM의 Static APIs {/*new-react-dom-static-apis*/}

정적 사이트 생성을 위해 `react-dom/static`에 새로운 두 가지 API를 추가했습니다.
- [`prerender`](/reference/react-dom/static/prerender)
- [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream)

이 새로운 API들은 `renderToString`보다 더 나아가서 정적 HTML 생성을 위해 데이터가 로드될 때까지 기다립니다. 이들은 Node.js Streams와 Web Streams와 같은 스트리밍 환경과 호환되도록 설계되었습니다. 예를 들어, Web Stream 환경에서는 `prerender`를 사용하여 React 트리를 정적 HTML로 미리 렌더링할 수 있습니다.

```js
import { prerender } from 'react-dom/static';

async function handler(request) {
  const {prelude} = await prerender(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(prelude, {
    headers: { 'content-type': 'text/html' },
  });
}
```

Prerender API는 정적 HTML 스트림이 반환되기 전에 데이터가 로드되는 것을 기다립니다. Stream은 문자열로 변환이 가능하거나 스트리밍 응답으로 전송될 수 있습니다. 그러나 로드되는 콘텐츠를 스트리밍으로 지원하지 않습니다. 이는 기존 [React DOM server rendering APIs](/reference/react-dom/server)에서 지원됩니다.

더 많은 정보는 [React DOM Static APIs](/reference/react-dom/static)를 참고하세요.

## React 서버 컴포넌트 {/*react-server-components*/}

### 서버 컴포넌트 {/*server-components*/}

서버 컴포넌트는 번들링 전에 클라이언트 애플리케이션 또는 SSR 서버와 분리된 환경에서 컴포넌트를 미리 렌더링할 수 있는 새로운 옵션입니다. 이 별도의 환경이 React 서버 컴포넌트에서 "서버"입니다. 서버 컴포넌트는 CI 서버에서 빌드 시 한 번 실행하거나 웹 서버를 사용하여 각 요청에 대해 실행할 수 있습니다.

React 19는 Canary 채널에서 포함된 모든 React 서버 컴포넌트 기능을 포함하고 있습니다. 이는 서버 컴포넌트가 포함된 라이브러리들이 이제 [풀스택 React 아키텍처](/learn/start-a-new-react-project#which-features-make-up-the-react-teams-full-stack-architecture-vision)를 지원하는 프레임워크에서 react-server [export 조건](https://github.com/reactjs/rfcs/blob/main/text/0227-server-module-conventions.md#react-server-conditional-exports)을 사용하여 React 19를 향한 피어 종속성으로 지정할 수 있음을 의미합니다.


<Note>

#### 서버 컴포넌트에 대한 지원을 어떻게 구축하나요? {/*how-do-i-build-support-for-server-components*/}

React 19에서 React 서버 컴포넌트는 안정적이며 마이너 버전 간에는 깨지지 않지만, React 서버 컴포넌트 번들러나 프레임워크를 구현하는 데 사용되는 기본 API는 semver를 따르지 않고 React 19.x의 마이너 버전 간에는 변경될 수 있습니다.

React 서버 컴포넌트를 지원하기 위해, 특정 React 버전에 고정하거나 Canary 릴리스를 사용하는 것을 권장합니다. 우리는 앞으로 번들러와 프레임워크와 협력하여 React 서버 컴포넌트를 구현하는 데 사용되는 API를 안정화할 계획입니다.

</Note>


더 많은 정보는 [React Server Components](/reference/rsc/server-components) 문서를 참고하세요.

### 서버 액션 {/*server-actions*/}

서버 액션은 서버에서 실행되는 비동기 함수를 클라이언트 컴포넌트에서 호출하는 것을 허용합니다.

서버 액션이 `"use server"` 지시어로 정의될 때 프레임워크는 자동으로 서버 함수에 대한 참조를 생성하고 클라이언트 컴포넌트에 이를 전달합니다. 클라이언트에서 함수가 호출되면 React는 서버에 함수를 실행하라는 요청을 보내고 결과를 반환합니다.

<Note>

#### 서버 컴포넌트에 대한 지시어는 없습니다. {/*there-is-no-directive-for-server-components*/}

흔한 오해는 서버 컴포넌트는 `"use server"`로 표시되지만 이에 대한 지시어는 존재하지 않습니다. `"use server"`지시어는 서버 액션을 위해 사용됩니다.

더 많은 정보는 [Directives](/reference/rsc/directives)문서를 참고하세요.

</Note>

서버 액션은 서버 컴포넌트에서 생성되며 클라이언트 컴포넌트에 props를 전달되거나 클라이언트 컴포넌트에서 가져와 사용할 수 있습니다.

더 많은 정보는 [React Server Actions](/reference/rsc/server-actions)를 참고하세요.

## React 19에서 개선 {/*improvements-in-react-19*/}

### prop으로의 `ref` {/*ref-as-a-prop*/}

React 19부터 함수 컴포넌트의 prop을 ref에 접근할 수 있습니다.

```js [[1, 1, "ref"], [1, 2, "ref", 45], [1, 6, "ref", 14]]
function MyInput({placeholder, ref}) {
  return <input placeholder={placeholder} ref={ref} />
}

//...
<MyInput ref={ref} />
```

새로운 함수 컴포넌트에서는 더 이상 forwardRef가 필요하지 않으며, 새로운 ref 프롭을 사용하도록 컴포넌트를 자동으로 업데이트하는 codemod를 배포할 예정입니다. 앞으로의 버전에서는 forwardRef를 사용하지 않도록 제거하고 더 이상 사용하지 않을 계획입니다.

<Note>

클래스에 전달된 ref는 컴포넌트 인스턴스를 참조하기 때문에 props로 전달되지 않습니다.

</Note>

### 하이드레이션 에러에 대한 차이 {/*diffs-for-hydration-errors*/}

예를 들어, 일치하지 않는 정보 없이 DEV 환경에서 여러 에러 로깅하는 대신 `react-dom`에서 하이드레이션 에러에 대한 오류 보고를 개선했습니다. 

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Warning: Text content did not match. Server: "Server" Client: "Client"
{'  '}at span
{'  '}at App

</ConsoleLogLine>

<ConsoleLogLine level="error">

Warning: An error occurred during hydration. The server HTML was replaced with client content in \<div\>.

</ConsoleLogLine>

<ConsoleLogLine level="error">

Warning: Text content did not match. Server: "Server" Client: "Client"
{'  '}at span
{'  '}at App

</ConsoleLogLine>

<ConsoleLogLine level="error">

Warning: An error occurred during hydration. The server HTML was replaced with client content in \<div\>.

</ConsoleLogLine>

<ConsoleLogLine level="error">

Uncaught Error: Text content does not match server-rendered HTML.
{'  '}at checkForUnmatchedText
{'  '}...

</ConsoleLogLine>

</ConsoleBlockMulti>

이제 일치하지 않는 차이점을 보여주는 단일 메시지를 로깅합니다.


<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Uncaught Error: Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. This can happen if an SSR-ed Client Component used:{'\n'}
\- A server/client branch `if (typeof window !== 'undefined')`.
\- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
\- Date formatting in a user's locale which doesn't match the server.
\- External changing data without sending a snapshot of it along with the HTML.
\- Invalid HTML tag nesting.{'\n'}
It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.{'\n'}
https://react.dev/link/hydration-mismatch {'\n'}
{'  '}\<App\>
{'    '}\<span\>
{'+    '}Client
{'-    '}Server{'\n'}
{'  '}at throwOnHydrationMismatch
{'  '}...

</ConsoleLogLine>

</ConsoleBlockMulti>

### 프로바이더로 사용하는 `<Context>` {/*context-as-a-provider*/}

React 19에서는 `<Context.Provider>` 대신에 `<Context>` 프로바이더로 렌더링할 수 있습니다.


```js {5,7}
const ThemeContext = createContext('');

function App({children}) {
  return (
    <ThemeContext value="dark">
      {children}
    </ThemeContext>
  );
}
```

새로운 Context 프로바이더는 `<Context>` 사용할 수 있고 기존 존재하는 프로바이더를 변환하기 위한 codemod를 배포할 예정입니다. 앞으로의 버전에서 `<Context.Provider>`를 더 이상 사용하지 않을 계획입니다.

### refs를 위한 클린업 함수 {/*cleanup-functions-for-refs*/}

이제 `ref` 콜백에 클린업 함수를 반환하는 것을 지원합니다.

```js {7-9}
<input
  ref={(ref) => {
    // ref 생성

    // NEW: 재설정을 위한 클린업 함수 반환
    // DOM에서 엘리먼트가 제거될 때의 ref
    return () => {
      // ref 클린업
    };
  }}
/>
```

컴포넌트가 마운트 해제될 때, React는  `ref` 콜백으로부터 클린업 함수를 호출할 것입니다. 이는 DOM ref, 클래스 컴포넌트 ref 그리고 `useImperativeHandle` 모두 해당합니다.

<Note>

이전에는 React가 컴포넌트를 마운트 해제될 때 `ref` 함수를 `null`과 함께 호출했습니다. 이제 만약 `ref`가 클린업 함수를 반환한다면, React는 이 단계를 건너뜁니다.

앞으로의 버전에서는 컴포넌트를 마운트 해제될 때 `null`과 함께 ref를 호출하는 것을 더 이상 사용하지 않을 예정입니다.

</Note>

ref 클린업 함수의 도입으로 인해, TypeScript에서 `ref` 콜백에서 다른 값을 반환하는 것이 거부될 것입니다. 일반적으로 해결 방법은 암시적 반환을 사용하지 않도록 하는 것입니다. 예시는 아래와 같습니다.

```diff [[1, 1, "("], [1, 1, ")"], [2, 2, "{", 15], [2, 2, "}", 1]]
- <div ref={current => (instance = current)} />
+ <div ref={current => {instance = current}} />
```

기존 코드는 `HTMLDivElement`의 인스턴스를 반환했고, TypeScript는 이것이 _클린업 함수인지_ 혹은 클린업 함수를 반환하지 않으려는 것인지 알지 못합니다.

이 패턴은 [`no-implicit-ref-callback-return`](https://github.com/eps1lon/types-react-codemod/#no-implicit-ref-callback-return)을 사용하여 codemod로 변환할 수 있습니다.

### `useDeferredValue` 초깃값 {/*use-deferred-value-initial-value*/}

`useDeferredValue`에 `initialValue` 옵션을 추가했습니다.

```js [[1, 1, "deferredValue"], [1, 4, "deferredValue"], [2, 4, "''"]]
function Search({deferredValue}) {
  // 초기 렌더링 값은 '' 입니다.
  // deferredValue로 리렌더링됩니다.
  const value = useDeferredValue(deferredValue, '');

  return (
    <Results query={value} />
  );
}
````

<CodeStep step={2}>initialValue</CodeStep>이 제공되면, `useDeferredValue`는 컴포넌트의 초기 렌더링에서 이를 `value`로 반환하고 백그라운드에서 <CodeStep step={1}>deferredValue</CodeStep>으로 리렌더링을 예약합니다.

더 많은 정보는 [`useDeferredValue`](/reference/react/useDeferredValue) 문서를 참고하세요.

### 메타데이터 문서에 대한 지원 {/*support-for-metadata-tags*/}

HTML에서는 `<title>`, `<link>`, `<meta>`와 같은 문서 메타 데이터 태그들이 문서의 <head> 섹션에 배치되어야 합니다. 그러나 React에서는 애플리케이션에 적합한 메타 데이터를 결정하는 컴포넌트가 `<head>`를 렌더링하는 곳과 아주 멀리 떨어져 있을 수 있거나, React 자체에서 `<head>`를 전혀 렌더링하지 않을 수도 있습니다. 과거에는 이러한 엘리먼트들을 이펙트를 사용하여 수동으로 삽입하거나 [`react-helmet`](https://github.com/nfl/react-helmet)과 같은 라이브러리를 사용하여 처리해야 했으며, React 애플리케이션을 서버에서 렌더링할 때 주의 깊게 처리해야 했습니다.

React 19에서는 컴포넌트에서 문서 메타 데이터 태그를 네이티브로 렌더링할 수 있는 지원을 추가하고 있습니다.

```js {5-8}
function BlogPost({post}) {
  return (
    <article>
      <h1>{post.title}</h1>
      <title>{post.title}</title>
      <meta name="author" content="Josh" />
      <link rel="author" href="https://twitter.com/joshcstory/" />
      <meta name="keywords" content={post.keywords} />
      <p>
        Eee equals em-see-squared...
      </p>
    </article>
  );
}
```

React가 이 컴포넌트를 렌더링하면 `<title>` `<link>` 그리고 `<meta>`들이 보여지고 자동으로 문서의 `<head>` 섹션으로 호이스팅됩니다. 이러한 메타데이터 태그들이 네이티브로 지원하면 클라이언트 전용 앱, 스트리밍 SSR, 서버 컴포넌트와 동작되도록 보장할 수 있습니다.

<Note>

#### 여전히 메타데이터 라이브러리를 원한다. {/*you-may-still-want-a-metadata-library*/}

간단한 사용 사례의 경우에 문서 메타 데이터를 태그로 렌더링하는 것이 적합할 수 있지만, 라이브러리는 현재 경로에 따라 일반 메타 데이터를 구체적인 메타 데이터로 덮어쓰는 등 더 강력한 기능을 제공할 수 있습니다. 이러한 기능들은 메타 데이터 태그를 대체하는 것보다 [`react-helmet`](https://github.com/nfl/react-helmet)와 같은 프레임워크나 라이브러리를 더 쉽게 할 수 있도록 합니다.

</Note>

더 많은 내용은 [`<title>`](/reference/react-dom/components/title), [`<link>`](/reference/react-dom/components/link), [`<meta>`](/reference/react-dom/components/meta) 문서를 참고하세요.

### 스타일시트 지원 {/*support-for-stylesheets*/}

외부 링크 (`<link rel="stylesheet" href="...">`)와 인라인 (`<style>...</style>`) 스타일 시트는 스타일 우선순위 규칙으로 인해 DOM에서 안전한 위치를 요구합니다. 컴포넌트 내에서 합성 가능성을 허용하는 스타일시트 기능을 구축하는것은 어렵습니다. 그래서 사용자들은 종종 컴포넌트에서 멀리 떨어진 곳에서 모든 스타일을 로드하거나, 이러한 복잡성을 캡슐화하는 스타일 라이브러리를 사용하게 됩니다.

React 19에서는 이 복잡성에 대응하고, 클라이언트에서의 동시 렌더링과 서버에서의 스트리밍 렌더링에 대한 더 깊은 통합을 제공하며, 스타일시트에 대한 내장 지원을 제공합니다. 스타일시트의 `precedence`를 React에게 알리면, React는 스타일시트의 DOM 삽입 순서를 관리하고, 스타일 규칙에 의존하는 콘텐츠를 노출하기 전에 (외부의 경우) 스타일시트가 로드될 수 있도록 보장합니다.

```js {4,5,17}
function ComponentOne() {
  return (
    <Suspense fallback="loading...">
      <link rel="stylesheet" href="foo" precedence="default" />
      <link rel="stylesheet" href="bar" precedence="high" />
      <article class="foo-class bar-class">
        {...}
      </article>
    </Suspense>
  )
}

function ComponentTwo() {
  return (
    <div>
      <p>{...}</p>
      <link rel="stylesheet" href="baz" precedence="default" />  <-- foo 와 bar 사이에 위치 될 것
    </div>
  )
}
```

서버 사이드 렌더링 중에 React는 스타일시트를 `<head>`에 포함합니다. 이는 브라우저가 스타일시트를 로드할 때까지 페인팅을 하지 않도록 보장합니다. 만약 스트리밍을 시작한 후 늦게 스타일시트가 발견된다면, React는 해당 스타일시트에 의존하는 Suspense 경계의 콘텐츠를 표시하기 전에 클라이언트에서 스타일시트가 `<head>`에 삽입되도록 보장합니다.

클라이언트 사이드 렌더링 중에는 React가 렌더링을 커밋하기 전에 새로 렌더링된 스타일시트가 로드될 때까지 기다립니다. 애플리케이션의 여러 위치에서 이 컴포넌트를 렌더링하더라도 React는 문서에 스타일시트를 한 번만 포함합니다.

```js {5}
function App() {
  return <>
    <ComponentOne />
    ...
    <ComponentOne /> // DOM 내에서 스타일 시트 링크가 중복으로 이어지지 않습니다.
  </>
}
```

스타일시트를 수동으로 로드하는 데 익숙한 사용자들에게 이것은 의존하는 컴포넌트 옆에 스타일시트를 배치할 기회를 제공합니다. 이를 통해 더 나은 지역적 추론이 가능하고 실제로 의존하는 스타일시트만 로드하도록 보장하는 것이 더 쉬워집니다.

스타일 라이브러리와 번들러의 통합도 이 새로운 기능을 채택할 수 있으므로, 직접 스타일시트를 렌더링하지 않더라도 도구가 이 기능을 사용하도록 업그레이드되면 여전히 혜택을 받을 수 있습니다.

자세한 내용은 [`<link>`](/reference/react-dom/components/link)와 [`<style>`](/reference/react-dom/components/style)에 대한 문서를 참조하세요.

### 비동기 스트립트 지원 {/*support-for-async-scripts*/}

HTML 일반 스크립트 (`<script src="...">`)와 지연 스크립트 (`<script defer="" src="...">`)는 문서 순서대로 로드되어 컴포넌트 트리 깊숙한 곳에 이러한 종류의 스크립트를 렌더링하는 것을 어렵게 만듭니다. 그러나 비동기 스크립트 (`<script async="" src="...">`) 는 임의의 순서로 로드됩니다.

React 19에서는 비동기 스크립트에 대한 더 나은 지원을 포함하여, 스크립트 인스턴스의 재배치와 중복 제거를 관리하지 않아도 실제로 스크립트에 의존하는 컴포넌트 트리내 어디든 렌더링할 수 있도록 허용합니다.

```js {4,15}
function MyComponent() {
  return (
    <div>
      <script async={true} src="..." />
      Hello World
    </div>
  )
}

function App() {
  <html>
    <body>
      <MyComponent>
      ...
      <MyComponent> // DOM 내에서 스크립트가 중복으로 이어지지 않습니다.
    </body>
  </html>
}
```

모든 렌더링 환경에서, 비동기 스크립트는 중복으로 처리되어 React가 동일한 스크립트를 여러 다른 컴포넌트에서 렌더링하더라도 한 번만 로드하고 실행합니다.

서버 사이드 렌더링에서는 비동기 스크립트가 `<head>`에 포함되며, 스타일시트, 폰트, 이미지 프리로드와 같이 페인트를 차단하는 더 중요한 리소스 뒤에 우선적으로 처리됩니다.

더 자세한 내용은 [`<script>`](/reference/react-dom/components/script) 문서를 참조하세요.

### 리소스 사전 로드 지원 {/*support-for-preloading-resources*/}

문서 초기 로드 및 클라이언트 측 업데이트 중에 브라우저에 가능한 한 빨리 로드해야 할 리소스에 대해 알려주는 것이 페이지 성능에 중대한 영향을 미칠 수 있습니다.

React 19에는 비효율적인 리소스 로딩으로 인해 좋지 않은 경험을 제한받지 않도록, 브라우저 리소스를 로드하고 사전로드하기 위한 여러 새로운 API가 포함되어 있습니다. 이를 통해 우수한 사용자 경험을 구축하는 것이 가능하게 되었습니다.

```js
import { prefetchDNS, preconnect, preload, preinit } from 'react-dom'
function MyComponent() {
  preinit('https://.../path/to/some/script.js', {as: 'script' }) // 스크립트 즉시 로드 실행
  preload('https://.../path/to/font.woff', { as: 'font' }) // 폰트 사전로드
  preload('https://.../path/to/stylesheet.css', { as: 'style' }) // 스타일시트 사전로드
  prefetchDNS('https://...') // 실제로 이 호스트에서 아무것도 요청하지 않을때
  preconnect('https://...') // 어떤 것을 요청할지 확신하지 못할 때
}
```
```html
<!-- 위 내용은 다음과 같은 DOM/HTML을 결과로 한다. -->
<html>
  <head>
    <!-- links/scripts는 호출순서에 따라 정렬되지 않고 초기 로딩의 유용성에 따라 우선순위 결정 -->
    <link rel="prefetch-dns" href="https://...">
    <link rel="preconnect" href="https://...">
    <link rel="preload" as="font" href="https://.../path/to/font.woff">
    <link rel="preload" as="style" href="https://.../path/to/stylesheet.css">
    <script async="" src="https://.../path/to/some/script.js"></script>
  </head>
  <body>
    ...
  </body>
</html>
```

이러한 API들은 초기 페이지 로드 최적화에 사용될 수 있으며, 스타일시트 로딩에서 폰트와 같은 추가 리소스의 발견을 완화시킬 수 있습니다. 또한, 예상된 네비게이션에서 사용되는 리소스 목록을 사전에 가져와 클릭 또는 호버 시 이러한 리소스를 즉시 사전로드하여 클라이언트 업데이트 속도를 높일 수 있습니다.

더 자세한 내용은 [리소스 사전로드 APIs](/reference/react-dom#resource-preloading-apis)를 참고하세요.

### 서드파티 스크립트와 확장 프로그램의 호환성 {/*compatibility-with-third-party-scripts-and-extensions*/}

저희는 서드파티 스크립트와 브라우저 확장 프로그램 호환성을 개선했습니다.

화면 새로고침 시, 클라이언트에서 렌더링되는 엘리먼트가 서버에서 제공된 HTML과 일치하지 않으면 React는 컨텐츠를 수정하기 위해 클라이언트에서 강제 리렌더링합니다. 이전에는 서드파티 스크립트나 브라우저 확장 프로그램에 의해 삽입된 엘리먼트는 불일치 오류와 클라이언트 리렌더링을 유발했습니다.

React 19에서는 `<head>` 및 `<body>`에서 예상치 못한 태그가 발견되면 불일치 오류를 피하고자 이러한 태그들을 건너뜁니다. 또한, React가 관계없는 불일치로 인해 전체 문서를 리렌더링해야 할 경우, 서드파티 스크립트와 브라우저 확장 프로그램에 의해 삽입된 스타일시트는 그대로 남겨집니다.

### 더 나은 에러 리포팅 {/*error-handling*/}

React 19에서는 오류 처리를 개선하여 중복을 줄이고 잡힌 오류와 잡히지 않은 오류를 처리할 수 있는 옵션을 제공했습니다. 예를 들어, 에러 바운더리에 의해 잡힌 렌더링 중 오류가 발생할 경우, 이전에는 React가 오류를 두 번 던졌습니다 (원래 오류와 자동 복구에 실패한 후에 다시). 그리고 `console.error`를 호출하여 오류가 발생한 위치에 대한 정보를 출력했습니다.

이에 따라 잡힌 오류마다 세 개의 오류가 발생하는 문제가 있었습니다.

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Uncaught Error: hit
{'  '}at Throws
{'  '}at renderWithHooks
{'  '}...

</ConsoleLogLine>

<ConsoleLogLine level="error">

Uncaught Error: hit<span className="ms-2 text-gray-30">{'    <--'} Duplicate</span>
{'  '}at Throws
{'  '}at renderWithHooks
{'  '}...

</ConsoleLogLine>

<ConsoleLogLine level="error">

The above error occurred in the Throws component:
{'  '}at Throws
{'  '}at ErrorBoundary
{'  '}at App{'\n'}
React will try to recreate this component tree from scratch using the error boundary you provided, ErrorBoundary.

</ConsoleLogLine>

</ConsoleBlockMulti>

In React 19, we log a single error with all the error information included:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Error: hit
{'  '}at Throws
{'  '}at renderWithHooks
{'  '}...{'\n'}
The above error occurred in the Throws component:
{'  '}at Throws
{'  '}at ErrorBoundary
{'  '}at App{'\n'}
React will try to recreate this component tree from scratch using the error boundary you provided, ErrorBoundary.
{'  '}at ErrorBoundary
{'  '}at App

</ConsoleLogLine>

</ConsoleBlockMulti>

추가로, `onRecoverableError`을 보완하기 위해 두 새로운 루트 옵션을 추가했습니다.

- `onCaughtError`: React가 에러 바운더리에서 오류를 잡을 때 호출됩니다.
- `onUncaughtError`: 에러가 발생하고 에러 바운더리에 의해 잡히지 않을 때 호출됩니다.
- `onRecoverableError`: 에러가 발생하고 자동으로 복구될 때 호출됩니다.

더 자세한 내용과 예시는 [`createRoot`](/reference/react-dom/client/createRoot)와 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) 문서를 참고하세요.

### 커스텀 엘리먼트 지원 {/*support-for-custom-elements*/}

React 19 는 커스텀 엘리먼트에 대한 모든 지원을 추가하고 [Custom Elements Everywhere](https://custom-elements-everywhere.com/)의 모든 테스트를 통과했습니다.

이전 버전에서는 React에서 인식되지 않는 props를 속성으로 처리하여 커스텀 엘리먼트 사용이 어려웠습니다. React 19에서는 클라이언트 및 SSR에서 속성을 지원하도록 아래와 같은 전략을 추가했습니다.

- **서버 사이드 렌더링**: `string`, `number` 또는 한 값이 `true`인 원시 값일 경우 커스텀 엘리먼트에 전달된 props는 렌더링 될 것입니다. 비-원시 타입인 `object`, `symbol`, `function` 또는 값이 `false`인 props는 생략됩니다.
- **클라이언트 사이드 렌더링**: 커스텀 엘리먼트 인스턴스의 속성과 일치하는 props는 프로퍼티로 할당됩니다. 그렇지 않은 경우에는 어트리뷰트로 할당됩니다.

React의 Custom 엘리먼트 지원의 설계 및 구현을 주도해 주신 [Joey Arhar](https://github.com/josepharhar)에게 감사드립니다. 


#### 업그레이드 방법 {/*how-to-upgrade*/}
단계별 지침과 주요 변경 사항의 전체 목록은 [React 19 Upgrade Guide](/blog/2024/04/25/react-19-upgrade-guide)를 참고하세요.

_참고: 이 게시물은 원래 2024년 4월 25일에 게시되었으며, 안정적인 릴리스와 함께 2024년 12월 5일로 업데이트되었습니다._
