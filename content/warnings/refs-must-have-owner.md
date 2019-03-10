---
title: Refs Must Have Owner Warning
layout: single
permalink: warnings/refs-must-have-owner.html
---

다음 오류 메시지 중 하나가 나왔기 때문에 여기에 있을 것입니다.

*React 16.0.0+*
> 경고
>
> Element ref was specified as a string (myRefName) but no owner was set. You may have multiple copies of React loaded. (details: https://fb.me/react-refs-must-have-owner).
>
> 엘리먼트의 ref가 문자열 (myRefName)로 지정되었지만, 소유자가 설정되지 않았습니다. 여러 개의 React가 로딩됐을 수 있습니다. (자세히 알아보기. https://fb.me/react-refs-must-have-owner)

*이전 버전의 React*
> 경고
>
> addComponentAsRefTo(...): Only a ReactOwner can have refs. You might be adding a ref to a component that was not created inside a component's `render` method, or you have multiple copies of React loaded.
>
> addComponentAsRefTo(...): ReactOwner만 refs를 가질 수 있습니다. 컴포넌트의 `render` 메서드 안에 생성되지 않은 컴포넌트에 ref를 추가하거나, React가 여러 개 로딩됐을 수 있습니다.

이것은 일반적으로 다음 세 가지 중 하나를 의미합니다.

- 함수 컴포넌트에 `ref`를 추가하려고 했을 경우입니다.
- 컴포넌트의 render() 함수 외부에서 생성되는 엘리먼트에 `ref`를 추가하려고 했을 경우입니다.
- 여러 개의 (충돌하는) React가 있습니다. (예시. 잘못 설정된 npm 의존성 때문에)

## 함수 컴포넌트에서의 refs {#refs-on-function-components}

`<Foo>`가 함수 컴포넌트인 경우 ref를 추가할 수 없습니다.

```js
// Foo가 함수 컴포넌트인 경우 작동하지 않습니다!
<Foo ref={foo} />
```

컴포넌트에 ref를 추가해야 하는 경우 먼저 클래스로 컴포넌트로 변경하거나 refs가 필요한 경우가 [거의 없으므로](/docs/refs-and-the-dom.html#when-to-use-refs) ref를 사용하지 않는 것이 좋습니다.

## render 메서드 외부에서의 문자열 refs {#strings-refs-outside-the-render-method}

이것은 일반적으로 소유자가 없는 컴포넌트에 ref를 추가하려는 것입니다. (즉, 다른 컴포넌트의 `render` 메서드 내부에서 생성되지 않았다는 것입니다) 예를 들어, 다음은 작동하지 않습니다.

```js
// 작동하지 않습니다!
ReactDOM.render(<App ref="app" />, el);
```

이 컴포넌트를 ref를 소유할 새로운 최상위 컴포넌트 안에 렌더링해 보세요. 또는 콜백 ref를 사용할 수도 있습니다.

```js
let app;
ReactDOM.render(
  <App ref={inst => {
    app = inst;
  }} />,
  el
);
```

이 방법을 사용하기 전에 [정말 ref가 필요한지](/docs/refs-and-the-dom.html#when-to-use-refs) 생각해보세요.

## 여러 개의 React {#multiple-copies-of-react}

Bower는 의존성 중복 제거 작업을 잘하지만 npm은 그렇지 않습니다. refs로 특별한 일을 하는 게 아니라면, refs 문제가 아니라는 좋은 징조입니다. 그보다는 오히려 여러 개의 React가 프로젝트에 로딩되는 문제일 가능성이 있습니다. 때에 따라 npm을 통해 서드파티 모듈을 가져오면 의존성 라이브러리에 중복된 사본이 생성되어 문제가 발생할 수 있습니다.

npm을 사용한다면... 'npm ls' 또는 'npm ls react'가 이 도움이 될 수 있습니다.
