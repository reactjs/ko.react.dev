---
title: "React 19 업그레이드 가이드"
author: Ricky Hanlon
date: 2024/04/25
description: React 19에 추가된 개선 사항들로 인해 일부 주요한 변경 사항이 있지만, 업그레이드를 가능한 원활하게 진행할 수 있도록 노력했으며 대부분의 앱에 큰 영향이 없을 것으로 예상합니다. 이 글에서는 앱과 라이브러리를 React 19로 업그레이드하는 단계를 안내합니다.
---

2024년 4월 25일, [Ricky Hanlon](https://twitter.com/rickhanlonii)

---


<Intro>

React 19에 추가된 개선 사항들로 인해 일부 주요한 변경 사항<sup>Breaking Changes</sup>이 있지만, 업그레이드를 가능한 한 원활하게 진행할 수 있도록 노력했으며 대부분의 앱에 큰 영향이 없을 것으로 예상합니다.

</Intro>

<Note>

#### React 18.3도 함께 출시되었습니다 {/*react-18-3*/}

React 19으로의 업그레이드를 더 쉽게 돕기 위해 `react@18.3`을 출시했습니다. 이 버전은 18.2와 동일하지만, 더 이상 사용되지 않는 API 및 React 19에 필요한 변경 사항에 대한 경고를 추가했습니다.

React 19로 업그레이드하기 전에 먼저 React 18.3으로 업데이트하여 잠재적인 문제를 미리 파악하는 것을 권장합니다.

18.3 버전의 변경 사항들은 [릴리스 노트](https://github.com/facebook/react/blob/main/CHANGELOG.md#1830-april-25-2024)에서 확인할 수 있습니다.

</Note>

이 글에서는 React 19로 업그레이드하는 방법을 단계별로 안내합니다.

- [설치](#installing)
- [Codemods](#codemods)
- [주요한 변경 사항](#breaking-changes)
- [사용 중단된 사항](#new-deprecations)
- [주목할 만한 변경 사항](#notable-changes)
- [TypeScript 변경 사항](#typescript-changes)
- [변경 로그](#changelog)

React 19를 테스트해 보고 싶다면 해당 가이드에 나와 있는 단계를 따라주시고, 문제가 발생하면 [이슈를 제보해 주세요](https://github.com/facebook/react/issues/new?assignees=&labels=React+19&projects=&template=19.md&title=%5BReact+19%5D). React 19에 새롭게 추가된 기능 목록은 [React 19 릴리스 게시글](/blog/2024/12/05/react-19)에서 확인할 수 있습니다.

---
## 설치 {/*installing*/}

<Note>

#### 이제 새로운 JSX 변환 방식은 필수입니다 {/*new-jsx-transform-is-now-required*/}

2020년에 [새로운 JSX 변환](https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)을 도입하여 번들 크기를 줄이고 React를 import 하지 않고도 JSX를 사용할 수 있도록 했습니다. React 19에서는 Ref를 Prop으로 사용할 수 있는 기능이나 JSX 성능 향상과 같은 추가적인 개선 사항이 도입되며, 이러한 기능들은 새로운 변환<sup>New Transform</sup>이 필요합니다.

새로운 변환이 활성화되지 않으면 다음과 같은 경고가 표시됩니다.

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Your app (or one of its dependencies) is using an outdated JSX transform. Update to the modern JSX transform for faster performance: https://react.dev/link/new-jsx-transform

</ConsoleLogLine>

</ConsoleBlockMulti>


대부분의 환경에서는 이미 활성화되어 있기 때문에 대부분의 앱은 영향을 받지 않으리라고 예상됩니다. 수동으로 업그레이드하는 방법은 [해당 공지](https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)를 참고하세요.

</Note>


최신 버전의 React 및 React DOM을 설치하기 위해 다음 명령어를 입력하세요.

```bash
npm install --save-exact react@^19.0.0 react-dom@^19.0.0
```

Yarn을 사용한다면 다음 명령어를 입력하세요.

```bash
yarn add --exact react@^19.0.0 react-dom@^19.0.0
```

TypeScript를 사용한다면 타입에 대한 업데이트도 필요합니다.
```bash
npm install --save-exact @types/react@^19.0.0 @types/react-dom@^19.0.0
```

Yarn을 사용한다면 다음 명령어를 입력하세요.
```bash
yarn add --exact @types/react@^19.0.0 @types/react-dom@^19.0.0
```

가장 흔한 교체 작업을 위한 Codemod도 포함되어 있습니다. 아래의 [TypeScript 변경 사항](#typescript-changes)을 참고하세요.

## Codemods {/*codemods*/}

업그레이드를 돕기 위해 [codemod.com](https://codemod.com) 팀과 협력하여 React 19의 새로운 API 및 패턴에 맞게 코드를 자동으로 업데이트해 주는 Codemod를 공개했습니다.

모든 Codemod는 [`react-codemod` 저장소](https://github.com/reactjs/react-codemod)에 있으며, Codemod 팀도 유지보수 하는 데 함께하고 있습니다. Codemod를 실행할 때는 `react-codemod`보다 `codemod` 명령어 사용을 권장합니다. 왜냐하면 해당 명령어로 실행했을 때 더 빠르고, 더 복잡한 코드 마이그레이션을 처리하고, TypeScript에 대한 더 나은 지원을 제공합니다.


<Note>

#### React 19 codemod 전체 실행 {/*run-all-react-19-codemods*/}

이 가이드에 나열된 모든 Codemod를 React 19의 `codemod` 레시피를 통해 한 번에 실행하려면 다음 명령어를 입력하세요.

```bash
npx codemod@latest react/19/migration-recipe
```

이 명령어를 실행하면 `react-codemod`에서 아래 Codemod가 실행됩니다.
- [`replace-reactdom-render`](https://github.com/reactjs/react-codemod?tab=readme-ov-file#replace-reactdom-render)
- [`replace-string-ref`](https://github.com/reactjs/react-codemod?tab=readme-ov-file#replace-string-ref)
- [`replace-act-import`](https://github.com/reactjs/react-codemod?tab=readme-ov-file#replace-act-import)
- [`replace-use-form-state`](https://github.com/reactjs/react-codemod?tab=readme-ov-file#replace-use-form-state)
- [`prop-types-typescript`](https://github.com/reactjs/react-codemod#react-proptypes-to-prop-types)

이 명령어는 TypeScript 변경 사항은 포함하지 않습니다. 아래의 [TypeScript 변경 사항](#typescript-changes)을 참고하세요.

</Note>

Codemod가 포함된 변경 사항에는 아래와 같이 명령어가 함께 제공됩니다.

사용할 수 있는 모든 Codemod 목록은 [`react-codemod` 저장소](https://github.com/reactjs/react-codemod)를 참고하세요.

## 주요한 변경 사항<sup>Breaking Changes</sup> {/*breaking-changes*/}

### 렌더링 중에 발생한 오류는 re-throw 하지 않음 {/*errors-in-render-are-not-re-thrown*/}

이전 버전의 React에서는 렌더링 중에 발생한 오류를 잡아서 re-throw 했습니다. 개발 모드<sup>DEV</sup>에서는 `console.error`로도 로그를 출력하여 오류 로그가 중복되는 문제가 있었습니다.

React 19에서는 [오류 처리 방식을 개선하여](/blog/2024/04/25/react-19#error-handling) 더 이상 오류를 re-throw 하지 않음으로써 중복 로그를 줄였습니다.

- **포착되지 않은 오류**: Error Boundary에서 잡히지 않은 오류는 `window.reportError`로 보고됩니다.
- **포착된 오류**: Error Boundary에서 잡힌 오류는 `console.error`로 보고됩니다.

이 변경은 대부분의 앱에 영향을 주지 않지만, 프로덕션 환경에서의 오류 보고가 re-throw에 의존하고 있다면 오류 처리 방식을 업데이트해야 할 수 있습니다. 이를 지원하기 위해 `createRoot` 및 `hydrateRoot`에 사용자 정의 오류 처리를 위한 새로운 메서드가 추가되었습니다.

```js [[1, 2, "onUncaughtError"], [2, 5, "onCaughtError"]]
const root = createRoot(container, {
  onUncaughtError: (error, errorInfo) => {
    // ... log error report
  },
  onCaughtError: (error, errorInfo) => {
    // ... log error report
  }
});
```

자세한 내용은 [`createRoot`](https://react.dev/reference/react-dom/client/createRoot) 및 [`hydrateRoot`](https://react.dev/reference/react-dom/client/hydrateRoot) 문서를 참고하세요.


### React의 더 이상 사용되지 않는 API 제거 {/*removed-deprecated-react-apis*/}

#### 제거됨: 함수형 컴포넌트에서의 `propTypes` 및 `defaultProps` {/*removed-proptypes-and-defaultprops*/}
`PropTypes`는 [2017년 4월 (v15.5.0)](https://legacy.reactjs.org/blog/2017/04/07/react-v15.5.0.html#new-deprecation-warnings)부터 더 이상 권장하지 않습니다.

React 19에서는 `propType` 검사 기능이 React 패키지에서 제거되며 사용하더라도 아무 동작도 하지 않습니다. `propTypes`를 사용 중이라면 TypeScript나 다른 타입 검사 도구로 마이그레이션하는 것을 권장합니다.

또한, 함수형 컴포넌트에서는 `defaultProps`가 제거되며, 대신 ES6의 기본 매개변수를 사용해야 합니다. 클래스형 컴포넌트에서는 ES6 대안이 없어서 `defaultProps`가 여전히 지원됩니다.

```js
// 변경 전
import PropTypes from 'prop-types';

function Heading({text}) {
  return <h1>{text}</h1>;
}
Heading.propTypes = {
  text: PropTypes.string,
};
Heading.defaultProps = {
  text: 'Hello, world!',
};
```
```ts
// 변경 후
interface Props {
  text?: string;
}
function Heading({text = 'Hello, world!'}: Props) {
  return <h1>{text}</h1>;
}
```

<Note>

Codemod를 사용해 `propTypes`를 TypeScript로 바꾸려면 다음 명령어를 입력하세요.

```bash
npx codemod@latest react/prop-types-typescript
```

</Note>

#### 제거됨: `contextTypes`와 `getChildContext`를 사용하는 레거시 콘텍스트 {/*removed-removing-legacy-context*/}

레거시 콘텍스트는 [2018년 10월 (v16.6.0)](https://legacy.reactjs.org/blog/2018/10/23/react-v-16-6.html)부터 더 이상 권장하지 않습니다.

레거시 콘텍스트는 클래스형 컴포넌트에서 `contextTypes`와 `getChildContext` API를 통해 사용할 수 있었지만, 미묘한 버그들로 인해 `contextType` API로 대체되었습니다. React 19에서는 React의 크기를 줄이고 성능을 향상하기 위해 레거시 콘텍스트가 제거됩니다.

아직도 클래스형 컴포넌트에서 레거시 콘텍스트를 사용하고 있다면, 새로운 `contextType`API로 마이그레이션해야 합니다.

```js {5-11,19-21}
// 변경 전
import PropTypes from 'prop-types';

class Parent extends React.Component {
  static childContextTypes = {
    foo: PropTypes.string.isRequired,
  };

  getChildContext() {
    return { foo: 'bar' };
  }

  render() {
    return <Child />;
  }
}

class Child extends React.Component {
  static contextTypes = {
    foo: PropTypes.string.isRequired,
  };

  render() {
    return <div>{this.context.foo}</div>;
  }
}
```

```js {2,7,9,15}
// 변경 후
const FooContext = React.createContext();

class Parent extends React.Component {
  render() {
    return (
      <FooContext value='bar'>
        <Child />
      </FooContext>
    );
  }
}

class Child extends React.Component {
  static contextType = FooContext;

  render() {
    return <div>{this.context}</div>;
  }
}
```

#### 제거됨: 문자열 Refs {/*removed-string-refs*/}
문자열 Refs는 [2018년 3월 (v16.3.0)](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html)부터 더 이상 권장되지 않습니다.

클래스형 컴포넌트에서는 문자열 Refs를 사용할 수 있었지만, [여러 단점](https://github.com/facebook/react/issues/1373)으로 인해 Ref 콜백 방식으로 대체되었습니다. React 19에서는 React를 더 간단하고 이해하기 쉽게 만들기 위해 문자열 Refs가 제거됩니다.

클래스형 컴포넌트에서 아직 문자열 Refs를 사용하고 있다면, Ref 콜백으로 마이그레이션해야 합니다.

```js {4,8}
// 변경 전
class MyComponent extends React.Component {
  componentDidMount() {
    this.refs.input.focus();
  }

  render() {
    return <input ref='input' />;
  }
}
```

```js {4,8}
// 변경 후
class MyComponent extends React.Component {
  componentDidMount() {
    this.input.focus();
  }

  render() {
    return <input ref={input => this.input = input} />;
  }
}
```

<Note>

Codemod를 사용해 문자열 refs를 `ref` 콜백으로 바꾸려면 다음 명령어를 입력하세요.

```bash
npx codemod@latest react/19/replace-string-ref
```

</Note>

#### 제거됨: 모듈 패턴 팩토리<sup>Module Pattern Factories</sup> {/*removed-module-pattern-factories*/}
모듈 패턴 팩토리는 [2019년 8월 (v16.9.0)](https://legacy.reactjs.org/blog/2019/08/08/react-v16.9.0.html#deprecating-module-pattern-factories)부터 더 이상 권장되지 않습니다.

이 패턴은 거의 사용되지 않았으며, 이를 지원하는 것은 React를 불필요하게 더 크고 느리게 만들었습니다. React 19에서는 모듈 패턴 팩토리에 대한 지원이 제거되며 일반 함수로 마이그레이션해야 합니다.

```js
// 변경 전
function FactoryComponent() {
  return { render() { return <div />; } }
}
```

```js
// 변경 후
function FactoryComponent() {
  return <div />;
}
```

#### 제거됨: `React.createFactory` {/*removed-createfactory*/}
`createFactory`는 [2020년 2월 (v16.13.0)](https://legacy.reactjs.org/blog/2020/02/26/react-v16.13.0.html#deprecating-createfactory)부터 더 이상 권장하지 않습니다.

`createFactory`는 JSX가 널리 사용되기 전에는 일반적이었지만 오늘날에는 거의 사용되지 않으며 JSX로 쉽게 대체할 수 있습니다. React 19에서는 `createFactory`가 제거되며 JSX로 마이그레이션해야 합니다.

```js
// 변경 전
import { createFactory } from 'react';

const button = createFactory('button');
```

```js
// 변경 후
const button = <button />;
```

#### 제거됨: `react-test-renderer/shallow` {/*removed-react-test-renderer-shallow*/}

React 18에서는 `react-test-renderer/shallow`를 [react-shallow-renderer](https://github.com/enzymejs/react-shallow-renderer)로 다시 내보내도록 업데이트했습니다. React 19에서는 `react-test-render/shallow`가 완전히 제거되며 대신 해당 패키지를 직접 설치해야 합니다.

```bash
npm install react-shallow-renderer --save-dev
```
```diff
- import ShallowRenderer from 'react-test-renderer/shallow';
+ import ShallowRenderer from 'react-shallow-renderer';
```

<Note>

##### Shallow 렌더링 재고 권장 {/*please-reconsider-shallow-rendering*/}

Shallow 렌더링은 React 내부 구현에 의존하며 향후 React 업그레이드를 방해할 수 있습니다. 테스트를 [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) 또는 [@testing-library/react-native](https://testing-library.com/docs/react-native-testing-library/intro)로 마이그레이션하는 것을 권장합니다.

</Note>

### 더 이상 사용되지 않는 React DOM API 제거 {/*removed-deprecated-react-dom-apis*/}

#### 제거됨: `react-dom/test-utils` {/*removed-react-dom-test-utils*/}

`act`는 이제 `react-dom/test-utils` 대신 `react` 패키지에서 가져와야 합니다.

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

`ReactDOMTestUtils.act` is deprecated in favor of `React.act`. Import `act` from `react` instead of `react-dom/test-utils`. See https://react.dev/warnings/react-dom-test-utils for more info.

</ConsoleLogLine>

</ConsoleBlockMulti>

이 경고를 해결하려면 `react`에서 `act`를 import 하세요.

```diff
- import {act} from 'react-dom/test-utils'
+ import {act} from 'react';
```

기존의 다른 `test-utils` 함수들은 모두 제거되었습니다. 이러한 유틸리티는 흔히 사용되진 않았고 컴포넌트나 React의 내부 구현에 과하게 의존하게 만들 수 있었습니다. React 19에서 이 함수들을 호출하면 에러가 발생하며 다음 버전에서는 export도 완전히 제거될 예정입니다.

대체 방법은 [경고 페이지](https://react.dev/warnings/react-dom-test-utils)를 참고하세요.

<Note>

Codemod를 사용해 `ReactDOMTestUtils.act`를 `React.act`로 바꾸려면 다음 명령어를 입력하세요.

```bash
npx codemod@latest react/19/replace-act-import
```

</Note>

#### 제거됨: `ReactDOM.render` {/*removed-reactdom-render*/}

`ReactDOM.render`는 [2022년 3월 (v18.0.0)](/blog/2022/03/08/react-18-upgrade-guide)부터 더 이상 권장되지 않습니다. React 19에서는 `ReactDOM.render`가 제거되며 [`ReactDOM.createRoot`](/reference/react-dom/client/createRoot)를 사용해야 합니다.

```js
// 변경 전
import {render} from 'react-dom';
render(<App />, document.getElementById('root'));

// 변경 후
import {createRoot} from 'react-dom/client';
const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

<Note>

Codemod를 사용해 `ReactDOM.render`를 `ReactDOMClient.createRoot`로 바꾸려면 다음 명령어를 입력하세요.

```bash
npx codemod@latest react/19/replace-reactdom-render
```

</Note>

#### 제거됨: `ReactDOM.hydrate` {/*removed-reactdom-hydrate*/}

`ReactDOM.hydrate`는 [2022년 3월 (v18.0.0)](/blog/2022/03/08/react-18-upgrade-guide)부터 더 이상 권장되지 않습니다. React 19에서는 `ReactDOM.hydrate`가 제거되며 [`ReactDOM.hydrateRoot`](/reference/react-dom/client/hydrateRoot)로 마이그레이션 해야 합니다.

```js
// 변경 전
import {hydrate} from 'react-dom';
hydrate(<App />, document.getElementById('root'));

// 변경 후
import {hydrateRoot} from 'react-dom/client';
hydrateRoot(document.getElementById('root'), <App />);
```

<Note>

Codemod를 사용해 `ReactDOM.hydrate`를 `ReactDOMClient.hydrateRoot`로 바꾸려면 다음 명령어를 입력하세요.

```bash
npx codemod@latest react/19/replace-reactdom-render
```

</Note>

#### 제거됨: `unmountComponentAtNode` {/*removed-unmountcomponentatnode*/}

`ReactDOM.unmountComponentAtNode`는 [2022년 3월 (v18.0.0)](https://react.dev/blog/2022/03/08/react-18-upgrade-guide)부터 더 이상 권장되지 않습니다. React 19부터는 `root.unmount()`를 사용해야 합니다.


```js
// 변경 전
unmountComponentAtNode(document.getElementById('root'));

// 변경 후
root.unmount();
```

자세한 내용은 [`createRoot`](https://react.dev/reference/react-dom/client/createRoot#root-unmount) 및 [`hydrateRoot`](https://react.dev/reference/react-dom/client/hydrateRoot#root-unmount)의 `root.unmount()`문서를 참고하세요.

<Note>

Codemod를 사용해 `unmountComponentAtNode`를 `root.unmount`로 바꾸려면 다음 명령어를 입력하세요.

```bash
npx codemod@latest react/19/replace-reactdom-render
```

</Note>

#### 제거됨: `ReactDOM.findDOMNode` {/*removed-reactdom-finddomnode*/}

`ReactDOM.findDOMNode`는 [2018년 10월 (v16.6.0)](https://legacy.reactjs.org/blog/2018/10/23/react-v-16-6.html#deprecations-in-strictmode)부터 더 이상 권장되지 않습니다.

`findDOMNode`는 레거시 코드의 해결책이었지만 실행 속도가 느리고 리팩토링에 취약하며 첫 번째 자식만 반환하는 등 많은 문제가 있어 제거됩니다 ([이곳](https://legacy.reactjs.org/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)에서 더 알아보기). `ReactDOM.findDOMNode` 대신 [DOM refs](/learn/manipulating-the-dom-with-refs)로 대체하여 사용할 수 있습니다.

```js
// 변경 전
import {findDOMNode} from 'react-dom';

function AutoselectingInput() {
  useEffect(() => {
    const input = findDOMNode(this);
    input.select()
  }, []);

  return <input defaultValue="Hello" />;
}
```

```js
// 변경 후
function AutoselectingInput() {
  const ref = useRef(null);
  useEffect(() => {
    ref.current.select();
  }, []);

  return <input ref={ref} defaultValue="Hello" />
}
```

## 사용 중단된 사항 {/*new-deprecations*/}

### 중단됨: `element.ref` {/*deprecated-element-ref*/}

React 19에서는 [`ref`를 일반 prop으로 사용하는 기능](/blog/2024/04/25/react-19#ref-as-a-prop)을 도입하여 기존의 `element.ref` 접근 방식은 사용 중단되고 대신 `element.props.ref`를 사용해야 합니다.

`element.ref`에 접근하면 아래와 같은 경고가 표시됩니다.

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Accessing element.ref is no longer supported. ref is now a regular prop. It will be removed from the JSX Element type in a future release.

</ConsoleLogLine>

</ConsoleBlockMulti>

### 중단됨: `react-test-renderer` {/*deprecated-react-test-renderer*/}

`react-test-renderer`는 실제 사용 환경과 일치하지 않는 자체 렌더러 환경을 구현하고, 구현 세부 사항에 의존하는 테스트를 조장하며, React 내부 동작을 탐색하는 방식에 의존하기 때문에 사용 중단됩니다.

이 테스트 렌더러는 [React Testing Library](https://testing-library.com)와 같은 더 나은 테스트 전략이 나오기 이전에 만들어졌으며, 이제는 더 현대적이고 지원 잘 되는 테스트 도구인 [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) 또는 [@testing-library/react-native](https://testing-library.com/docs/react-native-testing-library/intro)를 사용하는 것을 권장합니다.

React 19부터는 `react-test-renderer`를 사용할 경우 사용 중단 경고가 로그로 출력되며 동시성 렌더링<sup>Concurrent Rendering</sup>을 사용하도록 변경되었습니다. 향후를 대비해 테스트를 React Testing Library 기반으로 이전하는 것을 추천합니다.

## 주목할 만한 변경 사항 {/*notable-changes*/}

### StrictMode 관련 변경 사항 {/*strict-mode-improvements*/}

React 19에는 Strict Mode 관련해 여러 수정 및 개선 사항이 포함되어 있습니다.

개발 환경에서 Strict Mode가 이중 렌더링<sup>Double Rendering</sup>할 때, `useMemo`와 `useCallback`은 첫 번째 렌더링의 저장된 결과<sup>Memoized Results</sup>를 재사용합니다. 이미 Strict Mode와 호환되는 컴포넌트라면 동작상의 차이를 거의 느끼지 못할 것입니다.

모든 Strict Mode 동작과 마찬가지로 이러한 기능은 개발 단계에서 컴포넌트의 잠재적 버그를 조기에 드러내고, 실제 배포 전에 수정할 수 있도록 돕기 위해 설계되었습니다. 예를 들어 개발 중에는 컴포넌트가 Suspense fallback으로 교체되는 상황을 시뮬레이션하기 위해 ref 콜백 함수가 초기 마운트 시 두 번 호출됩니다.

### Suspense 관련 개선 사항 {/*improvements-to-suspense*/}

React 19에서는 컴포넌트가 일시 중단<sup>Suspend</sup> 될 때 React는 전체 형제 컴포넌트<sup>Entire Sibling Tree</sup>를 렌더링할 때까지 기다리지 않고 가장 가까운 Suspense 경계의 Fallback을 즉시 반영<sup>Commit</sup>합니다. Fallback이 반영된 후 React는 일시 중단된 형제 컴포넌트를 다시 렌더링 예약하여 트리의 나머지 부분에서 발생할 수 있는 lazy 요청을 사전 준비<sup>pre-warm</sup>하게 합니다.

<Diagram name="prerender" height={162} width={1270} alt="Diagram showing a tree of three components, one parent labeled Accordion and two children labeled Panel. Both Panel components contain isActive with value false.">

이전에는 컴포넌트가 일시 중단되면 형제 컴포넌트를 먼저 렌더링한 후 fallback이 반영되었습니다.

</Diagram>

<Diagram name="prewarm" height={162} width={1270} alt="The same diagram as the previous, with the isActive of the first child Panel component highlighted indicating a click with the isActive value set to true. The second Panel component still contains value false." >

React 19에서는 컴포넌트가 일시 중단되면 fallback을 먼저 반영한 후 형제 컴포넌트들을 렌더링합니다.

</Diagram>

이 변경으로 인해 Suspense fallback은 더 빠르게 표시되며 동시에 lazy 요청에 대한 성능 최적화 효과도 유지됩니다.

### UMD 빌드 제거됨 {/*umd-builds-removed*/}

과거에는 빌드 과정 없이도 React를 불러올 수 있는 편리한 방법으로 UMD가 널리 사용되었습니다. 하지만 이제는 HTML 문서에서 스크립트로 모듈을 불러올 수 있는 더 현대적인 대안이 존재합니다. React 19부터는 테스트 및 릴리스 과정의 복잡성을 줄이기 위해 UMD 빌드를 더 이상 제공하지 않습니다.

React 19를 script 태그로 불러오려면 [esm.sh](https://esm.sh/)와 같은 ESM 기반 CDN을 사용할 것을 권장합니다.

```html
<script type="module">
  import React from "https://esm.sh/react@19/?dev"
  import ReactDOMClient from "https://esm.sh/react-dom@19/client?dev"
  ...
</script>
```

### React 내부에 의존하는 라이브러리가 업그레이드를 막을 수도 있음 {/*libraries-depending-on-react-internals-may-block-upgrades*/}

이번 릴리스에서는 React 내부 구현에 대한 변경이 포함되어 있으며 `SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED` 같은 내부 API를 사용하지 말라는 권고를 무시한 라이브러리에 영향을 줄 수 있습니다. 이러한 변경은 React 19의 개선 사항을 적용하기 데 필요하며 가이드라인을 따르는 라이브러리에는 문제가 발생하지 않습니다.

[버전 관리 정책](https://react.dev/community/versioning-policy#what-counts-as-a-breaking-change)에 따라 이러한 업데이트는 중요 변경 사항으로 간주하지 않으며 어떻게 업그레이드해야 하는지에 대한 문서도 제공되지 않습니다. 권장 사항은 내부 구현에 의존하는 코드를 모두 제거하는 것입니다.

내부 구현 사용의 영향을 명확히 보여주기 위해 `SECRET_INTERNALS` 접미사<sup>Suffix</sup>를 다음과 같이 변경했습니다.

`_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE`

앞으로는 React의 내부 구현에 접근하는 것을 더 강력하게 차단할 예정이며 이는 내부 API 사용을 억제하고 사용자가 React 업그레이드 과정에서 막히지 않도록 하기 위함입니다.

## TypeScript 관련 변경 사항 {/*typescript-changes*/}

### 제거된 TypeScript 타입 {/*removed-deprecated-typescript-types*/}

React 19에서 제거된 API에 따라 관련 TypeScript 타입이 정리되었습니다. 일부 제거된 타입은 더 적절한 패키지로 이동되었고 다른 일부는 이제 React의 동작을 설명하는 데 더 이상 필요하지 않기 때문에 제거되었습니다.

<Note>
대부분의 타입 관련 중요 변경 사항을 자동으로 마이그레이션하기 위한 [`types-react-codemod`](https://github.com/eps1lon/types-react-codemod/)를 공개했습니다.

```bash
npx types-react-codemod@latest preset-19 ./path-to-app
```

`element.props`에 대해 안전하지 않은 접근<sup>Unsound Access</sup>이 많은 경우 아래 codemod를 추가로 실행할 수 있습니다.

```bash
npx types-react-codemod@latest react-element-default-any-props ./path-to-your-react-ts-files
```

</Note>

[`types-react-codemod`](https://github.com/eps1lon/types-react-codemod/) 문서를 확인하면 지원되는 교체 목록을 볼 수 있습니다. 만약 빠진 codemod가 있다면 [React 19 누락 codemod 목록](https://github.com/eps1lon/types-react-codemod/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc+label%3A%22React+19%22+label%3Aenhancement)에서 확인할 수 있습니다.


### `ref` 정리<sup>Cleanup</sup> 필요 {/*ref-cleanup-required*/}

_이 변경 사항은`react-19` codemod 프리셋에 포함된 [`no-implicit-ref-callback-return
`](https://github.com/eps1lon/types-react-codemod/#no-implicit-ref-callback-return)항목에 해당합니다._

ref 정리 함수<sup>Cleanup Funtions</sup>가 도입됨에 따라 이제 ref 콜백에서 다른 값을 반환하는 경우 TypeScript에서 거부됩니다. 일반적인 해결 방법은 암시적 반환<sup>Implicit Return</sup>을 사용하지 않는 것입니다.

```diff [[1, 1, "("], [1, 1, ")"], [2, 2, "{", 15], [2, 2, "}", 1]]
- <div ref={current => (instance = current)} />
+ <div ref={current => {instance = current}} />
```

예전에는 `HTMLDivElement` 인스턴스를 반환하는 코드가 있었는데 TypeScript는 그것이 정리 함수인지 단순 반환 값인지 구분할 수 없었습니다.

### `useRef`는 인자가 필요함 {/*useref-requires-argument*/}

_이 변경 사항은 `react-19` codemod 프리셋에 포함된 [`refobject-defaults`](https://github.com/eps1lon/types-react-codemod/#refobject-defaults) 항목에 해당합니다._

오랫동안 제기되어 온 TypeScript와 React의 불편한 점 중 하나가 `useRef`였습니다. React 19에서는 타입 정의가 변경되어, 이제 `useRef`는 반드시 인자를 받아야 합니다. 이에 따라 타입 시그니처가 훨씬 단순해졌으며, 이제는 `createContext`와 더 유사하게 동작합니다.

```ts
// @ts-expect-error: Expected 1 argument but saw none
useRef();
// Passes
useRef(undefined);
// @ts-expect-error: Expected 1 argument but saw none
createContext();
// Passes
createContext(undefined);
```

이제 모든 ref는 변경 가능<sup>Mutable</sup>합니다. 즉, `null`로 초기화했기 때문에 `ref.current`를 변경할 수 없었던 기존 문제를 더 이상 겪지 않아도 됩니다.

```ts
const ref = useRef<number>(null);

// 읽기 전용이라 'current'에 할당 불가
ref.current = 1;
```

`MutableRef`는 이제 사용 중단되었으며 `useRef`는 항상 단일 `RefObject` 타입을 반환합니다.

```ts
interface RefObject<T> {
  current: T
}

declare function useRef<T>: RefObject<T>
```

`useRef`는 여전히 `useRef<T>(null)`을 사용할 때 자동으로 `RefObject<T | null>`을 반환하는 오버로드를 편의상 제공합니다. `useRef`에 인자가 필요하도록 변경됨에 따라 마이그레이션을 쉽게 하려고 `useRef(undefined)`를 사용할 경우 자동으로 `RefObject<T | undefined>`를 반환하는 오버로드가 편의상 추가되었습니다.

이 변경에 대한 이전 논의는 [[RFC] 모든 ref를 변경할 수 있게 만들기](https://github.com/DefinitelyTyped/DefinitelyTyped/pull/64772)에서 확인하실 수 있습니다.

### `ReactElement` TypeScript 타입의 변경 사항 {/*changes-to-the-reactelement-typescript-type*/}

_이 변경사항은 [`react-element-default-any-props`](https://github.com/eps1lon/types-react-codemod#react-element-default-any-props) codemod에 포함되어 있습니다._

`ReactElement`로 타입이 지정된 요소의 `props` 기본 타입이 `any`에서 `unknown`으로 변경되었습니다. 단, `ReactElement`에 타입 인자를 명시적으로 제공할 때 영향을 받지 않습니다.

```ts
type Example2 = ReactElement<{ id: string }>["props"];
//   ^? { id: string }
```

하지만 이전에 기본값을 사용하였으면 `unknown`을 처리해야 합니다.

```ts
type Example = ReactElement["props"];
//   ^? Before, was 'any', now 'unknown'
```

이 변경은 주로 `element.props`에 대한 불안정한 접근을 많이 사용한 레거시 코드에 영향을 줍니다. 요소 내부 속성 접근<sup>Element Introspection</sup>은 예외적인 경우에만 사용되어야 하며, `any`를 명시적으로 사용해 타입 안정성이 없음을 드러내는 것이 좋습니다.

### TypeScript의 JSX 네임스페이스 변경 {/*the-jsx-namespace-in-typescript*/}
이 변경은 `react-19` codemod preset의 [`scoped-jsx`](https://github.com/eps1lon/types-react-codemod#scoped-jsx)항목에 포함되어 있습니다.

오랫동안 요청된 기능 중 하나는 전역 `JSX` 네임스페이스를 제거하고 `React.JSX`로 대체하는 것이었습니다. 이 변경은 JSX를 사용하는 다양한 UI 라이브러리 간의 타입 충돌을 방지하기 위해 글로벌 타입 오염을 줄이는 데 도움이 됩니다.

이제 JSX 네임스페이스 확장은 다음처럼 `declare module "...."을 통해 감싸야 합니다.

```diff
// global.d.ts
+ declare module "react" {
    namespace JSX {
      interface IntrinsicElements {
        "my-element": {
          myElementProps: string;
        };
      }
    }
+ }
```

`tsconfig.json`의 `compilerOptions`에서 지정한 JSX 런타임 설정에 따라 정확한 모듈 명세자는 다음과 같이 달라집니다.

- `"jsx": "react-jsx"` 인 경우 `react/jsx-runtime`.
- `"jsx": "react-jsxdev"` 인 경우 `react/jsx-dev-runtime`.
- `"jsx": "react"` 또는 `"jsx": "preserve"` 인 경우 `react`.

### `useReducer` 타입 추론 개선 {/*better-usereducer-typings*/}

[@mfp22](https://github.com/mfp22) 덕분에 이제 `useReducer`의 타입 추론이 개선되었습니다.

하지만 이에 따라 호환성 깨짐이 발생했는데, 이제 `useReducer`는 전체 reducer 타입을 타입 인자로 받지 않고 아예 타입 인자를 생략하거나 state와 action 타입을 둘 다 지정해야 합니다.

새로운 권장 방식은 타입 인자를 `useReducer`에 넘기지 _않는_ 것입니다.
```diff
- useReducer<React.Reducer<State, Action>>(reducer)
+ useReducer(reducer)
```

하지만 특수한 경우에는 `Action`을 튜플로 전달하여 state와 action을 명시적으로 지정해야 할 수도 있습니다.
```diff
- useReducer<React.Reducer<State, Action>>(reducer)
+ useReducer<State, [Action]>(reducer)
```

reducer를 인라인으로 정의한다면 함수 매개변수에 타입을 지정하는 방식을 권장합니다.
```diff
- useReducer<React.Reducer<State, Action>>((state, action) => state)
+ useReducer((state: State, action: Action) => state)
```

이는 `useReducer` 호출문 밖으로 reducer를 분리할 때도 동일하게 적용됩니다.
```ts
const reducer = (state: State, action: Action) => state;
```

## 변경 로그 {/*changelog*/}

### 기타 주요한 변경 사항 {/*other-breaking-changes*/}

- **react-dom**: `src` 및 `href` 속성에 JavaScript URL 사용 시 발생하던 오류 [#26507](https://github.com/facebook/react/pull/26507)
- **react-dom**: `onRecoverableError`에서 `errorInfo.digest` 제거 [#28222](https://github.com/facebook/react/pull/28222)
- **react-dom**: `unstable_flushControlled` 제거 [#26397](https://github.com/facebook/react/pull/26397)
- **react-dom**: `unstable_createEventHandle` 제거 [#28271](https://github.com/facebook/react/pull/28271)
- **react-dom**: `unstable_renderSubtreeIntoContainer` 제거 [#28271](https://github.com/facebook/react/pull/28271)
- **react-dom**: `unstable_runWithPriority` 제거 [#28271](https://github.com/facebook/react/pull/28271)
- **react-is**: `react-is`에서 사용 중단된 메서드 제거 [28224](https://github.com/facebook/react/pull/28224)

### 기타 주목할 만한 변경 사항 {/*other-notable-changes*/}

- **react**: 동기, 기본, 지속적 lane 처리 배치 적용 [#25700](https://github.com/facebook/react/pull/25700)
- **react**: 중단된 컴포넌트의 형제 요소 선렌더링 방지 [#26380](https://github.com/facebook/react/pull/26380)
- **react**: 렌더 단계에서의 업데이트로 인해 발생하는 무한 루프 감지 [#26625](https://github.com/facebook/react/pull/26625)
- **react-dom**: popstate에서의 전환을 이제 동기적으로 처리 [#26025](https://github.com/facebook/react/pull/26025)
- **react-dom**: SSR 중 layout effect 경고 제거 [#26395](https://github.com/facebook/react/pull/26395)
- **react-dom**: src나 href에 빈 문자열 설정 시 경고 및 무시 (단, a 태그 제외) [#28124](https://github.com/facebook/react/pull/28124)

전체 변경 사항은 [변경 로그 전체 보기](https://github.com/facebook/react/blob/main/CHANGELOG.md#1900-december-5-2024)를 참고하세요.

---

이 글을 작성하는 데에 도움을 준 모든 분들께 감사드립니다. [Andrew Clark](https://twitter.com/acdlite), [Eli White](https://twitter.com/Eli_White), [Jack Pope](https://github.com/jackpope), [Jan Kassens](https://github.com/kassens), [Josh Story](https://twitter.com/joshcstory), [Matt Carroll](https://twitter.com/mattcarrollcode), [Noah Lemen](https://twitter.com/noahlemen), [Sophie Alpert](https://twitter.com/sophiebits), [Sebastian Silbermann](https://twitter.com/sebsilbermann)
