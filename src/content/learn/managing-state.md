---
title: State 관리하기
---

<Intro>

애플리케이션이 커짐에 따라, state가 어떻게 구성되는지 그리고 데이터가 컴포넌트 간에 어떻게 흐르는지에 대해 의식적으로 파악하면 도움이 됩니다. 불필요하거나 중복된 state는 버그의 흔한 원인입니다. 이 장에서는 state를 잘 구성하는 방법, state 업데이트 로직을 유지 보수 가능하게 관리하는 방법, 그리고 멀리 있는 컴포넌트 간에 state를 공유하는 방법에 대해 알아봅니다.

</Intro>

<YouWillLearn isChapter={true}>

* [UI 변경을 state 변경으로 생각하는 방법](/learn/reacting-to-input-with-state)
* [State를 잘 구조화하는 방법](/learn/choosing-the-state-structure)
* ["State를 끌어올려" 컴포넌트 간에 공유하는 방법](/learn/sharing-state-between-components)
* [State가 보존될지 초기화될지 컨트롤하는 방법](/learn/preserving-and-resetting-state)
* [복잡한 State 로직을 함수로 통합하는 방법](/learn/extracting-state-logic-into-a-reducer)
* ["Prop drilling" 없이 정보를 전달하는 방법](/learn/passing-data-deeply-with-context)
* [앱이 커짐에 따라 state 관리를 확장하는 방법](/learn/scaling-up-with-reducer-and-context)

</YouWillLearn>

## State를 사용해 input 다루기 {/*reacting-to-input-with-state*/}

React를 사용하면 코드에서 직접 UI를 수정하지 않습니다. 예를 들어 "버튼 비활성화", "버튼 활성화", "성공 메시지 표시" 등의 명령을 작성하지 않습니다. 대신 컴포넌트의 여러 시각적 상태("초기 상태", "입력 상태", "성공 상태")에 대해 보고 싶은 UI를 설명하고, 유저 입력에 따라 state 변경을 유발합니다. 이는 디자이너가 UI를 바라보는 방식과 비슷합니다.

여기 React로 구현된 퀴즈 폼이 있습니다. `status` state 변수를 사용해 제출 버튼을 활성화 혹은 비활성화할지, 또는 성공 메시지를 대신 표지할지 여부를 결정하는 것에 주목해 주세요.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>That's right!</h1>
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitForm(answer);
      setStatus('success');
    } catch (err) {
      setStatus('typing');
      setError(err);
    }
  }

  function handleTextareaChange(e) {
    setAnswer(e.target.value);
  }

  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={handleTextareaChange}
          disabled={status === 'submitting'}
        />
        <br />
        <button disabled={
          answer.length === 0 ||
          status === 'submitting'
        }>
          Submit
        </button>
        {error !== null &&
          <p className="Error">
            {error.message}
          </p>
        }
      </form>
    </>
  );
}

