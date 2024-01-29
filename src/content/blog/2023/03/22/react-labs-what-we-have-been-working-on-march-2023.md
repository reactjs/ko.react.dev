---
title: "React Labs: 그동안의 작업 – 2023년 3월"
---

2023년 3월 22일, [Joseph Savona](https://twitter.com/en_JS), [Josh Story](https://twitter.com/joshcstory), [Lauren Tan](https://twitter.com/potetotes), [Mengdi Chen](https://twitter.com/mengdi_en), [Samuel Susla](https://twitter.com/SamuelSusla), [Sathya Gunasekaran](https://twitter.com/_gsathya), [Sebastian Markbåge](https://twitter.com/sebmarkbage), [Andrew Clark](https://twitter.com/acdlite)

---

<Intro>

<<<<<<< HEAD
React Labs 게시글에는 활발히 연구 개발 중인 프로젝트에 대한 내용을 작성합니다. 우리는 [지난 업데이트](https://react.dev/blog/2022/06/15/react-labs-what-we-have-been-working-on-june-2022) 이후 상당한 발전을 이루었고, 그 내용들을 공유하려고 합니다.
=======
In React Labs posts, we write about projects in active research and development. We've made significant progress on them since our [last update](/blog/2022/06/15/react-labs-what-we-have-been-working-on-june-2022), and we'd like to share what we learned.
>>>>>>> 5d2f7105bd6374e465b8bdce8efceaeb8f01c937

</Intro>

---

## React 서버 컴포넌트 {/*react-server-components*/}

React 서버 컴포넌트(React Server Components, 또는 RSC)는 React 팀에서 설계한 새로운 애플리케이션 아키텍처입니다.

우리는 먼저 [소개 발표](/blog/2020/12/21/data-fetching-with-react-server-components)와 [RFC](https://github.com/reactjs/rfcs/pull/188)에서 RSC에 대한 연구를 공유했습니다. 그 내용을 요약하면, 미리 실행하고 JavaScript bundle에서 제외할 수 있는 새로운 종류의 컴포넌트인 서버 컴포넌트를 소개하고 있습니다. 서버 컴포넌트는 빌드 중에 실행되어 파일 시스템에서 읽거나 정적 콘텐츠를 가져올 수 있습니다. 또한 서버에서 실행할 수 있어 API를 빌드할 필요 없이 데이터 계층에 접근할 수 있습니다. props를 통해 서버 컴포넌트에서 상호작용하는 브라우저의 클라이언트 컴포넌트로 데이터를 전달할 수 있습니다.

RSC는 서버 중심의 멀티 페이지 애플리케이션의 간단한 "요청/응답" 멘탈 모델에 클라이언트 중심의 싱글 페이지 애플리케이션의 원활한 상호작용을 결합하여 양쪽의 장점을 모두 제공합니다.

지난 업데이트 이후 우리는 제안을 승인하기 위해 [React 서버 컴포넌트 RFC](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md)를 병합했습니다. [React 서버 모듈 컨벤션](https://github.com/reactjs/rfcs/blob/main/text/0227-server-module-conventions.md) 제안과 관련된 남아 있는 문제를 해결했고, 동료들과 `"use client"` 컨벤션을 따르기로 합의했습니다. 이러한 문서들은 RSC와 호환할 수 있는 구현 방식이 지원해야 하는 것에 대한 명세로도 사용됩니다.

가장 큰 변경 점은 서버 컴포넌트에서 데이터를 가져오는 기본 방법으로 [`async` / `await`](https://github.com/reactjs/rfcs/pull/229)를 도입했다는 점입니다. 또한 Promise의 결과를 읽는 새로운 `use` Hook을 도입하여 클라이언트에서 데이터를 불러오는 것을 지원할 계획입니다. 비록 클라이언트 전용 애플리케이션의 임의의 컴포넌트에서 `async / await`를 지원할 수는 없지만, RSC 애플리케이션의 구조와 유사하게 클라이언트 전용 애플리케이션을 구성할 때를 위한 지원을 추가할 계획입니다.

이제 데이터 가져오기가 어느 정도 잘 정리되었으므로 다른 방향을 살펴보고 있습니다. 바로 클라이언트에서 서버로 데이터를 전송하여 데이터베이스 변경을 실행하고 폼을 구현할 수 있도록 하는 것입니다. 서버와 클라이언트의 경계를 넘어 서버 액션 함수를 전달하면 클라이언트가 이를 호출하여 원활한 RPC를 제공할 수 있습니다. 서버 액션은 또한 JavaScript를 불러오기 전에 점진적으로 향상된 폼을 제공합니다.

React 서버 컴포넌트는 [Next.js App 라우터](/learn/start-a-new-react-project#nextjs-app-router)에 포함되어 있습니다. Next.js에서는 라우터와 깊은 결합을 통해 RSC를 기본 요소로 받아들이는 것을 보여줍니다. 그러나 이 방법이 RSC와 호환할 수 있는 라우터나 프레임워크를 구축하는 유일한 방법은 아닙니다. RSC 명세와 구현에서 제공하는 기능에는 명확한 구분이 있습니다. React 서버 컴포넌트는 호환할 수 있는 React 프레임워크에서 동작하는 컴포넌트에 대한 명세입니다.

우리는 일반적으로 기존 프레임워크를 권장하지만, 직접 사용자 지정 프레임워크를 구축해야 하는 경우도 가능합니다. RSC와 호환할 수 있는 프레임워크를 직접 구축하는 것은 번들러와의 깊은 결합을 필요로하기 때문에 생각만큼 쉽지 않습니다. 현재 세대의 번들러는 클라이언트에서 사용하기에는 훌륭하지만, 서버와 클라이언트 간에 단일 모듈 그래프를 분할하는 것을 우선으로 지원하도록 설계되지 않았습니다. 이것이 지금 RSC를 내장하기 위한 기본 요소를 얻기 위해 번들러 개발자들과 직접 협력하는 이유입니다.

## 에셋 불러오기 {/*asset-loading*/}

[Suspense](/reference/react/Suspense)는 컴포넌트의 데이터나 코드를 불러오는 동안 화면에 표시할 내용을 지정할 수 있게 해줍니다. 이를 통해 사용자는 페이지를 불러오는 동안뿐만 아니라 더 많은 데이터와 코드를 불러오는 라우터 내비게이션 중에서도 점진적으로 더 많은 콘텐츠를 볼 수 있습니다. 그러나 사용자의 관점에서 새로운 콘텐츠가 준비되었는지를 고려할 때 데이터를 불러오고 렌더링하는 것이 모든 것을 알려주지는 않습니다. 기본적으로 브라우저는 스타일시트, 글꼴 및 이미지를 독립적으로 불러오기 때문에 UI 점프와 연속적인 레이아웃 이동이 발생할 수 있습니다.

우리는 Suspense가 스타일시트, 글꼴 및 이미지를 불러오는 생명주기와 완전히 통합되도록 작업하고 있습니다. 이를 통해 React가 콘텐츠가 화면에 표시할 준비가 되었는지 판단할 수 있도록 노력하고 있습니다. 업데이트는 React 컴포넌트 작성 방식에 어떠한 변경도 없이 더 일관되고 만족스러운 방식으로 진행할 것입니다. 최적화를 위해 글꼴과 같은 에셋을 컴포넌트에서 직접 미리 불러오는 수동 방법도 제공할 것입니다.

현재 이러한 기능들을 구현하고 있으며 곧 더 많은 정보를 공유하겠습니다.

## 문서 메타데이터 {/*document-metadata*/}

애플리케이션 속 여러 페이지와 화면에는 `<title>` 태그, 설명, 그리고 화면과 연관된 다른 `<meta>` 태그와 같은 여러 가지 메타데이터를 가질 수 있습니다. 유지보수의 관점에서 해당 정보를 그 페이지나 화면에 있는 React 컴포넌트에 가깝게 유지하는 것이 더 높은 확장성을 가지고 있습니다. 하지만 메타데이터를 위한 HTML 태그는 일반적으로 애플리케이션의 최상위를 나타내는 컴포넌트가 렌더링하는 문서의 `<head>` 부분에 있어야 합니다.

현재 개발자는 두 가지 기술 중 하나의 방법으로 이 문제를 해결합니다.

한 가지 방법은 `<title>`, `<meta>`, 그리고 그 안의 다른 태그들을 문서의 `<head>`로 이동시키는 특별한 서드파티 컴포넌트를 렌더링하는 방법입니다. 이 방법은 주요 브라우저에서는 작동하지만, Open Graph 파서와 같이 클라이언트 측에서 JavaScript를 실행하지 않는 클라이언트가 많기 때문에 보편적으로 적합하지 않습니다.

또 다른 방법은 페이지를 두 부분으로 나누어 서버 렌더링하는 방법입니다. 먼저 주요 콘텐츠를 렌더링한 후 이러한 모든 태그가 수집됩니다. 그런 다음 수집한 태그를 이용하여 `<head>`를 렌더링합니다. 마지막으로 `<head>`와 주요 콘텐츠를 브라우저로 전송합니다. 이 접근법은 잘 작동하지만, `<head>`가 전송되기 전에 모든 콘텐츠가 렌더링 때까지 기다려야 하므로 [React 18의 Streaming Server Renderer](/reference/react-dom/server/renderToReadableStream)의 장점을 활용할 수 없습니다.

이것이 바로 우리가 컴포넌트 트리 어디에서나 별도의 설정 없이 `<title>`, `<meta>`, 그리고 메타데이터 `<link>` 태그를 렌더링할 수 있는 내장 지원을 추가하는 이유입니다. 이는 완전한 클라이언트 측 코드와 SSR, 그리고 미래의 RSC를 포함한 모든 환경에서 동일한 방식으로 작동합니다. 우리는 곧 이에 대해 더 많은 세부 사항을 공유하겠습니다.

## React 최적화 컴파일러 {/*react-optimizing-compiler*/}

지난 업데이트 이후 우리는 React의 최적화 컴파일러인 [React Forget](/blog/2022/06/15/react-labs-what-we-have-been-working-on-june-2022#react-compiler)의 설계를 적극적으로 반복하며 작업하고 있습니다. 이전에 이를 "자동 memoizing 컴파일러"라고 언급했고, 어떤 의미에서는 사실입니다. 그러나 컴파일러를 구축하면서 React의 프로그래밍 모델을 더 깊이 이해하는 데 도움이 되었습니다. React Forget을 이해하는 더 좋은 방법은 자동 *반응성* 컴파일러입니다.

React의 핵심 아이디어는 개발자가 현재 state의 함수로 UI를 정의하는 것입니다. 숫자, 문자열, 배열, 객체와 같은 순수한 JavaScript의 값과 if/else, for 등 표준 JavaScript 관용구를 사용하여 컴포넌트 로직을 표현합니다. 멘탈 모델은 애플리케이션 state를 변경할 때마다 React가 다시 렌더링한다는 것입니다. 우리는 이런 간단한 멘탈 모델과 JavaScript 의미론에 가깝게 유지하는 것이 React 프로그래밍 모델의 중요한 원칙이라고 생각합니다.

문제는 React는 너무 많이 다시 렌더링하는 등 때때로 *지나치게* 반응적일 수 있습니다. 예시로 JavaScript에서 두 개의 객체나 배열이 동등한지(동일한 key와 값을 가졌는지) 비교하는 저렴한 방법이 없으므로, 렌더링마다 새로운 객체나 배열을 생성하는 것은 React가 엄밀하게 필요한 것보다 더 많은 작업을 수행하게 될 수도 있습니다. 이는 개발자가 컴포넌트가 지나치게 반응적이지 않도록 명시적으로 컴포넌트를 메모해야 함을 의미합니다.

React Forget의 목표는 React 애플리케이션이 기본적으로 적당한 반응성을 갖도록 하는 것입니다. 즉, 오직 state 값을 *의미 있게* 변경할 때만 애플리케이션을 다시 렌더링 되도록 하는 것입니다. 구현의 관점에서 이는 자동으로 메모하는 것을 의미하지만, 반응성 프레이밍이 React와 Forget을 이해하는 더 좋은 방법이라고 생각합니다. 이에 대해 생각해 볼 수 있는 하나의 방법은 현재의 React가 객체 ID가 변경될 때 다시 렌더링한다는 것입니다. Forget을 사용하면 React는 의미상으로 값을 변경할 때 다시 렌더링하지만, 깊은 비교를 위한 런타임 비용을 발생시키지 않습니다.

구체적인 진행 상황을 이야기하자면, 지난 업데이트 이후 컴파일러 설계를 자동 반응성 방식에 맞추고 내부적으로 컴파일러를 사용하며 얻은 피드백을 포함하기 위해 상당히 많은 반복 작업을 가졌습니다. 작년 말부터 시작한 컴파일러에 대한 몇 가지 중요한 리팩토링을 진행한 후, 이제 Meta에서 제품 환경의 제한된 부분에서 이를 사용하기 시작했습니다. 제품 환경에서 검증이 끝나면 오픈소스로 공개하려고 합니다.

마지막으로 많은 사람이 컴파일러가 어떻게 작동하는지 관심을 표현해 주셨습니다. 컴파일러를 검증하고 오픈소스로 공개할 때 더 많은 세부 사항을 공유할 수 있기를 기대하고 있습니다. 하지만 당장 공유할 수 있는 몇 가지가 있습니다.

컴파일러의 핵심 부분을 Babel과 거의 분리했고, 핵심 컴파일러 API는 원본 위치 데이터를 유지하면서 대략 오래된 AST를 입력받아 새로운 AST를 반환합니다. 내부적으로는 저수준의 의미 분석을 수행하기 위해 맞춤형 코드 표현과 변환 파이프라인을 사용합니다. 그러나 컴파일러에 대한 기본 공개 인터페이스는 Babel 및 다른 빌드 시스템 플러그인을 통해 이루어집니다. 테스트 용이성을 위해 컴파일러를 호출하여 각 함수의 새로운 버전을 생성하고 교체하는 매우 얇은 래퍼인 Babel 플러그인을 가지고 있습니다.

지난 몇 달 동안 컴파일러를 리팩토링하며 조건문, 반복문, 재할당, 변형과 같은 복잡성을 처리할 수 있는 핵심 컴파일 모델을 개선하는 데 집중하고 싶었습니다. 그러나 JavaScript에는 if/else, 삼항 연산자, for, for-in, for-of 등 각각의 기능을 표현하는 다양한 방법이 있습니다. 처음부터 언어의 전체 기능을 지원하려고 하면 핵심 모델을 검증하는 시점이 지연되었을 것입니다. 대신, let/const, if/else, for 루프, 객체, 배열, 원시 값, 함수 호출 등 작지만 JavaScript 언어를 대표하는 하위 집합부터 시작했습니다. 핵심 모델에 대한 자신감을 얻고 내부 추상화를 개선하면서 지원하는 언어의 하위 집합을 확장했습니다. 또한 아직 지원하지 않는 문법에 대해 명시적으로 로깅 진단 정보를 남기고, 지원되지 않는 입력에 대한 컴파일을 건너뛰고 있습니다. Meta의 코드베이스에서 컴파일러를 사용한 후 가장 많이 지원되지 않는 기능이 무엇인지 확인할 수 있는 유틸리티를 가지고 있습니다. 이를 통해 해당 기능들을 우선으로 작업할 수 있습니다. 우리는 전체 언어를 지원하도록 점진적으로 확장할 계획입니다.

React 컴포넌트의 순수한 JavaScript를 반응형으로 만들기 위해서 코드가 정확하게 무엇을 원하는지 이해할 수 있도록 의미론적으로 깊은 이해를 하는 컴파일러가 필요합니다. 이러한 접근법을 채택함으로써, 우리는 JavaScript 내에서 도메인 특화 언어에 국한되지 않고, 언어의 모든 표현 방법을 사용하여 어떠한 복잡도의 제품 코드라도 작성할 수 있는 반응성을 위한 시스템을 만들고 있습니다.

## 오프스크린 렌더링 {/*offscreen-rendering*/}

오프스크린 렌더링은 React에 다가올 추가적인 성능 부담 없이 백그라운드에서 화면을 렌더링하는 기능입니다. [`content-visibility` CSS 프로퍼티](https://developer.mozilla.org/en-US/docs/Web/CSS/content-visibility)를 DOM 엘리먼트뿐만 아니라 React 컴포넌트에서도 작동하는 버전으로 이해하시면 됩니다. 이번 연구 중에 우리는 아래와 같은 다양한 사용 사례를 발견했습니다.

- 라우터는 백그라운드에서 화면을 사전 렌더링하여 사용자가 특정 화면으로 이동했을 때 즉시 사용하게 할 수 있습니다.
- 탭 전환 컴포넌트는 숨겨진 탭의 state를 유지하여 사용자가 진행 상황을 잃지 않고 탭을 전환할 수 있습니다.
- 가상화된 리스트 컴포넌트는 보이는 창의 위와 아래에 추가적인 행을 사전 렌더링할 수 있습니다.
- 모달이나 팝업을 열 때 남은 애플리케이션을 "백그라운드" 상태로 전환하여 모달을 제외한 모든 항목에 대한 이벤트와 업데이트를 비활성화할 수 있습니다.

대부분의 React 개발자는 React의 오프스크린 API와 직접 상호작용하지는 않을 것입니다. 대신, 오프스크린 렌더링은 라우터나 UI 라이브러리와 결합할 것이며, 해당 라이브러리를 사용하는 개발자는 추가적인 작업 없이 자연스럽게 이점을 누릴 수 있을 것입니다.

핵심은 컴포넌트를 작성하는 방법이 변경되지 않으면서 어떠한 React 트리라도 오프스크린에서 렌더링할 수 있어야 한다는 점입니다. 컴포넌트를 오프스크린에서 렌더링할 때 컴포넌트가 보이기 전까지 실제로 *마운트*하지 않으며 effect가 실행되지 않습니다. 예시로, 컴포넌트가 처음 나타날 때 `useEffect`를 사용하여 분석 로그를 남기는 경우, 사전 렌더링을 하는 것이 분석의 정확도를 손상하지 않을 것입니다. 마찬가지로 컴포넌트를 오프스크린으로 전환할 때 그 컴포넌트의 effect 또한 마운트가 해제됩니다. 오프스크린 렌더링의 핵심 기능은 컴포넌트의 가시성을 전환하면서도 그 state를 잃지 않는다는 점에 있습니다.

지난 업데이트 이후 Meta 내부에서는 안드로이드와 iOS의 React Native 애플리케이션에서 실험적인 버전의 사전 렌더링을 테스트하였으며, 긍정적인 성능 결과를 얻었습니다. 또한 오프스크린 렌더링이 Suspense와 함께 작동하는 방식도 개선하여 오프스크린 트리 내부에서는 Suspense의 폴백이 발생하지 않도록 했습니다. 남아 남아있는 작업은 라이브러리 개발자에게 제공할 기본 요소를 마무리하는 것입니다. 올해 말 테스트와 피드백을 위한 실험적인 API와 함께 RFC를 게시할 예정입니다.

## 트랜지션 추적 {/*transition-tracing*/}

트랜지션 추적 API를 통해 [React 트랜지션](/reference/react/useTransition)이 느려지는 시점을 감지하고 느려지는 이유를 조사할 수 있습니다. 지난 업데이트 이후 API의 초기 설계를 마무리하고 [RFC](https://github.com/reactjs/rfcs/pull/238)를 공개했습니다. 기본 기능도 함께 구현되었습니다. 이 프로젝트는 현재 보류 중입니다. RFC에 대한 피드백을 환영하며, 개발을 재개하여 React를 위한 더 나은 성능 측정 도구를 제공할 수 있기를 기대합니다. 이는 [Next.js App 라우터](/learn/start-a-new-react-project#nextjs-app-router)와 같이 React 트랜지션 위에 구축된 라우터에서는 특히 더 유용할 것입니다.

* * *
이번 업데이트 외에도 최근 우리 팀은 커뮤니티 팟캐스트와 라이브스트림에 초청자로 출연하여 우리의 작업에 대해 더 많은 이야기를 나누고 질문에 답변했습니다.

* [Dan Abramov](https://twitter.com/dan_abramov)와 [Joe Savona](https://twitter.com/en_JS)는 [Kent C. Dodds의 YouTube 채널](https://www.youtube.com/watch?v=h7tur48JSaw)에서 인터뷰를 통해 React 서버 컴포넌트를 둘러싼 우려 사항들을 논의했습니다.
* [Dan Abramov](https://twitter.com/dan_abramov)와 [Joe Savona](https://twitter.com/en_JS)는 [JSParty 팟캐스트](https://jsparty.fm/267)의 초청자로서 React의 미래에 대한 생각을 공유했습니다.

이 게시글을 검토해 준 [Andrew Clark](https://twitter.com/acdlite), [Dan Abramov](https://twitter.com/dan_abramov), [Dave McCabe](https://twitter.com/mcc_abe), [Luna Wei](https://twitter.com/lunaleaps), [Matt Carroll](https://twitter.com/mattcarrollcode), [Sean Keegan](https://twitter.com/DevRelSean), [Sebastian Silbermann](https://twitter.com/sebsilbermann), [Seth Webster](https://twitter.com/sethwebster), 그리고 [Sophie Alpert](https://twitter.com/sophiebits)에 감사를 전합니다.

읽어주셔서 감사합니다. 다음 업데이트에서 만나요!
