---
title: 상호작용 추가하기
---

<Intro>

화면의 일부 요소는 사용자의 입력에 따라 업데이트됩니다. 예를 들어 이미지 갤러리에서 특정 이미지를 클릭하면 해당 이미지가 활성 상태가 됩니다. React에서는 시간에 따라 변화하는 데이터를 *state*라고 합니다. state는 어떠한 컴포넌트에든 추가할 수 있으며 필요에 따라 업데이트할 수도 있습니다. 이번 장에서는 상호작용을 다루는 컴포넌트를 작성하고 state를 업데이트하며, 시간에 따라 화면을 갱신하는 방법에 대해서 알아보겠습니다.

</Intro>

<YouWillLearn isChapter={true}>

* [사용자 이벤트를 처리하는 방법](/learn/responding-to-events)
* [컴포넌트가 state를 이용하여 정보를 "기억"하는 방법](/learn/state-a-components-memory)
* [React가 UI를 업데이트하는 두 가지 단계](/learn/render-and-commit)
* [state가 변경된 후 바로 업데이트되지 않는 이유](/learn/state-as-a-snapshot)
* [여러 개의 state 업데이트를 대기열에 추가하는 방법](/learn/queueing-a-series-of-state-updates)
* [state에서 객체를 업데이트하는 방법](/learn/updating-objects-in-state)
* [state에서 배열을 업데이트하는 방법](/learn/updating-arrays-in-state)

</YouWillLearn>

## 이벤트에 대한 응답 {/*responding-to-events*/}

React에서는 JSX에 *이벤트 핸들러*를 추가할 수 있습니다. 이벤트 핸들러는 클릭, 마우스 호버, 폼 인풋 포커스 등 사용자 상호작용에 따라 유발되는 사용자 정의 함수입니다.

`<button>`과 같은 내장 컴포넌트는 `onClick`과 같은 내장 브라우저 이벤트만 지원합니다. 반면 사용자 정의 컴포넌트를 생성하는 경우, 컴포넌트 이벤트 핸들러 props의 역할에 맞는 원하는 이름을 사용할 수 있습니다.

<Sandpack>

