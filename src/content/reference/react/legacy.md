---
title: "Legacy React APIs"
---

<Intro>

이 API는 `react` 패키지에서 추출했지만 새로 작성할 코드에서 사용을 추천하지 않습니다. 링크를 통해 각각의 API 페이지에서 제시한 대안을 확인해주세요.

</Intro>

---

## Legacy APIs {/*legacy-apis*/}

* [`Children`](/reference/react/Children)은 `children` prop으로 받은 JSX를 조작하고 변형할 수 있습니다. [대안 확인하기](/reference/react/Children#alternatives)
* [`cloneElement`](/reference/react/cloneElement)를 통해 다른 엘리먼트를 시작점으로 사용하여 React 엘리먼트를 생성할 수 있습니다. [대안 확인하기](/reference/react/cloneElement#alternatives)
* [`Component`](/reference/react/Component)는 Javascript Class로써 React 컴포넌트를 정의합니다. [대안 확인하기](/reference/react/Component#alternatives)
* [`createElement`](/reference/react/createElement)로 React 엘리먼트를 생성합니다. 일반적으로 JSX를 대신 사용합니다.
* [`createRef`](/reference/react/createRef)는 임의의 값을 포함할 수 있는 참조 객체를 생성합니다. [대안 확인하기](/reference/react/createRef#alternatives)
* [`isValidElement`](/reference/react/isValidElement)는 값의 React 엘리먼트 여부를 확인합니다. 일반적으로 [`cloneElement`](/reference/react/cloneElement)와 함께 사용합니다.
* [`PureComponent`](/reference/react/PureComponent)는 [`Component`](/reference/react/Component)와 유사하지만, 동일한 props의 재렌더는 생략합니다. [대안 확인하기](/reference/react/PureComponent#alternatives)


---

## Deprecated APIs {/*deprecated-apis*/}

<Deprecated>

이 API는 추후 React major 버전에서 제거될 예정입니다.

</Deprecated>

* [`createFactory`](/reference/react/createFactory)는 특정 유형의 React 엘리먼트를 생성하는 함수를 만듭니다.
