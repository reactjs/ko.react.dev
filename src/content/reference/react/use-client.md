---
title: "'use client'"
titleForTitleTag: "'use client' directive"
canary: true
---

<Canary>

`'use client'`는 [React 서버 컴포넌트를 사용](/learn/start-a-new-react-project#bleeding-edge-react-frameworks)하거나 그와 호환되는 라이브러리를 만들 때만 사용합니다.
</Canary>


<Intro>

`'use client'`를 사용하면 클라이언트에서 실행되는 코드를 표시할 수 있습니다.

</Intro>

<InlineToc />

---

## 레퍼런스 {/*reference*/}

### `'use client'` {/*use-client*/}

파일의 최상단에 `'use client'`를 추가하여 모듈과 해당 모듈의 전이적 종속성을 클라이언트 코드로 표시하세요.

```js {1}
'use client';

import { useState } from 'react';
import { formatDate } from './formatters';
import Button from './button';

export default function RichTextEditor({ timestamp, text }) {
  const date = formatDate(timestamp);
  // ...
  const editButton = <Button />;
  // ...
}
```

서버 컴포넌트에서 `'use client'`라고 표시된 파일을 가져오면 [호환되는 번들러](/learn/start-a-new-react-project#bleeding-edge-react-frameworks)는 import를 서버 실행 코드와 클라이언트 실행 코드 사이의 경계로 처리합니다.

`RichTextEditor`의 종속성으로 `formatDate`와 `Button`도 해당 모듈에 `'use client'` 지시어가 포함되어 있지 않더라도 클라이언트에서 평가됩니다. 하나의 모듈이 서버 코드에서 가져올 때는 서버에서, 클라이언트 코드에서 가져올 때는 클라이언트에서 평가될 수 있음을 유의해야 합니다.

#### 주의사항 {/*caveats*/}

* `'use client'`는 파일의 맨 처음에 있어야 하며, 다른 코드나 import 문보다 위에 있어야 합니다(주석은 괜찮습니다). 작은따옴표나 큰따옴표로 작성해야 하며 백틱은 사용할 수 없습니다.
* `'use client'` 모듈을 다른 클라이언트 렌더링 모듈에서 가져오면 지시어가 동작하지 않습니다.
* 컴포넌트 모듈에 `'use client'` 지시어가 포함된 경우 해당 컴포넌트의 사용은 클라이언트 컴포넌트임이 보장됩니다. 하지만 컴포넌트에 `'use client'` 지시어가 없더라도 클라이언트에서 평가될 수 있습니다.
	* 컴포넌트 사용은 `'use client'` 지시어가 포함된 모듈에 정의되어 있거나 `'use client'` 지시어를 포함한 모듈의 전이적 종속성일 경우 클라이언트 컴포넌트로 간주합니다. 그렇지 않으면 서버 컴포넌트로 간주합니다.
* 클라이언트 평가로 표시된 코드는 컴포넌트에만 국한되지 않습니다. 클라이언트 모듈 하위 트리의 모든 코드는 클라이언트에 전송되어 클라이언트에서 실행됩니다.
* 서버 평가 모듈이 `'use client'` 모듈에서 값을 가져올 때, 그 값은 React 컴포넌트이거나 클라이언트 컴포넌트에 전달될 수 있는 [지원되는 직렬화 가능한 prop 값](#passing-props-from-server-to-client-components)이어야 합니다.

### `'use client'`가 클라이언트 코드를 표시하는 방법 {/*how-use-client-marks-client-code*/}

React 앱에서 컴포넌트는 종종 별도의 파일 또는 [모듈](/learn/importing-and-exporting-components#exporting-and-importing-a-component)로 분리됩니다.

React 서버 컴포넌트를 사용하는 앱의 경우, 기본적으로 앱은 서버에서 렌더링 됩니다. `'use client'`는 [모듈 종속성 트리](/learn/understanding-your-ui-as-a-tree#the-module-dependency-tree)에 서버-클라이언트 경계를 도입하여 효과적으로 클라이언트 모듈의 하위 트리를 만듭니다.

이를 더 잘 설명하기 위해 다음과 같은 React 서버 컴포넌트 앱을 고려해 보세요.

<Sandpack>

```js src/App.js
import FancyText from './FancyText';
import InspirationGenerator from './InspirationGenerator';
import Copyright from './Copyright';

export default function App() {
  return (
    <>
      <FancyText title text="Get Inspired App" />
      <InspirationGenerator>
        <Copyright year={2004} />
      </InspirationGenerator>
    </>
  );
}

```

```js src/FancyText.js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

```js src/InspirationGenerator.js
'use client';

import { useState } from 'react';
import inspirations from './inspirations';
import FancyText from './FancyText';

export default function InspirationGenerator({children}) {
  const [index, setIndex] = useState(0);
  const quote = inspirations[index];
  const next = () => setIndex((index + 1) % inspirations.length);

  return (
    <>
      <p>Your inspirational quote is:</p>
      <FancyText text={quote} />
      <button onClick={next}>Inspire me again</button>
      {children}
    </>
  );
}
```

```js src/Copyright.js
export default function Copyright({year}) {
  return <p className='small'>©️ {year}</p>;
}
```

```js src/inspirations.js
export default [
  "Don’t let yesterday take up too much of today.” — Will Rogers",
  "Ambition is putting a ladder against the sky.",
  "A joy that's shared is a joy made double.",
];
```

```css
.fancy {
  font-family: 'Georgia';
}
.title {
  color: #007AA3;
  text-decoration: underline;
}
.cursive {
  font-style: italic;
}
.small {
  font-size: 10px;
}
```

</Sandpack>

예제 앱의 모듈 종속성 트리에서 `InspirationGenerator.js`의 `'use client'` 지시어는 해당 모듈과 모든 전이적 종속성을 클라이언트 모듈로 표시합니다. 이제 `InspirationGenerator.js`에서 시작하는 하위 트리는 클라이언트 모듈로 표시됩니다.

<Diagram name="use_client_module_dependency" height={250} width={545} alt="A tree graph with the top node representing the module 'App.js'. 'App.js' has three children: 'Copyright.js', 'FancyText.js', and 'InspirationGenerator.js'. 'InspirationGenerator.js' has two children: 'FancyText.js' and 'inspirations.js'. The nodes under and including 'InspirationGenerator.js' have a yellow background color to signify that this sub-graph is client-rendered due to the 'use client' directive in 'InspirationGenerator.js'.">
`'use client'`는 React 서버 컴포넌트 앱의 모듈 종속성 트리를 분할하여 `InspirationGenerator.js`와 모든 종속성을 클라이언트-렌더링으로 표시합니다.
</Diagram>

렌더링하는 동안 프레임워크는 루트 컴포넌트를 서버-렌더링하고 [렌더 트리](/learn/understanding-your-ui-as-a-tree#the-render-tree)를 통해 계속 진행하여 클라이언트에서 가져온 코드를 평가하지 않습니다.

그런 다음 서버에서 렌더링한 렌더 트리 부분을 클라이언트로 보냅니다. 클라이언트 코드를 다운로드한 클라이언트는 트리의 나머지 부분 렌더링을 완료합니다.

<Diagram name="use_client_render_tree" height={250} width={500} alt="A tree graph where each node represents a component and its children as child components. The top-level node is labelled 'App' and it has two child components 'InspirationGenerator' and 'FancyText'. 'InspirationGenerator' has two child components, 'FancyText' and 'Copyright'. Both 'InspirationGenerator' and its child component 'FancyText' are marked to be client-rendered.">
React 서버 컴포넌트 앱을 위한 렌더 트리에서 `InspirationGenerator`와 그 자식 컴포넌트 `FancyText`는 클라이언트 표시 코드에서 내보낸 컴포넌트이며 클라이언트 컴포넌트로 간주합니다.
</Diagram>

다음 정의를 소개합니다.

* **클라이언트 컴포넌트**는 클라이언트에서 렌더링되는 렌더 트리의 컴포넌트입니다.
* **서버 컴포넌트**는 서버에서 렌더링 되는 렌더 트리의 컴포넌트입니다.

예제 앱이 실행되는 동안 `App`, `FancyText` 및 `Copyright`는 모두 서버에서 렌더링 되며 서버 컴포넌트로 간주합니다. `InspirationGenerator.js`와 그 전이적 종속성이 클라이언트 코드로 표시되므로 컴포넌트 `InspirationGenerator`와 그 자식 컴포넌트 `FancyText`는 클라이언트 컴포넌트입니다.

<DeepDive>
#### 어떻게 `FancyText`는 서버 컴포넌트이면서 클라이언트 컴포넌트인가요? {/*how-is-fancytext-both-a-server-and-a-client-component*/}

위 정의에 따르면 `FancyText` 컴포넌트는 서버 컴포넌트이자 클라이언트 컴포넌트입니다. 어떻게 그럴 수 있을까요?

우선, "컴포넌트"라는 용어가 그다지 정확하지 않다는 점을 분명히 해 두겠습니다. "컴포넌트"를 이해할 수 있는 두 가지 방법이 있습니다.

1. "컴포넌트"는 **컴포넌트 정의**를 가리킬 수 있습니다. 대부분의 경우 이것은 함수일 것입니다.

```js
// This is a definition of a component
function MyComponent() {
  return <p>My Component</p>
}
```

2. "컴포넌트"는 그 정의의 **컴포넌트 사용**을 참조할 수 있습니다.
```js
import MyComponent from './MyComponent';

function App() {
  // This is a usage of a component
  return <MyComponent />;
}
```

개념을 설명할 때 종종 부정확성은 중요하지 않지만, 이 경우에는 중요합니다.

서버 또는 클라이언트 컴포넌트에 관해 이야기할 때, 컴포넌트 사용을 언급하고 있습니다.

* 컴포넌트가 `'use client'` 지시어가 있는 모듈에서 정의되었거나 컴포넌트가 클라이언트에서 가져와 호출된다면 그 컴포넌트 사용은 클라이언트 컴포넌트입니다.
* 그렇지 않은 경우 컴포넌트 사용은 서버 컴포넌트입니다.


<Diagram name="use_client_render_tree" height={150} width={450} alt="A tree graph where each node represents a component and its children as child components. The top-level node is labelled 'App' and it has two child components 'InspirationGenerator' and 'FancyText'. 'InspirationGenerator' has two child components, 'FancyText' and 'Copyright'. Both 'InspirationGenerator' and its child component 'FancyText' are marked to be client-rendered.">렌더 트리는 컴포넌트 사용을 보여줍니다.</Diagram>

`FancyText`에 관한 질문으로 돌아가서 이 컴포넌트 정의에는 `'use client'` 지시어가 없으며 두 가지 사용 방법이 있습니다.

`FancyText`를 `App`의 자식으로 사용하면 서버 컴포넌트로 사용할 수 있습니다. `FancyText`를 가져와서 `InspirationGenerator`에서 호출할 때 `InspirationGenerator`에 `'use client'` 지시어가 포함되어 있으므로 `FancyText`의 사용은 클라이언트 컴포넌트입니다.

이는 `FancyText`에 대한 컴포넌트 정의가 서버에서 평가되고 클라이언트 컴포넌트 사용을 렌더링하기 위해 클라이언트에서 내려받게 된다는 것을 의미합니다.

</DeepDive>

<DeepDive>

#### 왜 `Copyright`가 서버 컴포넌트인가요? {/*why-is-copyright-a-server-component*/}

`Copyright` 컴포넌트가 클라이언트 컴포넌트 `InspirationGenerator`의 자식으로 렌더링 되지만 이것이 서버 컴포넌트라는 사실에 놀랄 수 있습니다.

`'use client'` 지시어는 _모듈 종속성 트리_(렌더 트리가 아닌)에서 서버와 클라이언트 코드 간의 경계를 정의한다는 점을 기억하세요.

<Diagram name="use_client_module_dependency" height={200} width={500} alt="A tree graph with the top node representing the module 'App.js'. 'App.js' has three children: 'Copyright.js', 'FancyText.js', and 'InspirationGenerator.js'. 'InspirationGenerator.js' has two children: 'FancyText.js' and 'inspirations.js'. The nodes under and including 'InspirationGenerator.js' have a yellow background color to signify that this sub-graph is client-rendered due to the 'use client' directive in 'InspirationGenerator.js'.">
`'use client'` 지시어는 모듈 종속성 트리에서 서버와 클라이언트 코드의 경계를 정의합니다.
</Diagram>

모듈 종속성 트리에서 `App.js`는 `Copyright.js` 모듈로부터 `Copyright`를 가져와 호출합니다. `Copyright.js`에는 `'use client'` 지시어가 없기 때문에 컴포넌트 사용이 서버에서 렌더링 됩니다. `App`은 루트 컴포넌트로 서버에서 렌더링 됩니다.

클라이언트 컴포넌트는 JSX를 props로 전달할 수 있기 때문에 서버 컴포넌트를 렌더링할 수 있습니다. 이 경우 `InspirationGenerator`는 `Copyright`를 [자식](/learn/passing-props-to-a-component#passing-jsx-as-children)으로 받습니다. 그러나 `InspirationGenerator` 모듈은 `Copyright` 모듈을 직접 가져오거나 컴포넌트를 호출하지 않으며 이 모든 작업은 `App`에 의해 실행됩니다. 실제로 `InspirationGenerator`가 렌더링을 시작하기 전에 `Copyright` 컴포넌트는 완전히 실행됩니다.

중요한 점은 부모-자식 간의 렌더링 관계가 동일한 렌더링 환경을 보장하지 않는다는 것입니다.

</DeepDive>

### `'use client'`의 사용 시기 {/*when-to-use-use-client*/}

`'use client'`를 사용하면 컴포넌트가 클라이언트 컴포넌트인지 확인할 수 있습니다. 서버 컴포넌트가 기본값이므로 클라이언트에서 렌더링할 것을 표시해야 하는 시기를 결정하기 위해 서버 컴포넌트의 장단점을 간단히 살펴보겠습니다.

간략화를 위해 서버 컴포넌트에 관해 이야기하지만, 서버에서 실행되는 앱의 모든 코드에는 동일한 원칙이 적용됩니다.

#### 서버 컴포넌트의 장점 {/*advantages*/}
* 서버 컴포넌트는 클라이언트가 전송하고 실행하는 코드양을 줄일 수 있습니다. 클라이언트 모듈만 번들링 되고 클라이언트에서 평가됩니다.
* 서버 컴포넌트는 서버에서 실행할 때 이점이 있습니다. 로컬 파일 시스템에 접근할 수 있으며 데이터 가져오기 및 네트워크 요청에 대한 짧은 지연 시간을 경험할 수 있습니다.

#### 서버 컴포넌트의 한계 {/*limitations*/}
* 클라이언트에서 이벤트 핸들러를 등록하고 트리거해야 하므로 서버 컴포넌트는 상호작용을 지원할 수 없습니다.
  * 예를 들어 `onClick`과 같은 이벤트 핸들러는 클라이언트 컴포넌트에서만 정의할 수 있습니다.
* 서버 컴포넌트는 대부분의 Hook을 사용할 수 없습니다.
  * 서버 컴포넌트가 렌더링 되면 그 출력은 기본적으로 클라이언트가 렌더링할 컴포넌트 목록입니다. 서버 컴포넌트는 렌더링 후 메모리에 유지되지 않으며 자체 상태를 가질 수 없습니다.

### 서버 컴포넌트에서 반환되는 직렬화 가능한 유형 {/*serializable-types*/}

React 앱에서와 같이 부모 컴포넌트는 자식 컴포넌트에 데이터를 전달합니다. 서로 다른 환경에서 렌더링 되므로 서버 컴포넌트에서 클라이언트 컴포넌트로 데이터를 전달하는 것은 추가적인 고려 사항이 필요합니다.

서버 컴포넌트에서 클라이언트 컴포넌트로 전달되는 prop 값은 직렬화할 수 있어야 합니다.

직렬화할 수 있는 props는 다음과 같습니다.
* 원시 자료형
	* [string](https://developer.mozilla.org/en-US/docs/Glossary/String)
	* [number](https://developer.mozilla.org/en-US/docs/Glossary/Number)
	* [bigint](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
	* [boolean](https://developer.mozilla.org/en-US/docs/Glossary/Boolean)
	* [undefined](https://developer.mozilla.org/en-US/docs/Glossary/Undefined)
	* [null](https://developer.mozilla.org/en-US/docs/Glossary/Null)
	* [symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) ( [`Symbol.for`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for)을 통해 글로벌 심볼 레지스트리에 등록된 심볼만 해당 )
* 직렬화할 수 있는 값을 포함하는 이터러블
	* [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
	* [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
	* [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
	* [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
	* [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 및 [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
* [Date 객체](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
* 일반 [객체](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) (직렬화할 수 있는 properties를 사용하여 [객체 이니셜라이저](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer)로 생성된 객체)
* [서버 액션](/reference/react/use-server)으로서의 함수
* 클라이언트 또는 서버 컴포넌트 요소(JSX)
* [프로미스](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

단, 다음은 지원되지 않습니다.
* 클라이언트로 표시된 모듈에서 내보내지 않았거나 [`'use server'`](/reference/react/use-server)로 표시된 [함수](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
* [클래스](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Classes_in_JavaScript)
* 위에서 언급한 내장형 클래스의 인스턴스가 아닌 객체 혹은 [null 프로토타입](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects)을 가진 객체
* 글로벌하게 등록되지 않은 symbol (예: `Symbol('my new symbol')`)


## 사용법 {/*usage*/}

### 상호작용과 상태를 가진 컴포넌트 구축 {/*building-with-interactivity-and-state*/}

<Sandpack>

```js src/App.js
'use client';

import { useState } from 'react';

export default function Counter({initialValue = 0}) {
  const [countValue, setCountValue] = useState(initialValue);
  const increment = () => setCountValue(countValue + 1);
  const decrement = () => setCountValue(countValue - 1);
  return (
    <>
      <h2>Count Value: {countValue}</h2>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
    </>
  );
}
```

</Sandpack>

`Counter`에는 값을 증가시키거나 감소시키기 위해 `useState` Hook과 이벤트 핸들러가 모두 필요하므로 이 컴포넌트는 클라이언트 컴포넌트여야 하며 파일 최상단에 `'use client'` 지시어가 필요합니다.

반면에 상호작용 없이 UI를 렌더링하는 컴포넌트는 클라이언트 컴포넌트일 필요가 없습니다.

```js
import { readFile } from 'node:fs/promises';
import Counter from './Counter';

export default async function CounterContainer() {
  const initialValue = await readFile('/path/to/counter_value');
  return <Counter initialValue={initialValue} />
}
```

예를 들어, `Counter`의 상위 컴포넌트인 `CounterContainer`는 상호작용이 없고 state를 사용하지 않기 때문에 `'use client'`가 사용할 필요가 없습니다. 또한 `CounterContainer`는 서버의 로컬 파일 시스템에서 읽어야 하므로 이가 가능한 서버 컴포넌트여야만 합니다.

서버나 클라이언트 전용 기능을 사용하지 않고 렌더링 위치에 구애받지 않는 컴포넌트도 있습니다. 앞서 예로 든 `FancyText`가 그러한 컴포넌트 중 하나입니다.

```js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

이 경우 `'use client'` 지시어를 추가하지 않으면 `FancyText`의 _산출물_(소스 코드가 아닌)이 서버 컴포넌트에서 참조될 때 브라우저로 전송됩니다. 앞서 Inspirations 앱 예제에서 보여준 것처럼 `FancyText`는 가져오고 사용되는 위치에 따라 서버 또는 클라이언트 컴포넌트로 사용됩니다.

하지만 `FancyText`의 HTML 출력이 종속성을 포함한 소스 코드에 비해 크다면, 항상 클라이언트 컴포넌트로 강제하는 것이 더 효율적일 수 있습니다. 한 예로 긴 SVG 경로 문자열을 반환하는 컴포넌트를 클라이언트 컴포넌트로 강제하는 것이 더 효율적일 수 있는 것처럼 말입니다.

### 클라이언트 API 사용 {/*using-client-apis*/}

React 앱에서는 웹 스토리지, 오디오 및 비디오 조작, 하드웨어 장치 등과 같은 [브라우저의 API](https://developer.mozilla.org/en-US/docs/Web/API)를 포함한 클라이언트 특정 API를 사용할 수 있습니다.

이 예제에서 컴포넌트는 [DOM API](https://developer.mozilla.org/en-US/docs/Glossary/DOM)를 사용해 [`canvas`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas) 요소를 조작합니다. 이러한 API는 브라우저에서만 사용할 수 있으므로 클라이언트 컴포넌트로 표시되어야 합니다.

```js
'use client';

import {useRef, useEffect} from 'react';

export default function Circle() {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const canvas = ref.current;
    const context = canvas.getContext('2d');
    context.reset();
    context.beginPath();
    context.arc(100, 75, 50, 0, 2 * Math.PI);
    context.stroke();
  });
  return <canvas ref={ref} />;
}
```

### 서드파티 라이브러리 사용 {/*using-third-party-libraries*/}

React 앱에서는 서드파티 라이브러리를 활용하여 일반적인 UI 패턴이나 로직을 처리하는 경우가 많습니다.

이러한 라이브러리들은 컴포넌트 Hook이나 클라이언트 API에 의존할 수 있습니다. 다음 React API를 사용하는 서드파티 컴포넌트는 클라이언트에서 실행되어야 합니다.
* [createContext](/reference/react/createContext)
* [`use`](/reference/react/use) 및 [`useId`](/reference/react/useId)를 제외한 [`react`](/reference/react/hooks)와 [`react-dom`](/reference/react-dom/hooks)의 Hook
* [forwardRef](/reference/react/forwardRef)
* [memo](/reference/react/memo)
* [startTransition](/reference/react/startTransition)
* 클라이언트 API를 사용하는 경우(예: Dom 삽입 혹은 네이티브 플랫폼 뷰 등)

이 라이브러리들이 React 서버 컴포넌트와 호환되도록 업데이트되었다면 이미 `'use client'`를 포함하고 있어 서버 컴포넌트에서 직접 사용할 수 있습니다. 라이브러리가 업데이트되지 않았거나 컴포넌트가 클라이언트에서만 지정할 수 있는 이벤트 핸들러와 같은 props가 필요한 경우 사용할 서드파티 클라이언트 컴포넌트와 서버 컴포넌트 사이에 자체 클라이언트 컴포넌트 파일을 추가해야 할 수 있습니다.

[TODO]: <> (Troubleshooting - need use-cases)
