---
id: code-splitting
title: 코드 분할
permalink: docs/code-splitting.html
---

## 번들링 {#bundling}

대부분 React 앱들은 [Webpack](https://webpack.js.org/), [Rollup](https://rollupjs.org/) 또는 [Browserify](http://browserify.org/) 같은 툴을 사용하여 여러 파일을 하나로 병합한 "번들 된" 파일을 웹 페이지에 포함하여 한 번에 전체 앱을 로드 할 수 있습니다.

#### 예시 {#example}

**App**

```js
// app.js
import { add } from './math.js';

console.log(add(16, 26)); // 42
```

```js
// math.js
export function add(a, b) {
  return a + b;
}
```

**Bundle**

```js
function add(a, b) {
  return a + b;
}

console.log(add(16, 26)); // 42
```

> 주의
>
> 실제 번들은 위 예시와는 많이 다르게 보일 겁니다.

[Create React App](https://create-react-app.dev/)이나 [Next.js](https://nextjs.org/), [Gatsby](https://www.gatsbyjs.org/) 혹은 비슷한 툴을 사용한다면 여러분이 설치한 앱에서 Webpack을 같이 설치했을 겁니다.

이런 툴을 사용하지 않는다면 여러분이 스스로 번들링을 설정해야 합니다. 이 경우 Webpack의 [설치하기](https://webpack.js.org/guides/installation/) 문서와 [시작하기](https://webpack.js.org/guides/getting-started/) 문서를 참조해 주세요.

## 코드 분할 {#code-splitting}

번들링은 훌륭하지만 여러분의 앱이 커지면 번들도 커집니다. 특히 큰 규모의 서드 파티 라이브러리를 추가할 때 실수로 앱이 커져서 로드 시간이 길어지는 것을 방지하기 위해 코드를 주의 깊게 살펴야 합니다.

번들이 거대해지는 것을 방지하기 위한 좋은 해결방법은 번들을 "나누는" 것입니다. 코드 분할은 런타임에 여러 번들을 동적으로 만들고 불러오는 것으로 [Webpack](https://webpack.js.org/guides/code-splitting/), [Rollup](https://rollupjs.org/guide/en/#code-splitting)과 Browserify ([factor-bundle](https://github.com/browserify/factor-bundle)) 같은 번들러가 지원하는 기능입니다.

코드 분할은 여러분의 앱을 "지연 로딩" 하게 도와주고 앱 사용자에게 획기적인 성능 향상을 하게 합니다. 앱의 코드 양을 줄이지 않고도 사용자가 필요하지 않은 코드를 불러오지 않게 하며 앱의 초기화 로딩에 필요한 비용을 줄여줍니다.

## `import()` {#import}

 앱에 코드 분할을 도입하는 가장 좋은 방법은 동적 `import()` 문법을 사용하는 방법입니다.

**Before**

```js
import { add } from './math';

console.log(add(16, 26));
```

**After**

```js
import("./math").then(math => {
  console.log(math.add(16, 26));
});
```

Webpack이 이 구문을 만나게 되면 앱의 코드를 분할합니다. Create React App을 사용하고 있다면 이미 Webpack이 구성이 되어 있기 때문에 즉시 [사용](https://create-react-app.dev/docs/code-splitting/)할 수 있습니다. [Next.js](https://nextjs.org/docs/advanced-features/dynamic-import) 역시 지원합니다.

[코드 분할 가이드](https://webpack.js.org/guides/code-splitting/)를 참조하세요. Webpack 설정은 [가이드](https://gist.github.com/gaearon/ca6e803f5c604d37468b0091d9959269)에 있습니다.

[Babel](http://babeljs.io/)을 사용할 때는 Babel이 동적 import를 인식할 수 있지만 변환하지는 않도록 합니다. 이를 위해 [@babel/plugin-syntax-dynamic-import](https://classic.yarnpkg.com/en/package/@babel/plugin-syntax-dynamic-import)를 사용하세요.

## `React.lazy` {#reactlazy}

`React.lazy` 함수를 사용하면 동적 import를 사용해서 컴포넌트를 렌더링 할 수 있습니다.

**Before**

```js
import OtherComponent from './OtherComponent';
```

**After**

```js
const OtherComponent = React.lazy(() => import('./OtherComponent'));
```
`MyComponent`가 처음 렌더링 될 때 `OtherComponent`를 포함한 번들을 자동으로 불러옵니다.

`React.lazy`는 동적 `import()`를 호출하는 함수를 인자로 가집니다. 이 함수는 React 컴포넌트를 `default` export로 가진 모듈 객체가 이행되는 `Promise`를 반환해야 합니다.

lazy 컴포넌트는 `Suspense` 컴포넌트 하위에서 렌더링되어야 하며, `Suspense`는 lazy 컴포넌트가 로드되길 기다리는 동안 로딩 화면과 같은 예비 컨텐츠를 보여줄 수 있게 해줍니다.

```js
import React, { Suspense } from 'react';

const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <OtherComponent />
      </Suspense>
    </div>
  );
}
```

`fallback` prop은 컴포넌트가 로드될 때까지 기다리는 동안 렌더링하려는 React 엘리먼트를 받아들입니다. `Suspense` 컴포넌트는 lazy 컴포넌트를 감쌉니다. 하나의 `Suspense` 컴포넌트로 여러 lazy 컴포넌트를 감쌀 수도 있습니다.


```js
import React, { Suspense } from 'react';

const OtherComponent = React.lazy(() => import('./OtherComponent'));
const AnotherComponent = React.lazy(() => import('./AnotherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <section>
          <OtherComponent />
          <AnotherComponent />
        </section>
      </Suspense>
    </div>
  );
}
```

### Avoiding fallbacks {#avoiding-fallbacks}
사용자에게 이미 표시된 컴포넌트를 포함하여, 어떤 컴포넌트는 렌더링의 결과가 중지될 수 있습니다. 화면 콘텐츠가 항상 일관되기 위해서, 만약에 이미 표시된 컴포넌트를 중지하려면,  React는 가장 가까운 `<Suspense>` 영역에 트리 형태로 숨기도록 해야 합니다. 그러나 사용자의 관점에서, 이것은 혼란스러울 수 있습니다.

이 탭으로 전환을 고려해보세요: 

```js
import React, { Suspense } from 'react';
import Tabs from './Tabs';
import Glimmer from './Glimmer';

const Comments = React.lazy(() => import('./Comments'));
const Photos = React.lazy(() => import('./Photos'));

function MyComponent() {
  const [tab, setTab] = React.useState('photos');
  
  function handleTabSelect(tab) {
    setTab(tab);
  };

  return (
    <div>
      <Tabs onTabSelect={handleTabSelect} />
      <Suspense fallback={<Glimmer />}>
        {tab === 'photos' ? <Photos /> : <Comments />}
      </Suspense>
    </div>
  );
}

```

이 예에서, 탭이 `'photos'`에서 `'comments'`로 변경되면, `댓글`이 정지되지만, 사용자는 잔상을 볼것입니다. 이것은 사용자가 더 이상 `사진`을 보고 싶어하지 않고, `댓글` 컴포넌트는 어떤한 렌더링할 준비가 되지 않았기 때문에, React는 사용자 경험을 일관되게 유지하는 것이 필요해서, 위에 `Glimmer` 표시하는 것 외에 선택의 여지가 없다는 것을 의미한다.

그러나 때때로 이러한 사용자 경험은 바람직하지 않습니다. 특히 새 UI를 준비하는 동안 "이전" UI를 표시하는 것이 더 나은 경우가 있습니다. 새로운 [`startTransition`](/docs/react-api.html#starttransition) API를 사용하여 React가 다음을 수행하도록 할 수 있습니다.

```js
function handleTabSelect(tab) {
  startTransition(() => {
    setTab(tab);
  });
}
```

여기서 탭을 `'comments'`로 설정하는 것은 긴급 업데이트가 아니라 시간이 걸릴 수 있는 [transition](/docs/react-api.html#transitions)임을 React에 알려줍니다. React는 그런 다음 이전 UI를 제자리에 유지하고 상호작용하면서 준비가 되면 `<Comments />` 표시로 전환합니다. 자세한 내용은 [Transitions](/docs/react-api.html#transitions)을 참조하세요.

### Error boundaries {#error-boundaries}
네트워크 장애 같은 이유로 다른 모듈을 로드에 실패할 경우 에러를 발생시킬 수 있습니다. 이때 [Error Boundaries](/docs/error-boundaries.html)를 이용하여 사용자의 경험과 복구 관리를 처리할 수 있습니다.
Error Boundary를 만들고 lazy 컴포넌트를 감싸면 네트워크 장애가 발생했을 때 에러를 표시할 수 있습니다.

```js
import React, { Suspense } from 'react';
import MyErrorBoundary from './MyErrorBoundary';

const OtherComponent = React.lazy(() => import('./OtherComponent'));
const AnotherComponent = React.lazy(() => import('./AnotherComponent'));

const MyComponent = () => (
  <div>
    <MyErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <section>
          <OtherComponent />
          <AnotherComponent />
        </section>
      </Suspense>
    </MyErrorBoundary>
  </div>
);
```

## Route-based code splitting {#route-based-code-splitting}

앱에 코드 분할을 어느 곳에 도입할지 결정하는 것은 조금 까다롭습니다. 여러분은 사용자의 경험을 해치지 않으면서 번들을 균등하게 분배할 곳을 찾고자 합니다.

이를 시작하기 좋은 장소는 라우트입니다. 웹 페이지를 불러오는 시간은 페이지 전환에 어느 정도 발생하며 대부분 페이지를 한번에 렌더링하기 때문에 사용자가 페이지를 렌더링하는 동안 다른 요소와 상호작용하지 않습니다.

`React.lazy`를 [React Router](https://reacttraining.com/react-router/) 라이브러리를 사용해서 애플리케이션에 라우트 기반 코드 분할을 설정하는 예시입니다.

```js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));

const App = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Suspense>
  </Router>
);
```

## Named Exports {#named-exports}

`React.lazy`는 현재 default exports만 지원합니다. named exports를 사용하고자 한다면 default로 이름을 재정의한 중간 모듈을 생성할 수 있습니다. 이렇게 하면 tree shaking이 계속 동작하고 사용하지 않는 컴포넌트는 가져오지 않습니다.

```js
// ManyComponents.js
export const MyComponent = /* ... */;
export const MyUnusedComponent = /* ... */;
```

```js
// MyComponent.js
export { MyComponent as default } from "./ManyComponents.js";
```

```js
// MyApp.js
import React, { lazy } from 'react';
const MyComponent = lazy(() => import("./MyComponent.js"));
```
