---
title: eslint-plugin-react-hooks
version: rc
---

<Intro>

`eslint-plugin-react-hooks`는 [React의 규칙](/reference/rules)을 적용하기 위한 ESLint 규칙을 제공합니다.

</Intro>

이 플러그인은 빌드 시간에 React 규칙 위반을 감지하여 컴포넌트와 Hook이 정확성과 성능을 위한 React 규칙을 따르도록 도와줍니다. 린트는 기본적인 React 패턴(`exhaustive-deps` 및 `rules-of-hooks`)과 React 컴파일러가 표시하는 문제를 모두 다룹니다. React 컴파일러 진단은 ESLint 플러그인에 의해 자동으로 표시되며, 앱이 아직 컴파일러를 도입하지 않았더라도 사용할 수 있습니다.

<Note>
컴파일러가 진단을 보고하면 컴파일러가 지원되지 않거나 React 규칙을 위반하는 패턴을 정적으로 감지했다는 것을 의미합니다. 이를 감지하면 해당 컴포넌트와 Hook을 **자동으로** 건너뛰고 나머지 앱은 계속 컴파일합니다. 이렇게 하면 앱을 손상시키지 않는 안전한 최적화의 최적 적용 범위를 보장합니다.

린트에서 이것이 의미하는 바는 모든 위반을 즉시 수정할 필요가 없다는 것입니다. 자신의 속도에 맞춰 해결하여 점진적으로 최적화된 컴포넌트 수를 늘리세요.
</Note>

## 권장<sup>Recommended</sup> 규칙 {/*recommended*/}

아래 규칙들은 `eslint-plugin-react-hooks`의 `recommended` 프리셋에 포함되어 있습니다.

* [`exhaustive-deps`](/reference/eslint-plugin-react-hooks/lints/exhaustive-deps) - React Hook의 의존성 배열에 필요한 모든 의존성이 포함되어 있는지 검증합니다.
* [`rules-of-hooks`](/reference/eslint-plugin-react-hooks/lints/rules-of-hooks) - 컴포넌트와 Hook이 Hook의 규칙을 따르는지 검증합니다.
* [`component-hook-factories`](/reference/eslint-plugin-react-hooks/lints/component-hook-factories) - 중첩된 컴포넌트나 Hook을 정의하는 고차 함수를 검증합니다.
* [`config`](/reference/eslint-plugin-react-hooks/lints/config) - 컴파일러 설정 옵션을 검증합니다.
* [`error-boundaries`](/reference/eslint-plugin-react-hooks/lints/error-boundaries) - 자식 오류에 대해 try/catch 대신 Error Boundary 사용을 검증합니다.
* [`gating`](/reference/eslint-plugin-react-hooks/lints/gating) - 게이팅 모드 설정을 검증합니다.
* [`globals`](/reference/eslint-plugin-react-hooks/lints/globals) - 렌더링 중 전역 변수의 할당/변이를 검증합니다.
* [`immutability`](/reference/eslint-plugin-react-hooks/lints/immutability) - props, state 및 기타 불변 값의 변이를 검증합니다.
* [`incompatible-library`](/reference/eslint-plugin-react-hooks/lints/incompatible-library) - 메모이제이션과 호환되지 않는 라이브러리 사용을 검증합니다.
* [`preserve-manual-memoization`](/reference/eslint-plugin-react-hooks/lints/preserve-manual-memoization) - 기존의 수동 메모이제이션이 컴파일러에 의해 유지되는지 검증합니다.
* [`purity`](/reference/eslint-plugin-react-hooks/lints/purity) - 알려진 불순 함수를 확인하여 컴포넌트/Hook이 순수한지 검증합니다.
* [`refs`](/reference/eslint-plugin-react-hooks/lints/refs) - 렌더링 중 읽기/쓰기가 아닌 ref의 올바른 사용을 검증합니다.
* [`set-state-in-effect`](/reference/eslint-plugin-react-hooks/lints/set-state-in-effect) - Effect에서 `setState`를 동기적으로 호출하는 것을 검증합니다.
* [`set-state-in-render`](/reference/eslint-plugin-react-hooks/lints/set-state-in-render) - 렌더링 중 state 설정을 검증합니다.
* [`static-components`](/reference/eslint-plugin-react-hooks/lints/static-components) - 컴포넌트가 매 렌더링마다 재생성되지 않고 정적인지 검증합니다.
* [`unsupported-syntax`](/reference/eslint-plugin-react-hooks/lints/unsupported-syntax) - React 컴파일러가 지원하지 않는 문법을 검증합니다.
* [`use-memo`](/reference/eslint-plugin-react-hooks/lints/use-memo) - 반환값 없이 `useMemo` Hook을 사용하는 것을 검증합니다.
