---
title: requestFormReset
---

<Intro>

`requestFormReset`을 사용하면 Action이나 Transition이 끝난 후 React가 관리하는 폼을 초기화할 수 있습니다.

```js
requestFormReset(form)
```

</Intro>

<InlineToc />

---

## 레퍼런스 {/*reference*/}

### `requestFormReset(form)` {/*requestformreset*/}

현재 Action이나 Transition이 완료된 후 폼이 초기화되도록 요청하려면 `requestFormReset`을 호출하세요.

```js
import { startTransition } from 'react';
import { requestFormReset } from 'react-dom';

function handleSubmit(form) {
  startTransition(async () => {
    const formData = new FormData(form);
    requestFormReset(form);
    await save(formData);
  });
}
```

[아래 예시를 참고하세요.](#usage)

#### 매개변수 {/*parameters*/}

* `form`: React가 렌더링한 [HTML 폼 엘리먼트](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement)입니다.

#### 반환값 {/*returns*/}

`requestFormReset`은 아무것도 반환하지 않습니다.

#### 주의 사항 {/*caveats*/}

* React가 렌더링한 폼 엘리먼트를 전달하세요. 폼이 아닌 엘리먼트나 React가 관리하지 않는 폼을 전달하면 오류가 발생합니다.
* `requestFormReset`은 Action과 Transition에서 사용하기 위한 것입니다. Action이나 Transition 밖에서 호출하면 React는 폼을 동기적으로 초기화하고 개발 환경에서는 경고를 표시합니다.
* `requestFormReset`은 폼 제출 로직을 직접 구현하면서도(예: `onSubmit` + `startTransition`) React의 폼 초기화 동작을 사용하고 싶을 때 유용합니다.
* 이 API는 비제어 폼 필드의 초기화를 요청합니다. 제어 필드는 `onReset` 등에서 State를 업데이트하여 초기화하세요.

---

## 사용법 {/*usage*/}

### 사용자 정의 폼 Action에서 초기화 요청하기 {/*requesting-a-reset-in-a-custom-form-action*/}

React는 [`<form action={...}>` 제출이 성공하면 비제어 필드를 자동으로 초기화합니다](/reference/react-dom/components/form#handle-form-submission-with-an-action-prop). 제출을 직접 구현할 때는 `requestFormReset`을 호출하여 같은 동작을 적용할 수 있습니다.

```js
import { startTransition } from 'react';
import { requestFormReset } from 'react-dom';

function SearchForm() {
  async function onSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      requestFormReset(form);
      await submitSearch(formData);
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <input name="query" defaultValue="react" />
      <button type="submit">검색</button>
    </form>
  );
}
```

`<form action={...}>`의 내장 제출 동작을 사용한다면 `requestFormReset`을 따로 호출할 필요가 없습니다.
