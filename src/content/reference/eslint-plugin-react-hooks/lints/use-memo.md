---
title: use-memo
---

<Intro>

`useMemo` Hook이 반환값과 함께 사용되는지 검증합니다. 자세한 내용은 [`useMemo` 문서](/reference/react/useMemo)를 참고하세요.

</Intro>

## 규칙 세부 정보 {/*rule-details*/}

`useMemo`는 비용이 많이 드는 값을 계산하고 캐싱하기 위한 것이지 부수 효과<sup>Side Effect</sup>를 위한 것이 아닙니다. 반환값이 없으면 `useMemo`는 `undefined`를 반환하여 목적을 달성하지 못하며, 잘못된 Hook을 사용하고 있음을 나타낼 가능성이 높습니다.

### 잘못된 예시 {/*invalid*/}

이 규칙에 대한 잘못된 코드 예시입니다.

```js
// ❌ 반환값 없음
function Component({ data }) {
  const processed = useMemo(() => {
    data.forEach(item => console.log(item));
    // return 누락!
  }, [data]);

  return <div>{processed}</div>; // 항상 undefined
}
```

### 올바른 예시 {/*valid*/}

이 규칙에 대한 올바른 코드 예시입니다.

```js
// ✅ 계산된 값 반환
function Component({ data }) {
  const processed = useMemo(() => {
    return data.map(item => item * 2);
  }, [data]);

  return <div>{processed}</div>;
}
```

## 문제 해결 {/*troubleshooting*/}

### 의존성이 변경될 때 부수 효과를 실행해야 합니다 {/*side-effects*/}

부수 효과<sup>Side Effect</sup>에 `useMemo`를 사용하려고 할 수 있습니다.

{/* TODO(@poteto) fix compiler validation to check for unassigned useMemos */}
```js
// ❌ 잘못된 예시: useMemo에서 부수 효과
function Component({user}) {
  // 반환값 없음, 부수 효과만
  useMemo(() => {
    analytics.track('UserViewed', {userId: user.id});
  }, [user.id]);

  // 변수에 할당되지 않음
  useMemo(() => {
    return analytics.track('UserViewed', {userId: user.id});
  }, [user.id]);
}
```

부수 효과가 사용자 상호작용에 대한 응답으로 발생해야 하는 경우 부수 효과를 이벤트와 함께 배치하는 것이 가장 좋습니다.

```js
// ✅ 좋은 예시: 이벤트 핸들러에서 부수 효과
function Component({user}) {
  const handleClick = () => {
    analytics.track('ButtonClicked', {userId: user.id});
    // 기타 클릭 로직...
  };

  return <button onClick={handleClick}>Click me</button>;
}
```

부수 효과가 React state를 외부 state와 동기화하는 경우(또는 그 반대) `useEffect`를 사용하세요.

```js
// ✅ 좋은 예시: useEffect에서 동기화
function Component({theme}) {
  useEffect(() => {
    localStorage.setItem('preferredTheme', theme);
    document.body.className = theme;
  }, [theme]);

  return <div>현재 테마: {theme}</div>;
}
```
