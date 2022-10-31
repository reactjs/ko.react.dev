---
title: 리스트 렌더링
---

<Intro>

데이터 집합에서 여러 개의 유사한 컴포넌트들을 표시하려는 경우가 많습니다. [JavaScript 배열 메서드](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array#)를 사용하여 데이터 배열을 조작할 수 있습니다. 이 페이지에서는 [`filter()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)와 [`map()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/map)을 React와 사용해 데이터 배열을 컴포넌트 배열로 필터링하고 변환해보겠습니다.

</Intro>

<YouWillLearn>

* JavaScript의 `map()`을 사용하여 배열을 컴포넌트로 렌더링하는 방법
* JavaScript의 `filter()`를 사용하여 특정 컴포넌트만 렌더링하는 방법
* React에서 Key의 사용 시점 및 이유

</YouWillLearn>

## 배열을 데이터로 렌더링하기 {/*rendering-data-from-arrays*/}

내용이 있는 리스트가 있다고 가정해봅시다.

```js
<ul>
  <li>Creola Katherine Johnson: mathematician</li>
  <li>Mario José Molina-Pasquel Henríquez: chemist</li>
  <li>Mohammad Abdus Salam: physicist</li>
  <li>Percy Lavon Julian: chemist</li>
  <li>Subrahmanyan Chandrasekhar: astrophysicist</li>
</ul>
```

리스트 항목들 사이의 유일한 차이점은 내용과 데이터입니다. 댓글 목록에서 프로필 이미지 갤러리에 이르기까지 인터페이스를 구성할 때 서로 다른 데이터를 사용하여 동일한 컴포넌트의 여러 인스턴스를 표시해야 하는 경우가 많습니다. 이러한 상황에서 해당 데이터를 JavaScript의 객체와 배열에 저장할 수 있으며 그것들의 컴포넌트 리스트를 렌더링하기 위해 [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)과 [`filter()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) 같은 메서드를 사용할 수 있습니다.

배열에서 항목의 리스트를 생성하는 간단한 예시입니다.

1. 데이터를 배열로 **이동하기**

```js
const people = [
  'Creola Katherine Johnson: mathematician',
  'Mario José Molina-Pasquel Henríquez: chemist',
  'Mohammad Abdus Salam: physicist',
  'Percy Lavon Julian: chemist',
  'Subrahmanyan Chandrasekhar: astrophysicist'
];
```

2. `people`의 요소들을 새로운 JSX 노드의 배열인 `listItems`로 **매핑하기**

```js
const listItems = people.map(person => <li>{person}</li>);
```

3. 컴포넌트에서 `listItems`를 `<ul>`로 래핑해서 **반환하기**

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

<<<<<<< HEAD:beta/src/pages/learn/rendering-lists.md
## 배열의 항목들을 필터링하기 {/*filtering-arrays-of-items*/}
=======
Notice the sandbox above displays a console error:

<ConsoleBlock level="error">

Warning: Each child in a list should have a unique "key" prop.

</ConsoleBlock>

You'll learn how to fix this error later on this page. Before we get to that, let's add some structure to your data.

## Filtering arrays of items {/*filtering-arrays-of-items*/}
>>>>>>> e21b37c8cc8b4e308015ea87659f13aa26bd6356:beta/src/content/learn/rendering-lists.md

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

직업이 `’chemist’`인 사람들만 보여주고 싶다고 생각해봅시다. 해당하는 사람들만 반환하기 위해 JavaScript의 `filter()` 메서드를 사용할 수 있습니다. 이 메서드는 배열을 가져와서 “test” (`true`나 `false`를 반환하는 함수)로 항목을 넘겨주고 test에 통과된 항목(`true`가 반환된 항목)만 있는 새로운 배열을 반환합니다.

`직업`이 `’chemist’`인 항목만 필요합니다. 이를 위한 “test” 함수는 `(person) => person.profession === 'chemist'`와 같을 것입니다.  이것을 적용하는 과정은 다음과 같습니다.

1. `people`에서 `filter()`를 호출해 `person.profession === 'chemist'`로 필터링해서 “chemist”인 사람만 있는 새로운 배열 `chemists`를 **생성**합니다.

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

```js App.js
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

```js data.js
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

```js utils.js
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

화살표 함수는 `=>` 바로 뒤에 오는 표현 식을 암시적으로 반환하기 때문에 `return` 구문이 필요하지 않습니다.

```js
const listItems = chemists.map(person =>
  <li>...</li> // 암시적 반환!
);
```

하지만 **`=>` 뒤에 `{` 중괄호가 이어진다면 외부적으로 `return`을 명시적으로 써야 합니다!**

```js
const listItems = chemists.map(person => { // 중괄호
  return <li>...</li>;
});
```

<<<<<<< HEAD:beta/src/pages/learn/rendering-lists.md
`=> {` 를 표현하는 화살표 함수를 ["block body"](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#function_body)를 가지고 있다고 말합니다. 이것은 코드를 여러 줄로 작성할 수 있게 해주지만 `return` 구문을 *반드시* 작성해야 합니다. 그렇지 않으면 아무것도 반환되지 않습니다!
=======
Arrow functions containing `=> {` are said to have a ["block body".](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#function_body) They let you write more than a single line of code, but you *have to* write a `return` statement yourself. If you forget it, nothing gets returned!
>>>>>>> e21b37c8cc8b4e308015ea87659f13aa26bd6356:beta/src/content/learn/rendering-lists.md

</Pitfall>

## `key`를 사용해서 리스트 항목을 순서대로 유지하기 {/*keeping-list-items-in-order-with-key*/}

<<<<<<< HEAD:beta/src/pages/learn/rendering-lists.md
위의 샌드박스 중 하나를 새 탭에서 열면 콘솔에서 다음과 같은 에러를 볼 수 있습니다.
=======
Notice that all the sandboxes above show an error in the console:
>>>>>>> e21b37c8cc8b4e308015ea87659f13aa26bd6356:beta/src/content/learn/rendering-lists.md

<ConsoleBlock level="error">

Warning: Each child in a list should have a unique "key" prop.

</ConsoleBlock>

배열의 다른 항목 간에 고유하게 식별되는 문자열이나 숫자 형태의 `key`를 각 배열 항목에 주어야 합니다.

```js
<li key={person.id}>...</li>
```

<Note>

JSX elements directly inside a `map()` call always need keys!

</Note>

Key는 각 컴포넌트가 어떤 배열 항목에 해당하는지 알려주어 React가 나중에 그것들을 일치시킬 수 있도록 해줍니다. 이것은 예를 들어 정렬로 인해 배열 항목이 이동, 삽입 또는 삭제되는 경우 중요한 문제가 됩니다. 잘 선택된 `key`는 React가 정확히 무슨 일이 일어났는지 유추해서 DOM 트리에 적절하게 반영할 수 있도록 도와줍니다.

즉석에서 key를 생성하는 대신 데이터 안에 key를 포함해야 합니다.

<Sandpack>

```js App.js
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

```js data.js active
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

```js utils.js
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

<DeepDive title="각 리스트 항목에 대해 여러 개의 DOM 노드 표시하기">

각 항목이 하나가 아닌 여러 개의 DOM 노드들에 렌더링해야 하는 경우에는 어떻게 해야 할까요?

<<<<<<< HEAD:beta/src/pages/learn/rendering-lists.md
짧은 `<> </>` fragment 문법은 key를 전달할 수 없기 때문에 그것들을 단일한 `<div>`로 그룹화하거나 약간 더 길고 명시적인 `<Fragment>` 문법을 사용해야 합니다.
=======
The short [`<>...</>` Fragment](/apis/react/Fragment) syntax won't let you pass a key, so you need to either group them into a single `<div>`, or use the slightly longer and [more explicit `<Fragment>` syntax:](/apis/react/Fragment#rendering-a-list-of-fragments)
>>>>>>> e21b37c8cc8b4e308015ea87659f13aa26bd6356:beta/src/content/learn/rendering-lists.md

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

Fragments는 DOM에서 사라지므로 `<h1>`, `<p>`, `<h1>`, `<p>` 등의 평평한 리스트가 생성됩니다.

</DeepDive>

### `key`를 어디에서 가져올까요? {/*where-to-get-your-key*/}

다양한 데이터 소스가 다양한 key 소스를 제공합니다

* **데이터베이스의 데이터:** : 데이터베이스에서 데이터를 가져오는 경우 본질적으로 고유한 데이터베이스의 key 및 ID를 사용할 수 있습니다.
* **로컬에서 생성된 데이터:** 노트작성 앱의 노트처럼 데이터가 로컬에서 생성되고 유지되는 경우에는 항목을 생성할 때 증가하는 일련번호나 [`crypto.randomUUID()`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID) 또는 [`uuid`](https://www.npmjs.com/package/uuid) 같은 패키지를 사용해야 합니다.

### key 규칙 {/*rules-of-keys*/}

* **key는 형제간에 유일해야 합니다.** 하지만 같은 key를 _다른_ 배열에 있는 JSX 노드가 사용하는 것은 괜찮습니다.
* **key는 바뀔 수 없으며** 그렇게 되면 key는 목적을 잃게 됩니다. 렌더링 중에는 key를 생성하지 마십시오.

### React에 key가 왜 필요할까요? {/*why-does-react-need-keys*/}

데스크탑에 있는 파일에 이름이 없다고 상상해 봅시다. 대신 첫 번째 파일, 두 번째 파일 등의 순서로 그것들을 참조하는 겁니다. 익숙해질 수도 있지만, 파일을 삭제한다면 혼란스러워질 것입니다. 두 번째 파일은 첫 번째 파일이 될 것이고 세 번째 파일은 두 번째 파일이 되는 식입니다.

폴더에 있는 파일명과 배열의 JSX key는 비슷한 용도로 사용됩니다. 이를 통해 형제간 항목들을 고유하게 식별할 수 있습니다. 잘 선택된 key는 배열 내 위치보다 더 많은 정보를 제공합니다. 재 정렬로 _위치_가 변경되어도 `key`는 React가 항목의 생명주기 동안 해당 항목을 식별할 수 있게 해줍니다.

<Pitfall>

배열에서 항목의 인덱스를 key로 사용하고 싶을 것입니다. 실제로 `key`를 지정하지 않는 경우 React는 인덱스를 사용합니다. 하지만 항목을 삽입, 삭제하거나 배열이 재 정렬될 경우 항목을 렌더링하는 순서는 시간의 흐름에 따라 변경될 것입니다. 인덱스를 key로 사용하면 종종 미묘하고 혼란스러운 버그가 발생합니다.

마찬가지로 `key={Math.random()}`처럼 즉석에서 key를 생성하지 마십시오. 이러한 방식은 렌더링 사이에서 key가 일치하지 않게 되어 모든 컴포넌트와 DOM이 매번 재생성됩니다. 이것은 느릴 뿐만 아니라 리스트 항목 내부의 모든 사용자의 입력을 누락시킵니다. 대신 데이터 기반의 안정적인 ID를 사용하세요.

컴포넌트가 `key`를 prop로 받지 않는다는 것에 유의하세요. key는 React 자체에서 힌트로만 사용됩니다. 컴포넌트에 ID가 필요하다면 `<Profile key={id} userId={id} />`와 같이 별도의 prop로 전달해야 합니다.

</Pitfall>

<Recap>

이 페이지에서 학습한 내용

* 컴포넌트에서 배열 및 객체와 같은 데이터 구조로 데이터를 이동하는 방법
* JavaScript의 `map()`을 사용하여 유사한 컴포넌트 집합을 생성하는 방법
* JavaScript의 `filter()`를 사용하여 필터링 된 항목의 배열을 생성하는 방법
* 컬렉션에서 각 컴포넌트에 `key`를 설정하여 위치나 데이터가 변경되더라도 React가 각 컴포넌트를 추적할 수 있도록 하는 이유 및 방법

</Recap>



<Challenges>

<<<<<<< HEAD:beta/src/pages/learn/rendering-lists.md
### 리스트를 둘로 나누기 {/*splitting-a-list-in-two*/}
=======
#### Splitting a list in two {/*splitting-a-list-in-two*/}
>>>>>>> e21b37c8cc8b4e308015ea87659f13aa26bd6356:beta/src/content/learn/rendering-lists.md

예시는 모든 사람의 리스트를 보여줍니다.

<<<<<<< HEAD:beta/src/pages/learn/rendering-lists.md
두 개의 개별 리스트 **Chemists**와 **Everyone Else**을 차례로 표시하도록 변경하세요. 이전과 마찬가지로 `person.profession === 'chemist'`를 확인하여 누가 chemist인지 여부를 확인할 수 있습니다.
=======
Change it to show two separate lists one after another: **Chemists** and **Everyone Else.** Like previously, you can determine whether a person is a chemist by checking if `person.profession === 'chemist'`.
>>>>>>> e21b37c8cc8b4e308015ea87659f13aa26bd6356:beta/src/content/learn/rendering-lists.md

<Sandpack>

```js App.js
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

```js data.js
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

```js utils.js
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

`filter()`를 두 번 사용해서 두 개의 분리된 배열을 만든 다음 두 배열을 `매핑`할 수 있습니다.

<Sandpack>

```js App.js
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

```js data.js
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

```js utils.js
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

이 솔루션에서 `map` 호출은 부모 `<ul>` 엘리먼트 안에 인라인으로 배치되지만, 가독성을 위해 변수를 도입할 수 있습니다.

여전히 렌더링 된 리스트 간에 약간의 중복이 있습니다. 더 나아가 반복적인 부분을 `<ListSection>` 컴포넌트로 추출할 수 있습니다.

<Sandpack>

```js App.js
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

```js data.js
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

```js utils.js
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

주의 깊은 독자는 두 번의 `filter` 호출로 각 사람의 직업을 두 번씩 확인하고 있다는 것을 알아차렸을 것입니다. 속성을 확인하는 속도가 매우 빠르기 때문에 이 예제에서는 문제가 없습니다. 하지만 논리가 더 복잡하다면 수동적으로 배열을 구성하고 각 사람을 한 번씩만 확인하는 반복문으로 `filter` 호출을 대체할 수 있습니다.

`people`이 절대 변하지 않는다면 이 코드를 컴포넌트 외부로 이동할 수 있습니다. React의 관점에서 볼 때 마지막에 JSX 노드 배열을 제공하는 것이 가장 중요합니다. 해당 배열을 생성하는 방법은 중요하지 않습니다.

<Sandpack>

```js App.js
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

```js data.js
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

```js utils.js
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

<<<<<<< HEAD:beta/src/pages/learn/rendering-lists.md
### 하나의 컴포넌트 안에서 중첩된 리스트 {/*nested-lists-in-one-component*/}
=======
#### Nested lists in one component {/*nested-lists-in-one-component*/}
>>>>>>> e21b37c8cc8b4e308015ea87659f13aa26bd6356:beta/src/content/learn/rendering-lists.md

이 배열에서 레시피 리스트를 만들어봅시다! 배열의 각 레시피에 대해 `<h2>`에 제목을 보여주고 `<ul>`에 재료를 나열해보겠습니다.

<Hint>

이를 위해 두 개의 서로 다른 `map` 호출을 중첩해야 합니다.

</Hint>

<Sandpack>

```js App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
    </div>
  );
}
```

```js data.js
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

다음은 이것을 위한 한 가지 방법입니다.

<Sandpack>

```js App.js
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

```js data.js
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

각각의 `recipes`는 이미 `id` 필드를 포함하므로 외부 반복문은 그것을 `key`로 사용합니다. 재료들을 순회할 때 사용할 수 있는 ID는 없습니다. 하지만 동일한 레시피에서 동일한 재료가 두 번씩 나열되지 않을 것이라고 충분히 가정할 수 있기 때문에 재료의 이름을 `key`로 사용할 수 있습니다. 다른 방법으로는 ID를 추가하기 위해 데이터 구조를 바꾸거나 혹은 인덱스(재료를 안전하게 재배열할 수 없지만)를 `key`로 사용할 수 있습니다.

</Solution>

<<<<<<< HEAD:beta/src/pages/learn/rendering-lists.md
### 리스트 항목 컴포넌트 추출하기 {/*extracting-a-list-item-component*/}
=======
#### Extracting a list item component {/*extracting-a-list-item-component*/}
>>>>>>> e21b37c8cc8b4e308015ea87659f13aa26bd6356:beta/src/content/learn/rendering-lists.md

`RecipeList` 컴포넌트에는 두 개의 중첩된 `map` 호출이 있습니다. 이것을 단순화하기 위해 `id`, `name`, and `ingredients` props를 사용할 수 있는 `Recipe` 컴포넌트를 추출합니다. 외부 `key`를 어디에 위치시켜야 하며 이유는 무엇일까요?

<Sandpack>

```js App.js
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

```js data.js
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

외부 `map`에서 새 `Recipe` 컴포넌트로 JSX를 복사하여 붙여넣고 해당 JSX를 반환할 수 있습니다. 그런 다음 `recipe.name`을 `name`으로, `recipe.id`를 `id`로 바꾸는 등의 변경을 할 수 있으며 이것들을 `Recipe`에 props로 전달해줄 수 있습니다.

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

```js data.js
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

여기서 `<Recipe {...recipe} key={recipe.id} />`는 “`recipe` 객체의 모든 속성을 props로 `Recipe` 컴포넌트로 전달”하는 손쉬운 문법입니다. `<Recipe id={recipe.id} name={recipe.name} ingredients={recipe.ingredients} key={recipe.id} />` 처럼 각 prop를 명시적으로 작성할 수도 있습니다.

**`key`는 `Recipe`에서 반환된 루트 `<div>`가 아니라 `<Recipe>` 자체에 지정되어있음에 유의하세요.** 주변 배열의 context 내에서 `key`가 직접적으로 필요하기 때문입니다. 이전에는 배열에 `<div>` 태그가 있어서 각각에 대해 `key`가 필요했지만, 지금은 `<Recipe>` 배열이 있습니다. 즉, 컴포넌트를 추출할 때 복사 붙여넣기 한 JSX 외부에 `key`를 위치시켜야 한다는 것을 잊지 마세요.

</Solution>

<<<<<<< HEAD:beta/src/pages/learn/rendering-lists.md
### 구분 기호가 있는 리스트 {/*list-with-a-separator*/}
=======
#### List with a separator {/*list-with-a-separator*/}
>>>>>>> e21b37c8cc8b4e308015ea87659f13aa26bd6356:beta/src/content/learn/rendering-lists.md

예시는 Katsushika Hokusai의 유명한 하이쿠(일본의 정형시)를 렌더링하며 각 행은 `<p>` 태그로 래핑되어 있습니다. 각 단락 사이에 `<hr />` 구분 기호를 삽입하세요. 결과 구조는 다음과 같아야 합니다.

```js
<article>
  <p>I write, erase, rewrite</p>
  <hr />
  <p>Erase again, and then</p>
  <hr />
  <p>A poppy blooms.</p>
</article>
```

하이쿠는 세 줄만 포함하지만 솔루션 코드는 여러 줄에서 동작해야 합니다. `<hr />` 엘리먼트는 시작이나 끝이 아닌 `<p>` 엘리먼트 *사이*에서만 보인다는 점을 유의하세요!

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

(시의 행은 절대 재 정렬되지 않기 때문에 인덱스를 key로 사용할 수 있는 드문 케이스입니다.)

<Hint>

`map`을 반복문으로 변환하거나 fragment를 사용해야 합니다.

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

<<<<<<< HEAD:beta/src/pages/learn/rendering-lists.md
또는 `<hr />` 과 `<p>...</p>` 를 포함한 fragments 모음을 렌더링할 수 있습니다. 하지만 `<> </>` 이렇게 쓰는 손쉬운 문법은 key를 전달해주지 않기 때문에 `<Fragment>` 를 명시적으로 작성해야 합니다.
=======
Alternatively, you could render a collection of fragments which contain `<hr />` and `<p>...</p>`. However, the `<>...</>` shorthand syntax doesn't support passing keys, so you'd have to write `<Fragment>` explicitly:
>>>>>>> e21b37c8cc8b4e308015ea87659f13aa26bd6356:beta/src/content/learn/rendering-lists.md

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

종종 `<> </>` 이렇게 쓰이는 fragments는 부가적인 `<div>`를 추가하지 않고도 JSX 노드를 그룹화할 수 있다는 것을 기억하세요!

</Solution>

</Challenges>
