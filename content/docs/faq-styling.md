---
id: faq-styling
title: 스타일링과 CSS
permalink: docs/faq-styling.html
layout: docs
category: FAQ
---

### CSS 클래스를 컴포넌트에 어떻게 추가하나요? {#how-do-i-add-css-classes-to-components}

`className` prop에 문자열을 넘깁니다.

```jsx
render() {
  return <span className="menu navigation-menu">Menu</span>
}
```

컴포넌트의 props나 state에 CSS 클래스가 의존하는 것은 자주 사용되는 방식입니다.

```jsx
render() {
  let className = 'menu';
  if (this.props.isActive) {
    className += ' menu-active';
  }
  return <span className={className}>Menu</span>
}
```

>팁
>
>이러한 방식으로 코드를 자주 작성한다면, [classnames](https://www.npmjs.com/package/classnames#usage-with-reactjs) 패키지를 통해 이 작업을 간소화할 수 있습니다.

### 인라인 스타일을 사용할 수 있나요? {#can-i-use-inline-styles}

네, [여기](/docs/dom-elements.html#style)에서 스타일링에 관한 문서를 참고해 주세요.

### 인라인 스타일은 좋지 않은 방식인가요? {#are-inline-styles-bad}

보통의 경우 CSS 클래스가 인라인 스타일보다 더 나은 성능을 보입니다.

### CSS-in-JS가 무엇인가요? {#what-is-css-in-js}

"CSS-in-JS"는 외부의 파일에 CSS를 정의하는 대신에 JavaScript와 결합하는 패턴을 의미합니다.

_이러한 기능은 React에 포함된 기능이 아닌, 별도의 라이브러리로 제공되고 있는 것에 주의해주세요._ React는 어떻게 스타일이 정의되는지에 대한 의견이 없습니다. 의구심이 생긴다면, 평소처럼 별도의 `*.css` 파일에 정의한 뒤 [`className`](/docs/dom-elements.html#classname)을 통해 참조하는 것으로 시작해볼 수 있습니다.

### React에서 애니메이션을 할 수 있나요? {#can-i-do-animations-in-react}

<<<<<<< HEAD
React는 애니메이션을 표현할 수 있습니다. 이에 대한 예시로 [React Transition Group](https://reactcommunity.org/react-transition-group/) 또는 [React Motion](https://github.com/chenglou/react-motion) 또는 [React Spring](https://github.com/react-spring/react-spring)를 확인해 보세요.
=======
React can be used to power animations. See [React Transition Group](https://reactcommunity.org/react-transition-group/), [React Motion](https://github.com/chenglou/react-motion), [React Spring](https://github.com/react-spring/react-spring), or [Framer Motion](https://framer.com/motion), for example.
>>>>>>> 014f4890dc30a3946c63f83b06883241ddc9bc75
