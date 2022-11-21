---
title: 객체 State 업데이트하기
---

<Intro>

State는 객체를 포함한 모든 종류의 자바스크립트 값을 가질 수 있습니다. 하지만 리액트 state가 가진 객체를 직접 변경해서는 안 됩니다. 객체를 업데이트하고 싶을 때는 새로운 객체를 생성하여 (또는 기존 객체의 복사본을 만들어), state가 복사본을 사용하도록 하세요.

</Intro>

<YouWillLearn>

- 리액트 state에서 객체를 올바르게 업데이트하는 방법
- 중첩된 객체를 변경하지 않고 업데이트하는 방법
- 불변성이란 무엇인지, 그리고 불변성을 지키는 방법
- Immer로 반복을 줄여 객체를 복사하는 방법

</YouWillLearn>

## 변경이란? {/*whats-a-mutation*/}

State에는 모든 종류의 자바스크립트 값을 저장할 수 있습니다. 

```js
const [x, setX] = useState(0);
```

<<<<<<< HEAD:beta/src/pages/learn/updating-objects-in-state.md
지금까지 숫자, 문자열, 불린을 다루었습니다. 이러한 자바스크립트 값들은 변경할 수 없거나 "읽기 전용"을 의미하는 "불변성"을 가집니다. 값을 _교체_ 하기 위해서는 리렌더링이 필요합니다.
=======
So far you've been working with numbers, strings, and booleans. These kinds of JavaScript values are "immutable", meaning unchangeable or "read-only". You can trigger a re-render to _replace_ a value:
>>>>>>> e50e5634cca3c7cdb92c28666220fe3b61e9aa30:beta/src/content/learn/updating-objects-in-state.md

```js
setX(5);
```

`x` state는 `0`에서 `5`로 바뀌었지만, _숫자 `0` 자체_ 는 바뀌지 않았습니다. 숫자, 문자열, 불린과 같이 자바스크립트에 정의되어 있는 원시 값들은 변경할 수 없습니다.

state에 있는 이러한 객체를 생각해보세요.

```js
const [position, setPosition] = useState({ x: 0, y: 0 });
```

기술적으로 _객체 자체_ 의 내용은 바꿀 수 있습니다. **이것을 변경(mutation)이라고 합니다.**

```js
position.x = 5;
```

하지만 리액트 state의 객체들이 기술적으로 변경 가능할지라도, 그것들을 숫자, 불린, 문자열과 같이 불변성을 가진 것처럼 다루어야 합니다. 객체를 변경하는 대신 교체해야 합니다.

## State를 읽기 전용인 것처럼 다루세요 {/*treat-state-as-read-only*/}

다시 말하면, **state에 저장한 자바스크립트 객체는 어떤 것이라도 읽기 전용인 것처럼** 다루어야 합니다.

아래 예시에서 state의 object는 현재 포인터 위치를 나타냅니다. 프리뷰 영역을 누르거나 커서를 움직일 때 빨간 점이 이동해야 합니다. 하지만 점은 초기 위치에 머무릅니다.

<Sandpack>

