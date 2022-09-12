---
title: React로 사고하기
---

<Intro>

<<<<<<< HEAD:beta/src/pages/learn/thinking-in-react.md
React를 사용하게 되면 우리가 고려하고 있는 디자인이나 만들 앱들에 대한 생각을 바꿀 수 있습니다. React를 사용하면 숲만이 아니라 나무 하나하나를 볼 수 있게 될 것입니다. React는 디자인 시스템과 UI의 상태들로 사고하는 것을 쉽게 도와줍니다. 이 자습서에서는 React로 검색 가능한 데이터 테이블을 구현을 위해 사고하는 과정을 차근차근 알려드릴 것입니다.
=======
React can change how you think about the designs you look at and the apps you build. When you build a user interface with React, you will first break it apart into pieces called *components.* Then, you will describe the different visual states for each of your components. Finally, you will connect your components together so that the data flows through them. In this tutorial, we'll guide you through the thought process of building a searchable product data table with React.
>>>>>>> c7d858947f832d1ba4e78caebc391fd964ff6de6:beta/src/content/learn/thinking-in-react.md

</Intro>

## mockup과 함께 시작하기 {/*start-with-the-mockup*/}

JSON API와 디자이너로부터 mockup을 이미 받았다고 생각해 봅시다.
JSON API는 몇몇 데이터를 가지고 이렇게 생겼을 겁니다:
```json
[
  { category: "Fruits", price: "$1", stocked: true, name: "Apple" },
  { category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit" },
  { category: "Fruits", price: "$2", stocked: false, name: "Passionfruit" },
  { category: "Vegetables", price: "$2", stocked: true, name: "Spinach" },
  { category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin" },
  { category: "Vegetables", price: "$1", stocked: true, name: "Peas" }
]
```

mockup은 이렇게 생겼습니다.

<img src="/images/docs/s_thinking-in-react_ui.png" width="300" style={{margin: '0 auto'}} />

리액트로 UI를 구현하기 위해서 보통 다섯가지 단계를 따릅니다.

## Step 1: UI를 컴포넌트 계층으로 쪼개기 {/*step-1-break-the-ui-into-a-component-hierarchy*/}

우리가 할 첫 번째 일은 모든 컴포넌트와 하위 컴포넌트의 주변에 박스를 그리고 그 각각에 이름을 붙이는 것입니다. 디자이너와 함께 일한다면, 이름들을 이미 정해두었을 수 있으니 한번 확인해보세요!

어떤 배경을 가지고 있냐에 따라, 컴포넌트를 다양하게 쪼개볼 수 있습니다.

