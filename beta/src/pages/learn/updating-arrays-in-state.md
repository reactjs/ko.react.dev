---
title: 배열 State 업데이트하기
---

<Intro>

<<<<<<< HEAD
배열은 state에 저장할 수 있고 변경하지 못하게 처리해야하는 변경 가능한 JavaScript 객체의 다른 유형입니다. 객체와 마찬가지로 state에 저장된 배열을 업데이트 하고 싶을 때, 새 배열을 생성(혹은 기존 배열의 복사본을 생성)한 다음 새 배열을 사용하도록 state를 업데이트해야 합니다.
=======
Arrays are mutable in JavaScript, but you should treat them as immutable when you store them in state. Just like with objects, when you want to update an array stored in state, you need to create a new one (or make a copy of an existing one), and then set state to use the new array.
>>>>>>> 37cf98d075de3133b5ae69fe80fbecb6a742530a

</Intro>

<YouWillLearn>

- React state에서 배열의 항목을 추가, 삭제 또는 변경하는 방법
- 배열 내부의 객체를 업데이트하는 방법
- Immer로 배열을 덜 반복해서 복사하는 방법

</YouWillLearn>

## 변경하지 않고 배열 업데이트하기 {/*updating-arrays-without-mutation*/}

JavaScript에서 배열은 다른 종류의 객체입니다. [객체와 마찬가지로](/learn/updating-objects-in-state) React state에서 배열은 읽기 전용으로 처리해야 합니다. 즉 `arr[0] = 'bird'`처럼 배열 내부의 항목을 재할당하면 안되고 `push()`나 `pop()`같은 함수로 배열을 변경해서는 안됩니다.

대신 배열을 업데이트할 때마다 *새* 배열을 state 설정 함수에 전달할 수 있습니다. 그렇게 하려면 원본 배열을 변경시키지 않고 원본 배열로부터 새 배열을 반환하는 `filter()`와 `map()` 같은 함수를 사용하여 state를 설정할 수 있습니다.

다음은 일반적인 배열 연산에 대한 참조 표입니다. React state 내에서 배열을 다룰 땐 왼쪽 열에 있는 함수들의 사용을 피하고, 오른쪽 열에 있는 함수들을 선호해야 합니다.

