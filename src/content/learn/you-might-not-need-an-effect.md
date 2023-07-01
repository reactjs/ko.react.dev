---
title: 'Effect가 필요하지 않을 수도 있습니다'
---

<Intro>

Effect는 React 패러다임에서 벗어날 수 있는 탈출구입니다. Effect를 사용하면 React를 "벗어나" 컴포넌트를 React가 아닌 위젯, 네트워크, 또는 브라우저 DOM과 같은 외부 시스템과 동기화할 수 있습니다. 외부 시스템이 관여하지 않는 경우 (예를 들어 일부 props 또는 state가 변경될 때 컴포넌트의 state를 업데이트하려는 경우), Effect가 필요하지 않습니다. 불필요한 Effect를 제거하면 코드를 더 쉽게 따라갈 수 있고, 실행 속도가 빨라지며, 에러 발생 가능성이 줄어듭니다.

</Intro>

<YouWillLearn>

* 컴포넌트에서 불필요한 Effect를 제거하는 이유와 방법
* Effect 없이 값비싼 계산을 캐시하는 방법
* Effect 없이 컴포넌트 state를 초기화하고 조정하는 방법
* 이벤트 핸들러 간에 로직을 공유하는 방법
* 이벤트 핸들러로 이동해야 하는 로직
* 부모 컴포넌트에 변경 사항을 알리는 방법

</YouWillLearn>

## 불필요한 Effect를 제거하는 방법 {/*how-to-remove-unnecessary-effects*/}

Effect가 필요하지 않은 두 가지 일반적인 경우가 있습니다.

* **렌더링을 위해 데이터를 변환하는 데 Effect가 필요하지 않습니다.** 예를 들어 리스트를 표시하기 전에 필터링하고 싶다고 가정해 보겠습니다. 리스트가 변경될 때 state 변수를 업데이트하는 Effect를 작성하고 싶을 수 있습니다. 하지만 이는 비효율적입니다. state를 업데이트할 때 React는 먼저 컴포넌트 함수를 호출해 화면에 표시될 내용을 계산합니다. 그런 다음 React는 이러한 변경 사항을 DOM에 ["commit"](/learn/render-and-commit)하여 화면을 업데이트합니다. 그리고 나서 React가 Effect를 실행합니다. 만약 Effect도 *즉시* state를 업데이트한다면 전체 프로세스가 처음부터 다시 시작됩니다! 불필요한 렌더링 패스를 피하려면, 컴포넌트의 최상위 레벨에서 모든 데이터를 변환하세요. 그러면 props나 state가 변경될 때마다 해당 코드가 자동으로 다시 실행됩니다.
* **사용자 이벤트를 핸들링하는 데 Effect가 필요하지 않습니다.** 예를 들어 사용자가 제품을 구매할 때 `/api/buy` POST 요청을 전송하고 알림을 표시하고 싶다고 가정해 보겠습니다. 구매 버튼 클릭 이벤트 핸들러에서는 정확히 어떤 일이 일어났는지 알 수 있습니다. Effect가 실행될 때까지 사용자가 무엇을 했는지 (예: 어떤 버튼을 클릭 했는지) 알 수 없습니다. 그렇기 때문에 일반적으로 해당되는 이벤트 핸들러에서 사용자 이벤트를 핸들링합니다.

