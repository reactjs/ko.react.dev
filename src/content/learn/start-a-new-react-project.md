---
title: 새로운 React 프로젝트 시작하기
---

<Intro>

React를 전체적으로 적용한 애플리케이션이나 사이트를 새롭게 작성하고 싶다면, 커뮤니티에서 React 기반 프레임워크 중 하나를 사용하는 것이 좋습니다.

</Intro>


프레임워크 없이 React 를 사용할 수 있습니다. 그러나 대부분에 애플리케이션이나 사이트들이 결국에는 code-splitting, routing, data fetching, 그리고 HTML 생성에 대한 해결책을 찾고 있다는것을 발견했습니다. 이러한 문제들은 UI 라이브러리들의 기본적인 문제이며 React 만의 문제는 아닙니다.

프레임워크로 시작하면 React를 빠르게 시작할 수 있고, 나중에 자체 프레임워크를 구축하는 것을 피할 수 있습니다.

<DeepDive>

#### Can I use React without a framework? {/*can-i-use-react-without-a-framework*/}

You can definitely use React without a framework--that's how you'd [use React for a part of your page.](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page) **However, if you're building a new app or a site fully with React, we recommend using a framework.**

Here's why.

Even if you don't need routing or data fetching at first, you'll likely want to add some libraries for them. As your JavaScript bundle grows with every new feature, you might have to figure out how to split code for every route individually. As your data fetching needs get more complex, you are likely to encounter server-client network waterfalls that make your app feel very slow. As your audience includes more users with poor network conditions and low-end devices, you might need to generate HTML from your components to display content early--either on the server, or during the build time. Changing your setup to run some of your code on the server or during the build can be very tricky.

**These problems are not React-specific. This is why Svelte has SvelteKit, Vue has Nuxt, and so on.** To solve these problems on your own, you'll need to integrate your bundler with your router and with your data fetching library. It's not hard to get an initial setup working, but there are a lot of subtleties involved in making an app that loads quickly even as it grows over time. You'll want to send down the minimal amount of app code but do so in a single client–server roundtrip, in parallel with any data required for the page. You'll likely want the page to be interactive before your JavaScript code even runs, to support progressive enhancement. You may want to generate a folder of fully static HTML files for your marketing pages that can be hosted anywhere and still work with JavaScript disabled. Building these capabilities yourself takes real work.

**React frameworks on this page solve problems like these by default, with no extra work from your side.** They let you start very lean and then scale your app with your needs. Each React framework has a community, so finding answers to questions and upgrading tooling is easier. Frameworks also give structure to your code, helping you and others retain context and skills between different projects. Conversely, with a custom setup it's easier to get stuck on unsupported dependency versions, and you'll essentially end up creating your own framework—albeit one with no community or upgrade path (and if it's anything like the ones we've made in the past, more haphazardly designed).

