---
title: state 로직을 reducer로 작성하기
---

<Intro>

한 컴포넌트에서 state 업데이트가 여러 이벤트 핸들러로 분산되는 경우가 있습니다. 이 경우 컴포넌트를 관리하기 어려워집니다. 따라서, 이 문제 해결을 위해 state를 업데이트하는 모든 로직을 *reducer*를 사용해 컴포넌트 외부로 단일 함수로 통합해 관리할 수 있습니다.

</Intro>

<YouWillLearn>

- reducer 함수란 무엇인가
- `useState`에서 `useReducer`로 리펙토링 하는 방법
- reducer를 언제 사용할 수 있는지
- reducer를 잘 작성하는 방법

</YouWillLearn>

## reducer를 사용하여 state 로직 통합하기 {/*consolidate-state-logic-with-a-reducer*/}

컴포넌트가 복잡해지면 컴포넌트의 state가 업데이트되는 다양한 경우를 한눈에 파악하기 어려워질 수 있습니다. 예를 들어, 아래의 `TaskApp` 컴포넌트는 state에 `tasks` 배열을 보유하고 있으며, 세 가지의 이벤트 핸들러를 사용하여 task를 추가, 제거 및 수정합니다:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, setTasks] = useState(initialTasks);

  function handleAddTask(text) {
    setTasks([...tasks, {
      id: nextId++,
      text: text,
      done: false
    }]);
  }

  function handleChangeTask(task) {
    setTasks(tasks.map(t => {
      if (t.id === task.id) {
        return task;
      } else {
        return t;
      }
    }));
  }

  function handleDeleteTask(taskId) {
    setTasks(
      tasks.filter(t => t.id !== taskId)
    );
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Visit Kafka Museum', done: true },
  { id: 1, text: 'Watch a puppet show', done: false },
  { id: 2, text: 'Lennon Wall pic', done: false },
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask
}) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task
            task={task}
            onChange={onChangeTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            onChange({
              ...task,
              text: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={e => {
          onChange({
            ...task,
            done: e.target.checked
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

각 이벤트 핸들러는 state를 업데이트하기 위해 `setTasks`를 호출합니다. 컴포넌트가 커질수록 그 안에서 state를 다루는 로직의 양도 늘어나게 됩니다. 복잡성를 줄이고 접근성을 높이기 위해서, 컴포넌트 내부에 있는 state 로직을 컴포넌트 외부의 **"reducer"라고 하는** 단일 함수로 옮길 수 있습니다.

reducer는 state를 다루는 다른 방법입니다. 다음과 같은 세가지 단계에 걸쳐 `useState`에서 `useReducer`로 바꿀 수 있습니다.

1. state를 설정하는 것에서 action을 dispatch 함수로 전달하는 것으로 **바꾸기**.
2. reducer 함수 **작성하기**.
3. 컴포넌트에서 reducer **사용하기**.

### 1단계: state를 설정하는 것에서 action을 dispatch 함수로 전달하는 것으로 바꾸기 {/*step-1-move-from-setting-state-to-dispatching-actions*/}

현재 이벤트 핸들러는 state를 설정함으로써 *무엇을 할 것인지*를 명시합니다.

```js
function handleAddTask(text) {
  setTasks([...tasks, {
    id: nextId++,
    text: text,
    done: false
  }]);
}

function handleChangeTask(task) {
  setTasks(tasks.map(t => {
    if (t.id === task.id) {
      return task;
    } else {
      return t;
    }
  }));
}

function handleDeleteTask(taskId) {
  setTasks(
    tasks.filter(t => t.id !== taskId)
  );
}
```

위 코드에서 state 설정 관련 로직을 전부 지워보세요. 다음과 같이 세가지 이벤트 핸들러가 남습니다.

- 사용자가 "Add" 를 눌렀을 때 호출되는 `handleAddTask(text)`
- 사용자가 task를 토글하거나 "저장"을 누르면 호출되는 `handleChangeTask(task)`
- 사용자가 "Delete" 를 누르면 호출되는 `handleDeleteTask(taskId)`

reducer를 사용한 state 관리는 state 직접 설정하는 것과 약간 다릅니다. state를 설정하여 React에게 “무엇을 할 지”를 지시하는 대신, 이벤트 핸들러에서 “action”을 전달하여 “사용자가 방금 한 일”을 지정합니다. (state 업데이트 로직은 다른 곳에 있습니다!) 즉, 이벤트 핸들러를 통해 ”`tasks`를 설정”하는 대신 “task를 추가/변경/삭제”하는 action을 전달하는 것입니다. 이러한 방식이 사용자의 의도를 더 명확하게 설명합니다.

```js
function handleAddTask(text) {
  dispatch({
    type: 'added',
    id: nextId++,
    text: text,
  });
}

function handleChangeTask(task) {
  dispatch({
    type: 'changed',
    task: task
  });
}

function handleDeleteTask(taskId) {
  dispatch({
    type: 'deleted',
    id: taskId
  });
}
```

`dispatch` 함수에 넣어준 객체를 "action" 이라고 합니다.

```js {3-7}
function handleDeleteTask(taskId) {
  dispatch(
    // "action" 객체:
    {
      type: 'deleted',
      id: taskId
    }
  );
}
```

이 객체는 일반적인 자바스크립트 객체입니다. 이 안에 어떤 것이든 자유롭게 넣을 수 있지만, 일반적으로 *어떤 상황이 발생하는지*에 대한 최소한의 정보를 담고 있어야합니다. (`dispatch` 함수 자체에 대한 부분은 이후 단계에서 다룰 예정입니다.)

<Note>

action 객체는 어떤 형태든 될 수 있습니다. 그렇지만 발생한 일을 설명하는 문자열 `type` 을 넘겨주고 이외의 정보는 다른 필드에 담아서 전달하도록 작성하는 게 일반적입니다. `type`은 컴포넌트에 따라 값이 다르며 이 예시의 경우 `'added'` 또는 `'added_task'` 둘 다 괜찮습니다. 무슨 일이 일어나는지를 설명할 수 있는 이름을 넣어주면 됩니다.

```js
dispatch({
  // 컴포넌트마다 다른 값
  type: 'what_happened',
  // 다른 필드는 이곳에
});
```

</Note>

### 2단계: reducer 함수 작성하기 {/*step-2-write-a-reducer-function*/}

reducer 함수는 state에 대한 로직을 넣는 곳 입니다. 이 함수는 현재의 state 값과 action 객체, 이렇게 두 개의 인자를 받고 다음 state 값을 반환합니다.

```js
function yourReducer(state, action) {
  // React가 설정하게될 다음 state 값을 반환합니다.
}
```

React는 reducer에서 반환한 값을 state에 설정합니다.

이 예시에서 이벤트 핸들러에 구현 되어있는 state 설정과 관련 로직을 reducer 함수로 옮기기 위해서 다음과 같이 해보겠습니다.

1. 첫 번째 인자에 현재 state (`tasks`) 선언하기.
2. 두 번째 인자에 `action` 객체 선언하기.
3. reducer에서 *다음* state 반환하기. (React가 state에 설정하게 될 값)

다음은 state 설정과 관련 모든 로직을 reducer 함수로 마이그레이션한 코드입니다.

```js
function tasksReducer(tasks, action) {
  if (action.type === 'added') {
    return [...tasks, {
      id: action.id,
      text: action.text,
      done: false
    }];
  } else if (action.type === 'changed') {
    return tasks.map(t => {
      if (t.id === action.task.id) {
        return action.task;
      } else {
        return t;
      }
    });
  } else if (action.type === 'deleted') {
    return tasks.filter(t => t.id !== action.id);
  } else {
    throw Error('Unknown action: ' + action.type);
  }
}
```

reducer 함수는 state(`tasks`)를 인자로 받고 있기 때문에, 이를 **컴포넌트 외부에서 선언**할 수 있습니다. 이렇게 하면 들여쓰기 수준이 줄어들고 코드를 더 쉽게 읽을 수 있습니다.

<Note>

위 코드에서 if/else 문을 사용하고 있지만 reducer 함수 안에서는 [switch 문](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/switch)을 사용하는 게 규칙입니다. 물론 결과는 같지만, switch 문으로 작성하는 것이 한눈에 읽기 더 쉬울 수 있습니다. 이제부터 이 문서에서 다룰 예시는 아래처럼 switch 문을 사용합니다.

```js
function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

각자 다른 `case` 속에서 선언된 변수들이 서로 충돌하지 않도록 `case` 블록을 중괄호인 `{`와 `}`로 감싸는 걸 추천합니다. 또 `case`는 일반적인 경우라면 `return`으로 끝나야합니다. `return` 하는 것을 잊으면 코드가 다음 case로 "떨어져" 실수할 수 있습니다!

아직 switch 문에 익숙하지 않다면, if/else 문을 사용해도 괜찮습니다.

</Note>

<DeepDive>

#### 왜 reducer라고 부르게 되었을까요? {/*why-are-reducers-called-this-way*/}

reducer를 사용하면 컴포넌트 내부의 코드 양을 "줄일 수" 있지만, 실제로는 배열에서 사용하는 [`reduce()`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) 연산의 이름에서 따 명명되었습니다.

`reduce()`는 배열의 여러 값을 단일 값으로 "누적"하는 연산을 수행합니다.

```js
const arr = [1, 2, 3, 4, 5];
const sum = arr.reduce(
  (result, number) => result + number
); // 1 + 2 + 3 + 4 + 5
```

`reduce`로 전달하는 함수는 "reducer"로 알려져 있습니다. 이 함수는 지금까지의 결과(result)와 현재 아이템(number)을 인자로 받고 다음 결과를 반환합니다. 비슷한 아이디어의 예로 React의 reducer는 지금까지의 state와 action을 인자로 받고 다음 state를 반환합니다. 이 과정에서 여러 action을 누적하여 state로 반환합니다.

`initialState`와 reducer 함수를 넘겨 받아 최종적인 state 값으로 계산하기 위한 `action` 배열을 인자로 받는 `reduce()` 메서드를 사용할 수도 있습니다.

<Sandpack>

```js src/index.js active
import tasksReducer from './tasksReducer.js';

let initialState = [];
let actions = [
  { type: 'added', id: 1, text: 'Visit Kafka Museum' },
  { type: 'added', id: 2, text: 'Watch a puppet show' },
  { type: 'deleted', id: 1 },
  { type: 'added', id: 3, text: 'Lennon Wall pic' },
];

let finalState = actions.reduce(
  tasksReducer,
  initialState
);

const output = document.getElementById('output');
output.textContent = JSON.stringify(
  finalState,
  null,
  2
);
```

```js src/tasksReducer.js
export default function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```html public/index.html
<pre id="output"></pre>
```

</Sandpack>

여러분이 직접 구현 할 일은 거의 없지만 위 예시는 React에 구현되어 있는 것과 비슷합니다!

</DeepDive>

### 3단계: 컴포넌트에서 reducer 사용하기 {/*step-3-use-the-reducer-from-your-component*/}

마지막으로 컴포넌트에 `tasksReducer`를 연결할 차례입니다. React에서 `useReducer` hook을 불러와주세요.

```js
import { useReducer } from 'react';
```

그런 다음, `useState`를

```js
const [tasks, setTasks] = useState(initialTasks);
```

아래 처럼 `useReducer`로 바꿔주세요.

```js
const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
```

`useReducer` 훅은 초기 state 값을 입력받아 유상태(stateful) 값을 반환한다는 점과 state를 설정하는 함수(useReducer의 경우는 dispatch 함수를 의미)의 원리를 보면 `useState`와 비슷합니다. 하지만 조금 다른 점이 있습니다.

`useReducer` 훅은 두 개의 인자를 넘겨받습니다.

1. reducer 함수
2. 초기 state 값

그리고 아래와 같이 반환합니다.

1. state를 담을 수 있는 값
2. dispatch 함수 (사용자의 action을 reducer 함수에게 "전달하게 될")

이제 준비가 다 되었습니다! 아래 예시의 컴포넌트 파일 아래에는 reducer가 선언되어 있습니다.

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Visit Kafka Museum', done: true },
  { id: 1, text: 'Watch a puppet show', done: false },
  { id: 2, text: 'Lennon Wall pic', done: false }
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask
}) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task
            task={task}
            onChange={onChangeTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            onChange({
              ...task,
              text: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={e => {
          onChange({
            ...task,
            done: e.target.checked
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

아래 처럼 reducer를 다른 파일로 분리하는 것도 가능합니다.

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import tasksReducer from './tasksReducer.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Visit Kafka Museum', done: true },
  { id: 1, text: 'Watch a puppet show', done: false },
  { id: 2, text: 'Lennon Wall pic', done: false },
];
```

```js src/tasksReducer.js
export default function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask
}) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task
            task={task}
            onChange={onChangeTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            onChange({
              ...task,
              text: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={e => {
          onChange({
            ...task,
            done: e.target.checked
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

관심사를 분리하면 컴포넌트의 로직은 읽기 더 쉬워질 수 있습니다. 이렇게 하면 이벤트 핸들러는 action을 전달해줘서 *무슨 일이 일어났는지*에 관련한 것만 명시하면 되고 reducer 함수는 이에 대한 응답으로 *state가 어떤 값으로 업데이트 될지*를 결정하기만 하면 됩니다.

## `useState`와 `useReducer` 비교하기 {/*comparing-usestate-and-usereducer*/}

reducer가 좋은 점만 있는 것은 아닙니다! 아래에서 `useState`와 `useReducer`를 비교할 수 있는 몇 가지 방법을 소개하겠습니다.

- **코드 크기:** 일반적으로 `useState`를 사용하면, 미리 작성해야 하는 코드가 줄어듭니다. `useReducer`를 사용하면 reducer 함수 *그리고* action을 전달하는 부분 둘 다 작성해야 합니다. 하지만 여러 이벤트 핸들러에서 비슷한 방식으로 state를 업데이트하는 경우, `useReducer`를 사용하면 코드의 양을 줄이는 데 도움이 될 수 있습니다.

- **가독성:** `useState`로 간단한 state를 업데이트하는 경우 가독성이 좋은 편입니다. 그렇지만 더 복잡한 구조의 state를 다루게 되면 컴포넌트의 코드 양이 더 많아져 한눈에 읽기 어려워질 수 있습니다. 이 경우 `useReducer`를 사용하면 업데이트 로직이 *어떻게 동작하는지*와 이벤트 핸들러를 통해서 *무엇이 발생했는지* 구현한 부분을 명확하게 구분할 수 있습니다.

- **디버깅:** `useState`를 사용하며 버그를 발견했을 때, *왜*, *어디서* state가 잘못 설정됐는지 찾기 어려울 수 있습니다. `useReducer`를 사용하면, 콘솔 로그를 reducer에 추가하여 state가 업데이트되는 모든 부분과 *왜* 해당 버그가 발생했는지(어떤 `action`으로 인한 것인지)를 확인할 수 있습니다. 각 `action`이 올바르게 작성되어 있다면, 버그를 발생시킨 부분이 reducer 로직 자체에 있다는 것을 알 수 있을 것입니다. 그렇지만 `useState`를 사용하는 경우보다 더 많은 코드를 단계별로 실행해서 디버깅 해야 하는 점이 있기도 합니다.

- **테스팅:** reducer는 컴포넌트에 의존하지 않는 순수 함수입니다. 이는 reducer를 독립적으로 분리해서 내보내거나 테스트할 수 있다는 것을 의미합니다. 일반적으로 더 현실적인 환경에서 컴포넌트를 테스트하는 것이 좋지만, 복잡한 state를 업데이트하는 로직의 경우 reducer가 특정 초기 state 및 action에 대해 특정 state를 반환한다고 생각하고 테스트하는 것이 유용할 수 있습니다.

- **개인적인 취향:** reducer를 좋아하는 사람도 있지만, 그렇지 않는 사람들도 있습니다. 괜찮습니다. 이건 선호도의 문제이니까요. `useState`와 `useReducer`는 동일한 방식이기 때문에 언제나 마음대로 바꿔서 사용해도 무방합니다.

만약 일부 컴포넌트에서 잘못된 방식으로 state를 업데이트하는 것으로 인한 버그가 자주 발생하거나 해당 코드에 더 많은 구조를 도입하고 싶다면 reducer 사용을 권장합니다. 이때 모든 부분에 reducer를 적용하지 않아도 됩니다. `useState`와 `useReducer`를 마음대로 섞고 매치하세요! 이 둘은 심지어 같은 컴포넌트 안에서도 사용할 수 있습니다.

## reducer 잘 작성하기 {/*writing-reducers-well*/}

reducer를 작성할 때, 다음과 같은 두 가지 팁을 명심하세요.

- **Reducers는 반드시 순수해야 합니다.** [state updater functions](/learn/queueing-a-series-of-state-updates)와 비슷하게, reducer는 렌더링 중에 실행됩니다! (action은 다음 렌더링까지 대기합니다.) 이것은 reducer는 [반드시 순수](/learn/keeping-components-pure)해야한다는 걸 의미합니다.—즉, 입력 값이 같다면 결과 값도 항상 같아야 합니다. 요청을 보내거나 timeout을 스케쥴링하거나 사이드 이펙트(컴포넌트 외부에 영향을 미치는 작업)을 수행해서는 안 됩니다. reducer는 [objects](/learn/updating-objects-in-state)와 [arrays](/learn/updating-arrays-in-state)을 변이 없이 업데이트해야 합니다.

- **각 action은 데이터 안에서 여러 변경들이 있더라도 하나의 사용자 상호작용을 설명해야 합니다.** 예를 들어, 사용자가 reducer가 관리하는 5개의 필드가 있는 양식에서 ‘재설정’을 누른 경우, 5개의 개별 `set_field` action보다는 하나의 `reset_form` action을 전송하는 것이 더 합리적입니다. 모든 action을 reducer에 기록하면 어떤 상호작용이나 응답이 어떤 순서로 일어났는지 재구성할 수 있을 만큼 로그가 명확해야 합니다. 이는 디버깅에 도움이 됩니다!

## Immer로 간결한 reducer 작성하기 {/*writing-concise-reducers-with-immer*/}

일반적인 state에서 [객체](/learn/updating-objects-in-state#write-concise-update-logic-with-immer)와 [배열](/learn/updating-arrays-in-state#write-concise-update-logic-with-immer)을 업데이트 하는 것처럼, Immer 라이브러리를 사용하면 reducer를 더 간결하게 작성할 수 있습니다. 이 라이브러리에서 제공하는 [`useImmerReducer`](https://github.com/immerjs/use-immer#useimmerreducer)를 사용하여 `push` 또는 `arr[i] =` 로 값을 할당하므로써 state를 변경해보겠습니다.

<Sandpack>

```js src/App.js
import { useImmerReducer } from 'use-immer';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

function tasksReducer(draft, action) {
  switch (action.type) {
    case 'added': {
      draft.push({
        id: action.id,
        text: action.text,
        done: false
      });
      break;
    }
    case 'changed': {
      const index = draft.findIndex(t =>
        t.id === action.task.id
      );
      draft[index] = action.task;
      break;
    }
    case 'deleted': {
      return draft.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default function TaskApp() {
  const [tasks, dispatch] = useImmerReducer(
    tasksReducer,
    initialTasks
  );

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Visit Kafka Museum', done: true },
  { id: 1, text: 'Watch a puppet show', done: false },
  { id: 2, text: 'Lennon Wall pic', done: false },
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask
}) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task
            task={task}
            onChange={onChangeTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            onChange({
              ...task,
              text: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={e => {
          onChange({
            ...task,
            done: e.target.checked
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

reducer는 순수해야 하기 때문에, 이 안에서는 state를 변형할 수 없습니다. 그러나, Immer에서 제공하는 특별한 `draft`객체를 사용하면 안전하게 state를 변형할 수 있습니다. 내부적으로, Immer는 변경 사항이 반영된 `초안(draft)`으로 state의 복사본을 생성합니다. 이것이 `useImmerReducer` 가 관리하는 reducer가 첫 번째 인수인 state를 변형할 수 있고 새로운 state 값을 반환할 필요가 없는 이유입니다.

## 요약 {/*요약*/}

- `useState`에서 `useReducer`로 변환하려면:
  1. 이벤트 핸들러에서 action을 전달합니다.
  2. 주어진 state와 action에 대해 다음 state를 반환하는 reducer 함수를 작성합니다.
  3. `useState`를 `useReducer`로 바꿉니다.
- reducer를 사용하면 코드를 조금 더 작성해야 하지만 디버깅과 테스트에 도움이 됩니다.
- reducer는 반드시 순수해야 합니다.
- 각 action은 단일 사용자 상호작용을 설명해야 합니다.
- 객체와 배열을 변이하는 스타일로 reducer를 작성하려면 Immer 라이브러리를 사용하세요.

<Challenges>

#### 이벤트 핸들러에서 action 전달하기 {/*dispatch-actions-from-event-handlers*/}

현재 `ContactList.js`와 `Chat.js`의 이벤트 핸들러 안에는 `// TODO` 주석이 있습니다. 이 때문에 input에 값을 입력해도 동작하지 않고 탭 버튼을 클릭해도 선택된 수신인이 변경할 수 없습니다.

`// TODO` 주석이 있는 부분을 지우고 상황에 맞는 action을 `전달(dispatch)`하는 코드를 작성해보세요. action에 대한 힌트를 얻고 싶다면 `messengerReducer.js`에 구현된 reducer를 확인해보세요. 이 reducer는 이미 작성되어있기 때문에 변경할 필요가 없습니다. 여러분은 `ContactList.js`와 `Chat.js`에 action을 담아 전달하는 코드를 작성하기만 하면 됩니다.

<Hint>

`dispatch` 함수는 컴포넌트의 prop으로 전달되기 때문에 이미 두 컴포넌트 모두에서 사용할 수 있습니다. 따라서 알맞은 action 객체를 담아 `dispatch` 를 호출하면 됩니다.

action 객체를 어떻게 작성해야하는지 확인하고 싶다면, reducer를 보고 어떤 `action` 필드가 들어갈지 유추할 수 있습니다. reducer에 정의된 `changed_selection`의 경우를 예를 들어 보겠습니다.

```js
case 'changed_selection': {
  return {
    ...state,
    selectedId: action.contactId
  };
}
```

action 객체가 `type: 'changed_selection'`을 갖고 있어야 한다는 것을 의미합니다. 또, `action.contactId`가 사용되고 있는 것으로 보아, action 객체에 프로퍼티로 `contactId`를 포함시켜야 한다는 것을 알 수 있습니다.

</Hint>

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import {
  initialState,
  messengerReducer
} from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(
    messengerReducer,
    initialState
  );
  const message = state.message;
  const contact = contacts.find(c =>
    c.id === state.selectedId
  );
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello'
};

export function messengerReducer(
  state,
  action
) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: ''
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              // TODO: dispatch changed_selection
            }}>
              {selectedId === contact.id ? (
                <b>{contact.name}</b>
              ) : (
                contact.name
              )}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({
  contact,
  message,
  dispatch
}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={e => {
          // TODO: dispatch edited_message
          // (Read the input value from e.target.value)
        }}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

reducer의 코드를 보고 action에 필요한 것을 다음과 같이 유추해볼 수 있습니다.

```js
// 사용자가 "Alice"를 눌렀을 때
dispatch({
  type: 'changed_selection',
  contactId: 1
});

// 사용자가 "Hello!"를 입력했을 때
dispatch({
  type: 'edited_message',
  message: 'Hello!'
});
```

아래 코드는 알맞은 메시지를 전달하도록 수정한 코드입니다.

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import {
  initialState,
  messengerReducer
} from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(
    messengerReducer,
    initialState
  );
  const message = state.message;
  const contact = contacts.find(c =>
    c.id === state.selectedId
  );
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello'
};

export function messengerReducer(
  state,
  action
) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: ''
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              dispatch({
                type: 'changed_selection',
                contactId: contact.id
              });
            }}>
              {selectedId === contact.id ? (
                <b>{contact.name}</b>
              ) : (
                contact.name
              )}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({
  contact,
  message,
  dispatch
}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={e => {
          dispatch({
            type: 'edited_message',
            message: e.target.value
          });
        }}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

</Solution>

#### message 전송 시, input 입력 값 지우기 {/*clear-the-input-on-sending-a-message*/}

현재까지의 예시 코드를 실행 했을 때는 "Send"를 눌러도 아무런 일이 일어나지 않습니다. "Send" 버튼에 이벤트 핸들러를 추가하기 위해서 아래처럼 코드를 작성해봅시다.

1. 수신자의 email과 message를 담은 `경고창(alert)` 표시하기.
2. input의 message 값 지우기

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import {
  initialState,
  messengerReducer
} from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(
    messengerReducer,
    initialState
  );
  const message = state.message;
  const contact = contacts.find(c =>
    c.id === state.selectedId
  );
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello'
};

export function messengerReducer(
  state,
  action
) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: ''
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              dispatch({
                type: 'changed_selection',
                contactId: contact.id
              });
            }}>
              {selectedId === contact.id ? (
                <b>{contact.name}</b>
              ) : (
                contact.name
              )}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/Chat.js active
import { useState } from 'react';

export default function Chat({
  contact,
  message,
  dispatch
}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={e => {
          dispatch({
            type: 'edited_message',
            message: e.target.value
          });
        }}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

"Send" 버튼의 이벤트 핸들러에서 이를 구현할 수 있는 몇가지 방법이 있습니다. 그중 한 가지 방법은 경고창(alert)을 표시한 다음, `message`를 빈값으로 설정하기 위해 `edited_message` action을 전달하는 것입니다.

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import {
  initialState,
  messengerReducer
} from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(
    messengerReducer,
    initialState
  );
  const message = state.message;
  const contact = contacts.find(c =>
    c.id === state.selectedId
  );
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello'
};

export function messengerReducer(
  state,
  action
) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: ''
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              dispatch({
                type: 'changed_selection',
                contactId: contact.id
              });
            }}>
              {selectedId === contact.id ? (
                <b>{contact.name}</b>
              ) : (
                contact.name
              )}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/Chat.js active
import { useState } from 'react';

export default function Chat({
  contact,
  message,
  dispatch
}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={e => {
          dispatch({
            type: 'edited_message',
            message: e.target.value
          });
        }}
      />
      <br />
      <button onClick={() => {
        alert(`Sending "${message}" to ${contact.email}`);
        dispatch({
          type: 'edited_message',
          message: '',
        });
      }}>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

잘 동작하기 때문에 "Send" 버튼을 누르면 input의 입력값이 잘 지워질 것입니다.

하지만 *사용자의 관점에서 봤을 때*, message를 전송하는 것과 input 필드에 텍스트를 입력하는 것은 다른 행위입니다. 이를 반영하기 위해 `send_message`라는 *새로운* action을 만들어서 reducer에서 별도로 분리하여 작성해보겠습니다.

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import {
  initialState,
  messengerReducer
} from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(
    messengerReducer,
    initialState
  );
  const message = state.message;
  const contact = contacts.find(c =>
    c.id === state.selectedId
  );
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/messengerReducer.js active
export const initialState = {
  selectedId: 0,
  message: 'Hello'
};

export function messengerReducer(
  state,
  action
) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: ''
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message
      };
    }
    case 'sent_message': {
      return {
        ...state,
        message: ''
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              dispatch({
                type: 'changed_selection',
                contactId: contact.id
              });
            }}>
              {selectedId === contact.id ? (
                <b>{contact.name}</b>
              ) : (
                contact.name
              )}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/Chat.js active
import { useState } from 'react';

export default function Chat({
  contact,
  message,
  dispatch
}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={e => {
          dispatch({
            type: 'edited_message',
            message: e.target.value
          });
        }}
      />
      <br />
      <button onClick={() => {
        alert(`Sending "${message}" to ${contact.email}`);
        dispatch({
          type: 'sent_message',
        });
      }}>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

결과적으로 두 방법은 동일하게 동작합니다. 그렇지만 action 객체의 type은 "state가 어떻게 변경되길 원하는지"보다, "사용자가 무엇을 했는지"를 이상적으로 설명해야 한다는 점을 명심하세요. 이렇게 하면 이후에 기능을 추가하기 훨씬 더 수월해집니다.

두 해결책 모두 reducer 안에서 `alert`를 **작성하지 않는** 것이 중요합니다. reducer는 순수함수이어야 하므로, 이 안에서는 오직 다음 state 값을 계산하기 위한 작업만 해야 합니다. 사용자에게 message를 보여주는 것을 포함한 다른 어떤 것도 "수행하지 않아야" 합니다. 이런 부분은 이벤트 핸들러 안에서 수행해야 합니다. (이 같은 실수를 방지하기 위해 React는 Strict 모드에서 reducer를 여러 번 호출합니다. 이 부분이 바로 reducer 안에 alert를 넣으면 두 번 실행되는 이유입니다.)

</Solution>

#### 탭 전환 시, input 입력 값 복원하기 {/*restore-input-values-when-switching-between-tabs*/}

이 예시에서 선택된 수신자를 바꾸기 위해 탭 버튼을 누르면 message를 입력받는 input 필드의 텍스트 값이 항상 지워지도록 되어있습니다.

```js
case 'changed_selection': {
  return {
    ...state,
    selectedId: action.contactId,
    message: '' // input 입력 값을 지우는 부분
  };
```

이렇게 하는 이유는 각 수신자 사이에서 한개의 message 입력 값을 공유하고 싶지 않기 때문입니다. 그런데 이런 방식보다, 앱이 각 연락처에 대한 message 입력 값을 별도로 "기억"하여 선택된 연락처가 전환할 때마다 기억 했던 값을 복원하도록 하는 것이 더 나을 것입니다.

여러분이 할 일은 *각 연락처 마다* 별도로 message의 초기 값을 기억할 수 있도록 state의 구조를 바꾸는 것입니다. 이 때, reducer, 초기 state 값 그리고 컴포넌트를 조금씩 변경해야할 것입니다.

<Hint>

state를 다음과 같이 구조화할 수 있습니다.

```js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor', // contactId = 0의 message 초기 값
    1: 'Hello, Alice' // contactId = 1의 message 초기 값
  },
};
```

`[key]: value` [계산된 프로퍼티명](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Object_initializer#계산된_프로퍼티명) 문법은 `messages` 객체를 업데이트하는데 도움이 됩니다.

```js
{
  ...state.messages,
  [id]: message
}
```

</Hint>

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import {
  initialState,
  messengerReducer
} from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(
    messengerReducer,
    initialState
  );
  const message = state.message;
  const contact = contacts.find(c =>
    c.id === state.selectedId
  );
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello'
};

export function messengerReducer(
  state,
  action
) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: ''
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message
      };
    }
    case 'sent_message': {
      return {
        ...state,
        message: ''
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              dispatch({
                type: 'changed_selection',
                contactId: contact.id
              });
            }}>
              {selectedId === contact.id ? (
                <b>{contact.name}</b>
              ) : (
                contact.name
              )}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({
  contact,
  message,
  dispatch
}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={e => {
          dispatch({
            type: 'edited_message',
            message: e.target.value
          });
        }}
      />
      <br />
      <button onClick={() => {
        alert(`Sending "${message}" to ${contact.email}`);
        dispatch({
          type: 'sent_message',
        });
      }}>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

reducer는 각 연락처마다 별도의 message 초기 값을 저장하고 업데이트할 수 있도록 바꿔야합니다.

```js
// input 텍스트 값이 수정될 때
case 'edited_message': {
  return {
    // selectedId와 같은 다른 state 값은 유지합니다.
    ...state,
    messages: {
      // 다른 연락처의 message 값들은 유지 시키지만,
      ...state.messages,
      // 선택된 연락처의 message는 바꿉니다.
      [state.selectedId]: action.message
    }
  };
}
```

현재 선택된 연락처의 message를 읽기 위해서 `Messenger` 컴포넌트의 코드 또한 수정해야 합니다.

```js
const message = state.messages[state.selectedId];
```

완성된 코드는 다음과 같습니다.

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import {
  initialState,
  messengerReducer
} from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(
    messengerReducer,
    initialState
  );
  const message = state.messages[state.selectedId];
  const contact = contacts.find(c =>
    c.id === state.selectedId
  );
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor',
    1: 'Hello, Alice',
    2: 'Hello, Bob'
  }
};

export function messengerReducer(
  state,
  action
) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message
        }
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: ''
        }
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              dispatch({
                type: 'changed_selection',
                contactId: contact.id
              });
            }}>
              {selectedId === contact.id ? (
                <b>{contact.name}</b>
              ) : (
                contact.name
              )}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/Chat.js
