---
title: immutability
---

<Intro>

[불변인](/reference/rules/components-and-hooks-must-be-pure#props-and-state-are-immutable) props, state 및 기타 값을 변이하는 것을 검증합니다.

</Intro>

## 규칙 세부 사항 {/*rule-details*/}

컴포넌트의 props와 state는 불변 스냅샷입니다. 절대 직접 변이하지 마세요. 대신 새로운 props를 전달하고, `useState`의 setter 함수를 사용하세요.

## 일반적인 위반 사례 {/*common-violations*/}

### 잘못된 예 {/*invalid*/}

```js
// ❌ 배열 push 변이
function Component() {
  const [items, setItems] = useState([1, 2, 3]);

  const addItem = () => {
    items.push(4); // 변이!
    setItems(items); // 같은 참조, 리렌더링 안 됨
  };
}

// ❌ 객체 프로퍼티 할당
function Component() {
  const [user, setUser] = useState({name: 'Alice'});

  const updateName = () => {
    user.name = 'Bob'; // 변이!
    setUser(user); // 같은 참조
  };
}

// ❌ 스프레드 없이 정렬
function Component() {
  const [items, setItems] = useState([3, 1, 2]);

  const sortItems = () => {
    setItems(items.sort()); // sort는 변이함!
  };
}
```

### 올바른 예 {/*valid*/}

```js
// ✅ 새 배열 생성
function Component() {
  const [items, setItems] = useState([1, 2, 3]);

  const addItem = () => {
    setItems([...items, 4]); // 새 배열
  };
}

// ✅ 새 객체 생성
function Component() {
  const [user, setUser] = useState({name: 'Alice'});

  const updateName = () => {
    setUser({...user, name: 'Bob'}); // 새 객체
  };
}
```

## 문제 해결 {/*troubleshooting*/}

### 배열에 항목을 추가해야 하는 경우 {/*add-items-array*/}

`push()` 같은 메서드로 배열을 변이하면 리렌더링이 트리거되지 않습니다.

```js
// ❌ 잘못된 예: 배열 변이
function TodoList() {
  const [todos, setTodos] = useState([]);

  const addTodo = (id, text) => {
    todos.push({id, text});
    setTodos(todos); // 같은 배열 참조!
  };

  return (
    <ul>
      {todos.map(todo => <li key={todo.id}>{todo.text}</li>)}
    </ul>
  );
}
```

대신 새 배열을 생성하세요.

```js
// ✅ 더 나은 방법: 새 배열 생성
function TodoList() {
  const [todos, setTodos] = useState([]);

  const addTodo = (id, text) => {
    setTodos([...todos, {id, text}]);
    // 또는: setTodos(todos => [...todos, {id: Date.now(), text}])
  };

  return (
    <ul>
      {todos.map(todo => <li key={todo.id}>{todo.text}</li>)}
    </ul>
  );
}
```

### 중첩된 객체를 업데이트해야 하는 경우 {/*update-nested-objects*/}

중첩된 프로퍼티를 변이하면 리렌더링이 트리거되지 않습니다.

```js
// ❌ 잘못된 예: 중첩된 객체 변이
function UserProfile() {
  const [user, setUser] = useState({
    name: 'Alice',
    settings: {
      theme: 'light',
      notifications: true
    }
  });

  const toggleTheme = () => {
    user.settings.theme = 'dark'; // 변이!
    setUser(user); // 같은 객체 참조
  };
}
```

업데이트가 필요한 각 레벨에서 스프레드하세요.

```js
// ✅ 더 나은 방법: 각 레벨에서 새 객체 생성
function UserProfile() {
  const [user, setUser] = useState({
    name: 'Alice',
    settings: {
      theme: 'light',
      notifications: true
    }
  });

  const toggleTheme = () => {
    setUser({
      ...user,
      settings: {
        ...user.settings,
        theme: 'dark'
      }
    });
  };
}

```
