---
title: experimental_taintUniqueValue
---

<Wip>

**이 API는 실험적이며 React 안정 버전에서는 아직 사용할 수 없습니다.**

이 API를 사용하려면 React 패키지를 가장 최근의 실험적인 버전으로 업그레이드해야 합니다.

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

실험적인 버전의 React에는 버그가 있을 수 있습니다. 프로덕션에서는 사용하지 마세요.

이 API는 [React Server Components](/reference/react/use-client)에서만 사용할 수 있습니다.

</Wip>


<Intro>

`taintUniqueValue`를 사용하면 패스워드, 키 또는 토큰과 같은 고유 값을 클라이언트 컴포넌트로 전송하는 것을 방지할 수 있습니다.

```js
taintUniqueValue(errMessage, lifetime, value)
```

중요한 데이터가 포함된 객체가 전달되는 것을 방지하는 방법은 [`taintObjectReference`](/reference/react/experimental_taintObjectReference)를 참고하세요.

</Intro>

<InlineToc />

---

## 레퍼런스 {/*reference*/}

### `taintUniqueValue(message, lifetime, value)` {/*taintuniquevalue*/}

클라이언트에 전달되지 않아야 할 패스워드, 토큰, 키 또는 해시를 `taintUniqueValue`와 함께 호출하여 React에 등록합니다.

```js
import {experimental_taintUniqueValue} from 'react';

experimental_taintUniqueValue(
  '시크릿 키를 클라이언트로 전달하지 마세요.',
  process,
  process.env.SECRET_KEY
);
```

