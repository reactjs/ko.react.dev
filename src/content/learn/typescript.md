---
title: TypeScript 사용하기
re: https://github.com/reactjs/react.dev/issues/5960
---

<Intro>

TypeScript는 JavaScript 코드 베이스에 타입 정의를 추가하는 데 널리 사용되는 방법입니다. 기본적으로 TypeScript는 [JSX를 지원](/learn/writing-markup-with-jsx)하며, [`@types/react`](https://www.npmjs.com/package/@types/react) 및 [`@types/react-dom`](https://www.npmjs.com/package/@types/react-dom)을 추가하면 완전한 React Web 지원을 받을 수 있습니다.

</Intro>

<YouWillLearn>

* [TypeScript with React Components](/learn/typescript#typescript-with-react-components)
* [Examples of typing with Hooks](/learn/typescript#example-hooks)
* [Common types from `@types/react`](/learn/typescript#useful-types)
* [Further learning locations](/learn/typescript#further-learning)

</YouWillLearn>

## 설치 {/*installation*/}

All [production-grade React frameworks](/learn/start-a-new-react-project#full-stack-frameworks) offer support for using TypeScript. Follow the framework specific guide for installation:

- [Next.js](https://nextjs.org/docs/app/building-your-application/configuring/typescript)
- [Remix](https://remix.run/docs/en/1.19.2/guides/typescript)
- [Gatsby](https://www.gatsbyjs.com/docs/how-to/custom-configuration/typescript/)
- [Expo](https://docs.expo.dev/guides/typescript/)

### 기존 React 프로젝트에 TypeScript 추가하기 {/*adding-typescript-to-an-existing-react-project*/}

최신 버전의 React 타입 정의를 설치합니다.

<TerminalBlock>
npm install --save-dev @types/react @types/react-dom
</TerminalBlock>

다음 컴파일러 옵션을 `tsconfig.json`에 설정해야 합니다.

1. `dom` must be included in [`lib`](https://www.typescriptlang.org/tsconfig/#lib) (Note: If no `lib` option is specified, `dom` is included by default).
2. [`jsx`](https://www.typescriptlang.org/tsconfig/#jsx) must be set to one of the valid options. `preserve` should suffice for most applications.
  If you're publishing a library, consult the [`jsx` documentation](https://www.typescriptlang.org/tsconfig/#jsx) on what value to choose.

## React 컴포넌트가 있는 TypeScript {/*typescript-with-react-components*/}

<Note>

JSX를 포함하고 있는 모든 파일은 `.tsx` 파일 확장자를 사용해야 합니다. 이는 이 파일이 JSX를 포함하고 있음을 TypeScript에 알려주는 TypeScript 전용 확장자입니다.

</Note>

React와 함께 TypeScript를 작성하는 것은 React와 함께 JavaScript를 작성하는 것과 매우 유사합니다. 컴포넌트로 작업할 때 가장 중요한 차이점은 컴포넌트의 props에 타입을 제공할 수 있다는 점입니다. 이러한 타입은 에디터에서 정확성을 검사하고 인라인 문서를 제공하는 데 사용할 수 있습니다.

[빠르게 시작하기](/learn) 가이드에서 가져온 [`MyButton` 컴포넌트](/learn#components)를 예로 들어 버튼의 `title`을 설명하는 타입을 추가할 수 있습니다.

<Sandpack>

```tsx src/App.tsx active
function MyButton({ title }: { title: string }) {
  return (
    <button>{title}</button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton title="I'm a button" />
    </div>
  );
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```
</Sandpack>

 <Note>

이 문서에 있는 샌드박스들은 TypeScript 코드를 다룰 수는 있지만 타입을 검사하지는 않습니다. 즉, TypeScript 샌드박스를 수정하여 학습할 수는 있지만 타입 오류나 경고는 발생하지 않습니다. 타입 검사를 받으려면, [TypeScript Playground](https://www.typescriptlang.org/ko/play)를 사용하거나 더 완전한 기능을 갖춘 온라인 샌드박스를 사용할 수 있습니다.

</Note>

이 인라인 문법은 컴포넌트에 타입을 제공하는 가장 간단한 방법이지만, 설명할 필드가 많아지기 시작하면 다루기 어려워질 수 있습니다. 대신, `interface`나 `type`을 사용하여 컴포넌트의 props를 설명할 수 있습니다.

<Sandpack>

```tsx src/App.tsx active
interface MyButtonProps {
  /** 버튼 안에 보여질 텍스트 */
  title: string;
  /** 버튼이 상호작용할 수 있는지 여부 */
  disabled: boolean;
}

function MyButton({ title, disabled }: MyButtonProps) {
  return (
    <button disabled={disabled}>{title}</button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton title="I'm a disabled button" disabled={true}/>
    </div>
  );
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

컴포넌트의 props를 설명하는 타입은 원하는 만큼 단순하거나 복잡할 수 있지만, `type` 또는 `interface`로 설명되는 객체 타입이어야 합니다. TypeScript가 객체를 설명하는 방법에 대해 [객체 타입](https://www.typescriptlang.org/docs/handbook/2/objects.html)에서 배울 수 있습니다만, [유니언 타입](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)을 사용하여 몇 가지 타입 중 하나가 될 수 있는 prop을 설명하는 것과 더 고급 사용 예시에 대한 [타입에서 타입 만들기](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html) 가이드 역시 흥미로울 것입니다.


## Hooks 예시 {/*example-hooks*/}

The type definitions from `@types/react` include types for the built-in Hooks, so you can use them in your components without any additional setup. They are built to take into account the code you write in your component, so you will get [inferred types](https://www.typescriptlang.org/docs/handbook/type-inference.html) a lot of the time and ideally do not need to handle the minutiae of providing the types.

하지만, hooks에 타입을 제공하는 방법의 몇 가지 예시를 볼 수 있습니다.

### `useState` {/*typing-usestate*/}

[`useState` hook](/reference/react/useState)은 초기 state로 전달된 값을 재사용하여 값의 타입을 결정합니다. 예를 들어

```ts
// 타입을 "boolean"으로 추론합니다
const [enabled, setEnabled] = useState(false);
```

`boolean` 타입이 `enabled`에 할당되고, `setEnabled` 는 `boolean` 인수나 `boolean`을 반환하는 함수를 받는 함수가 됩니다. state에 대한 타입을 명시적으로 제공하려면 `useState` 호출에 타입 인수를 제공하면 됩니다.

```ts
// Explicitly set the type to "boolean"
const [enabled, setEnabled] = useState<boolean>(false);
```

이 경우에는 그다지 유용하지 않지만, 타입 제공을 원하게 되는 일반적인 경우는 유니언 타입이 있는 경우입니다. 예를 들어 여기서 `status`는 몇 가지 다른 문자열 중 하나일 수 있습니다.

```ts
type Status = "idle" | "loading" | "success" | "error";

const [status, setStatus] = useState<Status>("idle");
```

또는 [State 구조화 원칙](/learn/choosing-the-state-structure#principles-for-structuring-state)에서 권장하는 대로, 관련 state를 객체로 그룹화하고 객체 타입을 통해 다른 가능성을 설명할 수 있습니다.

```ts
type RequestState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success', data: any }
  | { status: 'error', error: Error };

const [requestState, setRequestState] = useState<RequestState>({ status: 'idle' });
```

### `useReducer` {/*typing-usereducer*/}

[`useReducer` Hook](/reference/react/useReducer)은 reducer 함수와 초기 state를 취하는 더 복잡한 Hook입니다. reducer 함수의 타입은 초기 state에서 추론됩니다. state에 대한 타입을 제공하기 위해 `useReducer` 호출에 타입 인수를 선택적으로 제공할 수 있지만, 대신 초기 state에서 타입을 설정하는 것이 더 좋은 경우가 많습니다.

<Sandpack>

```tsx src/App.tsx active
import {useReducer} from 'react';

interface State {
   count: number
};

type CounterAction =
  | { type: "reset" }
  | { type: "setCount"; value: State["count"] }

const initialState: State = { count: 0 };

function stateReducer(state: State, action: CounterAction): State {
  switch (action.type) {
    case "reset":
      return initialState;
    case "setCount":
      return { ...state, count: action.value };
    default:
      throw new Error("Unknown action");
  }
}

export default function App() {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  const addFive = () => dispatch({ type: "setCount", value: state.count + 5 });
  const reset = () => dispatch({ type: "reset" });

  return (
    <div>
      <h1>Welcome to my counter</h1>

      <p>Count: {state.count}</p>
      <button onClick={addFive}>Add 5</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>


몇 가지 주요 위치에서 TypeScript를 사용하고 있습니다.

 - `interface State`는 reducer state의 모양을 설명합니다.
 - `type CounterAction`은 reducer에 dispatch 할 수 있는 다양한 액션을 설명합니다.
 - `const initialState: State`는 초기 state의 타입을 제공하고, 기본적으로 `useReducer`에서 사용하는 타입도 제공합니다.
 - `stateReducer(state: State, action: CounterAction): State`는 reducer 함수의 인수와 반환 값의 타입을 설정합니다.

`initialState`에 타입을 설정하는 것보다 더 명시적인 대안은 `useReducer`에 타입 인수를 제공하는 것입니다.

```ts
import { stateReducer, State } from './your-reducer-implementation';

const initialState = { count: 0 };

export default function App() {
  const [state, dispatch] = useReducer<State>(stateReducer, initialState);
}
```

### `useContext` {/*typing-usecontext*/}

[`useContext` Hook](/reference/react/useContext)은 컴포넌트를 통해 props를 전달할 필요 없이 컴포넌트 트리를 따라 데이터를 전달하는 기술입니다. Provider 컴포넌트를 생성할 때 사용되며, 종종 자식 컴포넌트에서 값을 소비하는 Hook을 생성할 때 사용됩니다.

context에서 제공한 값의 타입은 `createContext` 호출에 전달된 값에서 추론됩니다.

<Sandpack>

```tsx src/App.tsx active
import { createContext, useContext, useState } from 'react';

type Theme = "light" | "dark" | "system";
const ThemeContext = createContext<Theme>("system");

const useGetTheme = () => useContext(ThemeContext);

export default function MyApp() {
  const [theme, setTheme] = useState<Theme>('light');

  return (
    <ThemeContext value={theme}>
      <MyComponent />
    </ThemeContext>
  )
}

function MyComponent() {
  const theme = useGetTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
    </div>
  )
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

This technique works when you have a default value which makes sense - but there are occasionally cases when you do not, and in those cases `null` can feel reasonable as a default value. However, to allow the type-system to understand your code, you need to explicitly set `ContextShape | null` on the `createContext`.

이에 따라 context 소비자에 대한 타입에서 `| null`을 제거해야 하는 문제가 발생합니다. 권장 사항은 Hook이 런타임에 존재 여부를 검사하고 존재하지 않을 경우 에러를 throw 하는 것입니다.

```js {5, 16-20}
import { createContext, useContext, useState, useMemo } from 'react';

// 이것은 더 간단한 예시이지만, 더 복잡한 객체를 상상할 수 있습니다.
type ComplexObject = {
  kind: string
};

// context는 기본값을 정확하게 반영하기 위해 타입에 `| null`을 사용하여 만들어집니다.
const Context = createContext<ComplexObject | null>(null);

// Hook의 검사를 통해 `| null`을 제거합니다.
const useGetComplexObject = () => {
  const object = useContext(Context);
  if (!object) { throw new Error("useGetComplexObject must be used within a Provider") }
  return object;
}

export default function MyApp() {
  const object = useMemo(() => ({ kind: "complex" }), []);

  return (
    <Context value={object}>
      <MyComponent />
    </Context>
  )
}

function MyComponent() {
  const object = useGetComplexObject();

  return (
    <div>
      <p>Current object: {object.kind}</p>
    </div>
  )
}
```

### `useMemo` {/*typing-usememo*/}

<Note>

[React Compiler](/learn/react-compiler) automatically memoizes values and functions, reducing the need for manual `useMemo` calls. You can use the compiler to handle memoization automatically.

</Note>

The [`useMemo`](/reference/react/useMemo) Hooks will create/re-access a memorized value from a function call, re-running the function only when dependencies passed as the 2nd parameter are changed. The result of calling the Hook is inferred from the return value from the function in the first parameter. You can be more explicit by providing a type argument to the Hook.

```ts
// visibleTodos의 타입은 filterTodos의 반환 값에서 추론됩니다.
const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
```


### `useCallback` {/*typing-usecallback*/}

<Note>

[React Compiler](/learn/react-compiler) automatically memoizes values and functions, reducing the need for manual `useCallback` calls. You can use the compiler to handle memoization automatically.

</Note>

The [`useCallback`](/reference/react/useCallback) provide a stable reference to a function as long as the dependencies passed into the second parameter are the same. Like `useMemo`, the function's type is inferred from the return value of the function in the first parameter, and you can be more explicit by providing a type argument to the Hook.


```ts
const handleClick = useCallback(() => {
  // ...
}, [todos]);
```

TypeScript strict mode에서 작업할 때 `useCallback`을 사용하려면 콜백에 매개변수를 위한 타입을 추가해야 합니다. 콜백의 타입은 함수의 반환 값에서 추론되고, 매개변수 없이는 타입을 완전히 이해할 수 없기 때문입니다.

Depending on your code-style preferences, you could use the `*EventHandler` functions from the React types to provide the type for the event handler at the same time as defining the callback:

```ts
import { useState, useCallback } from 'react';

export default function Form() {
  const [value, setValue] = useState("Change me");

  const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((event) => {
    setValue(event.currentTarget.value);
  }, [setValue])

  return (
    <>
      <input value={value} onChange={handleChange} />
      <p>Value: {value}</p>
    </>
  );
}
```

## 유용한 타입들 {/*useful-types*/}

`@types/react` package에는 상당히 광범위한 타입 집합이 있으며, React와 TypeScript가 상호작용하는 방식에 익숙하다면 읽어볼 가치가 있습니다. [DefinitelyTyped에 있는 React 폴더에서](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts) 찾을 수 있습니다. 여기에서는 좀 더 일반적인 타입 몇 가지를 다루겠습니다.

### DOM 이벤트 {/*typing-dom-events*/}

React에서 DOM 이벤트로 작업할 때, 종종 이벤트 핸들러로부터 이벤트의 타입을 추론할 수 있습니다. 하지만, 이벤트 핸들러에 전달할 함수를 추출하고 싶을 때는 이벤트 타입을 명시적으로 설정해야 합니다.

<Sandpack>

```tsx src/App.tsx active
import { useState } from 'react';

export default function Form() {
  const [value, setValue] = useState("Change me");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValue(event.currentTarget.value);
  }

  return (
    <>
      <input value={value} onChange={handleChange} />
      <p>Value: {value}</p>
    </>
  );
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

React 타입에는 이벤트의 많은 타입이 있으며, 전체 목록은 [DOM에서 가장 많이 사용되는 이벤트](https://developer.mozilla.org/en-US/docs/Web/Events)를 기반으로 한 [여기](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/b580df54c0819ec9df62b0835a315dd48b8594a9/types/react/index.d.ts#L1247C1-L1373)에서 확인할 수 있습니다.

찾고 있는 타입을 결정할 때 먼저 사용 중인 이벤트 핸들러의 호버 정보를 확인하면, 이벤트의 타입이 표시됩니다.

이 목록에 포함되지 않은 이벤트를 사용해야 한다면, 모든 이벤트의 기본 타입인 `React.SyntheticEvent` 타입을 사용할 수 있습니다.

### Children {/*typing-children*/}

컴포넌트의 자식을 설명하는 데는 두 가지 일반적인 경로가 있습니다. 첫 번째는 JSX에서 자식으로 전달할 수 있는 모든 가능한 타입의 조합(union)인 `React.ReactNode` 타입을 사용하는 것입니다.

```ts
interface ModalRendererProps {
  title: string;
  children: React.ReactNode;
}
```

이것은 자식에 대해 매우 광범위한 정의입니다. 두 번째는 string이나 number 같은 JavaScript 원시 값(primitive)이 아닌 JSX 엘리먼트만 있는 `React.ReactElement` 타입을 사용하는 것입니다.

```ts
interface ModalRendererProps {
  title: string;
  children: React.ReactElement;
}
```

Note, that you cannot use TypeScript to describe that the children are a certain type of JSX elements, so you cannot use the type-system to describe a component which only accepts `<li>` children.

[TypeScript 플레이그라운드](https://www.typescriptlang.org/ko/play?#code/JYWwDg9gTgLgBAJQKYEMDG8BmUIjgIilQ3wChSB6CxYmAOmXRgDkIATJOdNJMGAZzgwAFpxAR+8YADswAVwGkZMJFEzpOjDKw4AFHGEEBvUnDhphwADZsi0gFw0mDWjqQBuUgF9yaCNMlENzgAXjgACjADfkctFnYkfQhDAEpQgD44AB42YAA3dKMo5P46C2tbJGkvLIpcgt9-QLi3AEEwMFCItJDMrPTTbIQ3dKywdIB5aU4kKyQQKpha8drhhIGzLLWODbNs3b3s8YAxKBQAcwXpAThMaGWDvbH0gFloGbmrgQfBzYpd1YjQZbEYARkB6zMwO2SHSAAlZlYIBCdtCRkZpHIrFYahQYQD8UYYFA5EhcfjyGYqHAXnJAsIUHlOOUbHYhMIIHJzsI0Qk4P9SLUBuRqXEXEwAKKfRZcNA8PiCfxWACecAAUgBlAAacFm80W-CU11U6h4TgwUv11yShjgJjMLMqDnN9Dilq+nh8pD8AXgCHdMrCkWisVoAet0R6fXqhWKhjKllZVVxMcavpd4Zg7U6Qaj+2hmdG4zeRF10uu-Aeq0LBfLMEe-V+T2L7zLVu+FBWLdLeq+lc7DYFf39deFVOotMCACNOCh1dq219a+30uC8YWoZsRyuEdjkevR8uvoVMdjyTWt4WiSSydXD4NqZP4AymeZE072ZzuUeZQKheQgA)에서 타입 체커를 사용하여 `React.ReactNode`와 `React.ReactElement`의 모든 예시를 확인할 수 있습니다.

### Style Props {/*typing-style-props*/}

React의 인라인 스타일을 사용할 때, `React.CSSProperties`를 사용하여 `style` prop에 전달된 객체를 설명할 수 있습니다. 이 타입은 모든 가능한 CSS 프로퍼티의 조합이고, `style` prop에 유효한 CSS 프로퍼티를 전달하고 있는지 확인하고 에디터에서 자동 완성 기능을 사용할 수 있는 좋은 방법입니다.

```ts
interface MyComponentProps {
  style: React.CSSProperties;
}
```

## 추가 학습 {/*further-learning*/}

이 가이드에서 React에서 TypeScript를 사용하는 기본 사항을 다루었지만, 배울 것이 더 많습니다.
문서의 개별 API 페이지에는 TypeScript와 함께 사용하는 방법에 대한 자세한 설명이 포함되어 있을 수 있습니다.

다음 리소스를 추천합니다.

 - [TypeScript 핸드북](https://www.typescriptlang.org/ko/docs/handbook/)은 TypeScript에 대한 공식 문서로, 대부분 주요 언어 기능을 다루고 있습니다.

 - [TypeScript 릴리즈 노트](https://devblogs.microsoft.com/typescript/)에서는 각각의 새로운 기능에 대해 자세히 설명합니다.

 - [React TypeScript 치트시트](https://react-typescript-cheatsheet.netlify.app/)는 React와 함께 TypeScript를 사용하기 위해 커뮤니티에서 관리하는 치트시트로, 유용한 엣지 케이스를 많이 다루고 이 문서보다 더 폭넓은 정보를 제공합니다.

 - [TypeScript 커뮤니티 디스코드](https://discord.com/invite/typescript)는 TypeScript 및 React 문제에 대해 질문하고 도움을 받을 수 있는 좋은 곳입니다.
