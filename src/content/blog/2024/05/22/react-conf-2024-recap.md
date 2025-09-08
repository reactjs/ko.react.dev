---
title: "React Conf 2024 요약"
author: Ricky Hanlon
date: 2024년 05월 22일
description: 지난주 우리는 네바다주 헨더슨에서 React Conf 2024를 개최했습니다. 2일 동안 700명 이상의 참가자가 현장에서 모여 UI 엔지니어링 분야의 최신 동향을 논의했습니다. 이 글에서는 콘퍼런스에서 진행된 강연과 발표 내용을 요약했습니다.

---

2024년 5월 22일, [Ricky Hanlon](https://twitter.com/rickhanlonii).

---

<Intro>

지난주 우리는 React Conf 2024를 개최했습니다. 네바다주 헨더슨에서 열린 2일간의 콘퍼런스에서는 700명 이상의 참가자가 현장에서 모여 UI 엔지니어링 분야의 최신 동향을 논의했습니다. 이는 2019년 이후 처음 열린 오프라인 콘퍼런스였으며, 우리는 이 커뮤니티를 다시 한자리에 모을 수 있어 매우 기뻤습니다.

</Intro>

---

React Conf 2024에서는 [React 19 RC](/blog/2024/12/05/react-19), [React Native 의 새로운 아키텍처 베타 버전](https://github.com/reactwg/react-native-new-architecture/discussions/189), 그리고 [React 컴파일러](/learn/react-compiler)의 실험 버전을 발표했습니다. 또한 커뮤니티에서도 [React Router v7](https://remix.run/blog/merging-remix-and-react-router), Expo Router의 [공용 서버 컴포넌트](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=20765s), [RedwoodJS](https://redwoodjs.com/blog/rsc-now-in-redwoodjs)의 React 서버 컴포넌트 등을 발표하는 시간을 가졌습니다.

[1일차](https://www.youtube.com/watch?v=T8TZQ6k4SLE)와 [2일차](https://www.youtube.com/watch?v=0ckOUBiuxVY)의 전체 스트리밍 영상은 온라인에서 시청하실 수 있습니다. 이 글에서는 콘퍼런스에서 진행된 강연과 발표 내용을 요약했습니다.

## 1일차 {/*day-1*/}

_[1일차 전체 영상 시청하기.](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=973s)_

첫째 날은 Meta CTO [Andrew "Boz" Bosworth](https://www.threads.net/@boztank)의 환영사와 Meta의 React 팀을 이끄는 [Seth Webster](https://twitter.com/sethwebster)와 사회자 [Ashley Narcisse](https://twitter.com/_darkfadr)의 소개로 시작되었습니다.

첫째 날의 기조연설에서 [Joe Savona](https://twitter.com/en_JS)는 누구나 쉽게 뛰어난 사용자 경험을 구축할 수 있도록 하는 React의 목표와 비전을 공유했습니다. 이어서 [Lauren Tan](https://twitter.com/potetotes)은 React의 현황을 발표하며 2023년 React 다운로드 수가 10억 회를 넘었고, 신규 개발자의 37%가 React로 프로그래밍을 배운다는 사실을 공유했습니다. 마지막으로 그녀는 React 커뮤니티가 React를 React답게 만들기 위해 한 일들을 강조했습니다.

추가로, 콘퍼런스에서 진행된 커뮤니티 강연도 확인해 보세요:

- [Ryan Florence](https://twitter.com/ryanflorence): [바닐라 React](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=5542s)
- [Lee Robinson](https://twitter.com/leeerob): [React 리듬 & 블루스](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=12728s)
- [Amy Dutton](https://twitter.com/selfteachme): [React 서버 컴포넌트를 포함한 RedwoodJS](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=26815s)
- [Evan Bacon](https://twitter.com/Baconbrix): [Expo Router의 Universal React 서버 컴포넌트 소개](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=20765s)

기조연설에서 [Josh Story](https://twitter.com/joshcstory)와 [Andrew Clark](https://twitter.com/acdlite)은 React 19의 새로운 기능과 React 19 RC를 발표했습니다. [React 19 릴리스 포스트](/blog/2024/12/05/react-19)에서 모든 기능을 확인하고, 다음 강연에서 심층 내용을 확인할 수 있습니다:

- [Lydia Hallie](https://twitter.com/lydiahallie): [React 19의 새로운 기능](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=8880s)
- [Sam Selikoff](https://twitter.com/samselikoff): [React 파헤치기: React 19 로드맵](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=10112s)
- [Josh Story](https://twitter.com/joshcstory): [React 19 심층 탐구: HTML 조정](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=24916s)
- [Aurora Walberg Scharff](https://twitter.com/aurorascharff): [React 서버 컴포넌트로 폼 향상](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=25280s)
- [Dan Abramov](https://bsky.app/profile/danabra.mov): [두 대의 컴퓨터용 React](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=18825s)
- [Kent C. Dodds](https://twitter.com/kentcdodds): [이제 React 서버 컴포넌트를 이해합니다](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=11256s) 

마지막으로, [Joe Savona](https://twitter.com/en_JS), [Sathya Gunasekaran](https://twitter.com/_gsathya), [Mofei Zhang](https://twitter.com/zmofei)은 React 컴파일러가 [오픈소스](https://github.com/facebook/react/pull/29061)로 공개되었음을 알리고, 실험 버전을 공유했습니다.

컴파일러 사용법과 동작 방식은 [관련 문서](/learn/react-compiler) 및 관련 강연을 참고하세요:

- [Memo를 신경 쓰지 마세요](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=12020s) by [Lauren Tan](https://twitter.com/potetotes)
- [React 컴파일러 심층 탐구](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=9313s) by [Sathya Gunasekaran](https://twitter.com/_gsathya) and [Mofei Zhang](https://twitter.com/zmofei)

1일차 기조 연설 전체 시청하기:

<YouTubeIframe src="https://www.youtube.com/embed/T8TZQ6k4SLE?t=973s" />

## 2일차 {/*day-2*/}

_[2일차 전체 시청하기](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=1720s)_

둘째 날은 [Seth Webster](https://twitter.com/sethwebster)의 환영사와 [Eli White](https://x.com/Eli_White)의 감사 인사, 그리고 사회자 [Ashley Narcisse](https://twitter.com/_darkfadr)의 소개로 시작되었습니다.

2일차 기조연설에서 [Nicola Corti](https://twitter.com/cortinico)는 React Native의 현황을 발표하며 2023년 다운로드 수가 7800만 건임을 공유했습니다. 또한 Meta에서 사용되는 2000개 이상의 화면, 하루 20억 회 이상 방문되는 Facebook 마켓플레이스의 제품 상세 페이지, Microsoft Windows의 시작 메뉴 일부 및 대부분의 Microsoft Office 모바일/데스크톱 기능을 포함한 React Native 앱의 사례를 강조했습니다.

또한, Nicola는 라이브러리, 프레임워크, 다양한 플랫폼을 포함해 React Native를 지원하기 위해 커뮤니티가 한 모든 활동도 강조했습니다. 더 자세한 내용은 커뮤니티 발표를 참고하세요.

- [Chris Traganos](https://twitter.com/chris_trag) & [Anisha Malde](https://twitter.com/anisha_malde): [모바일 및 데스크톱 앱을 넘어선 React Native 확장](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=5798s)
- [Michał Pierzchała](https://twitter.com/thymikee): [React를 활용한 공간 컴퓨팅](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=22525s)

[Riccardo Cipolleschi](https://twitter.com/cipolleschir)는 React Native의 새로운 아키텍처가 베타 상태로 출시되어 앱에서 사용할 준비가 되었음을 발표하고, 새로운 기능 및 향후 로드맵을 공유했습니다. 더 알아보기:

- [Olga Zinoveva](https://github.com/SlyCaptainFlint) & [Naman Goel](https://twitter.com/naman34): [크로스 플랫폼 React](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=26569s)

기조연설에서 Nicola는 React Native 신규 앱 개발 시 Expo와 같은 프레임워크 사용을 권장한다고 발표하고, 새로운 React Native 홈페이지와 시작 가이드를 공개했습니다. [React Native 문서](https://reactnative.dev/docs/next/environment-setup)에서 새 가이드를 확인할 수 있습니다.

마지막으로 [Kadi Kraman](https://twitter.com/kadikraman)이 Expo의 최신 기능과 개선 사항, 그리고 Expo를 통한 React Native 개발 시작 방법을 공유하며 기조연설을 마쳤습니다.

2일차 기조 연설 전체 시청하기:

<YouTubeIframe src="https://www.youtube.com/embed/0ckOUBiuxVY?t=1720s" />

## Q&A {/*q-and-a*/}

React와 React Native 팀은 매일 Q&A 세션으로 하루를 마무리했습니다:

- [Michael Chan](https://twitter.com/chantastic)이 진행한 [React Q&A](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=27518s) 
- [Jamon Holmgren](https://twitter.com/jamonholmgren)이 진행한 [React Native Q&A](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=27935s)

## 그리고... {/*and-more*/}

접근성, 오류 보고, CSS 등 다양한 주제의 강연도 있었습니다:

- [React 앱 접근성 해설](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=20655s) by [Kateryna Porshnieva](https://twitter.com/krambertech)
- [Pigment CSS, 서버 컴포넌트 시대의 CSS](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=21696s) by [Olivier Tassinari](https://twitter.com/olivtassinari)
- [실시간 React 서버 컴포넌트](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=24070s) by [Sunil Pai](https://twitter.com/threepointone)
- [React의 규칙 깨기](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=25862s) by [Charlotte Isambert](https://twitter.com/c_isambert)
- [오류 100% 해결하기](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=19881s) by [Ryan Albrecht](https://github.com/ryan953)

## 감사드립니다 {/*thank-you*/}

React Conf 2024를 가능하게 해준 모든 스태프, 발표자, 참가자분들께 감사드립니다. 너무 많아 모두 나열할 수 없지만, 몇 분께 특별히 감사드리고 싶습니다.

전체 행사 기획을 도와주신 [Barbara Markiewicz](https://twitter.com/barbara_markie), [Callstack 팀](https://www.callstack.com/), React Team Developer Advocate인 [Matt Carroll](https://twitter.com/mattcarrollcode)께 감사드립니다. 행사 운영을 도와주신 [Sunny Leggett](https://zeroslopeevents.com/about)와 [Zero Slope 팀](https://zeroslopeevents.com)께도 감사드립니다.

사회를 맡아주신 Chief Vibes Officer [Ashley Narcisse](https://twitter.com/_darkfadr), Q&A 세션을 진행해주신 [Michael Chan](https://twitter.com/chantastic)과 [Jamon Holmgren](https://twitter.com/jamonholmgren)께 감사드립니다.

매일 환영사로 우리를 맞아주고 구조와 콘텐츠의 방향을 제시해주신 [Seth Webster](https://twitter.com/sethwebster)와 [Eli White](https://x.com/Eli_White), 애프터 파티에서 특별한 메시지를 전해주신 [Tom Occhino](https://twitter.com/tomocchino)께 감사드립니다.

강연에 대한 세심한 피드백, 슬라이드 디자인, 그리고 전반적인 세부 사항을 신경써주신 [Ricky Hanlon](https://www.youtube.com/watch?v=FxTZL2U-uKg&t=1263s)께 감사드립니다.

콘퍼런스 웹사이트를 제작한 [Callstack](https://www.callstack.com/), 모바일 앱을 제작한 [Kadi Kraman](https://twitter.com/kadikraman)과 [Expo 팀](https://expo.dev/)께 감사드립니다.

행사를 가능하게 해준 스폰서분들께 감사드립니다: [Remix](https://remix.run/), [Amazon](https://developer.amazon.com/apps-and-games?cmp=US_2024_05_3P_React-Conf-2024&ch=prtnr&chlast=prtnr&pub=ref&publast=ref&type=org&typelast=org), [MUI](https://mui.com/), [Sentry](https://sentry.io/for/react/?utm_source=sponsored-conf&utm_medium=sponsored-event&utm_campaign=frontend-fy25q2-evergreen&utm_content=logo-reactconf2024-learnmore), [Abbott](https://www.jobs.abbott/software), [Expo](https://expo.dev/), [RedwoodJS](https://redwoodjs.com/), [Vercel](https://vercel.com).

시각, 무대, 그리고 음향을 담당해주신 AV팀과 행사를 개최해주신 Westin Hotel에도 감사드립니다.

지식과 커뮤니티에 관한 경험을 공유해주신 모든 연사분들께 감사드립니다.

마지막으로, 현장과 온라인에서 참석하여 무엇이 React를 React답게 만드는지 보여주신 모든 분들께 감사드립니다. React는 단순한 라이브러리를 넘어 커뮤니티입니다. 모두가 한자리에 모여 함께 배우고 공유하는 모습이 큰 영감이 되었습니다.

다음에 또 만나요!
