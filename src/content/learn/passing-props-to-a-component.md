---
title: 컴포넌트에 props 전달하기
---

<Intro>

React 컴포넌트는 props를 이용해 서로 통신합니다. 모든 부모 컴포넌트는 props를 줌으로써 몇몇의 정보를 자식 컴포넌트에게 전달할 수 있습니다. props는 HTML 어트리뷰트를 생각나게 할 수도 있지만, 객체, 배열, 함수를 포함한 모든 JavaScript 값을 전달할 수 있습니다.

</Intro>

<YouWillLearn>

* 컴포넌트에 props를 전달하는 방법
* 컴포넌트에서 props를 읽는 방법
* props의 기본값을 지정하는 방법
* 컴포넌트에 JSX를 전달하는 방법
* 시간에 따라 props가 변하는 방식

</YouWillLearn>

## 친숙한 props {/*familiar-props*/}

props는 JSX 태그에 전달하는 정보입니다. 예를 들어, `className`, `src`, `alt`, `width`, `height`는 `<img>` 태그에 전달할 수 있습니다.

<Sandpack>

```js
function Avatar() {
  return (
    <img
      className="avatar"
      src="https://i.imgur.com/1bX5QH6.jpg"
      alt="Lin Lanying"
      width={100}
      height={100}
    />
  );
}

export default function Profile() {
  return (
    <Avatar />
  );
}
```

```css
body { min-height: 120px; }
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

`<img>` 태그에 전달할 수 있는 props는 미리 정의되어 있습니다. (ReactDOM은 [HTML 표준](https://www.w3.org/TR/html52/semantics-embedded-content.html#the-img-element)을 준수합니다.) 자신이 생성한 `<Avatar>`와 같은 어떤 컴포넌트든 props를 전달할 수 있습니다. 방법은 다음과 같습니다.

## 컴포넌트에 props 전달하기 {/*passing-props-to-a-component*/}

아래 코드에서 `Profile` 컴포넌트는 자식 컴포넌트인 `Avatar`에 어떠한 props도 전달하지 않습니다.

```js
export default function Profile() {
  return (
    <Avatar />
  );
}
```

다음 두 단계에 걸쳐 `Avatar`에 props를 전달할 수 있습니다.

### 1단계: 자식 컴포넌트에 props 전달하기 {/*step-1-pass-props-to-the-child-component*/}

먼저, `Avatar`에 몇몇 props를 전달합니다. 예를 들어 `person` (객체)와 `size` (숫자)를 전달해 보겠습니다.

```js
export default function Profile() {
  return (
    <Avatar
      person={{ name: 'Lin Lanying', imageId: '1bX5QH6' }}
      size={100}
    />
  );
}
```

<Note>

`person=` 뒤에 있는 이중 괄호가 혼란스럽다면, [JSX 중괄호 안의 객체](/learn/javascript-in-jsx-with-curly-braces#using-double-curlies-css-and-other-objects-in-jsx)라고 기억하시면 됩니다.

</Note>

이제 `Avatar` 컴포넌트 내 props를 읽을 수 있습니다.

### 2단계: 자식 컴포넌트 내부에서 props 읽기 {/*step-2-read-props-inside-the-child-component*/}

이러한 props는 `function Avatar` 바로 뒤에 있는 `({`와 `})` 안에 그들의 이름인 `person, size` 등을 쉼표로 구분함으로써 읽을 수 있습니다. 이렇게 하면 `Avatar` 코드 내에서 변수를 사용하는 것처럼 사용할 수 있습니다.

```js
function Avatar({ person, size }) {
  // person과 size는 이곳에서 사용가능합니다.
}
```

`Avatar`에 렌더링을 위해 `person` 과 `size` props를 사용하는 로직을 추가하면 완료됩니다.

이제 `Avatar`를 다른 props를 이용해 다양한 방식으로 렌더링하도록 구성할 수 있습니다. 값을 조정해 보세요!

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

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

export default function Profile() {
  return (
    <div>
      <Avatar
        size={100}
        person={{ 
          name: 'Katsuko Saruhashi', 
          imageId: 'YfeOqp2'
        }}
      />
      <Avatar
        size={80}
        person={{
          name: 'Aklilu Lemma', 
          imageId: 'OKS67lh'
        }}
      />
      <Avatar
        size={50}
        person={{ 
          name: 'Lin Lanying',
          imageId: '1bX5QH6'
        }}
      />
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
body { min-height: 120px; }
.avatar { margin: 10px; border-radius: 50%; }
```

