---
title: 새로운 React 앱 만들기
---

<Intro>

React로 새로운 앱이나 웹사이트를 구축하려면 프레임워크부터 시작하는 것이 좋습니다.

</Intro>

앱에 기존 프레임워크에서 잘 제공되지 않는 제약 조건이 있거나, 자체 프레임워크를 빌드하는 것을 선호하거나, React 앱의 기본 사항만 배우려는 경우 [React 앱을 처음부터 빌드할 수 있습니다](/learn/build-a-react-app-from-scratch).

## 풀스택 프레임워크 {/*full-stack-frameworks*/}

이러한 권장 프레임워크는 프로덕션에서 앱을 배포하고 확장하는 데 필요한 모든 기능을 지원합니다. 그들은 최신 React 기능을 통합하고 React의 아키텍처를 활용합니다.

<Note>

#### 풀스택 프레임워크에는 서버가 필요하지 않습니다 {/*react-frameworks-do-not-require-a-server*/}

이 페이지의 모든 프레임워크는 클라이언트 측 렌더링([CSR](https://developer.mozilla.org/en-US/docs/Glossary/CSR)), 단일 페이지 앱([SPA](https://developer.mozilla.org/en-US/docs/Glossary/SPA)), 정적 사이트 생성([SSG](https://developer.mozilla.org/en-US/docs/Glossary/SSG))을 지원합니다. 이러한 앱은 서버 없이 [CDN](https://developer.mozilla.org/en-US/docs/Glossary/CDN) 또는 정적 호스팅 서비스에 배포할 수 있습니다. 또한 이러한 프레임워크를 사용하면 사용 사례에 적합한 경우 경로별로 서버 측 렌더링을 추가할 수 있습니다.

이렇게 하면 클라이언트 전용 앱으로 시작할 수 있으며, 나중에 요구 사항이 변경되는 경우 앱을 다시 작성하지 않고도 개별 경로에서 서버 기능을 사용하도록 선택할 수 있습니다. 렌더링 전략을 구성하는 방법에 대한 프레임워크 설명서를 참조하세요.

</Note>

### Next.js (앱 라우터) {/*nextjs-app-router*/}

**[Next.js의 앱 라우터](https://nextjs.org/docs)는 React의 아키텍처를 최대한 활용하여 풀 스택 React 앱을 활성화하는 React 프레임워크입니다.**

<TerminalBlock>
npx create-next-app@latest
</TerminalBlock>

<<<<<<< HEAD
Next.js는 [Vercel](https://vercel.com/)에서 유지 관리합니다. [Next.js 앱을 빌드](https://nextjs.org/docs/app/building-your-application/deploying)해서 Node.js와 서버리스 호스팅 혹은 자체 서버에 배포할 수 있습니다. Next.js는 또한 서버가 필요없는 [정적 내보내기](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)도 지원합니다. Vercel은 추가적으로 옵트인 유료 클라우드 서비스도 지원합니다.
=======
Next.js is maintained by [Vercel](https://vercel.com/). You can [deploy a Next.js app](https://nextjs.org/docs/app/building-your-application/deploying) to any hosting provider that supports Node.js or Docker containers, or to your own server. Next.js also supports [static export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports) which doesn't require a server.
>>>>>>> 2571aee6dba2e9790172a70224dac8371640b772

### React Router (v7) {/*react-router-v7*/}

**[React Router](https://reactrouter.com/start/framework/installation)는 React에서 가장 인기인는 라우팅 라이브러리이며 Vite와 함께 사용하면 풀스택 React 프레임워크를 만들 수 있습니다**. 표준 Web API를 강조하고 다양한 자바스크립트 런타임과 플랫폼을 위한 [준비된 배포 템플릿](https://github.com/remix-run/react-router-templates)이 있습니다.

새로운 React Router 프레임워크를 생성하려면 다음 명령을 사용하세요.

<TerminalBlock>
npx create-react-router@latest
</TerminalBlock>

React Router는 [Shopify](https://www.shopify.com)에서 유지 관리합니다.

### Expo (네이티브 앱용) {/*expo*/}

**[Expo](https://expo.dev/)는 네이티브 UI를 사용하여 안드로이드, iOS, 웹을 위한 범용앱을 만들 수 있는 React 프레임워크입니다.** 네이티브 부분을 쉽게 사용할 수 있게 해주는 [React Native SDK](https://reactnative.dev/)를 제공합니다. 새로운 Expo 프로젝트를 생성하려면 다음 명령을 사용하세요.

<TerminalBlock>
npx create-expo-app@latest
</TerminalBlock>

Expo를 처음 사용하는 경우, [Expo 자습서](https://docs.expo.dev/tutorial/introduction/)를 참조하세요.

Expo는 [Expo (the company)](https://expo.dev/about)에서 유지 관리합니다. Expo로 앱을 빌드하는 것은 무료이고 구글이나 애플 스토어에 제한없이 제출할 수 있습니다. Expo는 추가적으로 옵트인 유료 클라우드 서비스를 제공합니다.


## 다른 프레임워크 {/*other-frameworks*/}

풀스택 React 비전을 향해 나아가고 있는 또 다른 떠오르는 프레임워크가 있습니다.

- [TanStack Start (Beta)](https://tanstack.com/): TanStack Start는 TanStack Router를 기반으로 하는 풀스택 React 프레임워크입니다. Nitro나 Vite와 같이 전체 문서 SSR, 스트리밍, 서버 함수, 번들링과 많은 유용한 도구를 제공합니다.
- [RedwoodJS](https://redwoodjs.com/): Redwood는 쉽게 풀스택 웹 애플리케이션을 만들 수 있도록 사전탑재된 패키지와 구성을 가진 풀스택 React 프레임워크입니다.

<DeepDive>

#### React 팀의 풀스택 아키텍처 비전을 구성하는 기능은 무엇인가요? {/*which-features-make-up-the-react-teams-full-stack-architecture-vision*/}

Next.js의 App Router 번들러는 공식 [React Server Components 명세](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md)를 모두 구현합니다. 이를 통해 빌드 시간, 서버 전용 및 대화형 구성 요소를 단일 React 트리에 혼합할 수 있습니다.

예를 들어, 서버 전용 React 컴포넌트를 데이터베이스나 파일을 읽는 `비동기` 함수로 작성할 수 있습니다. 그런 다음 데이터를 대화형 컴포넌트로 전달할 수 있습니다.

```js
// 이 컴포넌트는 *오직* 서버에서만(혹은 빌드되는 동안만) 실행됩니다.
async function Talks({ confId }) {
  // 1. 서버에서라면 데이터 레이어와 대화할 수 있습니다. API 엔드포인트는 필요하지 않습니다.
  const talks = await db.Talks.findAll({ confId });

  // 2. 렌더링 로직이 추가되더라고도 자바스크립트 번들 크기를 크게 만들지 않습니다. 
  const videos = talks.map(talk => talk.video);

  // 3. 브라우저에서 싫행될 컴포넌트에 데이터를 전달합니다.
  return <SearchableVideoList videos={videos} />;
}
```

Next.js의 App Router는 [Suspense와 데이터 조회](/blog/2022/03/29/react-v18#suspense-in-data-frameworks)를 통합합니다. React tree에서 서로다른 사용자 인터페이스를 직접적으로 로딩 상태(예: 스켈레톤 플레이스홀더)로 지정할 수 있게 해줍니다.

```js
<Suspense fallback={<TalksLoading />}>
  <Talks confId={conf.id} />
</Suspense>
```

서버 컴포넌트와 Suspense는 Next.js 기능이 아닌 React 기능입니다. 그러나 프레임워크 수준에서 이를 채택하려면 참여와 사소하지 않은 구현 작업이 필요합니다. 현재 Next.js App Router는 가장 완벽한 구현입니다. React 팀은 차세대 프레임워크에서 이러한 기능을 더 쉽게 구현할 수 있도록 번들러 개발자와 협력하고 있습니다.

</DeepDive>

## 처음부터 시작하기 {/*start-from-scratch*/}

앱에 기존 프레임워크에서 잘 제공되지 않는 제약 조건이 있거나, 자체 프레임워크를 구축하는 것을 선호하거나, React 앱의 기본 사항을 배우려는 경우 React 프로젝트를 처음부터 시작하는 데 사용할 수 있는 다른 옵션이 있습니다.

처음부터 시작하면 더 많은 유연성을 얻을 수 있지만 라우팅, 데이터 가져오기 및 기타 일반적인 사용 패턴에 사용할 도구를 선택해야 합니다. 이미 존재하는 프레임워크를 사용하는 대신 자신만의 프레임워크를 구축하는 것과 비슷합니다. 저희가 [권장하는 프레임워크](#full-stack-frameworks)에는 이러한 문제에 대한 기본 제공 솔루션이 있습니다.

<<<<<<< HEAD
자신만의 솔루션을 구축하려면, [Vite](https://vite.dev/), [Parcel](https://parceljs.org/) 또는 [RSbuild](https://rsbuild.dev/)와 같은 빌드 도구로 시작할 수 있도록 하는 [처음부터 React 앱 만들기](/learn/build-a-react-app-from-scratch) 가이드를 참조하세요.
=======
If you want to build your own solutions, see our guide to [build a React app from Scratch](/learn/build-a-react-app-from-scratch) for instructions on how to set up a new React project starting with a build tool like [Vite](https://vite.dev/), [Parcel](https://parceljs.org/), or [RSbuild](https://rsbuild.dev/).
>>>>>>> 2571aee6dba2e9790172a70224dac8371640b772

-----

_만약 이 페이지에 포함되는데 관심있는 프레임워크 작성자라면, [저희에게 알려주세요](https://github.com/reactjs/react.dev/issues/new?assignees=&labels=type%3A+framework&projects=&template=3-framework.yml&title=%5BFramework%5D%3A+)._
