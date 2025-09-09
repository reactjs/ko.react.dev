---
title: 'React 컴파일러 RC'
author: Lauren Tan and Mofei Zhang
date: 2025/04/21
description: 컴파일러의 첫 번째 릴리즈 후보(Release Candidate, RC)를 공개합니다.
---

2025년 4월 21일, [Lauren Tan](https://x.com/potetotes), [Mofei Zhang](https://x.com/zmofei)

---

<Intro>

React 팀이 새로운 업데이트를 발표합니다.

</Intro>

1. 오늘 공개된 React 컴파일러 RC는 안정화 출시를 위한 준비 단계입니다.
2. `eslint-plugin-react-compiler`를 `eslint-plugin-react-hooks` 에 통합했습니다.
3. swc 지원을 추가했으며 Babel 없는 빌드를 지원하기 위해 oxc와도 협력 중입니다.

---

[React 컴파일러](https://react.dev/learn/react-compiler)는 자동 메모이제이션을 통해 React 앱을 최적화할 수 있도록 도와주는 빌드 툴입니다. 지난해, React Compiler의 [첫 번째 베타](https://react.dev/blog/2024/10/21/react-compiler-beta-release)를 공개했고 많은 피드백과 기여를 받았습니다. 실제로 컴파일러를 도입한 사례들 ([Sanity Studio](https://github.com/reactwg/react-compiler/discussions/33), [Wakelet](https://github.com/reactwg/react-compiler/discussions/52))에서도 성과를 확인했습니다. 그리고 이제 안정화 출시를 향해 나아가고 있습니다.

오늘 컴파일러의 첫 번째 RC (Release Candidate)를 공개합니다. RC는 컴파일러의 안정적이고 최종 버전에 가까운 상태로 프로덕션 환경에서 시도해 볼 수 있습니다.

## 오늘 바로 React 컴파일러 RC 사용해보기 {/*use-react-compiler-rc-today*/}

RC 설치 방법은 다음과 같습니다.

npm

<TerminalBlock>
  {`npm install --save-dev --save-exact babel-plugin-react-compiler@rc`}
</TerminalBlock>

pnpm

<TerminalBlock>
  {`pnpm add --save-dev --save-exact babel-plugin-react-compiler@rc`}
</TerminalBlock>

yarn

<TerminalBlock>
  {`yarn add --dev --exact babel-plugin-react-compiler@rc`}
</TerminalBlock>

RC에서는 React 컴파일러를 프로젝트에 더 쉽게 추가할 수 있도록 개선했고, 메모이제이션을 생성하는 방식을 최적화했습니다. 이제 옵셔널 체이닝과 배열 인덱스를 의존성으로 지원합니다. 동등성 검사나 문자열 보간 같은 더 다양한 의존성 추론 방법도 연구 중입니다. 이런 개선사항들은 궁극적으로 리렌더링을 줄이고 더 반응성 높은 UI를 만드는 데 기여합니다.

커뮤니티 피드백 중 하나는 ref 검증 (ref-in-render validation)에서 가끔 거짓 양성 (false positive)이 발생한다는 것이었습니다. 우리는 컴파일러의 에러 메시지와 힌트를 전적으로 신뢰할 수 있어야 한다는 철학을 지향하므로 이번 RC에서는 해당 검증을 기본적으로 비활성화했습니다. 이 검증 방식을 개선하기 위해 작업할 것이며 후속 릴리즈에서 다시 활성화할 예정입니다.

자세한 컴파일러 사용법은 [문서](https://react.dev/learn/react-compiler)에서 확인할 수 있습니다.

## 피드백에 관해 {/*feedback*/}

RC 기간 동안 React 사용자들이 컴파일러를 사용해보시고 React 레포지토리에 피드백을 제공해 주시길 바랍니다. 버그나 예상치 못한 동작을 발견하면 [이슈](https://github.com/facebook/react/issues)를 등록해 주세요. 일반적인 질문이나 제안이 있다면 [React Compiler Working Group](https://github.com/reactwg/react-compiler/discussions)에 남겨 주시면 됩니다.

## 하위 호환성 {/*backwards-compatibility*/}

베타 발표 때 언급했듯이 React 컴파일러는 React 17 이상에서 호환됩니다. 아직 React 19로 업데이트하지 않았다면 컴파일러 설정에서 최소 타겟을 지정하고 `react-compiler-runtime`을 의존성에 추가하면 React 컴파일러를 사용할 수 있습니다. 자세한 방법은 [문서](https://react.dev/learn/react-compiler#using-react-compiler-with-react-17-or-18)에서 확인할 수 있습니다.

## `eslint-plugin-react-compiler`에서 `eslint-plugin-react-hooks`로 마이그레이션 {/*migrating-from-eslint-plugin-react-compiler-to-eslint-plugin-react-hooks*/}

이미 `eslint-plugin-react-compiler`를 설치했다면 제거하고 `eslint-plugin-react-hooks@6.0.0-rc.1`를 사용해주세요. 이 개선에 기여한 [@michaelfaith](https://bsky.app/profile/michael.faith)에게 감사드립니다!

설치 방법은 다음과 같습니다.

npm

<TerminalBlock>
  {`npm install --save-dev eslint-plugin-react-hooks@6.0.0-rc.1`}
</TerminalBlock>

pnpm

<TerminalBlock>
  {`pnpm add --save-dev eslint-plugin-react-hooks@6.0.0-rc.1`}
</TerminalBlock>

yarn

<TerminalBlock>
  {`yarn add --dev eslint-plugin-react-hooks@6.0.0-rc.1`}
</TerminalBlock>

```js
// eslint.config.js
import * as reactHooks from 'eslint-plugin-react-hooks';

export default [
  // Flat Config (eslint 9+)
  reactHooks.configs.recommended,

  // Legacy Config
  reactHooks.configs['recommended-latest'],
];
```

React 컴파일러 규칙을 활성화하려면 ESLint 설정에 `'react-hooks/react-compiler': 'error'`를 추가해주세요.

린터는 컴파일러 설치 여부와 관계 없으므로 `eslint-plugin-react-hooks`를 업그레이드하는 것은 리스크가 없습니다. 바로 업그레이드하는 것을 권장합니다.

## swc 지원 (실험적 기능) {/*swc-support-experimental*/}

React 컴파일러는 Babel, Vite, Rsbuild 등 [여러 빌드 도구](/learn/react-compiler#installation)에서 사용할 수 있습니다.

추가로 [swc](https://swc.rs/) 팀의 강동윤([@kdy1dev](https://x.com/kdy1dev))님과 협력하여 swc 플러그인 지원을 추가 중입니다. 아직 완성되진 않았지만 [Next.js 앱에서 React 컴파일러를 활성화](https://nextjs.org/docs/app/api-reference/config/next-config-js/reactCompiler)하면 눈에 띄게 빌드 성능이 개선됩니다.

최고의 빌드 성능을 위해 Next.js [15.3.1](https://github.com/vercel/next.js/releases/tag/v15.3.1) 이상 버전 사용을 권장합니다.

Vite 사용자는 여전히 [vite-plugin-react](https://github.com/vitejs/vite-plugin-react)를 [Babel 플러그인](https://react.dev/learn/react-compiler#usage-with-vite)에 적용해 컴파일러를 활성화할 수 있습니다. 또한, [oxc](https://oxc.rs/) 팀과도 협력해 [컴파일러 추가 지원](https://github.com/oxc-project/oxc/issues/10048) 예정입니다. [rolldown](https://github.com/rolldown/rolldown)이 공식 릴리즈되고 Vite와 oxc 지원이 완료되면 마이그레이션 방법을 문서에 추가할 계획입니다.

## React 컴파일러 업그레이드 방법 {/*upgrading-react-compiler*/}

React 컴파일러는 자동 메모이제이션 기능이 성능 최적화에 집중될 때 가장 효과적입니다. 향후 버전에서는 메모이제이션 방식이 변경될 수 있습니다, 예를 들어 더 정교하고 세밀하게 말이죠.

하지만 실제 제품 코드가 항상 정적으로 탐지 가능한 방식으로 작성되지 않습니다. JavaScript 특성상 코드가 [React의 규칙](https://react.dev/reference/rules)을 위반하는 경우도 있고 이가 빌드 시점에 드러나지 않을 수도 있습니다. 이런 이유로 메모이제이션 방식이 바뀌면 의도치 않은 결과가 발생할 수 있습니다.
예를 들어 어떤 값이 컴파일러에 의해 메모이제이션된 상태로 사용되고 있었는데 해당 값이 컴포넌트 트리 어딘가에서 `useEffect` 의존성으로도 쓰이고 있다고 가정해봅시다. 이 때 그 값의 메모이제이션 방식이 달라지거나 더 이상 메모이제이션되지 않게 되면, `useEffect`가 과도하게 실행되거나 (over-fire) 혹은 필요한 상황에서 실행되지 않는 (under-fire) 문제가 생길 수 있습니다.
기본적으로 [useEffect를 동기화 목적](https://react.dev/learn/synchronizing-with-effects)으로만 쓰길 권장하지만 실제 코드베이스에서는 특정 값이 변할 때만 실행되어야 하는 효과처럼 다른 용도로 `useEffect`가 사용되기도 합니다. 따라서 메모이제이션 변경이 이런 코드들에 영향을 줄 수 있습니다.

메모이제이션 방식 변경은 드물지만 예기치 못한 동작을 유발할 수 있습니다. 따라서 React의 규칙을 지키고 지속적인 E2E 테스트를 수행하는 것이 중요합니다. 그래야 컴파일러를 안심하고 업그레이드할 수 있고 React 규칙 위반 문제를 발견할 수 있습니다.

만약 충분한 테스트 커버리지가 없다면 컴파일러를 SemVer 범위(예: `^19.1.0`)로 지정하기보다 특정 버전(예: `19.1.0`)으로 고정하는 것을 권장합니다. npm이나 pnpm을 쓸 경우 `--save-exact`, yarn을 쓸 경우 `--exact` 플래그를 사용하면 됩니다. 이후 컴파일러 업그레이드를 수동으로 진행하면서 앱이 예상하는대로 동작하는지 반드시 확인하는 것이 좋습니다.

## 안정화까지의 로드맵 {/*roadmap-to-stable*/}
*이 로드맵은 최종 확정된 것이 아니며 변경될 수 있습니다.*

RC에 대해 커뮤니티의 최종 피드백을 받은 뒤 컴파일러의 안정화 (Stable) 버전을 공개할 계획입니다.

- ✅ 실험 단계 (Experimental): React Conf 2024에서 공개. 애플리케이션 개발자들의 피드백을 받기 위함.
- ✅ 공개 베타 (Public Beta): 오늘부터 사용 가능. 주로 라이브러리 제작자들의 피드백을 받기 위함.
- ✅ 릴리즈 후보 (RC): React 규칙을 따르는 대부분의 앱과 라이브러리에서 문제없이 동작.
- 안정화 (General Availability): 커뮤니티의 최종 피드백 수집 후 공개 예정.

안정화 이후에는 컴파일러 최적화와 개선을 이어갈 계획입니다. 여기에는 자동 메모이제이션의 점진적 개선 뿐만 아니라 제품 코드를 거의 수정하지 않고도 성능을 향상시킬 수 있는 새로운 최적화 기법들이 추가될 예정입니다. 각 업그레이드는 앱 성능을 꾸준히 개선하고, 더 다양한 JavaScript와 React 패턴을 다룰 수 있게 될 것입니다.

---

이 글을 검토하고 다듬어주신 [Joe Savona](https://x.com/en_JS), [Jason Bonta](https://x.com/someextent), [Jimmy Lai](https://x.com/feedthejim), and [강동윤](https://x.com/kdy1dev) (@kdy1dev)께 감사드립니다.
