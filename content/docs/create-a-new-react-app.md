---
id: create-a-new-react-app
title: 새로운 리액트 앱 만들기
permalink: docs/create-a-new-react-app.html
redirect_from:
  - "docs/add-react-to-a-new-app.html"
@@ -9,38 +9,55 @@ next: cdn-links.html
---

통합된 툴체인을 사용하여 최고의 유저와 개발자 경험

이 페이지는 밑에있는 일들을 하기위해 도움을줄수있는 몇가지 인기있는 툴체인을 소개합니다:

* 많은 파일과 컴포넨트 스케일링
* 제 3자 npm 라이브러리 사용
* 일반적인 초기실수를 탐지
* CSS및 JS를 개발중에 수정
* 결과물 최적화

이 페이지의 추천하는 툴체인 **시작하기위해 구성할 필요없음**

## 툴체인이 필요하지 않을수있다 {#you-might-not-need-a-toolchain}

위에 같은 문제가 없을경우 혹은 자바스크립트 툴를 잘 사용하지 못할거 같다는 생각이면, [래익트를 플레인 HTML 태그로 추가하기](/docs/add-react-to-a-website.html)를 보세요, 아니면 [JSX](/docs/add-react-to-a-website.html#optional-try-react-with-jsx)를 보세요

이 방법이 **제일 쉽게 React를 이미 만들어진 웹사이트에 추가하는 방법입니다** 그리고 언제나 도움이 될것같으면 더 큰 툴체인을 추가할수있습니다

## 툴체인 추천 {#recommended-toolchains}

리엑트 팀이 추천하는 해결책:

- **리액트를 배우고있다** 혹은 **새로운 [싱글 페이지](/docs/glossary.html#single-page-application) 앱**  
- **서버 랜더링 Node.js 웹사이트를 만들고있다** [Next.js](#nextjs). 
- **고정적인 콘텐츠 지향적 웹사이트를 만들고있다**면 [Gatsby](#gatsby)
- **컴포난트 라이브러리** 혹은 **이미 있는 코트베이스와 통합을한다**면 [융통성있는 툴체인](#more-flexible-toolchains).

### Create React App {#create-react-app}

[Create React App](https://github.com/facebookincubator/create-react-app)는 **리엑트 배우기**에 간편한 환경입니다, 그리고 시작하기에 최고의 방법은 **새로운 [싱글 페이지](/docs/glossary.html#single-page-application)** 입니다.

개발 환경을 설정하고, 최신 자바스크립트를 사용하게 해주며, 좋은 개발 경험과 앱 최적화를 해줍니다. 노드 6혹은 상위 버전 및 npm 5.2혹은 상위 버전이 필요하며 새로운 프로젝트를 만들기 위해서는:

```bash
npx create-react-app my-app
cd my-app
npm start
```

>
>
>첫번째 줄의 'npx' 실수가아니며 [npm 5.2+ 버전의 패키지 실행 툴입니다](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b).

Create React App 은 백앤드 로직이나 데이터베이스를 제어할 수 없습니다. Create React App 은 프론트앤드 빌드 파이프라인만 생성하기 때문에 백앤드를 원하는 대로 사용할 수 있습니다. Create React App은 Babel이나 webpack같은 빌드 도구를 사용하나, 설정 없이도 동작합니다.

프로덕션을 배포할 준비가 되었을 때, npm run build 를 실행하면 build 폴더 안에 제작한 앱의 최적화된 빌드를 생성합니다. [README](https://github.com/facebookincubator/create-react-app#create-react-app-)나 [유저 가이드](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#table-of-contents)에서 더 자세한 사항을 볼 수 있습니다.

### Next.js {#nextjs}

[Next.js](https://nextjs.org/)는 인기있는 경량의 프레임워크로 리액트로 만들어진 **고정적 및 서버 랜더링 어플리케이션** 입니다. 기본적으로 **스타일링 및 라우팅 해결책** 을 가지고 있으며, Node.js를 서버 환경으로 사용하고있다고 생각합니다.

Next.js를 [정식 가이드]https://nextjs.org/learn/)를 보면서 배워보세요


### Gatsby {#gatsby}

[Gatsby](https://www.gatsbyjs.org/)는 **고정적인 웹사이트를**를 React로 만들기에는 최선의 방법입니다. React 컴포넌트를 사용하게 해주지만 미리 랜더링된 HTML과 CSS를 사용하여 제일 빠르게 로드됩니다

Gatsby를 [정식 가이드](https://www.gatsbyjs.org/docs/)와 [스타터 키트](https://www.gatsbyjs.org/docs/gatsby-starters/)를 보면서 배워보세요

### 융통성있는 툴체인 {#more-flexible-toolchains}

밑에있는 툴체인은 조금더 많은 선택과 다루기 쉬운 옵션입니다. 숙련된 유저들에게 추천합니다:

- **[Neutrino](https://neutrinojs.org/)** 는 [webpack](https://webpack.js.org/)의 장점과 리액트의 심플함과 미리 설정된 [앱](https://neutrinojs.org/packages/react/)과 [컴포난트](https://neutrinojs.org/packages/react-components/)를 연합한것입니다
 
- **[nwb](https://github.com/insin/nwb)** 는 리액트 컴포난트를 npm을 사용하여 출판하기에 아주 좋습니다. [새로운 리액트 앱](https://github.com/insin/nwb/blob/master/docs/guides/ReactApps.md#developing-react-apps-with-nwb)을 만들기에도 적절합니다.

- **[Parcel](https://parceljs.org/)** 은 [React과 같이 사용가능하고](https://parceljs.org/recipes.html#react) 빠르고 구성필요없는 웹 애플리케이션 bundle입니다

- **[Razzle](https://github.com/jaredpalmer/razzle)** 은 서버 랜더링 프레임워크며 구성이 필요없지만, Next.js보다 다루기 쉬웁니다

## 툴체인을 집적 만들기 {#creating-a-toolchain-from-scratch}

자바스크립트 build 툴체인은 주로:

* [Yarn](https://yarnpkg.com/) 혹은 [npm](https://www.npmjs.com/)같은 package 매니저는 제 3자 패키지의 방대한 생태계를 활용할 수 있게 하며, 쉽게 설치하고 업데이트 할 수 있게 합니다.

* [webpack](https://webpack.js.org/] 아니면 [Parcel](https://parceljs.org/)같은 **bundler**는 코드를 모듈방식으로 작성할 수 있게 하고 이를 작은 package로 묶어서 로딩 시간을 최적화 할 수 있습니다.

* [Babel](https://babeljs.io/) 같은 **컴파일러**는 최신 자바스크립트코드를 오래된 브라우저에도 실행되게 도와줍니다

자기 자신이 만들은 자바스크립트 툴체인을 원하신다면, [이 가이드를 보세요](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658)

커스텀 툴체인이 제대로 설정되있는지 [잊지 마세요](/docs/optimizing-performance.html#use-the-production-build).
