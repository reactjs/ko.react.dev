---
title: UI 표현하기
---

<Intro>

React는 사용자 인터페이스(UI)를 렌더링하기 위한 JavaScript 라이브러리입니다. UI는 버튼, 텍스트, 이미지와 같은 작은 요소로 구성됩니다. React를 통해 작은 요소들을 재사용 가능하고 중첩할 수 있는 *컴포넌트*로 조합할 수 있습니다. 웹 사이트에서 휴대전화 앱에 이르기까지 화면에 있는 모든 것을 컴포넌트로 나눌 수 있습니다. 이 장에서는 React 컴포넌트를 만들고, 사용자화하며, 조건부로 표시하는 방법에 대해서 알아봅시다.

</Intro>

<YouWillLearn isChapter={true}>

* [첫 React 컴포넌트를 작성하는 방법](/learn/your-first-component)
* [다중 컴포넌트 파일을 만드는 경우와 방법](/learn/importing-and-exporting-components)
* [JSX로 JavaScript에 마크업을 추가하는 방법](/learn/writing-markup-with-jsx)
* [컴포넌트에서 JavaScript 기능을 이용하기 위해 JSX에 중괄호를 사용하는 방법](/learn/javascript-in-jsx-with-curly-braces)
* [Props를 사용하여 컴포넌트를 구성하는 방법](/learn/passing-props-to-a-component)
* [조건부 렌더링을 하는 방법](/learn/conditional-rendering)
* [여러 개의 컴포넌트를 한 번에 렌더링하는 방법](/learn/rendering-lists)
* [컴포넌트를 순수하게 유지하여 혼란스러운 버그를 피하는 방법](/learn/keeping-components-pure)

</YouWillLearn>

## 첫 컴포넌트 {/*your-first-component*/}

React 애플리케이션은 *컴포넌트*라고 불리는 독립된 UI 조각들로 이루어집니다. React 컴포넌트는 마크업을 얹을 수 있는 JavaScript 함수입니다. 컴포넌트는 버튼과 같이 작을 수도 있고 전체 페이지와 같이 큰 경우도 있습니다. 다음의 `Gallery` 컴포넌트는 세 개의 `Profile` 컴포넌트를 렌더링하고 있습니다.

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="Katherine Johnson"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

<LearnMore path="/learn/your-first-component">

React 컴포넌트를 선언하고 사용하는 방법을 배우려면 **[첫 컴포넌트](/learn/your-first-component)** 를 읽어보세요.

</LearnMore>

## 컴포넌트 Import 및 Export 하기 {/*importing-and-exporting-components*/}

하나의 파일에 많은 컴포넌트를 선언할 수 있지만, 파일이 커지면 탐색하기 어려워집니다. 이를 해결하기 위해 컴포넌트를 별도의 파일로 만들어 *export*하고 다른 파일에서 해당 컴포넌트를 *import*할 수 있습니다.

<Sandpack>

```js App.js hidden
import Gallery from './Gallery.js';

export default function App() {
  return (
    <Gallery />
  );
}
```

```js Gallery.js active
import Profile from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js Profile.js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>

<LearnMore path="/learn/importing-and-exporting-components">

컴포넌트를 개별 파일로 분리하는 방법을 배우려면 **[컴포넌트 Import 및 Export 하기](/learn/importing-and-exporting-components)** 를 읽어보세요.

</LearnMore>

## JSX로 마크업 작성하기 {/*writing-markup-with-jsx*/}

React 컴포넌트는 React가 브라우저에 렌더링하는 마크업을 포함할 수 있는 JavaScript 함수입니다. React 컴포넌트는 그 마크업을 표현하기 위해 JSX라는 확장된 문법을 사용합니다. JSX는 HTML과 매우 유사하지만 조금 더 엄격하며 동적인 정보를 표시할 수 있습니다.

기존의 HTML 마크업을 React 컴포넌트에 그대로 붙여넣으면 동작하지 않을 수도 있습니다.

<Sandpack>

```js
export default function TodoList() {
  return (
    // This doesn't quite work!
    <h1>Hedy Lamarr's Todos</h1>
    <img
      src="https://i.imgur.com/yXOvdOSs.jpg"
      alt="Hedy Lamarr"
      class="photo"
    >
    <ul>
      <li>Invent new traffic lights
      <li>Rehearse a movie scene
      <li>Improve spectrum technology
    </ul>
  );
}
```

```css
img { height: 90px; }
```

</Sandpack>

만약 이미 만들어진 HTML 마크업이 있다면 [converter](https://transform.tools/html-to-jsx)를 사용하여 변환할 수 있습니다.

<Sandpack>

```js
export default function TodoList() {
  return (
    <>
      <h1>Hedy Lamarr's Todos</h1>
      <img
        src="https://i.imgur.com/yXOvdOSs.jpg"
        alt="Hedy Lamarr"
        className="photo"
      />
      <ul>
        <li>Invent new traffic lights</li>
        <li>Rehearse a movie scene</li>
        <li>Improve spectrum technology</li>
      </ul>
    </>
  );
}
```

```css
img { height: 90px; }
```

</Sandpack>

<LearnMore path="/learn/writing-markup-with-jsx">

올바르게 JSX를 작성하는 방법을 배우려면 **[JSX로 마크업 작성하기](/learn/writing-markup-with-jsx)** 를 읽어보세요.

</LearnMore>

## JSX에서 중괄호를 이용하여 JavaScript 사용하기 {/*javascript-in-jsx-with-curly-braces*/}

JSX를 사용하면 JavaScript 파일에 HTML과 비슷한 마크업을 작성할 수 있어 렌더링 로직과 콘텐츠를 같은 곳에 둘 수 있습니다. 때로는 그 마크업 내부에 JavaScript 로직을 추가하거나 동적인 프로퍼티를 참조해야 하는 경우가 있습니다. 그럴 때 JSX에서 중괄호를 사용하여 JavaScript와 연결된 "창문을 열 수" 있습니다.

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

<LearnMore path="/learn/javascript-in-jsx-with-curly-braces">

JSX에서 중괄호를 사용하여 JavaScript 데이터에 접근하는 방법을 배우려면 **[JSX에서 중괄호를 이용하여 JavaScript 사용하기](/learn/javascript-in-jsx-with-curly-braces)** 를 읽어보세요.

</LearnMore>

## 컴포넌트에 Props 전달하기 {/*passing-props-to-a-component*/}

React 컴포넌트는 서로 통신하기 위해 *props*를 사용합니다. 모든 부모 컴포넌트는 자식 컴포넌트에 props를 제공하여 정보를 전달할 수 있습니다. Props는 HTML 어트리뷰트와 유사해 보이지만 객체, 배열, 함수를 포함한 모든 JavaScript 값이 전달될 수 있습니다. 심지어 JSX도 가능합니다!

<Sandpack>

```js
import { getImageUrl } from './utils.js'

