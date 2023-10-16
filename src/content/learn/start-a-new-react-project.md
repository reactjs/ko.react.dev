---
title: 새로운 React 프로젝트 시작하기
---

<Intro>

React를 전체적으로 적용한 애플리케이션이나 웹 사이트를 새롭게 작성하고 싶다면 커뮤니티에서 React 기반 프레임워크 중 하나를 사용하는 것이 좋습니다. 이런 프레임워크는 대부분의 애플리케이션이나 웹 사이트에서 사용하게 될 라우팅, data fetching, HTML 생성과 같은 기능을 제공합니다.

</Intro>

<Note>

**로컬에서 개발하려면 [Node.js](https://nodejs.org/ko/)를 설치해야 합니다.** 원한다면 프로덕션 환경에서도 Node.js를 사용할 수 있지만 꼭 필요하지는 않습니다. 많은 React 프레임워크가 정적 HTML/CSS/JS 폴더로 내보내는 기능을 지원합니다.

</Note>

## 프로덕션 수준의 React 프레임워크 {/*production-grade-react-frameworks*/}

### Next.js {/*nextjs*/}

**[Next.js](https://nextjs.org/)는 풀스택 React 프레임워크입니다.** 다재다능한 도구이며, 정적인 블로그부터 복잡한 동적 애플리케이션까지 다양한 크기의 React 애플리케이션을 만들 수 있습니다. 새로운 Next.js 프로젝트를 작성하려면 터미널에서 다음을 실행하세요.

<TerminalBlock>
npx create-next-app@latest
</TerminalBlock>

Next.js를 처음 사용하는 분이라면 [Next.js 자습서](https://nextjs.org/learn/foundations/about-nextjs)를 읽어보세요.

<<<<<<< HEAD
Next.js는 [Vercel](https://vercel.com/)이 관리합니다. 어느 Node.js 서버, 서버리스 호스팅 또는 직접 소유한 서버 어느 곳에라도 [Next.js 애플리케이션을 배포](https://nextjs.org/docs/deployment)할 수 있습니다. [완전 정적인 Next.js 애플리케이션](https://nextjs.org/docs/advanced-features/static-html-export)은 어느 정적 호스팅에라도 배포할 수 있습니다.
=======
Next.js is maintained by [Vercel](https://vercel.com/). You can [deploy a Next.js app](https://nextjs.org/docs/app/building-your-application/deploying) to any Node.js or serverless hosting, or to your own server. Next.js also supports a [static export](https://nextjs.org/docs/pages/building-your-application/deploying/static-exports) which doesn't require a server.
>>>>>>> e85b71de88a20cda9588f51f01d4a70e5cbe1cb4

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

<DeepDive>

#### 프레임워크 없이 React를 사용할 수 있나요? {/*can-i-use-react-without-a-framework*/}

당연히 프레임워크 없이도 React를 사용할 수 있습니다. [기존 페이지의 일부에 React를 사용하는 방법](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page)이 바로 그것입니다. **하지만 새로운 앱이나 사이트를 React로 완전히 작성한다면 프레임워크를 사용하는 것을 권장합니다.**

이유는 다음과 같습니다.

라우터나 데이터 통신 기능이 처음에는 필요하지 않더라도 나중에는 관련 기능을 위한 라이브러리를 추가하고 싶어질 수 있습니다. 새로운 기능을 추가할 때마다 JavaScript 번들의 크기가 증가하면 각 라우팅 경로로 코드를 분할하는 방법을 알아야 할 것입니다. 데이터 통신이 복잡해지면 서버-클라이언트 네트워크 통신이 꼬리에 꼬리를 물게 되어 앱이 매우 느려질 수 있습니다. 네트워크 상태가 좋지 않거나 저사양 기기를 사용하는 사용자가 많아지면 컴포넌트에서 HTML을 생성하여 콘텐츠를 빠르게 표시해야 할 수도 있습니다. 서버나 빌드 시간에 코드를 실행하도록 설정을 변경하기는 매우 까다로울 수 있습니다.

**이 문제는 비단 React에서만 발생하지 않습니다. 그래서 Svelte에는 SvelteKit이 있고 Vue에는 Nuxt가 있는 것입니다.** 이 문제를 스스로 해결하려면 번들러를 라우터와 데이터 통신 라이브러리와 통합해야 합니다. 초기 설정을 작성하는 것은 어렵지 않지만, 앱이 시간이 지남에 따라 커져도 빠르게 로드되는 앱을 만드는 데에는 많은 미묘한 점이 있습니다. 앱 코드의 최소한의 양을 보내야 하지만, 페이지에 필요한 데이터와 함께 클라이언트-서버 라운드 트립을 하나로 통합해야 합니다. JavaScript 코드가 실행되기 전에 페이지가 상호작용할 수 있도록 하고, 점진적 기능 향상을 지원하기 위해 페이지가 로드되기 전에도 작동하는 정적 HTML 파일을 생성하여 마케팅 페이지를 어디에서나 호스팅할 수 있도록 할 수도 있습니다. 이러한 기능을 직접 구축하는 것은 실제로 작업이 필요합니다.

**이 페이지에 있는 React 프레임워크는 사용자의 추가적인 노력없이 이러한 문제를 기본적으로 해결하고 있습니다.** 해당 프레임워크는 사용자가 애플리케이션을 가볍게 시작하여 필요에 따라 점차 규모를 키울 수 있도록 합니다. 각 React 프레임워크는 관련 커뮤니티가 있으므로 질문과 답변을 쉽게 찾을 수 있고, 도구를 업그레이드하는 것도 쉽습니다. 프레임워크는 코드에 구조를 제공하여 사용자와 다른 사람이 다른 프로젝트 간에도 컨텍스트와 기술을 유지할 수 있도록 도와줍니다. 반대로 사용자 정의 설정을 사용하면 지원되지 않는 종속성 버전에 갇히기 쉽고, 사실상 자체 프레임워크를 만들게 됩니다(이전에 만든 프레임워크와 비슷하게, 덜 구조화된 것일 수 있습니다).

아직도 잘 이해가 되지 않았거나 이러한 프레임워크로 충분히 해결되지 않는 특이한 제약 조건이 있어서 자신만의 설정을 만들고 싶다면 말리지 않겠습니다, 실행에 옮기세요! npm에서 `react`와 `react-dom`을 가져와서 [Vite](https://vitejs.dev/)나 [Parcel](https://parceljs.org/)과 같은 번들러를 사용하여 사용자 정의 빌드 프로세스를 설정하고, 라우팅, 정적 생성, 서버 사이드 렌더링 등에 필요한 도구를 추가하세요.
</DeepDive>

## 최신 React 프레임워크 {/*bleeding-edge-react-frameworks*/}

React를 지속적으로 개선할 방법을 찾아가는 과정에서, 우리는 React를 프레임워크(특히 라우팅, 번들링, 서버 기술)와 더 밀접하게 통합하는 것이 React 사용자가 더 나은 앱을 만드는 데 도움을 줄 수 있는 가장 큰 기회라는 것을 깨달았습니다. Next.js 팀은 [React Server Component](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)와 같은 가장 최신의 React 기능을 프레임워크에 구애받지 않는 형태로 연구, 개발, 통합, 테스트하는 데에 협력하기로 합의했습니다.

이러한 기능들은 매일 프로덕션 수준에 근접하고 있으며 다른 번들러 및 프레임워크 개발자들과 이를 통합하기 위해 협의 중입니다. 희망으로는 1, 2년 후에 이 페이지에 나열된 모든 프레임워크가 이러한 기능을 지원했으면 합니다. (이러한 기능을 실험해 보기 위해 우리와 협력하고 싶은 프레임워크 개발자가 있다면 알려주세요!)

### Next.js (App Router) {/*nextjs-app-router*/}

<<<<<<< HEAD
**[Next.js의 App Router](https://beta.nextjs.org/docs/getting-started)는 React 팀의 풀스택 아키텍처 비전을 구현하기 위해 재설계된 Next.js API입니다.** 이를 통해 서버에서 또는 빌드 중에 실행되는 비동기 컴포넌트에서 데이터를 가져올 수 있습니다.

Next.js는 [Vercel](https://vercel.com/)이 관리합니다. 어느 Node.js 서버, 서버리스 호스팅 또는 직접 소유한 서버 어느 곳에라도 [Next.js 애플리케이션을 배포](https://nextjs.org/docs/deployment) 할 수 있습니다. Next.js는 서버가 필요하지 않은 [정적 사이트로 내보내기](https://beta.nextjs.org/docs/configuring/static-export)도 지원합니다.
<Pitfall>

Next.js의 App Router는 **현재 베타 버전이며 아직 프로덕션 사용을 권장하지는 않습니다**(2023년 3월 현재 기준). 기존 Next.js 프로젝트에서 이를 실험해보려면 [점진적 마이그레이션 가이드](https://beta.nextjs.org/docs/upgrade-guide#migrating-from-pages-to-app)를 참고하세요.

</Pitfall>
=======
**[Next.js's App Router](https://nextjs.org/docs) is a redesign of the Next.js APIs aiming to fulfill the React team’s full-stack architecture vision.** It lets you fetch data in asynchronous components that run on the server or even during the build.

Next.js is maintained by [Vercel](https://vercel.com/). You can [deploy a Next.js app](https://nextjs.org/docs/app/building-your-application/deploying) to any Node.js or serverless hosting, or to your own server. Next.js also supports [static export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports) which doesn't require a server.
>>>>>>> e85b71de88a20cda9588f51f01d4a70e5cbe1cb4

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