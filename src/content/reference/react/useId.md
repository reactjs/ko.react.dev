---
title: useId
---

<Intro>

`useId`는 접근성 어트리뷰트에 전달할 수 있는 고유 ID를 생성하기 위한 React Hook입니다.

```js
const id = useId()
```

</Intro>

<InlineToc />

---

## 레퍼런스 {/*reference*/}

### `useId()` {/*useid*/}

`useId`를 컴포넌트의 최상위에서 호출하여 고유 ID를 생성합니다.

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  // ...
```

[아래에서 더 많은 예시를 확인하세요.](#usage)

#### 매개변수 {/*parameters*/}

`useId`는 어떤 매개변수도 받지 않습니다.

#### 반환값 {/*returns*/}

`useId`를 호출한 특정 컴포넌트와 특정 `useId`에 관련된 고유 ID 문자열을 반환합니다.

#### 주의 사항 {/*caveats*/}

* `useId`는 Hook이므로 **컴포넌트의 최상위** 또는 커스텀 Hook에서만 호출할 수 있습니다. 반복문이나 조건문에서는 사용할 수 없습니다. 필요한 경우 새로운 컴포넌트를 추출하고 해당 컴포넌트로 state를 이동해서 사용할 수 있습니다.

* `useId`를 리스트의 **key를 생성하기 위해 사용하면 안 됩니다**. [Key는 데이터로부터 생성해야 합니다.](/learn/rendering-lists#where-to-get-your-key)

---

## 사용법 {/*usage*/}

<Pitfall>

**`useId`를 리스트의 key를 생성하기 위해 사용하면 안 됩니다.** [Key는 데이터로부터 생성해야 합니다.](/learn/rendering-lists#where-to-get-your-key)

</Pitfall>

### 접근성 어트리뷰트를 위한 고유 ID 생성하기 {/*generating-unique-ids-for-accessibility-attributes*/}

고유 ID를 생성하기 위해 `useId`를 컴포넌트의 최상단에서 호출합니다.

```js [[1, 4, "passwordHintId"]]
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  // ...
```

<CodeStep step={1}>생성된 ID</CodeStep>를 다른 어트리뷰트로 전달할 수 있습니다.

```js [[1, 2, "passwordHintId"], [1, 3, "passwordHintId"]]
<>
  <input type="password" aria-describedby={passwordHintId} />
  <p id={passwordHintId}>
</>
```

**예제를 통해 유용한 상황에 대해 알아보겠습니다.**

[`aria-describedby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby)와 같은 [HTML 접근성 어트리뷰트](https://developer.mozilla.org/ko/docs/Web/Accessibility/ARIA)를 사용하면 두 개의 태그가 서로 연관되어 있다는 것을 명시할 수 있습니다. 예를 들어 엘리먼트(input)를 다른 엘리먼트(paragraph)에서 설명하도록 명시할 수 있습니다.

HTML에서는 일반적으로 다음과 같이 작성합니다.

```html {5,8}
<label>
  Password:
  <input
    type="password"
    aria-describedby="password-hint"
  />
</label>
<p id="password-hint">
  The password should contain at least 18 characters
</p>
```

React에서 ID를 직접 코드에 입력하는 것은 좋은 사례가 아닙니다. 페이지에서 컴포넌트는 몇 번이고 렌더링 될 수 있지만 ID는 고유해야 합니다. ID를 직접 입력하는 대신 `useId`를 활용해서 고유한 ID를 생성할 수 있습니다.

```js {4,11,14}
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  return (
    <>
      <label>
        Password:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        The password should contain at least 18 characters
      </p>
    </>
  );
}
```

이제 `PasswordField`가 화면에 여러 번 나타나도 생성된 ID는 충돌하지 않습니다.

<Sandpack>

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  return (
    <>
      <label>
        Password:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        The password should contain at least 18 characters
      </p>
    </>
  );
}

