---
id: javascript-environment-requirements
title: JavaScript 환경 요구사항
layout: docs
category: Reference
permalink: docs/javascript-environment-requirements.html
---

React 18은 모든 최신 브라우저(엣지, 파이어폭스, 크롬, 사파리 등)를 지원합니다.

최신 브라우저 기능을 제공하지 않거나, 호환되지 않는 구현사항들이 있는 인터넷 익스플로러같은 오래된 브라우저나 기기를 사용하고 있는 경우, 사용하고 계신 어플리케이션에 폴리필(polyfill)을 포함하는 것이 좋습니다.

React 18에서 사용하고 있는 최신 기능들의 목록입니다.
- [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [`Symbol`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
- [`Object.assign`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)

이러한 기능에 대한 올바른 폴리필은 환경에 따라 다릅니다. 많은 사용자의 경우 [브라우저스리스트(browserslist)](https://github.com/browserslist/browserslist) 세팅을 설정할 수 있습니다. 그 외의 경우에는 [`core-js`](https://github.com/zloirock/core-js)같은 폴리필을 직접 import 해야 할 수도 있습니다.