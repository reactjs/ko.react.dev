---
title: useOptimistic
---

<Intro>

`useOptimistic` 는 UI를 낙관적으로 업데이트할 수 있게 해주는 React Hook입니다.

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
* `updateFn(currentState, optimisticValue)`: 현재 상태와 addOptimistic에 전달된 낙관적인 값을 취하는 함수로, 결과적인 낙관적인 상태를 반환합니다. 순수 함수여야 합니다. `updateFn`은 두 개의 매개변수를 취합니다. `currentState`와 `optimisticValue`. 반환 값은 `currentState`와 `optimisticValue`의 병합된 값입니다.

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

When the button is clicked, `setIsPending(true)` uses optimistic state to immediately show "Submitting..." and disable the button. When the Action is done, `isPending` is rendered as `false` automatically.

This pattern automatically shows a pending state however `action` prop is used with `Button`:

```js
// Show pending state for a state update
<Button action={() => { setState(c => c + 1) }} />

// Show pending state for a navigation
<Button action={() => { navigate('/done') }} />

// Show pending state for a POST
<Button action={async () => { await fetch(/* ... */) }} />

// Show pending state for any combination
<Button action={async () => {
  setState(c => c + 1);
  await fetch(/* ... */);
  navigate('/done');
}} />
```

The pending state will be shown until everything in the `action` prop is finished.

<Note>

You can also use [`useTransition`](/reference/react/useTransition) to get pending state via `isPending`.

The difference is that `useTransition` gives you the `startTransition` function, while `useOptimistic` works with any Transition. Use whichever fits your component's needs.

</Note>

---

### Updating props or state optimistically {/*updating-props-or-state-optimistically*/}

You can wrap props or state in `useOptimistic` to update it immediately while an Action is in progress.

In this example, `LikeButton` receives `isLiked` as a prop and immediately toggles it when clicked:

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
  // In a real app, this would update the server
}
```

```js src/index.js hidden
import React from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById('root'));
// Not using StrictMode so double render logs are not shown.
root.render(<App />);
```

</Sandpack>

When the button is clicked, `setOptimisticIsLiked` immediately updates the displayed state to show the heart as liked. Meanwhile, `await toggleLike` runs in the background. When the `await` completes, `setIsLiked` parent updates the "real" `isLiked` state, and the optimistic state is rendered to match this new value.

<Note>

This example reads from `optimisticIsLiked` to calculate the next value. This works when the base state won't change, but if the base state might change while your Action is pending, you may want to use a state updater or the reducer.

See [Updating state based on the current state](#updating-state-based-on-current-state) for an example.

</Note>

---

### Updating multiple values together {/*updating-multiple-values-together*/}

When an optimistic update affects multiple related values, use a reducer to update them together. This ensures the UI stays consistent.

Here's a follow button that updates both the follow state and follower count:

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

The reducer receives the new `isFollowing` value and calculates both the new follow state and the updated follower count in a single update. This ensures the button text and count always stay in sync.


<DeepDive>

#### Choosing between updaters and reducers {/*choosing-between-updaters-and-reducers*/}

`useOptimistic` supports two patterns for calculating state based on current state:

**Updater functions** work like [useState updaters](/reference/react/useState#updating-state-based-on-the-previous-state). Pass a function to the setter:

```js
const [optimistic, setOptimistic] = useOptimistic(value);
setOptimistic(current => !current);
```

**Reducers** separate the update logic from the setter call:

```js
const [optimistic, dispatch] = useOptimistic(value, (current, action) => {
  // Calculate next state based on current and action
});
dispatch(action);
```

**Use updaters** for calculations where the setter call naturally describes the update. This is similar to using `setState(prev => ...)` with `useState`.

**Use reducers** when you need to pass data to the update (like which item to add) or when handling multiple types of updates with a single hook.

**Why use a reducer?**

Reducers are essential when the base state might change while your Transition is pending. If `todos` changes while your add is pending (for example, another user added a todo), React will re-run your reducer with the new `todos` to recalculate what to show. This ensures your new todo is added to the latest list, not an outdated copy.

An updater function like `setOptimistic(prev => [...prev, newItem])` would only see the state from when the Transition started, missing any updates that happened during the async work.

</DeepDive>

---

### Optimistically adding to a list {/*optimistically-adding-to-a-list*/}

When you need to optimistically add items to a list, use a `reducer`:

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
  // In a real app, this would save to the server
  return { ...todo, pending: false };
}
```

</Sandpack>

The `reducer` receives the current list of todos and the new todo to add. This is important because if the `todos` prop changes while your add is pending (for example, another user added a todo), React will update your optimistic state by re-running the reducer with the updated list. This ensures your new todo is added to the latest list, not an outdated copy.

