---
title: error-boundaries
---

<Intro>

자식 컴포넌트의 오류에 대해 try/catch 대신 Error Boundary 사용을 검증합니다.

</Intro>

## 규칙 세부 사항 {/*rule-details*/}

try/catch 블록은 React의 렌더링 과정에서 발생하는 오류를 잡을 수 없습니다. 렌더링 메서드나 Hook에서 발생한 오류는 컴포넌트 트리를 타고 위로 전파됩니다. 오직 [Error Boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary)만이 이러한 오류를 잡을 수 있습니다.

### 잘못된 예 {/*invalid*/}

이 규칙에 대한 잘못된 코드 예시입니다.

```js
// ❌ try/catch는 렌더링 오류를 잡을 수 없음
function Parent() {
  try {
    return <ChildComponent />; // 여기서 오류가 발생하면 catch가 도움이 되지 않음
  } catch (error) {
    return <div>Error occurred</div>;
  }
}
```

### 올바른 예 {/*valid*/}

이 규칙에 대한 올바른 코드 예시입니다.

```js
// ✅ Error Boundary 사용
function Parent() {
  return (
    <ErrorBoundary>
      <ChildComponent />
    </ErrorBoundary>
  );
}
```

## 문제 해결 {/*troubleshooting*/}

### 린터가 `use`를 `try`/`catch`로 감싸지 말라고 하는 이유는 무엇인가요? {/*why-is-the-linter-telling-me-not-to-wrap-use-in-trycatch*/}

`use` Hook은 전통적인 의미에서 오류를 던지지 않고 컴포넌트 실행을 일시 중단합니다. `use`가 대기 중인 Promise를 만나면 컴포넌트를 일시 중단하고 React가 폴백을 표시하도록 합니다. Suspense와 Error Boundary만이 이러한 경우를 처리할 수 있습니다. 린터는 `catch` 블록이 절대 실행되지 않으므로 혼란을 방지하기 위해 `use` 주위의 `try`/`catch`에 대해 경고합니다.

```js
// ❌ `use` Hook 주위의 try/catch
function Component({promise}) {
  try {
    const data = use(promise); // 잡을 수 없음 - `use`는 던지지 않고 일시 중단함
    return <div>{data}</div>;
  } catch (error) {
    return <div>Failed to load</div>; // 도달 불가
  }
}

// ✅ Error Boundary가 `use` 오류를 잡음
function App() {
  return (
    <ErrorBoundary fallback={<div>Failed to load</div>}>
      <Suspense fallback={<div>Loading...</div>}>
        <DataComponent promise={fetchData()} />
      </Suspense>
    </ErrorBoundary>
  );
}

```