</Sandpack>

props를 사용하면 부모 컴포넌트와 자식 컴포넌트를 독립적으로 생각할 수 있습니다. 예를 들어, `Avatar` 가 props를 어떻게 사용하는지 생각할 필요 없이  `Profile`의 `person` 또는 `size` props를 수정할 수 있습니다. 마찬가지로 `Profile`을 보지 않고도 `Avatar`가 props를 사용하는 방식을 바꿀 수 있습니다.

props는 조절할 수 있는 손잡이라고 생각하면 됩니다. props는 함수의 인수와 동일한 역할을 합니다. 사실 props는 컴포넌트에 대한 유일한 인자입니다! React 컴포넌트 함수는 하나의 인자, 즉 `props` 객체를 받습니다.

```js
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}
```

보통은 전체 props 자체를 필요로 하지는 않기에, 개별 props로 구조 분해 합니다.

<Pitfall>

props를 선언할 때 `(` 및 `)` 안에  **`{` 및 `}` 쌍을 놓치지 마세요**

```js
function Avatar({ person, size }) {
  // ...
}
```

이 문법을 [“구조 분해 할당”](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Unpacking_fields_from_objects_passed_as_a_function_parameter)이라고 부르며 함수 매개 변수의 속성과 동등합니다.

```js
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}
```

</Pitfall>

## prop의 기본값 지정하기 {/*specifying-a-default-value-for-a-prop*/}

값이 지정되지 않았을 때, prop에 기본값을 주길 원한다면, 변수 바로 뒤에 `=` 과 함께 기본값을 넣어 구조 분해 할당을 해줄 수 있습니다.

```js
function Avatar({ person, size = 100 }) {
  // ...
}
```

이제 `<Avatar person={...} />`가 `size` prop이 없이 렌더링 된다면, `size`는 `100`으로 설정됩니다.

이 [기본값](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Functions/Default_parameters)은 size prop이 없거나 `size={undefined}`로 전달될 때 사용됩니다. 그러나 `size={null}`  또는 `size={0}`으로 전달된다면, 기본값은 사용되지 **않습니다**.

## JSX 전개 문법으로 props 전달하기 {/*forwarding-props-with-the-jsx-spread-syntax*/}

때때로 전달되는 props는 반복적입니다.

```js
function Profile({ person, size, isSepia, thickBorder }) {
  return (
    <div className="card">
      <Avatar
        person={person}
        size={size}
        isSepia={isSepia}
        thickBorder={thickBorder}
      />
    </div>
  );
}
```

반복적인 코드는 가독성을 높일 수 있다는 점에서 잘못된 것은 아닙니다. 하지만 때로는 간결함이 중요할 때도 있습니다. `Profile`이 `Avatar`에서 하는 것처럼, 일부 컴포넌트는 그들의 모든 props를 자식 컴포넌트에 전달합니다. 
props를 직접 사용하지 않기 때문에 보다 간결한 "전개" 문법을 사용하는 것이 합리적일 수 있습니다.


```js
function Profile(props) {
  return (
    <div className="card">
      <Avatar {...props} />
    </div>
  );
}
```

이렇게 하면 `Profile`의 모든 props를 각각의 이름을 나열하지 않고 `Avatar`로 전달합니다.

**전개 문법은 제한적으로 사용하세요**. 다른 모든 컴포넌트에 이 구문을 사용한다면 문제가 있는 것입니다. 이는 종종 컴포넌트들을 분할하여 자식을 JSX로 전달해야 함을 나타냅니다. 더 자세히 알아봅시다!

## 자식을 JSX로 전달하기 {/*passing-jsx-as-children*/}

