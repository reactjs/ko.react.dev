---
id: concurrent-mode-adoption
title: Concurrent 모드 도입하기 (실험 단계)
permalink: docs/concurrent-mode-adoption.html
prev: concurrent-mode-patterns.html
next: concurrent-mode-reference.html
---

<style>
.scary > blockquote {
  background-color: rgba(237, 51, 21, 0.2);
  border-left-color: #ed3315;
}
</style>

<div class="scary">

>주의
>
>이 페이지는 **안정된 배포판에서 아직 제공되지 않는 실험적인 기능들**에 대해 설명합니다. 프로덕션용 앱에선 React 실험 배포판을 사용하지 마세요. 이러한 기능들은 React의 일부가 되기 전에 아무 예고 없이 상당히 변경될 수 있습니다.
>
>이 문서는 얼리 어답터와 궁금해하시는 분을 대상으로 합니다. **React를 처음 쓰신다면 이 기능들에 대해 신경 쓰지 마세요.** 당장 익힐 필요는 없습니다.

</div>

- [설치하기](#installation)
  - [실험 배포판은 누구를 위한 걸까요?](#who-is-this-experimental-release-for)
  - [Concurrent 모드 활성화하기](#enabling-concurrent-mode)
- [무엇을 기대해야 할까요?](#what-to-expect)
  - [마이그레이션 단계: Blocking 모드](#migration-step-blocking-mode)
  - [왜 여러 모드가 필요할까요?](#why-so-many-modes)
  - [기능 비교](#feature-comparison)

## 설치하기 {#installation}

Concurrent 모드는 React [실험 배포판](/blog/2019/10/22/react-release-channels.html#experimental-channel)에서만 사용 가능합니다. 설치하려면 다음을 실행하세요.

```
npm install react@experimental react-dom@experimental
```

**실험 배포판에는 시맨틱 버저닝이 보장되지 않습니다.**
`@experimental` 배포판에는 언제든지 API가 추가, 변경, 삭제될 수 있습니다.

**실험 배포판에는 호환되지 않는 변경사항이 종종 발생합니다.**

이런 배포판을 개인 프로젝트나 브랜치에서 사용하는 것은 상관없지만, 프로덕션 환경에서 실행하는 것은 권장하지 않습니다. Facebook에서는 프로덕션 환경에서 사용하고 있긴 하지만, 문제가 발생했을 때 버그를 잡을 수 있도록 대기하고 있기 때문에 가능한 일입니다. 경고를 명심하세요!

### 실험 배포판은 누구를 위한 걸까요? {#who-is-this-experimental-release-for}

이 배포판은 얼리 어댑터, 라이브러리 제작자, 궁금해하는 사람들을 주요 대상으로 합니다.

저희는 프로덕션 환경에서 이 코드를 잘 사용 중이지만, 아직 버그가 남아있고, 기능이 부족하며, 문서도 빈약합니다. Concurrent 모드가 제대로 동작하지 않는 경우에 대해 좀 더 귀 기울여서 추후에 있을 공식 배포를 더욱 잘 준비하고자 합니다.

### Concurrent 모드 활성화하기 {#enabling-concurrent-mode}

보통, React에 기능이 추가될 땐 즉시 사용 가능합니다. Fragments, Context, Hooks 등이 그러한 예죠. 기존 코드를 전혀 수정하지 않고도 새 코드에서 사용할 수 있습니다.

Concurrent 모드는 다릅니다. React가 동작하는 방식에 시맨틱 한 차이가 생겼죠. 이런 차이 없이는, [신기능들](/docs/concurrent-mode-patterns.html)은 가능하지 않았을 겁니다. 따라서, 개별적으로 독립 배포되지 않고 하나의 새로운 "모드"로 그룹화 되었습니다.

하위 트리 단위로 Concurrent 모드를 선택할 수는 없습니다. 대신에 `ReactDOM.render()`를 호출하는 부분에서 선택해야 합니다.

**이 코드는 전체 `<App />` 트리에 대해 Concurrent 모드를 활성화합니다.**

```js
import ReactDOM from 'react-dom';

// 기존 코드가 다음과 같았다면,
//
// ReactDOM.render(<App />, document.getElementById('root'));
//
// 다음과 같이 작성하여 Concurrent 모드를 선택할 수 있습니다.

ReactDOM.unstable_createRoot(
  document.getElementById('root')
).render(<App />);
```

>주의
>
>`createRoot`와 같은 Concurrent 모드 API는 React의 실험 배포판에만 존재합니다.

Concurrent 모드에서는 "unsafe"라고 [기존에 표시된](/blog/2018/03/27/update-on-async-rendering.html) 생명주기 메서드가 현재 React 버전에서보다도 더 많은 버그를 야기할 수 있습니다. 앱이 [Strict 모드](/docs/strict-mode.html)와 호환되기 전까지 Concurrent 모드를 시도하는 걸 권장하지 않습니다.

## 무엇을 기대해야 할까요? {#what-to-expect}

큰 규모의 앱이거나 많은 수의 서드 파티 패키지에 의존하고 있는 앱이라면 Concurrent 모드를 바로 사용할 수 있을 거라 섣불리 판단하기는 어렵습니다. **예로, Facebook에선 신규 웹사이트에 Concurrent 모드를 사용 중이지만, 기존 웹사이트에는 적용할 계획이 없습니다.** 기존 웹사이트는 안전하지 않은 생명주기 메서드와, 호환되지 않는 서드 파티 라이브러리, 그리고 Concurrent 모드와 잘 동작하지 않는 패턴들을 사용하고 있기 때문이죠.

저희 경험에 의하면, 자주 사용되는 React 패턴들을 사용하면서 외부 상태 관리 솔루션에 기대지 않는 코드가 가장 쉽게 Concurrent 모드로 실행됩니다. 수 주 이내로 흔히 발생하는 문제점과 해결방안을 별도로 설명할 계획입니다.

### 마이그레이션 단계: Blocking 모드 {#migration-step-blocking-mode}

오래된 코드베이스의 경우, Concurrent 모드는 너무 앞서나간 것일 수 있습니다. 그래서 React 실험 배포판에선 새로운 "Blocking 모드"를 제공하고 있죠. `createRoot`을 `createBlockingRoot`로 바꿔주는 것으로 실행해 볼 수 있습니다. 비록 Concurrent 모드의 기능 중 *작은 일부*만을 제공하지만, 현재 React 동작 구조에 가깝기 때문에 마이그레이션 단계로서 역할을 다 할 수 있습니다.

정리하면,

* **Legacy 모드** `ReactDOM.render(<App />, rootNode)`. 현재 React 앱들이 사용하고 있는 모드입니다. 아직 가까운 미래에 Legacy 모드를 없앨 계획은 없지만, 신규 기능들을 사용할 수는 없을 겁니다.
* **Blocking 모드** `ReactDOM.createBlockingRoot(rootNode).render(<App />)`. 현재 실험 중인 상태입니다. Concurrent 모드의 일부 기능을 제공할 수 있는 첫 번째 마이그레이션 단계입니다.
* **Concurrent 모드** `ReactDOM.createRoot(rootNode).render(<App />)`. 현재 실험 중인 상태입니다. 안정된 후엔 React 기본 모드로 만들 예정입니다. 이 모드에선 *모든* 신규 기능을 사용할 수 있습니다.

### 왜 여러 모드가 필요할까요? {#why-so-many-modes}

저희는 호환되지 않는 큰 변화를 가져오거나 React가 침체하도록 나두는 것보다 [점진적인 마이그레이션 전략](/docs/faq-versioning.html#commitment-to-stability)을 제공하는 게 낫다고 생각합니다.

현재 Legacy 모드를 사용하는 대부분의 앱이 Concurrent 모드까지는 아니더라도 적어도 Blocking 모드로는 마이그레이션이 가능할 것이라 생각합니다. 단기적으로 이러한 파편화는 모든 모드를 지원하고자 하는 라이브러리엔 귀찮을 수 있습니다. 하지만 점진적으로 Legacy 모드에서 벗어나는 것이 [레이아웃을 읽을 때의 혼란스러운 Suspense 동작](https://github.com/facebook/react/issues/14536)과 [일관된 배칭 보장의 부족](https://github.com/facebook/react/issues/15080)과 같이, 현재 React 생태계의 주요 라이브러리들이 겪고 있는 문제들을 해결해 줄 수 있습니다. 시맨틱 변화 없이 Legacy 모드에서 수정될 수 없는 버그이지만 Blocking이나 Concurrent 모드에선 존재하지 않는 경우가 여럿 있습니다.

Blocking 모드를 Concurrent 모드의 "우아한 성능 저하" 버전이라고 생각할 수 있습니다. **장기적으로는 모두 수렴되어서 여러 모드에 대해 생각할 필요가 없어질 겁니다.** 하지만 지금의 여러 모드는 마이그레이션을 위한 중요한 전략입니다. 사람들이 스스로 마이그레이션 할 가치가 있는지 판단할 수 있고, 각자의 상황에 맞춰 업그레이드 할 수 있습니다.

### 기능 비교 {#feature-comparison}

<style>
  #feature-table table { border-collapse: collapse; }
  #feature-table th { padding-right: 30px; }
  #feature-table tr { border-bottom: 1px solid #eee; }
</style>

<div id="feature-table">

|   |Legacy 모드  |Blocking 모드  |Concurrent 모드  |
|---  |---  |---  |---  |
|[문자열 Refs](/docs/refs-and-the-dom.html#legacy-api-string-refs)  |✅  |🚫**  |🚫**  |
|[레거시 Context](/docs/legacy-context.html) |✅  |🚫**  |🚫**  |
|[findDOMNode](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)  |✅  |🚫**  |🚫**  |
|[Suspense](/docs/concurrent-mode-suspense.html#what-is-suspense-exactly) |✅  |✅  |✅  |
|[SuspenseList](/docs/concurrent-mode-patterns.html#suspenselist) |🚫  |✅  |✅  |
|Suspense SSR + Hydration |🚫  |✅  |✅  |
|Progressive Hydration  |🚫  |✅  |✅  |
|Selective Hydration  |🚫  |🚫  |✅  |
|Cooperative 멀티태스킹 |🚫  |🚫  |✅  |
|다수의 setState의 자동 배칭     |🚫* |✅  |✅  |
|[우선순위 기반 렌더링](/docs/concurrent-mode-patterns.html#splitting-high-and-low-priority-state) |🚫  |🚫  |✅  |
|[중단 가능한 Pre-렌더링](/docs/concurrent-mode-intro.html#interruptible-rendering) |🚫  |🚫  |✅  |
|[useTransition](/docs/concurrent-mode-patterns.html#transitions)  |🚫  |🚫  |✅  |
|[useDeferredValue](/docs/concurrent-mode-patterns.html#deferring-a-value) |🚫  |🚫  |✅  |
|[Suspense Reveal "Train"](/docs/concurrent-mode-patterns.html#suspense-reveal-train)  |🚫  |🚫  |✅  |

</div>

\*: Legacy 모드도 React가 관리하는 이벤트의 자동 배칭 기능을 가지고 있지만, 하나의 브라우저 태스크에 국한됩니다. 비 React 이벤트는 `unstable_batchedUpdates`를 사용해야만 합니다. Blocking 모드와 Concurrent 모드에서는 모든 `setState`가 디폴트로 배치됩니다.

\*\*: 개발 환경에서 경고가 표시됩니다.
