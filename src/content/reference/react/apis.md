---
title: "내부에 포함된 React APIs"
---

<Intro>

[Hooks](/reference/react)와 [Components](/reference/react/components) 외에도 `react` package는 컴포넌트를 정의하는데 유용한 몇 가지 API를 가지고 있습니다. 이 페이지는 최신 React API가 모두 나열되어 있습니다.

</Intro>

---

<<<<<<< HEAD
* [`createContext`](/reference/react/createContext)를 사용하면 자식 컴포넌트에 대한 context를 정의하고 제공할 수 있습니다. 이는 [`useContext`](/reference/react/useContext)와 함께 사용됩니다.
* [`forwardRef`](/reference/react/forwardRef)를 사용하면 컴포넌트가 부모에게 DOM 노드를 ref로 노출해 줄 수 있습니다. 이는 [`useRef`](/reference/react/useRef)와 함께 사용됩니다.
* [`lazy`](/reference/react/lazy)를 사용하면 첫 렌더링이 완료될 때까지 컴포넌트의 코드의 로드를 지연시킬 수 있습니다.
* [`memo`](/reference/react/memo)를 사용하면 동일한 props에 대해 다시 렌더링하지 않습니다. [`useMemo`](/reference/react/useMemo) 및 [`useCallback`](/reference/react/useCallback)과 함께 사용됩니다.
* [`startTransition`](/reference/react/startTransition)을 사용하면 state 변경을 긴급하지 않은 것으로 간주합니다. 이는 [`useTransition`](/reference/react/useTransition)과 유사합니다.
=======
* [`createContext`](/reference/react/createContext) lets you define and provide context to the child components. Used with [`useContext`.](/reference/react/useContext)
* [`forwardRef`](/reference/react/forwardRef) lets your component expose a DOM node as a ref to the parent. Used with [`useRef`.](/reference/react/useRef)
* [`lazy`](/reference/react/lazy) lets you defer loading a component's code until it's rendered for the first time.
* [`memo`](/reference/react/memo) lets your component skip re-renders with same props. Used with [`useMemo`](/reference/react/useMemo) and [`useCallback`.](/reference/react/useCallback)
* [`startTransition`](/reference/react/startTransition) lets you mark a state update as non-urgent. Similar to [`useTransition`.](/reference/react/useTransition)

---

## Resource APIs {/*resource-apis*/}

*Resources* can be accessed by a component without having them as part of their state. For example, a component can read a message from a Promise or read styling information from a context.

To read a value from a resource, use this API:

* [`use`](/reference/react/use) lets you read the value of a resource like a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) or [context](/learn/passing-data-deeply-with-context).
```js
function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  // ...
}
```
>>>>>>> 556063bdce0ed00f29824bc628f79dac0a4be9f4
