---
title: unstable_addTransitionType
version: experimental
---

<Experimental>

**이 API는 실험적이며 React의 안정 버전에서는 아직 사용할 수 없습니다.**

이 API를 사용하려면 React 패키지를 가장 최신의 실험적인 버전으로 업그레이드해야 합니다.

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

실험적인 버전의 React에는 버그가 있을 수 있습니다. 프로덕션에서는 사용하지 마세요.

</Experimental>

<Intro>

`unstable_addTransitionType`는 transition의 원인을 지정할 수 있게 해줍니다.


```js
startTransition(() => {
  unstable_addTransitionType('my-transition-type');
  setState(newState);
});
```

</Intro>

<InlineToc />

---

## 레퍼런스 {/*reference*/}

### `addTransitionType` {/*addtransitiontype*/}

#### 매개변수 {/*parameters*/}

- `type`: 추가할 transition의 타입입니다. 어떤 문자열이든 될 수 있습니다.

#### 반환값 {/*returns*/}

`startTransition`은 아무것도 반환하지 않습니다.

#### 주의 사항 {/*caveats*/}

- 여러 transition이 결합되면 모든 Transition Type이 수집됩니다. Transition에 하나 이상의 타입을 추가할 수도 있습니다.
- Transition Type은 각 커밋 후에 리셋됩니다. 즉, `<Suspense>` fallback은 `startTransition` 이후의 타입들과 연관되지만, 콘텐츠를 보여주는 것은 그렇지 않습니다.

---

## 사용법 {/*usage*/}

### transition의 원인 추가하기 {/*adding-the-cause-of-a-transition*/}

transition의 원인을 나타내려면 `startTransition` 내부에서 `addTransitionType`을 호출하세요:

``` [[1, 6, "unstable_addTransitionType"], [2, 5, "startTransition", [3, 6, "'submit-click'"]]
import { startTransition, unstable_addTransitionType } from 'react';

function Submit({action) {
  function handleClick() {
    startTransition(() => {
      unstable_addTransitionType('submit-click');
      action();
    });
  }

  return <button onClick={handleClick}>Click me</button>;
}

```

<CodeStep step={2}>startTransition</CodeStep> 범위 내에서 <CodeStep step={1}>addTransitionType</CodeStep>을 호출하면, React는 <CodeStep step={3}>submit-click</CodeStep>을 Transition의 원인 중 하나로 연관시킵니다.

현재 Transition Type은 Transition을 일으킨 원인에 따라 다른 애니메이션을 사용자 정의하는 데 사용할 수 있습니다. 사용 방법으로 세 가지 다른 방식을 선택할 수 있습니다:

- [브라우저 view transition types을 사용한 애니메이션 사용자 정의](#customize-animations-using-browser-view-transition-types)
- [`View Transition` 클래스를 사용한 애니메이션 사용자 정의](#customize-animations-using-view-transition-class)
- [`ViewTransition` events를 사용한 애니메이션 사용자 정의](#customize-animations-using-viewtransition-events) 

미래에는 transition의 원인을 사용하는 더 많은 사용 사례를 지원할 계획입니다.

---
### 브라우저의 view transition types를 사용한 애니메이션 사용자 정의 {/*customize-animations-using-browser-view-transition-types*/}

transition에서 [`ViewTransition`](/reference/react/ViewTransition)이 활성화되면, React는 모든 Transition Type을 브라우저의 [view transition types](https://www.w3.org/TR/css-view-transitions-2/#active-view-transition-pseudo-examples)로 요소에 추가합니다.

이를 통해 CSS 범위에 따라 다른 애니메이션을 사용자 정의할 수 있습니다.

```js [11]
function Component() {
  return (
    <ViewTransition>
      <div>Hello</div>
    </ViewTransition>
  );
}

startTransition(() => {
  unstable_addTransitionType('my-transition-type');
  setShow(true);
});
```

```css
:root:active-view-transition-type(my-transition-type) {
  &::view-transition-...(...) {
    ...
  }
}
```

---

### `View Transition` 클래스를 사용한 애니메이션 사용자 정의 {/*customize-animations-using-view-transition-class*/}

View Transition 클래스에 객체를 전달하여 타입에 따라 활성화된 `ViewTransition`의 애니메이션을 사용자 정의할 수 있습니다.

```js
function Component() {
  return (
    <ViewTransition enter={{
      'my-transition-type': 'my-transition-class',
    }}>
      <div>Hello</div>
    </ViewTransition>
  );
}

// ...
startTransition(() => {
  unstable_addTransitionType('my-transition-type');
  setState(newState);
});
```

여러 타입이 일치하면 함께 결합됩니다. 일치하는 타입이 없으면 특별한 "default" 엔트리가 대신 사용됩니다. 어떤 타입이 "none" 값을 가지면 그것이 우선되고 ViewTransition이 비활성화됩니다(이름이 할당되지 않음).

이들은 enter/exit/update/layout/share props와 결합하여 트리거의 종류와 Transition Type에 따라 매칭할 수 있습니다.

```js
<ViewTransition enter={{
  'navigation-back': 'enter-right',
  'navigation-forward': 'enter-left',
}}
exit={{
  'navigation-back': 'exit-right',
  'navigation-forward': 'exit-left',
}}>
```

---

### `ViewTransition` events를 사용한 애니메이션 사용자 정의 {/*customize-animations-using-viewtransition-events*/}

View Transition events를 사용하여 타입에 따라 활성화된 `ViewTransition`의 애니메이션을 명령형으로 사용자 정의할 수 있습니다.

```
<ViewTransition onUpdate={(inst, types) => {
  if (types.includes('navigation-back')) {
    ...
  } else if (types.includes('navigation-forward')) {
    ...
  } else {
    ...
  }
}}>
```

이를 통해 원인에 따라 다른 명령형 Animation을 선택할 수 있습니다.

---

## Troubleshooting {/*troubleshooting*/}

### TODO {/*todo2*/}
