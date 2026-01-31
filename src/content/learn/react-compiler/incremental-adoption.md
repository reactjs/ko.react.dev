---
title: 점진적 도입
---

<Intro>
React 컴파일러는 점진적으로 도입할 수 있으며, 코드베이스의 특정 부분에서 먼저 시도해 볼 수 있습니다. 이 가이드에서는 기존 프로젝트에서 컴파일러를 단계적으로 배포하는 방법을 알아봅니다.
</Intro>

<YouWillLearn>

* 점진적 도입이 권장되는 이유
* 디렉터리 기반 도입을 위한 Babel overrides 사용
* 선택적 컴파일을 위한 `"use memo"` 지시어 사용
* 컴포넌트 제외를 위한 `"use no memo"` 지시어 사용
* 게이팅을 통한 런타임 기능 플래그
* 도입 진행 상황 모니터링

</YouWillLearn>

## 점진적 도입이 필요한 이유 {/*why-incremental-adoption*/}

React 컴파일러는 전체 코드베이스를 자동으로 최적화하도록 설계되었지만, 한 번에 모두 도입할 필요는 없습니다. 점진적 도입은 배포 과정을 제어할 수 있게 해주어 앱의 작은 부분에서 컴파일러를 테스트한 후 나머지 부분으로 확장할 수 있습니다.

작은 부분부터 시작하면 컴파일러의 최적화에 대한 신뢰를 쌓을 수 있습니다. 컴파일된 코드로 앱이 올바르게 동작하는지 확인하고, 성능 개선을 측정하고, 코드베이스에 특정한 엣지 케이스를 식별할 수 있습니다. 이 접근 방식은 안정성이 중요한 프로덕션 애플리케이션에 특히 유용합니다.

점진적 도입은 컴파일러가 발견할 수 있는 React 규칙 위반을 해결하기도 더 쉽게 만듭니다. 전체 코드베이스의 위반을 한 번에 수정하는 대신 컴파일러 적용 범위를 확장하면서 체계적으로 해결할 수 있습니다. 이를 통해 마이그레이션을 관리하기 쉽게 유지하고 버그 도입 위험을 줄일 수 있습니다.

컴파일되는 코드 부분을 제어함으로써 A/B 테스트를 실행하여 컴파일러 최적화의 실제 영향을 측정할 수도 있습니다. 이 데이터는 전체 도입에 대한 정보에 기반한 결정을 내릴 수 있어 팀에게 가치를 입증하는데 도움이 됩니다.

## 점진적 도입 방법 {/*approaches-to-incremental-adoption*/}

React 컴파일러를 점진적으로 도입하는 세 가지 주요 방법이 있습니다.

1. **Babel overrides** - 특정 디렉터리에 컴파일러 적용
2. **`"use memo"`로 선택적 적용** - 명시적으로 선택한 컴포넌트만 컴파일
3. **런타임 게이팅** - 기능 플래그로 컴파일 제어

모든 방법은 전체 배포 전에 애플리케이션의 특정 부분에서 컴파일러를 테스트할 수 있게 해줍니다.

## Babel Overrides를 사용한 디렉터리 기반 도입 {/*directory-based-adoption*/}

Babel의 `overrides` 옵션을 사용하면 코드베이스의 여러 부분에 서로 다른 플러그인을 적용할 수 있습니다. 디렉터리별로 React 컴파일러를 점진적으로 도입하는 데 적합합니다.

### 기본 설정 {/*basic-configuration*/}

특정 디렉터리에 컴파일러를 적용하는 것부터 시작합니다.

```js
// babel.config.js
module.exports = {
  plugins: [
    // 모든 파일에 적용되는 전역 플러그인
  ],
  overrides: [
    {
      test: './src/modern/**/*.{js,jsx,ts,tsx}',
      plugins: [
        'babel-plugin-react-compiler'
      ]
    }
  ]
};
```

### 적용 범위 확장 {/*expanding-coverage*/}

신뢰가 쌓이면 더 많은 디렉터리를 추가합니다.

```js
// babel.config.js
module.exports = {
  plugins: [
    // 전역 플러그인
  ],
  overrides: [
    {
      test: ['./src/modern/**/*.{js,jsx,ts,tsx}', './src/features/**/*.{js,jsx,ts,tsx}'],
      plugins: [
        'babel-plugin-react-compiler'
      ]
    },
    {
      test: './src/legacy/**/*.{js,jsx,ts,tsx}',
      plugins: [
        // 레거시 코드용 다른 플러그인
      ]
    }
  ]
};
```

