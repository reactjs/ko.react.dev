---
title: 컴포넌트 간 State 공유하기
---

<Intro>

때때로 두 컴포넌트의 state가 항상 함께 변경되기를 원할 수 있습니다. 그렇게 하려면 각 컴포넌트에서 state를 제거하고 가장 가까운 공통의 부모 컴포넌트로 옮긴 후 props로 전달해야 합니다. 이 방법을 *State 끌어올리기*라고 하며 React 코드를 작성할 때 가장 흔히 하는 일 중 하나입니다.

</Intro>

<YouWillLearn>

- State 끌어올리기를 통해 컴포넌트 간 state를 공유하는 방법
- 제어 컴포넌트와 비제어 컴포넌트

</YouWillLearn>

## State 끌어올리기 예제 {/*lifting-state-up-by-example*/}

예시에서는 부모 컴포넌트인 `Accordion`이 두 개의 `Panel`을 렌더링합니다.

* `Accordion`
  - `Panel`
  - `Panel`

각 `Panel` 컴포넌트는 콘텐츠 표시 여부를 결정하는 Boolean형 `isActive` 상태를 가집니다.

각 패널의 Show 버튼을 눌러봅시다.

<Sandpack>

```js
import { useState } from 'react';

function Panel({ title, children }) {
  const [isActive, setIsActive] = useState(false);
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={() => setIsActive(true)}>
          Show
        </button>
      )}
    </section>
  );
}

export default function Accordion() {
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel title="About">
        With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel title="Etymology">
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

한 패널의 버튼을 눌러도 다른 패널에는 영향을 미치지 않고 독립적입니다.

<DiagramGroup>

<Diagram name="sharing_state_child" height={367} width={477} alt="Diagram showing a tree of three components, one parent labeled Accordion and two children labeled Panel. Both Panel components contain isActive with value false.">

Initially, each `Panel`'s `isActive` state is `false`, so they both appear collapsed

</Diagram>

<Diagram name="sharing_state_child_clicked" height={367} width={480} alt="The same diagram as the previous, with the isActive of the first child Panel component highlighted indicating a click with the isActive value set to true. The second Panel component still contains value false." >

Clicking either `Panel`'s button will only update that `Panel`'s `isActive` state alone

</Diagram>

</DiagramGroup>

**그러나 이제 한 번에 하나의 패널만 열리도록 변경하려고 합니다.** 두 번째 패널을 열기 위해선 첫 번째 패널을 닫아야 합니다. 어떻게 해야 할까요?

두 패널을 조정하려면 다음 세 단계를 통해 부모 컴포넌트로 패널의 "State 끌어올리기"가 필요합니다.

1. 자식 컴포넌트의 state를 **제거**합니다.
2. 하드 코딩된 값을 공통의 부모로부터 **전달**합니다.
3. 공통의 부모에 state를 **추가**하고 이벤트 핸들러와 함께 전달합니다.

이 방법으로 `Accordion` 컴포넌트가 두 `Panel`을 조정하고 한 번에 하나만 열리도록 할 수 있습니다.

### Step 1: 자식 컴포넌트에서 state 제거하기 {/*step-1-remove-state-from-the-child-components*/}

`Panel`의 `isActive`에 대한 제어권을 부모 컴포넌트에 줄 수 있습니다. 즉 부모 컴포넌트는 `isActive`를 `Panel`에 prop으로 전달합니다. 다음 줄을 `Panel` 컴포넌트에서 제거하는 것으로 시작해봅시다.

```js
const [isActive, setIsActive] = useState(false);
```

대신 `Panel`의 prop 목록에 `isActive`를 추가합니다.

```js
function Panel({ title, children, isActive }) {
```

<<<<<<< HEAD:beta/src/pages/learn/sharing-state-between-components.md
이제 `Panel`의 부모 컴포넌트는 [props 내리꽂기](/learn/passing-props-to-a-component)를 통해 `isActive`를 제어할 수 있습니다. 반대로 `Panel` 컴포넌트는 `isActive`를 제어할 수 없습니다. 이제 부모 컴포넌트에 달려 있습니다.
=======
Now the `Panel`'s parent component can *control* `isActive` by [passing it down as a prop.](/learn/passing-props-to-a-component) Conversely, the `Panel` component now has *no control* over the value of `isActive`--it's now up to the parent component!
>>>>>>> 841d3d1b75491ce153a53d1887ab020458090bbd:beta/src/content/learn/sharing-state-between-components.md

### Step 2: 하드 코딩된 데이터를 부모 컴포넌트로 전달하기 {/*step-2-pass-hardcoded-data-from-the-common-parent*/}

state를 올리려면, 조정하려는 *두* 자식 컴포넌트의 가장 가까운 공통 부모 컴포넌트에 두어야 합니다.

* `Accordion` *(가장 가까운 공통 부모)*
  - `Panel`
  - `Panel`

예시에서는 `Accordion` 컴포넌트입니다. 이 컴포넌트는 두 패널의 상위에 있고 props를 제어할 수 있기 때문에 현재 어느 패널이 활성화되었는지에 대한 "진리의 원천(source of truth)"이 됩니다. `Accordion` 컴포넌트가 하드 코딩된 값을 가지는 `isActive`를 (예를 들면 `true`)  두 패널에 전달하도록 만듭니다.

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel title="About" isActive={true}>
        With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel title="Etymology" isActive={true}>
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}

function Panel({ title, children, isActive }) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={() => setIsActive(true)}>
          Show
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

`Accordion` 컴포넌트에서 하드 코딩된 `isActive` 값을 변경하고 화면에 표시되는 결과를 확인해보세요.

### Step 3: 공통 부모에 state 추가하기 {/*step-3-add-state-to-the-common-parent*/}

상태 끌어올리기는 종종 state로 저장하고 있는 것의 특성을 바꿉니다.

In this case, only one panel should be active at a time. This means that the `Accordion` common parent component needs to keep track of *which* panel is the active one. Instead of a `boolean` value, it could use a number as the index of the active `Panel` for the state variable:

```js
const [activeIndex, setActiveIndex] = useState(0);
```

`activeIndex`가 `0`이면 첫 번째 패널이 활성화된 것이고, `1`이면 두 번째 패널이 활성화된 것입니다.

각 `Panel`에서 "Show 버튼을 클릭하면 `Accordion`의 활성화된 인덱스를 변경해야 합니다. `activeIndex` state는 `Accordion` 내에서 정의되었기 때문에 `Panel`은 값을 직접 설정할 수 없습니다. `Accordion` 컴포넌트는 `Panel` 컴포넌트가 state를 변경할 수 있음을 [이벤트 핸들러를 prop으로 전달하기](/learn/responding-to-events#passing-event-handlers-as-props)를 통해 *명시적으로 허용*해야 합니다.

```js
<>
  <Panel
    isActive={activeIndex === 0}
    onShow={() => setActiveIndex(0)}
  >
    ...
  </Panel>
  <Panel
    isActive={activeIndex === 1}
    onShow={() => setActiveIndex(1)}
  >
    ...
  </Panel>
</>
```

이제 `Panel` 내의 `<button>`은 `onShow` prop을 클릭 이벤트 핸들러로 사용할 수 있습니다.

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel
        title="About"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel
        title="Etymology"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}

function Panel({
  title,
  children,
  isActive,
  onShow
}) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={onShow}>
          Show
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

이렇게 상태 끌어올리기가 완성됩니다! state를 공통 부모 컴포넌트로 옮기는 것은 두 패널을 조정할 수 있게 합니다. 두 개의 "보임" 플래그 대신 활성화된 인덱스를 사용하는 것은 한 번에 하나의 패널만 활성화됨을 보장합니다. 그리고 자식 컴포넌트로 이벤트 핸들러를 전달하는 것은 자식 컴포넌트에서 부모의 상태를 변경할 수 있게 합니다.

<DiagramGroup>

<Diagram name="sharing_state_parent" height={385} width={487} alt="Diagram showing a tree of three components, one parent labeled Accordion and two children labeled Panel. Accordion contains an activeIndex value of zero which turns into isActive value of true passed to the first Panel, and isActive value of false passed to the second Panel." >

Initially, `Accordion`'s `activeIndex` is `0`, so the first `Panel` receives `isActive = true`

</Diagram>

<Diagram name="sharing_state_parent_clicked" height={385} width={521} alt="The same diagram as the previous, with the activeIndex value of the parent Accordion component highlighted indicating a click with the value changed to one. The flow to both of the children Panel components is also highlighted, and the isActive value passed to each child is set to the opposite: false for the first Panel and true for the second one." >

When `Accordion`'s `activeIndex` state changes to `1`, the second `Panel` receives `isActive = true` instead

</Diagram>

</DiagramGroup>

<<<<<<< HEAD:beta/src/pages/learn/sharing-state-between-components.md
<DeepDive title="제어와 비제어 컴포넌트">
=======
<DeepDive title="Controlled and uncontrolled components">
>>>>>>> 841d3d1b75491ce153a53d1887ab020458090bbd:beta/src/content/learn/sharing-state-between-components.md

"제어되지 않은" 몇몇 지역 state를 갖는 컴포넌트를 사용하는 것은 흔한 일입니다. 예를 들어 `isActive` state를 갖는 원래의 `Panel` 컴포넌트는 해당 컴포넌트의 부모에서 패널의 활성화 여부에 영향을 줄 수 없기 때문에 제어되지 않습니다.

반대로 컴포넌트의 중요한 정보가 자체 지역 state 대신 props에 의해 만들어지는 경우 컴포넌트가 "제어된다"고 합니다. 이를 통해 부모 컴포넌트가 동작을 완전히 지정할 수 있습니다. `isActive` prop을 갖는 최종 `Panel` 컴포넌트는 `Accordion` 컴포넌트에 의해 제어됩니다.

비제어 컴포넌트는 설정할 것이 적어 부모 컴포넌트에서 사용하기 더 쉽습니다. 하지만 여러 컴포넌트를 함께 조정하려고 할 때 비제어 컴포넌트는 덜 유연합니다. 제어 컴포넌트는 최대한으로 유연하지만, 부모 컴포넌트에서 props로 충분히 설정해주어야 합니다.

실제로 "제어"와 "비제어"는 엄격한 기술 용어가 아니며 일반적으로 컴포넌트는 지역 state와 props를 혼합해서 사용합니다. 그러나 이런 구분은 컴포넌트의 설계와 제공하는 기능에 관해 설명하는데 유용한 방법입니다.

컴포넌트를 작성할 때 어떤 정보가 (props를 통해) 제어되어야 하고 어떤 정보가 (state를 통해) 제어되지 않아야 하는지 고려하세요. 그렇지만 언제든 마음이 바뀔 수 있고 나중에 리팩토링 할 수 있습니다.

</DeepDive>

## 각 state의 단일 진리의 원천 {/*a-single-source-of-truth-for-each-state*/}

리액트 애플리케이션에서 많은 컴포넌트는 자체 state를 가집니다. 일부 상태는 입력처럼 리프 컴포넌트(트리 맨 아래에 있는 컴포넌트)와 가깝게 "생존"합니다. 다른 상태는 앱의 상단에 더 가깝게 "생존"할 수 있습니다. 예를 들면 클라이언트 측 라우팅 라이브러리도 현재 경로를 리액트 state로 저장하고 props로 전달하도록 구현되어 있습니다!

<<<<<<< HEAD:beta/src/pages/learn/sharing-state-between-components.md
**각각의 고유한 state에 대해 어떤 컴포넌트가 "소유"할지 고를 수 있습니다.** 이 원칙은 또한 ["단일 진리의 원천"](https://en.wikipedia.org/wiki/Single_source_of_truth) 을 갖는 것으로 알려져 있습니다. 이는 모든 state가 한 곳에 존재한다는 의미가 아니라 그 정보를 가지고 있는 _특정_ 컴포넌트가 있다는 것을 말합니다. 컴포넌트 간의 공유된 state를 중복하는 대신 그들의 공통 부모로 *끌어올리고* 필요한 자식에게 *전달*하세요.
=======
**For each unique piece of state, you will choose the component that "owns" it.** This principle is also known as having a ["single source of truth".](https://en.wikipedia.org/wiki/Single_source_of_truth) It doesn't mean that all state lives in one place--but that for _each_ piece of state, there is a _specific_ component that holds that piece of information. Instead of duplicating shared state between components, you will *lift it up* to their common shared parent, and *pass it down* to the children that need it.
>>>>>>> 841d3d1b75491ce153a53d1887ab020458090bbd:beta/src/content/learn/sharing-state-between-components.md

작업이 진행되면서 애플리케이션은 계속 변합니다. 각 state가 어디에 "생존"해야 할지 고민하는 동안 state를 아래로 이동하거나 다시 올리는 것은 흔히 있는 일입니다. 이건 모두 과정의 일부입니다!

<<<<<<< HEAD:beta/src/pages/learn/sharing-state-between-components.md
컴포넌트를 몇 개 더 사용하여 어떤 느낌인지 알아보려면 [React로 사고하기](/learn/thinking-in-react)를 읽어보세요.
=======
To see what this feels like in practice with a few more components, read [Thinking in React.](/learn/thinking-in-react)
>>>>>>> 841d3d1b75491ce153a53d1887ab020458090bbd:beta/src/content/learn/sharing-state-between-components.md

<Recap>

* 두 컴포넌트를 조정하고 싶을 때 state를 그들의 공통 부모로 이동합니다.
* 그리고 공통 부모로부터 props를 통해 정보를 전달합니다.
* 마지막으로 이벤트 핸들러를 전달해 자식에서 부모의 state를 변경할 수 있도록 합니다.
* 컴포넌트를 (props로부터) "제어"할지 (state로부터) "비제어" 할지 고려하면 유용합니다.

</Recap>

<Challenges>

<<<<<<< HEAD:beta/src/pages/learn/sharing-state-between-components.md
### 동기화된 입력 {/*synced-inputs*/}
=======
#### Synced inputs {/*synced-inputs*/}
>>>>>>> 841d3d1b75491ce153a53d1887ab020458090bbd:beta/src/content/learn/sharing-state-between-components.md

아래 두 입력은 독립적입니다. 두 입력의 동기화 상태를 유지하세요. 한 입력을 수정하면 다른 입력도 같은 문구로 변경되어야 하며 반대 경우도 동일합니다.

<Hint>

state를 부모 컴포넌트로 끌어올려야 합니다.

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function SyncedInputs() {
  return (
    <>
      <Input label="First input" />
      <Input label="Second input" />
    </>
  );
}

function Input({ label }) {
  const [text, setText] = useState('');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <label>
      {label}
      {' '}
      <input
        value={text}
        onChange={handleChange}
      />
    </label>
  );
}
```

```css
input { margin: 5px; }
label { display: block; }
```

</Sandpack>

<Solution>

`text` state를 `handleChange` 핸들러와 함께 부모 컴포넌트로 옮기고 두 `Input` 컴포넌트에 props로 전달하세요. 이는 두 컴포넌트의 입력이 동기화를 유지하게 합니다.

<Sandpack>

```js
import { useState } from 'react';

export default function SyncedInputs() {
  const [text, setText] = useState('');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <Input
        label="First input"
        value={text}
        onChange={handleChange}
      />
      <Input
        label="Second input"
        value={text}
        onChange={handleChange}
      />
    </>
  );
}

function Input({ label, value, onChange }) {
  return (
    <label>
      {label}
      {' '}
      <input
        value={value}
        onChange={onChange}
      />
    </label>
  );
}
```

```css
input { margin: 5px; }
label { display: block; }
```

</Sandpack>

</Solution>

<<<<<<< HEAD:beta/src/pages/learn/sharing-state-between-components.md
### 목록 필터링하기 {/*filtering-a-list*/}
=======
#### Filtering a list {/*filtering-a-list*/}
>>>>>>> 841d3d1b75491ce153a53d1887ab020458090bbd:beta/src/content/learn/sharing-state-between-components.md

예시에서 `SearchBar`는 텍스트 입력을 제어하는 자체 `query` state를 가집니다. 부모 컴포넌트 `FilterableList`는 `List`의 목록을 표시하지만 검색 질의를 고려하지 않습니다.

검색 질의에 따라 목록을 필터링하도록 `filterItems(foods, query)` 함수를 사용하세요. 수정한 것을 테스트하려면 검색창에 "s"를 입력했을 때 "Sushi", "Shish kebab", "Dim sum"이 목록에 표시되는지 확인하세요.

`filterItems`은 이미 구현 및 가져오기가 되었으므로 직접 작성할 필요가 없습니다!

<Hint>

`query` state와 `handleChange` 핸들러를 `SearchBar`에서 제거한 후 `FilterableList`로 이동해야 합니다. 그런 다음 `SearchBar`에 `query`와 `onChange` props로 전달합니다.

</Hint>

<Sandpack>

```js
import { useState } from 'react';
import { foods, filterItems } from './data.js';

export default function FilterableList() {
  return (
    <>
      <SearchBar />
      <hr />
      <List items={foods} />
    </>
  );
}

function SearchBar() {
  const [query, setQuery] = useState('');

  function handleChange(e) {
    setQuery(e.target.value);
  }

  return (
    <label>
      Search:{' '}
      <input
        value={query}
        onChange={handleChange}
      />
    </label>
  );
}

function List({ items }) {
  return (
    <table>
<<<<<<< HEAD:beta/src/pages/learn/sharing-state-between-components.md
      {items.map(food => (
        <tr key={food.id}>
          <td>{food.name}</td>
          <td>{food.description}</td>
        </tr>
      ))}
=======
      <tbody>
        {items.map(food => (
          <tr key={food.id}>
            <td>{food.name}</td>
            <td>{food.description}</td>
          </tr>
        ))}
      </tbody>
>>>>>>> 841d3d1b75491ce153a53d1887ab020458090bbd:beta/src/content/learn/sharing-state-between-components.md
    </table>
  );
}
```

```js data.js
export function filterItems(items, query) {
  query = query.toLowerCase();
  return items.filter(item =>
    item.name.split(' ').some(word =>
      word.toLowerCase().startsWith(query)
    )
  );
}

export const foods = [{
  id: 0,
  name: 'Sushi',
  description: 'Sushi is a traditional Japanese dish of prepared vinegared rice'
}, {
  id: 1,
  name: 'Dal',
  description: 'The most common way of preparing dal is in the form of a soup to which onions, tomatoes and various spices may be added'
}, {
  id: 2,
  name: 'Pierogi',
  description: 'Pierogi are filled dumplings made by wrapping unleavened dough around a savoury or sweet filling and cooking in boiling water'
}, {
  id: 3,
  name: 'Shish kebab',
  description: 'Shish kebab is a popular meal of skewered and grilled cubes of meat.'
}, {
  id: 4,
  name: 'Dim sum',
  description: 'Dim sum is a large range of small dishes that Cantonese people traditionally enjoy in restaurants for breakfast and lunch'
}];
```

</Sandpack>

<Solution>

`query` state를 `FilterableList` 컴포넌트로 끌어올리세요. 필터링 된 목록을 얻기 위해 `filterItems(foods, query)` 를 호출하고 그 값을 `List`로 전달하세요. 이제 질의 입력값은 목록에 반영됩니다.

<Sandpack>

```js
import { useState } from 'react';
import { foods, filterItems } from './data.js';

export default function FilterableList() {
  const [query, setQuery] = useState('');
  const results = filterItems(foods, query);

  function handleChange(e) {
    setQuery(e.target.value);
  }

  return (
    <>
      <SearchBar
        query={query}
        onChange={handleChange}
      />
      <hr />
      <List items={results} />
    </>
  );
}

function SearchBar({ query, onChange }) {
  return (
    <label>
      Search:{' '}
      <input
        value={query}
        onChange={onChange}
      />
    </label>
  );
}

function List({ items }) {
  return (
    <table>
<<<<<<< HEAD:beta/src/pages/learn/sharing-state-between-components.md
      {items.map(food => (
        <tr key={food.id}>
          <td>{food.name}</td>
          <td>{food.description}</td>
        </tr>
      ))}
=======
      <tbody> 
        {items.map(food => (
          <tr key={food.id}>
            <td>{food.name}</td>
            <td>{food.description}</td>
          </tr>
        ))}
      </tbody>
>>>>>>> 841d3d1b75491ce153a53d1887ab020458090bbd:beta/src/content/learn/sharing-state-between-components.md
    </table>
  );
}
```

```js data.js
export function filterItems(items, query) {
  query = query.toLowerCase();
  return items.filter(item =>
    item.name.split(' ').some(word =>
      word.toLowerCase().startsWith(query)
    )
  );
}

export const foods = [{
  id: 0,
  name: 'Sushi',
  description: 'Sushi is a traditional Japanese dish of prepared vinegared rice'
}, {
  id: 1,
  name: 'Dal',
  description: 'The most common way of preparing dal is in the form of a soup to which onions, tomatoes and various spices may be added'
}, {
  id: 2,
  name: 'Pierogi',
  description: 'Pierogi are filled dumplings made by wrapping unleavened dough around a savoury or sweet filling and cooking in boiling water'
}, {
  id: 3,
  name: 'Shish kebab',
  description: 'Shish kebab is a popular meal of skewered and grilled cubes of meat.'
}, {
  id: 4,
  name: 'Dim sum',
  description: 'Dim sum is a large range of small dishes that Cantonese people traditionally enjoy in restaurants for breakfast and lunch'
}];
```

</Sandpack>

</Solution>

</Challenges>