내장된 브라우저 태그는 중첩하는 것이 일반적입니다.

```js
<div>
  <img />
</div>
```

때로는 같은 방식으로 자체 컴포넌트를 중첩하고 싶을 때가 있습니다.


```js
<Card>
  <Avatar />
</Card>
```

JSX 태그 내에 콘텐츠를 중첩하면, 부모 컴포넌트는 해당 콘텐츠를 `children`이라는 prop으로 받을 것입니다. 예를 들어, 아래의 `Card` 컴포넌트는 `<Avatar />`로 설정된 `children` prop을 받아 이를 래퍼 div에 렌더링 할 것입니다.

<Sandpack>

```js App.js
import Avatar from './Avatar.js';

function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

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
```

```js Avatar.js
import { getImageUrl } from './utils.js';

export default function Avatar({ person, size }) {
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

`<Card>` 내부의 `<Avatar>`를 텍스트로 바꾸어 `<Card>` 컴포넌트가 중첩된 콘텐츠를 어떻게 감싸는지 확인해 보세요. 그 내부에서 무엇이 렌더링 되는지 “알” 필요는 없습니다. 이 유연한 패턴은 많은 곳에서 볼 수 있습니다.

`children` prop을 가지고 있는 컴포넌트는 부모 컴포넌트가 임의의 JSX로 “채울” 수 있는 “구멍”이 있는 것으로 생각할 수 있습니다. 패널, 그리드 등의 시각적 래퍼에 종종 `children` prop를 사용합니다.

<Illustration src="/images/docs/illustrations/i_children-prop.png" alt='A puzzle-like Card tile with a slot for "children" pieces like text and Avatar' />

## 시간에 따라 props가 변하는 방식 {/*how-props-change-over-time*/}

아래의 `Clock` 컴포넌트는 부모 컴포넌트로부터 `color`와 `time`이라는 두 가지 props를 받습니다. (부모 컴포넌트의 코드는 아직 자세히 다루지 않을 [state](/learn/state-a-components-memory)를 사용하기 때문에 생략합니다.)


아래 select box의 색상을 바꿔보세요.

<Sandpack>

```js Clock.js active
export default function Clock({ color, time }) {
  return (
    <h1 style={{ color: color }}>
      {time}
    </h1>
  );
}
```

```js App.js hidden
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
  const [color, setColor] = useState('lightcoral');
  return (
    <div>
      <p>
        Pick a color:{' '}
        <select value={color} onChange={e => setColor(e.target.value)}>
          <option value="lightcoral">lightcoral</option>
          <option value="midnightblue">midnightblue</option>
          <option value="rebeccapurple">rebeccapurple</option>
        </select>
      </p>
      <Clock color={color} time={time.toLocaleTimeString()} />
    </div>
  );
}
```

</Sandpack>

이 예시는 **컴포넌트가 시간에 따라 다른 props를 받을 수 있음을 보여줍니다.** Props는 항상 고정되어 있지 않습니다! 여기서 `time` prop은 매초 변경되고, `color` prop은 다른 색상을 선택하면 변경됩니다. Props는 컴포넌트의 데이터를 처음에만 반영하는 것이 아니라 모든 시점에 반영합니다.

그러나 props는 컴퓨터 과학에서 "변경할 수 없다"라는 의미의 [불변성](https://en.wikipedia.org/wiki/Immutable_object)을 가지고 있습니다. 컴포넌트가 props를 변경해야 하는 경우(예: 사용자의 상호작용이나 새로운 데이터에 대한 응답), 부모 컴포넌트에 *다른 props*, 즉 새로운 객체를 전달하도록 "요청"해야 합니다! 그러면 이전의 props는 버려지고, 결국 자바스크립트 엔진은 기존 props가 차지했던 메모리를 회수하게 됩니다.


**“props 변경”을 시도하지 마세요.** 선택한 색을 변경하는 등 사용자 입력에 반응해야 하는 경우에는 [State: 컴포넌트의 메모리](/learn/state-a-components-memory)에서 배울 “set state”가 필요할 것입니다.

<Recap>

* Props를 전달하려면 HTML 어트리뷰트를 사용할 때와 마찬가지로 JSX에 props를 추가합니다.
* Props를 읽으려면 `function Avatar({ person, size })` 구조 분해 문법을 사용합니다.
* `size = 100` 과 같은 기본값을 지정할 수 있으며, 이는 누락되거나 `undefined` 인 props에 사용됩니다.
* 모든 props를 `<Avatar {...props} />`로 전달할 수 있습니다. JSX 전개 문법을 사용할 수 있지만 과도하게 사용하지 마세요!
* `<Card><Avatar /></Card>`와 같이 중첩된 JSX는 `Card`컴포넌트의 자식 컴포넌트로 나타납니다.
* Props는 읽기 전용 스냅샷으로, 렌더링 할 때마다 새로운 버전의 props를 받습니다.
* Props는 변경할 수 없습니다. 상호작용이 필요한 경우 state를 설정해야 합니다.

</Recap>



<Challenges>

#### 컴포넌트 추출하기 {/*extract-a-component*/}

이  `Gallery` 컴포넌트에는 두 가지 프로필에 대한 몇 가지 비슷한 마크업이 포함되어 있습니다. 중복을 줄이기 위해 `Profile` 컴포넌트를 추출해 보세요. 어떤 props를 전달할지 골라야 할 수 있습니다.

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

export default function Gallery() {
  return (
    <div>
      <h1>Notable Scientists</h1>
      <section className="profile">
        <h2>Maria Skłodowska-Curie</h2>
        <img
          className="avatar"
          src={getImageUrl('szV5sdG')}
          alt="Maria Skłodowska-Curie"
          width={70}
          height={70}
        />
        <ul>
          <li>
            <b>Profession: </b> 
            physicist and chemist
          </li>
          <li>
            <b>Awards: 4 </b> 
            (Nobel Prize in Physics, Nobel Prize in Chemistry, Davy Medal, Matteucci Medal)
          </li>
          <li>
            <b>Discovered: </b>
            polonium (element)
          </li>
        </ul>
      </section>
      <section className="profile">
        <h2>Katsuko Saruhashi</h2>
        <img
          className="avatar"
          src={getImageUrl('YfeOqp2')}
          alt="Katsuko Saruhashi"
          width={70}
          height={70}
        />
        <ul>
          <li>
            <b>Profession: </b> 
            geochemist
          </li>
          <li>
            <b>Awards: 2 </b> 
            (Miyake Prize for geochemistry, Tanaka Prize)
          </li>
          <li>
            <b>Discovered: </b>
            a method for measuring carbon dioxide in seawater
          </li>
        </ul>
      </section>
    </div>
  );
}
```

