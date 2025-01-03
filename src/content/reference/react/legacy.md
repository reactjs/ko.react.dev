---
title: "Legacy React API"
---

<Intro>

아래 API는 `react` 패키지에서 내보냈지만<sup>Exported</sup> 새로 작성할 코드에서는 권장하지 않습니다. 링크를 통해 각각의 API 페이지에서 제시한 대안을 확인해주세요.

</Intro>

---

## Legacy APIs {/*legacy-apis*/}

* [`Children`](/reference/react/Children)은 `children` Prop으로 받은 JSX를 조작하고 변형할 수 있습니다. [대안 확인하기](/reference/react/Children#alternatives).
* [`cloneElement`](/reference/react/cloneElement)를 통해 다른 엘리먼트를 시작점으로 사용하여 React 엘리먼트를 생성할 수 있습니다. [대안 확인하기](/reference/react/cloneElement#alternatives).
* [`Component`](/reference/react/Component)는 자바스크립트 클래스로써 React 컴포넌트를 정의합니다. [대안 확인하기](/reference/react/Component#alternatives).
* [`createElement`](/reference/react/createElement)로 React 엘리먼트를 생성합니다. 일반적으로 JSX를 대신 사용합니다.
* [`createRef`](/reference/react/createRef)는 임의의 값을 포함할 수 있는 참조 객체를 생성합니다. [대안 확인하기](/reference/react/createRef#alternatives).
* [`forwardRef`](/reference/react/forwardRef) lets your component expose a DOM node to parent component with a [ref](/learn/manipulating-the-dom-with-refs).
* [`isValidElement`](/reference/react/isValidElement)는 값의 React 엘리먼트 여부를 확인합니다. 일반적으로 [`cloneElement`](/reference/react/cloneElement)와 함께 사용합니다.
* [`PureComponent`](/reference/react/PureComponent)는 [`Component`](/reference/react/Component)와 유사하지만, 동일한 Prop의 재렌더링은 생략합니다. [대안 확인하기](/reference/react/PureComponent#alternatives).

---

## Removed APIs {/*removed-apis*/}

아래 API들은 React 19에서 제거되었습니다.

* [`createFactory`](https://18.react.dev/reference/react/createFactory): use JSX instead.
* Class Components: [`static contextTypes`](https://18.react.dev//reference/react/Component#static-contexttypes): use [`static contextType`](#static-contexttype) instead.
* Class Components: [`static childContextTypes`](https://18.react.dev//reference/react/Component#static-childcontexttypes): use [`static contextType`](#static-contexttype) instead.
* Class Components: [`static getChildContext`](https://18.react.dev//reference/react/Component#getchildcontext): use [`Context.Provider`](/reference/react/createContext#provider) instead.
* Class Components: [`static propTypes`](https://18.react.dev//reference/react/Component#static-proptypes): use a type system like [TypeScript](https://www.typescriptlang.org/) instead.
* Class Components: [`this.refs`](https://18.react.dev//reference/react/Component#refs): use [`createRef`](/reference/react/createRef) instead.