import { useState } from 'react';

export default function Chat({
  contact,
  message,
  dispatch
}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={e => {
          dispatch({
            type: 'edited_message',
            message: e.target.value
          });
        }}
      />
      <br />
      <button onClick={() => {
        alert(`Sending "${message}" to ${contact.email}`);
        dispatch({
          type: 'sent_message',
        });
      }}>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

특히 다른 동작을 구현하기 위해 이벤트 핸들러를 변경할 필요가 없습니다. reducer를 사용하지 않았더라면, state를 업데이트하는 모든 이벤트 핸들러를 변경해야 했을 것입니다.

</Solution>

#### 처음부터 `useReducer` 구현해보기 {/*implement-usereducer-from-scratch*/}

앞선 예시들에서는, `useReducer` hook을 React에서 불러와 사용했습니다. 이번에는 *`useReducer` 훅 자체*를 직접 구현해 볼 것입니다! 다음은 시작을 위한 스탭입니다. 10줄 이상의 코드를 작성할 필요가 없습니다.

변경 사항을 테스트하려면 input에 텍스트를 입력하거나 연락처를 선택해보세요.

<Hint>

다음은 구현에 대한 더 자세한 밑그림입니다.

```js
export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    // ???
  }

  return [state, dispatch];
}
```

reducer 함수는 두 개의 인수인 현재 state와 action 객체를 입력받고 다음 state를 반환한다는 것을 떠올려보세요. `dispatch` 를 구현하려면 무엇을 해야 할까요?

</Hint>

<Sandpack>

```js src/App.js
import { useReducer } from './MyReact.js';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import {
  initialState,
  messengerReducer
} from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(
    messengerReducer,
    initialState
  );
  const message = state.messages[state.selectedId];
  const contact = contacts.find(c =>
    c.id === state.selectedId
  );
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor',
    1: 'Hello, Alice',
    2: 'Hello, Bob'
  }
};

export function messengerReducer(
  state,
  action
) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message
        }
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: ''
        }
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/MyReact.js active
import { useState } from 'react';

export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  // ???

  return [state, dispatch];
}
```

```js src/ContactList.js hidden
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              dispatch({
                type: 'changed_selection',
                contactId: contact.id
              });
            }}>
              {selectedId === contact.id ? (
                <b>{contact.name}</b>
              ) : (
                contact.name
              )}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/Chat.js hidden
import { useState } from 'react';

export default function Chat({
  contact,
  message,
  dispatch
}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={e => {
          dispatch({
            type: 'edited_message',
            message: e.target.value
          });
        }}
      />
      <br />
      <button onClick={() => {
        alert(`Sending "${message}" to ${contact.email}`);
        dispatch({
          type: 'sent_message',
        });
      }}>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

dispatch 함수에 action을 담아 전달하면 현재 state와 action과 함께 reducer를 호출하고 반환된 결과를 다음 state로 저장합니다. 이를 구현한 코드는 다음과 같습니다.

<Sandpack>

```js src/App.js
import { useReducer } from './MyReact.js';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import {
  initialState,
  messengerReducer
} from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(
    messengerReducer,
    initialState
  );
  const message = state.messages[state.selectedId];
  const contact = contacts.find(c =>
    c.id === state.selectedId
  );
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/messengerReducer.js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor',
    1: 'Hello, Alice',
    2: 'Hello, Bob'
  }
};

