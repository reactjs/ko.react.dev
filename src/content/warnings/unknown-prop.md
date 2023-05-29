---
title: 알 수 없는 Prop 경고
---

알 수 없는 Prop 경고는 React가 유효한 DOM 속성/프로퍼티로 인식하지 못하는 속성을 가진 DOM 요소를 렌더링하려고 할 때 발생합니다. DOM 요소에 불필요한 속성이 존재하지 않도록 확인해야 합니다.

이 경고가 나타나는 가능한 이유는 다음과 같습니다:

1. `{...props}` 또는 `cloneElement(element, props)`를 사용하고 있습니까? props를 자식 컴포넌트로 복사할 때, 부모 컴포넌트에만 해당하는 속성이 실수로 자식 컴포넌트로 전달되지 않도록 확인해야 합니다. 이 문제에 대한 보통의 해결 방법은 아래에서 설명합니다.

2. 네이티브 DOM 노드에서 비표준 DOM 속성을 사용하고 있을 수 있습니다. 표준 DOM 요소에 사용자 정의 데이터를 전달하려면, [MDN에서](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_data_attributes) 설명하는 사용자 정의 데이터 속성을 사용하는 것을 고려해 보세요.

3. React가 지정한 속성을 아직 인식하지 못할 수 있습니다. 이는 나중에 나올 React 버전에서 수정될 가능성이 있습니다. 만약 속성 이름을 소문자로 작성하면, React는 경고 없이 해당 속성을 전달할 수 있습니다.

4. `<myButton />`과같이 대문자 없이 React 컴포넌트를 사용하고 있을 수 있습니다. React는 대문자와 소문자의 컨벤션을 사용하여 사용자 정의 컴포넌트와 DOM 태그를 구분합니다. 자신의 React 컴포넌트를 작성할 때는 PascalCase를 사용해야 합니다. 예를 들어 <myButton /> 대신 <MyButton />과같이 작성하세요.

---

만약 `{...props}`와 같은 방식으로 props를 전달하여 이 경고가 나타난다면, 부모 컴포넌트는 자식 컴포넌트에는 해당하지 않고 부모 컴포넌트에만 해당하는 속성을 "소비(consume)"해야 합니다. 예시:

**나쁜 예:** 예기치 않은 `layout` prop이 `div` 태그로 전달됩니다.

```js
function MyDiv(props) {
  if (props.layout === 'horizontal') {
    // 나쁜 예! "layout"이 <div> tag가 이해하는 prop이 아닌 것을 알고 있기 때문입니다.
    return <div {...props} style={getHorizontalStyle()} />
  } else {
    // 나쁜 예! "layout"이 <div> tag가 이해하는 prop이 아닌 것을 알고 있기 때문입니다.
    return <div {...props} style={getVerticalStyle()} />
  }
}
```

**좋은 예:** 전개 구문을 사용하여 변수를 props에서 추출하고, 남은 props를 변수에 할당합니다.

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

**좋은 예:** 속성을 새로운 객체에 할당하고, 사용한 키를 객체에서 삭제할 수도 있습니다. 원본 `this.props` 객체의 props를 삭제하지 않도록 주의해야 합니다. 해당 객체는 변경 불가능한 것으로 간주되어야 합니다.

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
