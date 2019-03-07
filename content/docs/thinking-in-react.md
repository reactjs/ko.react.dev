---
id: thinking-in-react
title: 리액트로 생각하기
permalink: docs/thinking-in-react.html
redirect_from:
  - 'blog/2013/11/05/thinking-in-react.html'
  - 'docs/thinking-in-react-zh-CN.html'
prev: composition-vs-inheritance.html
---

React는 Javascript로 규모가 크면서 빠른 웹 앱을 만드는데에 최고의 방법이라고 생각합니다. 우리는 페이스북과 인스타그램도 리액트로 잘 확장해왔습니다.

React의 가장 중요한 부분 중 하나는 앱을 만들 때 앱을 어떻게 생각하게 만드는지 입니다. 이 문서에서는 React를 이용하여 검색할 수 있는 상품 데이터 테이블을 만드는 과정을 보여줄 것입니다.

## 하나의 시안으로 시작하기 {#start-with-a-mock}

우리가 이미 JSON API와 디자이너에게서 받은 시안이 있다고 상상해봅시다. 그 시안은 다음과 같습니다.

![Mockup](../images/blog/thinking-in-react-mock.png)

우리의 JSON API는 아래와 같이 생긴 데이터를 반환합니다.

```
[
  {category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football"},
  {category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball"},
  {category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball"},
  {category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch"},
  {category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5"},
  {category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7"}
];
```

## Step 1: UI를 하나의 컴포넌트 계층구조로 만들자 {#step-1-break-the-ui-into-a-component-hierarchy}

첫 번째로 해야할 일은 모든 컴포넌트마다 박스를 그리고 각자에게 이름을 주는 것입니다. 만약 디자이너와 일하고 있다면 이미 해놨을 수도 있으니 물어보세요! 포토샵 레이어 이름이 컴포넌트 이름이 될 수 있습니다.

