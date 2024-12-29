---
title: 새로운 React 프로젝트 시작하기
---

<Intro>

React로 새로운 앱이나 새로운 웹사이트를 완전히 작성하고 싶다면, 커뮤니티에서 React 기반 프레임워크 중 하나를 사용하는 것이 좋습니다.

</Intro>

프레임워크 없이 React를 사용할 수 있습니다. 그러나 대부분의 애플리케이션이나 사이트들이 결국에는 코드 분할<sup>Code-Splitting</sup>, 라우팅<sup>Routing</sup>, 데이터 가져오기<sup>Data Fetching</sup>, 그리고 HTML 생성에 대한 해결책을 찾고 있다는 것을 발견했습니다. 이러한 문제들은 UI 라이브러리들의 공통적인 문제이며 React만의 문제는 아닙니다.

프레임워크로 시작하면 React를 빠르게 시작할 수 있고, 나중에 자체적인 프레임워크를 구축하는 것을 피할 수 있습니다.

<DeepDive>

#### 프레임워크 없이 React 를 사용할 수 있나요? {/*can-i-use-react-without-a-framework*/}

물론 React를 프레임워크 없이 사용할 수 있습니다. [기존 페이지의 일부분에 React 사용하기](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page)를 살펴보세요. **하지만, 새로운 애플리케이션이나 사이트 전체를 React로 구축하는 경우에는 프레임워크의 사용을 권장합니다.**

이유는 아래와 같습니다.

라우팅<sup>Routing</sup>이나 데이터 가져오기<sup>Data Fetching</sup>와 같은 기능이 처음엔 필요하지 않더라도, 이를 위한 라이브러리의 사용은 필요할 수도 있습니다. 자바스크립트<sup>JavaScript</sup> 번들은 날마다 새로운 기능들이 더해지고, 각각의 라우팅 코드를 어떻게 분할해야 할지 고민해야 하는 순간이 오게 됩니다. 데이터 가져오기<sup>Data Fetching</sup>는 날로 복잡해지고, 아마 서버-클라이언트 네트워크의 워터폴<sup>Waterfall</sup>이 애플리케이션의 속도를 느리게 하는 순간도 직면하게 될 겁니다. 성능이 좋지 않은 네트워크 환경이나 저사양의 단말기를 이용하는 사용자들이 늘어남에 따라, 서버에서 혹은 빌드 시간에 컴포넌트에서 HTML을 생성하여 내용<sup>Content</sup>을 빠르게 표시해야할 필요가 생길 수도 있습니다. 일부 코드의 설정을 변경하여 서버에서 혹은 빌드되는 동안 실행시키는 것은 매우 까다로운 작업이 될 수 있습니다.

**이러한 문제가 React에만 국한된 것은 아닙니다. 이것이 바로 Svelte에 SvelteKit이 존재하고, Vue에는 Nuxt가 있는 이유입니다.** 자체 서비스에서 이러한 문제를 해결하기 위해서는 라우터<sup>Router</sup>와 데이터 가져오기<sup>Data Fetching</sup> 라이브러리를 번들러와 통합할 필요가 있습니다. 초기 세팅을 구동하는 건 그다지 어렵지 않지만, 시간이 지나면서 앱이 커져도 빠르게 로드되는 앱을 만드는 데에는 많은 세부 사항들이 포함됩니다. 앱 코드의 최소한의 양만 전송하되, 페이지에 필요한 데이터를 병렬로 처리하면서 클라이언트-서버 간의 단일 왕복<sup>Single Roundtrip</sup>으로 이를 처리하고 싶을 수도 있습니다. 자바스크립트 코드가 실행되기도 전에 페이지가 상호작용 할 수 있도록 점진적인 개선을 하고 싶을 수도 있습니다. 마케팅 목적의 완전히 정적인 HTML 파일들이 속한 폴더를 생성하여 자바스크립트가 비활성화된 환경에서도 이를 작동하게 하고 싶을 수도 있습니다. 이러한 기능들을 구현하는 것은 실제로 많은 작업을 요합니다.

