---
title: set-state-in-render
---

<Intro>

렌더링 중에 무조건 state를 설정하는 것에 대해 검증합니다. 이는 추가 렌더링과 잠재적인 무한 렌더링 루프를 트리거할 수 있습니다.

</Intro>

## 규칙 세부 사항 {/*rule-details*/}

렌더링 중에 무조건 `setState`를 호출하면 현재 렌더링이 완료되기 전에 다른 렌더링이 트리거됩니다. 이는 앱을 충돌시키는 무한 루프를 생성합니다.

## 일반적인 위반 사례 {/*common-violations*/}

### 잘못된 예시 {/*invalid*/}

```js
// ❌ 렌더링 중에 직접 무조건 setState
function Component({value}) {
  const [count, setCount] = useState(0);
  setCount(value); // 무한 루프!
  return <div>{count}</div>;
}
```

### 올바른 예시 {/*valid*/}

```js
// ✅ 렌더링 중에 파생
function Component({items}) {
  const sorted = [...items].sort(); // 렌더링 중에 계산
  return <ul>{sorted.map(/*...*/)}</ul>;
}

// ✅ 이벤트 핸들러에서 state 설정
function Component() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}

// ✅ state를 설정하는 대신 props에서 파생
function Component({user}) {
  const name = user?.name || '';
  const email = user?.email || '';
  return <div>{name}</div>;
}

// ✅ 이전 렌더링의 props와 state로부터 조건부로 state 파생
function Component({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  const [prevItems, setPrevItems] = useState(items);
  if (items !== prevItems) { // 이 조건이 유효하게 만듭니다
    setPrevItems(items);
    setSelection(null);
  }
  // ...
}
```

## 문제 해결 {/*troubleshooting*/}

### state를 prop과 동기화하고 싶습니다 {/*clamp-state-to-prop*/}

일반적인 문제는 렌더링 후 state를 "수정"하려고 시도하는 것입니다. 카운터가 `max` prop을 초과하지 않도록 유지하고 싶다고 가정해봅시다.

```js
// ❌ 잘못된 예시: 렌더링 중에 제한
function Counter({max}) {
  const [count, setCount] = useState(0);

  if (count > max) {
    setCount(max);
  }

  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}
```

`count`가 `max`를 초과하자마자 무한 루프가 트리거됩니다.

대신 이 로직을 이벤트(state가 처음 설정되는 곳)로 이동하는 것이 더 좋습니다. 예를 들어 state를 업데이트하는 순간에 최댓값을 적용할 수 있습니다.

```js
// ✅ 업데이트할 때 제한
function Counter({max}) {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(current => Math.min(current + 1, max));
  };

  return <button onClick={increment}>{count}</button>;
}
```

이제 setter는 클릭에 대한 응답으로만 실행되고, React는 정상적으로 렌더링을 완료하며, `count`는 절대 `max`를 넘지 않습니다.

드문 경우지만 이전 렌더링의 정보를 기반으로 state를 조정해야 할 수 있습니다. 그런 경우 조건부로 state를 설정하는 [이 패턴](/reference/react/useState#storing-information-from-previous-renders)을 따르세요.