```js
export default function App() {
  return (
    <Toolbar
      onPlayMovie={() => alert('Playing!')}
      onUploadImage={() => alert('Uploading!')}
    />
  );
}

function Toolbar({ onPlayMovie, onUploadImage }) {
  return (
    <div>
      <Button onClick={onPlayMovie}>
        Play Movie
      </Button>
      <Button onClick={onUploadImage}>
        Upload Image
      </Button>
    </div>
  );
}

function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

<LearnMore path="/learn/responding-to-events">

이벤트 핸들러를 추가하는 방법을 배우려면 **[사용자 이벤트를 처리하는 방법](/learn/responding-to-events)** 을 읽어보세요.

</LearnMore>

## State: 컴포넌트의 메모리 {/*state-a-components-memory*/}

상호작용에 따라 컴포넌트는 종종 화면에 표시되는 내용을 변경해야 합니다. 폼에 타이핑하면 입력 필드를 업데이트해야 하고, 이미지 캐러셀에서 "다음"을 클릭하면 표시되는 이미지가 변경되어야 하며, "구매"를 클릭하면 제품이 장바구니에 추가되어야 합니다. 컴포넌트는 현재 입력값, 현재 이미지, 장바구니에 담긴 상품 등을 "기억"해야 합니다. React에서는 이러한 컴포넌트별 메모리를 *state*라고 부릅니다.

[`useState`](/reference/react/useState) Hook을 사용하면 컴포넌트에 state를 추가할 수 있습니다. *Hooks*는 컴포넌트가 React의 주요 기능(state는 그중 하나입니다.)을 사용할 수 있도록 해주는 특별한 함수입니다. `useState` Hook을 사용하면 state 변수를 선언할 수 있습니다. `useState`는 초기 state를 인자로 받으며, 현재 상태와 상태를 업데이트할 수 있는 상태 설정 함수를 배열에 담아 반환합니다.

```js
const [index, setIndex] = useState(0);
const [showMore, setShowMore] = useState(false);
```

다음은 이미지 갤러리가 클릭 이벤트에 따라 state를 사용하고 업데이트하는 방법입니다.

<Sandpack>

```js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const hasNext = index < sculptureList.length - 1;

  function handleNextClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleNextClick}>
        Next
      </button>
      <h2>
        <i>{sculpture.name} </i>
        by {sculpture.artist}
      </h2>
      <h3>
        ({index + 1} of {sculptureList.length})
      </h3>
      <button onClick={handleMoreClick}>
        {showMore ? 'Hide' : 'Show'} details
      </button>
      {showMore && <p>{sculpture.description}</p>}
      <img
        src={sculpture.url}
        alt={sculpture.alt}
      />
    </>
  );
}
```

```js data.js
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.'
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: 'The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: 'Located on the Easter Island, there are 1,000 moai, or extant monumental statues, created by the early Rapa Nui people, which some believe represented deified ancestors.',
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: 'Three monumental stone busts with the heads that are disproportionately large with somber faces.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'The Nanas are triumphant creatures, symbols of femininity and maternity. Initially, Saint Phalle used fabric and found objects for the Nanas, and later on introduced polyester to achieve a more vibrant effect.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: 'A large mosaic sculpture of a whimsical dancing female figure in a colorful costume emanating joy.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'This abstract bronze sculpture is a part of The Family of Man series located at Yorkshire Sculpture Park. Hepworth chose not to create literal representations of the world but developed abstract forms inspired by people and landscapes.',
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: 'A tall sculpture made of three elements stacked on each other reminding of a human figure.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descended from four generations of woodcarvers, Fakeye's work blended traditional and contemporary Yoruba themes.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: 'An intricate wood sculpture of a warrior with a focused face on a horse adorned with patterns.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow is known for her sculptures of the fragmented body as a metaphor for the fragility and impermanence of youth and beauty. This sculpture depicts two very realistic large bellies stacked on top of each other, each around five feet (1,5m) tall.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: 'The sculpture reminds a cascade of folds, quite different from bellies in classical sculptures.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: 'The Terracotta Army is a collection of terracotta sculptures depicting the armies of Qin Shi Huang, the first Emperor of China. The army consisted of more than 8,000 soldiers, 130 chariots with 520 horses, and 150 cavalry horses.',
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: '12 terracotta sculptures of solemn warriors, each with a unique facial expression and armor.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson was known for scavenging objects from New York City debris, which she would later assemble into monumental constructions. In this one, she used disparate parts like a bedpost, juggling pin, and seat fragment, nailing and gluing them into boxes that reflect the influence of Cubism’s geometric abstraction of space and form.',
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: 'A black matte sculpture where the individual elements are initially indistinguishable.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar merges the traditional and the modern, the natural and the industrial. Her art focuses on the relationship between man and nature. Her work was described as compelling both abstractly and figuratively, gravity defying, and a "fine synthesis of unlikely materials."',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: 'A pale wire-like sculpture mounted on concrete wall and descending on the floor. It appears light.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'The Taipei Zoo commissioned a Hippo Square featuring submerged hippos at play.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: 'A group of bronze hippo sculptures emerging from the sett sidewalk as if they were swimming.'
}];
```

```css
h2 { margin-top: 10px; margin-bottom: 0; }
h3 {
 margin-top: 5px;
 font-weight: normal;
 font-size: 100%;
}
img { width: 120px; height: 120px; }
button {
  display: block;
  margin-top: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<LearnMore path="/learn/state-a-components-memory">

값을 기억하고 상호 작용에 따라 업데이트하는 방법을 배우려면 **[컴포넌트가 state를 이용하여 정보를 "기억"하는 방법](/learn/state-a-components-memory)** 을 읽어보세요.

</LearnMore>

## 렌더링과 반영 {/*render-and-commit*/}

컴포넌트는 화면에 표시되기 전에 React에 의해 렌더링 되어야 합니다. 이 과정을 이해하면 코드가 어떻게 실행되는지 파악하고 코드의 동작을 설명하는 데 도움이 될 것입니다.

컴포넌트가 주방에서 재료들을 사용해 맛있는 요리를 조리하는 요리사라고 생각해 봅시다. 이 시나리오에서 React는 손님들로부터 주문받고 요리사에게 주문을 가져다주는 웨이터입니다. 이때, UI를 주문하고 서빙하는 과정은 세 단계로 이루어집니다.

1. 렌더링 **유발** (주방에 식사 주문을 전달하기)
2. 컴포넌트 **렌더링** (주방에서 주문을 준비하기)
3. DOM에 **반영** (주문을 테이블에 서빙하기)

<IllustrationBlock sequential>
  <Illustration caption="Trigger" alt="React as a server in a restaurant, fetching orders from the users and delivering them to the Component Kitchen." src="/images/docs/illustrations/i_render-and-commit1.png" />
  <Illustration caption="Render" alt="The Card Chef gives React a fresh Card component." src="/images/docs/illustrations/i_render-and-commit2.png" />
  <Illustration caption="Commit" alt="React delivers the Card to the user at their table." src="/images/docs/illustrations/i_render-and-commit3.png" />
</IllustrationBlock>

<LearnMore path="/learn/render-and-commit">

UI 업데이트의 생명주기를 배우려면 **[React가 UI를 업데이트하는 두 가지 단계](/learn/render-and-commit)** 를 읽어보세요.

</LearnMore>

## snapshot으로서의 state {/*state-as-a-snapshot*/}

일반적인 JavaScript 변수와 달리, React의 state는 snapshot과 유사하게 동작합니다. 상태를 갱신하면 이미 있는 state 변수 자체를 변경하는 것이 아니라, 리렌더링을 유발합니다. 이는 처음에는 놀라울 수 있습니다!

```js
console.log(count);  // 0
setCount(count + 1); // Request a re-render with 1
console.log(count);  // Still 0!
```

이 동작은 미묘한 버그를 피하는 데 도움이 됩니다. 간단한 채팅 앱을 예시로 들겠습니다. "Send"를 먼저 누른 다음 수신자를 Bob으로 변경하면 어떻게 될지 추측해 보세요. 5초 후에 `alert`에 어떤 이름이 나타날까요?

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [to, setTo] = useState('Alice');
  const [message, setMessage] = useState('Hello');

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      alert(`You said ${message} to ${to}`);
    }, 5000);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        To:{' '}
        <select
          value={to}
          onChange={e => setTo(e.target.value)}>
          <option value="Alice">Alice</option>
          <option value="Bob">Bob</option>
        </select>
      </label>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>