export function messengerReducer(
  state,
  action
) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message
        }
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: ''
        }
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js src/MyReact.js active
import { useState } from 'react';

export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    const nextState = reducer(state, action);
    setState(nextState);
  }

  return [state, dispatch];
}
```

```js src/ContactList.js hidden
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              dispatch({
                type: 'changed_selection',
                contactId: contact.id
              });
            }}>
              {selectedId === contact.id ? (
                <b>{contact.name}</b>
              ) : (
                contact.name
              )}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/Chat.js hidden
import { useState } from 'react';

export default function Chat({
  contact,
  message,
  dispatch
}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={e => {
          dispatch({
            type: 'edited_message',
            message: e.target.value
          });
        }}
      />
      <br />
      <button onClick={() => {
        alert(`Sending "${message}" to ${contact.email}`);
        dispatch({
          type: 'sent_message',
        });
      }}>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

대부분의 경우에서는 중요하지 않지만, 좀 더 정확한 구현은 아래와 같습니다.

```js
function dispatch(action) {
  setState(s => reducer(s, action));
}
```

[업데이터 함수와 비슷하게](/learn/queueing-a-series-of-state-updates) 전달된 action이 다음 렌더링이 있을 때까지 큐에 쌓이기 때문에 이렇게 작성하는 것이 더 좋습니다.

</Solution>

</Challenges>
