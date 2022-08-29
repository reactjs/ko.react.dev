---
id: typechecking-with-proptypes
title: PropTypes와 함께 하는 타입 검사
permalink: docs/typechecking-with-proptypes.html
redirect_from:
  - "docs/react-api.html#typechecking-with-proptypes"
---

> 주의
>
> `React.PropTypes`는 React v15.5부터 다른 패키지로 이동하였습니다. 대신 [`prop-types` 라이브러리를](https://www.npmjs.com/package/prop-types) 사용하시길 바랍니다.
>
> 우리는 변환을 자동화하기 위하여 [codemod 스크립트를](/blog/2017/04/07/react-v15.5.0.html#migrating-from-reactproptypes) 제공하고 있습니다.

여러분의 앱이 커짐에 따라 타입 검사를 활용하면 많은 버그를(bug) 잡을 수 있습니다. 특정 애플리케이션에서는 전체 애플리케이션의 타입 검사를 위해 [Flow](https://flow.org/) 또는 [TypeScript](https://www.typescriptlang.org/)와 같은 JavaScript 도구(Extensions)를 사용할 수 있습니다. 이러한 것들을 사용하지 않더라도 React는 내장된 타입 검사 기능들을 가지고 있습니다. 컴포넌트의 props에 타입 검사를 하려면 다음과 같이 특별한 프로퍼티인 propTypes를 선언할 수 있습니다.

```javascript
import PropTypes from 'prop-types';

class Greeting extends React.Component {
  render() {
    return (
      <h1>Hello, {this.props.name}</h1>
    );
  }
}

Greeting.propTypes = {
  name: PropTypes.string
};
```

예시에서 클래스 컴포넌트를 사용하고 있지만 함수 컴포넌트와 [`React.memo`](/docs/react-api.html#reactmemo), [`React.forwardRef`](/docs/react-api.html#reactforwardref)를 통해 만들어진 컴포넌트에도 동일하게 적용될 수 있습니다.

`PropTypes`는 전달받은 데이터의 유효성을 검증하기 위해서 다양한 유효성 검사기(Validator)를 내보냅니다. 아래 예시에서는 `PropTypes.string`을 사용하게 될 것입니다. prop에 유효하지 않은 값이 전달 되었을 때, 경고문이 JavaScript 콘솔을 통해 보일 것입니다. `propTypes`는 성능상의 이유로 개발 모드(Development mode) 에서만 확인될 것입니다.

### PropTypes {#proptypes}

아래는 제공된 서로 다른 유효성 검사기들을 보여주는 예시입니다.

```javascript
import PropTypes from 'prop-types';

MyComponent.propTypes = {
  // prop가 특정 JS 형식임을 선언할 수 있습니다.
  // 이것들은 기본적으로 모두 선택 사항입니다.
  optionalArray: PropTypes.array,
  optionalBool: PropTypes.bool,
  optionalFunc: PropTypes.func,
  optionalNumber: PropTypes.number,
  optionalObject: PropTypes.object,
  optionalString: PropTypes.string,
  optionalSymbol: PropTypes.symbol,

  // 랜더링 될 수 있는 것들은 다음과 같습니다.
  // 숫자(numbers), 문자(strings), 엘리먼트(elements), 또는 이러한 타입들(types)을 포함하고 있는 배열(array) (혹은 배열의 fragment)
  optionalNode: PropTypes.node,

  // React 엘리먼트.
  optionalElement: PropTypes.element,

  // React 엘리먼트 타입 (ie. MyComponent)
  optionalElementType: PropTypes.elementType,

  // prop가 클래스의 인스턴스임을 선언할 수 있습니다.
  // 이 경우 JavaScript의 instanceof 연산자를 사용합니다.
  optionalMessage: PropTypes.instanceOf(Message),

  // 열거형(enum)으로 처리하여 prop가 특정 값들로 제한되도록 할 수 있습니다.
  optionalEnum: PropTypes.oneOf(['News', 'Photos']),

  // 여러 종류중 하나의 종류가 될 수 있는 객체
  optionalUnion: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Message)
  ]),

  // 특정 타입의 행렬
  optionalArrayOf: PropTypes.arrayOf(PropTypes.number),

  // 특정 타입의 프로퍼티 값들을 갖는 객체
  optionalObjectOf: PropTypes.objectOf(PropTypes.number),

  // 특정 형태를 갖는 객체
  optionalObjectWithShape: PropTypes.shape({
    color: PropTypes.string,
    fontSize: PropTypes.number
  }),

  // 추가 프로퍼티에 대한 경고가 있는 객체
  optionalObjectWithStrictShape: PropTypes.exact({
    name: PropTypes.string,
    quantity: PropTypes.number
  }),

  // 위에 있는 것 모두 `isRequired`와 연결하여 prop가 제공되지 않았을 때
  // 경고가 보이도록 할 수 있습니다.
  requiredFunc: PropTypes.func.isRequired,

  // 모든 데이터 타입이 가능한 필수값
  requiredAny: PropTypes.any.isRequired,

  // 사용자 정의 유효성 검사기를 지정할 수도 있습니다.
  // 검사 실패 시에는 에러(Error) 객체를 반환해야 합니다.
  // `oneOfType`안에서는 작동하지 않으므로 `console.warn` 혹은 throw 하지 마세요.
  customProp: function(props, propName, componentName) {
    if (!/matchme/.test(props[propName])) {
      return new Error(
        'Invalid prop `' + propName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  },

  // `arrayOf` 와 `objectOf 에 사용자 정의 유효성 검사기를 적용할 수 있습니다.
  // 검사 실패 시에는 에러(Error) 객체를 반환해야 합니다.
  // 유효성 검사기는 배열(array) 혹은 객체의 각 키(key)에 대하여 호출될 것입니다.
  // 유효성 검사기의 첫 두 개의 변수는 배열 혹은 객체 자신과 현재 아이템의 키입니다.

  customArrayProp: PropTypes.arrayOf(function(propValue, key, componentName, location, propFullName) {
    if (!/matchme/.test(propValue[key])) {
      return new Error(
        'Invalid prop `' + propFullName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  })
};
```

### 하나의 자식만 요구하기 {#requiring-single-child}

`PropTypes.element`를 이용하여 컴포넌트의 자식들(Children)에 단 하나의 자식(Child)만이 전달될 수 있도록 명시할 수 있습니다.

```javascript
import PropTypes from 'prop-types';

class MyComponent extends React.Component {
  render() {
    // 이것은 반드시 하나의 엘리먼트여야 합니다. 아니라면, 경고(warn)가 일어날 것입니다.
    const children = this.props.children;
    return (
      <div>
        {children}
      </div>
    );
  }
}

MyComponent.propTypes = {
  children: PropTypes.element.isRequired
};
```

### 초기 Prop 값 {#default-prop-values}

`defaultProps` 프로퍼티를 할당함으로써 `props`의 초깃값을 정의할 수 있습니다.

```javascript
class Greeting extends React.Component {
  render() {
    return (
      <h1>Hello, {this.props.name}</h1>
    );
  }
}

// props의 초깃값을 정의합니다.
Greeting.defaultProps = {
  name: 'Stranger'
};

<<<<<<< HEAD
// "Hello, Stranger"를 랜더링 합니다.
ReactDOM.render(
  <Greeting />,
  document.getElementById('example')
);
```

[plugin-proposal-class-properties](https://babeljs.io/docs/en/babel-plugin-proposal-class-properties/) (이전의 _plugin-transform-class-properties_)와 같은 Babel 변환(transform)을 사용하고 있다면, `defaultProps`를 React 컴포넌트 클래스 내의 정적 프로퍼티로 선언 할 수도 있습니다. 이 문법은 아직 완성되지 않았으므로 브라우저에서 작동하기 위해서는 컴파일링 작업이 필요합니다. 더 자세한 정보를 위해서 [class fields proposal](https://github.com/tc39/proposal-class-fields)를 확인해 주시길 바랍니다.
=======
// Renders "Hello, Stranger":
const root = ReactDOM.createRoot(document.getElementById('example')); 
root.render(<Greeting />);
```

Since ES2022 you can also declare `defaultProps` as static property within a React component class. For more information, see the [class public static fields](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Public_class_fields#public_static_fields). This modern syntax will require a compilation step to work within older browsers. 
>>>>>>> ea9e9ab2817c8b7eff5ff60e8fe9b649fd747606

```javascript
class Greeting extends React.Component {
  static defaultProps = {
    name: 'stranger'
  }

  render() {
    return (
      <div>Hello, {this.props.name}</div>
    )
  }
}
```

`defaultProps`는 `this.props.name`의 값이 부모 컴포넌트에 의해 명시되지 않았을 때 값을 갖도록 할 것입니다. `propTypes`의 타입 검사는 `defaultProps`에도 적용되게 하기 위하여 `defaultProps`가 처리된 뒤에 일어날 것입니다.

### Function Components {#function-components}

함수 컴포넌트를 사용해서 개발한다면, PropTypes를 적절히 적용할 수 있도록 몇 가지 작은 변경사항을 만들어낼 수도 있습니다.

아래와 같은 컴포넌트가 있다고 생각해봅시다.

```javascript
export default function HelloWorldComponent({ name }) {
  return (
    <div>Hello, {name}</div>
  )
}
```

PropTypes를 추가하려면 아래처럼 컴포넌트를 외부에 노출시키기 전에 별도의 함수로 컴포넌트를 선언할 수 있습니다.

```javascript
function HelloWorldComponent({ name }) {
  return (
    <div>Hello, {name}</div>
  )
}

export default HelloWorldComponent
```

그러면, `HelloWorldComponent`에 직접 PropTypes를 추가할 수 있습니다.

```javascript
import PropTypes from 'prop-types'

function HelloWorldComponent({ name }) {
  return (
    <div>Hello, {name}</div>
  )
}

HelloWorldComponent.propTypes = {
  name: PropTypes.string
}

export default HelloWorldComponent
```
