---
title: React로 사고하기
---

<Intro>

React를 사용하게 되면 우리가 고려하고 있는 디자인이나 만들 앱들에 대한 생각을 바꿀 수 있습니다. React로 사용자 인터페이스를 빌드할 때, 먼저 이를 컴포넌트라는 조각으로 나눕니다. 그리고 각 컴포넌트의 다양한 시각적 상태들을 정의합니다. 마지막으로 컴포넌트들을 연결하여 데이터가 그 사이를 흘러가게 합니다. 이 자습서에서는 React로 검색할 수 있는 상품 테이블을 만드는 과정을 체계적으로 안내해 드리겠습니다.

</Intro>

## 모의 시안과 함께 시작하기 {/*start-with-the-mockup*/}

이미 JSON API와 디자이너로부터 제공받은 모의 시안이 있다고 생각해 봅시다.
JSON API는 아래와 같은 형태의 데이터를 반환합니다.

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

모의 시안은 다음과 같이 생겼습니다.

<img src="/images/docs/s_thinking-in-react_ui.png" width="300" style={{margin: '0 auto'}} />

React로 UI를 구현하기 위해서 일반적으로 다섯 가지 단계를 거칩니다.

## Step 1: UI를 컴포넌트 계층으로 쪼개기 {/*step-1-break-the-ui-into-a-component-hierarchy*/}

먼저 모의 시안에 있는 모든 컴포넌트와 하위 컴포넌트 주변에 박스를 그리고 그들에게 이름을 붙이면서 시작해 보세요. 디자이너와 함께 일한다면 그들이 이미 디자인 툴을 통하여 이 컴포넌트들에 이름을 정해두었을 수도 있습니다. 한번 여쭤보세요!

어떤 배경을 가지고 있냐에 따라, 디자인을 컴포넌트로 나누는 방법에 대한 관점이 달라질 수 있습니다.

