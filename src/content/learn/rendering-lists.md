---
title: 리스트 렌더링
---

<Intro>

데이터 모음에서 유사한 컴포넌트를 여러 개 표시하고 싶을 때가 종종 있습니다. [JavaScript 배열 메서드](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array#)를 사용하여 데이터 배열을 조작할 수 있습니다. 이 페이지에서는 React에서 [`filter()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)와 [`map()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/map)을 사용해 데이터 배열을 필터링하고 컴포넌트 배열로 변환해보겠습니다.

</Intro>

<YouWillLearn>

* JavaScript의 `map()`을 사용하여 배열을 컴포넌트로 렌더링하는 방법
* JavaScript의 `filter()`를 사용하여 특정 컴포넌트만 렌더링하는 방법
* React에서 Key가 필요한 때와 이유

</YouWillLearn>

## 배열을 데이터로 렌더링하기 {/*rendering-data-from-arrays*/}

내용이 있는 리스트가 있다고 가정해 봅시다.

```js
<ul>
  <li>Creola Katherine Johnson: mathematician</li>
  <li>Mario José Molina-Pasquel Henríquez: chemist</li>
  <li>Mohammad Abdus Salam: physicist</li>
  <li>Percy Lavon Julian: chemist</li>
  <li>Subrahmanyan Chandrasekhar: astrophysicist</li>
</ul>
```

이러한 리스트 항목의 유일한 차이점은 콘텐츠, 즉 데이터입니다. 댓글 목록에서 프로필 이미지 갤러리에 이르기까지 인터페이스를 구축할 때 서로 다른 데이터를 사용하여 동일한 컴포넌트의 여러 인스턴스를 표시해야 하는 경우가 종종 있습니다. 이러한 상황에서 해당 데이터를 JavaScript 객체와 배열에 저장하고 [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)과 [`filter()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) 같은 메서드를 사용하여 해당 객체에서 컴포넌트 리스트를 렌더링할 수 있습니다.

다음은 배열에서 항목 리스트를 생성하는 방법에 대한 간단한 예시입니다.

1. 데이터를 배열로 **이동**합니다.

```js
const people = [
  'Creola Katherine Johnson: mathematician',
  'Mario José Molina-Pasquel Henríquez: chemist',
  'Mohammad Abdus Salam: physicist',
  'Percy Lavon Julian: chemist',
  'Subrahmanyan Chandrasekhar: astrophysicist'
];
```

2. `people`의 요소를 새로운 JSX 노드 배열인 `listItems`에 **매핑**합니다.

```js
const listItems = people.map(person => <li>{person}</li>);
```

3. `<ul>`로 래핑된 컴포넌트의 `listItems`를 **반환**합니다.

```js
return <ul>{listItems}</ul>;
```

결과는 다음과 같습니다.

<Sandpack>

```js
const people = [
  'Creola Katherine Johnson: mathematician',
  'Mario José Molina-Pasquel Henríquez: chemist',
  'Mohammad Abdus Salam: physicist',
  'Percy Lavon Julian: chemist',
  'Subrahmanyan Chandrasekhar: astrophysicist'
];

export default function List() {
  const listItems = people.map(person =>
    <li>{person}</li>
  );
  return <ul>{listItems}</ul>;
}
```

```css
li { margin-bottom: 10px; }
```

</Sandpack>

위의 샌드박스에 콘솔 에러가 표시된다는 점에 주의하세요.

<ConsoleBlock level="error">

Warning: Each child in a list should have a unique "key" prop.

</ConsoleBlock>

이 에러를 수정하는 방법은 이 페이지의 뒷부분에서 알아보겠습니다. 그 전에 데이터에 몇 가지 구조를 추가해 보겠습니다.

## 배열의 항목들을 필터링하기 {/*filtering-arrays-of-items*/}

이 데이터는 훨씬 더 구조화될 수 있습니다.

```js
const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
}, {
  name: 'Percy Lavon Julian',
  profession: 'chemist',
}, {
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
}];
```

직업이 `'chemist'`인 사람들만 표시하고 싶다고 가정해 봅시다. JavaScript의 `filter()` 메서드를 사용하여 해당하는 사람만 반환할 수 있습니다. 이 메서드는 항목 배열을 받아 “test”(`true` 혹은 `false`를 반환하는 함수)를 통과한 후 테스트에 통과된 항목(`true`가 반환된 항목)만 있는 새로운 배열을 반환합니다.

`직업`이 `'chemist'`인 항목만 필요합니다. 이를 위한 “test” 함수는 `(person) => person.profession === 'chemist'`와 같습니다. 이를 적용하는 과정은 다음과 같습니다.

1. `people`에서 `filter()`를 호출해 `person.profession === 'chemist'`로 필터링해서 “chemist”로만 구성된 새로운 배열 `chemists`를 **생성**합니다.

```js
const chemists = people.filter(person =>
  person.profession === 'chemist'
);
```

2. 이제 `chemists`를 **매핑**합니다.

```js {1,13}
const listItems = chemists.map(person =>
  <li>
     <img
       src={getImageUrl(person)}
       alt={person.name}
     />
     <p>
       <b>{person.name}:</b>
       {' ' + person.profession + ' '}
       known for {person.accomplishment}
     </p>
  </li>
);
```

3. 마지막으로 컴포넌트에서 `listItems`를 **반환**합니다.

```js
return <ul>{listItems}</ul>;
```

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const listItems = chemists.map(person =>
    <li>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}:</b>
        {' ' + person.profession + ' '}
        known for {person.accomplishment}
      </p>
    </li>
  );
  return <ul>{listItems}</ul>;
}
```

