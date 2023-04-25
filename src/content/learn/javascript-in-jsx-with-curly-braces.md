---
title: JavaScript에서 중괄호가 있는 JSX
---

<Intro>

JSX를 사용하면 JavaScript 파일에 HTML과 비슷한 마크업을 작성하여 렌더링 로직과 콘텐츠를 같은 곳에 놓을 수 있습니다. 때로는 JavaScript 논리를 추가하거나 해당 마크업 내부의 동적인 프로퍼티를 참조하고 싶을 수 있습니다. 이 상황에서는 JSX에서 중괄호를 사용하여 JavaScript를 사용할 수 있습니다.

</Intro>

<YouWillLearn>

* 따옴표로 문자열을 전달하는 방법
* 중괄호가 있는 JSX 안에서 JavaScript 변수를 참조하는 방법
* 중괄호가 있는 JSX 안에서 JavaScript 함수를 호출하는 방법
* 중괄호가 있는 JSX 안에서 JavaScript 객체를 사용하는 방법

</YouWillLearn>

## 따옴표로 문자열 전달하기 {/*passing-strings-with-quotes*/}

문자열 어트리뷰트를 JSX에 전달하려면 작은따옴표나 큰따옴표로 묶어야 합니다.

<Sandpack>

```js
export default function Avatar() {
  return (
    <img
      className="avatar"
      src="https://i.imgur.com/7vQD0fPs.jpg"
      alt="Gregorio Y. Zara"
    />
  );
}
```

```css
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

여기에서는 `"https://i.imgur.com/7vQD0fPs.jpg"`와 `"Gregorio Y. Zara"`가 문자열로 전달되고 있습니다.

그러나 `src` 또는 `alt` 텍스트를 동적으로 지정하려면 어떻게 해야 할까요? **`"`와`"`를 `{`와`}`로 바꿔 JavaScript의 값을 사용할 수 있습니다**.

<Sandpack>

```js
export default function Avatar() {
  const avatar = 'https://i.imgur.com/7vQD0fPs.jpg';
  const description = 'Gregorio Y. Zara';
  return (
    <img
      className="avatar"
      src={avatar}
      alt={description}
    />
  );
}
```

```css
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

이미지를 둥글게 만드는 `"avatar"` CSS 클래스 이름을 지정하는 `className="avatar"`와 `avatar`라는 JavaScript 변수의 값을 읽는 `src={avatar}`의 차이점에 주목해야 합니다. 중괄호를 사용하면 마크업에서 바로 JavaScript를 사용할 수 있기 때문입니다.

## 중괄호 사용하기: JavaScript 세계로 연결하는 창 {/*using-curly-braces-a-window-into-the-javascript-world*/}

JSX는 JavaScript를 작성하는 특별한 방법입니다. 중괄호 `{ }` 사이에서 JavaScript를 사용할 수 있습니다. 아래 예시는 이름 `name`을 선언한 다음 `<h1>` 내부에 중괄호로 포함합니다.

<Sandpack>

```js
export default function TodoList() {
  const name = 'Gregorio Y. Zara';
  return (
    <h1>{name}'s To Do List</h1>
  );
}
```

</Sandpack>

`name` 값을 `'Gregorio Y. Zara'`에서 `'Hedy Lamarr'`로 변경해 To Do List 제목이 어떻게 변경되는지 확인해봅시다.

`formatDate()`와 같은 함수 호출을 포함해 모든 JavaScript 표현식은 중괄호 사이에서 작동합니다.

<Sandpack>

```js
const today = new Date();

function formatDate(date) {
  return new Intl.DateTimeFormat(
    'en-US',
    { weekday: 'long' }
  ).format(date);
}

export default function TodoList() {
  return (
    <h1>To Do List for {formatDate(today)}</h1>
  );
}
```

</Sandpack>

### 중괄호를 사용하는 곳 {/*where-to-use-curly-braces*/}

JSX 안에서 중괄호는 두 가지 방법으로만 사용할 수 있습니다.

1. JSX 태그 안의 **문자**: `<h1>{name}'s To Do List</h1>`는 작동하지만, `<{tag}>Gregorio Y. Zara's To Do List</{tag}>` 작동하지 않습니다.
2. `=` 바로 뒤에 오는 **어트리뷰트**: `src={avatar}`는 `avatar` 변수를 읽지만 `src="{avatar}"`는 `{avatar}` 문자열을 전달합니다.

## "이중 중괄호 사용하기": JSX의 CSS와 다른 객체 {/*using-double-curlies-css-and-other-objects-in-jsx*/}

문자열, 숫자 및 기타 JavaScript 표현식 외에도 JSX에 객체를 전달할 수도 있습니다. 또한 객체는 `{ name: "Hedy Lamarr", inventions: 5 }`처럼 중괄호로 표시됩니다. 따라서 JSX에서 객체를 전달하려면 `person={{ name: "Hedy Lamarr", inventions: 5 }}`와 같이 다른 중괄호 쌍으로 객체를 감싸야 합니다.

JSX의 인라인 CSS 스타일에서도 볼 수 있습니다. React는 인라인 스타일을 사용하도록 요구하지 않습니다(CSS 클래스는 대부분 잘 작동합니다). 그러나 인라인 스타일이 필요할 때 `style` 속성에 객체를 전달해야 합니다.

<Sandpack>

```js
export default function TodoList() {
  return (
    <ul style={{
      backgroundColor: 'black',
      color: 'pink'
    }}>
      <li>Improve the videophone</li>
      <li>Prepare aeronautics lectures</li>
      <li>Work on the alcohol-fuelled engine</li>
    </ul>
  );
}
```

