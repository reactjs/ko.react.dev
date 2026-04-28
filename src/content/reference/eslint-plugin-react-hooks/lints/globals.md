---
title: globals
---

<Intro>

렌더링 중 전역 변수의 할당/변이를 검증합니다. 이는 [사이드 이펙트는 렌더링 외부에서 실행되어야 한다는](/reference/rules/components-and-hooks-must-be-pure#side-effects-must-run-outside-of-render) 규칙을 보완합니다.

</Intro>

## 규칙 세부 사항 {/*rule-details*/}

전역 변수는 React의 제어 범위 밖에 존재합니다. 렌더링 중에 전역 변수를 수정하면 렌더링이 순수하다는 React의 가정을 깨뜨립니다. 이로 인해 컴포넌트가 개발 환경과 프로덕션 환경에서 다르게 동작하거나, Fast Refresh가 중단되거나, React 컴파일러 같은 기능으로 앱을 최적화할 수 없게 됩니다.

### 잘못된 예시 {/*invalid*/}

이 규칙에 대한 잘못된 코드 예시입니다.

```js
// ❌ 전역 카운터
let renderCount = 0;
function Component() {
  renderCount++; // 전역 변수 변이
  return <div>Count: {renderCount}</div>;
}

// ❌ window 프로퍼티 수정
function Component({userId}) {
  window.currentUser = userId; // 전역 변이
  return <div>User: {userId}</div>;
}

// ❌ 전역 배열 push
const events = [];
function Component({event}) {
  events.push(event); // 전역 배열 변이
  return <div>Events: {events.length}</div>;
}

// ❌ 캐시 조작
const cache = {};
function Component({id}) {
  if (!cache[id]) {
    cache[id] = fetchData(id); // 렌더링 중 캐시 수정
  }
  return <div>{cache[id]}</div>;
}
```

### 올바른 예시 {/*valid*/}

이 규칙에 대한 올바른 코드 예시입니다.

```js
// ✅ 카운터에는 state 사용
function Component() {
  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    setClickCount(c => c + 1);
  };

  return (
    <button onClick={handleClick}>
      Clicked: {clickCount} times
    </button>
  );
}

// ✅ 전역 값에는 context 사용
function Component() {
  const user = useContext(UserContext);
  return <div>User: {user.id}</div>;
}

// ✅ 외부 state를 React와 동기화
function Component({title}) {
  useEffect(() => {
    document.title = title; // Effect 내에서는 OK
  }, [title]);

  return <div>Page: {title}</div>;
}
```
