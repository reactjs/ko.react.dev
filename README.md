# ko.react.dev

[![React Korea 디스코드 채널](https://dcbadge.vercel.app/api/server/YXdTyCh5KF)](https://discord.gg/YXdTyCh5KF)

## 한국어 번역 정보

### 가이드

번역 혹은 기여를 진행할 때, 아래 가이드를 따라주세요.

1. [기여 가이드라인<sup>Contributing</sup>](/CONTRIBUTING.md) 및 [기여자 행동 강령 규약<sup>Code of Conduct</sup>](/CODE_OF_CONDUCT.md)을 따르고 있습니다.
1. [공통 스타일 가이드<sup>Universal Style Guide</sup>](/wiki/universal-style-guide.md)를 확인해주세요.
1. [번역을 위한 모범 사례<sup>Best Practices for Translation</sup>](/wiki/best-practices-for-translation.md)를 따라주세요.
1. 공통된 단어 번역을 위해 [번역 용어 정리<sup>Translate Glossary</sup>](/wiki/translate-glossary.md)를 참고해주세요.
1. 끌어오기 요청<sup>Pull Request</sup>시 테스트를 통과하지 못할 경우, [`textlint` 가이드<sup>Textlint Guide</sup>](/wiki/textlint-guide.md)를 참고해주세요.
1. 마지막으로 [맞춤법 검사<sup>Spelling Check</sup>](https://nara-speller.co.kr/speller/)를 진행해주세요.

이 저장소<sup>Repository</sup>는 [ko.react.dev](https://ko.react.dev/)의 소스 코드와 개발 문서를 포함하고 있습니다.

## 시작하기

### 사전 준비

1. Git
1. Node: v16.8.0 이상의 모든 버전
1. Yarn v1(`yarn@1.22.22`): [Yarn 설치 안내](https://yarnpkg.com/lang/en/docs/install/) 참고
1. 포크<sup>Fork</sup>한 개인 저장소
1. 로컬에 클론<sup>Clone</sup>한 [ko.react.dev 저장소](https://github.com/reactjs/ko.react.dev)

### 설치

1. `cd ko.react.dev`를 실행하여 프로젝트 경로로 이동합니다.
1. `yarn` 명령어를 실행하여 npm 의존성 모듈들을 설치합니다.

### 개발 서버 실행하기

1. `yarn dev` 명령어를 사용하여 개발 서버를 시작합니다. (powered by [Next.js](https://nextjs.org).)
1. `open http://localhost:3000` 명령어를 사용하여 선호하는 브라우저로 접속하세요.

## 기여 방법

### 가이드라인

이 문서는 목적이 다른 여러 섹션으로 나뉩니다. 문장을 추가할 계획이라면, 적절한 섹션에 대한 [기여 가이드라인<sup>Contributing</sup>](/CONTRIBUTING.md)을 숙지하는 것이 도움이 될 것입니다.

### 분기<sup>Branch</sup> 만들기

1. `ko.react.dev` 로컬 저장소에서 `git checkout main`을 실행합니다.
1. `git pull origin main`을 실행하여 최신 코드를 가져올 수 있습니다.
1. `git checkout -b the-name-of-my-branch`를 실행하여 분기<sup>Branch</sup>를 만듭니다. (이때, `the-name-of-my-branch`를 적절한 이름으로 교체.)

### 수정하기

1. ["개발 서버 실행하기"](#개발-서버-실행하기) 부분을 따릅니다.
1. 파일을 저장하고 브라우저에서 확인합니다.
1. `src` 안에 있는 React 컴포넌트가 수정될 경우 hot-reload가 적용됩니다.
1. `content` 안에 있는 마크다운 파일이 수정될 경우 hot-reload가 적용됩니다.
1. 플러그인을 사용하는 경우, `.cache` 디렉토리를 제거한 후 서버를 재시작해야 합니다.

### 수정사항 검사하기

1. 가능하다면, 변경한 부분에 대해서 많이 사용하는 브라우저의 최신 버전에서 시각적으로 제대로 적용되었는지 확인해주세요. (데스크탑과 모바일 모두.)
1. 프로젝트 루트에서 `yarn check-all`을 실행합니다. (이 명령어는 Prettier, ESLint, 그리고 타입 유효성 검사를 진행합니다.)

### 푸시<sup>Push</sup> 하기

1. `git add -A && git commit -m "My message"`를 실행하여 변경한 파일들을 커밋<sup>commit</sup> 해주세요. (이때, `My message` 부분을 `Fix header logo on Android` 같은 커밋 메시지로 교체.)
1. `git push my-fork-name the-name-of-my-branch`
1. [ko.react.dev 저장소](https://github.com/reactjs/ko.react.dev)에서 최근에 푸시된 분기<sup>Branch</sup>를 볼 수 있습니다.
1. 깃허브<sup>GitHub</sup> 지침을 따라주세요.
1. 가능하다면 시각적으로 변화된 부분의 스크린샷을 첨부해주세요. 변경 사항이 깃허브<sup>GitHub</sup>에 푸시<sup>Push</sup>되면 미리보기 빌드가 트리거됩니다.

## 문제 해결하기

`yarn cache-reset` 명령어를 사용하여 로컬 캐시를 초기화합니다.

## 번역

`react.dev` 번역에 흥미가 있다면, [translations.react.dev](https://translations.react.dev/)에서 현재 번역이 얼마나 진행되었는지 확인해주세요.

번역하려는 언어가 아직 진행되지 않았다면, 해당 언어에 대해 새롭게 만들 수 있습니다. [translations.react.dev 저장소](https://github.com/reactjs/translations.react.dev)를 참고해주세요.

## 저작권

위 내용에 대한 저작권은 [react.dev](https://react.dev)가 가지고 있으며, [LICENSE-DOCS.md](/LICENSE-DOCS.md)에서 볼 수 있는 CC-BY-4.0 라이센스를 따릅니다.
