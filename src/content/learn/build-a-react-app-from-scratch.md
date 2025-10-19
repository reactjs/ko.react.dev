---
title: 처음부터 React 앱 만들기
---

<Intro>

앱에 기존 프레임워크에서 잘 제공되지 않는 제약 조건이 있거나, 자체 프레임워크를 구축하는 것을 선호하거나, React 앱의 기본 사항만 배우려는 경우 React 앱을 처음부터 빌드할 수 있습니다.

</Intro>

<DeepDive>

#### 프레임워크 사용을 고려해 보세요 {/*consider-using-a-framework*/}

React로 처음부터 시작하는 것은 React를 처음 사용하기에는 쉬운 방법이지만, 이 방식이 종종 자신만의 임시 프레임워크를 만드는 것과 다름없다는 점을 알아야 합니다. 요구사항이 발전함에 따라, 저희가 추천하는 프레임워크들이 이미 잘 개발하고 해결한 문제들을 직접 해결해야 할 수도 있습니다.

예를 들어, 나중에 앱이 서버 사이드 렌더링(SSR), 정적 사이트 생성(SSG), 또는 React 서버 컴포넌트<sup>RSC</sup>를 지원해야 한다면, 이 모든 것을 직접 구현해야 할 것입니다. 마찬가지로, 미래의 React 기능 중 프레임워크 수준의 통합이 필요한 기능이 있다면, 사용하고 싶을 때 직접 구현해야 합니다.

저희가 추천하는 프레임워크들은 더 나은 성능의 앱을 구축하는 데도 도움을 줍니다. 예를 들어, 네트워크 요청에서 워터폴<sup>Waterfall</sup> 현상을 줄이거나 제거하면 사용자 경험이 향상됩니다. 토이 프로젝트를 만들 때는 이것이 높은 우선순위가 아닐 수 있지만, 앱의 사용자가 늘어난다면 성능 개선을 원하게 될 것입니다.

이 방법을 택하면 상황에 따라 라우팅, 데이터 가져오기, 기타 기능을 개발하는 방식이 달라지기 때문에 지원을 받기가 더 어려워집니다. 이 옵션은 이러한 문제를 스스로 해결하는 데 익숙하거나, 이러한 기능들이 전혀 필요 없을 것이라고 확신하는 경우에만 선택해야 합니다.

추천 프레임워크 목록은 [새로운 React 앱 만들기](/learn/creating-a-react-app)를 확인해 보세요.

</DeepDive>


## Step 1: 빌드 툴 설치하기 {/*step-1-install-a-build-tool*/}

첫 번째 단계는 `vite`, `parcel` 또는 `rsbuild` 같은 빌드 툴을 설치하는 것입니다. 빌드 툴은 소스 코드를 패키징하고 실행하는 기능을 제공하며, 로컬 개발을 위한 개발 서버와 앱을 프로덕션 서버에 배포하기 위한 빌드 명령어를 제공합니다.

### Vite {/*vite*/}

