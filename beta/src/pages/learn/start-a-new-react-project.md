---
title: 새로운 React 프로젝트 시작하기
---

<Intro>

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

<TerminalBlock>

npx create-react-app my-app

</TerminalBlock>

이제 다음 명령어로 애플리케이션을 실행할 수 있습니다.

<TerminalBlock>

cd my-app
npm start

</TerminalBlock>

자세한 내용은 [공식 가이드](https://create-react-app.docs/getting-started)를 참조하세요.

> Create React App은 데이터베이스나 백엔드 로직을 다루지 않습니다. 단지 프론트엔드 빌드 파이프라인을 생성할 뿐입니다. 즉 원하는 백엔드와 함께 사용할 수 있습니다. 그러나 라우팅, 서버 사이드 로직 등의 기능에 대해 더 찾고 있다면 계속 읽어주세요!

### 다른 선택지 {/*other-options*/}

Create React App은 React를 시작하기에 좋지만, 더 가벼운 툴체인을 원한다면 다음과 같은 인기 툴체인 중 하나를 사용해 볼 수 있습니다.

* [Vite](https://vitejs.dev/guide/)
* [Parcel](https://parceljs.org/)
* [Snowpack](https://www.snowpack.dev/tutorials/react)

## React와 프레임워크로 빌드하기 {/*building-with-react-and-a-framework*/}

더 큰 규모의 프로덕션 단계의 프로젝트를 시작하려면 [Next.js](https://nextjs.org/)를 참조하세요. Next.js는 React로 빌드된 정적 및 서버 사이드 렌더링 애플리케이션을 위한 경량 프레임워크입니다. 라우팅, 스타일링 및 서버 사이드 렌더링과 같은 기능이 사전 패키지로 제공되어 프로젝트를 신속하게 실행할 수 있습니다.

[Next.js 공식 가이드](https://nextjs.org/docs/getting-started)와 함께 빌드를 시작하세요

### 또 다른 선택지 {/*other-options-1*/}

* [Gatsby](https://www.gatsbyjs.org/)를 이용하여 React와 GraphQL로 정적 웹사이트를 생성할 수 있습니다.
* [Razzle](https://razzlejs.org/)은 어떤 설정도 요구하지 않는, Next.js보다 유연한 서버 사이드 렌더링 프레임워크입니다.

## 커스텀 툴체인 {/*custom-toolchains*/}

직접 툴체인을 생성 및 설정하고 싶다면, 자바스크립트 빌드 툴체인의 구성을 고려하세요.

* [Yarn](https://yarnpkg.com/)과 [npm](https://www.npmjs.com/)같은 **패키지 매니저**를 사용하여 서드 파티 패키지를 설치, 업데이트 및 관리할 수 있습니다.
* [Webpack](https://webpack.js.org/), [Snowpack](https://www.snowpack.dev/), [Parcel](https://parceljs.org/)과 같은 **번들러**를 사용하면 모듈식 코드를 작성하고 이를 작은 패키지로 함께 번들링 하여 로드 시간을 최적화할 수 있습니다
* [Babel](https://babeljs.io/)과 같은 **컴파일러**는 이전 브라우저에서도 최신 자바스크립트 코드를 작동시킵니다.

대규모 프로젝트에서는 단일 저장소에서 여러 패키지를 관리하는 툴이 필요할 수도 있습니다. [Nx](https://nx.dev/react)가 이러한 툴의 예입니다.

자바스크립트 툴체인을 처음부터 만들어보고 싶다면, [Create React App 만들어보기](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658)를 확인해보세요.
