---
id: hooks-faq
title: Hook 자주 묻는 질문
permalink: docs/hooks-faq.html
prev: hooks-reference.html
---

*Hook*은 React 16.8에 새로 추가되었습니다. Class를 작성하지 않고 state 및 기타 React 기능을 사용할 수 있습니다.

이 페이지는 [Hook](/docs/hooks-overview.html) 자주 묻는 질문에 대한 답변입니다.

<!--
  if you ever need to regenerate this, this snippet in the devtools console might help:

  $$('.anchor').map(a =>
    `${' '.repeat(2 * +a.parentNode.nodeName.slice(1))}` +
    `[${a.parentNode.textContent}](${a.getAttribute('href')})`
  ).join('\n')
-->

* **[적용 전략](#adoption-strategy)**
  * [어떤 버전의 React가 Hook을 포함합니까?](#which-versions-of-react-include-hooks)
  * [모든 class 컴포넌트를 다시 작성해야 합니까?](#do-i-need-to-rewrite-all-my-class-components)
  * [Class로 하지 못하는 것 중에 Hook으로 가능한 것이 무엇인가요?](#what-can-i-do-with-hooks-that-i-couldnt-with-classes)
  * [React 지식은 얼마나 관련이 있습니까?](#how-much-of-my-react-knowledge-stays-relevant)
  * [Hook이나 class 또는 두 가지를 모두 사용해야 합니까?](#should-i-use-hooks-classes-or-a-mix-of-both)
  * [Hook이 class의 모든 사용 사례를 커버합니까?](#do-hooks-cover-all-use-cases-for-classes)
  * [Hook이 render props 및 고차 컴포넌트를 대체합니까?](#do-hooks-replace-render-props-and-higher-order-components)
  * [Redux connect()와 React Router와 같은 인기 있는 API에 대해 Hook은 무엇을 의미합니까?](#what-do-hooks-mean-for-popular-apis-like-redux-connect-and-react-router)
  * [Hook은 정적 타이핑과 함께 작동합니까?](#do-hooks-work-with-static-typing)
  * [Hook을 사용하는 컴포넌트 테스트하는 방법?](#how-to-test-components-that-use-hooks)
  * [Lint 규칙은 정확히 무엇을 시행합니까?](#what-exactly-do-the-lint-rules-enforce)
* **[Class에서 Hook으로](#from-classes-to-hooks)**
  * [생명주기 메서드가 Hook에 어떻게 대응합니까?](#how-do-lifecycle-methods-correspond-to-hooks)
  * [Hook을 사용하여 데이터 가져오기를 수행하려면 어떻게 해야 합니까?](#how-can-i-do-data-fetching-with-hooks)
  * [인스턴스 변수와 같은 것이 있습니까?](#is-there-something-like-instance-variables)
  * [하나 또는 여러 state 변수를 사용해야 합니까?](#should-i-use-one-or-many-state-variables)
  * [업데이트에만 effect를 실행할 수 있습니까?](#can-i-run-an-effect-only-on-updates)
  * [이전 props 또는 state를 얻는 방법?](#how-to-get-the-previous-props-or-state)
  * [함수 컴포넌트 안에 오래된 props나 state가 보이는 이유는 무엇입니까?](#why-am-i-seeing-stale-props-or-state-inside-my-function)
  * [getDerivedStateFromProps를 어떻게 구현합니까?](#how-do-i-implement-getderivedstatefromprops)
  * [forceUpdate와 같은 것이 있습니까?](#is-there-something-like-forceupdate)
  * [함수 컴포넌트에 ref를 만들 수 있습니까?](#can-i-make-a-ref-to-a-function-component)
  * [DOM 노드를 측정하려면 어떻게 해야 합니까?](#how-can-i-measure-a-dom-node)
  * [const [thing, setThing] = useState()는 무엇을 의미합니까?](#what-does-const-thing-setthing--usestate-mean)
* **[성능 최적화](#performance-optimizations)**
  * [업데이트 시 effect를 건너뛸 수 있습니까?](#can-i-skip-an-effect-on-updates)
  * [종속성 목록에서 함수 컴포넌트를 생략하는 것이 안전합니까?](#is-it-safe-to-omit-functions-from-the-list-of-dependencies)
  * [effect 종속성이 너무 자주 변경되면 어떻게 해야 합니까?](#what-can-i-do-if-my-effect-dependencies-change-too-often)
  * [shouldComponentUpdate는 어떻게 구현합니까?](#how-do-i-implement-shouldcomponentupdate)
  * [계산을 메모이제이션 하는 법?](#how-to-memoize-calculations)
  * [고비용의 객체를 지연해서 생성하는 법?](#how-to-create-expensive-objects-lazily)
  * [렌더링에서 함수 컴포넌트를 만들기 때문에 Hook이 느려집니까?](#are-hooks-slow-because-of-creating-functions-in-render)
  * [콜백 전달을 피하는 법?](#how-to-avoid-passing-callbacks-down)
  * [useCallback에서 자주 변경되는 값을 읽는 방법?](#how-to-read-an-often-changing-value-from-usecallback)
* **[Hook의 이면](#under-the-hood)**
  * [React는 Hook 호출을 컴포넌트와 어떻게 연관시키는가?](#how-does-react-associate-hook-calls-with-components)
  * [Hook에 대한 선행 기술은 무엇입니까?](#what-is-the-prior-art-for-hooks)

## 적용 전략 {#adoption-strategy}

### 어떤 버전의 React가 Hook을 포함합니까? {#which-versions-of-react-include-hooks}

16.8.0부터 React에는 React Hook의 안정적인 구현이 포함됩니다.

* React DOM
* React Native
* React DOM Server
* React 테스트 렌더러
* React 얕은 렌더러

**Hook을 사용하려면 모든 React 패키지가 16.8.0 이상이어야합니다**. 업데이트하는 것을 (예: React DOM) 잊어버리면 Hook이 작동하지 않습니다.

[React Native 0.59](https://reactnative.dev/blog/2019/03/12/releasing-react-native-059) 이상은 Hook을 지원합니다.

### 모든 class 컴포넌트를 다시 작성해야 합니까? {#do-i-need-to-rewrite-all-my-class-components}

아닙니다. React에서 class를 삭제할 [계획은 없습니다](/docs/hooks-intro.html#gradual-adoption-strategy). 우리는 제품을 출시할 때마다 재작성을 할 여유가 없습니다. 새 코드에서 Hook을 사용하는 것이 좋습니다.

### Class로 하지 못하는 것 중에 Hook으로 가능한 것이 무엇인가요? {#what-can-i-do-with-hooks-that-i-couldnt-with-classes}

Hook은 컴포넌트 간에 기능을 재사용할 수 있는 강력하고 표현적인 새로운 방법을 제공합니다. ["자신만의 Hook 만들기"](/docs/hooks-custom.html)는 가능한 것을 엿볼 수 있게 해줍니다. React 핵심 팀 구성원이 작성한 [이 기사](https://medium.com/@dan_abramov/making-sense-of-react-hooks-fdbde8803889)에서는 Hook이 제공할 새로운 기능에 대해 자세히 설명합니다.

### React 지식은 얼마나 관련이 있습니까? {#how-much-of-my-react-knowledge-stays-relevant}

Hook은 state, 생명주기, context 및 ref와 같은 이미 알고 있는 React 기능을 사용하는 보다 직접적인 방법입니다. React가 어떻게 작동하는지 근본적으로 바꿀 수 없으며 컴포넌트, props 및 하향식 데이터 흐름에 대한 지식도 마찬가지로 중요합니다.

Hook에는 독자적인 학습 곡선이 있습니다. 이 문서에 누락된 것이 있으면 [문제를 제기](https://github.com/reactjs/reactjs.org/issues/new)하면 도움을 제공해 드리겠습니다.

### Hook이나 class 또는 두 가지를 모두 사용해야 합니까? {#should-i-use-hooks-classes-or-a-mix-of-both}

준비가 되면 작성하는 새 컴포넌트에서 Hook을 시도해 보는 것이 좋습니다. 팀의 모든 구성원이 사용하고 이 문서에 익숙한지 확인해주세요. 일부러 다시 작성하지 않는 이상 (예: 버그 수정) 기존 class를 Hook으로 고쳐 쓰는 것은 추천하지 않습니다.

Class 컴포넌트 *내부에서* Hook을 사용할 수는 없지만, class와 함수 컴포넌트를 단일 트리에서 Hook과 섞어서 사용할 수 있습니다. 컴포넌트가 class인지 Hook을 사용하는 함수 컴포넌트인지 여부는 해당 컴포넌트의 구현 세부 사항입니다. 장기적으로 우리는 Hook이 사람들이 React 컴포넌트를 작성하는 주요 방법이 될 것으로 기대합니다.

### Hook이 class의 모든 사용 사례를 커버합니까? {#do-hooks-cover-all-use-cases-for-classes}

우리의 목표는 Hook이 class의 모든 사용 사례를 가능한 한 빨리 커버하게 하는 것입니다. 드문 `getSnapshotBeforeUpdate`, `getDerivedStateFromError` 및 `componentDidCatch` 생명주기에 해당하는 Hook은 아직 없지만, 곧 추가할 계획입니다.

<<<<<<< HEAD
Hook의 초기 단계이며 일부 타사 라이브러리는 현재 Hook과 호환되지 않을 수 있습니다.

### Hook이 render props 및 고차 컴포넌트를 대체합니까? {#do-hooks-replace-render-props-and-higher-order-components}
=======
### Do Hooks replace render props and higher-order components? {#do-hooks-replace-render-props-and-higher-order-components}
>>>>>>> 1d21630e126af0f4c04ff392934dcee80fc54892

종종 render props와 고차 컴포넌트는 하나의 자식만 렌더링합니다. 우리는 Hook이 이 사용 사례를 처리하는 더 간단한 방법이라고 생각합니다. 여전히 두 패턴 모두를 쓸 수 있습니다. (예를 들어, 가상 스크롤러 컴포넌트에는 `renderItem` props가 있거나 시각적 컨테이너 컴포넌트에는 자체 DOM 구조가 있을 수 있습니다) 그러나 대부분의 경우 Hook은 충분하며 코드 트리의 중첩을 줄이는 데 도움이 될 수 있습니다.

### Redux connect()와 React Router와 같은 인기 있는 API에 대해 Hook은 무엇을 의미합니까? {#what-do-hooks-mean-for-popular-apis-like-redux-connect-and-react-router}

여태껏 쓰던 API를 계속 사용할 수 있습니다; 앞으로도 계속 작동할 것 입니다.

v7.1.0부터 React Redux는 [Hook API를 지원하고](https://react-redux.js.org/api/hooks) `useDispatch` 또는 `useSelector`와 같은 Hook을 노출합니다.

v5.1 이후 React Router는 [Hook을 지원합니다](https://reacttraining.com/react-router/web/api/Hooks).

다른 라이브러리도 나중에 Hook을 지원할 수 있습니다.

### Hook은 정적 타이핑과 함께 작동합니까? {#do-hooks-work-with-static-typing}

Hook은 정적 타이핑을 염두에 두고 설계되었습니다. 함수 컴포넌트이기 때문에 고차 컴포넌트와 같은 패턴보다 타입을 명시하기가 더 쉽습니다. 최신 Flow 및 TypeScript React 정의에는 React Hook 지원이 포함됩니다.

중요한 점은, 커스텀 Hook은 더 엄격하게 타이핑하려는 경우 React API를 제한할 수 있는 기능을 제공합니다. React는 기초 요소를 제공하지만, 기본 제공 방식과 다른 방식으로 조합 할 수 있습니다.

### Hook을 사용하는 컴포넌트 테스트하는 방법? {#how-to-test-components-that-use-hooks}

React의 관점에서 Hook을 사용하는 컴포넌트는 일반적인 컴포넌트입니다. 테스트 솔루션이 React internals에 종속하지 않는 경우 Hook이 있는 컴포넌트 테스트는 일반적으로 컴포넌트를 테스트하는 방법과 다르지 않아야 합니다.

>주의
>
>[테스팅 방안](/docs/testing-recipes.html)에는 복사하여 붙여넣을 수 있는 많은 예시가 포함되어 있습니다.

예를 들어 여기 이 계수기 컴포넌트가 있다고 가정해 보겠습니다.

```js
function Example() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });
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

React DOM을 사용하여 테스트하겠습니다. 브라우저에서 발생하는 상황과 동작이 일치하도록 코드 렌더링을 래핑하고 이를 [`ReactTestUtils.act()`](/docs/test-utils.html#act) 호출로 업데이트합니다.

```js{3,20-22,29-31}
import React from 'react';
import ReactDOM from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import Counter from './Counter';

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it('can render and update a counter', () => {
  // 첫 번째 렌더링 및 effect 테스트
  act(() => {
    ReactDOM.createRoot(container).render(<Counter />);
  });
  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('You clicked 0 times');
  expect(document.title).toBe('You clicked 0 times');

  // 두 번째 렌더링 및 effect 테스트
  act(() => {
    button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });
  expect(label.textContent).toBe('You clicked 1 times');
  expect(document.title).toBe('You clicked 1 times');
});
```

`act()` 호출은 그 안의 effect를 플러시합니다.

커스텀 Hook을 테스트해야 하는 경우 테스트에서 컴포넌트를 작성하고 Hook을 사용하여 이를 수행 할 수 있습니다. 그런 다음 작성한 컴포넌트를 테스트 할 수 있습니다.

상용구를 줄이려면 [React Testing Library](https://testing-library.com/react)를 사용하는 것이 좋습니다. 이 라이브러리는 최종 사용자와 마찬가지로 컴포넌트를 사용하는 테스트 작성을 장려하도록 설계되었습니다.

자세한 내용은 [테스팅 방안](/docs/testing-recipes.html)을 확인해주세요.

### [Lint 규칙](https://www.npmjs.com/package/eslint-plugin-react-hooks)은 정확히 무엇을 시행합니까? {#what-exactly-do-the-lint-rules-enforce}

버그를 피하고자 [Hook 규칙](/docs/hooks-rules.html)을 시행하는 [ESLint 플러그인](https://www.npmjs.com/package/eslint-plugin-react-hooks)을 제공합니다. "`use`"로 시작하는 모든 함수 컴포넌트와 Hook 바로 뒤에 대문자가 있다고 가정합니다. 우리는 이 휴리스틱이 완벽하지 않고 오 탐지가 있을 수 있다는 점을 인식하지만, 생태계 전반의 협약이 없으면 훅을 제대로 작동시킬 수 있는 방법이 없습니다 -- 더 긴 이름은 사람들이 Hook을 채택하거나 협약을 따르지 못하게 합니다.

특히, 규칙은 이것들을 시행합니다.

* Hook에 대한 호출은 `PascalCase` 함수 컴포넌트 (컴포넌트로 가정) 또는 다른 `useSomething` 함수 컴포넌트 (커스텀 Hook으로 가정) 내에 있습니다.
* 모든 렌더링에서 Hook은 동일한 순서로 호출됩니다.

휴리스틱이 몇 가지 더 있으며, 추후 오 탐지를 피해 버그를 찾기 위해 규칙을 미세 조정함에 따라 변경될 수 있습니다.

## Class에서 Hook으로 {#from-classes-to-hooks}

### 생명주기 메서드가 Hook에 어떻게 대응합니까? {#how-do-lifecycle-methods-correspond-to-hooks}

* `constructor`: 함수 컴포넌트는 constructor가 필요하지 않습니다. [`useState`](/docs/hooks-reference.html#usestate) 호출에서 state를 초기화 할 수 있습니다. 초기 state를 계산하는 것이 비싸면 `useState`에 함수 컴포넌트를 전달할 수 있습니다.

* `getDerivedStateFromProps`: [대신 렌더링](#how-do-i-implement-getderivedstatefromprops)하는 동안 업데이트 예약.

* `shouldComponentUpdate`: [아래의](#how-do-i-implement-shouldcomponentupdate) `React.memo`를 참조해주세요.

* `render`: 이것은 함수 컴포넌트 본체 자체입니다.

* `componentDidMount`, `componentDidUpdate`, `componentWillUnmount`: [`useEffect` Hook](/docs/hooks-reference.html#useeffect)은 이들의 모든 조합을 표현할 수 있습니다. ([흔하거나](#can-i-run-an-effect-only-on-updates) [그렇지 않은](#can-i-skip-an-effect-on-updates) 경우 포함).

* `getSnapshotBeforeUpdate`, `componentDidCatch` 그리고 `getDerivedStateFromError`: 이러한 메서드에 대한 Hook은 없지만, 곧 추가될 예정입니다.

### Hook을 사용하여 데이터 가져오기를 수행하려면 어떻게 해야 합니까? {#how-can-i-do-data-fetching-with-hooks}

다음은 시작하기 위한 [짧은 데모](https://codesandbox.io/s/jvvkoo8pq3)입니다. 자세한 내용은 Hook을 사용한 데이터 가져오기를 다룬 [이 기사](https://www.robinwieruch.de/react-hooks-fetch-data/)를 확인해주세요.

### 인스턴스 변수와 같은 것이 있습니까? {#is-there-something-like-instance-variables}

네! [`useRef()`](/docs/hooks-reference.html#useref) Hook은 DOM ref만을 위한 것이 아닙니다. "ref" 객체는 `현재` 프로퍼티가 변경할 수 있고 어떤 값이든 보유할 수 있는 일반 컨테이너입니다. 이는 class의 인스턴스 프로퍼티와 유사합니다.

`useEffect` 내부에서 쓸 수 있습니다.

```js{2,8}
function Timer() {
  const intervalRef = useRef();

  useEffect(() => {
    const id = setInterval(() => {
      // ...
    });
    intervalRef.current = id;
    return () => {
      clearInterval(intervalRef.current);
    };
  });

  // ...
}
```

인터벌을 설정하고 싶다면 ref가 필요하지 않지만 (`id`는 로컬 effect일 수 있습니다), 이벤트 처리에서 인터벌을 지우고 싶을 때 유용합니다.

```js{3}
  // ...
  function handleCancelClick() {
    clearInterval(intervalRef.current);
  }
  // ...
```

개념적으로, class의 인스턴스 변수와 ref를 비슷하게 생각할 수 있습니다. [지연 초기화](#how-to-create-expensive-objects-lazily)를 수행하지 않는 한, 렌더링 중에 ref 설정을 피해주세요. -- 이것은 놀라운 상황을 초래할 수 있습니다. 대신, 일반적으로 이벤트 처리와 effect에서 ref를 수정하는 것이 좋습니다.

### 하나 또는 여러 state 변수를 사용해야 합니까? {#should-i-use-one-or-many-state-variables}

Class를 배운 후라면, `useState()`를 한 번만 호출하고 모든 state를 단일 객체에 넣고 싶을 수 있습니다. 원하시면 그렇게 할 수 있습니다. 다음은 마우스 움직임을 따르는 컴포넌트의 예입니다. 포인터의 위치와 크기를 로컬 state에 유지합니다.

```js
function Box() {
  const [state, setState] = useState({ left: 0, top: 0, width: 100, height: 100 });
  // ...
}
```

이제 사용자가 마우스를 움직일 때 `left`과 `top`의 포지션을 변경하는 로직을 작성하고 싶다고 가정해 보겠습니다. 이러한 필드를 이전 state 개체에 수동으로 병합하는 방법에 유의해주세요.

```js{4,5}
  // ...
  useEffect(() => {
    function handleWindowMouseMove(e) {
      // "... state"를 spread 하여 너비와 높이가 "손실"되지 않습니다
      setState(state => ({ ...state, left: e.pageX, top: e.pageY }));
    }
    // 주의: 이 구현은 약간 단순화되었습니다
    window.addEventListener('mousemove', handleWindowMouseMove);
    return () => window.removeEventListener('mousemove', handleWindowMouseMove);
  }, []);
  // ...
```

이는 state 변수를 업데이트할 때 그 값을 *대체*하기 때문입니다. 이것은 업데이트된 필드를 객체에 *병합*하는 class의 `this.setState`와 다릅니다.

자동 병합이 그리운 경우 개체 state 업데이트를 병합하는 커스텀 `useLegacyState` Hook을 작성할 수 있습니다. 그러나, **함께 변경되는 값에 따라 state를 여러 state 변수로 분할하는 것을 추천합니다.**

예를 들어 컴포넌트 state를 `position` 및 `size` 객체로 분할하고 병합할 필요 없이 항상 `position`을 대체 할 수 있습니다.

```js{2,7}
function Box() {
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const [size, setSize] = useState({ width: 100, height: 100 });

  useEffect(() => {
    function handleWindowMouseMove(e) {
      setPosition({ left: e.pageX, top: e.pageY });
    }
    // ...
```

독립된 state 변수를 분리하면 또 다른 이점이 있습니다. 예를 들어 나중에 관련 로직을 커스텀 Hook으로 쉽게 추출 할 수 있습니다.

```js{2,7}
function Box() {
  const position = useWindowPosition();
  const [size, setSize] = useState({ width: 100, height: 100 });
  // ...
}

function useWindowPosition() {
  const [position, setPosition] = useState({ left: 0, top: 0 });
  useEffect(() => {
    // ...
  }, []);
  return position;
}
```

코드를 변경하지 않고 `position` state 변수에 대한 `useState` 호출과 관련 effect를 커스텀 Hook으로 옮길 수 있었던 방법에 유의해주세요. 모든 state가 단일 객체에 있으면 추출하기가 더 어려울 것입니다.

모든 state를 단일 `useState` 호출에 넣고 필드마다 `useState` 호출을 두는 방법도 쓸 수 있습니다. 컴포넌트는 이러한 두 극단 사이의 균형을 찾고 관련 state를 몇 개의 독립 state 변수로 그룹화할 때 가장 읽기 쉬운 경향이 있습니다. State 로직이 복잡해지면 [리듀서로 관리](/docs/hooks-reference.html#usereducer), 또는 커스텀 Hook을 사용하는 것이 좋습니다.

### 업데이트에만 effect를 실행할 수 있습니까? {#can-i-run-an-effect-only-on-updates}

이것은 드문 사용 사례입니다. 필요한 경우 [변경 가능한 ref를 사용하여](#is-there-something-like-instance-variables) 첫 번째 또는 후속 렌더링에 있는지에 해당하는 부울 값을 수동으로 저장한 다음, 해당 플래그를 확인할 수 있습니다. (이 작업을 자주 수행하는 경우 커스텀 Hook을 만들 수 있습니다.)

### 이전 props 또는 state를 얻는 방법? {#how-to-get-the-previous-props-or-state}

현재는 수동으로 [ref랑 같이](#is-there-something-like-instance-variables) 사용할 수 있습니다.

```js{6,8}
function Counter() {
  const [count, setCount] = useState(0);

  const prevCountRef = useRef();
  useEffect(() => {
    prevCountRef.current = count;
  });
  const prevCount = prevCountRef.current;

  return <h1>Now: {count}, before: {prevCount}</h1>;
}
```

약간 복잡 할 수 있지만, 커스텀 훅으로 추출 할 수 있습니다.

```js{3,7}
function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);
  return <h1>Now: {count}, before: {prevCount}</h1>;
}

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
```

이것이 props, state 또는 기타 계산된 값에 대해 어떻게 작동하는지 확인해주세요.

```js{5}
function Counter() {
  const [count, setCount] = useState(0);

  const calculation = count + 100;
  const prevCalculation = usePrevious(calculation);
  // ...
```

상대적으로 일반적인 사용 사례이기 때문에 향후 React에서 'usePrevious' Hook을 제공 할 수 있습니다.

[파생 state에 권장되는 패턴](#how-do-i-implement-getderivedstatefromprops)도 참조하세요.

### 함수 컴포넌트 안에 오래된 props나 state가 보이는 이유는 무엇입니까? {#why-am-i-seeing-stale-props-or-state-inside-my-function}

이벤트 처리 및 effect를 포함한 컴포넌트 내부의 모든 함수 컴포넌트는 생성된 렌더링에서 props와 state를 "확인"합니다. 예를 들어 이와 같은 코드를 고려해주세요.

```js
function Example() {
  const [count, setCount] = useState(0);

  function handleAlertClick() {
    setTimeout(() => {
      alert('You clicked on: ' + count);
    }, 3000);
  }

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
      <button onClick={handleAlertClick}>
        Show alert
      </button>
    </div>
  );
}
```

먼저 "알림 표시"를 클릭한 다음 카운터를 늘리면 **"알림 표시" 버튼을 클릭할 때** 경고 문구로 `count` 변수가 표시됩니다. 이것은 props와 state가 변경되지 않는다고 가정하는 상황에서 코드로 인한 버그를 방지합니다.

일부 비동기 콜백에서 *최근* state를 의도적으로 읽으려면 [ref](/docs/hooks-faq.html#is-there-something-like-instance-variables)에 보관해서 변경하고 읽으면 됩니다.

마지막으로, 부실한 props 또는 state를 볼 수 있는 또 다른 이유는 "종속성 배열" 최적화를 사용하지만 모든 종속성을 올바르게 지정하지 않은 경우입니다. 예를 들어, effect가 `[]`를 두 번째 인수로 지정하지만, 내부에서 `someProp`을 읽는 경우 `someProp`의 초깃값을 계속 "보고"합니다. 해결책은 종속성 배열을 제거하거나 수정하는 것입니다. 다음은 [함수 컴포넌트를 처리하는 방법](#is-it-safe-to-omit-functions-from-the-list-of-dependencies)과 종속성을 잘못 건너뛰지 않고 effect를 덜 실행하는 [일반적인 전략](#what-can-i-do-if-my-effect-dependencies-change-too-often)입니다.

>주의
>
>[`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) 패키지의 일부로 [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) ESLint 규칙을 제공합니다. 종속성이 잘못 지정되면 경고하고 수정을 제안합니다.

### getDerivedStateFromProps를 어떻게 구현합니까? {#how-do-i-implement-getderivedstatefromprops}

[필요하지 않을 수](/blog/2018/06/07/you-probably-dont-need-derived-state.html) 있지만 드물게 수행하는 경우 (예: `<Transition>` 컴포넌트 구현) 렌더링 중에 state를 바로 업데이트 할 수 있습니다. React는 첫 번째 렌더링을 종료한 후 즉시 업데이트된 state로 컴포넌트를 다시 실행하므로 비용이 많이 들지 않습니다.

여기서는 비교할 수 있도록 `row` props의 이전 값을 state 변수에 저장합니다.

```js
function ScrollView({row}) {
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [prevRow, setPrevRow] = useState(null);

  if (row !== prevRow) {
    // 마지막 렌더링 이후 행이 변경되었습니다. isScrollingDown을 업데이트합니다.
    setIsScrollingDown(prevRow !== null && row > prevRow);
    setPrevRow(row);
  }

  return `Scrolling down: ${isScrollingDown}`;
}
```

처음에는 이상하게 보일 수 있지만, 렌더링 중 업데이트는 정확히 'getDerivedStateFromProps'가 개념적으로 항상 그랬던 것과 같았습니다.

### forceUpdate와 같은 것이 있습니까? {#is-there-something-like-forceupdate}

`useState`와 `useReducer` Hook은 다음 값이 이전 값과 같으면 [업데이트에서 제외됩니다](/docs/hooks-reference.html#bailing-out-of-a-state-update). State를 변경하고 `setState`를 호출해도 다시 렌더링 되지 않습니다.

일반적으로 React에서 로컬 state를 변경해서는 안 됩니다. 그러나 도피 수단으로 증가하는 카운터를 사용하여 state가 변경되지 않은 경우에도 강제로 다시 렌더링 할 수 있습니다.

```js
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  function handleClick() {
    forceUpdate();
  }
```

가능하면 이 패턴을 피해주세요.

### 함수 컴포넌트에 ref를 만들 수 있습니까? {#can-i-make-a-ref-to-a-function-component}

자주 필요하지는 않지만 [`useImperativeHandle`](/docs/hooks-reference.html#useimperativehandle) Hook을 사용하여 일부 명령형 메서드를 부모 컴포넌트에 노출 할 수 있습니다.

### DOM 노드를 측정하려면 어떻게 해야 합니까? {#how-can-i-measure-a-dom-node}

DOM 노드의 위치나 크기를 측정하는 기본적인 방법의 하나는 [콜백 ref](/docs/refs-and-the-dom.html#callback-refs)를 사용하는 것입니다. React는 ref가 다른 노드에 연결될 때마다 해당 콜백을 호출합니다. 다음은 [짧은 데모](https://codesandbox.io/s/l7m0v5x4v9)입니다.

```js{4-8,12}
function MeasureExample() {
  const [height, setHeight] = useState(0);

  const measuredRef = useCallback(node => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
    }
  }, []);

  return (
    <>
      <h1 ref={measuredRef}>Hello, world</h1>
      <h2>The above header is {Math.round(height)}px tall</h2>
    </>
  );
}
```

이 예시에서는 객체 ref가 현재 ref 값의 변경 사항에 대해 알려주지 않기 때문에 `useRef`를 선택하지 않았습니다. 콜백 ref를 사용하면 [자식 컴포넌트가 나중에 측정된 노드를 표시하더라도](https://codesandbox.io/s/818zzk8m78) (예: 클릭에 대한 응답으로) 여전히 부모 컴포넌트에서 이에 대한 알림을 받고 측정을 업데이트 할 수 있습니다.

`[]`를 ʻuseCallback`에 종속성 배열로 전달합니다. 이렇게 하면 ref 콜백이 다시 렌더링 간에 변경되지 않음으로 React가 불필요하게 호출하지 않습니다.

이 예시에서 콜백 ref는 렌더링 된 `<h1>` 컴포넌트가 모든 리렌더 동안 존재하기 때문에 컴포넌트가 마운트 및 마운트 해제될 때만 호출됩니다. 컴포넌트의 크기가 조정될 때마다 알림을 받으려면 [`ResizeObserver`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) 또는 여기에 빌드된 제삼자 Hook을 사용할 수 있습니다.

원한다면 재사용 가능한 Hook으로 [이 로직을 추출](https://codesandbox.io/s/m5o42082xy) 할 수 있습니다.

```js{2}
function MeasureExample() {
  const [rect, ref] = useClientRect();
  return (
    <>
      <h1 ref={ref}>Hello, world</h1>
      {rect !== null &&
        <h2>The above header is {Math.round(rect.height)}px tall</h2>
      }
    </>
  );
}

function useClientRect() {
  const [rect, setRect] = useState(null);
  const ref = useCallback(node => {
    if (node !== null) {
      setRect(node.getBoundingClientRect());
    }
  }, []);
  return [rect, ref];
}
```

### const [thing, setThing] = useState()는 무엇을 의미합니까? {#what-does-const-thing-setthing--usestate-mean}

이 구문에 익숙하지 않은 경우 State Hook 문서의 [explanation](/docs/hooks-state.html#tip-what-do-square-brackets-mean)을 확인하세요.

## 성능 최적화 {#performance-optimizations}

### 업데이트 시 effect를 건너뛸 수 있습니까? {#can-i-skip-an-effect-on-updates}

예. [조건부 effect 실행](/docs/hooks-reference.html#conditionally-firing-an-effect)을 참조해주세요. 업데이트 처리를 잊어 버리면 종종 [버그가 발생](/docs/hooks-effect.html#explanation-why-effects-run-on-each-update)하므로 이것은 기본 세팅이 아닙니다.

### 종속성 목록에서 함수 컴포넌트를 생략하는 것이 안전합니까? {#is-it-safe-to-omit-functions-from-the-list-of-dependencies}

일반적으로는 아닙니다.

```js{3,8}
function Example({ someProp }) {
  function doSomething() {
    console.log(someProp);
  }

  useEffect(() => {
    doSomething();
  }, []); // 🔴 이것은 안전하지 않습니다 (`someProp`을 사용하는`doSomething`을 호출합니다)
}
```

Effect 외부의 함수 컴포넌트에서 어떤 props 또는 state를 사용하는지 기억하기 어렵습니다. 이것이 **일반적으로 그 *내부의* effect에 필요한 함수 컴포넌트를 선언**하려는 이유입니다. 그러면 effect가 미치는 컴포넌트 범위의 값을 쉽게 확인할 수 있습니다.

```js{4,8}
function Example({ someProp }) {
  useEffect(() => {
    function doSomething() {
      console.log(someProp);
    }

    doSomething();
  }, [someProp]); // ✅ OK (우리 effect는`someProp` 만 사용합니다)
}
```

그 후에도 컴포넌트 범위의 값을 사용하지 않으면 `[]`를 지정하는 것이 안전합니다.

```js{7}
useEffect(() => {
  function doSomething() {
    console.log('hello');
  }

  doSomething();
}, []); // ✅ 이 예에서는 컴포넌트 범위의 *어떤* 값도 사용하지 않기 때문에 좋습니다
```

사용 사례에 따라 아래에 설명된 몇 가지 옵션이 더 있습니다.

>주의
>
>[`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) 패키지의 일부로 [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) ESLint 규칙을 제공합니다. 업데이트를 일관되게 처리하지 않는 컴포넌트를 찾는 데 도움이 됩니다.

이것이 왜 중요한지 봅시다.

`useEffect`, `useLayoutEffect`, `useMemo`, `useCallback` 또는 `useImperativeHandle`의 마지막 인수로 [종속성 목록](/docs/hooks-reference.html#conditionally-firing-an-effect)을 지정하는 경우 콜백 내에서 사용되는 모든 값을 포함하고 React 데이터 흐름에 참여해야 합니다. 여기에는 props, state 및 그로부터 파생된 모든 것이 포함됩니다.

함수 컴포넌트 (또는 함수 컴포넌트가 호출하는 함수 컴포넌트)가 props, state 또는 파생된 값을 참조하지 않는 **경우에만** 종속성 목록에서 함수 컴포넌트를 생략하는 것이 안전합니다. 이 예에는 버그가 있습니다.

```js{5,12}
function ProductPage({ productId }) {
  const [product, setProduct] = useState(null);

  async function fetchProduct() {
    const response = await fetch('http://myapi/product/' + productId); // productId props 사용
    const json = await response.json();
    setProduct(json);
  }

  useEffect(() => {
    fetchProduct();
  }, []); // 🔴 `fetchProduct`가`productId`를 사용하므로 잘못되었습니다
  // ...
}
```

**권장되는 해결 방법은 해당 기능을 effect _내부로_ 이동하는 것입니다**. 이를 통해 effect가 사용하는 props 또는 state를 쉽게 확인하고 모두 선언되었는지 확인할 수 있습니다.

```js{5-10,13}
function ProductPage({ productId }) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // 이 함수 컴포넌트를 effect 내부로 이동하면 사용하는 값을 명확하게 볼 수 있습니다.
    async function fetchProduct() {
      const response = await fetch('http://myapi/product/' + productId);
      const json = await response.json();
      setProduct(json);
    }

    fetchProduct();
  }, [productId]); // ✅ 효과는 productId 만 사용하므로 유효합니다
  // ...
}
```

이를 통해 effect 내부의 로컬 변수를 사용하여 비순차적 인 응답을 처리 할 수도 있습니다.

```js{2,6,10}
  useEffect(() => {
    let ignore = false;
    async function fetchProduct() {
      const response = await fetch('http://myapi/product/' + productId);
      const json = await response.json();
      if (!ignore) setProduct(json);
    }

    fetchProduct();
    return () => { ignore = true };
  }, [productId]);
```

Effect 내부로 함수를 옮겼으므로 의존성 배열에 있을 필요가 없습니다.

>팁
>
>이 [짧은 데모](https://codesandbox.io/s/jvvkoo8pq3)와 [이 기사](https://www.robinwieruch.de/react-hooks-fetch-data/)를 확인해 Hook을 사용한 데이터 가져오기에 대해 자세히 알아보세요.

**만일 어떤 이유로 함수를 effect 내부로 이동할 수 _없는_ 경우 몇 가지 옵션이 더 있습니다.**

* **해당 함수를 컴포넌트 외부로 이동해 볼 수 있습니다**. 이 경우 함수는 props나 state를 참조하지 않도록 보장되며 종속성 목록에 있을 필요가 없습니다.

* 호출하는 함수가 순수한 계산이고 렌더링하는 동안 호출해도 안전하다면, **대신에 effect 외부에서 호출하고** 반환된 값에 따라 effect가 달라지도록 할 수 있습니다.

* 마지막 수단으로 **Effect 의존성 배열에 함수를 추가하되, _정의를_** [`useCallback`](/docs/hooks-reference.html#usecallback) Hook에 **_감싸주세요_**. 이렇게 하면 자체 종속성도 변경되지 않는 한 모든 렌더링에서 변경되지 않습니다.

```js{2-5}
function ProductPage({ productId }) {
  // ✅ 모든 렌더링에서 변경되지 않도록 useCallback으로 래핑
  const fetchProduct = useCallback(() => {
    // ... productId로 무언가를 합니다 ...
  }, [productId]); // ✅ 모든 useCallback 종속성이 지정됩니다

  return <ProductDetails fetchProduct={fetchProduct} />;
}

function ProductDetails({ fetchProduct }) {
  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]); // ✅ 모든 useEffect 종속성이 지정됩니다
  // ...
}
```

위의 예에서 종속성 목록에 함수 컴포넌트를 유지할 **필요**가 있습니다. 이렇게 하면 `ProductPage`의 `productId` props가 변경되면 `ProductDetails` 컴포넌트에서 자동으로 다시 가져오기가 트리거 됩니다.

### effect 종속성이 너무 자주 변경되면 어떻게 해야 합니까? {#what-can-i-do-if-my-effect-dependencies-change-too-often}

때로는 effect가 너무 자주 변경되는 state를 사용할 수도 있습니다. 종속성 목록에서 해당 state를 생략하고 싶을 수 있지만, 이 경우 일반적으로 버그가 발생합니다.

```js{6,9}
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1); // 이 effect는 'count' state에 따라 다릅니다
    }, 1000);
    return () => clearInterval(id);
  }, []); // 🔴 버그: `count`가 종속성으로 지정되지 않았습니다

  return <h1>{count}</h1>;
}
```

빈 종속성 세트, `[]`는 컴포넌트가 마운트 될 때마다 effect가 한 번만 실행되고 매번 렌더링 시에는 실행되지 않음을 의미합니다. 문제는 `setInterval` 콜백 내에서 `count` 값이 변경되지 않는다는 것입니다. Effect 콜백이 실행되었을 때와 마찬가지로 count 값이 0으로 설정된 클로저를 생성했기 때문입니다. 이 콜백은 매초 `setCount(0 + 1)`를 호출하므로 카운트가 1을 초과하지 않습니다.

종속성 목록으로 `[count]`를 지정하면 버그가 수정되지만, 변경될 때마다 간격이 재설정됩니다. 효과적으로, 각 `setInterval`은 지워지기 전에 한 번의 실행 기회를 갖게 됩니다 (`setTimeout`과 유사). 이는 바람직하지 않을 수 있습니다. 이를 해결하기 위해 `setState`의 [함수 컴포넌트 업데이트 폼](/docs/hooks-reference.html#functional-updates)을 사용할 수 있습니다. *현재* state를 참조하지 않고 state를 변경해야 하는 *방법*을 지정할 수 있습니다.

```js{6,9}
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1); // ✅ 이것은 외부의 'count' 변수에 의존하지 않습니다
    }, 1000);
    return () => clearInterval(id);
  }, []); // ✅ 우리의 effect는 컴포넌트 범위의 변수를 사용하지 않습니다

  return <h1>{count}</h1>;
}
```

(`setCount` 함수 컴포넌트의 정체성은 안정적이므로 생략해도 안전합니다.)

이제 `setInterval` 콜백이 1초에 한 번 실행되지만 `setCount`에 대한 내부 호출이 `count`에 최신 값을 사용할 수 있습니다. (여기서는 콜백에서 `c`라고 함).

더 복잡한 경우 (예: 한 state가 다른 state에 의존하는 경우) [`useReducer` Hook](/docs/hooks-reference.html#usereducer)을 사용하여 state 업데이트 로직을 effect 외부로 이동해보세요. [이 문서](https://adamrackis.dev/state-and-use-reducer/)에서는 이를 수행하는 방법에 대한 예를 제공합니다. **`useReducer`의 `dispatch` 함수 컴포넌트의 정체성은 항상 안정적입니다** — 리듀서 함수 컴포넌트가 컴포넌트 내부에서 선언되고 해당 props를 읽는 경우에도 마찬가지입니다.

마지막 수단으로, class에서 `this`와 같은 것을 원한다면 [ref를 사용](/docs/hooks-faq.html#is-there-something-like-instance-variables)하여 가변 변수를 보유 할 수 있습니다. 그런 다음 그것을 쓰고 읽을 수 있습니다. 예를 들면.

```js{2-6,10-11,16}
function Example(props) {
  // 최신 props를 ref에 보관해주세요.
  const latestProps = useRef(props);
  useEffect(() => {
    latestProps.current = props;
  });

  useEffect(() => {
    function tick() {
      // 언제든지 최신 props 읽기
      console.log(latestProps.current);
    }

    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []); // 이 effect는 다시 실행되지 않습니다
}
```

변형에 의존하면 컴포넌트를 예측하기 어렵기 때문에 더 나은 대안을 찾을 수 없는 경우에만 이 작업을 수행해주세요. 제대로 옮겨지지 않는 특정 패턴이 있는 경우 실행 가능한 예시 코드로 [문제를 제출하면](https://github.com/facebook/react/issues/new) 도움을 드릴 수 있습니다.

### shouldComponentUpdate는 어떻게 구현합니까? {#how-do-i-implement-shouldcomponentupdate}

함수 컴포넌트를 `React.memo`로 래핑하여 props를 얕게 비교할 수 있습니다.

```js
const Button = React.memo((props) => {
  // 여러분의 컴포넌트
});
```

Hook처럼 구성하지 않기 때문에 Hook이 아닙니다. `React.memo`는 `PureComponent`와 동일하지만, props만 비교합니다. (두 번째 인수를 추가하여 이전 및 새 props를 받는 커스텀 비교 함수 컴포넌트를 지정할 수도 있습니다. true를 반환하면 업데이트를 건너뜁니다.)

`React.memo`는 비교할 단일 state 객체가 없기 때문에 state를 비교하지 않습니다. 하지만 자식들을 순수하게 만들 수도 있고 [`useMemo`를 사용하여 개별 자식들을 최적화](/docs/hooks-faq.html#how-to-memoize-calculations) 할 수도 있습니다.

### 계산을 메모이제이션 하는 법? {#how-to-memoize-calculations}

[`useMemo`](/docs/hooks-reference.html#usememo) Hook을 사용하면 이전 계산을 "기억"하여 여러 렌더링 간에 계산을 캐시 할 수 있습니다.

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

이 코드는 `computeExpensiveValue(a, b)`를 호출합니다. 그러나 종속성 `[a, b]`가 마지막 값 이후로 변경되지 않은 경우 `useMemo`는 두 번째 호출을 건너뛰고 반환된 마지막 값을 재사용합니다.

`useMemo`에 전달된 함수는 렌더링 중에 실행됩니다. 렌더링하는 동안 일반적으로 하지 않는 작업은 하지마세요. 예를 들어 부작용은 `useMemo`가 아니라 `useEffect`에 속합니다.

**의미론적 보장이 아닌 성능 최적화로 `useMemo`를 사용할 수 있습니다.** 미래에 React는 이전에 메모한 일부 값을 "잊고" 다음 렌더링에서 다시 계산하도록 선택할 수 있습니다. 오프 스크린 컴포넌트를 위한 메모리를 확보합니다. `useMemo` 없이도 계속 작동하도록 코드를 작성한 다음 추가하여 성능을 최적화해주세요. (값을 다시 계산해서는 안 되는 드문 경우의 경우, ref를 [느리게 초기화](#how-to-create-expensive-objects-lazily) 할 수 있습니다.)

편리하게도 `useMemo`를 사용하면 자녀의 값 비싼 다시 렌더링을 건너뛸 수 있습니다.

```js
function Parent({ a, b }) {
  // 'a'가 변경된 경우에만 다시 렌더링 됩니다:
  const child1 = useMemo(() => <Child1 a={a} />, [a]);
  // 'b'가 변경된 경우에만 다시 렌더링 됩니다:
  const child2 = useMemo(() => <Child2 b={b} />, [b]);
  return (
    <>
      {child1}
      {child2}
    </>
  )
}
```

Hook 호출은 루프 내부에 배치될 수 [없기](/docs/hooks-rules.html) 때문에 이 방법은 루프에서 작동하지 않습니다. 그러나 목록 항목에 대해 별도의 컴포넌트를 추출하고 거기에서 `useMemo`를 호출 할 수 있습니다.

### 고비용의 객체를 지연해서 생성하는 법? {#how-to-create-expensive-objects-lazily}

`useMemo`를 사용하면 종속성이 동일한 경우 [값비싼 계산을 메모](#how-to-memoize-calculations) 할 수 있습니다. 그러나 힌트 역할을 할 뿐이며 계산이 다시 실행되지 않는다는 *보장*은 없습니다. 때로는 객체가 한 번만 생성되었는지 확인해야 합니다.

**첫 번째 일반적인 사용 사례는 초기 state를 만드는 데 비용이 많이 드는 경우입니다.**

```js
function Table(props) {
  // ⚠️ createRows()는 모든 렌더링에서 호출됩니다
  const [rows, setRows] = useState(createRows(props.count));
  // ...
}
```

무시된 초기 state를 다시 생성하지 않으려면 `useState`에 **함수 컴포넌트**를 전달할 수 있습니다.

```js
function Table(props) {
  // ✅ createRows()는 한 번만 호출됩니다
  const [rows, setRows] = useState(() => createRows(props.count));
  // ...
}
```

React는 첫 번째 렌더링 중에만 함수 컴포넌트를 호출합니다. [`useState` API 참조](/docs/hooks-reference.html#usestate)를 확인하세요.

**때때로 `useRef()` 초깃값을 다시 작성하지 않으려고 할 수도 있습니다.** 예를 들어 명령형 class 인스턴스가 한 번만 생성되도록 하고 싶을 수 있습니다.

```js
function Image(props) {
  // ⚠️ IntersectionObserver는 모든 렌더링에서 생성됩니다
  const ref = useRef(new IntersectionObserver(onIntersect));
  // ...
}
```

`useRef`는 `useState`와 같은 특수 함수 컴포넌트 오버로드를 허용하지 **않습니다.** 대신 느리게 생성하고 설정하는 자체 함수 컴포넌트를 작성할 수 있습니다.

```js
function Image(props) {
  const ref = useRef(null);

  // ✅ IntersectionObserver는 한 번 느리게 생성됩니다
  function getObserver() {
    if (ref.current === null) {
      ref.current = new IntersectionObserver(onIntersect);
    }
    return ref.current;
  }

  // 필요할 때 getObserver()를 호출해주세요
  // ...
}
```

이렇게 하면 처음에 진정으로 필요할 때까지는 값비싼 개체를 만들지 않아도 됩니다. Flow 또는 TypeScript를 사용하는 경우 편의를 위해 `getObserver()`에 nullable이 아닌 유형을 제공 할 수도 있습니다.

### 렌더링에서 함수 컴포넌트를 만들기 때문에 Hook이 느려집니까? {#are-hooks-slow-because-of-creating-functions-in-render}

아니요. 최신 브라우저에서 class와 비교해 클로저의 원시적 성능은 극단적인 시나리오를 제외하고는 크게 다르지 않습니다.

또한 Hook 디자인이 몇 가지 면에서 더 효율적이라는 것을 고려해주세요.

* Hook은 class 인스턴스를 만들고 생성자에서 이벤트 핸들러를 바인딩하는 비용과 같이 class에 필요한 많은 오버헤드를 방지합니다.

* **Hook을 사용하는 관용적 코드에는** 고차 컴포넌트, 렌더링 props 및 context를 사용하는 코드 베이스에서 널리 알려진 **깊은 컴포넌트 트리 중첩이 필요하지 않습니다.** 컴포넌트 트리가 작을수록 React는 할 일이 적습니다.

전통적으로 React의 인라인 함수 컴포넌트와 관련된 성능 문제는 각 렌더에서 새 콜백을 전달하면 자식 컴포넌트에서 `shouldComponentUpdate` 최적화가 중단되는 방식과 관련이 있습니다. Hook은 세 가지 측면에서 이 문제에 접근합니다.

* [`useCallback`](/docs/hooks-reference.html#usecallback) Hook을 사용하면 `shouldComponentUpdate`가 계속 작동하도록 다시 렌더링간에 동일한 콜백 참조를 유지할 수 있습니다.

    ```js{2}
    // `a` 또는` b`가 변경되지 않으면 변경되지 않습니다
    const memoizedCallback = useCallback(() => {
      doSomething(a, b);
    }, [a, b]);
    ```

* [`useMemo`](/docs/hooks-faq.html#how-to-memoize-calculations) Hook을 사용하면 개별 자식들이 업데이트되는 시기를 보다 쉽게 제어할 수 있음으로 순수한 컴포넌트의 필요성이 줄어듭니다.

* 마지막으로, [`useReducer`](/docs/hooks-reference.html#usereducer) Hook은 아래에 설명된 것처럼 콜백을 깊이 전달할 필요성을 줄여줍니다.

### 콜백 전달을 피하는 법? {#how-to-avoid-passing-callbacks-down}

우리는 대부분의 사람이 모든 레벨의 컴포넌트 트리를 통해 콜백을 수동으로 전달하는 것을 좋아하지 않는다는 것을 발견했습니다. 더 명백하지만 마치 "배관"이 많은 것처럼 느껴질 수 있습니다.

큰 컴포넌트 트리에서 권장되는 대안은 context를 통해 [`useReducer`](/docs/hooks-reference.html#usereducer)에서 `dispatch` 함수 컴포넌트를 전달하는 것입니다.

```js{4,5}
const TodosDispatch = React.createContext(null);

function TodosApp() {
  // 주의: `dispatch`는 다시 렌더링 간에 변경되지 않습니다
  const [todos, dispatch] = useReducer(todosReducer);

  return (
    <TodosDispatch.Provider value={dispatch}>
      <DeepTree todos={todos} />
    </TodosDispatch.Provider>
  );
}
```

`TodosApp` 내의 트리에 있는 모든 자식은 `dispatch` 기능을 사용하여 `TodosApp`에 작업을 전달할 수 있습니다.

```js{2,3}
function DeepChild(props) {
  // 작업을 수행하려면 context에서 dispatch를 얻을 수 있습니다.
  const dispatch = useContext(TodosDispatch);

  function handleClick() {
    dispatch({ type: 'add', text: 'hello' });
  }

  return (
    <button onClick={handleClick}>Add todo</button>
  );
}
```

이것은 유지 보수 관점에서 더 편리하고 (콜백을 계속 전달할 필요가 없음) 콜백 문제를 모두 방지합니다. 이처럼 `dispatch`를 전달하는 것이 심층 업데이트에 권장되는 패턴입니다.

애플리케이션 state를 props (더욱 명백한) 또는 context로 (매우 심층적인 업데이트에 더 편리함) 전달할지 여부를 선택할 수 있습니다. context를 사용하여 state를 전달하는 경우에도 두 가지 context 유형을 사용해주세요. `dispatch` context는 변경되지 않음으로 이를 읽는 컴포넌트는 애플리케이션 state가 필요하지 않은 한 다시 렌더링할 필요가 없습니다.

### useCallback에서 자주 변경되는 값을 읽는 방법? {#how-to-read-an-often-changing-value-from-usecallback}

>주의
>
>props의 개별 콜백보다는 [context에서 `dispatch`를 전달](#how-to-avoid-passing-callbacks-down)하는 것이 좋습니다. 아래 접근 방식은 완전성과 탈출구로만 여기에서 언급됩니다.

드물게 [`useCallback`](/docs/hooks-reference.html#usecallback)을 사용하여 콜백을 메모해야 할 수도 있지만, 내부 함수 컴포넌트를 너무 자주 다시 만들어야 하므로 메모가 제대로 작동하지 않습니다. 메모하는 함수 컴포넌트가 이벤트 핸들러이고 렌더링 중에 사용되지 않는 경우 [ref를 인스턴스 변수로](#is-there-something-like-instance-variables) 사용하고 마지막으로 커밋 된 값을 수동으로 저장할 수 있습니다.

```js{6,10}
function Form() {
  const [text, updateText] = useState('');
  const textRef = useRef();

  useEffect(() => {
    textRef.current = text; // ref에 쓰기
  });

  const handleSubmit = useCallback(() => {
    const currentText = textRef.current; // ref에서 읽기
    alert(currentText);
  }, [textRef]); // [text]처럼 handleSubmit을 다시 만들지 마세요

  return (
    <>
      <input value={text} onChange={e => updateText(e.target.value)} />
      <ExpensiveTree onSubmit={handleSubmit} />
    </>
  );
}
```

이것은 다소 복잡한 패턴이지만 필요한 경우에 탈출구 최적화를 수행 할 수 있음을 보여줍니다. 커스텀 Hook으로 추출하면 견딜 수 있습니다.

```js{4,16}
function Form() {
  const [text, updateText] = useState('');
  // 'text'가 변경되어도 메모합니다:
  const handleSubmit = useEventCallback(() => {
    alert(text);
  }, [text]);

  return (
    <>
      <input value={text} onChange={e => updateText(e.target.value)} />
      <ExpensiveTree onSubmit={handleSubmit} />
    </>
  );
}

function useEventCallback(fn, dependencies) {
  const ref = useRef(() => {
    throw new Error('Cannot call an event handler while rendering.');
  });

  useEffect(() => {
    ref.current = fn;
  }, [fn, ...dependencies]);

  return useCallback(() => {
    const fn = ref.current;
    return fn();
  }, [ref]);
}
```

두 경우 모두 이 패턴을 **권장하지 않으며** 완전성을 위해 여기에 표시합니다. 대신 [콜백을 깊게 전달하지 않는 것](#how-to-avoid-passing-callbacks-down)이 좋습니다.

## Hook의 이면 {#under-the-hood}

### React는 Hook 호출을 컴포넌트와 어떻게 연관시키는가? {#how-does-react-associate-hook-calls-with-components}

React는 현재 렌더링 컴포넌트를 추적합니다. [Rules of Hook](/docs/hooks-rules.html) 덕분에 Hook은 React 컴포넌트 (또는 React 컴포넌트에서만 호출되는 커스텀 Hook)에서만 호출된다는 것을 알고 있습니다.

각 컴포넌트와 관련된 "메모리 셀"의 내부 목록이 있습니다. 이것은 단지 데이터를 넣을 수 있는 JavaScript 객체입니다. `useState()`와 같은 Hook을 호출하면 현재 셀을 읽거나 첫 번째 렌더링 중에 초기화한 다음 포인터를 다음 셀로 이동합니다. 이것이 여러 `useState()` 호출이 각각 독립적인 로컬 state를 얻는 방법입니다.

### Hook에 대한 선행 기술은 무엇입니까? {#what-is-the-prior-art-for-hooks}

Hook은 여러 소스에서 아이디어를 합성합니다.

* [react-future](https://github.com/reactjs/react-future/tree/master/07%20-%20Returning%20State) 저장소에서 기능적 API를 사용한 이전 실험.
* [Ryan Florence](https://github.com/ryanflorence)의 [Reactions 컴포넌트](https://github.com/reactions/component)를 포함하여 렌더링 props API를 사용한 React 커뮤니티의 실험.
* 렌더링 props를 위한 편의 문법으로 제안된 [Dominic Gannaway](https://github.com/trueadm)의 [`adopt` 키워드](https://gist.github.com/trueadm/17beb64288e30192f3aa29cad0218067).
* [DisplayScript](http://displayscript.org/introduction.html)의 state 변수 및 state 셀.
* ReasonReact의 [리듀서 컴포넌트](https://reasonml.github.io/reason-react/docs/en/state-actions-reducer.html).
* Rx의 [구독](http://reactivex.io/rxjs/class/es6/Subscription.js~Subscription.html).
* Multicore OCaml의 [대수 효과](https://github.com/ocamllabs/ocaml-effects-tutorial#2-effectful-computations-in-a-pure-setting).

[Sebastian Markbåge](https://github.com/sebmarkbage)는 Hook의 원래 디자인을 생각해냈고, 나중에 [Andrew Clark](https://github.com/acdlite), [Sophie Alpert](https://github.com/sophiebits), [Dominic Gannaway](https://github.com/trueadm) 및 React 팀의 다른 구성원에 의해 개선되었습니다.
