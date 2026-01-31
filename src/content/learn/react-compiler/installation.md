---
title: 설치
---

<Intro>
이 가이드에서는 React 애플리케이션에 React 컴파일러를 설치하고 설정하는 방법을 알아봅니다.
</Intro>

<YouWillLearn>

* React 컴파일러 설치 방법
* 다양한 빌드 도구를 위한 기본 설정
* 설정이 올바르게 작동하는지 확인하는 방법

</YouWillLearn>

## 필수 조건 {/*prerequisites*/}

React 컴파일러는 React 19에서 가장 잘 작동하도록 설계되었지만, React 17과 18도 지원합니다. [React 버전 호환성](/reference/react-compiler/target)에서 자세히 알아보세요.

## 설치 {/*installation*/}

React 컴파일러를 `devDependency`로 설치합니다.

<TerminalBlock>
npm install -D babel-plugin-react-compiler@latest
</TerminalBlock>

또는 Yarn을 사용하는 경우

<TerminalBlock>
yarn add -D babel-plugin-react-compiler@latest
</TerminalBlock>

또는 pnpm을 사용하는 경우

<TerminalBlock>
pnpm install -D babel-plugin-react-compiler@latest
</TerminalBlock>

## 기본 설정 {/*basic-setup*/}

React 컴파일러는 기본적으로 별도의 설정 없이 작동하도록 설계되었습니다. 하지만 특수한 상황에서 설정이 필요한 경우(예를 들어 React 19 미만 버전을 타깃으로 하는 경우) [컴파일러 옵션 레퍼런스](/reference/react-compiler/configuration)를 참고하세요.

설정 과정은 빌드 도구에 따라 다릅니다. React 컴파일러는 빌드 파이프라인과 통합되는 Babel 플러그인을 포함하고 있습니다.

<Pitfall>
React 컴파일러는 Babel 플러그인 파이프라인에서 **가장 먼저** 실행되어야 합니다. 컴파일러는 적절한 분석을 위해 원본 소스 정보가 필요하므로, 다른 변환보다 먼저 코드를 처리해야 합니다.
</Pitfall>

### Babel {/*babel*/}

`babel.config.js`를 생성하거나 업데이트합니다.

```js {3}
module.exports = {
  plugins: [
    'babel-plugin-react-compiler', // 가장 먼저 실행되어야 합니다!
    // ... 다른 플러그인
  ],
  // ... 다른 설정
};
```

### Vite {/*vite*/}

Vite를 사용하는 경우 `vite-plugin-react`에 플러그인을 추가할 수 있습니다.

```js {3,9}
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
  ],
});
```

또는 Vite용 별도의 Babel 플러그인을 선호하는 경우

<TerminalBlock>
npm install -D vite-plugin-babel
</TerminalBlock>

```js {2,11}
// vite.config.js
import babel from 'vite-plugin-babel';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    babel({
      babelConfig: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
  ],
});
```

### Next.js {/*usage-with-nextjs*/}