<LearnMore path="/learn/state-as-a-snapshot">

이벤트 핸들러 내에서 state가 "고정되어" 변하지 않는 것처럼 보이는 이유에 대하여 배우려면 **[state가 변경된 후 바로 업데이트되지 않는 이유](/learn/state-as-a-snapshot)** 를 읽어보세요.

</LearnMore>

## state 업데이트를 연속으로 대기열에 추가하기 {/*queueing-a-series-of-state-updates*/}

이 컴포넌트는 버그가 있습니다. "+3"을 클릭하면 점수가 한 번만 증가합니다.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [score, setScore] = useState(0);

  function increment() {
    setScore(score + 1);
  }

  return (
    <>
      <button onClick={() => increment()}>+1</button>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <h1>Score: {score}</h1>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
```

</Sandpack>

[state가 변경된 후 바로 업데이트되지 않는 이유](/learn/state-as-a-snapshot)는 이런 현상이 발생하는 이유를 설명해 줍니다. state를 설정하면 리렌더링이 유발되지만, 이미 실행 중인 코드에서는 변경되지 않습니다. 따라서 `setScore(score + 1)`를 호출한 직후에도 `score`는 여전히 `0`으로 유지됩니다.

```js
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
```

이 문제는 state를 설정할 때 *updater function*을 전달하는 방식을 통해 해결할 수 있습니다. `setScore(score + 1)`를 `setScore(s => s + 1)`로 대체함으로써 "+3" 버튼이 수정되는 것을 확인할 수 있습니다. 이러한 방법으로 여러 개의 state 업데이트를 대기열에 추가할 수 있습니다.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [score, setScore] = useState(0);

  function increment() {
    setScore(s => s + 1);
  }

  return (
    <>
      <button onClick={() => increment()}>+1</button>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <h1>Score: {score}</h1>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
```

</Sandpack>

<LearnMore path="/learn/queueing-a-series-of-state-updates">

state 업데이트를 연속적으로 대기열에 추가하는 방법을 배우려면 **[여러 개의 state 업데이트를 대기열에 추가하는 방법](/learn/queueing-a-series-of-state-updates)** 을 읽어보세요.

</LearnMore>

## state 내 객체 업데이트 {/*updating-objects-in-state*/}

State는 객체를 포함하여 모든 종류의 JavaScript 타입을 관리할 수 있습니다. 그러나 React state에 있는 개체와 배열을 직접 변경해서는 안 됩니다. 대신 객체나 배열을 업데이트할 때는 새로운 객체를 생성하거나 기존 객체의 복사본을 만들어서 상태를 업데이트해야 합니다.

일반적으로 변경하려는 객체나 배열을 복사하기 위해 `...` 전개 구문을 사용합니다. 예를 들어 중첩된 객체의 업데이트는 다음과 같이 처리할 수 있습니다.

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

객체를 복사하는 작업이 번거롭다면 [Immer](https://github.com/immerjs/use-immer)와 같은 라이브러리를 사용하여 반복적인 코드를 줄일 수 있습니다.

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

<LearnMore path="/learn/updating-objects-in-state">

객체를 올바르게 업데이트하는 방법을 배우려면 **[state에서 객체를 업데이트하는 방법](/learn/updating-objects-in-state)** 을 읽어보세요.

</LearnMore>

## state 내 배열 업데이트 {/*updating-arrays-in-state*/}

배열 또한 state에 저장될 때 읽기 전용으로 다루어야 하는 가변 JavaScript 객체입니다. 객체와 마찬가지로 상태에 저장된 배열을 업데이트하려면 새로운 배열을 생성하거나 기존 배열의 복사본을 만들어서 상태를 업데이트한 후, 새로운 배열을 상태에 설정해야 합니다.

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [list, setList] = useState(
    initialList
  );

  function handleToggle(artworkId, nextSeen) {
    setList(list.map(artwork => {
      if (artwork.id === artworkId) {
        return { ...artwork, seen: nextSeen };
      } else {
        return artwork;
      }
    }));
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={list}
        onToggle={handleToggle} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

</Sandpack>

배열을 복사하는 작업이 번거롭다면 [Immer](https://github.com/immerjs/use-immer)와 같은 라이브러리를 사용하여 반복적인 코드를 줄일 수 있습니다.

<Sandpack>

```js
import { useState } from 'react';
import { useImmer } from 'use-immer';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [list, updateList] = useImmer(initialList);

  function handleToggle(artworkId, nextSeen) {
    updateList(draft => {
      const artwork = draft.find(a =>
        a.id === artworkId
      );
      artwork.seen = nextSeen;
    });
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={list}
        onToggle={handleToggle} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
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

</Sandpack>

<LearnMore path="/learn/updating-arrays-in-state">

배열을 올바르게 업데이트하는 방법을 배우려면 **[state에서 배열을 업데이트하는 방법](/learn/updating-arrays-in-state)** 을 읽어보세요.

</LearnMore>

## What's next? {/*whats-next*/}

이 장을 페이지별로 읽으려면 [사용자 이벤트를 처리하는 방법](/learn/responding-to-events)으로 이동하세요!

이미 이러한 주제에 익숙하시다면 [State 다루기](/learn/managing-state)에 대해 읽어보시는 것도 좋습니다.