<Note>

Each optimistic item includes a `pending: true` flag so you can show loading state for individual items. When the server responds and the parent updates the canonical `todos` list with the saved item, the optimistic state updates to the confirmed item without the pending flag.

</Note>

---

### Handling multiple `action` types {/*handling-multiple-action-types*/}

When you need to handle multiple types of optimistic updates (like adding and removing items), use a reducer pattern with `action` objects.

This shopping cart example shows how to handle add and remove with a single reducer:

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

The reducer handles three `action` types (`add`, `remove`, `update_quantity`) and returns the new optimistic state for each. Each `action` sets a `pending: true` flag so you can show visual feedback while the [Server Function](/reference/rsc/server-functions) runs.

---

### Optimistic delete with error recovery {/*optimistic-delete-with-error-recovery*/}

When deleting items optimistically, you should handle the case where the Action fails.

This example shows how to display an error message when a delete fails, and the UI automatically rolls back to show the item again.

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
  // Item 3 always fails to demonstrate error recovery
  if (id === 3) {
    throw new Error('Cannot delete. Permission denied.');
  }
}
```

</Sandpack>

Try deleting 'Deploy to production'. When the delete fails, the item automatically reappears in the list.

---

## Troubleshooting {/*troubleshooting*/}

### I'm getting an error: "An optimistic state update occurred outside a Transition or Action" {/*an-optimistic-state-update-occurred-outside-a-transition-or-action*/}

You may see this error:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

An optimistic state update occurred outside a Transition or Action. To fix, move the update to an Action, or wrap with `startTransition`.

</ConsoleLogLine>

</ConsoleBlockMulti>

The optimistic setter function must be called inside `startTransition`:

```js
// 🚩 Incorrect: outside a Transition
function handleClick() {
  setOptimistic(newValue);  // Warning!
  // ...
}

// ✅ Correct: inside a Transition
function handleClick() {
  startTransition(async () => {
    setOptimistic(newValue);
    // ...
  });
}

// ✅ Also correct: inside an Action prop
function submitAction(formData) {
  setOptimistic(newValue);
  // ...
}
```

When you call the setter outside an Action, the optimistic state will briefly appear and then immediately revert back to the original value. This happens because there's no Transition to "hold" the optimistic state while your Action runs.

### I'm getting an error: "Cannot update optimistic state while rendering" {/*cannot-update-optimistic-state-while-rendering*/}

You may see this error:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Cannot update optimistic state while rendering.

</ConsoleLogLine>

</ConsoleBlockMulti>

This error occurs when you call the optimistic setter during the render phase of a component. You can only call it from event handlers, effects, or other callbacks:

```js
// 🚩 Incorrect: calling during render
function MyComponent({ items }) {
  const [isPending, setPending] = useOptimistic(false);

  // This runs during render - not allowed!
  setPending(true);

  // ...
}

// ✅ Correct: calling inside startTransition
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

// ✅ Also correct: calling from an Action
function MyComponent({ items }) {
  const [isPending, setPending] = useOptimistic(false);

  function action() {
    setPending(true);
    // ...
  }

  // ...
}
```

### My optimistic updates show stale values {/*my-optimistic-updates-show-stale-values*/}

If your optimistic state seems to be based on old data, consider using an updater function or reducer to calculate the optimistic state relative to the current state.

```js
// May show stale data if state changes during Action
const [optimistic, setOptimistic] = useOptimistic(count);
setOptimistic(5);  // Always sets to 5, even if count changed

// Better: relative updates handle state changes correctly
const [optimistic, adjust] = useOptimistic(count, (current, delta) => current + delta);
adjust(1);  // Always adds 1 to whatever the current count is
```

See [Updating state based on the current state](#updating-state-based-on-current-state) for details.

### I don't know if my optimistic update is pending {/*i-dont-know-if-my-optimistic-update-is-pending*/}

To know when `useOptimistic` is pending, you have three options:

1. **Check if `optimisticValue === value`**

```js
const [optimistic, setOptimistic] = useOptimistic(value);
const isPending = optimistic !== value;
```

If the values are not equal, there's a Transition in progress.

2. **Add a `useTransition`**

```js
const [isPending, startTransition] = useTransition();
const [optimistic, setOptimistic] = useOptimistic(value);

//...
startTransition(() => {
  setOptimistic(state);
})
```

Since `useTransition` uses `useOptimistic` for `isPending` under the hood, this is equivalent to option 1.

3. **Add a `pending` flag in your reducer**

```js
const [optimistic, addOptimistic] = useOptimistic(
  items,
  (state, newItem) => [...state, { ...newItem, isPending: true }]
);
```

Since each optimistic item has its own flag, you can show loading state for individual items.
