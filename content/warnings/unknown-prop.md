---
title: Unknown Prop Warning
layout: single
permalink: warnings/unknown-prop.html
---
올바른 DOM 어트리뷰트/프로퍼티로 인식되지 않는 DOM 엘리먼트를 렌더링하려고 하면 unknown-prop 경고가 발생합니다. DOM 엘리먼트에 잘못된 props가 추가되지 않도록 해야 합니다.

이 경고가 표시되는 몇 가지 이유가 있습니다.

1. `{...this.props}` 또는 `cloneElement(element, this.props)`를 사용하고 있습니까? 그렇다면 컴포넌트가 자기 자신의 props를 자식 엘리먼트로 직접 전달하는 경우입니다. (예시. [props 전달](/docs/transferring-props.html)) 자식 컴포넌트로 props를 전달할 때 부모 컴포넌트에서 사용되는 props를 실수로 전달하지 않도록 해야 합니다.

2. 사용자 정의 데이터를 나타내기 위해 네이티브 DOM 노드에서 비표준 DOM 어트리뷰트를 사용하고 있는 경우입니다. 표준 DOM 엘리먼트에 사용자 정의 데이터를 추가하려는 경우 [MDN](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_data_attributes)에 설명된 사용자 정의 data 어트리뷰트를 사용해보세요.

3. React가 아직 지정된 어트리뷰트를 인식하지 못하는 경우입니다. 이것은 다음 React 버전에서 수정될 수 있습니다. 그러나 React는 현재 알 수 없는 모든 어트리뷰트를 제거하므로 React 앱에서 렌더링되지 않습니다.

4. React 컴포넌트 이름에 대문자가 포함되어 있지 않은 경우입니다. [React JSX에서는 대소문자 규칙을 사용하여 사용자 정의 컴포넌트와 DOM 태그를 구별](/docs/jsx-in-depth.html#user-defined-components-must-be-capitalized)하기 때문에 React 컴포넌트에 대문자가 없다면 이것을 DOM 태그로 해석합니다.

---

이 문제를 해결하려면, 합성 컴포넌트는 자식 컴포넌트를 위해 만들어진 것이 아닌 합성 컴포넌트를 위해 만들어진 모든 props를 "소비해야 합니다". 예를 들어,

**금지** 예기치 않은 `layout` prop이 `div` 태그에 전달됩니다.

```js
function MyDiv(props) {
  if (props.layout === 'horizontal') {
    // 금지! "layout"은 <div> 가 이해하는 prop이 아니기 때문입니다.
    return <div {...props} style={getHorizontalStyle()} />
  } else {
    // 금지! "layout"은 <div> 가 이해하는 prop이 아니기 때문입니다.
    return <div {...props} style={getVerticalStyle()} />
  }
}
```

<<<<<<< HEAD
**권장** 전개 연산자(spread operator)를 사용하여 변수를 props에서 빼내고 나머지 props를 변수에 넣을 수 있습니다.
=======
**Good:** The spread syntax can be used to pull variables off props, and put the remaining props into a variable.
>>>>>>> 5f0549c86e7a9c0774e66687d1bc0118a681eb9d

```js
function MyDiv(props) {
  const { layout, ...rest } = props
  if (layout === 'horizontal') {
    return <div {...rest} style={getHorizontalStyle()} />
  } else {
    return <div {...rest} style={getVerticalStyle()} />
  }
}
```

**권장** 새 객체에 props를 복사하고 새 객체에서 사용 중인 key를 삭제할 수도 있습니다. 원래 `this.props` 객체에서 그 객체를 삭제하면 안됩니다. 왜냐하면 그 객체는 불변이어야 하기 때문입니다.

```js
function MyDiv(props) {

  const divProps = Object.assign({}, props);
  delete divProps.layout;

  if (props.layout === 'horizontal') {
    return <div {...divProps} style={getHorizontalStyle()} />
  } else {
    return <div {...divProps} style={getVerticalStyle()} />
  }
}
```
