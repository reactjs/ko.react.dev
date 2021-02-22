---
id: context
title: Context
permalink: docs/context.html
---

context를 이용하면 단계마다 일일이 props를 넘겨주지 않고도 컴포넌트 트리 전체에 데이터를 제공할 수 있습니다.

<<<<<<< HEAD
일반적인 React 애플리케이션에서 데이터는 위에서 아래로 (즉, 부모로부터 자식에게) props를 통해 전달되지만, 애플리케이션 안의 여러 컴포넌트들에 전해줘야 하는 props의 경우 (예를 들면 선호 로케일, UI 테마) 이 과정이 번거로울 수 있습니다. context를 이용하면, 트리 단계마다 명시적으로 props를 넘겨주지 않아도 많은 컴포넌트가 이러한 값을 공유하도록 할 수 있습니다.
=======
In a typical React application, data is passed top-down (parent to child) via props, but such usage can be cumbersome for certain types of props (e.g. locale preference, UI theme) that are required by many components within an application. Context provides a way to share values like these between components without having to explicitly pass a prop through every level of the tree.
>>>>>>> adfa67ad01b7e4c6114921cdf12e9e4cf1a1c786

- [언제 context를 써야 할까](#when-to-use-context)
- [context를 사용하기 전에 고려할 것](#before-you-use-context)
- [API](#api)
  - [React.createContext](#reactcreatecontext)
  - [Context.Provider](#contextprovider)
  - [Class.contextType](#classcontexttype)
  - [Context.Consumer](#contextconsumer)
  - [Context.displayName](#contextdisplayname)
- [예시](#examples)
  - [값이 변하는 context](#dynamic-context)
  - [하위 컴포넌트에서 context 업데이트하기](#updating-context-from-a-nested-component)
  - [여러 context 구독하기](#consuming-multiple-contexts)
- [주의사항](#caveats)
- [예전 API](#legacy-api)

## 언제 context를 써야 할까 {#when-to-use-context}

context는 React 컴포넌트 트리 안에서 전역적(global)이라고 볼 수 있는 데이터를 공유할 수 있도록 고안된 방법입니다. 그러한 데이터로는 현재 로그인한 유저, 테마, 선호하는 언어 등이 있습니다. 예를 들어, 아래의 코드는 버튼 컴포넌트를 꾸미기 위해 테마(theme) props를 명시적으로 넘겨주고 있습니다.

`embed:context/motivation-problem.js`

context를 사용하면 중간에 있는 엘리먼트들에게 props를 넘겨주지 않아도 됩니다.

`embed:context/motivation-solution.js`

## context를 사용하기 전에 고려할 것 {#before-you-use-context}

context의 주된 용도는 다양한 레벨에 네스팅된 *많은* 컴포넌트에게 데이터를 전달하는 것입니다. context를 사용하면 컴포넌트를 재사용하기가 어려워지므로 꼭 필요할 때만 쓰세요.

**여러 레벨에 걸쳐 props 넘기는 걸 대체하는 데에 context보다 [컴포넌트 합성](/docs/composition-vs-inheritance.html)이 더 간단한 해결책일 수도 있습니다.**

예를 들어 여러 단계 아래에 있는 `Link` 와 `Avatar` 컴포넌트에게 `user` 와 `avatarSize` 라는 props를 전달해야 하는 `Page` 컴포넌트를 생각해봅시다.

```js
<Page user={user} avatarSize={avatarSize} />
// ... 그 아래에 ...
<PageLayout user={user} avatarSize={avatarSize} />
// ... 그 아래에 ...
<NavigationBar user={user} avatarSize={avatarSize} />
// ... 그 아래에 ...
<Link href={user.permalink}>
  <Avatar user={user} size={avatarSize} />
</Link>
```

실제로 사용되는 곳은 `Avatar` 컴포넌트 뿐인데 `user`와 `avatarSize` props를 여러 단계에 걸쳐 보내줘야 한다는 게 번거로워 보일 수 있습니다. 게다가 위에서 `Avatar` 컴포넌트로 보내줘야하는 props가 추가된다면 그 또한 중간 레벨에 모두 추가해줘야 합니다.

[`Avatar` 컴포넌트 자체를 넘겨주면](/docs/composition-vs-inheritance.html#containment) **context를 사용하지 않고** 이를 해결할 수 있습니다. 그러면 중간에 있는 컴포넌트들이 `user`나 `avatarSize` 에 대해 전혀 알 필요가 없습니다.

```js
function Page(props) {
  const user = props.user;
  const userLink = (
    <Link href={user.permalink}>
      <Avatar user={user} size={props.avatarSize} />
    </Link>
  );
  return <PageLayout userLink={userLink} />;
}

// 이제 이렇게 쓸 수 있습니다.
<Page user={user} avatarSize={avatarSize} />
// ... 그 아래에 ...
<PageLayout userLink={...} />
// ... 그 아래에 ...
<NavigationBar userLink={...} />
// ... 그 아래에 ...
{props.userLink}
```

이렇게 바꾸면 `Link`와 `Avatar` 컴포넌트가 `user` 와 `avatarSize` props를 쓴다는 걸 알아야 하는 건 가장 위에 있는 `Page` 뿐입니다.

<<<<<<< HEAD
이러한 *제어의 역전(inversion of control)* 을 이용하면 넘겨줘야 하는 props의 수는 줄고 최상위 컴포넌트의 제어력은 더 커지기 때문에 더 깔끔한 코드를 쓸 수 있는 경우가 많습니다. 하지만 이 방법이 항상 옳은 것은 아닙니다. 복잡한 로직을 상위로 옮기면 이 상위 컴포넌트들은 더 난해해지기 마련이고 하위 컴포넌트들은 필요 이상으로 유연해져야 합니다.
=======
This *inversion of control* can make your code cleaner in many cases by reducing the amount of props you need to pass through your application and giving more control to the root components. Such inversion, however, isn't the right choice in every case; moving more complexity higher in the tree makes those higher-level components more complicated and forces the lower-level components to be more flexible than you may want.
>>>>>>> adfa67ad01b7e4c6114921cdf12e9e4cf1a1c786

자식으로 둘 수 있는 컴포넌트의 수에 제한은 없습니다. 여러 컴포넌트, 혹은 여러 개로 구분된 "슬롯"을 넘기는 방법에 대해서는 [여기](/docs/composition-vs-inheritance.html#containment)를 참조하세요.

```js
function Page(props) {
  const user = props.user;
  const content = <Feed user={user} />;
  const topBar = (
    <NavigationBar>
      <Link href={user.permalink}>
        <Avatar user={user} size={props.avatarSize} />
      </Link>
    </NavigationBar>
  );
  return (
    <PageLayout
      topBar={topBar}
      content={content}
    />
  );
}
```

이 패턴을 사용하면 자식 컴포넌트와 직속 부모를 분리(decouple)하는 문제는 대개 해결할 수 있습니다. 더 나아가 [render props](/docs/render-props.html)를 이용하면 렌더링 되기 전부터 자식 컴포넌트가 부모 컴포넌트와 소통하게 할 수 있습니다.

하지만 같은 데이터를 트리 안 여러 레벨이 있는 많은 컴포넌트에 주어야 할 때도 있습니다. 이런 데이터 값이 변할 때마다 모든 하위 컴포넌트에게 널리 "방송"하는 것이 context입니다. 흔히 예시로 드는 선호 로케일, 테마, 데이터 캐시 등을 관리하는 데 있어서는 일반적으로 context를 사용하는 게 가장 편리합니다.

## API {#api}

### `React.createContext` {#reactcreatecontext}

```js
const MyContext = React.createContext(defaultValue);
```

Context 객체를 만듭니다. Context 객체를 구독하고 있는 컴포넌트를 렌더링할 때 React는 트리 상위에서 가장 가까이 있는 짝이 맞는 `Provider`로부터 현재값을 읽습니다.

<<<<<<< HEAD
`defaultValue` 매개변수는 트리 안에서 적절한 Provider를 **찾지 못했을 때만** 쓰이는 값입니다. 컴포넌트를 독립적으로 테스트할 때 유용한 값입니다. Provider를 통해 `undefined`을 값으로 보낸다고 해도 구독 컴포넌트들이 `defaultValue` 를 읽지는 않는다는 점에 유의하세요.
=======
The `defaultValue` argument is **only** used when a component does not have a matching Provider above it in the tree. This default value can be helpful for testing components in isolation without wrapping them. Note: passing `undefined` as a Provider value does not cause consuming components to use `defaultValue`.
>>>>>>> adfa67ad01b7e4c6114921cdf12e9e4cf1a1c786

### `Context.Provider` {#contextprovider}

```js
<MyContext.Provider value={/* 어떤 값 */}>
```

Context 오브젝트에 포함된 React 컴포넌트인 Provider는 context를 구독하는 컴포넌트들에게 context의 변화를 알리는 역할을 합니다.

Provider 컴포넌트는 `value` prop을 받아서 이 값을 하위에 있는 컴포넌트에게 전달합니다. 값을 전달받을 수 있는 컴포넌트의 수에 제한은 없습니다. Provider 하위에 또 다른 Provider를 배치하는 것도 가능하며, 이 경우 하위 Provider의 값이 우선시됩니다.

Provider 하위에서 context를 구독하는 모든 컴포넌트는 Provider의 `value` prop가 바뀔 때마다 다시 렌더링 됩니다. Provider로부터 하위 consumer([`.contextType`](#classcontexttype)와 [`useContext`](/docs/hooks-reference.html#usecontext)을 포함한)로의 전파는 `shouldComponentUpdate` 메서드가 적용되지 않으므로, 상위 컴포넌트가 업데이트를 건너 뛰더라도 consumer가 업데이트됩니다.

context 값의 바뀌었는지 여부는 [`Object.is`](//developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/is#설명)와 동일한 알고리즘을 사용해 이전 값과 새로운 값을 비교해 측정됩니다.

> 주의
>
> 위와 같은 방식으로 변화를 측정하기 때문에 객체를 `value`로 보내는 경우 다소 문제가 생길 수 있습니다. [주의사항](#caveats)을 참조하세요.

### `Class.contextType` {#classcontexttype}

```js
class MyClass extends React.Component {
  componentDidMount() {
    let value = this.context;
    /* MyContext의 값을 이용한 코드 */
  }
  componentDidUpdate() {
    let value = this.context;
    /* ... */
  }
  componentWillUnmount() {
    let value = this.context;
    /* ... */
  }
  render() {
    let value = this.context;
    /* ... */
  }
}
MyClass.contextType = MyContext;
```
[`React.createContext()`](#reactcreatecontext)로 생성한 Context 객체를 원하는 클래스의 `contextType` 프로퍼티로 지정할 수 있습니다. 그러면 그 클래스 안에서 `this.context`를 이용해 해당 Context의 가장 가까운 Provider를 찾아 그 값을 읽을 수 있게됩니다. 이 값은 render를 포함한 모든 컴포넌트 생명주기 매서드에서 사용할 수 있습니다.

<<<<<<< HEAD
> 주의
=======
The `contextType` property on a class can be assigned a Context object created by [`React.createContext()`](#reactcreatecontext). Using this property lets you consume the nearest current value of that Context type using `this.context`. You can reference this in any of the lifecycle methods including the render function.

> Note:
>>>>>>> adfa67ad01b7e4c6114921cdf12e9e4cf1a1c786
>
> 이 API를 사용하면 하나의 context만 구독할 수 있습니다. 여러 context를 구독하기 위해서는 [여러 context 구독하기](#consuming-multiple-contexts)를 참조하세요.
>
> 실험적 기능인 [public class fields syntax](https://babeljs.io/docs/plugins/transform-class-properties/)를 사용하고 있다면 **정적** 클래스 프로퍼티로 `contextType`을 지정할 수 있습니다.

```js
class MyClass extends React.Component {
  static contextType = MyContext;
  render() {
    let value = this.context;
    /* context 값을 이용한 렌더링 */
  }
}
```

### `Context.Consumer` {#contextconsumer}

```js
<MyContext.Consumer>
  {value => /* context 값을 이용한 렌더링 */}
</MyContext.Consumer>
```

<<<<<<< HEAD
context 변화를 구독하는 React 컴포넌트입니다. [함수 컴포넌트](/docs/components-and-props.html#function-and-class-components)안에서 context를 읽기 위해서 쓸 수 있습니다.
=======
A React component that subscribes to context changes. Using this component lets you subscribe to a context within a [function component](/docs/components-and-props.html#function-and-class-components).
>>>>>>> adfa67ad01b7e4c6114921cdf12e9e4cf1a1c786

Context.Consumer의 자식은 [함수](/docs/render-props.html#using-props-other-than-render)여야합니다. 이 함수는 context의 현재값을 받고 React 노드를 반환합니다. 이 함수가 받는 `value` 매개변수 값은 해당 context의 Provider 중 상위 트리에서 가장 가까운 Provider의 `value` prop과 동일합니다. 상위에 Provider가 없다면 `value` 매개변수 값은 `createContext()`에 보냈던 `defaultValue`와 동일할 것입니다.

> 주의
>
> 함수를 자식으로 받는 패턴에 대해서는 [render props](/docs/render-props.html)을 참조하세요.

### `Context.displayName` {#contextdisplayname}

Context 객체는 `displayName` 문자열 속성을 설정할 수 있습니다. React 개발자 도구는 이 문자열을 사용해서 context를 어떻게 보여줄 지 결정합니다.

예를 들어, 아래 컴포넌트는 개발자 도구에 MyDisplayName로 표시됩니다.

```js{2}
const MyContext = React.createContext(/* some value */);
MyContext.displayName = 'MyDisplayName';

<MyContext.Provider> // "MyDisplayName.Provider" in DevTools
<MyContext.Consumer> // "MyDisplayName.Consumer" in DevTools
```

## 예시 {#examples}

### 값이 변하는 context {#dynamic-context}

theme 값이 변하는 좀 더 복잡한 예시입니다.

**theme-context.js**
`embed:context/theme-detailed-theme-context.js`

**themed-button.js**
`embed:context/theme-detailed-themed-button.js`

**app.js**
`embed:context/theme-detailed-app.js`

### 하위 컴포넌트에서 context 업데이트하기 {#updating-context-from-a-nested-component}

컴포넌트 트리 하위 깊숙이 있는 컴포넌트에서 context를 업데이트 해야 할 때가 종종 있습니다. 그럴 때는 context를 통해 매서드를 보내면 됩니다.

**theme-context.js**
`embed:context/updating-nested-context-context.js`

**theme-toggler-button.js**
`embed:context/updating-nested-context-theme-toggler-button.js`

**app.js**
`embed:context/updating-nested-context-app.js`

### 여러 context 구독하기 {#consuming-multiple-contexts}

각 context마다 Consumer를 개별 노드로 만들게 설계되어있는데, 이것은 context 변화로 인해 다시 렌더링하는 과정을 빠르게 유지하기 위함입니다.

`embed:context/multiple-contexts.js`

둘 이상의 context 값이 함께 쓰이는 경우가 많다면 그 값들을 한 번에 받는 render prop 컴포넌트를 만드는 것을 고려해보세요.

## 주의사항 {#caveats}

다시 렌더링할지 여부를 정할 때 참조(reference)를 확인하기 때문에, Provider의 부모가 렌더링 될 때마다 불필요하게 하위 컴포넌트가 다시 렌더링 되는 문제가 생길 수도 있습니다. 예를 들어 아래 코드는 `value`가 바뀔 때마다 매번 새로운 객체가 생성되므로 Provider가 렌더링 될 때마다 그 하위에서 구독하고 있는 컴포넌트 모두가 다시 렌더링 될 것입니다.

`embed:context/reference-caveats-problem.js`


이를 피하기 위해서는 값을 부모의 state로 끌어올리세요.

`embed:context/reference-caveats-solution.js`

## 예전 API {#legacy-api}

> 주의
>
> 이전 버전의 React에 실험적인 단계의 context API가 존재한 적이 있습니다. 예전 API는 모든 16.x 버전에서 지원될 예정이지만 새로운 API로 옮길 것을 권장합니다. 다음 메이저 배포에서 예전 API는 삭제될 것입니다. 예전 API 문서는 [여기](/docs/legacy-context.html)에 있습니다.