```js utils.js
export function getImageUrl(imageId, size = 's') {
  return (
    'https://i.imgur.com/' +
    imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

<Hint>

과학자 중 한 명에 대한 마크업을 추출하는 것으로 시작하세요. 그런 다음 두 번째 예제에서 일치하지 않는 부분을 찾아 props로 구성할 수 있게 만듭니다.

</Hint>

<Solution>

이 솔루션에서 `Profile` 컴포넌트는 `imageId` (문자열), `name` (문자열), `profession` (문자열), `awards` (문자열 배열), `discovery` (문자열), `imageSize` (숫자) 등 여러 props를 허용합니다.

`imageSize` prop에는 기본값이 있으므로, 컴포넌트에 전달하지 않았습니다.

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

function Profile({
  imageId,
  name,
  profession,
  awards,
  discovery,
  imageSize = 70
}) {
  return (
    <section className="profile">
      <h2>{name}</h2>
      <img
        className="avatar"
        src={getImageUrl(imageId)}
        alt={name}
        width={imageSize}
        height={imageSize}
      />
      <ul>
        <li><b>Profession:</b> {profession}</li>
        <li>
          <b>Awards: {awards.length} </b>
          ({awards.join(', ')})
        </li>
        <li>
          <b>Discovered: </b>
          {discovery}
        </li>
      </ul>
    </section>
  );
}

export default function Gallery() {
  return (
    <div>
      <h1>Notable Scientists</h1>
      <Profile
        imageId="szV5sdG"
        name="Maria Skłodowska-Curie"
        profession="physicist and chemist"
        discovery="polonium (chemical element)"
        awards={[
          'Nobel Prize in Physics',
          'Nobel Prize in Chemistry',
          'Davy Medal',
          'Matteucci Medal'
        ]}
      />
      <Profile
        imageId='YfeOqp2'
        name='Katsuko Saruhashi'
        profession='geochemist'
        discovery="a method for measuring carbon dioxide in seawater"
        awards={[
          'Miyake Prize for geochemistry',
          'Tanaka Prize'
        ]}
      />
    </div>
  );
}
```

