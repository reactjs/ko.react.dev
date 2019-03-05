---
id: hooks-intro
title: Hooks의 개요
permalink: docs/hooks-intro.html
next: hooks-overview.html
---

*Hooks*가 React 버전 16.8에 새로 추가되었습니다. Hooks를 이용하여 클래스를 작성할 필요 없이 상태 값과 여러 React의 기능을 사용할 수 있습니다.
```js{4,5}
import React, { useState } from 'react';

function Example() {
  // "count"라는 새로운 상태 값을 정의합니다.
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

`useState`라는 새로운 함수는 우리가 "Hook"에서 처음 배우게 될 함수입니다. 이 예제는 단지 맛보기에 불과합니다. 아직 이해가 되지 않아도 걱정하지 마세요!

**당신은 [다음 페이지](/docs/hooks-overview.html)에서 Hooks에 대해 배울 수 있습니다.** 이 페이지에서는 왜 우리가 Hooks를 리액트에 추가했는지, 그리고 어떻게 Hooks가 당신의 애플리케이션을 작성하는 데 도움을 주는지 설명할 것입니다.
>노트
>
>React 16.8.0은 Hooks를 지원하는 첫 번째 release입니다. 업그레이드 할 때 React DOM을 포함한 모든 패키지를 업데이트 하는 것을 잊지 마세요. React-Native는 다음번 안정된 release부터 지원할 것입니다.

## 소개영상 {#video-introduction}

React Conf 2018에서 Sophie Alpert와 Dan Abramov는 Hooks를 소개했었습니다. 이어서 Ryan Florence가 Hooks를 사용하여 어떻게 어플리케이션을 리팩토링 할 것인지 보여주었습니다. 아래 영상에서 확인해보세요.
<br>

<iframe width="650" height="366" src="//www.youtube.com/embed/dpw9EHDh2bM" frameborder="0" allowfullscreen></iframe>

## 변경 사항 없음 {#no-breaking-changes}

얘기하기에 앞서, Hooks의 특징은 다음과 같습니다:

* **완벽한 동의** 기존의 코드를 다시 작성할 필요 없이 일부의 컴포넌트들 안에서 Hooks를 사용할 수 있습니다. 그러나 만약 당장 Hooks이 필요 없다면, Hooks를 사용할 필요는 없습니다.
* **100% 이전 버전과의 호환성** Hooks는 호환성을 깨뜨리는 변화가 없습니다.
* **현재 사용 가능** Hooks는 release v16.8.0에서 사용할 수 있습니다.

**React에서 class를 제거할 계획은 없습니다.** Hooks의 점진적 적용 전략에 대해 [아래 영역](#gradual-adoption-strategy) 페이지에서 읽을 수 있습니다.

**Hooks는 알고 있는 React 컨셉을 대체하지 않습니다.**
대신에, Hooks는 props, state, context, refs, 그리고 lifecycle와 같은  React 개념에 좀 더 직관적인 API를 제공합니다. 또한 Hooks는 그들을 엮기 위해 새로운 강력한 방법을 제공합니다.

**만약 단지 Hooks에 대해 배우길 원한다면, [다음 페이지로 바로 이동하기!](/docs/hooks-overview.html)로 가도 무방합니다.** 또한 왜 우리가 Hooks를 추가했는지, 그리고 어떻게 애플리케이션을 다시 작성할 필요 없이 Hooks를 이용하여 시작하는지에 대해 알고 싶다면 이 페이지를 계속 읽을 수 있습니다.

## 동기 {#motivation}
Hooks는 5년 동안 우리가 React에서 수만 개의 컴포넌트들을 유지하고 작성하는데 만났던 표면상 연결되지 않은 넓고 다양한 문제들을 해결했습니다. React를 배우는 중이든, 매일 사용하든, 심지어 비슷한 컴포넌트 모델과 함께 다른 라이브러리를 선호하든지 간에, 이러한 문제들을 인식해야 합니다.

### 컴포넌트들 사이에서 상태적인 로직을 재사용하는 것은 어렵습니다 {#ts-hard-to-reuse-stateful-logic-between-components}

React는 컴포넌트 사이에 재사용하기 위해 "붙이는" 방법을 제공하지 않습니다 (예를 들어, 스토어에 컴포넌트를 연결하는 것). 만약 이전부터 React를 사용해왔다면, 이것을 해결하기 위해 [render porps](/docs/render-props.html) 그리고 [higher-order-components]((/docs/higher-order-components.html))와 같은 패턴에 익숙할 것입니다. 그러나 패턴들을 사용할 때, 그러한 패턴들은 컴포넌트들을 재구조화하는 것을 요구하고 더 번거롭고 코드를 따라가기에 어렵게 만듭니다. 만약 React 개발자 도구에서 전형적인 React 애플리케이션을 본다면, 추상적 컴포넌트, render props, HOC, consumer, provider층의 의해 둘러 쌓인 “wrapper hell” 컴포넌트를 발견할 것입니다. [개발자 도구에서 그들을 거르지만](https://github.com/facebook/react-devtools/pull/503), 요점은 더 깊은 문제입니다. React는 상태적인 로직을 공유하기 위해 좀 더 좋은 기초 요소가 필요합니다.

Hooks를 사용하면 컴포넌트로부터 상태적인 로직을 추상화할 수 있습니다. 이것은 독립적인 테스트와 재사용이 가능합니다. **Hooks는 계층 변화 없이 상태적인 로직을 재사용할 수 있도록 도와줍니다.** 이것은 많은 컴포넌트들 혹은 커뮤니티 사이에서 Hooks를 공유하기 쉬워집니다.

우리는 [당신만의 Hooks를 구축하는 법](/docs/hooks-custom.html)에 대해 좀 더 알아볼 것입니다.

### 복잡한 컴포넌트들은 이해하기 어렵습니다. {#complex-components-become-hard-to-understand}

우리는 때론 간단하게 시작했지만 유지하기 힘든 상태적인 로직들과 사이드 이펙트가 있는 컴포넌트들을 유지해야합니다. 각각의 라이프사이클 메서드라도 때론 관계가 없는 로직의 혼합을 유지하기도 합니다. 예를 들어, 컴포넌트들은 `componentDidMount` 그리고 `componentDidUpdate`로 데이터를 가져오는 것을 수행할 수도 있습니다. 그러나, 같은 `componentDidMount` 메서드라도 이벤트 리스너를 설정하는 것과 같은 관계없는 일부 로직이 포함될 수도 있으며, `componentWillUnmount`에서 cleanup을 수행하기도 합니다. 함께 변경되는 상호 관련 코드는 분리되지만 완벽하게 연관 없는 코드들은 단일 메소드로 결합합니다. 이로 인해 버그와 무결성을 너무나 쉽게 발생합니다.

위와 같은 사례 안에서 상태적인 로직이 모든 공간에 있기 때문에 이러한 컴포넌트들을 작게 만드는 것은 불가능합니다. 또한 테스트하기도 어렵습니다. 이것은 많은 사람이 React를 별도의 상태 관리 라이브러리와 함께 결합해서 사용하는 이유 중 하나입니다. 그러나, 상태 관리 라이브러리는 종종 너무 많은 추상화를 소개하고, 다른 파일들 사이에서 건너뛰기를 요구하며 컴포넌트 재사용을 더욱 어렵게 만듭니다.

이것을 해결하기 위해, 라이프사이클 메서드를 기반으로 쪼개는 데 초점을 맞추기 보다는, **Hooks를 통해 로직과 관련된 조각의 기반을 둔 작은 함수들 안에서 하나의 컴포넌트를 쪼갤 수 있게 합니다. (구독 설정 및 데이터를 불러오는 것과 같은 로직)** 예측할 수 있는 리듀서를 만듦으로써 컴포넌트 지역 상태 값을 관리하는 것을 선택할 수 있습니다.

[Effect Hook](/docs/hooks-effect.html#tip-use-multiple-effects-to-separate-concerns)에 대해 알아볼 것입니다.

### 클래스들은 사람과 기계를 혼동시킵니다. {#classes-confuse-both-people-and-machines}

클래스들이 코드의 재사용성과 코드 구성을 좀 더 어렵게 만들 뿐만 아니라, React를 배우는데 큰 진입장벽이라는 것을 알고 있었습니다. 자바스크립트에서 어떻게 `this`가 작동하는지 알아야만 했고, 이것은 대부분 언어가 다르게 작동합니다. 이벤트 핸들러가 등록되는 방법을 기억해야만 합니다. 불안정한 [문법 제안들](https://babeljs.io/docs/en/babel-plugin-transform-class-properties/)이 없다면, 코드는 매우 장황해집니다. 사람들은 props, state, 그리고 top-down 데이터 흐름을 완벽하게 이해할 수 있지만, 여전히 클래스들은 쉽지 않습니다. React 안에서의 함수와 클래스 컴포넌트들을 구별하고 각 요소를 언제 사용하는지는 숙련된 React 개발자 사이에서도 의견이 일치하지 않습니다.

게다가, React는 5년 동안 지속하여 왔으며, 우리는 5년 뒤에도 이 관련성이 유지되기를 원합니다. 특별하게 템플릿에 제한을 두지 않는다면, [Svelte](https://svelte.technology/), [Angular](https://angular.io/), [Glimmer](https://glimmerjs.com/), [사전 컴파일 컴포넌트](https://en.wikipedia.org/wiki/Ahead-of-time_compilation)는 잠재적인 능력을 가지고 있습니다. 최근 [Prepack](https://prepack.io/)를 사용한 [컴포넌트 folding](https://github.com/facebook/react/issues/7323)에 대해서 실험해왔고, 긍정적인 결과를 보았습니다. 그러나, 클래스 컴포넌트들이 의도치 않은 최적화를 통해 더욱 느리게 만드는 패턴을 불러올 수도 있다는 것을 발견하였습니다. 클래스들은 오늘날 너무 많은  도구들의 문제를 제공합니다. 예를 들어 클래스들은 잘 최소화되지 않고, 그들은 플래키하고 신뢰할 수 없는 핫 리로딩을 만듭니다. 최적화 경로를 통해 유지될 수 있는 코드를 통해 좀 더 그럴싸한 API를 제공하기를 원합니다.

이러한 문제를 해결하기 위해, **Hooks는 클래스들이 없는 React 기능들을 사용하는 방법을 알려줍니다.** 개념적으로, React 컴포넌트들은 항상 함수에서 클로저를 가지고 있습니다. Hooks는 함수들을 수용하지만, React 정신에 희생되지 않습니다. Hooks는 긴급 탈출구를 제공하고, 복잡한 함수형 또는 반응형 프로그래밍 기술을 요구하지 않습니다.

>예제
>
>[Hooks 살펴보기](/docs/hooks-overview.html)는 Hooks를 배우는데 좋은 공간입니다.

## 점진적 적응 전략 {#gradual-adoption-strategy}
>**요약: React로부터 클래스들을 제거할 계획은 없습니다.**

React 개발자들이 사용하는 API에 초점을 맞추고, 새롭게 출시되는 API에 투자할 시간이 없다는 걸 알고 있습니다. Hooks는 가장 최신 기술이며, 이것은 Hooks를 배우길 고려하거나 적용하기 전에 많은 예제와 튜토리얼을 기다리는 게 나을 수도 있습니다.

우리는 또한 이 원시적인 Hooks를 React에 추가하는 게 쉽지 않다는 것을 알고 있습니다. 궁금해하는 독자들을 위해 동기부여에 대한 구체적인 내용을 담고 있는 [자세한 RFC](https://github.com/reactjs/rfcs/pull/68)를 준비했고 특정 디자인 결정 및 관련 선행 기술에 대한 추가적인 관점을 제공합니다.

**결정적으로, Hooks는 존재하는 코드와 함께 나란히 작동함으로써 점진적으로 적용할 수 있습니다.** Hooks로 이동을 서두를 필요는 없습니다. 이미 존재하며 복잡한 클래스 컴포넌트들에 대한 "큰 리팩토링"을 피하기를 권장합니다. 이것은 "Hooks 안에서 생각해보기"를 시작하기에 앞서 마음가짐이 필요합니다. 우리의 경험을 토대로, 새롭고 중요하지 않은 컴포넌트들 안에서 Hooks를 사용하는 것이 최고의 연습입니다. 그리고 당신의 모든 팀원이 Hooks에 대해 안정감을 느끼는지 확인하는 게 좋습니다. Hooks를 사용한 뒤에, 긍정적이든 부정적이든 상관없이 편하게 [의견 보내기](https://github.com/facebook/react/issues/new)를 이용해주시면 감사하겠습니다.

현재 존재하고 있는 모든 클래스 사례을 변경하고 싶지만, **미래에도 계속 클래스 컴포넌트들을 지원할 예정입니다.** 페이스북에서 수만 개의 클래스 컴포넌트들을 작성했으며, 그들을 재작성할 계획이 전혀 없습니다. 대신에, 새로운 코드에서 기존 코드와 나란히 Hooks를 사용할 계획입니다.

## FAQ {#frequently-asked-questions}
[Hooks FAQ 페이지](/docs/hooks-faq.html)를 준비했습니다. 그곳에서 Hooks에 대한 모든 공통적인 답변을 받을 수 있습니다.

## 다음 단계 {#next-steps}
이 페이지가 끝에 이르렀을 때 Hooks가 해결하려는 문제들에 대한 대략적인 아이디어를 가지고 있어야만 합니다. 그러나 아직 구체적으로 명확하진 않을 것입니다. 걱정하지 마세요! **[다음 페이지](/docs/hooks-overview.html)로 가서 예제를 통해서 Hooks에 대해 배워 봅시다!**