```css
body { padding: 0; margin: 0 }
ul { padding: 20px 20px 20px 40px; margin: 0; }
```

</Sandpack>

`backgroundColor`와 `color` 값을 변경해 보세요.

아래와 같이 작성할 때 중괄호 안에 JavaScript 객체를 볼 수 있습니다.

```js {2-5}
<ul style={
  {
    backgroundColor: 'black',
    color: 'pink'
  }
}>
```

JSX에서 `{{` 와 `}}` 를 본다면 JSX 중괄호 안의 객체에 불과하다는 것을 알아야 합니다.

<Pitfall>

인라인 스타일 프로퍼티는 캐멀 케이스로 작성됩니다. 예를 들어 HTML에서의 `<ul style="background-color: black">`은 컴포넌트에서 `<ul style={{ backgroundColor: 'black' }}>`로 작성됩니다.

</Pitfall>

## JavaScript 객체와 중괄호에 대해서 더 알아보기 {/*more-fun-with-javascript-objects-and-curly-braces*/}

여러 표현식을 하나의 객체로 옮기고 중괄호 안의 JSX에서 참조할 수 있습니다.

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

이 예시에서 `person` 객체는 `name` 문자열과 `theme` 객체를 포함합니다.

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};
```

컴포넌트는 `person` 값을 아래와 같이 사용할 수 있습니다.

```js
<div style={person.theme}>
  <h1>{person.name}'s Todos</h1>
```

JSX는 JavaScript를 사용하여 데이터와 논리를 구성할 수 있는 매우 작은 템플릿 언어입니다.

<Recap>

이제 JSX에 대한 거의 모든 것을 알게 되었습니다.

* 따옴표 안의 JSX 어트리뷰트는 문자열로 전달됩니다.
* 중괄호를 사용하면 JavaScript 논리와 변수를 마크업으로 가져올 수 있습니다.
* JSX 태그 내부 또는 어트리뷰트의 `=` 뒤에서 작동합니다.
* `{{` 및 `}}` 는 특별한 문법이 아닙니다. JSX 중괄호 안에 들어 있는 JavaScript 객체입니다.

</Recap>

<Challenges>

#### 실수 고치기 {/*fix-the-mistake*/}

아래 코드는 `Objects are not valid as a React child`라는 오류가 발생합니다.

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
      <h1>{person}'s Todos</h1>
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

문제를 찾았나요?

<Hint>중괄호 안에 무엇이 있는지 찾아봅시다. 중괄호 안에 올바른 것을 넣고 있나요?</Hint>

<Solution>

이것은 예시가 *객체 자체*를 문자열이 아닌 마크업으로 렌더링하기 때문에 발생합니다. `<h1>{person}'s Todos</h1>`는 `person` 객체 전체를 렌더링하려고 합니다. 원시 객체를 텍스트 콘텐츠로 포함하면 React가 어떻게 표시할지 모르기 때문에 오류가 발생합니다.

문제를 해결하려면 `<h1>{person}'s Todos</h1>`를 `<h1>{person.name}'s Todos</h1>`로 바꾸어야 합니다.

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

</Solution>

#### 정보를 객체로 추출하기 {/*extract-information-into-an-object*/}

이미지 URL을 `person` 객체로 추출해 봅시다.

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

<Solution>

이미지 URL을 `person.imageUrl`이라는 프로퍼티로 이동하고 중괄호를 사용하여 `<img>` 태그에서 읽습니다.

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  imageUrl: "https://i.imgur.com/7vQD0fPs.jpg",
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
        src={person.imageUrl}
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

</Solution>

#### JSX 중괄호 안에 표현식 작성하기 {/*write-an-expression-inside-jsx-curly-braces*/}

아래 객체에서 전체 이미지 URL은 기본 URL, `imageId`, `imageSize` 및 파일 확장자 네 부분으로 나누어져 있습니다.

이미지 URL은 기본 URL (항상 `'https://i.imgur.com/'`), `imageId` (`'7vQD0fP'`), `imageSize` (`'s'`) 및 파일 확장자 (항상 `'.jpg'`)와 같은 어트리뷰트를 결합합니다. 그러나 `<img>` 태그가 `src`를 지정하는 방식에 문제가 있습니다.

어떻게 고칠 수 있을까요?

<Sandpack>

```js

const baseUrl = 'https://i.imgur.com/';
const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
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
        src="{baseUrl}{person.imageId}{person.imageSize}.jpg"
        alt={person.name}
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

수정 사항이 제대로 작동하는지 확인하려면 `imageSize` 값을 `'b'`로 변경해 보세요. 수정 후에 이미지의 크기가 조정되어야 합니다.

<Solution>

`src={baseUrl + person.imageId + person.imageSize + '.jpg'}`같이 작성할 수 있습니다.

1. `{` 는 JavaScript 표현식을 엽니다.
2. `baseUrl + person.imageId + person.imageSize + '.jpg'` 는 올바른 URL 문자열을 생성합니다.
3. `}` 는 JavaScript 표현식을 닫습니다.

<Sandpack>

```js
const baseUrl = 'https://i.imgur.com/';
const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
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
        src={baseUrl + person.imageId + person.imageSize + '.jpg'}
        alt={person.name}
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

이 표현식을 아래의 `getImageUrl`과 같은 별도의 함수로 옮길 수도 있습니다.

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js'

const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
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
        src={getImageUrl(person)}
        alt={person.name}
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

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    person.imageSize +
    '.jpg'
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

변수와 함수는 마크업을 단순하게 유지하는 데 도움이 될 수 있습니다!

</Solution>

</Challenges>