그러나 어떤 것이 하나의 컴포넌트가 될 수 있는지를 어떻게 알 수 있을까요? 새로운 함수 혹은 객체를 만들지 말지를 결정할 때 이용하는 기술을 똑같이 사용해보세요. 그러한 기술 중 하나가 바로 [단일 책임 원칙](https://ko.wikipedia.org/wiki/%EB%8B%A8%EC%9D%BC_%EC%B1%85%EC%9E%84_%EC%9B%90%EC%B9%99) 입니다. 즉, 이상적으로 컴포넌트 하나는 한 가지 일만 수행해야 합니다. 만약 컴포넌트가 커진다면 작은 하위 컴포넌트들로 해체되어야 합니다.  

JSON 데이터 모델을 자주 사용자에게 보여줘야하기 때문에 모델이 올바르게 작성되었다면 UI(컴포넌트 구조)와 잘 매핑될 것입니다. UI와 데이터 모델은 같은 정보 아키텍처를 띠는 경향이 있기 때문에 UI를 컴포넌트로 분리하는 작업은 보통 사소한 작업입니다. 정확히 하나의 데이터 모델을 나타내는 컴포넌트들로 분해하세요.

![Component diagram](../images/blog/thinking-in-react-components.png)

이 간단한 앱에는 다섯 개의 컴포넌트가 있습니다. 아래에 각 컴포넌트가 나타내는 데이터를 이태리체로 표시했습니다.

  1. **`FilterableProductTable` (오렌지색):** 이 예시의 전체를 포함
  2. **`SearchBar` (파란색):** 모든 *사용자 입력* 을 받음
  3. **`ProductTable` (초록색):** *사용자 입력* 에 기반한 *데이터 collection* 을 필터링해서 보여줌
  4. **`ProductCategoryRow` (옥색):** 각 *카테고리* 이름을 보여줌
  5. **`ProductRow` (빨간색):** 각 *상품*을 행 단위로 보여줌

`ProductTable`를 보면 테이블 헤더("Name"과 "Price" 라벨을 포함하는)가 하나의 컴포넌트가 아닌 것을 볼 수 있습니다. 자신의 취향 따라 다른 방법을 사용해도 좋습니다. 이 예제에서는 `ProductTable`의 단일 책임인 *데이터 collection* 을 렌더링 하는 부분으로 봤기 때문에 이렇게 표현했습니다. 그러나 만약 이 헤더가 더 복잡해진다면(예를 들어 정렬을 위한 부분을 추가하는 것), `ProductTableHeader` 컴포넌트를 만드는 것이 합리적일 것입니다.

시안을 컴포넌트화 시켰으니 이제 하나의 계층구조로 정리해봅시다. 쉬운 작업입니다. 시안에서 컴포넌트 안에 있는 컴포넌트들을 자식으로 만들어주면 됩니다.

  * `FilterableProductTable`
    * `SearchBar`
    * `ProductTable`
      * `ProductCategoryRow`
      * `ProductRow`

## Step 2: React로 정적인 앱 만들기 {#step-2-build-a-static-version-in-react}

<p data-height="600" data-theme-id="0" data-slug-hash="BwWzwm" data-default-tab="js" data-user="lacker" data-embed-version="2" class="codepen">See the Pen <a href="https://codepen.io/gaearon/pen/BwWzwm">Thinking In React: Step 2</a> on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

드디어 컴포넌트 계층구조가 생겼으니 이제 앱으로 만들 시간입니다. 가장 쉬운 방법은 데이터를 가져와 UI를 그리지만 상호 작용은 없는 버전을 만드는 것 입니다. 이런 정적인 버전을 만드는 것은 단순히 많은 타이핑만을 필요로 하지만 상호 작용을 추가하는 것은 타이핑이 아닌 많은 생각을 필요로하기 때문에 이 두 과정을 떼어놓는게 좋습니다. 그 이유를 살펴보겠습니다.

정적인 버전을 만들기 위해선 다른 컴포넌트들을 재사용하고 *props*를 이용해 데이터를 넘기는 컴포넌트를 만들어야 합니다. *props*는 부모 컴포넌트로부터 자식 컴포넌트에게 데이터를 전달하는 방식입니다. 만약 *state*의 개념에 익숙하다면 이런 정적인 버전을 만들 때에는 **state를 쓰지 마세요.** State는 오로지 상호 작용 작업 즉, 시간이 지남에 따라 변하는 데이터를 위한 것입니다. 이것은 정적인 버전이기 때문에 state는 필요하지 않습니다.

당신은 앱을 상향식 혹은 하향식으로 만들 수 있습니다. 즉, 계층구조에서 가장 상위의 컴포넌트(예를 들어 `FilterableProductTable`) 혹은 가장 하위의 컴포넌트(`ProductRow`)부터 시작할 수 있습니다. 간단한 예제에서는 하향식, 큰 프로젝트에서는 상향식으로 진행하는 것이 만들기도, 테스트를 하기에도 쉽습니다.

이 단계가 끝나면 데이터를 렌더링하는 재사용가능한 컴포넌트 라이브러리를 갖게될 것입니다. 그 컴포넌트들은 정적인 버전이라면 오직 `render()` 메소드만을 가질 것입니다. 가장 상위의 컴포넌트(`FilterableProductTable`)는 데이터 모델을 prop으로 가질 것 입니다. 만약 주어진 데이터 모델에 변화를 주고 `ReactDOM.render()`를 다시 호출하면 UI가 업데이트 될 것입니다. 복잡한 것이 없기 때문에 UI가 어떻게 업데이트 되는지, 어디서 변화를 줘야하는지 알기 쉽습니다. 이렇게 React의 **one-way data flow**(*one-way binding* 이라고도 불려지는)는 모든 것을 모듈화하고 빠르게 유지합니다.

이 단계를 수행하는데 있어서 도움이 필요하다면 [React 문서들](/docs/)을 살펴보세요.

### 짤막 상식: Props vs State {#a-brief-interlude-props-vs-state}

리액트에는 두 유형의 데이터 모델이 있습니다: props와 state. 이 둘의 차이점을 이해하는 것은 매우 중요합니다. 만약 차이점을 명확하게 모르신다면 이 [React 공식 문서](/docs/interactivity-and-dynamic-uis.html)를 살펴보세요.

## Step 3: Identify The Minimal (but complete) Representation Of UI State {#step-3-identify-the-minimal-but-complete-representation-of-ui-state}

To make your UI interactive, you need to be able to trigger changes to your underlying data model. React makes this easy with **state**.

To build your app correctly, you first need to think of the minimal set of mutable state that your app needs. The key here is [DRY: *Don't Repeat Yourself*](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself). Figure out the absolute minimal representation of the state your application needs and compute everything else you need on-demand. For example, if you're building a TODO list, just keep an array of the TODO items around; don't keep a separate state variable for the count. Instead, when you want to render the TODO count, simply take the length of the TODO items array.

Think of all of the pieces of data in our example application. We have:

  * The original list of products
  * The search text the user has entered
  * The value of the checkbox
  * The filtered list of products

Let's go through each one and figure out which one is state. Simply ask three questions about each piece of data:

  1. Is it passed in from a parent via props? If so, it probably isn't state.
  2. Does it remain unchanged over time? If so, it probably isn't state.
  3. Can you compute it based on any other state or props in your component? If so, it isn't state.

The original list of products is passed in as props, so that's not state. The search text and the checkbox seem to be state since they change over time and can't be computed from anything. And finally, the filtered list of products isn't state because it can be computed by combining the original list of products with the search text and value of the checkbox.

So finally, our state is:

  * The search text the user has entered
  * The value of the checkbox

## Step 4: Identify Where Your State Should Live {#step-4-identify-where-your-state-should-live}

<p data-height="600" data-theme-id="0" data-slug-hash="qPrNQZ" data-default-tab="js" data-user="lacker" data-embed-version="2" class="codepen">See the Pen <a href="https://codepen.io/gaearon/pen/qPrNQZ">Thinking In React: Step 4</a> on <a href="https://codepen.io">CodePen</a>.</p>

OK, so we've identified what the minimal set of app state is. Next, we need to identify which component mutates, or *owns*, this state.

Remember: React is all about one-way data flow down the component hierarchy. It may not be immediately clear which component should own what state. **This is often the most challenging part for newcomers to understand,** so follow these steps to figure it out:

For each piece of state in your application:

  * Identify every component that renders something based on that state.
  * Find a common owner component (a single component above all the components that need the state in the hierarchy).
  * Either the common owner or another component higher up in the hierarchy should own the state.
  * If you can't find a component where it makes sense to own the state, create a new component simply for holding the state and add it somewhere in the hierarchy above the common owner component.

Let's run through this strategy for our application:

  * `ProductTable` needs to filter the product list based on state and `SearchBar` needs to display the search text and checked state.
  * The common owner component is `FilterableProductTable`.
  * It conceptually makes sense for the filter text and checked value to live in `FilterableProductTable`

Cool, so we've decided that our state lives in `FilterableProductTable`. First, add an instance property `this.state = {filterText: '', inStockOnly: false}` to `FilterableProductTable`'s `constructor` to reflect the initial state of your application. Then, pass `filterText` and `inStockOnly` to `ProductTable` and `SearchBar` as a prop. Finally, use these props to filter the rows in `ProductTable` and set the values of the form fields in `SearchBar`.

You can start seeing how your application will behave: set `filterText` to `"ball"` and refresh your app. You'll see that the data table is updated correctly.

## Step 5: Add Inverse Data Flow {#step-5-add-inverse-data-flow}

<p data-height="600" data-theme-id="0" data-slug-hash="LzWZvb" data-default-tab="js,result" data-user="rohan10" data-embed-version="2" data-pen-title="Thinking In React: Step 5" class="codepen">See the Pen <a href="https://codepen.io/gaearon/pen/LzWZvb">Thinking In React: Step 5</a> on <a href="https://codepen.io">CodePen</a>.</p>

So far, we've built an app that renders correctly as a function of props and state flowing down the hierarchy. Now it's time to support data flowing the other way: the form components deep in the hierarchy need to update the state in `FilterableProductTable`.

React makes this data flow explicit to make it easy to understand how your program works, but it does require a little more typing than traditional two-way data binding.

If you try to type or check the box in the current version of the example, you'll see that React ignores your input. This is intentional, as we've set the `value` prop of the `input` to always be equal to the `state` passed in from `FilterableProductTable`.

Let's think about what we want to happen. We want to make sure that whenever the user changes the form, we update the state to reflect the user input. Since components should only update their own state, `FilterableProductTable` will pass callbacks to `SearchBar` that will fire whenever the state should be updated. We can use the `onChange` event on the inputs to be notified of it. The callbacks passed by `FilterableProductTable` will call `setState()`, and the app will be updated.

Though this sounds complex, it's really just a few lines of code. And it's really explicit how your data is flowing throughout the app.

## And That's It {#and-thats-it}

Hopefully, this gives you an idea of how to think about building components and applications with React. While it may be a little more typing than you're used to, remember that code is read far more than it's written, and it's extremely easy to read this modular, explicit code. As you start to build large libraries of components, you'll appreciate this explicitness and modularity, and with code reuse, your lines of code will start to shrink. :)
