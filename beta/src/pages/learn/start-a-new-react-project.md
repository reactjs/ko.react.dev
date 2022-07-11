---
title: 새로운 React 프로젝트 시작하기
---

<Intro>

<<<<<<< HEAD
React를 배우길 원하거나 프로젝트에 도입을 고민하고 있다면, [스크립트 태그가 있는 HTML 페이지에 React 추가](/learn/add-react-to-a-website)에서 신속히 시작할 수 있습니다. 프로젝트에 수많은 컴포넌트와 파일들이 필요하다면 아래의 선택지를 고려해보세요!

</Intro>

## 모험을 시작하기 {/*choose-your-own-adventure*/}

React는 UI 코드를 컴포넌트라는 조각으로 나누어 구성할 수 있는 라이브러리입니다. React는 데이터 관리나 라우팅을 담당하지 않기 때문에, 서드 파티 라이브러리나 직접 솔루션을 도입하여 이 문제를 해결할 수 있습니다. 이는 곧 React 프로젝트를 시작할 수 있는 다양한 방법이 있음을 의미합니다.

* **툴체인만으로 최소한의 설정**부터 시작하여, 프로젝트에 필요한 기능을 추가할 수 있습니다.
* 일반적인 기능이 내장되어있는 **특화된 프레임워크**로 시작할 수 있습니다.

이제 막 시작하든, 큰 무언가를 구축하든, 자신만의 툴체인을 제작하든, 이 가이드는 여러분을 올바른 길로 안내합니다.

## React 툴체인으로 시작하기 {/*getting-started-with-a-react-toolchain*/}