```js src/data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<Pitfall>

화살표 함수는 암시적으로 `=>` 바로 뒤에 식을 반환하기 때문에 `return` 문이 필요하지 않습니다.

```js
const listItems = chemists.map(person =>
  <li>...</li> // 암시적 반환!
);
```

하지만 **`=>` 뒤에 `{` 중괄호가 오는 경우 `return`을 명시적으로 작성해야 합니다!**

```js
const listItems = chemists.map(person => { // 중괄호
  return <li>...</li>;
});
```

`=> {` 를 표현하는 화살표 함수를 [“block body”](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#function_body)를 가지고 있다고 말합니다. 이 함수를 사용하면 한 줄 이상의 코드를 작성할 수 있지만 `return` 문을 *반드시* 작성해야 합니다. 그렇지 않으면 아무것도 반환되지 않습니다!

</Pitfall>

## `key`를 사용해서 리스트 항목을 순서대로 유지하기 {/*keeping-list-items-in-order-with-key*/}

위의 모든 샌드박스에 콘솔에 에러가 표시되는 것을 확인할 수 있습니다.

<ConsoleBlock level="error">

Warning: Each child in a list should have a unique "key" prop.

</ConsoleBlock>

각 배열 항목에 다른 항목 중에서 고유하게 식별할 수 있는 문자열 또는 숫자를 `key`로 지정해야 합니다.

```js
<li key={person.id}>...</li>
```

<Note>

`map()` 호출 내부의 JSX 엘리먼트에는 항상 key가 필요합니다!

</Note>

Key는 각 컴포넌트가 어떤 배열 항목에 해당하는지 React에 알려주어 나중에 일치시킬 수 있도록 합니다. 이는 배열 항목이 정렬 등으로 인해 이동하거나 삽입되거나 삭제될 수 있는 경우 중요해집니다. `key`를 잘 선택하면 React가 정확히 무슨 일이 일어났는지 추론하고 DOM 트리에 올바르게 업데이트 하는데 도움이 됩니다.

즉석에서 key를 생성하는 대신 데이터 안에 key를 포함해야 합니다.

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const listItems = people.map(person =>
    <li key={person.id}>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}</b>
          {' ' + person.profession + ' '}
          known for {person.accomplishment}
      </p>
    </li>
  );
  return <ul>{listItems}</ul>;
}
```

```js src/data.js active
export const people = [{
  id: 0, // JSX에서 key로 사용됩니다.
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1, // JSX에서 key로 사용됩니다.
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2, // JSX에서 key로 사용됩니다.
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3, // JSX에서 key로 사용됩니다.
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4, // JSX에서 key로 사용됩니다.
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<DeepDive>

#### 각 리스트 항목에 대해 여러 DOM 노드 표시하기 {/*displaying-several-dom-nodes-for-each-list-item*/}

각 항목이 하나가 아닌 여러 개의 DOM 노드를 렌더링해야 하는 경우에는 어떻게 해야 할까요?

짧은 `<> </>` fragment 구문으로는 key를 전달할 수 없으므로 key를 단일 `<div>`로 그룹화하거나 약간 더 길고 명시적인 `<Fragment>` 문법을 사용해야 합니다.

```js
import { Fragment } from 'react';

// ...

const listItems = people.map(person =>
  <Fragment key={person.id}>
    <h1>{person.name}</h1>
    <p>{person.bio}</p>
  </Fragment>
);
```

Fragment는 DOM에서 사라지므로 `<h1>`, `<p>`, `<h1>`, `<p>` 등의 평평한 리스트가 생성됩니다.

</DeepDive>

### `key`를 가져오는 곳 {/*where-to-get-your-key*/}

데이터 소스마다 다른 key 소스를 제공합니다

* **데이터베이스의 데이터:** : 데이터베이스에서 데이터를 가져오는 경우 본질적으로 고유한 데이터베이스 key/ID를 사용할 수 있습니다.
* **로컬에서 생성된 데이터:** 데이터가 로컬에서 생성되고 유지되는 경우(예: 메모 작성 앱의 노트), 항목을 만들 때 증분 일련번호나 [`crypto.randomUUID()`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID) 또는 [`uuid`](https://www.npmjs.com/package/uuid) 같은 패키지를 사용하세요.

### key 규칙 {/*rules-of-keys*/}

* **key는 형제 간에 고유해야 합니다.** 하지만 같은 key를 _다른_ 배열의 JSX 노드에 동일한 key를 사용해도 괜찮습니다.
* **key는 변경되어서는 안 되며** 그렇게 되면 key는 목적에 어긋납니다! 렌더링 중에는 key를 생성하지 마세요.

### React에 key가 필요한 이유는 무엇인가요? {/*why-does-react-need-keys*/}

데스크탑의 파일에 이름이 없다고 상상해 보세요. 대신 첫 번째 파일, 두 번째 파일 등 순서대로 파일을 참조할 것입니다. 익숙해질 수도 있지만, 파일을 삭제한다면 혼란스러워질 수도 있습니다. 두 번째 파일이 첫 번째 파일이 되고 세 번째 파일이 두 번째 파일이 되는 식으로 말이죠.

폴더의 파일 이름과 배열의 JSX key는 비슷한 용도로 사용됩니다. 이를 통해 형제 항목 간에 항목을 고유하게 식별할 수 있습니다. 잘 선택된 key는 배열 내 위치보다 더 많은 정보를 제공합니다. 재정렬로 인해 _위치_가 변경되더라도 `key`는 React가 생명주기 내내 해당 항목을 식별할 수 있게 해줍니다.

<Pitfall>

배열에서 항목의 인덱스를 key로 사용하고 싶을 수도 있습니다. 실제로 `key`를 전혀 지정하지 않으면 React는 인덱스를 사용합니다. 하지만 항목이 삽입되거나 삭제하거나 배열의 순서가 바뀌면 시간이 지남에 따라 항목을 렌더링하는 순서가 변경됩니다. 인덱스를 key로 사용하면 종종 미묘하고 혼란스러운 버그가 발생합니다.

마찬가지로 `key={Math.random()}`처럼 즉석에서 key를 생성하지 마세요. 이렇게 하면 렌더링 간에 key가 일치하지 않아 모든 컴포넌트와 DOM이 매번 다시 생성될 수 있습니다. 속도가 느려질 뿐만 아니라 리스트 항목 내부의 모든 사용자의 입력도 손실됩니다. 대신 데이터 기반의 안정적인 ID를 사용하세요.

컴포넌트가 `key`를 prop으로 받지 않는다는 점에 유의하세요. key는 React 자체에서 힌트로만 사용됩니다. 컴포넌트에 ID가 필요하다면 `<Profile key={id} userId={id} />`와 같이 별도의 prop으로 전달해야 합니다.

</Pitfall>

<Recap>

이 페이지에서 학습한 내용

* 컴포넌트에서 배열이나 객체와 같은 데이터 구조로 데이터를 이동하는 방법
* JavaScript의 `map()`을 사용하여 유사한 컴포넌트 집합을 생성하는 방법
* JavaScript의 `filter()`를 사용하여 필터링된 항목의 배열을 생성하는 방법
* 컬렉션에서 각 컴포넌트에 `key`를 설정하여 위치나 데이터가 변경되더라도 React가 각 컴포넌트를 추적할 수 있도록 하는 이유와 방법

</Recap>



<Challenges>

#### 리스트를 둘로 나누기 {/*splitting-a-list-in-two*/}

예시는 모든 사람의 리스트를 보여줍니다.

두 개의 개별 리스트 **Chemists**와 **Everyone Else**을 차례로 표시하도록 변경하세요. 이전과 마찬가지로 `person.profession === 'chemist'`를 확인하여 어떤 사람이 chemist인지 확인할 수 있습니다.

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const listItems = people.map(person =>
    <li key={person.id}>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}:</b>
        {' ' + person.profession + ' '}
        known for {person.accomplishment}
      </p>
    </li>
  );
  return (
    <article>
      <h1>Scientists</h1>
      <ul>{listItems}</ul>
    </article>
  );
}
```

```js src/data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<Solution>

`filter()`를 두 번 사용해서 두 개의 개별 배열을 만든 다음 두 배열을 모두 `매핑`할 수 있습니다.

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const everyoneElse = people.filter(person =>
    person.profession !== 'chemist'
  );
  return (
    <article>
      <h1>Scientists</h1>
      <h2>Chemists</h2>
      <ul>
        {chemists.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ' '}
              known for {person.accomplishment}
            </p>
          </li>
        )}
      </ul>
      <h2>Everyone Else</h2>
      <ul>
        {everyoneElse.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ' '}
              known for {person.accomplishment}
            </p>
          </li>
        )}
      </ul>
    </article>
  );
}
```

```js src/data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

이 솔루션에서는 `map` 호출이 상위 `<ul>` 요소 안에 인라인으로 직접 배치되지만, 가독성을 위해 변수를 도입할 수도 있습니다.

렌더링 된 리스트 간에 여전히 약간의 중복이 있습니다. 여기서 더 나아가 반복적인 부분을 `<ListSection>` 컴포넌트로 추출할 수 있습니다.

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

function ListSection({ title, people }) {
  return (
    <>
      <h2>{title}</h2>
      <ul>
        {people.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ' '}
              known for {person.accomplishment}
            </p>
          </li>
        )}
      </ul>
    </>
  );
}

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const everyoneElse = people.filter(person =>
    person.profession !== 'chemist'
  );
  return (
    <article>
      <h1>Scientists</h1>
      <ListSection
        title="Chemists"
        people={chemists}
      />
      <ListSection
        title="Everyone Else"
        people={everyoneElse}
      />
    </article>
  );
}
```

```js src/data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

세심한 독자라면 두 번의 `filter` 호출을 통해 각 사람의 직업을 두 번 확인하고 있다는 것을 알아차릴 수 있습니다. 속성을 확인하는 속도가 매우 빠르기 때문에 이 예제에서는 문제가 없습니다. 하지만 로직이 더 복잡하다면 `filter` 호출을 수동으로 배열을 구성하고 각 사람을 한 번씩 확인하는 반복문으로 대체할 수 있습니다.

실제로 `people`이 바뀌지 않는다면 이 코드를 컴포넌트 외부로 옮길 수도 있습니다. React의 관점에서 중요한 것은 결국 JSX 노드 배열을 제공한다는 것입니다. 그 배열을 생성하는 방법은 중요하지 않습니다.

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

let chemists = [];
let everyoneElse = [];
people.forEach(person => {
  if (person.profession === 'chemist') {
    chemists.push(person);
  } else {
    everyoneElse.push(person);
  }
});

function ListSection({ title, people }) {
  return (
    <>
      <h2>{title}</h2>
      <ul>
        {people.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ' '}
              known for {person.accomplishment}
            </p>
          </li>
        )}
      </ul>
    </>
  );
}

export default function List() {
  return (
    <article>
      <h1>Scientists</h1>
      <ListSection
        title="Chemists"
        people={chemists}
      />
      <ListSection
        title="Everyone Else"
        people={everyoneElse}
      />
    </article>
  );
}
```

```js src/data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

</Solution>

#### 하나의 컴포넌트에 중첩된 리스트 {/*nested-lists-in-one-component*/}

이 배열에서 레시피 리스트를 만들어 보세요! 배열의 각 레시피에 대해 이름을 `<h2>`로 표시하고 재료를 `<ul>`에 나열합니다.

<Hint>

이렇게 하려면 서로 다른 두 개의 `map` 호출을 중첩해야 합니다.

</Hint>

<Sandpack>

```js src/App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
    </div>
  );
}
```

```js src/data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

