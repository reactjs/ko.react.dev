---
id: introducing-jsx
title: JSX 소개
permalink: docs/introducing-jsx.html
prev: hello-world.html
next: rendering-elements.html
---

아래 변수 선언을 살펴봅시다.

```js
const element = <h1>Hello, world!</h1>;
```

위에 희한한 태그 문법은 문자열도, HTML도 아닙니다.

JSX라 하며 JavaScript를 확장한 문법입니다. UI가 어떻게 생겨야 하는지 설명하기 위해 React와 함께 사용할 것을 권장합니다. JSX라고 하면 템플릿 언어가 떠오를 수도 있지만, JavaScript의 모든 기능이 포함되어 있습니다.

JSX는 React "엘리먼트(element)" 를 생성합니다. [다음 섹션](/docs/rendering-elements.html)에서는 DOM에 어떻게 렌더링하는지 알아보겠습니다. 아래를 보면 JSX를 시작하기 위해 필요한 기본사항을 찾으실 수 있습니다.

### JSX란? {#why-jsx}

React에서는 이벤트가 처리되는 방식, 시간에 따라 state가 변하는 방식, 화면에 표시하기 위해 데이터가 준비되는 방식 등 렌더링 로직이 본질적으로 다른 UI 로직과 연결된다는 사실을 받아들입니다.