```js utils.js
export function getImageUrl(imageId, size = 's') {
  return (
    'https://i.imgur.com/' +
    imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

`awards`가 배열인 경우 별도의 `awardCount` prop이 필요하지 않다는 점에 주의하세요. `awards.length`를 사용하여 awards 개수를 파악할 수 있습니다. props에는 어떤 값도 사용할 수 있으며, 배열도 포함된다는 점을 기억하세요!

이 페이지의 앞선 예제와 더 유사한 또 다른 해결책은, 사람에 대한 모든 정보를 하나의 객체로 그룹화하고, 해당 객체를 하나의 prop으로 전달하는 것입니다.

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

function Profile({ person, imageSize = 70 }) {
  const imageSrc = getImageUrl(person)

  return (
    <section className="profile">
      <h2>{person.name}</h2>
      <img
        className="avatar"
        src={imageSrc}
        alt={person.name}
        width={imageSize}
        height={imageSize}
      />
      <ul>
        <li>
          <b>Profession:</b> {person.profession}
        </li>
        <li>
          <b>Awards: {person.awards.length} </b>
          ({person.awards.join(', ')})
        </li>
        <li>
          <b>Discovered: </b>
          {person.discovery}
        </li>
      </ul>
    </section>
  )
}

export default function Gallery() {
  return (
    <div>
      <h1>Notable Scientists</h1>
      <Profile person={{
        imageId: 'szV5sdG',
        name: 'Maria Skłodowska-Curie',
        profession: 'physicist and chemist',
        discovery: 'polonium (chemical element)',
        awards: [
          'Nobel Prize in Physics',
          'Nobel Prize in Chemistry',
          'Davy Medal',
          'Matteucci Medal'
        ],
      }} />
      <Profile person={{
        imageId: 'YfeOqp2',
        name: 'Katsuko Saruhashi',
        profession: 'geochemist',
        discovery: 'a method for measuring carbon dioxide in seawater',
        awards: [
          'Miyake Prize for geochemistry',
          'Tanaka Prize'
        ],
      }} />
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
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

JSX 어트리뷰트의 컬렉션이 아닌 JavaScript 객체의 속성으로 구성되어 있어서 문법이 약간 달라 보이지만, 이 예제는 대부분 동일하며 두 가지 접근 방식 중 어느 쪽을 선택해도 괜찮습니다.

</Solution>

#### prop에 따라 이미지 크기 조정하기 {/*adjust-the-image-size-based-on-a-prop*/}

이번 예제에서는 `Avatar` 가 `<img>`의 넓이와 높이를 결정하는 숫자 `size` prop를 받습니다. `size` prop은 `40`으로 설정되어 있습니다. 그러나 새 탭에서 이미지를 열면, 이미지가 `160픽셀`로 커져 있을 것입니다. 실제 이미지 크기는 요청하는 썸네일 크기에 따라 결정됩니다.

`size` prop에 따라 가장 가까운 이미지 크기를 요청하도록 `Avatar` 컴포넌트를 변경하세요. 특히 `size` 가 `90`보다 작으면 `'s'`(”small”)을, 아니면 `'b'`(”big”)을 `getImageUrl` 함수에 전달하세요. `size` prop를 다른 값들을 전달해 보고, 아바타를 렌더링 하는지, 새 탭에서 이미지를 열어 변경사항이 제대로 반영되는지 확인해 보세요.
<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person, 'b')}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <Avatar
      size={40}
      person={{ 
        name: 'Gregorio Y. Zara', 
        imageId: '7vQD0fP'
      }}
    />
  );
}
```