자세한 내용은 [Next.js 문서](https://nextjs.org/docs/app/api-reference/next-config-js/reactCompiler)를 참고하세요.

### React Router {/*usage-with-react-router*/}
`vite-plugin-babel`을 설치하고, 컴파일러의 Babel 플러그인을 추가합니다.

<TerminalBlock>
{`npm install vite-plugin-babel`}
</TerminalBlock>

```js {3-4,16}
// vite.config.js
import { defineConfig } from "vite";
import babel from "vite-plugin-babel";
import { reactRouter } from "@react-router/dev/vite";

const ReactCompilerConfig = { /* ... */ };

export default defineConfig({
  plugins: [
    reactRouter(),
    babel({
      filter: /\.[jt]sx?$/,
      babelConfig: {
        presets: ["@babel/preset-typescript"], // TypeScript를 사용하는 경우
        plugins: [
          ["babel-plugin-react-compiler", ReactCompilerConfig],
        ],
      },
    }),
  ],
});
```

### Webpack {/*usage-with-webpack*/}

커뮤니티에서 제공하는 webpack loader는 [여기에서 확인할 수 있습니다](https://github.com/SukkaW/react-compiler-webpack).

### Expo {/*usage-with-expo*/}

Expo 앱에서 React 컴파일러를 활성화하고 사용하는 방법은 [Expo 문서](https://docs.expo.dev/guides/react-compiler/)를 참고하세요.

### Metro (React Native) {/*usage-with-react-native-metro*/}

React Native는 Metro를 통해 Babel을 사용하므로, 설치 방법은 [Babel 사용법](#babel) 섹션을 참고하세요.

### Rspack {/*usage-with-rspack*/}

Rspack 앱에서 React 컴파일러를 활성화하고 사용하는 방법은 [Rspack 문서](https://rspack.dev/guide/tech/react#react-compiler)를 참고하세요.

### Rsbuild {/*usage-with-rsbuild*/}

Rsbuild 앱에서 React 컴파일러를 활성화하고 사용하는 방법은 [Rsbuild 문서](https://rsbuild.dev/guide/framework/react#react-compiler)를 참고하세요.


## ESLint 연동 {/*eslint-integration*/}

React 컴파일러는 최적화할 수 없는 코드를 식별하는 데 도움이 되는 ESLint 규칙을 포함합니다. ESLint 규칙이 오류를 보고하면 컴파일러가 해당 특정 컴포넌트나 Hook의 최적화를 건너뜁니다. 이는 안전합니다. 컴파일러는 코드베이스의 다른 부분을 계속 최적화합니다. 모든 위반 사항을 즉시 수정할 필요는 없습니다. 원하는 속도로 해결하면서 최적화되는 컴포넌트의 수를 점진적으로 늘려가세요.

ESLint 플러그인을 설치합니다.

<TerminalBlock>
npm install -D eslint-plugin-react-hooks@latest
</TerminalBlock>

`eslint-plugin-react-hooks`를 아직 설정하지 않았다면 [readme의 설치 지침](https://github.com/facebook/react/blob/main/packages/eslint-plugin-react-hooks/README.md#installation)을 따르세요. 컴파일러 규칙은 `recommended-latest` 프리셋에서 사용할 수 있습니다.

ESLint 규칙은 다음과 같은 역할을 합니다.
- [React 규칙](/reference/rules) 위반 식별
- 최적화할 수 없는 컴포넌트 표시
- 문제 해결에 도움이 되는 오류 메시지 제공

## 설정 확인 {/*verify-your-setup*/}

설치 후 React 컴파일러가 올바르게 작동하는지 확인합니다.

### React DevTools 확인 {/*check-react-devtools*/}

React 컴파일러에 의해 최적화된 컴포넌트는 React DevTools에서 "Memo ✨" 배지가 표시됩니다.

1. [React Developer Tools](/learn/react-developer-tools) 브라우저 확장 프로그램을 설치합니다.
2. 개발 모드에서 앱을 엽니다.
3. React DevTools를 엽니다.
4. 컴포넌트 이름 옆에 ✨ 이모지가 있는지 확인합니다.

컴파일러가 작동하는 경우
- 컴포넌트에 "Memo ✨" 배지가 React DevTools에 표시됩니다.
- 비용이 큰 계산이 자동으로 메모이제이션됩니다.
- 수동으로 `useMemo`를 사용할 필요가 없습니다.

### 빌드 출력 확인 {/*check-build-output*/}

빌드 출력을 확인하여 컴파일러가 실행되고 있는지 확인할 수도 있습니다. 컴파일된 코드에는 컴파일러가 자동으로 추가하는 자동 메모이제이션 로직이 포함됩니다.

```js
import { c as _c } from "react/compiler-runtime";
export default function MyApp() {
  const $ = _c(1);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = <div>Hello World</div>;
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
}

```

## 문제 해결 {/*troubleshooting*/}

### 특정 컴포넌트 제외하기 {/*opting-out-specific-components*/}

컴파일 후 특정 컴포넌트에서 문제가 발생하면 `"use no memo"` 지시어를 사용하여 일시적으로 해당 컴포넌트를 제외할 수 있습니다.

```js
function ProblematicComponent() {
  "use no memo";
  // 컴포넌트 코드
}
```

이렇게 하면 컴파일러에게 이 특정 컴포넌트의 최적화를 건너뛰도록 지시합니다. 근본적인 문제를 해결한 후 지시어를 제거해야 합니다.

더 많은 문제 해결 도움말은 [디버깅 가이드](/learn/react-compiler/debugging)를 참고하세요.

## 다음 단계 {/*next-steps*/}

React 컴파일러를 설치했으니, 다음 내용을 자세히 알아보세요.

- React 17과 18을 위한 [React 버전 호환성](/reference/react-compiler/target)
- 컴파일러를 사용자 정의하기 위한 [설정 옵션](/reference/react-compiler/configuration)
- 기존 코드베이스를 위한 [점진적 도입 전략](/learn/react-compiler/incremental-adoption)
- 문제 해결을 위한 [디버깅 기법](/learn/react-compiler/debugging)
- React 라이브러리 컴파일을 위한 [라이브러리 컴파일 가이드](/reference/react-compiler/compiling-libraries)
