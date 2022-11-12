---
title: 컴포넌트에 Props 전달하기
---

<Intro>

React 컴포넌트는 다른 컴포넌트와 통신할 때 **props**를 사용합니다. 모든 부모 컴포넌트는 자식 컴포넌트에게 부모 컴포넌트의 props를 전달할 수 있습니다. Props를 통해 여러분은 HTML 속성(HTML Atrtibute)을 떠올리겠지만, 객체, 배열과 함수와 같은 어떤 자바스크립트 값들도 props를 통해 전달 할 수 있습니다.

</Intro>

<YouWillLearn>

* 컴포넌트에 props를 전달하기
* 컴포넌트의 props를 읽기
* 컴포넌트이 props에 기본값 지정하기
* 컴포넌트에 JSX를 전달하기
* 시간에 따라 props가 어떻게 변경되는지

</YouWillLearn>

## 밀접한 props {/*familiar-props*/}

Props는 JSX 태그에 전달하는 정보입니다. 예를 들어 `className`, `src`, `alt`, `width`, 그리고 `height`는 `<img>`에 전달 할 수 있는 props들중 일부입니다.

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

`<img>`태그에 전달할 수 있는 props들은 미리 정의되어 있습니다 (ReactDOM은 [HTML 표준]을 따릅니다.(https://www.w3.org/TR/html52/semantics-embedded-content.html#the-img-element)). 그러나 `<Avatar>`와 같이 *여러분이 직접 작성한* 컴포넌트에는 해당 컴포넌트들을 커스터마이즈하기 위해 어떤 props도 전달할 수 있습니다. 같이 알아봅시다!

## 컴포넌트 간에 props전달하기 {/*passing-props-to-a-component*/}

아래 코드에서 `Profile` 컴포넌트는 자식 컴포넌트인 `Avatar`컴포넌트에 어떠한 props도 전달하고 있지 않습니다.

```js
export default function Profile() {
  return (
    <Avatar />
  );
}
```

`Avatar` 컴포넌트에 props를 주려면 2가지 단계를 거쳐야합니다.

### 1단계: 자식 컴포넌트에 props 전달하기 {/*step-1-pass-props-to-the-child-component*/}```

먼저 `Avatar` 컴포넌트로 props를 전달해야 합니다. 예를 들어 `person`(객체), 그리고 `size`(숫자) 두 props를 전달합니다.

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

> 만약 `person=`뒤에 따라 오는 중괄호가 여러분을 헷갈리게 한다면, 그것들은 그저 [JSX 내부의 객체](/learn/javascript-in-jsx-with-curly-braces#using-double-curlies-css-and-other-objects-in-jsx)임을 기억하세요.

이제 당신은 `Avatar` 컴포넌트 안에 있는 props를 읽어올 수 있습니다.

### 2단계: 자식 컴포넌트 안에 있는 props를 읽어오기 {/*step-2-read-props-inside-the-child-component*/}

`function Avatar` 바로 뒤에 오고, `({` and`})` 안에 쉼표로 분리된, `person, size` 이름을 나열함으로써 이 props를 읽어올 수 있습니다. props는 `Avatar` 내부에서, 변수와 함께 사용합니다.

```js
function Avatar({ person, size }) {
// person과 size는 여기에서 사용할 수 있습니다.
}
```

`Avatar`에 약간의 로직을 더할 때, `person` 과 `size` props는 렌더링할 때 사용합니다.

이제 `Avatar`에서 다양한 방법으로 여러 props를 렌더링 할 수 있습니다. props에 담겨있는 변수들의 값을 조절해 보세요!

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

props를 사용하면 부모 컴포넌트와 자식 컴포넌트가 독립적으로 동작하게 할 수 있니다. 예를 들어서, `Avatar`에서 별도로 바꾸지 않더라도 `Profile`에 있는 props인 `person`이나 `size`를 조정할 수 있습니다. 비슷한 예로는, `Profile`에 있는 props를 변경하지 않더라도, `Avatar`에서 props로 값을 전달해 주는 방법을 바꿀 수 있습니다. 

props를 "문을 여닫기 위한 둥근 손잡이" 정도로 생각하고 있을 것입니다. props는 함수 안에서 볼 수 있는 보편적인 인자와 같다고 볼 수 있지만, 사실 컴포넌트 내부에 있는 유일한 인자입니다! React 컴포넌트 함수들은 `props`라는 객체의 한 개의 인자를 가지고 있습니다.

```js
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}
```

보통 객체인 `props` 를 직접 변수로 사용하기 보다는 , 개별적인 props를 분해 할당해서 사용합니다.

<Gotcha>

props를 선언할 때 ** `(`와`)`안에 있는 핵심인 `{`과`}`가 한 쌍인 것을** 잊지 마세요.

```js
function Avatar({ person, size }) {
  // ...
}
```

이 구문은 ["destructuring"](https://developer.mozilla.org/docs/Web/JavaScript/Reference/OperatorsDestructuring_assignment#Unpacking_fields_from_objects_passed_as_a_function_parameter) 이라고 불리고, 함수 파라미터에서 프로퍼티를 읽어오는 것과 같습니다.

```js
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}
```

</Gotcha>

## prop에 들어가는 디폴트 값 특정하기 {/*specifying-a-default-value-for-a-prop*/}

값이 지정되지 않은 경우, props에 대신할 기본 값을 제공하려면 매개 변수 바로 파라미터 바로 뒤에 '='를 넣고 기본값을 사용하면 됩니다.

```js
function Avatar({ person, size = 100 }) {
  // ...
}
```

이제, `<Avatar person={...} />`이 어떤 `size` prop도 렌더링 안 해준다면, `size는 `100`을 가지게 됩니다. 

디폴트 값은 `size` prop을 잃어버리거나 `size={undefined}`으로 표시될 때 사용할 수 있습니다. `size={null}` 또는 `size={0}`으로 표시된다면, 디폴트 값은 **절대** 사용되지 못합니다.

## props를 앞에 jsx 규칙 할당하기 {/*props를 앞에 jsx 구문 할당하기*/}

가끔, props는 매우 반복적인 규칙을 가집니다.

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

반복적인 코드를 사용되는 것이 잘못되었다는 것은 아닙니다-더 읽기 쉬울 수 있습니다. 하지만 매번 반복된다면 읽을 때 번거롭습니다. `Profile`이 `Avatar`와 작동하는 것처럼, 그게 자식 개체들이 가지는 props든 앞에 있는 어떤 컴포넌트든 말입니다. 그 어떠한 props도 직접적으로 전할 수 없기 때문에, 이해하기 쉽게 하기 위해서 더 간결한 "Spread" 문법을 사용합니다. 

```js
function Profile(props) {
  return (
    <div className="card">
      <Avatar {...props} />
    </div>
  );
}
```

`Profile`의 props에서 `Avatar`로 전달하는 앞에 있는 모든 것들은 각각의 이름이 나열되지 않습니다. 

**spread 문법은 제한을 두고 사용하세요.** 만약 모든 컴포넌트에서 이처럼 사용한다면, 잘못된 부분이 생깁니다. 흔히 컴포넌트를 분리하고 JSX로 자식에게 값을 전달해야 한다는 것을 알려줍니다. 다음에 계속됩니다!

## JSX에서 자식에게 값을 전달하기{/*JSX에서 자식에게 값을 전달하기*/}

브라우저 태그안에 할당되는 것은 흔한 일입니다.

```js
<div>
  <img />
</div>
```

가끔 같은 방식으로 컴포넌트에 할당될 수 있습니다.

```js
<Card>
  <Avatar />
</Card>
```

JSX 태그를 사용하여 내용을 중첩하면, 부모 컴포넌트가 해당 내용을 `자식` prop을 사용하여 수신합니다. 예를 들어, 다음과 같은 `Card` 컴포넌트는 `<Avatar />`컴포넌트에 포함된 `자식` prop으로 해당 내용을 전달받아 div로 렌더링 합니다.

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

`Card` 컴포넌트가 어떤 내용을 감싸고 있는지 나타내는 약간의 주석과 함께 `<Card>`안에 `<Avatar>`를 넣는 것으로 대체하세요. 컴포넌트 내부에서 어떻게 렌더링이 진행되는지 "알" 필요 없습니다. 상황에 따라 유연하게 사용할 수 있는 컴포넌트 디자인 패턴들을 볼 수 있습니다. 

`자식` 컴포넌트의 prop을 "전체적으로" 부모 컴포넌트에 JSX로 값을 받아서 채워졌다고 생각할 수 있습니다. 값을 전달받아서 채워졌다는 것을 확실히 확인하기 위해서 `자식` prop을 사용합니다. panels, grids, 그리고 다른 요소들도 마찬가지입니다. [Extracting Layout Components](/learn/extracting-layout-components)에서 더 살펴볼 수 있습니다. 

<Illustration src="/images/docs/illustrations/i_children-prop.png" alt='A puzzle-like Card tile with a slot for "children" pieces like text and Avatar' />

## props는 시간에 따라 어떻게 변하는가 {/*how-props-change-over-time*/}

 `Clock` 컴포넌트는 부모 컴포넌트로부터 2가지 props를 받습니다. `color` 그리고 `time`입니다. (부모 컴포넌트의 코드는 아직 접하지 않은 [state](/learn/state-a-components-memory) 을 사용해서 props를 보냅니다. )

선택 상자의 색깔들을 바꿔보세요.

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

이 예제는 **시간에 지남에 따라 컴포넌트가 다른 props를 받는다는 것을**나타냅니다. Props는 항상 정적이지 않습니다! 여기, `time` prop는 매초 바뀌고, `color` prop도 다른 색상을 선택할 때마다 바뀝니다. props는 시작할 때부터 쭉 데이터를 반영하지 않는 게 아니라, 시간에 따라 변하는 컴포넌트 데이터를 반영하는 것에 가깝습니다.

그러나, props는 [불변합니다](https://en.wikipedia.org/wiki/Immutable_object)— 컴퓨터 과학에서는 "불변"이라는 뜻을 가지고 있습니다. 컴포넌트가 props의 변화가 필요할 때, (예를 들어, 유저와의 상호작용 혹은 새로운 데이터에 반응할 때와 같이), 부모 컴포넌트가 _서로 다른 props를 허용할 때 _새로운 객체에 "요청"하는 것이 필요합니다! 오래된 props는 뒷순위이지만, 결국 자바스크립트 엔진은 props를 계산하는데 메모리를 낭비할 수 있습니다. 

**"props를 바꾸려고 시도하지 마세요."** 유저 데이터가 있는 인풋에서(색깔을 선택하게 할 때처럼) 응답을 받고 올 때, [State: A Component's Memory](/learn/state-a-components-memory) 여기에서 볼 수 있는 "set state"가 필요합니다.

<Recap>

* props의 값을 전달해줄 때, HTML 문법을 사용할 때처럼 JSX를 더하세요.
* props를 읽을 때, function Avatar({ person, size })`와 같은 구조 분해 할당 문법을 사용하세요.
* 디폴트 값이 처음부터 없거나 `undefined` props에서 사용된, `size = 100`과 같이 디폴트 값을 특정할 수 있습니다.
* `<Avatar {...props} />`와 함께 앞에 있는 모든 props를 볼 수 있지만, 남용하지 마세요.
* `<Card><Avatar /></Card>`와 같이 내장된 JSX는 `Card` 컴포넌트의 `자식` prop을 나타냅니다.
* props는 시간이 정해져 있는 읽기 전용과 같습니다: 모든 새로운 렌더링은 새로운 버전의 props를 가져옵니다.
* props들을 바꿀 수 없습니다. 상호작용이 필요하다면, 상태를 설정하는 것이 필요합니다.

</Recap>



<Challenges>

### 컴포넌트 추출하기 {/*extract-a-component*/}

이 `Gallery` 컴포넌트는 두 가지 프로필에 사용된 마크업과 매우 유사한 마크업을 포함하고 있습니다. `Profile` 컴포넌트에서 중복을 제거하세요. 어떤 props를 전달해야할지 선택 해야합니다.

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

과학자 중 한 명이 되어서 마크업을 추출해서 보는 것으로 시작하세요. 두 번째 예시와 맞지 않는 부분을 찾고, props에 알맞게 설정 가능하도록 바꾸세요.

</Hint>

<Solution>

이 해결책으로, `Profile` 컴포넌트는 여러 개의 props를 가질 수 있습니다.` imageId` (문자열), `name` (문자열), `profession` (문자열), `awards` (배열의 문자열), `discovery` (문자열), and `imageSize` (숫자)입니다.

`imageSize` prop은 컴포넌트에서 전달받지 못하는지에 대한 이유로 비롯된 기본적인 값을 가지고 있다는 것을 기억하세요.

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

`award`가 배열 안에 `awardCount`prop을 가지고 있더라도 분리하지 못한다는 것을 기억하세요. `awards.length`를 상의 개수를 셀 때 사용할 수 있습니다. props는 배열 안에서도 어떤 값을 가질 수 있다는 것을 기억하세요!

다른 해결책으로는, 이 페이지의 더 앞에 있는 예제와 유사하지만, person 안에 있는 단일 객체에 있는 정보들을 그룹화하고, 객체에 prop을 전달하는 것이 있습니다.

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

규칙이 약간 달라 보이더라도, JSX 집합보다 자바스크립트 객체의 프로퍼티를 묘사하는 것에 가깝습니다. 이 예제들은 균일 해보이고, 다른 접근 방법보다 보편적으로 접할 수 있습니다. 

</Solution>

### prop에 기반하여 이미지를 조정하기  {/*prop에 기반하여 이미지를 조정하기*/}

이 예제에서, `Avatar`는 `<img>`의 넓이, 높이에 해당하는 숫자 형태의 `size` prop을 전달합니다. size` prop은 `40`으로 설정되어 있습니다. 그러나, 새 탭에서 이미지를 연다면, 이미지가 `160`픽셀보다 더 큰 것을 알아야 합니다. 원래 이미지 크기는 당신이 요청한 사이즈 그대로 결정됩니다. 

`Avatar` 컴포넌트를 바꿀 때 `size` prop에 기반하여 요청한 가장 유사한 이미지 사이즈로 바뀝니다. 특히, `size`가 `90`보다 덜 할 때 `'b'` ("big")보다는 `getImageUrl` 함수로 `'s'` ("small")를 전달합니다. 아바타에 `size` prop의 다른 값들을 더링 함으로써 작업물에 변화를 특정할 때 새 탭에서 이미지들을 엽니다. 

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

여기 어떻게 해야할 지에 대한 예제가 있습니다.

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

더 선명해 보이는 이미지를 보여주고 싶다면 [`window.devicePixelRatio`](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio)로 살펴보세요.

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

props는 이미지들을 요청하고 앞에서 보았던 `<Avatar>` 컴포넌트 내부에서 작동하는 원리처럼(필요하다면 언제든지 바꿀 수 있습니다), 재조정 없이 `<Avatar>` 컴포넌트에서 사용할 수 있게 하기 위해서 컴포넌트 안에 로직을 캡슐화합니다.

</Solution>

### `자식` prop을 JSX 전달하기 {/*passing-jsx-in-a-children-prop*/}

`Card` 컴포넌트에 있는 마크업에서 추출하고, `children` prop을 JSX의 다른 값을 전달하기 위해 사용하세요.

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

컴포넌트 안의 태그에 넣은 JSX `자식` prop으로 전달됩니다.

</Hint>

<Solution>

두 배치된 곳에 `Card` 컴포넌트를 사용하는 방법입니다.

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

원한다면 `Card`가 제목을 가지고 있을 수 있게 분리된 prop인 `title`을 만들 수 있습니다. 

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
