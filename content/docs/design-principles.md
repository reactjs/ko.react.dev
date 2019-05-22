---
id: design-principles
title: Design Principles
layout: contributing
permalink: docs/design-principles.html
prev: implementation-notes.html
redirect_from:
  - "contributing/design-principles.html"
---

We wrote this document so that you have a better idea of how we decide what React does and what React doesn't do, and what our development philosophy is like. While we are excited to see community contributions, we are not likely to choose a path that violates one or more of these principles.
우리는 이 문서를 작성함으로써 React는 무엇을 하고 무엇을 하지 않는지, 우리의 개발 철학은 무엇인지에 대해 우리가 어떻게 결정하는지 여러분이 더 잘 알 수 있도록 했습니다. 우리는 지역 사회에 기여하고 있음을 즐거워하기도 하지만, 반면 이 원칙 중 하나 이상을 위반하지는 않을 것 같습니다.

>**Note:**
>**주의**
>
>This document assumes a strong understanding of React. It describes the design principles of *React itself*, not React components or applications.
>이 문서는 React에 대한 깊은 이해가 있음을 전제로 합니다. React 컴포넌트나 애플리케이션이 아니라 *React 자체*에 대한 설계 원칙(design principles)을 설명합니다.
>
>For an introduction to React, check out [Thinking in React](/docs/thinking-in-react.html) instead.
>React 소개는 [React로 생각하기](/docs/thinking-in-react.html)를 살펴보세요.

### Composition {#composition}
### 합성 {#composition}

The key feature of React is composition of components. Components written by different people should work well together. It is important to us that you can add functionality to a component without causing rippling changes throughout the codebase.
React의 핵심 기능은 컴포넌트의 합성입니다. 컴포넌트는 서로 다른 사람들에 의해 작성되지만 잘 동작해야 합니다. 코드 베이스에 변화의 파장을 일으키지 않고 컴포넌트에 기능을 추가할 수 있는 것이 중요합니다.

For example, it should be possible to introduce some local state into a component without changing any of the components using it. Similarly, it should be possible to add some initialization and teardown code to any component when necessary.
예를 들어, 컴포넌트를 사용하는 쪽을 변경하지 않고 컴포넌트에 어떤 로컬 state를 도입할 수 있어야 합니다. 마찬가지로, 필요한 경우 컴포넌트에 어떤 초기화 및 해체 코드를 추가할 수 있어야 합니다.

