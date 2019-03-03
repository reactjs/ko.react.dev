---
title: Special Props Warning
layout: single
permalink: warnings/special-props.html
---

JSX 엘리먼트 대부분의 props는 컴포넌트로 전달되지만 React에서 사용하는 두 개의 특수 props(`ref` 및 `key`)는 컴포넌트로 전달되지 않습니다.

예를 들어, 컴포넌트에서 `this.props.key`를 render 함수나 [propTypes](/docs/typechecking-with-proptypes.html#proptypes)에서 접근하면 그 값은 `undefined` 입니다. 자식 컴포넌트 내에서 같은 값에 액세스하고 싶다면 다른 프로퍼티로 전달해야 합니다(예시: `<ListItemWrapper key={result.id} id={result.id} />`). 불필요해 보일지 모르지만, 재조정을 위해 사용되는 속성과 앱 로직을 분리하는 것은 중요합니다.
