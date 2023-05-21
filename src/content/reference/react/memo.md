---
title: memo
---

<Intro>

`memo`를 사용하면 컴포넌트의 props가 변경되지 않은 경우 리렌더링을 건너뛸 수 있습니다.

```
const MemoizedComponent = memo(SomeComponent, arePropsEqual?)
```

</Intro>

<InlineToc />

---

## 레퍼런스 {/*reference*/}

### `memo(Component, arePropsEqual?)` {/*memo*/}

컴포넌트를 `memo`로 감싸면 해당 컴포넌트의 *memoized* 버전을 얻을 수 있습니다. memoized 버전의 컴포넌트는 일반적으로 부모 컴포넌트가 리렌더링 되어도 props가 변경되지 않았다면 리렌더링 되지 않습니다. 그러나 memoization는 성능을 최적화하는 것이지 보장하지 않기 때문에 React는 여전히 리렌더링 될 수도 있습니다.

```js
import { memo } from 'react';

const SomeComponent = memo(function SomeComponent(props) {
  // ...
});
```

[아래에서 더 많은 예시를 확인하세요.](#usage)

#### 매개변수 {/*parameters*/}

* `Component`: memoize 하려는 컴포넌트입니다. `memo`는 이 컴포넌트를 수정하지 않고 대신 새로운 memoized 컴포넌트를 반환합니다. 함수와 [`forwardRef`](/reference/react/forwardRef) 컴포넌트를 포함한 모든 유효한 React 컴포넌트가 허용됩니다. 

* **optional** `arePropsEqual`: 컴포넌트의 이전 props와 새로운 props의 두 가지 인수를 받는 함수입니다. 이전 props와 새로운 props가 동일한 경우, 즉 컴포넌트가 이전 props와 동일한 결과를 렌더링하고 새로운 props에서도 이전 props와 동일한 방식으로 동작하는 경우 `true`를 반환해야 합니다. 그렇지 않으면 `false`를 반환해야 합니다. 일반적으로 이 함수를 지정하지 않습니다. React는 기본적으로 [`Object.is`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/is)로 각 props를 비교합니다.

#### 반환 {/*returns*/}

`memo`는 새로운 React 컴포넌트를 반환합니다. `memo`에 제공한 컴포넌트와 동일하게 동작하지만, 부모가 리렌더링되더라도 props가 변경되지 않는 한 React는 이를 리렌더링하지 않습니다.

---

## 사용법 {/*usage*/}

### props가 변경되지 않았을 때 리렌더링 건너뛰기 {/*skipping-re-rendering-when-props-are-unchanged*/}

React는 일반적으로 부모가 리렌더링될 때마다 컴포넌트를 리렌더링합니다. `memo`를 사용하면, 새로운 props가 이전 props와 동일하다면 부모가 리렌더링될 때 새로운 props가 이전 props와 동일하면 리렌더링 되지 않는 컴포넌트를 만들 수 있습니다. 이러한 컴포넌트를 *memoized* 상태라고 합니다.

컴포넌트를 memoize 하려면 `memo`로 감싸고 기존 컴포넌트 대신에 반환된 값을 사용하세요.

```js
const Greeting = memo(function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
});

export default Greeting;
```
React 컴포넌트는 항상 [순수한 렌더링 로직](/learn/keeping-components-pure)을 가져야 합니다. 이는 props, state 그리고 context가 변경되지 않으면 항상 동일한 결과를 반환해야 함을 의미합니다. `memo`를 사용하면 컴포넌트가 이 요구 사항을 준수한다고 알리므로, props가 변경되지 않는 한 React는 리렌더링 될 필요가 없습니다. `memo`를 사용하더라도 컴포넌트의 state가 변경되거나 사용 중인 context가 변경되면 리렌더링 됩니다.

아래 예제에서 `Greeting` 컴포넌트는 `name`이 props 중 하나이기 때문에 `name`이 변경될 때마다 리렌더링 됩니다. 하지만 `address`는 `Greeting`의 props가 아니기 때문에 `address`가 변경될 때는 리렌더링 되지 않습니다.

<Sandpack>

```js
import { memo, useState } from 'react';

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting was rendered at", new Date().toLocaleTimeString());
  return <h3>Hello{name && ', '}{name}!</h3>;
});
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

<Note>

**`memo`는 성능 최적화를 위해서 사용해야 합니다.** `memo` 없이 코드가 작동하지 않는다면, 먼저 근본적인 문제를 찾아서 해결하세요. 이후에 `memo`를 추가하여 성능을 개선할 수 있습니다.

</Note>

<DeepDive>

#### 모든 곳에 memo를 추가해야할까요? {/*should-you-add-memo-everywhere*/}

이 사이트와 같이 대부분의 인터랙션이 투박한 앱의 경우(페이지 또는 전체 섹션 교체 등) 일반적으로 memoization는 불필요합니다. 반면 앱이 그림 편집기이고 도형 이동과 같이 대부분의 인터랙션이 세분되어 있다면, memoization가 유용할 수 있습니다.

`memo`로 최적화하는 것은 컴포넌트가 정확히 동일한 props로 자주 리렌더링 되고, 리렌더링 로직이 비용이 많이 드는 경우에만 유용합니다. 컴포넌트가 리렌더링 될 때 인지할 수 있을 만큼의 지연이 없다면 `memo`가 필요하지 않습니다. `memo`는 객체 또는 렌더링 중에 정의된 일반 함수처럼 *항상 다른* props가 컴포넌트에 전달되는 경우에 완전히 무용지물입니다. 따라서 `memo`와 함께 [`useMemo`](/reference/react/useMemo#skipping-re-rendering-of-components)와 [`useCallback`](/reference/react/useCallback#skipping-re-rendering-of-components)이 종종 필요합니다.

그 외의 경우에는 컴포넌트를 `memo`로 감싸는 이점이 없습니다. 그렇다고 해서 크게 해가 되지 않기 때문에 일부 팀에서는 개별 사례에 대해 고려하지 않고 가능한 한 많이 memoize 하는 방식을 선택하기도 합니다. 이 접근 방식은 코드 가독성이 떨어진다는 단점이 있습니다. 또한 모든 memoization가 효과적이지는 않습니다. 항상 변경되는 값이 하나라도 있다면, 컴포넌트 전체의 memoization를 중단하기에 충분합니다.

**실제로 몇가지 원칙을 따르면 memoization가 불필요할 수 있습니다.**

1. 컴포넌트가 다른 컴포넌트를 시각적으로 감쌀 때 [JSX를 자식으로 받아들이도록 하세요.](/learn/passing-props-to-a-component#passing-jsx-as-children) 이렇게 하면 wrapper 컴포넌트가 자신의 state를 업데이트할 때 React는 그 자식 컴포넌트가 리렌더링 될 필요가 없다는 것을 알 수 있습니다.
2. 지역 state를 선호하고 필요 이상으로 [state를 끌어올리기](/learn/sharing-state-between-components)를 하지 마세요. 예를 들어, 최상위 트리나 전역 state 라이브러리에 폼이나 아이템이 호버되었는지와 같은 일시적인 state를 두지 마세요.
3. [렌더링 로직을 순수하게](/learn/keeping-components-pure) 유지하세요. 컴포넌트를 렌더링했을 때 문제가 발생하거나 눈에 띄는 시각적 아티팩트가 생성된다면 컴포넌트에 버그가 있는 것입니다! memoization 하는 대신 버그를 수정하세요.
4. [state를 업데이트하는 불필요한 Effect](/learn/you-might-not-need-an-effect)를 피하세요. React 앱에서 대부분의 성능 문제는 컴포넌트를 반복해서 렌더링하게 만드는 Effect에서 발생하는 일련의 업데이트로 인해 발생합니다.
5. [Effect에서 불필요한 의존성을 제거](/learn/removing-effect-dependencies)하세요. 예를 들어, memoization 대신에 일부 객체나 함수를 Effect 내부나 컴포넌트 외부로 이동하는 것이 더 간단할 때가 많습니다.

특정 인터랙션이 여전히 느리게 느껴진다면 [React 개발자 도구 profiler](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html)를 사용해 어떤 컴포넌트가 memoization를 통해 가장 큰 이점을 얻을 수 있는지 확인하고 필요한 경우에 memoization 하세요. 이러한 원칙은 컴포넌트를 더 쉽게 디버깅하고 이해할 수 있게 해주므로 어떤 경우든 이 원칙을 따르는 것이 좋습니다. 장기적으로는 이 문제를 완전히 해결하기 위해 [세분된 memoization를 자동으로 수행하는 방법](https://www.youtube.com/watch?v=lGEMwh32soc)을 연구하고 있습니다.

</DeepDive>

---

### state를 사용하여 memoization 된 컴포넌트 업데이트하기 {/*updating-a-memoized-component-using-state*/}

컴포넌트가 memoization 된 경우에도, 컴포넌트의 state가 변경되면 리렌더링 됩니다. 메모화는 부모에서 컴포넌트로 전달되는 props에만 적용됩니다.

<Sandpack>

```js
import { memo, useState } from 'react';

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log('Greeting was rendered at', new Date().toLocaleTimeString());
  const [greeting, setGreeting] = useState('Hello');
  return (
    <>
      <h3>{greeting}{name && ', '}{name}!</h3>
      <GreetingSelector value={greeting} onChange={setGreeting} />
    </>
  );
});

