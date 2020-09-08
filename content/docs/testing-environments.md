---
id: testing-environments
title: 테스트 환경
permalink: docs/testing-environments.html
prev: testing-recipes.html
---

<!-- This document is intended for folks who are comfortable with JavaScript, and have probably written tests with it. It acts as a reference for the differences in testing environments for React components, and how those differences affect the tests that they write. This document also assumes a slant towards web-based react-dom components, but has notes for other renderers. -->

이 문서는 환경에 영향을 줄 수 있는 요소와 일부 시나리오에 대한 권장 사항을 살펴봅니다.

### 테스트 러너 {#test-runners}

[Jest](https://jestjs.io/), [Mocha](https://mochajs.org/), [ava](https://github.com/avajs/ava)와 같은 테스트 러너는 테스트 스위트를 일반 자바 스크립트로 작성하고, 개발 프로세스의 일부로 실행할 수 있도록 합니다. 추가적으로, 테스트 스위트는 지속적 통합의 일부로 실행됩니다.

- Jest는 모의 [모듈](#mocking-modules) 및 [타이머](#mocking-timers), 그리고 [jsdom](#mocking-a-rendering-surface) 지원 등 여러 기능을 지원하는 React 프로젝트와 광범위하게 호환됩니다. **Create React App을 사용한다면, [Jest는 이미 유용한 기본값과 함께 포함되어 있습니다.](https://create-react-app.dev/docs/running-tests/)**
- [mocha](https://mochajs.org/#running-mocha-in-the-browser)같은 라이브러리는 실제 브라우저 환경에서도 잘 작동하며, 이는 분명히 필요한 테스트에 도움이 될 수 있습니다.
- 엔드 투 엔드 테스트는 여러 페이지에 걸친 긴 흐름을 테스트하기 위해 사용되며, [다른 설정](#end-to-end-tests-aka-e2e-tests)이 필요합니다.

### 렌더링 표면에 대한 모의하기 {#mocking-a-rendering-surface}

테스트는 종종 브라우저와 같은 실제 렌더링 표면에 접근하지 않은 환경에서도 진행됩니다. 이런 환경에서는, Node.js 내에서 실행되는 가벼운 브라우저인 [jsdom](https://github.com/jsdom/jsdom)을 사용하여 브라우저를 시뮬레이션하는 것을 권장합니다.

대체로, jsdom은 일반 브라우저처럼 동작하지만 [레이아웃이나 탐색](https://github.com/jsdom/jsdom#unimplemented-parts-of-the-web-platform)과 같은 기능은 가지고 있지 않습니다. 이는 여전히 대부분의 웹 기반 컴포넌트 테스트에 유용합니다. 왜냐하면 테스트를 위해 브라우저를 시작하는 것보다 빨리 실행되기 때문입니다. 또한 테스트와 동일한 프로세스에서 실행되므로, 렌더링된 DOM을 검토하고 검증할 코드를 작성할 수 있습니다.

실제 브라우저와 마찬가지로, jsdom은 사용자 상호작용을 모델링할 수 있도록 합니다. 테스트는 DOM 노드에서 이벤트를 발송한 다음 이러한 동작의 부작용을 관찰하고 검증할 수 있습니다. [<small>(예시)</small>](/docs/testing-recipes.html#events)

UI 테스트의 많은 부분은 위의 설정으로 작성할 수 있습니다. jsdom에게 렌더링하는 테스트 러너로서, 브라우저 이벤트 시퀀스로 지정된 사용자 상호작용과 함께Jest를 사용하는 것은 `act()` 도우미에 의해 작동됩니다.[<small>(예시)</small>](/docs/testing-recipes.html) 예를 들어, 많은 React 자체 테스트는 이런 조합으로 작성됩니다.

만약 대부분의 브라우저별 동작을 테스트하고 레이아웃이나 실제 입력과 같은 네이티브 브라우저 동작을 요구하는 라이브러리를 작성하는 경우 [mocha](https://mochajs.org/)와 같은 프레임 워크를 사용할 수 있습니다.

DOM을 시뮬레이션*할 수 없는* 환경에서 (예를 들면, Node.js에서 React Native 컴포넌트 테스트), 엘리먼트와의 상호작용을 시뮬레이션하기 위해 [이벤트 시뮬레이션 헬퍼](/docs/test-utils.html#simulate)를 사용할 수 있습니다. 다른 대안으로, [`@testing-library/react-native`](https://testing-library.com/docs/react-native-testing-library/intro)의 `fireEvent` 헬퍼를 사용할 수 있습니다.

[Cypress](https://www.cypress.io/), [puppeteer](https://github.com/GoogleChrome/puppeteer), [webdriver](https://www.seleniumhq.org/projects/webdriver/) 같은 프레임워크들은 [end-to-end 테스트](#end-to-end-tests-aka-e2e-tests)를 진행하기에 유용합니다.

### 함수 모의하기 {#mocking-functions}

테스트를 작성할 때, 우리는 테스트 환경 내부에서 동등성이 없는 우리의 코드 중 일부를 목아웃하고 싶어합니다(예를 들어, `navigator.onLine` 상태를 Node.js 내부에서 확인하는 것처럼). 테스트는 또한 일부 함수를 감시할 수 있으며 테스트의 다른 부분이 함수들과 어떻게 상호작용하는지를 관찰할 수 있습니다. 이는 이러한 함수들을 선택적으로 시험 친화적인 버전으로 모의할 수 있다는 점에서 유용합니다.

모의 함수는 특히 데이터를 불러올 때 유용합니다. 실제 API 종단점으로부터 발생하는 느려짐과 손상을 방지하기 위해 테스트에 "가짜"데이터를 사용하는 것이 바람직한 방법입니다 [<small>(예시)</small>](/docs/testing-recipes.html#data-fetching). 이는 테스트를 예측 가능하게 만들어줍니다. [Jest](https://jestjs.io/)와 [sinon](https://sinonjs.org/)과 같은 라이브러리들은 모의 함수들을 지원합니다. 엔드 투 엔드 테스트의 경우 네트워크를 모사하는 것은 어려울 수 있지만, 실제 API 엔드포인트를 테스트하기를 원할 수도 있습니다.

### 모듈 모의하기 {#mocking-modules}

일부 컴포넌트는 테스트 환경에서 잘 작동하지 않거나 테스트에 필수적이지 않은 모듈에 대한 의존성을 가지고 있습니다. 적절한 교체를 통해 이러한 모듈을 선택적으로 모의하는 것이 유용할 수 있습니다 [<small>(예시)</small>](/docs/testing-recipes.html#mocking-modules).

Node.js에서 Jest같은 러너는 [모의 모듈을 지원합니다](https://jestjs.io/docs/en/manual-mocks). 또한 [mock-require](https://www.npmjs.com/package/mock-require) 라이브러리도 사용할 수 있습니다.

### 타이머 모의하기 {#mocking-timers}

컴포넌트는 `setTimeout`, `setInterval`, `Data.now`와 같은 시간을 기반으로한 함수를 사용할 수 있습니다. 테스트 환경에서, 이러한 함수들을 수동으로 발전할 수 있는 대체품으로 모의하는 것이 유용할 수 있습니다. 이것은 테스트가 빨리 진행되도록 하는 데 좋다! 타이머에 의존하는 테스트는 여전히 순서대로 해결되지만 더 빨리 해결됩니다 [<small>(예시)</small>](https://github.com/reactjs/ko.reactjs.org/blob/master/docs/testing-recipes.html#timers). [Jest](https://jestjs.io/docs/en/timer-mocks), [sinon](https://sinonjs.org/releases/v7.3.2/fake-timers/), [lolex](https://github.com/sinonjs/lolex)를 포함한 대부분의 프레임워크는 테스트에서 타이머를 모의할 수 있게 해줍니다.

가끔, 모의 타이머를 원하지 않는 경우가 있을 수 있기도 합니다. 예를 들어, 애니메이션을 테스트하거나, 또는 (API 속도 제한 장치와 같은) 타이밍에 민감한 종단점과의 상호작용을 하는 경우가 있습니다. 타이머 모의가 있는 라이브러리는 테스트/묶음별로 활성화 및 비활성화할 수 있으므로 이러한 테스트 실행 방법을 명시적으로 선택할 수 있습니다.

### 엔드 투 엔드 테스트 {#end-to-end-tests-aka-e2e-tests}

엔드 투 엔드 테스트는 더 긴 작업흐름을 테스트하는 데 유용하며, 특히 비즈니스에 중요한 작업흐름(결제 또는 회원가입 같이)을 테스트하는 데 유용합니다. 이러한 경우, 브라우저가 실제 앱 전체를 렌더링하고, 실제 API 종단점에서 데이터를 가져오고, 세션과 쿠키를 사용하며, 다른 링크 사이를 이동하는 방법을 모두 테스트 하기를 원할 것입니다. 또한 DOM 상태뿐만 아니라 백업 데이터(예를 들어, 업데이트가 데이터베이스에 유지되었는지 확인하기 위해)에 대해서도 검증하기를 원할 수 있습니다.

이러한 시나리오에서는 [Cypress](https://www.cypress.io/)와 같은 프레임워크나 [puppeteer](https://github.com/GoogleChrome/puppeteer) 같은 라이브러리를 사용하여 여러 경로를 탐색하고 브라우저뿐만 아니라 잠재적으로 백엔드에서도 부작용에 대해 주장할 수 있습니다.
