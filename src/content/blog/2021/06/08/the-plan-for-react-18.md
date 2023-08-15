---
title: "React 18 계획"
---

2021년 6월 8일, [Andrew Clark](https://twitter.com/acdlite), [Brian Vaughn](https://github.com/bvaughn), [Christine Abernathy](https://twitter.com/abernathyca), [Dan Abramov](https://twitter.com/dan_abramov), [Rachel Nabors](https://twitter.com/rachelnabors), [Rick Hanlon](https://twitter.com/rickhanlonii), [Sebastian Markbåge](https://twitter.com/sebmarkbage), [Seth Webster](https://twitter.com/sethwebster)

---

<Intro>

React 팀은 몇 가지 업데이트를 공유하게 되어 기쁩니다.

1. 다음 주요 버전이 될 React 18 릴리즈에 대한 작업을 시작했습니다.
2. 커뮤니티가 React 18의 새로운 기능을 점진적으로 채택할 수 있도록 준비하기 위해 워킹 그룹을 만들었습니다.
3. 라이브러리 작성자가 사용해 보고 피드백을 제공할 수 있도록 React 18 알파를 게시했습니다.

이 업데이트는 주로 서드파티 라이브러리 관리자를 대상으로 합니다. React를 배우거나 가르치거나 사용자 애플리케이션을 빌드하는 데 사용하는 경우 이 게시물을 무시해도 됩니다. 하지만 궁금한 점이 있으시다면 React 18 워킹 그룹에서 토론을 따라가셔도 좋습니다!

---

</Intro>

## React 18의 새로운 기능 {/*whats-coming-in-react-18*/}

React 18이 출시되면 [자동 일괄 처리](https://github.com/reactwg/react-18/discussions/21)와 같은 즉시 사용한 개선 사항 및 [`startTransition`](https://github.com/reactwg/react-18/discussions/41)과 같은 새로운 API, `React.lazy`를 기본으로 지원하는 [새로운 스트리밍 서버 렌더러](https://github.com/reactwg/react-18/discussions/37)가 포함될 예정입니다.

이러한 기능은 React 18에 추가되는 새로운 옵트인 메커니즘 덕분에 가능합니다. 이를 "동시 렌더링"이라고 하며, 이 기능을 통해 React는 동시에 여러 버전의 UI를 준비할 수 있습니다. 이 변경 사항은 대부분 보이지 않지만, 앱의 실제 성능과 체감 성능을 모두 개선할 수 있는 새로운 가능성을 열어줍니다.

React의 미래에 대한 저희의 연구를 계속 지켜보셨다면(그럴 필요는 없습니다!) "동시 모드"라는 기능에 대해 들어보셨거나 앱이 손상될 수 있다는 이야기를 들어보셨을 것입니다. 이러한 커뮤니티의 피드백을 반영하여 점진적인 도입을 위해 업그레이드 전략을 재설계했습니다. "모드"를 모두 사용하거나 사용하지 않는 대신, 동시 렌더링은 새로운 기능 중 하나에 의해 트리거되는 업데이트에 대해서만 활성화됩니다. 즉, **실제로는 재작성 없이 React 18을 도입하고 자신의 속도에 맞춰 새로운 기능을 사용해 볼 수 있습니다**.

## 점진적인 도입 전략 {/*a-gradual-adoption-strategy*/}

React 18의 동시성은 옵트인 방식이므로 컴포넌트 동작에 대한 중요한 변경 사항은 없습니다. **애플리케이션 코드를 거의 또는 전혀 변경하지 않고도 일반적인 주요 React 릴리즈와 비슷한 수준의 노력으로 React 18로 업그레이드할 수 있습니다**. 여러 앱을 React 18로 전환한 경험에 비추어 볼 때, 많은 사용자가 하루 오후 안에 업그레이드할 수 있을 것으로 예상합니다.

우리는 Facebook에서 수만 개의 컴포넌트에 동시 기능을 성공적으로 제공했으며, 경험상 대부분의 React 컴포넌트가 추가 변경 없이 "바로 작동"하는 것으로 나타났습니다. 전체 커뮤니티를 위한 원활한 업그레이드가 될 수 있도록 최선을 다하고 있으며, 오늘 React 18 워킹 그룹을 발표합니다.

## 커뮤니티와의 협력 {/*working-with-the-community*/}

이번 릴리즈에서는 새로운 시도를 하고 있습니다. React 커뮤니티의 전문가, 개발자, 라이브러리 작성자, 교육자들로 구성된 패널을 [React 18 워킹 그룹](https://github.com/reactwg/react-18)에 초대하여 피드백을 제공하고, 질문하고, 릴리즈에 대해 협업할 수 있도록 했습니다. 이번 소규모 그룹에는 원하는 모든 분을 초대할 수는 없었지만, 이 실험이 성공한다면 앞으로 더 많은 분을 초대할 수 있기를 바랍니다!

**React 18 워킹 그룹의 목표는 기본 애플리케이션과 라이브러리가 React 18을 원활하고 점진적으로 채택할 수 있도록 생태계를 준비하는 것입니다.** 워킹 그룹은 [GitHub 토론](https://github.com/reactwg/react-18/discussions)에서 호스팅되며, 일반인도 열람할 수 있습니다. 워킹 그룹의 구성원은 피드백을 남기고, 질문하고, 아이디어를 공유할 수 있습니다. 핵심 팀도 토론 리포지토리를 사용하여 연구 결과를 공유할 것입니다. 안정 버전 출시가 가까워지면 중요한 정보도 이 블로그에 게시될 예정입니다.

React 18로 업그레이드하는 방법이나 릴리즈에 대한 추가 리소스에 대한 자세한 내용은 [React 18 발표 게시물](https://github.com/reactwg/react-18/discussions/4)을 참고하세요.

## React 18 워킹 그룹에 접근하기 {/*accessing-the-react-18-working-group*/}

누구나 [React 18 워킹 그룹 리포지토리](https://github.com/reactwg/react-18)에서 토론 내용을 읽을 수 있습니다.

워킹 그룹에 대한 초기 관심이 급증할 것으로 예상되므로 초대받은 회원만 스레드를 만들거나 댓글을 달 수 있습니다. 그러나 토론글은 모든 사람에게 완전히 공개되므로 모든 사람이 동일한 정보에 접근할 수 있습니다. 이는 워킹 그룹 구성원을 위한 생산적인 환경을 조성하는 동시에 더 많은 커뮤니티와의 투명성을 유지하는 좋은 절충안이라고 생각합니다.

언제나 그렇듯이 [이슈 트래커](https://github.com/facebook/react/issues)에 버그 보고서, 질문 및 일반적인 피드백을 제출할 수 있습니다.

## 지금 React 18 알파를 사용해 보는 방법 {/*how-to-try-react-18-alpha-today*/}

새로운 알파는 [정기적으로 `@alpha` 태그를 사용하여 npm에 게시됩니다](https://github.com/reactwg/react-18/discussions/9). 이러한 릴리즈는 메인 리포지토리에 대한 가장 최근 커밋을 사용하여 빌드됩니다. 기능이나 버그 수정이 병합되면 다음 주일에 알파에 표시됩니다.

알파 릴리즈 사이에는 중요한 동작 또는 API 변경이 있을 수 있습니다. **알파 릴리즈는 사용자를 대상으로 하는 프로덕션 애플리케이션에는 권장되지 않는다는 점**을 기억하세요.

## 예상 React 18 릴리즈 일정 {/*projected-react-18-release-timeline*/}

구체적인 릴리즈 날짜는 예정되어 있지 않지만, 대부분의 프로덕션 애플리케이션에서 React 18을 사용할 수 있게 되려면 몇 달 동안 피드백과 반복 작업을 거쳐야 할 것으로 예상됩니다.

* 라이브러리 알파: 오늘 사용 가능
* 공개 베타: 최소 몇 개월
* 릴리즈 후보 (RC): 베타 출시 후 최소 몇 주 후
* 일반 사용 가능: RC 이후 최소 몇 주 후

예상 릴리즈 일정에 대한 자세한 내용은 [워킹 그룹에서 확인](https://github.com/reactwg/react-18/discussions/9)할 수 있습니다. 공개 릴리즈에 가까워지면 이 블로그에 업데이트를 게시하겠습니다.