function GreetingSelector({ value, onChange }) {
  return (
    <>
      <label>
        <input
          type="radio"
          checked={value === 'Hello'}
          onChange={e => onChange('Hello')}
        />
        Regular greeting
      </label>
      <label>
        <input
          type="radio"
          checked={value === 'Hello and welcome'}
          onChange={e => onChange('Hello and welcome')}
        />
        Enthusiastic greeting
      </label>
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

state 변수를 현재 값으로 설정하면 React는 `memo` 없이도 컴포넌트 리렌더링을 건너뜁니다. 컴포넌트가 한 번 더 호출될 수 있지만, 결과는 무시됩니다.

---

### context를 사용하여 메모화된 컴포넌트 업데이트하기 {/*updating-a-memoized-component-using-a-context*/}

컴포넌트가 메모화 되었더라도, 사용 중인 context가 변경될 때 이 컴포넌트는 리렌더링 됩니다. 메모화는 부모로부터 전달되는 props에만 적용됩니다.

<Sandpack>

```js
import { createContext, memo, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('dark');

  function handleClick() {
    setTheme(theme === 'dark' ? 'light' : 'dark'); 
  }

  return (
    <ThemeContext.Provider value={theme}>
      <button onClick={handleClick}>
        Switch theme
      </button>
      <Greeting name="Taylor" />
    </ThemeContext.Provider>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting was rendered at", new Date().toLocaleTimeString());
  const theme = useContext(ThemeContext);
  return (
    <h3 className={theme}>Hello, {name}!</h3>
  );
});
```

```css
label {
  display: block;
  margin-bottom: 16px;
}

.light {
  color: black;
  background-color: white;
}

.dark {
  color: white;
  background-color: black;
}
```

</Sandpack>

일부 context의 _일정 부분_ 이 변경될 때만 컴포넌트가 리렌더링 되도록 하려면 컴포넌트를 두 개로 나눠야 합니다. 외부 컴포넌트의 context에서 필요한 내용을 읽고, 메모화된 자식에게 prop으로 전달하세요.

---

### props 변경 최소화하기 {/*minimizing-props-changes*/}

`memo`를 사용할 때 어떤 prop든 이전의 prop과 *얕은 비교 결과*가 같지 않을 때마다 컴포넌트가 리렌더링 됩니다. 즉 React는 [`Object.is`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 비교를 사용하여 컴포넌트의 모든 prop을 이전 값과 비교합니다. `Object.is(3, 3)`는 `true`이지만 `Object.is({}, {})`는 `false`입니다.


`memo`를 최대한 활용하려면, props가 변경되는 횟수를 최소화해야 합니다. 예를 들어 prop이 객체인 경우, [`useMemo`:](/reference/react/useMemo)를 사용하여 부모 컴포넌트가 해당 객체를 매번 다시 만드는 것을 방지하세요.

```js {5-8}
function Page() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  const person = useMemo(
    () => ({ name, age }),
    [name, age]
  );

  return <Profile person={person} />;
}

const Profile = memo(function Profile({ person }) {
  // ...
});
```

props의 변경을 최소화하는 더 좋은 방법은 컴포넌트가 props에 필요한 최소한의 정보만 받도록 하는 것입니다. 예를 들어, 전체 객체 대신 개별 값을 받을 수 있습니다.

```js {4,7}
function Page() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);
  return <Profile name={name} age={age} />;
}

const Profile = memo(function Profile({ name, age }) {
  // ...
});
```

때로는 개별 값도 자주 변경되지 않는 값으로 사용될 수 있습니다. 예를 들어 다음 컴포넌트는 값 자체가 아니라 값의 존재를 나타내는 불리언 값을 받습니다.

```js {3}
function GroupsLanding({ person }) {
  const hasGroups = person.groups !== null;
  return <CallToAction hasGroups={hasGroups} />;
}

const CallToAction = memo(function CallToAction({ hasGroups }) {
  // ...
});
```
메모화된 컴포넌트에 함수를 전달해야 하는 경우, 컴포넌트 외부에 함수를 선언하여 변경되지 않도록 하거나, [`useCallback`](/reference/react/useCallback#skipping-re-rendering-of-components)을 사용하여 리렌더링 사이에 함수의 선언을 캐시 합니다.

---

### 사용자 정의 비교 함수 지정하기 {/*specifying-a-custom-comparison-function*/}

드물지만 메모화된 컴포넌트의 props 변경을 최소화하는 것이 불가능할 수 있습니다. 이 경우 사용자 정의 비교 함수를 제공하여 React가 얕은 비교를 사용하는 대신에 이전 props와 새로운 props를 비교할 수 있습니다. 이 함수는 `memo`의 두 번째 인수로 전달됩니다. 새로운 props가 이전 props와 동일한 결과를 생성하는 경우에만 `true`를 반환해야 합니다. 그렇지 않으면 `false`를 반환해야 합니다.

```js {3}
const Chart = memo(function Chart({ dataPoints }) {
  // ...
}, arePropsEqual);

function arePropsEqual(oldProps, newProps) {
  return (
    oldProps.dataPoints.length === newProps.dataPoints.length &&
    oldProps.dataPoints.every((oldPoint, index) => {
      const newPoint = newProps.dataPoints[index];
      return oldPoint.x === newPoint.x && oldPoint.y === newPoint.y;
    })
  );
}
```

이 경우 브라우저 개발자 도구의 성능 패널을 사용하여 비교 기능이 실제로 컴포넌트를 다시 렌더링하는 것보다 빠른지 확인하세요. 놀랄 수도 있습니다.

성능 측정을 할 때, React가 프로덕션 환경에서 실행되고 있는지 확인하세요.

<Pitfall>

`arePropsEqual`를 구현하는 경우 **함수를 포함하여 모든 prop를 비교해야 합니다.** 함수는 종종 부모 컴포넌트의 props와 state를 [클로저로 다룹니다](https://developer.mozilla.org/ko/docs/Web/JavaScript/Closures). `oldProps.onClick !== newProps.onClick`일 때 `true`를 반환하면 컴포넌트가 `onClick` 핸들러 내에서 이전 렌더링의 props와 state를 계속 "인식"하여 매우 혼란스러운 버그가 발생할 수 있습니다.

작업 중인 데이터 구조가 알려진 제한된 깊이를 가지고 있다고 100% 확신하지 않는 한, `arePropsEqual` 내에서 깊은 비교를 수행하지 마세요. **깊은 비교는 매우 느려질 수 있으며** 나중에 누군가 데이터 구조를 변경하면 앱이 잠깐 정지될 수 있습니다.

</Pitfall>

---

## 문제 해결 {/*troubleshooting*/}
### prop가 객체, 배열 또는 함수인 경우 컴포넌트가 리렌더링됩니다. {/*my-component-rerenders-when-a-prop-is-an-object-or-array*/}

React는 얕은 비교를 기준으로 이전 props와 새로운 props를 비교합니다. 즉, 각각의 새로운 prop가 이전 prop와 참조가 동일한지 여부를 고려합니다. 부모가 리렌더링 될 때마다 새로운 객체나 배열을 생성하면, 개별 요소들이 모두 동일하더라도 React는 여전히 변경된 것으로 간주합니다. 마찬가지로 부모 컴포넌트를 렌더링할 때 새로운 함수를 만들면 React는 함수의 정의가 동일하더라도 변경된 것으로 간주합니다. 이를 방지하려면 [부모 컴포넌트에서 props를 단순화하거나 메모화 하세요.](#minimizing-props-changes)
