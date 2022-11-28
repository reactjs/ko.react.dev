---
id: javascript-environment-requirements
title: JavaScript 환경 요구사항
layout: docs
category: Reference
permalink: docs/javascript-environment-requirements.html
---

React 18은 모든 최신 브라우저(Edge, Firefox, Chrome, Safari 등)를 지원합니다. 

최신 브라우저 기능을 제공하지 않거나 호환되지 않는 구현이 있는 Internet Explorer와 같은 이전 브라우저 및 장치를 지원하는 경우 번들 애플리케이션에 전역 폴리필을 포함하는 것이 좋습니다.

다음은 React 18에서 사용하는 최신 기능 목록입니다.:
- [`Promise`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [`Symbol`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
- [`Object.assign`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)

이러한 기능에 대한 올바른 폴리필은 환경에 따라 다릅니다. 많은 사용자를 위해 [브라우저 목록](https://github.com/browserslist/browserslist)을 설정할 수 있습니다. 다른 경우에는 [`core-js`](https://github.com/zloirock/core-js)와 같은 폴리필을 직접 가져와야 할 수도 있습니다.