<Solution>

한 가지 방법을 소개합니다.

<Sandpack>

```js src/App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
      {recipes.map(recipe =>
        <div key={recipe.id}>
          <h2>{recipe.name}</h2>
          <ul>
            {recipe.ingredients.map(ingredient =>
              <li key={ingredient}>
                {ingredient}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
```

```js src/data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

각 `recipes`에는 이미 `id` 필드가 포함되어 있으므로 외부 반복문은 이 필드를 `key`로 사용합니다. 재료를 순회할 때 사용할 수 있는 ID는 없습니다. 하지만 같은 레시피에서 같은 재료가 두 번씩 나열되지 않는다고 가정하면 재료의 이름을 `key`로 사용할 수 있습니다. 또는 데이터 구조를 변경하여 ID를 추가하거나 인덱스를 `key`로 사용할 수 있습니다. (단, 재료 순서를 안전하게 바꿀 수 없다는 점에 유의하세요.)

</Solution>

#### 리스트 항목 컴포넌트 추출하기 {/*extracting-a-list-item-component*/}

`RecipeList` 컴포넌트에는 두 개의 중첩된 `map` 호출이 포함되어 있습니다. 이를 단순화하기 위해 `id`, `name`, `ingredients` props를 허용하는 `Recipe` 컴포넌트를 추출합니다. 외부 `key`를 어디에 위치하고 그 이유는 무엇일까요?

<Sandpack>

```js src/App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
      {recipes.map(recipe =>
        <div key={recipe.id}>
          <h2>{recipe.name}</h2>
          <ul>
            {recipe.ingredients.map(ingredient =>
              <li key={ingredient}>
                {ingredient}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
```

```js src/data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

<Solution>

외부 `map`의 JSX를 새 `Recipe` 컴포넌트에 복사하여 붙여넣고 해당 JSX를 반환할 수 있습니다. 그런 다음 `recipe.name`을 `name`으로, `recipe.id`를 `id`로 변경하는 등의 작업을 수행하여 `Recipe`에 props로 전달할 수 있습니다.

<Sandpack>

```js
import { recipes } from './data.js';

function Recipe({ id, name, ingredients }) {
  return (
    <div>
      <h2>{name}</h2>
      <ul>
        {ingredients.map(ingredient =>
          <li key={ingredient}>
            {ingredient}
          </li>
        )}
      </ul>
    </div>
  );
}

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
      {recipes.map(recipe =>
        <Recipe {...recipe} key={recipe.id} />
      )}
    </div>
  );
}
```

```js src/data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

여기서 `<Recipe {...recipe} key={recipe.id} />`는 “`recipe` 객체의 모든 속성을 props로 `Recipe` 컴포넌트로 전달”하는 손쉬운 구문입니다. `<Recipe id={recipe.id} name={recipe.name} ingredients={recipe.ingredients} key={recipe.id} />` 처럼 각 prop을 명시적으로 작성할 수도 있습니다.

**`key`는 `Recipe`에서 반환된 루트 `<div>`가 아니라 `<Recipe>` 자체에 지정된다는 점에 유의하세요.** 이는 이 `key`가 주변 배열의 context 내에서 직접 필요하기 때문입니다. 이전에는 `<div>` 배열이 있었기 때문에 각 배열에 `key`가 필요했지만, 지금은 `<Recipe>` 배열이 있습니다. 즉, 컴포넌트를 추출할 때 복사하여 붙여넣은 JSX 외부에 `key`를 남겨두는 것을 잊지 마세요.

</Solution>

#### 구분 기호가 있는 리스트 {/*list-with-a-separator*/}

이 예제는 Tachibana Hokushi 의 유명한 하이쿠(일본의 정형시)를 렌더링하며, 각 행은 `<p>` 태그로 래핑되어 있습니다. 여러분이 해야 할 일은 각 단락 사이에 `<hr />` 구분 기호를 삽입하는 것입니다. 결과 구조는 다음과 같아야 합니다.

```js
<article>
  <p>I write, erase, rewrite</p>
  <hr />
  <p>Erase again, and then</p>
  <hr />
  <p>A poppy blooms.</p>
</article>
```

하이쿠는 세 줄로만 구성되어 있지만 솔루션 코드는 몇 줄이든 상관없이 동작합니다. `<hr />` 요소는 `<p>`요소 *사이*에만 표시되며 시작이나 끝에는 표시되지 않는다는 점에 유의하세요!

<Sandpack>

```js
const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  return (
    <article>
      {poem.lines.map((line, index) =>
        <p key={index}>
          {line}
        </p>
      )}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

(시의 행은 절대로 순서가 바뀌지 않으므로 인덱스를 key로 사용할 수 있는 드문 예입니다.)

<Hint>

`map`을 반복문으로 변환하거나 Fragment 를 사용해야 합니다.

</Hint>

<Solution>

다음과 같이 반복문을 작성하여  `<hr />` 과 `<p>...</p>`를 출력 배열에 삽입할 수 있습니다.

<Sandpack>

```js
const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  let output = [];

  // 출력할 배열을 작성합니다.
  poem.lines.forEach((line, i) => {
    output.push(
      <hr key={i + '-separator'} />
    );
    output.push(
      <p key={i + '-text'}>
        {line}
      </p>
    );
  });
  // 첫 번째 <hr />을 삭제합니다.
  output.shift();

  return (
    <article>
      {output}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

각 구분 기호와 단락이 동일한 배열에 있기 때문에 원래 행의 인덱스를 `key`로 사용하면 더는 작동하지 않습니다. 하지만  `key={i + '-text'}` 처럼 접미사를 사용해서 각각에 고유한 key를 부여할 수 있습니다.

또는 `<hr />` 과 `<p>...</p>` 를 포함한 Fragment 모음을 렌더링할 수 있습니다. 하지만 `<> </>` 이렇게 쓰는 손쉬운 문법은 key를 전달해주지 않기 때문에 `<Fragment>` 를 명시적으로 작성해야 합니다.

<Sandpack>

```js
import React, { Fragment } from 'react';

const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  return (
    <article>
      {poem.lines.map((line, i) =>
        <Fragment key={i}>
          {i > 0 && <hr />}
          <p>{line}</p>
        </Fragment>
      )}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

종종 `<> </>` 이렇게 쓰이는 Fragment 는 부가적인 `<div>`를 추가하지 않고도 JSX 노드를 그룹화할 수 있다는 것을 기억하세요!

</Solution>

</Challenges>
