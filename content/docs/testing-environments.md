---
id: testing-environments
title: Testing Environments
permalink: docs/testing-environments.html
prev: testing-recipes.html
---

<!-- This document is intended for folks who are comfortable with JavaScript, and have probably written tests with it. It acts as a reference for the differences in testing environments for React components, and how those differences affect the tests that they write. This document also assumes a slant towards web-based react-dom components, but has notes for other renderers. -->

This document goes through the factors that can affect your environment and recommendations for some scenarios.

이 문서는 환경에 영향을 줄 수 있는 요소와 일부 시나리오에 대한 권장 사항을 살펴본다.

### Test runners {#test-runners}

Test runners like [Jest](https://jestjs.io/), [mocha](https://mochajs.org/), [ava](https://github.com/avajs/ava) let you write test suites as regular JavaScript, and run them as part of your development process. Additionally, test suites are run as part of continuous integration.

Jest, Mocha, ava와 같은 테스트 러너는 테스트 스위트를 일반 자바 스크립트로 작성하고, 개발 프로세스의 일부로 실행할 수 있도록 한다. 추가적으로, 테스트 스위트는 지속적 통합의 일부로 실행된다. 

- Jest is widely compatible with React projects, supporting features like mocked [modules](#mocking-modules) and [timers](#mocking-timers), and [`jsdom`](#mocking-a-rendering-surface) support. **If you use Create React App, [Jest is already included out of the box](https://facebook.github.io/create-react-app/docs/running-tests) with useful defaults.**

Jest는 모의 모듈 및 타이머, 그리고 jsdom 지원 등의 특징을 지원하는 리액트 프로젝트와 광범위하게 호환된다.

- Libraries like [mocha](https://mochajs.org/#running-mocha-in-the-browser) work well in real browser environments, and could help for tests that explicitly need it.

mocha같은 라이브러리들은 실제 브라우저 환경에서 작동되며, 이는 분명히 필요한 테스트에 도움이 될 수 있다.

- End-to-end tests are used for testing longer flows across multiple pages, and require a [different setup](#end-to-end-tests-aka-e2e-tests).

엔드 투 엔드 테스트는 여러 페이지에 걸친 긴 흐름을 테스트하기 위해 사용되며, 다른 설정이 필요하다.

### Mocking a rendering surface {#mocking-a-rendering-surface}

Tests often run in an environment without access to a real rendering surface like a browser. For these environments, we recommend simulating a browser with [`jsdom`](https://github.com/jsdom/jsdom), a lightweight browser implementation that runs inside Node.js.

테스트는 종종 브라우저와 같은 실제 렌더링 표면에 접근하지 않은 환경에서도 진행된다. 이런 환경에서는, Node.js 내에서 실행되는 가벼운 브라우저인 jsdom을 사용하여 브라우저를 시뮬레이션하는 것을 권장한다.

In most cases, jsdom behaves like a regular browser would, but doesn't have features like [layout and navigation](https://github.com/jsdom/jsdom#unimplemented-parts-of-the-web-platform).

대체로, jsdom은 일반 브라우저처럼 동작하지만 레이아웃이나 탐색과 같은 기능은 가지고 있지 않다.

This is still useful for most web-based component tests, since it runs quicker than having to start up a browser for each test.

이는 여전히 대부분의 웹 기반 컴포넌트 테스트에 유용하다. 왜냐하면 테스트를 위해 브라우저를 시작하는 것보다 빨리 실행되기 때문이다.

It also runs in the same process as your tests, so you can write code to examine and assert on the rendered DOM.

또한 테스트와 동일한 프로세스에서 실행되므로, 렌더링된 DOM을 검토하고 확신할 코드를 작성할 수 있다.

Just like in a real browser, jsdom lets us model user interactions; tests can dispatch events on DOM nodes, and then observe and assert on the side effects of these actions [<small>(example)</small>](/docs/testing-recipes.html#events).

실제 브라우저와 마찬가지로, jsdom은 사용자 상호작용을 모델링할 수 있도록 한다. 테스트는 DOM 노드에서 이벤트를 발송한 다음 이러한 동작의 부작용을 관찰하고 주장할 수 있다.(예시)

A large portion of UI tests can be written with the above setup: using Jest as a test runner, rendered to jsdom, with user interactions specified as sequences of browser events, powered by the `act()` helper [<small>(example)</small>](/docs/testing-recipes.html). For example, a lot of React's own tests are written with this combination.

UI 테스트의 많은 부분은 위의 설정으로 작성할 수 있다. jsdom에게 렌더링하는 테스트 러너로서, 브라우저 이벤트 시퀀스로 지정된 사용자 상호작용과 함께Jest를 사용하는 것은 act() 도우미에 의해 작동된다.(예시) 예를 들어, 많은 리액트 자체 테스트는 이런 조합으로 작성된다. 

If you're writing a library that tests mostly browser-specific behavior, and requires native browser behavior like layout or real inputs, you could use a framework like [mocha.](https://mochajs.org/)

만약 대부분의 브라우저별 동작을 테스트하고 레이아웃이나 실제 입력과 같은 네이티브 브라우저 동작을 요구하는 라이브러리를 작성하는 경우 mocha와 같은 프레임 워크를 사용할 수 있다.

In an environment where you _can't_ simulate a DOM (e.g. testing React Native components on Node.js), you could use [event simulation helpers](https://reactjs.org/docs/test-utils.html#simulate) to simulate interactions with elements. Alternately, you could use the `fireEvent` helper from [`@testing-library/react-native`](https://testing-library.com/docs/native-testing-library).

DOM을 시뮬레이션할 수 없는 환경에서 (예를 들면, Node.js리에서의 리액트 네이티브 컴포넌트 테스트), 엘리먼트와의 상호작용을 시뮬레이션하기 위해 event simulation helpers 를 사용할 수 있다. 

Frameworks like [Cypress](https://www.cypress.io/), [puppeteer](https://github.com/GoogleChrome/puppeteer) and [webdriver](https://www.seleniumhq.org/projects/webdriver/) are useful for running [end-to-end tests](#end-to-end-tests-aka-e2e-tests).

Cypress, puppeteer, webdriver 같은 프레임워크들은 end-to-end 테스트를 진행하기에 유용하다.

### Mocking functions {#mocking-functions}

### 모의 함수

When writing tests, we'd like to mock out the parts of our code that don't have equivalents inside our testing environment (e.g. checking `navigator.onLine` status inside Node.js). Tests could also spy on some functions, and observe how other parts of the test interact with them. It is then useful to be able to selectively mock these functions with test-friendly versions. 

테스트를 작성할 때, 우리는 테스트 환경 내부에서 동등성이 없는 우리의 코드 중 일부를 목아웃하고 싶다(예를 들어, navigator.online상태를 Node.js 내부에서 확인하는 것처럼). 테스트는 또한 일부 함수를 감시할 수 있으며 테스트의 다른 부분이 함수들과 어떻게 상호작용하는지를 관찰할 수 있다. 이는 이러한 함수들을 선택적으로 시험 친화적인 버전으로 모의할 수 있다는 점에서 유용하다. 

This is especially useful for data fetching. It is usually preferable to use "fake" data for tests to avoid the slowness and flakiness due to fetching from real API endpoints [<small>(example)</small>](/docs/testing-recipes.html#data-fetching). This helps make the tests predictable. Libraries like [Jest](https://jestjs.io/) and [sinon](https://sinonjs.org/), among others, support mocked functions. For end-to-end tests, mocking network can be more difficult, but you might also want to test the real API endpoints in them anyway.

### Mocking modules {#mocking-modules}

Some components have dependencies for modules that may not work well in test environments, or aren't essential to our tests. It can be useful to selectively mock these modules out with suitable replacements [<small>(example)</small>](/docs/testing-recipes.html#mocking-modules).

On Node.js, runners like Jest [support mocking modules](https://jestjs.io/docs/en/manual-mocks). You could also use libraries like [`mock-require`](https://www.npmjs.com/package/mock-require).

### Mocking timers {#mocking-timers}

Components might be using time-based functions like `setTimeout`, `setInterval`, or `Date.now`. In testing environments, it can be helpful to mock these functions out with replacements that let you manually "advance" time. This is great for making sure your tests run fast! Tests that are dependent on timers would still resolve in order, but quicker [<small>(example)</small>](/docs/testing-recipes.html#timers). Most frameworks, including [Jest](https://jestjs.io/docs/en/timer-mocks), [sinon](https://sinonjs.org/releases/v7.3.2/fake-timers/) and [lolex](https://github.com/sinonjs/lolex), let you mock timers in your tests.

Sometimes, you may not want to mock timers. For example, maybe you're testing an animation, or interacting with an endpoint that's sensitive to timing (like an API rate limiter). Libraries with timer mocks let you enable and disable them on a per test/suite basis, so you can explicitly choose how these tests would run.

### End-to-end tests {#end-to-end-tests-aka-e2e-tests}

End-to-end tests are useful for testing longer workflows, especially when they're critical to your business (such as payments or signups). For these tests, you'd probably want to test both how a real browser renders the whole app, fetches data from the real API endpoints, uses sessions and cookies, navigates between different links. You might also likely want to make assertions not just on the DOM state, but on the backing data as well (e.g. to verify whether the updates have been persisted to the database).

In this scenario, you would use a framework like [Cypress](https://www.cypress.io/) or a library like [puppeteer](https://github.com/GoogleChrome/puppeteer) so you can navigate between multiple routes and assert on side effects not just in the browser, but potentially on the backend as well.