[Vite](https://vite.dev/)는 모던 웹 프로젝트에서 빠르고 간결한 개발 환경을 제공하는 것을 목표로 하는 빌드 도구입니다.

<TerminalBlock>
{`npm create vite@latest my-app -- --template react`}
</TerminalBlock>

Vite는 명확한 특성을 보이며, 별도의 설정 없이도 합리적인 기본값을 제공합니다. Vite는 빠른 새로고침, JSX, Babel/SWC 등과 같은 일반적인 기능을 지원하는 풍부한 플러그인 생태계를 가지고 있습니다. 시작하려면 Vite의 [React 플러그인](https://ko.vite.dev/plugins/#vitejs-plugin-react) 또는 [React SWC 플러그인](https://ko.vite.dev/plugins/#vitejs-plugin-react-swc), 그리고 [React 서버 사이드 렌더링(SSR) 예시 프로젝트](https://ko.vite.dev/guide/ssr.html#example-projects)를 참고하세요.

Vite는 저희가 [추천하는 프레임워크](/learn/creating-a-react-app)인 [React Router](https://reactrouter.com/start/framework/installation)에서도 이미 빌드 툴로 사용하고 있습니다.

### Parcel {/*parcel*/}

[Parcel](https://parceljs.org/)은 뛰어난 기본 개발 경험과 함께, 프로젝트를 이제 막 시작하는 단계부터 대규모 프로덕션 애플리케이션까지 확장할 수 있는 아키텍처를 결합한 빌드 툴입니다.

<TerminalBlock>
{`npm install --save-dev parcel`}
</TerminalBlock>

Parcel은 별다른 설정 없이도 빠른 새로고침<sup>Fast Refresh</sup>, JSX, TypeScript, Flow 그리고 스타일링 기능을 지원합니다. 시작하려면 [Parcel에서 React 시작하기](https://parceljs.org/recipes/react/#getting-started)를 참고하세요.

### Rsbuild {/*rsbuild*/}

[Rsbuild](https://rsbuild.dev/)는 React 애플리케이션에 원활한 개발 경험을 제공하는 Rspack 기반의 빌드 툴입니다. 즉시 사용할 수 있도록 신중하게 조정된 기본 설정과 성능 최적화가 적용되어 있습니다.

<TerminalBlock>
{`npx create-rsbuild --template react`}
</TerminalBlock>

Rsbuild는 빠른 새로고침, JSX, TypeScript, 그리고 스타일링과 같은 React 기능을 기본적으로 지원합니다. 시작하려면 [Rsbuild의 React 가이드](https://rsbuild.dev/guide/framework/react)를 참고하세요.

<Note>

#### React Native를 위한 Metro {/*react-native*/}

React Native로 처음부터 시작한다면, React Native용 JavaScript 번들러인 [Metro](https://metrobundler.dev/)를 사용해야 합니다. Metro는 iOS 및 Android 같은 플랫폼을 위한 번들링을 지원하지만, 여기에 언급된 다른 툴들과 비교했을 때 많은 기능이 부족합니다. 따라서 프로젝트에 React Native 지원이 필요한 것이 아니라면, Vite, Parcel, 또는 Rsbuild로 시작하는 것을 추천합니다.

</Note>

## Step 2: 일반적인 애플리케이션 패턴 구축 {/*step-2-build-common-application-patterns*/}

위에서 언급한 빌드 도구들은 클라이언트 전용의 단일 페이지 앱(SPA)으로 시작하지만, 라우팅, 데이터 가져오기, 스타일링과 같은 일반적인 기능에 대한 추가적인 솔루션은 포함하지 않습니다.

React 생태계에는 이러한 문제들을 해결하기 위한 많은 도구가 있습니다. 저희는 널리 사용되는 몇 가지 도구를 출발점으로 제시했지만, 본인에게 더 적합한 다른 도구들을 자유롭게 선택해도 좋습니다.

### 라우팅 {/*routing*/}

라우팅은 사용자가 특정 URL에 접속했을 때 어떤 콘텐츠나 페이지를 보여줄지 결정합니다. URL을 앱의 다양한 부분과 대응하기 위해 라우터를 설정해야 합니다. 또한 중첩 라우터, 경로 매개변수, 쿼리 매개변수도 처리해야 합니다. 라우터는 코드 내에서 구성하거나, 컴포넌트 폴더 및 파일 구조를 기반으로 정의할 수 있습니다.

라우터는 최신 애플리케이션의 핵심 부분이며, 일반적으로 데이터 가져오기(더 빠른 로딩을 위한 전체 페이지 데이터 미리 가져오기 포함), (클라이언트 번들 크기 최소화를 위한) 코드 분할, (각 페이지가 어떻게 생성되는지 결정하는) 페이지 렌더링 방식과 통합됩니다.

다음을 사용하는 것을 제안합니다.

- [React Router](https://reactrouter.com/start/data/custom)
- [Tanstack Router](https://tanstack.com/router/latest)


### 데이터 가져오기 {/*data-fetching*/}

서버나 다른 데이터 소스에서 데이터를 가져오는 것은 대부분의 애플리케이션에서 핵심적인 부분입니다. 이를 올바르게 수행하려면 로딩 상태, 오류 상태, 가져온 데이터 캐싱을 처리해야 하는데, 이는 복잡할 수 있습니다.

목적에 맞게 제작된 데이터 가져오기 라이브러리는 데이터를 가져오고 캐싱하는 어려운 작업을 대신 해주므로, 개발자는 앱에 필요한 데이터가 무엇인지, 그리고 어떻게 표시할지에 집중할 수 있습니다. 이러한 라이브러리는 일반적으로 컴포넌트에서 직접 사용되지만, 더 빠른 미리 가져오기<sup>Pre-Fetching</sup>와 더 나은 성능을 위해 라우팅 로더에 통합될 수도 있고, 서버 렌더링에서도 사용될 수 있습니다.

컴포넌트에서 직접 데이터를 가져오면 네트워크 요청 폭포<sup>Network Request Waterfall</sup> 현상으로 인해 로딩 시간이 느려질 수 있다는 사실을 알아두세요. 그래서 저희는 라우터 로더나 서버에서 최대한 데이터를 미리 가져오는 것을 권장합니다! 이렇게 하면 페이지를 표시할 때 페이지의 데이터를 한꺼번에 가져올 수 있습니다.

대부분의 백엔드나 REST 스타일 API에서 데이터를 가져온다면 다음을 사용할 것을 제안합니다.

- [React Query](https://tanstack.com/query/latest)
- [SWR](https://swr.vercel.app/)
- [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)

GraphQL API에서 데이터를 가져온다면 다음을 사용할 것을 제안합니다.

- [Apollo](https://www.apollographql.com/docs/react)
- [Relay](https://relay.dev/)


### 코드 분할 {/*code-splitting*/}

코드 분할은 앱을 더 작은 번들로 나누어 필요할 때만 로드할 수 있도록 하는 과정입니다. 앱의 코드 크기는 새로운 기능과 추가적인 의존성이 생길 때마다 증가합니다. 앱 전체의 코드는 사용되기 전에 모두 전송되어야 하므로 로딩 속도가 느려질 수 있습니다. 캐싱, 기능/의존성 감소, 일부 코드가 서버에서 실행되도록 코드를 이동하는 방법이 느린 로딩을 완화하는 데 도움이 될 수 있지만, 과도하게 사용하면 기능적으로 손해를 볼 수 있는 불완전한 해결책입니다.

마찬가지로, 프레임워크를 사용하는 앱이 코드 분할을 처리하도록 의존한다면, 오히려 코드 분할을 전혀 하지 않았을 때보다 로딩이 느려지는 상황을 겪을 수도 있습니다. 예를 들어, 차트를 [지연 로딩](/reference/react/lazy)하면 차트를 렌더링하는 데 필요한 코드 전송이 지연되어 차트 코드가 앱의 나머지 부분과 분리됩니다. [Parcel은 `React.lazy`를 이용한 코드 분할](https://parceljs.org/recipes/react/#code-splitting)을 지원합니다. 하지만 차트가 초기 렌더링 된 후에 데이터를 로드한다면, 두 번 기다려야 합니다. 이것이 바로 폭포 현상입니다. 차트 데이터를 가져오고 렌더링 코드를 동시에 보내는 것보다 각 단계가 순서대로 완료되는 것을 더 기다려야 합니다.

번들링 및 데이터 가져오기와 통합할 때 라우트별로 코드를 나누면, 앱의 초기 로드 시간과 가장 큰 시각적 콘텐츠가 렌더링 되는 시간([Largest Contentful Paint](https://web.dev/articles/lcp))을 줄일 수 있습니다.

코드 분할 지침은 빌드 도구 문서를 참조하세요.
- [Vite 빌드 최적화](https://vite.dev/guide/features.html#build-optimizations)
- [Parcel 코드 분할](https://parceljs.org/features/code-splitting/)
- [Rsbuild 코드 분할](https://rsbuild.dev/guide/optimization/code-splitting)

### 애플리케이션 성능 향상 {/*improving-application-performance*/}

Since the build tool you select only supports single page apps (SPAs), you'll need to implement other [rendering patterns](https://www.patterns.dev/vanilla/rendering-patterns) like server-side rendering (SSR), static site generation (SSG), and/or React Server Components (RSC). Even if you don't need these features at first, in the future there may be some routes that would benefit SSR, SSG or RSC.

* **단일 페이지 앱 (SPA)** 은 단일 HTML 페이지를 로드하고 사용자가 앱과 상호작용을 할 때 페이지를 동적으로 업데이트합니다. SPA는 시작하기는 더 쉽지만, 초기 로드 시간이 느릴 수 있습니다. SPA는 대부분의 빌드 도구에서 기본 아키텍처입니다.

* **스트리밍 서버 측 렌더링(SSR)** 은 서버에서 페이지를 렌더링하고 완전히 렌더링 된 페이지를 클라이언트로 보냅니다. SSR은 성능을 향상할 수 있지만, 단일 페이지 앱보다 설정하고 유지 관리하는 것이 더 복잡할 수 있습니다. 스트리밍 기능이 추가되면서 SSR은 설정 및 유지 관리가 매우 복잡해질 수 있습니다. [Vite의 SSR 가이드](https://vite.dev/guide/ssr.html)를 참조하세요.

* **정적 사이트 생성(SSG)** 은 빌드 시점에 앱에 대한 정적 HTML 파일을 생성합니다. SSG는 성능을 향상할 수 있지만, 서버 측 렌더링보다 설정하고 유지 관리하는 것이 더 복잡할 수 있습니다. [Vite의 SSG 가이드](https://vite.dev/guide/ssr.html#pre-rendering-ssg)를 참조하세요.

* **React 서버 컴포넌트(RSC)** 를 사용하면 빌드 타임, 서버 전용, 대화형 컴포넌트를 단일 React 트리에서 혼합할 수 있습니다. RSC는 성능을 향상할 수 있지만, 현재는 설정하고 유지 관리하는 데 깊은 전문 지식이 필요합니다. [Parcel의 RSC 예시](https://github.com/parcel-bundler/rsc-examples)를 참조하세요.

프레임워크로 만들어진 앱이 라우트별로 렌더링 전략을 선택할 수 있도록, 렌더링 전략은 라우터와 통합되어야 합니다. 이렇게 하면 전체 앱을 다시 작성할 필요 없이 다양한 렌더링 전략을 사용할 수 있습니다. 예를 들어, 앱의 랜딩 페이지는 정적으로 생성되는 것(SSG)이 유리할 수 있지만, 콘텐츠 피드가 있는 페이지는 서버 측 렌더링이 가장 잘 작동할 수 있습니다.

올바른 라우트에 올바른 렌더링 전략을 사용하면 콘텐츠의 첫 바이트가 로드되는 시간([Time to First Byte](https://web.dev/articles/ttfb)), 첫 번째 콘텐츠가 렌더링 되는 시간([First Contentful Paint](https://web.dev/articles/fcp)), 그리고 앱의 가장 큰 시각적 콘텐츠가 렌더링되는 시간([Largest Contentful Paint](https://web.dev/articles/lcp))을 줄일 수 있습니다.

### 그리고 더... {/*and-more*/}

이것들은 새로운 앱을 처음부터 구축할 때 고려해야 할 기능들의 몇 가지 예시에 불과합니다. 맞닥뜨리게 될 많은 제약은 각 문제가 서로 얽혀 있고 익숙하지 않은 문제 영역에 대한 깊은 전문 지식을 요구할 수 있기 때문에 해결하기 어려울 수 있습니다.

이러한 문제들을 직접 해결하고 싶지 않다면, 이러한 기능을 바로 제공하는 [프레임워크로 시작](/learn/creating-a-react-app)할 수 있습니다.
