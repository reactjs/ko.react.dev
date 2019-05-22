---
id: hooks-intro
title: Hook의 개요
permalink: docs/hooks-intro.html
next: hooks-overview.html
---

*Hook*가 React 버전 16.8에 새로 추가되었습니다. Hook를 이용하여 Class를 작성할 필요 없이 상태 값과 여러 React의 기능을 사용할 수 있습니다.
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

`useState`라는 새로운 함수는 우리가 "Hook"에서 처음 배우게 될 함수입니다. 이 예시는 단지 맛보기에 불과합니다. 아직 이해가 되지 않아도 걱정하지 마세요!

**당신은 [다음 페이지](/docs/hooks-overview.html)에서 Hook에 대해 배울 수 있습니다.** 이 페이지에서는 왜 우리가 Hook를 React에 추가했는지, 그리고 어떻게 Hook가 당신의 애플리케이션을 작성하는 데 도움을 주는지 설명할 것입니다.
>노트
>
>React 16.8.0은 Hook를 지원하는 첫 번째 배포입니다. 업그레이드 할 때 React DOM을 포함한 모든 패키지를 업데이트 하는 것을 잊지 마세요. React-Native는 다음번 안정된 배포부터 지원할 것입니다.

## 소개 영상 {#video-introduction}

React Conf 2018에서 Sophie Alpert와 Dan Abramov는 Hook를 소개했었습니다. 이어서 Ryan Florence가 Hook를 사용하여 어떻게 어플리케이션을 리팩토링 할 것인지 보여주었습니다. 아래 영상에서 확인해보세요.
<br>

<iframe width="650" height="366" src="//www.youtube.com/embed/dpw9EHDh2bM" frameborder="0" allowfullscreen></iframe>

## 이미 작성된 코드에 필요한 변화사항은 없습니다. {#no-breaking-changes}

얘기하기에 앞서, Hook의 특징은 다음과 같습니다.

* **선택적 사용** 기존의 코드를 다시 작성할 필요 없이 일부의 컴포넌트들 안에서 Hook를 사용할 수 있습니다. 그러나 만약 당장 Hook이 필요 없다면, Hook를 사용할 필요는 없습니다.
* **100% 이전 버전과의 호환성** Hook는 호환성을 깨뜨리는 변화가 없습니다.
* **현재 사용 가능** Hook는 배포 v16.8.0에서 사용할 수 있습니다.

