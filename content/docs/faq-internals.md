---
id: faq-internals
title: Virtual DOM과 Internals
permalink: docs/faq-internals.html
layout: docs
category: FAQ
---

### Virtual DOM은 무엇인가요? {#what-is-the-virtual-dom}

Virtual DOM (VDOM)은 UI의 이상적인 또는 "가상"적인 표현을 메모리에 저장하고 ReactDOM과 같은 라이브러리에 의해 "실제" DOM과 동기화하는 프로그래밍 개념입니다. 이 과정을 [재조화](/docs/reconciliation.html)라고 합니다.

이 접근방식은 React의 선언적 API를 활성화합니다. React에게 원하는 UI의 상태를 알려주고 이는 DOM이 그 상태와 일치하도록 합니다. 이러한 방식은 앱 구축에 사용해야 하는 속성 조작, 이벤트 처리, 수동 DOM 업데이트를 추상화합니다.

"virtual DOM"은 특정 기술이라기보다는 패턴에 가깝기 때문에 사람들은 때때로 다른 것을 의미한다고 이야기합니다. React의 세계에서 "virtual DOM"이라는 용어는 보통 사용자 인터페이스를 나타내는 객체이기 때문에 [React elements](/docs/rendering-elements.html)와 연관됩니다. 그러나 React는 구성요소 트리에 대한 추가 정보를 포함하기 위해 "fibers"라는 내부 객체를 사용합니다. 또한 React에서 "virtual DOM" 구현의 일부로 간주할 수 있습니다.

### Shadow DOM은 the Virtual DOM과 같은가요? {#is-the-shadow-dom-the-same-as-the-virtual-dom}

아니요, 둘은 다릅니다. Shadow DOM은 주로 웹 구성 요소의 범위 지정 변수 및 CSS용으로 설계된 브라우저 기술입니다. virtual DOM은 브라우저 API 위에 있는 JavaScript의 라이브러리에서 구현되는 개념입니다.

### "React Fiber"는 무엇인가요? {#what-is-react-fiber}

Fiber는 React 16의 새로운 재조화 엔진입니다. 이 프로그램의 주요 목표는 virtual DOM의 증분 렌더링을 활성화하는 것입니다. [더 읽기](https://github.com/acdlite/react-fiber-architecture).
