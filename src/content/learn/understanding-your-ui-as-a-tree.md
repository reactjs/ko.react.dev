---
title: 트리로서 UI 이해하기
---

<Intro>

React 앱은 서로 중첩된 많은 컴포넌트로 구성되어 있습니다. React는 어떻게 앱의 컴포넌트 구조를 추적할까요?

React와 많은 다른 UI 라이브러리는 UI를 트리로 모델링합니다. 애플리케이션을 트리로 생각하면 컴포넌트 간의 관계를 이해하는 데 도움이 됩니다. 이러한 이해는 성능과 상태 관리와 같이 앞으로 배울 개념을 디버깅하는 데 도움이 될 것입니다.

</Intro>

<YouWillLearn>

* React가 컴포넌트 구조를 "이해하는" 방법
* 렌더 트리가 무엇이고 어떤 용도로 사용되는지
* 모듈 의존성 트리가 무엇이고 어떤 용도로 사용되는지

</YouWillLearn>

## 트리로서의 UI {/*your-ui-as-a-tree*/}

트리는 요소와 UI 사이의 관계 모델이며 UI는 종종 트리 구조를 사용하여 표현됩니다. 예를 들어, 브라우저는 HTML ([DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction))과 CSS ([CSSOM](https://developer.mozilla.org/docs/Web/API/CSS_Object_Model))를 모델링하기 위해 트리 구조를 사용합니다. 모바일 플랫폼도 뷰 계층 구조를 나타내는 데 트리를 사용합니다.

<Diagram name="preserving_state_dom_tree" height={193} width={864} alt="세 개의 섹션을 수평으로 배열한 다이어그램. 첫 번째 섹션에는 '컴포넌트 A', '컴포넌트 B' 및 '컴포넌트 C' 레이블의 세 개의 직사각형이 수직으로 쌓여있습니다. 상단에 'React' 레이블과 React 로고가 있는 화살표가 다음 창을 가리킵니다. 중간 섹션에는 컴포넌트의 트리가 포함되어 있으며 최상위에는 'A' 레이블이 있고 두 개의 자식에는 'B' 와 'C' 레이블이 있습니다. 다음 섹션은 'React' 레이블과 React 로고가 있는 화살표로 전환됩니다. 세 번째이자 마지막 섹션은 브라우저의 와이어프레임으로 8개의 노드로 구성된 트리를 포함하고 있으며, 부분집합만 강조 표시되어 있습니다(중간 섹션에서 하위 트리를 나타냅니다).">

React는 컴포넌트로부터 UI 트리를 생성합니다. 이 예에서 UI 트리는 DOM을 렌더링하는 데 사용됩니다.
</Diagram>

브라우저와 모바일 플랫폼처럼 React도 React 앱의 컴포넌트 간의 관계를 관리하고 모델링하기 위해 트리 구조를 사용합니다. 트리는 React 앱에서 데이터가 흐르는 방식과 렌더링 및 앱 크기를 최적화하는 방법을 이해하는 데 유용한 도구입니다.

## 렌더 트리 {/*the-render-tree*/}

컴포넌트의 주요 특징은 다른 컴포넌트의 컴포넌트를 구성하는 것입니다. [컴포넌트를 중첩](/learn/your-first-component#nesting-and-organizing-components)하면 부모 컴포넌트와 자식 컴포넌트의 개념이 생기며, 각 부모 컴포넌트는 다른 컴포넌트의 자식이 될 수 있습니다.

React 앱을 렌더링할 때, 이 관계를 렌더 트리라고 알려진 트리로 모델링할 수 있습니다.

아래는 명언을 렌더링하는 React 앱입니다.

<Sandpack>

```js App.js
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

```js FancyText.js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

```js InspirationGenerator.js
import * as React from 'react';
import quotes from './quotes';
import FancyText from './FancyText';

export default function InspirationGenerator({children}) {
  const [index, setIndex] = React.useState(0);
  const quote = quotes[index];
  const next = () => setIndex((index + 1) % quotes.length);

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

```js Copyright.js
export default function Copyright({year}) {
  return <p className='small'>©️ {year}</p>;
}
```

```js quotes.js
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

<Diagram name="render_tree" height={250} width={500} alt="다섯 개의 노드가 있는 트리 그래프입니다. 각 노드는 컴포넌트를 나타냅니다. 트리의 루트는 앱이며, 두 개의 화살표가 여기에서 'InspirationGenerator'와 'FancyText'로 확장됩니다. 화살표에는 'renders'라는 레이블이 표시됩니다. 'InspirationGenerator' 노드에는 'FancyText'와 'Copyright' 노드를 가리키는 두 개의 화살표가 있습니다.">

React는 렌더링된 컴포넌트로 구성된 UI 트리인 *렌더 트리*를 생성합니다.

</Diagram>

예시 앱에서, 우리는 위의 렌더 트리를 구성할 수 있습니다.

트리는 노드로 구성되어 있으며, 각 노드는 컴포넌트를 나타냅니다. `App`, `FancyText`, `Copyright` 등은 모두 트리의 노드입니다.

React 렌더 트리에서 루트 노드는 앱의 [Root 컴포넌트](/learn/importing-and-exporting-components#the-root-component-file)입니다. 이 경우 루트 컴포넌트는 `App`이며 React가 렌더링하는 첫 번째 컴포넌트입니다. 트리의 각 화살표는 부모 컴포넌트에서 자식 컴포넌트를 가리킵니다.

<DeepDive>

#### 렌더 트리에 HTML 태그는 어디에 있나요? {/*where-are-the-html-elements-in-the-render-tree*/}

위의 렌더 트리에서 각 컴포넌트가 렌더링하는 HTML 태그에 대한 언급이 없음을 알 수 있습니다. 이는 렌더 트리가 React [컴포넌트](learn/your-first-component#components-ui-building-blocks)로만 구성되어 있기 때문입니다.

UI 프레임워크로서 React는 플랫폼에 독립적입니다. react.dev에서는 HTML 마크업을 UI 기본 요소로 사용하는 웹을 렌더링하는 예제를 보여줍니다. 하지만 React 앱은 모바일이나 데스크톱 플랫폼에 렌더링 될 수 있으며, 이러한 플랫폼은 [UIView](https://developer.apple.com/documentation/uikit/uiview)나 [FrameworkElement](https://learn.microsoft.com/en-us/dotnet/api/system.windows.frameworkelement?view=windowsdesktop-7.0)와 같은 다른 UI 기본 요소를 사용할 수 있습니다.

이러한 플랫폼 UI 기본 요소는 React의 일부가 아닙니다. React 렌더 트리는 앱이 렌더링되는 플랫폼에 관계없이 React 앱에 대한 통찰력을 제공할 수 있습니다.

</DeepDive>

렌더 트리는 React 앱의 단일 렌더링을 나타냅니다. [조건부 렌더링](/learn/conditional-rendering)을 사용하면 부모 컴포넌트가 전달된 데이터에 따라 다른 자식을 렌더링할 수 있습니다.

우리는 앱을 업데이트하여 명언이나 색상을 조건부로 렌더링할 수 있습니다.

<Sandpack>

```js App.js
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

```js FancyText.js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

```js Color.js
export default function Color({value}) {
  return <div className="colorbox" style={{backgroundColor: value}} />
}
```

```js InspirationGenerator.js
import * as React from 'react';
import inspirations from './inspirations';
import FancyText from './FancyText';
import Color from './Color';

export default function InspirationGenerator({children}) {
  const [index, setIndex] = React.useState(0);
  const inspiration = inspirations[index];
  const next = () => setIndex((index + 1) % inspirations.length);

  return (
    <>
      <p>Your inspirational {inspiration.type} is:</p>
      {inspiration.type === 'quote'
      ? <FancyText text={inspiration.value} />
      : <Color value={inspiration.value} />}

      <button onClick={next}>Inspire me again</button>
      {children}
    </>
  );
}
```

```js Copyright.js
export default function Copyright({year}) {
  return <p className='small'>©️ {year}</p>;
}
```

```js inspirations.js
export default [
  {type: 'quote', value: "Don’t let yesterday take up too much of today.” — Will Rogers"},
  {type: 'color', value: "#B73636"},
  {type: 'quote', value: "Ambition is putting a ladder against the sky."},
  {type: 'color', value: "#256266"},
  {type: 'quote', value: "A joy that's shared is a joy made double."},
  {type: 'color', value: "#F9F2B4"},
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
.colorbox {
  height: 100px;
  width: 100px;
  margin: 8px;
}
```
</Sandpack>

<Diagram name="conditional_render_tree" height={250} width={561} alt="6개의 노드가 있는 트리 그래프. 트리의 맨 위 노드에는 'App'이라는 이름이 붙고, 두 개의 화살표가 'InspirationGenerator'와 'FancyText'라는 이름의 노드로 확장됩니다. 화살표는 실선이며 'renders'라고 표시됩니다. 'InspirationGenerator' 노드에도 세 개의 화살표가 있습니다. 'FancyText'와 'Color' 노드의 화살표는 점선으로 표시되고 'renders?'로 표시됩니다. 마지막 화살표는 'Copyright'라는 이름의 노드를 가리키고, 실선으로 표시되고 'renders'로 표시됩니다.">

조건부 렌더링을 사용하면, 서로 다른 렌더링에서 렌더 트리가 다른 컴포넌트를 렌더링할 수 있습니다.

</Diagram>

이 예시에서, `inspiration.type`이 무엇이냐에 따라 `<FancyText>` 또는 `<Color>`를 렌더링할 수 있습니다. 렌더 트리는 각 렌더링마다 다를 수 있습니다.

렌더 트리가 렌더링 단계마다 다를 수 있지만, 이 트리는 React 앱에서 최상위 컴포넌트와 리프 컴포넌트가 무엇인지를 식별하는 데 도움이 됩니다. 최상위 컴포넌트는 루트 컴포넌트에 가장 가까운 컴포넌트이며, 그 아래의 모든 컴포넌트의 렌더링 성능에 영향을 미치며, 가장 복잡성이 높습니다. 리프 컴포넌트는 트리의 맨 아래에 있으며 자식 컴포넌트가 없으며 자주 다시 렌더링 됩니다.

이 컴포넌트 카테고리를 식별하는 것은 앱의 데이터 흐름과 성능을 이해하는 데 유용합니다.

## 모듈 의존성 트리 {/*the-module-dependency-tree*/}

트리로 모델링 할 수 있는 React 앱의 다른 관계는 앱의 모듈 의존성입니다. [컴포넌트를 분리](/learn/importing-and-exporting-components#exporting-and-importing-a-component)하고 로직을 별도의 파일로 분리하면 컴포넌트, 함수 또는 상수를 내보내는 [JS 모듈](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)을 만들 수 있습니다.

모듈 의존성 트리의 각 노드는 모듈이며, 각 가지는 해당 모듈의 `import` 문을 나타냅니다.

이전의 영감 앱을 사용하면 모듈 의존성 트리 또는 줄여서 의존성 트리를 구축할 수 있습니다.

<Diagram name="module_dependency_tree" height={250} width={658} alt="7개의 노드가 있는 트리 그래프. 각 노드는 모듈 이름으로 레이블됩니다. 트리의 최상위 노드는 'App.js'로 레이블이 표시됩니다. 모듈 'InspirationGenerator.js', 'FancyText.js' 및 'Copyright.js'를 가리키는 세 개의 화살표가 있고 화살표는 'imports'로 레이블이 표시됩니다. InspirationGenerator.js' 노드에서 'FancyText.js', 'Color.js' 및 'inspirations.js'의 세 개의 모듈로 확장되는 세 개의 화살표가 있습니다. 화살표는 'imports'로 레이블이 표시됩니다.">

영감 앱의 모듈 의존성 트리입니다.

</Diagram>

트리의 루트 노드는 루트 모듈이며, 엔트리 포인트 파일이라고도 합니다. 일반적으로 루트 컴포넌트를 포함하는 모듈입니다.

동일한 앱의 렌더 트리와 비교하면 유사한 구조가 있지만 몇 가지 차이점이 있습니다.

* 트리를 구성하는 노드는 컴포넌트가 아닌 모듈을 나타냅니다.
* `inspirations.js`와 같은 컴포넌트가 아닌 모듈도 이 트리에 나타납니다. 렌더 트리는 컴포넌트만 캡슐화합니다.
* `Copyright.js`가 `App.js` 아래에 나타나지만, 렌더 트리에서 `Copyright` 컴포넌트는 `InspirationGenerator`의 자식으로 나타납니다. 이는 `InspirationGenerator`가 [자식 props](/learn/passing-props-to-a-component#passing-jsx-as-children)로 JSX를 허용하기 때문에, `Copyright`를 자식 컴포넌트로 렌더링하지만 모듈을 가져오지는 않기 때문입니다.

의존성 트리는 React 앱을 실행하는 데 필요한 모듈을 결정하는 데 유용합니다. React 앱을 프로덕션용으로 빌드할 때, 일반적으로 클라이언트에 제공할 모든 필요 JavaScript를 번들로 묶는 빌드 단계가 있습니다. 이 작업을 담당하는 도구를 [번들러](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Understanding_client-side_tools/Overview#the_modern_tooling_ecosystem)라고 하며, 번들러는 의존성 트리를 사용하여 포함해야 할 모듈을 결정합니다.

앱이 커짐에 따라 번들 크기도 커집니다. 번들 크기가 커지면 클라이언트가 다운로드하고 실행하는 데 드는 비용도 커집니다. 또한 UI가 그려지는 데 시간이 지체될 수 있습니다. 앱의 의존성 트리를 파악하면 이러한 문제를 디버깅하는 데 도움이 될 수 있습니다.

[comment]: <> (perhaps we should also deep dive on conditional imports)

<Recap>

* 트리는 요소 간의 관계를 나타내는 일반적인 방법입니다. UI를 모델링하는 데 자주 사용됩니다.
* 렌더 트리는 단일 렌더링에서 React 컴포넌트 간의 중첩 관계를 나타냅니다.
* 조건부 렌더링을 사용하면 렌더 트리가 다른 렌더링에서 변경될 수 있습니다. 다른 prop 값으로 인해 컴포넌트가 다른 자식 컴포넌트를 렌더링할 수 있습니다.
* 렌더 트리는 최상위 컴포넌트와 리프 컴포넌트를 식별하는 데 도움이 됩니다. 최상위 컴포넌트는 그 아래의 모든 컴포넌트의 렌더링 성능에 영향을 미치며, 리프 컴포넌트는 자주 다시 렌더링됩니다. 이러한 컴포넌트를 식별하는 것은 렌더링 성능을 이해하고 디버깅하는 데 유용합니다.
* 의존성 트리는 React 앱의 모듈 의존성을 나타냅니다.
* 의존성 트리는 앱을 배포하기 위해 필요한 코드를 번들로 묶는 데 빌드 도구에서 사용됩니다.
* 의존성 트리는 느리게 페인트되는 큰 번들 크기를 디버깅하는 데 유용하며, 어떤 코드를 번들로 묶을지 최적화할 기회를 제공합니다.

</Recap>

[TODO]: <> (Add challenges)