function submitForm(answer) {
  // Pretend it's hitting the network.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let shouldError = answer.toLowerCase() !== 'lima'
      if (shouldError) {
        reject(new Error('Good guess but a wrong answer. Try again!'));
      } else {
        resolve();
      }
    }, 1500);
  });
}
```

```css
.Error { color: red; }
```

</Sandpack>

<LearnMore path="/learn/reacting-to-input-with-state">

State-driven 사고방식으로 상호작용에 접근하는 법을 배우려면 **[State를 사용해 Input 다루기](/learn/reacting-to-input-with-state)** 를 읽어보세요.

</LearnMore>

## State 구조 선택하기 {/*choosing-the-state-structure*/}

State를 잘 구조화한다면 지속적인 버그의 원인이 되는 컴포넌트가 아닌, 수정과 디버깅이 용이한 컴포넌트를 만들 수 있습니다. 가장 중요한 원칙은 state가 중복되거나 불필요한 정보를 포함하지 않는 것입니다. 불필요한 state가 있다면 업데이트하는 것을 잊어버려 버그가 발생하기 쉽습니다!

예를 들어 아래 폼에는 **중복된** `fullName` state 변수가 있습니다.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
    setFullName(e.target.value + ' ' + lastName);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
    setFullName(firstName + ' ' + e.target.value);
  }

  return (
    <>
      <h2>Let’s check you in</h2>
      <label>
        First name:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Your ticket will be issued to: <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

컴포넌트가 렌더링 되는 동안 `fullName` 을 계산해 이를 제거하고 코드를 단순화할 수 있습니다. 

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const fullName = firstName + ' ' + lastName;

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <h2>Let’s check you in</h2>
      <label>
        First name:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Your ticket will be issued to: <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

이 변경이 사소해 보일 수 있지만, React 앱의 많은 버그가 이러한 방식으로 수정됩니다.

<LearnMore path="/learn/choosing-the-state-structure">

버그 방지를 위해 state 구조를 설계하는 방법을 배우려면 **[State 구조 선택하기](/learn/choosing-the-state-structure)** 를 읽어보세요.

</LearnMore>

## 컴포넌트 간 State 공유하기 {/*sharing-state-between-components*/}

때때로 두 컴포넌트의 state가 항상 함께 변경되기를 원할 수 있습니다. 이를 위해서는 각 컴포넌트에서 state를 제거하고 가장 가까운 공통 부모 컴포넌트로 옮긴 후 props로 자식들에게 전달해야 합니다. 이 방법을 "state 끌어올리기"라고 하며, React 코드를 작성할 때 가장 흔히 하는 일 중 하나입니다.

아래 예시에서는 한 번에 하나의 패널만 활성화되어야 합니다. 이를 위해 개별 패널 내에서 활성 state를 유지하는 대신, 부모 컴포넌트에서 state를 관리하고 자식들의 props를 지정합니다.

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

<LearnMore path="/learn/sharing-state-between-components">

State를 끌어올려 컴포넌트들을 동기화하는 방법을 배우려면 **[컴포넌트 간 State 공유하기](/learn/sharing-state-between-components)** 를 읽어보세요.

</LearnMore>

## State를 보존하고 초기화하기 {/*preserving-and-resetting-state*/}

컴포넌트가 리렌더링 될 때, React는 트리에서 유지(및 업데이트) 할 부분과, 버리거나 다시 생성할 부분을 결정해야 합니다. 대부분의 경우 React의 자동화된 동작이 충분히 잘 작동합니다. 기본적으로 React는 기존에 렌더링 된 컴포넌트 트리와 "일치하는" 트리 부분을 보존합니다.

하지만 때로는 이것이 바람직한 동작이 아닐 수 있습니다. 아래 채팅 앱에서는 메시지를 입력한 후에 수신자를 변경하더라도 입력이 초기화되지 않습니다. 따라서 유저가 실수로 잘못된 사람에게 메시지를 보낼 수도 있습니다.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat contact={to} />
    </div>
  )
}

const contacts = [
  { name: 'Taylor', email: 'taylor@mail.com' },
  { name: 'Alice', email: 'alice@mail.com' },
  { name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.email}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
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

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Chat to ' + contact.name}
        onChange={e => setText(e.target.value)}
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

`<Chat key={email} />` 처럼 다른 `key`를 전달함으로써 React의 기본 동작을 무시하고 *강제로* 컴포넌트의 상태를 초기화할 수 있습니다. 이를 통해 수신자가 다르다면 새로운 데이터(및 input과 같은 UI)로 처음부터 다시 생성해야 하는 **별개의** Chat 컴포넌트로 간주해야 한다는 것을 React에 알려줍니다. 이제 수신자를 변경하면 같은 컴포넌트를 렌더링하더라도 input 필드가 초기화됩니다.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat key={to.email} contact={to} />
    </div>
  )
}

const contacts = [
  { name: 'Taylor', email: 'taylor@mail.com' },
  { name: 'Alice', email: 'alice@mail.com' },
  { name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.email}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
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

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Chat to ' + contact.name}
        onChange={e => setText(e.target.value)}
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

<LearnMore path="/learn/preserving-and-resetting-state">

State의 생명주기, 그리고 생명주기를 컨트롤하는 방법을 배우려면 **[State를 보존하고 초기화하기](/learn/preserving-and-resetting-state)** 를 읽어보세요.

</LearnMore>

## State 로직을 reducer로 작성하기 {/*extracting-state-logic-into-a-reducer*/}

여러 이벤트 핸들러를 통해 많은 state 업데이트가 이루어지는 컴포넌트는 감당하기 힘들 수 있습니다. 이 때 컴포넌트 외부에서 "reducer"라는 단일 함수를 사용하여 모든 state 업데이트 로직을 통합할 수 있습니다. 이벤트 핸들러는 오로지 유저의 "action"만을 명시하므로 간결해집니다. 각 action에 대한 state 업데이트 방법은 파일 맨 마지막 부분의 reducer 함수에 명시되어 있습니다.

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

<LearnMore path="/learn/extracting-state-logic-into-a-reducer">

Reducer 함수에 로직을 통합하는 방법을 배우려면 **[state 로직을 reducer로 작성하기](/learn/extracting-state-logic-into-a-reducer)** 를 읽어보세요.

</LearnMore>

## Context를 사용해 데이터를 깊게 전달하기 {/*passing-data-deeply-with-context*/}

일반적으로는 props를 통해 부모 컴포넌트에서 자식 컴포넌트로 정보를 전달합니다. 그러나 중간에 많은 컴포넌트를 거쳐야 하거나, 애플리케이션의 많은 컴포넌트에서 동일한 정보가 필요한 경우에는 props를 전달하는 것이 번거롭고 불편할 수 있습니다. 이때 Context를 사용하면 부모 컴포넌트가 props를 통해 명시적으로 정보를 전달하지 않아도, 트리에 있는 모든 자식 컴포넌트가 (얼마나 깊게 있든지 간에) 정보를 사용할 수 있도록 할 수 있습니다.

아래 예시에서 `Heading` 컴포넌트는 가장 가까운 `Section`에 "물어봄으로써" 자신의 heading 레벨을 결정합니다. 각 `Section`은 부모 `Section`에 레벨을 물어보고 거기에 1을 더해 자신의 레벨을 트래킹합니다. 각 `Section`은 props를 전달하지 않고도 모든 하위 컴포넌트에 정보를 제공하며, 이는 Context를 통해 수행됩니다.

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>Title</Heading>
      <Section>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 0:
      throw Error('Heading must be inside a Section!');
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(0);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<LearnMore path="/learn/passing-data-deeply-with-context">

Props 전달하기의 대안으로 context를 사용하는 방법을 배우려면 **[Context를 사용해 데이터를 깊게 전달하기](/learn/passing-data-deeply-with-context)** 를 읽어보세요.

</LearnMore>

## Reducer와 Context로 앱 확장하기 {/*scaling-up-with-reducer-and-context*/}

Reducer를 사용하면 컴포넌트의 state 업데이트 로직을 통합할 수 있습니다. Context를 사용하면 다른 컴포넌트에 정보를 깊숙이 전달할 수 있습니다. Reducer와 Context를 함께 사용하여 복잡한 화면의 state를 관리할 수 있습니다.

이 접근 방식을 사용하면 상위 컴포넌트가 Reducer로 복잡한 state를 관리합니다. 트리 깊은 곳에 있는 다른 컴포넌트는 Context를 통해 상위 컴포넌트의 state를 읽을 수 있습니다. 또한 해당 state를 업데이트하기 위해 action을 dispatch 할 수도 있습니다. 

<Sandpack>

```js src/App.js
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import { TasksProvider } from './TasksContext.js';

