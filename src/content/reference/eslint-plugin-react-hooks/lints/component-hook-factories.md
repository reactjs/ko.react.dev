---
title: component-hook-factories
---

<Intro>

중첩된 컴포넌트나 Hook을 정의하는 고차 함수를 검증합니다. 컴포넌트와 Hook은 모듈 레벨에서 정의해야 합니다.

</Intro>

## 규칙 세부 사항 {/*rule-details*/}

다른 함수 내부에서 컴포넌트나 Hook을 정의하면 호출할 때마다 새로운 인스턴스가 생성됩니다. React는 각각을 완전히 다른 컴포넌트로 취급하여 전체 컴포넌트 트리를 파괴하고 다시 생성하며, 모든 state를 잃고 성능 문제를 일으킵니다.

### 잘못된 예시 {/*invalid*/}

이 규칙에 대한 잘못된 코드 예시입니다.

```js
// ❌ 컴포넌트를 생성하는 팩토리 함수
function createComponent(defaultValue) {
  return function Component() {
    // ...
  };
}

// ❌ 컴포넌트 내부에서 정의된 컴포넌트
function Parent() {
  function Child() {
    // ...
  }

  return <Child />;
}

// ❌ Hook 팩토리 함수
function createCustomHook(endpoint) {
  return function useData() {
    // ...
  };
}
```

### 올바른 예시 {/*valid*/}

이 규칙에 대한 올바른 코드 예시입니다.

```js
// ✅ 모듈 레벨에서 정의된 컴포넌트
function Component({ defaultValue }) {
  // ...
}

// ✅ 모듈 레벨에서 정의된 커스텀 Hook
function useData(endpoint) {
  // ...
}
```

## 문제 해결 {/*troubleshooting*/}

### 동적 컴포넌트 동작이 필요한 경우 {/*dynamic-behavior*/}

커스터마이즈된 컴포넌트를 만들기 위해 팩토리가 필요하다고 생각할 수 있습니다.

```js
// ❌ 잘못된 예: 팩토리 패턴
function makeButton(color) {
  return function Button({children}) {
    return (
      <button style={{backgroundColor: color}}>
        {children}
      </button>
    );
  };
}

const RedButton = makeButton('red');
const BlueButton = makeButton('blue');
```

대신 [JSX를 자식으로 전달](/learn/passing-props-to-a-component#passing-jsx-as-children)하세요.

```js
// ✅ 더 나은 방법: JSX를 자식으로 전달
function Button({color, children}) {
  return (
    <button style={{backgroundColor: color}}>
      {children}
    </button>
  );
}

function App() {
  return (
    <>
      <Button color="red">Red</Button>
      <Button color="blue">Blue</Button>
    </>
  );
}
```