**현재 페이지의 React 프레임워크들은 추가 작업 없이도 기본적으로 이러한 문제들을 해결합니다.** 이들은 매우 간소화된 상태로 시작할 수 있고 애플리케이션의 필요에 따라 확장이 가능합니다. 각각의 React 프레임워크들은 커뮤니티가 있어 질문에 대한 답을 얻고 도구를 업그레이드하는 것이 더 쉬워집니다. 또한 프레임워크들은 코드에 구조를 제공하며, 다른 프로젝트들간의 맥락과 스킬을 유지하는 데에 도움이 됩니다. 반대로, 맞춤 설정을 사용하면 지원되지 않는 의존성<sup>Dependency</sup> 버전에 빠질 수 있으며, 결국엔 커뮤니티나 업그레이드 경로가 없는 자체 프레임워크를 만들게 될 수도 있습니다. (그리고 만약 이전에 우리가 만든 것들과 비슷하다면, 더 엉성하게 설계된 것일 수 있습니다.)

애플리케이션이 이러한 프레임워크들의 지원을 잘 받지 못하는 특수한 제약에 놓여 있거나, 스스로 이러한 문제들을 해결하고 싶다면 React를 사용하여 자체 맞춤 설정을 적용할 수 있습니다. npm에서 `react` 와 `react-dom`을 설치하고, [Vite](https://vitejs.dev/) 나 [Parcel](https://parceljs.org/) 같은 번들러를 활용하여 맞춤 빌드 프로세스를 정립한 다음, 라우팅<sup>Routing</sup>, 정적 생성<sup>Static Generation</sup> 혹은 서버 사이드 렌더링<sup>SSR, Server Side Rendering</sup> 등 필요에 따라 다른 도구들을 추가할 수 있습니다.

</DeepDive>

## 프로덕션 수준의 React 프레임워크 {/*production-grade-react-frameworks*/}

아래 프레임워크들은 프로덕션에서 애플리케이션을 배포하고 확장하는 데에 필요한 모든 기능을 지원하며 [풀스택 아키텍처 비전](#which-features-make-up-the-react-teams-full-stack-architecture-vision)을 지원하는 방향으로 발전하고 있습니다. 모든 프레임워크들은 활발한 커뮤니티의 지원을 받는 오픈 소스이며, 자체 서버나 호스팅 제공자에 배포할 수 있습니다. 만일 이 목록에 포함되길 원하는 프레임워크의 저자가 있다면, [여기에서 알려주세요.](https://github.com/reactjs/react.dev/issues/new?assignees=&labels=type%3A+framework&projects=&template=3-framework.yml&title=%5BFramework%5D%3A+)

### Next.js {/*nextjs-pages-router*/}

**[Next.js의 Pages Router](https://nextjs.org/)는 풀스택 React 프레임워크입니다.** 다재다능한 도구이며, 정적인 블로그부터 복잡한 동적 애플리케이션까지 다양한 크기의 React 애플리케이션을 만들 수 있습니다. 새로운 Next.js 프로젝트를 작성하려면 터미널에서 다음을 실행하세요.

<TerminalBlock>
npx create-next-app@latest
</TerminalBlock>

Next.js를 처음 사용하는 분이라면 [Next.js 배우기 코스](https://nextjs.org/learn)를 읽어보세요.

Next.js는 [Vercel](https://vercel.com/)이 관리합니다. 어떤 Node.js 서버, 서버리스 호스팅 또는 직접 소유한 서버 어느 곳에서라도 [Next.js 애플리케이션을 배포](https://nextjs.org/docs/app/building-your-application/deploying)할 수 있습니다. Next.js는 서버가 필요없는 [정적 내보내기<sup>Static Exports</sup>](https://nextjs.org/docs/pages/building-your-application/deploying/static-exports) 도 제공합니다.

### Remix {/*remix*/}

**[Remix](https://remix.run/)는 중첩 라우팅이 가능한 풀스택 React 프레임워크입니다.** 애플리케이션을 중첩되는 하위 파트로 나눌 수 있으며, 각 파트는 병렬로 데이터를 읽어 들일 수 있고 사용자의 행동에 반응하여 다시 그려질 수 있습니다. 새로운 Remix 프로젝트를 작성하려면 다음을 실행하세요.

<TerminalBlock>
npx create-remix
</TerminalBlock>

Remix를 처음 사용하는 분이라면 Remix [블로그 자습서](https://remix.run/docs/en/main/tutorials/blog) (짧은 문서)와 [애플리케이션 자습서](https://remix.run/docs/en/main/tutorials/jokes) (긴 문서)를 참고하세요.

Remix는 [Shopify](https://www.shopify.com/)가 관리합니다. Remix 프로젝트를 작성할 때는 [배포할 대상을 선택](https://remix.run/docs/en/main/guides/deployment)해야 합니다. Remix 애플리케이션은 어떤 Node.js 서버나 서버리스 호스팅에라도 [어댑터<sup>Adapter</sup>](https://remix.run/docs/en/main/other-api/adapter)를 사용하거나 직접 작성하여 배포할 수 있습니다.

### Gatsby {/*gatsby*/}

**[Gatsby](https://www.gatsbyjs.com/)는 CMS를 활용한 빠른 웹 사이트를 작성하는 React 프레임워크입니다.** 풍부한 플러그인 생태계와 GraphQL 데이터 레이어가 콘텐츠, API, 서비스와 어우러져 하나의 웹 사이트를 이룹니다. 새로운 Gatsby 프로젝트를 작성하려면 다음을 실행하세요.

<TerminalBlock>
npx create-gatsby
</TerminalBlock>

Gatsby를 처음 사용하는 분이라면 [Gatsby 자습서](https://www.gatsbyjs.com/docs/tutorial/)를 읽어보세요.

Gatsby는 [Netlify](https://www.netlify.com/)가 관리합니다. 어느 정적인 호스팅에라도 [완전히 정적인 Gatsby 사이트를 배포](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting)할 수 있습니다. 서버 전용 기능을 사용한다면 사용하려는 호스팅 제공업체가 Gatsby를 지원하는지 먼저 확인하세요.

### Expo (네이티브 앱) {/*expo*/}

**[Expo](https://expo.dev/)는 진짜 네이티브 UI를 갖춘 유니버설 안드로이드, iOS, 웹을 작성할 수 있는 React 프레임워크입니다.** [React Native](https://reactnative.dev/)용 SDK를 제공하여 네이티브 부분을 더 쉽게 사용할 수 있습니다. 새로운 Expo 프로젝트를 작성하려면 다음을 실행하세요.

<TerminalBlock>
npx create-expo-app
</TerminalBlock>

Expo를 처음 사용하는 분이라면 [Expo 자습서](https://docs.expo.dev/tutorial/introduction/)를 참고하세요.

Expo는 [Expo (기업)](https://expo.dev/about)이 관리합니다. Expo를 사용하여 애플리케이션을 작성하는 것은 무료이며 작성된 앱을 구글과 애플 앱 스토어에 올리는 데에도 제약이 없습니다. Expo는 추가로 사용할 수 있는 클라우드 서비스를 유료로 제공하고 있습니다.

## Bleeding-edge React frameworks {/*bleeding-edge-react-frameworks*/}

React를 지속적으로 개선할 방법을 찾아가는 과정에서, 우리는 React를 프레임워크(특히 라우팅, 번들링, 서버 기술)와 더 밀접하게 통합하는 것이 React 사용자에게 더 나은 앱을 만드는 데 도움을 줄 수 있는 가장 큰 기회라는 것을 깨달았습니다. Next.js 팀은 [React 서버 컴포넌트](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)와 같은 가장 최신의 React 기능을 프레임워크에 구애받지 않는 형태로 연구, 개발, 통합, 테스트하는 데에 협력하기로 합의했습니다.

이러한 기능들은 매일 프로덕션 수준에 근접하고 있으며, 다른 번들러 및 프레임워크 개발자들과 이를 통합하기 위해 협의 중입니다. 바라건데 1, 2년 후에 이 페이지에 나열된 모든 프레임워크가 이러한 기능을 지원했으면 합니다. (이러한 기능을 실험해 보기 위해 우리와 협력하고 싶은 프레임워크 개발자가 있다면 알려주세요!)

### Next.js (App Router) {/*nextjs-app-router*/}

**[Next.js의 App Router](https://nextjs.org/docs)는 React 팀의 풀스택 아키텍처 비전을 구현하기 위해 재설계된 Next.js API입니다.** 이를 통해 서버에서 또는 빌드 중에 실행되는 비동기 컴포넌트에서 데이터를 가져올 수 있습니다.


Next.js는 [Vercel](https://vercel.com/)이 관리합니다. 어떤 Node.js 서버, 서버리스 호스팅 또는 직접 소유한 서버 어느 곳에라도 [Next.js 애플리케이션을 배포](https://nextjs.org/docs/app/building-your-application/deploying)할 수 있습니다. Next.js 는 서버가 필요없는 [정적 내보내기<sup>Static Exports</sup>](https://nextjs.org/docs/pages/building-your-application/deploying/static-exports)도 제공합니다.

<DeepDive>

#### React 팀의 풀스택 아키텍처 비전을 구현한 기능은 무엇인가요? {/*which-features-make-up-the-react-teams-full-stack-architecture-vision*/}

Next.js의 App Router 번들러는 공식 [React 서버 컴포넌트 명세](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md) 전체를 구현했습니다. 이를 통해 빌드 시간<sup>Build-Time</sup>, 서버 전용<sup>Server-Only</sup>, 그리고 대화형<sup>Interactive</sup> 컴포넌트를 하나의 React 트리<sup>Tree</sup>에서 혼합할 수 있습니다.

예를 들어, 데이터베이스나 파일을 읽는 `async` 함수로 서버 전용 React 컴포넌트를 작성할 수 있습니다. 그런 다음 이를 통해 데이터를 대화형 컴포넌트로 전달할 수 있습니다.

```js
// 이 컴포넌트는 *서버(또는 빌드 중)에서만* 실행됩니다.
async function Talks({ confId }) {
  // 1. 서버에 있으므로 데이터 계층과 통신할 수 있습니다. API 엔드포인트가 필요하지 않습니다.
  const talks = await db.Talks.findAll({ confId });

  // 2. 렌더링 로직을 얼마든지 추가할 수 있습니다. 자바스크립트 번들 크기가 커지지 않습니다.
  const videos = talks.map(talk => talk.video);

  // 3. 브라우저에서 실행될 컴포넌트에 데이터를 전달합니다.
  return <SearchableVideoList videos={videos} />;
}
```

Next.js의 App Router는 또한 Suspense를 사용하는 데이터 통신과도 잘 어울립니다. 이를 통해 React 트리에서 사용자 인터페이스의 다른 부분에 대한 로딩 상태(스켈레톤<sup>Skeleton</sup> 플레이스홀더<sup>Placeholder</sup>와 같은)를 직접 지정할 수 있습니다.

```js
<Suspense fallback={<TalksLoading />}>
  <Talks confId={conf.id} />
</Suspense>
```

서버 컴포넌트와 Suspense는 Next.js의 기능이 아닌 React의 기능입니다. 하지만 프레임워크 수준에서 이를 채택하려면 많은 노력과 비교적 복잡한 구현 작업이 필요합니다. 현재로서는 Next.js의 App Router가 가장 완벽한 구현입니다. React 팀은 차세대 프레임워크에서는 이러한 기능을 구현하기 쉽도록 번들러 개발자와 함께 노력하고 있습니다.

</DeepDive>
