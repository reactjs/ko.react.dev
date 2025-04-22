---
title: 처음부터 React 앱 만들기
---

<Intro>

기존 프레임워크로 해결하기 어려운 제약이 있거나, 직접 프레임워크를 만들어 보고 싶거나, 리액트 앱의 기본 구조를 배우고 싶다면 처음부터 직접 구성해볼 수도 있습니다.

</Intro>

<DeepDive>

#### 프레임워크 사용을 고려해보세요 {/*consider-using-a-framework*/}

처음부터 직접 구성하는 방식은 리액트를 시작하기에 쉬운 방법입니다. 하지만 이 방식은 결국 나만의 임시 프레임워크를 만들게 되는 것과 같다는 점에 유의해야 합니다. 요구 사항이 늘어나면서, 기존에 잘 정리된 프레임워크들이 이미 해결해둔 문제들을 직접 다뤄야 할 수도 있습니다.

예를 들어, 나중에 서버 사이드 렌더링(SSR), 정적 사이트 생성(SSG), React 서버 컴포넌트(RSC) 등의 기능이 필요해지면, 이를 직접 구현해야 합니다. 또한 향후 React에서 프레임워크 수준의 통합이 필요한 기능이 추가될 경우에도, 이를 사용하고 싶다면 스스로 구현해야 합니다.

공식적으로 권장하는 프레임워크들은 앱의 성능 향상에도 도움이 됩니다. 예를 들어, 네트워크 요청에서 워터폴 현상을 줄이거나 없애면 사용자 경험이 훨씬 좋아집니다. 간단한 프로젝트에서는 중요하지 않을 수 있지만, 앱에 실제 사용자가 생기면 성능을 개선하고 싶어질 수 있습니다.

이 방식은 라우팅, 데이터 패칭 등 여러 기능을 직접 구현해야 하므로, 도움을 받기도 더 어려워집니다. 이러한 문제들을 스스로 해결할 자신이 있거나, 해당 기능들이 앞으로도 필요하지 않을 거라 확신하는 경우에만 이 옵션을 선택하는 것이 좋습니다.

추천 프레임워크 목록은 리액트 앱 만들기에서 확인할 수 있습니다. [Creating a React App](/learn/creating-a-react-app).

</DeepDive>


## 1단계: 빌드 도구 설치하기 {/*step-1-install-a-build-tool*/}

가장 먼저 해야 할 일은 `vite`, `parcel`, `rsbuild` 같은 빌드 도구를 설치하는 것입니다.
이러한 도구는 소스 코드를 번들링하고 실행할 수 있게 해주며, 로컬 개발을 위한 개발 서버와 프로덕션 배포를 위한 빌드 명령도 제공합니다.

### Vite {/*vite*/}

