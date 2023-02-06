---
id: hooks-reference
title: Hooks API Reference
permalink: docs/hooks-reference.html
prev: hooks-custom.html
next: hooks-faq.html
---

*Hook*는 React 16.8에서 새로 추가된 개념입니다. Hook을 통해 class를 작성하지 않고도 state와 같은 React 기능들을 사용할 수 있습니다.

이 페이지는 React에 내장된 Hook API를 설명합니다.

Hook이 생소하다면 [Hook 개요](/docs/hooks-overview.html)를 먼저 읽어 보기 바랍니다. 혹은 [frequently asked questions](/docs/hooks-faq.html)에서 유용한 정보를 찾을 수도 있습니다.

- [기본 Hook](#basic-hooks)
  - [`useState`](#usestate)
  - [`useEffect`](#useeffect)
  - [`useContext`](#usecontext)
- [추가 Hooks](#additional-hooks)
  - [`useReducer`](#usereducer)
  - [`useCallback`](#usecallback)
  - [`useMemo`](#usememo)
  - [`useRef`](#useref)
  - [`useImperativeHandle`](#useimperativehandle)
  - [`useLayoutEffect`](#uselayouteffect)
  - [`useDebugValue`](#usedebugvalue)
  - [`useDeferredValue`](#usedeferredvalue)
  - [`useTransition`](#usetransition)
  - [`useId`](#useid)
- [Library Hooks](#library-hooks)
  - [`useSyncExternalStore`](#usesyncexternalstore)
  - [`useInsertionEffect`](#useinsertioneffect)

## 기본 Hook {#basic-hooks}

### `useState` {#usestate}

> Try the new React documentation for [`useState`](https://beta.reactjs.org/reference/react/useState).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

```js
const [state, setState] = useState(initialState);
```

상태 유지 값과 그 값을 갱신하는 함수를 반환합니다.

최초로 렌더링을 하는 동안, 반환된 state(`state`)는 첫 번째 전달된 인자(`initialState`)의 값과 같습니다.

`setState` 함수는 state를 갱신할 때 사용합니다. 새 state 값을 받아 컴포넌트 리렌더링을 큐에 등록합니다.

```js
setState(newState);
```

다음 리렌더링 시에 `useState`를 통해 반환받은 첫 번째 값은 항상 갱신된 최신 state가 됩니다.

>주의
>
>React는 `setState` 함수 동일성이 안정적이고 리렌더링 시에도 변경되지 않을 것이라는 것을 보장합니다. 이것이 `useEffect`나 `useCallback` 의존성 목록에 이 함수를 포함하지 않아도 무방한 이유입니다.

#### 함수적 갱신 {#functional-updates}

이전 state를 사용해서 새로운 state를 계산하는 경우 함수를 `setState` 로 전달할 수 있습니다. 그 함수는 이전 값을 받아 갱신된 값을 반환할 것입니다. 여기에 `setState`의 양쪽 형태를 사용한 카운터 컴포넌트의 예가 있습니다.

```js
function Counter({initialCount}) {
  const [count, setCount] = useState(initialCount);
  return (
    <>
      Count: {count}
      <button onClick={() => setCount(initialCount)}>Reset</button>
      <button onClick={() => setCount(prevCount => prevCount - 1)}>-</button>
      <button onClick={() => setCount(prevCount => prevCount + 1)}>+</button>
    </>
  );
}
```

"+"와 "-" 버튼은 함수 형식을 사용하고 있습니다. 이것은 갱신된 값이 갱신되기 이전의 값을 바탕으로 계산되기 때문입니다. 반면, "Reset" 버튼은 카운트를 항상 0으로 설정하기 때문에 일반적인 형식을 사용합니다.

업데이트 함수가 현재 상태와 정확히 동일한 값을 반환한다면 바로 뒤에 일어날 리렌더링은 완전히 건너뛰게 됩니다.

> 주의
>
> 클래스 컴포넌트의 `setState` 메서드와는 다르게, `useState`는 갱신 객체(update objects)를 자동으로 합치지는 않습니다. 함수 업데이터 폼을 객체 전개 연산자와 결합함으로써 이 동작을 복제할 수 있습니다.
>
> ```js
> const [state, setState] = useState({});
> setState(prevState => {
>   // Object.assign would also work
>   return {...prevState, ...updatedValues};
> });
> ```
>
> 다른 방법으로는 `useReducer`가 있는데 이는 여러개의 하윗값들을 포함한 state 객체를 관리하는 데에 더 적합합니다.

#### 지연 초기 state {#lazy-initial-state}

`initialState` 인자는 초기 렌더링 시에 사용하는 state입니다. 그 이후의 렌더링 시에는 이 값은 무시됩니다. 초기 state가 고비용 계산의 결과라면, 초기 렌더링 시에만 실행될 함수를 대신 제공할 수 있습니다.

```js
const [state, setState] = useState(() => {
  const initialState = someExpensiveComputation(props);
  return initialState;
});
```

#### state 갱신의 취소 {#bailing-out-of-a-state-update}

State Hook을 현재의 state와 동일한 값으로 갱신하는 경우 React는 자식을 렌더링 한다거나 무엇을 실행하는 것을 회피하고 그 처리를 종료합니다. (React는 [`Object.is` 비교 알고리즘](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description)을 사용합니다.)

실행을 회피하기 전에 React에서 특정 컴포넌트를 다시 렌더링하는 것이 여전히 필요할 수도 있다는 것에 주의하세요. React가 불필요하게 트리에 그 이상으로 「더 깊게」는 관여하지 않을 것이므로 크게 신경 쓰지 않으셔도 됩니다만, 렌더링 시에 고비용의 계산을 하고 있다면 `useMemo`를 사용하여 그것들을 최적화할 수 있습니다.

#### Batching of state updates {#batching-of-state-updates}

React may group several state updates into a single re-render to improve performance. Normally, this improves performance and shouldn't affect your application's behavior.

Before React 18, only updates inside React event handlers were batched. Starting with React 18, [batching is enabled for all updates by default](/blog/2022/03/08/react-18-upgrade-guide.html#automatic-batching). Note that React makes sure that updates from several *different* user-initiated events -- for example, clicking a button twice -- are always processed separately and do not get batched. This prevents logical mistakes.

In the rare case that you need to force the DOM update to be applied synchronously, you may wrap it in [`flushSync`](/docs/react-dom.html#flushsync). However, this can hurt performance so do this only where needed.

### `useEffect` {#useeffect}

> Try the new React documentation for [`useEffect`](https://beta.reactjs.org/reference/react/useEffect).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

```js
useEffect(didUpdate);
```

명령형 또는 어떤 effect를 발생하는 함수를 인자로 받습니다.

변형, 구독, 타이머, 로깅 또는 다른 부작용(side effects)은 (React의 _렌더링 단계에_ 따르면) 함수 컴포넌트의 본문 안에서는 허용되지 않습니다. 이를 수행한다면 그것은 매우 혼란스러운 버그 및 UI의 불일치를 야기하게 될 것입니다.

대신에 `useEffect`를 사용하세요. `useEffect`에 전달된 함수는 화면에 렌더링이 완료된 후에 수행되게 될 것입니다. React의 순수한 함수적인 세계에서 명령적인 세계로의 탈출구로 생각하세요.

기본적으로 동작은 모든 렌더링이 완료된 후에 수행됩니다만, [어떤 값이 변경되었을 때만](#conditionally-firing-an-effect) 실행되게 할 수도 있습니다.

#### effect 정리 {#cleaning-up-an-effect}

effect는 종종 컴포넌트가 화면에서 제거될 때 정리해야 하는 리소스를 만듭니다. 가령 구독이나 타이머 ID와 같은 것입니다. 이것을 수행하기 위해서 `useEffect`로 전달된 함수는 정리(clean-up) 함수를 반환할 수 있습니다. 예를 들어 구독을 생성하는 경우는 아래와 같습니다.

```js
useEffect(() => {
  const subscription = props.source.subscribe();
  return () => {
    // Clean up the subscription
    subscription.unsubscribe();
  };
});
```

정리 함수는 메모리 누수 방지를 위해 UI에서 컴포넌트를 제거하기 전에 수행됩니다. 더불어, 컴포넌트가 (그냥 일반적으로 수행하는 것처럼) 여러 번 렌더링 된다면 **다음 effect가 수행되기 전에 이전 effect는 정리됩니다**. 위의 예에서, 매 갱신마다 새로운 구독이 생성된다고 볼 수 있습니다. 갱신마다 불필요한 수행이 발생하는 것을 회피하기 위해서는 다음 절을 참고하세요.

#### effect 타이밍 {#timing-of-effects}

`componentDidMount`와 `componentDidUpdate`와는 다르게, `useEffect`로 전달된 함수는 지연 이벤트 동안에 레이아웃 배치와 그리기를 완료한 **후** 발생합니다. 이것은 구독이나 이벤트 핸들러를 설정하는 것과 같은 다수의 공통적인 부작용에 적합합니다. 왜냐면 대부분의 작업이 브라우저에서 화면을 업데이트하는 것을 차단해서는 안 되기 때문입니다.

그렇지만, 모든 effect가 지연될 수는 없습니다. 예를 들어 사용자에게 노출되는 DOM 변경은 사용자가 노출된 내용의 불일치를 경험하지 않도록 다음 화면을 다 그리기 이전에 동기화 되어야 합니다. (그 구분이란 개념적으로는 수동적 이벤트 리스너와 능동적 이벤트 리스너의 차이와 유사합니다) 이런 종류의 effect를 위해 React는 [`useLayoutEffect`](#uselayouteffect)라는 추가적인 Hook을 제공합니다. 그것은 `useEffect`와 동일한 시그니처를 가지고 있고 그것이 수행될 때에만 차이가 납니다.

Additionally, starting in React 18, the function passed to `useEffect` will fire synchronously **before** layout and paint when it's the result of a discrete user input such as a click, or when it's the result of an update wrapped in [`flushSync`](/docs/react-dom.html#flushsync). This behavior allows the result of the effect to be observed by the event system, or by the caller of [`flushSync`](/docs/react-dom.html#flushsync).

> Note
> 
> This only affects the timing of when the function passed to `useEffect` is called - updates scheduled inside these effects are still deferred. This is different than [`useLayoutEffect`](#uselayouteffect), which fires the function and processes the updates inside of it immediately.

Even in cases where `useEffect` is deferred until after the browser has painted, it's guaranteed to fire before any new renders. React will always flush a previous render's effects before starting a new update.

#### 조건부 effect 발생 {#conditionally-firing-an-effect}

effect의 기본 동작은 모든 렌더링을 완료한 후 effect를 발생하는 것입니다. 이와 같은 방법으로 의존성 중 하나가 변경된다면 effect는 항상 재생성됩니다.

그러나 이것은 이전 섹션의 구독 예시와 같이 일부 경우에는 과도한 작업일 수 있습니다. `source` props가 변경될 때에만 필요한 것이라면 매번 갱신할 때마다 새로운 구독을 생성할 필요는 없습니다.

이것을 수행하기 위해서는 `useEffect`에 두 번째 인자를 전달하세요. 이 인자는 effect가 종속되어 있는 값의 배열입니다. 이를 적용한 예는 아래와 같습니다.

```js
useEffect(
  () => {
    const subscription = props.source.subscribe();
    return () => {
      subscription.unsubscribe();
    };
  },
  [props.source],
);
```

자 이제, `props.source`가 변경될 때에만 구독이 재생성될 것입니다.

>주의
>
>이 최적화를 사용하는 경우, 값의 배열이 **시간이 지남에 따라 변경되고 effect에 사용되는 컴포넌트 범위의 모든 값들(예를 들어, props와 state와 같은 값들)을** 포함하고 있는지 확인하세요. 그렇지 않다면 여러분의 코드는 이전 렌더링에서 설정된 오래된 값을 참조하게 될 것입니다. [how to deal with functions](/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies)와 [array values change too often](/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often) 할 때 무엇을 할 것인지에 대해서 조금 더 알아보세요.
>
>effect를 수행하고 (mount를 하거나 unmount 할 때) 그것을 한 번만 실행하고 싶다면 두 번째 인자로 빈 배열(`[]`)을 전달할 수 있습니다. 이를 통해 effect는 React에게 props나 state에서 가져온 *어떤* 값에도 의존하지 않으므로, 다시 실행할 필요가 전혀 없다는 것을 알려주게 됩니다. 이것을 특별한 경우로 간주하지는 않고, 의존성 값의 배열이 항상 어떻게 동작하는지 직접적으로 보여주는 것뿐입니다.
>
>빈 배열(`[]`)을 전달한다면 effect 안에 있는 props와 state는 항상 초깃값을 가지게 될 것입니다. 두 번째 인자로써 `[]`을 전달하는 것이 친숙한 `componentDidMount`와 `componentWillUnmount`에 의한 개념과 비슷하게 느껴지겠지만, effect가 너무 자주 리렌더링 되는 것을 피하기 위한 보통 [더 나은](/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies) [해결책](/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often)이 있습니다. 또한 브라우저가 모두 그려질 때까지 React는 `useEffect`의 수행을 지연하기 때문에 다른 작업의 수행이 문제가 되지는 않는다는 것을 잊지 마세요.
>
>
>[`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) 패키지의 [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) 규칙을 사용하기를 권장합니다. 그것은 의존성이 바르지 않게 정의되었다면 그에 대해 경고하고 수정하도록 알려줍니다.

의존성 값의 배열은 effect 함수의 인자로 전달되지는 않습니다. 그렇지만 개념적으로는, 이 기법은 effect 함수가 무엇일지를 표현하는 방법입니다. effect 함수 안에서 참조되는 모든 값은 의존성 값의 배열에 드러나야 합니다. 나중에는 충분히 발전된 컴파일러가 이 배열을 자동적으로 생성할 수 있을 것입니다.

### `useContext` {#usecontext}

> Try the new React documentation for [`useContext`](https://beta.reactjs.org/reference/react/useContext).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)


```js
const value = useContext(MyContext);
```

context 객체(`React.createContext`에서 반환된 값)을 받아 그 context의 현재 값을 반환합니다. context의 현재 값은 트리 안에서 이 Hook을 호출하는 컴포넌트에 가장 가까이에 있는 `<MyContext.Provider>`의 `value` prop에 의해 결정됩니다.

컴포넌트에서 가장 가까운 `<MyContext.Provider>`가 갱신되면 이 Hook은 그 `MyContext` provider에게 전달된 가장 최신의 context `value`를 사용하여 렌더러를 트리거 합니다. 상위 컴포넌트에서 [`React.memo`](/docs/react-api.html#reactmemo) 또는 [`shouldComponentUpdate`](/docs/react-component.html#shouldcomponentupdate)를 사용하더라도 `useContext`를 사용하고 있는 컴포넌트 자체에서부터 다시 렌더링됩니다.

`useContext`로 전달한 인자는 *context 객체 그 자체*이어야 함을 잊지 마세요.

 * **맞는 사용:** `useContext(MyContext)`
 * **틀린 사용:** `useContext(MyContext.Consumer)`
 * **틀린 사용:** `useContext(MyContext.Provider)`

`useContext`를 호출한 컴포넌트는 context 값이 변경되면 항상 리렌더링 될 것입니다. 컴포넌트를 리렌더링 하는 것에 비용이 많이 든다면, [메모이제이션을 사용하여 최적화할 수 있습니다.](https://github.com/facebook/react/issues/15156#issuecomment-474590693)

>팁
>
>여러분이 Hook 보다 context API에 친숙하다면 `useContext(MyContext)`는 클래스에서의 `static contextType = MyContext` 또는 `<MyContext.Consumer>`와 같다고 보면 됩니다.
>
>`useContext(MyContext)`는 context를 *읽고* context의 변경을 구독하는 것만 가능합니다. context의 값을 설정하기 위해서는 여전히 트리의 윗 계층에서의 `<MyContext.Provider>`가 필요합니다.

**useContext를 Context.Provider와 같이 사용해주세요**
```js{31-36}
const themes = {
  light: {
    foreground: "#000000",
    background: "#eeeeee"
  },
  dark: {
    foreground: "#ffffff",
    background: "#222222"
  }
};

const ThemeContext = React.createContext(themes.light);

function App() {
  return (
    <ThemeContext.Provider value={themes.dark}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

function ThemedButton() {
  const theme = useContext(ThemeContext);

  return (
    <button style={{ background: theme.background, color: theme.foreground }}>
      I am styled by theme context!
    </button>
  );
}
```
해당 예시는 [Context 고급 안내서](/docs/context.html)에서 사용했던 예시가 hook으로 수정되었으며 안내서에서 Context를 언제, 어떻게 사용하는지 자세히 알 수 있습니다.

## 추가 Hook {#additional-hooks}

다음의 Hook는 이전 섹션에서의 기본 Hook의 변경이거나 특정한 경우에만 필요한 것입니다. 익히는 것에 너무 압박받지는 마세요.

### `useReducer` {#usereducer}

> Try the new React documentation for [`useReducer`](https://beta.reactjs.org/reference/react/useReducer).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)


```js
const [state, dispatch] = useReducer(reducer, initialArg, init);
```

[`useState`](#usestate)의 대체 함수입니다. `(state, action) => newState`의 형태로 reducer를 받고 `dispatch` 메서드와 짝의 형태로 현재 state를 반환합니다. (Redux에 익숙하다면 이것이 어떻게 동작하는지 여러분은 이미 알고 있을 것입니다.)

다수의 하윗값을 포함하는 복잡한 정적 로직을 만드는 경우나 다음 state가 이전 state에 의존적인 경우에 보통 `useState`보다 `useReducer`를 선호합니다. 또한 `useReducer`는 자세한 업데이트를 트리거 하는 컴포넌트의 성능을 최적화할 수 있게 하는데, 이것은 [콜백 대신 `dispatch`를 전달](/docs/hooks-faq.html#how-to-avoid-passing-callbacks-down) 할 수 있기 때문입니다.

아래는 [`useState`](#usestate) 내용에 있던 카운터 예시인데 reducer를 사용해서 다시 작성한 것입니다.

```js
const initialState = {count: 0};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```

>주의
>
>React는 `dispatch` 함수의 동일성이 안정적이고 리렌더링 시에도 변경되지 않으리라는 것을 보장합니다. 이것이 `useEffect`나 `useCallback` 의존성 목록에 이 함수를 포함하지 않아도 괜찮은 이유입니다.

#### 초기 state의 구체화 {#specifying-the-initial-state}

`useReducer` state의 초기화에는 두 가지 방법이 있습니다. 유스케이스에 따라서 한 가지를 선택하세요. 가장 간단한 방법은 초기 state를 두 번째 인자로 전달하는 것입니다.

```js{3}
  const [state, dispatch] = useReducer(
    reducer,
    {count: initialCount}
  );
```

>주의
>
>React에서는 Reducer의 인자로써 `state = initialState`와 같은 초기값을 나타내는, Redux에서는 보편화된 관습을 사용하지 않습니다. 때때로 초기값은 props에 의존할 필요가 있어 Hook 호출에서 지정되기도 합니다. 초기값을 나타내는 것이 정말 필요하다면 `useReducer(reducer, undefined, reducer)`를 호출하는 방법으로 Redux를 모방할 수는 있겠지만, 이 방법을 권장하지는 않습니다.

#### 초기화 지연 {#lazy-initialization}

초기 state를 조금 지연해서 생성할 수도 있습니다. 이를 위해서는 `init` 함수를 세 번째 인자로 전달합니다. 초기 state는 `init(initialArg)`에 설정될 것입니다.

이것은 reducer 외부에서 초기 state를 계산하는 로직을 추출할 수 있도록 합니다. 또한, 어떤 행동에 대한 대응으로 나중에 state를 재설정하는 데에도 유용합니다.

```js{1-3,11-12,19,24}
function init(initialCount) {
  return {count: initialCount};
}

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    case 'reset':
      return init(action.payload);
    default:
      throw new Error();
  }
}

function Counter({initialCount}) {
  const [state, dispatch] = useReducer(reducer, initialCount, init);
  return (
    <>
      Count: {state.count}
      <button
        onClick={() => dispatch({type: 'reset', payload: initialCount})}>
        Reset
      </button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```

#### dispatch의 회피 {#bailing-out-of-a-dispatch}

Reducer Hook에서 현재 state와 같은 값을 반환하는 경우 React는 자식을 리렌더링하거나 effect를 발생하지 않고 이것들을 회피할 것입니다. (React는 [`Object.is` 비교 알고리즘](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description)을 사용합니다.)

실행을 회피하기 전에 React에서 특정 컴포넌트를 다시 렌더링하는 것이 여전히 필요할 수도 있다는 것에 주의하세요. React가 불필요하게 트리에 그 이상으로 「더 깊게」 까지는 가지 않을 것이므로 크게 신경 쓰지 않으셔도 됩니다. 렌더링 시에 고비용의 계산을 하고 있다면 `useMemo`를 사용하여 그것들을 최적화할 수 있습니다.

### `useCallback` {#usecallback}

> Try the new React documentation for [`useCallback`](https://beta.reactjs.org/reference/react/useCallback).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

```js
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
```

[메모이제이션된](https://ko.wikipedia.org/wiki/%EB%A9%94%EB%AA%A8%EC%9D%B4%EC%A0%9C%EC%9D%B4%EC%85%98) 콜백을 반환합니다.

인라인 콜백과 그것의 의존성 값의 배열을 전달하세요. `useCallback`은 콜백의 메모이제이션된 버전을 반환할 것입니다. 그 메모이제이션된 버전은 콜백의 의존성이 변경되었을 때에만 변경됩니다. 이것은, 불필요한 렌더링을 방지하기 위해 (예로 `shouldComponentUpdate`를 사용하여) 참조의 동일성에 의존적인 최적화된 자식 컴포넌트에 콜백을 전달할 때 유용합니다.

`useCallback(fn, deps)`은 `useMemo(() => fn, deps)`와 같습니다.

> 주의
>
> 의존성 값의 배열이 콜백에 인자로 전달되지는 않습니다. 그렇지만 개념적으로는, 이 기법은 콜백 함수가 무엇일지를 표현하는 방법입니다. 콜백 안에서 참조되는 모든 값은 의존성 값의 배열에 나타나야 합니다. 나중에는 충분히 발전된 컴파일러가 이 배열을 자동적으로 생성할 수 있을 것입니다.
>
> [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) 패키지의 일부로써 [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) 규칙을 사용하기를 권장합니다. 그것은 의존성이 바르지 않게 정의되었다면 그에 대해 경고하고 수정하도록 알려줍니다.

### `useMemo` {#usememo}

> Try the new React documentation for [`useMemo`](https://beta.reactjs.org/reference/react/useMemo).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)


```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

[메모이제이션된](https://ko.wikipedia.org/wiki/%EB%A9%94%EB%AA%A8%EC%9D%B4%EC%A0%9C%EC%9D%B4%EC%85%98) 값을 반환합니다.

"생성(create)" 함수와 그것의 의존성 값의 배열을 전달하세요. `useMemo`는 의존성이 변경되었을 때에만 메모이제이션된 값만 다시 계산 할 것입니다. 이 최적화는 모든 렌더링 시의 고비용 계산을 방지하게 해 줍니다.

`useMemo`로 전달된 함수는 렌더링 중에 실행된다는 것을 기억하세요. 통상적으로 렌더링 중에는 하지 않는 것을 이 함수 내에서 하지 마세요. 예를 들어, 사이드 이펙트(side effects)는 `useEffect`에서 하는 일이지 `useMemo`에서 하는 일이 아닙니다.

배열이 없는 경우 매 렌더링 때마다 새 값을 계산하게 될 것입니다.

**`useMemo`는 성능 최적화를 위해 사용할 수는 있지만 의미상으로 보장이 있다고 생각하지는 마세요.** 가까운 미래에 React에서는, 이전 메모이제이션된 값들의 일부를 "잊어버리고" 다음 렌더링 시에 그것들을 재계산하는 방향을 택할지도 모르겠습니다. 예를 들면, 오프스크린 컴포넌트의 메모리를 해제하는 등이 있을 수 있습니다. `useMemo`를 사용하지 않고도 동작할 수 있도록 코드를 작성하고 그것을 추가하여 성능을 최적화하세요.

> 주의
>
> 의존성 값의 배열은 함수에 인자로 전달되지는 않습니다. 그렇지만 개념적으로는, 이 기법은 함수가 무엇일지를 표현하는 방법입니다. 함수 안에서 참조되는 모든 값은 의존성 값의 배열에 나타나야 합니다. 나중에는 충분히 발전된 컴파일러가 이 배열을 자동으로 생성할 수 있을 것입니다.
>
> [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) 패키지의 일부로써 [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) 규칙을 사용하기를 권장합니다. 그것은 의존성이 바르지 않게 정의되었다면 그에 대해 경고하고 수정하도록 알려줍니다.

### `useRef` {#useref}

> Try the new React documentation for [`useRef`](https://beta.reactjs.org/reference/react/useRef).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)


```js
const refContainer = useRef(initialValue);
```

`useRef`는 `.current` 프로퍼티로 전달된 인자(`initialValue`)로 초기화된 변경 가능한 ref 객체를 반환합니다. 반환된 객체는 컴포넌트의 전 생애주기를 통해 유지될 것입니다.

일반적인 유스케이스는 자식에게 명령적으로 접근하는 경우입니다.

```js
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` points to the mounted text input element
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```

본질적으로 `useRef`는 `.current` 프로퍼티에 변경 가능한 값을 담고 있는 "상자"와 같습니다.

아마도 여러분은 [DOM에 접근](/docs/refs-and-the-dom.html)하는 방법으로 refs에 친숙할 지도 모르겠습니다. `<div ref={myRef} />`를 사용하여 React로 ref 객체를 전달한다면, React는 노드가 변경될 때마다 변경된 DOM 노드에 그것의 `.current` 프로퍼티를 설정할 것입니다.

그렇지만, `ref` 속성보다 `useRef()`가 더 유용합니다. 이 기능은 클래스에서 인스턴스 필드를 사용하는 방법과 유사한 [어떤 가변값을 유지하는 데에 편리합니다](/docs/hooks-faq.html#is-there-something-like-instance-variables).

이것은 `useRef()`가 순수 자바스크립트 객체를 생성하기 때문입니다. `useRef()`와 `{current: ...}` 객체 자체를 생성하는 것의 유일한 차이점이라면 `useRef`는 매번 렌더링을 할 때 동일한 ref 객체를 제공한다는 것입니다.

`useRef`는 내용이 변경될 때 그것을 알려주지는 *않는다*는 것을 유념하세요. `.current` 프로퍼티를 변형하는 것이 리렌더링을 발생시키지는 않습니다. React가 DOM 노드에 ref를 attach하거나 detach할 때 어떤 코드를 실행하고 싶다면 대신 [콜백 ref](/docs/hooks-faq.html#how-can-i-measure-a-dom-node)를 사용하세요.


### `useImperativeHandle` {#useimperativehandle}

> Try the new React documentation for [`useImperativeHandle`](https://beta.reactjs.org/reference/react/useImperativeHandle).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)


```js
useImperativeHandle(ref, createHandle, [deps])
```

`useImperativeHandle`은 `ref`를 사용할 때 부모 컴포넌트에 노출되는 인스턴스 값을 사용자화(customizes)합니다. 항상 그렇듯이, 대부분의 경우 ref를 사용한 명령형 코드는 피해야 합니다. `useImperativeHandle`는 [`forwardRef`](/docs/react-api.html#reactforwardref)와 더불어 사용하세요.

```js
function FancyInput(props, ref) {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }));
  return <input ref={inputRef} ... />;
}
FancyInput = forwardRef(FancyInput);
```

위의 예시에서 `<FancyInput ref={inputRef} />`를 렌더링한 부모 컴포넌트는 `inputRef.current.focus()`를 호출할 수 있습니다.

### `useLayoutEffect` {#uselayouteffect}

<<<<<<< HEAD
이 함수의 시그니처는 `useEffect`와 동일하긴 한데, 모든 DOM 변경 후에 동기적으로 발생합니다. 이것은 DOM에서 레이아웃을 읽고 동기적으로 리렌더링하는 경우에 사용하세요. `useLayoutEffect`의 내부에 예정된 갱신은 브라우저가 화면을 그리기 이전 시점에 동기적으로 수행될 것입니다.
=======
> Try the new React documentation for [`useLayoutEffect`](https://beta.reactjs.org/reference/react/useLayoutEffect).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)


The signature is identical to `useEffect`, but it fires synchronously after all DOM mutations. Use this to read layout from the DOM and synchronously re-render. Updates scheduled inside `useLayoutEffect` will be flushed synchronously, before the browser has a chance to paint.
>>>>>>> d4e42ab21f0cc7d8b79d1a619654e27c79e10af6

화면 갱신 차단의 방지가 가능할 때 표준 `useEffect`를 먼저 사용하세요.

>팁
>
>클래스 컴포넌트에서 코드를 변환하는 경우에 `useLayoutEffect`는 `componentDidMount`나 `componentDidUpdate`와 동일한 단계를 실행하게 된다는 것에 주의하기 바랍니다. 그렇기는 하지만, **먼저 `useEffect`를 사용해 보고** 문제가 있다면 그다음으로 `useLayoutEffect`를 사용해 보기를 권합니다.
>
>서버 렌더링을 사용하는 경우라면 자바스크립트가 모두 다운로드될 때까지는 `useLayoutEffect`와 `useEffect` *어느 것도* 실행되지 않는다는 것을 명심해야 합니다. 이것이 서버에서 렌더링 되는 컴포넌트에서 `useLayoutEffect`가 사용되는 경우에 대해 React가 경고하는 이유입니다. 이를 수정하기 위해서는 (최초 렌더링 시에 필요하지 않다면) 로직을 `useEffect`로 이동한다거나 (`useLayoutEffect`가 수행될 때까지 HTML이 깨져 보이는 경우는) 클라이언트 렌더링이 완료될 때까지 컴포넌트 노출을 지연하도록 하세요.
>
>서버에서 렌더링된 HTML에서 레이아웃 effect가 필요한 컴포넌트를 배제하고 싶다면, `showChild && <Child />`를 사용하여 조건적으로 렌더링 하고 `useEffect(() => { setShowChild(true); }, [])`를 사용하여 노출을 지연시키세요. 이런 방법으로 자바스크립트 코드가 주입되기 전에 깨져 보일 수 있는 UI는 표현되지 않게 됩니다.

### `useDebugValue` {#usedebugvalue}

> Try the new React documentation for [`useDebugValue`](https://beta.reactjs.org/reference/react/useDebugValue).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)


```js
useDebugValue(value)
```

`useDebugValue`는 React 개발자도구에서 사용자 Hook 레이블을 표시하는 데에 사용할 수 있습니다.

예를 들어, ["나만의 Hook 만들기"](/docs/hooks-custom.html)에 설명하고 있는 `useFriendStatus` 사용자 Hook에 대해서 생각해 봅시다.

```js{6-8}
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  // ...

  // Show a label in DevTools next to this Hook
  // e.g. "FriendStatus: Online"
  useDebugValue(isOnline ? 'Online' : 'Offline');

  return isOnline;
}
```

> 팁
>
> 모든 사용자 Hook에 디버그 값을 추가하기를 권하지는 않습니다. 이것은 사용자 Hook이 공유된 라이브러리의 일부일 때 가장 유용합니다.

#### 디버그 값 포맷팅 지연하기 {#defer-formatting-debug-values}

경우에 따라 디스플레이 값을 포맷팅하는 것이 고비용의 연산일 수 있습니다. 또한, 사실상 Hook이 감지되지 않는다면 불필요하기도 합니다.

이런 이유로 `useDebugValue`는 옵션 두 번째 파라미터로 포맷팅 함수를 전달할 수도 있습니다. 이 함수는 Hook가 감지되었을 때만 호출됩니다. 이것은 파라미터로써 디버그 값을 전달받아 포맷된 노출값을 반환해야 합니다.

예를 들어 사용자 Hook은 다음의 포맷 형식을 사용해서 `toDateString` 함수를 불필요하게 호출하는 것을 방지할 수 있습니다.

```js
useDebugValue(date, date => date.toDateString());
```

### `useDeferredValue` {#usedeferredvalue}

> Try the new React documentation for [`useDeferredValue`](https://beta.reactjs.org/reference/react/useDeferredValue).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)


```js
const deferredValue = useDeferredValue(value);
```

`useDeferredValue` accepts a value and returns a new copy of the value that will defer to more urgent updates. If the current render is the result of an urgent update, like user input, React will return the previous value and then render the new value after the urgent render has completed.

This hook is similar to user-space hooks which use debouncing or throttling to defer updates. The benefits to using `useDeferredValue` is that React will work on the update as soon as other work finishes (instead of waiting for an arbitrary amount of time), and like [`startTransition`](/docs/react-api.html#starttransition), deferred values can suspend without triggering an unexpected fallback for existing content.

#### Memoizing deferred children {#memoizing-deferred-children}
`useDeferredValue` only defers the value that you pass to it. If you want to prevent a child component from re-rendering during an urgent update, you must also memoize that component with [`React.memo`](/docs/react-api.html#reactmemo) or [`React.useMemo`](/docs/hooks-reference.html#usememo):

```js
function Typeahead() {
  const query = useSearchQuery('');
  const deferredQuery = useDeferredValue(query);

  // Memoizing tells React to only re-render when deferredQuery changes,
  // not when query changes.
  const suggestions = useMemo(() =>
    <SearchSuggestions query={deferredQuery} />,
    [deferredQuery]
  );

  return (
    <>
      <SearchInput query={query} />
      <Suspense fallback="Loading results...">
        {suggestions}
      </Suspense>
    </>
  );
}
```

Memoizing the children tells React that it only needs to re-render them when `deferredQuery` changes and not when `query` changes. This caveat is not unique to `useDeferredValue`, and it's the same pattern you would use with similar hooks that use debouncing or throttling.

### `useTransition` {#usetransition}

> Try the new React documentation for [`useTransition`](https://beta.reactjs.org/reference/react/useTransition).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)


```js
const [isPending, startTransition] = useTransition();
```

Returns a stateful value for the pending state of the transition, and a function to start it.

`startTransition` lets you mark updates in the provided callback as transitions:

```js
startTransition(() => {
  setCount(count + 1);
});
```

`isPending` indicates when a transition is active to show a pending state:

```js
function App() {
  const [isPending, startTransition] = useTransition();
  const [count, setCount] = useState(0);
  
  function handleClick() {
    startTransition(() => {
      setCount(c => c + 1);
    });
  }

  return (
    <div>
      {isPending && <Spinner />}
      <button onClick={handleClick}>{count}</button>
    </div>
  );
}
```

> Note:
>
> Updates in a transition yield to more urgent updates such as clicks.
>
> Updates in a transitions will not show a fallback for re-suspended content. This allows the user to continue interacting with the current content while rendering the update.

### `useId` {#useid}

> Try the new React documentation for [`useId`](https://beta.reactjs.org/reference/react/useId).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)


```js
const id = useId();
```

`useId` is a hook for generating unique IDs that are stable across the server and client, while avoiding hydration mismatches.

> Note
>
> `useId` is **not** for generating [keys in a list](/docs/lists-and-keys.html#keys). Keys should be generated from your data.

For a basic example, pass the `id` directly to the elements that need it:

```js
function Checkbox() {
  const id = useId();
  return (
    <>
      <label htmlFor={id}>Do you like React?</label>
      <input id={id} type="checkbox" name="react"/>
    </>
  );
};
```

For multiple IDs in the same component, append a suffix using the same `id`:

```js
function NameFields() {
  const id = useId();
  return (
    <div>
      <label htmlFor={id + '-firstName'}>First Name</label>
      <div>
        <input id={id + '-firstName'} type="text" />
      </div>
      <label htmlFor={id + '-lastName'}>Last Name</label>
      <div>
        <input id={id + '-lastName'} type="text" />
      </div>
    </div>
  );
}
```

> Note:
> 
> `useId` generates a string that includes the `:` token. This helps ensure that the token is unique, but is not supported in CSS selectors or APIs like `querySelectorAll`.
> 
> `useId` supports an `identifierPrefix` to prevent collisions in multi-root apps. To configure, see the options for [`hydrateRoot`](/docs/react-dom-client.html#hydrateroot) and [`ReactDOMServer`](/docs/react-dom-server.html).

## Library Hooks {#library-hooks}

The following Hooks are provided for library authors to integrate libraries deeply into the React model, and are not typically used in application code.

### `useSyncExternalStore` {#usesyncexternalstore}

> Try the new React documentation for [`useSyncExternalStore`](https://beta.reactjs.org/reference/react/useSyncExternalStore).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)


```js
const state = useSyncExternalStore(subscribe, getSnapshot[, getServerSnapshot]);
```

`useSyncExternalStore` is a hook recommended for reading and subscribing from external data sources in a way that's compatible with concurrent rendering features like selective hydration and time slicing.

This method returns the value of the store and accepts three arguments:
- `subscribe`: function to register a callback that is called whenever the store changes.
- `getSnapshot`: function that returns the current value of the store.
- `getServerSnapshot`: function that returns the snapshot used during server rendering.

The most basic example simply subscribes to the entire store:

```js
const state = useSyncExternalStore(store.subscribe, store.getSnapshot);
```

However, you can also subscribe to a specific field:

```js
const selectedField = useSyncExternalStore(
  store.subscribe,
  () => store.getSnapshot().selectedField,
);
```

When server rendering, you must serialize the store value used on the server, and provide it to `useSyncExternalStore`. React will use this snapshot during hydration to prevent server mismatches:

```js
const selectedField = useSyncExternalStore(
  store.subscribe,
  () => store.getSnapshot().selectedField,
  () => INITIAL_SERVER_SNAPSHOT.selectedField,
);
```

> Note:
>
> `getSnapshot` must return a cached value. If getSnapshot is called multiple times in a row, it must return the same exact value unless there was a store update in between.
> 
> A shim is provided for supporting multiple React versions published as `use-sync-external-store/shim`. This shim will prefer `useSyncExternalStore` when available, and fallback to a user-space implementation when it's not.
> 
> As a convenience, we also provide a version of the API with automatic support for memoizing the result of getSnapshot published as `use-sync-external-store/with-selector`.

### `useInsertionEffect` {#useinsertioneffect}

> Try the new React documentation for [`useInsertionEffect`](https://beta.reactjs.org/reference/react/useInsertionEffect).
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

```js
useInsertionEffect(didUpdate);
```

The signature is identical to `useEffect`, but it fires synchronously _before_ all DOM mutations. Use this to inject styles into the DOM before reading layout in [`useLayoutEffect`](#uselayouteffect). Since this hook is limited in scope, this hook does not have access to refs and cannot schedule updates.

> Note:
>
> `useInsertionEffect` should be limited to css-in-js library authors. Prefer [`useEffect`](#useeffect) or [`useLayoutEffect`](#uselayouteffect) instead.
