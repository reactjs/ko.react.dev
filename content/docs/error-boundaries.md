---
id: error-boundaries
title: 에러 경계(Error Boundaries)
permalink: docs/error-boundaries.html
---

과거에는 컴포넌트 내부의 자바스크립트 에러가 React의 내부 상태를 훼손하고 다음 렌더링에서 [암호화](https://github.com/facebook/react/issues/6895) [에러](https://github.com/facebook/react/issues/8579) [방출](https://github.com/facebook/react/issues/4026)을 유발하곤 했습니다. 이러한 에러는 항상 애플리케이션 코드의 이전 단계의 에러로 인해 발생했지만, React는 컴포넌트 내에서 에러를 정상적으로 처리할 수 있는 방법을 제공하지 않아 이를 복구할 수가 없었습니다.


## 에러 경계의 소개 {#introducing-error-boundaries}

UI의 일부분에 존재하는 자바스크립트 에러가 전체 애플리케이션을 중단시켜서는 안 됩니다. React 사용자들이 겪는 이 문제를 해결하기 위해 React 16에서는 에러 경계(“error boundary”)라는 새로운 개념이 도입되었습니다.

에러 경계는 **하위 컴포넌트 트리의 어디에서든 자바스크립트 에러를 기록하며 깨진 컴포넌트 트리 대신 폴백 UI를 보여주는** React 컴포넌트입니다. 에러 경계는 렌더링 도중 생명주기 메서드 및 그 아래에 있는 전체 트리에서 에러를 잡아냅니다.

> Note
>
> 에러 경계는 다음과 같은 에러는 포착하지 **않습니다**.
>
> * 이벤트 핸들러 ([더 알아보기](#how-about-event-handlers))
> * 비동기적 코드 (예: `setTimeout` 혹은 `requestAnimationFrame` 콜백)
> * 서버 사이드 렌더링
> * 자식에서가 아닌 에러 경계 자체에서 발생하는 에러

생명주기 메서드인 [`static getDerivedStateFromError()`](/docs/react-component.html#static-getderivedstatefromerror) 와 [`componentDidCatch()`](/docs/react-component.html#componentdidcatch) 중 하나 (혹은 둘 다)를 정의하면 클래스 컴포넌트 자체가 에러 경계가 됩니다. 에러가 발생한 뒤에 폴백 UI를 렌더링하려면 `static getDerivedStateFromError()`를 사용하세요. 에러 정보를 기록하려면 `componentDidCatch()`를 사용하세요.

```js{7-10,12-15,18-21}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 다음 렌더링에서 폴백 UI가 보이도록 상태를 업데이트 합니다.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 에러 리포팅 서비스에 에러를 기록할 수도 있습니다.
    logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 폴백 UI를 커스텀하여 렌더링할 수 있습니다.
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

그런 다음엔 아래와 같이 일반 컴포넌트로 사용할 수 있습니다.

```js
<ErrorBoundary>
  <MyWidget />
</ErrorBoundary>
```

에러 경계는 자바스크립트의 `catch {}` 구문과 유사하게 동작하지만 컴포넌트에 적용됩니다. 오직 클래스 컴포넌트만이 에러 경계가 될 수 있습니다. 실제로도 대부분의 경우 에러 경계 컴포넌트를 한 번만 선언하여 애플리케이션 전체에서 활용하려고 할 것입니다.

**에러 경계는 트리 내에서 하위에 존재하는 컴포넌트의 에러만을 포착합니다**. 에러 경계 자체적으로는 에러를 포착할 수 없습니다. 에러 경계가 에러 메시지를 렌더링하는 데에 실패한다면 에러는 그 위의 가장 가까운 에러 경계로 전파될 것입니다. 이 또한 자바스크립트의 `catch {}` 구문이 동작하는 방식과 유사합니다.

## 라이브 데모 {#live-demo}

[React 16](/blog/2017/09/26/react-v16.0.html)으로 구현된 [에러 경계 선언과 사용 예시](https://codepen.io/gaearon/pen/wqvxGa?editors=0010)를 참고하세요.


## 에러 경계를 배치할 위치 {#where-to-place-error-boundaries}

에러 경계의 좀 더 세분화된 부분은 개발자에게 달려있습니다. 서버 사이드 프레임워크가 충돌을 해결하는 것처럼 최상위 경로의 컴포넌트를 감싸서 유저에게 “문제가 발생했습니다”라는 메시지를 보여줄 수 있습니다. 또한 에러 경계의 각 위젯을 에러 경계로 감싸서 애플리케이션의 나머지 부분이 충돌하지 않도록 보호할 수도 있습니다.


## 포착되지 않는 에러에 대한 새로운 동작 {#new-behavior-for-uncaught-errors}

이 변경사항은 중요한 의미를 갖습니다. **React 16부터는 에러 경계에서 포착되지 않은 에러로 인해 전체 React 컴포넌트 트리의 마운트가 해제됩니다.**

우리는 이 결정에 대해서 논의했지만 우리의 경험에 따르면 손상된 UI를 완전히 제거하는 것보다 그대로 남겨두는 것이 더 좋지 않습니다. 예를 들어 메신저와 같은 제품에서 손상된 UI를 그대로 남겨두면 누군가가 잘못된 사람에게 메시지를 보내게 될 가능성이 있습니다. 마찬가지로 결제 앱의 예를 들면 잘못된 금액을 보여주는 것이 아무 것도 렌더링하지 않는 것보다 더 나쁩니다.

이 변경사항은 React 16으로 마이그레이션 할 때 애플리케이션에서 이전에 알려지지 않았던 기존에 존재하던 충돌을 발견할 수 있음을 의미합니다. 에러 경계를 추가함으로써 문제가 발생했을 때 더 나은 사용자 경험을 제공할 수 있습니다.

예를 들어 페이스북 메신저는 사이드 바, 정보 패널, 대화 기록과 메시지 입력을 각각 별도의 에러 경계로 감싸두었습니다. 이 UI 영역 중 하나의 컴포넌트에서 충돌이 발생하면 나머지 컴포넌트는 대화형으로 유지됩니다.

또한 프로덕션 환경에서 발생한 처리되지 않은 예외 상황에 대하여 학습하고 수정할 수 있도록 자바스크립트 에러 리포팅 서비스를 활용하거나 직접 작성하는 것을 권장합니다.


## 컴포넌트 스택 추적 {#component-stack-traces}

React 16은 애플리케이션이 실수로 에러를 집어삼킨 경우에도 개발 과정에서 렌더링하는 동안 발생한 모든 에러를 콘솔에 출력합니다. 에러 메시지 및 자바스크립트 스택과 더불어 React 16은 컴포넌트 스택 추적 또한 제공합니다. 이제 정확히 컴포넌트 트리의 어느 부분에서 에러가 발생했는지 확인할 수 있게 되었습니다.

<img src="../images/docs/error-boundaries-stack-trace.png" style="max-width:100%" alt="에러 경계에 의해 포착된 에러">

또한 컴포넌트 스택 추적 내에서 파일 이름과 줄 번호도 확인할 수 있습니다. 이는 [Create React App](https://github.com/facebookincubator/create-react-app) 프로젝트 내에서 기본적으로 동작합니다.

<img src="../images/docs/error-boundaries-stack-trace-line-numbers.png" style="max-width:100%" alt="에러 경계에 의해 줄 번호와 함께 포착된 에러">

Create React App을 사용하지 않는 경우에는 수동으로 [이 플러그인](https://www.npmjs.com/package/@babel/plugin-transform-react-jsx-source)을 Babel 설정을 추가할 수 있습니다. 이 기능은 개발 단계를 위해서만 제작되었으며 **프로덕션 환경에서는 비활성화 해야합니다**.

> 주의
>
> 스택 추적에 표시되는 컴포넌트 이름은 [`Function.name`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name) 프로퍼티에 따라 다릅니다. 아직 기본적으로 제공하지 않는 구형 브라우저 혹은 디바이스(예: IE11)를 지원하는 경우 번들 애플리케이션에 [`function.name-polyfill`](https://github.com/JamesMGreene/Function.name)과 같은 `Function.name` 폴리필(Polyfill)을 포함시키는 것을 고려해볼 수 있습니다. 또는 모든 컴포넌트에서[`displayName`](/docs/react-component.html#displayname) 프로퍼티를 명시적으로 설정할 수도 있습니다.


## try/catch는 어떤가요? {#how-about-trycatch}

`try` / `catch`는 훌륭하지만 명령형 코드에서만 동작합니다.

```js
try {
  showButton();
} catch (error) {
  // ...
}
```

그러나 React 컴포넌트는 선언적이며 *무엇*을 렌더링할지 구체화합니다.

```js
<Button />
```

에러 경계는 React의 선언적인 특성을 보존하고 예상한 대로 동작합니다. 예를 들어 트리의 깊숙한 어딘가에 있는`setState`에 의해 유발된 `componentDidUpdate` 메서드에서 에러가 발생하더라도 가장 가까운 에러 경계에 올바르게 전달됩니다.

## 이벤트 핸들러는 어떤가요? {#how-about-event-handlers}

에러 경계는 이벤트 핸들러 내부에서는 에러를 포착하지 **않습니다**.

React는 이벤트 핸들러의 에러를 해결하기 위해서 에러 경계를 필요로 하지 않습니다. render 메서드 및 생명주기 메서드와 달리 이벤트 핸들러는 렌더링 중에 발생하지 않습니다. 따라서 이벤트 핸들러가 에러를 던져도 React는 여전히 화면에 무엇을 표시해야 할 지 알고 있습니다.

이벤트 핸들러 내에서 에러를 잡아야 하는 경우에 일반 자바스크립트의 `try` / `catch` 구문을 사용하세요.

```js{9-13,17-20}
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    try {
      // 에러를 던질 수 있는 무언가를 해야합니다.
    } catch (error) {
      this.setState({ error });
    }
  }

  render() {
    if (this.state.error) {
      return <h1>Caught an error.</h1>
    }
    return <button onClick={this.handleClick}>Click Me</button>
  }
}
```

위의 예시는 일반적인 자바스크립트의 동작을 보여주며 에러 경계를 사용하지 않습니다.

## React 15에서 변경된 명명법 {#naming-changes-from-react-15}

React 15는 `unstable_handleError`라는 다른 메서드 이름으로 에러 경계에 대해 매우 제한적인 지원을 포함하고 있었습니다. 이 메서드는 더 이상 동작하지 않으며 첫 16 베타 릴리즈부터 코드에서 `componentDidCatch`로 변경해야 합니다.

이 변경사항을 위해 코드를 자동으로 마이그레이션하기 위한 [codemod](https://github.com/reactjs/react-codemod#error-boundaries)를 제공했습니다.
