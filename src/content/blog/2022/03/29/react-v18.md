---
title: "React v18.0"
---

2022년 3월 29일, [The React Team](/community/team)

---

<Intro>

이제 npm에서 React 18을 사용할 수 있습니다! 지난 포스팅에서는 앱을 [React 18로 업그레이드하는 방법](/blog/2022/03/08/react-18-upgrade-guide)을 단계별로 공유했습니다. 이번 포스팅에서는 React 18의 새로운 기능과 미래에 어떤 의미를 갖는지에 대해 설명하겠습니다.

</Intro>

---

최신 메이저 버전에는 자동 batching, startTransition과 같은 새로운 API, Suspense를 지원하는 스트리밍 서버 사이드 렌더링과 같은 즉각적인 개선 사항이 포함되어 있습니다. 

React 18의 많은 기능은 강력한 새 기능들을 제공하는 배후의 변경 사항인 concurrent 렌더러를 기반으로 구축되었습니다. concurrent 렌더러는 선택 사항으로, concurrent 기능을 사용할 때만 활성화할 수 있지만 사람들이 애플리케이션을 빌드하는 방식에 큰 영향을 미칠 것으로 예상됩니다.

우리는 수년간 React의 동시성(concurrency) 지원을 연구하고 개발해 왔으며, 기존 사용자가 점진적으로 채택할 수 있도록 각별히 신경을 썼습니다. 지난 여름에는 커뮤니티의 전문가들로부터 피드백을 수집하고 전체 React 생태계를 위한 원활한 업그레이드 환경을 보장하기 위해 [React 18 Working Group](/blog/2021/06/08/the-plan-for-react-18)을 구성했습니다.

놓치신 분들을 위해 React Conf 2021에서 많은 부분을 공유했습니다.

