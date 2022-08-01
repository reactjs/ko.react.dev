---
id: hooks-intro
title: Hook의 개요
permalink: docs/hooks-intro.html
next: hooks-overview.html
---

*Hook*은 React 버전 16.8부터 React 요소로 새로 추가되었습니다. Hook을 이용하여 기존 Class 바탕의 코드를 작성할 필요 없이 상태 값과 여러 React의 기능을 사용할 수 있습니다.
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

`useState`는 우리가 "Hook"에서 처음 배우게 될 함수입니다. 이 예시는 단지 맛보기에 불과합니다. 아직 이해되지 않아도 걱정하지 마세요!

**[다음 페이지](/docs/hooks-overview.html)에서 Hook에 대해 배울 수 있습니다.** 이 페이지에서는 우리가 왜 Hook을 React에 추가했는지, 그리고 Hook이 애플리케이션을 작성하는 데 어떠한 도움을 주는지 설명할 것입니다.

>주의
>
<<<<<<< HEAD
>React 16.8.0은 Hook을 지원하는 첫 번째 배포입니다. 업그레이드 시 React DOM을 포함한 모든 패키지의 업데이트를 진행해주세요.
>React Native는 [v0.59](https://reactnative.dev/blog/2019/03/12/releasing-react-native-059)부터 Hook을 지원합니다.
=======
>React 16.8.0 is the first release to support Hooks. When upgrading, don't forget to update all packages, including React DOM.
>React Native has supported Hooks since [the 0.59 release of React Native](https://reactnative.dev/blog/2019/03/12/releasing-react-native-059).
>>>>>>> 8223159395aae806f8602de35e6527d35260acfb

## 소개 영상 {#video-introduction}

React Conf 2018에서 Sophie Alpert와 Dan Abramov가 Hook을 소개했습니다. 이어서 Ryan Florence가 Hook을 사용한 애플리케이션 리팩토링의 과정을 보여주었습니다. 아래 영상에서 확인해보세요.
<br>

<iframe width="650" height="366" src="//www.youtube.com/embed/dpw9EHDh2bM" frameborder="0" allowfullscreen></iframe>

## 이미 작성된 코드에 필요한 변화사항은 없습니다. {#no-breaking-changes}

얘기하기에 앞서, Hook의 특징은 다음과 같습니다.

* **선택적 사용** 기존의 코드를 다시 작성할 필요 없이 일부의 컴포넌트들 안에서 Hook을 사용할 수 있습니다. 그러나 당장 Hook이 필요 없다면, Hook을 사용할 필요는 없습니다.
* **100% 이전 버전과의 호환성** Hook은 호환성을 깨뜨리는 변화가 없습니다.
* **현재 사용 가능** Hook은 배포 v16.8.0에서 사용할 수 있습니다.

**React에서 Class를 제거할 계획은 없습니다.** Hook의 점진적 적용 전략에 대해 [아래 영역](#gradual-adoption-strategy) 페이지에서 읽을 수 있습니다.

**Hook은 알고 있는 React 컨셉을 대체하지 않습니다.**
대신에, Hook은 props, state, context, refs, 그리고 lifecycle와 같은 React 개념에 좀 더 직관적인 API를 제공합니다. 또한 Hook은 이 개념들을 엮기 위해 새로운 강력한 방법을 제공합니다.

**단지 Hook에 대해 배우길 원한다면, [다음 페이지](/docs/hooks-overview.html)로 바로 이동해도 됩니다.** 또한 왜 우리가 Hook을 추가했는지, 그리고 어떻게 애플리케이션을 다시 작성할 필요 없이 어떻게 Hook을 이용하는지 알고 싶다면 이 페이지를 계속 읽을 필요가 있습니다.

## 동기 {#motivation}
Hook은 우리가 5년간 React로 컴포넌트를 작성하고 유지하는 동안 부딪혔던 수 많은 문제들을 해결했습니다. React를 배우는 중이든, 매일 사용하든, 심지어 비슷한 컴포넌트 모델과 함께 다른 라이브러리를 선호하든지 간에, 사용자는 이러한 문제를 인식해 왔을 것 입니다.

### 컴포넌트 사이에서 상태 로직을 재사용하기 어렵습니다. {#ts-hard-to-reuse-stateful-logic-between-components}

React는 컴포넌트간에 재사용 가능한 로직을 붙이는 방법을 제공하지 않습니다. (예를 들어, 스토어에 연결하는 것) 이전부터 React를 사용해왔다면, [render props](/docs/render-props.html)이나 [고차 컴포넌트](/docs/higher-order-components.html)와 같은 패턴을 통해 이러한 문제를 해결하는 방법에 익숙할 것입니다. 그러나 이런 패턴의 사용은 컴포넌트의 재구성을 강요하며, 코드의 추적을 어렵게 만듭니다. React 개발자 도구에서 React 애플리케이션을 본다면, providers, consumers, 고차 컴포넌트, render props 그리고 다른 추상화에 대한 레이어로 둘러싸인 "래퍼 지옥(wrapper hell)"을 볼 가능성이 높습니다. [개발자 도구에서 걸러낼 수 있지만](https://github.com/facebook/react-devtools/pull/503), 이 문제의 요점은 심층적이었습니다. React는 상태 관련 로직을 공유하기 위해 좀 더 좋은 기초 요소가 필요했습니다.

Hook을 사용하면 컴포넌트로부터 상태 관련 로직을 추상화할 수 있습니다. 이를 이용해 독립적인 테스트와 재사용이 가능합니다. **Hook은 계층의 변화 없이 상태 관련 로직을 재사용할 수 있도록 도와줍니다.** 이것은 많은 컴포넌트 혹은 커뮤니티 사이에서 Hook을 공유하기 쉽게 만들어줍니다.

우리는 [자신만의 Hook을 구축하는 법](/docs/hooks-custom.html)에 대해 좀 더 알아볼 것입니다.

### 복잡한 컴포넌트들은 이해하기 어렵습니다. {#complex-components-become-hard-to-understand}

우리는 때론 간단하게 시작했지만 관리하기가 힘들어지는 상태 관련 로직들과 사이드 이펙트가 있는 컴포넌트들을 유지보수해야 합니다. 각 생명주기 메서드에는 자주 관련 없는 로직이 섞여들어가고는 합니다. 예시로 `componentDidMount` 와 `componentDidUpdate`는 컴포넌트안에서 데이터를 가져오는 작업을 수행할 때 사용 되어야 하지만, 같은 `componentDidMount`에서 이벤트 리스너를 설정하는 것과 같은 관계없는 로직이 포함되기도 하며, `componentWillUnmount`에서 cleanup 로직을 수행하기도 합니다. 함께 변경되는 상호 관련 코드는 분리되지만 이와 연관 없는 코드들은 단일 메서드로 결합합니다. 이로 인해 버그가 쉽게 발생하고 무결성을 너무나 쉽게 해칩니다.

위와 같은 예시에서, 상태 관련 로직은 한 공간안에 묶여 있기 때문에 이런 컴포넌트들을 작게 분리하는 것은 불가능하며 테스트하기도 어렵습니다. 이 때문에 많은 사용자들은 React를 별도의 상태 관리 라이브러리와 함께 결합해서 사용해왔습니다. 그러나, 이런 상태 관리 라이브러리는 종종 너무 많은 추상화를 하고, 서로 다른 파일들 사이에서 건너뛰기를 요구하며 컴포넌트 재사용을 더욱더 어렵게 만들었습니다.

이같은 문제를 해결하기위해, 생명주기 메서드를 기반으로 쪼개는 것 보다는, **Hook을 통해 서로 비슷한 것을 하는 작은 함수의 묶음으로 컴포넌트를 나누는 방법을 사용할 수 있습니다. (구독 설정 및 데이터를 불러오는 것과 같은 로직)** 또한 이러한 로직의 추적을 쉽게 할 수 있도록 리듀서를 활용해 컴포넌트의 지역 상태 값을 관리하도록 할 수 있습니다.

이에 대해 [Effect Hook](/docs/hooks-effect.html#tip-use-multiple-effects-to-separate-concerns)에서 더 알아볼 것입니다.

### Class은 사람과 기계를 혼동시킵니다. {#classes-confuse-both-people-and-machines}

React 에서의 Class 사용을 위해서는 JavaScript의 `this` 키워드가 어떻게 작동하는지 알아야만 합니다.  JavaScript의 `this`키워드는 대부분의 다른 언어에서와는 다르게 작동함으로 사용자에게 큰 혼란을 주었으며, 코드의 재사용성과 구성을 매우 어렵게 만들고는 했습니다. 또한 class의 사용을 위해 이벤트 핸들러가 등록되는 방법을 정확히 파악해야 했으며, 이는 불안정한 [문법 제안들](https://babeljs.io/docs/en/babel-plugin-transform-class-properties/)의 도움이 없을 시엔, 코드를 매우 장황하게 만들었습니다. 사용자들은 props, state, 그리고 top-down 데이터 흐름을 완벽하게 하고도, Class의 이해에는 어려움을 겪고는 했습니다. React 내의 함수와 Class 컴포넌트의 구별, 각 요소의 사용 타이밍 등은 숙련된 React 개발자 사이에서도 의견이 일치하지 않습니다.

<<<<<<< HEAD
React는 지난 5년 동안 널리 사용되어 왔으며, React의 개발진은 5년 뒤에도 React가 지금과 같이 널리 이용되길 원합니다. [Svelte](https://svelte.dev/), [Angular](https://angular.io/), [Glimmer](https://glimmerjs.com/) 등에서 보여주듯이, 컴포넌트를 [미리 컴파일해놓는 방식](https://en.wikipedia.org/wiki/Ahead-of-time_compilation)에는 높은 잠재력이 있습니다. 템플릿에 한정하지 않는다면 더 그렇고요. 개발진은 최근 [Prepack](https://prepack.io/)을 사용한 [컴포넌트 folding](https://github.com/facebook/react/issues/7323)에 대해서 실험해왔고 긍정적인 결과를 보았습니만, Class 컴포넌트가 이러한 최적화를 더 느린 경로로 되돌리는 의도하지 않은 패턴을 장려할 수 있다는 것을 발견했습니다. Class는 최근 사용되는 도구에서도 많은 문제를 일으킵니다. 예를 들어 Class는 코드의 최소화를 힘들게 만들고, 핫 리로딩을 깨지기 쉽고 신뢰할 수 없게 만듭니다. 우리는 코드가 최적화 가능한 경로에서 유지될 가능성이 더 높은 API를 제공하길 원하였습니다.
=======
In addition to making code reuse and code organization more difficult, we've found that classes can be a large barrier to learning React. You have to understand how `this` works in JavaScript, which is very different from how it works in most languages. You have to remember to bind the event handlers. Without [ES2022 public class fields](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Public_class_fields#public_instance_fields), the code is very verbose. People can understand props, state, and top-down data flow perfectly well but still struggle with classes. The distinction between function and class components in React and when to use each one leads to disagreements even between experienced React developers.
>>>>>>> 8223159395aae806f8602de35e6527d35260acfb

이러한 문제를 해결하기 위해, **Hook은 Class없이 React 기능들을 사용하는 방법을 제시합니다.** 개념적으로 React 컴포넌트는 항상 함수에 더 가깝습니다. Hook은 React의 정신을 희생하지 않고 함수의 사용을 권장합니다. Hook은 명령형 코드로 해결책을 찾을 수 있게 해주며 복잡한 함수형 또는 반응형 프로그래밍 기술을 배우도록 요구하지 않습니다.

>예시
>
>[Hook 살펴보기](/docs/hooks-overview.html)는 Hook을 배우는데 좋은 공간입니다.

## 점진적 적용 전략 {#gradual-adoption-strategy}
>**요약: React로부터 Class를 제거할 계획은 없습니다.**

우리는 React를 사용하는 개발자들이 프로덕트의 개발에 더 초점을 맞추고 있으며, 변경되는 API의 요소들을 새롭게 공부할 시간이 없다는 걸 알고 있습니다. Hook은 매우 새로운 기술이며, Hook을 배우거나 적용하기 전에 더 많은 예시와 자습서를 기다리는 게 나을 수도 있습니다.

또한 React에 추가되는 새로운 기능에 대한 기준점이 매우 높다는 것을 알고 있습니다. 궁금해하는 독자들을 위해 동기부여에 대한 구체적인 내용을 담고 있는 [자세한 RFC](https://github.com/reactjs/rfcs/pull/68)를 준비했고 특정 설계 결정 및 관련 선행 기술에 대한 추가적인 관점을 제공합니다.

<<<<<<< HEAD
**결정적으로, Hook은 존재하는 코드와 함께 나란히 작동함으로써 점진적으로 적용할 수 있습니다.** Hook의 적용을 서두를 필요는 없습니다. 이미 사용중인 복잡한 Class 컴포넌트들에 대한 "큰 리팩토링"을 피하기를 권장합니다. "Hook을 적용하기"에는 고민의 시간이 필요합니다. 경험을 토대로 하여, 상대적으로 중요성이 덜한 새 컴포넌트에서 Hook을 사용하는 것이 최고의 연습입니다. 그리고 여러분의 모든 팀원이 Hook에 대해 안정감을 느끼는지 확인하는 게 좋습니다. Hook을 이용 후, 긍정적, 부정적 의견 모두 [의견 보내기](https://github.com/facebook/react/issues/new)를 이용해 보내주시면 감사하겠습니다.
=======
We also understand that the bar for adding a new primitive to React is extremely high. For curious readers, we have prepared a [detailed RFC](https://github.com/reactjs/rfcs/pull/68) that dives into the motivation with more details, and provides extra perspective on the specific design decisions and related prior art.
>>>>>>> 8223159395aae806f8602de35e6527d35260acfb

React의 개발자들은 현재 사용중인 Class 사례를 Hook으로 교체하는 것을 염두에 두고는 있지만, **미래에도 계속 Class 컴포넌트들을 지원할 예정입니다.** 페이스북은 수만 개의 Class 컴포넌트들을 작성했지만 이를 재작성할 계획은 없습니다. 대신에, 새로운 코드에서 기존 코드와 나란히 Hook을 사용할 계획입니다.

## 자주 묻는 질문 {#frequently-asked-questions}
[Hook FAQ 페이지](/docs/hooks-faq.html)에서 Hook에 대한 자주 묻는 질문과 답변을 확인할 수 있습니다.

## 다음 단계 {#next-steps}
이 페이지를 다 읽었을 때, Hook이 해결하려는 문제들에 대한 대략적인 개념을 이해하고 있어야 합니다. 그러나 아직 구체적으로 명확하진 않을 것입니다. 걱정하지 마세요! **[다음 페이지](/docs/hooks-overview.html)로 가서 예시를 통해서 Hook에 대해 배워 봅시다!**