|         | 비선호 (배열을 변경) | 선호 (새 배열을 반환) |
|---------|----------------|-------------------|
| 추가 | `push`, `unshift` | `concat`, `[...arr]` 전개 연산자 ([예시](#adding-to-an-array))|
| 제거 | `pop`, `shift`, `splice` | `filter`, `slice` ([예시](#removing-from-an-array))
| 교체 | `splice`, `arr[i] = ...` 할당 | `map` ([예시](#replacing-items-in-an-array))          |
| 정렬 | `reverse`, `sort` | 먼저 배열을 복사 ([예시](#making-other-changes-to-an-array)) |

또는 [Immer](#write-concise-update-logic-with-immer)를 사용하여 두 열의 함수를 모두 사용할 수 있습니다.

<Gotcha>

안타깝게도, [`slice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) 그리고 [`splice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice) 함수는 이름은 비슷하지만 많이 다릅니다.

* `slice`를 사용하면 배열 자체 또는 그 일부를 복사할 수 있습니다.
* `splice`는 배열을 (항목 추가 또는 제거를 위해서) **변경**합니다. 

React에서는, state 안의 객체나 배열을 변경하지 않는게 좋기 때문에 `slice` (`p`가 없습니다!)를 훨씬 더 자주 사용할 것입니다. [객체 업데이트](/learn/updating-objects-in-state)는 변경이 무엇이고 state에 권장되지 않는 이유를 설명합니다.

</Gotcha>

### 배열에 항목 추가하기 {/*adding-to-an-array*/}

`push()`는 배열을 변경시키기 때문에 아래와 같이 사용하면 안됩니다.

<Sandpack>

```js
import { useState } from 'react';

let nextId = 0;

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState([]);

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => {
        setName('');
        artists.push({
          id: nextId++,
          name: name,
        });
      }}>Add</button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

대신 기존에 존재하던 항목, *그리고* 새 항목을 포함하는 *새* 배열을 만드세요. 이러한 방법들은 여러 가지가 있지만 가장 쉬운 방법은 `...` [전개 연산자](a-javascript-refresher#array-spread) 문법을 사용하는 것입니다.

```js
setArtists( // state를 변경합니다.
  [ // 새 배열을 할당하고,
    ...artists, // 기존 배열의 항목을 추가합니다.
    { id: nextId++, name: name } // 그리고 새 항목을 끝에 추가합니다.
  ]
);
```

이제 올바르게 작동합니다.

<Sandpack>

```js
import { useState } from 'react';

let nextId = 0;

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState([]);

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => {
        setName('');
        setArtists([
          ...artists,
          { id: nextId++, name: name }
        ]);
      }}>Add</button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

배열 전개 연산자를 사용하면 항목을 `...artists` *앞*에 배치하여 앞에 추가할 수도 있습니다.

```js
setArtists([
  { id: nextId++, name: name },
  ...artists // 기존 항목들을 끝에 삽입합니다.
]);
```

이런 식으로, 전개 연산자는 배열의 끝에 추가하여 `push()` 하는 것 처럼 처리가 가능하고 배열의 앞에 추가하여 `unshift()` 하는 것과 같은 작업을 할 수 있습니다. 위의 샌드박스에서 사용해보세요!

### 배열에서 항목 제거하기 {/*removing-from-an-array*/}

배열에서 항목을 제거하는 가장 쉬운 방법은 *필터링*하는 것입니다. 다시 말해서 해당 항목을 포함하지 않는 새 배열을 제공하는 것입니다. 이렇게 하려면 `filter` 함수를 사용하면 됩니다. 예를 들면 아래와 같습니다.

<Sandpack>

```js
import { useState } from 'react';

let initialArtists = [
  { id: 0, name: 'Marta Colvin Andrade' },
  { id: 1, name: 'Lamidi Olonade Fakeye'},
  { id: 2, name: 'Louise Nevelson'},
];

export default function List() {
  const [artists, setArtists] = useState(
    initialArtists
  );

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>
            {artist.name}{' '}
            <button onClick={() => {
              setArtists(
                artists.filter(a =>
                  a.id !== artist.id
                )
              );
            }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

"Delete" 버튼을 몇 번 클릭하고, 클릭 이벤트 핸들러를 확인해보세요.

```js
setArtists(
  artists.filter(a => a.id !== artist.id)
);
```

여기서 `artists.filter(s => s.id !== artist.id)`는 "`artist.id`와 ID가 다른 `artists`로 구성된 배열을 생성한다"는 의미입니다. 즉 각 artists의 "삭제" 버튼은 해당 artists를 배열에서 필터링한 다음, 반환된 배열로 리렌더링을 요청합니다. `filter`가 원본 배열을 수정하지 않는다는 것에 주의하세요.

### 배열 변환하기 {/*transforming-an-array*/}

배열의 일부 혹은 전체를 변경하려면 `map()`을 사용해 **새** 배열을 만들면 됩니다. `map`에 전달하는 함수는 데이터나 인덱스(또는 둘 다)를 기반으로 각 항목을 어떻게 처리할지 결정할 수 있습니다.

이 예시에서 배열은 두 개의 원과 정사각형 하나의 좌표를 가지고 있습니다. 버튼을 누르면 원들은 50픽셀 아래로 이동합니다. `map()`으로 새 데이터 배열을 생성하여 이를 처리합니다.

<Sandpack>

```js
import { useState } from 'react';

let initialShapes = [
  { id: 0, type: 'circle', x: 50, y: 100 },
  { id: 1, type: 'square', x: 150, y: 100 },
  { id: 2, type: 'circle', x: 250, y: 100 },
];

export default function ShapeEditor() {
  const [shapes, setShapes] = useState(
    initialShapes
  );

  function handleClick() {
    const nextShapes = shapes.map(shape => {
      if (shape.type === 'square') {
        // 변경시키지 않고 반환합니다.
        return shape;
      } else {
        // 50px 아래로 이동한 새로운 원을 반환합니다.
        return {
          ...shape,
          y: shape.y + 50,
        };
      }
    });
    // 새로운 배열로 리렌더링합니다.
    setShapes(nextShapes);
  }

  return (
    <>
      <button onClick={handleClick}>
        Move circles down!
      </button>
      {shapes.map(shape => (
        <div style={{
          background: 'purple',
          position: 'absolute',
          left: shape.x,
          top: shape.y,
          borderRadius:
            shape.type === 'circle'
              ? '50%' : '',
          width: 20,
          height: 20,
        }} />
      ))}
    </>
  );
}
```

```css
body { height: 300px; }
```

</Sandpack>

### 배열 안의 항목 교체하기 {/*replacing-items-in-an-array*/}

배열에서 하나 이상의 항목을 교체하는 것은 특히 흔한 경우입니다. `arr[0] = 'bird'`와 같이 할당하는 것은 원본 배열을 변경시키므로 `map`을 사용해야 합니다.

항목을 교체하려면 `map`을 이용해서 새로운 배열을 만드세요. `map`을 호출할 때 두 번째 인수로 항목의 인덱스를 받을 수 있습니다. 인덱스는 원래 항목(첫 번째 인수)을 반환할지 다른 항목을 반환할지를 결정할 때 사용합니다.

<Sandpack>

```js
import { useState } from 'react';

let initialCounters = [
  0, 0, 0
];

export default function CounterList() {
  const [counters, setCounters] = useState(
    initialCounters
  );

  function handleIncrementClick(index) {
    const nextCounters = counters.map((c, i) => {
      if (i === index) {
        // 클릭된 counter를 증가시킵니다.
        return c + 1;
      } else {
        // 변경되지 않은 나머지를 반환합니다.
        return c;
      }
    });
    setCounters(nextCounters);
  }

  return (
    <ul>
      {counters.map((counter, i) => (
        <li key={i}>
          {counter}
          <button onClick={() => {
            handleIncrementClick(i);
          }}>+1</button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

### 배열에 항목 삽입하기 {/*inserting-into-an-array*/}

때로는, 시작도 끝도 아닌 위치에 항목을 삽입하고 싶을 때가 있습니다. 이렇게 하려면, `...` 전개 연산자와 `slice()` 함수를 같이 사용하면 됩니다. `slice()` 함수를 사용하면 배열의 "일부분"을 자를 수 있습니다. 항목을 삽입하려면 삽입 지점 _앞에_ 자른 배열을 전개하고 새 항목을 전개한 다음 원본 배열의 나머지 부분을 전개하는 배열을 만듭니다.

이 예시에서 삽입 버튼은 항상 인덱스 `1`에 삽입합니다.

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialArtists = [
  { id: 0, name: 'Marta Colvin Andrade' },
  { id: 1, name: 'Lamidi Olonade Fakeye'},
  { id: 2, name: 'Louise Nevelson'},
];

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState(
    initialArtists
  );

  function handleClick() {
    const insertAt = 1; // 모든 인덱스가 될 수 있습니다.
    const nextArtists = [
      // 삽입 지점 이전 항목
      ...artists.slice(0, insertAt),
      // 새 항목
      { id: nextId++, name: name },
      // 삽입 지점 이후 항목
      ...artists.slice(insertAt)
    ];
    setArtists(nextArtists);
    setName('');
  }

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={handleClick}>
        Insert
      </button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

### 배열에 대한 기타 변경 사항 {/*making-other-changes-to-an-array*/}

전개 연산자와 `map()`이나 `filter()` 같은 비-변경 함수들로만으로는 할 수 없는 일이 몇 가지 있습니다. 예를 들어 배열을 뒤집거나 정렬하고 싶은 경우가 있습니다. JavaScript의 `reverse()` 및 `sort()` 함수는 원본 배열을 변경시키므로 직접 사용할 수 없습니다.

**그러나 먼저 배열을 복사한 다음 변경할 수 있습니다.**

예를 들어서 아래와 같습니다.

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies' },
  { id: 1, title: 'Lunar Landscape' },
  { id: 2, title: 'Terracotta Army' },
];

export default function List() {
  const [list, setList] = useState(initialList);

  function handleClick() {
    const nextList = [...list];
    nextList.reverse();
    setList(nextList);
  }

  return (
    <>
      <button onClick={handleClick}>
        Reverse
      </button>
      <ul>
        {list.map(artwork => (
          <li key={artwork.id}>{artwork.title}</li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

먼저 `[...list]` 전개 연산자를 사용하여 원본 배열의 복사본을 만듭니다. 이제 복사본이 있으므로 `nextList.reverse()`나 `nextList.sort()`와 같은 변경 함수를 사용하거나 `nextList[0] = "something"`과 같이 개별 항목을 할당할 수도 있습니다.

그러나, **배열을 복사하더라도 배열 _내부_ 에 기존 항목을 직접 변경해서는 안됩니다**. 얕은 복사이기 때문입니다.--복사한 새 배열에는 원본 배열의과 동일한 항목이 포함됩니다. 따라서 복사된 배열 내부의 객체를 수정하면 기존 상태가 변경됩니다. 예를 들어 아래와 같은 코드가 문제입니다.

```js
const nextList = [...list];
nextList[0].seen = true; // 문제: list[0]을 변경시킵니다.
setList(nextList);
```

`nextList`와 `list`는 서로 다른 배열이지만, **`nextList[0]`과 `list[0]`은 동일한 객체를 가리킵니다**. 따라서 `nextList[0].seen`을 변경하면 `list[0].seen`도 변경됩니다. 이것은 피해야 하는 상태 변경입니다. [중첩된 JavaScript 객체 업데이트](docs/updating-objects-in-state#updating-a-nested-object)와 유사한 방식으로 이 문제를 해결할 수 있습니다.--변경하려는 개별 항목을 변경하는 대신 복사하면 됩니다. 방법은 다음과 같습니다.

## 배열 내부의 객체 업데이트하기 {/*updating-objects-inside-arrays*/}

객체는 _실제로_ 배열 "내부"의 위치하지 않습니다. 코드에서 "내부"로 나타낼 수 있지만 배열의 각 객체는 배열이 "가리키는" 별도의 값입니다. 이것이 `list[0]`처럼 중첩된 필드를 변경하는 것에 주의해야 하는 이유입니다. 다른 사람의 artwork 리스트가 배열의 동일한 엘리먼트를 가리킬 수 있습니다!

<!-- TODOODLE -->

**중첩된 state를 업데이트 할 때, 업데이트하려는 지점부터 최상위 레벨까지의 복사본을 만들어야 합니다.** 어떻게 작동하는지 살펴봅시다.

이 예시에서 두 개의 개별 artwork 리스트들은 초기 상태가 서로 같습니다. 두 리스트는 분리되어야 하지만 변경으로 인해 두 리스트의 state가 실수로 공유되고 한 리스트의 체크박스를 선택하면 다른 리스트에 영향을 끼칩니다.

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
  const [myList, setMyList] = useState(initialList);
  const [yourList, setYourList] = useState(
    initialList
  );

  function handleToggleMyList(artworkId, nextSeen) {
    const myNextList = [...myList];
    const artwork = myNextList.find(
      a => a.id === artworkId
    );
    artwork.seen = nextSeen;
    setMyList(myNextList);
  }

  function handleToggleYourList(artworkId, nextSeen) {
    const yourNextList = [...yourList];
    const artwork = yourNextList.find(
      a => a.id === artworkId
    );
    artwork.seen = nextSeen;
    setYourList(yourNextList);
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Your list of art to see:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
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

문제는 아래와 같은 코드에 있습니다.

```js
const myNextList = [...myList];
const artwork = myNextList.find(a => a.id === artworkId);
artwork.seen = nextSeen; // 문제: 기존 항목을 변경시킵니다.
setMyList(myNextList);
```

`myNextList` 배열 자체는 새 배열이지만, *항목 자체*는 `myList` 원본 배열과 동일합니다. 따라서 `artwork.seen`을 변경하면 *원본* artwork 항목이 변경됩니다. 해당 artwork 항목은 `yourArtWorks`에도 존재하므로 버그가 발생합니다. 이런 버그는 생각하기 어려울 수 있지만 다행히도 상태 변경을 피하면 해결할 수 있습니다.

**`map`을 사용하면 이전 항목의 변경 없이 업데이트된 버전으로 대체할 수 있습니다.**

```js
setMyList(myList.map(artwork => {
  if (artwork.id === artworkId) {
    // 변경된 *새* 객체를 만들어 반환합니다.
    return { ...artwork, seen: nextSeen };
  } else {
    // 변경시키지 않고 반환합니다.
    return artwork;
  }
});
```

여기서 `...`는 [객체의 복사본 생성](/learn/updating-objects-in-state#copying-objects-with-the-spread-syntax)에 사용되는 객체 전개 연산자 문법입니다.

이 접근 방식을 사용하면, 기존 state의 항목이 변경되지 않고 버그가 수정됩니다.

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
  const [myList, setMyList] = useState(initialList);
  const [yourList, setYourList] = useState(
    initialList
  );

  function handleToggleMyList(artworkId, nextSeen) {
    setMyList(myList.map(artwork => {
      if (artwork.id === artworkId) {
        // 변경된 *새* 객체를 만들어 반환합니다.
        return { ...artwork, seen: nextSeen };
      } else {
        // 변경시키지 않고 반환합니다.
        return artwork;
      }
    }));
  }

  function handleToggleYourList(artworkId, nextSeen) {
    setYourList(yourList.map(artwork => {
      if (artwork.id === artworkId) {
        // 변경된 *새* 객체를 만들어 반환합니다.
        return { ...artwork, seen: nextSeen };
      } else {
        // 변경시키지 않고 반환합니다.
        return artwork;
      }
    }));
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Your list of art to see:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
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

일반적으로 **방금 생성한 객체만 변경해야 합니다.** *새* artwork를 삽입하는 경우 변경이 가능하지만, 이미 state에 존재하는 것을 처리하려면 복사본이 필요합니다.

### Immer로 간결한 업데이트 로직 작성하기 {/*write-concise-update-logic-with-immer*/}

변경 없이 중첩된 배열을 업데이트하는 것은 [객체와 마찬가지로](/learn/updating-objects-in-state#write-concise-update-logic-with-immer) 약간 반복적일 수 있습니다.

- 일반적으로 깊은 레벨까지의 state를 업데이트 할 필요는 없습니다. state 객체가 매우 깊다면 [다르게 재구성](/learn/choosing-the-state-structure#avoid-deeply-nested-state)하여 평평하게 만들 수 있습니다.
- state 구조를 변경하고 싶지 않다면 [Immer](https://github.com/immerjs/use-immer) 사용을 선호할 수 있습니다. 손쉽게 변경 문법을 사용하여 작성할 수 있고 복사본을 처리할 수 있습니다.

다음은 Immer로 다시 작성한 Art Bucket List 예시입니다.

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
  const [myList, updateMyList] = useImmer(
    initialList
  );
  const [yourArtworks, updateYourList] = useImmer(
    initialList
  );

  function handleToggleMyList(id, nextSeen) {
    updateMyList(draft => {
      const artwork = draft.find(a =>
        a.id === id
      );
      artwork.seen = nextSeen;
    });
  }

  function handleToggleYourList(artworkId, nextSeen) {
    updateYourList(draft => {
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
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Your list of art to see:</h2>
      <ItemList
        artworks={yourArtworks}
        onToggle={handleToggleYourList} />
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

Immer에서는 **`artwork.seen = nextSeen`과 같이 변경해도 괜찮습니다.**

```js
updateMyTodos(draft => {
  const artwork = draft.find(a => a.id === artworkId);
  artwork.seen = nextSeen;
});
```

이는 _원본_ state를 변경하는 것이 아니라, Immer에서 제공하는 특수 `draft` 객체를 변경하기 때문입니다. 마찬가지로 `push()`와 `pop()`같은 변경 함수들도 `draft`의 컨텐츠에 적용할 수 있습니다.

내부적으로 Immer는 항상 `draft`에서 수행한 변경 사항에 따라 처음부터 다음 state를 구성합니다. 이렇게 하면 state를 변경하지 않고도 이벤트 핸들러를 매우 간결하게 유지할 수 있습니다.

<Recap>

- 배열을 state로 만들 수 있지만 변경하면 안됩니다.
- 배열을 변경하는 대신 배열의 *새* 버전을 만들고 state를 업데이트 해야합니다.
- `[...arr, newItem]` 배열 전개 연산자를 사용하여 새 항목으로 배열을 생성할 수 있습니다.
- `filter()`와 `map()`을 사용하여 필터링된 항목들이나 변환된 항목들을 가진 배열을 만들 수 있습니다.
- Immer를 사용하여 코드 간결성을 유지할 수 있습니다.

</Recap>



<Challenges>

### 장바구니의 항목 업데이트하기 {/*update-an-item-in-the-shopping-cart*/}

"+" 버튼을 누르면 해당 숫자가 증가하도록 로직을 작성해보세요.

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {

  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

<Solution>

`map` 함수를 사용하여 새 배열을 생성하고 `...` 객체 전개 연산자를 사용하여 새 배열에 넣을 변경된 객체의 복사본을 만들 수 있습니다.

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

</Solution>

### 장바구니에서 항목 제거하기 {/*remove-an-item-from-the-shopping-cart*/}

이 장바구니에는 작동하는 "+" 버튼이 있지만 "-" 버튼은 아무 기능도 하지 않습니다. 이벤트 핸들러를 추가해야 해당 product의 `count`가 감소합니다. count가 1일 때 "-"를 누르면 product가 장바구니에서 자동으로 제거됩니다. 0이 표시되지 않아야합니다.

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
          <button>
            –            
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

<Solution>

먼저 `map`을 사용하여 새 배열을 만들고 `filter`로 `count`가 `0`인 products를 제거할 수 있습니다.

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  function handleDecreaseClick(productId) {
    let nextProducts = products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count - 1
        };
      } else {
        return product;
      }
    });
    nextProducts = nextProducts.filter(p =>
      p.count > 0
    );
    setProducts(nextProducts)
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
          <button onClick={() => {
            handleDecreaseClick(product.id);
          }}>
            –            
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

</Solution>

### 비변경 함수를 사용하여 변경 수정하기 {/*fix-the-mutations-using-non-mutative-methods*/}

이 예시에서 `App.js`의 모든 이벤트 핸들러는 변경을 사용합니다. 결과적으로 todos를 편집하거나 삭제하는 기능이 동작하지 않습니다. 비변경 함수를 사용하도록 `handleAddTodo`, `handleChangeTodo` 그리고 `handleDeleteTodo`를 다시 작성해보세요.

<Sandpack>

```js App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    todos.push({
      id: nextId++,
      title: title,
      done: false
    });
  }

  function handleChangeTodo(nextTodo) {
    const todo = todos.find(t =>
      t.id === nextTodo.id
    );
    todo.title = nextTodo.title;
    todo.done = nextTodo.done;
  }

  function handleDeleteTodo(todoId) {
    const index = todos.findIndex(t =>
      t.id === todoId
    );
    todos.splice(index, 1);
  }

  return (
    <>  
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
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
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
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

<Solution>

`handleAddTodo`는 배열 전개 연산자를 사용할 수 있습니다. `handleChanageTodo`는 `map`을 사용하여 새 배열을 만들 수 있으며 `handleDeleteTodo`는 `filter`를 사용해 새 배열을 만들 수 있습니다. 이제 리스트가 올바르게 작동합니다.

<Sandpack>

```js App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    setTodos([
      ...todos,
      {
        id: nextId++,
        title: title,
        done: false
      }
    ]);
  }

  function handleChangeTodo(nextTodo) {
    setTodos(todos.map(t => {
      if (t.id === nextTodo.id) {
        return nextTodo;
      } else {
        return t;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    setTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>  
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
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
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
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

</Solution>


### Immer를 사용해서 변경 수정하기 {/*fix-the-mutations-using-immer*/}

이 예시는 이전 예시와 동일한 예시입니다. 이번에는 Immer를 사용하여 변경을 수정합니다. 편의를 위해 `useImmer`는 이미 import되어 있으므로 `todos` state 변수를 사용하도록 수정해야 합니다.

<Sandpack>

```js App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    todos.push({
      id: nextId++,
      title: title,
      done: false
    });
  }

  function handleChangeTodo(nextTodo) {
    const todo = todos.find(t =>
      t.id === nextTodo.id
    );
    todo.title = nextTodo.title;
    todo.done = nextTodo.done;
  }

  function handleDeleteTodo(todoId) {
    const index = todos.findIndex(t =>
      t.id === todoId
    );
    todos.splice(index, 1);
  }

  return (
    <>  
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
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
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
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

<Solution>

Immer가 제공하는 `draft`의 일부만 변경하기만 하면 Immer를 사용하여 변경 방식으로 코드를 작성할 수 있습니다. 여기에서 모든 변경은 `draft`에서 수행되므로 코드가 잘 작동합니다.

<Sandpack>

```js App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, updateTodos] = useImmer(
    initialTodos
  );

  function handleAddTodo(title) {
    updateTodos(draft => {
      draft.push({
        id: nextId++,
        title: title,
        done: false
      });
    });
  }

  function handleChangeTodo(nextTodo) {
    updateTodos(draft => {
      const todo = draft.find(t =>
        t.id === nextTodo.id
      );
      todo.title = nextTodo.title;
      todo.done = nextTodo.done;
    });
  }

  function handleDeleteTodo(todoId) {
    updateTodos(draft => {
      const index = draft.findIndex(t =>
        t.id === todoId
      );
      draft.splice(index, 1);
    });
  }

  return (
    <>  
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
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
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
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

또한 Immer를 사용하여 변경 및 비변경 접근 방식을 섞어서 사용할 수 있습니다.

예를 들어 이 버전에서 `handleAddTodo`는 Immer의 `draft`를 변경하여 구현되는 반면에 `handleChangeTodo`와 `handleDeleteTodo`는 비변경 함수인 `map`과 `filter` 함수를 사용합니다.

<Sandpack>

```js App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, updateTodos] = useImmer(
    initialTodos
  );

  function handleAddTodo(title) {
    updateTodos(draft => {
      draft.push({
        id: nextId++,
        title: title,
        done: false
      });
    });
  }

  function handleChangeTodo(nextTodo) {
    updateTodos(todos.map(todo => {
      if (todo.id === nextTodo.id) {
        return nextTodo;
      } else {
        return todo;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    updateTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>  
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
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
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
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

Immer를 사용하면 각각의 다른 케이스에서 가장 자연스러운 방식을 선택할 수 있습니다.

</Solution>

</Challenges>
