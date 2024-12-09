---
title: "Legacy React APIs"
---

<Intro>

이 API는 `react` 패키지에서 추출했지만 새로 작성할 코드에서 사용을 추천하지 않습니다. 링크를 통해 각각의 API 페이지에서 제시한 대안을 확인해주세요.

</Intro>

---

## Legacy APIs {/*legacy-apis*/}

<<<<<<< HEAD
* [`Children`](/reference/react/Children)은 `children` prop으로 받은 JSX를 조작하고 변형할 수 있습니다. [대안 확인하기](/reference/react/Children#alternatives)
* [`cloneElement`](/reference/react/cloneElement)를 통해 다른 엘리먼트를 시작점으로 사용하여 React 엘리먼트를 생성할 수 있습니다. [대안 확인하기](/reference/react/cloneElement#alternatives)
* [`Component`](/reference/react/Component)는 Javascript 클래스로써 React 컴포넌트를 정의합니다. [대안 확인하기](/reference/react/Component#alternatives)
* [`createElement`](/reference/react/createElement)로 React 엘리먼트를 생성합니다. 일반적으로 JSX를 대신 사용합니다.
* [`createRef`](/reference/react/createRef)는 임의의 값을 포함할 수 있는 참조 객체를 생성합니다. [대안 확인하기](/reference/react/createRef#alternatives)
* [`isValidElement`](/reference/react/isValidElement)는 값의 React 엘리먼트 여부를 확인합니다. 일반적으로 [`cloneElement`](/reference/react/cloneElement)와 함께 사용합니다.
* [`PureComponent`](/reference/react/PureComponent)는 [`Component`](/reference/react/Component)와 유사하지만, 동일한 props의 재렌더는 생략합니다. [대안 확인하기](/reference/react/PureComponent#alternatives)
=======
* [`Children`](/reference/react/Children) lets you manipulate and transform the JSX received as the `children` prop. [See alternatives.](/reference/react/Children#alternatives)
* [`cloneElement`](/reference/react/cloneElement) lets you create a React element using another element as a starting point. [See alternatives.](/reference/react/cloneElement#alternatives)
* [`Component`](/reference/react/Component) lets you define a React component as a JavaScript class. [See alternatives.](/reference/react/Component#alternatives)
* [`createElement`](/reference/react/createElement) lets you create a React element. Typically, you'll use JSX instead.
* [`createRef`](/reference/react/createRef) creates a ref object which can contain arbitrary value. [See alternatives.](/reference/react/createRef#alternatives)
* [`forwardRef`](/reference/react/forwardRef) lets your component expose a DOM node to parent component with a [ref.](/learn/manipulating-the-dom-with-refs)
* [`isValidElement`](/reference/react/isValidElement) checks whether a value is a React element. Typically used with [`cloneElement`.](/reference/react/cloneElement)
* [`PureComponent`](/reference/react/PureComponent) is similar to [`Component`,](/reference/react/Component) but it skip re-renders with same props. [See alternatives.](/reference/react/PureComponent#alternatives)
>>>>>>> 69edd845b9a654c6ac9ed68da19d5b42897e636e

---

## Removed APIs {/*removed-apis*/}

These APIs were removed in React 19:

<<<<<<< HEAD
이 API는 추후 React major 버전에서 제거될 예정입니다.

</Deprecated>

* [`createFactory`](/reference/react/createFactory)는 특정 유형의 React 엘리먼트를 생성하는 함수를 만듭니다.
=======
* [`createFactory`](https://18.react.dev/reference/react/createFactory): use JSX instead.
* Class Components: [`static contextTypes`](https://18.react.dev//reference/react/Component#static-contexttypes): use [`static contextType`](#static-contexttype) instead.
* Class Components: [`static childContextTypes`](https://18.react.dev//reference/react/Component#static-childcontexttypes): use [`static contextType`](#static-contexttype) instead.
* Class Components: [`static getChildContext`](https://18.react.dev//reference/react/Component#getchildcontext): use [`Context.Provider`](/reference/react/createContext#provider) instead.
* Class Components: [`static propTypes`](https://18.react.dev//reference/react/Component#static-proptypes): use a type system like [TypeScript](https://www.typescriptlang.org/) instead.
* Class Components: [`this.refs`](https://18.react.dev//reference/react/Component#refs): use [`createRef`](/reference/react/createRef) instead.
>>>>>>> 69edd845b9a654c6ac9ed68da19d5b42897e636e
