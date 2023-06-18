---
title: Hooks의 규칙
---

아래와 같은 오류 메시지를 받았기 때문에 여기에 오신 것 같습니다:

<ConsoleBlock level="error">

Hooks can only be called inside the body of a function component.

</ConsoleBlock>

이 오류 메시지를 보는 이유는 보통 다음과 같습니다:

1. **Hooks의 규칙을 위반**했을 수 있습니다.
2. React와 React DOM의 **버전이 일치하지 않을** 수 있습니다.
3. 동일한 앱에서 **여러 개의 React 복사본**이 있을 수 있습니다.

이러한 경우들을 살펴보겠습니다.

## Hooks의 규칙을 위반 {/*breaking-rules-of-hooks*/}

React에서 `use`로 시작하는 함수를 [*Hooks*](/reference/react)라고 합니다.

**루프, 조건문 또는 중첩된 함수 내에서 Hooks를 호출하지 마세요.** 대신 Hooks를 항상 React 함수의 최상위 수준에서, return문 전에 사용하세요. Hooks는 React가 함수형 컴포넌트를 렌더링하는 동안에만 호출할 수 있습니다:

* ✅ [함수형 컴포넌트](/learn/your-first-component)의 본문의 최상위 수준에서 호출하세요.
* ✅ [사용자정의 Hook](/learn/reusing-logic-with-custom-hooks)의 본문에서 최상위 수준에서 호출하세요.

```js{2-3,8-9}
function Counter() {
  // ✅ 좋은 예: 함수 컴포넌트의 최상위 수준
  const [count, setCount] = useState(0);
  // ...
}

function useWindowWidth() {
  // ✅ 좋은 예: 사용자 정의 Hook의 최상위 수준
  const [width, setWidth] = useState(window.innerWidth);
  // ...
}
```

그 외의 경우에는 Hooks(이름이 `use`로 시작하는 함수)를 호출하는 것은 지원되지 **않습니다**. 예를 들어:

🔴 조건문 또는 루프 내에서 Hooks를 호출하지 마세요.
🔴 조건부 `return` 문 이후에 Hooks를 호출하지 마세요.
🔴 이벤트 핸들러에서 Hooks를 호출하지 마세요.
🔴 클래스형 컴포넌트에서 Hooks를 호출하지 마세요.
🔴 `useMemo`, `useReducer`, 또는 `useEffect`에 전달되는 함수 내에서 Hooks를 호출하지 마세요.

이러한 규칙을 어긴다면 이 오류를 볼 수 있습니다.

```js{3-4,11-12,20-21}
function Bad({ cond }) {
  if (cond) {
    // 🔴 잘못된 예: 조건문 내부 (해결하기 위해서는 밖으로 옮겨주세요!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  for (let i = 0; i < 10; i++) {
    // 🔴 잘못된 예: 루프 내부 (해결하기 위해서는 밖으로 옮겨주세요!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad({ cond }) {
  if (cond) {
    return;
  }
  // 🔴 잘못된 예: 조건부 반환 이후 (해결하기 위해서는 return문 보다 전으로 옮겨주세요!)
  const theme = useContext(ThemeContext);
  // ...
}

function Bad() {
  function handleClick() {
    // 🔴 잘못된 예: 이벤트 핸들러 내부 (해결하기 위해서는 밖으로 옮겨주세요!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  const style = useMemo(() => {
    // 🔴 잘못된 예: useMemo 내부 (해결하기 위해서는 밖으로 옮겨주세요!)
    const theme = useContext(ThemeContext);
    return createStyle(theme);
  });
  // ...
}

class Bad extends React.Component {
  render() {
    // 🔴 잘못된 예: 클래스 컴포넌트 내부 (해결하기 위해서는 클래스형 대신 함수형 컴포넌트를 작성해주세요!)
    useEffect(() => {})
    // ...
  }
}
```