* **Programming**--새로운 함수나 객체를 만드는 방식과 같은 방식으로 해봅시다. 예를 들어, [단일책임 원칙](https://ko.wikipedia.org/wiki/%EB%8B%A8%EC%9D%BC_%EC%B1%85%EC%9E%84_%EC%9B%90%EC%B9%99)을 반영하고자 한다면 컴포넌트는 이상적으로는 한 가지 일만 해야 됩니다. 만약 점점 컴포넌트가 커진다면 작은 하위 컴포넌트로 쪼개져야 되겠죠.
* **CSS**--class 선택자를 무엇으로 만들지 생각해봅시다. (실제 컴포넌트들은 약간 좀 더 세분되어 있습니다.)
* **Design**--디자인 계층을 어떤 식으로 구성할지 생각해봅시다.

JSON이 잘 구조화 되어있을 때 컴포넌트 구조가 자연스럽게 데이터 구조에 연결된다는 것을 발견할 수 있습니다. UI랑 데이터 모델은 같은 정보 아키텍처(information architecture)로 설계되는 경우가 많기 때문입니다. 컴포넌트들이 데이터 모델에 매칭될 수 있게 UI를 컴포넌트로 쪼개주세요!

여기 다섯 개의 컴포넌트가 있습니다.

<FullWidth>

<CodeDiagram flip>

<img src="/images/docs/s_thinking-in-react_ui_outline.png" width="500" style={{margin: '0 auto'}} />

1. `FilterableProductTable`(회색): 예시 전체를 포괄합니다.
2. `SearchBar`(파란색): 모든 유저의 입력(user input) 을 받습니다.
3. `ProductTable`(라벤더색): 유저의 입력(user input)을 기반으로 데이터 콜렉션(data collection)을 필터링 해서 보여줍니다.
4. `ProductCategoryRow`(초록색): 각 카테고리(category)의 헤더를 보여줍니다.
5. `ProductRow`(노란색): 각각의 제품(product)에 해당하는 행을 보여줍니다.

</CodeDiagram>

</FullWidth>

`ProductTable`을 보면 “Name”과 “Price” 레이블을 포함한 테이블 헤더 기능만을 가진 컴포넌트는 없습니다. 독립된 컴포넌트를 따로 생성할지 생성하지 않을지는 당신의 선택입니다. 이 예시에서는 `ProductTable`의 위의 단순한 헤더들이 `ProductTable`의 일부이기 때문에 위 레이블들을 컴포넌트로 만들지 않고 그냥 남겨두었습니다. 그러나 이 헤더가 복잡해지면 (즉 정렬을 위한 기능을 추가하는 등) `ProductTableHeader` 컴포넌트를 만드는 것이 더 합리적일 것입니다.

mockup을 쪼개서 컴포넌트들을 확인하였으므로 이를 다시 계층 구조로 나열해봅시다. 컴포넌트 내부에 존재하는 컴포넌트는 계층 구조상 자식으로 나타냅니다.

* `FilterableProductTable`
  * `SearchBar`
  * `ProductTable`
    * `ProductCategoryRow`
    * `ProductRow`

## Step 2: React로 정적인 UI 구현하기 {/*step-2-build-a-static-version-in-react*/}

이제 컴포넌트 계층구조가 만들어졌으니 앱을 실제로 구현해볼 시간입니다. 가장 쉬운 방법은 데이터 모델을 가지고 UI를 렌더링은 되지만 아무 동작도 없는 버전을 만들어보는 것입니다. 보통 정적인 버전을 먼저 만들고 상호작용을 개별로 추가하는 게 더 쉽습니다. 정적 버전을 만드는 것은 적은 고민을 필요로 하지만 타이핑을 많이 필요로 하고, 상호작용을 만드는 것은 많은 고민을 필요로 하지만 타이핑이 적게 필요되기 때문입니다.

<<<<<<< HEAD:beta/src/pages/learn/thinking-in-react.md
데이터 모델을 렌더링하는 앱의 정적 버전을 만들기 위해 다른 컴포넌트를 재사용하는 [컴포넌트](/learn/your-first-component)를 만들고 [props](/learn/passing-props-to-a-component)를 이용해 데이터를 전달해줍시다. props는 부모가 자식에게 데이터를 넘겨줄 때 사용할 수 있는 방법입니다. (혹시 [state](/learn/state-a-components-memory) 개념에 익숙하다고 해도 정적인 버전을 만드는 데는 state를 쓰지 마세요! state는 오직 상호작용을 위해, 즉 시간이 지남에 따라 데이터가 바뀌는 것에 사용합니다. 우리는 앱의 정적 버전을 만들고 있기 때문에 지금은 필요하지 않습니다.)
=======
To build a static version of your app that renders your data model, you'll want to build [components](/learn/your-first-component) that reuse other components and pass data using [props.](/learn/passing-props-to-a-component) Props are a way of passing data from parent to child. (If you're familiar with the concept of [state](/learn/state-a-components-memory), don't use state at all to build this static version. State is reserved only for interactivity, that is, data that changes over time. Since this is a static version of the app, you don't need it.)
>>>>>>> c7d858947f832d1ba4e78caebc391fd964ff6de6:beta/src/content/learn/thinking-in-react.md

앱을 만들 때 계층 구조에 따라 상층부에 있는 컴포넌트 (즉 `FilterableProductTable`부터 시작하는 것)부터 하향식(top-down)으로 만들거나 혹은 하층부에 있는 컴포넌트 (`ProductRow`)부터 상향식(bottom-up)으로 만들 수 있습니다. 간단한 예시에서는 보통 하향식으로 만드는 게 쉽지만, 프로젝트가 커지면 상향식으로 만들고 테스트를 작성하면서 개발하기가 더 쉽습니다.

<Sandpack>

