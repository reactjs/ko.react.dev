---
id: testing
title: 테스팅 개요
permalink: docs/testing.html
redirect_from:
  - "community/testing.html"
next: testing-recipes.html
---

다른 JavaScript 코드와 비슷한 방법으로 React 컴포넌트를 테스트 할 수 있습니다.

React 컴포넌트를 테스트 할수 있는 몇가지 방법이 있는데 크게는 2가지 카테고리로 나누어집니다.
* **Rendering component trees** in a simplified test environment and asserting on their output.
* **컴포넌트 트리 렌더링** : 간략화된 테스팅 환경 및 출력값이 확실한 경우.

* **Running a complete app** in a realistic browser environment (also known as “end-to-end” tests).
* **완성된 앱에서 실행**: 현실적 브라우저 환경안에서("엔드 투 엔드" 테스트라고 알려져 있습니다.)
This documentation section focuses on testing strategies for the first case. While full end-to-end tests can be very useful to prevent regressions to important workflows, such tests are not concerned with React components in particular, and are out of scope of this section.
이 문서 섹션은 첫번째 경우에 대한 테스팅 전략에 초점을 맞추고 있습니다. 풀 엔드투엔트 테스트는 중요한 워크플로우의 퇴행을 막기 위해 매우 유용하지만 이러한 테스트는 특정한 React 컴포넌트를 관련되어 있지않습니다. 그리고 이들은 이 세션의 범위를 벗어 납니다.    

### Tradeoffs {#tradeoffs}
### 트레이드오프 {#tradeoffs} ? 상호교환

When choosing testing tools, it is worth considering a few tradeoffs:
테스팅 도구를 선택할때 몇가지 트레이드오프를 생각하는 것은 의미있는 일입니다.
* **Iteration speed vs Realistic environment:** Some tools offer a very quick feedback loop between making a change and seeing the result, but don't model the browser behavior precisely. Other tools might use a real browser environment, but reduce the iteration speed and are flakier on a continuous integration server.
* **Iteration speed vs Realistic environment:** 몇몇 툴은 제공하는데 매우 빠른 피드백 루프를 변경사항이 있거나 결과 값을 보는 사이에서 그러나 브라우저 행동을 정확히 모델하지 않습니다. 다른 툴은 아마 사용되나 현실적 브라우저 환경해서 그러나 반복 속도를 줄이고 더 연약 합니다. 지속정 통합 서버 환경에서
* **How much to mock:** With components, the distinction between a "unit" and "integration" test can be blurry. If you're testing a form, should its test also test the buttons inside of it? Or should a button component have its own test suite? Should refactoring a button ever break the form test?
* **How much to mock:** 컴포넌트와 함게 '유닛'테스트와 '통합'테스트의 차이는 정확하지 않습니다. 하나의 폼을 테스팅한다고 할 때 이 테스트는 또한 테버튼의 안의 부분에서 테스트 되어지나요? 또는 버튼 컴포넌트는 자기자신의 알맞은 테스트를 할수 있나요? 리팩토링된 버튼이 폼 테스트에 오류를 일으키 나요?
Different answers may work for different teams and products.
각각의 팀 과 제품에 따라 다른 답이 적용 될 수 있습니다.
### Recommended Tools {#tools}
### 추천 방법 {#tools}
**[Jest](https://facebook.github.io/jest/)** is a JavaScript test runner that lets you access the DOM via [`jsdom`](/docs/testing-environments.html#mocking-a-rendering-surface). While jsdom is only an approximation of how the browser works, it is often good enough for testing React components. Jest provides a great iteration speed combined with powerful features like mocking [modules](/docs/testing-environments.html#mocking-modules) and [timers](/docs/testing-environments.html#mocking-timers) so you can have more control over how the code executes.
**[Jest](https://facebook.github.io/jest/)**는 JavaScript 테스트 러너 입니다.DOM에 접근하게 하는 [`jsdom`](/docs/testing-environments.html#mocking-a-rendering-surface)을 통해서 jsdom은 단지 어떻게 브라우저가 작동하는지에 대한 대략적 개요 입니다. 하지만 이는 종종 React 컴포넌트를 테스팅 하기에 충분 합니다. Jest는 mocking [modules](/docs/testing-environments.html#mocking-modules)과 [timers](/docs/testing-environments.html#mocking-timers) 같은 파워풀한 특징과 결합되어 휼륭한 반복 속도를제공합니다. 그래서 더 많은 코드 제어를 가집니다.
**[React Testing Library](https://testing-library.com/react)** is a set of helpers that let you test React components without relying on their implementation details. This approach makes refactoring a breeze and also nudges you towards best practices for accessibility. Although it doesn't provide a way to "shallowly" render a component without its children, a test runner like Jest lets you do this by [mocking](/docs/testing-recipes.html#mocking-modules).
**[React Testing Library](https://testing-library.com/react)**는 실행 디테일을 가지지 않는 React 컴포넌트를 테스트하게 하는 도구 모음입니다. 이러한 접근은 리팩토링을 수월하게 하며 접근성에 대한 가장 좋은 연습을 가능하게 합니다. 자식 컴포넌트를 가지지 않는 컴포넌트에 대한 얕은 렌더링 방법을 제공하지 않더라도 Jest와 같은 테스트 러너는 [mocking](/docs/testing-recipes.html#mocking-modules)에 의해 위를 가능하게 합니다.  
### Learn More {#learn-more}
### 더 보기 {#learn-more}
This section is divided in two pages:
두개의 페이지로 나누어저있습니다.
- [Recipes](/docs/testing-recipes.html): React 컴포넌트에 대한 테스트를 작성할 때 흔한 패턴
- [Environments](/docs/testing-environments.html): React 컴포넌트에 대한 테스팅 환경을 설정할 때 고려해야 할 것
