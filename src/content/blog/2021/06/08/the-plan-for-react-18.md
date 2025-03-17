---
title: "React 18에 대한 계획"
author: Andrew Clark, Brian Vaughn, Christine Abernathy, Dan Abramov, Rachel Nabors, Rick Hanlon, Sebastian Markbage, and Seth Webster
date: 2021/06/08
description: React 팀은 몇 가지 업데이트를 공유하게 되어 기쁩니다. 다음 주요 버전이 될 React 18 릴리즈에 대한 작업을 시작했습니다. 커뮤니티가 React 18의 새로운 기능을 점진적으로 채택할 수 있도록 준비하기 위해 워킹 그룹을 만들었습니다. 라이브러리 작성자가 사용해 보고 피드백을 제공할 수 있도록 React 18 Alpha를 게시했습니다...
---

2021년 6월 8일, [Andrew Clark](https://twitter.com/acdlite), [Brian Vaughn](https://github.com/bvaughn), [Christine Abernathy](https://twitter.com/abernathyca), [Dan Abramov](https://twitter.com/dan_abramov), [Rachel Nabors](https://twitter.com/rachelnabors), [Rick Hanlon](https://twitter.com/rickhanlonii), [Sebastian Markbåge](https://twitter.com/sebmarkbage), [Seth Webster](https://twitter.com/sethwebster)

---

<Intro>

React 팀은 몇 가지 업데이트를 공유하게 되어 기쁩니다.

1. 다음번 주<sup>Major, 主</sup> 버전이 될 React 18 릴리즈에 대한 작업을 시작했습니다.
2. 커뮤니티가 React 18의 새로운 기능을 점진적으로 채택할 수 있도록 준비하기 위해 워킹 그룹<sup>Working Group</sup>을 만들었습니다.
3. 라이브러리 작성자가 사용해 보고 피드백을 제공할 수 있도록 React 18 Alpha를 게시했습니다.

이번 업데이트는 주로 서드파티<sup>Third Party</sup> 라이브러리 관리자를 대상으로 합니다. React를 배우거나 가르치거나, 혹은 사용자 애플리케이션을 빌드하는 데 사용하는 경우 이 게시물을 무시해도 됩니다. 하지만 궁금한 점이 있으시다면 React 18 워킹 그룹의 토론에 참여하셔도 좋습니다!

---

</Intro>

## React 18의 새로운 기능 {/*whats-coming-in-react-18*/}

React 18이 출시되면 [자동 일괄 처리<sup>Automatic Batching</sup>](https://github.com/reactwg/react-18/discussions/21)와 같은 기본 개선 사항 및 [`startTransition`](https://github.com/reactwg/react-18/discussions/41)과 같은 새로운 API, `React.lazy`를 기본적으로 지원하는 [새로운 스트리밍 서버 렌더러<sup>Streaming Server Renderer</sup>](https://github.com/reactwg/react-18/discussions/37)가 포함될 예정입니다.

이러한 기능들은 React 18에 추가될 새로운 선택적<sup>Opt-In</sup> 메커니즘 덕분에 가능해졌습니다. 이를 "동시성 렌더링<sup>Concurrent Rendering</sup>"이라고 하며, 이 기능을 통해 React는 동시에 여러 버전의 UI를 준비할 수 있습니다. 이러한 변경 사항들은 대부분 직접 볼 수는 없지만, 앱의 실제 성능과 체감 성능을 모두 개선할 수 있는 새로운 가능성을 열어줍니다.

React의 미래에 대한 저희들의 연구를 계속 지켜보셨다면(물론, 그럴 필요는 없습니다!), "동시성 모드<sup>Concurrent Mode</sup>"라는 기능에 대해 들어보셨거나, 그것이 여러분들의 앱을 망칠 수 있다는 이야기를 들으셨을 수도 있습니다. 이러한 커뮤니티의 피드백을 반영하여 점진적인 도입을 위한 업그레이드 전략을 재설계했습니다. "모드"를 모두 사용하거나 사용하지 않는 대신, 동시성 렌더링<sup>Concurrent Rendering</sup>은 새로운 기능 중 하나에 의해 트리거되는 업데이트에 대해서만 활성화됩니다. 즉, **재작성 없이 React 18을 도입하고 자신의 속도에 맞춰 새로운 기능들을 사용해 볼 수 있습니다**.

## 점진적인 도입 전략 {/*a-gradual-adoption-strategy*/}

React 18의 동시성은 선택적<sup>Opt-In</sup>이므로 컴포넌트 동작에 대한 중요 변경 사항<sup>Breaking Changes</sup>은 없습니다. **애플리케이션 코드를 거의 또는 전혀 변경하지 않고도, 일반적인 주요 React 릴리즈와 비슷한 수준의 노력으로 React 18로 업그레이드할 수 있습니다**. 여러 앱을 React 18로 전환한 경험에 비추어 볼 때, 많은 사용자가 반나절 안에 업그레이드할 수 있을 것으로 예상합니다.

우리는 페이스북<sup>Facebook</sup>에서 수만 개의 컴포넌트에 동시성 기능들을 성공적으로 배포했으며, 경험상 대부분의 React 컴포넌트가 추가 변경 없이 "바로 작동"하였습니다. 커뮤니티 전체를 위한 원활한 업그레이드가 될 수 있도록 최선을 다하고 있으며, 오늘 React 18 워킹 그룹을 발표합니다.

## 커뮤니티와의 협력 {/*working-with-the-community*/}

이번 릴리즈에서는 새로운 시도를 하고 있습니다. React 커뮤니티의 전문가, 개발자, 라이브러리 작성자, 교육자들로 구성된 패널을 [React 18 워킹 그룹](https://github.com/reactwg/react-18)에 초대하여 피드백을 제공하고, 질문하고, 릴리즈에 대해 협업할 수 있도록 했습니다. 이번 소규모 그룹에 원하는 모든 분들을 초대할 수는 없었지만, 이번 실험이 성공하여 앞으로 더 많은 분을 초대할 수 있기를 바랍니다!

**React 18 워킹 그룹의 목표는 기본 애플리케이션과 라이브러리가 React 18을 원활하고 점진적으로 채택할 수 있는 생태계를 준비하는 것입니다.** 워킹 그룹은 [깃허브 토론<sup>GitHub Discussions</sup>](https://github.com/reactwg/react-18/discussions)에서 호스팅되며, 일반인도 열람할 수 있습니다. 워킹 그룹의 구성원은 피드백을 남기고, 질문하고, 아이디어를 공유할 수 있습니다. 핵심 팀도 토론 저장소<sup>Repository</sup>를 사용하여 연구 결과를 공유할 것입니다. 안정적인 버전의 출시가 가까워지면, 중요 정보들을 블로그에 게시할 것입니다.

React 18로 업그레이드하는 방법이나, 릴리즈에 대한 추가적인 정보들은 [React 18 발표 게시물](https://github.com/reactwg/react-18/discussions/4)을 참고하세요.

## React 18 워킹 그룹에 접근하기 {/*accessing-the-react-18-working-group*/}

누구나 [React 18 워킹 그룹 저장소](https://github.com/reactwg/react-18)에서 토론 내용을 읽을 수 있습니다.

워킹 그룹에 대한 초기 관심이 급증할 것으로 예상되므로, 초대받은 회원만 스레드를 만들거나 댓글을 달 수 있습니다. 그러나, 토론글은 모든 사람에게 완전히 공개되므로 모든 사람이 동일한 정보에 접근할 수 있습니다. 이는 워킹 그룹 구성원을 위한 생산적인 환경을 조성하는 동시에 더 많은 커뮤니티와의 투명성을 유지하는 좋은 절충안이라 생각합니다.

언제나 그렇듯이 [이슈 트래커](https://github.com/facebook/react/issues)에 버그 보고서, 질문 및 일반적인 피드백을 제출할 수 있습니다.

## 지금 React 18 Alpha를 사용하는 방법 {/*how-to-try-react-18-alpha-today*/}

새로운 Alpha는 [정기적으로 `@alpha` 태그를 통해 npm에 배포됩니다](https://github.com/reactwg/react-18/discussions/9). 이러한 릴리즈는 메인 저장소<sup>Main Repo</sup>에 대한 가장 최근 커밋을 사용하여 빌드됩니다. 기능 혹은 버그 수정이 병합되면 그 다음주에 Alpha로 배포됩니다.

Alpha 릴리즈 사이에는 중요한 동작 또는 API 변경이 있을 수 있습니다. **Alpha 릴리즈는 사용자를 대상으로 하는 프로덕션 애플리케이션에 권장하지 않는다는 점**을 기억하세요.

## 예상 React 18 릴리즈 일정 {/*projected-react-18-release-timeline*/}

구체적인 릴리즈 날짜는 예정되어 있지 않지만, 대부분의 프로덕션 애플리케이션에서 React 18을 사용할 수 있게 되려면 몇 달 동안 피드백과 반복 작업을 거쳐야 할 것으로 예상합니다.

* 라이브러리 Alpha: 오늘 사용 가능
* 공개 베타: 최소 몇 개월
* 릴리즈 후보 (RC): Beta 출시 후 최소 몇 주 후
* 일반 사용 가능: RC 이후 최소 몇 주 후

예상 릴리즈 일정에 대한 자세한 내용은 [워킹 그룹에서 확인](https://github.com/reactwg/react-18/discussions/9)할 수 있습니다. 공개 릴리즈에 가까워지면 이 블로그에 업데이트를 게시하겠습니다.