```jsx App.js
function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar() {
  return (
    <form>
      <input type="text" placeholder="Search..." />
      <label>
        <input type="checkbox" />
        {' '}
        Only show products in stock
      </label>
    </form>
  );
}

function FilterableProductTable({ products }) {
  return (
    <div>
      <SearchBar />
      <ProductTable products={products} />
    </div>
  );
}

const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px;
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding-top: 10px;
}
td {
  padding: 2px;
  padding-right: 40px;
}
```

</Sandpack>
**코드 예제가 어려워도 주저하지 마세요!**. 지금 글에서는 우리는 코드보다 컨셉에 집중할 겁니다. 뒤에 배우는 [Describing the UI](/learn/describing-the-ui) 단계로 가면 React 코드를 좀 더 잘 이해 할 수 있게 될 겁니다.
이 단계가 끝나면 데이터 렌더링을 위해 만들어진 재사용 가능한 컴포넌트들의 라이브러리를 가지게 됩니다. 현재는 앱의 정적 버전이기 때문에 컴포넌트는 단순히 JSX만 리턴 할 것 입니다. 계층구조의 최상단 컴포넌트 (FilterableProductTable)는 prop으로 데이터 모델을 받습니다. 데이터가 최상단 컴포넌트부터 트리의 맨 아래 까지 흘러가기 때문에 단방향 데이터 흐름(one-way data flow)라고 부릅니다.

<Gotcha>

여기까지는 아직 state값을 쓰지마세요. 다음 step에서 쓸겁니다.

</Gotcha>

## Step 3: 최소한의 데이터만 이용해서 완벽하게 UI State 표현해내기 {/*step-3-find-the-minimal-but-complete-representation-of-ui-state*/}

UI를 상호작용(interactive)하게 만들려면 유저가 기반 데이터 모델을 변경할 수 있게 해야 합니다. React는 *state*를 통해 기반 데이터 모델을 변경할 수 있게 합니다.

