---
title: "내장 React APIs"
---

<Intro>

[Hooks](/reference/react)와 [Components](/reference/react/components) 외에도 `react` package는 컴포넌트를 정의하는데 유용한 몇 가지 API를 가지고 있습니다. 이 페이지는 최신 React API가 모두 나열되어 있습니다.

</Intro>

---

* [`createContext`](/reference/react/createContext)를 사용하면 자식 컴포넌트에 대한 context를 정의하고 제공할 수 있습니다. 이는 [`useContext`](/reference/react/useContext)와 함께 사용됩니다.
* [`forwardRef`](/reference/react/forwardRef)를 사용하면 컴포넌트가 부모에 대한 참조로 DOM 노드를 노출해 줄 수 있습니다. 이는 [`useRef`](/reference/react/useRef)와 함께 사용됩니다.
* [`lazy`](/reference/react/lazy)를 사용하면 첫 렌더링이 완료될 때까지 컴포넌트의 코드의 로드를 지연시킬 수 있습니다.
* [`memo`](/reference/react/memo)를 사용하면 동일한 props를 다시 렌더링하지 않아도 됩니다. [`useMemo`](/reference/react/useMemo) 및 [`useCallback`](/reference/react/useCallback)과 함께 사용됩니다.
* [`startTransition`](/reference/react/startTransition)을 사용하면 state 변경을 긴급하지 않은 것으로 간주합니다. 이는 [`useTransition`](/reference/react/useTransition)과 유사합니다.