```js
import { useState } from 'react';
export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  return (
    <div
      onPointerMove={e => {
        position.x = e.clientX;
        position.y = e.clientY;
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}>
      <div style={{
        position: 'absolute',
        backgroundColor: 'red',
        borderRadius: '50%',
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: -10,
        top: -10,
        width: 20,
        height: 20,
      }} />
    </div>
  )
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

</Sandpack>

문제는 이 코드입니다.

```js
onPointerMove={e => {
  position.x = e.clientX;
  position.y = e.clientY;
}}
```

<<<<<<< HEAD:beta/src/pages/learn/updating-objects-in-state.md
이 코드는 `position`에 할당된 객체를 [이전 렌더링](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time)에서 수정합니다. 그러나 리액트는 state 설정 함수가 없으면 객체가 변경되었는지 알 수 없습니다. 따라서 리액트는 아무것도 하지 않습니다. 이는 식사를 한 뒤에 주문을 바꾸려는 것과 같습니다. state를 변경하는 것이 어떤 경우에는 동작할 수 있지만, 권장하지 않습니다. 렌더링 시에 접근하려는 state 값은 읽기 전용처럼 다루어야 합니다.
=======
This code modifies the object assigned to `position` from [the previous render.](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time) But without using the state setting function, React has no idea that object has changed. So React does not do anything in response. It's like trying to change the order after you've already eaten the meal. While mutating state can work in some cases, we don't recommend it. You should treat the state value you have access to in a render as read-only.
>>>>>>> e50e5634cca3c7cdb92c28666220fe3b61e9aa30:beta/src/content/learn/updating-objects-in-state.md

이러한 경우에 [리렌더링을 발생시키려면](/learn/state-as-a-snapshot#setting-state-triggers-renders), ***새* 객체를 생성하여 state 설정 함수로 전달하세요**

```js
onPointerMove={e => {
  setPosition({
    x: e.clientX,
    y: e.clientY
  });
}}
```

`setPosition`은 React에게 다음과 같이 요청합니다.

* `position`을 이 새로운 객체로 교체하라
* 그리고 이 컴포넌트를 다시 렌더링하라

이제 프리뷰 영역을 누르거나 hover 시에 빨간 점이 포인터를 따라오는 것을 볼 수 있습니다.

<Sandpack>

```js
import { useState } from 'react';
export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  return (
    <div
      onPointerMove={e => {
        setPosition({
          x: e.clientX,
          y: e.clientY
        });
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}>
      <div style={{
        position: 'absolute',
        backgroundColor: 'red',
        borderRadius: '50%',
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: -10,
        top: -10,
        width: 20,
        height: 20,
      }} />
    </div>
  )
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

</Sandpack>

<DeepDive title="Local mutation is fine">

이 코드는 state에 *존재하는* 객체를 변경하기에 문제가 됩니다.

```js
position.x = e.clientX;
position.y = e.clientY;
```

하지만 이 코드는 *방금 생성한* 새로운 객체를 변경하기 때문에 **적절합니다**.

```js
const nextPosition = {};
nextPosition.x = e.clientX;
nextPosition.y = e.clientY;
setPosition(nextPosition);
````

위 코드는 아래처럼 작성할 수 있습니다.

```js
setPosition({
  x: e.clientX,
  y: e.clientY
});
```

<<<<<<< HEAD:beta/src/pages/learn/updating-objects-in-state.md
변경은 이미 state에 *존재하는* 객체를 변경할 때만 문제가 됩니다. 방금 만든 객체를 수정하는 것은 *아직 다른 코드가 해당 객체를 참조하지 않기 때문에* 괜찮습니다. 그 객체를 변경하는 것은 해당 객체에 의존하는 무언가에 우연히 영향을 주지 않습니다. 이것은 "지역 변경 local mutation" 이라고 합니다. [렌더링하는 동안](/learn/keeping-components-pure#local-mutation-your-components-little-secret) 지역 변경을 할 수도 있으며, 이는 아주 편리합니다!
=======
Mutation is only a problem when you change *existing* objects that are already in state. Mutating an object you've just created is okay because *no other code references it yet.* Changing it isn't going to accidentally impact something that depends on it. This is called a "local mutation". You can even do local mutation [while rendering.](/learn/keeping-components-pure#local-mutation-your-components-little-secret) Very convenient and completely okay!
>>>>>>> e50e5634cca3c7cdb92c28666220fe3b61e9aa30:beta/src/content/learn/updating-objects-in-state.md

</DeepDive>  

## 전개 문법으로 객체 복사하기 {/*copying-objects-with-the-spread-syntax*/}

이전 예시에서 `position` 객체는 현재 커서 위치에서 항상 새롭게 생성됩니다. 하지만 종종 새로 생성하는 객체에 *존재하는* 데이터를 포함하고 싶을 수 있습니다. 예를 들어 폼에서 *단 한 개*의 필드만 수정하고, 나머지 모든 필드는 이전 값을 유지하고 싶을 수 있습니다.

이 input 필드는 `onChange` 핸들러가 state를 변경하기 때문에 동작하지 않습니다.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleFirstNameChange(e) {
    person.firstName = e.target.value;
  }

  function handleLastNameChange(e) {
    person.lastName = e.target.value;
  }

  function handleEmailChange(e) {
    person.email = e.target.value;
  }

  return (
    <>
      <label>
        First name:
        <input
          value={person.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={person.lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label>
        Email:
        <input
          value={person.email}
          onChange={handleEmailChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

예를 들어, 이 코드는 이전 렌더의 state를 변경합니다.

```js
person.firstName = e.target.value;
```

원하는 동작을 정확히 얻기 위해서는 새로운 객체를 생성하여 `setPerson`으로 전달해야 합니다. 하지만, 단 하나의 필드가 바뀌었기 때문에 **기존에 존재하는 다른 데이터를 복사**해야 합니다.

```js
setPerson({
  firstName: e.target.value, // input의 새로운 first name
  lastName: person.lastName,
  email: person.email
});
```

<<<<<<< HEAD:beta/src/pages/learn/updating-objects-in-state.md
`...` [객체 전개](a-javascript-refresher#object-spread) 구문을 사용하면 모든 프로퍼티를 각각 복사하지 않아도 됩니다.
=======
You can use the `...` [object spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_object_literals) syntax so that you don't need to copy every property separately.
>>>>>>> e50e5634cca3c7cdb92c28666220fe3b61e9aa30:beta/src/content/learn/updating-objects-in-state.md

```js
setPerson({
  ...person, // 이전 필드를 복사
  firstName: e.target.value // 새로운 부분은 덮어쓰기
});
```

이제 폼이 동작합니다!

각 input 필드에 대해 분리된 state를 선언하지 않았음을 기억하세요. 큰 폼들은 올바르게 업데이트한다면, 한 객체에 모든 데이터를 그룹화하여 저장하는 것이 편리합니다.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleFirstNameChange(e) {
    setPerson({
      ...person,
      firstName: e.target.value
    });
  }

  function handleLastNameChange(e) {
    setPerson({
      ...person,
      lastName: e.target.value
    });
  }

  function handleEmailChange(e) {
    setPerson({
      ...person,
      email: e.target.value
    });
  }

  return (
    <>
      <label>
        First name:
        <input
          value={person.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={person.lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label>
        Email:
        <input
          value={person.email}
          onChange={handleEmailChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

`...` 전개 문법은 "얕다"는 점을 알아두세요. 이것은 한 레벨 깊이의 내용만 복사합니다. 빠르지만, 중첩된 프로퍼티를 업데이트하고 싶다면 한 번 이상 사용해야 한다는 뜻이기도 합니다.

<DeepDive title="Using a single event handler for multiple fields">

`[` 와 `]` 괄호를 객체 정의 안에 사용하여 동적 이름을 가진 프로퍼티를 명시할 수 있습니다. 아래에는 이전 예제와 같지만, 세 개의 다른 이벤트 핸들러 대신 하나의 이벤트 핸들러를 사용하는 예제가 있습니다.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleChange(e) {
    setPerson({
      ...person,
      [e.target.name]: e.target.value
    });
  }

  return (
    <>
      <label>
        First name:
        <input
          name="firstName"
          value={person.firstName}
          onChange={handleChange}
        />
      </label>
      <label>
        Last name:
        <input
          name="lastName"
          value={person.lastName}
          onChange={handleChange}
        />
      </label>
      <label>
        Email:
        <input
          name="email"
          value={person.email}
          onChange={handleChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

`e.target.name`은 `<input>` DOM 엘리먼트의 `name` 프로퍼티를 나타냅니다.

</DeepDive>

## 중첩된 객체 갱신하기 {/*updating-a-nested-object*/}

아래와 같이 중첩된 객체 구조를 생각해 보세요.

```js
const [person, setPerson] = useState({
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  }
});
```

`person.artwork.city`를 업데이트하고 싶다면, 변경하는 방법은 명백합니다.

```js
person.artwork.city = 'New Delhi';
```

하지만 리액트에서는 state를 변경할 수 없는 것으로 다루어야 합니다! `city`를 바꾸기 위해서는 먼저 (이전 객체의 데이터로 생성된) 새로운 `artwork` 객체를 생성한 뒤, 그것을 가리키는 새로운 `person` 객체를 만들어야 합니다.

```js
const nextArtwork = { ...person.artwork, city: 'New Delhi' };
const nextPerson = { ...person, artwork: nextArtwork };
setPerson(nextPerson);
```

또는 단순하게 함수를 호출할 수 있습니다.

```js
setPerson({
  ...person, // 다른 필드 복사
  artwork: { // artwork 교체
    ...person.artwork, // 동일한 값 사용
    city: 'New Delhi' // 하지만 New Delhi!
  }
});
```

이 방법은 코드가 길어질 수 있지만 많은 경우에 정상적으로 동작합니다.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    setPerson({
      ...person,
      name: e.target.value
    });
  }

  function handleTitleChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        title: e.target.value
      }
    });
  }

  function handleCityChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        city: e.target.value
      }
    });
  }

  function handleImageChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        image: e.target.value
      }
    });
  }

  return (
    <>
      <label>
        Name:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Title:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        City:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img 
        src={person.artwork.image} 
        alt={person.artwork.title}
      />
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

<DeepDive title="Objects are not really nested">

이러한 객체는 코드에서 "중첩되어" 나타납니다.

```js
let obj = {
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  }
};
```

"중첩"은 객체의 동작에 대해 생각하는 부정확한 방법입니다. 코드가 실행될 때, "중첩된" 객체라는 것은 없습니다. 실제로 당신은 두 개의 다른 객체를 보는 것입니다.

```js
let obj1 = {
  title: 'Blue Nana',
  city: 'Hamburg',
  image: 'https://i.imgur.com/Sd1AgUOm.jpg',
};