React는 별도의 파일에 마크업과 로직을 넣어 *기술*을 인위적으로 분리하는 대신, 둘 다 포함하는 “컴포넌트”라고 부르는 느슨하게 연결된 유닛으로 [*관심사*를 분리](https://en.wikipedia.org/wiki/Separation_of_concerns)합니다. 이후 섹션에서 다시 컴포넌트로 돌아오겠지만, JS에 마크업을 넣는 게 익숙해지지 않는다면 [이 이야기](https://www.youtube.com/watch?v=x7cQ3mrcKaY)가 확신을 줄 것입니다.

React는 JSX [사용이 필수가 아니지만](/docs/react-without-jsx.html), 대부분의 사람은 JavaScript 코드 안에서 UI 관련 작업을 할 때 시각적으로 더 도움이 된다고 생각합니다. 또한 React가 더욱 도움이 되는 에러 및 경고 메시지를 표시할 수 있게 해줍니다.

일단 한번 시작해보겠습니다!

### JSX에 표현식 포함하기 {#embedding-expressions-in-jsx}

아래 예시에서는 `name`이라는 변수를 선언한 후 중괄호로 감싸 JSX 안에 사용하였습니다.

```js{1,2}
const name = 'Josh Perez';
const element = <h1>Hello, {name}</h1>;

ReactDOM.render(
  element,
  document.getElementById('root')
);
```

JSX의 중괄호 안에는 유효한 모든 [JavaScript 표현식](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Expressions_and_Operators#표현(식))을 넣을 수 있습니다. 예를 들어 `2 + 2`, `user.firstName` 또는 `formatName(user)` 등은 모두 유효한 JavaScript 표현식입니다.

아래 예시에서는 JavaScript 함수 호출의 결과인 `formatName(user)`을 `<h1>` 엘리먼트에 포함했습니다.

```js{12}
function formatName(user) {
  return user.firstName + ' ' + user.lastName;
}

const user = {
  firstName: 'Harper',
  lastName: 'Perez'
};

const element = (
  <h1>
    Hello, {formatName(user)}!
  </h1>
);

ReactDOM.render(
  element,
  document.getElementById('root')
);
```

[CodePen에서 실행하기](codepen://introducing-jsx)

가독성을 좋게 하기 위해 JSX를 여러 줄로 나눴습니다. 필수는 아니지만, 이 작업을 수행할 때 [자동 세미콜론 삽입](https://stackoverflow.com/q/2846283)을 피하고자 괄호로 묶는 것을 권장합니다.

### JSX도 표현식입니다 {#jsx-is-an-expression-too}

컴파일이 끝나면, JSX 표현식이 정규 JavaScript 함수 호출이 되고 JavaScript 객체로 인식됩니다.

즉, JSX를 `if` 구문 및 `for` loop 안에 사용하고, 변수에 할당하고, 인자로서 받아들이고, 함수로부터 반환할 수 있습니다.

```js{3,5}
function getGreeting(user) {
  if (user) {
    return <h1>Hello, {formatName(user)}!</h1>;
  }
  return <h1>Hello, Stranger.</h1>;
}
```

### JSX 속성 정의 {#specifying-attributes-with-jsx}

속성에 따옴표를 이용해 문자열 리터럴을 정의할 수 있습니다.

```js
const element = <div tabIndex="0"></div>;
```

중괄호를 사용하여 어트리뷰트에 JavaScript 표현식을 삽입할 수도 있습니다.

```js
const element = <img src={user.avatarUrl}></img>;
```

어트리뷰트에 JavaScript 표현식을 삽입할 때 중괄호 주변에 따옴표를 입력하지 마세요. 따옴표(문자열 값에 사용) 또는 중괄호(표현식에 사용) 중 하나만 사용하고, 동일한 어트리뷰트에 두 가지를 동시에 사용하면 안 됩니다.

>**경고**
>
>JSX는 HTML보다는 JavaScript에 가깝기 때문에, React DOM은 HTML 어트리뷰트 이름 대신 `camelCase` 프로퍼티 명명 규칙을 사용합니다.
>
>예를 들어, JSX에서 `class`는 [`className`](https://developer.mozilla.org/ko/docs/Web/API/Element/className)가 되고 tabindex는 [`tabIndex`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/tabIndex)가 됩니다.

### JSX로 자식 정의 {#specifying-children-with-jsx}

태그가 비어있다면 XML처럼 `/>` 를 이용해 바로 닫아주어야 합니다.

```js
const element = <img src={user.avatarUrl} />;
```

JSX 태그는 자식을 포함할 수 있습니다.

```js
const element = (
  <div>
    <h1>Hello!</h1>
    <h2>Good to see you here.</h2>
  </div>
);
```

### JSX는 주입 공격을 방지합니다 {#jsx-prevents-injection-attacks}

JSX에 사용자 입력을 삽입하는 것은 안전합니다.

```js
const title = response.potentiallyMaliciousInput;
// 이것은 안전합니다.
const element = <h1>{title}</h1>;
```

기본적으로 React DOM은 JSX에 삽입된 모든 값을 렌더링하기 전에 [이스케이프](https://stackoverflow.com/questions/7381974/which-characters-need-to-be-escaped-on-html) 하므로, 애플리케이션에서 명시적으로 작성되지 않은 내용은 주입되지 않습니다. 모든 항목은 렌더링 되기 전에 문자열로 변환됩니다. 이런 특성으로 인해 [XSS (cross-site-scripting)](https://ko.wikipedia.org/wiki/사이트_간_스크립팅) 공격을 방지할 수 있습니다.

### JSX는 객체를 표현합니다. {#jsx-represents-objects}

Babel은 JSX를 `React.createElement()` 호출로 컴파일합니다.

다음 두 예시는 동일합니다.

```js
const element = (
  <h1 className="greeting">
    Hello, world!
  </h1>
);
```

```js
const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'Hello, world!'
);
```

`React.createElement()`는 버그가 없는 코드를 작성하는 데 도움이 되도록 몇 가지 검사를 수행하며, 기본적으로 다음과 같은 객체를 생성합니다.

```js
// 주의: 다음 구조는 단순화되었습니다
const element = {
  type: 'h1',
  props: {
    className: 'greeting',
    children: 'Hello, world!'
  }
};
```

이러한 객체를 "React 엘리먼트"라고 하며, 이를 화면에 표시하려는 항목에 대한 설명이라고 생각할 수 있습니다. React는 이러한 객체를 읽은 후 DOM을 구성하고 최신으로 유지하는 데 이러한 객체를 사용합니다.

다음 섹션에서는 DOM에 React 엘리먼트를 렌더링하는 방법에 대해 살펴보겠습니다.

>**팁**
>
> ES6 및 JSX 코드가 올바르게 표시되도록 편집기에 ["Babel" 언어 설정](https://babeljs.io/docs/editors)을 사용하는 것을 권장합니다. 현재 웹 사이트에서는 호환이 가능한 [Oceanic Next](https://labs.voronianski.com/oceanic-next-color-scheme/) 컬러 스키마를 사용하고 있습니다.
