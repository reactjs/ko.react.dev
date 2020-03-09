---
id: create-a-new-react-app
title: 새로운 React 앱 만들기
permalink: docs/create-a-new-react-app.html
redirect_from:
  - "docs/add-react-to-a-new-app.html"
prev: add-react-to-a-website.html
next: cdn-links.html
---

최고의 사용자와 개발자 경험을 위해 통합된 툴체인을 사용하세요.

이 페이지에서는 도움이 되는 몇 가지 인기 있는 React 툴체인을 소개합니다.

* 많은 파일과 컴포넌트 스케일링
* 서드파티 npm 라이브러리 사용
* 일반적인 실수를 조기에 발견
* CSS와 JS를 실시간으로 편집
* 프로덕션 코드 최적화

이 페이지에서 추천하는 툴체인은 **시작하는데, 별도의 환경설정이 필요 없습니다.**

## 툴체인이 필요하지 않을 수 있습니다. {#you-might-not-need-a-toolchain}

위에서 설명한 문제를 경험하지 못했거나 아직 Javascript 도구를 사용하는 것이 편하지 않다면, [React를 HTML 페이지에서 일반적인 `<script>` 태그에 추가](/docs/add-react-to-a-website.html)하거나 [JSX](/docs/add-react-to-a-website.html#optional-try-react-with-jsx)를 고려하세요.

이 방법이 **제일 쉽게 React를 이미 만들어진 웹사이트에 추가하는 방법입니다**. 그리고 언제나 도움이 될 것 같으면 더 많은 툴체인을 추가할 수가 있습니다.

## 추천 툴체인 {#recommended-toolchains}

React 팀의 추천 방법은 아래와 같습니다

- **React를 배우고 있거나** 아니면 **새로운 [싱글 페이지](/docs/glossary.html#single-page-application) 앱**을 만들고 싶다면 [Create React App](#create-react-app).
- **서버 렌더링 Node.js 웹사이트를 만들고 있다면** [Next.js](#nextjs)을 시도해보세요.. 
- **고정적인 콘텐츠 지향적 웹사이트를 만들고 있다면** [Gatsby](#gatsby)를 시도해보세요..
- **컴포넌트 라이브러리** 혹은 **이미 있는 코드 베이스에 통합을 한다**면 [더 유연한 툴체인](#more-flexible-toolchains).

### Create React App {#create-react-app}

[Create React App](https://github.com/facebookincubator/create-react-app)은 **React 배우기**에 간편한 환경입니다. 그리고 시작하기에 최고의 방법은 **새로운 [싱글 페이지 애플리케이션](/docs/glossary.html#single-page-application)** 입니다.

<<<<<<< HEAD
이것은 개발 환경을 설정하고, 최신 JavaScript를 사용하게 해주며, 좋은 개발 경험과 프로덕션 앱 최적화를 해줍니다. Node 8.10 혹은 상위 버전 및 npm 5.6 혹은 상위 버전이 필요합니다. 새로운 프로젝트를 만들기 위해 아래의 명령어를 실행합니다.
=======
It sets up your development environment so that you can use the latest JavaScript features, provides a nice developer experience, and optimizes your app for production. You’ll need to have [Node >= 8.10 and npm >= 5.6](https://nodejs.org/en/) on your machine. To create a project, run:
>>>>>>> fb382ccb13e30e0d186b88ec357bb51e91de6504

```bash
npx create-react-app my-app
cd my-app
npm start
```

>주의
>
>첫 번째 줄의 'npx'는 실수가 아니며 [npm 5.2+ 버전의 패키지 실행 도구입니다](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b).

Create React App 은 백 앤드 로직이나 데이터베이스를 제어할 수 없습니다. Create React App 은 프런트 앤드 빌드 파이프라인만 생성하기 때문에 백 앤드를 원하는 대로 사용할 수 있습니다. Create React App는 Babel이나 webpack같은 build 도구를 사용하나, 설정 없이도 동작합니다.

프로덕션을 배포할 준비가 되었을 때, npm run build 를 실행하면 build 폴더 안에 제작한 앱의 최적화된 Build를 생성합니다. [README](https://github.com/facebookincubator/create-react-app#create-react-app-) 나 [사용자 가이드](https://facebook.github.io/create-react-app/)에서 더 자세한 사항을 볼 수 있습니다.

### Next.js {#nextjs}

[Next.js](https://nextjs.org/)는 인기 있는 경량의 프레임워크로 React로 만들어진 **스태틱 서버 렌더링 애플리케이션**입니다. 기본적으로 **스타일링과 라우팅 해결책**을 가지고 있으며, 사용자가 Node.js를 서버 환경으로 사용하고 있다고 생각합니다.

Next.js를 [정식 가이드](https://nextjs.org/learn/)를 보면서 배워보세요.

### Gatsby {#gatsby}

[Gatsby](https://www.gatsbyjs.org/)는 **정적 웹사이트를** React로 만들기에는 최고의 방법입니다. React 컴포넌트를 사용하게 해주지만 미리 렌더링 된 HTML과 CSS를 사용하여 가장 빠르게 로드됩니다.

Gatsby를 [정식 가이드](https://www.gatsbyjs.org/docs/)와 [스타터 키트](https://www.gatsbyjs.org/docs/gatsby-starters/)를 보면서 배워보세요

### 더 유연한 툴체인 {#more-flexible-toolchains}

밑에 있는 툴체인은 조금 더 많은 선택과 다르기 쉬운 옵션입니다. 숙련된 사용자들에게 추천합니다.

- **[Neutrino](https://neutrinojs.org/)는**  [webpack](https://webpack.js.org/)의 장점과 React의 단순함과 미리 설정된 [앱](https://neutrinojs.org/packages/react/)과 [컴포넌트](https://neutrinojs.org/packages/react-components/)를 합친 것입니다.

- **[Parcel](https://parceljs.org/)은** [React와 함께 사용할 수 있고](https://parceljs.org/recipes.html#react) 빠르고 설정이 필요 없는 웹 애플리케이션 bundler입니다.

- **[Razzle](https://github.com/jaredpalmer/razzle)은** 서버 렌더링 프레임워크며 설정이 필요 없지만, Next.js보다 다루기 쉽습니다.

## 툴체인을 직접 만들기 {#creating-a-toolchain-from-scratch}

JavaScript build 툴체인은 주로 아래와 같이 구성되어있습니다

* [Yarn](https://yarnpkg.com/) 혹은 [npm](https://www.npmjs.com/)같은 package 매니저는 서드파티 패키지의 방대한 생태계를 활용할 수 있게 하며, 쉽게 설치하고 업데이트할 수 있게 합니다.

* [webpack](https://webpack.js.org/) 아니면 [Parcel](https://parceljs.org/) 같은 **bundler**는 코드를 모듈방식으로 작성할 수 있게 하고 이를 작은 package로 묶어서 로딩 시간을 최적화할 수 있습니다.

* [Babel](https://babeljs.io/) 같은 **컴파일러**는 최신 JavaScript 코드를 구형 브라우저에도 실행되게 도와줍니다.

 만든 JavaScript 툴체인을 원하신다면, [이 가이드를 보세요](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658).

커스텀 툴체인이 제대로 설정되어 있는지 [잊지 마세요](/docs/optimizing-performance.html#use-the-production-build).
