---
title: config
---

<Intro>

컴파일러 [설정 옵션](/reference/react-compiler/configuration)을 검증합니다.

</Intro>

## 규칙 세부 사항 {/*rule-details*/}

React 컴파일러는 동작을 제어하기 위해 다양한 [설정 옵션](/reference/react-compiler/configuration)을 받습니다. 이 규칙은 설정이 올바른 옵션 이름과 값 타입을 사용하는지 검증하여 오타나 잘못된 설정으로 인한 무시되는 오류를 방지합니다.

### 잘못된 예 {/*invalid*/}

이 규칙에 대한 잘못된 코드 예시입니다.

```js
// ❌ 알 수 없는 옵션 이름
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compileMode: 'all' // 오타: compilationMode여야 함
    }]
  ]
};

// ❌ 유효하지 않은 옵션 값
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'everything' // 유효하지 않음: 'all' 또는 'infer'를 사용하세요
    }]
  ]
};
```

### 올바른 예 {/*valid*/}

이 규칙에 대한 올바른 코드 예시입니다.

```js
// ✅ 유효한 컴파일러 설정
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'infer',
      panicThreshold: 'critical_errors'
    }]
  ]
};
```

## 문제 해결 {/*troubleshooting*/}

### 설정이 예상대로 작동하지 않는 경우 {/*config-not-working*/}

컴파일러 설정에 오타나 잘못된 값이 있을 수 있습니다.

```js
// ❌ 잘못된 예: 일반적인 설정 실수
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      // 옵션 이름 오타
      compilationMod: 'all',
      // 잘못된 값 타입
      panicThreshold: true,
      // 알 수 없는 옵션
      optimizationLevel: 'max'
    }]
  ]
};
```

유효한 옵션은 [설정 문서](/reference/react-compiler/configuration)를 확인하세요.

```js
// ✅ 더 나은 방법: 유효한 설정
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'all', // 또는 'infer'
      panicThreshold: 'none', // 또는 'critical_errors', 'all_errors'
      // 문서화된 옵션만 사용하세요
    }]
  ]
};
```
