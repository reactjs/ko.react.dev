---
title: set-state-in-effect
---

<Intro>

Effect에서 setState를 동기적으로 호출하는 것에 대해 검증합니다. 이는 성능을 저하시키는 재렌더링으로 이어질 수 있습니다.

</Intro>

## 규칙 세부 정보 {/*rule-details*/}

Effect 내부에서 즉시 state를 설정하면 React가 전체 렌더링 사이클을 다시 시작해야 합니다. Effect에서 state를 업데이트하면 React는 컴포넌트를 다시 렌더링하고, DOM에 변경 사항을 적용한 다음, Effect를 다시 실행해야 합니다. 이는 렌더링 중에 직접 데이터를 변환하거나 props에서 state를 파생시켜 피할 수 있었던 추가 렌더링 패스를 생성합니다. 대신 컴포넌트의 최상위 레벨에서 데이터를 변환하세요. 이 코드는 추가 렌더링 사이클을 트리거하지 않고 props나 state가 변경될 때 자연스럽게 다시 실행됩니다.

Effect에서 동기적으로 `setState`를 호출하면 브라우저가 페인트하기 전에 즉시 재렌더링이 트리거되어 성능 문제와 시각적 끊김이 발생합니다. React는 두 번 렌더링해야 합니다. 한 번은 state 업데이트를 적용하고, 또 한 번은 Effect가 실행된 후입니다. 단일 렌더링으로 동일한 결과를 얻을 수 있을 때 이러한 이중 렌더링은 낭비입니다.

많은 경우 Effect가 전혀 필요하지 않을 수도 있습니다. 자세한 내용은 [Effect가 필요하지 않을 수 있습니다](/learn/you-might-not-need-an-effect)를 참고하세요.

## 일반적인 위반 사례 {/*common-violations*/}

이 규칙은 동기적으로 setState가 불필요하게 사용되는 여러 패턴을 감지합니다.

- 로딩 상태를 동기적으로 설정
- Effect에서 props로부터 state 파생
- 렌더링 대신 Effect에서 데이터 변환

### 잘못된 예시 {/*invalid*/}

이 규칙에 대한 잘못된 코드 예시입니다.

```js
// ❌ Effect에서 동기적으로 setState
function Component({data}) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(data); // 추가 렌더링, 대신 초기 상태를 사용하세요
  }, [data]);
}

// ❌ 로딩 상태를 동기적으로 설정
function Component() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true); // 동기적, 추가 렌더링 발생
    fetchData().then(() => setLoading(false));
  }, []);
}

// ❌ Effect에서 데이터 변환
function Component({rawData}) {
  const [processed, setProcessed] = useState([]);

  useEffect(() => {
    setProcessed(rawData.map(transform)); // 렌더링 중에 파생해야 함
  }, [rawData]);
}

// ❌ props로부터 state 파생
function Component({selectedId, items}) {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setSelected(items.find(i => i.id === selectedId));
  }, [selectedId, items]);
}
```

### 올바른 예시 {/*valid*/}

이 규칙에 대한 올바른 코드 예시입니다.

```js
// ✅ 값이 ref에서 오는 경우 Effect에서 setState는 괜찮습니다
function Tooltip() {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);
}

// ✅ 렌더링 중에 계산
function Component({selectedId, items}) {
  const selected = items.find(i => i.id === selectedId);
  return <div>{selected?.name}</div>;
}
```

**기존 props나 state로부터 계산할 수 있는 경우 state에 넣지 마세요.** 대신 렌더링 중에 계산하세요. 이렇게 하면 코드가 더 빠르고 간단하며 오류가 덜 발생합니다. 자세한 내용은 [Effect가 필요하지 않을 수 있습니다](/learn/you-might-not-need-an-effect)를 참고하세요.
