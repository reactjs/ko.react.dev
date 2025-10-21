---
title: "React 컴파일러 v1.0"
author: Lauren Tan, Joe Savona, and Mofei Zhang
date: 2025/10/07
description: 오늘 컴파일러의 첫 번째 안정 버전을 출시합니다.

---

2025년 10월 7일, [Lauren Tan](https://x.com/potetotes), [Joe Savona](https://x.com/en_JS), [Mofei Zhang](https://x.com/zmofei) 작성.

---

<Intro>

React 팀이 새로운 소식을 전해드립니다.

</Intro>

1. React 컴파일러 1.0이 오늘 출시됩니다.
2. 컴파일러 기반의 린트 규칙이 `eslint-plugin-react-hooks`의 `recommended` 및 `recommended-latest` 프리셋에 포함됩니다.
3. 점진적 도입 가이드를 게시했으며, Expo, Vite, Next.js와 협력하여 새로운 앱이 컴파일러를 활성화한 상태로 시작할 수 있도록 했습니다.

---

오늘 컴파일러의 첫 번째 안정 버전을 출시합니다. React 컴파일러는 React와 React Native 모두에서 작동하며, 코드를 다시 작성할 필요 없이 컴포넌트와 훅을 자동으로 최적화합니다. 이 컴파일러는 Meta의 주요 앱에서 충분한 테스트를 거쳤으며 프로덕션 환경에서 사용할 준비가 되었습니다.

[React 컴파일러](/learn/react-compiler)는 자동 메모이제이션을 통해 React 앱을 최적화하는 빌드 타임 도구입니다. 작년에 React 컴파일러의 [첫 베타 버전](/blog/2024/10/21/react-compiler-beta-release)을 공개하고 많은 좋은 피드백과 기여를 받았습니다. 컴파일러를 도입한 사용자들로부터 얻은 성과([Sanity Studio](https://github.com/reactwg/react-compiler/discussions/33) 및 [Wakelet](https://github.com/reactwg/react-compiler/discussions/52)의 사례 연구 참고)에 고무되었으며, React 커뮤니티의 더 많은 사용자에게 컴파일러를 제공하게 되어 기쁩니다.

이번 릴리스는 거의 10년에 걸친 거대하고 복잡한 엔지니어링 노력의 정점입니다. React 팀의 컴파일러에 대한 첫 탐구는 2017년 [Prepack](https://github.com/facebookarchive/prepack)으로 시작되었습니다. 이 프로젝트는 결국 중단되었지만, 여기서 얻은 많은 교훈은 팀이 훅(Hook)을 설계하는 데 정보를 주었고, 훅은 미래의 컴파일러를 염두에 두고 설계되었습니다. 2021년, [Xuan Huang](https://x.com/Huxpro)은 React 컴파일러에 대한 새로운 접근 방식의 [첫 번째 버전](https://www.youtube.com/watch?v=lGEMwh32soc)을 시연했습니다.

비록 이 새로운 React 컴파일러의 첫 버전은 결국 다시 작성되었지만, 첫 프로토타입은 이것이 다루기 쉬운 문제라는 확신을 주었고, 대안적인 컴파일러 아키텍처가 우리가 원했던 메모이제이션 특성을 정확하게 제공할 수 있다는 교훈을 주었습니다. [Joe Savona](https://x.com/en_JS), [Sathya Gunasekaran](https://x.com/_gsathya), [Mofei Zhang](https://x.com/zmofei), [Lauren Tan](https://x.com/potetotes)은 첫 번째 재작성을 통해 컴파일러의 아키텍처를 제어 흐름 그래프(CFG) 기반의 고수준 중간 표현(HIR)으로 전환했습니다. 이는 React 컴파일러 내에서 훨씬 더 정밀한 분석과 타입 추론까지 가능하게 하는 길을 열었습니다. 그 이후로 컴파일러의 많은 중요한 부분이 다시 작성되었으며, 각 재작성은 이전 시도에서 얻은 교훈을 바탕으로 이루어졌습니다. 그리고 그 과정에서 [React 팀](/community/team)의 많은 구성원으로부터 상당한 도움과 기여를 받았습니다.

이번 안정 버전은 앞으로 나올 많은 릴리스 중 첫 번째입니다. 컴파일러는 계속해서 발전하고 개선될 것이며, 앞으로 10년 이상 React의 새로운 기반과 시대가 될 것으로 기대합니다.

[빠른 시작](/learn/react-compiler)으로 바로 넘어가거나, React Conf 2025의 주요 내용을 계속 읽어볼 수 있습니다.

<DeepDive>

#### React 컴파일러는 어떻게 작동하나요? {/*how-does-react-compiler-work*/}

React 컴파일러는 자동 메모이제이션을 통해 컴포넌트와 훅을 최적화하는 최적화 컴파일러입니다. 현재는 Babel 플러그인으로 구현되어 있지만, 컴파일러는 Babel과 거의 분리되어 있으며 Babel이 제공하는 추상 구문 트리(AST)를 자체적인 새로운 HIR로 낮춥니다. 그리고 여러 컴파일러 패스를 통해 React 코드의 데이터 흐름과 가변성을 신중하게 이해합니다. 이를 통해 컴파일러는 렌더링에 사용되는 값을 세분화하여 메모이제이션할 수 있으며, 조건부 메모이제이션 기능도 포함하는데 이는 수동 메모이제이션으로는 불가능합니다.

```js {8}
import { use } from 'react';

export default function ThemeProvider(props) {
  if (!props.children) {
    return null;
  }
  // 컴파일러는 조건부 반환 후에도 코드를 메모이제이션할 수 있습니다.
  const theme = mergeTheme(props.theme, use(ThemeContext));
  return (
    <ThemeContext value={theme}>
      {props.children}
    </ThemeContext>
  );
}
```
_[React Compiler Playground](https://playground.react.dev/#N4Igzg9grgTgxgUxALhASwLYAcIwC4AEwBUYCBAvgQGYwQYEDkMCAhnHowNwA6AdvwQAPHPgIATBNVZQANoWpQ+HNBD4EAKgAsEGBAAU6ANzSSYACix0sYAJRF+BAmmoFzAQisQbAOjha0WXEWPntgRycCFjxYdT45WV51Sgi4NTBCPB09AgBeAj0YAHMEbV0ES2swHyzygBoSMnMyvQBhNTxhPFtbJKdo2LcIpwAeFoR2vk6hQiNWWSgEXOBavQoAPmHI4C9ff0DghD4KLZGAenHJ6bxN5N7+ChA6kDS+ajQilHRsXEyATyw5GI+gWRTQfAA8lg8Ko+GBKDQ6AxGAAjVgohCyAC0WFB4KxLHYeCxaWwgQQMDO4jQGW4-H45nCyTOZ1JWECrBhagAshBJMgCDwQPNZEKHgQwJyae8EPCQVAwZDobC7FwnuAtBAAO4ASSmFL48zAKGksjIFCAA)에서 이 예시를 확인하세요._

자동 메모이제이션 외에도 React 컴파일러는 React 코드에 대해 실행되는 유효성 검사 패스를 가지고 있습니다. 이 패스는 [React의 규칙](/reference/rules)을 인코딩하고, 컴파일러의 데이터 흐름 및 가변성에 대한 이해를 사용하여 React의 규칙이 깨진 부분에 대한 진단을 제공합니다. 이러한 진단은 종종 React 코드에 숨어있는 잠재적인 버그를 노출하며, 주로 `eslint-plugin-react-hooks`를 통해 표시됩니다.

컴파일러가 코드를 최적화하는 방법에 대해 더 자세히 알아보려면 [Playground](https://playground.react.dev)를 방문하세요.

</DeepDive>

## 지금 React 컴파일러 사용하기 {/*use-react-compiler-today*/}
컴파일러를 설치하려면 다음을 따르세요.

npm
<TerminalBlock>
{`npm install --save-dev --save-exact babel-plugin-react-compiler@latest`}
</TerminalBlock>

pnpm
<TerminalBlock>
{`pnpm add --save-dev --save-exact babel-plugin-react-compiler@latest`}
</TerminalBlock>

yarn
<TerminalBlock>
{`yarn add --dev --exact babel-plugin-react-compiler@latest`}
</TerminalBlock>

안정 버전 출시의 일환으로, React 컴파일러를 프로젝트에 더 쉽게 추가할 수 있도록 하고 컴파일러가 메모이제이션을 생성하는 방식을 최적화했습니다. React 컴파일러는 이제 옵셔널 체이닝과 배열 인덱스를 의존성으로 지원합니다. 이러한 개선 사항은 궁극적으로 재렌더링을 줄이고 더 반응적인 UI를 만들면서도, 관용적인 선언적 코드를 계속 작성할 수 있게 해줍니다.

컴파일러 사용에 대한 자세한 내용은 [문서](/learn/react-compiler)에서 확인할 수 있습니다.

## 프로덕션 환경에서 확인된 결과 {/*react-compiler-at-meta*/}
[컴파일러는 이미 Meta Quest Store와 같은 앱에 적용되었습니다](https://youtu.be/lyEKhv8-3n0?t=3002). 초기 로딩 및 페이지 간 탐색이 최대 12% 개선되었으며, 특정 상호작용은 2.5배 이상 빨라졌습니다. 이러한 성과에도 불구하고 메모리 사용량은 중립을 유지합니다. 결과는 다를 수 있지만, 비슷한 성능 향상을 확인하기 위해 앱에서 컴파일러를 실험해보는 것을 권장합니다.

## 하위 호환성 {/*backwards-compatibility*/}
베타 발표에서 언급했듯이, React 컴파일러는 React 17 이상과 호환됩니다. 아직 React 19를 사용하지 않는 경우, 컴파일러 설정에서 최소 타겟을 지정하고 `react-compiler-runtime`을 의존성으로 추가하여 React 컴파일러를 사용할 수 있습니다. 이에 대한 문서는 [여기](/reference/react-compiler/target#targeting-react-17-or-18)에서 찾을 수 있습니다.

## 컴파일러 기반 린팅으로 React 규칙 강제하기 {/*migrating-from-eslint-plugin-react-compiler-to-eslint-plugin-react-hooks*/}
React 컴파일러에는 [React의 규칙](/reference/rules)을 위반하는 코드를 식별하는 데 도움이 되는 ESLint 규칙이 포함되어 있습니다. 린터는 컴파일러 설치를 요구하지 않으므로 `eslint-plugin-react-hooks`를 업그레이드하는 데 위험이 없습니다. 오늘 모든 사람이 업그레이드하는 것을 권장합니다.

이미 `eslint-plugin-react-compiler`를 설치했다면, 이제 제거하고 `eslint-plugin-react-hooks@latest`를 사용할 수 있습니다. 이 개선에 기여해주신 [@michaelfaith](https://bsky.app/profile/michael.faith)님께 감사드립니다!

설치 방법:

npm
<TerminalBlock>
{`npm install --save-dev eslint-plugin-react-hooks@latest`}
</TerminalBlock>

pnpm
<TerminalBlock>
{`pnpm add --save-dev eslint-plugin-react-hooks@latest`}
</TerminalBlock>

yarn
<TerminalBlock>
{`yarn add --dev eslint-plugin-react-hooks@latest`}
</TerminalBlock>

```js {6}
// eslint.config.js (Flat Config)
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  reactHooks.configs.flat.recommended,
]);
```

```js {3}
// eslintrc.json (Legacy Config)
{
  "extends": ["plugin:react-hooks/recommended"],
  // ...
}
```

React 컴파일러 규칙을 활성화하려면 `recommended` 프리셋을 사용하는 것을 권장합니다. 더 많은 지침은 [README](https://github.com/facebook/react/blob/main/packages/eslint-plugin-react-hooks/README.md)를 참조할 수 있습니다. 다음은 React Conf에서 소개된 몇 가지 예시입니다.

- [`set-state-in-render`](/reference/eslint-plugin-react-hooks/lints/set-state-in-render)로 렌더링 루프를 유발하는 `setState` 패턴 포착.
- [`set-state-in-effect`](/reference/eslint-plugin-react-hooks/lints/set-state-in-effect)를 통해 이펙트 내의 비용이 많이 드는 작업 플래그 지정.
- [`refs`](/reference/eslint-plugin-react-hooks/lints/refs)로 렌더링 중 안전하지 않은 ref 접근 방지.

## useMemo, useCallback, React.memo는 어떻게 해야 하나요? {/*what-should-i-do-about-usememo-usecallback-and-reactmemo*/}
기본적으로 React 컴파일러는 분석과 휴리스틱을 기반으로 코드를 메모이제이션합니다. 대부분의 경우, 이 메모이제이션은 직접 작성한 것만큼 또는 그 이상으로 정밀할 것입니다. 그리고 위에서 언급했듯이, 컴파일러는 조기 반환 후와 같이 `useMemo`/`useCallback`을 사용할 수 없는 경우에도 메모이제이션할 수 있습니다.

그러나 경우에 따라 개발자가 메모이제이션을 더 세밀하게 제어해야 할 수도 있습니다. `useMemo`와 `useCallback` 훅은 React 컴파일러와 함께 계속 사용하여 어떤 값을 메모이제이션할지 제어하는 탈출구로 사용할 수 있습니다. 이에 대한 흔한 사용 사례는 메모이제이션된 값이 이펙트 의존성으로 사용될 때, 의존성이 의미 있게 변경되지 않았음에도 이펙트가 반복적으로 실행되지 않도록 보장하는 것입니다.

새로운 코드의 경우, 메모이제이션은 컴파일러에 의존하고 정밀한 제어가 필요한 경우에만 `useMemo`/`useCallback`을 사용하는 것을 권장합니다.

기존 코드의 경우, 기존 메모이제이션을 그대로 두거나(제거하면 컴파일 출력이 변경될 수 있음) 메모이제이션을 제거하기 전에 신중하게 테스트하는 것을 권장합니다.

## 새로운 앱은 React 컴파일러를 사용해야 합니다 {/*new-apps-should-use-react-compiler*/}
Expo, Vite, Next.js 팀과 협력하여 새로운 앱 경험에 컴파일러를 추가했습니다.

[Expo SDK 54](https://docs.expo.dev/guides/react-compiler/) 이상에서는 컴파일러가 기본적으로 활성화되어 있으므로, 새로운 앱은 처음부터 자동으로 컴파일러의 이점을 활용할 수 있습니다.

<TerminalBlock>
{`npx create-expo-app@latest`}
</TerminalBlock>

[Vite](https://vite.dev/guide/) 및 [Next.js](https://nextjs.org/docs/app/api-reference/cli/create-next-app) 사용자는 `create-vite` 및 `create-next-app`에서 컴파일러가 활성화된 템플릿을 선택할 수 있습니다.

<TerminalBlock>
{`npm create vite@latest`}
</TerminalBlock>

<br />

<TerminalBlock>
{`npx create-next-app@latest`}
</TerminalBlock>

## React 컴파일러 점진적으로 도입하기 {/*adopt-react-compiler-incrementally*/}
기존 애플리케이션을 유지보수하는 경우, 자신의 속도에 맞춰 컴파일러를 출시할 수 있습니다. 게이팅 전략, 호환성 검사, 출시 도구를 다루는 단계별 [점진적 도입 가이드](/learn/react-compiler/incremental-adoption)를 게시하여 안심하고 컴파일러를 활성화할 수 있도록 했습니다.

## swc 지원 (실험적) {/*swc-support-experimental*/}
React 컴파일러는 Babel, Vite, Rsbuild와 같은 [여러 빌드 도구](/learn/react-compiler#installation)에 걸쳐 설치할 수 있습니다.

이러한 도구 외에도, [swc](https://swc.rs/) 팀의 강동윤([@kdy1dev](https://x.com/kdy1dev))님과 협력하여 React 컴파일러를 swc 플러그인으로 추가 지원하는 작업을 진행하고 있습니다. 이 작업이 완료되지는 않았지만, [Next.js 앱에서 React 컴파일러를 활성화](https://nextjs.org/docs/app/api-reference/config/next-config-js/reactCompiler)하면 이제 Next.js 빌드 성능이 상당히 빨라질 것입니다.

최상의 빌드 성능을 얻으려면 Next.js [15.3.1](https://github.com/vercel/next.js/releases/tag/v15.3.1) 이상을 사용하는 것을 권장합니다.

Vite 사용자는 계속해서 [vite-plugin-react](https://github.com/vitejs/vite-plugin-react)를 사용하여 컴파일러를 활성화할 수 있으며, 이를 [Babel 플러그인](/learn/react-compiler/installation#vite)으로 추가하면 됩니다. 또한 [oxc](https://oxc.rs/) 팀과 협력하여 [컴파일러 지원을 추가](https://github.com/oxc-project/oxc/issues/10048)하고 있습니다. [rolldown](https://github.com/rolldown/rolldown)이 공식적으로 출시되고 Vite에서 지원되며 React 컴파일러에 대한 oxc 지원이 추가되면, 마이그레이션 방법에 대한 정보로 문서를 업데이트할 것입니다.

## React 컴파일러 업그레이드하기 {/*upgrading-react-compiler*/}
React 컴파일러는 적용된 자동 메모이제이션이 순전히 성능을 위한 것일 때 가장 잘 작동합니다. 향후 버전의 컴파일러는 메모이제이션이 적용되는 방식을 변경할 수 있으며, 예를 들어 더 세분화되고 정밀해질 수 있습니다.

그러나 제품 코드는 때때로 자바스크립트에서 항상 정적으로 감지할 수 없는 방식으로 [React의 규칙](/reference/rules)을 위반할 수 있기 때문에, 메모이제이션을 변경하면 때때로 예기치 않은 결과가 발생할 수 있습니다. 예를 들어, 이전에 메모이제이션된 값이 컴포넌트 트리의 어딘가에서 `useEffect`의 의존성으로 사용될 수 있습니다. 이 값이 메모이제이션되는 방식이나 여부를 변경하면 해당 `useEffect`가 과도하게 또는 부족하게 실행될 수 있습니다. [동기화를 위해서만 useEffect를 사용](/learn/synchronizing-with-effects)하도록 권장하지만, 코드베이스에는 특정 값 변경에만 응답하여 실행되어야 하는 이펙트와 같은 다른 사용 사례를 다루는 `useEffect`가 있을 수 있습니다.

즉, 메모이제이션을 변경하면 드문 경우에 예기치 않은 동작이 발생할 수 있습니다. 이러한 이유로, React의 규칙을 따르고 앱의 지속적인 엔드투엔드 테스트를 사용하여 안심하고 컴파일러를 업그레이드하고 문제를 일으킬 수 있는 React 규칙 위반을 식별하는 것을 권장합니다.

테스트 커버리지가 좋지 않은 경우, 컴파일러를 SemVer 범위(예: `^1.0.0`)가 아닌 정확한 버전(예: `1.0.0`)으로 고정하는 것을 권장합니다. 컴파일러를 업그레이드할 때 `--save-exact`(npm/pnpm) 또는 `--exact` 플래그(yarn)를 전달하여 이를 수행할 수 있습니다. 그런 다음 컴파일러의 모든 업그레이드를 수동으로 수행하고 앱이 여전히 예상대로 작동하는지 주의 깊게 확인해야 합니다.

---

이 게시물을 검토하고 편집해주신 [Jason Bonta](https://x.com/someextent), [Jimmy Lai](https://x.com/feedthejim), [Kang Dongyoon](https://x.com/kdy1dev) (@kdy1dev), [Dan Abramov](https://bsky.app/profile/danabra.mov)님께 감사드립니다.
