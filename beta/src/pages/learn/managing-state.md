---
title: Managing State
---

<Intro>

애플리케이션이 성장함에 따라 상태가 구성되는 방식과 구성 요소 간에 데이터가 흐르는 방식에 대해 보다 의도적으로 생각하는 것이 도움이 많이됩니다. 불필요하거나 중복된 상태는 버그의 일반적인 원인입니다. 이 장에서는 상태를 잘 구성하는 방법, 상태 업데이트 로직을 유지보수 가능한 상태로 유지하는 방법, 멀리 있는 컴포넌트 간에 상태를 공유하는 방법을 배웁니다.

</Intro>

<YouWillLearn isChapter={true}>

- [How to think about UI changes as state changes](/learn/reacting-to-input-with-state)
- [How to structure state well](/learn/choosing-the-state-structure)
- [How to "lift state up" to share it between components](/learn/sharing-state-between-components)
- [How to control whether the state gets preserved or reset](/learn/preserving-and-resetting-state)
- [How to consolidate complex state logic in a function](/learn/extracting-state-logic-into-a-reducer)
- [How to pass information without "prop drilling"](/learn/passing-data-deeply-with-context)
- [How to scale state management as your app grows](/learn/scaling-up-with-reducer-and-context)

</YouWillLearn>

## State를 사용해 Input 다루기 {/* reacting-to-input-with-state */}

React를 사용하면 코드에서 직접 UI를 수정하지 않습니다. 예를 들어 "버튼 비활성화", "버튼 활성화", 성공 메시지 표시"등과 같은 기능을 작성하지 않을 것 입니다. 대신 컴포넌트의 다양한 시각적 상태에 대해 보고 싶은 UI를 작성할 것입니다.("초기 상태", "입력 상태", "성공 상태") 그런 다음 사용자 입력에 대한 응답으로 상태 변경을 트리거합니다. 이는 디자이너가 UI에 대해 생각하는 방식과 유사합니다.

다음은 React를 사용하여 만든 퀴즈 양식입니다. `status` 상태 변수를 사용하여 제출 버튼을 활성화할지 비활성화할지 결정하고 대신 성공 메시지를 표시할지 여부를 확인합니다.

<Sandpack>

```js
import {useState} from 'react';

export default function Form() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>That's right!</h1>;
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
        <button disabled={answer.length === 0 || status === 'submitting'}>
          Submit
        </button>
        {error !== null && <p className="Error">{error.message}</p>}
      </form>
    </>
  );
}

function submitForm(answer) {
  // Pretend it's hitting the network.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let shouldError = answer.toLowerCase() !== 'lima';
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
.Error {
  color: red;
}
```

</Sandpack>

<LearnMore path="/learn/reacting-to-input-with-state">

상태 기반 사고방식으로 상호작용에 접근하는 방법을 배우려면 **[State를 사용해 Input 다루기](/learn/reacting-to-input-with-state)**를 읽어보세요.

</LearnMore>

## 상태 구조 결정하기 {/* choosing-the-state-structure */}

상태를 잘 구성하는 것은 수정 및 디버그하기 쉬운 컴포넌트와 지속적인 버그의 원인인 컴포넌트 사이에 차이를 만들 수 있습니다. 가장 중요한 원칙은 상태는 불필요하거나 중복된 정보를 포함해서는 안 된다는 것입니다. 불필요한 상태의 존재는 그 상태를 업데이트하는 것을 잊을 수 있게하고, 버그를 초래합니다.

예를 들어 이 양식에는 **불필요한** `fullName` 상태 변수가 있습니다:

<Sandpack>

```js
import {useState} from 'react';

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
        First name: <input value={firstName} onChange={handleFirstNameChange} />
      </label>
      <label>
        Last name: <input value={lastName} onChange={handleLastNameChange} />
      </label>
      <p>
        Your ticket will be issued to: <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 5px;
}
```

</Sandpack>

컴포넌트가 렌더링되는 동안 `fullName`을 계산하여 제거하고 코드를 단순화할 수 있습니다:

<Sandpack>

```js
import {useState} from 'react';

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
        First name: <input value={firstName} onChange={handleFirstNameChange} />
      </label>
      <label>
        Last name: <input value={lastName} onChange={handleLastNameChange} />
      </label>
      <p>
        Your ticket will be issued to: <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 5px;
}
```

</Sandpack>

이것은 작은 변경처럼 보일 수 있지만 React앱의 많은 버그가 이러한 방식으로 수정됩니다.

<LearnMore path="/learn/choosing-the-state-structure">

**[Choosing the State Structure](/learn/choosing-the-state-structure)**를 읽고 버그를 방지하기 위해 상태의 모양을 디자인하는 방법을 알아보세요.

</LearnMore>

## 컴포넌트간 상태 공유 {/* sharing-state-between-components */}

때로는 두 컴포넌트의 상태가 항상 함께 변경되기를 원할 수 있습니다. 그렇게 하려면 둘 다에서 상태를 제거하고 가장 가까운 공통 부모로 이동하고 props를 통해 전달합니다. 이것을 "상태 올리기"라고 하며 React 코드를 작성하며 가장 일반적인 작업 중 하나입니다.

