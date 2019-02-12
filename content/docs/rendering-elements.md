---
id: rendering-elements
title: 요소 렌더링
permalink: docs/rendering-elements.html
redirect_from:
  - "docs/displaying-data.html"
prev: introducing-jsx.html
next: components-and-props.html
---

요소는 React 앱의 가장 작은 단위입니다.

요소는 화면에 표시할 내용을 기술합니다.

```js
const element = <h1>Hello, world</h1>;
```

브라우저 DOM 요소와 달리, React 요소는 일반 객체이며(plain object), 쉽게 만들 수 있습니다. React DOM은 React 요소와 일치하도록 DOM을 업데이트합니다.

>**노트**
>
>더 널리 알려진 개념인 "컴포넌트"와 요소를 혼동할 수 있습니다. 컴포넌트에 대해서 [다음 장](/docs/components-and-props.html)에서 소개할 예정입니다. 요소는 컴포넌트의 "구성 요소"이므로 이번 장을 읽고 나서 다음 장으로 넘어갈 것을 권합니다. 

## DOM에 요소 렌더링하기 {#rendering-an-element-into-the-dom}

HTML 파일 어딘가에 `<div>`가 있다고 가정해 봅시다.

```html
<div id="root"></div>
```

이 안에 들어가는 모든 요소를 React DOM에서 관리하기 때문에 이것을 "루트" DOM 노드라고 부릅니다.

React로 구현된 애플리케이션은 일반적으로 하나의 루트 DOM 노드가 있습니다. 만약 React를 기존 앱에 통합하려는 경우, 원하는 만큼 많은 수의 독립된 루트 DOM 노드가 있을 수 있습니다.

React 요소를 루트 DOM 노드에 렌더링하려면, 둘 다 `ReactDOM.render()`로 전달하면 됩니다.

`embed:rendering-elements/render-an-element.js`

[**CodePen에서 실행하기**](codepen://rendering-elements/render-an-element)

위 코드를 실행하면 화면에 "Hello, World"가 보일 겁니다.

## 렌더링 된 요소 업데이트하기 {#updating-the-rendered-element}

React 요소는 [변경 불가(immutable)](https://en.wikipedia.org/wiki/Immutable_object)합니다. 요소를 생성한 이후에는 해당 요소의 자식이나 속성을 변경할 수 없습니다. 요소는 영화에서 
하나의 프레임과 같이 특정 시점의 UI를 보여줍니다.

지금까지 소개한 내용을 바탕으로 하면, UI를 업데이트하는 유일한 방법은 새로운 요소를 생성하고 이를 `ReactDOM.render()`로 전달하는 것입니다.

예제로 똑딱거리는 시계를 살펴보겠습니다.

`embed:rendering-elements/update-rendered-element.js`

[**CodePen에서 실행하기**](codepen://rendering-elements/update-rendered-element)

위 함수는 [`setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval) 콜백을 이용해 초마다 `ReactDOM.render()`를 호출합니다.

>**노트**
>
>실제로, 대부분의 React 앱은 `ReactDOM.render()`를 한 번만 호출합니다. 다음 장에서는 이와 같은 코드가 [상태가 있는 컴포넌트(stateful components)](/docs/state-and-lifecycle.html)에 어떻게 캡슐화되는지 설명합니다.
>
>각 주제가 서로 연관이 있기 때문에 건너뛰지 않는 것을 추천합니다.

## React는 필요한 항목만 업데이트한다 {#react-only-updates-whats-necessary}

React DOM은 해당 요소와 그 자식 요소를 이전의 요소와 비교하고 DOM을 원하는 상태로 만드는데 필요한 경우에만 DOM을 업데이트합니다.

개발자 도구를 이용해 [마지막 예제](codepen://rendering-elements/update-rendered-element)를 살펴보면 이를 확인할 수 있습니다.

![DOM inspector showing granular updates](../images/docs/granular-dom-updates.gif)

초마다 전체 UI 트리를 그리는 요소를 생성했음에도 불구하고, 내용이 변경된 텍스트 노드만 React DOM에 의해 업데이트 되었습니다.

우리의 경험상, 시간이 경과함에 따라 UI를 어떻게 변경할지를 생각하기보다는 특정 시점에 어떻게 보일지를 생각하면 수 많은 종류의 버그들을 없앨 수 있었습니다.