**React에서 Class를 제거할 계획은 없습니다.** Hook의 점진적 적용 전략에 대해 [아래 영역](#gradual-adoption-strategy) 페이지에서 읽을 수 있습니다.

**Hook는 알고 있는 React 컨셉을 대체하지 않습니다.**
대신에, Hook는 props, state, context, refs, 그리고 lifecycle와 같은 React 개념에 좀 더 직관적인 API를 제공합니다. 또한 Hook는 이 개념들을 엮기 위해 새로운 강력한 방법을 제공합니다.

**단지 Hook에 대해 배우길 원한다면, [다음 페이지](/docs/hooks-overview.html)로 바로 이동해도 됩니다.** 또한 왜 우리가 Hook를 추가했는지, 그리고 어떻게 애플리케이션을 다시 작성할 필요 없이 어떻게 Hook를 이용하는지 알고 싶다면 이 페이지를 계속 읽을 수 있습니다.

## 동기 {#motivation}
Hook는 5년 동안 우리가 React에서 수만 개의 컴포넌트들을 유지하고 작성하는데 만났던 표면상 연결되지 않은 넓고 다양한 문제들을 해결했습니다. React를 배우는 중이든, 매일 사용하든, 심지어 비슷한 컴포넌트 모델과 함께 다른 라이브러리를 선호하든지 간에, 이러한 문제 중 일부를 인식할 수도 있습니다.

### 컴포넌트 사이에서 상태와 관련된 로직을 재사용하기 어렵습니다. {#ts-hard-to-reuse-stateful-logic-between-components}

React는 컴포넌트에 재사용 가능한 행동을 붙이는 방법을 제공하지 않습니다. (예를 들어, 스토어에 컴포넌트를 연결하는 것) 만약 이전부터 React를 사용해왔다면, 이것을 해결하기 위해 [render porps](/docs/render-props.html) 그리고 [고차 컴포넌트]((/docs/higher-order-components.html))와 같은 패턴에 익숙할 것입니다. 그러나 이런 패턴을 사용할 때 컴포넌트를 재구성해야 하며 코드를 추적하기 어렵게 만듭니다. React 개발자 도구에서 전형적인 React 애플리케이션을 본다면, providers, consumers, 고차 컴포넌트, render props 그리고 다른 추상화에 대한 레이어로 둘러 싸인 "래퍼 지옥(wrapper hell)"을 볼 가능성이 높습니다. [개발자 도구에서 걸러낼 수 있지만](https://github.com/facebook/react-devtools/pull/503), 요점은 더 깊은 문제입니다. React는 상태 관련 로직을 공유하기 위해 좀 더 좋은 기초 요소가 필요합니다.

Hook를 사용하면 컴포넌트로부터 상태 관련 로직을 추상화할 수 있습니다. 이것은 독립적인 테스트와 재사용이 가능합니다. **Hook는 계층 변화 없이 상태 관련 로직을 재사용할 수 있도록 도와줍니다.** 이것은 많은 컴포넌트들 혹은 커뮤니티 사이에서 Hook를 공유하기 쉬워집니다.

우리는 [당신만의 Hook를 구축하는 법](/docs/hooks-custom.html)에 대해 좀 더 알아볼 것입니다.

### 복잡한 컴포넌트들은 이해하기 어렵습니다. {#complex-components-become-hard-to-understand}

우리는 때론 간단하게 시작했지만 유지하기 힘든 상태 관련 로직들과 사이드 이펙트가 있는 컴포넌트들을 유지해야합니다. 각 라이프사이클 메서드는 자주 관련 없는 로직이 섞여 있습니다. 예를 들어, 컴포넌트들은 `componentDidMount` 그리고 `componentDidUpdate`로 데이터를 가져오는 것을 수행할 수도 있습니다. 그러나, 같은 `componentDidMount` 메서드라도 이벤트 리스너를 설정하는 것과 같은 관계없는 일부 로직이 포함될 수도 있으며, `componentWillUnmount`에서 cleanup을 수행하기도 합니다. 함께 변경되는 상호 관련 코드는 분리되지만 완벽하게 연관 없는 코드들은 단일 메소드로 결합합니다. 이로 인해 버그와 무결성을 너무나 쉽게 발생합니다.

위와 같은 사례 안에서 상태 관련 로직이 모든 공간에 있기 때문에 이러한 컴포넌트들을 작게 만드는 것은 불가능합니다. 또한 테스트하기도 어렵습니다. 이것은 많은 사람이 React를 별도의 상태 관리 라이브러리와 함께 결합해서 사용하는 이유 중 하나입니다. 그러나, 상태 관리 라이브러리는 종종 너무 많은 추상화를 하고, 다른 파일들 사이에서 건너뛰기를 요구하며 컴포넌트 재사용을 더욱 어렵게 만듭니다.

이것을 해결하기 위해, 라이프사이클 메서드를 기반으로 쪼개는 데 초점을 맞추기 보다는, **Hook를 통해 로직에 기반을 둔 작은 함수로 컴포넌트를 나눌 수 있습니다. (구독 설정 및 데이터를 불러오는 것과 같은 로직)** 조금 더 예측 가능하도록 하기 위해 리듀서를 활용해 컴포넌트의 지역 상태 값을 관리하도록 할 수 있습니다.

나중에[Effect Hook](/docs/hooks-effect.html#tip-use-multiple-effects-to-separate-concerns)에서 더 알아볼 것입니다.

### Class은 사람과 기계를 혼동시킵니다. {#classes-confuse-both-people-and-machines}

Class가 코드의 재사용성과 코드 구성을 좀 더 어렵게 만들 뿐만 아니라, React를 배우는데 큰 진입장벽이라는 것을 알게 되었습니다. Javascript에서 어떻게 `this`가 작동하는지 알아야만 했고, 대부분의 다른 언어와는 다르게 작동합니다. 이벤트 핸들러가 등록되는 방법을 기억해야만 합니다. 불안정한 [문법 제안들](https://babeljs.io/docs/en/babel-plugin-transform-class-properties/)이 없다면, 코드는 매우 장황해집니다. 사람들은 props, state, 그리고 top-down 데이터 흐름을 완벽하게 이해할 수 있지만, 여전히 Class는 쉽지 않습니다. React 안에서의 함수와 Class 컴포넌트들을 구별하고 각 요소를 언제 사용하는지는 숙련된 React 개발자 사이에서도 의견이 일치하지 않습니다.

<<<<<<< HEAD
게다가, React는 5년 동안 지속하여 왔으며, 우리는 5년 뒤에도 이 관련성이 유지되기를 원합니다. 특별하게 템플릿에 제한을 두지 않는다면, [Svelte](https://svelte.technology/), [Angular](https://angular.io/), [Glimmer](https://glimmerjs.com/), [사전 컴파일 컴포넌트](https://en.wikipedia.org/wiki/Ahead-of-time_compilation)는 잠재적인 능력을 가지고 있습니다. 최근 [Prepack](https://prepack.io/)를 사용한 [컴포넌트 folding](https://github.com/facebook/react/issues/7323)에 대해서 실험해왔고, 긍정적인 결과를 보았습니다. 그러나, Class 컴포넌트가 이러한 최적화를 더 느린 경로로 되돌리는 의도하지 않은 패턴을 장려할 수 있다는 것을 발견했다. Class는 최근 사용되는 도구에도 많은 문제를 일으킵니다. 예를 들어 Class는 잘 축소되지 않고, 핫 리로딩을 깨지기 쉽고 신뢰할 수 없게 만듭니다. 우리는 코드가 최적화 가능한 경로에서 유지될 가능성이 더 높은 API를 제공하고 싶습니다.
=======
Additionally, React has been out for about five years, and we want to make sure it stays relevant in the next five years. As [Svelte](https://svelte.dev/), [Angular](https://angular.io/), [Glimmer](https://glimmerjs.com/), and others show, [ahead-of-time compilation](https://en.wikipedia.org/wiki/Ahead-of-time_compilation) of components has a lot of future potential. Especially if it's not limited to templates. Recently, we've been experimenting with [component folding](https://github.com/facebook/react/issues/7323) using [Prepack](https://prepack.io/), and we've seen promising early results. However, we found that class components can encourage unintentional patterns that make these optimizations fall back to a slower path. Classes present issues for today's tools, too. For example, classes don't minify very well, and they make hot reloading flaky and unreliable. We want to present an API that makes it more likely for code to stay on the optimizable path.
>>>>>>> 1f27bba9484f26ec6dab383b09730ad7ed59f732

이러한 문제를 해결하기 위해, **Hook는 Class없이 React 기능들을 사용하는 방법을 알려줍니다.** 개념적으로 React 컴포넌트는 항상 함수에 더 가깝습니다. Hook는 React의 정신을 희생하지 않고 함수를 받아들입니다. Hook는 명령형 코드로 해결책을 찾을 수 있게 해주며 복잡한 함수형 또는 반응형 프로그래밍 기술을 배우도록 요구하지 않습니다.

>예시
>
>[Hook 살펴보기](/docs/hooks-overview.html)는 Hook를 배우는데 좋은 공간입니다.

## 점진적 적용 전략 {#gradual-adoption-strategy}
>**요약: React로부터 Class를 제거할 계획은 없습니다.**

React 개발자들이 사용하는 API에 초점을 맞추고, 새롭게 출시되는 모든 API에 투자할 시간이 없다는 걸 알고 있습니다. Hook는 가장 최신 기술이며, 이것은 Hook를 배우길 고려하거나 적용하기 전에 많은 예시와 자습서를 기다리는 게 나을 수도 있습니다.

또한 React에 새로운 기능을 추가하는 기준이 매우 높다는 것을 알고 있습니다. 궁금해하는 독자들을 위해 동기부여에 대한 구체적인 내용을 담고 있는 [자세한 RFC](https://github.com/reactjs/rfcs/pull/68)를 준비했고 특정 설계 결정 및 관련 선행 기술에 대한 추가적인 관점을 제공합니다.

**결정적으로, Hook는 존재하는 코드와 함께 나란히 작동함으로써 점진적으로 적용할 수 있습니다.** Hook로 이동을 서두를 필요는 없습니다. 이미 존재하며 복잡한 Class 컴포넌트들에 대한 "큰 리팩토링"을 피하기를 권장합니다. 이것은 "Hook 안에서 생각해보기"를 시작하기에 앞서 마음가짐이 필요합니다. 우리의 경험을 토대로, 새롭고 중요하지 않은 컴포넌트들 안에서 Hook를 사용하는 것이 최고의 연습입니다. 그리고 당신의 모든 팀원이 Hook에 대해 안정감을 느끼는지 확인하는 게 좋습니다. Hook를 사용한 뒤에, 긍정적이든 부정적이든 상관없이 편하게 [의견 보내기](https://github.com/facebook/react/issues/new)를 이용해주시면 감사하겠습니다.

현재 존재하고 있는 모든 Class 사례을 변경하고 싶지만, **미래에도 계속 Class 컴포넌트들을 지원할 예정입니다.** 페이스북에서 수만 개의 Class 컴포넌트들을 작성했으며, 그들을 재작성할 계획이 전혀 없습니다. 대신에, 새로운 코드에서 기존 코드와 나란히 Hook를 사용할 계획입니다.

## 자주 묻는 질문 {#frequently-asked-questions}
[Hook FAQ 페이지](/docs/hooks-faq.html)를 준비했습니다. 그곳에서 Hook에 대한 모든 공통적인 답변을 받을 수 있습니다.

## 다음 단계 {#next-steps}
이 페이지가 끝에 이르렀을 때 Hook가 해결하려는 문제들에 대한 대략적인 아이디어를 가지고 있어야만 합니다. 그러나 아직 구체적으로 명확하진 않을 것입니다. 걱정하지 마세요! **[다음 페이지](/docs/hooks-overview.html)로 가서 예시를 통해서 Hook에 대해 배워 봅시다!**