export default function Profile() {
  return (
    <Card>
      <Avatar
        size={100}
        person={{
          name: 'Katsuko Saruhashi',
          imageId: 'YfeOqp2'
        }}
      />
    </Card>
  );
}

function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

```

```js utils.js
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
.card {
  width: fit-content;
  margin: 5px;
  padding: 5px;
  font-size: 20px;
  text-align: center;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.avatar {
  margin: 20px;
  border-radius: 50%;
}
```

</Sandpack>

<LearnMore path="/learn/passing-props-to-a-component">

Props를 전달하고 활용하는 방법을 배우려면 **[컴포넌트에 Props 전달하기](/learn/passing-props-to-a-component)** 를 읽어보세요.

</LearnMore>

## 조건부 렌더링 {/*conditional-rendering*/}

컴포넌트는 조건에 따라 다른 항목을 표시해야 하는 경우가 많습니다. React는 `if` 문, `&&` 및 `? :` 연산자와 같은 자바스크립트 문법을 사용하여 JSX를 조건부로 렌더링할 수 있습니다.

이 예제에서는 JavaScript `&&` 연산자를 사용하여 체크 표시를 조건부로 렌더링합니다.

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✔'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item
          isPacked={true}
          name="Space suit"
        />
        <Item
          isPacked={true}
          name="Helmet with a golden leaf"
        />
        <Item
          isPacked={false}
          name="Photo of Tam"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<LearnMore path="/learn/conditional-rendering">

**[조건부 렌더링](/learn/conditional-rendering)** 을 통해 콘텐츠를 조건부로 렌더링하는 다양한 방법을 배울 수 있습니다.

</LearnMore>

## 리스트 렌더링 {/*rendering-lists*/}

데이터 모음으로부터 유사한 컴포넌트를 여러 개 표시하고 싶을 때가 종종 있습니다. React와 JavaScript의 `filter()`와 `map()`을 함께 사용하면 데이터 배열을 필터링하고 컴포넌트 배열로 변환할 수 있습니다.

각 배열 항목마다 `key`를 지정해야 합니다. 일반적으로 데이터베이스에서 가져온 ID를 `key`로 사용하게 될 것입니다. Key를 사용하면 리스트가 변경되더라도 React가 각 항목의 위치를 추적할 수 있습니다.

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
  grid-template-columns: 1fr 1fr;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
h1 { font-size: 22px; }
h2 { font-size: 20px; }
```

</Sandpack>

<LearnMore path="/learn/rendering-lists">

컴포넌트 목록을 렌더링하는 방법과 어떻게 key를 선택하는지에 대해 배우려면 **[리스트 렌더링](/learn/rendering-lists)** 을 읽어보세요.

</LearnMore>

## 컴포넌트 순수하게 유지하기 {/*keeping-components-pure*/}

어떤 JavaScript 함수는 *순수*합니다. 순수 함수는 다음과 같은 특징이 있습니다.

* **자신의 일만 처리합니다.** 호출되기 전에 존재했던 어떤 객체나 변수도 변경하지 않습니다.
* **입력이 같으면 출력도 같습니다.** 순수 함수는 같은 입력을 받으면 언제나 같은 결과를 반환해야 합니다.

컴포넌트를 엄격하게 순수 함수로만 작성하면 코드 베이스가 커져도 이해하기 어려운 버그와 예측할 수 없는 동작을 피할 수 있습니다. 다음은 순수하지 않은 컴포넌트의 예시입니다.

<Sandpack>

```js
let guest = 0;

function Cup() {
  // Bad: changing a preexisting variable!
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

기존 변수를 수정하는 대신 prop을 전달하여 컴포넌트를 순수하게 만들 수 있습니다.

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

<LearnMore path="/learn/keeping-components-pure">

컴포넌트를 순수하고 예측 가능한 함수로 작성하는 방법을 배우려면 **[컴포넌트 순수하게 유지하기](/learn/keeping-components-pure)** 를 읽어보세요.

</LearnMore>

## What's next? {/*whats-next*/}

[첫 컴포넌트](/learn/your-first-component) 페이지로 이동하여 이 장을 페이지별로 읽어보세요!

이미 이러한 주제에 대해 알고 있다면 [상호작용 추가하기](/learn/adding-interactivity)를 읽어보는 것은 어떨까요?
