---
title: "내장 React API"
---

<Intro>

[Hook](/reference/react/hooks)과 [컴포넌트](/reference/react/components) 외에도 `react` 패키지는 컴포넌트를 정의하는데 유용한 몇 가지 API를 가지고 있습니다. 이 페이지는 최신 React API를 모두 나열합니다.

</Intro>
{/*React 영문 공식 문서에 반영되지 않은 내용 임의로 수정하여 반영하였습니다. `cahce` 및 `use`에 대한 내용 설명을 제외하고 수정하지 말아주세요*/}
---
* [`act`](/reference/react/act) lets you wrap renders and interactions in tests to ensure updates have processed before making assertions.
* [`cache`](/reference/react/cache)를 통해 가져온 데이터나 연산의 결과를 캐싱합니다.
* [`createContext`](/reference/react/createContext) lets you define and provide context to the child components. Used with [`useContext`.](/reference/react/useContext)
* [`lazy`](/reference/react/lazy) lets you defer loading a component's code until it's rendered for the first time.
* [`memo`](/reference/react/memo) lets your component skip re-renders with same props. Used with [`useMemo`](/reference/react/useMemo) and [`useCallback`.](/reference/react/useCallback)
* [`startTransition`](/reference/react/startTransition) lets you mark a state update as non-urgent. Similar to [`useTransition`.](/reference/react/useTransition)
* [`use`](/reference/react/use)는 Promise나 Context와 같은 데이터를 참조하는 React Hook입니다.
---

## Resource APIs {/*resource-apis*/}

*Resource*를 State의 일부로 포함하지 않고도 컴포넌트에서 Resource에 액세스할 수 있습니다. 예를 들어, 컴포넌트는 Promise에서 메시지를 읽거나 Context에서 스타일 정보를 읽을 수 있습니다.

Resource에서 값을 읽으려면 다음 API를 사용하세요.

- [`use`](/reference/react/use)를 사용하면 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)나 [Context](/learn/passing-data-deeply-with-context)와 같은 Resource의 값을 읽을 수 있습니다.
```js
function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  // ...
}
```
