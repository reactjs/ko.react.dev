---
id: static-type-checking
title: Static Type Checking
permalink: docs/static-type-checking.html
---

[Flow](https://flow.org/), [TypeScript](https://www.typescriptlang.org/)와 같은 정적 타입 체커들은 코드 실행 전에 특정한 타입 문제를 찾아냅니다. 또한 자동완성과 같은 기능을 추가하여 개발자의 작업 흐름을 개선하기도 합니다. 이러한 이유로 큰 코드 베이스에서는 `PropTypes`를 사용하는 대신 Flow 혹은 TypeScript를 사용하는 것을 추천해 드립니다.

## Flow {#flow}

[Flow](https://flow.org/)는 JavaScript 코드를 위한 정적 타입 체커입니다. 페이스북에서 개발했으며, 보통 React와 함께 사용합니다. 특별한 타입 문법을 사용하여 변수, 함수 및 React 컴포넌트에 주석을 달 수 있고, 에러를 조기에 발견할 수 있습니다. 기초적인 부분을 더 알아보고 싶다면 [introduction to Flow](https://flow.org/en/docs/getting-started/) 에서 확인할 수 있습니다.

Flow를 사용하기 위해서는 아래 요구 사항을 만족 해야 합니다.

* Flow를 프로젝트 의존성에 추가합니다.
* 컴파일된 코드에서 Flow 문법이 제거되었는지 확인합니다.
* 타입 주석을 추가하고, 타입을 체크하기 위해 Flow를 실행합니다.

이 단계들에 대해 아래에서 자세히 설명해드리겠습니다.

### 프로젝트에 Flow 추가하기 {#adding-flow-to-a-project}

우선, 터미널을 통해 프로젝트 디렉토리로 들어간 뒤 다음 명령어를 실행해주세요.

[Yarn](https://yarnpkg.com/)을 사용한다면

```bash
yarn add --dev flow-bin
```

[npm](https://www.npmjs.com/)을 사용한다면

```bash
npm install --save-dev flow-bin
```

이 명령어를 입력하면 프로젝트에 최신 버전 Flow가 설치됩니다.

이제 터미널을 통해 Flow를 사용하기 위해서 `package.json` 파일의 `"scripts"` 부분에 `"flow"`라고 추가해줍니다.

```js{4}
{
  // ...
  "scripts": {
    "flow": "flow",
    // ...
  },
  // ...
}
```

마지막으로 다음 명령어를 통해 실행시켜줍니다.

[Yarn](https://yarnpkg.com/)을 사용한다면

```bash
yarn run flow init
```

[npm](https://www.npmjs.com/)을 사용한다면

```bash
npm run flow init
```

이 명령어는 Flow 환경설정 파일을 만들어줍니다.

### 컴파일된 코드에서 Flow 문법 제거하기 {#stripping-flow-syntax-from-the-compiled-code}

Flow는 코드 주석을 위한 특별한 문법과 함께 JavaScript 언어를 확장합니다. 하지만 브라우저는 이 문법을 알아차리지 못하기 때문에 컴파일된 JavaScript 번들을 브라우저에 보내기만 하고 끝내서는 안됩니다.

이 작업을 수행하기 위한 방법은 JavaScript를 컴파일하는 데 사용하는 도구에 따라 달라집니다.

#### Create React App {#create-react-app}

프로젝트를 [Create React App](https://github.com/facebookincubator/create-react-app)을 통해 세팅하셨다면, 축하합니다! Flow 주석은 이미 기본적으로 제거되기 때문에 어떠한 작업을 별도로 해줄 필요가 없습니다.

#### Babel {#babel}

>주의
>
>아래 설명은 Create React App 사용자들을 위한 것이 아닙니다. Create React App이 Babel을 사용하기는 하지만, 이미 Flow를 이해하도록 설정되어 있습니다. Create React App을 사용하지 않은 분들만 이 단계를 따라와 주세요.

직접 Babel 설정을 한다면 Flow를 위해 특별한 프리셋을 설치해야합니다.

[Yarn](https://yarnpkg.com/)을 사용한다면

```bash
yarn add --dev @babel/preset-flow
```

[npm](https://www.npmjs.com/)을 사용한다면

```bash
npm install --save-dev @babel/preset-flow
```

설치가 됐다면, `flow` 프리셋을 [Babel configuration](https://babeljs.io/docs/usage/babelrc/)에 추가합니다. 예를 들어 Babel을 `.babelrc` 파일에서 설정한다면, 다음과 같이 할 수 있습니다.

```js{3}
{
  "presets": [
    "@babel/preset-flow",
    "react"
  ]
}
```

이 부분은 코드에 Flow 문법을 사용할 수 있도록 도와줍니다.

>주의
>
>Flow는 `react` 프리셋을 필수적으로 요구하지는 않지만 자주 함께 사용합니다. Flow 자체가 JSX 구문을 이해할 수 있습니다.

#### 다른 빌드 설정들 {#other-build-setups}

Create React App과 Babel을 사용하지 않는다면 [flow-remove-types](https://github.com/flowtype/flow-remove-types)를 사용해서 주석을 제거할 수 있습니다.

### Flow 실행하기 {#running-flow}

위의 설명을 잘 따라왔다면, Flow를 바로 사용할 수 있습니다.

```bash
yarn flow
```

npm을 사용한다면

```bash
npm run flow
```

다음 같은 메세지가 보여야 합니다.

```
No errors!
✨  Done in 0.17s.
```

### Flow 타입 주석 추가하기 {#adding-flow-type-annotations}

기본적으로 Flow는 다음 주석이 포함된 파일만 체크합니다.

```js
// @flow
```

대체적으로 위 주석은 파일 최상단에 둡니다. 프로젝트의 몇몇 파일에 주석을 추가하고 `yarn flow` 나 `npm run flow` 명령어를 실행하여 Flow가 어떤 문제를 찾아냈는지 확인해보세요.

주석에 상관없이 모든 파일들을 체크하는 [옵션](https://flow.org/en/docs/config/options/#toc-all-boolean)도 있습니다. 이미 존재하는 프로젝트에 적용하는 것은 어렵겠지만 모든 타입을 체크하고자 하는 새로운 프로젝트에는 적합합니다.

이제 모든 준비를 마쳤습니다! Flow에 대해 더 알아보고 싶으시다면 다음 리소스들를 확인해보세요.

* [Flow Documentation: Type Annotations](https://flow.org/en/docs/types/)
* [Flow Documentation: Editors](https://flow.org/en/docs/editors/)
* [Flow Documentation: React](https://flow.org/en/docs/react/)
* [Linting in Flow](https://medium.com/flow-type/linting-in-flow-7709d7a7e969)

## TypeScript {#typescript}

[TypeScript](https://www.typescriptlang.org/)는 Microsoft가 개발한 프로그래밍 언어입니다. JavaScript의 타입 슈퍼셋이며 자체 컴파일러를 가지고 있습니다. 타입 언어이기 때문에 빌드 에러와 버그를 잡을 수 있으며, 이는 앱이 실행되기 훨씬 전입니다. TypeScript를 React와 함께 사용하는 방법에 대해 더 알아보고 싶다면 [여기](https://github.com/Microsoft/TypeScript-React-Starter#typescript-react-starter)에 들어가보세요.

TypeScript를 사용하기 위해서는 아래 요구 사항을 만족해야합니다.
* 프로젝트 의존성에 TypeScript를 추가합니다.
* TypeScript 컴파일러 옵션을 설정합니다.
* 올바른 파일 확장을 사용합니다.
* 사용하는 라이브러리의 정의를 추가합니다.

좀 더 자세히 알아보겠습니다.

### Create React App과 함께 타입스크립트 사용하기{#using-typescript-with-create-react-app}

Create React App 은 타입스크립트를 별도의 설정 없이 사용할 수 있도록 지원해줍니다.

다음 명령어를 실행하면 TypeScript를 지원하는 **새로운 프로젝트**를 생성할 수 있습니다.

```bash
npx create-react-app my-app --typescript
```

또한 **이미 존재하는 Create React App 프로젝트**에도 추가할 수 있습니다. [이 문서](https://facebook.github.io/create-react-app/docs/adding-typescript)에서 확인해보세요.

>주의
>
>Create React App을 사용한다면, **이 페이지의 남은 부분을 넘기셔도 좋습니다.** 아래는 Create React App을 사용하지 않는 사용자들을 위한 설명입니다.


### 프로젝트에 TypeScript 추가하기 {#adding-typescript-to-a-project}
터미널에 다음 명령어를 입력하는 것으로 시작합니다.

[Yarn](https://yarnpkg.com/)을 사용한다면

```bash
yarn add --dev typescript
```

[npm](https://www.npmjs.com/)을 사용한다면

```bash
npm install --save-dev typescript
```

축하합니다! 프로젝트에 가장 최신 버전 TypeScript가 설치되었습니다. TypeScript를 설치하면 `tsc` 명령어에 접근할 수 있습니다. 설정을 하기 전에 `package.json`파일`"script"`부분에 `"tsc"`를 추가해주세요.

```js{4}
{
  // ...
  "scripts": {
    "build": "tsc",
    // ...
  },
  // ...
}
```

### TypeScript 컴파일러 설정하기 {#configuring-the-typescript-compiler}
컴파일러는 무엇을 해야할지 설정해주지 않는다면 아무 도움도 주지 않습니다. TypeScript는 `tsconfig.json`이라는 특별한 파일에 설정을 해야 합니다. 이 파일을 생성하려면 아래의 명령어를 입력해야합니다.

[Yarn](https://yarnpkg.com/)을 사용한다면

```bash
yarn run tsc --init
```

[npm](https://www.npmjs.com/)을 사용한다면

```bash
npx tsc --init
```

생성된 `tsconfig.json`에서 사용할 수 있는 수많은 컴파일러 옵션들을 볼 수 있습니다. 모든 옵션에 대한 자세한 설명은 [여기](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)에서 확인해보세요.

많은 옵션 중에서 `rootDir`와 `outDir`를 살펴보려고 합니다. 실제로 컴파일러는 TypeScript파일을 통해 JavaScript 파일을 생성합니다. 여기서 소스 파일과 생성된 파일간의 혼동을 야기할 수 있습니다.

이를 해결하기 위해 두 단계를 거칩니다.
* 우선 프로젝트 구조를 아래와 같이 정리합니다. 모든 소스코드는 `src` 디렉토리에 위치시킬 것입니다.

```
├── package.json
├── src
│   └── index.ts
└── tsconfig.json
```

* 그 다음, 소스코드가 어디 있는지, 캄파일을 통해 생성된 코드를 어디에 위치시켜야 하는지 컴파일러에 서술합니다.

```js{6,7}
// tsconfig.json

{
  "compilerOptions": {
    // ...
    "rootDir": "src",
    "outDir": "build"
    // ...
  },
}
```

좋습니다! 이제 빌드 스크립트를 실행하면 컴파일러가 생성된 JavaScript를 `build` 폴더에 위치시킬 것입니다. [TypeScript React Starter](https://github.com/Microsoft/TypeScript-React-Starter/blob/master/tsconfig.json)는 시작하기에 좋은 규칙들을 정의한 `tsconfig.json`파일을 제공합니다.

일반적으로 생성된 JavaScript 코드를 소스 관리에 두고 싶어 하지 않습니다. 때문에 `build` 폴더를 `.gitignore` 파일에 추가하도록 합니다.

### 파일 확장자 {#file-extensions}
React에서는 대부분 컴포넌트를 `.js` 파일에 작성합니다. TypeScript에는 두가지 확장자가 있습니다.

`.ts`는 TypeScript 파일 확장자 기본값입니다. 반면에 `.tsx`는 `JSX` 문법이 포함된 코드를 위한 특별한 확장자입니다.

### TypeScript 실행하기 {#running-typescript}

위 설명을 잘 따라왔다면 TypeScript를 즉시 실행할 수 있습니다.

```bash
yarn build
```

npm을 사용한다면

```bash
npm run build
```

터미널에 아무런 출력이 없다면 컴파일이 성공적으로 완료됨을 의미합니다.


### 타입 정의 {#type-definitions}
다른 패키지의 오류와 힌트를 출력하기 위해 컴파일러는 선언 파일에 의존합니다. 선언 파일은 라이브러리에 대한 모든 타입 정보를 제공합니다. 프로젝트의 npm에 라이브러리에 대한 선언파일이 있다면 해당하는 Javascript 라이브러리를 사용할 수 있습니다.

라이브러리에 대한 선언을 가져올 수 있는 방법은 두가지가 있습니다.

__Bundled__ - 라이브러리가 자신의 선언 파일을 번들합니다. 이 후 해야할 일은 그저 라이브러리를 다운받고 올바르게 사용하는 것 밖에 할 일이 없기 때문에 사용자에게 좋습니다. 라이브러리가 번들된 타입을 가지고있는지 확인하려면 프로젝트 내에 `index.d.ts` 파일이 존재하는지 찾아보세요. 어떤 라이브러리는 `package.json` 파일의 `typings` 혹은 `types` 필드 아래에 정의되어 있습니다.

__[DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)__ - DefinitelyTyped는 선언 파일을 번들하지 않은 라이브러리를 위한 거대 저장소입니다. 이 저장소의 선언은 Microsoft와 오픈소스 기여자들에 의해 관리되는 크라우드 소스입니다. 예를 들어 React는 자체 선언 파일을 번들하지 않습니다. 대신 DefinitelyTyped를 통해 다운받을 수 있습니다. 다음 명령어를 터미널에 입력해주세요.

```bash
# yarn
yarn add --dev @types/react

# npm
npm i --save-dev @types/react
```

__Local Declarations__
때때로 사용하고 싶은 패키지가 타입 선언 파일을 번들하지도 않고 DefinitelyTyped에서 제공하지도 않을 수 있습니다. 이러한 경우 로컬 타입 선언 파일을 가질 수 있습니다. 이 방법을 사용하려면 `declarations.d.ts` 파일을 sourse 디렉토리의 루트에 생성합니다. 간단한 선언은 다음과 같이 할 수 있습니다.

```typescript
declare module 'querystring' {
  export function stringify(val: object): string;
  export function parse(val: string): object;
}
```

이제 코드를 작성할 준비를 마쳤습니다! TypeScript에 대해 좀 더 알아보고 싶다면 다음 리소스들을 확인해보세요.

* [TypeScript Documentation: Basic Types](https://www.typescriptlang.org/docs/handbook/basic-types.html)
* [TypeScript Documentation: Migrating from Javascript](https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html)
* [TypeScript Documentation: React and Webpack](https://www.typescriptlang.org/docs/handbook/react-&-webpack.html)

## Reason {#reason}

[Reason](https://reasonml.github.io/)은 새로운 언어가 아닙니다. [OCaml](https://ocaml.org/)을 기반으로한 새로운 문법이자 툴체인입니다. Reason은 JavaScript 개발자들을 위해 익숙한 문법을 OCaml을 통해 제공하며, 익숙한 NPM/Yarn을 그대로 사용 할 수 있습니다.

Reason은 Facebook이 개발했고, 메신저 같은 몇몇 제품에 사용되고 있습니다. 아직은 다소 실험적이지만, Facebook과 [활발한 커뮤니티](https://reasonml.github.io/docs/en/community.html)에 의해 유지되는 [React 전용 바인딩](https://reasonml.github.io/reason-react/)이 있습니다.

## Kotlin {#kotlin}

[Kotlin](https://kotlinlang.org/)은 JetBrains이 개발한 정적 타입 언어입니다. Kotlin의 타깃 플랫폼은 JVM, Android, LLVM, JavaScript입니다.

JetBrains은 React 커뮤니티를 위해 [React bindings](https://github.com/JetBrains/kotlin-wrappers)나 [Create React Kotlin App](https://github.com/JetBrains/create-react-kotlin-app)와 같은 몇몇 도구를 개발, 유지하고 있습니다. Create React Kotlin App은 별다른 빌드 설정 없이 Kotlin으로 React 앱을 개발할 수 있고록 도와줍니다.

## 다른 언어들 {#other-languages}

JavaScript로 컴파일 할 수 있다면 다른 정적 타입 언어들도 React와 호환할 수 있습니다. 예를 들면 [F#/Fable](https://fable.io/)를 기반으로한 [elmish-react](https://elmish.github.io/react)가 있습니다. 자세한 내용은 각 사이트를 참고하세요. 또한 이 페이지에 React에서 사용할 수 있는 정적 타입 언어들을 자유롭게 추가해주세요.
