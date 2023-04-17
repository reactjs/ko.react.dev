<<<<<<< HEAD
# reactjs.org
[![](https://dcbadge.vercel.app/api/server/YXdTyCh5KF)](https://discord.gg/YXdTyCh5KF)

=======
# react.dev

This repo contains the source code and documentation powering [react.dev](https://react.dev/).
>>>>>>> 543c7a0dcaf11e0400a9deb2465190467e272171

이 저장소는 [reactjs.org](https://reactjs.org/)의 소스 코드와 개발 문서를 포함하고 있습니다.

## 한국어 번역 정보
### 가이드

번역을 진행할 때에 다음의 가이드를 따라주세요.

1. 다음과 같은 [공통 스타일 가이드 확인 (Check the common style guide)](https://github.com/reactjs/ko.reactjs.org/blob/master/UNIVERSAL-STYLE-GUIDE.md) 을 따르고 있습니다.
2. [모범사례 확인 (Check best practices)](https://github.com/reactjs/ko.reactjs.org/wiki/Best-practices-for-translation) 를 확인해주세요.
3. 공통된 단어 번역을 위해 [용어 확인 (Check the term)](https://github.com/reactjs/ko.reactjs.org/wiki/Translate-Glossary) 을 참고해주세요.
4. 마지막으로 [맞춤법 검사 (Spelling check)](http://speller.cs.pusan.ac.kr/) 를 진행해주세요.



## 시작하기

### 사전 준비

1. Git
<<<<<<< HEAD
1. Node: 12.0.0 이상으로 시작하는 모든 12.x 버전
1. Yarn v1: [Yarn website for installation instructions](https://yarnpkg.com/lang/en/docs/install/) 참고
1. 포크한 개인 저장소
1. 로컬에 클론(Clone) 한 [reactjs.org repo](https://github.com/reactjs/reactjs.org) 개인 저장소
=======
1. Node: any 12.x version starting with v12.0.0 or greater
1. Yarn: See [Yarn website for installation instructions](https://yarnpkg.com/lang/en/docs/install/)
1. A fork of the repo (for any contributions)
1. A clone of the [react.dev repo](https://github.com/reactjs/react.dev) on your local machine
>>>>>>> 543c7a0dcaf11e0400a9deb2465190467e272171

### 설치

<<<<<<< HEAD
1. `cd reactjs.org`를 실행하여 프로젝트 경로로 이동합니다.
1. `yarn`을 이용하여 npm 의존성 모듈들을 설치합니다.
=======
1. `cd react.dev` to go into the project root
3. `yarn` to install the website's npm dependencies
>>>>>>> 543c7a0dcaf11e0400a9deb2465190467e272171

### 개발 서버 실행하기

<<<<<<< HEAD
1. `yarn dev` 명령어를 사용하여 hot-reloading 개발 서버를 시작합니다. (powered by [Gatsby](https://www.gatsbyjs.org))
1. `open http://localhost:8000` 명령어를 사용하여 선호하는 브라우저로 접속하세요.
=======
1. `yarn dev` to start the development server (powered by [Next.js](https://nextjs.org/))
1. `open http://localhost:3000` to open the site in your favorite browser
>>>>>>> 543c7a0dcaf11e0400a9deb2465190467e272171

## 기여방법

### 가이드라인

<<<<<<< HEAD
이 문서는 목적이 다른 여러 섹션으로 나뉘게 됩니다. 문장을 추가할 계획이라면, 적절한 섹션에 대한 [가이드라인](https://github.com/reactjs/reactjs.org/blob/main/CONTRIBUTING.md#guidelines-for-text)을 숙지하는 것이 도움이 될 것입니다.
=======
The documentation is divided into several sections with a different tone and purpose. If you plan to write more than a few sentences, you might find it helpful to get familiar with the [contributing guidelines](https://github.com/reactjs/react.dev/blob/main/CONTRIBUTING.md#guidelines-for-text) for the appropriate sections.
>>>>>>> 543c7a0dcaf11e0400a9deb2465190467e272171

### 브랜치(branch) 만들기

<<<<<<< HEAD
1. `reactjs.org` 로컬 저장소에서 `git checkout main`를 실행합니다.
1. `git pull origin main`를 실행하여 최신 원본 코드를 보장할 수 있습니다.
1. `git checkout -b the-name-of-my-branch` (`the-name-of-my-branch` 를 적절한 이름으로 교체)를 실행하여 브랜치를 만듭니다.
=======
1. `git checkout main` from any folder in your local `react.dev` repository
1. `git pull origin main` to ensure you have the latest main code
1. `git checkout -b the-name-of-my-branch` (replacing `the-name-of-my-branch` with a suitable name) to create a branch
>>>>>>> 543c7a0dcaf11e0400a9deb2465190467e272171

### 수정하기

1. ["개발 서버 실행하기"](#개발-서버-실행하기) 부분을 따릅니다.
1. 파일을 저장하고 브라우저에서 확인합니다.
    1.`src`안에 있는 React 컴포넌트가 수정될 경우 hot-reload가 적용됩니다.
    1. `content`안에 있는 마크다운 파일이 수정될 경우 hot-reload가 적용됩니다.
    1. 플러그인을 사용하는 경우, `.cache` 디렉토리를 제거한 후 서버를 재시작해야 합니다.

### 수정사항 체크하기

<<<<<<< HEAD
1. 가능하다면, 변경한 부분에 대해서 많이 사용하는 브라우저의 최신 버전에서 시각적으로 제대로 적용되었는지 확인해주세요. (데스크탑과 모바일 모두)
1. 프로젝트 루트에서 `yarn check-all`를 실행합니다. (이 명령어는 Prettier, ESLint, 그리고 Flow를 실행합니다.)
=======
1. If possible, test any visual changes in all latest versions of common browsers, on both desktop and mobile.
2. Run `yarn check-all`. (This will run Prettier, ESLint and validate types.)
>>>>>>> 543c7a0dcaf11e0400a9deb2465190467e272171

### Push 하기

<<<<<<< HEAD
1. `git add -A && git commit -m "My message"` (`My message` 부분을 `Fix header logo on Android` 같은 커밋 메시지로 교체)를 실행하여 변경한 파일들을 commit 해주세요.
1. [reactjs.org repo](https://github.com/reactjs/reactjs.org)에서 최근에 푸시된 브랜치를 볼 수 있습니다.
1. Github 지침을 따라주세요.
1. 가능하다면 시각적으로 변화된 부분의 스크린샷을 첨부해주세요. PR을 만들고 다른사람들이 수정사항을 볼 수 있게되면 자동으로 빌드할 것입니다.
=======
1. `git add -A && git commit -m "My message"` (replacing `My message` with a commit message, such as `Fix header logo on Android`) to stage and commit your changes
1. `git push my-fork-name the-name-of-my-branch`
1. Go to the [react.dev repo](https://github.com/reactjs/react.dev) and you should see recently pushed branches.
1. Follow GitHub's instructions.
1. If possible, include screenshots of visual changes. A preview build is triggered after your changes are pushed to GitHub.
>>>>>>> 543c7a0dcaf11e0400a9deb2465190467e272171

## 번역

<<<<<<< HEAD
`reactjs.org` 번역에 흥미가 있다면, [translations.reactjs.org](https://translations.reactjs.org/)에서 현재 번역이 얼마나 진행되었는지 확인해주세요.


번역하려는 언어가 아직 진행되지 않았다면, 해당 언어에 대해 새롭게 만들 수 있습니다. [reactjs.org Translations](https://github.com/reactjs/reactjs.org-translation#translating-reactjsorg)를 참고해주세요.

## 문제 해결하기

- `yarn reset` 명령어를 사용하여 로컬 캐시를 초기화합니다.


## 저작권
위 내용에 대한 저작권은 [reactjs.org](https://reactjs.org/)가 가지고 있으며, [LICENSE-DOCS.md](LICENSE-DOCS.md)에서 볼 수 있는 CC-BY-4.0 라이센스를 따릅니다.

=======
If you are interested in translating `react.dev`, please see the current translation efforts [here](https://github.com/reactjs/react.dev/issues/4135).

## License
Content submitted to [react.dev](https://react.dev/) is CC-BY-4.0 licensed, as found in the [LICENSE-DOCS.md](https://github.com/reactjs/react.dev/blob/main/LICENSE-DOCS.md) file.
>>>>>>> 543c7a0dcaf11e0400a9deb2465190467e272171
