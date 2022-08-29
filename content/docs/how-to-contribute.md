---
id: how-to-contribute
title: 기여하는 방법
layout: contributing
permalink: docs/how-to-contribute.html
next: codebase-overview.html
redirect_from:
  - "contributing/how-to-contribute.html"
  - "tips/introduction.html"
---

React는 페이스북 최초 오픈소스 프로젝트 중 하나로 매우 활발히 개발하고 있으며 [facebook.com](https://www.facebook.com)의 모든 사용자에게 전달되고 있습니다. 이 프로젝트에 최대한 쉽고 간편하게 기여할 수 있도록 노력하고 있지만, 아직 부족한 상태입니다. 이 문서를 통해 여러분이 프로젝트에 기여하는 절차에 대해 명확하게 인지하고 궁금한 점들을 해결할 수 있기를 바랍니다.

### [행동 강령](https://github.com/facebook/react/blob/main/CODE_OF_CONDUCT.md) {#code-of-conduct}

Facebook은 [Contributor Covenant](https://www.contributor-covenant.org/)를 행동 강령으로 채택했으며 모든 프로젝트 참여자가 준수하기를 기대합니다. [전문](https://github.com/facebook/react/blob/main/CODE_OF_CONDUCT.md)을 읽고 어떤 행동이 허용되고 허용되지 않는지 이해할 수 있습니다.

### 오픈소스 {#open-development}

React에 대한 모든 개발 작업은 [GitHub](https://github.com/facebook/react)에서 이루어집니다. 코어 팀 구성원과 외부 기여자가 모두 동일한 검토 과정을 통해 풀 리퀘스트를 제출합니다.

### 유의적 버전 {#semantic-versioning}

React는 [유의적 버전](https://semver.org/lang/ko/)을 따릅니다. 중요한 버그 수정은 수 버전으로, 핵심적이지 않은 변화나 새로운 기능은 부 버전으로 그리고 호환성이 유지되지 않는 변경은 주 버전으로 배포합니다. 호환성이 유지되지 않는 변경을 만들 때, 부 버전에서 사용을 권장하지 않는 주의 메세지를 통해 React를 사용하는 개발자가 다가올 변화를 알아차리고 미리 코드를 변경할 수 있게 합니다. 안정성과 점진적 마이그레이션과 관련된 약속에 대해 [버전 정책](/docs/faq-versioning.html)에서 자세히 알 수 있습니다.

모든 중요한 변화는 [changelog 파일](https://github.com/facebook/react/blob/main/CHANGELOG.md)에 기록되어 있습니다.

### 브랜치 구성 {#branch-organization}

모든 변화는 [`main` 브랜치](https://github.com/facebook/react/tree/main)로 제출해주세요. 개발이나 다가오는 배포를 위해 따로 브랜치를 관리하지는 않습니다.

`main`에 반영된 코드는 가장 최근의 안정된 배포와 반드시 호환돼야 합니다. 추가적인 기능을 포함할 수 있지만, 호환되지 않는 변화는 포함되면 안 됩니다. 언제든 `main`의 가장 최근 커밋으로부터 새로운 부 버전을 배포할 수 있어야 합니다.

### Feature Flags {#feature-flags}

`main` 브랜치를 배포 가능한 상태로 유지하기 위해, 호환되지 않는 변화나 실험적인 기능은 feature flag를 통해 활성화 유무를 관리할 수 있어야 합니다.

Feature flag는 [`packages/shared/ReactFeatureFlags.js`](https://github.com/facebook/react/blob/main/packages/shared/ReactFeatureFlags.js)에 정의되어 있습니다. React의 몇 가지 빌드는 서로 다른 feature flag 조합을 가질 수 있습니다. 예를 들어, React Native 빌드는 React DOM과 다르게 구성됩니다. 이러한 flag는 [`packages/shared/forks`](https://github.com/facebook/react/tree/main/packages/shared/forks)에서 찾을 수 있습니다. Feature flag는 Flow에 의해 정적으로 타입 추론되며, `yarn flow`를 통해 필요한 모든 파일을 변경했는지 확인할 수 있습니다.

React의 빌드 시스템은 배포하기 전에 비활성화된 기능을 제거합니다. CI의 job에서 모든 커밋에 대해 번들 크기 변화를 점검합니다. 크기 변화를 원하는 기능의 활성화 유무가 올바르게 되었는지 확인하는 신호로써 사용할 수 있습니다.

### 버그 {#bugs}

#### 알려진 이슈는 어디서 찾아야 할까요? {#where-to-find-known-issues}

공개 버그 관리에 [GitHub Issues](https://github.com/facebook/react/issues)를 사용하고 있습니다. 이슈에 주의를 기울이고 내부 수정이 진행 중이라면 이슈를 해결하려고 노력합니다. 새로운 이슈를 등록하기 전에, 이미 등록된 이슈가 아닌지 확인해주세요.

#### 새로운 이슈 보고 {#reporting-new-issues}

버그가 발생하는 작은 테스트 케이스를 제공하는 게 버그를 수정하기 위한 가장 좋은 방법입니다. 이때 [JSFiddle 템플릿](https://jsfiddle.net/Luktwrdm/)이 좋은 시작점입니다.

#### 보안 관련 버그 {#security-bugs}

Facebook은 보안 버그를 안전하게 공개하기 위한 [포상금 제도](https://www.facebook.com/whitehat/)가 존재합니다. 이러한 점을 고려해서 보안 관련 버그는 공개 이슈에 문제를 제기하지 말고 이 페이지에 설명된 순서에 따라 진행해 주세요.

### 연락 방법 {#how-to-get-in-touch}

* IRC: [#reactjs on freenode](https://webchat.freenode.net/?channels=reactjs)
* [Discussion forums](/community/support.html#popular-discussion-forums)

또한, React에 대한 도움이 필요한 경우 [Discord 채팅 플랫폼](https://www.reactiflux.com/)에서 React 사용자 커뮤니티를 이용할 수 있습니다.

### 변경 제안 {#proposing-a-change}

Public API를 변경하거나 구현을 간단하게 변경하려 할 때 [이슈를 먼저 제출](https://github.com/facebook/react/issues/new)하길 권장합니다. 수정하려고 많은 노력을 기울이기 전에 제안에 대한 합의에 도달할 수 있도록 해줍니다.

버그만 수정할 경우, 곧바로 풀 리퀘스트를 제출해도 괜찮지만, 여전히 수정하려는 사항을 자세히 설명하는 이슈를 제출하는 것이 좋습니다. 받아들여지지 않은 특정 변화가 있지만, 이슈를 추적하기 원할 때 도움이 됩니다.

### 첫 번째 풀 리퀘스트 {#your-first-pull-request}

풀 리퀘스트를 처음 해보시나요? 무료 영상 시리즈를 통해 다음과 같이 기여하는 방법을 배울 수도 있습니다.

**[GitHub에서 오픈 소스 프로젝트에 기여하는 방법](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)**

처음 발을 디딜 때 기여 과정에 익숙해질 수 있도록 비교적 영향력이 적은 버그를 포함하는 **[good first issues](https://github.com/facebook/react/issues?q=is:open+is:issue+label:"good+first+issue")** 목록은 기여 입문에 최적입니다.

이슈를 해결하려는 경우, 다른 누군가 이미 수정 작업을 진행 중일 수도 있으므로 코멘트 쓰레드를 꼭 확인해 주세요. 아무도 작업하고 있지 않은 경우 다른 사람이 실수로 중복 작업을 하지 않도록 작업할 예정이라고 코멘트를 남겨주세요.

누군가 하겠다고 선언한 이슈가 2주 이상 방치된 경우 다른 사람이 넘겨받는 것은 상관없지만 그러한 경우에도 코멘트를 남겨야 합니다.

### 풀 리퀘스트 보내기 {#sending-a-pull-request}

코어 팀은 풀 리퀘스트를 모니터링하고 있습니다. 여러분이 요청한 풀 리퀘스트를 리뷰, 병합, 변경 요청을 하거나 설명과 함께 풀 리퀘스트를 닫을 것입니다. Facebook.com 내부에서 사용법 검토가 필요한 API 변경은 시간이 더 걸릴 수 있습니다. 코어 팀은 프로세스 전반에 걸쳐 최신 정보 업데이트와 피드백을 제공하도록 최선을 다할 것입니다.

**풀 리퀘스트를 보내기 전에,** 다음 사항을 확인해 주세요.

1. [저장소](https://github.com/facebook/react)를 포크하고 `main`로부터 새로운 브랜치를 생성합니다.
2. 저장소 루트에서 `yarn` 명령을 실행합니다.
3. 버그를 수정했거나 테스트가 필요한 코드를 추가했다면 테스트를 추가해 주세요.
4. 테스트가 통과하는지 확인해 주세요(`yarn test`). Tip : `yarn test --watch TestName` 명령은 개발할 때 도움이 됩니다.
5. `yarn test --prod` 명령을 실제 환경에서 테스트하기 위해 실행합니다.
6. 디버거가 필요한 경우 `yarn debug-test --watch TestName` 을 실행하고 `chrome://inspect`을 열어 "Inspect"를 누르세요.
7. [prettier](https://github.com/prettier/prettier)로 코드를 포맷하세요. (`yarn prettier`).
8. 코드를 린트하세요 (`yarn lint`). Tip: `yarn linc` 는 변경된 파일만 확인할 수 있습니다.
9. [Flow](https://flowtype.org/) 타입 검사를 실행하세요. (`yarn flow`).
10. 아직 CLA에 서명하지 않았다면, 서명을 완료해주세요.

### Contributor License Agreement (CLA) {#contributor-license-agreement-cla}

제출해주신 풀 리퀘스트를 받아들이기 위해서는 CLA를 완료해주셔야 합니다. 한 번만 하면 되기 때문에 다른 Facebook 오픈 소스 프로젝트에서 이미 완료했다면 이 과정은 필요하지 않습니다. 풀 리퀘스트를 처음 제출한다면 CLA를 완료했다고 알려주세요. 그러면 우리는 GitHub의 사용자 이름을 확인하여 이에 대한 점검을 시행합니다.

**[여기서 CLA를 완료하세요.](https://code.facebook.com/cla)**

### 기여 선행 조건 {#contribution-prerequisites}

<<<<<<< HEAD
* [Node](https://nodejs.org) v8.0.0+과 [Yarn](https://yarnpkg.com/en/) v1.2.0+가 설치되어 있어야 합니다.
* [JDK](https://www.oracle.com/technetwork/java/javase/downloads/index.html)가 설치되어 있어야 합니다.
* `gcc`가 설치되어 있어야 하는 데 필요하다면 컴파일러를 설치하는 게 편합니다. 일부 의존성은 컴파일 과정이 필요할 수 있습니다. OS X에서는 Xcode 커맨드 라인 도구가 도움이 됩니다. Ubuntu에서는 `apt-get install build-essential` 명령으로 필요한 패키지를 설치할 수 있습니다. 다른 Linux 배포판에서도 비슷한 명령으로 작업할 수 있습니다. Windows에서는 몇 가지 추가 단계가 필요할 수 있으므로 자세한 내용은 [`node-gyp` installation instructions](https://github.com/nodejs/node-gyp#installation)를 참조해 주세요.
* Git 사용에 익숙해야 합니다.
=======
* You have [Node](https://nodejs.org) installed at LTS and [Yarn](https://yarnpkg.com/en/) at v1.2.0+.
* You have [JDK](https://www.oracle.com/technetwork/java/javase/downloads/index.html) installed.
* You have `gcc` installed or are comfortable installing a compiler if needed. Some of our dependencies may require a compilation step. On OS X, the Xcode Command Line Tools will cover this. On Ubuntu, `apt-get install build-essential` will install the required packages. Similar commands should work on other Linux distros. Windows will require some additional steps, see the [`node-gyp` installation instructions](https://github.com/nodejs/node-gyp#installation) for details.
* You are familiar with Git.
>>>>>>> ea9e9ab2817c8b7eff5ff60e8fe9b649fd747606

### 개발 워크플로우 {#development-workflow}

React 저장소를 복사한 후 yarn 명령을 사용하면 다음과 같은 여러 명령을 실행할 수 있습니다.

* `yarn lint` 코드 스타일을 점검합니다.
* `yarn linc` 는 `yarn lint`와 비슷하지만, 브랜치에서 변경된 파일만 검사하기 때문에 더 빠릅니다.
* `yarn test` 는 모든 테스트를 실행합니다.
* `yarn test --watch` 대화형 테스트 watcher를 실행합니다.
* `yarn test <pattern>` 은 일치하는 파일 이름으로 테스트를 실행합니다.
* `yarn test --prod` 는 실제 환경에서 테스트를 실행합니다.
* `yarn debug-test` 는 `yarn test`와 비슷하지만, 디버거를 활용합니다. `chrome://inspect`를 열고 "Inspect"를 누르세요.
* `yarn flow` 는 [Flow](https://flowtype.org/) 타입검사를 실행합니다.
* `yarn build` 는 모든 패키지와 함께 `build` 폴더를 만듭니다.
* `yarn build react/index,react-dom/index --type=UMD`는 React와 ReactDOM의 UMD 빌드를 만듭니다.

변경 작업이 이상이 없는지 확인하기 위해 `yarn test`(또는 이것과 비슷한 명령)을 통해 확인해주세요. 직접 수정한 React 빌드를 사용해보는 게 도움이 될 수 있습니다.

우선, `yarn build`를 실행합니다. 이렇게 하면 `build` 폴더에 미리 빌드된 번들 파일이 만들어지고 동시에 `build/packages` 안에 npm 패키지도 준비가 됩니다.

`yarn build react/index,react-dom/index --type=UMD`를 실행하고 `fixtures/packaging/babel-standalone/dev.html`을 실행하는 게 변경을 시도해보는 가장 쉬운 방법입니다. 이 파일은 `build` 폴더의 `react.development.js`를 이미 사용하고 있으므로 변경 사항을 확인할 수 있습니다.

기존 React 프로젝트에서 변경한 내용을 확인하고자 한다면 `build/node_modules/react/umd/react.development.js`, `build/node_modules/react-dom/umd/react-dom.development.js` 또는 다른 빌드 파일을 애플리케이션에 복사하여 안정된 버전 대신 사용할 수 있습니다.

npm을 통해 React를 사용하고 있다면, 의존성에서 `react`와 `react-dom`을 삭제하고 `yarn link`를 사용해서 로컬 `build` 폴더를 가리키게 해주세요. **`빌드할 때 --type=UMD` 대신 `--type=NODE`을 전달해야 한다는 점을 주의해주세요.** 또한 `scheduler` 패키지도 아래처럼 빌드해야 합니다.

```sh
cd ~/path_to_your_react_clone/
yarn build react/index,react/jsx,react-dom/index,scheduler --type=NODE

cd build/node_modules/react
yarn link
cd build/node_modules/react-dom
yarn link

cd ~/path/to/your/project
yarn link react react-dom
```

React 폴더에서 `yarn build`를 실행할 때마다 업데이트된 버전이 프로젝트 `node_modules`에 나타납니다. 그런 다음 프로젝트를 재빌드하여 변경할 수 있습니다.

몇 가지 패키지는 여전히 빠져있을 수 있는데 (예를 들어, 프로젝트에서 `react-dom/server`를 사용하는 경우), 항상 `yarn build`를 통해 전체를 빌드 할 수 있습니다. 옵션 없이 `yarn build`를 실행한다면 많은 시간이 필요합니다.

다만, 풀 리퀘스트에 새로운 기능에 대한 단위 테스트가 포함되어야 합니다.
포함되어야 새로 작성해준 코드를 코어 팀이 미래에 고장 내지 않을 수 있습니다.

### 스타일 가이드 {#style-guide}

[Prettier](https://prettier.io/)라고 불리는 자동 코드 포맷터를 사용합니다. 코드를 변경한 뒤 `yarn prettier`를 실행해주세요.

그러면 linter는 코드에 존재할 수 있는 문제를 잡아냅니다. 단순히 변경한 코드의 스타일을 점검하고 싶을 땐 `yarn linc`를 사용해주세요.

그러나, 아직 linter에서도 점검할 수 없는 스타일이 존재합니다. 모르는 것이 있다면 [Airbnb's Style Guide](https://github.com/airbnb/javascript)에서 적절한 방법을 안내받을 수 있습니다.

### Request for Comments (RFC) {#request-for-comments-rfc}

버그 수정이나 문서 개선을 포함한 많은 변경 사항은 일반적인 GitHub 풀 리퀘스트의 워크플로우를 통해 구현될 수 있고 검토될 수 있습니다.

다만, 일부 변화가 "크고 본질적"이라면, 약간의 설계 프로세스를 거쳐서 React 코어 팀에서 합의를 하도록 요청합니다.

"RFC" (request for comments) 프로세스는 새로운 기능이 프로젝트에 들어가기까지 일관되고 정비된 경로를 제공하는 것을 목적으로 하고 있습니다. [rfcs 저장소](https://github.com/reactjs/rfcs)를 방문해서 기여할 수 있습니다.

### 라이선스 {#license}

React에 기여할 때, 여러분은 그 기여가 MIT 라이선스에 따라 라이선스가 부여되는 것에 동의했다고 간주합니다.

### 다음은 무엇인가요? {#what-next}

[다음 섹션](/docs/codebase-overview.html)을 읽고 코드 구조가 어떻게 구성되어 있는지 확인해보세요.