let obj2 = {
  name: 'Niki de Saint Phalle',
  artwork: obj1
};
```

`obj1` 객체는 `obj2` "안"에 없습니다. `obj3` 또한 `obj1`을 "가리킬" 수 있기 때문입니다.

```js
let obj1 = {
  title: 'Blue Nana',
  city: 'Hamburg',
  image: 'https://i.imgur.com/Sd1AgUOm.jpg',
};

let obj2 = {
  name: 'Niki de Saint Phalle',
  artwork: obj1
};

let obj3 = {
  name: 'Copycat',
  artwork: obj1
};
```

`obj3.artwork.city`을 변경하려 했다면, `obj2.artwork.city`와 `obj1.city` 둘 다에 영향을 미칠 것입니다. 이는 `obj3.artwork`, `obj2.artwork`와 `obj1`이 같은 객체이기 때문입니다. 객체를 "중첩된" 것으로 생각하면 이해하기 어려울 수 있습니다. 그것들은 프로퍼티를 통해 서로를 "가리키는" 각각의 객체들입니다.

</DeepDive>  

### Immer로 간결한 갱신 로직 작성하기 {/*write-concise-update-logic-with-immer*/}

<<<<<<< HEAD:beta/src/pages/learn/updating-objects-in-state.md
state가 깊이 중첩되어있다면 [평탄화](/learn/choosing-the-state-structure#avoid-deeply-nested-state)를 고려해보세요. 만약 state 구조를 바꾸고 싶지 않다면, 중첩 전개할 수 있는 더 간편한 방법이 있습니다. [Immer](https://github.com/immerjs/use-immer)는 편리하고, 변경 구문을 사용할 수 있게 해주며 복사본 생성을 도와주는 인기 있는 라이브러리입니다. Immer를 사용하면 작성한 코드는 "법칙을 깨고" 객체를 변경하는 것처럼 보일 수 있습니다.
=======
If your state is deeply nested, you might want to consider [flattening it.](/learn/choosing-the-state-structure#avoid-deeply-nested-state) But, if you don't want to change your state structure, you might prefer a shortcut to nested spreads. [Immer](https://github.com/immerjs/use-immer) is a popular library that lets you write using the convenient but mutating syntax and takes care of producing the copies for you. With Immer, the code you write looks like you are "breaking the rules" and mutating an object:
>>>>>>> e50e5634cca3c7cdb92c28666220fe3b61e9aa30:beta/src/content/learn/updating-objects-in-state.md

```js
updatePerson(draft => {
  draft.artwork.city = 'Lagos';
});
```

하지만 일반적인 변경과는 다르게 이것은 이전 state를 덮어쓰지 않습니다!

<DeepDive title="How does Immer work?">

Immer가 제공하는 `draft`는 [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)라고 하는 아주 특별한 객체 타입으로, 당신이 하는 일을 "기록" 합니다. 객체를 원하는 만큼 자유롭게 변경할 수 있는 이유죠! Immer는 내부적으로 `draft`의 어느 부분이 변경되었는지 알아내어, 변경사항을 포함한 완전히 새로운 객체를 생성합니다.

</DeepDive>

Immer를 사용하기 위해서는,

1. `package.json`에 dependency로 `use-immer`를 추가하세요
2. `npm install`을 실행하세요
3. `import { useState } from 'react'`를 `import { useImmer } from 'use-immer'`로 교체하세요.

위의 예제를 Immer로 바꾼 코드입니다.

<Sandpack>

```js
import { useImmer } from 'use-immer';

