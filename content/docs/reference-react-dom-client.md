---
id: react-dom-client
title: ReactDOMClient
layout: docs
category: Reference
permalink: docs/react-dom-client.html
---

`react-dom/client` 패키지는 클라이언트에서 애플리케이션을 초기화할 때 사용할 수 있는 클라이언트 특화 함수들을 제공합니다. 대부분의 컴포넌트의 경우 이 모듈이 필요하지 않을 것입니다.

```js
import * as ReactDOM from 'react-dom/client';
```

npm과 함께 ES5를 사용 중이라면, 다음과 같이 작성합니다.

```js
var ReactDOM = require('react-dom/client');
```

## 개요 {#overview}

다음 함수들을 클라이언트 환경에서 사용할 수 있습니다.

- [`createRoot()`](#createroot)
- [`hydrateRoot()`](#hydrateroot)

### 브라우저 지원 {#browser-support}

React는 모든 최신 브라우저들을 지원하며, 구버전은 [폴리필이 필요합니다.](/docs/javascript-environment-requirements.html)

> 주의
>
> React는 Internet Explorer와 같이 ES5 함수 또는 마이크로태스크를 지원하지 않는 구형 브라우저를 지원하지 않습니다. 여러분의 애플리케이션이 [es5-shim 또는 es5-sham](https://github.com/es-shims/es5-shim)과 같은 폴리필을 페이지 내 포함한 경우 구형 브라우저에서도 동작할 수 있겠지만, 이러한 방식을 선택한다면 더 이상 도움을 드릴 수 없습니다.

## 참조 {#reference}

### `createRoot()` {#createroot}

```javascript
createRoot(container[, options]);
```

주어진 `container`에 대해 React 루트를 만들고 해당 루트를 반환합니다. 반환된 루트로 `render`를 통해 React 엘리먼트를 DOM으로 렌더링할 수 있습니다.

```javascript
const root = createRoot(container);
root.render(element);
```

`createRoot`는 두 가지 매개변수를 선택할 수 있습니다.
- `onRecoverableError`: React가 자동으로 오류에서 복구되었을 경우 선택에 따라 콜백이 호출됩니다.
- `identifierPrefix`: React가 `React.useId`에 의해 생성된 ID를 선택에 따라 앞에 덧붙입니다. 동일 페이지에 여러 루트를 사용할 때 발생할 수 있는 충돌을 회피하는 데 유용합니다. 서버에서 사용한 접두사(Prefix)와 반드시 동일해야 합니다.

생성된 루트는 `unmount`로 마운트 해제할 수 있습니다.

```javascript
root.unmount();
```

> 주의
>
> `createRoot()`는 넘겨받은 컨테이너 노드의 컨텐츠들을 제어합니다. 내부에 존재하는 모든 DOM 엘리먼트는 렌더링이 호출되면 전부 교체됩니다. 이후의 호출들은 효율적인 갱신을 위해 React의 DOM 비교 알고리즘을 사용합니다.
>
> `createRoot()`는 넘겨받은 컨테이너 노드를 수정하지 않으며, 오직 그 자식만을 수정합니다. 기존 DOM 노드에 이미 존재하는 자식에 대해 덮어쓰기 없이 컴포넌트를 추가하는 것이 가능할 수도 있습니다.
>
> 서버 렌더링된(server-rendered) 컨테이너를 hydrate 하기 위해 `createRoot()`를 사용하는 것은 지원하지 않는 방법입니다. 대신 [`hydrateRoot()`](#hydrateroot)를 사용하세요.

* * *

### `hydrateRoot()` {#hydrateroot}

```javascript
hydrateRoot(container, element[, options])
```
[`createRoot()`](#createroot)과 동일하지만, HTML 컨텐츠가 [`ReactDOMServer`](/docs/react-dom-server.html)로 렌더링된 컨테이너를 hydrate 할 때 사용합니다. React는 기존 마크업에 이벤트 리스너를 연결하려 시도할 것입니다.

`hydrateRoot`는 두 가지 매개변수를 선택할 수 있습니다.
- `onRecoverableError`: React가 자동으로 오류에서 복구되었을 경우 선택에 따라 콜백이 호출됩니다.
- `identifierPrefix`: React가 `React.useId`에 의해 생성된 ID를 선택에 따라 앞에 덧붙입니다. 동일 페이지에 여러 루트를 사용할 때 발생할 수 있는 충돌을 회피하는 데 유용합니다. 서버에서 사용한 접두사(Prefix)와 반드시 동일해야 합니다.


> 주의
> 
> React는 렌더링된 컨텐츠가 서버와 클라이언트 간에 동일할 것이라고 가정합니다. React가 텍스트 컨텐츠의 차이를 고칠 수는 있지만 이러한 불일치를 버그로 취급하여 고쳐야 합니다. 개발 모드에서 React는 hydration 중의 불일치에 대해 경고합니다. 불일치 상황에서는 어트리뷰트 차이가 고쳐질 수 있다고 보장할 수 없습니다. 대다수의 애플리케이션에서 불일치가 발생하는 경우는 많지 않으며, 발생할 경우 모든 마크업을 검증하는 것이 매우 큰 비용을 수반하기 때문에 성능상의 이유로 중요한 문제입니다.
