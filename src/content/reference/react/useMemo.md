---
title: useMemo
---

<Intro>

`useMemo` 는 재렌더링 사이에 계산 결과를 캐싱할 수 있게 해주는 Rect Hook 입니다.

```js
const cachedValue = useMemo(calculateValue, dependencies)
```

</Intro>

<InlineToc />

---

## 레퍼런스 {/*reference*/}

### `useMemo(calculateValue, dependencies)` {/*usememo*/}

컴포넌트의 최상위 레벨에 있는 'useMemo'를 호출하여 재렌더링 사이의 계산을 캐싱합니다.

```js
import { useMemo } from 'react';

function TodoList({ todos, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  // ...
}
```

[아래로 이동하여 더 많은 예시를 확인하세요.](#usage)

#### 매개변수 {/*parameters*/}

* `calculateValue`: 캐싱하려는 값을 계산하는 함수입니다. 순수해야 하며 인자를 받지 않고, 모든 타입의 값을 반환할 수 있어야 합니다. React는 초기 렌더링 중에 함수를 호출합니다. 다음 렌더링에서, React는 마지막 렌더링 이후 `dependencies`가 변경되지 않았을 때 동일한 값을 다시 반환합니다. 그렇지 않다면 `calculateValue`를 호출하고 결과를 반환하며, 나중에 재사용할 수 있도록 저장합니다.

* `dependencies`: `calculateValue` 코드 내에서 참조된 모든 반응형 값들의 목록입니다. 반응형 값에는 props, state와 컴포넌트 바디에 직접 선언된 모든 변수와 함수가 포함됩니다. 만약 linter가 [React용으로 설정된 경우](/learn/editor-setup#linting) 모든 반응형 값이 의존성으로 올바르게 설정되었는지 확인할 수 있습니다. 의존성 목록은 일정한 수의 항목을 가져야 하며, `[dep1, dep2, dep3]`와 같이 인라인 형태로 작성돼야 합니다. React는 [`Object.is`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 비교를 통해 각 의존성 들을 이전 값과 비교합니다.

#### 반환값 {/*returns*/}

초기 렌더링에서 `useMemo`는 인자 없이 `calculateValue`를 호출한 결과를 반환합니다.

다음 렌더링에서, 마지막 렌더링에서 저장된 값을 반환하거나(종속성이 변경되지 않은 경우), `calculateValue`를 다시 호출하고 반환된 값을 저장합니다.

#### 주의 사항 {/*caveats*/}

* `useMemo`는 Hook이므로  **컴포넌트의 최상위 레벨** 또는 자체 Hook에서만 호출할 수 있습니다. 반복문이나 조건문 내부에서는 호출할 수 없습니다. 만일 호출이 필요하다면 새 컴포넌트를 추출하고 상태를 그 안으로 옮겨야 합니다.
* Strict Mode에서는 , React는 [실수로 발생한 오류를 찾기 위해](#my-calculation-runs-twice-on-every-re-render) **계산 함수를 두 번 호출합니다.** 이는 개발 환경에서만 동작하는 방식이며, 실제 프로덕션 환경에는 영향을 미치지 않습니다. (원래 그래야 하는 것처럼) 연산 함수가 순수하다면, 로직에는 영향을 미치지 않습니다. 호출 결과 중 하나는 무시됩니다.
* React는 **캐싱 된 값을 버려야 할 특별한 이유가 없는 한 버리지 않습니다.** 예를 들어, 개발 단계에서 컴포넌트 파일을 편집할 때 React는 캐시를 버립니다. 개발과 프로덕션 환경 모두에서는 컴포넌트가 초기 마운트 중에 일시 중단되면 React는 캐시를 버립니다. 앞으로 React는 캐시를 버리는 것을 활용하는 더 많은 기능을 추가할 수 있습니다. 예를 들어, 앞으로 React에 가상화된 목록에 대한 기본적인 지원이 추가된다면 가상화된 테이블 뷰포트에서 스크롤 되는 항목에 대한 캐시를 버리는 것이 합리적일 것입니다. 이는 성능 최적화를 위해 `useMemo`에만 의존한다면 괜찮을 것입니다. 그러나 이는 [상태 변수](/reference/react/useState#avoiding-recreating-the-initial-state)나 [ref](/reference/react/useRef#avoiding-recreating-the-ref-contents)를 사용하는 것이 더 적합할 수 있습니다.

<Note>

이와 같이 반환값을 캐싱하는 것을 [*memoization*](https://ko.wikipedia.org/wiki/%EB%A9%94%EB%AA%A8%EC%9D%B4%EC%A0%9C%EC%9D%B4%EC%85%98)라고 하며, 이 훅을 `useMemo`라고 부르는 이유압니다.

</Note>

---

## 사용법 {/*usage*/}

### 비용이 높은 로직의 재계산 생략하기 {/*skipping-expensive-recalculations*/}

재렌더링 사이에 계산을 캐싱하려면 컴포넌트의 최상위 레벨에서 `useMemo`를 호출하여 계산을 감싸면 됩니다.

```js [[3, 4, "visibleTodos"], [1, 4, "() => filterTodos(todos, tab)"], [2, 4, "[todos, tab]"]]
import { useMemo } from 'react';

function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

`useMemo`에 두 가지를 전달해야 합니다.

1. `() =>`와 같이 인수를 받지 않고 계산하려는 값을 반환하는 <CodeStep step={1}>계산 함수</CodeStep> 입니다.
2. 계산 내부에서 사용되는 컴포넌트 내의 모든 값을 포함하는 <CodeStep step={2}>종속성 목록</CodeStep> 입니다.

초기 렌더링에서 `useMemo`에서 얻을 수 있는 <CodeStep step={3}>값</CodeStep>은 <CodeStep step={1}>계산 함수</CodeStep>를 호출한 결과값 입니다.

이후 모든 렌더링에서 React는 <CodeStep step={2}>종속성 목록을</CodeStep> 마지막 렌더링 중에 전달한 종속성 목록과 비교합니다. 만일  ([`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)와 비교했을 때) 종속성이 변경되지 않았다면, `useMemo`는 이전에 이미 계산해둔 값을 반환합니다. 그렇지 않다면 React는 계산을 다시 실행하고 새로운 값을 반환합니다.

즉, `useMemo`는 종속성이 변경되기 전까지 재렌더링 사이의 계산 결과를 캐싱합니다.

**이 기능이 언제 유용한지 예시를 통해 살펴보겠습니다.**

기본적으로 React는 컴포넌트를 다시 렌더링할 때마다 컴포넌트의 전체 본문을 다시 실행합니다. 예를 들어, `TodoList`가 상태를 업데이트하거나 부모로부터 새로운 props를 받으면 `filterTodos` 함수가 다시 실행됩니다.

```js {2}
function TodoList({ todos, tab, theme }) {
  const visibleTodos = filterTodos(todos, tab);
  // ...
}
```

일반적으로 대부분의 계산을 매우 빠르기 때문에 문제가 되지 않습니다. 그러나 큰 배열을 필터링 혹은 변환하거나 비용이 많이 드는 계산을 수행하는 경우, 데이터가 변경되지 않았다면 계산을 생략하는 것이 좋습니다. 만약 `todos`과 `tab`이 마지막 렌더링 때와 동일한 경우, 앞서 언급한 것처럼 `useMemo`로 계산을 감싸면 이전에 계산된 `visibleTodos`를 재사용할 수 있습니다.

이러한 유형의 캐싱을 *[메모이제이션](https://ko.wikipedia.org/wiki/%EB%A9%94%EB%AA%A8%EC%9D%B4%EC%A0%9C%EC%9D%B4%EC%85%98)* 라고 합니다.

<Note>

**성능 최적화를 위해서만`useMemo`를 사용해야 합니다.** 이 기능이 없어서 코드가 작동하지 않는다면 근본적인 문제를 먼저 찾아서 수정하세요. 그 후 `useMemo`를 사용하여 성능을 개선해야 합니다.

</Note>

<DeepDive>

#### 비싼 연산인지 어떻게 알 수 있나요? {/*how-to-tell-if-a-calculation-is-expensive*/}

일반적으로 수천 개의 개체를 만들거나 반복하는 경우가 아니라면 비용이 많이 들지 않습니다. 조금 더 정확하게 확인하고 싶다면 콘솔 로그를 추가하여 코드에 소요된 시간을 측정할 수 있습니다.

```js {1,3}
console.time('filter array');
const visibleTodos = filterTodos(todos, tab);
console.timeEnd('filter array');
```

측정하려는 상호작용(예시: Input에 입력)을 수행합니다. 그러면 `filter array: 0.15ms`와 같은 로그가 콘솔에 표시됩니다. 전체적으로 기록된 시간이 클 때(예시: `1ms` 이상) 해당 계산을 메모해 두는 것이 좋습니다. 그런 다음 실험적으로 `useMemo`로 계산을 감싸서 상호작용에 대한 총 시간이 감소했는지를 확인할 수 있습니다.

```js
console.time('filter array');
const visibleTodos = useMemo(() => {
  return filterTodos(todos, tab); // todo와 tab이 변경되지 않은 경우 건너뜁니다.
}, [todos, tab]);
console.timeEnd('filter array');
```

`useMemo`는 *처음* 렌더링을 더 빠르게 만들지 않습니다. 이는 업데이트 시 불필요한 작업을 건너뛰는 데 도움이 될 뿐입니다.

컴퓨터가 사용자의 컴퓨터보다 빠를 수 있으므로 인위적으로 속도를 낮추어 성능을 테스트하는 것이 좋습니다. 예를들어 Chrome은 [CPU 스로틀링](https://developer.chrome.com/blog/new-in-devtools-61/#throttling) 옵션을 제공합니다.

개발환경은 가장 정확한 결과를 제공하지는 않습니다(예를 들어 [Strict 모드](/reference/react/StrictMode)가 켜져 있다면 각 컴포넌트가 한 번이 아닌 두 번 렌더링 되는 것을 볼 수 있습니다). 가장 정확한 타이밍을 얻으려면 프로덕션용 앱을 빌드하고 사용자가 사용하는 것과 동일한 기기에서 테스트하세요.

</DeepDive>

<DeepDive>

#### 모든 곳에 useMemo를 추가해야 하나요? {/*should-you-add-usememo-everywhere*/}

이 사이트와 같이 대부분의 상호 작용이 거친 경우(페이지 또는 전체 섹션이 교체되는 것과 같이) 메모이제이션이 필요하지 않습니다. 반면, 앱이 그림 편집기와 비슷하고 대부분의 상호 작용이 세분화된 경우(도형 이동과 같은) 메모이제이션이 매우 유용할 수 있습니다. 

`useMemo`로 최적화하는 것은 몇몇 경우에만 유용합니다.

- `useMemo`에 입력하는 계산이 눈에 띄게 느리고 종속성이 거의 변경되지 않는 경우.
- [`memo`](/reference/react/memo)로 감싸진 컴포넌트에 prop로 전달할 경우. 값이 변경되지 않았다면 렌더링을 건너뛰고 싶을 것입니다. 메모이제이션을 사용하면 의존성이 동일하지 않은 경우에만 컴포넌트를 다시 렌더링할 수 있습니다.
- 전달한 값을 나중에 일부 Hook의 종속성으로 이용할 경우. 예를 들어, 다른 `useMemo`의 계산 값이 여기에 종속되어 있을 수 있습니다. 또는 [`useEffect`](/reference/react/useEffect)의 값에 종속되어 있을 수 있습니다. 

이 외는 계산을 `useMemo`로 감싸는 것에 대한 이득이 없습니다. 그러나 그렇게 한다고 해서 크게 문제가 되는 것도 아니므로 일부 팀에서는 개별 사례에 대해 생각하지 않고 가능한 한 많이 메모하는 방식을 선택합니다. 이 접근 방식의 단점은 코드 가독성이 떨어진다는 것입니다. 또한, 모든 메모이제이션이 효과적인 것은 아닙니다. "항상 새로운" 단일 값만으로도 전체 컴포넌트에 대한 메모화가 깨질 수 있기 때문입니다.

**실제로 몇 가지 원칙을 지키면 많은 메모이제이션을 불필요하게 만들 수 있습니다.**

1. 컴포넌트가 다른 컴포넌트를 시각적으로 감쌀 때 [JSX를 자식처럼 받아들이도록 하세요.](/learn/passing-props-to-a-component#passing-jsx-as-children) 이렇게 하면 감싸는 구성 요소가 자신의 상태를 업데이트하더라도 React는 자식을 다시 렌더링할 필요가 없습니다.
1. 지역 상태를 선호하고 필요 이상으로 [상태를 위로 올리지](/learn/sharing-state-between-components) 마세요. 예를 들어, forms와 같이 일시적인 상태나 어떤 항목이 트리의 맨 위에 위치하거나, 전역 상태 라이브러리에 있게 하지 마세요.
1. [순수한 렌더링 로직](/learn/keeping-components-pure)을 유지하세요. 컴포넌트를 다시 렌더링할 때 문제가 발생하거나 눈에 띄는 시각적인 부작용이 발생하면 컴포넌트에 버그가 있는 것입니다! 메모이제이션을 하는 대신 버그를 수정하세요.
1. [상태를 업데이트하는 불필요한 Effect](/learn/you-might-not-need-an-effect)를 피하세요. React 앱의 대부분의 성능 문제는 컴포넌트를 반복적으로 렌더링하게 만드는 Effect의 업데이트 체인으로부터 발생합니다.
1. [Effects에서 불필요한 종속성을 제거하세요.](/learn/removing-effect-dependencies) 예를 들어, 메모이제이션을 하는 대신 일부 객체나 함수를 Effect 내부 또는 컴포넌트 외부로 이동하는 것이 더 간단할 때가 있습니다.

특정 상호작용이 여전히 느리게 느껴진다면 [React 개발자 도구 프로파일러](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html)를 사용하여 어떤 컴포넌트가 메모이제이션을 통해 가장 큰 이점을 얻을 수 있는지 확인하고 필요하다면 추가하세요. 이러한 원칙은 컴포넌트를 더 쉽게 디버깅하고 이해할 수 있게 해주므로 어떤 경우든 이 원칙을 따르는 것이 좋습니다. 장기적으로 우리는 이 문제를 완전히 해결하기 위해 [자동적 세분화 메모이제이션](https://www.youtube.com/watch?v=lGEMwh32soc)을 연구하고 있습니다.

</DeepDive>

<Recipes titleText="useMemo와 값을 직접 계산하는 것의 차이점" titleId="examples-recalculation">

#### `useMemo`로 재계산 건너뛰기 {/*skipping-recalculation-with-usememo*/}

이 예제에서는 렌더링 중에 호출하는 자바스크립트 함수가 실제로 느릴 때 어떤 일이 발생하는지 확인할 수 있도록 `filterTodos`을 **인위적으로 느리게** 만들었습니다. 탭을 전환하고 테마를 토글해 보세요.

탭을 전환하면 느려진 `filterTodos`가 다시 실행되므로 느리게 느껴집니다. 이는 `tab`이 변경되었으므로 전체 계산이 *필수적으로* 다시 실행되기 때문에 나타나는 현상입니다. (왜 두 번 실행되는지 궁금하다면 [여기](#my-calculation-runs-twice-on-every-re-render)를 클릭해서 설명을 확인하세요.)

테마를 전환합니다. **인위적인 속도 저하에도 불구하고 빠른 이유는 `useMemo` 덕분입니다!** 느린 속도의 `filterTodos`는 마지막 렌더링 이후 (`useMemo`에 종속성으로 전달한)`todos`와 `tab`이 모두 변경되지 않았기 때문에 호출을 건너뛰었습니다. 

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js src/TodoList.js active
import { useMemo } from 'react';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  return (
    <div className={theme}>
      <p><b>Note: <code>filterTodos</code> is artificially slowed down!</b></p>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('[ARTIFICIALLY SLOW] Filtering ' + todos.length + ' todos for "' + tab + '" tab.');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // 매우 느린 코드를 구현하기 위해 500ms 동안 아무것도 하지 않음.
  }

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

<Solution />

#### 항상 값을 재계산하기 {/*always-recalculating-a-value*/}

이 예제에서는 렌더링 중에 호출하는 자바스크립트 함수가 실제로 느릴 때 어떤 일이 발생하는지 확인할 수 있도록 `filterTodos`을 **인위적으로 느리게** 만들었습니다. 탭을 전환하고 테마를 토글해 보세요.

이전 예제와 달리 테마 전환도 이제 느려졌습니다! **이 예제에는 `useMemo` 호출이 없기 때문에** 렌더링마다 느려진 `filterTodos`가 호출되기 때문입니다. 이는 `theme`만 변경하는 경우에도 호출됩니다.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js src/TodoList.js active
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <ul>
        <p><b>Note: <code>filterTodos</code> is artificially slowed down!</b></p>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('[ARTIFICIALLY SLOW] Filtering ' + todos.length + ' todos for "' + tab + '" tab.');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // 매우 느린 코드를 구현하기 위해 500ms 동안 아무것도 하지 않음.
  }

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

그러나 다음은 **인위적으로 속도 저하된 부분을 제거하고 나머지는 동일한 코드입니다.** `useMemo`를 사용하지 않은 것이 체감 되시나요?

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js src/TodoList.js active
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('Filtering ' + todos.length + ' todos for "' + tab + '" tab.');

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

메모이제이션 없이도 코드가 잘 작동하는 경우가 많습니다. 상호 작용이 충분이 빠르다면 메모이제이션은 필요하지 않을 수도 있습니다.

`utils.js`에서 할 일의 항목 수를 늘려보고 동작이 어떻게 바뀌는지 확인할 수 있습니다. 이 연산은 처음에는 비용이 많이 들지 않았지만 할 일의 수가 크게 증가하면 대부분의 오버헤어가 필터링이 아닌 재렌더링에 발생합니다. 아래에서 `useMemo`로 재렌더링을 최적화하는 방법에 대해 알아보세요.

<Solution />

</Recipes>

---

### 컴포넌트 재렌더링 건너뛰기 {/*skipping-re-rendering-of-components*/}

경우에 따라 `useMemo`는 하위 컴포넌트 재렌더링 성능을 최적화하는데 도움이 될 수도 있습니다. 이를 설명하기 위해 `TodoList` 컴포넌트가 자식 컴포넌트인 `List`에  `visibleTodos`를 prop로 전달한다고 가정하겠습니다.

```js {5}
export default function TodoList({ todos, tab, theme }) {
  // ...
  return (
    <div className={theme}>
      <List items={visibleTodos} />
    </div>
  );
}
```

`theme` prop를 토글하면 앱이 잠시 멈추는 것을 확인할 수 있습니다. 그러나 JSX에서 `<List />`를 제거하면 빠르게 느껴집니다. 이는 `List` 컴포넌트를 최적화할 가치가 있다는 것을 알려줍니다.

**기본적으로 React는 컴포넌트가 다시 렌더링 될 때, 모든 자식 컴포넌트를 재귀적으로 다시 렌더링합니다.** 그러므로 `TodoList`가 다른 `theme`로 다시 렌더링 되면 `List` 컴포넌트 *또한* 다시 렌더링 됩니다. 다시 렌더링하는 데 많은 계산이 필요하지 않는 컴포넌트는 괜찮지만, 다시 렌더링하는 것이 느리다는 것을 확인했다면 `List`를 [`memo`](/reference/react/memo)를 통해 감싸서 props가 마지막 렌더링 시점과 동일 할 때 다시 렌더링하는 것을 생략할 수 있습니다.

```js {3,5}
import { memo } from 'react';

const List = memo(function List({ items }) {
  // ...
});
```

**이 변경으로 `List`는 모든 props가 마지막 렌더링 때와 *동일*한 경우 다시 렌더링하지 않습니다.** 여기서 계산을 캐싱하는 것이 중요합니다! `useMemo`없이 `visibleTodos`를 계산한다고 가정해 봅시다.

```js {2-3,6-7}
export default function TodoList({ todos, tab, theme }) {
  // 테마가 변경될 때 마다 다른 배열이 표시됩니다.
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      {/* ... List의 props는 동일하지 않으며 매번 다시 렌더링 됩니다. */}
      <List items={visibleTodos} />
    </div>
  );
}
```

**위의 예시에서 `filterTodos` 함수는 항상 *다른* 배열을 생성합니다.** 이는 `{}` 객체 리터럴이 항상 새 객체를 생성하는 것과 유사합니다. 일반적으로 이는 문제가 되지 않지만 `List`의 props는 동일하지 않으며 [`memo`](/reference/react/memo)를 사용한 최적화가 작동하지 않는다는 것을 의미합니다. 이러한 경우 `useMemo`가 유용합니다.

```js {2-3,5,9-10}
export default function TodoList({ todos, tab, theme }) {
  // 재렌더링 사이에 계산을 캐싱하도록 React에 지시합니다...
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab] // ...따라서 해당 종속성이 변경되지 않는 한...
  );
  return (
    <div className={theme}>
      {/* ...List에 동일한 props가 전달되어 재렌더링을 생략할 수 있습니다. */}
      <List items={visibleTodos} />
    </div>
  );
}
```


**`visibleTodos`연산을 `useMemo`로 감싸면 다시 렌더링 될 때마다 *같은* 값을 갖게 할 수 있습니다** (종속성이 변경되기 전까지). *특별한 이유가 없는 한* 연산을 `useMemo`로 감싸지 않아도 됩니다. 이 예제에서는 [`memo`](/reference/react/memo)로 감싸진 컴포넌트에 전달하면 재렌더링을 건너뛸 수 있기 때문입니다. 이 페이지에서 자세히 설명하는 `useMemo`를 추가해야 하는 몇 가지 다른 이유가 있습니다. 

<DeepDive>

#### 개별 JSX 노드 메모화 {/*memoizing-individual-jsx-nodes*/}

`List`를 [`memo`](/reference/react/memo)로 감싸는 대신, `<List />` 노드 자체를 `useMemo`로 감싸면 됩니다.

```js {3,6}
export default function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  const children = useMemo(() => <List items={visibleTodos} />, [visibleTodos]);
  return (
    <div className={theme}>
      {children}
    </div>
  );
}
```

동작 방식은 동일합니다. `visibleTodos`이 변경되지 않은 경우 `List`는 다시 렌더링 되지 않습니다.

`<List items={visibleTodos} />`와 같은 JSX 노드는 `{ type: List, props: { items: visibleTodos } }`와 같은 객체입니다. 이 객체를 생성하는 것은 매우 저렴하지만, React는 그 내용이 지난번과 동일한지 알 수 없습니다. 그래서 기본적으로 React는 `List` 컴포넌트를 다시 렌더링합니다.

하지만 React가 이전 렌더링과 동일한 JSX를 발견하면 컴포넌트를 다시 렌더링하려고 시도하지 않습니다. JSX 노드는 [불변](https://en.wikipedia.org/wiki/Immutable_object)하기 때문입니다. JSX 노드 객체는 시간이 지나도 변경되지 않으므로 React는 재렌더링을 생략해도 안전하다는 것을 알고 있습니다. 그러나 이것이 동작하려면 노드가 단순히 코드적으로 동일해 보이는 것이 아닌 *실제로 동일한 객체*여야 합니다. 이 예제에서는 `useMemo`가 해당 일을 수행합니다.

JSX 노드를 `useMemo`로 수동으로 감싸는 것은 편리한 방법은 아닙니다. 예를 들어, 조건부로는 이 작업을 수행할 수 없습니다. 그래서 보통 JSX 노드를 감싸는 대신 컴포넌트를 [`memo`](/reference/react/memo)로 감쌉니다.

</DeepDive>

<Recipes titleText="재렌더링을 건너뛰는 것과 항상 재렌더링을 하는 것의 차이점" titleId="examples-rerendering">

#### `useMemo` 및 `memo`로 재렌더링 건너뛰기 {/*skipping-re-rendering-with-usememo-and-memo*/}

이 예제에서는 `List` 컴포넌트를 **인위적으로 느리게 만들어** 렌더링 중인 React 컴포넌트가 실제로 느려질 때 어떤 일이 발생하는 지를 확인할 수 있습니다. 탭을 전환하고 테마를 토글해 보세요.

탭을 전환하면 느려진 `List`가 다시 렌더링 되기 때문에 느리게 느껴집니다. 이는 `tab`이 변경되었으므로 사용자의 새로운 선택 사항을 화면에 반영해야 하기 때문에 예상되는 현상입니다.

다음으로 테마를 토글해 보겠습니다. **인위적인 속도 저하에도 불구하고 [`memo`](/reference/react/memo)와 함께 사용된 `useMemo` 덕분에 빠릅니다!** `List`는 마지막 렌더링 이후 `visibleItems` 배열이 변경되지 않았기 때문에 재렌더링을 생략했습니다. (`useMemo`에 종속성으로 전달된) `todos`와 `tab`이 모두 마지막 렌더링 이후 변경되지 않았으므로 `visibleItems` 배열이 변경되지 않았습니다.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/TodoList.js active
import { useMemo } from 'react';
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  return (
    <div className={theme}>
      <p><b>Note: <code>List</code> is artificially slowed down!</b></p>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js src/List.js
import { memo } from 'react';

const List = memo(function List({ items }) {
  console.log('[ARTIFICIALLY SLOW] Rendering <List /> with ' + items.length + ' items');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // 매우 느린 코드를 구현하기 위해 500ms 동안 아무것도 하지 않음.
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
});

export default List;
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

<Solution />

#### 항상 컴포넌트 재렌더링 하기 {/*always-re-rendering-a-component*/}

이 예제에서는 `List` 컴포넌트를 **인위적으로 느리게 만들어** 렌더링 중인 React 컴포넌트가 실제로 느려질 때 어떤 일이 발생하는 지를 확인할 수 있습니다. 탭을 전환하고 테마를 토글해 보세요.

이전 예제와 다르게 이제는 테마 전환도 느려졌습니다! **이 버전에는 `useMemo` 호출이 없기 때문에** `visibleTodos`는 항상 다른 배열이 되고 `List` 컴포넌트는 재렌더링을 생략할 수 없기 때문입니다.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/TodoList.js active
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <p><b>Note: <code>List</code> is artificially slowed down!</b></p>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js src/List.js
import { memo } from 'react';

const List = memo(function List({ items }) {
  console.log('[ARTIFICIALLY SLOW] Rendering <List /> with ' + items.length + ' items');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // 매우 느린 코드를 구현하기 위해 500ms 동안 아무것도 하지 않음.
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
});

export default List;
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

그러나 다음은 **인위적인 속도 저하를 제거한 동일한 코드입니다.** `useMemo`가 없는 것이 체감 되시나요?

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/TodoList.js active
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js src/List.js
import { memo } from 'react';

function List({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
}

export default memo(List);
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

메모이제이션 없이도 코드가 잘 동작하는 경우가 많습니다. 상호 작용이 충분히 빠르다면 메모이제이션을 할 필요가 없습니다.

앱의 속도를 실제로 저하시키는 요인을 현실적으로 파악하려면 프로덕션 모드에서 React를 실행하고, [React 개발자 도구](/learn/react-developer-tools)를 비활성화하고, 앱 사용자가 사용하는 것과 유사한 기기를 사용해야 한다는 점을 명심하세요.

<Solution />

</Recipes>

---

### 다른 Hook의 종속성 메모화 {/*memoizing-a-dependency-of-another-hook*/}

컴포넌트 본문에서 직접 생성된 객체에 의존하는 연산이 있다고 가정하겠습니다.

```js {2}
function Dropdown({ allItems, text }) {
  const searchOptions = { matchMode: 'whole-word', text };

  const visibleItems = useMemo(() => {
    return searchItems(allItems, searchOptions);
  }, [allItems, searchOptions]); // 🚩 주의: 컴포넌트 본문에서 생성된 객체에 대한 종속성
  // ...
```

이렇게 객체에 의존하는 것은 메모이제이션의 목적을 무색하게 합니다. 컴포넌트가 다시 렌더링 되면 컴포넌트 본문 내부의 모든 코드가 다시 실행되기 때문입니다. **`searchOptions` 객체를 생성하는 코드도 다시 렌더링 될 때마다 실행됩니다.** `searchOptions`은 `useMemo` 호출의 종속성이고 매번 다르기 때문에, React는 종속성이 다른 것을 알고`searchItems`을 매번 다시 계산합니다.

이 문제를 해결하기 위해 `searchOptions` 객체 *자체를* 종속성으로 전달하기 전에 메모해두면 됩니다.

```js {2-4}
function Dropdown({ allItems, text }) {
  const searchOptions = useMemo(() => {
    return { matchMode: 'whole-word', text };
  }, [text]); // ✅ text가 변경될 때만 변경

  const visibleItems = useMemo(() => {
    return searchItems(allItems, searchOptions);
  }, [allItems, searchOptions]); // ✅ allItems이나 searchOptions이 변경될 때만 변경
  // ...
```

위의 예제에서 `text`가 변경되지 않았다면 `searchOptions` 객체도 변경되지 않습니다. 그러나 이보다 더 나은 방법은 `searchOptions`를 `useMemo` 계산 함수의 *내부에* 선언하는 것입니다.

```js {3}
function Dropdown({ allItems, text }) {
  const visibleItems = useMemo(() => {
    const searchOptions = { matchMode: 'whole-word', text };
    return searchItems(allItems, searchOptions);
  }, [allItems, text]); // ✅ allItems이나 text가 변경될 때만 변경
  // ...
```

이제 연산은 `text` 에 직접적으로 의존합니다 (문자열이므로 "실수로" 달라질 수 없음).

---

### 함수 메모화 {/*memoizing-a-function*/}

`Form` 컴포넌트가 [`memo`](/reference/react/memo)로 감싸져 있고 여기에 prop로 함수를 전달하고 싶다고 가정해봅시다.

```js {2-7}
export default function ProductPage({ productId, referrer }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails
    });
  }

  return <Form onSubmit={handleSubmit} />;
}
```

`{}`가 다른 객체를 생성하는 것처럼 `function() {}`와 같은 함수 선언과 `() => {}` 같은 표현식은 다시 렌더링 될 때마다 *다른* 함수를 생성합니다. 새로운 함수를 만드는 것 자체는 문제가 되지 않으며 피해야 할 일이 아닙니다! 그러나 `Form` 컴포넌트가 메모화되어 있다면 props가 변경되지 않았을 때 다시 렌더링하는 것을 생략하고 싶을 것입니다. *항상* 다른 prop은 메모이제이션의 목적을 무색하게 만들 수 있습니다.

`useMemo`로 함수를 메모하려면 계산 함수에서 다른 함수를 반환해야 합니다.

```js {2-3,8-9}
export default function Page({ productId, referrer }) {
  const handleSubmit = useMemo(() => {
    return (orderDetails) => {
      post('/product/' + productId + '/buy', {
        referrer,
        orderDetails
      });
    };
  }, [productId, referrer]);

  return <Form onSubmit={handleSubmit} />;
}
```

위 예제는 투박해 보입니다! **함수를 메모하는 것은 충분히 일반적이기 때문에 React에는 이를 위한 Hook이 내장되어 있습니다. `useMemo` 대신 [`useCallback`](/reference/react/useCallback)으로 함수를 감싸서** 중첩된 함수를 추가로 작성하지 않도록 하세요.

```js {2,7}
export default function Page({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails
    });
  }, [productId, referrer]);

  return <Form onSubmit={handleSubmit} />;
}
```

위 두 예제는 완전히 동일하게 동작합니다. `useCallback`의 유일한 장점은 내부에 중첩된 함수를 추가로 작성하지 않아도 된다는 것입니다. 그 외에는 아무것도 하지 않습니다. [`useCallback`에 대해 더 읽어보세요.](/reference/react/useCallback)

---

## 문제 해결하기 {/*troubleshooting*/}

### 렌더링할 때마다 계산이 두 번 실행됩니다 {/*my-calculation-runs-twice-on-every-re-render*/}

[Strict 모드](/reference/react/StrictMode)에서 React는 일부 함수를 한 번이 아닌 두 번 호출합니다.

```js {2,5,6}
function TodoList({ todos, tab }) {
  // 이 컴포넌트 함수는 렌더링할 때마다 두 번 실행됩니다.

  const visibleTodos = useMemo(() => {
    // 종속성 중 하나라도 변경되면 이 계산은 두 번 실행됩니다.
    return filterTodos(todos, tab);
  }, [todos, tab]);

  // ...
```

이는 예상되는 현상이며 코드를 손상시키지 않습니다.

이 **개발 전용** 동작은 [컴포넌트가 순수하게 유지될 수 있도록](/learn/keeping-components-pure) 도와줍니다. React는 호출 결과 중 하나를 사용하고 다른 호출 결과는 무시합니다. 컴포넌트와 계산 함수가 순수하다면 로직에 영향을 미치지 않을 것입니다. 그러나 실수로 발생하는 불순한 경우에 발생하는 실수를 발견하고 수정하는 데 도움을 줍니다.

예를 들어 아래의 불순한 계산 함수는 prop으로 받은 배열을 변경합니다.

```js {2-3}
  const visibleTodos = useMemo(() => {
    // 🚩 Mistake: mutating a prop
    todos.push({ id: 'last', text: 'Go for a walk!' });
    const filtered = filterTodos(todos, tab);
    return filtered;
  }, [todos, tab]);
```

React가 함수를 두 번 호출하므로 todo가 두 번 추가됩니다. 계산이 기존의 객체를 변경해서는 안 되지만 계산 중에 생성된 *새로운* 객체를 변경하는 것은 괜찮습니다. 예를 들어 `filterTodos` 함수가 항상 *다른* 배열을 반환하는 경우 대신 *해당 배열*을 변경할 수 있습니다.

```js {3,4}
  const visibleTodos = useMemo(() => {
    const filtered = filterTodos(todos, tab);
    // ✅ 정답: 계산 중에 생성한 객체를 변경합니다.
    filtered.push({ id: 'last', text: 'Go for a walk!' });
    return filtered;
  }, [todos, tab]);
```

순수성에 대해 자세히 알아보려면 [컴포넌트 순수하게 유지하기](/learn/keeping-components-pure)를 읽어보세요.

또한 변경사항이 없는 [객체 업데이트](/learn/updating-objects-in-state) 및 [배열 업데이트](/learn/updating-arrays-in-state)에 대한 가이드도 확인해보세요. 

---

### `useMemo`가 객체를 반환해야 하는데 undefined를 반환합니다. {/*my-usememo-call-is-supposed-to-return-an-object-but-returns-undefined*/}

이 코드는 작동하지 않습니다.

```js {1-2,5}
  // 🔴 () => { 와 같은 화살표 함수는 객체를 반환하지 않습니다.
  const searchOptions = useMemo(() => {
    matchMode: 'whole-word',
    text: text
  }, [text]);
```

자바스크립트의 `() => {`는 화살표 함수의 본문의 시작이므로 `{` 중괄호는 객체의 일부가 아닙니다. 이것이 객체를 반환하지 않고 실수하는 지점입니다. `({` 과 `})` 같은 괄호를 추가하여 이 문제를 해결할 수 있습니다.

```js {1-2,5}
  // T이것은 작동하지만 누군가가 다시 위반하기 쉽습니다.
  const searchOptions = useMemo(() => ({
    matchMode: 'whole-word',
    text: text
  }), [text]);
```

하지만 해당 방식은 여전히 혼란을 주고, 괄호를 제거하면서 누군가 쉽게 위반할 수 있습니다.

이 실수를 방지하기 위해 `return` 문을 명시적으로 작성하세요.

```js {1-3,6-7}
  // ✅ 이것은 작동하며 명확합니다.
  const searchOptions = useMemo(() => {
    return {
      matchMode: 'whole-word',
      text: text
    };
  }, [text]);
```

---

### 컴포넌트가 렌더링 될 때마다 `useMemo`의 계산이 다시 실행됩니다. {/*every-time-my-component-renders-the-calculation-in-usememo-re-runs*/}

두 번째 인수로 종속성 배열을 지정했는지 확인하세요!

종속성 배열을 지정하지 않았을 경우 `useMemo`는 매번 다시 계산을 실행합니다.

```js {2-3}
function TodoList({ todos, tab }) {
  // 🔴 종속성 배열이 없어 매번 재계산 됨.
  const visibleTodos = useMemo(() => filterTodos(todos, tab));
  // ...
```

이것은 두 번째 인수로 종속성 배열을 전달하는 수정된 예시입니다.

```js {2-3}
function TodoList({ todos, tab }) {
  // ✅ 불필요한 재계산을 하지 않음.
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
```

만일 위의 예제가 도움이 되지 않았다면, 종속성 중 하나 이상이 이전 렌더링과 달라졌다는 문제일 수 있습니다. 종속성 들을 콘솔에 수동으로 로깅하여 이 문제를 디버그할 수 있습니다.

```js
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  console.log([todos, tab]);
```

그런 다음 콘솔에서 서로 다른 리렌더의 배열을 마우스 오른쪽 버튼으로 클릭하고 두 배열 모두에 대해 "전역 변수로 저장"을 선택합니다. 첫 번째 배열은 `temp1`, 두 번째 배열이 `temp2`로 저장되었다고 가정하면 브라우저 콘솔에서 두 배열의 각 종속성이 동일한지에 대해 확인할 수 있습니다.

```js
Object.is(temp1[0], temp2[0]); // 배열 간의 첫 번째 종속성이 동일합니까?
Object.is(temp1[1], temp2[1]); // 배열 간의 두 번째 종속성이 동일합니까?
Object.is(temp1[2], temp2[2]); // ... 그리고 기타 모든 종속성들이 동일합니까? ...
```

메모를 방해하는 종속성을 발견하면 제거할 방법을 찾거나 [메모할 방법을 찾으세요.](#memoizing-a-dependency-of-another-hook)

---

### 반복문에서 각 목록 항목에 대해 `useMemo`를 호출해야 하는데 허용되지 않습니다. {/*i-need-to-call-usememo-for-each-list-item-in-a-loop-but-its-not-allowed*/}

`Chart` 컴포넌트가 [`memo`](/reference/react/memo)로 감싸져 있다고 가정해보겠습니다. `ReportList` 컴포넌트가 다시 렌더링 될 때 목록의 모든 `Chart`를 다시 렌더링하는 것을 생략하고 싶을 것입니다. 그러나 반복문에서 `useMemo`를 호출할 수 없습니다. 

```js {5-11}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item => {
        // 🔴 반복문에서는 useMemo를 호출할 수 없습니다.
        const data = useMemo(() => calculateReport(item), [item]);
        return (
          <figure key={item.id}>
            <Chart data={data} />
          </figure>
        );
      })}
    </article>
  );
}
```

대신 각 항목에 대한 컴포넌트를 추출하고 개별 항목에 대한 데이터를 메모하세요.

```js {5,12-18}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item =>
        <Report key={item.id} item={item} />
      )}
    </article>
  );
}

function Report({ item }) {
  // ✅ 최상위 수준에서 useMemo를 호출합니다.
  const data = useMemo(() => calculateReport(item), [item]);
  return (
    <figure>
      <Chart data={data} />
    </figure>
  );
}
```

또는 `useMemo`를 제거하고 `Report` 자체를 [`memo`](/reference/react/memo)로 감싸는 방법도 있습니다. `item` prop가 변경되지 않으면 `Report`는 재렌더링을 건너뛰므로 `Chart` 역시 재렌더링을 건너뛰게 됩니다.

```js {5,6,12}
function ReportList({ items }) {
  // ...
}

const Report = memo(function Report({ item }) {
  const data = calculateReport(item);
  return (
    <figure>
      <Chart data={data} />
    </figure>
  );
});
```
