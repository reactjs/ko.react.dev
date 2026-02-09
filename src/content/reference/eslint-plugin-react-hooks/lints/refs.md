---
title: refs
---

<Intro>

렌더링 중에 읽기/쓰기를 하지 않는 ref의 올바른 사용법을 검증합니다. [`useRef()` 사용법](/reference/react/useRef#usage)의 "주의하세요!" 섹션을 참고하세요.

</Intro>

## 규칙 세부 정보 {/*rule-details*/}

Ref는 렌더링에 사용되지 않는 값을 보유합니다. State와 달리 ref를 변경해도 재렌더링이 트리거되지 않습니다. 렌더링 중에 `ref.current`를 읽거나 쓰는 것은 React의 예상을 깨뜨립니다. Ref는 읽으려고 할 때 초기화되지 않았을 수 있으며, 그 값은 오래되었거나 일관되지 않을 수 있습니다.

## Ref 감지 방법 {/*how-it-detects-refs*/}

린트는 ref로 알고 있는 값에만 이러한 규칙을 적용합니다. 값은 컴파일러가 다음 패턴 중 하나를 발견하면 ref로 추론됩니다.

- `useRef()` 또는 `React.createRef()`에서 반환된 값

  ```js
  const scrollRef = useRef(null);
  ```

- `ref`로 명명되거나 `Ref`로 끝나는 식별자가 `.current`를 읽거나 쓰는 경우

  ```js
  buttonRef.current = node;
  ```

- JSX `ref` prop을 통해 전달된 경우 (예: `<div ref={someRef} />`)

  ```jsx
  <input ref={inputRef} />
  ```

무언가가 ref로 표시되면 그 추론은 할당, 구조 분해 또는 헬퍼 호출을 통해 값을 따라갑니다. 이를 통해 ref가 인수로 전달된 다른 함수 내부에서 `ref.current`에 액세스하는 경우에도 린트가 위반 사항을 찾아낼 수 있습니다.

## 일반적인 위반 사례 {/*common-violations*/}

- 렌더링 중에 `ref.current` 읽기
- 렌더링 중에 `refs` 업데이트
- State여야 하는 값에 `refs` 사용

### 잘못된 예시 {/*invalid*/}

이 규칙에 대한 잘못된 코드 예시입니다.

```js
// ❌ 렌더링 중에 ref 읽기
function Component() {
  const ref = useRef(0);
  const value = ref.current; // 렌더링 중에 읽지 마세요
  return <div>{value}</div>;
}

// ❌ 렌더링 중에 ref 수정
function Component({value}) {
  const ref = useRef(null);
  ref.current = value; // 렌더링 중에 수정하지 마세요
  return <div />;
}
```

### 올바른 예시 {/*valid*/}

이 규칙에 대한 올바른 코드 예시입니다.

```js
// ✅ Effect/핸들러에서 ref 읽기
function Component() {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      console.log(ref.current.offsetWidth); // Effect에서는 OK
    }
  });

  return <div ref={ref} />;
}

// ✅ UI 값에는 state 사용
function Component() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}

// ✅ ref 값의 지연 초기화
function Component() {
  const ref = useRef(null);

  // 첫 사용 시 한 번만 초기화
  if (ref.current === null) {
    ref.current = expensiveComputation(); // OK - 지연 초기화
  }

  const handleClick = () => {
    console.log(ref.current); // 초기화된 값 사용
  };

  return <button onClick={handleClick}>Click</button>;
}
```

## 문제 해결 {/*troubleshooting*/}

### 린트가 `.current`가 있는 일반 객체를 플래그 지정했습니다 {/*plain-object-current*/}

이름 휴리스틱은 의도적으로 `ref.current`와 `fooRef.current`를 실제 ref로 취급합니다. 커스텀 컨테이너 객체를 모델링하는 경우 다른 이름(예: `box`)을 선택하거나 가변 값을 state로 이동하세요. 이름을 변경하면 컴파일러가 ref로 추론하지 않기 때문에 린트를 피할 수 있습니다.