There is nothing "bad" about using state or lifecycle methods in components. Like any powerful feature, they should be used in moderation, but we have no intention to remove them. On the contrary, we think they are integral parts of what makes React useful. We might enable [more functional patterns](https://github.com/reactjs/react-future/tree/master/07%20-%20Returning%20State) in the future, but both local state and lifecycle methods will be a part of that model.
컴포넌트에서 state나 생명주기 메소드를 사용하는 것에 대해 "나쁘다"는 것은 아무것도 없습니다. 다른 강력한 기능과 마찬가지로 적당히 사용해야 할 필요가 있지만, 우리는 그것들을 제거할 생각은 없습니다. 오히려 우리는 그것들이 React를 유용하게 만드는 데에 매우 중요한 부분이라고 생각합니다. 미래에 [보다 함수적인 패턴](https://github.com/reactjs/react-future/tree/master/07%20-%20Returning%20State)을 사용할 수 있게 할지도 모르겠습니다만, 로컬 state와 생명주기 메서드는 모두 그 모델의 일부가 될 것입니다.

Components are often described as "just functions" but in our view they need to be more than that to be useful. In React, components describe any composable behavior, and this includes rendering, lifecycle, and state. Some external libraries like [Relay](https://facebook.github.io/relay/) augment components with other responsibilities such as describing data dependencies. It is possible that those ideas might make it back into React too in some form.
컴포넌트는 종종 "단순한 기능"으로 묘사되지만, 우리의 관점에서는 유용한 것 이상의 것이 필요합니다. React에서 컴포넌트는 구성 가능한 모든 동작을 기술합니다. 그리고 여기에는 렌더링, 생명주기와 state가 포함됩니다. [Relay](https://facebook.github.io/relay/)와 같은 어떤 외부 라이브러리는 데이터 의존성을 기술하는 것과 같은 다른 책임을 컴포넌트에 덧붙입니다. 이런 아이디어들은 어떤 형태로 React로 다시 받아들여질 수도 있습니다.

### Common Abstraction {#common-abstraction}
### 공통의 추상화 {#common-abstraction}

In general we [resist adding features](https://www.youtube.com/watch?v=4anAwXYqLG8) that can be implemented in userland. We don't want to bloat your apps with useless library code. However, there are exceptions to this.
일반적으로 우리는 사용자 영역에서 구현할 수 있는 [기능을 추가하지 않습니다](https://www.youtube.com/watch?v=4anAwXYqLG8). 불필요한 라이브러리 코드로 여러분의 앱을 비대화화고 싶지는 않습니다. 그렇지만, 여기에는 예외가 있습니다.

For example, if React didn't provide support for local state or lifecycle methods, people would create custom abstractions for them. When there are multiple abstractions competing, React can't enforce or take advantage of the properties of either of them. It has to work with the lowest common denominator.
예를 들어, React가 로컬 state나 생명주기 메소드를 지원하지 않았다면 사람들은 사용자 정의 추상화를 만들게 될 것입니다. 여러 개의 추상화가 충돌하는 경우 React는 어느 한쪽의 특성을 강요하거나 이용할 수는 없습니다. 그것은 최소 공통분모로 작용해야 합니다.

This is why sometimes we add features to React itself. If we notice that many components implement a certain feature in incompatible or inefficient ways, we might prefer to bake it into React. We don't do it lightly. When we do it, it's because we are confident that raising the abstraction level benefits the whole ecosystem. State, lifecycle methods, cross-browser event normalization are good examples of this.
이것이 우리가 React 그 자체에 때때로 기능을 추가하는 이유입니다. 많은 컴포넌트가 호환성이 없거나 비효율적인 방법으로 어떤 기능을 구현한다는 것을 알게 된다면 차라리 그것을 React에 녹여낼지도 모르겠습니다. 하지만 우리는 선뜻 그렇게 하지는 않습니다. 우리가 그렇게 한다면 그것은 추상화 레벨을 올리는 것이 전체 생태계에 이익이 된다는 확신이 있기 때문입니다. State, 생명주기 메소드, 크로스 브라우저의 이벤트 정규화가 좋은 예입니다.

We always discuss such improvement proposals with the community. You can find some of those discussions by the ["big picture"](https://github.com/facebook/react/issues?q=is:open+is:issue+label:"Type:+Big+Picture") label on the React issue tracker.
우리는 언제나 커뮤니티와 이러한 개선안을 논의합니다. React 이슈 트래커에서 ["big picture"](https://github.com/facebook/react/issues?q=is:open+is:issue+label:"Type:+Big+Picture") 레이블로 이러한 논의를 찾을 수 있습니다.

### Escape Hatches {#escape-hatches}
### 해결책 {#escape-hatches}

React is pragmatic. It is driven by the needs of the products written at Facebook. While it is influenced by some paradigms that are not yet fully mainstream such as functional programming, staying accessible to a wide range of developers with different skills and experience levels is an explicit goal of the project.
React는 실용적입니다. 그것은 Facebook에서 작성된 제품의 필요에 의해 발전되었습니다. 함수형 프로그래밍과 같은, 아직은 완전한 주류는 아닌 몇 가지 패러다임에 의해 영향을 받지만, 다양한 기술과 경험을 가진 광범위한 개발자에게 접근할 수 있도록 유지하는 것은 프로젝트의 명백한 목표입니다.

If we want to deprecate a pattern that we don't like, it is our responsibility to consider all existing use cases for it and [educate the community about the alternatives](/blog/2016/07/13/mixins-considered-harmful.html) before we deprecate it. If some pattern that is useful for building apps is hard to express in a declarative way, we will [provide an imperative API](/docs/more-about-refs.html) for it. If we can't figure out a perfect API for something that we found necessary in many apps, we will [provide a temporary subpar working API](/docs/legacy-context.html) as long as it is possible to get rid of it later and it leaves the door open for future improvements.
우리가 원하지 않는 패턴을 비권장하는 경우, 그것을 비권장하기 전에 존재하는 모든 유스케이스를 고려하고 [대체 방법에 대해 커뮤니티에 교육하는 것](/blog/2016/07/13/mixins-considered-harmful.html)은 우리의 책임입니다. 앱을 구축하는 데 유용한 어떤 패턴을 선언적 방식으로 표현하기가 몹시 어려운 경우라면 우리는 [명령적 API를 제공](/docs/more-about-refs.html) 할 것입니다. 많은 앱에서 필요한 어떤 것에 대한 최적의 API를 찾아내지 못한 경우, 가능한 다음에 제거할 수 있고 장래의 개선 여지가 있는 경우만 [보통 수준 이하의 임시적인 작업용 API를 제공](/docs/legacy-context.html) 할 것입니다.

### Stability {#stability}
### 안정성 {#stability}

We value API stability. At Facebook, we have more than 50 thousand components using React. Many other companies, including [Twitter](https://twitter.com/) and [Airbnb](https://www.airbnb.com/), are also heavy users of React. This is why we are usually reluctant to change public APIs or behavior.
우리는 API 안정성에 가치를 둡니다. Facebook에는 React를 사용한 5만 개 이상의 컴포넌트가 사용됩니다. [Twitter](https://twitter.com/)와 [Airbnb](https://www.airbnb.com/)를 위시한 다른 많은 기업 또한 React의 헤비 유저(heavy user)입니다. 이것이 바로 우리가 공용 API나 behavior의 변경을 꺼리는 이유입니다.

However we think stability in the sense of "nothing changes" is overrated. It quickly turns into stagnation. Instead, we prefer the stability in the sense of "It is heavily used in production, and when something changes, there is a clear (and preferably automated) migration path."
그러나 "아무것도 변하지 않는다"는 의미로 안정성을 과대평가하고 있다고, 우리는 생각합니다. 그것은 곧 정체로 바뀝니다. 대신, 우리는 "프로덕션(production) 환경에서 자주 사용되는 무엇인가가 변경되었을 때는 명확한 (그리고 가능하면 자동화된) 마이그레이션 방법이 있다"는 의미에서의 안정성을 선호합니다.

When we deprecate a pattern, we study its internal usage at Facebook and add deprecation warnings. They let us assess the impact of the change. Sometimes we back out if we see that it is too early, and we need to think more strategically about getting the codebases to the point where they are ready for this change.
어떤 패턴을 비권장하는 경우 Facebook 내부에서 그 사용법을 조사하고 비권장 경고를 추가합니다. 그럼으로써 변화의 영향도를 평가할 수 있습니다. 만약 변경이 너무 시기상조이거나 변경에 대한 준비가 될 때까지 코드 베이스를 가져가는 데에 있어 전략적으로 조금 더 생각할 필요가 있는 경우, 우리는 그 변경을 되돌릴 수 있습니다.

If we are confident that the change is not too disruptive and the migration strategy is viable for all use cases, we release the deprecation warning to the open source community. We are closely in touch with many users of React outside of Facebook, and we monitor popular open source projects and guide them in fixing those deprecations.
변경이 그다지 파괴적이지 않고 모든 유스케이스에서 마이그레이션 전략이 실행 가능하다고 확신하는 경우 오픈소스 커뮤니티에 비추천 경고를 공개합니다. 우리는 Facebook 이외의 많은 React 사용자와 긴밀하게 연락하고 있으며 인기 있는 오픈소스 프로젝트를 모니터링하고 비추천 경고 수정을 안내하고 있습니다.

Given the sheer size of the Facebook React codebase, successful internal migration is often a good indicator that other companies won't have problems either. Nevertheless sometimes people point out additional use cases we haven't thought of, and we add escape hatches for them or rethink our approach.
Facebook의 React 코드 베이스의 순수 사이즈를 생각해 볼 때 사내 마이그레이션이 성공한다는 것은 다른 기업들에서도 문제없을 것이라는 좋은 지표입니다. 그런데도 가끔 사람들은 우리가 생각하지 못한 새로운 유스케이스를 지적하고, 우리는 탈출 해치를 추가하거나 접근법을 다시 생각합니다.

We don't deprecate anything without a good reason. We recognize that sometimes deprecations warnings cause frustration but we add them because deprecations clean up the road for the improvements and new features that we and many people in the community consider valuable.
정당한 이유 없이는 우리는 어떤 것도 비권장하지 않습니다. 때때로 지원 중단 경고가 불만을 야기하기도 하지만, 우리와 커뮤니티의 많은 사람이 가치 있다고 생각하는 개선과 새로운 기능을 위해 비권장이 필요하기도 하기 때문에 우리는 그것을 추가합니다.

For example, we added a [warning about unknown DOM props](/warnings/unknown-prop.html) in React 15.2.0. Many projects were affected by this. However fixing this warning is important so that we can introduce the support for [custom attributes](https://github.com/facebook/react/issues/140) to React. There is a reason like this behind every deprecation that we add.
예를 들어, 우리는 React 15.2.0에서는 [알려지지 않은 DOM props에 대한 경고](/warnings/unknown-prop.html)를 추가합니다. 이것은 많은 프로젝트에 영향이 있습니다. 그렇지만, React에 [사용자 어트리뷰트](https://github.com/facebook/react/issues/140)의 지원을 React에 도입할 수 있도록 이 경고를 수정하는 것은 중요합니다. 우리가 추가하는 모든 비권장에는 이와 같은 이유가 있습니다.

When we add a deprecation warning, we keep it for the rest of the current major version, and [change the behavior in the next major version](/blog/2016/02/19/new-versioning-scheme.html). If there is a lot of repetitive manual work involved, we release a [codemod](https://www.youtube.com/watch?v=d0pOgY8__JM) script that automates most of the change. Codemods enable us to move forward without stagnation in a massive codebase, and we encourage you to use them as well.
우리가 비권장 경고를 추가하면 현재의 메이저 버전의 나머지 부분에서는 경고를 남긴 채 유지하고 [다음 메이저 버전에서는 동작을 변경합니다](/blog/2016/02/19/new-versioning-scheme.html). 반복적인 수작업이 많은 경우에는 변경의 상당 부분을 자동화하는 [codemod](https://www.youtube.com/watch?v=d0pOgY8__JM) 스크립트를 공개합니다. Codemod를 사용하면 대규모 코드 베이스도 바로 이행을 진행할 수 있고, 우리는 이것을 사용하기를 독려합니다.

You can find the codemods that we released in the [react-codemod](https://github.com/reactjs/react-codemod) repository.
여러분은 우리가 [react-codemod](https://github.com/reactjs/react-codemod) 저장소에 공개한 codemod를 찾을 수 있습니다.

### Interoperability {#interoperability}
### 상호운용성 {#interoperability}

We place high value in interoperability with existing systems and gradual adoption. Facebook has a massive non-React codebase. Its website uses a mix of a server-side component system called XHP, internal UI libraries that came before React, and React itself. It is important to us that any product team can [start using React for a small feature](https://www.youtube.com/watch?v=BF58ZJ1ZQxY) rather than rewrite their code to bet on it.
우리는 기존 시스템과의 상호운용성과 점진적인 도입에 높은 가치를 두고 있습니다. Facebook은 거대한 non-React 코드 베이스를 가지고 있습니다. Facebook 웹사이트에는 XHP라고 부르는 서버 사이드 컴포넌트 시스템과 React 이전부터 개발된 내부 UI 라이브러리, 그리고 React 그 자체를 조합해서 사용하고 있습니다. 우리에게는 어떤 프로덕트 팀도 서로 내기하듯이 코드를 다시 작성하기보다는 [작은 기능에 React를 사용하여 시작할 수 있다](https://www.youtube.com/watch?v=BF58ZJ1ZQxY)는 것이 중요합니다.

This is why React provides escape hatches to work with mutable models, and tries to work well together with other UI libraries. You can wrap an existing imperative UI into a declarative component, and vice versa. This is crucial for gradual adoption.
이것이 React가 변경 가능한 모델을 다루기 위한 해결책(escape hatches)을 제시하고, 다른 UI 라이브러리들과 함께 잘 동작하도록 노력하는 이유입니다. 기존의 명령적인 UI를 선언적인 컴포넌트로 감싸는 것도, 또 그 반대도 가능합니다. 이것은 점진적인 도입을 위해서 필요한 것입니다.

### Scheduling {#scheduling}
### 스케쥴링 {#scheduling}

Even when your components are described as functions, when you use React you don't call them directly. Every component returns a [description of what needs to be rendered](/blog/2015/12/18/react-components-elements-and-instances.html#elements-describe-the-tree), and that description may include both user-written components like `<LikeButton>` and platform-specific components like `<div>`. It is up to React to "unroll" `<LikeButton>` at some point in the future and actually apply changes to the UI tree according to the render results of the components recursively.
컴포넌트가 함수로 기술되어 있어도 React를 사용할 때 그것을 직접 호출하지는 마세요. 모든 컴포넌트는 [무엇을 렌더링할 필요가 있는 것인지에 대한 설명](/blog/2015/12/18/react-components-elements-and-instances.html#elements-describe-the-tree)을 반환하고 `<LikeButton>`과 같은 사용자가 정의한 컴포넌트와 `<div>`와 같은 플랫폼 고유의 컴포넌트를 모두 포함할 수 있습니다. 미래의 언젠가 `<LikeButton>`을 풀고 컴포넌트의 렌더링 결과에 따라 재귀적으로 UI 트리를 변경하는 것은 실제로 React의 책임입니다.

This is a subtle distinction but a powerful one. Since you don't call that component function but let React call it, it means React has the power to delay calling it if necessary. In its current implementation React walks the tree recursively and calls render functions of the whole updated tree during a single tick. However in the future it might start [delaying some updates to avoid dropping frames](https://github.com/facebook/react/issues/6170).
이것은 매우 미묘한 차이지만 매우 강력한 것입니다. 여러분이 그 컴포넌트 함수를 호출하지 않고 React가 호출하는 것인데, 이것은 필요한 경우 지연할 수 있는 권한이 React에 있다는 것을 의미합니다. 현재의 구현에서는 React는 트리를 재귀적으로 조사하고 단일 Tick 동안에 전체 갱신된 트리의 렌더링 함수를 호출합니다.

This is a common theme in React design. Some popular libraries implement the "push" approach where computations are performed when the new data is available. React, however, sticks to the "pull" approach where computations can be delayed until necessary.
이것은 React 설계의 공통된 테마입니다. 어떤 인기 있는 라이브러리는 새 데이터가 사용 가능해졌을 때 계산이 수행되는 "push" 접근 방식을 구현합니다. 그러나 React는 필요할 때까지 계산을 지연할 수 있는 "pull" 접근 방식을 택합니다.

React is not a generic data processing library. It is a library for building user interfaces. We think that it is uniquely positioned in an app to know which computations are relevant right now and which are not.
React는 범용적인 데이터 처리 라이브러리가 아닙니다. 그것은 사용자 인터페이스를 만들기 위한 라이브러리입니다. 우리는 React가 앱에서 어떤 계산이 지금 필요하고 어떤 계산이 지금 필요하지 않은지 알 수 있는 특별한 위치를 점유했다고 생각합니다.

If something is offscreen, we can delay any logic related to it. If data is arriving faster than the frame rate, we can coalesce and batch updates. We can prioritize work coming from user interactions (such as an animation caused by a button click) over less important background work (such as rendering new content just loaded from the network) to avoid dropping frames.
무엇인가가 화면 밖에 있다면 우리는 그것과 관련된 어떤 로직을 지연시킬 수 있습니다. 데이터가 프레임 속도보다 좀 더 빠르게 도착하는 경우 통합 및 일괄 업데이트를 할 수 있습니다. (네트워크에서 갓 로드된 새로운 콘텐츠의 렌더링과 같은) 중요도가 낮은 백그라운드 작업보다 (버튼 클릭에 의한 애니메이션과 같은) 사용자 인터렉션을 우선할 수 있습니다.

To be clear, we are not taking advantage of this right now. However the freedom to do something like this is why we prefer to have control over scheduling, and why `setState()` is asynchronous. Conceptually, we think of it as "scheduling an update".
명확하게 하자면, 우리는 지금 이것을 이용하고 있지 않습니다. 그러나 이런 일을 할 수 있는 자유는 왜 우리가 스케줄링에 대한 통제권을 선호하는지, 왜 `setState()`는 비동기적인지에 대한 이유입니다. 개념적으로 우리는 이것을 "스케줄링 업데이트"라고 생각합니다.

The control over scheduling would be harder for us to gain if we let the user directly compose views with a "push" based paradigm common in some variations of [Functional Reactive Programming](https://en.wikipedia.org/wiki/Functional_reactive_programming). We want to own the "glue" code.
[Functional Reactive Programming](https://en.wikipedia.org/wiki/Functional_reactive_programming)의 몇 가지 변형에서 흔하게 볼 수 있는 "push" 기반 패러다임으로 사용자가 직접 뷰를 구성한다면 스케줄링에 대한 제어를 얻는 것이 어려워질 것입니다. 우리는 "글루(glue)" 코드를 관리하고 싶습니다.

It is a key goal for React that the amount of the user code that executes before yielding back into React is minimal. This ensures that React retains the capability to schedule and split work in chunks according to what it knows about the UI.
React의 핵심 목표는 React로 되돌아가기 전에 수행하는 사용자 코드의 양을 최소화하는 것입니다. 이것은 React가 UI에 대해서 알고 있는지에 따라 작업을 스케줄하고 청크로 분할하는 능력을 유지한다는 것을 보증합니다.

There is an internal joke in the team that React should have been called "Schedule" because React does not want to be fully "reactive".
React는 완전하게 "반응적(reactive)"이고 싶지 않았기 때문에 "Schedule"로 불렸어야 한다는 팀 내 농담도 있습니다.

### Developer Experience {#developer-experience}
### 개발자 경험 {#developer-experience}

Providing a good developer experience is important to us.
좋은 개발자 경험을 제공하는 것은 우리에게 중요합니다.

For example, we maintain [React DevTools](https://github.com/facebook/react-devtools) which let you inspect the React component tree in Chrome and Firefox. We have heard that it brings a big productivity boost both to the Facebook engineers and to the community.
예를 들어, 우리는 Chrome과 Firefox에서 React 컴포넌트 트리를 살펴볼 수 있는 [React DevTools](https://github.com/facebook/react-devtools)를 유지합니다. 이것은 Facebook 엔지니어와 커뮤니티 모두에게 커다란 생산성 향상을 가져왔다고 들었습니다.

We also try to go an extra mile to provide helpful developer warnings. For example, React warns you in development if you nest tags in a way that the browser doesn't understand, or if you make a common typo in the API. Developer warnings and the related checks are the main reason why the development version of React is slower than the production version.
또한, 도움이 될 만한 개발자 경고를 제공하기 위해 우리는 더 노력하고 있습니다. 예를 들어, React는 개발 중에 브라우저가 이해할 수 없는 방법으로 태그를 중첩하거나 API에서 일반적인 오타를 작성한 경우 이에 대해 경고합니다. 개발자 경고와 이와 관련된 검사는 React 개발자 버전이 프로덕션 버전보다 조금 더 느린 주요한 이유입니다.

The usage patterns that we see internally at Facebook help us understand what the common mistakes are, and how to prevent them early. When we add new features, we try to anticipate the common mistakes and warn about them.
Facebook 내부에서 볼 수 있는 사용성 패턴은 보편적인 실수가 무엇이고 어떻게 방지할 수 있는지 이해하는 데 도움이 됩니다. 새 기능을 추가할 때 우리는 일반적인 실수를 예상하고 그것을 경고하려고 노력합니다.

We are always looking out for ways to improve the developer experience. We love to hear your suggestions and accept your contributions to make it even better.
우리는 항상 개발자 경험을 향상할 수 있는 방법을 찾고 있습니다. 우리는 여러분의 제안을 듣고 여러분의 기여를 수용하여 그것이 더 나은 개발자 경험을 만들 수 있기를 바랍니다.

### Debugging {#debugging}
### 디버깅 {#debugging}

When something goes wrong, it is important that you have breadcrumbs to trace the mistake to its source in the codebase. In React, props and state are those breadcrumbs.
문제가 발생했을 때 코드 베이스로 실수의 원인을 추적할 수 있는 표식을 만드는 것은 중요합니다. React에서의 props와 state가 이러한 표식입니다.

If you see something wrong on the screen, you can open React DevTools, find the component responsible for rendering, and then see if the props and state are correct. If they are, you know that the problem is in the component’s `render()` function, or some function that is called by `render()`. The problem is isolated.
화면에서 무엇인가 문제가 발생한 경우 React DevTools를 열고 렌더링을 담당한 컴포넌트를 찾은 후 props와 state가 올바른지 확인할 수 있습니다. 그렇다면 컴포넌트의 `render()` 함수 안에 문제가 있거나 `render()`를 호출하는 어떤 함수에 문제가 있다는 것을 알 수 있습니다. 이제 문제가 분리되었습니다.

If the state is wrong, you know that the problem is caused by one of the `setState()` calls in this file.
This, too, is relatively simple to locate and fix because usually there are only a few `setState()` calls in a single file.
state가 바르지 않다면 이 파일 내의 `setState()` 호출 중 하나에서 발생한 문제입니다. 또한, 보통 하나의 파일 내에서 `setState()` 호출은 많지 않기 때문에 검색이나 수정이 비교적 간단합니다.

If the props are wrong, you can traverse the tree up in the inspector, looking for the component that first "poisoned the well" by passing bad props down.
props가 바르지 않다면 인스펙터로 거슬러 올라가며 트리를 이리저리 탐색하여, 나쁜 props를 전달함으로써 최초로 "우물에 독을 탄" 범인 컴포넌트가 무엇인지 찾을 수 있습니다.

This ability to trace any UI to the data that produced it in the form of current props and state is very important to React. It is an explicit design goal that state is not "trapped" in closures and combinators, and is available to React directly.
현재의 props와 state의 형태로 어떤 UI를 생성한 데이터까지 추적할 수 있는 이 능력은 React에는 매우 중요합니다. state가 Closure와 연결자(combinators)에 갇혀 있지 않고 React에 직접적으로 이용할 수 있는 것은 React의 명확한 설계 목표입니다.

While the UI is dynamic, we believe that synchronous `render()` functions of props and state turn debugging from guesswork into a boring but finite procedure. We would like to preserve this constraint in React even though it makes some use cases, like complex animations, harder.
UI는 동적이지만, props와 state의 동기적인 `render()` 함수는, 디버깅 작업이 단순한 추측에서 지루하지만 유한한 단계가 될 것이라고 믿습니다. 복잡한 애니메이션과 같은 몇 가지의 유스케이스가 보다 어렵게 되겠지만, 우리는 React에서 이 제한점을 고수했으면 합니다.

### Configuration {#configuration}
### 설정 {#configuration}

We find global runtime configuration options to be problematic.
우리는 글로벌 런타임 설정 옵션에 문제가 있음을 발견했습니다.

For example, it is occasionally requested that we implement a function like `React.configure(options)` or `React.register(component)`. However this poses multiple problems, and we are not aware of good solutions to them.
가령, 때때로 `React.configure(options)` 또는 `React.register(component)`와 같은 기능을 구현해 달라는 요청을 받습니다. 그렇지만 이것은 여러 가지 문제를 일으킬 수 있는데 우리는 그것에 대한 좋은 해결책을 알지 못합니다.

What if somebody calls such a function from a third-party component library? What if one React app embeds another React app, and their desired configurations are incompatible? How can a third-party component specify that it requires a particular configuration? We think that global configuration doesn't work well with composition. Since composition is central to React, we don't provide global configuration in code.
만약 써드파티 컴포넌트 라이브러리에서 이런 함수를 호출한다면? 만약 한 React 앱이 다른 React 앱을 포함했는데 그것의 설정이 불완전하다면? 써드파티 컴포넌트는 특정한 설정이 필요한지 아닌지 어떻게 구체화할 것인지? 우리는 글로벌 설정이 합성에서 제대로 동작하지 않을 것이라고 생각합니다. 합성이란 React의 중심이기 때문에 우리는 코드에서 글로벌 설정을 제공하지 않습니다.

We do, however, provide some global configuration on the build level. For example, we provide separate development and production builds. We may also [add a profiling build](https://github.com/facebook/react/issues/6627) in the future, and we are open to considering other build flags.
그러나, 우리는 빌드 레벨에서의 몇 가지 글로벌 설정을 제공합니다. 예를 들어, 분리된 개발 빌드와 프로덕션 빌드를 제공하고 있습니다. 다음에는 [프로파일링 빌드를 추가](https://github.com/facebook/react/issues/6627) 할지도 모르고, 또 다른 빌드 플래그도 검토하고 있습니다.

### Beyond the DOM {#beyond-the-dom}
### DOM을 넘어서 {#beyond-the-dom}

We see the value of React in the way it allows us to write components that have fewer bugs and compose together well. DOM is the original rendering target for React but [React Native](https://facebook.github.io/react-native/) is just as important both to Facebook and the community.
우리는 더 적은 버그의 컴포넌트를 작성하여 구성할 수 있다는 면에서 React의 가치를 봅니다. DOM은 React에서 근본적 렌더링 대상이지만, [React Native](https://facebook.github.io/react-native/)는 Facebook과 커뮤니티에서 모두 중요합니다.

Being renderer-agnostic is an important design constraint of React. It adds some overhead in the internal representations. On the other hand, any improvements to the core translate across platforms.
렌더러에 구속받지 않음은 React의 중요한 설계상의 제한점입니다. 그것은 내부 표현에 약간의 오버헤드를 더하게 됩니다. 반면, 코어의 개선은 모든 플랫폼에서 통용됩니다.

Having a single programming model lets us form engineering teams around products instead of platforms. So far the tradeoff has been worth it for us.
단일 프로그래밍 모델을 가짐으로써 우리는 플랫폼 대신 프로덕트 중심의 엔지니어링 팀을 구성할 수 있습니다. 지금까지 우리에게 트레이드 오프는 그만한 가치가 있습니다.

### Implementation {#implementation}
### 구현 {#implementation}

We try to provide elegant APIs where possible. We are much less concerned with the implementation being elegant. The real world is far from perfect, and to a reasonable extent we prefer to put the ugly code into the library if it means the user does not have to write it. When we evaluate new code, we are looking for an implementation that is correct, performant and affords a good developer experience. Elegance is secondary.
우리는 가능한 한 세련된 API를 제공하려고 노력합니다. 그러나 구현이 화려한 것에 관심이 있지는 않습니다. 실세계는 완벽함에서 거리가 있습니다. 만약 사용자가 못생긴 코드를 작성하지 않아도 된다면, 합리적인 범위에서 우리는 라이브러리에 그 못생긴 코드를 삽입하는 것을 선호합니다. 새로운 코드를 평가할 때 올바르고 성능이 좋고 뛰어난 개발자 경험을 제공하는 구현을 기대합니다. 우아함은 그다음 문제입니다.

We prefer boring code to clever code. Code is disposable and often changes. So it is important that it [doesn't introduce new internal abstractions unless absolutely necessary](https://youtu.be/4anAwXYqLG8?t=13m9s). Verbose code that is easy to move around, change and remove is preferred to elegant code that is prematurely abstracted and hard to change.
우리는 현명한 코드보다 지루한 코드를 선호합니다. 코드는 일회성이며 자주 변경됩니다. 그래서 [절대적으로 필요한 것이 아니라면 새로운 내부 추상화를 도입하지 않는 것이](https://youtu.be/4anAwXYqLG8?t=13m9s) 중요합니다. 이동, 변경 또는 제거가 쉬운 장황한 코드는 시기상조로, 추상화하여 변경하기 어려운 우아한 코드보다 우선합니다.

### Optimized for Tooling {#optimized-for-tooling}
### 툴로의 최적화 {#optimized-for-tooling}

Some commonly used APIs have verbose names. For example, we use `componentDidMount()` instead of `didMount()` or `onMount()`. This is [intentional](https://github.com/reactjs/react-future/issues/40#issuecomment-142442124). The goal is to make the points of interaction with the library highly visible.
몇 가지 일반적으로 사용되고 있는 API들은 장황한 이름을 가지고 있습니다. 예를 들어, 우리는 `didMount()`나 `onMount()` 대신 `componentDidMount()`를 사용합니다. 이것은 [의도적입니다](https://github.com/reactjs/react-future/issues/40#issuecomment-142442124). 목적은 라이브러리와의 인터렉션 포인트를 눈에 띄게 하는 것입니다.

In a massive codebase like Facebook, being able to search for uses of specific APIs is very important. We value distinct verbose names, and especially for the features that should be used sparingly. For example, `dangerouslySetInnerHTML` is hard to miss in a code review.
Facebook과 같이 거대한 코드 베이스에서 특정한 API의 사용을 검색할 수 있다는 것은 매우 중요합니다. 구별이 쉬운 장황한 이름, 특히 조심스럽게 사용해야만 하는 기능을 소중히 하고 있습니다. 예를 들어, 코드 리뷰에서 `dangerouslySetInnerHTML`을 간과한다는 것은 몹시 어려운 일일 것입니다.

Optimizing for search is also important because of our reliance on [codemods](https://www.youtube.com/watch?v=d0pOgY8__JM) to make breaking changes. We want it to be easy and safe to apply vast automated changes across the codebase, and unique verbose names help us achieve this. Similarly, distinctive names make it easy to write custom [lint rules](https://github.com/yannickcr/eslint-plugin-react) about using React without worrying about potential false positives.
파괴적인 변경을 가할 때 [codemods](https://www.youtube.com/watch?v=d0pOgY8__JM)에 의존하고 있기 때문에 검색 최적화 또한 중요합니다. 우리는 거대한 자동화된 변경을 코드 베이스 전체에 적용하기가 쉽고 안전했으면 하는 바람인데, 독특한 웅장한 이름을 사용하여 이것을 실현할 수 있습니다. 마찬가지로, 다른 것과 구별되는 이름을 사용하여, 거짓 양성(false positives)을 걱정하는 일 없이 React 사용에 대한 사용자 [lint 규칙](https://github.com/yannickcr/eslint-plugin-react)을 쉽게 만들 수 있습니다.

[JSX](/docs/introducing-jsx.html) plays a similar role. While it is not required with React, we use it extensively at Facebook both for aesthetic and pragmatic reasons.
[JSX](/docs/introducing-jsx.html)도 유사한 역할을 합니다. React에서 꼭 필요한 것은 아니지만 우리는 미적, 실용적인 이유로 Facebook에서 광범위하게 사용합니다.

In our codebase, JSX provides an unambiguous hint to the tools that they are dealing with a React element tree. This makes it possible to add build-time optimizations such as [hoisting constant elements](https://babeljs.io/docs/en/babel-plugin-transform-react-constant-elements/), safely lint and codemod internal component usage, and [include JSX source location](https://github.com/facebook/react/pull/6771) into the warnings.
우리의 코드 베이스에서는, JSX는 React 엘리먼트 트리를 다루는 툴에 대한 명확한 힌트를 제공합니다. 이로 인해 [상수 엘리먼트의 호이스팅](https://babeljs.io/docs/en/babel-plugin-transform-react-constant-elements/)과 안전한 lint 및 codemod 내부 컴포넌트 사용과 같은 빌드 시의 최적화를 추가하거나 JSX 소스 위치를 경고에 포함할 수 있습니다.

### Dogfooding {#dogfooding}
### 독푸딩 {#dogfooding}

We try our best to address the problems raised by the community. However we are likely to prioritize the issues that people are *also* experiencing internally at Facebook. Perhaps counter-intuitively, we think this is the main reason why the community can bet on React.
우리는 커뮤니티에서 제기한 문제를 해결하려고 최선을 다하고 있습니다. 그러나 우리는 "또한" 사람들이 Facebook 내부적으로 겪고 있는 이슈를 우선시할 수도 있습니다. 반(反) 직관적으로 우리는 이것이 커뮤니티가 React에 내기할 수 있는 주요한 이유라고 생각합니다.

Heavy internal usage gives us the confidence that React won't disappear tomorrow. React was created at Facebook to solve its problems. It brings tangible business value to the company and is used in many of its products. [Dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food) it means that our vision stays sharp and we have a focused direction going forward.
다량의 내부 사용으로, 우리는 React가 내일 사라지지 않을 것이라는 확신을 갖게 됩니다. React는 Facebook에서의 문제를 해결하기 위해 Facebook에서 만들어졌습니다. React는 기업에 확실한 비즈니스 가치를 가져다주며 많은 프로덕트에 사용됩니다. [독푸딩](https://en.wikipedia.org/wiki/Eating_your_own_dog_food) 그것은 우리의 전망을 날카롭게 유지하며 앞으로 나아가는 방향으로 초점을 맞추고 있다는 것을 의미합니다.

This doesn't mean that we ignore the issues raised by the community. For example, we added support for [web components](/docs/webcomponents.html) and [SVG](https://github.com/facebook/react/pull/6243) to React even though we don't rely on either of them internally. We are actively [listening to your pain points](https://github.com/facebook/react/issues/2686) and [address them](/blog/2016/07/11/introducing-reacts-error-code-system.html) to the best of our ability. The community is what makes React special to us, and we are honored to contribute back.
이것은 우리가 커뮤니티에서 제기하는 이슈를 무시한다는 것을 의미하지는 않습니다. 가령, Facebook 내부에서는 어느 하나에도 의존하지 않음에도 불구하고 [웹 컴포넌트](/docs/webcomponents.html)와 [SVG](https://github.com/facebook/react/pull/6243)에 대한 지원을 React에 추가했습니다. 우리는 적극적으로 [여러분의 고통 포인트에 대해 듣고 있고](https://github.com/facebook/react/issues/2686) 우리의 최선을 다해 [그것들을 처리하고 있습니다](/blog/2016/07/11/introducing-reacts-error-code-system.html). 커뮤니티는 React를 우리에게 특별하게 만들고 있고, 우리는 그것에 다시 기여할 수 있음에 감사합니다.

After releasing many open source projects at Facebook, we have learned that trying to make everyone happy at the same time produced projects with poor focus that didn't grow well. Instead, we found that picking a small audience and focusing on making them happy brings a positive net effect. That's exactly what we did with React, and so far solving the problems encountered by Facebook product teams has translated well to the open source community.
Facebook에서 많은 오픈 소스 프로젝트를 출시한 이후에, 우리는 동시에 모두가 행복하도록 노력하는 것이 잘 성장하지 못 하는 약한 집중력의 프로젝트를 생성해냈다는 것을 배웠습니다. 대신, 우리는 작은 청중을 골라내고 그들을 행복하게 만드는 것에 집중하는 것이 긍정적인 순수 효과를 가져온다는 것을 발견했습니다. 이것이 우리가 React에서 한 바로 그 일이고, 지금까지 Facebook 프로덕트 팀이 직면하여 해결한 문제는 오픈 소스 커뮤니티로 잘 전달되었습니다.

The downside of this approach is that sometimes we fail to give enough focus to the things that Facebook teams don't have to deal with, such as the "getting started" experience. We are acutely aware of this, and we are thinking of how to improve in a way that would benefit everyone in the community without making the same mistakes we did with open source projects before.
이 접근법의 단점은 "시작하기"와 같은 경험처럼 때때로 Facebook 팀이 다룰 필요가 없는 것들에 충분한 집중을 하지 못하는 경우가 있다는 것입니다. 우리는 이것을 정확하게 알고 있고 커뮤니티에서 우리가 이전에 오픈소스 프로젝트에서 했던 것과 같은 동일한 실수 없이 모든 사람에게 이익이 되는 방식으로 어떻게 개선할 것인가 생각하고 있습니다.