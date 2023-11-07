---
title: experimental_taintObjectReference
---

<Wip>

**이 API는 실험적이며 React 안정 버전에서는 아직 사용할 수 없습니다.**

이 API를 사용하려면 React 패키지를 가장 최근의 실험적인 버전으로 업그레이드해야 합니다.

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

실험적인 버전의 React에는 버그가 있을 수 있습니다. 프로덕션에서는 사용하지 마세요.

이 API는 React 서버 컴포넌트에서만 사용할 수 있습니다.

</Wip>


<Intro>

`taintObjectReference`를 사용하면 `user` 객체와 같은 특정한 객체 인스턴스를 클라이언트 컴포넌트로 전송하는 것을 방지할 수 있습니다.

```js
experimental_taintObjectReference(message, object);
```
키, 해시 또는 토큰이 전달되는 것을 방지하는 방법은 [`taintUniqueValue`](/reference/react/experimental_taintUniqueValue)를 참고하세요.

</Intro>

<InlineToc />

---

## 레퍼런스 {/*reference*/}

### `taintObjectReference(message, object)` {/*taintobjectreference*/}

Call `taintObjectReference` with an object to register it with React as something that should not be allowed to be passed to the Client as is:

```js
import {experimental_taintObjectReference} from 'react';

experimental_taintObjectReference(
  'Do not pass ALL environment variables to the client.',
  process.env
);
```

[더 많은 예제를 아래에서 볼 수 있습니다.](#usage)

#### 매개변수 {/*parameters*/}

* `message`: 객체가 클라이언트 컴포넌트로 전달될 때 표시할 메시지. 객체가 클라이언트 컴포넌트로 전달될 때 발생하는 에러 객체에 포함되어 나타나는 메시지입니다.

* `object`: 오염(taint)될 객체. 함수와 클래스 인스턴스도 `object`로서 `taintObjectReference`에 전달될 수 있습니다. 함수와 클래스는 클라이언트 컴포넌트로 전달되지 않도록 이미 막혀있지만 React의 기본 에러 메시지 대신 `message`에 설정한 메시지를 보여줄 수 있습니다. 타입 배열(Typed Array)의 인스턴스를 `object`로서 `taintObjectReference`에 전달하면 같은 타입 배열의 다른 인스턴스가 오염되지 않습니다.

#### 반환값 {/*returns*/}

`experimental_taintObjectReference`는 `undefined`를 반환합니다.

#### 주의사항 {/*caveats*/}

- Recreating or cloning a tainted object creates a new untained object which main contain sensetive data. For example, if you have a tainted `user` object, `const userInfo = {name: user.name, ssn: user.ssn}` or `{...user}` will create new objects which are not tainted. `taintObjectReference` only protects against simple mistakes when the object is passed through to a Client Component unchanged.

<Pitfall>

**Do not rely on just tainting for security.** Tainting an object doesn't prevent leaking of every possible derived value. For example, the clone of a tainted object will create a new untained object. Using data from a tainted object (e.g. `{secret: taintedObj.secret}`) will create a new value or object that is not tainted. Tainting is a layer of protection; a secure app will have multiple layers of protection, well designed APIs, and isolation patterns.

</Pitfall>

---

## 사용법 {/*usage*/}

### 사용자 데이터가 의도하지 않게 클라이언트로 전달되는 것을 방지하기 {/*prevent-user-data-from-unintentionally-reaching-the-client*/}

클라이언트 컴포넌트에는 민감한 데이터를 담은 객체가 전달되어서는 안됩니다. 이상적으로, 데이터 페치 함수는 현재 사용자가 접근할 수 없는 데이터를 노출하면 안됩니다. 하지만 리팩토링 도중 가끔 실수가 발생하기도 합니다. 데이터 API에서 사용자 객체를 "오염(taint)"시켜서 이러한 실수를 방지할 수 있습니다.

```js
import {experimental_taintObjectReference} from 'react';

export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  experimental_taintObjectReference(
    'user 객체 전체를 클라이언트로 전달하지 마십시오. ' +
      '필요하다면 일부 특정한 프로퍼티만 뽑아서 사용하는 것이 좋습니다.',
    user,
  );
  return user;
}
```

Now whenever anyone tries to pass this object to a Client Component, an error will be thrown with the passed in error message instead.

<DeepDive>

#### Protecting against leaks in data fetching {/*protecting-against-leaks-in-data-fetching*/}

If you're running a Server Components environment that has access to sensitive data, you have to be careful not to pass objects straight through:

```js
// api.js
export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  return user;
}
```

```js
import { getUser } from 'api.js';
import { InfoCard } from 'components.js';

export async function Profile(props) {
  const user = await getUser(props.userId);
  // DO NOT DO THIS
  return <InfoCard user={user} />;
}
```

```js
// components.js
"use client";

export async function InfoCard({ user }) {
  return <div>{user.name}</div>;
}
```

이상적으로 `getUser`는 현재 사용자가 접근할 수 없는 데이터를 노출하지 않아야 합니다. `user` 객체가 클라이언트 컴포넌트로 전달되는 것을 방지하려면 사용자 객체를 "오염(taint)"시켜야 합니다.

```js
// api.js
import {experimental_taintObjectReference} from 'react';

export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  experimental_taintObjectReference(
    'user 객체 전체를 클라이언트로 전달하지 마십시오. ' +
      '필요하다면 일부 특정한 프로퍼티만 뽑아서 사용하는 것이 좋습니다.',
    user,
  );
  return user;
}
```

이제 누군가 `user` 객체를 클라이언트 컴포넌트로 전달하려고 하면 설정한 에러 메시지와 함께 에러가 발생합니다.

</DeepDive>
