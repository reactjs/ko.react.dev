---
title: "React Labs: 그동안의 작업 - 2024년 2월"
author: Joseph Savona, Ricky Hanlon, Andrew Clark, Matt Carroll, and Dan Abramov
date: 2024/02/15
description: React Labs 게시글에는 활발히 연구 개발 중인 프로젝트에 대한 내용을 작성합니다. 우리의 지난 업데이트 이후 상당한 발전을 이루었고, 이러한 진전 사항을 공유하려고 합니다.
---

2024년 2월 15일, [Joseph Savona](https://twitter.com/en_JS), [Ricky Hanlon](https://twitter.com/rickhanlonii), [Andrew Clark](https://twitter.com/acdlite), [Matt Carroll](https://twitter.com/mattcarrollcode), [Dan Abramov](https://twitter.com/dan_abramov)

---

<Intro>

React Labs 게시글에는 활발히 연구 개발 중인 프로젝트에 대한 내용을 작성합니다. 우리는 [지난 업데이트](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023) 이후 상당한 발전을 이루었고, 이러한 진전 사항을 공유하려고 합니다.

</Intro>

<Note>

React Conf 2024가 5월 15일부터 16일까지 네바다주 헨더슨에서 개최됩니다! React Conf에 직접 참석하고 싶으시다면 2월 28일까지 [티켓 추첨에 등록하세요](https://forms.reform.app/bLaLeE/react-conf-2024-ticket-lottery/1aRQLK).

티켓과 무료 스트리밍, 후원 등에 대한 더 자세한 정보는 [React Conf 웹사이트](https://conf.react.dev)를 참조하세요.

</Note>

---

## React 컴파일러 {/*react-compiler*/}

React 컴파일러는 더 이상 연구 프로젝트가 아닙니다. 컴파일러는 현재 instagram.com의 프로덕션 단계에서 작동하고 있으며, Meta의 더 많은 서비스에 컴파일러를 적용하고 첫 번째 오픈소스 배포를 준비하기 위해 노력하고 있습니다.

[이전 게시글](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-optimizing-compiler)에서 논의한 바와 같이, React는 State가 변경될 때 *이따금* 너무 자주 다시 렌더링 될 수 있습니다. React 초기부터 이런 경우에 대한 해답은 수동 메모이제이션<sup>Memoization</sup>이었습니다. 현재 API에서 이는 [`useMemo`](/reference/react/useMemo), [`useCallback`](/reference/react/useCallback), 그리고 [`memo`](/reference/react/memo) API를 적용하여 State 변경에 따른 React의 다시 렌더링되는 양을 수동으로 조정하는 것을 의미합니다. 그러나 수동 메모이제이션은 절충안입니다. 이는 우리의 코드를 복잡하게 만들고, 잘못 이해하기 쉬우며, 최신 State를 유지하기 위해 추가 작업이 필요합니다.

수동 메모이제이션은 합리적인 절충안이지만, 만족하지 못했습니다. 우리의 비전은 State 변경 시 React가 *핵심적인 멘탈 모델을 손상하지 않으면서* UI의 정확한 부분만 *자동으로* 다시 렌더링하는 것입니다. 우리는 UI가 표준 자바스크립트 값과 패턴으로 이루어진 State의 단순한 함수라고 생각하는 React의 접근 방식이 바로 수많은 개발자가 React에 쉽게 접근할 수 있었던 핵심 이유라고 생각합니다. 이것이 우리가 React를 위한 최적화 컴파일러를 구축하기 위해 투자한 이유입니다.

자바스크립트는 느슨한 규칙과 동적인 특징 때문에 최적화하기에 매우 까다로운 언어입니다. React 컴파일러는 자바스크립트 규칙과 *함께* "React 규칙"을 모두 모델링하여 코드를 안전하게 컴파일할 수 있습니다. 예를 들어, React 컴포넌트는 동일한 입력이 주어지면 동일한 값을 반환하는 멱등성을 만족해야 하며, Props나 State를 변경하지 못합니다. 이러한 규칙은 개발자가 작업할 수 있는 범위를 제한하고 컴파일러가 최적화할 수 있는 안전한 공간을 만들어 나가는 데 도움을 줍니다.

물론, 개발자들이 가끔 규칙을 약간 비틀 수 있다는 것을 이해하고 있습니다. 우리의 목표는 React 컴파일러가 가능한 많은 코드에서 즉시 작동하도록 하는 것입니다. 컴파일러는 코드가 React 규칙을 엄격하게 따르고 있는지 탐지하려고 시도하며, 안전한 경우에는 컴파일하거나 안전하지 않은 경우에는 컴파일을 건너뛸 것입니다. 우리는 Meta의 크고 다양한 코드 베이스를 대상으로 테스트하며 이러한 접근법을 검증하는 데 도움을 주고 있습니다.

자신의 코드가 React 규칙을 따르고 있는지 확인하고 싶은 개발자들에게, 우리는 [Strict Mode를 활성화](/reference/react/StrictMode)하고 [React의 ESLint 플러그인을 설정하는 것](/learn/editor-setup#linting)을 권장합니다. 이러한 도구들은 React 코드에서의 미묘한 오류를 잡고, 현재 애플리케이션의 품질을 향상하는 데 도움을 줄 수 있습니다. 또한, React 컴파일러와 같은 향후 다가올 기능들에 대비하여 애플리케이션을 준비하는 데 도움을 줄 수 있습니다. 우리는 또한 React 규칙에 대한 통합 문서와 ESLint 플러그인 업데이트를 작업하고 있으며, 이를 통해 팀에서 이러한 규칙들을 이해하고 적용하여 더욱 견고한 애플리케이션을 만들 수 있도록 도울 것입니다.

컴파일러를 실제로 보고 싶다면, [지난 가을에 진행한 강연](https://www.youtube.com/watch?v=qOQClO3g8-Y)을 확인해 보세요. 강연 당시, 우리는 instagram.com의 한 페이지에 React 컴파일러를 시도한 초기 실험 데이터를 가지고 있었습니다. 그 이후로, 우리는 컴파일러를 instagram.com의 프로덕션 단계 전반에 걸쳐 적용했습니다. 또한 저희 팀을 확장하여 메타에서 출시할 추가적인 서비스와 오픈 소스의 출시를 가속했습니다. 저희는 앞으로의 길에 대해 큰 기대를 가지고 있고, 향후 몇 달 안에 더 많은 소식을 공유할 것입니다.

## 액션 {/*actions*/}


저희는 [이전에](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components) 서버 액션을 통한 클라이언트에서 서버로 데이터를 보내는 해결책을 탐색하고 있다고 공유했습니다. 이를 통해 데이터베이스 변경을 실행하고 폼을 구현할 수 있습니다. 서버 액션을 개발하는 동안, 이러한 API가 클라이언트 전용 애플리케이션에서도 데이터 처리를 지원하도록 확장했습니다.

우리는 이러한 광범위한 기능 모음을 단순히 "액션"이라고 부릅니다. 액션을 사용하여 [`<form/>`](/reference/react-dom/components/form)과 같은 DOM 엘리먼트에 함수를 전달할 수 있습니다.

```js
<form action={search}>
  <input name="query" />
  <button type="submit">Search</button>
</form>
```

`action` 함수는 동기적 또는 비동기적으로 실행할 수 있습니다. 클라이언트 측에서 표준 자바스크립트를 사용하여 정의하거나, [`'use server'`](/reference/rsc/use-server)라는 지시어를 사용하여 서버에서 정의할 수 있습니다. 액션을 사용할 때, React는 [`useFormStatus`](/reference/react-dom/hooks/useFormStatus), [`useActionState`](/reference/react/useActionState)와 같은 Hook을 제공하여 데이터 제출의 생명주기를 관리하고 현재 폼의 State와 응답에 접근할 수 있습니다.

기본적으로 액션은 [트랜지션](/reference/react/useTransition) 내에서 제출되어 현재 페이지가 상호작용을 하는 동안 액션을 처리합니다. 액션은 비동기 함수를 지원하므로, 트랜지션 내에서 `async`/`await`을 사용할 수 있도록 추가했습니다. 이를 통해 `fetch`와 같은 비동기 요청이 시작되면 트랜지션의 `isPending` State를 사용하여 대기 중인 UI를 표시하고, 업데이트가 적용될 때까지 대기 중인 UI를 계속 보여줄 수 있습니다.

액션과 함께, 낙관적 State 업데이트를 관리하기 위한 [`useOptimistic`](/reference/react/useOptimistic)이라는 기능을 소개합니다. 이 Hook을 사용하여 최종 State가 커밋되면 자동으로 되돌릴 수 있는 일시적인 업데이트를 적용할 수 있습니다. 액션의 경우, 제출이 성공적이라고 가정하고 클라이언트에서 데이터의 최종 State를 낙관적으로 업데이트할 수 있습니다. 그리고 서버에서 받은 데이터를 통해 값을 되돌릴 수 있습니다. 이는 일반적인 `async`/`await` 방식을 사용하여 작동하므로, 클라이언트에서 `fetch`를 사용하든 서버에서 서버 액션을 사용하든 동일하게 작동합니다.

라이브러리 제작자는 각자의 컴포넌트에서 `useTransition`를 사용하여 사용자 지정 `action={fn}` Props를 구현할 수 있습니다. 우리의 의도는 라이브러리가 컴포넌트 API를 설계할 때 액션 패턴을 채택하여 React 개발자들에게 일관적인 경험을 제공하는 것입니다. 예를 들어, 라이브러리에서 `<Calendar onSelect={eventHandler}>`와 같은 컴포넌트를 제공하는 경우, `<Calendar selectAction={action}>`와 같은 API도 노출하는 것을 고려해 보세요.

우리는 처음에 서버 액션을 클라이언트-서버 사이 데이터 전송에 중점을 두었지만, React의 철학은 모둔 플랫폼과 환경에서 동일한 프로그래밍 모델을 제공하는 것입니다. 가능하다면 클라이언트의 기능을 소개한 경우 해당 기능이 서버에서도 작동하도록 하고, 그 반대의 경우도 마찬가지입니다. 이 철학을 통해 애플리케이션이 실행되는 위치와 관계없이 작동하는 단일 API 모음을 생성하여, 이후 다른 환경으로 업그레이드 하기 쉽게 만들 수 있습니다.

액션은 현재 실험적 채널에서 이용하실 수 있으며, React의 다음 배포에서 제공될 예정입니다.

## React Canary의 새로운 기능 {/*new-features-in-react-canary*/}

우리는 [React Canary](/blog/2023/05/03/react-canaries)에서 새로운 안정적 기능들이 최종 설계에 가까워질 때마다 각각을 선택적으로 채택할 수 있도록 소개했습니다. 그리고 이를 안정적인 시멘틱 버저닝으로 배포되기 이전에 사용할 수 있습니다.

Canary는 React의 개발 방식을 변경하는 것입니다. 이전에는 기능들이 비공개로 Meta 내부에서 연구되고 개발되었기 때문에 사용자는 그 결과물이 안정적인 버전으로 배포되었을 때만 볼 수 있었습니다. 이제 Canary와 함께 커뮤니티의 도움을 받아 React Labs 블로그 시리즈에서 공유하고 있는 기능을 완성하고자 공개적으로 개발하고 있습니다. 이는 여러분들이 새로운 기능이 완성된 이후가 아닌 완료되는 과정에서 곧바로 알 수 있다는 것을 의미합니다.

React 서버 컴포넌트, 에셋 불러오기, 문서 메타데이터 및 액션 모두 React Canary에 도입되었으며, 이러한 기능에 대한 문서를 react.dev에 추가했습니다.

- **지시어**: [`"use client"`](/reference/rsc/use-client)와 [`"use server"`](/reference/rsc/use-server)는 풀스택 React 프레임워크를 위해 설계한 번들러 기능입니다. 이들은 두 환경 사이의 "분할점"을 나타냅니다. `"use client"`는 [Astro Islands](https://docs.astro.build/en/concepts/islands/#creating-an-island)처럼 번들러에 `<script>` 태그를 생성하도록 지시합니다. 반면 `"use server"`는 [tRPC Mutations](https://trpc.io/docs/concepts)처럼 번들러에 POST 엔드포인트를 생성하도록 지시합니다. 두 지시어를 함께 사용하여 클라이이언트 측의 상호작용을 서버 측의 로직과 결합하는 재사용 가능한 컴포넌트를 작성할 수 있습니다.

- **문서 메타데이터**: 우리는 컴포넌트 트리 어디에서든 [`<title>`](/reference/react-dom/components/title), [`<meta>`](/reference/react-dom/components/meta) 및 메타데이터 [`<link>`](/reference/react-dom/components/link) 태그를 렌더링하는 내장 지원을 추가했습니다. 이는 완전한 클라이언트 측 코드, SSR 및 RSC를 포함한 모든 환경에서 동일하게 작동합니다. 이는 [React Helmet](https://github.com/nfl/react-helmet)과 같은 라이브러리가 이미 제공하던 기능을 내장 지원으로 제공합니다.

- **에셋 불러오기**: 우리는 Suspense를 스타일시트, 글꼴, 스크립트와 같은 리소스를 불러오는 생명주기와 통합했습니다. 이를 통해 React는 표시할 준비가 되었는지 결정하는데 [`<style>`](/reference/react-dom/components/style), [`<link>`](/reference/react-dom/components/link) 및 [`<script>`](/reference/react-dom/components/script)와 같은 엘리먼트 내부의 콘텐츠를 고려합니다. 또한 `preload`와 `preinit`과 같은 [새로운 리소스 불러오기 API](/reference/react-dom#resource-preloading-apis)를 추가하여 리소스를 언제 불러오고 초기화할지에 대한 더 많은 제어권을 제공했습니다.

- **액션**: 앞서 언급한 대로, 클라이언트에서 서버로 데이터를 전송하는 것을 관리하기 위해 액션을 추가했습니다. [`<form/>`](/reference/react-dom/components/form)과 같은 엘리먼트에 `action`을 추가할 수 있으며, [`useFormStatus`](/reference/react-dom/hooks/useFormStatus)를 사용하여 진행 상황에 접근하고, [`useActionState`](/reference/react/useActionState)를 사용하여 결과를 처리하며, [`useOptimistic`](/reference/react/useOptimistic)를 사용하여 UI를 낙관적으로 업데이트할 수 있습니다.

이러한 모든 기능은 함께 작동하기 때문에, 이들을 각각 안정적 채널에 배포하기는 어렵습니다. 폼 State에 접근하는 보조 Hook 없이 액션을 배포하는 것은 액션의 실제 유용성을 제한할 것입니다. 서버 액션을 통합하지 않으면서 React 서버 컴포넌트를 도입하면 서버에서 데이터를 수정하기에 복잡해질 것입니다.

저희는 이러한 기능들을 안정적 채널에 배포하기 전에, 이들이 함께 작동하고 개발자가 프로덕션 단계에서 사용하기 위해 필요한 모든 것을 갖추었는지 보장해야 합니다. React Canary를 통해 개발자는 이런 기능을 개별적으로 개발하고, 전체 기능 목록이 완성되기 전까지 점진적으로 안정된 API를 배포할 수 있습니다.

현재 React Canary에 포함된 기능들은 완성되어 배포할 준비가 되었습니다.

## React의 다음 메이저 버전 {/*the-next-major-version-of-react*/}

몇 년간의 반복 작업 끝에, `react@canary`가 이제 `react@latest`로의 출시 준비가 되었습니다. 위에서 언급한 새로운 기능들은 애플리케이션이 실행되는 모든 환경과 호환되며, 프로덕션 단계에서 사용되기 위해 필요한 모든 것을 제공합니다. 에셋 불러오기와 문서 메타데이터는 일부 애플리케이션에서 큰 변화일 수 있습니다. 따라서 React의 다음 버전은 주요 버전인 **React 19**가 될 것입니다.

여전히 출시 준비를 마치기 위한 더 많은 작업이 있습니다. React 19에서는 Web 컴포넌트 지원과 같은 큰 변화가 필요한 오랫동안 요청된 개선 사항도 추가할 것입니다. 우리는 현재 이러한 변경 사항을 적용하고, 배포를 준비하며, 새로운 기능에 대한 문서 작업을 끝마치고, 무엇이 추가되었는지 공지를 발표하는 것을 중점으로 하고 있습니다.

앞으로 몇 달 동안 React 19에 포함된 모든 내용과 새로운 클라이언트 기능을 채택하는 방법, 그리고 React 서버 컴포넌트를 지원하는 방법에 대한 많은 정보를 공유할 예정입니다.

## 오프스크린 (Activity로 이름 변경) {/*offscreen-renamed-to-activity*/}

지난 업데이트 이후, 우리는 연구 중인 특성의 이름을 "오프스크린"에서 "Activity"로 변경했습니다. "오프스크린" 이라는 이름은 애플리케이션의 보이지 않는 부분에 해당하는 의미만 암시했습니다. 하지만 해당 기능을 연구하는 동안, 모달 뒤편의 콘텐츠와 같이 애플리케이션의 일부가 가시적이지만 비활성화될 수 있다는 것을 알게 되었습니다. 새로운 이름은 애플리케이션의 특정 부분을 "활성화" 또는 "비활성화"로 표시하는 동작을 더 정확하게 반영합니다.

Activity는 여전히 연구 중이며, 라이브러리 개발자에게 노출되는 기본 요소를 마무리하는 것이 남아 있습니다. 우리는 더욱 완성된 기능을 출시하는 데 중점을 두는 동안, 이러한 영역의 우선순위를 낮췄습니다.

* * *

이번 업데이트 외에도 우리 팀은 컨퍼런스에서 발표하고 팟캐스트 출연을 통해 우리의 작업에 관해 이야기를 나누고 질문에 답변했습니다.

- [Sathya Gunasekaran](https://github.com/gsathya)은 [React India](https://www.youtube.com/watch?v=kjOacmVsLSE) 컨퍼런스에서 React 컴파일러에 관해 이야기했습니다.

- [Dan Abramov](/community/team#dan-abramov)은 [RemixConf](https://www.youtube.com/watch?v=zMf_xeGPn6s)에서 "다른 차원의 React"를 주제로 강연했습니다. 이곳에서 React 서버 컴포넌트와 액션을 어떻게 만들었는지에 관한 대안적인 역사를 탐구했습니다.

- [Dan Abramov](/community/team#dan-abramov)은 [Changelog의 JS Party 팟캐스트](https://changelog.com/jsparty/311)에서 React 서버 컴포넌트에 대한 인터뷰를 받았습니다.

- [Matt Carroll](/community/team#matt-carroll)은 [Front-End Fire 팟캐스트](https://www.buzzsprout.com/2226499/14462424-interview-the-two-reacts-with-rachel-nabors-evan-bacon-and-matt-carroll)에서 인터뷰를 통해 [The Two Reacts](https://overreacted.io/the-two-reacts/)에 관해 이야기했습니다.

이 게시물을 검토해 준 [Lauren Tan](https://twitter.com/potetotes), [Sophie Alpert](https://twitter.com/sophiebits), [Jason Bonta](https://threads.net/someextent), [Eli White](https://twitter.com/Eli_White) 및 [Sathya Gunasekaran](https://twitter.com/_gsathya)에게 감사드립니다.

읽어주셔서 감사합니다. 그리고 [React Conf에서 만나요](https://conf.react.dev/)!

