---
id: cross-origin-errors
title: Cross-origin Errors
permalink: docs/cross-origin-errors.html
---

> 주의:
>
> 해당 부분은 오직 리액트 개발 모드에서만 적용됩니다. 배포 모드에서 오류 처리는 일반 try/catch 구문으로 수행됩니다.

[개발 모드](/docs/optimizing-performance.html)에서 리액트는 전역 `오류` 이벤트 핸들러를 사용하여 브라우저 DevTools의 "예외 시 일시 중지" 동작을 유지해줍니다. 또한 개발자 콘솔에 오류를 기록합니다.

[다른 출처](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy)로 인한 오류가 발생한다면 브라우저는 해당 세부 정보를 숨기고 리액트는 오리지널 오류 메시지를 기록할 수가 없습니다. 왜냐하면 민감한 정보가 노출되는 것을 방지하기 위해서 브라우저에서 보안 예방 조치 취하기 때문입니다.

동일 출처 정책으로 오류가 발생하도록 개발/디버깅 프로세스를 단순화할 수 있습니다. 다음은 교차 출처 오류가 발생하는 일반적인 원인과 해결 방법입니다.

### CDN {#cdn}

CDN에서 리액트(혹은 오류를 발생시킬 수 있는 다른 라이브러리)를 로딩할 때, `<script>` 태그에 [`크로스오리진`](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes) 속성을 추가하세요:


```html
<script crossorigin src="..."></script>
```

또한 CDN이 `Access-Control-Allow-Origin: *` HTTP 헤더로 응답하는지 확인합니다.

![Access-Control-Allow-Origin: *](../images/docs/cdn-cors-header.png)

### 웹팩 {#webpack}

#### 소스 맵 {#source-maps}

일부 자바스크립트 번들러는 개발 중에 `eval`문으로 코드를 래핑 되어 있을 수 있습니다. (예를 들어 웹팩은 [`devtool`](https://webpack.js.org/configuration/devtool/)이 "eval"이라는 단어가 포함된 값으로 설정된 경우 이 작업을 수행합니다) 이로 인해 크로스-오리진 오류로 처리될 수 있습니다.

웹팩을 사용하는 경우, 이러한 문제를 피하기 위해서 개발 시에 `cheap-module-source-map` 설장하는 것을 추천합니다.

#### 코드 분할 {#code-splitting}

애플리케이션이 여러 번들로 분할된 경우 JSONP를 사용하여 로드될 수 있습니다. 이로 인해 번들 된 코드가 크로스-오리진 오류로 처리될 수도 있습니다.

이러한 문제를 해결하려면, 개발 시에 [`크로스오리진로딩`](https://webpack.js.org/configuration/output/#output-crossoriginloading) 설정을 사용하여 JSOPN 요청에 대해 생성된 `<script>` 태그에 `크로스오리진` 속성을 추가하세요.