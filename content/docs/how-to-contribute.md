---
id: how-to-contribute
title: how-to-contribute
layout: contributing
permalink: docs/how-to-contribute.html
next: codebase-overview.html
redirect_from:
  - "contributing/how-to-contribute.html"
  - "tips/introduction.html"
---

React는 페이스북의 첫 번째 오픈소스 프로젝트 중 하나로 매우 활발히 개발하고 있어 [facebook.com] (https://www.facebook.com)의 모든 사람에게 코드를 발송하는 데도 사용하고 있습니다. 우리는 이 프로젝트에 최대한 쉽고 간편하게 기여할 수 있도록 노력하고 있으나 아직 부족한 상태입니다. 이 문서를 읽고 프로젝트 기여의 절차를 알고 궁금증에 대한 의문이 해결되길 바랍니다.

<<<<<<< HEAD

### [행동 수칙](https://code.facebook.com/codeofconduct) {#code-of-conduct}
=======
### [Code of Conduct](https://github.com/facebook/react/blob/master/CODE_OF_CONDUCT.md) {#code-of-conduct}

Facebook has adopted the [Contributor Covenant](https://www.contributor-covenant.org/) as its Code of Conduct, and we expect project participants to adhere to it. Please read [the full text](https://github.com/facebook/react/blob/master/CODE_OF_CONDUCT.md) so that you can understand what actions will and will not be tolerated.
>>>>>>> upstream/master

Facebook을 채용하는 프로젝트 참가자에게 기대하는 행동 수칙이 있습니다. [전문](https://code.facebook.com/codeofconduct)을 읽어보시면 참가자는 어떤 행동을 취하면 좋은지 또, 어떤 행동이 허용되지 않는지 이해할 수 있습니다.

### 오픈-개발 {#open-development}

<<<<<<< HEAD
React에 대한 개발 작업은 모든 [GitHub](https://github.com/facebook/react)에서 이루어집니다. 코어 팀 구성원과 외부 기여자가 모두 같은 검토 과정을 통해 풀 리퀘스트를 보냅니다.

### branch의 구성 {#branch-organization}

우리는 [`master` 브랜치]를 모든 테스트가 통하는 최상의 상태로 유지하기 위해 노력하고 있습니다. 그러나 빠른 개발로 인해 응용 프로그램과 호환이 되지 않을 수도 있고 API를 변경할 수도 있습니다. 따라서 [최신 안정 버전 React](/downloads.html)를 사용하는 것이 좋습니다.

풀 리퀘스트를 보낼 경우 `master` 브랜치와 대조해 주세요. 우리는 메이저 버전의 안정판 branch를 별도로 관리하고 있지만 풀 리퀘스트를 직접 접수하고 있지 않습니다. 대신, master에서 최신의 안정된 메이저 버전을 선별합니다.

### 시멘틱 버전 관리 {#semantic-versioning}

React는 [시멘틱 버전 관리의 원칙](https://semver.org/)을 따릅니다. 버그 수정용 패치 버전, 새로운 기능을 위한 마이너 버전 및 중요한 변경 사항을 위한 메이저 버전을 출시합니다. 우리가 변경 사항을 반영할 때 사용자가 변경에 대해 미리 알고 코드를 이행하기 위해 마이너 버전에서 비추천 경고합니다.

우리는 모든 풀 리퀘스트에 레이블을 지정합니다. 레이블은 변경되는 내용이 [패치](https://github.com/facebook/react/pulls?q=is:open+is:pr+label:semver-patch), [마이너](https://github.com/facebook/react/pulls?q=is:open+is:pr+label:semver-minor), [메이저](https://github.com/facebook/react/pulls?q=is:open+is:pr+label:semver-major) 버전 중에 해당하는지에 따라 달라집니다. 몇 주 단위 패치 버전, 몇 개월 단위 마이너 버전, 그리고 일 년에 1~2회 메이저 버전을 출시합니다.
=======
### Semantic Versioning {#semantic-versioning}

React follows [semantic versioning](https://semver.org/). We release patch versions for critical bugfixes, minor versions for new features or non-essential changes, and major versions for any breaking changes. When we make breaking changes, we also introduce deprecation warnings in a minor version so that our users learn about the upcoming changes and migrate their code in advance. Learn more about our commitment to stability and incremental migration in [our versioning policy](/docs/faq-versioning.html).

Every significant change is documented in the [changelog file](https://github.com/facebook/react/blob/master/CHANGELOG.md).

### Branch Organization {#branch-organization}

Submit all changes directly to the [`master branch`](https://github.com/facebook/react/tree/master). We don't use separate branches for development or for upcoming releases. We do our best to keep `master` in good shape, with all tests passing.

Code that lands in `master` must be compatible with the latest stable release. It may contain additional features, but no breaking changes. We should be able to release a new minor version from the tip of `master` at any time.

### Feature Flags {#feature-flags}

To keep the `master` branch in a releasable state, breaking changes and experimental features must be gated behind a feature flag.

Feature flags are defined in [`packages/shared/ReactFeatureFlags.js`](https://github.com/facebook/react/blob/master/packages/shared/ReactFeatureFlags.js). Some builds of React may enable different sets of feature flags; for example, the React Native build may be configured differently than React DOM. These flags are found in [`packages/shared/forks`](https://github.com/facebook/react/tree/master/packages/shared/forks). Feature flags are statically typed by Flow, so you can run `yarn flow` to confirm that you've updated all the necessary files.

React's build system will strip out disabled feature branches before publishing. A continuous integration job runs on every commit to check for changes in bundle size. You can use the change in size as a signal that a feature was gated correctly.
>>>>>>> upstream/master

중요한 변경은 모두 [changelog file](https://github.com/facebook/react/blob/master/CHANGELOG.md)에 문서화되어 있습니다.

### 버그 {#bugs}

#### 기존의 문제를 알려면 {#where-to-find-known-issues}

우리는 버그 관리에 [GitHub Issues](https://github.com/facebook/react/issues)를 사용하고 있습니다.
GitHub Issues에서 수정 중인 작업이 있는지 확인하고 
새로운 문제를 발견하여 이슈를 보내기 전에 중복되는 것이 없는지 확인해 주세요.

#### 새로운 이슈 보고 {#reporting-new-issues}

오류를 수정하기 위한 방법은 버그가 일어나는지 시험해보고 사례를 제공하는 것입니다. 이때 [JSFiddle 템플릿](https://jsfiddle.net/Luktwrdm/)을 활용하면 좋습니다.


#### 보안 버그 {#security-bugs}

Facebook은 보안 버그의 안전한 공개를 위한 [포상금 제도](https://www.facebook.com/whitehat/)가 존재합니다. 이러한 점을 고려하여 보안 버그는 공개 Issues에 문제를 제기하지 말고 이 페이지에 설명된 순서에 따라 진행해 주세요.

### 연락 방법 {#how-to-get-in-touch}

* IRC: [#reactjs on freenode](https://webchat.freenode.net/?channels=reactjs)
* [Discussion forums](/community/support.html#popular-discussion-forums)

또, React에 대한 도움이 필요한 경우 [Discord 채팅 플랫폼](https://www.reactiflux.com/)에서 React 사용자 커뮤니티를 이용하면 됩니다.

### 변경 제안 {#proposing-a-change}

공용 API를 변경하거나 개인적으로 변경하려는 경우 [문제 제기](https://github.com/facebook/react/issues/new)를 권장합니다. 수정하려는 노력을 기울이기 전에 제안에 대한 협의를 볼 수 있도록 해줍니다. 이슈 제기는 버그 해결과 관련한 수정을 받진 않지만, 버그 추적을 하고 싶은 경우에 도움이 됩니다.

버그를 수정할 경우, 즉시 풀 리퀘스트를 요청해도 되지만 문제 해결에 대한 자세한 이슈를 제출하는 것이 좋습니다. 이슈를 제출하면 해당 수정 사항이 반영되지 않지만, 문제를 추적하는 경우에 유용합니다.

### 첫 번째 풀 리퀘스트 {#your-first-pull-request}

풀 리퀘스트를 처음 해보시나요? 무료 영상 시리즈를 통해 다음과 같이 기여하는 방법을 배울 수도 있습니다.

**[GitHub에서 오픈 소스 프로젝트에 기여하는 방법](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github)**

처음 발을 디딜 때 기여 과정에 익숙해질 수 있도록 비교적 영향력이 적은 버그를 포함하는 **[good first issues](https://github.com/facebook/react/issues?q=is:open+is:issue+label:"good+first+issue")** 목록은 기여 입문에 최적입니다.

이슈를 해결하려는 경우, 다른 누군가 이미 수정 작업을 진행 중 일 수도 있으므로 코멘트 스레드를 꼭 확인해 주세요. 현재 아무도 작업하고 있지 않은 경우 다른 사람이 실수로 중복 작업을 하지 않도록 작업할 예정임을 나타내는 코멘트를 남겨주세요. 

누군가 하겠다고 선언한 이슈가 2주 이상 방치된 경우 그것을 다른 사람이 넘겨받는 것은 상관없지만 그러한 경우에도 코멘트를 남겨야 합니다.

### 풀 리퀘스트 보내기 {#sending-a-pull-request}

코어 팀은 여러분이 요청한 풀 리퀘스트를 리뷰, 병합, 변경 요청을 하거나 설명과 함께 풀 리퀘스트를 닫을 것입니다. 만약, Facebook.com 내부에서 사용법의 검토가 필요한 API 변경에 대해서는 답변의 시간이 더 지연될 수 있습니다. 우리는 프로세스 전반적인 최신 정보 업데이트와 피드백을 제공하도록 최선을 다할 것입니다.

**풀 리퀘스트를 보내기 전에,** 다음 사항을 확인해 주세요.

1. [레포지토리](https://github.com/facebook/react)를 포크 중 `master`로 부터 새로운 브랜치를 생성합니다.

2. 레포지토리 루트에서 `yarn` 명령을 실행합니다.

3. 버그를 수정했거나 테스트가 필요한 코드를 추가했다면 테스트를 추가해 주세요.

4. 테스트가 통과하는 것을 확인해 주세요(`yarn test`). Tip : `yarn test --watch TestName` 명령은 개발 시에 도움이 됩니다.

5. `yarn test-prod` 명령을 실제 환경에서 테스트하기 위해 실행합니다. 이는 `yarn test`와 동일한 옵션을 지원합니다.

6. 디버거가 필요한 경우 `yarn debug-test --watch TestName` 을 실행하고 `chrome://inspect`을 열어 "Inspect"를 누르세요.

7. [prettier](https://github.com/prettier/prettier)로 코드를 포맷하세요. (`yarn prettier`).

8. 코드를 린트하세요 (`yarn lint`). Tip: `yarn linc` 는 변경된 파일만 확인할 수 있습니다.

9. [Flow](https://flowtype.org/)를 실행하세요. (`yarn flow`).

10. 아직 CLA를 완료하지 않은 경우

### Contributor License Agreement (CLA) {#contributor-license-agreement-cla}

풀 리퀘스트를 받기 위해 CLA를 제출하세요. 한 번만 하면 되기 때문에 다른 Facebook 오픈 소스 프로젝트에서 이미 완료했다면 이 과정은 필요하지 않습니다. 처음 풀 리퀘스트를 제출한다면 CLA를 완료했음을 알려주세요. 그러면 우리는 GitHub의 사용자 이름을 확인하여 이에 대한 점검을 시행합니다.

**[여기서 CLA를 완료하세요.](https://code.facebook.com/cla)**

### 기여 선행 조건 {#contribution-prerequisites}

* [Node](https://nodejs.org) v8.0.0과 [Yarn](https://yarnpkg.com/en/) v1.2.0+가 설치되어 있어야 합니다.

* `gcc`가 설치되어 있거나 필요한 경우 컴파일러를 쉽게 설치할 수 있습니다. 일부는 컴파일 단계가 필요할 수도 있으며 OS X에서는 Xcode 커맨드 라인 툴이 도움이 됩니다. Ubuntu에서는 `apt-get install build-essential` 명령으로 필요한 패키지를 설치할 수 있습니다. 다른 Linux 배포판에서도 비슷한 명령으로 작업할 수 있습니다. Windows에서는 몇 가지 추가 단계가 필요할 수 있으므로 자세한 내용은 [`node-gyp` installation instructions](https://github.com/nodejs/node-gyp#installation)를 참조해 주세요.

<<<<<<< HEAD
* Git 사용에 익숙해야 합니다.
=======
* You have [Node](https://nodejs.org) installed at v8.0.0+ and [Yarn](https://yarnpkg.com/en/) at v1.2.0+.
* You have [JDK](https://www.oracle.com/technetwork/java/javase/downloads/index.html) installed.
* You have `gcc` installed or are comfortable installing a compiler if needed. Some of our dependencies may require a compilation step. On OS X, the Xcode Command Line Tools will cover this. On Ubuntu, `apt-get install build-essential` will install the required packages. Similar commands should work on other Linux distros. Windows will require some additional steps, see the [`node-gyp` installation instructions](https://github.com/nodejs/node-gyp#installation) for details.
* You are familiar with Git.
>>>>>>> upstream/master

### 개발 워크플로우 {#development-workflow}

React 레파지토리를 복사한 후 yarn 명령을 사용하면 다음과 같은 여러 명령을 실행할 수 있습니다.

* `yarn lint` 코드 스타일을 체크합니다.

* `yarn linc` 는 `yarn lint`와 비슷하지만, 브랜치에서 변경된 파일만 검사하기 때문에 더 빠릅니다.

* `yarn test` 는 모든 테스트를 실행합니다.

* `yarn test --watch` 대화형 테스트 감시자를 실행합니다.

<<<<<<< HEAD
* `yarn test <pattern>` 은 일치하는 파일 이름으로 테스트를 실행합니다.

* `yarn test-prod` 는 실제 환경에서 테스트를 실행합니다. `yarn test`와 같은 옵션을 지원합니다.

* `yarn debug-test` 는 `yarn test`와 비슷하지만 디버거입니다. `chrome://inspect` 를 열고 "Inspect"를 누르세요.

* `yarn flow` 는 [Flow](https://flowtype.org/) 에 따른 형태를 체크합니다.

* `yarn build` 는 모든 패키지와 함께 `build` 폴더를 만듭니다.

* `yarn build react/index,react-dom/index --type=UMD`는 ReactDOM만의 UMD 빌드를 만듭니다.

변경 작업이 이상이 있는지 확인하기 위해 `yarn test`(또는 이것과 비슷한 명령)을 통해 확인하는 것을 추천드립니다. 실제 프로젝트에서 React 빌드를 사용하는 것도 도움이 될 것입니다.

우선, `yarn build`를 실행합니다. 이렇게 하면 build 폴더에 미리 빌드된 번들 파일이 build 폴더 안에 만들어지고 동시에 `build/packages` 안에 npm패키지도 준비가 됩니다.

변경을 시도하는 가장 쉬운 방법은  `yarn build react/index,react-dom/index --type=UMD` 를 실행하고 `fixtures/packaging/babel-standalone/dev.html`을 여세요. 이 파일은 `build` 폴더의 `react.development.js`를 이미 사용하고 있으므로 변경 사항을 확인할 수 있습니다.

기존 React 프로젝트에서 변경한 내용을 확인하고자 한다면 `build/dist/react.development.js`, `build/dist/react-dom.development.js` 또는 다른 빌드 파일을 애플리케이션에 복사하여 안정판 대신 사용할 수 있습니다. 만약 npm판의 React를 사용하고 있는 경우, 종속성에서 `react`와 `react-dom`을 삭제하고 `yarn link`를 사용하여 로컬 `build` 폴더를 가리키게 하세요.
=======
If you want to try your changes in your existing React project, you may copy `build/dist/react.development.js`, `build/dist/react-dom.development.js`, or any other build products into your app and use them instead of the stable version. 

If your project uses React from npm, you may delete `react` and `react-dom` in its dependencies and use `yarn link` to point them to your local `build` folder. Note that **instead of `--type=UMD` you'll want to pass `--type=NODE` when building**. You'll also need to build the `scheduler` package:
>>>>>>> upstream/master

```sh
cd ~/path_to_your_react_clone/
yarn build react/index,react-dom/index,scheduler --type=NODE

cd build/node_modules/react
yarn link
cd build/node_modules/react-dom
yarn link

cd ~/path/to/your/project
yarn link react react-dom
```

React 폴더에서 `yarn build`를 실행할 때마다 업데이트된 버전이 프로젝트 `node_modules` 에 나타납니다. 그런 다음 프로젝트를 재빌드하여 변경할 수 있습니다.

다만, 풀 리퀘스트에 새로운 기능에 대한 유닛 테스트가 포함되어야 합니다. 이렇게 하면 이후에 여러분의 코드를 어기지 않도록 보장할 수 있습니다.

### 스타일 가이드 {#style-guide}

[Prettier](https://prettier.io/) 라고 불리는 자동 코드 포맷터를 사용합니다. `yarn prettier` 명령 코드를 변경한 후 실행하세요.

그러면 linter는 코드에 존재할 수 있는 문제를 잡아냅니다. 단순히 작성한 코드의 스타일을 체크하고 싶을 땐 `yarn linc`를 사용하세요.

<<<<<<< HEAD
그러나, 아직 linter에서도 체크할 수 없는 스타일이 존재합니다. 모르는 것이 있다면 [Airbnb's Style Guide](https://github.com/airbnb/javascript)에서 적절한 방법을 안내해 줄 것입니다.
=======
If some package is still missing (e.g. maybe you use `react-dom/server` in your project), you can always do a full build with `yarn build`. Note that running `yarn build` without options takes a long time.

We still require that your pull request contains unit tests for any new functionality. This way we can ensure that we don't break your code in the future.
>>>>>>> upstream/master

### 소개 영상 {#introductory-video}

React에 기여하는 방법에 대한 소개를 제공하는 [이 짧은 영상](https://www.youtube.com/watch?v=wUpPsEcGsg8) (26분) 은 관심을 갖고 볼만 합니다.

#### 영상 하이라이트: {#video-highlights}
- [4:12](https://youtu.be/wUpPsEcGsg8?t=4m12s) - 로컬에서 React 시험 및 빌드

- [6:07](https://youtu.be/wUpPsEcGsg8?t=6m7s) - 풀 리퀘스트 생성 및 전송

<<<<<<< HEAD
- [8:25](https://youtu.be/wUpPsEcGsg8?t=8m25s) - 코드 정리

- [14:43](https://youtu.be/wUpPsEcGsg8?t=14m43s) - React npm 레지스트리

- [19:15](https://youtu.be/wUpPsEcGsg8?t=19m15s) - React에 새로운 기능 추가

처음 React에 기여하는 것에 대해 보다 실제적인 개요를 보려면 [이 재미있는 ReactNYC 대화](https://www.youtube.com/watch?v=GWCcZ6fnpn4) 에 들어가 보세요.

=======
>>>>>>> upstream/master
### Request for Comments (RFC) {#request-for-comments-rfc}

버그 수정이나 문서 개선을 포함한 많은 변경 사항은 GitHub 풀 리퀘스트의 워크플로우를 통해 구현 및 검토할 수 있습니다. 

다만, 일부 "실질적"으로 큰 변경은 설계 프로세스와 React 코어 팀의 합의를 거치길 바랍니다.

"RFC" (request for comments) 프로세스는 새로운 기능이 프로젝트에 들어가기까지 일관되고 정비된 경로를 제공하는 것을 목적으로 하고 있습니다. [rfcs 레포지토리](https://github.com/reactjs/rfcs)를 방문하면 기여할 수 있습니다.

### 라이선스 {#license}

React에 기여할 때 여러분은 MIT 라이선스를 허가하는 것에 동의했다고 간주합니다.

### 다음은? {#what-next}

[다음 섹션](/docs/codebase-overview.html)을 읽고 코드 베이스의 구성 방법에 대해 알아보세요.