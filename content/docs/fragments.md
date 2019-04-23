---
id: fragments
title: Fragments
permalink: docs/fragments.html
---

React에서 컴포넌트가 여러 엘리먼트를 반환하는 것은 흔한 패턴입니다. Fragments는 DOM에 별도의 노드를 추가하지 않고 여러 자식을 그룹화할 수 있습니다.

```js
render() {
  return (
    <React.Fragment>
      <ChildA />
      <ChildB />
      <ChildC />
    </React.Fragment>
  );
}
```    

이를 선언하는 새로운 [단축 문법](#short-syntax)이 있습니다. 하지만 아직 모든 인기 있는 도구에서 전부 지원하지는 않습니다.

## 동기 {#motivation}

컴포넌트가 여러 자식을 반환하는 것은 흔한 패턴입니다. 다음 React 예시를 보세요.

```jsx
class Table extends React.Component {
  render() {
    return (
      <table>
        <tr>
          <Columns />
        </tr>
      </table>
    );
  }
}
```

렌더링 된 HTML이 유효하려면 `<Columns />`가 여러 `<td>` 엘리먼트만 반환해야 합니다. `<Columns />`의 `render()` 안에 부모 div로 자식들을 감싼다면 렌더링 된 HTML은 유효하지 않습니다.

```jsx
class Columns extends React.Component {
  render() {
    return (
      <div>
        <td>Hello</td>
        <td>World</td>
      </div>
    );
  }
}
```

`<Table />`의 출력 결과는 다음과 같습니다.

```jsx
<table>
  <tr>
    <div>
      <td>Hello</td>
      <td>World</td>
    </div>
  </tr>
</table>
```

Fragments는 이 문제를 해결해줍니다.

## 사용법 {#usage}

```jsx{4,7}
class Columns extends React.Component {
  render() {
    return (
      <React.Fragment>
        <td>Hello</td>
        <td>World</td>
      </React.Fragment>
    );
  }
}
```

올바른 `<Table />`의 출력 결과는 아래와 같습니다.

```jsx
<table>
  <tr>
    <td>Hello</td>
    <td>World</td>
  </tr>
</table>
```

### 단축 문법 {#short-syntax}

Fragments를 선언하는 더 짧고 새로운 문법이 있습니다. 마치 빈 태그와 같습니다.

```jsx{4,7}
class Columns extends React.Component {
  render() {
    return (
      <>
        <td>Hello</td>
        <td>World</td>
      </>
    );
  }
}
```

`key` 또는 어트리뷰트를 지원하지 않는다는 것을 빼고 다른 엘리먼트처럼 `<></>`을 사용할 수 있습니다.

주의: **[아직 많은 도구에서 이 단축 문법이 지원이 안 되기 때문에](/blog/2017/11/28/react-v16.2.0-fragment-support.html#support-for-fragment-syntax)** 그전까지는 명시적으로 `<React.Fragmemt>`를 사용해야 하는 것에 주의해야 합니다.

### key가 있는 Fragments {#keyed-fragments}

Fragments에 `key`가 있다면 `<React.Fragment>` 문법으로 명시적으로 선언해야 합니다. 예를 들어 정의 목록을 만들기 위해 컬렉션을 fragments 배열로 매핑하는 사용 사례입니다.

```jsx
function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        // React는 `key`가 없으면 key warning을 발생합니다.
        <React.Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}
```

`key`는 `Fragment`에 전달할 수 있는 유일한 어트리뷰트입니다. 추후 이벤트 핸들러와 같은 추가적인 어트리뷰트를 지원할 수도 있습니다.

### 라이브 데모 {#live-demo}

[CodePen](https://codepen.io/reactjs/pen/VrEbjE?editors=1000)에서 새로운 JSX fragment 문법을 사용해 볼 수 있습니다.