[더 많은 예제를 아래에서 볼 수 있습니다.](#usage)

#### 매개변수 {/*parameters*/}

* `message`: `value`가 클라이언트 컴포넌트로 전달될 때 표시할 메시지. `value`가 클라이언트 컴포넌트로 전달될 때 발생하는 에러 객체에 포함되어 나타나는 메시지입니다.

* `lifetime`: `value`가 오염(taint)되어야 할 기간을 나타내는 객체. `value`는 이 객체가 존재하는 동안 클라이언트 컴포넌트로 전달되지 않도록 차단됩니다. 예를 들어 `globalThis`를 전달하면 앱이 종료될 때 까지 값이 차단됩니다. `lifetime`은 일반적으로 `value`를 프로퍼티로 가지는 객체입니다.

* `value`: string, bigint 또는 TypedArray. `value`는 암호화 토큰, 개인 키, 해시 또는 긴 패스워드와 같이 문자 또는 바이트로 이루어진 복잡하고 고유한 값이어야 합니다. `value`는 클라이언트 컴포넌트로 전송되지 않도록 차단됩니다.

#### 반환값 {/*returns*/}

`experimental_taintUniqueValue`는 `undefined`를 반환합니다.

#### 주의사항 {/*caveats*/}

- 오염된 값에서 새로운 값을 도출하면 오염 보호가 손상될 수 있습니다. 오염된 값을 대문자로 변경하거나, 다른 문자열과 연결하거나, base64로 변환하거나, 잘라내는 등 기타 유사한 변환을 통해서 새롭게 생성된 값은 `taintUniqueValue`을 명시적으로 호출하지 않으면 오염되지 않습니다.

---

## 사용법 {/*usage*/}

### 토큰이 클라이언트 구성 요소로 전달되지 않도록 방지하기 {/*prevent-a-token-from-being-passed-to-client-components*/}

패스워드, 세션 토큰 또는 기타 고유 값과 같은 민감한 정보가 실수로 클라이언트 컴포넌트로 전달되지 않도록 `taintUniqueValue` 함수는 보호 계층을 제공합니다. 값이 오염되면 클라이언트 컴포넌트로 전달하려는 시도는 에러를 발생시킵니다.

`lifetime` 인자는 값이 오염된 상태로 남아 있는 기간을 정의합니다. 값이 무한히 오염된 상태로 유지되어야 하는 경우 [`globalThis`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis) 또는 `process`와 같은 객체가 `lifetime` 인자로 사용될 수 있습니다. 이 객체들은 앱이 실행되는 전체 기간을 수명으로 가집니다.

```js
import {experimental_taintUniqueValue} from 'react';

experimental_taintUniqueValue(
  '패스워드를 클라이언트로 전달하지 마세요.',
  globalThis,
  process.env.SECRET_KEY
);
```

만약 오염된 값의 수명이 객체에 묶여 있다면, `lifetime`은 그 값을 갭슐화하는 객체이어야 합니다. 이렇게 하면 오염된 값이 캡슐화 객체의 수명 동안 보호될 수 있습니다.

```js
import {experimental_taintUniqueValue} from 'react';

export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  experimental_taintUniqueValue(
    '세션 토큰을 클라이언트로 전달하지 마세요.',
    user,
    user.session.token
  );
  return user;
}
```

이 예시에서 `user` 객체는 `lifetime` 인자 역할을 합니다. 이 객체가 글로벌 캐시에 저장되거나 다른 요청에 의해 접근할 수 있다면 세션 토큰은 오염된 상태로 유지됩니다.

<Pitfall>

**Do not rely solely on tainting for security.** Tainting a value doesn't block every possible derived value. For example, creating a new value by upper casing a tainted string will not taint the new value.


```js
import {experimental_taintUniqueValue} from 'react';

const password = 'correct horse battery staple';

experimental_taintUniqueValue(
  'Do not pass the password to the client.',
  globalThis,
  password
);

const uppercasePassword = password.toUpperCase() // `uppercasePassword` is not tainted
```

In this example, the constant `password` is tainted. Then `password` is used to create a new value `uppercasePassword` by calling the `toUpperCase` method on `password`. The newly created `uppercasePassword` is not tainted.

Other similar ways of deriving new values from tainted values like concatenating it into a larger string, converting it to base64, or returning a substring create untained values.

Tainting only protects against simple mistakes like explictly passing secret values to the client. Mistakes in calling the `taintUniqueValue` like using a global store outside of React, without the corresponding lifetime object, can cause the tainted value to become untainted. Tainting is a layer of protection; a secure app will have multiple layers of protection, well designed APIs, and isolation patterns.

</Pitfall>

<DeepDive>

#### Using `server-only` and `taintUniqueValue` to prevent leaking secrets {/*using-server-only-and-taintuniquevalue-to-prevent-leaking-secrets*/}

If you're running a Server Components environment that has access to private keys or passwords such as database passwords, you have to be careful not to pass that to a Client Component.

```js
export async function Dashboard(props) {
  // DO NOT DO THIS
  return <Overview password={process.env.API_PASSWORD} />;
}
```

```js
"use client";

import {useEffect} from '...'

export async function Overview({ password }) {
  useEffect(() => {
    const headers = { Authorization: password };
    fetch(url, { headers }).then(...);
  }, [password]);
  ...
}
```

This example would leak the secret API token to the client. If this API token can be used to access data this particular user shouldn't have access to, it could lead to a data breach.

[comment]: <> (TODO: Link to `server-only` docs once they are written)

Ideally, secrets like this are abstracted into a single helper file that can only be imported by trusted data utilities on the server. The helper can even be tagged with [`server-only`](https://www.npmjs.com/package/server-only) to ensure that this file isn't imported on the client.

```js
import "server-only";

export function fetchAPI(url) {
  const headers = { Authorization: process.env.API_PASSWORD };
  return fetch(url, { headers });
}
```

Sometimes mistakes happen during refactoring and not all of your colleagues might know about this. 
To protect against this mistakes happening down the line we can "taint" the actual password:

```js
import "server-only";
import {experimental_taintUniqueValue} from 'react';

experimental_taintUniqueValue(
  'Do not pass the API token password to the client. ' +
    'Instead do all fetches on the server.'
  process,
  process.env.API_PASSWORD
);
```

Now whenever anyone tries to pass this password to a Client Component, or send the password to a Client Component with a Server Action, a error will be thrown with message you defined when you called `taintUniqueValue`.

</DeepDive>

---
