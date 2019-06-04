---
title: Invalid Hook Call Warning
layout: single
permalink: warnings/invalid-hook-call-warning.html
---

다음과 같은 오류 메시지가 나왔기 때문에 여기에 있을 것입니다.

> Hooks can only be called inside the body of a function component.
> 
> (Hooks는 함수 컴포넌트의 본문 내에서만 호출할 수 있습니다.)

다음 세 가지 일반적인 이유로 이 오류 메시지를 보게 됩니다.

1. React와 React DOM의 **버전이 일치하지 않을 수 있습니다.**
2. **[Hooks 규칙](/content/docs/hooks-rules.md)을 위반했을 수 있습니다.**
3. 같은 앱에 **React가 한 개 이상**있을 수 있습니다.

각각의 경우를 살펴보겠습니다.

## React와 React DOM의 버전 불일치 {#mismatching-versions-of-react-and-react-dom}

Hooks를 아직 지원하지 않는`react-dom`(<16.8.0) 또는`react-native` (<0.59)의 버전을 사용 중일 수 있습니다.
애플리케이션 폴더에서 `npm ls react-dom` 또는 `npm ls react-native`를 실행하여 사용 중인 버전을 확인할 수 있습니다. 만약 한 개보다 많이 나오면 문제가 발생할 수도 있습니다. (아래에서 자세히 설명합니다.)

## Hooks 규칙 위반 {#breaking-the-rules-of-hooks}

React에서 **함수 컴포넌트를 렌더링하는 동안**에만 Hooks를 호출할 수 있습니다.

* ✅ 함수 컴포넌트 본문의 최상위 레벨에서 호출하세요.
* ✅ [사용자 정의 Hook](/content/docs/hooks-custom.md) 본체의 최상위 레벨에서 호출하세요.

**이에 대한 자세한 내용은 [Hooks 규칙](/content/docs/hooks-rules.md)에서 알아보세요.**

```js{2-3,8-9}
function Counter() {
  // ✅ 권장: 함수 컴포넌트의 최상위 레벨
  const [count, setCount] = useState(0);
  // ...
}

function useWindowWidth() {
  // ✅ 권장: 사용자 정의 Hook의 최상위 레벨
  const [width, setWidth] = useState(window.innerWidth);
  // ...
}
```

혼란을 주지 않기 위해 다른 경우에는 Hooks를 호출하는 것이 지원되지 **않습니다**.

* 🔴 클래스 컴포넌트에서 Hooks를 호출하지 마세요.
* 🔴 이벤트 핸들러에서 호출하지 마세요.
* 🔴 `useMemo`, `useReducer` 또는 `useEffect`에 전달 된 함수 내에서 Hooks를 호출하지 마세요.

이러한 규칙을 위반하면 아래와 같은 오류가 표시될 수 있습니다.

```js{3-4,11-12,20-21}
function Bad1() {
  function handleClick() {
    // 🔴 금지: 이벤트 핸들러 내에서 사용 (고치려면 바깥으로 옮기세요!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad2() {
  const style = useMemo(() => {
    // 🔴 금지: useMemo 안에서 사용 (고치려면 바깥으로 옮기세요!)
    const theme = useContext(ThemeContext);
    return createStyle(theme);
  });
  // ...
}

class Bad3 extends React.Component {
  render() {
    // 🔴 금지: 클래스 컴포넌트 안에서 사용
    useEffect(() => {})
    // ...
  }
}
```

이런 실수를 방지하기 위해 [`eslint-plugin-react-hooks` 플러그인](https://www.npmjs.com/package/eslint-plugin-react-hooks)을 사용 할 수 있습니다.

>주의
>
>[사용자 정의 Hooks](/content/docs/hooks-custom.md)는 다른 Hooks를 호출*할 수도* 있습니다 (이것이 사용자 정의 Hooks의 목적입니다). 사용자 정의 Hooks도 함수 컴포넌트가 렌더링되는 동안에만 호출되도록 되어있기 때문에 문제없이 동작합니다.

## React 중복 {#duplicate-react}

Hooks가 작동하려면 애플리케이션 코드에서 가져온 `react`가 `react-dom` 패키지 내부에서 가져온 `react`와 같은 모듈이어야 합니다.

가져온 `react`가 서로 다른 곳에서 왔을 때 이 경고가 표시됩니다. **실수로 `react` 패키지의 두 복사본**이 있는 경우에 이런 일이 발생할 수 있습니다.

Node 패키지 매니저(NPM)를 사용하는 경우 프로젝트 폴더에서 아래 명령어를 통해 확인 해볼 수 있습니다.

    npm ls react

하나 이상의 React가 표시되면 왜 이런 일이 발생하는지 파악하고 의존성 트리를 수정해야합니다. 예를 들어, 사용 중인 라이브러리에서 `react`를 피어 의존성(peer dependency)이 아닌 의존성(dependency)으로 지정했을 수도 있습니다. 해당 라이브러리가 수정 될 때까지, [Yarn resolution](https://yarnpkg.com/lang/en/docs/selective-version-resolutions/)이 이 문제의 해결 방안 중 하나입니다.

또한 로그를 추가하거나 개발 서버를 다시 시작해서 이 문제를 디버깅 할 수 있습니다.

```js
// node_modules/react-dom/index.js에 아래를 추가하세요.
window.React1 = require('react');

// 컴포넌트 파일에 아래를 추가하세요.
require('react-dom');
window.React2 = require('react');
console.log(window.React1 === window.React2);
```

`false`가 출력되면 두 개의 React가 있는 것이고 그 이유를 알아낼 필요가 있습니다. [이 이슈](https://github.com/facebook/react/issues/13991)에는 커뮤니티에서 흔히 발생하는 몇 가지 일반적인 이유를 확인 할 수 있습니다.

이 문제는 `npm link` 같은 것을 사용할 때 나타날 수 있습니다. 이 경우 하나는 애플리케이션 폴더에, 다른 하나는 라이브러리 폴더에 React가 있는 것을 볼 수 있을지 모릅니다. `myapp`과 `mylib`이 형제 폴더라고 가정 할 때, 한가지 가능한 해결책은 `mylib`에서 `npm link ../myapp/node_modules/react`를 실행하는 것입니다. 이렇게하면 라이브러리가 애플리케이션의 React를 사용하게 합니다.

>주의
>
>일반적으로 React는 한 페이지에서 여러 독립된 사본을 사용하도록 지원합니다 (예시: 앱과 서드 파티 위젯 모두에서 사용하는 경우). 렌더링 된 컴포넌트와 `react-dom`간에 `require('react')`를 다르게 참조되는 경우에만 깨집니다.

## 다른 원인 {#other-causes}

이 모든게 도움이 되지 않았다면 [이 이슈](https://github.com/facebook/react/issues/13991)에 코멘트를 남기세요. 그러면 도와 드리겠습니다. 재현할 수 있는 작은 예시를 만들어보면 그 문제를 발견 할지도 모릅니다.
