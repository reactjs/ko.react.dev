---
title: "React Conf 2021 요약"
---

2021년 12월 17일 [Jesslyn Tannady](https://twitter.com/jtannady), [Rick Hanlon](https://twitter.com/rickhanlonii)

---

<Intro>

지난 주, 우리는 6번째 React Conf를 개최했습니다. 지난 몇 년 동안 우리는 React Conf 무대를 통해 [_React Native_](https://engineering.fb.com/2015/03/26/android/react-native-bringing-modern-web-techniques-to-mobile/), [_React Hooks_](https://reactjs.org/docs/hooks-intro.html)와 같은 업계 변화를 알리는 발표를 해왔습니다. 올해는 React 18의 출시와 동시 기능의 점진적인 도입을 시작으로 React의 멀티 플랫폼 비전을 공유했습니다.

</Intro>

---

React Conf가 온라인으로 개최된 것은 이번이 처음이며, 8개 언어로 번역되어 무료로 스트리밍되었습니다. 전 세계의 참가자들은 모든 시간대에서 접근성을 위해 컨퍼런스 Discord와 리플레이 이벤트에 참여했습니다. 50,000명 이상이 등록했으며, 19개 강연의 조회수는 60,000회를 넘었고, 두 이벤트에 걸쳐 5,000명이 Discord에 참여했습니다.

모든 강연은 [온라인으로 스트리밍 가능](https://www.youtube.com/watch?v=FZ0cG47msEk&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa)합니다.

무대에서 공유된 내용을 요약해 보았습니다:

## React 18 및 동시 기능 {/*react-18-and-concurrent-features*/}

기조연설에서 저희는 React 18을 시작으로 React의 미래에 대한 비전을 공유했습니다.

React 18은 오랫동안 기다려온 동시 renderer를 추가하고 Suspense를 큰 변경 없이 업데이트했습니다. 앱은 React 18로 업그레이드하여 다른 주요 출시와 동등한 수준의 노력으로 동시 기능을 점진적으로 도입할 수 있습니다.

**이는 동시 모드가 없고 동시 기능만 있음을 의미합니다.**

기조연설에서는 Suspense, 서버 컴포넌트, 새로운 React 워킹 그룹에 대한 비전과 React Native에 대한 장기적인 멀티플랫폼 비전도 공유했습니다.

[Andrew Clark](https://twitter.com/acdlite), [Juan Tejada](https://twitter.com/_jstejada), [Lauren Tan](https://twitter.com/potetotes), [Rick Hanlon](https://twitter.com/rickhanlonii)의 기조연설 전문을 여기에서 시청하세요:

<YouTubeIframe src="https://www.youtube.com/embed/FZ0cG47msEk" />

## 애플리케이션 개발자를 위한 React 18 {/*react-18-for-application-developers*/}

기조연설에서는 React 18 RC를 지금 바로 사용해볼 수 있다는 사실도 발표했습니다. 추가 피드백을 기다리는 중이며, 내년 초에 정식 버전으로 출시할 예정입니다.

React 18 RC를 사용해 보려면 의존성을 업그레이드하세요:

```bash
npm install react@rc react-dom@rc
```

를 클릭하고 새로운 `createRoot` API로 전환하세요:

```js
// before
const container = document.getElementById('root');
ReactDOM.render(<App />, container);

// after
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App/>);
```

React 18로 업그레이드하는 데모는 여기에서 [Shruti Kapoor](https://twitter.com/shrutikapoor08)의 강연을 참조하세요:

<YouTubeIframe src="https://www.youtube.com/embed/ytudH8je5ko" />

## Suspense가 있는 스트리밍 서버 렌더링 {/*streaming-server-rendering-with-suspense*/}

React 18에는 Suspense를 사용한 서버 측 렌더링 성능 개선 사항도 포함되어 있습니다.

스트리밍 서버 렌더링을 사용하면 서버의 React 컴포넌트에서 HTML을 생성하고 해당 HTML을 사용자에게 스트리밍할 수 있습니다. React 18에서는 'Suspense'를 사용하여 앱을 더 작은 독립 단위로 분해하여 나머지 앱을 차단하지 않고 서로 독립적으로 스트리밍할 수 있습니다. 이는 사용자가 콘텐츠를 더 빨리 보고 훨씬 빠르게 상호작용을 시작할 수 있다는 것을 의미합니다.

더 자세히 알아보려면 [Shaundai Person](https://twitter.com/shaundai)의 강연을 참조하세요:

<YouTubeIframe src="https://www.youtube.com/embed/pj5N-Khihgc" />

## 첫 번째 React 워킹 그룹 {/*the-first-react-working-group*/}

React 18에서는 전문가, 개발자, 라이브러리 관리자, 교육자들로 구성된 패널과 협력하기 위해 첫 번째 워킹 그룹을 만들었습니다. 우리는 함께 점진적인 채택 전략을 세우고 `useId`, `useSyncExternalStore`, `useInsertionEffect`와 같은 새로운 API를 개선하기 위해 노력했습니다.

이 작업에 대한 개요는 [Aakansha' Doshi](https://twitter.com/aakansha1216)의 강연을 참조하세요:

<YouTubeIframe src="https://www.youtube.com/embed/qn7gRClrC9U" />

## React 개발자 도구 {/*react-developer-tooling*/}

이번 릴리즈의 새로운 기능을 지원하기 위해 새로 구성된 React 개발자 도구 팀과 개발자가 React 앱을 디버깅하는 데 도움이 되는 새로운 타임라인 프로파일러도 발표했습니다.

새로운 개발자 도구 기능에 대한 자세한 내용과 데모는 [Brian Vaughn](https://twitter.com/brian_d_vaughn)의 강연을 참조하세요:

<YouTubeIframe src="https://www.youtube.com/embed/oxDfrke8rZg" />

## memo 없는 React {/*react-without-memo*/}

미래를 내다보며, [Xuan Huang(黄玄)](https://twitter.com/Huxpro)이 자동 메모화 컴파일러에 대한 React Labs 연구의 업데이트를 공유했습니다. 이 강연에서 자세한 정보와 컴파일러 프로토타입 데모를 확인하세요:

<YouTubeIframe src="https://www.youtube.com/embed/lGEMwh32soc" />

## React 문서 기조연설 {/*react-docs-keynote*/}

[Rachel Nabors](https://twitter.com/rachelnabors)가 React의 새로운 문서에 대한 투자에 대한 기조연설로 React로 학습하고 디자인하는 방법에 대한 강연을 시작했습니다([현재 react.dev로 제공됨](/blog/2023/03/16/introducing-react-dev)):

<YouTubeIframe src="https://www.youtube.com/embed/mneDaMYOKP8" />

## 그리고... {/*and-more*/}

**React로 학습하고 디자인하는 방법에 대한 강연:**

* Debbie O'Brien: [새로운 React 문서에서 배운 것들](https://youtu.be/-7odLW_hG7s).
* Sarah Rainsberger: [브라우저에서 학습하기](https://youtu.be/5X-WEQflCL0).
* Linton Ye: [React로 디자인함에서의 ROI](https://youtu.be/7cPWmID5XAk).
* Delba de Oliveira: [React를 이용한 인터랙티브 놀이터](https://youtu.be/zL8cz2W0z34).

**Relay, React Native, PyTorch 팀의 강연:**

* Robert Balicki: [Relay 다시 소개](https://youtu.be/lhVGdErZuN4).
* Eric Rozell과 Steven Moyes: [React Native 데스크톱](https://youtu.be/9L4FFrvwJwY).
* Roman Rädle: [React Native를 위한 온디바이스 머신러닝](https://youtu.be/NLj73vrc2I8)

**접근성, 툴링 및 서버 컴포넌트에 대한 커뮤니티 강연:**

* Daishi Kato: [외부 스토어 라이브러리를 위한 React 18](https://youtu.be/oPfSC5bQPR8).
* Diego Haz: [React 18에서 접근 가능한 컴포넌트 구축하기](https://youtu.be/dcm8fjBfro8).
* Tafu Nakazaki: [React로 접근 가능한 일본어 폼 컴포넌트](https://youtu.be/S4a0QlsH0pU).
* Lyle Troxell: [아티스트를 위한 UI 도구](https://youtu.be/b3l4WxipF).
* Helen Lin: [Hydrogen + React 18](https://youtu.be/HS6vIYkSNks).

## 감사드립니다 {/*thank-you*/}

올해는 저희가 직접 컨퍼런스를 기획한 첫 해로, 많은 분들께 감사드리고 싶습니다.

먼저, 모든 연사분들께 감사드립니다 [Aakansha Doshi](https://twitter.com/aakansha1216), [Andrew Clark](https://twitter.com/acdlite), [Brian Vaughn](https://twitter.com/brian_d_vaughn), [Daishi Kato](https://twitter.com/dai_shi), [Debbie O'Brien](https://twitter.com/debs_obrien), [Delba de Oliveira](https://twitter.com/delba_oliveira), [Diego Haz](https://twitter.com/diegohaz), [Eric Rozell](https://twitter.com/EricRozell), [Helen Lin](https://twitter.com/wizardlyhel), [Juan Tejada](https://twitter.com/_jstejada), [Lauren Tan](https://twitter.com/potetotes), [Linton Ye](https://twitter.com/lintonye), [Lyle Troxell](https://twitter.com/lyle), [Rachel Nabors](https://twitter.com/rachelnabors), [Rick Hanlon](https://twitter.com/rickhanlonii), [Robert Balicki](https://twitter.com/StatisticsFTW), [Roman Rädle](https://twitter.com/raedle), [Sarah Rainsberger](https://twitter.com/sarah11918), [Shaundai Person](https://twitter.com/shaundai), [Shruti Kapoor](https://twitter.com/shrutikapoor08), [Steven Moyes](https://twitter.com/moyessa), [Tafu Nakazaki](https://twitter.com/hawaiiman0), 그리고  [Xuan Huang (黄玄)](https://twitter.com/Huxpro).

[Andrew Clark](https://twitter.com/acdlite), [Dan Abramov](https://twitter.com/dan_abramov), [Dave McCabe](https://twitter.com/mcc_abe), [Eli White](https://twitter.com/Eli_White), [Joe Savona](https://twitter.com/en_JS), [Lauren Tan](https://twitter.com/potetotes), [Rachel Nabors](https://twitter.com/rachelnabors), [Tim Yung](https://twitter.com/yungsters) 등 대담에 피드백을 제공해 주신 모든 분들께 감사드립니다.

디스코드 컨퍼런스를 개설하고 디스코드 관리자로 활동해 주신 [Lauren Tan](https://twitter.com/potetotes)에게 감사드립니다.

전반적인 방향에 대한 피드백을 제공하고 다양성과 포용성에 집중할 수 있도록 도와주신 [Seth Webster](https://twitter.com/sethwebster)에게 감사드립니다.

사회를 진행하신 [Rachel Nabors](https://twitter.com/rachelnabors)와 사회 진행 가이드를 만들고, 사회 진행 팀을 이끌고, 번역가와 사회자를 교육하고, 두 이벤트의 사회 진행을 도와주신 [Aisha Blake](https://twitter.com/AishaBlake)께도 감사드립니다.

사회자 [Jesslyn Tannady](https://twitter.com/jtannady), [Suzie Grange](https://twitter.com/missuze), [Becca Bailey](https://twitter.com/beccaliz), [Luna Wei](https://twitter.com/lunaleaps), [Joe Previte](https://twitter.com/jsjoeio), [Nicola Corti](https://twitter.com/Cortinico), [Gijs Weterings](https://twitter.com/gweterings), [Claudio Procida](https://twitter.com/claudiopro), Julia Neumann, Mengdi Chen, Jean Zhang, Ricky Li 및 [Xuan Huang (黄玄)](https://twitter.com/Huxpro)께 감사드립니다.

리플레이 이벤트의 진행을 도와주시고 커뮤니티의 참여를 이끌어주신 [React India](https://www.reactindia.io/)의 [Manjula Dube](https://twitter.com/manjula_dube), [Sahil Mhapsekar](https://twitter.com/apheri0), [React China](https://twitter.com/ReactChina)의 [Jasmine Xie](https://twitter.com/jasmine_xby), [QiChang Li](https://twitter.com/QCL15), [YanLun Li](https://twitter.com/anneincoding)께도 감사의 말씀을 전합니다.

컨퍼런스 웹사이트의 기반이 된 [가상 이벤트 스타터 키트](https://vercel.com/virtual-event-starter-kit)를 게시해주신 Vercel과 Next.js Conf 운영 경험을 공유해주신 [Lee Robinson](https://twitter.com/leeerob)과 [Delba de Oliveira](https://twitter.com/delba_oliveira)께 감사드립니다.

컨퍼런스를 운영한 경험, [RustConf](https://rustconf.com/)를 운영하면서 얻은 교훈, [Event Driven](https://leanpub.com/eventdriven/)과 컨퍼런스를 운영하기 위한 조언을 공유해주신 [Leah Silber](https://twitter.com/wifelette)께 감사드립니다.

Women of React Conf를 운영한 경험을 공유해주신 [Kevin Lewis](https://twitter.com/_phzn)와 [Rachel Nabors](https://twitter.com/rachelnabors)께 감사드립니다.

기획 전반에 걸쳐 조언과 아이디어를 제공해주신 [Aakansha Doshi](https://twitter.com/aakansha1216), [Laurie Barth](https://twitter.com/laurieontech), [Michael Chan](https://twitter.com/chantastic), [Shaundai Person](https://twitter.com/shaundai)께 감사드립니다.

컨퍼런스 웹사이트와 티켓을 디자인하고 구축하는 데 도움을 주신 [Dan Lebowitz](https://twitter.com/lebo)께 감사드립니다.

기조연설과 Meta 직원 대담의 동영상을 녹화해주신 Facebook 동영상 프로덕션 팀의 Laura Podolak Waddell, Desmond Osei-Acheampong, Mark Rossi, Josh Toberman 및 기타 직원들께도 감사드립니다.

컨퍼런스를 구성하고, 스트림의 모든 동영상을 편집하고, 모든 강연을 번역하고, 여러 언어로 Discord를 진행하는 데 도움을 주신 파트너인 HitPlay께도 감사드립니다.

마지막으로, 멋진 React 컨퍼런스를 만들어주신 모든 참가자 여러분께 감사드립니다!
