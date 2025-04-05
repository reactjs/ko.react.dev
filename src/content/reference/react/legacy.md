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
* [`forwardRef`](/reference/react/forwardRef)는 컴포넌트가 [ref](/learn/manipulating-the-dom-with-refs)로 DOM 노드를 부모 컴포넌트에 노출시킵니다.
* [`isValidElement`](/reference/react/isValidElement)는 값의 React 엘리먼트 여부를 확인합니다. 일반적으로 [`cloneElement`](/reference/react/cloneElement)와 함께 사용합니다.
* [`PureComponent`](/reference/react/PureComponent)는 [`Component`](/reference/react/Component)와 유사하지만, 동일한 Prop의 재렌더링은 생략합니다. [대안 확인하기](/reference/react/PureComponent#alternatives).

---

## Removed APIs {/*removed-apis*/}

아래 API들은 React 19에서 제거되었습니다.

* [`createFactory`](https://18.react.dev/reference/react/createFactory): 대신 JSX를 사용하세요.
* 클래스 컴포넌트: [`static contextTypes`](https://18.react.dev//reference/react/Component#static-contexttypes): 대신 [`static contextType`](#static-contexttype)를 사용하세요.
* 클래스 컴포넌트: [`static childContextTypes`](https://18.react.dev//reference/react/Component#static-childcontexttypes): 대신 [`static contextType`](#static-contexttype)를 사용하세요.
* 클래스 컴포넌트: [`static getChildContext`](https://18.react.dev//reference/react/Component#getchildcontext): 대신 [`Context.Provider`](/reference/react/createContext#provider)를 사용하세요.
* 클래스 컴포넌트: [`static propTypes`](https://18.react.dev//reference/react/Component#static-proptypes): 대신 [TypeScript](https://www.typescriptlang.org/)같은 타입 시스템을 사용하세요.
* 클래스 컴포넌트: [`this.refs`](https://18.react.dev//reference/react/Component#refs): 대신 [`createRef`](/reference/react/createRef)를 사용하세요.

