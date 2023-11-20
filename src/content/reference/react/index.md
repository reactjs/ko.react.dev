---
<<<<<<< HEAD
title: "React에 내장된 Hooks"
=======
title: React Reference Overview
>>>>>>> 4f9e9a56611c7a56b9506cf0a7ca84ab409824bc
---

<Intro>

<<<<<<< HEAD
*Hooks*는 컴포넌트에서 다양한 React 기능을 사용할 수 있게 해줍니다. 내장된 Hooks를 사용하거나 조합하여 직접 만들 수도 있습니다. 이 페이지는 React에서 제공하는 모든 내장된 Hooks의 목록을 제공합니다.
=======
This section provides detailed reference documentation for working with React. For an introduction to React, please visit the [Learn](/learn) section.
>>>>>>> 4f9e9a56611c7a56b9506cf0a7ca84ab409824bc

</Intro>

Our The React reference documentation is broken down into functional subsections:

## React {/*react*/}

<<<<<<< HEAD
*State*는 컴포넌트가 [사용자 입력과 같은 정보를 "기억"](/learn/state-a-components-memory)할 수 있게 해줍니다. 예를 들어, 폼 컴포넌트는 입력값 저장을 위해 state를 사용할 수 있고, 이미지 갤러리 컴포넌트는 선택된 이미지 인덱스를 저장하기 위해 state를 사용할 수 있습니다.

컴포넌트에 state를 추가하려면, 다음 Hooks를 사용하세요.

* [`useState`](/reference/react/useState)는 직접 업데이트할 수 있는 state 변수를 선언합니다.
* [`useReducer`](/reference/react/useReducer)는 [reducer 함수](/learn/extracting-state-logic-into-a-reducer) 내에서 업데이트 로직이 포함된 state 변수를 선언합니다.
=======
Programmatic React features:

* [Hooks](/reference/react/hooks) - Use different React features from your components.
* [Components](/reference/react/components) - Documents built-in components that you can use in your JSX.
* [APIs](/reference/react/apis) - APIs that are useful for defining components.
* [Directives](/reference/react/directives) - Provide instructions to bundlers compatible with React Server Components.

## React DOM {/*react-dom*/}
>>>>>>> 4f9e9a56611c7a56b9506cf0a7ca84ab409824bc

React-dom contains features that are only supported for web applications (which run in the browser DOM environment). This section is broken into the following:

* [Hooks](/reference/react-dom/hooks) - Hooks for web applications which run in the browser DOM environment.
* [Components](/reference/react-dom/components) - React supports all of the browser built-in HTML and SVG components.
* [APIs](/reference/react-dom) - The `react-dom` package contains methods supported only in web applications.
* [Client APIs](/reference/react-dom/client) - The `react-dom/client` APIs let you render React components on the client (in the browser).
* [Server APIs](/reference/react-dom/server) - The `react-dom/server` APIs let you render React components to HTML on the server.

## Legacy APIs {/*legacy-apis*/}

<<<<<<< HEAD
*Context*는 컴포넌트가 [props로 전달하지 않고도 먼 부모로부터 정보를 받을 수 있게 해줍니다.](/learn/passing-props-to-a-component) 예를 들어, 앱의 최상위 컴포넌트는 현재 UI 테마를 깊이와 관계없이 모든 하위 컴포넌트에 전달할 수 있습니다.

* [`useContext`](/reference/react/useContext)는 context를 읽고 구독하는 역할을 합니다.

```js
function Button() {
  const theme = useContext(ThemeContext);
  // ...
```

---

## Ref Hooks {/*ref-hooks*/}

*Refs*는 DOM 노드나 타임아웃 ID 와 같은 [렌더링에 사용되지 않는 정보](/learn/referencing-values-with-refs)를 보유할 수 있도록 해줍니다. state와 달리 ref를 업데이트하면 컴포넌트를 다시 렌더링하지 않습니다. Refs는 React 패러다임에서의 "escape hatch"입니다. 내장된 브라우저 API와 같은 React 외부 시스템과 작업해야 할 때 유용합니다.

* [`useRef`](/reference/react/useRef)는 ref를 선언합니다. ref에는 어떤 값이든 가질 수 있지만, 주로 DOM 노드를 보관합니다.
* [`useImperativeHandle`](/reference/react/useImperativeHandle)은 컴포넌트가 노출하는 ref를 정의합니다. 이 기능은 사용 빈도가 낮습니다.

```js
function Form() {
  const inputRef = useRef(null);
  // ...
```

---

## Effect Hooks {/*effect-hooks*/}

*Effects*는 컴포넌트를 [외부 시스템과 연결하고 동기화합니다.](/learn/synchronizing-with-effects) 네트워크, 브라우저 DOM, 애니메이션, 다른 UI 라이브러리로 작성된 위젯 및 기타 React 이외의 코드를 다룰 때 사용합니다.

