---
title: prefetchDNS
---

<Intro>

`prefetchDNS`는 리소스를 가져올 것으로 예상하는 서버의 IP를 미리 조회할 수 있게 해줍니다.

```js
prefetchDNS("https://example.com");
```

</Intro>

<InlineToc />

---

## 레퍼런스 {/*reference*/}

### `prefetchDNS(href)` {/*prefetchdns*/}

호스트에 미리 연결하려면, `react-dom`에서 `prefetchDNS`를 호출합니다.

```js
import { prefetchDNS } from 'react-dom';

function AppRoot() {
  prefetchDNS("https://example.com");
  // ...
}

```

[아래 예시를 참고하세요.](#usage)

`prefetchDNS`는 브라우저에게 주어진 서버의 IP 주소를 조회해야 한다는 힌트를 제공합니다. 브라우저가 이를 수행하기로 선택하면 해당 서버에서 리소스를 로딩하는 속도가 빨라질 수 있습니다.

#### 매개변수 {/*parameters*/}

* `href`: 문자열. 연결하려는 서버의 URL입니다.

#### 반환값 {/*returns*/}

`prefetchDNS`는 아무 값도 반환하지 않습니다.

#### 주의 사항 {/*caveats*/}

* 동일한 서버에 대해 여러 번의 `prefetchDNS` 호출은 한 번의 호출과 동일한 효과를 갖습니다.
* 브라우저에서는 `prefetchDNS`를 컴포넌트 렌더링할 때, Effect 내부, 이벤트 핸들러 등 모든 상황에서 호출할 수 있습니다.
* 서버 사이드 렌더링 또는 서버 컴포넌트를 렌더링할 때, `prefetchDNS`는 컴포넌트를 렌더링하는 동안 또는 컴포넌트 렌더링에서 시작된 비동기 컨텍스트 내에서 호출하는 경우에만 효과가 있습니다. 그 외의 호출은 무시됩니다.
* 필요한 특정 리소스를 알고 있다면, 리소스를 즉시 로딩할 수 있는 [다른 함수](/reference/react-dom/#resource-preloading-apis)를 호출할 수 있습니다.
* 웹페이지 자체가 호스팅되는 동일한 서버를 미리 조회하는 것은 이점이 없습니다. 힌트가 주어진 시점에는 이미 조회가 완료되었기 때문입니다.
* [`preconnect`](/reference/react-dom/preconnect)와 비교했을 때, `prefetchDNS` 는 여러 도메인에 대해 사전 연결을 시도하는 경우, 사전 연결의 오버헤드가 이점을 상쇄할 수 있다는 점에서 더 나을 수 있습니다.

---

## 사용법 {/*usage*/}

### 렌더링 시 DNS 미리 가져오기 {/*prefetching-dns-when-rendering*/}

해당 컴포넌트의 자식들이 해당 호스트에서 외부 리소스를 로딩할 것을 알고 있다면, 컴포넌트를 렌더링할 때 `prefetchDNS`를 호출하세요.

```js
import { prefetchDNS } from 'react-dom';

function AppRoot() {
  prefetchDNS("https://example.com");
  return ...;
}
```

### 이벤트 핸들러에서 DNS 미리 가져오기 {/*prefetching-dns-in-an-event-handler*/}

외부 리소스가 필요한 페이지나 State로 전환하기 전에 이벤트 핸들러에서 `prefetchDNS`를 호출하세요. 이렇게 하면 새로운 페이지나 State를 렌더링할 때 호출하는 것보다 더 일찍 프로세스를 시작할 수 있습니다.

```js
import { prefetchDNS } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    prefetchDNS('http://example.com');
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```
