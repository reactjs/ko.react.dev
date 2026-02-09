---
title: static-components
---

<Intro>

컴포넌트가 정적이며 렌더링할 때마다 다시 생성되지 않는지 검증합니다. 동적으로 다시 생성되는 컴포넌트는 state를 초기화하고 과도한 재렌더링을 트리거할 수 있습니다.

</Intro>

## 규칙 세부 정보 {/*rule-details*/}

다른 컴포넌트 내부에 정의된 컴포넌트는 렌더링할 때마다 다시 생성됩니다. React는 각각을 완전히 새로운 컴포넌트 타입으로 간주하여 이전 컴포넌트를 마운트 해제하고 새 컴포넌트를 마운트하며, 그 과정에서 모든 state와 DOM 노드를 파괴합니다.

### 잘못된 예시 {/*invalid*/}

이 규칙에 대한 잘못된 코드 예시입니다.

```js
// ❌ 컴포넌트 내부에 컴포넌트 정의
function Parent() {
  const ChildComponent = () => { // 렌더링할 때마다 새 컴포넌트!
    const [count, setCount] = useState(0);
    return <button onClick={() => setCount(count + 1)}>{count}</button>;
  };

  return <ChildComponent />; // 렌더링할 때마다 state 재설정
}

// ❌ 동적 컴포넌트 생성
function Parent({type}) {
  const Component = type === 'button'
    ? () => <button>Click</button>
    : () => <div>Text</div>;

  return <Component />;
}
```

### 올바른 예시 {/*valid*/}

이 규칙에 대한 올바른 코드 예시입니다.

```js
// ✅ 모듈 레벨의 컴포넌트
const ButtonComponent = () => <button>Click</button>;
const TextComponent = () => <div>Text</div>;

function Parent({type}) {
  const Component = type === 'button'
    ? ButtonComponent  // 기존 컴포넌트 참조
    : TextComponent;

  return <Component />;
}
```

## 문제 해결 {/*troubleshooting*/}

### 조건부로 다른 컴포넌트를 렌더링해야 합니다 {/*conditional-components*/}

로컬 state에 액세스하기 위해 내부에 컴포넌트를 정의할 수 있습니다.

```js
// ❌ 잘못된 예시: 부모 state에 액세스하기 위한 내부 컴포넌트
function Parent() {
  const [theme, setTheme] = useState('light');

  function ThemedButton() { // 렌더링할 때마다 재생성!
    return (
      <button className={theme}>
        Click me
      </button>
    );
  }

  return <ThemedButton />;
}
```

대신 데이터를 props로 전달하세요.

```js
// ✅ 더 나은 방법: 정적 컴포넌트에 props 전달
function ThemedButton({theme}) {
  return (
    <button className={theme}>
      Click me
    </button>
  );
}

function Parent() {
  const [theme, setTheme] = useState('light');
  return <ThemedButton theme={theme} />;
}
```

<Note>

로컬 변수에 액세스하기 위해 다른 컴포넌트 내부에 컴포넌트를 정의하고 싶다면, 대신 props를 전달해야 한다는 신호입니다. 이렇게 하면 컴포넌트를 더 재사용 가능하고 테스트하기 쉽게 만들 수 있습니다.

</Note>