* [`useEffect`](/reference/react/useEffect)는 컴포넌트를 외부 시스템에 연결하는 역할을 합니다.

```js
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
  // ...
```

Effects는 React 패러다임에서의 "escape hatch"입니다. 애플리케이션의 데이터 흐름을 조율하기 위해 Effects를 사용하지 마세요. 외부 시스템과 상호작용하지 않는다면, [Effect가 필요하지 않을 수도 있습니다.](/learn/you-might-not-need-an-effect)

`useEffect`에는 사용 빈도가 낮은 두 가지 변형이 있습니다. 두 가지 변형은 타이밍 측면에서 차이가 있습니다.

* [`useLayoutEffect`](/reference/react/useLayoutEffect)는 브라우저가 화면을 다시 그리기 전에 실행되며, 레이아웃을 계산할 수 있습니다.
* [`useInsertionEffect`](/reference/react/useInsertionEffect)는 React가 DOM에 변경 사항을 적용하기 전에 실행됩니다. 이때 라이브러리는 동적 CSS를 삽입할 수 있습니다.

---

## Performance Hooks {/*performance-hooks*/}

리렌더링 성능을 최적화하는 일반적인 방법은 불필요한 작업을 건너뛰는 것입니다. 예를 들어, React에서 이전 렌더링 이후 데이터가 변경되지 않았다면 캐시 된 계산을 재사용하거나 리렌더링을 건너뛰도록 지시할 수 있습니다.

계산을 생략하고 불필요한 리렌더링을 방지하기 위해 다음 중 하나의 Hook을 사용하세요.

- [`useMemo`](/reference/react/useMemo)는 비용이 많이 드는 계산의 결과를 캐시합니다.
- [`useCallback`](/reference/react/useCallback)은 최적화된 컴포넌트에 전달하기 전에 함수 정의를 캐시합니다.

```js
function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

때로는 실제 화면을 업데이트해야 해서 리렌더링을 건너뛸 수 없습니다. 이 경우에는 사용자 인터페이스를 차단하지 않아도 되는 논블로킹 업데이트(예시: 차트 업데이트)와 동기적으로 처리해야 하는 블로킹 업데이트(예시: 입력 필드에 타이핑)를 분리함으로써 성능을 향상할 수 있습니다.

렌더링 우선순위를 설정하기 위해 다음 중 하나의 Hook을 사용하세요.

- [`useTransition`](/reference/react/useTransition)은 state 전환을 논블로킹으로 표시하고 다른 업데이트가 이를 중단시킬 수 있습니다.
- [`useDeferredValue`](/reference/react/useDeferredValue)는 UI의 덜 중요한 부분의 업데이트를 미루고, 다른 부분이 먼저 업데이트되도록 허용합니다.

---

## Resource Hooks {/*resource-hooks*/}

컴포넌트는 *Resources*를 상태의 일부로 포함하지 않고도 접근할 수 있습니다. 예를 들어 컴포넌트는 Promise 로 부터 메세지를 읽거나 context 로 부터 styling 정보를 가져올 수 있습니다.
resource 를 통해서 값을 읽으려면 다음 Hook 를 사용할 수 있습니다.


- [`use`](/reference/react/use) [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 또는 [context](/learn/passing-data-deeply-with-context) 와 같은 리소스 값을 읽을 수 있습니다.

```js
function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  // ...
}
```

---

## 추가로 제공되는 Hooks {/*other-hooks*/}

이러한 Hooks는 주로 라이브러리 개발자에게 유용하며, 일반적으로 애플리케이션 코드에서는 자주 사용하지 않습니다.

- [`useDebugValue`](/reference/react/useDebugValue)는 커스텀 Hook에 대해 React DevTools에서 표시되는 레이블을 사용자 정의합니다.
- [`useId`](/reference/react/useId)는 컴포넌트에서 고유한 ID를 스스로 연결할 수 있게 해줍니다. 일반적으로 접근성 API와 함께 사용합니다.
- [`useSyncExternalStore`](/reference/react/useSyncExternalStore)는 컴포넌트가 외부 저장소를 구독할 수 있게 해줍니다.

---

## 사용자 정의 Hooks {/*your-own-hooks*/}

JavaScript 함수로 [사용자 정의 커스텀 Hooks](/learn/reusing-logic-with-custom-hooks#extracting-your-own-custom-hook-from-a-component)를 정의할 수 있습니다.
=======
* [Legacy APIs](/reference/react/legacy) - Exported from the `react` package, but not recommended for use in newly written code.
>>>>>>> 4f9e9a56611c7a56b9506cf0a7ca84ab409824bc
