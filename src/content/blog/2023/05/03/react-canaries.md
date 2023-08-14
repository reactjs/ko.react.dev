---
title: "React Canaries: Meta 외부에서 점진적 기능 롤아웃 활성화하기"
---

2023년 5월 3일, [Dan Abramov](https://twitter.com/dan_abramov), [Sophie Alpert](https://twitter.com/sophiebits), [Rick Hanlon](https://twitter.com/rickhanlonii), [Sebastian Markbåge](https://twitter.com/sebmarkbage), [Andrew Clark](https://twitter.com/acdlite)

---

<Intro>

Meta가 오랫동안 내부적으로 최첨단 버전의 React를 사용해 온 것과 유사하게, 새로운 기능이 안정된 버전으로 출시되기 전에 디자인이 거의 완성되는 즉시 개별적인 새로운 기능을 채택할 수 있는 옵션을 React 커뮤니티에 제공하고자 합니다. 공식적으로 지원하는 새로운 [Canary 릴리즈 채널](/community/versioning-policy#canary-channel)을 소개합니다. 프레임워크와 같이 엄선된 설정을 통해 개별 React 기능의 채택을 React 릴리즈 일정에서 분리할 수 있습니다.

</Intro>

---

## tl;dr {/*tldr*/}

* 공식적으로 지원하는 React용 [Canary 릴리즈 채널](/community/versioning-policy#canary-channel)을 소개합니다. 공식적으로 지원되므로 회귀 문제가 발생하면 안정된 릴리즈의 버그와 비슷한 수준으로 긴급하게 처리할 것입니다.
* Canaries를 사용하면 Semantic Versioning에 안정된 릴리즈에 적용되기 전에 개별적인 새로운 React 기능을 사용할 수 있습니다.
* [실험](/community/versioning-policy#experimental-channel) 채널과 달리, React Canaries에는 채택할 준비가 되었다고 합리적으로 판단되는 기능만 포함됩니다. 프레임워크는 고정된 Canary React 릴리즈를 번들로 묶는 것을 고려할 것을 권장합니다.
* 중요한 변경 사항과 새로운 기능이 Canary 릴리즈에 적용되면 블로그에 공지할 예정입니다.
* **언제나 그렇듯이 React는 모든 안정된 릴리즈에 대해 Semantic Versioning을 계속 따릅니다.**

## React 기능은 보통 어떻게 개발되나요? {/*how-react-features-are-usually-developed*/}

일반적으로 모든 React 기능은 동일한 단계를 거칩니다.

1. 초기 버전을 개발하고 `experimental_` 또는 `unstable_`접두사를 붙입니다. 이 기능은 `experimental` 릴리즈 채널에서만 사용할 수 있습니다. 이 시점에서 이 기능은 크게 변경될 것으로 예상됩니다.
2. 이 기능을 테스트하고 피드백을 제공하는 데 도움을 줄 Meta 팀을 찾았습니다. 이 피드백을 바탕으로 기능이 변경될 예정입니다. 기능이 안정화됨에 따라 Meta의 더 많은 팀과 협력하여 이 기능을 시험해 봅니다.
3. 결국 디자인에 자신감이 생겼습니다. API 이름에서 접두사를 제거하고 대부분의 Meta 제품이 사용하는 `main` 브랜치에서 이 기능을 기본적으로 사용할 수 있도록 했습니다. 이제 Meta의 모든 팀이 이 기능을 사용할 수 있습니다.
4. 방향에 대한 확신이 생기면 새 기능에 대한 RFC도 게시합니다. 이 시점에서 우리는 이 디자인이 광범위한 사례에 적합하다는 것을 알고 있지만, 마지막 순간에 몇 가지 조정을 할 수도 있습니다.
5. 오픈 소스 릴리즈에 가까워지면 해당 기능에 대한 문서를 작성하고 최종적으로 안정된 React 릴리즈를 통해 기능을 출시합니다.

이 플레이북은 지금까지 출시된 대부분의 기능에 대해 잘 작동합니다. 하지만 일반적으로 기능을 사용할 준비가 된 시점(3단계)과 오픈 소스로 공개되는 시점(5단계) 사이에는 상당한 차이가 있을 수 있습니다.

**저희는 React 커뮤니티에 Meta와 동일한 접근 방식을 따르고 개별적인 새로운 기능을 더 일찍(사용 가능할 때) 채택할 수 있는 옵션을 제공하고자 합니다.**

항상 그렇듯이 모든 React 기능은 결국 안정된 릴리즈에 포함될 것입니다.

## 더 많은 마이너 릴리즈를 할 수 있나요? {/*can-we-just-do-more-minor-releases*/}

일반적으로 새로운 기능을 소개할 때 마이너 릴리즈를 *사용*합니다.

하지만 항상 가능한 것은 아닙니다. 새로운 기능이 아직 완전히 완성되지 않은 *다른* 새로운 기능과 상호 연결되어 있고 여전히 활발하게 반복 작업 중인 경우도 있습니다. 구현이 서로 연관되어 있기 때문에 별도로 릴리즈할 수 없습니다. 같은 패키지에 영향을 미치기 때문에(예시: `react` 및 `react-dom`) 별도로 버전을 배포할 수 없습니다. 또한 주요 버전 릴리즈가 쏟아져 나오지 않는 한 아직 준비되지 않은 부분에 대해 반복 작업을 수행할 수 있는 능력을 유지해야 하는데, 이를 위해서는 Semantic Versioning이 필요합니다.

Meta에서는 `main` 브랜치에서 React를 빌드하고 매주 특정 고정 커밋에 수동으로 업데이트하는 방식으로 이 문제를 해결했습니다. 이는 지난 몇 년 동안 React Native 릴리즈가 따라왔던 접근 방식이기도 합니다. React Native의 모든 *안정된* 릴리즈는 React 저장소의 `main` 브랜치에서 특정 커밋에 고정됩니다. 이를 통해 React Native는 중요한 버그 수정을 포함하고 프레임워크 수준에서 글로벌 React 릴리즈 일정에 얽매이지 않고 새로운 React 기능을 점진적으로 채택할 수 있습니다.

우리는 이 워크플로우를 다른 프레임워크와 선별된 설정에서 사용할 수 있도록 하고 싶습니다. 예를 들어, 이 플로우를 사용하면 React를 *기반으로 하는* 프레임워크가 안정된 React 릴리즈에 포함되기 *전에* React와 관련된 중요한 변경 사항을 포함할 수 있습니다. 일부 변경 사항은 프레임워크 통합에만 영향을 미치기 때문에 이 기능은 특히 유용합니다. 이를 통해 프레임워크는 Semantic Versioning을 중단시키지 않고 자체 마이너 버전에서 이러한 변경 사항을 릴리즈할 수 있습니다.

Canaries 채널을 통한 롤링 릴리즈를 통해 더욱 긴밀한 피드백 루프를 확보하고 새로운 기능이 커뮤니티에서 포괄적인 테스트를 거치도록 할 수 있습니다. 이 워크플로우는 자바스크립트 표준 위원회인 TC39가 [번호가 매겨진 단계로 변경 사항을 처리](https://tc39.es/process-document/)하는 방식에 가깝습니다. 새로운 JavaScript 기능이 명세의 일부로 공식적으로 승인되기 전에 브라우저에서 제공하는 것처럼, 새로운 React 기능은 React 안정 릴리즈에 포함되기 전에 React를 기반으로 구축된 프레임워크에서 사용할 수 있습니다.

## 실험적 릴리즈를 사용하지 않는 이유는 무엇인가요? {/*why-not-use-experimental-releases-instead*/}

기술적으로는 [Experimental releases](/community/versioning-policy#canary-channel)를 사용*할 수* 있지만, 실험적 API는 안정화 과정에서 중대한 변경이 있을 수 있으므로(또는 심지어 완전히 제거될 수도 있으므로) 프로덕션 환경에서 사용하지 않는 것이 좋습니다. Canaries에도 실수가 있을 수 있지만(다른 릴리즈와 마찬가지로), 앞으로는 Canaries에 중대한 변경 사항이 있으면 블로그에 공지할 계획입니다. Canaries는 Meta가 내부적으로 실행하는 코드에 가장 가깝기 때문에 일반적으로 비교적 안정적일 것으로 기대할 수 있습니다. 하지만 버전을 고정*하고* 고정된 커밋 사이를 업데이트할 때는 GitHub 커밋 로그를 수동으로 스캔해야 합니다.

**프레임워크와 같이 엄선된 환경 밖에서 React를 사용하는 대부분 사람은 Stable 릴리즈를 계속 사용하기를 원할 것으로 예상합니다.** 하지만 프레임워크를 구축하는 경우 특정 커밋에 고정된 React의 Canary 버전을 bundle로 묶어 원하는 속도로 업데이트하는 것을 고려할 수 있습니다. 이 방법의 장점은 지난 몇 년 동안 React Native가 해왔던 방식과 유사하게, 완성된 개별 React 기능 및 버그 수정을 사용자에게 더 일찍, 자체 릴리즈 일정에 맞춰 제공할 수 있다는 것입니다. 단점은 어떤 React 커밋을 가져오는지 검토하고 릴리즈에 어떤 React 변경 사항이 포함되었는지 사용자에게 알리는 추가적인 책임을 져야 한다는 것입니다.

프레임워크 작성자로서 이 접근 방식을 시도해 보고 싶다면, 저희에게 연락해 주세요.

## 중요한 변경 사항 및 새로운 기능 조기 발표 {/*announcing-breaking-changes-and-new-features-early*/}

Canary 릴리즈는 특정 시점에 다음 안정된 React 릴리즈에 포함될 내용에 대한 최선의 추측을 나타냅니다.

기존에는 릴리즈 주기가 *끝*날 때(주요 릴리즈를 할 때)만 중요한 변경 사항을 발표했습니다. 이제 Canary 릴리즈가 공식적으로 지원하는 React 사용 방식이 되었으므로, 중요한 변경 사항과 새로운 기능이 Canaries에 *적용될 때* 발표하는 방식으로 전환할 계획입니다. 예를 들어, Canary에 출시될 중요한 변경 사항을 병합하는 경우, 필요한 경우 코드모드 및 마이그레이션 지침을 포함하여 React 블로그에 이에 대한 게시물을 작성할 것입니다. 그런 다음, 프레임워크 작성자가 해당 변경 사항을 포함하도록 고정된 React Canary를 업데이트하는 주요 릴리즈를 자르는 경우 릴리즈 노트에서 블로그 게시물로 링크할 수 있습니다. 마지막으로, 안정된 주요 버전의 React가 준비되면 이미 게시된 블로그 게시물에 링크하여 팀이 더 빠르게 진행하는 데 도움이 되기를 바랍니다.

아직 Canaries 외부에서 사용할 수 없는 API라도 Canaries에 출시하는 대로 문서화할 계획입니다. Canaries에서만 사용할 수 있는 API는 해당 페이지에 특별 메모로 표시될 것입니다. 여기에는 [`use`](https://github.com/reactjs/rfcs/pull/229)와 같은 API와 일부 다른 API(예시: `cache` 및 `createServerContext`)가 포함되며, 이에 대한 RFC를 보내드릴 예정입니다.

## Canaries는 반드시 고정해야 합니다. {/*canaries-must-be-pinned*/}

앱이나 프레임워크에 Canary 워크플로우를 채택하기로 한 경우 항상 사용 중인 Canary의 *정확한* 버전을 고정해야 합니다. Canaries는 사전 릴리즈이므로 여전히 변경 사항이 포함될 수 있습니다.

## 예시: React Server 컴포넌트 {/*example-react-server-components*/}

지난 [3월에 발표했듯이](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components) React Server 컴포넌트 컨벤션은 확정되었으며, 사용자 대면 API 계약과 관련된 중대한 변경 사항은 없을 것으로 예상됩니다. 그러나 서로 얽혀 있는 여러 프레임워크 전용 기능([에셋 로딩](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#asset-loading)과 같은)에 대한 작업이 진행 중이며, 더 많은 변경 사항이 있을 것으로 예상되기 때문에 아직 안정된 버전의 React에서 React Server 컴포넌트에 대한 지원을 릴리즈할 수는 없습니다.

즉, React Server 컴포넌트가 프레임워크에 채택될 준비가 되었다는 뜻입니다. 그러나 다음 주요 React 릴리즈가 나올 때까지 프레임워크가 이를 채택할 수 있는 유일한 방법은 고정된 Canary 버전의 React를 출시하는 것입니다. (두 개의 React 복사본이 bundle로 제공되는 것을 피하고자, 이를 원하는 프레임워크는 프레임워크와 함께 제공하는 고정된 Canary에 `react` 및 `react-dom`의 해결 방법을 적용하고 사용자에게 이를 설명해야 합니다. 예를 들어, 이것이 Next.js App Router가 하는 일입니다.)

## Stable 및 Canary 버전 모두에 대해 라이브러리 테스트하기 {/*testing-libraries-against-both-stable-and-canary-versions*/}

라이브러리 작성자가 모든 Canary 릴리즈를 테스트하는 것은 엄청나게 어렵기 때문에 기대하지 않습니다. 하지만 [3년 전 다양한 React 사전 릴리즈 채널을 처음 도입했을 때](https://legacy.reactjs.org/blog/2019/10/22/react-release-channels.html)와 마찬가지로, 라이브러리 작성자는 최신 Stable 버전과 최신 Canary 버전 *모두*에 대해 테스트를 실행할 것을 권장합니다. 발표되지 않은 동작의 변화를 발견하는 경우, 진단에 도움이 될 수 있도록 React 레포지토리에 버그를 제출해 주세요. 이 관행이 널리 채택되면 라이브러리가 출시될 때 우발적인 회귀를 발견할 수 있기 때문에 라이브러리를 새로운 주요 버전의 React로 업그레이드하는 데 필요한 노력이 줄어들 것으로 기대합니다.

<Note>

엄밀히 말하면, Canary는 *새로운* 릴리즈 채널이 아니며 이전에는 Next라고 불렀습니다. 하지만 Next.js와의 혼동을 피하고자 이름을 변경하기로 했습니다. 공식적으로 지원하는 React 사용 방법인 Canaries와 같은 새로운 기대치를 전달하기 위해 *새로운* 릴리즈 채널로 발표하게 되었습니다.

</Note>

## 안정된 릴리즈는 이전과 동일하게 작동합니다. {/*stable-releases-work-like-before*/}

React 릴리즈에는 어떠한 변경 사항도 도입하지 않습니다.
