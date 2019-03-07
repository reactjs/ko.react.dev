---
title: Don't Call PropTypes Warning
layout: single
permalink: warnings/dont-call-proptypes.html
---

> 주의
>
> `React.PropTypes`는 React v15.5 버전 이후로 별도의 패키지로 옮겨졌습니다. [`prop-types` 라이브러리를 대신](https://www.npmjs.com/package/prop-types) 사용하세요.
>
>이 변경을 자동화 해주는 [codemod 스크립트](/blog/2017/04/07/react-v15.5.0.html#migrating-from-react.proptypes)를 제공하고 있습니다.

다음 React 주요(major) 릴리스에서는 PropType 유효성 검사 함수를 구현하는 코드는 프로덕션 환경에서 제거됩니다. 프로덕션에서 이런 코드가 제거되지 않았다면 모든 코드에서 오류가 발생할 것입니다.

### PropTypes를 선언하는 것은 여전히 유효합니다 {#declaring-proptypes-is-still-fine}

PropTypes의 일반적인 사용은 여전히 지원됩니다.

```javascript
Button.propTypes = {
  highlighted: PropTypes.bool
};
```

변경된 것은 없습니다.

### 직접 PropTypes를 호출하지 마세요 {#dont-call-proptypes-directly}

React 컴포넌트가 아닌 다른 곳에서 PropTypes를 사용하는 것은 더 이상 지원되지 않습니다.

```javascript
var apiShape = PropTypes.shape({
  body: PropTypes.object,
  statusCode: PropTypes.number.isRequired
}).isRequired;

// 지원 안됨!
var error = apiShape(json, 'response');
```

PropTypes를 이런 식으로 사용하고 있다면 PropTypes를 포크(fork)하거나 [이런](https://github.com/aackerman/PropTypes) [두 개](https://github.com/developit/proptypes)의 패키지를 사용하는 것을 권장합니다.

이런 경고를 수정하지 않으면 프로덕션 환경에서 React 16과 충돌이 생길 것입니다.

### 직접 PropTypes를 호출하지 않아도 경고 메시지가 표시될 때 {#if-you-dont-call-proptypes-directly-but-still-get-the-warning}

경고에 표시된 스택 추적을 검사해보세요. PropTypes를 직접 호출한 컴포넌트를 찾을 수 있을 것입니다. 대부분 문제는 React의 PropTypes를 래핑하는 서드파티(third-party) PropTypes로 인해 발생합니다. 예를 들면 다음과 같습니다.

```js
Button.propTypes = {
  highlighted: ThirdPartyPropTypes.deprecated(
    PropTypes.bool,
    'Use `active` prop instead'
  )
}
```

여기서 `ThirdPartyPropTypes.deprecated`는 `PropTypes.bool`을 호출하는 래퍼입니다. 이 패턴 자체는 괜찮지만 React가 PropTypes를 직접 호출한다고 생각하기 때문에 거짓 긍정을 유발합니다. 다음 섹션에서는 `ThirdPartyPropTypes`와 같은 것을 구현한 라이브러리에서 이 문제를 수정하는 방법을 설명하겠습니다.

### 서드파티 PropTypes의 거짓 긍정(false positive) 수정 {#fixing-the-false-positive-in-third-party-proptypes}

서드파티 PropTypes 라이브러리 개발자이고 사용자가 기존 React PropTypes를 래핑하도록 허용했다면 라이브러리에서 이 경고가 표시될 수 있습니다. 이것은 React에서 수동으로 PropTypes 호출하는 것을 탐지하기 위해 [전달](https://github.com/facebook/react/pull/7132)하는 "비밀" 마지막 인자를 알 수 없기 때문에 발생합니다.

수정 방법은 다음과 같습니다. [react-bootstrap/react-prop-types](https://github.com/react-bootstrap/react-prop-types/blob/0d1cd3a49a93e513325e3258b28a82ce7d38e690/src/deprecated.js)의 `deprecated`를 예시로 사용하겠습니다. 현재 구현은 `props`, `propName` 및 `componentName` 인자만을 전달합니다.

```javascript
export default function deprecated(propType, explanation) {
  return function validate(props, propName, componentName) {
    if (props[propName] != null) {
      const message = `"${propName}" property of "${componentName}" has been deprecated.\n${explanation}`;
      if (!warned[message]) {
        warning(false, message);
        warned[message] = true;
      }
    }

    return propType(props, propName, componentName);
  };
}
```

거짓 긍정을 수정하려면 **모든** 인자를 래핑 된 PropTypes에 전달해야 합니다. ES6의 `...rest`를 사용하면 쉽게 해결할 수 있습니다.

```javascript
export default function deprecated(propType, explanation) {
  return function validate(props, propName, componentName, ...rest) { // 이곳에 ...rest를 추가하는 것을 잊지 마세요.
    if (props[propName] != null) {
      const message = `"${propName}" property of "${componentName}" has been deprecated.\n${explanation}`;
      if (!warned[message]) {
        warning(false, message);
        warned[message] = true;
      }
    }

    return propType(props, propName, componentName, ...rest); // 그리고 여기에도
  };
}
```

이렇게 하면 경고가 사라집니다.
