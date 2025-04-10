---
title: 버전 관리 정책
---

<Intro>
React의 모든 안정적인 빌드는 높은 수준의 테스트를 거치고 유의적 버전<sup>Sementic Versioning, semver</sup>을 따릅니다. React는 또한 실험적인 기능에 대한 초기 피드백을 장려하기 위해 불안정한 릴리스 채널을 제공합니다. 이 페이지에서는 React 릴리스에서 기대할 수 있는 것에 대해 설명합니다.

</Intro>

This versioning policy describes our approach to version numbers for packages such as `react` and `react-dom`. 지난 버전을 확인하려면, [React 버전](/versions) 페이지를 참고해주세요.

## Stable releases {/*stable-releases*/}

Stable React releases (also known as "Latest" release channel) follow [semantic versioning (semver)](https://semver.org/lang/ko/) principles.

버전 번호 **x.y.z**를 사용할 때 다음과 같습니다.

* **치명적인 버그 수정**을 릴리즈할 때는 **패치 릴리즈**를 만들어 **z** 숫자를 변경합니다. (예: 15.6.2에서 15.6.3으로)
* **새로운 기능**이나 **치명적이지 않은 버그 수정**을 릴리즈할 때는 **마이너 릴리즈**를 만들어 **y** 숫자를 변경합니다. (예: 15.6.2에서 15.7.0으로)
* **Breaking Change**를 릴리즈할 때는 **메이저 릴리즈**를 만들어 **x** 숫자를 변경합니다. (예: 15.6.2에서 16.0.0으로)

메이저 릴리즈는 새로운 기능을 포함할 수도 있고, 어떤 릴리즈든 버그 수정을 포함할 수도 있습니다.

마이너 릴리즈는 릴리즈의 가장 흔한 유형입니다.

We know our users continue to use old versions of React in production. If we learn of a security vulnerability in React, we release a backported fix for all major versions that are affected by the vulnerability.

### Breaking changes {/*breaking-changes*/}

Breaking Changes는 모두에게 불편하기에 우리는 메이저 릴리즈의 수를 최소화하려고 노력합니다. 예를 들어, React 15는 2016년 4월에 릴리즈, React 16은 2017년 9월에 릴리즈, React 17은 2020년 10월에 릴리즈되었습니다.

대신, 새로운 기능들을 마이너 버전으로 릴리즈합니다. 이는 마이너 릴리즈가 그 이름이 덜 주목받을지라도 종종 메이저 릴리즈보다 더 흥미로우며 매력적이라는 것을 의미합니다.

### 안정성에 기여하기 {/*commitment-to-stability*/}

시간이 지남에 따라 React를 변경할 때, 새로운 기능을 활용하는 데 필요한 노력을 최소화하려고 노력합니다. 가능한 경우, 오래된 API를 별개의 패키지에 넣는 한이 있더라도 작동하도록 합니다. 예를 들어, [믹스인<sup>Mixin</sup>은 몇 년 동안 권장되지 않았지만](https://legacy.reactjs.org/blog/2016/07/13/mixins-considered-harmful.html) [`create-react-class`를 통해](https://legacy.reactjs.org/docs/react-without-es6.html#mixins) 지금까지 지원하고 있으며, 많은 코드베이스가 이를 안정적인 레거시 코드로 계속 사용하고 있습니다.

100만 명 이상의 개발자가 React를 사용하며 수백만 개의 컴포넌트를 일괄적으로 유지 관리합니다. 페이스북 코드베이스에만 5만개가 넘는 React 컴포넌트가 있습니다. 이는 우리가 새로운 React 버전으로 업그레이드하는 것을 가능한 한 쉽게 만들어야 한다는 것을 의미합니다. 만약 마이그레이션 과정 없이 큰 변화를 만든다면, 사람들은 오래된 버전에 갇히게 될 것입니다. 페이스북에서는 이러한 업그레이드 과정을 테스트합니다. 10명이 되지 않는 저희 팀이 5만 개가 넘는 컴포넌트를 업데이트할 수 있다면, React를 사용하는 사람이라면 누구나 업그레이드를 관리할 수 있을 것입니다. 대부분의 경우, 우리는 컴포넌트 문법을 업그레이드하기 위해 [자동화된 명령문](https://github.com/reactjs/react-codemod)을 작성하고, 이를 오픈소스 릴리즈에 포함해 모두가 사용할 수 있도록 합니다.

### 경고를 활용한 점진적 업그레이드 {/*gradual-upgrades-via-warnings*/}

React의 개발 빌드에는 유용한 경고가 많이 포함되어 있습니다. 가능한 경우, 우리는 미래의 Breaking Change를 위해 경고를 추가합니다. 이 방법을 따르면, 최신 릴리스에서 경고가 없는 앱은 다음 메이저 릴리스와 호환됩니다. 이는 앱을 하나의 컴포넌트씩 업그레이드할 수 있도록 해줍니다.

개발 빌드에서 나타나는 경고는 앱의 런타임 동작에 영향을 미치지 않습니다. 즉, 개발 빌드와 프로덕션 빌드 간 앱이 동일하게 동작할 것이라는 확신을 가질 수 있습니다. 유일한 차이점은 프로덕션 빌드에서 경고가 출력되지 않고 더 효율적이라는 것입니다. (만약 그렇지 않다면, 이슈를 제출해 주세요.)

### 어떤 것들이 Breaking Change로 간주되나요? {/*what-counts-as-a-breaking-change*/}

일반적으로, 다음 변경 사항들은 메이저 버전 번호를 변경하지 *않습니다*.
* **개발 빌드 경고.** 프로덕션 동작에 영향을 미치지 않으므로, 우리는 메이저 버전 사이에 새로운 경고를 추가하거나 기존 경고를 수정할 수 있습니다. 이를 통해 앞으로 다가올 Breaking Change에 대해 안정적으로 경고할 수 있습니다.
* **`unstable_`로 시작하는 API.** 이 API들은 아직 확정되지 않은 실험적 기능들로서 제공됩니다. `unstable_` 접두사를 사용하여 이들을 릴리즈함으로써, 더 빠르게 릴리즈를 반복하고 안정적인 API에 더 빠르게 도달할 수 있습니다.
* **Alpha 버전과 Canary 버전의 React.** 이른 시일 내에 새로운 기능을 테스트하기 위해 Alpha 버전의 React를 제공하지만, Alpha 기간 동안 배운 것을 바탕으로 변경할 수 있는 유연성이 필요합니다. 이러한 버전을 사용하는 경우, 안정적인 릴리즈 이전에 API가 변경될 수 있음을 유의해야 합니다.
* **문서화되지 않은 API와 내부 데이터 구조.** `__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED`나 `__reactInternalInstance$uk43rzhitjg`와 같은 내부 속성 이름에 접근하는 경우, 이에 대한 보장이 없습니다. 당신 스스로 해결해야 합니다.

당신이 골머리를 앓는 것을 바라지 않기에, 이 정책은 실용적으로 설계되었습니다. 만약 이러한 변화를 모두 메이저 버전으로 릴리즈한다면, 더 많은 메이저 버전을 릴리즈하게 되고, 궁극적으로 버전 관리에 대해 커뮤니티에 더 많은 고통을 야기할 것입니다. 이는 우리가 원하는 만큼 React를 빠르게 개선할 수 없다는 것을 의미합니다.

만약 목록에 있는 변경 사항이 커뮤니티에 광범위한 문제를 야기할 것으로 예상된다면, 우리는 점진적인 마이그레이션 과정을 제공하기 위해 최선을 다할 것입니다.

### 마이너 릴리즈가 새로운 기능을 포함하지 않는다면, 왜 패치가 아닌가요? {/*if-a-minor-release-includes-no-new-features-why-isnt-it-a-patch*/}

마이너 릴리즈가 새로운 기능을 포함하지 않을 수 있습니다. [시맨틱 버전에서 허용하듯,](https://semver.org/#spec-item-7) **"[마이너 버전]은 비공개 코드 내에서 중요한 새로운 기능이나 개선 사항이 도입되었을 때 증가할 수 있습니다. 마이너 버전은 패치 레벨 변경을 포함할 수 있습니다."**

그러나, 왜 이러한 릴리즈가 패치로 버전화되지 않는지 의문이 제기됩니다.

이에 대한 해답은 React(또는 다른 소프트웨어)에 대한 어떠한 변경 사항도 얘기치 않은 방식으로 오류가 발생할 위험이 있다는 것입니다. 하나의 버그를 수정하는 패치 릴리즈가 다른 버그를 실수로 야기하는 경우를 상상해 보세요. 이는 개발자들에게만 방해가 되는 것이 아니라, 미래의 패치 릴리즈에 대한 신뢰도를 해칠 것입니다. 특히, 원래의 수정 사항이 실제로는 거의 접하지 못하는 버그를 위한 것이라면 더욱 유감입니다.

우리는 React 릴리스를 버그 없이 유지하는 데에 있어 꽤 좋은 실적을 가지고 있으나, 패치 릴리스는 대부분의 개발자가 부작용 없이 적용할 수 있다고 가정하기 때문에 더 높은 신뢰도를 요구합니다.

이러한 이유로 인해, 패치 릴리즈를 가장 중요한 버그와 보안 취약점에 대해서만 사용합니다.

만약 릴리즈에 내부적인 리팩토링, 구현 세부 사항의 변경, 성능 개선, 작은 버그 수정과 같은 필수적이지 않은 변경 사항이 포함된다면, 새로운 기능이 없어도 마이너 버전을 증가시킵니다.

## 모든 릴리즈 채널 {/*all-release-channels*/}

React는 버그 제출, 풀 리퀘스트 생성, [RFC 제출](https://github.com/reactjs/rfcs)을 위해 활발한 오픈소스 커뮤니티에 의존합니다. 피드백을 장려하기 위해 때때로 릴리즈되지 않은 기능을 포함하는 특별한 빌드를 공유합니다.

<Note>

이 섹션은 프레임워크, 라이브러리, 또는 개발자 도구를 활용해 작업하는 개발자와 가장 관련이 있습니다. 사용자 인터페이스를 구축하는 데에 주로 React를 사용하는 개발자는 릴리즈 채널에 대해 걱정할 필요가 없습니다.

</Note>

각각의 React 릴리즈 채널은 서로 다른 사용 사례를 위해 설계되었습니다.

- [**최신 채널**](#latest-channel)은 안정적인 시맨틱 버전 React 릴리즈를 위한 채널입니다. npm에서 React를 설치할 때 확인할 수 있습니다. 최신 채널은 여러분들이 이미 사용하고 있는 채널입니다. **React를 직접 사용하는 사용자 인터페이스 애플리케이션은 이 채널을 사용합니다.**
- [**카나리 채널**](#canary-channel)은 React 저장소의 메인 브랜치를 따릅니다. 다음 시맨틱 버전 릴리즈를 위한 릴리즈 후보로 간주할 수 있습니다. **[프레임워크나 엄선된 설정에서 고정 버전의 React와 함께 이 채널을 사용할 수 있습니다.](/blog/2023/05/03/react-canaries) 또한 React와 서드파티 프로젝트 간의 통합 테스트를 위해 카나리 채널을 사용할 수 있습니다.**
- [**실험적 채널**](#experimental-channel)은 아직 안정된 릴리즈에 포함되지 않은 실험적인 API와 기능을 포함합니다. 추가적인 기능 플래그를 활성화한 채로 메인 브랜치를 따릅니다. 이 채널을 사용하여 릴리즈되기 전에 새로운 기능을 시도할 수 있습니다.

모든 릴리즈는 npm에 공개되지만, 최신 채널만 시맨틱 버전을 사용합니다. 사전 릴리즈(카나리 채널과 실험적 채널)는 릴리즈의 내용과 커밋 날짜의 해시로부터 생성된 버전을 사용합니다. 예를 들어, 카나리 채널의 경우 `18.3.0-canary-388686f29-20230503`이고, 실험적 채널의 경우 `0.0.0-experimental-388686f29-20230503`입니다.

**최신 채널과 카나리 채널 모두 사용자 인터페이스 애플리케이션을 공식적으로 지원하지만, 기대하는 바는 다릅니다.**

* 최신 채널 릴리즈는 전통적인 시맨틱 버전 모델을 따릅니다.
* 카나리 릴리즈는 [고정 버전](/blog/2023/05/03/react-canaries)이어야 하며, Breaking Changes를 포함할 수 있습니다. 자체적인 릴리즈 일정에 따라 새로운 React 기능과 버그 수정을 점진적으로 릴리즈하고자 하는 엄선된 설정(프레임워크와 같은)을 위해 존재합니다.

실험적 릴리즈는 테스트 목적으로만 제공되며 릴리즈 간에 동작이 변경되지 않는다는 보장을 제공하지 않습니다. 최신 채널 릴리즈에 사용하는 시맨틱 버전 프로토콜을 따르지 않습니다.

사전 릴리즈를 안정된 릴리즈에 사용하는 것과 동일한 레지스트리에 배포함으로써, npm workflow를 지원하는 [unpkg](https://unpkg.com)와 [CodeSandbox](https://codesandbox.io)와 같은 많은 도구를 활용할 수 있습니다.

### 최신 채널 {/*latest-channel*/}

최신 채널은 안정된 React 릴리즈를 위한 채널입니다. npm의 `latest` 태그에 해당합니다. 최신 채널은 실제 사용자들이 사용하게 되는 모든 React 앱에 대한 권장 채널입니다.

**만약 어떤 채널을 사용해야 할지 불확실하다면, 최신 채널을 사용하세요.** 직접적으로 React를 사용하고 있다면, 이미 사용하고 있는 채널일 것입니다. 최신 채널의 업데이트는 매우 안정적이라고 기대할 수 있습니다. [안정적인 릴리즈](#stable-releases)에서 설명했듯, 버전은 시맨틱 버전 프로토콜을 따릅니다.

### 카나리 채널 {/*canary-channel*/}

카나리 채널은 React 저장소의 메인 브랜치를 따르는 사전 릴리즈 채널입니다. 카나리 채널의 릴리즈는 최신 채널의 릴리즈 후보로 간주할 수 있습니다. 카나리 채널은 더 자주 업데이트되는 최신 채널의 상위 집합이라고 생각할 수 있습니다.

가장 최신의 카나리 릴리즈와 가장 최신의 최신 채널 릴리즈 사이의 변경 사항의 정도는 두 마이너 시멘틱 버전 릴리즈 사이의 정도와 비슷합니다. 그러나, **카나리 채널은 시맨틱 버전을 따르지 않습니다.** 카나리 채널의 연속적인 릴리즈 사이에는 때때로 변경 사항이 발생할 수 있습니다.

**[카나리 워크플로우](/blog/2023/05/03/react-canaries)를 따르지 않는 한 사용자 인터페이스 애플리케이션에서 사전 릴리즈를 사용하지 마세요.**

카나리 채널의 릴리즈는 npm에 'canary' 태그와 함께 게시됩니다. 버전은 `18.3.0-canary-388686f29-20230503`와 같이 빌드 내용과 커밋 날짜의 해시로부터 생성됩니다.

#### 통합 테스트를 위해 카나리 채널을 사용하기 {/*using-the-canary-channel-for-integration-testing*/}

카나리 채널은 React와 다른 프로젝트 간의 통합 테스트를 위해 사용할 수 있습니다.

React의 모든 변경 사항은 대중에게 공개되기 전에 광범위한 내부 테스트를 거칩니다. 그러나, React 생태계 전체에서 사용되는 수많은 환경과 설정이 있기 때문에, 모든 환경과 일정을 테스트할 수 없습니다.

만약 당신이 서드파티 React 프레임워크, 라이브러리, 개발자 도구, 또는 유사한 인프라 유형 프로젝트의 저자라면, 최신 변경 사항에 대한 테스트 스위트를 주기적으로 실행함으로써 사용자와 전체 React 커뮤니티를 위해 React를 안정적으로 유지하는 데 도움을 줄 수 있습니다. 만약 관심이 있다면, 다음 단계를 따르세요.

- 선호하는 통합 플랫폼을 사용하여 크론 작업을 설정하세요. 크론 작업은 [CircleCI](https://circleci.com/docs/2.0/triggers/#scheduled-builds)와 [Travis CI](https://docs.travis-ci.com/user/cron-jobs/)에서 모두 지원됩니다.
- 크론 작업 내에서 npm의 `canary` 태그를 사용하여 React 패키지를 카나리 채널의 최신 React 릴리즈로 업데이트하세요. npm cli를 사용하면 다음과 같습니다.
  ```console
  npm update react@canary react-dom@canary
  ```

  또는 yarn을 사용하면 다음과 같습니다.

  ```console
  yarn upgrade react@canary react-dom@canary
  ```
- 업데이트된 패키지에 대해 테스트 스위트를 실행하세요.
- 테스트가 모두 통과하면, 당신의 프로젝트는 다음 마이너 React 릴리즈와 함께 정상 작동할 것입니다.
- 예상치 못한 문제가 발생하면, [이슈를 제출](https://github.com/facebook/react/issues)해 주세요.

Next.js는 이 워크플로우를 사용하는 프로젝트입니다. 예시로 Next.js의 [CircleCI 설정](https://github.com/zeit/next.js/blob/c0a1c0f93966fe33edd93fb53e5fafb0dcd80a9e/.circleci/config.yml)을 참조할 수 있습니다.

### 실험적 채널 {/*experimental-channel*/}

카나리 채널과 마찬가지로 실험적 채널은 React 저장소의 메인 브랜치를 따르는 사전 릴리즈 채널입니다. 카나리 채널과 달리, 실험적 릴리즈에는 더 광범위한 릴리즈를 위해 준비되지 않은 추가 기능과 API가 포함됩니다.

통상적으로, 카나리 채널의 업데이트는 상응하는 실험적 채널의 업데이트를 동반합니다. 같은 소스 버전을 기반으로 하지만, 다른 기능 플래그들을 사용하여 빌드합니다.

실험적 릴리즈는 카나리 채널이나 최신 채널 릴리즈와 크게 다를 수 있습니다. **사용자 인터페이스 애플리케이션에서 실험적 릴리즈를 사용하지 마세요.** 실험적 채널의 릴리즈 사이에는 자주 Breaking Change가 발생할 수 있습니다.

실험적 릴리즈는 npm에 `experimental` 태그와 함께 게시됩니다. 버전은 `0.0.0-experimental-68053d940-20210623`와 같이 빌드 내용과 커밋 날짜의 해시로부터 생성됩니다.

#### 실험적 릴리즈에는 무엇이 포함되나요? {/*what-goes-into-an-experimental-release*/}

실험적 기능은 더 많은 대중에게 공개될 준비가 되지 않은 기능이며, 최종적으로 공개되기 전에 크게 바뀔 수 있습니다. 일부 기능은 결국 공개되지 않을 수도 있습니다. 실험을 하는 이유는 제안된 변경 사항의 실현 가능성을 테스트하기 위해서입니다.

만약 훅이 공개됐을 때 실험적 채널이 존재했다면, 우리는 훅을 최신 채널에 공개하기 전에 실험적 채널에 공개했을 것입니다.

실험적 채널에 대해 통합 테스트를 실행하는 것이 중요하다고 생각할 수 있습니다. 이는 전적으로 당신에게 달려있습니다. 하지만 실험적 채널은 카나리 채널보다도 더 불안정할 수 있습니다. **실험적 릴리즈 간의 어떠한 안정성에 대해서도 보장하지 않습니다.**

#### 실험적 기능에 대해 어떻게 더 알 수 있나요? {/*how-can-i-learn-more-about-experimental-features*/}

실험적 기능은 문서화되지 않았을 수도 있습니다. 일반적으로, 실험적 기능들은 카나리 채널이나 최신 채널에 포함되기 전까지는 문서화되지 않습니다.

문서화되지 않은 기능들은 [RFC](https://github.com/reactjs/rfcs)가 함께 제공될 수 있습니다.

새로운 실험적 기능들이 준비되면 [React 블로그](/blog)에 게시될 것입니다. 그러나, 모든 실험적 기능들을 공개한다는 의미는 아닙니다.

변경 사항에 대한 보다 자세한 내용은 깃허브 저장소의 [커밋 로그](https://github.com/facebook/react/commits/main)에서 확인할 수 있습니다.