If your app has unusual constraints not served well by these frameworks, or you prefer to solve these problems yourself, you can roll your own custom setup with React. Grab `react` and `react-dom` from npm, set up your custom build process with a bundler like [Vite](https://vitejs.dev/) or [Parcel](https://parceljs.org/), and add other tools as you need them for routing, static generation or server-side rendering, and more.

</DeepDive>

## 프로덕션 수준의 React 프레임워크 {/*production-grade-react-frameworks*/}

These frameworks support all the features you need to deploy and scale your app in production and are working towards supporting our [full-stack architecture vision](#which-features-make-up-the-react-teams-full-stack-architecture-vision). All of the frameworks we recommend are open source with active communities for support, and can be deployed to your own server or a hosting provider. If you’re a framework author interested in being included on this list, [please let us know](https://github.com/reactjs/react.dev/issues/new?assignees=&labels=type%3A+framework&projects=&template=3-framework.yml&title=%5BFramework%5D%3A+).

**[Next.js' Pages Router](https://nextjs.org/)는 풀스택 React 프레임워크입니다.** 다재다능한 도구이며, 정적인 블로그부터 복잡한 동적 애플리케이션까지 다양한 크기의 React 애플리케이션을 만들 수 있습니다. 새로운 Next.js 프로젝트를 작성하려면 터미널에서 다음을 실행하세요.

<TerminalBlock>
npx create-next-app@latest
</TerminalBlock>

Next.js를 처음 사용하는 분이라면 [Next.js 배우기 코스](https://nextjs.org/learn)를 읽어보세요.

Next.js는 [Vercel](https://vercel.com/)이 관리합니다. 어느 Node.js 서버, 서버리스 호스팅 또는 직접 소유한 서버 어느 곳에라도 [Next.js 애플리케이션을 배포](https://nextjs.org/docs/app/building-your-application/deploying)할 수 있습니다. Next.js 는 서버가 필요없는 [static export](https://nextjs.org/docs/pages/building-your-application/deploying/static-exports) 도 제공합니다.

### Remix {/*remix*/}

**[Remix](https://remix.run/)는 중첩 라우팅이 가능한 풀스택 React 프레임워크입니다.** 애플리케이션을 중첩되는 하위 파트로 나눌 수 있으며, 각 파트는 병렬로 데이터를 읽어 들일 수 있고 사용자의 행동에 반응하여 다시 그려질 수 있습니다. 새로운 Remix 프로젝트를 작성하려면 다음을 실행하세요.

<TerminalBlock>
npx create-remix
</TerminalBlock>

Remix를 처음 사용하는 분이라면 Remix [블로그 자습서](https://remix.run/docs/en/main/tutorials/blog) (짧은 문서)와 [애플리케이션 자습서](https://remix.run/docs/en/main/tutorials/jokes) (긴 문서)를 참고하세요.

Remix는 [Shopify](https://www.shopify.com/)가 관리합니다. Remix 프로젝트를 작성할 때는 [배포할 대상을 선택](https://remix.run/docs/en/main/guides/deployment)해야 합니다. Remix 애플리케이션은 어느 Node.js 서버나 서버리스 호스팅에라도 [어댑터](https://remix.run/docs/en/main/other-api/adapter)를 사용하거나 직접 작성하여 배포할 수 있습니다.

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

React를 지속적으로 개선할 방법을 찾아가는 과정에서, 우리는 React를 프레임워크(특히 라우팅, 번들링, 서버 기술)와 더 밀접하게 통합하는 것이 React 사용자가 더 나은 앱을 만드는 데 도움을 줄 수 있는 가장 큰 기회라는 것을 깨달았습니다. Next.js 팀은 [React Server Component](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)와 같은 가장 최신의 React 기능을 프레임워크에 구애받지 않는 형태로 연구, 개발, 통합, 테스트하는 데에 협력하기로 합의했습니다.

이러한 기능들은 매일 프로덕션 수준에 근접하고 있으며 다른 번들러 및 프레임워크 개발자들과 이를 통합하기 위해 협의 중입니다. 희망으로는 1, 2년 후에 이 페이지에 나열된 모든 프레임워크가 이러한 기능을 지원했으면 합니다. (이러한 기능을 실험해 보기 위해 우리와 협력하고 싶은 프레임워크 개발자가 있다면 알려주세요!)

### Next.js (App Router) {/*nextjs-app-router*/}

**[Next.js's App Router](https://nextjs.org/docs)는 React 팀의 풀스택 아키텍처 비전을 구현하기 위해 재설계된 Next.js API입니다.** 이를 통해 서버에서 또는 빌드 중에 실행되는 비동기 컴포넌트에서 데이터를 가져올 수 있습니다.


Next.js는 [Vercel](https://vercel.com/)이 관리합니다. 어느 Node.js 서버, 서버리스 호스팅 또는 직접 소유한 서버 어느 곳에라도 [Next.js 애플리케이션을 배포](https://nextjs.org/docs/app/building-your-application/deploying)할 수 있습니다. Next.js 는 서버가 필요없는 [static export](https://nextjs.org/docs/pages/building-your-application/deploying/static-exports) 도 제공합니다.

<DeepDive>

#### React 팀의 풀스택 아키텍쳐 비전을 구현한 기능은 무엇인가요? {/*which-features-make-up-the-react-teams-full-stack-architecture-vision*/}

Next.js의 App Router 번들러는 공식 [React Server Components 명세](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md) 전체를 구현했습니다. 이를 통해 빌드 시간, 서버 전용, 대화형 컴포넌트를 하나의 React 트리에서 혼합할 수 있습니다.

예를 들어, 데이터베이스나 파일을 읽는 `async` 함수로 서버 전용 React 컴포넌트를 작성할 수 있습니다. 그런 다음 이를 통해 데이터를 대화형 컴포넌트로 전달할 수 있습니다.

```js
// 이 컴포넌트는 *서버(또는 빌드 중)에서만* 실행됩니다.
async function Talks({ confId }) {
  // 1. 서버에 있으므로 데이터 계층과 통신할 수 있습니다. API 엔드포인트가 필요하지 않습니다.
  const talks = await db.Talks.findAll({ confId });

  // 2. 렌더링 로직을 얼마든지 추가할 수 있습니다. JavaScript 번들 크기가 커지지 않습니다.
  const videos = talks.map(talk => talk.video);

  // 3. 브라우저에서 실행될 컴포넌트에 데이터를 전달합니다.
  return <SearchableVideoList videos={videos} />;
}
```

Next.js의 App Router는 또한 Suspense를 사용하는 데이터 통신과도 잘 어울립니다. 이를 통해 React 트리에서 사용자 인터페이스의 다른 부분에 대한 로딩 상태(스켈레톤 플레이스홀더와 같은)를 직접 지정할 수 있습니다.

```js
<Suspense fallback={<TalksLoading />}>
  <Talks confId={conf.id} />
</Suspense>
```

Server Component와 Suspense는 Next.js의 기능이 아닌 React의 기능입니다. 하지만 프레임워크 수준에서 이를 채택하려면 많은 노력과 비교적 복잡한 구현 작업이 필요합니다. 현재 기준으로는 Next.js의 App Router가 가장 완벽한 구현입니다. React 팀은 차세대 프레임워크에서는 이러한 기능을 구현하기 쉽도록 번들러 개발자와 공동으로 노력하고 있습니다.

</DeepDive>