이러한 실수를 잡기 위해 [eslint-plugin-react-hooks 플러그인](https://www.npmjs.com/package/eslint-plugin-react-hooks)을 사용할 수 있습니다.

<Note>

[사용자 정의 Hook](/learn/reusing-logic-with-custom-hooks)은 다른 Hooks를 호출할 수 *있습니다* (그것이 사용자 정의 Hook의 목적이기 때문입니다). 이는 사용자 정의 Hook도 함수형 컴포넌트가 렌더링되는 동안에만 호출되기 때문에 가능합니다.

</Note>

## React와 React DOM 버전의 불일치 {/*mismatching-versions-of-react-and-react-dom*/}

`react-dom` (< 16.8.0)이나 `react-native` (< 0.59)의 버전이 Hooks를 아직 지원하지 않을 수 있습니다. 애플리케이션 폴더에서 `npm ls react-dom` 또는 `npm ls react-native`을 실행하여 사용 중인 버전을 확인할 수 있습니다. 여러 개의 버전이 발견된 경우에도, 문제를 일으킬 수 있습니다(아래에서 더 자세히 설명합니다).

## 중복된 React {/*duplicate-react*/}

Hooks가 작동하려면 애플리케이션 코드에서 가져온 `react`의 import가 react-dom 패키지 내부에서 가져온 `react` import와 동일한 모듈을 가져와야 합니다.

이러한 `react` import가 두 개의 다른 exports 객체를 가져온다면, 이 경고가 표시됩니다. 이는 실수로 **두 개의 `react` 패키지 사본이 생긴 경우**에 발생할 수 있습니다.

패키지 관리를 위해 Node를 사용하는 경우 프로젝트 폴더에서 다음을 실행하여 이를 확인할 수 있습니다:

<TerminalBlock>

npm ls react

</TerminalBlock>

만약 두 개 이상의 React가 보일 경우, 이러한 상황이 발생한 이유를 찾고 의존성 트리를 수정해야 합니다. 예를 들어, 사용 중인 라이브러리가 `react`를 피어 종속성(peer dependency)이 아닌 종속성(dependency)으로 잘못 지정한 경우입니다. 해당 라이브러리가 수정되기 전까지는 [Yarn resolutions](https://yarnpkg.com/lang/en/docs/selective-version-resolutions/)이 가능한 해결책입니다.

또한 몇 가지 로그를 추가하고 개발 서버를 다시 시작하여 이 문제를 디버깅해 볼 수도 있습니다:

```js
// node_modules/react-dom/index.js에 추가
window.React1 = require('react');

// 컴포넌트 파일에 추가
require('react-dom');
window.React2 = require('react');
console.log(window.React1 === window.React2);
```

만약 `false`가 출력된다면 두 개의 React가 있을 수 있으며, 이러한 상황이 발생한 이유를 찾아야 합니다. [이 이슈](https://github.com/facebook/react/issues/13991)는 커뮤니티에서 발견한 일반적인 원인에 대해 설명하고 있습니다.

이 문제는 `npm link` 또는 유사한 기능을 사용할 때에도 발생할 수 있습니다. 이 경우 번들러는 2개의 React - 애플리케이션 폴더와 라이브러리 폴더에서 각각 하나씩을 "보게" 될 수 있습니다. `myapp`과 `mylib`이 형제 폴더라고 가정하면, `mylib`에서 `npm link ../myapp/node_modules/react`를 실행하여 라이브러리가 애플리케이션의 React 복사본을 사용하도록 할 수 있습니다.

<Note>

일반적으로 React는 한 페이지에서 여러 개의 독립적인 복사본을 사용할 수 있습니다 (예를 들어 앱과 타사 위젯이 모두 사용하는 경우). 문제는 컴포넌트와 그것과 함께 렌더링된 `react-dom` 복사본에서 `require('react')`가 다르게 처리된 경우에만 발생합니다.

</Note>

## 기타 원인 {/*other-causes*/}

만약 이 모든 방법이 도움이 되지 않는다면, [이 이슈](https://github.com/facebook/react/issues/13991)에 의견을 남기고 도움을 요청하세요. 작은 재현 가능한 예제를 만들어보면 문제를 발견할 수 있을 수도 있습니다.