export default function Form() {
  const [person, updatePerson] = useImmer({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    updatePerson(draft => {
      draft.name = e.target.value;
    });
  }

  function handleTitleChange(e) {
    updatePerson(draft => {
      draft.artwork.title = e.target.value;
    });
  }

  function handleCityChange(e) {
    updatePerson(draft => {
      draft.artwork.city = e.target.value;
    });
  }

  function handleImageChange(e) {
    updatePerson(draft => {
      draft.artwork.image = e.target.value;
    });
  }

  return (
    <>
      <label>
        Name:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Title:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        City:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img 
        src={person.artwork.image} 
        alt={person.artwork.title}
      />
    </>
  );
}
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

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

이벤트 핸들러가 얼마나 간결해졌는지 보세요. 하나의 컴포넌트 안에서 원하는 만큼 `useState`와 `useImmer`를 섞어 사용할 수 있습니다. Immer는 업데이트 핸들러를 간결하게 관리할 수 있는 좋은 방법이며, 특히 state가 중첩되어 있고 객체를 복사하는 것이 중복되는 코드를 만들 때 유용합니다.

<DeepDive title="Why is mutating state not recommended in React?">

몇 가지 이유가 있습니다.

<<<<<<< HEAD:beta/src/pages/learn/updating-objects-in-state.md
* **디버깅:** 만약 `console.log`를 사용하고 state를 변경하지 않는다면, 과거 로그들은 가장 최근 state 변경 사항들에 의해 지워지지 않습니다. 따라서 state가 렌더링 사이에 어떻게 바뀌었는지 명확하게 알 수 있습니다.
* **최적화:** 보편적인 리액트 [최적화 전략](/learn/skipping-unchanged-trees)은 이전 props 또는 state가 다음 것과 동일할 때 일을 건너뛰는 것에 의존합니다. state를 절대 변경하지 않는다면 변경사항이 있었는지 확인하는 작업이 매우 빨라집니다. `prevObj === obj`를 통해 내부적으로 아무것도 바뀌지 않았음을 확인할 수 있습니다.
* **새로운 기능:** 우리가 만드는 새로운 리액트 기능들은 [스냅샷처럼 다루어지는 것](/learn/state-as-a-snapshot)에 의존합니다. 만약 state의 과거 버전을 변경한다면, 새로운 기능을 사용하지 못할 수 있습니다. 
* **요구사항 변화:** 취소/복원 구현, 변화 내역 조회, 사용자가 이전 값으로 폼을 재설정하기 등의 기능은 아무것도 변경되지 않았을 때 더 쉽습니다. 왜냐하면 당신은 메모리에 state의 이전 복사본을 저장하여 적절한 상황에 다시 사용할 수 있기 때문입니다. 변경하는 것으로 시작하게 되면 이러한 기능들은 나중에 추가하기 어려울 수 있습니다.
* **더 간단한 구현:** 리액트는 변경에 의존하지 않기 때문에 객체로 뭔가 특별한 것을 할 필요가 없습니다. 프로퍼티를 가져오거나, 항상 프록시로 감싸거나, 다른 많은 "반응형" 솔루션이 그러듯 초기화 시에 다른 작업을 하지 않아도 됩니다. 이것은 리액트가 state에 --얼마나 크던-- 추가적인 성능 또는 정확성 함정 없이 아무 객체나 넣을 수 있게 해주는 이유이기도 합니다. 
=======
* **Debugging:** If you use `console.log` and don't mutate state, your past logs won't get clobbered by the more recent state changes. So you can clearly see how state has changed between renders.
* **Optimizations:** Common React [optimization strategies](/apis/react/memo) rely on skipping work if previous props or state are the same as the next ones. If you never mutate state, it is very fast to check whether there were any changes. If `prevObj === obj`, you can be sure that nothing could have changed inside of it.
* **New Features:** The new React features we're building rely on state being [treated like a snapshot.](/learn/state-as-a-snapshot) If you're mutating past versions of state, that may prevent you from using the new features.
* **Requirement Changes:** Some application features, like implementing Undo/Redo, showing a history of changes, or letting the user reset a form to earlier values, are easier to do when nothing is mutated. This is because you can keep past copies of state in memory, and reuse them when appropriate. If you start with a mutative approach, features like this can be difficult to add later on.
* **Simpler Implementation:** Because React does not rely on mutation, it does not need to do anything special with your objects. It does not need to hijack their properties, always wrap them into Proxies, or do other work at initialization as many "reactive" solutions do. This is also why React lets you put any object into state--no matter how large--without additional performance or correctness pitfalls.
>>>>>>> e50e5634cca3c7cdb92c28666220fe3b61e9aa30:beta/src/content/learn/updating-objects-in-state.md

실제로, 리액트에서 state를 변경하는 것으로 "도망"쳐버릴수도 있지만, 우리는 그렇게 하지 않기를 강하게 권장함으로써 당신이 이러한 접근법을 바탕으로 개발된 새로운 리액트 기능들을 사용할 수 있기를 바랍니다. 미래의 기여자들과 어쩌면 미래의 당신 스스로까지 고마워할 것입니다!

</DeepDive>

<Recap>

<<<<<<< HEAD:beta/src/pages/learn/updating-objects-in-state.md
* 리액트의 모든 state를 불변한 것으로 대하세요.
* state에 객체를 저장할 때, 객체를 변경하는 것은 렌더링을 발생시키지 않으며 이전 렌더 "스냅샷"의 state를 바꿀 것입니다.
* 객체를 변경하는 대신 *새로운* 객체를 생성하여 state를 설정함으로써 리렌더링을 일으키세요.
* 객체의 복사본을 만들기 위해 `{...obj, something: 'newValue'}` 객체 전개 구문을 사용할 수 있습니다.
* 전개 구문은 얕습니다. 그것은 한 레벨 깊이만 복사합니다.
* 중첩된 객체를 업데이트하기 위해서는 변경하는 부분에서부터 시작하여 객체의 모든 항목의 복사본을 만들어야 합니다.
* 반복적인 복사 코드를 줄이기 위해서 Immer를 사용하세요.
=======
* Treat all state in React as immutable.
* When you store objects in state, mutating them will not trigger renders and will change the state in previous render "snapshots".
* Instead of mutating an object, create a *new* version of it, and trigger a re-render by setting state to it.
* You can use the `{...obj, something: 'newValue'}` object spread syntax to create copies of objects.
* Spread syntax is shallow: it only copies one level deep.
* To update a nested object, you need to create copies all the way up from the place you're updating.
* To reduce repetitive copying code, use Immer.
>>>>>>> e50e5634cca3c7cdb92c28666220fe3b61e9aa30:beta/src/content/learn/updating-objects-in-state.md

</Recap>



<Challenges>

<<<<<<< HEAD:beta/src/pages/learn/updating-objects-in-state.md
### 잘못된 state 업데이트 고치기 {/*fix-incorrect-state-updates*/}
=======
#### Fix incorrect state updates {/*fix-incorrect-state-updates*/}
>>>>>>> e50e5634cca3c7cdb92c28666220fe3b61e9aa30:beta/src/content/learn/updating-objects-in-state.md

이 폼은 몇 가지 문제가 있습니다. 스코어를 올리는 버튼을 몇 번 클릭해 보세요. 스코어가 올라가지 않는 것을 확인하세요. 그리고 first name을 수정하여, 스코어가 갑자기 당신의 수정 사항을 "따라잡은" 것을 확인하세요. 마지막으로 last name을 수정하여, 스코어가 완전하게 사라진 것을 확인하세요.

이 모든 버그를 올바르게 수정하는 것이 당신의 일입니다. 고칠 때마다 각각의 문제가 왜 발생하는지 설명해 보세요.

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [player, setPlayer] = useState({
    firstName: 'Ranjani',
    lastName: 'Shettar',
    score: 10,
  });

  function handlePlusClick() {
    player.score++;
  }

  function handleFirstNameChange(e) {
    setPlayer({
      ...player,
      firstName: e.target.value,
    });
  }

  function handleLastNameChange(e) {
    setPlayer({
      lastName: e.target.value
    });
  }

  return (
    <>
      <label>
        Score: <b>{player.score}</b>
        {' '}
        <button onClick={handlePlusClick}>
          +1
        </button>
      </label>
      <label>
        First name:
        <input
          value={player.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={player.lastName}
          onChange={handleLastNameChange}
        />
      </label>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 10px; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

<Solution>

두가지 문제 모두가 고쳐진 버전입니다.

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [player, setPlayer] = useState({
    firstName: 'Ranjani',
    lastName: 'Shettar',
    score: 10,
  });

  function handlePlusClick() {
    setPlayer({
      ...player,
      score: player.score + 1,
    });
  }

  function handleFirstNameChange(e) {
    setPlayer({
      ...player,
      firstName: e.target.value,
    });
  }

  function handleLastNameChange(e) {
    setPlayer({
      ...player,
      lastName: e.target.value
    });
  }

  return (
    <>
      <label>
        Score: <b>{player.score}</b>
        {' '}
        <button onClick={handlePlusClick}>
          +1
        </button>
      </label>
      <label>
        First name:
        <input
          value={player.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={player.lastName}
          onChange={handleLastNameChange}
        />
      </label>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

`handlePlusClick`의 문제는 `player` 객체를 변경했다는 점입니다. 결과적으로 리액트는 리렌더링을 할 필요성을 몰랐으며, 스코어를 업데이트하지 않았습니다. 이것이 fist name을 변경했을 때 state가 업데이트되었으며, 리렌더링을 야기하여 스코어 _또한_ 업데이트된 이유입니다.

`handleLastNameChange`의 문제는 그것이 이미 존재하는 `...player` 필드를 새 객체로 복사하지 않았다는 점입니다. 이것이 last name을 수정한 후에 스코어가 없어진 이유입니다.

</Solution>

<<<<<<< HEAD:beta/src/pages/learn/updating-objects-in-state.md
### 변경 사항을 찾아 고치세요 {/*find-and-fix-the-mutation*/}
=======
#### Find and fix the mutation {/*find-and-fix-the-mutation*/}
>>>>>>> e50e5634cca3c7cdb92c28666220fe3b61e9aa30:beta/src/content/learn/updating-objects-in-state.md

정적인 배경 위에 드래그할 수 있는 박스가 있습니다. select input을 사용해 박스의 색상을 바꿀 수 있습니다.

하지만 문제가 있습니다. 만약 박스를 먼저 옮긴 뒤 색상을 바꾸면, (움직여서는 안되는!) 배경이 박스 위치로 "점프"할 것입니다. 하지만 이것은 발생해선 안 되는 문제입니다. `Background`의 `position` prop은 `{ x: 0, y: 0 }`인 `initialPosition`으로 설정되어 있습니다. 왜 색상이 바뀐 후에 배경이 움직일까요?

문제를 찾아 고쳐 보세요.

<Hint>

예상하지 못한 것이 바뀐다면, 그것은 변경 때문입니다. `App.js`의 변경 사항을 찾아 고쳐 보세요.

</Hint>

<Sandpack>

```js App.js
import { useState } from 'react';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    shape.position.x += dx;
    shape.position.y += dy;
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

</Sandpack>

<Solution>

문제는 `handleMove` 내부의 변경입니다. 핸들러는 `shape.position`을 변경했지만, 그것은 `initialPosition`가 가리키는 객체와 동일합니다. 이것이 모양과 배경이 둘 다 움직인 이유입니다. (이것은 변경이기에, 색상 수정처럼 관련 없는 업데이트가 리렌더링을 발생시킬 때까지 화면에 반영되지 않습니다.)

`handleMove`에서 변경을 제거하고, 모양을 복사하기 위해 전개 연산자를 사용함으로써 문제를 해결할 수 있습니다. `+=`는 변경이기에, 일반 `+` 연산자로 작성해야 한다는 것을 알아두세요.

<Sandpack>

```js App.js
import { useState } from 'react';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    setShape({
      ...shape,
      position: {
        x: shape.position.x + dx,
        y: shape.position.y + dy,
      }
    });
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

</Sandpack>

</Solution>

<<<<<<< HEAD:beta/src/pages/learn/updating-objects-in-state.md
### Immer로 객체 업데이트하기 {/*update-an-object-with-immer*/}
=======
#### Update an object with Immer {/*update-an-object-with-immer*/}
>>>>>>> e50e5634cca3c7cdb92c28666220fe3b61e9aa30:beta/src/content/learn/updating-objects-in-state.md

이것은 이전 챌린지와 비슷한, 버그가 있는 예제입니다. 이번에는 Immer를 사용해서 변경을 고쳐 보세요. 편의를 위해 `useImmer`는 이미 포함되어 있으므로 사용하기 위해서는 `shape` state 변수를 바꿔야 합니다.

<Sandpack>

```js App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    shape.position.x += dx;
    shape.position.y += dy;
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
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

<Solution>

이것은 Immer로 다시 작성된 해결 방법입니다. 이벤트 핸들러가 변경하는 방식이 어떻게 작성되어있는지 확인해보세요. 하지만 문제는 발생하지 않습니다. 내부적으로 Immer는 존재하는 객체를 절대 변경하지 않기 때문입니다.

<Sandpack>

```js App.js
import { useImmer } from 'use-immer';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, updateShape] = useImmer({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    updateShape(draft => {
      draft.position.x += dx;
      draft.position.y += dy;
    });
  }

  function handleColorChange(e) {
    updateShape(draft => {
      draft.color = e.target.value;
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
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

</Solution>

</Challenges>