[Vite](https://vite.dev/)는 모던 웹 프로젝트에서 빠르고 간결한 개발 환경을 제공하는 것을 목표로 하는 빌드 도구입니다.

<TerminalBlock>
{`npm create vite@latest my-app -- --template react`}
</TerminalBlock>

Vite는 자체 철학을 갖고 고유하게 구현된 (opinionated) 기본 설정이 잘 갖춰진 빌드 도구입니다. 빠른 새로고침, JSX, Babel/SWC 등 자주 사용하는 기능들을 위한 플러그인 생태계도 잘 갖춰져 있습니다.
시작하려면 Vite의 [React 플러그인](https://vite.dev/plugins/#vitejs-plugin-react) or [React SWC 플러그인](https://vite.dev/plugins/#vitejs-plugin-react-swc) and [React SSR 예시 프로젝트](https://vite.dev/guide/ssr.html#example-projects)를 참고해 보세요.

Vite는 이미 우리가 [추천하는 프레임워크](/learn/creating-a-react-app) 중 하나인 [React Router](https://reactrouter.com/start/framework/installation)에서 빌드 도구로 사용되고 있습니다.

### Parcel {/*parcel*/}

[Parcel](https://parceljs.org/)은 처음 시작할 때도 뛰어난 개발 경험을 제공하며, 대규모 프로덕션 앱까지 확장할 수 있는 구조를 갖춘 빌드 도구입니다.

<TerminalBlock>
{`npm install --save-dev parcel`}
</TerminalBlock>

Parcel은 빠른 새로고침, JSX, TypeScript, Flow, 스타일링 등을 별도 설정 없이 바로 지원합니다.
시작하려면 [Parcel의 React 자습서](https://parceljs.org/recipes/react/#getting-started)를 참고해 보세요.

### Rsbuild {/*rsbuild*/}

[Rsbuild](https://rsbuild.dev/)는 Rspack 기반의 빌드 도구로, React 애플리케이션을 위한 매끄러운 개발 경험을 제공합니다. 신중하게 설정된 기본값과 성능 최적화가 기본으로 적용되어 있어 바로 사용할 수 있습니다.


<TerminalBlock>
{`npx create-rsbuild --template react`}
</TerminalBlock>

Rsbuild는 빠른 새로고침, JSX, TypeScript, 스타일링 등 React에서 자주 사용하는 기능들을 기본으로 지원합니다.
시작하려면 [Rsbuild의 React 가이드](https://rsbuild.dev/guide/framework/react)를 참고해 보세요.

<Note>

#### React Native용 Metro {/*react-native*/}

React Native를 처음부터 시작한다면, [Metro](https://metrobundler.dev/)를 사용해야 합니다.
Metro는 React Native를 위한 자바스크립트 번들러로, iOS나 Android 같은 플랫폼을 위한 번들링을 지원합니다.
다만, 이 문서에서 소개한 다른 도구들과 비교하면 지원하는 기능이 부족합니다.
React Native가 꼭 필요한 경우가 아니라면 Vite, Parcel, Rsbuild 중 하나로 시작하는 것을 권장합니다.

</Note>

## 2단계: 공통 애플리케이션 패턴 구현하기 {/*step-2-build-common-application-patterns*/}

앞서 소개한 빌드 도구들은 기본적으로 클라이언트 전용 단일 페이지 애플리케이션(SPA) 구조로 시작하지만, 라우팅, 데이터 패칭, 스타일링과 같은 일반적인 기능에 대한 솔루션은 포함하고 있지 않습니다.

이러한 기능들은 리액트 생태계에 다양한 도구들이 마련되어 있습니다. 여기서는 많이 사용되는 몇 가지를 소개하지만, 더 잘 맞는 도구가 있다면 자유롭게 선택해도 괜찮습니다.

### 라우팅 {/*routing*/}

라우팅은 사용자가 특정 URL에 접근했을 때 어떤 페이지나 콘텐츠를 보여줄지를 결정하는 기능입니다.
앱의 각 URL을 적절한 컴포넌트나 페이지에 연결하려면 라우터 설정이 필요하며, 중첩 라우트, 라우트 파라미터, 쿼리 파라미터 처리도 함께 고려해야 합니다. 라우터는 코드 안에서 직접 구성할 수도 있고, 폴더와 파일 구조를 기반으로 정의할 수도 있습니다.

라우팅은 현대적인 애플리케이션에서 핵심적인 역할을 합니다. 대개는 데이터 패칭(페이지 단위로 미리 데이터를 불러오기), 코드 분할(번들 크기 최소화), 페이지 렌더링 방식 결정(페이지를 어떻게 생성할지)과 함께 통합되어 사용됩니다.

추천 도구는 다음과 같습니다:

- [React Router](https://reactrouter.com/start/data/custom)
- [Tanstack Router](https://tanstack.com/router/latest)


### 데이터 패칭 {/*data-fetching*/}

대부분의 애플리케이션에서 서버나 외부 데이터 소스로부터 데이터를 가져오는 작업은 핵심 기능입니다.
이 작업을 제대로 처리하려면 로딩 상태, 오류 상태, 가져온 데이터의 캐싱 등을 함께 관리해야 하며, 이 과정은 꽤 복잡할 수 있습니다.

데이터 패칭을 전문으로 하는 라이브러리를 사용하면, 데이터 가져오기와 캐싱 같은 복잡한 부분은 도구가 대신 처리해주고, 어떤 데이터를 가져올지와 어떻게 보여줄지에만 집중할 수 있습니다.
이런 라이브러리는 일반적으로 컴포넌트 안에서 직접 사용하지만, 성능상 라우터의 로더에 통합해 미리 데이터를 가져오거나, 서버 렌더링과 함께 사용할 수도 있습니다.

참고로, 컴포넌트 안에서 직접 데이터를 가져오면 네트워크 요청이 연쇄적(waterfalls)으로 발생해 로딩이 느려질 수 있습니다. 가능하면 라우터 로더나 서버에서 미리 데이터를 패칭해 페이지가 렌더링될 때 한 번에 데이터를 불러오는 방식이 더 권장됩니다.

REST 스타일 API나 일반적인 백엔드에서 데이터를 가져오는 경우, 다음 도구들을 추천합니다:

- [React Query](https://react-query.tanstack.com/)
- [SWR](https://swr.vercel.app/)
- [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)

GraphQL API에서 데이터를 가져오는 경우에는 다음 도구들이 유용합니다:

- [Apollo](https://www.apollographql.com/docs/react)
- [Relay](https://relay.dev/)


### 코드 분할 {/*code-splitting*/}

코드 분할은 앱을 더 작은 번들로 나누고, 필요한 시점에 해당 번들만 불러오도록 하는 기법입니다.
앱의 기능이 늘어나고 의존성이 추가될수록 전체 코드 크기도 함께 커지게 됩니다. 이렇게 되면 앱을 사용하기 전에 모든 코드를 한 번에 받아야 하므로, 초기 로딩 속도가 느려질 수 있습니다.
기능이나 의존성을 줄이거나, 일부 코드를 서버에서 실행하도록 옮기거나, 캐싱을 활용하는 방법도 있지만, 지나치게 사용하면 앱의 기능을 희생하게 되는 경우도 있습니다.

또한 프레임워크를 사용하는 쪽에서 직접 코드 분할을 처리하도록 맡기는 경우, 오히려 아무런 분할을 하지 않았을 때보다 느려지는 상황이 생길 수 있습니다. 예를 들어, 차트를 [지연 로딩](/reference/react/lazy)하면, 차트를 렌더링하는 데 필요한 코드는 앱의 나머지 코드와 분리되어 나중에 전송됩니다. [Parcel은 React.lazy를 통한 코드 분할을 지원](https://parceljs.org/recipes/react/#code-splitting)합니다. 그런데 차트가 렌더링된 후에야 데이터를 요청한다면, 데이터를 기다리는 시간이 코드 로딩 이후에 또 한 번 발생합니다. 이처럼 순차적으로 처리되어 전체 로딩 시간이 늘어나는 현상을 워터폴이라고 부릅니다. 코드를 불러오고 데이터를 패칭하는 작업이 동시에 일어나지 않기 때문에 발생합니다.

라우트 단위로 코드를 나누고, 이를 번들링 및 데이터 패칭과 함께 통합하면 초기 로딩 시간과 앱의 주요 콘텐츠가 화면에 표시되는 시간([Largest Contentful Paint](https://web.dev/articles/lcp))을 줄일 수 있습니다.

코드 분할 방법은 사용하는 빌드 도구 문서를 참고하세요:
- [Vite build optimizations](https://v3.vitejs.dev/guide/features.html#build-optimizations)
- [Parcel code splitting](https://parceljs.org/features/code-splitting/)
- [Rsbuild code splitting](https://rsbuild.dev/guide/optimization/code-splitting)

### 애플리케이션 성능 개선하기 {/*improving-application-performance*/}

앞서 소개한 빌드 도구들은 기본적으로 단일 페이지 애플리케이션(SPA)만 지원하므로, 서버 사이드 렌더링(SSR), 정적 사이트 생성(SSG), React 서버 컴포넌트(RSC) 같은 [렌더링 패턴](https://www.patterns.dev/vanilla/rendering-patterns)을 직접 구현해야 합니다. 처음에는 이러한 기능이 필요하지 않을 수 있지만, 시간이 지나면서 일부 라우트에서는 SSR, SSG 또는 RSC가 더 적합한 경우가 생길 수 있습니다.

* **SPA(Single-page app)**는 하나의 HTML 페이지를 불러온 뒤, 사용자 상호작용에 따라 페이지를 동적으로 업데이트합니다. 시작하기는 쉽지만, 초기 로딩 속도가 느릴 수 있습니다. 대부분의 빌드 도구는 SPA를 기본 구조로 사용합니다.

* **스트리밍 서버 사이드 렌더링(SSR)**은 페이지를 서버에서 렌더링한 후 완성된 HTML을 클라이언트에 전달합니다. 성능을 개선할 수 있지만, SPA보다 설정과 유지 관리가 더 복잡합니다. 특히 스트리밍 기능이 추가되면 구현 난이도가 더 높아집니다. 자세한 내용은 [Vite의 SSR 가이드](https://vite.dev/guide/ssr)를 참고하세요.

* **정적 사이트 생성(SSG)**은 앱의 HTML 파일을 빌드 시점에 미리 생성합니다. SSR보다도 빠를 수 있지만, 설정과 관리가 까다로울 수 있습니다. 자세한 내용은 [Vite의 SSG 가이드](https://vite.dev/guide/ssr.html#pre-rendering-ssg)를 참고하세요.

* **React 서버 컴포넌트(RSC)**는 빌드 시점, 서버 전용, 클라이언트 상호작용 컴포넌트를 하나의 트리 안에서 함께 사용할 수 있도록 해줍니다. 성능 개선에 효과적이지만, 현재로서는 설정과 유지에 높은 수준의 전문성이 필요합니다. [Parcel의 RSC 예시](https://github.com/parcel-bundler/rsc-examples)를 참고해 보세요.


렌더링 전략은 라우터와 통합되어야 각 라우트별로 적절한 렌더링 방식을 선택할 수 있습니다. 이렇게 하면 전체 앱을 다시 작성하지 않고도 라우트마다 다른 전략을 적용할 수 있습니다. 예를 들어, 랜딩 페이지는 정적 생성(SSG) 방식이 적합할 수 있고, 콘텐츠 피드가 있는 페이지는 서버 사이드 렌더링(SSR)이 더 나은 성능을 낼 수 있습니다.

라우트에 맞는 렌더링 전략을 적용하면 콘텐츠가 처음 도착하는 시간 ([Time to First Byte](https://web.dev/articles/ttfb)), 첫 번째 콘텐츠가 화면에 렌더링되는 시간 ([First Contentful Paint](https://web.dev/articles/fcp)), 가장 큰 콘텐츠가 화면에 표시되는 시간 ([Largest Contentful Paint](https://web.dev/articles/lcp))을 줄일 수 있습니다. 



### 그리고 더... {/*and-more*/}

지금까지 소개한 내용은 새 앱을 처음부터 만들 때 고려해야 할 기능들 중 일부에 불과합니다.
직접 개발하다 보면 여러 제약에 부딪히게 되며, 각각의 문제는 서로 얽혀 있어서 해결이 쉽지 않고, 익숙하지 않은 영역에 대한 깊은 이해가 필요할 수도 있습니다.

이러한 문제들을 직접 해결하고 싶지 않다면, 필요한 기능들이 기본으로 포함된 [프레임워크로 시작](/learn/creating-a-react-app)해보는 것을 추천합니다.