이 예에서는 한 번에 하나의 패널만 활성화되어야 합니다. 이를 달성하기 위해 각 개별 패널 내부에 활성 상태를 유지하는 대신 상위 컴포넌트가 상태를 유지하고 하위 컴포넌트에게 props를 전달합니다.

<Sandpack>

```js
import {useState} from 'react';

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel
        title="About"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}>
        With a population of about 2 million, Almaty is Kazakhstan's largest
        city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel
        title="Etymology"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}>
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for
        "apple" and is often translated as "full of apples". In fact, the region
        surrounding Almaty is thought to be the ancestral home of the apple, and
        the wild <i lang="la">Malus sieversii</i> is considered a likely
        candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}

function Panel({title, children, isActive, onShow}) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? <p>{children}</p> : <button onClick={onShow}>Show</button>}
    </section>
  );
}
```

```css
h3,
p {
  margin: 5px 0px;
}
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<LearnMore path="/learn/sharing-state-between-components">

상태를 끌어올리고 컴포넌트를 동기화 상태로 유지하는 방법에 대해 알아보려면 **[컴포넌트 간 State 공유하기](/learn/sharing-state-between-components)**를 읽어보세요.

</LearnMore>

## State를 보존하고 초기화하기 {/* preserving-and-resetting-state */}

컴포넌트를 다시 렌더링할 때 React는 유지(및 업데이트)할 트리 부분과 처음부터 버리거나 다시 생성할 부분을 결정해야합니다. 대부분의 경우 React의 자동 행동은 잘 동작합니다. 기본적으로 React는 이전에 렌더링된 컴포넌트 트리와 "일치하는" 트리 부분을 유지합니다.

그러나 때로는 이것이 원하는 것이 아닙니다. 예를 들어 이 앱에서 메시지를 입력한 다음 받는 사람을 전환해도 입력이 재설정되지 않습니다. 이로 인해 사용자가 실수로 잘못된 사람에게 메시지를 보낼 수 있습니다.

<Sandpack>

```js App.js
import {useState} from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={(contact) => setTo(contact)}
      />
      <Chat contact={to} />
    </div>
  );
}

const contacts = [
  {name: 'Taylor', email: 'taylor@mail.com'},
  {name: 'Alice', email: 'alice@mail.com'},
  {name: 'Bob', email: 'bob@mail.com'},
];
```

```js ContactList.js
export default function ContactList({selectedContact, contacts, onSelect}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact}>
            <button
              onClick={() => {
                onSelect(contact);
              }}>
              {contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js
import {useState} from 'react';

export default function Chat({contact}) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => setText(e.target.value)}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
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

React를 사용하면 기본 동작을 재정의하고 `<Chat key={email} />`과 같은 다른 `key`를 전달하여 컴포넌트가 상태를 _강제로_ 재설정하도록 할 수 있습니다. 이것은 수신자가 다른 경우 새로운 데이터(및 입력과 같은 UI)로 처음부터 다시 생성해야 하는 _다른_ `Chat` 컴포넌트로 간주되어야 한다고 React에게 알려줍니다. 이제 받는 사람이 전환되면 동일한 컴포넌트를 렌더링하더라도 항상 입력 필드가 재설정됩니다.

<Sandpack>

```js App.js
import {useState} from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={(contact) => setTo(contact)}
      />
      <Chat key={to.email} contact={to} />
    </div>
  );
}

const contacts = [
  {name: 'Taylor', email: 'taylor@mail.com'},
  {name: 'Alice', email: 'alice@mail.com'},
  {name: 'Bob', email: 'bob@mail.com'},
];
```

```js ContactList.js
export default function ContactList({selectedContact, contacts, onSelect}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact}>
            <button
              onClick={() => {
                onSelect(contact);
              }}>
              {contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js
import {useState} from 'react';

export default function Chat({contact}) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => setText(e.target.value)}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
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

**[State를 보존하고 초기화하기](/learn/preserving-and-resetting-state)**를 읽고 상태의 일생(lifetime)과 이를 제어하는 방법을 찾아보세요.

</LearnMore>

## State 로직을 reducer로 작성하기 {/* extracting-state-logic-into-a-reducer */}

많은 이벤트 핸들러에 걸쳐 많은 상태 업데이트가 있는 컴포넌트는 압도적일 수 있습니다. 이러한 경우 컴포넌트 외부의 모든 상태 업데이트 로직을 "reducer"라는 단일 함수으로 통합할 수 있습니다. 이벤트 핸들러는 사용자 "actions"만 지정하기 때문에 간결해집니다. 파일 맨 아래에 있는 reducer 함수는 각 작업에 대한 응답으로 상태를 업데이트하는 방법을 지정합니다!

<Sandpack>

```js App.js
import {useReducer} from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

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
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
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
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

let nextId = 3;
const initialTasks = [
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];
```

```js AddTask.js hidden
import {useState} from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
    </>
  );
}
```

```js TaskList.js hidden
import {useState} from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

