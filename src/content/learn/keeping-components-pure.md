---
title: 컴포넌트를 순수하게 유지하기
---

<Intro>

일부 자바스크립트 함수는 *순수*합니다. 순수 함수는 오직 연산만을 수행합니다. 컴포넌트를 엄격하게 순수 함수로만 작성하면 코드베이스의 규모가 점점 커지더라도 예상밖의 동작이나 당황케하는 버그를 피할 수 있습니다. 이런 효과를 얻기 위해서는 몇 가지 규칙을 따라야 합니다.

</Intro>

<YouWillLearn>

* 순수성이란 무엇인지 그리고, 순수성을 통해 버그를 피하는 방법
* 렌더링 단계에서 변화를 막아 컴포넌트의 순수성을 유지하는 방법
* 엄격 모드(Strict Mode)를 활용해 컴포넌트 속 실수를 발견하는 방법

</YouWillLearn>

## 순수성: 수식으로서의 컴포넌트 {/*purity-components-as-formulas*/}

컴퓨터 과학에서(특히 함수형 프로그래밍의 세계에서는) [순수 함수](https://wikipedia.org/wiki/Pure_function)는 다음과 같은 특징을 지니고 있습니다.

* **자신의 일에만 집중합니다.** 함수가 호출되기 전에 존재했던 어떤 객체나 변수도 변경하지 않습니다.
* **같은 입력, 같은 출력.** 같은 입력이 주어졌다면 순수 함수는 항상 같은 결과를 반환합니다.

여러분들에게 이미 익숙할 수학 수식은 순수 함수의 예시 중 하나입니다.

이 수학 공식을 생각해보세요. <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math>.

만약 <Math><MathI>x</MathI> = 2</Math>이라면 항상 <Math><MathI>y</MathI> = 4</Math>입니다.

만약 <Math><MathI>x</MathI> = 3</Math>이라면 항상 <Math><MathI>y</MathI> = 6</Math>입니다.

만약 <Math><MathI>x</MathI> = 3</Math>이라면, 그날의 시간이나 주식 시장의 상태에 따라 <MathI>y</MathI>가 갑자기 <Math>9</Math>가 되거나 <Math>–1</Math>이 되거나 <Math>2.5</Math>가 되는 일은 일어나지 않습니다.

만약 <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math> 그리고 <Math><MathI>x</MathI> = 3</Math>이라면, <MathI>y</MathI>는 _항상_ <Math>6</Math>이 될 것입니다.

위 내용들을 자바스크립트 함수로 만든다면 아래와 같습니다.

```js
function double(number) {
  return 2 * number;
}
```

위 예시에서, `double`은 **순수 함수**입니다. 인자로 `3`을 넘긴다면, 항상 `6`을 반환할 것입니다.

React는 이러한 개념을 기반으로 설계되었습니다. **React는 여러분이 작성하는 모든 컴포넌트가 순수 함수라고 가정합니다.** 이러한 가정은 React 컴포넌트에 같은 입력이 주어진다면 늘 같은 JSX를 반환한다는 것을 의미합니다.

<Sandpack>

```js src/App.js
function Recipe({ drinkers }) {
  return (
    <ol>
      <li>Boil {drinkers} cups of water.</li>
      <li>Add {drinkers} spoons of tea and {0.5 * drinkers} spoons of spice.</li>
      <li>Add {0.5 * drinkers} cups of milk to boil and sugar to taste.</li>
    </ol>
  );
}

export default function App() {
  return (
    <section>
      <h1>Spiced Chai Recipe</h1>
      <h2>For two</h2>
      <Recipe drinkers={2} />
      <h2>For a gathering</h2>
      <Recipe drinkers={4} />
    </section>
  );
}
```

</Sandpack>

`Recipe`에 `drinkers={2}`를 넘기면 항상 `2 cups of water`를 포함한 JSX 반환합니다.

`drinkers={4}`를 넘기면 항상 `4 cups of water`를 포함한 JSX를 반환합니다.

수학 공식처럼 말입니다.

컴포넌트를 마치 레시피라고 생각할 수도 있습니다. 레시피를 그대로 따르고 요리 중 새로운 재료를 추가하지 않으면 매번 동일한 요리를 만들 수 있습니다. 여기서 "요리"는 컴포넌트가 React에 전달하여 [렌더링](/learn/render-and-commit)하도록 하는 JSX입니다.

<Illustration src="/images/docs/illustrations/i_puritea-recipe.png" alt="A tea recipe for x people: take x cups of water, add x spoons of tea and 0.5x spoons of spices, and 0.5x cups of milk" />

## 사이드 이펙트: 의도하지(않은) 결과 {/*side-effects-unintended-consequences*/}

React의 렌더링 과정은 항상 순수해야 합니다. 컴포넌트는 JSX만 반환해야 하며, 렌더링 이전에 존재했던 어떤 객체나 변수도 변경해서는 안 됩니다. 그것은 컴포넌트를 순수하지 않게 만듭니다!

아래는 이러한 규칙을 위반하는 컴포넌트입니다.

<Sandpack>

```js
let guest = 0;

function Cup() {
  // 나쁜 지점: 이미 존재했던 변수를 변경하고 있습니다!
  guest = guest + 1;
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup />
      <Cup />
      <Cup />
    </>
  );
}
```

</Sandpack>

이 컴포넌트는 컴포넌트 외부에 선언된 `guest`라는 변수를 읽고 수정하고 있습니다. 이는 **해당 컴포넌트를 여러 번 호출할 때마다 서로 다른 JSX를 생성한다**는 것을 의미합니다! 게다가 _다른_ 컴포넌트들이 `guest`를 읽는다면, 각각 언제 렌더링 되었는지에 따라 서로 다른 JSX를 생성할 것입니다! 이것은 예측 불가능한 동작입니다.

<Math><MathI>y</MathI> = 2<MathI>x</MathI></Math>라는 수식으로 돌아가서, 이제 우리는 <Math><MathI>x</MathI> = 2</Math>라 하더라도 항상 <Math><MathI>y</MathI> = 4</Math>일 것이라고 확신할 수 없습니다. 우리의 테스트가 실패하거나, 사용자는 불편을 겪으며, 심지어 비행기까지 추락하게 만들 수도 있습니다. 순수하지 못한 코드가 얼마나 혼란스러운 버그로 이어질 수 있는지 아시겠나요?

대신, [`guest` 변수를 Prop으로 넘겨](/learn/passing-props-to-a-component)이 컴포넌트를 고칠 수 있습니다.

<Sandpack>

```js
function Cup({ guest }) {
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup guest={1} />
      <Cup guest={2} />
      <Cup guest={3} />
    </>
  );
}
```

</Sandpack>

이제 컴포넌트가 `guest` prop에만 의존해 JSX를 반환하므로 순수해졌습니다.

일반적으로 컴포넌트가 특정 순서대로 렌더링될 것이라고 기대하면 안됩니다. <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math>를 <Math><MathI>y</MathI> = 5<MathI>x</MathI></Math>보다 먼저 계산하든 나중에 계산하든 상관없습니다. 두 수식은 서로 독립적으로 결과를 도출하기 때문입니다. 마찬가지로 각 컴포넌트는 "자기 자신만 생각"해야 합니다. 렌더링 도중에 다른 컴포넌트와 영향을 주고받거나, 의존해서는 안됩니다. 렌더링은 마치 학교 시험과 같습니다. 각 컴포넌트는 자신의 JSX를 직접 계산해야 합니다!

<DeepDive>

#### 엄격 모드(Strict Mode)로 순수하지 않은 연산을 찾아내기 {/*detecting-impure-calculations-with-strict-mode*/}

아직 전부 사용해본 적은 없을 수 있지만, React에서는 렌더링하는 동안 읽을 수 있는 세 가지 종류의 입력 요소가 있습니다. [Props](/learn/passing-props-to-a-component), [State](/learn/state-a-components-memory), 그리고 [Context](/learn/passing-data-deeply-with-context). 이러한 입력 요소는 항상 읽기전용으로 취급해야 합니다.

사용자의 입력에 따라 무언가를 _변경_ 하려는 경우, 변수 값을 직접 수정하는 대신 [State](/learn/state-a-components-memory)를 설정(set)해야 합니다. 컴포넌트가 렌더링되는 동안엔 기존 변수나 객체를 변경하면 안됩니다.

React는 개발 중에 각 컴포넌트의 함수를 두 번 호출하는 "엄격 모드"를 제공합니다. **컴포넌트 함수를 두 번 호출함으로써, 엄격 모드는 이러한 규칙을 위반하는 컴포넌트를 찾는데 도움을 줍니다.**

원래 예시에서 "Guest #1", "Guest #2", "Guest #3" 대신 "Guest #2", "Guest #4", "Guest #6"이 어떻게 표시되었는지 확인해보세요. 기존 함수가 순수하지 않았기에 엄격 모드로 인해 두 번 호출되는 과정에서 로직이 깨져버렸습니다. 그러나 수정된 순수 버전의 함수는 두 번씩 호출되더라도 동작합니다. **순수 함수는 오직 계산만 수행하므로 두 번 호출되더라도 아무것도 변하지 않습니다.** `double(2)`를 두 번 호출해도 반환값은 변하지 않는 것과 <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math>을 두 번 푼다고 해도 <MathI>y</MathI>값이 바뀌지는 않는 것처럼, 항상 같은 입력이면 같은 출력을 내보냅니다.

엄격 모드는 프로덕션에 영향을 주지 않기 때문에 사용자의 앱 속도가 느려지지 않습니다. 엄격 모드를 적용하려면 최상단 컴포넌트를 `<React.StrictMode>`로 감싸면 됩니다. 몇몇 프레임워크에는 이것이 기본적으로 설정되어 있습니다.

</DeepDive>

### 지역 변경: 컴포넌트의 작은 비밀 {/*local-mutation-your-components-little-secret*/}

위 예시에서의 문제는 컴포넌트가 기존 변수를 렌더링 중에 변경했다는 것입니다. 이것은 "**변경<sup>Mutation</sup>**"으로 불려 더 무시무시하게 들립니다. 순수 함수는 함수 스코프 밖의 변수나 호출 전에 생성된 객체를 변경하지 않습니다.

그러나, **렌더링하는 동안 _방금_ 생성한 변수와 객체를 변경하는 것은 전혀 문제가 없습니다.** 이번 예시에서는, `[]` 배열을 만들고, `cups` 변수에 할당하고, 컵 한 묶음을 `push` 할 것입니다.

<Sandpack>

```js
function Cup({ guest }) {
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaGathering() {
  const cups = [];
  for (let i = 1; i <= 12; i++) {
    cups.push(<Cup key={i} guest={i} />);
  }
  return cups;
}
```

</Sandpack>

만약 `cups` 변수나 `[]` 배열이 `TeaGathering`의 바깥에서 생성되었다면 정말 큰 문제가 될 겁니다! 배열에 요소들을 `push`하면 _이미 존재하던_ 객체가 직접 변경되기 때문입니다.

하지만 위 예시에서는 동일한 렌더링 과정 중에 `TeaGathering` 내부에서 변수와 배열이 생성되었기 때문에 괜찮습니다. `TeaGathering` 외부에 있는 코드들은 이런 일이 생겼는지도 모릅니다. 이를 **"지역 변경"** 이라 하며, 이것은 컴포넌트의 작은 비밀과도 같습니다.

## 사이드 이펙트를 _일으킬 수 있는_ 지점 {/*where-you-_can_-cause-side-effects*/}

함수형 프로그래밍은 순수성에 크게 의존하지만, 결국 어느 시점에 어디선가 _무언가는_ 바뀌어야 합니다. 그것이 프로그래밍의 요점입니다! 화면을 업데이트하고, 애니메이션을 시작하고, 데이터를 변경하는 이러한 변화들을 **사이드 이펙트**라고 합니다. 렌더링 중에 발생하는 것이 아니라 _"사이드에서"_ 발생하는 현상입니다.

React에서, **사이드 이펙트는 보통 [이벤트 핸들러](/learn/responding-to-events) 내부에 위치합니다. **이벤트 핸들러는 React가 일부 작업을 수행할 때 반응하는 함수들입니다. 예를 들면 버튼을 클릭할 때처럼 말이죠. 이벤트 핸들러가 컴포넌트 _내부에_ 정의되었다 하더라도 렌더링 _중에는_ 실행되지 않습니다! **그래서 이벤트 핸들러는 순수할 필요가 없습니다.**

다른 옵션을 모두 사용했음에도 사이드 이펙트를 처리할 적합한 이벤트 핸들러를 찾지 못했다면, 컴포넌트에서 [`useEffect`](/reference/react/useEffect)를 호출해 반환된 JSX에 해당 사이드 이펙트를 연결할 수 있습니다. 이렇게 하면 React가 렌더링을 마치고 사이드 이펙트가 허용된 시점에 그것을 실행하도록 만듭니다. **그러나 이 방식은 최후의 수단이 되어야 합니다.**

가능하면 렌더링만으로 로직을 표현해 보세요. 이것이 당신을 얼마나 더 나아가게 할 수 있는지 알면 놀라게 될 것입니다!

<DeepDive>

#### React는 왜 순수성을 신경쓸까요? {/*why-does-react-care-about-purity*/}

순수 함수를 작성하려면 약간의 습관과 훈련이 필요합니다. 그러나 이건 또한 놀라운 기회를 열어줍니다.

* 컴포넌트는 다른 환경에서도 실행될 수 있습니다. 예를 들면 서버에서 말이죠! 동일한 입력에 대해 동일한 결과를 반환하기 때문에 하나의 컴포넌트는 많은 사용자 요청을 처리할 수 있습니다.
* 입력이 변경되지 않은 컴포넌트들은 [렌더링을 건너뛰어](/reference/react/memo) 성능을 향상시킬 수 있습니다. 순수 함수는 항상 동일한 결과를 반환하므로 캐싱하기에 안전합니다.
* 깊은 컴포넌트 트리를 렌더링하는 도중에 일부 데이터가 변경되는 경우, React는 무의미해진 렌더링을 끝내는 데 시간을 낭비하지 않고 렌더링을 아예 다시 시작할 수 있습니다. 순수성은 언제든지 연산을 중단하는 것을 안전하게 합니다.

우리가 구축하고 있는 모든 새로운 React 기능은 순수성을 활용합니다. 데이터 가져오기에서부터 애니메이션, 성능에 이르기까지 컴포넌트를 순수하게 유지하면 React 패러다임의 힘이 발휘됩니다.

</DeepDive>

<Recap>

* 컴포넌트는 순수해야만 합니다. 이것은 두 가지를 의미합니다.
  * **자신의 일에만 집중합니다.** 렌더링 전에 존재했던 객체나 변수를 변경하지 않아야 합니다.
  * **같은 입력, 같은 출력.** 입력이 같을 경우, 컴포넌트는 항상 같은 JSX를 반환해야 합니다.
* 렌더링은 언제든지 발생할 수 있으므로 컴포넌트는 서로의 렌더링 순서에 의존하지 않아야 합니다.
* 컴포넌트가 렌더링을 위해 사용하는 입력을 변경해서는 안됩니다. 여기에는 Props, State, Context가 포함됩니다. 화면을 업데이트하려면 기존 객체를 변경하는 대신 [State를 "set"](/learn/state-a-components-memory)하세요.
* 반환하는 JSX에서 컴포넌트의 로직을 표현하기 위해 노력하세요. "무언가를 변경"해야 할 경우 일반적으로 이벤트 핸들러에서 변경하고 싶을 것입니다. 최후의 수단으로 `useEffect`를 사용할 수 있습니다.
* 순수 함수를 작성하는 것은 약간의 연습이 필요하지만, React 패러다임의 힘을 발휘하게 합니다.

</Recap>

<Challenges>

#### 고장난 시계 고치기 {/*fix-a-broken-clock*/}

이 컴포넌트는 자정부터 아침 6시까지의 시간에는 `<h1>`의 CSS 클래스를 `"night"`로 설정하고 그 외에 시간에는 `"day"`로 설정하려고 합니다. 하지만 이건 동작하지 않습니다. 이 컴포넌트를 고칠 수 있나요?

컴퓨터의 시간대를 일시적으로 변경하여 정답이 동작하는지 확인할 수 있습니다. 현재 시간이 자정에서 아침 6시 사이이면 시계의 색상이 반전되어야 합니다!

<Hint>

렌더링은 *연산*일 뿐이며, 무언가를 직접 "수행"하려고 해서는 안 됩니다. 같은 생각을 다르게 표현할 수 있나요?

</Hint>

<Sandpack>

```js src/Clock.js active
export default function Clock({ time }) {
  const hours = time.getHours();
  if (hours >= 0 && hours <= 6) {
    document.getElementById('time').className = 'night';
  } else {
    document.getElementById('time').className = 'day';
  }
  return (
    <h1 id="time">
      {time.toLocaleTimeString()}
    </h1>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  return (
    <Clock time={time} />
  );
}
```

```css
body > * {
  width: 100%;
  height: 100%;
}
.day {
  background: #fff;
  color: #222;
}
.night {
  background: #222;
  color: #fff;
}
```

</Sandpack>

<Solution>

`className`을 연산하고 렌더링 출력에 포함해서 이 컴포넌트를 고칠 수 있습니다.

<Sandpack>

```js src/Clock.js active
export default function Clock({ time }) {
  const hours = time.getHours();
  let className;
  if (hours >= 0 && hours <= 6) {
    className = 'night';
  } else {
    className = 'day';
  }
  return (
    <h1 className={className}>
      {time.toLocaleTimeString()}
    </h1>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  return (
    <Clock time={time} />
  );
}
```

```css
body > * {
  width: 100%;
  height: 100%;
}
.day {
  background: #fff;
  color: #222;
}
.night {
  background: #222;
  color: #fff;
}
```

</Sandpack>

이 예시에서는 사이드 이펙트(DOM 수정)가 전혀 필요하지 않았습니다. JSX만 반환하면 됩니다.

</Solution>

#### 망가진 프로필 고치기 {/*fix-a-broken-profile*/}

두 개의 `Profile` 컴포넌트는 각각 다른 데이터로 나란히 렌더링됩니다. 첫 번째 프로필에서 "Collapse"를 누른 다음 "Expand"를 누릅니다. 이제 두 프로필에 동일한 사람이 표시될 것입니다. 이것은 버그입니다.

버그의 원인을 찾아서 고쳐보세요.

<Hint>

버그가 있는 코드는 `Profile.js`에 있습니다. 처음부터 끝까지 읽으세요!

</Hint>

<Sandpack>

```js src/Profile.js
import Panel from './Panel.js';
import { getImageUrl } from './utils.js';

let currentPerson;

export default function Profile({ person }) {
  currentPerson = person;
  return (
    <Panel>
      <Header />
      <Avatar />
    </Panel>
  )
}

function Header() {
  return <h1>{currentPerson.name}</h1>;
}

function Avatar() {
  return (
    <img
      className="avatar"
      src={getImageUrl(currentPerson)}
      alt={currentPerson.name}
      width={50}
      height={50}
    />
  );
}
```

```js src/Panel.js hidden
import { useState } from 'react';

export default function Panel({ children }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="panel">
      <button onClick={() => setOpen(!open)}>
        {open ? 'Collapse' : 'Expand'}
      </button>
      {open && children}
    </section>
  );
}
```

```js src/App.js
import Profile from './Profile.js';

export default function App() {
  return (
    <>
      <Profile person={{
        imageId: 'lrWQx8l',
        name: 'Subrahmanyan Chandrasekhar',
      }} />
      <Profile person={{
        imageId: 'MK3eW3A',
        name: 'Creola Katherine Johnson',
      }} />
    </>
  )
}
```

```js src/utils.js hidden
export function getImageUrl(person, size = 's') {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; }
.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
  width: 200px;
}
h1 { margin: 5px; font-size: 18px; }
```

</Sandpack>

<Solution>

문제는 `Profile` 컴포넌트가 기존 변수인 `currentPerson`를 수정하고 `Header` 및 `Avatar` 컴포넌트가 이 변수를 읽는다는 점입니다. 이것은 *세 가지 모두*를 순수하지 않게 만들고 예측하기 어렵게 만듭니다.

버그를 수정하려면 `currentPerson` 변수를 제거하세요. 대신, Props를 통해 `Profile`의 모든 정보를 `Header` 및 `Avatar`로 전달하세요. 두 컴포넌트에 `person` 프로퍼티를 추가하여 모든 하위 컴포넌트로 전달해야 합니다.

<Sandpack>

```js src/Profile.js active
import Panel from './Panel.js';
import { getImageUrl } from './utils.js';

export default function Profile({ person }) {
  return (
    <Panel>
      <Header person={person} />
      <Avatar person={person} />
    </Panel>
  )
}

function Header({ person }) {
  return <h1>{person.name}</h1>;
}

function Avatar({ person }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={50}
      height={50}
    />
  );
}
```

```js src/Panel.js hidden
import { useState } from 'react';

export default function Panel({ children }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="panel">
      <button onClick={() => setOpen(!open)}>
        {open ? 'Collapse' : 'Expand'}
      </button>
      {open && children}
    </section>
  );
}
```

```js src/App.js
import Profile from './Profile.js';

export default function App() {
  return (
    <>
      <Profile person={{
        imageId: 'lrWQx8l',
        name: 'Subrahmanyan Chandrasekhar',
      }} />
      <Profile person={{
        imageId: 'MK3eW3A',
        name: 'Creola Katherine Johnson',
      }} />
    </>
  );
}
```

```js src/utils.js hidden
export function getImageUrl(person, size = 's') {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; }
.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
  width: 200px;
}
h1 { margin: 5px; font-size: 18px; }
```

</Sandpack>

React는 컴포넌트 함수가 특정 순서로 실행된다는 것을 보장하지 않기 때문에, 컴포넌트 함수 간에 변수로 소통할 수 없습니다. 모든 소통은 프로퍼티를 통해 이루어져야 합니다.

</Solution>

#### 깨진 StoryTray 수리하기 {/*fix-a-broken-story-tray*/}

회사의 CEO가 온라인 시계 앱에 "stories"를 추가해 달라고 요청했는데 거절할 수 없는 상황입니다. "Create Story" 플레이스홀더 뒤에 `stories` 목록을 받는 `StoryTray`컴포넌트를 작성했습니다.

프로퍼티로 받는 `stories` 배열 마지막에 가짜 story를 하나 더 추가해서 "Create Story" 플레이스홀더를 구현했습니다. 하지만 어떤 이유에서인지 "Create Story"는 한 번 이상 등장합니다. 이 문제를 해결해보세요.

<Sandpack>

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  stories.push({
    id: 'create',
    label: 'Create Story'
  });

  return (
    <ul>
      {stories.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

const initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  const [stories, setStories] = useState([...initialStories])
  const time = useTime();

  // HACK: Prevent the memory from growing forever while you read docs.
  // We're breaking our own rules here.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>It is {time.toLocaleTimeString()} now.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

</Sandpack>

<Solution>

시계가 업데이트될 때마다 "Create story"가 _두 번_ 추가됩니다. 이는 렌더링 중에 변경이 있음을 암시합니다. 엄격 모드는 컴포넌트를 두 번 호출하여 이러한 문제를 더 눈에 띄게 만들도록 해줍니다.

`StoryTray` 함수는 순수하지 않습니다. 전달된 `stories` 배열(Prop)에서 `push`를 호출하면 `StroyTray`가 렌더링을 시작하기 _전에_ 생성되었던 객체를 직접 변경합니다. 이로 인해 버그가 발생하고 결과를 예측하기가 매우 어렵게 되었습니다.

가장 간단한 해결 방법은 배열을 전혀 건드리지 않고 "Create Story"를 별도로 렌더링하는 것입니다.

<Sandpack>

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  return (
    <ul>
      {stories.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
      <li>Create Story</li>
    </ul>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

const initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  const [stories, setStories] = useState([...initialStories])
  const time = useTime();

  // HACK: Prevent the memory from growing forever while you read docs.
  // We're breaking our own rules here.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>It is {time.toLocaleTimeString()} now.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

또는 항목을 추가하기 전에 _새로운_ 배열(기존 배열을 복사해서)을 생성할 수 있습니다.

<Sandpack>

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  // Copy the array!
  const storiesToDisplay = stories.slice();

  // Does not affect the original array:
  storiesToDisplay.push({
    id: 'create',
    label: 'Create Story'
  });

  return (
    <ul>
      {storiesToDisplay.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

const initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  const [stories, setStories] = useState([...initialStories])
  const time = useTime();

  // HACK: Prevent the memory from growing forever while you read docs.
  // We're breaking our own rules here.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>It is {time.toLocaleTimeString()} now.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

이 코드는 지역 변경으로 유지하고 렌더링 함수를 순수하게 만듭니다. 그러나 여전히 조심해야 합니다. 예를 들어 배열의 기존 항목을 하나라도 변경하려고 한다면, 해당 항목 자체를 복제해야 합니다.

배열에서 어떤 연산이 변경을 일으키는지, 어떤 작업이 그렇지 않은지를 기억하는 것이 좋습니다. 예를 들어 `push`, `pop`, `reverse`, `sort`는 기존 배열을 변경하지만 `slice`, `filter`, `map`은 새로운 배열을 만듭니다.

</Solution>

</Challenges>