* [이 연설]((https://www.youtube.com/watch?v=FZ0cG47msEk&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa))에서는 개발자들이 훌륭한 사용자 경험을 쉽게 구축할 수 있도록 돕는 우리의 임무에 React 18이 어떻게 부합하는지 설명했습니다.
* [Shruti Kapoor](https://twitter.com/shrutikapoor08)가 [React 18의 새로운 기능을 사용하는 방법을 시연](https://www.youtube.com/watch?v=ytudH8je5ko&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa&index=2)했습니다.
* [Shaundai Person](https://twitter.com/shaundai)이 [Suspense를 사용한 스트리밍 서버 렌더링](https://www.youtube.com/watch?v=pj5N-Khihgc&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa&index=3)에 대한 개요를 설명했습니다.

다음은 Concurrent 렌더링부터 시작하여 이번 릴리스에서 기대할 수 있는 기능에 대한 전체 개요입니다.

<Note>

React Native 사용자를 위해 React 18은 새로운 React Native 아키텍처와 함께 React Native로 제공될 예정입니다. 자세한 내용은 [React Conf 키노트](https://www.youtube.com/watch?v=FZ0cG47msEk&t=1530s)를 확인하세요.

</Note>

## React의 Concurrent이란? {/*what-is-concurrent-react*/}

React 18에서 가장 중요한 추가 사항은 여러분이 결코 생각할 필요가 없기를 바라는 것, 바로 동시성(concurrency)입니다. 라이브러리 관리자에게는 조금 더 복잡할 수 있지만 애플리케이션 개발자에게는 대체로 해당하는 이야기라고 생각합니다.

Concurrency 자체는 기능이 아닙니다. React가 동시에 여러 버전의 UI를 준비할 수 있게 해주는 새로운 비하인드 메커니즘입니다. Concurrency는 구현의 세부 사항으로 생각할 수 있으며, concurrency가 제공하는 기능 때문에 가치가 있습니다. React는 내부 구현에서 우선순위 큐와 다중 버퍼링과 같은 정교한 기술을 사용합니다. 하지만 우리의 공개 API에서는 이러한 개념을 찾아볼 수 없습니다.

API를 설계할 때 우리는 개발자에게 구현 세부 사항을 숨기려고 노력합니다. React 개발자는 사용자 경험을 *어떤 모습(what)* 으로 만들 것인지에 집중하고, React는 그 경험을 *어떻게(how)* 전달할 것인지를 처리합니다. 따라서 React 개발자가 내부에서 concurrency가 어떻게 작동하는지 알기를 기대하지 않습니다.

그러나 Concurrent React는 일반적인 구현 세부 사항보다 더 중요합니다. 이것이 React의 핵심 렌더링 모델에 대한 근본적인 업데이트이기 때문입니다. 따라서 concurrency가 어떻게 작동하는지 아는 것이 엄청나게 중요하지는 않지만, 높은 수준에서 concurrency가 무엇인지 아는 것은 가치가 있을 수 있습니다.

Concurrent React의 핵심은 렌더링이 중단되지 않는다는 것입니다. React 18로 처음 업그레이드할 때 concurrent 기능을 추가하기 전 업데이트는 이전 버전의 React와 동일하게 중단되지 않는 단일 동기식 트랜잭션으로 렌더링 됩니다. 동기식 렌더링의 경우 업데이트가 렌더링을 시작하면 사용자가 화면에서 결과를 볼 수 있을 때까지 그 어떤 것도 렌더링을 방해할 수 없습니다.

Concurrent 렌더링에서는 항상 그렇지는 않습니다. React는 업데이트된 렌더링을 시작하고 중간에 일시 중지했다가 나중에 계속할 수 있습니다. 심지어 진행 중인 렌더링을 완전히 중단할 수도 있습니다. React는 렌더링이 중단되더라도 UI가 일관되게 표시되도록 보장합니다. 이를 위해 트리 전체가 평가된 후 DOM 변형을 수행하기 위해 기다립니다. 이 기능을 통해 React는 메인 스레드를 차단하지 않고 백그라운드에서 새 화면을 준비할 수 있습니다. 즉, UI가 대규모 렌더링 작업 중에도 사용자 입력에 즉시 반응하여 유동적인 사용자 경험을 제공할 수 있습니다.

또 다른 예는 재사용 가능한 상태입니다. Concurrent React는 화면에서 UI의 섹션을 제거했다가 나중에 다시 추가하면서 이전 상태를 재사용할 수 있습니다. 예를 들어 사용자가 화면에서 벗어나 뒤로 탭 할 때, React는 화면을 이전과 동일한 상태로 복원할 수 있어야 합니다. 곧 출시될 마이너 버전에서는 이 패턴을 구현하는 `<Offscreen>`이라는 새로운 컴포넌트를 추가할 계획입니다. 마찬가지로 Offscreen을 사용하여 사용자가 보기 전에 백그라운드에서 새 UI를 준비할 수 있게 될 것입니다.

Concurrent 렌더링은 React의 강력한 새 도구이며 Suspense, Transitions, 스트리밍 서버 렌더링 등 대부분의 새로운 기능이 이를 활용하기 위해 만들어졌습니다. 하지만 React 18은 우리가 이 새로운 기반 위에 구축하고자 하는 목표의 시작일 뿐입니다.

## 점진적으로 Concurrent 기능 적용하기 {/*gradually-adopting-concurrent-features*/}

기술적으로 concurrent 렌더링은 획기적인 변화입니다. Concurrent 렌더링은 중단이 가능하기 때문에 이 기능을 활성화하면 컴포넌트가 약간 다르게 동작합니다.

저희는 테스트에서 수천 개의 컴포넌트를 React 18로 업그레이드했습니다. 그 결과 거의 모든 기존 컴포넌트가 concurrent 렌더링과 함께 변경 없이 "그냥 작동"한다는 사실을 발견했습니다. 하지만 일부 컴포넌트는 추가적인 마이그레이션 작업이 필요할 수 있습니다. 일반적으로 변경 사항은 크지 않지만, 사용자가 원하는 속도에 맞춰 변경할 수 있습니다. React 18의 새로운 렌더링 동작은 **여러분의 앱에서 새로운 기능을 사용하는 부분에서만 활성화됩니다**.

전반적인 업그레이드 전략은 기존 코드를 훼손하지 않고 애플리케이션을 React 18에서 실행하는 것입니다. 그런 다음 자신의 속도에 맞춰 점진적으로 concurrent 기능을 추가하기 시작할 수 있습니다. 개발 중에 concurrency 관련 버그를 발견하는 데 도움이 되는 [`<StrictMode>`](/reference/react/StrictMode)를 사용할 수 있습니다. Strict 모드는 프로덕션 동작에는 영향을 미치지 않지만, 개발 중에 추가 경고를 기록하고 비활성화될 것으로 예상되는 함수를 이중 호출합니다. 모든 것을 잡아내지는 못하지만 가장 일반적인 유형의 실수를 방지하는 데 효과적입니다.

React 18로 업그레이드하면 즉시 concurrent 기능을 사용할 수 있습니다. 예를 들어 startTransition을 사용하여 사용자 입력을 차단하지 않고 화면 사이를 탐색할 수 있습니다. 또는 비용이 많이 드는 리렌더링을 스로틀링하기 위해 useDeferredValue를 사용할 수 있습니다.

하지만 장기적으로는 앱에 concurrency를 추가하는 주된 방법은 concurrency 지원 라이브러리 또는 프레임워크를 사용하는 것입니다. 대부분의 경우 concurrent API와 직접 상호 작용하지는 않을 것입니다. 예를 들어 개발자가 새 화면으로 이동할 때마다 startTransition을 호출하는 대신, 라우터 라이브러리가 자동으로 startTransition에 내비게이션을 래핑합니다.

라이브러리가 concurrent와 호환이 가능하도록 업그레이드하는 데 다소 시간이 걸릴 수 있습니다. 우리는 라이브러리에서 concurrent 기능을 더 쉽게 활용할 수 있도록 새로운 API를 제공했습니다. 메인테이너들이 React 에코시스템을 점진적으로 마이그레이션하기 위해 노력하는 동안 인내심을 가져주세요.

더 자세한 내용은 이전 게시물을 참조하세요. [React 18로 업그레이드하는 방법](/blog/2022/03/08/react-18-upgrade-guide).

## 데이터 프레임워크의 Suspense {/*suspense-in-data-frameworks*/}

React 18에서는 Relay, Next.js, Hydrogen 또는 Remix와 같은 고유한 프레임워크에서 데이터를 불러오기 위해 [Suspense](/reference/react/Suspense)를 사용할 수 있습니다. Suspense를 사용한 Ad hoc 데이터 불러오기는 기술적으로 가능하지만, 일반적인 전략으로 권장되지는 않습니다.

향후에는 이런 프레임워크를 사용하지 않고도 Suspense로 데이터에 더 쉽게 액세스할 수 있는 추가 기본 요소를 노출할 수 있습니다. 하지만 Suspense는 라우터, 데이터 레이어, 서버 렌더링 환경 등 애플리케이션의 아키텍처에 깊이 통합되어 있을 때 가장 잘 작동합니다. 따라서 장기적으로도 라이브러리와 프레임워크가 React 생태계에서 중요한 역할을 할 것으로 예상됩니다.

이전 버전의 React에서와 마찬가지로, 클라이언트에서 코드 분할을 위해 Suspense를 React.lazy와 함께 사용할 수도 있습니다. 하지만 Suspense에 대한 우리의 비전은 항상 코드 로딩 그 이상이었습니다. 결국에는 Suspense에 대한 지원을 확장하여, 동일한 선언적 Suspense fallback이 모든 비동기 작업(코드, 데이터, 이미지 등의 로딩)을 처리할 수 있도록 하는 것이 목표입니다.


## 서버 컴포넌트는 아직 개발 중입니다. {/*server-components-is-still-in-development*/}

[**서버 컴포넌트**](/blog/2020/12/21/data-fetching-with-react-server-components)는 개발자가 클라이언트 측 앱의 풍부한 상호작용과 기존 서버 렌더링의 향상된 성능을 결합하여 서버와 클라이언트를 아우르는 앱을 구축할 수 있게 해주는 곧 출시될 기능입니다. 서버 컴포넌트는 본질적으로 Concurrent React와 결합하여 있지는 않지만, Suspense 및 스트리밍 서버 렌더링과 같은 concurrent 기능에 가장 잘 작동하도록 설계되었습니다.

서버 컴포넌트는 아직 실험 단계이지만 18.x 마이너 릴리스에서 초기 버전을 출시할 예정입니다. 그동안에는 이 제안을 발전시키고 광범위한 채택을 준비하기 위해 Next.js, Hydrogen, Remix와 같은 프레임워크와 협력하고 있습니다.

## React 18의 새로운 기능 {/*whats-new-in-react-18*/}

### 새로운 기능: 자동 Batching {/*new-feature-automatic-batching*/}

Batching은 React가 성능 향상을 위해 여러 state 업데이트를 하나의 리렌더링으로 그룹화하는 것입니다. 자동 batching이 없으면 우리는 React 이벤트 핸들러 내부의 업데이트만 batch 했습니다. Promises, setTimeout, 네이티브 이벤트 핸들러 또는 기타 이벤트 내부의 업데이트는 기본적으로 React에서 batch 되지 않았습니다. 자동 Batching을 사용하면 이러한 업데이트가 자동으로 batch 됩니다.

```js
// 변경 전: 오직 React 이벤트만 batch 됩니다.
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React는 각 state 업데이트마다 한 번씩, 총 두 번 렌더링 됩니다. (batching 아님)
}, 1000);

// 변경 후: timeouts, promises 내에서도 업데이트할 수 있습니다.
// 네이티브 이벤트 핸들러 또는 다른 이벤트들이 batch 됩니다.
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React는 마지막에 한 번만 다시 렌더링 됩니다. (batching!)
}, 1000);
```

더 자세한 내용은 [Automatic batching for fewer renders in React 18](https://github.com/reactwg/react-18/discussions/21)을 참조하세요.

### 새로운 기능: Transitions {/*new-feature-transitions*/}

Transition은 긴급 업데이트와 비긴급 업데이트를 구분하기 위한 React의 새로운 개념입니다.

* **긴급 업데이트**는 입력, 클릭, 누르기 등과 같은 직접적인 상호작용을 반영합니다.
* **Transition 업데이트**는 UI를 한 화면에서 다른 화면으로 전환합니다.


입력, 클릭, 누르기 등의 긴급한 업데이트는 실제 사물의 동작 방식에 대한 우리의 직관과 일치하도록 즉각적인 반응이 필요합니다. 그렇지 않으면 "잘못됐다"고 느끼기 때문입니다. 그러나 transition은 사용자가 화면에 모든 중간값을 볼 것으로 기대하지 않기 때문에 다릅니다.

예를 들어, 드롭다운에서 필터를 선택하면 클릭 즉시 필터 버튼 자체가 반응할 것으로 기대합니다. 그러나 실제 결과는 별도로 전환될 수 있습니다. 약간의 지연은 눈에 띄지 않고 종종 예상되는 일입니다. 또한 결과가 렌더링 되기 전에 필터를 다시 변경하면 오직 최신 결과만 볼 수 있습니다.

일반적으로 최상의 사용자 경험을 위해서는 한 번의 사용자 입력으로 긴급한 업데이트와 긴급하지 않은 업데이트가 모두 이루어져야 합니다. 입력 이벤트 내에서 startTransition API를 사용하여 어떤 업데이트가 긴급한지, 어떤 업데이트가 "transition"인지 React에 알릴 수 있습니다.

```js
import { startTransition } from 'react';

// 긴급: Urgent: 입력한 내용 표시
setInputValue(input);

// 내부의 모든 state 업데이트를 transition으로 표시
startTransition(() => {
  // Transition: 결과 표시
  setSearchQuery(input);
});
```

startTransition으로 래핑된 업데이트는 긴급하지 않은 것으로 처리되며 클릭이나 키 누름과 같은 더 긴급한 업데이트가 들어올 경우 중단됩니다. 사용자가 여러 문자를 연속해서 입력하는 등의 이유로 transition이 중단되면 React는 완료되지 않은 오래된 렌더링 작업을 버리고 최신 업데이트만 렌더링합니다.

* `useTransition`: 보류 중인(pending) state를 추적하는 값을 포함하여 transition을 시작하는 hook.
* `startTransition`: hook을 사용할 수 없을 때 transition을 시작하는 메서드.

transition은 concurrent 렌더링을 선택하여 업데이트를 중단할 수 있습니다. 콘텐츠가 다시 일시 중단되면, transition은 백그라운드에서 transition 콘텐츠를 렌더링하는 동안 현재 콘텐츠를 계속 표시하도록 React에 지시합니다. (자세한 내용은 [Suspense RFC](https://github.com/reactjs/rfcs/blob/main/text/0213-suspense-in-react-18.md)를 참고하세요.)

[Transitions 참고 문서](/reference/react/useTransition)

### 새로운 Suspense 기능들 {/*new-suspense-features*/}

Suspense를 사용하면 컴포넌트 트리의 일부가 아직 표시될 준비가 되지 않은 경우 로딩 state를 선언적으로 지정할 수 있습니다.

```js
<Suspense fallback={<Spinner />}>
  <Comments />
</Suspense>
```

Suspense는 "UI 로딩 상태"를 React 프로그래밍 모델에서 1급 선언적 개념으로 만듭니다. 이를 통해 그 위에 더 높은 수준의 기능을 구축할 수 있습니다.

우리는 몇 년 전에 Suspense의 제한된 버전을 도입했습니다. 하지만 지원되는 사용 사례는 React.lazy를 사용한 코드 분할뿐이었으며 서버에서 렌더링할 때는 전혀 지원되지 않았습니다.

React 18에서는 서버에서 Suspense에 대한 지원을 추가하고 concurrent 렌더링 기능을 사용하여 기능을 확장했습니다.

React 18의 Suspense는 transition API와 함께 사용할 때 가장 잘 작동합니다. transition 도중 일시 중단하면, React는 이미 표시된 콘텐츠가 fallback으로 대체되는 것을 방지합니다. 대신 React는 충분한 데이터가 로드될 때까지 렌더링을 지연시켜 로딩 상태가 나빠지는 것을 방지합니다.

[Suspense in React 18 참고 문서](https://github.com/reactjs/rfcs/blob/main/text/0213-suspense-in-react-18.md)

### 새로운 클라이언트 및 서버 렌더링 API들 {/*new-client-and-server-rendering-apis*/}

이번 릴리스에서는 클라이언트와 서버에서 렌더링을 위해 노출하는 API를 재설계할 기회를 가졌습니다. 이러한 변경을 통해 사용자는 React 18의 새로운 API로 업그레이드하는 동안 React 17 모드에서 이전 API를 계속 사용할 수 있습니다.

#### React DOM 클라이언트 {/*react-dom-client*/}

이 새로운 API는 이제 `react-dom/client`에서 내보내집니다.

* `createRoot`: `렌더링` 또는 `unmount`에 루트를 생성하는 새로운 메서드. `ReactDOM.render` 대신 사용하세요. 이 함수가 없으면 React 18의 새로운 기능들이 작동하지 않습니다.
* `hydrateRoot`: 서버 렌더링된 애플리케이션을 hydrate하는 새로운 메서드. 새로운 React DOM 서버 API와 함께 `ReactDOM.hydrate` 대신 사용하세요. 이 메서드가 없으면 React 18의 새로운 기능이 작동하지 않습니다.

`createRoot`와 `hydrateRoot`는 모두 렌더링 중 오류가 발생하거나 로깅을 위한 hydration 중 오류가 발생했을 때 알림을 받고자 하는 경우 `onRecoverableError`라는 새로운 옵션을 허용합니다. 기본적으로 React는 [`reportError`](https://developer.mozilla.org/en-US/docs/Web/API/reportError) 또는 오래된 브라우저에서는 `console.error`를 사용합니다.

[React DOM 클라이언트 참고 문서](/reference/react-dom/client)

#### React DOM 서버 {/*react-dom-server*/}

이 새로운 API는 이제 `react-dom/server`에서 내보내지며 서버에서 Suspense를 스트리밍하는 데 완벽하게 지원됩니다.

* `renderToPipeableStream`: Node 환경에서의 스트리밍용.
* `renderToReadableStream`: 최신 엣지 런타임 환경(예: Deno 및 Cloudflare 워커)에서의 스트리밍용.

기존의 `renderToString` 메서드는 계속 작동하지만 권장하지 않습니다.

[React DOM 서버 참고 문서](/reference/react-dom/server)

### 새로운 Strict 모드 동작들 {/*new-strict-mode-behaviors*/}

앞으로는 리액트가 state를 유지하면서 UI의 섹션을 추가하고 제거할 수 있는 기능을 추가하고 싶습니다. 예를 들어 사용자가 화면에서 벗어나 뒤로 탭 할 때 React는 이전 화면을 즉시 표시할 수 있어야 합니다. 이를 위해 리액트는 이전과 동일한 컴포넌트 state를 사용하여 트리를 마운트 해제하고 다시 마운트합니다.

이 기능을 사용하면 React 앱의 성능이 즉시 향상되지만, 컴포넌트가 effect가 여러 번 마운트 및 소멸하는 것에 대해 탄력적이어야 합니다. 대부분의 effect는 변경 없이 작동하지만 일부 effect는 한 번만 마운트되거나 소멸한다고 가정합니다.

이러한 문제를 해결하기 위해 React 18은 Strict 모드에 새로운 개발 전용 검사를 도입했습니다. 이 새로운 검사는 컴포넌트가 처음 마운트될 때마다 모든 컴포넌트를 자동으로 마운트 해제하고 다시 마운트하여 두 번째 마운트 시 이전 state로 복원합니다.

이 변경 전에는 React가 컴포넌트를 마운트하고 effect를 생성했습니다.

```
* React가 컴포넌트를 마운트합니다.
  * 레이아웃 effect가 생성됩니다.
  * Effect가 생성됩니다.
```

React 18의 Strict 모드에서는 개발 모드에서 컴포넌트를 마운트 해제하고 다시 마운트하는 것을 시뮬레이션합니다.

```
* React가 컴포넌트를 마운트합니다.
  * 레이아웃 effect가 생성됩니다.
  * Effect가 생성됩니다.
* React가 컴포넌트 마운트 해제를 시뮬레이션합니다.
  * 레이아웃 effect가 소멸합니다.
  * Effect가 소멸합니다.
* React가 컴포넌트를 이전 상태로 마운트하는 것을 시뮬레이션합니다.
  * 레이아웃 effect가 생성됩니다.
  * Effect가 생성됩니다.
```

[여기에서 재사용할 수 있는 state 보장에 대한 문서를 참조하세요](/reference/react/StrictMode#fixing-bugs-found-by-re-running-effects-in-development).

### 새로운 Hooks {/*new-hooks*/}

#### useId {/*useid*/}

`useId`는 hydration 불일치를 방지하면서 클라이언트와 서버 모두에서 고유 ID를 생성하기 위한 새로운 hook입니다. 주로 고유 ID가 필요한 접근성 API와 통합되는 컴포넌트 라이브러리에 유용합니다. 이는 React 17 이하에서 이미 존재하던 문제를 해결하지만, 새로운 스트리밍 서버 렌더러가 HTML을 순서대로 전달하지 않기 때문에 React 18에서는 더욱 중요합니다. [참고 문서](/reference/react/useId)

> 주의
>
> `useId`는 [목록에서 key](/learn/rendering-lists#where-to-get-your-key)를 생성하기 위한 것이 *아닙니다*. Key는 여러분의 데이터에서 생성해야 합니다.

#### useTransition {/*usetransition*/}

`useTransition`과 `startTransition`으로 일부 state 업데이트를 긴급하지 않은 것으로 표시할 수 있습니다. 다른 state 업데이트는 기본적으로 긴급한 것으로 간주합니다. React는 긴급한 state 업데이트(예: 텍스트 input 업데이트)가 긴급하지 않은 state 업데이트(예: 검색 결과 목록 렌더링)를 중단할 수 있도록 합니다. [참고 문서](/reference/react/useTransition)

#### useDeferredValue {/*usedeferredvalue*/}

`useDeferredValue`를 사용하면 트리에서 긴급하지 않은 부분의 리렌더링을 지연(deferred)시킬 수 있습니다. 디바운싱과 비슷하지만 디바운싱에 비해 몇 가지 장점이 있습니다. 고정된 시간 지연이 없기 때문에 React는 첫 번째 렌더링이 화면에 반영된 직후에 deferred 렌더링을 시도합니다. deferred 렌더링은 중단할 수 있으며 사용자 입력을 차단하지 않습니다. [참고 문서](/reference/react/useDeferredValue)

#### useSyncExternalStore {/*usesyncexternalstore*/}

`useSyncExternalStore`는 스토어에 대한 업데이트를 강제로 동기화하여 외부 스토어가 동시 읽기를 지원할 수 있도록 하는 새로운 hook입니다. 이 hook은 외부 데이터에 대한 구독을 구현할 때 useEffect가 필요하지 않으며, React 외부 state와 통합하는 모든 라이브러리에 권장됩니다. [참고 문서](/reference/react/useSyncExternalStore)

> 주의
>
> `useSyncExternalStore`는 애플리케이션 코드가 아닌 라이브러리에서 사용하기 위한 것입니다.

#### useInsertionEffect {/*useinsertioneffect*/}

`useInsertionEffect`는 CSS-in-JS 라이브러리가 렌더링에서 스타일을 삽입할 때 발생하는 성능 문제를 해결할 수 있는 새로운 hook입니다. 이미 CSS-in-JS 라이브러리를 빌드한 경우가 아니라면 이 hook을 사용할 일은 없을 것으로 예상됩니다. 이 hook은 DOM이 변경된 후에 실행되지만, 레이아웃 effects가 새 레이아웃을 읽기 전에 실행됩니다. 이는 React 17 이하에서 이미 존재하던 문제를 해결하지만, React 18에서는 concurrent 렌더링 중에 브라우저가 레이아웃을 다시 계산할 기회를 제공하기 때문에 더욱 중요합니다. [참고 문서](/reference/react/useInsertionEffect)

> 주의
>
> `useInsertionEffect` 는 애플리케이션 코드가 아닌 라이브러리에서 사용하기 위한 것입니다.

## 업그레이드하는 방법 {/*how-to-upgrade*/}

단계별 지침과 주요 주목할 만한 변경 사항 목록은 [React 18로 업그레이드하는 방법](/blog/2022/03/08/react-18-upgrade-guide)을 참고하세요.

## Changelog {/*changelog*/}

### React {/*react*/}

* Add `useTransition` and `useDeferredValue` to separate urgent updates from transitions. ([#10426](https://github.com/facebook/react/pull/10426), [#10715](https://github.com/facebook/react/pull/10715), [#15593](https://github.com/facebook/react/pull/15593), [#15272](https://github.com/facebook/react/pull/15272), [#15578](https://github.com/facebook/react/pull/15578), [#15769](https://github.com/facebook/react/pull/15769), [#17058](https://github.com/facebook/react/pull/17058), [#18796](https://github.com/facebook/react/pull/18796), [#19121](https://github.com/facebook/react/pull/19121), [#19703](https://github.com/facebook/react/pull/19703), [#19719](https://github.com/facebook/react/pull/19719), [#19724](https://github.com/facebook/react/pull/19724), [#20672](https://github.com/facebook/react/pull/20672), [#20976](https://github.com/facebook/react/pull/20976) by [@acdlite](https://github.com/acdlite), [@lunaruan](https://github.com/lunaruan), [@rickhanlonii](https://github.com/rickhanlonii), and [@sebmarkbage](https://github.com/sebmarkbage))
* Add `useId` for generating unique IDs. ([#17322](https://github.com/facebook/react/pull/17322), [#18576](https://github.com/facebook/react/pull/18576), [#22644](https://github.com/facebook/react/pull/22644), [#22672](https://github.com/facebook/react/pull/22672), [#21260](https://github.com/facebook/react/pull/21260) by [@acdlite](https://github.com/acdlite), [@lunaruan](https://github.com/lunaruan), and [@sebmarkbage](https://github.com/sebmarkbage))
* Add `useSyncExternalStore` to help external store libraries integrate with React. ([#15022](https://github.com/facebook/react/pull/15022), [#18000](https://github.com/facebook/react/pull/18000), [#18771](https://github.com/facebook/react/pull/18771), [#22211](https://github.com/facebook/react/pull/22211), [#22292](https://github.com/facebook/react/pull/22292), [#22239](https://github.com/facebook/react/pull/22239), [#22347](https://github.com/facebook/react/pull/22347), [#23150](https://github.com/facebook/react/pull/23150) by [@acdlite](https://github.com/acdlite), [@bvaughn](https://github.com/bvaughn), and [@drarmstr](https://github.com/drarmstr))
* Add `startTransition` as a version of `useTransition` without pending feedback. ([#19696](https://github.com/facebook/react/pull/19696)  by [@rickhanlonii](https://github.com/rickhanlonii))
* Add `useInsertionEffect` for CSS-in-JS libraries. ([#21913](https://github.com/facebook/react/pull/21913)  by [@rickhanlonii](https://github.com/rickhanlonii))
* Make Suspense remount layout effects when content reappears.  ([#19322](https://github.com/facebook/react/pull/19322), [#19374](https://github.com/facebook/react/pull/19374), [#19523](https://github.com/facebook/react/pull/19523), [#20625](https://github.com/facebook/react/pull/20625), [#21079](https://github.com/facebook/react/pull/21079) by [@acdlite](https://github.com/acdlite), [@bvaughn](https://github.com/bvaughn), and [@lunaruan](https://github.com/lunaruan))
* Make `<StrictMode>` re-run effects to check for restorable state. ([#19523](https://github.com/facebook/react/pull/19523) , [#21418](https://github.com/facebook/react/pull/21418)  by [@bvaughn](https://github.com/bvaughn) and [@lunaruan](https://github.com/lunaruan))
* Assume Symbols are always available. ([#23348](https://github.com/facebook/react/pull/23348)  by [@sebmarkbage](https://github.com/sebmarkbage))
* Remove `object-assign` polyfill. ([#23351](https://github.com/facebook/react/pull/23351)  by [@sebmarkbage](https://github.com/sebmarkbage))
* Remove unsupported `unstable_changedBits` API.  ([#20953](https://github.com/facebook/react/pull/20953)  by [@acdlite](https://github.com/acdlite))
* Allow components to render undefined. ([#21869](https://github.com/facebook/react/pull/21869)  by [@rickhanlonii](https://github.com/rickhanlonii))
* Flush `useEffect` resulting from discrete events like clicks synchronously. ([#21150](https://github.com/facebook/react/pull/21150)  by [@acdlite](https://github.com/acdlite))
* Suspense `fallback={undefined}` now behaves the same as `null` and isn't ignored. ([#21854](https://github.com/facebook/react/pull/21854)  by [@rickhanlonii](https://github.com/rickhanlonii))
* Consider all `lazy()` resolving to the same component equivalent. ([#20357](https://github.com/facebook/react/pull/20357)  by [@sebmarkbage](https://github.com/sebmarkbage))
* Don't patch console during first render. ([#22308](https://github.com/facebook/react/pull/22308)  by [@lunaruan](https://github.com/lunaruan))
* Improve memory usage. ([#21039](https://github.com/facebook/react/pull/21039)  by [@bgirard](https://github.com/bgirard))
* Improve messages if string coercion throws (Temporal.*, Symbol, etc.) ([#22064](https://github.com/facebook/react/pull/22064)  by [@justingrant](https://github.com/justingrant))
* Use `setImmediate` when available over `MessageChannel`. ([#20834](https://github.com/facebook/react/pull/20834)  by [@gaearon](https://github.com/gaearon))
* Fix context failing to propagate inside suspended trees. ([#23095](https://github.com/facebook/react/pull/23095)  by [@gaearon](https://github.com/gaearon))
* Fix `useReducer` observing incorrect props by removing the eager bailout mechanism. ([#22445](https://github.com/facebook/react/pull/22445)  by [@josephsavona](https://github.com/josephsavona))
* Fix `setState` being ignored in Safari when appending iframes. ([#23111](https://github.com/facebook/react/pull/23111)  by [@gaearon](https://github.com/gaearon))
* Fix a crash when rendering `ZonedDateTime` in the tree. ([#20617](https://github.com/facebook/react/pull/20617)  by [@dimaqq](https://github.com/dimaqq))
* Fix a crash when document is set to `null` in tests. ([#22695](https://github.com/facebook/react/pull/22695)  by [@SimenB](https://github.com/SimenB))
* Fix `onLoad` not triggering when concurrent features are on. ([#23316](https://github.com/facebook/react/pull/23316)  by [@gnoff](https://github.com/gnoff))
* Fix a warning when a selector returns `NaN`.  ([#23333](https://github.com/facebook/react/pull/23333)  by [@hachibeeDI](https://github.com/hachibeeDI))
* Fix a crash when document is set to `null` in tests. ([#22695](https://github.com/facebook/react/pull/22695) by [@SimenB](https://github.com/SimenB))
* Fix the generated license header. ([#23004](https://github.com/facebook/react/pull/23004)  by [@vitaliemiron](https://github.com/vitaliemiron))
* Add `package.json` as one of the entry points. ([#22954](https://github.com/facebook/react/pull/22954)  by [@Jack](https://github.com/Jack-Works))
* Allow suspending outside a Suspense boundary. ([#23267](https://github.com/facebook/react/pull/23267)  by [@acdlite](https://github.com/acdlite))
* Log a recoverable error whenever hydration fails. ([#23319](https://github.com/facebook/react/pull/23319)  by [@acdlite](https://github.com/acdlite))

### React DOM {/*react-dom*/}

* Add `createRoot` and `hydrateRoot`. ([#10239](https://github.com/facebook/react/pull/10239), [#11225](https://github.com/facebook/react/pull/11225), [#12117](https://github.com/facebook/react/pull/12117), [#13732](https://github.com/facebook/react/pull/13732), [#15502](https://github.com/facebook/react/pull/15502), [#15532](https://github.com/facebook/react/pull/15532), [#17035](https://github.com/facebook/react/pull/17035), [#17165](https://github.com/facebook/react/pull/17165), [#20669](https://github.com/facebook/react/pull/20669), [#20748](https://github.com/facebook/react/pull/20748), [#20888](https://github.com/facebook/react/pull/20888), [#21072](https://github.com/facebook/react/pull/21072), [#21417](https://github.com/facebook/react/pull/21417), [#21652](https://github.com/facebook/react/pull/21652), [#21687](https://github.com/facebook/react/pull/21687), [#23207](https://github.com/facebook/react/pull/23207), [#23385](https://github.com/facebook/react/pull/23385) by [@acdlite](https://github.com/acdlite), [@bvaughn](https://github.com/bvaughn), [@gaearon](https://github.com/gaearon), [@lunaruan](https://github.com/lunaruan), [@rickhanlonii](https://github.com/rickhanlonii), [@trueadm](https://github.com/trueadm), and [@sebmarkbage](https://github.com/sebmarkbage))
* Add selective hydration. ([#14717](https://github.com/facebook/react/pull/14717), [#14884](https://github.com/facebook/react/pull/14884), [#16725](https://github.com/facebook/react/pull/16725), [#16880](https://github.com/facebook/react/pull/16880), [#17004](https://github.com/facebook/react/pull/17004), [#22416](https://github.com/facebook/react/pull/22416), [#22629](https://github.com/facebook/react/pull/22629), [#22448](https://github.com/facebook/react/pull/22448), [#22856](https://github.com/facebook/react/pull/22856), [#23176](https://github.com/facebook/react/pull/23176) by [@acdlite](https://github.com/acdlite), [@gaearon](https://github.com/gaearon), [@salazarm](https://github.com/salazarm), and [@sebmarkbage](https://github.com/sebmarkbage))
* Add `aria-description` to the list of known ARIA attributes. ([#22142](https://github.com/facebook/react/pull/22142)  by [@mahyareb](https://github.com/mahyareb))
* Add `onResize` event to video elements. ([#21973](https://github.com/facebook/react/pull/21973)  by [@rileyjshaw](https://github.com/rileyjshaw))
* Add `imageSizes` and `imageSrcSet` to known props. ([#22550](https://github.com/facebook/react/pull/22550)  by [@eps1lon](https://github.com/eps1lon))
* Allow non-string `<option>` children if `value` is provided.  ([#21431](https://github.com/facebook/react/pull/21431)  by [@sebmarkbage](https://github.com/sebmarkbage))
* Fix `aspectRatio` style not being applied. ([#21100](https://github.com/facebook/react/pull/21100)  by [@gaearon](https://github.com/gaearon))
* Warn if `renderSubtreeIntoContainer` is called. ([#23355](https://github.com/facebook/react/pull/23355)  by [@acdlite](https://github.com/acdlite))

### React DOM Server {/*react-dom-server-1*/}

* Add the new streaming renderer. ([#14144](https://github.com/facebook/react/pull/14144), [#20970](https://github.com/facebook/react/pull/20970), [#21056](https://github.com/facebook/react/pull/21056), [#21255](https://github.com/facebook/react/pull/21255), [#21200](https://github.com/facebook/react/pull/21200), [#21257](https://github.com/facebook/react/pull/21257), [#21276](https://github.com/facebook/react/pull/21276), [#22443](https://github.com/facebook/react/pull/22443), [#22450](https://github.com/facebook/react/pull/22450), [#23247](https://github.com/facebook/react/pull/23247), [#24025](https://github.com/facebook/react/pull/24025), [#24030](https://github.com/facebook/react/pull/24030) by [@sebmarkbage](https://github.com/sebmarkbage))
* Fix context providers in SSR when handling multiple requests. ([#23171](https://github.com/facebook/react/pull/23171)  by [@frandiox](https://github.com/frandiox))
* Revert to client render on text mismatch. ([#23354](https://github.com/facebook/react/pull/23354)  by [@acdlite](https://github.com/acdlite))
* Deprecate `renderToNodeStream`. ([#23359](https://github.com/facebook/react/pull/23359)  by [@sebmarkbage](https://github.com/sebmarkbage))
* Fix a spurious error log in the new server renderer. ([#24043](https://github.com/facebook/react/pull/24043)  by [@eps1lon](https://github.com/eps1lon))
* Fix a bug in the new server renderer. ([#22617](https://github.com/facebook/react/pull/22617)  by [@shuding](https://github.com/shuding))
* Ignore function and symbol values inside custom elements on the server. ([#21157](https://github.com/facebook/react/pull/21157)  by [@sebmarkbage](https://github.com/sebmarkbage))

### React DOM Test Utils {/*react-dom-test-utils*/}

* Throw when `act` is used in production. ([#21686](https://github.com/facebook/react/pull/21686)  by [@acdlite](https://github.com/acdlite))
* Support disabling spurious act warnings with `global.IS_REACT_ACT_ENVIRONMENT`. ([#22561](https://github.com/facebook/react/pull/22561)  by [@acdlite](https://github.com/acdlite))
* Expand act warning to cover all APIs that might schedule React work. ([#22607](https://github.com/facebook/react/pull/22607)  by [@acdlite](https://github.com/acdlite))
* Make `act` batch updates. ([#21797](https://github.com/facebook/react/pull/21797)  by [@acdlite](https://github.com/acdlite))
* Remove warning for dangling passive effects. ([#22609](https://github.com/facebook/react/pull/22609)  by [@acdlite](https://github.com/acdlite))

### React Refresh {/*react-refresh*/}

* Track late-mounted roots in Fast Refresh. ([#22740](https://github.com/facebook/react/pull/22740)  by [@anc95](https://github.com/anc95))
* Add `exports` field to `package.json`. ([#23087](https://github.com/facebook/react/pull/23087)  by [@otakustay](https://github.com/otakustay))

### Server Components (Experimental) {/*server-components-experimental*/}

* Add Server Context support. ([#23244](https://github.com/facebook/react/pull/23244)  by [@salazarm](https://github.com/salazarm))
* Add `lazy` support. ([#24068](https://github.com/facebook/react/pull/24068)  by [@gnoff](https://github.com/gnoff))
* Update webpack plugin for webpack 5 ([#22739](https://github.com/facebook/react/pull/22739)  by [@michenly](https://github.com/michenly))
* Fix a mistake in the Node loader. ([#22537](https://github.com/facebook/react/pull/22537)  by [@btea](https://github.com/btea))
* Use `globalThis` instead of `window` for edge environments. ([#22777](https://github.com/facebook/react/pull/22777)  by [@huozhi](https://github.com/huozhi))

