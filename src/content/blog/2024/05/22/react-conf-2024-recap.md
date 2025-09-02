---
title: "React Conf 2024 요약"
author: Ricky Hanlon
date: 2024년 05월 22일
description: 지난주 우리는 네바다주 헨더슨에서 2일간의 React Conf 2024를 개최했으며, 700명 이상의 참가자가 현장에서 모여 UI 엔지니어링 분야의 최신 동향을 논의했습니다. 이 글에서는 콘퍼런스에서 진행된 강연과 발표 내용을 요약해 보았습니다.

---

2024년 5월 22일 by [Ricky Hanlon](https://twitter.com/rickhanlonii).

---

<Intro>

지난주 우리는 네바다주 헨더슨에서 2일간의 React Conf 2024를 개최했으며, 700명 이상의 참가자가 현장에서 모여 UI 엔지니어링 분야의 최신 동향을 논의했습니다. 이는 2019년 이후 처음 열린 오프라인 콘퍼런스였으며, 우리는 이 커뮤니티를 다시 한자리에 모을 수 있게 되어 매우 기뻤습니다.

</Intro>

---

React Conf 2024에서는 [React 19 RC](/blog/2024/12/05/react-19), [React Native 의 새로운 아키텍처 베타 버전](https://github.com/reactwg/react-native-new-architecture/discussions/189), 그리고 [React Compiler](/learn/react-compiler)의 실험 버전을 발표했습니다. 또한 커뮤니티도 [React Router v7](https://remix.run/blog/merging-remix-and-react-router), Expo Routher의 [Universal Server Components](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=20765s) , [RedwoodJS](https://redwoodjs.com/blog/rsc-now-in-redwoodjs)의 React Server Components 등을 발표했습니다.

[1일차](https://www.youtube.com/watch?v=T8TZQ6k4SLE)와 [2일차](https://www.youtube.com/watch?v=0ckOUBiuxVY)의 전체 스트리밍 영상은 온라인에서 시청하실 수 있습니다. 이 글에서는 콘퍼런스에서 진행된 강연과 발표 내용을 요약해 보았습니다.

## 1일차 {/*day-1*/}

_[1일차 전체 스트리밍 시청하기.](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=973s)_

첫째 날의 시작은 Meta CTO인 [Andrew "Boz" Bosworth](https://www.threads.net/@boztank)의 환영 인사로 열렸으며, 이어서 Meta의 React 팀을 담당하는 [Seth Webster](https://twitter.com/sethwebster)와 사회자인 [Ashley Narcisse](https://twitter.com/_darkfadr)가 소개를 맡았습니다.

첫째 날의 키노트에서 [Joe Savona](https://twitter.com/en_JS)는 누구나 쉽게 뛰어난 사용자 경험을 구축할 수 있도록 하는 React의 목표와 비전을 공유했습니다. 이어서 [Lauren Tan](https://twitter.com/potetotes)은 React 현황을 발표하며 2023년 React 다운로드 수가 10억 회를 넘었고, 신규 개발자의 37%가 React로 프로그래밍을 배운다는 사실을 공유했습니다. 마지막으로 그녀는 React 커뮤니티가 React를 React답게 만들기 위해 한 일들을 강조했습니다.

추가로, 콘퍼런스에서 진행된 커뮤니티 강연도 확인해 보세요:

- [Ryan Florence](https://twitter.com/ryanflorence): [바닐라 React](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=5542s)
- [Lee Robinson](https://twitter.com/leeerob): [React 리듬 & 블루스](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=12728s)
- [Amy Dutton](https://twitter.com/selfteachme): [RedwoodJS, 근데 이제 React Server Components를 곁들인](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=26815s)
- [Evan Bacon](https://twitter.com/Baconbrix): [Expo Router의 Universal React Server Components 소개](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=20765s)

Next in the keynote, [Josh Story](https://twitter.com/joshcstory) and [Andrew Clark](https://twitter.com/acdlite) shared new features coming in React 19, and announced the React 19 RC which is ready for testing in production. Check out all the features in the [React 19 release post](/blog/2024/12/05/react-19), and see these talks for deep dives on the new features:

- [Lydia Hallie](https://twitter.com/lydiahallie): [What's new in React 19](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=8880s)
- [Sam Selikoff](https://twitter.com/samselikoff): [React Unpacked: A Roadmap to React 19](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=10112s) 
- [Josh Story](https://twitter.com/joshcstory): [React 19 Deep Dive: Coordinating HTML](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=24916s) 
- [Aurora Walberg Scharff](https://twitter.com/aurorascharff): [Enhancing Forms with React Server Components](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=25280s)
-[Dan Abramov](https://bsky.app/profile/danabra.mov): [React for Two Computers](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=18825s)
- [Kent C. Dodds](https://twitter.com/kentcdodds): [And Now You Understand React Server Components](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=11256s)

Finally, we ended the keynote with [Joe Savona](https://twitter.com/en_JS), [Sathya Gunasekaran](https://twitter.com/_gsathya), and [Mofei Zhang](https://twitter.com/zmofei) announcing that the React Compiler is now [Open Source](https://github.com/facebook/react/pull/29061), and sharing an experimental version of the React Compiler to try out.

For more information on using the Compiler and how it works, check out [the docs](/learn/react-compiler) and these talks:

- [Lauren Tan](https://twitter.com/potetotes): [Forget About Memo](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=12020s) by 
- [Sathya Gunasekaran](https://twitter.com/_gsathya) 와 [Mofei Zhang](https://twitter.com/zmofei): [React Compiler Deep Dive](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=9313s)

Watch the full day 1 keynote here:

<YouTubeIframe src="https://www.youtube.com/embed/T8TZQ6k4SLE?t=973s" />

## 2일차 {/*day-2*/}

_[Watch the full day 2 stream here.](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=1720s)_

둘째날의 시작은 [Seth Webster](https://twitter.com/sethwebster)의 환영 인사로 시작되었으며, [Eli White](https://x.com/Eli_White)의 감사 인사에 이어 CVO(Chief Vibes Officer) [Ashley Narcisse](https://twitter.com/_darkfadr)가 소개를 맡았습니다.

In the day 2 keynote, [Nicola Corti](https://twitter.com/cortinico) shared the State of React Native, including 78 million downloads in 2023. He also highlighted apps using React Native including 2000+ screens used inside of Meta; the product details page in Facebook Marketplace, which is visited more than 2 billion times per day; and part of the Microsoft Windows Start Menu and some features in almost every Microsoft Office product across mobile and desktop.

Nicola also highlighted all the work the community does to support React Native including libraries, frameworks, and multiple platforms. For more, check out these talks from the community:

- [Extending React Native beyond Mobile and Desktop Apps](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=5798s) by [Chris Traganos](https://twitter.com/chris_trag) and [Anisha Malde](https://twitter.com/anisha_malde)
- [Spatial computing with React](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=22525s) by [Michał Pierzchała](https://twitter.com/thymikee)

[Riccardo Cipolleschi](https://twitter.com/cipolleschir) continued the day 2 keynote by announcing that the React Native New Architecture is now in Beta and ready for apps to adopt in production. He shared new features and improvements in the new architecture, and shared the roadmap for the future of React Native. For more check out:

- [Cross Platform React](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=26569s) by [Olga Zinoveva](https://github.com/SlyCaptainFlint) and [Naman Goel](https://twitter.com/naman34)

Next in the keynote, Nicola announced that we are now recommending starting with a framework like Expo for all new apps created with React Native. With the change, he also announced a new React Native homepage and new Getting Started docs. You can view the new Getting Started guide in the [React Native docs](https://reactnative.dev/docs/next/environment-setup).

Finally, to end the keynote, [Kadi Kraman](https://twitter.com/kadikraman) shared the latest features and improvements in Expo, and how to get started developing with React Native using Expo.

Watch the full day 2 keynote here:

<YouTubeIframe src="https://www.youtube.com/embed/0ckOUBiuxVY?t=1720s" />

## Q&A {/*q-and-a*/}

또한 React와 React Native 팀은 매일 Q&A 세션으로 그 날의 일정을 마무리했습니다:

- [Michael Chan](https://twitter.com/chantastic)이 진행한 [React Q&A](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=27518s)
- [Jamon Holmgren](https://twitter.com/jamonholmgren)이 진행한 [React Native Q&A](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=27935s)

## 그리고... {/*and-more*/}

We also heard talks on accessibility, error reporting, css, and more:

- [Kateryna Porshnieva](https://twitter.com/krambertech): [Demystifying accessibility in React apps](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=20655s)
- [Olivier Tassinari](https://twitter.com/olivtassinari): [Pigment CSS, CSS in the server component age](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=21696s) 
- [Sunil Pai](https://twitter.com/threepointone): [Real-time React Server Components](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=24070s) 
- [Charlotte Isambert](https://twitter.com/c_isambert): [Let's break React Rules](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=25862s) 
- [Ryan Albrecht](https://github.com/ryan953): [Solve 100% of your errors](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=19881s) 

## 감사드립니다 {/*thank-you*/}

Thank you to all the staff, speakers, and participants who made React Conf 2024 possible. There are too many to list, but we want to thank a few in particular.

Thank you to [Barbara Markiewicz](https://twitter.com/barbara_markie), the team at [Callstack](https://www.callstack.com/), and our React Team Developer Advocate [Matt Carroll](https://twitter.com/mattcarrollcode) for helping to plan the entire event; and to [Sunny Leggett](https://zeroslopeevents.com/about) and everyone from [Zero Slope](https://zeroslopeevents.com) for helping to organize the event.

Thank you [Ashley Narcisse](https://twitter.com/_darkfadr) for being our MC and Chief Vibes Officer; and to [Michael Chan](https://twitter.com/chantastic) and [Jamon Holmgren](https://twitter.com/jamonholmgren) for hosting the Q&A sessions.

Thank you [Seth Webster](https://twitter.com/sethwebster) and [Eli White](https://x.com/Eli_White) for welcoming us each day and providing direction on structure and content; and to [Tom Occhino](https://twitter.com/tomocchino) for joining us with a special message during the after-party.

Thank you [Ricky Hanlon](https://www.youtube.com/watch?v=FxTZL2U-uKg&t=1263s) for providing detailed feedback on talks, working on slide designs, and generally filling in the gaps to sweat the details.

Thank you [Callstack](https://www.callstack.com/) for building the conference website; and to [Kadi Kraman](https://twitter.com/kadikraman) and the [Expo](https://expo.dev/) team for building the conference mobile app.

Thank you to all the sponsors who made the event possible: [Remix](https://remix.run/), [Amazon](https://developer.amazon.com/apps-and-games?cmp=US_2024_05_3P_React-Conf-2024&ch=prtnr&chlast=prtnr&pub=ref&publast=ref&type=org&typelast=org), [MUI](https://mui.com/), [Sentry](https://sentry.io/for/react/?utm_source=sponsored-conf&utm_medium=sponsored-event&utm_campaign=frontend-fy25q2-evergreen&utm_content=logo-reactconf2024-learnmore), [Abbott](https://www.jobs.abbott/software), [Expo](https://expo.dev/), [RedwoodJS](https://redwoodjs.com/), and [Vercel](https://vercel.com).

Thank you to the AV Team for the visuals, stage, and sound; and to the Westin Hotel for hosting us.

Thank you to all the speakers who shared their knowledge and experiences with the community.

Finally, thank you to everyone who attended in person and online to show what makes React, React. React is more than a library, it is a community, and it was inspiring to see everyone come together to share and learn together.

See you next time!