</Sandpack>

<LearnMore path="/learn/extracting-state-logic-into-a-reducer">

Reducer 함수에서 로직을 통합하는 방법을 배우려면 **[state 로직을 reducer로 작성하기](/learn/extracting-state-logic-into-a-reducer)**를 읽어보세요.

</LearnMore>

## Context를 사용해 데이터를 깊게 전달하기 {/* passing-data-deeply-with-context */}

일반적으로 props를 통해 부모 컴포넌트에서 자식 컴포넌트로 정보를 전달합니다. 그러나 많은 컴포넌트를 통해 일부 prop을 전달해야하거나 많은 컴포넌트에 동일한 정보가 필요한 경우 prop을 전달하는 것이 불편할 수 있습니다. Context를 사용하면 부모 컴포넌트가 props를 통해 명시적으로 전달하지 않고도 하위 구성 요소가 얼마나 깊은지 여부에 관계없이 하위 트리의 모든 컴포넌트에서 정보를 사용할 수 있도록 합니다.

여기에서 `Heading` 컴포넌트는 해당 수준에 대해 가장 가까운 `Section`을 "요청"하여 제목 수준을 결정합니다. 각 `Section`은 상위 `Section`에 자신의 레벨을 요청하고 1을 추가하여 자체 레벨을 추적합니다. 모든 `Section`은 props를 전달하지 않고 그 아래의 모든 컴포넌트에 정보를 제공합니다. 이는 context를 통해 수행됩니다.

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

```js Section.js
import {useContext} from 'react';
import {LevelContext} from './LevelContext.js';

export default function Section({children}) {
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

```js Heading.js
import {useContext} from 'react';
import {LevelContext} from './LevelContext.js';

export default function Heading({children}) {
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

```js LevelContext.js
import {createContext} from 'react';

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

Props를 전달하는 대신 컨텍스트를 사용하는 방법에 대해 알아보려면 **[Context를 사용해 데이터를 깊게 전달하기](/learn/passing-data-deeply-with-context)**를 읽어보세요.

</LearnMore>

## Reducer와 Context로 앱 확장하기 {/* scaling-up-with-reducer-and-context */}

Reducer를 사용하면 컴포넌트의 상태 업데이트 로직을 통합할 수 있습니다. Context를 사용하면 정보를 다른 컴포넌트로 깊숙이 전달할 수 있습니다. 여러분은 reducer와 context를 결합하여 복잡한 화면의 상태를 관리할 수 있습니다.

이 접근 방식을 사용하면 복잡한 상태의 상위 컴포넌트를 reducer로 관리합니다. 트리의 깊숙한 곳에 있는 다른 컴포넌트는 컨텍스트를 통해 상태를 읽을 수 있습니다. 또한 해당 상태를 업데이트하기 위해 action을 dispatch할 수 있습니다.

<Sandpack>

```js App.js
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import {TasksProvider} from './TasksContext.js';

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

```js TasksContext.js
import {createContext, useContext, useReducer} from 'react';

const TasksContext = createContext(null);
const TasksDispatchContext = createContext(null);

export function TasksProvider({children}) {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
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
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

const initialTasks = [
  {id: 0, text: 'Philosopher’s Path', done: true},
  {id: 1, text: 'Visit the temple', done: false},
  {id: 2, text: 'Drink matcha', done: false},
];
```

```js AddTask.js
import {useState, useContext} from 'react';
import {useTasksDispatch} from './TasksContext.js';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  const dispatch = useTasksDispatch();
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          dispatch({
            type: 'added',
            id: nextId++,
            text: text,
          });
        }}>
        Add
      </button>
    </>
  );
}

let nextId = 3;
```

```js TaskList.js
import {useState, useContext} from 'react';
import {useTasks, useTasksDispatch} from './TasksContext.js';

export default function TaskList() {
  const tasks = useTasks();
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} />
        </li>
      ))}
    </ul>
  );
}

function Task({task}) {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useTasksDispatch();
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            dispatch({
              type: 'changed',
              task: {
                ...task,
                text: e.target.value,
              },
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          dispatch({
            type: 'changed',
            task: {
              ...task,
              done: e.target.checked,
            },
          });
        }}
      />
      {taskContent}
      <button
        onClick={() => {
          dispatch({
            type: 'deleted',
            id: task.id,
          });
        }}>
        Delete
      </button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

</Sandpack>

<LearnMore path="/learn/scaling-up-with-reducer-and-context">

성장하는 앱에서 상태 관리가 어떻게 확장되는지 알아보려면 **[Reducer와 Context로 앱 확장하기](/learn/scaling-up-with-reducer-and-context)**를 읽어보세요.

</LearnMore>

## What's next? {/* whats-next */}

이 장을 한 페이지씩 읽기 시작하려면 [State를 사용해 Input 다루기](/learn/reacting-to-input-with-state)로 이동하세요!

또는 이러한 주제에 이미 익숙하다면 [Escape Hatches](/learn/escape-hatches)에 대해 읽어보지 않으시겠습니까?
