---
id: javascript-environment-requirements
title: JavaScript 환경 요구사항
layout: docs
category: Reference
permalink: docs/javascript-environment-requirements.html
---

React 16 버전은 컬렉션 자료형인 [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)과 [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)을 사용합니다. 이 기능을 자체적으로 지원하지 않거나(예. IE 11 미만) 지원은 하지만 잘 호환되지 않는(예. IE 11) 오래된 브라우저나 기기에서도 React를 사용해야 한다면 애플리케이션에 [core-js](https://github.com/zloirock/core-js) 같은 전역 폴리필(polyfill)을 포함하는 것도 고려해보세요.

다음은 오래된 브라우저 지원을 위해 core-js 폴리필을 적용한 환경에서 React 16 버전을 사용하는 예시입니다.

```js
import 'core-js/es/map';
import 'core-js/es/set';

import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('root')
);
```

React에는 `requestAnimationFrame` 기능도 필요한데, 이는 테스트 환경에서도 사용됩니다.
오래된 브라우저에서는 [raf](https://www.npmjs.com/package/raf) 패키지를 사용하여 `requestAnimationFrame` 기능을 지원할 수 있습니다.

```js
import 'raf/polyfill';
```
