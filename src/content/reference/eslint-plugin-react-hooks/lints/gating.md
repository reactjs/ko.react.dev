---
title: gating
---

<Intro>

[게이팅 모드](/reference/react-compiler/gating)의 설정을 검증합니다.

</Intro>

## 규칙 세부 사항 {/*rule-details*/}

게이팅 모드는 특정 컴포넌트를 최적화 대상으로 표시하여 React 컴파일러를 점진적으로 도입할 수 있게 해줍니다. 이 규칙은 컴파일러가 어떤 컴포넌트를 처리할지 알 수 있도록 게이팅 설정이 유효한지 확인합니다.

### 잘못된 예 {/*invalid*/}

이 규칙에 대한 잘못된 코드 예시입니다.

```js
// ❌ 필수 필드 누락
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      gating: {
        importSpecifierName: '__experimental_useCompiler'
        // 'source' 필드 누락
      }
    }]
  ]
};

// ❌ 유효하지 않은 게이팅 타입
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      gating: '__experimental_useCompiler' // 객체여야 함
    }]
  ]
};
```

### 올바른 예 {/*valid*/}

이 규칙에 대한 올바른 코드 예시입니다.

```js
// ✅ 완전한 게이팅 설정
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      gating: {
        importSpecifierName: 'isCompilerEnabled', // 내보낸 함수 이름
        source: 'featureFlags' // 모듈 이름
      }
    }]
  ]
};

// featureFlags.js
export function isCompilerEnabled() {
  // ...
}

// ✅ 게이팅 없음 (모든 것을 컴파일)
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      // gating 필드 없음 - 모든 컴포넌트를 컴파일
    }]
  ]
};
```