export default function TaskApp() {
  return (
    <TasksProvider>
      <h1>Day off in Kyoto</h1>
      <AddTask />
      <TaskList />
    </TasksProvider>
  );
}
```

```js src/TasksContext.js
import { createContext, useContext, useReducer } from 'react';

const TasksContext = createContext(null);
const TasksDispatchContext = createContext(null);

export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider
        value={dispatch}
      >
        {children}
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}

export function useTasks() {
  return useContext(TasksContext);
}

export function useTasksDispatch() {
  return useContext(TasksDispatchContext);
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

const initialTasks = [
  { id: 0, text: 'Philosopher’s Path', done: true },
  { id: 1, text: 'Visit the temple', done: false },
  { id: 2, text: 'Drink matcha', done: false }
];
```

```js src/AddTask.js
import { useState, useContext } from 'react';
import { useTasksDispatch } from './TasksContext.js';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  const dispatch = useTasksDispatch();
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        dispatch({
          type: 'added',
          id: nextId++,
          text: text,
        });
      }}>Add</button>
    </>
  );
}

let nextId = 3;
```

```js src/TaskList.js
import { useState, useContext } from 'react';
import { useTasks, useTasksDispatch } from './TasksContext.js';

export default function TaskList() {
  const tasks = useTasks();
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task task={task} />
        </li>
      ))}
    </ul>
  );
}

function Task({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useTasksDispatch();
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            dispatch({
              type: 'changed',
              task: {
                ...task,
                text: e.target.value
              }
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
          dispatch({
            type: 'changed',
            task: {
              ...task,
              done: e.target.checked
            }
          });
        }}
      />
      {taskContent}
      <button onClick={() => {
        dispatch({
          type: 'deleted',
          id: task.id
        });
      }}>
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

<LearnMore path="/learn/scaling-up-with-reducer-and-context">

커져가는 앱에서 state 관리가 어떻게 확장되는지 알아보려면  **[Scaling Up with Reducer and Context](/learn/scaling-up-with-reducer-and-context)** 를 읽어보세요.

</LearnMore>

## 다음은 무엇인가요? {/*whats-next*/}

이 장을 한 페이지씩 읽어보려면 [State를 사용해 Input 다루기](/learn/reacting-to-input-with-state)로 이동하세요!

이 주제에 이미 익숙하다면 [해결책(탈출구)](/learn/escape-hatches)에 대해서 읽어보는 것은 어떨까요?
