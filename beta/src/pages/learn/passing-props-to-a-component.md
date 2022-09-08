---
title: 컴포넌트에 Props 전달하기
---

<Intro>

React 컴포넌트는 다른 컴포넌트와 통신할 때 **props**를 사용합니다. 모든 부모 컴포넌트는 자식컴포넌트에게 그들의 props를 전달할 수 있습니다. props는 사용자에게 html 속성을 사용하게 할 뿐만 아니라, 캑체,배열 그리고 함수 를 포함하여 자바스크립트 value값도 함께 사용하게 합니다.

</Intro>

<YouWillLearn>

* 컴포넌트 사이에서 props를 어떻게 전달하는가
* 컴포넌트 안에 있는 props를 어떻게 이해하는가
* props안의 고정된 value를 어떻게 특정하는가
* JSX를 컴포넌트로 어떻게 전달하는가
* props를 어떻게 다시 바꾸는가

</YouWillLearn>

## 밀접한 props {/*familiar-props*/}

Props는 JSX태그를 사용해서 전달하는 정보입니다.예를 들어, `className`, `src`, `alt`, `width`, 그리고 `height`는 `<img>`태그에 정보를 전달하는 props들입니다:


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

`<img>`태그에 전달하는 props는 미리 정의되어 있습니다(ReactDOM은 [HTML 표준]을 따른다(https://www.w3.org/TR/html52/semantics-embedded-content.html#the-img-element).) 하지만 `<Avatar>` 태그와 같이 다시 원하는대로 조립함으로써,당신은 *당신만의* 컴포넌트에 어떠한 props든 전달해줄 수 있습니다.여기 예시를 보며 알아보자!

## 컴포넌트 간에 props전달하기  {/*컴포넌트 간에 props전달하기*/}


주어진 예시에서, `Profile` 컴포넌트는 자식 컴포넌트인  `Avatar`컴포넌트에 어떠한 props도 전달하고 있지 않습니다:

```js
export default function Profile() {
  return (
    <Avatar />
  );
}
```


 `Avatar` 컴포넌트에 props를 줄려면 2가지 단계를 거쳐야합니다.

### 1단계: 자식 컴포넌트에게 props전달하기 {/*1단계-자식 컴포넌트에게 props전달하기*/}

먼저, `Avatar`컴포넌트로 props를 전달하자.예를 들어서, 두가지 props를 전달합니다:`person`(객체),그리고 `size`(숫자):

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


>만약 `person=`이 중괄호안에 있어서 당신을 햇갈리게 한다면, JSX 중괄호 안에 있는 객체임을 기억해라 [그들은 그저 객체입니다](/learn/javascript-in-jsx-with-curly-braces#using-double-curlies-css-and-other-objects-in-jsx).

이제 당신은 `Avatar` 컴포넌트 안에 있는 props를 읽어올 수 있습니다.


### 2단계: 자식 컴포넌트 안에 있는 props를 읽어오기 {/*2단계- 자식 컴포넌트 안에 있는 props를 읽어오기*/}

`function Avatar`바로 뒤에 오고, `({` and `})` 안에 쉼표로 분리된,`person, size`이름을 나열함으로써 이 props들을 읽어올 수 있습니다.
```js
function Avatar({ person, size }) {
  // person,size 는 이곳에 들어갈 수 있습니다
```

`Avatar`에 약간의 로직을 더할 때, `person`,`size` props는 랜더링 할 때 사용합니다.


이제 `Avatar` 에서 서로 다른 props들과 다른 방식들로 렌더링 하는 것을 구성할 수 있습니다. 당신이 보기에 아슬아슬한 부분을 고쳐라!
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

props는 부모 컴포넌트와 자식 컴포넌트가 독립적으로 만드는 역할을 합니다. 예를 들어서, 당신은 `Avartar`에서 별도로 바꾸지 않더라도 `Profile`안에서`person`이나 `size`props를 바꿀 수 있습니다.비슷한 예로는, `Profile`안에서 별다른 조치를 취하지 않더라도, `Avartar`에서 사용하는 props들을 바꿀 수 있습니다. 


당신은 props를 "knobs(노브,문을 여닫기 위한 둥근 손잡이)" 생각하고 있을 것입니다. 함수 안에서 인자와 같은 역할을 맡지만 사실은, 오직 한 컴포넌트 안에서만 그 역할을 맡는다! React 컴포넌트 함수들은 `props`라는 객체의 한 개의 인자를 가지고 있습니다:

```js
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}
```


보통 `props`전체가 필요하지는 않고, 개별적인 props들을 분해 할당해서 사용합니다
<Gotcha>

props를 선언할 때 **`{`, `}` 쌍과 안에 있는 `(`,`)` 쌍을** 잊지 마라:

```js
function Avatar({ person, size }) {
  // ...
}
```

이 구문은 ["destructuring"](https://developer.mozilla.org/docs/Web/JavaScript/Reference/OperatorsDestructuring_assignment#Unpacking_fields_from_objects_passed_as_a_function_parameter)이라고 불리고,함수 파라미터에서 프로퍼티를 읽어오는 것과 같습니다:


```js
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}
```

</Gotcha>

## prop에 들어가는 디폴트 값 특정하기{/*prop에 들어가는 디폴트 값 특정하기*/}


만약 값을 주지 않았을 때 props에 디폴트 값을 주기를 원한다면, `=`을 넣음으로써 그리고 그 파라미터 앞에 디폴트 값을 줄 수 있습니다:

```js
function Avatar({ person, size = 100 }) {
  // ...
}
```

이제,  `<Avatar person={...} />`이 어떤 `size` prop도 랜더링 안해준다면, `size는 `100`을 가지게 될 것입니다. 

디폴트 값은 `size` prop을 잃어버리거나 `size={undefined}`으로 표시될 때 사용할 수 있습니다. 
`size={null}` 또는 `size={0}`으로 표시된다면 디폴트 값은 **절대** 사용되지 못합니다.

## props를 앞에 jsx 규칙 할당하기 {/*props를 앞에 jsx 구문 할당하기*/}

가끔, 허용되는 props들은 매우 반복적인 값을 가집니다:

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

반복적인 코드를 사용되는 것이 잘못되었다는 것은 아닙니다-더 법칙을 잘 따르는 것일 수 있습니다.
하지만 매번 반복된다면 번거롭습니다. 자식 개체들이 가지는 props들 앞에 있는 어떤 컴포넌트들은,
`Profile`과 `Avartar` 같이 말입니다. 그들은 그 어떤 props들도 직접적으로 전할 수 없고, "Spread"법칙으로 명확히 나타납니다:  

```js
function Profile(props) {
  return (
    <div className="card">
      <Avatar {...props} />
    </div>
  );
}
```

`Profile`의 props에서 `Avatar`로 전달하는 앞의 것들은 각각의 이름이 나열되지 않습니다. 

**제약과 함께 spread syntax를 사용하세요.** 만약 모든 컴포넌트에서 이와 같이 사용한다면,
잘못된 부분이 생깁니다. 흔히 컴포넌트를 분리하고 JSX로 자식에게 값을 전달해야한다는 것을 알려줍니다. 다음에 계속 됩니다!

## JXS에서 자식에게 값을 전달하기{/*JXS에서 자식에게 값을 전달하기*/}

브라우저 태그안에 할당되는 것은 흔한 일입니다:

```js
<div>
  <img />
</div>
```

가끔 같은 방식으로 컴포넌트에 할당될 수 있습니다:

```js
<Card>
  <Avatar />
</Card>
```

JSX 태그 안에 내용을 할당할 때, 부모 컴포넌트가 불려진 `자식`컴포넌트에 props를 부여합니다. 
예를 들어, `Card`컴포넌트 `자식` 컴포넌트인 `<Avatar />`에 props를 할당하고 감싼 div에 랜더링해줍니다: 

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

`Card` 컴포넌트가 어떤 내용을 감싸고 있는지 나태내는 약간의 주석과 함께 `<Card>`안에 `<Avatar>`를 넣는 것으로 대체하십시오. 내부에서 어떻게 랜더링이 진행되는 지 "알" 필요 없습니다. 유연한 패턴들을 다양한 경우와 함께 볼 수 있습니다. 

`자식` 컴포넌트의 prop을 "전체적으로" 부모 컴포넌트에 JSX로 값을 받아서 채워졌다고 생각할 수 있습니다. 눈에 보이는 포장지를 위해 `자식` props를 이합니다: panels, grids,그리고 다른 요소들도요. [Extracting Layout Components](/learn/extracting-layout-components)에서 더 살펴볼 수 있습니다. 

<Illustration src="/images/docs/illustrations/i_children-prop.png" alt='A puzzle-like Card tile with a slot for "children" pieces like text and Avatar' />

## props는 시간에 따라 어떻게 변하는가 {/*props는 시간에 따라 어떻게 변하는가*/}

 `Clock`컴포넌트는 부모 컴포넌트로 부터 2가지 props들을 받습니다: `color` 그리고 `time` 입니다. (부모 컴포넌트이 코드들은 아직 접하지 않은 [state](/learn/state-a-components-memory)을 사용해서 props들을 보냅니다. )

선택 상자의 색깔들을 바꾸어보려고 시도해보십시오:

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


이 예제는 **시간에 지남에 따라 컴포넌트가 다른 props들을 받는 다는 것을**나타냅니다. Props들은 항상 정적이지 않습니다! 여기,  `time` props는 매 초마다 바뀌고, `color` prop도 다른 색상을 선택할 때마다 바뀝니다. props는 시작할 때 부터 쭉 이어지기 보다는, 매 시간의 컴포넌트 데이터를 반영합니다.


그러나,props들은 [불변합니다](https://en.wikipedia.org/wiki/Immutable_object)— 컴퓨터 과학에서는 "불변"이라는 뜻을 가지고 있습니다. 컴포넌트가 props의 변화가 필요할 때,(예를 들어, 유저와의 상호작용 혹은 새로운 데이터에 반응할 때와 같이), 부모 컴포넌트가 _서로 다른 props들을 허용할 때 _"요청"이 필요합니다! 오래된 props는 후순위이지만, 결국 자바스크립트 엔딘은 계산하는데 메모리를 낭비할 수 있습니다. 


**"props를 바꾸려고 시도하지 마십시오."** 유저 데이터가 있는 인풋에서(색깔을 선택하게 할 때 처럼) 응답을 받오올 때, [State: A Component's Memory](/learn/state-a-components-memory)
여기에서 볼 수 있는 "set state"가 필요합니다.
<Recap>


* props의 값을 전달해줄 때, HTML문법을 사용할 때 처럼 JSX를 더하십시오.
* props를 읽을 때, `size = 100`와 같은 디폴트 값은, 없거나 `undefined` props에서 사용하십시오.
* `<Avatar {...props} />`와 함께 앞에 있는 모든 props들을 볼 수 있지만,남용하지 마십시오.
* `<Card><Avatar /></Card>`와 같이 내장된 JSX는 `Card` 컴포넌트의 `자식`prop을 나타냅니다.
* props는 시간이 정해져 있는 읽기 전용과 같습니다: 모든 새로운 랜더링은 새로운 버전의 props들을 가져옵니다.
* props들을 바꿀 수 없습니다. 상호작용이 필요하다면, 상태를 세팅하는 것이 필요합니다.

</Recap>



<Challenges>

### Extract a component {/*extract-a-component*/}
### 컴포넌트 추출하기{/*컴포넌트 추출하기*/}

이 `Gallery` 컴포넌트는 두 가지 프로필에 사용된 마크업과 매우 유사한 마크업을 포함하고 있습니다. `Profile` 컴포넌트에서 중복을 제거하십시오. 어떤 props들을 전달해야할 지 선택해야합니다

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

과학자들 중 한명이 되어서 마크업을 추출하는 것을 시작하십시오. 두 번째 예시와 맞지 않는 부분을 찾고, props에 맞게 하십시오. 

</Hint>

<Solution>


이 해결책으로, `Profile` 컴포넌트는 여러개의 props들을 가질 수 있습니다:`imageId` (문자열), `name` (문자열), `profession` (문자열), `awards` (배열의 문자열), `discovery` (문자열), and `imageSize` (숫자). 


`imageSize` prop은 컴포넌트에서 전달받지 못하는 지에 대한 이유로 비롯된 디폴트 값을 가지고 있다는 것을 기억하십시오.

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

`award`가 배열안에 `awardCount`prop을 가지고 있더라도 분리하지 못한다는 것을 기억하십시오. 
`awards.length`를 상의 갯수를 셀 때 사용할 수 있습니다. props들은 배열안에서도 어떤 값을 가질 수 있다는 것을 기억하십시오!

다른 해결책으로는, 이 페이지의 더 앞에 있는 예제와 유사하지만, person안에 있는 단일 객체에 있는 정보들을 그룹화하고, 객체에 prop을 전달하는 것입니다:

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

규칙이 약간 달라보이더라도, JSX 집합보다 자바스크립트 객체의 프로퍼티를 묘사하는 것에 가깝습니다. 이 예제들은 균일해보이고, 다른 접근 방법보다 보편적으로 접할 수 있습니다. 

</Solution>

### prop에 기반하여 이미지를 조정하기  {/*prop에 기반하여 이미지를 조정하기*/}

이 예제에서, `Avatar`는 `<img>`의 넓이,높이에 해당하는 숫자 형태의 `size` prop을 전달합니다. 
`size` prop은 `40`으로 설정되어 있습니다. 그러나, 새 탭에서 이미지를 연다면, 이미지가 `160`픽셀 보다 더 큰 것을 알아야 합니다. 원래 이미지 크기는 당신이 요청한 사이즈 그대로 결정됩니다. 

`Avatar` 컴포넌트를 바꿀 때 `size` prop에 기반하여 요청한 가장 유사한 이미지 사이즈로 바뀝니다. 특히, `size`가 `90`보다 덜 할 때 `'b'` ("big")보다는 `getImageUrl` 함수로 `'s'` ("small")를 전달합니다. 아바타에 `size` prop의 다른 값들을 랜더링 함으로써 작업물에 변화를 특정할 때 새 탭에서 이미지들을 엽니다. 

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

여기 당신이 어떻게 해야할 지에 대한 예제가 있습니다:

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

당신이 더 선명해 보이는 이미지를 보여주고 싶다면 [`window.devicePixelRatio`](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio)로 살펴보십시오:

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

props는 이미지들을 요청하고 재조정 없이 `<Avatar>` 컴포넌트에서 사용할 수 있게 하기 위해서 컴포넌트 안에 로직을 캡슐화 합니다.

</Solution>

### `children` prop을 JSX 전달하기 {/*`children` prop을 JSX 전달하기 */}

`Card` 컴포넌트에 있는 마크업 에서 추출하고, `children` prop을 JSX의 다른 값을 전달하기 위헤 
사용하십시오
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

컴포넌트 안의 태그에 넣은 JSX `자식` prop으로 전달됩니다:

</Hint>

<Solution>

<!-- This is how you can use the `Card` component in both places: -->
두 배치된 곳에 `Card` 컴포넌트를 사용하는 방법입니다:

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
