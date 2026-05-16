---
title: useOptimistic
---

<Intro>

`useOptimistic`은 UI를 낙관적으로 업데이트할 수 있게 해주는 React Hook입니다.

```js
const [optimisticState, setOptimistic] = useOptimistic(value, reducer?);
```

</Intro>

<InlineToc />

---

## 레퍼런스 {/*reference*/}

### `useOptimistic(value, reducer?)` {/*useoptimistic*/}

`useOptimistic`은 React Hook으로, 비동기 작업이 진행 중일 때 다른 상태를 보여줄 수 있게 해줍니다. 인자로 주어진 일부 상태를 받아, 네트워크 요청과 같은 비동기 작업 기간 동안 달라질 수 있는 그 상태의 복사본을 반환합니다. 현재 상태와 작업의 입력을 취하는 함수를 제공하고, 작업이 대기 중일 때 사용할 낙관적인 상태를 반환합니다.

이 상태는 "낙관적" 상태라고 불리는데, 실제로 작업을 완료하는 데 시간이 걸리더라도 사용자에게 즉시 작업의 결과를 표시하기 위해 일반적으로 사용됩니다.

```js
import { useOptimistic } from 'react';

function MyComponent({name, todos}) {
  const [optimisticAge, setOptimisticAge] = useOptimistic(28);
  const [optimisticName, setOptimisticName] = useOptimistic(name);
  const [optimisticTodos, setOptimisticTodos] = useOptimistic(todos, todoReducer);
  // ...
}
```

