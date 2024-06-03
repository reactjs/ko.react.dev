---
title: "내부에 포함된 React APIs"
---

<Intro>

[Hooks](/reference/react)와 [Components](/reference/react/components) 외에도 `react` package는 컴포넌트를 정의하는데 유용한 몇 가지 API를 가지고 있습니다. 이 페이지는 최신 React API가 모두 나열되어 있습니다.

</Intro>

---
* [`createContext`](/reference/react/createContext) lets you define and provide context to the child components. Used with [`useContext`.](/reference/react/useContext)
* [`forwardRef`](/reference/react/forwardRef) lets your component expose a DOM node as a ref to the parent. Used with [`useRef`.](/reference/react/useRef)
* [`lazy`](/reference/react/lazy) lets you defer loading a component's code until it's rendered for the first time.
* [`memo`](/reference/react/memo) lets your component skip re-renders with same props. Used with [`useMemo`](/reference/react/useMemo) and [`useCallback`.](/reference/react/useCallback)
* [`startTransition`](/reference/react/startTransition) lets you mark a state update as non-urgent. Similar to [`useTransition`.](/reference/react/useTransition)
* [`act`](/reference/react/act) lets you wrap renders and interactions in tests to ensure updates have processed before making assertions.
---

## Resource APIs {/*resource-apis*/}

*Resource*를 state의 일부로 포함하지 않고도 컴포넌트에서 resource에 액세스할 수 있습니다. 예를 들어, 구성 요소는 Promise에서 메시지를 읽거나 context에서 스타일 정보를 읽을 수 있습니다.

resource에서 값을 읽으려면 다음 API를 사용하세요.

- [`use`](/reference/react/use)를 사용하면 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)나 [context](/learn/passing-data-deeply-with-context)와 같은 resource의 값을 읽을 수 있습니다.
```js
function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  // ...
}
```
