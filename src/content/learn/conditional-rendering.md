---
title: 조건부 렌더링
---

<Intro>

컴포넌트는 조건에 따라 다른 항목을 표시해야 하는 경우가 많습니다. 리액트는 `if` 문, `&&` 및 `? :` 연산자와 같은 자바스크립트 문법을 사용하여 조건부로 JSX를 렌더링할 수 있습니다.

</Intro>

<YouWillLearn>

* 조건에 따라 다른 JSX를 반환하는 방법
* JSX 조각을 조건부로 포함하거나 제외하는 방법
* React 코드에서 흔히 볼 수 있는 조건부 문법

</YouWillLearn>

## 조건부로 JSX 반환하기 {/*conditionally-returning-jsx*/}

짐을 챙겼는지 안 챙겼는지 표시할 수 있는 여러 개의 `Item`을 렌더링하는 `PackingList` 컴포넌트가 있다고 가정해보세요.

<Sandpack>

```js
function Item({ name, isPacked }) {
  return <li className="item">{name}</li>;
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

`Item` 컴포넌트 중 일부는 `isPacked` prop이 `false`가 아닌 `true`로 설정되어 있습니다. `isPacked={true}`인 경우 짐을 챙긴 항목에 체크 표시(✔)를 추가하려고 합니다.

다음과 같이 [`if`/`else` 문](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/if...else)으로 작성할 수 있습니다.

```js
if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;
```

`isPacked` prop이 `true`이면 이 코드는 **다른 JSX 트리를 반환합니다.** 이로 인해 일부 항목은 끝에 체크 표시가 있습니다.

<Sandpack>

```js
function Item({ name, isPacked }) {
  if (isPacked) {
    return <li className="item">{name} ✔</li>;
  }
  return <li className="item">{name}</li>;
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

각각의 경우를 수정해보고 반환 결과가 어떻게 달라지는지 확인해 보세요!

JavaScript의 `if`와 `return` 문으로 분기 로직을 만드는 방법을 살펴보세요. React에서 제어 흐름(예: 조건문)은 JavaScript로 처리합니다.

### 조건부로 `null`을 사용하여 아무것도 반환하지 않기 {/*conditionally-returning-nothing-with-null*/}

어떤 경우에는 아무것도 렌더링하고 싶지 않을 수 있습니다. 예를 들어, 짐을 챙긴 항목을 전혀 보여주지 않는다고 가정해보세요. 컴포넌트는 반드시 무언가를 반환해야 하는데 이 경우에 `null`을 반환할 수 있습니다. 다음과 같이 말이죠.

```js
if (isPacked) {
  return null;
}
return <li className="item">{name}</li>;
```

`isPacked`가 `true`라면 컴포넌트는 아무것도 반환하지 않지만, `false`라면 JSX가 반환될 것입니다.

<Sandpack>

```js
function Item({ name, isPacked }) {
  if (isPacked) {
    return null;
  }
  return <li className="item">{name}</li>;
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

실제로 컴포넌트에서 `null`을 반환하는 것은 개발자가 렌더링하려고 할 때 놀랄 수 있기 때문에 흔한 경우는 아닙니다. 더 자주, 부모 컴포넌트 JSX에 컴포넌트를 조건부로 포함하거나 제외할 수 있습니다. 다음과 같이 해보세요!

## 조건부로 JSX 포함시키기 {/*conditionally-including-jsx*/}

이전 예제에서는 어떤 항목(있는 경우)을 제어했습니다. 컴포넌트에 의해 JSX 트리가 반환되었습니다. 렌더링 된 출력 결과에서 이미 일부 중복이 발견되었을 수 있습니다.

```js
<li className="item">{name} ✔</li>
```

이것은 아래와 매우 비슷합니다.

```js
<li className="item">{name}</li>
```

두 조건부 분기가 모두 `<li className="item">...</li>`를 반환합니다.

```js
if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;
```

이 중복코드가 나쁘지는 않지만, 코드를 유지 보수하기 더 어렵게 만들 수 있습니다. `className`을 바꾸고 싶다면? 코드상 두 군데를 수정해야 합니다! 이러한 상황에서 조건부로 약간의 JSX를 포함해 코드를 더 [DRY (don't repeat yourself)](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) 하게 만들 수 있습니다.

### 삼항 조건 연산자 (`? :`) {/*conditional-ternary-operator--*/}

JavaScript는 [삼항 조건 연산자](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) 조건식을 작성하기 위한 간단한 문법을 가지고 있습니다.

이 코드 대신,

```js
if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;
```

다음과 같이 작성할 수 있습니다.

```js
return (
  <li className="item">
    {isPacked ? name + ' ✔' : name}
  </li>
);
```

*"`isPacked`가 true이면 (`?`) `name + ' ✔'`을 렌더링 하고, 그렇지 않으면 (`:`) `name`을 렌더링 한다.*로 읽을 수 있습니다.

<DeepDive>

#### Are these two examples fully equivalent? {/*are-these-two-examples-fully-equivalent*/}

`<li>`의 두 가지 다른 "인스턴스"를 만들 수 있기 때문에 객체 지향 프로그래밍에서는 위의 두 예가 미묘하게 다르다고 생각할 수 있습니다. 그러나 JSX 엘리먼트는 내부 상태를 보유하지 않으며 실제 DOM 노드가 아니기 때문에 "인스턴스"가 아닙니다. 이것은 청사진처럼 간단한 설명입니다. 따라서 위의 두 가지 예시 코드는 실제로 완전히 *동일합니다*. [상태를 보존하고 초기화하기](/learn/preserving-and-resetting-state)에서는 이 기능이 어떻게 작동하는지 자세히 설명합니다.

</DeepDive>

이제 완성된 항목의 텍스트를 `<del>`과 같은 다른 HTML 태그로 줄 바꿈 하여 삭제하려고 합니다. 더 많은 JSX를 중첩하기 쉽도록 새로운 줄과 괄호를 추가할 수 있습니다.

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {isPacked ? (
        <del>
          {name + ' ✔'}
        </del>
      ) : (
        name
      )}
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

이 스타일은 간단한 조건에 잘 어울리지만, 적당히 사용하는 게 좋습니다. 중첩된 조건부 마크업이 너무 많아 컴포넌트가 지저분해질 경우 자식 컴포넌트를 추출하여 정리하세요. React에서 마크업은 코드의 일부이므로 변수 및 함수와 같은 도구를 사용하여 복잡한 식을 정리할 수 있습니다.

### 논리 AND 연산자 (`&&`) {/*logical-and-operator-*/}

또 다른 일반적인 손쉬운 방법은 [JavaScript 논리 AND ('&&') 연산자](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND#:~:text=The%20logical%20AND%20(%20%26%26%20)%20operator,it%20returns%20a%20Boolean%20value.)입니다. React 컴포넌트에서는 조건이 참일 때 일부 JSX를 렌더링하거나 **그렇지 않으면 아무것도 렌더링하지 않을 때** 를 나타내는 경우가 많습니다. 다음과 같이 `&&`를 사용하면 `isPacked`가 `true`인 경우에만 조건부로 체크 표시를 렌더링할 수 있습니다.

```js
return (
  <li className="item">
    {name} {isPacked && '✔'}
  </li>
);
```

이것을 *`isPacked`이면 (`&&`) 체크 표시를 렌더링하고, 그렇지 않으면 아무것도 렌더링하지 않습니다."*라고 읽을 수 있습니다.

자, 잘 작동합니다.

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

[JavaScript && 표현식](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND)은 왼쪽(조건)이 `true`이면 오른쪽(체크 표시)의 값을 반환합니다. 그러나 조건이 `false`이면 전체 표현 식이 `false`가 됩니다. React는 `false`를 `null` 또는 `undefined`처럼 JSX 트리의 "구멍"으로 간주하고 그 자리에 아무것도 렌더링하지 않습니다.


<Pitfall>

**`&&`의 왼쪽에 숫자를 두지 마세요.**

조건을 테스트하기 위해 JavaScript는 자동으로 왼쪽을 부울로 변환합니다. 그러나 왼쪽이 `0`이면 전체 식이 (`0`)을 얻게 되고, 리액트는 아무것도 아닌 `0`을 렌더링할 것입니다.

예를 들어, 흔하게 하는 실수로 `messageCount && <p>New messages</p>`와 같은 코드를 작성하는 것입니다. 메시지 카운트가 `0`일 때 아무것도 렌더링하지 않는다고 쉽게 추측할 수 있지만, 실제로는 `0` 자체를 렌더링합니다!

이 문제를 해결하려면 `messageCount > 0 && <p>New messages</p>` 처럼 왼쪽을 부울로 만드세요.

</Pitfall>

### 변수에 조건부로 JSX를 할당하기 {/*conditionally-assigning-jsx-to-a-variable*/}

위와 같은 방법이 일반 코드를 작성하는 데 방해가 되면 `if` 문과 변수를 사용하세요. [`let`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/let)으로 정의된 변수는 재할당할 수 있으므로 표시할 기본 내용인 이름을 먼저 대입하세요.

```js
let itemContent = name;
```

`if` 문을 사용하여 `isPacked`가 `true`인 경우 JSX 표현식을 `itemContent`에 다시 할당합니다.

```js
if (isPacked) {
  itemContent = name + " ✔";
}
```

[중괄호를 사용하면 "JavaScript로 들어가는 창"이 열립니다.](/learn/javascript-in-jsx-with-curly-braces#using-curly-braces-a-window-into-the-javascript-world) 반환된 JSX 트리에 중괄호를 사용하고 이전에 계산된 식을 JSX 내부에 중첩하여 변수를 포함합니다.

```js
<li className="item">
  {itemContent}
</li>
```

이 스타일은 가장 장황하면서도 가장 유연합니다. 코드가 잘 작동 중입니다.

<Sandpack>

```js
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = name + " ✔";
  }
  return (
    <li className="item">
      {itemContent}
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

이전과 같이 텍스트뿐만 아니라 임의의 JSX에도 작동합니다.

<Sandpack>

```js
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = (
      <del>
        {name + " ✔"}
      </del>
    );
  }
  return (
    <li className="item">
      {itemContent}
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

JavaScript가 익숙하지 않다면, 처음에는 이런 다양한 코드 스타일이 낯설게 보일 수 있습니다. 그러나 이러한 코드를 학습한다면 React 컴포넌트뿐만 아니라 어떤 JavaScript 코드도 읽고 쓸 수 있습니다! 처음에 가장 선호하는 것을 선택해보고, 만약 다른 코드들이 어떻게 작동하는지를 잊어버린다면 이 문서를 다시 참고하세요.

<Recap>

* React에서 JavaScript로 분기 로직을 제어합니다.
* 조건부로 `if` 문과 함께 JSX 식을 반환할 수 있습니다.
* 조건부로 일부 JSX를 변수에 저장한 다음 중괄호를 사용하여 다른 JSX에 포함할 수 있습니다.
* JSX에서 `{cond ? <A /> : <B />}`는 *"`cond`이면 `<A />`를 렌더링하고, 그렇지 않으면 `<B />`를 렌더링합니다."* 를 의미합니다.
* JSX에서 `{cond && <A />}`는 *"`cond`이면, `<A />`를 렌더링하되, 그렇지 않으면 아무것도 렌더링하지 않습니다."*를 의미합니다.
* 위 예시는 흔한 방법이지만, `if`를 선호한다면 사용하지 않아도 됩니다.

</Recap>



<Challenges>

#### `? :`를 사용하여 완료되지 않은 항목의 아이콘을 표시합니다. {/*show-an-icon-for-incomplete-items-with--*/}

`isPacked`가 `true`가 아닌 경우 조건부 연산자(`cond ? a : b`)를 사용하여 ❌를 렌더링합니다.

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

<Solution>

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked ? '✔' : '❌'}
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

</Solution>

#### 항목의 중요한 정도를 `&&`로 표시합니다. {/*show-the-item-importance-with-*/}

이 예시에서 각 `Item`은 숫자 타입인 `importance`를 props로 받습니다. `&&` 연산자를 사용하여 "_(Importance: X)_"를 이탤릭체로 렌더링하되 난이도가 0이 아닌 항목만 렌더링합니다. 항목 목록은 다음과 같이 표시합니다.

* Space suit _(Importance: 9)_
* Helmet with a golden leaf
* Photo of Tam _(Importance: 6)_

두 레이블 사이에 공백을 추가하는 것을 잊지 마세요!

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          importance={9} 
          name="Space suit" 
        />
        <Item 
          importance={0} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          importance={6} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

이렇게 하는 건 트릭이지만 효과는 있을 것입니다.

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
      {importance > 0 && ' '}
      {importance > 0 &&
        <i>(Importance: {importance})</i>
      }
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          importance={9} 
          name="Space suit" 
        />
        <Item 
          importance={0} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          importance={6} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

`importance && ...` 보다는 `importance > 0 && ...`로 작성해야 합니다. `importance`가 `0`이면 결과로 `0`이 렌더링 되지 않습니다!

이 솔루션에서는 이름과 중요도 레이블 사이에 공백을 삽입하는 데 두 가지 개별 조건이 사용됩니다. `importance > 0 && <><i>...</i></>` 처럼 공백이 있는 프래그먼트를 앞에 사용할 수 있습니다. 또는 `importance > 0 && <i> ...</i>` 처럼 `<i>` 안에 바로 공백을 넣으세요.

</Solution>

#### 변수와 일련의 `? :`를 `if`로 리팩토링합니다. {/*refactor-a-series-of---to-if-and-variables*/}

`Drink` 컴포넌트는 일련의 `? :` 조건을 사용하여 `name` props가 `tea`인지 `coffee`인지에 따라 다른 정보를 표시합니다. 문제는 각 음료에 대한 정보가 여러 가지 조건에 걸쳐 퍼져 있다는 것입니다. 세 가지 `? :` 조건 대신 하나의 `if` 문을 사용하도록 이 코드를 리팩토링하세요.

<Sandpack>

```js
function Drink({ name }) {
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{name === 'tea' ? 'leaf' : 'bean'}</dd>
        <dt>Caffeine content</dt>
        <dd>{name === 'tea' ? '15–70 mg/cup' : '80–185 mg/cup'}</dd>
        <dt>Age</dt>
        <dd>{name === 'tea' ? '4,000+ years' : '1,000+ years'}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

`if`를 사용하도록 코드를 리팩토링한 후 이를 단순화하는 방법이 있습니까?

<Solution>

이 문제를 해결할 방법은 여러 가지가 있지만, 여기에 한 가지 시작점이 있습니다.

<Sandpack>

```js
function Drink({ name }) {
  let part, caffeine, age;
  if (name === 'tea') {
    part = 'leaf';
    caffeine = '15–70 mg/cup';
    age = '4,000+ years';
  } else if (name === 'coffee') {
    part = 'bean';
    caffeine = '80–185 mg/cup';
    age = '1,000+ years';
  }
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{part}</dd>
        <dt>Caffeine content</dt>
        <dd>{caffeine}</dd>
        <dt>Age</dt>
        <dd>{age}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

여기서는 각 음료에 대한 정보가 여러 조건에 분산되지 않고 함께 그룹화됩니다. 그러면 다음에 더 많은 음료를 쉽게 추가할 수 있습니다.

또 다른 해결책은 정보를 객체로 이동하여 조건을 완전히 제거하는 것입니다.

<Sandpack>

```js
const drinks = {
  tea: {
    part: 'leaf',
    caffeine: '15–70 mg/cup',
    age: '4,000+ years'
  },
  coffee: {
    part: 'bean',
    caffeine: '80–185 mg/cup',
    age: '1,000+ years'
  }
};

function Drink({ name }) {
  const info = drinks[name];
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{info.part}</dd>
        <dt>Caffeine content</dt>
        <dd>{info.caffeine}</dd>
        <dt>Age</dt>
        <dd>{info.age}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
