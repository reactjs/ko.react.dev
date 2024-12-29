---
title: "'use server'"
<<<<<<< HEAD
titleForTitleTag: "'use server' 지시어"
canary: true
=======
titleForTitleTag: "'use server' directive"
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682
---

<RSC>

`'use server'`는 [React 서버 컴포넌트를 사용](/learn/start-a-new-react-project#bleeding-edge-react-frameworks)하거나 그와 호환되는 라이브러리를 만들 때만 필요합니다.

</RSC>


<Intro>

`'use server'`는 클라이언트 측 코드에서 호출할 수 있는 서버 측 함수를 표시합니다.

</Intro>

<InlineToc />

---

## 레퍼런스 {/*reference*/}

### `'use server'` {/*use-server*/}

<<<<<<< HEAD
함수가 클라이언트에서 실행될 수 있음을 표시하기 위해, 비동기 함수의 맨 위에 `'use server';`를 추가하세요. 우리는 이를 _Server Actions_ 이라고 부릅니다.
=======
Add `'use server'` at the top of an async function body to mark the function as callable by the client. We call these functions [_Server Functions_](/reference/rsc/server-functions).
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682

```js {2}
async function addToCart(data) {
  'use server';
  // ...
}
```

<<<<<<< HEAD
Server Action을 클라이언트에서 호출하면, 직렬화된 인자의 사본을 포함하는 서버로의 네트워크 요청이 생성됩니다. Server Action이 값을 반환하면, 그 값은 직렬화되고 클라이언트에 반환됩니다.

함수 각각에 `'use server'`를 표기하는 대신, 파일의 맨 위에 지시어를 추가하여 파일의 모든 export를, 클라이언트를 포함한 모든 곳에서 사용할 수 있는 Server Action으로 표기할 수 있습니다.

#### 주의 사항 {/*caveats*/}
* `'use server'`는 함수 또는 모듈의 맨 처음에 있어야 합니다. import를 포함한 다른 코드보다 위에 있어야 합니다.(지시어 위의 주석은 괜찮습니다). 백틱이 아닌 단일 또는 이중 따옴표로 작성해야 합니다.
* `'use server'`는 서버 측 파일에서만 사용할 수 있습니다. 결과적인 Server Action은 props를 통해 클라이언트 컴포넌트로 전달할 수 있습니다. 제공되는 [직렬화 타입](#serializable-parameters-and-return-values)을 참고하세요.
* Server Action을 [클라이언트 코드](/reference/rsc/use-client)에서 import 하기 위해, 지시어는 모듈 수준에서 사용되어야 합니다.
* 기본 네트워크 호출이 항상 비동기이므로 `'use server'`는 비동기 함수에서만 사용할 수 있습니다.
* 항상 Server Action의 인자를 신뢰할 수 없는 입력으로 취급하고 모든 변경을 검토하세요. [보안 고려사항](#security)을 확인하세요.
* Server Action은 [transition](/reference/react/useTransition) 안에서 호출되어야합니다. [`<form action>`](/reference/react-dom/components/form#props) 또는 [`formAction`](/reference/react-dom/components/input#props)로 전달된 Server Action은 자동으로 transition 내에서 호출됩니다.
* Server Action은 서버 측 상태를 업데이트하는 mutation을 위해 설계되었으며 데이터 fetching에는 권장되지 않습니다. 따라서 서버 액션을 구현하는 프레임워크는 일반적으로 한 번에 하나의 액션을 처리하며 반환 값을 캐시할 방법이 없습니다.
=======
When calling a Server Function on the client, it will make a network request to the server that includes a serialized copy of any arguments passed. If the Server Function returns a value, that value will be serialized and returned to the client.

Instead of individually marking functions with `'use server'`, you can add the directive to the top of a file to mark all exports within that file as Server Functions that can be used anywhere, including imported in client code.

#### Caveats {/*caveats*/}
* `'use server'` must be at the very beginning of their function or module; above any other code including imports (comments above directives are OK). They must be written with single or double quotes, not backticks.
* `'use server'` can only be used in server-side files. The resulting Server Functions can be passed to Client Components through props. See supported [types for serialization](#serializable-parameters-and-return-values).
* To import a Server Functions from [client code](/reference/rsc/use-client), the directive must be used on a module level.
* Because the underlying network calls are always asynchronous, `'use server'` can only be used on async functions.
* Always treat arguments to Server Functions as untrusted input and authorize any mutations. See [security considerations](#security).
* Server Functions should be called in a [Transition](/reference/react/useTransition). Server Functions passed to [`<form action>`](/reference/react-dom/components/form#props) or [`formAction`](/reference/react-dom/components/input#props) will automatically be called in a transition.
* Server Functions are designed for mutations that update server-side state; they are not recommended for data fetching. Accordingly, frameworks implementing Server Functions typically process one action at a time and do not have a way to cache the return value.
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682

### 보안 고려사항 {/*security*/}

<<<<<<< HEAD
Server Action에 대한 인수는 완전히 클라이언트에서 제어됩니다. 보안을 위해 항상 신뢰할 수 없는 입력으로 취급하여, 인자를 적절하게 검증하고 이스케이프 하는지 확인하세요.

Server Action에서 로그인한 사용자가 해당 작업을 수행할 수 있는지 확인하세요.

<Wip>

Server Action에서 중요한 데이터를 전송하지 않도록 하기 위해, 고유한 값과 객체가 클라이언트 코드로 전달되는 것을 방지하기 위한 실험적인 테인트 API가 있습니다.
=======
Arguments to Server Functions are fully client-controlled. For security, always treat them as untrusted input, and make sure to validate and escape arguments as appropriate.

In any Server Function, make sure to validate that the logged-in user is allowed to perform that action.

<Wip>

To prevent sending sensitive data from a Server Function, there are experimental taint APIs to prevent unique values and objects from being passed to client code.
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682

[experimental_taintUniqueValue](/reference/react/experimental_taintUniqueValue)와 [experimental_taintObjectReference](/reference/react/experimental_taintObjectReference)를 참고하세요.

</Wip>

### 직렬화 가능 인수와 반환값 {/*serializable-parameters-and-return-values*/}

<<<<<<< HEAD
클라이언트 코드가 네트워크를 통해 서버 작업을 호출할 때 전달된 인수는 모두 직렬화되어야 합니다.

다음은 지원되는 Server Action 인자의 타입입니다.

* Primitives
  * [string](https://developer.mozilla.org/ko/docs/Glossary/String)
  * [number](https://developer.mozilla.org/ko/docs/Glossary/Number)
  * [bigint](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
  * [boolean](https://developer.mozilla.org/ko/docs/Glossary/Boolean)
  * [undefined](https://developer.mozilla.org/ko/docs/Glossary/Undefined)
  * [null](https://developer.mozilla.org/ko/docs/Glossary/Null)
  * [symbol](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Symbol), [`Symbol.for`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for)를 통해 전역 Symbol로 등록된 Symbol 한정
* 직렬화 가능한 값을 포함한 Iterables
  * [String](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/String)
  * [Array](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array)
  * [Map](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Map)
  * [Set](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Set)
  * [TypedArray](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)와 [ArrayBuffer](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
* [Date](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Date)
* [FormData](https://developer.mozilla.org/ko/docs/Web/API/FormData) 인스턴스
* [object initializers](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Object_initializer)로 직렬화 가능한 속성과 함께 생성된 일반 [objects](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object)
* Server Action인 함수
* [Promises](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise)

특히 다음은 지원되지 않습니다.
* React 엘리먼트 또는 [JSX](/learn/writing-markup-with-jsx)
* 컴포넌트 함수 또는 Server Action이 아닌 다른 함수를 포함하는 함수
* [클래스](https://developer.mozilla.org/ko/docs/Learn/JavaScript/Objects/Classes_in_JavaScript)
* 클래스의 인스턴스인 객체(언급된 내장 객체 제외)또는 [null 프로토타입](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects)이 있는 개체
* 전역에 등록되지 않은 Symbol, 예. `Symbol('my new symbol')`
=======
Since client code calls the Server Function over the network, any arguments passed will need to be serializable.

Here are supported types for Server Function arguments:

* Primitives
	* [string](https://developer.mozilla.org/en-US/docs/Glossary/String)
	* [number](https://developer.mozilla.org/en-US/docs/Glossary/Number)
	* [bigint](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
	* [boolean](https://developer.mozilla.org/en-US/docs/Glossary/Boolean)
	* [undefined](https://developer.mozilla.org/en-US/docs/Glossary/Undefined)
	* [null](https://developer.mozilla.org/en-US/docs/Glossary/Null)
	* [symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol), only symbols registered in the global Symbol registry via [`Symbol.for`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for)
* Iterables containing serializable values
	* [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
	* [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
	* [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
	* [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
	* [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) and [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
* [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
* [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) instances
* Plain [objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object): those created with [object initializers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer), with serializable properties
* Functions that are Server Functions
* [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Notably, these are not supported:
* React elements, or [JSX](/learn/writing-markup-with-jsx)
* Functions, including component functions or any other function that is not a Server Function
* [Classes](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Classes_in_JavaScript)
* Objects that are instances of any class (other than the built-ins mentioned) or objects with [a null prototype](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects)
* Symbols not registered globally, ex. `Symbol('my new symbol')`
* Events from event handlers
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682

지원되는 직렬화 가능한 반환 값은 경계 클라이언트 컴포넌트의 [직렬화 가능한 props](/reference/react/use-client#passing-props-from-server-to-client-components)와 동일합니다.

### Server Action 형식 {/*server-actions-in-forms*/}

Server Action의 가장 일반적인 사용 사례는, 데이터를 변경하는 서버 함수를 호출하는 것입니다. 브라우저에서 [HTML 폼 엘리먼트](https://developer.mozilla.org/ko/docs/Web/HTML/Element/form)는 사용자가 mutation을 제출하는 전통적인 접근 방식입니다. React 서버 컴포넌트로, React는 [forms](/reference/react-dom/components/form)에서 Server Action에 대한 최상의 지원을 제공합니다.

<<<<<<< HEAD
사용자가 사용자 이름을 요청할 수 있는 양식이 있습니다.
=======
## Usage {/*usage*/}

### Server Functions in forms {/*server-functions-in-forms*/}

The most common use case of Server Functions will be calling functions that mutate data. On the browser, the [HTML form element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) is the traditional approach for a user to submit a mutation. With React Server Components, React introduces first-class support for Server Functions as Actions in [forms](/reference/react-dom/components/form).

Here is a form that allows a user to request a username.
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682

```js [[1, 3, "formData"]]
// App.js

async function requestUsername(formData) {
  'use server';
  const username = formData.get('username');
  // ...
}

export default function App() {
  return (
    <form action={requestUsername}>
      <input type="text" name="username" />
      <button type="submit">Request</button>
    </form>
  );
}
```

<<<<<<< HEAD
예시에서 `requestUsername`는 `<form>`을 통한 Server Action입니다. 사용자가 이 양식을 제출하면 서버 함수인 `requestUsername`에 네트워크 요청이 있습니다. 폼에서 Server Action을 호출할 때 React는 폼의 <CodeStep step={1}>[FormData](https://developer.mozilla.org/ko/docs/Web/API/FormData)</CodeStep>를 Server Action의 첫 번째 인자로 제공합니다.

Server Action을 폼 `action`에 전달하여, React는 폼을 [점진적 향상](https://developer.mozilla.org/ko/docs/Glossary/Progressive_Enhancement)할 수 있습니다. 이것은 자바스크립트 번들이 로드되기 전에 양식을 제출할 수 있다는 것을 의미합니다.
=======
In this example `requestUsername` is a Server Function passed to a `<form>`. When a user submits this form, there is a network request to the server function `requestUsername`. When calling a Server Function in a form, React will supply the form's <CodeStep step={1}>[FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)</CodeStep> as the first argument to the Server Function.

By passing a Server Function to the form `action`, React can [progressively enhance](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement) the form. This means that forms can be submitted before the JavaScript bundle is loaded.
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682


#### 폼에서 반환 값 처리 {/*handling-return-values*/}

<<<<<<< HEAD
점진적 향상을 지원하며 Server Action의 결과를 기반으로 UI를 업데이트하려면, [`useActionState`](/reference/react/useActionState)를 사용하세요.
=======
To update the UI based on the result of a Server Function while supporting progressive enhancement, use [`useActionState`](/reference/react/useActionState).
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682

```js
// requestUsername.js
'use server';

export default async function requestUsername(formData) {
  const username = formData.get('username');
  if (canRequest(username)) {
    // ...
    return 'successful';
  }
  return 'failed';
}
```

```js {4,8}, [[2, 2, "'use client'"]]
// UsernameForm.js
'use client';

import { useActionState } from 'react';
import requestUsername from './requestUsername';

function UsernameForm() {
  const [state, action] = useActionState(requestUsername, null, 'n/a');

  return (
    <>
      <form action={action}>
        <input type="text" name="username" />
        <button type="submit">Request</button>
      </form>
      <p>Last submission request returned: {state}</p>
    </>
  );
}
```

대부분의 Hook과 마찬가지로 `useActionState`는 <CodeStep step={1}>[client code](/reference/rsc/use-client)</CodeStep>에서만 호출할 수 있습니다.

<<<<<<< HEAD
### `<form>`외부에서 Server Action 호출하기 {/*calling-a-server-action-outside-of-form*/}

Server Action은 노출된 서버 엔드포인트이며 클라이언트 코드 어디에서나 호출할 수 있습니다.

[form](/reference/react-dom/components/form) 외부에서 Server Action을 사용할 때, [Transition](/reference/react/useTransition)에서 서버 액션을 호출하면 로딩 인디케이터를 표시하고, [낙관적 상태 업데이트](/reference/react/useOptimistic)를 표시하며 예기치 않은 오류를 처리할 수 있습니다. 폼은 transition의 Server Action을 자동으로 래핑합니다.
=======
### Calling a Server Function outside of `<form>` {/*calling-a-server-function-outside-of-form*/}

Server Functions are exposed server endpoints and can be called anywhere in client code.

When using a Server Function outside a [form](/reference/react-dom/components/form), call the Server Function in a [Transition](/reference/react/useTransition), which allows you to display a loading indicator, show [optimistic state updates](/reference/react/useOptimistic), and handle unexpected errors. Forms will automatically wrap Server Functions in transitions.
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682

```js {9-12}
import incrementLike from './actions';
import { useState, useTransition } from 'react';

function LikeButton() {
  const [isPending, startTransition] = useTransition();
  const [likeCount, setLikeCount] = useState(0);

  const onClick = () => {
    startTransition(async () => {
      const currentCount = await incrementLike();
      setLikeCount(currentCount);
    });
  };

  return (
    <>
      <p>Total Likes: {likeCount}</p>
      <button onClick={onClick} disabled={isPending}>Like</button>;
    </>
  );
}
```

```js
// actions.js
'use server';

let likeCount = 0;
export default async function incrementLike() {
  likeCount++;
  return likeCount;
}
```

<<<<<<< HEAD
Server Action 반환 값을 읽으려면 반환된 promise를 `await` 해야합니다.
=======
To read a Server Function return value, you'll need to `await` the promise returned.
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682