외부 시스템과 [동기화](/learn/synchronizing-with-effects#what-are-effects-and-how-are-they-different-from-events)하려면 Effect가 *반드시* 필요합니다. 예를 들어 jQuery 위젯이 React state와 동기화되도록 유지하는 Effect를 작성할 수 있습니다. Effect로 데이터를 가져올 수도 있습니다: 예를 들어 검색 결과를 현재 검색 쿼리와 동기화할 수 있습니다. 모던 [프레임워크](/learn/start-a-new-react-project#production-grade-react-frameworks)는 컴포넌트에 직접 Effect를 작성하는 것보다 더 효율적인 내장 데이터 가져오기 메커니즘을 제공한다는 점을 명심하세요.

올바른 직관을 얻기 위해, 몇 가지 일반적이고 구체적인 예를 살펴봅시다!

### props 또는 state에 따라 state 업데이트하기 {/*updating-state-based-on-props-or-state*/}

`firstName`과 `lastName`이라는 두 개의 state 변수가 있다고 가정해 봅시다. 두 변수를 연결해서 `fullName`을 계산하고 싶습니다. 또한 `firstName`이나 `lastName`이 변경될 때마다 `fullName`이 업데이트되기를 바랍니다. 가장 먼저 `fullName` state 변수를 추가하고 Effect에서 업데이트하고 싶을 것입니다.

```js {5-9}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');

  // 🔴 피하세요: 중복된 state 및 불필요한 Effect
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
  // ...
}
```

이는 필요 이상으로 복잡합니다. 또한 `fullName`에 대한 오래된 값으로 전체 렌더링 패스를 수행한 다음, 업데이트된 값으로 즉시 다시 렌더링하기 때문에 비효율적입니다. state 변수와 Effect를 제거하세요.

```js {4-5}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  // ✅ 좋습니다: 렌더링 중에 계산됨
  const fullName = firstName + ' ' + lastName;
  // ...
}
```

**기존 props나 state에서 계산할 수 있는 것이 있으면 , [그것을 state에 넣지 마세요.](/learn/choosing-the-state-structure#avoid-redundant-state) 대신, 렌더링 중에 계산하게 하세요.** 이렇게 하면 코드가 더 빨라지고 (추가적인 "연속적인" 업데이트를 피할 수 있으며), 더 간단해지고 (일부 코드를 제거할 수 있으며), 에러가 덜 발생합니다(서로 다른 state 변수가 서로 동기화되지 않아 발생하는 버그를 피할 수 있습니다). 이 접근 방식이 생소하게 느껴진다면, [React로 사고하기](/learn/thinking-in-react#step-3-find-the-minimal-but-complete-representation-of-ui-state)에서 무엇이 state에 들어가야 하는지 설명해 줄 것입니다.

### 비용이 많이 드는 계산 캐싱하기 {/*caching-expensive-calculations*/}

이 컴포넌트는 props로 받은 `todos`를 `filter` prop에 따라 필터링하여 `visibleTodos`를 계산합니다. 결과를 state에 저장하고 Effect에서 업데이트하고 싶을 수 있습니다.

```js {4-8}
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');

  // 🔴 피하세요: 중복된 state 및 불필요한 효과
  const [visibleTodos, setVisibleTodos] = useState([]);
  useEffect(() => {
    setVisibleTodos(getFilteredTodos(todos, filter));
  }, [todos, filter]);

  // ...
}
```

앞의 예시와 마찬가지로, 이것은 불필요하고 비효율적입니다. 먼저, state와 Effect를 제거합니다.

```js {3-4}
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  // ✅ getFilteredTodos()가 느리지 않다면 괜찮습니다.
  const visibleTodos = getFilteredTodos(todos, filter);
  // ...
}
```

보통, 이 코드는 괜찮습니다! 하지만 `getFilteredTodos()`가 느리거나 `todos`가 많을 수도 있습니다. 이 경우 `newTodo`와 같이 관련 없는 state 변수가 변경된 경우 `getFilteredTodos()`를 다시 계산하고 싶지 않을 수 있습니다.

[`useMemo`](/reference/react/useMemo) Hook으로 래핑해서 값비싼 계산을 캐시(또는 ["메모이제이션"](https://ko.wikipedia.org/wiki/메모이제이션)) 할 수 있습니다.

```js {5-8}
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  const visibleTodos = useMemo(() => {
    // ✅ todos 또는 filter가 변경되지 않는 한 다시 실행되지 않습니다.
    return getFilteredTodos(todos, filter);
  }, [todos, filter]);
  // ...
}
```

혹은 한 줄로 작성할 수도 있습니다.

```js {5-6}
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  // ✅ todos나 filter가 변경되지 않는 한 getFilteredTodos()를 다시 실행하지 않습니다.
  const visibleTodos = useMemo(() => getFilteredTodos(todos, filter), [todos, filter]);
  // ...
}
```

**이렇게 하면 `todos`나 `filter`가 변경되지 않는 한 내부 함수가 다시 실행되지 않기를 원한다는 것을 React에게 알립니다.** React는 초기 렌더링 중에 `getFilteredTodos()`의 반환값을 기억합니다. 다음 렌더링 중에 `todos`나 `filter`가 다른지 확인합니다. 지난번과 동일하다면, `useMemo`는 마지막으로 저장한 결과를 반환합니다. 만약 다르다면, React는 내부 함수를 다시 호출하고 그 결과를 저장합니다.

[`useMemo`](/reference/react/useMemo)로 감싸는 함수는 렌더링 중에 실행되므로, [순수한 계산](/learn/keeping-components-pure)에만 작동합니다.

<DeepDive>

#### 계산이 비싼지 어떻게 알 수 있나요? {/*how-to-tell-if-a-calculation-is-expensive*/}

일반적으로 수천 개의 객체를 만들거나 반복하는 경우가 아니라면 비용이 많이 들지 않을 것입니다. 좀 더 확신을 얻고 싶다면 console log를 추가하여 코드에 소요된 시간을 측정할 수 있습니다.

```js {1,3}
console.time('filter array');
const visibleTodos = getFilteredTodos(todos, filter);
console.timeEnd('filter array');
```

측정하려는 상호작용을 수행합니다(예: input에 입력하기). 그러면 `filter array: 0.15ms`와 같은 로그가 console에 표시됩니다. 전체적으로 기록된 시간이 상당한 양(예: 1ms 이상)으로 합산되면 해당 계산을 메모이제이션하는 것이 좋습니다. 그런 다음 실험적으로 해당 계산을 `useMemo`로 감싸서 해당 상호작용에 대해 총 로깅 시간이 감소했는지를 확인할 수 있습니다.

```js
console.time('filter array');
const visibleTodos = useMemo(() => {
  return getFilteredTodos(todos, filter); // todos와 filter가 변경되지 않은 경우 건너뜁니다
}, [todos, filter]);
console.timeEnd('filter array');
```

`useMemo`는 *첫 번째* 렌더링을 더 빠르게 만들지 않습니다. 업데이트 시 불필요한 작업을 건너뛰는 데만 도움이 됩니다.

당신의 컴퓨터가 사용자의 컴퓨터보다 빠를 수 있으므로 인위적인 속도 저하로 성능을 테스트하는 것이 좋습니다. 예를 들어 Chrome은 이를 위해 [CPU 스로틀링](https://developer.chrome.com/blog/new-in-devtools-61/#throttling) 옵션을 제공합니다.

또한 개발 중에 성능을 측정하는 것은 가장 정확한 결과를 제공하지 않는다는 점에 유의하세요. (예를 들어 [Strict Mode](/reference/react/StrictMode)를 켜면 각 컴포넌트가 한 번이 아닌 두 번 렌더링 되는 것을 볼 수 있습니다.) 가장 정확한 시간을 얻으려면 프로덕션용 앱을 빌드하고 사용자가 사용하는 것과 같은 기기에서 테스트하세요.

</DeepDive>

### prop 변경 시 모든 state 초기화 {/*resetting-all-state-when-a-prop-changes*/}

이 `ProfilePage` 컴포넌트는 `userId` prop을 받습니다. 페이지는 댓글 입력을 포함하며 `comment` state 변수를 사용해 해당 값을 보관합니다. 어느 날 한 프로필에서 다른 프로필로 이동할 때 `comment` state가 재설정되지 않는 문제를 발견했습니다. 그 결과 실수로 잘못된 사용자의 프로필에 댓글을 게시하기 쉽습니다. 이 문제를 해결하기 위해 `userId`가 변경될 때마다 `comment` state 변수를 비우려고 합니다.

```js {4-7}
export default function ProfilePage({ userId }) {
  const [comment, setComment] = useState('');

  // 🔴 피하세요: Effect에서 prop 변경 시 state 초기화
  useEffect(() => {
    setComment('');
  }, [userId]);
  // ...
}
```

이는 비효율적인데 `ProfilePage`와 그 자식이 오래된 값으로 처음 렌더링 한 다음 다시 렌더링 하기 때문입니다. 또한 `ProfilePage` 내부에 어떤 state가 있는 *모든* 컴포넌트에서 이 작업을 수행해야 하므로 복잡합니다. 예를 들어 댓글 UI가 중첩된 경우 중첩된 댓글 state도 비워야 합니다.

대신 명시적인 key를 전달하여 각 사용자의 프로필이 개념적으로 _다른_ 프로필임을 React에 알릴 수 있습니다. 컴포넌트를 둘로 분할하고 외부 컴포넌트에서 내부 컴포넌트로 `key` 어트리뷰트를 전달하세요.

```js {5,11-12}
export default function ProfilePage({ userId }) {
  return (
    <Profile
      userId={userId}
      key={userId}
    />
  );
}

function Profile({ userId }) {
  // ✅ 이 state 및 아래의 다른 state는 key 변경 시 자동으로 재설정됩니다.
  const [comment, setComment] = useState('');
  // ...
}
```

일반적으로 React는 동일한 컴포넌트가 같은 위치에 렌더링 될 때 state를 보존합니다. **`Profile` 컴포넌트에 `userId`를 `key`로 전달하면 React가 `userId`가 다른 두 개의 `Profile` 컴포넌트를 state를 공유해서는 안 되는 두 개의 다른 컴포넌트로 취급하도록 요청하는 것입니다.** `userId`로 설정한 key가 변경될 때마다 React는 DOM을 다시 생성하고 `Profile` 컴포넌트와 그 모든 자식의 [state를 재설정](/learn/preserving-and-resetting-state#option-2-resetting-state-with-a-key)합니다. 이제 프로필 사이를 탐색할 때 `comment` 필드가 자동으로 비워집니다.

이 예제에서는 외부 `ProfilePage` 컴포넌트만 내보내 프로젝트의 다른 파일에 표시된다는 점에 유의하세요. `ProfilePage`를 렌더링 하는 컴포넌트는 key를 전달할 필요 없이 일반적인 prop로 `userId`를 전달합니다. `ProfilePage`가 이를 내부 `Profile` 컴포넌트에 `key`로 전달한다는 사실은 구현 세부 사항입니다.

### prop이 변경될 때 일부 state 조정하기 {/*adjusting-some-state-when-a-prop-changes*/}

prop이 변경될 때 전체가 아닌 일부 state만 재설정하거나 조정하고 싶을 때가 있습니다.

이 `List` 컴포넌트는 `items` 목록을 prop으로 받고 `selection` state 변수에 선택된 item을 유지합니다. `items` prop이 다른 배열을 받을 때마다 `selection`을 `null`로 재설정하고 싶습니다.

```js {5-8}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // 🔴 피하세요: Effect에서 prop 변경 시 state 조정하기
  useEffect(() => {
    setSelection(null);
  }, [items]);
  // ...
}
```

이것 역시 이상적이지 않습니다. `items`가 변경될 때마다 `List`와 그 자식 컴포넌트들은 처음에는 오래된 `selection` 값으로 렌더링됩니다. 그런 다음 React는 DOM을 업데이트하고 Effect를 실행합니다. 마지막으로 `setSelection(null)` 호출은 `List`와 그 자식 컴포넌트들을 다시 렌더링하여 이 전체 프로세스를 다시 시작하게 됩니다.

Effect를 삭제하는 것으로 시작하세요. 대신 렌더링 중에 직접 state를 조정하세요.

```js {5-11}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // 더 좋습니다: 렌더링 중 state 조정
  const [prevItems, setPrevItems] = useState(items);
  if (items !== prevItems) {
    setPrevItems(items);
    setSelection(null);
  }
  // ...
}
```

이렇게 [이전 렌더링의 정보를 저장하는 것](/reference/react/useState#storing-information-from-previous-renders)은 이해하기 어려울 수 있지만 Effect에서 동일한 state를 업데이트하는 것보다 낫습니다. 위 예시에서는 렌더링 도중 `setSelection`이 직접 호출됩니다. React는 `return` 문으로 종료된 후 *즉시* `List`를 다시 렌더링 합니다. React는 아직 `List` 자식을 렌더링 하거나 DOM을 업데이트하지 않았기 때문에 오래된 `selection` 값의 렌더링을 건너뛸 수 있습니다.

렌더링 도중 컴포넌트를 업데이트하면 React는 반환된 JSX를 버리고 즉시 렌더링을 다시 시도합니다. 매우 느린 연속적 재시도를 피하기 위해 React는 렌더링 중에 *동일한* 컴포넌트의 state만 업데이트할 수 있도록 합니다. 렌더링 도중 다른 컴포넌트의 state를 업데이트하면 에러가 발생합니다. 반복을 피하려면 `items !== prevItems`와 같은 조건이 필요합니다. 이런 식으로 state를 조정할 수는 있지만 [컴포넌트를 순수하게 유지](/learn/keeping-components-pure)하기 위해 DOM 변경이나 타임아웃 설정과 같은 다른 사이드 이펙트들은 이벤트 핸들러나 Effect에 남겨둬야 합니다.

**이 패턴이 Effect보다 더 효율적이지만 대부분의 컴포넌트에는 이 패턴이 필요하지 않습니다.** 어떻게 하든 props나 다른 state에 따라 state를 조정하면 데이터 흐름을 이해하고 디버깅하기가 더 어려워집니다. 대신 [key를 사용하여 모든 state를 초기화](#resetting-all-state-when-a-prop-changes)하거나 [렌더링 중에 모든 state를 계산](#updating-state-based-on-props-or-state)할 수 있는지 항상 확인하세요. 예를 들어 선택한 *item*을 저장(및 초기화)하는 대신 선택한 *item ID*를 저장할 수 있습니다.

```js {3-5}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  // ✅ 최고예요: 렌더링 중에 모든 것을 계산
  const selection = items.find(item => item.id === selectedId) ?? null;
  // ...
}
```

이제 state를 "조정"할 필요가 전혀 없습니다. 선택한 ID를 가진 item이 목록에 있으면 선택된 state로 유지됩니다. 그렇지 않은 경우 일치하는 item을 찾을 수 없으므로 렌더링 중에 계산된 `selection`은 `null`이 됩니다. 이 동작은 다르지만 대부분의 `items` 변경이 selection을 보존하므로 더 나은 방법이라고 할 수 있습니다.

### 이벤트 핸들러 간 로직 공유 {/*sharing-logic-between-event-handlers*/}

제품을 구매할 수 있는 두 개의 버튼(구매 및 결제)이 있는 제품 페이지가 있다고 가정해 보겠습니다. 사용자가 제품을 장바구니에 넣을 때마다 알림을 표시하고 싶습니다. 두 버튼의 클릭 핸들러에서 모두 `showNotification()`을 호출하는 것은 반복적으로 느껴지므로 이 로직을 Effect에 배치하고 싶을 수 있습니다.

```js {2-7}
function ProductPage({ product, addToCart }) {
  // 🔴 피하세요: Effect 내부의 이벤트별 로직
  useEffect(() => {
    if (product.isInCart) {
      showNotification(`Added ${product.name} to the shopping cart!`);
    }
  }, [product]);

  function handleBuyClick() {
    addToCart(product);
  }

  function handleCheckoutClick() {
    addToCart(product);
    navigateTo('/checkout');
  }
  // ...
}
```

이 Effect는 불필요합니다. 또한 버그를 유발할 가능성이 높습니다. 예를 들어 페이지가 리로드 될 때마다 앱이 장바구니를 "기억"한다고 가정해 보겠습니다. 카트에 제품을 한 번 추가하고 페이지를 새로 고치면 알림이 다시 표시됩니다. 해당 제품 페이지를 새로 고칠 때마다 알림이 계속 표시됩니다. 이는 페이지 로드 시 `product.isInCart`가 이미 `true`이므로 위의 Effect는 `showNotification()`을 호출하기 때문입니다.

**어떤 코드가 Effect에 있어야 하는지 이벤트 핸들러에 있어야 하는지 확실하지 않은 경우 이 코드가 실행되어야 하는 *이유*를 자문해 보세요. 컴포넌트가 사용자에게 표시되었기 *때문에* 실행되어야 하는 코드에만 Effect를 사용하세요.** 이 예제에서는 페이지가 표시되었기 때문이 아니라 사용자가 *버튼을 눌렀기* 때문에 알림이 표시되어야 합니다! Effect를 삭제하고 공유 로직을 두 이벤트 핸들러에서 호출되는 함수에 넣으세요.

```js {2-6,9,13}
function ProductPage({ product, addToCart }) {
  // ✅ 좋습니다: 이벤트 핸들러에서 이벤트별 로직이 호출됩니다.
  function buyProduct() {
    addToCart(product);
    showNotification(`Added ${product.name} to the shopping cart!`);
  }

  function handleBuyClick() {
    buyProduct();
  }

  function handleCheckoutClick() {
    buyProduct();
    navigateTo('/checkout');
  }
  // ...
}
```

이렇게 하면 불필요한 Effect가 제거되고 버그가 수정됩니다.

### POST 요청 보내기 {/*sending-a-post-request*/}

이 `Form` 컴포넌트는 두 가지 종류의 POST 요청을 전송합니다. 마운트 될 때 analytics 이벤트를 보냅니다. 폼을 작성하고 Submit 버튼을 클릭하면 `/api/register` 엔드포인트로 POST 요청을 보냅니다.

```js {5-8,10-16}
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ✅ 좋습니다: 컴포넌트가 표시되었으므로 이 로직이 실행되어야 합니다.
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);

  // 🔴 피하세요: Effect 내부의 이벤트별 로직
  const [jsonToSubmit, setJsonToSubmit] = useState(null);
  useEffect(() => {
    if (jsonToSubmit !== null) {
      post('/api/register', jsonToSubmit);
    }
  }, [jsonToSubmit]);

  function handleSubmit(e) {
    e.preventDefault();
    setJsonToSubmit({ firstName, lastName });
  }
  // ...
}
```

앞의 예와 동일한 기준을 적용해 보겠습니다.

analytics POST 요청은 Effect에 남아 있어야 합니다. analytics 이벤트를 전송하는 _이유_는 폼이 표시되었기 때문입니다. (개발 중에는 두 번 실행되지만 이를 처리하는 방법은 [여기](/learn/synchronizing-with-effects#sending-analytics)를 참조하세요.)

그러나 `/api/register` POST 요청은 _표시되는_ 폼으로 인해 발생하는 것이 아닙니다. 사용자가 버튼을 누를 때라는 특정 시점에만 요청을 보내려고 합니다. 이 요청은 해당 _특정 상호작용에서만_ 발생해야 합니다. 두 번째 Effect를 삭제하고 해당 POST 요청을 이벤트 핸들러로 이동합니다:

```js {12-13}
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ✅ 좋습니다: 컴포넌트가 표시되었으므로 이 로직이 실행됩니다.
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    // ✅ 좋습니다: 이벤트별 로직은 이벤트 핸들러에 있습니다.
    post('/api/register', { firstName, lastName });
  }
  // ...
}
```

어떤 로직을 이벤트 핸들러에 넣을지 Effect에 넣을지 선택할 때 사용자 관점에서 _어떤 종류의 로직인지_에 대한 답을 찾아야 합니다. 이 로직이 특정 상호작용으로 인해 발생하는 것이라면 이벤트 핸들러에 두세요. 사용자가 화면에서 컴포넌트를 _보는 것_이 원인이라면 Effect에 두세요.

### 연쇄 계산 {/*chains-of-computations*/}

때때로 다른 state에 따라 각각 state를 조정하는 Effect를 체이닝하고 싶을 때가 있습니다.

```js {7-29}
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);

  // 🔴 피하세요: 서로를 트리거하기 위해서만 state를 조정하는 Effect 체인
  useEffect(() => {
    if (card !== null && card.gold) {
      setGoldCardCount(c => c + 1);
    }
  }, [card]);

  useEffect(() => {
    if (goldCardCount > 3) {
      setRound(r => r + 1)
      setGoldCardCount(0);
    }
  }, [goldCardCount]);

  useEffect(() => {
    if (round > 5) {
      setIsGameOver(true);
    }
  }, [round]);

  useEffect(() => {
    alert('Good game!');
  }, [isGameOver]);

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error('Game already ended.');
    } else {
      setCard(nextCard);
    }
  }

  // ...
```

이 코드에는 두 가지 문제가 있습니다.

한 가지 문제는 매우 비효율적이라는 점입니다. 컴포넌트(및 그 자식)는 체인의 각 `set` 호출 사이에 다시 렌더링해야 합니다. 위의 예시에서 최악의 경우(`setCard` → 렌더링 → `setGoldCardCount` → 렌더링 → `setRound` → 렌더링 → `setIsGameOver` → 렌더링)에는 아래 트리의 불필요한 리렌더링이 세 번 발생합니다.

속도가 느리지 않더라도 코드가 발전함에 따라 작성한 "체인"이 새로운 요구 사항에 맞지 않는 경우가 발생할 수 있습니다. 게임 이동의 기록을 단계별로 살펴볼 수 있는 방법을 추가한다고 가정해 보겠습니다. 각 state 변수를 과거의 값으로 업데이트하여 이를 수행할 수 있습니다. 하지만 `card` state를 과거의 값으로 설정하면 Effect 체인이 다시 트리거되고 표시되는 데이터가 변경됩니다. 이러한 코드는 융통성 없고 취약한 경우가 많습니다.

이 경우 렌더링 중에 가능한 것을 계산하고 이벤트 핸들러에서 state를 조정하는 것이 좋습니다.

```js {6-7,14-26}
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);

  // ✅ 렌더링 중에 가능한 것을 계산합니다.
  const isGameOver = round > 5;

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error('Game already ended.');
    }

    // ✅ 이벤트 핸들러에서 다음 state를 모두 계산합니다.
    setCard(nextCard);
    if (nextCard.gold) {
      if (goldCardCount <= 3) {
        setGoldCardCount(goldCardCount + 1);
      } else {
        setGoldCardCount(0);
        setRound(round + 1);
        if (round === 5) {
          alert('Good game!');
        }
      }
    }
  }

  // ...
```

훨씬 더 효율적입니다. 또한 게임 기록을 볼 수 있는 방법을 구현하면 이제 다른 모든 값을 조정하는 Effect 체인을 트리거 하지 않고도 각 state 변수를 과거의 행동으로 설정할 수 있습니다. 여러 이벤트 핸들러 간에 로직을 재사용해야 하는 경우 [함수를 추출](#sharing-logic-between-event-handlers)하여 해당 핸들러에서 호출할 수 있습니다.

이벤트 핸들러 내부에서 [state는 스냅샷처럼 동작한다](/learn/state-as-a-snapshot)는 점을 기억하세요. 예를 들어 `setRound(round + 1)`를 호출한 후에도 `round` 변수는 사용자가 버튼을 클릭한 시점의 값을 반영합니다. 계산에 다음 값을 사용해야 하는 경우 `const nextRound = round + 1`처럼 수동으로 정의하세요.

이벤트 핸들러에서 직접 다음 state를 계산할 수 **없는** 경우도 있습니다. 예를 들어 여러 개의 드롭 다운이 있는 폼에서 다음 드롭 다운의 옵션이 이전 드롭 다운의 선택된 값에 따라 달라진다고 가정해 보겠습니다. 이 경우 네트워크와 동기화하기 때문에 Effect 체인이 적절합니다.

### 애플리케이션 초기화 {/*initializing-the-application*/}

일부 로직은 앱이 로드될 때 한 번만 실행되어야 합니다.

그것을 최상위 컴포넌트의 Effect에 배치하고 싶을 수도 있습니다.

```js {2-6}
function App() {
  // 🔴 피하세요: 한 번만 실행되어야 하는 로직이 포함된 Effect
  useEffect(() => {
    loadDataFromLocalStorage();
    checkAuthToken();
  }, []);
  // ...
}
```

하지만 이 함수가 [개발 중에 두 번 실행된다](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)는 사실을 금방 알게 될 것입니다. 함수가 두 번 호출되도록 설계되지 않았기 때문에 인증 토큰이 무효화되는 등의 문제가 발생할 수 있습니다. 일반적으로 컴포넌트는 다시 마운트 할 때 탄력이 있어야 합니다. 여기에는 최상위 `App` 컴포넌트가 포함됩니다.

프로덕션 환경에서 실제로 다시 마운트되지 않을 수도 있지만 모든 컴포넌트에서 동일한 제약 조건을 따르면 코드를 이동하고 재사용하기가 더 쉬워집니다. 일부 로직이 *컴포넌트 마운트당 한 번*이 아니라 *앱 로드당 한 번* 실행되어야 하는 경우 최상위 변수를 추가하여 이미 실행되었는지를 추적하세요.

```js {1,5-6,10}
let didInit = false;

function App() {
  useEffect(() => {
    if (!didInit) {
      didInit = true;
      // ✅ 앱 로드당 한 번만 실행
      loadDataFromLocalStorage();
      checkAuthToken();
    }
  }, []);
  // ...
}
```

모듈 초기화 중이나 앱이 렌더링 되기 전에 실행할 수도 있습니다.

```js {1,5}
if (typeof window !== 'undefined') { // 브라우저에서 실행 중인지 확인합니다.
   // ✅ 앱 로드당 한 번만 실행
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ...
}
```

컴포넌트를 import 할 때 최상위 레벨의 코드는 렌더링 되지 않더라도 한 번 실행됩니다. 임의의 컴포넌트를 import 할 때 속도 저하나 예상치 못한 동작을 방지하려면 이 패턴을 과도하게 사용하지 마세요. app 전체 초기화 로직은 `App.js`와 같은 루트 컴포넌트 모듈이나 애플리케이션의 엔트리 포인트에 두세요.


### state 변경을 부모 컴포넌트에게 알리기 {/*notifying-parent-components-about-state-changes*/}

`true` 또는 `false`가 될 수 있는 내부 `isOn` state를 가진 `Toggle` 컴포넌트를 작성하고 있다고 가정해 보겠습니다. 클릭 또는 드래그를 통해 토글하는 방법에는 몇 가지가 있습니다. `Toggle` 내부 state가 변경될 때마다 부모 컴포넌트에 알리고 싶을 때 `onChange` 이벤트를 노출하고 Effect에서 호출합니다.

```js {4-7}
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  // 🔴 피하세요: onChange 핸들러가 너무 늦게 실행됨
  useEffect(() => {
    onChange(isOn);
  }, [isOn, onChange])

  function handleClick() {
    setIsOn(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      setIsOn(true);
    } else {
      setIsOn(false);
    }
  }

  // ...
}
```

앞서와 마찬가지로 이것은 이상적이지 않습니다. `Toggle`이 먼저 state를 업데이트하고 React가 화면을 업데이트합니다. 그런 다음 React는 Effect를 실행하고 부모 컴포넌트에서 전달된 `onChange` 함수를 호출합니다. 이제 부모 컴포넌트는 자신의 state를 업데이트하고 다른 렌더링 패스를 시작합니다. 모든 것을 한 번의 패스로 처리하는 것이 좋습니다.

Effect를 삭제하고 대신 동일한 이벤트 핸들러 내에서 *두* 컴포넌트의 state를 업데이트합니다.

```js {5-7,11,16,18}
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  function updateToggle(nextIsOn) {
    // ✅ 좋습니다: 업데이트를 유발한 이벤트가 발생한 동안 모든 업데이트를 수행합니다.
    setIsOn(nextIsOn);
    onChange(nextIsOn);
  }

  function handleClick() {
    updateToggle(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      updateToggle(true);
    } else {
      updateToggle(false);
    }
  }

  // ...
}
```

이 접근 방식을 사용하면 `Toggle` 컴포넌트와 그 부모 컴포넌트 모두 이벤트가 진행되는 동안 state를 업데이트 합니다. React는 서로 다른 컴포넌트의 [업데이트를 일괄 처리](/learn/queueing-a-series-of-state-updates)하므로 렌더링 패스는 한 번만 발생합니다.

state를 완전히 제거하고 대신 부모 컴포넌트로부터 `isOn`을 수신할 수도 있습니다.

```js {1,2}
// ✅ 이것도 좋습니다: 컴포넌트는 부모에 의해 완전히 제어됩니다.
function Toggle({ isOn, onChange }) {
  function handleClick() {
    onChange(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      onChange(true);
    } else {
      onChange(false);
    }
  }

  // ...
}
```

["state 끌어올리기"](/learn/sharing-state-between-components)는 부모 컴포넌트가 부모 자체의 state를 토글 하여 `Toggle`을 완전히 제어할 수 있게 해줍니다. 즉, 부모 컴포넌트에 더 많은 로직을 포함해야 하지만 전체적으로 걱정해야 할 state는 줄어듭니다. 두 개의 서로 다른 state 변수를 동기화하려고 할 때마다 대신 state 끌어올리기를 사용해 보세요!

### 부모에게 데이터 전달하기 {/*passing-data-to-the-parent*/}

이 `Child` 컴포넌트는 일부 데이터를 가져온 다음 Effect에서 `Parent` 컴포넌트에 전달합니다.

```js {9-14}
function Parent() {
  const [data, setData] = useState(null);
  // ...
  return <Child onFetched={setData} />;
}

function Child({ onFetched }) {
  const data = useSomeAPI();
  // 🔴 피하세요: Effect에서 부모에게 데이터 전달하기
  useEffect(() => {
    if (data) {
      onFetched(data);
    }
  }, [onFetched, data]);
  // ...
}
```

React에서 데이터는 부모 컴포넌트에서 자식 컴포넌트로 흐릅니다. 화면에 뭔가 잘못된 것이 보이면 컴포넌트 체인을 따라 올라가서 어떤 컴포넌트가 잘못된 prop을 전달하거나 잘못된 state를 가지고 있는지 찾아내면 정보의 출처를 추적할 수 있습니다. 자식 컴포넌트가 Effect에서 부모 컴포넌트의 state를 업데이트하면 데이터 흐름을 추적하기가 매우 어려워집니다. 자식과 부모 모두 동일한 데이터가 필요하므로 부모 컴포넌트가 해당 데이터를 가져와서 자식에게 대신 *내려주도록* 하세요.

```js {4-5}
function Parent() {
  const data = useSomeAPI();
  // ...
  // ✅ 좋습니다: 자식에서 데이터를 전달
  return <Child data={data} />;
}

function Child({ data }) {
  // ...
}
```

이렇게 하면 데이터가 부모에서 자식으로 내려오기 때문에 데이터 흐름이 더 간단하고 예측 가능하게 유지됩니다.

### 외부 저장소 구독하기 {/*subscribing-to-an-external-store*/}

때로는 컴포넌트가 React state 외부의 일부 데이터를 구독해야 할 수도 있습니다. 이 데이터는 서드파티 라이브러리 또는 내장 브라우저 API에서 가져올 수 있습니다. 이 데이터는 React가 모르는 사이에 변경될 수 있으므로 컴포넌트를 수동으로 구독해야 합니다. 이 작업은 종종 Effect를 통해 수행됩니다. 다음은 예시입니다.

```js {2-17}
function useOnlineStatus() {
  // 이상적이지 않습니다: Effect에서 저장소를 수동으로 구독
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function updateState() {
      setIsOnline(navigator.onLine);
    }

    updateState();

    window.addEventListener('online', updateState);
    window.addEventListener('offline', updateState);
    return () => {
      window.removeEventListener('online', updateState);
      window.removeEventListener('offline', updateState);
    };
  }, []);
  return isOnline;
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
  // ...
}
```

여기서 컴포넌트는 외부 데이터 저장소(이 경우 브라우저 `navigator.onLine` API)를 구독합니다. 이 API는 서버에 존재하지 않으므로(초기 HTML에 사용할 수 없으므로) 처음 state는 `true`로 설정됩니다. 브라우저에서 해당 데이터 저장소의 값이 변경될 때마다 컴포넌트는 해당 state를 업데이트합니다.

이를 위해 Effect를 사용하는 것이 일반적이지만 React에는 외부 저장소를 구독하기 위해 특별히 제작된 Hook이 있습니다. Effect를 삭제하고 [`useSyncExternalStore`](/reference/react/useSyncExternalStore)에 대한 호출로 대체합니다.

```js {11-16}
function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function useOnlineStatus() {
  // ✅ 좋습니다: 내장 Hook으로 외부 스토어 구독하기
  return useSyncExternalStore(
    subscribe, // 동일한 함수를 전달하는 한 React는 다시 구독하지 않습니다.
    () => navigator.onLine, // 클라이언트에서 값을 얻는 방법
    () => true // 서버에서 값을 얻는 방법
  );
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
  // ...
}
```

이 접근 방식은 변경 가능한 데이터를 Effect를 사용해 React state에 수동으로 동기화하는 것보다 에러가 덜 발생합니다. 일반적으로 위의 `useOnlineStatus()`와 같은 사용자 정의 Hook을 작성하여 개별 컴포넌트에서 이 코드를 반복할 필요가 없도록 합니다. [React 컴포넌트에서 외부 store를 구독하는 방법에 대해 자세히 읽어보세요.](/reference/react/useSyncExternalStore)

### 데이터 가져오기 {/*fetching-data*/}

많은 앱이 데이터 가져오기를 시작하기 위해 Effect를 사용합니다. 이와 같은 데이터를 가져오는 Effect를 작성하는 것은 매우 일반적입니다.

```js {5-10}
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // 🔴 피하세요: 정리 로직 없이 가져오기
    fetchResults(query, page).then(json => {
      setResults(json);
    });
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}
```

데이터 가져오기를 이벤트 핸들러로 옮길 필요는 *없습니다*.

이벤트 핸들러에 로직을 넣어야 했던 앞선 예제와 모순되는 것처럼 보일 수 있습니다! 하지만 데이터 가져오기를 해야 하는 주된 이유가 *입력 이벤트*가 아니라는 점을 고려하세요. 검색 입력은 URL에서 미리 채워지는 경우가 많으며 사용자는 입력을 건드리지 않고 뒤로 앞으로 탐색할 수도 있습니다.

`page`와 `query`의 출처가 어디인지는 중요하지 않습니다. 이 컴포넌트가 표시되는 동안에는 현재 `page` 및 `query`에 대한 네트워크의 데이터와 `results`를 [동기화](/learn/synchronizing-with-effects)하고 싶을 것입니다. 이것이 바로 Effect의 이유입니다.

하지만 위의 코드에는 버그가 있습니다. `"hello"`를 빠르게 입력한다고 가정해 봅시다. 그러면 `query`가 `"h"`에서 `"he"`, `"hel"`, `"hell"`, `"hello"`로 바뀝니다. 이렇게 하면 별도의 데이터 가져오기가 시작되지만 응답이 어떤 순서로 도착할지는 보장할 수 없습니다. 예를 들어 `"hello"` 응답 *후에* `"hell"` 응답이 도착할 수 있습니다. `setResults()`를 마지막으로 호출하므로 잘못된 검색 결과가 표시될 수 있습니다. 이를 ["경쟁 조건"](https://ko.wikipedia.org/wiki/경쟁_상태)이라고 하는데, 서로 다른 두 요청이 서로 "경쟁"하여 예상과 다른 순서로 도착하는 것을 말합니다.

**경쟁 조건을 수정하려면 오래된 응답을 무시하는 [정리 함수를 추가](/learn/synchronizing-with-effects#fetching-data)해야 합니다.**

```js {5,7,9,11-13}
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  useEffect(() => {
    let ignore = false;
    fetchResults(query, page).then(json => {
      if (!ignore) {
        setResults(json);
      }
    });
    return () => {
      ignore = true;
    };
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}
```

이렇게 하면 Effect가 데이터를 가져올 때 마지막으로 요청된 응답을 제외한 모든 응답이 무시됩니다.

데이터 가져오기를 구현할 때 경쟁 조건을 처리하는 것만이 어려운 것은 아닙니다. 응답 캐싱(사용자가 뒤로가기 버튼을 클릭하여 이전 화면을 즉시 볼 수 있도록), 서버에서 데이터를 가져오는 방법(초기 서버 렌더링 HTML에 스피너 대신 가져온 콘텐츠가 포함되도록), 네트워크 워터폴을 피하는 방법(자식이 모든 부모를 기다리지 않고 데이터를 가져올 수 있도록)도 고려해야 합니다.

**이러한 문제는 React뿐만 아니라 모든 UI 라이브러리에 적용됩니다. 이러한 문제를 해결하는 것은 간단하지 않기 때문에 모던 [프레임워크](/learn/start-a-new-react-project#production-grade-react-frameworks)는 Effect에서 데이터를 가져오는 것보다 더 효율적인 내장 데이터 가져오기 메커니즘을 제공합니다.**

프레임워크를 사용하지 않고(그리고 직접 빌드하고 싶지 않고) Effect에서 데이터를 보다 인체공학적으로 가져오고 싶다면 이 예시처럼 가져오기 로직을 사용자 정의 Hook으로 추출하는 것을 고려하세요.

```js {4}
function SearchResults({ query }) {
  const [page, setPage] = useState(1);
  const params = new URLSearchParams({ query, page });
  const results = useData(`/api/search?${params}`);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}

function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    let ignore = false;
    fetch(url)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setData(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [url]);
  return data;
}
```

또한 에러 핸들링과 콘텐츠 로딩 여부를 추적하기 위한 로직을 추가하고 싶을 것입니다. 이와 같은 Hook을 직접 빌드하거나 React 에코시스템에서 이미 사용 가능한 많은 솔루션 중 하나를 사용할 수 있습니다. **이 방법만으로는 프레임워크에 내장된 데이터 가져오기 메커니즘을 사용하는 것만큼 효율적이지는 않지만, 데이터 가져오기 로직을 사용자 정의 Hook으로 옮기면 나중에 효율적인 데이터 가져오기 전략을 취하기가 더 쉬워집니다.**

일반적으로 Effect를 작성해야 할 때마다 위의 `useData`와 같이 보다 선언적이고 목적에 맞게 구축된 API를 사용하여 일부 기능을 커스텀 Hook으로 추출할 수 있는 경우를 주시하세요. 컴포넌트에서 원시 `useEffect` 호출이 적을수록 애플리케이션을 유지 관리하기가 더 쉬워집니다.

<Recap>

- 렌더링 중에 무언가를 계산할 수 있다면 Effect가 필요하지 않습니다.
- 비용이 많이 드는 계산을 캐시하려면 `useEffect` 대신 `useMemo`를 추가하세요.
- 전체 컴포넌트 트리의 state를 초기화하려면 다른 `key`를 전달하세요.
- prop 변경에 대한 응답으로 특정 state bit를 초기화하려면 렌더링 중에 설정하세요.
- 컴포넌트가 *표시되어* 실행되는 코드는 Effect에 있어야 하고 나머지는 이벤트에 있어야 합니다.
- 여러 컴포넌트의 state를 업데이트해야 하는 경우 단일 이벤트 중에 수행하는 것이 좋습니다.
- 다른 컴포넌트의 state 변수를 동기화하려고 할 때마다 state 끌어올리기를 고려하세요.
- Effect로 데이터를 가져올 수 있지만 경쟁 조건을 피하기 위해 정리를 구현해야 합니다.

</Recap>

<Challenges>

#### Effect 없이 데이터 변환하기 {/*transform-data-without-effects*/}

아래의 todos 목록에 `TodoList`가 표시됩니다. "Show only active todos" 체크박스를 선택하면 완료된 todos는 목록에 표시되지 않습니다. 표시되는 todos와 관계없이 footer에는 아직 완료되지 않은 todos의 수가 표시됩니다.

불필요한 state와 Effect를 모두 제거하여 이 컴포넌트를 단순화하세요.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { initialTodos, createTodo } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [activeTodos, setActiveTodos] = useState([]);
  const [visibleTodos, setVisibleTodos] = useState([]);
  const [footer, setFooter] = useState(null);

  useEffect(() => {
    setActiveTodos(todos.filter(todo => !todo.completed));
  }, [todos]);

  useEffect(() => {
    setVisibleTodos(showActive ? activeTodos : todos);
  }, [showActive, todos, activeTodos]);

  useEffect(() => {
    setFooter(
      <footer>
        {activeTodos.length} todos left
      </footer>
    );
  }, [activeTodos]);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
      {footer}
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
    </>
  );
}
```

```js todos.js
let nextId = 0;

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

<Hint>

렌더링 중에 무언가를 계산할 수 있다면 state나 이를 업데이트하는 Effect가 필요하지 않습니다.

</Hint>

<Solution>

이 예제에서는 `todos` 목록과 체크박스의 체크 여부를 나타내는 `showActive` state 변수의 두 가지 필수 state만 있습니다. 다른 모든 state 변수는 [불필요하며](/learn/choosing-the-state-structure#avoid-redundant-state) 렌더링 중에 대신 계산할 수 있습니다. 여기에는 주변 JSX로 바로 이동할 수 있는 `footer`가 포함됩니다.

결과는 다음과 같아야 합니다.

<Sandpack>

```js
import { useState } from 'react';
import { initialTodos, createTodo } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
      <footer>
        {activeTodos.length} todos left
      </footer>
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
    </>
  );
}
```

```js todos.js
let nextId = 0;

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

</Solution>

#### Effect 없이 계산 캐시하기 {/*cache-a-calculation-without-effects*/}

이 예제에서는 todos 필터링이 `getVisibleTodos()`라는 별도의 함수로 추출되었습니다. 이 함수 안에는 언제 호출되는지 알 수 있도록 `console.log()` 호출이 포함되어 있습니다. "Show only active todos"를 토글하면 `getVisibleTodos()`가 다시 실행되는 것을 확인할 수 있습니다. 이는 표시할 todos를 토글하면 표시되는 todos가 변경되기 때문에 예상되는 현상입니다.

여러분이 해야 할 일은 `TodoList` 컴포넌트에서 `visibleTodos` 목록을 다시 계산하는 Effect를 제거하는 것입니다. 그러나 input에 입력할 때 `getVisibleTodos()`가 다시 실행되지 않도록(따라서 로그를 출력하지 *않도록*) 해야 합니다.

<Hint>

한 가지 해결책은 `useMemo` 호출을 추가하여 표시되는 todos를 캐시하는 것입니다. 덜 분명한 또 다른 해결책도 있습니다.

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [text, setText] = useState('');
  const [visibleTodos, setVisibleTodos] = useState([]);

  useEffect(() => {
    setVisibleTodos(getVisibleTodos(todos, showActive));
  }, [todos, showActive]);

  function handleAddClick() {
    setText('');
    setTodos([...todos, createTodo(text)]);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

```js todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() was called ${++calls} times`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

<Solution>

state 변수와 Effect를 제거하고 대신 `getVisibleTodos()`를 호출한 결과를 캐시하는 `useMemo` 호출을 추가합니다.

<Sandpack>

```js
import { useState, useMemo } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [text, setText] = useState('');
  const visibleTodos = useMemo(
    () => getVisibleTodos(todos, showActive),
    [todos, showActive]
  );

  function handleAddClick() {
    setText('');
    setTodos([...todos, createTodo(text)]);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

```js todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() was called ${++calls} times`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

이렇게 변경하면 `todos` 또는 `showActive`가 변경되는 경우에만 `getVisibleTodos()`가 호출됩니다. input에 입력하면 `text` state 변수만 변경되므로 `getVisibleTodos()` 호출이 트리거 되지 않습니다.

`useMemo`가 필요 없는 다른 해결책도 있습니다. `text` state 변수가 todos 목록에 영향을 줄 수 없으므로 `NewTodo` 폼을 별도의 컴포넌트로 추출하고 `text` state 변수를 그 안에 옮길 수 있습니다.

<Sandpack>

```js
import { useState, useMemo } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const visibleTodos = getVisibleTodos(todos, showActive);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
    </>
  );
}
```

```js todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() was called ${++calls} times`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

이 접근 방식도 요구 사항을 충족합니다. input에 입력하면 `text` state 변수만 업데이트됩니다. `text` state 변수가 하위 `NewTodo` 컴포넌트에 있기 때문에 상위 `TodoList` 컴포넌트는 다시 렌더링 되지 않습니다. 이것이 사용자가 입력할 때 `getVisibleTodos()`가 호출되지 않는 이유입니다. (다른 이유로 `TodoList`가 다시 렌더링 되는 경우에도 여전히 호출됩니다.)

</Solution>

#### Effect 없이 state 초기화하기 {/*reset-state-without-effects*/}

이 `EditContact` 컴포넌트는 `{ id, name, email }` 모양의 연락처 객체를 `savedContact` prop으로 받습니다. name과 email input 필드를 편집해 보세요. Save을 누르면 폼 위의 연락처 버튼이 편집된 name으로 업데이트됩니다. Reset을 누르면 폼의 보류 중인 변경 사항이 모두 삭제됩니다. 이 UI를 사용해 보면서 사용법을 익혀보세요.

상단의 버튼으로 연락처를 선택하면 해당 연락처의 세부 정보를 반영하도록 폼이 초기화됩니다. 이 작업은 `EditContact.js` 내의 Effect로 수행됩니다. 이 Effect를 제거합니다. `savedContact.id`가 변경될 때 폼을 초기화하는 다른 방법을 찾아보세요.

<Sandpack>

```js App.js hidden
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        savedContact={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js ContactList.js hidden
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js EditContact.js active
import { useState, useEffect } from 'react';

export default function EditContact({ savedContact, onSave }) {
  const [name, setName] = useState(savedContact.name);
  const [email, setEmail] = useState(savedContact.email);

  useEffect(() => {
    setName(savedContact.name);
    setEmail(savedContact.email);
  }, [savedContact]);

  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: savedContact.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(savedContact.name);
        setEmail(savedContact.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Hint>

`savedContact.id`가 다른 경우 `EditContact` 폼은 개념적으로 _다른 연락처의 폼_이며 state를 보존해서는 안 된다는 것을 React에 알리는 방법이 있다면 좋을 것 같습니다. 그런 방법을 기억하시나요?

</Hint>

<Solution>

`EditContact` 컴포넌트를 둘로 분할합니다. 모든 폼 state를 내부 `EditForm` 컴포넌트로 이동시킵니다. 외부 `EditContact` 컴포넌트를 내보내고 내부 `EditContact` 컴포넌트에 `savedContact.id`를 `key`로 전달하도록 합니다. 그 결과 내부 `EditForm` 컴포넌트는 다른 연락처를 선택할 때마다 모든 폼 state를 초기화하고 DOM을 다시 생성합니다.

<Sandpack>

```js App.js hidden
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        savedContact={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js ContactList.js hidden
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js EditContact.js active
import { useState } from 'react';

export default function EditContact(props) {
  return (
    <EditForm
      {...props}
      key={props.savedContact.id}
    />
  );
}

function EditForm({ savedContact, onSave }) {
  const [name, setName] = useState(savedContact.name);
  const [email, setEmail] = useState(savedContact.email);

  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: savedContact.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(savedContact.name);
        setEmail(savedContact.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

</Solution>

#### Effect 없이 폼 제출하기 {/*submit-a-form-without-effects*/}

이 `Form` 컴포넌트를 사용하면 친구에게 메시지를 보낼 수 있습니다. 폼을 제출하면 `showForm` state 변수가 `false`로 설정됩니다. 그러면 `sendMessage(message)`를 호출하는 Effect가 트리거되어 메시지가 전송됩니다(콘솔에서 확인할 수 있음). 메시지가 전송되면 "Open chat" 버튼이 있는 "Thank you" 대화 상자가 표시되어 폼으로 돌아갈 수 있습니다.

앱 사용자가 너무 많은 메시지를 보내고 있습니다. 채팅을 조금 더 어렵게 만들기 위해 양식 대신 "Thank you" 대화 상자를 *먼저* 표시하기로 결정했습니다. `showForm` state 변수를 `true`가 아닌 `false`로 초기화하도록 변경합니다. 이렇게 변경하자마자 콘솔에 빈 메시지가 전송된 것으로 표시됩니다. 이 로직의 뭔가가 잘못되었습니다!

이 문제의 근본 원인은 무엇인가요? 그리고 어떻게 해결할 수 있을까요?

<Hint>

사용자가 "Thank you" 대화 상자를 보았기 _때문에_ 메시지를 보내야 하나요? 아니면 그 반대일까요?

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Form() {
  const [showForm, setShowForm] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!showForm) {
      sendMessage(message);
    }
  }, [showForm, message]);

  function handleSubmit(e) {
    e.preventDefault();
    setShowForm(false);
  }

  if (!showForm) {
    return (
      <>
        <h1>Thanks for using our services!</h1>
        <button onClick={() => {
          setMessage('');
          setShowForm(true);
        }}>
          Open chat
        </button>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit" disabled={message === ''}>
        Send
      </button>
    </form>
  );
}

function sendMessage(message) {
  console.log('Sending message: ' + message);
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

<Solution>

`showForm` state 변수는 폼을 표시할지 아니면 "Thank you" 대화 상자를 표시할지를 결정합니다. 그러나 "Thank you" 대화 상자가 _표시되었기_ 때문에 메시지를 보내지 않습니다. 사용자가 _폼을 제출했기_ 때문에 메시지를 보내려고 합니다. 오해의 소지가 있는 Effect를 삭제하고 `handleSubmit` 이벤트 핸들러 내부로 `sendMessage` 호출을 이동합니다.

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Form() {
  const [showForm, setShowForm] = useState(true);
  const [message, setMessage] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setShowForm(false);
    sendMessage(message);
  }

  if (!showForm) {
    return (
      <>
        <h1>Thanks for using our services!</h1>
        <button onClick={() => {
          setMessage('');
          setShowForm(true);
        }}>
          Open chat
        </button>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit" disabled={message === ''}>
        Send
      </button>
    </form>
  );
}

function sendMessage(message) {
  console.log('Sending message: ' + message);
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

이 버전에서는 이벤트인 _폼을 제출하는 것_만으로 메시지가 전송되는 것을 확인할 수 있습니다. 이 기능은 `showForm`이 처음에 `true`으로 설정되었는지 `false`로 설정되었는지에 관계없이 동일하게 잘 작동합니다. (`false`로 설정하면 추가 콘솔 메시지가 표시되지 않습니다.)

</Solution>

</Challenges>
