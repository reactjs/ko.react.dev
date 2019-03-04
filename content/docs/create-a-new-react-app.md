---
id: create-a-new-react-app
title: Create a New React App
title: 새로운 리액트 앱 만들기
permalink: docs/create-a-new-react-app.html
redirect_from:
  - "docs/add-react-to-a-new-app.html"
@@ -9,38 +9,55 @@ next: cdn-links.html
---

Use an integrated toolchain for the best user and developer experience.
통합된 툴체인을 사용하여 최고의 유저와 개발자

This page describes a few popular React toolchains which help with tasks like:
본 페이지는 밑에있는 일들을 하기위해 도움을줄수있는 몇가지 인기있는 툴체인을 소개합니다

* Scaling to many files and components.
* 많은 파일과 컴포넨트 스케일링
* Using third-party libraries from npm.
* 제 3자 npm 라이브러리 사용
* Detecting common mistakes early.
* 일반적인 초기실수를 탐지
* Live-editing CSS and JS in development.
* CSS및 JS를 개발중에 수정
* Optimizing the output for production.
* 결과물 최적화

The toolchains recommended on this page **don't require configuration to get started**.
본 페이지의 추천하는 툴체인 **시작하기위해 구성할 필요없음**

## You Might Not Need a Toolchain {#you-might-not-need-a-toolchain}
## 툴체인이 필요하지 않을수있다 {#you-might-not-need-a-toolchain}

