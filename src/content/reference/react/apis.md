---
title: "내부에 포함된 React APIs"
---

<Intro>

[Hooks](/reference/react)와 [Components](/reference/react/components) 외에도 `react` package는 컴포넌트를 정의하는데 유용한 몇 가지 API를 가지고 있습니다. 이 페이지는 최신 React API가 모두 나열되어 있습니다.

</Intro>

---

* [`createContext`](/reference/react/createContext)를 사용하면 자식 컴포넌트에 대한 context를 정의하고 제공할 수 있습니다. 이는 [`useContext`](/reference/react/useContext)와 함께 사용됩니다.
* [`forwardRef`](/reference/react/forwardRef)를 사용하면 컴포넌트가 부모에게 DOM 노드를 ref로 노출해 줄 수 있습니다. 이는 [`useRef`](/reference/react/useRef)와 함께 사용됩니다.
* [`lazy`](/reference/react/lazy)를 사용하면 첫 렌더링이 완료될 때까지 컴포넌트의 코드의 로드를 지연시킬 수 있습니다.
* [`memo`](/reference/react/memo)를 사용하면 동일한 props에 대해 다시 렌더링하지 않습니다. [`useMemo`](/reference/react/useMemo) 및 [`useCallback`](/reference/react/useCallback)과 함께 사용됩니다.
* [`startTransition`](/reference/react/startTransition)을 사용하면 state 변경을 긴급하지 않은 것으로 간주합니다. 이는 [`useTransition`](/reference/react/useTransition)과 유사합니다.

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
