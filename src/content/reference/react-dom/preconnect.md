---
title: preconnect
---

<Intro>

`preconnect`를 사용하면 리소스를 가져올 것으로 예상하는 서버에 연결할 수 있습니다.

```js
preconnect("https://example.com");
```

</Intro>

<InlineToc />

---

## 레퍼런스 {/*reference*/}

### `preconnect(href)` {/*preconnect*/}

호스트에 미리 연결하려면, `react-dom`에서 `preconnect`를 호출합니다.

```js
import { preconnect } from 'react-dom';

function AppRoot() {
  preconnect("https://example.com");
  // ...
}

```

[아래 예시를 참고하세요.](#usage)

`preconnect`는 브라우저가 해당 서버와 연결을 맺어야 한다는 힌트를 제공합니다. 브라우저가 해당 서버를 선택하면, 해당 서버에서 리소스를 불러오는 속도가 빨라질 수 있습니다.

#### 매개변수 {/*parameters*/}

* `href`: 문자열. 연결할 서버의 URL입니다.


#### 반환값 {/*returns*/}

`preconnect`는 아무 값도 반환하지 않습니다.

#### 주의 사항 {/*caveats*/}

* 동일한 서버에 대해 여러 번의 `preconnect` 호출은 한 번의 호출과 동일한 효과를 갖습니다.
* 브라우저에서 `preconnect`는 컴포넌트를 렌더링할 때, Effect 내부, 이벤트 핸들러 내부 등 모든 상황에서 호출할 수 있습니다.
* 서버 사이드 렌더링 또는 서버 컴포넌트를 렌더링할 때, `preconnect`는 컴포넌트를 렌더링하는 동안 호출하거나 컴포넌트를 렌더링하는 컨텍스트에서 시작된 비동기 컨텍스트 내에서 호출할 때만 효과가 있습니다. 그 외의 호출은 무시됩니다.
* 필요한 특정 리소스를 알고 있다면, [다른 함수](/reference/react-dom/#resource-preloading-apis)를 호출하여 리소스를 즉시 로드할 수 있습니다.
* 웹 페이지 자체가 호스팅되는 동일한 서버에 사전 연결하는 것은 이점이 없습니다. 힌트가 주어질 때 웹 페이지 자체가 이미 연결되어 있기 때문입니다.

---

## 사용법 {/*usage*/}

### 렌더링 시 사전 연결 {/*preconnecting-when-rendering*/}

자식 컴포넌트가 해당 호스트에서 외부 리소스를 로드할 것임을 알고 있다면, 컴포넌트를 렌더링할 때 `preconnect`를 호출하세요.

```js
import { preconnect } from 'react-dom';

function AppRoot() {
  preconnect("https://example.com");
  return ...;
}
```

### 이벤트 핸들러에서 사전 연결 {/*preconnecting-in-an-event-handler*/}

외부 리소스가 필요한 페이지나 State로 전환하기 전에 이벤트 핸들러에서 `preconnect`를 호출하세요. 이렇게 하면 새로운 페이지나 State를 렌더링할 때 호출하는 것보다 더 일찍 프로세스를 시작할 수 있습니다.

```js
import { preconnect } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preconnect('http://example.com');
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```
