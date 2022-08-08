---
id: cdn-links
title: CDN 링크
permalink: docs/cdn-links.html
prev: create-a-new-react-app.html
next: release-channels.html
---

React와 ReactDOM 모두 CDN을 통해 사용할 수 있습니다.

```html
<script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
```

위의 코드는 개발용으로 적합하며 배포용 버전에는 적합하지 않습니다. React의 용량 및 성능 최적화된 배포용 버전은 아래와 같이 제공되고 있습니다.

```html
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
```

<<<<<<< HEAD
`react`와 `react-dom`의 특정 버전을 로딩하려면 `17`을 사용하고자 하는 버전 넘버로 대체하면 됩니다.
=======
To load a specific version of `react` and `react-dom`, replace `18` with the version number.
>>>>>>> 4808a469fa782cead9802619b0341b27b342e2d3

### `crossorigin` 속성이 필요한 이유 {#why-the-crossorigin-attribute}

CDN을 통해 React를 사용한다면, [`crossorigin`](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes) 어트리뷰트(attribute)와 함께 사용하는 것을 권장합니다.

```html
<script crossorigin src="..."></script>
```

또한 사용 중인 CDN이 `Access-Control-Allow-Origin: *` HTTP 헤더 설정을 사용하는지 확인하는 것이 좋습니다.

![Access-Control-Allow-Origin: *](../images/docs/cdn-cors-header.png)

이를 통해 React 16 버전과 다음 버전에서 더 쉽게 [에러 처리](/blog/2017/07/26/error-handling-in-react-16.html)를 할 수 있습니다.
