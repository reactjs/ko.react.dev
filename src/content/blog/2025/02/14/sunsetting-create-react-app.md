---
title: "Create React App 지원 종료"
author: Matt Carroll and Ricky Hanlon
date: 2025/02/14
description: 우리는 새로운 앱에 대한 Create React App 사용을 중단하며, 기존 앱은 프레임워크나 Vite, Parcel, RSBuild 같은 빌드 도구로의 마이그레이션을 권장합니다. 또한 프레임워크가 프로젝트와 맞지 않거나, 자신만의 프레임워크를 구축하고 싶거나, 혹은 React가 어떻게 동작하는지 직접 구축하며 배우고 싶은 사용자를 위한 문서를 제공합니다.
---

2025년 02월 14일, by [Matt Carroll](https://twitter.com/mattcarrollcode) and [Ricky Hanlon](https://bsky.app/profile/ricky.fm)

---

<Intro>

우리는 새로운 앱에 대한 [Create React App](https://create-react-app.dev/) 사용을 중단하며, 기존 앱은 프레임워크나 Vite, Parcel, RSBuild 같은 빌드 도구로의 [마이그레이션](#how-to-migrate-to-a-build-tool)을 권장합니다.

또한 프레임워크가 프로젝트와 맞지 않거나, 자신만의 프레임워크를 구축하고 싶거나, 혹은 React가 어떻게 동작하는지 직접 구축하며 배우고 싶은 사용자를 위한 [문서](https://react.dev/learn/build-a-react-app-from-scratch)를 제공합니다.

</Intro>

-----

2016년 Create React App이 처음 출시되었을 때는 React 앱을 새로 구축할 명확한 방법이 없었습니다.

당시 React 앱을 만들기 위해서는 JSX, linting, hot reloading과 같은 기본 기능을 지원하는 여러 도구를 직접 설치하고 연결해야 했습니다. 이는 올바르게 수행하기 매우 까다로웠기 때문에 [커뮤니티](https://github.com/react-boilerplate/react-boilerplate)에서는 [자주 사용](https://github.com/gaearon/react-hot-boilerplate) 되는 [설정](https://github.com/erikras/react-redux-universal-hot-example)에 대한 [보일러 플레이트](https://github.com/petehunt/react-boilerplate)를 [만들었습니다.](https://github.com/kriasoft/react-starter-kit) 하지만 보일러 플레이트는 업데이트하기 어렵고 조각화로 인해 React 팀이 새로운 기능을 배포하는 데 어려움이 많았습니다.

Create React App은 여러 도구를 하나의 권장 설정으로 통합하여 이러한 문제를 해결했습니다. 이로 인해 앱이 새로운 도구 기능으로 쉽게 업그레이드할 수 있게 되었으며, React 팀은 자명하지 않은 도구 변경(Fast Refresh 지원, React Hooks lint 규칙 등)를 가능한 많은 사용자에게 배포할 수 있었습니다.

이 모델은 매우 인기를 끌었고, 오늘날 비슷한 방식으로 작동하는 도구들이 하나의 카테고리를 형성할 정도가 되었습니다.

## Create React App의 사용 중단 {/*deprecating-create-react-app*/}

Create React App은 시작을 쉽게 해주지만, 고성능의 프로덕션 앱 구축을 어렵게 하는 [몇 가지 제한](#limitations-of-build-tools)이 있습니다. 원칙적으로는 이를 [프레임워크](#why-we-recommend-frameworks)로 발전시켜 해결할 수도 있습니다.

하지만 현재 Create React App은 적극적으로 관리하는 담당자가 없고, 이미 많은 기존 프레임워크들이 이러한 문제를 잘 해결하고 있기 때문에 사용을 중단하기로 결정했습니다.

오늘부터 새로운 앱 설치 시에는 사용 중단 경고 메시지가 표시됩니다.

<ConsoleBlockMulti>
<ConsoleLogLine level="error">

create-react-app is deprecated.
{'\n\n'}
You can find a list of up-to-date React frameworks on react.dev
For more info see: react.dev/link/cra
{'\n\n'}
This error message will only be shown once per install.

</ConsoleLogLine>
</ConsoleBlockMulti>

Create React App [웹사이트](https://create-react-app.dev/)와 [GitHub 저장소](https://github.com/facebook/create-react-app)에도 사용 중단 안내를 추가했습니다. Create React App은 유지 보수 모드로 계속 동작하며, React 19와 호환되는 새로운 버전을 배포했습니다.

## 프레임워크로 마이그레이션하는 방법 {/*how-to-migrate-to-a-framework*/}
React 앱을 프레임워크로 [새로 만들기](https://react.dev/learn/creating-a-react-app)를 권장합니다. 추천하는 모든 프레임워크는 클라이언트 측 렌더링([CSR](https://developer.mozilla.org/en-US/docs/Glossary/CSR))과 단일 페이지 앱([SPA](https://developer.mozilla.org/ko/docs/Glossary/SPA))을 지원하며, CDN 또는 정적 호스팅 서비스에 서버 없이 배포 가능합니다.

기존 앱의 경우 다음 안내서를 참고하여 클라이언트 전용 SPA로 마이그레이션할 수 있습니다.

* [Next.js의 Create React App 마이그레이션 가이드](https://nextjs-ko.org/docs/app/building-your-application/upgrading/from-create-react-app)
* [React Router의 프레임워크 도입 가이드](https://reactrouter.com/upgrading/component-routes)
* [Expo 웹팩에서 Expo Router로의 마이그레이션 가이드](https://docs.expo.dev/router/migrate/from-expo-webpack/)

## 빌드 도구로 마이그레이션하는 방법 {/*how-to-migrate-to-a-build-tool*/}

앱이 특수한 제약 조건을 가지고 있거나, 자신만의 프레임워크를 구축하여 문제를 해결하고 싶거나, React가 처음부터 어떻게 동작하는지 배우고 싶은 경우 Vite, Parcel, RSBuild 등을 이용하여 커스텀 설정을 직접 구축할 수 있습니다.

기존 앱의 경우 다음 안내서를 참고하여 빌드 도구로 마이그레이션할 수 있습니다:

* [Vite의 Create React App 마이그레이션 가이드](https://www.robinwieruch.de/vite-create-react-app/)
* [Parcel의 Create React App 마이그레이션 가이드](https://parceljs.org/migration/cra/)
* [RSBuild의 Create React App 마이그레이션 가이드](https://rsbuild.dev/guide/migration/cra)

Vite, Parcel 또는 RSBuild로 시작하는 데 도움을 주기 위해 [React 앱 구축하기](/learn/build-a-react-app-from-scratch)에 대한 새로운 문서를 추가했습니다.

<DeepDive>

#### 프레임워크가 필요합니까? {/*do-i-need-a-framework*/}

대부분의 앱은 프레임워크를 사용하는 것이 유리하지만, React 앱을 처음부터 직접 구축해야 하는 타당한 경우도 있습니다. 일반적인 기준으로, 만약 앱에서 라우팅이 필요하다면 프레임워크를 사용하는 것이 더 나을 가능성이 큽니다. 

Svelte에는 SvelteKit, Vue에는 Nuxt 그리고 Solid에는 SolidStart가 있듯이, React도 기본적으로 라우팅을 포함한 데이터 가져오기, 코드 분할 등의 기능을 통합한 [프레임워크 사용을 권장합니다.](#why-we-recommend-frameworks) 이렇게 하면 복잡한 설정을 직접 구성하거나, 사실상 자체 프레임워크를 만들어야 하는 부담을 피할 수 있습니다.

하지만 여전히 Vite, Parcel, Rsbuild 같은 빌드 도구를 사용해 [React 앱을 처음부터 직접 구축하는 것](/learn/build-a-react-app-from-scratch)도 가능합니다.

</DeepDive>

[빌드 도구의 한계](#limitations-of-build-tools)와 [프레임워크를 권장하는 이유](#why-we-recommend-frameworks)에 대해 자세히 알아보려면 계속 읽어보세요.

## 빌드 도구의 한계 {/*limitations-of-build-tools*/}

Create React App와 같은 빌드 도구는 React 앱을 시작하는 것을 쉽게 만듭니다. `npx create-react-app my-app`을 실행하면 개발 서버, linting, 프로덕션 빌드가 구성된 완전히 설정된 React 앱을 얻을 수 있습니다.

예를 들어, 내부 관리자 도구를 구축하는 경우 랜딩 페이지부터 시작할 수 있습니다:

```js
export default function App() {
  return (
    <div>
      <h1>Welcome to the Admin Tool!</h1>
    </div>
  )
}
```

이를 통해 JSX, 기본 lint 규칙, 개발 및 프로덕션에서 모두 실행할 번들러와 함께 바로 React 코딩을 시작할 수 있습니다. 그러나 이 설정에는 실제 프로덕션 앱을 구축하는 데 필요한 도구가 빠져 있습니다.

대부분의 프로덕션 앱은 라우팅, 데이터 가져오기, 코드 분할과 같은 문제에 대한 해결책이 필요합니다.

### 라우팅 {/*routing*/}

Create React App에는 특정 라우팅 솔루션이 포함되어 있지 않습니다. 처음 시작할 때는 useState를 사용하여 라우트 간 전환을 할 수 있습니다. 하지만 이렇게 하면 - 모든 링크가 동일한 페이지로 이동하게 되며 - 시간이 지남에 따라 앱 구조화가 어려워지면서 앱에 링크를 공유할 수 없습니다.

```js
import {useState} from 'react';

import Home from './Home';
import Dashboard from './Dashboard';

export default function App() {
  // ❌ 라우팅은 상태 내에서 URL을 생성하지 않습니다.
  const [route, setRoute] = useState('home');
  return (
    <div>
      {route === 'home' && <Home />}
      {route === 'dashboard' && <Dashboard />}
    </div>
  )
}
```

이러한 이유로 Create React App을 사용하는 대부분의 앱은 [React Router](https://reactrouter.com/)나 [Tanstack Router](https://tanstack.com/router/latest)와 같은 라우팅 라이브러리를 추가로 사용합니다. 라우팅 라이브러리를 사용하면 앱에 추가적인 라우트를 정의할 수 있으며, 앱 구조에 대한 의견을 제공하며 라우트에 대한 링크를 공유할 수 있습니다. 예를 들어 React Router를 사용하면 다음과 같이 라우트를 정의할 수 있습니다.

```js
import {RouterProvider, createBrowserRouter} from 'react-router';

import Home from './Home';
import Dashboard from './Dashboard';

// ✅ 각각의 라우트는 자신만의 URL을 가지고 있습니다.
const router = createBrowserRouter([
  {path: '/', element: <Home />},
  {path: '/dashboard', element: <Dashboard />}
]);

export default function App() {
  return (
    <RouterProvider value={router} />
  )
}
```

이 변경으로 인해 `/dashboard`로 링크를 공유할 수 있고, 앱이 대시보드 페이지로 이동합니다. 라우팅 라이브러리를 사용하면 중첩 라우트, 라우트 보호, 라우트 전환 등 추가 기능을 쉽게 구현할 수 있습니다.

라우팅 라이브러리는 앱에 복잡성을 더해주지만, 앱 없이는 구현하기 어려운 기능도 추가하는 trade-off가 존재합니다.

### 데이터 가져오기 {/*data-fetching*/}

Create React App의 또 다른 일반적인 문제는 데이터를 가져오는것입니다. Create React App은 특정 데이터를 가져오는 솔루션을 포함하지 않습니다. 처음 시작한다면, 일반적인 방법은 데이터를 로드하기 위해 effect 내에서 `fetch`를 사용하는 것입니다.

하지만 이 방법을 사용하면 컴포넌트가 렌더링된 후에 데이터가 가져와지므로 네트워크 폭포수가 발생할 수 있습니다. 네트워크 폭포수는 코드가 다운로드되는 동안 병렬로 처리하는 대신 앱이 렌더링될 때 데이터를 가져오면서 발생합니다.

```js
export default function Dashboard() {
  const [data, setData] = useState(null);

  // ❌ 컴포넌트 내에서 데이터를 가져오면 네트워크 폭포수를 일으킵니다.
  useEffect(() => {
    fetch('/api/data')
      .then(response => response.json())
      .then(data => setData(data));
  }, []);

  return (
    <div>
      {data.map(item => <div key={item.id}>{item.name}</div>)}
    </div>
  )
}
```

Effect에서 데이터를 가져오는것은 데이터를 더 일찍 가져올 수 있었음에도 불구하고 사용자가 콘텐츠를 보기 위해 더 오래 기다려야 함을 의미합니다. 이 문제를 해결하기 위해 컴포넌트가 렌더링되기 전에 요청을 시작할 수 있도록 데이터 미리 가져오기 옵션을 제공하는 [React Query](https://react-query.tanstack.com/), [SWR](https://swr.vercel.app/ko), [Apollo](https://www.apollographql.com/docs/react) 또는 [Relay](https://relay.dev/)와 같은 라이브러리들을 사용할 수 있습니다. 

이러한 라이브러리들은 라우트 수준에서 데이터 의존성을 지정할 수 있는 라우팅 “로더" 패턴과 통합될 때 가장 효과적으로 작동하며, 이를 통해 라우터가 데이터 가져오기를 최적화할 수 있습니다.

```js
export async function loader() {
  const response = await fetch(`/api/data`);
  const data = await response.json();
  return data;
}

// ✅ 코드가 다운로드 될 동안 데이터는 병렬로 가져옵니다.
export default function Dashboard({loaderData}) {
  return (
    <div>
      {loaderData.map(item => <div key={item.id}>{item.name}</div>)}
    </div>
  )
}
```

초기 로드 시, 라우터는 라우트가 렌더링되기 전에 즉시 데이터를 가져올 수 있습니다. 사용자가 앱 내에서 이동할 때, 라우터는 데이터와 라우트를 동시에 병렬적으로 가져올 수 있습니다. 이는 화면에 콘텐츠가 표시되는 데 걸리는 시간을 줄이고 사용자 경험을 향상시킬 수 있습니다.

그러나 이를 위해서는 앱에서 로더를 올바르게 구성해야 하며, 성능을 위해 복잡성을 감수해야 합니다.

### 코드 분할 {/*code-splitting*/}

Create React App의 또 다른 일반적인 문제는 [코드 분할](https://www.patterns.dev/vanilla/bundle-splitting/)입니다. Create React App은 특정 코드 분할 솔루션을 포함하지 않습니다. 처음 시작한다면, 코드 분할을 전혀 고려하지 않을 수도 있습니다.

이는 앱이 하나의 번들로 제공되는 것을 의미합니다.

```txt
- bundle.js    75kb
```

하지만 최적의 성능을 위해서는 코드를 개별 번들로 "분할"하여 사용자가 필요한 것만 다운로드하도록 해야 합니다. 이렇게 하면 사용자가 현재 보고 있는 페이지에 필요한 코드만 다운로드하므로 앱 로딩 시간을 줄일 수 있습니다.

```txt
- core.js      25kb
- home.js      25kb
- dashboard.js 25kb
```

코드 분할을 구현하는 한 가지 방법은 `React.lazy`를 사용하는 것입니다. 그러나 컴포넌트가 렌더링될 때까지 코드가 가져와지지 않는다는 것을 의미하므로 네트워크 폭포수가 발생할 수 있습니다. 더 최적화된 해결책은 코드가 다운로드되는 동안 병렬로 코드를 가져오는 라우터 기능을 사용하는 것입니다. 예를 들어, React Router는 라우트를 코드 분할을 해야 하며 로드 시점을 최적화해야 함을 지정하는 `lazy` 옵션을 제공합니다:

```js
import Home from './Home';
import Dashboard from './Dashboard';

// ✅ 라우터는 렌더링되기 전에 다운로드 됩니다.
const router = createBrowserRouter([
  {path: '/', lazy: () => import('./Home')},
  {path: '/dashboard', lazy: () => import('Dashboard')}
]);
```

최적화된 코드 분할은 올바르게 구현하기 까다롭고, 사용자가 필요 이상의 코드를 다운로드하게 만드는 실수를 쉽게 할 수 있습니다. 이는 캐싱을 최대화하고, 가져오기를 병렬화하며, ["상호작용 시 가져오기"](https://www.patterns.dev/vanilla/import-on-interaction) 패턴을 지원하기 위해 라우터 및 데이터 로딩 솔루션과 통합될 때 가장 효과적으로 작동합니다.

### 그리고... {/*and-more*/}

이것들은 Create React App의 몇 가지 제한 사항 예시에 불과합니다.

라우팅, 데이터 가져오기, 코드 분할을 통합한 후에는 보류 중인 상태, 내비게이션 중단, 사용자에게 보내는 오류 메시지, 데이터 재검증도 고려해야 합니다. 사용자가 해결해야 할 문제의 전체 범주는 다음과 같습니다.

<div style={{display: 'flex', width: '100%', justifyContent: 'space-around'}}>
  <ul>
    <li>접근성</li>
    <li>자산 로딩</li>
    <li>인증</li>
    <li>캐싱</li>
  </ul>
  <ul>
    <li>오류 처리</li>
    <li>데이터 변경</li>
    <li>탐색</li>
    <li>낙관적 업데이트</li>
  </ul>
  <ul>
    <li>점진적 향상</li>
    <li>서버 사이드 렌더링</li>
    <li>정적 사이트 생성</li>
    <li>스트리밍</li>
  </ul>
</div>

이 모든 것들이 함께 작동하여 가장 최적화된 [로딩 순서](https://www.patterns.dev/vanilla/loading-sequence/)를 만듭니다.

Create React App에서 이러한 문제들을 개별적으로 해결하는 것은 각 문제가 서로 연결되어 있고 사용자가 익숙하지 않은 문제 영역에 대한 깊은 전문 지식이 필요할 수 있기 때문에 어려울 수 있습니다. 이러한 문제들을 해결하기 위해 사용자들은 결국 Create React App 위에 자신만의 맞춤형 솔루션을 구축하게 되는데, 이는 Create React App이 원래 해결하려고 했던 문제입니다.

## 프레임워크를 권장하는 이유 {/*why-we-recommend-frameworks*/}

Create React App, Vite, Parcel과 같은 빌드 도구에서 모든 요소를 직접 해결할 수 있지만, 이를 잘 수행 하기에는 어렵습니다. Create React App 자체가 여러 빌드 도구를 통합했던 것처럼, 이제는 모든 기능을 통합하여 사용자에게 최상의 경험을 제공할 수 있는 도구가 필요합니다.

빌드 도구, 렌더링, 라우팅, 데이터 가져오기 및 코드 분할을 통합하는 이러한 종류의 도구들을 "프레임워크"라고 합니다 - 또는 React 자체를 프레임워크라고 부르기도 하지만, 이들을 "메타프레임워크"라고 부를 수도 있습니다.

프레임워크는 빌드 도구가 도구 사용을 쉽게 하기 위해 일부 의견을 강제하는 것과 같은 방식으로, 훨씬 더 나은 사용자 경험을 제공하기 위해 앱 구조화에 대한 일부 의견을 강제합니다. 이것이 우리가 새 프로젝트에 [Next.js](https://nextjs.org/), [React Router](https://reactrouter.com/) 및 [Expo](https://expo.dev/)와 같은 프레임워크를 권장하기 시작한 이유입니다.

프레임워크는 Create React App과 동일한 시작 경험을 제공하지만, 사용자가 실제 프로덕션 앱에서 어쨌든 해결해야 하는 문제에 대한 솔루션도 제공합니다.

<DeepDive>

#### 서버 렌더링은 선택적입니다 {/*server-rendering-is-optional*/}

우리가 추천하는 프레임워크들은 모두 [클라이언트 사이드 렌더링(CSR)](https://developer.mozilla.org/en-US/docs/Glossary/CSR) 앱을 만들 수 있는 옵션을 제공합니다.

경우에 따라 CSR이 페이지에 적합한 선택일 수 있지만, 대부분은 그렇지 않습니다. 앱의 대부분이 클라이언트 사이드라 하더라도, 이용약관 페이지나 문서와 같이 [정적 사이트 생성(SSG)](https://developer.mozilla.org/en-US/docs/Glossary/SSG) 또는 [서버 사이드 렌더링(SSR)](https://developer.mozilla.org/en-US/docs/Glossary/SSR)과 같은 서버 렌더링 기능의 혜택을 받을 수 있는 개별 페이지들이 많이 있습니다.

서버 렌더링은 일반적으로 클라이언트에 더 적은 JavaScript를 전송하고, 완전한 HTML 문서를 제공하여 [총 차단 시간(TBD)](https://web.dev/articles/tbt?hl=ko)을 줄임으로써 더 빠른 [최초 콘텐츠 페인트(FCP)](https://web.dev/articles/fcp?hl=ko)를 생성하며, 이는 [상호작용에서 다음 페인트까지(INP)](https://web.dev/articles/inp?hl=ko)도 낮출 수 있습니다. 이것이 Chrome 팀이 개발자들에게 최상의 성능을 달성하기 위해 완전한 클라이언트 사이드 접근 방식보다 정적 또는 서버 사이드 렌더링을 고려할 것을 [권장하는 이유](https://web.dev/articles/rendering-on-the-web?hl=ko)입니다.

서버를 사용하는 데는 트레이드오프가 있으며, 모든 페이지에 항상 최선의 선택인 것은 아닙니다. 서버에서 페이지를 생성하는 것은 추가 비용이 발생하고 생성하는 데 시간이 걸리므로 [최초 바이트까지의 시간(TTFB)](https://web.dev/articles/ttfb?hl=ko)이 증가할 수 있습니다. 가장 성능이 좋은 앱은 각 전략의 트레이드오프를 기반으로 페이지별로 적절한 렌더링 전략을 선택할 수 있습니다.

프레임워크는 원하는 경우 모든 페이지에서 서버를 사용할 수 있는 옵션을 제공하지만, 서버 사용을 강제하지는 않습니다. 이를 통해 앱의 각 페이지에 맞는 렌더링 전략을 선택할 수 있습니다.

#### 서버 컴포넌트는 어떤가요 {/*server-components*/}

우리가 추천하는 프레임워크는 React 서버 컴포넌트도 지원합니다.

서버 컴포넌트는 라우팅과 데이터 가져오기를 서버로 이동시키고, 렌더링되는 경로가 아닌 렌더링하는 데이터를 기반으로 클라이언트 컴포넌트에 대한 코드 분할이 가능하게 함으로써 이러한 문제를 해결하는 데 도움을 주며, 최상의 [로딩 시퀀스](https://www.patterns.dev/vanilla/loading-sequence)를 위해 전송되는 JavaScript 양을 줄입니다.

서버 컴포넌트는 서버를 필요로 하지 않습니다. CI 서버에서 빌드 시점에 실행하여 정적 사이트 생성(SSG) 앱을 만들거나, 웹 서버에서 런타임에 실행하여 서버 사이드 렌더링(SSR) 앱을 만들 수 있습니다.

자세한 내용은 [제로 번들 크기의 React 서버 컴포넌트 소개](/blog/2020/12/21/data-fetching-with-react-server-components) 및 [문서](/reference/rsc/server-components)를 참조하세요.

</DeepDive>

<Note>

#### 서버 렌더링은 SEO만을 위한 것이 아닙니다 {/*server-rendering-is-not-just-for-seo*/}

서버 렌더링이 [SEO](https://developer.mozilla.org/ko/docs/Glossary/SEO)만을 위한 것이라는 것은 흔한 오해입니다.

서버 렌더링은 SEO를 개선할 수 있지만, 사용자가 화면에서 콘텐츠를 보기 전에 다운로드하고 파싱해야 하는 JavaScript 양을 줄임으로써 성능도 향상시킵니다.

이것이 Chrome 팀이 개발자들에게 최상의 성능을 달성하기 위해 완전한 클라이언트 사이드 접근 방식보다 정적 또는 서버 사이드 렌더링을 고려할 것을 [권장하는 이유](https://web.dev/articles/rendering-on-the-web?hl=ko)입니다.

</Note>

---

_[Dan Abramov](https://bsky.app/profile/danabra.mov)에게 Create React App을 만들어줘서 감사하며, [Joe Haddad](https://github.com/Timer), [Ian Schmitz](https://github.com/ianschmitz), [Brody McKee](https://github.com/mrmckeb), 그리고 [그 외 많은 분들](https://github.com/facebook/create-react-app/graphs/contributors)께 오랜 기간 Create React App을 유지보수해 주셔서 감사드립니다. 또한, [Brooks Lybrand](https://bsky.app/profile/brookslybrand.bsky.social), [Dan Abramov](https://bsky.app/profile/danabra.mov), [Devon Govett](https://bsky.app/profile/devongovett.bsky.social), [Eli White](https://x.com/Eli_White), [Jack Herrington](https://bsky.app/profile/jherr.dev), [Joe Savona](https://x.com/en_JS), [Lauren Tan](https://bsky.app/profile/no.lol), [Lee Robinson](https://x.com/leeerob), [Mark Erikson](https://bsky.app/profile/acemarke.dev), [Ryan Florence](https://x.com/ryanflorence), [Sophie Alpert](https://bsky.app/profile/sophiebits.com), [Tanner Linsley](https://bsky.app/profile/tannerlinsley.com), 그리고 [Theo Browne](https://x.com/theo)에게 이 글을 검토하고 피드백을 제공해 주셔서 감사드립니다._
