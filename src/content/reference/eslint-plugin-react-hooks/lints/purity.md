---
title: purity
---

<Intro>

알려진 순수하지 않은 함수를 호출하지 않는지 확인하여 [컴포넌트와 Hook이 순수한지](/reference/rules/components-and-hooks-must-be-pure) 검증합니다.

</Intro>

## 규칙 세부 사항 {/*rule-details*/}

React 컴포넌트는 순수 함수여야 합니다. 동일한 props가 주어지면 항상 동일한 JSX를 반환해야 합니다. 컴포넌트가 렌더링 중에 `Math.random()`이나 `Date.now()`와 같은 함수를 사용하면 매번 다른 출력을 생성하여 React의 가정을 깨뜨리고 하이드레이션 불일치, 잘못된 메모이제이션, 예측할 수 없는 동작과 같은 버그를 발생시킵니다.

## 일반적인 위반 사례 {/*common-violations*/}

일반적으로 동일한 입력에 대해 다른 값을 반환하는 API는 이 규칙을 위반합니다. 일반적인 예시는 다음과 같습니다.

- `Math.random()`
- `Date.now()` / `new Date()`
- `crypto.randomUUID()`
- `performance.now()`

### 잘못된 예시 {/*invalid*/}

이 규칙에 대한 잘못된 코드 예시입니다.

```js
// ❌ 렌더링 중 Math.random() 사용
function Component() {
  const id = Math.random(); // 렌더링할 때마다 다름
  return <div key={id}>Content</div>;
}

// ❌ 값으로 Date.now() 사용
function Component() {
  const timestamp = Date.now(); // 렌더링할 때마다 변경됨
  return <div>생성 시각: {timestamp}</div>;
}
```

### 올바른 예시 {/*valid*/}

이 규칙에 대한 올바른 코드 예시입니다.

```js
// ✅ 초기 상태에서 안정적인 ID 생성
function Component() {
  const [id] = useState(() => crypto.randomUUID());
  return <div key={id}>Content</div>;
}
```

## 문제 해결 {/*troubleshooting*/}

### 현재 시간을 표시해야 합니다 {/*current-time*/}

렌더링 중에 `Date.now()`를 호출하면 컴포넌트가 순수하지 않게 됩니다.

```js
// ❌ 잘못된 예시: 렌더링할 때마다 시간이 변경됨
function Clock() {
  return <div>현재 시각: {Date.now()}</div>;
}
```

대신 [순수하지 않은 함수를 렌더링 외부로 이동하세요](/reference/rules/components-and-hooks-must-be-pure#components-and-hooks-must-be-idempotent).

```js
function Clock() {
  const [time, setTime] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <div>현재 시각: {time}</div>;
}
```