* **Programming**--새로운 함수나 객체를 만드는 방식과 같은 방법으로 해봅시다. 이 중 [단일책임 원칙](https://ko.wikipedia.org/wiki/%EB%8B%A8%EC%9D%BC_%EC%B1%85%EC%9E%84_%EC%9B%90%EC%B9%99)을 반영하고자 한다면 컴포넌트는 이상적으로는 한 번에 한 가지 일만 해야 합니다. 만약 컴포넌트가 점점 커진다면 작은 하위 컴포넌트로 쪼개져야 하겠죠.
* **CSS**--class 선택자를 무엇으로 만들지 생각해 봅시다. (실제 컴포넌트들은 약간 좀 더 세분되어 있습니다.)
* **Design**--디자인 계층을 어떤 식으로 구성할 지 생각해 봅시다.

JSON이 잘 구조화 되어있다면, 종종 이것이 UI의 컴포넌트 구조가 자연스럽게 데이터 모델에 대응된다는 것을 발견할 수 있습니다. 이는 UI와 데이터 모델은 보통 같은 정보 아키텍처, 즉 같은 구조를 가지기 때문입니다. UI를 컴포넌트로 분리하고, 각 컴포넌트가 데이터 모델에 매칭될 수 있도록 하세요.

여기 다섯 개의 컴포넌트가 있습니다.

<FullWidth>

<CodeDiagram flip>

<img src="/images/docs/s_thinking-in-react_ui_outline.png" width="500" style={{margin: '0 auto'}} />

1. `FilterableProductTable`(회색): 예시 전체를 포괄합니다.
2. `SearchBar`(파란색): 사용자의 입력을 받습니다.
3. `ProductTable`(라벤더색): 데이터 리스트를 보여주고, 사용자의 입력을 기반으로 필터링합니다.
4. `ProductCategoryRow`(초록색): 각 카테고리의 헤더를 보여줍니다.
5. `ProductRow`(노란색): 각각의 제품에 해당하는 행을 보여줍니다.

</CodeDiagram>

</FullWidth>

`ProductTable`을 보면 “Name”과 “Price” 레이블을 포함한 테이블 헤더 기능만을 가진 컴포넌트는 없습니다. 독립된 컴포넌트를 따로 생성할 지 생성하지 않을지는 당신의 선택입니다. 이 예시에서는 `ProductTable`의 위의 단순한 헤더들이 `ProductTable`의 일부이기 때문에 위 레이블들을 컴포넌트로 만들지 않고 그냥 남겨두었습니다. 그러나 이 헤더가 복잡해지면 (즉 정렬을 위한 기능을 추가하는 등) `ProductTableHeader` 컴포넌트를 만드는 것이 더 합리적일 것입니다.

이제 모의 시안 내의 컴포넌트들을 확인했으니, 이들을 계층 구조로 정리해 봅시다. 모의 시안에서 한 컴포넌트 내에 있는 다른 컴포넌트는 계층 구조에서 자식으로 표현됩니다.

* `FilterableProductTable`
  * `SearchBar`
  * `ProductTable`
    * `ProductCategoryRow`
    * `ProductRow`

## Step 2: React로 정적인 버전 구현하기 {/*step-2-build-a-static-version-in-react*/}

이제 컴포넌트 계층구조가 만들어졌으니, 앱을 실제로 구현해 볼 시간입니다. 가장 쉬운 접근 방법은 상호작용 기능은 아직 추가하지 않고 데이터 모델로부터 UI를 렌더링하는 버전을 만드는 것입니다. 대체로 먼저 정적인 버전을 만들고 상호작용 기능을 추가하는 게 더 쉽습니다. 정적 버전을 만드는 것은 많은 타이핑이 필요하지만, 생각할 것은 적으며, 반대로 상호작용 기능을 추가하는 것은 많은 생각이 필요하지만, 타이핑은 그리 많이 필요하지 않습니다.

데이터 모델을 렌더링하는 앱의 정적인 버전을 만들기 위해 다른 컴포넌트를 재사용하고 [props](/learn/passing-props-to-a-component)를 이용하여 데이터를 넘겨주는 [컴포넌트](/learn/your-first-component)를 구현할 수 있습니다. props는 부모가 자식에게 데이터를 넘겨줄 때 사용할 수 있는 방법입니다. (혹시 [state](/learn/state-a-components-memory) 개념에 익숙하다고 해도 정적인 버전을 만드는 데는 state를 쓰지 마세요! state는 오직 상호작용을 위해, 즉 시간이 지남에 따라 데이터가 바뀌는 것에 사용합니다. 우리는 앱의 정적 버전을 만들고 있기 때문에 지금은 필요하지 않습니다.)

앱을 만들 때 계층 구조에 따라 상층부에 있는 컴포넌트 (즉 `FilterableProductTable`부터 시작하는 것)부터 하향식(top-down)으로 만들거나 혹은 하층부에 있는 컴포넌트 (`ProductRow`)부터 상향식(bottom-up)으로 만들 수 있습니다. 간단한 예시에서는 보통 하향식으로 만드는 게 쉽지만, 프로젝트가 커지면 상향식으로 만들고 테스트를 작성하면서 개발하기가 더 쉽습니다.

<Sandpack>

```jsx src/App.js
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

(위 코드가 어렵게 느껴진다면, [Quick Start](/learn)를 먼저 참고하세요!)

이 단계가 끝나면 데이터 렌더링을 위해 만들어진 재사용 가능한 컴포넌트들의 라이브러리를 가지게 됩니다. 현재는 앱의 정적 버전이기 때문에 컴포넌트는 단순히 JSX만 리턴합니다. 계층구조의 최상단 컴포넌트 (FilterableProductTable)는 prop으로 데이터 모델을 받습니다. 이는 데이터가 최상단 컴포넌트부터 트리의 맨 아래까지 흘러가기 때문에 `단방향 데이터 흐름`이라고 부릅니다.

<Pitfall>

여기까지는 아직 state값을 쓰지 마세요. 다음 단계에서 사용할 겁니다!

</Pitfall>

## Step 3: 최소한의 데이터만 이용해서 완벽하게 UI State 표현하기 {/*step-3-find-the-minimal-but-complete-representation-of-ui-state*/}

UI를 상호작용(interactive)하게 만들려면 사용자가 기반 데이터 모델을 변경할 수 있게 해야 합니다. React는 *state*를 통해 기반 데이터 모델을 변경할 수 있게 합니다.

state는 앱이 기억해야 하는, 변경할 수 있는 데이터의 최소 집합이라고 생각하세요. state를 구조화하는 데 가장 중요한 원칙은 [중복배제원칙(Don't Repeat Yourself)](https://ko.wikipedia.org/wiki/%EC%A4%91%EB%B3%B5%EB%B0%B0%EC%A0%9C)입니다. 애플리케이션이 필요로 하는 가장 최소한의 state를 파악하고 나머지 모든 것들은 필요에 따라 실시간으로 계산하세요. 예를 들어, 쇼핑 리스트를 만든다고 하면 당신은 배열에 상품 아이템들을 넣을 겁니다. UI에 상품 아이템의 개수를 노출하고 싶다고 하면 상품 아이템 개수를 따로 state 값으로 가지는 게 아니라 단순하게 배열의 길이만 쓰면 됩니다.

예시 애플리케이션 내 데이터들을 생각해 봅시다. 애플리케이션은 다음과 같은 데이터를 가지고 있습니다.

1. 제품의 원본 목록
2. 사용자가 입력한 검색어
3. 체크박스의 값
4. 필터링된 제품 목록

이 중 어떤 게 state가 되어야 할까요? 아래의 세 가지 질문을 통해 결정할 수 있습니다.

- **시간이 지나도 변하지 않나요?** 그러면 확실히 state가 아닙니다.
- **부모로부터 props를 통해 전달됩니까?** 그러면 확실히 state가 아닙니다.
- 컴포넌트 안의 다른 state나 props를 가지고 **계산 가능한가요?** 그렇다면 *절대로* state가 아닙니다!

그 외 남는 건 아마 state일 겁니다.

위 데이터들을 다시 한번 순서대로 살펴봅시다.

1. 제품의 원본 목록은 **props로 전달되었기 때문에 state가 아닙니다**.
2. 사용자가 입력한 검색어는 시간이 지남에 따라 변하고, 다른 요소로부터 계산될 수 없기 때문에 state로 볼 수 있습니다.
3. 체크박스의 값은 시간에 따라 바뀌고 다른 요소로부터 계산될 수 없기 때문에 state로 볼 수 있습니다
4. 필터링된 제품 목록은 원본 제품 목록을 받아서 검색어와 체크박스의 값에 따라 **계산할 수 있으므로, 이는 state가 아닙니다.**

따라서, 검색어와 체크박스의 값만이 state입니다! 잘하셨습니다!

<DeepDive>

#### Props vs State {/*props-vs-state*/}

React는 props와 state라는 두 개의 데이터 "모델"이 존재합니다. 둘의 성격은 매우 다릅니다.

- [**Props**는 함수를 통해 전달되는 인자 같은 성격을 가집니다.](/learn/passing-props-to-a-component) props는 부모 컴포넌트로부터 자식 컴포넌트로 데이터를 넘겨서 외관을 커스터마이징하게 해줍니다. 예를 들어, `Form`은 color라는 prop을 `Button`으로 보내서 `Button`을 내가 원하는 형태로 커스터마이징시킬 수 있습니다..
- [**State**는 컴포넌트의 메모리 같은 성격을 가집니다.](/learn/state-a-components-memory) state는 컴포넌트가 몇몇 정보를 계속 따라갈 수 있게 해주고 변화하면서 상호작용(interaction)을 만들어 냅니다. 예를 들어, `Button`은 `isHovered`라는 state를 따라갈 것입니다.

props와 state는 다르지만, 함께 동작합니다. state는 보통 부모 컴포넌트에 저장됩니다. ( 그래서 부모 컴포넌트는 그 state를 변경할 수 있습니다. ) 그리고 부모 컴포넌트는 state를 자식 컴포넌트에 props로서 전달합니다. 처음 봤을 때 둘의 차이를 잘 알기 어려워도 괜찮습니다. 약간 연습이 필요할 거예요!

</DeepDive>

## Step 4: State가 어디에 있어야 할 지 정하기 {/*step-4-identify-where-your-state-should-live*/}

이제 앱에서 최소한으로 필요한 state를 결정했습니다. 다음으로는 어떤 컴포넌트가 이 state를 소유하고, 변경할 책임을 지게 할 지 정해야 합니다. React는 항상 컴포넌트 계층구조를 따라 부모에서 자식으로 데이터를 전달하는 단방향 데이터 흐름을 사용하는 것을 기억하세요! 앱을 구현하면서 어떤 컴포넌트가 state를 가져야 하는 지 바로 명확하지 않을 수 있습니다. 이 개념이 처음이라면 더 어려울 수 있습니다. 그러나 아래의 과정을 따라가면 해결할 수 있습니다.

애플리케이션의 각 state에 대해서,

1. 해당 state를 기반으로 렌더링하는 모든 컴포넌트를 찾으세요.
2. 그들의 가장 가까운 공통되는 부모 컴포넌트를 찾으세요. - 계층에서 모두를 포괄하는 상위 컴포넌트
3. state가 어디에 위치 돼야 하는지 결정합시다
   1. 대개, 공통 부모에 state를 그냥 두면 됩니다.
   2. 혹은, 공통 부모 상위의 컴포넌트에 둬도 됩니다.
   3. state를 소유할 적절한 컴포넌트를 찾지 못하였다면, state를 소유하는 컴포넌트를 하나 만들어서 상위 계층에 추가하세요.

이전 단계에서, 이 애플리케이션의 두 가지 state인 사용자의 검색어 입력과 체크박스의 값을 발견하였습니다. 이 예제에서 그들은 항상 함께 나타나기 때문에 같은 위치에 두는 것이 합리적입니다.

이제 이 전략을 애플리케이션에 적용해 봅시다.

1. **state를 쓰는 컴포넌트를 찾아봅시다**:
   - `ProductTable`은 state에 기반한 상품 리스트를 필터링해야 합니다 (검색어와 체크 박스의 값)
   - `SearchBar`는 state를 표시해 주어야 합니다. (검색어와 체크 박스의 값)
2. **공통 부모를 찾아봅시다**: 둘 모두가 공유하는 첫 번째 부모는 `FilterableProductTable`입니다
3. **어디에 state가 존재해야 할지 정해봅시다**: 우리는`FilterableProductTable`에 검색어와 체크 박스 값을 state로 둘 겁니다.

이제 state 값은 `FilterableProductTable`안에 있습니다.

[`useState()` Hook](/apis/usestate)을 이용해서 state를 컴포넌트에 추가하세요. Hooks는 React 기능에 "연결할 수(hook into)" 있게 해주는 특별한 함수입니다. `FilterableProductTable`의 상단에 두 개의 state 변수를 추가해서 초깃값을 명확하게 보여주세요.

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

이제 애플리케이션이 어떻게 동작하는지 알 수 있습니다. `filterText`의 초깃값을 `useState('')`에서 `useState('fruit')`로 수정해 보세요. 검색창과 데이터 테이블이 모두 업데이트됨을 확인할 수 있습니다.

<Sandpack>

```jsx src/App.js
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

아직 폼을 수정하는 작업이 작동하지 않음을 유의하세요. 위의 샌드박스에서 콘솔 에러가 발생하고 그 이유를 설명하겠습니다.

현재 `onChange` 핸들러 없이 폼의 필드에 `value` prop을 전달하였습니다. 이렇게 하면 읽기 전용 필드가 렌더링 됩니다.

위에 있는 샌드박스를 보면, `ProductTable`와 `SearchBar`가 `filterText`와 `inStockOnly` props를 table, input과 체크 박스를 렌더하기 위해서 읽고 있습니다. 예를 들면, `SearchBar` input의 value를 아래와 같이 채우고 있습니다.

```js {1,6}
function SearchBar({ filterText, inStockOnly }) {
  return (
    <form>
      <input 
        type="text" 
        value={filterText} 
        placeholder="Search..."/>
```

그러나 아직 사용자의 키보드 입력과 같은 행동에 반응하는 코드는 작성하지 않았습니다. 이 과정은 마지막 단계에서 진행할 예정입니다.

## Step 5: 역 데이터 흐름 추가하기 {/*step-5-add-inverse-data-flow*/}

지금까지 우리는 계층 구조 아래로 흐르는 props와 state의 함수로써 앱을 만들었습니다. 이제 사용자 입력에 따라 state를 변경하려면 반대 방향의 데이터 흐름을 만들어야 합니다. 이를 위해서는 계층 구조의 하단에 있는 컴포넌트에서 `FilterableProductTable`의 state를 업데이트할 수 있어야 합니다.

React는 데이터 흐름을 명시적으로 보이게 만들어 줍니다. 그러나 이는 전통적인 양방향 데이터 바인딩보다 조금 더 많은 타이핑이 필요합니다.

4단계의 예시에서 체크하거나 키보드를 타이핑할 경우 UI의 변화가 없고 입력을 무시하는 것을 확인할 수 있습니다. 이건 의도적으로 `<input value={filterText} />`로 코드를 쓰면서 `value`라는 prop이 항상`FilterableProductTable`의 `filterText`라는 state를 통해서 데이터를 받도록 정했기 때문입니다. `filterText`라는 state가 변경되는 게 아니기 때문에 input의 `value`는 변하지 않고 화면도 바뀌는 게 없습니다.

우리는 사용자가 input을 변경할 때마다 사용자의 입력을 반영할 수 있도록 state를 업데이트하기를 원합니다. state는 `FilterableProductTable`이 가지고 있고 state 변경을 위해서는 `setFilterText`와 `setInStockOnly`를 호출을 하면 됩니다. `SearchBar`가 `FilterableProductTable`의 state를 업데이트할 수 있도록 하려면, 이 함수들을 `SearchBar`로 전달해야 합니다.

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

`SearchBar`에서 `onChange` 이벤트 핸들러를 추가하여 부모 state를 변경할 수 있도록 구현할 수 있습니다.

```js {4,5,13,19}
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
        value={filterText}
        placeholder="Search..."
        onChange={(e) => onFilterTextChange(e.target.value)}
      />
      <label>
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => onInStockOnlyChange(e.target.checked)}
```

이제 애플리케이션이 완전히 동작합니다!

<Sandpack>

```jsx src/App.js
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