<<<<<<< HEAD:beta/src/pages/learn/thinking-in-react.md
앱을 동작시키는데 필요한 최소한의 state들만 이용해야 함을 염두에 두세요. 여기서 핵심은 [중복배제원칙(Don't Repeat Yourself)](https://ko.wikipedia.org/wiki/%EC%A4%91%EB%B3%B5%EB%B0%B0%EC%A0%9C) 입니다. 애플리케이션이 필요로 하는 가장 최소한의 state를 찾고 이를 통해 나머지 모든 것들이 필요에 따라 그때그때 계산되도록 만드세요. 예를 들어, 쇼핑 리스트를 만든다고 하면 당신은 배열에 상품 아이템들을 넣을 겁니다. UI에 상품 아이템의 개수를 노출하고 싶다고 하면 상품 아이템 개수를 따로 state 값으로 가지는 게 아니라 단순하게 배열의 길이만 쓰면 됩니다.
=======
Think of state as the minimal set of changing data that your app needs to remember. The most important principle for structuring state is to keep it [DRY (Don't Repeat Yourself).](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) Figure out the absolute minimal representation of the state your application needs and compute everything else on-demand. For example, if you're building a shopping list, you can store the items as an array in state. If you want to also display the number of items in the list, don't store the number of items as another state value--instead, read the length of your array.
>>>>>>> c7d858947f832d1ba4e78caebc391fd964ff6de6:beta/src/content/learn/thinking-in-react.md

예시 애플리케이션 내 데이터들을 생각해봅시다. 애플리케이션은 다음과 같은 데이터를 가지고 있습니다.

1. 제품의 원본 목록
2. 유저가 입력한 검색어
3. 체크박스의 값
4. 필터링 된 제품들의 목록

각각 살펴보고 어떤 게 state가 되어야 하는지 살펴봅시다. 이는 각 데이터에 대해 아래의 세 가지 질문을 통해 결정할 수 있습니다.

- **시간이 지나도 변하지 않나요?** 그러면 확실히 state가 아닙니다.
- **부모로부터 props를 통해 전달됩니까?** 그러면 확실히 state가 아닙니다.
- 컴포넌트 안의 다른 state나 props를 가지고 **계산 가능한가요?** 그렇다면 state가 아닙니다.

그외 남는건 아마 state일겁니다.

위 데이터들을 하나씩 다시 살펴 볼까요.

<<<<<<< HEAD:beta/src/pages/learn/thinking-in-react.md
1. 제품의 원본 목록은 **props를 통해서 전달되었기 때문에 state가 아닙니다**.
2. 유저가 검색한 검색어는 시간에 따라서 바뀌고 다른 것으로부터 계산이 불가 하므로 state로 볼 수 있습니다.
3. 체크박스의 값은 시간에 따라 바뀌고 다른 것으로부터 계산이 불가 하므로 state로 볼수 있습니다
4. 필터링 된 제품들의 목록은 제품의 원본 목록과 검색어, 체크박스의 값을 조합해서 **계산해낼 수 있기 때문에** state가 아닙니다.
=======
1. The original list of products is **passed in as props, so it's not state.** 
2. The search text seems to be state since it changes over time and can't be computed from anything.
3. The value of the checkbox seems to be state since it changes over time and can't be computed from anything.
4. The filtered list of products **isn't state because it can be computed** by taking the original list of products and filtering it according to the search text and value of the checkbox.
>>>>>>> c7d858947f832d1ba4e78caebc391fd964ff6de6:beta/src/content/learn/thinking-in-react.md

오직 검색창의 텍스트와 체크 박스의 값만이 state입니다! 잘했어요!

<DeepDive title="Props vs State">

React는 props와 state라는 두 개의 데이터 모델이 존재합니다. 둘의 성격은 매우 다릅니다.

- [**Props**는 함수를 통해 전달되는 인자 같은 성격을 가집니다.](/learn/passing-props-to-a-component) props는 부모 컴포넌트로부터 자식 컴포넌트로 데이터를 넘겨서 외관을 커스터마이징 하게 해줍니다. 예를 들어, `Form`은 color라는 prop을 `Button`으로 보내서 `Button`을 내가 원하는 형태로 커스터마이징 시킬 수 있습니다..
- [**State**는 컴포넌트의 메모리 같은 성격을 가집니다.](/learn/state-a-components-memory) state는 컴포넌트가 몇몇 정보를 계속 따라갈 수 있게 해주고 변화하면서 상호작용(interaction)을 만들어 냅니다. 예를 들어, `Button`은 `isHovered`라는 state를 따라갈 것입니다.

props와 state는 다르지만, 함께 동작합니다. state는 보통 부모 컴포넌트에 저장됩니다. ( 그래서 부모 컴포넌트는 그 state를 변경할 수 있습니다. ) 그리고 부모 컴포넌트는 state를 자식 컴포넌트에 props로서 전달합니다. 처음 봤을 때 둘의 차이를 잘 알기 어려워도 괜찮습니다. 약간 연습이 필요할 거에요!

</DeepDive>

## Step 4: State가 어디에 있어야 할지 정하기 {/*step-4-identify-where-your-state-should-live*/}

이제 앱에서 최소한으로 필요한 state가 뭔지 정했습니다. 다음으로는 어떤 컴포넌트가 state를 가질지 변경시킬지 정해야 합니다. React는 항상 컴포넌트 계층구조를 따라 부모에서 자식으로 아래로 내려가는 단방향 데이터 흐름을 따른 다는 것을 기억하세요! 앱을 구현하면서 어떤 컴포넌트가 state를 가져야 하는 지 바로 명확하지 않을 수 있습니다. 또, 이 컨셉을 처음 접하는 거라면 더 어려울 수 있습니다. 아래 과정을 따라 해결해 봅시다.

애플리케이션이 가지는 각각의 state에 대해서,

1. 해당 state를 기반으로 렌더링하는 모든 컴포넌트를 찾으세요.
2. 가장 가까운 공통되는 부모 컴포넌트를 찾으세요. - 계층 상 state 영향을 받는 컴포넌트들 위에 있는 컴포넌트
3. state가 어디에 위치 돼야 되는지 결정합시다
   1. 대개, 공통 부모에 state를 그냥 두면 됩니다.
   2. 혹은, 공통 부모 상위의 컴포넌트에 둬도 됩니다.
   3. state를 소유할 적절한 컴포넌트를 찾지 못하였다면, state를 소유하는 컴포넌트를 하나 만들어서 상위 계층에 추가하세요.

이전 단계에서 유저가 검색한 검색어, 체크 박스의 값이 state임을 확인했습니다. 이 두 state는 항상 함께 노출되기 때문에 하나의 state로 보면 쉽습니다.

이 전략을 애플리케이션에 적용해봅시다.

1. **state를 쓰는 컴포넌트를 찾아봅시다**:
   - `ProductTable`은 state에 기반한 상품 리스트의 필터링해야 합니다 (검색어와 체크 박스의 값)
   - `SearchBar`는 state를 표시해주어야 합니다. (검색어와 체크 박스의 값)
2. **공통 부모를 찾아봅시다**: 둘 모두가 공유하는 첫 번째 부모는 `FilterableProductTable`입니다
3. **어디에 state가 존재해야 할지 정해봅시다**: 우리는`FilterableProductTable`에 검색어와 체크 박스 값을 state로 둘겁니다.

이제 state값은 `FilterableProductTable`안에 있습니다.

<<<<<<< HEAD:beta/src/pages/learn/thinking-in-react.md
[`useState()` Hook](/apis/usestate)을 이용해서 state를 컴포넌트에 추가하세요. Hooks는 컴포넌트의 [렌더 사이클](/learn/render-and-commit)로 당신을 채갈(hook into) 겁니다. `FilterableProductTable`의 윗부분에 두 개의 state 변수를 추가해서 초깃값을 명확하게 보여주세요.
=======
Add state to the component with the [`useState()` Hook.](/apis/react/useState) Hooks let you "hook into" a component's [render cycle.](/learn/render-and-commit) Add two state variables at the top of `FilterableProductTable` and specify the initial state of your application:
>>>>>>> c7d858947f832d1ba4e78caebc391fd964ff6de6:beta/src/content/learn/thinking-in-react.md

```js
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
```

다음으로, `filterText`와 `inStockOnly`를 `ProductTable`와 `SearchBar`에게 props로 전달하세요.

```js
<div>
  <SearchBar 
    filterText={filterText} 
    inStockOnly={inStockOnly} />
  <ProductTable 
    products={products}
    filterText={filterText}
    inStockOnly={inStockOnly} />
</div>
```

이제 애플리케이션이 어떻게 동작하는지 알 수 있습니다. `filterText`의 초기 값을 `useState('')`에서 `useState('fruit')`로 수정해 보세요. 검색창과 데이터 테이블이 모두 업데이트됨을 확인할 수 있습니다.

<Sandpack>

```jsx App.js
import { useState } from 'react';

function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  return (
    <div>
      <SearchBar 
        filterText={filterText} 
        inStockOnly={inStockOnly} />
      <ProductTable 
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly} />
    </div>
  );
}
function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}
function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products, filterText, inStockOnly }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (
      product.name.toLowerCase().indexOf(
        filterText.toLowerCase()
      ) === -1
    ) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({ filterText, inStockOnly }) {
  return (
    <form>
      <input 
        type="text" 
        value={filterText} 
        placeholder="Search..."/>
      <label>
        <input 
          type="checkbox" 
          checked={inStockOnly} />
        {' '}
        Only show products in stock
      </label>
    </form>
  );
}

const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px;
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding-top: 5px;
}
td {
  padding: 2px;
}
```

</Sandpack>

<<<<<<< HEAD:beta/src/pages/learn/thinking-in-react.md
위에 있는 샌드박스를 보면, `ProductTable`와 `SearchBar`가 `filterText`와 `inStockOnly` props를 table, input과 체크 박스를 렌더하기 위해서 읽고 있습니다. 예를 들면, `SearchBar` input의 value를 이런 식으로 채우고 있습니다.
=======
Notice that editing the form doesn't work yet. There is a console error in the sandbox above explaining why:

<ConsoleBlock level="error">

You provided a \`value\` prop to a form field without an \`onChange\` handler. This will render a read-only field.

</ConsoleBlock>

In the sandbox above, `ProductTable` and `SearchBar` read the `filterText` and `inStockOnly` props to render the table, the input, and the checkbox. For example, here is how `SearchBar` populates the input value:
>>>>>>> c7d858947f832d1ba4e78caebc391fd964ff6de6:beta/src/content/learn/thinking-in-react.md

```js {1,6}
function SearchBar({ filterText, inStockOnly }) {
  return (
    <form>
      <input 
        type="text" 
        value={filterText} 
        placeholder="Search..."/>
```

<<<<<<< HEAD:beta/src/pages/learn/thinking-in-react.md
[Managing State](/learn/managing-state) 에서 React에서 state를 사용하는 더 심화한 방법과 어떻게 앱에 구현하는지 배울 수 있습니다.

## Step 5: 역 데이터 흐름 추가하기 {/*step-5-add-inverse-data-flow*/}
=======
However, you haven't added any code to respond to the user actions like typing yet. This will be your final step.

>>>>>>> c7d858947f832d1ba4e78caebc391fd964ff6de6:beta/src/content/learn/thinking-in-react.md

지금까지 우리는 계층 구조 아래로 흐르는 props와 state의 함수로써 앱을 만들었습니다. 이제 유저 입력에 따라 state를 변경하기 위해서 다른 방향의 데이터 흐름을 만들어야 하는데 이를 위해서는 계층 구조의 하단에 있는 컴포넌트에서 `FilterableProductTable`의 state를 업데이트할 수 있어야 합니다.

React는 전통적인 양방향 데이터 바인딩(two-way data binding)과 비교하면 더 많은 타이핑을 해야 하지만 데이터 흐름을 명시적으로 보이게 만들어서 프로그램이 어떻게 동작하는지 파악할 수 있게 도와줍니다.

4단계의 예시에서 체크하거나 키보드를 타이핑할 경우 UI의 변화가 없고 입력을 무시하는 것을 확인할 수 있습니다. 이건 의도적으로 `<input value={filterText} />`로 코드를 쓰면서 `value`라는 prop이 항상`FilterableProductTable`의 `filterText`라는 state를 통해서 데이터를 받도록 정했기 때문입니다. `filterText`라는 state가 변경되는 게 아니기 때문에 input의 `value`는 변하지 않고 화면도 바뀌는 게 없습니다.

우리는 사용자가 input을 변경할 때마다 사용자의 입력을 반영할 수 있도록 state를 업데이트하기를 원합니다. state는 `FilterableProductTable`이 가지고 있고 state 변경을 위해서는 `setFilterText`와 `setInStockOnly`를 호출을 하면 됩니다. `SearchBar`가 `FilterableProductTable` 대신 state를 업데이트시키기 위해서는 이 함수들을 `SearchBar`로 보내서 state가 업데이트되어야 할 때마다 호출되도록 하면 됩니다.

```js {2,3,10,11}
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar 
        filterText={filterText} 
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly} />
```

`SearchBar`의 `onChange` 이벤트 핸들러의 부모 state를 변경할 수 있도록 구현할 수 있습니다.

```js {5}
<input 
  type="text" 
  value={filterText} 
  placeholder="Search..." 
  onChange={(e) => onFilterTextChange(e.target.value)} />
```

이제 애플리케이션이 완전히 동작합니다!

<Sandpack>

```jsx App.js
import { useState } from 'react';

function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar 
        filterText={filterText} 
        inStockOnly={inStockOnly} 
        onFilterTextChange={setFilterText} 
        onInStockOnlyChange={setInStockOnly} />
      <ProductTable 
        products={products} 
        filterText={filterText}
        inStockOnly={inStockOnly} />
    </div>
  );
}

function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products, filterText, inStockOnly }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (
      product.name.toLowerCase().indexOf(
        filterText.toLowerCase()
      ) === -1
    ) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange
}) {
  return (
    <form>
      <input 
        type="text" 
        value={filterText} placeholder="Search..." 
        onChange={(e) => onFilterTextChange(e.target.value)} />
      <label>
         <input 
          type="checkbox" 
          checked={inStockOnly} 
          onChange={(e) => onInStockOnlyChange(e.target.checked)} />
        {' '}
        Only show products in stock
      </label>
    </form>
  );
}

const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px;
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding: 4px;
}
td {
  padding: 2px;
}
```

</Sandpack>

[Adding Interactivity](/learn/adding-interactivity) 섹션에서 state를 변경하고 이벤트를 다루는 것에 대해 더 심화해서 배울 수 있습니다.

## 더 나아가기 {/*where-to-go-from-here*/}

지금까지는 React를 이용해서 컴포넌트와 앱을 만들려고 할 때 어떻게 사고할지에 대한 간단한 소개입니다. [당장 React로 프로젝트를 시작](/learn/installation)해도 좋고 다음 단계로 넘어가서 이 [자습서를 이용해서 좀 더 심화](/learn/describing-the-ui) 학습해도 좋습니다.