```js utils.js
export function getImageUrl(person, size) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

<Solution>

방법은 다음과 같습니다.

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

function Avatar({ person, size }) {
  let thumbnailSize = 's';
  if (size > 90) {
    thumbnailSize = 'b';
  }
  return (
    <img
      className="avatar"
      src={getImageUrl(person, thumbnailSize)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <>
      <Avatar
        size={40}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={120}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
    </>
  );
}
```

```js utils.js
export function getImageUrl(person, size) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

또한 [`window.devicePixelRatio`](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio)를 고려하여 높은 DPI 화면에서 더 선명한 이미지를 표시할 수도 있습니다.

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

const ratio = window.devicePixelRatio;

function Avatar({ person, size }) {
  let thumbnailSize = 's';
  if (size * ratio > 90) {
    thumbnailSize = 'b';
  }
  return (
    <img
      className="avatar"
      src={getImageUrl(person, thumbnailSize)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <>
      <Avatar
        size={40}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={70}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={120}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
    </>
  );
}
```

```js utils.js
export function getImageUrl(person, size) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

props를 사용하면 `<Avatar>` 컴포넌트 내부에 이와 같은 로직을 캡슐화할 수 있으므로(필요하면 나중에 변경할 수 있습니다), 누구나 이미지가 요청되고 크기가 조정되는 방식에 대해 생각하지 않고 `<Avatar>` 컴포넌트를 사용할 수 있습니다.

</Solution>

#### `children` prop에 JSX 전달하기 {/*passing-jsx-in-a-children-prop*/}

아래 마크업에서 `Card` 컴포넌트를 추출하고, `children` prop을 사용하여 다른 JSX를 전달하세요.

<Sandpack>

```js
export default function Profile() {
  return (
    <div>
      <div className="card">
        <div className="card-content">
          <h1>Photo</h1>
          <img
            className="avatar"
            src="https://i.imgur.com/OKS67lhm.jpg"
            alt="Aklilu Lemma"
            width={70}
            height={70}
          />
        </div>
      </div>
      <div className="card">
        <div className="card-content">
          <h1>About</h1>
          <p>Aklilu Lemma was a distinguished Ethiopian scientist who discovered a natural treatment to schistosomiasis.</p>
        </div>
      </div>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

<Hint>

컴포넌트의 태그 안에 넣는 모든 JSX는 해당 컴포넌트에 `children` prop로 전달됩니다.

</Hint>

<Solution>

두 곳에서 모두 `Card` 컴포넌트를 사용할 수 있는 방법입니다.

<Sandpack>

```js
function Card({ children }) {
  return (
    <div className="card">
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <div>
      <Card>
        <h1>Photo</h1>
        <img
          className="avatar"
          src="https://i.imgur.com/OKS67lhm.jpg"
          alt="Aklilu Lemma"
          width={100}
          height={100}
        />
      </Card>
      <Card>
        <h1>About</h1>
        <p>Aklilu Lemma was a distinguished Ethiopian scientist who discovered a natural treatment to schistosomiasis.</p>
      </Card>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

모든 `Card`에 항상 제목을 붙이고 싶다면 `title`을 별도의 prop으로 만들 수도 있습니다.

<Sandpack>

```js
function Card({ children, title }) {
  return (
    <div className="card">
      <div className="card-content">
        <h1>{title}</h1>
        {children}
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <div>
      <Card title="Photo">
        <img
          className="avatar"
          src="https://i.imgur.com/OKS67lhm.jpg"
          alt="Aklilu Lemma"
          width={100}
          height={100}
        />
      </Card>
      <Card title="About">
        <p>Aklilu Lemma was a distinguished Ethiopian scientist who discovered a natural treatment to schistosomiasis.</p>
      </Card>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

</Solution>

</Challenges>
