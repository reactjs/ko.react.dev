---
title: preserve-manual-memoization
---

<Intro>

컴파일러가 기존 수동 메모이제이션을 보존하는지 검증합니다. React 컴파일러는 추론이 [기존 수동 메모이제이션과 일치하거나 이를 초과하는 경우](/learn/react-compiler/introduction#what-should-i-do-about-usememo-usecallback-and-reactmemo)에만 컴포넌트와 Hook을 컴파일합니다.

</Intro>

## 규칙 세부 정보 {/*rule-details*/}

React 컴파일러는 기존의 `useMemo`, `useCallback` 및 `React.memo` 호출을 보존합니다. 수동으로 메모이제이션한 경우 컴파일러는 타당한 이유가 있다고 가정하고 제거하지 않습니다. 그러나 불완전한 의존성은 컴파일러가 코드의 데이터 흐름을 이해하고 추가 최적화를 적용하는 것을 방해합니다.

### 잘못된 예시 {/*invalid*/}

이 규칙에 대한 잘못된 코드 예시입니다.

```js
// ❌ useMemo에 의존성 누락
function Component({ data, filter }) {
  const filtered = useMemo(
    () => data.filter(filter),
    [data] // 'filter' 의존성 누락
  );

  return <List items={filtered} />;
}

// ❌ useCallback에 의존성 누락
function Component({ onUpdate, value }) {
  const handleClick = useCallback(() => {
    onUpdate(value);
  }, [onUpdate]); // 'value' 누락

  return <button onClick={handleClick}>Update</button>;
}
```

### 올바른 예시 {/*valid*/}

이 규칙에 대한 올바른 코드 예시입니다.

```js
// ✅ 완전한 의존성
function Component({ data, filter }) {
  const filtered = useMemo(
    () => data.filter(filter),
    [data, filter] // 모든 의존성 포함
  );

  return <List items={filtered} />;
}

// ✅ 또는 컴파일러가 처리하도록 함
function Component({ data, filter }) {
  // 수동 메모이제이션 불필요
  const filtered = data.filter(filter);
  return <List items={filtered} />;
}
```

## 문제 해결 {/*troubleshooting*/}

### 수동 메모이제이션을 제거해야 하나요? {/*remove-manual-memoization*/}

React 컴파일러가 수동 메모이제이션을 불필요하게 만드는지 궁금할 수 있습니다.

```js
// 이게 여전히 필요한가요?
function Component({items, sortBy}) {
  const sorted = useMemo(() => {
    return [...items].sort((a, b) => {
      return a[sortBy] - b[sortBy];
    });
  }, [items, sortBy]);

  return <List items={sorted} />;
}
```

React 컴파일러를 사용하는 경우 안전하게 제거할 수 있습니다.

```js
// ✅ 더 나은 방법: 컴파일러가 최적화하도록 함
function Component({items, sortBy}) {
  const sorted = [...items].sort((a, b) => {
    return a[sortBy] - b[sortBy];
  });

  return <List items={sorted} />;
}
```