### 컴파일러 옵션과 함께 사용 {/*with-compiler-options*/}

override별로 컴파일러 옵션을 설정할 수도 있습니다.

```js
// babel.config.js
module.exports = {
  plugins: [],
  overrides: [
    {
      test: './src/experimental/**/*.{js,jsx,ts,tsx}',
      plugins: [
        ['babel-plugin-react-compiler', {
          // 옵션 ...
        }]
      ]
    },
    {
      test: './src/production/**/*.{js,jsx,ts,tsx}',
      plugins: [
        ['babel-plugin-react-compiler', {
          // 옵션 ...
        }]
      ]
    }
  ]
};
```


## `"use memo"`를 사용한 선택적 모드 {/*opt-in-mode-with-use-memo*/}

최대한의 제어를 위해 `compilationMode: 'annotation'`을 사용하여 `"use memo"` 지시어를 통해 명시적으로 선택한 컴포넌트와 Hook만 컴파일할 수 있습니다.

<Note>
이 방법은 개별 컴포넌트와 Hook에 대한 세밀한 제어를 제공합니다. 전체 디렉터리에 영향을 주지 않고 특정 컴포넌트에서 컴파일러를 테스트하고 싶을 때 유용합니다.
</Note>

### 어노테이션 모드 설정 {/*annotation-mode-configuration*/}

```js
// babel.config.js
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'annotation',
    }],
  ],
};
```

### 지시어 사용 {/*using-the-directive*/}

컴파일하려는 함수의 시작 부분에 `"use memo"`를 추가합니다.

```js
function TodoList({ todos }) {
  "use memo"; // 이 컴포넌트를 컴파일 대상으로 선택

  const sortedTodos = todos.slice().sort();

  return (
    <ul>
      {sortedTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}

function useSortedData(data) {
  "use memo"; // 이 Hook을 컴파일 대상으로 선택

  return data.slice().sort();
}
```

`compilationMode: 'annotation'`을 사용하면 다음을 해야 합니다.
- 최적화하려는 모든 컴포넌트에 `"use memo"` 추가
- 모든 커스텀 Hook에 `"use memo"` 추가
- 이후에 새로 작성하는 컴포넌트에도 추가

이를 통해 컴파일러의 영향을 평가하는 동안 어떤 컴포넌트가 컴파일되는지 정밀하게 제어할 수 있습니다.

## 게이팅을 통한 런타임 기능 플래그 {/*runtime-feature-flags-with-gating*/}

`gating` 옵션을 사용하면 기능 플래그를 사용하여 런타임에 컴파일을 제어할 수 있습니다. A/B 테스트를 실행하거나 사용자 세그먼트에 따라 컴파일러를 점진적으로 배포하는 데 유용합니다.

### 게이팅 작동 방식 {/*how-gating-works*/}

컴파일러는 최적화된 코드를 런타임 검사로 감쌉니다. 게이트가 `true`를 반환하면 최적화된 버전이 실행됩니다. 그렇지 않으면 원본 코드가 실행됩니다.

### 게이팅 설정 {/*gating-configuration*/}

```js
// babel.config.js
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      gating: {
        source: 'ReactCompilerFeatureFlags',
        importSpecifierName: 'isCompilerEnabled',
      },
    }],
  ],
};
```

### 기능 플래그 구현 {/*implementing-the-feature-flag*/}

게이팅 함수를 내보내는 모듈을 생성합니다.

```js
// ReactCompilerFeatureFlags.js
export function isCompilerEnabled() {
  // 기능 플래그 시스템 사용
  return getFeatureFlag('react-compiler-enabled');
}
```

## 도입 문제 해결 {/*troubleshooting-adoption*/}

도입 중 문제가 발생하면 다음을 시도해 보세요.

1. `"use no memo"`를 사용하여 문제가 있는 컴포넌트를 일시적으로 제외
2. [디버깅 가이드](/learn/react-compiler/debugging)에서 일반적인 문제 확인
3. ESLint 플러그인이 식별한 React 규칙 위반 수정
4. 더 점진적인 도입을 위해 `compilationMode: 'annotation'` 사용 고려

## 다음 단계 {/*next-steps*/}

- 더 많은 옵션은 [설정 가이드](/reference/react-compiler/configuration) 참고
- [디버깅 기법](/learn/react-compiler/debugging) 알아보기
- 모든 컴파일러 옵션은 [API 레퍼런스](/reference/react-compiler/configuration) 확인