If you don't experience the problems described above or don't feel comfortable using JavaScript tools yet, consider [adding React as a plain `<script>` tag on an HTML page](/docs/add-react-to-a-website.html), optionally [with JSX](/docs/add-react-to-a-website.html#optional-try-react-with-jsx).

This is also **the easiest way to integrate React into an existing website.** You can always add a larger toolchain if you find it helpful!

## Recommended Toolchains {#recommended-toolchains}
## 툴체인 추천 {#recommended-toolchains}

The React team primarily recommends these solutions:
리엑트 팀이 추천하는 해결책

- If you're **learning React** or **creating a new [single-page](/docs/glossary.html#single-page-application) app,** use [Create React App](#create-react-app).
- **리액트를 배우고있다** 혹은 **새로운 [싱글 페이지](/docs/glossary.html#single-page-application) 앱**  
- If you're building a **server-rendered website with Node.js,** try [Next.js](#nextjs).
- **서버 랜더링 Node.js 웹사이트를 만들고있다** [Next.js](#nextjs). 
- If you're building a **static content-oriented website,** try [Gatsby](#gatsby).
- **고정적인 콘텐츠 지향적 웹사이트를 만들고있다**면 [Gatsby](#gatsby)
- If you're building a **component library** or **integrating with an existing codebase**, try [More Flexible Toolchains](#more-flexible-toolchains).
- **컴포난트 라이브러리** 혹은 **이미 있는 코트베이스와 통합을한다**면 융통성있는 툴체인 {#more-flexible-toolchains}

### Create React App {#create-react-app}

[Create React App](https://github.com/facebookincubator/create-react-app) is a comfortable environment for **learning React**, and is the best way to start building **a new [single-page](/docs/glossary.html#single-page-application) application** in React.
[Create React App](https://github.com/facebookincubator/create-react-app)는 **리엑트 배우기**에 간편한 환경입니다, 그리고 시작하기에 최고의 방법은 **새로운 [싱글 페이지](/docs/glossary.html#single-page-application)** 입니다.

It sets up your development environment so that you can use the latest JavaScript features, provides a nice developer experience, and optimizes your app for production. You’ll need to have Node >= 6 and npm >= 5.2 on your machine. To create a project, run:
개발 환경을 설정하고, 최신 자바스크립트를 사용하게 해주며, 좋은 개발 경험과 앱 최적화를 해줍니다. 노드 6혹은 상위 버전 및 npm 5.2혹은 상위 버전이 필요하며 새로운 프로젝트를 만들기 위해서는:

```bash
npx create-react-app my-app
cd my-app
npm start
```

>Note
>
>`npx` on the first line is not a typo -- it's a [package runner tool that comes with npm 5.2+](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b).

>노트
>
>첫번째 줄의 'npx' 실수가아니며 [npm 5.2+ 버전의 패키지 실행 툴입니다](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b).

Create React App doesn't handle backend logic or databases; it just creates a frontend build pipeline, so you can use it with any backend you want. Under the hood, it uses [Babel](https://babeljs.io/) and [webpack](https://webpack.js.org/), but you don't need to know anything about them.


When you're ready to deploy to production, running `npm run build` will create an optimized build of your app in the `build` folder. You can learn more about Create React App [from its README](https://github.com/facebookincubator/create-react-app#create-react-app-) and the [User Guide](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#table-of-contents).

Create React App 은 백앤드 로직이나 데이터베이스를 제어할 수 없습니다. Create React App 은 프론트앤드 빌드 파이프라인만 생성하기 때문에 백앤드를 원하는 대로 사용할 수 있습니다. Create React App은 Babel이나 webpack같은 빌드 도구를 사용하나, 설정 없이도 동작합니다.

프로덕션을 배포할 준비가 되었을 때, npm run build 를 실행하면 build 폴더 안에 제작한 앱의 최적화된 빌드를 생성합니다. [README](https://github.com/facebookincubator/create-react-app#create-react-app-)나 [유저 가이드](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#table-of-contents)에서 더 자세한 사항을 볼 수 있습니다.

### Next.js {#nextjs}

[Next.js](https://nextjs.org/) is a popular and lightweight framework for **static and server‑rendered applications** built with React. It includes **styling and routing solutions** out of the box, and assumes that you're using [Node.js](https://nodejs.org/) as the server environment.
[Next.js](https://nextjs.org/)는 인기있는 경량의 프레임워크로 리액트로 만들어진 **고정적 및 서버 랜더링 어플리케이션** 입니다. 기본적으로 **스타일링 및 라우팅 해결책** 을 가지고 있으며, Node.js를 서버 환경으로 사용하고있다고 생각합니다.

Learn Next.js from [its official guide](https://nextjs.org/learn/).
Next.js를 [정식 가이드]https://nextjs.org/learn/)를 보면서 배워보세요


### Gatsby {#gatsby}

[Gatsby](https://www.gatsbyjs.org/) is the best way to create **static websites** with React. It lets you use React components, but outputs pre-rendered HTML and CSS to guarantee the fastest load time.
[Gatsby](https://www.gatsbyjs.org/)는 **고정적인 웹사이트를**를 React로 만들기에는 최선의 방법입니다. React 컴포넌트를 사용하게 해주지만 미리 랜더링된 HTML과 CSS를 사용하여 제일 빠르게 로드됩니다

Learn Gatsby from [its official guide](https://www.gatsbyjs.org/docs/) and a [gallery of starter kits](https://www.gatsbyjs.org/docs/gatsby-starters/).

Gatsby를 [정식 가이드](https://www.gatsbyjs.org/docs/)와 [스타터 키트](https://www.gatsbyjs.org/docs/gatsby-starters/)를 보면서 배워보세요

### More Flexible Toolchains {#more-flexible-toolchains}
### 융통성있는 툴체인 {#more-flexible-toolchains}

The following toolchains offer more flexiblity and choice. We recommend them to more experienced users:
밑에있는 툴체인은 조금더 많은 선택과 다루기 쉬운 옵션입니다. 숙련된 유저들에게 추천합니다:

- **[Neutrino](https://neutrinojs.org/)** combines the power of [webpack](https://webpack.js.org/) with the simplicity of presets, and includes a preset for [React apps](https://neutrinojs.org/packages/react/) and [React components](https://neutrinojs.org/packages/react-components/).
- **[Neutrino](https://neutrinojs.org/)** 는 [webpack](https://webpack.js.org/)의 장점과 리액트의 심플함과 미리 설정된 [앱](https://neutrinojs.org/packages/react/)과 [컴포난트](https://neutrinojs.org/packages/react-components/)를 연합한것입니다

- **[nwb](https://github.com/insin/nwb)** is particularly great for [publishing React components for npm](https://github.com/insin/nwb/blob/master/docs/guides/ReactComponents.md#developing-react-components-and-libraries-with-nwb). It [can be used](https://github.com/insin/nwb/blob/master/docs/guides/ReactApps.md#developing-react-apps-with-nwb) for creating React apps, too. 
- **[nwb](https://github.com/insin/nwb)** 는 리액트 컴포난트를 npm을 사용하여 출판하기에 아주 좋습니다. [새로운 리액트 앱](https://github.com/insin/nwb/blob/master/docs/guides/ReactApps.md#developing-react-apps-with-nwb)을 만들기에도 적절합니다.

- **[Parcel](https://parceljs.org/)** is a fast, zero configuration web application bundler that [works with React](https://parceljs.org/recipes.html#react).
- **[Parcel](https://parceljs.org/)** 은 [React과 같이 사용가능하고](https://parceljs.org/recipes.html#react) 빠르고 구성필요없는 웹 애플리케이션 bundle입니다

- **[Razzle](https://github.com/jaredpalmer/razzle)** is a server-rendering framework that doesn't require any configuration, but offers more flexibility than Next.js.
- **[Razzle](https://github.com/jaredpalmer/razzle)** 은 서버 랜더링 프레임워크며 구성이 필요없지만, Next.js보다 다루기 쉬웁니다

## Creating a Toolchain from Scratch {#creating-a-toolchain-from-scratch}
## 툴체인을 집적 만들기 {#creating-a-toolchain-from-scratch}

A JavaScript build toolchain typically consists of:
자바스크립트 툴체인은 주로:

* A **package manager**, such as [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/). It lets you take advantage of a vast ecosystem of third-party packages, and easily install or update them.
* [Yarn](https://yarnpkg.com/) 혹은 [npm](https://www.npmjs.com/)같은 package 매니저는 제 3자 패키지의 방대한 생태계를 활용할 수 있게 하며, 쉽게 설치하고 업데이트 할 수 있게 합니다.

* A **bundler**, such as [webpack](https://webpack.js.org/) or [Parcel](https://parceljs.org/). It lets you write modular code and bundle it together into small packages to optimize load time.
* [webpack](https://webpack.js.org/] 아니면 [Parcel](https://parceljs.org/)같은 **bundler**는 코드를 모듈방식으로 작성할 수 있게 하고 이를 작은 package로 묶어서 로딩 시간을 최적화 할 수 있습니다.

* A **compiler** such as [Babel](https://babeljs.io/). It lets you write modern JavaScript code that still works in older browsers.
* [Babel](https://babeljs.io/) 같은 **컴파일러**는 최신 자바스크립트코드를 오래된 브라우저에도 실행되게 도와줍니다
If you prefer to set up your own JavaScript toolchain from scratch, [check out this guide](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658) that re-creates some of the Create React App functionality.
자기 자신이 만들은 자바스크립트 툴체인을 원하신다면, [이 가이드를 보세요](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658)
Don't forget to ensure your custom toolchain [is correctly set up for production](/docs/optimizing-performance.html#use-the-production-build).
커스텀 툴체인이 제대로 설정되있는지 [잊지 마세요](/docs/optimizing-performance.html#use-the-production-build).
