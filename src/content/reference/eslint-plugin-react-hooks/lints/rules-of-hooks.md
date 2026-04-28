---
title: rules-of-hooks
---

<Intro>

컴포넌트와 Hook이 [Hook의 규칙](/reference/rules/rules-of-hooks)을 따르는지 검증합니다.

</Intro>

## 규칙 세부 사항 {/*rule-details*/}

React는 Hook이 호출되는 순서에 의존하여 렌더링 간에 state를 올바르게 보존합니다. 컴포넌트가 렌더링될 때마다 React는 정확히 같은 Hook이 정확히 같은 순서로 호출되기를 기대합니다. Hook이 조건부로 호출되거나 루프에서 호출되면 React는 어떤 state가 어떤 Hook 호출에 해당하는지 추적할 수 없게 되어 state 불일치와 "Rendered fewer/more hooks than expected" 오류 같은 버그가 발생합니다.

## 일반적인 위반 사례 {/*common-violations*/}

다음 패턴들은 Hook의 규칙을 위반합니다.

- **조건문의 Hook** (`if`/`else`, 삼항 연산자, `&&`/`||`)
- **루프의 Hook** (`for`, `while`, `do-while`)
- **조기 return 이후의 Hook**
- **콜백/이벤트 핸들러의 Hook**
- **async 함수의 Hook**
- **클래스 메서드의 Hook**
- **모듈 레벨의 Hook**

<Note>

### `use` Hook {/*use-hook*/}

`use` Hook은 다른 React Hook과 다릅니다. 조건부로 호출하거나 루프에서 호출할 수 있습니다.

```js
// ✅ `use`는 조건문에서 호출 가능
if (shouldFetch) {
  const data = use(fetchPromise);
}

// ✅ `use`는 루프에서 호출 가능
for (const promise of promises) {
  results.push(use(promise));
}
```

하지만 `use`에는 여전히 제약이 있습니다.
- `try`/`catch`로 감쌀 수 없습니다.
- 컴포넌트나 Hook 내부에서 호출해야 합니다.

더 알아보기: [`use` API 레퍼런스](/reference/react/use)

</Note>

### 잘못된 예시 {/*invalid*/}

이 규칙에 대한 잘못된 코드 예시입니다.

```js
// ❌ 조건문의 Hook
if (isLoggedIn) {
  const [user, setUser] = useState(null);
}

// ❌ 조기 return 이후의 Hook
if (!data) return <Loading />;
const [processed, setProcessed] = useState(data);

// ❌ 콜백의 Hook
<button onClick={() => {
  const [clicked, setClicked] = useState(false);
}}/>

// ❌ try/catch의 `use`
try {
  const data = use(promise);
} catch (e) {
  // 오류 처리
}

// ❌ 모듈 레벨의 Hook
const globalState = useState(0); // 컴포넌트 외부
```

### 올바른 예시 {/*valid*/}

이 규칙에 대한 올바른 코드 예시입니다.

```js
function Component({ isSpecial, shouldFetch, fetchPromise }) {
  // ✅ 최상위 레벨의 Hook
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  if (!isSpecial) {
    return null;
  }

  if (shouldFetch) {
    // ✅ `use`는 조건문에서 호출 가능
    const data = use(fetchPromise);
    return <div>{data}</div>;
  }

  return <div>{name}: {count}</div>;
}
```

## 문제 해결 {/*troubleshooting*/}

### 조건에 따라 데이터를 가져오고 싶은 경우 {/*conditional-data-fetching*/}

`useEffect`를 조건부로 호출하려고 합니다.

```js
// ❌ 조건부 Hook
if (isLoggedIn) {
  useEffect(() => {
    fetchUserData();
  }, []);
}
```

Hook을 무조건 호출하고 내부에서 조건을 확인하세요.

```js
// ✅ Hook 내부의 조건
useEffect(() => {
  if (isLoggedIn) {
    fetchUserData();
  }
}, [isLoggedIn]);
```

<Note>

`useEffect`에서 데이터를 가져오는<sup>Fetch</sup> 것보다 더 나은 방법이 있습니다. 데이터 가져오기에는 React Query, useSWR 또는 React Router 6.4+를 사용하는 것을 고려하세요. 이러한 솔루션은 요청 중복 제거, 응답 캐싱, 네트워크 워터폴 방지를 처리합니다.

더 알아보기: [데이터 가져오기](/learn/synchronizing-with-effects#fetching-data)

</Note>

### 다른 시나리오에 따라 다른 state가 필요한 경우 {/*conditional-state-initialization*/}

state를 조건부로 초기화하려고 합니다.

```js
// ❌ 조건부 state
if (userType === 'admin') {
  const [permissions, setPermissions] = useState(adminPerms);
} else {
  const [permissions, setPermissions] = useState(userPerms);
}
```

항상 `useState`를 호출하고 초기값을 조건부로 설정하세요.

```js
// ✅ 조건부 초기값
const [permissions, setPermissions] = useState(
  userType === 'admin' ? adminPerms : userPerms
);
```

## 옵션 {/*options*/}

공유 ESLint 설정을 사용하여 커스텀 Effect Hook을 설정할 수 있습니다 (`eslint-plugin-react-hooks` 6.1.1 이상에서 사용 가능).

```js
{
  "settings": {
    "react-hooks": {
      "additionalEffectHooks": "(useMyEffect|useCustomEffect)"
    }
  }
}
```

- `additionalEffectHooks`: Effect로 취급되어야 하는 커스텀 Hook을 일치시키는 정규식 패턴입니다. 이를 통해 `useEffectEvent` 및 유사한 이벤트 함수를 커스텀 Effect Hook에서 호출할 수 있습니다.

이 공유 설정은 `rules-of-hooks`와 `exhaustive-deps` 규칙 모두에서 사용되어 모든 Hook 관련 린트에서 일관된 동작을 보장합니다.
