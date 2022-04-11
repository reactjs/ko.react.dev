---
title: 에디터 설정하기
---

<Intro>

적절한 개발환경은 코드의 가독성을 높이며, 개발 속도를 높여줍니다. 심지어 코드를 작성하는 과정에서 버그를 찾아줄 수도 있습니다. 코드 에디터를 설치하는 것이 이번이 처음이거나, 현재 사용하는 에디터의 설정을 개선하고 싶으시다면 몇 가지 추천 사항이 있습니다.

</Intro>

## 에디터 {/*your-editor*/}

[VS Code](https://code.visualstudio.com/)는 현재 가장 많이 사용되는 에디터 중 하나입니다. VS Code에 설치할 수 있는 익스텐션의 종류는 무수히 많으며, Github과 같은 외부 서비스와의 연동도 지원합니다. 아래에 나열된 기능들은 대부분 익스텐션으로 존재하기 때문에 VS Code의 설정은 다양한 방식으로 쉽게 변경할 수 있습니다. 

그 외에도 React 커뮤니티에서는 다음과 같은 에디터들이 흔히 사용됩니다.

<<<<<<< HEAD
* [WebStorm](https://www.jetbrains.com/ko-kr/webstorm/)—JavaScript에 특화되어 만들어진 통합 개발 환경입니다.
* [Sublime Text](https://www.sublimetext.com/)—JSX와 TypeScript 지원, 문법 강조, 자동완성 기능이 내장된 에디터입니다. 
* [Vim](https://www.vim.org/)—개발환경 설정의 변경 및 추가가 용이하며, 모든 종류의 텍스트 작업에 효율적인 텍스트 에디터입니다. 대부분의 UNIX 시스템과 Apple OS X에서 "vi"로 포함되어 있습니다.
=======
* [WebStorm](https://www.jetbrains.com/webstorm/)—an integrated development environment designed specifically for JavaScript.
* [Sublime Text](https://www.sublimetext.com/)—has support for JSX and TypeScript, [syntax highlighting](https://stackoverflow.com/a/70960574/458193) and autocomplete built in.
* [Vim](https://www.vim.org/)—a highly configurable text editor built to make creating and changing any kind of text very efficient. It is included as "vi" with most UNIX systems and with Apple OS X.
>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b

## 에디터 기능 추천 {/*recommended-text-editor-features*/}

이러한 기능들이 기본으로 설정된 에디터들도 있지만, 별도의 익스텐션 추가가 필요한 경우도 존재합니다. 현재 사용 중인 에디터에서 어떠한 기능을 지원하는지 한번 확인해보세요!

### 린팅 {/*linting*/}

코드 린터는 코드를 작성하는 동안 실시간으로 문제를 찾아줌으로써 빠른 문제해결이 가능하도록 도와줍니다. [ESLint](https://eslint.org/)는 많이 사용되고 JavaScript를 위한 오픈소스 린터입니다.

* [React를 위한 추천 설정과 함께 ESLint 설치하기](https://www.npmjs.com/package/eslint-config-react-app) (사전에 [Node](https://nodejs.org/ko/download/current/)가 설치되어있어야 합니다)
* [VS Code의 ESLint를 공식 익스텐션과 통합하기](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

### 포맷팅 {/*formatting*/}

다른 개발자들과 협업할 때 가장 피하고 싶은 것은 [탭 vs 공백](https://www.google.com/search?q=tabs+vs+spaces)에 대한 논쟁일 것입니다. 다행히 [Prettier](https://prettier.io/)를 사용하면 직접 지정해놓은 규칙들에 부합하도록 코드의 형식을 깔끔하게 정리할 수 있습니다. Prettier를 실행하면 모든 탭들은 공백으로 전환될 뿐만 아니라 들여쓰기, 따옴표 형식과 같은 요소들이 전부 설정에 부합하도록 수정될 것입니다. 파일을 저장할 때마다 Prettier가 자동 실행되어 이러한 작업들을 수행해주는 것이 가장 이상적인 설정입니다. 

다음과 같은 단계를 통해 [VS Code의 Prettier 익스텐션](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)을 설치할 수 있습니다.

1. VS Code 실행하기
2. 퀵오픈 사용하기 (`CTRL/CMD + P` 누르기)
3. `ext install esbenp.prettier-vscode`라고 입력하기
4. 엔터 누르기

#### 저장 시점에 포맷팅하기 {/*formatting-on-save*/}

저장할 때마다 코드가 포맷팅되는 것이 가장 이상적일 것입니다. 이러한 설정은 VS Code에 자체적으로 내장되어있습니다! 

1. VS Code에서 `CTRL/CMD + SHIFT + P` 누르기
2. "settings"라고 입력하기
3. 엔터 누르기
4. 검색 창에서 "format on save"라고 입력하기
5. "format on save" 옵션이 제대로 체크되었는지 확인하세요!

> Prettier는 때때로 다른 린터들과 충돌을 일으킬 수도 있습니다. 하지만 일반적으로 다른 린터들과 함께 깔끔하게 병행해서 동작하도록 하는 방법이 존재합니다. 예를 들어 Prettier를 ESLint와 함께 사용하는 경우 [eslint-prettier](https://github.com/prettier/eslint-plugin-prettier) 플러그인을 설치하면 ESLint 규칙으로서 Prettier가 동작하도록 설정할 수 있습니다. 