export default function App() {
  return (
    <>
      <h2>Choose password</h2>
      <PasswordField />
      <h2>Confirm password</h2>
      <PasswordField />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

[영상](https://www.youtube.com/watch?v=0dNzNcuEuOo)을 통해 보조 기술을 활용했을 때 사용자 경험의 차이점을 확인할 수 있습니다.

<Pitfall>

[서버 렌더링](/reference/react-dom/server)에서 **`useId`는 서버와 클라이언트에서 동일한 컴포넌트 트리가 필요합니다.** 서버와 클라이언트에서 렌더링하는 트리가 정확히 일치하지 않으면 생성된 ID는 일치하지 않습니다.

</Pitfall>

<DeepDive>

#### useId를 사용하는 것이 카운터를 증가하는 것보다 나은 이유는 무엇일까요? {/*why-is-useid-better-than-an-incrementing-counter*/}

`useId`를 사용하는 것이 `nextId++`처럼 전역 변수를 증가하는 것보다 나은 이유에 대해 궁금할 수 있습니다.

`useId`의 주요 이점은 React가 [서버 렌더링](/reference/react-dom/server)과 함께 작동하도록 보장한다는 것입니다. 서버 렌더링을 하는 동안 컴포넌트는 HTML 결과물을 생성합니다. 이후, 클라이언트에서 [hydration](/reference/react-dom/client/hydrateRoot)이 HTML 결과물에 이벤트 핸들러를 연결합니다. hydration이 동작하려면 클라이언트의 출력이 서버 HTML과 일치해야 합니다.

<<<<<<< HEAD
클라이언트 컴포넌트의 hydrated 순서가 서버 HTML이 생성된 순서와 일치하지 않을 수 있기 때문에 카운터 증가로 이를 보장하기는 매우 어렵습니다. `useId`를 사용하면 hydration이 동작하고 서버와 클라이언트 간에 출력이 일치하는 것을 보장할 수 있습니다.
=======
This is very difficult to guarantee with an incrementing counter because the order in which the Client Components are hydrated may not match the order in which the server HTML was emitted. By calling `useId`, you ensure that hydration will work, and the output will match between the server and the client.
>>>>>>> 4f9e9a56611c7a56b9506cf0a7ca84ab409824bc

React에서 `useId`는 호출한 컴포넌트의 "부모 경로"에서 생성됩니다. 클라이언트와 서버 트리가 동일한 경우 렌더링 순서와 관계없이 "부모 경로"가 일치하는 이유입니다.

</DeepDive>

---

### 여러 개의 연관된 엘리먼트의 ID 생성하기 {/*generating-ids-for-several-related-elements*/}

여러 개의 연관된 엘리먼트에 ID를 전달하는 과정이 필요할 때 `useId`를 사용해서 공유 접두사를 생성할 수 있습니다.

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const id = useId();
  return (
    <form>
      <label htmlFor={id + '-firstName'}>First Name:</label>
      <input id={id + '-firstName'} type="text" />
      <hr />
      <label htmlFor={id + '-lastName'}>Last Name:</label>
      <input id={id + '-lastName'} type="text" />
    </form>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

`useId`를 고유한 ID가 필요한 모든 엘리먼트에서 실행하는 것을 방지할 수 있습니다.

---

### 생성된 모든 ID에 대해 공유 접두사 지정하기 {/*specifying-a-shared-prefix-for-all-generated-ids*/}

여러 개의 독립된 React 애플리케이션을 하나의 페이지에서 렌더링한다면 `identifierPrefix`를  [`createRoot`](/reference/react-dom/client/createRoot#parameters) 또는 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) 호출에 대한 옵션으로 전달합니다. `useId`로 생성된 모든 식별자가 별개의 접두사로 시작하므로 서로 다른 두 개의 앱에서 생성된 ID가 충돌하지 않는 것을 보장합니다.

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <div id="root1"></div>
    <div id="root2"></div>
  </body>
</html>
```

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  console.log('Generated identifier:', passwordHintId)
  return (
    <>
      <label>
        Password:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        The password should contain at least 18 characters
      </p>
    </>
  );
}

export default function App() {
  return (
    <>
      <h2>Choose password</h2>
      <PasswordField />
    </>
  );
}
```

```js index.js active
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root1 = createRoot(document.getElementById('root1'), {
  identifierPrefix: 'my-first-app-'
});
root1.render(<App />);

const root2 = createRoot(document.getElementById('root2'), {
  identifierPrefix: 'my-second-app-'
});
root2.render(<App />);
```

```css
#root1 {
  border: 5px solid blue;
  padding: 10px;
  margin: 5px;
}

#root2 {
  border: 5px solid green;
  padding: 10px;
  margin: 5px;
}

input { margin: 5px; }
```

</Sandpack>
