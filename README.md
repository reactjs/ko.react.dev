# ko.react.dev

[![](https://dcbadge.vercel.app/api/server/YXdTyCh5KF)](https://discord.gg/YXdTyCh5KF)

## 한국어 번역 정보

### 가이드

번역을 진행할 때에 다음의 가이드를 따라주세요.

1. 다음과 같은 [공통 스타일 가이드 확인 (Check the common style guide)](/wiki/universal-style-guide.md)을 따르고 있습니다.
2. [모범 사례 확인 (Check best practices)](/wiki/best-practices-for-translation.md)을 따라주세요.
3. 공통된 단어 번역을 위해 [용어 확인 (Check the term)](/wiki/translate-glossary.md)을 참고해주세요.
4. 끌어오기(Pull Request) 요청 시 테스트를 통과하지 못할 경우 [Textlint 가이드 확인 (Check the textlint guide)](https://github.com/reactjs/ko.react.dev/blob/main/wiki/textlint/what-is-textlint.md)을 참고해주세요.
5. 마지막으로 [맞춤법 검사 (Spelling check)](https://nara-speller.co.kr/speller/)를 진행해주세요.

이 저장소는 [ko.react.dev](https://ko.react.dev/)의 소스 코드와 개발 문서를 포함하고 있습니다.

## 시작하기

### 사전 준비

1. Git
1. Node: v16.8.0 이상의 모든 버전
1. Yarn v1: [Yarn website for installation instructions](https://yarnpkg.com/lang/en/docs/install/) 참고
1. 포크한 개인 저장소
1. 로컬에 클론(Clone)한 [ko.react.dev repo](https://github.com/reactjs/ko.react.dev) 개인 저장소

### 설치

1. `cd ko.react.dev`를 실행하여 프로젝트 경로로 이동합니다.
1. `yarn` 을 이용하여 npm 의존성 모듈들을 설치합니다.

### 개발 서버 실행하기

1. `yarn dev` 명령어를 사용하여 hot-reloading 개발 서버를 시작합니다. (powered by [Next.js](https://nextjs.org))
1. `open http://localhost:3000` 명령어를 사용하여 선호하는 브라우저로 접속하세요.

## 기여 방법

### 가이드라인

이 문서는 목적이 다른 여러 섹션으로 나뉘게 됩니다. 문장을 추가할 계획이라면, 적절한 섹션에 대한 [contributing guidelines](/CONTRIBUTING.md)을 숙지하는 것이 도움이 될 것입니다.

### 브랜치(branch) 만들기

1. `ko.react.dev` 로컬 저장소에서 `git checkout main`을 실행합니다.
1. `git pull origin main`를 실행하여 최신 원본 코드를 보장할 수 있습니다.
1. `git checkout -b the-name-of-my-branch` (`the-name-of-my-branch` 를 적절한 이름으로 교체)를 실행하여 브랜치를 만듭니다.

### 수정하기

1. ["개발 서버 실행하기"](#개발-서버-실행하기) 부분을 따릅니다.
1. 파일을 저장하고 브라우저에서 확인합니다.
1. `src`안에 있는 React 컴포넌트가 수정될 경우 hot-reload가 적용됩니다.
1. `content`안에 있는 마크다운 파일이 수정될 경우 hot-reload가 적용됩니다.
1. 플러그인을 사용하는 경우, `.cache` 디렉토리를 제거한 후 서버를 재시작해야 합니다.

### 수정사항 체크하기

1. 가능하다면, 변경한 부분에 대해서 많이 사용하는 브라우저의 최신 버전에서 시각적으로 제대로 적용되었는지 확인해주세요. (데스크탑과 모바일 모두)
1. 프로젝트 루트에서 `yarn check-all`을 실행합니다. (이 명령어는 Prettier, ESLint, 그리고 타입 검증을 진행합니다.)

### Push 하기

1. `git add -A && git commit -m "My message"` (`My message` 부분을 `Fix header logo on Android` 같은 커밋 메시지로 교체)를 실행하여 변경한 파일들을 commit 해주세요.
1. `git push my-fork-name the-name-of-my-branch`
1. [ko.react.dev repo](https://github.com/reactjs/ko.react.dev)에서 최근에 푸시된 브랜치를 볼 수 있습니다.
1. GitHub 지침을 따라주세요.
1. 가능하다면 시각적으로 변화된 부분의 스크린샷을 첨부해주세요. PR을 만들고 다른사람들이 수정사항을 볼 수 있게되면 자동으로 빌드할 것입니다.

## 문제 해결하기

`yarn cache-reset` 명령어를 사용하여 로컬 캐시를 초기화합니다.

## 번역

`react.dev` 번역에 흥미가 있다면, [translations.react.dev](https://translations.react.dev/)에서 현재 번역이 얼마나 진행되었는지 확인해주세요.

번역하려는 언어가 아직 진행되지 않았다면, 해당 언어에 대해 새롭게 만들 수 있습니다. [translations.react.dev repo](https://github.com/reactjs/translations.react.dev)를 참고해주세요.

## 저작권

위 내용에 대한 저작권은 [react.dev](https://react.dev)가 가지고 있으며, [LICENSE-DOCS.md](/LICENSE-DOCS.md)에서 볼 수 있는 CC-BY-4.0 라이센스를 따릅니다.
