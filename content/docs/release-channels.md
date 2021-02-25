---
id: release-channels
title: 배포 채널
permalink: docs/release-channels.html
layout: docs
category: installation
prev: cdn-links.html
next: hello-world.html
---

React는 버그 신고, 풀 리퀘스트 요청, [RFCs에 제출](https://github.com/reactjs/rfcs)하기 위해서 번성하고 있는 오픈 소스 커뮤니티에 의존한다. 피드백을 장려하기 위해서 우리는 때때로 배포되지 않은 기능을 포함하고 있는 특정 React 빌드를 공유한다.

> 이 문서는 프레임워크, 라이브러리, 개발자 도구에 관해 작업하는 개발자들과 가장 관련이 있습니다. 주로 React를 사용해서 사용자용 어플리케이션을 빌드하는 개발자는 prerelease 채널에 관해서 걱정할 필요가 없습니다.

React의 각 배포 채널은 하나의 고유한 사용 경우를 위해 설계되었습니다:

- [**Latest**](#latest-channel) 는 안정적이고, 유의적인 React 배포입니다. npm에서 React를 설치할 때 얻는 것입니다. 이것은 이미 당신이 사용하고 있는 채널입니다. **모든 사용자용 애플리케이션을 위해서는 이것을 사용하십시오.**
- [**Next**](#next-channel) 는 React 소스 코드 저장소의 master branch를 추적합니다. 이것을 다음 minor 유의적인 배포를 위한 배포 후보자라고 생각하세요. 이것을 React와 타사 프로젝트 간의 통합 테스트에 사용하십시오.
- [**Experimental**](#experimental-channel) 는 실험용 API 및 stable 배포에서는 사용할 수 없는 기능이 포함됩니다. 이것은 또한 master branch를 추적하지만, 추가 기능 플래그가 켜져 있습니다. 배포하기 전에 배포가 예정된 기능들을 실험하는데 사용하십시오.

모든 배포는 npm에 게시되지만 오직 Latest만 [의미론적 버전 관리](/docs/faq-versioning.html)를 사용합니다. Prereleases는 (Next와 Experimental 채널에 있는 것) 내용의 hash로부터 생성된 버전들을 가집니다, 예: Next를 위한 `0.0.0-1022ee0ec`  와 Experimental을 위한 `0.0.0-experimental-1022ee0ec`.

**사용자용 애플리케이션에 대해 공식적으로 지원되는 배포 채널은 Latest입니다**. Next와 Experimental 배포는 테스트 목적으로만 제공되며 배포 간에 동작이 변경되지 않는다는 보장을 제공하지 않습니다. 그것들은 Latest의 배포에 사용하는 유의적 버전원칙 프로토콜을 따르지 않습니다.

안정적인 배포에 사용하는 것과 동일한 레지스트리에 prereleases를 게시함으로써, 우리는 [unpkg](https://unpkg.com), [CodeSandbox](https://codesandbox.io)와 같은 npm workflow를 지원하는 많은 도구를 이용할 수 있습니다.

### Latest 채널 {#latest-channel}

Latest는 stable React 배포에 사용되는 채널입니다. npm의 `latest` tag에 해당합니다. 실제 사용자들에게 제공되는 모든 React app에 권장되는 채널입니다.

**만약 당신이 어떤 채널을 사용해야 할지 잘 모르겠다면 Latest를 사용해야 합니다.** 만약 당신이 React 개발자라면, 이미 당신은 이것을 사용하고 있을 것입니다.

당신은 Latest로 업데이트가 매우 안정적이다고 기대할 수 있습니다. 버전은 의미론적 버전 정책 체계를 따릅니다. [버전 정책](/docs/faq-versioning.html)에서 안정성 및 incremental migration에 대한 우리의 노력에 대해 배워 보세요.

### Next 채널{#next-channel}

Next 채널은 React 저장소의 master branch를 추적하는 prerelease 채널입니다. 우리는 Latest 채널의 배포 후보로서 Next 채널의 prerelease를 사용합니다. Next 채널을 더 자주 업데이트되는 Latest 채널의 상위 집합으로 생각하면 됩니다.

가장 최신 Next 배포와 가장 최신 Latest 배포 사이의 변화 정도는 두 개의 부 유의적 버전 배포사이의 변화 정도와 거의 같습니다. 그러나, **Next 채널은 유의적 버전 원칙을 따르지 않습니다.** 당신은 Next 채널에서 연속적인 배포 사이의 간헐적 주요 변경사항을 예상해야 합니다.

**사용자용 어플리케이션에서 prereleases를 사용하지 마십시오.**

npm에서 Next에서 배포는 `next` tag와 함께 게시됩니다. 버전은 빌드의 내용의 해시로부터 생성됩니다. 예: `0.0.0-1022ee0ec`.

#### 통합 테스트를 위해 Next 채널을 사용{#using-the-next-channel-for-integration-testing}

Next 채널은 React와 다른 프로젝트 간 통합 테스트를 지원하기 위해 설계되었습니다.

React의 모든 변경사항들은 배포 전에 광범위한 내부 테스트를 거칩니다. 그러나 React 생태계 전체에서 사용되는 무수히 많은 환경과 구성이 있고 우리가 일일이 이 모든 것에 관해 테스트하는 것은 불가능합니다.

만일 당신이 타사 React 프레임워크, 라이브러리, 개발자 도구 또는 유사 인프라 구조 타입 프로젝트의 작성자라면 가장 최근 변화들에 대한 테스트 suite들을 주기적으로 실행하여 사용자들과 React 커뮤니티에 도움을 줄 수 있습니다. 만일 흥미가 있다면, 이 단계를 따르십시오:

- 선호하는 지속적 통합 플랫폼을 사용해서 cron job을 설정하세요. Cron jobs는 [CircleCI](https://circleci.com/docs/2.0/triggers/#scheduled-builds) 와 [Travis CI](https://docs.travis-ci.com/user/cron-jobs/) 모두에서 지원됩니다.
- cron job에서, npm의 `next` 태그를 사용해서 당신의 React 패키지를 Next 채널에서 가장 최신 React 배포로 업데이트하십시오. npm cli를 사용해서:

  ```
  npm update react@next react-dom@next
  ```

  또는 yarn을 사용해서:

  ```
  yarn upgrade react@next react-dom@next
  ```
- 업데이트된 패키지에 대해 테스트 suite를 실행하십시오.
- 모든 것이 통과된다면 최고입니다! 당신은 프로젝트가 다음 minor React 배포와 함께 작동할 것으로 예상 할 수 있습니다.
- 예기치 않은 문제가 발생한 경우  [이슈를 생성](https://github.com/facebook/react/issues)해서 알려주십시오.

이 workflow를 사용하는 프로젝트는 Next.js입니다. (말장난이 아닙니다! 진지하게!) 당신은  [CircleCI configuration](https://github.com/zeit/next.js/blob/c0a1c0f93966fe33edd93fb53e5fafb0dcd80a9e/.circleci/config.yml)을 예를 들어 참조할 수 있습니다.

### Experimental 채널 {#experimental-channel}

Next와 마찬가지로 Experimental 채널은 React 저장소의 master branch를 추적하는 prerelease 채널입니다. Next와 달리, Experimental 배포는 광범위한 배포를 위해 준비되지 않은 추가 기능과 API를 포함합니다.

일반적으로, Next에 대한 업데이트는 Experimental에 대한 해당 업데이트와 함께 동반됩니다. 그것들은 동일한 소스 수정을 기반으로 하지만 다른 기능 플래그 세트를 사용하여 빌드됩니다.

Experimental 배포는 Next 및 Latest 배포와 크게 다를 수 있습니다. **사용자용 어플리케이션에서는 Experimental 배포를 사용하지 마십시오.** 당신은 Experimental 채널에서 배포 사이에 빈번한 주요 변경사항을 예상해야 합니다.

Experimental에서 배포는 npm에서 `experimental` tag와 함께 게시됩니다. 버전은 빌드의 내용으로부터 생성됩니다. 예: `0.0.0-experimental-1022ee0ec`.

#### Experimental 배포에는 무엇이 포함됩니까? {#what-goes-into-an-experimental-release}

Experimental 기능은 더 공적으로 배포될 준비가 되지 않은 기능이며 최종적으로 배포되기 전에 크게 변경될 수 있습니다. 일부 실험은 최종 배포가 절대 되지 않는 경우도 있습니다. — 실험을 하는 이유는 제안된 변경사항의 실행 가능성을 테스트하기 위한 것입니다.

예를 들어서, Hooks를 발표할 때 Experimental 채널이 존재했다면, Latest 채널에서 사용할 수 있기 때문에 몇 주 전에 Hooks를 Experimental 채널에 배포했을 것입니다.

당신은 Experimental에 대해 통합 테스트를 실행하는 것이 유용하다는 것을 알 수도 있습니다. 그것은 당신에게 달려 있습니다. 그러나 Experimental은 Next보다 안정성이 훨씬 떨어집니다. **우리는 Experimental 배포 간의 어떤 안정성을 보장하지 않습니다.**

#### Experimental 기능에 대해 더 배우고 싶다면 어떻게 해야 합니까? {#how-can-i-learn-more-about-experimental-features}

Experimental 기능은 문서화될 수도 있고 되지 않을 수도 있습니다. 일반적으로 실험은 Next 나 Latest로 이동에 가까워지기 전까지 문서화되지 않습니다.

기능이 문서화되지 않는 경우 [RFC](https://github.com/reactjs/rfcs)와 함께 동반될 수 있습니다.

우리는 새로운 실험을 발표할 준비가 되면 [React blog](/blog)에 게시물을 포스팅할 예정이지만, 모든 실험이 포스팅된다는 말은 아닙니다.

당신은 언제든지 우리의 public GitHub 저장소에서 전반적인 변경 사항 목록[history](https://github.com/facebook/react/commits/master)를 참조 할 수 있습니다.
