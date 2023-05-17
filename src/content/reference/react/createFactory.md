---
title: createFactory
---

<Deprecated>

이 API는 향후 React의 주요 버전에서 제거될 예정입니다. [대안들을 살펴보세요.](#alternatives)

</Deprecated>

<Intro>

`createFactory`는 특정 type의 React 엘리먼트를 만드는 함수를 생성합니다.

```js
const factory = createFactory(type)
```

</Intro>

<InlineToc />

---

## 레퍼런스 {/*reference*/}

### `createFactory(type)` {/*createfactory*/}

주어진 `type`의 React 엘리먼트를 만들어 내는 팩토리 함수를 생성하기 위해 `createFactory(type)`를 호출하세요.

```js
import { createFactory } from 'react';

const button = createFactory('button');
```

이후 JSX 없이 React 엘리먼트를 만들기 위해, 해당 함수를 사용할 수 있습니다. 

```js
export default function App() {
  return button({
    onClick: () => {
      alert('Clicked!')
    }
  }, 'Click me');
}
```

[아래에서 더 많은 사용법을 확인하세요.](#usage)

#### 인수 {/*parameters*/}

* `type`: `type`은 반드시 유효한 React 컴포넌트 type이어야 합니다. 예를 들어 태그 이름 문자열(`'div'` 나 `'span'`) 혹은 React 컴포넌트(함수 컴포넌트, 클래스 컴포넌트, [`Fragment`](/reference/react/Fragment)와 같은 특별한 컴포넌트)가 될 수 있습니다.

#### 반환 {/*returns*/}

팩토리 함수를 반환합니다. 이 함수는 자식 인수의 리스트에 뒤이어, 첫 번째 인수로 `props` 객체를 받으며, 주어진 `types`, `props` 그리고 `자식`을 가진 React 엘리먼트를 반환합니다. 

---

## 사용법 {/*usage*/}

### 팩토리 함수로 React 엘리먼트 만들기 {/*creating-react-elements-with-a-factory*/}

비록 대부분의 React 프로젝트들은 [JSX](/learn/writing-markup-with-jsx)를 사용하여 유저 인터페이스를 그려내지만, JSX가 필수는 아닙니다. 과거에는 `createFactory`를 JSX 없이 유저 인터페이스를 그려낼 방법의 하나로 사용하였습니다.

`button`과 같이 특정 엘리먼트 type을 반환하는 *팩토리 함수*를 생성하기 위해 `createFactory`를 호출합니다.

```js
import { createFactory } from 'react';

const button = createFactory('button');
```

그 다음, 제공된 props와 자식으로 React 엘리먼트를 만들어내는 팩토리 함수를 실행합니다.

<Sandpack>

```js App.js
import { createFactory } from 'react';

const button = createFactory('button');

export default function App() {
  return button({
    onClick: () => {
      alert('Clicked!')
    }
  }, 'Click me');
}
```

</Sandpack>

이는 `createFactory`을 JSX의 대안으로 사용하는 방법입니다. 하지만 `createFactory`는 더 이상 사용하지 않으며, 이후 새로운 코드를 작성할 때 `createFactory`를 사용하지 않아야 합니다. 아래에서 `createFactory` 대신 다른 방법을 사용하는 방식을 살펴보세요.

---

## 대안 {/*alternatives*/}

### 프로젝트에 `createFactory` 복사하기 {/*copying-createfactory-into-your-project*/}

만약 프로젝트에 `createFactory`가 많이 사용된다면, 다음의 `createFactory.js` 내용을 프로젝트 내부에서 사용할 수 있도록 복사하세요.

<Sandpack>

```js App.js
import { createFactory } from './createFactory.js';

const button = createFactory('button');

export default function App() {
  return button({
    onClick: () => {
      alert('Clicked!')
    }
  }, 'Click me');
}
```

```js createFactory.js
import { createElement } from 'react';

export function createFactory(type) {
  return createElement.bind(null, type);
}
```

</Sandpack>

이러한 작업을 통해, import 문을 제외하고 다른 코드를 바꾸지 않은 상태로 유지할 수 있습니다.

---

### `createFactory`를 `createElement`로 대체하기 {/*replacing-createfactory-with-createelement*/}

직접 옮겨와도 상관없을 정도로 `createFactory`를 몇 개 호출하고 있고 JSX를 사용하고 싶지 않다면, [`createElement`](/reference/react/createElement)를 실행하여 팩토리 함수를 대체할 수 있습니다. 예를 들어 이 코드는, 


```js {1,3,6}
import { createFactory } from 'react';

const button = createFactory('button');

export default function App() {
  return button({
    onClick: () => {
      alert('Clicked!')
    }
  }, 'Click me');
}
```

아래와 같이 바꿀 수 있습니다.


```js {1,4}
import { createElement } from 'react';

export default function App() {
  return createElement('button', {
    onClick: () => {
      alert('Clicked!')
    }
  }, 'Click me');
}
```

최종적으로 JSX 없이 React를 사용하는 예시입니다.

<Sandpack>

```js App.js
import { createElement } from 'react';

export default function App() {
  return createElement('button', {
    onClick: () => {
      alert('Clicked!')
    }
  }, 'Click me');
}
```

</Sandpack>

---

### `createFactory`를 JSX로 대체하기 {/*replacing-createfactory-with-jsx*/}

마지막으로 `createFactory` 대신 JSX를 사용할 수 있습니다. 이는 React를 사용하기 위해 가장 흔하게 사용하는 방법입니다.

<Sandpack>

```js App.js
export default function App() {
  return (
    <button onClick={() => {
      alert('Clicked!');
    }}>
      Click me
    </button>
  );
};
```

</Sandpack>

<Pitfall>

`button`과 같은 상수 대신 `type`을 특정 변수로 사용할 수도 있습니다.

```js {3}
function Heading({ isSubheading, ...props }) {
  const type = isSubheading ? 'h2' : 'h1';
  const factory = createFactory(type);
  return factory(props);
}
```

JSX에서도 같게 하기 위해서는 `Type`처럼 대문자로 시작하는 변수 이름을 새롭게 설정해야 합니다.

```js {2,3}
function Heading({ isSubheading, ...props }) {
  const Type = isSubheading ? 'h2' : 'h1';
  return <Type {...props} />;
}
```

그렇게 하지 않는 경우 `<type>`이 소문자로 되어있으므로, React는 이것을 내장된 HTML 태그로 해석할 것입니다.

</Pitfall>
