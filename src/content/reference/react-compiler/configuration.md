---
title: 구성
---

<Intro>

이 페이지에서는 React Compiler에서 사용할 수 있는 모든 구성 옵션을 나열합니다.

</Intro>

<Note>

대부분의 앱에서는 기본 옵션이 기본적으로 잘 작동합니다. 특별한 필요가 있다면 이러한 고급 옵션을 사용할 수 있습니다.

</Note>

```js
// babel.config.js
module.exports = {
  plugins: [
    [
      'babel-plugin-react-compiler', {
        // compiler options
      }
    ]
  ]
};
```

---

## 컴파일 제어 {/*compilation-control*/}

이 옵션들은 컴파일러가 *무엇*을 최적화하고, *어떻게* 컴포넌트와 hooks를 컴파일 대상으로 선택할지를 제어합니다.

* [`compilationMode`](/reference/react-compiler/compilationMode)는 컴파일할 함수를 선택하는 전략을 제어합니다. (예: 모든 함수, 어노테이션된 함수만, 또는 컴파일러의 자동 감지).

```js
{
  compilationMode: 'annotation' // "use memo"가 명시된 함수만 컴파일합니다.
}
```

---

## 버전 호환성 {/*version-compatibility*/}

React 버전 구성은 컴파일러가 현재 사용 중인 React 버전과 호환되는 코드를 생성하도록 합니다.

[`target`](/reference/react-compiler/target)은 현재 사용 중인 React 버전(17, 18, 또는 19)을 지정합니다.

```js
// React 18을 사용하는 프로젝트의 경우
{
  target: '18' // react-compiler-runtime 패키지가 필요합니다.
}
```

---

## 에러 처리 {/*error-handling*/}

이 옵션들은 [React의 규칙](/reference/rules)을 따르지 않는 코드에 대해 컴파일러가 어떻게 대응하는지를 제어합니다.

[`panicThreshold`](/reference/react-compiler/panicThreshold)는 빌드를 실패로 처리할지, 문제가 있는 컴포넌트를 건너뛸지를 결정합니다.

```js
// 프로덕션 환경에 권장
{
  panicThreshold: 'none' // 빌드를 실패시키는 대신 오류가 있는 컴포넌트를 건너뜁니다.
}
```

---

## 디버깅 {/*debugging*/}

로깅 및 분석 옵션은 컴파일러의 동작을 이해하는 데 도움을 줍니다.

[`logger`](/reference/react-compiler/logger)는 컴파일 이벤트에 대한 커스텀 로깅을 제공합니다.

```js
{
  logger: {
    logEvent(filename, event) {
      if (event.kind === 'CompileSuccess') {
        console.log('Compiled:', filename);
      }
    }
  }
}
```

---

## 기능 플래그 {/*feature-flags*/}

조건부 컴파일을 사용하면 최적화된 코드가 언제 사용될지를 제어할 수 있습니다.

[`gating`](/reference/react-compiler/gating)은 A/B 테스트나 점진적 배포를 위한 런타임 기능 플래그를 활성화합니다.

```js
{
  gating: {
    source: 'my-feature-flags',
    importSpecifierName: 'isCompilerEnabled'
  }
}
```

---

## 공통 구성 패턴 {/*common-patterns*/}

### 기본 구성 {/*default-configuration*/}

대부분의 React 19 애플리케이션에서는 별도의 구성 없이도 컴파일러가 정상적으로 동작합니다.

```js
// babel.config.js
module.exports = {
  plugins: [
    'babel-plugin-react-compiler'
  ]
};
```

### React 17/18 프로젝트 {/*react-17-18*/}

React 17/18 버전은 런타임 패키지와 target 구성이 필요합니다.

```bash
npm install react-compiler-runtime@latest
```

```js
{
  target: '18' // or '17'
}
```

### 점진적 적용 {/*incremental-adoption*/}

특정 디렉토리부터 시작해 점진적으로 확장할 수 있습니다.

```js
{
  compilationMode: 'annotation' // "use memo"가 명시된 함수만 컴파일합니다.
}
```

