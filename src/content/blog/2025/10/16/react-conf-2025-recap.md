---
title: "React Conf 2025 요약"
author: Matt Carroll, Ricky Hanlon
date: 2025/10/16
description: 지난주 React Conf 2025를 개최했으며, 이 게시글에서 이벤트의 발표 내용과 공지 사항을 요약합니다.
---

2025년 10월 16일, [Matt Carroll](https://x.com/mattcarrollcode), [Ricky Hanlon](https://bsky.app/profile/ricky.fm)

---

<Intro>

지난주 React Conf 2025를 개최했으며, 여기서 [React Foundation](/blog/2025/10/07/introducing-the-react-foundation) 설립을 발표하고 React 및 React Native에 도입될 새로운 기능을 선보였습니다.
</Intro>

---

React Conf 2025는 2025년 10월 7일부터 8일까지 네바다주 헨더슨에서 개최되었습니다.

[첫째 날](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=1067s)과 [둘째 날](https://www.youtube.com/watch?v=p9OcztRyDl0&t=2299s) 전체 스트리밍을 온라인에서 시청할 수 있으며, 이벤트 사진은 [여기](https://conf.react.dev/photos)에서 확인할 수 있습니다.

이 게시글에서는 이벤트의 발표 내용과 공지 사항을 요약해 드립니다.

## 1일 차 기조연설 {/*day-1-keynote*/}

_1일 차 전체 스트리밍 시청하기 [링크](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=1067s)_

첫째 날 기조연설에서 Joe Savona는 지난 React Conf 이후 팀과 커뮤니티의 업데이트 사항, 그리고 React 19.0 및 19.1의 주요 기능을 공유했습니다.

Mofei Zhang은 React 19.2의 새로운 기능을 강조했으며, 여기에는 다음이 포함됩니다.
* [`<Activity />`](https://react.dev/reference/react/Activity) — 가시성(visibility)을 관리하는 새로운 컴포넌트.
* [`useEffectEvent`](https://react.dev/reference/react/useEffectEvent) — Effects 내에서 이벤트를 발생시키는 Hook.
* [Performance Tracks](https://react.dev/reference/dev-tools/react-performance-tracks) — DevTools의 새로운 프로파일링 도구.
* [Partial Pre-Rendering](https://react.dev/blog/2025/10/01/react-19-2#partial-pre-rendering) — 앱의 일부를 미리 렌더링하고 나중에 렌더링을 재개하는 기능.

Jack Pope는 Canary에 도입될 새로운 기능들을 발표했으며, 여기에는 다음이 포함됩니다.

* [`<ViewTransition />`](https://react.dev/reference/react/ViewTransition) — 페이지 전환에 애니메이션을 적용하는 새로운 컴포넌트.
* [Fragment Refs](https://react.dev/reference/react/Fragment#fragmentinstance) — Fragment로 감싸진 DOM 노드와 상호작용하는 새로운 방식.

Lauren Tan은 [React Compiler v1.0](/blog/2025/10/07/react-compiler-1)을 발표하고, 다음과 같은 이점 때문에 모든 앱에서 React Compiler를 사용할 것을 권장했습니다.
* React 코드를 이해하는 [자동 메모이제이션](/learn/react-compiler/introduction#what-does-react-compiler-do).
* 모범 사례를 알려주는 React Compiler 기반의 [새로운 린트 규칙](/learn/react-compiler/installation#eslint-integration).
* Vite, Next.js, Expo의 새로운 앱에 대한 [기본 지원](/learn/react-compiler/installation#basic-setup).
* 기존 앱이 React Compiler로 마이그레이션하기 위한 [마이그레이션 가이드](/learn/react-compiler/incremental-adoption).

마지막으로, Seth Webster는 React의 오픈소스 개발과 커뮤니티를 관리할 [React Foundation](/blog/2025/10/07/introducing-the-react-foundation) 설립을 발표했습니다.

1일 차 시청하기

<YouTubeIframe src="https://www.youtube.com/embed/zyVRg2QR6LA?si=z-8t_xCc12HwGJH_&t=1067s" />

## 2일 차 기조연설 {/*day-2-keynote*/}

_2일 차 전체 스트리밍 시청하기 [링크](https://www.youtube.com/watch?v=p9OcztRyDl0&t=2299s)_

Jorge Cohen과 Nicola Corti는 React Native의 놀라운 성장을 강조하며 둘째 날을 시작했습니다. 주간 다운로드 4백만 건(전년 대비 100% 성장)을 기록했으며 Shopify, Zalando, HelloFresh의 주요 앱 마이그레이션, RISE, RUNNA, Partyful과 같은 수상 경력에 빛나는 앱 그리고 Mistral, Replit, v0의 AI 앱을 언급했습니다.

Riccardo Cipolleschi는 React Native의 두 가지 주요 발표를 공유했습니다.
- [React Native 0.82는 새로운 아키텍처만 지원합니다.](https://reactnative.dev/blog/2025/10/08/react-native-0.82#new-architecture-only)
- [Experimental Hermes V1 지원](https://reactnative.dev/blog/2025/10/08/react-native-0.82#experimental-hermes-v1)

Ruben Norte와 Alex Hunt는 기조연설을 마무리하며 다음을 발표했습니다.
- 웹의 React와의 호환성 향상을 위한 [새로운 웹 정렬 DOM API](https://reactnative.dev/blog/2025/10/08/react-native-0.82#dom-node-apis).
- 새로운 네트워크 패널과 데스크탑 앱을 포함하는 [새로운 Performance API](https://reactnative.dev/blog/2025/10/08/react-native-0.82#web-performance-apis-canary).

2일 차 시청하기

<YouTubeIframe src="https://www.youtube.com/embed/p9OcztRyDl0?si=qPTHftsUE07cjZpS&t=2299s" />


## React 팀 발표 {/*react-team-talks*/}

컨퍼런스 전반에 걸쳐 React 팀의 발표가 있었습니다. 여기에는 다음이 포함됩니다.
* [Async React Part I](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=10907s) 및 [Part II](https://www.youtube.com/watch?v=p9OcztRyDl0&t=29073s) [(Ricky Hanlon)](https://x.com/rickhanlonii)는 지난 10년간의 혁신을 통해 무엇이 가능한지 보여주었습니다.
* [Exploring React Performance](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=20274s) [(Joe Savona)](https://x.com/en_js)는 React 성능 연구 결과를 보여주었습니다.
* [Reimagining Lists in React Native](https://www.youtube.com/watch?v=p9OcztRyDl0&t=10382s) [(Luna Wei)](https://x.com/lunaleaps)는 모드 기반 렌더링(hidden/pre-render/visible)으로 가시성을 관리하는 리스트용 새로운 기본 요소인 Virtual View를 소개했습니다.
* [Profiling with React Performance tracks](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=8276s) [(Ruslan Lesiutin)](https://x.com/ruslanlesiutin)은 새로운 React Performance Tracks를 사용하여 성능 문제를 디버깅하고 훌륭한 앱을 구축하는 방법을 보여주었습니다.
* [React Strict DOM](https://www.youtube.com/watch?v=p9OcztRyDl0&t=9026s) [(Nicolas Gallagher)](https://nicolasgallagher.com/)는 Meta의 웹 코드를 네이티브에서 사용하는 접근 방식에 대해 이야기했습니다.
* [View Transitions and Activity](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=4870s) [(Chance Strickland)](https://x.com/chancethedev) — Chance는 React 팀과 협력하여 빠르고 네이티브 느낌의 애니메이션을 구축하기 위해 [`<Activity />`](https://react.dev/reference/react/Activity) 및 [`<ViewTransition />`](https://react.dev/reference/react/ViewTransition)를 사용하는 방법을 시연했습니다.
* [In case you missed the memo](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=9525s) [(Cody Olsen)](https://bsky.app/profile/codey.bsky.social) - Cody는 Sanity Studio에서 Compiler를 채택하기 위해 React 팀과 협력했으며, 그 경험을 공유했습니다.

## React 프레임워크 발표 {/*react-framework-talks*/}

둘째 날 후반부에는 다음을 포함하여 React 프레임워크 팀의 연속 발표가 있었습니다.

* [React Native, Amplified](https://www.youtube.com/watch?v=p9OcztRyDl0&t=5737s) (발표자: [Giovanni Laquidara](https://x.com/giolaq), [Eric Fahsl](https://x.com/efahsl))
* [React Everywhere: Bringing React Into Native Apps](https://www.youtube.com/watch?v=p9OcztRyDl0&t=18213s) (발표자: [Mike Grabowski](https://x.com/grabbou))
* [How Parcel Bundles React Server Components](https://www.youtube.com/watch?v=p9OcztRyDl0&t=19538s) (발표자: [Devon Govett](https://x.com/devonovett))
* [Designing Page Transitions](https://www.youtube.com/watch?v=p9OcztRyDl0&t=20640s) (발표자: [Delba de Oliveira](https://x.com/delba_oliveira))
* [Build Fast, Deploy Faster — Expo in 2025](https://www.youtube.com/watch?v=p9OcztRyDl0&t=21350s) (발표자: [Evan Bacon](https://x.com/baconbrix))
* [The React Router's take on RSC](https://www.youtube.com/watch?v=p9OcztRyDl0&t=22367s) (발표자: [Kent C. Dodds](https://x.com/kentcdodds))
* [RedwoodSDK: Web Standards Meet Full-Stack React](https://www.youtube.com/watch?v=p9OcztRyDl0&t=24992s) (발표자: [Peter Pistorius](https://x.com/appfactory) 및 [Aurora Scharff](https://x.com/aurorascharff))
* [TanStack Start](https://www.youtube.com/watch?v=p9OcztRyDl0&t=26065s) (발표자: [Tanner Linsley](https://x.com/tannerlinsley))

## Q&A {/*q-and-a*/}
컨퍼런스 기간 동안 세 번의 Q&A 패널이 있었습니다.

* [Meta의 React 팀 Q&A](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=26304s) (호스트: [Shruti Kapoor](https://x.com/shrutikapoor08))
* [React 프레임워크 Q&A](https://www.youtube.com/watch?v=p9OcztRyDl0&t=26812s) (호스트: [Jack Herrington](https://x.com/jherr))
* [React와 AI 패널](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=18741s) (호스트: [Lee Robinson](https://x.com/leerob))

## 그리고... {/*and-more*/}

다음과 같은 커뮤니티 발표도 들을 수 있었습니다.
* [Building an MCP Server](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=24204s) (발표자: [James Swinton](https://x.com/JamesSwintonDev) ([AG Grid](https://www.ag-grid.com/?utm_source=react-conf&utm_medium=react-conf-homepage&utm_campaign=react-conf-sponsorship-2025)))
* [Modern Emails using React](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=25521s) (발표자: [Zeno Rocha](https://x.com/zenorocha) ([Resend](https://resend.com/)))
* [Why React Native Apps Make All the Money](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=24917s) (발표자: [Perttu Lähteenlahti](https://x.com/plahteenlahti) ([RevenueCat](https://www.revenuecat.com/)))
* [The invisible craft of great UX](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=23400s) (발표자: [Michał Dudak](https://x.com/michaldudak) ([MUI](https://mui.com/)))

## 감사드립니다 {/*thanks*/}

React Conf 2025를 가능하게 해준 모든 스태프, 연사, 참가자분들께 감사드립니다. 일일이 나열하기는 어렵지만, 특히 몇 분께 감사드립니다.

이벤트 전체를 기획하고 컨퍼런스 웹사이트를 구축해 준 [Matt Carroll](https://x.com/mattcarrollcode)에게 감사드립니다.

놀라운 헌신과 에너지로 React Conf의 MC를 맡아주시고, 사려 깊은 연사 소개, 재미있는 농담, 이벤트 전반에 걸친 진정한 열정을 보여준 [Michael Chan](https://x.com/chantastic)에게 감사드립니다. 라이브 스트리밍을 호스트하고, 각 연사를 인터뷰하며, 현장 React Conf 경험을 온라인으로 전달해 준 [Jorge Cohen](https://x.com/JorgeWritesCode)에게 감사드립니다.

React Conf를 공동 조직하고 디자인, 엔지니어링 및 마케팅 지원을 제공해 준 [Mateusz Kornacki](https://x.com/mat_kornacki), [Mike Grabowski](https://x.com/grabbou), [Kris Lis](https://www.linkedin.com/in/krzysztoflisakakris/) 및 [Callstack](https://www.callstack.com/) 팀에게 감사드립니다. 이벤트 조직을 도와준 [ZeroSlope 팀](https://zeroslopeevents.com/contact-us/)의 Sunny Leggett, Tracey Harrison, Tara Larish, Whitney Pogue, Brianne Smythia에게 감사드립니다.

Discord의 질문을 라이브 스트리밍으로 전달해 준 [Jorge Cabiedes Acosta](https://github.com/jorge-cab), [Gijs Weterings](https://x.com/gweterings), [Tim Yung](https://x.com/yungsters), [Jason Bonta](https://x.com/someextent)에게 감사드립니다. Discord 중재를 이끌어 준 [Lynn Yu](https://github.com/lynnshaoyu)에게 감사드립니다. 매일 우리를 환영해 준 [Seth Webster](https://x.com/sethwebster)에게 감사드립니다. 그리고 애프터 파티에서 특별 메시지를 전달해 준 [Christopher Chedeau](https://x.com/vjeux), [Kevin Gozali](https://x.com/fkgozali), [Pieter De Baets](https://x.com/Javache)에게 감사드립니다.

컨퍼런스 모바일 앱을 구축해 준 [Kadi Kraman](https://x.com/kadikraman), [Beto](https://x.com/betomoedano), [Nicolas Solerieu](https://www.linkedin.com/in/nicolas-solerieu/)에게 감사드립니다. 컨퍼런스 웹사이트를 도와준 [Wojtek Szafraniec](https://x.com/wojteg1337)에게 감사드립니다. 시각 자료, 무대 및 사운드를 제공해 준 [Mustache](https://www.mustachepower.com/) 및 [Cornerstone](https://cornerstoneav.com/)에게, 그리고 호스팅을 맡아준 Westin Hotel에 감사드립니다.

이벤트를 가능하게 해 준 모든 스폰서에게 감사드립니다. [Amazon](https://www.developer.amazon.com), [MUI](https://mui.com/), [Vercel](https://vercel.com/), [Expo](https://expo.dev/), [RedwoodSDK](https://rwsdk.com), [Ag Grid](https://www.ag-grid.com), [RevenueCat](https://www.revenuecat.com/), [Resend](https://resend.com), [Mux](https://www.mux.com/), [Old Mission](https://www.oldmissioncapital.com/), [Arcjet](https://arcjet.com), [Infinite Red](https://infinite.red/), [RenderATL](https://renderatl.com).

지식과 경험을 커뮤니티와 공유해 준 모든 연사분들께 감사드립니다.

마지막으로, React를 React답게 만드는 요소를 보여주기 위해 현장 및 온라인으로 참석해 준 모든 분들께 감사드립니다. React는 단순한 라이브러리 이상이며, 하나의 커뮤니티입니다. 모두가 함께 모여 지식을 공유하고 배우는 모습은 정말 고무적이었습니다.

다음에 또 뵙겠습니다!