React를 처음 시작한다면, React의 기능을 사용해 볼 수 있는 가장 일반적인 방법이자 새로운 단일 페이지의 클라이언트 사이드 애플리케이션을 구축하는 좋은 방법인 [Create React App](https://create-react-app.dev/)을 권장합니다.
Create React App은 React 전용으로 구성된 유연한 툴체인입니다. 툴체인은 다음과 같은 기능이 있습니다.

* 여러 파일 및 컴포넌트로 확장할 수 있습니다.
* npm을 통한 서드 파티 라이브러리 이용이 가능합니다.
* 실수를 조기에 발견합니다.
* 개발환경에서 JS, CSS의 실시간 편집을 지원합니다.
* 프로덕션 결과물을 최적화합니다.

한 줄의 코드로 터미널에서 Creat React App을 빌드할 수 있습니다. (**단, [Node.js](https://nodejs.org/)가 설치되어 있어야 합니다!**)
=======
If you're starting a new project, we recommend to use a toolchain or a framework. These tools provide a comfortable development environment but require a local Node.js installation.

</Intro>

<YouWillLearn>

* How toolchains are different from frameworks
* How to start a project with a minimal toolchain
* How to start a project with a fully-featured framework
* What's inside popular toolchains and frameworks

</YouWillLearn>

## Choose your own adventure {/*choose-your-own-adventure*/}

React is a library that lets you organize UI code by breaking it apart into pieces called components. React doesn't take care of routing or data management. This means there are several ways to start a new React project:

* [Start with an **HTML file and a script tag**.](/learn/add-react-to-a-website) This doesn't require Node.js setup but offers limited features.
* Start with a **minimal toolchain,** adding more features to your project as you go. (Great for learning!)
* Start with an **opinionated framework** that has common features like data fetching and routing built-in.

## Getting started with a minimal toolchain {/*getting-started-with-a-minimal-toolchain*/}

If you're **learning React,** we recommend [Create React App](https://create-react-app.dev/). It is the most popular way to try out React and build a new single-page, client-side application. It's made for React but isn't opinionated about routing or data fetching.

First, install [Node.js](https://nodejs.org/en/). Then open your terminal and run this line to create a project:
>>>>>>> f67fa22cc1faee261f9e22449d90323e26174e8e

<TerminalBlock>

npx create-react-app my-app

</TerminalBlock>

이제 다음 명령어로 애플리케이션을 실행할 수 있습니다.

<TerminalBlock>

cd my-app
npm start

</TerminalBlock>

자세한 내용은 [공식 가이드](https://create-react-app.docs/getting-started)를 참조하세요.

<<<<<<< HEAD
> Create React App은 데이터베이스나 백엔드 로직을 다루지 않습니다. 단지 프론트엔드 빌드 파이프라인을 생성할 뿐입니다. 즉 원하는 백엔드와 함께 사용할 수 있습니다. 그러나 라우팅, 서버 사이드 로직 등의 기능에 대해 더 찾고 있다면 계속 읽어주세요!

### 다른 선택지 {/*other-options*/}

Create React App은 React를 시작하기에 좋지만, 더 가벼운 툴체인을 원한다면 다음과 같은 인기 툴체인 중 하나를 사용해 볼 수 있습니다.
=======
> Create React App doesn't handle backend logic or databases. You can use it with any backend. When you build a project, you'll get a folder with static HTML, CSS and JS. Because Create React App can't take advantage of the server, it doesn't provide the best performance. If you're looking for faster loading times and built-in features like routing and server-side logic, we recommend using a framework instead.

### Popular alternatives {/*popular-alternatives*/}
>>>>>>> f67fa22cc1faee261f9e22449d90323e26174e8e

* [Vite](https://vitejs.dev/guide/)
* [Parcel](https://parceljs.org/)

<<<<<<< HEAD
## React와 프레임워크로 빌드하기 {/*building-with-react-and-a-framework*/}

더 큰 규모의 프로덕션 단계의 프로젝트를 시작하려면 [Next.js](https://nextjs.org/)를 참조하세요. Next.js는 React로 빌드된 정적 및 서버 사이드 렌더링 애플리케이션을 위한 경량 프레임워크입니다. 라우팅, 스타일링 및 서버 사이드 렌더링과 같은 기능이 사전 패키지로 제공되어 프로젝트를 신속하게 실행할 수 있습니다.

[Next.js 공식 가이드](https://nextjs.org/docs/getting-started)와 함께 빌드를 시작하세요

### 또 다른 선택지 {/*other-options-1*/}

* [Gatsby](https://www.gatsbyjs.org/)를 이용하여 React와 GraphQL로 정적 웹사이트를 생성할 수 있습니다.
* [Razzle](https://razzlejs.org/)은 어떤 설정도 요구하지 않는, Next.js보다 유연한 서버 사이드 렌더링 프레임워크입니다.
=======
## Building with a full-featured framework {/*building-with-a-full-featured-framework*/}

If you're looking to **start a production-ready project,** [Next.js](https://nextjs.org/) is a great place to start. Next.js is a popular, lightweight framework for static and server‑rendered applications built with React. It comes pre-packaged with features like routing, styling, and server-side rendering, getting your project up and running quickly. 

The [Next.js Foundations](https://nextjs.org/learn/foundations/about-nextjs) tutorial is a great introduction to building with React and Next.js.

### Popular alternatives {/*popular-alternatives*/}

* [Gatsby](https://www.gatsbyjs.org/)
* [Remix](https://remix.run/)
* [Razzle](https://razzlejs.org/)
>>>>>>> f67fa22cc1faee261f9e22449d90323e26174e8e

## 커스텀 툴체인 {/*custom-toolchains*/}

<<<<<<< HEAD
직접 툴체인을 생성 및 설정하고 싶다면, 자바스크립트 빌드 툴체인의 구성을 고려하세요.
=======
You may prefer to create and configure your own toolchain. A toolchain typically consists of:
>>>>>>> f67fa22cc1faee261f9e22449d90323e26174e8e

* A **package manager** lets you install, update, and manage third-party packages. Popular package managers: [npm](https://www.npmjs.com/) (built into Node.js), [Yarn](https://yarnpkg.com/), [pnpm](https://pnpm.io/).
* A **compiler** lets you compile modern language features and additional syntax like JSX or type annotations for the browsers. Popular compilers: [Babel](https://babeljs.io/), [TypeScript](https://www.typescriptlang.org/), [swc](https://swc.rs/).
* A **bundler** lets you write modular code and bundle it together into small packages to optimize load time. Popular bundlers: [webpack](https://webpack.js.org/), [Parcel](https://parceljs.org/), [esbuild](https://esbuild.github.io/), [swc](https://swc.rs/).
* A **minifier** makes your code more compact so that it loads faster. Popular minifiers: [Terser](https://terser.org/), [swc](https://swc.rs/).
* A **server** handles server requests so that you can render components to HTML. Popular servers: [Express](https://expressjs.com/).
* A **linter** checks your code for common mistakes. Popular linters: [ESLint](https://eslint.org/).
* A **test runner** lets you run tests against your code. Popular test runners: [Jest](https://jestjs.io/).

<<<<<<< HEAD
대규모 프로젝트에서는 단일 저장소에서 여러 패키지를 관리하는 툴이 필요할 수도 있습니다. [Nx](https://nx.dev/react)가 이러한 툴의 예입니다.

자바스크립트 툴체인을 처음부터 만들어보고 싶다면, [Create React App 만들어보기](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658)를 확인해보세요.
=======
If you prefer to set up your own JavaScript toolchain from scratch, [check out this guide](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658) that re-creates some of the Create React App functionality. A framework will usually also provide a routing and a data fetching solution. In a larger project, you might also want to manage multiple packages in a single repository with a tool like [Nx](https://nx.dev/react) or [Turborepo](https://turborepo.org/).

>>>>>>> f67fa22cc1faee261f9e22449d90323e26174e8e