[아래에 더 많은 예시를 참조하세요.](#usage)

#### 매개변수 {/*parameters*/}

* `state`: 작업이 대기 중이지 않을 때 초기에 반환될 값입니다.
* `updateFn(currentState, optimisticValue)`: 현재 State와 `addOptimistic`에 전달된 낙관적인 값을 취하는 함수로, 결과적인 낙관적인 State를 반환합니다. 순수 함수여야 합니다. `updateFn`은 두 개의 매개변수를 취합니다. `currentState`와 `optimisticValue`. 반환 값은 `currentState`와 `optimisticValue`의 병합된 값입니다.

#### 반환값 {/*returns*/}

* `optimisticState`: 결과적인 낙관적인 상태입니다. 작업이 대기 중이지 않을 때는 `state`와 동일하며, 그렇지 않은 경우 `updateFn`에서 반환된 값과 동일합니다.
* `addOptimistic`: `addOptimistic`는 낙관적인 업데이트가 있을 때 호출하는 dispatch 함수입니다. 어떠한 타입의 `optimisticValue`라는 하나의 인자를 취하며, `state`와 `optimisticValue`로 `updateFn`을 호출합니다.

---

## 사용법 {/*usage*/}

### 폼을 낙관적으로 업데이트하기 {/*optimistically-updating-with-forms*/}

`useOptimistic` Hook은 네트워크 요청과 같은 백그라운드 작업이 완료되기 전에 사용자 인터페이스를 낙관적으로 업데이트하는 방법을 제공합니다. 폼의 맥락에서, 이 기술은 앱이 더 반응적으로 느껴지도록 도와줍니다. 사용자가 폼을 제출할 때, 서버의 응답을 기다리는 대신 인터페이스는 기대하는 결과로 즉시 업데이트됩니다.

예를 들어, 사용자가 폼에 메시지를 입력하고 "전송" 버튼을 누르면, `useOptimistic` Hook은 메시지가 실제로 서버로 전송되기 전에 "전송 중..." 라벨이 있는 목록에 메시지가 즉시 나타나도록 합니다. 이 "낙관적" 접근법은 속도와 반응성의 느낌을 줍니다. 그런 다음 폼은 백그라운드에서 메시지를 실제로 전송하려고 시도합니다. 서버가 메시지를 받았음을 확인하면, "전송 중..." 라벨이 제거됩니다.

<Sandpack>

```js src/App.js
import { useState, startTransition } from 'react';
import Button from './Button';
import { submitForm } from './actions.js';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <Button action={async () => {
        await submitForm();
        startTransition(() => {
          setCount(c => c + 1);
        });
      }}>Increment</Button>
      {count > 0 && <p>Submitted {count}!</p>}
    </div>
  );
}
```

```js src/Button.js active
import { useOptimistic, startTransition } from 'react';

export default function Button({ action, children }) {
  const [isPending, setIsPending] = useOptimistic(false);

  return (
    <button
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          setIsPending(true);
          await action();
        });
      }}
    >
      {isPending ? 'Submitting...' : children}
    </button>
  );
}
```

```js src/actions.js hidden
export async function submitForm() {
  await new Promise((res) => setTimeout(res, 1000));
}
```

</Sandpack>

버튼을 클릭하면 `setIsPending(true)`가 낙관적 state를 사용하여 즉시 "Submitting..."을 표시하고 버튼을 비활성화합니다. Action이 완료되면 `isPending`은 자동으로 `false`로 렌더링됩니다.

이 패턴은 `Button`에서 `action` prop을 어떤 방식으로 사용하든 보류 상태를 자동으로 표시합니다.

```js
// state 업데이트에 대한 보류 상태 표시
<Button action={() => { setState(c => c + 1) }} />

// 네비게이션에 대한 보류 상태 표시
<Button action={() => { navigate('/done') }} />

// POST에 대한 보류 상태 표시
<Button action={async () => { await fetch(/* ... */) }} />

// 모든 조합에 대한 보류 상태 표시
<Button action={async () => {
  setState(c => c + 1);
  await fetch(/* ... */);
  navigate('/done');
}} />
```

`action` prop 안의 모든 작업이 끝날 때까지 보류 상태가 표시됩니다.

<Note>

[`useTransition`](/reference/react/useTransition)을 사용하여 `isPending`으로 보류 상태를 가져올 수도 있습니다.

차이점은 `useTransition`은 `startTransition` 함수를 제공하는 반면, `useOptimistic`은 모든 Transition과 함께 동작한다는 것입니다. 컴포넌트의 필요에 맞는 것을 사용하세요.

</Note>

---

### props나 state를 낙관적으로 업데이트하기 {/*updating-props-or-state-optimistically*/}

props나 state를 `useOptimistic`으로 감싸 Action이 진행 중일 때 즉시 업데이트할 수 있습니다.

이 예시에서 `LikeButton`은 `isLiked`를 prop으로 받고, 클릭하면 즉시 토글합니다.

<Sandpack>

```js src/App.js
import { useState, useOptimistic, startTransition } from 'react';
import { toggleLike } from './actions.js';

export default function App() {
  const [isLiked, setIsLiked] = useState(false);
  const [optimisticIsLiked, setOptimisticIsLiked] = useOptimistic(isLiked);

  function handleClick() {
    startTransition(async () => {
      const newValue = !optimisticIsLiked
      console.log('⏳ setting optimistic state: ' + newValue);

      setOptimisticIsLiked(newValue);
      const updatedValue = await toggleLike(newValue);

      startTransition(() => {
        console.log('⏳ setting real state: ' + updatedValue );
        setIsLiked(updatedValue);
      });
    });
  }

  if (optimisticIsLiked !== isLiked) {
    console.log('✅ rendering optimistic state: ' + optimisticIsLiked);
  } else {
    console.log('✅ rendering real value: ' + optimisticIsLiked);
  }


  return (
    <button onClick={handleClick}>
      {optimisticIsLiked ? '❤️ Unlike' : '🤍 Like'}
    </button>
  );
}
```

```js src/actions.js hidden
export async function toggleLike(value) {
  return await new Promise((res) => setTimeout(() => res(value), 1000));
  // 실제 앱에서는 서버를 업데이트합니다.
}
```

```js src/index.js hidden
import React from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById('root'));
// 중복 렌더링 로그가 표시되지 않도록 StrictMode를 사용하지 않습니다.
root.render(<App />);
```

</Sandpack>

버튼을 클릭하면 `setOptimisticIsLiked`가 표시되는 state를 즉시 업데이트하여 하트가 좋아요 상태로 보이게 합니다. 그동안 `await toggleLike`는 백그라운드에서 실행됩니다. `await`가 완료되면 상위의 `setIsLiked`가 "실제" `isLiked` state를 업데이트하고, 낙관적 state는 이 새로운 값과 일치하도록 렌더링됩니다.

<Note>

이 예시는 다음 값을 계산하기 위해 `optimisticIsLiked`를 읽습니다. 기준 state가 변경되지 않는 경우에는 잘 동작하지만, Action이 대기 중인 동안 기준 state가 변경될 수 있다면 state 업데이터나 리듀서를 사용하는 것이 좋습니다.

예시는 [현재 state를 기반으로 state 업데이트하기](#updating-state-based-on-current-state)를 참고하세요.

</Note>

---

### 여러 값을 함께 업데이트하기 {/*updating-multiple-values-together*/}

낙관적 업데이트가 여러 관련 값에 영향을 준다면, 리듀서를 사용해 함께 업데이트하세요. 이렇게 하면 UI의 일관성을 유지할 수 있습니다.

다음은 팔로우 상태와 팔로워 수를 모두 업데이트하는 팔로우 버튼입니다.

<Sandpack>

```js src/App.js
import { useState, startTransition } from 'react';
import { followUser, unfollowUser } from './actions.js';
import FollowButton from './FollowButton';

export default function App() {
  const [user, setUser] = useState({
    name: 'React',
    isFollowing: false,
    followerCount: 10500
  });

  async function followAction(shouldFollow) {
    if (shouldFollow) {
      await followUser(user.name);
    } else {
      await unfollowUser(user.name);
    }
    startTransition(() => {
      setUser(current => ({
        ...current,
        isFollowing: shouldFollow,
        followerCount: current.followerCount + (shouldFollow ? 1 : -1)
      }));
    });
  }

  return <FollowButton user={user} followAction={followAction} />;
}
```

```js src/FollowButton.js active
import { useOptimistic, startTransition } from 'react';

export default function FollowButton({ user, followAction }) {
  const [optimisticState, updateOptimistic] = useOptimistic(
    { isFollowing: user.isFollowing, followerCount: user.followerCount },
    (current, isFollowing) => ({
      isFollowing,
      followerCount: current.followerCount + (isFollowing ? 1 : -1)
    })
  );

  function handleClick() {
    const newFollowState = !optimisticState.isFollowing;
    startTransition(async () => {
      updateOptimistic(newFollowState);
      await followAction(newFollowState);
    });
  }

  return (
    <div>
      <p><strong>{user.name}</strong></p>
      <p>{optimisticState.followerCount} followers</p>
      <button onClick={handleClick}>
        {optimisticState.isFollowing ? 'Unfollow' : 'Follow'}
      </button>
    </div>
  );
}
```

```js src/actions.js hidden
export async function followUser(name) {
  await new Promise((res) => setTimeout(res, 1000));
}

export async function unfollowUser(name) {
  await new Promise((res) => setTimeout(res, 1000));
}
```

</Sandpack>

리듀서는 새로운 `isFollowing` 값을 받아 새 팔로우 상태와 업데이트된 팔로워 수를 한 번의 업데이트로 계산합니다. 이렇게 하면 버튼 텍스트와 수가 항상 동기화됩니다.


<DeepDive>

#### 업데이터와 리듀서 중 선택하기 {/*choosing-between-updaters-and-reducers*/}

`useOptimistic`은 현재 state를 기반으로 state를 계산하는 두 가지 패턴을 지원합니다.

**업데이터 함수**는 [`useState` 업데이터](/reference/react/useState#updating-state-based-on-the-previous-state)처럼 동작합니다. setter에 함수를 전달하세요.

```js
const [optimistic, setOptimistic] = useOptimistic(value);
setOptimistic(current => !current);
```

**리듀서**는 업데이트 로직을 setter 호출과 분리합니다.

```js
const [optimistic, dispatch] = useOptimistic(value, (current, action) => {
  // current와 action을 기반으로 다음 state를 계산합니다.
});
dispatch(action);
```

setter 호출이 업데이트 내용을 자연스럽게 설명하는 계산에는 **업데이터를 사용하세요**. 이는 `useState`에서 `setState(prev => ...)`를 사용하는 것과 비슷합니다.

업데이트에 데이터(예: 추가할 항목)를 전달해야 하거나 하나의 Hook으로 여러 유형의 업데이트를 처리해야 할 때는 **리듀서를 사용하세요**.

**왜 리듀서를 사용하나요?**

Transition이 대기 중인 동안 기준 state가 변경될 수 있다면 리듀서가 필수적입니다. 추가 작업이 대기 중인 동안 `todos`가 변경되면(예: 다른 사용자가 todo를 추가한 경우), React는 새 `todos`로 리듀서를 다시 실행하여 무엇을 보여줄지 다시 계산합니다. 이렇게 하면 새 todo가 오래된 복사본이 아니라 최신 목록에 추가됩니다.

`setOptimistic(prev => [...prev, newItem])` 같은 업데이터 함수는 Transition이 시작된 시점의 state만 보게 되므로, 비동기 작업 중에 발생한 업데이트를 놓치게 됩니다.

</DeepDive>

---

### 목록에 낙관적으로 추가하기 {/*optimistically-adding-to-a-list*/}

목록에 항목을 낙관적으로 추가해야 할 때는 `reducer`를 사용하세요.

<Sandpack>

```js src/App.js
import { useState, startTransition } from 'react';
import { addTodo } from './actions.js';
import TodoList from './TodoList';

export default function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React' }
  ]);

  async function addTodoAction(newTodo) {
    const savedTodo = await addTodo(newTodo);
    startTransition(() => {
      setTodos(todos => [...todos, savedTodo]);
    });
  }

  return <TodoList todos={todos} addTodoAction={addTodoAction} />;
}
```

```js src/TodoList.js active
import { useOptimistic, startTransition } from 'react';

export default function TodoList({ todos, addTodoAction }) {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (currentTodos, newTodo) => [
      ...currentTodos,
      { id: newTodo.id, text: newTodo.text, pending: true }
    ]
  );

  function handleAddTodo(text) {
    const newTodo = { id: crypto.randomUUID(), text: text };
    startTransition(async () => {
      addOptimisticTodo(newTodo);
      await addTodoAction(newTodo);
    });
  }

  return (
    <div>
      <button onClick={() => handleAddTodo('New todo')}>Add Todo</button>
      <ul>
        {optimisticTodos.map(todo => (
          <li key={todo.id}>
            {todo.text} {todo.pending && "(Adding...)"}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/actions.js hidden
export async function addTodo(todo) {
  await new Promise((res) => setTimeout(res, 1000));
  // 실제 앱에서는 서버에 저장합니다.
  return { ...todo, pending: false };
}
```

</Sandpack>

`reducer`는 현재 todo 목록과 추가할 새 todo를 받습니다. 추가 작업이 대기 중인 동안 `todos` prop이 변경되면(예: 다른 사용자가 todo를 추가한 경우), React는 업데이트된 목록으로 리듀서를 다시 실행하여 낙관적 state를 업데이트하기 때문에 이것이 중요합니다. 이렇게 하면 새 todo가 오래된 복사본이 아니라 최신 목록에 추가됩니다.

<Note>

각 낙관적 항목은 `pending: true` 플래그를 포함하므로 개별 항목에 로딩 상태를 표시할 수 있습니다. 서버가 응답하고 부모가 저장된 항목으로 기준 `todos` 목록을 업데이트하면, 낙관적 state는 pending 플래그가 없는 확정된 항목으로 업데이트됩니다.

</Note>

---

### 여러 `action` 유형 처리하기 {/*handling-multiple-action-types*/}

여러 유형의 낙관적 업데이트(예: 항목 추가 및 제거)를 처리해야 할 때는 `action` 객체를 사용하는 리듀서 패턴을 사용하세요.

이 쇼핑 카트 예시는 하나의 리듀서로 추가와 제거를 처리하는 방법을 보여줍니다.

<Sandpack>

```js src/App.js
import { useState, startTransition } from 'react';
import { addToCart, removeFromCart, updateQuantity } from './actions.js';
import ShoppingCart from './ShoppingCart';

export default function App() {
  const [cart, setCart] = useState([]);

  const cartActions = {
    async add(item) {
      await addToCart(item);
      startTransition(() => {
        setCart(current => {
          const exists = current.find(i => i.id === item.id);
          if (exists) {
            return current.map(i =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            );
          }
          return [...current, { ...item, quantity: 1 }];
        });
      });
    },
    async remove(id) {
      await removeFromCart(id);
      startTransition(() => {
        setCart(current => current.filter(item => item.id !== id));
      });
    },
    async updateQuantity(id, quantity) {
      await updateQuantity(id, quantity);
      startTransition(() => {
        setCart(current =>
          current.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
        );
      });
    }
  };

  return <ShoppingCart cart={cart} cartActions={cartActions} />;
}
```

```js src/ShoppingCart.js active
import { useOptimistic, startTransition } from 'react';

export default function ShoppingCart({ cart, cartActions }) {
  const [optimisticCart, dispatch] = useOptimistic(
    cart,
    (currentCart, action) => {
      switch (action.type) {
        case 'add':
          const exists = currentCart.find(item => item.id === action.item.id);
          if (exists) {
            return currentCart.map(item =>
              item.id === action.item.id
                ? { ...item, quantity: item.quantity + 1, pending: true }
                : item
            );
          }
          return [...currentCart, { ...action.item, quantity: 1, pending: true }];
        case 'remove':
          return currentCart.filter(item => item.id !== action.id);
        case 'update_quantity':
          return currentCart.map(item =>
            item.id === action.id
              ? { ...item, quantity: action.quantity, pending: true }
              : item
          );
        default:
          return currentCart;
      }
    }
  );

  function handleAdd(item) {
    startTransition(async () => {
      dispatch({ type: 'add', item });
      await cartActions.add(item);
    });
  }

  function handleRemove(id) {
    startTransition(async () => {
      dispatch({ type: 'remove', id });
      await cartActions.remove(id);
    });
  }

  function handleUpdateQuantity(id, quantity) {
    startTransition(async () => {
      dispatch({ type: 'update_quantity', id, quantity });
      await cartActions.updateQuantity(id, quantity);
    });
  }

  const total = optimisticCart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div>
      <h2>Shopping Cart</h2>
      <div style={{ marginBottom: 16 }}>
        <button onClick={() => handleAdd({
          id: 1, name: 'T-Shirt', price: 25
        })}>
          Add T-Shirt ($25)
        </button>{' '}
        <button onClick={() => handleAdd({
          id: 2, name: 'Mug', price: 15
        })}>
          Add Mug ($15)
        </button>
      </div>
      {optimisticCart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <ul>
          {optimisticCart.map(item => (
            <li key={item.id}>
              {item.name} - ${item.price} ×
              {item.quantity}
              {' '}= ${item.price * item.quantity}
              <button
                onClick={() => handleRemove(item.id)}
                style={{ marginLeft: 8 }}
              >
                Remove
              </button>
              {item.pending && ' ...'}
            </li>
          ))}
        </ul>
      )}
      <p><strong>Total: ${total}</strong></p>
    </div>
  );
}
```

```js src/actions.js hidden
export async function addToCart(item) {
  await new Promise((res) => setTimeout(res, 800));
}

export async function removeFromCart(id) {
  await new Promise((res) => setTimeout(res, 800));
}

export async function updateQuantity(id, quantity) {
  await new Promise((res) => setTimeout(res, 800));
}
```

</Sandpack>

리듀서는 세 가지 `action` 유형(`add`, `remove`, `update_quantity`)을 처리하고 각각에 대한 새로운 낙관적 state를 반환합니다. 각 `action`은 `pending: true` 플래그를 설정하므로 [서버 함수](/reference/rsc/server-functions)가 실행되는 동안 시각적 피드백을 표시할 수 있습니다.

---

### 에러 복구를 포함한 낙관적 삭제 {/*optimistic-delete-with-error-recovery*/}

항목을 낙관적으로 삭제할 때는 Action이 실패하는 경우를 처리해야 합니다.

이 예시는 삭제가 실패했을 때 에러 메시지를 표시하고, UI가 자동으로 롤백되어 항목을 다시 보여주는 방법을 보여줍니다.

<Sandpack>

```js src/App.js
import { useState, startTransition } from 'react';
import { deleteItem } from './actions.js';
import ItemList from './ItemList';

export default function App() {
  const [items, setItems] = useState([
    { id: 1, name: 'Learn React' },
    { id: 2, name: 'Build an app' },
    { id: 3, name: 'Deploy to production' },
  ]);

  async function deleteAction(id) {
    await deleteItem(id);
    startTransition(() => {
      setItems(current => current.filter(item => item.id !== id));
    });
  }

  return <ItemList items={items} deleteAction={deleteAction} />;
}
```

```js src/ItemList.js active
import { useState, useOptimistic, startTransition } from 'react';

export default function ItemList({ items, deleteAction }) {
  const [error, setError] = useState(null);
  const [optimisticItems, removeItem] = useOptimistic(
    items,
    (currentItems, idToRemove) =>
      currentItems.map(item =>
        item.id === idToRemove
          ? { ...item, deleting: true }
          : item
      )
  );

  function handleDelete(id) {
    setError(null);
    startTransition(async () => {
      removeItem(id);
      try {
        await deleteAction(id);
      } catch (e) {
        setError(e.message);
      }
    });
  }

  return (
    <div>
      <h2>Your Items</h2>
      <ul>
        {optimisticItems.map(item => (
          <li
            key={item.id}
            style={{
              opacity: item.deleting ? 0.5 : 1,
              textDecoration: item.deleting ? 'line-through' : 'none',
              transition: 'opacity 0.2s'
            }}
          >
            {item.name}
            <button
              onClick={() => handleDelete(item.id)}
              disabled={item.deleting}
              style={{ marginLeft: 8 }}
            >
              {item.deleting ? 'Deleting...' : 'Delete'}
            </button>
          </li>
        ))}
      </ul>
      {error && (
        <p style={{ color: 'red', padding: 8, background: '#fee' }}>
          {error}
        </p>
      )}
    </div>
  );
}
```

```js src/actions.js hidden
export async function deleteItem(id) {
  await new Promise((res) => setTimeout(res, 1000));
  // 에러 복구를 보여주기 위해 항목 3은 항상 실패합니다.
  if (id === 3) {
    throw new Error('Cannot delete. Permission denied.');
  }
}
```

</Sandpack>

'Deploy to production'을 삭제해 보세요. 삭제가 실패하면 해당 항목이 목록에 자동으로 다시 나타납니다.

---

## 문제 해결 {/*troubleshooting*/}

### "An optimistic state update occurred outside a Transition or Action" 에러가 발생합니다 {/*an-optimistic-state-update-occurred-outside-a-transition-or-action*/}

다음 에러가 표시될 수 있습니다.

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

An optimistic state update occurred outside a Transition or Action. To fix, move the update to an Action, or wrap with `startTransition`.

</ConsoleLogLine>

</ConsoleBlockMulti>

낙관적 setter 함수는 `startTransition` 안에서 호출해야 합니다.

```js
// 🚩 잘못된 방식: Transition 밖에서 호출
function handleClick() {
  setOptimistic(newValue);  // 경고!
  // ...
}

// ✅ 올바른 방식: Transition 안에서 호출
function handleClick() {
  startTransition(async () => {
    setOptimistic(newValue);
    // ...
  });
}

// ✅ 이 방식도 올바릅니다: Action prop 안에서 호출
function submitAction(formData) {
  setOptimistic(newValue);
  // ...
}
```

Action 밖에서 setter를 호출하면 낙관적 state가 잠깐 나타났다가 즉시 원래 값으로 되돌아갑니다. Action이 실행되는 동안 낙관적 state를 "유지"할 Transition이 없기 때문에 이런 일이 발생합니다.

### "Cannot update optimistic state while rendering" 에러가 발생합니다 {/*cannot-update-optimistic-state-while-rendering*/}

다음 에러가 표시될 수 있습니다.

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Cannot update optimistic state while rendering.

</ConsoleLogLine>

</ConsoleBlockMulti>

이 에러는 컴포넌트의 렌더링 단계에서 낙관적 setter를 호출할 때 발생합니다. 이벤트 핸들러, Effect 또는 다른 콜백에서만 호출할 수 있습니다.

```js
// 🚩 잘못된 방식: 렌더링 중 호출
function MyComponent({ items }) {
  const [isPending, setPending] = useOptimistic(false);

  // 렌더링 중 실행됩니다. 허용되지 않습니다!
  setPending(true);

  // ...
}

// ✅ 올바른 방식: startTransition 안에서 호출
function MyComponent({ items }) {
  const [isPending, setPending] = useOptimistic(false);

  function handleClick() {
    startTransition(() => {
      setPending(true);
      // ...
    });
  }

  // ...
}

// ✅ 이 방식도 올바릅니다: Action에서 호출
function MyComponent({ items }) {
  const [isPending, setPending] = useOptimistic(false);

  function action() {
    setPending(true);
    // ...
  }

  // ...
}
```

### 낙관적 업데이트에 오래된 값이 표시됩니다 {/*my-optimistic-updates-show-stale-values*/}

낙관적 state가 오래된 데이터를 기반으로 하는 것처럼 보인다면, 현재 state를 기준으로 낙관적 state를 계산하도록 업데이터 함수나 리듀서 사용을 고려하세요.

```js
// Action 중 state가 변경되면 오래된 데이터를 표시할 수 있습니다.
const [optimistic, setOptimistic] = useOptimistic(count);
setOptimistic(5);  // count가 변경되어도 항상 5로 설정합니다.

// 더 나은 방식: 상대적 업데이트는 state 변경을 올바르게 처리합니다.
const [optimistic, adjust] = useOptimistic(count, (current, delta) => current + delta);
adjust(1);  // 현재 count 값이 무엇이든 항상 1을 더합니다.
```

자세한 내용은 [현재 state를 기반으로 state 업데이트하기](#updating-state-based-on-current-state)를 참고하세요.

### 낙관적 업데이트가 대기 중인지 알 수 없습니다 {/*i-dont-know-if-my-optimistic-update-is-pending*/}

`useOptimistic`이 대기 중인지 확인하려면 세 가지 옵션이 있습니다.

1. **`optimisticValue === value`인지 확인하기**

```js
const [optimistic, setOptimistic] = useOptimistic(value);
const isPending = optimistic !== value;
```

값이 같지 않다면 Transition이 진행 중인 것입니다.

2. **`useTransition` 추가하기**

```js
const [isPending, startTransition] = useTransition();
const [optimistic, setOptimistic] = useOptimistic(value);

//...
startTransition(() => {
  setOptimistic(state);
})
```

`useTransition`은 내부적으로 `isPending`에 `useOptimistic`을 사용하므로, 이는 옵션 1과 동일합니다.

3. **리듀서에 `pending` 플래그 추가하기**

```js
const [optimistic, addOptimistic] = useOptimistic(
  items,
  (state, newItem) => [...state, { ...newItem, isPending: true }]
);
```

각 낙관적 항목이 자체 플래그를 가지므로, 개별 항목에 로딩 상태를 표시할 수 있습니다.
