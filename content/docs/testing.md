---
id: testing
title: 테스팅 개요
permalink: docs/testing.html
redirect_from:
  - "community/testing.html"
next: testing-recipes.html
---

다른 JavaScript 코드와 비슷한 방법으로 React 컴포넌트를 테스트할 수 있습니다.

React 컴포넌트를 테스트할 수 있는 몇 가지 방법이 있는데 크게는 2가지 카테고리로 나누어집니다.

* **컴포넌트 트리 렌더링** : 간략화된 테스팅 환경 및 출력값이 확실한 경우.
* **완성된 앱에서의 테스트** : 현실적 브라우저 환경("엔드 투 엔드" 테스트라고 알려져 있습니다.)

이 문서 섹션은 아주 기본 테스팅 전략에 초점을 맞추고 있습니다. 풀 엔드투엔드 테스트는 중요한 워크플로의 퇴행을 방지하기 위해 매우 유용하지만 이러한 테스트들은 특정한 React 컴포넌트와 관련되어 있지 않습니다. 그리고 이들은 이 세션의 범위를 벗어납니다.

### 트레이드오프 {#tradeoffs}


테스팅 도구를 선택할 때 몇 가지 트레이드오프를 생각하는 것은 의미 있는 일입니다.

* **반복작업 속도 vs 현실적인 개발 환경** : 몇몇 도구들은 변경사항이 생기고 결과 값이 출력되는 과정에서 매우 빠른 피드백 루프를 제공하지만 브라우저 동작을 정확히 구현하지 않습니다. 다른 도구들이 현실적 브라우저 환경에서 사용되지만 반복 작업 속도를 저하시키고 지속적 통합 서버 환경에서 더 연약합니다.
* **얼마나 다양한 방법을 통해 실제 테스트 환경의 동작을 테스트할 것인가?** 컴포넌트 안에서는 '유닛'테스트와 '통합'테스트의 차이는 명확하지 않습니다. 하나의 폼을 테스팅 한다고 할 때 테스트는 또한 버튼의 안의 부분에서 이루어지나요? 또는 버튼 컴포넌트에 알맞은 테스트를 할 수 있나요? 리팩 토링된 버튼이 폼 테스트에 오류를 일으키나요?

각각의 팀과 제품에 따라 다른 답이 적용될 수 있습니다.

### 추천 도구 {#tools}

**[Jest](https://facebook.github.io/jest/)**는 JavaScript 테스트 러너입니다. DOM에 접근하게 하는 [`jsdom`](/docs/testing-environments.html#mocking-a-rendering-surface)을 통해서 jsdom은 단지 어떻게 브라우저가 작동하는지에 대한 대략적 개요입니다. 하지만 이는 종종 React 컴포넌트를 테스팅 하기에 충분합니다. Jest는 mocking [modules](/docs/testing-environments.html#mocking-modules)과 [timers](/docs/testing-environments.html#mocking-timers) 같은 파워풀한 특징과 결합되어 훌륭한 반복속도를 제공합니다. 그래서 더 많은 코드 제어를 가집니다.

**[React Testing Library](https://testing-library.com/react)**는 실행 디테일을 가지지 않는 React 컴포넌트를 테스트하게 하는 도구 모음입니다. 이러한 접근은 리팩 토링을 수월하게 하며 접근성에 대한 가장 좋은 연습을 가능하게 합니다. 자식 컴포넌트를 가지지 않는 컴포넌트에 대한 얕은 렌더링 방법을 제공하지 않더라도 Jest와 같은 테스트 러너는 [mocking](/docs/testing-recipes.html#mocking-modules)에 의해 위를 가능하게 합니다.  

### 더 학습하기 {#learn-more}

두 개의 페이지로 나뉘어 있습니다.

- [Recipes](/docs/testing-recipes.html): React 컴포넌트에 대한 테스트를 작성할 때 흔한 패턴
- [Environments](/docs/testing-environments.html): React 컴포넌트에 대한 테스팅 환경을 설정할 때 고려해야 할 것
