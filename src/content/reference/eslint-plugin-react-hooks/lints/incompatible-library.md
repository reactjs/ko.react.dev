---
title: incompatible-library
---

<Intro>

메모이제이션(수동 또는 자동)과 호환되지 않는 라이브러리 사용에 대해 검증합니다.

</Intro>

<Note>

이러한 라이브러리는 React의 메모이제이션 규칙이 완전히 문서화되기 전에 설계되었습니다. 당시에는 앱 상태가 변경될 때 컴포넌트가 적절한 반응성을 유지하도록 인체공학적인 방법을 최적화하기 위해 올바른 선택을 했습니다. 이러한 레거시 패턴은 작동했지만, 이후 React의 프로그래밍 모델과 호환되지 않는다는 것을 발견했습니다. React 규칙을 따르는 패턴을 사용하도록 이러한 라이브러리를 마이그레이션하기 위해 라이브러리 작성자와 계속 협력하고 있습니다.

</Note>

## 규칙 세부 사항 {/*rule-details*/}

일부 라이브러리는 React에서 지원하지 않는 패턴을 사용합니다. 린터가 [알려진 목록](https://github.com/facebook/react/blob/main/compiler/packages/babel-plugin-react-compiler/src/HIR/DefaultModuleTypeProvider.ts)에서 이러한 API의 사용을 감지하면 이 규칙에 따라 플래그를 지정합니다. 이는 React 컴파일러가 앱을 손상시키지 않기 위해 이러한 호환되지 않는 API를 사용하는 컴포넌트를 자동으로 건너뛸 수 있음을 의미합니다.

```js
// 이러한 라이브러리로 메모이제이션이 깨지는 예시
function Form() {
  const { watch } = useForm();

  // ❌ 'name' 필드가 변경되어도 이 값은 절대 업데이트되지 않습니다
  const name = useMemo(() => watch('name'), [watch]);

  return <div>Name: {name}</div>; // UI가 "얼어붙은" 것처럼 보입니다
}
```

React 컴파일러는 React 규칙을 따라 값을 자동으로 메모이제이션합니다. 수동 `useMemo`로 문제가 발생하면 컴파일러의 자동 최적화도 깨집니다. 이 규칙은 이러한 문제가 있는 패턴을 식별하는 데 도움이 됩니다.

<DeepDive>

#### React 규칙을 따르는 API 설계하기 {/*designing-apis-that-follow-the-rules-of-react*/}

라이브러리 API나 Hook을 설계할 때 고려해야 할 질문 중 하나는 API 호출을 `useMemo`로 안전하게 메모이제이션할 수 있는지 여부입니다. 그렇지 않다면 수동 메모이제이션과 React 컴파일러 메모이제이션 모두 사용자의 코드를 손상시킬 것입니다.

예를 들어, 이러한 호환되지 않는 패턴 중 하나는 "내부 가변성"입니다. 내부 가변성은 객체나 함수가 참조는 동일하게 유지되지만 시간이 지남에 따라 변경되는 자체 숨겨진 상태를 유지하는 것을 말합니다. 외부에서는 동일해 보이지만 내용물을 은밀하게 재배치하는 상자라고 생각하면 됩니다. React는 다른 상자를 받았는지만 확인하고 안에 무엇이 들어 있는지는 확인하지 않기 때문에 변경 사항을 알 수 없습니다. 이는 메모이제이션을 깨뜨리는데, React는 값의 일부가 변경된 경우 외부 객체(또는 함수)가 변경되는 것에 의존하기 때문입니다.

React API를 설계할 때의 경험 법칙으로, `useMemo`가 이를 깨뜨릴지 생각해보세요.

```js
function Component() {
  const { someFunction } = useLibrary();
  // 이와 같은 함수를 메모이제이션하는 것은 항상 안전해야 합니다
  const result = useMemo(() => someFunction(), [someFunction]);
}
```

대신, 불변 상태를 반환하고 명시적인 업데이트 함수를 사용하는 API를 설계하세요.

```js
// ✅ 좋은 예시: 업데이트될 때 참조가 변경되는 불변 상태를 반환
function Component() {
  const { field, updateField } = useLibrary();
  // 이것은 항상 메모이제이션하기에 안전합니다
  const greeting = useMemo(() => `Hello, ${field.name}!`, [field.name]);

  return (
    <div>
      <input
        value={field.name}
        onChange={(e) => updateField('name', e.target.value)}
      />
      <p>{greeting}</p>
    </div>
  );
}
```

</DeepDive>

### 잘못된 예시 {/*invalid*/}

이 규칙에 대한 잘못된 코드 예시입니다.

```js
// ❌ react-hook-form `watch`
function Component() {
  const {watch} = useForm();
  const value = watch('field'); // 내부 가변성
  return <div>{value}</div>;
}

// ❌ TanStack Table `useReactTable`
function Component({data}) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  // table 인스턴스가 내부 가변성을 사용합니다
  return <Table table={table} />;
}
```

<Pitfall>

#### MobX {/*mobx*/}

`observer`와 같은 MobX 패턴도 메모이제이션 가정을 깨뜨리지만, 린터는 아직 이를 감지하지 못합니다. MobX에 의존하고 있고 React 컴파일러에서 앱이 작동하지 않는다면 `"use no memo"` 지시어를 사용해야 할 수 있습니다.

```js
// ❌ MobX `observer`
const Component = observer(() => {
  const [timer] = useState(() => new Timer());
  return <span>경과된 시간: {timer.secondsPassed}</span>;
});
```

</Pitfall>

### 올바른 예시 {/*valid*/}

이 규칙에 대한 올바른 코드 예시입니다.

```js
// ✅ react-hook-form의 경우 `useWatch`를 사용하세요
function Component() {
  const {register, control} = useForm();
  const watchedValue = useWatch({
    control,
    name: 'field'
  });

  return (
    <>
      <input {...register('field')} />
      <div>현재 값: {watchedValue}</div>
    </>
  );
}
```

일부 다른 라이브러리는 아직 React의 메모이제이션 모델과 호환되는 대체 API가 없습니다. 린터가 이러한 API를 호출하는 컴포넌트나 Hook을 자동으로 건너뛰지 않는다면 [이슈를 제출](https://github.com/facebook/react/issues)하여 린터에 추가할 수 있도록 해주세요.
